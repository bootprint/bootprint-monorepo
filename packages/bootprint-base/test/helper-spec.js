/* global describe */
/* global it */

var expect = require('chai').expect

var helpers = require('../handlebars/helpers.js')
var Handlebars = require('handlebars').create()
Handlebars.registerHelper(helpers)

describe('The Handlebars-helpers:', function () {
  describe('the "htmlId"-helper', function () {
    it("should replace illegal characters with '-'", function () {
      expect(Handlebars.compile('{{htmlId id}}')({ id: ';/abc' })).to.equal('--abc')
    })
  })

  describe('the "toUpperCase"-helper', function () {
    it('should convert strings to upper-case', function () {
      expect(Handlebars.compile('{{toUpperCase id}}')({ id: ';/abc' })).to.equal(';/ABC')
    })
  })

  describe('The "eachSorted"-helper', function () {
    it('should output an object in order of its keys', function () {
      expect(Handlebars.compile('{{#eachSorted .}}' +
                '(first: {{@first}}, last: {{@last}}, index: {{@index}}, length: {{@length}}, key: {{@key}})={{.}}\n' +
                '{{/eachSorted}}')({ keyB: 'valueB', keyA: 'valueA', keyC: 'valueC' }))
                .to.equal(
                '(first: true, last: false, index: 0, length: 3, key: keyA)=valueA\n' +
                '(first: false, last: false, index: 1, length: 3, key: keyB)=valueB\n' +
                '(first: false, last: true, index: 2, length: 3, key: keyC)=valueC\n'
            )
    })
  })

  describe('The "equal"-helper', function () {
    it('should return true of the two values are equal', function () {
      expect(Handlebars.compile('{{#if (equal 6 6)}}6==6{{else}}6!=6{{/if}}')({})).to.equal('6==6')
    })

    it('should return false if the two values are not equal', function () {
      expect(Handlebars.compile('{{#if (equal 7 6)}}7==6{{else}}7!=6{{/if}}')({})).to.equal('7!=6')
    })
  })

  describe('The "ifeq"-helper', function () {
    it('should call the true-block, if both values are equal', function () {
      expect(Handlebars.compile('{{#ifeq 6 6}}6==6{{else}}6!=6{{/ifeq}}')({})).to.equal('6==6')
    })

    it('should call the else-block, if both values differ', function () {
      expect(Handlebars.compile('{{#ifeq 7 6}}7==6{{else}}7!=6{{/ifeq}}')({})).to.equal('7!=6')
    })
  })

  describe('The "md"-helper', function () {
    function md (template, line) {
      return Handlebars.compile(template)({ line: line }).trim()
    }

    it('should convert markdown to HTML', function () {
      expect(md('{{md line}}', '## A header')).to.equal('<h2 id="a-header">A header</h2>')
    })

    it('should surround text with a paragraph by default', function () {
      expect(md('{{md line}}', 'a text')).to.equal('<p>a text</p>')
    })

    it('should strip the paragraph if the "stripParagraph"-option is set to true', function () {
      expect(md('{{md line stripParagraph=true}}', 'a text')).to.equal('a text')
    })

    it('render tables with borders in bootstrap styles', function () {
      var table = '| First Header  | Second Header |\n' +
                '| ------------- | ------------- |\n' +
                '| Content Cell  | Content Cell  |\n' +
                '| Content Cell  | Content Cell  |\n'

      var expected = '<table class="table table-bordered">\n' +
                '<thead>\n' +
                '<tr>\n' +
                '<th>First Header</th>\n' +
                '<th>Second Header</th>\n' +
                '</tr>\n' +
                '</thead>\n' +
                '<tbody>\n' +
                '<tr>\n' +
                '<td>Content Cell</td>\n' +
                '<td>Content Cell</td>\n' +
                '</tr>\n' +
                '<tr>\n' +
                '<td>Content Cell</td>\n' +
                '<td>Content Cell</td>\n' +
                '</tr>\n' +
                '</tbody>\n' +
                '</table>'
      expect(md('{{md line stripParagraph=true}}', table)).to.equal(expected)
    })

    it('should highlight code', function () {
      var code = '```json\n' +
                '{ "abc": "abc" }\n' +
                '```'
      var expected = '<pre><code class="lang-json">{ "<span class="hljs-attribute">abc</span>": <span class="hljs-value"><span class="hljs-string">"abc"</span> </span>}\n' +
                '</code></pre>'
      expect(md('{{md line}}', code)).to.equal(expected)
    })
  })

  describe('The "json"-helper', function () {
    it('should highlight stringified json', function () {
      var expected = '<pre><code class="lang-json">{<br>    &quot;<span class="hljs-attribute">a</span>&quot;: <span class="hljs-value"><span class="hljs-string">&quot;b&quot;</span><br></span>}\n' +
                '</code></pre>'

      expect(Handlebars.compile('{{json .}}')({a: 'b'}).trim()).to.equal(expected)
    })
  })
})
