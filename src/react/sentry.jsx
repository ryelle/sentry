/**
 * External dependencies
 */
var React = require( 'react' ),
	ReactDOM = require( 'react-dom' ),
	page = require( 'page' );

/**
 * Internal dependencies
 */
var Router = require( './components/router' );

jQuery( '.site' ).on( 'click', 'a', function( e ) {
	e.preventDefault();
	var url = jQuery( this ).attr( 'href' );
	url = url.replace( /^.*\/\/[^\/]+/, '' );
	page( url );
} );

/**
 * Make it so…
 */
ReactDOM.render(
	<Router />, document.getElementById( 'page' )
);
