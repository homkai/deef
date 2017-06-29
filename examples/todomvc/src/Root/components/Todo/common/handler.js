/**
 * Created by baidu on 17/4/12.
 */
import {router, history} from 'app';

import {LOCATION_FILTER_MAP} from '../config';


// 当前组件的初始化动作应在上层callback调用
export function init({dispatch, getState}) {
    dispatch({
        type: 'app/changePage',
        payload: 'Todo'
    });

    route({dispatch, getState});
    fetchDemo({dispatch, getState});
}

function route({dispatch, getState}) {
    router.on('/Todo/:filter?', {
        onEnter({params: {filter}}) {
            if (!filter) {
                return history.replace('/Todo/all');
            }
            const filterType = LOCATION_FILTER_MAP[filter];
            filterType && dispatch({
                type: 'todo/filter',
                payload: filterType
            });
        }
    });
}

function fetchDemo({dispatch, getState}) {
    fetch('https://api.github.com/repos/homkai/deef')
        .then(res => res.json())
        .then(json => {
            json.full_name && dispatch({
                type: 'todo/testAsync',
                payload: json.full_name
            });
        });
}