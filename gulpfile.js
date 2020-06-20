const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');

gulp.task('watch', function () {
  watch(['./src/*.html', './src/**/*.css'], gulp.parallel(browserSync.reload));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './src/',
    },
  });
});

gulp.task('default', function () {
  gulp.parallel('server', 'watch');
});
