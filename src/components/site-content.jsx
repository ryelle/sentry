/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var Column = require( './loop/column.jsx' ),
    loadFromServer = require( './mixins/loadFromServer.jsx' );

/**
 * Make it so…
 */

var Content = React.createClass({
	mixins: [ loadFromServer ],

	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.getData();
	},
	componentDidUpdate: function(prevProps, prevState) {
		if ( prevProps !== this.props ) {
			this.getData();
		}
	},

	newColumn: function(){
		return(
			<div className="column empty-column" key="new-site-box">
				<button className="add-column"><i className="fa fa-plus fa-2x"></i></button>
			</div>
		);
	},

	render: function() {
		var columnMarkup = this.state.data.map( function( cat ){
			var url = "/wp-json/wp/posts/?category_name=" + cat.slug;
			return (
				<Column key={cat.id} url={url} name={cat.name} slug={cat.slug} />
			)
		});

		columnMarkup.push( this.newColumn() );

		return (
			<div className="project-columns">
				{ columnMarkup }
			</div>
		);
	}
});

module.exports = Content;