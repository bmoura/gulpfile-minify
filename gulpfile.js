var gulp = {
		run: require('gulp'),
		compress_IMG: require('gulp-imagemin'),
		min_JS: require('gulp-minify'),
		min_CSS: require('gulp-csso'),
		init: function(src, call, dest){
			gulp.run.src(src).pipe(
				call
			).pipe(
				gulp.run.dest(dest)
			);
		}
	};

gulp.run.task('compress', function(){
	gulp.init(
		'vendor/assets/images/src/**/*',
		gulp.compress_IMG(),
		'vendor/assets/images/compress'
	);
	gulp.init(
		'vendor/assets/js/src/**/*',
		gulp.min_JS({
			ext:{
				min: '-min.js',
				src: '-debug.js'
			}
		}),
		'vendor/assets/js/min'
	);
	gulp.init(
		'vendor/assets/css/src/**/*',
		gulp.min_CSS(),
		'vendor/assets/css/min'
	);
});