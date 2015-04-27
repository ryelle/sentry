/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var loadFromServer = require( 'mixins/loadFromServer' );

/**
 * Renders list of posts
 */
User = React.createClass({
	mixins: [ loadFromServer ],

	getInitialState: function() {
		return {data: { avatar_url: SentrySettings.themeURL + '/images/default-user.gif' }};
	},
	componentDidMount: function() {
		this.getUser();
	},
	componentDidUpdate: function(prevProps, prevState) {
		if ( prevProps !== this.props ) {
			this.getUser();
		}
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
