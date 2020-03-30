/**
 * Settings
 * Turn on/off build features
 */

var settings = {
	clean: false,
	scripts: false,
	polyfills: false,
	styles: true,
	svgs: false,
	copy: false,
  reload: true,
  pug: true
};

/**
 * Paths to project folders
 */

var paths = {
	input: '.',
	output: '.',
	styles: {
		input: '*.{scss,sass}',
		output: '.'
	},
  pug: {
    input: '*.pug',
    output: '.'
  },  
	reload: '.'
};




/**
 * Gulp Packages
 */

// General
var {gulp, src, dest, watch, series, parallel} = require('gulp');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');

var pug = require('gulp-pug');

var cleancss = require('gulp-clean-css');

// BrowserSync
var browserSync = require('browser-sync');

// Process, lint, and minify Sass files
var buildStyles = function (done) {

	// Make sure this feature is activated before running
	if (!settings.styles) return done();

	// Run tasks on all Sass files
	src(paths.styles.input)
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: true
		}))
		.pipe(prefix({
			browserList: ['last 2 version', '> 0.25%'],
			cascade: true,
			remove: true
		}))
		.pipe(cleancss({compatibility: 'ie8'}))
		.pipe(dest(paths.styles.output))
		.pipe(dest(paths.styles.output));

	// Signal completion
	done();

};

// Do pug
var buildPug = function (done) {

  if (!settings.pug) return done();

  src(paths.pug.input)
    .pipe(pug())
    .pipe(dest(paths.pug.output));


  done();

};


// Watch for changes to the src directory
var startServer = function (done) {

	// Make sure this feature is activated before running
	if (!settings.reload) return done();

	// Initialize BrowserSync
	browserSync.init({
		proxy: {
			target: 'http://sri.test'
		}
	});

	// Signal completion
	done();

};

// Reload the browser when files change
var reloadBrowser = function (done) {
	if (!settings.reload) return done();
	browserSync.reload();
	done();
};

// Watch for changes
var watchSource = function (done) {
	watch([paths.styles.input, paths.pug.input], series(exports.default, reloadBrowser));
	done();
};



/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
	parallel(
		buildStyles,
    buildPug
	)
);

// Watch and reload
// gulp watch
exports.watch = series(
	exports.default,
	startServer,
	watchSource
);