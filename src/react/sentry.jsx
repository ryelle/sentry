/**
 * External dependencies
 */
var React = require( 'react/addons' ),
	page = require( 'page' );

/**
 * Internal dependencies
 */
var Router = require( './components/router' );

jQuery( '.site' ).on( 'click', 'a', function( e ) {
	e.preventDefault();
	var url = jQuery( this ).attr('href');
	url = url.replace(/^.*\/\/[^\/]+/, '');
	page( url );
});

/**
 * Make it so…
 */
React.render(
	<Router />, document.getElementById( 'page' )
);
