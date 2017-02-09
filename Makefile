grammar.js: grammar.ne
	nearleyc grammar.ne -o grammar.js

test: grammar.js
	nearley-test -i "draft is true and id in [123 234* 45]" grammar.js
