/* global jQuery */
/**
 * Internal dependencies
 */
var Actions = require('../actions/actions');

/**
 * The API URL prefix
 * @type {string}
 * @protected
 */
var _URL = '';

var _get = function( url, callback ) {
	jQuery.ajax({
		url: url,
		dataType: 'json',
		success: function(data) {
			if ( data.constructor !== Array ) {
				data = [ data ];
			}
			callback( data );
		}.bind( this ),
		error: function(xhr, status, err) {
			console.error( url, status, err.toString() );
		}.bind( this )
	});
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

};

module.exports = Server;
