var Server = {

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
		var url = SentrySettings.URL.root + '/users/' + SentrySettings.user,
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

	savePostOrder: function(){
		// Send the updated order to the API.
		_.each( this.state.data, function( post ){
			var url = SentrySettings.URL.root + '/posts/' + post.id,
				postData = {
					id: post.id,
					order: post.order
				};
			console.log( postData );

			jQuery.ajax({
				url: url,
				type: 'post',
				data: postData,
				dataType: 'json',
				beforeSend: function( xhr, settings ) {
					xhr.setRequestHeader('X-WP-Nonce', SentrySettings.nonce);
				},
				success: function(data) {
					// Nothing??
				}.bind(this),
				error: function(xhr, status, err) {
					console.error( url, status, err.toString() );
				}.bind(this)
			});
		});
	},

};

module.exports = Server;
