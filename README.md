# customize-engine-less 

[![NPM version](https://badge.fury.io/js/customize-engine-less.svg)](http://badge.fury.io/js/customize-engine-less)
     [![Travis Build Status](https://travis-ci.org/bootprint/customize-engine-less.svg?branch=master)](https://travis-ci.org/bootprint/customize-engine-less)
   [![Coverage Status](https://img.shields.io/coveralls/bootprint/customize-engine-less.svg)](https://coveralls.io/r/bootprint/customize-engine-less)


> A less-engine for customize


# Installation

```
npm install customize-engine-less
```

 
## Usage

The following example demonstrates how to use this module:

```js
var customize = require('customize')

// Load files from one directory and merge with second
customize()
  .registerEngine('less', require('customize-engine-less'))
  // Add one less file
  .merge({
    less: {
      main: require.resolve('./main.less')
    }
  })
  // Add another less file overriding some variables
  .merge({
    less: {
      main: require.resolve('./override.less')
    }
  })
  .run()
  .done(console.log)
```

This will generate the following output

```
{ less: 
   { 'main.css': 'div{color:red;background-color:green}',
     'main.css.map': '{"version":3,"sources":["/home/nknappmeier/privat/bootprint/customize-engine-less/examples/main.less"],"names":[],"mappings":"AAGA,IACE,SAAA,CACA"}' } }
```

##  API-reference

### Functions
<dl>
<dt><a href="#coerceToArray">coerceToArray(objOrArray)</a> ⇒</dt>
<dd><p>If <code>objOrArray</code> exists and is a non-array, it is replaced by
an array with the property as single object.</p>
</dd>
</dl>
### Typedefs
<dl>
<dt><a href="#CustomizeLessConfig">CustomizeLessConfig</a> : <code>object</code></dt>
<dd><p>Configuration for the customize less-engine</p>
</dd>
</dl>
<a name="coerceToArray"></a>
### coerceToArray(objOrArray) ⇒
If `objOrArray` exists and is a non-array, it is replaced by
an array with the property as single object.

**Kind**: global function  
**Returns**: objOrArray, if it is an array or an array containing `objOrArray` (if it is no array)  

| Param | Type | Description |
| --- | --- | --- |
| objOrArray | <code>object</code> | the object or an array |

<a name="CustomizeLessConfig"></a>
### CustomizeLessConfig : <code>object</code>
Configuration for the customize less-engine

**Kind**: global typedef  
**Api**: public  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| main | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | absolute path to a lesscss-file or a list of absolute paths to less files |
| path | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | absolute path (or a list of those) to paths to use as import path |




## License

`customize-engine-less` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).