/**
 * Created by baidu on 17/4/12.
 */
import {router, history} from 'app';

import {LOCATION_FILTER_MAP} from './config';


// 当前组件的初始化动作应在上层callback调用
export function init({dispatch, getState}) {
    dispatch({
        type: 'app/changeModule',
        payload: 'Todo'
    });

    route({dispatch, getState});
    fetchDemo({dispatch, getState});
}

function route({dispatch, getState}) {
    router.register('/sub1/Todo/:filter?', {
        onMatch({params: {filter}}, [lastMatchInfo = {}]) {
            // 如下代码无业务意义——帮助理解deef-router START
            if (!arguments[1]) {
                // onMatch注入两个参数(matchInfo, lastMatchInfo)：本次命中rule的match信息，和上次命中rule时的match信息
                // 如果没有上次命中的信息则意味着是从其他rule转入本rule
                console.log('Entered Todo module, matchInfo', arguments[0]);
            }
            else {
                // 如有上次命中的信息则意味着是上次也是命中了本rule，即统一rule不同params的switch
                console.log('In Todo module switch filter, matchInfo', arguments[0].params);
                console.log('In Todo module switch filter, lastMatchInfo', lastMatchInfo.params);
            }
            // 帮助理解deef-router END

            if (!filter) {
                // 如果没有filter，直接转到all
                return history.replace('/sub1/Todo/all');
            }
            const filterType = LOCATION_FILTER_MAP[filter];
            filterType && dispatch({
                type: 'todo/filter',
                payload: filterType
            });
        },
        onBreakMatch([lastMatchInfo]) {
            console.log('Leave Todo module, lastMatchInfo', lastMatchInfo);
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