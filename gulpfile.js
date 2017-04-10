var del = require('delete');
var fs = require('fs');
var gulp = require('gulp');
var path = require('path');
var ts = require('gulp-typescript');

const appsDir = path.join(__dirname, 'apps');
const libDir = path.join(__dirname, 'lib');

gulp.task('clean', function clean() {
    del.sync([libDir]);
});

gulp.task('build', ['clean'], function build() {
    var tsProject = ts.createProject('tsconfig.json');

    return gulp
        .src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest(libDir));
});

gulp.task('link', function link() {
    if (!fs.existsSync(appsDir)) {
        fs.mkdirSync(appsDir);
    }

    var packageJson = require('./package.json');

    if (packageJson.alexa && packageJson.alexa.apps && packageJson.alexa.apps.length) {
        packageJson.alexa.apps.forEach(app => {
            const nodeModulesAppPath = path.join(__dirname, 'node_modules', app);
            const appPath = path.join(appsDir, app);

            fs.symlinkSync(nodeModulesAppPath, appPath, 'dir');
        });
    }
});

gulp.task('default', ['build']);
