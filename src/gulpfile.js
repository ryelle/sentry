var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var babelify = require('babelify');
var streamify = require('gulp-streamify');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var glob = require('glob');
var sass = require('gulp-sass');

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	'react',
	'react/addons',
	'babelify/polyfill'
];

var THEME_NAME = 'sentry';

var browserifyTask = function (options) {

	// Our app bundler
	var appBundler = browserify({
		entries: [options.src],
		transform: [reactify, babelify ],
		paths: ['./node_modules','./react'],
		extensions: ['.js','.jsx'],
		debug: options.development, // Gives us sourcemapping
		cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
	});

	// // We set our dependencies as externals on our app bundler when developing
	(options.development ? dependencies : []).forEach(function (dep) {
		appBundler.external(dep);
	});

	// The rebundle process
	var rebundle = function () {
		var start = Date.now();
		console.log('Building ' + THEME_NAME + '.js');
		appBundler.bundle()
			.on( 'error', gutil.log )
			.pipe( source( THEME_NAME + '.js' ) )
			.pipe( gulp.dest( options.dest ) )
			.on( 'end', function() {
				console.log( 'Finished ' + THEME_NAME + '.js');
			});
	};

	// Fire up Watchify when developing
	if ( options.development ) {
		appBundler = watchify( appBundler );
		appBundler.on( 'update', rebundle );
	}

	rebundle();

	// Remove react-addons when deploying, as it is only for testing
	if ( ! options.development ) {
		dependencies.splice( dependencies.indexOf('react-addons'), 1 );
	}

	// Bundle dependencies
	var vendorsBundler = browserify({
		debug: true,
		require: dependencies
	});

	// Run the vendor bundle
	console.log( 'Building vendors.js');
	vendorsBundler.bundle()
		.on( 'error', gutil.log )
		.pipe( source( 'vendors.js' ) )
		.pipe( gulp.dest( options.dest ) )
		.on( 'end', function() {
			console.log( 'Finished vendors.js' );
		});
}

var cssTask = function (options) {
	var run = function () {
		if ( arguments.length ) {
			console.log( 'Sass file ' + arguments[0].path + ' changed.' );
		}
		var start = new Date();
		console.log( 'Building style.css' );
		gulp.src( options.srcFile )
			.pipe( sass().on( 'error', sass.logError ) )
			.pipe( gulp.dest( options.dest ) )
			.on( 'end', function() {
				console.log( 'Finished style.css' );
			});
	};
	run();
	gulp.watch( options.srcPaths, run );
}

// Starts our development workflow
gulp.task('default', function () {

	browserifyTask({
		development: true,
		src: './react/sentry.jsx',
		dest: './js'
	});

	cssTask({
		development: true,
		srcFile: './sass/style.scss',
		srcPaths: ['./sass/**/*.scss', './react/components/**/*.scss'],
		dest: './'
	});

});
