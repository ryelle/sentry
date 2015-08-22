/**
 * Site Actions: handle the actions take around sites.
 * This includes site settings, plan upgrades
 */

var AppDispatcher = require('../dispatchers/dispatcher');
var AppConstants = require('../constants/constants');

var Actions = {

	/**
	 * @param  {array}  projects
	 */
	fetchProjects: function( projects ) {
		AppDispatcher.handleViewAction({
			actionType: AppConstants.RECEIVE_PROJECTS,
			data: projects
		});
	},

	/**
	 * @param  {array}  lists
	 */
	fetchLists: function( lists ) {
		AppDispatcher.handleViewAction({
			actionType: AppConstants.RECEIVE_LISTS,
			data: lists
		});
	},

	/**
	 * @param  {array}  tasks
	 */
	fetchTasks: function( tasks ) {
		AppDispatcher.handleViewAction({
			actionType: AppConstants.RECEIVE_TASKS,
			data: tasks
		});
	},

};

module.exports = Actions;
