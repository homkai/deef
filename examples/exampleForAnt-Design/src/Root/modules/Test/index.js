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
        onPanelChange({dispatch, getState}, {mode, data}){
            console.log(data, mode);
        },
        onCascaderChange({dispatch, getState}, value){
            console.log(value);
        },
        onCollapseChange({dispatch, getState}, key){
            console.log(key);
        },
        onDecline ({dispatch, getState}){
            let percent = getState().test.progressData.percent - 10;
            if (percent < 0) {
                percent = 0;
            }
            dispatch({
                type: "test/decline",
                payload: percent
            });
        },
        onIncrease ({dispatch, getState}){
            let percent = getState().test.progressData.percent + 10;
            if (percent > 100) {
                percent = 100;
            }
            dispatch({
                type: "test/increase",
                payload: percent
            });
        },
    }
)(UI);