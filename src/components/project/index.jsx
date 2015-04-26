/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var List = require( './list' ),
    loadFromServer = require( '../mixins/loadFromServer' );

/**
 * Make it so…
 */

var Project = React.createClass({
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

	newList: function(){
		return(
			<div className="column empty-column" key="new-site-box">
				<button className="add-column"><i className="fa fa-plus fa-2x"></i></button>
			</div>
		);
	},

	render: function() {
		var lists = this.state.data.map( function( cat ){
			var url = "/wp-json/wp/posts/?category_name=" + cat.slug;
			return (
				<List key={cat.id} url={url} name={cat.name} slug={cat.slug} />
			)
		});

		lists.push( this.newList() );

		return (
			<div className="project-columns">
				{ lists }
			</div>
		);
	}
});

module.exports = Project;