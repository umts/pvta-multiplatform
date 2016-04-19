var gulp = require('gulp');
var path = require('path');
var eslint = require('gulp-eslint');
var cache = require('gulp-cached');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var gulpIf = require('gulp-if');



var paths = {
  sass: ['./scss/**/*.scss']
};


gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

function isFixed(file) {
	// Has ESLint fixed the file contents?
	return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint-n-fix', function() {

	return gulp.src('www/pages/**/*.js')
		.pipe(eslint({
			fix: true
		}))
		.pipe(eslint.format())
		// if fixed, write the file to dest
		.pipe(gulpIf(isFixed, gulp.dest('www/pages')));
});

gulp.task('lint-watch', function() {
	// Lint only files that change after this watch starts
	var lintAndPrint = eslint();
	// format results with each file, since this stream won't end.
	lintAndPrint.pipe(eslint.formatEach());

	return gulp.watch('www/pages/**/*.js', function(event) {
		if (event.type !== 'deleted') {
			gulp.src(event.path)
				.pipe(lintAndPrint, {end: false});
		}
	});
});



gulp.task('cached-lint', function() {
	// Read all js files within test/fixtures
	return gulp.src('www/pages/**/*.js')
		.pipe(cache('eslint'))
		// Only uncached and changed files past this point
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.result(function(result) {
			if (result.warningCount > 0 || result.errorCount > 0) {
				// If a file has errors/warnings remove uncache it
				delete cache.caches.eslint[path.resolve(result.filePath)];
			}
		}));
});

// Run the "cached-lint" task initially...
gulp.task('cached-lint-watch', ['cached-lint'], function() {
	// ...and whenever a watched file changes
	return gulp.watch('www/pages/**/*.js', ['cached-lint'], function(event) {
		if (event.type === 'deleted' && cache.caches.eslint) {
			// remove deleted files from cache
			delete cache.caches.eslint[event.path];
		}
	});
});

gulp.task('default', ['cached-lint-watch', 'sass']);
