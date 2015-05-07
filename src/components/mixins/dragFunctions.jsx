var DragFunctions = {
	dragStart: function(e) {
		window.dnd = window.dnd || {};

		window.dnd.container = jQuery( e.target ).closest( '.dragspace' ).get(0);

		window.dnd.placeholder = this.placeholder || jQuery('<div />').addClass('placeholder task empty').get(0),
		window.dnd.dragged = e.currentTarget;

		e.dataTransfer.effectAllowed = 'move';

		// Firefox requires calling dataTransfer.setData
		// for the drag to properly work
		e.dataTransfer.setData("text/html", e.currentTarget);
	},

	dragEnd: function(e) {
		window.dnd.dragged.style.display = "block";
		var position = _.toArray( window.dnd.container.childNodes ).indexOf( window.dnd.placeholder );
		window.dnd.container.removeChild( window.dnd.placeholder );

		// Update state
		this.props.onUpdateSorting( this.props.id, position );
	},

	dragOver: function(e) {
		e.preventDefault();

		window.dnd.dragged.style.display = "none";
		if ( e.target.className == "placeholder" ) return;
		window.dnd.over = jQuery( e.target ).closest( '.task' ).get(0);

		if ( 'undefined' !== typeof window.dnd.over && ( window.dnd.dragged.parentNode == window.dnd.over.parentNode ) ) {
			window.dnd.container.insertBefore( window.dnd.placeholder, window.dnd.over.nextSibling );
		} else if ( jQuery( e.target ).closest( '.status-header' ).length ){
			window.dnd.container.insertBefore( window.dnd.placeholder, window.dnd.container.firstChild );
		} else {
			// Moved to another List!
		}
	},

	blockDrag: function( e ) {
		e.preventDefault();
	}
};

module.exports = DragFunctions;
