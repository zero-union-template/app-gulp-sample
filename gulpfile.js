const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileInclude = require('gulp-file-include');

gulp.task('sass', function (done) {
  gulp
    .src('./src/scss/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: 'last 4 version',
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/css/'));
  done();
});

gulp.task('watch', function () {
  watch(
    ['./src/*.html', './src/css/**/*.css'],
    gulp.parallel(browserSync.reload)
  );
  watch(['./src/scss/**/*.scss'], gulp.parallel('sass'));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './src/',
    },
  });
});

gulp.task('default', gulp.parallel('server', 'watch'));
