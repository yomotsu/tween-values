/*!
 * tween-values
 * https://github.com/yomotsu/tween-values
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var EventDispatcher = (function () {
    function EventDispatcher() {
        this._listeners = {};
    }
    EventDispatcher.prototype.addEventListener = function (type, listener) {
        var listeners = this._listeners;
        if (listeners[type] === undefined)
            listeners[type] = [];
        if (listeners[type].indexOf(listener) === -1)
            listeners[type].push(listener);
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener) {
        var listeners = this._listeners;
        var listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            var index = listenerArray.indexOf(listener);
            if (index !== -1)
                listenerArray.splice(index, 1);
        }
    };
    EventDispatcher.prototype.removeAllEventListeners = function (type) {
        if (!type) {
            this._listeners = {};
            return;
        }
        if (Array.isArray(this._listeners[type]))
            this._listeners[type].length = 0;
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        var listeners = this._listeners;
        var listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            var array = listenerArray.slice(0);
            for (var i = 0, l = array.length; i < l; i++) {
                array[i].call(this, event);
            }
        }
    };
    return EventDispatcher;
}());

function easeLinear(t) {
    return t;
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

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function cloneValues(values) {
    return Object.assign({}, values);
}
function lerpValues(a, b, alpha, out) {
    for (var key in out) {
        out[key] = lerp(a[key], b[key], alpha);
    }
}

var TweenGroup = (function (_super) {
    __extends(TweenGroup, _super);
    function TweenGroup() {
        var tweens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tweens[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this._group = [];
        _this.add.apply(_this, tweens);
        return _this;
    }
    TweenGroup.prototype.add = function () {
        var _this = this;
        var tweens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tweens[_i] = arguments[_i];
        }
        tweens.forEach(function (tween) {
            if (_this._group.indexOf(tween) !== -1)
                return;
            _this._group.push(tween);
        });
    };
    TweenGroup.prototype.remove = function () {
        var _this = this;
        var tweens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tweens[_i] = arguments[_i];
        }
        tweens.forEach(function (tween) {
            var index = _this._group.indexOf(tween);
            if (index === -1)
                return;
            _this._group.splice(index, 1);
        });
    };
    TweenGroup.prototype.update = function (delta) {
        return this._group.forEach(function (tween) { return tween.update(delta); });
    };
    TweenGroup.prototype.isRunning = function () {
        return this._group.some(function (tween) { return tween.running; });
    };
    return TweenGroup;
}(EventDispatcher));

var activeTweens = new TweenGroup();

var Tween = (function (_super) {
    __extends(Tween, _super);
    function Tween(startValues, endValues, duration, easing) {
        if (easing === void 0) { easing = easeLinear; }
        var _this = _super.call(this) || this;
        _this._running = false;
        _this._elapsed = 0;
        _this._startValues = startValues;
        _this._endValues = endValues;
        _this._duration = duration;
        _this.easing = easing;
        _this._currentValues = cloneValues(startValues);
        return _this;
    }
    Object.defineProperty(Tween.prototype, "running", {
        get: function () {
            return this._running;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tween.prototype, "progress", {
        get: function () {
            return this._elapsed / this._duration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tween.prototype, "currentValues", {
        get: function () {
            return this._currentValues;
        },
        enumerable: false,
        configurable: true
    });
    Tween.prototype.reset = function () {
        this._running = false;
        this._elapsed = 0;
        return this;
    };
    Tween.prototype.play = function () {
        this._running = true;
        activeTweens.add(this);
        this.dispatchEvent({ type: 'started' });
        return this;
    };
    Tween.prototype.pause = function () {
        this._running = false;
        activeTweens.remove(this);
        this.dispatchEvent({ type: 'paused' });
        return this;
    };
    Tween.prototype.update = function (delta) {
        if (!this._running)
            return this;
        this._elapsed += delta;
        if (this._duration <= this._elapsed) {
            this._elapsed = this._duration;
            this._running = false;
            this._currentValues = cloneValues(this._endValues);
            this.dispatchEvent({ type: 'update', currentValues: cloneValues(this._currentValues) });
            this.dispatchEvent({ type: 'ended', currentValues: cloneValues(this._currentValues) });
            activeTweens.remove(this);
            return this;
        }
        lerpValues(this._startValues, this._endValues, this.easing(this.progress), this._currentValues);
        this.dispatchEvent({ type: 'update', currentValues: cloneValues(this._currentValues) });
        return this;
    };
    Tween.prototype.dispose = function () {
        this.removeAllEventListeners();
    };
    Tween.prototype.addEventListener = function (type, listener) {
        _super.prototype.addEventListener.call(this, type, listener);
    };
    Tween.prototype.removeEventListener = function (type, listener) {
        _super.prototype.removeEventListener.call(this, type, listener);
    };
    return Tween;
}(EventDispatcher));

export { Tween, TweenGroup, easeInExpo, easeInOutExpo, easeLinear, easeOutExpo, lerp };
