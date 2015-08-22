/**
 * External dependencies
 */
var assign = require('object-assign'),
	EventEmitter = require('events').EventEmitter,
	page = require( 'page' );

/**
 * Internal dependencies
 */
var AppDispatcher = require('../dispatchers/dispatcher'),
	AppConstants = require('../constants/constants');

var CHANGE_EVENT = 'change';

/**
 * Our working project list
 * @type {array}
 * @protected
 */
var _projects = [];

/**
 * Our working "lists" list
 * @type {array}
 * @protected
 */
var _lists = [];

/**
 * Our working task lists
 * @type {object}
 * @protected
 */
var _tasks = {};

/**
 * Load this array into our projects list
 *
 * @param {array} data - array of current projects, pulled from API
 */
function _loadProjects( data ) {
	_projects = data;
}

/**
 * Load this array into our "lists" list
 *
 * @param {array} data - array of lists, pulled from API
 */
function _loadLists( data ) {
	_lists = data;
}

/**
 * Load this array into our task list
 *
 * @param {string} list - name of list for this task set
 * @param {array} tasks - array of tasks, pulled from API
 */
function _loadTasks( list, tasks ) {
	_tasks[ list ] = tasks;
}

var AppStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit( CHANGE_EVENT );
	},

	addChangeListener: function( callback ) {
		this.on( CHANGE_EVENT, callback );
	},

	removeChangeListener: function( callback ){
		this.removeListener( CHANGE_EVENT, callback );
	},

	/**
	 * Get the projects list
	 *
	 * @returns {array}
	 */
	getProjects: function() {
		return _projects;
	},

	/**
	 * Get a single project by ID
	 *
	 * @returns {object}
	 */
	getProject: function( id ) {
		var project = {};
		return project;
	},

	/**
	 * Get the "lists" list
	 *
	 * @returns {array}
	 */
	getLists: function() {
		return _lists;
	},

	/**
	 * Get a single list by ID
	 *
	 * @returns {object}
	 */
	getList: function( id ) {
		var list = {};
		return list;
	},

	/**
	 * Get the tasks list
	 *
	 * @returns {array}
	 */
	getTasks: function( list ) {
		return _tasks[ list ];
	},

	/**
	 * Get a single task by ID
	 *
	 * @returns {object}
	 */
	getTask: function( id ) {
		var task = {};
		return task;
	},

	// Watch for store actions, and dispatch the above functions as necessary.
	dispatcherIndex: AppDispatcher.register( function( payload ) {
		var action = payload.action; // this is our action from handleViewAction

		switch( action.actionType ){
			case AppConstants.RECEIVE_PROJECTS:
				_loadProjects( action.data );
				break;
			case AppConstants.RECEIVE_LISTS:
				_loadLists( action.data );
				break;
			case AppConstants.RECEIVE_TASKS:
				_loadTasks( action.list, action.tasks );
				break;
		}

		AppStore.emitChange();

		return true;
	})

});

module.exports = AppStore;
