const crypto = require("crypto");

/**
 * Helper function to create a pipe.
 *
 * Functions will be run from left to right, passing the output
 * of each previous function into the next function.
 * @param  {...(T) => K} fns A parameter list of functions.
 * @returns A new function which accepts a parameter to be passed into the pipe.
 */
const pipe =
  (...fns) =>
  (start) =>
    fns.reduce((param, cur) => cur(param), start);

/**
 * Internalization of config for our hash implementation.
 * @param {crypto.BinaryLike} value Input data.
 * @returns {string} The digest string.
 */
const hash = (value) =>
  crypto.createHash("sha3-512").update(value).digest("hex");

/**
 * Closes over a hash implementation and decides how to treat the input.
 *
 * Try to use the event.partitionKey, when it exists.
 * Otherwise fallback to a string representation of the event.
 * @param {typeof hash} hash A hash function.
 * @returns {any} A candidate.
 */
const extractInput = (hash) => (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  if (!event) return TRIVIAL_PARTITION_KEY;

  if (event?.partitionKey) return event.partitionKey;

  return hash(JSON.stringify(event));
};

/**
 * Applies a stringification function when candidate is not a string.
 * @param {*} candidate A potential partition key.
 * @returns {string} A string version of the candidate.
 */
const ensureCandidateType = (candidate) =>
  typeof candidate === "string" ? candidate : JSON.stringify(candidate);

/**
 * Generates a new hash when the candidate length is too long.
 * @param {typeof hash} hash A hash function.
 * @returns
 */
const ensureMaxLength = (hash) => (candidate) => {
  const MAX_PARTITION_KEY_LENGTH = 256;
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) return hash(candidate);

  return candidate;
};

/**
 * Generate a partition key.
 *
 * The same key will be generated given the same input.
 *
 * Strictly speaking, determinism is based on:
 * 1. the start.partitionKey being truthy and being the same, or
 * 2. the string representation of start being the same, or
 * 3. start being falsey.
 * @param {{ partitionKey?: any }} start
 * @returns {string}
 */
exports.deterministicPartitionKey = pipe(
  extractInput(hash),
  ensureCandidateType,
  ensureMaxLength(hash)
);
