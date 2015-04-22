/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var Column = require( './loop/column.jsx' ),
    loadPosts = require( './mixins/loadPosts.jsx' );

/**
 * Make it so…
 */

var Content = React.createClass({
	mixins: [ loadPosts ],

	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadPostsFromServer();
	},
	componentDidUpdate: function(prevProps, prevState) {
		if ( prevProps !== this.props ) {
			this.loadPostsFromServer();
		}
	},

	render: function() {
		var columns = this.state.data.map( function( cat ){
			var url = "/wp-json/wp/posts/?category_name=" + cat.slug;
			return (
				<Column key={cat.id} url={url} name={cat.name} slug={cat.slug} />
			)
		});

		return (
			<div className="project-columns">
				{ columns }
			</div>
		);
	}
});

module.exports = Content;