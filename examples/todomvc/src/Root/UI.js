/**
 * Created by baidu on 17/4/12.
 */
import React from 'react';
import Todo from './modules/Todo';
import Test from './modules/Test';
import partial from 'lodash/partial';

const moduleMap = {Todo, Test};

export default ({module, onGoModule}) => {
    const Module = moduleMap[module];

    return <main>
        <nav>
            <ul>
                <li>
                    <button onClick={partial(onGoModule, 'Todo')}>去Todo模块</button>
                </li>
                <li>
                    <button onClick={partial(onGoModule, 'Test')}>去Test模块</button>
                </li>
            </ul>
        </nav>
        <main>
            {Module && <Module />}
        </main>
    </main>;
};