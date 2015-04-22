/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var loadFromServer = require( './mixins/loadFromServer.jsx' );

/**
 * Renders list of posts
 */
SiteHeader = React.createClass({
	mixins: [ loadFromServer ],

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

	handleClick: function( event ) {
		this.setState({ current: event.currentTarget.dataset.cat });
	},

	render: function() {
		var self = this,
		    Boards = this.state.data.map( function ( cat ) {
				if ( "uncategorized" == cat.slug || cat.parent > 0 ) return null;
				var displayName = ( cat.name.length > 2 )? cat.name.slice( 0, 1 ): cat.name;
				var theClasses = '';
				if ( cat.id == self.state.current ) {
					theClasses = 'current';
				}
				return (
					<a key={cat.id} data-cat={cat.id} href={cat.link} onClick={self.handleClick} className={theClasses}>
						{ displayName }
					</a>
				);
			});

		return (
			<header className="site-header">{Boards}</header>
		);
	}
});

module.exports = SiteHeader;
