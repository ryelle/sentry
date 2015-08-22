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
	 * @param  {object}  data
	 * @param  {string}  data.list
	 * @param  {array}  data.tasks
	 */
	fetchTasks: function( data ) {
		AppDispatcher.handleViewAction({
			actionType: AppConstants.RECEIVE_TASKS,
			list: data[0].status,
			tasks: data
		});
	},

};

module.exports = Actions;
