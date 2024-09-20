const gulp = require('gulp');
const del = require('del');
const shell = require('gulp-shell');
const zip = require('gulp-zip');
const fs = require('fs');

const projectName = require('./package.json').name;
const projectVersion = require('./package.json').version;

const distProject = `dist/${projectName}`;
const distZip = `${projectName}-${projectVersion}.zip`;

gulp.task('clean', () => del(['dist/**', '!*.zip']));

// gulp.task('lint', shell.task(['npm run lint']));

gulp.task('tsc', shell.task(['midway-bin build -c']));

gulp.task('copy', () => {
    const fileList = [
        'dist/**',
        'package.json'
    ];
    const packageLock = 'package-lock.json';
    if (fs.existsSync(packageLock)) {
        fileList.push(packageLock);
    }
    return gulp
        .src(fileList, {
            base: './',
        })
        .pipe(gulp.dest(distProject));
});

gulp.task('del-dup-dist', () => del(['dist/**', `!${distProject}`]));

gulp.task(
    'npm',
    shell.task([`cd ${distProject} && npm install --production --no-audit`])
);

gulp.task('zip', () => {
    return gulp
        .src(`${distProject}/**`, { base: 'dist/' })
        .pipe(zip(distZip))
        .pipe(gulp.dest('dist'));
});

gulp.task(
    'build',
    gulp.series('clean', 'tsc', 'copy', 'del-dup-dist', 'npm', 'zip')
);