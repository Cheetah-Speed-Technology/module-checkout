var gulp = require('gulp');
var babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
var gulpCopy = require('gulp-copy');

gulp.task('copy-font', () => {
    return gulp
        .src(['view-assets/fonts/*.ttf'])
        .pipe(gulpCopy('./view/frontend/web/fonts', { prefix: 2 }))
});

gulp.task('build-css', () => {
    return gulp.src('view-assets/css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./view/frontend/web/css'))
});

gulp.task('build-js', () => {
    return gulp.src('view-assets/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./view/frontend/web/js'))
});


gulp.task('build', gulp.series('copy-font', 'build-css', 'build-js'));
