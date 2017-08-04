document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35732/livereload.js?snipver=1"></' + 'script>');
(function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var makeValidCharMap = function makeValidCharMap() {
    var ranges = [[48, 57], [65, 90], [97, 122]];
    var theMap = ranges.reduce(function (acc, _ref) {
        var _ref2 = slicedToArray(_ref, 2),
            min = _ref2[0],
            max = _ref2[1];

        var pointer = min;
        while (pointer <= max) {
            acc.push(pointer);
            pointer++;
        }
        return acc;
    }, []);
    return theMap;
};

var charMap = makeValidCharMap();

var uuid = function uuid(_ref3) {
    var length = _ref3.length,
        rng = _ref3.rng;

    if (!rng) rng = Math.random;
    var theReturn = [];
    for (var i = 0; i < length; i++) {
        var num = Math.floor(rng() * charMap.length);
        theReturn.push(String.fromCharCode(charMap[num]));
    }
    return theReturn.join('');
};

var ExtendableError = function (_Error) {
    inherits(ExtendableError, _Error);

    function ExtendableError(message) {
        classCallCheck(this, ExtendableError);

        var _this = possibleConstructorReturn(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this, message));

        _this.name = _this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(_this, _this.constructor);
        } else {
            _this.stack = new Error(message).stack;
        }
        return _this;
    }

    return ExtendableError;
}(Error);

var getUrlArguments = function getUrlArguments() {
    var queryString = location.search.substr(1);
    var result = {};
    queryString.split("&").forEach(function (part) {
        var _part$split = part.split("="),
            _part$split2 = slicedToArray(_part$split, 2),
            key = _part$split2[0],
            value = _part$split2[1];

        result[key] = decodeURIComponent(value);
    });
    return result;
};

var Matter = require('matter-js/build/matter.js');

var Composite = Matter.Composite;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Engine = Matter.Engine;
var Events = Matter.Events;
var World = Matter.World;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global$1 == 'object' && global$1 && global$1.Object === Object && global$1;

module.exports = freeGlobal;


var _freeGlobal = Object.freeze({

});

var freeGlobal$1 = ( _freeGlobal && undefined ) || _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal$1 || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$2.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$2.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$3.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$1.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal$1.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag$1 = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = _createBaseEach(_baseForOwn);

var _baseEach = baseEach;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity_1;
}

var _castFunction = castFunction;

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray_1(collection) ? _arrayEach : _baseEach;
  return func(collection, _castFunction(iteratee));
}

var forEach_1$1 = forEach;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto$6 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty$4).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

