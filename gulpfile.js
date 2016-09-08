'use strict';

const crisper = require('gulp-crisper');
const es = require('event-stream');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const child_process = require('child_process');

gulp.task('default', ['manifest', 'lint', 'src', 'bower']);

gulp.task('lint', function() {
  return gulp.src('src/*.js').pipe(eslint()).pipe(eslint.format());
});

gulp.task('dev', function() {
  return gulp.watch(['src/**/*'], ['src']);
});

gulp.task('manifest', function() {
  return gulp.src('manifest.json').pipe(gulp.dest('build/polydev/'));
});

gulp.task('compile', function(cb) {
  child_process.exec('tsc', function(err, stdout, stderr) {
    if (err) {
      console.error(stdout);
      console.error(stderr);
    }
    cb(err);
  });
});

gulp.task('src', ['compile'], function() {
  return es
      .merge(
          gulp.src('src/**/*.html').pipe(crisper()),
          gulp.src(['src/**/*', '!src/**/*.html']))
      .pipe(gulp.dest('build/polydev/src'));
});

gulp.task('bower', function() {
  return es
      .merge(
          gulp.src(['bower_components/**/*.html']).pipe(crisper()),
          gulp.src(['!bower_components/**/*.html', 'bower_components/**/*']))
      .pipe(gulp.dest('build/polydev/bower_components'));
});
