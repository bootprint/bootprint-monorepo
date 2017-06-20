/*!
 * customize-engine-handlebars <https://github.com/nknapp/customize-engine-handlebars>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */
'use strict'

var chai = require('chai')

var expect = chai.expect
var {augmentSingleFile, augment, hierarchy} = require('../lib/partial-details')

describe('partial-details:', function () {
  describe('the augmentSingleFile-function', function () {
    it('should return the input object with added callees', function () {
      expect(augmentSingleFile({
        path: 'path/to/file.hbs',
        contents: '{{>a}}{{#if abc}}123\n{{>b}}456{{/if}}{{> c}}'
      })).to.deep.equal({
        path: 'path/to/file.hbs',
        contents: '{{>a}}{{#if abc}}123\n{{>b}}456{{/if}}{{> c}}',
        comments: [],
        callsPartial: [{name: 'a', line: 1}, {name: 'b', line: 2}, {name: 'c', line: 2}]
      })
    })

    it('should add the first block comment as comment-property', function () {
      expect(augmentSingleFile({
        path: 'path/to/file.hbs',
        contents: '{{!-- The first block comment\n@apidoc\n@param {string} name --}}abc{{!-- The second comment --}}'
      })).to.deep.equal({
        path: 'path/to/file.hbs',
        contents: '{{!-- The first block comment\n@apidoc\n@param {string} name --}}abc{{!-- The second comment --}}',
        callsPartial: [],
        comments: [
          'The first block comment\n@apidoc\n@param {string} name',
          'The second comment'
        ]
      })
    })
  })

  describe('the augment-function', function () {
    it('should return the input object with added callees and callers', function () {
      expect(augment({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: 'a{{>p1}}a'
          },
          'dir/b.txt': {
            path: 'src/dir/b.txt.hbs',
            contents: 'b{{>p2}}b'
          }
        },
        partials: {
          'p1': {
            path: 'src/prt/p1.hbs',
            contents: 'p1 {{>p2 }} p1'
          },
          'p2': {
            path: 'src/prt/p2.hbs',
            contents: 'p2'
          }
        }
      })).to.deep.equal({
        'partials': {
          'p1': {
            'calledBy': [
              {
                'line': 1,
                'name': 'dir/a.txt',
                'path': 'src/dir/a.txt.hbs',
                'type': 'template'
              }
            ],
            'callsPartial': [
              {
                'line': 1,
                'name': 'p2'
              }
            ],
            'comments': [],
            'contents': 'p1 {{>p2 }} p1',
            'path': 'src/prt/p1.hbs'
          },
          'p2': {
            'calledBy': [
              {
                'line': 1,
                'name': 'dir/b.txt',
                'path': 'src/dir/b.txt.hbs',
                'type': 'template'
              },
              {
                'line': 1,
                'name': 'p1',
                'path': 'src/prt/p1.hbs',
                'type': 'partial'
              }
            ],
            'callsPartial': [],
            'comments': [],
            'contents': 'p2',
            'path': 'src/prt/p2.hbs'
          }
        },
        'templates': {
          'dir/a.txt': {
            'callsPartial': [
              {
                'line': 1,
                'name': 'p1'
              }
            ],
            'comments': [],
            'contents': 'a{{>p1}}a',
            'path': 'src/dir/a.txt.hbs'
          },
          'dir/b.txt': {
            'callsPartial': [
              {
                'line': 1,
                'name': 'p2'
              }
            ],
            'comments': [],
            'contents': 'b{{>p2}}b',
            'path': 'src/dir/b.txt.hbs'
          }
        }
      })
    })

    it('should throw on missing partials', function () {
      expect(() => augment({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: 'a {{>p1}} a'
          }
        },
        partials: {}
      })).to.throw('Missing partial "p1"')
    })
  })

  describe('the hierarchy-function', function () {
    it('should include the partials called by a template', function () {
      expect(hierarchy({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: 'a {{>p1}} {{>p2}} a'
          }
        },
        partials: {
          'p1': {
            path: 'src/prt/p1.hbs',
            contents: 'p1'
          },
          'p2': {
            path: 'src/prt/p2.hbs',
            contents: 'p2'
          }
        }
      })).to.deep.equal({
        children: [
          {
            'name': 'dir/a.txt',
            'path': 'src/dir/a.txt.hbs',
            'type': 'template',
            'comments': [],
            'children': [{
              'name': 'p1',
              'path': 'src/prt/p1.hbs',
              'type': 'partial',
              'comments': [],
              'cycleFound': undefined,
              'children': []
            }, {
              'name': 'p2',
              'path': 'src/prt/p2.hbs',
              'type': 'partial',
              'comments': [],
              'cycleFound': undefined,
              'children': []
            }]
          }
        ]
      })
    })

    it('should throw on missing partials', function () {
      expect(() => hierarchy({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: 'a {{>p1}} a'
          }
        },
        partials: {}
      })).to.throw('Missing partial "p1"')
    })

    it('should include comments for the tempalte and the partials', function () {
      expect(hierarchy({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: '{{!-- template a --}}\na {{>p1}} a'
          }
        },
        partials: {
          'p1': {
            path: 'src/prt/p1.hbs',
            contents: '{{!-- partial 1 --}}\np1'
          }
        }
      })).to.deep.equal({
        children: [
          {
            'name': 'dir/a.txt',
            'path': 'src/dir/a.txt.hbs',
            'type': 'template',
            'comments': ['template a'],
            'children': [{
              'name': 'p1',
              'path': 'src/prt/p1.hbs',
              'type': 'partial',
              'comments': ['partial 1'],
              'cycleFound': undefined,
              'children': []
            }]
          }
        ]
      })
    })

    it('should include multiple partials', function () {
      expect(hierarchy({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: 'a {{>p1}} a'
          },
          'dir/b.txt': {
            path: 'src/dir/b.txt.hbs',
            contents: 'b {{>p1}} b'
          }
        },
        partials: {
          'p1': {
            path: 'src/prt/p1.hbs',
            contents: 'p1'
          }
        }
      })).to.deep.equal({
        children: [
          {
            'name': 'dir/a.txt',
            'path': 'src/dir/a.txt.hbs',
            'type': 'template',
            'comments': [],
            'children': [{
              'name': 'p1',
              'path': 'src/prt/p1.hbs',
              'type': 'partial',
              'comments': [],
              'cycleFound': undefined,
              'children': []
            }]
          }, {
            'name': 'dir/b.txt',
            'path': 'src/dir/b.txt.hbs',
            'type': 'template',
            'comments': [],
            'children': [{
              'name': 'p1',
              'path': 'src/prt/p1.hbs',
              'type': 'partial',
              'comments': [],
              'cycleFound': undefined,
              'children': []
            }]
          }
        ]
      })
    })

    it('should break cycles', function () {
      expect(hierarchy({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: 'a {{>p1}} a'
          }
        },
        partials: {
          'p1': {
            path: 'src/prt/p1.hbs',
            contents: 'p1 {{>p2 }} p1'
          },
          'p2': {
            path: 'src/prt/p2.hbs',
            contents: 'p2 {{>p1 }} p2'
          }
        }
      })).to.deep.equal({
        children: [
          {
            'name': 'dir/a.txt',
            'path': 'src/dir/a.txt.hbs',
            'type': 'template',
            'comments': [],
            'children': [{
              'name': 'p1',
              'path': 'src/prt/p1.hbs',
              'type': 'partial',
              'comments': [],
              'cycleFound': undefined,
              'children': [{
                'name': 'p2',
                'path': 'src/prt/p2.hbs',
                'type': 'partial',
                'comments': [],
                'cycleFound': undefined,
                'children': [{
                  'name': 'p1',
                  'path': 'src/prt/p1.hbs',
                  'type': 'partial',
                  'comments': [],
                  'cycleFound': true,
                  'children': undefined
                }]
              }]
            }]
          }
        ]
      })
    })

    it('should break cycles when a partial is called twice in the cycle', function () {
      expect(hierarchy({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: 'a {{>p1}} a'
          }
        },
        partials: {
          'p1': {
            path: 'src/prt/p1.hbs',
            contents: 'p1 {{>p1}} {{>p1}} p1'
          }
        }
      })).to.deep.equal({
        children: [
          {
            'name': 'dir/a.txt',
            'path': 'src/dir/a.txt.hbs',
            'type': 'template',
            'comments': [],
            'children': [{
              'name': 'p1',
              'path': 'src/prt/p1.hbs',
              'type': 'partial',
              'comments': [],
              'cycleFound': undefined,
              'children': [{
                'name': 'p1',
                'path': 'src/prt/p1.hbs',
                'type': 'partial',
                'comments': [],
                'cycleFound': true,
                'children': undefined
              }]
            }]
          }
        ]
      })
    })

    it('should allow calling the same partial twice', function () {
      expect(hierarchy({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: 'a {{>p1}} {{>p1}} a'
          }
        },
        partials: {
          'p1': {
            path: 'src/prt/p1.hbs',
            contents: 'p1'
          }
        }
      })).to.deep.equal({
        children: [
          {
            'name': 'dir/a.txt',
            'path': 'src/dir/a.txt.hbs',
            'type': 'template',
            'comments': [],
            'children': [{
              'name': 'p1',
              'path': 'src/prt/p1.hbs',
              'type': 'partial',
              'comments': [],
              'cycleFound': undefined,
              'children': []
            }]
          }
        ]
      })
    })
    it('should allow calling the same partial twice', function () {
      expect(hierarchy({
        templates: {
          'dir/a.txt': {
            path: 'src/dir/a.txt.hbs',
            contents: 'a {{>p1}} {{>p1}} a'
          }
        },
        partials: {
          'p1': {
            path: 'src/prt/p1.hbs',
            contents: 'p1'
          }
        }
      })).to.deep.equal({
        children: [
          {
            'name': 'dir/a.txt',
            'path': 'src/dir/a.txt.hbs',
            'type': 'template',
            'comments': [],
            'children': [{
              'name': 'p1',
              'path': 'src/prt/p1.hbs',
              'type': 'partial',
              'comments': [],
              'cycleFound': undefined,
              'children': []
            }]
          }
        ]
      })
    })
  })
})
