/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var dragFunctions = require( 'utils/dragFunctions' );

/**
 * Renders list of posts
 */
var Task = React.createClass({
	mixins: [ dragFunctions ],

	propTypes: {
		id: React.PropTypes.number,
		link: React.PropTypes.string,
		title: React.PropTypes.string,
		date: React.PropTypes.string,
		content: React.PropTypes.string,
		tags: React.PropTypes.array,
		featured_image: React.PropTypes.number,
		onUpdateSorting: React.PropTypes.func,
		order: React.PropTypes.number,
	},

	render: function() {
		var tags = null;

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
