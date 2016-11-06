/**
 * Created by Homkai on 2016/11/5.
 */
const FILTERS = {
	ALL: 'all',
	ACTIVE: 'active',
	COMPLETED: 'completed'
};

const LOCATIONS = {
	'/': {
		type: 'todo/filter',
		payload: FILTERS.ALL
	},
	'/active': {
		type: 'todo/filter',
		payload: FILTERS.ACTIVE
	},
	'/completed': {
		type: 'todo/filter',
		payload: FILTERS.COMPLETED
	}
};

exports.FILTERS = FILTERS;
exports.LOCATIONS = LOCATIONS;
