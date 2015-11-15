/**
 * External dependencies
 */
var assign = require('object-assign'),
	EventEmitter = require('events').EventEmitter,
	findIndex = require( 'lodash/array/findIndex' ),
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

/**
 * Load a single task into our task list
 *
 * @param {string} list - name of list for this task set
 * @param {array} tasks - tasks object, recently added to site
 */
function _removeTask( task ) {
	var list, key,
		found = false;

	for ( let i in _tasks ) {
		for ( let j in _tasks[ i ] ) {
			if ( _tasks[ i ][ j ].id == task.id ) {
				found = true;
				list = i;
				key = j;
				break;
			}
		}
	}

	if ( found ) {
		console.log( "removing…", list, key );
		_tasks[ list ].splice( key, 1 );
	}
}

/**
 * Load a single task into our task list
 *
 * @param {string} list - name of list for this task set
 * @param {array} tasks - tasks object, recently added to site
 */
function _loadTask( list, task ) {
	console.log( "adding…", list, task );
	_tasks[ list ].push( task );
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
			case AppConstants.RECEIVE_TASK:
				_removeTask( action.task );
				_loadTask( action.list, action.task );
				break;
			case AppConstants.ADD_TASK:
				_loadTask( action.list, action.task );
				break;
		}

		AppStore.emitChange();

		return true;
	})

});

module.exports = AppStore;
