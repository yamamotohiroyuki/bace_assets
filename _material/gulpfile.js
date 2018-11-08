
// pathやら監視先やら
var root_path = '../assets/vendor/basic-assets/';
var css_path = root_path+'css'; // 吐き出し
var scss_watch = 'scss/**/*.scss';

var js_path = root_path+'js'; // 吐き出し
var js_watch = 'javascript/**/*.js';

var submodule_path = '../_submodule/';
var jsarray = [
  //prefixfree
  submodule_path+'prefixfree/prefixfree.js',
  submodule_path+'prefixfree/plugins/prefixfree.vars.js',
  submodule_path+'prefixfree/plugins/prefixfree.viewport-units.js',
  'javascript/modernizr.js',
  submodule_path+'anime-js/anime.min.js',
  submodule_path+'slick/slick/slick.js',
  'javascript/basic-bundle.js'
];
// gulpプラグインの読み込み
var gulp = require('gulp'),
    sass = require('gulp-sass'), // sassのコンパイル
    sourcemaps = require('gulp-sourcemaps'), // ソースマップ
    cssmin = require('gulp-cssmin'), // cssのminfi
    concat = require('gulp-concat'), // JavaScript の 連結処理
    uglify = require('gulp-uglify'), // javascript minify
    modernizr = require('gulp-modernizr'), // modernizr
    /*
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),*/
    plumber = require('gulp-plumber'), //監視エラー
    rename = require('gulp-rename'); // ファイル名のリネーム

// css task
gulp.task('default', ['sasswatch', 'sass']);
gulp.task('sasswatch', function () {
  gulp.watch(scss_watch, ['sass']);
});
gulp.task('sass', function () {
  gulp.src(scss_watch)
    .pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(sourcemaps.write({includeContent: false}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write())
    .pipe(gulp.dest(css_path))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(css_path));
});

// js task
gulp.task('default', ['jswatch', 'js']);
gulp.task('jswatch', function () {
  gulp.watch(js_watch, ['js']);
});
gulp.task('modernizr', function () {
  gulp.pipe(modernizr())
    .pipe(gulp.dest('javascript'))
});
gulp.task('js', function () {
  gulp.src(jsarray)
    .pipe(plumber())
    .pipe(concat('basic-bundle.js'))
    .pipe(gulp.dest(js_path))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(js_path));
});