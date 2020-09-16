/// <binding BeforeBuild='default' Clean='clean' ProjectOpened='watch' />
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var browserify = require('browserify');
var stringify = require('stringify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var fs = require("fs");

// Compile all .less files to .css
gulp.task('less', function () {
  return gulp.src('./src/*.less')
    .pipe(plumber())
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('./src-comp/'));
});

// Minify and bundle CSS files
gulp.task('styles', ['less'], function () {
  return gulp.src(['./src-comp/*.css', '!./src-comp/bundle.css'])
    .pipe(minifyCSS())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./public/'))
    .pipe(gulp.dest('./static/'));
});

// Browserify scripts
gulp.task('browserify', () => {
  browserify({
    entries: './src/index.js',
    debug: true
  })
    //.transform(stringify(['.html']))
    .bundle()
    .on('error', err => {
      gutil.log("Browserify Error", gutil.colors.red(err.message))
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    //.pipe(uglify())
    //.on('error', err => {
    //  gutil.log("Uglify Error", gutil.colors.red(err.message))
    //})
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/'))
    .pipe(gulp.dest('./static/'));
});

// Delete all compiled and bundled files
gulp.task('clean', function () {
  return del(['./src-comp/*.css', './public/bundle.*', './static/bundle.*']);
});

// Default task: full clean+build.
gulp.task('default', ['browserify', 'styles'], function () { });

// Watch: recompile less on changes
gulp.task('watch', function () {
  gulp.watch(['./src/*.less'], ['styles']);
  gulp.watch(['./src/*.js'], ['browserify']);
});
