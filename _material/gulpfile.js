
// gulpプラグインの読み込み
var gulp = require('gulp');
// Sassをコンパイルするプラグインの読み込み
var sass = require('gulp-sass');

gulp.task('default', function () {
  // ★ style.scssファイルを監視
  gulp.watch('scss/**/*.scss', function () {
    // style.scssの更新があった場合の処理
  
    // style.scssファイルを取得
    gulp.src('scss/basicstyle.scss')
      // Sassのコンパイルを実行
      .pipe(sass({
        outputStyle: 'expanded'
      })
      // Sassのコンパイルエラーを表示
      // (これがないと自動的に止まってしまう)
      .on('error', sass.logError))
      // cssフォルダー以下に保存
      .pipe(gulp.dest('../assets/css'));
  });
});