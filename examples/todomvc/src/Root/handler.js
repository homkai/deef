import {router, history} from 'app';

import {init as Todo} from './modules/Todo/handler';
import {init as Test} from './modules/Test/handler';

const initMap = {
    Todo,
    Test
};

export const init = ({dispatch, getState}) => {
    router.register({path: '/', exact: true}, {
        onMatch() {
            // redirect到默认模块
            console.log('Redirect to default module', arguments[0]);
            history.replace('/Todo');
        }
    });
    router.register({
        pathname: '/TodoEntry',
        search: '?form=Test'
    }, {
        onMatch() {
            console.log('Enter Todo from Test');
            history.replace('/Todo');
        }
    });
    router.register('/:module', {
        onMatch({params: {module}}, [lastMatchInfo = {}]) {
            // 如下代码无业务意义——帮助理解deef-router START
            if (!arguments[1]) {
                console.log('First time enter module, matchInfo', arguments[0]);
            }
            else {
                console.log('Switch module, matchInfo', arguments[0]);
                console.log('Switch module, lastMathInfo', lastMatchInfo);
            }
            // 帮助理解deef-router END

            const initModule = initMap[module];
            if (!initModule) {
                return;
            }

            dispatch({
                type: 'app/changeModule',
                payload: module
            });
            initModule && initModule({dispatch, getState});
        }
    });
};