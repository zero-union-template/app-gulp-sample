const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');

gulp.task('html', function (done) {
  return gulp
    .src('src/html/*.html')
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: 'HTML include',
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(fileinclude({ prefix: '@@' }))
    .pipe(gulp.dest('./src/public'));
  done();
});
gulp.task('sass', function (done) {
  gulp
    .src('./src/scss/main.scss')
    .pipe(
      plumber({
        errorHandler: notify.onError((err) => ({
          title: 'SCSS',
          sound: false,
          message: err.message,
        })),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: 'last 4 version',
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/public/'));
  done();
});

gulp.task('watch', function () {
  watch(
    ['./src/public/*.html', './src/public/**/*.css'],
    gulp.parallel(browserSync.reload)
  );
  watch(['./src/scss/**/*.scss'], gulp.parallel('sass'));
  watch(['./src/html/**/*.html'], gulp.parallel('html'));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './src/public/',
    },
  });
});

gulp.task('default', gulp.parallel('server', 'watch', 'sass', 'html'));

gulp.task('build', function (done) {
  console.log('Build OK!!!');
  done();
});
