/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var dragFunctions = require( 'utils/dragFunctions' );

/**
 * Renders list of posts
 */
var Task = React.createClass({
	mixins: [ dragFunctions ],

	render: function() {
		if ( 'undefined' !== typeof this.props.tags ) {
			tags = this.props.tags.map( function ( tag ) {
				var theClasses = tag + ' ' + 'tag';
				return (
					<span key={tag} className={theClasses}>{tag}</span>
				);
			});
		} else {
			tags = (
				<span dragover={this.blockDrag} key='none' className='tag'>&nbsp;</span>
			);
		}
		return (
			<div className="task" draggable="true" onDragEnd={this.dragEnd} onDragStart={this.dragStart} pid={ this.props.id }>
				{ tags }
				<h3 dragover={this.blockDrag} className="task-title">{ this.props.title }</h3>
			</div>
		);
	}
});

module.exports = Task;
