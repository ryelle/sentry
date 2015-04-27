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
				src:  'components/' + THEME_NAME + '.jsx',
				dest: 'components/' + THEME_NAME + '.js'
			}
		},
		browserify: {
			options: {
				transform: [ require('grunt-react').browserify ],
				alias: [
					'./components/mixins/loadFromServer:mixins/loadFromServer'
				],
				browserifyOptions : {
					extensions: [ '.js','.json','.jsx' ]
				}
			},
			app: {
				src:  'components/' + THEME_NAME + '.js',
				dest: 'js/' + THEME_NAME + '.js'
			}
		},

		watch: {
			css: {
				files: [ 'components/**/*.scss', 'sass/**/*.scss' ],
				tasks: [ 'sass:dev', 'autoprefixer:dev' ]
			},
			js: {
				files: [ 'components/**/*.jsx' ],
				tasks: [ 'react:app', 'browserify:app' ]
			}
		}
	});

	// Default task.
	grunt.registerTask( 'js', [ 'react:app', 'browserify:app' ] );
	grunt.registerTask( 'css', [ 'sass:dev', 'autoprefixer:dev' ] );
	grunt.registerTask( 'default', [ 'js', 'css' ] );

};
