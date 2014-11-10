/*********************************************
 * gulpやプラグインのインポート
 *********************************************/
var _gulp       = require('gulp');
var _webserver  = require('gulp-webserver');
var _livereload = require('gulp-livereload');
var _jade       = require('gulp-jade');
var _compass    = require('gulp-compass');
var _plumber    = require('gulp-plumber');




/*********************************************
 * 変数一覧
 *********************************************/
//config
var config = {
    path : {
        //開発用
        dev : {
            SCSS       : 'scss/**/*.scss',
            JS         : 'content/**/*.js',
            JADE       : 'content/**/*.jade'
        },
        //公開用
        deploy : {
            CSS        : '../deploy/common/css/',
            HTML       : '../deploy/'
        }
    }
};




/*********************************************
 * webサーバ
 *********************************************/
_gulp.task('webserver', function() {
    _gulp.src(config.path.deploy.HTML)  //ルートディレクトリ
    .pipe(_webserver({
        // livereload: false
        //webserverのlivereloadが上手く動作しないため、別途livereloadプラグインを使う
    }));
});




/*********************************************
 * jadeの設定
 *********************************************/
_gulp.task('jade', function() {
    _gulp.src(config.path.dev.JADE)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_jade({
        pretty: true
    }))
    .pipe(_gulp.dest(config.path.deploy.HTML))
    .pipe(_livereload({ auto: true }));
});




/*********************************************
 * compassの設定
 *********************************************/
_gulp.task('compass', function() {
    _gulp.src(config.path.dev.SCSS)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_compass({
        config_file: 'scss/config.rb',  //compassの設定ファイルの場所
        css: config.path.deploy.CSS,  //出力するcssのフォルダ場所
        sass: 'scss'  //sassファイルの場所
    }))
    .pipe(_livereload({ auto: true }));

    //.pipe(_gulp.dest(''));  //他にも出力先を指定する場合
});




/*********************************************
 * コピーの設定
 *********************************************/
_gulp.task('copy', function() {
    _gulp.src(config.path.dev.JS)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_gulp.dest(config.path.deploy.HTML))
    .pipe(_livereload({ auto: true }));
});




/*********************************************
 * watchの設定
 *********************************************/
_gulp.task('watch', function() {
    _livereload.listen();

    _gulp.watch(config.path.dev.JS, ['copy']);
    _gulp.watch(config.path.dev.JADE, ['jade']);
    _gulp.watch(config.path.dev.SCSS, ['compass']);
});




/*********************************************
 * 実行 -> gulp all
 *********************************************/
_gulp.task('all', ['webserver', 'jade', 'compass', 'copy', 'watch']);




/**
 * [参考]functionでの書き方

    _gulp.task('default', function(){
        _gulp.run('watch', 'copy-html');
    });
*/
