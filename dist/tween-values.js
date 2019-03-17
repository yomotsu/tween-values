/*!
 * tween-values
 * https://github.com/yomotsu/tween-values
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.TweenValues = {}));
}(this, function (exports) { 'use strict';

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
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
	        if (listeners[type].indexOf(listener) === -1) {
	            listeners[type].push(listener);
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

	function cloneValues(values) {
	    var result = {};
	    return Object.assign(result, values);
	}
	function lerpValues(a, b, alpha, out) {
	    for (var key in out) {
	        out[key] = (b[key] - a[key]) * alpha;
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
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Tween.prototype, "progress", {
	        get: function () {
	            return this._elapsed / this._duration;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Tween.prototype, "currentValues", {
	        get: function () {
	            return this._currentValues;
	        },
	        enumerable: true,
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
	            this.dispatchEvent({ type: 'update' });
	            this.dispatchEvent({ type: 'ended' });
	            activeTweens.remove(this);
	            return this;
	        }
	        lerpValues(this._startValues, this._endValues, this.progress, this._currentValues);
	        this.dispatchEvent({ type: 'update' });
	        return this;
	    };
	    Tween.prototype.dispose = function () {
	        this.removeAllEventListeners();
	    };
	    return Tween;
	}(EventDispatcher));

	exports.Tween = Tween;
	exports.TweenGroup = TweenGroup;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
