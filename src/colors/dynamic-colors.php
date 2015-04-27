<?php
/**
 * Dynamically pull colors from featured image
 */

class Sentry_ProjectColors {

	private $cache_prefix = 'sentry_css_';

	function __construct() {
		add_action( 'init',              array( $this, 'rewrites' ) );
		add_action( 'template_redirect', array( $this, 'stylesheet' ) );

		add_action( 'wp_head', array( $this, 'wp_head' ) );

		if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
			$this->cache_prefix .= SENTRY_VERSION . '_';
		} else {
			flush_rewrite_rules( true );
		}
	}

	public function rewrites(){
		if ( ! class_exists( 'Jetpack' ) ) {
			return;
		}

		add_rewrite_tag( '%sentry%', '([^&]+)' );
		add_rewrite_tag( '%sentry_color%', '([^&]+)' );
		add_rewrite_rule( '^sentry-css/([^/]+)/?', 'index.php?sentry=true&sentry_color=$matches[1]', 'top' );
	}

	public function wp_head() {
		if ( ! class_exists( 'Jetpack' ) ) {
			return;
		}

		$color = 'A99E8D'; // default color: ugly tan
		$this->link_css( $color );
	}

	public function link_css( $color ){
		printf(
			'<link rel="stylesheet" id="sentry-color-css" href="/sentry-css/%s/" type="text/css" media="all">',
			$color
		);
	}

	public function stylesheet(){
		if ( ! get_query_var( 'sentry' ) ){
			return;
		}

		$color = get_query_var( 'sentry_color' );
		$valid_color = preg_match( '/^[0-9a-f]{3}([0-9a-f]{3})?$/i', $color );
		if ( ( '424046' == $color ) || ! $color || ! $valid_color ) {
			die();
		}

		$cache = true;
		if ( isset( $_GET['no-cache'] ) ){
			$cache = false;
		}

		$css = $this->generate_css( $color, $cache );

		header( 'Content-type: text/css; charset: UTF-8' );
		echo $css;
		die();
	}

	public function generate_css( $color, $cache = true ) {
		if ( ! class_exists( 'Jetpack_Custom_CSS' ) ) {
			require Jetpack::get_module_path( 'custom-css' );
		}
		$cache = false;

		$sass = wp_remote_retrieve_body( wp_remote_get( get_template_directory_uri() . '/colors/colors.scss' ) );

		$key = $this->cache_prefix . str_replace( '#', '', $color );
		$css = ( $cache ) ? get_transient( $key ) : false;
		if ( ! $css ){
			$sass = '$base-color: #' . $color . '; ' . $sass;

			/**
			 * Filter the sass used for dynamic color CSS generation
			 *
			 * @param string  $sass   The Sass used to generate the CSS
			 * @param string  $color  The color picked from the image, used as
			 *                        the $base-color for all other color variables
			 */
			$sass = apply_filters( 'sentry_color_scheme', $sass, $color );
			$css = Jetpack_Custom_CSS::minify( $sass, 'sass' );

			if ( $cache && $css ) {
				set_transient( $key, $css, WEEK_IN_SECONDS );
			}
		}
		return $css;
	}
}

global $sentry_project_colors;
$sentry_project_colors = new Sentry_ProjectColors();
