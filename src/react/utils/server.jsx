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
		}.bind(this),
		error: function(xhr, status, err) {
			console.error( url, status, err.toString() );
		}.bind(this)
	});
};

var Server = {

	getProjects: function( url ) {
		// Set up AJAX request
		// console.log( url );
		_get( url, Actions.fetchProjects );

		// Scoll to top on page change
		window.scroll(0,0);
	},

	getLists: function() {
		// Set up AJAX request
		_get( this.props.url, Actions.fetchLists );

		// Scoll to top on page change
		window.scroll(0,0);
	},

	getTasks: function() {
		// Set up AJAX request
		_get( this.props.url, Actions.fetchTasks );

		// Scoll to top on page change
		window.scroll(0,0);
	},

};

module.exports = Server;
