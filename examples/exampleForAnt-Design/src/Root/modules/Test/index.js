/**
 * Created by DOCer on 2017/7/11.
 */
import {connect} from 'app';
import UI from './UI/';

export default connect(
    ({test}) => (test),
    {
        onStart({dispatch, getState}){
            dispatch({
                type: "test/showTableLoading"
            });
            // ajax request after empty completing
            setTimeout(() => {
                dispatch({
                    type: "test/hideTableLoading",
                });
                dispatch({
                    type: "test/setSelectedRowKeys",
                    payload: [2]
                });
            }, 800);
        },
        onChange({dispatch, getState}, selectedRowKeys){
            dispatch({
                type: "test/setSelectedRowKeys",
                payload: selectedRowKeys
            });
        },
        onPanelChange({dispatch, getState}, value, mode){
            console.log(value, mode);
        },
        onCascaderChange({dispatch, getState}, value){
            console.log(value);
        },
        onCollapseChange({dispatch, getState}, key){
            console.log(key);
        },
        onDecline ({dispatch, getState}){
            dispatch({
                type: "test/decline"
            });
        },
        onIncrease ({dispatch, getState}){
            dispatch({
                type: "test/increase"
            });
        },
    }
)(UI);