var defineProperty$1 = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty$1;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$6.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;
var COMPARE_UNORDERED_FLAG$1 = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG$1) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;
var COMPARE_UNORDERED_FLAG$2 = 2;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var mapTag$1 = '[object Map]';
var numberTag$1 = '[object Number]';
var regexpTag$1 = '[object RegExp]';
var setTag$1 = '[object Set]';
var stringTag$1 = '[object String]';
var symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$1 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined;
var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$1:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$1:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$1:
      return object.name == other.name && object.message == other.message;

    case regexpTag$1:
    case stringTag$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$1:
      var convert = _mapToArray;

    case setTag$1:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$2;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$11 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$11.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1;

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';
var objectTag$2 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$2 = '[object Set]';
var weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView);
var mapCtorString = _toSource(_Map);
var promiseCtorString = _toSource(_Promise);
var setCtorString = _toSource(_Set);
var weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var objectTag$1 = '[object Object]';

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$1 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$1 : othTag;

  var objIsObj = objTag == objectTag$1,
      othIsObj = othTag == objectTag$1,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$1)) {
    var objIsWrapped = objIsObj && hasOwnProperty$7.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$7.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var reLeadingDot = /^\./;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined;
var symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$1(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get$1;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1;
var COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = _baseIteratee(iteratee, 3);

  _baseForOwn(object, function(value, key, object) {
    _baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

var mapValues_1$1 = mapValues;

var GENETYPES = {
    FLOAT: 0,
    RANKED_SET: 1
};

function bounds(min, max) {
    return function (number) {
        return Math.min(Math.max(number, min), max);
    };
}

function valueBetween(min, max, random) {
    return min + random() * (max - min);
}

function mutate(_ref, random) {
    var parentValue = _ref.parentValue,
        _boundsFn = _ref._boundsFn,
        magnitude = _ref.mutates.magnitude,
        rate = _ref.rate;

    var mutation = (random() * magnitude * 2 - magnitude) * rate;

    return _boundsFn(parentValue + mutation);
}

var genomeDefinition = {
    ballRadius: {
        type: GENETYPES.FLOAT,
        bounds: [5, 50],
        mutates: {
            magnitude: 0.5,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    position: {
        type: GENETYPES.FLOAT,
        bounds: [-0.1, 1.1],
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    growthRate: {
        type: GENETYPES.FLOAT,
        bounds: [0, 1],
        getNewBeingValue: function getNewBeingValue() {
            return 1;
        },
        mutates: {
            magnitude: 0.05,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.025, rate: 1 }
            }
        }
    },
    restitution: {
        type: GENETYPES.FLOAT,
        bounds: [0, 1],
        mutates: {
            magnitude: 0.05,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    midstreamBirthrate: {
        bounds: [0, 1],
        mutates: {
            magnitude: 0.25,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    maxAge: {
        type: GENETYPES.FLOAT,
        bounds: [10, 100000],
        getNewBeingValue: function getNewBeingValue(_ref2) {
            var random = _ref2.random;
            return valueBetween(500, 2500, random);
        },
        mutates: {
            magnitude: 1000,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    eatPegRate: {
        bounds: [0, 1],
        getNewBeingValue: function getNewBeingValue() {
            return 0.5;
        },
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    becomePegRate: {
        bounds: [0, 1],
        getNewBeingValue: function getNewBeingValue() {
            return 0.5;
        },
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    carnivorismRate: {
        bounds: [0, 1],
        getNewBeingValue: function getNewBeingValue() {
            return 1;
        },
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    cannibalismRate: {
        bounds: [0, 1],
        getNewBeingValue: function getNewBeingValue() {
            return 0;
        },
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    splitRate: {
        type: GENETYPES.FLOAT,
        bounds: [0, 1],
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: function getNewBeingValue() {
                    return 1;
                },
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    hue: {
        type: GENETYPES.FLOAT,
        bounds: [0, 255],
        mutates: {
            magnitude: 5,
            rate: 1,
            dontLog: true
        }
    },
    generation: {
        getNewBeingValue: function getNewBeingValue() {
            return 0;
        },
        getChildValue: function getChildValue(_ref3) {
            var parentVal = _ref3.parentVal;
            return parentVal + 1;
        }
    },
    ancestry: {
        getNewBeingValue: function getNewBeingValue(_ref4) {
            var random = _ref4.random;
            return uuid({ length: 4, rng: random });
        }
    }
};

var dynamicGenomeDefinition = mapValues_1$1(genomeDefinition, function (geneDefinition) {
    if (geneDefinition.bounds) {
        var _geneDefinition$bound = slicedToArray(geneDefinition.bounds, 2),
            min = _geneDefinition$bound[0],
            max = _geneDefinition$bound[1];

        geneDefinition._boundsFn = bounds(min, max);
    }
    if (get_1(geneDefinition, 'mutates.rate.bounds')) {
        var _geneDefinition$mutat = slicedToArray(geneDefinition.mutates.rate.bounds, 2),
            _min = _geneDefinition$mutat[0],
            _max = _geneDefinition$mutat[1];

        geneDefinition.mutates.rate._boundsFn = bounds(_min, _max);
    }
    return geneDefinition;
});

function getGenomeColumnHeaders() {
    var genomeColumnHeaders = [];
    var mutationRateColumnHeaders = [];
    forEach_1$1(genomeDefinition, function (geneDefintion, key) {
        genomeColumnHeaders.push(key);
        if (geneDefintion.mutates && !get_1(geneDefintion, 'mutates.dontLog')) mutationRateColumnHeaders.push('mutationRate:' + key);
    });
    return genomeColumnHeaders.concat(mutationRateColumnHeaders);
}

function getGenomeColumns(genome) {
    var genomeColumns = [];
    var mutationRateColumns = [];
    forEach_1$1(genomeDefinition, function (geneDefintion, key) {
        genomeColumns.push(+(genome[key].toFixed ? genome[key].toFixed(4) : genome[key]));
        if (geneDefintion.mutates && !get_1(geneDefintion, 'mutates.dontLog')) +mutationRateColumns.push(genome.mutationRates[key].toFixed ? genome.mutationRates[key].toFixed(4) : genome.mutationRates[key]);
    });
    return genomeColumns.concat(mutationRateColumns);
}

var GeneMissingBoundsOrDefault = function (_ExtendableError) {
    inherits(GeneMissingBoundsOrDefault, _ExtendableError);

    function GeneMissingBoundsOrDefault() {
        classCallCheck(this, GeneMissingBoundsOrDefault);
        return possibleConstructorReturn(this, (GeneMissingBoundsOrDefault.__proto__ || Object.getPrototypeOf(GeneMissingBoundsOrDefault)).apply(this, arguments));
    }

    return GeneMissingBoundsOrDefault;
}(ExtendableError);

function getGeneDefault() {
    var geneDefintion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var random = arguments[1];
    var getNewBeingValue = geneDefintion.getNewBeingValue,
        bounds = geneDefintion.bounds;

    if (getNewBeingValue) {
        return getNewBeingValue({ definition: geneDefintion, random: random });
    } else if (bounds) {
        var _bounds = slicedToArray(bounds, 2),
            min = _bounds[0],
            max = _bounds[1];

        return valueBetween(min, max, random);
    } else {
        throw new GeneMissingBoundsOrDefault();
    }
}

function makeNewBeingGenome(random) {
    var genome = { mutationRates: {} };
    forEach_1$1(genomeDefinition, function (geneDefintion, key) {
        genome[key] = getGeneDefault(geneDefintion, random);
        if (geneDefintion.mutates) {
            var mutationRate = geneDefintion.mutates.rate;
            genome.mutationRates[key] = (typeof mutationRate === 'undefined' ? 'undefined' : _typeof(mutationRate)) === 'object' ? getGeneDefault(mutationRate, random) : mutationRate;
        }
    });
    return genome;
}

function makeChildGenome(_ref5, random) {
    var pGenome = _ref5.genome;

    // console.log('\n');
    // console.log('\n');
    // console.log(pGenome);
    // console.log('\n');

    var ancestry = pGenome.ancestry;

    var cGenome = { mutationRates: {} };
    forEach_1$1(dynamicGenomeDefinition, function (geneDefintion, key) {
        var pMutationRate = pGenome.mutationRates[key],
            pValue = pGenome[key];

        if (geneDefintion.mutates) {
            cGenome[key] = mutate(Object.assign(geneDefintion, { parentValue: pValue, rate: pMutationRate }), random);
            var mutationRateDefinitionOrStaticRate = geneDefintion.mutates.rate;
            if ((typeof mutationRateDefinitionOrStaticRate === 'undefined' ? 'undefined' : _typeof(mutationRateDefinitionOrStaticRate)) === 'object') {
                cGenome.mutationRates[key] = mutate(Object.assign(mutationRateDefinitionOrStaticRate, { parentValue: pMutationRate, rate: mutationRateDefinitionOrStaticRate.mutates.rate }), random);
            } else {
                cGenome.mutationRates[key] = mutationRateDefinitionOrStaticRate;
            }
        } else if (geneDefintion.getChildValue) {
            cGenome[key] = geneDefintion.getChildValue({ parentVal: pValue });
        } else {
            cGenome[key] = pValue;
        }
    });

    // console.log(cGenome);
    // console.log('\n');
    // console.log('\n');

    return cGenome;
}

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike_1(collection) ? Array(collection.length) : [];

  _baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

var _baseMap = baseMap;

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray_1(collection) ? _arrayMap : _baseMap;
  return func(collection, _baseIteratee(iteratee, 3));
}

var map_1$1 = map;

// import plinko from './plinko';
// const { consts: { plinkoWidth, plinkoHeight } } = plinko;
var plinkoWidth$1 = 750;
var dataDefinitions = {
    birthdate: {
        getInitialValue: function getInitialValue(_ref) {
            var parent = _ref.parent,
                now = _ref.now,
                beginTime = _ref.beginTime;
            return now;
        }
    },
    age: {
        getInitialValue: function getInitialValue() {
            return 0;
        },
        getValueToLog: function getValueToLog(_ref2, _ref3) {
            var birthdate = _ref2.data.birthdate;
            var now = _ref3.now;
            return now - birthdate;
        }
    },
    totalLifeEnergy: {
        getInitialValue: function getInitialValue() {
            return 0;
        }
    },
    energy: {
        getInitialValue: function getInitialValue() {
            return 0;
        }
    },
    deathPositionX: {
        getValueToLog: function getValueToLog(_ref4) {
            var x = _ref4.position.x;
            return x / plinkoWidth$1;
        }
    },
    deathPositionY: {
        getValueToLog: function getValueToLog(_ref5) {
            var y = _ref5.position.y;
            return y / plinkoWidth$1;
        }
    },
    midstreamChildren: {
        getInitialValue: function getInitialValue() {
            return 0;
        }
    },
    othersEaten: {
        getInitialValue: function getInitialValue() {
            return 0;
        }
    },
    ownEaten: {
        getInitialValue: function getInitialValue() {
            return 0;
        }
    },
    pegsEaten: {
        getInitialValue: function getInitialValue() {
            return 0;
        }
    },
    timesSplit: {
        getInitialValue: function getInitialValue() {
            return 0;
        }
    },
    birthType: {
        getInitialValue: function getInitialValue(_ref6) {
            var birthType = _ref6.birthType;
            return birthType;
        }
    },
    deathType: {
        getValueToLog: function getValueToLog(_ref7) {
            var deathType = _ref7.data.deathType;
            return deathType;
        }
    }
};

function getDataColumnHeaders() {
    return map_1$1(dataDefinitions, function (dataDefinition, key) {
        return key;
    });
}

function getNewBeingData(contextualData) {
    return mapValues_1$1(dataDefinitions, function (_ref8) {
        var getInitialValue = _ref8.getInitialValue;

        return getInitialValue ? getInitialValue(contextualData) : undefined;
    });
}

function calculateDataFields(ball, contextualData) {
    var ballData = Object.assign({}, ball.data);
    forEach_1$1(dataDefinitions, function (dataDefinition, key) {
        var getValueToLog = dataDefinition.getValueToLog;

        if (getValueToLog) ballData[key] = getValueToLog(ball, contextualData);
    });
    return ballData;
}

function getDataColumns(ballData) {
    return map_1$1(dataDefinitions, function (dataDefinition, key) {
        return +(ballData[key] && ballData[key].toFixed ? ballData[key].toFixed(4) : ballData[key]);
    });
}

var theBookOfPlinkoersHeaders = getGenomeColumnHeaders().concat(getDataColumnHeaders());

var ballToEntry = function ballToEntry(ball, now, beginTime) {
    var genomeColumns = getGenomeColumns(ball.genome);
    var dataColumns = getDataColumns(calculateDataFields(ball, { now: now, beginTime: beginTime }));
    return genomeColumns.concat(dataColumns);
};

var BookOfPlinkoers = function BookOfPlinkoers() {
    var theDead = [];

    var getTheBook = function getTheBook(engine, now, beginTime) {
        var headerString = theBookOfPlinkoersHeaders.join(',');
        var theDeadCsv = theDead.map(function (entry) {
            return entry.join(',');
        }).join('\n');
        var theCurrentlyLivingCsv = Composite.allBodies(engine.world).filter(function (body) {
            return body.genome !== undefined;
        }).map(function (ball) {
            return ballToEntry(ball, now, beginTime).join(',');
        }).join('\n');
        return headerString + '\n' + theDeadCsv + '\n' + theCurrentlyLivingCsv;
    };

    var addDead = function addDead(ball, now, beginTime) {
        theDead.push(ballToEntry(ball, now, beginTime));
    };

    return {
        addDead: addDead,
        getTheBook: getTheBook
    };
};

var disposeOfPrevious = {};
var saveToDisk = function saveToDisk(string) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$filetype = _ref.filetype,
        filetype = _ref$filetype === undefined ? 'csv' : _ref$filetype,
        filename = _ref.filename,
        passedInMimetype = _ref.passedInMimetype;

    disposeOfPrevious[filename] && disposeOfPrevious[filename]();
    var mimetype = passedInMimetype || 'text/' + filetype;
    var blob = new Blob([string], { type: mimetype }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
    a.download = filename + '.' + filetype;
    var url = window.URL.createObjectURL(blob);
    blob = null;
    a.href = url;
    disposeOfPrevious[filename] = function () {
        return window.URL.revokeObjectURL(url);
    };
    a.dataset.downloadurl = [mimetype, a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
};

var startPeriodicCsvBackup = function startPeriodicCsvBackup(filename, stringGeneratorFunction) {
    var maxBackupRate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;

    var minutesTillNextBackup = 4;
    var csvTimer = void 0;
    function periodicBackup() {
        saveToDisk(stringGeneratorFunction(), { filename: filename });
        minutesTillNextBackup = Math.min(minutesTillNextBackup * 2, maxBackupRate);
        csvTimer = setTimeout(periodicBackup, minutesTillNextBackup * 60 * 1000);
    }
    csvTimer = setTimeout(periodicBackup, minutesTillNextBackup * 60 * 1000);
};

var TrailingData = function () {
    var lengths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var trailingData = {};
    var startKey = function startKey(key, length) {
        trailingData[key] = { points: [], cursor: 0, length: length, _cachedAnswers: undefined };
    };
    var addPoint = function addPoint(key, newNumber) {
        if (!trailingData[key]) {
            throw new Error('No trailing data with that key started.');
        }
        var _trailingData$key = trailingData[key],
            cursor = _trailingData$key.cursor,
            length = _trailingData$key.length;

        trailingData[key].points[cursor] = newNumber;
        trailingData[key].cursor = cursor <= length ? cursor + 1 : 0;
        trailingData[key]._cachedAnswers = undefined;
    };
    var getAverageMinMax = function getAverageMinMax(key) {
        if (!trailingData[key]) {
            throw new Error('No trailing data with that key started.');
        }
        if (trailingData[key]._cachedAnswers !== undefined) {
            return trailingData[key]._cachedAnswers;
        }
        var points = trailingData[key].points;

        var aggregates = points.reduce(function (acc, num) {
            return {
                sum: acc.sum + num,
                min: Math.min(acc.min, num),
                max: Math.max(acc.max, num)
            };
        }, { sum: 0, min: Infinity, max: -Infinity });
        var average = aggregates.sum / (points.length || 1);
        var min = aggregates.min;
        var max = aggregates.max;
        var answers = { average: average, min: min, max: max };
        trailingData[key]._cachedAnswers = answers;
        return answers;
    };
    Object.keys(lengths).forEach(function (key) {
        return startKey(key, lengths[key]);
    });
    return {
        startKey: startKey,
        addPoint: addPoint,
        getAverageMinMax: getAverageMinMax
    };
};

var alea = createCommonjsModule(function (module, exports) {
(function (root, factory) {
  {
      module.exports = factory();
  }
}(commonjsGlobal, function () {

  'use strict';

  // From http://baagoe.com/en/RandomMusings/javascript/

  // importState to sync generator states
  Alea.importState = function(i){
    var random = new Alea();
    random.importState(i);
    return random;
  };

  return Alea;

  function Alea() {
    return (function(args) {
      // Johannes Baagøe <baagoe@baagoe.com>, 2010
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;

      if (args.length == 0) {
        args = [+new Date];
      }
      var mash = Mash();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');

      for (var i = 0; i < args.length; i++) {
        s0 -= mash(args[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(args[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(args[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;

      var random = function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
      random.uint32 = function() {
        return random() * 0x100000000; // 2^32
      };
      random.fract53 = function() {
        return random() + 
          (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      random.version = 'Alea 0.9';
      random.args = args;

      // my own additions to sync state between two generators
      random.exportState = function(){
        return [s0, s1, s2, c];
      };
      random.importState = function(i){
        s0 = +i[0] || 0;
        s1 = +i[1] || 0;
        s2 = +i[2] || 0;
        c = +i[3] || 0;
      };
 
      return random;

    } (Array.prototype.slice.call(arguments)));
  }

  function Mash() {
    var n = 0xefc8249d;

    var mash = function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  }
}));
});

var pegSize = 14;
var defaultBallRadius = 6;

var plinkoWidth$2 = 750; //*1.5;
var plinkoHeight$2 = 1800;
var countX = 20; //*1.5;
var countY = 2; //24;
var oldAge$1 = 75000;

var random = void 0;

var TYPES_OF_BIRTH_AND_DEATH = {
    BIRTH: {
        NEW: 0,
        LOOPED_AROUND: 1,
        LOOP_AROUND_SPLIT: 2,
        MIDSTREAM_SPAWN: 3,
        REBIRTH_FROM_THE_ANCIENTS: 4,
        RESOURCE_CHILD: 5,
        DYING_BREATH_BABY: 6,
        SPLIT: 13
    },
    DEATH: {
        DIEOFF: 7,
        FELL_OFF_BOTTOM: 8,
        EATEN_BY_OTHER_SPECIES: 9,
        EATEN_BY_OWN_SPECIES: 10,
        OLD_AGE: 11,
        BECAME_PEG: 12
    }
};

// add plinko sensors
// create genome:
//  {
//      drop: {
//          position: [calcers],
//  calcers = [
//      uniform(start, end),
//      normal(mean, variance),
//      exact(x),
//      roundTo(notch)
//  ]

var engine$1 = void 0;
var beginTime$1 = void 0;
var trailingData = void 0;
// let theBest;

var getTime$1 = function getTime(passedInEngine) {
    return (passedInEngine || engine$1).timing.timestamp;
};

var getAverageMinMax$1 = function getAverageMinMax() {
    return trailingData.getAverageMinMax('age');
};

var ballAgeSurvivalFactor$1 = function ballAgeSurvivalFactor(ballAge) {
    var randomFactorRange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

    var _getAverageMinMax = getAverageMinMax$1(),
        average = _getAverageMinMax.average,
        min = _getAverageMinMax.min,
        max = _getAverageMinMax.max;

    var ageStepFactor = Math.min(average, 200);
    var ageFactor = (ballAge - average) / ageStepFactor;
    var randomFactor = randomFactorRange / 2 + random() * randomFactorRange;
    return randomFactor + (ageFactor - 1);
};

var DIEOFF_POINT = 1800;
var numOfBallsLastCycle = 0;
var stepLogic$1 = function stepLogic(_ref) {
    var beforeKillBall = _ref.beforeKillBall,
        afterCycle = _ref.afterCycle,
        drawBall = _ref.drawBall,
        drawCorpse = _ref.drawCorpse,
        drawPeg = _ref.drawPeg,
        drawWall = _ref.drawWall;

    var bodies = Composite.allBodies(engine$1.world);

    var now = getTime$1();
    var baselineCount = 175;
    var numOfBalls = 0;

    bodies.forEach(function (n, i) {
        var visible = n.render.visible,
            circleRadius = n.circleRadius,
            _n$position = n.position,
            x = _n$position.x,
            y = _n$position.y,
            _n$genome = n.genome;
        _n$genome = _n$genome === undefined ? {} : _n$genome;
        var ballRadius = _n$genome.ballRadius,
            growthRate = _n$genome.growthRate,
            _n$data = n.data;
        _n$data = _n$data === undefined ? {} : _n$data;
        var energy = _n$data.energy,
            label = n.label;

        if (!visible) return;
        if (label === 'ball') {
            numOfBalls++;
            var ballAge = now - n.data.birthdate;
            if (ballAge > n.genome.maxAge) {
                if (energy > circleRadius && random() < 0.875) {
                    n.data.energy -= circleRadius;
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.DYING_BREATH_BABY);
                    numOfBalls++;
                }
                killBall({ ball: n, beforeKillBall: beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.OLD_AGE);
                numOfBalls--;
                return;
            }
            var getBallAgeSurvivalFactor = function getBallAgeSurvivalFactor(randomFactorRange) {
                return ballAgeSurvivalFactor$1(ballAge, randomFactorRange);
            };
            if (numOfBallsLastCycle > DIEOFF_POINT && getBallAgeSurvivalFactor() < 0.50) {
                killBall({ ball: n, beforeKillBall: beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.DIEOFF);
                numOfBalls--;
                return;
            }

            if (y > plinkoHeight$2 * 1.3) {
                killBall({ ball: n, beforeKillBall: beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.FELL_OFF_BOTTOM);
                numOfBalls--;
                if (energy > circleRadius && random() < 0.875 /*&& getBallAgeSurvivalFactor() > 0.50*/) {
                        n.data.energy -= circleRadius;
                        spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.LOOPED_AROUND);
                        numOfBalls++;
                    }
            } else if (random() < 0.05 && getBallAgeSurvivalFactor() > 0.55) {
                var _i = n.genome.midstreamBirthrate;
                while (_i >= 1 && energy > circleRadius) {
                    n.data.energy -= circleRadius;
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.MIDSTREAM_SPAWN);
                    numOfBalls++;
                    n.data.midstreamChildren++;
                    _i--;
                }
                if (random() < _i && energy > circleRadius) {
                    n.data.energy -= circleRadius;
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.MIDSTREAM_SPAWN);
                    numOfBalls++;
                    n.data.midstreamChildren++;
                }
            } else if (circleRadius < ballRadius && growthRate < energy && random() < 0.5) {

                n.data.energy -= growthRate;
            }
            drawBall && drawBall({ ball: n });
        } else if (label === 'peg') {
            drawPeg && drawPeg({ peg: n });
        } else if (label === 'wall') {
            drawWall && drawWall({ wall: n });
        } else if (label === 'corpse') {
            if (y > plinkoHeight$2 * 1.3) {
                removeBody(n);
                return;
            }
            drawCorpse && drawCorpse({ corpse: n });
        }
    });

    var ballsNeeded = Math.max(baselineCount - numOfBalls, 0);
    for (; ballsNeeded > 0; ballsNeeded--) {
        if (random() < 0.005 * 0.7) {
            spawnBall(undefined, TYPES_OF_BIRTH_AND_DEATH.BIRTH.REBIRTH_FROM_THE_ANCIENTS);
            numOfBalls++;
        }
    }

    numOfBallsLastCycle = numOfBalls;

    afterCycle && afterCycle({ numOfBalls: numOfBalls });
};

var getMurderAbility = function getMurderAbility(random, _ref2) {
    var eater = _ref2.eater,
        attacked = _ref2.attacked;

    // const typeFloat = eater.genome[typeField];
    return eater.speed < attacked.speed;
};

var cannibalismCheck = function cannibalismCheck(random, _ref3) {
    var bodyA = _ref3.bodyA,
        bodyB = _ref3.bodyB;

    return {
        aWantsToEat: random() < bodyA.genome.cannibalismRate && getMurderAbility(random, { eater: bodyA, attacked: bodyB }),
        bWantsToEat: random() < bodyB.genome.cannibalismRate && getMurderAbility(random, { eater: bodyB, attacked: bodyA })
    };
};

var carnivorismCheck = function carnivorismCheck(random, _ref4) {
    var bodyA = _ref4.bodyA,
        bodyB = _ref4.bodyB;

    return {
        aWantsToEat: random() < bodyA.genome.carnivorismRate && getMurderAbility(random, { eater: bodyA, attacked: bodyB }),
        bWantsToEat: random() < bodyB.genome.carnivorismRate && getMurderAbility(random, { eater: bodyB, attacked: bodyA })
    };
};

var setup$1 = function setup() {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        sessionId = _ref5.sessionId,
        beforeKillBall = _ref5.beforeKillBall;

    random = new alea(sessionId);
    // engine = Engine.create({ enableSleeping: true });
    engine$1 = Engine.create();
    beginTime$1 = getTime$1();
    trailingData = TrailingData({ age: 3000 });
    // theBest = SortedBuffer(100);

    var pegEaterEnergy = 1750;

    Events.on(engine$1, "collisionStart", function (_ref6) {
        var pairs = _ref6.pairs,
            now = _ref6.source.timing.timestamp,
            name = _ref6.name;

        pairs.forEach(function (_ref7) {
            var bodyA = _ref7.bodyA,
                bodyB = _ref7.bodyB;
            var aLabel = bodyA.label;
            var bLabel = bodyB.label;

            if (aLabel === 'ball' && bLabel === 'ball') {
                if (now - bodyA.data.birthdate > 300 && now - bodyB.data.birthdate > 300) {
                    var areSameSpecies = bodyA.genome.ancestry === bodyB.genome.ancestry;
                    var deathType = TYPES_OF_BIRTH_AND_DEATH.DEATH[areSameSpecies ? 'EATEN_BY_OWN_SPECIES' : 'EATEN_BY_OTHER_SPECIES'];
                    var checkFunction = areSameSpecies ? cannibalismCheck : carnivorismCheck;

                    var _checkFunction = checkFunction(random, { bodyA: bodyA, bodyB: bodyB }),
                        aWantsToEat = _checkFunction.aWantsToEat,
                        bWantsToEat = _checkFunction.bWantsToEat;

                    var aEats = aWantsToEat && bWantsToEat && random() < 0.5 || aWantsToEat && !bWantsToEat;

                    var _ref8 = aEats ? [bodyA, bodyB] : [bodyB, bodyA],
                        _ref9 = slicedToArray(_ref8, 2),
                        eater = _ref9[0],
                        eaten = _ref9[1];

                    var consumedRadius = eaten.circleRadius,
                        consumedEnergy = eaten.data.energy;

                    killBall({ ball: eaten, beforeKillBall: beforeKillBall }, deathType);
                    areSameSpecies ? eater.data.ownEaten++ : eater.data.othersEaten++;
                    eater.data.energy += consumedRadius + consumedEnergy;
                    eater.data.totalLifeEnergy += consumedRadius + consumedEnergy;
                    var circleRadius = eater.circleRadius,
                        _eater$position = eater.position,
                        x = _eater$position.x,
                        y = _eater$position.y,
                        _eater$genome = eater.genome,
                        splitRate = _eater$genome.splitRate,
                        becomePegRate = _eater$genome.becomePegRate;

                    if (eater.data.energy > pegEaterEnergy && y > 0.2 && random() < becomePegRate) {
                        killBall({ ball: eater, beforeKillBall: beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.BECAME_PEG);
                    } else if (eater.data.energy > circleRadius && y > 0.2 && random() < splitRate) {
                        spawnBall(eater, TYPES_OF_BIRTH_AND_DEATH.BIRTH.SPLIT, { xOveride: x, yOveride: y - circleRadius });
                        eater.data.energy -= circleRadius;
                        eater.data.timesSplit++;
                    }
                }
            } else if (aLabel === 'corpse' && bLabel === 'ball' || bLabel === 'corpse' && aLabel === 'ball') {
                var _ref10 = aLabel === 'ball' ? [bodyA, bodyB] : [bodyB, bodyA],
                    _ref11 = slicedToArray(_ref10, 2),
                    theBall = _ref11[0],
                    theCorpse = _ref11[1];

                var _consumedRadius = theCorpse.circleRadius,
                    _consumedEnergy = theCorpse.data.energy;

                theBall.data.energy += _consumedRadius + _consumedEnergy;
                theBall.data.totalLifeEnergy += _consumedRadius + _consumedEnergy;
                removeBody(theCorpse);
            } else if (aLabel === 'peg' && bLabel === 'ball' || bLabel === 'peg' && aLabel === 'ball') {
                var _ref12 = aLabel === 'ball' ? [bodyA, bodyB] : [bodyB, bodyA],
                    _ref13 = slicedToArray(_ref12, 2),
                    _theBall = _ref13[0],
                    thePeg = _ref13[1];

                if (_theBall.data.energy > pegEaterEnergy && random() < _theBall.genome.eatPegRate) {
                    removeBody(thePeg);
                    _theBall.data.energy -= pegEaterEnergy;
                    _theBall.data.pegsEaten++;
                }
            }
        });
    });

    // let offsetX = 0.5 / countX * plinkoWidth;
    // let offsetY = 0.5 / countY * plinkoHeight + 50;

    // for(let y = 0; y < countY; y++) {
    //     for(let x = 0; x < countX - y % 2 ? -1 : 0; x++) {
    //         numOfPegs++;
    //         addCircle({
    //             x: x / countX * plinkoWidth + offsetX * (!(y % 2) ? 1 : 2),
    //             y: y / countY * plinkoHeight * (2 / 3) + offsetY,
    //             r: pegSize,
    //             options: {
    //                 isStatic: true,
    //                 label: 'peg'
    //             }
    //         });
    //     }
    // }
    var boxWidth = plinkoWidth$2 * 3;
    var boxBottom = plinkoHeight$2 - 450;
    var boxHeight = 500;
    var wallThickness = 75;
    var centerX = plinkoWidth$2 / 2;
    var leftX = centerX - boxWidth / 2;
    var rightX = centerX + boxWidth / 2;
    addRectangle({
        x: centerX, y: boxBottom, w: boxWidth, h: wallThickness,
        options: { isStatic: true, label: 'wall' }
    });
    addRectangle({
        x: leftX, y: boxBottom - boxHeight / 2, w: wallThickness, h: boxHeight,
        options: { isStatic: true, label: 'wall' }
    });
    addRectangle({
        x: rightX, y: boxBottom - boxHeight / 2, w: wallThickness, h: boxHeight,
        options: { isStatic: true, label: 'wall' }
    });

    return {
        engine: engine$1,
        beginTime: beginTime$1
    };
};

// function addBody(...bodies) {
//     World.add(engine.world, ...bodies);
// }

// function removeBody(...bodies) {
//     World.remove(engine.world, ...bodies);
// }

// let dormantBodies = [];

function addBody(body) {
    World.add(engine$1.world, body);
}

function removeBody(body) {
    // dormantBodies.push(body);
    World.remove(engine$1.world, body);
}

function addCircle() {
    var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref14$x = _ref14.x,
        x = _ref14$x === undefined ? 0 : _ref14$x,
        _ref14$y = _ref14.y,
        y = _ref14$y === undefined ? 0 : _ref14$y,
        _ref14$r = _ref14.r,
        r = _ref14$r === undefined ? 10 : _ref14$r,
        _ref14$options = _ref14.options,
        options = _ref14$options === undefined ? {} : _ref14$options;

    var body = void 0;
    // if (dormantBodies.length > 0) {
    //     let dormantBody = dormantBodies.pop();
    //     Body.set(dormantBody, Common.extend(dormantBody, options, {
    //         id: Common.nextId(),
    //         position: { x, y },
    //         angle: 0,
    //         isSleeping: false,
    //         speed: 0,
    //         render: { visible: true }
    //     }));
    //     const scaleFactor = r/dormantBody.circleRadius;
    //     Body.scale(dormantBody, scaleFactor, scaleFactor);
    // } else {
    body = Bodies.circle(x, y, r, options);
    // }
    addBody(body);
    return body;
}

function addRectangle() {
    var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref15$x = _ref15.x,
        x = _ref15$x === undefined ? 0 : _ref15$x,
        _ref15$y = _ref15.y,
        y = _ref15$y === undefined ? 0 : _ref15$y,
        _ref15$w = _ref15.w,
        w = _ref15$w === undefined ? 10 : _ref15$w,
        _ref15$h = _ref15.h,
        h = _ref15$h === undefined ? 10 : _ref15$h,
        _ref15$options = _ref15.options,
        options = _ref15$options === undefined ? {} : _ref15$options;

    // TODO: Use the dormant bodies too
    var body = Bodies.rectangle(x, y, w, h, options);
    addBody(body);
    return body;
}

function convertToCorpse(ball) {
    var energy = ball.data.energy;
    // TODO: Write this for perfomrance

    ball.label = 'corpse';
    ball.restitution = 0.95;
    ball.render.fillStyle = undefined;
    ball.genome = undefined;
    ball.data = { energy: energy };
}

function convertToPeg(ball) {
    var circleRadius = ball.circleRadius;

    ball.label = 'peg';
    ball.render.fillStyle = undefined;
    ball.genome = undefined;
    ball.data = undefined;
    var scaleFactor = pegSize / circleRadius;
    Body.scale(ball, scaleFactor, scaleFactor);
    Body.setStatic(ball, true);
}

function killBall(_ref16, deathType) {
    var ball = _ref16.ball,
        beforeKillBall = _ref16.beforeKillBall;

    if (beforeKillBall) {
        ball.data.deathType = deathType;
        beforeKillBall && beforeKillBall(ball);
    }
    var ballAge = getTime$1(engine$1) - ball.data.birthdate;
    // theBest.potentiallyInsert(ball, ballAge);
    trailingData.addPoint('age', ballAge);
    switch (deathType) {
        case TYPES_OF_BIRTH_AND_DEATH.DEATH.FELL_OFF_BOTTOM:
        case TYPES_OF_BIRTH_AND_DEATH.DEATH.EATEN_BY_OTHER_SPECIES:
        case TYPES_OF_BIRTH_AND_DEATH.DEATH.EATEN_BY_OWN_SPECIES:
            removeBody(ball);
            break;
        case TYPES_OF_BIRTH_AND_DEATH.DEATH.BECAME_PEG:
            convertToPeg(ball);
            break;
        default:
            convertToCorpse(ball);
    }
}

function spawnBall(parent, birthType) {
    var _ref17 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        xOveride = _ref17.xOveride,
        yOveride = _ref17.yOveride;

    var genome = parent ? makeChildGenome(parent, random) : makeNewBeingGenome(random);
    var ballRadius = genome.ballRadius,
        hue = genome.hue,
        position = genome.position,
        restitution = genome.restitution;

    addCircle({
        x: xOveride || plinkoWidth$2 * position,
        y: yOveride || -10,
        r: ballRadius,
        options: {
            label: 'ball',
            render: { fillStyle: [hue, 255, 255] },
            restitution: restitution,
            genome: genome,
            data: getNewBeingData({
                parent: parent,
                now: getTime$1(),
                beginTime: beginTime$1,
                birthType: birthType
            })
        }
    });
}

var plinko = {
    setup: setup$1,
    stepLogic: stepLogic$1,
    utils: {
        getTime: getTime$1,
        ballAgeSurvivalFactor: ballAgeSurvivalFactor$1,
        getAverageMinMax: getAverageMinMax$1
    },
    consts: {
        pegSize: pegSize,
        defaultBallRadius: defaultBallRadius,
        plinkoWidth: plinkoWidth$2,
        plinkoHeight: plinkoHeight$2,
        countX: countX,
        countY: countY,
        oldAge: oldAge$1
    }
};

var setup = plinko.setup;
var stepLogic = plinko.stepLogic;
var _plinko$utils = plinko.utils;
var getTime = _plinko$utils.getTime;
var _plinko$consts = plinko.consts;
var plinkoWidth = _plinko$consts.plinkoWidth;


var engine = void 0;
var beginTime = void 0;

var _getUrlArguments = getUrlArguments();
var seed = _getUrlArguments.seed;

var sessionId = seed || uuid({ length: 16 });
console.log(sessionId);

var bookOfPlinkoers = BookOfPlinkoers();

startPeriodicCsvBackup(sessionId + '-BoP', function () {
    return bookOfPlinkoers.getTheBook(engine, getTime(engine), beginTime);
});

window.doASave = function () {
    saveToDisk(bookOfPlinkoers.getTheBook(engine, getTime(engine), beginTime), { filename: sessionId + '-BoP' });
};

console.log('loaded');

var stepLogicHandlers = {
    beforeKillBall: function beforeKillBall(ball) {
        bookOfPlinkoers.addDead(ball, getTime(engine), beginTime);
    },
    drawBall: function drawBall(_ref) {
        var ball = _ref.ball;
        var debug = ball.debug,
            fillStyle = ball.render.fillStyle,
            _ball$position = ball.position,
            x = _ball$position.x,
            y = _ball$position.y,
            circleRadius = ball.circleRadius;

        // const ballAge = (getTime(engine) - ball.data.birthdate);
        // const { average } = getAverageMinMax();
        // const dullness = ((ballAge > average) ? 0.4 : 1) * 255;
        // fill([ fillStyle[0], dullness, dullness ]);

        fill([debug ? 0 : fillStyle[0], 255, 255]);
        ellipse(x, y, circleRadius * 2);
    },
    drawPeg: function drawPeg(_ref2) {
        var peg = _ref2.peg;
        var debug = peg.debug,
            _peg$position = peg.position,
            x = _peg$position.x,
            y = _peg$position.y,
            circleRadius = peg.circleRadius;

        fill(debug ? 0 : 150);
        ellipse(x, y, circleRadius * 2);
    },
    drawWall: function drawWall(_ref3) {
        var wall = _ref3.wall;
        var debug = wall.debug,
            _wall$position = wall.position,
            x = _wall$position.x,
            y = _wall$position.y,
            vertices = wall.vertices;

        var xysArray = vertices.map(function (_ref4) {
            var x = _ref4.x,
                y = _ref4.y;
            return [x, y];
        }).reduce(function (acc, arr) {
            return acc.concat(arr);
        }, []);
        fill(debug ? 150 : 0);
        quad.apply(undefined, toConsumableArray(xysArray));
    },
    drawCorpse: function drawCorpse(_ref5) {
        var corpse = _ref5.corpse;
        var debug = corpse.debug,
            fillStyle = corpse.render.fillStyle,
            _corpse$position = corpse.position,
            x = _corpse$position.x,
            y = _corpse$position.y,
            circleRadius = corpse.circleRadius;

        fill(debug ? 0 : 230);
        ellipse(x, y, circleRadius * 2);
    }
};

window.setup = function () {
    var _setup = setup({ sessionId: sessionId, beforeKillBall: stepLogicHandlers.beforeKillBall });

    engine = _setup.engine;
    beginTime = _setup.beginTime;

    Engine.run(engine);

    colorMode(HSB, 255);
    createCanvas(window.windowWidth, window.windowHeight);
};

var count = 0;
window.draw = function () {
    background(255);
    strokeWeight(0);

    translate(width / 2 - plinkoWidth / 2, 100);

    stepLogic(stepLogicHandlers);
    if (count > 1000) {
        console.log(engine.pairs.list.length);
        count = 0;
    } else {
        count++;
    }
};

window.windowResized = function () {
    window.resizeCanvas(window.windowWidth, window.windowHeight);
};

}());
//# sourceMappingURL=browser-plinko.js.map
