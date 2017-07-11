/**
 * Created by DOCer on 2017/7/11.
 */
import {connect} from 'app';
import UI from './UI';

export default connect(
    ({test}) => test,
    {
        onDecline ({dispatch, getState}){
		    dispatch({
		    	type: "test/decline"
		    })
		},
		onIncrease ({dispatch, getState}){
		    dispatch({
		    	type: "test/increase"
		    })
		}
    }
)(UI);