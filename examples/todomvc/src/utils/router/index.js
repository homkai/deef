/**
 * Created by baidu on 17/6/27.
 */
import {history} from 'app';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

import matchPath from './matchPath';

const ruleCache = [];

const on = (rule, {onEnter, onLeave, key}) => {
    const ruleKey = isString(rule) ? rule : (rule.path && JSON.stringify(rule) || (isString(key) ? key : ''));
    if (!ruleKey) {
        throw new Error('When rule is not string must declare a globally unique `key` prop in the 2nd param');
    }
    if (~ruleCache.indexOf(ruleKey)) {
        return;
    }
    ruleCache.push(ruleKey);

    let lastMatchLog = null;
    history.listen(onChange);
    onChange(history.location);
    function onChange(location) {
        const match = matchRule(location, rule);
        const matchLog = getMatchLog(match);
        if (match && !isEqual(lastMatchLog, matchLog)) {
            onEnter && onEnter(match);
            lastMatchLog = matchLog;
        }
        else if (!match && lastMatchLog !== null) {
            onLeave && onLeave();
            lastMatchLog = null;
        }
        (lastMatchLog !== null) && (lastMatchLog = matchLog);
    }
};

export default {
    on
};

function matchRule(location, rule) {
    if (isString(rule) || isString(rule.path)) {
        return matchPath(location.pathname || location.path, rule);
    }
    if (isFunction(rule)) {
        return rule(location);
    }
}

function getMatchLog(match) {
    return match ? pick(match, ['path', 'params', 'url']) : null;
}