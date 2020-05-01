/* eslint func-names: ["error", "never"] */
/* TODO:
*  Constant Folding - Copy from Tiger
*  Strength Reduction - pick a couple
*  Unreachable Codes - pick a couple
*  Assignment Simplification
*/

const {
  Program,
  Block,
  Assignment,
  VarDeclaration,
  Print,
  Literal,
  BinaryExpression,
  IfStmt,
  WhileLoop,
  FuncDecStmt,
  FuncObject,
  Call,
  Param,
  DictExpression,
  SetExpression,
  ListExpression,
  ReturnStatement,
  IdentifierExpression,
  PostfixExpression,
  PrefixExpression,
  ForLoop,
  Ternary,
  None,
  SubscriptedVarExp,
  PowExp,
} = require('../ast')

module.exports = (program) => program.optimize()

function isZero(e) {
  return e instanceof Literal && e.value === 0
}

function isOne(e) {
  return e instanceof Literal && e.value === 1
}

function bothLiterals(b) {
  return b.left instanceof Literal && b.right instanceof Literal
}

Program.prototype.optimize = function () {
  this.stmts.forEach((stmt) => {
    stmt.optimize()
  })
}

Print.prototype.optimize = function () {
  return this
}

Block.prototype.optimize = function () {
  this.statements.forEach((s) => s.optimize())
  return this.statements.length === 1 ? this.statements[0] : this
}

VarDeclaration.prototype.optimize = function () {
  this.exp = this.exp.optimize()
  return this
}

Literal.prototype.optimize = function () {
  return this
}

IfStmt.prototype.optimize = function () {
  // TODO: this one is p spicy idk if its right
  this.tests = this.tests.map((test) => test.optimize())
  for (let i = 0; i < this.tests.length; i += 1) {
    if (this.tests[i] === false) {
      delete this.tests[i]
      delete this.consequence[i]
      i -= 1
    }
  }
  this.consequence = this.consequence.map((consequence) => consequence.optimize())
  this.alternate = this.alternate.optimize()
  if (this.tests.length === 0) {
    return this.alternate
  }
  // if (isZero(this.test)) {
  //   return this.alternate;
  // }
  return this
}

Ternary.prototype.optimize = function () {
  this.test = this.test.optimize()
  this.consequence = this.consequence.optimize()
  this.alt.optimize()
  return this
}

BinaryExpression.prototype.optimize = function () {
  this.left = this.left.optimize()
  this.right = this.right.optimize()
  if (this.op === '+' && isZero(this.right)) return this.left
  if (this.op === '+' && isZero(this.left)) return this.right
  if (this.op === '*' && isZero(this.right)) return new Literal(0)
  if (this.op === '*' && isZero(this.left)) return new Literal(0)
  if (this.op === '*' && isOne(this.right)) return this.left
  if (this.op === '*' && isOne(this.left)) return this.right
  if (bothLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value]
    if (this.op === '+') return new Literal(x + y)
    if (this.op === '*') return new Literal(x * y)
    if (this.op === '/') return new Literal(x / y)
  }
  return this
}

PowExp.prototype.optimize = function () {
  this.left = this.left.optimize()
  this.right = this.right.optimize()
  if (this.right === 0) {
    return new Literal(1)
  }
  if (this.left === 1 || this.left === 0 || this.right === 1) {
    return new Literal(this.left)
  }
  return this
}

PrefixExpression.prototype.optimize = function () {
  this.operand = this.operand.optimize()
  return this
}

IdentifierExpression.prototype.optimize = function () {
  // TODO: idk if this is right but i think we need to optimize cuz im p sure ids can be expressions
  this.id = this.id.optimize()
  return this
}

PostfixExpression.prototype.optimize = function () {
  this.operand.optimize()
  return this
}

WhileLoop.prototype.optimize = function () {
  // TODO
  this.condition = this.condition.optimize()
  if (this.condition instanceof Literal && !this.condition.value) {
    return new None()
  }
  return this
}

Assignment.prototype.optimize = function () {
  this.target = this.target.optimize()
  this.source = this.source.optimize()
  if (this.target === this.source) {
    return null
  }
  return this
}

ForLoop.prototype.optimize = function () {
  this.id = this.id.optimize()
  this.collection = this.collection.optimize()
  this.body = this.body.optimize()
  return this
}

FuncDecStmt.prototype.optimize = function () {
  // TODO: I feel like theres more to the functions but idk
  if (this.body) {
    this.body = this.body.optimize()
  }
  return this
}

FuncObject.prototype.optimize = function () {
  if (this.body) {
    this.body = this.body.optimize()
  }
  // TODO: probably more todo idk
  return this
}

Param.prototype.optimize = function () {
  return this
}

ReturnStatement.prototype.optimize = function () {
  this.returnValue = this.returnValue.optimize() // dunno if this is correct
  // -- I think this is correct but not positive
  return this
}

DictExpression.prototype.optimize = function () {
  this.exp.forEach((e) => {
    e.key.optimize()
    e.value.optimize()
  })
  return this
}

ListExpression.prototype.optimize = function () {
  this.members.map((m) => m.optimize())
  return this
}

SetExpression.prototype.optimize = function () {
  this.members.forEach((m) => m.optimize())
  return this
}

Call.prototype.optimize = function () {
  this.args.forEach((arg) => arg.optimize())
  return this
}

None.prototype.optimize = function () {
  return this
}

SubscriptedVarExp.prototype.optimize = function () {
  this.key = this.key.optimize()
  return this
}
