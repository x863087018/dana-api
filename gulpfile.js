const gulp = require('gulp');
const del = require('del');
const shell = require('gulp-shell');
const zip = require('gulp-zip');
const fs = require('fs');

gulp.task('clean', () => del(['dist/**']));

// gulp.task('lint', shell.task(['npm run lint']));

gulp.task('tsc', shell.task(['midway-bin build -c']));

gulp.task('copy', () => {
    const fileList = [
        'package.json'
    ];
    const packageLock = 'package-lock.json';
    if (fs.existsSync(packageLock)) {
        fileList.push(packageLock);
    }
    return gulp
        .src(fileList)
        .pipe(gulp.dest('dist'));
});

// 注释掉 npm 任务，不在 dist 中安装依赖
// gulp.task(
//     'npm',
//     shell.task(['cd dist && npm install --production --no-audit'])
// );

gulp.task(
    'build',
    gulp.series('clean', 'tsc', 'copy')  // 移除 'npm' 步骤
);

gulp.task('default', gulp.series('build'));