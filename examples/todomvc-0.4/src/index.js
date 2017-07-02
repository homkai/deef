import {app} from 'app';
import models from './Root/models';
import Root from './Root';

import {init as initRoot} from './Root/handler';

models.map(model => app.model(model));
app.start('#root', Root, ({dispatch, getState}) => {
    initRoot({dispatch, getState});
});
