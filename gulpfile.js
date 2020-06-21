const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');
const clean = require('gulp-clean-dir');
const image = require('gulp-image');

gulp.task('clean', function (done) {
  clean('./src/public/');
  clean('./dist');
  done();
});

gulp.task('image', function (done) {
  gulp.src('./src/img/*').pipe(image()).pipe(gulp.dest('./src/public/img/'));
  done();
});

gulp.task('html', function (done) {
  gulp
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
    ['./src/public/*.html', './src/public/**/*.css', '/src/public/img/**/*.*'],
    gulp.parallel(browserSync.reload)
  );
  watch(['./src/scss/**/*.scss'], gulp.parallel('sass'));
  watch(['./src/html/**/*.html'], gulp.parallel('html'));
  watch(['./src/img/**/*.*'], gulp.parallel('image'));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './src/public/',
    },
  });
});

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('sass', 'html', 'image'),
    gulp.parallel('server', 'watch')
  )
);

gulp.task('build', function (done) {
  console.log('Build OK!!!');
  done();
});
