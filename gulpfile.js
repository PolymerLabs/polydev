'use strict';

let gulp = require('gulp');

gulp.task('default', ['zone.js']);

gulp.task('zone.js', function() {
  return gulp.src('node_modules/zone.js/dist/zone-microtask.js')
    .pipe(gulp.dest('vendor/'));
});
