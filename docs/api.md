[back to README.md](../README.md)

## Configuration 

This plugin applies the following configuration


### Templates



### Partials

#### [api.md.hbs](node_modules/thought-plugin-jsdoc/src/partials/api.md.hbs)

```hbs
{{#if package.main}}
# API reference

{{{jsdoc package.main}}}
{{/if}}

```
#### [usage.md.hbs](src/partials/usage.md.hbs)

```hbs
## Usage


asdasd
{{#if (exists 'examples')}}

{{runBootprint '.' './examples/example.json' './examples/target'}} 

{{/if}}
```


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
{{#codeBlock}}hbs
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


    
