# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

The readability of the function is severely limited, and the code is prone to bugs in several ways:
1. its repeated statements,
2. repeated implementations (hash in this case),
3. use of mutation,
4. and nested if statements.

The first step to refactor this function was to combine and rearange the predicates to remove nested ifs, and use the early exit pattern for the trivial case.

Then it's simple to extract each responsibility into its own function. This removes the repeated statements, divides each piece of business logic so it can be reasoned about individually, and removes the if statements from the orchastration function. It also gives an opportunity to add a lot of context to each function by naming it (and adding docs).

For me, a function like this is best expressed by a pipe, where you can read in plain english what the steps of the pipeline are. Hopefully it would also make it easy for the theoretical future developers to add new pieces of business logic, or side effects, by lengthening the pipeline.