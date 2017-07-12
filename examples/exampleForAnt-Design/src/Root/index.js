/**
 * Created by DOCer 17/7/11.
 */
import {connect, history} from 'app';
import UI from './UI';

export default connect(
    ({app}) => app,
    {
        onGoModule({dispatch, getState}, ...navInfo) {
            const [, key, keyPath] = navInfo;
            const path = keyPath[1] ? `${keyPath[1]}/${keyPath[0]}` : `Home/${keyPath[0]}`;
            //改用replace防止push相同时报错
            history.replace(`/${path}`);
            dispatch({
                type: 'app/changeModule',
                payload: key
            })
        }
    }
)(UI);