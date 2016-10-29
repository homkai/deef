// import window from 'global/window';
import createHistory from 'history/createHashHistory';
import createDeef from './createDeef';

export default createDeef({
    window,
    defaultHistory: createHistory()
});
