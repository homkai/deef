/**
 * Created by DOCer 17/7/11.
 */
import {router, history} from 'app';
import {init as Test} from './modules/Test/handler';
const enterModule = {
    Test
};

export const init = ({dispatch, getState}) => {
    router.register({path: '/', exact: true}, {
        onMatch() {
            // redirect到默认模块
            console.log('Redirect to default module', arguments[0]);
            history.replace('/Home/Test');
        }
    });
    router.register({
        pathname: '/TodoEntry',
        search: '?form=Test'
    }, {
        onMatch() {
            console.log('Enter Todo from Test');
            history.replace('/Test');
        }
    });
    router.register('/:module', {
        onMatch({params: {module}}, [lastMatchInfo = {}]) {
            const path = history.location.pathname.split('/')[2];
            //初始化app中的module
            dispatch({
                type: 'app/changeModule',
                payload: path
            })
            const init = enterModule[path];
            if (!init) {
                return;
            }

            // 如下代码无业务意义——帮助理解deef-router START
            if (!arguments[1]) {
                console.log('First time enter module, matchInfo', arguments[0]);
            }
            else {
                console.log('Switch module, matchInfo', arguments[0]);
                console.log('Switch module, lastMathInfo', lastMatchInfo);
            }
            // 帮助理解deef-router END

            init && init({dispatch, getState});
        }
    });
};