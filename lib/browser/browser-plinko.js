document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35732/livereload.js?snipver=1"></' + 'script>');
(function (matterJs_build_matter_js,forEach,mapValues,get,map,Alea) {
'use strict';

forEach = 'default' in forEach ? forEach['default'] : forEach;
mapValues = 'default' in mapValues ? mapValues['default'] : mapValues;
get = 'default' in get ? get['default'] : get;
map = 'default' in map ? map['default'] : map;
Alea = 'default' in Alea ? Alea['default'] : Alea;

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

var dynamicGenomeDefinition = mapValues(genomeDefinition, function (geneDefinition) {
    if (geneDefinition.bounds) {
        var _geneDefinition$bound = slicedToArray(geneDefinition.bounds, 2),
            min = _geneDefinition$bound[0],
            max = _geneDefinition$bound[1];

        geneDefinition._boundsFn = bounds(min, max);
    }
    if (get(geneDefinition, 'mutates.rate.bounds')) {
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
    forEach(genomeDefinition, function (geneDefintion, key) {
        genomeColumnHeaders.push(key);
        if (geneDefintion.mutates && !get(geneDefintion, 'mutates.dontLog')) mutationRateColumnHeaders.push('mutationRate:' + key);
    });
    return genomeColumnHeaders.concat(mutationRateColumnHeaders);
}

function getGenomeColumns(genome) {
    var genomeColumns = [];
    var mutationRateColumns = [];
    forEach(genomeDefinition, function (geneDefintion, key) {
        genomeColumns.push(+(genome[key].toFixed ? genome[key].toFixed(4) : genome[key]));
        if (geneDefintion.mutates && !get(geneDefintion, 'mutates.dontLog')) +mutationRateColumns.push(genome.mutationRates[key].toFixed ? genome.mutationRates[key].toFixed(4) : genome.mutationRates[key]);
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
    forEach(genomeDefinition, function (geneDefintion, key) {
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
    forEach(dynamicGenomeDefinition, function (geneDefintion, key) {
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
    return map(dataDefinitions, function (dataDefinition, key) {
        return key;
    });
}

function getNewBeingData(contextualData) {
    return mapValues(dataDefinitions, function (_ref8) {
        var getInitialValue = _ref8.getInitialValue;

        return getInitialValue ? getInitialValue(contextualData) : undefined;
    });
}

function calculateDataFields(ball, contextualData) {
    var ballData = Object.assign({}, ball.data);
    forEach(dataDefinitions, function (dataDefinition, key) {
        var getValueToLog = dataDefinition.getValueToLog;

        if (getValueToLog) ballData[key] = getValueToLog(ball, contextualData);
    });
    return ballData;
}

function getDataColumns(ballData) {
    return map(dataDefinitions, function (dataDefinition, key) {
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
        var theCurrentlyLivingCsv = matterJs_build_matter_js.Composite.allBodies(engine.world).filter(function (body) {
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

    var bodies = matterJs_build_matter_js.Composite.allBodies(engine$1.world);

    var now = getTime$1();
    var baselineCount = 175;
    var numOfBalls = 0;

    bodies.forEach(function (n, i) {
        var visible = n.render.visible,
            circleRadius = n.circleRadius,
            _n$position = n.position,
            x = _n$position.x,
            y = _n$position.y,
            _n$genome = n.genome,
            ballRadius = _n$genome.ballRadius,
            growthRate = _n$genome.growthRate,
            energy = n.data.energy,
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

    random = new Alea(sessionId);
    // engine = Engine.create({ enableSleeping: true });
    engine$1 = matterJs_build_matter_js.Engine.create();
    beginTime$1 = getTime$1();
    trailingData = TrailingData({ age: 3000 });
    // theBest = SortedBuffer(100);

    var pegEaterEnergy = 1750;

    matterJs_build_matter_js.Events.on(engine$1, "collisionStart", function (_ref6) {
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
    matterJs_build_matter_js.World.add(engine$1.world, body);
}

function removeBody(body) {
    // dormantBodies.push(body);
    matterJs_build_matter_js.World.remove(engine$1.world, body);
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
    body = matterJs_build_matter_js.Bodies.circle(x, y, r, options);
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
    var body = matterJs_build_matter_js.Bodies.rectangle(x, y, w, h, options);
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
    matterJs_build_matter_js.Body.scale(ball, scaleFactor, scaleFactor);
    matterJs_build_matter_js.Body.setStatic(ball, true);
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

    matterJs_build_matter_js.Engine.run(engine);

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

}(Matter,forEach,mapValues,get,map,Alea));
//# sourceMappingURL=browser-plinko.js.map
