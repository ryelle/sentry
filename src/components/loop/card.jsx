/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Renders list of posts
 */
Card = React.createClass({
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
				<span key='none' className='tag'>&nbsp;</span>
			);
		}
		return (
			<div className="card" >
				{ tags }
				<h3 className="task-title">{ this.props.title }</h3>
			</div>
		);
	}
});

module.exports = Card;
