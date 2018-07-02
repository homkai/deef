import app from './app';
import todoModels from '../modules/Todo/models';

export default [
    app,
    ...todoModels
];