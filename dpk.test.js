const { deterministicPartitionKey } = require("./dpk");

const STRING_ZERO = "0";
const ACCEPTABLE_LENGTH = 256;

const expectValidPartitionKey = (value) => {
  expect(value).not.toBe(STRING_ZERO);
  expect(typeof value).toBe("string");
  expect(value).toBeTruthy();
  expect(value.length).toBeLessThan(ACCEPTABLE_LENGTH);
  return value;
};

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe(STRING_ZERO);
  });

  it("Returns the literal '0' when given falsey input", () => {
    [null, 0, undefined, false, NaN, ""].forEach((value) => {
      const partitionKey = deterministicPartitionKey(value);
      expect(partitionKey).toBe(STRING_ZERO);
    });
  });

  it("Returns a key when given an object", () => {
    const partitionKey = deterministicPartitionKey({});
    expectValidPartitionKey(partitionKey);
  });

  it("Returns the same result if a similar object is passed in", () => {
    const partitionKey = deterministicPartitionKey({});
    const partitionKey2 = deterministicPartitionKey({});
    expect(expectValidPartitionKey(partitionKey)).toEqual(
      expectValidPartitionKey(partitionKey2)
    );
  });

  it("Returns different results when different objects are passed in", () => {
    const partitionKey = deterministicPartitionKey({ a: 1 });
    const partitionKey2 = deterministicPartitionKey({ a: 2 });
    expect(expectValidPartitionKey(partitionKey)).not.toEqual(
      expectValidPartitionKey(partitionKey2)
    );
  });

  it("Returns a valid key when an object with the partitionKey field is inputted", () => {
    const partitionKey = deterministicPartitionKey({ partitionKey: "abc" });
    expect(expectValidPartitionKey(partitionKey));
  });

  it("Returns the same result when different objects with the same partitionKey field are used", () => {
    const partitionKey = deterministicPartitionKey({
      partitionKey: "abc",
      disc: "def",
    });
    const partitionKey2 = deterministicPartitionKey({
      partitionKey: "abc",
      disc: "zyx",
    });
    expect(expectValidPartitionKey(partitionKey)).toEqual(
      expectValidPartitionKey(partitionKey2)
    );
  });

  it("Returns a different result when objects with a different partitionKey field are used", () => {
    const partitionKey = deterministicPartitionKey({
      partitionKey: "abc",
      disc: "def",
    });
    const partitionKey2 = deterministicPartitionKey({
      partitionKey: "xyz",
      disc: "def",
    });
    expect(expectValidPartitionKey(partitionKey)).not.toEqual(
      expectValidPartitionKey(partitionKey2)
    );
  });

  it("Returns a valid key when an object with partitionKey field is used, but it is not a string", () => {
    const partitionKey = deterministicPartitionKey({ partitionKey: 98237465 });
    expect(expectValidPartitionKey(partitionKey));
  });

  it("Returns a valid key when an object with partitionKey field is used, but it is an object", () => {
    const partitionKey = deterministicPartitionKey({
      partitionKey: { name: "fields" },
    });
    expect(expectValidPartitionKey(partitionKey));
  });

  it("Returns a key with appropriate length when a very long partitionKey is used as input", () => {
    const longString = Array.from(new Array(1025)).join("b");
    expect(longString.length).toBe(1024);

    const partitionKey = deterministicPartitionKey({
      partitionKey: longString,
    });
    expect(expectValidPartitionKey(partitionKey));
  });
});
