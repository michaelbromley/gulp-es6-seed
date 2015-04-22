var gulp = require('gulp'),
    inject = require('gulp-inject'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    wrap = require('gulp-wrap');

// config values
var distFilename = 'myFoo';

gulp.task('scripts', function () {
    return gulp.src([
        '!**/vendor/*.js',
        './src/**/*.js'
    ])
        .pipe(babel({
            modules: 'system'
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('index', ['scripts', 'assets'], function() {

    var target = gulp.src('./src/index.html'),
        sources = gulp.src([
        'scripts/main.js',
        '**/*.css'
    ], {read: false, cwd: './src/'});

    return target
        .pipe(inject(sources, { addRootSlash: false }))
        .pipe(gulp.dest('./build'));
});

gulp.task('assets', function() {
    return gulp.src([
        './src/vendor*/*.js',
        './src/assets*/**/*.*'
    ])
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', ['index'], function () {
    gulp.watch('./src/**/*.js', ['scripts', 'dist']);
    gulp.watch('./src/index.html', ['index']);
});

/**
 * Create a stand-alone minified bundle version for distribution
 */
gulp.task('dist', function() {
    return gulp.src([
        './src/scripts/!(init)*.js'
    ])
        .pipe(babel({
            modules: 'ignore'
        }))
        .pipe(concat(distFilename + '.js'))
        .pipe(wrap('(function(window, undefined){\n\n<%= contents %>\n})(window);'))
        .pipe(gulp.dest('./dist'))
        .pipe(uglify())
        .pipe(rename(distFilename + '.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['index']);