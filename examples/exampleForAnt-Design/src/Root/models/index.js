/**
 * Created by baidu on 17/4/14.
 */
import app from './app';
import todoModels from '../modules/Todo/models';
import testModels from '../modules/Test/models';

export default [
    app,
    ...todoModels,
    ...testModels
];