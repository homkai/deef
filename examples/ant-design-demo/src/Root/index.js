/**
 * Created by DOCer 17/7/11.
 */
import {connect, history} from 'app';
import UI from './UI';

export default connect(
    ({app}) => app,
    {
        onGoModule({dispatch, getState}, {item, key, keyPath}) {
            const path = keyPath[1] ? `${keyPath[1]}/${keyPath[0]}` : `Home/${keyPath[0]}`;
            history.push(`/${path}`);
            dispatch({
                type: 'app/changeModule',
                payload: key
            });
        }
    }
)(UI);