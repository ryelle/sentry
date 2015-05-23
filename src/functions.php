<?php

if ( ! defined( 'SENTRY_VERSION' ) ) {
	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		define( 'SENTRY_VERSION', time() );
	} else {
		define( 'SENTRY_VERSION', '0.1' );
	}
}

if ( ! function_exists( 'sentry_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function sentry_setup() {

	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 */
	load_theme_textdomain( 'sentry', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	add_theme_support( 'post-thumbnails' );
}
endif; // sentry_setup
add_action( 'after_setup_theme', 'sentry_setup' );

function sentry_scripts() {
	global $Airplane_Mode_Core;
	if ( ! isset( $Airplane_Mode_Core ) || ! $Airplane_Mode_Core->enabled() ) {
		wp_enqueue_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css', [], '4.3.0' );
	}
	wp_enqueue_style( 'sentry-style', get_stylesheet_uri(), [], SENTRY_VERSION );

	wp_register_script( 'sentry-script', get_template_directory_uri() . '/js/sentry.js', array( 'jquery', 'underscore' ), SENTRY_VERSION, true );

	wp_localize_script( 'sentry-script', 'SentrySettings', array(
		'root' => esc_url_raw( get_rest_url() ),
		'nonce' => wp_create_nonce( 'wp_rest' ),
		'baseURL' => home_url(),
		'themeURL' => get_template_directory_uri(),
		'user' => get_current_user_id(),
		'colors' => array(
			'personal' => '426c63',
			'automattic' => '05668D',
		),
	) );

	wp_enqueue_script( 'sentry-script' );
}
add_action( 'wp_enqueue_scripts', 'sentry_scripts' );

function sentry_get_json( $_post ) {

	$tags = get_the_terms( $_post->data['id'], 'post_tag' );
	if ( is_array( $tags ) ) {
		$tags = array_values( wp_list_pluck( $tags, 'slug' ) );
	} else {
		$tags = [];
	}

	$status = get_the_terms( $_post->data['id'], 'category' );
	if ( is_array( $status ) ) {
		$status = wp_list_filter( $status, array( 'parent' => 0 ), 'NOT' );
		if ( ! empty( $status ) ) {
			$status = array_shift( $status );
			$status = $status->slug;
		}
	} else {
		$status = '';
	}

	$post = get_post( $_post->data['id'] );
	$_post->data['order'] = $post->menu_order;

	$_post->data['tags'] = $tags;
	$_post->data['status'] = $status;

	return $_post;
}
add_filter( 'rest_prepare_post', 'sentry_get_json' );

function sentry_get_terms_args( $args, $taxonomies ){
	if ( ! is_admin() && defined( 'REST_API_VERSION' ) && isset( $_GET['child_of'] ) ) {
		if ( ! is_numeric( $_GET['child_of'] ) ) {
			$parent = get_term_by( 'slug', $_GET['child_of'], 'category' );
			$parent = $parent->term_id;
		} else {
			$parent = intval( $_GET['child_of'] );
		}
		$args['child_of'] = $parent;
	}
	return $args;
}
add_filter( 'get_terms_args', 'sentry_get_terms_args', 10, 2 );

/**
 * Load dynamic colors file.
 */
require get_template_directory() . '/colors/dynamic-colors.php';
