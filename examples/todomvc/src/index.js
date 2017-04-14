import {app} from 'app';
import models from './Root/models';
import Root from './Root';

Object.keys(models).map(key => app.model(models[key]));
app.start('#root', Root);
