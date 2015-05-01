var verb = require('verb');

require("../bootprint-doc-generator")(verb, require("./"));




verb.task('default', function () {
    verb.src(['.verb.md'])
        .pipe(verb.dest('./'));
});