const nearley = require('nearley');
const grammar = require('./grammar');
const _ = require('lodash');

function _eq(pattern, str) {
  if (pattern instanceof RegExp) return pattern.test(str);
  return pattern === str;
}

function _in(patterns, str) {
  for (const pattern of patterns)
    if (_eq(pattern, str)) return true;
  return false;
}

function _makeFilterFunc(str) {
  if (!str) return _.stubTrue;

  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  parser.feed(str);

  return function(x) {
    for (const condition of parser.results[0]) {
      const xVal = _.get(x, condition.key);
      const xValStr = `${xVal}`;

      switch (condition.type) {
        case 'eq':
          if (!_eq(condition.val, xValStr)) return false;
          break;

        case 'neq':
          if (_eq(condition.val, xValStr)) return false;
          break;

        case 'in':
          if (!_in(condition.val, xValStr)) return false;
          break;

        case 'nin':
          if (_in(condition.val, xValStr)) return false;
          break;

        default:
          break;
      }
    }

    return true;
  };
}

module.exports = function(str, array) {
  return _.filter(array, _makeFilterFunc(str));
};
