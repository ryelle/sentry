/**
 * External dependencies
 */
var React = require( 'react/addons' ),
	classNames = require( 'classnames' );

/**
 * Internal dependencies
 */
var AppStore = require( 'store/app-store' ),
	API = require( 'utils/server' ),
	dragFunctions = require( 'utils/dragFunctions' ),
	Task = require( './task' ),
	AddTask = require( '../add-task' );


/**
 * Method to retrieve state from Stores
 */
function getState( list ) {
	return {
		view: 'list',
		data: AppStore.getTasks( list )
	};
}

/**
 * List component
 */
var List = React.createClass( {
	getInitialState: function() {
		return getState( this.props.slug );
	},
	componentDidMount: function() {
		API.getTasks( this.props.url );
		AppStore.addChangeListener( this._onChange );
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener( this._onChange );
	},
	_onChange: function() {
		this.setState( getState( this.props.slug ) );
	},

	updateSorting: function( pid, position ) {
		var updatedData = this.resetOrder( this.state.data );
		updatedData = this.state.data.map( function( post ) {
			if ( pid === post.id ) {
				console.log( "Moving " + post.title.rendered + " to " + position + "..." );
				if ( position > 0 ){
					position--;
					post.order = this.state.data[ position ].order + 0.5;
				} else {
					post.order = -1;
				}
			}
			return post;
		}.bind( this ) );
		updatedData = this.resetOrder( _.sortBy( updatedData, 'order' ) );
		this.setState( { data: updatedData }, API.saveTaskOrder.bind( null, this.state.data ) );
	},

	resetOrder: function( list ) {
		// Silly function
		var order = 0;
		list = list.map( function( post ) {
			post.order = order;
			order++;
			return post;
		} );
		return list;
	},

	addTask: function( event ){
		this.setState( { view: 'add' } );
	},

	closeForm: function(){
		this.setState( { view: 'view' } );
	},

	renderHeader: function(){
		return (
			<header className="status-header" onDragOver={ dragFunctions.dragOver }>
				<h1 className="status-title">{ this.props.name }</h1>
			</header>
		);
	},

	render: function() {
		var data = _.sortBy( this.state.data, 'order' ),
			theClasses = classNames( this.props.slug, 'list' );

		if ( this.state.view == 'add' || data.length == 0 ) {
			var enableClose = data.length > 0;
			return (
				<div className={ theClasses }>
					{ this.renderHeader() }
					<AddTask title={ this.props.name } project={ this.props.project } closeForm={ this.closeForm } enableClose={ enableClose } />
				</div>
			);
		}

		var tasks = data.map( function( post, i ) {
			return (
				<Task { ...post } key={ i } title={ post.title.rendered } content={ post.content.rendered } onUpdateSorting={ this.updateSorting } />
			);
		}.bind( this ) );

		return (
			<div className={ theClasses }>
				{ this.renderHeader() }
				<div className="dragspace" onDragOver={ dragFunctions.dragOver }>
					{ tasks }
				</div>
				<button className="add-task" onClick={ this.addTask }><i className="fa fa-plus fa-2x"></i></button>
			</div>
		);
	}
} );

module.exports = List;
