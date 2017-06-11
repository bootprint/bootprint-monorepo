```json
{
  "handlebars": {
    "partials": {
      "dir/drei.hbs": {
        "path": "handlebars/partials/dir/drei.hbs",
        "contents": "trois"
      },
      "eins.hbs": {
        "path": "handlebars/partials/eins.hbs",
        "contents": "one"
      },
      "zwei.hbs": {
        "path": "handlebars/partials/zwei.hbs",
        "contents": "two {{>dir/drei}} "
      }
    },
    "templates": {
      "index.html.hbs": {
        "path": "handlebars/templates/index.html.hbs",
        "contents": "<html>\n<body>\n<h1>{{title}}</h1>\n\n{{> eins}}\n<hr>\n{{> zwei}}\n\n</body>\n</html>"
      }
    },
    "data": {},
    "hbsOptions": {},
    "partialWrapper": [],
    "helpers": [
      "/home/nknappmeier/projects/bootprint/thought-plugin-bootprint/examples/example-project/handlebars/helpers.js",
      null
    ],
    "preprocessor": []
  },
  "less": {
    "main": [
      "/home/nknappmeier/projects/bootprint/thought-plugin-bootprint/examples/example-project/less/main.less"
    ],
    "paths": [
      "/home/nknappmeier/projects/bootprint/thought-plugin-bootprint/examples/example-project/less/imports"
    ]
  },
  "_metadata": {
    "modules": []
  }
}
```


# Templates

### index.html.hbs

(<a href="">
        jump to source in <code>example-project@1.0.0</code>
    </a>)
```hbs
<html>
<body>
<h1>{{title}}</h1>

{{> eins}}
<hr>
{{> zwei}}

</body>
</html>
```

# Partials

### dir/drei.hbs

(<a href="">
        jump to source in <code>example-project@1.0.0</code>
    </a>)
```hbs
trois
```
### eins.hbs

(<a href="">
        jump to source in <code>example-project@1.0.0</code>
    </a>)
```hbs
one
```
### zwei.hbs

(<a href="">
        jump to source in <code>example-project@1.0.0</code>
    </a>)
```hbs
two {{>dir/drei}} 
```
     

# Helpers 

(from [example-project@1.0.0/handlebars/helpers.js]())

<a name="shout"></a>

## shout(text) ⇒ <code>string</code>
Make a string louder uppercase

**Kind**: global function  
**Returns**: <code>string</code> - the string in uppercase  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | the string |




# Inlined helpers 
    
*Some helpers are defined directly in the configuration and not via path-reference to a module.
The docs for these helpers cannot be generated and are missing on this page.
If you are the author of this package, please consider putting the helpers into a distinct file
and adding only the path to the configuration.*
    


# LESS files

* [example-project@1.0.0/less/main.less]()  
    
# LESS include paths

[example-project@1.0.0/less/imports]()


