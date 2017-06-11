[back to README.md](../README.md)

## Configuration 

This plugin applies the following configuration


### Templates

#### [docs/api.md.hbs](src/templates/docs/api.md.hbs)

```hbs
{{#moduleConfig}}
{{json .}}

# Templates

{{#each handlebars.templates}}
{{>thought-plugin-bootprint/hbs-file.md name=@key}}
{{/each}}

# Partials

{{#each handlebars.partials}}
{{>thought-plugin-bootprint/hbs-file.md name=@key}}    
{{/each}}
     
{{#each handlebars.helpers}}

{{#if .}}
# Helpers 

(from {{#withPackageOf .}}[{{@package.name}}@{{@package.version}}/{{@relativePath}}]({{@url}}){{/withPackageOf}})

{{jsdoc .}}
{{else}}
# Inlined helpers 
    
*Some helpers are defined directly in the configuration and not via path-reference to a module.
The docs for these helpers cannot be generated and are missing on this page.
If you are the author of this package, please consider putting the helpers into a distinct file
and adding only the path to the configuration.*
    
{{/if}}

{{/each}}

# LESS files

{{#each less.main}}
* {{#withPackageOf .}}[{{@package.name}}@{{@package.version}}/{{@relativePath}}]({{@url}}){{/withPackageOf}}  
{{/each}}
    
# LESS include paths

{{#each less.paths}}
{{#withPackageOf .}}[{{@package.name}}@{{@package.version}}/{{@relativePath}}]({{@url}}){{/withPackageOf}}
{{/each}}


{{/moduleConfig}}
```    


### Partials

#### [api.md.hbs](src/partials/api.md.hbs)

```hbs
# API

see [docs/api.md](docs/api.md)

```
#### [thought-plugin-bootprint/hbs-file.md.hbs](src/partials/thought-plugin-bootprint/hbs-file.md.hbs)

```hbs
{{!-- 
   Partial for including bootprint Handlebars-files into the documentation
   @param {string} name the filename
   @param {string} path the full path to the file
   @param {string} contents the file's contents
--}}
### {{name}}

{{#withPackageOf path~}}
    (<a href="{{@url}}">
        jump to source in <code>{{@package.name}}@{{@package.version}}</code>
    </a>)
{{~/withPackageOf}}

{{#codeBlock lang='hbs'}}
{{contents}}
{{/codeBlock}}


```
#### [usage.md.hbs](src/partials/usage.md.hbs)

````hbs
## Usage

{{#if (exists 'examples')}}

After installing {{npm 'bootprint'}} and this package globally, you can run bootprint with the command

```bash
bootprint {{name}} example.json target
```

where `example.json` has the contents

{{include 'examples/example.json'}}

Bootprint will then generate the following files (look inside by clicking on them).

{{runBootprint '.' './examples/example.json' 'examples/target'}} 

{{/if}}
````


### Helpers

## Functions

<dl>
<dt><a href="#codeBlock">codeBlock()</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Create a <a href="http://daringfireball.net/projects/markdown/syntax#code">markdown code-block</a> with enough backticks</p>
<p>The surrounding fences of a code-block must have more backticks than the maximum number of
consecutive backticks in the contents (escaping backticks <a href="https://github.com/github/markup/issues/363">https://github.com/github/markup/issues/363</a>).
This block-helper creates enough and at least three.</p>
</dd>
<dt><a href="#moduleConfig">moduleConfig(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Continue with the thought-configuration of the current plugin</p>
<p>The helper loads the thought-configuration from the plugin in the current
working directory and passed the resulting JSON as context to
the content-block.</p>
</dd>
<dt><a href="#runBootprint">runBootprint(module, input, target)</a> ⇒ <code>*</code></dt>
<dd></dd>
</dl>

<a name="codeBlock"></a>

## codeBlock() ⇒ <code>Promise.&lt;string&gt;</code>
Create a [markdown code-block](http://daringfireball.net/projects/markdown/syntax#code) with enough backticks

The surrounding fences of a code-block must have more backticks than the maximum number of
consecutive backticks in the contents (escaping backticks https://github.com/github/markup/issues/363).
This block-helper creates enough and at least three.

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - the string containing the  
**Example**  
```js
{{#codeBlock lang='hbs'}}
Some markdown hbs template
{{/codeBlock}}
```
<a name="moduleConfig"></a>

## moduleConfig(options) ⇒ <code>Promise</code>
Continue with the thought-configuration of the current plugin

The helper loads the thought-configuration from the plugin in the current
working directory and passed the resulting JSON as context to
the content-block.

**Kind**: global function  
**Access**: public  

| Param |
| --- |
| options | 

<a name="runBootprint"></a>

## runBootprint(module, input, target) ⇒ <code>\*</code>
**Kind**: global function  

| Param |
| --- |
| module | 
| input | 
| target | 


    
