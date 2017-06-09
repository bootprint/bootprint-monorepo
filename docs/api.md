# API reference

<a name="CustomizeHandlebarsConfig"></a>

## CustomizeHandlebarsConfig : <code>object</code>
The default configuration for the handlebars engine

**Kind**: global typedef  
**Api**: public  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| partials | <code>string</code> | path to a partials directory. Each `.hbs`-file in the directory (or in the tree)   is registered as partial by its name (or relative path), without the `.hbs`-extension. |
| partialWrapper | <code>function</code> | a function that can modify partials   just before they are registered with the Handlebars engine. It receives the partial contents as   first parameter and the partial name as second parameter and must return the new content (or a promise for   the content. The parameter was introduced mainly for debugging purposes (i.e. to surround each   partial with a string containing the name of the partial). When this function is overridden, the   parent function is available throught `this.parent`. |
| helpers | <code>string</code> \| <code>object</code> \| <code>function</code> | if this is an object it is assumed to be a list of helper functions,   if this is function it is assumed to return an object of helper functions, if this is a string,   it is assumed to be the path to a module returning either an object of a function as above. |
| templates | <code>string</code> | path to a directory containing templates. Handlebars is called with each `.hbs`-file   as template. The result of the engine consists of an object with a property for each template and the   Handlebars result for this template as value. |
| data | <code>string</code> \| <code>object</code> \| <code>function</code> | a javascript-object to use as input for handlebars. Same as with the `helpers`,   it is also acceptable to specify the path to a module exporting the data and a function computing   the data. |
| preprocessor | <code>function</code> \| <code>string</code> | a function that takes the input data as first parameter and   transforms it into another object or the promise for an object. It the input data is a promise itself,   is resolved before calling this function. If the preprocessor is overridden, the parent   preprocessor is available with `this.parent(data)` |
| hbsOptions | <code>object</code> | options to pass to `Handlebars.compile`. |
| addSourceLocators | <code>boolean</code> | add [handlebars-source-locators](https://github.com/nknapp/handlebars-source-locators)   to the output of each template |


