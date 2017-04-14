/**
 * Created by Homkai on 2016/11/5.
 */
export const FILTERS = {
	ALL: 'all',
	ACTIVE: 'active',
	COMPLETED: 'completed'
};

export const LOCATION_FILTER_MAP = {
	'/Todo': FILTERS.ALL,
	'/Todo/active': FILTERS.ACTIVE,
	'/Todo/completed': FILTERS.COMPLETED
};

