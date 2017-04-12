var del = require('delete');
var fs = require('fs');
var gulp = require('gulp');
var merge = require('merge-stream');
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

gulp.task('apps-clean', function appsClean() {
    del.sync([appsDir]);
});

gulp.task('apps-link', ['apps-clean'], function link() {
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

gulp.task('apps-link-azure', ['apps-clean'], function link() {
    if (!fs.existsSync(appsDir)) {
        fs.mkdirSync(appsDir);
    }

    var packageJson = require('./package.json');

    if (packageJson.alexa && packageJson.alexa.apps && packageJson.alexa.apps.length) {
        const appPaths = [];

        const streams = packageJson.alexa.apps.map(app => {
            const nodeModulesAppPath = path.join(__dirname, 'node_modules', app);

            return gulp
                .src(`${nodeModulesAppPath}/**/*`)
                .pipe(gulp.dest(path.join(appsDir, app)));
        });

        return merge(streams);
    }
});

gulp.task('default', ['build']);

gulp.task('azure', ['apps-link-azure', 'build']);
