const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON = ['src/*.json', 'src/**/*.json'];

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
    const tsResults = tsProject.src().pipe(tsProject());
    return tsResults.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['script'], () => {
    gulp.watch('src/**/*.ts', ['script']);
});

gulp.task('assets', function () {
    return gulp.src(JSON_FILES).pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets'])