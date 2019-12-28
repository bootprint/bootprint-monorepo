## API-reference

```
var bootprint = require(`bootprint`)
```

The bootprint module exports a pre-configured instance of the [customize](https://npmjs.com/package/customize) module.
In this configuration the engines [customize-engine-handlebars](https://npmjs.com/package/customize-engine-handlebars) and
[customize-engine-less](https://npmjs.com/package/customize-engine-less) are loaded. Both module are configured with their default configuration.

    
### Customize methods

The following [methods from the `Customize`-module()](https://github.com/bootprint/customize/blob/v3.0.2/README.md#customizecustomize) can be used:

#### [.merge(configuration:object): Customize](https://github.com/bootprint/customize/blob/v3.0.2/README.md#module_customize..Customize+merge)


This method returns a new Customize instance, merging another configuration with the current one.
The merging rules of Customize apply. The configuration object must match [this JSON-schema](doc/configuration-schema.json)

#### [.load(configurationModule:function(customize:Customize):Customize):Customize](https://github.com/bootprint/customize/blob/v3.0.2/README.md#customizeloadcustomizemodule--customize)


This method loads a configuration module (such as [bootprint-swagger](https://npmjs.com/package/bootprint-swagger) or [bootprint-json-schema](https://npmjs.com/package/bootprint-json-schema).
A configuration module is a `function(customize:Customize): Customize` that accepts a Customize instance and 
returns another one. Configuration modules such as `bootprint-swagger` create new Customize instances by 
merging configurations and by loading one or multiple other configuration modules. For example `bootprint-swagger`, 
loads `bootprint-json-schema' which in turn loads `bootprint-base`. Each of the three modules merge their 
custom configurations after loading their parent modules.

#### [.buildConfig(): Promise&lt;object>](https://github.com/bootprint/customize/blob/v3.0.2/README.md#customizebuildconfig--promiseobject)


This method can be called in order to inspect intermediate configuration results for documentation or testing purposes.
The returned object is the merge-result of configurations. However, not the input of the `.merge` function is merged,
but an internal representation that consists of watch-files and the configuration after proprocessing by the engines.

#### [.run(options:object): Promise&lt;object>](https://github.com/bootprint/customize/blob/v3.0.2/README.md#customizerunoptions--promiseobject)


This method invokes one or all engines of the configuration Customize engine. In Bootprint, unless the `.registerEngine()`
method has been called, this is `customize-engine-less` and `customize-engine-handlebars`.
The result of the method-call an object containing one key for each registered engine, with the result of this engine.

`.run({ onlyEngine: 'handlebars' }` will only run the Handlebars-engine and exclude `less`.
    

### Bootprint methods

In Bootprint, the Customize prototype is extended to include the following method: 

#### .build(input:(string|object), targetDir:string):Bootprint

This method is kept as legacy interface to Bootprint. It returns a new instance of the Bootprint class that can
be used to write the result of the engines to a directory and to create a file-watcher

##### Parameters:
* `input`: If this parameter is a string, it is either interpreted as URL (if 
        starting with `http://` or `https://`) or as path to a JSON or YAML file 
        from which the input data for the Handlebars-engine is loaded. If it is a 
        plain-object, it is used as input directly. In any case, the input is merged
        into the `handlebars.data` part of the configuration.
* `targetDir`: This string is a path to the directory where the output files of 
        Bootprint should be stored.

### The Bootprint object 

The Bootprint object provides the following methods:

#### .generate():Promise&lt;string[]>

This method runs all configured engines and writes the result to the target directory using the [customize-write-files](https://npmjs.com/package/customize-write-files)
module. The result of this call is a Promise for a list of generated files.

#### .watch():EventEmitter

This method starts a file-watcher that observes all configuration, input and helper files and directories relevant for the current 
configuration. If a file change, the whole process of merging configurations and running the engine is restartet.

The method returns and EventEmitter that emits an 'update' event every time Bootprint has finished running.
