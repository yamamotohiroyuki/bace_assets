
// pathやら監視先やら
var root_path = '../assets/vendor/basic-assets/';
var css_path = root_path+'css'; // 吐き出し
var scss_watch = 'scss/**/*.scss';

var js_path = root_path+'js'; // 吐き出し
var js_watch = 'javascript/**/*.js';

var material_css_path = 'css';
var material_js_path = 'javascript';

var submodule_path = '../_submodule/';

var task_array = [
  'sasswatch',
  'sass',
  'jswatch',
  'bundlejs',
  'iejs',
  'adjustjs',
  'browser-sync',
  'filewatch'
];



var bundle_array = [
  submodule_path+'anime-js/anime.min.js',
  submodule_path+'slick/slick/slick.js',
  submodule_path+'slicknav/dist/jquery.slicknav.js',
  submodule_path+'sticky-kit/dist/sticky-kit.js',
  'javascript/vendor/original/currentsetting.js',
  'javascript/vendor/original/acs.js',
  'javascript/basic-bundle.js'
];
var adjust_array = [
  submodule_path+'prefixfree/prefixfree.js',
  submodule_path+'prefixfree/plugins/prefixfree.jquery.js',
  submodule_path+'prefixfree/plugins/prefixfree.vars.js',
  submodule_path+'prefixfree/plugins/prefixfree.viewport-units.js',
  'javascript/modernizr.js'
];
var iejs_array = [
  //ie
  submodule_path+'css3-mediaqueries-js/css3-mediaqueries.js',
  submodule_path+'html5shiv/html5shiv.js'
];


function jsminify(filename, array) {
  gulp.src(array)
    .pipe(plumber())
    .pipe(concat('basic-' + filename + '.js'))
    .pipe(gulp.dest(material_js_path))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(js_path));
}


// gulpプラグインの読み込み
var gulp = require('gulp'),
    sass = require('gulp-sass'), // sassのコンパイル
    sourcemaps = require('gulp-sourcemaps'), // ソースマップ
    cssmin = require('gulp-cssmin'), // cssのminfi
    concat = require('gulp-concat'), // JavaScript の 連結処理
    uglify = require('gulp-uglify'), // javascript minify
    modernizr = require('gulp-modernizr'), // modernizr
    cleancss = require('gulp-clean-css'), // CleanCSS
    /*
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),*/
    plumber = require('gulp-plumber'), //監視エラー
    rename = require('gulp-rename'), // ファイル名のリネーム
    browserSync =require('browser-sync'); // ブラウザシンク

// css task
gulp.task('default', task_array);




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
    .pipe(cleancss())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(css_path));
});



// js task
gulp.task('jswatch', function () {
  gulp.watch(js_watch, ['bundlejs',]);
});
gulp.task('modernizr', function () {
  gulp.pipe(modernizr()).pipe(gulp.dest(material_js_path))
});
gulp.task('bundlejs', jsminify('bundle', bundle_array));
gulp.task('adjustjs', jsminify('adjust', adjust_array));
// ie専用js
gulp.task('iejs', jsminify('ie', iejs_array));




// ブラウザシンク
gulp.task('browser-sync', function() {
  browserSync({
      server: {
           baseDir: "../" //対象ディレクトリ
          ,index  : "index.html" //インデックスファイル
      }
  });
});

//
//ブラウザリロード
//

gulp.task('bs-reload', function () {
  browserSync.reload();
});
//
//監視ファイル
//
gulp.task('filewatch', function () {
  gulp.watch("../assets/*.html",   ['bs-reload']);
  gulp.watch("../assets/**/*.css", ['bs-reload']);
  gulp.watch("../assets/**/*.js",  ['bs-reload']);
});

