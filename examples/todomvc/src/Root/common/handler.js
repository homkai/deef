/**
 * Created by baidu on 17/6/26.
 */
import {router, history} from 'app';
import once from 'lodash/once';

import {init as Todo} from '../components/Todo/common/handler';
import {init as Test} from '../components/Test/common/handler';

const enterPage = {
    Todo,
    Test
};

export const init = ({dispatch, getState}) => {
    router.on({path: '/', exact: true}, {
        onEnter() {
            history.replace('/Todo');
        }
    });
    router.on('/:page', {
        onEnter({params: {page}}) {
            const init = enterPage[page];
            init && init({dispatch, getState});
        }
    });
};