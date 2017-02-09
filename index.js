const nearley = require('nearley')
const grammar = require('./grammar')
const R = require('ramda')

function _eq (pattern, str) {
  if (pattern instanceof RegExp) return R.test(pattern, str)
  return pattern === str
}

function _in (patterns, str) {
  for (const pattern of patterns) if (_eq(pattern, str)) return true
  return false
}

function _makeFilterFunc (str) {
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  parser.feed(str)

  return function (x) {
    for (const condition of parser.results[0]) {
      const xVal = R.prop(condition.key, x)
      const xValStr = `${xVal}`

      switch (condition.type) {
        case 'eq':
          if (!_eq(condition.val, xValStr)) return false
          break

        case 'in':
          if (!_in(condition.val, xValStr)) return false
          break
      }
    }

    return true
  }
}

module.exports = function (str, array) {
  return R.filter(_makeFilterFunc(str), array)
}
