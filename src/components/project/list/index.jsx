/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var Task = require( './task' ),
    dragFunctions = require( 'mixins/dragFunctions' ),
    loadFromServer = require( 'mixins/loadFromServer' );

/**
 * Make it so…
 */

var List = React.createClass({
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

	updateSorting: function( pid, position ) {
		var self = this;
		var updatedData = self.resetOrder( self.state.data );
		updatedData = self.state.data.map( function ( post ) {
			if ( pid === post.id ) {
				console.log( "Moving " + post.title.rendered + " to " + position + "..." );
				if ( position > 0 ){
					position--;
					post.order = self.state.data[ position ].order + 0.5;
				} else {
					post.order = -1;
				}
			}
			return post;
		});
		updatedData = self.resetOrder( _.sortBy( updatedData, 'order' ) );
		// console.log( _.pluck( updatedData, 'order' ) );
		this.setState({ data: updatedData });
	},

	resetOrder: function( list ) {
		// Silly function
		var order = 0;
		list = list.map( function ( post ) {
			post.order = order;
			order++;
			return post;
		});
		return list;
	},

	render: function() {
		var data = _.sortBy( this.state.data, 'order' );

		var self = this;

		var tasks = data.map( function ( post ) {
			return (
				<Task key={post.id} id={post.id} link={post.link} title={post.title} date={post.date} content={post.content} tags={post.tags} featured_image={ post.featured_image } onUpdateSorting={self.updateSorting} order={post.order} />
			);
		});

		var theClasses = this.props.slug + ' list';

		return (
			<div className={theClasses}>
				<header className="status-header" onDragOver={dragFunctions.dragOver}>
					<h1 className="status-title">{this.props.name}</h1>
				</header>
				<div className="dragspace" onDragOver={dragFunctions.dragOver}>
					{ tasks }
				</div>
				<button className="add-task"><i className="fa fa-plus fa-2x"></i></button>
			</div>
		);
	}
});

module.exports = List;