const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');
const clean = require('gulp-rimraf');
const image = require('gulp-image');
const concat = require('gulp-concat');
const minify = require('gulp-minifier');

gulp.task('clean', function (done) {
  gulp.src('./dist/**', { read: false }).pipe(clean({ force: true }));
  // gulp.src('./src/public/**', { read: false }).pipe(clean({ force: true }));
  done();
});

gulp.task('image', function (done) {
  gulp.src('./src/img/*').pipe(image()).pipe(gulp.dest('./src/public/img/'));
  done();
});

gulp.task('script', function (done) {
  gulp
    .src('src/js/*.js')
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: 'JavaScript',
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/public/'))
    .pipe(browserSync.stream());
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
    .pipe(gulp.dest('./src/public/'))
    .pipe(browserSync.stream());
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
    .pipe(gulp.dest('./src/public/'))
    .pipe(browserSync.stream());
  done();
});

gulp.task('copy:img', function (done) {
  gulp.src('./src/public/img/**/*.*').pipe(gulp.dest('./dist/img/'));
  done();
});

gulp.task('minify', function (done) {
  gulp
    .src('./src/public/*.*')
    .pipe(
      minify({
        minify: true,
        minifyHTML: {
          collapseWhitespace: true,
          conservativeCollapse: true,
        },
        minifyCSS: true,
        minifyJS: true,
      })
    )
    .pipe(gulp.dest('./dist/'));
  done();
});

gulp.task('watch', function () {
  watch(['./src/public/img/**/*.*'], gulp.parallel(browserSync.reload));
  watch(['./src/scss/**/*.scss'], gulp.parallel('sass'));
  watch(['./src/html/**/*.html'], gulp.parallel('html'));
  watch(['./src/img/**/*.*'], gulp.parallel('image'));
  watch(['./src/js/**/*.js'], gulp.parallel('script'));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './src/public/',
    },
  });
});

gulp.task('source', gulp.parallel('html', 'image', 'script', 'sass'));

gulp.task('prod', function (done) {
  setTimeout(gulp.parallel('copy:img', 'minify'), 2500);
  done();
});

gulp.task(
  'default',
  gulp.series(
    'clean',
    'source',
    gulp.parallel('server', 'watch')
  )
);

gulp.task('build', gulp.series('clean', 'source', 'prod'));
