var gulp = require('gulp');
	postcss = require('gulp-postcss'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('autoprefixer'),
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	browserSync = require('browser-sync').create();

// Project directories
var config = {
    jQueryDir: './node_modules/jquery',
    tetherDir: './node_modules/tether',
    publicDir: './build',
    projectScssDir: './src/scss',
    projectJsDir: './src/js'
};

// Start browserSync server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
          baseDir: config.publicDir
        }
    });
});

// Compile our scss
gulp.task('scss', function() {
	var plugins = [
		autoprefixer({
			browsers: [
	            "Android 2.3",
	            "Android >= 4",
	            "Chrome >= 20",
	            "Firefox >= 24",
	            "Explorer >= 8",
	            "iOS >= 6",
	            "Opera >= 12",
	            "Safari >= 6"
	        ],
			cascade: false
		}),
		require('postcss-flexbugs-fixes')
	];
	return gulp.src(config.projectScssDir + '/main.scss')
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
        precision: 8,
        style: 'compressed'
    }).on('error', sass.logError))
	.pipe(postcss(plugins))
	.pipe(rename({ suffix: '.min' }))
    .pipe(cleancss())
    .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(config.publicDir + '/assets/css'))
	.pipe(browserSync.reload({ // Reloading with Browser Sync
         stream: true
     }));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src(config.projectJsDir + '/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        config.jQueryDir + '/dist/jquery.min.js',
        config.tetherDir + '/dist/js/tether.min.js',
		//config.projectJsDir + '/bootstrap/alert.js',
		//config.projectJsDir + '/bootstrap/button.js',
		//config.projectJsDir + '/bootstrap/carousel.js',
		//config.projectJsDir + '/bootstrap/collapse.js',
		//config.projectJsDir + '/bootstrap/dropdown.js',
		//config.projectJsDir + '/bootstrap/modal.js',
		//config.projectJsDir + '/bootstrap/popover.js',
		//config.projectJsDir + '/bootstrap/scrollspy.js',
		//config.projectJsDir + '/bootstrap/tab.js',
		//config.projectJsDir + '/bootstrap/tooltip.js',
		//config.projectJsDir + '/bootstrap/util.js',
        config.projectJsDir + '/vendor/*.js',
        config.projectJsDir + '/*.js',
    ])
	.pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.publicDir + '/assets/js'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.publicDir + '/assets/js'))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
        stream: true
     }));
});

// Watch Files For Changes
gulp.task('watch', ['browserSync'], function() {
    gulp.watch(config.projectJsDir + '/**/*.js', ['lint', 'scripts']);
    gulp.watch(config.projectScssDir + '/**/*.scss', ['scss']);
    gulp.watch(config.publicDir + '/**/*.html').on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['scss', 'lint', 'scripts', 'browserSync', 'watch']);