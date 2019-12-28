
### Customizing configurations

We can use the mechanism of [customize](https://npmjs.com/package/customize) to adapt the configuration.
In the following example, we replace the `footer.hbs`-partial by a different version.
We do this by specifying a new partial directory. Partials with the same name as in 
the previous directory will overwrite the old one.

```js
const customize = require('customize')
customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      partials: 'partials2'
    }
  })
  .run()
  .then(console.log)
```

The new `footer.hbs` writes only the current temperature, instead of the weather description

```hbs
------
Blog: {{{github.blog}}}

```


The output of this example is

```
{
  "handlebars": {
    "subdir/text3.txt": "------\nBlog: https://blog.knappi.org\n",
    "text1.txt": "I'm nknapp\n\nI'm living in Darmstadt.\n\n------\nBlog: https://blog.knappi.org\n",
    "text2.txt": "I'm nknapp\n\nI'm living in DARMSTADT.\n\n------\nBlog: https://blog.knappi.org\n"
  }
}
```

In a similar fashion, we could replace other parts of the configuration, like templates, helpers
and the pre-processor. If we would provide a new preprocessor, it could call the old one,
by calling `this.parent(args)`

### Name of the current target-file

In some cases, we need to know which file we are actually rendering at the moment.
If we are rendering the template `some/template.txt.hbs`, the file `some/template.txt`
will be written (at least if [customize-write-files](https://npmjs.com/package/customize-write-files) is used. If we want to
create relative links from this file, we need this information within helpers.
The parameter `options.customize.targetFile` that is passed to each helper, contains this information.
The following configuration registers a helper that return the targetFile:

```js
const customize = require('customize')
customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      templates: 'templates',
      partials: 'partials-targetFile',
      helpers: {
        // Helper that returns the targetFile
        targetFile: function(options) {
          return options.customize.targetFile
        }
      }
    }
  })
  .run()
  .then(console.log)
```

Each template includes the `{{>footer}}`-partial, which calls the `{{targetFile}}`-helper
to include the name of the current file.

```hbs
------
File: {{targetFile}}
```


The output of this configuration is

```
{
  "handlebars": {
    "subdir/text3.txt": "------\nFile: subdir/text3.txt",
    "text1.txt": "I'm nknapp\n\nI'm living in Darmstadt.\n\n------\nFile: text1.txt",
    "text2.txt": "I'm nknapp\n\nI'm living in DARMSTADT.\n\n------\nFile: text2.txt"
  }
}
```

### Accessing engine and configuration helpers

The configuration and the engine itself is passed as additional option into each helper call:

```
module.exports = {
    function(value, options) {
        console.log("handlebars", options.customize.engine)
        console.log("customizeConfig", options.customize.config)
    }
}
```

### Which partial generates what? (Method 1)

When we want to overriding parts of the output, we are looking for the correct partial to do so. 
For this purpose, the engine allows to specify a "wrapper function" for partials. This function
is called with the contents and the name of a partial and returns the new content. Programs like
`Thought` can optionally include the partial names into the output to show the user which partial
to override in order to modify a given part of the output.


```js
const customize = require('customize')
customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      partials: 'partials2',
      partialWrapper: function(contents, name) {
        return '[BEGIN ' + name + ']\n' + contents + '[END ' + name + ']'
      }
    }
  })
  .run()
  .then(console.log)
```

```
{
  "handlebars": {
    "subdir/text3.txt": "[BEGIN footer]\n------\nBlog: https://blog.knappi.org\n[END footer]",
    "text1.txt": "I'm nknapp\n\nI'm living in Darmstadt.\n\n[BEGIN footer]\n------\nBlog: https://blog.knappi.org\n[END footer]",
    "text2.txt": "I'm nknapp\n\nI'm living in DARMSTADT.\n\n[BEGIN footer]\n------\nBlog: https://blog.knappi.org\n[END footer]"
  }
}
```

### Which partial generates what? (Method 2)

Another method for gathering information about the source of parts of the output are source-locators. 
The engine incoorporates the library [handlebars-source-locators](https://npmjs.com/package/handlebars-source-locators) to integrate a kind of 
"source-map for the poor" into the output. Source-locators are activated by setting the option
`addSourceLocators` to `true`:

```js
const customize = require('customize')
customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      partials: 'partials2',
      addSourceLocators: true
    }
  })
  .run()
  .then(console.log)
```

The output contain tags that contain location-information of the succeeding text:

* `<sl line="1" col="12" file="templates/text1.txt.hbs"></sl>text...` for text the originate from a template file
* `<sl line="1" col="0" partial="footer" file="partials2/footer.hbs"></sl>text...` for text the originate from a partial

Example output:

```
{
  "handlebars": {
    "subdir/text3.txt": "<sl line=\"1\" col=\"0\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>------\nBlog: <sl line=\"2\" col=\"6\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>https://blog.knappi.org<sl line=\"2\" col=\"23\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>\n<sl line=\"3\" col=\"0\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>",
    "text1.txt": "<sl line=\"1\" col=\"0\" file=\"templates/text1.txt.hbs\"></sl>I'm <sl line=\"1\" col=\"4\" file=\"templates/text1.txt.hbs\"></sl>nknapp<sl line=\"1\" col=\"12\" file=\"templates/text1.txt.hbs\"></sl>\n\nI'm living in <sl line=\"3\" col=\"14\" file=\"templates/text1.txt.hbs\"></sl>Darmstadt<sl line=\"3\" col=\"22\" file=\"templates/text1.txt.hbs\"></sl>.\n\n<sl line=\"5\" col=\"0\" file=\"templates/text1.txt.hbs\"></sl><sl line=\"1\" col=\"0\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>------\nBlog: <sl line=\"2\" col=\"6\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>https://blog.knappi.org<sl line=\"2\" col=\"23\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>\n<sl line=\"3\" col=\"0\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>",
    "text2.txt": "<sl line=\"1\" col=\"0\" file=\"templates/text2.txt.hbs\"></sl>I'm <sl line=\"1\" col=\"4\" file=\"templates/text2.txt.hbs\"></sl>nknapp<sl line=\"1\" col=\"12\" file=\"templates/text2.txt.hbs\"></sl>\n\nI'm living in <sl line=\"3\" col=\"14\" file=\"templates/text2.txt.hbs\"></sl>DARMSTADT<sl line=\"3\" col=\"28\" file=\"templates/text2.txt.hbs\"></sl>.\n\n<sl line=\"5\" col=\"0\" file=\"templates/text2.txt.hbs\"></sl><sl line=\"1\" col=\"0\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>------\nBlog: <sl line=\"2\" col=\"6\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>https://blog.knappi.org<sl line=\"2\" col=\"23\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>\n<sl line=\"3\" col=\"0\" partial=\"footer\" file=\"partials2/footer.hbs\"></sl>"
  }
}
```

### Asynchronous helpers

The `customize-engine-handlebars` uses the [promised-handlebars](https://npmjs.com/package/promised-handlebars) package as wrapper around Handlebars.
It allows helpers to return promises instead of real values.


## Documenting configurations

It is not possible to generate docs directly with ``. But using the `docEngine`,
you can generate a JSON that you can render to HTML or Markdown (for example using Handlebars).

```js
const customize = require('customize')
customize()
  .registerEngine('handlebars', require('customize-engine-handlebars').docEngine)
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      partials: 'partials2'
    }
  })
  .run()
  .then(console.log)
```

The `docEngine` performs different transformations on the input configuration. For example,
helpers are not loaded, but the path to the file is collected into an array.

```
{
  "handlebars": {
    "callHierarchy": {
      "children": [
        {
          "children": [
            {
              "children": [
              ],
              "comments": [
              ],
              "name": "footer",
              "path": "partials2/footer.hbs",
              "type": "partial"
            }
          ],
          "comments": [
          ],
          "name": "subdir/text3.txt",
          "path": "templates/subdir/text3.txt.hbs",
          "type": "template"
        },
        {
          "children": [
            {
              "children": [
              ],
              "comments": [
              ],
              "name": "footer",
              "path": "partials2/footer.hbs",
              "type": "partial"
            }
          ],
          "comments": [
          ],
          "name": "text1.txt",
          "path": "templates/text1.txt.hbs",
          "type": "template"
        },
        {
          "children": [
            {
              "children": [
              ],
              "comments": [
              ],
              "name": "footer",
              "path": "partials2/footer.hbs",
              "type": "partial"
            }
          ],
          "comments": [
          ],
          "name": "text2.txt",
          "path": "templates/text2.txt.hbs",
          "type": "template"
        }
      ]
    },
    "data": {
      "city": "Darmstadt",
      "name": "nknapp"
    },
    "hbsOptions": {
    },
    "helpers": [
      "hb-helpers.js"
    ],
    "partialWrapper": [
    ],
    "partials": {
      "footer": {
        "calledBy": [
          {
            "line": 1,
            "name": "subdir/text3.txt",
            "path": "templates/subdir/text3.txt.hbs",
            "type": "template"
          },
          {
            "line": 5,
            "name": "text1.txt",
            "path": "templates/text1.txt.hbs",
            "type": "template"
          },
          {
            "line": 5,
            "name": "text2.txt",
            "path": "templates/text2.txt.hbs",
            "type": "template"
          }
        ],
        "callsPartial": [
        ],
        "comments": [
        ],
        "contents": "------\nBlog: {{{github.blog}}}\n",
        "path": "partials2/footer.hbs"
      }
    },
    "preprocessor": [
      "hb-preprocessor.js"
    ],
    "templates": {
      "subdir/text3.txt": {
        "callsPartial": [
          {
            "line": 1,
            "name": "footer"
          }
        ],
        "comments": [
        ],
        "contents": "{{>footer}}",
        "path": "templates/subdir/text3.txt.hbs"
      },
      "text1.txt": {
        "callsPartial": [
          {
            "line": 5,
            "name": "footer"
          }
        ],
        "comments": [
        ],
        "contents": "I'm {{name}}\n\nI'm living in {{city}}.\n\n{{>footer}}",
        "path": "templates/text1.txt.hbs"
      },
      "text2.txt": {
        "callsPartial": [
          {
            "line": 5,
            "name": "footer"
          }
        ],
        "comments": [
        ],
        "contents": "I'm {{name}}\n\nI'm living in {{shout city}}.\n\n{{>footer}}",
        "path": "templates/text2.txt.hbs"
      }
    }
  }
}
```


