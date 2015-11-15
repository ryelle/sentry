/* global jQuery */
/**
 * Internal dependencies
 */
var Actions = require( '../actions/actions' );

/**
 * The API URL prefix
 * @type {string}
 * @protected
 */
var _URL = '';

var _noop = function() {};

var _get = function( url, callback ) {
	jQuery.ajax( {
		url: url,
		dataType: 'json',
		success: function( data ) {
			if ( data.constructor !== Array ) {
				data = [ data ];
			}
			callback( data );
		}.bind( this ),
		error: function( xhr, status, err ) {
			console.error( url, status, err.toString() );
		}.bind( this )
	} );
};

var _post = function( url, data, callback ) {
	jQuery.ajax( {
		url: url,
		type: 'post',
		data: data,
		dataType: 'json',
		beforeSend: function( xhr, settings ) {
			xhr.setRequestHeader( 'X-WP-Nonce', SentrySettings.nonce );
		},
		success: function( data ) {
			callback( data );
		}.bind( this ),
		error: function( xhr, status, err ) {
			console.error( url, status, err.toString() );
		}.bind( this )
	} );
};

var Server = {

	getProjects: function( url ) {
		// Set up AJAX request
		_get( url, Actions.fetchProjects );
	},

	getLists: function( url ) {
		// Set up AJAX request
		_get( url, Actions.fetchLists );
	},

	getTasks: function( url ) {
		// Set up AJAX request
		_get( url, Actions.fetchTasks );
	},

	saveTaskOrder: function( tasks ) {
		// Send the updated order to the API.
		_.each( tasks, function( post ) {
			var url = SentrySettings.URL.root + '/posts/' + post.id,
				postData = {
					id: post.id,
					order: post.order,
					list: post.list,
				};
			_post( url, postData, Actions.fetchTask );
		} );
	},

	createTask: function( data ) {
		// Send the updated order to the API.
		var url = SentrySettings.URL.root + '/posts/';
		_post( url, data, Actions.addTask );
	},

};

module.exports = Server;
