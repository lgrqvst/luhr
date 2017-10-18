var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('html', function() {
  var pug = require('gulp-pug');

  return gulp.src('source/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('css', function() {
  var postcss = require('gulp-postcss');
  var sourcemaps = require('gulp-sourcemaps');
  var rucksack = require('gulp-rucksack');
  var cssnano = require('gulp-cssnano');

  return gulp.src('source/css/styles.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require('precss')({import: {prefix: "_",}}),
      require('postcss-assets')({
        basePath: 'build/',
        loadPaths: ['assets/images/']
      }),
      require('postcss-math')({ functionName: 'res' }),
      require('postcss-short-color'),
      require('postcss-cssnext'),
    ]))
    .pipe(rucksack())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function() {
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');

  return gulp.src([
      'source/js/init.js',
      'source/js/classes/*.js',
      'source/js/main.js'
    ])
    .pipe(concat('game.js'))
    .pipe(gulp.dest('build/assets/js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', ['browserSync','html','css','js'], function() {
  gulp.watch('source/pug/*.pug', ['html']);
  gulp.watch('source/css/*.css', ['css']);
  gulp.watch('source/js/**/*.js', ['js']);
});

gulp.task('browserSync', function() {
  browserSync.init({
    port: 1234,
    server: {
      baseDir: 'build'
    },
  });
});
