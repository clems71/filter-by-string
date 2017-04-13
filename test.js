const filterByString = require('.');

const collection = [
  { id: 123, title: 'wash dishes', draft: false },
  { id: 124, title: 'wash house', draft: true },
  {
    id: 125,
    title: 'clean whiteboard',
    draft: false,
    user: { name: 'me', id: 2 }
  },
  { id: 234, title: 'water trees', draft: true, user: { name: 'me', id: 2 } },
  {
    id: 129,
    title: 'prepare burger',
    draft: false,
    user: { name: 'him', id: 8 }
  }
];

// Helper function to just return IDs
function filter(qs) {
  return filterByString(qs, collection).map(x => x.id);
}

describe('filterByString', function() {
  it('works with boolean', function() {
    filter('draft is false').should.be.deepEqual([123, 125, 129]);
    filter('draft is true').should.be.deepEqual([124, 234]);
    filter('draft is weird_string').should.be.deepEqual([]);
  });

  it('works with string glob', function() {
    filter('title is wash*').should.be.deepEqual([123, 124]);
  });

  it('works with nested fields', function() {
    filter('user.id is 2').should.be.deepEqual([125, 234]);
  });

  it('works with `in` keyword', function() {
    filter('id in [125,234]').should.be.deepEqual([125, 234]);
    filter('title in [prepare*,wash*]').should.be.deepEqual([123, 124, 129]);
  });

  it('works with `!=` keyword', function() {
    filter('draft != false').should.be.deepEqual([124, 234]);
  });

  it('works with `nin` keyword', function() {
    filter('title nin [wash*,prepare*]').should.be.deepEqual([125, 234]);
  });

  it('supports combined operations', function() {
    filter('user.id is 2 and title is wash*').should.be.deepEqual([]);
    filter('user.id is 2 and draft is true').should.be.deepEqual([234]);
  });
});
