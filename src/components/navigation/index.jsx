/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var User = require( './user' ),
    Server = require( 'mixins/server' );

/**
 * Renders list of posts
 */
Navigation = React.createClass({
	mixins: [ Server ],

	getInitialState: function() {
		return {
			data: [],
			current: null
		};
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
