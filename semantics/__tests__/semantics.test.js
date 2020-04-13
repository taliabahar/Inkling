/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const program = String.raw`
c is List<Text> ["this", "2", "b"]
`;

describe("The semantic analyzer", () => {
  test("accepts the mega program with all syntactic forms", (done) => {
    const astRoot = parse(program);
    expect(astRoot).toBeTruthy();
    console.log("analyze : ", analyze);
    analyze(astRoot);
    expect(astRoot).toBeTruthy();
    done();
  });
});
//TESTED
// b is Num 5
// a is always Text  "Hello"
// c is Set<Text> {"this", "a", "b"}
//c is List<Text> ["this", "a", "b"]
// b is 7

// TO TEST

// b is Text "hello this is some sample text"
// c is List<Text> ["this", "a", b]
// d is Dict<Num, Num> [5:6, 3:4]
// e is Set<Num> {1, 2, 3, 5, 6}
// e is {3, 5, 6}

// f is Bool true
// g is Num 3
// if (f) {
//   display(a)
// } else {
//   display(g + a)
// }
// function f (h is Num, i is Num) is Num {
//   j is Num 0
//   while (j < 5) {
//     display pow(j, (pow(3, j)))
//   }
//   a is a + h + i
//   gimme a
// }
// j is Num f(3, 2)
