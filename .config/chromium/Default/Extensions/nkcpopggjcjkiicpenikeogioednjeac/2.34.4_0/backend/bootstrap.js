!function(modules) {
    var parentJsonpFunction = window["webpackJsonp"];
    window["webpackJsonp"] = function(chunkIds, moreModules) {
        var moduleId, chunkId, i = 0, callbacks = [];
        for (;i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (installedChunks[chunkId]) callbacks.push.apply(callbacks, installedChunks[chunkId]);
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) modules[moduleId] = moreModules[moduleId];
        if (parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
        while (callbacks.length) callbacks.shift().call(null, __webpack_require__);
        if (moreModules[0]) {
            installedModules[0] = 0;
            return __webpack_require__(0);
        }
    };
    var installedModules = {};
    var installedChunks = {
        0: 0
    };
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: false
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = true;
        return module.exports;
    }
    __webpack_require__.e = function(chunkId, callback) {
        if (0 === installedChunks[chunkId]) return callback.call(null, __webpack_require__);
        if (void 0 !== installedChunks[chunkId]) installedChunks[chunkId].push(callback); else {
            installedChunks[chunkId] = [ callback ];
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.charset = "utf-8";
            script.async = true;
            script.src = __webpack_require__.p + "" + chunkId + "." + ({
                "1": "bundle"
            }[chunkId] || chunkId) + ".js";
            head.appendChild(script);
        }
    };
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0);
}([ function(module, exports, __webpack_require__) {
    "use strict";
    __webpack_require__(1);
    __webpack_require__(2).run();
}, function(module, exports) {
    "use strict";
}, function(module, exports, __webpack_require__) {
    "use strict";
    var alarms = __webpack_require__(3);
    exports.startTime = 0;
    exports.run = function() {
        exports.startTime = Date.now();
        alarms.startCaching();
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var formatDate = __webpack_require__(4).format;
    var logger = __webpack_require__(5).create("Alarms");
    var ChannelCacher = __webpack_require__(170);
    var noop = __webpack_require__(172);
    var cacher = new ChannelCacher();
    var alarmsHandlers = new Map();
    module.exports = {
        startCaching: function() {
            cacher.attach(chrome.alarms.onAlarm);
            cacher.channel.addListener(function(alarm) {
                logger.info("Alarm triggered: %s (cached: %s)", alarm.name, cacher.isCaching());
            });
        },
        stopCaching: function() {
            cacher.stopCaching();
        },
        register: function(alarmInfo, handler) {
            if (!alarmInfo.name) throw new Error("You should provide alarm name");
            this.existsEqual(alarmInfo, function(exists) {
                if (exists) return;
                logger.info("Creating alarm %s with options %j", alarmInfo.name, alarmInfo);
                this._registerAlarm(alarmInfo);
            }.bind(this));
            this._registerHandler(alarmInfo.name, handler);
        },
        on: function(alarmName, handler) {
            var handlers = alarmsHandlers.get(alarmName) || [];
            var alarmHandler = function(alarm) {
                if (alarm.name === alarmName) handler();
            };
            handlers.push(alarmHandler);
            alarmsHandlers.set(alarmName, handlers);
            cacher.channel.addListener(alarmHandler);
        },
        off: function(alarmName) {
            var handlers = alarmsHandlers.get(alarmName);
            if (handlers) {
                handlers.forEach(function(handler) {
                    cacher.channel.removeListener(handler);
                });
                alarmsHandlers.delete(alarmName);
            }
        },
        exists: function(alarmName, callback) {
            chrome.alarms.get(alarmName, function(alarm) {
                callback(Boolean(alarm));
            });
        },
        existsEqual: function(alarmInfo, callback) {
            chrome.alarms.get(alarmInfo.name, function(alarm) {
                var period = alarmInfo.periodInMinutes || null;
                var hasSameAlarm = alarm && alarm.periodInMinutes === period;
                callback(hasSameAlarm);
            });
        },
        clear: function(alarmName, callback) {
            callback = callback || noop;
            this.off(alarmName);
            chrome.alarms.clear(alarmName, callback);
        },
        trigger: function(alarmName) {
            cacher.channel.dispatch({
                name: alarmName
            });
        },
        logAll: function() {
            chrome.alarms.getAll(function(alarms) {
                if (!Array.isArray(alarms) || !alarms.length) logger.info("No alarms found"); else {
                    logger.info("Existing alarms count: %i", alarms.length);
                    alarms.forEach(function(alarm) {
                        var scheduledTime = alarm.scheduledTime ? formatDate(alarm.scheduledTime, "%Y-%M-%D %H:%N") : "";
                        var periodInHours = alarm.periodInMinutes ? alarm.periodInMinutes / 60 : "";
                        logger.info("Existing alarm: %s scheduled time %s (period: %f hours)", alarm.name, scheduledTime, periodInHours);
                    });
                }
            });
        },
        flush: function() {
            chrome.alarms.clearAll();
            alarmsHandlers.clear();
            cacher = new ChannelCacher();
        },
        _registerAlarm: function(alarmInfo) {
            var props = Object.assign({}, alarmInfo);
            delete props.name;
            chrome.alarms.create(alarmInfo.name, props);
        },
        _registerHandler: function(alarmName, handler) {
            if ("function" === typeof handler) this.on(alarmName, handler);
        }
    };
}, function(module, exports) {
    "use strict";
    function leadZero(str) {
        return str.length > 1 ? str : "0" + str;
    }
    function formatCode(date, code) {
        switch (code) {
          case "d":
            return date.getDate();

          case "D":
            return leadZero(String(date.getDate()));

          case "m":
            return date.getMonth() + 1;

          case "M":
            return leadZero(String(date.getMonth() + 1));

          case "y":
            return String(date.getFullYear()).substr(2, 2);

          case "Y":
            return date.getFullYear();

          case "h":
            return date.getHours();

          case "H":
            return leadZero(String(date.getHours()));

          case "n":
            return date.getMinutes();

          case "N":
            return leadZero(String(date.getMinutes()));

          case "s":
            return date.getSeconds();

          case "S":
            return leadZero(String(date.getSeconds()));

          case "i":
            return date.getMilliseconds();

          case "%":
            return "%";

          default:
            return code;
        }
    }
    exports.format = function(date, format) {
        if (!(date instanceof Date)) date = new Date(date);
        return format.replace(/%([dDmMyYhHnNsSi%])/g, function(match, code) {
            return formatCode(date, code);
        });
    };
    exports.diff = function(firstDate, secondDate) {
        firstDate = firstDate instanceof Date ? firstDate.getTime() : parseInt(firstDate, 10);
        secondDate = void 0 !== secondDate ? secondDate : Date.now();
        secondDate = secondDate instanceof Date ? secondDate.getTime() : parseInt(secondDate, 10);
        if (isNaN(firstDate) || isNaN(secondDate)) return 0;
        return secondDate - firstDate;
    };
    exports.absDiff = function(firstDate, secondDate) {
        return Math.abs(exports.diff(firstDate, secondDate));
    };
    exports.daysToMs = function(days) {
        return isNaN(days) ? 0 : days * exports.DAY_MS;
    };
    exports.minutesToMs = function(minutes) {
        return isNaN(minutes) ? 0 : minutes * exports.MINUTE_MS;
    };
    exports.SECOND_MS = 1e3;
    exports.MINUTE_MS = 60 * exports.SECOND_MS;
    exports.HOUR_MS = 60 * exports.MINUTE_MS;
    exports.DAY_MS = 24 * exports.HOUR_MS;
    exports.WEEK_MS = 7 * exports.DAY_MS;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var lggr = __webpack_require__(6);
    var logConfig = __webpack_require__(20);
    var methods = [ "info", "warn", "error" ];
    var options = {
        methods: methods,
        writers: logConfig.writers,
        formatters: logConfig.formatters,
        levels: {}
    };
    var logger = new lggr.Logger("core", options);
    logger.create = logger.clone.bind(logger);
    module.exports = logger;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) return obj; else {
            var newObj = {};
            if (null != obj) for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            newObj["default"] = obj;
            return newObj;
        }
    }
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    var _logger = __webpack_require__(7);
    var _logger2 = _interopRequireDefault(_logger);
    var _utilsReplacer = __webpack_require__(9);
    var _utilsReplacer2 = _interopRequireDefault(_utilsReplacer);
    var _writersConsole = __webpack_require__(10);
    var _writersConsole2 = _interopRequireDefault(_writersConsole);
    var _writersWebFile = __webpack_require__(11);
    var _writersWebFile2 = _interopRequireDefault(_writersWebFile);
    var _formattersDate = __webpack_require__(13);
    var _formattersDate2 = _interopRequireDefault(_formattersDate);
    var _formattersMethod = __webpack_require__(14);
    var _formattersMethod2 = _interopRequireDefault(_formattersMethod);
    var _formattersPrefix = __webpack_require__(15);
    var _formattersPrefix2 = _interopRequireDefault(_formattersPrefix);
    var _formattersPlaceholders = __webpack_require__(16);
    var _formattersPlaceholders2 = _interopRequireDefault(_formattersPlaceholders);
    var _formattersPlaceholdersNormalizer = __webpack_require__(17);
    var _formattersPlaceholdersNormalizer2 = _interopRequireDefault(_formattersPlaceholdersNormalizer);
    var _formattersJoin = __webpack_require__(18);
    var _formattersJoin2 = _interopRequireDefault(_formattersJoin);
    var _formattersJoinFirst = __webpack_require__(19);
    var _formattersJoinFirst2 = _interopRequireDefault(_formattersJoinFirst);
    var _utilsWebFile = __webpack_require__(12);
    var _utilsWebFile2 = _interopRequireDefault(_utilsWebFile);
    var _utils = __webpack_require__(8);
    var utils = _interopRequireWildcard(_utils);
    var combineFormatters = utils.combineFormatters;
    exports.Logger = _logger2["default"];
    exports.Replacer = _utilsReplacer2["default"];
    exports.WebFile = _utilsWebFile2["default"];
    exports.createConsoleWriter = _writersConsole2["default"];
    exports.createWebFileWriter = _writersWebFile2["default"];
    exports.createDateFormatter = _formattersDate2["default"];
    exports.createMethodFormatter = _formattersMethod2["default"];
    exports.createPrefixFormatter = _formattersPrefix2["default"];
    exports.createPlaceholdersFormatter = _formattersPlaceholders2["default"];
    exports.createNormalFormatter = _formattersPlaceholdersNormalizer2["default"];
    exports.createJoinFormatter = _formattersJoin2["default"];
    exports.createJoinFirstFormatter = _formattersJoinFirst2["default"];
    exports.combineFormatters = combineFormatters;
    exports.utils = utils;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var _createClass = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var _utils = __webpack_require__(8);
    var REQUIRED_OPTIONS = [ "levels", "writers", "formatters", "methods" ];
    var Logger = function() {
        function Logger(prefix, options) {
            _classCallCheck(this, Logger);
            assertOptions(options);
            this._clones = [];
            this._prefix = prefix;
            this._opt = options;
            this._createMethods(this._opt.methods);
        }
        _createClass(Logger, [ {
            key: "clone",
            value: function clone(prefix) {
                var clone = this.fork(prefix);
                this._clones.push(clone);
                return clone;
            }
        }, {
            key: "fork",
            value: function(prefix) {
                var Constructor = this.constructor ? this.constructor : Logger;
                return new Constructor(prefix, (0, _utils.shallowCopyObject)(this._opt));
            }
        }, {
            key: "message",
            value: function(method) {
                var _this = this;
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
                this._forEachWriter(function(name, write, format, levels) {
                    if (isMethodAllowed(method, levels)) write(method, _this._prefix, format ? format(method, _this._prefix, args.slice()) : args);
                });
            }
        }, {
            key: "setLevels",
            value: function(name, levels) {
                this._opt.levels[name] = levels;
                this._updateClones("setLevels", name, levels);
            }
        }, {
            key: "addWriter",
            value: function(name, writer) {
                this._opt.writers[name] = writer;
                this._updateClones("addWriter", name, writer);
            }
        }, {
            key: "removeWriter",
            value: function(name) {
                if (this._opt.writers[name]) delete this._opt.writers[name];
                this._updateClones("removeWriter", name);
            }
        }, {
            key: "addFormatter",
            value: function(name, formatter) {
                this._opt.formatters[name] = formatter;
                this._updateClones("addFormatter", name, formatter);
            }
        }, {
            key: "removeFormatter",
            value: function(name) {
                if (this._opt.formatters[name]) delete this._opt.formatters[name];
                this._updateClones("removeFormatter", name);
            }
        }, {
            key: "_createMethods",
            value: function(methods) {
                var _this2 = this;
                methods.forEach(function(method) {
                    _this2[method] = _this2.message.bind(_this2, method);
                });
            }
        }, {
            key: "_forEachWriter",
            value: function(method) {
                var _this3 = this;
                Object.keys(this._opt.writers).forEach(function(name) {
                    method(name, _this3._opt.writers[name], _this3._opt.formatters[name], _this3._opt.levels[name]);
                });
            }
        }, {
            key: "_updateClones",
            value: function(method) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
                this._clones.forEach(function(clone) {
                    clone[method].apply(clone, args);
                });
            }
        } ]);
        return Logger;
    }();
    exports["default"] = Logger;
    function isMethodAllowed(method, levels) {
        if (Array.isArray(levels)) return levels.indexOf(method) !== -1;
        return true;
    }
    function assertOptions(options) {
        if (!options) throw new Error('You must specify "options" parameter for Logger');
        REQUIRED_OPTIONS.forEach(function(name) {
            if (void 0 === options[name]) throw new Error('You must specify "options.' + name + '" parameter for Logger');
        });
    }
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.replacePlaceholders = replacePlaceholders;
    exports.shallowCopyObject = shallowCopyObject;
    exports.toString = toString;
    exports.combineFormatters = combineFormatters;
    exports.identity = identity;
    function replacePlaceholders(replacer, args) {
        if ("string" === typeof args[0]) return [ replacer.replace(args[0], args.slice(1)) ];
        return args;
    }
    function shallowCopyObject(object) {
        return Object.keys(object).reduce(function(result, key) {
            var subObject = object[key];
            if (Array.isArray(subObject)) result[key] = subObject.slice(); else if ("function" === typeof subObject) result[key] = subObject.bind(object); else if ("object" === typeof subObject) result[key] = Object.assign({}, subObject); else result[key] = subObject;
            return result;
        }, {});
    }
    function toString(args) {
        var delimiter = arguments.length <= 1 || void 0 === arguments[1] ? " " : arguments[1];
        if (0 === args.length) return "undefined";
        return args.map(function(item) {
            if (void 0 === item) return "undefined";
            if ("string" === typeof item) return item;
            return stringify(item);
        }).join(delimiter);
    }
    function stringify(item) {
        try {
            return JSON.stringify(item);
        } catch (e) {
            return String(item);
        }
    }
    function combineFormatters(formatters) {
        return function(method, prefix, args) {
            return formatters.reduce(function(formattedArgs, format) {
                return format(method, prefix, formattedArgs);
            }, args);
        };
    }
    function identity(data) {
        return data;
    }
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var _createClass = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var REG_EXP = /%(.)/gm;
    var OPTIONS = {
        limitStringLength: 300,
        nanString: "NaN"
    };
    var Replacer = function() {
        function Replacer() {
            var options = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
            _classCallCheck(this, Replacer);
            options = Object.assign({}, OPTIONS, options);
            this._formats = options.formats || createDefaultFormats(options);
            this._limitStringLength = options.limitStringLength;
            this._nanString = options.nanString;
            this._regExp = REG_EXP;
        }
        _createClass(Replacer, [ {
            key: "replace",
            value: function(string, data) {
                var _this = this;
                var placeholderIndex = -1;
                return string.replace(this._regExp, function(total, match) {
                    placeholderIndex += 1;
                    return _this._formatItem(match, data[placeholderIndex]);
                });
            }
        }, {
            key: "addPlaceholder",
            value: function(placeholder, formatter) {
                this._formats[placeholder] = formatter;
            }
        }, {
            key: "removePlaceholder",
            value: function(placeholder) {
                if (this._formats[placeholder]) delete this._formats[placeholder];
            }
        }, {
            key: "_formatItem",
            value: function(placeholder, item) {
                var formatter = this._formats[placeholder];
                return formatter ? formatter(item) : "%" + placeholder;
            }
        } ]);
        return Replacer;
    }();
    exports["default"] = Replacer;
    function createDefaultFormats(options) {
        return {
            o: formatJSON,
            j: formatJSON,
            s: formatString,
            l: formatLimitedString.bind(null, options.limitStringLength),
            i: formatIntegerNumber.bind(null, options.nanString),
            d: formatIntegerNumber.bind(null, options.nanString),
            f: formatFloatNumber.bind(null, options.nanString),
            "%": function() {
                return "%";
            }
        };
    }
    function formatString(data) {
        return String(data);
    }
    function formatLimitedString(limitLength, data) {
        return String(data).substr(0, limitLength);
    }
    function formatIntegerNumber(nanString, data) {
        return "number" === typeof data ? String(Math.floor(data)) : nanString;
    }
    function formatFloatNumber(nanString, data) {
        return "number" === typeof data ? String(Number(data)) : nanString;
    }
    function formatJSON(data) {
        try {
            return JSON.stringify(data || "", null, 1);
        } catch (e) {
            return String(e);
        }
    }
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function create() {
        var apply = Function.prototype.apply;
        var _console = console ? console : {};
        return function(method, prefix, formattedArgs) {
            if (_console[method]) apply.call(_console[method], _console, formattedArgs);
        };
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    var _utilsWebFile = __webpack_require__(12);
    var _utilsWebFile2 = _interopRequireDefault(_utilsWebFile);
    function create(file, options) {
        var webFile = file || new _utilsWebFile2["default"](options);
        return function(method, prefix, formattedArgs) {
            webFile.push(formattedArgs[0]);
        };
    }
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var _createClass = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var WebFile = function() {
        function WebFile(options) {
            _classCallCheck(this, WebFile);
            this._fileName = options.fileName;
            this._oldFileName = options.oldFileName;
            this._maxSize = options.maxSize;
            this._messagesQueue = [];
            this._isRunning = false;
            this._fsLink = null;
        }
        _createClass(WebFile, [ {
            key: "push",
            value: function(string) {
                this._messagesQueue.push(string);
                if (!this._isRunning) {
                    this._isRunning = true;
                    this._writeAttempt();
                }
            }
        }, {
            key: "_writeAttempt",
            value: function() {
                var _this = this;
                this._requestFile(function(windowFsLink, fileEntry, fileWriter) {
                    fileWriter.onwriteend = _this._onWriteEnd.bind(_this);
                    if (fileWriter.length > _this._maxSize) _this._rotateLogs(windowFsLink, fileEntry, fileWriter); else {
                        _this._appendQueueData(fileWriter);
                        _this._messagesQueue = [];
                    }
                });
            }
        }, {
            key: "_onWriteEnd",
            value: function() {
                if (this._messagesQueue.length) this._writeAttempt(); else this._isRunning = false;
            }
        }, {
            key: "_requestFile",
            value: function(callback) {
                var _this2 = this;
                this._requestFileSystem(function(fsLink) {
                    return _this2._requestFileWriter(fsLink, callback);
                });
            }
        }, {
            key: "_requestFileSystem",
            value: function(callback) {
                if (this._fsLink) {
                    callback(this._fsLink);
                    return;
                }
                try {
                    var requestFs = window.requestFileSystem || window.webkitRequestFileSystem;
                    requestFs(window.PERSISTENT, 0, callback);
                } catch (e) {}
            }
        }, {
            key: "_requestFileWriter",
            value: function(windowFsLink, callback) {
                windowFsLink.root.getFile(this._fileName, {
                    create: true,
                    exclusive: false
                }, function(fileEntry) {
                    return fileEntry.createWriter(function(fileWriter) {
                        return callback(windowFsLink, fileEntry, fileWriter);
                    });
                });
            }
        }, {
            key: "_rotateLogs",
            value: function(windowFsLink, fileEntry, fileWriter) {
                this._copy(windowFsLink.root, fileEntry, this._oldFileName, function() {
                    return fileWriter.truncate(0);
                });
            }
        }, {
            key: "_copy",
            value: function(cwd, fileEntry, newPath, callback) {
                fileEntry.copyTo(cwd, newPath, function(error) {
                    return callback(null, error);
                }, function(result) {
                    return callback(result);
                });
            }
        }, {
            key: "_appendQueueData",
            value: function(fileWriter) {
                fileWriter.seek(fileWriter.length);
                fileWriter.write(new Blob([ "\n" + this._messagesQueue.join("\n") ], {
                    type: "text/plain"
                }));
            }
        } ]);
        return WebFile;
    }();
    exports["default"] = WebFile;
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        } else return Array.from(arr);
    }
    function create() {
        var createDate = arguments.length <= 0 || void 0 === arguments[0] ? createDatePart : arguments[0];
        return function(method, prefix, args) {
            return [ createDate() ].concat(_toConsumableArray(args));
        };
    }
    function createDatePart() {
        var timeZoneOffset = 6e4 * new Date().getTimezoneOffset();
        var dateWithReversedOffset = new Date(Date.now() - timeZoneOffset);
        return dateWithReversedOffset.toISOString().slice(0, -1);
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        } else return Array.from(arr);
    }
    var _utils = __webpack_require__(8);
    function create() {
        var mutator = arguments.length <= 0 || void 0 === arguments[0] ? _utils.identity : arguments[0];
        return function(method, prefix, args) {
            return [ mutator(method) ].concat(_toConsumableArray(args));
        };
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        } else return Array.from(arr);
    }
    var _utils = __webpack_require__(8);
    function create() {
        var mutator = arguments.length <= 0 || void 0 === arguments[0] ? _utils.identity : arguments[0];
        return function(method, prefix, args) {
            return [ mutator(prefix) ].concat(_toConsumableArray(args));
        };
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) return obj; else {
            var newObj = {};
            if (null != obj) for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            newObj["default"] = obj;
            return newObj;
        }
    }
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    var _utilsReplacer = __webpack_require__(9);
    var _utilsReplacer2 = _interopRequireDefault(_utilsReplacer);
    var _utils = __webpack_require__(8);
    var utils = _interopRequireWildcard(_utils);
    function create() {
        var replacer = arguments.length <= 0 || void 0 === arguments[0] ? new _utilsReplacer2["default"]() : arguments[0];
        return function(method, prefix, args) {
            return utils.replacePlaceholders(replacer, args);
        };
    }
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function create() {
        var placeholders = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
        var regList = createRegExpList(placeholders);
        return function(method, prefix, args) {
            return normalizePlaceholders(args, regList);
        };
    }
    function createRegExpList(placeholders) {
        return Object.keys(placeholders).map(function(placeholder) {
            return {
                normalPlaceholder: placeholders[placeholder],
                regExp: new RegExp("%" + placeholder, "g")
            };
        });
    }
    function normalizePlaceholders(args, regList) {
        if ("string" === typeof args[0]) regList.forEach(function(item) {
            args[0] = args[0].replace(item.regExp, "%" + item.normalPlaceholder);
        });
        return args;
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    var _utils = __webpack_require__(8);
    function create(delimiter) {
        return function(method, prefix, args) {
            return [ (0, _utils.toString)(args, delimiter) ];
        };
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        } else return Array.from(arr);
    }
    var _utils = __webpack_require__(8);
    function create(count, delimiter) {
        return function(method, prefix, args) {
            return [ (0, _utils.toString)(args.slice(0, count), delimiter) ].concat(_toConsumableArray(args.slice(count)));
        };
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    var buildInfo = __webpack_require__(21);
    var browserInfo = __webpack_require__(167);
    var lggr = __webpack_require__(6);
    var logUtils = __webpack_require__(169);
    var consoleWriter = lggr.createConsoleWriter();
    var writers = {
        console: consoleWriter
    };
    var formatters = {
        console: logUtils.consoleFormatter
    };
    if (buildInfo.isDebug() || !browserInfo.isFirefox()) {
        var file = new lggr.WebFile({
            fileName: "debug.log",
            oldFileName: "debug-old.log",
            maxSize: 5 * 1024 * 1024
        });
        var fileWriter = lggr.createWebFileWriter(file);
        writers.platform = fileWriter;
        formatters.platform = logUtils.fileFormatter;
    }
    module.exports = {
        writers: writers,
        formatters: formatters
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var _ = __webpack_require__(22);
    var buildInfo = window.vbBuildInfo;
    module.exports = {
        getVersion: function() {
            return chrome.runtime.getManifest().version;
        },
        getRevision: function() {
            return getValue("buildNumber", 0);
        },
        getTimestamp: function() {
            return getValue("date", 0);
        },
        isDebug: function() {
            return Boolean(getValue("debug", false));
        },
        getRegionBrandId: function() {
            return getValue("regionBrandId");
        },
        getCustomBrandId: function() {
            return getValue("customBrandId");
        },
        getClids: function() {
            return getValue("clids");
        },
        ensureBrandedBuildInfo: function() {}
    };
    function getValue(path, defaultValue) {
        return _.get(buildInfo, path, defaultValue);
    }
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = {
        defaults: __webpack_require__(23),
        groupBy: __webpack_require__(50),
        difference: __webpack_require__(80),
        each: __webpack_require__(90),
        map: __webpack_require__(94),
        max: __webpack_require__(97),
        debounce: __webpack_require__(105),
        create: __webpack_require__(107),
        attempt: __webpack_require__(109),
        throttle: __webpack_require__(111),
        values: __webpack_require__(102),
        pluck: __webpack_require__(112),
        merge: __webpack_require__(113),
        cloneDeep: __webpack_require__(120),
        ary: __webpack_require__(126),
        endsWith: __webpack_require__(150),
        repeat: __webpack_require__(151),
        extend: __webpack_require__(152),
        get: __webpack_require__(153),
        noop: __webpack_require__(139),
        findKey: __webpack_require__(154),
        assign: __webpack_require__(24),
        find: __webpack_require__(157),
        uniq: __webpack_require__(160),
        isNumber: __webpack_require__(163),
        filter: __webpack_require__(164)
    };
}, function(module, exports, __webpack_require__) {
    var assign = __webpack_require__(24), assignDefaults = __webpack_require__(48), createDefaults = __webpack_require__(49);
    var defaults = createDefaults(assign, assignDefaults);
    module.exports = defaults;
}, function(module, exports, __webpack_require__) {
    var assignWith = __webpack_require__(25), baseAssign = __webpack_require__(41), createAssigner = __webpack_require__(43);
    var assign = createAssigner(function(object, source, customizer) {
        return customizer ? assignWith(object, source, customizer) : baseAssign(object, source);
    });
    module.exports = assign;
}, function(module, exports, __webpack_require__) {
    var keys = __webpack_require__(26);
    function assignWith(object, source, customizer) {
        var index = -1, props = keys(source), length = props.length;
        while (++index < length) {
            var key = props[index], value = object[key], result = customizer(value, source[key], key, object, source);
            if ((result === result ? result !== value : value === value) || void 0 === value && !(key in object)) object[key] = result;
        }
        return object;
    }
    module.exports = assignWith;
}, function(module, exports, __webpack_require__) {
    var getNative = __webpack_require__(27), isArrayLike = __webpack_require__(32), isObject = __webpack_require__(30), shimKeys = __webpack_require__(36);
    var nativeKeys = getNative(Object, "keys");
    var keys = !nativeKeys ? shimKeys : function(object) {
        var Ctor = null == object ? void 0 : object.constructor;
        if ("function" == typeof Ctor && Ctor.prototype === object || "function" != typeof object && isArrayLike(object)) return shimKeys(object);
        return isObject(object) ? nativeKeys(object) : [];
    };
    module.exports = keys;
}, function(module, exports, __webpack_require__) {
    var isNative = __webpack_require__(28);
    function getNative(object, key) {
        var value = null == object ? void 0 : object[key];
        return isNative(value) ? value : void 0;
    }
    module.exports = getNative;
}, function(module, exports, __webpack_require__) {
    var isFunction = __webpack_require__(29), isObjectLike = __webpack_require__(31);
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var objectProto = Object.prototype;
    var fnToString = Function.prototype.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var reIsNative = RegExp("^" + fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    function isNative(value) {
        if (null == value) return false;
        if (isFunction(value)) return reIsNative.test(fnToString.call(value));
        return isObjectLike(value) && reIsHostCtor.test(value);
    }
    module.exports = isNative;
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(30);
    var funcTag = "[object Function]";
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    function isFunction(value) {
        return isObject(value) && objToString.call(value) == funcTag;
    }
    module.exports = isFunction;
}, function(module, exports) {
    function isObject(value) {
        var type = typeof value;
        return !!value && ("object" == type || "function" == type);
    }
    module.exports = isObject;
}, function(module, exports) {
    function isObjectLike(value) {
        return !!value && "object" == typeof value;
    }
    module.exports = isObjectLike;
}, function(module, exports, __webpack_require__) {
    var getLength = __webpack_require__(33), isLength = __webpack_require__(35);
    function isArrayLike(value) {
        return null != value && isLength(getLength(value));
    }
    module.exports = isArrayLike;
}, function(module, exports, __webpack_require__) {
    var baseProperty = __webpack_require__(34);
    var getLength = baseProperty("length");
    module.exports = getLength;
}, function(module, exports) {
    function baseProperty(key) {
        return function(object) {
            return null == object ? void 0 : object[key];
        };
    }
    module.exports = baseProperty;
}, function(module, exports) {
    var MAX_SAFE_INTEGER = 9007199254740991;
    function isLength(value) {
        return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    module.exports = isLength;
}, function(module, exports, __webpack_require__) {
    var isArguments = __webpack_require__(37), isArray = __webpack_require__(38), isIndex = __webpack_require__(39), isLength = __webpack_require__(35), keysIn = __webpack_require__(40);
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function shimKeys(object) {
        var props = keysIn(object), propsLength = props.length, length = propsLength && object.length;
        var allowIndexes = !!length && isLength(length) && (isArray(object) || isArguments(object));
        var index = -1, result = [];
        while (++index < propsLength) {
            var key = props[index];
            if (allowIndexes && isIndex(key, length) || hasOwnProperty.call(object, key)) result.push(key);
        }
        return result;
    }
    module.exports = shimKeys;
}, function(module, exports, __webpack_require__) {
    var isArrayLike = __webpack_require__(32), isObjectLike = __webpack_require__(31);
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    function isArguments(value) {
        return isObjectLike(value) && isArrayLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    }
    module.exports = isArguments;
}, function(module, exports, __webpack_require__) {
    var getNative = __webpack_require__(27), isLength = __webpack_require__(35), isObjectLike = __webpack_require__(31);
    var arrayTag = "[object Array]";
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    var nativeIsArray = getNative(Array, "isArray");
    var isArray = nativeIsArray || function(value) {
        return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
    };
    module.exports = isArray;
}, function(module, exports) {
    var reIsUint = /^\d+$/;
    var MAX_SAFE_INTEGER = 9007199254740991;
    function isIndex(value, length) {
        value = "number" == typeof value || reIsUint.test(value) ? +value : -1;
        length = null == length ? MAX_SAFE_INTEGER : length;
        return value > -1 && value % 1 == 0 && value < length;
    }
    module.exports = isIndex;
}, function(module, exports, __webpack_require__) {
    var isArguments = __webpack_require__(37), isArray = __webpack_require__(38), isIndex = __webpack_require__(39), isLength = __webpack_require__(35), isObject = __webpack_require__(30);
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function keysIn(object) {
        if (null == object) return [];
        if (!isObject(object)) object = Object(object);
        var length = object.length;
        length = length && isLength(length) && (isArray(object) || isArguments(object)) && length || 0;
        var Ctor = object.constructor, index = -1, isProto = "function" == typeof Ctor && Ctor.prototype === object, result = Array(length), skipIndexes = length > 0;
        while (++index < length) result[index] = index + "";
        for (var key in object) if (!(skipIndexes && isIndex(key, length)) && !("constructor" == key && (isProto || !hasOwnProperty.call(object, key)))) result.push(key);
        return result;
    }
    module.exports = keysIn;
}, function(module, exports, __webpack_require__) {
    var baseCopy = __webpack_require__(42), keys = __webpack_require__(26);
    function baseAssign(object, source) {
        return null == source ? object : baseCopy(source, keys(source), object);
    }
    module.exports = baseAssign;
}, function(module, exports) {
    function baseCopy(source, props, object) {
        object || (object = {});
        var index = -1, length = props.length;
        while (++index < length) {
            var key = props[index];
            object[key] = source[key];
        }
        return object;
    }
    module.exports = baseCopy;
}, function(module, exports, __webpack_require__) {
    var bindCallback = __webpack_require__(44), isIterateeCall = __webpack_require__(46), restParam = __webpack_require__(47);
    function createAssigner(assigner) {
        return restParam(function(object, sources) {
            var index = -1, length = null == object ? 0 : sources.length, customizer = length > 2 ? sources[length - 2] : void 0, guard = length > 2 ? sources[2] : void 0, thisArg = length > 1 ? sources[length - 1] : void 0;
            if ("function" == typeof customizer) {
                customizer = bindCallback(customizer, thisArg, 5);
                length -= 2;
            } else {
                customizer = "function" == typeof thisArg ? thisArg : void 0;
                length -= customizer ? 1 : 0;
            }
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                customizer = length < 3 ? void 0 : customizer;
                length = 1;
            }
            while (++index < length) {
                var source = sources[index];
                if (source) assigner(object, source, customizer);
            }
            return object;
        });
    }
    module.exports = createAssigner;
}, function(module, exports, __webpack_require__) {
    var identity = __webpack_require__(45);
    function bindCallback(func, thisArg, argCount) {
        if ("function" != typeof func) return identity;
        if (void 0 === thisArg) return func;
        switch (argCount) {
          case 1:
            return function(value) {
                return func.call(thisArg, value);
            };

          case 3:
            return function(value, index, collection) {
                return func.call(thisArg, value, index, collection);
            };

          case 4:
            return function(accumulator, value, index, collection) {
                return func.call(thisArg, accumulator, value, index, collection);
            };

          case 5:
            return function(value, other, key, object, source) {
                return func.call(thisArg, value, other, key, object, source);
            };
        }
        return function() {
            return func.apply(thisArg, arguments);
        };
    }
    module.exports = bindCallback;
}, function(module, exports) {
    function identity(value) {
        return value;
    }
    module.exports = identity;
}, function(module, exports, __webpack_require__) {
    var isArrayLike = __webpack_require__(32), isIndex = __webpack_require__(39), isObject = __webpack_require__(30);
    function isIterateeCall(value, index, object) {
        if (!isObject(object)) return false;
        var type = typeof index;
        if ("number" == type ? isArrayLike(object) && isIndex(index, object.length) : "string" == type && index in object) {
            var other = object[index];
            return value === value ? value === other : other !== other;
        }
        return false;
    }
    module.exports = isIterateeCall;
}, function(module, exports) {
    var FUNC_ERROR_TEXT = "Expected a function";
    var nativeMax = Math.max;
    function restParam(func, start) {
        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
        start = nativeMax(void 0 === start ? func.length - 1 : +start || 0, 0);
        return function() {
            var args = arguments, index = -1, length = nativeMax(args.length - start, 0), rest = Array(length);
            while (++index < length) rest[index] = args[start + index];
            switch (start) {
              case 0:
                return func.call(this, rest);

              case 1:
                return func.call(this, args[0], rest);

              case 2:
                return func.call(this, args[0], args[1], rest);
            }
            var otherArgs = Array(start + 1);
            index = -1;
            while (++index < start) otherArgs[index] = args[index];
            otherArgs[start] = rest;
            return func.apply(this, otherArgs);
        };
    }
    module.exports = restParam;
}, function(module, exports) {
    function assignDefaults(objectValue, sourceValue) {
        return void 0 === objectValue ? sourceValue : objectValue;
    }
    module.exports = assignDefaults;
}, function(module, exports, __webpack_require__) {
    var restParam = __webpack_require__(47);
    function createDefaults(assigner, customizer) {
        return restParam(function(args) {
            var object = args[0];
            if (null == object) return object;
            args.push(customizer);
            return assigner.apply(void 0, args);
        });
    }
    module.exports = createDefaults;
}, function(module, exports, __webpack_require__) {
    var createAggregator = __webpack_require__(51);
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var groupBy = createAggregator(function(result, value, key) {
        if (hasOwnProperty.call(result, key)) result[key].push(value); else result[key] = [ value ];
    });
    module.exports = groupBy;
}, function(module, exports, __webpack_require__) {
    var baseCallback = __webpack_require__(52), baseEach = __webpack_require__(75), isArray = __webpack_require__(38);
    function createAggregator(setter, initializer) {
        return function(collection, iteratee, thisArg) {
            var result = initializer ? initializer() : {};
            iteratee = baseCallback(iteratee, thisArg, 3);
            if (isArray(collection)) {
                var index = -1, length = collection.length;
                while (++index < length) {
                    var value = collection[index];
                    setter(result, value, iteratee(value, index, collection), collection);
                }
            } else baseEach(collection, function(value, key, collection) {
                setter(result, value, iteratee(value, key, collection), collection);
            });
            return result;
        };
    }
    module.exports = createAggregator;
}, function(module, exports, __webpack_require__) {
    var baseMatches = __webpack_require__(53), baseMatchesProperty = __webpack_require__(66), bindCallback = __webpack_require__(44), identity = __webpack_require__(45), property = __webpack_require__(73);
    function baseCallback(func, thisArg, argCount) {
        var type = typeof func;
        if ("function" == type) return void 0 === thisArg ? func : bindCallback(func, thisArg, argCount);
        if (null == func) return identity;
        if ("object" == type) return baseMatches(func);
        return void 0 === thisArg ? property(func) : baseMatchesProperty(func, thisArg);
    }
    module.exports = baseCallback;
}, function(module, exports, __webpack_require__) {
    var baseIsMatch = __webpack_require__(54), getMatchData = __webpack_require__(63), toObject = __webpack_require__(62);
    function baseMatches(source) {
        var matchData = getMatchData(source);
        if (1 == matchData.length && matchData[0][2]) {
            var key = matchData[0][0], value = matchData[0][1];
            return function(object) {
                if (null == object) return false;
                return object[key] === value && (void 0 !== value || key in toObject(object));
            };
        }
        return function(object) {
            return baseIsMatch(object, matchData);
        };
    }
    module.exports = baseMatches;
}, function(module, exports, __webpack_require__) {
    var baseIsEqual = __webpack_require__(55), toObject = __webpack_require__(62);
    function baseIsMatch(object, matchData, customizer) {
        var index = matchData.length, length = index, noCustomizer = !customizer;
        if (null == object) return !length;
        object = toObject(object);
        while (index--) {
            var data = matchData[index];
            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return false;
        }
        while (++index < length) {
            data = matchData[index];
            var key = data[0], objValue = object[key], srcValue = data[1];
            if (noCustomizer && data[2]) {
                if (void 0 === objValue && !(key in object)) return false;
            } else {
                var result = customizer ? customizer(objValue, srcValue, key) : void 0;
                if (!(void 0 === result ? baseIsEqual(srcValue, objValue, customizer, true) : result)) return false;
            }
        }
        return true;
    }
    module.exports = baseIsMatch;
}, function(module, exports, __webpack_require__) {
    var baseIsEqualDeep = __webpack_require__(56), isObject = __webpack_require__(30), isObjectLike = __webpack_require__(31);
    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
        if (value === other) return true;
        if (null == value || null == other || !isObject(value) && !isObjectLike(other)) return value !== value && other !== other;
        return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
    }
    module.exports = baseIsEqual;
}, function(module, exports, __webpack_require__) {
    var equalArrays = __webpack_require__(57), equalByTag = __webpack_require__(59), equalObjects = __webpack_require__(60), isArray = __webpack_require__(38), isTypedArray = __webpack_require__(61);
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objToString = objectProto.toString;
    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
        var objIsArr = isArray(object), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
        if (!objIsArr) {
            objTag = objToString.call(object);
            if (objTag == argsTag) objTag = objectTag; else if (objTag != objectTag) objIsArr = isTypedArray(object);
        }
        if (!othIsArr) {
            othTag = objToString.call(other);
            if (othTag == argsTag) othTag = objectTag; else if (othTag != objectTag) othIsArr = isTypedArray(other);
        }
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && !(objIsArr || objIsObj)) return equalByTag(object, other, objTag);
        if (!isLoose) {
            var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
            if (objIsWrapped || othIsWrapped) return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
        }
        if (!isSameTag) return false;
        stackA || (stackA = []);
        stackB || (stackB = []);
        var length = stackA.length;
        while (length--) if (stackA[length] == object) return stackB[length] == other;
        stackA.push(object);
        stackB.push(other);
        var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
        stackA.pop();
        stackB.pop();
        return result;
    }
    module.exports = baseIsEqualDeep;
}, function(module, exports, __webpack_require__) {
    var arraySome = __webpack_require__(58);
    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
        var index = -1, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isLoose && othLength > arrLength)) return false;
        while (++index < arrLength) {
            var arrValue = array[index], othValue = other[index], result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : void 0;
            if (void 0 !== result) {
                if (result) continue;
                return false;
            }
            if (isLoose) {
                if (!arraySome(other, function(othValue) {
                    return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
                })) return false;
            } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) return false;
        }
        return true;
    }
    module.exports = equalArrays;
}, function(module, exports) {
    function arraySome(array, predicate) {
        var index = -1, length = array.length;
        while (++index < length) if (predicate(array[index], index, array)) return true;
        return false;
    }
    module.exports = arraySome;
}, function(module, exports) {
    var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", numberTag = "[object Number]", regexpTag = "[object RegExp]", stringTag = "[object String]";
    function equalByTag(object, other, tag) {
        switch (tag) {
          case boolTag:
          case dateTag:
            return +object == +other;

          case errorTag:
            return object.name == other.name && object.message == other.message;

          case numberTag:
            return object != +object ? other != +other : object == +other;

          case regexpTag:
          case stringTag:
            return object == other + "";
        }
        return false;
    }
    module.exports = equalByTag;
}, function(module, exports, __webpack_require__) {
    var keys = __webpack_require__(26);
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
        var objProps = keys(object), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
        if (objLength != othLength && !isLoose) return false;
        var index = objLength;
        while (index--) {
            var key = objProps[index];
            if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) return false;
        }
        var skipCtor = isLoose;
        while (++index < objLength) {
            key = objProps[index];
            var objValue = object[key], othValue = other[key], result = customizer ? customizer(isLoose ? othValue : objValue, isLoose ? objValue : othValue, key) : void 0;
            if (!(void 0 === result ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) return false;
            skipCtor || (skipCtor = "constructor" == key);
        }
        if (!skipCtor) {
            var objCtor = object.constructor, othCtor = other.constructor;
            if (objCtor != othCtor && "constructor" in object && "constructor" in other && !("function" == typeof objCtor && objCtor instanceof objCtor && "function" == typeof othCtor && othCtor instanceof othCtor)) return false;
        }
        return true;
    }
    module.exports = equalObjects;
}, function(module, exports, __webpack_require__) {
    var isLength = __webpack_require__(35), isObjectLike = __webpack_require__(31);
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    function isTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
    }
    module.exports = isTypedArray;
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(30);
    function toObject(value) {
        return isObject(value) ? value : Object(value);
    }
    module.exports = toObject;
}, function(module, exports, __webpack_require__) {
    var isStrictComparable = __webpack_require__(64), pairs = __webpack_require__(65);
    function getMatchData(object) {
        var result = pairs(object), length = result.length;
        while (length--) result[length][2] = isStrictComparable(result[length][1]);
        return result;
    }
    module.exports = getMatchData;
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(30);
    function isStrictComparable(value) {
        return value === value && !isObject(value);
    }
    module.exports = isStrictComparable;
}, function(module, exports, __webpack_require__) {
    var keys = __webpack_require__(26), toObject = __webpack_require__(62);
    function pairs(object) {
        object = toObject(object);
        var index = -1, props = keys(object), length = props.length, result = Array(length);
        while (++index < length) {
            var key = props[index];
            result[index] = [ key, object[key] ];
        }
        return result;
    }
    module.exports = pairs;
}, function(module, exports, __webpack_require__) {
    var baseGet = __webpack_require__(67), baseIsEqual = __webpack_require__(55), baseSlice = __webpack_require__(68), isArray = __webpack_require__(38), isKey = __webpack_require__(69), isStrictComparable = __webpack_require__(64), last = __webpack_require__(70), toObject = __webpack_require__(62), toPath = __webpack_require__(71);
    function baseMatchesProperty(path, srcValue) {
        var isArr = isArray(path), isCommon = isKey(path) && isStrictComparable(srcValue), pathKey = path + "";
        path = toPath(path);
        return function(object) {
            if (null == object) return false;
            var key = pathKey;
            object = toObject(object);
            if ((isArr || !isCommon) && !(key in object)) {
                object = 1 == path.length ? object : baseGet(object, baseSlice(path, 0, -1));
                if (null == object) return false;
                key = last(path);
                object = toObject(object);
            }
            return object[key] === srcValue ? void 0 !== srcValue || key in object : baseIsEqual(srcValue, object[key], void 0, true);
        };
    }
    module.exports = baseMatchesProperty;
}, function(module, exports, __webpack_require__) {
    var toObject = __webpack_require__(62);
    function baseGet(object, path, pathKey) {
        if (null == object) return;
        if (void 0 !== pathKey && pathKey in toObject(object)) path = [ pathKey ];
        var index = 0, length = path.length;
        while (null != object && index < length) object = object[path[index++]];
        return index && index == length ? object : void 0;
    }
    module.exports = baseGet;
}, function(module, exports) {
    function baseSlice(array, start, end) {
        var index = -1, length = array.length;
        start = null == start ? 0 : +start || 0;
        if (start < 0) start = -start > length ? 0 : length + start;
        end = void 0 === end || end > length ? length : +end || 0;
        if (end < 0) end += length;
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result = Array(length);
        while (++index < length) result[index] = array[index + start];
        return result;
    }
    module.exports = baseSlice;
}, function(module, exports, __webpack_require__) {
    var isArray = __webpack_require__(38), toObject = __webpack_require__(62);
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
    function isKey(value, object) {
        var type = typeof value;
        if ("string" == type && reIsPlainProp.test(value) || "number" == type) return true;
        if (isArray(value)) return false;
        var result = !reIsDeepProp.test(value);
        return result || null != object && value in toObject(object);
    }
    module.exports = isKey;
}, function(module, exports) {
    function last(array) {
        var length = array ? array.length : 0;
        return length ? array[length - 1] : void 0;
    }
    module.exports = last;
}, function(module, exports, __webpack_require__) {
    var baseToString = __webpack_require__(72), isArray = __webpack_require__(38);
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
    var reEscapeChar = /\\(\\)?/g;
    function toPath(value) {
        if (isArray(value)) return value;
        var result = [];
        baseToString(value).replace(rePropName, function(match, number, quote, string) {
            result.push(quote ? string.replace(reEscapeChar, "$1") : number || match);
        });
        return result;
    }
    module.exports = toPath;
}, function(module, exports) {
    function baseToString(value) {
        return null == value ? "" : value + "";
    }
    module.exports = baseToString;
}, function(module, exports, __webpack_require__) {
    var baseProperty = __webpack_require__(34), basePropertyDeep = __webpack_require__(74), isKey = __webpack_require__(69);
    function property(path) {
        return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }
    module.exports = property;
}, function(module, exports, __webpack_require__) {
    var baseGet = __webpack_require__(67), toPath = __webpack_require__(71);
    function basePropertyDeep(path) {
        var pathKey = path + "";
        path = toPath(path);
        return function(object) {
            return baseGet(object, path, pathKey);
        };
    }
    module.exports = basePropertyDeep;
}, function(module, exports, __webpack_require__) {
    var baseForOwn = __webpack_require__(76), createBaseEach = __webpack_require__(79);
    var baseEach = createBaseEach(baseForOwn);
    module.exports = baseEach;
}, function(module, exports, __webpack_require__) {
    var baseFor = __webpack_require__(77), keys = __webpack_require__(26);
    function baseForOwn(object, iteratee) {
        return baseFor(object, iteratee, keys);
    }
    module.exports = baseForOwn;
}, function(module, exports, __webpack_require__) {
    var createBaseFor = __webpack_require__(78);
    var baseFor = createBaseFor();
    module.exports = baseFor;
}, function(module, exports, __webpack_require__) {
    var toObject = __webpack_require__(62);
    function createBaseFor(fromRight) {
        return function(object, iteratee, keysFunc) {
            var iterable = toObject(object), props = keysFunc(object), length = props.length, index = fromRight ? length : -1;
            while (fromRight ? index-- : ++index < length) {
                var key = props[index];
                if (false === iteratee(iterable[key], key, iterable)) break;
            }
            return object;
        };
    }
    module.exports = createBaseFor;
}, function(module, exports, __webpack_require__) {
    var getLength = __webpack_require__(33), isLength = __webpack_require__(35), toObject = __webpack_require__(62);
    function createBaseEach(eachFunc, fromRight) {
        return function(collection, iteratee) {
            var length = collection ? getLength(collection) : 0;
            if (!isLength(length)) return eachFunc(collection, iteratee);
            var index = fromRight ? length : -1, iterable = toObject(collection);
            while (fromRight ? index-- : ++index < length) if (false === iteratee(iterable[index], index, iterable)) break;
            return collection;
        };
    }
    module.exports = createBaseEach;
}, function(module, exports, __webpack_require__) {
    var baseDifference = __webpack_require__(81), baseFlatten = __webpack_require__(88), isArrayLike = __webpack_require__(32), isObjectLike = __webpack_require__(31), restParam = __webpack_require__(47);
    var difference = restParam(function(array, values) {
        return isObjectLike(array) && isArrayLike(array) ? baseDifference(array, baseFlatten(values, false, true)) : [];
    });
    module.exports = difference;
}, function(module, exports, __webpack_require__) {
    var baseIndexOf = __webpack_require__(82), cacheIndexOf = __webpack_require__(84), createCache = __webpack_require__(85);
    var LARGE_ARRAY_SIZE = 200;
    function baseDifference(array, values) {
        var length = array ? array.length : 0, result = [];
        if (!length) return result;
        var index = -1, indexOf = baseIndexOf, isCommon = true, cache = isCommon && values.length >= LARGE_ARRAY_SIZE ? createCache(values) : null, valuesLength = values.length;
        if (cache) {
            indexOf = cacheIndexOf;
            isCommon = false;
            values = cache;
        }
        outer: while (++index < length) {
            var value = array[index];
            if (isCommon && value === value) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) if (values[valuesIndex] === value) continue outer;
                result.push(value);
            } else if (indexOf(values, value, 0) < 0) result.push(value);
        }
        return result;
    }
    module.exports = baseDifference;
}, function(module, exports, __webpack_require__) {
    var indexOfNaN = __webpack_require__(83);
    function baseIndexOf(array, value, fromIndex) {
        if (value !== value) return indexOfNaN(array, fromIndex);
        var index = fromIndex - 1, length = array.length;
        while (++index < length) if (array[index] === value) return index;
        return -1;
    }
    module.exports = baseIndexOf;
}, function(module, exports) {
    function indexOfNaN(array, fromIndex, fromRight) {
        var length = array.length, index = fromIndex + (fromRight ? 0 : -1);
        while (fromRight ? index-- : ++index < length) {
            var other = array[index];
            if (other !== other) return index;
        }
        return -1;
    }
    module.exports = indexOfNaN;
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(30);
    function cacheIndexOf(cache, value) {
        var data = cache.data, result = "string" == typeof value || isObject(value) ? data.set.has(value) : data.hash[value];
        return result ? 0 : -1;
    }
    module.exports = cacheIndexOf;
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var SetCache = __webpack_require__(86), getNative = __webpack_require__(27);
        var Set = getNative(global, "Set");
        var nativeCreate = getNative(Object, "create");
        function createCache(values) {
            return nativeCreate && Set ? new SetCache(values) : null;
        }
        module.exports = createCache;
    }).call(exports, function() {
        return this;
    }());
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var cachePush = __webpack_require__(87), getNative = __webpack_require__(27);
        var Set = getNative(global, "Set");
        var nativeCreate = getNative(Object, "create");
        function SetCache(values) {
            var length = values ? values.length : 0;
            this.data = {
                hash: nativeCreate(null),
                set: new Set()
            };
            while (length--) this.push(values[length]);
        }
        SetCache.prototype.push = cachePush;
        module.exports = SetCache;
    }).call(exports, function() {
        return this;
    }());
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(30);
    function cachePush(value) {
        var data = this.data;
        if ("string" == typeof value || isObject(value)) data.set.add(value); else data.hash[value] = true;
    }
    module.exports = cachePush;
}, function(module, exports, __webpack_require__) {
    var arrayPush = __webpack_require__(89), isArguments = __webpack_require__(37), isArray = __webpack_require__(38), isArrayLike = __webpack_require__(32), isObjectLike = __webpack_require__(31);
    function baseFlatten(array, isDeep, isStrict, result) {
        result || (result = []);
        var index = -1, length = array.length;
        while (++index < length) {
            var value = array[index];
            if (isObjectLike(value) && isArrayLike(value) && (isStrict || isArray(value) || isArguments(value))) if (isDeep) baseFlatten(value, isDeep, isStrict, result); else arrayPush(result, value); else if (!isStrict) result[result.length] = value;
        }
        return result;
    }
    module.exports = baseFlatten;
}, function(module, exports) {
    function arrayPush(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) array[offset + index] = values[index];
        return array;
    }
    module.exports = arrayPush;
}, function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(91);
}, function(module, exports, __webpack_require__) {
    var arrayEach = __webpack_require__(92), baseEach = __webpack_require__(75), createForEach = __webpack_require__(93);
    var forEach = createForEach(arrayEach, baseEach);
    module.exports = forEach;
}, function(module, exports) {
    function arrayEach(array, iteratee) {
        var index = -1, length = array.length;
        while (++index < length) if (false === iteratee(array[index], index, array)) break;
        return array;
    }
    module.exports = arrayEach;
}, function(module, exports, __webpack_require__) {
    var bindCallback = __webpack_require__(44), isArray = __webpack_require__(38);
    function createForEach(arrayFunc, eachFunc) {
        return function(collection, iteratee, thisArg) {
            return "function" == typeof iteratee && void 0 === thisArg && isArray(collection) ? arrayFunc(collection, iteratee) : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
        };
    }
    module.exports = createForEach;
}, function(module, exports, __webpack_require__) {
    var arrayMap = __webpack_require__(95), baseCallback = __webpack_require__(52), baseMap = __webpack_require__(96), isArray = __webpack_require__(38);
    function map(collection, iteratee, thisArg) {
        var func = isArray(collection) ? arrayMap : baseMap;
        iteratee = baseCallback(iteratee, thisArg, 3);
        return func(collection, iteratee);
    }
    module.exports = map;
}, function(module, exports) {
    function arrayMap(array, iteratee) {
        var index = -1, length = array.length, result = Array(length);
        while (++index < length) result[index] = iteratee(array[index], index, array);
        return result;
    }
    module.exports = arrayMap;
}, function(module, exports, __webpack_require__) {
    var baseEach = __webpack_require__(75), isArrayLike = __webpack_require__(32);
    function baseMap(collection, iteratee) {
        var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
        baseEach(collection, function(value, key, collection) {
            result[++index] = iteratee(value, key, collection);
        });
        return result;
    }
    module.exports = baseMap;
}, function(module, exports, __webpack_require__) {
    var createExtremum = __webpack_require__(98), gt = __webpack_require__(104);
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
    var max = createExtremum(gt, NEGATIVE_INFINITY);
    module.exports = max;
}, function(module, exports, __webpack_require__) {
    var arrayExtremum = __webpack_require__(99), baseCallback = __webpack_require__(52), baseExtremum = __webpack_require__(100), isArray = __webpack_require__(38), isIterateeCall = __webpack_require__(46), toIterable = __webpack_require__(101);
    function createExtremum(comparator, exValue) {
        return function(collection, iteratee, thisArg) {
            if (thisArg && isIterateeCall(collection, iteratee, thisArg)) iteratee = void 0;
            iteratee = baseCallback(iteratee, thisArg, 3);
            if (1 == iteratee.length) {
                collection = isArray(collection) ? collection : toIterable(collection);
                var result = arrayExtremum(collection, iteratee, comparator, exValue);
                if (!(collection.length && result === exValue)) return result;
            }
            return baseExtremum(collection, iteratee, comparator, exValue);
        };
    }
    module.exports = createExtremum;
}, function(module, exports) {
    function arrayExtremum(array, iteratee, comparator, exValue) {
        var index = -1, length = array.length, computed = exValue, result = computed;
        while (++index < length) {
            var value = array[index], current = +iteratee(value);
            if (comparator(current, computed)) {
                computed = current;
                result = value;
            }
        }
        return result;
    }
    module.exports = arrayExtremum;
}, function(module, exports, __webpack_require__) {
    var baseEach = __webpack_require__(75);
    function baseExtremum(collection, iteratee, comparator, exValue) {
        var computed = exValue, result = computed;
        baseEach(collection, function(value, index, collection) {
            var current = +iteratee(value, index, collection);
            if (comparator(current, computed) || current === exValue && current === result) {
                computed = current;
                result = value;
            }
        });
        return result;
    }
    module.exports = baseExtremum;
}, function(module, exports, __webpack_require__) {
    var isArrayLike = __webpack_require__(32), isObject = __webpack_require__(30), values = __webpack_require__(102);
    function toIterable(value) {
        if (null == value) return [];
        if (!isArrayLike(value)) return values(value);
        return isObject(value) ? value : Object(value);
    }
    module.exports = toIterable;
}, function(module, exports, __webpack_require__) {
    var baseValues = __webpack_require__(103), keys = __webpack_require__(26);
    function values(object) {
        return baseValues(object, keys(object));
    }
    module.exports = values;
}, function(module, exports) {
    function baseValues(object, props) {
        var index = -1, length = props.length, result = Array(length);
        while (++index < length) result[index] = object[props[index]];
        return result;
    }
    module.exports = baseValues;
}, function(module, exports) {
    function gt(value, other) {
        return value > other;
    }
    module.exports = gt;
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(30), now = __webpack_require__(106);
    var FUNC_ERROR_TEXT = "Expected a function";
    var nativeMax = Math.max;
    function debounce(func, wait, options) {
        var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0, maxWait = false, trailing = true;
        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
        wait = wait < 0 ? 0 : +wait || 0;
        if (true === options) {
            var leading = true;
            trailing = false;
        } else if (isObject(options)) {
            leading = !!options.leading;
            maxWait = "maxWait" in options && nativeMax(+options.maxWait || 0, wait);
            trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function cancel() {
            if (timeoutId) clearTimeout(timeoutId);
            if (maxTimeoutId) clearTimeout(maxTimeoutId);
            lastCalled = 0;
            maxTimeoutId = timeoutId = trailingCall = void 0;
        }
        function complete(isCalled, id) {
            if (id) clearTimeout(id);
            maxTimeoutId = timeoutId = trailingCall = void 0;
            if (isCalled) {
                lastCalled = now();
                result = func.apply(thisArg, args);
                if (!timeoutId && !maxTimeoutId) args = thisArg = void 0;
            }
        }
        function delayed() {
            var remaining = wait - (now() - stamp);
            if (remaining <= 0 || remaining > wait) complete(trailingCall, maxTimeoutId); else timeoutId = setTimeout(delayed, remaining);
        }
        function maxDelayed() {
            complete(trailing, timeoutId);
        }
        function debounced() {
            args = arguments;
            stamp = now();
            thisArg = this;
            trailingCall = trailing && (timeoutId || !leading);
            if (false === maxWait) var leadingCall = leading && !timeoutId; else {
                if (!maxTimeoutId && !leading) lastCalled = stamp;
                var remaining = maxWait - (stamp - lastCalled), isCalled = remaining <= 0 || remaining > maxWait;
                if (isCalled) {
                    if (maxTimeoutId) maxTimeoutId = clearTimeout(maxTimeoutId);
                    lastCalled = stamp;
                    result = func.apply(thisArg, args);
                } else if (!maxTimeoutId) maxTimeoutId = setTimeout(maxDelayed, remaining);
            }
            if (isCalled && timeoutId) timeoutId = clearTimeout(timeoutId); else if (!timeoutId && wait !== maxWait) timeoutId = setTimeout(delayed, wait);
            if (leadingCall) {
                isCalled = true;
                result = func.apply(thisArg, args);
            }
            if (isCalled && !timeoutId && !maxTimeoutId) args = thisArg = void 0;
            return result;
        }
        debounced.cancel = cancel;
        return debounced;
    }
    module.exports = debounce;
}, function(module, exports, __webpack_require__) {
    var getNative = __webpack_require__(27);
    var nativeNow = getNative(Date, "now");
    var now = nativeNow || function() {
        return new Date().getTime();
    };
    module.exports = now;
}, function(module, exports, __webpack_require__) {
    var baseAssign = __webpack_require__(41), baseCreate = __webpack_require__(108), isIterateeCall = __webpack_require__(46);
    function create(prototype, properties, guard) {
        var result = baseCreate(prototype);
        if (guard && isIterateeCall(prototype, properties, guard)) properties = void 0;
        return properties ? baseAssign(result, properties) : result;
    }
    module.exports = create;
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(30);
    var baseCreate = function() {
        function object() {}
        return function(prototype) {
            if (isObject(prototype)) {
                object.prototype = prototype;
                var result = new object();
                object.prototype = void 0;
            }
            return result || {};
        };
    }();
    module.exports = baseCreate;
}, function(module, exports, __webpack_require__) {
    var isError = __webpack_require__(110), restParam = __webpack_require__(47);
    var attempt = restParam(function(func, args) {
        try {
            return func.apply(void 0, args);
        } catch (e) {
            return isError(e) ? e : new Error(e);
        }
    });
    module.exports = attempt;
}, function(module, exports, __webpack_require__) {
    var isObjectLike = __webpack_require__(31);
    var errorTag = "[object Error]";
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    function isError(value) {
        return isObjectLike(value) && "string" == typeof value.message && objToString.call(value) == errorTag;
    }
    module.exports = isError;
}, function(module, exports, __webpack_require__) {
    var debounce = __webpack_require__(105), isObject = __webpack_require__(30);
    var FUNC_ERROR_TEXT = "Expected a function";
    function throttle(func, wait, options) {
        var leading = true, trailing = true;
        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
        if (false === options) leading = false; else if (isObject(options)) {
            leading = "leading" in options ? !!options.leading : leading;
            trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, {
            leading: leading,
            maxWait: +wait,
            trailing: trailing
        });
    }
    module.exports = throttle;
}, function(module, exports, __webpack_require__) {
    var map = __webpack_require__(94), property = __webpack_require__(73);
    function pluck(collection, path) {
        return map(collection, property(path));
    }
    module.exports = pluck;
}, function(module, exports, __webpack_require__) {
    var baseMerge = __webpack_require__(114), createAssigner = __webpack_require__(43);
    var merge = createAssigner(baseMerge);
    module.exports = merge;
}, function(module, exports, __webpack_require__) {
    var arrayEach = __webpack_require__(92), baseMergeDeep = __webpack_require__(115), isArray = __webpack_require__(38), isArrayLike = __webpack_require__(32), isObject = __webpack_require__(30), isObjectLike = __webpack_require__(31), isTypedArray = __webpack_require__(61), keys = __webpack_require__(26);
    function baseMerge(object, source, customizer, stackA, stackB) {
        if (!isObject(object)) return object;
        var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)), props = isSrcArr ? void 0 : keys(source);
        arrayEach(props || source, function(srcValue, key) {
            if (props) {
                key = srcValue;
                srcValue = source[key];
            }
            if (isObjectLike(srcValue)) {
                stackA || (stackA = []);
                stackB || (stackB = []);
                baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
            } else {
                var value = object[key], result = customizer ? customizer(value, srcValue, key, object, source) : void 0, isCommon = void 0 === result;
                if (isCommon) result = srcValue;
                if ((void 0 !== result || isSrcArr && !(key in object)) && (isCommon || (result === result ? result !== value : value === value))) object[key] = result;
            }
        });
        return object;
    }
    module.exports = baseMerge;
}, function(module, exports, __webpack_require__) {
    var arrayCopy = __webpack_require__(116), isArguments = __webpack_require__(37), isArray = __webpack_require__(38), isArrayLike = __webpack_require__(32), isPlainObject = __webpack_require__(117), isTypedArray = __webpack_require__(61), toPlainObject = __webpack_require__(119);
    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
        var length = stackA.length, srcValue = source[key];
        while (length--) if (stackA[length] == srcValue) {
            object[key] = stackB[length];
            return;
        }
        var value = object[key], result = customizer ? customizer(value, srcValue, key, object, source) : void 0, isCommon = void 0 === result;
        if (isCommon) {
            result = srcValue;
            if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) result = isArray(value) ? value : isArrayLike(value) ? arrayCopy(value) : []; else if (isPlainObject(srcValue) || isArguments(srcValue)) result = isArguments(value) ? toPlainObject(value) : isPlainObject(value) ? value : {}; else isCommon = false;
        }
        stackA.push(srcValue);
        stackB.push(result);
        if (isCommon) object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB); else if (result === result ? result !== value : value === value) object[key] = result;
    }
    module.exports = baseMergeDeep;
}, function(module, exports) {
    function arrayCopy(source, array) {
        var index = -1, length = source.length;
        array || (array = Array(length));
        while (++index < length) array[index] = source[index];
        return array;
    }
    module.exports = arrayCopy;
}, function(module, exports, __webpack_require__) {
    var baseForIn = __webpack_require__(118), isArguments = __webpack_require__(37), isObjectLike = __webpack_require__(31);
    var objectTag = "[object Object]";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objToString = objectProto.toString;
    function isPlainObject(value) {
        var Ctor;
        if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) || !hasOwnProperty.call(value, "constructor") && (Ctor = value.constructor, 
        "function" == typeof Ctor && !(Ctor instanceof Ctor))) return false;
        var result;
        baseForIn(value, function(subValue, key) {
            result = key;
        });
        return void 0 === result || hasOwnProperty.call(value, result);
    }
    module.exports = isPlainObject;
}, function(module, exports, __webpack_require__) {
    var baseFor = __webpack_require__(77), keysIn = __webpack_require__(40);
    function baseForIn(object, iteratee) {
        return baseFor(object, iteratee, keysIn);
    }
    module.exports = baseForIn;
}, function(module, exports, __webpack_require__) {
    var baseCopy = __webpack_require__(42), keysIn = __webpack_require__(40);
    function toPlainObject(value) {
        return baseCopy(value, keysIn(value));
    }
    module.exports = toPlainObject;
}, function(module, exports, __webpack_require__) {
    var baseClone = __webpack_require__(121), bindCallback = __webpack_require__(44);
    function cloneDeep(value, customizer, thisArg) {
        return "function" == typeof customizer ? baseClone(value, true, bindCallback(customizer, thisArg, 3)) : baseClone(value, true);
    }
    module.exports = cloneDeep;
}, function(module, exports, __webpack_require__) {
    var arrayCopy = __webpack_require__(116), arrayEach = __webpack_require__(92), baseAssign = __webpack_require__(41), baseForOwn = __webpack_require__(76), initCloneArray = __webpack_require__(122), initCloneByTag = __webpack_require__(123), initCloneObject = __webpack_require__(125), isArray = __webpack_require__(38), isObject = __webpack_require__(30);
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[stringTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[mapTag] = cloneableTags[setTag] = cloneableTags[weakMapTag] = false;
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
        var result;
        if (customizer) result = object ? customizer(value, key, object) : customizer(value);
        if (void 0 !== result) return result;
        if (!isObject(value)) return value;
        var isArr = isArray(value);
        if (isArr) {
            result = initCloneArray(value);
            if (!isDeep) return arrayCopy(value, result);
        } else {
            var tag = objToString.call(value), isFunc = tag == funcTag;
            if (tag == objectTag || tag == argsTag || isFunc && !object) {
                result = initCloneObject(isFunc ? {} : value);
                if (!isDeep) return baseAssign(result, value);
            } else return cloneableTags[tag] ? initCloneByTag(value, tag, isDeep) : object ? value : {};
        }
        stackA || (stackA = []);
        stackB || (stackB = []);
        var length = stackA.length;
        while (length--) if (stackA[length] == value) return stackB[length];
        stackA.push(value);
        stackB.push(result);
        (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
            result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
        });
        return result;
    }
    module.exports = baseClone;
}, function(module, exports) {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function initCloneArray(array) {
        var length = array.length, result = new array.constructor(length);
        if (length && "string" == typeof array[0] && hasOwnProperty.call(array, "index")) {
            result.index = array.index;
            result.input = array.input;
        }
        return result;
    }
    module.exports = initCloneArray;
}, function(module, exports, __webpack_require__) {
    var bufferClone = __webpack_require__(124);
    var boolTag = "[object Boolean]", dateTag = "[object Date]", numberTag = "[object Number]", regexpTag = "[object RegExp]", stringTag = "[object String]";
    var arrayBufferTag = "[object ArrayBuffer]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reFlags = /\w*$/;
    function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag:
            return bufferClone(object);

          case boolTag:
          case dateTag:
            return new Ctor(+object);

          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            var buffer = object.buffer;
            return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

          case numberTag:
          case stringTag:
            return new Ctor(object);

          case regexpTag:
            var result = new Ctor(object.source, reFlags.exec(object));
            result.lastIndex = object.lastIndex;
        }
        return result;
    }
    module.exports = initCloneByTag;
}, function(module, exports) {
    (function(global) {
        var ArrayBuffer = global.ArrayBuffer, Uint8Array = global.Uint8Array;
        function bufferClone(buffer) {
            var result = new ArrayBuffer(buffer.byteLength), view = new Uint8Array(result);
            view.set(new Uint8Array(buffer));
            return result;
        }
        module.exports = bufferClone;
    }).call(exports, function() {
        return this;
    }());
}, function(module, exports) {
    function initCloneObject(object) {
        var Ctor = object.constructor;
        if (!("function" == typeof Ctor && Ctor instanceof Ctor)) Ctor = Object;
        return new Ctor();
    }
    module.exports = initCloneObject;
}, function(module, exports, __webpack_require__) {
    var createWrapper = __webpack_require__(127), isIterateeCall = __webpack_require__(46);
    var ARY_FLAG = 128;
    var nativeMax = Math.max;
    function ary(func, n, guard) {
        if (guard && isIterateeCall(func, n, guard)) n = void 0;
        n = func && null == n ? func.length : nativeMax(+n || 0, 0);
        return createWrapper(func, ARY_FLAG, void 0, void 0, void 0, void 0, n);
    }
    module.exports = ary;
}, function(module, exports, __webpack_require__) {
    var baseSetData = __webpack_require__(128), createBindWrapper = __webpack_require__(130), createHybridWrapper = __webpack_require__(132), createPartialWrapper = __webpack_require__(148), getData = __webpack_require__(138), mergeData = __webpack_require__(149), setData = __webpack_require__(147);
    var BIND_FLAG = 1, BIND_KEY_FLAG = 2, PARTIAL_FLAG = 32, PARTIAL_RIGHT_FLAG = 64;
    var FUNC_ERROR_TEXT = "Expected a function";
    var nativeMax = Math.max;
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
        var isBindKey = bitmask & BIND_KEY_FLAG;
        if (!isBindKey && "function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
        var length = partials ? partials.length : 0;
        if (!length) {
            bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
            partials = holders = void 0;
        }
        length -= holders ? holders.length : 0;
        if (bitmask & PARTIAL_RIGHT_FLAG) {
            var partialsRight = partials, holdersRight = holders;
            partials = holders = void 0;
        }
        var data = isBindKey ? void 0 : getData(func), newData = [ func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity ];
        if (data) {
            mergeData(newData, data);
            bitmask = newData[1];
            arity = newData[9];
        }
        newData[9] = null == arity ? isBindKey ? 0 : func.length : nativeMax(arity - length, 0) || 0;
        if (bitmask == BIND_FLAG) var result = createBindWrapper(newData[0], newData[2]); else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) result = createPartialWrapper.apply(void 0, newData); else result = createHybridWrapper.apply(void 0, newData);
        var setter = data ? baseSetData : setData;
        return setter(result, newData);
    }
    module.exports = createWrapper;
}, function(module, exports, __webpack_require__) {
    var identity = __webpack_require__(45), metaMap = __webpack_require__(129);
    var baseSetData = !metaMap ? identity : function(func, data) {
        metaMap.set(func, data);
        return func;
    };
    module.exports = baseSetData;
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var getNative = __webpack_require__(27);
        var WeakMap = getNative(global, "WeakMap");
        var metaMap = WeakMap && new WeakMap();
        module.exports = metaMap;
    }).call(exports, function() {
        return this;
    }());
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var createCtorWrapper = __webpack_require__(131);
        function createBindWrapper(func, thisArg) {
            var Ctor = createCtorWrapper(func);
            function wrapper() {
                var fn = this && this !== global && this instanceof wrapper ? Ctor : func;
                return fn.apply(thisArg, arguments);
            }
            return wrapper;
        }
        module.exports = createBindWrapper;
    }).call(exports, function() {
        return this;
    }());
}, function(module, exports, __webpack_require__) {
    var baseCreate = __webpack_require__(108), isObject = __webpack_require__(30);
    function createCtorWrapper(Ctor) {
        return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return new Ctor();

              case 1:
                return new Ctor(args[0]);

              case 2:
                return new Ctor(args[0], args[1]);

              case 3:
                return new Ctor(args[0], args[1], args[2]);

              case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);

              case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);

              case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);

              case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
            var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, args);
            return isObject(result) ? result : thisBinding;
        };
    }
    module.exports = createCtorWrapper;
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var arrayCopy = __webpack_require__(116), composeArgs = __webpack_require__(133), composeArgsRight = __webpack_require__(134), createCtorWrapper = __webpack_require__(131), isLaziable = __webpack_require__(135), reorder = __webpack_require__(145), replaceHolders = __webpack_require__(146), setData = __webpack_require__(147);
        var BIND_FLAG = 1, BIND_KEY_FLAG = 2, CURRY_BOUND_FLAG = 4, CURRY_FLAG = 8, CURRY_RIGHT_FLAG = 16, PARTIAL_FLAG = 32, PARTIAL_RIGHT_FLAG = 64, ARY_FLAG = 128;
        var nativeMax = Math.max;
        function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
            var isAry = bitmask & ARY_FLAG, isBind = bitmask & BIND_FLAG, isBindKey = bitmask & BIND_KEY_FLAG, isCurry = bitmask & CURRY_FLAG, isCurryBound = bitmask & CURRY_BOUND_FLAG, isCurryRight = bitmask & CURRY_RIGHT_FLAG, Ctor = isBindKey ? void 0 : createCtorWrapper(func);
            function wrapper() {
                var length = arguments.length, index = length, args = Array(length);
                while (index--) args[index] = arguments[index];
                if (partials) args = composeArgs(args, partials, holders);
                if (partialsRight) args = composeArgsRight(args, partialsRight, holdersRight);
                if (isCurry || isCurryRight) {
                    var placeholder = wrapper.placeholder, argsHolders = replaceHolders(args, placeholder);
                    length -= argsHolders.length;
                    if (length < arity) {
                        var newArgPos = argPos ? arrayCopy(argPos) : void 0, newArity = nativeMax(arity - length, 0), newsHolders = isCurry ? argsHolders : void 0, newHoldersRight = isCurry ? void 0 : argsHolders, newPartials = isCurry ? args : void 0, newPartialsRight = isCurry ? void 0 : args;
                        bitmask |= isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG;
                        bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
                        if (!isCurryBound) bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
                        var newData = [ func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity ], result = createHybridWrapper.apply(void 0, newData);
                        if (isLaziable(func)) setData(result, newData);
                        result.placeholder = placeholder;
                        return result;
                    }
                }
                var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
                if (argPos) args = reorder(args, argPos);
                if (isAry && ary < args.length) args.length = ary;
                if (this && this !== global && this instanceof wrapper) fn = Ctor || createCtorWrapper(func);
                return fn.apply(thisBinding, args);
            }
            return wrapper;
        }
        module.exports = createHybridWrapper;
    }).call(exports, function() {
        return this;
    }());
}, function(module, exports) {
    var nativeMax = Math.max;
    function composeArgs(args, partials, holders) {
        var holdersLength = holders.length, argsIndex = -1, argsLength = nativeMax(args.length - holdersLength, 0), leftIndex = -1, leftLength = partials.length, result = Array(leftLength + argsLength);
        while (++leftIndex < leftLength) result[leftIndex] = partials[leftIndex];
        while (++argsIndex < holdersLength) result[holders[argsIndex]] = args[argsIndex];
        while (argsLength--) result[leftIndex++] = args[argsIndex++];
        return result;
    }
    module.exports = composeArgs;
}, function(module, exports) {
    var nativeMax = Math.max;
    function composeArgsRight(args, partials, holders) {
        var holdersIndex = -1, holdersLength = holders.length, argsIndex = -1, argsLength = nativeMax(args.length - holdersLength, 0), rightIndex = -1, rightLength = partials.length, result = Array(argsLength + rightLength);
        while (++argsIndex < argsLength) result[argsIndex] = args[argsIndex];
        var offset = argsIndex;
        while (++rightIndex < rightLength) result[offset + rightIndex] = partials[rightIndex];
        while (++holdersIndex < holdersLength) result[offset + holders[holdersIndex]] = args[argsIndex++];
        return result;
    }
    module.exports = composeArgsRight;
}, function(module, exports, __webpack_require__) {
    var LazyWrapper = __webpack_require__(136), getData = __webpack_require__(138), getFuncName = __webpack_require__(140), lodash = __webpack_require__(142);
    function isLaziable(func) {
        var funcName = getFuncName(func), other = lodash[funcName];
        if ("function" != typeof other || !(funcName in LazyWrapper.prototype)) return false;
        if (func === other) return true;
        var data = getData(other);
        return !!data && func === data[0];
    }
    module.exports = isLaziable;
}, function(module, exports, __webpack_require__) {
    var baseCreate = __webpack_require__(108), baseLodash = __webpack_require__(137);
    var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
    function LazyWrapper(value) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__dir__ = 1;
        this.__filtered__ = false;
        this.__iteratees__ = [];
        this.__takeCount__ = POSITIVE_INFINITY;
        this.__views__ = [];
    }
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;
    module.exports = LazyWrapper;
}, function(module, exports) {
    function baseLodash() {}
    module.exports = baseLodash;
}, function(module, exports, __webpack_require__) {
    var metaMap = __webpack_require__(129), noop = __webpack_require__(139);
    var getData = !metaMap ? noop : function(func) {
        return metaMap.get(func);
    };
    module.exports = getData;
}, function(module, exports) {
    function noop() {}
    module.exports = noop;
}, function(module, exports, __webpack_require__) {
    var realNames = __webpack_require__(141);
    function getFuncName(func) {
        var result = func.name + "", array = realNames[result], length = array ? array.length : 0;
        while (length--) {
            var data = array[length], otherFunc = data.func;
            if (null == otherFunc || otherFunc == func) return data.name;
        }
        return result;
    }
    module.exports = getFuncName;
}, function(module, exports) {
    var realNames = {};
    module.exports = realNames;
}, function(module, exports, __webpack_require__) {
    var LazyWrapper = __webpack_require__(136), LodashWrapper = __webpack_require__(143), baseLodash = __webpack_require__(137), isArray = __webpack_require__(38), isObjectLike = __webpack_require__(31), wrapperClone = __webpack_require__(144);
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function lodash(value) {
        if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
            if (value instanceof LodashWrapper) return value;
            if (hasOwnProperty.call(value, "__chain__") && hasOwnProperty.call(value, "__wrapped__")) return wrapperClone(value);
        }
        return new LodashWrapper(value);
    }
    lodash.prototype = baseLodash.prototype;
    module.exports = lodash;
}, function(module, exports, __webpack_require__) {
    var baseCreate = __webpack_require__(108), baseLodash = __webpack_require__(137);
    function LodashWrapper(value, chainAll, actions) {
        this.__wrapped__ = value;
        this.__actions__ = actions || [];
        this.__chain__ = !!chainAll;
    }
    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;
    module.exports = LodashWrapper;
}, function(module, exports, __webpack_require__) {
    var LazyWrapper = __webpack_require__(136), LodashWrapper = __webpack_require__(143), arrayCopy = __webpack_require__(116);
    function wrapperClone(wrapper) {
        return wrapper instanceof LazyWrapper ? wrapper.clone() : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
    }
    module.exports = wrapperClone;
}, function(module, exports, __webpack_require__) {
    var arrayCopy = __webpack_require__(116), isIndex = __webpack_require__(39);
    var nativeMin = Math.min;
    function reorder(array, indexes) {
        var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = arrayCopy(array);
        while (length--) {
            var index = indexes[length];
            array[length] = isIndex(index, arrLength) ? oldArray[index] : void 0;
        }
        return array;
    }
    module.exports = reorder;
}, function(module, exports) {
    var PLACEHOLDER = "__lodash_placeholder__";
    function replaceHolders(array, placeholder) {
        var index = -1, length = array.length, resIndex = -1, result = [];
        while (++index < length) if (array[index] === placeholder) {
            array[index] = PLACEHOLDER;
            result[++resIndex] = index;
        }
        return result;
    }
    module.exports = replaceHolders;
}, function(module, exports, __webpack_require__) {
    var baseSetData = __webpack_require__(128), now = __webpack_require__(106);
    var HOT_COUNT = 150, HOT_SPAN = 16;
    var setData = function() {
        var count = 0, lastCalled = 0;
        return function(key, value) {
            var stamp = now(), remaining = HOT_SPAN - (stamp - lastCalled);
            lastCalled = stamp;
            if (remaining > 0) {
                if (++count >= HOT_COUNT) return key;
            } else count = 0;
            return baseSetData(key, value);
        };
    }();
    module.exports = setData;
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var createCtorWrapper = __webpack_require__(131);
        var BIND_FLAG = 1;
        function createPartialWrapper(func, bitmask, thisArg, partials) {
            var isBind = bitmask & BIND_FLAG, Ctor = createCtorWrapper(func);
            function wrapper() {
                var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength);
                while (++leftIndex < leftLength) args[leftIndex] = partials[leftIndex];
                while (argsLength--) args[leftIndex++] = arguments[++argsIndex];
                var fn = this && this !== global && this instanceof wrapper ? Ctor : func;
                return fn.apply(isBind ? thisArg : this, args);
            }
            return wrapper;
        }
        module.exports = createPartialWrapper;
    }).call(exports, function() {
        return this;
    }());
}, function(module, exports, __webpack_require__) {
    var arrayCopy = __webpack_require__(116), composeArgs = __webpack_require__(133), composeArgsRight = __webpack_require__(134), replaceHolders = __webpack_require__(146);
    var BIND_FLAG = 1, CURRY_BOUND_FLAG = 4, CURRY_FLAG = 8, ARY_FLAG = 128, REARG_FLAG = 256;
    var PLACEHOLDER = "__lodash_placeholder__";
    var nativeMin = Math.min;
    function mergeData(data, source) {
        var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < ARY_FLAG;
        var isCombo = srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG || srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8] || srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG;
        if (!(isCommon || isCombo)) return data;
        if (srcBitmask & BIND_FLAG) {
            data[2] = source[2];
            newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
        }
        var value = source[3];
        if (value) {
            var partials = data[3];
            data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
            data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
        }
        value = source[5];
        if (value) {
            partials = data[5];
            data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
            data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
        }
        value = source[7];
        if (value) data[7] = arrayCopy(value);
        if (srcBitmask & ARY_FLAG) data[8] = null == data[8] ? source[8] : nativeMin(data[8], source[8]);
        if (null == data[9]) data[9] = source[9];
        data[0] = source[0];
        data[1] = newBitmask;
        return data;
    }
    module.exports = mergeData;
}, function(module, exports, __webpack_require__) {
    var baseToString = __webpack_require__(72);
    var nativeMin = Math.min;
    function endsWith(string, target, position) {
        string = baseToString(string);
        target += "";
        var length = string.length;
        position = void 0 === position ? length : nativeMin(position < 0 ? 0 : +position || 0, length);
        position -= target.length;
        return position >= 0 && string.indexOf(target, position) == position;
    }
    module.exports = endsWith;
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var baseToString = __webpack_require__(72);
        var nativeFloor = Math.floor, nativeIsFinite = global.isFinite;
        function repeat(string, n) {
            var result = "";
            string = baseToString(string);
            n = +n;
            if (n < 1 || !string || !nativeIsFinite(n)) return result;
            do {
                if (n % 2) result += string;
                n = nativeFloor(n / 2);
                string += string;
            } while (n);
            return result;
        }
        module.exports = repeat;
    }).call(exports, function() {
        return this;
    }());
}, function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(24);
}, function(module, exports, __webpack_require__) {
    var baseGet = __webpack_require__(67), toPath = __webpack_require__(71);
    function get(object, path, defaultValue) {
        var result = null == object ? void 0 : baseGet(object, toPath(path), path + "");
        return void 0 === result ? defaultValue : result;
    }
    module.exports = get;
}, function(module, exports, __webpack_require__) {
    var baseForOwn = __webpack_require__(76), createFindKey = __webpack_require__(155);
    var findKey = createFindKey(baseForOwn);
    module.exports = findKey;
}, function(module, exports, __webpack_require__) {
    var baseCallback = __webpack_require__(52), baseFind = __webpack_require__(156);
    function createFindKey(objectFunc) {
        return function(object, predicate, thisArg) {
            predicate = baseCallback(predicate, thisArg, 3);
            return baseFind(object, predicate, objectFunc, true);
        };
    }
    module.exports = createFindKey;
}, function(module, exports) {
    function baseFind(collection, predicate, eachFunc, retKey) {
        var result;
        eachFunc(collection, function(value, key, collection) {
            if (predicate(value, key, collection)) {
                result = retKey ? key : value;
                return false;
            }
        });
        return result;
    }
    module.exports = baseFind;
}, function(module, exports, __webpack_require__) {
    var baseEach = __webpack_require__(75), createFind = __webpack_require__(158);
    var find = createFind(baseEach);
    module.exports = find;
}, function(module, exports, __webpack_require__) {
    var baseCallback = __webpack_require__(52), baseFind = __webpack_require__(156), baseFindIndex = __webpack_require__(159), isArray = __webpack_require__(38);
    function createFind(eachFunc, fromRight) {
        return function(collection, predicate, thisArg) {
            predicate = baseCallback(predicate, thisArg, 3);
            if (isArray(collection)) {
                var index = baseFindIndex(collection, predicate, fromRight);
                return index > -1 ? collection[index] : void 0;
            }
            return baseFind(collection, predicate, eachFunc);
        };
    }
    module.exports = createFind;
}, function(module, exports) {
    function baseFindIndex(array, predicate, fromRight) {
        var length = array.length, index = fromRight ? length : -1;
        while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
        return -1;
    }
    module.exports = baseFindIndex;
}, function(module, exports, __webpack_require__) {
    var baseCallback = __webpack_require__(52), baseUniq = __webpack_require__(161), isIterateeCall = __webpack_require__(46), sortedUniq = __webpack_require__(162);
    function uniq(array, isSorted, iteratee, thisArg) {
        var length = array ? array.length : 0;
        if (!length) return [];
        if (null != isSorted && "boolean" != typeof isSorted) {
            thisArg = iteratee;
            iteratee = isIterateeCall(array, isSorted, thisArg) ? void 0 : isSorted;
            isSorted = false;
        }
        iteratee = null == iteratee ? iteratee : baseCallback(iteratee, thisArg, 3);
        return isSorted ? sortedUniq(array, iteratee) : baseUniq(array, iteratee);
    }
    module.exports = uniq;
}, function(module, exports, __webpack_require__) {
    var baseIndexOf = __webpack_require__(82), cacheIndexOf = __webpack_require__(84), createCache = __webpack_require__(85);
    var LARGE_ARRAY_SIZE = 200;
    function baseUniq(array, iteratee) {
        var index = -1, indexOf = baseIndexOf, length = array.length, isCommon = true, isLarge = isCommon && length >= LARGE_ARRAY_SIZE, seen = isLarge ? createCache() : null, result = [];
        if (seen) {
            indexOf = cacheIndexOf;
            isCommon = false;
        } else {
            isLarge = false;
            seen = iteratee ? [] : result;
        }
        outer: while (++index < length) {
            var value = array[index], computed = iteratee ? iteratee(value, index, array) : value;
            if (isCommon && value === value) {
                var seenIndex = seen.length;
                while (seenIndex--) if (seen[seenIndex] === computed) continue outer;
                if (iteratee) seen.push(computed);
                result.push(value);
            } else if (indexOf(seen, computed, 0) < 0) {
                if (iteratee || isLarge) seen.push(computed);
                result.push(value);
            }
        }
        return result;
    }
    module.exports = baseUniq;
}, function(module, exports) {
    function sortedUniq(array, iteratee) {
        var seen, index = -1, length = array.length, resIndex = -1, result = [];
        while (++index < length) {
            var value = array[index], computed = iteratee ? iteratee(value, index, array) : value;
            if (!index || seen !== computed) {
                seen = computed;
                result[++resIndex] = value;
            }
        }
        return result;
    }
    module.exports = sortedUniq;
}, function(module, exports, __webpack_require__) {
    var isObjectLike = __webpack_require__(31);
    var numberTag = "[object Number]";
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    function isNumber(value) {
        return "number" == typeof value || isObjectLike(value) && objToString.call(value) == numberTag;
    }
    module.exports = isNumber;
}, function(module, exports, __webpack_require__) {
    var arrayFilter = __webpack_require__(165), baseCallback = __webpack_require__(52), baseFilter = __webpack_require__(166), isArray = __webpack_require__(38);
    function filter(collection, predicate, thisArg) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        predicate = baseCallback(predicate, thisArg, 3);
        return func(collection, predicate);
    }
    module.exports = filter;
}, function(module, exports) {
    function arrayFilter(array, predicate) {
        var index = -1, length = array.length, resIndex = -1, result = [];
        while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) result[++resIndex] = value;
        }
        return result;
    }
    module.exports = arrayFilter;
}, function(module, exports, __webpack_require__) {
    var baseEach = __webpack_require__(75);
    function baseFilter(collection, predicate) {
        var result = [];
        baseEach(collection, function(value, index, collection) {
            if (predicate(value, index, collection)) result.push(value);
        });
        return result;
    }
    module.exports = baseFilter;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var about = __webpack_require__(168);
    var cache = {};
    module.exports = {
        CHROME_ID: "chr",
        FX_ID: "fx",
        IE_ID: "ie",
        get name() {
            cache.nameVersion = cache.nameVersion || extractNameVersion();
            return cache.nameVersion[0];
        },
        get version() {
            cache.nameVersion = cache.nameVersion || extractNameVersion();
            return cache.nameVersion[1];
        },
        get os() {
            if (!cache.os) {
                var platformName = navigator.platform.toLowerCase();
                if (0 === platformName.indexOf("win")) cache.os = "win"; else if (0 === platformName.indexOf("mac")) cache.os = "mac"; else cache.os = navigator.platform || "unknown";
            }
            return cache.os;
        },
        get platformId() {
            return about.id;
        },
        isChrome: function(majorVersion) {
            return about.id === module.exports.CHROME_ID && (majorVersion ? isMajorVersion(majorVersion) : true);
        },
        isFirefox: function(majorVersion) {
            return about.id === module.exports.FX_ID && (majorVersion ? isMajorVersion(majorVersion) : true);
        },
        isIE: function(majorVersion) {
            return about.id === module.exports.IE_ID && (majorVersion ? isMajorVersion(majorVersion) : true);
        }
    };
    function extractNameVersion() {
        var ua = navigator.userAgent;
        var tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return [ "msie", tem[1] || "" ];
        }
        M = M[2] ? [ M[1], M[2] ] : [ navigator.appName, navigator.appVersion, "-?" ];
        if (null !== (tem = ua.match(/version\/(\d+)/i))) M.splice(1, 1, tem[1]);
        return M;
    }
    function isMajorVersion(majorVersion) {
        var version = module.exports.version;
        majorVersion = String(majorVersion);
        return !version || version === majorVersion || 0 === version.indexOf(majorVersion + ".");
    }
}, function(module, exports) {
    "use strict";
    var visbookmarksFakeTabUrl = "";
    var visbookmarksUrl = "chrome://newtab/";
    var visbookmarksRealUrl = chrome.runtime.getURL("/layout/newtab.html");
    module.exports = {
        id: "chr",
        isChr: true,
        extensionId: chrome.runtime.id,
        cid: 72482,
        type: "vb-chrome",
        yasoft: "vbch",
        browserName: "chrome",
        visbookmarksUrl: visbookmarksUrl,
        visbookmarksFakeTabUrl: visbookmarksFakeTabUrl,
        visbookmarksRealUrl: visbookmarksRealUrl,
        vbUrls: [ visbookmarksUrl, visbookmarksFakeTabUrl, visbookmarksRealUrl ]
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var lggr = __webpack_require__(6);
    function toUpperCase(str) {
        return str ? str.toUpperCase() : "";
    }
    function toLowerCase(str) {
        return str ? str.toLowerCase() : "";
    }
    var normalizePlaceholders = lggr.createNormalFormatter({
        j: "o",
        l: "s"
    });
    var mutatePrefix = function(prefix) {
        return "[" + prefix.toLowerCase() + "]";
    };
    module.exports = {
        toUpperCase: toUpperCase,
        toLowerCase: toLowerCase,
        normalizePlaceholders: normalizePlaceholders,
        consoleFormatter: lggr.combineFormatters([ normalizePlaceholders, lggr.createPrefixFormatter(mutatePrefix), lggr.createJoinFirstFormatter(2) ]),
        fileFormatter: lggr.combineFormatters([ lggr.createPlaceholdersFormatter(), lggr.createPrefixFormatter(mutatePrefix), lggr.createMethodFormatter(toUpperCase), lggr.createDateFormatter(), lggr.createJoinFormatter() ])
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var Channel = __webpack_require__(171);
    module.exports = ChannelCacher;
    function ChannelCacher() {
        this.startCaching();
        this.channel = Channel.create();
    }
    ChannelCacher.prototype.attach = function(channel) {
        channel.addListener(this._onChannel.bind(this));
    };
    ChannelCacher.prototype.stopCaching = function() {
        this._caching = false;
        this._callCached();
    };
    ChannelCacher.prototype.startCaching = function() {
        this._caching = true;
        this._calls = [];
    };
    ChannelCacher.prototype.isCaching = function() {
        return this._caching;
    };
    ChannelCacher.prototype._onChannel = function() {
        if (this._caching) {
            var args = Array.prototype.slice.call(arguments);
            this._calls.push(args);
        } else this._dispatch(arguments);
    };
    ChannelCacher.prototype._dispatch = function(args) {
        this.channel.dispatch.apply(this.channel, args);
    };
    ChannelCacher.prototype._callCached = function() {
        this._calls.forEach(this._dispatch, this);
        this._calls.length = 0;
    };
}, function(module, exports) {
    "use strict";
    function Channel(name) {
        this._listeners = [];
        this._mute = false;
        this._name = name || "";
    }
    Channel.prototype.addListener = function(callback) {
        this._ensureFunction(callback);
        this._listeners.push(callback);
    };
    Channel.prototype.removeListener = function(callback) {
        this._ensureFunction(callback);
        var index = this._listeners.indexOf(callback);
        if (index >= 0) this._listeners.splice(index, 1);
    };
    Channel.prototype.hasListener = function(callback) {
        this._ensureFunction(callback);
        return this._listeners.indexOf(callback) >= 0;
    };
    Channel.prototype.hasListeners = function() {
        return this._listeners.length > 0;
    };
    Channel.prototype.dispatch = function() {
        if (this._mute) return;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i) args[i] = arguments[i];
        this._listeners.forEach(function(listener) {
            listener.apply(null, args);
        });
    };
    Channel.prototype.mute = function() {
        this._mute = true;
    };
    Channel.prototype.unmute = function() {
        this._mute = false;
    };
    Channel.prototype._ensureFunction = function(callback) {
        if ("function" !== typeof callback) throw new Error("Channel " + this._name + " listener is not a function");
    };
    Channel.create = function(name) {
        return new Channel(name);
    };
    module.exports = Channel;
}, function(module, exports) {
    "use strict";
    module.exports = function() {};
} ]);