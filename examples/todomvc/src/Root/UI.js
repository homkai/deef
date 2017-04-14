/**
 * Created by baidu on 17/4/12.
 */
import React from 'react';
import Todo from './components/Todo';
import Test from './components/Test';
import _ from 'lodash';

const PageMap = {Todo, Test};

export default ({page, onGoPage}) => {
    const Page = PageMap[page];

    return <main>
        <nav>
            <ul>
                <li>
                    <button onClick={_.partial(onGoPage, 'Todo')}>去Todo页面</button>
                </li>
                <li>
                    <button onClick={_.partial(onGoPage, 'Test')}>去Test页面</button>
                </li>
            </ul>
        </nav>
        <main>
            {Page && <Page />}
        </main>
    </main>;
};