/**
 * Created by baidu on 17/6/27.
 */
import {history} from 'app';

import matchPath from './matchPath';

const on = (rule, {onEnter, onLeave}) => {
    let lastLocation;
    history.listen(onChange);
    onChange(history.location);
    function onChange(location) {
        const match = matchRule(rule, location);
        if (match) {
            onEnter && onEnter(location, match);
            lastLocation = location;
        }
        else if (lastLocation) {
            onLeave && onLeave(location);
            lastLocation = null;
        }
        lastLocation && (lastLocation = location);
    }
};

export default {
    on
};

function matchRule(rule, location) {
    if (typeof rule === 'string') {
        return matchPath(location.pathname || location.path, rule);
    }
    if (typeof rule === 'function') {
        return rule(location);
    }
}