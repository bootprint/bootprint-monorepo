# Release notes

## Upcoming

* Remove `bootprint` as peer-dependency, because `npm` versions 1 and 2 download it needlessly.

## v0.6.2 - 2015-10-19

# Fix

* Re-add missing Handlebars-dependency

## v0.6.1 - 2015-10-19

# Fix

* Add `files`-property to package.json

## v0.6.0 - 2015-10-15 

### Add

* `equal`-helper to compare two values

### Change 

* The `eachSorted` helper now sorts in a case-insensitive manner. 

## v0.5.1 - 2015-08-13
### Fix

* `bootprint-swagger#62`: md-helper is not loosing html-tags anymore

## v0.5.0 - 2015-07-20
### Change

* Align configuration to `customize-engine-handlebars`
** `preprocessor` is moved to `handlebars.preprocessor`.
** `handlebars.template` is deprecated. `handlebars.templates` should point to a 
    directory containing an `index.html.hbs` file.
    

## v0.3.1 - 2015-06-18
## Fix

- `toUpperCase`-helper must execute `String.prototype.toUpperCase` instead of returning it (see [nknapp/bootprint-swagger#5](https://github
.com/nknapp/bootprint-swagger/issues/5))

## v0.3.0 - 2015-06-17
### Add

- New helper `htmlId` which strips characters that are illegal in HTML ID-attributes.
