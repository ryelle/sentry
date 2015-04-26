/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var Task = require( './task' ),
    loadFromServer = require( '../../mixins/loadFromServer' );

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

	render: function() {
		var tasks = this.state.data.map( function ( post ) {
			return (
				<Task key={post.id} id={post.id} post_class={post.post_class} link={post.link} title={post.title} date={post.date} content={post.content} tags={post.tags} featured_image={ post.featured_image } />
			);
		});

		var theClasses = this.props.slug + ' list';

		return (
			<div className={theClasses} >
				<header className="status-header">
					<h1 className="status-title">{this.props.name}</h1>
				</header>
				{ tasks }
				<button className="add-task"><i className="fa fa-plus fa-2x">+</i></button>
			</div>
		);
	}
});

module.exports = List;