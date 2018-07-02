/**
 * @file 导入标题弹窗 - UI
 */
import React from 'react';
import {TitleWindow, SearchBox} from 'fcui2'
import _ from 'lodash';

import './style.less';


export default ({onChangeTitle, isOpen, isRequesting, searchQuery, listData, ...callbacks}) => {
    const {onInputSearch, onSearch, onClickImport: clickImport, onClose} = callbacks;
    const onClickImport = _.partial(clickImport, onChangeTitle);

    return <TitleWindow
        showCloseButton
        title="导入已有标题"
        isOpen={isOpen}
        onClose={onClose}
    >
        <div className="idea-editor-import-title-dialog">
            <SearchBox
                placeholder="请输入标题关键字"
                value={searchQuery}
                onChange={onInputSearch}
                onClick={onSearch}
            />
            {
                isRequesting
                    ? <div className="list-tip">正在加载...</div>
                    : (
                        !listData.length
                            ? <div className="list-tip">
                                暂无标题，去新建创意吧！
                            </div>
                            : <ul className="title-list">
                                {
                                    listData.map(item => {
                                        const handleClick = _.partial(onClickImport, item.title);
                                        return <li key={item.title} className="title-item">
                                            <div className="title-show">{item.title}</div>
                                            <a href="javascript:;" className="import-btn" onClick={handleClick}>导入</a>
                                        </li>;
                                    })
                                }
                            </ul>
                    )
            }
        </div>
    </TitleWindow>;
};