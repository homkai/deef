/**
 * Created by baidu on 17/6/26.
 */
import {router, history} from 'app';

import {init as Todo} from '../components/Todo/common/handler';
import {init as Test} from '../components/Test/common/handler';

const enterModule = {
    Todo,
    Test
};

export const init = ({dispatch, getState}) => {
    router.on({path: '/', exact: true}, {
        onMatch() {
            // redirect到默认模块
            console.log('Redirect to default module', arguments[0]);
            history.replace('/Todo');
        }
    });
    router.on('/:module', {
        onMatch({params: {module}}) {
            // 如下代码无业务意义——帮助理解deef-router START
            if (!arguments[1]) {
                console.log('First time enter module, matchInfo', arguments[0]);
            }
            else {
                console.log('Switch module, matchInfo', arguments[0]);
                console.log('Switch module, lastMathInfo', arguments[1]);
            }
            // 帮助理解deef-router END

            const init = enterModule[module];
            init && init({dispatch, getState});
        }
    });
};