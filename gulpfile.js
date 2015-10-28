var exec = require('child_process').exec;

var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    ejsLocals = require('gulp-ejs-locals'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

var pkg = require('./package.json'),
    rootPaths = {
        www: 'public',
        dev: 'dev'
    },
    paths = {
        ejs: {
            src: [rootPaths.dev+'/ejs/**/*.ejs', '!'+rootPaths.dev+'/ejs/_inc/**/*.ejs'],
            all: [rootPaths.dev+'/ejs/**/*.ejs'],
            destFolder: rootPaths.www+'/'
        },
        js: {
            src: [rootPaths.dev+'/js/libs/**/*.js', rootPaths.dev+'/js/src/**/*.js'],
            destFile: 'app.js',
            destFileMin: 'app.min.js',
            destFolder: rootPaths.www+'/js/'
        },
        sass: {
            src: [rootPaths.dev+'/sass/main.scss'],
            all: [rootPaths.dev+'/sass/**/*.scss'],
            destFile: 'main.min.css',
            destFolder: rootPaths.www+'/css/'
        }
    };

gulp.task('run', function(){
    exec('./node_modules/.bin/electron .', function(error, stdout, stderr){
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if(error !== null) {
            console.log('exec error: ' + error);
        }
    });
});

gulp.task('watch', function(){
    livereload.listen();
    gulp.watch(paths.ejs.all, ['ejs']);
    gulp.watch(paths.js.src, ['concat']);
    gulp.watch(paths.sass.all, ['sass']);
});

gulp.task('ejs', function(){
    gulp.src(paths.ejs.src)
        .pipe(ejsLocals().on('error', gutil.log))
        .pipe(gulp.dest(paths.ejs.destFolder))
        .pipe(livereload());
});

gulp.task('sass', function () {
    gulp.src(paths.sass.src)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            expand: true,
            flatten: true,
            browsers: ['last 20 versions', 'ie 8', 'ie 9']
        }))
        .pipe(rename(paths.sass.destFile))
        .pipe(gulp.dest(paths.sass.destFolder))
        .pipe(livereload());
});

gulp.task('concat', function() {
    gulp.src(paths.js.src)
        .pipe(concat(paths.js.destFile))
        .pipe(gulp.dest(paths.js.destFolder))
        .pipe(livereload());
});

gulp.task('uglify', function() {
    gulp.src(paths.js.src)
        .pipe(uglify())
        .pipe(rename(paths.js.destFileMin))
        .pipe(gulp.dest(paths.js.destFolder));
});

gulp.task('js', ['concat', 'uglify']);

gulp.task('default', ['watch', 'run']);
gulp.task('build', ['ejs', 'sass', 'js']);