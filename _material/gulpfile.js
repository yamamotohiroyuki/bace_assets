
// gulpプラグインの読み込み
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename');

gulp.task('default', ['watch', 'sass']);
gulp.task('watch', function () {
  gulp.watch('scss/**/*.scss', ['sass']);
});
gulp.task('sass', function () {
	gulp.src('scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(sourcemaps.write({includeContent: false}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write())
    .pipe(gulp.dest('../assets/vendor/basic-assets/css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('../assets/vendor/basic-assets/css'));
});
//gulp.task('default', function () {
  // ★ style.scssファイルを監視
//  gulp.watch('scss/**/*.scss', function () {
    // style.scssの更新があった場合の処理
    // style.scssファイルを取得
//    gulp.src('scss/basic-style.scss')

      // ソースマップ
//      .pipe(sourcemaps.init())
      // Sassのコンパイルエラーを表示 (これがないと自動的に止まってしまう)
//      .pipe(sass().on('error', sass.logError))
      // Sassのコンパイルを実行
/*      .pipe(sass({
        outputStyle: 'expanded'
      })
      .pipe(sourcemaps.write({includeContent: false}))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write())
      // cssフォルダー以下に保存
      .pipe(gulp.dest('../assets/basic-assets'));
  });
});*/
