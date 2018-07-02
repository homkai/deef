import 'normalize.css';
import 'fcui2/src/css/main.less';

import {app} from 'app';

import model from './IdeaEditor/model';
import IdeaEditor from './IdeaEditor';
import {init} from './IdeaEditor/handler';

import 'whatwg-fetch';

app.model(model);
app.start('#root', IdeaEditor, ({dispatch, getState}) => {
    // 顶层初始化
    init({dispatch, getState});
});
