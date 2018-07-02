import React from 'react';
import _ from 'lodash';

import {TextBox, Button} from 'fcui2';
import FormWithValidation from '../common/ui/FormWithValidation.jsx';

import ImportTitleDialog from './ImportTitleDialog';
import {DEFAULT_PREVIEW_MATERIAL} from './config';

import './style.less'

const INPUT_WIDTH = 350;

export default ({formData, ...callbacks}) => {
    const {onChangeField, onOpenImportTitleDialog, onChangeTitle, onSubmitValidate, onSubmit} = callbacks;

    return <main className="idea-editor-main">
        <h1>创意编辑器</h1>
        <FormWithValidation
            onSubmitValidate={onSubmitValidate}
            onSubmit={onSubmit}
        >
            <div className="idea-editor-main-controls">
                <div className="row">
                    <div className="label">标题：</div>
                    <div className="control">
                        <TextBox
                            width={INPUT_WIDTH}
                            name="创意标题"
                            value={formData.title}
                            onChange={_.partial(onChangeField, 'title')}
                            validations={{required: true}}
                        />
                    </div>
                    <div className="tip">
                        <Button label="导入已有标题" onClick={onOpenImportTitleDialog} />
                    </div>
                </div>
                <div className="row">
                    <div className="label">URL：</div>
                    <div className="control">
                        <TextBox
                            width={INPUT_WIDTH}
                            name="创意URL"
                            value={formData.url}
                            onChange={_.partial(onChangeField, 'url')}
                            validations={{required: true, isUrl: true}}
                        />
                    </div>
                </div>
            </div>
            <div className="idea-editor-main-preview">
                <div>预览：</div>
                <div className="preview">
                    <div className="preview-title">{formData.title || DEFAULT_PREVIEW_MATERIAL.title}</div>
                    <div className="preview-brand">{DEFAULT_PREVIEW_MATERIAL.brand}</div>
                </div>
            </div>
            <div className="idea-editor-main-actions">
                <Button label="提交" skin="important" type="submit" />
            </div>
        </FormWithValidation>
        <ImportTitleDialog onChangeTitle={onChangeTitle} />
    </main>;
};