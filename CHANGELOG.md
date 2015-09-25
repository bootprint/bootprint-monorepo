# Release notes

## v0.8.0
### Add

* Testcases for intervals and string-length limits

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

