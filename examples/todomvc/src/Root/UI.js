/**
 * Created by baidu on 17/4/12.
 */
import React from 'react';
import Todo from './components/Todo';
import Test from './components/Test';
import _ from 'lodash';

const moduleMap = {Todo, Test};

export default ({page, onGoModule}) => {
    const Module = moduleMap[page];

    return <main>
        <nav>
            <ul>
                <li>
                    <button onClick={_.partial(onGoModule, 'Todo')}>去Todo模块</button>
                </li>
                <li>
                    <button onClick={_.partial(onGoModule, 'Test')}>去Test模块</button>
                </li>
            </ul>
        </nav>
        <main>
            {Module && <Module />}
        </main>
    </main>;
};