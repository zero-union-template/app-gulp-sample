const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');

const sass = require('gulp-sass');

gulp.task('sass', function (done) {
  gulp.src('./src/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/css/'));
  done();
});

gulp.task('watch', function () {
  watch(
    ['./src/*.html', './src/css/**/*.css'],
    gulp.parallel(browserSync.reload),
  );
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './src/',
    },
  });
});

gulp.task('default', gulp.parallel('server', 'watch'));
