/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Renders list of posts
 */
User = React.createClass({
	render: function() {
		return (
			<div className="avatar" >
				<a href="/wp-admin/" className="bypass-react">
					<img src="https://randomuser.me/api/portraits/med/women/74.jpg" />
				</a>
			</div>
		);
	}
});

module.exports = User;
