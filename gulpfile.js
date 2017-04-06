var gulp = require('gulp');
var $ = require("gulp-load-plugins")();
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var pngquant 	= require('imagemin-pngquant');

// Sass
gulp.task('sass', function () {
	gulp.src('static/common/_scss/**/*.scss')
		.pipe($.plumber())
		.pipe($.frontnote({
			css: '../common/css/styleguide.css',
			out: './static/styleguide'
		}))
		.pipe($.sass({ errLogToConsole: true, includePaths: ['static/common/_scss/','node_modules/compass-mixins/lib/'], style: 'expanded' }) )
		.pipe($.pleeease({
			autoprefixer: {
				browsers: ['last 2 versions', 'ie 9', 'ie 8']
			},
			minifier: false,
			opacity: true,
			filters: true
		}))
		.pipe($.csscomb())
		.pipe(gulp.dest('static/common/css'))
		.pipe(reload({stream:true}));
});

// Js-concat-uglify
// gulp.task('js', function() {
// 	gulp.src([
// 		'static/common/lib/jquery/jquery.js',
// 		'static/common/lib/**/*.js',
// 		'static/common/_js/common.js',
// 		'static/common/_js/module/*.js',
// 		'static/common/_js/site.js',
// 		'!static/common/lib/html5shiv/html5shiv-printshiv.min.js'
// 	])
// 		.pipe($.plumber())
// 		.pipe($.concat('all.js'))
// 		.pipe($.uglify({preserveComments: 'some'})) // Keep some comments
// 		.pipe(gulp.dest('static/common/js'))
// 		.pipe(reload({stream:true}));
// });

gulp.task('imagemin', function() {
	gulp.src(['static/common/_images/**/*.{png,jpg,gif,svg}'])
		.pipe(imagemin({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true,
			use: [pngquant({
				quality: 60-80,
				speed: 1
			})]
		}))
		.pipe(notify("[images] Optimized:)"))
		.pipe(gulp.dest('./static/common/images'));
});

// Static server
gulp.task('browser-sync', function() {
	// Apache Proxy
	// browserSync({
	// 	proxy: '192.168.10.119:81'
	// });

	// Local Server
	browserSync({
		server: {
			baseDir: "./static/"
		}
	});
});

// Reload all browsers
gulp.task('bs-reload', function () {
	browserSync.reload();
});

// Task for `gulp` command

gulp.task('default',['browser-sync'], function() {
	gulp.watch('static/common/_scss/**/*.scss',['sass']);
	// gulp.watch('static/common/_js/**/*.js',['js']);
	// gulp.watch('static/common/lib/**/*.js',['js']);
	gulp.watch('static/common/_images/**/*.{png,jpg,gif,svg}',['imagemin']);
	gulp.watch("static/*.html", ['bs-reload']);
});
