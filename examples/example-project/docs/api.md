
# API-Documentation

This page describes the API of this Bootprint-module

* [Templates](#templates)
  * [Partials](#partials)
* [Handlebars Helpers](#helpers)
* [LessCSS](#lesscss)
    
# Templates

    
<a name="template-indexhtml"></a>
### index.html

<table>
    <tr>
        <th>Source file</th>
        <td>
<a href="">example-project @ 1.0.0 / handlebars/templates/index.html.hbs</a>        </td>
    </tr>
        <tr>
            <th>Structure</th>
            <td>
<pre><code>
<a href="#template-indexhtml">index.html</a>
├── <a href="#partial-eins">eins</a>
│   <i>This partial writes "one"</i>
└─┬ <a href="#partial-zwei">zwei</a>
  │ <i>This partial calls another partial.</i>
  └─┬ <a href="#partial-dirdrei">dir/drei</a>
    │ <i>Calls "eins"... never... to demonstrate a cycle in...</i>
    └── <a href="#partial-zwei">zwei</a>
        <span title="cycle detected"><i>(&#x1F501; cycle detected)</i> </span>
</code></pre>    


</td>
        </tr>
</table>



    

## Partials

<a name="partial-dirdrei"></a>
### dir/drei

<table>
    <tr>
        <th>Source file</th>
        <td>
<a href="">example-project @ 1.0.0 / handlebars/partials/dir/drei.hbs</a>        </td>
    </tr>
        <tr>
            <th>Uses partials</th>
            <td>
                    <a href="#partial-zwei">zwei</a>
            </td>
        </tr>
        <tr>
            <th>Used by</th>
            <td>
                    <a href="#partial-zwei">zwei</a>
            </td>
        </tr>
</table>

```
Calls "eins"... never... to demonstrate a cycle in the hierarcy tree
```

<a name="partial-eins"></a>
### eins

<table>
    <tr>
        <th>Source file</th>
        <td>
<a href="">example-project @ 1.0.0 / handlebars/partials/eins.hbs</a>        </td>
    </tr>
        <tr>
            <th>Used by</th>
            <td>
                    <a href="#template-indexhtml">index.html</a>
            </td>
        </tr>
</table>

```
This partial writes "one"
```

<a name="partial-zwei"></a>
### zwei

<table>
    <tr>
        <th>Source file</th>
        <td>
<a href="">example-project @ 1.0.0 / handlebars/partials/zwei.hbs</a>        </td>
    </tr>
        <tr>
            <th>Uses partials</th>
            <td>
                    <a href="#partial-dirdrei">dir/drei</a>
            </td>
        </tr>
        <tr>
            <th>Used by</th>
            <td>
                    <a href="#template-indexhtml">index.html</a>, 
                    <a href="#partial-dirdrei">dir/drei</a>
            </td>
        </tr>
</table>

```
This partial calls another partial.
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




## Inlined helpers 
    
*Some helpers are defined directly in the configuration and not via path-reference to a module.
The docs for these helpers cannot be generated and are missing on this page.
If you are the author of this package, please consider putting the helpers into a distinct file
and adding only the path to the configuration.*
    


# LessCSS 

## Main LessCSS-files

* [example-project@1.0.0/less/main.less]()  
    
## LessCSS include paths

* [example-project@1.0.0/less/imports]()


