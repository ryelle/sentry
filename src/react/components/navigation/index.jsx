/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var User = require( '../user' ),
	AppStore = require( 'store/app-store' ),
	API = require( 'utils/server' );

/**
 * Method to retrieve state from Stores
 */
function getState() {
	return {
		data: AppStore.getProjects(),
		current: null,
	};
}

/**
 * Renders list of posts
 */
var Navigation = React.createClass( {

	getInitialState: function() {
		return getState();
	},
	componentDidMount: function() {
		API.getProjects( this.props.url );
		AppStore.addChangeListener( this._onChange );
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener( this._onChange );
	},
	_onChange: function() {
		this.setState( getState() );
	},

	render: function() {
		var self = this,
			projects = this.state.data.map( function( cat ) {
				if ( 'uncategorized' === cat.slug || cat.parent > 0 ) return null;
				var displayName = ( cat.name.length > 2 )? cat.name.slice( 0, 1 ): cat.name;
				var theClasses = 'project-link';
				if ( cat.slug === self.state.current ) {
					theClasses += ' current';
				}
				return (
					<a key={ cat.id } data-cat={ cat.slug } href={ cat.link } className={ theClasses }>
						{ displayName }
					</a>
				);
			} );

		return (
			<header className="site-header">
				{ projects }
				<User />
			</header>
		);
	}
} );

module.exports = Navigation;
