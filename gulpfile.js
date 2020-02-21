const gulp = require('gulp');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const exec = require('child_process').exec;
const npath = require('path');

const srcDirJs = './app/src/js';
const srcDirCss = './app/src/scss';
const dstDirJs = './app/public/js';
const dstDirCss = './app/public/css';

// Purge all before building
gulp.task('clean', () => {
  return gulp.src([dstDirJs, dstDirCss], {read: false, allowEmpty: true})
    .pipe(clean());
});

// Build and minify all .scss files into app.min.css
gulp.task('sass', () => {
  return gulp
    .src([`${srcDirCss}/*.scss`])
    .pipe(concat('app.css'))
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      indentedSyntax: false,
      includePaths: [
        'node_modules/govuk_frontend_toolkit/stylesheets',
        'node_modules/govuk-elements-sass/public/sass'
      ]
    })
    .on('error', sass.logError))
    .pipe(gulp.dest(dstDirCss));
});

// Build and minify all .js files into app.min.js
gulp.task('js', () => {
  return gulp
    .src([`${srcDirJs}/*.js`, `${srcDirJs}/lib/*.js`])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dstDirJs));
});

// Copy the fonts and images from the govuk-frontend package to the public directory
gulp.task('govuk-assets', () => {
  return gulp
    .src(['./node_modules/govuk-frontend/govuk/assets/**/*'])
    .pipe(gulp.dest(dstDirCss));
});

// Binding all tasks together...
gulp.task('build', gulp.series(['clean', 'sass', 'js', 'govuk-assets']));

// Let's do some watching
gulp.task('watch', gulp.series(() => {
  gulp.watch([`${srcDirCss}/*.scss`], gulp.series('sass'));
  gulp.watch([`${srcDirJs}/*.js`, `${srcDirJs}/lib/*.js`], gulp.series('js'));
}));

gulp.task('serve', gulp.series('build', () => {
  exec('npm start', function (err, stdout, stderr) {
    if (err) {
      console.log(err);
    }
    console.log(stdout);
    console.log(stderr);
  });
}));

gulp.task('default', gulp.series('serve'));
