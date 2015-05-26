/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Renders list of posts
 */
AddTask = React.createClass({
	render: function() {
		var close = '';
		if ( this.props.enableClose ) {
			close = (
				<a href="#" className="cancel" onClick={this.props.closeForm} >x</a>
			);
		}

		return (
			<form className="task-form">
				{ close }
				<h4>Add a New Task</h4>
				<div className="task-name">
					<label htmlFor="task-name">Your Task</label>
					<input name="task-name" type="text" placeholder="ex: design new theme" />
				</div>
				<div className="task-tags">
					<label htmlFor="task-tags">Labels</label>
					<input name="task-tags" type="text" placeholder="theme, in progress" defaultValue={this.props.title} />
				</div>
				<div className="task-submit">
					<input name="task-submit" type="button" value="Create Task" />
				</div>
			</form>
		);
	}
});

module.exports = AddTask;
