/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var API = require( 'utils/server' );

/**
 * Renders list of posts
 */
var AddTask = React.createClass( {
	submit: function( event ) {
		event.preventDefault();

		var project = event.target['task-project'].value,
			cats = event.target['task-category'].value,
			tags = event.target['task-tags'].value.replace( cats, '' );

		API.createTask( {
			title: event.target['task-name'].value,
			type: 'post',
			status: 'publish',
			project: project,
			category: cats,
			tags: tags,
		} );
	},

	render: function() {
		var close = '';
		if ( this.props.enableClose ) {
			close = (
				<a href="#" className="cancel" onClick={this.props.closeForm} >x</a>
			);
		}

		return (
			<form className="task-form" onSubmit={this.submit}>
				{ close }
				<h4>Add a New Task</h4>
				<div className="task-name">
					<label htmlFor="task-name">Your Task</label>
					<input name="task-name" type="text" placeholder="ex: design new theme" />
				</div>
				<div className="task-tags">
					<label htmlFor="task-tags">Labels</label>
					<input name="task-project" type="hidden" value={this.props.project} />
					<input name="task-category" type="hidden" value={this.props.title} />
					<input name="task-tags" type="text" placeholder="theme, in progress" defaultValue={this.props.title} />
				</div>
				<div className="task-submit">
					<input name="task-submit" type="submit" value="Create Task" />
				</div>
			</form>
		);
	}
});

module.exports = AddTask;
