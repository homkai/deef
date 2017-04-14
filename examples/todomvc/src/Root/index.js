/**
 * Created by Homkai on 2016/11/5.
 */
import {connect, history} from 'app';
import UI from './UI';
import {DEFAULT_PAGE} from  './config';

import {show as Todo} from './components/Todo/common/handler';
import {show as Test} from './components/Test/common/handler';

const handleShowPage = {Todo, Test};

export default connect(
    ({app}) => app,
    {
        onGoPage({dispatch, getState}, page) {
            history.push(`/${page}`);
        },
        subscriptions: {
            onHistoryChange({dispatch, getState}) {
                let lastPage = '';
                const onChange = ({pathname}) => {
                    if (pathname === '/') {
                        return history.replace(`/${DEFAULT_PAGE}`);
                    }
                    // path rule /:Page/xxx
                    const page = pathname.split('/')[1];
                    if (lastPage === page) {
                        return;
                    }
                    lastPage = page;
                    const handleShow = handleShowPage[page];
                    if (!handleShow) {
                        return history.replace('/');
                    }
                    handleShow({dispatch, getState});
                };
                history.listen(onChange);
                onChange(history.location);
            }
        }
    }
)(UI);