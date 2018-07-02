/**
 * @file 导入标题弹窗
 */
import {connect} from 'app';
import UI from './UI';
import {loadList, close} from './handler'

export default connect(
    ({ideaEditor: {importTitleDialog}}) => importTitleDialog,
    {
        onInputSearch({dispatch, getState}, e) {
            dispatch({
                type: 'ideaEditor/changeImportTitleDialog',
                payload: {
                    searchQuery: e.target.value
                }
            });
        },
        onClickImport({dispatch, getState}, changeTitle, title) {
            changeTitle(title, {isAppend: true});
            close({dispatch, getState});
        },
        onSearch: loadList,
        onClose: close
    }
)(UI);