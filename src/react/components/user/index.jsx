/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var Server = require('utils/server');

/**
 * Renders list of posts
 */
var User = React.createClass({
	getInitialState: function() {
		return {data: { avatar_url: SentrySettings.URL.theme + '/images/default-user.gif' }};
	},
	componentDidMount: function() {
		this.setState({data: { avatar_url: SentrySettings.URL.theme + '/images/default-user.gif' }});
	},

	render: function() {
		return (
			<div className="avatar" >
				<a href="/wp-admin/" className="bypass-react">
					<img src={this.state.data.avatar_url} />
				</a>
			</div>
		);
	}
});

module.exports = User;
