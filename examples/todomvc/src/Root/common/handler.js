/**
 * Created by baidu on 17/6/26.
 */
import {router} from 'app';

import {init as Todo} from '../components/Todo/common/handler';
import {init as Test} from '../components/Test/common/handler';

const enterPage = {
    Todo,
    Test
};

export const init = ({dispatch, getState}) => {
    router.on('/:page', {
        onEnter(noop, {params: {page}}) {
            const init = enterPage[page];
            init && init({dispatch, getState});
        }
    });
};