<?php
/**
 * Update REST API endpoints with our customizations
 */

class Sentry_RestPosts {
	function __construct() {
		add_action( 'init', array( $this, 'register_post_fields' ) );
	}

	/**
	 * Add our custom fields to the post endpoint
	 */
	function register_post_fields() {
		// Sort Order
		register_api_field( 'post', 'order', array(
			'get_callback'    => array( $this, 'order_get' ),
			'update_callback' => array( $this, 'order_update' )
		) );

		// Tags
		register_api_field( 'post', 'tags', array(
			'get_callback'    => array( $this, 'tags_get' ),
			// 'update_callback' => array( $this, 'tags_update' )
		) );

		// Status
		register_api_field( 'post', 'status', array(
			'get_callback'    => array( $this, 'status_get' ),
		// 	'update_callback' => array( $this, 'status_update' )
		) );
	}

	// Grab the menu order
	function order_get( $_post, $field_name, $request ){
		$post = get_post( $_post['id'] );
		return $post->menu_order;
	}

	// Update the menu order
	function order_update( $value, $_post, $field_name, $request ){
		return wp_update_post( array(
			'ID' => $_post->ID,
			'menu_order' => intval( $value ),
		) );
	}

	/**
	 * Get a list of tag slugs
	 */
	function tags_get( $_post, $field_name, $request ){
		$tags = get_the_terms( $_post['id'], 'post_tag' );
		if ( is_array( $tags ) ) {
			$tags = array_values( wp_list_pluck( $tags, 'slug' ) );
		} else {
			$tags = array();
		}
		return $tags;
	}

	/**
	 * Get the single child category, which corresponds to the task's status
	 */
	function status_get( $_post, $field_name, $request ){
		$status = get_the_terms( $_post['id'], 'category' );
		if ( is_array( $status ) ) {
			$status = wp_list_filter( $status, array( 'parent' => 0 ), 'NOT' );
			if ( ! empty( $status ) ) {
				$status = array_shift( $status );
				$status = $status->slug;
			}
		} else {
			$status = '';
		}
		return $status;
	}
}

new Sentry_RestPosts;

/**
 * If we're in an API request (anything on the frontend where REST API exists), we can use a special child_of query.
 */
function sentry_get_terms_args( $args, $taxonomies ){
	if ( ! is_admin() && defined( 'REST_API_VERSION' ) && isset( $_GET['child_of'] ) ) {
		if ( ! is_numeric( $_GET['child_of'] ) ) {
			$parent = get_term_by( 'slug', $_GET['child_of'], 'category' );
			$parent = $parent->term_id;
		} else {
			$parent = intval( $_GET['child_of'] );
		}
		$args['child_of'] = $parent;
		$args['orderby'] = 'slug';
		$args['order'] = 'asc';
	}
	return $args;
}
add_filter( 'get_terms_args', 'sentry_get_terms_args', 10, 2 );


/**
 * Save the taxonomies when a new post is created via the form.
 */
function sentry_pre_insert_post( $prepared_post, $request ){
	// Short-circuit if we're updating a post
	if ( isset( $request['id'] ) ) {
		return $prepared_post;
	}
	$project = $status = array();

	if ( isset( $request['project'] ) ) {
		if ( $term = term_exists( strtolower( $request['project'] ), 'category' ) ) {
			$project = $term['term_id'];
		}
	}

	if ( empty( $project ) ) {
		return new WP_Error('no-project', 'No project found for this task' );
	}

	if ( isset( $request['category'] ) ) {
		if ( $term = term_exists( strtolower( $request['category'] ), 'category', $project[0] ) ) {
			$status = $term['term_id'];
		}
	}

	$prepared_post->post_category = array( $project, $status );

	if ( isset( $request['tags'] ) ) {
		$tags = trim( $request['tags'], ', ' );
		$prepared_post->tags_input = $tags;
	}

	return $prepared_post;
}
add_filter( 'rest_pre_insert_post', 'sentry_pre_insert_post', 10, 2 );