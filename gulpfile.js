var gulp = require('gulp'),
    tsc = require('gulp-tsc'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),

    //Set the source path and the destination
    config = {
        typescript: {
            // Your source folder, excluding node_modules
            src: ['lib/**/*.ts', '!node_modules/**'],
            dest: 'dist/'
        }
    };

gulp.task('build', function () {

    var tsProject = ts.createProject('tsconfig.json', {
        removeComments: true,
        module: 'amd',
        out: 'compiled.js'
    });

    return gulp
        .src(config.typescript.src)
        .pipe(tsProject())
        .pipe(gulp.dest(config.typescript.dest));



    return res;
});

gulp.task('default', ['build']);