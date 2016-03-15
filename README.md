# bootprint-json-schema 

[![NPM version](https://badge.fury.io/js/bootprint-json-schema.svg)](http://badge.fury.io/js/bootprint-json-schema)
     [![Travis Build Status](https://travis-ci.org/bootprint/bootprint-json-schema.svg?branch=master)](https://travis-ci.org/bootprint/bootprint-json-schema)
   [![Coverage Status](https://img.shields.io/coveralls/bootprint/bootprint-json-schema.svg)](https://coveralls.io/r/bootprint/bootprint-json-schema)


> Converts a json-schema into a static html page



This module is meant for use with the [bootprint](https://npmjs.com/package/bootprint) module:

```bash
npm install -g bootprint
npm install -g bootprint-json-schema
bootprint json-schema http://json-schema.org/schema target
```

The directory "target" should now contain a file `index.html` and `main.css` which contain a readble
form of the [Core/Validation Meta-Schema](http://json-schema.org).

##  API-reference




## License

`bootprint-json-schema` is published under the MIT-license. 
See [LICENSE](LICENSE) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).