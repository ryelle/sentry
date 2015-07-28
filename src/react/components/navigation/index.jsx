/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var User = require( '../user' ),
	Server = require( 'utils/server' );

/**
 * Renders list of posts
 */
var Navigation = React.createClass({
	mixins: [ Server ],

	getInitialState: function() {
		return {
			data: [],
			current: null
		};
	},
	componentDidMount: function() {
		// Get from server
		this.setState({
			data: [],
			current: null
		});
	},

	render: function() {
		var self = this,
			projects = this.state.data.map( function ( cat ) {
				if ( "uncategorized" == cat.slug || cat.parent > 0 ) return null;
				var displayName = ( cat.name.length > 2 )? cat.name.slice( 0, 1 ): cat.name;
				var theClasses = 'project-link';
				if ( cat.slug == self.state.current ) {
					theClasses += ' current';
				}
				return (
					<a key={cat.id} data-cat={cat.slug} href={cat.link} className={theClasses}>
						{ displayName }
					</a>
				);
			});

		return (
			<header className="site-header">
				{ projects }
				<User />
			</header>
		);
	}
});

module.exports = Navigation;
