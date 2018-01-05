define("model/Interpolation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Interpolation = (function () {
        function Interpolation(attribute, domElement) {
            var splitResult = attribute.split('$$');
            this.method = splitResult[0];
            this.property1 = splitResult[1];
            this.property2 = splitResult[2];
            this.id = this.getGuid();
            this.domElement = domElement;
        }
        Interpolation.prototype.Has2Properties = function () {
            return !(this.property2 == null || this.property2 == '');
        };
        Interpolation.prototype.getGuid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
        return Interpolation;
    }());
    exports.Interpolation = Interpolation;
});
define("SimplePolation", ["require", "exports", "model/Interpolation", "jquery"], function (require, exports, Interpolation_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimplePolationInstance = (function () {
        function SimplePolationInstance(domSelector) {
            if (domSelector === void 0) { domSelector = "body"; }
            this.interpolationElements = [];
            this.domElement = $(domSelector);
        }
        SimplePolationInstance.prototype.run = function (context) {
            var _this = this;
            $(this.domElement).find('[sp]').each(function (i, e) {
                _this.interpolationElements.push(new Interpolation_1.Interpolation($(e).attr('sp'), e));
            });
            this.attachEventHandlers(context);
        };
        SimplePolationInstance.prototype.setContextValue = function (path, context, value) {
            var extraContext = {
                setContextValueValue: value
            };
            var o = this.evalWithLog(path + '=setContextValueValue', context, extraContext);
            o = value;
        };
        SimplePolationInstance.prototype.evalWithLog = function (text, context, extraContext) {
            var result = null;
            if (extraContext) {
                Object.keys(extraContext).forEach(function (key, index) {
                    context[key] = extraContext[key];
                });
            }
            try {
                result = this.evalInContext(text, context);
            }
            catch (e) {
                throw new Error('Failed to evaluate pharse "' + text + '"');
            }
            return result;
        };
        SimplePolationInstance.prototype.evalInContext = function (text, context) {
            function evalSafely(text) {
                var pre = '';
                Object.keys(context).forEach(function (key, index) {
                    pre += "var " + key + " = this." + key + ";";
                });
                return eval(pre + text);
            }
            return evalSafely.call(context, text);
        };
        SimplePolationInstance.prototype.setWatchOnContextValue = function (path, context, callback) {
            var pathSplit = path.split('.');
            var resultContext = context;
            pathSplit.forEach(function (e, i) {
                if (i == pathSplit.length - 1) {
                    resultContext.watch(e, callback);
                }
                else {
                    resultContext = resultContext[e];
                }
            });
        };
        SimplePolationInstance.prototype.attachEventHandlers = function (context) {
            var _this = this;
            this.interpolationElements.forEach(function (e, i) {
                $(e.domElement).change(function () {
                    if (!e.Has2Properties()) {
                        var newValue = $(e.domElement)[e.method]();
                        _this.setContextValue(e.property1, context, newValue);
                    }
                    else {
                        var newValue = $(e.domElement)[e.method](e.property2);
                        _this.setContextValue(e.property2, context, newValue);
                    }
                });
                if (!e.Has2Properties()) {
                    _this.setWatchOnContextValue(e.property1, context, function (field, old, cur, ie) {
                        if (ie === void 0) { ie = e; }
                        $(ie.domElement)[ie.method](cur);
                        return cur;
                    });
                }
                else {
                    _this.setWatchOnContextValue(e.property2, context, function (field, old, cur, ie) {
                        if (ie === void 0) { ie = e; }
                        $(ie.domElement)[ie.method](ie.property1, cur);
                        return cur;
                    });
                }
            });
        };
        return SimplePolationInstance;
    }());
    exports.SimplePolationInstance = SimplePolationInstance;
});
if (!Object.prototype['watch']) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function (prop, handler) {
            var oldval = this[prop], newval = oldval, getter = function () {
                return newval;
            }, setter = function (val) {
                oldval = newval;
                return newval = handler.call(this, prop, oldval, val);
            };
            if (delete this[prop]) {
                Object.defineProperty(this, prop, {
                    get: getter,
                    set: setter,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    });
}
if (!Object.prototype['unwatch']) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function (prop) {
            var val = this[prop];
            delete this[prop];
            this[prop] = val;
        }
    });
}
