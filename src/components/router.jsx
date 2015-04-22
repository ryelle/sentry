/**
 * External dependencies
 */
var React = require( 'react/addons' ),
	page = require( 'page' );

/**
 * Internal dependencies
 */
var Content = require( './site-content.jsx' ),
    SiteHeader = require( './site-header.jsx' );

var Router = React.createClass({

	componentDidMount: function() {

		var self = this;

		page( '/category/:slug', function ( ctx ) {
			var slug = ctx.params.slug;
			var url = "/wp-json/wp/terms/category/?child_of=" + slug;
			self.setState({ component: <Content url={url} /> });
			self.refs.header.setState({ current: slug });
		});

		page.start();

	},

	getInitialState: function() {
		return { component: <div /> };
	},

	render: function() {
		return (
			<div>
				<SiteHeader ref="header" url="/wp-json/wp/terms/category/" current="" />
				{ this.state.component }
			</div>
		);
	}

});

module.exports = Router;