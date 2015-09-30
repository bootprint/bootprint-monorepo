# customize-engine-less

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
  .merge({
    less: {
      main: require.resolve('./main.less'),
      paths: __dirname
    }
  })
  .run()
  .done(console.log)
```

This will generate the following output

```
{ less: 
   { css: 'div{color:blue;background-color:green}',
     map: '{"version":3,"sources":["/home/nknappmeier/privat/node-libraries/customize-engine-less/examples/main.less"],"names":[],"mappings":"AAGA,IACE,UAAA,CACA"}',
     imports: [ '/home/nknappmeier/privat/node-libraries/customize-engine-less/examples/main.less' ] } }
```

##  API-reference

<a name="coerceToArray"></a>
### coerceToArray(objOrArray) ⇒
n
If `objOrArray` exists and is a non-array, it is replaced by
an array with the property as single object.

**Kind**: global function  
**Returns**: objOrArray, if it is an array or an array containing `objOrArray` (if it is no array)  

| Param | Type | Description |
| --- | --- | --- |
| objOrArray | <code>object</code> | the object or an array |




## License

`customize-engine-less` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).