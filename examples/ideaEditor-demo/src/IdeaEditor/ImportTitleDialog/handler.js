/**
 * @file 导入标题弹窗 - 公共handler
 * @note 对外暴露的接口以及可以复用的callback处理方法
 */
import fetch from '../../common/fetch';

export const loadList = ({dispatch, getState}) => {
    dispatch({
        type: 'ideaEditor/changeImportTitleDialog',
        payload: {
            isRequesting: true
        }
    });

    const {searchQuery} = getState().ideaEditor.importTitleDialog;
    fetch('/getTitleList', {
        searchQuery
    }).then(res => {
        const listData = res.data.listData;

        dispatch({
            type: 'ideaEditor/changeImportTitleDialog',
            payload: {
                listData,
                isRequesting: false
            }
        });
    });
};

export const open = ({dispatch, getState}) => {
    loadList({dispatch, getState});

    dispatch({
        type: 'ideaEditor/changeImportTitleDialog',
        payload: {
            isOpen: true
        }
    });
};

export const close = ({dispatch, getState}) => {
    dispatch({
        type: 'ideaEditor/resetImportTitleDialog'
    });
};
