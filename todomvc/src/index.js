import {app} from 'app';
import models from './Todo/models';
import Todo from './Todo';
import 'whatwg-fetch';

Object.keys(models).map(key => app.model(models[key]));
app.start('.todoapp', Todo);
