/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/alpinejs/dist/module.esm.js":
/*!**************************************************!*\
  !*** ./node_modules/alpinejs/dist/module.esm.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alpine: () => (/* binding */ src_default),
/* harmony export */   "default": () => (/* binding */ module_default)
/* harmony export */ });
// packages/alpinejs/src/scheduler.js
var flushPending = false;
var flushing = false;
var queue = [];
var lastFlushedIndex = -1;
function scheduler(callback) {
  queueJob(callback);
}
function queueJob(job) {
  if (!queue.includes(job))
    queue.push(job);
  queueFlush();
}
function dequeueJob(job) {
  let index = queue.indexOf(job);
  if (index !== -1 && index > lastFlushedIndex)
    queue.splice(index, 1);
}
function queueFlush() {
  if (!flushing && !flushPending) {
    flushPending = true;
    queueMicrotask(flushJobs);
  }
}
function flushJobs() {
  flushPending = false;
  flushing = true;
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
    lastFlushedIndex = i;
  }
  queue.length = 0;
  lastFlushedIndex = -1;
  flushing = false;
}

// packages/alpinejs/src/reactivity.js
var reactive;
var effect;
var release;
var raw;
var shouldSchedule = true;
function disableEffectScheduling(callback) {
  shouldSchedule = false;
  callback();
  shouldSchedule = true;
}
function setReactivityEngine(engine) {
  reactive = engine.reactive;
  release = engine.release;
  effect = (callback) => engine.effect(callback, { scheduler: (task) => {
    if (shouldSchedule) {
      scheduler(task);
    } else {
      task();
    }
  } });
  raw = engine.raw;
}
function overrideEffect(override) {
  effect = override;
}
function elementBoundEffect(el) {
  let cleanup2 = () => {
  };
  let wrappedEffect = (callback) => {
    let effectReference = effect(callback);
    if (!el._x_effects) {
      el._x_effects = /* @__PURE__ */ new Set();
      el._x_runEffects = () => {
        el._x_effects.forEach((i) => i());
      };
    }
    el._x_effects.add(effectReference);
    cleanup2 = () => {
      if (effectReference === void 0)
        return;
      el._x_effects.delete(effectReference);
      release(effectReference);
    };
    return effectReference;
  };
  return [wrappedEffect, () => {
    cleanup2();
  }];
}
function watch(getter, callback) {
  let firstTime = true;
  let oldValue;
  let effectReference = effect(() => {
    let value = getter();
    JSON.stringify(value);
    if (!firstTime) {
      queueMicrotask(() => {
        callback(value, oldValue);
        oldValue = value;
      });
    } else {
      oldValue = value;
    }
    firstTime = false;
  });
  return () => release(effectReference);
}

// packages/alpinejs/src/mutation.js
var onAttributeAddeds = [];
var onElRemoveds = [];
var onElAddeds = [];
function onElAdded(callback) {
  onElAddeds.push(callback);
}
function onElRemoved(el, callback) {
  if (typeof callback === "function") {
    if (!el._x_cleanups)
      el._x_cleanups = [];
    el._x_cleanups.push(callback);
  } else {
    callback = el;
    onElRemoveds.push(callback);
  }
}
function onAttributesAdded(callback) {
  onAttributeAddeds.push(callback);
}
function onAttributeRemoved(el, name, callback) {
  if (!el._x_attributeCleanups)
    el._x_attributeCleanups = {};
  if (!el._x_attributeCleanups[name])
    el._x_attributeCleanups[name] = [];
  el._x_attributeCleanups[name].push(callback);
}
function cleanupAttributes(el, names) {
  if (!el._x_attributeCleanups)
    return;
  Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
    if (names === void 0 || names.includes(name)) {
      value.forEach((i) => i());
      delete el._x_attributeCleanups[name];
    }
  });
}
function cleanupElement(el) {
  el._x_effects?.forEach(dequeueJob);
  while (el._x_cleanups?.length)
    el._x_cleanups.pop()();
}
var observer = new MutationObserver(onMutate);
var currentlyObserving = false;
function startObservingMutations() {
  observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
  currentlyObserving = true;
}
function stopObservingMutations() {
  flushObserver();
  observer.disconnect();
  currentlyObserving = false;
}
var queuedMutations = [];
function flushObserver() {
  let records = observer.takeRecords();
  queuedMutations.push(() => records.length > 0 && onMutate(records));
  let queueLengthWhenTriggered = queuedMutations.length;
  queueMicrotask(() => {
    if (queuedMutations.length === queueLengthWhenTriggered) {
      while (queuedMutations.length > 0)
        queuedMutations.shift()();
    }
  });
}
function mutateDom(callback) {
  if (!currentlyObserving)
    return callback();
  stopObservingMutations();
  let result = callback();
  startObservingMutations();
  return result;
}
var isCollecting = false;
var deferredMutations = [];
function deferMutations() {
  isCollecting = true;
}
function flushAndStopDeferringMutations() {
  isCollecting = false;
  onMutate(deferredMutations);
  deferredMutations = [];
}
function onMutate(mutations) {
  if (isCollecting) {
    deferredMutations = deferredMutations.concat(mutations);
    return;
  }
  let addedNodes = [];
  let removedNodes = /* @__PURE__ */ new Set();
  let addedAttributes = /* @__PURE__ */ new Map();
  let removedAttributes = /* @__PURE__ */ new Map();
  for (let i = 0; i < mutations.length; i++) {
    if (mutations[i].target._x_ignoreMutationObserver)
      continue;
    if (mutations[i].type === "childList") {
      mutations[i].removedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (!node._x_marker)
          return;
        removedNodes.add(node);
      });
      mutations[i].addedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (removedNodes.has(node)) {
          removedNodes.delete(node);
          return;
        }
        if (node._x_marker)
          return;
        addedNodes.push(node);
      });
    }
    if (mutations[i].type === "attributes") {
      let el = mutations[i].target;
      let name = mutations[i].attributeName;
      let oldValue = mutations[i].oldValue;
      let add2 = () => {
        if (!addedAttributes.has(el))
          addedAttributes.set(el, []);
        addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
      };
      let remove = () => {
        if (!removedAttributes.has(el))
          removedAttributes.set(el, []);
        removedAttributes.get(el).push(name);
      };
      if (el.hasAttribute(name) && oldValue === null) {
        add2();
      } else if (el.hasAttribute(name)) {
        remove();
        add2();
      } else {
        remove();
      }
    }
  }
  removedAttributes.forEach((attrs, el) => {
    cleanupAttributes(el, attrs);
  });
  addedAttributes.forEach((attrs, el) => {
    onAttributeAddeds.forEach((i) => i(el, attrs));
  });
  for (let node of removedNodes) {
    if (addedNodes.some((i) => i.contains(node)))
      continue;
    onElRemoveds.forEach((i) => i(node));
  }
  for (let node of addedNodes) {
    if (!node.isConnected)
      continue;
    onElAddeds.forEach((i) => i(node));
  }
  addedNodes = null;
  removedNodes = null;
  addedAttributes = null;
  removedAttributes = null;
}

// packages/alpinejs/src/scope.js
function scope(node) {
  return mergeProxies(closestDataStack(node));
}
function addScopeToNode(node, data2, referenceNode) {
  node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
  return () => {
    node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
  };
}
function closestDataStack(node) {
  if (node._x_dataStack)
    return node._x_dataStack;
  if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
    return closestDataStack(node.host);
  }
  if (!node.parentNode) {
    return [];
  }
  return closestDataStack(node.parentNode);
}
function mergeProxies(objects) {
  return new Proxy({ objects }, mergeProxyTrap);
}
var mergeProxyTrap = {
  ownKeys({ objects }) {
    return Array.from(
      new Set(objects.flatMap((i) => Object.keys(i)))
    );
  },
  has({ objects }, name) {
    if (name == Symbol.unscopables)
      return false;
    return objects.some(
      (obj) => Object.prototype.hasOwnProperty.call(obj, name) || Reflect.has(obj, name)
    );
  },
  get({ objects }, name, thisProxy) {
    if (name == "toJSON")
      return collapseProxies;
    return Reflect.get(
      objects.find(
        (obj) => Reflect.has(obj, name)
      ) || {},
      name,
      thisProxy
    );
  },
  set({ objects }, name, value, thisProxy) {
    const target = objects.find(
      (obj) => Object.prototype.hasOwnProperty.call(obj, name)
    ) || objects[objects.length - 1];
    const descriptor = Object.getOwnPropertyDescriptor(target, name);
    if (descriptor?.set && descriptor?.get)
      return descriptor.set.call(thisProxy, value) || true;
    return Reflect.set(target, name, value);
  }
};
function collapseProxies() {
  let keys = Reflect.ownKeys(this);
  return keys.reduce((acc, key) => {
    acc[key] = Reflect.get(this, key);
    return acc;
  }, {});
}

// packages/alpinejs/src/interceptor.js
function initInterceptors(data2) {
  let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
  let recurse = (obj, basePath = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
      if (enumerable === false || value === void 0)
        return;
      if (typeof value === "object" && value !== null && value.__v_skip)
        return;
      let path = basePath === "" ? key : `${basePath}.${key}`;
      if (typeof value === "object" && value !== null && value._x_interceptor) {
        obj[key] = value.initialize(data2, path, key);
      } else {
        if (isObject2(value) && value !== obj && !(value instanceof Element)) {
          recurse(value, path);
        }
      }
    });
  };
  return recurse(data2);
}
function interceptor(callback, mutateObj = () => {
}) {
  let obj = {
    initialValue: void 0,
    _x_interceptor: true,
    initialize(data2, path, key) {
      return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
    }
  };
  mutateObj(obj);
  return (initialValue) => {
    if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
      let initialize = obj.initialize.bind(obj);
      obj.initialize = (data2, path, key) => {
        let innerValue = initialValue.initialize(data2, path, key);
        obj.initialValue = innerValue;
        return initialize(data2, path, key);
      };
    } else {
      obj.initialValue = initialValue;
    }
    return obj;
  };
}
function get(obj, path) {
  return path.split(".").reduce((carry, segment) => carry[segment], obj);
}
function set(obj, path, value) {
  if (typeof path === "string")
    path = path.split(".");
  if (path.length === 1)
    obj[path[0]] = value;
  else if (path.length === 0)
    throw error;
  else {
    if (obj[path[0]])
      return set(obj[path[0]], path.slice(1), value);
    else {
      obj[path[0]] = {};
      return set(obj[path[0]], path.slice(1), value);
    }
  }
}

// packages/alpinejs/src/magics.js
var magics = {};
function magic(name, callback) {
  magics[name] = callback;
}
function injectMagics(obj, el) {
  let memoizedUtilities = getUtilities(el);
  Object.entries(magics).forEach(([name, callback]) => {
    Object.defineProperty(obj, `$${name}`, {
      get() {
        return callback(el, memoizedUtilities);
      },
      enumerable: false
    });
  });
  return obj;
}
function getUtilities(el) {
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  let utils = { interceptor, ...utilities };
  onElRemoved(el, cleanup2);
  return utils;
}

// packages/alpinejs/src/utils/error.js
function tryCatch(el, expression, callback, ...args) {
  try {
    return callback(...args);
  } catch (e) {
    handleError(e, el, expression);
  }
}
function handleError(error2, el, expression = void 0) {
  error2 = Object.assign(
    error2 ?? { message: "No error message given." },
    { el, expression }
  );
  console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
  setTimeout(() => {
    throw error2;
  }, 0);
}

// packages/alpinejs/src/evaluator.js
var shouldAutoEvaluateFunctions = true;
function dontAutoEvaluateFunctions(callback) {
  let cache = shouldAutoEvaluateFunctions;
  shouldAutoEvaluateFunctions = false;
  let result = callback();
  shouldAutoEvaluateFunctions = cache;
  return result;
}
function evaluate(el, expression, extras = {}) {
  let result;
  evaluateLater(el, expression)((value) => result = value, extras);
  return result;
}
function evaluateLater(...args) {
  return theEvaluatorFunction(...args);
}
var theEvaluatorFunction = normalEvaluator;
function setEvaluator(newEvaluator) {
  theEvaluatorFunction = newEvaluator;
}
function normalEvaluator(el, expression) {
  let overriddenMagics = {};
  injectMagics(overriddenMagics, el);
  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  let evaluator = typeof expression === "function" ? generateEvaluatorFromFunction(dataStack, expression) : generateEvaluatorFromString(dataStack, expression, el);
  return tryCatch.bind(null, el, expression, evaluator);
}
function generateEvaluatorFromFunction(dataStack, func) {
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [] } = {}) => {
    let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
    runIfTypeOfFunction(receiver, result);
  };
}
var evaluatorMemo = {};
function generateFunctionFromString(expression, el) {
  if (evaluatorMemo[expression]) {
    return evaluatorMemo[expression];
  }
  let AsyncFunction = Object.getPrototypeOf(async function() {
  }).constructor;
  let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression;
  const safeAsyncFunction = () => {
    try {
      let func2 = new AsyncFunction(
        ["__self", "scope"],
        `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`
      );
      Object.defineProperty(func2, "name", {
        value: `[Alpine] ${expression}`
      });
      return func2;
    } catch (error2) {
      handleError(error2, el, expression);
      return Promise.resolve();
    }
  };
  let func = safeAsyncFunction();
  evaluatorMemo[expression] = func;
  return func;
}
function generateEvaluatorFromString(dataStack, expression, el) {
  let func = generateFunctionFromString(expression, el);
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [] } = {}) => {
    func.result = void 0;
    func.finished = false;
    let completeScope = mergeProxies([scope2, ...dataStack]);
    if (typeof func === "function") {
      let promise = func(func, completeScope).catch((error2) => handleError(error2, el, expression));
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
        func.result = void 0;
      } else {
        promise.then((result) => {
          runIfTypeOfFunction(receiver, result, completeScope, params, el);
        }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
      }
    }
  };
}
function runIfTypeOfFunction(receiver, value, scope2, params, el) {
  if (shouldAutoEvaluateFunctions && typeof value === "function") {
    let result = value.apply(scope2, params);
    if (result instanceof Promise) {
      result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
    } else {
      receiver(result);
    }
  } else if (typeof value === "object" && value instanceof Promise) {
    value.then((i) => receiver(i));
  } else {
    receiver(value);
  }
}

// packages/alpinejs/src/directives.js
var prefixAsString = "x-";
function prefix(subject = "") {
  return prefixAsString + subject;
}
function setPrefix(newPrefix) {
  prefixAsString = newPrefix;
}
var directiveHandlers = {};
function directive(name, callback) {
  directiveHandlers[name] = callback;
  return {
    before(directive2) {
      if (!directiveHandlers[directive2]) {
        console.warn(String.raw`Cannot find directive \`${directive2}\`. \`${name}\` will use the default order of execution`);
        return;
      }
      const pos = directiveOrder.indexOf(directive2);
      directiveOrder.splice(pos >= 0 ? pos : directiveOrder.indexOf("DEFAULT"), 0, name);
    }
  };
}
function directiveExists(name) {
  return Object.keys(directiveHandlers).includes(name);
}
function directives(el, attributes, originalAttributeOverride) {
  attributes = Array.from(attributes);
  if (el._x_virtualDirectives) {
    let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({ name, value }));
    let staticAttributes = attributesOnly(vAttributes);
    vAttributes = vAttributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    attributes = attributes.concat(vAttributes);
  }
  let transformedAttributeMap = {};
  let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
  return directives2.map((directive2) => {
    return getDirectiveHandler(el, directive2);
  });
}
function attributesOnly(attributes) {
  return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
}
var isDeferringHandlers = false;
var directiveHandlerStacks = /* @__PURE__ */ new Map();
var currentHandlerStackKey = Symbol();
function deferHandlingDirectives(callback) {
  isDeferringHandlers = true;
  let key = Symbol();
  currentHandlerStackKey = key;
  directiveHandlerStacks.set(key, []);
  let flushHandlers = () => {
    while (directiveHandlerStacks.get(key).length)
      directiveHandlerStacks.get(key).shift()();
    directiveHandlerStacks.delete(key);
  };
  let stopDeferring = () => {
    isDeferringHandlers = false;
    flushHandlers();
  };
  callback(flushHandlers);
  stopDeferring();
}
function getElementBoundUtilities(el) {
  let cleanups = [];
  let cleanup2 = (callback) => cleanups.push(callback);
  let [effect3, cleanupEffect] = elementBoundEffect(el);
  cleanups.push(cleanupEffect);
  let utilities = {
    Alpine: alpine_default,
    effect: effect3,
    cleanup: cleanup2,
    evaluateLater: evaluateLater.bind(evaluateLater, el),
    evaluate: evaluate.bind(evaluate, el)
  };
  let doCleanup = () => cleanups.forEach((i) => i());
  return [utilities, doCleanup];
}
function getDirectiveHandler(el, directive2) {
  let noop = () => {
  };
  let handler4 = directiveHandlers[directive2.type] || noop;
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  onAttributeRemoved(el, directive2.original, cleanup2);
  let fullHandler = () => {
    if (el._x_ignore || el._x_ignoreSelf)
      return;
    handler4.inline && handler4.inline(el, directive2, utilities);
    handler4 = handler4.bind(handler4, el, directive2, utilities);
    isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler4) : handler4();
  };
  fullHandler.runCleanups = cleanup2;
  return fullHandler;
}
var startingWith = (subject, replacement) => ({ name, value }) => {
  if (name.startsWith(subject))
    name = name.replace(subject, replacement);
  return { name, value };
};
var into = (i) => i;
function toTransformedAttributes(callback = () => {
}) {
  return ({ name, value }) => {
    let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
      return transform(carry);
    }, { name, value });
    if (newName !== name)
      callback(newName, name);
    return { name: newName, value: newValue };
  };
}
var attributeTransformers = [];
function mapAttributes(callback) {
  attributeTransformers.push(callback);
}
function outNonAlpineAttributes({ name }) {
  return alpineAttributeRegex().test(name);
}
var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
  return ({ name, value }) => {
    let typeMatch = name.match(alpineAttributeRegex());
    let valueMatch = name.match(/:([a-zA-Z0-9\-_:]+)/);
    let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    let original = originalAttributeOverride || transformedAttributeMap[name] || name;
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map((i) => i.replace(".", "")),
      expression: value,
      original
    };
  };
}
var DEFAULT = "DEFAULT";
var directiveOrder = [
  "ignore",
  "ref",
  "data",
  "id",
  "anchor",
  "bind",
  "init",
  "for",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  DEFAULT,
  "teleport"
];
function byPriority(a, b) {
  let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
  let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
  return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
}

// packages/alpinejs/src/utils/dispatch.js
function dispatch(el, name, detail = {}) {
  el.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      // Allows events to pass the shadow DOM barrier.
      composed: true,
      cancelable: true
    })
  );
}

// packages/alpinejs/src/utils/walk.js
function walk(el, callback) {
  if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
    Array.from(el.children).forEach((el2) => walk(el2, callback));
    return;
  }
  let skip = false;
  callback(el, () => skip = true);
  if (skip)
    return;
  let node = el.firstElementChild;
  while (node) {
    walk(node, callback, false);
    node = node.nextElementSibling;
  }
}

// packages/alpinejs/src/utils/warn.js
function warn(message, ...args) {
  console.warn(`Alpine Warning: ${message}`, ...args);
}

// packages/alpinejs/src/lifecycle.js
var started = false;
function start() {
  if (started)
    warn("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.");
  started = true;
  if (!document.body)
    warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
  dispatch(document, "alpine:init");
  dispatch(document, "alpine:initializing");
  startObservingMutations();
  onElAdded((el) => initTree(el, walk));
  onElRemoved((el) => destroyTree(el));
  onAttributesAdded((el, attrs) => {
    directives(el, attrs).forEach((handle) => handle());
  });
  let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
  Array.from(document.querySelectorAll(allSelectors().join(","))).filter(outNestedComponents).forEach((el) => {
    initTree(el);
  });
  dispatch(document, "alpine:initialized");
  setTimeout(() => {
    warnAboutMissingPlugins();
  });
}
var rootSelectorCallbacks = [];
var initSelectorCallbacks = [];
function rootSelectors() {
  return rootSelectorCallbacks.map((fn) => fn());
}
function allSelectors() {
  return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
}
function addRootSelector(selectorCallback) {
  rootSelectorCallbacks.push(selectorCallback);
}
function addInitSelector(selectorCallback) {
  initSelectorCallbacks.push(selectorCallback);
}
function closestRoot(el, includeInitSelectors = false) {
  return findClosest(el, (element) => {
    const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
    if (selectors.some((selector) => element.matches(selector)))
      return true;
  });
}
function findClosest(el, callback) {
  if (!el)
    return;
  if (callback(el))
    return el;
  if (el._x_teleportBack)
    el = el._x_teleportBack;
  if (!el.parentElement)
    return;
  return findClosest(el.parentElement, callback);
}
function isRoot(el) {
  return rootSelectors().some((selector) => el.matches(selector));
}
var initInterceptors2 = [];
function interceptInit(callback) {
  initInterceptors2.push(callback);
}
var markerDispenser = 1;
function initTree(el, walker = walk, intercept = () => {
}) {
  if (findClosest(el, (i) => i._x_ignore))
    return;
  deferHandlingDirectives(() => {
    walker(el, (el2, skip) => {
      if (el2._x_marker)
        return;
      intercept(el2, skip);
      initInterceptors2.forEach((i) => i(el2, skip));
      directives(el2, el2.attributes).forEach((handle) => handle());
      if (!el2._x_ignore)
        el2._x_marker = markerDispenser++;
      el2._x_ignore && skip();
    });
  });
}
function destroyTree(root, walker = walk) {
  walker(root, (el) => {
    cleanupElement(el);
    cleanupAttributes(el);
    delete el._x_marker;
  });
}
function warnAboutMissingPlugins() {
  let pluginDirectives = [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ];
  pluginDirectives.forEach(([plugin2, directive2, selectors]) => {
    if (directiveExists(directive2))
      return;
    selectors.some((selector) => {
      if (document.querySelector(selector)) {
        warn(`found "${selector}", but missing ${plugin2} plugin`);
        return true;
      }
    });
  });
}

// packages/alpinejs/src/nextTick.js
var tickStack = [];
var isHolding = false;
function nextTick(callback = () => {
}) {
  queueMicrotask(() => {
    isHolding || setTimeout(() => {
      releaseNextTicks();
    });
  });
  return new Promise((res) => {
    tickStack.push(() => {
      callback();
      res();
    });
  });
}
function releaseNextTicks() {
  isHolding = false;
  while (tickStack.length)
    tickStack.shift()();
}
function holdNextTicks() {
  isHolding = true;
}

// packages/alpinejs/src/utils/classes.js
function setClasses(el, value) {
  if (Array.isArray(value)) {
    return setClassesFromString(el, value.join(" "));
  } else if (typeof value === "object" && value !== null) {
    return setClassesFromObject(el, value);
  } else if (typeof value === "function") {
    return setClasses(el, value());
  }
  return setClassesFromString(el, value);
}
function setClassesFromString(el, classString) {
  let split = (classString2) => classString2.split(" ").filter(Boolean);
  let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
  let addClassesAndReturnUndo = (classes) => {
    el.classList.add(...classes);
    return () => {
      el.classList.remove(...classes);
    };
  };
  classString = classString === true ? classString = "" : classString || "";
  return addClassesAndReturnUndo(missingClasses(classString));
}
function setClassesFromObject(el, classObject) {
  let split = (classString) => classString.split(" ").filter(Boolean);
  let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
  let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
  let added = [];
  let removed = [];
  forRemove.forEach((i) => {
    if (el.classList.contains(i)) {
      el.classList.remove(i);
      removed.push(i);
    }
  });
  forAdd.forEach((i) => {
    if (!el.classList.contains(i)) {
      el.classList.add(i);
      added.push(i);
    }
  });
  return () => {
    removed.forEach((i) => el.classList.add(i));
    added.forEach((i) => el.classList.remove(i));
  };
}

// packages/alpinejs/src/utils/styles.js
function setStyles(el, value) {
  if (typeof value === "object" && value !== null) {
    return setStylesFromObject(el, value);
  }
  return setStylesFromString(el, value);
}
function setStylesFromObject(el, value) {
  let previousStyles = {};
  Object.entries(value).forEach(([key, value2]) => {
    previousStyles[key] = el.style[key];
    if (!key.startsWith("--")) {
      key = kebabCase(key);
    }
    el.style.setProperty(key, value2);
  });
  setTimeout(() => {
    if (el.style.length === 0) {
      el.removeAttribute("style");
    }
  });
  return () => {
    setStyles(el, previousStyles);
  };
}
function setStylesFromString(el, value) {
  let cache = el.getAttribute("style", value);
  el.setAttribute("style", value);
  return () => {
    el.setAttribute("style", cache || "");
  };
}
function kebabCase(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// packages/alpinejs/src/utils/once.js
function once(callback, fallback = () => {
}) {
  let called = false;
  return function() {
    if (!called) {
      called = true;
      callback.apply(this, arguments);
    } else {
      fallback.apply(this, arguments);
    }
  };
}

// packages/alpinejs/src/directives/x-transition.js
directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "function")
    expression = evaluate2(expression);
  if (expression === false)
    return;
  if (!expression || typeof expression === "boolean") {
    registerTransitionsFromHelper(el, modifiers, value);
  } else {
    registerTransitionsFromClassString(el, expression, value);
  }
});
function registerTransitionsFromClassString(el, classString, stage) {
  registerTransitionObject(el, setClasses, "");
  let directiveStorageMap = {
    "enter": (classes) => {
      el._x_transition.enter.during = classes;
    },
    "enter-start": (classes) => {
      el._x_transition.enter.start = classes;
    },
    "enter-end": (classes) => {
      el._x_transition.enter.end = classes;
    },
    "leave": (classes) => {
      el._x_transition.leave.during = classes;
    },
    "leave-start": (classes) => {
      el._x_transition.leave.start = classes;
    },
    "leave-end": (classes) => {
      el._x_transition.leave.end = classes;
    }
  };
  directiveStorageMap[stage](classString);
}
function registerTransitionsFromHelper(el, modifiers, stage) {
  registerTransitionObject(el, setStyles);
  let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
  let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
  let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
  if (modifiers.includes("in") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
  }
  if (modifiers.includes("out") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
  }
  let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
  let wantsOpacity = wantsAll || modifiers.includes("opacity");
  let wantsScale = wantsAll || modifiers.includes("scale");
  let opacityValue = wantsOpacity ? 0 : 1;
  let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
  let delay = modifierValue(modifiers, "delay", 0) / 1e3;
  let origin = modifierValue(modifiers, "origin", "center");
  let property = "opacity, transform";
  let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
  let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
  let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
  if (transitioningIn) {
    el._x_transition.enter.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationIn}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.enter.start = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
    el._x_transition.enter.end = {
      opacity: 1,
      transform: `scale(1)`
    };
  }
  if (transitioningOut) {
    el._x_transition.leave.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationOut}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.leave.start = {
      opacity: 1,
      transform: `scale(1)`
    };
    el._x_transition.leave.end = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
  }
}
function registerTransitionObject(el, setFunction, defaultValue = {}) {
  if (!el._x_transition)
    el._x_transition = {
      enter: { during: defaultValue, start: defaultValue, end: defaultValue },
      leave: { during: defaultValue, start: defaultValue, end: defaultValue },
      in(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.enter.during,
          start: this.enter.start,
          end: this.enter.end
        }, before, after);
      },
      out(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.leave.during,
          start: this.leave.start,
          end: this.leave.end
        }, before, after);
      }
    };
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
  const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let clickAwayCompatibleShow = () => nextTick2(show);
  if (value) {
    if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
      el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
    } else {
      el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
    }
    return;
  }
  el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
    el._x_transition.out(() => {
    }, () => resolve(hide));
    el._x_transitioning && el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
  }) : Promise.resolve(hide);
  queueMicrotask(() => {
    let closest = closestHide(el);
    if (closest) {
      if (!closest._x_hideChildren)
        closest._x_hideChildren = [];
      closest._x_hideChildren.push(el);
    } else {
      nextTick2(() => {
        let hideAfterChildren = (el2) => {
          let carry = Promise.all([
            el2._x_hidePromise,
            ...(el2._x_hideChildren || []).map(hideAfterChildren)
          ]).then(([i]) => i?.());
          delete el2._x_hidePromise;
          delete el2._x_hideChildren;
          return carry;
        };
        hideAfterChildren(el).catch((e) => {
          if (!e.isFromCancelledTransition)
            throw e;
        });
      });
    }
  });
};
function closestHide(el) {
  let parent = el.parentNode;
  if (!parent)
    return;
  return parent._x_hidePromise ? parent : closestHide(parent);
}
function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {
}, after = () => {
}) {
  if (el._x_transitioning)
    el._x_transitioning.cancel();
  if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
    before();
    after();
    return;
  }
  let undoStart, undoDuring, undoEnd;
  performTransition(el, {
    start() {
      undoStart = setFunction(el, start2);
    },
    during() {
      undoDuring = setFunction(el, during);
    },
    before,
    end() {
      undoStart();
      undoEnd = setFunction(el, end);
    },
    after,
    cleanup() {
      undoDuring();
      undoEnd();
    }
  });
}
function performTransition(el, stages) {
  let interrupted, reachedBefore, reachedEnd;
  let finish = once(() => {
    mutateDom(() => {
      interrupted = true;
      if (!reachedBefore)
        stages.before();
      if (!reachedEnd) {
        stages.end();
        releaseNextTicks();
      }
      stages.after();
      if (el.isConnected)
        stages.cleanup();
      delete el._x_transitioning;
    });
  });
  el._x_transitioning = {
    beforeCancels: [],
    beforeCancel(callback) {
      this.beforeCancels.push(callback);
    },
    cancel: once(function() {
      while (this.beforeCancels.length) {
        this.beforeCancels.shift()();
      }
      ;
      finish();
    }),
    finish
  };
  mutateDom(() => {
    stages.start();
    stages.during();
  });
  holdNextTicks();
  requestAnimationFrame(() => {
    if (interrupted)
      return;
    let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
    let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    if (duration === 0)
      duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
    mutateDom(() => {
      stages.before();
    });
    reachedBefore = true;
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      mutateDom(() => {
        stages.end();
      });
      releaseNextTicks();
      setTimeout(el._x_transitioning.finish, duration + delay);
      reachedEnd = true;
    });
  });
}
function modifierValue(modifiers, key, fallback) {
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "scale") {
    if (isNaN(rawValue))
      return fallback;
  }
  if (key === "duration" || key === "delay") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "origin") {
    if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
      return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
    }
  }
  return rawValue;
}

// packages/alpinejs/src/clone.js
var isCloning = false;
function skipDuringClone(callback, fallback = () => {
}) {
  return (...args) => isCloning ? fallback(...args) : callback(...args);
}
function onlyDuringClone(callback) {
  return (...args) => isCloning && callback(...args);
}
var interceptors = [];
function interceptClone(callback) {
  interceptors.push(callback);
}
function cloneNode(from, to) {
  interceptors.forEach((i) => i(from, to));
  isCloning = true;
  dontRegisterReactiveSideEffects(() => {
    initTree(to, (el, callback) => {
      callback(el, () => {
      });
    });
  });
  isCloning = false;
}
var isCloningLegacy = false;
function clone(oldEl, newEl) {
  if (!newEl._x_dataStack)
    newEl._x_dataStack = oldEl._x_dataStack;
  isCloning = true;
  isCloningLegacy = true;
  dontRegisterReactiveSideEffects(() => {
    cloneTree(newEl);
  });
  isCloning = false;
  isCloningLegacy = false;
}
function cloneTree(el) {
  let hasRunThroughFirstEl = false;
  let shallowWalker = (el2, callback) => {
    walk(el2, (el3, skip) => {
      if (hasRunThroughFirstEl && isRoot(el3))
        return skip();
      hasRunThroughFirstEl = true;
      callback(el3, skip);
    });
  };
  initTree(el, shallowWalker);
}
function dontRegisterReactiveSideEffects(callback) {
  let cache = effect;
  overrideEffect((callback2, el) => {
    let storedEffect = cache(callback2);
    release(storedEffect);
    return () => {
    };
  });
  callback();
  overrideEffect(cache);
}

// packages/alpinejs/src/utils/bind.js
function bind(el, name, value, modifiers = []) {
  if (!el._x_bindings)
    el._x_bindings = reactive({});
  el._x_bindings[name] = value;
  name = modifiers.includes("camel") ? camelCase(name) : name;
  switch (name) {
    case "value":
      bindInputValue(el, value);
      break;
    case "style":
      bindStyles(el, value);
      break;
    case "class":
      bindClasses(el, value);
      break;
    case "selected":
    case "checked":
      bindAttributeAndProperty(el, name, value);
      break;
    default:
      bindAttribute(el, name, value);
      break;
  }
}
function bindInputValue(el, value) {
  if (isRadio(el)) {
    if (el.attributes.value === void 0) {
      el.value = value;
    }
    if (window.fromModel) {
      if (typeof value === "boolean") {
        el.checked = safeParseBoolean(el.value) === value;
      } else {
        el.checked = checkedAttrLooseCompare(el.value, value);
      }
    }
  } else if (isCheckbox(el)) {
    if (Number.isInteger(value)) {
      el.value = value;
    } else if (!Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
      el.value = String(value);
    } else {
      if (Array.isArray(value)) {
        el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
      } else {
        el.checked = !!value;
      }
    }
  } else if (el.tagName === "SELECT") {
    updateSelect(el, value);
  } else {
    if (el.value === value)
      return;
    el.value = value === void 0 ? "" : value;
  }
}
function bindClasses(el, value) {
  if (el._x_undoAddedClasses)
    el._x_undoAddedClasses();
  el._x_undoAddedClasses = setClasses(el, value);
}
function bindStyles(el, value) {
  if (el._x_undoAddedStyles)
    el._x_undoAddedStyles();
  el._x_undoAddedStyles = setStyles(el, value);
}
function bindAttributeAndProperty(el, name, value) {
  bindAttribute(el, name, value);
  setPropertyIfChanged(el, name, value);
}
function bindAttribute(el, name, value) {
  if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
    el.removeAttribute(name);
  } else {
    if (isBooleanAttr(name))
      value = name;
    setIfChanged(el, name, value);
  }
}
function setIfChanged(el, attrName, value) {
  if (el.getAttribute(attrName) != value) {
    el.setAttribute(attrName, value);
  }
}
function setPropertyIfChanged(el, propName, value) {
  if (el[propName] !== value) {
    el[propName] = value;
  }
}
function updateSelect(el, value) {
  const arrayWrappedValue = [].concat(value).map((value2) => {
    return value2 + "";
  });
  Array.from(el.options).forEach((option) => {
    option.selected = arrayWrappedValue.includes(option.value);
  });
}
function camelCase(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function checkedAttrLooseCompare(valueA, valueB) {
  return valueA == valueB;
}
function safeParseBoolean(rawValue) {
  if ([1, "1", "true", "on", "yes", true].includes(rawValue)) {
    return true;
  }
  if ([0, "0", "false", "off", "no", false].includes(rawValue)) {
    return false;
  }
  return rawValue ? Boolean(rawValue) : null;
}
var booleanAttributes = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootdelegatesfocus",
  "shadowrootserializable"
]);
function isBooleanAttr(attrName) {
  return booleanAttributes.has(attrName);
}
function attributeShouldntBePreservedIfFalsy(name) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
}
function getBinding(el, name, fallback) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  return getAttributeBinding(el, name, fallback);
}
function extractProp(el, name, fallback, extract = true) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  if (el._x_inlineBindings && el._x_inlineBindings[name] !== void 0) {
    let binding = el._x_inlineBindings[name];
    binding.extract = extract;
    return dontAutoEvaluateFunctions(() => {
      return evaluate(el, binding.expression);
    });
  }
  return getAttributeBinding(el, name, fallback);
}
function getAttributeBinding(el, name, fallback) {
  let attr = el.getAttribute(name);
  if (attr === null)
    return typeof fallback === "function" ? fallback() : fallback;
  if (attr === "")
    return true;
  if (isBooleanAttr(name)) {
    return !![name, "true"].includes(attr);
  }
  return attr;
}
function isCheckbox(el) {
  return el.type === "checkbox" || el.localName === "ui-checkbox" || el.localName === "ui-switch";
}
function isRadio(el) {
  return el.type === "radio" || el.localName === "ui-radio";
}

// packages/alpinejs/src/utils/debounce.js
function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// packages/alpinejs/src/utils/throttle.js
function throttle(func, limit) {
  let inThrottle;
  return function() {
    let context = this, args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// packages/alpinejs/src/entangle.js
function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
  let firstRun = true;
  let outerHash;
  let innerHash;
  let reference = effect(() => {
    let outer = outerGet();
    let inner = innerGet();
    if (firstRun) {
      innerSet(cloneIfObject(outer));
      firstRun = false;
    } else {
      let outerHashLatest = JSON.stringify(outer);
      let innerHashLatest = JSON.stringify(inner);
      if (outerHashLatest !== outerHash) {
        innerSet(cloneIfObject(outer));
      } else if (outerHashLatest !== innerHashLatest) {
        outerSet(cloneIfObject(inner));
      } else {
      }
    }
    outerHash = JSON.stringify(outerGet());
    innerHash = JSON.stringify(innerGet());
  });
  return () => {
    release(reference);
  };
}
function cloneIfObject(value) {
  return typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
}

// packages/alpinejs/src/plugin.js
function plugin(callback) {
  let callbacks = Array.isArray(callback) ? callback : [callback];
  callbacks.forEach((i) => i(alpine_default));
}

// packages/alpinejs/src/store.js
var stores = {};
var isReactive = false;
function store(name, value) {
  if (!isReactive) {
    stores = reactive(stores);
    isReactive = true;
  }
  if (value === void 0) {
    return stores[name];
  }
  stores[name] = value;
  initInterceptors(stores[name]);
  if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
    stores[name].init();
  }
}
function getStores() {
  return stores;
}

// packages/alpinejs/src/binds.js
var binds = {};
function bind2(name, bindings) {
  let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
  if (name instanceof Element) {
    return applyBindingsObject(name, getBindings());
  } else {
    binds[name] = getBindings;
  }
  return () => {
  };
}
function injectBindingProviders(obj) {
  Object.entries(binds).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback(...args);
        };
      }
    });
  });
  return obj;
}
function applyBindingsObject(el, obj, original) {
  let cleanupRunners = [];
  while (cleanupRunners.length)
    cleanupRunners.pop()();
  let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }));
  let staticAttributes = attributesOnly(attributes);
  attributes = attributes.map((attribute) => {
    if (staticAttributes.find((attr) => attr.name === attribute.name)) {
      return {
        name: `x-bind:${attribute.name}`,
        value: `"${attribute.value}"`
      };
    }
    return attribute;
  });
  directives(el, attributes, original).map((handle) => {
    cleanupRunners.push(handle.runCleanups);
    handle();
  });
  return () => {
    while (cleanupRunners.length)
      cleanupRunners.pop()();
  };
}

// packages/alpinejs/src/datas.js
var datas = {};
function data(name, callback) {
  datas[name] = callback;
}
function injectDataProviders(obj, context) {
  Object.entries(datas).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback.bind(context)(...args);
        };
      },
      enumerable: false
    });
  });
  return obj;
}

// packages/alpinejs/src/alpine.js
var Alpine = {
  get reactive() {
    return reactive;
  },
  get release() {
    return release;
  },
  get effect() {
    return effect;
  },
  get raw() {
    return raw;
  },
  version: "3.14.8",
  flushAndStopDeferringMutations,
  dontAutoEvaluateFunctions,
  disableEffectScheduling,
  startObservingMutations,
  stopObservingMutations,
  setReactivityEngine,
  onAttributeRemoved,
  onAttributesAdded,
  closestDataStack,
  skipDuringClone,
  onlyDuringClone,
  addRootSelector,
  addInitSelector,
  interceptClone,
  addScopeToNode,
  deferMutations,
  mapAttributes,
  evaluateLater,
  interceptInit,
  setEvaluator,
  mergeProxies,
  extractProp,
  findClosest,
  onElRemoved,
  closestRoot,
  destroyTree,
  interceptor,
  // INTERNAL: not public API and is subject to change without major release.
  transition,
  // INTERNAL
  setStyles,
  // INTERNAL
  mutateDom,
  directive,
  entangle,
  throttle,
  debounce,
  evaluate,
  initTree,
  nextTick,
  prefixed: prefix,
  prefix: setPrefix,
  plugin,
  magic,
  store,
  start,
  clone,
  // INTERNAL
  cloneNode,
  // INTERNAL
  bound: getBinding,
  $data: scope,
  watch,
  walk,
  data,
  bind: bind2
};
var alpine_default = Alpine;

// node_modules/@vue/shared/dist/shared.esm-bundler.js
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
var EMPTY_OBJ =  true ? Object.freeze({}) : 0;
var EMPTY_ARR =  true ? Object.freeze([]) : 0;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
var camelizeRE = /-(\w)/g;
var camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);

// node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var targetMap = /* @__PURE__ */ new WeakMap();
var effectStack = [];
var activeEffect;
var ITERATE_KEY = Symbol( true ? "iterate" : 0);
var MAP_KEY_ITERATE_KEY = Symbol( true ? "Map key iterate" : 0);
function isEffect(fn) {
  return fn && fn._isEffect === true;
}
function effect2(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    fn = fn.raw;
  }
  const effect3 = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect3();
  }
  return effect3;
}
function stop(effect3) {
  if (effect3.active) {
    cleanup(effect3);
    if (effect3.options.onStop) {
      effect3.options.onStop();
    }
    effect3.active = false;
  }
}
var uid = 0;
function createReactiveEffect(fn, options) {
  const effect3 = function reactiveEffect() {
    if (!effect3.active) {
      return fn();
    }
    if (!effectStack.includes(effect3)) {
      cleanup(effect3);
      try {
        enableTracking();
        effectStack.push(effect3);
        activeEffect = effect3;
        return fn();
      } finally {
        effectStack.pop();
        resetTracking();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect3.id = uid++;
  effect3.allowRecurse = !!options.allowRecurse;
  effect3._isEffect = true;
  effect3.active = true;
  effect3.raw = fn;
  effect3.deps = [];
  effect3.options = options;
  return effect3;
}
function cleanup(effect3) {
  const { deps } = effect3;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect3);
    }
    deps.length = 0;
  }
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (!shouldTrack || activeEffect === void 0) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = /* @__PURE__ */ new Set());
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if (activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      });
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = /* @__PURE__ */ new Set();
  const add2 = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect3) => {
        if (effect3 !== activeEffect || effect3.allowRecurse) {
          effects.add(effect3);
        }
      });
    }
  };
  if (type === "clear") {
    depsMap.forEach(add2);
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        add2(dep);
      }
    });
  } else {
    if (key !== void 0) {
      add2(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          add2(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          add2(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const run = (effect3) => {
    if (effect3.options.onTrigger) {
      effect3.options.onTrigger({
        effect: effect3,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      });
    }
    if (effect3.options.scheduler) {
      effect3.options.scheduler(effect3);
    } else {
      effect3();
    }
  };
  effects.forEach(run);
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
var get2 = /* @__PURE__ */ createGetter();
var readonlyGet = /* @__PURE__ */ createGetter(true);
var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly = false, shallow = false) {
  return function get3(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive2(res);
    }
    return res;
  };
}
var set2 = /* @__PURE__ */ createSetter();
function createSetter(shallow = false) {
  return function set3(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
var mutableHandlers = {
  get: get2,
  set: set2,
  deleteProperty,
  has,
  ownKeys
};
var readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    if (true) {
      console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  },
  deleteProperty(target, key) {
    if (true) {
      console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  }
};
var toReactive = (value) => isObject(value) ? reactive2(value) : value;
var toReadonly = (value) => isObject(value) ? readonly(value) : value;
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
  target = target[
    "__v_raw"
    /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "get", key);
  }
  !isReadonly && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly = false) {
  const target = this[
    "__v_raw"
    /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "has", key);
  }
  !isReadonly && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
  target = target[
    "__v_raw"
    /* RAW */
  ];
  !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3 ? get3.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget =  true ? isMap(target) ? new Map(target) : new Set(target) : 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly, isShallow) {
  return function(...args) {
    const target = this[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    if (true) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
    }
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* CLEAR */
    ),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* CLEAR */
    ),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
var mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
var readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value[
    "__v_skip"
    /* SKIP */
  ] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive2(target) {
  if (target && target[
    "__v_isReadonly"
    /* IS_READONLY */
  ]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    if (true) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target[
    "__v_raw"
    /* RAW */
  ] && !(isReadonly && target[
    "__v_isReactive"
    /* IS_REACTIVE */
  ])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function toRaw(observed) {
  return observed && toRaw(observed[
    "__v_raw"
    /* RAW */
  ]) || observed;
}
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}

// packages/alpinejs/src/magics/$nextTick.js
magic("nextTick", () => nextTick);

// packages/alpinejs/src/magics/$dispatch.js
magic("dispatch", (el) => dispatch.bind(dispatch, el));

// packages/alpinejs/src/magics/$watch.js
magic("watch", (el, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => (key, callback) => {
  let evaluate2 = evaluateLater2(key);
  let getter = () => {
    let value;
    evaluate2((i) => value = i);
    return value;
  };
  let unwatch = watch(getter, callback);
  cleanup2(unwatch);
});

// packages/alpinejs/src/magics/$store.js
magic("store", getStores);

// packages/alpinejs/src/magics/$data.js
magic("data", (el) => scope(el));

// packages/alpinejs/src/magics/$root.js
magic("root", (el) => closestRoot(el));

// packages/alpinejs/src/magics/$refs.js
magic("refs", (el) => {
  if (el._x_refs_proxy)
    return el._x_refs_proxy;
  el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
  return el._x_refs_proxy;
});
function getArrayOfRefObject(el) {
  let refObjects = [];
  findClosest(el, (i) => {
    if (i._x_refs)
      refObjects.push(i._x_refs);
  });
  return refObjects;
}

// packages/alpinejs/src/ids.js
var globalIdMemo = {};
function findAndIncrementId(name) {
  if (!globalIdMemo[name])
    globalIdMemo[name] = 0;
  return ++globalIdMemo[name];
}
function closestIdRoot(el, name) {
  return findClosest(el, (element) => {
    if (element._x_ids && element._x_ids[name])
      return true;
  });
}
function setIdRoot(el, name) {
  if (!el._x_ids)
    el._x_ids = {};
  if (!el._x_ids[name])
    el._x_ids[name] = findAndIncrementId(name);
}

// packages/alpinejs/src/magics/$id.js
magic("id", (el, { cleanup: cleanup2 }) => (name, key = null) => {
  let cacheKey = `${name}${key ? `-${key}` : ""}`;
  return cacheIdByNameOnElement(el, cacheKey, cleanup2, () => {
    let root = closestIdRoot(el, name);
    let id = root ? root._x_ids[name] : findAndIncrementId(name);
    return key ? `${name}-${id}-${key}` : `${name}-${id}`;
  });
});
interceptClone((from, to) => {
  if (from._x_id) {
    to._x_id = from._x_id;
  }
});
function cacheIdByNameOnElement(el, cacheKey, cleanup2, callback) {
  if (!el._x_id)
    el._x_id = {};
  if (el._x_id[cacheKey])
    return el._x_id[cacheKey];
  let output = callback();
  el._x_id[cacheKey] = output;
  cleanup2(() => {
    delete el._x_id[cacheKey];
  });
  return output;
}

// packages/alpinejs/src/magics/$el.js
magic("el", (el) => el);

// packages/alpinejs/src/magics/index.js
warnMissingPluginMagic("Focus", "focus", "focus");
warnMissingPluginMagic("Persist", "persist", "persist");
function warnMissingPluginMagic(name, magicName, slug) {
  magic(magicName, (el) => warn(`You can't use [$${magicName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/directives/x-modelable.js
directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
  let func = evaluateLater2(expression);
  let innerGet = () => {
    let result;
    func((i) => result = i);
    return result;
  };
  let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
  let innerSet = (val) => evaluateInnerSet(() => {
  }, { scope: { "__placeholder": val } });
  let initialValue = innerGet();
  innerSet(initialValue);
  queueMicrotask(() => {
    if (!el._x_model)
      return;
    el._x_removeModelListeners["default"]();
    let outerGet = el._x_model.get;
    let outerSet = el._x_model.set;
    let releaseEntanglement = entangle(
      {
        get() {
          return outerGet();
        },
        set(value) {
          outerSet(value);
        }
      },
      {
        get() {
          return innerGet();
        },
        set(value) {
          innerSet(value);
        }
      }
    );
    cleanup2(releaseEntanglement);
  });
});

// packages/alpinejs/src/directives/x-teleport.js
directive("teleport", (el, { modifiers, expression }, { cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-teleport can only be used on a <template> tag", el);
  let target = getTarget(expression);
  let clone2 = el.content.cloneNode(true).firstElementChild;
  el._x_teleport = clone2;
  clone2._x_teleportBack = el;
  el.setAttribute("data-teleport-template", true);
  clone2.setAttribute("data-teleport-target", true);
  if (el._x_forwardEvents) {
    el._x_forwardEvents.forEach((eventName) => {
      clone2.addEventListener(eventName, (e) => {
        e.stopPropagation();
        el.dispatchEvent(new e.constructor(e.type, e));
      });
    });
  }
  addScopeToNode(clone2, {}, el);
  let placeInDom = (clone3, target2, modifiers2) => {
    if (modifiers2.includes("prepend")) {
      target2.parentNode.insertBefore(clone3, target2);
    } else if (modifiers2.includes("append")) {
      target2.parentNode.insertBefore(clone3, target2.nextSibling);
    } else {
      target2.appendChild(clone3);
    }
  };
  mutateDom(() => {
    placeInDom(clone2, target, modifiers);
    skipDuringClone(() => {
      initTree(clone2);
    })();
  });
  el._x_teleportPutBack = () => {
    let target2 = getTarget(expression);
    mutateDom(() => {
      placeInDom(el._x_teleport, target2, modifiers);
    });
  };
  cleanup2(
    () => mutateDom(() => {
      clone2.remove();
      destroyTree(clone2);
    })
  );
});
var teleportContainerDuringClone = document.createElement("div");
function getTarget(expression) {
  let target = skipDuringClone(() => {
    return document.querySelector(expression);
  }, () => {
    return teleportContainerDuringClone;
  })();
  if (!target)
    warn(`Cannot find x-teleport element for selector: "${expression}"`);
  return target;
}

// packages/alpinejs/src/directives/x-ignore.js
var handler = () => {
};
handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
  modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
  cleanup2(() => {
    modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
  });
};
directive("ignore", handler);

// packages/alpinejs/src/directives/x-effect.js
directive("effect", skipDuringClone((el, { expression }, { effect: effect3 }) => {
  effect3(evaluateLater(el, expression));
}));

// packages/alpinejs/src/utils/on.js
function on(el, event, modifiers, callback) {
  let listenerTarget = el;
  let handler4 = (e) => callback(e);
  let options = {};
  let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
  if (modifiers.includes("dot"))
    event = dotSyntax(event);
  if (modifiers.includes("camel"))
    event = camelCase2(event);
  if (modifiers.includes("passive"))
    options.passive = true;
  if (modifiers.includes("capture"))
    options.capture = true;
  if (modifiers.includes("window"))
    listenerTarget = window;
  if (modifiers.includes("document"))
    listenerTarget = document;
  if (modifiers.includes("debounce")) {
    let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = debounce(handler4, wait);
  }
  if (modifiers.includes("throttle")) {
    let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = throttle(handler4, wait);
  }
  if (modifiers.includes("prevent"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.preventDefault();
      next(e);
    });
  if (modifiers.includes("stop"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.stopPropagation();
      next(e);
    });
  if (modifiers.includes("once")) {
    handler4 = wrapHandler(handler4, (next, e) => {
      next(e);
      listenerTarget.removeEventListener(event, handler4, options);
    });
  }
  if (modifiers.includes("away") || modifiers.includes("outside")) {
    listenerTarget = document;
    handler4 = wrapHandler(handler4, (next, e) => {
      if (el.contains(e.target))
        return;
      if (e.target.isConnected === false)
        return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1)
        return;
      if (el._x_isShown === false)
        return;
      next(e);
    });
  }
  if (modifiers.includes("self"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.target === el && next(e);
    });
  if (isKeyEvent(event) || isClickEvent(event)) {
    handler4 = wrapHandler(handler4, (next, e) => {
      if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
        return;
      }
      next(e);
    });
  }
  listenerTarget.addEventListener(event, handler4, options);
  return () => {
    listenerTarget.removeEventListener(event, handler4, options);
  };
}
function dotSyntax(subject) {
  return subject.replace(/-/g, ".");
}
function camelCase2(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function isNumeric(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function kebabCase2(subject) {
  if ([" ", "_"].includes(
    subject
  ))
    return subject;
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function isKeyEvent(event) {
  return ["keydown", "keyup"].includes(event);
}
function isClickEvent(event) {
  return ["contextmenu", "click", "mouse"].some((i) => event.includes(i));
}
function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
  let keyModifiers = modifiers.filter((i) => {
    return !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive"].includes(i);
  });
  if (keyModifiers.includes("debounce")) {
    let debounceIndex = keyModifiers.indexOf("debounce");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.includes("throttle")) {
    let debounceIndex = keyModifiers.indexOf("throttle");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.length === 0)
    return false;
  if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
    return false;
  const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
  const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
  keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
  if (selectedSystemKeyModifiers.length > 0) {
    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
      if (modifier === "cmd" || modifier === "super")
        modifier = "meta";
      return e[`${modifier}Key`];
    });
    if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
      if (isClickEvent(e.type))
        return false;
      if (keyToModifiers(e.key).includes(keyModifiers[0]))
        return false;
    }
  }
  return true;
}
function keyToModifiers(key) {
  if (!key)
    return [];
  key = kebabCase2(key);
  let modifierToKeyMap = {
    "ctrl": "control",
    "slash": "/",
    "space": " ",
    "spacebar": " ",
    "cmd": "meta",
    "esc": "escape",
    "up": "arrow-up",
    "down": "arrow-down",
    "left": "arrow-left",
    "right": "arrow-right",
    "period": ".",
    "comma": ",",
    "equal": "=",
    "minus": "-",
    "underscore": "_"
  };
  modifierToKeyMap[key] = key;
  return Object.keys(modifierToKeyMap).map((modifier) => {
    if (modifierToKeyMap[modifier] === key)
      return modifier;
  }).filter((modifier) => modifier);
}

// packages/alpinejs/src/directives/x-model.js
directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let scopeTarget = el;
  if (modifiers.includes("parent")) {
    scopeTarget = el.parentNode;
  }
  let evaluateGet = evaluateLater(scopeTarget, expression);
  let evaluateSet;
  if (typeof expression === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression} = __placeholder`);
  } else if (typeof expression === "function" && typeof expression() === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression()} = __placeholder`);
  } else {
    evaluateSet = () => {
    };
  }
  let getValue = () => {
    let result;
    evaluateGet((value) => result = value);
    return isGetterSetter(result) ? result.get() : result;
  };
  let setValue = (value) => {
    let result;
    evaluateGet((value2) => result = value2);
    if (isGetterSetter(result)) {
      result.set(value);
    } else {
      evaluateSet(() => {
      }, {
        scope: { "__placeholder": value }
      });
    }
  };
  if (typeof expression === "string" && el.type === "radio") {
    mutateDom(() => {
      if (!el.hasAttribute("name"))
        el.setAttribute("name", expression);
    });
  }
  var event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
  let removeListener = isCloning ? () => {
  } : on(el, event, modifiers, (e) => {
    setValue(getInputValue(el, modifiers, e, getValue()));
  });
  if (modifiers.includes("fill")) {
    if ([void 0, null, ""].includes(getValue()) || isCheckbox(el) && Array.isArray(getValue()) || el.tagName.toLowerCase() === "select" && el.multiple) {
      setValue(
        getInputValue(el, modifiers, { target: el }, getValue())
      );
    }
  }
  if (!el._x_removeModelListeners)
    el._x_removeModelListeners = {};
  el._x_removeModelListeners["default"] = removeListener;
  cleanup2(() => el._x_removeModelListeners["default"]());
  if (el.form) {
    let removeResetListener = on(el.form, "reset", [], (e) => {
      nextTick(() => el._x_model && el._x_model.set(getInputValue(el, modifiers, { target: el }, getValue())));
    });
    cleanup2(() => removeResetListener());
  }
  el._x_model = {
    get() {
      return getValue();
    },
    set(value) {
      setValue(value);
    }
  };
  el._x_forceModelUpdate = (value) => {
    if (value === void 0 && typeof expression === "string" && expression.match(/\./))
      value = "";
    window.fromModel = true;
    mutateDom(() => bind(el, "value", value));
    delete window.fromModel;
  };
  effect3(() => {
    let value = getValue();
    if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
      return;
    el._x_forceModelUpdate(value);
  });
});
function getInputValue(el, modifiers, event, currentValue) {
  return mutateDom(() => {
    if (event instanceof CustomEvent && event.detail !== void 0)
      return event.detail !== null && event.detail !== void 0 ? event.detail : event.target.value;
    else if (isCheckbox(el)) {
      if (Array.isArray(currentValue)) {
        let newValue = null;
        if (modifiers.includes("number")) {
          newValue = safeParseNumber(event.target.value);
        } else if (modifiers.includes("boolean")) {
          newValue = safeParseBoolean(event.target.value);
        } else {
          newValue = event.target.value;
        }
        return event.target.checked ? currentValue.includes(newValue) ? currentValue : currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
      } else {
        return event.target.checked;
      }
    } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
      if (modifiers.includes("number")) {
        return Array.from(event.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        });
      } else if (modifiers.includes("boolean")) {
        return Array.from(event.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseBoolean(rawValue);
        });
      }
      return Array.from(event.target.selectedOptions).map((option) => {
        return option.value || option.text;
      });
    } else {
      let newValue;
      if (isRadio(el)) {
        if (event.target.checked) {
          newValue = event.target.value;
        } else {
          newValue = currentValue;
        }
      } else {
        newValue = event.target.value;
      }
      if (modifiers.includes("number")) {
        return safeParseNumber(newValue);
      } else if (modifiers.includes("boolean")) {
        return safeParseBoolean(newValue);
      } else if (modifiers.includes("trim")) {
        return newValue.trim();
      } else {
        return newValue;
      }
    }
  });
}
function safeParseNumber(rawValue) {
  let number = rawValue ? parseFloat(rawValue) : null;
  return isNumeric2(number) ? number : rawValue;
}
function checkedAttrLooseCompare2(valueA, valueB) {
  return valueA == valueB;
}
function isNumeric2(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function isGetterSetter(value) {
  return value !== null && typeof value === "object" && typeof value.get === "function" && typeof value.set === "function";
}

// packages/alpinejs/src/directives/x-cloak.js
directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));

// packages/alpinejs/src/directives/x-init.js
addInitSelector(() => `[${prefix("init")}]`);
directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "string") {
    return !!expression.trim() && evaluate2(expression, {}, false);
  }
  return evaluate2(expression, {}, false);
}));

// packages/alpinejs/src/directives/x-text.js
directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.textContent = value;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-html.js
directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.innerHTML = value;
        el._x_ignoreSelf = true;
        initTree(el);
        delete el._x_ignoreSelf;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-bind.js
mapAttributes(startingWith(":", into(prefix("bind:"))));
var handler2 = (el, { value, modifiers, expression, original }, { effect: effect3, cleanup: cleanup2 }) => {
  if (!value) {
    let bindingProviders = {};
    injectBindingProviders(bindingProviders);
    let getBindings = evaluateLater(el, expression);
    getBindings((bindings) => {
      applyBindingsObject(el, bindings, original);
    }, { scope: bindingProviders });
    return;
  }
  if (value === "key")
    return storeKeyForXFor(el, expression);
  if (el._x_inlineBindings && el._x_inlineBindings[value] && el._x_inlineBindings[value].extract) {
    return;
  }
  let evaluate2 = evaluateLater(el, expression);
  effect3(() => evaluate2((result) => {
    if (result === void 0 && typeof expression === "string" && expression.match(/\./)) {
      result = "";
    }
    mutateDom(() => bind(el, value, result, modifiers));
  }));
  cleanup2(() => {
    el._x_undoAddedClasses && el._x_undoAddedClasses();
    el._x_undoAddedStyles && el._x_undoAddedStyles();
  });
};
handler2.inline = (el, { value, modifiers, expression }) => {
  if (!value)
    return;
  if (!el._x_inlineBindings)
    el._x_inlineBindings = {};
  el._x_inlineBindings[value] = { expression, extract: false };
};
directive("bind", handler2);
function storeKeyForXFor(el, expression) {
  el._x_keyExpression = expression;
}

// packages/alpinejs/src/directives/x-data.js
addRootSelector(() => `[${prefix("data")}]`);
directive("data", (el, { expression }, { cleanup: cleanup2 }) => {
  if (shouldSkipRegisteringDataDuringClone(el))
    return;
  expression = expression === "" ? "{}" : expression;
  let magicContext = {};
  injectMagics(magicContext, el);
  let dataProviderContext = {};
  injectDataProviders(dataProviderContext, magicContext);
  let data2 = evaluate(el, expression, { scope: dataProviderContext });
  if (data2 === void 0 || data2 === true)
    data2 = {};
  injectMagics(data2, el);
  let reactiveData = reactive(data2);
  initInterceptors(reactiveData);
  let undo = addScopeToNode(el, reactiveData);
  reactiveData["init"] && evaluate(el, reactiveData["init"]);
  cleanup2(() => {
    reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
    undo();
  });
});
interceptClone((from, to) => {
  if (from._x_dataStack) {
    to._x_dataStack = from._x_dataStack;
    to.setAttribute("data-has-alpine-state", true);
  }
});
function shouldSkipRegisteringDataDuringClone(el) {
  if (!isCloning)
    return false;
  if (isCloningLegacy)
    return true;
  return el.hasAttribute("data-has-alpine-state");
}

// packages/alpinejs/src/directives/x-show.js
directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
  let evaluate2 = evaluateLater(el, expression);
  if (!el._x_doHide)
    el._x_doHide = () => {
      mutateDom(() => {
        el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
      });
    };
  if (!el._x_doShow)
    el._x_doShow = () => {
      mutateDom(() => {
        if (el.style.length === 1 && el.style.display === "none") {
          el.removeAttribute("style");
        } else {
          el.style.removeProperty("display");
        }
      });
    };
  let hide = () => {
    el._x_doHide();
    el._x_isShown = false;
  };
  let show = () => {
    el._x_doShow();
    el._x_isShown = true;
  };
  let clickAwayCompatibleShow = () => setTimeout(show);
  let toggle = once(
    (value) => value ? show() : hide(),
    (value) => {
      if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
        el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
      } else {
        value ? clickAwayCompatibleShow() : hide();
      }
    }
  );
  let oldValue;
  let firstTime = true;
  effect3(() => evaluate2((value) => {
    if (!firstTime && value === oldValue)
      return;
    if (modifiers.includes("immediate"))
      value ? clickAwayCompatibleShow() : hide();
    toggle(value);
    oldValue = value;
    firstTime = false;
  }));
});

// packages/alpinejs/src/directives/x-for.js
directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let iteratorNames = parseForExpression(expression);
  let evaluateItems = evaluateLater(el, iteratorNames.items);
  let evaluateKey = evaluateLater(
    el,
    // the x-bind:key expression is stored for our use instead of evaluated.
    el._x_keyExpression || "index"
  );
  el._x_prevKeys = [];
  el._x_lookup = {};
  effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
  cleanup2(() => {
    Object.values(el._x_lookup).forEach((el2) => mutateDom(
      () => {
        destroyTree(el2);
        el2.remove();
      }
    ));
    delete el._x_prevKeys;
    delete el._x_lookup;
  });
});
function loop(el, iteratorNames, evaluateItems, evaluateKey) {
  let isObject2 = (i) => typeof i === "object" && !Array.isArray(i);
  let templateEl = el;
  evaluateItems((items) => {
    if (isNumeric3(items) && items >= 0) {
      items = Array.from(Array(items).keys(), (i) => i + 1);
    }
    if (items === void 0)
      items = [];
    let lookup = el._x_lookup;
    let prevKeys = el._x_prevKeys;
    let scopes = [];
    let keys = [];
    if (isObject2(items)) {
      items = Object.entries(items).map(([key, value]) => {
        let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
        evaluateKey((value2) => {
          if (keys.includes(value2))
            warn("Duplicate key on x-for", el);
          keys.push(value2);
        }, { scope: { index: key, ...scope2 } });
        scopes.push(scope2);
      });
    } else {
      for (let i = 0; i < items.length; i++) {
        let scope2 = getIterationScopeVariables(iteratorNames, items[i], i, items);
        evaluateKey((value) => {
          if (keys.includes(value))
            warn("Duplicate key on x-for", el);
          keys.push(value);
        }, { scope: { index: i, ...scope2 } });
        scopes.push(scope2);
      }
    }
    let adds = [];
    let moves = [];
    let removes = [];
    let sames = [];
    for (let i = 0; i < prevKeys.length; i++) {
      let key = prevKeys[i];
      if (keys.indexOf(key) === -1)
        removes.push(key);
    }
    prevKeys = prevKeys.filter((key) => !removes.includes(key));
    let lastKey = "template";
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let prevIndex = prevKeys.indexOf(key);
      if (prevIndex === -1) {
        prevKeys.splice(i, 0, key);
        adds.push([lastKey, i]);
      } else if (prevIndex !== i) {
        let keyInSpot = prevKeys.splice(i, 1)[0];
        let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
        prevKeys.splice(i, 0, keyForSpot);
        prevKeys.splice(prevIndex, 0, keyInSpot);
        moves.push([keyInSpot, keyForSpot]);
      } else {
        sames.push(key);
      }
      lastKey = key;
    }
    for (let i = 0; i < removes.length; i++) {
      let key = removes[i];
      if (!(key in lookup))
        continue;
      mutateDom(() => {
        destroyTree(lookup[key]);
        lookup[key].remove();
      });
      delete lookup[key];
    }
    for (let i = 0; i < moves.length; i++) {
      let [keyInSpot, keyForSpot] = moves[i];
      let elInSpot = lookup[keyInSpot];
      let elForSpot = lookup[keyForSpot];
      let marker = document.createElement("div");
      mutateDom(() => {
        if (!elForSpot)
          warn(`x-for ":key" is undefined or invalid`, templateEl, keyForSpot, lookup);
        elForSpot.after(marker);
        elInSpot.after(elForSpot);
        elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
        marker.before(elInSpot);
        elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
        marker.remove();
      });
      elForSpot._x_refreshXForScope(scopes[keys.indexOf(keyForSpot)]);
    }
    for (let i = 0; i < adds.length; i++) {
      let [lastKey2, index] = adds[i];
      let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
      if (lastEl._x_currentIfEl)
        lastEl = lastEl._x_currentIfEl;
      let scope2 = scopes[index];
      let key = keys[index];
      let clone2 = document.importNode(templateEl.content, true).firstElementChild;
      let reactiveScope = reactive(scope2);
      addScopeToNode(clone2, reactiveScope, templateEl);
      clone2._x_refreshXForScope = (newScope) => {
        Object.entries(newScope).forEach(([key2, value]) => {
          reactiveScope[key2] = value;
        });
      };
      mutateDom(() => {
        lastEl.after(clone2);
        skipDuringClone(() => initTree(clone2))();
      });
      if (typeof key === "object") {
        warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
      }
      lookup[key] = clone2;
    }
    for (let i = 0; i < sames.length; i++) {
      lookup[sames[i]]._x_refreshXForScope(scopes[keys.indexOf(sames[i])]);
    }
    templateEl._x_prevKeys = keys;
  });
}
function parseForExpression(expression) {
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  let stripParensRE = /^\s*\(|\)\s*$/g;
  let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  let inMatch = expression.match(forAliasRE);
  if (!inMatch)
    return;
  let res = {};
  res.items = inMatch[2].trim();
  let item = inMatch[1].replace(stripParensRE, "").trim();
  let iteratorMatch = item.match(forIteratorRE);
  if (iteratorMatch) {
    res.item = item.replace(forIteratorRE, "").trim();
    res.index = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.collection = iteratorMatch[2].trim();
    }
  } else {
    res.item = item;
  }
  return res;
}
function getIterationScopeVariables(iteratorNames, item, index, items) {
  let scopeVariables = {};
  if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
    let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
    names.forEach((name, i) => {
      scopeVariables[name] = item[i];
    });
  } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
    let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
    names.forEach((name) => {
      scopeVariables[name] = item[name];
    });
  } else {
    scopeVariables[iteratorNames.item] = item;
  }
  if (iteratorNames.index)
    scopeVariables[iteratorNames.index] = index;
  if (iteratorNames.collection)
    scopeVariables[iteratorNames.collection] = items;
  return scopeVariables;
}
function isNumeric3(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}

// packages/alpinejs/src/directives/x-ref.js
function handler3() {
}
handler3.inline = (el, { expression }, { cleanup: cleanup2 }) => {
  let root = closestRoot(el);
  if (!root._x_refs)
    root._x_refs = {};
  root._x_refs[expression] = el;
  cleanup2(() => delete root._x_refs[expression]);
};
directive("ref", handler3);

// packages/alpinejs/src/directives/x-if.js
directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-if can only be used on a <template> tag", el);
  let evaluate2 = evaluateLater(el, expression);
  let show = () => {
    if (el._x_currentIfEl)
      return el._x_currentIfEl;
    let clone2 = el.content.cloneNode(true).firstElementChild;
    addScopeToNode(clone2, {}, el);
    mutateDom(() => {
      el.after(clone2);
      skipDuringClone(() => initTree(clone2))();
    });
    el._x_currentIfEl = clone2;
    el._x_undoIf = () => {
      mutateDom(() => {
        destroyTree(clone2);
        clone2.remove();
      });
      delete el._x_currentIfEl;
    };
    return clone2;
  };
  let hide = () => {
    if (!el._x_undoIf)
      return;
    el._x_undoIf();
    delete el._x_undoIf;
  };
  effect3(() => evaluate2((value) => {
    value ? show() : hide();
  }));
  cleanup2(() => el._x_undoIf && el._x_undoIf());
});

// packages/alpinejs/src/directives/x-id.js
directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
  let names = evaluate2(expression);
  names.forEach((name) => setIdRoot(el, name));
});
interceptClone((from, to) => {
  if (from._x_ids) {
    to._x_ids = from._x_ids;
  }
});

// packages/alpinejs/src/directives/x-on.js
mapAttributes(startingWith("@", into(prefix("on:"))));
directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
  let evaluate2 = expression ? evaluateLater(el, expression) : () => {
  };
  if (el.tagName.toLowerCase() === "template") {
    if (!el._x_forwardEvents)
      el._x_forwardEvents = [];
    if (!el._x_forwardEvents.includes(value))
      el._x_forwardEvents.push(value);
  }
  let removeListener = on(el, value, modifiers, (e) => {
    evaluate2(() => {
    }, { scope: { "$event": e }, params: [e] });
  });
  cleanup2(() => removeListener());
}));

// packages/alpinejs/src/directives/index.js
warnMissingPluginDirective("Collapse", "collapse", "collapse");
warnMissingPluginDirective("Intersect", "intersect", "intersect");
warnMissingPluginDirective("Focus", "trap", "focus");
warnMissingPluginDirective("Mask", "mask", "mask");
function warnMissingPluginDirective(name, directiveName, slug) {
  directive(directiveName, (el) => warn(`You can't use [x-${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/index.js
alpine_default.setEvaluator(normalEvaluator);
alpine_default.setReactivityEngine({ reactive: reactive2, effect: effect2, release: stop, raw: toRaw });
var src_default = alpine_default;

// packages/alpinejs/builds/module.js
var module_default = src_default;



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/scripts/styles/index.css":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/scripts/styles/index.css ***!
  \**********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../node_modules/css-loader/dist/cjs.js!./themes.css */ "./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/themes.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_fonts_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! -!../../../node_modules/css-loader/dist/cjs.js!./fonts.css */ "./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/fonts.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_texts_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! -!../../../node_modules/css-loader/dist/cjs.js!./texts.css */ "./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/texts.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_inputs_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! -!../../../node_modules/css-loader/dist/cjs.js!./inputs.css */ "./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/inputs.css");
// Imports






var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_fonts_css__WEBPACK_IMPORTED_MODULE_3__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_texts_css__WEBPACK_IMPORTED_MODULE_4__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_inputs_css__WEBPACK_IMPORTED_MODULE_5__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}/*
! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com
*//*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
  font-feature-settings: normal; /* 5 */
  font-variation-settings: normal; /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */
  font-feature-settings: normal; /* 2 */
  font-variation-settings: normal; /* 3 */
  font-size: 1em; /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/
dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */
[hidden]:where(:not([hidden="until-found"])) {
  display: none;
}
.static {
  position: static;
}
.fixed {
  position: fixed;
}
.z-50 {
  z-index: 50;
}
.flex {
  display: flex;
}
.table {
  display: table;
}
.h-\\[128px\\] {
  height: 128px;
}
.h-\\[24px\\] {
  height: 24px;
}
.h-\\[256px\\] {
  height: 256px;
}
.h-\\[2px\\] {
  height: 2px;
}
.h-\\[32px\\] {
  height: 32px;
}
.h-\\[36px\\] {
  height: 36px;
}
.h-\\[64px\\] {
  height: 64px;
}
.h-\\[calc\\(100\\%-256px\\)\\] {
  height: calc(100% - 256px);
}
.h-full {
  height: 100%;
}
.h-screen {
  height: 100vh;
}
.max-h-\\[calc\\(100\\%-32px\\)\\] {
  max-height: calc(100% - 32px);
}
.min-h-\\[128px\\] {
  min-height: 128px;
}
.w-1\\/4 {
  width: 25%;
}
.w-3\\/4 {
  width: 75%;
}
.w-\\[128px\\] {
  width: 128px;
}
.w-\\[192px\\] {
  width: 192px;
}
.w-\\[256px\\] {
  width: 256px;
}
.w-\\[320px\\] {
  width: 320px;
}
.w-\\[32px\\] {
  width: 32px;
}
.w-\\[4px\\] {
  width: 4px;
}
.w-\\[512px\\] {
  width: 512px;
}
.w-\\[64px\\] {
  width: 64px;
}
.w-\\[8px\\] {
  width: 8px;
}
.w-\\[calc\\(100\\%-192px\\)\\] {
  width: calc(100% - 192px);
}
.w-\\[calc\\(100\\%-256px\\)\\] {
  width: calc(100% - 256px);
}
.w-full {
  width: 100%;
}
.min-w-\\[128px\\] {
  min-width: 128px;
}
.max-w-\\[256px\\] {
  max-width: 256px;
}
.max-w-\\[calc\\(100\\%-1280px\\)\\] {
  max-width: calc(100% - 1280px);
}
.flex-none {
  flex: none;
}
.flex-grow {
  flex-grow: 1;
}
.grow {
  flex-grow: 1;
}
.border-collapse {
  border-collapse: collapse;
}
.cursor-pointer {
  cursor: pointer;
}
.flex-col {
  flex-direction: column;
}
.items-center {
  align-items: center;
}
.justify-start {
  justify-content: flex-start;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.justify-evenly {
  justify-content: space-evenly;
}
.gap-\\[0px\\] {
  gap: 0px;
}
.gap-y-\\[16px\\] {
  row-gap: 16px;
}
.gap-y-\\[8px\\] {
  row-gap: 8px;
}
.overflow-auto {
  overflow: auto;
}
.overflow-x-auto {
  overflow-x: auto;
}
.text-ellipsis {
  text-overflow: ellipsis;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.rounded-\\[16px\\] {
  border-radius: 16px;
}
.rounded-\\[4px\\] {
  border-radius: 4px;
}
.rounded-full {
  border-radius: 9999px;
}
.border {
  border-width: 1px;
}
.border-neutral_4 {
  --tw-border-opacity: 1;
  border-color: rgba(210, 210, 210, var(--tw-border-opacity, 1));
}
.border-neutral_7 {
  --tw-border-opacity: 1;
  border-color: rgba(60, 60, 60, var(--tw-border-opacity, 1));
}
.bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
}
.bg-neutral_1 {
  --tw-bg-opacity: 1;
  background-color: rgba(225, 225, 225, var(--tw-bg-opacity, 1));
}
.bg-neutral_2 {
  --tw-bg-opacity: 1;
  background-color: rgba(220, 220, 220, var(--tw-bg-opacity, 1));
}
.bg-neutral_9 {
  --tw-bg-opacity: 1;
  background-color: rgba(100, 100, 100, var(--tw-bg-opacity, 1));
}
.bg-red-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(248 113 113 / var(--tw-bg-opacity, 1));
}
.p-\\[0px\\] {
  padding: 0px;
}
.p-\\[16px\\] {
  padding: 16px;
}
.p-\\[32px\\] {
  padding: 32px;
}
.p-\\[4px\\] {
  padding: 4px;
}
.p-\\[8px\\] {
  padding: 8px;
}
.px-\\[16px\\] {
  padding-left: 16px;
  padding-right: 16px;
}
.px-\\[8px\\] {
  padding-left: 8px;
  padding-right: 8px;
}
.pl-\\[0px\\] {
  padding-left: 0px;
}
.text-center {
  text-align: center;
}
.align-middle {
  vertical-align: middle;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.font-bold {
  font-weight: 700;
}
.font-light {
  font-weight: 300;
}
.uppercase {
  text-transform: uppercase;
}
.lowercase {
  text-transform: lowercase;
}
.text-neutral_7 {
  --tw-text-opacity: 1;
  color: rgba(60, 60, 60, var(--tw-text-opacity, 1));
}
.outline {
  outline-style: solid;
}
.outline-\\[1px\\] {
  outline-width: 1px;
}
.outline-\\[2px\\] {
  outline-width: 2px;
}
.outline-black\\/10 {
  outline-color: rgb(0 0 0 / 0.1);
}
.drop-shadow-\\[0_1px_2px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.25\\)\\] {
  --tw-drop-shadow: drop-shadow(0 1px 2px rgba(0,0,0,0.25));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.drop-shadow-soft-bot-right {
  --tw-drop-shadow: drop-shadow(1px 1px 4px rgb(0 0 0 / 0.25));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
}

.base {
  text-align: center;
  vertical-align: middle;
}

.base-input {
  display: flex;
  height: 36px;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  --tw-bg-opacity: 1;
  background-color: rgba(220, 220, 220, var(--tw-bg-opacity, 1));
  padding: 8px;
}

.base-input:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(230, 230, 230, var(--tw-bg-opacity, 1));
}

.base-border {
  --tw-border-opacity: 1;
  border-color: rgba(60, 60, 60, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(60, 60, 60, var(--tw-text-opacity, 1));
}

.base-text-position {
  text-align: center;
  vertical-align: middle;
}

.base-text-position-center {
  text-align: center;
  vertical-align: middle;
}

.base-text-style {
  text-transform: lowercase;
  --tw-text-opacity: 1;
  color: rgba(60, 60, 60, var(--tw-text-opacity, 1));
}

.base-outline {
  outline-style: solid;
  outline-width: 1px;
  outline-color: rgb(0 0 0 / 0.25);
}

.unit {
  --tw-border-opacity: 1;
  border-color: rgba(60, 60, 60, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(60, 60, 60, var(--tw-text-opacity, 1));
  text-align: center;
  vertical-align: middle;
  outline-style: solid;
  outline-width: 1px;
  outline-color: rgb(0 0 0 / 0.25);
}

.button-submit {
  --tw-border-opacity: 1;
  border-color: rgba(60, 60, 60, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(60, 60, 60, var(--tw-text-opacity, 1));
  text-align: center;
  vertical-align: middle;
  outline-style: solid;
  outline-width: 1px;
  outline-color: rgb(0 0 0 / 0.25);
}

.input-number {
  display: flex;
  height: 36px;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  --tw-bg-opacity: 1;
  background-color: rgba(220, 220, 220, var(--tw-bg-opacity, 1));
  padding: 8px;
}

.input-number:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(230, 230, 230, var(--tw-bg-opacity, 1));
}

.input-number {
  --tw-border-opacity: 1;
  border-color: rgba(60, 60, 60, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(60, 60, 60, var(--tw-text-opacity, 1));
  text-align: center;
  vertical-align: middle;
  outline-style: solid;
  outline-width: 1px;
  outline-color: rgb(0 0 0 / 0.25);
}

input.input-number {
  -moz-appearance: none;
       appearance: none;
  margin: 0;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

input.input-number::-webkit-inner-spin-button,
input.input-number::-webkit-outer-spin-button {
-webkit-appearance: none;
margin: 0;
}

.input-text {
  display: flex;
  height: 36px;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  --tw-bg-opacity: 1;
  background-color: rgba(220, 220, 220, var(--tw-bg-opacity, 1));
  padding: 8px;
}

.input-text:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(230, 230, 230, var(--tw-bg-opacity, 1));
}

.input-text {
  --tw-border-opacity: 1;
  border-color: rgba(60, 60, 60, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(60, 60, 60, var(--tw-text-opacity, 1));
  text-align: center;
  vertical-align: middle;
  outline-style: solid;
  outline-width: 1px;
  outline-color: rgb(0 0 0 / 0.25);
}

.field-title {
  height: 24px;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  text-transform: lowercase;
  --tw-text-opacity: 1;
  color: rgba(60, 60, 60, var(--tw-text-opacity, 1));
}

.input-field {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.table-pattern-1 {
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgba(210, 210, 210, var(--tw-border-opacity, 1));
  padding: 4px;
  text-align: center;
  vertical-align: middle;
}

.main-content {
  display: flex;
  height: 100%;
  width: 100%;
  gap: 0px;
  padding: 0px;
  padding-left: 0px;
}

input.continuous-number {
  -moz-appearance: none;
       appearance: none;
  margin: 0;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

input.continuous-number::-webkit-inner-spin-button,
input.continuous-number::-webkit-outer-spin-button {
-webkit-appearance: none;
margin: 0;
}

.hover\\:border-b-\\[1px\\]:hover {
  border-bottom-width: 1px;
}

.hover\\:border-amber-600:hover {
  --tw-border-opacity: 1;
  border-color: rgb(217 119 6 / var(--tw-border-opacity, 1));
}

.hover\\:bg-neutral_0:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(230, 230, 230, var(--tw-bg-opacity, 1));
}

.hover\\:bg-neutral_1:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(225, 225, 225, var(--tw-bg-opacity, 1));
}

.hover\\:bg-neutral_7:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(60, 60, 60, var(--tw-bg-opacity, 1));
}

.hover\\:font-normal:hover {
  font-weight: 400;
}

.hover\\:text-neutral_5:hover {
  --tw-text-opacity: 1;
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
}
`, "",{"version":3,"sources":["webpack://./src/scripts/styles/index.css"],"names":[],"mappings":"AAAA;EAAA,wBAAc;EAAd,wBAAc;EAAd,mBAAc;EAAd,mBAAc;EAAd,cAAc;EAAd,cAAc;EAAd,cAAc;EAAd,eAAc;EAAd,eAAc;EAAd,aAAc;EAAd,aAAc;EAAd,kBAAc;EAAd,sCAAc;EAAd,8BAAc;EAAd,6BAAc;EAAd,4BAAc;EAAd,eAAc;EAAd,oBAAc;EAAd,sBAAc;EAAd,uBAAc;EAAd,wBAAc;EAAd,kBAAc;EAAd,2BAAc;EAAd,4BAAc;EAAd,sCAAc;EAAd,kCAAc;EAAd,2BAAc;EAAd,sBAAc;EAAd,8BAAc;EAAd,YAAc;EAAd,kBAAc;EAAd,gBAAc;EAAd,iBAAc;EAAd,kBAAc;EAAd,cAAc;EAAd,gBAAc;EAAd,aAAc;EAAd,mBAAc;EAAd,qBAAc;EAAd,2BAAc;EAAd,yBAAc;EAAd,0BAAc;EAAd,2BAAc;EAAd,uBAAc;EAAd,wBAAc;EAAd,yBAAc;EAAd,sBAAc;EAAd,oBAAc;EAAd,sBAAc;EAAd,qBAAc;EAAd;AAAc;;AAAd;EAAA,wBAAc;EAAd,wBAAc;EAAd,mBAAc;EAAd,mBAAc;EAAd,cAAc;EAAd,cAAc;EAAd,cAAc;EAAd,eAAc;EAAd,eAAc;EAAd,aAAc;EAAd,aAAc;EAAd,kBAAc;EAAd,sCAAc;EAAd,8BAAc;EAAd,6BAAc;EAAd,4BAAc;EAAd,eAAc;EAAd,oBAAc;EAAd,sBAAc;EAAd,uBAAc;EAAd,wBAAc;EAAd,kBAAc;EAAd,2BAAc;EAAd,4BAAc;EAAd,sCAAc;EAAd,kCAAc;EAAd,2BAAc;EAAd,sBAAc;EAAd,8BAAc;EAAd,YAAc;EAAd,kBAAc;EAAd,gBAAc;EAAd,iBAAc;EAAd,kBAAc;EAAd,cAAc;EAAd,gBAAc;EAAd,aAAc;EAAd,mBAAc;EAAd,qBAAc;EAAd,2BAAc;EAAd,yBAAc;EAAd,0BAAc;EAAd,2BAAc;EAAd,uBAAc;EAAd,wBAAc;EAAd,yBAAc;EAAd,sBAAc;EAAd,oBAAc;EAAd,sBAAc;EAAd,qBAAc;EAAd;AAAc,CAAd;;CAAc,CAAd;;;CAAc;;AAAd;;;EAAA,sBAAc,EAAd,MAAc;EAAd,eAAc,EAAd,MAAc;EAAd,mBAAc,EAAd,MAAc;EAAd,qBAAc,EAAd,MAAc;AAAA;;AAAd;;EAAA,gBAAc;AAAA;;AAAd;;;;;;;;CAAc;;AAAd;;EAAA,gBAAc,EAAd,MAAc;EAAd,8BAAc,EAAd,MAAc;EAAd,gBAAc,EAAd,MAAc;EAAd,cAAc;KAAd,WAAc,EAAd,MAAc;EAAd,+HAAc,EAAd,MAAc;EAAd,6BAAc,EAAd,MAAc;EAAd,+BAAc,EAAd,MAAc;EAAd,wCAAc,EAAd,MAAc;AAAA;;AAAd;;;CAAc;;AAAd;EAAA,SAAc,EAAd,MAAc;EAAd,oBAAc,EAAd,MAAc;AAAA;;AAAd;;;;CAAc;;AAAd;EAAA,SAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;EAAd,qBAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,yCAAc;UAAd,iCAAc;AAAA;;AAAd;;CAAc;;AAAd;;;;;;EAAA,kBAAc;EAAd,oBAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,cAAc;EAAd,wBAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,mBAAc;AAAA;;AAAd;;;;;CAAc;;AAAd;;;;EAAA,+GAAc,EAAd,MAAc;EAAd,6BAAc,EAAd,MAAc;EAAd,+BAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,cAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,cAAc;EAAd,cAAc;EAAd,kBAAc;EAAd,wBAAc;AAAA;;AAAd;EAAA,eAAc;AAAA;;AAAd;EAAA,WAAc;AAAA;;AAAd;;;;CAAc;;AAAd;EAAA,cAAc,EAAd,MAAc;EAAd,qBAAc,EAAd,MAAc;EAAd,yBAAc,EAAd,MAAc;AAAA;;AAAd;;;;CAAc;;AAAd;;;;;EAAA,oBAAc,EAAd,MAAc;EAAd,8BAAc,EAAd,MAAc;EAAd,gCAAc,EAAd,MAAc;EAAd,eAAc,EAAd,MAAc;EAAd,oBAAc,EAAd,MAAc;EAAd,oBAAc,EAAd,MAAc;EAAd,uBAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;EAAd,SAAc,EAAd,MAAc;EAAd,UAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,oBAAc;AAAA;;AAAd;;;CAAc;;AAAd;;;;EAAA,0BAAc,EAAd,MAAc;EAAd,6BAAc,EAAd,MAAc;EAAd,sBAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,aAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,gBAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,wBAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,YAAc;AAAA;;AAAd;;;CAAc;;AAAd;EAAA,6BAAc,EAAd,MAAc;EAAd,oBAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,wBAAc;AAAA;;AAAd;;;CAAc;;AAAd;EAAA,0BAAc,EAAd,MAAc;EAAd,aAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,kBAAc;AAAA;;AAAd;;CAAc;;AAAd;;;;;;;;;;;;;EAAA,SAAc;AAAA;;AAAd;EAAA,SAAc;EAAd,UAAc;AAAA;;AAAd;EAAA,UAAc;AAAA;;AAAd;;;EAAA,gBAAc;EAAd,SAAc;EAAd,UAAc;AAAA;;AAAd;;CAAc;AAAd;EAAA,UAAc;AAAA;;AAAd;;CAAc;;AAAd;EAAA,gBAAc;AAAA;;AAAd;;;CAAc;;AAAd;EAAA,UAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;AAAA;;AAAd;;EAAA,UAAc,EAAd,MAAc;EAAd,cAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,eAAc;AAAA;;AAAd;;CAAc;AAAd;EAAA,eAAc;AAAA;;AAAd;;;;CAAc;;AAAd;;;;;;;;EAAA,cAAc,EAAd,MAAc;EAAd,sBAAc,EAAd,MAAc;AAAA;;AAAd;;CAAc;;AAAd;;EAAA,eAAc;EAAd,YAAc;AAAA;;AAAd,wEAAc;AAAd;EAAA,aAAc;AAAA;AAEd;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;E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","sourcesContent":["@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@import \"./themes.css\";\n@import \"./fonts.css\";\n@import \"./texts.css\";\n@import \"./inputs.css\";\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,\n    Arial, sans-serif;\n}\n\n.base {\n  @apply text-center align-middle;\n}\n\n.base-input {\n  @apply rounded-[4px] p-[8px] w-full h-[36px] flex items-center justify-center bg-neutral_2 hover:bg-neutral_0;\n}\n\n.base-border {\n  @apply border-neutral_7 text-neutral_7\n}\n\n.base-text-position {\n  @apply text-center align-middle\n}\n\n.base-text-position-center {\n  @apply text-center align-middle\n}\n\n.base-text-style {\n  @apply text-neutral_7 lowercase\n}\n\n.base-outline {\n  @apply outline outline-[1px] outline-black/25;\n}\n\n.unit {\n  @apply base-text-position-center base-border base-outline\n}\n\n.button-submit {\n  @apply base-text-position-center base-border base-outline\n}\n\n.input-number {\n  @apply base-text-position base-border base-outline base-input continuous-number;\n}\n\n.input-text {\n  @apply base-text-position base-border base-outline base-input;\n}\n\n.field-title {\n  @apply base-text-position-center base-text-style w-full h-[24px];\n}\n\n.input-field {\n  @apply w-full h-full flex flex-col items-center justify-center;\n}\n\n.table-pattern-1 {\n  @apply text-center align-middle border border-neutral_4 p-[4px]\n}\n\n.main-content {\n  @apply w-full h-full flex gap-[0px] pl-[0px] p-[0px]\n}\n\ninput.continuous-number {\n  appearance: none;\n  margin: 0;\n  -webkit-appearance: none;\n  -moz-appearance: textfield;\n}\n\ninput.continuous-number::-webkit-inner-spin-button,\ninput.continuous-number::-webkit-outer-spin-button {\n-webkit-appearance: none;\nmargin: 0;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/fonts.css":
/*!****************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/fonts.css ***!
  \****************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/inputs.css":
/*!*****************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/inputs.css ***!
  \*****************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@layer components {
    .base {
        @apply text-center align-middle;
    }
    .default-button {
        @apply base bg-blue-500 border-neutral_7 text-neutral_7;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .no-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .default-input {
        @apply base border-neutral_7 text-neutral_7 rounded-[16px];
    }
}

input.continuous-number {
    appearance: none;
    margin: 0;
    -webkit-appearance: none;
    -moz-appearance: textfield;
}

input.continuous-number::-webkit-inner-spin-button,
input.continuous-number::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

`, "",{"version":3,"sources":["webpack://./src/scripts/styles/inputs.css"],"names":[],"mappings":"AAAA;IACI;QACI,+BAA+B;IACnC;IACA;QACI,uDAAuD;IAC3D;;IAEA,4CAA4C;IAC5C;QACI,wBAAwB,GAAG,gBAAgB;QAC3C,qBAAqB,GAAG,YAAY;IACxC;;IAEA,gDAAgD;IAChD;QACI,aAAa;IACjB;;IAEA;QACI,0DAA0D;IAC9D;AACJ;;AAEA;IACI,gBAAgB;IAChB,SAAS;IACT,wBAAwB;IACxB,0BAA0B;AAC9B;;AAEA;;EAEE,wBAAwB;EACxB,SAAS;AACX","sourcesContent":["@layer components {\r\n    .base {\r\n        @apply text-center align-middle;\r\n    }\r\n    .default-button {\r\n        @apply base bg-blue-500 border-neutral_7 text-neutral_7;\r\n    }\r\n\r\n    /* Hide scrollbar for IE, Edge and Firefox */\r\n    .no-scrollbar {\r\n        -ms-overflow-style: none;  /* IE and Edge */\r\n        scrollbar-width: none;  /* Firefox */\r\n    }\r\n    \r\n    /* Hide scrollbar for Chrome, Safari and Opera */\r\n    .no-scrollbar::-webkit-scrollbar {\r\n        display: none;\r\n    }\r\n\r\n    .default-input {\r\n        @apply base border-neutral_7 text-neutral_7 rounded-[16px];\r\n    }\r\n}\r\n\r\ninput.continuous-number {\r\n    appearance: none;\r\n    margin: 0;\r\n    -webkit-appearance: none;\r\n    -moz-appearance: textfield;\r\n}\r\n\r\ninput.continuous-number::-webkit-inner-spin-button,\r\ninput.continuous-number::-webkit-outer-spin-button {\r\n  -webkit-appearance: none;\r\n  margin: 0;\r\n}\r\n\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/texts.css":
/*!****************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/texts.css ***!
  \****************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/themes.css":
/*!*****************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/scripts/styles/themes.css ***!
  \*****************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --primary: 255, 0, 0;
  --primary_highlight: 0, 255, 0;
  --secondary: 0, 0, 255;
  --neutral_0: 240, 240, 240;
  --neutral_1: 220, 220, 220;
  --neutral_2: 200, 200, 200;
  --neutral_3: 180, 180, 180;
  --neutral_4: 160, 160, 160;
  --neutral_5: 140, 140, 140;
  --neutral_6: 120, 120, 120;
  --neutral_7: 100, 100, 100;
  --neutral_8: 80, 80, 80;
  --neutral_9: 60, 60, 60;
}

[data-theme='custom_light']
{
  --primary: 250, 250, 250;
  --primary_highlight: 255, 255, 255;
  --secondary: 200, 200, 200;
  --primary_text: 90, 90, 90;
  --primary_highlight_text: 30, 30, 30;
  --primary_highlight_text: 30, 30, 30;
  --info: 100, 100, 240;
  --success: 100, 240, 100;
  --warning: 240, 240, 100;
  --error: 240, 100, 100;
  --neutral_0: 255, 255, 255;
  --neutral_1: 250, 250, 250;
  --neutral_2: 245, 245, 245;
  --neutral_3: 240, 240, 240;
  --neutral_4: 235, 235, 235;
  --neutral_5: 10, 10, 10;
  --neutral_6: 15, 15, 15;
  --neutral_7: 20, 20, 20;
  --neutral_8: 25, 25, 25;
  --neutral_9: 30, 30, 30;
}

[data-theme='custom_dark']
{
  --primary: 40, 40, 40;
  --primary_highlight: 30, 30, 30;
  --secondary: 20, 20, 20;
  --primary_text: 255, 255, 255;
  --primary_highlight_text: 250, 250, 250;
  --info: 100, 100, 240;
  --success: 100, 240, 100;
  --warning: 240, 240, 100;
  --error: 240, 100, 100;
  --neutral_0: 255, 255, 255;
  --neutral_1: 250, 250, 250;
  --neutral_2: 245, 245, 245;
  --neutral_3: 240, 240, 240;
  --neutral_4: 235, 235, 235;
  --neutral_5: 10, 10, 10;
  --neutral_6: 15, 15, 15;
  --neutral_7: 20, 20, 20;
  --neutral_8: 25, 25, 25;
  --neutral_9: 30, 30, 30;
}`, "",{"version":3,"sources":["webpack://./src/scripts/styles/themes.css"],"names":[],"mappings":"AAAA;EACE,oBAAoB;EACpB,8BAA8B;EAC9B,sBAAsB;EACtB,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,uBAAuB;EACvB,uBAAuB;AACzB;;AAEA;;EAEE,wBAAwB;EACxB,kCAAkC;EAClC,0BAA0B;EAC1B,0BAA0B;EAC1B,oCAAoC;EACpC,oCAAoC;EACpC,qBAAqB;EACrB,wBAAwB;EACxB,wBAAwB;EACxB,sBAAsB;EACtB,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,uBAAuB;EACvB,uBAAuB;EACvB,uBAAuB;EACvB,uBAAuB;EACvB,uBAAuB;AACzB;;AAEA;;EAEE,qBAAqB;EACrB,+BAA+B;EAC/B,uBAAuB;EACvB,6BAA6B;EAC7B,uCAAuC;EACvC,qBAAqB;EACrB,wBAAwB;EACxB,wBAAwB;EACxB,sBAAsB;EACtB,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,0BAA0B;EAC1B,uBAAuB;EACvB,uBAAuB;EACvB,uBAAuB;EACvB,uBAAuB;EACvB,uBAAuB;AACzB","sourcesContent":[":root {\r\n  --primary: 255, 0, 0;\r\n  --primary_highlight: 0, 255, 0;\r\n  --secondary: 0, 0, 255;\r\n  --neutral_0: 240, 240, 240;\r\n  --neutral_1: 220, 220, 220;\r\n  --neutral_2: 200, 200, 200;\r\n  --neutral_3: 180, 180, 180;\r\n  --neutral_4: 160, 160, 160;\r\n  --neutral_5: 140, 140, 140;\r\n  --neutral_6: 120, 120, 120;\r\n  --neutral_7: 100, 100, 100;\r\n  --neutral_8: 80, 80, 80;\r\n  --neutral_9: 60, 60, 60;\r\n}\r\n\r\n[data-theme='custom_light']\r\n{\r\n  --primary: 250, 250, 250;\r\n  --primary_highlight: 255, 255, 255;\r\n  --secondary: 200, 200, 200;\r\n  --primary_text: 90, 90, 90;\r\n  --primary_highlight_text: 30, 30, 30;\r\n  --primary_highlight_text: 30, 30, 30;\r\n  --info: 100, 100, 240;\r\n  --success: 100, 240, 100;\r\n  --warning: 240, 240, 100;\r\n  --error: 240, 100, 100;\r\n  --neutral_0: 255, 255, 255;\r\n  --neutral_1: 250, 250, 250;\r\n  --neutral_2: 245, 245, 245;\r\n  --neutral_3: 240, 240, 240;\r\n  --neutral_4: 235, 235, 235;\r\n  --neutral_5: 10, 10, 10;\r\n  --neutral_6: 15, 15, 15;\r\n  --neutral_7: 20, 20, 20;\r\n  --neutral_8: 25, 25, 25;\r\n  --neutral_9: 30, 30, 30;\r\n}\r\n\r\n[data-theme='custom_dark']\r\n{\r\n  --primary: 40, 40, 40;\r\n  --primary_highlight: 30, 30, 30;\r\n  --secondary: 20, 20, 20;\r\n  --primary_text: 255, 255, 255;\r\n  --primary_highlight_text: 250, 250, 250;\r\n  --info: 100, 100, 240;\r\n  --success: 100, 240, 100;\r\n  --warning: 240, 240, 100;\r\n  --error: 240, 100, 100;\r\n  --neutral_0: 255, 255, 255;\r\n  --neutral_1: 250, 250, 250;\r\n  --neutral_2: 245, 245, 245;\r\n  --neutral_3: 240, 240, 240;\r\n  --neutral_4: 235, 235, 235;\r\n  --neutral_5: 10, 10, 10;\r\n  --neutral_6: 15, 15, 15;\r\n  --neutral_7: 20, 20, 20;\r\n  --neutral_8: 25, 25, 25;\r\n  --neutral_9: 30, 30, 30;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/scripts/styles/index.css":
/*!**************************************!*\
  !*** ./src/scripts/styles/index.css ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/postcss-loader/dist/cjs.js!./index.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/scripts/styles/index.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/controllers/database-manager.ts":
/*!*********************************************!*\
  !*** ./src/controllers/database-manager.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseManager = void 0;
const path_manager_1 = __webpack_require__(/*! ../scripts/path-manager */ "./src/scripts/path-manager.ts");
const transactions_manager_1 = __webpack_require__(/*! ./transactions-manager */ "./src/controllers/transactions-manager.ts");
class DatabaseManager {
    constructor() {
        this._transactionsManager = null;
        this.folder = "";
        this.filename = "transactions";
        this.format = "csv";
        this.ROOT = path_manager_1.PathManager.GetInstance().GetRoot();
        this.InitializeDatabases();
    }
    static GetInstance() {
        if (this._instance == null) {
            this._instance = new DatabaseManager();
        }
        return this._instance;
    }
    InitializeDatabases() {
        this._transactionsManager = transactions_manager_1.TransactionsManager.GetInstance();
    }
    GetTransactionManager() {
        return this._transactionsManager;
    }
}
exports.DatabaseManager = DatabaseManager;


/***/ }),

/***/ "./src/controllers/store.ts":
/*!**********************************!*\
  !*** ./src/controllers/store.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const alpinejs_1 = __importDefault(__webpack_require__(/*! alpinejs */ "./node_modules/alpinejs/dist/module.esm.js"));
const database_manager_1 = __webpack_require__(/*! ./database-manager */ "./src/controllers/database-manager.ts");
const formatter_1 = __webpack_require__(/*! ../scripts/formatter */ "./src/scripts/formatter.ts");
window.Alpine = alpinejs_1.default;
document.addEventListener("DOMContentLoaded", () => {
    alpinejs_1.default.start();
});
document.addEventListener("alpine:init", () => {
    initialize_stores();
});
function initialize_stores() {
    alpinejs_1.default.store("TransactionsManager", database_manager_1.DatabaseManager.GetInstance().GetTransactionManager());
    alpinejs_1.default.store("Formatter", formatter_1.Formatter);
}


/***/ }),

/***/ "./src/controllers/transactions-manager.ts":
/*!*************************************************!*\
  !*** ./src/controllers/transactions-manager.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsManager = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const transaction_1 = __webpack_require__(/*! ../models/transaction */ "./src/models/transaction.ts");
const path_manager_1 = __webpack_require__(/*! ../scripts/path-manager */ "./src/scripts/path-manager.ts");
const sync_1 = __webpack_require__(/*! csv-parse/sync */ "./node_modules/csv-parse/dist/cjs/sync.cjs");
const sync_2 = __webpack_require__(/*! csv-stringify/sync */ "./node_modules/csv-stringify/dist/cjs/sync.cjs");
const transaction_type_1 = __webpack_require__(/*! ../enums/transaction-type */ "./src/enums/transaction-type.ts");
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
class TransactionsManager {
    constructor() {
        this._transactions = [];
        this.folder = "";
        this.filename = "transactions";
        this.format = "csv";
        this.ROOT = path_manager_1.PathManager.GetInstance().GetRoot();
        this.Read();
    }
    static GetInstance() {
        if (this._instance == null) {
            this._instance = new TransactionsManager();
        }
        return this._instance;
    }
    Create(name, type, agent, date, referenceDate, value, description, details) {
        const file = path_1.default.join(this.ROOT, "database", "transactions.csv");
        try {
            if (!fs.existsSync(file)) {
                console.error('Error processing CSV file: file does not exists.');
            }
            const fileContent = fs.readFileSync(file, 'utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            const newId = records.length > 0 ? Math.max(...records.map((r) => parseInt(r.id))) + 1 : 1;
            const currentDateTicks = new Date().getTime();
            const transactionDateTicks = new Date(date).getTime();
            const referenceDateTicks = new Date(referenceDate).getTime();
            // let detailsPath: string | undefined;
            // if (transactionData.details && fs.existsSync(path.join(this.ROOT, transactionData.details))) {
            //     detailsPath = transactionData.details;
            // }
            let transactionType = transaction_type_1.TransactionType.Entry;
            type = type.toLowerCase();
            try {
                if (type == "entry") {
                    transactionType = transaction_type_1.TransactionType.Entry;
                }
                else if (type == "exit") {
                    transactionType = transaction_type_1.TransactionType.Exit;
                }
                else {
                    console.error('Invalid transaction type.');
                }
            }
            catch (error) {
                console.error('Error processing CSV file transaction type:', error);
            }
            const transaction = new transaction_1.Transaction(newId, currentDateTicks, currentDateTicks, name, description, transactionType, agent, transactionDateTicks, referenceDateTicks, value, details || "");
            const transactionPlain = {
                id: newId,
                creationDate: currentDateTicks,
                lastModifiedDate: currentDateTicks,
                name: name,
                description: description,
                type: type,
                agent: agent,
                transactionDate: transactionDateTicks,
                referenceDate: referenceDateTicks,
                value: value,
                details: details || "",
            };
            this._transactions.push(transaction);
            records.push(transactionPlain);
            const updatedCSV = (0, sync_2.stringify)(records, { header: true });
            fs.writeFileSync(file, updatedCSV, 'utf-8');
        }
        catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }
    Read() {
        const file = path_1.default.join(this.ROOT, "database", "transactions.csv");
        try {
            if (!fs.existsSync(file)) {
                const header = [
                    "id", "creationDate", "lastModifiedDate", "name", "description", "type", "agent", "transactionDate", "referenceDate",
                    "value", "name", "details"
                ];
                const newCSV = (0, sync_2.stringify)([], { header: true });
                fs.writeFileSync(file, newCSV, 'utf-8');
            }
            const fileContent = fs.readFileSync(file, 'utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            for (let i = 0; i < records.length; i++) {
                const transaction = new transaction_1.Transaction(records[i].id, parseInt(records[i].creationDate), parseInt(records[i].lastModifiedDate), records[i].name, records[i].description, records[i].type, records[i].agent, parseInt(records[i].transactionDate), parseInt(records[i].referenceDate), parseFloat(records[i].value), records[i].details || "");
                this._transactions.push(transaction);
                console.log(transaction);
            }
        }
        catch (error) {
            console.error('Error reading CSV file:', error);
        }
    }
    Update() {
    }
    Delete() {
    }
    GetTransactions() {
        return this._transactions;
    }
}
exports.TransactionsManager = TransactionsManager;


/***/ }),

/***/ "./src/enums/transaction-type.ts":
/*!***************************************!*\
  !*** ./src/enums/transaction-type.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["Entry"] = 0] = "Entry";
    TransactionType[TransactionType["Exit"] = 1] = "Exit";
})(TransactionType || (exports.TransactionType = TransactionType = {}));


/***/ }),

/***/ "./src/models/entity.ts":
/*!******************************!*\
  !*** ./src/models/entity.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entity = void 0;
class Entity {
    constructor(id, creationDate, lastModified, name, description) {
        this._id = id;
        this._creationDate = creationDate;
        this._lastModified = lastModified;
        this._name = name;
        this._description = description;
    }
    GetInfo() {
        return {
            id: this._id,
            creationDate: this._creationDate,
            lastModified: this._lastModified,
            name: this._name,
            description: this._description
        };
    }
}
exports.Entity = Entity;


/***/ }),

/***/ "./src/models/transaction.ts":
/*!***********************************!*\
  !*** ./src/models/transaction.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transaction = void 0;
const entity_1 = __webpack_require__(/*! ./entity */ "./src/models/entity.ts");
class Transaction extends entity_1.Entity {
    constructor(id, creationDate, lastModified, name, description, type, agent, transactionDate, referenceDate, value, details) {
        super(id, creationDate, lastModified, name, description);
        this._type = type;
        this._agent = agent;
        this._transactionDate = transactionDate;
        this._referenceDate = referenceDate;
        this._value = value;
        this._details = details;
    }
    GetInfo() {
        return Object.assign(Object.assign({}, super.GetInfo()), { type: this._type, agent: this._agent, transactionDate: this._transactionDate, referenceDate: this._referenceDate, value: this._value, details: this._details });
    }
}
exports.Transaction = Transaction;


/***/ }),

/***/ "./src/scripts/formatter.ts":
/*!**********************************!*\
  !*** ./src/scripts/formatter.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Formatter = void 0;
class Formatter {
    static MilisecondsToDateString(miliseconds) {
        const date = new Date(miliseconds);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }
    static NumberToMonetaryString(value) {
        if (typeof value !== 'number') {
            return `Invalid value`;
        }
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
}
exports.Formatter = Formatter;


/***/ }),

/***/ "./src/scripts/path-manager.ts":
/*!*************************************!*\
  !*** ./src/scripts/path-manager.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PathManager = void 0;
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
class PathManager {
    constructor() {
        this.ROOT = path_1.default.resolve(__dirname, '..', '..', '..');
        console.log(this.ROOT);
    }
    static GetInstance() {
        if (this._instance == null) {
            this._instance = new PathManager();
        }
        return this._instance;
    }
    GetRoot() {
        return this.ROOT;
    }
    Create() {
    }
    Read() {
    }
    Update() {
    }
    Delete() {
    }
}
exports.PathManager = PathManager;


/***/ }),

/***/ "./src/scripts/renderer.ts":
/*!*********************************!*\
  !*** ./src/scripts/renderer.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./styles/index.css */ "./src/scripts/styles/index.css");
__webpack_require__(/*! ../controllers/store */ "./src/controllers/store.ts");
function loadComponent(filePath, targetId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(filePath);
            if (response.ok) {
                const htmlContent = yield response.text();
                document.getElementById(targetId).innerHTML = htmlContent;
            }
            else {
                console.error(`Failed to load ${filePath}:`, response.statusText);
            }
        }
        catch (error) {
            console.error(`Error loading ${filePath}:`, error);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('../views/header.html', 'header-container');
    document.documentElement.setAttribute('data-theme', 'custom_light');
});


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "./node_modules/csv-parse/dist/cjs/sync.cjs":
/*!**************************************************!*\
  !*** ./node_modules/csv-parse/dist/cjs/sync.cjs ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {



class CsvError extends Error {
  constructor(code, message, options, ...contexts) {
    if (Array.isArray(message)) message = message.join(" ").trim();
    super(message);
    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, CsvError);
    }
    this.code = code;
    for (const context of contexts) {
      for (const key in context) {
        const value = context[key];
        this[key] = Buffer.isBuffer(value)
          ? value.toString(options.encoding)
          : value == null
            ? value
            : JSON.parse(JSON.stringify(value));
      }
    }
  }
}

const is_object = function (obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};

const normalize_columns_array = function (columns) {
  const normalizedColumns = [];
  for (let i = 0, l = columns.length; i < l; i++) {
    const column = columns[i];
    if (column === undefined || column === null || column === false) {
      normalizedColumns[i] = { disabled: true };
    } else if (typeof column === "string") {
      normalizedColumns[i] = { name: column };
    } else if (is_object(column)) {
      if (typeof column.name !== "string") {
        throw new CsvError("CSV_OPTION_COLUMNS_MISSING_NAME", [
          "Option columns missing name:",
          `property "name" is required at position ${i}`,
          "when column is an object literal",
        ]);
      }
      normalizedColumns[i] = column;
    } else {
      throw new CsvError("CSV_INVALID_COLUMN_DEFINITION", [
        "Invalid column definition:",
        "expect a string or a literal object,",
        `got ${JSON.stringify(column)} at position ${i}`,
      ]);
    }
  }
  return normalizedColumns;
};

class ResizeableBuffer {
  constructor(size = 100) {
    this.size = size;
    this.length = 0;
    this.buf = Buffer.allocUnsafe(size);
  }
  prepend(val) {
    if (Buffer.isBuffer(val)) {
      const length = this.length + val.length;
      if (length >= this.size) {
        this.resize();
        if (length >= this.size) {
          throw Error("INVALID_BUFFER_STATE");
        }
      }
      const buf = this.buf;
      this.buf = Buffer.allocUnsafe(this.size);
      val.copy(this.buf, 0);
      buf.copy(this.buf, val.length);
      this.length += val.length;
    } else {
      const length = this.length++;
      if (length === this.size) {
        this.resize();
      }
      const buf = this.clone();
      this.buf[0] = val;
      buf.copy(this.buf, 1, 0, length);
    }
  }
  append(val) {
    const length = this.length++;
    if (length === this.size) {
      this.resize();
    }
    this.buf[length] = val;
  }
  clone() {
    return Buffer.from(this.buf.slice(0, this.length));
  }
  resize() {
    const length = this.length;
    this.size = this.size * 2;
    const buf = Buffer.allocUnsafe(this.size);
    this.buf.copy(buf, 0, 0, length);
    this.buf = buf;
  }
  toString(encoding) {
    if (encoding) {
      return this.buf.slice(0, this.length).toString(encoding);
    } else {
      return Uint8Array.prototype.slice.call(this.buf.slice(0, this.length));
    }
  }
  toJSON() {
    return this.toString("utf8");
  }
  reset() {
    this.length = 0;
  }
}

// white space characters
// https://en.wikipedia.org/wiki/Whitespace_character
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes#Types
// \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff
const np = 12;
const cr$1 = 13; // `\r`, carriage return, 0x0D in hexadécimal, 13 in decimal
const nl$1 = 10; // `\n`, newline, 0x0A in hexadecimal, 10 in decimal
const space = 32;
const tab = 9;

const init_state = function (options) {
  return {
    bomSkipped: false,
    bufBytesStart: 0,
    castField: options.cast_function,
    commenting: false,
    // Current error encountered by a record
    error: undefined,
    enabled: options.from_line === 1,
    escaping: false,
    escapeIsQuote:
      Buffer.isBuffer(options.escape) &&
      Buffer.isBuffer(options.quote) &&
      Buffer.compare(options.escape, options.quote) === 0,
    // columns can be `false`, `true`, `Array`
    expectedRecordLength: Array.isArray(options.columns)
      ? options.columns.length
      : undefined,
    field: new ResizeableBuffer(20),
    firstLineToHeaders: options.cast_first_line_to_header,
    needMoreDataSize: Math.max(
      // Skip if the remaining buffer smaller than comment
      options.comment !== null ? options.comment.length : 0,
      // Skip if the remaining buffer can be delimiter
      ...options.delimiter.map((delimiter) => delimiter.length),
      // Skip if the remaining buffer can be escape sequence
      options.quote !== null ? options.quote.length : 0,
    ),
    previousBuf: undefined,
    quoting: false,
    stop: false,
    rawBuffer: new ResizeableBuffer(100),
    record: [],
    recordHasError: false,
    record_length: 0,
    recordDelimiterMaxLength:
      options.record_delimiter.length === 0
        ? 0
        : Math.max(...options.record_delimiter.map((v) => v.length)),
    trimChars: [
      Buffer.from(" ", options.encoding)[0],
      Buffer.from("\t", options.encoding)[0],
    ],
    wasQuoting: false,
    wasRowDelimiter: false,
    timchars: [
      Buffer.from(Buffer.from([cr$1], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([nl$1], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([np], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([space], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([tab], "utf8").toString(), options.encoding),
    ],
  };
};

const underscore = function (str) {
  return str.replace(/([A-Z])/g, function (_, match) {
    return "_" + match.toLowerCase();
  });
};

const normalize_options = function (opts) {
  const options = {};
  // Merge with user options
  for (const opt in opts) {
    options[underscore(opt)] = opts[opt];
  }
  // Normalize option `encoding`
  // Note: defined first because other options depends on it
  // to convert chars/strings into buffers.
  if (options.encoding === undefined || options.encoding === true) {
    options.encoding = "utf8";
  } else if (options.encoding === null || options.encoding === false) {
    options.encoding = null;
  } else if (
    typeof options.encoding !== "string" &&
    options.encoding !== null
  ) {
    throw new CsvError(
      "CSV_INVALID_OPTION_ENCODING",
      [
        "Invalid option encoding:",
        "encoding must be a string or null to return a buffer,",
        `got ${JSON.stringify(options.encoding)}`,
      ],
      options,
    );
  }
  // Normalize option `bom`
  if (
    options.bom === undefined ||
    options.bom === null ||
    options.bom === false
  ) {
    options.bom = false;
  } else if (options.bom !== true) {
    throw new CsvError(
      "CSV_INVALID_OPTION_BOM",
      [
        "Invalid option bom:",
        "bom must be true,",
        `got ${JSON.stringify(options.bom)}`,
      ],
      options,
    );
  }
  // Normalize option `cast`
  options.cast_function = null;
  if (
    options.cast === undefined ||
    options.cast === null ||
    options.cast === false ||
    options.cast === ""
  ) {
    options.cast = undefined;
  } else if (typeof options.cast === "function") {
    options.cast_function = options.cast;
    options.cast = true;
  } else if (options.cast !== true) {
    throw new CsvError(
      "CSV_INVALID_OPTION_CAST",
      [
        "Invalid option cast:",
        "cast must be true or a function,",
        `got ${JSON.stringify(options.cast)}`,
      ],
      options,
    );
  }
  // Normalize option `cast_date`
  if (
    options.cast_date === undefined ||
    options.cast_date === null ||
    options.cast_date === false ||
    options.cast_date === ""
  ) {
    options.cast_date = false;
  } else if (options.cast_date === true) {
    options.cast_date = function (value) {
      const date = Date.parse(value);
      return !isNaN(date) ? new Date(date) : value;
    };
  } else if (typeof options.cast_date !== "function") {
    throw new CsvError(
      "CSV_INVALID_OPTION_CAST_DATE",
      [
        "Invalid option cast_date:",
        "cast_date must be true or a function,",
        `got ${JSON.stringify(options.cast_date)}`,
      ],
      options,
    );
  }
  // Normalize option `columns`
  options.cast_first_line_to_header = null;
  if (options.columns === true) {
    // Fields in the first line are converted as-is to columns
    options.cast_first_line_to_header = undefined;
  } else if (typeof options.columns === "function") {
    options.cast_first_line_to_header = options.columns;
    options.columns = true;
  } else if (Array.isArray(options.columns)) {
    options.columns = normalize_columns_array(options.columns);
  } else if (
    options.columns === undefined ||
    options.columns === null ||
    options.columns === false
  ) {
    options.columns = false;
  } else {
    throw new CsvError(
      "CSV_INVALID_OPTION_COLUMNS",
      [
        "Invalid option columns:",
        "expect an array, a function or true,",
        `got ${JSON.stringify(options.columns)}`,
      ],
      options,
    );
  }
  // Normalize option `group_columns_by_name`
  if (
    options.group_columns_by_name === undefined ||
    options.group_columns_by_name === null ||
    options.group_columns_by_name === false
  ) {
    options.group_columns_by_name = false;
  } else if (options.group_columns_by_name !== true) {
    throw new CsvError(
      "CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME",
      [
        "Invalid option group_columns_by_name:",
        "expect an boolean,",
        `got ${JSON.stringify(options.group_columns_by_name)}`,
      ],
      options,
    );
  } else if (options.columns === false) {
    throw new CsvError(
      "CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME",
      [
        "Invalid option group_columns_by_name:",
        "the `columns` mode must be activated.",
      ],
      options,
    );
  }
  // Normalize option `comment`
  if (
    options.comment === undefined ||
    options.comment === null ||
    options.comment === false ||
    options.comment === ""
  ) {
    options.comment = null;
  } else {
    if (typeof options.comment === "string") {
      options.comment = Buffer.from(options.comment, options.encoding);
    }
    if (!Buffer.isBuffer(options.comment)) {
      throw new CsvError(
        "CSV_INVALID_OPTION_COMMENT",
        [
          "Invalid option comment:",
          "comment must be a buffer or a string,",
          `got ${JSON.stringify(options.comment)}`,
        ],
        options,
      );
    }
  }
  // Normalize option `comment_no_infix`
  if (
    options.comment_no_infix === undefined ||
    options.comment_no_infix === null ||
    options.comment_no_infix === false
  ) {
    options.comment_no_infix = false;
  } else if (options.comment_no_infix !== true) {
    throw new CsvError(
      "CSV_INVALID_OPTION_COMMENT",
      [
        "Invalid option comment_no_infix:",
        "value must be a boolean,",
        `got ${JSON.stringify(options.comment_no_infix)}`,
      ],
      options,
    );
  }
  // Normalize option `delimiter`
  const delimiter_json = JSON.stringify(options.delimiter);
  if (!Array.isArray(options.delimiter))
    options.delimiter = [options.delimiter];
  if (options.delimiter.length === 0) {
    throw new CsvError(
      "CSV_INVALID_OPTION_DELIMITER",
      [
        "Invalid option delimiter:",
        "delimiter must be a non empty string or buffer or array of string|buffer,",
        `got ${delimiter_json}`,
      ],
      options,
    );
  }
  options.delimiter = options.delimiter.map(function (delimiter) {
    if (delimiter === undefined || delimiter === null || delimiter === false) {
      return Buffer.from(",", options.encoding);
    }
    if (typeof delimiter === "string") {
      delimiter = Buffer.from(delimiter, options.encoding);
    }
    if (!Buffer.isBuffer(delimiter) || delimiter.length === 0) {
      throw new CsvError(
        "CSV_INVALID_OPTION_DELIMITER",
        [
          "Invalid option delimiter:",
          "delimiter must be a non empty string or buffer or array of string|buffer,",
          `got ${delimiter_json}`,
        ],
        options,
      );
    }
    return delimiter;
  });
  // Normalize option `escape`
  if (options.escape === undefined || options.escape === true) {
    options.escape = Buffer.from('"', options.encoding);
  } else if (typeof options.escape === "string") {
    options.escape = Buffer.from(options.escape, options.encoding);
  } else if (options.escape === null || options.escape === false) {
    options.escape = null;
  }
  if (options.escape !== null) {
    if (!Buffer.isBuffer(options.escape)) {
      throw new Error(
        `Invalid Option: escape must be a buffer, a string or a boolean, got ${JSON.stringify(options.escape)}`,
      );
    }
  }
  // Normalize option `from`
  if (options.from === undefined || options.from === null) {
    options.from = 1;
  } else {
    if (typeof options.from === "string" && /\d+/.test(options.from)) {
      options.from = parseInt(options.from);
    }
    if (Number.isInteger(options.from)) {
      if (options.from < 0) {
        throw new Error(
          `Invalid Option: from must be a positive integer, got ${JSON.stringify(opts.from)}`,
        );
      }
    } else {
      throw new Error(
        `Invalid Option: from must be an integer, got ${JSON.stringify(options.from)}`,
      );
    }
  }
  // Normalize option `from_line`
  if (options.from_line === undefined || options.from_line === null) {
    options.from_line = 1;
  } else {
    if (
      typeof options.from_line === "string" &&
      /\d+/.test(options.from_line)
    ) {
      options.from_line = parseInt(options.from_line);
    }
    if (Number.isInteger(options.from_line)) {
      if (options.from_line <= 0) {
        throw new Error(
          `Invalid Option: from_line must be a positive integer greater than 0, got ${JSON.stringify(opts.from_line)}`,
        );
      }
    } else {
      throw new Error(
        `Invalid Option: from_line must be an integer, got ${JSON.stringify(opts.from_line)}`,
      );
    }
  }
  // Normalize options `ignore_last_delimiters`
  if (
    options.ignore_last_delimiters === undefined ||
    options.ignore_last_delimiters === null
  ) {
    options.ignore_last_delimiters = false;
  } else if (typeof options.ignore_last_delimiters === "number") {
    options.ignore_last_delimiters = Math.floor(options.ignore_last_delimiters);
    if (options.ignore_last_delimiters === 0) {
      options.ignore_last_delimiters = false;
    }
  } else if (typeof options.ignore_last_delimiters !== "boolean") {
    throw new CsvError(
      "CSV_INVALID_OPTION_IGNORE_LAST_DELIMITERS",
      [
        "Invalid option `ignore_last_delimiters`:",
        "the value must be a boolean value or an integer,",
        `got ${JSON.stringify(options.ignore_last_delimiters)}`,
      ],
      options,
    );
  }
  if (options.ignore_last_delimiters === true && options.columns === false) {
    throw new CsvError(
      "CSV_IGNORE_LAST_DELIMITERS_REQUIRES_COLUMNS",
      [
        "The option `ignore_last_delimiters`",
        "requires the activation of the `columns` option",
      ],
      options,
    );
  }
  // Normalize option `info`
  if (
    options.info === undefined ||
    options.info === null ||
    options.info === false
  ) {
    options.info = false;
  } else if (options.info !== true) {
    throw new Error(
      `Invalid Option: info must be true, got ${JSON.stringify(options.info)}`,
    );
  }
  // Normalize option `max_record_size`
  if (
    options.max_record_size === undefined ||
    options.max_record_size === null ||
    options.max_record_size === false
  ) {
    options.max_record_size = 0;
  } else if (
    Number.isInteger(options.max_record_size) &&
    options.max_record_size >= 0
  ) ; else if (
    typeof options.max_record_size === "string" &&
    /\d+/.test(options.max_record_size)
  ) {
    options.max_record_size = parseInt(options.max_record_size);
  } else {
    throw new Error(
      `Invalid Option: max_record_size must be a positive integer, got ${JSON.stringify(options.max_record_size)}`,
    );
  }
  // Normalize option `objname`
  if (
    options.objname === undefined ||
    options.objname === null ||
    options.objname === false
  ) {
    options.objname = undefined;
  } else if (Buffer.isBuffer(options.objname)) {
    if (options.objname.length === 0) {
      throw new Error(`Invalid Option: objname must be a non empty buffer`);
    }
    if (options.encoding === null) ; else {
      options.objname = options.objname.toString(options.encoding);
    }
  } else if (typeof options.objname === "string") {
    if (options.objname.length === 0) {
      throw new Error(`Invalid Option: objname must be a non empty string`);
    }
    // Great, nothing to do
  } else if (typeof options.objname === "number") ; else {
    throw new Error(
      `Invalid Option: objname must be a string or a buffer, got ${options.objname}`,
    );
  }
  if (options.objname !== undefined) {
    if (typeof options.objname === "number") {
      if (options.columns !== false) {
        throw Error(
          "Invalid Option: objname index cannot be combined with columns or be defined as a field",
        );
      }
    } else {
      // A string or a buffer
      if (options.columns === false) {
        throw Error(
          "Invalid Option: objname field must be combined with columns or be defined as an index",
        );
      }
    }
  }
  // Normalize option `on_record`
  if (options.on_record === undefined || options.on_record === null) {
    options.on_record = undefined;
  } else if (typeof options.on_record !== "function") {
    throw new CsvError(
      "CSV_INVALID_OPTION_ON_RECORD",
      [
        "Invalid option `on_record`:",
        "expect a function,",
        `got ${JSON.stringify(options.on_record)}`,
      ],
      options,
    );
  }
  // Normalize option `on_skip`
  // options.on_skip ??= (err, chunk) => {
  //   this.emit('skip', err, chunk);
  // };
  if (
    options.on_skip !== undefined &&
    options.on_skip !== null &&
    typeof options.on_skip !== "function"
  ) {
    throw new Error(
      `Invalid Option: on_skip must be a function, got ${JSON.stringify(options.on_skip)}`,
    );
  }
  // Normalize option `quote`
  if (
    options.quote === null ||
    options.quote === false ||
    options.quote === ""
  ) {
    options.quote = null;
  } else {
    if (options.quote === undefined || options.quote === true) {
      options.quote = Buffer.from('"', options.encoding);
    } else if (typeof options.quote === "string") {
      options.quote = Buffer.from(options.quote, options.encoding);
    }
    if (!Buffer.isBuffer(options.quote)) {
      throw new Error(
        `Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`,
      );
    }
  }
  // Normalize option `raw`
  if (
    options.raw === undefined ||
    options.raw === null ||
    options.raw === false
  ) {
    options.raw = false;
  } else if (options.raw !== true) {
    throw new Error(
      `Invalid Option: raw must be true, got ${JSON.stringify(options.raw)}`,
    );
  }
  // Normalize option `record_delimiter`
  if (options.record_delimiter === undefined) {
    options.record_delimiter = [];
  } else if (
    typeof options.record_delimiter === "string" ||
    Buffer.isBuffer(options.record_delimiter)
  ) {
    if (options.record_delimiter.length === 0) {
      throw new CsvError(
        "CSV_INVALID_OPTION_RECORD_DELIMITER",
        [
          "Invalid option `record_delimiter`:",
          "value must be a non empty string or buffer,",
          `got ${JSON.stringify(options.record_delimiter)}`,
        ],
        options,
      );
    }
    options.record_delimiter = [options.record_delimiter];
  } else if (!Array.isArray(options.record_delimiter)) {
    throw new CsvError(
      "CSV_INVALID_OPTION_RECORD_DELIMITER",
      [
        "Invalid option `record_delimiter`:",
        "value must be a string, a buffer or array of string|buffer,",
        `got ${JSON.stringify(options.record_delimiter)}`,
      ],
      options,
    );
  }
  options.record_delimiter = options.record_delimiter.map(function (rd, i) {
    if (typeof rd !== "string" && !Buffer.isBuffer(rd)) {
      throw new CsvError(
        "CSV_INVALID_OPTION_RECORD_DELIMITER",
        [
          "Invalid option `record_delimiter`:",
          "value must be a string, a buffer or array of string|buffer",
          `at index ${i},`,
          `got ${JSON.stringify(rd)}`,
        ],
        options,
      );
    } else if (rd.length === 0) {
      throw new CsvError(
        "CSV_INVALID_OPTION_RECORD_DELIMITER",
        [
          "Invalid option `record_delimiter`:",
          "value must be a non empty string or buffer",
          `at index ${i},`,
          `got ${JSON.stringify(rd)}`,
        ],
        options,
      );
    }
    if (typeof rd === "string") {
      rd = Buffer.from(rd, options.encoding);
    }
    return rd;
  });
  // Normalize option `relax_column_count`
  if (typeof options.relax_column_count === "boolean") ; else if (
    options.relax_column_count === undefined ||
    options.relax_column_count === null
  ) {
    options.relax_column_count = false;
  } else {
    throw new Error(
      `Invalid Option: relax_column_count must be a boolean, got ${JSON.stringify(options.relax_column_count)}`,
    );
  }
  if (typeof options.relax_column_count_less === "boolean") ; else if (
    options.relax_column_count_less === undefined ||
    options.relax_column_count_less === null
  ) {
    options.relax_column_count_less = false;
  } else {
    throw new Error(
      `Invalid Option: relax_column_count_less must be a boolean, got ${JSON.stringify(options.relax_column_count_less)}`,
    );
  }
  if (typeof options.relax_column_count_more === "boolean") ; else if (
    options.relax_column_count_more === undefined ||
    options.relax_column_count_more === null
  ) {
    options.relax_column_count_more = false;
  } else {
    throw new Error(
      `Invalid Option: relax_column_count_more must be a boolean, got ${JSON.stringify(options.relax_column_count_more)}`,
    );
  }
  // Normalize option `relax_quotes`
  if (typeof options.relax_quotes === "boolean") ; else if (
    options.relax_quotes === undefined ||
    options.relax_quotes === null
  ) {
    options.relax_quotes = false;
  } else {
    throw new Error(
      `Invalid Option: relax_quotes must be a boolean, got ${JSON.stringify(options.relax_quotes)}`,
    );
  }
  // Normalize option `skip_empty_lines`
  if (typeof options.skip_empty_lines === "boolean") ; else if (
    options.skip_empty_lines === undefined ||
    options.skip_empty_lines === null
  ) {
    options.skip_empty_lines = false;
  } else {
    throw new Error(
      `Invalid Option: skip_empty_lines must be a boolean, got ${JSON.stringify(options.skip_empty_lines)}`,
    );
  }
  // Normalize option `skip_records_with_empty_values`
  if (typeof options.skip_records_with_empty_values === "boolean") ; else if (
    options.skip_records_with_empty_values === undefined ||
    options.skip_records_with_empty_values === null
  ) {
    options.skip_records_with_empty_values = false;
  } else {
    throw new Error(
      `Invalid Option: skip_records_with_empty_values must be a boolean, got ${JSON.stringify(options.skip_records_with_empty_values)}`,
    );
  }
  // Normalize option `skip_records_with_error`
  if (typeof options.skip_records_with_error === "boolean") ; else if (
    options.skip_records_with_error === undefined ||
    options.skip_records_with_error === null
  ) {
    options.skip_records_with_error = false;
  } else {
    throw new Error(
      `Invalid Option: skip_records_with_error must be a boolean, got ${JSON.stringify(options.skip_records_with_error)}`,
    );
  }
  // Normalize option `rtrim`
  if (
    options.rtrim === undefined ||
    options.rtrim === null ||
    options.rtrim === false
  ) {
    options.rtrim = false;
  } else if (options.rtrim !== true) {
    throw new Error(
      `Invalid Option: rtrim must be a boolean, got ${JSON.stringify(options.rtrim)}`,
    );
  }
  // Normalize option `ltrim`
  if (
    options.ltrim === undefined ||
    options.ltrim === null ||
    options.ltrim === false
  ) {
    options.ltrim = false;
  } else if (options.ltrim !== true) {
    throw new Error(
      `Invalid Option: ltrim must be a boolean, got ${JSON.stringify(options.ltrim)}`,
    );
  }
  // Normalize option `trim`
  if (
    options.trim === undefined ||
    options.trim === null ||
    options.trim === false
  ) {
    options.trim = false;
  } else if (options.trim !== true) {
    throw new Error(
      `Invalid Option: trim must be a boolean, got ${JSON.stringify(options.trim)}`,
    );
  }
  // Normalize options `trim`, `ltrim` and `rtrim`
  if (options.trim === true && opts.ltrim !== false) {
    options.ltrim = true;
  } else if (options.ltrim !== true) {
    options.ltrim = false;
  }
  if (options.trim === true && opts.rtrim !== false) {
    options.rtrim = true;
  } else if (options.rtrim !== true) {
    options.rtrim = false;
  }
  // Normalize option `to`
  if (options.to === undefined || options.to === null) {
    options.to = -1;
  } else {
    if (typeof options.to === "string" && /\d+/.test(options.to)) {
      options.to = parseInt(options.to);
    }
    if (Number.isInteger(options.to)) {
      if (options.to <= 0) {
        throw new Error(
          `Invalid Option: to must be a positive integer greater than 0, got ${JSON.stringify(opts.to)}`,
        );
      }
    } else {
      throw new Error(
        `Invalid Option: to must be an integer, got ${JSON.stringify(opts.to)}`,
      );
    }
  }
  // Normalize option `to_line`
  if (options.to_line === undefined || options.to_line === null) {
    options.to_line = -1;
  } else {
    if (typeof options.to_line === "string" && /\d+/.test(options.to_line)) {
      options.to_line = parseInt(options.to_line);
    }
    if (Number.isInteger(options.to_line)) {
      if (options.to_line <= 0) {
        throw new Error(
          `Invalid Option: to_line must be a positive integer greater than 0, got ${JSON.stringify(opts.to_line)}`,
        );
      }
    } else {
      throw new Error(
        `Invalid Option: to_line must be an integer, got ${JSON.stringify(opts.to_line)}`,
      );
    }
  }
  return options;
};

const isRecordEmpty = function (record) {
  return record.every(
    (field) =>
      field == null || (field.toString && field.toString().trim() === ""),
  );
};

const cr = 13; // `\r`, carriage return, 0x0D in hexadécimal, 13 in decimal
const nl = 10; // `\n`, newline, 0x0A in hexadecimal, 10 in decimal

const boms = {
  // Note, the following are equals:
  // Buffer.from("\ufeff")
  // Buffer.from([239, 187, 191])
  // Buffer.from('EFBBBF', 'hex')
  utf8: Buffer.from([239, 187, 191]),
  // Note, the following are equals:
  // Buffer.from "\ufeff", 'utf16le
  // Buffer.from([255, 254])
  utf16le: Buffer.from([255, 254]),
};

const transform = function (original_options = {}) {
  const info = {
    bytes: 0,
    comment_lines: 0,
    empty_lines: 0,
    invalid_field_length: 0,
    lines: 1,
    records: 0,
  };
  const options = normalize_options(original_options);
  return {
    info: info,
    original_options: original_options,
    options: options,
    state: init_state(options),
    __needMoreData: function (i, bufLen, end) {
      if (end) return false;
      const { encoding, escape, quote } = this.options;
      const { quoting, needMoreDataSize, recordDelimiterMaxLength } =
        this.state;
      const numOfCharLeft = bufLen - i - 1;
      const requiredLength = Math.max(
        needMoreDataSize,
        // Skip if the remaining buffer smaller than record delimiter
        // If "record_delimiter" is yet to be discovered:
        // 1. It is equals to `[]` and "recordDelimiterMaxLength" equals `0`
        // 2. We set the length to windows line ending in the current encoding
        // Note, that encoding is known from user or bom discovery at that point
        // recordDelimiterMaxLength,
        recordDelimiterMaxLength === 0
          ? Buffer.from("\r\n", encoding).length
          : recordDelimiterMaxLength,
        // Skip if remaining buffer can be an escaped quote
        quoting ? (escape === null ? 0 : escape.length) + quote.length : 0,
        // Skip if remaining buffer can be record delimiter following the closing quote
        quoting ? quote.length + recordDelimiterMaxLength : 0,
      );
      return numOfCharLeft < requiredLength;
    },
    // Central parser implementation
    parse: function (nextBuf, end, push, close) {
      const {
        bom,
        comment_no_infix,
        encoding,
        from_line,
        ltrim,
        max_record_size,
        raw,
        relax_quotes,
        rtrim,
        skip_empty_lines,
        to,
        to_line,
      } = this.options;
      let { comment, escape, quote, record_delimiter } = this.options;
      const { bomSkipped, previousBuf, rawBuffer, escapeIsQuote } = this.state;
      let buf;
      if (previousBuf === undefined) {
        if (nextBuf === undefined) {
          // Handle empty string
          close();
          return;
        } else {
          buf = nextBuf;
        }
      } else if (previousBuf !== undefined && nextBuf === undefined) {
        buf = previousBuf;
      } else {
        buf = Buffer.concat([previousBuf, nextBuf]);
      }
      // Handle UTF BOM
      if (bomSkipped === false) {
        if (bom === false) {
          this.state.bomSkipped = true;
        } else if (buf.length < 3) {
          // No enough data
          if (end === false) {
            // Wait for more data
            this.state.previousBuf = buf;
            return;
          }
        } else {
          for (const encoding in boms) {
            if (boms[encoding].compare(buf, 0, boms[encoding].length) === 0) {
              // Skip BOM
              const bomLength = boms[encoding].length;
              this.state.bufBytesStart += bomLength;
              buf = buf.slice(bomLength);
              // Renormalize original options with the new encoding
              this.options = normalize_options({
                ...this.original_options,
                encoding: encoding,
              });
              // Options will re-evaluate the Buffer with the new encoding
              ({ comment, escape, quote } = this.options);
              break;
            }
          }
          this.state.bomSkipped = true;
        }
      }
      const bufLen = buf.length;
      let pos;
      for (pos = 0; pos < bufLen; pos++) {
        // Ensure we get enough space to look ahead
        // There should be a way to move this out of the loop
        if (this.__needMoreData(pos, bufLen, end)) {
          break;
        }
        if (this.state.wasRowDelimiter === true) {
          this.info.lines++;
          this.state.wasRowDelimiter = false;
        }
        if (to_line !== -1 && this.info.lines > to_line) {
          this.state.stop = true;
          close();
          return;
        }
        // Auto discovery of record_delimiter, unix, mac and windows supported
        if (this.state.quoting === false && record_delimiter.length === 0) {
          const record_delimiterCount = this.__autoDiscoverRecordDelimiter(
            buf,
            pos,
          );
          if (record_delimiterCount) {
            record_delimiter = this.options.record_delimiter;
          }
        }
        const chr = buf[pos];
        if (raw === true) {
          rawBuffer.append(chr);
        }
        if (
          (chr === cr || chr === nl) &&
          this.state.wasRowDelimiter === false
        ) {
          this.state.wasRowDelimiter = true;
        }
        // Previous char was a valid escape char
        // treat the current char as a regular char
        if (this.state.escaping === true) {
          this.state.escaping = false;
        } else {
          // Escape is only active inside quoted fields
          // We are quoting, the char is an escape chr and there is a chr to escape
          // if(escape !== null && this.state.quoting === true && chr === escape && pos + 1 < bufLen){
          if (
            escape !== null &&
            this.state.quoting === true &&
            this.__isEscape(buf, pos, chr) &&
            pos + escape.length < bufLen
          ) {
            if (escapeIsQuote) {
              if (this.__isQuote(buf, pos + escape.length)) {
                this.state.escaping = true;
                pos += escape.length - 1;
                continue;
              }
            } else {
              this.state.escaping = true;
              pos += escape.length - 1;
              continue;
            }
          }
          // Not currently escaping and chr is a quote
          // TODO: need to compare bytes instead of single char
          if (this.state.commenting === false && this.__isQuote(buf, pos)) {
            if (this.state.quoting === true) {
              const nextChr = buf[pos + quote.length];
              const isNextChrTrimable =
                rtrim && this.__isCharTrimable(buf, pos + quote.length);
              const isNextChrComment =
                comment !== null &&
                this.__compareBytes(comment, buf, pos + quote.length, nextChr);
              const isNextChrDelimiter = this.__isDelimiter(
                buf,
                pos + quote.length,
                nextChr,
              );
              const isNextChrRecordDelimiter =
                record_delimiter.length === 0
                  ? this.__autoDiscoverRecordDelimiter(buf, pos + quote.length)
                  : this.__isRecordDelimiter(nextChr, buf, pos + quote.length);
              // Escape a quote
              // Treat next char as a regular character
              if (
                escape !== null &&
                this.__isEscape(buf, pos, chr) &&
                this.__isQuote(buf, pos + escape.length)
              ) {
                pos += escape.length - 1;
              } else if (
                !nextChr ||
                isNextChrDelimiter ||
                isNextChrRecordDelimiter ||
                isNextChrComment ||
                isNextChrTrimable
              ) {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                pos += quote.length - 1;
                continue;
              } else if (relax_quotes === false) {
                const err = this.__error(
                  new CsvError(
                    "CSV_INVALID_CLOSING_QUOTE",
                    [
                      "Invalid Closing Quote:",
                      `got "${String.fromCharCode(nextChr)}"`,
                      `at line ${this.info.lines}`,
                      "instead of delimiter, record delimiter, trimable character",
                      "(if activated) or comment",
                    ],
                    this.options,
                    this.__infoField(),
                  ),
                );
                if (err !== undefined) return err;
              } else {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                this.state.field.prepend(quote);
                pos += quote.length - 1;
              }
            } else {
              if (this.state.field.length !== 0) {
                // In relax_quotes mode, treat opening quote preceded by chrs as regular
                if (relax_quotes === false) {
                  const info = this.__infoField();
                  const bom = Object.keys(boms)
                    .map((b) =>
                      boms[b].equals(this.state.field.toString()) ? b : false,
                    )
                    .filter(Boolean)[0];
                  const err = this.__error(
                    new CsvError(
                      "INVALID_OPENING_QUOTE",
                      [
                        "Invalid Opening Quote:",
                        `a quote is found on field ${JSON.stringify(info.column)} at line ${info.lines}, value is ${JSON.stringify(this.state.field.toString(encoding))}`,
                        bom ? `(${bom} bom)` : undefined,
                      ],
                      this.options,
                      info,
                      {
                        field: this.state.field,
                      },
                    ),
                  );
                  if (err !== undefined) return err;
                }
              } else {
                this.state.quoting = true;
                pos += quote.length - 1;
                continue;
              }
            }
          }
          if (this.state.quoting === false) {
            const recordDelimiterLength = this.__isRecordDelimiter(
              chr,
              buf,
              pos,
            );
            if (recordDelimiterLength !== 0) {
              // Do not emit comments which take a full line
              const skipCommentLine =
                this.state.commenting &&
                this.state.wasQuoting === false &&
                this.state.record.length === 0 &&
                this.state.field.length === 0;
              if (skipCommentLine) {
                this.info.comment_lines++;
                // Skip full comment line
              } else {
                // Activate records emition if above from_line
                if (
                  this.state.enabled === false &&
                  this.info.lines +
                    (this.state.wasRowDelimiter === true ? 1 : 0) >=
                    from_line
                ) {
                  this.state.enabled = true;
                  this.__resetField();
                  this.__resetRecord();
                  pos += recordDelimiterLength - 1;
                  continue;
                }
                // Skip if line is empty and skip_empty_lines activated
                if (
                  skip_empty_lines === true &&
                  this.state.wasQuoting === false &&
                  this.state.record.length === 0 &&
                  this.state.field.length === 0
                ) {
                  this.info.empty_lines++;
                  pos += recordDelimiterLength - 1;
                  continue;
                }
                this.info.bytes = this.state.bufBytesStart + pos;
                const errField = this.__onField();
                if (errField !== undefined) return errField;
                this.info.bytes =
                  this.state.bufBytesStart + pos + recordDelimiterLength;
                const errRecord = this.__onRecord(push);
                if (errRecord !== undefined) return errRecord;
                if (to !== -1 && this.info.records >= to) {
                  this.state.stop = true;
                  close();
                  return;
                }
              }
              this.state.commenting = false;
              pos += recordDelimiterLength - 1;
              continue;
            }
            if (this.state.commenting) {
              continue;
            }
            if (
              comment !== null &&
              (comment_no_infix === false ||
                (this.state.record.length === 0 &&
                  this.state.field.length === 0))
            ) {
              const commentCount = this.__compareBytes(comment, buf, pos, chr);
              if (commentCount !== 0) {
                this.state.commenting = true;
                continue;
              }
            }
            const delimiterLength = this.__isDelimiter(buf, pos, chr);
            if (delimiterLength !== 0) {
              this.info.bytes = this.state.bufBytesStart + pos;
              const errField = this.__onField();
              if (errField !== undefined) return errField;
              pos += delimiterLength - 1;
              continue;
            }
          }
        }
        if (this.state.commenting === false) {
          if (
            max_record_size !== 0 &&
            this.state.record_length + this.state.field.length > max_record_size
          ) {
            return this.__error(
              new CsvError(
                "CSV_MAX_RECORD_SIZE",
                [
                  "Max Record Size:",
                  "record exceed the maximum number of tolerated bytes",
                  `of ${max_record_size}`,
                  `at line ${this.info.lines}`,
                ],
                this.options,
                this.__infoField(),
              ),
            );
          }
        }
        const lappend =
          ltrim === false ||
          this.state.quoting === true ||
          this.state.field.length !== 0 ||
          !this.__isCharTrimable(buf, pos);
        // rtrim in non quoting is handle in __onField
        const rappend = rtrim === false || this.state.wasQuoting === false;
        if (lappend === true && rappend === true) {
          this.state.field.append(chr);
        } else if (rtrim === true && !this.__isCharTrimable(buf, pos)) {
          return this.__error(
            new CsvError(
              "CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE",
              [
                "Invalid Closing Quote:",
                "found non trimable byte after quote",
                `at line ${this.info.lines}`,
              ],
              this.options,
              this.__infoField(),
            ),
          );
        } else {
          if (lappend === false) {
            pos += this.__isCharTrimable(buf, pos) - 1;
          }
          continue;
        }
      }
      if (end === true) {
        // Ensure we are not ending in a quoting state
        if (this.state.quoting === true) {
          const err = this.__error(
            new CsvError(
              "CSV_QUOTE_NOT_CLOSED",
              [
                "Quote Not Closed:",
                `the parsing is finished with an opening quote at line ${this.info.lines}`,
              ],
              this.options,
              this.__infoField(),
            ),
          );
          if (err !== undefined) return err;
        } else {
          // Skip last line if it has no characters
          if (
            this.state.wasQuoting === true ||
            this.state.record.length !== 0 ||
            this.state.field.length !== 0
          ) {
            this.info.bytes = this.state.bufBytesStart + pos;
            const errField = this.__onField();
            if (errField !== undefined) return errField;
            const errRecord = this.__onRecord(push);
            if (errRecord !== undefined) return errRecord;
          } else if (this.state.wasRowDelimiter === true) {
            this.info.empty_lines++;
          } else if (this.state.commenting === true) {
            this.info.comment_lines++;
          }
        }
      } else {
        this.state.bufBytesStart += pos;
        this.state.previousBuf = buf.slice(pos);
      }
      if (this.state.wasRowDelimiter === true) {
        this.info.lines++;
        this.state.wasRowDelimiter = false;
      }
    },
    __onRecord: function (push) {
      const {
        columns,
        group_columns_by_name,
        encoding,
        info,
        from,
        relax_column_count,
        relax_column_count_less,
        relax_column_count_more,
        raw,
        skip_records_with_empty_values,
      } = this.options;
      const { enabled, record } = this.state;
      if (enabled === false) {
        return this.__resetRecord();
      }
      // Convert the first line into column names
      const recordLength = record.length;
      if (columns === true) {
        if (skip_records_with_empty_values === true && isRecordEmpty(record)) {
          this.__resetRecord();
          return;
        }
        return this.__firstLineToColumns(record);
      }
      if (columns === false && this.info.records === 0) {
        this.state.expectedRecordLength = recordLength;
      }
      if (recordLength !== this.state.expectedRecordLength) {
        const err =
          columns === false
            ? new CsvError(
                "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
                [
                  "Invalid Record Length:",
                  `expect ${this.state.expectedRecordLength},`,
                  `got ${recordLength} on line ${this.info.lines}`,
                ],
                this.options,
                this.__infoField(),
                {
                  record: record,
                },
              )
            : new CsvError(
                "CSV_RECORD_INCONSISTENT_COLUMNS",
                [
                  "Invalid Record Length:",
                  `columns length is ${columns.length},`, // rename columns
                  `got ${recordLength} on line ${this.info.lines}`,
                ],
                this.options,
                this.__infoField(),
                {
                  record: record,
                },
              );
        if (
          relax_column_count === true ||
          (relax_column_count_less === true &&
            recordLength < this.state.expectedRecordLength) ||
          (relax_column_count_more === true &&
            recordLength > this.state.expectedRecordLength)
        ) {
          this.info.invalid_field_length++;
          this.state.error = err;
          // Error is undefined with skip_records_with_error
        } else {
          const finalErr = this.__error(err);
          if (finalErr) return finalErr;
        }
      }
      if (skip_records_with_empty_values === true && isRecordEmpty(record)) {
        this.__resetRecord();
        return;
      }
      if (this.state.recordHasError === true) {
        this.__resetRecord();
        this.state.recordHasError = false;
        return;
      }
      this.info.records++;
      if (from === 1 || this.info.records >= from) {
        const { objname } = this.options;
        // With columns, records are object
        if (columns !== false) {
          const obj = {};
          // Transform record array to an object
          for (let i = 0, l = record.length; i < l; i++) {
            if (columns[i] === undefined || columns[i].disabled) continue;
            // Turn duplicate columns into an array
            if (
              group_columns_by_name === true &&
              obj[columns[i].name] !== undefined
            ) {
              if (Array.isArray(obj[columns[i].name])) {
                obj[columns[i].name] = obj[columns[i].name].concat(record[i]);
              } else {
                obj[columns[i].name] = [obj[columns[i].name], record[i]];
              }
            } else {
              obj[columns[i].name] = record[i];
            }
          }
          // Without objname (default)
          if (raw === true || info === true) {
            const extRecord = Object.assign(
              { record: obj },
              raw === true
                ? { raw: this.state.rawBuffer.toString(encoding) }
                : {},
              info === true ? { info: this.__infoRecord() } : {},
            );
            const err = this.__push(
              objname === undefined ? extRecord : [obj[objname], extRecord],
              push,
            );
            if (err) {
              return err;
            }
          } else {
            const err = this.__push(
              objname === undefined ? obj : [obj[objname], obj],
              push,
            );
            if (err) {
              return err;
            }
          }
          // Without columns, records are array
        } else {
          if (raw === true || info === true) {
            const extRecord = Object.assign(
              { record: record },
              raw === true
                ? { raw: this.state.rawBuffer.toString(encoding) }
                : {},
              info === true ? { info: this.__infoRecord() } : {},
            );
            const err = this.__push(
              objname === undefined ? extRecord : [record[objname], extRecord],
              push,
            );
            if (err) {
              return err;
            }
          } else {
            const err = this.__push(
              objname === undefined ? record : [record[objname], record],
              push,
            );
            if (err) {
              return err;
            }
          }
        }
      }
      this.__resetRecord();
    },
    __firstLineToColumns: function (record) {
      const { firstLineToHeaders } = this.state;
      try {
        const headers =
          firstLineToHeaders === undefined
            ? record
            : firstLineToHeaders.call(null, record);
        if (!Array.isArray(headers)) {
          return this.__error(
            new CsvError(
              "CSV_INVALID_COLUMN_MAPPING",
              [
                "Invalid Column Mapping:",
                "expect an array from column function,",
                `got ${JSON.stringify(headers)}`,
              ],
              this.options,
              this.__infoField(),
              {
                headers: headers,
              },
            ),
          );
        }
        const normalizedHeaders = normalize_columns_array(headers);
        this.state.expectedRecordLength = normalizedHeaders.length;
        this.options.columns = normalizedHeaders;
        this.__resetRecord();
        return;
      } catch (err) {
        return err;
      }
    },
    __resetRecord: function () {
      if (this.options.raw === true) {
        this.state.rawBuffer.reset();
      }
      this.state.error = undefined;
      this.state.record = [];
      this.state.record_length = 0;
    },
    __onField: function () {
      const { cast, encoding, rtrim, max_record_size } = this.options;
      const { enabled, wasQuoting } = this.state;
      // Short circuit for the from_line options
      if (enabled === false) {
        return this.__resetField();
      }
      let field = this.state.field.toString(encoding);
      if (rtrim === true && wasQuoting === false) {
        field = field.trimRight();
      }
      if (cast === true) {
        const [err, f] = this.__cast(field);
        if (err !== undefined) return err;
        field = f;
      }
      this.state.record.push(field);
      // Increment record length if record size must not exceed a limit
      if (max_record_size !== 0 && typeof field === "string") {
        this.state.record_length += field.length;
      }
      this.__resetField();
    },
    __resetField: function () {
      this.state.field.reset();
      this.state.wasQuoting = false;
    },
    __push: function (record, push) {
      const { on_record } = this.options;
      if (on_record !== undefined) {
        const info = this.__infoRecord();
        try {
          record = on_record.call(null, record, info);
        } catch (err) {
          return err;
        }
        if (record === undefined || record === null) {
          return;
        }
      }
      push(record);
    },
    // Return a tuple with the error and the casted value
    __cast: function (field) {
      const { columns, relax_column_count } = this.options;
      const isColumns = Array.isArray(columns);
      // Dont loose time calling cast
      // because the final record is an object
      // and this field can't be associated to a key present in columns
      if (
        isColumns === true &&
        relax_column_count &&
        this.options.columns.length <= this.state.record.length
      ) {
        return [undefined, undefined];
      }
      if (this.state.castField !== null) {
        try {
          const info = this.__infoField();
          return [undefined, this.state.castField.call(null, field, info)];
        } catch (err) {
          return [err];
        }
      }
      if (this.__isFloat(field)) {
        return [undefined, parseFloat(field)];
      } else if (this.options.cast_date !== false) {
        const info = this.__infoField();
        return [undefined, this.options.cast_date.call(null, field, info)];
      }
      return [undefined, field];
    },
    // Helper to test if a character is a space or a line delimiter
    __isCharTrimable: function (buf, pos) {
      const isTrim = (buf, pos) => {
        const { timchars } = this.state;
        loop1: for (let i = 0; i < timchars.length; i++) {
          const timchar = timchars[i];
          for (let j = 0; j < timchar.length; j++) {
            if (timchar[j] !== buf[pos + j]) continue loop1;
          }
          return timchar.length;
        }
        return 0;
      };
      return isTrim(buf, pos);
    },
    // Keep it in case we implement the `cast_int` option
    // __isInt(value){
    //   // return Number.isInteger(parseInt(value))
    //   // return !isNaN( parseInt( obj ) );
    //   return /^(\-|\+)?[1-9][0-9]*$/.test(value)
    // }
    __isFloat: function (value) {
      return value - parseFloat(value) + 1 >= 0; // Borrowed from jquery
    },
    __compareBytes: function (sourceBuf, targetBuf, targetPos, firstByte) {
      if (sourceBuf[0] !== firstByte) return 0;
      const sourceLength = sourceBuf.length;
      for (let i = 1; i < sourceLength; i++) {
        if (sourceBuf[i] !== targetBuf[targetPos + i]) return 0;
      }
      return sourceLength;
    },
    __isDelimiter: function (buf, pos, chr) {
      const { delimiter, ignore_last_delimiters } = this.options;
      if (
        ignore_last_delimiters === true &&
        this.state.record.length === this.options.columns.length - 1
      ) {
        return 0;
      } else if (
        ignore_last_delimiters !== false &&
        typeof ignore_last_delimiters === "number" &&
        this.state.record.length === ignore_last_delimiters - 1
      ) {
        return 0;
      }
      loop1: for (let i = 0; i < delimiter.length; i++) {
        const del = delimiter[i];
        if (del[0] === chr) {
          for (let j = 1; j < del.length; j++) {
            if (del[j] !== buf[pos + j]) continue loop1;
          }
          return del.length;
        }
      }
      return 0;
    },
    __isRecordDelimiter: function (chr, buf, pos) {
      const { record_delimiter } = this.options;
      const recordDelimiterLength = record_delimiter.length;
      loop1: for (let i = 0; i < recordDelimiterLength; i++) {
        const rd = record_delimiter[i];
        const rdLength = rd.length;
        if (rd[0] !== chr) {
          continue;
        }
        for (let j = 1; j < rdLength; j++) {
          if (rd[j] !== buf[pos + j]) {
            continue loop1;
          }
        }
        return rd.length;
      }
      return 0;
    },
    __isEscape: function (buf, pos, chr) {
      const { escape } = this.options;
      if (escape === null) return false;
      const l = escape.length;
      if (escape[0] === chr) {
        for (let i = 0; i < l; i++) {
          if (escape[i] !== buf[pos + i]) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    __isQuote: function (buf, pos) {
      const { quote } = this.options;
      if (quote === null) return false;
      const l = quote.length;
      for (let i = 0; i < l; i++) {
        if (quote[i] !== buf[pos + i]) {
          return false;
        }
      }
      return true;
    },
    __autoDiscoverRecordDelimiter: function (buf, pos) {
      const { encoding } = this.options;
      // Note, we don't need to cache this information in state,
      // It is only called on the first line until we find out a suitable
      // record delimiter.
      const rds = [
        // Important, the windows line ending must be before mac os 9
        Buffer.from("\r\n", encoding),
        Buffer.from("\n", encoding),
        Buffer.from("\r", encoding),
      ];
      loop: for (let i = 0; i < rds.length; i++) {
        const l = rds[i].length;
        for (let j = 0; j < l; j++) {
          if (rds[i][j] !== buf[pos + j]) {
            continue loop;
          }
        }
        this.options.record_delimiter.push(rds[i]);
        this.state.recordDelimiterMaxLength = rds[i].length;
        return rds[i].length;
      }
      return 0;
    },
    __error: function (msg) {
      const { encoding, raw, skip_records_with_error } = this.options;
      const err = typeof msg === "string" ? new Error(msg) : msg;
      if (skip_records_with_error) {
        this.state.recordHasError = true;
        if (this.options.on_skip !== undefined) {
          this.options.on_skip(
            err,
            raw ? this.state.rawBuffer.toString(encoding) : undefined,
          );
        }
        // this.emit('skip', err, raw ? this.state.rawBuffer.toString(encoding) : undefined);
        return undefined;
      } else {
        return err;
      }
    },
    __infoDataSet: function () {
      return {
        ...this.info,
        columns: this.options.columns,
      };
    },
    __infoRecord: function () {
      const { columns, raw, encoding } = this.options;
      return {
        ...this.__infoDataSet(),
        error: this.state.error,
        header: columns === true,
        index: this.state.record.length,
        raw: raw ? this.state.rawBuffer.toString(encoding) : undefined,
      };
    },
    __infoField: function () {
      const { columns } = this.options;
      const isColumns = Array.isArray(columns);
      return {
        ...this.__infoRecord(),
        column:
          isColumns === true
            ? columns.length > this.state.record.length
              ? columns[this.state.record.length].name
              : null
            : this.state.record.length,
        quoting: this.state.wasQuoting,
      };
    },
  };
};

const parse = function (data, opts = {}) {
  if (typeof data === "string") {
    data = Buffer.from(data);
  }
  const records = opts && opts.objname ? {} : [];
  const parser = transform(opts);
  const push = (record) => {
    if (parser.options.objname === undefined) records.push(record);
    else {
      records[record[0]] = record[1];
    }
  };
  const close = () => {};
  const err1 = parser.parse(data, false, push, close);
  if (err1 !== undefined) throw err1;
  const err2 = parser.parse(undefined, true, push, close);
  if (err2 !== undefined) throw err2;
  return records;
};

exports.CsvError = CsvError;
exports.parse = parse;


/***/ }),

/***/ "./node_modules/csv-stringify/dist/cjs/sync.cjs":
/*!******************************************************!*\
  !*** ./node_modules/csv-stringify/dist/cjs/sync.cjs ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {



// Lodash implementation of `get`

const charCodeOfDot = ".".charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  "[^.[\\]]+" +
    "|" +
    // Or match property names within brackets.
    "\\[(?:" +
    // Match a non-string expression.
    "([^\"'][^[]*)" +
    "|" +
    // Or match strings (supports escaping characters).
    "([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2" +
    ")\\]" +
    "|" +
    // Or match "" as the space between consecutive dots or empty brackets.
    "(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))",
  "g",
);
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/;

const getTag = function (value) {
  return Object.prototype.toString.call(value);
};

const isSymbol = function (value) {
  const type = typeof value;
  return (
    type === "symbol" ||
    (type === "object" && value && getTag(value) === "[object Symbol]")
  );
};

const isKey = function (value, object) {
  if (Array.isArray(value)) {
    return false;
  }
  const type = typeof value;
  if (
    type === "number" ||
    type === "symbol" ||
    type === "boolean" ||
    !value ||
    isSymbol(value)
  ) {
    return true;
  }
  return (
    reIsPlainProp.test(value) ||
    !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
  );
};

const stringToPath = function (string) {
  const result = [];
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push("");
  }
  string.replace(rePropName, function (match, expression, quote, subString) {
    let key = match;
    if (quote) {
      key = subString.replace(reEscapeChar, "$1");
    } else if (expression) {
      key = expression.trim();
    }
    result.push(key);
  });
  return result;
};

const castPath = function (value, object) {
  if (Array.isArray(value)) {
    return value;
  } else {
    return isKey(value, object) ? [value] : stringToPath(value);
  }
};

const toKey = function (value) {
  if (typeof value === "string" || isSymbol(value)) return value;
  const result = `${value}`;
  // eslint-disable-next-line
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
};

const get = function (object, path) {
  path = castPath(path, object);
  let index = 0;
  const length = path.length;
  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index === length ? object : undefined;
};

const is_object = function (obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};

const normalize_columns = function (columns) {
  if (columns === undefined || columns === null) {
    return [undefined, undefined];
  }
  if (typeof columns !== "object") {
    return [Error('Invalid option "columns": expect an array or an object')];
  }
  if (!Array.isArray(columns)) {
    const newcolumns = [];
    for (const k in columns) {
      newcolumns.push({
        key: k,
        header: columns[k],
      });
    }
    columns = newcolumns;
  } else {
    const newcolumns = [];
    for (const column of columns) {
      if (typeof column === "string") {
        newcolumns.push({
          key: column,
          header: column,
        });
      } else if (
        typeof column === "object" &&
        column !== null &&
        !Array.isArray(column)
      ) {
        if (!column.key) {
          return [
            Error('Invalid column definition: property "key" is required'),
          ];
        }
        if (column.header === undefined) {
          column.header = column.key;
        }
        newcolumns.push(column);
      } else {
        return [
          Error("Invalid column definition: expect a string or an object"),
        ];
      }
    }
    columns = newcolumns;
  }
  return [undefined, columns];
};

class CsvError extends Error {
  constructor(code, message, ...contexts) {
    if (Array.isArray(message)) message = message.join(" ");
    super(message);
    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, CsvError);
    }
    this.code = code;
    for (const context of contexts) {
      for (const key in context) {
        const value = context[key];
        this[key] = Buffer.isBuffer(value)
          ? value.toString()
          : value == null
            ? value
            : JSON.parse(JSON.stringify(value));
      }
    }
  }
}

const underscore = function (str) {
  return str.replace(/([A-Z])/g, function (_, match) {
    return "_" + match.toLowerCase();
  });
};

const normalize_options = function (opts) {
  const options = {};
  // Merge with user options
  for (const opt in opts) {
    options[underscore(opt)] = opts[opt];
  }
  // Normalize option `bom`
  if (
    options.bom === undefined ||
    options.bom === null ||
    options.bom === false
  ) {
    options.bom = false;
  } else if (options.bom !== true) {
    return [
      new CsvError("CSV_OPTION_BOOLEAN_INVALID_TYPE", [
        "option `bom` is optional and must be a boolean value,",
        `got ${JSON.stringify(options.bom)}`,
      ]),
    ];
  }
  // Normalize option `delimiter`
  if (options.delimiter === undefined || options.delimiter === null) {
    options.delimiter = ",";
  } else if (Buffer.isBuffer(options.delimiter)) {
    options.delimiter = options.delimiter.toString();
  } else if (typeof options.delimiter !== "string") {
    return [
      new CsvError("CSV_OPTION_DELIMITER_INVALID_TYPE", [
        "option `delimiter` must be a buffer or a string,",
        `got ${JSON.stringify(options.delimiter)}`,
      ]),
    ];
  }
  // Normalize option `quote`
  if (options.quote === undefined || options.quote === null) {
    options.quote = '"';
  } else if (options.quote === true) {
    options.quote = '"';
  } else if (options.quote === false) {
    options.quote = "";
  } else if (Buffer.isBuffer(options.quote)) {
    options.quote = options.quote.toString();
  } else if (typeof options.quote !== "string") {
    return [
      new CsvError("CSV_OPTION_QUOTE_INVALID_TYPE", [
        "option `quote` must be a boolean, a buffer or a string,",
        `got ${JSON.stringify(options.quote)}`,
      ]),
    ];
  }
  // Normalize option `quoted`
  if (options.quoted === undefined || options.quoted === null) {
    options.quoted = false;
  }
  // Normalize option `escape_formulas`
  if (
    options.escape_formulas === undefined ||
    options.escape_formulas === null
  ) {
    options.escape_formulas = false;
  } else if (typeof options.escape_formulas !== "boolean") {
    return [
      new CsvError("CSV_OPTION_ESCAPE_FORMULAS_INVALID_TYPE", [
        "option `escape_formulas` must be a boolean,",
        `got ${JSON.stringify(options.escape_formulas)}`,
      ]),
    ];
  }
  // Normalize option `quoted_empty`
  if (options.quoted_empty === undefined || options.quoted_empty === null) {
    options.quoted_empty = undefined;
  }
  // Normalize option `quoted_match`
  if (
    options.quoted_match === undefined ||
    options.quoted_match === null ||
    options.quoted_match === false
  ) {
    options.quoted_match = null;
  } else if (!Array.isArray(options.quoted_match)) {
    options.quoted_match = [options.quoted_match];
  }
  if (options.quoted_match) {
    for (const quoted_match of options.quoted_match) {
      const isString = typeof quoted_match === "string";
      const isRegExp = quoted_match instanceof RegExp;
      if (!isString && !isRegExp) {
        return [
          Error(
            `Invalid Option: quoted_match must be a string or a regex, got ${JSON.stringify(quoted_match)}`,
          ),
        ];
      }
    }
  }
  // Normalize option `quoted_string`
  if (options.quoted_string === undefined || options.quoted_string === null) {
    options.quoted_string = false;
  }
  // Normalize option `eof`
  if (options.eof === undefined || options.eof === null) {
    options.eof = true;
  }
  // Normalize option `escape`
  if (options.escape === undefined || options.escape === null) {
    options.escape = '"';
  } else if (Buffer.isBuffer(options.escape)) {
    options.escape = options.escape.toString();
  } else if (typeof options.escape !== "string") {
    return [
      Error(
        `Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(options.escape)}`,
      ),
    ];
  }
  if (options.escape.length > 1) {
    return [
      Error(
        `Invalid Option: escape must be one character, got ${options.escape.length} characters`,
      ),
    ];
  }
  // Normalize option `header`
  if (options.header === undefined || options.header === null) {
    options.header = false;
  }
  // Normalize option `columns`
  const [errColumns, columns] = normalize_columns(options.columns);
  if (errColumns !== undefined) return [errColumns];
  options.columns = columns;
  // Normalize option `quoted`
  if (options.quoted === undefined || options.quoted === null) {
    options.quoted = false;
  }
  // Normalize option `cast`
  if (options.cast === undefined || options.cast === null) {
    options.cast = {};
  }
  // Normalize option cast.bigint
  if (options.cast.bigint === undefined || options.cast.bigint === null) {
    // Cast boolean to string by default
    options.cast.bigint = (value) => "" + value;
  }
  // Normalize option cast.boolean
  if (options.cast.boolean === undefined || options.cast.boolean === null) {
    // Cast boolean to string by default
    options.cast.boolean = (value) => (value ? "1" : "");
  }
  // Normalize option cast.date
  if (options.cast.date === undefined || options.cast.date === null) {
    // Cast date to timestamp string by default
    options.cast.date = (value) => "" + value.getTime();
  }
  // Normalize option cast.number
  if (options.cast.number === undefined || options.cast.number === null) {
    // Cast number to string using native casting by default
    options.cast.number = (value) => "" + value;
  }
  // Normalize option cast.object
  if (options.cast.object === undefined || options.cast.object === null) {
    // Stringify object as JSON by default
    options.cast.object = (value) => JSON.stringify(value);
  }
  // Normalize option cast.string
  if (options.cast.string === undefined || options.cast.string === null) {
    // Leave string untouched
    options.cast.string = function (value) {
      return value;
    };
  }
  // Normalize option `on_record`
  if (
    options.on_record !== undefined &&
    typeof options.on_record !== "function"
  ) {
    return [Error(`Invalid Option: "on_record" must be a function.`)];
  }
  // Normalize option `record_delimiter`
  if (
    options.record_delimiter === undefined ||
    options.record_delimiter === null
  ) {
    options.record_delimiter = "\n";
  } else if (Buffer.isBuffer(options.record_delimiter)) {
    options.record_delimiter = options.record_delimiter.toString();
  } else if (typeof options.record_delimiter !== "string") {
    return [
      Error(
        `Invalid Option: record_delimiter must be a buffer or a string, got ${JSON.stringify(options.record_delimiter)}`,
      ),
    ];
  }
  switch (options.record_delimiter) {
    case "unix":
      options.record_delimiter = "\n";
      break;
    case "mac":
      options.record_delimiter = "\r";
      break;
    case "windows":
      options.record_delimiter = "\r\n";
      break;
    case "ascii":
      options.record_delimiter = "\u001e";
      break;
    case "unicode":
      options.record_delimiter = "\u2028";
      break;
  }
  return [undefined, options];
};

const bom_utf8 = Buffer.from([239, 187, 191]);

const stringifier = function (options, state, info) {
  return {
    options: options,
    state: state,
    info: info,
    __transform: function (chunk, push) {
      // Chunk validation
      if (!Array.isArray(chunk) && typeof chunk !== "object") {
        return Error(
          `Invalid Record: expect an array or an object, got ${JSON.stringify(chunk)}`,
        );
      }
      // Detect columns from the first record
      if (this.info.records === 0) {
        if (Array.isArray(chunk)) {
          if (
            this.options.header === true &&
            this.options.columns === undefined
          ) {
            return Error(
              "Undiscoverable Columns: header option requires column option or object records",
            );
          }
        } else if (this.options.columns === undefined) {
          const [err, columns] = normalize_columns(Object.keys(chunk));
          if (err) return;
          this.options.columns = columns;
        }
      }
      // Emit the header
      if (this.info.records === 0) {
        this.bom(push);
        const err = this.headers(push);
        if (err) return err;
      }
      // Emit and stringify the record if an object or an array
      try {
        // this.emit('record', chunk, this.info.records);
        if (this.options.on_record) {
          this.options.on_record(chunk, this.info.records);
        }
      } catch (err) {
        return err;
      }
      // Convert the record into a string
      let err, chunk_string;
      if (this.options.eof) {
        [err, chunk_string] = this.stringify(chunk);
        if (err) return err;
        if (chunk_string === undefined) {
          return;
        } else {
          chunk_string = chunk_string + this.options.record_delimiter;
        }
      } else {
        [err, chunk_string] = this.stringify(chunk);
        if (err) return err;
        if (chunk_string === undefined) {
          return;
        } else {
          if (this.options.header || this.info.records) {
            chunk_string = this.options.record_delimiter + chunk_string;
          }
        }
      }
      // Emit the csv
      this.info.records++;
      push(chunk_string);
    },
    stringify: function (chunk, chunkIsHeader = false) {
      if (typeof chunk !== "object") {
        return [undefined, chunk];
      }
      const { columns } = this.options;
      const record = [];
      // Record is an array
      if (Array.isArray(chunk)) {
        // We are getting an array but the user has specified output columns. In
        // this case, we respect the columns indexes
        if (columns) {
          chunk.splice(columns.length);
        }
        // Cast record elements
        for (let i = 0; i < chunk.length; i++) {
          const field = chunk[i];
          const [err, value] = this.__cast(field, {
            index: i,
            column: i,
            records: this.info.records,
            header: chunkIsHeader,
          });
          if (err) return [err];
          record[i] = [value, field];
        }
        // Record is a literal object
        // `columns` is always defined: it is either provided or discovered.
      } else {
        for (let i = 0; i < columns.length; i++) {
          const field = get(chunk, columns[i].key);
          const [err, value] = this.__cast(field, {
            index: i,
            column: columns[i].key,
            records: this.info.records,
            header: chunkIsHeader,
          });
          if (err) return [err];
          record[i] = [value, field];
        }
      }
      let csvrecord = "";
      for (let i = 0; i < record.length; i++) {
        let options, err;

        let [value, field] = record[i];
        if (typeof value === "string") {
          options = this.options;
        } else if (is_object(value)) {
          options = value;
          value = options.value;
          delete options.value;
          if (
            typeof value !== "string" &&
            value !== undefined &&
            value !== null
          ) {
            if (err)
              return [
                Error(
                  `Invalid Casting Value: returned value must return a string, null or undefined, got ${JSON.stringify(value)}`,
                ),
              ];
          }
          options = { ...this.options, ...options };
          [err, options] = normalize_options(options);
          if (err !== undefined) {
            return [err];
          }
        } else if (value === undefined || value === null) {
          options = this.options;
        } else {
          return [
            Error(
              `Invalid Casting Value: returned value must return a string, an object, null or undefined, got ${JSON.stringify(value)}`,
            ),
          ];
        }
        const {
          delimiter,
          escape,
          quote,
          quoted,
          quoted_empty,
          quoted_string,
          quoted_match,
          record_delimiter,
          escape_formulas,
        } = options;
        if ("" === value && "" === field) {
          let quotedMatch =
            quoted_match &&
            quoted_match.filter((quoted_match) => {
              if (typeof quoted_match === "string") {
                return value.indexOf(quoted_match) !== -1;
              } else {
                return quoted_match.test(value);
              }
            });
          quotedMatch = quotedMatch && quotedMatch.length > 0;
          const shouldQuote =
            quotedMatch ||
            true === quoted_empty ||
            (true === quoted_string && false !== quoted_empty);
          if (shouldQuote === true) {
            value = quote + value + quote;
          }
          csvrecord += value;
        } else if (value) {
          if (typeof value !== "string") {
            return [
              Error(
                `Formatter must return a string, null or undefined, got ${JSON.stringify(value)}`,
              ),
            ];
          }
          const containsdelimiter =
            delimiter.length && value.indexOf(delimiter) >= 0;
          const containsQuote = quote !== "" && value.indexOf(quote) >= 0;
          const containsEscape = value.indexOf(escape) >= 0 && escape !== quote;
          const containsRecordDelimiter = value.indexOf(record_delimiter) >= 0;
          const quotedString = quoted_string && typeof field === "string";
          let quotedMatch =
            quoted_match &&
            quoted_match.filter((quoted_match) => {
              if (typeof quoted_match === "string") {
                return value.indexOf(quoted_match) !== -1;
              } else {
                return quoted_match.test(value);
              }
            });
          quotedMatch = quotedMatch && quotedMatch.length > 0;
          // See https://github.com/adaltas/node-csv/pull/387
          // More about CSV injection or formula injection, when websites embed
          // untrusted input inside CSV files:
          // https://owasp.org/www-community/attacks/CSV_Injection
          // http://georgemauer.net/2017/10/07/csv-injection.html
          // Apple Numbers unicode normalization is empirical from testing
          if (escape_formulas) {
            switch (value[0]) {
              case "=":
              case "+":
              case "-":
              case "@":
              case "\t":
              case "\r":
              case "\uFF1D": // Unicode '='
              case "\uFF0B": // Unicode '+'
              case "\uFF0D": // Unicode '-'
              case "\uFF20": // Unicode '@'
                value = `'${value}`;
                break;
            }
          }
          const shouldQuote =
            containsQuote === true ||
            containsdelimiter ||
            containsRecordDelimiter ||
            quoted ||
            quotedString ||
            quotedMatch;
          if (shouldQuote === true && containsEscape === true) {
            const regexp =
              escape === "\\"
                ? new RegExp(escape + escape, "g")
                : new RegExp(escape, "g");
            value = value.replace(regexp, escape + escape);
          }
          if (containsQuote === true) {
            const regexp = new RegExp(quote, "g");
            value = value.replace(regexp, escape + quote);
          }
          if (shouldQuote === true) {
            value = quote + value + quote;
          }
          csvrecord += value;
        } else if (
          quoted_empty === true ||
          (field === "" && quoted_string === true && quoted_empty !== false)
        ) {
          csvrecord += quote + quote;
        }
        if (i !== record.length - 1) {
          csvrecord += delimiter;
        }
      }
      return [undefined, csvrecord];
    },
    bom: function (push) {
      if (this.options.bom !== true) {
        return;
      }
      push(bom_utf8);
    },
    headers: function (push) {
      if (this.options.header === false) {
        return;
      }
      if (this.options.columns === undefined) {
        return;
      }
      let err;
      let headers = this.options.columns.map((column) => column.header);
      if (this.options.eof) {
        [err, headers] = this.stringify(headers, true);
        headers += this.options.record_delimiter;
      } else {
        [err, headers] = this.stringify(headers);
      }
      if (err) return err;
      push(headers);
    },
    __cast: function (value, context) {
      const type = typeof value;
      try {
        if (type === "string") {
          // Fine for 99% of the cases
          return [undefined, this.options.cast.string(value, context)];
        } else if (type === "bigint") {
          return [undefined, this.options.cast.bigint(value, context)];
        } else if (type === "number") {
          return [undefined, this.options.cast.number(value, context)];
        } else if (type === "boolean") {
          return [undefined, this.options.cast.boolean(value, context)];
        } else if (value instanceof Date) {
          return [undefined, this.options.cast.date(value, context)];
        } else if (type === "object" && value !== null) {
          return [undefined, this.options.cast.object(value, context)];
        } else {
          return [undefined, value, value];
        }
      } catch (err) {
        return [err];
      }
    },
  };
};

const stringify = function (records, opts = {}) {
  const data = [];
  const [err, options] = normalize_options(opts);
  if (err !== undefined) throw err;
  const state = {
    stop: false,
  };
  // Information
  const info = {
    records: 0,
  };
  const api = stringifier(options, state, info);
  for (const record of records) {
    const err = api.__transform(record, function (record) {
      data.push(record);
    });
    if (err !== undefined) throw err;
  }
  if (data.length === 0) {
    api.bom((d) => {
      data.push(d);
    });
    const err = api.headers((headers) => {
      data.push(headers);
    });
    if (err !== undefined) throw err;
  }
  return data.join("");
};

exports.stringify = stringify;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/renderer.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFNBQVMsaUJBQWlCLFNBQVM7QUFDMUQ7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsOEJBQThCLElBQUksOEJBQThCO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsYUFBYTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSSxtQkFBbUIsSUFBSSxDQUFFO0FBQzdDLGdCQUFnQixLQUFJLHVCQUF1QixDQUFFO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELGdCQUFnQjtBQUMzRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixLQUFJLGVBQWUsQ0FBRTtBQUM5QyxpQ0FBaUMsS0FBSSx1QkFBdUIsQ0FBRTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxPQUFPO0FBQ2pCO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsT0FBTztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJO0FBQ1osNENBQTRDLFlBQVk7QUFDeEQ7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLFFBQVEsSUFBSTtBQUNaLCtDQUErQyxZQUFZO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxZQUFZO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSx1QkFBdUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsSUFBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSx1QkFBdUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsSUFBSTtBQUNqQjtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsMERBQTBELFdBQVc7QUFDckU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsV0FBVyxJQUFJLG1CQUFtQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLDJDQUEyQyxZQUFZLElBQUksaUJBQWlCO0FBQzVFO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDO0FBQ2pDLHdCQUF3QjtBQUN4Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCO0FBQzlCLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQiwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTywrRkFBK0YsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxLQUFLLFdBQVcsWUFBWSxNQUFNLE9BQU8scUJBQXFCLG9CQUFvQixxQkFBcUIscUJBQXFCLE1BQU0sTUFBTSxXQUFXLE1BQU0sWUFBWSxNQUFNLE1BQU0scUJBQXFCLHFCQUFxQixxQkFBcUIsVUFBVSxvQkFBb0IscUJBQXFCLHFCQUFxQixxQkFBcUIscUJBQXFCLE1BQU0sT0FBTyxNQUFNLEtBQUssb0JBQW9CLHFCQUFxQixNQUFNLFFBQVEsTUFBTSxLQUFLLG9CQUFvQixvQkFBb0IscUJBQXFCLE1BQU0sTUFBTSxNQUFNLEtBQUssV0FBVyxXQUFXLE1BQU0sTUFBTSxNQUFNLFVBQVUsV0FBVyxXQUFXLE1BQU0sTUFBTSxNQUFNLEtBQUssVUFBVSxXQUFXLE1BQU0sTUFBTSxNQUFNLE1BQU0sV0FBVyxNQUFNLFNBQVMsTUFBTSxRQUFRLHFCQUFxQixxQkFBcUIscUJBQXFCLG9CQUFvQixNQUFNLE1BQU0sTUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLE1BQU0sTUFBTSxVQUFVLFVBQVUsV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sUUFBUSxNQUFNLEtBQUssb0JBQW9CLHFCQUFxQixxQkFBcUIsTUFBTSxRQUFRLE1BQU0sU0FBUyxxQkFBcUIscUJBQXFCLHFCQUFxQixvQkFBb0IscUJBQXFCLHFCQUFxQixxQkFBcUIsb0JBQW9CLG9CQUFvQixvQkFBb0IsTUFBTSxNQUFNLE1BQU0sTUFBTSxXQUFXLE1BQU0sT0FBTyxNQUFNLFFBQVEscUJBQXFCLHFCQUFxQixxQkFBcUIsTUFBTSxNQUFNLE1BQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxNQUFNLEtBQUssV0FBVyxNQUFNLE1BQU0sTUFBTSxLQUFLLFdBQVcsTUFBTSxNQUFNLE1BQU0sTUFBTSxVQUFVLE1BQU0sT0FBTyxNQUFNLEtBQUsscUJBQXFCLHFCQUFxQixNQUFNLE1BQU0sTUFBTSxLQUFLLFdBQVcsTUFBTSxPQUFPLE1BQU0sS0FBSyxxQkFBcUIsb0JBQW9CLE1BQU0sTUFBTSxNQUFNLEtBQUssV0FBVyxNQUFNLE1BQU0sTUFBTSxpQkFBaUIsVUFBVSxNQUFNLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sT0FBTyxXQUFXLFVBQVUsVUFBVSxNQUFNLE1BQU0sS0FBSyxLQUFLLFVBQVUsTUFBTSxNQUFNLE1BQU0sS0FBSyxXQUFXLE1BQU0sT0FBTyxNQUFNLEtBQUssb0JBQW9CLG9CQUFvQixNQUFNLE1BQU0sb0JBQW9CLG9CQUFvQixNQUFNLE1BQU0sTUFBTSxNQUFNLFVBQVUsTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFVLE1BQU0sUUFBUSxNQUFNLFlBQVksb0JBQW9CLHFCQUFxQixNQUFNLE1BQU0sTUFBTSxNQUFNLFVBQVUsVUFBVSxNQUFNLFdBQVcsS0FBSyxVQUFVLEtBQUssS0FBSyxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLEtBQUssT0FBTyxPQUFPLEtBQUssWUFBWSxNQUFNLE9BQU8sTUFBTSxXQUFXLFlBQVksWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsTUFBTSxPQUFPLE1BQU0sWUFBWSxNQUFNLE9BQU8sTUFBTSxZQUFZLGFBQWEsYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLFlBQVksTUFBTSxPQUFPLE1BQU0sWUFBWSxhQUFhLE1BQU0sT0FBTyxNQUFNLFlBQVksYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsTUFBTSxPQUFPLE1BQU0sWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sT0FBTyxNQUFNLFdBQVcsWUFBWSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLGFBQWEsWUFBWSxhQUFhLGFBQWEsTUFBTSxPQUFPLFlBQVksWUFBWSxNQUFNLE1BQU0sV0FBVyxZQUFZLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sT0FBTyxNQUFNLFlBQVksTUFBTSxPQUFPLE1BQU0sWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sT0FBTyxNQUFNLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sT0FBTyxNQUFNLFdBQVcsWUFBWSxZQUFZLGFBQWEsYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLGFBQWEsYUFBYSxZQUFZLGFBQWEsTUFBTSxPQUFPLE1BQU0sV0FBVyxZQUFZLFlBQVksWUFBWSxZQUFZLE1BQU0sT0FBTyxNQUFNLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLE1BQU0sWUFBWSxXQUFXLE1BQU0sTUFBTSxL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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxpQ0FBaUM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSw0QkFBNEI7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QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLE1BQU07QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7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Q0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUEsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQjs7Ozs7OztVQzV0QmpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9hbHBpbmVqcy9kaXN0L21vZHVsZS5lc20uanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3N0eWxlcy9mb250cy5jc3MiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbnB1dHMuY3NzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9zdHlsZXMvdGV4dHMuY3NzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9zdHlsZXMvdGhlbWVzLmNzcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbmRleC5jc3M/Y2QzNSIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvY29udHJvbGxlcnMvZGF0YWJhc2UtbWFuYWdlci50cyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL2NvbnRyb2xsZXJzL3N0b3JlLnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvY29udHJvbGxlcnMvdHJhbnNhY3Rpb25zLW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9lbnVtcy90cmFuc2FjdGlvbi10eXBlLnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvbW9kZWxzL2VudGl0eS50cyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL21vZGVscy90cmFuc2FjdGlvbi50cyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL3NjcmlwdHMvZm9ybWF0dGVyLnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9wYXRoLW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3JlbmRlcmVyLnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImZzXCIiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvY3N2LXBhcnNlL2Rpc3QvY2pzL3N5bmMuY2pzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvY3N2LXN0cmluZ2lmeS9kaXN0L2Nqcy9zeW5jLmNqcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3NjaGVkdWxlci5qc1xudmFyIGZsdXNoUGVuZGluZyA9IGZhbHNlO1xudmFyIGZsdXNoaW5nID0gZmFsc2U7XG52YXIgcXVldWUgPSBbXTtcbnZhciBsYXN0Rmx1c2hlZEluZGV4ID0gLTE7XG5mdW5jdGlvbiBzY2hlZHVsZXIoY2FsbGJhY2spIHtcbiAgcXVldWVKb2IoY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gcXVldWVKb2Ioam9iKSB7XG4gIGlmICghcXVldWUuaW5jbHVkZXMoam9iKSlcbiAgICBxdWV1ZS5wdXNoKGpvYik7XG4gIHF1ZXVlRmx1c2goKTtcbn1cbmZ1bmN0aW9uIGRlcXVldWVKb2Ioam9iKSB7XG4gIGxldCBpbmRleCA9IHF1ZXVlLmluZGV4T2Yoam9iKTtcbiAgaWYgKGluZGV4ICE9PSAtMSAmJiBpbmRleCA+IGxhc3RGbHVzaGVkSW5kZXgpXG4gICAgcXVldWUuc3BsaWNlKGluZGV4LCAxKTtcbn1cbmZ1bmN0aW9uIHF1ZXVlRmx1c2goKSB7XG4gIGlmICghZmx1c2hpbmcgJiYgIWZsdXNoUGVuZGluZykge1xuICAgIGZsdXNoUGVuZGluZyA9IHRydWU7XG4gICAgcXVldWVNaWNyb3Rhc2soZmx1c2hKb2JzKTtcbiAgfVxufVxuZnVuY3Rpb24gZmx1c2hKb2JzKCkge1xuICBmbHVzaFBlbmRpbmcgPSBmYWxzZTtcbiAgZmx1c2hpbmcgPSB0cnVlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgcXVldWVbaV0oKTtcbiAgICBsYXN0Rmx1c2hlZEluZGV4ID0gaTtcbiAgfVxuICBxdWV1ZS5sZW5ndGggPSAwO1xuICBsYXN0Rmx1c2hlZEluZGV4ID0gLTE7XG4gIGZsdXNoaW5nID0gZmFsc2U7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9yZWFjdGl2aXR5LmpzXG52YXIgcmVhY3RpdmU7XG52YXIgZWZmZWN0O1xudmFyIHJlbGVhc2U7XG52YXIgcmF3O1xudmFyIHNob3VsZFNjaGVkdWxlID0gdHJ1ZTtcbmZ1bmN0aW9uIGRpc2FibGVFZmZlY3RTY2hlZHVsaW5nKGNhbGxiYWNrKSB7XG4gIHNob3VsZFNjaGVkdWxlID0gZmFsc2U7XG4gIGNhbGxiYWNrKCk7XG4gIHNob3VsZFNjaGVkdWxlID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHNldFJlYWN0aXZpdHlFbmdpbmUoZW5naW5lKSB7XG4gIHJlYWN0aXZlID0gZW5naW5lLnJlYWN0aXZlO1xuICByZWxlYXNlID0gZW5naW5lLnJlbGVhc2U7XG4gIGVmZmVjdCA9IChjYWxsYmFjaykgPT4gZW5naW5lLmVmZmVjdChjYWxsYmFjaywgeyBzY2hlZHVsZXI6ICh0YXNrKSA9PiB7XG4gICAgaWYgKHNob3VsZFNjaGVkdWxlKSB7XG4gICAgICBzY2hlZHVsZXIodGFzayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhc2soKTtcbiAgICB9XG4gIH0gfSk7XG4gIHJhdyA9IGVuZ2luZS5yYXc7XG59XG5mdW5jdGlvbiBvdmVycmlkZUVmZmVjdChvdmVycmlkZSkge1xuICBlZmZlY3QgPSBvdmVycmlkZTtcbn1cbmZ1bmN0aW9uIGVsZW1lbnRCb3VuZEVmZmVjdChlbCkge1xuICBsZXQgY2xlYW51cDIgPSAoKSA9PiB7XG4gIH07XG4gIGxldCB3cmFwcGVkRWZmZWN0ID0gKGNhbGxiYWNrKSA9PiB7XG4gICAgbGV0IGVmZmVjdFJlZmVyZW5jZSA9IGVmZmVjdChjYWxsYmFjayk7XG4gICAgaWYgKCFlbC5feF9lZmZlY3RzKSB7XG4gICAgICBlbC5feF9lZmZlY3RzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgICAgIGVsLl94X3J1bkVmZmVjdHMgPSAoKSA9PiB7XG4gICAgICAgIGVsLl94X2VmZmVjdHMuZm9yRWFjaCgoaSkgPT4gaSgpKTtcbiAgICAgIH07XG4gICAgfVxuICAgIGVsLl94X2VmZmVjdHMuYWRkKGVmZmVjdFJlZmVyZW5jZSk7XG4gICAgY2xlYW51cDIgPSAoKSA9PiB7XG4gICAgICBpZiAoZWZmZWN0UmVmZXJlbmNlID09PSB2b2lkIDApXG4gICAgICAgIHJldHVybjtcbiAgICAgIGVsLl94X2VmZmVjdHMuZGVsZXRlKGVmZmVjdFJlZmVyZW5jZSk7XG4gICAgICByZWxlYXNlKGVmZmVjdFJlZmVyZW5jZSk7XG4gICAgfTtcbiAgICByZXR1cm4gZWZmZWN0UmVmZXJlbmNlO1xuICB9O1xuICByZXR1cm4gW3dyYXBwZWRFZmZlY3QsICgpID0+IHtcbiAgICBjbGVhbnVwMigpO1xuICB9XTtcbn1cbmZ1bmN0aW9uIHdhdGNoKGdldHRlciwgY2FsbGJhY2spIHtcbiAgbGV0IGZpcnN0VGltZSA9IHRydWU7XG4gIGxldCBvbGRWYWx1ZTtcbiAgbGV0IGVmZmVjdFJlZmVyZW5jZSA9IGVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gZ2V0dGVyKCk7XG4gICAgSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIGlmICghZmlyc3RUaW1lKSB7XG4gICAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2xkVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gIH0pO1xuICByZXR1cm4gKCkgPT4gcmVsZWFzZShlZmZlY3RSZWZlcmVuY2UpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbXV0YXRpb24uanNcbnZhciBvbkF0dHJpYnV0ZUFkZGVkcyA9IFtdO1xudmFyIG9uRWxSZW1vdmVkcyA9IFtdO1xudmFyIG9uRWxBZGRlZHMgPSBbXTtcbmZ1bmN0aW9uIG9uRWxBZGRlZChjYWxsYmFjaykge1xuICBvbkVsQWRkZWRzLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gb25FbFJlbW92ZWQoZWwsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGlmICghZWwuX3hfY2xlYW51cHMpXG4gICAgICBlbC5feF9jbGVhbnVwcyA9IFtdO1xuICAgIGVsLl94X2NsZWFudXBzLnB1c2goY2FsbGJhY2spO1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrID0gZWw7XG4gICAgb25FbFJlbW92ZWRzLnB1c2goY2FsbGJhY2spO1xuICB9XG59XG5mdW5jdGlvbiBvbkF0dHJpYnV0ZXNBZGRlZChjYWxsYmFjaykge1xuICBvbkF0dHJpYnV0ZUFkZGVkcy5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIG9uQXR0cmlidXRlUmVtb3ZlZChlbCwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCFlbC5feF9hdHRyaWJ1dGVDbGVhbnVwcylcbiAgICBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwcyA9IHt9O1xuICBpZiAoIWVsLl94X2F0dHJpYnV0ZUNsZWFudXBzW25hbWVdKVxuICAgIGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzW25hbWVdID0gW107XG4gIGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzW25hbWVdLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gY2xlYW51cEF0dHJpYnV0ZXMoZWwsIG5hbWVzKSB7XG4gIGlmICghZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMpXG4gICAgcmV0dXJuO1xuICBPYmplY3QuZW50cmllcyhlbC5feF9hdHRyaWJ1dGVDbGVhbnVwcykuZm9yRWFjaCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIGlmIChuYW1lcyA9PT0gdm9pZCAwIHx8IG5hbWVzLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICB2YWx1ZS5mb3JFYWNoKChpKSA9PiBpKCkpO1xuICAgICAgZGVsZXRlIGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBjbGVhbnVwRWxlbWVudChlbCkge1xuICBlbC5feF9lZmZlY3RzPy5mb3JFYWNoKGRlcXVldWVKb2IpO1xuICB3aGlsZSAoZWwuX3hfY2xlYW51cHM/Lmxlbmd0aClcbiAgICBlbC5feF9jbGVhbnVwcy5wb3AoKSgpO1xufVxudmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIob25NdXRhdGUpO1xudmFyIGN1cnJlbnRseU9ic2VydmluZyA9IGZhbHNlO1xuZnVuY3Rpb24gc3RhcnRPYnNlcnZpbmdNdXRhdGlvbnMoKSB7XG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHsgc3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlLCBhdHRyaWJ1dGVzOiB0cnVlLCBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSB9KTtcbiAgY3VycmVudGx5T2JzZXJ2aW5nID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHN0b3BPYnNlcnZpbmdNdXRhdGlvbnMoKSB7XG4gIGZsdXNoT2JzZXJ2ZXIoKTtcbiAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICBjdXJyZW50bHlPYnNlcnZpbmcgPSBmYWxzZTtcbn1cbnZhciBxdWV1ZWRNdXRhdGlvbnMgPSBbXTtcbmZ1bmN0aW9uIGZsdXNoT2JzZXJ2ZXIoKSB7XG4gIGxldCByZWNvcmRzID0gb2JzZXJ2ZXIudGFrZVJlY29yZHMoKTtcbiAgcXVldWVkTXV0YXRpb25zLnB1c2goKCkgPT4gcmVjb3Jkcy5sZW5ndGggPiAwICYmIG9uTXV0YXRlKHJlY29yZHMpKTtcbiAgbGV0IHF1ZXVlTGVuZ3RoV2hlblRyaWdnZXJlZCA9IHF1ZXVlZE11dGF0aW9ucy5sZW5ndGg7XG4gIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICBpZiAocXVldWVkTXV0YXRpb25zLmxlbmd0aCA9PT0gcXVldWVMZW5ndGhXaGVuVHJpZ2dlcmVkKSB7XG4gICAgICB3aGlsZSAocXVldWVkTXV0YXRpb25zLmxlbmd0aCA+IDApXG4gICAgICAgIHF1ZXVlZE11dGF0aW9ucy5zaGlmdCgpKCk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIG11dGF0ZURvbShjYWxsYmFjaykge1xuICBpZiAoIWN1cnJlbnRseU9ic2VydmluZylcbiAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgc3RvcE9ic2VydmluZ011dGF0aW9ucygpO1xuICBsZXQgcmVzdWx0ID0gY2FsbGJhY2soKTtcbiAgc3RhcnRPYnNlcnZpbmdNdXRhdGlvbnMoKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbnZhciBpc0NvbGxlY3RpbmcgPSBmYWxzZTtcbnZhciBkZWZlcnJlZE11dGF0aW9ucyA9IFtdO1xuZnVuY3Rpb24gZGVmZXJNdXRhdGlvbnMoKSB7XG4gIGlzQ29sbGVjdGluZyA9IHRydWU7XG59XG5mdW5jdGlvbiBmbHVzaEFuZFN0b3BEZWZlcnJpbmdNdXRhdGlvbnMoKSB7XG4gIGlzQ29sbGVjdGluZyA9IGZhbHNlO1xuICBvbk11dGF0ZShkZWZlcnJlZE11dGF0aW9ucyk7XG4gIGRlZmVycmVkTXV0YXRpb25zID0gW107XG59XG5mdW5jdGlvbiBvbk11dGF0ZShtdXRhdGlvbnMpIHtcbiAgaWYgKGlzQ29sbGVjdGluZykge1xuICAgIGRlZmVycmVkTXV0YXRpb25zID0gZGVmZXJyZWRNdXRhdGlvbnMuY29uY2F0KG11dGF0aW9ucyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBhZGRlZE5vZGVzID0gW107XG4gIGxldCByZW1vdmVkTm9kZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBsZXQgYWRkZWRBdHRyaWJ1dGVzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgbGV0IHJlbW92ZWRBdHRyaWJ1dGVzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtdXRhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobXV0YXRpb25zW2ldLnRhcmdldC5feF9pZ25vcmVNdXRhdGlvbk9ic2VydmVyKVxuICAgICAgY29udGludWU7XG4gICAgaWYgKG11dGF0aW9uc1tpXS50eXBlID09PSBcImNoaWxkTGlzdFwiKSB7XG4gICAgICBtdXRhdGlvbnNbaV0ucmVtb3ZlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IDEpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAoIW5vZGUuX3hfbWFya2VyKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmVtb3ZlZE5vZGVzLmFkZChub2RlKTtcbiAgICAgIH0pO1xuICAgICAgbXV0YXRpb25zW2ldLmFkZGVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChyZW1vdmVkTm9kZXMuaGFzKG5vZGUpKSB7XG4gICAgICAgICAgcmVtb3ZlZE5vZGVzLmRlbGV0ZShub2RlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuX3hfbWFya2VyKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYWRkZWROb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChtdXRhdGlvbnNbaV0udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCIpIHtcbiAgICAgIGxldCBlbCA9IG11dGF0aW9uc1tpXS50YXJnZXQ7XG4gICAgICBsZXQgbmFtZSA9IG11dGF0aW9uc1tpXS5hdHRyaWJ1dGVOYW1lO1xuICAgICAgbGV0IG9sZFZhbHVlID0gbXV0YXRpb25zW2ldLm9sZFZhbHVlO1xuICAgICAgbGV0IGFkZDIgPSAoKSA9PiB7XG4gICAgICAgIGlmICghYWRkZWRBdHRyaWJ1dGVzLmhhcyhlbCkpXG4gICAgICAgICAgYWRkZWRBdHRyaWJ1dGVzLnNldChlbCwgW10pO1xuICAgICAgICBhZGRlZEF0dHJpYnV0ZXMuZ2V0KGVsKS5wdXNoKHsgbmFtZSwgdmFsdWU6IGVsLmdldEF0dHJpYnV0ZShuYW1lKSB9KTtcbiAgICAgIH07XG4gICAgICBsZXQgcmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXJlbW92ZWRBdHRyaWJ1dGVzLmhhcyhlbCkpXG4gICAgICAgICAgcmVtb3ZlZEF0dHJpYnV0ZXMuc2V0KGVsLCBbXSk7XG4gICAgICAgIHJlbW92ZWRBdHRyaWJ1dGVzLmdldChlbCkucHVzaChuYW1lKTtcbiAgICAgIH07XG4gICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKG5hbWUpICYmIG9sZFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIGFkZDIoKTtcbiAgICAgIH0gZWxzZSBpZiAoZWwuaGFzQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICAgIHJlbW92ZSgpO1xuICAgICAgICBhZGQyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmVtb3ZlZEF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cnMsIGVsKSA9PiB7XG4gICAgY2xlYW51cEF0dHJpYnV0ZXMoZWwsIGF0dHJzKTtcbiAgfSk7XG4gIGFkZGVkQXR0cmlidXRlcy5mb3JFYWNoKChhdHRycywgZWwpID0+IHtcbiAgICBvbkF0dHJpYnV0ZUFkZGVkcy5mb3JFYWNoKChpKSA9PiBpKGVsLCBhdHRycykpO1xuICB9KTtcbiAgZm9yIChsZXQgbm9kZSBvZiByZW1vdmVkTm9kZXMpIHtcbiAgICBpZiAoYWRkZWROb2Rlcy5zb21lKChpKSA9PiBpLmNvbnRhaW5zKG5vZGUpKSlcbiAgICAgIGNvbnRpbnVlO1xuICAgIG9uRWxSZW1vdmVkcy5mb3JFYWNoKChpKSA9PiBpKG5vZGUpKTtcbiAgfVxuICBmb3IgKGxldCBub2RlIG9mIGFkZGVkTm9kZXMpIHtcbiAgICBpZiAoIW5vZGUuaXNDb25uZWN0ZWQpXG4gICAgICBjb250aW51ZTtcbiAgICBvbkVsQWRkZWRzLmZvckVhY2goKGkpID0+IGkobm9kZSkpO1xuICB9XG4gIGFkZGVkTm9kZXMgPSBudWxsO1xuICByZW1vdmVkTm9kZXMgPSBudWxsO1xuICBhZGRlZEF0dHJpYnV0ZXMgPSBudWxsO1xuICByZW1vdmVkQXR0cmlidXRlcyA9IG51bGw7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9zY29wZS5qc1xuZnVuY3Rpb24gc2NvcGUobm9kZSkge1xuICByZXR1cm4gbWVyZ2VQcm94aWVzKGNsb3Nlc3REYXRhU3RhY2sobm9kZSkpO1xufVxuZnVuY3Rpb24gYWRkU2NvcGVUb05vZGUobm9kZSwgZGF0YTIsIHJlZmVyZW5jZU5vZGUpIHtcbiAgbm9kZS5feF9kYXRhU3RhY2sgPSBbZGF0YTIsIC4uLmNsb3Nlc3REYXRhU3RhY2socmVmZXJlbmNlTm9kZSB8fCBub2RlKV07XG4gIHJldHVybiAoKSA9PiB7XG4gICAgbm9kZS5feF9kYXRhU3RhY2sgPSBub2RlLl94X2RhdGFTdGFjay5maWx0ZXIoKGkpID0+IGkgIT09IGRhdGEyKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNsb3Nlc3REYXRhU3RhY2sobm9kZSkge1xuICBpZiAobm9kZS5feF9kYXRhU3RhY2spXG4gICAgcmV0dXJuIG5vZGUuX3hfZGF0YVN0YWNrO1xuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgPT09IFwiZnVuY3Rpb25cIiAmJiBub2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuICAgIHJldHVybiBjbG9zZXN0RGF0YVN0YWNrKG5vZGUuaG9zdCk7XG4gIH1cbiAgaWYgKCFub2RlLnBhcmVudE5vZGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgcmV0dXJuIGNsb3Nlc3REYXRhU3RhY2sobm9kZS5wYXJlbnROb2RlKTtcbn1cbmZ1bmN0aW9uIG1lcmdlUHJveGllcyhvYmplY3RzKSB7XG4gIHJldHVybiBuZXcgUHJveHkoeyBvYmplY3RzIH0sIG1lcmdlUHJveHlUcmFwKTtcbn1cbnZhciBtZXJnZVByb3h5VHJhcCA9IHtcbiAgb3duS2V5cyh7IG9iamVjdHMgfSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgbmV3IFNldChvYmplY3RzLmZsYXRNYXAoKGkpID0+IE9iamVjdC5rZXlzKGkpKSlcbiAgICApO1xuICB9LFxuICBoYXMoeyBvYmplY3RzIH0sIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PSBTeW1ib2wudW5zY29wYWJsZXMpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIG9iamVjdHMuc29tZShcbiAgICAgIChvYmopID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIG5hbWUpIHx8IFJlZmxlY3QuaGFzKG9iaiwgbmFtZSlcbiAgICApO1xuICB9LFxuICBnZXQoeyBvYmplY3RzIH0sIG5hbWUsIHRoaXNQcm94eSkge1xuICAgIGlmIChuYW1lID09IFwidG9KU09OXCIpXG4gICAgICByZXR1cm4gY29sbGFwc2VQcm94aWVzO1xuICAgIHJldHVybiBSZWZsZWN0LmdldChcbiAgICAgIG9iamVjdHMuZmluZChcbiAgICAgICAgKG9iaikgPT4gUmVmbGVjdC5oYXMob2JqLCBuYW1lKVxuICAgICAgKSB8fCB7fSxcbiAgICAgIG5hbWUsXG4gICAgICB0aGlzUHJveHlcbiAgICApO1xuICB9LFxuICBzZXQoeyBvYmplY3RzIH0sIG5hbWUsIHZhbHVlLCB0aGlzUHJveHkpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBvYmplY3RzLmZpbmQoXG4gICAgICAob2JqKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBuYW1lKVxuICAgICkgfHwgb2JqZWN0c1tvYmplY3RzLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3I/LnNldCAmJiBkZXNjcmlwdG9yPy5nZXQpXG4gICAgICByZXR1cm4gZGVzY3JpcHRvci5zZXQuY2FsbCh0aGlzUHJveHksIHZhbHVlKSB8fCB0cnVlO1xuICAgIHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcbiAgfVxufTtcbmZ1bmN0aW9uIGNvbGxhcHNlUHJveGllcygpIHtcbiAgbGV0IGtleXMgPSBSZWZsZWN0Lm93bktleXModGhpcyk7XG4gIHJldHVybiBrZXlzLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICBhY2Nba2V5XSA9IFJlZmxlY3QuZ2V0KHRoaXMsIGtleSk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvaW50ZXJjZXB0b3IuanNcbmZ1bmN0aW9uIGluaXRJbnRlcmNlcHRvcnMoZGF0YTIpIHtcbiAgbGV0IGlzT2JqZWN0MiA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsKSAmJiB2YWwgIT09IG51bGw7XG4gIGxldCByZWN1cnNlID0gKG9iaiwgYmFzZVBhdGggPSBcIlwiKSA9PiB7XG4gICAgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqKSkuZm9yRWFjaCgoW2tleSwgeyB2YWx1ZSwgZW51bWVyYWJsZSB9XSkgPT4ge1xuICAgICAgaWYgKGVudW1lcmFibGUgPT09IGZhbHNlIHx8IHZhbHVlID09PSB2b2lkIDApXG4gICAgICAgIHJldHVybjtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUuX192X3NraXApXG4gICAgICAgIHJldHVybjtcbiAgICAgIGxldCBwYXRoID0gYmFzZVBhdGggPT09IFwiXCIgPyBrZXkgOiBgJHtiYXNlUGF0aH0uJHtrZXl9YDtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUuX3hfaW50ZXJjZXB0b3IpIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWx1ZS5pbml0aWFsaXplKGRhdGEyLCBwYXRoLCBrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0Mih2YWx1ZSkgJiYgdmFsdWUgIT09IG9iaiAmJiAhKHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgICAgICByZWN1cnNlKHZhbHVlLCBwYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICByZXR1cm4gcmVjdXJzZShkYXRhMik7XG59XG5mdW5jdGlvbiBpbnRlcmNlcHRvcihjYWxsYmFjaywgbXV0YXRlT2JqID0gKCkgPT4ge1xufSkge1xuICBsZXQgb2JqID0ge1xuICAgIGluaXRpYWxWYWx1ZTogdm9pZCAwLFxuICAgIF94X2ludGVyY2VwdG9yOiB0cnVlLFxuICAgIGluaXRpYWxpemUoZGF0YTIsIHBhdGgsIGtleSkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuaW5pdGlhbFZhbHVlLCAoKSA9PiBnZXQoZGF0YTIsIHBhdGgpLCAodmFsdWUpID0+IHNldChkYXRhMiwgcGF0aCwgdmFsdWUpLCBwYXRoLCBrZXkpO1xuICAgIH1cbiAgfTtcbiAgbXV0YXRlT2JqKG9iaik7XG4gIHJldHVybiAoaW5pdGlhbFZhbHVlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpbml0aWFsVmFsdWUgPT09IFwib2JqZWN0XCIgJiYgaW5pdGlhbFZhbHVlICE9PSBudWxsICYmIGluaXRpYWxWYWx1ZS5feF9pbnRlcmNlcHRvcikge1xuICAgICAgbGV0IGluaXRpYWxpemUgPSBvYmouaW5pdGlhbGl6ZS5iaW5kKG9iaik7XG4gICAgICBvYmouaW5pdGlhbGl6ZSA9IChkYXRhMiwgcGF0aCwga2V5KSA9PiB7XG4gICAgICAgIGxldCBpbm5lclZhbHVlID0gaW5pdGlhbFZhbHVlLmluaXRpYWxpemUoZGF0YTIsIHBhdGgsIGtleSk7XG4gICAgICAgIG9iai5pbml0aWFsVmFsdWUgPSBpbm5lclZhbHVlO1xuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iai5pbml0aWFsVmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG59XG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIHJldHVybiBwYXRoLnNwbGl0KFwiLlwiKS5yZWR1Y2UoKGNhcnJ5LCBzZWdtZW50KSA9PiBjYXJyeVtzZWdtZW50XSwgb2JqKTtcbn1cbmZ1bmN0aW9uIHNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIilcbiAgICBwYXRoID0gcGF0aC5zcGxpdChcIi5cIik7XG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMSlcbiAgICBvYmpbcGF0aFswXV0gPSB2YWx1ZTtcbiAgZWxzZSBpZiAocGF0aC5sZW5ndGggPT09IDApXG4gICAgdGhyb3cgZXJyb3I7XG4gIGVsc2Uge1xuICAgIGlmIChvYmpbcGF0aFswXV0pXG4gICAgICByZXR1cm4gc2V0KG9ialtwYXRoWzBdXSwgcGF0aC5zbGljZSgxKSwgdmFsdWUpO1xuICAgIGVsc2Uge1xuICAgICAgb2JqW3BhdGhbMF1dID0ge307XG4gICAgICByZXR1cm4gc2V0KG9ialtwYXRoWzBdXSwgcGF0aC5zbGljZSgxKSwgdmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLmpzXG52YXIgbWFnaWNzID0ge307XG5mdW5jdGlvbiBtYWdpYyhuYW1lLCBjYWxsYmFjaykge1xuICBtYWdpY3NbbmFtZV0gPSBjYWxsYmFjaztcbn1cbmZ1bmN0aW9uIGluamVjdE1hZ2ljcyhvYmosIGVsKSB7XG4gIGxldCBtZW1vaXplZFV0aWxpdGllcyA9IGdldFV0aWxpdGllcyhlbCk7XG4gIE9iamVjdC5lbnRyaWVzKG1hZ2ljcykuZm9yRWFjaCgoW25hbWUsIGNhbGxiYWNrXSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGAkJHtuYW1lfWAsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVsLCBtZW1vaXplZFV0aWxpdGllcyk7XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5mdW5jdGlvbiBnZXRVdGlsaXRpZXMoZWwpIHtcbiAgbGV0IFt1dGlsaXRpZXMsIGNsZWFudXAyXSA9IGdldEVsZW1lbnRCb3VuZFV0aWxpdGllcyhlbCk7XG4gIGxldCB1dGlscyA9IHsgaW50ZXJjZXB0b3IsIC4uLnV0aWxpdGllcyB9O1xuICBvbkVsUmVtb3ZlZChlbCwgY2xlYW51cDIpO1xuICByZXR1cm4gdXRpbHM7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9lcnJvci5qc1xuZnVuY3Rpb24gdHJ5Q2F0Y2goZWwsIGV4cHJlc3Npb24sIGNhbGxiYWNrLCAuLi5hcmdzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaGFuZGxlRXJyb3IoZSwgZWwsIGV4cHJlc3Npb24pO1xuICB9XG59XG5mdW5jdGlvbiBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCBleHByZXNzaW9uID0gdm9pZCAwKSB7XG4gIGVycm9yMiA9IE9iamVjdC5hc3NpZ24oXG4gICAgZXJyb3IyID8/IHsgbWVzc2FnZTogXCJObyBlcnJvciBtZXNzYWdlIGdpdmVuLlwiIH0sXG4gICAgeyBlbCwgZXhwcmVzc2lvbiB9XG4gICk7XG4gIGNvbnNvbGUud2FybihgQWxwaW5lIEV4cHJlc3Npb24gRXJyb3I6ICR7ZXJyb3IyLm1lc3NhZ2V9XG5cbiR7ZXhwcmVzc2lvbiA/ICdFeHByZXNzaW9uOiBcIicgKyBleHByZXNzaW9uICsgJ1wiXFxuXFxuJyA6IFwiXCJ9YCwgZWwpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICB0aHJvdyBlcnJvcjI7XG4gIH0sIDApO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZXZhbHVhdG9yLmpzXG52YXIgc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zID0gdHJ1ZTtcbmZ1bmN0aW9uIGRvbnRBdXRvRXZhbHVhdGVGdW5jdGlvbnMoY2FsbGJhY2spIHtcbiAgbGV0IGNhY2hlID0gc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zO1xuICBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgPSBmYWxzZTtcbiAgbGV0IHJlc3VsdCA9IGNhbGxiYWNrKCk7XG4gIHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyA9IGNhY2hlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZXZhbHVhdGUoZWwsIGV4cHJlc3Npb24sIGV4dHJhcyA9IHt9KSB7XG4gIGxldCByZXN1bHQ7XG4gIGV2YWx1YXRlTGF0ZXIoZWwsIGV4cHJlc3Npb24pKCh2YWx1ZSkgPT4gcmVzdWx0ID0gdmFsdWUsIGV4dHJhcyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBldmFsdWF0ZUxhdGVyKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHRoZUV2YWx1YXRvckZ1bmN0aW9uKC4uLmFyZ3MpO1xufVxudmFyIHRoZUV2YWx1YXRvckZ1bmN0aW9uID0gbm9ybWFsRXZhbHVhdG9yO1xuZnVuY3Rpb24gc2V0RXZhbHVhdG9yKG5ld0V2YWx1YXRvcikge1xuICB0aGVFdmFsdWF0b3JGdW5jdGlvbiA9IG5ld0V2YWx1YXRvcjtcbn1cbmZ1bmN0aW9uIG5vcm1hbEV2YWx1YXRvcihlbCwgZXhwcmVzc2lvbikge1xuICBsZXQgb3ZlcnJpZGRlbk1hZ2ljcyA9IHt9O1xuICBpbmplY3RNYWdpY3Mob3ZlcnJpZGRlbk1hZ2ljcywgZWwpO1xuICBsZXQgZGF0YVN0YWNrID0gW292ZXJyaWRkZW5NYWdpY3MsIC4uLmNsb3Nlc3REYXRhU3RhY2soZWwpXTtcbiAgbGV0IGV2YWx1YXRvciA9IHR5cGVvZiBleHByZXNzaW9uID09PSBcImZ1bmN0aW9uXCIgPyBnZW5lcmF0ZUV2YWx1YXRvckZyb21GdW5jdGlvbihkYXRhU3RhY2ssIGV4cHJlc3Npb24pIDogZ2VuZXJhdGVFdmFsdWF0b3JGcm9tU3RyaW5nKGRhdGFTdGFjaywgZXhwcmVzc2lvbiwgZWwpO1xuICByZXR1cm4gdHJ5Q2F0Y2guYmluZChudWxsLCBlbCwgZXhwcmVzc2lvbiwgZXZhbHVhdG9yKTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlRXZhbHVhdG9yRnJvbUZ1bmN0aW9uKGRhdGFTdGFjaywgZnVuYykge1xuICByZXR1cm4gKHJlY2VpdmVyID0gKCkgPT4ge1xuICB9LCB7IHNjb3BlOiBzY29wZTIgPSB7fSwgcGFyYW1zID0gW10gfSA9IHt9KSA9PiB7XG4gICAgbGV0IHJlc3VsdCA9IGZ1bmMuYXBwbHkobWVyZ2VQcm94aWVzKFtzY29wZTIsIC4uLmRhdGFTdGFja10pLCBwYXJhbXMpO1xuICAgIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIHJlc3VsdCk7XG4gIH07XG59XG52YXIgZXZhbHVhdG9yTWVtbyA9IHt9O1xuZnVuY3Rpb24gZ2VuZXJhdGVGdW5jdGlvbkZyb21TdHJpbmcoZXhwcmVzc2lvbiwgZWwpIHtcbiAgaWYgKGV2YWx1YXRvck1lbW9bZXhwcmVzc2lvbl0pIHtcbiAgICByZXR1cm4gZXZhbHVhdG9yTWVtb1tleHByZXNzaW9uXTtcbiAgfVxuICBsZXQgQXN5bmNGdW5jdGlvbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihhc3luYyBmdW5jdGlvbigpIHtcbiAgfSkuY29uc3RydWN0b3I7XG4gIGxldCByaWdodFNpZGVTYWZlRXhwcmVzc2lvbiA9IC9eW1xcblxcc10qaWYuKlxcKC4qXFwpLy50ZXN0KGV4cHJlc3Npb24udHJpbSgpKSB8fCAvXihsZXR8Y29uc3QpXFxzLy50ZXN0KGV4cHJlc3Npb24udHJpbSgpKSA/IGAoYXN5bmMoKT0+eyAke2V4cHJlc3Npb259IH0pKClgIDogZXhwcmVzc2lvbjtcbiAgY29uc3Qgc2FmZUFzeW5jRnVuY3Rpb24gPSAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBmdW5jMiA9IG5ldyBBc3luY0Z1bmN0aW9uKFxuICAgICAgICBbXCJfX3NlbGZcIiwgXCJzY29wZVwiXSxcbiAgICAgICAgYHdpdGggKHNjb3BlKSB7IF9fc2VsZi5yZXN1bHQgPSAke3JpZ2h0U2lkZVNhZmVFeHByZXNzaW9ufSB9OyBfX3NlbGYuZmluaXNoZWQgPSB0cnVlOyByZXR1cm4gX19zZWxmLnJlc3VsdDtgXG4gICAgICApO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmMyLCBcIm5hbWVcIiwge1xuICAgICAgICB2YWx1ZTogYFtBbHBpbmVdICR7ZXhwcmVzc2lvbn1gXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmdW5jMjtcbiAgICB9IGNhdGNoIChlcnJvcjIpIHtcbiAgICAgIGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIGV4cHJlc3Npb24pO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgfTtcbiAgbGV0IGZ1bmMgPSBzYWZlQXN5bmNGdW5jdGlvbigpO1xuICBldmFsdWF0b3JNZW1vW2V4cHJlc3Npb25dID0gZnVuYztcbiAgcmV0dXJuIGZ1bmM7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUV2YWx1YXRvckZyb21TdHJpbmcoZGF0YVN0YWNrLCBleHByZXNzaW9uLCBlbCkge1xuICBsZXQgZnVuYyA9IGdlbmVyYXRlRnVuY3Rpb25Gcm9tU3RyaW5nKGV4cHJlc3Npb24sIGVsKTtcbiAgcmV0dXJuIChyZWNlaXZlciA9ICgpID0+IHtcbiAgfSwgeyBzY29wZTogc2NvcGUyID0ge30sIHBhcmFtcyA9IFtdIH0gPSB7fSkgPT4ge1xuICAgIGZ1bmMucmVzdWx0ID0gdm9pZCAwO1xuICAgIGZ1bmMuZmluaXNoZWQgPSBmYWxzZTtcbiAgICBsZXQgY29tcGxldGVTY29wZSA9IG1lcmdlUHJveGllcyhbc2NvcGUyLCAuLi5kYXRhU3RhY2tdKTtcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgbGV0IHByb21pc2UgPSBmdW5jKGZ1bmMsIGNvbXBsZXRlU2NvcGUpLmNhdGNoKChlcnJvcjIpID0+IGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIGV4cHJlc3Npb24pKTtcbiAgICAgIGlmIChmdW5jLmZpbmlzaGVkKSB7XG4gICAgICAgIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIGZ1bmMucmVzdWx0LCBjb21wbGV0ZVNjb3BlLCBwYXJhbXMsIGVsKTtcbiAgICAgICAgZnVuYy5yZXN1bHQgPSB2b2lkIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIHJlc3VsdCwgY29tcGxldGVTY29wZSwgcGFyYW1zLCBlbCk7XG4gICAgICAgIH0pLmNhdGNoKChlcnJvcjIpID0+IGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIGV4cHJlc3Npb24pKS5maW5hbGx5KCgpID0+IGZ1bmMucmVzdWx0ID0gdm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCB2YWx1ZSwgc2NvcGUyLCBwYXJhbXMsIGVsKSB7XG4gIGlmIChzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgJiYgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBsZXQgcmVzdWx0ID0gdmFsdWUuYXBwbHkoc2NvcGUyLCBwYXJhbXMpO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICByZXN1bHQudGhlbigoaSkgPT4gcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgaSwgc2NvcGUyLCBwYXJhbXMpKS5jYXRjaCgoZXJyb3IyKSA9PiBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCB2YWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNlaXZlcihyZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgdmFsdWUudGhlbigoaSkgPT4gcmVjZWl2ZXIoaSkpO1xuICB9IGVsc2Uge1xuICAgIHJlY2VpdmVyKHZhbHVlKTtcbiAgfVxufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy5qc1xudmFyIHByZWZpeEFzU3RyaW5nID0gXCJ4LVwiO1xuZnVuY3Rpb24gcHJlZml4KHN1YmplY3QgPSBcIlwiKSB7XG4gIHJldHVybiBwcmVmaXhBc1N0cmluZyArIHN1YmplY3Q7XG59XG5mdW5jdGlvbiBzZXRQcmVmaXgobmV3UHJlZml4KSB7XG4gIHByZWZpeEFzU3RyaW5nID0gbmV3UHJlZml4O1xufVxudmFyIGRpcmVjdGl2ZUhhbmRsZXJzID0ge307XG5mdW5jdGlvbiBkaXJlY3RpdmUobmFtZSwgY2FsbGJhY2spIHtcbiAgZGlyZWN0aXZlSGFuZGxlcnNbbmFtZV0gPSBjYWxsYmFjaztcbiAgcmV0dXJuIHtcbiAgICBiZWZvcmUoZGlyZWN0aXZlMikge1xuICAgICAgaWYgKCFkaXJlY3RpdmVIYW5kbGVyc1tkaXJlY3RpdmUyXSkge1xuICAgICAgICBjb25zb2xlLndhcm4oU3RyaW5nLnJhd2BDYW5ub3QgZmluZCBkaXJlY3RpdmUgXFxgJHtkaXJlY3RpdmUyfVxcYC4gXFxgJHtuYW1lfVxcYCB3aWxsIHVzZSB0aGUgZGVmYXVsdCBvcmRlciBvZiBleGVjdXRpb25gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zID0gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZihkaXJlY3RpdmUyKTtcbiAgICAgIGRpcmVjdGl2ZU9yZGVyLnNwbGljZShwb3MgPj0gMCA/IHBvcyA6IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoXCJERUZBVUxUXCIpLCAwLCBuYW1lKTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBkaXJlY3RpdmVFeGlzdHMobmFtZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoZGlyZWN0aXZlSGFuZGxlcnMpLmluY2x1ZGVzKG5hbWUpO1xufVxuZnVuY3Rpb24gZGlyZWN0aXZlcyhlbCwgYXR0cmlidXRlcywgb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSkge1xuICBhdHRyaWJ1dGVzID0gQXJyYXkuZnJvbShhdHRyaWJ1dGVzKTtcbiAgaWYgKGVsLl94X3ZpcnR1YWxEaXJlY3RpdmVzKSB7XG4gICAgbGV0IHZBdHRyaWJ1dGVzID0gT2JqZWN0LmVudHJpZXMoZWwuX3hfdmlydHVhbERpcmVjdGl2ZXMpLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4gKHsgbmFtZSwgdmFsdWUgfSkpO1xuICAgIGxldCBzdGF0aWNBdHRyaWJ1dGVzID0gYXR0cmlidXRlc09ubHkodkF0dHJpYnV0ZXMpO1xuICAgIHZBdHRyaWJ1dGVzID0gdkF0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgIGlmIChzdGF0aWNBdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+IGF0dHIubmFtZSA9PT0gYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogYHgtYmluZDoke2F0dHJpYnV0ZS5uYW1lfWAsXG4gICAgICAgICAgdmFsdWU6IGBcIiR7YXR0cmlidXRlLnZhbHVlfVwiYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGF0dHJpYnV0ZTtcbiAgICB9KTtcbiAgICBhdHRyaWJ1dGVzID0gYXR0cmlidXRlcy5jb25jYXQodkF0dHJpYnV0ZXMpO1xuICB9XG4gIGxldCB0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcCA9IHt9O1xuICBsZXQgZGlyZWN0aXZlczIgPSBhdHRyaWJ1dGVzLm1hcCh0b1RyYW5zZm9ybWVkQXR0cmlidXRlcygobmV3TmFtZSwgb2xkTmFtZSkgPT4gdHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXBbbmV3TmFtZV0gPSBvbGROYW1lKSkuZmlsdGVyKG91dE5vbkFscGluZUF0dHJpYnV0ZXMpLm1hcCh0b1BhcnNlZERpcmVjdGl2ZXModHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXAsIG9yaWdpbmFsQXR0cmlidXRlT3ZlcnJpZGUpKS5zb3J0KGJ5UHJpb3JpdHkpO1xuICByZXR1cm4gZGlyZWN0aXZlczIubWFwKChkaXJlY3RpdmUyKSA9PiB7XG4gICAgcmV0dXJuIGdldERpcmVjdGl2ZUhhbmRsZXIoZWwsIGRpcmVjdGl2ZTIpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGF0dHJpYnV0ZXNPbmx5KGF0dHJpYnV0ZXMpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20oYXR0cmlidXRlcykubWFwKHRvVHJhbnNmb3JtZWRBdHRyaWJ1dGVzKCkpLmZpbHRlcigoYXR0cikgPT4gIW91dE5vbkFscGluZUF0dHJpYnV0ZXMoYXR0cikpO1xufVxudmFyIGlzRGVmZXJyaW5nSGFuZGxlcnMgPSBmYWxzZTtcbnZhciBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbnZhciBjdXJyZW50SGFuZGxlclN0YWNrS2V5ID0gU3ltYm9sKCk7XG5mdW5jdGlvbiBkZWZlckhhbmRsaW5nRGlyZWN0aXZlcyhjYWxsYmFjaykge1xuICBpc0RlZmVycmluZ0hhbmRsZXJzID0gdHJ1ZTtcbiAgbGV0IGtleSA9IFN5bWJvbCgpO1xuICBjdXJyZW50SGFuZGxlclN0YWNrS2V5ID0ga2V5O1xuICBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLnNldChrZXksIFtdKTtcbiAgbGV0IGZsdXNoSGFuZGxlcnMgPSAoKSA9PiB7XG4gICAgd2hpbGUgKGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MuZ2V0KGtleSkubGVuZ3RoKVxuICAgICAgZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5nZXQoa2V5KS5zaGlmdCgpKCk7XG4gICAgZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5kZWxldGUoa2V5KTtcbiAgfTtcbiAgbGV0IHN0b3BEZWZlcnJpbmcgPSAoKSA9PiB7XG4gICAgaXNEZWZlcnJpbmdIYW5kbGVycyA9IGZhbHNlO1xuICAgIGZsdXNoSGFuZGxlcnMoKTtcbiAgfTtcbiAgY2FsbGJhY2soZmx1c2hIYW5kbGVycyk7XG4gIHN0b3BEZWZlcnJpbmcoKTtcbn1cbmZ1bmN0aW9uIGdldEVsZW1lbnRCb3VuZFV0aWxpdGllcyhlbCkge1xuICBsZXQgY2xlYW51cHMgPSBbXTtcbiAgbGV0IGNsZWFudXAyID0gKGNhbGxiYWNrKSA9PiBjbGVhbnVwcy5wdXNoKGNhbGxiYWNrKTtcbiAgbGV0IFtlZmZlY3QzLCBjbGVhbnVwRWZmZWN0XSA9IGVsZW1lbnRCb3VuZEVmZmVjdChlbCk7XG4gIGNsZWFudXBzLnB1c2goY2xlYW51cEVmZmVjdCk7XG4gIGxldCB1dGlsaXRpZXMgPSB7XG4gICAgQWxwaW5lOiBhbHBpbmVfZGVmYXVsdCxcbiAgICBlZmZlY3Q6IGVmZmVjdDMsXG4gICAgY2xlYW51cDogY2xlYW51cDIsXG4gICAgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlci5iaW5kKGV2YWx1YXRlTGF0ZXIsIGVsKSxcbiAgICBldmFsdWF0ZTogZXZhbHVhdGUuYmluZChldmFsdWF0ZSwgZWwpXG4gIH07XG4gIGxldCBkb0NsZWFudXAgPSAoKSA9PiBjbGVhbnVwcy5mb3JFYWNoKChpKSA9PiBpKCkpO1xuICByZXR1cm4gW3V0aWxpdGllcywgZG9DbGVhbnVwXTtcbn1cbmZ1bmN0aW9uIGdldERpcmVjdGl2ZUhhbmRsZXIoZWwsIGRpcmVjdGl2ZTIpIHtcbiAgbGV0IG5vb3AgPSAoKSA9PiB7XG4gIH07XG4gIGxldCBoYW5kbGVyNCA9IGRpcmVjdGl2ZUhhbmRsZXJzW2RpcmVjdGl2ZTIudHlwZV0gfHwgbm9vcDtcbiAgbGV0IFt1dGlsaXRpZXMsIGNsZWFudXAyXSA9IGdldEVsZW1lbnRCb3VuZFV0aWxpdGllcyhlbCk7XG4gIG9uQXR0cmlidXRlUmVtb3ZlZChlbCwgZGlyZWN0aXZlMi5vcmlnaW5hbCwgY2xlYW51cDIpO1xuICBsZXQgZnVsbEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgaWYgKGVsLl94X2lnbm9yZSB8fCBlbC5feF9pZ25vcmVTZWxmKVxuICAgICAgcmV0dXJuO1xuICAgIGhhbmRsZXI0LmlubGluZSAmJiBoYW5kbGVyNC5pbmxpbmUoZWwsIGRpcmVjdGl2ZTIsIHV0aWxpdGllcyk7XG4gICAgaGFuZGxlcjQgPSBoYW5kbGVyNC5iaW5kKGhhbmRsZXI0LCBlbCwgZGlyZWN0aXZlMiwgdXRpbGl0aWVzKTtcbiAgICBpc0RlZmVycmluZ0hhbmRsZXJzID8gZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5nZXQoY3VycmVudEhhbmRsZXJTdGFja0tleSkucHVzaChoYW5kbGVyNCkgOiBoYW5kbGVyNCgpO1xuICB9O1xuICBmdWxsSGFuZGxlci5ydW5DbGVhbnVwcyA9IGNsZWFudXAyO1xuICByZXR1cm4gZnVsbEhhbmRsZXI7XG59XG52YXIgc3RhcnRpbmdXaXRoID0gKHN1YmplY3QsIHJlcGxhY2VtZW50KSA9PiAoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gIGlmIChuYW1lLnN0YXJ0c1dpdGgoc3ViamVjdCkpXG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZShzdWJqZWN0LCByZXBsYWNlbWVudCk7XG4gIHJldHVybiB7IG5hbWUsIHZhbHVlIH07XG59O1xudmFyIGludG8gPSAoaSkgPT4gaTtcbmZ1bmN0aW9uIHRvVHJhbnNmb3JtZWRBdHRyaWJ1dGVzKGNhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICByZXR1cm4gKHsgbmFtZSwgdmFsdWUgfSkgPT4ge1xuICAgIGxldCB7IG5hbWU6IG5ld05hbWUsIHZhbHVlOiBuZXdWYWx1ZSB9ID0gYXR0cmlidXRlVHJhbnNmb3JtZXJzLnJlZHVjZSgoY2FycnksIHRyYW5zZm9ybSkgPT4ge1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybShjYXJyeSk7XG4gICAgfSwgeyBuYW1lLCB2YWx1ZSB9KTtcbiAgICBpZiAobmV3TmFtZSAhPT0gbmFtZSlcbiAgICAgIGNhbGxiYWNrKG5ld05hbWUsIG5hbWUpO1xuICAgIHJldHVybiB7IG5hbWU6IG5ld05hbWUsIHZhbHVlOiBuZXdWYWx1ZSB9O1xuICB9O1xufVxudmFyIGF0dHJpYnV0ZVRyYW5zZm9ybWVycyA9IFtdO1xuZnVuY3Rpb24gbWFwQXR0cmlidXRlcyhjYWxsYmFjaykge1xuICBhdHRyaWJ1dGVUcmFuc2Zvcm1lcnMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBvdXROb25BbHBpbmVBdHRyaWJ1dGVzKHsgbmFtZSB9KSB7XG4gIHJldHVybiBhbHBpbmVBdHRyaWJ1dGVSZWdleCgpLnRlc3QobmFtZSk7XG59XG52YXIgYWxwaW5lQXR0cmlidXRlUmVnZXggPSAoKSA9PiBuZXcgUmVnRXhwKGBeJHtwcmVmaXhBc1N0cmluZ30oW146Xi5dKylcXFxcYmApO1xuZnVuY3Rpb24gdG9QYXJzZWREaXJlY3RpdmVzKHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwLCBvcmlnaW5hbEF0dHJpYnV0ZU92ZXJyaWRlKSB7XG4gIHJldHVybiAoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gICAgbGV0IHR5cGVNYXRjaCA9IG5hbWUubWF0Y2goYWxwaW5lQXR0cmlidXRlUmVnZXgoKSk7XG4gICAgbGV0IHZhbHVlTWF0Y2ggPSBuYW1lLm1hdGNoKC86KFthLXpBLVowLTlcXC1fOl0rKS8pO1xuICAgIGxldCBtb2RpZmllcnMgPSBuYW1lLm1hdGNoKC9cXC5bXi5cXF1dKyg/PVteXFxdXSokKS9nKSB8fCBbXTtcbiAgICBsZXQgb3JpZ2luYWwgPSBvcmlnaW5hbEF0dHJpYnV0ZU92ZXJyaWRlIHx8IHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwW25hbWVdIHx8IG5hbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHR5cGVNYXRjaCA/IHR5cGVNYXRjaFsxXSA6IG51bGwsXG4gICAgICB2YWx1ZTogdmFsdWVNYXRjaCA/IHZhbHVlTWF0Y2hbMV0gOiBudWxsLFxuICAgICAgbW9kaWZpZXJzOiBtb2RpZmllcnMubWFwKChpKSA9PiBpLnJlcGxhY2UoXCIuXCIsIFwiXCIpKSxcbiAgICAgIGV4cHJlc3Npb246IHZhbHVlLFxuICAgICAgb3JpZ2luYWxcbiAgICB9O1xuICB9O1xufVxudmFyIERFRkFVTFQgPSBcIkRFRkFVTFRcIjtcbnZhciBkaXJlY3RpdmVPcmRlciA9IFtcbiAgXCJpZ25vcmVcIixcbiAgXCJyZWZcIixcbiAgXCJkYXRhXCIsXG4gIFwiaWRcIixcbiAgXCJhbmNob3JcIixcbiAgXCJiaW5kXCIsXG4gIFwiaW5pdFwiLFxuICBcImZvclwiLFxuICBcIm1vZGVsXCIsXG4gIFwibW9kZWxhYmxlXCIsXG4gIFwidHJhbnNpdGlvblwiLFxuICBcInNob3dcIixcbiAgXCJpZlwiLFxuICBERUZBVUxULFxuICBcInRlbGVwb3J0XCJcbl07XG5mdW5jdGlvbiBieVByaW9yaXR5KGEsIGIpIHtcbiAgbGV0IHR5cGVBID0gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZihhLnR5cGUpID09PSAtMSA/IERFRkFVTFQgOiBhLnR5cGU7XG4gIGxldCB0eXBlQiA9IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoYi50eXBlKSA9PT0gLTEgPyBERUZBVUxUIDogYi50eXBlO1xuICByZXR1cm4gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZih0eXBlQSkgLSBkaXJlY3RpdmVPcmRlci5pbmRleE9mKHR5cGVCKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2Rpc3BhdGNoLmpzXG5mdW5jdGlvbiBkaXNwYXRjaChlbCwgbmFtZSwgZGV0YWlsID0ge30pIHtcbiAgZWwuZGlzcGF0Y2hFdmVudChcbiAgICBuZXcgQ3VzdG9tRXZlbnQobmFtZSwge1xuICAgICAgZGV0YWlsLFxuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIC8vIEFsbG93cyBldmVudHMgdG8gcGFzcyB0aGUgc2hhZG93IERPTSBiYXJyaWVyLlxuICAgICAgY29tcG9zZWQ6IHRydWUsXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgfSlcbiAgKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3dhbGsuanNcbmZ1bmN0aW9uIHdhbGsoZWwsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gXCJmdW5jdGlvblwiICYmIGVsIGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuICAgIEFycmF5LmZyb20oZWwuY2hpbGRyZW4pLmZvckVhY2goKGVsMikgPT4gd2FsayhlbDIsIGNhbGxiYWNrKSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBza2lwID0gZmFsc2U7XG4gIGNhbGxiYWNrKGVsLCAoKSA9PiBza2lwID0gdHJ1ZSk7XG4gIGlmIChza2lwKVxuICAgIHJldHVybjtcbiAgbGV0IG5vZGUgPSBlbC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICB3YWxrKG5vZGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgbm9kZSA9IG5vZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy93YXJuLmpzXG5mdW5jdGlvbiB3YXJuKG1lc3NhZ2UsIC4uLmFyZ3MpIHtcbiAgY29uc29sZS53YXJuKGBBbHBpbmUgV2FybmluZzogJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbGlmZWN5Y2xlLmpzXG52YXIgc3RhcnRlZCA9IGZhbHNlO1xuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIGlmIChzdGFydGVkKVxuICAgIHdhcm4oXCJBbHBpbmUgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZCBvbiB0aGlzIHBhZ2UuIENhbGxpbmcgQWxwaW5lLnN0YXJ0KCkgbW9yZSB0aGFuIG9uY2UgY2FuIGNhdXNlIHByb2JsZW1zLlwiKTtcbiAgc3RhcnRlZCA9IHRydWU7XG4gIGlmICghZG9jdW1lbnQuYm9keSlcbiAgICB3YXJuKFwiVW5hYmxlIHRvIGluaXRpYWxpemUuIFRyeWluZyB0byBsb2FkIEFscGluZSBiZWZvcmUgYDxib2R5PmAgaXMgYXZhaWxhYmxlLiBEaWQgeW91IGZvcmdldCB0byBhZGQgYGRlZmVyYCBpbiBBbHBpbmUncyBgPHNjcmlwdD5gIHRhZz9cIik7XG4gIGRpc3BhdGNoKGRvY3VtZW50LCBcImFscGluZTppbml0XCIpO1xuICBkaXNwYXRjaChkb2N1bWVudCwgXCJhbHBpbmU6aW5pdGlhbGl6aW5nXCIpO1xuICBzdGFydE9ic2VydmluZ011dGF0aW9ucygpO1xuICBvbkVsQWRkZWQoKGVsKSA9PiBpbml0VHJlZShlbCwgd2FsaykpO1xuICBvbkVsUmVtb3ZlZCgoZWwpID0+IGRlc3Ryb3lUcmVlKGVsKSk7XG4gIG9uQXR0cmlidXRlc0FkZGVkKChlbCwgYXR0cnMpID0+IHtcbiAgICBkaXJlY3RpdmVzKGVsLCBhdHRycykuZm9yRWFjaCgoaGFuZGxlKSA9PiBoYW5kbGUoKSk7XG4gIH0pO1xuICBsZXQgb3V0TmVzdGVkQ29tcG9uZW50cyA9IChlbCkgPT4gIWNsb3Nlc3RSb290KGVsLnBhcmVudEVsZW1lbnQsIHRydWUpO1xuICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYWxsU2VsZWN0b3JzKCkuam9pbihcIixcIikpKS5maWx0ZXIob3V0TmVzdGVkQ29tcG9uZW50cykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICBpbml0VHJlZShlbCk7XG4gIH0pO1xuICBkaXNwYXRjaChkb2N1bWVudCwgXCJhbHBpbmU6aW5pdGlhbGl6ZWRcIik7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHdhcm5BYm91dE1pc3NpbmdQbHVnaW5zKCk7XG4gIH0pO1xufVxudmFyIHJvb3RTZWxlY3RvckNhbGxiYWNrcyA9IFtdO1xudmFyIGluaXRTZWxlY3RvckNhbGxiYWNrcyA9IFtdO1xuZnVuY3Rpb24gcm9vdFNlbGVjdG9ycygpIHtcbiAgcmV0dXJuIHJvb3RTZWxlY3RvckNhbGxiYWNrcy5tYXAoKGZuKSA9PiBmbigpKTtcbn1cbmZ1bmN0aW9uIGFsbFNlbGVjdG9ycygpIHtcbiAgcmV0dXJuIHJvb3RTZWxlY3RvckNhbGxiYWNrcy5jb25jYXQoaW5pdFNlbGVjdG9yQ2FsbGJhY2tzKS5tYXAoKGZuKSA9PiBmbigpKTtcbn1cbmZ1bmN0aW9uIGFkZFJvb3RTZWxlY3RvcihzZWxlY3RvckNhbGxiYWNrKSB7XG4gIHJvb3RTZWxlY3RvckNhbGxiYWNrcy5wdXNoKHNlbGVjdG9yQ2FsbGJhY2spO1xufVxuZnVuY3Rpb24gYWRkSW5pdFNlbGVjdG9yKHNlbGVjdG9yQ2FsbGJhY2spIHtcbiAgaW5pdFNlbGVjdG9yQ2FsbGJhY2tzLnB1c2goc2VsZWN0b3JDYWxsYmFjayk7XG59XG5mdW5jdGlvbiBjbG9zZXN0Um9vdChlbCwgaW5jbHVkZUluaXRTZWxlY3RvcnMgPSBmYWxzZSkge1xuICByZXR1cm4gZmluZENsb3Nlc3QoZWwsIChlbGVtZW50KSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0b3JzID0gaW5jbHVkZUluaXRTZWxlY3RvcnMgPyBhbGxTZWxlY3RvcnMoKSA6IHJvb3RTZWxlY3RvcnMoKTtcbiAgICBpZiAoc2VsZWN0b3JzLnNvbWUoKHNlbGVjdG9yKSA9PiBlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSlcbiAgICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGZpbmRDbG9zZXN0KGVsLCBjYWxsYmFjaykge1xuICBpZiAoIWVsKVxuICAgIHJldHVybjtcbiAgaWYgKGNhbGxiYWNrKGVsKSlcbiAgICByZXR1cm4gZWw7XG4gIGlmIChlbC5feF90ZWxlcG9ydEJhY2spXG4gICAgZWwgPSBlbC5feF90ZWxlcG9ydEJhY2s7XG4gIGlmICghZWwucGFyZW50RWxlbWVudClcbiAgICByZXR1cm47XG4gIHJldHVybiBmaW5kQ2xvc2VzdChlbC5wYXJlbnRFbGVtZW50LCBjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBpc1Jvb3QoZWwpIHtcbiAgcmV0dXJuIHJvb3RTZWxlY3RvcnMoKS5zb21lKChzZWxlY3RvcikgPT4gZWwubWF0Y2hlcyhzZWxlY3RvcikpO1xufVxudmFyIGluaXRJbnRlcmNlcHRvcnMyID0gW107XG5mdW5jdGlvbiBpbnRlcmNlcHRJbml0KGNhbGxiYWNrKSB7XG4gIGluaXRJbnRlcmNlcHRvcnMyLnB1c2goY2FsbGJhY2spO1xufVxudmFyIG1hcmtlckRpc3BlbnNlciA9IDE7XG5mdW5jdGlvbiBpbml0VHJlZShlbCwgd2Fsa2VyID0gd2FsaywgaW50ZXJjZXB0ID0gKCkgPT4ge1xufSkge1xuICBpZiAoZmluZENsb3Nlc3QoZWwsIChpKSA9PiBpLl94X2lnbm9yZSkpXG4gICAgcmV0dXJuO1xuICBkZWZlckhhbmRsaW5nRGlyZWN0aXZlcygoKSA9PiB7XG4gICAgd2Fsa2VyKGVsLCAoZWwyLCBza2lwKSA9PiB7XG4gICAgICBpZiAoZWwyLl94X21hcmtlcilcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaW50ZXJjZXB0KGVsMiwgc2tpcCk7XG4gICAgICBpbml0SW50ZXJjZXB0b3JzMi5mb3JFYWNoKChpKSA9PiBpKGVsMiwgc2tpcCkpO1xuICAgICAgZGlyZWN0aXZlcyhlbDIsIGVsMi5hdHRyaWJ1dGVzKS5mb3JFYWNoKChoYW5kbGUpID0+IGhhbmRsZSgpKTtcbiAgICAgIGlmICghZWwyLl94X2lnbm9yZSlcbiAgICAgICAgZWwyLl94X21hcmtlciA9IG1hcmtlckRpc3BlbnNlcisrO1xuICAgICAgZWwyLl94X2lnbm9yZSAmJiBza2lwKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gZGVzdHJveVRyZWUocm9vdCwgd2Fsa2VyID0gd2Fsaykge1xuICB3YWxrZXIocm9vdCwgKGVsKSA9PiB7XG4gICAgY2xlYW51cEVsZW1lbnQoZWwpO1xuICAgIGNsZWFudXBBdHRyaWJ1dGVzKGVsKTtcbiAgICBkZWxldGUgZWwuX3hfbWFya2VyO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHdhcm5BYm91dE1pc3NpbmdQbHVnaW5zKCkge1xuICBsZXQgcGx1Z2luRGlyZWN0aXZlcyA9IFtcbiAgICBbXCJ1aVwiLCBcImRpYWxvZ1wiLCBbXCJbeC1kaWFsb2ddLCBbeC1wb3BvdmVyXVwiXV0sXG4gICAgW1wiYW5jaG9yXCIsIFwiYW5jaG9yXCIsIFtcIlt4LWFuY2hvcl1cIl1dLFxuICAgIFtcInNvcnRcIiwgXCJzb3J0XCIsIFtcIlt4LXNvcnRdXCJdXVxuICBdO1xuICBwbHVnaW5EaXJlY3RpdmVzLmZvckVhY2goKFtwbHVnaW4yLCBkaXJlY3RpdmUyLCBzZWxlY3RvcnNdKSA9PiB7XG4gICAgaWYgKGRpcmVjdGl2ZUV4aXN0cyhkaXJlY3RpdmUyKSlcbiAgICAgIHJldHVybjtcbiAgICBzZWxlY3RvcnMuc29tZSgoc2VsZWN0b3IpID0+IHtcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkge1xuICAgICAgICB3YXJuKGBmb3VuZCBcIiR7c2VsZWN0b3J9XCIsIGJ1dCBtaXNzaW5nICR7cGx1Z2luMn0gcGx1Z2luYCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL25leHRUaWNrLmpzXG52YXIgdGlja1N0YWNrID0gW107XG52YXIgaXNIb2xkaW5nID0gZmFsc2U7XG5mdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjayA9ICgpID0+IHtcbn0pIHtcbiAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgIGlzSG9sZGluZyB8fCBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJlbGVhc2VOZXh0VGlja3MoKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzKSA9PiB7XG4gICAgdGlja1N0YWNrLnB1c2goKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHJlcygpO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHJlbGVhc2VOZXh0VGlja3MoKSB7XG4gIGlzSG9sZGluZyA9IGZhbHNlO1xuICB3aGlsZSAodGlja1N0YWNrLmxlbmd0aClcbiAgICB0aWNrU3RhY2suc2hpZnQoKSgpO1xufVxuZnVuY3Rpb24gaG9sZE5leHRUaWNrcygpIHtcbiAgaXNIb2xkaW5nID0gdHJ1ZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2NsYXNzZXMuanNcbmZ1bmN0aW9uIHNldENsYXNzZXMoZWwsIHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBzZXRDbGFzc2VzRnJvbVN0cmluZyhlbCwgdmFsdWUuam9pbihcIiBcIikpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgIHJldHVybiBzZXRDbGFzc2VzRnJvbU9iamVjdChlbCwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIHNldENsYXNzZXMoZWwsIHZhbHVlKCkpO1xuICB9XG4gIHJldHVybiBzZXRDbGFzc2VzRnJvbVN0cmluZyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gc2V0Q2xhc3Nlc0Zyb21TdHJpbmcoZWwsIGNsYXNzU3RyaW5nKSB7XG4gIGxldCBzcGxpdCA9IChjbGFzc1N0cmluZzIpID0+IGNsYXNzU3RyaW5nMi5zcGxpdChcIiBcIikuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgbWlzc2luZ0NsYXNzZXMgPSAoY2xhc3NTdHJpbmcyKSA9PiBjbGFzc1N0cmluZzIuc3BsaXQoXCIgXCIpLmZpbHRlcigoaSkgPT4gIWVsLmNsYXNzTGlzdC5jb250YWlucyhpKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgYWRkQ2xhc3Nlc0FuZFJldHVyblVuZG8gPSAoY2xhc3NlcykgPT4ge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlcyk7XG4gICAgfTtcbiAgfTtcbiAgY2xhc3NTdHJpbmcgPSBjbGFzc1N0cmluZyA9PT0gdHJ1ZSA/IGNsYXNzU3RyaW5nID0gXCJcIiA6IGNsYXNzU3RyaW5nIHx8IFwiXCI7XG4gIHJldHVybiBhZGRDbGFzc2VzQW5kUmV0dXJuVW5kbyhtaXNzaW5nQ2xhc3NlcyhjbGFzc1N0cmluZykpO1xufVxuZnVuY3Rpb24gc2V0Q2xhc3Nlc0Zyb21PYmplY3QoZWwsIGNsYXNzT2JqZWN0KSB7XG4gIGxldCBzcGxpdCA9IChjbGFzc1N0cmluZykgPT4gY2xhc3NTdHJpbmcuc3BsaXQoXCIgXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGZvckFkZCA9IE9iamVjdC5lbnRyaWVzKGNsYXNzT2JqZWN0KS5mbGF0TWFwKChbY2xhc3NTdHJpbmcsIGJvb2xdKSA9PiBib29sID8gc3BsaXQoY2xhc3NTdHJpbmcpIDogZmFsc2UpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGZvclJlbW92ZSA9IE9iamVjdC5lbnRyaWVzKGNsYXNzT2JqZWN0KS5mbGF0TWFwKChbY2xhc3NTdHJpbmcsIGJvb2xdKSA9PiAhYm9vbCA/IHNwbGl0KGNsYXNzU3RyaW5nKSA6IGZhbHNlKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBhZGRlZCA9IFtdO1xuICBsZXQgcmVtb3ZlZCA9IFtdO1xuICBmb3JSZW1vdmUuZm9yRWFjaCgoaSkgPT4ge1xuICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoaSkpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoaSk7XG4gICAgICByZW1vdmVkLnB1c2goaSk7XG4gICAgfVxuICB9KTtcbiAgZm9yQWRkLmZvckVhY2goKGkpID0+IHtcbiAgICBpZiAoIWVsLmNsYXNzTGlzdC5jb250YWlucyhpKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChpKTtcbiAgICAgIGFkZGVkLnB1c2goaSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICByZW1vdmVkLmZvckVhY2goKGkpID0+IGVsLmNsYXNzTGlzdC5hZGQoaSkpO1xuICAgIGFkZGVkLmZvckVhY2goKGkpID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoaSkpO1xuICB9O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvc3R5bGVzLmpzXG5mdW5jdGlvbiBzZXRTdHlsZXMoZWwsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICByZXR1cm4gc2V0U3R5bGVzRnJvbU9iamVjdChlbCwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBzZXRTdHlsZXNGcm9tU3RyaW5nKGVsLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBzZXRTdHlsZXNGcm9tT2JqZWN0KGVsLCB2YWx1ZSkge1xuICBsZXQgcHJldmlvdXNTdHlsZXMgPSB7fTtcbiAgT2JqZWN0LmVudHJpZXModmFsdWUpLmZvckVhY2goKFtrZXksIHZhbHVlMl0pID0+IHtcbiAgICBwcmV2aW91c1N0eWxlc1trZXldID0gZWwuc3R5bGVba2V5XTtcbiAgICBpZiAoIWtleS5zdGFydHNXaXRoKFwiLS1cIikpIHtcbiAgICAgIGtleSA9IGtlYmFiQ2FzZShrZXkpO1xuICAgIH1cbiAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlMik7XG4gIH0pO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpZiAoZWwuc3R5bGUubGVuZ3RoID09PSAwKSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHNldFN0eWxlcyhlbCwgcHJldmlvdXNTdHlsZXMpO1xuICB9O1xufVxuZnVuY3Rpb24gc2V0U3R5bGVzRnJvbVN0cmluZyhlbCwgdmFsdWUpIHtcbiAgbGV0IGNhY2hlID0gZWwuZ2V0QXR0cmlidXRlKFwic3R5bGVcIiwgdmFsdWUpO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCB2YWx1ZSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgZWwuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgY2FjaGUgfHwgXCJcIik7XG4gIH07XG59XG5mdW5jdGlvbiBrZWJhYkNhc2Uoc3ViamVjdCkge1xuICByZXR1cm4gc3ViamVjdC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBcIiQxLSQyXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9vbmNlLmpzXG5mdW5jdGlvbiBvbmNlKGNhbGxiYWNrLCBmYWxsYmFjayA9ICgpID0+IHtcbn0pIHtcbiAgbGV0IGNhbGxlZCA9IGZhbHNlO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC10cmFuc2l0aW9uLmpzXG5kaXJlY3RpdmUoXCJ0cmFuc2l0aW9uXCIsIChlbCwgeyB2YWx1ZSwgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0sIHsgZXZhbHVhdGU6IGV2YWx1YXRlMiB9KSA9PiB7XG4gIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJmdW5jdGlvblwiKVxuICAgIGV4cHJlc3Npb24gPSBldmFsdWF0ZTIoZXhwcmVzc2lvbik7XG4gIGlmIChleHByZXNzaW9uID09PSBmYWxzZSlcbiAgICByZXR1cm47XG4gIGlmICghZXhwcmVzc2lvbiB8fCB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJib29sZWFuXCIpIHtcbiAgICByZWdpc3RlclRyYW5zaXRpb25zRnJvbUhlbHBlcihlbCwgbW9kaWZpZXJzLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21DbGFzc1N0cmluZyhlbCwgZXhwcmVzc2lvbiwgdmFsdWUpO1xuICB9XG59KTtcbmZ1bmN0aW9uIHJlZ2lzdGVyVHJhbnNpdGlvbnNGcm9tQ2xhc3NTdHJpbmcoZWwsIGNsYXNzU3RyaW5nLCBzdGFnZSkge1xuICByZWdpc3RlclRyYW5zaXRpb25PYmplY3QoZWwsIHNldENsYXNzZXMsIFwiXCIpO1xuICBsZXQgZGlyZWN0aXZlU3RvcmFnZU1hcCA9IHtcbiAgICBcImVudGVyXCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLmR1cmluZyA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImVudGVyLXN0YXJ0XCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLnN0YXJ0ID0gY2xhc3NlcztcbiAgICB9LFxuICAgIFwiZW50ZXItZW5kXCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLmVuZCA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImxlYXZlXCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmR1cmluZyA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImxlYXZlLXN0YXJ0XCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLnN0YXJ0ID0gY2xhc3NlcztcbiAgICB9LFxuICAgIFwibGVhdmUtZW5kXCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmVuZCA9IGNsYXNzZXM7XG4gICAgfVxuICB9O1xuICBkaXJlY3RpdmVTdG9yYWdlTWFwW3N0YWdlXShjbGFzc1N0cmluZyk7XG59XG5mdW5jdGlvbiByZWdpc3RlclRyYW5zaXRpb25zRnJvbUhlbHBlcihlbCwgbW9kaWZpZXJzLCBzdGFnZSkge1xuICByZWdpc3RlclRyYW5zaXRpb25PYmplY3QoZWwsIHNldFN0eWxlcyk7XG4gIGxldCBkb2VzbnRTcGVjaWZ5ID0gIW1vZGlmaWVycy5pbmNsdWRlcyhcImluXCIpICYmICFtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRcIikgJiYgIXN0YWdlO1xuICBsZXQgdHJhbnNpdGlvbmluZ0luID0gZG9lc250U3BlY2lmeSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJpblwiKSB8fCBbXCJlbnRlclwiXS5pbmNsdWRlcyhzdGFnZSk7XG4gIGxldCB0cmFuc2l0aW9uaW5nT3V0ID0gZG9lc250U3BlY2lmeSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRcIikgfHwgW1wibGVhdmVcIl0uaW5jbHVkZXMoc3RhZ2UpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiaW5cIikgJiYgIWRvZXNudFNwZWNpZnkpIHtcbiAgICBtb2RpZmllcnMgPSBtb2RpZmllcnMuZmlsdGVyKChpLCBpbmRleCkgPT4gaW5kZXggPCBtb2RpZmllcnMuaW5kZXhPZihcIm91dFwiKSk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm91dFwiKSAmJiAhZG9lc250U3BlY2lmeSkge1xuICAgIG1vZGlmaWVycyA9IG1vZGlmaWVycy5maWx0ZXIoKGksIGluZGV4KSA9PiBpbmRleCA+IG1vZGlmaWVycy5pbmRleE9mKFwib3V0XCIpKTtcbiAgfVxuICBsZXQgd2FudHNBbGwgPSAhbW9kaWZpZXJzLmluY2x1ZGVzKFwib3BhY2l0eVwiKSAmJiAhbW9kaWZpZXJzLmluY2x1ZGVzKFwic2NhbGVcIik7XG4gIGxldCB3YW50c09wYWNpdHkgPSB3YW50c0FsbCB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJvcGFjaXR5XCIpO1xuICBsZXQgd2FudHNTY2FsZSA9IHdhbnRzQWxsIHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcInNjYWxlXCIpO1xuICBsZXQgb3BhY2l0eVZhbHVlID0gd2FudHNPcGFjaXR5ID8gMCA6IDE7XG4gIGxldCBzY2FsZVZhbHVlID0gd2FudHNTY2FsZSA/IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcInNjYWxlXCIsIDk1KSAvIDEwMCA6IDE7XG4gIGxldCBkZWxheSA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcImRlbGF5XCIsIDApIC8gMWUzO1xuICBsZXQgb3JpZ2luID0gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIFwib3JpZ2luXCIsIFwiY2VudGVyXCIpO1xuICBsZXQgcHJvcGVydHkgPSBcIm9wYWNpdHksIHRyYW5zZm9ybVwiO1xuICBsZXQgZHVyYXRpb25JbiA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcImR1cmF0aW9uXCIsIDE1MCkgLyAxZTM7XG4gIGxldCBkdXJhdGlvbk91dCA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcImR1cmF0aW9uXCIsIDc1KSAvIDFlMztcbiAgbGV0IGVhc2luZyA9IGBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSlgO1xuICBpZiAodHJhbnNpdGlvbmluZ0luKSB7XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcgPSB7XG4gICAgICB0cmFuc2Zvcm1PcmlnaW46IG9yaWdpbixcbiAgICAgIHRyYW5zaXRpb25EZWxheTogYCR7ZGVsYXl9c2AsXG4gICAgICB0cmFuc2l0aW9uUHJvcGVydHk6IHByb3BlcnR5LFxuICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBgJHtkdXJhdGlvbklufXNgLFxuICAgICAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiBlYXNpbmdcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuc3RhcnQgPSB7XG4gICAgICBvcGFjaXR5OiBvcGFjaXR5VmFsdWUsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgke3NjYWxlVmFsdWV9KWBcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZW5kID0ge1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDEpYFxuICAgIH07XG4gIH1cbiAgaWYgKHRyYW5zaXRpb25pbmdPdXQpIHtcbiAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmR1cmluZyA9IHtcbiAgICAgIHRyYW5zZm9ybU9yaWdpbjogb3JpZ2luLFxuICAgICAgdHJhbnNpdGlvbkRlbGF5OiBgJHtkZWxheX1zYCxcbiAgICAgIHRyYW5zaXRpb25Qcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICB0cmFuc2l0aW9uRHVyYXRpb246IGAke2R1cmF0aW9uT3V0fXNgLFxuICAgICAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiBlYXNpbmdcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24ubGVhdmUuc3RhcnQgPSB7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoMSlgXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmVuZCA9IHtcbiAgICAgIG9wYWNpdHk6IG9wYWNpdHlWYWx1ZSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKCR7c2NhbGVWYWx1ZX0pYFxuICAgIH07XG4gIH1cbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyVHJhbnNpdGlvbk9iamVjdChlbCwgc2V0RnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSA9IHt9KSB7XG4gIGlmICghZWwuX3hfdHJhbnNpdGlvbilcbiAgICBlbC5feF90cmFuc2l0aW9uID0ge1xuICAgICAgZW50ZXI6IHsgZHVyaW5nOiBkZWZhdWx0VmFsdWUsIHN0YXJ0OiBkZWZhdWx0VmFsdWUsIGVuZDogZGVmYXVsdFZhbHVlIH0sXG4gICAgICBsZWF2ZTogeyBkdXJpbmc6IGRlZmF1bHRWYWx1ZSwgc3RhcnQ6IGRlZmF1bHRWYWx1ZSwgZW5kOiBkZWZhdWx0VmFsdWUgfSxcbiAgICAgIGluKGJlZm9yZSA9ICgpID0+IHtcbiAgICAgIH0sIGFmdGVyID0gKCkgPT4ge1xuICAgICAgfSkge1xuICAgICAgICB0cmFuc2l0aW9uKGVsLCBzZXRGdW5jdGlvbiwge1xuICAgICAgICAgIGR1cmluZzogdGhpcy5lbnRlci5kdXJpbmcsXG4gICAgICAgICAgc3RhcnQ6IHRoaXMuZW50ZXIuc3RhcnQsXG4gICAgICAgICAgZW5kOiB0aGlzLmVudGVyLmVuZFxuICAgICAgICB9LCBiZWZvcmUsIGFmdGVyKTtcbiAgICAgIH0sXG4gICAgICBvdXQoYmVmb3JlID0gKCkgPT4ge1xuICAgICAgfSwgYWZ0ZXIgPSAoKSA9PiB7XG4gICAgICB9KSB7XG4gICAgICAgIHRyYW5zaXRpb24oZWwsIHNldEZ1bmN0aW9uLCB7XG4gICAgICAgICAgZHVyaW5nOiB0aGlzLmxlYXZlLmR1cmluZyxcbiAgICAgICAgICBzdGFydDogdGhpcy5sZWF2ZS5zdGFydCxcbiAgICAgICAgICBlbmQ6IHRoaXMubGVhdmUuZW5kXG4gICAgICAgIH0sIGJlZm9yZSwgYWZ0ZXIpO1xuICAgICAgfVxuICAgIH07XG59XG53aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuX3hfdG9nZ2xlQW5kQ2FzY2FkZVdpdGhUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSwgc2hvdywgaGlkZSkge1xuICBjb25zdCBuZXh0VGljazIgPSBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09IFwidmlzaWJsZVwiID8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIDogc2V0VGltZW91dDtcbiAgbGV0IGNsaWNrQXdheUNvbXBhdGlibGVTaG93ID0gKCkgPT4gbmV4dFRpY2syKHNob3cpO1xuICBpZiAodmFsdWUpIHtcbiAgICBpZiAoZWwuX3hfdHJhbnNpdGlvbiAmJiAoZWwuX3hfdHJhbnNpdGlvbi5lbnRlciB8fCBlbC5feF90cmFuc2l0aW9uLmxlYXZlKSkge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlciAmJiAoT2JqZWN0LmVudHJpZXMoZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcpLmxlbmd0aCB8fCBPYmplY3QuZW50cmllcyhlbC5feF90cmFuc2l0aW9uLmVudGVyLnN0YXJ0KS5sZW5ndGggfHwgT2JqZWN0LmVudHJpZXMoZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5lbmQpLmxlbmd0aCkgPyBlbC5feF90cmFuc2l0aW9uLmluKHNob3cpIDogY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbiA/IGVsLl94X3RyYW5zaXRpb24uaW4oc2hvdykgOiBjbGlja0F3YXlDb21wYXRpYmxlU2hvdygpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgZWwuX3hfaGlkZVByb21pc2UgPSBlbC5feF90cmFuc2l0aW9uID8gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGVsLl94X3RyYW5zaXRpb24ub3V0KCgpID0+IHtcbiAgICB9LCAoKSA9PiByZXNvbHZlKGhpZGUpKTtcbiAgICBlbC5feF90cmFuc2l0aW9uaW5nICYmIGVsLl94X3RyYW5zaXRpb25pbmcuYmVmb3JlQ2FuY2VsKCgpID0+IHJlamVjdCh7IGlzRnJvbUNhbmNlbGxlZFRyYW5zaXRpb246IHRydWUgfSkpO1xuICB9KSA6IFByb21pc2UucmVzb2x2ZShoaWRlKTtcbiAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgIGxldCBjbG9zZXN0ID0gY2xvc2VzdEhpZGUoZWwpO1xuICAgIGlmIChjbG9zZXN0KSB7XG4gICAgICBpZiAoIWNsb3Nlc3QuX3hfaGlkZUNoaWxkcmVuKVxuICAgICAgICBjbG9zZXN0Ll94X2hpZGVDaGlsZHJlbiA9IFtdO1xuICAgICAgY2xvc2VzdC5feF9oaWRlQ2hpbGRyZW4ucHVzaChlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRUaWNrMigoKSA9PiB7XG4gICAgICAgIGxldCBoaWRlQWZ0ZXJDaGlsZHJlbiA9IChlbDIpID0+IHtcbiAgICAgICAgICBsZXQgY2FycnkgPSBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBlbDIuX3hfaGlkZVByb21pc2UsXG4gICAgICAgICAgICAuLi4oZWwyLl94X2hpZGVDaGlsZHJlbiB8fCBbXSkubWFwKGhpZGVBZnRlckNoaWxkcmVuKVxuICAgICAgICAgIF0pLnRoZW4oKFtpXSkgPT4gaT8uKCkpO1xuICAgICAgICAgIGRlbGV0ZSBlbDIuX3hfaGlkZVByb21pc2U7XG4gICAgICAgICAgZGVsZXRlIGVsMi5feF9oaWRlQ2hpbGRyZW47XG4gICAgICAgICAgcmV0dXJuIGNhcnJ5O1xuICAgICAgICB9O1xuICAgICAgICBoaWRlQWZ0ZXJDaGlsZHJlbihlbCkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICBpZiAoIWUuaXNGcm9tQ2FuY2VsbGVkVHJhbnNpdGlvbilcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5mdW5jdGlvbiBjbG9zZXN0SGlkZShlbCkge1xuICBsZXQgcGFyZW50ID0gZWwucGFyZW50Tm9kZTtcbiAgaWYgKCFwYXJlbnQpXG4gICAgcmV0dXJuO1xuICByZXR1cm4gcGFyZW50Ll94X2hpZGVQcm9taXNlID8gcGFyZW50IDogY2xvc2VzdEhpZGUocGFyZW50KTtcbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb24oZWwsIHNldEZ1bmN0aW9uLCB7IGR1cmluZywgc3RhcnQ6IHN0YXJ0MiwgZW5kIH0gPSB7fSwgYmVmb3JlID0gKCkgPT4ge1xufSwgYWZ0ZXIgPSAoKSA9PiB7XG59KSB7XG4gIGlmIChlbC5feF90cmFuc2l0aW9uaW5nKVxuICAgIGVsLl94X3RyYW5zaXRpb25pbmcuY2FuY2VsKCk7XG4gIGlmIChPYmplY3Qua2V5cyhkdXJpbmcpLmxlbmd0aCA9PT0gMCAmJiBPYmplY3Qua2V5cyhzdGFydDIpLmxlbmd0aCA9PT0gMCAmJiBPYmplY3Qua2V5cyhlbmQpLmxlbmd0aCA9PT0gMCkge1xuICAgIGJlZm9yZSgpO1xuICAgIGFmdGVyKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCB1bmRvU3RhcnQsIHVuZG9EdXJpbmcsIHVuZG9FbmQ7XG4gIHBlcmZvcm1UcmFuc2l0aW9uKGVsLCB7XG4gICAgc3RhcnQoKSB7XG4gICAgICB1bmRvU3RhcnQgPSBzZXRGdW5jdGlvbihlbCwgc3RhcnQyKTtcbiAgICB9LFxuICAgIGR1cmluZygpIHtcbiAgICAgIHVuZG9EdXJpbmcgPSBzZXRGdW5jdGlvbihlbCwgZHVyaW5nKTtcbiAgICB9LFxuICAgIGJlZm9yZSxcbiAgICBlbmQoKSB7XG4gICAgICB1bmRvU3RhcnQoKTtcbiAgICAgIHVuZG9FbmQgPSBzZXRGdW5jdGlvbihlbCwgZW5kKTtcbiAgICB9LFxuICAgIGFmdGVyLFxuICAgIGNsZWFudXAoKSB7XG4gICAgICB1bmRvRHVyaW5nKCk7XG4gICAgICB1bmRvRW5kKCk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIHBlcmZvcm1UcmFuc2l0aW9uKGVsLCBzdGFnZXMpIHtcbiAgbGV0IGludGVycnVwdGVkLCByZWFjaGVkQmVmb3JlLCByZWFjaGVkRW5kO1xuICBsZXQgZmluaXNoID0gb25jZSgoKSA9PiB7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGludGVycnVwdGVkID0gdHJ1ZTtcbiAgICAgIGlmICghcmVhY2hlZEJlZm9yZSlcbiAgICAgICAgc3RhZ2VzLmJlZm9yZSgpO1xuICAgICAgaWYgKCFyZWFjaGVkRW5kKSB7XG4gICAgICAgIHN0YWdlcy5lbmQoKTtcbiAgICAgICAgcmVsZWFzZU5leHRUaWNrcygpO1xuICAgICAgfVxuICAgICAgc3RhZ2VzLmFmdGVyKCk7XG4gICAgICBpZiAoZWwuaXNDb25uZWN0ZWQpXG4gICAgICAgIHN0YWdlcy5jbGVhbnVwKCk7XG4gICAgICBkZWxldGUgZWwuX3hfdHJhbnNpdGlvbmluZztcbiAgICB9KTtcbiAgfSk7XG4gIGVsLl94X3RyYW5zaXRpb25pbmcgPSB7XG4gICAgYmVmb3JlQ2FuY2VsczogW10sXG4gICAgYmVmb3JlQ2FuY2VsKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmJlZm9yZUNhbmNlbHMucHVzaChjYWxsYmFjayk7XG4gICAgfSxcbiAgICBjYW5jZWw6IG9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICB3aGlsZSAodGhpcy5iZWZvcmVDYW5jZWxzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmJlZm9yZUNhbmNlbHMuc2hpZnQoKSgpO1xuICAgICAgfVxuICAgICAgO1xuICAgICAgZmluaXNoKCk7XG4gICAgfSksXG4gICAgZmluaXNoXG4gIH07XG4gIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgc3RhZ2VzLnN0YXJ0KCk7XG4gICAgc3RhZ2VzLmR1cmluZygpO1xuICB9KTtcbiAgaG9sZE5leHRUaWNrcygpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIGlmIChpbnRlcnJ1cHRlZClcbiAgICAgIHJldHVybjtcbiAgICBsZXQgZHVyYXRpb24gPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkR1cmF0aW9uLnJlcGxhY2UoLywuKi8sIFwiXCIpLnJlcGxhY2UoXCJzXCIsIFwiXCIpKSAqIDFlMztcbiAgICBsZXQgZGVsYXkgPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkRlbGF5LnJlcGxhY2UoLywuKi8sIFwiXCIpLnJlcGxhY2UoXCJzXCIsIFwiXCIpKSAqIDFlMztcbiAgICBpZiAoZHVyYXRpb24gPT09IDApXG4gICAgICBkdXJhdGlvbiA9IE51bWJlcihnZXRDb21wdXRlZFN0eWxlKGVsKS5hbmltYXRpb25EdXJhdGlvbi5yZXBsYWNlKFwic1wiLCBcIlwiKSkgKiAxZTM7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIHN0YWdlcy5iZWZvcmUoKTtcbiAgICB9KTtcbiAgICByZWFjaGVkQmVmb3JlID0gdHJ1ZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKGludGVycnVwdGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBzdGFnZXMuZW5kKCk7XG4gICAgICB9KTtcbiAgICAgIHJlbGVhc2VOZXh0VGlja3MoKTtcbiAgICAgIHNldFRpbWVvdXQoZWwuX3hfdHJhbnNpdGlvbmluZy5maW5pc2gsIGR1cmF0aW9uICsgZGVsYXkpO1xuICAgICAgcmVhY2hlZEVuZCA9IHRydWU7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIGtleSwgZmFsbGJhY2spIHtcbiAgaWYgKG1vZGlmaWVycy5pbmRleE9mKGtleSkgPT09IC0xKVxuICAgIHJldHVybiBmYWxsYmFjaztcbiAgY29uc3QgcmF3VmFsdWUgPSBtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2Yoa2V5KSArIDFdO1xuICBpZiAoIXJhd1ZhbHVlKVxuICAgIHJldHVybiBmYWxsYmFjaztcbiAgaWYgKGtleSA9PT0gXCJzY2FsZVwiKSB7XG4gICAgaWYgKGlzTmFOKHJhd1ZhbHVlKSlcbiAgICAgIHJldHVybiBmYWxsYmFjaztcbiAgfVxuICBpZiAoa2V5ID09PSBcImR1cmF0aW9uXCIgfHwga2V5ID09PSBcImRlbGF5XCIpIHtcbiAgICBsZXQgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaCgvKFswLTldKyltcy8pO1xuICAgIGlmIChtYXRjaClcbiAgICAgIHJldHVybiBtYXRjaFsxXTtcbiAgfVxuICBpZiAoa2V5ID09PSBcIm9yaWdpblwiKSB7XG4gICAgaWYgKFtcInRvcFwiLCBcInJpZ2h0XCIsIFwibGVmdFwiLCBcImNlbnRlclwiLCBcImJvdHRvbVwiXS5pbmNsdWRlcyhtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2Yoa2V5KSArIDJdKSkge1xuICAgICAgcmV0dXJuIFtyYXdWYWx1ZSwgbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAyXV0uam9pbihcIiBcIik7XG4gICAgfVxuICB9XG4gIHJldHVybiByYXdWYWx1ZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2Nsb25lLmpzXG52YXIgaXNDbG9uaW5nID0gZmFsc2U7XG5mdW5jdGlvbiBza2lwRHVyaW5nQ2xvbmUoY2FsbGJhY2ssIGZhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICByZXR1cm4gKC4uLmFyZ3MpID0+IGlzQ2xvbmluZyA/IGZhbGxiYWNrKC4uLmFyZ3MpIDogY2FsbGJhY2soLi4uYXJncyk7XG59XG5mdW5jdGlvbiBvbmx5RHVyaW5nQ2xvbmUoY2FsbGJhY2spIHtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiBpc0Nsb25pbmcgJiYgY2FsbGJhY2soLi4uYXJncyk7XG59XG52YXIgaW50ZXJjZXB0b3JzID0gW107XG5mdW5jdGlvbiBpbnRlcmNlcHRDbG9uZShjYWxsYmFjaykge1xuICBpbnRlcmNlcHRvcnMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBjbG9uZU5vZGUoZnJvbSwgdG8pIHtcbiAgaW50ZXJjZXB0b3JzLmZvckVhY2goKGkpID0+IGkoZnJvbSwgdG8pKTtcbiAgaXNDbG9uaW5nID0gdHJ1ZTtcbiAgZG9udFJlZ2lzdGVyUmVhY3RpdmVTaWRlRWZmZWN0cygoKSA9PiB7XG4gICAgaW5pdFRyZWUodG8sIChlbCwgY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGVsLCAoKSA9PiB7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIGlzQ2xvbmluZyA9IGZhbHNlO1xufVxudmFyIGlzQ2xvbmluZ0xlZ2FjeSA9IGZhbHNlO1xuZnVuY3Rpb24gY2xvbmUob2xkRWwsIG5ld0VsKSB7XG4gIGlmICghbmV3RWwuX3hfZGF0YVN0YWNrKVxuICAgIG5ld0VsLl94X2RhdGFTdGFjayA9IG9sZEVsLl94X2RhdGFTdGFjaztcbiAgaXNDbG9uaW5nID0gdHJ1ZTtcbiAgaXNDbG9uaW5nTGVnYWN5ID0gdHJ1ZTtcbiAgZG9udFJlZ2lzdGVyUmVhY3RpdmVTaWRlRWZmZWN0cygoKSA9PiB7XG4gICAgY2xvbmVUcmVlKG5ld0VsKTtcbiAgfSk7XG4gIGlzQ2xvbmluZyA9IGZhbHNlO1xuICBpc0Nsb25pbmdMZWdhY3kgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIGNsb25lVHJlZShlbCkge1xuICBsZXQgaGFzUnVuVGhyb3VnaEZpcnN0RWwgPSBmYWxzZTtcbiAgbGV0IHNoYWxsb3dXYWxrZXIgPSAoZWwyLCBjYWxsYmFjaykgPT4ge1xuICAgIHdhbGsoZWwyLCAoZWwzLCBza2lwKSA9PiB7XG4gICAgICBpZiAoaGFzUnVuVGhyb3VnaEZpcnN0RWwgJiYgaXNSb290KGVsMykpXG4gICAgICAgIHJldHVybiBza2lwKCk7XG4gICAgICBoYXNSdW5UaHJvdWdoRmlyc3RFbCA9IHRydWU7XG4gICAgICBjYWxsYmFjayhlbDMsIHNraXApO1xuICAgIH0pO1xuICB9O1xuICBpbml0VHJlZShlbCwgc2hhbGxvd1dhbGtlcik7XG59XG5mdW5jdGlvbiBkb250UmVnaXN0ZXJSZWFjdGl2ZVNpZGVFZmZlY3RzKGNhbGxiYWNrKSB7XG4gIGxldCBjYWNoZSA9IGVmZmVjdDtcbiAgb3ZlcnJpZGVFZmZlY3QoKGNhbGxiYWNrMiwgZWwpID0+IHtcbiAgICBsZXQgc3RvcmVkRWZmZWN0ID0gY2FjaGUoY2FsbGJhY2syKTtcbiAgICByZWxlYXNlKHN0b3JlZEVmZmVjdCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICB9O1xuICB9KTtcbiAgY2FsbGJhY2soKTtcbiAgb3ZlcnJpZGVFZmZlY3QoY2FjaGUpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvYmluZC5qc1xuZnVuY3Rpb24gYmluZChlbCwgbmFtZSwgdmFsdWUsIG1vZGlmaWVycyA9IFtdKSB7XG4gIGlmICghZWwuX3hfYmluZGluZ3MpXG4gICAgZWwuX3hfYmluZGluZ3MgPSByZWFjdGl2ZSh7fSk7XG4gIGVsLl94X2JpbmRpbmdzW25hbWVdID0gdmFsdWU7XG4gIG5hbWUgPSBtb2RpZmllcnMuaW5jbHVkZXMoXCJjYW1lbFwiKSA/IGNhbWVsQ2FzZShuYW1lKSA6IG5hbWU7XG4gIHN3aXRjaCAobmFtZSkge1xuICAgIGNhc2UgXCJ2YWx1ZVwiOlxuICAgICAgYmluZElucHV0VmFsdWUoZWwsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgYmluZFN0eWxlcyhlbCwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImNsYXNzXCI6XG4gICAgICBiaW5kQ2xhc3NlcyhlbCwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNlbGVjdGVkXCI6XG4gICAgY2FzZSBcImNoZWNrZWRcIjpcbiAgICAgIGJpbmRBdHRyaWJ1dGVBbmRQcm9wZXJ0eShlbCwgbmFtZSwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJpbmRBdHRyaWJ1dGUoZWwsIG5hbWUsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICB9XG59XG5mdW5jdGlvbiBiaW5kSW5wdXRWYWx1ZShlbCwgdmFsdWUpIHtcbiAgaWYgKGlzUmFkaW8oZWwpKSB7XG4gICAgaWYgKGVsLmF0dHJpYnV0ZXMudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgZWwudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5mcm9tTW9kZWwpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIGVsLmNoZWNrZWQgPSBzYWZlUGFyc2VCb29sZWFuKGVsLnZhbHVlKSA9PT0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jaGVja2VkID0gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUoZWwudmFsdWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNDaGVja2JveChlbCkpIHtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgIGVsLnZhbHVlID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlICE9PSBcImJvb2xlYW5cIiAmJiAhW251bGwsIHZvaWQgMF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICBlbC52YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBlbC5jaGVja2VkID0gdmFsdWUuc29tZSgodmFsKSA9PiBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZSh2YWwsIGVsLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jaGVja2VkID0gISF2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoZWwudGFnTmFtZSA9PT0gXCJTRUxFQ1RcIikge1xuICAgIHVwZGF0ZVNlbGVjdChlbCwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChlbC52YWx1ZSA9PT0gdmFsdWUpXG4gICAgICByZXR1cm47XG4gICAgZWwudmFsdWUgPSB2YWx1ZSA9PT0gdm9pZCAwID8gXCJcIiA6IHZhbHVlO1xuICB9XG59XG5mdW5jdGlvbiBiaW5kQ2xhc3NlcyhlbCwgdmFsdWUpIHtcbiAgaWYgKGVsLl94X3VuZG9BZGRlZENsYXNzZXMpXG4gICAgZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcygpO1xuICBlbC5feF91bmRvQWRkZWRDbGFzc2VzID0gc2V0Q2xhc3NlcyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gYmluZFN0eWxlcyhlbCwgdmFsdWUpIHtcbiAgaWYgKGVsLl94X3VuZG9BZGRlZFN0eWxlcylcbiAgICBlbC5feF91bmRvQWRkZWRTdHlsZXMoKTtcbiAgZWwuX3hfdW5kb0FkZGVkU3R5bGVzID0gc2V0U3R5bGVzKGVsLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBiaW5kQXR0cmlidXRlQW5kUHJvcGVydHkoZWwsIG5hbWUsIHZhbHVlKSB7XG4gIGJpbmRBdHRyaWJ1dGUoZWwsIG5hbWUsIHZhbHVlKTtcbiAgc2V0UHJvcGVydHlJZkNoYW5nZWQoZWwsIG5hbWUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGJpbmRBdHRyaWJ1dGUoZWwsIG5hbWUsIHZhbHVlKSB7XG4gIGlmIChbbnVsbCwgdm9pZCAwLCBmYWxzZV0uaW5jbHVkZXModmFsdWUpICYmIGF0dHJpYnV0ZVNob3VsZG50QmVQcmVzZXJ2ZWRJZkZhbHN5KG5hbWUpKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChpc0Jvb2xlYW5BdHRyKG5hbWUpKVxuICAgICAgdmFsdWUgPSBuYW1lO1xuICAgIHNldElmQ2hhbmdlZChlbCwgbmFtZSwgdmFsdWUpO1xuICB9XG59XG5mdW5jdGlvbiBzZXRJZkNoYW5nZWQoZWwsIGF0dHJOYW1lLCB2YWx1ZSkge1xuICBpZiAoZWwuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKSAhPSB2YWx1ZSkge1xuICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgdmFsdWUpO1xuICB9XG59XG5mdW5jdGlvbiBzZXRQcm9wZXJ0eUlmQ2hhbmdlZChlbCwgcHJvcE5hbWUsIHZhbHVlKSB7XG4gIGlmIChlbFtwcm9wTmFtZV0gIT09IHZhbHVlKSB7XG4gICAgZWxbcHJvcE5hbWVdID0gdmFsdWU7XG4gIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdChlbCwgdmFsdWUpIHtcbiAgY29uc3QgYXJyYXlXcmFwcGVkVmFsdWUgPSBbXS5jb25jYXQodmFsdWUpLm1hcCgodmFsdWUyKSA9PiB7XG4gICAgcmV0dXJuIHZhbHVlMiArIFwiXCI7XG4gIH0pO1xuICBBcnJheS5mcm9tKGVsLm9wdGlvbnMpLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgIG9wdGlvbi5zZWxlY3RlZCA9IGFycmF5V3JhcHBlZFZhbHVlLmluY2x1ZGVzKG9wdGlvbi52YWx1ZSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gY2FtZWxDYXNlKHN1YmplY3QpIHtcbiAgcmV0dXJuIHN1YmplY3QudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tKFxcdykvZywgKG1hdGNoLCBjaGFyKSA9PiBjaGFyLnRvVXBwZXJDYXNlKCkpO1xufVxuZnVuY3Rpb24gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUodmFsdWVBLCB2YWx1ZUIpIHtcbiAgcmV0dXJuIHZhbHVlQSA9PSB2YWx1ZUI7XG59XG5mdW5jdGlvbiBzYWZlUGFyc2VCb29sZWFuKHJhd1ZhbHVlKSB7XG4gIGlmIChbMSwgXCIxXCIsIFwidHJ1ZVwiLCBcIm9uXCIsIFwieWVzXCIsIHRydWVdLmluY2x1ZGVzKHJhd1ZhbHVlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChbMCwgXCIwXCIsIFwiZmFsc2VcIiwgXCJvZmZcIiwgXCJub1wiLCBmYWxzZV0uaW5jbHVkZXMocmF3VmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiByYXdWYWx1ZSA/IEJvb2xlYW4ocmF3VmFsdWUpIDogbnVsbDtcbn1cbnZhciBib29sZWFuQXR0cmlidXRlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcbiAgXCJhbGxvd2Z1bGxzY3JlZW5cIixcbiAgXCJhc3luY1wiLFxuICBcImF1dG9mb2N1c1wiLFxuICBcImF1dG9wbGF5XCIsXG4gIFwiY2hlY2tlZFwiLFxuICBcImNvbnRyb2xzXCIsXG4gIFwiZGVmYXVsdFwiLFxuICBcImRlZmVyXCIsXG4gIFwiZGlzYWJsZWRcIixcbiAgXCJmb3Jtbm92YWxpZGF0ZVwiLFxuICBcImluZXJ0XCIsXG4gIFwiaXNtYXBcIixcbiAgXCJpdGVtc2NvcGVcIixcbiAgXCJsb29wXCIsXG4gIFwibXVsdGlwbGVcIixcbiAgXCJtdXRlZFwiLFxuICBcIm5vbW9kdWxlXCIsXG4gIFwibm92YWxpZGF0ZVwiLFxuICBcIm9wZW5cIixcbiAgXCJwbGF5c2lubGluZVwiLFxuICBcInJlYWRvbmx5XCIsXG4gIFwicmVxdWlyZWRcIixcbiAgXCJyZXZlcnNlZFwiLFxuICBcInNlbGVjdGVkXCIsXG4gIFwic2hhZG93cm9vdGNsb25hYmxlXCIsXG4gIFwic2hhZG93cm9vdGRlbGVnYXRlc2ZvY3VzXCIsXG4gIFwic2hhZG93cm9vdHNlcmlhbGl6YWJsZVwiXG5dKTtcbmZ1bmN0aW9uIGlzQm9vbGVhbkF0dHIoYXR0ck5hbWUpIHtcbiAgcmV0dXJuIGJvb2xlYW5BdHRyaWJ1dGVzLmhhcyhhdHRyTmFtZSk7XG59XG5mdW5jdGlvbiBhdHRyaWJ1dGVTaG91bGRudEJlUHJlc2VydmVkSWZGYWxzeShuYW1lKSB7XG4gIHJldHVybiAhW1wiYXJpYS1wcmVzc2VkXCIsIFwiYXJpYS1jaGVja2VkXCIsIFwiYXJpYS1leHBhbmRlZFwiLCBcImFyaWEtc2VsZWN0ZWRcIl0uaW5jbHVkZXMobmFtZSk7XG59XG5mdW5jdGlvbiBnZXRCaW5kaW5nKGVsLCBuYW1lLCBmYWxsYmFjaykge1xuICBpZiAoZWwuX3hfYmluZGluZ3MgJiYgZWwuX3hfYmluZGluZ3NbbmFtZV0gIT09IHZvaWQgMClcbiAgICByZXR1cm4gZWwuX3hfYmluZGluZ3NbbmFtZV07XG4gIHJldHVybiBnZXRBdHRyaWJ1dGVCaW5kaW5nKGVsLCBuYW1lLCBmYWxsYmFjayk7XG59XG5mdW5jdGlvbiBleHRyYWN0UHJvcChlbCwgbmFtZSwgZmFsbGJhY2ssIGV4dHJhY3QgPSB0cnVlKSB7XG4gIGlmIChlbC5feF9iaW5kaW5ncyAmJiBlbC5feF9iaW5kaW5nc1tuYW1lXSAhPT0gdm9pZCAwKVxuICAgIHJldHVybiBlbC5feF9iaW5kaW5nc1tuYW1lXTtcbiAgaWYgKGVsLl94X2lubGluZUJpbmRpbmdzICYmIGVsLl94X2lubGluZUJpbmRpbmdzW25hbWVdICE9PSB2b2lkIDApIHtcbiAgICBsZXQgYmluZGluZyA9IGVsLl94X2lubGluZUJpbmRpbmdzW25hbWVdO1xuICAgIGJpbmRpbmcuZXh0cmFjdCA9IGV4dHJhY3Q7XG4gICAgcmV0dXJuIGRvbnRBdXRvRXZhbHVhdGVGdW5jdGlvbnMoKCkgPT4ge1xuICAgICAgcmV0dXJuIGV2YWx1YXRlKGVsLCBiaW5kaW5nLmV4cHJlc3Npb24pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBnZXRBdHRyaWJ1dGVCaW5kaW5nKGVsLCBuYW1lLCBmYWxsYmFjayk7XG59XG5mdW5jdGlvbiBnZXRBdHRyaWJ1dGVCaW5kaW5nKGVsLCBuYW1lLCBmYWxsYmFjaykge1xuICBsZXQgYXR0ciA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgaWYgKGF0dHIgPT09IG51bGwpXG4gICAgcmV0dXJuIHR5cGVvZiBmYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiID8gZmFsbGJhY2soKSA6IGZhbGxiYWNrO1xuICBpZiAoYXR0ciA9PT0gXCJcIilcbiAgICByZXR1cm4gdHJ1ZTtcbiAgaWYgKGlzQm9vbGVhbkF0dHIobmFtZSkpIHtcbiAgICByZXR1cm4gISFbbmFtZSwgXCJ0cnVlXCJdLmluY2x1ZGVzKGF0dHIpO1xuICB9XG4gIHJldHVybiBhdHRyO1xufVxuZnVuY3Rpb24gaXNDaGVja2JveChlbCkge1xuICByZXR1cm4gZWwudHlwZSA9PT0gXCJjaGVja2JveFwiIHx8IGVsLmxvY2FsTmFtZSA9PT0gXCJ1aS1jaGVja2JveFwiIHx8IGVsLmxvY2FsTmFtZSA9PT0gXCJ1aS1zd2l0Y2hcIjtcbn1cbmZ1bmN0aW9uIGlzUmFkaW8oZWwpIHtcbiAgcmV0dXJuIGVsLnR5cGUgPT09IFwicmFkaW9cIiB8fCBlbC5sb2NhbE5hbWUgPT09IFwidWktcmFkaW9cIjtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2RlYm91bmNlLmpzXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0KSB7XG4gIHZhciB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3Rocm90dGxlLmpzXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCBsaW1pdCkge1xuICBsZXQgaW5UaHJvdHRsZTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGxldCBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICBpZiAoIWluVGhyb3R0bGUpIHtcbiAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpblRocm90dGxlID0gdHJ1ZTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gaW5UaHJvdHRsZSA9IGZhbHNlLCBsaW1pdCk7XG4gICAgfVxuICB9O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZW50YW5nbGUuanNcbmZ1bmN0aW9uIGVudGFuZ2xlKHsgZ2V0OiBvdXRlckdldCwgc2V0OiBvdXRlclNldCB9LCB7IGdldDogaW5uZXJHZXQsIHNldDogaW5uZXJTZXQgfSkge1xuICBsZXQgZmlyc3RSdW4gPSB0cnVlO1xuICBsZXQgb3V0ZXJIYXNoO1xuICBsZXQgaW5uZXJIYXNoO1xuICBsZXQgcmVmZXJlbmNlID0gZWZmZWN0KCgpID0+IHtcbiAgICBsZXQgb3V0ZXIgPSBvdXRlckdldCgpO1xuICAgIGxldCBpbm5lciA9IGlubmVyR2V0KCk7XG4gICAgaWYgKGZpcnN0UnVuKSB7XG4gICAgICBpbm5lclNldChjbG9uZUlmT2JqZWN0KG91dGVyKSk7XG4gICAgICBmaXJzdFJ1biA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgb3V0ZXJIYXNoTGF0ZXN0ID0gSlNPTi5zdHJpbmdpZnkob3V0ZXIpO1xuICAgICAgbGV0IGlubmVySGFzaExhdGVzdCA9IEpTT04uc3RyaW5naWZ5KGlubmVyKTtcbiAgICAgIGlmIChvdXRlckhhc2hMYXRlc3QgIT09IG91dGVySGFzaCkge1xuICAgICAgICBpbm5lclNldChjbG9uZUlmT2JqZWN0KG91dGVyKSk7XG4gICAgICB9IGVsc2UgaWYgKG91dGVySGFzaExhdGVzdCAhPT0gaW5uZXJIYXNoTGF0ZXN0KSB7XG4gICAgICAgIG91dGVyU2V0KGNsb25lSWZPYmplY3QoaW5uZXIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICB9XG4gICAgfVxuICAgIG91dGVySGFzaCA9IEpTT04uc3RyaW5naWZ5KG91dGVyR2V0KCkpO1xuICAgIGlubmVySGFzaCA9IEpTT04uc3RyaW5naWZ5KGlubmVyR2V0KCkpO1xuICB9KTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICByZWxlYXNlKHJlZmVyZW5jZSk7XG4gIH07XG59XG5mdW5jdGlvbiBjbG9uZUlmT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgPyBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSkgOiB2YWx1ZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3BsdWdpbi5qc1xuZnVuY3Rpb24gcGx1Z2luKGNhbGxiYWNrKSB7XG4gIGxldCBjYWxsYmFja3MgPSBBcnJheS5pc0FycmF5KGNhbGxiYWNrKSA/IGNhbGxiYWNrIDogW2NhbGxiYWNrXTtcbiAgY2FsbGJhY2tzLmZvckVhY2goKGkpID0+IGkoYWxwaW5lX2RlZmF1bHQpKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3N0b3JlLmpzXG52YXIgc3RvcmVzID0ge307XG52YXIgaXNSZWFjdGl2ZSA9IGZhbHNlO1xuZnVuY3Rpb24gc3RvcmUobmFtZSwgdmFsdWUpIHtcbiAgaWYgKCFpc1JlYWN0aXZlKSB7XG4gICAgc3RvcmVzID0gcmVhY3RpdmUoc3RvcmVzKTtcbiAgICBpc1JlYWN0aXZlID0gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBzdG9yZXNbbmFtZV07XG4gIH1cbiAgc3RvcmVzW25hbWVdID0gdmFsdWU7XG4gIGluaXRJbnRlcmNlcHRvcnMoc3RvcmVzW25hbWVdKTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eShcImluaXRcIikgJiYgdHlwZW9mIHZhbHVlLmluaXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHN0b3Jlc1tuYW1lXS5pbml0KCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldFN0b3JlcygpIHtcbiAgcmV0dXJuIHN0b3Jlcztcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2JpbmRzLmpzXG52YXIgYmluZHMgPSB7fTtcbmZ1bmN0aW9uIGJpbmQyKG5hbWUsIGJpbmRpbmdzKSB7XG4gIGxldCBnZXRCaW5kaW5ncyA9IHR5cGVvZiBiaW5kaW5ncyAhPT0gXCJmdW5jdGlvblwiID8gKCkgPT4gYmluZGluZ3MgOiBiaW5kaW5ncztcbiAgaWYgKG5hbWUgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgcmV0dXJuIGFwcGx5QmluZGluZ3NPYmplY3QobmFtZSwgZ2V0QmluZGluZ3MoKSk7XG4gIH0gZWxzZSB7XG4gICAgYmluZHNbbmFtZV0gPSBnZXRCaW5kaW5ncztcbiAgfVxuICByZXR1cm4gKCkgPT4ge1xuICB9O1xufVxuZnVuY3Rpb24gaW5qZWN0QmluZGluZ1Byb3ZpZGVycyhvYmopIHtcbiAgT2JqZWN0LmVudHJpZXMoYmluZHMpLmZvckVhY2goKFtuYW1lLCBjYWxsYmFja10pID0+IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5mdW5jdGlvbiBhcHBseUJpbmRpbmdzT2JqZWN0KGVsLCBvYmosIG9yaWdpbmFsKSB7XG4gIGxldCBjbGVhbnVwUnVubmVycyA9IFtdO1xuICB3aGlsZSAoY2xlYW51cFJ1bm5lcnMubGVuZ3RoKVxuICAgIGNsZWFudXBSdW5uZXJzLnBvcCgpKCk7XG4gIGxldCBhdHRyaWJ1dGVzID0gT2JqZWN0LmVudHJpZXMob2JqKS5tYXAoKFtuYW1lLCB2YWx1ZV0pID0+ICh7IG5hbWUsIHZhbHVlIH0pKTtcbiAgbGV0IHN0YXRpY0F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzT25seShhdHRyaWJ1dGVzKTtcbiAgYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICBpZiAoc3RhdGljQXR0cmlidXRlcy5maW5kKChhdHRyKSA9PiBhdHRyLm5hbWUgPT09IGF0dHJpYnV0ZS5uYW1lKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYHgtYmluZDoke2F0dHJpYnV0ZS5uYW1lfWAsXG4gICAgICAgIHZhbHVlOiBgXCIke2F0dHJpYnV0ZS52YWx1ZX1cImBcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGU7XG4gIH0pO1xuICBkaXJlY3RpdmVzKGVsLCBhdHRyaWJ1dGVzLCBvcmlnaW5hbCkubWFwKChoYW5kbGUpID0+IHtcbiAgICBjbGVhbnVwUnVubmVycy5wdXNoKGhhbmRsZS5ydW5DbGVhbnVwcyk7XG4gICAgaGFuZGxlKCk7XG4gIH0pO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHdoaWxlIChjbGVhbnVwUnVubmVycy5sZW5ndGgpXG4gICAgICBjbGVhbnVwUnVubmVycy5wb3AoKSgpO1xuICB9O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGF0YXMuanNcbnZhciBkYXRhcyA9IHt9O1xuZnVuY3Rpb24gZGF0YShuYW1lLCBjYWxsYmFjaykge1xuICBkYXRhc1tuYW1lXSA9IGNhbGxiYWNrO1xufVxuZnVuY3Rpb24gaW5qZWN0RGF0YVByb3ZpZGVycyhvYmosIGNvbnRleHQpIHtcbiAgT2JqZWN0LmVudHJpZXMoZGF0YXMpLmZvckVhY2goKFtuYW1lLCBjYWxsYmFja10pID0+IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjay5iaW5kKGNvbnRleHQpKC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvYWxwaW5lLmpzXG52YXIgQWxwaW5lID0ge1xuICBnZXQgcmVhY3RpdmUoKSB7XG4gICAgcmV0dXJuIHJlYWN0aXZlO1xuICB9LFxuICBnZXQgcmVsZWFzZSgpIHtcbiAgICByZXR1cm4gcmVsZWFzZTtcbiAgfSxcbiAgZ2V0IGVmZmVjdCgpIHtcbiAgICByZXR1cm4gZWZmZWN0O1xuICB9LFxuICBnZXQgcmF3KCkge1xuICAgIHJldHVybiByYXc7XG4gIH0sXG4gIHZlcnNpb246IFwiMy4xNC44XCIsXG4gIGZsdXNoQW5kU3RvcERlZmVycmluZ011dGF0aW9ucyxcbiAgZG9udEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyxcbiAgZGlzYWJsZUVmZmVjdFNjaGVkdWxpbmcsXG4gIHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zLFxuICBzdG9wT2JzZXJ2aW5nTXV0YXRpb25zLFxuICBzZXRSZWFjdGl2aXR5RW5naW5lLFxuICBvbkF0dHJpYnV0ZVJlbW92ZWQsXG4gIG9uQXR0cmlidXRlc0FkZGVkLFxuICBjbG9zZXN0RGF0YVN0YWNrLFxuICBza2lwRHVyaW5nQ2xvbmUsXG4gIG9ubHlEdXJpbmdDbG9uZSxcbiAgYWRkUm9vdFNlbGVjdG9yLFxuICBhZGRJbml0U2VsZWN0b3IsXG4gIGludGVyY2VwdENsb25lLFxuICBhZGRTY29wZVRvTm9kZSxcbiAgZGVmZXJNdXRhdGlvbnMsXG4gIG1hcEF0dHJpYnV0ZXMsXG4gIGV2YWx1YXRlTGF0ZXIsXG4gIGludGVyY2VwdEluaXQsXG4gIHNldEV2YWx1YXRvcixcbiAgbWVyZ2VQcm94aWVzLFxuICBleHRyYWN0UHJvcCxcbiAgZmluZENsb3Nlc3QsXG4gIG9uRWxSZW1vdmVkLFxuICBjbG9zZXN0Um9vdCxcbiAgZGVzdHJveVRyZWUsXG4gIGludGVyY2VwdG9yLFxuICAvLyBJTlRFUk5BTDogbm90IHB1YmxpYyBBUEkgYW5kIGlzIHN1YmplY3QgdG8gY2hhbmdlIHdpdGhvdXQgbWFqb3IgcmVsZWFzZS5cbiAgdHJhbnNpdGlvbixcbiAgLy8gSU5URVJOQUxcbiAgc2V0U3R5bGVzLFxuICAvLyBJTlRFUk5BTFxuICBtdXRhdGVEb20sXG4gIGRpcmVjdGl2ZSxcbiAgZW50YW5nbGUsXG4gIHRocm90dGxlLFxuICBkZWJvdW5jZSxcbiAgZXZhbHVhdGUsXG4gIGluaXRUcmVlLFxuICBuZXh0VGljayxcbiAgcHJlZml4ZWQ6IHByZWZpeCxcbiAgcHJlZml4OiBzZXRQcmVmaXgsXG4gIHBsdWdpbixcbiAgbWFnaWMsXG4gIHN0b3JlLFxuICBzdGFydCxcbiAgY2xvbmUsXG4gIC8vIElOVEVSTkFMXG4gIGNsb25lTm9kZSxcbiAgLy8gSU5URVJOQUxcbiAgYm91bmQ6IGdldEJpbmRpbmcsXG4gICRkYXRhOiBzY29wZSxcbiAgd2F0Y2gsXG4gIHdhbGssXG4gIGRhdGEsXG4gIGJpbmQ6IGJpbmQyXG59O1xudmFyIGFscGluZV9kZWZhdWx0ID0gQWxwaW5lO1xuXG4vLyBub2RlX21vZHVsZXMvQHZ1ZS9zaGFyZWQvZGlzdC9zaGFyZWQuZXNtLWJ1bmRsZXIuanNcbmZ1bmN0aW9uIG1ha2VNYXAoc3RyLCBleHBlY3RzTG93ZXJDYXNlKSB7XG4gIGNvbnN0IG1hcCA9IC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBjb25zdCBsaXN0ID0gc3RyLnNwbGl0KFwiLFwiKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwW2xpc3RbaV1dID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZXhwZWN0c0xvd2VyQ2FzZSA/ICh2YWwpID0+ICEhbWFwW3ZhbC50b0xvd2VyQ2FzZSgpXSA6ICh2YWwpID0+ICEhbWFwW3ZhbF07XG59XG52YXIgc3BlY2lhbEJvb2xlYW5BdHRycyA9IGBpdGVtc2NvcGUsYWxsb3dmdWxsc2NyZWVuLGZvcm1ub3ZhbGlkYXRlLGlzbWFwLG5vbW9kdWxlLG5vdmFsaWRhdGUscmVhZG9ubHlgO1xudmFyIGlzQm9vbGVhbkF0dHIyID0gLyogQF9fUFVSRV9fICovIG1ha2VNYXAoc3BlY2lhbEJvb2xlYW5BdHRycyArIGAsYXN5bmMsYXV0b2ZvY3VzLGF1dG9wbGF5LGNvbnRyb2xzLGRlZmF1bHQsZGVmZXIsZGlzYWJsZWQsaGlkZGVuLGxvb3Asb3BlbixyZXF1aXJlZCxyZXZlcnNlZCxzY29wZWQsc2VhbWxlc3MsY2hlY2tlZCxtdXRlZCxtdWx0aXBsZSxzZWxlY3RlZGApO1xudmFyIEVNUFRZX09CSiA9IHRydWUgPyBPYmplY3QuZnJlZXplKHt9KSA6IHt9O1xudmFyIEVNUFRZX0FSUiA9IHRydWUgPyBPYmplY3QuZnJlZXplKFtdKSA6IFtdO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBoYXNPd24gPSAodmFsLCBrZXkpID0+IGhhc093blByb3BlcnR5LmNhbGwodmFsLCBrZXkpO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xudmFyIGlzTWFwID0gKHZhbCkgPT4gdG9UeXBlU3RyaW5nKHZhbCkgPT09IFwiW29iamVjdCBNYXBdXCI7XG52YXIgaXNTdHJpbmcgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiO1xudmFyIGlzU3ltYm9sID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJzeW1ib2xcIjtcbnZhciBpc09iamVjdCA9ICh2YWwpID0+IHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiO1xudmFyIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciB0b1R5cGVTdHJpbmcgPSAodmFsdWUpID0+IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xudmFyIHRvUmF3VHlwZSA9ICh2YWx1ZSkgPT4ge1xuICByZXR1cm4gdG9UeXBlU3RyaW5nKHZhbHVlKS5zbGljZSg4LCAtMSk7XG59O1xudmFyIGlzSW50ZWdlcktleSA9IChrZXkpID0+IGlzU3RyaW5nKGtleSkgJiYga2V5ICE9PSBcIk5hTlwiICYmIGtleVswXSAhPT0gXCItXCIgJiYgXCJcIiArIHBhcnNlSW50KGtleSwgMTApID09PSBrZXk7XG52YXIgY2FjaGVTdHJpbmdGdW5jdGlvbiA9IChmbikgPT4ge1xuICBjb25zdCBjYWNoZSA9IC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpO1xuICByZXR1cm4gKHN0cikgPT4ge1xuICAgIGNvbnN0IGhpdCA9IGNhY2hlW3N0cl07XG4gICAgcmV0dXJuIGhpdCB8fCAoY2FjaGVbc3RyXSA9IGZuKHN0cikpO1xuICB9O1xufTtcbnZhciBjYW1lbGl6ZVJFID0gLy0oXFx3KS9nO1xudmFyIGNhbWVsaXplID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbGl6ZVJFLCAoXywgYykgPT4gYyA/IGMudG9VcHBlckNhc2UoKSA6IFwiXCIpO1xufSk7XG52YXIgaHlwaGVuYXRlUkUgPSAvXFxCKFtBLVpdKS9nO1xudmFyIGh5cGhlbmF0ZSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4gc3RyLnJlcGxhY2UoaHlwaGVuYXRlUkUsIFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpO1xudmFyIGNhcGl0YWxpemUgPSBjYWNoZVN0cmluZ0Z1bmN0aW9uKChzdHIpID0+IHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKSk7XG52YXIgdG9IYW5kbGVyS2V5ID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiBzdHIgPyBgb24ke2NhcGl0YWxpemUoc3RyKX1gIDogYGApO1xudmFyIGhhc0NoYW5nZWQgPSAodmFsdWUsIG9sZFZhbHVlKSA9PiB2YWx1ZSAhPT0gb2xkVmFsdWUgJiYgKHZhbHVlID09PSB2YWx1ZSB8fCBvbGRWYWx1ZSA9PT0gb2xkVmFsdWUpO1xuXG4vLyBub2RlX21vZHVsZXMvQHZ1ZS9yZWFjdGl2aXR5L2Rpc3QvcmVhY3Rpdml0eS5lc20tYnVuZGxlci5qc1xudmFyIHRhcmdldE1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGVmZmVjdFN0YWNrID0gW107XG52YXIgYWN0aXZlRWZmZWN0O1xudmFyIElURVJBVEVfS0VZID0gU3ltYm9sKHRydWUgPyBcIml0ZXJhdGVcIiA6IFwiXCIpO1xudmFyIE1BUF9LRVlfSVRFUkFURV9LRVkgPSBTeW1ib2wodHJ1ZSA/IFwiTWFwIGtleSBpdGVyYXRlXCIgOiBcIlwiKTtcbmZ1bmN0aW9uIGlzRWZmZWN0KGZuKSB7XG4gIHJldHVybiBmbiAmJiBmbi5faXNFZmZlY3QgPT09IHRydWU7XG59XG5mdW5jdGlvbiBlZmZlY3QyKGZuLCBvcHRpb25zID0gRU1QVFlfT0JKKSB7XG4gIGlmIChpc0VmZmVjdChmbikpIHtcbiAgICBmbiA9IGZuLnJhdztcbiAgfVxuICBjb25zdCBlZmZlY3QzID0gY3JlYXRlUmVhY3RpdmVFZmZlY3QoZm4sIG9wdGlvbnMpO1xuICBpZiAoIW9wdGlvbnMubGF6eSkge1xuICAgIGVmZmVjdDMoKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0Mztcbn1cbmZ1bmN0aW9uIHN0b3AoZWZmZWN0Mykge1xuICBpZiAoZWZmZWN0My5hY3RpdmUpIHtcbiAgICBjbGVhbnVwKGVmZmVjdDMpO1xuICAgIGlmIChlZmZlY3QzLm9wdGlvbnMub25TdG9wKSB7XG4gICAgICBlZmZlY3QzLm9wdGlvbnMub25TdG9wKCk7XG4gICAgfVxuICAgIGVmZmVjdDMuYWN0aXZlID0gZmFsc2U7XG4gIH1cbn1cbnZhciB1aWQgPSAwO1xuZnVuY3Rpb24gY3JlYXRlUmVhY3RpdmVFZmZlY3QoZm4sIG9wdGlvbnMpIHtcbiAgY29uc3QgZWZmZWN0MyA9IGZ1bmN0aW9uIHJlYWN0aXZlRWZmZWN0KCkge1xuICAgIGlmICghZWZmZWN0My5hY3RpdmUpIHtcbiAgICAgIHJldHVybiBmbigpO1xuICAgIH1cbiAgICBpZiAoIWVmZmVjdFN0YWNrLmluY2x1ZGVzKGVmZmVjdDMpKSB7XG4gICAgICBjbGVhbnVwKGVmZmVjdDMpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZW5hYmxlVHJhY2tpbmcoKTtcbiAgICAgICAgZWZmZWN0U3RhY2sucHVzaChlZmZlY3QzKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0MztcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgcmVzZXRUcmFja2luZygpO1xuICAgICAgICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGVmZmVjdDMuaWQgPSB1aWQrKztcbiAgZWZmZWN0My5hbGxvd1JlY3Vyc2UgPSAhIW9wdGlvbnMuYWxsb3dSZWN1cnNlO1xuICBlZmZlY3QzLl9pc0VmZmVjdCA9IHRydWU7XG4gIGVmZmVjdDMuYWN0aXZlID0gdHJ1ZTtcbiAgZWZmZWN0My5yYXcgPSBmbjtcbiAgZWZmZWN0My5kZXBzID0gW107XG4gIGVmZmVjdDMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIHJldHVybiBlZmZlY3QzO1xufVxuZnVuY3Rpb24gY2xlYW51cChlZmZlY3QzKSB7XG4gIGNvbnN0IHsgZGVwcyB9ID0gZWZmZWN0MztcbiAgaWYgKGRlcHMubGVuZ3RoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBkZXBzW2ldLmRlbGV0ZShlZmZlY3QzKTtcbiAgICB9XG4gICAgZGVwcy5sZW5ndGggPSAwO1xuICB9XG59XG52YXIgc2hvdWxkVHJhY2sgPSB0cnVlO1xudmFyIHRyYWNrU3RhY2sgPSBbXTtcbmZ1bmN0aW9uIHBhdXNlVHJhY2tpbmcoKSB7XG4gIHRyYWNrU3RhY2sucHVzaChzaG91bGRUcmFjayk7XG4gIHNob3VsZFRyYWNrID0gZmFsc2U7XG59XG5mdW5jdGlvbiBlbmFibGVUcmFja2luZygpIHtcbiAgdHJhY2tTdGFjay5wdXNoKHNob3VsZFRyYWNrKTtcbiAgc2hvdWxkVHJhY2sgPSB0cnVlO1xufVxuZnVuY3Rpb24gcmVzZXRUcmFja2luZygpIHtcbiAgY29uc3QgbGFzdCA9IHRyYWNrU3RhY2sucG9wKCk7XG4gIHNob3VsZFRyYWNrID0gbGFzdCA9PT0gdm9pZCAwID8gdHJ1ZSA6IGxhc3Q7XG59XG5mdW5jdGlvbiB0cmFjayh0YXJnZXQsIHR5cGUsIGtleSkge1xuICBpZiAoIXNob3VsZFRyYWNrIHx8IGFjdGl2ZUVmZmVjdCA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBkZXBzTWFwID0gdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xuICBpZiAoIWRlcHNNYXApIHtcbiAgICB0YXJnZXRNYXAuc2V0KHRhcmdldCwgZGVwc01hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCkpO1xuICB9XG4gIGxldCBkZXAgPSBkZXBzTWFwLmdldChrZXkpO1xuICBpZiAoIWRlcCkge1xuICAgIGRlcHNNYXAuc2V0KGtleSwgZGVwID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG4gIH1cbiAgaWYgKCFkZXAuaGFzKGFjdGl2ZUVmZmVjdCkpIHtcbiAgICBkZXAuYWRkKGFjdGl2ZUVmZmVjdCk7XG4gICAgYWN0aXZlRWZmZWN0LmRlcHMucHVzaChkZXApO1xuICAgIGlmIChhY3RpdmVFZmZlY3Qub3B0aW9ucy5vblRyYWNrKSB7XG4gICAgICBhY3RpdmVFZmZlY3Qub3B0aW9ucy5vblRyYWNrKHtcbiAgICAgICAgZWZmZWN0OiBhY3RpdmVFZmZlY3QsXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAgdHlwZSxcbiAgICAgICAga2V5XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIHRyaWdnZXIodGFyZ2V0LCB0eXBlLCBrZXksIG5ld1ZhbHVlLCBvbGRWYWx1ZSwgb2xkVGFyZ2V0KSB7XG4gIGNvbnN0IGRlcHNNYXAgPSB0YXJnZXRNYXAuZ2V0KHRhcmdldCk7XG4gIGlmICghZGVwc01hcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBlZmZlY3RzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgY29uc3QgYWRkMiA9IChlZmZlY3RzVG9BZGQpID0+IHtcbiAgICBpZiAoZWZmZWN0c1RvQWRkKSB7XG4gICAgICBlZmZlY3RzVG9BZGQuZm9yRWFjaCgoZWZmZWN0MykgPT4ge1xuICAgICAgICBpZiAoZWZmZWN0MyAhPT0gYWN0aXZlRWZmZWN0IHx8IGVmZmVjdDMuYWxsb3dSZWN1cnNlKSB7XG4gICAgICAgICAgZWZmZWN0cy5hZGQoZWZmZWN0Myk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgaWYgKHR5cGUgPT09IFwiY2xlYXJcIikge1xuICAgIGRlcHNNYXAuZm9yRWFjaChhZGQyKTtcbiAgfSBlbHNlIGlmIChrZXkgPT09IFwibGVuZ3RoXCIgJiYgaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgZGVwc01hcC5mb3JFYWNoKChkZXAsIGtleTIpID0+IHtcbiAgICAgIGlmIChrZXkyID09PSBcImxlbmd0aFwiIHx8IGtleTIgPj0gbmV3VmFsdWUpIHtcbiAgICAgICAgYWRkMihkZXApO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGlmIChrZXkgIT09IHZvaWQgMCkge1xuICAgICAgYWRkMihkZXBzTWFwLmdldChrZXkpKTtcbiAgICB9XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFwiYWRkXCI6XG4gICAgICAgIGlmICghaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChJVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIGlmIChpc01hcCh0YXJnZXQpKSB7XG4gICAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KE1BUF9LRVlfSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJbnRlZ2VyS2V5KGtleSkpIHtcbiAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KFwibGVuZ3RoXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkZWxldGVcIjpcbiAgICAgICAgaWYgKCFpc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KElURVJBVEVfS0VZKSk7XG4gICAgICAgICAgaWYgKGlzTWFwKHRhcmdldCkpIHtcbiAgICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoTUFQX0tFWV9JVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzZXRcIjpcbiAgICAgICAgaWYgKGlzTWFwKHRhcmdldCkpIHtcbiAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KElURVJBVEVfS0VZKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGNvbnN0IHJ1biA9IChlZmZlY3QzKSA9PiB7XG4gICAgaWYgKGVmZmVjdDMub3B0aW9ucy5vblRyaWdnZXIpIHtcbiAgICAgIGVmZmVjdDMub3B0aW9ucy5vblRyaWdnZXIoe1xuICAgICAgICBlZmZlY3Q6IGVmZmVjdDMsXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAga2V5LFxuICAgICAgICB0eXBlLFxuICAgICAgICBuZXdWYWx1ZSxcbiAgICAgICAgb2xkVmFsdWUsXG4gICAgICAgIG9sZFRhcmdldFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChlZmZlY3QzLm9wdGlvbnMuc2NoZWR1bGVyKSB7XG4gICAgICBlZmZlY3QzLm9wdGlvbnMuc2NoZWR1bGVyKGVmZmVjdDMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlZmZlY3QzKCk7XG4gICAgfVxuICB9O1xuICBlZmZlY3RzLmZvckVhY2gocnVuKTtcbn1cbnZhciBpc05vblRyYWNrYWJsZUtleXMgPSAvKiBAX19QVVJFX18gKi8gbWFrZU1hcChgX19wcm90b19fLF9fdl9pc1JlZixfX2lzVnVlYCk7XG52YXIgYnVpbHRJblN5bWJvbHMgPSBuZXcgU2V0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKFN5bWJvbCkubWFwKChrZXkpID0+IFN5bWJvbFtrZXldKS5maWx0ZXIoaXNTeW1ib2wpKTtcbnZhciBnZXQyID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUdldHRlcigpO1xudmFyIHJlYWRvbmx5R2V0ID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUdldHRlcih0cnVlKTtcbnZhciBhcnJheUluc3RydW1lbnRhdGlvbnMgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlQXJyYXlJbnN0cnVtZW50YXRpb25zKCk7XG5mdW5jdGlvbiBjcmVhdGVBcnJheUluc3RydW1lbnRhdGlvbnMoKSB7XG4gIGNvbnN0IGluc3RydW1lbnRhdGlvbnMgPSB7fTtcbiAgW1wiaW5jbHVkZXNcIiwgXCJpbmRleE9mXCIsIFwibGFzdEluZGV4T2ZcIl0uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaW5zdHJ1bWVudGF0aW9uc1trZXldID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgY29uc3QgYXJyID0gdG9SYXcodGhpcyk7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRyYWNrKGFyciwgXCJnZXRcIiwgaSArIFwiXCIpO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzID0gYXJyW2tleV0oLi4uYXJncyk7XG4gICAgICBpZiAocmVzID09PSAtMSB8fCByZXMgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBhcnJba2V5XSguLi5hcmdzLm1hcCh0b1JhdykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiAgW1wicHVzaFwiLCBcInBvcFwiLCBcInNoaWZ0XCIsIFwidW5zaGlmdFwiLCBcInNwbGljZVwiXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpbnN0cnVtZW50YXRpb25zW2tleV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICBwYXVzZVRyYWNraW5nKCk7XG4gICAgICBjb25zdCByZXMgPSB0b1Jhdyh0aGlzKVtrZXldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgcmVzZXRUcmFja2luZygpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xuICB9KTtcbiAgcmV0dXJuIGluc3RydW1lbnRhdGlvbnM7XG59XG5mdW5jdGlvbiBjcmVhdGVHZXR0ZXIoaXNSZWFkb25seSA9IGZhbHNlLCBzaGFsbG93ID0gZmFsc2UpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldDModGFyZ2V0LCBrZXksIHJlY2VpdmVyKSB7XG4gICAgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFjdGl2ZVwiKSB7XG4gICAgICByZXR1cm4gIWlzUmVhZG9ubHk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09IFwiX192X2lzUmVhZG9ubHlcIikge1xuICAgICAgcmV0dXJuIGlzUmVhZG9ubHk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09IFwiX192X3Jhd1wiICYmIHJlY2VpdmVyID09PSAoaXNSZWFkb25seSA/IHNoYWxsb3cgPyBzaGFsbG93UmVhZG9ubHlNYXAgOiByZWFkb25seU1hcCA6IHNoYWxsb3cgPyBzaGFsbG93UmVhY3RpdmVNYXAgOiByZWFjdGl2ZU1hcCkuZ2V0KHRhcmdldCkpIHtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldElzQXJyYXkgPSBpc0FycmF5KHRhcmdldCk7XG4gICAgaWYgKCFpc1JlYWRvbmx5ICYmIHRhcmdldElzQXJyYXkgJiYgaGFzT3duKGFycmF5SW5zdHJ1bWVudGF0aW9ucywga2V5KSkge1xuICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KGFycmF5SW5zdHJ1bWVudGF0aW9ucywga2V5LCByZWNlaXZlcik7XG4gICAgfVxuICAgIGNvbnN0IHJlcyA9IFJlZmxlY3QuZ2V0KHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gICAgaWYgKGlzU3ltYm9sKGtleSkgPyBidWlsdEluU3ltYm9scy5oYXMoa2V5KSA6IGlzTm9uVHJhY2thYmxlS2V5cyhrZXkpKSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBpZiAoIWlzUmVhZG9ubHkpIHtcbiAgICAgIHRyYWNrKHRhcmdldCwgXCJnZXRcIiwga2V5KTtcbiAgICB9XG4gICAgaWYgKHNoYWxsb3cpIHtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGlmIChpc1JlZihyZXMpKSB7XG4gICAgICBjb25zdCBzaG91bGRVbndyYXAgPSAhdGFyZ2V0SXNBcnJheSB8fCAhaXNJbnRlZ2VyS2V5KGtleSk7XG4gICAgICByZXR1cm4gc2hvdWxkVW53cmFwID8gcmVzLnZhbHVlIDogcmVzO1xuICAgIH1cbiAgICBpZiAoaXNPYmplY3QocmVzKSkge1xuICAgICAgcmV0dXJuIGlzUmVhZG9ubHkgPyByZWFkb25seShyZXMpIDogcmVhY3RpdmUyKHJlcyk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH07XG59XG52YXIgc2V0MiA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVTZXR0ZXIoKTtcbmZ1bmN0aW9uIGNyZWF0ZVNldHRlcihzaGFsbG93ID0gZmFsc2UpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHNldDModGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuICAgIGxldCBvbGRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICAgIGlmICghc2hhbGxvdykge1xuICAgICAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gICAgICBvbGRWYWx1ZSA9IHRvUmF3KG9sZFZhbHVlKTtcbiAgICAgIGlmICghaXNBcnJheSh0YXJnZXQpICYmIGlzUmVmKG9sZFZhbHVlKSAmJiAhaXNSZWYodmFsdWUpKSB7XG4gICAgICAgIG9sZFZhbHVlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBoYWRLZXkgPSBpc0FycmF5KHRhcmdldCkgJiYgaXNJbnRlZ2VyS2V5KGtleSkgPyBOdW1iZXIoa2V5KSA8IHRhcmdldC5sZW5ndGggOiBoYXNPd24odGFyZ2V0LCBrZXkpO1xuICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICAgIGlmICh0YXJnZXQgPT09IHRvUmF3KHJlY2VpdmVyKSkge1xuICAgICAgaWYgKCFoYWRLZXkpIHtcbiAgICAgICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIsIGtleSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChoYXNDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSkpIHtcbiAgICAgICAgdHJpZ2dlcih0YXJnZXQsIFwic2V0XCIsIGtleSwgdmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cbmZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XG4gIGNvbnN0IGhhZEtleSA9IGhhc093bih0YXJnZXQsIGtleSk7XG4gIGNvbnN0IG9sZFZhbHVlID0gdGFyZ2V0W2tleV07XG4gIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpO1xuICBpZiAocmVzdWx0ICYmIGhhZEtleSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImRlbGV0ZVwiLCBrZXksIHZvaWQgMCwgb2xkVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBoYXModGFyZ2V0LCBrZXkpIHtcbiAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5oYXModGFyZ2V0LCBrZXkpO1xuICBpZiAoIWlzU3ltYm9sKGtleSkgfHwgIWJ1aWx0SW5TeW1ib2xzLmhhcyhrZXkpKSB7XG4gICAgdHJhY2sodGFyZ2V0LCBcImhhc1wiLCBrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBvd25LZXlzKHRhcmdldCkge1xuICB0cmFjayh0YXJnZXQsIFwiaXRlcmF0ZVwiLCBpc0FycmF5KHRhcmdldCkgPyBcImxlbmd0aFwiIDogSVRFUkFURV9LRVkpO1xuICByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG59XG52YXIgbXV0YWJsZUhhbmRsZXJzID0ge1xuICBnZXQ6IGdldDIsXG4gIHNldDogc2V0MixcbiAgZGVsZXRlUHJvcGVydHksXG4gIGhhcyxcbiAgb3duS2V5c1xufTtcbnZhciByZWFkb25seUhhbmRsZXJzID0ge1xuICBnZXQ6IHJlYWRvbmx5R2V0LFxuICBzZXQodGFyZ2V0LCBrZXkpIHtcbiAgICBpZiAodHJ1ZSkge1xuICAgICAgY29uc29sZS53YXJuKGBTZXQgb3BlcmF0aW9uIG9uIGtleSBcIiR7U3RyaW5nKGtleSl9XCIgZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCwgdGFyZ2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgRGVsZXRlIG9wZXJhdGlvbiBvbiBrZXkgXCIke1N0cmluZyhrZXkpfVwiIGZhaWxlZDogdGFyZ2V0IGlzIHJlYWRvbmx5LmAsIHRhcmdldCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xudmFyIHRvUmVhY3RpdmUgPSAodmFsdWUpID0+IGlzT2JqZWN0KHZhbHVlKSA/IHJlYWN0aXZlMih2YWx1ZSkgOiB2YWx1ZTtcbnZhciB0b1JlYWRvbmx5ID0gKHZhbHVlKSA9PiBpc09iamVjdCh2YWx1ZSkgPyByZWFkb25seSh2YWx1ZSkgOiB2YWx1ZTtcbnZhciB0b1NoYWxsb3cgPSAodmFsdWUpID0+IHZhbHVlO1xudmFyIGdldFByb3RvID0gKHYpID0+IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2Yodik7XG5mdW5jdGlvbiBnZXQkMSh0YXJnZXQsIGtleSwgaXNSZWFkb25seSA9IGZhbHNlLCBpc1NoYWxsb3cgPSBmYWxzZSkge1xuICB0YXJnZXQgPSB0YXJnZXRbXG4gICAgXCJfX3ZfcmF3XCJcbiAgICAvKiBSQVcgKi9cbiAgXTtcbiAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgY29uc3QgcmF3S2V5ID0gdG9SYXcoa2V5KTtcbiAgaWYgKGtleSAhPT0gcmF3S2V5KSB7XG4gICAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcImdldFwiLCBrZXkpO1xuICB9XG4gICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJnZXRcIiwgcmF3S2V5KTtcbiAgY29uc3QgeyBoYXM6IGhhczIgfSA9IGdldFByb3RvKHJhd1RhcmdldCk7XG4gIGNvbnN0IHdyYXAgPSBpc1NoYWxsb3cgPyB0b1NoYWxsb3cgOiBpc1JlYWRvbmx5ID8gdG9SZWFkb25seSA6IHRvUmVhY3RpdmU7XG4gIGlmIChoYXMyLmNhbGwocmF3VGFyZ2V0LCBrZXkpKSB7XG4gICAgcmV0dXJuIHdyYXAodGFyZ2V0LmdldChrZXkpKTtcbiAgfSBlbHNlIGlmIChoYXMyLmNhbGwocmF3VGFyZ2V0LCByYXdLZXkpKSB7XG4gICAgcmV0dXJuIHdyYXAodGFyZ2V0LmdldChyYXdLZXkpKTtcbiAgfSBlbHNlIGlmICh0YXJnZXQgIT09IHJhd1RhcmdldCkge1xuICAgIHRhcmdldC5nZXQoa2V5KTtcbiAgfVxufVxuZnVuY3Rpb24gaGFzJDEoa2V5LCBpc1JlYWRvbmx5ID0gZmFsc2UpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdGhpc1tcbiAgICBcIl9fdl9yYXdcIlxuICAgIC8qIFJBVyAqL1xuICBdO1xuICBjb25zdCByYXdUYXJnZXQgPSB0b1Jhdyh0YXJnZXQpO1xuICBjb25zdCByYXdLZXkgPSB0b1JhdyhrZXkpO1xuICBpZiAoa2V5ICE9PSByYXdLZXkpIHtcbiAgICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiaGFzXCIsIGtleSk7XG4gIH1cbiAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcImhhc1wiLCByYXdLZXkpO1xuICByZXR1cm4ga2V5ID09PSByYXdLZXkgPyB0YXJnZXQuaGFzKGtleSkgOiB0YXJnZXQuaGFzKGtleSkgfHwgdGFyZ2V0LmhhcyhyYXdLZXkpO1xufVxuZnVuY3Rpb24gc2l6ZSh0YXJnZXQsIGlzUmVhZG9ubHkgPSBmYWxzZSkge1xuICB0YXJnZXQgPSB0YXJnZXRbXG4gICAgXCJfX3ZfcmF3XCJcbiAgICAvKiBSQVcgKi9cbiAgXTtcbiAgIWlzUmVhZG9ubHkgJiYgdHJhY2sodG9SYXcodGFyZ2V0KSwgXCJpdGVyYXRlXCIsIElURVJBVEVfS0VZKTtcbiAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgXCJzaXplXCIsIHRhcmdldCk7XG59XG5mdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCBwcm90byA9IGdldFByb3RvKHRhcmdldCk7XG4gIGNvbnN0IGhhZEtleSA9IHByb3RvLmhhcy5jYWxsKHRhcmdldCwgdmFsdWUpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIHRhcmdldC5hZGQodmFsdWUpO1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImFkZFwiLCB2YWx1ZSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuZnVuY3Rpb24gc2V0JDEoa2V5LCB2YWx1ZSkge1xuICB2YWx1ZSA9IHRvUmF3KHZhbHVlKTtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IHsgaGFzOiBoYXMyLCBnZXQ6IGdldDMgfSA9IGdldFByb3RvKHRhcmdldCk7XG4gIGxldCBoYWRLZXkgPSBoYXMyLmNhbGwodGFyZ2V0LCBrZXkpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIGtleSA9IHRvUmF3KGtleSk7XG4gICAgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgfSBlbHNlIGlmICh0cnVlKSB7XG4gICAgY2hlY2tJZGVudGl0eUtleXModGFyZ2V0LCBoYXMyLCBrZXkpO1xuICB9XG4gIGNvbnN0IG9sZFZhbHVlID0gZ2V0My5jYWxsKHRhcmdldCwga2V5KTtcbiAgdGFyZ2V0LnNldChrZXksIHZhbHVlKTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJhZGRcIiwga2V5LCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoaGFzQ2hhbmdlZCh2YWx1ZSwgb2xkVmFsdWUpKSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwic2V0XCIsIGtleSwgdmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbmZ1bmN0aW9uIGRlbGV0ZUVudHJ5KGtleSkge1xuICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcbiAgY29uc3QgeyBoYXM6IGhhczIsIGdldDogZ2V0MyB9ID0gZ2V0UHJvdG8odGFyZ2V0KTtcbiAgbGV0IGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAga2V5ID0gdG9SYXcoa2V5KTtcbiAgICBoYWRLZXkgPSBoYXMyLmNhbGwodGFyZ2V0LCBrZXkpO1xuICB9IGVsc2UgaWYgKHRydWUpIHtcbiAgICBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhczIsIGtleSk7XG4gIH1cbiAgY29uc3Qgb2xkVmFsdWUgPSBnZXQzID8gZ2V0My5jYWxsKHRhcmdldCwga2V5KSA6IHZvaWQgMDtcbiAgY29uc3QgcmVzdWx0ID0gdGFyZ2V0LmRlbGV0ZShrZXkpO1xuICBpZiAoaGFkS2V5KSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiZGVsZXRlXCIsIGtleSwgdm9pZCAwLCBvbGRWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcbiAgY29uc3QgaGFkSXRlbXMgPSB0YXJnZXQuc2l6ZSAhPT0gMDtcbiAgY29uc3Qgb2xkVGFyZ2V0ID0gdHJ1ZSA/IGlzTWFwKHRhcmdldCkgPyBuZXcgTWFwKHRhcmdldCkgOiBuZXcgU2V0KHRhcmdldCkgOiB2b2lkIDA7XG4gIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5jbGVhcigpO1xuICBpZiAoaGFkSXRlbXMpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJjbGVhclwiLCB2b2lkIDAsIHZvaWQgMCwgb2xkVGFyZ2V0KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gY3JlYXRlRm9yRWFjaChpc1JlYWRvbmx5LCBpc1NoYWxsb3cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBjb25zdCBvYnNlcnZlZCA9IHRoaXM7XG4gICAgY29uc3QgdGFyZ2V0ID0gb2JzZXJ2ZWRbXG4gICAgICBcIl9fdl9yYXdcIlxuICAgICAgLyogUkFXICovXG4gICAgXTtcbiAgICBjb25zdCByYXdUYXJnZXQgPSB0b1Jhdyh0YXJnZXQpO1xuICAgIGNvbnN0IHdyYXAgPSBpc1NoYWxsb3cgPyB0b1NoYWxsb3cgOiBpc1JlYWRvbmx5ID8gdG9SZWFkb25seSA6IHRvUmVhY3RpdmU7XG4gICAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcIml0ZXJhdGVcIiwgSVRFUkFURV9LRVkpO1xuICAgIHJldHVybiB0YXJnZXQuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgd3JhcCh2YWx1ZSksIHdyYXAoa2V5KSwgb2JzZXJ2ZWQpO1xuICAgIH0pO1xuICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCBpc1JlYWRvbmx5LCBpc1NoYWxsb3cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzW1xuICAgICAgXCJfX3ZfcmF3XCJcbiAgICAgIC8qIFJBVyAqL1xuICAgIF07XG4gICAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgICBjb25zdCB0YXJnZXRJc01hcCA9IGlzTWFwKHJhd1RhcmdldCk7XG4gICAgY29uc3QgaXNQYWlyID0gbWV0aG9kID09PSBcImVudHJpZXNcIiB8fCBtZXRob2QgPT09IFN5bWJvbC5pdGVyYXRvciAmJiB0YXJnZXRJc01hcDtcbiAgICBjb25zdCBpc0tleU9ubHkgPSBtZXRob2QgPT09IFwia2V5c1wiICYmIHRhcmdldElzTWFwO1xuICAgIGNvbnN0IGlubmVySXRlcmF0b3IgPSB0YXJnZXRbbWV0aG9kXSguLi5hcmdzKTtcbiAgICBjb25zdCB3cmFwID0gaXNTaGFsbG93ID8gdG9TaGFsbG93IDogaXNSZWFkb25seSA/IHRvUmVhZG9ubHkgOiB0b1JlYWN0aXZlO1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJpdGVyYXRlXCIsIGlzS2V5T25seSA/IE1BUF9LRVlfSVRFUkFURV9LRVkgOiBJVEVSQVRFX0tFWSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIGl0ZXJhdG9yIHByb3RvY29sXG4gICAgICBuZXh0KCkge1xuICAgICAgICBjb25zdCB7IHZhbHVlLCBkb25lIH0gPSBpbm5lckl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIGRvbmUgPyB7IHZhbHVlLCBkb25lIH0gOiB7XG4gICAgICAgICAgdmFsdWU6IGlzUGFpciA/IFt3cmFwKHZhbHVlWzBdKSwgd3JhcCh2YWx1ZVsxXSldIDogd3JhcCh2YWx1ZSksXG4gICAgICAgICAgZG9uZVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIC8vIGl0ZXJhYmxlIHByb3RvY29sXG4gICAgICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJlYWRvbmx5TWV0aG9kKHR5cGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBpZiAodHJ1ZSkge1xuICAgICAgY29uc3Qga2V5ID0gYXJnc1swXSA/IGBvbiBrZXkgXCIke2FyZ3NbMF19XCIgYCA6IGBgO1xuICAgICAgY29uc29sZS53YXJuKGAke2NhcGl0YWxpemUodHlwZSl9IG9wZXJhdGlvbiAke2tleX1mYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLCB0b1Jhdyh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiB0eXBlID09PSBcImRlbGV0ZVwiID8gZmFsc2UgOiB0aGlzO1xuICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudGF0aW9ucygpIHtcbiAgY29uc3QgbXV0YWJsZUluc3RydW1lbnRhdGlvbnMyID0ge1xuICAgIGdldChrZXkpIHtcbiAgICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXkpO1xuICAgIH0sXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gc2l6ZSh0aGlzKTtcbiAgICB9LFxuICAgIGhhczogaGFzJDEsXG4gICAgYWRkLFxuICAgIHNldDogc2V0JDEsXG4gICAgZGVsZXRlOiBkZWxldGVFbnRyeSxcbiAgICBjbGVhcixcbiAgICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKGZhbHNlLCBmYWxzZSlcbiAgfTtcbiAgY29uc3Qgc2hhbGxvd0luc3RydW1lbnRhdGlvbnMyID0ge1xuICAgIGdldChrZXkpIHtcbiAgICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXksIGZhbHNlLCB0cnVlKTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHNpemUodGhpcyk7XG4gICAgfSxcbiAgICBoYXM6IGhhcyQxLFxuICAgIGFkZCxcbiAgICBzZXQ6IHNldCQxLFxuICAgIGRlbGV0ZTogZGVsZXRlRW50cnksXG4gICAgY2xlYXIsXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaChmYWxzZSwgdHJ1ZSlcbiAgfTtcbiAgY29uc3QgcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMiA9IHtcbiAgICBnZXQoa2V5KSB7XG4gICAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5LCB0cnVlKTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHNpemUodGhpcywgdHJ1ZSk7XG4gICAgfSxcbiAgICBoYXMoa2V5KSB7XG4gICAgICByZXR1cm4gaGFzJDEuY2FsbCh0aGlzLCBrZXksIHRydWUpO1xuICAgIH0sXG4gICAgYWRkOiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwiYWRkXCJcbiAgICAgIC8qIEFERCAqL1xuICAgICksXG4gICAgc2V0OiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwic2V0XCJcbiAgICAgIC8qIFNFVCAqL1xuICAgICksXG4gICAgZGVsZXRlOiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwiZGVsZXRlXCJcbiAgICAgIC8qIERFTEVURSAqL1xuICAgICksXG4gICAgY2xlYXI6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJjbGVhclwiXG4gICAgICAvKiBDTEVBUiAqL1xuICAgICksXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaCh0cnVlLCBmYWxzZSlcbiAgfTtcbiAgY29uc3Qgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczIgPSB7XG4gICAgZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiBzaXplKHRoaXMsIHRydWUpO1xuICAgIH0sXG4gICAgaGFzKGtleSkge1xuICAgICAgcmV0dXJuIGhhcyQxLmNhbGwodGhpcywga2V5LCB0cnVlKTtcbiAgICB9LFxuICAgIGFkZDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImFkZFwiXG4gICAgICAvKiBBREQgKi9cbiAgICApLFxuICAgIHNldDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcInNldFwiXG4gICAgICAvKiBTRVQgKi9cbiAgICApLFxuICAgIGRlbGV0ZTogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImRlbGV0ZVwiXG4gICAgICAvKiBERUxFVEUgKi9cbiAgICApLFxuICAgIGNsZWFyOiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwiY2xlYXJcIlxuICAgICAgLyogQ0xFQVIgKi9cbiAgICApLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2godHJ1ZSwgdHJ1ZSlcbiAgfTtcbiAgY29uc3QgaXRlcmF0b3JNZXRob2RzID0gW1wia2V5c1wiLCBcInZhbHVlc1wiLCBcImVudHJpZXNcIiwgU3ltYm9sLml0ZXJhdG9yXTtcbiAgaXRlcmF0b3JNZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgIG11dGFibGVJbnN0cnVtZW50YXRpb25zMlttZXRob2RdID0gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCBmYWxzZSwgZmFsc2UpO1xuICAgIHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgdHJ1ZSwgZmFsc2UpO1xuICAgIHNoYWxsb3dJbnN0cnVtZW50YXRpb25zMlttZXRob2RdID0gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCBmYWxzZSwgdHJ1ZSk7XG4gICAgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgdHJ1ZSwgdHJ1ZSk7XG4gIH0pO1xuICByZXR1cm4gW1xuICAgIG11dGFibGVJbnN0cnVtZW50YXRpb25zMixcbiAgICByZWFkb25seUluc3RydW1lbnRhdGlvbnMyLFxuICAgIHNoYWxsb3dJbnN0cnVtZW50YXRpb25zMixcbiAgICBzaGFsbG93UmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMlxuICBdO1xufVxudmFyIFttdXRhYmxlSW5zdHJ1bWVudGF0aW9ucywgcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zLCBzaGFsbG93SW5zdHJ1bWVudGF0aW9ucywgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9uc10gPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlSW5zdHJ1bWVudGF0aW9ucygpO1xuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGlzUmVhZG9ubHksIHNoYWxsb3cpIHtcbiAgY29uc3QgaW5zdHJ1bWVudGF0aW9ucyA9IHNoYWxsb3cgPyBpc1JlYWRvbmx5ID8gc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9ucyA6IHNoYWxsb3dJbnN0cnVtZW50YXRpb25zIDogaXNSZWFkb25seSA/IHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9ucyA6IG11dGFibGVJbnN0cnVtZW50YXRpb25zO1xuICByZXR1cm4gKHRhcmdldCwga2V5LCByZWNlaXZlcikgPT4ge1xuICAgIGlmIChrZXkgPT09IFwiX192X2lzUmVhY3RpdmVcIikge1xuICAgICAgcmV0dXJuICFpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWRvbmx5XCIpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9yYXdcIikge1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0KGhhc093bihpbnN0cnVtZW50YXRpb25zLCBrZXkpICYmIGtleSBpbiB0YXJnZXQgPyBpbnN0cnVtZW50YXRpb25zIDogdGFyZ2V0LCBrZXksIHJlY2VpdmVyKTtcbiAgfTtcbn1cbnZhciBtdXRhYmxlQ29sbGVjdGlvbkhhbmRsZXJzID0ge1xuICBnZXQ6IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVJbnN0cnVtZW50YXRpb25HZXR0ZXIoZmFsc2UsIGZhbHNlKVxufTtcbnZhciByZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycyA9IHtcbiAgZ2V0OiAvKiBAX19QVVJFX18gKi8gY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKHRydWUsIGZhbHNlKVxufTtcbmZ1bmN0aW9uIGNoZWNrSWRlbnRpdHlLZXlzKHRhcmdldCwgaGFzMiwga2V5KSB7XG4gIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XG4gIGlmIChyYXdLZXkgIT09IGtleSAmJiBoYXMyLmNhbGwodGFyZ2V0LCByYXdLZXkpKSB7XG4gICAgY29uc3QgdHlwZSA9IHRvUmF3VHlwZSh0YXJnZXQpO1xuICAgIGNvbnNvbGUud2FybihgUmVhY3RpdmUgJHt0eXBlfSBjb250YWlucyBib3RoIHRoZSByYXcgYW5kIHJlYWN0aXZlIHZlcnNpb25zIG9mIHRoZSBzYW1lIG9iamVjdCR7dHlwZSA9PT0gYE1hcGAgPyBgIGFzIGtleXNgIDogYGB9LCB3aGljaCBjYW4gbGVhZCB0byBpbmNvbnNpc3RlbmNpZXMuIEF2b2lkIGRpZmZlcmVudGlhdGluZyBiZXR3ZWVuIHRoZSByYXcgYW5kIHJlYWN0aXZlIHZlcnNpb25zIG9mIGFuIG9iamVjdCBhbmQgb25seSB1c2UgdGhlIHJlYWN0aXZlIHZlcnNpb24gaWYgcG9zc2libGUuYCk7XG4gIH1cbn1cbnZhciByZWFjdGl2ZU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHNoYWxsb3dSZWFjdGl2ZU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHJlYWRvbmx5TWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgc2hhbGxvd1JlYWRvbmx5TWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiB0YXJnZXRUeXBlTWFwKHJhd1R5cGUpIHtcbiAgc3dpdGNoIChyYXdUeXBlKSB7XG4gICAgY2FzZSBcIk9iamVjdFwiOlxuICAgIGNhc2UgXCJBcnJheVwiOlxuICAgICAgcmV0dXJuIDE7XG4gICAgY2FzZSBcIk1hcFwiOlxuICAgIGNhc2UgXCJTZXRcIjpcbiAgICBjYXNlIFwiV2Vha01hcFwiOlxuICAgIGNhc2UgXCJXZWFrU2V0XCI6XG4gICAgICByZXR1cm4gMjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIDA7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldFRhcmdldFR5cGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlW1xuICAgIFwiX192X3NraXBcIlxuICAgIC8qIFNLSVAgKi9cbiAgXSB8fCAhT2JqZWN0LmlzRXh0ZW5zaWJsZSh2YWx1ZSkgPyAwIDogdGFyZ2V0VHlwZU1hcCh0b1Jhd1R5cGUodmFsdWUpKTtcbn1cbmZ1bmN0aW9uIHJlYWN0aXZlMih0YXJnZXQpIHtcbiAgaWYgKHRhcmdldCAmJiB0YXJnZXRbXG4gICAgXCJfX3ZfaXNSZWFkb25seVwiXG4gICAgLyogSVNfUkVBRE9OTFkgKi9cbiAgXSkge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZVJlYWN0aXZlT2JqZWN0KHRhcmdldCwgZmFsc2UsIG11dGFibGVIYW5kbGVycywgbXV0YWJsZUNvbGxlY3Rpb25IYW5kbGVycywgcmVhY3RpdmVNYXApO1xufVxuZnVuY3Rpb24gcmVhZG9ubHkodGFyZ2V0KSB7XG4gIHJldHVybiBjcmVhdGVSZWFjdGl2ZU9iamVjdCh0YXJnZXQsIHRydWUsIHJlYWRvbmx5SGFuZGxlcnMsIHJlYWRvbmx5Q29sbGVjdGlvbkhhbmRsZXJzLCByZWFkb25seU1hcCk7XG59XG5mdW5jdGlvbiBjcmVhdGVSZWFjdGl2ZU9iamVjdCh0YXJnZXQsIGlzUmVhZG9ubHksIGJhc2VIYW5kbGVycywgY29sbGVjdGlvbkhhbmRsZXJzLCBwcm94eU1hcCkge1xuICBpZiAoIWlzT2JqZWN0KHRhcmdldCkpIHtcbiAgICBpZiAodHJ1ZSkge1xuICAgICAgY29uc29sZS53YXJuKGB2YWx1ZSBjYW5ub3QgYmUgbWFkZSByZWFjdGl2ZTogJHtTdHJpbmcodGFyZ2V0KX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICBpZiAodGFyZ2V0W1xuICAgIFwiX192X3Jhd1wiXG4gICAgLyogUkFXICovXG4gIF0gJiYgIShpc1JlYWRvbmx5ICYmIHRhcmdldFtcbiAgICBcIl9fdl9pc1JlYWN0aXZlXCJcbiAgICAvKiBJU19SRUFDVElWRSAqL1xuICBdKSkge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgY29uc3QgZXhpc3RpbmdQcm94eSA9IHByb3h5TWFwLmdldCh0YXJnZXQpO1xuICBpZiAoZXhpc3RpbmdQcm94eSkge1xuICAgIHJldHVybiBleGlzdGluZ1Byb3h5O1xuICB9XG4gIGNvbnN0IHRhcmdldFR5cGUgPSBnZXRUYXJnZXRUeXBlKHRhcmdldCk7XG4gIGlmICh0YXJnZXRUeXBlID09PSAwKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICBjb25zdCBwcm94eSA9IG5ldyBQcm94eSh0YXJnZXQsIHRhcmdldFR5cGUgPT09IDIgPyBjb2xsZWN0aW9uSGFuZGxlcnMgOiBiYXNlSGFuZGxlcnMpO1xuICBwcm94eU1hcC5zZXQodGFyZ2V0LCBwcm94eSk7XG4gIHJldHVybiBwcm94eTtcbn1cbmZ1bmN0aW9uIHRvUmF3KG9ic2VydmVkKSB7XG4gIHJldHVybiBvYnNlcnZlZCAmJiB0b1JhdyhvYnNlcnZlZFtcbiAgICBcIl9fdl9yYXdcIlxuICAgIC8qIFJBVyAqL1xuICBdKSB8fCBvYnNlcnZlZDtcbn1cbmZ1bmN0aW9uIGlzUmVmKHIpIHtcbiAgcmV0dXJuIEJvb2xlYW4ociAmJiByLl9fdl9pc1JlZiA9PT0gdHJ1ZSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJG5leHRUaWNrLmpzXG5tYWdpYyhcIm5leHRUaWNrXCIsICgpID0+IG5leHRUaWNrKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kZGlzcGF0Y2guanNcbm1hZ2ljKFwiZGlzcGF0Y2hcIiwgKGVsKSA9PiBkaXNwYXRjaC5iaW5kKGRpc3BhdGNoLCBlbCkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyR3YXRjaC5qc1xubWFnaWMoXCJ3YXRjaFwiLCAoZWwsIHsgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlcjIsIGNsZWFudXA6IGNsZWFudXAyIH0pID0+IChrZXksIGNhbGxiYWNrKSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyMihrZXkpO1xuICBsZXQgZ2V0dGVyID0gKCkgPT4ge1xuICAgIGxldCB2YWx1ZTtcbiAgICBldmFsdWF0ZTIoKGkpID0+IHZhbHVlID0gaSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuICBsZXQgdW53YXRjaCA9IHdhdGNoKGdldHRlciwgY2FsbGJhY2spO1xuICBjbGVhbnVwMih1bndhdGNoKTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRzdG9yZS5qc1xubWFnaWMoXCJzdG9yZVwiLCBnZXRTdG9yZXMpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRkYXRhLmpzXG5tYWdpYyhcImRhdGFcIiwgKGVsKSA9PiBzY29wZShlbCkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRyb290LmpzXG5tYWdpYyhcInJvb3RcIiwgKGVsKSA9PiBjbG9zZXN0Um9vdChlbCkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRyZWZzLmpzXG5tYWdpYyhcInJlZnNcIiwgKGVsKSA9PiB7XG4gIGlmIChlbC5feF9yZWZzX3Byb3h5KVxuICAgIHJldHVybiBlbC5feF9yZWZzX3Byb3h5O1xuICBlbC5feF9yZWZzX3Byb3h5ID0gbWVyZ2VQcm94aWVzKGdldEFycmF5T2ZSZWZPYmplY3QoZWwpKTtcbiAgcmV0dXJuIGVsLl94X3JlZnNfcHJveHk7XG59KTtcbmZ1bmN0aW9uIGdldEFycmF5T2ZSZWZPYmplY3QoZWwpIHtcbiAgbGV0IHJlZk9iamVjdHMgPSBbXTtcbiAgZmluZENsb3Nlc3QoZWwsIChpKSA9PiB7XG4gICAgaWYgKGkuX3hfcmVmcylcbiAgICAgIHJlZk9iamVjdHMucHVzaChpLl94X3JlZnMpO1xuICB9KTtcbiAgcmV0dXJuIHJlZk9iamVjdHM7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9pZHMuanNcbnZhciBnbG9iYWxJZE1lbW8gPSB7fTtcbmZ1bmN0aW9uIGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKSB7XG4gIGlmICghZ2xvYmFsSWRNZW1vW25hbWVdKVxuICAgIGdsb2JhbElkTWVtb1tuYW1lXSA9IDA7XG4gIHJldHVybiArK2dsb2JhbElkTWVtb1tuYW1lXTtcbn1cbmZ1bmN0aW9uIGNsb3Nlc3RJZFJvb3QoZWwsIG5hbWUpIHtcbiAgcmV0dXJuIGZpbmRDbG9zZXN0KGVsLCAoZWxlbWVudCkgPT4ge1xuICAgIGlmIChlbGVtZW50Ll94X2lkcyAmJiBlbGVtZW50Ll94X2lkc1tuYW1lXSlcbiAgICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHNldElkUm9vdChlbCwgbmFtZSkge1xuICBpZiAoIWVsLl94X2lkcylcbiAgICBlbC5feF9pZHMgPSB7fTtcbiAgaWYgKCFlbC5feF9pZHNbbmFtZV0pXG4gICAgZWwuX3hfaWRzW25hbWVdID0gZmluZEFuZEluY3JlbWVudElkKG5hbWUpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRpZC5qc1xubWFnaWMoXCJpZFwiLCAoZWwsIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4gKG5hbWUsIGtleSA9IG51bGwpID0+IHtcbiAgbGV0IGNhY2hlS2V5ID0gYCR7bmFtZX0ke2tleSA/IGAtJHtrZXl9YCA6IFwiXCJ9YDtcbiAgcmV0dXJuIGNhY2hlSWRCeU5hbWVPbkVsZW1lbnQoZWwsIGNhY2hlS2V5LCBjbGVhbnVwMiwgKCkgPT4ge1xuICAgIGxldCByb290ID0gY2xvc2VzdElkUm9vdChlbCwgbmFtZSk7XG4gICAgbGV0IGlkID0gcm9vdCA/IHJvb3QuX3hfaWRzW25hbWVdIDogZmluZEFuZEluY3JlbWVudElkKG5hbWUpO1xuICAgIHJldHVybiBrZXkgPyBgJHtuYW1lfS0ke2lkfS0ke2tleX1gIDogYCR7bmFtZX0tJHtpZH1gO1xuICB9KTtcbn0pO1xuaW50ZXJjZXB0Q2xvbmUoKGZyb20sIHRvKSA9PiB7XG4gIGlmIChmcm9tLl94X2lkKSB7XG4gICAgdG8uX3hfaWQgPSBmcm9tLl94X2lkO1xuICB9XG59KTtcbmZ1bmN0aW9uIGNhY2hlSWRCeU5hbWVPbkVsZW1lbnQoZWwsIGNhY2hlS2V5LCBjbGVhbnVwMiwgY2FsbGJhY2spIHtcbiAgaWYgKCFlbC5feF9pZClcbiAgICBlbC5feF9pZCA9IHt9O1xuICBpZiAoZWwuX3hfaWRbY2FjaGVLZXldKVxuICAgIHJldHVybiBlbC5feF9pZFtjYWNoZUtleV07XG4gIGxldCBvdXRwdXQgPSBjYWxsYmFjaygpO1xuICBlbC5feF9pZFtjYWNoZUtleV0gPSBvdXRwdXQ7XG4gIGNsZWFudXAyKCgpID0+IHtcbiAgICBkZWxldGUgZWwuX3hfaWRbY2FjaGVLZXldO1xuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kZWwuanNcbm1hZ2ljKFwiZWxcIiwgKGVsKSA9PiBlbCk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvaW5kZXguanNcbndhcm5NaXNzaW5nUGx1Z2luTWFnaWMoXCJGb2N1c1wiLCBcImZvY3VzXCIsIFwiZm9jdXNcIik7XG53YXJuTWlzc2luZ1BsdWdpbk1hZ2ljKFwiUGVyc2lzdFwiLCBcInBlcnNpc3RcIiwgXCJwZXJzaXN0XCIpO1xuZnVuY3Rpb24gd2Fybk1pc3NpbmdQbHVnaW5NYWdpYyhuYW1lLCBtYWdpY05hbWUsIHNsdWcpIHtcbiAgbWFnaWMobWFnaWNOYW1lLCAoZWwpID0+IHdhcm4oYFlvdSBjYW4ndCB1c2UgWyQke21hZ2ljTmFtZX1dIHdpdGhvdXQgZmlyc3QgaW5zdGFsbGluZyB0aGUgXCIke25hbWV9XCIgcGx1Z2luIGhlcmU6IGh0dHBzOi8vYWxwaW5lanMuZGV2L3BsdWdpbnMvJHtzbHVnfWAsIGVsKSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtbW9kZWxhYmxlLmpzXG5kaXJlY3RpdmUoXCJtb2RlbGFibGVcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGxldCBmdW5jID0gZXZhbHVhdGVMYXRlcjIoZXhwcmVzc2lvbik7XG4gIGxldCBpbm5lckdldCA9ICgpID0+IHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGZ1bmMoKGkpID0+IHJlc3VsdCA9IGkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIGxldCBldmFsdWF0ZUlubmVyU2V0ID0gZXZhbHVhdGVMYXRlcjIoYCR7ZXhwcmVzc2lvbn0gPSBfX3BsYWNlaG9sZGVyYCk7XG4gIGxldCBpbm5lclNldCA9ICh2YWwpID0+IGV2YWx1YXRlSW5uZXJTZXQoKCkgPT4ge1xuICB9LCB7IHNjb3BlOiB7IFwiX19wbGFjZWhvbGRlclwiOiB2YWwgfSB9KTtcbiAgbGV0IGluaXRpYWxWYWx1ZSA9IGlubmVyR2V0KCk7XG4gIGlubmVyU2V0KGluaXRpYWxWYWx1ZSk7XG4gIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICBpZiAoIWVsLl94X21vZGVsKVxuICAgICAgcmV0dXJuO1xuICAgIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzW1wiZGVmYXVsdFwiXSgpO1xuICAgIGxldCBvdXRlckdldCA9IGVsLl94X21vZGVsLmdldDtcbiAgICBsZXQgb3V0ZXJTZXQgPSBlbC5feF9tb2RlbC5zZXQ7XG4gICAgbGV0IHJlbGVhc2VFbnRhbmdsZW1lbnQgPSBlbnRhbmdsZShcbiAgICAgIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBvdXRlckdldCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBvdXRlclNldCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gaW5uZXJHZXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgaW5uZXJTZXQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgICBjbGVhbnVwMihyZWxlYXNlRW50YW5nbGVtZW50KTtcbiAgfSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC10ZWxlcG9ydC5qc1xuZGlyZWN0aXZlKFwidGVsZXBvcnRcIiwgKGVsLCB7IG1vZGlmaWVycywgZXhwcmVzc2lvbiB9LCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJ0ZW1wbGF0ZVwiKVxuICAgIHdhcm4oXCJ4LXRlbGVwb3J0IGNhbiBvbmx5IGJlIHVzZWQgb24gYSA8dGVtcGxhdGU+IHRhZ1wiLCBlbCk7XG4gIGxldCB0YXJnZXQgPSBnZXRUYXJnZXQoZXhwcmVzc2lvbik7XG4gIGxldCBjbG9uZTIgPSBlbC5jb250ZW50LmNsb25lTm9kZSh0cnVlKS5maXJzdEVsZW1lbnRDaGlsZDtcbiAgZWwuX3hfdGVsZXBvcnQgPSBjbG9uZTI7XG4gIGNsb25lMi5feF90ZWxlcG9ydEJhY2sgPSBlbDtcbiAgZWwuc2V0QXR0cmlidXRlKFwiZGF0YS10ZWxlcG9ydC10ZW1wbGF0ZVwiLCB0cnVlKTtcbiAgY2xvbmUyLnNldEF0dHJpYnV0ZShcImRhdGEtdGVsZXBvcnQtdGFyZ2V0XCIsIHRydWUpO1xuICBpZiAoZWwuX3hfZm9yd2FyZEV2ZW50cykge1xuICAgIGVsLl94X2ZvcndhcmRFdmVudHMuZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICBjbG9uZTIuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IGUuY29uc3RydWN0b3IoZS50eXBlLCBlKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBhZGRTY29wZVRvTm9kZShjbG9uZTIsIHt9LCBlbCk7XG4gIGxldCBwbGFjZUluRG9tID0gKGNsb25lMywgdGFyZ2V0MiwgbW9kaWZpZXJzMikgPT4ge1xuICAgIGlmIChtb2RpZmllcnMyLmluY2x1ZGVzKFwicHJlcGVuZFwiKSkge1xuICAgICAgdGFyZ2V0Mi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjbG9uZTMsIHRhcmdldDIpO1xuICAgIH0gZWxzZSBpZiAobW9kaWZpZXJzMi5pbmNsdWRlcyhcImFwcGVuZFwiKSkge1xuICAgICAgdGFyZ2V0Mi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjbG9uZTMsIHRhcmdldDIubmV4dFNpYmxpbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQyLmFwcGVuZENoaWxkKGNsb25lMyk7XG4gICAgfVxuICB9O1xuICBtdXRhdGVEb20oKCkgPT4ge1xuICAgIHBsYWNlSW5Eb20oY2xvbmUyLCB0YXJnZXQsIG1vZGlmaWVycyk7XG4gICAgc2tpcER1cmluZ0Nsb25lKCgpID0+IHtcbiAgICAgIGluaXRUcmVlKGNsb25lMik7XG4gICAgfSkoKTtcbiAgfSk7XG4gIGVsLl94X3RlbGVwb3J0UHV0QmFjayA9ICgpID0+IHtcbiAgICBsZXQgdGFyZ2V0MiA9IGdldFRhcmdldChleHByZXNzaW9uKTtcbiAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgcGxhY2VJbkRvbShlbC5feF90ZWxlcG9ydCwgdGFyZ2V0MiwgbW9kaWZpZXJzKTtcbiAgICB9KTtcbiAgfTtcbiAgY2xlYW51cDIoXG4gICAgKCkgPT4gbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGNsb25lMi5yZW1vdmUoKTtcbiAgICAgIGRlc3Ryb3lUcmVlKGNsb25lMik7XG4gICAgfSlcbiAgKTtcbn0pO1xudmFyIHRlbGVwb3J0Q29udGFpbmVyRHVyaW5nQ2xvbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KGV4cHJlc3Npb24pIHtcbiAgbGV0IHRhcmdldCA9IHNraXBEdXJpbmdDbG9uZSgoKSA9PiB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZXhwcmVzc2lvbik7XG4gIH0sICgpID0+IHtcbiAgICByZXR1cm4gdGVsZXBvcnRDb250YWluZXJEdXJpbmdDbG9uZTtcbiAgfSkoKTtcbiAgaWYgKCF0YXJnZXQpXG4gICAgd2FybihgQ2Fubm90IGZpbmQgeC10ZWxlcG9ydCBlbGVtZW50IGZvciBzZWxlY3RvcjogXCIke2V4cHJlc3Npb259XCJgKTtcbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pZ25vcmUuanNcbnZhciBoYW5kbGVyID0gKCkgPT4ge1xufTtcbmhhbmRsZXIuaW5saW5lID0gKGVsLCB7IG1vZGlmaWVycyB9LCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgbW9kaWZpZXJzLmluY2x1ZGVzKFwic2VsZlwiKSA/IGVsLl94X2lnbm9yZVNlbGYgPSB0cnVlIDogZWwuX3hfaWdub3JlID0gdHJ1ZTtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIG1vZGlmaWVycy5pbmNsdWRlcyhcInNlbGZcIikgPyBkZWxldGUgZWwuX3hfaWdub3JlU2VsZiA6IGRlbGV0ZSBlbC5feF9pZ25vcmU7XG4gIH0pO1xufTtcbmRpcmVjdGl2ZShcImlnbm9yZVwiLCBoYW5kbGVyKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1lZmZlY3QuanNcbmRpcmVjdGl2ZShcImVmZmVjdFwiLCBza2lwRHVyaW5nQ2xvbmUoKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMgfSkgPT4ge1xuICBlZmZlY3QzKGV2YWx1YXRlTGF0ZXIoZWwsIGV4cHJlc3Npb24pKTtcbn0pKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL29uLmpzXG5mdW5jdGlvbiBvbihlbCwgZXZlbnQsIG1vZGlmaWVycywgY2FsbGJhY2spIHtcbiAgbGV0IGxpc3RlbmVyVGFyZ2V0ID0gZWw7XG4gIGxldCBoYW5kbGVyNCA9IChlKSA9PiBjYWxsYmFjayhlKTtcbiAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgbGV0IHdyYXBIYW5kbGVyID0gKGNhbGxiYWNrMiwgd3JhcHBlcikgPT4gKGUpID0+IHdyYXBwZXIoY2FsbGJhY2syLCBlKTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImRvdFwiKSlcbiAgICBldmVudCA9IGRvdFN5bnRheChldmVudCk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYW1lbFwiKSlcbiAgICBldmVudCA9IGNhbWVsQ2FzZTIoZXZlbnQpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFzc2l2ZVwiKSlcbiAgICBvcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FwdHVyZVwiKSlcbiAgICBvcHRpb25zLmNhcHR1cmUgPSB0cnVlO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwid2luZG93XCIpKVxuICAgIGxpc3RlbmVyVGFyZ2V0ID0gd2luZG93O1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZG9jdW1lbnRcIikpXG4gICAgbGlzdGVuZXJUYXJnZXQgPSBkb2N1bWVudDtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImRlYm91bmNlXCIpKSB7XG4gICAgbGV0IG5leHRNb2RpZmllciA9IG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihcImRlYm91bmNlXCIpICsgMV0gfHwgXCJpbnZhbGlkLXdhaXRcIjtcbiAgICBsZXQgd2FpdCA9IGlzTnVtZXJpYyhuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgPyBOdW1iZXIobmV4dE1vZGlmaWVyLnNwbGl0KFwibXNcIilbMF0pIDogMjUwO1xuICAgIGhhbmRsZXI0ID0gZGVib3VuY2UoaGFuZGxlcjQsIHdhaXQpO1xuICB9XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJ0aHJvdHRsZVwiKSkge1xuICAgIGxldCBuZXh0TW9kaWZpZXIgPSBtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2YoXCJ0aHJvdHRsZVwiKSArIDFdIHx8IFwiaW52YWxpZC13YWl0XCI7XG4gICAgbGV0IHdhaXQgPSBpc051bWVyaWMobmV4dE1vZGlmaWVyLnNwbGl0KFwibXNcIilbMF0pID8gTnVtYmVyKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA6IDI1MDtcbiAgICBoYW5kbGVyNCA9IHRocm90dGxlKGhhbmRsZXI0LCB3YWl0KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicHJldmVudFwiKSlcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInN0b3BcIikpXG4gICAgaGFuZGxlcjQgPSB3cmFwSGFuZGxlcihoYW5kbGVyNCwgKG5leHQsIGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBuZXh0KGUpO1xuICAgIH0pO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib25jZVwiKSkge1xuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBuZXh0KGUpO1xuICAgICAgbGlzdGVuZXJUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcjQsIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJhd2F5XCIpIHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcIm91dHNpZGVcIikpIHtcbiAgICBsaXN0ZW5lclRhcmdldCA9IGRvY3VtZW50O1xuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBpZiAoZWwuY29udGFpbnMoZS50YXJnZXQpKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZS50YXJnZXQuaXNDb25uZWN0ZWQgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZWwub2Zmc2V0V2lkdGggPCAxICYmIGVsLm9mZnNldEhlaWdodCA8IDEpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGlmIChlbC5feF9pc1Nob3duID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic2VsZlwiKSlcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgZS50YXJnZXQgPT09IGVsICYmIG5leHQoZSk7XG4gICAgfSk7XG4gIGlmIChpc0tleUV2ZW50KGV2ZW50KSB8fCBpc0NsaWNrRXZlbnQoZXZlbnQpKSB7XG4gICAgaGFuZGxlcjQgPSB3cmFwSGFuZGxlcihoYW5kbGVyNCwgKG5leHQsIGUpID0+IHtcbiAgICAgIGlmIChpc0xpc3RlbmluZ0ZvckFTcGVjaWZpY0tleVRoYXRIYXNudEJlZW5QcmVzc2VkKGUsIG1vZGlmaWVycykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgfVxuICBsaXN0ZW5lclRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyNCwgb3B0aW9ucyk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgbGlzdGVuZXJUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcjQsIG9wdGlvbnMpO1xuICB9O1xufVxuZnVuY3Rpb24gZG90U3ludGF4KHN1YmplY3QpIHtcbiAgcmV0dXJuIHN1YmplY3QucmVwbGFjZSgvLS9nLCBcIi5cIik7XG59XG5mdW5jdGlvbiBjYW1lbENhc2UyKHN1YmplY3QpIHtcbiAgcmV0dXJuIHN1YmplY3QudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tKFxcdykvZywgKG1hdGNoLCBjaGFyKSA9PiBjaGFyLnRvVXBwZXJDYXNlKCkpO1xufVxuZnVuY3Rpb24gaXNOdW1lcmljKHN1YmplY3QpIHtcbiAgcmV0dXJuICFBcnJheS5pc0FycmF5KHN1YmplY3QpICYmICFpc05hTihzdWJqZWN0KTtcbn1cbmZ1bmN0aW9uIGtlYmFiQ2FzZTIoc3ViamVjdCkge1xuICBpZiAoW1wiIFwiLCBcIl9cIl0uaW5jbHVkZXMoXG4gICAgc3ViamVjdFxuICApKVxuICAgIHJldHVybiBzdWJqZWN0O1xuICByZXR1cm4gc3ViamVjdC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBcIiQxLSQyXCIpLnJlcGxhY2UoL1tfXFxzXS8sIFwiLVwiKS50b0xvd2VyQ2FzZSgpO1xufVxuZnVuY3Rpb24gaXNLZXlFdmVudChldmVudCkge1xuICByZXR1cm4gW1wia2V5ZG93blwiLCBcImtleXVwXCJdLmluY2x1ZGVzKGV2ZW50KTtcbn1cbmZ1bmN0aW9uIGlzQ2xpY2tFdmVudChldmVudCkge1xuICByZXR1cm4gW1wiY29udGV4dG1lbnVcIiwgXCJjbGlja1wiLCBcIm1vdXNlXCJdLnNvbWUoKGkpID0+IGV2ZW50LmluY2x1ZGVzKGkpKTtcbn1cbmZ1bmN0aW9uIGlzTGlzdGVuaW5nRm9yQVNwZWNpZmljS2V5VGhhdEhhc250QmVlblByZXNzZWQoZSwgbW9kaWZpZXJzKSB7XG4gIGxldCBrZXlNb2RpZmllcnMgPSBtb2RpZmllcnMuZmlsdGVyKChpKSA9PiB7XG4gICAgcmV0dXJuICFbXCJ3aW5kb3dcIiwgXCJkb2N1bWVudFwiLCBcInByZXZlbnRcIiwgXCJzdG9wXCIsIFwib25jZVwiLCBcImNhcHR1cmVcIiwgXCJzZWxmXCIsIFwiYXdheVwiLCBcIm91dHNpZGVcIiwgXCJwYXNzaXZlXCJdLmluY2x1ZGVzKGkpO1xuICB9KTtcbiAgaWYgKGtleU1vZGlmaWVycy5pbmNsdWRlcyhcImRlYm91bmNlXCIpKSB7XG4gICAgbGV0IGRlYm91bmNlSW5kZXggPSBrZXlNb2RpZmllcnMuaW5kZXhPZihcImRlYm91bmNlXCIpO1xuICAgIGtleU1vZGlmaWVycy5zcGxpY2UoZGVib3VuY2VJbmRleCwgaXNOdW1lcmljKChrZXlNb2RpZmllcnNbZGVib3VuY2VJbmRleCArIDFdIHx8IFwiaW52YWxpZC13YWl0XCIpLnNwbGl0KFwibXNcIilbMF0pID8gMiA6IDEpO1xuICB9XG4gIGlmIChrZXlNb2RpZmllcnMuaW5jbHVkZXMoXCJ0aHJvdHRsZVwiKSkge1xuICAgIGxldCBkZWJvdW5jZUluZGV4ID0ga2V5TW9kaWZpZXJzLmluZGV4T2YoXCJ0aHJvdHRsZVwiKTtcbiAgICBrZXlNb2RpZmllcnMuc3BsaWNlKGRlYm91bmNlSW5kZXgsIGlzTnVtZXJpYygoa2V5TW9kaWZpZXJzW2RlYm91bmNlSW5kZXggKyAxXSB8fCBcImludmFsaWQtd2FpdFwiKS5zcGxpdChcIm1zXCIpWzBdKSA/IDIgOiAxKTtcbiAgfVxuICBpZiAoa2V5TW9kaWZpZXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmIChrZXlNb2RpZmllcnMubGVuZ3RoID09PSAxICYmIGtleVRvTW9kaWZpZXJzKGUua2V5KS5pbmNsdWRlcyhrZXlNb2RpZmllcnNbMF0pKVxuICAgIHJldHVybiBmYWxzZTtcbiAgY29uc3Qgc3lzdGVtS2V5TW9kaWZpZXJzID0gW1wiY3RybFwiLCBcInNoaWZ0XCIsIFwiYWx0XCIsIFwibWV0YVwiLCBcImNtZFwiLCBcInN1cGVyXCJdO1xuICBjb25zdCBzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycyA9IHN5c3RlbUtleU1vZGlmaWVycy5maWx0ZXIoKG1vZGlmaWVyKSA9PiBrZXlNb2RpZmllcnMuaW5jbHVkZXMobW9kaWZpZXIpKTtcbiAga2V5TW9kaWZpZXJzID0ga2V5TW9kaWZpZXJzLmZpbHRlcigoaSkgPT4gIXNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmluY2x1ZGVzKGkpKTtcbiAgaWYgKHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBhY3RpdmVseVByZXNzZWRLZXlNb2RpZmllcnMgPSBzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5maWx0ZXIoKG1vZGlmaWVyKSA9PiB7XG4gICAgICBpZiAobW9kaWZpZXIgPT09IFwiY21kXCIgfHwgbW9kaWZpZXIgPT09IFwic3VwZXJcIilcbiAgICAgICAgbW9kaWZpZXIgPSBcIm1ldGFcIjtcbiAgICAgIHJldHVybiBlW2Ake21vZGlmaWVyfUtleWBdO1xuICAgIH0pO1xuICAgIGlmIChhY3RpdmVseVByZXNzZWRLZXlNb2RpZmllcnMubGVuZ3RoID09PSBzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5sZW5ndGgpIHtcbiAgICAgIGlmIChpc0NsaWNrRXZlbnQoZS50eXBlKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKGtleVRvTW9kaWZpZXJzKGUua2V5KS5pbmNsdWRlcyhrZXlNb2RpZmllcnNbMF0pKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24ga2V5VG9Nb2RpZmllcnMoa2V5KSB7XG4gIGlmICgha2V5KVxuICAgIHJldHVybiBbXTtcbiAga2V5ID0ga2ViYWJDYXNlMihrZXkpO1xuICBsZXQgbW9kaWZpZXJUb0tleU1hcCA9IHtcbiAgICBcImN0cmxcIjogXCJjb250cm9sXCIsXG4gICAgXCJzbGFzaFwiOiBcIi9cIixcbiAgICBcInNwYWNlXCI6IFwiIFwiLFxuICAgIFwic3BhY2ViYXJcIjogXCIgXCIsXG4gICAgXCJjbWRcIjogXCJtZXRhXCIsXG4gICAgXCJlc2NcIjogXCJlc2NhcGVcIixcbiAgICBcInVwXCI6IFwiYXJyb3ctdXBcIixcbiAgICBcImRvd25cIjogXCJhcnJvdy1kb3duXCIsXG4gICAgXCJsZWZ0XCI6IFwiYXJyb3ctbGVmdFwiLFxuICAgIFwicmlnaHRcIjogXCJhcnJvdy1yaWdodFwiLFxuICAgIFwicGVyaW9kXCI6IFwiLlwiLFxuICAgIFwiY29tbWFcIjogXCIsXCIsXG4gICAgXCJlcXVhbFwiOiBcIj1cIixcbiAgICBcIm1pbnVzXCI6IFwiLVwiLFxuICAgIFwidW5kZXJzY29yZVwiOiBcIl9cIlxuICB9O1xuICBtb2RpZmllclRvS2V5TWFwW2tleV0gPSBrZXk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhtb2RpZmllclRvS2V5TWFwKS5tYXAoKG1vZGlmaWVyKSA9PiB7XG4gICAgaWYgKG1vZGlmaWVyVG9LZXlNYXBbbW9kaWZpZXJdID09PSBrZXkpXG4gICAgICByZXR1cm4gbW9kaWZpZXI7XG4gIH0pLmZpbHRlcigobW9kaWZpZXIpID0+IG1vZGlmaWVyKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1tb2RlbC5qc1xuZGlyZWN0aXZlKFwibW9kZWxcIiwgKGVsLCB7IG1vZGlmaWVycywgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgc2NvcGVUYXJnZXQgPSBlbDtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInBhcmVudFwiKSkge1xuICAgIHNjb3BlVGFyZ2V0ID0gZWwucGFyZW50Tm9kZTtcbiAgfVxuICBsZXQgZXZhbHVhdGVHZXQgPSBldmFsdWF0ZUxhdGVyKHNjb3BlVGFyZ2V0LCBleHByZXNzaW9uKTtcbiAgbGV0IGV2YWx1YXRlU2V0O1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIpIHtcbiAgICBldmFsdWF0ZVNldCA9IGV2YWx1YXRlTGF0ZXIoc2NvcGVUYXJnZXQsIGAke2V4cHJlc3Npb259ID0gX19wbGFjZWhvbGRlcmApO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGV4cHJlc3Npb24oKSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGV2YWx1YXRlU2V0ID0gZXZhbHVhdGVMYXRlcihzY29wZVRhcmdldCwgYCR7ZXhwcmVzc2lvbigpfSA9IF9fcGxhY2Vob2xkZXJgKTtcbiAgfSBlbHNlIHtcbiAgICBldmFsdWF0ZVNldCA9ICgpID0+IHtcbiAgICB9O1xuICB9XG4gIGxldCBnZXRWYWx1ZSA9ICgpID0+IHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGV2YWx1YXRlR2V0KCh2YWx1ZSkgPT4gcmVzdWx0ID0gdmFsdWUpO1xuICAgIHJldHVybiBpc0dldHRlclNldHRlcihyZXN1bHQpID8gcmVzdWx0LmdldCgpIDogcmVzdWx0O1xuICB9O1xuICBsZXQgc2V0VmFsdWUgPSAodmFsdWUpID0+IHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGV2YWx1YXRlR2V0KCh2YWx1ZTIpID0+IHJlc3VsdCA9IHZhbHVlMik7XG4gICAgaWYgKGlzR2V0dGVyU2V0dGVyKHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdC5zZXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmFsdWF0ZVNldCgoKSA9PiB7XG4gICAgICB9LCB7XG4gICAgICAgIHNjb3BlOiB7IFwiX19wbGFjZWhvbGRlclwiOiB2YWx1ZSB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJzdHJpbmdcIiAmJiBlbC50eXBlID09PSBcInJhZGlvXCIpIHtcbiAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUoXCJuYW1lXCIpKVxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIGV4cHJlc3Npb24pO1xuICAgIH0pO1xuICB9XG4gIHZhciBldmVudCA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIiB8fCBbXCJjaGVja2JveFwiLCBcInJhZGlvXCJdLmluY2x1ZGVzKGVsLnR5cGUpIHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcImxhenlcIikgPyBcImNoYW5nZVwiIDogXCJpbnB1dFwiO1xuICBsZXQgcmVtb3ZlTGlzdGVuZXIgPSBpc0Nsb25pbmcgPyAoKSA9PiB7XG4gIH0gOiBvbihlbCwgZXZlbnQsIG1vZGlmaWVycywgKGUpID0+IHtcbiAgICBzZXRWYWx1ZShnZXRJbnB1dFZhbHVlKGVsLCBtb2RpZmllcnMsIGUsIGdldFZhbHVlKCkpKTtcbiAgfSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJmaWxsXCIpKSB7XG4gICAgaWYgKFt2b2lkIDAsIG51bGwsIFwiXCJdLmluY2x1ZGVzKGdldFZhbHVlKCkpIHx8IGlzQ2hlY2tib3goZWwpICYmIEFycmF5LmlzQXJyYXkoZ2V0VmFsdWUoKSkgfHwgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInNlbGVjdFwiICYmIGVsLm11bHRpcGxlKSB7XG4gICAgICBzZXRWYWx1ZShcbiAgICAgICAgZ2V0SW5wdXRWYWx1ZShlbCwgbW9kaWZpZXJzLCB7IHRhcmdldDogZWwgfSwgZ2V0VmFsdWUoKSlcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIGlmICghZWwuX3hfcmVtb3ZlTW9kZWxMaXN0ZW5lcnMpXG4gICAgZWwuX3hfcmVtb3ZlTW9kZWxMaXN0ZW5lcnMgPSB7fTtcbiAgZWwuX3hfcmVtb3ZlTW9kZWxMaXN0ZW5lcnNbXCJkZWZhdWx0XCJdID0gcmVtb3ZlTGlzdGVuZXI7XG4gIGNsZWFudXAyKCgpID0+IGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzW1wiZGVmYXVsdFwiXSgpKTtcbiAgaWYgKGVsLmZvcm0pIHtcbiAgICBsZXQgcmVtb3ZlUmVzZXRMaXN0ZW5lciA9IG9uKGVsLmZvcm0sIFwicmVzZXRcIiwgW10sIChlKSA9PiB7XG4gICAgICBuZXh0VGljaygoKSA9PiBlbC5feF9tb2RlbCAmJiBlbC5feF9tb2RlbC5zZXQoZ2V0SW5wdXRWYWx1ZShlbCwgbW9kaWZpZXJzLCB7IHRhcmdldDogZWwgfSwgZ2V0VmFsdWUoKSkpKTtcbiAgICB9KTtcbiAgICBjbGVhbnVwMigoKSA9PiByZW1vdmVSZXNldExpc3RlbmVyKCkpO1xuICB9XG4gIGVsLl94X21vZGVsID0ge1xuICAgIGdldCgpIHtcbiAgICAgIHJldHVybiBnZXRWYWx1ZSgpO1xuICAgIH0sXG4gICAgc2V0KHZhbHVlKSB7XG4gICAgICBzZXRWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICB9O1xuICBlbC5feF9mb3JjZU1vZGVsVXBkYXRlID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDAgJiYgdHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIgJiYgZXhwcmVzc2lvbi5tYXRjaCgvXFwuLykpXG4gICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgd2luZG93LmZyb21Nb2RlbCA9IHRydWU7XG4gICAgbXV0YXRlRG9tKCgpID0+IGJpbmQoZWwsIFwidmFsdWVcIiwgdmFsdWUpKTtcbiAgICBkZWxldGUgd2luZG93LmZyb21Nb2RlbDtcbiAgfTtcbiAgZWZmZWN0MygoKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoKTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwidW5pbnRydXNpdmVcIikgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5pc1NhbWVOb2RlKGVsKSlcbiAgICAgIHJldHVybjtcbiAgICBlbC5feF9mb3JjZU1vZGVsVXBkYXRlKHZhbHVlKTtcbiAgfSk7XG59KTtcbmZ1bmN0aW9uIGdldElucHV0VmFsdWUoZWwsIG1vZGlmaWVycywgZXZlbnQsIGN1cnJlbnRWYWx1ZSkge1xuICByZXR1cm4gbXV0YXRlRG9tKCgpID0+IHtcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBDdXN0b21FdmVudCAmJiBldmVudC5kZXRhaWwgIT09IHZvaWQgMClcbiAgICAgIHJldHVybiBldmVudC5kZXRhaWwgIT09IG51bGwgJiYgZXZlbnQuZGV0YWlsICE9PSB2b2lkIDAgPyBldmVudC5kZXRhaWwgOiBldmVudC50YXJnZXQudmFsdWU7XG4gICAgZWxzZSBpZiAoaXNDaGVja2JveChlbCkpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm51bWJlclwiKSkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gc2FmZVBhcnNlTnVtYmVyKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiYm9vbGVhblwiKSkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gc2FmZVBhcnNlQm9vbGVhbihldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1ZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBldmVudC50YXJnZXQuY2hlY2tlZCA/IGN1cnJlbnRWYWx1ZS5pbmNsdWRlcyhuZXdWYWx1ZSkgPyBjdXJyZW50VmFsdWUgOiBjdXJyZW50VmFsdWUuY29uY2F0KFtuZXdWYWx1ZV0pIDogY3VycmVudFZhbHVlLmZpbHRlcigoZWwyKSA9PiAhY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUyKGVsMiwgbmV3VmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBldmVudC50YXJnZXQuY2hlY2tlZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIiAmJiBlbC5tdWx0aXBsZSkge1xuICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm51bWJlclwiKSkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShldmVudC50YXJnZXQuc2VsZWN0ZWRPcHRpb25zKS5tYXAoKG9wdGlvbikgPT4ge1xuICAgICAgICAgIGxldCByYXdWYWx1ZSA9IG9wdGlvbi52YWx1ZSB8fCBvcHRpb24udGV4dDtcbiAgICAgICAgICByZXR1cm4gc2FmZVBhcnNlTnVtYmVyKHJhd1ZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImJvb2xlYW5cIikpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucykubWFwKChvcHRpb24pID0+IHtcbiAgICAgICAgICBsZXQgcmF3VmFsdWUgPSBvcHRpb24udmFsdWUgfHwgb3B0aW9uLnRleHQ7XG4gICAgICAgICAgcmV0dXJuIHNhZmVQYXJzZUJvb2xlYW4ocmF3VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGV2ZW50LnRhcmdldC5zZWxlY3RlZE9wdGlvbnMpLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiBvcHRpb24udmFsdWUgfHwgb3B0aW9uLnRleHQ7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5ld1ZhbHVlO1xuICAgICAgaWYgKGlzUmFkaW8oZWwpKSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1ZhbHVlID0gY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikpIHtcbiAgICAgICAgcmV0dXJuIHNhZmVQYXJzZU51bWJlcihuZXdWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImJvb2xlYW5cIikpIHtcbiAgICAgICAgcmV0dXJuIHNhZmVQYXJzZUJvb2xlYW4obmV3VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJ0cmltXCIpKSB7XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZS50cmltKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIHNhZmVQYXJzZU51bWJlcihyYXdWYWx1ZSkge1xuICBsZXQgbnVtYmVyID0gcmF3VmFsdWUgPyBwYXJzZUZsb2F0KHJhd1ZhbHVlKSA6IG51bGw7XG4gIHJldHVybiBpc051bWVyaWMyKG51bWJlcikgPyBudW1iZXIgOiByYXdWYWx1ZTtcbn1cbmZ1bmN0aW9uIGNoZWNrZWRBdHRyTG9vc2VDb21wYXJlMih2YWx1ZUEsIHZhbHVlQikge1xuICByZXR1cm4gdmFsdWVBID09IHZhbHVlQjtcbn1cbmZ1bmN0aW9uIGlzTnVtZXJpYzIoc3ViamVjdCkge1xuICByZXR1cm4gIUFycmF5LmlzQXJyYXkoc3ViamVjdCkgJiYgIWlzTmFOKHN1YmplY3QpO1xufVxuZnVuY3Rpb24gaXNHZXR0ZXJTZXR0ZXIodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUuZ2V0ID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHZhbHVlLnNldCA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWNsb2FrLmpzXG5kaXJlY3RpdmUoXCJjbG9ha1wiLCAoZWwpID0+IHF1ZXVlTWljcm90YXNrKCgpID0+IG11dGF0ZURvbSgoKSA9PiBlbC5yZW1vdmVBdHRyaWJ1dGUocHJlZml4KFwiY2xvYWtcIikpKSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWluaXQuanNcbmFkZEluaXRTZWxlY3RvcigoKSA9PiBgWyR7cHJlZml4KFwiaW5pdFwiKX1dYCk7XG5kaXJlY3RpdmUoXCJpbml0XCIsIHNraXBEdXJpbmdDbG9uZSgoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGV2YWx1YXRlOiBldmFsdWF0ZTIgfSkgPT4ge1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gISFleHByZXNzaW9uLnRyaW0oKSAmJiBldmFsdWF0ZTIoZXhwcmVzc2lvbiwge30sIGZhbHNlKTtcbiAgfVxuICByZXR1cm4gZXZhbHVhdGUyKGV4cHJlc3Npb24sIHt9LCBmYWxzZSk7XG59KSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtdGV4dC5qc1xuZGlyZWN0aXZlKFwidGV4dFwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlcjIgfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoZXhwcmVzc2lvbik7XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1odG1sLmpzXG5kaXJlY3RpdmUoXCJodG1sXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyMiB9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyMihleHByZXNzaW9uKTtcbiAgZWZmZWN0MygoKSA9PiB7XG4gICAgZXZhbHVhdGUyKCh2YWx1ZSkgPT4ge1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIGVsLl94X2lnbm9yZVNlbGYgPSB0cnVlO1xuICAgICAgICBpbml0VHJlZShlbCk7XG4gICAgICAgIGRlbGV0ZSBlbC5feF9pZ25vcmVTZWxmO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtYmluZC5qc1xubWFwQXR0cmlidXRlcyhzdGFydGluZ1dpdGgoXCI6XCIsIGludG8ocHJlZml4KFwiYmluZDpcIikpKSk7XG52YXIgaGFuZGxlcjIgPSAoZWwsIHsgdmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiwgb3JpZ2luYWwgfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIGxldCBiaW5kaW5nUHJvdmlkZXJzID0ge307XG4gICAgaW5qZWN0QmluZGluZ1Byb3ZpZGVycyhiaW5kaW5nUHJvdmlkZXJzKTtcbiAgICBsZXQgZ2V0QmluZGluZ3MgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgICBnZXRCaW5kaW5ncygoYmluZGluZ3MpID0+IHtcbiAgICAgIGFwcGx5QmluZGluZ3NPYmplY3QoZWwsIGJpbmRpbmdzLCBvcmlnaW5hbCk7XG4gICAgfSwgeyBzY29wZTogYmluZGluZ1Byb3ZpZGVycyB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHZhbHVlID09PSBcImtleVwiKVxuICAgIHJldHVybiBzdG9yZUtleUZvclhGb3IoZWwsIGV4cHJlc3Npb24pO1xuICBpZiAoZWwuX3hfaW5saW5lQmluZGluZ3MgJiYgZWwuX3hfaW5saW5lQmluZGluZ3NbdmFsdWVdICYmIGVsLl94X2lubGluZUJpbmRpbmdzW3ZhbHVlXS5leHRyYWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgZWZmZWN0MygoKSA9PiBldmFsdWF0ZTIoKHJlc3VsdCkgPT4ge1xuICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCAmJiB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJzdHJpbmdcIiAmJiBleHByZXNzaW9uLm1hdGNoKC9cXC4vKSkge1xuICAgICAgcmVzdWx0ID0gXCJcIjtcbiAgICB9XG4gICAgbXV0YXRlRG9tKCgpID0+IGJpbmQoZWwsIHZhbHVlLCByZXN1bHQsIG1vZGlmaWVycykpO1xuICB9KSk7XG4gIGNsZWFudXAyKCgpID0+IHtcbiAgICBlbC5feF91bmRvQWRkZWRDbGFzc2VzICYmIGVsLl94X3VuZG9BZGRlZENsYXNzZXMoKTtcbiAgICBlbC5feF91bmRvQWRkZWRTdHlsZXMgJiYgZWwuX3hfdW5kb0FkZGVkU3R5bGVzKCk7XG4gIH0pO1xufTtcbmhhbmRsZXIyLmlubGluZSA9IChlbCwgeyB2YWx1ZSwgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0pID0+IHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm47XG4gIGlmICghZWwuX3hfaW5saW5lQmluZGluZ3MpXG4gICAgZWwuX3hfaW5saW5lQmluZGluZ3MgPSB7fTtcbiAgZWwuX3hfaW5saW5lQmluZGluZ3NbdmFsdWVdID0geyBleHByZXNzaW9uLCBleHRyYWN0OiBmYWxzZSB9O1xufTtcbmRpcmVjdGl2ZShcImJpbmRcIiwgaGFuZGxlcjIpO1xuZnVuY3Rpb24gc3RvcmVLZXlGb3JYRm9yKGVsLCBleHByZXNzaW9uKSB7XG4gIGVsLl94X2tleUV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWRhdGEuanNcbmFkZFJvb3RTZWxlY3RvcigoKSA9PiBgWyR7cHJlZml4KFwiZGF0YVwiKX1dYCk7XG5kaXJlY3RpdmUoXCJkYXRhXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBpZiAoc2hvdWxkU2tpcFJlZ2lzdGVyaW5nRGF0YUR1cmluZ0Nsb25lKGVsKSlcbiAgICByZXR1cm47XG4gIGV4cHJlc3Npb24gPSBleHByZXNzaW9uID09PSBcIlwiID8gXCJ7fVwiIDogZXhwcmVzc2lvbjtcbiAgbGV0IG1hZ2ljQ29udGV4dCA9IHt9O1xuICBpbmplY3RNYWdpY3MobWFnaWNDb250ZXh0LCBlbCk7XG4gIGxldCBkYXRhUHJvdmlkZXJDb250ZXh0ID0ge307XG4gIGluamVjdERhdGFQcm92aWRlcnMoZGF0YVByb3ZpZGVyQ29udGV4dCwgbWFnaWNDb250ZXh0KTtcbiAgbGV0IGRhdGEyID0gZXZhbHVhdGUoZWwsIGV4cHJlc3Npb24sIHsgc2NvcGU6IGRhdGFQcm92aWRlckNvbnRleHQgfSk7XG4gIGlmIChkYXRhMiA9PT0gdm9pZCAwIHx8IGRhdGEyID09PSB0cnVlKVxuICAgIGRhdGEyID0ge307XG4gIGluamVjdE1hZ2ljcyhkYXRhMiwgZWwpO1xuICBsZXQgcmVhY3RpdmVEYXRhID0gcmVhY3RpdmUoZGF0YTIpO1xuICBpbml0SW50ZXJjZXB0b3JzKHJlYWN0aXZlRGF0YSk7XG4gIGxldCB1bmRvID0gYWRkU2NvcGVUb05vZGUoZWwsIHJlYWN0aXZlRGF0YSk7XG4gIHJlYWN0aXZlRGF0YVtcImluaXRcIl0gJiYgZXZhbHVhdGUoZWwsIHJlYWN0aXZlRGF0YVtcImluaXRcIl0pO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgcmVhY3RpdmVEYXRhW1wiZGVzdHJveVwiXSAmJiBldmFsdWF0ZShlbCwgcmVhY3RpdmVEYXRhW1wiZGVzdHJveVwiXSk7XG4gICAgdW5kbygpO1xuICB9KTtcbn0pO1xuaW50ZXJjZXB0Q2xvbmUoKGZyb20sIHRvKSA9PiB7XG4gIGlmIChmcm9tLl94X2RhdGFTdGFjaykge1xuICAgIHRvLl94X2RhdGFTdGFjayA9IGZyb20uX3hfZGF0YVN0YWNrO1xuICAgIHRvLnNldEF0dHJpYnV0ZShcImRhdGEtaGFzLWFscGluZS1zdGF0ZVwiLCB0cnVlKTtcbiAgfVxufSk7XG5mdW5jdGlvbiBzaG91bGRTa2lwUmVnaXN0ZXJpbmdEYXRhRHVyaW5nQ2xvbmUoZWwpIHtcbiAgaWYgKCFpc0Nsb25pbmcpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoaXNDbG9uaW5nTGVnYWN5KVxuICAgIHJldHVybiB0cnVlO1xuICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKFwiZGF0YS1oYXMtYWxwaW5lLXN0YXRlXCIpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXNob3cuanNcbmRpcmVjdGl2ZShcInNob3dcIiwgKGVsLCB7IG1vZGlmaWVycywgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MyB9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgaWYgKCFlbC5feF9kb0hpZGUpXG4gICAgZWwuX3hfZG9IaWRlID0gKCkgPT4ge1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoXCJkaXNwbGF5XCIsIFwibm9uZVwiLCBtb2RpZmllcnMuaW5jbHVkZXMoXCJpbXBvcnRhbnRcIikgPyBcImltcG9ydGFudFwiIDogdm9pZCAwKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIGlmICghZWwuX3hfZG9TaG93KVxuICAgIGVsLl94X2RvU2hvdyA9ICgpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGlmIChlbC5zdHlsZS5sZW5ndGggPT09IDEgJiYgZWwuc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImRpc3BsYXlcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIGxldCBoaWRlID0gKCkgPT4ge1xuICAgIGVsLl94X2RvSGlkZSgpO1xuICAgIGVsLl94X2lzU2hvd24gPSBmYWxzZTtcbiAgfTtcbiAgbGV0IHNob3cgPSAoKSA9PiB7XG4gICAgZWwuX3hfZG9TaG93KCk7XG4gICAgZWwuX3hfaXNTaG93biA9IHRydWU7XG4gIH07XG4gIGxldCBjbGlja0F3YXlDb21wYXRpYmxlU2hvdyA9ICgpID0+IHNldFRpbWVvdXQoc2hvdyk7XG4gIGxldCB0b2dnbGUgPSBvbmNlKFxuICAgICh2YWx1ZSkgPT4gdmFsdWUgPyBzaG93KCkgOiBoaWRlKCksXG4gICAgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGVsLl94X3RvZ2dsZUFuZENhc2NhZGVXaXRoVHJhbnNpdGlvbnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBlbC5feF90b2dnbGVBbmRDYXNjYWRlV2l0aFRyYW5zaXRpb25zKGVsLCB2YWx1ZSwgc2hvdywgaGlkZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA/IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCkgOiBoaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICApO1xuICBsZXQgb2xkVmFsdWU7XG4gIGxldCBmaXJzdFRpbWUgPSB0cnVlO1xuICBlZmZlY3QzKCgpID0+IGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICBpZiAoIWZpcnN0VGltZSAmJiB2YWx1ZSA9PT0gb2xkVmFsdWUpXG4gICAgICByZXR1cm47XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImltbWVkaWF0ZVwiKSlcbiAgICAgIHZhbHVlID8gY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKSA6IGhpZGUoKTtcbiAgICB0b2dnbGUodmFsdWUpO1xuICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gIH0pKTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWZvci5qc1xuZGlyZWN0aXZlKFwiZm9yXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGxldCBpdGVyYXRvck5hbWVzID0gcGFyc2VGb3JFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICBsZXQgZXZhbHVhdGVJdGVtcyA9IGV2YWx1YXRlTGF0ZXIoZWwsIGl0ZXJhdG9yTmFtZXMuaXRlbXMpO1xuICBsZXQgZXZhbHVhdGVLZXkgPSBldmFsdWF0ZUxhdGVyKFxuICAgIGVsLFxuICAgIC8vIHRoZSB4LWJpbmQ6a2V5IGV4cHJlc3Npb24gaXMgc3RvcmVkIGZvciBvdXIgdXNlIGluc3RlYWQgb2YgZXZhbHVhdGVkLlxuICAgIGVsLl94X2tleUV4cHJlc3Npb24gfHwgXCJpbmRleFwiXG4gICk7XG4gIGVsLl94X3ByZXZLZXlzID0gW107XG4gIGVsLl94X2xvb2t1cCA9IHt9O1xuICBlZmZlY3QzKCgpID0+IGxvb3AoZWwsIGl0ZXJhdG9yTmFtZXMsIGV2YWx1YXRlSXRlbXMsIGV2YWx1YXRlS2V5KSk7XG4gIGNsZWFudXAyKCgpID0+IHtcbiAgICBPYmplY3QudmFsdWVzKGVsLl94X2xvb2t1cCkuZm9yRWFjaCgoZWwyKSA9PiBtdXRhdGVEb20oXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGRlc3Ryb3lUcmVlKGVsMik7XG4gICAgICAgIGVsMi5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICApKTtcbiAgICBkZWxldGUgZWwuX3hfcHJldktleXM7XG4gICAgZGVsZXRlIGVsLl94X2xvb2t1cDtcbiAgfSk7XG59KTtcbmZ1bmN0aW9uIGxvb3AoZWwsIGl0ZXJhdG9yTmFtZXMsIGV2YWx1YXRlSXRlbXMsIGV2YWx1YXRlS2V5KSB7XG4gIGxldCBpc09iamVjdDIgPSAoaSkgPT4gdHlwZW9mIGkgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkoaSk7XG4gIGxldCB0ZW1wbGF0ZUVsID0gZWw7XG4gIGV2YWx1YXRlSXRlbXMoKGl0ZW1zKSA9PiB7XG4gICAgaWYgKGlzTnVtZXJpYzMoaXRlbXMpICYmIGl0ZW1zID49IDApIHtcbiAgICAgIGl0ZW1zID0gQXJyYXkuZnJvbShBcnJheShpdGVtcykua2V5cygpLCAoaSkgPT4gaSArIDEpO1xuICAgIH1cbiAgICBpZiAoaXRlbXMgPT09IHZvaWQgMClcbiAgICAgIGl0ZW1zID0gW107XG4gICAgbGV0IGxvb2t1cCA9IGVsLl94X2xvb2t1cDtcbiAgICBsZXQgcHJldktleXMgPSBlbC5feF9wcmV2S2V5cztcbiAgICBsZXQgc2NvcGVzID0gW107XG4gICAgbGV0IGtleXMgPSBbXTtcbiAgICBpZiAoaXNPYmplY3QyKGl0ZW1zKSkge1xuICAgICAgaXRlbXMgPSBPYmplY3QuZW50cmllcyhpdGVtcykubWFwKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgbGV0IHNjb3BlMiA9IGdldEl0ZXJhdGlvblNjb3BlVmFyaWFibGVzKGl0ZXJhdG9yTmFtZXMsIHZhbHVlLCBrZXksIGl0ZW1zKTtcbiAgICAgICAgZXZhbHVhdGVLZXkoKHZhbHVlMikgPT4ge1xuICAgICAgICAgIGlmIChrZXlzLmluY2x1ZGVzKHZhbHVlMikpXG4gICAgICAgICAgICB3YXJuKFwiRHVwbGljYXRlIGtleSBvbiB4LWZvclwiLCBlbCk7XG4gICAgICAgICAga2V5cy5wdXNoKHZhbHVlMik7XG4gICAgICAgIH0sIHsgc2NvcGU6IHsgaW5kZXg6IGtleSwgLi4uc2NvcGUyIH0gfSk7XG4gICAgICAgIHNjb3Blcy5wdXNoKHNjb3BlMik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgc2NvcGUyID0gZ2V0SXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMoaXRlcmF0b3JOYW1lcywgaXRlbXNbaV0sIGksIGl0ZW1zKTtcbiAgICAgICAgZXZhbHVhdGVLZXkoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgaWYgKGtleXMuaW5jbHVkZXModmFsdWUpKVxuICAgICAgICAgICAgd2FybihcIkR1cGxpY2F0ZSBrZXkgb24geC1mb3JcIiwgZWwpO1xuICAgICAgICAgIGtleXMucHVzaCh2YWx1ZSk7XG4gICAgICAgIH0sIHsgc2NvcGU6IHsgaW5kZXg6IGksIC4uLnNjb3BlMiB9IH0pO1xuICAgICAgICBzY29wZXMucHVzaChzY29wZTIpO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgYWRkcyA9IFtdO1xuICAgIGxldCBtb3ZlcyA9IFtdO1xuICAgIGxldCByZW1vdmVzID0gW107XG4gICAgbGV0IHNhbWVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2S2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGtleSA9IHByZXZLZXlzW2ldO1xuICAgICAgaWYgKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSlcbiAgICAgICAgcmVtb3Zlcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHByZXZLZXlzID0gcHJldktleXMuZmlsdGVyKChrZXkpID0+ICFyZW1vdmVzLmluY2x1ZGVzKGtleSkpO1xuICAgIGxldCBsYXN0S2V5ID0gXCJ0ZW1wbGF0ZVwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGtleSA9IGtleXNbaV07XG4gICAgICBsZXQgcHJldkluZGV4ID0gcHJldktleXMuaW5kZXhPZihrZXkpO1xuICAgICAgaWYgKHByZXZJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgcHJldktleXMuc3BsaWNlKGksIDAsIGtleSk7XG4gICAgICAgIGFkZHMucHVzaChbbGFzdEtleSwgaV0pO1xuICAgICAgfSBlbHNlIGlmIChwcmV2SW5kZXggIT09IGkpIHtcbiAgICAgICAgbGV0IGtleUluU3BvdCA9IHByZXZLZXlzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgbGV0IGtleUZvclNwb3QgPSBwcmV2S2V5cy5zcGxpY2UocHJldkluZGV4IC0gMSwgMSlbMF07XG4gICAgICAgIHByZXZLZXlzLnNwbGljZShpLCAwLCBrZXlGb3JTcG90KTtcbiAgICAgICAgcHJldktleXMuc3BsaWNlKHByZXZJbmRleCwgMCwga2V5SW5TcG90KTtcbiAgICAgICAgbW92ZXMucHVzaChba2V5SW5TcG90LCBrZXlGb3JTcG90XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYW1lcy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgICBsYXN0S2V5ID0ga2V5O1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSByZW1vdmVzW2ldO1xuICAgICAgaWYgKCEoa2V5IGluIGxvb2t1cCkpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZGVzdHJveVRyZWUobG9va3VwW2tleV0pO1xuICAgICAgICBsb29rdXBba2V5XS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgICAgZGVsZXRlIGxvb2t1cFtrZXldO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgW2tleUluU3BvdCwga2V5Rm9yU3BvdF0gPSBtb3Zlc1tpXTtcbiAgICAgIGxldCBlbEluU3BvdCA9IGxvb2t1cFtrZXlJblNwb3RdO1xuICAgICAgbGV0IGVsRm9yU3BvdCA9IGxvb2t1cFtrZXlGb3JTcG90XTtcbiAgICAgIGxldCBtYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgaWYgKCFlbEZvclNwb3QpXG4gICAgICAgICAgd2FybihgeC1mb3IgXCI6a2V5XCIgaXMgdW5kZWZpbmVkIG9yIGludmFsaWRgLCB0ZW1wbGF0ZUVsLCBrZXlGb3JTcG90LCBsb29rdXApO1xuICAgICAgICBlbEZvclNwb3QuYWZ0ZXIobWFya2VyKTtcbiAgICAgICAgZWxJblNwb3QuYWZ0ZXIoZWxGb3JTcG90KTtcbiAgICAgICAgZWxGb3JTcG90Ll94X2N1cnJlbnRJZkVsICYmIGVsRm9yU3BvdC5hZnRlcihlbEZvclNwb3QuX3hfY3VycmVudElmRWwpO1xuICAgICAgICBtYXJrZXIuYmVmb3JlKGVsSW5TcG90KTtcbiAgICAgICAgZWxJblNwb3QuX3hfY3VycmVudElmRWwgJiYgZWxJblNwb3QuYWZ0ZXIoZWxJblNwb3QuX3hfY3VycmVudElmRWwpO1xuICAgICAgICBtYXJrZXIucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIGVsRm9yU3BvdC5feF9yZWZyZXNoWEZvclNjb3BlKHNjb3Blc1trZXlzLmluZGV4T2Yoa2V5Rm9yU3BvdCldKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgW2xhc3RLZXkyLCBpbmRleF0gPSBhZGRzW2ldO1xuICAgICAgbGV0IGxhc3RFbCA9IGxhc3RLZXkyID09PSBcInRlbXBsYXRlXCIgPyB0ZW1wbGF0ZUVsIDogbG9va3VwW2xhc3RLZXkyXTtcbiAgICAgIGlmIChsYXN0RWwuX3hfY3VycmVudElmRWwpXG4gICAgICAgIGxhc3RFbCA9IGxhc3RFbC5feF9jdXJyZW50SWZFbDtcbiAgICAgIGxldCBzY29wZTIgPSBzY29wZXNbaW5kZXhdO1xuICAgICAgbGV0IGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgbGV0IGNsb25lMiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGVFbC5jb250ZW50LCB0cnVlKS5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgIGxldCByZWFjdGl2ZVNjb3BlID0gcmVhY3RpdmUoc2NvcGUyKTtcbiAgICAgIGFkZFNjb3BlVG9Ob2RlKGNsb25lMiwgcmVhY3RpdmVTY29wZSwgdGVtcGxhdGVFbCk7XG4gICAgICBjbG9uZTIuX3hfcmVmcmVzaFhGb3JTY29wZSA9IChuZXdTY29wZSkgPT4ge1xuICAgICAgICBPYmplY3QuZW50cmllcyhuZXdTY29wZSkuZm9yRWFjaCgoW2tleTIsIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIHJlYWN0aXZlU2NvcGVba2V5Ml0gPSB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgbGFzdEVsLmFmdGVyKGNsb25lMik7XG4gICAgICAgIHNraXBEdXJpbmdDbG9uZSgoKSA9PiBpbml0VHJlZShjbG9uZTIpKSgpO1xuICAgICAgfSk7XG4gICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICB3YXJuKFwieC1mb3Iga2V5IGNhbm5vdCBiZSBhbiBvYmplY3QsIGl0IG11c3QgYmUgYSBzdHJpbmcgb3IgYW4gaW50ZWdlclwiLCB0ZW1wbGF0ZUVsKTtcbiAgICAgIH1cbiAgICAgIGxvb2t1cFtrZXldID0gY2xvbmUyO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsb29rdXBbc2FtZXNbaV1dLl94X3JlZnJlc2hYRm9yU2NvcGUoc2NvcGVzW2tleXMuaW5kZXhPZihzYW1lc1tpXSldKTtcbiAgICB9XG4gICAgdGVtcGxhdGVFbC5feF9wcmV2S2V5cyA9IGtleXM7XG4gIH0pO1xufVxuZnVuY3Rpb24gcGFyc2VGb3JFeHByZXNzaW9uKGV4cHJlc3Npb24pIHtcbiAgbGV0IGZvckl0ZXJhdG9yUkUgPSAvLChbXixcXH1cXF1dKikoPzosKFteLFxcfVxcXV0qKSk/JC87XG4gIGxldCBzdHJpcFBhcmVuc1JFID0gL15cXHMqXFwofFxcKVxccyokL2c7XG4gIGxldCBmb3JBbGlhc1JFID0gLyhbXFxzXFxTXSo/KVxccysoPzppbnxvZilcXHMrKFtcXHNcXFNdKikvO1xuICBsZXQgaW5NYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goZm9yQWxpYXNSRSk7XG4gIGlmICghaW5NYXRjaClcbiAgICByZXR1cm47XG4gIGxldCByZXMgPSB7fTtcbiAgcmVzLml0ZW1zID0gaW5NYXRjaFsyXS50cmltKCk7XG4gIGxldCBpdGVtID0gaW5NYXRjaFsxXS5yZXBsYWNlKHN0cmlwUGFyZW5zUkUsIFwiXCIpLnRyaW0oKTtcbiAgbGV0IGl0ZXJhdG9yTWF0Y2ggPSBpdGVtLm1hdGNoKGZvckl0ZXJhdG9yUkUpO1xuICBpZiAoaXRlcmF0b3JNYXRjaCkge1xuICAgIHJlcy5pdGVtID0gaXRlbS5yZXBsYWNlKGZvckl0ZXJhdG9yUkUsIFwiXCIpLnRyaW0oKTtcbiAgICByZXMuaW5kZXggPSBpdGVyYXRvck1hdGNoWzFdLnRyaW0oKTtcbiAgICBpZiAoaXRlcmF0b3JNYXRjaFsyXSkge1xuICAgICAgcmVzLmNvbGxlY3Rpb24gPSBpdGVyYXRvck1hdGNoWzJdLnRyaW0oKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzLml0ZW0gPSBpdGVtO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5mdW5jdGlvbiBnZXRJdGVyYXRpb25TY29wZVZhcmlhYmxlcyhpdGVyYXRvck5hbWVzLCBpdGVtLCBpbmRleCwgaXRlbXMpIHtcbiAgbGV0IHNjb3BlVmFyaWFibGVzID0ge307XG4gIGlmICgvXlxcWy4qXFxdJC8udGVzdChpdGVyYXRvck5hbWVzLml0ZW0pICYmIEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICBsZXQgbmFtZXMgPSBpdGVyYXRvck5hbWVzLml0ZW0ucmVwbGFjZShcIltcIiwgXCJcIikucmVwbGFjZShcIl1cIiwgXCJcIikuc3BsaXQoXCIsXCIpLm1hcCgoaSkgPT4gaS50cmltKCkpO1xuICAgIG5hbWVzLmZvckVhY2goKG5hbWUsIGkpID0+IHtcbiAgICAgIHNjb3BlVmFyaWFibGVzW25hbWVdID0gaXRlbVtpXTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICgvXlxcey4qXFx9JC8udGVzdChpdGVyYXRvck5hbWVzLml0ZW0pICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgbGV0IG5hbWVzID0gaXRlcmF0b3JOYW1lcy5pdGVtLnJlcGxhY2UoXCJ7XCIsIFwiXCIpLnJlcGxhY2UoXCJ9XCIsIFwiXCIpLnNwbGl0KFwiLFwiKS5tYXAoKGkpID0+IGkudHJpbSgpKTtcbiAgICBuYW1lcy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBzY29wZVZhcmlhYmxlc1tuYW1lXSA9IGl0ZW1bbmFtZV07XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5pdGVtXSA9IGl0ZW07XG4gIH1cbiAgaWYgKGl0ZXJhdG9yTmFtZXMuaW5kZXgpXG4gICAgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5pbmRleF0gPSBpbmRleDtcbiAgaWYgKGl0ZXJhdG9yTmFtZXMuY29sbGVjdGlvbilcbiAgICBzY29wZVZhcmlhYmxlc1tpdGVyYXRvck5hbWVzLmNvbGxlY3Rpb25dID0gaXRlbXM7XG4gIHJldHVybiBzY29wZVZhcmlhYmxlcztcbn1cbmZ1bmN0aW9uIGlzTnVtZXJpYzMoc3ViamVjdCkge1xuICByZXR1cm4gIUFycmF5LmlzQXJyYXkoc3ViamVjdCkgJiYgIWlzTmFOKHN1YmplY3QpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXJlZi5qc1xuZnVuY3Rpb24gaGFuZGxlcjMoKSB7XG59XG5oYW5kbGVyMy5pbmxpbmUgPSAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgbGV0IHJvb3QgPSBjbG9zZXN0Um9vdChlbCk7XG4gIGlmICghcm9vdC5feF9yZWZzKVxuICAgIHJvb3QuX3hfcmVmcyA9IHt9O1xuICByb290Ll94X3JlZnNbZXhwcmVzc2lvbl0gPSBlbDtcbiAgY2xlYW51cDIoKCkgPT4gZGVsZXRlIHJvb3QuX3hfcmVmc1tleHByZXNzaW9uXSk7XG59O1xuZGlyZWN0aXZlKFwicmVmXCIsIGhhbmRsZXIzKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pZi5qc1xuZGlyZWN0aXZlKFwiaWZcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJ0ZW1wbGF0ZVwiKVxuICAgIHdhcm4oXCJ4LWlmIGNhbiBvbmx5IGJlIHVzZWQgb24gYSA8dGVtcGxhdGU+IHRhZ1wiLCBlbCk7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgbGV0IHNob3cgPSAoKSA9PiB7XG4gICAgaWYgKGVsLl94X2N1cnJlbnRJZkVsKVxuICAgICAgcmV0dXJuIGVsLl94X2N1cnJlbnRJZkVsO1xuICAgIGxldCBjbG9uZTIgPSBlbC5jb250ZW50LmNsb25lTm9kZSh0cnVlKS5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICBhZGRTY29wZVRvTm9kZShjbG9uZTIsIHt9LCBlbCk7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGVsLmFmdGVyKGNsb25lMik7XG4gICAgICBza2lwRHVyaW5nQ2xvbmUoKCkgPT4gaW5pdFRyZWUoY2xvbmUyKSkoKTtcbiAgICB9KTtcbiAgICBlbC5feF9jdXJyZW50SWZFbCA9IGNsb25lMjtcbiAgICBlbC5feF91bmRvSWYgPSAoKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBkZXN0cm95VHJlZShjbG9uZTIpO1xuICAgICAgICBjbG9uZTIucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSBlbC5feF9jdXJyZW50SWZFbDtcbiAgICB9O1xuICAgIHJldHVybiBjbG9uZTI7XG4gIH07XG4gIGxldCBoaWRlID0gKCkgPT4ge1xuICAgIGlmICghZWwuX3hfdW5kb0lmKVxuICAgICAgcmV0dXJuO1xuICAgIGVsLl94X3VuZG9JZigpO1xuICAgIGRlbGV0ZSBlbC5feF91bmRvSWY7XG4gIH07XG4gIGVmZmVjdDMoKCkgPT4gZXZhbHVhdGUyKCh2YWx1ZSkgPT4ge1xuICAgIHZhbHVlID8gc2hvdygpIDogaGlkZSgpO1xuICB9KSk7XG4gIGNsZWFudXAyKCgpID0+IGVsLl94X3VuZG9JZiAmJiBlbC5feF91bmRvSWYoKSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pZC5qc1xuZGlyZWN0aXZlKFwiaWRcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBldmFsdWF0ZTogZXZhbHVhdGUyIH0pID0+IHtcbiAgbGV0IG5hbWVzID0gZXZhbHVhdGUyKGV4cHJlc3Npb24pO1xuICBuYW1lcy5mb3JFYWNoKChuYW1lKSA9PiBzZXRJZFJvb3QoZWwsIG5hbWUpKTtcbn0pO1xuaW50ZXJjZXB0Q2xvbmUoKGZyb20sIHRvKSA9PiB7XG4gIGlmIChmcm9tLl94X2lkcykge1xuICAgIHRvLl94X2lkcyA9IGZyb20uX3hfaWRzO1xuICB9XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1vbi5qc1xubWFwQXR0cmlidXRlcyhzdGFydGluZ1dpdGgoXCJAXCIsIGludG8ocHJlZml4KFwib246XCIpKSkpO1xuZGlyZWN0aXZlKFwib25cIiwgc2tpcER1cmluZ0Nsb25lKChlbCwgeyB2YWx1ZSwgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0sIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXhwcmVzc2lvbiA/IGV2YWx1YXRlTGF0ZXIoZWwsIGV4cHJlc3Npb24pIDogKCkgPT4ge1xuICB9O1xuICBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInRlbXBsYXRlXCIpIHtcbiAgICBpZiAoIWVsLl94X2ZvcndhcmRFdmVudHMpXG4gICAgICBlbC5feF9mb3J3YXJkRXZlbnRzID0gW107XG4gICAgaWYgKCFlbC5feF9mb3J3YXJkRXZlbnRzLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgIGVsLl94X2ZvcndhcmRFdmVudHMucHVzaCh2YWx1ZSk7XG4gIH1cbiAgbGV0IHJlbW92ZUxpc3RlbmVyID0gb24oZWwsIHZhbHVlLCBtb2RpZmllcnMsIChlKSA9PiB7XG4gICAgZXZhbHVhdGUyKCgpID0+IHtcbiAgICB9LCB7IHNjb3BlOiB7IFwiJGV2ZW50XCI6IGUgfSwgcGFyYW1zOiBbZV0gfSk7XG4gIH0pO1xuICBjbGVhbnVwMigoKSA9PiByZW1vdmVMaXN0ZW5lcigpKTtcbn0pKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMvaW5kZXguanNcbndhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKFwiQ29sbGFwc2VcIiwgXCJjb2xsYXBzZVwiLCBcImNvbGxhcHNlXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJJbnRlcnNlY3RcIiwgXCJpbnRlcnNlY3RcIiwgXCJpbnRlcnNlY3RcIik7XG53YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShcIkZvY3VzXCIsIFwidHJhcFwiLCBcImZvY3VzXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJNYXNrXCIsIFwibWFza1wiLCBcIm1hc2tcIik7XG5mdW5jdGlvbiB3YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShuYW1lLCBkaXJlY3RpdmVOYW1lLCBzbHVnKSB7XG4gIGRpcmVjdGl2ZShkaXJlY3RpdmVOYW1lLCAoZWwpID0+IHdhcm4oYFlvdSBjYW4ndCB1c2UgW3gtJHtkaXJlY3RpdmVOYW1lfV0gd2l0aG91dCBmaXJzdCBpbnN0YWxsaW5nIHRoZSBcIiR7bmFtZX1cIiBwbHVnaW4gaGVyZTogaHR0cHM6Ly9hbHBpbmVqcy5kZXYvcGx1Z2lucy8ke3NsdWd9YCwgZWwpKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2luZGV4LmpzXG5hbHBpbmVfZGVmYXVsdC5zZXRFdmFsdWF0b3Iobm9ybWFsRXZhbHVhdG9yKTtcbmFscGluZV9kZWZhdWx0LnNldFJlYWN0aXZpdHlFbmdpbmUoeyByZWFjdGl2ZTogcmVhY3RpdmUyLCBlZmZlY3Q6IGVmZmVjdDIsIHJlbGVhc2U6IHN0b3AsIHJhdzogdG9SYXcgfSk7XG52YXIgc3JjX2RlZmF1bHQgPSBhbHBpbmVfZGVmYXVsdDtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvYnVpbGRzL21vZHVsZS5qc1xudmFyIG1vZHVsZV9kZWZhdWx0ID0gc3JjX2RlZmF1bHQ7XG5leHBvcnQge1xuICBzcmNfZGVmYXVsdCBhcyBBbHBpbmUsXG4gIG1vZHVsZV9kZWZhdWx0IGFzIGRlZmF1bHRcbn07XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18gZnJvbSBcIi0hLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi90aGVtZXMuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8xX19fIGZyb20gXCItIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vZm9udHMuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8yX19fIGZyb20gXCItIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGV4dHMuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8zX19fIGZyb20gXCItIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5wdXRzLmNzc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzFfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzJfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzNfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqLCA6OmJlZm9yZSwgOjphZnRlciB7XG4gIC0tdHctYm9yZGVyLXNwYWNpbmcteDogMDtcbiAgLS10dy1ib3JkZXItc3BhY2luZy15OiAwO1xuICAtLXR3LXRyYW5zbGF0ZS14OiAwO1xuICAtLXR3LXRyYW5zbGF0ZS15OiAwO1xuICAtLXR3LXJvdGF0ZTogMDtcbiAgLS10dy1za2V3LXg6IDA7XG4gIC0tdHctc2tldy15OiAwO1xuICAtLXR3LXNjYWxlLXg6IDE7XG4gIC0tdHctc2NhbGUteTogMTtcbiAgLS10dy1wYW4teDogIDtcbiAgLS10dy1wYW4teTogIDtcbiAgLS10dy1waW5jaC16b29tOiAgO1xuICAtLXR3LXNjcm9sbC1zbmFwLXN0cmljdG5lc3M6IHByb3hpbWl0eTtcbiAgLS10dy1ncmFkaWVudC1mcm9tLXBvc2l0aW9uOiAgO1xuICAtLXR3LWdyYWRpZW50LXZpYS1wb3NpdGlvbjogIDtcbiAgLS10dy1ncmFkaWVudC10by1wb3NpdGlvbjogIDtcbiAgLS10dy1vcmRpbmFsOiAgO1xuICAtLXR3LXNsYXNoZWQtemVybzogIDtcbiAgLS10dy1udW1lcmljLWZpZ3VyZTogIDtcbiAgLS10dy1udW1lcmljLXNwYWNpbmc6ICA7XG4gIC0tdHctbnVtZXJpYy1mcmFjdGlvbjogIDtcbiAgLS10dy1yaW5nLWluc2V0OiAgO1xuICAtLXR3LXJpbmctb2Zmc2V0LXdpZHRoOiAwcHg7XG4gIC0tdHctcmluZy1vZmZzZXQtY29sb3I6ICNmZmY7XG4gIC0tdHctcmluZy1jb2xvcjogcmdiKDU5IDEzMCAyNDYgLyAwLjUpO1xuICAtLXR3LXJpbmctb2Zmc2V0LXNoYWRvdzogMCAwICMwMDAwO1xuICAtLXR3LXJpbmctc2hhZG93OiAwIDAgIzAwMDA7XG4gIC0tdHctc2hhZG93OiAwIDAgIzAwMDA7XG4gIC0tdHctc2hhZG93LWNvbG9yZWQ6IDAgMCAjMDAwMDtcbiAgLS10dy1ibHVyOiAgO1xuICAtLXR3LWJyaWdodG5lc3M6ICA7XG4gIC0tdHctY29udHJhc3Q6ICA7XG4gIC0tdHctZ3JheXNjYWxlOiAgO1xuICAtLXR3LWh1ZS1yb3RhdGU6ICA7XG4gIC0tdHctaW52ZXJ0OiAgO1xuICAtLXR3LXNhdHVyYXRlOiAgO1xuICAtLXR3LXNlcGlhOiAgO1xuICAtLXR3LWRyb3Atc2hhZG93OiAgO1xuICAtLXR3LWJhY2tkcm9wLWJsdXI6ICA7XG4gIC0tdHctYmFja2Ryb3AtYnJpZ2h0bmVzczogIDtcbiAgLS10dy1iYWNrZHJvcC1jb250cmFzdDogIDtcbiAgLS10dy1iYWNrZHJvcC1ncmF5c2NhbGU6ICA7XG4gIC0tdHctYmFja2Ryb3AtaHVlLXJvdGF0ZTogIDtcbiAgLS10dy1iYWNrZHJvcC1pbnZlcnQ6ICA7XG4gIC0tdHctYmFja2Ryb3Atb3BhY2l0eTogIDtcbiAgLS10dy1iYWNrZHJvcC1zYXR1cmF0ZTogIDtcbiAgLS10dy1iYWNrZHJvcC1zZXBpYTogIDtcbiAgLS10dy1jb250YWluLXNpemU6ICA7XG4gIC0tdHctY29udGFpbi1sYXlvdXQ6ICA7XG4gIC0tdHctY29udGFpbi1wYWludDogIDtcbiAgLS10dy1jb250YWluLXN0eWxlOiAgO1xufVxuXG46OmJhY2tkcm9wIHtcbiAgLS10dy1ib3JkZXItc3BhY2luZy14OiAwO1xuICAtLXR3LWJvcmRlci1zcGFjaW5nLXk6IDA7XG4gIC0tdHctdHJhbnNsYXRlLXg6IDA7XG4gIC0tdHctdHJhbnNsYXRlLXk6IDA7XG4gIC0tdHctcm90YXRlOiAwO1xuICAtLXR3LXNrZXcteDogMDtcbiAgLS10dy1za2V3LXk6IDA7XG4gIC0tdHctc2NhbGUteDogMTtcbiAgLS10dy1zY2FsZS15OiAxO1xuICAtLXR3LXBhbi14OiAgO1xuICAtLXR3LXBhbi15OiAgO1xuICAtLXR3LXBpbmNoLXpvb206ICA7XG4gIC0tdHctc2Nyb2xsLXNuYXAtc3RyaWN0bmVzczogcHJveGltaXR5O1xuICAtLXR3LWdyYWRpZW50LWZyb20tcG9zaXRpb246ICA7XG4gIC0tdHctZ3JhZGllbnQtdmlhLXBvc2l0aW9uOiAgO1xuICAtLXR3LWdyYWRpZW50LXRvLXBvc2l0aW9uOiAgO1xuICAtLXR3LW9yZGluYWw6ICA7XG4gIC0tdHctc2xhc2hlZC16ZXJvOiAgO1xuICAtLXR3LW51bWVyaWMtZmlndXJlOiAgO1xuICAtLXR3LW51bWVyaWMtc3BhY2luZzogIDtcbiAgLS10dy1udW1lcmljLWZyYWN0aW9uOiAgO1xuICAtLXR3LXJpbmctaW5zZXQ6ICA7XG4gIC0tdHctcmluZy1vZmZzZXQtd2lkdGg6IDBweDtcbiAgLS10dy1yaW5nLW9mZnNldC1jb2xvcjogI2ZmZjtcbiAgLS10dy1yaW5nLWNvbG9yOiByZ2IoNTkgMTMwIDI0NiAvIDAuNSk7XG4gIC0tdHctcmluZy1vZmZzZXQtc2hhZG93OiAwIDAgIzAwMDA7XG4gIC0tdHctcmluZy1zaGFkb3c6IDAgMCAjMDAwMDtcbiAgLS10dy1zaGFkb3c6IDAgMCAjMDAwMDtcbiAgLS10dy1zaGFkb3ctY29sb3JlZDogMCAwICMwMDAwO1xuICAtLXR3LWJsdXI6ICA7XG4gIC0tdHctYnJpZ2h0bmVzczogIDtcbiAgLS10dy1jb250cmFzdDogIDtcbiAgLS10dy1ncmF5c2NhbGU6ICA7XG4gIC0tdHctaHVlLXJvdGF0ZTogIDtcbiAgLS10dy1pbnZlcnQ6ICA7XG4gIC0tdHctc2F0dXJhdGU6ICA7XG4gIC0tdHctc2VwaWE6ICA7XG4gIC0tdHctZHJvcC1zaGFkb3c6ICA7XG4gIC0tdHctYmFja2Ryb3AtYmx1cjogIDtcbiAgLS10dy1iYWNrZHJvcC1icmlnaHRuZXNzOiAgO1xuICAtLXR3LWJhY2tkcm9wLWNvbnRyYXN0OiAgO1xuICAtLXR3LWJhY2tkcm9wLWdyYXlzY2FsZTogIDtcbiAgLS10dy1iYWNrZHJvcC1odWUtcm90YXRlOiAgO1xuICAtLXR3LWJhY2tkcm9wLWludmVydDogIDtcbiAgLS10dy1iYWNrZHJvcC1vcGFjaXR5OiAgO1xuICAtLXR3LWJhY2tkcm9wLXNhdHVyYXRlOiAgO1xuICAtLXR3LWJhY2tkcm9wLXNlcGlhOiAgO1xuICAtLXR3LWNvbnRhaW4tc2l6ZTogIDtcbiAgLS10dy1jb250YWluLWxheW91dDogIDtcbiAgLS10dy1jb250YWluLXBhaW50OiAgO1xuICAtLXR3LWNvbnRhaW4tc3R5bGU6ICA7XG59LypcbiEgdGFpbHdpbmRjc3MgdjMuNC4xNyB8IE1JVCBMaWNlbnNlIHwgaHR0cHM6Ly90YWlsd2luZGNzcy5jb21cbiovLypcbjEuIFByZXZlbnQgcGFkZGluZyBhbmQgYm9yZGVyIGZyb20gYWZmZWN0aW5nIGVsZW1lbnQgd2lkdGguIChodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzQpXG4yLiBBbGxvdyBhZGRpbmcgYSBib3JkZXIgdG8gYW4gZWxlbWVudCBieSBqdXN0IGFkZGluZyBhIGJvcmRlci13aWR0aC4gKGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGNzcy90YWlsd2luZGNzcy9wdWxsLzExNilcbiovXG5cbiosXG46OmJlZm9yZSxcbjo6YWZ0ZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIGJvcmRlci13aWR0aDogMDsgLyogMiAqL1xuICBib3JkZXItc3R5bGU6IHNvbGlkOyAvKiAyICovXG4gIGJvcmRlci1jb2xvcjogI2U1ZTdlYjsgLyogMiAqL1xufVxuXG46OmJlZm9yZSxcbjo6YWZ0ZXIge1xuICAtLXR3LWNvbnRlbnQ6ICcnO1xufVxuXG4vKlxuMS4gVXNlIGEgY29uc2lzdGVudCBzZW5zaWJsZSBsaW5lLWhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4yLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cbjMuIFVzZSBhIG1vcmUgcmVhZGFibGUgdGFiIHNpemUuXG40LiBVc2UgdGhlIHVzZXIncyBjb25maWd1cmVkIFxcYHNhbnNcXGAgZm9udC1mYW1pbHkgYnkgZGVmYXVsdC5cbjUuIFVzZSB0aGUgdXNlcidzIGNvbmZpZ3VyZWQgXFxgc2Fuc1xcYCBmb250LWZlYXR1cmUtc2V0dGluZ3MgYnkgZGVmYXVsdC5cbjYuIFVzZSB0aGUgdXNlcidzIGNvbmZpZ3VyZWQgXFxgc2Fuc1xcYCBmb250LXZhcmlhdGlvbi1zZXR0aW5ncyBieSBkZWZhdWx0LlxuNy4gRGlzYWJsZSB0YXAgaGlnaGxpZ2h0cyBvbiBpT1NcbiovXG5cbmh0bWwsXG46aG9zdCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjU7IC8qIDEgKi9cbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXG4gIC1tb3otdGFiLXNpemU6IDQ7IC8qIDMgKi9cbiAgLW8tdGFiLXNpemU6IDQ7XG4gICAgIHRhYi1zaXplOiA0OyAvKiAzICovXG4gIGZvbnQtZmFtaWx5OiB1aS1zYW5zLXNlcmlmLCBzeXN0ZW0tdWksIHNhbnMtc2VyaWYsIFwiQXBwbGUgQ29sb3IgRW1vamlcIiwgXCJTZWdvZSBVSSBFbW9qaVwiLCBcIlNlZ29lIFVJIFN5bWJvbFwiLCBcIk5vdG8gQ29sb3IgRW1vamlcIjsgLyogNCAqL1xuICBmb250LWZlYXR1cmUtc2V0dGluZ3M6IG5vcm1hbDsgLyogNSAqL1xuICBmb250LXZhcmlhdGlvbi1zZXR0aW5nczogbm9ybWFsOyAvKiA2ICovXG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogdHJhbnNwYXJlbnQ7IC8qIDcgKi9cbn1cblxuLypcbjEuIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cbjIuIEluaGVyaXQgbGluZS1oZWlnaHQgZnJvbSBcXGBodG1sXFxgIHNvIHVzZXJzIGNhbiBzZXQgdGhlbSBhcyBhIGNsYXNzIGRpcmVjdGx5IG9uIHRoZSBcXGBodG1sXFxgIGVsZW1lbnQuXG4qL1xuXG5ib2R5IHtcbiAgbWFyZ2luOiAwOyAvKiAxICovXG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0OyAvKiAyICovXG59XG5cbi8qXG4xLiBBZGQgdGhlIGNvcnJlY3QgaGVpZ2h0IGluIEZpcmVmb3guXG4yLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBvZiBib3JkZXIgY29sb3IgaW4gRmlyZWZveC4gKGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTE5MDY1NSlcbjMuIEVuc3VyZSBob3Jpem9udGFsIHJ1bGVzIGFyZSB2aXNpYmxlIGJ5IGRlZmF1bHQuXG4qL1xuXG5ociB7XG4gIGhlaWdodDogMDsgLyogMSAqL1xuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuICBib3JkZXItdG9wLXdpZHRoOiAxcHg7IC8qIDMgKi9cbn1cblxuLypcbkFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxuKi9cblxuYWJicjp3aGVyZShbdGl0bGVdKSB7XG4gIC13ZWJraXQtdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkO1xuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcbn1cblxuLypcblJlbW92ZSB0aGUgZGVmYXVsdCBmb250IHNpemUgYW5kIHdlaWdodCBmb3IgaGVhZGluZ3MuXG4qL1xuXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYge1xuICBmb250LXNpemU6IGluaGVyaXQ7XG4gIGZvbnQtd2VpZ2h0OiBpbmhlcml0O1xufVxuXG4vKlxuUmVzZXQgbGlua3MgdG8gb3B0aW1pemUgZm9yIG9wdC1pbiBzdHlsaW5nIGluc3RlYWQgb2Ygb3B0LW91dC5cbiovXG5cbmEge1xuICBjb2xvcjogaW5oZXJpdDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBpbmhlcml0O1xufVxuXG4vKlxuQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIEVkZ2UgYW5kIFNhZmFyaS5cbiovXG5cbmIsXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogYm9sZGVyO1xufVxuXG4vKlxuMS4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBcXGBtb25vXFxgIGZvbnQtZmFtaWx5IGJ5IGRlZmF1bHQuXG4yLiBVc2UgdGhlIHVzZXIncyBjb25maWd1cmVkIFxcYG1vbm9cXGAgZm9udC1mZWF0dXJlLXNldHRpbmdzIGJ5IGRlZmF1bHQuXG4zLiBVc2UgdGhlIHVzZXIncyBjb25maWd1cmVkIFxcYG1vbm9cXGAgZm9udC12YXJpYXRpb24tc2V0dGluZ3MgYnkgZGVmYXVsdC5cbjQuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4qL1xuXG5jb2RlLFxua2JkLFxuc2FtcCxcbnByZSB7XG4gIGZvbnQtZmFtaWx5OiB1aS1tb25vc3BhY2UsIFNGTW9uby1SZWd1bGFyLCBNZW5sbywgTW9uYWNvLCBDb25zb2xhcywgXCJMaWJlcmF0aW9uIE1vbm9cIiwgXCJDb3VyaWVyIE5ld1wiLCBtb25vc3BhY2U7IC8qIDEgKi9cbiAgZm9udC1mZWF0dXJlLXNldHRpbmdzOiBub3JtYWw7IC8qIDIgKi9cbiAgZm9udC12YXJpYXRpb24tc2V0dGluZ3M6IG5vcm1hbDsgLyogMyAqL1xuICBmb250LXNpemU6IDFlbTsgLyogNCAqL1xufVxuXG4vKlxuQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4qL1xuXG5zbWFsbCB7XG4gIGZvbnQtc2l6ZTogODAlO1xufVxuXG4vKlxuUHJldmVudCBcXGBzdWJcXGAgYW5kIFxcYHN1cFxcYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuKi9cblxuc3ViLFxuc3VwIHtcbiAgZm9udC1zaXplOiA3NSU7XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcbiAgYm90dG9tOiAtMC4yNWVtO1xufVxuXG5zdXAge1xuICB0b3A6IC0wLjVlbTtcbn1cblxuLypcbjEuIFJlbW92ZSB0ZXh0IGluZGVudGF0aW9uIGZyb20gdGFibGUgY29udGVudHMgaW4gQ2hyb21lIGFuZCBTYWZhcmkuIChodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD05OTkwODgsIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0yMDEyOTcpXG4yLiBDb3JyZWN0IHRhYmxlIGJvcmRlciBjb2xvciBpbmhlcml0YW5jZSBpbiBhbGwgQ2hyb21lIGFuZCBTYWZhcmkuIChodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD05MzU3MjksIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xOTUwMTYpXG4zLiBSZW1vdmUgZ2FwcyBiZXR3ZWVuIHRhYmxlIGJvcmRlcnMgYnkgZGVmYXVsdC5cbiovXG5cbnRhYmxlIHtcbiAgdGV4dC1pbmRlbnQ6IDA7IC8qIDEgKi9cbiAgYm9yZGVyLWNvbG9yOiBpbmhlcml0OyAvKiAyICovXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7IC8qIDMgKi9cbn1cblxuLypcbjEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxuMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxuMy4gUmVtb3ZlIGRlZmF1bHQgcGFkZGluZyBpbiBhbGwgYnJvd3NlcnMuXG4qL1xuXG5idXR0b24sXG5pbnB1dCxcbm9wdGdyb3VwLFxuc2VsZWN0LFxudGV4dGFyZWEge1xuICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xuICBmb250LWZlYXR1cmUtc2V0dGluZ3M6IGluaGVyaXQ7IC8qIDEgKi9cbiAgZm9udC12YXJpYXRpb24tc2V0dGluZ3M6IGluaGVyaXQ7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXG4gIGZvbnQtd2VpZ2h0OiBpbmhlcml0OyAvKiAxICovXG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0OyAvKiAxICovXG4gIGxldHRlci1zcGFjaW5nOiBpbmhlcml0OyAvKiAxICovXG4gIGNvbG9yOiBpbmhlcml0OyAvKiAxICovXG4gIG1hcmdpbjogMDsgLyogMiAqL1xuICBwYWRkaW5nOiAwOyAvKiAzICovXG59XG5cbi8qXG5SZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UgYW5kIEZpcmVmb3guXG4qL1xuXG5idXR0b24sXG5zZWxlY3Qge1xuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbn1cblxuLypcbjEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4yLiBSZW1vdmUgZGVmYXVsdCBidXR0b24gc3R5bGVzLlxuKi9cblxuYnV0dG9uLFxuaW5wdXQ6d2hlcmUoW3R5cGU9J2J1dHRvbiddKSxcbmlucHV0OndoZXJlKFt0eXBlPSdyZXNldCddKSxcbmlucHV0OndoZXJlKFt0eXBlPSdzdWJtaXQnXSkge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsgLyogMiAqL1xuICBiYWNrZ3JvdW5kLWltYWdlOiBub25lOyAvKiAyICovXG59XG5cbi8qXG5Vc2UgdGhlIG1vZGVybiBGaXJlZm94IGZvY3VzIHN0eWxlIGZvciBhbGwgZm9jdXNhYmxlIGVsZW1lbnRzLlxuKi9cblxuOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogYXV0bztcbn1cblxuLypcblJlbW92ZSB0aGUgYWRkaXRpb25hbCBcXGA6aW52YWxpZFxcYCBzdHlsZXMgaW4gRmlyZWZveC4gKGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL2dlY2tvLWRldi9ibG9iLzJmOWVhY2Q5ZDNkOTk1YzkzN2I0MjUxYTU1NTdkOTVkNDk0YzliZTEvbGF5b3V0L3N0eWxlL3Jlcy9mb3Jtcy5jc3MjTDcyOC1MNzM3KVxuKi9cblxuOi1tb3otdWktaW52YWxpZCB7XG4gIGJveC1zaGFkb3c6IG5vbmU7XG59XG5cbi8qXG5BZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSBhbmQgRmlyZWZveC5cbiovXG5cbnByb2dyZXNzIHtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG4vKlxuQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gU2FmYXJpLlxuKi9cblxuOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbiAgaGVpZ2h0OiBhdXRvO1xufVxuXG4vKlxuMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4yLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiovXG5cblt0eXBlPSdzZWFyY2gnXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qXG5SZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXG4qL1xuXG46Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbi8qXG4xLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBcXGBpbmhlcml0XFxgIGluIFNhZmFyaS5cbiovXG5cbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xuICBmb250OiBpbmhlcml0OyAvKiAyICovXG59XG5cbi8qXG5BZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiovXG5cbnN1bW1hcnkge1xuICBkaXNwbGF5OiBsaXN0LWl0ZW07XG59XG5cbi8qXG5SZW1vdmVzIHRoZSBkZWZhdWx0IHNwYWNpbmcgYW5kIGJvcmRlciBmb3IgYXBwcm9wcmlhdGUgZWxlbWVudHMuXG4qL1xuXG5ibG9ja3F1b3RlLFxuZGwsXG5kZCxcbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNixcbmhyLFxuZmlndXJlLFxucCxcbnByZSB7XG4gIG1hcmdpbjogMDtcbn1cblxuZmllbGRzZXQge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbmxlZ2VuZCB7XG4gIHBhZGRpbmc6IDA7XG59XG5cbm9sLFxudWwsXG5tZW51IHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xufVxuXG4vKlxuUmVzZXQgZGVmYXVsdCBzdHlsaW5nIGZvciBkaWFsb2dzLlxuKi9cbmRpYWxvZyB7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qXG5QcmV2ZW50IHJlc2l6aW5nIHRleHRhcmVhcyBob3Jpem9udGFsbHkgYnkgZGVmYXVsdC5cbiovXG5cbnRleHRhcmVhIHtcbiAgcmVzaXplOiB2ZXJ0aWNhbDtcbn1cblxuLypcbjEuIFJlc2V0IHRoZSBkZWZhdWx0IHBsYWNlaG9sZGVyIG9wYWNpdHkgaW4gRmlyZWZveC4gKGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGxhYnMvdGFpbHdpbmRjc3MvaXNzdWVzLzMzMDApXG4yLiBTZXQgdGhlIGRlZmF1bHQgcGxhY2Vob2xkZXIgY29sb3IgdG8gdGhlIHVzZXIncyBjb25maWd1cmVkIGdyYXkgNDAwIGNvbG9yLlxuKi9cblxuaW5wdXQ6Oi1tb3otcGxhY2Vob2xkZXIsIHRleHRhcmVhOjotbW96LXBsYWNlaG9sZGVyIHtcbiAgb3BhY2l0eTogMTsgLyogMSAqL1xuICBjb2xvcjogIzljYTNhZjsgLyogMiAqL1xufVxuXG5pbnB1dDo6cGxhY2Vob2xkZXIsXG50ZXh0YXJlYTo6cGxhY2Vob2xkZXIge1xuICBvcGFjaXR5OiAxOyAvKiAxICovXG4gIGNvbG9yOiAjOWNhM2FmOyAvKiAyICovXG59XG5cbi8qXG5TZXQgdGhlIGRlZmF1bHQgY3Vyc29yIGZvciBidXR0b25zLlxuKi9cblxuYnV0dG9uLFxuW3JvbGU9XCJidXR0b25cIl0ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi8qXG5NYWtlIHN1cmUgZGlzYWJsZWQgYnV0dG9ucyBkb24ndCBnZXQgdGhlIHBvaW50ZXIgY3Vyc29yLlxuKi9cbjpkaXNhYmxlZCB7XG4gIGN1cnNvcjogZGVmYXVsdDtcbn1cblxuLypcbjEuIE1ha2UgcmVwbGFjZWQgZWxlbWVudHMgXFxgZGlzcGxheTogYmxvY2tcXGAgYnkgZGVmYXVsdC4gKGh0dHBzOi8vZ2l0aHViLmNvbS9tb3pkZXZzL2Nzc3JlbWVkeS9pc3N1ZXMvMTQpXG4yLiBBZGQgXFxgdmVydGljYWwtYWxpZ246IG1pZGRsZVxcYCB0byBhbGlnbiByZXBsYWNlZCBlbGVtZW50cyBtb3JlIHNlbnNpYmx5IGJ5IGRlZmF1bHQuIChodHRwczovL2dpdGh1Yi5jb20vamVuc2ltbW9ucy9jc3NyZW1lZHkvaXNzdWVzLzE0I2lzc3VlY29tbWVudC02MzQ5MzQyMTApXG4gICBUaGlzIGNhbiB0cmlnZ2VyIGEgcG9vcmx5IGNvbnNpZGVyZWQgbGludCBlcnJvciBpbiBzb21lIHRvb2xzIGJ1dCBpcyBpbmNsdWRlZCBieSBkZXNpZ24uXG4qL1xuXG5pbWcsXG5zdmcsXG52aWRlbyxcbmNhbnZhcyxcbmF1ZGlvLFxuaWZyYW1lLFxuZW1iZWQsXG5vYmplY3Qge1xuICBkaXNwbGF5OiBibG9jazsgLyogMSAqL1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyAvKiAyICovXG59XG5cbi8qXG5Db25zdHJhaW4gaW1hZ2VzIGFuZCB2aWRlb3MgdG8gdGhlIHBhcmVudCB3aWR0aCBhbmQgcHJlc2VydmUgdGhlaXIgaW50cmluc2ljIGFzcGVjdCByYXRpby4gKGh0dHBzOi8vZ2l0aHViLmNvbS9tb3pkZXZzL2Nzc3JlbWVkeS9pc3N1ZXMvMTQpXG4qL1xuXG5pbWcsXG52aWRlbyB7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiBhdXRvO1xufVxuXG4vKiBNYWtlIGVsZW1lbnRzIHdpdGggdGhlIEhUTUwgaGlkZGVuIGF0dHJpYnV0ZSBzdGF5IGhpZGRlbiBieSBkZWZhdWx0ICovXG5baGlkZGVuXTp3aGVyZSg6bm90KFtoaWRkZW49XCJ1bnRpbC1mb3VuZFwiXSkpIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbi5zdGF0aWMge1xuICBwb3NpdGlvbjogc3RhdGljO1xufVxuLmZpeGVkIHtcbiAgcG9zaXRpb246IGZpeGVkO1xufVxuLnotNTAge1xuICB6LWluZGV4OiA1MDtcbn1cbi5mbGV4IHtcbiAgZGlzcGxheTogZmxleDtcbn1cbi50YWJsZSB7XG4gIGRpc3BsYXk6IHRhYmxlO1xufVxuLmgtXFxcXFsxMjhweFxcXFxdIHtcbiAgaGVpZ2h0OiAxMjhweDtcbn1cbi5oLVxcXFxbMjRweFxcXFxdIHtcbiAgaGVpZ2h0OiAyNHB4O1xufVxuLmgtXFxcXFsyNTZweFxcXFxdIHtcbiAgaGVpZ2h0OiAyNTZweDtcbn1cbi5oLVxcXFxbMnB4XFxcXF0ge1xuICBoZWlnaHQ6IDJweDtcbn1cbi5oLVxcXFxbMzJweFxcXFxdIHtcbiAgaGVpZ2h0OiAzMnB4O1xufVxuLmgtXFxcXFszNnB4XFxcXF0ge1xuICBoZWlnaHQ6IDM2cHg7XG59XG4uaC1cXFxcWzY0cHhcXFxcXSB7XG4gIGhlaWdodDogNjRweDtcbn1cbi5oLVxcXFxbY2FsY1xcXFwoMTAwXFxcXCUtMjU2cHhcXFxcKVxcXFxdIHtcbiAgaGVpZ2h0OiBjYWxjKDEwMCUgLSAyNTZweCk7XG59XG4uaC1mdWxsIHtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuLmgtc2NyZWVuIHtcbiAgaGVpZ2h0OiAxMDB2aDtcbn1cbi5tYXgtaC1cXFxcW2NhbGNcXFxcKDEwMFxcXFwlLTMycHhcXFxcKVxcXFxdIHtcbiAgbWF4LWhlaWdodDogY2FsYygxMDAlIC0gMzJweCk7XG59XG4ubWluLWgtXFxcXFsxMjhweFxcXFxdIHtcbiAgbWluLWhlaWdodDogMTI4cHg7XG59XG4udy0xXFxcXC80IHtcbiAgd2lkdGg6IDI1JTtcbn1cbi53LTNcXFxcLzQge1xuICB3aWR0aDogNzUlO1xufVxuLnctXFxcXFsxMjhweFxcXFxdIHtcbiAgd2lkdGg6IDEyOHB4O1xufVxuLnctXFxcXFsxOTJweFxcXFxdIHtcbiAgd2lkdGg6IDE5MnB4O1xufVxuLnctXFxcXFsyNTZweFxcXFxdIHtcbiAgd2lkdGg6IDI1NnB4O1xufVxuLnctXFxcXFszMjBweFxcXFxdIHtcbiAgd2lkdGg6IDMyMHB4O1xufVxuLnctXFxcXFszMnB4XFxcXF0ge1xuICB3aWR0aDogMzJweDtcbn1cbi53LVxcXFxbNHB4XFxcXF0ge1xuICB3aWR0aDogNHB4O1xufVxuLnctXFxcXFs1MTJweFxcXFxdIHtcbiAgd2lkdGg6IDUxMnB4O1xufVxuLnctXFxcXFs2NHB4XFxcXF0ge1xuICB3aWR0aDogNjRweDtcbn1cbi53LVxcXFxbOHB4XFxcXF0ge1xuICB3aWR0aDogOHB4O1xufVxuLnctXFxcXFtjYWxjXFxcXCgxMDBcXFxcJS0xOTJweFxcXFwpXFxcXF0ge1xuICB3aWR0aDogY2FsYygxMDAlIC0gMTkycHgpO1xufVxuLnctXFxcXFtjYWxjXFxcXCgxMDBcXFxcJS0yNTZweFxcXFwpXFxcXF0ge1xuICB3aWR0aDogY2FsYygxMDAlIC0gMjU2cHgpO1xufVxuLnctZnVsbCB7XG4gIHdpZHRoOiAxMDAlO1xufVxuLm1pbi13LVxcXFxbMTI4cHhcXFxcXSB7XG4gIG1pbi13aWR0aDogMTI4cHg7XG59XG4ubWF4LXctXFxcXFsyNTZweFxcXFxdIHtcbiAgbWF4LXdpZHRoOiAyNTZweDtcbn1cbi5tYXgtdy1cXFxcW2NhbGNcXFxcKDEwMFxcXFwlLTEyODBweFxcXFwpXFxcXF0ge1xuICBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDEyODBweCk7XG59XG4uZmxleC1ub25lIHtcbiAgZmxleDogbm9uZTtcbn1cbi5mbGV4LWdyb3cge1xuICBmbGV4LWdyb3c6IDE7XG59XG4uZ3JvdyB7XG4gIGZsZXgtZ3JvdzogMTtcbn1cbi5ib3JkZXItY29sbGFwc2Uge1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xufVxuLmN1cnNvci1wb2ludGVyIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLmZsZXgtY29sIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cbi5pdGVtcy1jZW50ZXIge1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuLmp1c3RpZnktc3RhcnQge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG59XG4uanVzdGlmeS1jZW50ZXIge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cbi5qdXN0aWZ5LWJldHdlZW4ge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG59XG4uanVzdGlmeS1ldmVubHkge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbn1cbi5nYXAtXFxcXFswcHhcXFxcXSB7XG4gIGdhcDogMHB4O1xufVxuLmdhcC15LVxcXFxbMTZweFxcXFxdIHtcbiAgcm93LWdhcDogMTZweDtcbn1cbi5nYXAteS1cXFxcWzhweFxcXFxdIHtcbiAgcm93LWdhcDogOHB4O1xufVxuLm92ZXJmbG93LWF1dG8ge1xuICBvdmVyZmxvdzogYXV0bztcbn1cbi5vdmVyZmxvdy14LWF1dG8ge1xuICBvdmVyZmxvdy14OiBhdXRvO1xufVxuLnRleHQtZWxsaXBzaXMge1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbn1cbi53aGl0ZXNwYWNlLW5vd3JhcCB7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4ucm91bmRlZC1cXFxcWzE2cHhcXFxcXSB7XG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG59XG4ucm91bmRlZC1cXFxcWzRweFxcXFxdIHtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xufVxuLnJvdW5kZWQtZnVsbCB7XG4gIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbn1cbi5ib3JkZXIge1xuICBib3JkZXItd2lkdGg6IDFweDtcbn1cbi5ib3JkZXItbmV1dHJhbF80IHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDIxMCwgMjEwLCAyMTAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG59XG4uYm9yZGVyLW5ldXRyYWxfNyB7XG4gIC0tdHctYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy1ib3JkZXItb3BhY2l0eSwgMSkpO1xufVxuLmJnLWJsdWUtNTAwIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNTkgMTMwIDI0NiAvIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cbi5iZy1uZXV0cmFsXzEge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjI1LCAyMjUsIDIyNSwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuLmJnLW5ldXRyYWxfMiB7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMjAsIDIyMCwgMjIwLCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG4uYmctbmV1dHJhbF85IHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDEwMCwgMTAwLCAxMDAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cbi5iZy1yZWQtNDAwIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQ4IDExMyAxMTMgLyB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG4ucC1cXFxcWzBweFxcXFxdIHtcbiAgcGFkZGluZzogMHB4O1xufVxuLnAtXFxcXFsxNnB4XFxcXF0ge1xuICBwYWRkaW5nOiAxNnB4O1xufVxuLnAtXFxcXFszMnB4XFxcXF0ge1xuICBwYWRkaW5nOiAzMnB4O1xufVxuLnAtXFxcXFs0cHhcXFxcXSB7XG4gIHBhZGRpbmc6IDRweDtcbn1cbi5wLVxcXFxbOHB4XFxcXF0ge1xuICBwYWRkaW5nOiA4cHg7XG59XG4ucHgtXFxcXFsxNnB4XFxcXF0ge1xuICBwYWRkaW5nLWxlZnQ6IDE2cHg7XG4gIHBhZGRpbmctcmlnaHQ6IDE2cHg7XG59XG4ucHgtXFxcXFs4cHhcXFxcXSB7XG4gIHBhZGRpbmctbGVmdDogOHB4O1xuICBwYWRkaW5nLXJpZ2h0OiA4cHg7XG59XG4ucGwtXFxcXFswcHhcXFxcXSB7XG4gIHBhZGRpbmctbGVmdDogMHB4O1xufVxuLnRleHQtY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuLmFsaWduLW1pZGRsZSB7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG4udGV4dC0yeGwge1xuICBmb250LXNpemU6IDEuNXJlbTtcbiAgbGluZS1oZWlnaHQ6IDJyZW07XG59XG4uZm9udC1ib2xkIHtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cbi5mb250LWxpZ2h0IHtcbiAgZm9udC13ZWlnaHQ6IDMwMDtcbn1cbi51cHBlcmNhc2Uge1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuLmxvd2VyY2FzZSB7XG4gIHRleHQtdHJhbnNmb3JtOiBsb3dlcmNhc2U7XG59XG4udGV4dC1uZXV0cmFsXzcge1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoNjAsIDYwLCA2MCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG59XG4ub3V0bGluZSB7XG4gIG91dGxpbmUtc3R5bGU6IHNvbGlkO1xufVxuLm91dGxpbmUtXFxcXFsxcHhcXFxcXSB7XG4gIG91dGxpbmUtd2lkdGg6IDFweDtcbn1cbi5vdXRsaW5lLVxcXFxbMnB4XFxcXF0ge1xuICBvdXRsaW5lLXdpZHRoOiAycHg7XG59XG4ub3V0bGluZS1ibGFja1xcXFwvMTAge1xuICBvdXRsaW5lLWNvbG9yOiByZ2IoMCAwIDAgLyAwLjEpO1xufVxuLmRyb3Atc2hhZG93LVxcXFxbMF8xcHhfMnB4X3JnYmFcXFxcKDBcXFxcMmMgMFxcXFwyYyAwXFxcXDJjIDBcXFxcLjI1XFxcXClcXFxcXSB7XG4gIC0tdHctZHJvcC1zaGFkb3c6IGRyb3Atc2hhZG93KDAgMXB4IDJweCByZ2JhKDAsMCwwLDAuMjUpKTtcbiAgZmlsdGVyOiB2YXIoLS10dy1ibHVyKSB2YXIoLS10dy1icmlnaHRuZXNzKSB2YXIoLS10dy1jb250cmFzdCkgdmFyKC0tdHctZ3JheXNjYWxlKSB2YXIoLS10dy1odWUtcm90YXRlKSB2YXIoLS10dy1pbnZlcnQpIHZhcigtLXR3LXNhdHVyYXRlKSB2YXIoLS10dy1zZXBpYSkgdmFyKC0tdHctZHJvcC1zaGFkb3cpO1xufVxuLmRyb3Atc2hhZG93LXNvZnQtYm90LXJpZ2h0IHtcbiAgLS10dy1kcm9wLXNoYWRvdzogZHJvcC1zaGFkb3coMXB4IDFweCA0cHggcmdiKDAgMCAwIC8gMC4yNSkpO1xuICBmaWx0ZXI6IHZhcigtLXR3LWJsdXIpIHZhcigtLXR3LWJyaWdodG5lc3MpIHZhcigtLXR3LWNvbnRyYXN0KSB2YXIoLS10dy1ncmF5c2NhbGUpIHZhcigtLXR3LWh1ZS1yb3RhdGUpIHZhcigtLXR3LWludmVydCkgdmFyKC0tdHctc2F0dXJhdGUpIHZhcigtLXR3LXNlcGlhKSB2YXIoLS10dy1kcm9wLXNoYWRvdyk7XG59XG5cbmJvZHkge1xuICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBSb2JvdG8sIEhlbHZldGljYSxcbiAgICBBcmlhbCwgc2Fucy1zZXJpZjtcbn1cblxuLmJhc2Uge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi5iYXNlLWlucHV0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzNnB4O1xuICB3aWR0aDogMTAwJTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIyMCwgMjIwLCAyMjAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbiAgcGFkZGluZzogOHB4O1xufVxuXG4uYmFzZS1pbnB1dDpob3ZlciB7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMzAsIDIzMCwgMjMwLCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG5cbi5iYXNlLWJvcmRlciB7XG4gIC0tdHctYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy1ib3JkZXItb3BhY2l0eSwgMSkpO1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoNjAsIDYwLCA2MCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG59XG5cbi5iYXNlLXRleHQtcG9zaXRpb24ge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi5iYXNlLXRleHQtcG9zaXRpb24tY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xufVxuXG4uYmFzZS10ZXh0LXN0eWxlIHtcbiAgdGV4dC10cmFuc2Zvcm06IGxvd2VyY2FzZTtcbiAgLS10dy10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LXRleHQtb3BhY2l0eSwgMSkpO1xufVxuXG4uYmFzZS1vdXRsaW5lIHtcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XG4gIG91dGxpbmUtd2lkdGg6IDFweDtcbiAgb3V0bGluZS1jb2xvcjogcmdiKDAgMCAwIC8gMC4yNSk7XG59XG5cbi51bml0IHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcbiAgb3V0bGluZS13aWR0aDogMXB4O1xuICBvdXRsaW5lLWNvbG9yOiByZ2IoMCAwIDAgLyAwLjI1KTtcbn1cblxuLmJ1dHRvbi1zdWJtaXQge1xuICAtLXR3LWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6IHJnYmEoNjAsIDYwLCA2MCwgdmFyKC0tdHctYm9yZGVyLW9wYWNpdHksIDEpKTtcbiAgLS10dy10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LXRleHQtb3BhY2l0eSwgMSkpO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIG91dGxpbmUtc3R5bGU6IHNvbGlkO1xuICBvdXRsaW5lLXdpZHRoOiAxcHg7XG4gIG91dGxpbmUtY29sb3I6IHJnYigwIDAgMCAvIDAuMjUpO1xufVxuXG4uaW5wdXQtbnVtYmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzNnB4O1xuICB3aWR0aDogMTAwJTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIyMCwgMjIwLCAyMjAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbiAgcGFkZGluZzogOHB4O1xufVxuXG4uaW5wdXQtbnVtYmVyOmhvdmVyIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIzMCwgMjMwLCAyMzAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cblxuLmlucHV0LW51bWJlciB7XG4gIC0tdHctYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy1ib3JkZXItb3BhY2l0eSwgMSkpO1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoNjAsIDYwLCA2MCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XG4gIG91dGxpbmUtd2lkdGg6IDFweDtcbiAgb3V0bGluZS1jb2xvcjogcmdiKDAgMCAwIC8gMC4yNSk7XG59XG5cbmlucHV0LmlucHV0LW51bWJlciB7XG4gIC1tb3otYXBwZWFyYW5jZTogbm9uZTtcbiAgICAgICBhcHBlYXJhbmNlOiBub25lO1xuICBtYXJnaW46IDA7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgLW1vei1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XG59XG5cbmlucHV0LmlucHV0LW51bWJlcjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcbmlucHV0LmlucHV0LW51bWJlcjo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4td2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG5tYXJnaW46IDA7XG59XG5cbi5pbnB1dC10ZXh0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzNnB4O1xuICB3aWR0aDogMTAwJTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIyMCwgMjIwLCAyMjAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbiAgcGFkZGluZzogOHB4O1xufVxuXG4uaW5wdXQtdGV4dDpob3ZlciB7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMzAsIDIzMCwgMjMwLCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG5cbi5pbnB1dC10ZXh0IHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcbiAgb3V0bGluZS13aWR0aDogMXB4O1xuICBvdXRsaW5lLWNvbG9yOiByZ2IoMCAwIDAgLyAwLjI1KTtcbn1cblxuLmZpZWxkLXRpdGxlIHtcbiAgaGVpZ2h0OiAyNHB4O1xuICB3aWR0aDogMTAwJTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICB0ZXh0LXRyYW5zZm9ybTogbG93ZXJjYXNlO1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoNjAsIDYwLCA2MCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG59XG5cbi5pbnB1dC1maWVsZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4udGFibGUtcGF0dGVybi0xIHtcbiAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gIC0tdHctYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogcmdiYSgyMTAsIDIxMCwgMjEwLCB2YXIoLS10dy1ib3JkZXItb3BhY2l0eSwgMSkpO1xuICBwYWRkaW5nOiA0cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuLm1haW4tY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG4gIGdhcDogMHB4O1xuICBwYWRkaW5nOiAwcHg7XG4gIHBhZGRpbmctbGVmdDogMHB4O1xufVxuXG5pbnB1dC5jb250aW51b3VzLW51bWJlciB7XG4gIC1tb3otYXBwZWFyYW5jZTogbm9uZTtcbiAgICAgICBhcHBlYXJhbmNlOiBub25lO1xuICBtYXJnaW46IDA7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgLW1vei1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XG59XG5cbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuaW5wdXQuY29udGludW91cy1udW1iZXI6Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xubWFyZ2luOiAwO1xufVxuXG4uaG92ZXJcXFxcOmJvcmRlci1iLVxcXFxbMXB4XFxcXF06aG92ZXIge1xuICBib3JkZXItYm90dG9tLXdpZHRoOiAxcHg7XG59XG5cbi5ob3ZlclxcXFw6Ym9yZGVyLWFtYmVyLTYwMDpob3ZlciB7XG4gIC0tdHctYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogcmdiKDIxNyAxMTkgNiAvIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG59XG5cbi5ob3ZlclxcXFw6YmctbmV1dHJhbF8wOmhvdmVyIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIzMCwgMjMwLCAyMzAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cblxuLmhvdmVyXFxcXDpiZy1uZXV0cmFsXzE6aG92ZXIge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjI1LCAyMjUsIDIyNSwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuXG4uaG92ZXJcXFxcOmJnLW5ldXRyYWxfNzpob3ZlciB7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG5cbi5ob3ZlclxcXFw6Zm9udC1ub3JtYWw6aG92ZXIge1xuICBmb250LXdlaWdodDogNDAwO1xufVxuXG4uaG92ZXJcXFxcOnRleHQtbmV1dHJhbF81OmhvdmVyIHtcbiAgLS10dy10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiByZ2JhKDIwLCAyMCwgMjAsIHZhcigtLXR3LXRleHQtb3BhY2l0eSwgMSkpO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc2NyaXB0cy9zdHlsZXMvaW5kZXguY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQUEsd0JBQWM7RUFBZCx3QkFBYztFQUFkLG1CQUFjO0VBQWQsbUJBQWM7RUFBZCxjQUFjO0VBQWQsY0FBYztFQUFkLGNBQWM7RUFBZCxlQUFjO0VBQWQsZUFBYztFQUFkLGFBQWM7RUFBZCxhQUFjO0VBQWQsa0JBQWM7RUFBZCxzQ0FBYztFQUFkLDhCQUFjO0VBQWQsNkJBQWM7RUFBZCw0QkFBYztFQUFkLGVBQWM7RUFBZCxvQkFBYztFQUFkLHNCQUFjO0VBQWQsdUJBQWM7RUFBZCx3QkFBYztFQUFkLGtCQUFjO0VBQWQsMkJBQWM7RUFBZCw0QkFBYztFQUFkLHNDQUFjO0VBQWQsa0NBQWM7RUFBZCwyQkFBYztFQUFkLHNCQUFjO0VBQWQsOEJBQWM7RUFBZCxZQUFjO0VBQWQsa0JBQWM7RUFBZCxnQkFBYztFQUFkLGlCQUFjO0VBQWQsa0JBQWM7RUFBZCxjQUFjO0VBQWQsZ0JBQWM7RUFBZCxhQUFjO0VBQWQsbUJBQWM7RUFBZCxxQkFBYztFQUFkLDJCQUFjO0VBQWQseUJBQWM7RUFBZCwwQkFBYztFQUFkLDJCQUFjO0VBQWQsdUJBQWM7RUFBZCx3QkFBYztFQUFkLHlCQUFjO0VBQWQsc0JBQWM7RUFBZCxvQkFBYztFQUFkLHNCQUFjO0VBQWQscUJBQWM7RUFBZDtBQUFjOztBQUFkO0VBQUEsd0JBQWM7RUFBZCx3QkFBYztFQUFkLG1CQUFjO0VBQWQsbUJBQWM7RUFBZCxjQUFjO0VBQWQsY0FBYztFQUFkLGNBQWM7RUFBZCxlQUFj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QUFjLEVBQWQsTUFBYztFQUFkLHNCQUFjLEVBQWQsTUFBYztBQUFBOztBQUFkOztDQUFjOztBQUFkO0VBQUEsYUFBYztBQUFBOztBQUFkOztDQUFjOztBQUFkO0VBQUEsZ0JBQWM7QUFBQTs7QUFBZDs7Q0FBYzs7QUFBZDtFQUFBLHdCQUFjO0FBQUE7O0FBQWQ7O0NBQWM7O0FBQWQ7O0VBQUEsWUFBYztBQUFBOztBQUFkOzs7Q0FBYzs7QUFBZDtFQUFBLDZCQUFjLEVBQWQsTUFBYztFQUFkLG9CQUFjLEVBQWQsTUFBYztBQUFBOztBQUFkOztDQUFjOztBQUFkO0VBQUEsd0JBQWM7QUFBQTs7QUFBZDs7O0NBQWM7O0FBQWQ7RUFBQSwwQkFBYyxFQUFkLE1BQWM7RUFBZCxhQUFjLEVBQWQsTUFBYztBQUFBOztBQUFkOztDQUFjOztBQUFkO0VBQUEsa0JBQWM7QUFBQTs7QUFBZDs7Q0FBYzs7QUFBZDs7Ozs7Ozs7Ozs7OztFQUFBLFNBQWM7QUFBQTs7QUFBZDtFQUFBLFNBQWM7RUFBZCxVQUFjO0FBQUE7O0FBQWQ7RUFBQSxVQUFjO0FBQUE7O0FBQWQ7OztFQUFBLGdCQUFjO0VBQWQsU0FBYztFQUFkLFVBQWM7QUFBQTs7QUFBZDs7Q0FBYztBQUFkO0VBQUEsVUFBYztBQUFBOztBQUFkOztDQUFjOztBQUFkO0VBQUEsZ0JBQWM7QUFBQTs7QUFBZDs7O0NBQWM7O0FBQWQ7RUFBQSxVQUFjLEVBQWQsTUFBYztFQUFkLGNBQWMsRUFBZCxNQUFjO0FBQUE7O0FBQWQ7O0VBQUEsVUFBYyxFQUFkLE1BQWM7RUFBZCxjQUFjLEVBQWQsTUFBYztBQUFBOztBQUFkOztDQUFjOztBQUFkOztFQUFBLGVBQWM7QUFBQTs7QUFBZDs7Q0FBYztBQUFkO0VBQUEsZUFBYztBQUFBOztBQUFkOzs7O0NBQWM7O0FBQWQ7Ozs7Ozs7O0VBQUEsY0FBYyxFQUFkLE1BQWM7RUFBZCxzQkFBYyxFQUFkLE1BQWM7QUFBQTs7QUFBZDs7Q0FBYzs7QUFBZDs7RUFBQSxlQUFjO0VBQWQsWUFBYztBQUFBOztBQUFkLHdFQUFjO0FBQWQ7RUFBQSxhQUFjO0FBQUE7QUFFZDtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5C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d2luZCBiYXNlO1xcbkB0YWlsd2luZCBjb21wb25lbnRzO1xcbkB0YWlsd2luZCB1dGlsaXRpZXM7XFxuXFxuQGltcG9ydCBcXFwiLi90aGVtZXMuY3NzXFxcIjtcXG5AaW1wb3J0IFxcXCIuL2ZvbnRzLmNzc1xcXCI7XFxuQGltcG9ydCBcXFwiLi90ZXh0cy5jc3NcXFwiO1xcbkBpbXBvcnQgXFxcIi4vaW5wdXRzLmNzc1xcXCI7XFxuXFxuYm9keSB7XFxuICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBSb2JvdG8sIEhlbHZldGljYSxcXG4gICAgQXJpYWwsIHNhbnMtc2VyaWY7XFxufVxcblxcbi5iYXNlIHtcXG4gIEBhcHBseSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGU7XFxufVxcblxcbi5iYXNlLWlucHV0IHtcXG4gIEBhcHBseSByb3VuZGVkLVs0cHhdIHAtWzhweF0gdy1mdWxsIGgtWzM2cHhdIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLW5ldXRyYWxfMiBob3ZlcjpiZy1uZXV0cmFsXzA7XFxufVxcblxcbi5iYXNlLWJvcmRlciB7XFxuICBAYXBwbHkgYm9yZGVyLW5ldXRyYWxfNyB0ZXh0LW5ldXRyYWxfN1xcbn1cXG5cXG4uYmFzZS10ZXh0LXBvc2l0aW9uIHtcXG4gIEBhcHBseSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGVcXG59XFxuXFxuLmJhc2UtdGV4dC1wb3NpdGlvbi1jZW50ZXIge1xcbiAgQGFwcGx5IHRleHQtY2VudGVyIGFsaWduLW1pZGRsZVxcbn1cXG5cXG4uYmFzZS10ZXh0LXN0eWxlIHtcXG4gIEBhcHBseSB0ZXh0LW5ldXRyYWxfNyBsb3dlcmNhc2VcXG59XFxuXFxuLmJhc2Utb3V0bGluZSB7XFxuICBAYXBwbHkgb3V0bGluZSBvdXRsaW5lLVsxcHhdIG91dGxpbmUtYmxhY2svMjU7XFxufVxcblxcbi51bml0IHtcXG4gIEBhcHBseSBiYXNlLXRleHQtcG9zaXRpb24tY2VudGVyIGJhc2UtYm9yZGVyIGJhc2Utb3V0bGluZVxcbn1cXG5cXG4uYnV0dG9uLXN1Ym1pdCB7XFxuICBAYXBwbHkgYmFzZS10ZXh0LXBvc2l0aW9uLWNlbnRlciBiYXNlLWJvcmRlciBiYXNlLW91dGxpbmVcXG59XFxuXFxuLmlucHV0LW51bWJlciB7XFxuICBAYXBwbHkgYmFzZS10ZXh0LXBvc2l0aW9uIGJhc2UtYm9yZGVyIGJhc2Utb3V0bGluZSBiYXNlLWlucHV0IGNvbnRpbnVvdXMtbnVtYmVyO1xcbn1cXG5cXG4uaW5wdXQtdGV4dCB7XFxuICBAYXBwbHkgYmFzZS10ZXh0LXBvc2l0aW9uIGJhc2UtYm9yZGVyIGJhc2Utb3V0bGluZSBiYXNlLWlucHV0O1xcbn1cXG5cXG4uZmllbGQtdGl0bGUge1xcbiAgQGFwcGx5IGJhc2UtdGV4dC1wb3NpdGlvbi1jZW50ZXIgYmFzZS10ZXh0LXN0eWxlIHctZnVsbCBoLVsyNHB4XTtcXG59XFxuXFxuLmlucHV0LWZpZWxkIHtcXG4gIEBhcHBseSB3LWZ1bGwgaC1mdWxsIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyO1xcbn1cXG5cXG4udGFibGUtcGF0dGVybi0xIHtcXG4gIEBhcHBseSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGUgYm9yZGVyIGJvcmRlci1uZXV0cmFsXzQgcC1bNHB4XVxcbn1cXG5cXG4ubWFpbi1jb250ZW50IHtcXG4gIEBhcHBseSB3LWZ1bGwgaC1mdWxsIGZsZXggZ2FwLVswcHhdIHBsLVswcHhdIHAtWzBweF1cXG59XFxuXFxuaW5wdXQuY29udGludW91cy1udW1iZXIge1xcbiAgYXBwZWFyYW5jZTogbm9uZTtcXG4gIG1hcmdpbjogMDtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIC1tb3otYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xcbn1cXG5cXG5pbnB1dC5jb250aW51b3VzLW51bWJlcjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG5pbnB1dC5jb250aW51b3VzLW51bWJlcjo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbm1hcmdpbjogMDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBgLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJcIixcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQGxheWVyIGNvbXBvbmVudHMge1xyXG4gICAgLmJhc2Uge1xyXG4gICAgICAgIEBhcHBseSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGU7XHJcbiAgICB9XHJcbiAgICAuZGVmYXVsdC1idXR0b24ge1xyXG4gICAgICAgIEBhcHBseSBiYXNlIGJnLWJsdWUtNTAwIGJvcmRlci1uZXV0cmFsXzcgdGV4dC1uZXV0cmFsXzc7XHJcbiAgICB9XHJcblxyXG4gICAgLyogSGlkZSBzY3JvbGxiYXIgZm9yIElFLCBFZGdlIGFuZCBGaXJlZm94ICovXHJcbiAgICAubm8tc2Nyb2xsYmFyIHtcclxuICAgICAgICAtbXMtb3ZlcmZsb3ctc3R5bGU6IG5vbmU7ICAvKiBJRSBhbmQgRWRnZSAqL1xyXG4gICAgICAgIHNjcm9sbGJhci13aWR0aDogbm9uZTsgIC8qIEZpcmVmb3ggKi9cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyogSGlkZSBzY3JvbGxiYXIgZm9yIENocm9tZSwgU2FmYXJpIGFuZCBPcGVyYSAqL1xyXG4gICAgLm5vLXNjcm9sbGJhcjo6LXdlYmtpdC1zY3JvbGxiYXIge1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLmRlZmF1bHQtaW5wdXQge1xyXG4gICAgICAgIEBhcHBseSBiYXNlIGJvcmRlci1uZXV0cmFsXzcgdGV4dC1uZXV0cmFsXzcgcm91bmRlZC1bMTZweF07XHJcbiAgICB9XHJcbn1cclxuXHJcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyIHtcclxuICAgIGFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICAtbW96LWFwcGVhcmFuY2U6IHRleHRmaWVsZDtcclxufVxyXG5cclxuaW5wdXQuY29udGludW91cy1udW1iZXI6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXHJcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcclxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgbWFyZ2luOiAwO1xyXG59XHJcblxyXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbnB1dHMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0k7UUFDSSwrQkFBK0I7SUFDbkM7SUFDQTtRQUNJLHVEQUF1RDtJQUMzRDs7SUFFQSw0Q0FBNEM7SUFDNUM7UUFDSSx3QkFBd0IsR0FBRyxnQkFBZ0I7UUFDM0MscUJBQXFCLEdBQUcsWUFBWTtJQUN4Qzs7SUFFQSxnREFBZ0Q7SUFDaEQ7UUFDSSxhQUFhO0lBQ2pCOztJQUVBO1FBQ0ksMERBQTBEO0lBQzlEO0FBQ0o7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsU0FBUztJQUNULHdCQUF3QjtJQUN4QiwwQkFBMEI7QUFDOUI7O0FBRUE7O0VBRUUsd0JBQXdCO0VBQ3hCLFNBQVM7QUFDWFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAbGF5ZXIgY29tcG9uZW50cyB7XFxyXFxuICAgIC5iYXNlIHtcXHJcXG4gICAgICAgIEBhcHBseSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGU7XFxyXFxuICAgIH1cXHJcXG4gICAgLmRlZmF1bHQtYnV0dG9uIHtcXHJcXG4gICAgICAgIEBhcHBseSBiYXNlIGJnLWJsdWUtNTAwIGJvcmRlci1uZXV0cmFsXzcgdGV4dC1uZXV0cmFsXzc7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLyogSGlkZSBzY3JvbGxiYXIgZm9yIElFLCBFZGdlIGFuZCBGaXJlZm94ICovXFxyXFxuICAgIC5uby1zY3JvbGxiYXIge1xcclxcbiAgICAgICAgLW1zLW92ZXJmbG93LXN0eWxlOiBub25lOyAgLyogSUUgYW5kIEVkZ2UgKi9cXHJcXG4gICAgICAgIHNjcm9sbGJhci13aWR0aDogbm9uZTsgIC8qIEZpcmVmb3ggKi9cXHJcXG4gICAgfVxcclxcbiAgICBcXHJcXG4gICAgLyogSGlkZSBzY3JvbGxiYXIgZm9yIENocm9tZSwgU2FmYXJpIGFuZCBPcGVyYSAqL1xcclxcbiAgICAubm8tc2Nyb2xsYmFyOjotd2Via2l0LXNjcm9sbGJhciB7XFxyXFxuICAgICAgICBkaXNwbGF5OiBub25lO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5kZWZhdWx0LWlucHV0IHtcXHJcXG4gICAgICAgIEBhcHBseSBiYXNlIGJvcmRlci1uZXV0cmFsXzcgdGV4dC1uZXV0cmFsXzcgcm91bmRlZC1bMTZweF07XFxyXFxuICAgIH1cXHJcXG59XFxyXFxuXFxyXFxuaW5wdXQuY29udGludW91cy1udW1iZXIge1xcclxcbiAgICBhcHBlYXJhbmNlOiBub25lO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXHJcXG4gICAgLW1vei1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XFxyXFxufVxcclxcblxcclxcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcclxcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXHJcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG59XFxyXFxuXFxyXFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBgLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJcIixcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgOnJvb3Qge1xyXG4gIC0tcHJpbWFyeTogMjU1LCAwLCAwO1xyXG4gIC0tcHJpbWFyeV9oaWdobGlnaHQ6IDAsIDI1NSwgMDtcclxuICAtLXNlY29uZGFyeTogMCwgMCwgMjU1O1xyXG4gIC0tbmV1dHJhbF8wOiAyNDAsIDI0MCwgMjQwO1xyXG4gIC0tbmV1dHJhbF8xOiAyMjAsIDIyMCwgMjIwO1xyXG4gIC0tbmV1dHJhbF8yOiAyMDAsIDIwMCwgMjAwO1xyXG4gIC0tbmV1dHJhbF8zOiAxODAsIDE4MCwgMTgwO1xyXG4gIC0tbmV1dHJhbF80OiAxNjAsIDE2MCwgMTYwO1xyXG4gIC0tbmV1dHJhbF81OiAxNDAsIDE0MCwgMTQwO1xyXG4gIC0tbmV1dHJhbF82OiAxMjAsIDEyMCwgMTIwO1xyXG4gIC0tbmV1dHJhbF83OiAxMDAsIDEwMCwgMTAwO1xyXG4gIC0tbmV1dHJhbF84OiA4MCwgODAsIDgwO1xyXG4gIC0tbmV1dHJhbF85OiA2MCwgNjAsIDYwO1xyXG59XHJcblxyXG5bZGF0YS10aGVtZT0nY3VzdG9tX2xpZ2h0J11cclxue1xyXG4gIC0tcHJpbWFyeTogMjUwLCAyNTAsIDI1MDtcclxuICAtLXByaW1hcnlfaGlnaGxpZ2h0OiAyNTUsIDI1NSwgMjU1O1xyXG4gIC0tc2Vjb25kYXJ5OiAyMDAsIDIwMCwgMjAwO1xyXG4gIC0tcHJpbWFyeV90ZXh0OiA5MCwgOTAsIDkwO1xyXG4gIC0tcHJpbWFyeV9oaWdobGlnaHRfdGV4dDogMzAsIDMwLCAzMDtcclxuICAtLXByaW1hcnlfaGlnaGxpZ2h0X3RleHQ6IDMwLCAzMCwgMzA7XHJcbiAgLS1pbmZvOiAxMDAsIDEwMCwgMjQwO1xyXG4gIC0tc3VjY2VzczogMTAwLCAyNDAsIDEwMDtcclxuICAtLXdhcm5pbmc6IDI0MCwgMjQwLCAxMDA7XHJcbiAgLS1lcnJvcjogMjQwLCAxMDAsIDEwMDtcclxuICAtLW5ldXRyYWxfMDogMjU1LCAyNTUsIDI1NTtcclxuICAtLW5ldXRyYWxfMTogMjUwLCAyNTAsIDI1MDtcclxuICAtLW5ldXRyYWxfMjogMjQ1LCAyNDUsIDI0NTtcclxuICAtLW5ldXRyYWxfMzogMjQwLCAyNDAsIDI0MDtcclxuICAtLW5ldXRyYWxfNDogMjM1LCAyMzUsIDIzNTtcclxuICAtLW5ldXRyYWxfNTogMTAsIDEwLCAxMDtcclxuICAtLW5ldXRyYWxfNjogMTUsIDE1LCAxNTtcclxuICAtLW5ldXRyYWxfNzogMjAsIDIwLCAyMDtcclxuICAtLW5ldXRyYWxfODogMjUsIDI1LCAyNTtcclxuICAtLW5ldXRyYWxfOTogMzAsIDMwLCAzMDtcclxufVxyXG5cclxuW2RhdGEtdGhlbWU9J2N1c3RvbV9kYXJrJ11cclxue1xyXG4gIC0tcHJpbWFyeTogNDAsIDQwLCA0MDtcclxuICAtLXByaW1hcnlfaGlnaGxpZ2h0OiAzMCwgMzAsIDMwO1xyXG4gIC0tc2Vjb25kYXJ5OiAyMCwgMjAsIDIwO1xyXG4gIC0tcHJpbWFyeV90ZXh0OiAyNTUsIDI1NSwgMjU1O1xyXG4gIC0tcHJpbWFyeV9oaWdobGlnaHRfdGV4dDogMjUwLCAyNTAsIDI1MDtcclxuICAtLWluZm86IDEwMCwgMTAwLCAyNDA7XHJcbiAgLS1zdWNjZXNzOiAxMDAsIDI0MCwgMTAwO1xyXG4gIC0td2FybmluZzogMjQwLCAyNDAsIDEwMDtcclxuICAtLWVycm9yOiAyNDAsIDEwMCwgMTAwO1xyXG4gIC0tbmV1dHJhbF8wOiAyNTUsIDI1NSwgMjU1O1xyXG4gIC0tbmV1dHJhbF8xOiAyNTAsIDI1MCwgMjUwO1xyXG4gIC0tbmV1dHJhbF8yOiAyNDUsIDI0NSwgMjQ1O1xyXG4gIC0tbmV1dHJhbF8zOiAyNDAsIDI0MCwgMjQwO1xyXG4gIC0tbmV1dHJhbF80OiAyMzUsIDIzNSwgMjM1O1xyXG4gIC0tbmV1dHJhbF81OiAxMCwgMTAsIDEwO1xyXG4gIC0tbmV1dHJhbF82OiAxNSwgMTUsIDE1O1xyXG4gIC0tbmV1dHJhbF83OiAyMCwgMjAsIDIwO1xyXG4gIC0tbmV1dHJhbF84OiAyNSwgMjUsIDI1O1xyXG4gIC0tbmV1dHJhbF85OiAzMCwgMzAsIDMwO1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc2NyaXB0cy9zdHlsZXMvdGhlbWVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLG9CQUFvQjtFQUNwQiw4QkFBOEI7RUFDOUIsc0JBQXNCO0VBQ3RCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtBQUN6Qjs7QUFFQTs7RUFFRSx3QkFBd0I7RUFDeEIsa0NBQWtDO0VBQ2xDLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsb0NBQW9DO0VBQ3BDLG9DQUFvQztFQUNwQyxxQkFBcUI7RUFDckIsd0JBQXdCO0VBQ3hCLHdCQUF3QjtFQUN4QixzQkFBc0I7RUFDdEIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQix1QkFBdUI7RUFDdkIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtFQUN2Qix1QkFBdUI7RUFDdkIsdUJBQXVCO0FBQ3pCOztBQUVBOztFQUVFLHFCQUFxQjtFQUNyQiwrQkFBK0I7RUFDL0IsdUJBQXVCO0VBQ3ZCLDZCQUE2QjtFQUM3Qix1Q0FBdUM7RUFDdkMscUJBQXFCO0VBQ3JCLHdCQUF3QjtFQUN4Qix3QkFBd0I7RUFDeEIsc0JBQXNCO0VBQ3RCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtFQUN2Qix1QkFBdUI7RUFDdkIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtBQUN6QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI6cm9vdCB7XFxyXFxuICAtLXByaW1hcnk6IDI1NSwgMCwgMDtcXHJcXG4gIC0tcHJpbWFyeV9oaWdobGlnaHQ6IDAsIDI1NSwgMDtcXHJcXG4gIC0tc2Vjb25kYXJ5OiAwLCAwLCAyNTU7XFxyXFxuICAtLW5ldXRyYWxfMDogMjQwLCAyNDAsIDI0MDtcXHJcXG4gIC0tbmV1dHJhbF8xOiAyMjAsIDIyMCwgMjIwO1xcclxcbiAgLS1uZXV0cmFsXzI6IDIwMCwgMjAwLCAyMDA7XFxyXFxuICAtLW5ldXRyYWxfMzogMTgwLCAxODAsIDE4MDtcXHJcXG4gIC0tbmV1dHJhbF80OiAxNjAsIDE2MCwgMTYwO1xcclxcbiAgLS1uZXV0cmFsXzU6IDE0MCwgMTQwLCAxNDA7XFxyXFxuICAtLW5ldXRyYWxfNjogMTIwLCAxMjAsIDEyMDtcXHJcXG4gIC0tbmV1dHJhbF83OiAxMDAsIDEwMCwgMTAwO1xcclxcbiAgLS1uZXV0cmFsXzg6IDgwLCA4MCwgODA7XFxyXFxuICAtLW5ldXRyYWxfOTogNjAsIDYwLCA2MDtcXHJcXG59XFxyXFxuXFxyXFxuW2RhdGEtdGhlbWU9J2N1c3RvbV9saWdodCddXFxyXFxue1xcclxcbiAgLS1wcmltYXJ5OiAyNTAsIDI1MCwgMjUwO1xcclxcbiAgLS1wcmltYXJ5X2hpZ2hsaWdodDogMjU1LCAyNTUsIDI1NTtcXHJcXG4gIC0tc2Vjb25kYXJ5OiAyMDAsIDIwMCwgMjAwO1xcclxcbiAgLS1wcmltYXJ5X3RleHQ6IDkwLCA5MCwgOTA7XFxyXFxuICAtLXByaW1hcnlfaGlnaGxpZ2h0X3RleHQ6IDMwLCAzMCwgMzA7XFxyXFxuICAtLXByaW1hcnlfaGlnaGxpZ2h0X3RleHQ6IDMwLCAzMCwgMzA7XFxyXFxuICAtLWluZm86IDEwMCwgMTAwLCAyNDA7XFxyXFxuICAtLXN1Y2Nlc3M6IDEwMCwgMjQwLCAxMDA7XFxyXFxuICAtLXdhcm5pbmc6IDI0MCwgMjQwLCAxMDA7XFxyXFxuICAtLWVycm9yOiAyNDAsIDEwMCwgMTAwO1xcclxcbiAgLS1uZXV0cmFsXzA6IDI1NSwgMjU1LCAyNTU7XFxyXFxuICAtLW5ldXRyYWxfMTogMjUwLCAyNTAsIDI1MDtcXHJcXG4gIC0tbmV1dHJhbF8yOiAyNDUsIDI0NSwgMjQ1O1xcclxcbiAgLS1uZXV0cmFsXzM6IDI0MCwgMjQwLCAyNDA7XFxyXFxuICAtLW5ldXRyYWxfNDogMjM1LCAyMzUsIDIzNTtcXHJcXG4gIC0tbmV1dHJhbF81OiAxMCwgMTAsIDEwO1xcclxcbiAgLS1uZXV0cmFsXzY6IDE1LCAxNSwgMTU7XFxyXFxuICAtLW5ldXRyYWxfNzogMjAsIDIwLCAyMDtcXHJcXG4gIC0tbmV1dHJhbF84OiAyNSwgMjUsIDI1O1xcclxcbiAgLS1uZXV0cmFsXzk6IDMwLCAzMCwgMzA7XFxyXFxufVxcclxcblxcclxcbltkYXRhLXRoZW1lPSdjdXN0b21fZGFyayddXFxyXFxue1xcclxcbiAgLS1wcmltYXJ5OiA0MCwgNDAsIDQwO1xcclxcbiAgLS1wcmltYXJ5X2hpZ2hsaWdodDogMzAsIDMwLCAzMDtcXHJcXG4gIC0tc2Vjb25kYXJ5OiAyMCwgMjAsIDIwO1xcclxcbiAgLS1wcmltYXJ5X3RleHQ6IDI1NSwgMjU1LCAyNTU7XFxyXFxuICAtLXByaW1hcnlfaGlnaGxpZ2h0X3RleHQ6IDI1MCwgMjUwLCAyNTA7XFxyXFxuICAtLWluZm86IDEwMCwgMTAwLCAyNDA7XFxyXFxuICAtLXN1Y2Nlc3M6IDEwMCwgMjQwLCAxMDA7XFxyXFxuICAtLXdhcm5pbmc6IDI0MCwgMjQwLCAxMDA7XFxyXFxuICAtLWVycm9yOiAyNDAsIDEwMCwgMTAwO1xcclxcbiAgLS1uZXV0cmFsXzA6IDI1NSwgMjU1LCAyNTU7XFxyXFxuICAtLW5ldXRyYWxfMTogMjUwLCAyNTAsIDI1MDtcXHJcXG4gIC0tbmV1dHJhbF8yOiAyNDUsIDI0NSwgMjQ1O1xcclxcbiAgLS1uZXV0cmFsXzM6IDI0MCwgMjQwLCAyNDA7XFxyXFxuICAtLW5ldXRyYWxfNDogMjM1LCAyMzUsIDIzNTtcXHJcXG4gIC0tbmV1dHJhbF81OiAxMCwgMTAsIDEwO1xcclxcbiAgLS1uZXV0cmFsXzY6IDE1LCAxNSwgMTU7XFxyXFxuICAtLW5ldXRyYWxfNzogMjAsIDIwLCAyMDtcXHJcXG4gIC0tbmV1dHJhbF84OiAyNSwgMjUsIDI1O1xcclxcbiAgLS1uZXV0cmFsXzk6IDMwLCAzMCwgMzA7XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsImltcG9ydCB7IFBhdGhNYW5hZ2VyIH0gZnJvbSAnLi4vc2NyaXB0cy9wYXRoLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBUcmFuc2FjdGlvbnNNYW5hZ2VyIH0gZnJvbSAnLi90cmFuc2FjdGlvbnMtbWFuYWdlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogRGF0YWJhc2VNYW5hZ2VyO1xyXG5cclxuICAgIHByaXZhdGUgX3RyYW5zYWN0aW9uc01hbmFnZXI6IFRyYW5zYWN0aW9uc01hbmFnZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIFJPT1QgOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGZvbGRlciA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGZpbGVuYW1lIDogc3RyaW5nID0gXCJ0cmFuc2FjdGlvbnNcIjtcclxuICAgIHByaXZhdGUgZm9ybWF0IDogc3RyaW5nID0gXCJjc3ZcIjtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ST09UID0gUGF0aE1hbmFnZXIuR2V0SW5zdGFuY2UoKS5HZXRSb290KClcclxuXHJcbiAgICAgICAgdGhpcy5Jbml0aWFsaXplRGF0YWJhc2VzKClcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldEluc3RhbmNlKCkgOiBEYXRhYmFzZU1hbmFnZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbnN0YW5jZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IERhdGFiYXNlTWFuYWdlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBJbml0aWFsaXplRGF0YWJhc2VzKCl7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNhY3Rpb25zTWFuYWdlciA9IFRyYW5zYWN0aW9uc01hbmFnZXIuR2V0SW5zdGFuY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0VHJhbnNhY3Rpb25NYW5hZ2VyKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zYWN0aW9uc01hbmFnZXI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQWxwaW5lIGZyb20gXCJhbHBpbmVqc1wiO1xyXG5pbXBvcnQgeyBEYXRhYmFzZU1hbmFnZXIgfSBmcm9tIFwiLi9kYXRhYmFzZS1tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEZvcm1hdHRlciB9IGZyb20gXCIuLi9zY3JpcHRzL2Zvcm1hdHRlclwiO1xyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICAgICAgQWxwaW5lOiB0eXBlb2YgQWxwaW5lO1xyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuQWxwaW5lID0gQWxwaW5lO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xyXG4gICAgQWxwaW5lLnN0YXJ0KCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImFscGluZTppbml0XCIsICgpID0+IHtcclxuICAgIGluaXRpYWxpemVfc3RvcmVzKCk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZV9zdG9yZXMoKSB7XHJcbiAgICBBbHBpbmUuc3RvcmUoXCJUcmFuc2FjdGlvbnNNYW5hZ2VyXCIsIERhdGFiYXNlTWFuYWdlci5HZXRJbnN0YW5jZSgpLkdldFRyYW5zYWN0aW9uTWFuYWdlcigpKTtcclxuICAgIEFscGluZS5zdG9yZShcIkZvcm1hdHRlclwiLCBGb3JtYXR0ZXIpO1xyXG59IiwiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBJQ3JlYXRlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pY3JlYXRlJztcclxuaW1wb3J0IHsgSVJlYWQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lyZWFkJztcclxuaW1wb3J0IHsgSVVwZGF0ZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvaXVwZGF0ZSc7XHJcbmltcG9ydCB7IElEZWxldGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lkZWxldGUnO1xyXG5pbXBvcnQgeyBUcmFuc2FjdGlvbiB9IGZyb20gJy4uL21vZGVscy90cmFuc2FjdGlvbic7XHJcbmltcG9ydCB7IFBhdGhNYW5hZ2VyIH0gZnJvbSAnLi4vc2NyaXB0cy9wYXRoLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gXCJjc3YtcGFyc2Uvc3luY1wiO1xyXG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tIFwiY3N2LXN0cmluZ2lmeS9zeW5jXCI7XHJcbmltcG9ydCB7IFRyYW5zYWN0aW9uVHlwZSB9IGZyb20gXCIuLi9lbnVtcy90cmFuc2FjdGlvbi10eXBlXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zYWN0aW9uc01hbmFnZXIgaW1wbGVtZW50cyBJUmVhZCwgSVVwZGF0ZSwgSURlbGV0ZSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFRyYW5zYWN0aW9uc01hbmFnZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfdHJhbnNhY3Rpb25zOiBUcmFuc2FjdGlvbltdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBST09UIDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBmb2xkZXIgOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBmaWxlbmFtZSA6IHN0cmluZyA9IFwidHJhbnNhY3Rpb25zXCI7XHJcbiAgICBwcml2YXRlIGZvcm1hdCA6IHN0cmluZyA9IFwiY3N2XCI7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuUk9PVCA9IFBhdGhNYW5hZ2VyLkdldEluc3RhbmNlKCkuR2V0Um9vdCgpO1xyXG5cclxuICAgICAgICB0aGlzLlJlYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldEluc3RhbmNlKCkgOiBUcmFuc2FjdGlvbnNNYW5hZ2VyIHtcclxuICAgICAgICBpZiAodGhpcy5faW5zdGFuY2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBUcmFuc2FjdGlvbnNNYW5hZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3JlYXRlKFxyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICB0eXBlOiBzdHJpbmcsXHJcbiAgICAgICAgYWdlbnQ6IHN0cmluZyxcclxuICAgICAgICBkYXRlOiBzdHJpbmcsXHJcbiAgICAgICAgcmVmZXJlbmNlRGF0ZTogc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcclxuICAgICAgICBkZXRhaWxzPzogc3RyaW5nKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGZpbGUgPSBwYXRoLmpvaW4odGhpcy5ST09ULCBcImRhdGFiYXNlXCIsIFwidHJhbnNhY3Rpb25zLmNzdlwiKVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcHJvY2Vzc2luZyBDU1YgZmlsZTogZmlsZSBkb2VzIG5vdCBleGlzdHMuJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGUsICd1dGYtOCcpO1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmRzID0gcGFyc2UoZmlsZUNvbnRlbnQsIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3SWQgPSByZWNvcmRzLmxlbmd0aCA+IDAgPyBNYXRoLm1heCguLi5yZWNvcmRzLm1hcCgocjogYW55KSA9PiBwYXJzZUludChyLmlkKSkpICsgMSA6IDE7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RGF0ZVRpY2tzID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uRGF0ZVRpY2tzID0gbmV3IERhdGUoZGF0ZSkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2VEYXRlVGlja3MgPSBuZXcgRGF0ZShyZWZlcmVuY2VEYXRlKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBsZXQgZGV0YWlsc1BhdGg6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgLy8gaWYgKHRyYW5zYWN0aW9uRGF0YS5kZXRhaWxzICYmIGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHRoaXMuUk9PVCwgdHJhbnNhY3Rpb25EYXRhLmRldGFpbHMpKSkge1xyXG4gICAgICAgICAgICAvLyAgICAgZGV0YWlsc1BhdGggPSB0cmFuc2FjdGlvbkRhdGEuZGV0YWlscztcclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRyYW5zYWN0aW9uVHlwZSA9IFRyYW5zYWN0aW9uVHlwZS5FbnRyeVxyXG4gICAgICAgICAgICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYodHlwZSA9PSBcImVudHJ5XCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uVHlwZSA9IFRyYW5zYWN0aW9uVHlwZS5FbnRyeTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodHlwZSA9PSBcImV4aXRcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25UeXBlID0gVHJhbnNhY3Rpb25UeXBlLkV4aXQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgdHJhbnNhY3Rpb24gdHlwZS4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHByb2Nlc3NpbmcgQ1NWIGZpbGUgdHJhbnNhY3Rpb24gdHlwZTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgbmV3SWQsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZVRpY2tzLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudERhdGVUaWNrcyxcclxuICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uVHlwZSxcclxuICAgICAgICAgICAgICAgIGFnZW50LFxyXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25EYXRlVGlja3MsXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VEYXRlVGlja3MsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgICAgICAgIGRldGFpbHMgfHwgXCJcIixcclxuICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb25QbGFpbiA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiBuZXdJZCxcclxuICAgICAgICAgICAgICAgIGNyZWF0aW9uRGF0ZTogY3VycmVudERhdGVUaWNrcyxcclxuICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZERhdGU6IGN1cnJlbnREYXRlVGlja3MsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgICAgIGFnZW50OiBhZ2VudCxcclxuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uRGF0ZTogdHJhbnNhY3Rpb25EYXRlVGlja3MsXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VEYXRlOiByZWZlcmVuY2VEYXRlVGlja3MsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzOiBkZXRhaWxzIHx8IFwiXCIsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2FjdGlvbnMucHVzaCh0cmFuc2FjdGlvbik7XHJcbiAgICAgICAgICAgIHJlY29yZHMucHVzaCh0cmFuc2FjdGlvblBsYWluKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRDU1YgPSBzdHJpbmdpZnkocmVjb3JkcywgeyBoZWFkZXI6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgdXBkYXRlZENTViwgJ3V0Zi04Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIENTViBmaWxlOicsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJlYWQoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IHBhdGguam9pbih0aGlzLlJPT1QsIFwiZGF0YWJhc2VcIiwgXCJ0cmFuc2FjdGlvbnMuY3N2XCIpXHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZGVyID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIiwgXCJjcmVhdGlvbkRhdGVcIiwgXCJsYXN0TW9kaWZpZWREYXRlXCIsIFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCIsIFwidHlwZVwiLCBcImFnZW50XCIsIFwidHJhbnNhY3Rpb25EYXRlXCIsIFwicmVmZXJlbmNlRGF0ZVwiLCBcclxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCIsIFwibmFtZVwiLCBcImRldGFpbHNcIlxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdDU1YgPSBzdHJpbmdpZnkoW10sIHsgaGVhZGVyOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlLCBuZXdDU1YsICd1dGYtOCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgJ3V0Zi04Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZHMgPSBwYXJzZShmaWxlQ29udGVudCwge1xyXG4gICAgICAgICAgICAgICAgY29sdW1uczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNraXBfZW1wdHlfbGluZXM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlY29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZHNbaV0uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocmVjb3Jkc1tpXS5jcmVhdGlvbkRhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHJlY29yZHNbaV0ubGFzdE1vZGlmaWVkRGF0ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjb3Jkc1tpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZHNbaV0uZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjb3Jkc1tpXS50eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZHNbaV0uYWdlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocmVjb3Jkc1tpXS50cmFuc2FjdGlvbkRhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHJlY29yZHNbaV0ucmVmZXJlbmNlRGF0ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChyZWNvcmRzW2ldLnZhbHVlKSxcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmRzW2ldLmRldGFpbHMgfHwgXCJcIixcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RyYW5zYWN0aW9ucy5wdXNoKHRyYW5zYWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRyYW5zYWN0aW9uKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlYWRpbmcgQ1NWIGZpbGU6JywgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVXBkYXRlKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERlbGV0ZSgpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRUcmFuc2FjdGlvbnMoKTogVHJhbnNhY3Rpb25bXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zYWN0aW9ucztcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIFRyYW5zYWN0aW9uVHlwZSB7XHJcbiAgICBFbnRyeSxcclxuICAgIEV4aXQsXHJcbn0iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgRW50aXR5IHtcclxuICAgIHByb3RlY3RlZCBfaWQ6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBfY3JlYXRpb25EYXRlOiBOdW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgX2xhc3RNb2RpZmllZDogTnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgX2Rlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBjcmVhdGlvbkRhdGU6IE51bWJlciwgbGFzdE1vZGlmaWVkOiBOdW1iZXIsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9jcmVhdGlvbkRhdGUgPSBjcmVhdGlvbkRhdGU7XHJcbiAgICAgICAgdGhpcy5fbGFzdE1vZGlmaWVkID0gbGFzdE1vZGlmaWVkO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldEluZm8oKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5faWQsXHJcbiAgICAgICAgICAgIGNyZWF0aW9uRGF0ZTogdGhpcy5fY3JlYXRpb25EYXRlLFxyXG4gICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IHRoaXMuX2xhc3RNb2RpZmllZCxcclxuICAgICAgICAgICAgbmFtZTogdGhpcy5fbmFtZSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuX2Rlc2NyaXB0aW9uXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRyYW5zYWN0aW9uVHlwZSB9IGZyb20gXCIuLi9lbnVtcy90cmFuc2FjdGlvbi10eXBlXCI7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zYWN0aW9uIGV4dGVuZHMgRW50aXR5IHtcclxuICAgIHByaXZhdGUgX3R5cGU6IFRyYW5zYWN0aW9uVHlwZTtcclxuICAgIHByaXZhdGUgX2FnZW50OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF90cmFuc2FjdGlvbkRhdGU6IE51bWJlcjtcclxuICAgIHByaXZhdGUgX3JlZmVyZW5jZURhdGU6IE51bWJlcjtcclxuICAgIHByaXZhdGUgX3ZhbHVlOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9kZXRhaWxzOiBzdHJpbmcgfCBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBjcmVhdGlvbkRhdGU6IE51bWJlciwgbGFzdE1vZGlmaWVkOiBOdW1iZXIsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgdHlwZTogVHJhbnNhY3Rpb25UeXBlLCBhZ2VudDogc3RyaW5nLCB0cmFuc2FjdGlvbkRhdGU6IE51bWJlciwgcmVmZXJlbmNlRGF0ZTogTnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBkZXRhaWxzOiBzdHJpbmcgfCBudWxsKXtcclxuICAgIFx0c3VwZXIoaWQsIGNyZWF0aW9uRGF0ZSwgbGFzdE1vZGlmaWVkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuX2FnZW50ID0gYWdlbnQ7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNhY3Rpb25EYXRlID0gdHJhbnNhY3Rpb25EYXRlO1xyXG4gICAgICAgIHRoaXMuX3JlZmVyZW5jZURhdGUgPSByZWZlcmVuY2VEYXRlO1xyXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fZGV0YWlscyA9IGRldGFpbHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldEluZm8oKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5zdXBlci5HZXRJbmZvKCksXHJcblxyXG4gICAgICAgICAgICB0eXBlOiB0aGlzLl90eXBlLFxyXG4gICAgICAgICAgICBhZ2VudDogdGhpcy5fYWdlbnQsXHJcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uRGF0ZTogdGhpcy5fdHJhbnNhY3Rpb25EYXRlLFxyXG4gICAgICAgICAgICByZWZlcmVuY2VEYXRlOiB0aGlzLl9yZWZlcmVuY2VEYXRlLFxyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5fdmFsdWUsXHJcbiAgICAgICAgICAgIGRldGFpbHM6IHRoaXMuX2RldGFpbHMsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBGb3JtYXR0ZXIge1xyXG4gICAgcHVibGljIHN0YXRpYyBNaWxpc2Vjb25kc1RvRGF0ZVN0cmluZyhtaWxpc2Vjb25kcyA6IG51bWJlcikgOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUobWlsaXNlY29uZHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoJ3B0LUJSJywge1xyXG4gICAgICAgICAgICAgICAgZGF5OiAnMi1kaWdpdCcsXHJcbiAgICAgICAgICAgICAgICBtb250aDogJzItZGlnaXQnLFxyXG4gICAgICAgICAgICAgICAgeWVhcjogJ251bWVyaWMnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgTnVtYmVyVG9Nb25ldGFyeVN0cmluZyh2YWx1ZSA6IG51bWJlcikgOiBzdHJpbmcge1xyXG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGBJbnZhbGlkIHZhbHVlYFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGBSJCAke3ZhbHVlLnRvRml4ZWQoMikucmVwbGFjZSgnLicsICcsJyl9YDtcclxuICAgIH1cclxufSIsImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGF0aE1hbmFnZXJ7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFBhdGhNYW5hZ2VyO1xyXG5cclxuICAgIHByaXZhdGUgUk9PVCA6IHN0cmluZztcclxuICAgICBcclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLlJPT1QgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLlJPT1QpXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRJbnN0YW5jZSgpIDogUGF0aE1hbmFnZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbnN0YW5jZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IFBhdGhNYW5hZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0Um9vdCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLlJPT1Q7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIENyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgUmVhZCgpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgXCIuL3N0eWxlcy9pbmRleC5jc3NcIjtcbmltcG9ydCBcIi4uL2NvbnRyb2xsZXJzL3N0b3JlXCJcblxuYXN5bmMgZnVuY3Rpb24gbG9hZENvbXBvbmVudChmaWxlUGF0aDogc3RyaW5nLCB0YXJnZXRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChmaWxlUGF0aCk7XG4gICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRJZCkhLmlubmVySFRNTCA9IGh0bWxDb250ZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGxvYWQgJHtmaWxlUGF0aH06YCwgcmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBsb2FkaW5nICR7ZmlsZVBhdGh9OmAsIGVycm9yKTtcbiAgICB9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgbG9hZENvbXBvbmVudCgnLi4vdmlld3MvaGVhZGVyLmh0bWwnLCAnaGVhZGVyLWNvbnRhaW5lcicpO1xuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS10aGVtZScsICdjdXN0b21fbGlnaHQnKTtcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBDc3ZFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoY29kZSwgbWVzc2FnZSwgb3B0aW9ucywgLi4uY29udGV4dHMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShtZXNzYWdlKSkgbWVzc2FnZSA9IG1lc3NhZ2Uuam9pbihcIiBcIikudHJpbSgpO1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDc3ZFcnJvcik7XG4gICAgfVxuICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgZm9yIChjb25zdCBjb250ZXh0IG9mIGNvbnRleHRzKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dFtrZXldO1xuICAgICAgICB0aGlzW2tleV0gPSBCdWZmZXIuaXNCdWZmZXIodmFsdWUpXG4gICAgICAgICAgPyB2YWx1ZS50b1N0cmluZyhvcHRpb25zLmVuY29kaW5nKVxuICAgICAgICAgIDogdmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyB2YWx1ZVxuICAgICAgICAgICAgOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGlzX29iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgb2JqICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KG9iaik7XG59O1xuXG5jb25zdCBub3JtYWxpemVfY29sdW1uc19hcnJheSA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRDb2x1bW5zID0gW107XG4gIGZvciAobGV0IGkgPSAwLCBsID0gY29sdW1ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBjb2x1bW4gPSBjb2x1bW5zW2ldO1xuICAgIGlmIChjb2x1bW4gPT09IHVuZGVmaW5lZCB8fCBjb2x1bW4gPT09IG51bGwgfHwgY29sdW1uID09PSBmYWxzZSkge1xuICAgICAgbm9ybWFsaXplZENvbHVtbnNbaV0gPSB7IGRpc2FibGVkOiB0cnVlIH07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29sdW1uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBub3JtYWxpemVkQ29sdW1uc1tpXSA9IHsgbmFtZTogY29sdW1uIH07XG4gICAgfSBlbHNlIGlmIChpc19vYmplY3QoY29sdW1uKSkge1xuICAgICAgaWYgKHR5cGVvZiBjb2x1bW4ubmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXCJDU1ZfT1BUSU9OX0NPTFVNTlNfTUlTU0lOR19OQU1FXCIsIFtcbiAgICAgICAgICBcIk9wdGlvbiBjb2x1bW5zIG1pc3NpbmcgbmFtZTpcIixcbiAgICAgICAgICBgcHJvcGVydHkgXCJuYW1lXCIgaXMgcmVxdWlyZWQgYXQgcG9zaXRpb24gJHtpfWAsXG4gICAgICAgICAgXCJ3aGVuIGNvbHVtbiBpcyBhbiBvYmplY3QgbGl0ZXJhbFwiLFxuICAgICAgICBdKTtcbiAgICAgIH1cbiAgICAgIG5vcm1hbGl6ZWRDb2x1bW5zW2ldID0gY29sdW1uO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXCJDU1ZfSU5WQUxJRF9DT0xVTU5fREVGSU5JVElPTlwiLCBbXG4gICAgICAgIFwiSW52YWxpZCBjb2x1bW4gZGVmaW5pdGlvbjpcIixcbiAgICAgICAgXCJleHBlY3QgYSBzdHJpbmcgb3IgYSBsaXRlcmFsIG9iamVjdCxcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KGNvbHVtbil9IGF0IHBvc2l0aW9uICR7aX1gLFxuICAgICAgXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBub3JtYWxpemVkQ29sdW1ucztcbn07XG5cbmNsYXNzIFJlc2l6ZWFibGVCdWZmZXIge1xuICBjb25zdHJ1Y3RvcihzaXplID0gMTAwKSB7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5idWYgPSBCdWZmZXIuYWxsb2NVbnNhZmUoc2l6ZSk7XG4gIH1cbiAgcHJlcGVuZCh2YWwpIHtcbiAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoICsgdmFsLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPj0gdGhpcy5zaXplKSB7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICAgIGlmIChsZW5ndGggPj0gdGhpcy5zaXplKSB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoXCJJTlZBTElEX0JVRkZFUl9TVEFURVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgYnVmID0gdGhpcy5idWY7XG4gICAgICB0aGlzLmJ1ZiA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSh0aGlzLnNpemUpO1xuICAgICAgdmFsLmNvcHkodGhpcy5idWYsIDApO1xuICAgICAgYnVmLmNvcHkodGhpcy5idWYsIHZhbC5sZW5ndGgpO1xuICAgICAgdGhpcy5sZW5ndGggKz0gdmFsLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGgrKztcbiAgICAgIGlmIChsZW5ndGggPT09IHRoaXMuc2l6ZSkge1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgICAgfVxuICAgICAgY29uc3QgYnVmID0gdGhpcy5jbG9uZSgpO1xuICAgICAgdGhpcy5idWZbMF0gPSB2YWw7XG4gICAgICBidWYuY29weSh0aGlzLmJ1ZiwgMSwgMCwgbGVuZ3RoKTtcbiAgICB9XG4gIH1cbiAgYXBwZW5kKHZhbCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoKys7XG4gICAgaWYgKGxlbmd0aCA9PT0gdGhpcy5zaXplKSB7XG4gICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cbiAgICB0aGlzLmJ1ZltsZW5ndGhdID0gdmFsO1xuICB9XG4gIGNsb25lKCkge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh0aGlzLmJ1Zi5zbGljZSgwLCB0aGlzLmxlbmd0aCkpO1xuICB9XG4gIHJlc2l6ZSgpIHtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICB0aGlzLnNpemUgPSB0aGlzLnNpemUgKiAyO1xuICAgIGNvbnN0IGJ1ZiA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSh0aGlzLnNpemUpO1xuICAgIHRoaXMuYnVmLmNvcHkoYnVmLCAwLCAwLCBsZW5ndGgpO1xuICAgIHRoaXMuYnVmID0gYnVmO1xuICB9XG4gIHRvU3RyaW5nKGVuY29kaW5nKSB7XG4gICAgaWYgKGVuY29kaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5idWYuc2xpY2UoMCwgdGhpcy5sZW5ndGgpLnRvU3RyaW5nKGVuY29kaW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5idWYuc2xpY2UoMCwgdGhpcy5sZW5ndGgpKTtcbiAgICB9XG4gIH1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKFwidXRmOFwiKTtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDA7XG4gIH1cbn1cblxuLy8gd2hpdGUgc3BhY2UgY2hhcmFjdGVyc1xuLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvV2hpdGVzcGFjZV9jaGFyYWN0ZXJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvR3VpZGUvUmVndWxhcl9FeHByZXNzaW9ucy9DaGFyYWN0ZXJfQ2xhc3NlcyNUeXBlc1xuLy8gXFxmXFxuXFxyXFx0XFx2XFx1MDBhMFxcdTE2ODBcXHUyMDAwLVxcdTIwMGFcXHUyMDI4XFx1MjAyOVxcdTIwMmZcXHUyMDVmXFx1MzAwMFxcdWZlZmZcbmNvbnN0IG5wID0gMTI7XG5jb25zdCBjciQxID0gMTM7IC8vIGBcXHJgLCBjYXJyaWFnZSByZXR1cm4sIDB4MEQgaW4gaGV4YWTDqWNpbWFsLCAxMyBpbiBkZWNpbWFsXG5jb25zdCBubCQxID0gMTA7IC8vIGBcXG5gLCBuZXdsaW5lLCAweDBBIGluIGhleGFkZWNpbWFsLCAxMCBpbiBkZWNpbWFsXG5jb25zdCBzcGFjZSA9IDMyO1xuY29uc3QgdGFiID0gOTtcblxuY29uc3QgaW5pdF9zdGF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHJldHVybiB7XG4gICAgYm9tU2tpcHBlZDogZmFsc2UsXG4gICAgYnVmQnl0ZXNTdGFydDogMCxcbiAgICBjYXN0RmllbGQ6IG9wdGlvbnMuY2FzdF9mdW5jdGlvbixcbiAgICBjb21tZW50aW5nOiBmYWxzZSxcbiAgICAvLyBDdXJyZW50IGVycm9yIGVuY291bnRlcmVkIGJ5IGEgcmVjb3JkXG4gICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICBlbmFibGVkOiBvcHRpb25zLmZyb21fbGluZSA9PT0gMSxcbiAgICBlc2NhcGluZzogZmFsc2UsXG4gICAgZXNjYXBlSXNRdW90ZTpcbiAgICAgIEJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLmVzY2FwZSkgJiZcbiAgICAgIEJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLnF1b3RlKSAmJlxuICAgICAgQnVmZmVyLmNvbXBhcmUob3B0aW9ucy5lc2NhcGUsIG9wdGlvbnMucXVvdGUpID09PSAwLFxuICAgIC8vIGNvbHVtbnMgY2FuIGJlIGBmYWxzZWAsIGB0cnVlYCwgYEFycmF5YFxuICAgIGV4cGVjdGVkUmVjb3JkTGVuZ3RoOiBBcnJheS5pc0FycmF5KG9wdGlvbnMuY29sdW1ucylcbiAgICAgID8gb3B0aW9ucy5jb2x1bW5zLmxlbmd0aFxuICAgICAgOiB1bmRlZmluZWQsXG4gICAgZmllbGQ6IG5ldyBSZXNpemVhYmxlQnVmZmVyKDIwKSxcbiAgICBmaXJzdExpbmVUb0hlYWRlcnM6IG9wdGlvbnMuY2FzdF9maXJzdF9saW5lX3RvX2hlYWRlcixcbiAgICBuZWVkTW9yZURhdGFTaXplOiBNYXRoLm1heChcbiAgICAgIC8vIFNraXAgaWYgdGhlIHJlbWFpbmluZyBidWZmZXIgc21hbGxlciB0aGFuIGNvbW1lbnRcbiAgICAgIG9wdGlvbnMuY29tbWVudCAhPT0gbnVsbCA/IG9wdGlvbnMuY29tbWVudC5sZW5ndGggOiAwLFxuICAgICAgLy8gU2tpcCBpZiB0aGUgcmVtYWluaW5nIGJ1ZmZlciBjYW4gYmUgZGVsaW1pdGVyXG4gICAgICAuLi5vcHRpb25zLmRlbGltaXRlci5tYXAoKGRlbGltaXRlcikgPT4gZGVsaW1pdGVyLmxlbmd0aCksXG4gICAgICAvLyBTa2lwIGlmIHRoZSByZW1haW5pbmcgYnVmZmVyIGNhbiBiZSBlc2NhcGUgc2VxdWVuY2VcbiAgICAgIG9wdGlvbnMucXVvdGUgIT09IG51bGwgPyBvcHRpb25zLnF1b3RlLmxlbmd0aCA6IDAsXG4gICAgKSxcbiAgICBwcmV2aW91c0J1ZjogdW5kZWZpbmVkLFxuICAgIHF1b3Rpbmc6IGZhbHNlLFxuICAgIHN0b3A6IGZhbHNlLFxuICAgIHJhd0J1ZmZlcjogbmV3IFJlc2l6ZWFibGVCdWZmZXIoMTAwKSxcbiAgICByZWNvcmQ6IFtdLFxuICAgIHJlY29yZEhhc0Vycm9yOiBmYWxzZSxcbiAgICByZWNvcmRfbGVuZ3RoOiAwLFxuICAgIHJlY29yZERlbGltaXRlck1heExlbmd0aDpcbiAgICAgIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlci5sZW5ndGggPT09IDBcbiAgICAgICAgPyAwXG4gICAgICAgIDogTWF0aC5tYXgoLi4ub3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyLm1hcCgodikgPT4gdi5sZW5ndGgpKSxcbiAgICB0cmltQ2hhcnM6IFtcbiAgICAgIEJ1ZmZlci5mcm9tKFwiIFwiLCBvcHRpb25zLmVuY29kaW5nKVswXSxcbiAgICAgIEJ1ZmZlci5mcm9tKFwiXFx0XCIsIG9wdGlvbnMuZW5jb2RpbmcpWzBdLFxuICAgIF0sXG4gICAgd2FzUXVvdGluZzogZmFsc2UsXG4gICAgd2FzUm93RGVsaW1pdGVyOiBmYWxzZSxcbiAgICB0aW1jaGFyczogW1xuICAgICAgQnVmZmVyLmZyb20oQnVmZmVyLmZyb20oW2NyJDFdLCBcInV0ZjhcIikudG9TdHJpbmcoKSwgb3B0aW9ucy5lbmNvZGluZyksXG4gICAgICBCdWZmZXIuZnJvbShCdWZmZXIuZnJvbShbbmwkMV0sIFwidXRmOFwiKS50b1N0cmluZygpLCBvcHRpb25zLmVuY29kaW5nKSxcbiAgICAgIEJ1ZmZlci5mcm9tKEJ1ZmZlci5mcm9tKFtucF0sIFwidXRmOFwiKS50b1N0cmluZygpLCBvcHRpb25zLmVuY29kaW5nKSxcbiAgICAgIEJ1ZmZlci5mcm9tKEJ1ZmZlci5mcm9tKFtzcGFjZV0sIFwidXRmOFwiKS50b1N0cmluZygpLCBvcHRpb25zLmVuY29kaW5nKSxcbiAgICAgIEJ1ZmZlci5mcm9tKEJ1ZmZlci5mcm9tKFt0YWJdLCBcInV0ZjhcIikudG9TdHJpbmcoKSwgb3B0aW9ucy5lbmNvZGluZyksXG4gICAgXSxcbiAgfTtcbn07XG5cbmNvbnN0IHVuZGVyc2NvcmUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoXywgbWF0Y2gpIHtcbiAgICByZXR1cm4gXCJfXCIgKyBtYXRjaC50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn07XG5cbmNvbnN0IG5vcm1hbGl6ZV9vcHRpb25zID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuICAvLyBNZXJnZSB3aXRoIHVzZXIgb3B0aW9uc1xuICBmb3IgKGNvbnN0IG9wdCBpbiBvcHRzKSB7XG4gICAgb3B0aW9uc1t1bmRlcnNjb3JlKG9wdCldID0gb3B0c1tvcHRdO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGVuY29kaW5nYFxuICAvLyBOb3RlOiBkZWZpbmVkIGZpcnN0IGJlY2F1c2Ugb3RoZXIgb3B0aW9ucyBkZXBlbmRzIG9uIGl0XG4gIC8vIHRvIGNvbnZlcnQgY2hhcnMvc3RyaW5ncyBpbnRvIGJ1ZmZlcnMuXG4gIGlmIChvcHRpb25zLmVuY29kaW5nID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5lbmNvZGluZyA9PT0gdHJ1ZSkge1xuICAgIG9wdGlvbnMuZW5jb2RpbmcgPSBcInV0ZjhcIjtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmVuY29kaW5nID09PSBudWxsIHx8IG9wdGlvbnMuZW5jb2RpbmcgPT09IGZhbHNlKSB7XG4gICAgb3B0aW9ucy5lbmNvZGluZyA9IG51bGw7XG4gIH0gZWxzZSBpZiAoXG4gICAgdHlwZW9mIG9wdGlvbnMuZW5jb2RpbmcgIT09IFwic3RyaW5nXCIgJiZcbiAgICBvcHRpb25zLmVuY29kaW5nICE9PSBudWxsXG4gICkge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX0VOQ09ESU5HXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gZW5jb2Rpbmc6XCIsXG4gICAgICAgIFwiZW5jb2RpbmcgbXVzdCBiZSBhIHN0cmluZyBvciBudWxsIHRvIHJldHVybiBhIGJ1ZmZlcixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuZW5jb2RpbmcpfWAsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGJvbWBcbiAgaWYgKFxuICAgIG9wdGlvbnMuYm9tID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmJvbSA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMuYm9tID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLmJvbSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuYm9tICE9PSB0cnVlKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fQk9NXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gYm9tOlwiLFxuICAgICAgICBcImJvbSBtdXN0IGJlIHRydWUsXCIsXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmJvbSl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY2FzdGBcbiAgb3B0aW9ucy5jYXN0X2Z1bmN0aW9uID0gbnVsbDtcbiAgaWYgKFxuICAgIG9wdGlvbnMuY2FzdCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5jYXN0ID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5jYXN0ID09PSBmYWxzZSB8fFxuICAgIG9wdGlvbnMuY2FzdCA9PT0gXCJcIlxuICApIHtcbiAgICBvcHRpb25zLmNhc3QgPSB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuY2FzdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgb3B0aW9ucy5jYXN0X2Z1bmN0aW9uID0gb3B0aW9ucy5jYXN0O1xuICAgIG9wdGlvbnMuY2FzdCA9IHRydWU7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5jYXN0ICE9PSB0cnVlKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fQ0FTVFwiLFxuICAgICAgW1xuICAgICAgICBcIkludmFsaWQgb3B0aW9uIGNhc3Q6XCIsXG4gICAgICAgIFwiY2FzdCBtdXN0IGJlIHRydWUgb3IgYSBmdW5jdGlvbixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuY2FzdCl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY2FzdF9kYXRlYFxuICBpZiAoXG4gICAgb3B0aW9ucy5jYXN0X2RhdGUgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuY2FzdF9kYXRlID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5jYXN0X2RhdGUgPT09IGZhbHNlIHx8XG4gICAgb3B0aW9ucy5jYXN0X2RhdGUgPT09IFwiXCJcbiAgKSB7XG4gICAgb3B0aW9ucy5jYXN0X2RhdGUgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmNhc3RfZGF0ZSA9PT0gdHJ1ZSkge1xuICAgIG9wdGlvbnMuY2FzdF9kYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBjb25zdCBkYXRlID0gRGF0ZS5wYXJzZSh2YWx1ZSk7XG4gICAgICByZXR1cm4gIWlzTmFOKGRhdGUpID8gbmV3IERhdGUoZGF0ZSkgOiB2YWx1ZTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmNhc3RfZGF0ZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fQ0FTVF9EQVRFXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gY2FzdF9kYXRlOlwiLFxuICAgICAgICBcImNhc3RfZGF0ZSBtdXN0IGJlIHRydWUgb3IgYSBmdW5jdGlvbixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuY2FzdF9kYXRlKX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBjb2x1bW5zYFxuICBvcHRpb25zLmNhc3RfZmlyc3RfbGluZV90b19oZWFkZXIgPSBudWxsO1xuICBpZiAob3B0aW9ucy5jb2x1bW5zID09PSB0cnVlKSB7XG4gICAgLy8gRmllbGRzIGluIHRoZSBmaXJzdCBsaW5lIGFyZSBjb252ZXJ0ZWQgYXMtaXMgdG8gY29sdW1uc1xuICAgIG9wdGlvbnMuY2FzdF9maXJzdF9saW5lX3RvX2hlYWRlciA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5jb2x1bW5zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBvcHRpb25zLmNhc3RfZmlyc3RfbGluZV90b19oZWFkZXIgPSBvcHRpb25zLmNvbHVtbnM7XG4gICAgb3B0aW9ucy5jb2x1bW5zID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMuY29sdW1ucykpIHtcbiAgICBvcHRpb25zLmNvbHVtbnMgPSBub3JtYWxpemVfY29sdW1uc19hcnJheShvcHRpb25zLmNvbHVtbnMpO1xuICB9IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMuY29sdW1ucyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5jb2x1bW5zID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5jb2x1bW5zID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLmNvbHVtbnMgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9DT0xVTU5TXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gY29sdW1uczpcIixcbiAgICAgICAgXCJleHBlY3QgYW4gYXJyYXksIGEgZnVuY3Rpb24gb3IgdHJ1ZSxcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuY29sdW1ucyl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZ3JvdXBfY29sdW1uc19ieV9uYW1lYFxuICBpZiAoXG4gICAgb3B0aW9ucy5ncm91cF9jb2x1bW5zX2J5X25hbWUgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuZ3JvdXBfY29sdW1uc19ieV9uYW1lID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5ncm91cF9jb2x1bW5zX2J5X25hbWUgPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMuZ3JvdXBfY29sdW1uc19ieV9uYW1lID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5ncm91cF9jb2x1bW5zX2J5X25hbWUgIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9HUk9VUF9DT0xVTU5TX0JZX05BTUVcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBncm91cF9jb2x1bW5zX2J5X25hbWU6XCIsXG4gICAgICAgIFwiZXhwZWN0IGFuIGJvb2xlYW4sXCIsXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmdyb3VwX2NvbHVtbnNfYnlfbmFtZSl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5jb2x1bW5zID09PSBmYWxzZSkge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX0dST1VQX0NPTFVNTlNfQllfTkFNRVwiLFxuICAgICAgW1xuICAgICAgICBcIkludmFsaWQgb3B0aW9uIGdyb3VwX2NvbHVtbnNfYnlfbmFtZTpcIixcbiAgICAgICAgXCJ0aGUgYGNvbHVtbnNgIG1vZGUgbXVzdCBiZSBhY3RpdmF0ZWQuXCIsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGNvbW1lbnRgXG4gIGlmIChcbiAgICBvcHRpb25zLmNvbW1lbnQgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuY29tbWVudCA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMuY29tbWVudCA9PT0gZmFsc2UgfHxcbiAgICBvcHRpb25zLmNvbW1lbnQgPT09IFwiXCJcbiAgKSB7XG4gICAgb3B0aW9ucy5jb21tZW50ID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY29tbWVudCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgb3B0aW9ucy5jb21tZW50ID0gQnVmZmVyLmZyb20ob3B0aW9ucy5jb21tZW50LCBvcHRpb25zLmVuY29kaW5nKTtcbiAgICB9XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIob3B0aW9ucy5jb21tZW50KSkge1xuICAgICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9DT01NRU5UXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBcIkludmFsaWQgb3B0aW9uIGNvbW1lbnQ6XCIsXG4gICAgICAgICAgXCJjb21tZW50IG11c3QgYmUgYSBidWZmZXIgb3IgYSBzdHJpbmcsXCIsXG4gICAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuY29tbWVudCl9YCxcbiAgICAgICAgXSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGNvbW1lbnRfbm9faW5maXhgXG4gIGlmIChcbiAgICBvcHRpb25zLmNvbW1lbnRfbm9faW5maXggPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuY29tbWVudF9ub19pbmZpeCA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMuY29tbWVudF9ub19pbmZpeCA9PT0gZmFsc2VcbiAgKSB7XG4gICAgb3B0aW9ucy5jb21tZW50X25vX2luZml4ID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5jb21tZW50X25vX2luZml4ICE9PSB0cnVlKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fQ09NTUVOVFwiLFxuICAgICAgW1xuICAgICAgICBcIkludmFsaWQgb3B0aW9uIGNvbW1lbnRfbm9faW5maXg6XCIsXG4gICAgICAgIFwidmFsdWUgbXVzdCBiZSBhIGJvb2xlYW4sXCIsXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmNvbW1lbnRfbm9faW5maXgpfWAsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGRlbGltaXRlcmBcbiAgY29uc3QgZGVsaW1pdGVyX2pzb24gPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmRlbGltaXRlcik7XG4gIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLmRlbGltaXRlcikpXG4gICAgb3B0aW9ucy5kZWxpbWl0ZXIgPSBbb3B0aW9ucy5kZWxpbWl0ZXJdO1xuICBpZiAob3B0aW9ucy5kZWxpbWl0ZXIubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fREVMSU1JVEVSXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gZGVsaW1pdGVyOlwiLFxuICAgICAgICBcImRlbGltaXRlciBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZyBvciBidWZmZXIgb3IgYXJyYXkgb2Ygc3RyaW5nfGJ1ZmZlcixcIixcbiAgICAgICAgYGdvdCAke2RlbGltaXRlcl9qc29ufWAsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIG9wdGlvbnMuZGVsaW1pdGVyID0gb3B0aW9ucy5kZWxpbWl0ZXIubWFwKGZ1bmN0aW9uIChkZWxpbWl0ZXIpIHtcbiAgICBpZiAoZGVsaW1pdGVyID09PSB1bmRlZmluZWQgfHwgZGVsaW1pdGVyID09PSBudWxsIHx8IGRlbGltaXRlciA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShcIixcIiwgb3B0aW9ucy5lbmNvZGluZyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZGVsaW1pdGVyID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBkZWxpbWl0ZXIgPSBCdWZmZXIuZnJvbShkZWxpbWl0ZXIsIG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIH1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihkZWxpbWl0ZXIpIHx8IGRlbGltaXRlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fREVMSU1JVEVSXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBcIkludmFsaWQgb3B0aW9uIGRlbGltaXRlcjpcIixcbiAgICAgICAgICBcImRlbGltaXRlciBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZyBvciBidWZmZXIgb3IgYXJyYXkgb2Ygc3RyaW5nfGJ1ZmZlcixcIixcbiAgICAgICAgICBgZ290ICR7ZGVsaW1pdGVyX2pzb259YCxcbiAgICAgICAgXSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBkZWxpbWl0ZXI7XG4gIH0pO1xuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBlc2NhcGVgXG4gIGlmIChvcHRpb25zLmVzY2FwZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuZXNjYXBlID09PSB0cnVlKSB7XG4gICAgb3B0aW9ucy5lc2NhcGUgPSBCdWZmZXIuZnJvbSgnXCInLCBvcHRpb25zLmVuY29kaW5nKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5lc2NhcGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBvcHRpb25zLmVzY2FwZSA9IEJ1ZmZlci5mcm9tKG9wdGlvbnMuZXNjYXBlLCBvcHRpb25zLmVuY29kaW5nKTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmVzY2FwZSA9PT0gbnVsbCB8fCBvcHRpb25zLmVzY2FwZSA9PT0gZmFsc2UpIHtcbiAgICBvcHRpb25zLmVzY2FwZSA9IG51bGw7XG4gIH1cbiAgaWYgKG9wdGlvbnMuZXNjYXBlICE9PSBudWxsKSB7XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIob3B0aW9ucy5lc2NhcGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogZXNjYXBlIG11c3QgYmUgYSBidWZmZXIsIGEgc3RyaW5nIG9yIGEgYm9vbGVhbiwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5lc2NhcGUpfWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBmcm9tYFxuICBpZiAob3B0aW9ucy5mcm9tID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5mcm9tID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5mcm9tID0gMTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZnJvbSA9PT0gXCJzdHJpbmdcIiAmJiAvXFxkKy8udGVzdChvcHRpb25zLmZyb20pKSB7XG4gICAgICBvcHRpb25zLmZyb20gPSBwYXJzZUludChvcHRpb25zLmZyb20pO1xuICAgIH1cbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLmZyb20pKSB7XG4gICAgICBpZiAob3B0aW9ucy5mcm9tIDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgT3B0aW9uOiBmcm9tIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRzLmZyb20pfWAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEludmFsaWQgT3B0aW9uOiBmcm9tIG11c3QgYmUgYW4gaW50ZWdlciwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5mcm9tKX1gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZnJvbV9saW5lYFxuICBpZiAob3B0aW9ucy5mcm9tX2xpbmUgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmZyb21fbGluZSA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMuZnJvbV9saW5lID0gMTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2Ygb3B0aW9ucy5mcm9tX2xpbmUgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgIC9cXGQrLy50ZXN0KG9wdGlvbnMuZnJvbV9saW5lKVxuICAgICkge1xuICAgICAgb3B0aW9ucy5mcm9tX2xpbmUgPSBwYXJzZUludChvcHRpb25zLmZyb21fbGluZSk7XG4gICAgfVxuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMuZnJvbV9saW5lKSkge1xuICAgICAgaWYgKG9wdGlvbnMuZnJvbV9saW5lIDw9IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBJbnZhbGlkIE9wdGlvbjogZnJvbV9saW5lIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiAwLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRzLmZyb21fbGluZSl9YCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgSW52YWxpZCBPcHRpb246IGZyb21fbGluZSBtdXN0IGJlIGFuIGludGVnZXIsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdHMuZnJvbV9saW5lKX1gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbnMgYGlnbm9yZV9sYXN0X2RlbGltaXRlcnNgXG4gIGlmIChcbiAgICBvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9PT0gbnVsbFxuICApIHtcbiAgICBvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPSBmYWxzZTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pZ25vcmVfbGFzdF9kZWxpbWl0ZXJzID09PSBcIm51bWJlclwiKSB7XG4gICAgb3B0aW9ucy5pZ25vcmVfbGFzdF9kZWxpbWl0ZXJzID0gTWF0aC5mbG9vcihvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMpO1xuICAgIGlmIChvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPT09IDApIHtcbiAgICAgIG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9IGZhbHNlO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pZ25vcmVfbGFzdF9kZWxpbWl0ZXJzICE9PSBcImJvb2xlYW5cIikge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX0lHTk9SRV9MQVNUX0RFTElNSVRFUlNcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBgaWdub3JlX2xhc3RfZGVsaW1pdGVyc2A6XCIsXG4gICAgICAgIFwidGhlIHZhbHVlIG11c3QgYmUgYSBib29sZWFuIHZhbHVlIG9yIGFuIGludGVnZXIsXCIsXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMpfWAsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIGlmIChvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPT09IHRydWUgJiYgb3B0aW9ucy5jb2x1bW5zID09PSBmYWxzZSkge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lHTk9SRV9MQVNUX0RFTElNSVRFUlNfUkVRVUlSRVNfQ09MVU1OU1wiLFxuICAgICAgW1xuICAgICAgICBcIlRoZSBvcHRpb24gYGlnbm9yZV9sYXN0X2RlbGltaXRlcnNgXCIsXG4gICAgICAgIFwicmVxdWlyZXMgdGhlIGFjdGl2YXRpb24gb2YgdGhlIGBjb2x1bW5zYCBvcHRpb25cIixcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgaW5mb2BcbiAgaWYgKFxuICAgIG9wdGlvbnMuaW5mbyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5pbmZvID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5pbmZvID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLmluZm8gPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmluZm8gIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IGluZm8gbXVzdCBiZSB0cnVlLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmluZm8pfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBtYXhfcmVjb3JkX3NpemVgXG4gIGlmIChcbiAgICBvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5tYXhfcmVjb3JkX3NpemUgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSA9PT0gZmFsc2VcbiAgKSB7XG4gICAgb3B0aW9ucy5tYXhfcmVjb3JkX3NpemUgPSAwO1xuICB9IGVsc2UgaWYgKFxuICAgIE51bWJlci5pc0ludGVnZXIob3B0aW9ucy5tYXhfcmVjb3JkX3NpemUpICYmXG4gICAgb3B0aW9ucy5tYXhfcmVjb3JkX3NpemUgPj0gMFxuICApIDsgZWxzZSBpZiAoXG4gICAgdHlwZW9mIG9wdGlvbnMubWF4X3JlY29yZF9zaXplID09PSBcInN0cmluZ1wiICYmXG4gICAgL1xcZCsvLnRlc3Qob3B0aW9ucy5tYXhfcmVjb3JkX3NpemUpXG4gICkge1xuICAgIG9wdGlvbnMubWF4X3JlY29yZF9zaXplID0gcGFyc2VJbnQob3B0aW9ucy5tYXhfcmVjb3JkX3NpemUpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogbWF4X3JlY29yZF9zaXplIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYG9iam5hbWVgXG4gIGlmIChcbiAgICBvcHRpb25zLm9iam5hbWUgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMub2JqbmFtZSA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMub2JqbmFtZSA9PT0gZmFsc2VcbiAgKSB7XG4gICAgb3B0aW9ucy5vYmpuYW1lID0gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLm9iam5hbWUpKSB7XG4gICAgaWYgKG9wdGlvbnMub2JqbmFtZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBPcHRpb246IG9iam5hbWUgbXVzdCBiZSBhIG5vbiBlbXB0eSBidWZmZXJgKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuZW5jb2RpbmcgPT09IG51bGwpIDsgZWxzZSB7XG4gICAgICBvcHRpb25zLm9iam5hbWUgPSBvcHRpb25zLm9iam5hbWUudG9TdHJpbmcob3B0aW9ucy5lbmNvZGluZyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLm9iam5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAob3B0aW9ucy5vYmpuYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIE9wdGlvbjogb2JqbmFtZSBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZ2ApO1xuICAgIH1cbiAgICAvLyBHcmVhdCwgbm90aGluZyB0byBkb1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLm9iam5hbWUgPT09IFwibnVtYmVyXCIpIDsgZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiBvYmpuYW1lIG11c3QgYmUgYSBzdHJpbmcgb3IgYSBidWZmZXIsIGdvdCAke29wdGlvbnMub2JqbmFtZX1gLFxuICAgICk7XG4gIH1cbiAgaWYgKG9wdGlvbnMub2JqbmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLm9iam5hbWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGlmIChvcHRpb25zLmNvbHVtbnMgIT09IGZhbHNlKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIFwiSW52YWxpZCBPcHRpb246IG9iam5hbWUgaW5kZXggY2Fubm90IGJlIGNvbWJpbmVkIHdpdGggY29sdW1ucyBvciBiZSBkZWZpbmVkIGFzIGEgZmllbGRcIixcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQSBzdHJpbmcgb3IgYSBidWZmZXJcbiAgICAgIGlmIChvcHRpb25zLmNvbHVtbnMgPT09IGZhbHNlKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIFwiSW52YWxpZCBPcHRpb246IG9iam5hbWUgZmllbGQgbXVzdCBiZSBjb21iaW5lZCB3aXRoIGNvbHVtbnMgb3IgYmUgZGVmaW5lZCBhcyBhbiBpbmRleFwiLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBvbl9yZWNvcmRgXG4gIGlmIChvcHRpb25zLm9uX3JlY29yZCA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMub25fcmVjb3JkID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5vbl9yZWNvcmQgPSB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMub25fcmVjb3JkICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9PTl9SRUNPUkRcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBgb25fcmVjb3JkYDpcIixcbiAgICAgICAgXCJleHBlY3QgYSBmdW5jdGlvbixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMub25fcmVjb3JkKX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBvbl9za2lwYFxuICAvLyBvcHRpb25zLm9uX3NraXAgPz89IChlcnIsIGNodW5rKSA9PiB7XG4gIC8vICAgdGhpcy5lbWl0KCdza2lwJywgZXJyLCBjaHVuayk7XG4gIC8vIH07XG4gIGlmIChcbiAgICBvcHRpb25zLm9uX3NraXAgIT09IHVuZGVmaW5lZCAmJlxuICAgIG9wdGlvbnMub25fc2tpcCAhPT0gbnVsbCAmJlxuICAgIHR5cGVvZiBvcHRpb25zLm9uX3NraXAgIT09IFwiZnVuY3Rpb25cIlxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IG9uX3NraXAgbXVzdCBiZSBhIGZ1bmN0aW9uLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLm9uX3NraXApfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBxdW90ZWBcbiAgaWYgKFxuICAgIG9wdGlvbnMucXVvdGUgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLnF1b3RlID09PSBmYWxzZSB8fFxuICAgIG9wdGlvbnMucXVvdGUgPT09IFwiXCJcbiAgKSB7XG4gICAgb3B0aW9ucy5xdW90ZSA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9wdGlvbnMucXVvdGUgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnF1b3RlID0gQnVmZmVyLmZyb20oJ1wiJywgb3B0aW9ucy5lbmNvZGluZyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5xdW90ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgb3B0aW9ucy5xdW90ZSA9IEJ1ZmZlci5mcm9tKG9wdGlvbnMucXVvdGUsIG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIH1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLnF1b3RlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgSW52YWxpZCBPcHRpb246IHF1b3RlIG11c3QgYmUgYSBidWZmZXIgb3IgYSBzdHJpbmcsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucXVvdGUpfWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGByYXdgXG4gIGlmIChcbiAgICBvcHRpb25zLnJhdyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5yYXcgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLnJhdyA9PT0gZmFsc2VcbiAgKSB7XG4gICAgb3B0aW9ucy5yYXcgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLnJhdyAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogcmF3IG11c3QgYmUgdHJ1ZSwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5yYXcpfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGByZWNvcmRfZGVsaW1pdGVyYFxuICBpZiAob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID09PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBbXTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2Ygb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID09PSBcInN0cmluZ1wiIHx8XG4gICAgQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucmVjb3JkX2RlbGltaXRlcilcbiAgKSB7XG4gICAgaWYgKG9wdGlvbnMucmVjb3JkX2RlbGltaXRlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fUkVDT1JEX0RFTElNSVRFUlwiLFxuICAgICAgICBbXG4gICAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBgcmVjb3JkX2RlbGltaXRlcmA6XCIsXG4gICAgICAgICAgXCJ2YWx1ZSBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZyBvciBidWZmZXIsXCIsXG4gICAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucmVjb3JkX2RlbGltaXRlcil9YCxcbiAgICAgICAgXSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICk7XG4gICAgfVxuICAgIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciA9IFtvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXJdO1xuICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMucmVjb3JkX2RlbGltaXRlcikpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9SRUNPUkRfREVMSU1JVEVSXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gYHJlY29yZF9kZWxpbWl0ZXJgOlwiLFxuICAgICAgICBcInZhbHVlIG11c3QgYmUgYSBzdHJpbmcsIGEgYnVmZmVyIG9yIGFycmF5IG9mIHN0cmluZ3xidWZmZXIsXCIsXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIpfWAsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciA9IG9wdGlvbnMucmVjb3JkX2RlbGltaXRlci5tYXAoZnVuY3Rpb24gKHJkLCBpKSB7XG4gICAgaWYgKHR5cGVvZiByZCAhPT0gXCJzdHJpbmdcIiAmJiAhQnVmZmVyLmlzQnVmZmVyKHJkKSkge1xuICAgICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9SRUNPUkRfREVMSU1JVEVSXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBcIkludmFsaWQgb3B0aW9uIGByZWNvcmRfZGVsaW1pdGVyYDpcIixcbiAgICAgICAgICBcInZhbHVlIG11c3QgYmUgYSBzdHJpbmcsIGEgYnVmZmVyIG9yIGFycmF5IG9mIHN0cmluZ3xidWZmZXJcIixcbiAgICAgICAgICBgYXQgaW5kZXggJHtpfSxgLFxuICAgICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShyZCl9YCxcbiAgICAgICAgXSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChyZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fUkVDT1JEX0RFTElNSVRFUlwiLFxuICAgICAgICBbXG4gICAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBgcmVjb3JkX2RlbGltaXRlcmA6XCIsXG4gICAgICAgICAgXCJ2YWx1ZSBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZyBvciBidWZmZXJcIixcbiAgICAgICAgICBgYXQgaW5kZXggJHtpfSxgLFxuICAgICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShyZCl9YCxcbiAgICAgICAgXSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcmQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJkID0gQnVmZmVyLmZyb20ocmQsIG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIH1cbiAgICByZXR1cm4gcmQ7XG4gIH0pO1xuICAvLyBOb3JtYWxpemUgb3B0aW9uIGByZWxheF9jb2x1bW5fY291bnRgXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnQgPT09IFwiYm9vbGVhblwiKSA7IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50ID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudCA9PT0gbnVsbFxuICApIHtcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudCA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogcmVsYXhfY29sdW1uX2NvdW50IG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudCl9YCxcbiAgICApO1xuICB9XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnRfbGVzcyA9PT0gXCJib29sZWFuXCIpIDsgZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnRfbGVzcyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnRfbGVzcyA9PT0gbnVsbFxuICApIHtcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9sZXNzID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiByZWxheF9jb2x1bW5fY291bnRfbGVzcyBtdXN0IGJlIGEgYm9vbGVhbiwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnRfbGVzcyl9YCxcbiAgICApO1xuICB9XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnRfbW9yZSA9PT0gXCJib29sZWFuXCIpIDsgZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnRfbW9yZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnRfbW9yZSA9PT0gbnVsbFxuICApIHtcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9tb3JlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiByZWxheF9jb2x1bW5fY291bnRfbW9yZSBtdXN0IGJlIGEgYm9vbGVhbiwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnRfbW9yZSl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHJlbGF4X3F1b3Rlc2BcbiAgaWYgKHR5cGVvZiBvcHRpb25zLnJlbGF4X3F1b3RlcyA9PT0gXCJib29sZWFuXCIpIDsgZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5yZWxheF9xdW90ZXMgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMucmVsYXhfcXVvdGVzID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMucmVsYXhfcXVvdGVzID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiByZWxheF9xdW90ZXMgbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucmVsYXhfcXVvdGVzKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgc2tpcF9lbXB0eV9saW5lc2BcbiAgaWYgKHR5cGVvZiBvcHRpb25zLnNraXBfZW1wdHlfbGluZXMgPT09IFwiYm9vbGVhblwiKSA7IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMuc2tpcF9lbXB0eV9saW5lcyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5za2lwX2VtcHR5X2xpbmVzID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMuc2tpcF9lbXB0eV9saW5lcyA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogc2tpcF9lbXB0eV9saW5lcyBtdXN0IGJlIGEgYm9vbGVhbiwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5za2lwX2VtcHR5X2xpbmVzKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzYFxuICBpZiAodHlwZW9mIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzID09PSBcImJvb2xlYW5cIikgOyBlbHNlIGlmIChcbiAgICBvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2VtcHR5X3ZhbHVlcyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5za2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXMgPT09IG51bGxcbiAgKSB7XG4gICAgb3B0aW9ucy5za2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXMgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHNraXBfcmVjb3Jkc193aXRoX2VtcHR5X3ZhbHVlcyBtdXN0IGJlIGEgYm9vbGVhbiwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5za2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXMpfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBza2lwX3JlY29yZHNfd2l0aF9lcnJvcmBcbiAgaWYgKHR5cGVvZiBvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2Vycm9yID09PSBcImJvb2xlYW5cIikgOyBlbHNlIGlmIChcbiAgICBvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2Vycm9yID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2Vycm9yID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHNraXBfcmVjb3Jkc193aXRoX2Vycm9yIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2Vycm9yKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcnRyaW1gXG4gIGlmIChcbiAgICBvcHRpb25zLnJ0cmltID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnJ0cmltID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5ydHJpbSA9PT0gZmFsc2VcbiAgKSB7XG4gICAgb3B0aW9ucy5ydHJpbSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMucnRyaW0gIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHJ0cmltIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJ0cmltKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgbHRyaW1gXG4gIGlmIChcbiAgICBvcHRpb25zLmx0cmltID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmx0cmltID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5sdHJpbSA9PT0gZmFsc2VcbiAgKSB7XG4gICAgb3B0aW9ucy5sdHJpbSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMubHRyaW0gIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IGx0cmltIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmx0cmltKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgdHJpbWBcbiAgaWYgKFxuICAgIG9wdGlvbnMudHJpbSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy50cmltID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy50cmltID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLnRyaW0gPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLnRyaW0gIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHRyaW0gbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMudHJpbSl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb25zIGB0cmltYCwgYGx0cmltYCBhbmQgYHJ0cmltYFxuICBpZiAob3B0aW9ucy50cmltID09PSB0cnVlICYmIG9wdHMubHRyaW0gIT09IGZhbHNlKSB7XG4gICAgb3B0aW9ucy5sdHJpbSA9IHRydWU7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5sdHJpbSAhPT0gdHJ1ZSkge1xuICAgIG9wdGlvbnMubHRyaW0gPSBmYWxzZTtcbiAgfVxuICBpZiAob3B0aW9ucy50cmltID09PSB0cnVlICYmIG9wdHMucnRyaW0gIT09IGZhbHNlKSB7XG4gICAgb3B0aW9ucy5ydHJpbSA9IHRydWU7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5ydHJpbSAhPT0gdHJ1ZSkge1xuICAgIG9wdGlvbnMucnRyaW0gPSBmYWxzZTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGB0b2BcbiAgaWYgKG9wdGlvbnMudG8gPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnRvID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy50byA9IC0xO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy50byA9PT0gXCJzdHJpbmdcIiAmJiAvXFxkKy8udGVzdChvcHRpb25zLnRvKSkge1xuICAgICAgb3B0aW9ucy50byA9IHBhcnNlSW50KG9wdGlvbnMudG8pO1xuICAgIH1cbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLnRvKSkge1xuICAgICAgaWYgKG9wdGlvbnMudG8gPD0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgT3B0aW9uOiB0byBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciBncmVhdGVyIHRoYW4gMCwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0cy50byl9YCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgSW52YWxpZCBPcHRpb246IHRvIG11c3QgYmUgYW4gaW50ZWdlciwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0cy50byl9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHRvX2xpbmVgXG4gIGlmIChvcHRpb25zLnRvX2xpbmUgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnRvX2xpbmUgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLnRvX2xpbmUgPSAtMTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudG9fbGluZSA9PT0gXCJzdHJpbmdcIiAmJiAvXFxkKy8udGVzdChvcHRpb25zLnRvX2xpbmUpKSB7XG4gICAgICBvcHRpb25zLnRvX2xpbmUgPSBwYXJzZUludChvcHRpb25zLnRvX2xpbmUpO1xuICAgIH1cbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLnRvX2xpbmUpKSB7XG4gICAgICBpZiAob3B0aW9ucy50b19saW5lIDw9IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBJbnZhbGlkIE9wdGlvbjogdG9fbGluZSBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciBncmVhdGVyIHRoYW4gMCwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0cy50b19saW5lKX1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogdG9fbGluZSBtdXN0IGJlIGFuIGludGVnZXIsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdHMudG9fbGluZSl9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvcHRpb25zO1xufTtcblxuY29uc3QgaXNSZWNvcmRFbXB0eSA9IGZ1bmN0aW9uIChyZWNvcmQpIHtcbiAgcmV0dXJuIHJlY29yZC5ldmVyeShcbiAgICAoZmllbGQpID0+XG4gICAgICBmaWVsZCA9PSBudWxsIHx8IChmaWVsZC50b1N0cmluZyAmJiBmaWVsZC50b1N0cmluZygpLnRyaW0oKSA9PT0gXCJcIiksXG4gICk7XG59O1xuXG5jb25zdCBjciA9IDEzOyAvLyBgXFxyYCwgY2FycmlhZ2UgcmV0dXJuLCAweDBEIGluIGhleGFkw6ljaW1hbCwgMTMgaW4gZGVjaW1hbFxuY29uc3QgbmwgPSAxMDsgLy8gYFxcbmAsIG5ld2xpbmUsIDB4MEEgaW4gaGV4YWRlY2ltYWwsIDEwIGluIGRlY2ltYWxcblxuY29uc3QgYm9tcyA9IHtcbiAgLy8gTm90ZSwgdGhlIGZvbGxvd2luZyBhcmUgZXF1YWxzOlxuICAvLyBCdWZmZXIuZnJvbShcIlxcdWZlZmZcIilcbiAgLy8gQnVmZmVyLmZyb20oWzIzOSwgMTg3LCAxOTFdKVxuICAvLyBCdWZmZXIuZnJvbSgnRUZCQkJGJywgJ2hleCcpXG4gIHV0Zjg6IEJ1ZmZlci5mcm9tKFsyMzksIDE4NywgMTkxXSksXG4gIC8vIE5vdGUsIHRoZSBmb2xsb3dpbmcgYXJlIGVxdWFsczpcbiAgLy8gQnVmZmVyLmZyb20gXCJcXHVmZWZmXCIsICd1dGYxNmxlXG4gIC8vIEJ1ZmZlci5mcm9tKFsyNTUsIDI1NF0pXG4gIHV0ZjE2bGU6IEJ1ZmZlci5mcm9tKFsyNTUsIDI1NF0pLFxufTtcblxuY29uc3QgdHJhbnNmb3JtID0gZnVuY3Rpb24gKG9yaWdpbmFsX29wdGlvbnMgPSB7fSkge1xuICBjb25zdCBpbmZvID0ge1xuICAgIGJ5dGVzOiAwLFxuICAgIGNvbW1lbnRfbGluZXM6IDAsXG4gICAgZW1wdHlfbGluZXM6IDAsXG4gICAgaW52YWxpZF9maWVsZF9sZW5ndGg6IDAsXG4gICAgbGluZXM6IDEsXG4gICAgcmVjb3JkczogMCxcbiAgfTtcbiAgY29uc3Qgb3B0aW9ucyA9IG5vcm1hbGl6ZV9vcHRpb25zKG9yaWdpbmFsX29wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIGluZm86IGluZm8sXG4gICAgb3JpZ2luYWxfb3B0aW9uczogb3JpZ2luYWxfb3B0aW9ucyxcbiAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgIHN0YXRlOiBpbml0X3N0YXRlKG9wdGlvbnMpLFxuICAgIF9fbmVlZE1vcmVEYXRhOiBmdW5jdGlvbiAoaSwgYnVmTGVuLCBlbmQpIHtcbiAgICAgIGlmIChlbmQpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IHsgZW5jb2RpbmcsIGVzY2FwZSwgcXVvdGUgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IHsgcXVvdGluZywgbmVlZE1vcmVEYXRhU2l6ZSwgcmVjb3JkRGVsaW1pdGVyTWF4TGVuZ3RoIH0gPVxuICAgICAgICB0aGlzLnN0YXRlO1xuICAgICAgY29uc3QgbnVtT2ZDaGFyTGVmdCA9IGJ1ZkxlbiAtIGkgLSAxO1xuICAgICAgY29uc3QgcmVxdWlyZWRMZW5ndGggPSBNYXRoLm1heChcbiAgICAgICAgbmVlZE1vcmVEYXRhU2l6ZSxcbiAgICAgICAgLy8gU2tpcCBpZiB0aGUgcmVtYWluaW5nIGJ1ZmZlciBzbWFsbGVyIHRoYW4gcmVjb3JkIGRlbGltaXRlclxuICAgICAgICAvLyBJZiBcInJlY29yZF9kZWxpbWl0ZXJcIiBpcyB5ZXQgdG8gYmUgZGlzY292ZXJlZDpcbiAgICAgICAgLy8gMS4gSXQgaXMgZXF1YWxzIHRvIGBbXWAgYW5kIFwicmVjb3JkRGVsaW1pdGVyTWF4TGVuZ3RoXCIgZXF1YWxzIGAwYFxuICAgICAgICAvLyAyLiBXZSBzZXQgdGhlIGxlbmd0aCB0byB3aW5kb3dzIGxpbmUgZW5kaW5nIGluIHRoZSBjdXJyZW50IGVuY29kaW5nXG4gICAgICAgIC8vIE5vdGUsIHRoYXQgZW5jb2RpbmcgaXMga25vd24gZnJvbSB1c2VyIG9yIGJvbSBkaXNjb3ZlcnkgYXQgdGhhdCBwb2ludFxuICAgICAgICAvLyByZWNvcmREZWxpbWl0ZXJNYXhMZW5ndGgsXG4gICAgICAgIHJlY29yZERlbGltaXRlck1heExlbmd0aCA9PT0gMFxuICAgICAgICAgID8gQnVmZmVyLmZyb20oXCJcXHJcXG5cIiwgZW5jb2RpbmcpLmxlbmd0aFxuICAgICAgICAgIDogcmVjb3JkRGVsaW1pdGVyTWF4TGVuZ3RoLFxuICAgICAgICAvLyBTa2lwIGlmIHJlbWFpbmluZyBidWZmZXIgY2FuIGJlIGFuIGVzY2FwZWQgcXVvdGVcbiAgICAgICAgcXVvdGluZyA/IChlc2NhcGUgPT09IG51bGwgPyAwIDogZXNjYXBlLmxlbmd0aCkgKyBxdW90ZS5sZW5ndGggOiAwLFxuICAgICAgICAvLyBTa2lwIGlmIHJlbWFpbmluZyBidWZmZXIgY2FuIGJlIHJlY29yZCBkZWxpbWl0ZXIgZm9sbG93aW5nIHRoZSBjbG9zaW5nIHF1b3RlXG4gICAgICAgIHF1b3RpbmcgPyBxdW90ZS5sZW5ndGggKyByZWNvcmREZWxpbWl0ZXJNYXhMZW5ndGggOiAwLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBudW1PZkNoYXJMZWZ0IDwgcmVxdWlyZWRMZW5ndGg7XG4gICAgfSxcbiAgICAvLyBDZW50cmFsIHBhcnNlciBpbXBsZW1lbnRhdGlvblxuICAgIHBhcnNlOiBmdW5jdGlvbiAobmV4dEJ1ZiwgZW5kLCBwdXNoLCBjbG9zZSkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBib20sXG4gICAgICAgIGNvbW1lbnRfbm9faW5maXgsXG4gICAgICAgIGVuY29kaW5nLFxuICAgICAgICBmcm9tX2xpbmUsXG4gICAgICAgIGx0cmltLFxuICAgICAgICBtYXhfcmVjb3JkX3NpemUsXG4gICAgICAgIHJhdyxcbiAgICAgICAgcmVsYXhfcXVvdGVzLFxuICAgICAgICBydHJpbSxcbiAgICAgICAgc2tpcF9lbXB0eV9saW5lcyxcbiAgICAgICAgdG8sXG4gICAgICAgIHRvX2xpbmUsXG4gICAgICB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgbGV0IHsgY29tbWVudCwgZXNjYXBlLCBxdW90ZSwgcmVjb3JkX2RlbGltaXRlciB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgeyBib21Ta2lwcGVkLCBwcmV2aW91c0J1ZiwgcmF3QnVmZmVyLCBlc2NhcGVJc1F1b3RlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgbGV0IGJ1ZjtcbiAgICAgIGlmIChwcmV2aW91c0J1ZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChuZXh0QnVmID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBIYW5kbGUgZW1wdHkgc3RyaW5nXG4gICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVmID0gbmV4dEJ1ZjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwcmV2aW91c0J1ZiAhPT0gdW5kZWZpbmVkICYmIG5leHRCdWYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBidWYgPSBwcmV2aW91c0J1ZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1ZiA9IEJ1ZmZlci5jb25jYXQoW3ByZXZpb3VzQnVmLCBuZXh0QnVmXSk7XG4gICAgICB9XG4gICAgICAvLyBIYW5kbGUgVVRGIEJPTVxuICAgICAgaWYgKGJvbVNraXBwZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChib20gPT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5ib21Ta2lwcGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChidWYubGVuZ3RoIDwgMykge1xuICAgICAgICAgIC8vIE5vIGVub3VnaCBkYXRhXG4gICAgICAgICAgaWYgKGVuZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vIFdhaXQgZm9yIG1vcmUgZGF0YVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wcmV2aW91c0J1ZiA9IGJ1ZjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChjb25zdCBlbmNvZGluZyBpbiBib21zKSB7XG4gICAgICAgICAgICBpZiAoYm9tc1tlbmNvZGluZ10uY29tcGFyZShidWYsIDAsIGJvbXNbZW5jb2RpbmddLmxlbmd0aCkgPT09IDApIHtcbiAgICAgICAgICAgICAgLy8gU2tpcCBCT01cbiAgICAgICAgICAgICAgY29uc3QgYm9tTGVuZ3RoID0gYm9tc1tlbmNvZGluZ10ubGVuZ3RoO1xuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmJ1ZkJ5dGVzU3RhcnQgKz0gYm9tTGVuZ3RoO1xuICAgICAgICAgICAgICBidWYgPSBidWYuc2xpY2UoYm9tTGVuZ3RoKTtcbiAgICAgICAgICAgICAgLy8gUmVub3JtYWxpemUgb3JpZ2luYWwgb3B0aW9ucyB3aXRoIHRoZSBuZXcgZW5jb2RpbmdcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gbm9ybWFsaXplX29wdGlvbnMoe1xuICAgICAgICAgICAgICAgIC4uLnRoaXMub3JpZ2luYWxfb3B0aW9ucyxcbiAgICAgICAgICAgICAgICBlbmNvZGluZzogZW5jb2RpbmcsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAvLyBPcHRpb25zIHdpbGwgcmUtZXZhbHVhdGUgdGhlIEJ1ZmZlciB3aXRoIHRoZSBuZXcgZW5jb2RpbmdcbiAgICAgICAgICAgICAgKHsgY29tbWVudCwgZXNjYXBlLCBxdW90ZSB9ID0gdGhpcy5vcHRpb25zKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc3RhdGUuYm9tU2tpcHBlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IGJ1ZkxlbiA9IGJ1Zi5sZW5ndGg7XG4gICAgICBsZXQgcG9zO1xuICAgICAgZm9yIChwb3MgPSAwOyBwb3MgPCBidWZMZW47IHBvcysrKSB7XG4gICAgICAgIC8vIEVuc3VyZSB3ZSBnZXQgZW5vdWdoIHNwYWNlIHRvIGxvb2sgYWhlYWRcbiAgICAgICAgLy8gVGhlcmUgc2hvdWxkIGJlIGEgd2F5IHRvIG1vdmUgdGhpcyBvdXQgb2YgdGhlIGxvb3BcbiAgICAgICAgaWYgKHRoaXMuX19uZWVkTW9yZURhdGEocG9zLCBidWZMZW4sIGVuZCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS53YXNSb3dEZWxpbWl0ZXIgPT09IHRydWUpIHtcbiAgICAgICAgICB0aGlzLmluZm8ubGluZXMrKztcbiAgICAgICAgICB0aGlzLnN0YXRlLndhc1Jvd0RlbGltaXRlciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b19saW5lICE9PSAtMSAmJiB0aGlzLmluZm8ubGluZXMgPiB0b19saW5lKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5zdG9wID0gdHJ1ZTtcbiAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBBdXRvIGRpc2NvdmVyeSBvZiByZWNvcmRfZGVsaW1pdGVyLCB1bml4LCBtYWMgYW5kIHdpbmRvd3Mgc3VwcG9ydGVkXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnF1b3RpbmcgPT09IGZhbHNlICYmIHJlY29yZF9kZWxpbWl0ZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgcmVjb3JkX2RlbGltaXRlckNvdW50ID0gdGhpcy5fX2F1dG9EaXNjb3ZlclJlY29yZERlbGltaXRlcihcbiAgICAgICAgICAgIGJ1ZixcbiAgICAgICAgICAgIHBvcyxcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChyZWNvcmRfZGVsaW1pdGVyQ291bnQpIHtcbiAgICAgICAgICAgIHJlY29yZF9kZWxpbWl0ZXIgPSB0aGlzLm9wdGlvbnMucmVjb3JkX2RlbGltaXRlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2hyID0gYnVmW3Bvc107XG4gICAgICAgIGlmIChyYXcgPT09IHRydWUpIHtcbiAgICAgICAgICByYXdCdWZmZXIuYXBwZW5kKGNocik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIChjaHIgPT09IGNyIHx8IGNociA9PT0gbmwpICYmXG4gICAgICAgICAgdGhpcy5zdGF0ZS53YXNSb3dEZWxpbWl0ZXIgPT09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuc3RhdGUud2FzUm93RGVsaW1pdGVyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBQcmV2aW91cyBjaGFyIHdhcyBhIHZhbGlkIGVzY2FwZSBjaGFyXG4gICAgICAgIC8vIHRyZWF0IHRoZSBjdXJyZW50IGNoYXIgYXMgYSByZWd1bGFyIGNoYXJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZXNjYXBpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLmVzY2FwaW5nID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXNjYXBlIGlzIG9ubHkgYWN0aXZlIGluc2lkZSBxdW90ZWQgZmllbGRzXG4gICAgICAgICAgLy8gV2UgYXJlIHF1b3RpbmcsIHRoZSBjaGFyIGlzIGFuIGVzY2FwZSBjaHIgYW5kIHRoZXJlIGlzIGEgY2hyIHRvIGVzY2FwZVxuICAgICAgICAgIC8vIGlmKGVzY2FwZSAhPT0gbnVsbCAmJiB0aGlzLnN0YXRlLnF1b3RpbmcgPT09IHRydWUgJiYgY2hyID09PSBlc2NhcGUgJiYgcG9zICsgMSA8IGJ1Zkxlbil7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZXNjYXBlICE9PSBudWxsICYmXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnF1b3RpbmcgPT09IHRydWUgJiZcbiAgICAgICAgICAgIHRoaXMuX19pc0VzY2FwZShidWYsIHBvcywgY2hyKSAmJlxuICAgICAgICAgICAgcG9zICsgZXNjYXBlLmxlbmd0aCA8IGJ1ZkxlblxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaWYgKGVzY2FwZUlzUXVvdGUpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuX19pc1F1b3RlKGJ1ZiwgcG9zICsgZXNjYXBlLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVzY2FwaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwb3MgKz0gZXNjYXBlLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXNjYXBpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICBwb3MgKz0gZXNjYXBlLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBOb3QgY3VycmVudGx5IGVzY2FwaW5nIGFuZCBjaHIgaXMgYSBxdW90ZVxuICAgICAgICAgIC8vIFRPRE86IG5lZWQgdG8gY29tcGFyZSBieXRlcyBpbnN0ZWFkIG9mIHNpbmdsZSBjaGFyXG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuY29tbWVudGluZyA9PT0gZmFsc2UgJiYgdGhpcy5fX2lzUXVvdGUoYnVmLCBwb3MpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5xdW90aW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5leHRDaHIgPSBidWZbcG9zICsgcXVvdGUubGVuZ3RoXTtcbiAgICAgICAgICAgICAgY29uc3QgaXNOZXh0Q2hyVHJpbWFibGUgPVxuICAgICAgICAgICAgICAgIHJ0cmltICYmIHRoaXMuX19pc0NoYXJUcmltYWJsZShidWYsIHBvcyArIHF1b3RlLmxlbmd0aCk7XG4gICAgICAgICAgICAgIGNvbnN0IGlzTmV4dENockNvbW1lbnQgPVxuICAgICAgICAgICAgICAgIGNvbW1lbnQgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9fY29tcGFyZUJ5dGVzKGNvbW1lbnQsIGJ1ZiwgcG9zICsgcXVvdGUubGVuZ3RoLCBuZXh0Q2hyKTtcbiAgICAgICAgICAgICAgY29uc3QgaXNOZXh0Q2hyRGVsaW1pdGVyID0gdGhpcy5fX2lzRGVsaW1pdGVyKFxuICAgICAgICAgICAgICAgIGJ1ZixcbiAgICAgICAgICAgICAgICBwb3MgKyBxdW90ZS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgbmV4dENocixcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgY29uc3QgaXNOZXh0Q2hyUmVjb3JkRGVsaW1pdGVyID1cbiAgICAgICAgICAgICAgICByZWNvcmRfZGVsaW1pdGVyLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgICAgICAgPyB0aGlzLl9fYXV0b0Rpc2NvdmVyUmVjb3JkRGVsaW1pdGVyKGJ1ZiwgcG9zICsgcXVvdGUubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgOiB0aGlzLl9faXNSZWNvcmREZWxpbWl0ZXIobmV4dENociwgYnVmLCBwb3MgKyBxdW90ZS5sZW5ndGgpO1xuICAgICAgICAgICAgICAvLyBFc2NhcGUgYSBxdW90ZVxuICAgICAgICAgICAgICAvLyBUcmVhdCBuZXh0IGNoYXIgYXMgYSByZWd1bGFyIGNoYXJhY3RlclxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZXNjYXBlICE9PSBudWxsICYmXG4gICAgICAgICAgICAgICAgdGhpcy5fX2lzRXNjYXBlKGJ1ZiwgcG9zLCBjaHIpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5fX2lzUXVvdGUoYnVmLCBwb3MgKyBlc2NhcGUubGVuZ3RoKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBwb3MgKz0gZXNjYXBlLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgIW5leHRDaHIgfHxcbiAgICAgICAgICAgICAgICBpc05leHRDaHJEZWxpbWl0ZXIgfHxcbiAgICAgICAgICAgICAgICBpc05leHRDaHJSZWNvcmREZWxpbWl0ZXIgfHxcbiAgICAgICAgICAgICAgICBpc05leHRDaHJDb21tZW50IHx8XG4gICAgICAgICAgICAgICAgaXNOZXh0Q2hyVHJpbWFibGVcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5xdW90aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS53YXNRdW90aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwb3MgKz0gcXVvdGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWxheF9xdW90ZXMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyID0gdGhpcy5fX2Vycm9yKFxuICAgICAgICAgICAgICAgICAgbmV3IENzdkVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkNTVl9JTlZBTElEX0NMT1NJTkdfUVVPVEVcIixcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCBDbG9zaW5nIFF1b3RlOlwiLFxuICAgICAgICAgICAgICAgICAgICAgIGBnb3QgXCIke1N0cmluZy5mcm9tQ2hhckNvZGUobmV4dENocil9XCJgLFxuICAgICAgICAgICAgICAgICAgICAgIGBhdCBsaW5lICR7dGhpcy5pbmZvLmxpbmVzfWAsXG4gICAgICAgICAgICAgICAgICAgICAgXCJpbnN0ZWFkIG9mIGRlbGltaXRlciwgcmVjb3JkIGRlbGltaXRlciwgdHJpbWFibGUgY2hhcmFjdGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCIoaWYgYWN0aXZhdGVkKSBvciBjb21tZW50XCIsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luZm9GaWVsZCgpLFxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmIChlcnIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVycjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnF1b3RpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLndhc1F1b3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZmllbGQucHJlcGVuZChxdW90ZSk7XG4gICAgICAgICAgICAgICAgcG9zICs9IHF1b3RlLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmZpZWxkLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIEluIHJlbGF4X3F1b3RlcyBtb2RlLCB0cmVhdCBvcGVuaW5nIHF1b3RlIHByZWNlZGVkIGJ5IGNocnMgYXMgcmVndWxhclxuICAgICAgICAgICAgICAgIGlmIChyZWxheF9xdW90ZXMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5fX2luZm9GaWVsZCgpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgYm9tID0gT2JqZWN0LmtleXMoYm9tcylcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgoYikgPT5cbiAgICAgICAgICAgICAgICAgICAgICBib21zW2JdLmVxdWFscyh0aGlzLnN0YXRlLmZpZWxkLnRvU3RyaW5nKCkpID8gYiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilbMF07XG4gICAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSB0aGlzLl9fZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDc3ZFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICBcIklOVkFMSURfT1BFTklOR19RVU9URVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCBPcGVuaW5nIFF1b3RlOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYGEgcXVvdGUgaXMgZm91bmQgb24gZmllbGQgJHtKU09OLnN0cmluZ2lmeShpbmZvLmNvbHVtbil9IGF0IGxpbmUgJHtpbmZvLmxpbmVzfSwgdmFsdWUgaXMgJHtKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLmZpZWxkLnRvU3RyaW5nKGVuY29kaW5nKSl9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvbSA/IGAoJHtib219IGJvbSlgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuc3RhdGUuZmllbGQsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHJldHVybiBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucXVvdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcG9zICs9IHF1b3RlLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUucXVvdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZERlbGltaXRlckxlbmd0aCA9IHRoaXMuX19pc1JlY29yZERlbGltaXRlcihcbiAgICAgICAgICAgICAgY2hyLFxuICAgICAgICAgICAgICBidWYsXG4gICAgICAgICAgICAgIHBvcyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAocmVjb3JkRGVsaW1pdGVyTGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgIC8vIERvIG5vdCBlbWl0IGNvbW1lbnRzIHdoaWNoIHRha2UgYSBmdWxsIGxpbmVcbiAgICAgICAgICAgICAgY29uc3Qgc2tpcENvbW1lbnRMaW5lID1cbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmNvbW1lbnRpbmcgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLndhc1F1b3RpbmcgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZWNvcmQubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICAgIGlmIChza2lwQ29tbWVudExpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZm8uY29tbWVudF9saW5lcysrO1xuICAgICAgICAgICAgICAgIC8vIFNraXAgZnVsbCBjb21tZW50IGxpbmVcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBBY3RpdmF0ZSByZWNvcmRzIGVtaXRpb24gaWYgYWJvdmUgZnJvbV9saW5lXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lbmFibGVkID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgICAgdGhpcy5pbmZvLmxpbmVzICtcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuc3RhdGUud2FzUm93RGVsaW1pdGVyID09PSB0cnVlID8gMSA6IDApID49XG4gICAgICAgICAgICAgICAgICAgIGZyb21fbGluZVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX19yZXNldEZpZWxkKCk7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9fcmVzZXRSZWNvcmQoKTtcbiAgICAgICAgICAgICAgICAgIHBvcyArPSByZWNvcmREZWxpbWl0ZXJMZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFNraXAgaWYgbGluZSBpcyBlbXB0eSBhbmQgc2tpcF9lbXB0eV9saW5lcyBhY3RpdmF0ZWRcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICBza2lwX2VtcHR5X2xpbmVzID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLndhc1F1b3RpbmcgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZmllbGQubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmluZm8uZW1wdHlfbGluZXMrKztcbiAgICAgICAgICAgICAgICAgIHBvcyArPSByZWNvcmREZWxpbWl0ZXJMZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5ieXRlcyA9IHRoaXMuc3RhdGUuYnVmQnl0ZXNTdGFydCArIHBvcztcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJGaWVsZCA9IHRoaXMuX19vbkZpZWxkKCk7XG4gICAgICAgICAgICAgICAgaWYgKGVyckZpZWxkICE9PSB1bmRlZmluZWQpIHJldHVybiBlcnJGaWVsZDtcbiAgICAgICAgICAgICAgICB0aGlzLmluZm8uYnl0ZXMgPVxuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5idWZCeXRlc1N0YXJ0ICsgcG9zICsgcmVjb3JkRGVsaW1pdGVyTGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyclJlY29yZCA9IHRoaXMuX19vblJlY29yZChwdXNoKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyUmVjb3JkICE9PSB1bmRlZmluZWQpIHJldHVybiBlcnJSZWNvcmQ7XG4gICAgICAgICAgICAgICAgaWYgKHRvICE9PSAtMSAmJiB0aGlzLmluZm8ucmVjb3JkcyA+PSB0bykge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zdG9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuY29tbWVudGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICBwb3MgKz0gcmVjb3JkRGVsaW1pdGVyTGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5jb21tZW50aW5nKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBjb21tZW50ICE9PSBudWxsICYmXG4gICAgICAgICAgICAgIChjb21tZW50X25vX2luZml4ID09PSBmYWxzZSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZmllbGQubGVuZ3RoID09PSAwKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBjb25zdCBjb21tZW50Q291bnQgPSB0aGlzLl9fY29tcGFyZUJ5dGVzKGNvbW1lbnQsIGJ1ZiwgcG9zLCBjaHIpO1xuICAgICAgICAgICAgICBpZiAoY29tbWVudENvdW50ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jb21tZW50aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGVsaW1pdGVyTGVuZ3RoID0gdGhpcy5fX2lzRGVsaW1pdGVyKGJ1ZiwgcG9zLCBjaHIpO1xuICAgICAgICAgICAgaWYgKGRlbGltaXRlckxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICB0aGlzLmluZm8uYnl0ZXMgPSB0aGlzLnN0YXRlLmJ1ZkJ5dGVzU3RhcnQgKyBwb3M7XG4gICAgICAgICAgICAgIGNvbnN0IGVyckZpZWxkID0gdGhpcy5fX29uRmllbGQoKTtcbiAgICAgICAgICAgICAgaWYgKGVyckZpZWxkICE9PSB1bmRlZmluZWQpIHJldHVybiBlcnJGaWVsZDtcbiAgICAgICAgICAgICAgcG9zICs9IGRlbGltaXRlckxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5jb21tZW50aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG1heF9yZWNvcmRfc2l6ZSAhPT0gMCAmJlxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZWNvcmRfbGVuZ3RoICsgdGhpcy5zdGF0ZS5maWVsZC5sZW5ndGggPiBtYXhfcmVjb3JkX3NpemVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fZXJyb3IoXG4gICAgICAgICAgICAgIG5ldyBDc3ZFcnJvcihcbiAgICAgICAgICAgICAgICBcIkNTVl9NQVhfUkVDT1JEX1NJWkVcIixcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBcIk1heCBSZWNvcmQgU2l6ZTpcIixcbiAgICAgICAgICAgICAgICAgIFwicmVjb3JkIGV4Y2VlZCB0aGUgbWF4aW11bSBudW1iZXIgb2YgdG9sZXJhdGVkIGJ5dGVzXCIsXG4gICAgICAgICAgICAgICAgICBgb2YgJHttYXhfcmVjb3JkX3NpemV9YCxcbiAgICAgICAgICAgICAgICAgIGBhdCBsaW5lICR7dGhpcy5pbmZvLmxpbmVzfWAsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgdGhpcy5fX2luZm9GaWVsZCgpLFxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFwcGVuZCA9XG4gICAgICAgICAgbHRyaW0gPT09IGZhbHNlIHx8XG4gICAgICAgICAgdGhpcy5zdGF0ZS5xdW90aW5nID09PSB0cnVlIHx8XG4gICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5sZW5ndGggIT09IDAgfHxcbiAgICAgICAgICAhdGhpcy5fX2lzQ2hhclRyaW1hYmxlKGJ1ZiwgcG9zKTtcbiAgICAgICAgLy8gcnRyaW0gaW4gbm9uIHF1b3RpbmcgaXMgaGFuZGxlIGluIF9fb25GaWVsZFxuICAgICAgICBjb25zdCByYXBwZW5kID0gcnRyaW0gPT09IGZhbHNlIHx8IHRoaXMuc3RhdGUud2FzUXVvdGluZyA9PT0gZmFsc2U7XG4gICAgICAgIGlmIChsYXBwZW5kID09PSB0cnVlICYmIHJhcHBlbmQgPT09IHRydWUpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLmZpZWxkLmFwcGVuZChjaHIpO1xuICAgICAgICB9IGVsc2UgaWYgKHJ0cmltID09PSB0cnVlICYmICF0aGlzLl9faXNDaGFyVHJpbWFibGUoYnVmLCBwb3MpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX19lcnJvcihcbiAgICAgICAgICAgIG5ldyBDc3ZFcnJvcihcbiAgICAgICAgICAgICAgXCJDU1ZfTk9OX1RSSU1BQkxFX0NIQVJfQUZURVJfQ0xPU0lOR19RVU9URVwiLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgXCJJbnZhbGlkIENsb3NpbmcgUXVvdGU6XCIsXG4gICAgICAgICAgICAgICAgXCJmb3VuZCBub24gdHJpbWFibGUgYnl0ZSBhZnRlciBxdW90ZVwiLFxuICAgICAgICAgICAgICAgIGBhdCBsaW5lICR7dGhpcy5pbmZvLmxpbmVzfWAsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgdGhpcy5fX2luZm9GaWVsZCgpLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChsYXBwZW5kID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcG9zICs9IHRoaXMuX19pc0NoYXJUcmltYWJsZShidWYsIHBvcykgLSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGVuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBFbnN1cmUgd2UgYXJlIG5vdCBlbmRpbmcgaW4gYSBxdW90aW5nIHN0YXRlXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnF1b3RpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSB0aGlzLl9fZXJyb3IoXG4gICAgICAgICAgICBuZXcgQ3N2RXJyb3IoXG4gICAgICAgICAgICAgIFwiQ1NWX1FVT1RFX05PVF9DTE9TRURcIixcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFwiUXVvdGUgTm90IENsb3NlZDpcIixcbiAgICAgICAgICAgICAgICBgdGhlIHBhcnNpbmcgaXMgZmluaXNoZWQgd2l0aCBhbiBvcGVuaW5nIHF1b3RlIGF0IGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGVyciAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFNraXAgbGFzdCBsaW5lIGlmIGl0IGhhcyBubyBjaGFyYWN0ZXJzXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS53YXNRdW90aW5nID09PSB0cnVlIHx8XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGggIT09IDAgfHxcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZmllbGQubGVuZ3RoICE9PSAwXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmluZm8uYnl0ZXMgPSB0aGlzLnN0YXRlLmJ1ZkJ5dGVzU3RhcnQgKyBwb3M7XG4gICAgICAgICAgICBjb25zdCBlcnJGaWVsZCA9IHRoaXMuX19vbkZpZWxkKCk7XG4gICAgICAgICAgICBpZiAoZXJyRmllbGQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVyckZpZWxkO1xuICAgICAgICAgICAgY29uc3QgZXJyUmVjb3JkID0gdGhpcy5fX29uUmVjb3JkKHB1c2gpO1xuICAgICAgICAgICAgaWYgKGVyclJlY29yZCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXJyUmVjb3JkO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS53YXNSb3dEZWxpbWl0ZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5mby5lbXB0eV9saW5lcysrO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5jb21tZW50aW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmluZm8uY29tbWVudF9saW5lcysrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWZCeXRlc1N0YXJ0ICs9IHBvcztcbiAgICAgICAgdGhpcy5zdGF0ZS5wcmV2aW91c0J1ZiA9IGJ1Zi5zbGljZShwb3MpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhdGUud2FzUm93RGVsaW1pdGVyID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuaW5mby5saW5lcysrO1xuICAgICAgICB0aGlzLnN0YXRlLndhc1Jvd0RlbGltaXRlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG4gICAgX19vblJlY29yZDogZnVuY3Rpb24gKHB1c2gpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29sdW1ucyxcbiAgICAgICAgZ3JvdXBfY29sdW1uc19ieV9uYW1lLFxuICAgICAgICBlbmNvZGluZyxcbiAgICAgICAgaW5mbyxcbiAgICAgICAgZnJvbSxcbiAgICAgICAgcmVsYXhfY29sdW1uX2NvdW50LFxuICAgICAgICByZWxheF9jb2x1bW5fY291bnRfbGVzcyxcbiAgICAgICAgcmVsYXhfY29sdW1uX2NvdW50X21vcmUsXG4gICAgICAgIHJhdyxcbiAgICAgICAgc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzLFxuICAgICAgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IHsgZW5hYmxlZCwgcmVjb3JkIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgaWYgKGVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fcmVzZXRSZWNvcmQoKTtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgdGhlIGZpcnN0IGxpbmUgaW50byBjb2x1bW4gbmFtZXNcbiAgICAgIGNvbnN0IHJlY29yZExlbmd0aCA9IHJlY29yZC5sZW5ndGg7XG4gICAgICBpZiAoY29sdW1ucyA9PT0gdHJ1ZSkge1xuICAgICAgICBpZiAoc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzID09PSB0cnVlICYmIGlzUmVjb3JkRW1wdHkocmVjb3JkKSkge1xuICAgICAgICAgIHRoaXMuX19yZXNldFJlY29yZCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fX2ZpcnN0TGluZVRvQ29sdW1ucyhyZWNvcmQpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbHVtbnMgPT09IGZhbHNlICYmIHRoaXMuaW5mby5yZWNvcmRzID09PSAwKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuZXhwZWN0ZWRSZWNvcmRMZW5ndGggPSByZWNvcmRMZW5ndGg7XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkTGVuZ3RoICE9PSB0aGlzLnN0YXRlLmV4cGVjdGVkUmVjb3JkTGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGVyciA9XG4gICAgICAgICAgY29sdW1ucyA9PT0gZmFsc2VcbiAgICAgICAgICAgID8gbmV3IENzdkVycm9yKFxuICAgICAgICAgICAgICAgIFwiQ1NWX1JFQ09SRF9JTkNPTlNJU1RFTlRfRklFTERTX0xFTkdUSFwiLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCBSZWNvcmQgTGVuZ3RoOlwiLFxuICAgICAgICAgICAgICAgICAgYGV4cGVjdCAke3RoaXMuc3RhdGUuZXhwZWN0ZWRSZWNvcmRMZW5ndGh9LGAsXG4gICAgICAgICAgICAgICAgICBgZ290ICR7cmVjb3JkTGVuZ3RofSBvbiBsaW5lICR7dGhpcy5pbmZvLmxpbmVzfWAsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgdGhpcy5fX2luZm9GaWVsZCgpLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHJlY29yZDogcmVjb3JkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogbmV3IENzdkVycm9yKFxuICAgICAgICAgICAgICAgIFwiQ1NWX1JFQ09SRF9JTkNPTlNJU1RFTlRfQ09MVU1OU1wiLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCBSZWNvcmQgTGVuZ3RoOlwiLFxuICAgICAgICAgICAgICAgICAgYGNvbHVtbnMgbGVuZ3RoIGlzICR7Y29sdW1ucy5sZW5ndGh9LGAsIC8vIHJlbmFtZSBjb2x1bW5zXG4gICAgICAgICAgICAgICAgICBgZ290ICR7cmVjb3JkTGVuZ3RofSBvbiBsaW5lICR7dGhpcy5pbmZvLmxpbmVzfWAsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgdGhpcy5fX2luZm9GaWVsZCgpLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHJlY29yZDogcmVjb3JkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICByZWxheF9jb2x1bW5fY291bnQgPT09IHRydWUgfHxcbiAgICAgICAgICAocmVsYXhfY29sdW1uX2NvdW50X2xlc3MgPT09IHRydWUgJiZcbiAgICAgICAgICAgIHJlY29yZExlbmd0aCA8IHRoaXMuc3RhdGUuZXhwZWN0ZWRSZWNvcmRMZW5ndGgpIHx8XG4gICAgICAgICAgKHJlbGF4X2NvbHVtbl9jb3VudF9tb3JlID09PSB0cnVlICYmXG4gICAgICAgICAgICByZWNvcmRMZW5ndGggPiB0aGlzLnN0YXRlLmV4cGVjdGVkUmVjb3JkTGVuZ3RoKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLmluZm8uaW52YWxpZF9maWVsZF9sZW5ndGgrKztcbiAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID0gZXJyO1xuICAgICAgICAgIC8vIEVycm9yIGlzIHVuZGVmaW5lZCB3aXRoIHNraXBfcmVjb3Jkc193aXRoX2Vycm9yXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgZmluYWxFcnIgPSB0aGlzLl9fZXJyb3IoZXJyKTtcbiAgICAgICAgICBpZiAoZmluYWxFcnIpIHJldHVybiBmaW5hbEVycjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNraXBfcmVjb3Jkc193aXRoX2VtcHR5X3ZhbHVlcyA9PT0gdHJ1ZSAmJiBpc1JlY29yZEVtcHR5KHJlY29yZCkpIHtcbiAgICAgICAgdGhpcy5fX3Jlc2V0UmVjb3JkKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXRlLnJlY29yZEhhc0Vycm9yID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuX19yZXNldFJlY29yZCgpO1xuICAgICAgICB0aGlzLnN0YXRlLnJlY29yZEhhc0Vycm9yID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5mby5yZWNvcmRzKys7XG4gICAgICBpZiAoZnJvbSA9PT0gMSB8fCB0aGlzLmluZm8ucmVjb3JkcyA+PSBmcm9tKSB7XG4gICAgICAgIGNvbnN0IHsgb2JqbmFtZSB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgICAvLyBXaXRoIGNvbHVtbnMsIHJlY29yZHMgYXJlIG9iamVjdFxuICAgICAgICBpZiAoY29sdW1ucyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgICAgICAvLyBUcmFuc2Zvcm0gcmVjb3JkIGFycmF5IHRvIGFuIG9iamVjdFxuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVjb3JkLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNvbHVtbnNbaV0gPT09IHVuZGVmaW5lZCB8fCBjb2x1bW5zW2ldLmRpc2FibGVkKSBjb250aW51ZTtcbiAgICAgICAgICAgIC8vIFR1cm4gZHVwbGljYXRlIGNvbHVtbnMgaW50byBhbiBhcnJheVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBncm91cF9jb2x1bW5zX2J5X25hbWUgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgb2JqW2NvbHVtbnNbaV0ubmFtZV0gIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtjb2x1bW5zW2ldLm5hbWVdKSkge1xuICAgICAgICAgICAgICAgIG9ialtjb2x1bW5zW2ldLm5hbWVdID0gb2JqW2NvbHVtbnNbaV0ubmFtZV0uY29uY2F0KHJlY29yZFtpXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JqW2NvbHVtbnNbaV0ubmFtZV0gPSBbb2JqW2NvbHVtbnNbaV0ubmFtZV0sIHJlY29yZFtpXV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG9ialtjb2x1bW5zW2ldLm5hbWVdID0gcmVjb3JkW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBXaXRob3V0IG9iam5hbWUgKGRlZmF1bHQpXG4gICAgICAgICAgaWYgKHJhdyA9PT0gdHJ1ZSB8fCBpbmZvID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBleHRSZWNvcmQgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICB7IHJlY29yZDogb2JqIH0sXG4gICAgICAgICAgICAgIHJhdyA9PT0gdHJ1ZVxuICAgICAgICAgICAgICAgID8geyByYXc6IHRoaXMuc3RhdGUucmF3QnVmZmVyLnRvU3RyaW5nKGVuY29kaW5nKSB9XG4gICAgICAgICAgICAgICAgOiB7fSxcbiAgICAgICAgICAgICAgaW5mbyA9PT0gdHJ1ZSA/IHsgaW5mbzogdGhpcy5fX2luZm9SZWNvcmQoKSB9IDoge30sXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgZXJyID0gdGhpcy5fX3B1c2goXG4gICAgICAgICAgICAgIG9iam5hbWUgPT09IHVuZGVmaW5lZCA/IGV4dFJlY29yZCA6IFtvYmpbb2JqbmFtZV0sIGV4dFJlY29yZF0sXG4gICAgICAgICAgICAgIHB1c2gsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSB0aGlzLl9fcHVzaChcbiAgICAgICAgICAgICAgb2JqbmFtZSA9PT0gdW5kZWZpbmVkID8gb2JqIDogW29ialtvYmpuYW1lXSwgb2JqXSxcbiAgICAgICAgICAgICAgcHVzaCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFdpdGhvdXQgY29sdW1ucywgcmVjb3JkcyBhcmUgYXJyYXlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmF3ID09PSB0cnVlIHx8IGluZm8gPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dFJlY29yZCA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgIHsgcmVjb3JkOiByZWNvcmQgfSxcbiAgICAgICAgICAgICAgcmF3ID09PSB0cnVlXG4gICAgICAgICAgICAgICAgPyB7IHJhdzogdGhpcy5zdGF0ZS5yYXdCdWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpIH1cbiAgICAgICAgICAgICAgICA6IHt9LFxuICAgICAgICAgICAgICBpbmZvID09PSB0cnVlID8geyBpbmZvOiB0aGlzLl9faW5mb1JlY29yZCgpIH0gOiB7fSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSB0aGlzLl9fcHVzaChcbiAgICAgICAgICAgICAgb2JqbmFtZSA9PT0gdW5kZWZpbmVkID8gZXh0UmVjb3JkIDogW3JlY29yZFtvYmpuYW1lXSwgZXh0UmVjb3JkXSxcbiAgICAgICAgICAgICAgcHVzaCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IHRoaXMuX19wdXNoKFxuICAgICAgICAgICAgICBvYmpuYW1lID09PSB1bmRlZmluZWQgPyByZWNvcmQgOiBbcmVjb3JkW29iam5hbWVdLCByZWNvcmRdLFxuICAgICAgICAgICAgICBwdXNoLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX19yZXNldFJlY29yZCgpO1xuICAgIH0sXG4gICAgX19maXJzdExpbmVUb0NvbHVtbnM6IGZ1bmN0aW9uIChyZWNvcmQpIHtcbiAgICAgIGNvbnN0IHsgZmlyc3RMaW5lVG9IZWFkZXJzIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9XG4gICAgICAgICAgZmlyc3RMaW5lVG9IZWFkZXJzID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gcmVjb3JkXG4gICAgICAgICAgICA6IGZpcnN0TGluZVRvSGVhZGVycy5jYWxsKG51bGwsIHJlY29yZCk7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9fZXJyb3IoXG4gICAgICAgICAgICBuZXcgQ3N2RXJyb3IoXG4gICAgICAgICAgICAgIFwiQ1NWX0lOVkFMSURfQ09MVU1OX01BUFBJTkdcIixcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFwiSW52YWxpZCBDb2x1bW4gTWFwcGluZzpcIixcbiAgICAgICAgICAgICAgICBcImV4cGVjdCBhbiBhcnJheSBmcm9tIGNvbHVtbiBmdW5jdGlvbixcIixcbiAgICAgICAgICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkoaGVhZGVycyl9YCxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRIZWFkZXJzID0gbm9ybWFsaXplX2NvbHVtbnNfYXJyYXkoaGVhZGVycyk7XG4gICAgICAgIHRoaXMuc3RhdGUuZXhwZWN0ZWRSZWNvcmRMZW5ndGggPSBub3JtYWxpemVkSGVhZGVycy5sZW5ndGg7XG4gICAgICAgIHRoaXMub3B0aW9ucy5jb2x1bW5zID0gbm9ybWFsaXplZEhlYWRlcnM7XG4gICAgICAgIHRoaXMuX19yZXNldFJlY29yZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9fcmVzZXRSZWNvcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmF3ID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUucmF3QnVmZmVyLnJlc2V0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXRlLmVycm9yID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5zdGF0ZS5yZWNvcmQgPSBbXTtcbiAgICAgIHRoaXMuc3RhdGUucmVjb3JkX2xlbmd0aCA9IDA7XG4gICAgfSxcbiAgICBfX29uRmllbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHsgY2FzdCwgZW5jb2RpbmcsIHJ0cmltLCBtYXhfcmVjb3JkX3NpemUgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IHsgZW5hYmxlZCwgd2FzUXVvdGluZyB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIC8vIFNob3J0IGNpcmN1aXQgZm9yIHRoZSBmcm9tX2xpbmUgb3B0aW9uc1xuICAgICAgaWYgKGVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fcmVzZXRGaWVsZCgpO1xuICAgICAgfVxuICAgICAgbGV0IGZpZWxkID0gdGhpcy5zdGF0ZS5maWVsZC50b1N0cmluZyhlbmNvZGluZyk7XG4gICAgICBpZiAocnRyaW0gPT09IHRydWUgJiYgd2FzUXVvdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgZmllbGQgPSBmaWVsZC50cmltUmlnaHQoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjYXN0ID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IFtlcnIsIGZdID0gdGhpcy5fX2Nhc3QoZmllbGQpO1xuICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHJldHVybiBlcnI7XG4gICAgICAgIGZpZWxkID0gZjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGUucmVjb3JkLnB1c2goZmllbGQpO1xuICAgICAgLy8gSW5jcmVtZW50IHJlY29yZCBsZW5ndGggaWYgcmVjb3JkIHNpemUgbXVzdCBub3QgZXhjZWVkIGEgbGltaXRcbiAgICAgIGlmIChtYXhfcmVjb3JkX3NpemUgIT09IDAgJiYgdHlwZW9mIGZpZWxkID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRoaXMuc3RhdGUucmVjb3JkX2xlbmd0aCArPSBmaWVsZC5sZW5ndGg7XG4gICAgICB9XG4gICAgICB0aGlzLl9fcmVzZXRGaWVsZCgpO1xuICAgIH0sXG4gICAgX19yZXNldEZpZWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnN0YXRlLmZpZWxkLnJlc2V0KCk7XG4gICAgICB0aGlzLnN0YXRlLndhc1F1b3RpbmcgPSBmYWxzZTtcbiAgICB9LFxuICAgIF9fcHVzaDogZnVuY3Rpb24gKHJlY29yZCwgcHVzaCkge1xuICAgICAgY29uc3QgeyBvbl9yZWNvcmQgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGlmIChvbl9yZWNvcmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5fX2luZm9SZWNvcmQoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZWNvcmQgPSBvbl9yZWNvcmQuY2FsbChudWxsLCByZWNvcmQsIGluZm8pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWNvcmQgPT09IHVuZGVmaW5lZCB8fCByZWNvcmQgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHB1c2gocmVjb3JkKTtcbiAgICB9LFxuICAgIC8vIFJldHVybiBhIHR1cGxlIHdpdGggdGhlIGVycm9yIGFuZCB0aGUgY2FzdGVkIHZhbHVlXG4gICAgX19jYXN0OiBmdW5jdGlvbiAoZmllbGQpIHtcbiAgICAgIGNvbnN0IHsgY29sdW1ucywgcmVsYXhfY29sdW1uX2NvdW50IH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBjb25zdCBpc0NvbHVtbnMgPSBBcnJheS5pc0FycmF5KGNvbHVtbnMpO1xuICAgICAgLy8gRG9udCBsb29zZSB0aW1lIGNhbGxpbmcgY2FzdFxuICAgICAgLy8gYmVjYXVzZSB0aGUgZmluYWwgcmVjb3JkIGlzIGFuIG9iamVjdFxuICAgICAgLy8gYW5kIHRoaXMgZmllbGQgY2FuJ3QgYmUgYXNzb2NpYXRlZCB0byBhIGtleSBwcmVzZW50IGluIGNvbHVtbnNcbiAgICAgIGlmIChcbiAgICAgICAgaXNDb2x1bW5zID09PSB0cnVlICYmXG4gICAgICAgIHJlbGF4X2NvbHVtbl9jb3VudCAmJlxuICAgICAgICB0aGlzLm9wdGlvbnMuY29sdW1ucy5sZW5ndGggPD0gdGhpcy5zdGF0ZS5yZWNvcmQubGVuZ3RoXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIFt1bmRlZmluZWQsIHVuZGVmaW5lZF07XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGF0ZS5jYXN0RmllbGQgIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5fX2luZm9GaWVsZCgpO1xuICAgICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLnN0YXRlLmNhc3RGaWVsZC5jYWxsKG51bGwsIGZpZWxkLCBpbmZvKV07XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJldHVybiBbZXJyXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19pc0Zsb2F0KGZpZWxkKSkge1xuICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgcGFyc2VGbG9hdChmaWVsZCldO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuY2FzdF9kYXRlICE9PSBmYWxzZSkge1xuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5fX2luZm9GaWVsZCgpO1xuICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdGhpcy5vcHRpb25zLmNhc3RfZGF0ZS5jYWxsKG51bGwsIGZpZWxkLCBpbmZvKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gW3VuZGVmaW5lZCwgZmllbGRdO1xuICAgIH0sXG4gICAgLy8gSGVscGVyIHRvIHRlc3QgaWYgYSBjaGFyYWN0ZXIgaXMgYSBzcGFjZSBvciBhIGxpbmUgZGVsaW1pdGVyXG4gICAgX19pc0NoYXJUcmltYWJsZTogZnVuY3Rpb24gKGJ1ZiwgcG9zKSB7XG4gICAgICBjb25zdCBpc1RyaW0gPSAoYnVmLCBwb3MpID0+IHtcbiAgICAgICAgY29uc3QgeyB0aW1jaGFycyB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgbG9vcDE6IGZvciAobGV0IGkgPSAwOyBpIDwgdGltY2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCB0aW1jaGFyID0gdGltY2hhcnNbaV07XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aW1jaGFyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAodGltY2hhcltqXSAhPT0gYnVmW3BvcyArIGpdKSBjb250aW51ZSBsb29wMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRpbWNoYXIubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBpc1RyaW0oYnVmLCBwb3MpO1xuICAgIH0sXG4gICAgLy8gS2VlcCBpdCBpbiBjYXNlIHdlIGltcGxlbWVudCB0aGUgYGNhc3RfaW50YCBvcHRpb25cbiAgICAvLyBfX2lzSW50KHZhbHVlKXtcbiAgICAvLyAgIC8vIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KHZhbHVlKSlcbiAgICAvLyAgIC8vIHJldHVybiAhaXNOYU4oIHBhcnNlSW50KCBvYmogKSApO1xuICAgIC8vICAgcmV0dXJuIC9eKFxcLXxcXCspP1sxLTldWzAtOV0qJC8udGVzdCh2YWx1ZSlcbiAgICAvLyB9XG4gICAgX19pc0Zsb2F0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAtIHBhcnNlRmxvYXQodmFsdWUpICsgMSA+PSAwOyAvLyBCb3Jyb3dlZCBmcm9tIGpxdWVyeVxuICAgIH0sXG4gICAgX19jb21wYXJlQnl0ZXM6IGZ1bmN0aW9uIChzb3VyY2VCdWYsIHRhcmdldEJ1ZiwgdGFyZ2V0UG9zLCBmaXJzdEJ5dGUpIHtcbiAgICAgIGlmIChzb3VyY2VCdWZbMF0gIT09IGZpcnN0Qnl0ZSkgcmV0dXJuIDA7XG4gICAgICBjb25zdCBzb3VyY2VMZW5ndGggPSBzb3VyY2VCdWYubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb3VyY2VMZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc291cmNlQnVmW2ldICE9PSB0YXJnZXRCdWZbdGFyZ2V0UG9zICsgaV0pIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNvdXJjZUxlbmd0aDtcbiAgICB9LFxuICAgIF9faXNEZWxpbWl0ZXI6IGZ1bmN0aW9uIChidWYsIHBvcywgY2hyKSB7XG4gICAgICBjb25zdCB7IGRlbGltaXRlciwgaWdub3JlX2xhc3RfZGVsaW1pdGVycyB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgaWYgKFxuICAgICAgICBpZ25vcmVfbGFzdF9kZWxpbWl0ZXJzID09PSB0cnVlICYmXG4gICAgICAgIHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCA9PT0gdGhpcy5vcHRpb25zLmNvbHVtbnMubGVuZ3RoIC0gMVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgaWdub3JlX2xhc3RfZGVsaW1pdGVycyAhPT0gZmFsc2UgJiZcbiAgICAgICAgdHlwZW9mIGlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPT09IFwibnVtYmVyXCIgJiZcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWNvcmQubGVuZ3RoID09PSBpZ25vcmVfbGFzdF9kZWxpbWl0ZXJzIC0gMVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgbG9vcDE6IGZvciAobGV0IGkgPSAwOyBpIDwgZGVsaW1pdGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRlbCA9IGRlbGltaXRlcltpXTtcbiAgICAgICAgaWYgKGRlbFswXSA9PT0gY2hyKSB7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCBkZWwubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChkZWxbal0gIT09IGJ1Zltwb3MgKyBqXSkgY29udGludWUgbG9vcDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBkZWwubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9LFxuICAgIF9faXNSZWNvcmREZWxpbWl0ZXI6IGZ1bmN0aW9uIChjaHIsIGJ1ZiwgcG9zKSB7XG4gICAgICBjb25zdCB7IHJlY29yZF9kZWxpbWl0ZXIgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IHJlY29yZERlbGltaXRlckxlbmd0aCA9IHJlY29yZF9kZWxpbWl0ZXIubGVuZ3RoO1xuICAgICAgbG9vcDE6IGZvciAobGV0IGkgPSAwOyBpIDwgcmVjb3JkRGVsaW1pdGVyTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmQgPSByZWNvcmRfZGVsaW1pdGVyW2ldO1xuICAgICAgICBjb25zdCByZExlbmd0aCA9IHJkLmxlbmd0aDtcbiAgICAgICAgaWYgKHJkWzBdICE9PSBjaHIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IHJkTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBpZiAocmRbal0gIT09IGJ1Zltwb3MgKyBqXSkge1xuICAgICAgICAgICAgY29udGludWUgbG9vcDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZC5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9LFxuICAgIF9faXNFc2NhcGU6IGZ1bmN0aW9uIChidWYsIHBvcywgY2hyKSB7XG4gICAgICBjb25zdCB7IGVzY2FwZSB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgaWYgKGVzY2FwZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgbCA9IGVzY2FwZS5sZW5ndGg7XG4gICAgICBpZiAoZXNjYXBlWzBdID09PSBjaHIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoZXNjYXBlW2ldICE9PSBidWZbcG9zICsgaV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBfX2lzUXVvdGU6IGZ1bmN0aW9uIChidWYsIHBvcykge1xuICAgICAgY29uc3QgeyBxdW90ZSB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgaWYgKHF1b3RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBsID0gcXVvdGUubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKHF1b3RlW2ldICE9PSBidWZbcG9zICsgaV0pIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgX19hdXRvRGlzY292ZXJSZWNvcmREZWxpbWl0ZXI6IGZ1bmN0aW9uIChidWYsIHBvcykge1xuICAgICAgY29uc3QgeyBlbmNvZGluZyB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgLy8gTm90ZSwgd2UgZG9uJ3QgbmVlZCB0byBjYWNoZSB0aGlzIGluZm9ybWF0aW9uIGluIHN0YXRlLFxuICAgICAgLy8gSXQgaXMgb25seSBjYWxsZWQgb24gdGhlIGZpcnN0IGxpbmUgdW50aWwgd2UgZmluZCBvdXQgYSBzdWl0YWJsZVxuICAgICAgLy8gcmVjb3JkIGRlbGltaXRlci5cbiAgICAgIGNvbnN0IHJkcyA9IFtcbiAgICAgICAgLy8gSW1wb3J0YW50LCB0aGUgd2luZG93cyBsaW5lIGVuZGluZyBtdXN0IGJlIGJlZm9yZSBtYWMgb3MgOVxuICAgICAgICBCdWZmZXIuZnJvbShcIlxcclxcblwiLCBlbmNvZGluZyksXG4gICAgICAgIEJ1ZmZlci5mcm9tKFwiXFxuXCIsIGVuY29kaW5nKSxcbiAgICAgICAgQnVmZmVyLmZyb20oXCJcXHJcIiwgZW5jb2RpbmcpLFxuICAgICAgXTtcbiAgICAgIGxvb3A6IGZvciAobGV0IGkgPSAwOyBpIDwgcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGwgPSByZHNbaV0ubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGw7IGorKykge1xuICAgICAgICAgIGlmIChyZHNbaV1bal0gIT09IGJ1Zltwb3MgKyBqXSkge1xuICAgICAgICAgICAgY29udGludWUgbG9vcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIucHVzaChyZHNbaV0pO1xuICAgICAgICB0aGlzLnN0YXRlLnJlY29yZERlbGltaXRlck1heExlbmd0aCA9IHJkc1tpXS5sZW5ndGg7XG4gICAgICAgIHJldHVybiByZHNbaV0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSxcbiAgICBfX2Vycm9yOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICBjb25zdCB7IGVuY29kaW5nLCByYXcsIHNraXBfcmVjb3Jkc193aXRoX2Vycm9yIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBjb25zdCBlcnIgPSB0eXBlb2YgbXNnID09PSBcInN0cmluZ1wiID8gbmV3IEVycm9yKG1zZykgOiBtc2c7XG4gICAgICBpZiAoc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWNvcmRIYXNFcnJvciA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25fc2tpcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uX3NraXAoXG4gICAgICAgICAgICBlcnIsXG4gICAgICAgICAgICByYXcgPyB0aGlzLnN0YXRlLnJhd0J1ZmZlci50b1N0cmluZyhlbmNvZGluZykgOiB1bmRlZmluZWQsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLmVtaXQoJ3NraXAnLCBlcnIsIHJhdyA/IHRoaXMuc3RhdGUucmF3QnVmZmVyLnRvU3RyaW5nKGVuY29kaW5nKSA6IHVuZGVmaW5lZCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgfVxuICAgIH0sXG4gICAgX19pbmZvRGF0YVNldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4udGhpcy5pbmZvLFxuICAgICAgICBjb2x1bW5zOiB0aGlzLm9wdGlvbnMuY29sdW1ucyxcbiAgICAgIH07XG4gICAgfSxcbiAgICBfX2luZm9SZWNvcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHsgY29sdW1ucywgcmF3LCBlbmNvZGluZyB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4udGhpcy5fX2luZm9EYXRhU2V0KCksXG4gICAgICAgIGVycm9yOiB0aGlzLnN0YXRlLmVycm9yLFxuICAgICAgICBoZWFkZXI6IGNvbHVtbnMgPT09IHRydWUsXG4gICAgICAgIGluZGV4OiB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGgsXG4gICAgICAgIHJhdzogcmF3ID8gdGhpcy5zdGF0ZS5yYXdCdWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpIDogdW5kZWZpbmVkLFxuICAgICAgfTtcbiAgICB9LFxuICAgIF9faW5mb0ZpZWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCB7IGNvbHVtbnMgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGlzQ29sdW1ucyA9IEFycmF5LmlzQXJyYXkoY29sdW1ucyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50aGlzLl9faW5mb1JlY29yZCgpLFxuICAgICAgICBjb2x1bW46XG4gICAgICAgICAgaXNDb2x1bW5zID09PSB0cnVlXG4gICAgICAgICAgICA/IGNvbHVtbnMubGVuZ3RoID4gdGhpcy5zdGF0ZS5yZWNvcmQubGVuZ3RoXG4gICAgICAgICAgICAgID8gY29sdW1uc1t0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGhdLm5hbWVcbiAgICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICAgICA6IHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCxcbiAgICAgICAgcXVvdGluZzogdGhpcy5zdGF0ZS53YXNRdW90aW5nLFxuICAgICAgfTtcbiAgICB9LFxuICB9O1xufTtcblxuY29uc3QgcGFyc2UgPSBmdW5jdGlvbiAoZGF0YSwgb3B0cyA9IHt9KSB7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGRhdGEgPSBCdWZmZXIuZnJvbShkYXRhKTtcbiAgfVxuICBjb25zdCByZWNvcmRzID0gb3B0cyAmJiBvcHRzLm9iam5hbWUgPyB7fSA6IFtdO1xuICBjb25zdCBwYXJzZXIgPSB0cmFuc2Zvcm0ob3B0cyk7XG4gIGNvbnN0IHB1c2ggPSAocmVjb3JkKSA9PiB7XG4gICAgaWYgKHBhcnNlci5vcHRpb25zLm9iam5hbWUgPT09IHVuZGVmaW5lZCkgcmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgZWxzZSB7XG4gICAgICByZWNvcmRzW3JlY29yZFswXV0gPSByZWNvcmRbMV07XG4gICAgfVxuICB9O1xuICBjb25zdCBjbG9zZSA9ICgpID0+IHt9O1xuICBjb25zdCBlcnIxID0gcGFyc2VyLnBhcnNlKGRhdGEsIGZhbHNlLCBwdXNoLCBjbG9zZSk7XG4gIGlmIChlcnIxICE9PSB1bmRlZmluZWQpIHRocm93IGVycjE7XG4gIGNvbnN0IGVycjIgPSBwYXJzZXIucGFyc2UodW5kZWZpbmVkLCB0cnVlLCBwdXNoLCBjbG9zZSk7XG4gIGlmIChlcnIyICE9PSB1bmRlZmluZWQpIHRocm93IGVycjI7XG4gIHJldHVybiByZWNvcmRzO1xufTtcblxuZXhwb3J0cy5Dc3ZFcnJvciA9IENzdkVycm9yO1xuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBMb2Rhc2ggaW1wbGVtZW50YXRpb24gb2YgYGdldGBcblxuY29uc3QgY2hhckNvZGVPZkRvdCA9IFwiLlwiLmNoYXJDb2RlQXQoMCk7XG5jb25zdCByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcbmNvbnN0IHJlUHJvcE5hbWUgPSBSZWdFeHAoXG4gIC8vIE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBkb3Qgb3IgYnJhY2tldC5cbiAgXCJbXi5bXFxcXF1dK1wiICtcbiAgICBcInxcIiArXG4gICAgLy8gT3IgbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIGJyYWNrZXRzLlxuICAgIFwiXFxcXFsoPzpcIiArXG4gICAgLy8gTWF0Y2ggYSBub24tc3RyaW5nIGV4cHJlc3Npb24uXG4gICAgXCIoW15cXFwiJ11bXltdKilcIiArXG4gICAgXCJ8XCIgK1xuICAgIC8vIE9yIG1hdGNoIHN0cmluZ3MgKHN1cHBvcnRzIGVzY2FwaW5nIGNoYXJhY3RlcnMpLlxuICAgIFwiKFtcXFwiJ10pKCg/Oig/IVxcXFwyKVteXFxcXFxcXFxdfFxcXFxcXFxcLikqPylcXFxcMlwiICtcbiAgICBcIilcXFxcXVwiICtcbiAgICBcInxcIiArXG4gICAgLy8gT3IgbWF0Y2ggXCJcIiBhcyB0aGUgc3BhY2UgYmV0d2VlbiBjb25zZWN1dGl2ZSBkb3RzIG9yIGVtcHR5IGJyYWNrZXRzLlxuICAgIFwiKD89KD86XFxcXC58XFxcXFtcXFxcXSkoPzpcXFxcLnxcXFxcW1xcXFxdfCQpKVwiLFxuICBcImdcIixcbik7XG5jb25zdCByZUlzRGVlcFByb3AgPSAvXFwufFxcWyg/OlteW1xcXV0qfChbXCInXSkoPzooPyFcXDEpW15cXFxcXXxcXFxcLikqP1xcMSlcXF0vO1xuY29uc3QgcmVJc1BsYWluUHJvcCA9IC9eXFx3KiQvO1xuXG5jb25zdCBnZXRUYWcgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59O1xuXG5jb25zdCBpc1N5bWJvbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKFxuICAgIHR5cGUgPT09IFwic3ltYm9sXCIgfHxcbiAgICAodHlwZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAmJiBnZXRUYWcodmFsdWUpID09PSBcIltvYmplY3QgU3ltYm9sXVwiKVxuICApO1xufTtcblxuY29uc3QgaXNLZXkgPSBmdW5jdGlvbiAodmFsdWUsIG9iamVjdCkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKFxuICAgIHR5cGUgPT09IFwibnVtYmVyXCIgfHxcbiAgICB0eXBlID09PSBcInN5bWJvbFwiIHx8XG4gICAgdHlwZSA9PT0gXCJib29sZWFuXCIgfHxcbiAgICAhdmFsdWUgfHxcbiAgICBpc1N5bWJvbCh2YWx1ZSlcbiAgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIChcbiAgICByZUlzUGxhaW5Qcm9wLnRlc3QodmFsdWUpIHx8XG4gICAgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSlcbiAgKTtcbn07XG5cbmNvbnN0IHN0cmluZ1RvUGF0aCA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGlmIChzdHJpbmcuY2hhckNvZGVBdCgwKSA9PT0gY2hhckNvZGVPZkRvdCkge1xuICAgIHJlc3VsdC5wdXNoKFwiXCIpO1xuICB9XG4gIHN0cmluZy5yZXBsYWNlKHJlUHJvcE5hbWUsIGZ1bmN0aW9uIChtYXRjaCwgZXhwcmVzc2lvbiwgcXVvdGUsIHN1YlN0cmluZykge1xuICAgIGxldCBrZXkgPSBtYXRjaDtcbiAgICBpZiAocXVvdGUpIHtcbiAgICAgIGtleSA9IHN1YlN0cmluZy5yZXBsYWNlKHJlRXNjYXBlQ2hhciwgXCIkMVwiKTtcbiAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24pIHtcbiAgICAgIGtleSA9IGV4cHJlc3Npb24udHJpbSgpO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChrZXkpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IGNhc3RQYXRoID0gZnVuY3Rpb24gKHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpc0tleSh2YWx1ZSwgb2JqZWN0KSA/IFt2YWx1ZV0gOiBzdHJpbmdUb1BhdGgodmFsdWUpO1xuICB9XG59O1xuXG5jb25zdCB0b0tleSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiIHx8IGlzU3ltYm9sKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICBjb25zdCByZXN1bHQgPSBgJHt2YWx1ZX1gO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgcmV0dXJuIHJlc3VsdCA9PSBcIjBcIiAmJiAxIC8gdmFsdWUgPT0gLUlORklOSVRZID8gXCItMFwiIDogcmVzdWx0O1xufTtcblxuY29uc3QgZ2V0ID0gZnVuY3Rpb24gKG9iamVjdCwgcGF0aCkge1xuICBwYXRoID0gY2FzdFBhdGgocGF0aCwgb2JqZWN0KTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgY29uc3QgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG4gIHdoaWxlIChvYmplY3QgIT0gbnVsbCAmJiBpbmRleCA8IGxlbmd0aCkge1xuICAgIG9iamVjdCA9IG9iamVjdFt0b0tleShwYXRoW2luZGV4KytdKV07XG4gIH1cbiAgcmV0dXJuIGluZGV4ICYmIGluZGV4ID09PSBsZW5ndGggPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59O1xuXG5jb25zdCBpc19vYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiICYmIG9iaiAhPT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShvYmopO1xufTtcblxuY29uc3Qgbm9ybWFsaXplX2NvbHVtbnMgPSBmdW5jdGlvbiAoY29sdW1ucykge1xuICBpZiAoY29sdW1ucyA9PT0gdW5kZWZpbmVkIHx8IGNvbHVtbnMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gW3VuZGVmaW5lZCwgdW5kZWZpbmVkXTtcbiAgfVxuICBpZiAodHlwZW9mIGNvbHVtbnMgIT09IFwib2JqZWN0XCIpIHtcbiAgICByZXR1cm4gW0Vycm9yKCdJbnZhbGlkIG9wdGlvbiBcImNvbHVtbnNcIjogZXhwZWN0IGFuIGFycmF5IG9yIGFuIG9iamVjdCcpXTtcbiAgfVxuICBpZiAoIUFycmF5LmlzQXJyYXkoY29sdW1ucykpIHtcbiAgICBjb25zdCBuZXdjb2x1bW5zID0gW107XG4gICAgZm9yIChjb25zdCBrIGluIGNvbHVtbnMpIHtcbiAgICAgIG5ld2NvbHVtbnMucHVzaCh7XG4gICAgICAgIGtleTogayxcbiAgICAgICAgaGVhZGVyOiBjb2x1bW5zW2tdLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbHVtbnMgPSBuZXdjb2x1bW5zO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG5ld2NvbHVtbnMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBjb2x1bW5zKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbHVtbiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBuZXdjb2x1bW5zLnB1c2goe1xuICAgICAgICAgIGtleTogY29sdW1uLFxuICAgICAgICAgIGhlYWRlcjogY29sdW1uLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHR5cGVvZiBjb2x1bW4gPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgY29sdW1uICE9PSBudWxsICYmXG4gICAgICAgICFBcnJheS5pc0FycmF5KGNvbHVtbilcbiAgICAgICkge1xuICAgICAgICBpZiAoIWNvbHVtbi5rZXkpIHtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgRXJyb3IoJ0ludmFsaWQgY29sdW1uIGRlZmluaXRpb246IHByb3BlcnR5IFwia2V5XCIgaXMgcmVxdWlyZWQnKSxcbiAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2x1bW4uaGVhZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb2x1bW4uaGVhZGVyID0gY29sdW1uLmtleTtcbiAgICAgICAgfVxuICAgICAgICBuZXdjb2x1bW5zLnB1c2goY29sdW1uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgRXJyb3IoXCJJbnZhbGlkIGNvbHVtbiBkZWZpbml0aW9uOiBleHBlY3QgYSBzdHJpbmcgb3IgYW4gb2JqZWN0XCIpLFxuICAgICAgICBdO1xuICAgICAgfVxuICAgIH1cbiAgICBjb2x1bW5zID0gbmV3Y29sdW1ucztcbiAgfVxuICByZXR1cm4gW3VuZGVmaW5lZCwgY29sdW1uc107XG59O1xuXG5jbGFzcyBDc3ZFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoY29kZSwgbWVzc2FnZSwgLi4uY29udGV4dHMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShtZXNzYWdlKSkgbWVzc2FnZSA9IG1lc3NhZ2Uuam9pbihcIiBcIik7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIENzdkVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICBmb3IgKGNvbnN0IGNvbnRleHQgb2YgY29udGV4dHMpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjb250ZXh0W2tleV07XG4gICAgICAgIHRoaXNba2V5XSA9IEJ1ZmZlci5pc0J1ZmZlcih2YWx1ZSlcbiAgICAgICAgICA/IHZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgICA6IHZhbHVlID09IG51bGxcbiAgICAgICAgICAgID8gdmFsdWVcbiAgICAgICAgICAgIDogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCB1bmRlcnNjb3JlID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24gKF8sIG1hdGNoKSB7XG4gICAgcmV0dXJuIFwiX1wiICsgbWF0Y2gudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59O1xuXG5jb25zdCBub3JtYWxpemVfb3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gIGNvbnN0IG9wdGlvbnMgPSB7fTtcbiAgLy8gTWVyZ2Ugd2l0aCB1c2VyIG9wdGlvbnNcbiAgZm9yIChjb25zdCBvcHQgaW4gb3B0cykge1xuICAgIG9wdGlvbnNbdW5kZXJzY29yZShvcHQpXSA9IG9wdHNbb3B0XTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBib21gXG4gIGlmIChcbiAgICBvcHRpb25zLmJvbSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5ib20gPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmJvbSA9PT0gZmFsc2VcbiAgKSB7XG4gICAgb3B0aW9ucy5ib20gPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmJvbSAhPT0gdHJ1ZSkge1xuICAgIHJldHVybiBbXG4gICAgICBuZXcgQ3N2RXJyb3IoXCJDU1ZfT1BUSU9OX0JPT0xFQU5fSU5WQUxJRF9UWVBFXCIsIFtcbiAgICAgICAgXCJvcHRpb24gYGJvbWAgaXMgb3B0aW9uYWwgYW5kIG11c3QgYmUgYSBib29sZWFuIHZhbHVlLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5ib20pfWAsXG4gICAgICBdKSxcbiAgICBdO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGRlbGltaXRlcmBcbiAgaWYgKG9wdGlvbnMuZGVsaW1pdGVyID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5kZWxpbWl0ZXIgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLmRlbGltaXRlciA9IFwiLFwiO1xuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLmRlbGltaXRlcikpIHtcbiAgICBvcHRpb25zLmRlbGltaXRlciA9IG9wdGlvbnMuZGVsaW1pdGVyLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuZGVsaW1pdGVyICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBDc3ZFcnJvcihcIkNTVl9PUFRJT05fREVMSU1JVEVSX0lOVkFMSURfVFlQRVwiLCBbXG4gICAgICAgIFwib3B0aW9uIGBkZWxpbWl0ZXJgIG11c3QgYmUgYSBidWZmZXIgb3IgYSBzdHJpbmcsXCIsXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmRlbGltaXRlcil9YCxcbiAgICAgIF0pLFxuICAgIF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcXVvdGVgXG4gIGlmIChvcHRpb25zLnF1b3RlID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5xdW90ZSA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMucXVvdGUgPSAnXCInO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMucXVvdGUgPT09IHRydWUpIHtcbiAgICBvcHRpb25zLnF1b3RlID0gJ1wiJztcbiAgfSBlbHNlIGlmIChvcHRpb25zLnF1b3RlID09PSBmYWxzZSkge1xuICAgIG9wdGlvbnMucXVvdGUgPSBcIlwiO1xuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLnF1b3RlKSkge1xuICAgIG9wdGlvbnMucXVvdGUgPSBvcHRpb25zLnF1b3RlLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMucXVvdGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgbmV3IENzdkVycm9yKFwiQ1NWX09QVElPTl9RVU9URV9JTlZBTElEX1RZUEVcIiwgW1xuICAgICAgICBcIm9wdGlvbiBgcXVvdGVgIG11c3QgYmUgYSBib29sZWFuLCBhIGJ1ZmZlciBvciBhIHN0cmluZyxcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucXVvdGUpfWAsXG4gICAgICBdKSxcbiAgICBdO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHF1b3RlZGBcbiAgaWYgKG9wdGlvbnMucXVvdGVkID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5xdW90ZWQgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLnF1b3RlZCA9IGZhbHNlO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGVzY2FwZV9mb3JtdWxhc2BcbiAgaWYgKFxuICAgIG9wdGlvbnMuZXNjYXBlX2Zvcm11bGFzID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmVzY2FwZV9mb3JtdWxhcyA9PT0gbnVsbFxuICApIHtcbiAgICBvcHRpb25zLmVzY2FwZV9mb3JtdWxhcyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmVzY2FwZV9mb3JtdWxhcyAhPT0gXCJib29sZWFuXCIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgbmV3IENzdkVycm9yKFwiQ1NWX09QVElPTl9FU0NBUEVfRk9STVVMQVNfSU5WQUxJRF9UWVBFXCIsIFtcbiAgICAgICAgXCJvcHRpb24gYGVzY2FwZV9mb3JtdWxhc2AgbXVzdCBiZSBhIGJvb2xlYW4sXCIsXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmVzY2FwZV9mb3JtdWxhcyl9YCxcbiAgICAgIF0pLFxuICAgIF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcXVvdGVkX2VtcHR5YFxuICBpZiAob3B0aW9ucy5xdW90ZWRfZW1wdHkgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlZF9lbXB0eSA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMucXVvdGVkX2VtcHR5ID0gdW5kZWZpbmVkO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHF1b3RlZF9tYXRjaGBcbiAgaWYgKFxuICAgIG9wdGlvbnMucXVvdGVkX21hdGNoID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnF1b3RlZF9tYXRjaCA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMucXVvdGVkX21hdGNoID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLnF1b3RlZF9tYXRjaCA9IG51bGw7XG4gIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5xdW90ZWRfbWF0Y2gpKSB7XG4gICAgb3B0aW9ucy5xdW90ZWRfbWF0Y2ggPSBbb3B0aW9ucy5xdW90ZWRfbWF0Y2hdO1xuICB9XG4gIGlmIChvcHRpb25zLnF1b3RlZF9tYXRjaCkge1xuICAgIGZvciAoY29uc3QgcXVvdGVkX21hdGNoIG9mIG9wdGlvbnMucXVvdGVkX21hdGNoKSB7XG4gICAgICBjb25zdCBpc1N0cmluZyA9IHR5cGVvZiBxdW90ZWRfbWF0Y2ggPT09IFwic3RyaW5nXCI7XG4gICAgICBjb25zdCBpc1JlZ0V4cCA9IHF1b3RlZF9tYXRjaCBpbnN0YW5jZW9mIFJlZ0V4cDtcbiAgICAgIGlmICghaXNTdHJpbmcgJiYgIWlzUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgRXJyb3IoXG4gICAgICAgICAgICBgSW52YWxpZCBPcHRpb246IHF1b3RlZF9tYXRjaCBtdXN0IGJlIGEgc3RyaW5nIG9yIGEgcmVnZXgsIGdvdCAke0pTT04uc3RyaW5naWZ5KHF1b3RlZF9tYXRjaCl9YCxcbiAgICAgICAgICApLFxuICAgICAgICBdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBxdW90ZWRfc3RyaW5nYFxuICBpZiAob3B0aW9ucy5xdW90ZWRfc3RyaW5nID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5xdW90ZWRfc3RyaW5nID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5xdW90ZWRfc3RyaW5nID0gZmFsc2U7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZW9mYFxuICBpZiAob3B0aW9ucy5lb2YgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmVvZiA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMuZW9mID0gdHJ1ZTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBlc2NhcGVgXG4gIGlmIChvcHRpb25zLmVzY2FwZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuZXNjYXBlID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5lc2NhcGUgPSAnXCInO1xuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLmVzY2FwZSkpIHtcbiAgICBvcHRpb25zLmVzY2FwZSA9IG9wdGlvbnMuZXNjYXBlLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuZXNjYXBlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIEVycm9yKFxuICAgICAgICBgSW52YWxpZCBPcHRpb246IGVzY2FwZSBtdXN0IGJlIGEgYnVmZmVyIG9yIGEgc3RyaW5nLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmVzY2FwZSl9YCxcbiAgICAgICksXG4gICAgXTtcbiAgfVxuICBpZiAob3B0aW9ucy5lc2NhcGUubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBbXG4gICAgICBFcnJvcihcbiAgICAgICAgYEludmFsaWQgT3B0aW9uOiBlc2NhcGUgbXVzdCBiZSBvbmUgY2hhcmFjdGVyLCBnb3QgJHtvcHRpb25zLmVzY2FwZS5sZW5ndGh9IGNoYXJhY3RlcnNgLFxuICAgICAgKSxcbiAgICBdO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGhlYWRlcmBcbiAgaWYgKG9wdGlvbnMuaGVhZGVyID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5oZWFkZXIgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLmhlYWRlciA9IGZhbHNlO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGNvbHVtbnNgXG4gIGNvbnN0IFtlcnJDb2x1bW5zLCBjb2x1bW5zXSA9IG5vcm1hbGl6ZV9jb2x1bW5zKG9wdGlvbnMuY29sdW1ucyk7XG4gIGlmIChlcnJDb2x1bW5zICE9PSB1bmRlZmluZWQpIHJldHVybiBbZXJyQ29sdW1uc107XG4gIG9wdGlvbnMuY29sdW1ucyA9IGNvbHVtbnM7XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHF1b3RlZGBcbiAgaWYgKG9wdGlvbnMucXVvdGVkID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5xdW90ZWQgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLnF1b3RlZCA9IGZhbHNlO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGNhc3RgXG4gIGlmIChvcHRpb25zLmNhc3QgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmNhc3QgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLmNhc3QgPSB7fTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGNhc3QuYmlnaW50XG4gIGlmIChvcHRpb25zLmNhc3QuYmlnaW50ID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5jYXN0LmJpZ2ludCA9PT0gbnVsbCkge1xuICAgIC8vIENhc3QgYm9vbGVhbiB0byBzdHJpbmcgYnkgZGVmYXVsdFxuICAgIG9wdGlvbnMuY2FzdC5iaWdpbnQgPSAodmFsdWUpID0+IFwiXCIgKyB2YWx1ZTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGNhc3QuYm9vbGVhblxuICBpZiAob3B0aW9ucy5jYXN0LmJvb2xlYW4gPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmNhc3QuYm9vbGVhbiA9PT0gbnVsbCkge1xuICAgIC8vIENhc3QgYm9vbGVhbiB0byBzdHJpbmcgYnkgZGVmYXVsdFxuICAgIG9wdGlvbnMuY2FzdC5ib29sZWFuID0gKHZhbHVlKSA9PiAodmFsdWUgPyBcIjFcIiA6IFwiXCIpO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gY2FzdC5kYXRlXG4gIGlmIChvcHRpb25zLmNhc3QuZGF0ZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuY2FzdC5kYXRlID09PSBudWxsKSB7XG4gICAgLy8gQ2FzdCBkYXRlIHRvIHRpbWVzdGFtcCBzdHJpbmcgYnkgZGVmYXVsdFxuICAgIG9wdGlvbnMuY2FzdC5kYXRlID0gKHZhbHVlKSA9PiBcIlwiICsgdmFsdWUuZ2V0VGltZSgpO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gY2FzdC5udW1iZXJcbiAgaWYgKG9wdGlvbnMuY2FzdC5udW1iZXIgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmNhc3QubnVtYmVyID09PSBudWxsKSB7XG4gICAgLy8gQ2FzdCBudW1iZXIgdG8gc3RyaW5nIHVzaW5nIG5hdGl2ZSBjYXN0aW5nIGJ5IGRlZmF1bHRcbiAgICBvcHRpb25zLmNhc3QubnVtYmVyID0gKHZhbHVlKSA9PiBcIlwiICsgdmFsdWU7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBjYXN0Lm9iamVjdFxuICBpZiAob3B0aW9ucy5jYXN0Lm9iamVjdCA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuY2FzdC5vYmplY3QgPT09IG51bGwpIHtcbiAgICAvLyBTdHJpbmdpZnkgb2JqZWN0IGFzIEpTT04gYnkgZGVmYXVsdFxuICAgIG9wdGlvbnMuY2FzdC5vYmplY3QgPSAodmFsdWUpID0+IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGNhc3Quc3RyaW5nXG4gIGlmIChvcHRpb25zLmNhc3Quc3RyaW5nID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5jYXN0LnN0cmluZyA9PT0gbnVsbCkge1xuICAgIC8vIExlYXZlIHN0cmluZyB1bnRvdWNoZWRcbiAgICBvcHRpb25zLmNhc3Quc3RyaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBvbl9yZWNvcmRgXG4gIGlmIChcbiAgICBvcHRpb25zLm9uX3JlY29yZCAhPT0gdW5kZWZpbmVkICYmXG4gICAgdHlwZW9mIG9wdGlvbnMub25fcmVjb3JkICE9PSBcImZ1bmN0aW9uXCJcbiAgKSB7XG4gICAgcmV0dXJuIFtFcnJvcihgSW52YWxpZCBPcHRpb246IFwib25fcmVjb3JkXCIgbXVzdCBiZSBhIGZ1bmN0aW9uLmApXTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGByZWNvcmRfZGVsaW1pdGVyYFxuICBpZiAoXG4gICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPT09IG51bGxcbiAgKSB7XG4gICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gXCJcXG5cIjtcbiAgfSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyKSkge1xuICAgIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciA9IG9wdGlvbnMucmVjb3JkX2RlbGltaXRlci50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogcmVjb3JkX2RlbGltaXRlciBtdXN0IGJlIGEgYnVmZmVyIG9yIGEgc3RyaW5nLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIpfWAsXG4gICAgICApLFxuICAgIF07XG4gIH1cbiAgc3dpdGNoIChvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIpIHtcbiAgICBjYXNlIFwidW5peFwiOlxuICAgICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gXCJcXG5cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJtYWNcIjpcbiAgICAgIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciA9IFwiXFxyXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwid2luZG93c1wiOlxuICAgICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gXCJcXHJcXG5cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJhc2NpaVwiOlxuICAgICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gXCJcXHUwMDFlXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidW5pY29kZVwiOlxuICAgICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gXCJcXHUyMDI4XCI7XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gW3VuZGVmaW5lZCwgb3B0aW9uc107XG59O1xuXG5jb25zdCBib21fdXRmOCA9IEJ1ZmZlci5mcm9tKFsyMzksIDE4NywgMTkxXSk7XG5cbmNvbnN0IHN0cmluZ2lmaWVyID0gZnVuY3Rpb24gKG9wdGlvbnMsIHN0YXRlLCBpbmZvKSB7XG4gIHJldHVybiB7XG4gICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICBzdGF0ZTogc3RhdGUsXG4gICAgaW5mbzogaW5mbyxcbiAgICBfX3RyYW5zZm9ybTogZnVuY3Rpb24gKGNodW5rLCBwdXNoKSB7XG4gICAgICAvLyBDaHVuayB2YWxpZGF0aW9uXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2h1bmspICYmIHR5cGVvZiBjaHVuayAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgUmVjb3JkOiBleHBlY3QgYW4gYXJyYXkgb3IgYW4gb2JqZWN0LCBnb3QgJHtKU09OLnN0cmluZ2lmeShjaHVuayl9YCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIC8vIERldGVjdCBjb2x1bW5zIGZyb20gdGhlIGZpcnN0IHJlY29yZFxuICAgICAgaWYgKHRoaXMuaW5mby5yZWNvcmRzID09PSAwKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNodW5rKSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5oZWFkZXIgPT09IHRydWUgJiZcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jb2x1bW5zID09PSB1bmRlZmluZWRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBFcnJvcihcbiAgICAgICAgICAgICAgXCJVbmRpc2NvdmVyYWJsZSBDb2x1bW5zOiBoZWFkZXIgb3B0aW9uIHJlcXVpcmVzIGNvbHVtbiBvcHRpb24gb3Igb2JqZWN0IHJlY29yZHNcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5jb2x1bW5zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBbZXJyLCBjb2x1bW5zXSA9IG5vcm1hbGl6ZV9jb2x1bW5zKE9iamVjdC5rZXlzKGNodW5rKSk7XG4gICAgICAgICAgaWYgKGVycikgcmV0dXJuO1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5jb2x1bW5zID0gY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW1pdCB0aGUgaGVhZGVyXG4gICAgICBpZiAodGhpcy5pbmZvLnJlY29yZHMgPT09IDApIHtcbiAgICAgICAgdGhpcy5ib20ocHVzaCk7XG4gICAgICAgIGNvbnN0IGVyciA9IHRoaXMuaGVhZGVycyhwdXNoKTtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGVycjtcbiAgICAgIH1cbiAgICAgIC8vIEVtaXQgYW5kIHN0cmluZ2lmeSB0aGUgcmVjb3JkIGlmIGFuIG9iamVjdCBvciBhbiBhcnJheVxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gdGhpcy5lbWl0KCdyZWNvcmQnLCBjaHVuaywgdGhpcy5pbmZvLnJlY29yZHMpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm9uX3JlY29yZCkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5vbl9yZWNvcmQoY2h1bmssIHRoaXMuaW5mby5yZWNvcmRzKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBlcnI7XG4gICAgICB9XG4gICAgICAvLyBDb252ZXJ0IHRoZSByZWNvcmQgaW50byBhIHN0cmluZ1xuICAgICAgbGV0IGVyciwgY2h1bmtfc3RyaW5nO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lb2YpIHtcbiAgICAgICAgW2VyciwgY2h1bmtfc3RyaW5nXSA9IHRoaXMuc3RyaW5naWZ5KGNodW5rKTtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGVycjtcbiAgICAgICAgaWYgKGNodW5rX3N0cmluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNodW5rX3N0cmluZyA9IGNodW5rX3N0cmluZyArIHRoaXMub3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBbZXJyLCBjaHVua19zdHJpbmddID0gdGhpcy5zdHJpbmdpZnkoY2h1bmspO1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gZXJyO1xuICAgICAgICBpZiAoY2h1bmtfc3RyaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXIgfHwgdGhpcy5pbmZvLnJlY29yZHMpIHtcbiAgICAgICAgICAgIGNodW5rX3N0cmluZyA9IHRoaXMub3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyICsgY2h1bmtfc3RyaW5nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW1pdCB0aGUgY3N2XG4gICAgICB0aGlzLmluZm8ucmVjb3JkcysrO1xuICAgICAgcHVzaChjaHVua19zdHJpbmcpO1xuICAgIH0sXG4gICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAoY2h1bmssIGNodW5rSXNIZWFkZXIgPSBmYWxzZSkge1xuICAgICAgaWYgKHR5cGVvZiBjaHVuayAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgY2h1bmtdO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBjb2x1bW5zIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBjb25zdCByZWNvcmQgPSBbXTtcbiAgICAgIC8vIFJlY29yZCBpcyBhbiBhcnJheVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2h1bmspKSB7XG4gICAgICAgIC8vIFdlIGFyZSBnZXR0aW5nIGFuIGFycmF5IGJ1dCB0aGUgdXNlciBoYXMgc3BlY2lmaWVkIG91dHB1dCBjb2x1bW5zLiBJblxuICAgICAgICAvLyB0aGlzIGNhc2UsIHdlIHJlc3BlY3QgdGhlIGNvbHVtbnMgaW5kZXhlc1xuICAgICAgICBpZiAoY29sdW1ucykge1xuICAgICAgICAgIGNodW5rLnNwbGljZShjb2x1bW5zLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FzdCByZWNvcmQgZWxlbWVudHNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaHVuay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGZpZWxkID0gY2h1bmtbaV07XG4gICAgICAgICAgY29uc3QgW2VyciwgdmFsdWVdID0gdGhpcy5fX2Nhc3QoZmllbGQsIHtcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgY29sdW1uOiBpLFxuICAgICAgICAgICAgcmVjb3JkczogdGhpcy5pbmZvLnJlY29yZHMsXG4gICAgICAgICAgICBoZWFkZXI6IGNodW5rSXNIZWFkZXIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGVycikgcmV0dXJuIFtlcnJdO1xuICAgICAgICAgIHJlY29yZFtpXSA9IFt2YWx1ZSwgZmllbGRdO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlY29yZCBpcyBhIGxpdGVyYWwgb2JqZWN0XG4gICAgICAgIC8vIGBjb2x1bW5zYCBpcyBhbHdheXMgZGVmaW5lZDogaXQgaXMgZWl0aGVyIHByb3ZpZGVkIG9yIGRpc2NvdmVyZWQuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBmaWVsZCA9IGdldChjaHVuaywgY29sdW1uc1tpXS5rZXkpO1xuICAgICAgICAgIGNvbnN0IFtlcnIsIHZhbHVlXSA9IHRoaXMuX19jYXN0KGZpZWxkLCB7XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIGNvbHVtbjogY29sdW1uc1tpXS5rZXksXG4gICAgICAgICAgICByZWNvcmRzOiB0aGlzLmluZm8ucmVjb3JkcyxcbiAgICAgICAgICAgIGhlYWRlcjogY2h1bmtJc0hlYWRlcixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gW2Vycl07XG4gICAgICAgICAgcmVjb3JkW2ldID0gW3ZhbHVlLCBmaWVsZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBjc3ZyZWNvcmQgPSBcIlwiO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWNvcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IG9wdGlvbnMsIGVycjtcblxuICAgICAgICBsZXQgW3ZhbHVlLCBmaWVsZF0gPSByZWNvcmRbaV07XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB9IGVsc2UgaWYgKGlzX29iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICBvcHRpb25zID0gdmFsdWU7XG4gICAgICAgICAgdmFsdWUgPSBvcHRpb25zLnZhbHVlO1xuICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLnZhbHVlO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IG51bGxcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgRXJyb3IoXG4gICAgICAgICAgICAgICAgICBgSW52YWxpZCBDYXN0aW5nIFZhbHVlOiByZXR1cm5lZCB2YWx1ZSBtdXN0IHJldHVybiBhIHN0cmluZywgbnVsbCBvciB1bmRlZmluZWQsIGdvdCAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wdGlvbnMgPSB7IC4uLnRoaXMub3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuICAgICAgICAgIFtlcnIsIG9wdGlvbnNdID0gbm9ybWFsaXplX29wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgICAgaWYgKGVyciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gW2Vycl07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBFcnJvcihcbiAgICAgICAgICAgICAgYEludmFsaWQgQ2FzdGluZyBWYWx1ZTogcmV0dXJuZWQgdmFsdWUgbXVzdCByZXR1cm4gYSBzdHJpbmcsIGFuIG9iamVjdCwgbnVsbCBvciB1bmRlZmluZWQsIGdvdCAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBkZWxpbWl0ZXIsXG4gICAgICAgICAgZXNjYXBlLFxuICAgICAgICAgIHF1b3RlLFxuICAgICAgICAgIHF1b3RlZCxcbiAgICAgICAgICBxdW90ZWRfZW1wdHksXG4gICAgICAgICAgcXVvdGVkX3N0cmluZyxcbiAgICAgICAgICBxdW90ZWRfbWF0Y2gsXG4gICAgICAgICAgcmVjb3JkX2RlbGltaXRlcixcbiAgICAgICAgICBlc2NhcGVfZm9ybXVsYXMsXG4gICAgICAgIH0gPSBvcHRpb25zO1xuICAgICAgICBpZiAoXCJcIiA9PT0gdmFsdWUgJiYgXCJcIiA9PT0gZmllbGQpIHtcbiAgICAgICAgICBsZXQgcXVvdGVkTWF0Y2ggPVxuICAgICAgICAgICAgcXVvdGVkX21hdGNoICYmXG4gICAgICAgICAgICBxdW90ZWRfbWF0Y2guZmlsdGVyKChxdW90ZWRfbWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxdW90ZWRfbWF0Y2ggPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuaW5kZXhPZihxdW90ZWRfbWF0Y2gpICE9PSAtMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVvdGVkX21hdGNoLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBxdW90ZWRNYXRjaCA9IHF1b3RlZE1hdGNoICYmIHF1b3RlZE1hdGNoLmxlbmd0aCA+IDA7XG4gICAgICAgICAgY29uc3Qgc2hvdWxkUXVvdGUgPVxuICAgICAgICAgICAgcXVvdGVkTWF0Y2ggfHxcbiAgICAgICAgICAgIHRydWUgPT09IHF1b3RlZF9lbXB0eSB8fFxuICAgICAgICAgICAgKHRydWUgPT09IHF1b3RlZF9zdHJpbmcgJiYgZmFsc2UgIT09IHF1b3RlZF9lbXB0eSk7XG4gICAgICAgICAgaWYgKHNob3VsZFF1b3RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHF1b3RlICsgdmFsdWUgKyBxdW90ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3N2cmVjb3JkICs9IHZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgRXJyb3IoXG4gICAgICAgICAgICAgICAgYEZvcm1hdHRlciBtdXN0IHJldHVybiBhIHN0cmluZywgbnVsbCBvciB1bmRlZmluZWQsIGdvdCAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gLFxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgY29udGFpbnNkZWxpbWl0ZXIgPVxuICAgICAgICAgICAgZGVsaW1pdGVyLmxlbmd0aCAmJiB2YWx1ZS5pbmRleE9mKGRlbGltaXRlcikgPj0gMDtcbiAgICAgICAgICBjb25zdCBjb250YWluc1F1b3RlID0gcXVvdGUgIT09IFwiXCIgJiYgdmFsdWUuaW5kZXhPZihxdW90ZSkgPj0gMDtcbiAgICAgICAgICBjb25zdCBjb250YWluc0VzY2FwZSA9IHZhbHVlLmluZGV4T2YoZXNjYXBlKSA+PSAwICYmIGVzY2FwZSAhPT0gcXVvdGU7XG4gICAgICAgICAgY29uc3QgY29udGFpbnNSZWNvcmREZWxpbWl0ZXIgPSB2YWx1ZS5pbmRleE9mKHJlY29yZF9kZWxpbWl0ZXIpID49IDA7XG4gICAgICAgICAgY29uc3QgcXVvdGVkU3RyaW5nID0gcXVvdGVkX3N0cmluZyAmJiB0eXBlb2YgZmllbGQgPT09IFwic3RyaW5nXCI7XG4gICAgICAgICAgbGV0IHF1b3RlZE1hdGNoID1cbiAgICAgICAgICAgIHF1b3RlZF9tYXRjaCAmJlxuICAgICAgICAgICAgcXVvdGVkX21hdGNoLmZpbHRlcigocXVvdGVkX21hdGNoKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgcXVvdGVkX21hdGNoID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmluZGV4T2YocXVvdGVkX21hdGNoKSAhPT0gLTE7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1b3RlZF9tYXRjaC50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgcXVvdGVkTWF0Y2ggPSBxdW90ZWRNYXRjaCAmJiBxdW90ZWRNYXRjaC5sZW5ndGggPiAwO1xuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYWRhbHRhcy9ub2RlLWNzdi9wdWxsLzM4N1xuICAgICAgICAgIC8vIE1vcmUgYWJvdXQgQ1NWIGluamVjdGlvbiBvciBmb3JtdWxhIGluamVjdGlvbiwgd2hlbiB3ZWJzaXRlcyBlbWJlZFxuICAgICAgICAgIC8vIHVudHJ1c3RlZCBpbnB1dCBpbnNpZGUgQ1NWIGZpbGVzOlxuICAgICAgICAgIC8vIGh0dHBzOi8vb3dhc3Aub3JnL3d3dy1jb21tdW5pdHkvYXR0YWNrcy9DU1ZfSW5qZWN0aW9uXG4gICAgICAgICAgLy8gaHR0cDovL2dlb3JnZW1hdWVyLm5ldC8yMDE3LzEwLzA3L2Nzdi1pbmplY3Rpb24uaHRtbFxuICAgICAgICAgIC8vIEFwcGxlIE51bWJlcnMgdW5pY29kZSBub3JtYWxpemF0aW9uIGlzIGVtcGlyaWNhbCBmcm9tIHRlc3RpbmdcbiAgICAgICAgICBpZiAoZXNjYXBlX2Zvcm11bGFzKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHZhbHVlWzBdKSB7XG4gICAgICAgICAgICAgIGNhc2UgXCI9XCI6XG4gICAgICAgICAgICAgIGNhc2UgXCIrXCI6XG4gICAgICAgICAgICAgIGNhc2UgXCItXCI6XG4gICAgICAgICAgICAgIGNhc2UgXCJAXCI6XG4gICAgICAgICAgICAgIGNhc2UgXCJcXHRcIjpcbiAgICAgICAgICAgICAgY2FzZSBcIlxcclwiOlxuICAgICAgICAgICAgICBjYXNlIFwiXFx1RkYxRFwiOiAvLyBVbmljb2RlICc9J1xuICAgICAgICAgICAgICBjYXNlIFwiXFx1RkYwQlwiOiAvLyBVbmljb2RlICcrJ1xuICAgICAgICAgICAgICBjYXNlIFwiXFx1RkYwRFwiOiAvLyBVbmljb2RlICctJ1xuICAgICAgICAgICAgICBjYXNlIFwiXFx1RkYyMFwiOiAvLyBVbmljb2RlICdAJ1xuICAgICAgICAgICAgICAgIHZhbHVlID0gYCcke3ZhbHVlfWA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHNob3VsZFF1b3RlID1cbiAgICAgICAgICAgIGNvbnRhaW5zUXVvdGUgPT09IHRydWUgfHxcbiAgICAgICAgICAgIGNvbnRhaW5zZGVsaW1pdGVyIHx8XG4gICAgICAgICAgICBjb250YWluc1JlY29yZERlbGltaXRlciB8fFxuICAgICAgICAgICAgcXVvdGVkIHx8XG4gICAgICAgICAgICBxdW90ZWRTdHJpbmcgfHxcbiAgICAgICAgICAgIHF1b3RlZE1hdGNoO1xuICAgICAgICAgIGlmIChzaG91bGRRdW90ZSA9PT0gdHJ1ZSAmJiBjb250YWluc0VzY2FwZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgcmVnZXhwID1cbiAgICAgICAgICAgICAgZXNjYXBlID09PSBcIlxcXFxcIlxuICAgICAgICAgICAgICAgID8gbmV3IFJlZ0V4cChlc2NhcGUgKyBlc2NhcGUsIFwiZ1wiKVxuICAgICAgICAgICAgICAgIDogbmV3IFJlZ0V4cChlc2NhcGUsIFwiZ1wiKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZWdleHAsIGVzY2FwZSArIGVzY2FwZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjb250YWluc1F1b3RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKHF1b3RlLCBcImdcIik7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVnZXhwLCBlc2NhcGUgKyBxdW90ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzaG91bGRRdW90ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSBxdW90ZSArIHZhbHVlICsgcXVvdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNzdnJlY29yZCArPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBxdW90ZWRfZW1wdHkgPT09IHRydWUgfHxcbiAgICAgICAgICAoZmllbGQgPT09IFwiXCIgJiYgcXVvdGVkX3N0cmluZyA9PT0gdHJ1ZSAmJiBxdW90ZWRfZW1wdHkgIT09IGZhbHNlKVxuICAgICAgICApIHtcbiAgICAgICAgICBjc3ZyZWNvcmQgKz0gcXVvdGUgKyBxdW90ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSAhPT0gcmVjb3JkLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBjc3ZyZWNvcmQgKz0gZGVsaW1pdGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gW3VuZGVmaW5lZCwgY3N2cmVjb3JkXTtcbiAgICB9LFxuICAgIGJvbTogZnVuY3Rpb24gKHB1c2gpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYm9tICE9PSB0cnVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHB1c2goYm9tX3V0ZjgpO1xuICAgIH0sXG4gICAgaGVhZGVyczogZnVuY3Rpb24gKHB1c2gpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVhZGVyID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNvbHVtbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgZXJyO1xuICAgICAgbGV0IGhlYWRlcnMgPSB0aGlzLm9wdGlvbnMuY29sdW1ucy5tYXAoKGNvbHVtbikgPT4gY29sdW1uLmhlYWRlcik7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVvZikge1xuICAgICAgICBbZXJyLCBoZWFkZXJzXSA9IHRoaXMuc3RyaW5naWZ5KGhlYWRlcnMsIHRydWUpO1xuICAgICAgICBoZWFkZXJzICs9IHRoaXMub3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgW2VyciwgaGVhZGVyc10gPSB0aGlzLnN0cmluZ2lmeShoZWFkZXJzKTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnIpIHJldHVybiBlcnI7XG4gICAgICBwdXNoKGhlYWRlcnMpO1xuICAgIH0sXG4gICAgX19jYXN0OiBmdW5jdGlvbiAodmFsdWUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIC8vIEZpbmUgZm9yIDk5JSBvZiB0aGUgY2FzZXNcbiAgICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdGhpcy5vcHRpb25zLmNhc3Quc3RyaW5nKHZhbHVlLCBjb250ZXh0KV07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJiaWdpbnRcIikge1xuICAgICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuY2FzdC5iaWdpbnQodmFsdWUsIGNvbnRleHQpXTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgcmV0dXJuIFt1bmRlZmluZWQsIHRoaXMub3B0aW9ucy5jYXN0Lm51bWJlcih2YWx1ZSwgY29udGV4dCldO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgcmV0dXJuIFt1bmRlZmluZWQsIHRoaXMub3B0aW9ucy5jYXN0LmJvb2xlYW4odmFsdWUsIGNvbnRleHQpXTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdGhpcy5vcHRpb25zLmNhc3QuZGF0ZSh2YWx1ZSwgY29udGV4dCldO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdGhpcy5vcHRpb25zLmNhc3Qub2JqZWN0KHZhbHVlLCBjb250ZXh0KV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFt1bmRlZmluZWQsIHZhbHVlLCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gW2Vycl07XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn07XG5cbmNvbnN0IHN0cmluZ2lmeSA9IGZ1bmN0aW9uIChyZWNvcmRzLCBvcHRzID0ge30pIHtcbiAgY29uc3QgZGF0YSA9IFtdO1xuICBjb25zdCBbZXJyLCBvcHRpb25zXSA9IG5vcm1hbGl6ZV9vcHRpb25zKG9wdHMpO1xuICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHRocm93IGVycjtcbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgc3RvcDogZmFsc2UsXG4gIH07XG4gIC8vIEluZm9ybWF0aW9uXG4gIGNvbnN0IGluZm8gPSB7XG4gICAgcmVjb3JkczogMCxcbiAgfTtcbiAgY29uc3QgYXBpID0gc3RyaW5naWZpZXIob3B0aW9ucywgc3RhdGUsIGluZm8pO1xuICBmb3IgKGNvbnN0IHJlY29yZCBvZiByZWNvcmRzKSB7XG4gICAgY29uc3QgZXJyID0gYXBpLl9fdHJhbnNmb3JtKHJlY29yZCwgZnVuY3Rpb24gKHJlY29yZCkge1xuICAgICAgZGF0YS5wdXNoKHJlY29yZCk7XG4gICAgfSk7XG4gICAgaWYgKGVyciAhPT0gdW5kZWZpbmVkKSB0aHJvdyBlcnI7XG4gIH1cbiAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgYXBpLmJvbSgoZCkgPT4ge1xuICAgICAgZGF0YS5wdXNoKGQpO1xuICAgIH0pO1xuICAgIGNvbnN0IGVyciA9IGFwaS5oZWFkZXJzKChoZWFkZXJzKSA9PiB7XG4gICAgICBkYXRhLnB1c2goaGVhZGVycyk7XG4gICAgfSk7XG4gICAgaWYgKGVyciAhPT0gdW5kZWZpbmVkKSB0aHJvdyBlcnI7XG4gIH1cbiAgcmV0dXJuIGRhdGEuam9pbihcIlwiKTtcbn07XG5cbmV4cG9ydHMuc3RyaW5naWZ5ID0gc3RyaW5naWZ5O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvc2NyaXB0cy9yZW5kZXJlci50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==