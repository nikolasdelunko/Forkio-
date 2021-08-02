const gulp = require('gulp');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer')
const cleancss = require('gulp-clean-css')
const concatcss = require('gulp-concat-css')
const uglify = require('gulp-uglify')
const pipeline = require('readable-stream').pipeline



const FOLDER = {
    prod: 'dist/',
    dev: 'src/'
};
const path = {
    src: {
        // html: "src/index.html",
        scss: `${FOLDER.dev}**/*.scss`,
        js: `${FOLDER.dev}**/*.js`,
        img: `${FOLDER.dev}img/**/*`
    },
    build: {
        // html: 'build/',
        css: `${FOLDER.prod}css/`,
        js: `${FOLDER.prod}js/`,
        img: `${FOLDER.prod}img/`
    }
};
//
// const buildStyles = () => (
//     gulp.src(path.src.scss)
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest(path.build.css))
//         .pipe(browserSync.stream())
// );


const buildStyles = () => (
    gulp.src(path.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(concatcss("./styles.min.css"))
        .pipe(cleancss())
        .pipe(gulp.dest(path.build.css))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream())
);



const buildJS = () => (
    gulp.src(path.src.js)
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.reload({ stream: true }))
);

gulp.task('compress', function () {
    return pipeline(
        gulp.src('./src/js/**.js'),
        concat("scripts.min.js"),
        uglify(),
        gulp.dest('./dist/js')
    );
});

const buildIMG = () => (
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream())
);

const cleanBuild = () => (
    gulp.src('build/', {allowEmpty: true})
        .pipe(clean())
);

function emptyDist() {
    return del('./dist/**');
}

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });


    gulp.watch(path.src.scss, buildStyles).on("change", browserSync.reload);
    gulp.watch(path.src.js, buildJS).on("change", browserSync.reload);
    gulp.watch(path.src.img, buildIMG).on("change", browserSync.reload);
    gulp.watch('./index.html', null).on('change', browserSync.reload);

};


gulp.task('build', gulp.series(
    cleanBuild,
    gulp.parallel(buildIMG, buildJS, buildStyles, emptyDist)
));

gulp.task('dev', gulp.series('build', watcher));

// gulp.task('buildHTML', () => {
//     return
// });
// gulp.task('buildHTML', () => (
//     gulp.src(path.src.html)
//         .pipe(gulp.dest(path.build.html))
// ));