/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var Task = require( './task' ),
    dragFunctions = require( 'store/dragFunctions' ),
    Server = require( 'store/server' );
    AddTask = require( '../add-task' );

/**
 * Make it so…
 */

var List = React.createClass({

	getInitialState: function() {
		return {
			view: 'list',
			data: []
		};
	},
	componentDidMount: function() {
		this.setState({
			view: 'list',
			data: []
		});
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
		this.setState({ data: updatedData }, this.savePostOrder );
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

	addTask: function( event ){
		this.setState({ view: 'add' });
	},

	closeForm: function(){
		this.setState({ view: 'view' });
	},

	renderHeader: function(){
		return (
			<header className="status-header" onDragOver={dragFunctions.dragOver}>
				<h1 className="status-title">{this.props.name}</h1>
			</header>
		);
	},

	render: function() {
		var self = this,
			data = _.sortBy( this.state.data, 'order' );
			theClasses = this.props.slug + ' list';

		if ( this.state.view == 'add' || data.length == 0 ) {
			var enableClose = data.length > 0;
			return (
				<div className={theClasses}>
					{ this.renderHeader() }
					<AddTask title={this.props.name} project={this.props.project} closeForm={this.closeForm} enableClose={ enableClose } />
				</div>
			);
		}

		var tasks = data.map( function ( post ) {
			return (
				<Task key={post.id} id={post.id} link={post.link} title={post.title} date={post.date} content={post.content} tags={post.tags} featured_image={ post.featured_image } onUpdateSorting={self.updateSorting} order={post.order} />
			);
		});

		return (
			<div className={theClasses}>
				{ this.renderHeader() }
				<div className="dragspace" onDragOver={dragFunctions.dragOver}>
					{ tasks }
				</div>
				<button className="add-task" onClick={ this.addTask }><i className="fa fa-plus fa-2x"></i></button>
			</div>
		);
	}
});

module.exports = List;