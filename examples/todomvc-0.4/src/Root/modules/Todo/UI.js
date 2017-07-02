/**
 * Created by baidu on 17/4/12.
 */
import React from 'react';
import Header from './Header/index';
import Main from './Main/index';

import './style.less';

export default () => <div className="todo-app">
    <Header />
    <Main />
</div>;