/**
 * Created by DOCer 17/7/11.
 */
import {connect} from 'app';
import UI from './UI';

export default connect(
    ({app}) => app,
    {
        onGoModule({dispatch, getState}, page) {
        	dispatch({
        		type: 'app/changeModule',
        		payload: page
        	})
        }
    }
)(UI);