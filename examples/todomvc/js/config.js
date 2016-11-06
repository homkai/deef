/**
 * Created by Homkai on 2016/11/5.
 */
const FILTERS = {
	ALL: 'all',
	ACTIVE: 'active',
	COMPLETED: 'completed'
};

// 路由表 是 rule到action的map，比react-router更灵活
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
