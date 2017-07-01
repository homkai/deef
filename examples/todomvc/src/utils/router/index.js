/**
 * Created by baidu on 17/6/27.
 */
import {history} from 'app';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

import matchPath from './matchPath';

const ruleList = [];

const on = (rule, {onMatch, onMiss, key}) => {
    // 一个rule只生效一次
    const ruleKey = isString(rule) ? rule : (rule.path && JSON.stringify(rule) || (isString(key) ? key : ''));
    if (!ruleKey) {
        throw new Error('When (rule || rule.path) is not string must declare a globally unique `key` prop in the 2nd param');
    }
    if (ruleList.some(item => item.ruleKey === ruleKey)) {
        return;
    }

    // 放到ruleList，并立即触发匹配
    ruleList.push({
        rule,
        ruleKey,
        callbacks: {onMatch, onMiss}
    });
    onHistoryChange(history.location);

    // 只建立一次history.listen
    ruleList.length === 1 && history.listen(onHistoryChange);

    // 监听history change
    function onHistoryChange(location) {
        const execList = [];
        ruleList.forEach(item => {
            const {rule, callbacks: {onMatch, onMiss}} = item;
            const match = matchRule(location, rule);
            if (match && !isEqual(pick(item.lastMatch, ['path', 'params', 'url']), pick(match, ['path', 'params', 'url']))) {
                onMatch && execList.push({ruleKey, onMatch: onMatch.bind(null, match, item.lastMatch)});
                item.lastMatch = match;
            }
            else if (!match && item.lastMatch !== null) {
                onMiss && execList.push({ruleKey, onMiss: onMiss.bind(null, item.lastMatch)});
                item.lastMatch = null;
            }
            (item.lastMatch !== null) && (item.lastMatch = match);
        });
        // 先执行onMiss，执行顺序按注册顺序从后到早
        execList.reverse().forEach(item => {
            item.onMiss && item.onMiss();
        });
        // 再执行onMatch
        execList.forEach(item => {
            item.onMatch && item.onMatch();
        });
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