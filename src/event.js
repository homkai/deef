import invariant from 'invariant';

class Event {

    constructor() {
        this.hooks = {
            error: [],
            history: [],
            action: [],
            stateChange: [],
            hmr: []
        };
    }

    on(type, handler) {
        const hooks = this.hooks;
        invariant(hooks[type], `deef->on: unknown hook type: ${type}`);
        const fns = hooks[type];
        fns.push(handler);
        return this.off.bind(this, type, handler);
    }

    off(type, handler) {
        this.hooks[type] = this.hooks[type].filter(fn => fn !== handler);
    }

    trigger(type, args) {
        const fns = this.hooks[type];
        for (const fn of fns) {
            fn.apply(null, args);
        }
    }

}

export default Event;