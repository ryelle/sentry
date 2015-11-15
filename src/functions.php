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
		wp_enqueue_style( 'type', 'http://fonts.googleapis.com/css?family=Asap:400,700,400italic,700italic' );
	}
	wp_enqueue_style( 'sentry-style', get_stylesheet_uri(), [], SENTRY_VERSION );

	wp_register_script( 'sentry-vendors', get_template_directory_uri() . '/js/vendor.js', array(), '15.07.28', true );
	wp_register_script( 'sentry-script', get_template_directory_uri() . '/js/sentry.js', array( 'jquery', 'underscore', 'sentry-vendors' ), SENTRY_VERSION, true );

	wp_localize_script( 'sentry-script', 'SentrySettings', array(
		'nonce' => wp_create_nonce( 'wp_rest' ),
		'user' => get_current_user_id(),
		'URL' => array(
			'root' => esc_url_raw( get_rest_url( null, '/wp/v2' ) ),
			'base' => esc_url_raw( home_url() ),
			'theme' => esc_url_raw( get_template_directory_uri() ),
		),
		'colors' => array(
			'personal' => '426c63',
			'automattic' => '05668D',
		),
	) );

	wp_enqueue_script( 'sentry-script' );
}
add_action( 'wp_enqueue_scripts', 'sentry_scripts' );

function sentry_body_class( $classes ){
	global $Airplane_Mode_Core;
	if ( isset( $Airplane_Mode_Core ) && $Airplane_Mode_Core->enabled() ) {
		$classes[] = 'airplane-mode';
	}
	return $classes;
}
add_filter( 'body_class', 'sentry_body_class' );

/**
 * Load REST API customizations
 */
require get_template_directory() . '/inc/rest-api.php';

/**
 * Load dynamic colors file.
 */
require get_template_directory() . '/colors/dynamic-colors.php';
