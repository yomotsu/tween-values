/*!
 * tween-values
 * https://github.com/yomotsu/tween-values
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
class EventDispatcher {
    constructor() {
        this._listeners = {};
    }
    addEventListener(type, listener) {
        const listeners = this._listeners;
        if (listeners[type] === undefined)
            listeners[type] = [];
        if (listeners[type].indexOf(listener) === -1)
            listeners[type].push(listener);
    }
    removeEventListener(type, listener) {
        const listeners = this._listeners;
        const listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            const index = listenerArray.indexOf(listener);
            if (index !== -1)
                listenerArray.splice(index, 1);
        }
    }
    removeAllEventListeners(type) {
        if (!type) {
            this._listeners = {};
            return;
        }
        if (Array.isArray(this._listeners[type]))
            this._listeners[type].length = 0;
    }
    dispatchEvent(event) {
        const listeners = this._listeners;
        const listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            const array = listenerArray.slice(0);
            for (let i = 0, l = array.length; i < l; i++) {
                array[i].call(this, event);
            }
        }
    }
}

function easeLinear(t) {
    return t;
}
function easeOutSine(t) {
    return Math.sin((t * Math.PI) * 0.5);
}
function easeInSine(t) {
    return 1 - Math.cos((t * Math.PI) * 0.5);
}
function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) * 0.5;
}
function easeInCubic(t) {
    return t * t * t;
}
function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) * 0.5;
}
function easeInExpo(t) {
    return t === 0 ? 0 : Math.pow(1024, t - 1);
}
function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeInOutExpo(t) {
    if (t === 0)
        return 0;
    if (t === 1)
        return 1;
    if ((t *= 2) < 1)
        return 0.5 * Math.pow(1024, t - 1);
    return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
}
const c1 = 1.70158;
const c3 = c1 + 1;
function easeOutBack(t) {
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function cloneValues(values) {
    return Object.assign({}, values);
}
function lerpValues(a, b, alpha, out) {
    for (const key in out) {
        out[key] = lerp(a[key], b[key], alpha);
    }
}

class TweenGroup extends EventDispatcher {
    constructor(...tweens) {
        super();
        this._group = [];
        this.add(...tweens);
    }
    add(...tweens) {
        tweens.forEach((tween) => {
            if (this._group.indexOf(tween) !== -1)
                return;
            this._group.push(tween);
        });
    }
    remove(...tweens) {
        tweens.forEach((tween) => {
            const index = this._group.indexOf(tween);
            if (index === -1)
                return;
            this._group.splice(index, 1);
        });
    }
    update(delta) {
        return this._group.forEach((tween) => tween.update(delta));
    }
    isRunning() {
        return this._group.some((tween) => tween.running);
    }
}

const activeTweens = new TweenGroup();
const tweenManager = new TweenGroup();

class Tween extends EventDispatcher {
    constructor(startValues, endValues, duration, { easing, onStart, onUpdate, onEnd } = {}) {
        super();
        this._running = false;
        this._elapsed = 0;
        this._startValues = startValues;
        this._endValues = endValues;
        this._duration = duration;
        this.easing = easing || easeLinear;
        this._currentValues = cloneValues(startValues);
        this.onStart = onStart;
        this.onUpdate = onUpdate;
        this.onEnd = onEnd;
        return this;
    }
    get running() {
        return this._running;
    }
    get progress() {
        return this._elapsed / this._duration;
    }
    get currentValues() {
        return this._currentValues;
    }
    get startValue() {
        return this._startValues;
    }
    get endValue() {
        return this._endValues;
    }
    reset() {
        this._running = false;
        this._elapsed = 0;
        return this;
    }
    start() {
        this._running = true;
        activeTweens.add(this);
        this.onStart && this.onStart();
        this.dispatchEvent({ type: 'started' });
        return this;
    }
    pause() {
        this._running = false;
        activeTweens.remove(this);
        this.dispatchEvent({ type: 'paused' });
        return this;
    }
    update(delta) {
        if (!this._running)
            return this;
        this._elapsed += delta;
        if (this._duration <= this._elapsed) {
            this._elapsed = this._duration;
            this._running = false;
            this._currentValues = cloneValues(this._endValues);
            this.onUpdate && this.onUpdate();
            this.dispatchEvent({ type: 'update', currentValues: cloneValues(this._currentValues) });
            this.onEnd && this.onEnd();
            this.dispatchEvent({ type: 'ended', currentValues: cloneValues(this._currentValues) });
            activeTweens.remove(this);
            return this;
        }
        lerpValues(this._startValues, this._endValues, this.easing(this.progress), this._currentValues);
        this.onUpdate && this.onUpdate();
        this.dispatchEvent({ type: 'update', currentValues: cloneValues(this._currentValues) });
        return this;
    }
    dispose() {
        this.removeAllEventListeners();
    }
    addEventListener(type, listener) {
        super.addEventListener(type, listener);
    }
    removeEventListener(type, listener) {
        super.removeEventListener(type, listener);
    }
}

export { Tween, TweenGroup, easeInCubic, easeInExpo, easeInOutCubic, easeInOutExpo, easeInOutSine, easeInSine, easeLinear, easeOutBack, easeOutCubic, easeOutExpo, easeOutSine, lerp, tweenManager };
