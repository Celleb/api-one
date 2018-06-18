const gulp = require('gulp');
const ts = require('gulp-typescript');
const mocha = require('gulp-mocha');
const logger = require('fancy-log');
const flatten = require('gulp-flatten');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
    const tsResults = tsProject.src().pipe(tsProject());
    return tsResults.js.pipe(gulp.dest('dist'));
});




gulp.task('watch', ['build'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
});


gulp.task('default', ['watch']) 