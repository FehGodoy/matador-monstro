const gulp        = require('gulp');
const browserSync = require ('browser-sync').create();
const sass        = require('gulp-sass');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const { src, series, parallel, dest, watch } = require('gulp');
const jsPath = 'files/js/**/*.js';
const scssPath = 'files/scss/**/*.scss';

function scssTask(){
    return src(scssPath)
    .pipe(sass().on('error',sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(dest('files/min/css'))
    .pipe(browserSync.stream());
}

function jsTask() {
  return src(jsPath)
    .pipe(concat('all.min.js'))
    .pipe(terser())
    .pipe(dest('files/min/js/'))
    .pipe(browserSync.stream());
}

function watchTask(){
    browserSync.init({
        proxy:'http://localhost/vue/projeto-01-monstro',
        browser: 'Chrome',
        notify: false
    });
    gulp.watch(scssPath ,scssTask);
    gulp.watch(jsPath ,jsTask);
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch(scssPath).on('change', browserSync.reload);
    gulp.watch(jsPath).on('change', browserSync.reload);
}

exports.scssTask = scssTask;
exports.jsTask = jsTask;
exports.watchTask = watchTask;
exports.default = series(
  parallel(jsTask, scssTask),
  watchTask
);