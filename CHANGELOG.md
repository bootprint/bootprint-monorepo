# Release notes

## v0.3.1 - 2015-06-18
## Fix

- `toUpperCase`-helper must execute `String.prototype.toUpperCase` instead of returning it (see [nknapp/bootprint-swagger#5](https://github
.com/nknapp/bootprint-swagger/issues/5))

## v0.3.0 - 2015-06-17
### Add

- New helper `htmlId` which strips characters that are illegal in HTML ID-attributes.