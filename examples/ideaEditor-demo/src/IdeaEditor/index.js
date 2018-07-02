/**
 * Created by Homkai on 2016/11/5.
 */
import {connect} from 'app';
import UI from './UI';
import {alertDialog} from '../common/utils';
import {open as openImportTitleDialog} from './ImportTitleDialog/handler';

export default connect(
    ({ideaEditor: {formData}}) => ({formData}),
    {
        onChangeField({dispatch}, field, e) {
            dispatch({
                type: 'ideaEditor/changeFormField',
                payload: {
                    field,
                    value: e.target.value
                }
            });
        },
        onChangeTitle({dispatch, getState}, value, {isAppend = false} = {}) {
            const title = !isAppend ? '' : getState().ideaEditor.formData.title;
            dispatch({
                type: 'ideaEditor/changeFormField',
                payload: {
                    field: 'title',
                    value: title + value
                }
            });
        },
        onSubmitValidate({dispatch}, errorMessageList) {
            errorMessageList && alertDialog({
                message: errorMessageList
            });
        },
        onSubmit({dispatch}, form) {
            alertDialog({
                message: '提交成功'
            });

            dispatch({
                type: 'ideaEditor/resetFormData'
            });
        },
        onOpenImportTitleDialog: openImportTitleDialog
    }
)(UI);