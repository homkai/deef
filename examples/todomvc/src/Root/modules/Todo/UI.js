/**
 * Created by baidu on 17/4/12.
 */
import React from 'react';
import Header from './components/Header';
import Main from './components/Main';

import './style.less';

export default () => <div className="todo-app">
    <Header />
    <Main />
</div>;