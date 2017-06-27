/**
 * Created by Homkai on 2016/11/5.
 */
import {connect, history} from 'app';
import UI from './UI';

export default connect(
    ({app}) => app,
    {
        onGoPage({dispatch, getState}, page) {
            history.push(`/${page}`);
        }
    }
)(UI);