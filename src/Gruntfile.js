/* jshint node:true */
module.exports = function(grunt) {
	var THEME_NAME = 'sentry';

	// Load tasks.
	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	// Project configuration.
	grunt.initConfig({
		sass: {
			dev: {
				options: {
					noCache: false,
					sourcemap: true,
					style: 'expanded'
				},
				files: {
					'style.css' : 'sass/style.scss'
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 8', 'ie 9']
			},
			dev: {
				src:  'style.css'
			},
		},

		react: {
			app: {
				src:  'react/' + THEME_NAME + '.jsx',
				dest: 'react/' + THEME_NAME + '.js'
			}
		},
		browserify: {
			options: {
				transform: [ require('grunt-react').browserify ],
				alias: [
					'./react/utils/server:utils/server',
					'./react/utils/dragFunctions:utils/dragFunctions'
				],
				browserifyOptions : {
					extensions: [ '.js','.json','.jsx' ]
				}
			},
			app: {
				src:  'react/' + THEME_NAME + '.js',
				dest: 'js/' + THEME_NAME + '.js'
			}
		},

		watch: {
			css: {
				files: [ 'react/components/**/*.scss', 'sass/**/*.scss' ],
				tasks: [ 'sass:dev', 'autoprefixer:dev' ]
			},
			js: {
				files: [ 'react/components/**/*.jsx' ],
				tasks: [ 'react:app', 'browserify:app' ]
			}
		}
	});

	// Default task.
	grunt.registerTask( 'js', [ 'react:app', 'browserify:app' ] );
	grunt.registerTask( 'css', [ 'sass:dev', 'autoprefixer:dev' ] );
	grunt.registerTask( 'default', [ 'js', 'css' ] );

};
