# Release notes


<a name="current-release"></a>
# Version 0.8.6 (Thu, 24 Mar 2016 07:31:16 GMT)

* [4d70db8](https://github.com/bootprint/bootprint-json-schema/commit/4d70db8) #3: Corrected typo in partial (maxLength-variable spelled wrongly) - Nils Knappmeier



# Version 0.8.5 (Tue, 15 Mar 2016 14:27:33 GMT)

* [40ca080](https://github.com/bootprint/bootprint-json-schema/commit/40ca080) Generate README with "thought" - Nils Knappmeier
* [2222c27](https://github.com/bootprint/bootprint-json-schema/commit/2222c27) Add "require" to main-spec in order to get (low) coverage - Nils Knappmeier
* [2cfccb8](https://github.com/bootprint/bootprint-json-schema/commit/2cfccb8) Add mocha and chai as dev-dependencies - Nils Knappmeier
* [98a14f8](https://github.com/bootprint/bootprint-json-schema/commit/98a14f8) Adjust travis-configuration - Nils Knappmeier
* [3b7b322](https://github.com/bootprint/bootprint-json-schema/commit/3b7b322) Move to bootprint-organization and enable ghook for StandardJS - Nils Knappmeier

## v0.8.4 - 2015-10-21

# Fix

* Remove `bootprint` as peer-dependency, because `npm` versions 1 and 2 download it needlessly.

## v0.8.3 - 2015-10-19

# Fix

* Typo in `files`-property, causing the build to be broken (Thanks @davoad for PR #6)

## v0.8.2 - 2015-10-19 (BROKEN)

# Fix

* Add `files`-property to package.json

## v0.8.1 - 2015-10-17

### Add

* Enums are linked to subschema-definitions, if a property is a swagger-discriminator

## v0.8.0 - 2015-10-14

### Change

* bootprint-swagger#39: Attempting to resolve invalid JSON-references (e.g. for Swagger responses) 
  now throws an error

## v0.7.2 - 2015-10-13 

### Add

* Enums are linked to subschema-definitions, if a property is a swagger-discriminator 

### Fix

* Silently ignore missing `items` tag in `array`-definitions

## v0.7.1 - 2015-09-27
### Fix

* bootprint-swagger#35: "allOf" renders incorrect HTML doc

## v0.7.0 - 2015-09-25
### Add

* Display string-length limits

## v0.6.2 - 2015-09-22
### Fix 

* Be forgiving on calling datatype-helper with empty argument

## v0.6.1 - 2015-09-19
### Fix

* Helper for resolving $ref-properties now returns "undefined" instead of an exception
  when a path cannot be followed completely (because a property in the middle of the path 
  is missing)

## v0.6.0 - 2015-09-18
### Add

* Helper for resolving $ref-properties to their reference object (needed for bootprint-swagger#31)

## v0.5.3 - 2015-09-10
### Fix

* bootprint-swagger#28: Read-only fields in parameter schema

## v0.5.2 - 2015-09-05
### Fix

* bootprint-swagger#26: Definition objects not getting any details

## v0.5.1 - 2015-09-01
### Fix

* bootprint-swagger#18: Details about primitive (string, number, etc). array-item-types were not displayed.

## The dark past

* You'll have to look through the commit log to get details.
