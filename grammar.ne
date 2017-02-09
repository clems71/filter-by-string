# Query parser
# Example queries:
# - draft=true and id=342342343
# - draft is false and id in [342342343, 342342342, 342342341]

@{% const globToRegExp = require('glob-to-regexp'); %}

Main -> _ Query:? _ {% function(d) { return d[1] || [] } %}

Query -> SubQuery                                 {% function(d) { return [d[0]] } %}
       | Query __ ("and" | "&" | "+") __ SubQuery {% function(d) { return d[0].concat(d[4]) } %}

SubQuery -> Field ((__ "is" __) | (_ "=" _)) Elem {% function(d) { return { type: 'eq', key: d[0], val: d[2] } } %}
          | Field __ "in" __ List           {% function(d) { return { type: 'in', key: d[0], val: d[4] } } %}

List -> [\[(] ElemList:? [\])] {% function(d) { return d[1] || [] } %}

ElemList -> ElemList ListSep Elem {% function(d) { return d[0].concat(d[2]) } %}
          | Elem                  {% function(d) { return [d[0]] } %}

Field -> [a-zA-Z0-9_$]:+ {% function(d) { return d[0].join('') } %}

Elem -> [a-zA-Z0-9_$*]:+ {% function(d) {
  const x = d[0].join('')
  return x.includes('*') ? globToRegExp(x) : x
} %}

ListSep -> [ ,] {% function(d) {return null;} %}

 _ -> [ ]:* {% function(d) {return null;} %}
__ -> [ ]:+ {% function(d) {return null;} %}
