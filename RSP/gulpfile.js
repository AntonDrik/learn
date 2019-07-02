'use strict';

var autoprefixerList = [
  'Chrome >= 45',
  'Firefox ESR',
  'Edge >= 12',
  'Explorer >= 10',
  'iOS >= 9',
  'Safari >= 9',
  'Android >= 4.4',
  'Opera >= 30'
];

var path = {
  dist: {
    html: 'assets/dist/',
    js: 'assets/dist/js/',
    css: 'assets/dist/css/',
    img: 'assets/dist/img/',
    fonts: 'assets/dist/fonts/'
  },
  src: {
  	html: 'assets/src/*.html',
    js: 'assets/src/js/main.js',
    mainStyle: 'assets/src/sass/main_global.scss',
    libsStyle: 'assets/src/sass/plugins/**/*.css',
    img: 'assets/src/img/**/*.*',
    fonts: 'assets/src/fonts/**/*.*'
  },
  watch: {
    html: 'assets/src/*.html',
    js: 'assets/src/js/**/*.js',
    css: 'assets/src/sass/**/*.scss',
    img: 'assets/src/img/**/*.*',
    fonts: 'assets/srs/fonts/**/*.*'
  },
  clean: './assets/build/*'
};

var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	browserSync 	= require('browser-sync'),
	concat 			= require('gulp-concat'),
	uglify			= require('gulp-uglify'),
	notify			= require('gulp-notify'),
	csso			= require('gulp-csso'),
	rename			= require('gulp-rename'),
	del				= require('del'),
	imagemin		= require('gulp-imagemin'),
	pngquant		= require('gulp-pngquant'),
	cache 			= require('gulp-cache'),
	autoprefixer	= require('gulp-autoprefixer'),
	pug 			= require('gulp-pug'),
	plumber			= require('gulp-plumber'),
	rigger			= require ('gulp-rigger');

// Config server
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: 'assets/dist'
		},
		notify: false,
        browser: 'chromium-browser',
	    host: 'localhost',
	    port: 9000,
	})
});

//PUG
gulp.task('html', function(){
	return gulp.src(path.src.html)
	// .pipe(plumber())
	// .pipe(pug({
	// 	pretty: true
	// }))
	.pipe(gulp.dest(path.dist.html))
	.pipe(browserSync.reload({ stream: true }))
});

// сборка CSS
gulp.task('css', function () {
	return gulp.src(path.src.mainStyle)
	.pipe(plumber())
	.pipe(sass().on( 'error', notify.onError(
      {
        message: "<%= error.message %>",
        title  : "Sass Error!"
      } ) )
	)
	.pipe(csso())
	.pipe(autoprefixer(autoprefixerList, { cascade: true })) 
	.pipe(gulp.dest(path.dist.css))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('css-libs', function(){
	return gulp.src(path.src.libsStyle)
	.pipe(plumber())
	.pipe(concat('libs.css').on( 'error', notify.onError(
      {
        message: "<%= error.message %>",
        title  : "css-libs Error!"
      } ) )
	)
	.pipe(csso())
	.pipe(gulp.dest(path.dist.css));
});

// Сборка JS
gulp.task('js', function(){
	return gulp.src(path.src.js)
	// .pipe(plumber())
	.pipe(rigger())
	// .pipe(uglify())
	.pipe(gulp.dest(path.dist.js))
	.pipe(browserSync.reload({stream: true}));
});


//Шрифты
gulp.task('fonts', function () {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts))
    .pipe(browserSync.reload({stream: true}));
});


//Изображения
gulp.task('img', function() {
	return gulp.src(path.src.img)
		.pipe(plumber())
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest(path.dist.img));
});


//удаление dist каталога
gulp.task('clean', async function(){
	return del.sync('dist');
});


//очистка кэша
gulp.task('clearCache', function (callback) {
	return cache.clearAll();
});



gulp.task('build',
  gulp.series('clean',
    gulp.parallel(
      'html',
      'css',
      'css-libs',
      'js',
      'fonts',
      'img'
    )
  )
);




gulp.task('watch', function (){
	gulp.watch(path.watch.html, gulp.parallel('html'));
	gulp.watch(path.watch.css, gulp.parallel('css'));
	gulp.watch([path.watch.js], gulp.parallel('js'));
	gulp.watch([path.watch.img], gulp.parallel('img'));
	gulp.watch([path.watch.fonts], gulp.parallel('fonts'));
});

gulp.task('default', gulp.series(
  'build',
  gulp.parallel('browser-sync','watch')      
));