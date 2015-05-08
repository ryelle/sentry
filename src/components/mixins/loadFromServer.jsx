var loadFromServer = {

	getData: function() {
		var postData = JSON.parse( localStorage.getItem( this.props.url ) );
		if ( false && postData ) {
			this.setState({data: postData});
		} else {
			// Always AJAX, to check for new posts.
			jQuery.ajax({
				url: this.props.url,
				dataType: 'json',
				success: function(data) {
					if ( data.constructor !== Array ) {
						data = [ data ];
					}
					localStorage.setItem( this.props.url, JSON.stringify( data ) );
					this.setState({data: data});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(this.props.url, status, err.toString());
				}.bind(this)
			});
		}

		// Scoll to top on page change
		window.scroll(0,0);
	},

	getUser: function() {
		var url = '/wp-json/wp/v2/users/' + SentrySettings.user,
		    postData = JSON.parse( localStorage.getItem( url ) );
		if ( false && postData ) {
			this.setState({data: postData});
		} else {
			// Always AJAX, to check for new posts.
			jQuery.ajax({
				url: url,
				dataType: 'json',
				success: function(data) {
					localStorage.setItem( url, JSON.stringify( data ) );
					this.setState({data: data});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error( url, status, err.toString() );
				}.bind(this)
			});
		}
	},

};

module.exports = loadFromServer;
