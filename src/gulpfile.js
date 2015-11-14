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
	'babelify/polyfill',
	// 'jquery',
	// 'underscore',
];

var THEME_NAME = 'sentry';

var cssConfig = {
	sourceFile: './sass/style.scss',
	watchDir: [ './sass/**/*.scss', './react/components/**/*.scss' ],
	destDir: './',
};

var jsConfig = {
	sourceFile: './react/sentry.jsx',
	destFile: THEME_NAME + '.js',
	vendorFile: 'vendors.js',
	destDir: './js',
	// watchDir: [ '' ],
}

function doSass() {
	if ( arguments.length ) {
		console.log( 'Sass file ' + arguments[0].path + ' changed.' );
	}
	var start = new Date();
	console.log( 'Building CSS bundle' );
	gulp.src( cssConfig.sourceFile )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( gulp.dest( cssConfig.destDir ) )
		.on( 'end', function() {
			console.log( 'Finished ' + cssConfig.sourceFile );
		} );
};

gulp.task( 'sass:build', function() {
	doSass();
} );

gulp.task( 'sass:watch', function() {
	doSass();
	gulp.watch( cssConfig.watchDir, doSass );
} );

function setupBundler() {
	var appBundler = browserify({
		entries: [ jsConfig.sourceFile ],
		transform: [ reactify, babelify ],
		paths: [ './node_modules','./react' ],
		extensions: [ '.js','.jsx' ],
		debug: true,
		cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
	});

	dependencies.forEach( function( dep ) {
		appBundler.external( dep );
	} );

	return appBundler;
}

function doBundle( appBundler ) {
	var start = Date.now();
	console.log( 'Building ' + jsConfig.destFile );
	appBundler.bundle()
		.on( 'error', gutil.log )
		.pipe( source( jsConfig.destFile ) )
		.pipe( gulp.dest( jsConfig.destDir ) )
		.on( 'end', function() {
			console.log( 'Finished ' + jsConfig.destFile );
		});
};

function doVendorBundle() {
	// Bundle dependencies
	var vendorBundler = browserify( {
		debug: true,
		require: dependencies
	} );

	// Run the vendor bundle
	console.log( 'Building ' + jsConfig.vendorFile );
	vendorBundler.bundle()
		.on( 'error', gutil.log )
		.pipe( source( jsConfig.vendorFile ) )
		.pipe( gulp.dest( jsConfig.destDir ) )
		.on( 'end', function() {
			console.log( 'Finished ' + jsConfig.vendorFile );
		});
}

gulp.task( 'react:build', function( done ) {
	var bundler = setupBundler();
	doBundle( bundler );
	doVendorBundle();
} );

gulp.task( 'react:watch', function( done ) {
	var bundler = setupBundler();
	doBundle( bundler );
	// Fire up Watchify when developing
	bundler = watchify( bundler );
	bundler.on( 'update', function() {
		doBundle( bundler );
	} );

	doVendorBundle();
} );

gulp.task( 'default', ['react:build', 'sass:build'] );
gulp.task( 'watch',   ['react:watch', 'sass:watch'] );
