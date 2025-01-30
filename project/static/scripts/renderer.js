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
.table-cell {
  display: table-cell;
}
.table-row {
  display: table-row;
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
.flex-nowrap {
  flex-wrap: nowrap;
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

.table-header {
  flex: none;
  cursor: pointer;
  flex-wrap: nowrap;
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgba(210, 210, 210, var(--tw-border-opacity, 1));
  padding: 4px;
  text-align: center;
  vertical-align: middle;
  font-weight: 300;
}

.table-header:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(225, 225, 225, var(--tw-bg-opacity, 1));
  font-weight: 400;
  --tw-text-opacity: 1;
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
}

.table-row {
  flex: none;
  flex-wrap: nowrap;
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgba(210, 210, 210, var(--tw-border-opacity, 1));
  padding: 4px;
  text-align: center;
  vertical-align: middle;
}

.table-cell {
  flex: none;
  flex-wrap: nowrap;
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
`, "",{"version":3,"sources":["webpack://./src/scripts/styles/index.css"],"names":[],"mappings":"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AA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,sBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,iBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,yDAAmB;EAAnB;AAAmB;AAAnB;EAAA,4DAAmB;EAAnB;AAAmB;;AAOnB;EACE;qBACmB;AACrB;;AAGE;EAAA,kBAA+B;EAA/B;AAA+B;;AAI/B;EAAA,aAA6G;EAA7G,YAA6G;EAA7G,WAA6G;EAA7G,mBAA6G;EAA7G,uBAA6G;EAA7G,kBAA6G;EAA7G,kBAA6G;EAA7G,8DAA6G;EAA7G;AAA6G;;AAA7G;EAAA,kBAA6G;EAA7G;AAA6G;;AAI7G;EAAA,sBAAqC;EAArC,2DAAqC;EAArC,oBAAqC;EAArC;AAAqC;;AAIrC;EAAA,kBAA8B;EAA9B;AAA8B;;AAI9B;EAAA,kBAA8B;EAA9B;AAA8B;;AAI9B;EAAA,yBAA8B;EAA9B,oBAA8B;EAA9B;AAA8B;;AAI9B;EAAA,oBAA6C;EAA7C,kBAA6C;EAA7C;AAA6C;;AAI7C;EAAA,sBAAwD;EAAxD,2DAAwD;EAAxD,oBAAwD;EAAxD,kDAAwD;EAAxD,kBAAwD;EAAxD,sBAAwD;EAAxD,oBAAwD;EAAxD,kBAAwD;EAAxD;AAAwD;;AAIxD;EAAA,sBAAwD;EAAxD,2DAAwD;EAAxD,oBAAwD;EAAxD,kDAAwD;EAAxD,kBAAwD;EAAxD,sBAAwD;EAAxD,oBAAwD;EAAxD,kBAAwD;EAAxD;AAAwD;;AAIxD;EAAA,aAA+E;EAA/E,YAA+E;EAA/E,WAA+E;EAA/E,mBAA+E;EAA/E,uBAA+E;EAA/E,kBAA+E;EAA/E,kBAA+E;EAA/E,8DAA+E;EAA/E;AAA+E;;AAA/E;EAAA,kBAA+E;EAA/E;AAA+E;;AAA/E;EAAA,sBAA+E;EAA/E,2DAA+E;EAA/E,oBAA+E;EAA/E,kDAA+E;EAA/E,kBAA+E;EAA/E,sBAA+E;EAA/E,oBAA+E;EAA/E,kBAA+E;EAA/E;AAA+E;;AAA/E;EAAA,qBAA+E;OAA/E,gBAA+E;EAA/E,SAA+E;EAA/E,wBAA+E;EAA/E,0BAA+E;AAAA;;AAA/E;;AAAA,wBAA+E;AAA/E,SAA+E;AAAA;;AAI/E;EAAA,aAA6D;EAA7D,YAA6D;EAA7D,WAA6D;EAA7D,mBAA6D;EAA7D,uBAA6D;EAA7D,kBAA6D;EAA7D,kBAA6D;EAA7D,8DAA6D;EAA7D;AAA6D;;AAA7D;EAAA,kBAA6D;EAA7D;AAA6D;;AAA7D;EAAA,sBAA6D;EAA7D,2DAA6D;EAA7D,oBAA6D;EAA7D,kDAA6D;EAA7D,kBAA6D;EAA7D,sBAA6D;EAA7D,oBAA6D;EAA7D,kBAA6D;EAA7D;AAA6D;;AAI7D;EAAA,YAAgE;EAAhE,WAAgE;EAAhE,kBAAgE;EAAhE,sBAAgE;EAAhE,yBAAgE;EAAhE,oBAAgE;EAAhE;AAAgE;;AAIhE;EAAA,aAA8D;EAA9D,YAA8D;EAA9D,WAA8D;EAA9D,sBAA8D;EAA9D,mBAA8D;EAA9D;AAA8D;;AAI9D;EAAA,UAAwK;EAAxK,eAAwK;EAAxK,iBAAwK;EAAxK,iBAAwK;EAAxK,sBAAwK;EAAxK,8DAAwK;EAAxK,YAAwK;EAAxK,kBAAwK;EAAxK,sBAAwK;EAAxK;AAAwK;;AAAxK;EAAA,kBAAwK;EAAxK,8DAAwK;EAAxK,gBAAwK;EAAxK,oBAAwK;EAAxK;AAAwK;;AAIxK;EAAA,UAAoF;EAApF,iBAAoF;EAApF,iBAAoF;EAApF,sBAAoF;EAApF,8DAAoF;EAApF,YAAoF;EAApF,kBAAoF;EAApF;AAAoF;;AAIpF;EAAA,UAAoF;EAApF,iBAAoF;EAApF,iBAAoF;EAApF,sBAAoF;EAApF,8DAAoF;EAApF,YAAoF;EAApF,kBAAoF;EAApF;AAAoF;;AAIpF;EAAA,aAAmD;EAAnD,YAAmD;EAAnD,WAAmD;EAAnD,QAAmD;EAAnD,YAAmD;EAAnD;AAAmD;;AAGrD;EACE,qBAAgB;OAAhB,gBAAgB;EAChB,SAAS;EACT,wBAAwB;EACxB,0BAA0B;AAC5B;;AAEA;;AAEA,wBAAwB;AACxB,SAAS;AACT;;AA7FA;EAAA,kBA8FA;EA9FA;AA8FA;;AA9FA;EAAA,kBA8FA;EA9FA;AA8FA;;AA9FA;EAAA,kBA8FA;EA9FA;AA8FA;;AA9FA;EAAA;AA8FA;;AA9FA;EAAA,oBA8FA;EA9FA;AA8FA","sourcesContent":["@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@import \"./themes.css\";\n@import \"./fonts.css\";\n@import \"./texts.css\";\n@import \"./inputs.css\";\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,\n    Arial, sans-serif;\n}\n\n.base {\n  @apply text-center align-middle;\n}\n\n.base-input {\n  @apply rounded-[4px] p-[8px] w-full h-[36px] flex items-center justify-center bg-neutral_2 hover:bg-neutral_0;\n}\n\n.base-border {\n  @apply border-neutral_7 text-neutral_7\n}\n\n.base-text-position {\n  @apply text-center align-middle\n}\n\n.base-text-position-center {\n  @apply text-center align-middle\n}\n\n.base-text-style {\n  @apply text-neutral_7 lowercase\n}\n\n.base-outline {\n  @apply outline outline-[1px] outline-black/25;\n}\n\n.unit {\n  @apply base-text-position-center base-border base-outline\n}\n\n.button-submit {\n  @apply base-text-position-center base-border base-outline\n}\n\n.input-number {\n  @apply base-text-position base-border base-outline base-input continuous-number;\n}\n\n.input-text {\n  @apply base-text-position base-border base-outline base-input;\n}\n\n.field-title {\n  @apply base-text-position-center base-text-style w-full h-[24px];\n}\n\n.input-field {\n  @apply w-full h-full flex flex-col items-center justify-center;\n}\n\n.table-header {\n  @apply flex-none flex-nowrap text-center align-middle border border-neutral_4 p-[4px] cursor-pointer hover:bg-neutral_1 hover:text-neutral_5 font-light hover:font-normal\n}\n\n.table-row {\n  @apply flex-none flex-nowrap text-center align-middle border border-neutral_4 p-[4px]\n}\n\n.table-cell {\n  @apply flex-none flex-nowrap text-center align-middle border border-neutral_4 p-[4px]\n}\n\n.main-content {\n  @apply w-full h-full flex gap-[0px] pl-[0px] p-[0px]\n}\n\ninput.continuous-number {\n  appearance: none;\n  margin: 0;\n  -webkit-appearance: none;\n  -moz-appearance: textfield;\n}\n\ninput.continuous-number::-webkit-inner-spin-button,\ninput.continuous-number::-webkit-outer-spin-button {\n-webkit-appearance: none;\nmargin: 0;\n}\n"],"sourceRoot":""}]);
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
const products_manager_1 = __webpack_require__(/*! ./products-manager */ "./src/controllers/products-manager.ts");
class DatabaseManager {
    constructor() {
        this._transactionsManager = null;
        this._productsManager = null;
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
        this._productsManager = products_manager_1.ProductsManager.GetInstance();
    }
    GetTransactionManager() {
        return this._transactionsManager;
    }
}
exports.DatabaseManager = DatabaseManager;


/***/ }),

/***/ "./src/controllers/products-manager.ts":
/*!*********************************************!*\
  !*** ./src/controllers/products-manager.ts ***!
  \*********************************************/
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
exports.ProductsManager = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const product_1 = __webpack_require__(/*! ../models/product */ "./src/models/product.ts");
const path_manager_1 = __webpack_require__(/*! ../scripts/path-manager */ "./src/scripts/path-manager.ts");
const sync_1 = __webpack_require__(/*! csv-parse/sync */ "./node_modules/csv-parse/dist/cjs/sync.cjs");
const sync_2 = __webpack_require__(/*! csv-stringify/sync */ "./node_modules/csv-stringify/dist/cjs/sync.cjs");
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
class ProductsManager {
    constructor() {
        this._products = [];
        this._database = "database";
        this._details = "details";
        this._filename = "products.csv";
        this.ROOT = path_manager_1.PathManager.GetInstance().GetRoot();
        this._productsFile = path_1.default.join(this.ROOT, this._database, this._filename);
        this._detailsPath = path_1.default.join(this.ROOT, this._database, this._details);
        this.Read();
    }
    static GetInstance() {
        if (!this._instance) {
            this._instance = new ProductsManager();
        }
        return this._instance;
    }
    Create(name, description, value, unitOfMeasure, amount) {
        try {
            if (!fs.existsSync(this._productsFile)) {
                console.error('Error processing CSV file: file does not exist.');
                return;
            }
            const fileContent = fs.readFileSync(this._productsFile, 'utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            // Converter a unidade de medida
            let parsedUnit;
            try {
                parsedUnit = UnitOfMeasure[unitOfMeasure];
                if (!parsedUnit) {
                    console.error('Invalid unit of measure.');
                    return;
                }
            }
            catch (error) {
                console.error('Error processing unit of measure:', error);
                return;
            }
            const product = new product_1.Product(name, description, value, parsedUnit, amount);
            const productPlain = {
                id: product.getInfo().id,
                creationDate: product.getInfo().creationDate,
                lastModifiedDate: product.getInfo().lastModified,
                name: name,
                description: description,
                value: value,
                unitOfMeasure: unitOfMeasure,
                amount: amount,
            };
            this._products.push(product);
            records.push(productPlain);
            const updatedCSV = (0, sync_2.stringify)(records, { header: true });
            fs.writeFileSync(this._productsFile, updatedCSV, 'utf-8');
        }
        catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }
    Read() {
        try {
            if (!fs.existsSync(this._productsFile)) {
                const header = [
                    "id", "creationDate", "lastModifiedDate", "name", "description", "value", "unitOfMeasure", "amount"
                ];
                const newCSV = (0, sync_2.stringify)([], { header: true });
                fs.writeFileSync(this._productsFile, newCSV, 'utf-8');
            }
            const fileContent = fs.readFileSync(this._productsFile, 'utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            for (const record of records) {
                const product = new product_1.Product(record.name, record.description, parseFloat(record.value), record.unitOfMeasure, parseFloat(record.amount), record.id, parseInt(record.creationDate), parseInt(record.lastModifiedDate));
                this._products.push(product);
            }
        }
        catch (error) {
            console.error('Error reading CSV file:', error);
        }
    }
    Update() {
        // Implementar método de atualização
    }
    Delete() {
        // Implementar método de deleção
    }
    GetProducts() {
        return this._products;
    }
}
exports.ProductsManager = ProductsManager;


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
        this._database = "database";
        this._details = "details";
        this._filename = "transactions.csv";
        this.ROOT = path_manager_1.PathManager.GetInstance().GetRoot();
        this._transactionsFile = path_1.default.join(this.ROOT, this._database, this._filename);
        this._details_path = path_1.default.join(this.ROOT, this._database, this._details);
        this.Read();
    }
    static GetInstance() {
        if (this._instance == null) {
            this._instance = new TransactionsManager();
        }
        return this._instance;
    }
    Create(name, type, agent, date, referenceDate, value, description, details) {
        try {
            if (!fs.existsSync(this._transactionsFile)) {
                console.error('Error processing CSV file: file does not exists.');
            }
            const fileContent = fs.readFileSync(this._transactionsFile, 'utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            const transactionDateTicks = new Date(date).getTime();
            const referenceDateTicks = new Date(referenceDate).getTime();
            let transactionType = transaction_type_1.TransactionType.Entry;
            type = type.toLowerCase();
            if (type === "entry") {
                transactionType = transaction_type_1.TransactionType.Entry;
            }
            else if (type === "exit") {
                transactionType = transaction_type_1.TransactionType.Exit;
            }
            else {
                console.error('Invalid transaction type.');
            }
            const transaction = new transaction_1.Transaction(name, description, transactionType, agent, transactionDateTicks, referenceDateTicks, value, details || "");
            this._transactions.push(transaction);
            records.push(transaction.getInfo());
            const updatedCSV = (0, sync_2.stringify)(records, { header: true });
            fs.writeFileSync(this._transactionsFile, updatedCSV, 'utf-8');
        }
        catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }
    Read() {
        try {
            if (!fs.existsSync(this._transactionsFile)) {
                const newCSV = (0, sync_2.stringify)([], { header: true });
                fs.writeFileSync(this._transactionsFile, newCSV, 'utf-8');
            }
            const fileContent = fs.readFileSync(this._transactionsFile, 'utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            for (let i = 0; i < records.length; i++) {
                const transaction = new transaction_1.Transaction(records[i].name, records[i].description, records[i].type, records[i].agent, parseInt(records[i].transactionDate), parseInt(records[i].referenceDate), parseFloat(records[i].value), records[i].details || "", records[i].id, parseInt(records[i].creationDate), parseInt(records[i].lastModifiedDate));
                this._transactions.push(transaction);
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entity = void 0;
const nanoid_1 = __webpack_require__(/*! nanoid */ "./node_modules/nanoid/index.browser.js");
class Entity {
    constructor(name, description, id = null, creationDate = Date.now(), lastModified = Date.now()) {
        this._id = id !== null && id !== void 0 ? id : (0, nanoid_1.nanoid)();
        this._creationDate = creationDate;
        this._lastModified = lastModified;
        this._name = name;
        this._description = description;
    }
    getInfo() {
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

/***/ "./src/models/item.ts":
/*!****************************!*\
  !*** ./src/models/item.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Item = void 0;
const entity_1 = __webpack_require__(/*! ./entity */ "./src/models/entity.ts");
class Item extends entity_1.Entity {
    constructor(name, description, value, id, creationDate, lastModified) {
        super(name, description, id, creationDate, lastModified);
        this._value = [value];
    }
    getInfo() {
        return Object.assign(Object.assign({}, super.getInfo()), { value: this._value });
    }
}
exports.Item = Item;


/***/ }),

/***/ "./src/models/product.ts":
/*!*******************************!*\
  !*** ./src/models/product.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Product = void 0;
const item_1 = __webpack_require__(/*! ./item */ "./src/models/item.ts");
class Product extends item_1.Item {
    constructor(name, description, value, unitOfMeasure, amount, id, creationDate, lastModified) {
        super(name, description, value, id, creationDate, lastModified);
        this._unitOfMeasure = unitOfMeasure;
        this._amount = amount;
    }
    getInfo() {
        return Object.assign(Object.assign({}, super.getInfo()), { unitOfMeasure: this._unitOfMeasure, amount: this._amount });
    }
}
exports.Product = Product;


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
    constructor(name, description, type, agent, transactionDate, referenceDate, value, details, id, creationDate, lastModified) {
        super(name, description, id, creationDate, lastModified);
        this._type = type;
        this._agent = agent;
        this._transactionDate = transactionDate;
        this._referenceDate = referenceDate;
        this._value = value;
        this._details = details;
    }
    getInfo() {
        return Object.assign(Object.assign({}, super.getInfo()), { type: this._type, agent: this._agent, transactionDate: this._transactionDate, referenceDate: this._referenceDate, value: this._value, details: this._details });
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


/***/ }),

/***/ "./node_modules/nanoid/index.browser.js":
/*!**********************************************!*\
  !*** ./node_modules/nanoid/index.browser.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customAlphabet: () => (/* binding */ customAlphabet),
/* harmony export */   customRandom: () => (/* binding */ customRandom),
/* harmony export */   nanoid: () => (/* binding */ nanoid),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   urlAlphabet: () => (/* reexport safe */ _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__.urlAlphabet)
/* harmony export */ });
/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url-alphabet/index.js */ "./node_modules/nanoid/url-alphabet/index.js");
// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.



let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

let customRandom = (alphabet, defaultSize, getRandom) => {
  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  // `Math.clz32` is not used, because it is not available in browsers.
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  // Though, the bitmask solution is not perfect since the bytes exceeding
  // the alphabet size are refused. Therefore, to reliably generate the ID,
  // the random bytes redundancy has to be satisfied.

  // Note: every hardware random generator call is performance expensive,
  // because the system call for entropy collection takes a lot of time.
  // So, to avoid additional system calls, extra bytes are requested in advance.

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
  // according to benchmarks).

  // `-~f => Math.ceil(f)` if f is a float
  // `-~i => i + 1` if i is an integer
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)

  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step | 0
      while (j--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}

let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)

let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    byte &= 63
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36)
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')




/***/ }),

/***/ "./node_modules/nanoid/url-alphabet/index.js":
/*!***************************************************!*\
  !*** ./node_modules/nanoid/url-alphabet/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   urlAlphabet: () => (/* binding */ urlAlphabet)
/* harmony export */ });
// This alphabet uses `A-Za-z0-9_-` symbols.
// The order of characters is optimized for better gzip and brotli compression.
// Same as in non-secure/index.js
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFNBQVMsaUJBQWlCLFNBQVM7QUFDMUQ7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsOEJBQThCLElBQUksOEJBQThCO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsT0FBTztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJO0FBQ1osNENBQTRDLFlBQVk7QUFDeEQ7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLFFBQVEsSUFBSTtBQUNaLCtDQUErQyxZQUFZO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxZQUFZO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSx1QkFBdUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsSUFBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSx1QkFBdUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsSUFBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsS0FBSSx1REFBdUQsQ0FBTTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGNBQWM7QUFDOUIsd0JBQXdCLGNBQWM7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBSTtBQUNaLHVDQUF1QyxRQUFRO0FBQy9DLHNCQUFzQixrQkFBa0IsWUFBWSxJQUFJO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsTUFBTSxnRUFBZ0UsaUNBQWlDO0FBQ3BJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJO0FBQ1oscURBQXFELGVBQWU7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixrREFBa0Q7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QyxvQkFBb0IsS0FBSyxFQUFFLFVBQVUsSUFBSSxPQUFPO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksT0FBTyxLQUFLLEdBQUcsR0FBRztBQUN4RCxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsVUFBVSxrQ0FBa0MsS0FBSyw4Q0FBOEMsS0FBSztBQUN2Sjs7QUFFQTtBQUNBLDhCQUE4QixZQUFZLElBQUksbUVBQW1FO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxZQUFZO0FBQ3ZEO0FBQ0EsR0FBRyxJQUFJLFNBQVMsd0JBQXdCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0EsNkJBQTZCLHVCQUF1QixJQUFJLG1CQUFtQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsMERBQTBELFdBQVc7QUFDckU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsV0FBVyxJQUFJLG1CQUFtQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLDJDQUEyQyxZQUFZLElBQUksaUJBQWlCO0FBQzVFO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDO0FBQ2pDLHdCQUF3QjtBQUN4Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCO0FBQzlCLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQiwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLCtGQUErRixXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsS0FBSyxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssV0FBVyxZQUFZLE1BQU0sT0FBTyxxQkFBcUIsb0JBQW9CLHFCQUFxQixxQkFBcUIsTUFBTSxNQUFNLFdBQVcsTUFBTSxZQUFZLE1BQU0sTUFBTSxxQkFBcUIscUJBQXFCLHFCQUFxQixVQUFVLG9CQUFvQixxQkFBcUIscUJBQXFCLHFCQUFxQixxQkFBcUIsTUFBTSxPQUFPLE1BQU0sS0FBSyxvQkFBb0IscUJBQXFCLE1BQU0sUUFBUSxNQUFNLEtBQUssb0JBQW9CLG9CQUFvQixxQkFBcUIsTUFBTSxNQUFNLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxNQUFNLE1BQU0sVUFBVSxXQUFXLFdBQVcsTUFBTSxNQUFNLE1BQU0sS0FBSyxVQUFVLFdBQVcsTUFBTSxNQUFNLE1BQU0sTUFBTSxXQUFXLE1BQU0sU0FBUyxNQUFNLFFBQVEscUJBQXFCLHFCQUFxQixxQkFBcUIsb0JBQW9CLE1BQU0sTUFBTSxNQUFNLEtBQUssVUFBVSxNQUFNLE1BQU0sTUFBTSxNQUFNLFVBQVUsVUFBVSxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsTUFBTSxRQUFRLE1BQU0sS0FBSyxvQkFBb0IscUJBQXFCLHFCQUFxQixNQUFNLFFBQVEsTUFBTSxTQUFTLHFCQUFxQixxQkFBcUIscUJBQXFCLG9CQUFvQixxQkFBcUIscUJBQXFCLHFCQUFxQixvQkFBb0Isb0JBQW9CLG9CQUFvQixNQUFNLE1BQU0sTUFBTSxNQUFNLFdBQVcsTUFBTSxPQUFPLE1BQU0sUUFBUSxxQkFBcUIscUJBQXFCLHFCQUFxQixNQUFNLE1BQU0sTUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLE1BQU0sS0FBSyxXQUFXLE1BQU0sTUFBTSxNQUFNLEtBQUssV0FBVyxNQUFNLE1BQU0sTUFBTSxNQUFNLFVBQVUsTUFBTSxPQUFPLE1BQU0sS0FBSyxxQkFBcUIscUJBQXFCLE1BQU0sTUFBTSxNQUFNLEtBQUssV0FBVyxNQUFNLE9BQU8sTUFBTSxLQUFLLHFCQUFxQixvQkFBb0IsTUFBTSxNQUFNLE1BQU0sS0FBSyxXQUFXLE1BQU0sTUFBTSxNQUFNLGlCQUFpQixVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsTUFBTSxPQUFPLFdBQVcsVUFBVSxVQUFVLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxNQUFNLE1BQU0sTUFBTSxLQUFLLFdBQVcsTUFBTSxPQUFPLE1BQU0sS0FBSyxvQkFBb0Isb0JBQW9CLE1BQU0sTUFBTSxvQkFBb0Isb0JBQW9CLE1BQU0sTUFBTSxNQUFNLE1BQU0sVUFBVSxNQUFNLE1BQU0sS0FBSyxLQUFLLFVBQVUsTUFBTSxRQUFRLE1BQU0sWUFBWSxvQkFBb0IscUJBQXFCLE1BQU0sTUFBTSxNQUFNLE1BQU0sVUFBVSxVQUFVLE1BQU0sV0FBVyxLQUFLLFVBQVUsS0FBSyxLQUFLLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEtBQUssTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLEtBQUssT0FBTyxPQUFPLEtBQUssWUFBWSxNQUFNLE9BQU8sTUFBTSxXQUFXLFlBQVksWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsTUFBTSxPQUFPLE1BQU0sWUFBWSxNQUFNLE9BQU8sTUFBTSxZQUFZLGFBQWEsYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLFlBQVksTUFBTSxPQUFPLE1BQU0sWUFBWSxhQUFhLE1BQU0sT0FBTyxNQUFNLFlBQVksYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsTUFBTSxPQUFPLE1BQU0sWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sT0FBTyxNQUFNLFdBQVcsWUFBWSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLGFBQWEsWUFBWSxhQUFhLGFBQWEsTUFBTSxPQUFPLFlBQVksWUFBWSxNQUFNLE1BQU0sV0FBVyxZQUFZLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sT0FBTyxNQUFNLFlBQVksTUFBTSxPQUFPLE1BQU0sWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sT0FBTyxNQUFNLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sT0FBTyxNQUFNLFdBQVcs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGlDQUFpQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDRCQUE0QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDZCQUE2QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsa0NBQWtDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0NBQWdDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsOENBQThDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLDhFQUE4RSx5Q0FBeUM7QUFDdkg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStELHNCQUFzQjtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFVBQVU7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUix3QkFBd0Isb0JBQW9CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1CQUFtQjtBQUN6Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdHQUF3RyxzQkFBc0I7QUFDOUg7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSwrR0FBK0csc0JBQXNCO0FBQ3JJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSwwRUFBMEUsc0JBQXNCO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixNQUFNO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzV0QmpCO0FBQ0E7O0FBRXFEOztBQUVyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFVBQVU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRWlFOzs7Ozs7Ozs7Ozs7Ozs7QUN2RXBFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXNCOzs7Ozs7O1VDTnRCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9hbHBpbmVqcy9kaXN0L21vZHVsZS5lc20uanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3N0eWxlcy9mb250cy5jc3MiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbnB1dHMuY3NzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9zdHlsZXMvdGV4dHMuY3NzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9zdHlsZXMvdGhlbWVzLmNzcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbmRleC5jc3M/Y2QzNSIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvY29udHJvbGxlcnMvZGF0YWJhc2UtbWFuYWdlci50cyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL2NvbnRyb2xsZXJzL3Byb2R1Y3RzLW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9jb250cm9sbGVycy9zdG9yZS50cyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL2NvbnRyb2xsZXJzL3RyYW5zYWN0aW9ucy1tYW5hZ2VyLnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvZW51bXMvdHJhbnNhY3Rpb24tdHlwZS50cyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL21vZGVscy9lbnRpdHkudHMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9tb2RlbHMvaXRlbS50cyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL21vZGVscy9wcm9kdWN0LnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvbW9kZWxzL3RyYW5zYWN0aW9uLnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9mb3JtYXR0ZXIudHMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3BhdGgtbWFuYWdlci50cyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL3NjcmlwdHMvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9jc3YtcGFyc2UvZGlzdC9janMvc3luYy5janMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9jc3Ytc3RyaW5naWZ5L2Rpc3QvY2pzL3N5bmMuY2pzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvbmFub2lkL2luZGV4LmJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvc2NoZWR1bGVyLmpzXG52YXIgZmx1c2hQZW5kaW5nID0gZmFsc2U7XG52YXIgZmx1c2hpbmcgPSBmYWxzZTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGxhc3RGbHVzaGVkSW5kZXggPSAtMTtcbmZ1bmN0aW9uIHNjaGVkdWxlcihjYWxsYmFjaykge1xuICBxdWV1ZUpvYihjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBxdWV1ZUpvYihqb2IpIHtcbiAgaWYgKCFxdWV1ZS5pbmNsdWRlcyhqb2IpKVxuICAgIHF1ZXVlLnB1c2goam9iKTtcbiAgcXVldWVGbHVzaCgpO1xufVxuZnVuY3Rpb24gZGVxdWV1ZUpvYihqb2IpIHtcbiAgbGV0IGluZGV4ID0gcXVldWUuaW5kZXhPZihqb2IpO1xuICBpZiAoaW5kZXggIT09IC0xICYmIGluZGV4ID4gbGFzdEZsdXNoZWRJbmRleClcbiAgICBxdWV1ZS5zcGxpY2UoaW5kZXgsIDEpO1xufVxuZnVuY3Rpb24gcXVldWVGbHVzaCgpIHtcbiAgaWYgKCFmbHVzaGluZyAmJiAhZmx1c2hQZW5kaW5nKSB7XG4gICAgZmx1c2hQZW5kaW5nID0gdHJ1ZTtcbiAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaEpvYnMpO1xuICB9XG59XG5mdW5jdGlvbiBmbHVzaEpvYnMoKSB7XG4gIGZsdXNoUGVuZGluZyA9IGZhbHNlO1xuICBmbHVzaGluZyA9IHRydWU7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICBxdWV1ZVtpXSgpO1xuICAgIGxhc3RGbHVzaGVkSW5kZXggPSBpO1xuICB9XG4gIHF1ZXVlLmxlbmd0aCA9IDA7XG4gIGxhc3RGbHVzaGVkSW5kZXggPSAtMTtcbiAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3JlYWN0aXZpdHkuanNcbnZhciByZWFjdGl2ZTtcbnZhciBlZmZlY3Q7XG52YXIgcmVsZWFzZTtcbnZhciByYXc7XG52YXIgc2hvdWxkU2NoZWR1bGUgPSB0cnVlO1xuZnVuY3Rpb24gZGlzYWJsZUVmZmVjdFNjaGVkdWxpbmcoY2FsbGJhY2spIHtcbiAgc2hvdWxkU2NoZWR1bGUgPSBmYWxzZTtcbiAgY2FsbGJhY2soKTtcbiAgc2hvdWxkU2NoZWR1bGUgPSB0cnVlO1xufVxuZnVuY3Rpb24gc2V0UmVhY3Rpdml0eUVuZ2luZShlbmdpbmUpIHtcbiAgcmVhY3RpdmUgPSBlbmdpbmUucmVhY3RpdmU7XG4gIHJlbGVhc2UgPSBlbmdpbmUucmVsZWFzZTtcbiAgZWZmZWN0ID0gKGNhbGxiYWNrKSA9PiBlbmdpbmUuZWZmZWN0KGNhbGxiYWNrLCB7IHNjaGVkdWxlcjogKHRhc2spID0+IHtcbiAgICBpZiAoc2hvdWxkU2NoZWR1bGUpIHtcbiAgICAgIHNjaGVkdWxlcih0YXNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFzaygpO1xuICAgIH1cbiAgfSB9KTtcbiAgcmF3ID0gZW5naW5lLnJhdztcbn1cbmZ1bmN0aW9uIG92ZXJyaWRlRWZmZWN0KG92ZXJyaWRlKSB7XG4gIGVmZmVjdCA9IG92ZXJyaWRlO1xufVxuZnVuY3Rpb24gZWxlbWVudEJvdW5kRWZmZWN0KGVsKSB7XG4gIGxldCBjbGVhbnVwMiA9ICgpID0+IHtcbiAgfTtcbiAgbGV0IHdyYXBwZWRFZmZlY3QgPSAoY2FsbGJhY2spID0+IHtcbiAgICBsZXQgZWZmZWN0UmVmZXJlbmNlID0gZWZmZWN0KGNhbGxiYWNrKTtcbiAgICBpZiAoIWVsLl94X2VmZmVjdHMpIHtcbiAgICAgIGVsLl94X2VmZmVjdHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICAgICAgZWwuX3hfcnVuRWZmZWN0cyA9ICgpID0+IHtcbiAgICAgICAgZWwuX3hfZWZmZWN0cy5mb3JFYWNoKChpKSA9PiBpKCkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgZWwuX3hfZWZmZWN0cy5hZGQoZWZmZWN0UmVmZXJlbmNlKTtcbiAgICBjbGVhbnVwMiA9ICgpID0+IHtcbiAgICAgIGlmIChlZmZlY3RSZWZlcmVuY2UgPT09IHZvaWQgMClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZWwuX3hfZWZmZWN0cy5kZWxldGUoZWZmZWN0UmVmZXJlbmNlKTtcbiAgICAgIHJlbGVhc2UoZWZmZWN0UmVmZXJlbmNlKTtcbiAgICB9O1xuICAgIHJldHVybiBlZmZlY3RSZWZlcmVuY2U7XG4gIH07XG4gIHJldHVybiBbd3JhcHBlZEVmZmVjdCwgKCkgPT4ge1xuICAgIGNsZWFudXAyKCk7XG4gIH1dO1xufVxuZnVuY3Rpb24gd2F0Y2goZ2V0dGVyLCBjYWxsYmFjaykge1xuICBsZXQgZmlyc3RUaW1lID0gdHJ1ZTtcbiAgbGV0IG9sZFZhbHVlO1xuICBsZXQgZWZmZWN0UmVmZXJlbmNlID0gZWZmZWN0KCgpID0+IHtcbiAgICBsZXQgdmFsdWUgPSBnZXR0ZXIoKTtcbiAgICBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgaWYgKCFmaXJzdFRpbWUpIHtcbiAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICAgICAgY2FsbGJhY2sodmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgb2xkVmFsdWUgPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbGRWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgfSk7XG4gIHJldHVybiAoKSA9PiByZWxlYXNlKGVmZmVjdFJlZmVyZW5jZSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tdXRhdGlvbi5qc1xudmFyIG9uQXR0cmlidXRlQWRkZWRzID0gW107XG52YXIgb25FbFJlbW92ZWRzID0gW107XG52YXIgb25FbEFkZGVkcyA9IFtdO1xuZnVuY3Rpb24gb25FbEFkZGVkKGNhbGxiYWNrKSB7XG4gIG9uRWxBZGRlZHMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBvbkVsUmVtb3ZlZChlbCwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaWYgKCFlbC5feF9jbGVhbnVwcylcbiAgICAgIGVsLl94X2NsZWFudXBzID0gW107XG4gICAgZWwuX3hfY2xlYW51cHMucHVzaChjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2sgPSBlbDtcbiAgICBvbkVsUmVtb3ZlZHMucHVzaChjYWxsYmFjayk7XG4gIH1cbn1cbmZ1bmN0aW9uIG9uQXR0cmlidXRlc0FkZGVkKGNhbGxiYWNrKSB7XG4gIG9uQXR0cmlidXRlQWRkZWRzLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gb25BdHRyaWJ1dGVSZW1vdmVkKGVsLCBuYW1lLCBjYWxsYmFjaykge1xuICBpZiAoIWVsLl94X2F0dHJpYnV0ZUNsZWFudXBzKVxuICAgIGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzID0ge307XG4gIGlmICghZWwuX3hfYXR0cmlidXRlQ2xlYW51cHNbbmFtZV0pXG4gICAgZWwuX3hfYXR0cmlidXRlQ2xlYW51cHNbbmFtZV0gPSBbXTtcbiAgZWwuX3hfYXR0cmlidXRlQ2xlYW51cHNbbmFtZV0ucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBjbGVhbnVwQXR0cmlidXRlcyhlbCwgbmFtZXMpIHtcbiAgaWYgKCFlbC5feF9hdHRyaWJ1dGVDbGVhbnVwcylcbiAgICByZXR1cm47XG4gIE9iamVjdC5lbnRyaWVzKGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzKS5mb3JFYWNoKChbbmFtZSwgdmFsdWVdKSA9PiB7XG4gICAgaWYgKG5hbWVzID09PSB2b2lkIDAgfHwgbmFtZXMuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgIHZhbHVlLmZvckVhY2goKGkpID0+IGkoKSk7XG4gICAgICBkZWxldGUgZWwuX3hfYXR0cmlidXRlQ2xlYW51cHNbbmFtZV07XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIGNsZWFudXBFbGVtZW50KGVsKSB7XG4gIGVsLl94X2VmZmVjdHM/LmZvckVhY2goZGVxdWV1ZUpvYik7XG4gIHdoaWxlIChlbC5feF9jbGVhbnVwcz8ubGVuZ3RoKVxuICAgIGVsLl94X2NsZWFudXBzLnBvcCgpKCk7XG59XG52YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihvbk11dGF0ZSk7XG52YXIgY3VycmVudGx5T2JzZXJ2aW5nID0gZmFsc2U7XG5mdW5jdGlvbiBzdGFydE9ic2VydmluZ011dGF0aW9ucygpIHtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBzdWJ0cmVlOiB0cnVlLCBjaGlsZExpc3Q6IHRydWUsIGF0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlIH0pO1xuICBjdXJyZW50bHlPYnNlcnZpbmcgPSB0cnVlO1xufVxuZnVuY3Rpb24gc3RvcE9ic2VydmluZ011dGF0aW9ucygpIHtcbiAgZmx1c2hPYnNlcnZlcigpO1xuICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gIGN1cnJlbnRseU9ic2VydmluZyA9IGZhbHNlO1xufVxudmFyIHF1ZXVlZE11dGF0aW9ucyA9IFtdO1xuZnVuY3Rpb24gZmx1c2hPYnNlcnZlcigpIHtcbiAgbGV0IHJlY29yZHMgPSBvYnNlcnZlci50YWtlUmVjb3JkcygpO1xuICBxdWV1ZWRNdXRhdGlvbnMucHVzaCgoKSA9PiByZWNvcmRzLmxlbmd0aCA+IDAgJiYgb25NdXRhdGUocmVjb3JkcykpO1xuICBsZXQgcXVldWVMZW5ndGhXaGVuVHJpZ2dlcmVkID0gcXVldWVkTXV0YXRpb25zLmxlbmd0aDtcbiAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgIGlmIChxdWV1ZWRNdXRhdGlvbnMubGVuZ3RoID09PSBxdWV1ZUxlbmd0aFdoZW5UcmlnZ2VyZWQpIHtcbiAgICAgIHdoaWxlIChxdWV1ZWRNdXRhdGlvbnMubGVuZ3RoID4gMClcbiAgICAgICAgcXVldWVkTXV0YXRpb25zLnNoaWZ0KCkoKTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gbXV0YXRlRG9tKGNhbGxiYWNrKSB7XG4gIGlmICghY3VycmVudGx5T2JzZXJ2aW5nKVxuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICBzdG9wT2JzZXJ2aW5nTXV0YXRpb25zKCk7XG4gIGxldCByZXN1bHQgPSBjYWxsYmFjaygpO1xuICBzdGFydE9ic2VydmluZ011dGF0aW9ucygpO1xuICByZXR1cm4gcmVzdWx0O1xufVxudmFyIGlzQ29sbGVjdGluZyA9IGZhbHNlO1xudmFyIGRlZmVycmVkTXV0YXRpb25zID0gW107XG5mdW5jdGlvbiBkZWZlck11dGF0aW9ucygpIHtcbiAgaXNDb2xsZWN0aW5nID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGZsdXNoQW5kU3RvcERlZmVycmluZ011dGF0aW9ucygpIHtcbiAgaXNDb2xsZWN0aW5nID0gZmFsc2U7XG4gIG9uTXV0YXRlKGRlZmVycmVkTXV0YXRpb25zKTtcbiAgZGVmZXJyZWRNdXRhdGlvbnMgPSBbXTtcbn1cbmZ1bmN0aW9uIG9uTXV0YXRlKG11dGF0aW9ucykge1xuICBpZiAoaXNDb2xsZWN0aW5nKSB7XG4gICAgZGVmZXJyZWRNdXRhdGlvbnMgPSBkZWZlcnJlZE11dGF0aW9ucy5jb25jYXQobXV0YXRpb25zKTtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGFkZGVkTm9kZXMgPSBbXTtcbiAgbGV0IHJlbW92ZWROb2RlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGxldCBhZGRlZEF0dHJpYnV0ZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICBsZXQgcmVtb3ZlZEF0dHJpYnV0ZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG11dGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtdXRhdGlvbnNbaV0udGFyZ2V0Ll94X2lnbm9yZU11dGF0aW9uT2JzZXJ2ZXIpXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAobXV0YXRpb25zW2ldLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIpIHtcbiAgICAgIG11dGF0aW9uc1tpXS5yZW1vdmVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICghbm9kZS5feF9tYXJrZXIpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICByZW1vdmVkTm9kZXMuYWRkKG5vZGUpO1xuICAgICAgfSk7XG4gICAgICBtdXRhdGlvbnNbaV0uYWRkZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSAxKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHJlbW92ZWROb2Rlcy5oYXMobm9kZSkpIHtcbiAgICAgICAgICByZW1vdmVkTm9kZXMuZGVsZXRlKG5vZGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5feF9tYXJrZXIpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBhZGRlZE5vZGVzLnB1c2gobm9kZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG11dGF0aW9uc1tpXS50eXBlID09PSBcImF0dHJpYnV0ZXNcIikge1xuICAgICAgbGV0IGVsID0gbXV0YXRpb25zW2ldLnRhcmdldDtcbiAgICAgIGxldCBuYW1lID0gbXV0YXRpb25zW2ldLmF0dHJpYnV0ZU5hbWU7XG4gICAgICBsZXQgb2xkVmFsdWUgPSBtdXRhdGlvbnNbaV0ub2xkVmFsdWU7XG4gICAgICBsZXQgYWRkMiA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFhZGRlZEF0dHJpYnV0ZXMuaGFzKGVsKSlcbiAgICAgICAgICBhZGRlZEF0dHJpYnV0ZXMuc2V0KGVsLCBbXSk7XG4gICAgICAgIGFkZGVkQXR0cmlidXRlcy5nZXQoZWwpLnB1c2goeyBuYW1lLCB2YWx1ZTogZWwuZ2V0QXR0cmlidXRlKG5hbWUpIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCByZW1vdmUgPSAoKSA9PiB7XG4gICAgICAgIGlmICghcmVtb3ZlZEF0dHJpYnV0ZXMuaGFzKGVsKSlcbiAgICAgICAgICByZW1vdmVkQXR0cmlidXRlcy5zZXQoZWwsIFtdKTtcbiAgICAgICAgcmVtb3ZlZEF0dHJpYnV0ZXMuZ2V0KGVsKS5wdXNoKG5hbWUpO1xuICAgICAgfTtcbiAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUobmFtZSkgJiYgb2xkVmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgYWRkMigpO1xuICAgICAgfSBlbHNlIGlmIChlbC5oYXNBdHRyaWJ1dGUobmFtZSkpIHtcbiAgICAgICAgcmVtb3ZlKCk7XG4gICAgICAgIGFkZDIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZW1vdmVkQXR0cmlidXRlcy5mb3JFYWNoKChhdHRycywgZWwpID0+IHtcbiAgICBjbGVhbnVwQXR0cmlidXRlcyhlbCwgYXR0cnMpO1xuICB9KTtcbiAgYWRkZWRBdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJzLCBlbCkgPT4ge1xuICAgIG9uQXR0cmlidXRlQWRkZWRzLmZvckVhY2goKGkpID0+IGkoZWwsIGF0dHJzKSk7XG4gIH0pO1xuICBmb3IgKGxldCBub2RlIG9mIHJlbW92ZWROb2Rlcykge1xuICAgIGlmIChhZGRlZE5vZGVzLnNvbWUoKGkpID0+IGkuY29udGFpbnMobm9kZSkpKVxuICAgICAgY29udGludWU7XG4gICAgb25FbFJlbW92ZWRzLmZvckVhY2goKGkpID0+IGkobm9kZSkpO1xuICB9XG4gIGZvciAobGV0IG5vZGUgb2YgYWRkZWROb2Rlcykge1xuICAgIGlmICghbm9kZS5pc0Nvbm5lY3RlZClcbiAgICAgIGNvbnRpbnVlO1xuICAgIG9uRWxBZGRlZHMuZm9yRWFjaCgoaSkgPT4gaShub2RlKSk7XG4gIH1cbiAgYWRkZWROb2RlcyA9IG51bGw7XG4gIHJlbW92ZWROb2RlcyA9IG51bGw7XG4gIGFkZGVkQXR0cmlidXRlcyA9IG51bGw7XG4gIHJlbW92ZWRBdHRyaWJ1dGVzID0gbnVsbDtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3Njb3BlLmpzXG5mdW5jdGlvbiBzY29wZShub2RlKSB7XG4gIHJldHVybiBtZXJnZVByb3hpZXMoY2xvc2VzdERhdGFTdGFjayhub2RlKSk7XG59XG5mdW5jdGlvbiBhZGRTY29wZVRvTm9kZShub2RlLCBkYXRhMiwgcmVmZXJlbmNlTm9kZSkge1xuICBub2RlLl94X2RhdGFTdGFjayA9IFtkYXRhMiwgLi4uY2xvc2VzdERhdGFTdGFjayhyZWZlcmVuY2VOb2RlIHx8IG5vZGUpXTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBub2RlLl94X2RhdGFTdGFjayA9IG5vZGUuX3hfZGF0YVN0YWNrLmZpbHRlcigoaSkgPT4gaSAhPT0gZGF0YTIpO1xuICB9O1xufVxuZnVuY3Rpb24gY2xvc2VzdERhdGFTdGFjayhub2RlKSB7XG4gIGlmIChub2RlLl94X2RhdGFTdGFjaylcbiAgICByZXR1cm4gbm9kZS5feF9kYXRhU3RhY2s7XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gXCJmdW5jdGlvblwiICYmIG5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgcmV0dXJuIGNsb3Nlc3REYXRhU3RhY2sobm9kZS5ob3N0KTtcbiAgfVxuICBpZiAoIW5vZGUucGFyZW50Tm9kZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gY2xvc2VzdERhdGFTdGFjayhub2RlLnBhcmVudE5vZGUpO1xufVxuZnVuY3Rpb24gbWVyZ2VQcm94aWVzKG9iamVjdHMpIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh7IG9iamVjdHMgfSwgbWVyZ2VQcm94eVRyYXApO1xufVxudmFyIG1lcmdlUHJveHlUcmFwID0ge1xuICBvd25LZXlzKHsgb2JqZWN0cyB9KSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KG9iamVjdHMuZmxhdE1hcCgoaSkgPT4gT2JqZWN0LmtleXMoaSkpKVxuICAgICk7XG4gIH0sXG4gIGhhcyh7IG9iamVjdHMgfSwgbmFtZSkge1xuICAgIGlmIChuYW1lID09IFN5bWJvbC51bnNjb3BhYmxlcylcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gb2JqZWN0cy5zb21lKFxuICAgICAgKG9iaikgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgbmFtZSkgfHwgUmVmbGVjdC5oYXMob2JqLCBuYW1lKVxuICAgICk7XG4gIH0sXG4gIGdldCh7IG9iamVjdHMgfSwgbmFtZSwgdGhpc1Byb3h5KSB7XG4gICAgaWYgKG5hbWUgPT0gXCJ0b0pTT05cIilcbiAgICAgIHJldHVybiBjb2xsYXBzZVByb3hpZXM7XG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0KFxuICAgICAgb2JqZWN0cy5maW5kKFxuICAgICAgICAob2JqKSA9PiBSZWZsZWN0LmhhcyhvYmosIG5hbWUpXG4gICAgICApIHx8IHt9LFxuICAgICAgbmFtZSxcbiAgICAgIHRoaXNQcm94eVxuICAgICk7XG4gIH0sXG4gIHNldCh7IG9iamVjdHMgfSwgbmFtZSwgdmFsdWUsIHRoaXNQcm94eSkge1xuICAgIGNvbnN0IHRhcmdldCA9IG9iamVjdHMuZmluZChcbiAgICAgIChvYmopID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIG5hbWUpXG4gICAgKSB8fCBvYmplY3RzW29iamVjdHMubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcj8uc2V0ICYmIGRlc2NyaXB0b3I/LmdldClcbiAgICAgIHJldHVybiBkZXNjcmlwdG9yLnNldC5jYWxsKHRoaXNQcm94eSwgdmFsdWUpIHx8IHRydWU7XG4gICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpO1xuICB9XG59O1xuZnVuY3Rpb24gY29sbGFwc2VQcm94aWVzKCkge1xuICBsZXQga2V5cyA9IFJlZmxlY3Qub3duS2V5cyh0aGlzKTtcbiAgcmV0dXJuIGtleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgIGFjY1trZXldID0gUmVmbGVjdC5nZXQodGhpcywga2V5KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9pbnRlcmNlcHRvci5qc1xuZnVuY3Rpb24gaW5pdEludGVyY2VwdG9ycyhkYXRhMikge1xuICBsZXQgaXNPYmplY3QyID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbCAhPT0gbnVsbDtcbiAgbGV0IHJlY3Vyc2UgPSAob2JqLCBiYXNlUGF0aCA9IFwiXCIpID0+IHtcbiAgICBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmopKS5mb3JFYWNoKChba2V5LCB7IHZhbHVlLCBlbnVtZXJhYmxlIH1dKSA9PiB7XG4gICAgICBpZiAoZW51bWVyYWJsZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IHZvaWQgMClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5fX3Zfc2tpcClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbGV0IHBhdGggPSBiYXNlUGF0aCA9PT0gXCJcIiA/IGtleSA6IGAke2Jhc2VQYXRofS4ke2tleX1gO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5feF9pbnRlcmNlcHRvcikge1xuICAgICAgICBvYmpba2V5XSA9IHZhbHVlLmluaXRpYWxpemUoZGF0YTIsIHBhdGgsIGtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNPYmplY3QyKHZhbHVlKSAmJiB2YWx1ZSAhPT0gb2JqICYmICEodmFsdWUgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xuICAgICAgICAgIHJlY3Vyc2UodmFsdWUsIHBhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiByZWN1cnNlKGRhdGEyKTtcbn1cbmZ1bmN0aW9uIGludGVyY2VwdG9yKGNhbGxiYWNrLCBtdXRhdGVPYmogPSAoKSA9PiB7XG59KSB7XG4gIGxldCBvYmogPSB7XG4gICAgaW5pdGlhbFZhbHVlOiB2b2lkIDAsXG4gICAgX3hfaW50ZXJjZXB0b3I6IHRydWUsXG4gICAgaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5pbml0aWFsVmFsdWUsICgpID0+IGdldChkYXRhMiwgcGF0aCksICh2YWx1ZSkgPT4gc2V0KGRhdGEyLCBwYXRoLCB2YWx1ZSksIHBhdGgsIGtleSk7XG4gICAgfVxuICB9O1xuICBtdXRhdGVPYmoob2JqKTtcbiAgcmV0dXJuIChpbml0aWFsVmFsdWUpID0+IHtcbiAgICBpZiAodHlwZW9mIGluaXRpYWxWYWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBpbml0aWFsVmFsdWUgIT09IG51bGwgJiYgaW5pdGlhbFZhbHVlLl94X2ludGVyY2VwdG9yKSB7XG4gICAgICBsZXQgaW5pdGlhbGl6ZSA9IG9iai5pbml0aWFsaXplLmJpbmQob2JqKTtcbiAgICAgIG9iai5pbml0aWFsaXplID0gKGRhdGEyLCBwYXRoLCBrZXkpID0+IHtcbiAgICAgICAgbGV0IGlubmVyVmFsdWUgPSBpbml0aWFsVmFsdWUuaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KTtcbiAgICAgICAgb2JqLmluaXRpYWxWYWx1ZSA9IGlubmVyVmFsdWU7XG4gICAgICAgIHJldHVybiBpbml0aWFsaXplKGRhdGEyLCBwYXRoLCBrZXkpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqLmluaXRpYWxWYWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcbn1cbmZ1bmN0aW9uIGdldChvYmosIHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguc3BsaXQoXCIuXCIpLnJlZHVjZSgoY2FycnksIHNlZ21lbnQpID0+IGNhcnJ5W3NlZ21lbnRdLCBvYmopO1xufVxuZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKVxuICAgIHBhdGggPSBwYXRoLnNwbGl0KFwiLlwiKTtcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAxKVxuICAgIG9ialtwYXRoWzBdXSA9IHZhbHVlO1xuICBlbHNlIGlmIChwYXRoLmxlbmd0aCA9PT0gMClcbiAgICB0aHJvdyBlcnJvcjtcbiAgZWxzZSB7XG4gICAgaWYgKG9ialtwYXRoWzBdXSlcbiAgICAgIHJldHVybiBzZXQob2JqW3BhdGhbMF1dLCBwYXRoLnNsaWNlKDEpLCB2YWx1ZSk7XG4gICAgZWxzZSB7XG4gICAgICBvYmpbcGF0aFswXV0gPSB7fTtcbiAgICAgIHJldHVybiBzZXQob2JqW3BhdGhbMF1dLCBwYXRoLnNsaWNlKDEpLCB2YWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MuanNcbnZhciBtYWdpY3MgPSB7fTtcbmZ1bmN0aW9uIG1hZ2ljKG5hbWUsIGNhbGxiYWNrKSB7XG4gIG1hZ2ljc1tuYW1lXSA9IGNhbGxiYWNrO1xufVxuZnVuY3Rpb24gaW5qZWN0TWFnaWNzKG9iaiwgZWwpIHtcbiAgbGV0IG1lbW9pemVkVXRpbGl0aWVzID0gZ2V0VXRpbGl0aWVzKGVsKTtcbiAgT2JqZWN0LmVudHJpZXMobWFnaWNzKS5mb3JFYWNoKChbbmFtZSwgY2FsbGJhY2tdKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgYCQke25hbWV9YCwge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZWwsIG1lbW9pemVkVXRpbGl0aWVzKTtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cbmZ1bmN0aW9uIGdldFV0aWxpdGllcyhlbCkge1xuICBsZXQgW3V0aWxpdGllcywgY2xlYW51cDJdID0gZ2V0RWxlbWVudEJvdW5kVXRpbGl0aWVzKGVsKTtcbiAgbGV0IHV0aWxzID0geyBpbnRlcmNlcHRvciwgLi4udXRpbGl0aWVzIH07XG4gIG9uRWxSZW1vdmVkKGVsLCBjbGVhbnVwMik7XG4gIHJldHVybiB1dGlscztcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2Vycm9yLmpzXG5mdW5jdGlvbiB0cnlDYXRjaChlbCwgZXhwcmVzc2lvbiwgY2FsbGJhY2ssIC4uLmFyZ3MpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY2FsbGJhY2soLi4uYXJncyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBoYW5kbGVFcnJvcihlLCBlbCwgZXhwcmVzc2lvbik7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIGV4cHJlc3Npb24gPSB2b2lkIDApIHtcbiAgZXJyb3IyID0gT2JqZWN0LmFzc2lnbihcbiAgICBlcnJvcjIgPz8geyBtZXNzYWdlOiBcIk5vIGVycm9yIG1lc3NhZ2UgZ2l2ZW4uXCIgfSxcbiAgICB7IGVsLCBleHByZXNzaW9uIH1cbiAgKTtcbiAgY29uc29sZS53YXJuKGBBbHBpbmUgRXhwcmVzc2lvbiBFcnJvcjogJHtlcnJvcjIubWVzc2FnZX1cblxuJHtleHByZXNzaW9uID8gJ0V4cHJlc3Npb246IFwiJyArIGV4cHJlc3Npb24gKyAnXCJcXG5cXG4nIDogXCJcIn1gLCBlbCk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHRocm93IGVycm9yMjtcbiAgfSwgMCk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9ldmFsdWF0b3IuanNcbnZhciBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgPSB0cnVlO1xuZnVuY3Rpb24gZG9udEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyhjYWxsYmFjaykge1xuICBsZXQgY2FjaGUgPSBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnM7XG4gIHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyA9IGZhbHNlO1xuICBsZXQgcmVzdWx0ID0gY2FsbGJhY2soKTtcbiAgc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zID0gY2FjaGU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBldmFsdWF0ZShlbCwgZXhwcmVzc2lvbiwgZXh0cmFzID0ge30pIHtcbiAgbGV0IHJlc3VsdDtcbiAgZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbikoKHZhbHVlKSA9PiByZXN1bHQgPSB2YWx1ZSwgZXh0cmFzKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGV2YWx1YXRlTGF0ZXIoLi4uYXJncykge1xuICByZXR1cm4gdGhlRXZhbHVhdG9yRnVuY3Rpb24oLi4uYXJncyk7XG59XG52YXIgdGhlRXZhbHVhdG9yRnVuY3Rpb24gPSBub3JtYWxFdmFsdWF0b3I7XG5mdW5jdGlvbiBzZXRFdmFsdWF0b3IobmV3RXZhbHVhdG9yKSB7XG4gIHRoZUV2YWx1YXRvckZ1bmN0aW9uID0gbmV3RXZhbHVhdG9yO1xufVxuZnVuY3Rpb24gbm9ybWFsRXZhbHVhdG9yKGVsLCBleHByZXNzaW9uKSB7XG4gIGxldCBvdmVycmlkZGVuTWFnaWNzID0ge307XG4gIGluamVjdE1hZ2ljcyhvdmVycmlkZGVuTWFnaWNzLCBlbCk7XG4gIGxldCBkYXRhU3RhY2sgPSBbb3ZlcnJpZGRlbk1hZ2ljcywgLi4uY2xvc2VzdERhdGFTdGFjayhlbCldO1xuICBsZXQgZXZhbHVhdG9yID0gdHlwZW9mIGV4cHJlc3Npb24gPT09IFwiZnVuY3Rpb25cIiA/IGdlbmVyYXRlRXZhbHVhdG9yRnJvbUZ1bmN0aW9uKGRhdGFTdGFjaywgZXhwcmVzc2lvbikgOiBnZW5lcmF0ZUV2YWx1YXRvckZyb21TdHJpbmcoZGF0YVN0YWNrLCBleHByZXNzaW9uLCBlbCk7XG4gIHJldHVybiB0cnlDYXRjaC5iaW5kKG51bGwsIGVsLCBleHByZXNzaW9uLCBldmFsdWF0b3IpO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVFdmFsdWF0b3JGcm9tRnVuY3Rpb24oZGF0YVN0YWNrLCBmdW5jKSB7XG4gIHJldHVybiAocmVjZWl2ZXIgPSAoKSA9PiB7XG4gIH0sIHsgc2NvcGU6IHNjb3BlMiA9IHt9LCBwYXJhbXMgPSBbXSB9ID0ge30pID0+IHtcbiAgICBsZXQgcmVzdWx0ID0gZnVuYy5hcHBseShtZXJnZVByb3hpZXMoW3Njb3BlMiwgLi4uZGF0YVN0YWNrXSksIHBhcmFtcyk7XG4gICAgcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgcmVzdWx0KTtcbiAgfTtcbn1cbnZhciBldmFsdWF0b3JNZW1vID0ge307XG5mdW5jdGlvbiBnZW5lcmF0ZUZ1bmN0aW9uRnJvbVN0cmluZyhleHByZXNzaW9uLCBlbCkge1xuICBpZiAoZXZhbHVhdG9yTWVtb1tleHByZXNzaW9uXSkge1xuICAgIHJldHVybiBldmFsdWF0b3JNZW1vW2V4cHJlc3Npb25dO1xuICB9XG4gIGxldCBBc3luY0Z1bmN0aW9uID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGFzeW5jIGZ1bmN0aW9uKCkge1xuICB9KS5jb25zdHJ1Y3RvcjtcbiAgbGV0IHJpZ2h0U2lkZVNhZmVFeHByZXNzaW9uID0gL15bXFxuXFxzXSppZi4qXFwoLipcXCkvLnRlc3QoZXhwcmVzc2lvbi50cmltKCkpIHx8IC9eKGxldHxjb25zdClcXHMvLnRlc3QoZXhwcmVzc2lvbi50cmltKCkpID8gYChhc3luYygpPT57ICR7ZXhwcmVzc2lvbn0gfSkoKWAgOiBleHByZXNzaW9uO1xuICBjb25zdCBzYWZlQXN5bmNGdW5jdGlvbiA9ICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgbGV0IGZ1bmMyID0gbmV3IEFzeW5jRnVuY3Rpb24oXG4gICAgICAgIFtcIl9fc2VsZlwiLCBcInNjb3BlXCJdLFxuICAgICAgICBgd2l0aCAoc2NvcGUpIHsgX19zZWxmLnJlc3VsdCA9ICR7cmlnaHRTaWRlU2FmZUV4cHJlc3Npb259IH07IF9fc2VsZi5maW5pc2hlZCA9IHRydWU7IHJldHVybiBfX3NlbGYucmVzdWx0O2BcbiAgICAgICk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnVuYzIsIFwibmFtZVwiLCB7XG4gICAgICAgIHZhbHVlOiBgW0FscGluZV0gJHtleHByZXNzaW9ufWBcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZ1bmMyO1xuICAgIH0gY2F0Y2ggKGVycm9yMikge1xuICAgICAgaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbik7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9O1xuICBsZXQgZnVuYyA9IHNhZmVBc3luY0Z1bmN0aW9uKCk7XG4gIGV2YWx1YXRvck1lbW9bZXhwcmVzc2lvbl0gPSBmdW5jO1xuICByZXR1cm4gZnVuYztcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlRXZhbHVhdG9yRnJvbVN0cmluZyhkYXRhU3RhY2ssIGV4cHJlc3Npb24sIGVsKSB7XG4gIGxldCBmdW5jID0gZ2VuZXJhdGVGdW5jdGlvbkZyb21TdHJpbmcoZXhwcmVzc2lvbiwgZWwpO1xuICByZXR1cm4gKHJlY2VpdmVyID0gKCkgPT4ge1xuICB9LCB7IHNjb3BlOiBzY29wZTIgPSB7fSwgcGFyYW1zID0gW10gfSA9IHt9KSA9PiB7XG4gICAgZnVuYy5yZXN1bHQgPSB2b2lkIDA7XG4gICAgZnVuYy5maW5pc2hlZCA9IGZhbHNlO1xuICAgIGxldCBjb21wbGV0ZVNjb3BlID0gbWVyZ2VQcm94aWVzKFtzY29wZTIsIC4uLmRhdGFTdGFja10pO1xuICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBsZXQgcHJvbWlzZSA9IGZ1bmMoZnVuYywgY29tcGxldGVTY29wZSkuY2F0Y2goKGVycm9yMikgPT4gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbikpO1xuICAgICAgaWYgKGZ1bmMuZmluaXNoZWQpIHtcbiAgICAgICAgcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgZnVuYy5yZXN1bHQsIGNvbXBsZXRlU2NvcGUsIHBhcmFtcywgZWwpO1xuICAgICAgICBmdW5jLnJlc3VsdCA9IHZvaWQgMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgcmVzdWx0LCBjb21wbGV0ZVNjb3BlLCBwYXJhbXMsIGVsKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yMikgPT4gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbikpLmZpbmFsbHkoKCkgPT4gZnVuYy5yZXN1bHQgPSB2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIHZhbHVlLCBzY29wZTIsIHBhcmFtcywgZWwpIHtcbiAgaWYgKHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyAmJiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGxldCByZXN1bHQgPSB2YWx1ZS5hcHBseShzY29wZTIsIHBhcmFtcyk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIHJlc3VsdC50aGVuKChpKSA9PiBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCBpLCBzY29wZTIsIHBhcmFtcykpLmNhdGNoKChlcnJvcjIpID0+IGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIHZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlY2VpdmVyKHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICB2YWx1ZS50aGVuKChpKSA9PiByZWNlaXZlcihpKSk7XG4gIH0gZWxzZSB7XG4gICAgcmVjZWl2ZXIodmFsdWUpO1xuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzLmpzXG52YXIgcHJlZml4QXNTdHJpbmcgPSBcIngtXCI7XG5mdW5jdGlvbiBwcmVmaXgoc3ViamVjdCA9IFwiXCIpIHtcbiAgcmV0dXJuIHByZWZpeEFzU3RyaW5nICsgc3ViamVjdDtcbn1cbmZ1bmN0aW9uIHNldFByZWZpeChuZXdQcmVmaXgpIHtcbiAgcHJlZml4QXNTdHJpbmcgPSBuZXdQcmVmaXg7XG59XG52YXIgZGlyZWN0aXZlSGFuZGxlcnMgPSB7fTtcbmZ1bmN0aW9uIGRpcmVjdGl2ZShuYW1lLCBjYWxsYmFjaykge1xuICBkaXJlY3RpdmVIYW5kbGVyc1tuYW1lXSA9IGNhbGxiYWNrO1xuICByZXR1cm4ge1xuICAgIGJlZm9yZShkaXJlY3RpdmUyKSB7XG4gICAgICBpZiAoIWRpcmVjdGl2ZUhhbmRsZXJzW2RpcmVjdGl2ZTJdKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihTdHJpbmcucmF3YENhbm5vdCBmaW5kIGRpcmVjdGl2ZSBcXGAke2RpcmVjdGl2ZTJ9XFxgLiBcXGAke25hbWV9XFxgIHdpbGwgdXNlIHRoZSBkZWZhdWx0IG9yZGVyIG9mIGV4ZWN1dGlvbmApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3MgPSBkaXJlY3RpdmVPcmRlci5pbmRleE9mKGRpcmVjdGl2ZTIpO1xuICAgICAgZGlyZWN0aXZlT3JkZXIuc3BsaWNlKHBvcyA+PSAwID8gcG9zIDogZGlyZWN0aXZlT3JkZXIuaW5kZXhPZihcIkRFRkFVTFRcIiksIDAsIG5hbWUpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGRpcmVjdGl2ZUV4aXN0cyhuYW1lKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhkaXJlY3RpdmVIYW5kbGVycykuaW5jbHVkZXMobmFtZSk7XG59XG5mdW5jdGlvbiBkaXJlY3RpdmVzKGVsLCBhdHRyaWJ1dGVzLCBvcmlnaW5hbEF0dHJpYnV0ZU92ZXJyaWRlKSB7XG4gIGF0dHJpYnV0ZXMgPSBBcnJheS5mcm9tKGF0dHJpYnV0ZXMpO1xuICBpZiAoZWwuX3hfdmlydHVhbERpcmVjdGl2ZXMpIHtcbiAgICBsZXQgdkF0dHJpYnV0ZXMgPSBPYmplY3QuZW50cmllcyhlbC5feF92aXJ0dWFsRGlyZWN0aXZlcykubWFwKChbbmFtZSwgdmFsdWVdKSA9PiAoeyBuYW1lLCB2YWx1ZSB9KSk7XG4gICAgbGV0IHN0YXRpY0F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzT25seSh2QXR0cmlidXRlcyk7XG4gICAgdkF0dHJpYnV0ZXMgPSB2QXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgaWYgKHN0YXRpY0F0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT4gYXR0ci5uYW1lID09PSBhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBgeC1iaW5kOiR7YXR0cmlidXRlLm5hbWV9YCxcbiAgICAgICAgICB2YWx1ZTogYFwiJHthdHRyaWJ1dGUudmFsdWV9XCJgXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXR0cmlidXRlO1xuICAgIH0pO1xuICAgIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzLmNvbmNhdCh2QXR0cmlidXRlcyk7XG4gIH1cbiAgbGV0IHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwID0ge307XG4gIGxldCBkaXJlY3RpdmVzMiA9IGF0dHJpYnV0ZXMubWFwKHRvVHJhbnNmb3JtZWRBdHRyaWJ1dGVzKChuZXdOYW1lLCBvbGROYW1lKSA9PiB0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcFtuZXdOYW1lXSA9IG9sZE5hbWUpKS5maWx0ZXIob3V0Tm9uQWxwaW5lQXR0cmlidXRlcykubWFwKHRvUGFyc2VkRGlyZWN0aXZlcyh0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcCwgb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSkpLnNvcnQoYnlQcmlvcml0eSk7XG4gIHJldHVybiBkaXJlY3RpdmVzMi5tYXAoKGRpcmVjdGl2ZTIpID0+IHtcbiAgICByZXR1cm4gZ2V0RGlyZWN0aXZlSGFuZGxlcihlbCwgZGlyZWN0aXZlMik7XG4gIH0pO1xufVxuZnVuY3Rpb24gYXR0cmlidXRlc09ubHkoYXR0cmlidXRlcykge1xuICByZXR1cm4gQXJyYXkuZnJvbShhdHRyaWJ1dGVzKS5tYXAodG9UcmFuc2Zvcm1lZEF0dHJpYnV0ZXMoKSkuZmlsdGVyKChhdHRyKSA9PiAhb3V0Tm9uQWxwaW5lQXR0cmlidXRlcyhhdHRyKSk7XG59XG52YXIgaXNEZWZlcnJpbmdIYW5kbGVycyA9IGZhbHNlO1xudmFyIGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGN1cnJlbnRIYW5kbGVyU3RhY2tLZXkgPSBTeW1ib2woKTtcbmZ1bmN0aW9uIGRlZmVySGFuZGxpbmdEaXJlY3RpdmVzKGNhbGxiYWNrKSB7XG4gIGlzRGVmZXJyaW5nSGFuZGxlcnMgPSB0cnVlO1xuICBsZXQga2V5ID0gU3ltYm9sKCk7XG4gIGN1cnJlbnRIYW5kbGVyU3RhY2tLZXkgPSBrZXk7XG4gIGRpcmVjdGl2ZUhhbmRsZXJTdGFja3Muc2V0KGtleSwgW10pO1xuICBsZXQgZmx1c2hIYW5kbGVycyA9ICgpID0+IHtcbiAgICB3aGlsZSAoZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5nZXQoa2V5KS5sZW5ndGgpXG4gICAgICBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLmdldChrZXkpLnNoaWZ0KCkoKTtcbiAgICBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLmRlbGV0ZShrZXkpO1xuICB9O1xuICBsZXQgc3RvcERlZmVycmluZyA9ICgpID0+IHtcbiAgICBpc0RlZmVycmluZ0hhbmRsZXJzID0gZmFsc2U7XG4gICAgZmx1c2hIYW5kbGVycygpO1xuICB9O1xuICBjYWxsYmFjayhmbHVzaEhhbmRsZXJzKTtcbiAgc3RvcERlZmVycmluZygpO1xufVxuZnVuY3Rpb24gZ2V0RWxlbWVudEJvdW5kVXRpbGl0aWVzKGVsKSB7XG4gIGxldCBjbGVhbnVwcyA9IFtdO1xuICBsZXQgY2xlYW51cDIgPSAoY2FsbGJhY2spID0+IGNsZWFudXBzLnB1c2goY2FsbGJhY2spO1xuICBsZXQgW2VmZmVjdDMsIGNsZWFudXBFZmZlY3RdID0gZWxlbWVudEJvdW5kRWZmZWN0KGVsKTtcbiAgY2xlYW51cHMucHVzaChjbGVhbnVwRWZmZWN0KTtcbiAgbGV0IHV0aWxpdGllcyA9IHtcbiAgICBBbHBpbmU6IGFscGluZV9kZWZhdWx0LFxuICAgIGVmZmVjdDogZWZmZWN0MyxcbiAgICBjbGVhbnVwOiBjbGVhbnVwMixcbiAgICBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyLmJpbmQoZXZhbHVhdGVMYXRlciwgZWwpLFxuICAgIGV2YWx1YXRlOiBldmFsdWF0ZS5iaW5kKGV2YWx1YXRlLCBlbClcbiAgfTtcbiAgbGV0IGRvQ2xlYW51cCA9ICgpID0+IGNsZWFudXBzLmZvckVhY2goKGkpID0+IGkoKSk7XG4gIHJldHVybiBbdXRpbGl0aWVzLCBkb0NsZWFudXBdO1xufVxuZnVuY3Rpb24gZ2V0RGlyZWN0aXZlSGFuZGxlcihlbCwgZGlyZWN0aXZlMikge1xuICBsZXQgbm9vcCA9ICgpID0+IHtcbiAgfTtcbiAgbGV0IGhhbmRsZXI0ID0gZGlyZWN0aXZlSGFuZGxlcnNbZGlyZWN0aXZlMi50eXBlXSB8fCBub29wO1xuICBsZXQgW3V0aWxpdGllcywgY2xlYW51cDJdID0gZ2V0RWxlbWVudEJvdW5kVXRpbGl0aWVzKGVsKTtcbiAgb25BdHRyaWJ1dGVSZW1vdmVkKGVsLCBkaXJlY3RpdmUyLm9yaWdpbmFsLCBjbGVhbnVwMik7XG4gIGxldCBmdWxsSGFuZGxlciA9ICgpID0+IHtcbiAgICBpZiAoZWwuX3hfaWdub3JlIHx8IGVsLl94X2lnbm9yZVNlbGYpXG4gICAgICByZXR1cm47XG4gICAgaGFuZGxlcjQuaW5saW5lICYmIGhhbmRsZXI0LmlubGluZShlbCwgZGlyZWN0aXZlMiwgdXRpbGl0aWVzKTtcbiAgICBoYW5kbGVyNCA9IGhhbmRsZXI0LmJpbmQoaGFuZGxlcjQsIGVsLCBkaXJlY3RpdmUyLCB1dGlsaXRpZXMpO1xuICAgIGlzRGVmZXJyaW5nSGFuZGxlcnMgPyBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLmdldChjdXJyZW50SGFuZGxlclN0YWNrS2V5KS5wdXNoKGhhbmRsZXI0KSA6IGhhbmRsZXI0KCk7XG4gIH07XG4gIGZ1bGxIYW5kbGVyLnJ1bkNsZWFudXBzID0gY2xlYW51cDI7XG4gIHJldHVybiBmdWxsSGFuZGxlcjtcbn1cbnZhciBzdGFydGluZ1dpdGggPSAoc3ViamVjdCwgcmVwbGFjZW1lbnQpID0+ICh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgaWYgKG5hbWUuc3RhcnRzV2l0aChzdWJqZWN0KSlcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKHN1YmplY3QsIHJlcGxhY2VtZW50KTtcbiAgcmV0dXJuIHsgbmFtZSwgdmFsdWUgfTtcbn07XG52YXIgaW50byA9IChpKSA9PiBpO1xuZnVuY3Rpb24gdG9UcmFuc2Zvcm1lZEF0dHJpYnV0ZXMoY2FsbGJhY2sgPSAoKSA9PiB7XG59KSB7XG4gIHJldHVybiAoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gICAgbGV0IHsgbmFtZTogbmV3TmFtZSwgdmFsdWU6IG5ld1ZhbHVlIH0gPSBhdHRyaWJ1dGVUcmFuc2Zvcm1lcnMucmVkdWNlKChjYXJyeSwgdHJhbnNmb3JtKSA9PiB7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtKGNhcnJ5KTtcbiAgICB9LCB7IG5hbWUsIHZhbHVlIH0pO1xuICAgIGlmIChuZXdOYW1lICE9PSBuYW1lKVxuICAgICAgY2FsbGJhY2sobmV3TmFtZSwgbmFtZSk7XG4gICAgcmV0dXJuIHsgbmFtZTogbmV3TmFtZSwgdmFsdWU6IG5ld1ZhbHVlIH07XG4gIH07XG59XG52YXIgYXR0cmlidXRlVHJhbnNmb3JtZXJzID0gW107XG5mdW5jdGlvbiBtYXBBdHRyaWJ1dGVzKGNhbGxiYWNrKSB7XG4gIGF0dHJpYnV0ZVRyYW5zZm9ybWVycy5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIG91dE5vbkFscGluZUF0dHJpYnV0ZXMoeyBuYW1lIH0pIHtcbiAgcmV0dXJuIGFscGluZUF0dHJpYnV0ZVJlZ2V4KCkudGVzdChuYW1lKTtcbn1cbnZhciBhbHBpbmVBdHRyaWJ1dGVSZWdleCA9ICgpID0+IG5ldyBSZWdFeHAoYF4ke3ByZWZpeEFzU3RyaW5nfShbXjpeLl0rKVxcXFxiYCk7XG5mdW5jdGlvbiB0b1BhcnNlZERpcmVjdGl2ZXModHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXAsIG9yaWdpbmFsQXR0cmlidXRlT3ZlcnJpZGUpIHtcbiAgcmV0dXJuICh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgICBsZXQgdHlwZU1hdGNoID0gbmFtZS5tYXRjaChhbHBpbmVBdHRyaWJ1dGVSZWdleCgpKTtcbiAgICBsZXQgdmFsdWVNYXRjaCA9IG5hbWUubWF0Y2goLzooW2EtekEtWjAtOVxcLV86XSspLyk7XG4gICAgbGV0IG1vZGlmaWVycyA9IG5hbWUubWF0Y2goL1xcLlteLlxcXV0rKD89W15cXF1dKiQpL2cpIHx8IFtdO1xuICAgIGxldCBvcmlnaW5hbCA9IG9yaWdpbmFsQXR0cmlidXRlT3ZlcnJpZGUgfHwgdHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXBbbmFtZV0gfHwgbmFtZTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdHlwZU1hdGNoID8gdHlwZU1hdGNoWzFdIDogbnVsbCxcbiAgICAgIHZhbHVlOiB2YWx1ZU1hdGNoID8gdmFsdWVNYXRjaFsxXSA6IG51bGwsXG4gICAgICBtb2RpZmllcnM6IG1vZGlmaWVycy5tYXAoKGkpID0+IGkucmVwbGFjZShcIi5cIiwgXCJcIikpLFxuICAgICAgZXhwcmVzc2lvbjogdmFsdWUsXG4gICAgICBvcmlnaW5hbFxuICAgIH07XG4gIH07XG59XG52YXIgREVGQVVMVCA9IFwiREVGQVVMVFwiO1xudmFyIGRpcmVjdGl2ZU9yZGVyID0gW1xuICBcImlnbm9yZVwiLFxuICBcInJlZlwiLFxuICBcImRhdGFcIixcbiAgXCJpZFwiLFxuICBcImFuY2hvclwiLFxuICBcImJpbmRcIixcbiAgXCJpbml0XCIsXG4gIFwiZm9yXCIsXG4gIFwibW9kZWxcIixcbiAgXCJtb2RlbGFibGVcIixcbiAgXCJ0cmFuc2l0aW9uXCIsXG4gIFwic2hvd1wiLFxuICBcImlmXCIsXG4gIERFRkFVTFQsXG4gIFwidGVsZXBvcnRcIlxuXTtcbmZ1bmN0aW9uIGJ5UHJpb3JpdHkoYSwgYikge1xuICBsZXQgdHlwZUEgPSBkaXJlY3RpdmVPcmRlci5pbmRleE9mKGEudHlwZSkgPT09IC0xID8gREVGQVVMVCA6IGEudHlwZTtcbiAgbGV0IHR5cGVCID0gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZihiLnR5cGUpID09PSAtMSA/IERFRkFVTFQgOiBiLnR5cGU7XG4gIHJldHVybiBkaXJlY3RpdmVPcmRlci5pbmRleE9mKHR5cGVBKSAtIGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YodHlwZUIpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvZGlzcGF0Y2guanNcbmZ1bmN0aW9uIGRpc3BhdGNoKGVsLCBuYW1lLCBkZXRhaWwgPSB7fSkge1xuICBlbC5kaXNwYXRjaEV2ZW50KFxuICAgIG5ldyBDdXN0b21FdmVudChuYW1lLCB7XG4gICAgICBkZXRhaWwsXG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgLy8gQWxsb3dzIGV2ZW50cyB0byBwYXNzIHRoZSBzaGFkb3cgRE9NIGJhcnJpZXIuXG4gICAgICBjb21wb3NlZDogdHJ1ZSxcbiAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICB9KVxuICApO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvd2Fsay5qc1xuZnVuY3Rpb24gd2FsayhlbCwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBTaGFkb3dSb290ID09PSBcImZ1bmN0aW9uXCIgJiYgZWwgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgQXJyYXkuZnJvbShlbC5jaGlsZHJlbikuZm9yRWFjaCgoZWwyKSA9PiB3YWxrKGVsMiwgY2FsbGJhY2spKTtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHNraXAgPSBmYWxzZTtcbiAgY2FsbGJhY2soZWwsICgpID0+IHNraXAgPSB0cnVlKTtcbiAgaWYgKHNraXApXG4gICAgcmV0dXJuO1xuICBsZXQgbm9kZSA9IGVsLmZpcnN0RWxlbWVudENoaWxkO1xuICB3aGlsZSAobm9kZSkge1xuICAgIHdhbGsobm9kZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICBub2RlID0gbm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIH1cbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3dhcm4uanNcbmZ1bmN0aW9uIHdhcm4obWVzc2FnZSwgLi4uYXJncykge1xuICBjb25zb2xlLndhcm4oYEFscGluZSBXYXJuaW5nOiAke21lc3NhZ2V9YCwgLi4uYXJncyk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9saWZlY3ljbGUuanNcbnZhciBzdGFydGVkID0gZmFsc2U7XG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgaWYgKHN0YXJ0ZWQpXG4gICAgd2FybihcIkFscGluZSBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkIG9uIHRoaXMgcGFnZS4gQ2FsbGluZyBBbHBpbmUuc3RhcnQoKSBtb3JlIHRoYW4gb25jZSBjYW4gY2F1c2UgcHJvYmxlbXMuXCIpO1xuICBzdGFydGVkID0gdHJ1ZTtcbiAgaWYgKCFkb2N1bWVudC5ib2R5KVxuICAgIHdhcm4oXCJVbmFibGUgdG8gaW5pdGlhbGl6ZS4gVHJ5aW5nIHRvIGxvYWQgQWxwaW5lIGJlZm9yZSBgPGJvZHk+YCBpcyBhdmFpbGFibGUuIERpZCB5b3UgZm9yZ2V0IHRvIGFkZCBgZGVmZXJgIGluIEFscGluZSdzIGA8c2NyaXB0PmAgdGFnP1wiKTtcbiAgZGlzcGF0Y2goZG9jdW1lbnQsIFwiYWxwaW5lOmluaXRcIik7XG4gIGRpc3BhdGNoKGRvY3VtZW50LCBcImFscGluZTppbml0aWFsaXppbmdcIik7XG4gIHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zKCk7XG4gIG9uRWxBZGRlZCgoZWwpID0+IGluaXRUcmVlKGVsLCB3YWxrKSk7XG4gIG9uRWxSZW1vdmVkKChlbCkgPT4gZGVzdHJveVRyZWUoZWwpKTtcbiAgb25BdHRyaWJ1dGVzQWRkZWQoKGVsLCBhdHRycykgPT4ge1xuICAgIGRpcmVjdGl2ZXMoZWwsIGF0dHJzKS5mb3JFYWNoKChoYW5kbGUpID0+IGhhbmRsZSgpKTtcbiAgfSk7XG4gIGxldCBvdXROZXN0ZWRDb21wb25lbnRzID0gKGVsKSA9PiAhY2xvc2VzdFJvb3QoZWwucGFyZW50RWxlbWVudCwgdHJ1ZSk7XG4gIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhbGxTZWxlY3RvcnMoKS5qb2luKFwiLFwiKSkpLmZpbHRlcihvdXROZXN0ZWRDb21wb25lbnRzKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgIGluaXRUcmVlKGVsKTtcbiAgfSk7XG4gIGRpc3BhdGNoKGRvY3VtZW50LCBcImFscGluZTppbml0aWFsaXplZFwiKTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgd2FybkFib3V0TWlzc2luZ1BsdWdpbnMoKTtcbiAgfSk7XG59XG52YXIgcm9vdFNlbGVjdG9yQ2FsbGJhY2tzID0gW107XG52YXIgaW5pdFNlbGVjdG9yQ2FsbGJhY2tzID0gW107XG5mdW5jdGlvbiByb290U2VsZWN0b3JzKCkge1xuICByZXR1cm4gcm9vdFNlbGVjdG9yQ2FsbGJhY2tzLm1hcCgoZm4pID0+IGZuKCkpO1xufVxuZnVuY3Rpb24gYWxsU2VsZWN0b3JzKCkge1xuICByZXR1cm4gcm9vdFNlbGVjdG9yQ2FsbGJhY2tzLmNvbmNhdChpbml0U2VsZWN0b3JDYWxsYmFja3MpLm1hcCgoZm4pID0+IGZuKCkpO1xufVxuZnVuY3Rpb24gYWRkUm9vdFNlbGVjdG9yKHNlbGVjdG9yQ2FsbGJhY2spIHtcbiAgcm9vdFNlbGVjdG9yQ2FsbGJhY2tzLnB1c2goc2VsZWN0b3JDYWxsYmFjayk7XG59XG5mdW5jdGlvbiBhZGRJbml0U2VsZWN0b3Ioc2VsZWN0b3JDYWxsYmFjaykge1xuICBpbml0U2VsZWN0b3JDYWxsYmFja3MucHVzaChzZWxlY3RvckNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGNsb3Nlc3RSb290KGVsLCBpbmNsdWRlSW5pdFNlbGVjdG9ycyA9IGZhbHNlKSB7XG4gIHJldHVybiBmaW5kQ2xvc2VzdChlbCwgKGVsZW1lbnQpID0+IHtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBpbmNsdWRlSW5pdFNlbGVjdG9ycyA/IGFsbFNlbGVjdG9ycygpIDogcm9vdFNlbGVjdG9ycygpO1xuICAgIGlmIChzZWxlY3RvcnMuc29tZSgoc2VsZWN0b3IpID0+IGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuZnVuY3Rpb24gZmluZENsb3Nlc3QoZWwsIGNhbGxiYWNrKSB7XG4gIGlmICghZWwpXG4gICAgcmV0dXJuO1xuICBpZiAoY2FsbGJhY2soZWwpKVxuICAgIHJldHVybiBlbDtcbiAgaWYgKGVsLl94X3RlbGVwb3J0QmFjaylcbiAgICBlbCA9IGVsLl94X3RlbGVwb3J0QmFjaztcbiAgaWYgKCFlbC5wYXJlbnRFbGVtZW50KVxuICAgIHJldHVybjtcbiAgcmV0dXJuIGZpbmRDbG9zZXN0KGVsLnBhcmVudEVsZW1lbnQsIGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGlzUm9vdChlbCkge1xuICByZXR1cm4gcm9vdFNlbGVjdG9ycygpLnNvbWUoKHNlbGVjdG9yKSA9PiBlbC5tYXRjaGVzKHNlbGVjdG9yKSk7XG59XG52YXIgaW5pdEludGVyY2VwdG9yczIgPSBbXTtcbmZ1bmN0aW9uIGludGVyY2VwdEluaXQoY2FsbGJhY2spIHtcbiAgaW5pdEludGVyY2VwdG9yczIucHVzaChjYWxsYmFjayk7XG59XG52YXIgbWFya2VyRGlzcGVuc2VyID0gMTtcbmZ1bmN0aW9uIGluaXRUcmVlKGVsLCB3YWxrZXIgPSB3YWxrLCBpbnRlcmNlcHQgPSAoKSA9PiB7XG59KSB7XG4gIGlmIChmaW5kQ2xvc2VzdChlbCwgKGkpID0+IGkuX3hfaWdub3JlKSlcbiAgICByZXR1cm47XG4gIGRlZmVySGFuZGxpbmdEaXJlY3RpdmVzKCgpID0+IHtcbiAgICB3YWxrZXIoZWwsIChlbDIsIHNraXApID0+IHtcbiAgICAgIGlmIChlbDIuX3hfbWFya2VyKVxuICAgICAgICByZXR1cm47XG4gICAgICBpbnRlcmNlcHQoZWwyLCBza2lwKTtcbiAgICAgIGluaXRJbnRlcmNlcHRvcnMyLmZvckVhY2goKGkpID0+IGkoZWwyLCBza2lwKSk7XG4gICAgICBkaXJlY3RpdmVzKGVsMiwgZWwyLmF0dHJpYnV0ZXMpLmZvckVhY2goKGhhbmRsZSkgPT4gaGFuZGxlKCkpO1xuICAgICAgaWYgKCFlbDIuX3hfaWdub3JlKVxuICAgICAgICBlbDIuX3hfbWFya2VyID0gbWFya2VyRGlzcGVuc2VyKys7XG4gICAgICBlbDIuX3hfaWdub3JlICYmIHNraXAoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5mdW5jdGlvbiBkZXN0cm95VHJlZShyb290LCB3YWxrZXIgPSB3YWxrKSB7XG4gIHdhbGtlcihyb290LCAoZWwpID0+IHtcbiAgICBjbGVhbnVwRWxlbWVudChlbCk7XG4gICAgY2xlYW51cEF0dHJpYnV0ZXMoZWwpO1xuICAgIGRlbGV0ZSBlbC5feF9tYXJrZXI7XG4gIH0pO1xufVxuZnVuY3Rpb24gd2FybkFib3V0TWlzc2luZ1BsdWdpbnMoKSB7XG4gIGxldCBwbHVnaW5EaXJlY3RpdmVzID0gW1xuICAgIFtcInVpXCIsIFwiZGlhbG9nXCIsIFtcIlt4LWRpYWxvZ10sIFt4LXBvcG92ZXJdXCJdXSxcbiAgICBbXCJhbmNob3JcIiwgXCJhbmNob3JcIiwgW1wiW3gtYW5jaG9yXVwiXV0sXG4gICAgW1wic29ydFwiLCBcInNvcnRcIiwgW1wiW3gtc29ydF1cIl1dXG4gIF07XG4gIHBsdWdpbkRpcmVjdGl2ZXMuZm9yRWFjaCgoW3BsdWdpbjIsIGRpcmVjdGl2ZTIsIHNlbGVjdG9yc10pID0+IHtcbiAgICBpZiAoZGlyZWN0aXZlRXhpc3RzKGRpcmVjdGl2ZTIpKVxuICAgICAgcmV0dXJuO1xuICAgIHNlbGVjdG9ycy5zb21lKChzZWxlY3RvcikgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgICAgIHdhcm4oYGZvdW5kIFwiJHtzZWxlY3Rvcn1cIiwgYnV0IG1pc3NpbmcgJHtwbHVnaW4yfSBwbHVnaW5gKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbmV4dFRpY2suanNcbnZhciB0aWNrU3RhY2sgPSBbXTtcbnZhciBpc0hvbGRpbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgaXNIb2xkaW5nIHx8IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVsZWFzZU5leHRUaWNrcygpO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMpID0+IHtcbiAgICB0aWNrU3RhY2sucHVzaCgoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgICAgcmVzKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVsZWFzZU5leHRUaWNrcygpIHtcbiAgaXNIb2xkaW5nID0gZmFsc2U7XG4gIHdoaWxlICh0aWNrU3RhY2subGVuZ3RoKVxuICAgIHRpY2tTdGFjay5zaGlmdCgpKCk7XG59XG5mdW5jdGlvbiBob2xkTmV4dFRpY2tzKCkge1xuICBpc0hvbGRpbmcgPSB0cnVlO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvY2xhc3Nlcy5qc1xuZnVuY3Rpb24gc2V0Q2xhc3NlcyhlbCwgdmFsdWUpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHNldENsYXNzZXNGcm9tU3RyaW5nKGVsLCB2YWx1ZS5qb2luKFwiIFwiKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHNldENsYXNzZXNGcm9tT2JqZWN0KGVsLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gc2V0Q2xhc3NlcyhlbCwgdmFsdWUoKSk7XG4gIH1cbiAgcmV0dXJuIHNldENsYXNzZXNGcm9tU3RyaW5nKGVsLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBzZXRDbGFzc2VzRnJvbVN0cmluZyhlbCwgY2xhc3NTdHJpbmcpIHtcbiAgbGV0IHNwbGl0ID0gKGNsYXNzU3RyaW5nMikgPT4gY2xhc3NTdHJpbmcyLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBtaXNzaW5nQ2xhc3NlcyA9IChjbGFzc1N0cmluZzIpID0+IGNsYXNzU3RyaW5nMi5zcGxpdChcIiBcIikuZmlsdGVyKChpKSA9PiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGkpKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBhZGRDbGFzc2VzQW5kUmV0dXJuVW5kbyA9IChjbGFzc2VzKSA9PiB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzKTtcbiAgICB9O1xuICB9O1xuICBjbGFzc1N0cmluZyA9IGNsYXNzU3RyaW5nID09PSB0cnVlID8gY2xhc3NTdHJpbmcgPSBcIlwiIDogY2xhc3NTdHJpbmcgfHwgXCJcIjtcbiAgcmV0dXJuIGFkZENsYXNzZXNBbmRSZXR1cm5VbmRvKG1pc3NpbmdDbGFzc2VzKGNsYXNzU3RyaW5nKSk7XG59XG5mdW5jdGlvbiBzZXRDbGFzc2VzRnJvbU9iamVjdChlbCwgY2xhc3NPYmplY3QpIHtcbiAgbGV0IHNwbGl0ID0gKGNsYXNzU3RyaW5nKSA9PiBjbGFzc1N0cmluZy5zcGxpdChcIiBcIikuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgZm9yQWRkID0gT2JqZWN0LmVudHJpZXMoY2xhc3NPYmplY3QpLmZsYXRNYXAoKFtjbGFzc1N0cmluZywgYm9vbF0pID0+IGJvb2wgPyBzcGxpdChjbGFzc1N0cmluZykgOiBmYWxzZSkuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgZm9yUmVtb3ZlID0gT2JqZWN0LmVudHJpZXMoY2xhc3NPYmplY3QpLmZsYXRNYXAoKFtjbGFzc1N0cmluZywgYm9vbF0pID0+ICFib29sID8gc3BsaXQoY2xhc3NTdHJpbmcpIDogZmFsc2UpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGFkZGVkID0gW107XG4gIGxldCByZW1vdmVkID0gW107XG4gIGZvclJlbW92ZS5mb3JFYWNoKChpKSA9PiB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhpKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShpKTtcbiAgICAgIHJlbW92ZWQucHVzaChpKTtcbiAgICB9XG4gIH0pO1xuICBmb3JBZGQuZm9yRWFjaCgoaSkgPT4ge1xuICAgIGlmICghZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGkpKSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGkpO1xuICAgICAgYWRkZWQucHVzaChpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHJlbW92ZWQuZm9yRWFjaCgoaSkgPT4gZWwuY2xhc3NMaXN0LmFkZChpKSk7XG4gICAgYWRkZWQuZm9yRWFjaCgoaSkgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShpKSk7XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9zdHlsZXMuanNcbmZ1bmN0aW9uIHNldFN0eWxlcyhlbCwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgIHJldHVybiBzZXRTdHlsZXNGcm9tT2JqZWN0KGVsLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHNldFN0eWxlc0Zyb21TdHJpbmcoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNldFN0eWxlc0Zyb21PYmplY3QoZWwsIHZhbHVlKSB7XG4gIGxldCBwcmV2aW91c1N0eWxlcyA9IHt9O1xuICBPYmplY3QuZW50cmllcyh2YWx1ZSkuZm9yRWFjaCgoW2tleSwgdmFsdWUyXSkgPT4ge1xuICAgIHByZXZpb3VzU3R5bGVzW2tleV0gPSBlbC5zdHlsZVtrZXldO1xuICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoXCItLVwiKSkge1xuICAgICAga2V5ID0ga2ViYWJDYXNlKGtleSk7XG4gICAgfVxuICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUyKTtcbiAgfSk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChlbC5zdHlsZS5sZW5ndGggPT09IDApIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgc2V0U3R5bGVzKGVsLCBwcmV2aW91c1N0eWxlcyk7XG4gIH07XG59XG5mdW5jdGlvbiBzZXRTdHlsZXNGcm9tU3RyaW5nKGVsLCB2YWx1ZSkge1xuICBsZXQgY2FjaGUgPSBlbC5nZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCB2YWx1ZSk7XG4gIGVsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIHZhbHVlKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBjYWNoZSB8fCBcIlwiKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGtlYmFiQ2FzZShzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIFwiJDEtJDJcIikudG9Mb3dlckNhc2UoKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL29uY2UuanNcbmZ1bmN0aW9uIG9uY2UoY2FsbGJhY2ssIGZhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICBsZXQgY2FsbGVkID0gZmFsc2U7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXRyYW5zaXRpb24uanNcbmRpcmVjdGl2ZShcInRyYW5zaXRpb25cIiwgKGVsLCB7IHZhbHVlLCBtb2RpZmllcnMsIGV4cHJlc3Npb24gfSwgeyBldmFsdWF0ZTogZXZhbHVhdGUyIH0pID0+IHtcbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcImZ1bmN0aW9uXCIpXG4gICAgZXhwcmVzc2lvbiA9IGV2YWx1YXRlMihleHByZXNzaW9uKTtcbiAgaWYgKGV4cHJlc3Npb24gPT09IGZhbHNlKVxuICAgIHJldHVybjtcbiAgaWYgKCFleHByZXNzaW9uIHx8IHR5cGVvZiBleHByZXNzaW9uID09PSBcImJvb2xlYW5cIikge1xuICAgIHJlZ2lzdGVyVHJhbnNpdGlvbnNGcm9tSGVscGVyKGVsLCBtb2RpZmllcnMsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICByZWdpc3RlclRyYW5zaXRpb25zRnJvbUNsYXNzU3RyaW5nKGVsLCBleHByZXNzaW9uLCB2YWx1ZSk7XG4gIH1cbn0pO1xuZnVuY3Rpb24gcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21DbGFzc1N0cmluZyhlbCwgY2xhc3NTdHJpbmcsIHN0YWdlKSB7XG4gIHJlZ2lzdGVyVHJhbnNpdGlvbk9iamVjdChlbCwgc2V0Q2xhc3NlcywgXCJcIik7XG4gIGxldCBkaXJlY3RpdmVTdG9yYWdlTWFwID0ge1xuICAgIFwiZW50ZXJcIjogKGNsYXNzZXMpID0+IHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZHVyaW5nID0gY2xhc3NlcztcbiAgICB9LFxuICAgIFwiZW50ZXItc3RhcnRcIjogKGNsYXNzZXMpID0+IHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuc3RhcnQgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJlbnRlci1lbmRcIjogKGNsYXNzZXMpID0+IHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZW5kID0gY2xhc3NlcztcbiAgICB9LFxuICAgIFwibGVhdmVcIjogKGNsYXNzZXMpID0+IHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24ubGVhdmUuZHVyaW5nID0gY2xhc3NlcztcbiAgICB9LFxuICAgIFwibGVhdmUtc3RhcnRcIjogKGNsYXNzZXMpID0+IHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24ubGVhdmUuc3RhcnQgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJsZWF2ZS1lbmRcIjogKGNsYXNzZXMpID0+IHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24ubGVhdmUuZW5kID0gY2xhc3NlcztcbiAgICB9XG4gIH07XG4gIGRpcmVjdGl2ZVN0b3JhZ2VNYXBbc3RhZ2VdKGNsYXNzU3RyaW5nKTtcbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyVHJhbnNpdGlvbnNGcm9tSGVscGVyKGVsLCBtb2RpZmllcnMsIHN0YWdlKSB7XG4gIHJlZ2lzdGVyVHJhbnNpdGlvbk9iamVjdChlbCwgc2V0U3R5bGVzKTtcbiAgbGV0IGRvZXNudFNwZWNpZnkgPSAhbW9kaWZpZXJzLmluY2x1ZGVzKFwiaW5cIikgJiYgIW1vZGlmaWVycy5pbmNsdWRlcyhcIm91dFwiKSAmJiAhc3RhZ2U7XG4gIGxldCB0cmFuc2l0aW9uaW5nSW4gPSBkb2VzbnRTcGVjaWZ5IHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcImluXCIpIHx8IFtcImVudGVyXCJdLmluY2x1ZGVzKHN0YWdlKTtcbiAgbGV0IHRyYW5zaXRpb25pbmdPdXQgPSBkb2VzbnRTcGVjaWZ5IHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcIm91dFwiKSB8fCBbXCJsZWF2ZVwiXS5pbmNsdWRlcyhzdGFnZSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJpblwiKSAmJiAhZG9lc250U3BlY2lmeSkge1xuICAgIG1vZGlmaWVycyA9IG1vZGlmaWVycy5maWx0ZXIoKGksIGluZGV4KSA9PiBpbmRleCA8IG1vZGlmaWVycy5pbmRleE9mKFwib3V0XCIpKTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib3V0XCIpICYmICFkb2VzbnRTcGVjaWZ5KSB7XG4gICAgbW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigoaSwgaW5kZXgpID0+IGluZGV4ID4gbW9kaWZpZXJzLmluZGV4T2YoXCJvdXRcIikpO1xuICB9XG4gIGxldCB3YW50c0FsbCA9ICFtb2RpZmllcnMuaW5jbHVkZXMoXCJvcGFjaXR5XCIpICYmICFtb2RpZmllcnMuaW5jbHVkZXMoXCJzY2FsZVwiKTtcbiAgbGV0IHdhbnRzT3BhY2l0eSA9IHdhbnRzQWxsIHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcIm9wYWNpdHlcIik7XG4gIGxldCB3YW50c1NjYWxlID0gd2FudHNBbGwgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwic2NhbGVcIik7XG4gIGxldCBvcGFjaXR5VmFsdWUgPSB3YW50c09wYWNpdHkgPyAwIDogMTtcbiAgbGV0IHNjYWxlVmFsdWUgPSB3YW50c1NjYWxlID8gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIFwic2NhbGVcIiwgOTUpIC8gMTAwIDogMTtcbiAgbGV0IGRlbGF5ID0gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIFwiZGVsYXlcIiwgMCkgLyAxZTM7XG4gIGxldCBvcmlnaW4gPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJvcmlnaW5cIiwgXCJjZW50ZXJcIik7XG4gIGxldCBwcm9wZXJ0eSA9IFwib3BhY2l0eSwgdHJhbnNmb3JtXCI7XG4gIGxldCBkdXJhdGlvbkluID0gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIFwiZHVyYXRpb25cIiwgMTUwKSAvIDFlMztcbiAgbGV0IGR1cmF0aW9uT3V0ID0gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIFwiZHVyYXRpb25cIiwgNzUpIC8gMWUzO1xuICBsZXQgZWFzaW5nID0gYGN1YmljLWJlemllcigwLjQsIDAuMCwgMC4yLCAxKWA7XG4gIGlmICh0cmFuc2l0aW9uaW5nSW4pIHtcbiAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLmR1cmluZyA9IHtcbiAgICAgIHRyYW5zZm9ybU9yaWdpbjogb3JpZ2luLFxuICAgICAgdHJhbnNpdGlvbkRlbGF5OiBgJHtkZWxheX1zYCxcbiAgICAgIHRyYW5zaXRpb25Qcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICB0cmFuc2l0aW9uRHVyYXRpb246IGAke2R1cmF0aW9uSW59c2AsXG4gICAgICB0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb246IGVhc2luZ1xuICAgIH07XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5zdGFydCA9IHtcbiAgICAgIG9wYWNpdHk6IG9wYWNpdHlWYWx1ZSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKCR7c2NhbGVWYWx1ZX0pYFxuICAgIH07XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5lbmQgPSB7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoMSlgXG4gICAgfTtcbiAgfVxuICBpZiAodHJhbnNpdGlvbmluZ091dCkge1xuICAgIGVsLl94X3RyYW5zaXRpb24ubGVhdmUuZHVyaW5nID0ge1xuICAgICAgdHJhbnNmb3JtT3JpZ2luOiBvcmlnaW4sXG4gICAgICB0cmFuc2l0aW9uRGVsYXk6IGAke2RlbGF5fXNgLFxuICAgICAgdHJhbnNpdGlvblByb3BlcnR5OiBwcm9wZXJ0eSxcbiAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogYCR7ZHVyYXRpb25PdXR9c2AsXG4gICAgICB0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb246IGVhc2luZ1xuICAgIH07XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5zdGFydCA9IHtcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgxKWBcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24ubGVhdmUuZW5kID0ge1xuICAgICAgb3BhY2l0eTogb3BhY2l0eVZhbHVlLFxuICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoJHtzY2FsZVZhbHVlfSlgXG4gICAgfTtcbiAgfVxufVxuZnVuY3Rpb24gcmVnaXN0ZXJUcmFuc2l0aW9uT2JqZWN0KGVsLCBzZXRGdW5jdGlvbiwgZGVmYXVsdFZhbHVlID0ge30pIHtcbiAgaWYgKCFlbC5feF90cmFuc2l0aW9uKVxuICAgIGVsLl94X3RyYW5zaXRpb24gPSB7XG4gICAgICBlbnRlcjogeyBkdXJpbmc6IGRlZmF1bHRWYWx1ZSwgc3RhcnQ6IGRlZmF1bHRWYWx1ZSwgZW5kOiBkZWZhdWx0VmFsdWUgfSxcbiAgICAgIGxlYXZlOiB7IGR1cmluZzogZGVmYXVsdFZhbHVlLCBzdGFydDogZGVmYXVsdFZhbHVlLCBlbmQ6IGRlZmF1bHRWYWx1ZSB9LFxuICAgICAgaW4oYmVmb3JlID0gKCkgPT4ge1xuICAgICAgfSwgYWZ0ZXIgPSAoKSA9PiB7XG4gICAgICB9KSB7XG4gICAgICAgIHRyYW5zaXRpb24oZWwsIHNldEZ1bmN0aW9uLCB7XG4gICAgICAgICAgZHVyaW5nOiB0aGlzLmVudGVyLmR1cmluZyxcbiAgICAgICAgICBzdGFydDogdGhpcy5lbnRlci5zdGFydCxcbiAgICAgICAgICBlbmQ6IHRoaXMuZW50ZXIuZW5kXG4gICAgICAgIH0sIGJlZm9yZSwgYWZ0ZXIpO1xuICAgICAgfSxcbiAgICAgIG91dChiZWZvcmUgPSAoKSA9PiB7XG4gICAgICB9LCBhZnRlciA9ICgpID0+IHtcbiAgICAgIH0pIHtcbiAgICAgICAgdHJhbnNpdGlvbihlbCwgc2V0RnVuY3Rpb24sIHtcbiAgICAgICAgICBkdXJpbmc6IHRoaXMubGVhdmUuZHVyaW5nLFxuICAgICAgICAgIHN0YXJ0OiB0aGlzLmxlYXZlLnN0YXJ0LFxuICAgICAgICAgIGVuZDogdGhpcy5sZWF2ZS5lbmRcbiAgICAgICAgfSwgYmVmb3JlLCBhZnRlcik7XG4gICAgICB9XG4gICAgfTtcbn1cbndpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5feF90b2dnbGVBbmRDYXNjYWRlV2l0aFRyYW5zaXRpb25zID0gZnVuY3Rpb24oZWwsIHZhbHVlLCBzaG93LCBoaWRlKSB7XG4gIGNvbnN0IG5leHRUaWNrMiA9IGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gXCJ2aXNpYmxlXCIgPyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiBzZXRUaW1lb3V0O1xuICBsZXQgY2xpY2tBd2F5Q29tcGF0aWJsZVNob3cgPSAoKSA9PiBuZXh0VGljazIoc2hvdyk7XG4gIGlmICh2YWx1ZSkge1xuICAgIGlmIChlbC5feF90cmFuc2l0aW9uICYmIChlbC5feF90cmFuc2l0aW9uLmVudGVyIHx8IGVsLl94X3RyYW5zaXRpb24ubGVhdmUpKSB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyICYmIChPYmplY3QuZW50cmllcyhlbC5feF90cmFuc2l0aW9uLmVudGVyLmR1cmluZykubGVuZ3RoIHx8IE9iamVjdC5lbnRyaWVzKGVsLl94X3RyYW5zaXRpb24uZW50ZXIuc3RhcnQpLmxlbmd0aCB8fCBPYmplY3QuZW50cmllcyhlbC5feF90cmFuc2l0aW9uLmVudGVyLmVuZCkubGVuZ3RoKSA/IGVsLl94X3RyYW5zaXRpb24uaW4oc2hvdykgOiBjbGlja0F3YXlDb21wYXRpYmxlU2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uID8gZWwuX3hfdHJhbnNpdGlvbi5pbihzaG93KSA6IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBlbC5feF9oaWRlUHJvbWlzZSA9IGVsLl94X3RyYW5zaXRpb24gPyBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5vdXQoKCkgPT4ge1xuICAgIH0sICgpID0+IHJlc29sdmUoaGlkZSkpO1xuICAgIGVsLl94X3RyYW5zaXRpb25pbmcgJiYgZWwuX3hfdHJhbnNpdGlvbmluZy5iZWZvcmVDYW5jZWwoKCkgPT4gcmVqZWN0KHsgaXNGcm9tQ2FuY2VsbGVkVHJhbnNpdGlvbjogdHJ1ZSB9KSk7XG4gIH0pIDogUHJvbWlzZS5yZXNvbHZlKGhpZGUpO1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgbGV0IGNsb3Nlc3QgPSBjbG9zZXN0SGlkZShlbCk7XG4gICAgaWYgKGNsb3Nlc3QpIHtcbiAgICAgIGlmICghY2xvc2VzdC5feF9oaWRlQ2hpbGRyZW4pXG4gICAgICAgIGNsb3Nlc3QuX3hfaGlkZUNoaWxkcmVuID0gW107XG4gICAgICBjbG9zZXN0Ll94X2hpZGVDaGlsZHJlbi5wdXNoKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dFRpY2syKCgpID0+IHtcbiAgICAgICAgbGV0IGhpZGVBZnRlckNoaWxkcmVuID0gKGVsMikgPT4ge1xuICAgICAgICAgIGxldCBjYXJyeSA9IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIGVsMi5feF9oaWRlUHJvbWlzZSxcbiAgICAgICAgICAgIC4uLihlbDIuX3hfaGlkZUNoaWxkcmVuIHx8IFtdKS5tYXAoaGlkZUFmdGVyQ2hpbGRyZW4pXG4gICAgICAgICAgXSkudGhlbigoW2ldKSA9PiBpPy4oKSk7XG4gICAgICAgICAgZGVsZXRlIGVsMi5feF9oaWRlUHJvbWlzZTtcbiAgICAgICAgICBkZWxldGUgZWwyLl94X2hpZGVDaGlsZHJlbjtcbiAgICAgICAgICByZXR1cm4gY2Fycnk7XG4gICAgICAgIH07XG4gICAgICAgIGhpZGVBZnRlckNoaWxkcmVuKGVsKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIGlmICghZS5pc0Zyb21DYW5jZWxsZWRUcmFuc2l0aW9uKVxuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcbmZ1bmN0aW9uIGNsb3Nlc3RIaWRlKGVsKSB7XG4gIGxldCBwYXJlbnQgPSBlbC5wYXJlbnROb2RlO1xuICBpZiAoIXBhcmVudClcbiAgICByZXR1cm47XG4gIHJldHVybiBwYXJlbnQuX3hfaGlkZVByb21pc2UgPyBwYXJlbnQgOiBjbG9zZXN0SGlkZShwYXJlbnQpO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbihlbCwgc2V0RnVuY3Rpb24sIHsgZHVyaW5nLCBzdGFydDogc3RhcnQyLCBlbmQgfSA9IHt9LCBiZWZvcmUgPSAoKSA9PiB7XG59LCBhZnRlciA9ICgpID0+IHtcbn0pIHtcbiAgaWYgKGVsLl94X3RyYW5zaXRpb25pbmcpXG4gICAgZWwuX3hfdHJhbnNpdGlvbmluZy5jYW5jZWwoKTtcbiAgaWYgKE9iamVjdC5rZXlzKGR1cmluZykubGVuZ3RoID09PSAwICYmIE9iamVjdC5rZXlzKHN0YXJ0MikubGVuZ3RoID09PSAwICYmIE9iamVjdC5rZXlzKGVuZCkubGVuZ3RoID09PSAwKSB7XG4gICAgYmVmb3JlKCk7XG4gICAgYWZ0ZXIoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHVuZG9TdGFydCwgdW5kb0R1cmluZywgdW5kb0VuZDtcbiAgcGVyZm9ybVRyYW5zaXRpb24oZWwsIHtcbiAgICBzdGFydCgpIHtcbiAgICAgIHVuZG9TdGFydCA9IHNldEZ1bmN0aW9uKGVsLCBzdGFydDIpO1xuICAgIH0sXG4gICAgZHVyaW5nKCkge1xuICAgICAgdW5kb0R1cmluZyA9IHNldEZ1bmN0aW9uKGVsLCBkdXJpbmcpO1xuICAgIH0sXG4gICAgYmVmb3JlLFxuICAgIGVuZCgpIHtcbiAgICAgIHVuZG9TdGFydCgpO1xuICAgICAgdW5kb0VuZCA9IHNldEZ1bmN0aW9uKGVsLCBlbmQpO1xuICAgIH0sXG4gICAgYWZ0ZXIsXG4gICAgY2xlYW51cCgpIHtcbiAgICAgIHVuZG9EdXJpbmcoKTtcbiAgICAgIHVuZG9FbmQoKTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gcGVyZm9ybVRyYW5zaXRpb24oZWwsIHN0YWdlcykge1xuICBsZXQgaW50ZXJydXB0ZWQsIHJlYWNoZWRCZWZvcmUsIHJlYWNoZWRFbmQ7XG4gIGxldCBmaW5pc2ggPSBvbmNlKCgpID0+IHtcbiAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgaW50ZXJydXB0ZWQgPSB0cnVlO1xuICAgICAgaWYgKCFyZWFjaGVkQmVmb3JlKVxuICAgICAgICBzdGFnZXMuYmVmb3JlKCk7XG4gICAgICBpZiAoIXJlYWNoZWRFbmQpIHtcbiAgICAgICAgc3RhZ2VzLmVuZCgpO1xuICAgICAgICByZWxlYXNlTmV4dFRpY2tzKCk7XG4gICAgICB9XG4gICAgICBzdGFnZXMuYWZ0ZXIoKTtcbiAgICAgIGlmIChlbC5pc0Nvbm5lY3RlZClcbiAgICAgICAgc3RhZ2VzLmNsZWFudXAoKTtcbiAgICAgIGRlbGV0ZSBlbC5feF90cmFuc2l0aW9uaW5nO1xuICAgIH0pO1xuICB9KTtcbiAgZWwuX3hfdHJhbnNpdGlvbmluZyA9IHtcbiAgICBiZWZvcmVDYW5jZWxzOiBbXSxcbiAgICBiZWZvcmVDYW5jZWwoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuYmVmb3JlQ2FuY2Vscy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9LFxuICAgIGNhbmNlbDogb25jZShmdW5jdGlvbigpIHtcbiAgICAgIHdoaWxlICh0aGlzLmJlZm9yZUNhbmNlbHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYmVmb3JlQ2FuY2Vscy5zaGlmdCgpKCk7XG4gICAgICB9XG4gICAgICA7XG4gICAgICBmaW5pc2goKTtcbiAgICB9KSxcbiAgICBmaW5pc2hcbiAgfTtcbiAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICBzdGFnZXMuc3RhcnQoKTtcbiAgICBzdGFnZXMuZHVyaW5nKCk7XG4gIH0pO1xuICBob2xkTmV4dFRpY2tzKCk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgaWYgKGludGVycnVwdGVkKVxuICAgICAgcmV0dXJuO1xuICAgIGxldCBkdXJhdGlvbiA9IE51bWJlcihnZXRDb21wdXRlZFN0eWxlKGVsKS50cmFuc2l0aW9uRHVyYXRpb24ucmVwbGFjZSgvLC4qLywgXCJcIikucmVwbGFjZShcInNcIiwgXCJcIikpICogMWUzO1xuICAgIGxldCBkZWxheSA9IE51bWJlcihnZXRDb21wdXRlZFN0eWxlKGVsKS50cmFuc2l0aW9uRGVsYXkucmVwbGFjZSgvLC4qLywgXCJcIikucmVwbGFjZShcInNcIiwgXCJcIikpICogMWUzO1xuICAgIGlmIChkdXJhdGlvbiA9PT0gMClcbiAgICAgIGR1cmF0aW9uID0gTnVtYmVyKGdldENvbXB1dGVkU3R5bGUoZWwpLmFuaW1hdGlvbkR1cmF0aW9uLnJlcGxhY2UoXCJzXCIsIFwiXCIpKSAqIDFlMztcbiAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgc3RhZ2VzLmJlZm9yZSgpO1xuICAgIH0pO1xuICAgIHJlYWNoZWRCZWZvcmUgPSB0cnVlO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBpZiAoaW50ZXJydXB0ZWQpXG4gICAgICAgIHJldHVybjtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIHN0YWdlcy5lbmQoKTtcbiAgICAgIH0pO1xuICAgICAgcmVsZWFzZU5leHRUaWNrcygpO1xuICAgICAgc2V0VGltZW91dChlbC5feF90cmFuc2l0aW9uaW5nLmZpbmlzaCwgZHVyYXRpb24gKyBkZWxheSk7XG4gICAgICByZWFjaGVkRW5kID0gdHJ1ZTtcbiAgICB9KTtcbiAgfSk7XG59XG5mdW5jdGlvbiBtb2RpZmllclZhbHVlKG1vZGlmaWVycywga2V5LCBmYWxsYmFjaykge1xuICBpZiAobW9kaWZpZXJzLmluZGV4T2Yoa2V5KSA9PT0gLTEpXG4gICAgcmV0dXJuIGZhbGxiYWNrO1xuICBjb25zdCByYXdWYWx1ZSA9IG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihrZXkpICsgMV07XG4gIGlmICghcmF3VmFsdWUpXG4gICAgcmV0dXJuIGZhbGxiYWNrO1xuICBpZiAoa2V5ID09PSBcInNjYWxlXCIpIHtcbiAgICBpZiAoaXNOYU4ocmF3VmFsdWUpKVxuICAgICAgcmV0dXJuIGZhbGxiYWNrO1xuICB9XG4gIGlmIChrZXkgPT09IFwiZHVyYXRpb25cIiB8fCBrZXkgPT09IFwiZGVsYXlcIikge1xuICAgIGxldCBtYXRjaCA9IHJhd1ZhbHVlLm1hdGNoKC8oWzAtOV0rKW1zLyk7XG4gICAgaWYgKG1hdGNoKVxuICAgICAgcmV0dXJuIG1hdGNoWzFdO1xuICB9XG4gIGlmIChrZXkgPT09IFwib3JpZ2luXCIpIHtcbiAgICBpZiAoW1widG9wXCIsIFwicmlnaHRcIiwgXCJsZWZ0XCIsIFwiY2VudGVyXCIsIFwiYm90dG9tXCJdLmluY2x1ZGVzKG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihrZXkpICsgMl0pKSB7XG4gICAgICByZXR1cm4gW3Jhd1ZhbHVlLCBtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2Yoa2V5KSArIDJdXS5qb2luKFwiIFwiKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJhd1ZhbHVlO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvY2xvbmUuanNcbnZhciBpc0Nsb25pbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIHNraXBEdXJpbmdDbG9uZShjYWxsYmFjaywgZmFsbGJhY2sgPSAoKSA9PiB7XG59KSB7XG4gIHJldHVybiAoLi4uYXJncykgPT4gaXNDbG9uaW5nID8gZmFsbGJhY2soLi4uYXJncykgOiBjYWxsYmFjayguLi5hcmdzKTtcbn1cbmZ1bmN0aW9uIG9ubHlEdXJpbmdDbG9uZShjYWxsYmFjaykge1xuICByZXR1cm4gKC4uLmFyZ3MpID0+IGlzQ2xvbmluZyAmJiBjYWxsYmFjayguLi5hcmdzKTtcbn1cbnZhciBpbnRlcmNlcHRvcnMgPSBbXTtcbmZ1bmN0aW9uIGludGVyY2VwdENsb25lKGNhbGxiYWNrKSB7XG4gIGludGVyY2VwdG9ycy5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGNsb25lTm9kZShmcm9tLCB0bykge1xuICBpbnRlcmNlcHRvcnMuZm9yRWFjaCgoaSkgPT4gaShmcm9tLCB0bykpO1xuICBpc0Nsb25pbmcgPSB0cnVlO1xuICBkb250UmVnaXN0ZXJSZWFjdGl2ZVNpZGVFZmZlY3RzKCgpID0+IHtcbiAgICBpbml0VHJlZSh0bywgKGVsLCBjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZWwsICgpID0+IHtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgaXNDbG9uaW5nID0gZmFsc2U7XG59XG52YXIgaXNDbG9uaW5nTGVnYWN5ID0gZmFsc2U7XG5mdW5jdGlvbiBjbG9uZShvbGRFbCwgbmV3RWwpIHtcbiAgaWYgKCFuZXdFbC5feF9kYXRhU3RhY2spXG4gICAgbmV3RWwuX3hfZGF0YVN0YWNrID0gb2xkRWwuX3hfZGF0YVN0YWNrO1xuICBpc0Nsb25pbmcgPSB0cnVlO1xuICBpc0Nsb25pbmdMZWdhY3kgPSB0cnVlO1xuICBkb250UmVnaXN0ZXJSZWFjdGl2ZVNpZGVFZmZlY3RzKCgpID0+IHtcbiAgICBjbG9uZVRyZWUobmV3RWwpO1xuICB9KTtcbiAgaXNDbG9uaW5nID0gZmFsc2U7XG4gIGlzQ2xvbmluZ0xlZ2FjeSA9IGZhbHNlO1xufVxuZnVuY3Rpb24gY2xvbmVUcmVlKGVsKSB7XG4gIGxldCBoYXNSdW5UaHJvdWdoRmlyc3RFbCA9IGZhbHNlO1xuICBsZXQgc2hhbGxvd1dhbGtlciA9IChlbDIsIGNhbGxiYWNrKSA9PiB7XG4gICAgd2FsayhlbDIsIChlbDMsIHNraXApID0+IHtcbiAgICAgIGlmIChoYXNSdW5UaHJvdWdoRmlyc3RFbCAmJiBpc1Jvb3QoZWwzKSlcbiAgICAgICAgcmV0dXJuIHNraXAoKTtcbiAgICAgIGhhc1J1blRocm91Z2hGaXJzdEVsID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrKGVsMywgc2tpcCk7XG4gICAgfSk7XG4gIH07XG4gIGluaXRUcmVlKGVsLCBzaGFsbG93V2Fsa2VyKTtcbn1cbmZ1bmN0aW9uIGRvbnRSZWdpc3RlclJlYWN0aXZlU2lkZUVmZmVjdHMoY2FsbGJhY2spIHtcbiAgbGV0IGNhY2hlID0gZWZmZWN0O1xuICBvdmVycmlkZUVmZmVjdCgoY2FsbGJhY2syLCBlbCkgPT4ge1xuICAgIGxldCBzdG9yZWRFZmZlY3QgPSBjYWNoZShjYWxsYmFjazIpO1xuICAgIHJlbGVhc2Uoc3RvcmVkRWZmZWN0KTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgIH07XG4gIH0pO1xuICBjYWxsYmFjaygpO1xuICBvdmVycmlkZUVmZmVjdChjYWNoZSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9iaW5kLmpzXG5mdW5jdGlvbiBiaW5kKGVsLCBuYW1lLCB2YWx1ZSwgbW9kaWZpZXJzID0gW10pIHtcbiAgaWYgKCFlbC5feF9iaW5kaW5ncylcbiAgICBlbC5feF9iaW5kaW5ncyA9IHJlYWN0aXZlKHt9KTtcbiAgZWwuX3hfYmluZGluZ3NbbmFtZV0gPSB2YWx1ZTtcbiAgbmFtZSA9IG1vZGlmaWVycy5pbmNsdWRlcyhcImNhbWVsXCIpID8gY2FtZWxDYXNlKG5hbWUpIDogbmFtZTtcbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSBcInZhbHVlXCI6XG4gICAgICBiaW5kSW5wdXRWYWx1ZShlbCwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInN0eWxlXCI6XG4gICAgICBiaW5kU3R5bGVzKGVsLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiY2xhc3NcIjpcbiAgICAgIGJpbmRDbGFzc2VzKGVsLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic2VsZWN0ZWRcIjpcbiAgICBjYXNlIFwiY2hlY2tlZFwiOlxuICAgICAgYmluZEF0dHJpYnV0ZUFuZFByb3BlcnR5KGVsLCBuYW1lLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYmluZEF0dHJpYnV0ZShlbCwgbmFtZSwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cbmZ1bmN0aW9uIGJpbmRJbnB1dFZhbHVlKGVsLCB2YWx1ZSkge1xuICBpZiAoaXNSYWRpbyhlbCkpIHtcbiAgICBpZiAoZWwuYXR0cmlidXRlcy52YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBlbC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAod2luZG93LmZyb21Nb2RlbCkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9IHNhZmVQYXJzZUJvb2xlYW4oZWwudmFsdWUpID09PSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmNoZWNrZWQgPSBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZShlbC52YWx1ZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChpc0NoZWNrYm94KGVsKSkge1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgZWwudmFsdWUgPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUgIT09IFwiYm9vbGVhblwiICYmICFbbnVsbCwgdm9pZCAwXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIGVsLnZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIGVsLmNoZWNrZWQgPSB2YWx1ZS5zb21lKCh2YWwpID0+IGNoZWNrZWRBdHRyTG9vc2VDb21wYXJlKHZhbCwgZWwudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmNoZWNrZWQgPSAhIXZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChlbC50YWdOYW1lID09PSBcIlNFTEVDVFwiKSB7XG4gICAgdXBkYXRlU2VsZWN0KGVsLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGVsLnZhbHVlID09PSB2YWx1ZSlcbiAgICAgIHJldHVybjtcbiAgICBlbC52YWx1ZSA9IHZhbHVlID09PSB2b2lkIDAgPyBcIlwiIDogdmFsdWU7XG4gIH1cbn1cbmZ1bmN0aW9uIGJpbmRDbGFzc2VzKGVsLCB2YWx1ZSkge1xuICBpZiAoZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcylcbiAgICBlbC5feF91bmRvQWRkZWRDbGFzc2VzKCk7XG4gIGVsLl94X3VuZG9BZGRlZENsYXNzZXMgPSBzZXRDbGFzc2VzKGVsLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBiaW5kU3R5bGVzKGVsLCB2YWx1ZSkge1xuICBpZiAoZWwuX3hfdW5kb0FkZGVkU3R5bGVzKVxuICAgIGVsLl94X3VuZG9BZGRlZFN0eWxlcygpO1xuICBlbC5feF91bmRvQWRkZWRTdHlsZXMgPSBzZXRTdHlsZXMoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGJpbmRBdHRyaWJ1dGVBbmRQcm9wZXJ0eShlbCwgbmFtZSwgdmFsdWUpIHtcbiAgYmluZEF0dHJpYnV0ZShlbCwgbmFtZSwgdmFsdWUpO1xuICBzZXRQcm9wZXJ0eUlmQ2hhbmdlZChlbCwgbmFtZSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gYmluZEF0dHJpYnV0ZShlbCwgbmFtZSwgdmFsdWUpIHtcbiAgaWYgKFtudWxsLCB2b2lkIDAsIGZhbHNlXS5pbmNsdWRlcyh2YWx1ZSkgJiYgYXR0cmlidXRlU2hvdWxkbnRCZVByZXNlcnZlZElmRmFsc3kobmFtZSkpIHtcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzQm9vbGVhbkF0dHIobmFtZSkpXG4gICAgICB2YWx1ZSA9IG5hbWU7XG4gICAgc2V0SWZDaGFuZ2VkKGVsLCBuYW1lLCB2YWx1ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHNldElmQ2hhbmdlZChlbCwgYXR0ck5hbWUsIHZhbHVlKSB7XG4gIGlmIChlbC5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpICE9IHZhbHVlKSB7XG4gICAgZWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCB2YWx1ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHNldFByb3BlcnR5SWZDaGFuZ2VkKGVsLCBwcm9wTmFtZSwgdmFsdWUpIHtcbiAgaWYgKGVsW3Byb3BOYW1lXSAhPT0gdmFsdWUpIHtcbiAgICBlbFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgfVxufVxuZnVuY3Rpb24gdXBkYXRlU2VsZWN0KGVsLCB2YWx1ZSkge1xuICBjb25zdCBhcnJheVdyYXBwZWRWYWx1ZSA9IFtdLmNvbmNhdCh2YWx1ZSkubWFwKCh2YWx1ZTIpID0+IHtcbiAgICByZXR1cm4gdmFsdWUyICsgXCJcIjtcbiAgfSk7XG4gIEFycmF5LmZyb20oZWwub3B0aW9ucykuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgb3B0aW9uLnNlbGVjdGVkID0gYXJyYXlXcmFwcGVkVmFsdWUuaW5jbHVkZXMob3B0aW9uLnZhbHVlKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBjYW1lbENhc2Uoc3ViamVjdCkge1xuICByZXR1cm4gc3ViamVjdC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLy0oXFx3KS9nLCAobWF0Y2gsIGNoYXIpID0+IGNoYXIudG9VcHBlckNhc2UoKSk7XG59XG5mdW5jdGlvbiBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZSh2YWx1ZUEsIHZhbHVlQikge1xuICByZXR1cm4gdmFsdWVBID09IHZhbHVlQjtcbn1cbmZ1bmN0aW9uIHNhZmVQYXJzZUJvb2xlYW4ocmF3VmFsdWUpIHtcbiAgaWYgKFsxLCBcIjFcIiwgXCJ0cnVlXCIsIFwib25cIiwgXCJ5ZXNcIiwgdHJ1ZV0uaW5jbHVkZXMocmF3VmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKFswLCBcIjBcIiwgXCJmYWxzZVwiLCBcIm9mZlwiLCBcIm5vXCIsIGZhbHNlXS5pbmNsdWRlcyhyYXdWYWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHJhd1ZhbHVlID8gQm9vbGVhbihyYXdWYWx1ZSkgOiBudWxsO1xufVxudmFyIGJvb2xlYW5BdHRyaWJ1dGVzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1xuICBcImFsbG93ZnVsbHNjcmVlblwiLFxuICBcImFzeW5jXCIsXG4gIFwiYXV0b2ZvY3VzXCIsXG4gIFwiYXV0b3BsYXlcIixcbiAgXCJjaGVja2VkXCIsXG4gIFwiY29udHJvbHNcIixcbiAgXCJkZWZhdWx0XCIsXG4gIFwiZGVmZXJcIixcbiAgXCJkaXNhYmxlZFwiLFxuICBcImZvcm1ub3ZhbGlkYXRlXCIsXG4gIFwiaW5lcnRcIixcbiAgXCJpc21hcFwiLFxuICBcIml0ZW1zY29wZVwiLFxuICBcImxvb3BcIixcbiAgXCJtdWx0aXBsZVwiLFxuICBcIm11dGVkXCIsXG4gIFwibm9tb2R1bGVcIixcbiAgXCJub3ZhbGlkYXRlXCIsXG4gIFwib3BlblwiLFxuICBcInBsYXlzaW5saW5lXCIsXG4gIFwicmVhZG9ubHlcIixcbiAgXCJyZXF1aXJlZFwiLFxuICBcInJldmVyc2VkXCIsXG4gIFwic2VsZWN0ZWRcIixcbiAgXCJzaGFkb3dyb290Y2xvbmFibGVcIixcbiAgXCJzaGFkb3dyb290ZGVsZWdhdGVzZm9jdXNcIixcbiAgXCJzaGFkb3dyb290c2VyaWFsaXphYmxlXCJcbl0pO1xuZnVuY3Rpb24gaXNCb29sZWFuQXR0cihhdHRyTmFtZSkge1xuICByZXR1cm4gYm9vbGVhbkF0dHJpYnV0ZXMuaGFzKGF0dHJOYW1lKTtcbn1cbmZ1bmN0aW9uIGF0dHJpYnV0ZVNob3VsZG50QmVQcmVzZXJ2ZWRJZkZhbHN5KG5hbWUpIHtcbiAgcmV0dXJuICFbXCJhcmlhLXByZXNzZWRcIiwgXCJhcmlhLWNoZWNrZWRcIiwgXCJhcmlhLWV4cGFuZGVkXCIsIFwiYXJpYS1zZWxlY3RlZFwiXS5pbmNsdWRlcyhuYW1lKTtcbn1cbmZ1bmN0aW9uIGdldEJpbmRpbmcoZWwsIG5hbWUsIGZhbGxiYWNrKSB7XG4gIGlmIChlbC5feF9iaW5kaW5ncyAmJiBlbC5feF9iaW5kaW5nc1tuYW1lXSAhPT0gdm9pZCAwKVxuICAgIHJldHVybiBlbC5feF9iaW5kaW5nc1tuYW1lXTtcbiAgcmV0dXJuIGdldEF0dHJpYnV0ZUJpbmRpbmcoZWwsIG5hbWUsIGZhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGV4dHJhY3RQcm9wKGVsLCBuYW1lLCBmYWxsYmFjaywgZXh0cmFjdCA9IHRydWUpIHtcbiAgaWYgKGVsLl94X2JpbmRpbmdzICYmIGVsLl94X2JpbmRpbmdzW25hbWVdICE9PSB2b2lkIDApXG4gICAgcmV0dXJuIGVsLl94X2JpbmRpbmdzW25hbWVdO1xuICBpZiAoZWwuX3hfaW5saW5lQmluZGluZ3MgJiYgZWwuX3hfaW5saW5lQmluZGluZ3NbbmFtZV0gIT09IHZvaWQgMCkge1xuICAgIGxldCBiaW5kaW5nID0gZWwuX3hfaW5saW5lQmluZGluZ3NbbmFtZV07XG4gICAgYmluZGluZy5leHRyYWN0ID0gZXh0cmFjdDtcbiAgICByZXR1cm4gZG9udEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucygoKSA9PiB7XG4gICAgICByZXR1cm4gZXZhbHVhdGUoZWwsIGJpbmRpbmcuZXhwcmVzc2lvbik7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGdldEF0dHJpYnV0ZUJpbmRpbmcoZWwsIG5hbWUsIGZhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGdldEF0dHJpYnV0ZUJpbmRpbmcoZWwsIG5hbWUsIGZhbGxiYWNrKSB7XG4gIGxldCBhdHRyID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICBpZiAoYXR0ciA9PT0gbnVsbClcbiAgICByZXR1cm4gdHlwZW9mIGZhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgPyBmYWxsYmFjaygpIDogZmFsbGJhY2s7XG4gIGlmIChhdHRyID09PSBcIlwiKVxuICAgIHJldHVybiB0cnVlO1xuICBpZiAoaXNCb29sZWFuQXR0cihuYW1lKSkge1xuICAgIHJldHVybiAhIVtuYW1lLCBcInRydWVcIl0uaW5jbHVkZXMoYXR0cik7XG4gIH1cbiAgcmV0dXJuIGF0dHI7XG59XG5mdW5jdGlvbiBpc0NoZWNrYm94KGVsKSB7XG4gIHJldHVybiBlbC50eXBlID09PSBcImNoZWNrYm94XCIgfHwgZWwubG9jYWxOYW1lID09PSBcInVpLWNoZWNrYm94XCIgfHwgZWwubG9jYWxOYW1lID09PSBcInVpLXN3aXRjaFwiO1xufVxuZnVuY3Rpb24gaXNSYWRpbyhlbCkge1xuICByZXR1cm4gZWwudHlwZSA9PT0gXCJyYWRpb1wiIHx8IGVsLmxvY2FsTmFtZSA9PT0gXCJ1aS1yYWRpb1wiO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvZGVib3VuY2UuanNcbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQpIHtcbiAgdmFyIHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICB9O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvdGhyb3R0bGUuanNcbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIGxpbWl0KSB7XG4gIGxldCBpblRocm90dGxlO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgIGlmICghaW5UaHJvdHRsZSkge1xuICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGluVGhyb3R0bGUgPSB0cnVlO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBpblRocm90dGxlID0gZmFsc2UsIGxpbWl0KTtcbiAgICB9XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9lbnRhbmdsZS5qc1xuZnVuY3Rpb24gZW50YW5nbGUoeyBnZXQ6IG91dGVyR2V0LCBzZXQ6IG91dGVyU2V0IH0sIHsgZ2V0OiBpbm5lckdldCwgc2V0OiBpbm5lclNldCB9KSB7XG4gIGxldCBmaXJzdFJ1biA9IHRydWU7XG4gIGxldCBvdXRlckhhc2g7XG4gIGxldCBpbm5lckhhc2g7XG4gIGxldCByZWZlcmVuY2UgPSBlZmZlY3QoKCkgPT4ge1xuICAgIGxldCBvdXRlciA9IG91dGVyR2V0KCk7XG4gICAgbGV0IGlubmVyID0gaW5uZXJHZXQoKTtcbiAgICBpZiAoZmlyc3RSdW4pIHtcbiAgICAgIGlubmVyU2V0KGNsb25lSWZPYmplY3Qob3V0ZXIpKTtcbiAgICAgIGZpcnN0UnVuID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBvdXRlckhhc2hMYXRlc3QgPSBKU09OLnN0cmluZ2lmeShvdXRlcik7XG4gICAgICBsZXQgaW5uZXJIYXNoTGF0ZXN0ID0gSlNPTi5zdHJpbmdpZnkoaW5uZXIpO1xuICAgICAgaWYgKG91dGVySGFzaExhdGVzdCAhPT0gb3V0ZXJIYXNoKSB7XG4gICAgICAgIGlubmVyU2V0KGNsb25lSWZPYmplY3Qob3V0ZXIpKTtcbiAgICAgIH0gZWxzZSBpZiAob3V0ZXJIYXNoTGF0ZXN0ICE9PSBpbm5lckhhc2hMYXRlc3QpIHtcbiAgICAgICAgb3V0ZXJTZXQoY2xvbmVJZk9iamVjdChpbm5lcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgIH1cbiAgICB9XG4gICAgb3V0ZXJIYXNoID0gSlNPTi5zdHJpbmdpZnkob3V0ZXJHZXQoKSk7XG4gICAgaW5uZXJIYXNoID0gSlNPTi5zdHJpbmdpZnkoaW5uZXJHZXQoKSk7XG4gIH0pO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHJlbGVhc2UocmVmZXJlbmNlKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNsb25lSWZPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiA/IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKSA6IHZhbHVlO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvcGx1Z2luLmpzXG5mdW5jdGlvbiBwbHVnaW4oY2FsbGJhY2spIHtcbiAgbGV0IGNhbGxiYWNrcyA9IEFycmF5LmlzQXJyYXkoY2FsbGJhY2spID8gY2FsbGJhY2sgOiBbY2FsbGJhY2tdO1xuICBjYWxsYmFja3MuZm9yRWFjaCgoaSkgPT4gaShhbHBpbmVfZGVmYXVsdCkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvc3RvcmUuanNcbnZhciBzdG9yZXMgPSB7fTtcbnZhciBpc1JlYWN0aXZlID0gZmFsc2U7XG5mdW5jdGlvbiBzdG9yZShuYW1lLCB2YWx1ZSkge1xuICBpZiAoIWlzUmVhY3RpdmUpIHtcbiAgICBzdG9yZXMgPSByZWFjdGl2ZShzdG9yZXMpO1xuICAgIGlzUmVhY3RpdmUgPSB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIHN0b3Jlc1tuYW1lXTtcbiAgfVxuICBzdG9yZXNbbmFtZV0gPSB2YWx1ZTtcbiAgaW5pdEludGVyY2VwdG9ycyhzdG9yZXNbbmFtZV0pO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLmhhc093blByb3BlcnR5KFwiaW5pdFwiKSAmJiB0eXBlb2YgdmFsdWUuaW5pdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgc3RvcmVzW25hbWVdLmluaXQoKTtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0U3RvcmVzKCkge1xuICByZXR1cm4gc3RvcmVzO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvYmluZHMuanNcbnZhciBiaW5kcyA9IHt9O1xuZnVuY3Rpb24gYmluZDIobmFtZSwgYmluZGluZ3MpIHtcbiAgbGV0IGdldEJpbmRpbmdzID0gdHlwZW9mIGJpbmRpbmdzICE9PSBcImZ1bmN0aW9uXCIgPyAoKSA9PiBiaW5kaW5ncyA6IGJpbmRpbmdzO1xuICBpZiAobmFtZSBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICByZXR1cm4gYXBwbHlCaW5kaW5nc09iamVjdChuYW1lLCBnZXRCaW5kaW5ncygpKTtcbiAgfSBlbHNlIHtcbiAgICBiaW5kc1tuYW1lXSA9IGdldEJpbmRpbmdzO1xuICB9XG4gIHJldHVybiAoKSA9PiB7XG4gIH07XG59XG5mdW5jdGlvbiBpbmplY3RCaW5kaW5nUHJvdmlkZXJzKG9iaikge1xuICBPYmplY3QuZW50cmllcyhiaW5kcykuZm9yRWFjaCgoW25hbWUsIGNhbGxiYWNrXSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cbmZ1bmN0aW9uIGFwcGx5QmluZGluZ3NPYmplY3QoZWwsIG9iaiwgb3JpZ2luYWwpIHtcbiAgbGV0IGNsZWFudXBSdW5uZXJzID0gW107XG4gIHdoaWxlIChjbGVhbnVwUnVubmVycy5sZW5ndGgpXG4gICAgY2xlYW51cFJ1bm5lcnMucG9wKCkoKTtcbiAgbGV0IGF0dHJpYnV0ZXMgPSBPYmplY3QuZW50cmllcyhvYmopLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4gKHsgbmFtZSwgdmFsdWUgfSkpO1xuICBsZXQgc3RhdGljQXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNPbmx5KGF0dHJpYnV0ZXMpO1xuICBhdHRyaWJ1dGVzID0gYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgIGlmIChzdGF0aWNBdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+IGF0dHIubmFtZSA9PT0gYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBgeC1iaW5kOiR7YXR0cmlidXRlLm5hbWV9YCxcbiAgICAgICAgdmFsdWU6IGBcIiR7YXR0cmlidXRlLnZhbHVlfVwiYFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJpYnV0ZTtcbiAgfSk7XG4gIGRpcmVjdGl2ZXMoZWwsIGF0dHJpYnV0ZXMsIG9yaWdpbmFsKS5tYXAoKGhhbmRsZSkgPT4ge1xuICAgIGNsZWFudXBSdW5uZXJzLnB1c2goaGFuZGxlLnJ1bkNsZWFudXBzKTtcbiAgICBoYW5kbGUoKTtcbiAgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgd2hpbGUgKGNsZWFudXBSdW5uZXJzLmxlbmd0aClcbiAgICAgIGNsZWFudXBSdW5uZXJzLnBvcCgpKCk7XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kYXRhcy5qc1xudmFyIGRhdGFzID0ge307XG5mdW5jdGlvbiBkYXRhKG5hbWUsIGNhbGxiYWNrKSB7XG4gIGRhdGFzW25hbWVdID0gY2FsbGJhY2s7XG59XG5mdW5jdGlvbiBpbmplY3REYXRhUHJvdmlkZXJzKG9iaiwgY29udGV4dCkge1xuICBPYmplY3QuZW50cmllcyhkYXRhcykuZm9yRWFjaCgoW25hbWUsIGNhbGxiYWNrXSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmJpbmQoY29udGV4dCkoLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9hbHBpbmUuanNcbnZhciBBbHBpbmUgPSB7XG4gIGdldCByZWFjdGl2ZSgpIHtcbiAgICByZXR1cm4gcmVhY3RpdmU7XG4gIH0sXG4gIGdldCByZWxlYXNlKCkge1xuICAgIHJldHVybiByZWxlYXNlO1xuICB9LFxuICBnZXQgZWZmZWN0KCkge1xuICAgIHJldHVybiBlZmZlY3Q7XG4gIH0sXG4gIGdldCByYXcoKSB7XG4gICAgcmV0dXJuIHJhdztcbiAgfSxcbiAgdmVyc2lvbjogXCIzLjE0LjhcIixcbiAgZmx1c2hBbmRTdG9wRGVmZXJyaW5nTXV0YXRpb25zLFxuICBkb250QXV0b0V2YWx1YXRlRnVuY3Rpb25zLFxuICBkaXNhYmxlRWZmZWN0U2NoZWR1bGluZyxcbiAgc3RhcnRPYnNlcnZpbmdNdXRhdGlvbnMsXG4gIHN0b3BPYnNlcnZpbmdNdXRhdGlvbnMsXG4gIHNldFJlYWN0aXZpdHlFbmdpbmUsXG4gIG9uQXR0cmlidXRlUmVtb3ZlZCxcbiAgb25BdHRyaWJ1dGVzQWRkZWQsXG4gIGNsb3Nlc3REYXRhU3RhY2ssXG4gIHNraXBEdXJpbmdDbG9uZSxcbiAgb25seUR1cmluZ0Nsb25lLFxuICBhZGRSb290U2VsZWN0b3IsXG4gIGFkZEluaXRTZWxlY3RvcixcbiAgaW50ZXJjZXB0Q2xvbmUsXG4gIGFkZFNjb3BlVG9Ob2RlLFxuICBkZWZlck11dGF0aW9ucyxcbiAgbWFwQXR0cmlidXRlcyxcbiAgZXZhbHVhdGVMYXRlcixcbiAgaW50ZXJjZXB0SW5pdCxcbiAgc2V0RXZhbHVhdG9yLFxuICBtZXJnZVByb3hpZXMsXG4gIGV4dHJhY3RQcm9wLFxuICBmaW5kQ2xvc2VzdCxcbiAgb25FbFJlbW92ZWQsXG4gIGNsb3Nlc3RSb290LFxuICBkZXN0cm95VHJlZSxcbiAgaW50ZXJjZXB0b3IsXG4gIC8vIElOVEVSTkFMOiBub3QgcHVibGljIEFQSSBhbmQgaXMgc3ViamVjdCB0byBjaGFuZ2Ugd2l0aG91dCBtYWpvciByZWxlYXNlLlxuICB0cmFuc2l0aW9uLFxuICAvLyBJTlRFUk5BTFxuICBzZXRTdHlsZXMsXG4gIC8vIElOVEVSTkFMXG4gIG11dGF0ZURvbSxcbiAgZGlyZWN0aXZlLFxuICBlbnRhbmdsZSxcbiAgdGhyb3R0bGUsXG4gIGRlYm91bmNlLFxuICBldmFsdWF0ZSxcbiAgaW5pdFRyZWUsXG4gIG5leHRUaWNrLFxuICBwcmVmaXhlZDogcHJlZml4LFxuICBwcmVmaXg6IHNldFByZWZpeCxcbiAgcGx1Z2luLFxuICBtYWdpYyxcbiAgc3RvcmUsXG4gIHN0YXJ0LFxuICBjbG9uZSxcbiAgLy8gSU5URVJOQUxcbiAgY2xvbmVOb2RlLFxuICAvLyBJTlRFUk5BTFxuICBib3VuZDogZ2V0QmluZGluZyxcbiAgJGRhdGE6IHNjb3BlLFxuICB3YXRjaCxcbiAgd2FsayxcbiAgZGF0YSxcbiAgYmluZDogYmluZDJcbn07XG52YXIgYWxwaW5lX2RlZmF1bHQgPSBBbHBpbmU7XG5cbi8vIG5vZGVfbW9kdWxlcy9AdnVlL3NoYXJlZC9kaXN0L3NoYXJlZC5lc20tYnVuZGxlci5qc1xuZnVuY3Rpb24gbWFrZU1hcChzdHIsIGV4cGVjdHNMb3dlckNhc2UpIHtcbiAgY29uc3QgbWFwID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGNvbnN0IGxpc3QgPSBzdHIuc3BsaXQoXCIsXCIpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBtYXBbbGlzdFtpXV0gPSB0cnVlO1xuICB9XG4gIHJldHVybiBleHBlY3RzTG93ZXJDYXNlID8gKHZhbCkgPT4gISFtYXBbdmFsLnRvTG93ZXJDYXNlKCldIDogKHZhbCkgPT4gISFtYXBbdmFsXTtcbn1cbnZhciBzcGVjaWFsQm9vbGVhbkF0dHJzID0gYGl0ZW1zY29wZSxhbGxvd2Z1bGxzY3JlZW4sZm9ybW5vdmFsaWRhdGUsaXNtYXAsbm9tb2R1bGUsbm92YWxpZGF0ZSxyZWFkb25seWA7XG52YXIgaXNCb29sZWFuQXR0cjIgPSAvKiBAX19QVVJFX18gKi8gbWFrZU1hcChzcGVjaWFsQm9vbGVhbkF0dHJzICsgYCxhc3luYyxhdXRvZm9jdXMsYXV0b3BsYXksY29udHJvbHMsZGVmYXVsdCxkZWZlcixkaXNhYmxlZCxoaWRkZW4sbG9vcCxvcGVuLHJlcXVpcmVkLHJldmVyc2VkLHNjb3BlZCxzZWFtbGVzcyxjaGVja2VkLG11dGVkLG11bHRpcGxlLHNlbGVjdGVkYCk7XG52YXIgRU1QVFlfT0JKID0gdHJ1ZSA/IE9iamVjdC5mcmVlemUoe30pIDoge307XG52YXIgRU1QVFlfQVJSID0gdHJ1ZSA/IE9iamVjdC5mcmVlemUoW10pIDogW107XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIGhhc093biA9ICh2YWwsIGtleSkgPT4gaGFzT3duUHJvcGVydHkuY2FsbCh2YWwsIGtleSk7XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG52YXIgaXNNYXAgPSAodmFsKSA9PiB0b1R5cGVTdHJpbmcodmFsKSA9PT0gXCJbb2JqZWN0IE1hcF1cIjtcbnZhciBpc1N0cmluZyA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCI7XG52YXIgaXNTeW1ib2wgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcInN5bWJvbFwiO1xudmFyIGlzT2JqZWN0ID0gKHZhbCkgPT4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCI7XG52YXIgb2JqZWN0VG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHRvVHlwZVN0cmluZyA9ICh2YWx1ZSkgPT4gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG52YXIgdG9SYXdUeXBlID0gKHZhbHVlKSA9PiB7XG4gIHJldHVybiB0b1R5cGVTdHJpbmcodmFsdWUpLnNsaWNlKDgsIC0xKTtcbn07XG52YXIgaXNJbnRlZ2VyS2V5ID0gKGtleSkgPT4gaXNTdHJpbmcoa2V5KSAmJiBrZXkgIT09IFwiTmFOXCIgJiYga2V5WzBdICE9PSBcIi1cIiAmJiBcIlwiICsgcGFyc2VJbnQoa2V5LCAxMCkgPT09IGtleTtcbnZhciBjYWNoZVN0cmluZ0Z1bmN0aW9uID0gKGZuKSA9PiB7XG4gIGNvbnN0IGNhY2hlID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiAoc3RyKSA9PiB7XG4gICAgY29uc3QgaGl0ID0gY2FjaGVbc3RyXTtcbiAgICByZXR1cm4gaGl0IHx8IChjYWNoZVtzdHJdID0gZm4oc3RyKSk7XG4gIH07XG59O1xudmFyIGNhbWVsaXplUkUgPSAvLShcXHcpL2c7XG52YXIgY2FtZWxpemUgPSBjYWNoZVN0cmluZ0Z1bmN0aW9uKChzdHIpID0+IHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGNhbWVsaXplUkUsIChfLCBjKSA9PiBjID8gYy50b1VwcGVyQ2FzZSgpIDogXCJcIik7XG59KTtcbnZhciBoeXBoZW5hdGVSRSA9IC9cXEIoW0EtWl0pL2c7XG52YXIgaHlwaGVuYXRlID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiBzdHIucmVwbGFjZShoeXBoZW5hdGVSRSwgXCItJDFcIikudG9Mb3dlckNhc2UoKSk7XG52YXIgY2FwaXRhbGl6ZSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpKTtcbnZhciB0b0hhbmRsZXJLZXkgPSBjYWNoZVN0cmluZ0Z1bmN0aW9uKChzdHIpID0+IHN0ciA/IGBvbiR7Y2FwaXRhbGl6ZShzdHIpfWAgOiBgYCk7XG52YXIgaGFzQ2hhbmdlZCA9ICh2YWx1ZSwgb2xkVmFsdWUpID0+IHZhbHVlICE9PSBvbGRWYWx1ZSAmJiAodmFsdWUgPT09IHZhbHVlIHx8IG9sZFZhbHVlID09PSBvbGRWYWx1ZSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9AdnVlL3JlYWN0aXZpdHkvZGlzdC9yZWFjdGl2aXR5LmVzbS1idW5kbGVyLmpzXG52YXIgdGFyZ2V0TWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZWZmZWN0U3RhY2sgPSBbXTtcbnZhciBhY3RpdmVFZmZlY3Q7XG52YXIgSVRFUkFURV9LRVkgPSBTeW1ib2wodHJ1ZSA/IFwiaXRlcmF0ZVwiIDogXCJcIik7XG52YXIgTUFQX0tFWV9JVEVSQVRFX0tFWSA9IFN5bWJvbCh0cnVlID8gXCJNYXAga2V5IGl0ZXJhdGVcIiA6IFwiXCIpO1xuZnVuY3Rpb24gaXNFZmZlY3QoZm4pIHtcbiAgcmV0dXJuIGZuICYmIGZuLl9pc0VmZmVjdCA9PT0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGVmZmVjdDIoZm4sIG9wdGlvbnMgPSBFTVBUWV9PQkopIHtcbiAgaWYgKGlzRWZmZWN0KGZuKSkge1xuICAgIGZuID0gZm4ucmF3O1xuICB9XG4gIGNvbnN0IGVmZmVjdDMgPSBjcmVhdGVSZWFjdGl2ZUVmZmVjdChmbiwgb3B0aW9ucyk7XG4gIGlmICghb3B0aW9ucy5sYXp5KSB7XG4gICAgZWZmZWN0MygpO1xuICB9XG4gIHJldHVybiBlZmZlY3QzO1xufVxuZnVuY3Rpb24gc3RvcChlZmZlY3QzKSB7XG4gIGlmIChlZmZlY3QzLmFjdGl2ZSkge1xuICAgIGNsZWFudXAoZWZmZWN0Myk7XG4gICAgaWYgKGVmZmVjdDMub3B0aW9ucy5vblN0b3ApIHtcbiAgICAgIGVmZmVjdDMub3B0aW9ucy5vblN0b3AoKTtcbiAgICB9XG4gICAgZWZmZWN0My5hY3RpdmUgPSBmYWxzZTtcbiAgfVxufVxudmFyIHVpZCA9IDA7XG5mdW5jdGlvbiBjcmVhdGVSZWFjdGl2ZUVmZmVjdChmbiwgb3B0aW9ucykge1xuICBjb25zdCBlZmZlY3QzID0gZnVuY3Rpb24gcmVhY3RpdmVFZmZlY3QoKSB7XG4gICAgaWYgKCFlZmZlY3QzLmFjdGl2ZSkge1xuICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfVxuICAgIGlmICghZWZmZWN0U3RhY2suaW5jbHVkZXMoZWZmZWN0MykpIHtcbiAgICAgIGNsZWFudXAoZWZmZWN0Myk7XG4gICAgICB0cnkge1xuICAgICAgICBlbmFibGVUcmFja2luZygpO1xuICAgICAgICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdDMpO1xuICAgICAgICBhY3RpdmVFZmZlY3QgPSBlZmZlY3QzO1xuICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgICAgICByZXNldFRyYWNraW5nKCk7XG4gICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgZWZmZWN0My5pZCA9IHVpZCsrO1xuICBlZmZlY3QzLmFsbG93UmVjdXJzZSA9ICEhb3B0aW9ucy5hbGxvd1JlY3Vyc2U7XG4gIGVmZmVjdDMuX2lzRWZmZWN0ID0gdHJ1ZTtcbiAgZWZmZWN0My5hY3RpdmUgPSB0cnVlO1xuICBlZmZlY3QzLnJhdyA9IGZuO1xuICBlZmZlY3QzLmRlcHMgPSBbXTtcbiAgZWZmZWN0My5vcHRpb25zID0gb3B0aW9ucztcbiAgcmV0dXJuIGVmZmVjdDM7XG59XG5mdW5jdGlvbiBjbGVhbnVwKGVmZmVjdDMpIHtcbiAgY29uc3QgeyBkZXBzIH0gPSBlZmZlY3QzO1xuICBpZiAoZGVwcy5sZW5ndGgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRlcHNbaV0uZGVsZXRlKGVmZmVjdDMpO1xuICAgIH1cbiAgICBkZXBzLmxlbmd0aCA9IDA7XG4gIH1cbn1cbnZhciBzaG91bGRUcmFjayA9IHRydWU7XG52YXIgdHJhY2tTdGFjayA9IFtdO1xuZnVuY3Rpb24gcGF1c2VUcmFja2luZygpIHtcbiAgdHJhY2tTdGFjay5wdXNoKHNob3VsZFRyYWNrKTtcbiAgc2hvdWxkVHJhY2sgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIGVuYWJsZVRyYWNraW5nKCkge1xuICB0cmFja1N0YWNrLnB1c2goc2hvdWxkVHJhY2spO1xuICBzaG91bGRUcmFjayA9IHRydWU7XG59XG5mdW5jdGlvbiByZXNldFRyYWNraW5nKCkge1xuICBjb25zdCBsYXN0ID0gdHJhY2tTdGFjay5wb3AoKTtcbiAgc2hvdWxkVHJhY2sgPSBsYXN0ID09PSB2b2lkIDAgPyB0cnVlIDogbGFzdDtcbn1cbmZ1bmN0aW9uIHRyYWNrKHRhcmdldCwgdHlwZSwga2V5KSB7XG4gIGlmICghc2hvdWxkVHJhY2sgfHwgYWN0aXZlRWZmZWN0ID09PSB2b2lkIDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGRlcHNNYXAgPSB0YXJnZXRNYXAuZ2V0KHRhcmdldCk7XG4gIGlmICghZGVwc01hcCkge1xuICAgIHRhcmdldE1hcC5zZXQodGFyZ2V0LCBkZXBzTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSk7XG4gIH1cbiAgbGV0IGRlcCA9IGRlcHNNYXAuZ2V0KGtleSk7XG4gIGlmICghZGVwKSB7XG4gICAgZGVwc01hcC5zZXQoa2V5LCBkZXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcbiAgfVxuICBpZiAoIWRlcC5oYXMoYWN0aXZlRWZmZWN0KSkge1xuICAgIGRlcC5hZGQoYWN0aXZlRWZmZWN0KTtcbiAgICBhY3RpdmVFZmZlY3QuZGVwcy5wdXNoKGRlcCk7XG4gICAgaWYgKGFjdGl2ZUVmZmVjdC5vcHRpb25zLm9uVHJhY2spIHtcbiAgICAgIGFjdGl2ZUVmZmVjdC5vcHRpb25zLm9uVHJhY2soe1xuICAgICAgICBlZmZlY3Q6IGFjdGl2ZUVmZmVjdCxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICB0eXBlLFxuICAgICAgICBrZXlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gdHJpZ2dlcih0YXJnZXQsIHR5cGUsIGtleSwgbmV3VmFsdWUsIG9sZFZhbHVlLCBvbGRUYXJnZXQpIHtcbiAgY29uc3QgZGVwc01hcCA9IHRhcmdldE1hcC5nZXQodGFyZ2V0KTtcbiAgaWYgKCFkZXBzTWFwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGVmZmVjdHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBjb25zdCBhZGQyID0gKGVmZmVjdHNUb0FkZCkgPT4ge1xuICAgIGlmIChlZmZlY3RzVG9BZGQpIHtcbiAgICAgIGVmZmVjdHNUb0FkZC5mb3JFYWNoKChlZmZlY3QzKSA9PiB7XG4gICAgICAgIGlmIChlZmZlY3QzICE9PSBhY3RpdmVFZmZlY3QgfHwgZWZmZWN0My5hbGxvd1JlY3Vyc2UpIHtcbiAgICAgICAgICBlZmZlY3RzLmFkZChlZmZlY3QzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBpZiAodHlwZSA9PT0gXCJjbGVhclwiKSB7XG4gICAgZGVwc01hcC5mb3JFYWNoKGFkZDIpO1xuICB9IGVsc2UgaWYgKGtleSA9PT0gXCJsZW5ndGhcIiAmJiBpc0FycmF5KHRhcmdldCkpIHtcbiAgICBkZXBzTWFwLmZvckVhY2goKGRlcCwga2V5MikgPT4ge1xuICAgICAgaWYgKGtleTIgPT09IFwibGVuZ3RoXCIgfHwga2V5MiA+PSBuZXdWYWx1ZSkge1xuICAgICAgICBhZGQyKGRlcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGtleSAhPT0gdm9pZCAwKSB7XG4gICAgICBhZGQyKGRlcHNNYXAuZ2V0KGtleSkpO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJhZGRcIjpcbiAgICAgICAgaWYgKCFpc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KElURVJBVEVfS0VZKSk7XG4gICAgICAgICAgaWYgKGlzTWFwKHRhcmdldCkpIHtcbiAgICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoTUFQX0tFWV9JVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpc0ludGVnZXJLZXkoa2V5KSkge1xuICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoXCJsZW5ndGhcIikpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRlbGV0ZVwiOlxuICAgICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICBpZiAoaXNNYXAodGFyZ2V0KSkge1xuICAgICAgICAgICAgYWRkMihkZXBzTWFwLmdldChNQVBfS0VZX0lURVJBVEVfS0VZKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInNldFwiOlxuICAgICAgICBpZiAoaXNNYXAodGFyZ2V0KSkge1xuICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoSVRFUkFURV9LRVkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgY29uc3QgcnVuID0gKGVmZmVjdDMpID0+IHtcbiAgICBpZiAoZWZmZWN0My5vcHRpb25zLm9uVHJpZ2dlcikge1xuICAgICAgZWZmZWN0My5vcHRpb25zLm9uVHJpZ2dlcih7XG4gICAgICAgIGVmZmVjdDogZWZmZWN0MyxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICBrZXksXG4gICAgICAgIHR5cGUsXG4gICAgICAgIG5ld1ZhbHVlLFxuICAgICAgICBvbGRWYWx1ZSxcbiAgICAgICAgb2xkVGFyZ2V0XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGVmZmVjdDMub3B0aW9ucy5zY2hlZHVsZXIpIHtcbiAgICAgIGVmZmVjdDMub3B0aW9ucy5zY2hlZHVsZXIoZWZmZWN0Myk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVmZmVjdDMoKTtcbiAgICB9XG4gIH07XG4gIGVmZmVjdHMuZm9yRWFjaChydW4pO1xufVxudmFyIGlzTm9uVHJhY2thYmxlS2V5cyA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKGBfX3Byb3RvX18sX192X2lzUmVmLF9faXNWdWVgKTtcbnZhciBidWlsdEluU3ltYm9scyA9IG5ldyBTZXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoU3ltYm9sKS5tYXAoKGtleSkgPT4gU3ltYm9sW2tleV0pLmZpbHRlcihpc1N5bWJvbCkpO1xudmFyIGdldDIgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlR2V0dGVyKCk7XG52YXIgcmVhZG9ubHlHZXQgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlR2V0dGVyKHRydWUpO1xudmFyIGFycmF5SW5zdHJ1bWVudGF0aW9ucyA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVBcnJheUluc3RydW1lbnRhdGlvbnMoKTtcbmZ1bmN0aW9uIGNyZWF0ZUFycmF5SW5zdHJ1bWVudGF0aW9ucygpIHtcbiAgY29uc3QgaW5zdHJ1bWVudGF0aW9ucyA9IHt9O1xuICBbXCJpbmNsdWRlc1wiLCBcImluZGV4T2ZcIiwgXCJsYXN0SW5kZXhPZlwiXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpbnN0cnVtZW50YXRpb25zW2tleV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICBjb25zdCBhcnIgPSB0b1Jhdyh0aGlzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdHJhY2soYXJyLCBcImdldFwiLCBpICsgXCJcIik7XG4gICAgICB9XG4gICAgICBjb25zdCByZXMgPSBhcnJba2V5XSguLi5hcmdzKTtcbiAgICAgIGlmIChyZXMgPT09IC0xIHx8IHJlcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGFycltrZXldKC4uLmFyZ3MubWFwKHRvUmF3KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuICBbXCJwdXNoXCIsIFwicG9wXCIsIFwic2hpZnRcIiwgXCJ1bnNoaWZ0XCIsIFwic3BsaWNlXCJdLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGluc3RydW1lbnRhdGlvbnNba2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgIHBhdXNlVHJhY2tpbmcoKTtcbiAgICAgIGNvbnN0IHJlcyA9IHRvUmF3KHRoaXMpW2tleV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICByZXNldFRyYWNraW5nKCk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH07XG4gIH0pO1xuICByZXR1cm4gaW5zdHJ1bWVudGF0aW9ucztcbn1cbmZ1bmN0aW9uIGNyZWF0ZUdldHRlcihpc1JlYWRvbmx5ID0gZmFsc2UsIHNoYWxsb3cgPSBmYWxzZSkge1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0Myh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWN0aXZlXCIpIHtcbiAgICAgIHJldHVybiAhaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFkb25seVwiKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfcmF3XCIgJiYgcmVjZWl2ZXIgPT09IChpc1JlYWRvbmx5ID8gc2hhbGxvdyA/IHNoYWxsb3dSZWFkb25seU1hcCA6IHJlYWRvbmx5TWFwIDogc2hhbGxvdyA/IHNoYWxsb3dSZWFjdGl2ZU1hcCA6IHJlYWN0aXZlTWFwKS5nZXQodGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0SXNBcnJheSA9IGlzQXJyYXkodGFyZ2V0KTtcbiAgICBpZiAoIWlzUmVhZG9ubHkgJiYgdGFyZ2V0SXNBcnJheSAmJiBoYXNPd24oYXJyYXlJbnN0cnVtZW50YXRpb25zLCBrZXkpKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5nZXQoYXJyYXlJbnN0cnVtZW50YXRpb25zLCBrZXksIHJlY2VpdmVyKTtcbiAgICB9XG4gICAgY29uc3QgcmVzID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKTtcbiAgICBpZiAoaXNTeW1ib2woa2V5KSA/IGJ1aWx0SW5TeW1ib2xzLmhhcyhrZXkpIDogaXNOb25UcmFja2FibGVLZXlzKGtleSkpIHtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGlmICghaXNSZWFkb25seSkge1xuICAgICAgdHJhY2sodGFyZ2V0LCBcImdldFwiLCBrZXkpO1xuICAgIH1cbiAgICBpZiAoc2hhbGxvdykge1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgaWYgKGlzUmVmKHJlcykpIHtcbiAgICAgIGNvbnN0IHNob3VsZFVud3JhcCA9ICF0YXJnZXRJc0FycmF5IHx8ICFpc0ludGVnZXJLZXkoa2V5KTtcbiAgICAgIHJldHVybiBzaG91bGRVbndyYXAgPyByZXMudmFsdWUgOiByZXM7XG4gICAgfVxuICAgIGlmIChpc09iamVjdChyZXMpKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seSA/IHJlYWRvbmx5KHJlcykgOiByZWFjdGl2ZTIocmVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfTtcbn1cbnZhciBzZXQyID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZVNldHRlcigpO1xuZnVuY3Rpb24gY3JlYXRlU2V0dGVyKHNoYWxsb3cgPSBmYWxzZSkge1xuICByZXR1cm4gZnVuY3Rpb24gc2V0Myh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgbGV0IG9sZFZhbHVlID0gdGFyZ2V0W2tleV07XG4gICAgaWYgKCFzaGFsbG93KSB7XG4gICAgICB2YWx1ZSA9IHRvUmF3KHZhbHVlKTtcbiAgICAgIG9sZFZhbHVlID0gdG9SYXcob2xkVmFsdWUpO1xuICAgICAgaWYgKCFpc0FycmF5KHRhcmdldCkgJiYgaXNSZWYob2xkVmFsdWUpICYmICFpc1JlZih2YWx1ZSkpIHtcbiAgICAgICAgb2xkVmFsdWUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGhhZEtleSA9IGlzQXJyYXkodGFyZ2V0KSAmJiBpc0ludGVnZXJLZXkoa2V5KSA/IE51bWJlcihrZXkpIDwgdGFyZ2V0Lmxlbmd0aCA6IGhhc093bih0YXJnZXQsIGtleSk7XG4gICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcik7XG4gICAgaWYgKHRhcmdldCA9PT0gdG9SYXcocmVjZWl2ZXIpKSB7XG4gICAgICBpZiAoIWhhZEtleSkge1xuICAgICAgICB0cmlnZ2VyKHRhcmdldCwgXCJhZGRcIiwga2V5LCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGhhc0NoYW5nZWQodmFsdWUsIG9sZFZhbHVlKSkge1xuICAgICAgICB0cmlnZ2VyKHRhcmdldCwgXCJzZXRcIiwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuZnVuY3Rpb24gZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcbiAgY29uc3QgaGFkS2V5ID0gaGFzT3duKHRhcmdldCwga2V5KTtcbiAgY29uc3Qgb2xkVmFsdWUgPSB0YXJnZXRba2V5XTtcbiAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSk7XG4gIGlmIChyZXN1bHQgJiYgaGFkS2V5KSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiZGVsZXRlXCIsIGtleSwgdm9pZCAwLCBvbGRWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGhhcyh0YXJnZXQsIGtleSkge1xuICBjb25zdCByZXN1bHQgPSBSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSk7XG4gIGlmICghaXNTeW1ib2woa2V5KSB8fCAhYnVpbHRJblN5bWJvbHMuaGFzKGtleSkpIHtcbiAgICB0cmFjayh0YXJnZXQsIFwiaGFzXCIsIGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG93bktleXModGFyZ2V0KSB7XG4gIHRyYWNrKHRhcmdldCwgXCJpdGVyYXRlXCIsIGlzQXJyYXkodGFyZ2V0KSA/IFwibGVuZ3RoXCIgOiBJVEVSQVRFX0tFWSk7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcbn1cbnZhciBtdXRhYmxlSGFuZGxlcnMgPSB7XG4gIGdldDogZ2V0MixcbiAgc2V0OiBzZXQyLFxuICBkZWxldGVQcm9wZXJ0eSxcbiAgaGFzLFxuICBvd25LZXlzXG59O1xudmFyIHJlYWRvbmx5SGFuZGxlcnMgPSB7XG4gIGdldDogcmVhZG9ubHlHZXQsXG4gIHNldCh0YXJnZXQsIGtleSkge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFNldCBvcGVyYXRpb24gb24ga2V5IFwiJHtTdHJpbmcoa2V5KX1cIiBmYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLCB0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcbiAgICBpZiAodHJ1ZSkge1xuICAgICAgY29uc29sZS53YXJuKGBEZWxldGUgb3BlcmF0aW9uIG9uIGtleSBcIiR7U3RyaW5nKGtleSl9XCIgZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCwgdGFyZ2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG52YXIgdG9SZWFjdGl2ZSA9ICh2YWx1ZSkgPT4gaXNPYmplY3QodmFsdWUpID8gcmVhY3RpdmUyKHZhbHVlKSA6IHZhbHVlO1xudmFyIHRvUmVhZG9ubHkgPSAodmFsdWUpID0+IGlzT2JqZWN0KHZhbHVlKSA/IHJlYWRvbmx5KHZhbHVlKSA6IHZhbHVlO1xudmFyIHRvU2hhbGxvdyA9ICh2YWx1ZSkgPT4gdmFsdWU7XG52YXIgZ2V0UHJvdG8gPSAodikgPT4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZih2KTtcbmZ1bmN0aW9uIGdldCQxKHRhcmdldCwga2V5LCBpc1JlYWRvbmx5ID0gZmFsc2UsIGlzU2hhbGxvdyA9IGZhbHNlKSB7XG4gIHRhcmdldCA9IHRhcmdldFtcbiAgICBcIl9fdl9yYXdcIlxuICAgIC8qIFJBVyAqL1xuICBdO1xuICBjb25zdCByYXdUYXJnZXQgPSB0b1Jhdyh0YXJnZXQpO1xuICBjb25zdCByYXdLZXkgPSB0b1JhdyhrZXkpO1xuICBpZiAoa2V5ICE9PSByYXdLZXkpIHtcbiAgICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiZ2V0XCIsIGtleSk7XG4gIH1cbiAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcImdldFwiLCByYXdLZXkpO1xuICBjb25zdCB7IGhhczogaGFzMiB9ID0gZ2V0UHJvdG8ocmF3VGFyZ2V0KTtcbiAgY29uc3Qgd3JhcCA9IGlzU2hhbGxvdyA/IHRvU2hhbGxvdyA6IGlzUmVhZG9ubHkgPyB0b1JlYWRvbmx5IDogdG9SZWFjdGl2ZTtcbiAgaWYgKGhhczIuY2FsbChyYXdUYXJnZXQsIGtleSkpIHtcbiAgICByZXR1cm4gd3JhcCh0YXJnZXQuZ2V0KGtleSkpO1xuICB9IGVsc2UgaWYgKGhhczIuY2FsbChyYXdUYXJnZXQsIHJhd0tleSkpIHtcbiAgICByZXR1cm4gd3JhcCh0YXJnZXQuZ2V0KHJhd0tleSkpO1xuICB9IGVsc2UgaWYgKHRhcmdldCAhPT0gcmF3VGFyZ2V0KSB7XG4gICAgdGFyZ2V0LmdldChrZXkpO1xuICB9XG59XG5mdW5jdGlvbiBoYXMkMShrZXksIGlzUmVhZG9ubHkgPSBmYWxzZSkge1xuICBjb25zdCB0YXJnZXQgPSB0aGlzW1xuICAgIFwiX192X3Jhd1wiXG4gICAgLyogUkFXICovXG4gIF07XG4gIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XG4gIGlmIChrZXkgIT09IHJhd0tleSkge1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJoYXNcIiwga2V5KTtcbiAgfVxuICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiaGFzXCIsIHJhd0tleSk7XG4gIHJldHVybiBrZXkgPT09IHJhd0tleSA/IHRhcmdldC5oYXMoa2V5KSA6IHRhcmdldC5oYXMoa2V5KSB8fCB0YXJnZXQuaGFzKHJhd0tleSk7XG59XG5mdW5jdGlvbiBzaXplKHRhcmdldCwgaXNSZWFkb25seSA9IGZhbHNlKSB7XG4gIHRhcmdldCA9IHRhcmdldFtcbiAgICBcIl9fdl9yYXdcIlxuICAgIC8qIFJBVyAqL1xuICBdO1xuICAhaXNSZWFkb25seSAmJiB0cmFjayh0b1Jhdyh0YXJnZXQpLCBcIml0ZXJhdGVcIiwgSVRFUkFURV9LRVkpO1xuICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBcInNpemVcIiwgdGFyZ2V0KTtcbn1cbmZ1bmN0aW9uIGFkZCh2YWx1ZSkge1xuICB2YWx1ZSA9IHRvUmF3KHZhbHVlKTtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IHByb3RvID0gZ2V0UHJvdG8odGFyZ2V0KTtcbiAgY29uc3QgaGFkS2V5ID0gcHJvdG8uaGFzLmNhbGwodGFyZ2V0LCB2YWx1ZSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAgdGFyZ2V0LmFkZCh2YWx1ZSk7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIsIHZhbHVlLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBzZXQkMShrZXksIHZhbHVlKSB7XG4gIHZhbHVlID0gdG9SYXcodmFsdWUpO1xuICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcbiAgY29uc3QgeyBoYXM6IGhhczIsIGdldDogZ2V0MyB9ID0gZ2V0UHJvdG8odGFyZ2V0KTtcbiAgbGV0IGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAga2V5ID0gdG9SYXcoa2V5KTtcbiAgICBoYWRLZXkgPSBoYXMyLmNhbGwodGFyZ2V0LCBrZXkpO1xuICB9IGVsc2UgaWYgKHRydWUpIHtcbiAgICBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhczIsIGtleSk7XG4gIH1cbiAgY29uc3Qgb2xkVmFsdWUgPSBnZXQzLmNhbGwodGFyZ2V0LCBrZXkpO1xuICB0YXJnZXQuc2V0KGtleSwgdmFsdWUpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImFkZFwiLCBrZXksIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChoYXNDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSkpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJzZXRcIiwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuZnVuY3Rpb24gZGVsZXRlRW50cnkoa2V5KSB7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCB7IGhhczogaGFzMiwgZ2V0OiBnZXQzIH0gPSBnZXRQcm90byh0YXJnZXQpO1xuICBsZXQgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICBrZXkgPSB0b1JhdyhrZXkpO1xuICAgIGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIH0gZWxzZSBpZiAodHJ1ZSkge1xuICAgIGNoZWNrSWRlbnRpdHlLZXlzKHRhcmdldCwgaGFzMiwga2V5KTtcbiAgfVxuICBjb25zdCBvbGRWYWx1ZSA9IGdldDMgPyBnZXQzLmNhbGwodGFyZ2V0LCBrZXkpIDogdm9pZCAwO1xuICBjb25zdCByZXN1bHQgPSB0YXJnZXQuZGVsZXRlKGtleSk7XG4gIGlmIChoYWRLZXkpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJkZWxldGVcIiwga2V5LCB2b2lkIDAsIG9sZFZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gY2xlYXIoKSB7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCBoYWRJdGVtcyA9IHRhcmdldC5zaXplICE9PSAwO1xuICBjb25zdCBvbGRUYXJnZXQgPSB0cnVlID8gaXNNYXAodGFyZ2V0KSA/IG5ldyBNYXAodGFyZ2V0KSA6IG5ldyBTZXQodGFyZ2V0KSA6IHZvaWQgMDtcbiAgY29uc3QgcmVzdWx0ID0gdGFyZ2V0LmNsZWFyKCk7XG4gIGlmIChoYWRJdGVtcykge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImNsZWFyXCIsIHZvaWQgMCwgdm9pZCAwLCBvbGRUYXJnZXQpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBjcmVhdGVGb3JFYWNoKGlzUmVhZG9ubHksIGlzU2hhbGxvdykge1xuICByZXR1cm4gZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGNvbnN0IG9ic2VydmVkID0gdGhpcztcbiAgICBjb25zdCB0YXJnZXQgPSBvYnNlcnZlZFtcbiAgICAgIFwiX192X3Jhd1wiXG4gICAgICAvKiBSQVcgKi9cbiAgICBdO1xuICAgIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gICAgY29uc3Qgd3JhcCA9IGlzU2hhbGxvdyA/IHRvU2hhbGxvdyA6IGlzUmVhZG9ubHkgPyB0b1JlYWRvbmx5IDogdG9SZWFjdGl2ZTtcbiAgICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiaXRlcmF0ZVwiLCBJVEVSQVRFX0tFWSk7XG4gICAgcmV0dXJuIHRhcmdldC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICByZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB3cmFwKHZhbHVlKSwgd3JhcChrZXkpLCBvYnNlcnZlZCk7XG4gICAgfSk7XG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIGlzUmVhZG9ubHksIGlzU2hhbGxvdykge1xuICByZXR1cm4gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXNbXG4gICAgICBcIl9fdl9yYXdcIlxuICAgICAgLyogUkFXICovXG4gICAgXTtcbiAgICBjb25zdCByYXdUYXJnZXQgPSB0b1Jhdyh0YXJnZXQpO1xuICAgIGNvbnN0IHRhcmdldElzTWFwID0gaXNNYXAocmF3VGFyZ2V0KTtcbiAgICBjb25zdCBpc1BhaXIgPSBtZXRob2QgPT09IFwiZW50cmllc1wiIHx8IG1ldGhvZCA9PT0gU3ltYm9sLml0ZXJhdG9yICYmIHRhcmdldElzTWFwO1xuICAgIGNvbnN0IGlzS2V5T25seSA9IG1ldGhvZCA9PT0gXCJrZXlzXCIgJiYgdGFyZ2V0SXNNYXA7XG4gICAgY29uc3QgaW5uZXJJdGVyYXRvciA9IHRhcmdldFttZXRob2RdKC4uLmFyZ3MpO1xuICAgIGNvbnN0IHdyYXAgPSBpc1NoYWxsb3cgPyB0b1NoYWxsb3cgOiBpc1JlYWRvbmx5ID8gdG9SZWFkb25seSA6IHRvUmVhY3RpdmU7XG4gICAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcIml0ZXJhdGVcIiwgaXNLZXlPbmx5ID8gTUFQX0tFWV9JVEVSQVRFX0tFWSA6IElURVJBVEVfS0VZKTtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gaXRlcmF0b3IgcHJvdG9jb2xcbiAgICAgIG5leHQoKSB7XG4gICAgICAgIGNvbnN0IHsgdmFsdWUsIGRvbmUgfSA9IGlubmVySXRlcmF0b3IubmV4dCgpO1xuICAgICAgICByZXR1cm4gZG9uZSA/IHsgdmFsdWUsIGRvbmUgfSA6IHtcbiAgICAgICAgICB2YWx1ZTogaXNQYWlyID8gW3dyYXAodmFsdWVbMF0pLCB3cmFwKHZhbHVlWzFdKV0gOiB3cmFwKHZhbHVlKSxcbiAgICAgICAgICBkb25lXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgLy8gaXRlcmFibGUgcHJvdG9jb2xcbiAgICAgIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlUmVhZG9ubHlNZXRob2QodHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBjb25zdCBrZXkgPSBhcmdzWzBdID8gYG9uIGtleSBcIiR7YXJnc1swXX1cIiBgIDogYGA7XG4gICAgICBjb25zb2xlLndhcm4oYCR7Y2FwaXRhbGl6ZSh0eXBlKX0gb3BlcmF0aW9uICR7a2V5fWZhaWxlZDogdGFyZ2V0IGlzIHJlYWRvbmx5LmAsIHRvUmF3KHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGUgPT09IFwiZGVsZXRlXCIgPyBmYWxzZSA6IHRoaXM7XG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVJbnN0cnVtZW50YXRpb25zKCkge1xuICBjb25zdCBtdXRhYmxlSW5zdHJ1bWVudGF0aW9uczIgPSB7XG4gICAgZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSk7XG4gICAgfSxcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiBzaXplKHRoaXMpO1xuICAgIH0sXG4gICAgaGFzOiBoYXMkMSxcbiAgICBhZGQsXG4gICAgc2V0OiBzZXQkMSxcbiAgICBkZWxldGU6IGRlbGV0ZUVudHJ5LFxuICAgIGNsZWFyLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2goZmFsc2UsIGZhbHNlKVxuICB9O1xuICBjb25zdCBzaGFsbG93SW5zdHJ1bWVudGF0aW9uczIgPSB7XG4gICAgZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSwgZmFsc2UsIHRydWUpO1xuICAgIH0sXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gc2l6ZSh0aGlzKTtcbiAgICB9LFxuICAgIGhhczogaGFzJDEsXG4gICAgYWRkLFxuICAgIHNldDogc2V0JDEsXG4gICAgZGVsZXRlOiBkZWxldGVFbnRyeSxcbiAgICBjbGVhcixcbiAgICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKGZhbHNlLCB0cnVlKVxuICB9O1xuICBjb25zdCByZWFkb25seUluc3RydW1lbnRhdGlvbnMyID0ge1xuICAgIGdldChrZXkpIHtcbiAgICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXksIHRydWUpO1xuICAgIH0sXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gc2l6ZSh0aGlzLCB0cnVlKTtcbiAgICB9LFxuICAgIGhhcyhrZXkpIHtcbiAgICAgIHJldHVybiBoYXMkMS5jYWxsKHRoaXMsIGtleSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBhZGQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJhZGRcIlxuICAgICAgLyogQUREICovXG4gICAgKSxcbiAgICBzZXQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJzZXRcIlxuICAgICAgLyogU0VUICovXG4gICAgKSxcbiAgICBkZWxldGU6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJkZWxldGVcIlxuICAgICAgLyogREVMRVRFICovXG4gICAgKSxcbiAgICBjbGVhcjogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImNsZWFyXCJcbiAgICAgIC8qIENMRUFSICovXG4gICAgKSxcbiAgICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKHRydWUsIGZhbHNlKVxuICB9O1xuICBjb25zdCBzaGFsbG93UmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMiA9IHtcbiAgICBnZXQoa2V5KSB7XG4gICAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5LCB0cnVlLCB0cnVlKTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHNpemUodGhpcywgdHJ1ZSk7XG4gICAgfSxcbiAgICBoYXMoa2V5KSB7XG4gICAgICByZXR1cm4gaGFzJDEuY2FsbCh0aGlzLCBrZXksIHRydWUpO1xuICAgIH0sXG4gICAgYWRkOiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwiYWRkXCJcbiAgICAgIC8qIEFERCAqL1xuICAgICksXG4gICAgc2V0OiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwic2V0XCJcbiAgICAgIC8qIFNFVCAqL1xuICAgICksXG4gICAgZGVsZXRlOiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwiZGVsZXRlXCJcbiAgICAgIC8qIERFTEVURSAqL1xuICAgICksXG4gICAgY2xlYXI6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJjbGVhclwiXG4gICAgICAvKiBDTEVBUiAqL1xuICAgICksXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaCh0cnVlLCB0cnVlKVxuICB9O1xuICBjb25zdCBpdGVyYXRvck1ldGhvZHMgPSBbXCJrZXlzXCIsIFwidmFsdWVzXCIsIFwiZW50cmllc1wiLCBTeW1ib2wuaXRlcmF0b3JdO1xuICBpdGVyYXRvck1ldGhvZHMuZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgbXV0YWJsZUluc3RydW1lbnRhdGlvbnMyW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIGZhbHNlLCBmYWxzZSk7XG4gICAgcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMlttZXRob2RdID0gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCB0cnVlLCBmYWxzZSk7XG4gICAgc2hhbGxvd0luc3RydW1lbnRhdGlvbnMyW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIGZhbHNlLCB0cnVlKTtcbiAgICBzaGFsbG93UmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMlttZXRob2RdID0gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCB0cnVlLCB0cnVlKTtcbiAgfSk7XG4gIHJldHVybiBbXG4gICAgbXV0YWJsZUluc3RydW1lbnRhdGlvbnMyLFxuICAgIHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczIsXG4gICAgc2hhbGxvd0luc3RydW1lbnRhdGlvbnMyLFxuICAgIHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMyXG4gIF07XG59XG52YXIgW211dGFibGVJbnN0cnVtZW50YXRpb25zLCByZWFkb25seUluc3RydW1lbnRhdGlvbnMsIHNoYWxsb3dJbnN0cnVtZW50YXRpb25zLCBzaGFsbG93UmVhZG9ubHlJbnN0cnVtZW50YXRpb25zXSA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVJbnN0cnVtZW50YXRpb25zKCk7XG5mdW5jdGlvbiBjcmVhdGVJbnN0cnVtZW50YXRpb25HZXR0ZXIoaXNSZWFkb25seSwgc2hhbGxvdykge1xuICBjb25zdCBpbnN0cnVtZW50YXRpb25zID0gc2hhbGxvdyA/IGlzUmVhZG9ubHkgPyBzaGFsbG93UmVhZG9ubHlJbnN0cnVtZW50YXRpb25zIDogc2hhbGxvd0luc3RydW1lbnRhdGlvbnMgOiBpc1JlYWRvbmx5ID8gcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zIDogbXV0YWJsZUluc3RydW1lbnRhdGlvbnM7XG4gIHJldHVybiAodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSA9PiB7XG4gICAgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFjdGl2ZVwiKSB7XG4gICAgICByZXR1cm4gIWlzUmVhZG9ubHk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09IFwiX192X2lzUmVhZG9ubHlcIikge1xuICAgICAgcmV0dXJuIGlzUmVhZG9ubHk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09IFwiX192X3Jhd1wiKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICByZXR1cm4gUmVmbGVjdC5nZXQoaGFzT3duKGluc3RydW1lbnRhdGlvbnMsIGtleSkgJiYga2V5IGluIHRhcmdldCA/IGluc3RydW1lbnRhdGlvbnMgOiB0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICB9O1xufVxudmFyIG11dGFibGVDb2xsZWN0aW9uSGFuZGxlcnMgPSB7XG4gIGdldDogLyogQF9fUFVSRV9fICovIGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcihmYWxzZSwgZmFsc2UpXG59O1xudmFyIHJlYWRvbmx5Q29sbGVjdGlvbkhhbmRsZXJzID0ge1xuICBnZXQ6IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVJbnN0cnVtZW50YXRpb25HZXR0ZXIodHJ1ZSwgZmFsc2UpXG59O1xuZnVuY3Rpb24gY2hlY2tJZGVudGl0eUtleXModGFyZ2V0LCBoYXMyLCBrZXkpIHtcbiAgY29uc3QgcmF3S2V5ID0gdG9SYXcoa2V5KTtcbiAgaWYgKHJhd0tleSAhPT0ga2V5ICYmIGhhczIuY2FsbCh0YXJnZXQsIHJhd0tleSkpIHtcbiAgICBjb25zdCB0eXBlID0gdG9SYXdUeXBlKHRhcmdldCk7XG4gICAgY29uc29sZS53YXJuKGBSZWFjdGl2ZSAke3R5cGV9IGNvbnRhaW5zIGJvdGggdGhlIHJhdyBhbmQgcmVhY3RpdmUgdmVyc2lvbnMgb2YgdGhlIHNhbWUgb2JqZWN0JHt0eXBlID09PSBgTWFwYCA/IGAgYXMga2V5c2AgOiBgYH0sIHdoaWNoIGNhbiBsZWFkIHRvIGluY29uc2lzdGVuY2llcy4gQXZvaWQgZGlmZmVyZW50aWF0aW5nIGJldHdlZW4gdGhlIHJhdyBhbmQgcmVhY3RpdmUgdmVyc2lvbnMgb2YgYW4gb2JqZWN0IGFuZCBvbmx5IHVzZSB0aGUgcmVhY3RpdmUgdmVyc2lvbiBpZiBwb3NzaWJsZS5gKTtcbiAgfVxufVxudmFyIHJlYWN0aXZlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgc2hhbGxvd1JlYWN0aXZlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgcmVhZG9ubHlNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzaGFsbG93UmVhZG9ubHlNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIHRhcmdldFR5cGVNYXAocmF3VHlwZSkge1xuICBzd2l0Y2ggKHJhd1R5cGUpIHtcbiAgICBjYXNlIFwiT2JqZWN0XCI6XG4gICAgY2FzZSBcIkFycmF5XCI6XG4gICAgICByZXR1cm4gMTtcbiAgICBjYXNlIFwiTWFwXCI6XG4gICAgY2FzZSBcIlNldFwiOlxuICAgIGNhc2UgXCJXZWFrTWFwXCI6XG4gICAgY2FzZSBcIldlYWtTZXRcIjpcbiAgICAgIHJldHVybiAyO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gMDtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0VGFyZ2V0VHlwZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWVbXG4gICAgXCJfX3Zfc2tpcFwiXG4gICAgLyogU0tJUCAqL1xuICBdIHx8ICFPYmplY3QuaXNFeHRlbnNpYmxlKHZhbHVlKSA/IDAgOiB0YXJnZXRUeXBlTWFwKHRvUmF3VHlwZSh2YWx1ZSkpO1xufVxuZnVuY3Rpb24gcmVhY3RpdmUyKHRhcmdldCkge1xuICBpZiAodGFyZ2V0ICYmIHRhcmdldFtcbiAgICBcIl9fdl9pc1JlYWRvbmx5XCJcbiAgICAvKiBJU19SRUFET05MWSAqL1xuICBdKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCBmYWxzZSwgbXV0YWJsZUhhbmRsZXJzLCBtdXRhYmxlQ29sbGVjdGlvbkhhbmRsZXJzLCByZWFjdGl2ZU1hcCk7XG59XG5mdW5jdGlvbiByZWFkb25seSh0YXJnZXQpIHtcbiAgcmV0dXJuIGNyZWF0ZVJlYWN0aXZlT2JqZWN0KHRhcmdldCwgdHJ1ZSwgcmVhZG9ubHlIYW5kbGVycywgcmVhZG9ubHlDb2xsZWN0aW9uSGFuZGxlcnMsIHJlYWRvbmx5TWFwKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJlYWN0aXZlT2JqZWN0KHRhcmdldCwgaXNSZWFkb25seSwgYmFzZUhhbmRsZXJzLCBjb2xsZWN0aW9uSGFuZGxlcnMsIHByb3h5TWFwKSB7XG4gIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYHZhbHVlIGNhbm5vdCBiZSBtYWRlIHJlYWN0aXZlOiAke1N0cmluZyh0YXJnZXQpfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIGlmICh0YXJnZXRbXG4gICAgXCJfX3ZfcmF3XCJcbiAgICAvKiBSQVcgKi9cbiAgXSAmJiAhKGlzUmVhZG9ubHkgJiYgdGFyZ2V0W1xuICAgIFwiX192X2lzUmVhY3RpdmVcIlxuICAgIC8qIElTX1JFQUNUSVZFICovXG4gIF0pKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICBjb25zdCBleGlzdGluZ1Byb3h5ID0gcHJveHlNYXAuZ2V0KHRhcmdldCk7XG4gIGlmIChleGlzdGluZ1Byb3h5KSB7XG4gICAgcmV0dXJuIGV4aXN0aW5nUHJveHk7XG4gIH1cbiAgY29uc3QgdGFyZ2V0VHlwZSA9IGdldFRhcmdldFR5cGUodGFyZ2V0KTtcbiAgaWYgKHRhcmdldFR5cGUgPT09IDApIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIGNvbnN0IHByb3h5ID0gbmV3IFByb3h5KHRhcmdldCwgdGFyZ2V0VHlwZSA9PT0gMiA/IGNvbGxlY3Rpb25IYW5kbGVycyA6IGJhc2VIYW5kbGVycyk7XG4gIHByb3h5TWFwLnNldCh0YXJnZXQsIHByb3h5KTtcbiAgcmV0dXJuIHByb3h5O1xufVxuZnVuY3Rpb24gdG9SYXcob2JzZXJ2ZWQpIHtcbiAgcmV0dXJuIG9ic2VydmVkICYmIHRvUmF3KG9ic2VydmVkW1xuICAgIFwiX192X3Jhd1wiXG4gICAgLyogUkFXICovXG4gIF0pIHx8IG9ic2VydmVkO1xufVxuZnVuY3Rpb24gaXNSZWYocikge1xuICByZXR1cm4gQm9vbGVhbihyICYmIHIuX192X2lzUmVmID09PSB0cnVlKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kbmV4dFRpY2suanNcbm1hZ2ljKFwibmV4dFRpY2tcIiwgKCkgPT4gbmV4dFRpY2spO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRkaXNwYXRjaC5qc1xubWFnaWMoXCJkaXNwYXRjaFwiLCAoZWwpID0+IGRpc3BhdGNoLmJpbmQoZGlzcGF0Y2gsIGVsKSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJHdhdGNoLmpzXG5tYWdpYyhcIndhdGNoXCIsIChlbCwgeyBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyMiwgY2xlYW51cDogY2xlYW51cDIgfSkgPT4gKGtleSwgY2FsbGJhY2spID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIyKGtleSk7XG4gIGxldCBnZXR0ZXIgPSAoKSA9PiB7XG4gICAgbGV0IHZhbHVlO1xuICAgIGV2YWx1YXRlMigoaSkgPT4gdmFsdWUgPSBpKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG4gIGxldCB1bndhdGNoID0gd2F0Y2goZ2V0dGVyLCBjYWxsYmFjayk7XG4gIGNsZWFudXAyKHVud2F0Y2gpO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJHN0b3JlLmpzXG5tYWdpYyhcInN0b3JlXCIsIGdldFN0b3Jlcyk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGRhdGEuanNcbm1hZ2ljKFwiZGF0YVwiLCAoZWwpID0+IHNjb3BlKGVsKSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJHJvb3QuanNcbm1hZ2ljKFwicm9vdFwiLCAoZWwpID0+IGNsb3Nlc3RSb290KGVsKSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJHJlZnMuanNcbm1hZ2ljKFwicmVmc1wiLCAoZWwpID0+IHtcbiAgaWYgKGVsLl94X3JlZnNfcHJveHkpXG4gICAgcmV0dXJuIGVsLl94X3JlZnNfcHJveHk7XG4gIGVsLl94X3JlZnNfcHJveHkgPSBtZXJnZVByb3hpZXMoZ2V0QXJyYXlPZlJlZk9iamVjdChlbCkpO1xuICByZXR1cm4gZWwuX3hfcmVmc19wcm94eTtcbn0pO1xuZnVuY3Rpb24gZ2V0QXJyYXlPZlJlZk9iamVjdChlbCkge1xuICBsZXQgcmVmT2JqZWN0cyA9IFtdO1xuICBmaW5kQ2xvc2VzdChlbCwgKGkpID0+IHtcbiAgICBpZiAoaS5feF9yZWZzKVxuICAgICAgcmVmT2JqZWN0cy5wdXNoKGkuX3hfcmVmcyk7XG4gIH0pO1xuICByZXR1cm4gcmVmT2JqZWN0cztcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2lkcy5qc1xudmFyIGdsb2JhbElkTWVtbyA9IHt9O1xuZnVuY3Rpb24gZmluZEFuZEluY3JlbWVudElkKG5hbWUpIHtcbiAgaWYgKCFnbG9iYWxJZE1lbW9bbmFtZV0pXG4gICAgZ2xvYmFsSWRNZW1vW25hbWVdID0gMDtcbiAgcmV0dXJuICsrZ2xvYmFsSWRNZW1vW25hbWVdO1xufVxuZnVuY3Rpb24gY2xvc2VzdElkUm9vdChlbCwgbmFtZSkge1xuICByZXR1cm4gZmluZENsb3Nlc3QoZWwsIChlbGVtZW50KSA9PiB7XG4gICAgaWYgKGVsZW1lbnQuX3hfaWRzICYmIGVsZW1lbnQuX3hfaWRzW25hbWVdKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuZnVuY3Rpb24gc2V0SWRSb290KGVsLCBuYW1lKSB7XG4gIGlmICghZWwuX3hfaWRzKVxuICAgIGVsLl94X2lkcyA9IHt9O1xuICBpZiAoIWVsLl94X2lkc1tuYW1lXSlcbiAgICBlbC5feF9pZHNbbmFtZV0gPSBmaW5kQW5kSW5jcmVtZW50SWQobmFtZSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGlkLmpzXG5tYWdpYyhcImlkXCIsIChlbCwgeyBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiAobmFtZSwga2V5ID0gbnVsbCkgPT4ge1xuICBsZXQgY2FjaGVLZXkgPSBgJHtuYW1lfSR7a2V5ID8gYC0ke2tleX1gIDogXCJcIn1gO1xuICByZXR1cm4gY2FjaGVJZEJ5TmFtZU9uRWxlbWVudChlbCwgY2FjaGVLZXksIGNsZWFudXAyLCAoKSA9PiB7XG4gICAgbGV0IHJvb3QgPSBjbG9zZXN0SWRSb290KGVsLCBuYW1lKTtcbiAgICBsZXQgaWQgPSByb290ID8gcm9vdC5feF9pZHNbbmFtZV0gOiBmaW5kQW5kSW5jcmVtZW50SWQobmFtZSk7XG4gICAgcmV0dXJuIGtleSA/IGAke25hbWV9LSR7aWR9LSR7a2V5fWAgOiBgJHtuYW1lfS0ke2lkfWA7XG4gIH0pO1xufSk7XG5pbnRlcmNlcHRDbG9uZSgoZnJvbSwgdG8pID0+IHtcbiAgaWYgKGZyb20uX3hfaWQpIHtcbiAgICB0by5feF9pZCA9IGZyb20uX3hfaWQ7XG4gIH1cbn0pO1xuZnVuY3Rpb24gY2FjaGVJZEJ5TmFtZU9uRWxlbWVudChlbCwgY2FjaGVLZXksIGNsZWFudXAyLCBjYWxsYmFjaykge1xuICBpZiAoIWVsLl94X2lkKVxuICAgIGVsLl94X2lkID0ge307XG4gIGlmIChlbC5feF9pZFtjYWNoZUtleV0pXG4gICAgcmV0dXJuIGVsLl94X2lkW2NhY2hlS2V5XTtcbiAgbGV0IG91dHB1dCA9IGNhbGxiYWNrKCk7XG4gIGVsLl94X2lkW2NhY2hlS2V5XSA9IG91dHB1dDtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIGRlbGV0ZSBlbC5feF9pZFtjYWNoZUtleV07XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRlbC5qc1xubWFnaWMoXCJlbFwiLCAoZWwpID0+IGVsKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy9pbmRleC5qc1xud2Fybk1pc3NpbmdQbHVnaW5NYWdpYyhcIkZvY3VzXCIsIFwiZm9jdXNcIiwgXCJmb2N1c1wiKTtcbndhcm5NaXNzaW5nUGx1Z2luTWFnaWMoXCJQZXJzaXN0XCIsIFwicGVyc2lzdFwiLCBcInBlcnNpc3RcIik7XG5mdW5jdGlvbiB3YXJuTWlzc2luZ1BsdWdpbk1hZ2ljKG5hbWUsIG1hZ2ljTmFtZSwgc2x1Zykge1xuICBtYWdpYyhtYWdpY05hbWUsIChlbCkgPT4gd2FybihgWW91IGNhbid0IHVzZSBbJCR7bWFnaWNOYW1lfV0gd2l0aG91dCBmaXJzdCBpbnN0YWxsaW5nIHRoZSBcIiR7bmFtZX1cIiBwbHVnaW4gaGVyZTogaHR0cHM6Ly9hbHBpbmVqcy5kZXYvcGx1Z2lucy8ke3NsdWd9YCwgZWwpKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1tb2RlbGFibGUuanNcbmRpcmVjdGl2ZShcIm1vZGVsYWJsZVwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlcjIsIGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgbGV0IGZ1bmMgPSBldmFsdWF0ZUxhdGVyMihleHByZXNzaW9uKTtcbiAgbGV0IGlubmVyR2V0ID0gKCkgPT4ge1xuICAgIGxldCByZXN1bHQ7XG4gICAgZnVuYygoaSkgPT4gcmVzdWx0ID0gaSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbGV0IGV2YWx1YXRlSW5uZXJTZXQgPSBldmFsdWF0ZUxhdGVyMihgJHtleHByZXNzaW9ufSA9IF9fcGxhY2Vob2xkZXJgKTtcbiAgbGV0IGlubmVyU2V0ID0gKHZhbCkgPT4gZXZhbHVhdGVJbm5lclNldCgoKSA9PiB7XG4gIH0sIHsgc2NvcGU6IHsgXCJfX3BsYWNlaG9sZGVyXCI6IHZhbCB9IH0pO1xuICBsZXQgaW5pdGlhbFZhbHVlID0gaW5uZXJHZXQoKTtcbiAgaW5uZXJTZXQoaW5pdGlhbFZhbHVlKTtcbiAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgIGlmICghZWwuX3hfbW9kZWwpXG4gICAgICByZXR1cm47XG4gICAgZWwuX3hfcmVtb3ZlTW9kZWxMaXN0ZW5lcnNbXCJkZWZhdWx0XCJdKCk7XG4gICAgbGV0IG91dGVyR2V0ID0gZWwuX3hfbW9kZWwuZ2V0O1xuICAgIGxldCBvdXRlclNldCA9IGVsLl94X21vZGVsLnNldDtcbiAgICBsZXQgcmVsZWFzZUVudGFuZ2xlbWVudCA9IGVudGFuZ2xlKFxuICAgICAge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIG91dGVyR2V0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIG91dGVyU2V0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBpbm5lckdldCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBpbm5lclNldCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICAgIGNsZWFudXAyKHJlbGVhc2VFbnRhbmdsZW1lbnQpO1xuICB9KTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXRlbGVwb3J0LmpzXG5kaXJlY3RpdmUoXCJ0ZWxlcG9ydFwiLCAoZWwsIHsgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0sIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcInRlbXBsYXRlXCIpXG4gICAgd2FybihcIngtdGVsZXBvcnQgY2FuIG9ubHkgYmUgdXNlZCBvbiBhIDx0ZW1wbGF0ZT4gdGFnXCIsIGVsKTtcbiAgbGV0IHRhcmdldCA9IGdldFRhcmdldChleHByZXNzaW9uKTtcbiAgbGV0IGNsb25lMiA9IGVsLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmZpcnN0RWxlbWVudENoaWxkO1xuICBlbC5feF90ZWxlcG9ydCA9IGNsb25lMjtcbiAgY2xvbmUyLl94X3RlbGVwb3J0QmFjayA9IGVsO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRlbGVwb3J0LXRlbXBsYXRlXCIsIHRydWUpO1xuICBjbG9uZTIuc2V0QXR0cmlidXRlKFwiZGF0YS10ZWxlcG9ydC10YXJnZXRcIiwgdHJ1ZSk7XG4gIGlmIChlbC5feF9mb3J3YXJkRXZlbnRzKSB7XG4gICAgZWwuX3hfZm9yd2FyZEV2ZW50cy5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIGNsb25lMi5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgZS5jb25zdHJ1Y3RvcihlLnR5cGUsIGUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGFkZFNjb3BlVG9Ob2RlKGNsb25lMiwge30sIGVsKTtcbiAgbGV0IHBsYWNlSW5Eb20gPSAoY2xvbmUzLCB0YXJnZXQyLCBtb2RpZmllcnMyKSA9PiB7XG4gICAgaWYgKG1vZGlmaWVyczIuaW5jbHVkZXMoXCJwcmVwZW5kXCIpKSB7XG4gICAgICB0YXJnZXQyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNsb25lMywgdGFyZ2V0Mik7XG4gICAgfSBlbHNlIGlmIChtb2RpZmllcnMyLmluY2x1ZGVzKFwiYXBwZW5kXCIpKSB7XG4gICAgICB0YXJnZXQyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNsb25lMywgdGFyZ2V0Mi5uZXh0U2libGluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldDIuYXBwZW5kQ2hpbGQoY2xvbmUzKTtcbiAgICB9XG4gIH07XG4gIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgcGxhY2VJbkRvbShjbG9uZTIsIHRhcmdldCwgbW9kaWZpZXJzKTtcbiAgICBza2lwRHVyaW5nQ2xvbmUoKCkgPT4ge1xuICAgICAgaW5pdFRyZWUoY2xvbmUyKTtcbiAgICB9KSgpO1xuICB9KTtcbiAgZWwuX3hfdGVsZXBvcnRQdXRCYWNrID0gKCkgPT4ge1xuICAgIGxldCB0YXJnZXQyID0gZ2V0VGFyZ2V0KGV4cHJlc3Npb24pO1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBwbGFjZUluRG9tKGVsLl94X3RlbGVwb3J0LCB0YXJnZXQyLCBtb2RpZmllcnMpO1xuICAgIH0pO1xuICB9O1xuICBjbGVhbnVwMihcbiAgICAoKSA9PiBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgY2xvbmUyLnJlbW92ZSgpO1xuICAgICAgZGVzdHJveVRyZWUoY2xvbmUyKTtcbiAgICB9KVxuICApO1xufSk7XG52YXIgdGVsZXBvcnRDb250YWluZXJEdXJpbmdDbG9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5mdW5jdGlvbiBnZXRUYXJnZXQoZXhwcmVzc2lvbikge1xuICBsZXQgdGFyZ2V0ID0gc2tpcER1cmluZ0Nsb25lKCgpID0+IHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihleHByZXNzaW9uKTtcbiAgfSwgKCkgPT4ge1xuICAgIHJldHVybiB0ZWxlcG9ydENvbnRhaW5lckR1cmluZ0Nsb25lO1xuICB9KSgpO1xuICBpZiAoIXRhcmdldClcbiAgICB3YXJuKGBDYW5ub3QgZmluZCB4LXRlbGVwb3J0IGVsZW1lbnQgZm9yIHNlbGVjdG9yOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWlnbm9yZS5qc1xudmFyIGhhbmRsZXIgPSAoKSA9PiB7XG59O1xuaGFuZGxlci5pbmxpbmUgPSAoZWwsIHsgbW9kaWZpZXJzIH0sIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBtb2RpZmllcnMuaW5jbHVkZXMoXCJzZWxmXCIpID8gZWwuX3hfaWdub3JlU2VsZiA9IHRydWUgOiBlbC5feF9pZ25vcmUgPSB0cnVlO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgbW9kaWZpZXJzLmluY2x1ZGVzKFwic2VsZlwiKSA/IGRlbGV0ZSBlbC5feF9pZ25vcmVTZWxmIDogZGVsZXRlIGVsLl94X2lnbm9yZTtcbiAgfSk7XG59O1xuZGlyZWN0aXZlKFwiaWdub3JlXCIsIGhhbmRsZXIpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWVmZmVjdC5qc1xuZGlyZWN0aXZlKFwiZWZmZWN0XCIsIHNraXBEdXJpbmdDbG9uZSgoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MyB9KSA9PiB7XG4gIGVmZmVjdDMoZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbikpO1xufSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvb24uanNcbmZ1bmN0aW9uIG9uKGVsLCBldmVudCwgbW9kaWZpZXJzLCBjYWxsYmFjaykge1xuICBsZXQgbGlzdGVuZXJUYXJnZXQgPSBlbDtcbiAgbGV0IGhhbmRsZXI0ID0gKGUpID0+IGNhbGxiYWNrKGUpO1xuICBsZXQgb3B0aW9ucyA9IHt9O1xuICBsZXQgd3JhcEhhbmRsZXIgPSAoY2FsbGJhY2syLCB3cmFwcGVyKSA9PiAoZSkgPT4gd3JhcHBlcihjYWxsYmFjazIsIGUpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZG90XCIpKVxuICAgIGV2ZW50ID0gZG90U3ludGF4KGV2ZW50KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImNhbWVsXCIpKVxuICAgIGV2ZW50ID0gY2FtZWxDYXNlMihldmVudCk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwYXNzaXZlXCIpKVxuICAgIG9wdGlvbnMucGFzc2l2ZSA9IHRydWU7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYXB0dXJlXCIpKVxuICAgIG9wdGlvbnMuY2FwdHVyZSA9IHRydWU7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJ3aW5kb3dcIikpXG4gICAgbGlzdGVuZXJUYXJnZXQgPSB3aW5kb3c7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJkb2N1bWVudFwiKSlcbiAgICBsaXN0ZW5lclRhcmdldCA9IGRvY3VtZW50O1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZGVib3VuY2VcIikpIHtcbiAgICBsZXQgbmV4dE1vZGlmaWVyID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKFwiZGVib3VuY2VcIikgKyAxXSB8fCBcImludmFsaWQtd2FpdFwiO1xuICAgIGxldCB3YWl0ID0gaXNOdW1lcmljKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA/IE51bWJlcihuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgOiAyNTA7XG4gICAgaGFuZGxlcjQgPSBkZWJvdW5jZShoYW5kbGVyNCwgd2FpdCk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInRocm90dGxlXCIpKSB7XG4gICAgbGV0IG5leHRNb2RpZmllciA9IG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihcInRocm90dGxlXCIpICsgMV0gfHwgXCJpbnZhbGlkLXdhaXRcIjtcbiAgICBsZXQgd2FpdCA9IGlzTnVtZXJpYyhuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgPyBOdW1iZXIobmV4dE1vZGlmaWVyLnNwbGl0KFwibXNcIilbMF0pIDogMjUwO1xuICAgIGhhbmRsZXI0ID0gdGhyb3R0bGUoaGFuZGxlcjQsIHdhaXQpO1xuICB9XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwcmV2ZW50XCIpKVxuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBuZXh0KGUpO1xuICAgIH0pO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic3RvcFwiKSlcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJvbmNlXCIpKSB7XG4gICAgaGFuZGxlcjQgPSB3cmFwSGFuZGxlcihoYW5kbGVyNCwgKG5leHQsIGUpID0+IHtcbiAgICAgIG5leHQoZSk7XG4gICAgICBsaXN0ZW5lclRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyNCwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImF3YXlcIikgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwib3V0c2lkZVwiKSkge1xuICAgIGxpc3RlbmVyVGFyZ2V0ID0gZG9jdW1lbnQ7XG4gICAgaGFuZGxlcjQgPSB3cmFwSGFuZGxlcihoYW5kbGVyNCwgKG5leHQsIGUpID0+IHtcbiAgICAgIGlmIChlbC5jb250YWlucyhlLnRhcmdldCkpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGlmIChlLnRhcmdldC5pc0Nvbm5lY3RlZCA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGlmIChlbC5vZmZzZXRXaWR0aCA8IDEgJiYgZWwub2Zmc2V0SGVpZ2h0IDwgMSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGVsLl94X2lzU2hvd24gPT09IGZhbHNlKVxuICAgICAgICByZXR1cm47XG4gICAgICBuZXh0KGUpO1xuICAgIH0pO1xuICB9XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJzZWxmXCIpKVxuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBlLnRhcmdldCA9PT0gZWwgJiYgbmV4dChlKTtcbiAgICB9KTtcbiAgaWYgKGlzS2V5RXZlbnQoZXZlbnQpIHx8IGlzQ2xpY2tFdmVudChldmVudCkpIHtcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgaWYgKGlzTGlzdGVuaW5nRm9yQVNwZWNpZmljS2V5VGhhdEhhc250QmVlblByZXNzZWQoZSwgbW9kaWZpZXJzKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBuZXh0KGUpO1xuICAgIH0pO1xuICB9XG4gIGxpc3RlbmVyVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXI0LCBvcHRpb25zKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBsaXN0ZW5lclRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyNCwgb3B0aW9ucyk7XG4gIH07XG59XG5mdW5jdGlvbiBkb3RTeW50YXgoc3ViamVjdCkge1xuICByZXR1cm4gc3ViamVjdC5yZXBsYWNlKC8tL2csIFwiLlwiKTtcbn1cbmZ1bmN0aW9uIGNhbWVsQ2FzZTIoc3ViamVjdCkge1xuICByZXR1cm4gc3ViamVjdC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLy0oXFx3KS9nLCAobWF0Y2gsIGNoYXIpID0+IGNoYXIudG9VcHBlckNhc2UoKSk7XG59XG5mdW5jdGlvbiBpc051bWVyaWMoc3ViamVjdCkge1xuICByZXR1cm4gIUFycmF5LmlzQXJyYXkoc3ViamVjdCkgJiYgIWlzTmFOKHN1YmplY3QpO1xufVxuZnVuY3Rpb24ga2ViYWJDYXNlMihzdWJqZWN0KSB7XG4gIGlmIChbXCIgXCIsIFwiX1wiXS5pbmNsdWRlcyhcbiAgICBzdWJqZWN0XG4gICkpXG4gICAgcmV0dXJuIHN1YmplY3Q7XG4gIHJldHVybiBzdWJqZWN0LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIFwiJDEtJDJcIikucmVwbGFjZSgvW19cXHNdLywgXCItXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5mdW5jdGlvbiBpc0tleUV2ZW50KGV2ZW50KSB7XG4gIHJldHVybiBbXCJrZXlkb3duXCIsIFwia2V5dXBcIl0uaW5jbHVkZXMoZXZlbnQpO1xufVxuZnVuY3Rpb24gaXNDbGlja0V2ZW50KGV2ZW50KSB7XG4gIHJldHVybiBbXCJjb250ZXh0bWVudVwiLCBcImNsaWNrXCIsIFwibW91c2VcIl0uc29tZSgoaSkgPT4gZXZlbnQuaW5jbHVkZXMoaSkpO1xufVxuZnVuY3Rpb24gaXNMaXN0ZW5pbmdGb3JBU3BlY2lmaWNLZXlUaGF0SGFzbnRCZWVuUHJlc3NlZChlLCBtb2RpZmllcnMpIHtcbiAgbGV0IGtleU1vZGlmaWVycyA9IG1vZGlmaWVycy5maWx0ZXIoKGkpID0+IHtcbiAgICByZXR1cm4gIVtcIndpbmRvd1wiLCBcImRvY3VtZW50XCIsIFwicHJldmVudFwiLCBcInN0b3BcIiwgXCJvbmNlXCIsIFwiY2FwdHVyZVwiLCBcInNlbGZcIiwgXCJhd2F5XCIsIFwib3V0c2lkZVwiLCBcInBhc3NpdmVcIl0uaW5jbHVkZXMoaSk7XG4gIH0pO1xuICBpZiAoa2V5TW9kaWZpZXJzLmluY2x1ZGVzKFwiZGVib3VuY2VcIikpIHtcbiAgICBsZXQgZGVib3VuY2VJbmRleCA9IGtleU1vZGlmaWVycy5pbmRleE9mKFwiZGVib3VuY2VcIik7XG4gICAga2V5TW9kaWZpZXJzLnNwbGljZShkZWJvdW5jZUluZGV4LCBpc051bWVyaWMoKGtleU1vZGlmaWVyc1tkZWJvdW5jZUluZGV4ICsgMV0gfHwgXCJpbnZhbGlkLXdhaXRcIikuc3BsaXQoXCJtc1wiKVswXSkgPyAyIDogMSk7XG4gIH1cbiAgaWYgKGtleU1vZGlmaWVycy5pbmNsdWRlcyhcInRocm90dGxlXCIpKSB7XG4gICAgbGV0IGRlYm91bmNlSW5kZXggPSBrZXlNb2RpZmllcnMuaW5kZXhPZihcInRocm90dGxlXCIpO1xuICAgIGtleU1vZGlmaWVycy5zcGxpY2UoZGVib3VuY2VJbmRleCwgaXNOdW1lcmljKChrZXlNb2RpZmllcnNbZGVib3VuY2VJbmRleCArIDFdIHx8IFwiaW52YWxpZC13YWl0XCIpLnNwbGl0KFwibXNcIilbMF0pID8gMiA6IDEpO1xuICB9XG4gIGlmIChrZXlNb2RpZmllcnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGtleU1vZGlmaWVycy5sZW5ndGggPT09IDEgJiYga2V5VG9Nb2RpZmllcnMoZS5rZXkpLmluY2x1ZGVzKGtleU1vZGlmaWVyc1swXSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBzeXN0ZW1LZXlNb2RpZmllcnMgPSBbXCJjdHJsXCIsIFwic2hpZnRcIiwgXCJhbHRcIiwgXCJtZXRhXCIsIFwiY21kXCIsIFwic3VwZXJcIl07XG4gIGNvbnN0IHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzID0gc3lzdGVtS2V5TW9kaWZpZXJzLmZpbHRlcigobW9kaWZpZXIpID0+IGtleU1vZGlmaWVycy5pbmNsdWRlcyhtb2RpZmllcikpO1xuICBrZXlNb2RpZmllcnMgPSBrZXlNb2RpZmllcnMuZmlsdGVyKChpKSA9PiAhc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMuaW5jbHVkZXMoaSkpO1xuICBpZiAoc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGFjdGl2ZWx5UHJlc3NlZEtleU1vZGlmaWVycyA9IHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmZpbHRlcigobW9kaWZpZXIpID0+IHtcbiAgICAgIGlmIChtb2RpZmllciA9PT0gXCJjbWRcIiB8fCBtb2RpZmllciA9PT0gXCJzdXBlclwiKVxuICAgICAgICBtb2RpZmllciA9IFwibWV0YVwiO1xuICAgICAgcmV0dXJuIGVbYCR7bW9kaWZpZXJ9S2V5YF07XG4gICAgfSk7XG4gICAgaWYgKGFjdGl2ZWx5UHJlc3NlZEtleU1vZGlmaWVycy5sZW5ndGggPT09IHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmxlbmd0aCkge1xuICAgICAgaWYgKGlzQ2xpY2tFdmVudChlLnR5cGUpKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoa2V5VG9Nb2RpZmllcnMoZS5rZXkpLmluY2x1ZGVzKGtleU1vZGlmaWVyc1swXSkpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBrZXlUb01vZGlmaWVycyhrZXkpIHtcbiAgaWYgKCFrZXkpXG4gICAgcmV0dXJuIFtdO1xuICBrZXkgPSBrZWJhYkNhc2UyKGtleSk7XG4gIGxldCBtb2RpZmllclRvS2V5TWFwID0ge1xuICAgIFwiY3RybFwiOiBcImNvbnRyb2xcIixcbiAgICBcInNsYXNoXCI6IFwiL1wiLFxuICAgIFwic3BhY2VcIjogXCIgXCIsXG4gICAgXCJzcGFjZWJhclwiOiBcIiBcIixcbiAgICBcImNtZFwiOiBcIm1ldGFcIixcbiAgICBcImVzY1wiOiBcImVzY2FwZVwiLFxuICAgIFwidXBcIjogXCJhcnJvdy11cFwiLFxuICAgIFwiZG93blwiOiBcImFycm93LWRvd25cIixcbiAgICBcImxlZnRcIjogXCJhcnJvdy1sZWZ0XCIsXG4gICAgXCJyaWdodFwiOiBcImFycm93LXJpZ2h0XCIsXG4gICAgXCJwZXJpb2RcIjogXCIuXCIsXG4gICAgXCJjb21tYVwiOiBcIixcIixcbiAgICBcImVxdWFsXCI6IFwiPVwiLFxuICAgIFwibWludXNcIjogXCItXCIsXG4gICAgXCJ1bmRlcnNjb3JlXCI6IFwiX1wiXG4gIH07XG4gIG1vZGlmaWVyVG9LZXlNYXBba2V5XSA9IGtleTtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1vZGlmaWVyVG9LZXlNYXApLm1hcCgobW9kaWZpZXIpID0+IHtcbiAgICBpZiAobW9kaWZpZXJUb0tleU1hcFttb2RpZmllcl0gPT09IGtleSlcbiAgICAgIHJldHVybiBtb2RpZmllcjtcbiAgfSkuZmlsdGVyKChtb2RpZmllcikgPT4gbW9kaWZpZXIpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LW1vZGVsLmpzXG5kaXJlY3RpdmUoXCJtb2RlbFwiLCAoZWwsIHsgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGxldCBzY29wZVRhcmdldCA9IGVsO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFyZW50XCIpKSB7XG4gICAgc2NvcGVUYXJnZXQgPSBlbC5wYXJlbnROb2RlO1xuICB9XG4gIGxldCBldmFsdWF0ZUdldCA9IGV2YWx1YXRlTGF0ZXIoc2NvcGVUYXJnZXQsIGV4cHJlc3Npb24pO1xuICBsZXQgZXZhbHVhdGVTZXQ7XG4gIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJzdHJpbmdcIikge1xuICAgIGV2YWx1YXRlU2V0ID0gZXZhbHVhdGVMYXRlcihzY29wZVRhcmdldCwgYCR7ZXhwcmVzc2lvbn0gPSBfX3BsYWNlaG9sZGVyYCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgZXhwcmVzc2lvbigpID09PSBcInN0cmluZ1wiKSB7XG4gICAgZXZhbHVhdGVTZXQgPSBldmFsdWF0ZUxhdGVyKHNjb3BlVGFyZ2V0LCBgJHtleHByZXNzaW9uKCl9ID0gX19wbGFjZWhvbGRlcmApO1xuICB9IGVsc2Uge1xuICAgIGV2YWx1YXRlU2V0ID0gKCkgPT4ge1xuICAgIH07XG4gIH1cbiAgbGV0IGdldFZhbHVlID0gKCkgPT4ge1xuICAgIGxldCByZXN1bHQ7XG4gICAgZXZhbHVhdGVHZXQoKHZhbHVlKSA9PiByZXN1bHQgPSB2YWx1ZSk7XG4gICAgcmV0dXJuIGlzR2V0dGVyU2V0dGVyKHJlc3VsdCkgPyByZXN1bHQuZ2V0KCkgOiByZXN1bHQ7XG4gIH07XG4gIGxldCBzZXRWYWx1ZSA9ICh2YWx1ZSkgPT4ge1xuICAgIGxldCByZXN1bHQ7XG4gICAgZXZhbHVhdGVHZXQoKHZhbHVlMikgPT4gcmVzdWx0ID0gdmFsdWUyKTtcbiAgICBpZiAoaXNHZXR0ZXJTZXR0ZXIocmVzdWx0KSkge1xuICAgICAgcmVzdWx0LnNldCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2YWx1YXRlU2V0KCgpID0+IHtcbiAgICAgIH0sIHtcbiAgICAgICAgc2NvcGU6IHsgXCJfX3BsYWNlaG9sZGVyXCI6IHZhbHVlIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiICYmIGVsLnR5cGUgPT09IFwicmFkaW9cIikge1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBpZiAoIWVsLmhhc0F0dHJpYnV0ZShcIm5hbWVcIikpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgZXhwcmVzc2lvbik7XG4gICAgfSk7XG4gIH1cbiAgdmFyIGV2ZW50ID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInNlbGVjdFwiIHx8IFtcImNoZWNrYm94XCIsIFwicmFkaW9cIl0uaW5jbHVkZXMoZWwudHlwZSkgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwibGF6eVwiKSA/IFwiY2hhbmdlXCIgOiBcImlucHV0XCI7XG4gIGxldCByZW1vdmVMaXN0ZW5lciA9IGlzQ2xvbmluZyA/ICgpID0+IHtcbiAgfSA6IG9uKGVsLCBldmVudCwgbW9kaWZpZXJzLCAoZSkgPT4ge1xuICAgIHNldFZhbHVlKGdldElucHV0VmFsdWUoZWwsIG1vZGlmaWVycywgZSwgZ2V0VmFsdWUoKSkpO1xuICB9KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImZpbGxcIikpIHtcbiAgICBpZiAoW3ZvaWQgMCwgbnVsbCwgXCJcIl0uaW5jbHVkZXMoZ2V0VmFsdWUoKSkgfHwgaXNDaGVja2JveChlbCkgJiYgQXJyYXkuaXNBcnJheShnZXRWYWx1ZSgpKSB8fCBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgJiYgZWwubXVsdGlwbGUpIHtcbiAgICAgIHNldFZhbHVlKFxuICAgICAgICBnZXRJbnB1dFZhbHVlKGVsLCBtb2RpZmllcnMsIHsgdGFyZ2V0OiBlbCB9LCBnZXRWYWx1ZSgpKVxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVycylcbiAgICBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVycyA9IHt9O1xuICBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0gPSByZW1vdmVMaXN0ZW5lcjtcbiAgY2xlYW51cDIoKCkgPT4gZWwuX3hfcmVtb3ZlTW9kZWxMaXN0ZW5lcnNbXCJkZWZhdWx0XCJdKCkpO1xuICBpZiAoZWwuZm9ybSkge1xuICAgIGxldCByZW1vdmVSZXNldExpc3RlbmVyID0gb24oZWwuZm9ybSwgXCJyZXNldFwiLCBbXSwgKGUpID0+IHtcbiAgICAgIG5leHRUaWNrKCgpID0+IGVsLl94X21vZGVsICYmIGVsLl94X21vZGVsLnNldChnZXRJbnB1dFZhbHVlKGVsLCBtb2RpZmllcnMsIHsgdGFyZ2V0OiBlbCB9LCBnZXRWYWx1ZSgpKSkpO1xuICAgIH0pO1xuICAgIGNsZWFudXAyKCgpID0+IHJlbW92ZVJlc2V0TGlzdGVuZXIoKSk7XG4gIH1cbiAgZWwuX3hfbW9kZWwgPSB7XG4gICAgZ2V0KCkge1xuICAgICAgcmV0dXJuIGdldFZhbHVlKCk7XG4gICAgfSxcbiAgICBzZXQodmFsdWUpIHtcbiAgICAgIHNldFZhbHVlKHZhbHVlKTtcbiAgICB9XG4gIH07XG4gIGVsLl94X2ZvcmNlTW9kZWxVcGRhdGUgPSAodmFsdWUpID0+IHtcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCAmJiB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJzdHJpbmdcIiAmJiBleHByZXNzaW9uLm1hdGNoKC9cXC4vKSlcbiAgICAgIHZhbHVlID0gXCJcIjtcbiAgICB3aW5kb3cuZnJvbU1vZGVsID0gdHJ1ZTtcbiAgICBtdXRhdGVEb20oKCkgPT4gYmluZChlbCwgXCJ2YWx1ZVwiLCB2YWx1ZSkpO1xuICAgIGRlbGV0ZSB3aW5kb3cuZnJvbU1vZGVsO1xuICB9O1xuICBlZmZlY3QzKCgpID0+IHtcbiAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZSgpO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJ1bmludHJ1c2l2ZVwiKSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmlzU2FtZU5vZGUoZWwpKVxuICAgICAgcmV0dXJuO1xuICAgIGVsLl94X2ZvcmNlTW9kZWxVcGRhdGUodmFsdWUpO1xuICB9KTtcbn0pO1xuZnVuY3Rpb24gZ2V0SW5wdXRWYWx1ZShlbCwgbW9kaWZpZXJzLCBldmVudCwgY3VycmVudFZhbHVlKSB7XG4gIHJldHVybiBtdXRhdGVEb20oKCkgPT4ge1xuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50ICYmIGV2ZW50LmRldGFpbCAhPT0gdm9pZCAwKVxuICAgICAgcmV0dXJuIGV2ZW50LmRldGFpbCAhPT0gbnVsbCAmJiBldmVudC5kZXRhaWwgIT09IHZvaWQgMCA/IGV2ZW50LmRldGFpbCA6IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBlbHNlIGlmIChpc0NoZWNrYm94KGVsKSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY3VycmVudFZhbHVlKSkge1xuICAgICAgICBsZXQgbmV3VmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwibnVtYmVyXCIpKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBzYWZlUGFyc2VOdW1iZXIoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJib29sZWFuXCIpKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBzYWZlUGFyc2VCb29sZWFuKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV2ZW50LnRhcmdldC5jaGVja2VkID8gY3VycmVudFZhbHVlLmluY2x1ZGVzKG5ld1ZhbHVlKSA/IGN1cnJlbnRWYWx1ZSA6IGN1cnJlbnRWYWx1ZS5jb25jYXQoW25ld1ZhbHVlXSkgOiBjdXJyZW50VmFsdWUuZmlsdGVyKChlbDIpID0+ICFjaGVja2VkQXR0ckxvb3NlQ29tcGFyZTIoZWwyLCBuZXdWYWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50LnRhcmdldC5jaGVja2VkO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInNlbGVjdFwiICYmIGVsLm11bHRpcGxlKSB7XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwibnVtYmVyXCIpKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGV2ZW50LnRhcmdldC5zZWxlY3RlZE9wdGlvbnMpLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHJhd1ZhbHVlID0gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgICAgIHJldHVybiBzYWZlUGFyc2VOdW1iZXIocmF3VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiYm9vbGVhblwiKSkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShldmVudC50YXJnZXQuc2VsZWN0ZWRPcHRpb25zKS5tYXAoKG9wdGlvbikgPT4ge1xuICAgICAgICAgIGxldCByYXdWYWx1ZSA9IG9wdGlvbi52YWx1ZSB8fCBvcHRpb24udGV4dDtcbiAgICAgICAgICByZXR1cm4gc2FmZVBhcnNlQm9vbGVhbihyYXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucykubWFwKChvcHRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZSB8fCBvcHRpb24udGV4dDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3VmFsdWU7XG4gICAgICBpZiAoaXNSYWRpbyhlbCkpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1ZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm51bWJlclwiKSkge1xuICAgICAgICByZXR1cm4gc2FmZVBhcnNlTnVtYmVyKG5ld1ZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiYm9vbGVhblwiKSkge1xuICAgICAgICByZXR1cm4gc2FmZVBhcnNlQm9vbGVhbihuZXdWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInRyaW1cIikpIHtcbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlLnRyaW0oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gc2FmZVBhcnNlTnVtYmVyKHJhd1ZhbHVlKSB7XG4gIGxldCBudW1iZXIgPSByYXdWYWx1ZSA/IHBhcnNlRmxvYXQocmF3VmFsdWUpIDogbnVsbDtcbiAgcmV0dXJuIGlzTnVtZXJpYzIobnVtYmVyKSA/IG51bWJlciA6IHJhd1ZhbHVlO1xufVxuZnVuY3Rpb24gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUyKHZhbHVlQSwgdmFsdWVCKSB7XG4gIHJldHVybiB2YWx1ZUEgPT0gdmFsdWVCO1xufVxuZnVuY3Rpb24gaXNOdW1lcmljMihzdWJqZWN0KSB7XG4gIHJldHVybiAhQXJyYXkuaXNBcnJheShzdWJqZWN0KSAmJiAhaXNOYU4oc3ViamVjdCk7XG59XG5mdW5jdGlvbiBpc0dldHRlclNldHRlcih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS5nZXQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgdmFsdWUuc2V0ID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtY2xvYWsuanNcbmRpcmVjdGl2ZShcImNsb2FrXCIsIChlbCkgPT4gcXVldWVNaWNyb3Rhc2soKCkgPT4gbXV0YXRlRG9tKCgpID0+IGVsLnJlbW92ZUF0dHJpYnV0ZShwcmVmaXgoXCJjbG9ha1wiKSkpKSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaW5pdC5qc1xuYWRkSW5pdFNlbGVjdG9yKCgpID0+IGBbJHtwcmVmaXgoXCJpbml0XCIpfV1gKTtcbmRpcmVjdGl2ZShcImluaXRcIiwgc2tpcER1cmluZ0Nsb25lKChlbCwgeyBleHByZXNzaW9uIH0sIHsgZXZhbHVhdGU6IGV2YWx1YXRlMiB9KSA9PiB7XG4gIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiAhIWV4cHJlc3Npb24udHJpbSgpICYmIGV2YWx1YXRlMihleHByZXNzaW9uLCB7fSwgZmFsc2UpO1xuICB9XG4gIHJldHVybiBldmFsdWF0ZTIoZXhwcmVzc2lvbiwge30sIGZhbHNlKTtcbn0pKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC10ZXh0LmpzXG5kaXJlY3RpdmUoXCJ0ZXh0XCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyMiB9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyMihleHByZXNzaW9uKTtcbiAgZWZmZWN0MygoKSA9PiB7XG4gICAgZXZhbHVhdGUyKCh2YWx1ZSkgPT4ge1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWh0bWwuanNcbmRpcmVjdGl2ZShcImh0bWxcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyIH0pID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIyKGV4cHJlc3Npb24pO1xuICBlZmZlY3QzKCgpID0+IHtcbiAgICBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgZWwuX3hfaWdub3JlU2VsZiA9IHRydWU7XG4gICAgICAgIGluaXRUcmVlKGVsKTtcbiAgICAgICAgZGVsZXRlIGVsLl94X2lnbm9yZVNlbGY7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1iaW5kLmpzXG5tYXBBdHRyaWJ1dGVzKHN0YXJ0aW5nV2l0aChcIjpcIiwgaW50byhwcmVmaXgoXCJiaW5kOlwiKSkpKTtcbnZhciBoYW5kbGVyMiA9IChlbCwgeyB2YWx1ZSwgbW9kaWZpZXJzLCBleHByZXNzaW9uLCBvcmlnaW5hbCB9LCB7IGVmZmVjdDogZWZmZWN0MywgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgbGV0IGJpbmRpbmdQcm92aWRlcnMgPSB7fTtcbiAgICBpbmplY3RCaW5kaW5nUHJvdmlkZXJzKGJpbmRpbmdQcm92aWRlcnMpO1xuICAgIGxldCBnZXRCaW5kaW5ncyA9IGV2YWx1YXRlTGF0ZXIoZWwsIGV4cHJlc3Npb24pO1xuICAgIGdldEJpbmRpbmdzKChiaW5kaW5ncykgPT4ge1xuICAgICAgYXBwbHlCaW5kaW5nc09iamVjdChlbCwgYmluZGluZ3MsIG9yaWdpbmFsKTtcbiAgICB9LCB7IHNjb3BlOiBiaW5kaW5nUHJvdmlkZXJzIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodmFsdWUgPT09IFwia2V5XCIpXG4gICAgcmV0dXJuIHN0b3JlS2V5Rm9yWEZvcihlbCwgZXhwcmVzc2lvbik7XG4gIGlmIChlbC5feF9pbmxpbmVCaW5kaW5ncyAmJiBlbC5feF9pbmxpbmVCaW5kaW5nc1t2YWx1ZV0gJiYgZWwuX3hfaW5saW5lQmluZGluZ3NbdmFsdWVdLmV4dHJhY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIoZWwsIGV4cHJlc3Npb24pO1xuICBlZmZlY3QzKCgpID0+IGV2YWx1YXRlMigocmVzdWx0KSA9PiB7XG4gICAgaWYgKHJlc3VsdCA9PT0gdm9pZCAwICYmIHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiICYmIGV4cHJlc3Npb24ubWF0Y2goL1xcLi8pKSB7XG4gICAgICByZXN1bHQgPSBcIlwiO1xuICAgIH1cbiAgICBtdXRhdGVEb20oKCkgPT4gYmluZChlbCwgdmFsdWUsIHJlc3VsdCwgbW9kaWZpZXJzKSk7XG4gIH0pKTtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIGVsLl94X3VuZG9BZGRlZENsYXNzZXMgJiYgZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcygpO1xuICAgIGVsLl94X3VuZG9BZGRlZFN0eWxlcyAmJiBlbC5feF91bmRvQWRkZWRTdHlsZXMoKTtcbiAgfSk7XG59O1xuaGFuZGxlcjIuaW5saW5lID0gKGVsLCB7IHZhbHVlLCBtb2RpZmllcnMsIGV4cHJlc3Npb24gfSkgPT4ge1xuICBpZiAoIXZhbHVlKVxuICAgIHJldHVybjtcbiAgaWYgKCFlbC5feF9pbmxpbmVCaW5kaW5ncylcbiAgICBlbC5feF9pbmxpbmVCaW5kaW5ncyA9IHt9O1xuICBlbC5feF9pbmxpbmVCaW5kaW5nc1t2YWx1ZV0gPSB7IGV4cHJlc3Npb24sIGV4dHJhY3Q6IGZhbHNlIH07XG59O1xuZGlyZWN0aXZlKFwiYmluZFwiLCBoYW5kbGVyMik7XG5mdW5jdGlvbiBzdG9yZUtleUZvclhGb3IoZWwsIGV4cHJlc3Npb24pIHtcbiAgZWwuX3hfa2V5RXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtZGF0YS5qc1xuYWRkUm9vdFNlbGVjdG9yKCgpID0+IGBbJHtwcmVmaXgoXCJkYXRhXCIpfV1gKTtcbmRpcmVjdGl2ZShcImRhdGFcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGlmIChzaG91bGRTa2lwUmVnaXN0ZXJpbmdEYXRhRHVyaW5nQ2xvbmUoZWwpKVxuICAgIHJldHVybjtcbiAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24gPT09IFwiXCIgPyBcInt9XCIgOiBleHByZXNzaW9uO1xuICBsZXQgbWFnaWNDb250ZXh0ID0ge307XG4gIGluamVjdE1hZ2ljcyhtYWdpY0NvbnRleHQsIGVsKTtcbiAgbGV0IGRhdGFQcm92aWRlckNvbnRleHQgPSB7fTtcbiAgaW5qZWN0RGF0YVByb3ZpZGVycyhkYXRhUHJvdmlkZXJDb250ZXh0LCBtYWdpY0NvbnRleHQpO1xuICBsZXQgZGF0YTIgPSBldmFsdWF0ZShlbCwgZXhwcmVzc2lvbiwgeyBzY29wZTogZGF0YVByb3ZpZGVyQ29udGV4dCB9KTtcbiAgaWYgKGRhdGEyID09PSB2b2lkIDAgfHwgZGF0YTIgPT09IHRydWUpXG4gICAgZGF0YTIgPSB7fTtcbiAgaW5qZWN0TWFnaWNzKGRhdGEyLCBlbCk7XG4gIGxldCByZWFjdGl2ZURhdGEgPSByZWFjdGl2ZShkYXRhMik7XG4gIGluaXRJbnRlcmNlcHRvcnMocmVhY3RpdmVEYXRhKTtcbiAgbGV0IHVuZG8gPSBhZGRTY29wZVRvTm9kZShlbCwgcmVhY3RpdmVEYXRhKTtcbiAgcmVhY3RpdmVEYXRhW1wiaW5pdFwiXSAmJiBldmFsdWF0ZShlbCwgcmVhY3RpdmVEYXRhW1wiaW5pdFwiXSk7XG4gIGNsZWFudXAyKCgpID0+IHtcbiAgICByZWFjdGl2ZURhdGFbXCJkZXN0cm95XCJdICYmIGV2YWx1YXRlKGVsLCByZWFjdGl2ZURhdGFbXCJkZXN0cm95XCJdKTtcbiAgICB1bmRvKCk7XG4gIH0pO1xufSk7XG5pbnRlcmNlcHRDbG9uZSgoZnJvbSwgdG8pID0+IHtcbiAgaWYgKGZyb20uX3hfZGF0YVN0YWNrKSB7XG4gICAgdG8uX3hfZGF0YVN0YWNrID0gZnJvbS5feF9kYXRhU3RhY2s7XG4gICAgdG8uc2V0QXR0cmlidXRlKFwiZGF0YS1oYXMtYWxwaW5lLXN0YXRlXCIsIHRydWUpO1xuICB9XG59KTtcbmZ1bmN0aW9uIHNob3VsZFNraXBSZWdpc3RlcmluZ0RhdGFEdXJpbmdDbG9uZShlbCkge1xuICBpZiAoIWlzQ2xvbmluZylcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmIChpc0Nsb25pbmdMZWdhY3kpXG4gICAgcmV0dXJuIHRydWU7XG4gIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWhhcy1hbHBpbmUtc3RhdGVcIik7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtc2hvdy5qc1xuZGlyZWN0aXZlKFwic2hvd1wiLCAoZWwsIHsgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzIH0pID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIoZWwsIGV4cHJlc3Npb24pO1xuICBpZiAoIWVsLl94X2RvSGlkZSlcbiAgICBlbC5feF9kb0hpZGUgPSAoKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eShcImRpc3BsYXlcIiwgXCJub25lXCIsIG1vZGlmaWVycy5pbmNsdWRlcyhcImltcG9ydGFudFwiKSA/IFwiaW1wb3J0YW50XCIgOiB2b2lkIDApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgaWYgKCFlbC5feF9kb1Nob3cpXG4gICAgZWwuX3hfZG9TaG93ID0gKCkgPT4ge1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgaWYgKGVsLnN0eWxlLmxlbmd0aCA9PT0gMSAmJiBlbC5zdHlsZS5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiZGlzcGxheVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgbGV0IGhpZGUgPSAoKSA9PiB7XG4gICAgZWwuX3hfZG9IaWRlKCk7XG4gICAgZWwuX3hfaXNTaG93biA9IGZhbHNlO1xuICB9O1xuICBsZXQgc2hvdyA9ICgpID0+IHtcbiAgICBlbC5feF9kb1Nob3coKTtcbiAgICBlbC5feF9pc1Nob3duID0gdHJ1ZTtcbiAgfTtcbiAgbGV0IGNsaWNrQXdheUNvbXBhdGlibGVTaG93ID0gKCkgPT4gc2V0VGltZW91dChzaG93KTtcbiAgbGV0IHRvZ2dsZSA9IG9uY2UoXG4gICAgKHZhbHVlKSA9PiB2YWx1ZSA/IHNob3coKSA6IGhpZGUoKSxcbiAgICAodmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZWwuX3hfdG9nZ2xlQW5kQ2FzY2FkZVdpdGhUcmFuc2l0aW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGVsLl94X3RvZ2dsZUFuZENhc2NhZGVXaXRoVHJhbnNpdGlvbnMoZWwsIHZhbHVlLCBzaG93LCBoaWRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID8gY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKSA6IGhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG4gIGxldCBvbGRWYWx1ZTtcbiAgbGV0IGZpcnN0VGltZSA9IHRydWU7XG4gIGVmZmVjdDMoKCkgPT4gZXZhbHVhdGUyKCh2YWx1ZSkgPT4ge1xuICAgIGlmICghZmlyc3RUaW1lICYmIHZhbHVlID09PSBvbGRWYWx1ZSlcbiAgICAgIHJldHVybjtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiaW1tZWRpYXRlXCIpKVxuICAgICAgdmFsdWUgPyBjbGlja0F3YXlDb21wYXRpYmxlU2hvdygpIDogaGlkZSgpO1xuICAgIHRvZ2dsZSh2YWx1ZSk7XG4gICAgb2xkVmFsdWUgPSB2YWx1ZTtcbiAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgfSkpO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtZm9yLmpzXG5kaXJlY3RpdmUoXCJmb3JcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgbGV0IGl0ZXJhdG9yTmFtZXMgPSBwYXJzZUZvckV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG4gIGxldCBldmFsdWF0ZUl0ZW1zID0gZXZhbHVhdGVMYXRlcihlbCwgaXRlcmF0b3JOYW1lcy5pdGVtcyk7XG4gIGxldCBldmFsdWF0ZUtleSA9IGV2YWx1YXRlTGF0ZXIoXG4gICAgZWwsXG4gICAgLy8gdGhlIHgtYmluZDprZXkgZXhwcmVzc2lvbiBpcyBzdG9yZWQgZm9yIG91ciB1c2UgaW5zdGVhZCBvZiBldmFsdWF0ZWQuXG4gICAgZWwuX3hfa2V5RXhwcmVzc2lvbiB8fCBcImluZGV4XCJcbiAgKTtcbiAgZWwuX3hfcHJldktleXMgPSBbXTtcbiAgZWwuX3hfbG9va3VwID0ge307XG4gIGVmZmVjdDMoKCkgPT4gbG9vcChlbCwgaXRlcmF0b3JOYW1lcywgZXZhbHVhdGVJdGVtcywgZXZhbHVhdGVLZXkpKTtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIE9iamVjdC52YWx1ZXMoZWwuX3hfbG9va3VwKS5mb3JFYWNoKChlbDIpID0+IG11dGF0ZURvbShcbiAgICAgICgpID0+IHtcbiAgICAgICAgZGVzdHJveVRyZWUoZWwyKTtcbiAgICAgICAgZWwyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICkpO1xuICAgIGRlbGV0ZSBlbC5feF9wcmV2S2V5cztcbiAgICBkZWxldGUgZWwuX3hfbG9va3VwO1xuICB9KTtcbn0pO1xuZnVuY3Rpb24gbG9vcChlbCwgaXRlcmF0b3JOYW1lcywgZXZhbHVhdGVJdGVtcywgZXZhbHVhdGVLZXkpIHtcbiAgbGV0IGlzT2JqZWN0MiA9IChpKSA9PiB0eXBlb2YgaSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShpKTtcbiAgbGV0IHRlbXBsYXRlRWwgPSBlbDtcbiAgZXZhbHVhdGVJdGVtcygoaXRlbXMpID0+IHtcbiAgICBpZiAoaXNOdW1lcmljMyhpdGVtcykgJiYgaXRlbXMgPj0gMCkge1xuICAgICAgaXRlbXMgPSBBcnJheS5mcm9tKEFycmF5KGl0ZW1zKS5rZXlzKCksIChpKSA9PiBpICsgMSk7XG4gICAgfVxuICAgIGlmIChpdGVtcyA9PT0gdm9pZCAwKVxuICAgICAgaXRlbXMgPSBbXTtcbiAgICBsZXQgbG9va3VwID0gZWwuX3hfbG9va3VwO1xuICAgIGxldCBwcmV2S2V5cyA9IGVsLl94X3ByZXZLZXlzO1xuICAgIGxldCBzY29wZXMgPSBbXTtcbiAgICBsZXQga2V5cyA9IFtdO1xuICAgIGlmIChpc09iamVjdDIoaXRlbXMpKSB7XG4gICAgICBpdGVtcyA9IE9iamVjdC5lbnRyaWVzKGl0ZW1zKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBsZXQgc2NvcGUyID0gZ2V0SXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMoaXRlcmF0b3JOYW1lcywgdmFsdWUsIGtleSwgaXRlbXMpO1xuICAgICAgICBldmFsdWF0ZUtleSgodmFsdWUyKSA9PiB7XG4gICAgICAgICAgaWYgKGtleXMuaW5jbHVkZXModmFsdWUyKSlcbiAgICAgICAgICAgIHdhcm4oXCJEdXBsaWNhdGUga2V5IG9uIHgtZm9yXCIsIGVsKTtcbiAgICAgICAgICBrZXlzLnB1c2godmFsdWUyKTtcbiAgICAgICAgfSwgeyBzY29wZTogeyBpbmRleDoga2V5LCAuLi5zY29wZTIgfSB9KTtcbiAgICAgICAgc2NvcGVzLnB1c2goc2NvcGUyKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzY29wZTIgPSBnZXRJdGVyYXRpb25TY29wZVZhcmlhYmxlcyhpdGVyYXRvck5hbWVzLCBpdGVtc1tpXSwgaSwgaXRlbXMpO1xuICAgICAgICBldmFsdWF0ZUtleSgodmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAoa2V5cy5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICAgICAgICB3YXJuKFwiRHVwbGljYXRlIGtleSBvbiB4LWZvclwiLCBlbCk7XG4gICAgICAgICAga2V5cy5wdXNoKHZhbHVlKTtcbiAgICAgICAgfSwgeyBzY29wZTogeyBpbmRleDogaSwgLi4uc2NvcGUyIH0gfSk7XG4gICAgICAgIHNjb3Blcy5wdXNoKHNjb3BlMik7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBhZGRzID0gW107XG4gICAgbGV0IG1vdmVzID0gW107XG4gICAgbGV0IHJlbW92ZXMgPSBbXTtcbiAgICBsZXQgc2FtZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0gcHJldktleXNbaV07XG4gICAgICBpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKVxuICAgICAgICByZW1vdmVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcHJldktleXMgPSBwcmV2S2V5cy5maWx0ZXIoKGtleSkgPT4gIXJlbW92ZXMuaW5jbHVkZXMoa2V5KSk7XG4gICAgbGV0IGxhc3RLZXkgPSBcInRlbXBsYXRlXCI7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0ga2V5c1tpXTtcbiAgICAgIGxldCBwcmV2SW5kZXggPSBwcmV2S2V5cy5pbmRleE9mKGtleSk7XG4gICAgICBpZiAocHJldkluZGV4ID09PSAtMSkge1xuICAgICAgICBwcmV2S2V5cy5zcGxpY2UoaSwgMCwga2V5KTtcbiAgICAgICAgYWRkcy5wdXNoKFtsYXN0S2V5LCBpXSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZJbmRleCAhPT0gaSkge1xuICAgICAgICBsZXQga2V5SW5TcG90ID0gcHJldktleXMuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICBsZXQga2V5Rm9yU3BvdCA9IHByZXZLZXlzLnNwbGljZShwcmV2SW5kZXggLSAxLCAxKVswXTtcbiAgICAgICAgcHJldktleXMuc3BsaWNlKGksIDAsIGtleUZvclNwb3QpO1xuICAgICAgICBwcmV2S2V5cy5zcGxpY2UocHJldkluZGV4LCAwLCBrZXlJblNwb3QpO1xuICAgICAgICBtb3Zlcy5wdXNoKFtrZXlJblNwb3QsIGtleUZvclNwb3RdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNhbWVzLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICAgIGxhc3RLZXkgPSBrZXk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGtleSA9IHJlbW92ZXNbaV07XG4gICAgICBpZiAoIShrZXkgaW4gbG9va3VwKSlcbiAgICAgICAgY29udGludWU7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBkZXN0cm95VHJlZShsb29rdXBba2V5XSk7XG4gICAgICAgIGxvb2t1cFtrZXldLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgICBkZWxldGUgbG9va3VwW2tleV07XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBba2V5SW5TcG90LCBrZXlGb3JTcG90XSA9IG1vdmVzW2ldO1xuICAgICAgbGV0IGVsSW5TcG90ID0gbG9va3VwW2tleUluU3BvdF07XG4gICAgICBsZXQgZWxGb3JTcG90ID0gbG9va3VwW2tleUZvclNwb3RdO1xuICAgICAgbGV0IG1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBpZiAoIWVsRm9yU3BvdClcbiAgICAgICAgICB3YXJuKGB4LWZvciBcIjprZXlcIiBpcyB1bmRlZmluZWQgb3IgaW52YWxpZGAsIHRlbXBsYXRlRWwsIGtleUZvclNwb3QsIGxvb2t1cCk7XG4gICAgICAgIGVsRm9yU3BvdC5hZnRlcihtYXJrZXIpO1xuICAgICAgICBlbEluU3BvdC5hZnRlcihlbEZvclNwb3QpO1xuICAgICAgICBlbEZvclNwb3QuX3hfY3VycmVudElmRWwgJiYgZWxGb3JTcG90LmFmdGVyKGVsRm9yU3BvdC5feF9jdXJyZW50SWZFbCk7XG4gICAgICAgIG1hcmtlci5iZWZvcmUoZWxJblNwb3QpO1xuICAgICAgICBlbEluU3BvdC5feF9jdXJyZW50SWZFbCAmJiBlbEluU3BvdC5hZnRlcihlbEluU3BvdC5feF9jdXJyZW50SWZFbCk7XG4gICAgICAgIG1hcmtlci5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgICAgZWxGb3JTcG90Ll94X3JlZnJlc2hYRm9yU2NvcGUoc2NvcGVzW2tleXMuaW5kZXhPZihrZXlGb3JTcG90KV0pO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBbbGFzdEtleTIsIGluZGV4XSA9IGFkZHNbaV07XG4gICAgICBsZXQgbGFzdEVsID0gbGFzdEtleTIgPT09IFwidGVtcGxhdGVcIiA/IHRlbXBsYXRlRWwgOiBsb29rdXBbbGFzdEtleTJdO1xuICAgICAgaWYgKGxhc3RFbC5feF9jdXJyZW50SWZFbClcbiAgICAgICAgbGFzdEVsID0gbGFzdEVsLl94X2N1cnJlbnRJZkVsO1xuICAgICAgbGV0IHNjb3BlMiA9IHNjb3Blc1tpbmRleF07XG4gICAgICBsZXQga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICBsZXQgY2xvbmUyID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZUVsLmNvbnRlbnQsIHRydWUpLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgbGV0IHJlYWN0aXZlU2NvcGUgPSByZWFjdGl2ZShzY29wZTIpO1xuICAgICAgYWRkU2NvcGVUb05vZGUoY2xvbmUyLCByZWFjdGl2ZVNjb3BlLCB0ZW1wbGF0ZUVsKTtcbiAgICAgIGNsb25lMi5feF9yZWZyZXNoWEZvclNjb3BlID0gKG5ld1Njb3BlKSA9PiB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG5ld1Njb3BlKS5mb3JFYWNoKChba2V5MiwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgcmVhY3RpdmVTY29wZVtrZXkyXSA9IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBsYXN0RWwuYWZ0ZXIoY2xvbmUyKTtcbiAgICAgICAgc2tpcER1cmluZ0Nsb25lKCgpID0+IGluaXRUcmVlKGNsb25lMikpKCk7XG4gICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHdhcm4oXCJ4LWZvciBrZXkgY2Fubm90IGJlIGFuIG9iamVjdCwgaXQgbXVzdCBiZSBhIHN0cmluZyBvciBhbiBpbnRlZ2VyXCIsIHRlbXBsYXRlRWwpO1xuICAgICAgfVxuICAgICAgbG9va3VwW2tleV0gPSBjbG9uZTI7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2FtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxvb2t1cFtzYW1lc1tpXV0uX3hfcmVmcmVzaFhGb3JTY29wZShzY29wZXNba2V5cy5pbmRleE9mKHNhbWVzW2ldKV0pO1xuICAgIH1cbiAgICB0ZW1wbGF0ZUVsLl94X3ByZXZLZXlzID0ga2V5cztcbiAgfSk7XG59XG5mdW5jdGlvbiBwYXJzZUZvckV4cHJlc3Npb24oZXhwcmVzc2lvbikge1xuICBsZXQgZm9ySXRlcmF0b3JSRSA9IC8sKFteLFxcfVxcXV0qKSg/OiwoW14sXFx9XFxdXSopKT8kLztcbiAgbGV0IHN0cmlwUGFyZW5zUkUgPSAvXlxccypcXCh8XFwpXFxzKiQvZztcbiAgbGV0IGZvckFsaWFzUkUgPSAvKFtcXHNcXFNdKj8pXFxzKyg/OmlufG9mKVxccysoW1xcc1xcU10qKS87XG4gIGxldCBpbk1hdGNoID0gZXhwcmVzc2lvbi5tYXRjaChmb3JBbGlhc1JFKTtcbiAgaWYgKCFpbk1hdGNoKVxuICAgIHJldHVybjtcbiAgbGV0IHJlcyA9IHt9O1xuICByZXMuaXRlbXMgPSBpbk1hdGNoWzJdLnRyaW0oKTtcbiAgbGV0IGl0ZW0gPSBpbk1hdGNoWzFdLnJlcGxhY2Uoc3RyaXBQYXJlbnNSRSwgXCJcIikudHJpbSgpO1xuICBsZXQgaXRlcmF0b3JNYXRjaCA9IGl0ZW0ubWF0Y2goZm9ySXRlcmF0b3JSRSk7XG4gIGlmIChpdGVyYXRvck1hdGNoKSB7XG4gICAgcmVzLml0ZW0gPSBpdGVtLnJlcGxhY2UoZm9ySXRlcmF0b3JSRSwgXCJcIikudHJpbSgpO1xuICAgIHJlcy5pbmRleCA9IGl0ZXJhdG9yTWF0Y2hbMV0udHJpbSgpO1xuICAgIGlmIChpdGVyYXRvck1hdGNoWzJdKSB7XG4gICAgICByZXMuY29sbGVjdGlvbiA9IGl0ZXJhdG9yTWF0Y2hbMl0udHJpbSgpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXMuaXRlbSA9IGl0ZW07XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbmZ1bmN0aW9uIGdldEl0ZXJhdGlvblNjb3BlVmFyaWFibGVzKGl0ZXJhdG9yTmFtZXMsIGl0ZW0sIGluZGV4LCBpdGVtcykge1xuICBsZXQgc2NvcGVWYXJpYWJsZXMgPSB7fTtcbiAgaWYgKC9eXFxbLipcXF0kLy50ZXN0KGl0ZXJhdG9yTmFtZXMuaXRlbSkgJiYgQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgIGxldCBuYW1lcyA9IGl0ZXJhdG9yTmFtZXMuaXRlbS5yZXBsYWNlKFwiW1wiLCBcIlwiKS5yZXBsYWNlKFwiXVwiLCBcIlwiKS5zcGxpdChcIixcIikubWFwKChpKSA9PiBpLnRyaW0oKSk7XG4gICAgbmFtZXMuZm9yRWFjaCgobmFtZSwgaSkgPT4ge1xuICAgICAgc2NvcGVWYXJpYWJsZXNbbmFtZV0gPSBpdGVtW2ldO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKC9eXFx7LipcXH0kLy50ZXN0KGl0ZXJhdG9yTmFtZXMuaXRlbSkgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgdHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIpIHtcbiAgICBsZXQgbmFtZXMgPSBpdGVyYXRvck5hbWVzLml0ZW0ucmVwbGFjZShcIntcIiwgXCJcIikucmVwbGFjZShcIn1cIiwgXCJcIikuc3BsaXQoXCIsXCIpLm1hcCgoaSkgPT4gaS50cmltKCkpO1xuICAgIG5hbWVzLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIHNjb3BlVmFyaWFibGVzW25hbWVdID0gaXRlbVtuYW1lXTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBzY29wZVZhcmlhYmxlc1tpdGVyYXRvck5hbWVzLml0ZW1dID0gaXRlbTtcbiAgfVxuICBpZiAoaXRlcmF0b3JOYW1lcy5pbmRleClcbiAgICBzY29wZVZhcmlhYmxlc1tpdGVyYXRvck5hbWVzLmluZGV4XSA9IGluZGV4O1xuICBpZiAoaXRlcmF0b3JOYW1lcy5jb2xsZWN0aW9uKVxuICAgIHNjb3BlVmFyaWFibGVzW2l0ZXJhdG9yTmFtZXMuY29sbGVjdGlvbl0gPSBpdGVtcztcbiAgcmV0dXJuIHNjb3BlVmFyaWFibGVzO1xufVxuZnVuY3Rpb24gaXNOdW1lcmljMyhzdWJqZWN0KSB7XG4gIHJldHVybiAhQXJyYXkuaXNBcnJheShzdWJqZWN0KSAmJiAhaXNOYU4oc3ViamVjdCk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtcmVmLmpzXG5mdW5jdGlvbiBoYW5kbGVyMygpIHtcbn1cbmhhbmRsZXIzLmlubGluZSA9IChlbCwgeyBleHByZXNzaW9uIH0sIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgcm9vdCA9IGNsb3Nlc3RSb290KGVsKTtcbiAgaWYgKCFyb290Ll94X3JlZnMpXG4gICAgcm9vdC5feF9yZWZzID0ge307XG4gIHJvb3QuX3hfcmVmc1tleHByZXNzaW9uXSA9IGVsO1xuICBjbGVhbnVwMigoKSA9PiBkZWxldGUgcm9vdC5feF9yZWZzW2V4cHJlc3Npb25dKTtcbn07XG5kaXJlY3RpdmUoXCJyZWZcIiwgaGFuZGxlcjMpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWlmLmpzXG5kaXJlY3RpdmUoXCJpZlwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcInRlbXBsYXRlXCIpXG4gICAgd2FybihcIngtaWYgY2FuIG9ubHkgYmUgdXNlZCBvbiBhIDx0ZW1wbGF0ZT4gdGFnXCIsIGVsKTtcbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIoZWwsIGV4cHJlc3Npb24pO1xuICBsZXQgc2hvdyA9ICgpID0+IHtcbiAgICBpZiAoZWwuX3hfY3VycmVudElmRWwpXG4gICAgICByZXR1cm4gZWwuX3hfY3VycmVudElmRWw7XG4gICAgbGV0IGNsb25lMiA9IGVsLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIGFkZFNjb3BlVG9Ob2RlKGNsb25lMiwge30sIGVsKTtcbiAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgZWwuYWZ0ZXIoY2xvbmUyKTtcbiAgICAgIHNraXBEdXJpbmdDbG9uZSgoKSA9PiBpbml0VHJlZShjbG9uZTIpKSgpO1xuICAgIH0pO1xuICAgIGVsLl94X2N1cnJlbnRJZkVsID0gY2xvbmUyO1xuICAgIGVsLl94X3VuZG9JZiA9ICgpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGRlc3Ryb3lUcmVlKGNsb25lMik7XG4gICAgICAgIGNsb25lMi5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgICAgZGVsZXRlIGVsLl94X2N1cnJlbnRJZkVsO1xuICAgIH07XG4gICAgcmV0dXJuIGNsb25lMjtcbiAgfTtcbiAgbGV0IGhpZGUgPSAoKSA9PiB7XG4gICAgaWYgKCFlbC5feF91bmRvSWYpXG4gICAgICByZXR1cm47XG4gICAgZWwuX3hfdW5kb0lmKCk7XG4gICAgZGVsZXRlIGVsLl94X3VuZG9JZjtcbiAgfTtcbiAgZWZmZWN0MygoKSA9PiBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgdmFsdWUgPyBzaG93KCkgOiBoaWRlKCk7XG4gIH0pKTtcbiAgY2xlYW51cDIoKCkgPT4gZWwuX3hfdW5kb0lmICYmIGVsLl94X3VuZG9JZigpKTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWlkLmpzXG5kaXJlY3RpdmUoXCJpZFwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGV2YWx1YXRlOiBldmFsdWF0ZTIgfSkgPT4ge1xuICBsZXQgbmFtZXMgPSBldmFsdWF0ZTIoZXhwcmVzc2lvbik7XG4gIG5hbWVzLmZvckVhY2goKG5hbWUpID0+IHNldElkUm9vdChlbCwgbmFtZSkpO1xufSk7XG5pbnRlcmNlcHRDbG9uZSgoZnJvbSwgdG8pID0+IHtcbiAgaWYgKGZyb20uX3hfaWRzKSB7XG4gICAgdG8uX3hfaWRzID0gZnJvbS5feF9pZHM7XG4gIH1cbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LW9uLmpzXG5tYXBBdHRyaWJ1dGVzKHN0YXJ0aW5nV2l0aChcIkBcIiwgaW50byhwcmVmaXgoXCJvbjpcIikpKSk7XG5kaXJlY3RpdmUoXCJvblwiLCBza2lwRHVyaW5nQ2xvbmUoKGVsLCB7IHZhbHVlLCBtb2RpZmllcnMsIGV4cHJlc3Npb24gfSwgeyBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBleHByZXNzaW9uID8gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbikgOiAoKSA9PiB7XG4gIH07XG4gIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwidGVtcGxhdGVcIikge1xuICAgIGlmICghZWwuX3hfZm9yd2FyZEV2ZW50cylcbiAgICAgIGVsLl94X2ZvcndhcmRFdmVudHMgPSBbXTtcbiAgICBpZiAoIWVsLl94X2ZvcndhcmRFdmVudHMuaW5jbHVkZXModmFsdWUpKVxuICAgICAgZWwuX3hfZm9yd2FyZEV2ZW50cy5wdXNoKHZhbHVlKTtcbiAgfVxuICBsZXQgcmVtb3ZlTGlzdGVuZXIgPSBvbihlbCwgdmFsdWUsIG1vZGlmaWVycywgKGUpID0+IHtcbiAgICBldmFsdWF0ZTIoKCkgPT4ge1xuICAgIH0sIHsgc2NvcGU6IHsgXCIkZXZlbnRcIjogZSB9LCBwYXJhbXM6IFtlXSB9KTtcbiAgfSk7XG4gIGNsZWFudXAyKCgpID0+IHJlbW92ZUxpc3RlbmVyKCkpO1xufSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy9pbmRleC5qc1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJDb2xsYXBzZVwiLCBcImNvbGxhcHNlXCIsIFwiY29sbGFwc2VcIik7XG53YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShcIkludGVyc2VjdFwiLCBcImludGVyc2VjdFwiLCBcImludGVyc2VjdFwiKTtcbndhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKFwiRm9jdXNcIiwgXCJ0cmFwXCIsIFwiZm9jdXNcIik7XG53YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShcIk1hc2tcIiwgXCJtYXNrXCIsIFwibWFza1wiKTtcbmZ1bmN0aW9uIHdhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKG5hbWUsIGRpcmVjdGl2ZU5hbWUsIHNsdWcpIHtcbiAgZGlyZWN0aXZlKGRpcmVjdGl2ZU5hbWUsIChlbCkgPT4gd2FybihgWW91IGNhbid0IHVzZSBbeC0ke2RpcmVjdGl2ZU5hbWV9XSB3aXRob3V0IGZpcnN0IGluc3RhbGxpbmcgdGhlIFwiJHtuYW1lfVwiIHBsdWdpbiBoZXJlOiBodHRwczovL2FscGluZWpzLmRldi9wbHVnaW5zLyR7c2x1Z31gLCBlbCkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvaW5kZXguanNcbmFscGluZV9kZWZhdWx0LnNldEV2YWx1YXRvcihub3JtYWxFdmFsdWF0b3IpO1xuYWxwaW5lX2RlZmF1bHQuc2V0UmVhY3Rpdml0eUVuZ2luZSh7IHJlYWN0aXZlOiByZWFjdGl2ZTIsIGVmZmVjdDogZWZmZWN0MiwgcmVsZWFzZTogc3RvcCwgcmF3OiB0b1JhdyB9KTtcbnZhciBzcmNfZGVmYXVsdCA9IGFscGluZV9kZWZhdWx0O1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9idWlsZHMvbW9kdWxlLmpzXG52YXIgbW9kdWxlX2RlZmF1bHQgPSBzcmNfZGVmYXVsdDtcbmV4cG9ydCB7XG4gIHNyY19kZWZhdWx0IGFzIEFscGluZSxcbiAgbW9kdWxlX2RlZmF1bHQgYXMgZGVmYXVsdFxufTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyBmcm9tIFwiLSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3RoZW1lcy5jc3NcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzFfX18gZnJvbSBcIi0hLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9mb250cy5jc3NcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzJfX18gZnJvbSBcIi0hLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi90ZXh0cy5jc3NcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzNfX18gZnJvbSBcIi0hLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbnB1dHMuY3NzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5pKF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5pKF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMV9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5pKF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMl9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5pKF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfM19fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCosIDo6YmVmb3JlLCA6OmFmdGVyIHtcbiAgLS10dy1ib3JkZXItc3BhY2luZy14OiAwO1xuICAtLXR3LWJvcmRlci1zcGFjaW5nLXk6IDA7XG4gIC0tdHctdHJhbnNsYXRlLXg6IDA7XG4gIC0tdHctdHJhbnNsYXRlLXk6IDA7XG4gIC0tdHctcm90YXRlOiAwO1xuICAtLXR3LXNrZXcteDogMDtcbiAgLS10dy1za2V3LXk6IDA7XG4gIC0tdHctc2NhbGUteDogMTtcbiAgLS10dy1zY2FsZS15OiAxO1xuICAtLXR3LXBhbi14OiAgO1xuICAtLXR3LXBhbi15OiAgO1xuICAtLXR3LXBpbmNoLXpvb206ICA7XG4gIC0tdHctc2Nyb2xsLXNuYXAtc3RyaWN0bmVzczogcHJveGltaXR5O1xuICAtLXR3LWdyYWRpZW50LWZyb20tcG9zaXRpb246ICA7XG4gIC0tdHctZ3JhZGllbnQtdmlhLXBvc2l0aW9uOiAgO1xuICAtLXR3LWdyYWRpZW50LXRvLXBvc2l0aW9uOiAgO1xuICAtLXR3LW9yZGluYWw6ICA7XG4gIC0tdHctc2xhc2hlZC16ZXJvOiAgO1xuICAtLXR3LW51bWVyaWMtZmlndXJlOiAgO1xuICAtLXR3LW51bWVyaWMtc3BhY2luZzogIDtcbiAgLS10dy1udW1lcmljLWZyYWN0aW9uOiAgO1xuICAtLXR3LXJpbmctaW5zZXQ6ICA7XG4gIC0tdHctcmluZy1vZmZzZXQtd2lkdGg6IDBweDtcbiAgLS10dy1yaW5nLW9mZnNldC1jb2xvcjogI2ZmZjtcbiAgLS10dy1yaW5nLWNvbG9yOiByZ2IoNTkgMTMwIDI0NiAvIDAuNSk7XG4gIC0tdHctcmluZy1vZmZzZXQtc2hhZG93OiAwIDAgIzAwMDA7XG4gIC0tdHctcmluZy1zaGFkb3c6IDAgMCAjMDAwMDtcbiAgLS10dy1zaGFkb3c6IDAgMCAjMDAwMDtcbiAgLS10dy1zaGFkb3ctY29sb3JlZDogMCAwICMwMDAwO1xuICAtLXR3LWJsdXI6ICA7XG4gIC0tdHctYnJpZ2h0bmVzczogIDtcbiAgLS10dy1jb250cmFzdDogIDtcbiAgLS10dy1ncmF5c2NhbGU6ICA7XG4gIC0tdHctaHVlLXJvdGF0ZTogIDtcbiAgLS10dy1pbnZlcnQ6ICA7XG4gIC0tdHctc2F0dXJhdGU6ICA7XG4gIC0tdHctc2VwaWE6ICA7XG4gIC0tdHctZHJvcC1zaGFkb3c6ICA7XG4gIC0tdHctYmFja2Ryb3AtYmx1cjogIDtcbiAgLS10dy1iYWNrZHJvcC1icmlnaHRuZXNzOiAgO1xuICAtLXR3LWJhY2tkcm9wLWNvbnRyYXN0OiAgO1xuICAtLXR3LWJhY2tkcm9wLWdyYXlzY2FsZTogIDtcbiAgLS10dy1iYWNrZHJvcC1odWUtcm90YXRlOiAgO1xuICAtLXR3LWJhY2tkcm9wLWludmVydDogIDtcbiAgLS10dy1iYWNrZHJvcC1vcGFjaXR5OiAgO1xuICAtLXR3LWJhY2tkcm9wLXNhdHVyYXRlOiAgO1xuICAtLXR3LWJhY2tkcm9wLXNlcGlhOiAgO1xuICAtLXR3LWNvbnRhaW4tc2l6ZTogIDtcbiAgLS10dy1jb250YWluLWxheW91dDogIDtcbiAgLS10dy1jb250YWluLXBhaW50OiAgO1xuICAtLXR3LWNvbnRhaW4tc3R5bGU6ICA7XG59XG5cbjo6YmFja2Ryb3Age1xuICAtLXR3LWJvcmRlci1zcGFjaW5nLXg6IDA7XG4gIC0tdHctYm9yZGVyLXNwYWNpbmcteTogMDtcbiAgLS10dy10cmFuc2xhdGUteDogMDtcbiAgLS10dy10cmFuc2xhdGUteTogMDtcbiAgLS10dy1yb3RhdGU6IDA7XG4gIC0tdHctc2tldy14OiAwO1xuICAtLXR3LXNrZXcteTogMDtcbiAgLS10dy1zY2FsZS14OiAxO1xuICAtLXR3LXNjYWxlLXk6IDE7XG4gIC0tdHctcGFuLXg6ICA7XG4gIC0tdHctcGFuLXk6ICA7XG4gIC0tdHctcGluY2gtem9vbTogIDtcbiAgLS10dy1zY3JvbGwtc25hcC1zdHJpY3RuZXNzOiBwcm94aW1pdHk7XG4gIC0tdHctZ3JhZGllbnQtZnJvbS1wb3NpdGlvbjogIDtcbiAgLS10dy1ncmFkaWVudC12aWEtcG9zaXRpb246ICA7XG4gIC0tdHctZ3JhZGllbnQtdG8tcG9zaXRpb246ICA7XG4gIC0tdHctb3JkaW5hbDogIDtcbiAgLS10dy1zbGFzaGVkLXplcm86ICA7XG4gIC0tdHctbnVtZXJpYy1maWd1cmU6ICA7XG4gIC0tdHctbnVtZXJpYy1zcGFjaW5nOiAgO1xuICAtLXR3LW51bWVyaWMtZnJhY3Rpb246ICA7XG4gIC0tdHctcmluZy1pbnNldDogIDtcbiAgLS10dy1yaW5nLW9mZnNldC13aWR0aDogMHB4O1xuICAtLXR3LXJpbmctb2Zmc2V0LWNvbG9yOiAjZmZmO1xuICAtLXR3LXJpbmctY29sb3I6IHJnYig1OSAxMzAgMjQ2IC8gMC41KTtcbiAgLS10dy1yaW5nLW9mZnNldC1zaGFkb3c6IDAgMCAjMDAwMDtcbiAgLS10dy1yaW5nLXNoYWRvdzogMCAwICMwMDAwO1xuICAtLXR3LXNoYWRvdzogMCAwICMwMDAwO1xuICAtLXR3LXNoYWRvdy1jb2xvcmVkOiAwIDAgIzAwMDA7XG4gIC0tdHctYmx1cjogIDtcbiAgLS10dy1icmlnaHRuZXNzOiAgO1xuICAtLXR3LWNvbnRyYXN0OiAgO1xuICAtLXR3LWdyYXlzY2FsZTogIDtcbiAgLS10dy1odWUtcm90YXRlOiAgO1xuICAtLXR3LWludmVydDogIDtcbiAgLS10dy1zYXR1cmF0ZTogIDtcbiAgLS10dy1zZXBpYTogIDtcbiAgLS10dy1kcm9wLXNoYWRvdzogIDtcbiAgLS10dy1iYWNrZHJvcC1ibHVyOiAgO1xuICAtLXR3LWJhY2tkcm9wLWJyaWdodG5lc3M6ICA7XG4gIC0tdHctYmFja2Ryb3AtY29udHJhc3Q6ICA7XG4gIC0tdHctYmFja2Ryb3AtZ3JheXNjYWxlOiAgO1xuICAtLXR3LWJhY2tkcm9wLWh1ZS1yb3RhdGU6ICA7XG4gIC0tdHctYmFja2Ryb3AtaW52ZXJ0OiAgO1xuICAtLXR3LWJhY2tkcm9wLW9wYWNpdHk6ICA7XG4gIC0tdHctYmFja2Ryb3Atc2F0dXJhdGU6ICA7XG4gIC0tdHctYmFja2Ryb3Atc2VwaWE6ICA7XG4gIC0tdHctY29udGFpbi1zaXplOiAgO1xuICAtLXR3LWNvbnRhaW4tbGF5b3V0OiAgO1xuICAtLXR3LWNvbnRhaW4tcGFpbnQ6ICA7XG4gIC0tdHctY29udGFpbi1zdHlsZTogIDtcbn0vKlxuISB0YWlsd2luZGNzcyB2My40LjE3IHwgTUlUIExpY2Vuc2UgfCBodHRwczovL3RhaWx3aW5kY3NzLmNvbVxuKi8vKlxuMS4gUHJldmVudCBwYWRkaW5nIGFuZCBib3JkZXIgZnJvbSBhZmZlY3RpbmcgZWxlbWVudCB3aWR0aC4gKGh0dHBzOi8vZ2l0aHViLmNvbS9tb3pkZXZzL2Nzc3JlbWVkeS9pc3N1ZXMvNClcbjIuIEFsbG93IGFkZGluZyBhIGJvcmRlciB0byBhbiBlbGVtZW50IGJ5IGp1c3QgYWRkaW5nIGEgYm9yZGVyLXdpZHRoLiAoaHR0cHM6Ly9naXRodWIuY29tL3RhaWx3aW5kY3NzL3RhaWx3aW5kY3NzL3B1bGwvMTE2KVxuKi9cblxuKixcbjo6YmVmb3JlLFxuOjphZnRlciB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cbiAgYm9yZGVyLXdpZHRoOiAwOyAvKiAyICovXG4gIGJvcmRlci1zdHlsZTogc29saWQ7IC8qIDIgKi9cbiAgYm9yZGVyLWNvbG9yOiAjZTVlN2ViOyAvKiAyICovXG59XG5cbjo6YmVmb3JlLFxuOjphZnRlciB7XG4gIC0tdHctY29udGVudDogJyc7XG59XG5cbi8qXG4xLiBVc2UgYSBjb25zaXN0ZW50IHNlbnNpYmxlIGxpbmUtaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cbjIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxuMy4gVXNlIGEgbW9yZSByZWFkYWJsZSB0YWIgc2l6ZS5cbjQuIFVzZSB0aGUgdXNlcidzIGNvbmZpZ3VyZWQgXFxgc2Fuc1xcYCBmb250LWZhbWlseSBieSBkZWZhdWx0LlxuNS4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBcXGBzYW5zXFxgIGZvbnQtZmVhdHVyZS1zZXR0aW5ncyBieSBkZWZhdWx0LlxuNi4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBcXGBzYW5zXFxgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzIGJ5IGRlZmF1bHQuXG43LiBEaXNhYmxlIHRhcCBoaWdobGlnaHRzIG9uIGlPU1xuKi9cblxuaHRtbCxcbjpob3N0IHtcbiAgbGluZS1oZWlnaHQ6IDEuNTsgLyogMSAqL1xuICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cbiAgLW1vei10YWItc2l6ZTogNDsgLyogMyAqL1xuICAtby10YWItc2l6ZTogNDtcbiAgICAgdGFiLXNpemU6IDQ7IC8qIDMgKi9cbiAgZm9udC1mYW1pbHk6IHVpLXNhbnMtc2VyaWYsIHN5c3RlbS11aSwgc2Fucy1zZXJpZiwgXCJBcHBsZSBDb2xvciBFbW9qaVwiLCBcIlNlZ29lIFVJIEVtb2ppXCIsIFwiU2Vnb2UgVUkgU3ltYm9sXCIsIFwiTm90byBDb2xvciBFbW9qaVwiOyAvKiA0ICovXG4gIGZvbnQtZmVhdHVyZS1zZXR0aW5nczogbm9ybWFsOyAvKiA1ICovXG4gIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOiBub3JtYWw7IC8qIDYgKi9cbiAgLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOiB0cmFuc3BhcmVudDsgLyogNyAqL1xufVxuXG4vKlxuMS4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxuMi4gSW5oZXJpdCBsaW5lLWhlaWdodCBmcm9tIFxcYGh0bWxcXGAgc28gdXNlcnMgY2FuIHNldCB0aGVtIGFzIGEgY2xhc3MgZGlyZWN0bHkgb24gdGhlIFxcYGh0bWxcXGAgZWxlbWVudC5cbiovXG5cbmJvZHkge1xuICBtYXJnaW46IDA7IC8qIDEgKi9cbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7IC8qIDIgKi9cbn1cblxuLypcbjEuIEFkZCB0aGUgY29ycmVjdCBoZWlnaHQgaW4gRmlyZWZveC5cbjIuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIG9mIGJvcmRlciBjb2xvciBpbiBGaXJlZm94LiAoaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTkwNjU1KVxuMy4gRW5zdXJlIGhvcml6b250YWwgcnVsZXMgYXJlIHZpc2libGUgYnkgZGVmYXVsdC5cbiovXG5cbmhyIHtcbiAgaGVpZ2h0OiAwOyAvKiAxICovXG4gIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXG4gIGJvcmRlci10b3Atd2lkdGg6IDFweDsgLyogMyAqL1xufVxuXG4vKlxuQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4qL1xuXG5hYmJyOndoZXJlKFt0aXRsZV0pIHtcbiAgLXdlYmtpdC10ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7XG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkO1xufVxuXG4vKlxuUmVtb3ZlIHRoZSBkZWZhdWx0IGZvbnQgc2l6ZSBhbmQgd2VpZ2h0IGZvciBoZWFkaW5ncy5cbiovXG5cbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNiB7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XG59XG5cbi8qXG5SZXNldCBsaW5rcyB0byBvcHRpbWl6ZSBmb3Igb3B0LWluIHN0eWxpbmcgaW5zdGVhZCBvZiBvcHQtb3V0LlxuKi9cblxuYSB7XG4gIGNvbG9yOiBpbmhlcml0O1xuICB0ZXh0LWRlY29yYXRpb246IGluaGVyaXQ7XG59XG5cbi8qXG5BZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gRWRnZSBhbmQgU2FmYXJpLlxuKi9cblxuYixcbnN0cm9uZyB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qXG4xLiBVc2UgdGhlIHVzZXIncyBjb25maWd1cmVkIFxcYG1vbm9cXGAgZm9udC1mYW1pbHkgYnkgZGVmYXVsdC5cbjIuIFVzZSB0aGUgdXNlcidzIGNvbmZpZ3VyZWQgXFxgbW9ub1xcYCBmb250LWZlYXR1cmUtc2V0dGluZ3MgYnkgZGVmYXVsdC5cbjMuIFVzZSB0aGUgdXNlcidzIGNvbmZpZ3VyZWQgXFxgbW9ub1xcYCBmb250LXZhcmlhdGlvbi1zZXR0aW5ncyBieSBkZWZhdWx0LlxuNC4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiovXG5cbmNvZGUsXG5rYmQsXG5zYW1wLFxucHJlIHtcbiAgZm9udC1mYW1pbHk6IHVpLW1vbm9zcGFjZSwgU0ZNb25vLVJlZ3VsYXIsIE1lbmxvLCBNb25hY28sIENvbnNvbGFzLCBcIkxpYmVyYXRpb24gTW9ub1wiLCBcIkNvdXJpZXIgTmV3XCIsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LWZlYXR1cmUtc2V0dGluZ3M6IG5vcm1hbDsgLyogMiAqL1xuICBmb250LXZhcmlhdGlvbi1zZXR0aW5nczogbm9ybWFsOyAvKiAzICovXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiA0ICovXG59XG5cbi8qXG5BZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiovXG5cbnNtYWxsIHtcbiAgZm9udC1zaXplOiA4MCU7XG59XG5cbi8qXG5QcmV2ZW50IFxcYHN1YlxcYCBhbmQgXFxgc3VwXFxgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4qL1xuXG5zdWIsXG5zdXAge1xuICBmb250LXNpemU6IDc1JTtcbiAgbGluZS1oZWlnaHQ6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuICBib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG4gIHRvcDogLTAuNWVtO1xufVxuXG4vKlxuMS4gUmVtb3ZlIHRleHQgaW5kZW50YXRpb24gZnJvbSB0YWJsZSBjb250ZW50cyBpbiBDaHJvbWUgYW5kIFNhZmFyaS4gKGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTk5OTA4OCwgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTIwMTI5NylcbjIuIENvcnJlY3QgdGFibGUgYm9yZGVyIGNvbG9yIGluaGVyaXRhbmNlIGluIGFsbCBDaHJvbWUgYW5kIFNhZmFyaS4gKGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTkzNTcyOSwgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE5NTAxNilcbjMuIFJlbW92ZSBnYXBzIGJldHdlZW4gdGFibGUgYm9yZGVycyBieSBkZWZhdWx0LlxuKi9cblxudGFibGUge1xuICB0ZXh0LWluZGVudDogMDsgLyogMSAqL1xuICBib3JkZXItY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsgLyogMyAqL1xufVxuXG4vKlxuMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXG4yLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXG4zLiBSZW1vdmUgZGVmYXVsdCBwYWRkaW5nIGluIGFsbCBicm93c2Vycy5cbiovXG5cbmJ1dHRvbixcbmlucHV0LFxub3B0Z3JvdXAsXG5zZWxlY3QsXG50ZXh0YXJlYSB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtZmVhdHVyZS1zZXR0aW5nczogaW5oZXJpdDsgLyogMSAqL1xuICBmb250LXZhcmlhdGlvbi1zZXR0aW5nczogaW5oZXJpdDsgLyogMSAqL1xuICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cbiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7IC8qIDEgKi9cbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7IC8qIDEgKi9cbiAgbGV0dGVyLXNwYWNpbmc6IGluaGVyaXQ7IC8qIDEgKi9cbiAgY29sb3I6IGluaGVyaXQ7IC8qIDEgKi9cbiAgbWFyZ2luOiAwOyAvKiAyICovXG4gIHBhZGRpbmc6IDA7IC8qIDMgKi9cbn1cblxuLypcblJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSBhbmQgRmlyZWZveC5cbiovXG5cbmJ1dHRvbixcbnNlbGVjdCB7XG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG4vKlxuMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbjIuIFJlbW92ZSBkZWZhdWx0IGJ1dHRvbiBzdHlsZXMuXG4qL1xuXG5idXR0b24sXG5pbnB1dDp3aGVyZShbdHlwZT0nYnV0dG9uJ10pLFxuaW5wdXQ6d2hlcmUoW3R5cGU9J3Jlc2V0J10pLFxuaW5wdXQ6d2hlcmUoW3R5cGU9J3N1Ym1pdCddKSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50OyAvKiAyICovXG4gIGJhY2tncm91bmQtaW1hZ2U6IG5vbmU7IC8qIDIgKi9cbn1cblxuLypcblVzZSB0aGUgbW9kZXJuIEZpcmVmb3ggZm9jdXMgc3R5bGUgZm9yIGFsbCBmb2N1c2FibGUgZWxlbWVudHMuXG4qL1xuXG46LW1vei1mb2N1c3Jpbmcge1xuICBvdXRsaW5lOiBhdXRvO1xufVxuXG4vKlxuUmVtb3ZlIHRoZSBhZGRpdGlvbmFsIFxcYDppbnZhbGlkXFxgIHN0eWxlcyBpbiBGaXJlZm94LiAoaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvZ2Vja28tZGV2L2Jsb2IvMmY5ZWFjZDlkM2Q5OTVjOTM3YjQyNTFhNTU1N2Q5NWQ0OTRjOWJlMS9sYXlvdXQvc3R5bGUvcmVzL2Zvcm1zLmNzcyNMNzI4LUw3MzcpXG4qL1xuXG46LW1vei11aS1pbnZhbGlkIHtcbiAgYm94LXNoYWRvdzogbm9uZTtcbn1cblxuLypcbkFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lIGFuZCBGaXJlZm94LlxuKi9cblxucHJvZ3Jlc3Mge1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbi8qXG5Db3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBTYWZhcmkuXG4qL1xuXG46Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG46Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi8qXG4xLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbjIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuKi9cblxuW3R5cGU9J3NlYXJjaCddIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cbiAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cbn1cblxuLypcblJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cbiovXG5cbjo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbn1cblxuLypcbjEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4yLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIFxcYGluaGVyaXRcXGAgaW4gU2FmYXJpLlxuKi9cblxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cbn1cblxuLypcbkFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIENocm9tZSBhbmQgU2FmYXJpLlxuKi9cblxuc3VtbWFyeSB7XG4gIGRpc3BsYXk6IGxpc3QtaXRlbTtcbn1cblxuLypcblJlbW92ZXMgdGhlIGRlZmF1bHQgc3BhY2luZyBhbmQgYm9yZGVyIGZvciBhcHByb3ByaWF0ZSBlbGVtZW50cy5cbiovXG5cbmJsb2NrcXVvdGUsXG5kbCxcbmRkLFxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2LFxuaHIsXG5maWd1cmUsXG5wLFxucHJlIHtcbiAgbWFyZ2luOiAwO1xufVxuXG5maWVsZHNldCB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbn1cblxubGVnZW5kIHtcbiAgcGFkZGluZzogMDtcbn1cblxub2wsXG51bCxcbm1lbnUge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qXG5SZXNldCBkZWZhdWx0IHN0eWxpbmcgZm9yIGRpYWxvZ3MuXG4qL1xuZGlhbG9nIHtcbiAgcGFkZGluZzogMDtcbn1cblxuLypcblByZXZlbnQgcmVzaXppbmcgdGV4dGFyZWFzIGhvcml6b250YWxseSBieSBkZWZhdWx0LlxuKi9cblxudGV4dGFyZWEge1xuICByZXNpemU6IHZlcnRpY2FsO1xufVxuXG4vKlxuMS4gUmVzZXQgdGhlIGRlZmF1bHQgcGxhY2Vob2xkZXIgb3BhY2l0eSBpbiBGaXJlZm94LiAoaHR0cHM6Ly9naXRodWIuY29tL3RhaWx3aW5kbGFicy90YWlsd2luZGNzcy9pc3N1ZXMvMzMwMClcbjIuIFNldCB0aGUgZGVmYXVsdCBwbGFjZWhvbGRlciBjb2xvciB0byB0aGUgdXNlcidzIGNvbmZpZ3VyZWQgZ3JheSA0MDAgY29sb3IuXG4qL1xuXG5pbnB1dDo6LW1vei1wbGFjZWhvbGRlciwgdGV4dGFyZWE6Oi1tb3otcGxhY2Vob2xkZXIge1xuICBvcGFjaXR5OiAxOyAvKiAxICovXG4gIGNvbG9yOiAjOWNhM2FmOyAvKiAyICovXG59XG5cbmlucHV0OjpwbGFjZWhvbGRlcixcbnRleHRhcmVhOjpwbGFjZWhvbGRlciB7XG4gIG9wYWNpdHk6IDE7IC8qIDEgKi9cbiAgY29sb3I6ICM5Y2EzYWY7IC8qIDIgKi9cbn1cblxuLypcblNldCB0aGUgZGVmYXVsdCBjdXJzb3IgZm9yIGJ1dHRvbnMuXG4qL1xuXG5idXR0b24sXG5bcm9sZT1cImJ1dHRvblwiXSB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLypcbk1ha2Ugc3VyZSBkaXNhYmxlZCBidXR0b25zIGRvbid0IGdldCB0aGUgcG9pbnRlciBjdXJzb3IuXG4qL1xuOmRpc2FibGVkIHtcbiAgY3Vyc29yOiBkZWZhdWx0O1xufVxuXG4vKlxuMS4gTWFrZSByZXBsYWNlZCBlbGVtZW50cyBcXGBkaXNwbGF5OiBibG9ja1xcYCBieSBkZWZhdWx0LiAoaHR0cHM6Ly9naXRodWIuY29tL21vemRldnMvY3NzcmVtZWR5L2lzc3Vlcy8xNClcbjIuIEFkZCBcXGB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlXFxgIHRvIGFsaWduIHJlcGxhY2VkIGVsZW1lbnRzIG1vcmUgc2Vuc2libHkgYnkgZGVmYXVsdC4gKGh0dHBzOi8vZ2l0aHViLmNvbS9qZW5zaW1tb25zL2Nzc3JlbWVkeS9pc3N1ZXMvMTQjaXNzdWVjb21tZW50LTYzNDkzNDIxMClcbiAgIFRoaXMgY2FuIHRyaWdnZXIgYSBwb29ybHkgY29uc2lkZXJlZCBsaW50IGVycm9yIGluIHNvbWUgdG9vbHMgYnV0IGlzIGluY2x1ZGVkIGJ5IGRlc2lnbi5cbiovXG5cbmltZyxcbnN2ZyxcbnZpZGVvLFxuY2FudmFzLFxuYXVkaW8sXG5pZnJhbWUsXG5lbWJlZCxcbm9iamVjdCB7XG4gIGRpc3BsYXk6IGJsb2NrOyAvKiAxICovXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7IC8qIDIgKi9cbn1cblxuLypcbkNvbnN0cmFpbiBpbWFnZXMgYW5kIHZpZGVvcyB0byB0aGUgcGFyZW50IHdpZHRoIGFuZCBwcmVzZXJ2ZSB0aGVpciBpbnRyaW5zaWMgYXNwZWN0IHJhdGlvLiAoaHR0cHM6Ly9naXRodWIuY29tL21vemRldnMvY3NzcmVtZWR5L2lzc3Vlcy8xNClcbiovXG5cbmltZyxcbnZpZGVvIHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi8qIE1ha2UgZWxlbWVudHMgd2l0aCB0aGUgSFRNTCBoaWRkZW4gYXR0cmlidXRlIHN0YXkgaGlkZGVuIGJ5IGRlZmF1bHQgKi9cbltoaWRkZW5dOndoZXJlKDpub3QoW2hpZGRlbj1cInVudGlsLWZvdW5kXCJdKSkge1xuICBkaXNwbGF5OiBub25lO1xufVxuLnN0YXRpYyB7XG4gIHBvc2l0aW9uOiBzdGF0aWM7XG59XG4uZml4ZWQge1xuICBwb3NpdGlvbjogZml4ZWQ7XG59XG4uei01MCB7XG4gIHotaW5kZXg6IDUwO1xufVxuLmZsZXgge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuLnRhYmxlIHtcbiAgZGlzcGxheTogdGFibGU7XG59XG4udGFibGUtY2VsbCB7XG4gIGRpc3BsYXk6IHRhYmxlLWNlbGw7XG59XG4udGFibGUtcm93IHtcbiAgZGlzcGxheTogdGFibGUtcm93O1xufVxuLmgtXFxcXFsxMjhweFxcXFxdIHtcbiAgaGVpZ2h0OiAxMjhweDtcbn1cbi5oLVxcXFxbMjRweFxcXFxdIHtcbiAgaGVpZ2h0OiAyNHB4O1xufVxuLmgtXFxcXFsyNTZweFxcXFxdIHtcbiAgaGVpZ2h0OiAyNTZweDtcbn1cbi5oLVxcXFxbMnB4XFxcXF0ge1xuICBoZWlnaHQ6IDJweDtcbn1cbi5oLVxcXFxbMzJweFxcXFxdIHtcbiAgaGVpZ2h0OiAzMnB4O1xufVxuLmgtXFxcXFszNnB4XFxcXF0ge1xuICBoZWlnaHQ6IDM2cHg7XG59XG4uaC1cXFxcWzY0cHhcXFxcXSB7XG4gIGhlaWdodDogNjRweDtcbn1cbi5oLVxcXFxbY2FsY1xcXFwoMTAwXFxcXCUtMjU2cHhcXFxcKVxcXFxdIHtcbiAgaGVpZ2h0OiBjYWxjKDEwMCUgLSAyNTZweCk7XG59XG4uaC1mdWxsIHtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuLmgtc2NyZWVuIHtcbiAgaGVpZ2h0OiAxMDB2aDtcbn1cbi5tYXgtaC1cXFxcW2NhbGNcXFxcKDEwMFxcXFwlLTMycHhcXFxcKVxcXFxdIHtcbiAgbWF4LWhlaWdodDogY2FsYygxMDAlIC0gMzJweCk7XG59XG4ubWluLWgtXFxcXFsxMjhweFxcXFxdIHtcbiAgbWluLWhlaWdodDogMTI4cHg7XG59XG4udy0xXFxcXC80IHtcbiAgd2lkdGg6IDI1JTtcbn1cbi53LTNcXFxcLzQge1xuICB3aWR0aDogNzUlO1xufVxuLnctXFxcXFsxMjhweFxcXFxdIHtcbiAgd2lkdGg6IDEyOHB4O1xufVxuLnctXFxcXFsxOTJweFxcXFxdIHtcbiAgd2lkdGg6IDE5MnB4O1xufVxuLnctXFxcXFsyNTZweFxcXFxdIHtcbiAgd2lkdGg6IDI1NnB4O1xufVxuLnctXFxcXFszMjBweFxcXFxdIHtcbiAgd2lkdGg6IDMyMHB4O1xufVxuLnctXFxcXFszMnB4XFxcXF0ge1xuICB3aWR0aDogMzJweDtcbn1cbi53LVxcXFxbNHB4XFxcXF0ge1xuICB3aWR0aDogNHB4O1xufVxuLnctXFxcXFs1MTJweFxcXFxdIHtcbiAgd2lkdGg6IDUxMnB4O1xufVxuLnctXFxcXFs2NHB4XFxcXF0ge1xuICB3aWR0aDogNjRweDtcbn1cbi53LVxcXFxbOHB4XFxcXF0ge1xuICB3aWR0aDogOHB4O1xufVxuLnctXFxcXFtjYWxjXFxcXCgxMDBcXFxcJS0xOTJweFxcXFwpXFxcXF0ge1xuICB3aWR0aDogY2FsYygxMDAlIC0gMTkycHgpO1xufVxuLnctXFxcXFtjYWxjXFxcXCgxMDBcXFxcJS0yNTZweFxcXFwpXFxcXF0ge1xuICB3aWR0aDogY2FsYygxMDAlIC0gMjU2cHgpO1xufVxuLnctZnVsbCB7XG4gIHdpZHRoOiAxMDAlO1xufVxuLm1pbi13LVxcXFxbMTI4cHhcXFxcXSB7XG4gIG1pbi13aWR0aDogMTI4cHg7XG59XG4ubWF4LXctXFxcXFsyNTZweFxcXFxdIHtcbiAgbWF4LXdpZHRoOiAyNTZweDtcbn1cbi5tYXgtdy1cXFxcW2NhbGNcXFxcKDEwMFxcXFwlLTEyODBweFxcXFwpXFxcXF0ge1xuICBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDEyODBweCk7XG59XG4uZmxleC1ub25lIHtcbiAgZmxleDogbm9uZTtcbn1cbi5mbGV4LWdyb3cge1xuICBmbGV4LWdyb3c6IDE7XG59XG4uZ3JvdyB7XG4gIGZsZXgtZ3JvdzogMTtcbn1cbi5ib3JkZXItY29sbGFwc2Uge1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xufVxuLmN1cnNvci1wb2ludGVyIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLmZsZXgtY29sIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cbi5mbGV4LW5vd3JhcCB7XG4gIGZsZXgtd3JhcDogbm93cmFwO1xufVxuLml0ZW1zLWNlbnRlciB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4uanVzdGlmeS1zdGFydCB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbn1cbi5qdXN0aWZ5LWNlbnRlciB7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuLmp1c3RpZnktYmV0d2VlbiB7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2Vlbjtcbn1cbi5qdXN0aWZ5LWV2ZW5seSB7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xufVxuLmdhcC1cXFxcWzBweFxcXFxdIHtcbiAgZ2FwOiAwcHg7XG59XG4uZ2FwLXktXFxcXFsxNnB4XFxcXF0ge1xuICByb3ctZ2FwOiAxNnB4O1xufVxuLmdhcC15LVxcXFxbOHB4XFxcXF0ge1xuICByb3ctZ2FwOiA4cHg7XG59XG4ub3ZlcmZsb3ctYXV0byB7XG4gIG92ZXJmbG93OiBhdXRvO1xufVxuLm92ZXJmbG93LXgtYXV0byB7XG4gIG92ZXJmbG93LXg6IGF1dG87XG59XG4udGV4dC1lbGxpcHNpcyB7XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xufVxuLndoaXRlc3BhY2Utbm93cmFwIHtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi5yb3VuZGVkLVxcXFxbMTZweFxcXFxdIHtcbiAgYm9yZGVyLXJhZGl1czogMTZweDtcbn1cbi5yb3VuZGVkLVxcXFxbNHB4XFxcXF0ge1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG4ucm91bmRlZC1mdWxsIHtcbiAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xufVxuLmJvcmRlciB7XG4gIGJvcmRlci13aWR0aDogMXB4O1xufVxuLmJvcmRlci1uZXV0cmFsXzQge1xuICAtLXR3LWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6IHJnYmEoMjEwLCAyMTAsIDIxMCwgdmFyKC0tdHctYm9yZGVyLW9wYWNpdHksIDEpKTtcbn1cbi5ib3JkZXItbmV1dHJhbF83IHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG59XG4uYmctYmx1ZS01MDAge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYig1OSAxMzAgMjQ2IC8gdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuLmJnLW5ldXRyYWxfMSB7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMjUsIDIyNSwgMjI1LCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG4uYmctbmV1dHJhbF8yIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIyMCwgMjIwLCAyMjAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cbi5iZy1uZXV0cmFsXzkge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTAwLCAxMDAsIDEwMCwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuLmJnLXJlZC00MDAge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyNDggMTEzIDExMyAvIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cbi5wLVxcXFxbMHB4XFxcXF0ge1xuICBwYWRkaW5nOiAwcHg7XG59XG4ucC1cXFxcWzE2cHhcXFxcXSB7XG4gIHBhZGRpbmc6IDE2cHg7XG59XG4ucC1cXFxcWzMycHhcXFxcXSB7XG4gIHBhZGRpbmc6IDMycHg7XG59XG4ucC1cXFxcWzRweFxcXFxdIHtcbiAgcGFkZGluZzogNHB4O1xufVxuLnAtXFxcXFs4cHhcXFxcXSB7XG4gIHBhZGRpbmc6IDhweDtcbn1cbi5weC1cXFxcWzE2cHhcXFxcXSB7XG4gIHBhZGRpbmctbGVmdDogMTZweDtcbiAgcGFkZGluZy1yaWdodDogMTZweDtcbn1cbi5wbC1cXFxcWzBweFxcXFxdIHtcbiAgcGFkZGluZy1sZWZ0OiAwcHg7XG59XG4udGV4dC1jZW50ZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG4uYWxpZ24tbWlkZGxlIHtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cbi50ZXh0LTJ4bCB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBsaW5lLWhlaWdodDogMnJlbTtcbn1cbi5mb250LWJvbGQge1xuICBmb250LXdlaWdodDogNzAwO1xufVxuLmZvbnQtbGlnaHQge1xuICBmb250LXdlaWdodDogMzAwO1xufVxuLnVwcGVyY2FzZSB7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG4ubG93ZXJjYXNlIHtcbiAgdGV4dC10cmFuc2Zvcm06IGxvd2VyY2FzZTtcbn1cbi50ZXh0LW5ldXRyYWxfNyB7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbn1cbi5vdXRsaW5lIHtcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XG59XG4ub3V0bGluZS1cXFxcWzFweFxcXFxdIHtcbiAgb3V0bGluZS13aWR0aDogMXB4O1xufVxuLm91dGxpbmUtXFxcXFsycHhcXFxcXSB7XG4gIG91dGxpbmUtd2lkdGg6IDJweDtcbn1cbi5vdXRsaW5lLWJsYWNrXFxcXC8xMCB7XG4gIG91dGxpbmUtY29sb3I6IHJnYigwIDAgMCAvIDAuMSk7XG59XG4uZHJvcC1zaGFkb3ctXFxcXFswXzFweF8ycHhfcmdiYVxcXFwoMFxcXFwyYyAwXFxcXDJjIDBcXFxcMmMgMFxcXFwuMjVcXFxcKVxcXFxdIHtcbiAgLS10dy1kcm9wLXNoYWRvdzogZHJvcC1zaGFkb3coMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4yNSkpO1xuICBmaWx0ZXI6IHZhcigtLXR3LWJsdXIpIHZhcigtLXR3LWJyaWdodG5lc3MpIHZhcigtLXR3LWNvbnRyYXN0KSB2YXIoLS10dy1ncmF5c2NhbGUpIHZhcigtLXR3LWh1ZS1yb3RhdGUpIHZhcigtLXR3LWludmVydCkgdmFyKC0tdHctc2F0dXJhdGUpIHZhcigtLXR3LXNlcGlhKSB2YXIoLS10dy1kcm9wLXNoYWRvdyk7XG59XG4uZHJvcC1zaGFkb3ctc29mdC1ib3QtcmlnaHQge1xuICAtLXR3LWRyb3Atc2hhZG93OiBkcm9wLXNoYWRvdygxcHggMXB4IDRweCByZ2IoMCAwIDAgLyAwLjI1KSk7XG4gIGZpbHRlcjogdmFyKC0tdHctYmx1cikgdmFyKC0tdHctYnJpZ2h0bmVzcykgdmFyKC0tdHctY29udHJhc3QpIHZhcigtLXR3LWdyYXlzY2FsZSkgdmFyKC0tdHctaHVlLXJvdGF0ZSkgdmFyKC0tdHctaW52ZXJ0KSB2YXIoLS10dy1zYXR1cmF0ZSkgdmFyKC0tdHctc2VwaWEpIHZhcigtLXR3LWRyb3Atc2hhZG93KTtcbn1cblxuYm9keSB7XG4gIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgSGVsdmV0aWNhLFxuICAgIEFyaWFsLCBzYW5zLXNlcmlmO1xufVxuXG4uYmFzZSB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuLmJhc2UtaW5wdXQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDM2cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjIwLCAyMjAsIDIyMCwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xuICBwYWRkaW5nOiA4cHg7XG59XG5cbi5iYXNlLWlucHV0OmhvdmVyIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIzMCwgMjMwLCAyMzAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cblxuLmJhc2UtYm9yZGVyIHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbn1cblxuLmJhc2UtdGV4dC1wb3NpdGlvbiB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuLmJhc2UtdGV4dC1wb3NpdGlvbi1jZW50ZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi5iYXNlLXRleHQtc3R5bGUge1xuICB0ZXh0LXRyYW5zZm9ybTogbG93ZXJjYXNlO1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoNjAsIDYwLCA2MCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG59XG5cbi5iYXNlLW91dGxpbmUge1xuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcbiAgb3V0bGluZS13aWR0aDogMXB4O1xuICBvdXRsaW5lLWNvbG9yOiByZ2IoMCAwIDAgLyAwLjI1KTtcbn1cblxuLnVuaXQge1xuICAtLXR3LWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6IHJnYmEoNjAsIDYwLCA2MCwgdmFyKC0tdHctYm9yZGVyLW9wYWNpdHksIDEpKTtcbiAgLS10dy10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LXRleHQtb3BhY2l0eSwgMSkpO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIG91dGxpbmUtc3R5bGU6IHNvbGlkO1xuICBvdXRsaW5lLXdpZHRoOiAxcHg7XG4gIG91dGxpbmUtY29sb3I6IHJnYigwIDAgMCAvIDAuMjUpO1xufVxuXG4uYnV0dG9uLXN1Ym1pdCB7XG4gIC0tdHctYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy1ib3JkZXItb3BhY2l0eSwgMSkpO1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoNjAsIDYwLCA2MCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XG4gIG91dGxpbmUtd2lkdGg6IDFweDtcbiAgb3V0bGluZS1jb2xvcjogcmdiKDAgMCAwIC8gMC4yNSk7XG59XG5cbi5pbnB1dC1udW1iZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDM2cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjIwLCAyMjAsIDIyMCwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xuICBwYWRkaW5nOiA4cHg7XG59XG5cbi5pbnB1dC1udW1iZXI6aG92ZXIge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjMwLCAyMzAsIDIzMCwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuXG4uaW5wdXQtbnVtYmVyIHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcbiAgb3V0bGluZS13aWR0aDogMXB4O1xuICBvdXRsaW5lLWNvbG9yOiByZ2IoMCAwIDAgLyAwLjI1KTtcbn1cblxuaW5wdXQuaW5wdXQtbnVtYmVyIHtcbiAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xuICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XG4gIG1hcmdpbjogMDtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAtbW96LWFwcGVhcmFuY2U6IHRleHRmaWVsZDtcbn1cblxuaW5wdXQuaW5wdXQtbnVtYmVyOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuaW5wdXQuaW5wdXQtbnVtYmVyOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbi13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbm1hcmdpbjogMDtcbn1cblxuLmlucHV0LXRleHQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDM2cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjIwLCAyMjAsIDIyMCwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xuICBwYWRkaW5nOiA4cHg7XG59XG5cbi5pbnB1dC10ZXh0OmhvdmVyIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIzMCwgMjMwLCAyMzAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cblxuLmlucHV0LXRleHQge1xuICAtLXR3LWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6IHJnYmEoNjAsIDYwLCA2MCwgdmFyKC0tdHctYm9yZGVyLW9wYWNpdHksIDEpKTtcbiAgLS10dy10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LXRleHQtb3BhY2l0eSwgMSkpO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIG91dGxpbmUtc3R5bGU6IHNvbGlkO1xuICBvdXRsaW5lLXdpZHRoOiAxcHg7XG4gIG91dGxpbmUtY29sb3I6IHJnYigwIDAgMCAvIDAuMjUpO1xufVxuXG4uZmllbGQtdGl0bGUge1xuICBoZWlnaHQ6IDI0cHg7XG4gIHdpZHRoOiAxMDAlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIHRleHQtdHJhbnNmb3JtOiBsb3dlcmNhc2U7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSg2MCwgNjAsIDYwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbn1cblxuLmlucHV0LWZpZWxkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi50YWJsZS1oZWFkZXIge1xuICBmbGV4OiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZsZXgtd3JhcDogbm93cmFwO1xuICBib3JkZXItd2lkdGg6IDFweDtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDIxMCwgMjEwLCAyMTAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG4gIHBhZGRpbmc6IDRweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBmb250LXdlaWdodDogMzAwO1xufVxuXG4udGFibGUtaGVhZGVyOmhvdmVyIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIyNSwgMjI1LCAyMjUsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgLS10dy10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiByZ2JhKDIwLCAyMCwgMjAsIHZhcigtLXR3LXRleHQtb3BhY2l0eSwgMSkpO1xufVxuXG4udGFibGUtcm93IHtcbiAgZmxleDogbm9uZTtcbiAgZmxleC13cmFwOiBub3dyYXA7XG4gIGJvcmRlci13aWR0aDogMXB4O1xuICAtLXR3LWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6IHJnYmEoMjEwLCAyMTAsIDIxMCwgdmFyKC0tdHctYm9yZGVyLW9wYWNpdHksIDEpKTtcbiAgcGFkZGluZzogNHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi50YWJsZS1jZWxsIHtcbiAgZmxleDogbm9uZTtcbiAgZmxleC13cmFwOiBub3dyYXA7XG4gIGJvcmRlci13aWR0aDogMXB4O1xuICAtLXR3LWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6IHJnYmEoMjEwLCAyMTAsIDIxMCwgdmFyKC0tdHctYm9yZGVyLW9wYWNpdHksIDEpKTtcbiAgcGFkZGluZzogNHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi5tYWluLWNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xuICBnYXA6IDBweDtcbiAgcGFkZGluZzogMHB4O1xuICBwYWRkaW5nLWxlZnQ6IDBweDtcbn1cblxuaW5wdXQuY29udGludW91cy1udW1iZXIge1xuICAtbW96LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgYXBwZWFyYW5jZTogbm9uZTtcbiAgbWFyZ2luOiAwO1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gIC1tb3otYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xufVxuXG5pbnB1dC5jb250aW51b3VzLW51bWJlcjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbi13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbm1hcmdpbjogMDtcbn1cblxuLmhvdmVyXFxcXDpiZy1uZXV0cmFsXzA6aG92ZXIge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjMwLCAyMzAsIDIzMCwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuXG4uaG92ZXJcXFxcOmJnLW5ldXRyYWxfMTpob3ZlciB7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMjUsIDIyNSwgMjI1LCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG5cbi5ob3ZlclxcXFw6YmctbmV1dHJhbF83OmhvdmVyIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDYwLCA2MCwgNjAsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cblxuLmhvdmVyXFxcXDpmb250LW5vcm1hbDpob3ZlciB7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG59XG5cbi5ob3ZlclxcXFw6dGV4dC1uZXV0cmFsXzU6aG92ZXIge1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoMjAsIDIwLCAyMCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbmRleC5jc3NcIl0s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bUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBLHNCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLHNCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQSxrQkFBbUI7RUFBbkI7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQSxpQkFBbUI7RUFBbkI7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBLG9CQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUEseURBQW1CO0VBQW5CO0FBQW1CO0FBQW5CO0VBQUEsNERBQW1CO0VBQW5CO0FBQW1COztBQU9uQjtFQUNFO3FCQUNtQjtBQUNyQjs7QUFHRTtFQUFBLGtCQUErQjtFQUEvQjtBQUErQjs7QUFJL0I7RUFBQSxhQUE2RztFQUE3RyxZQUE2RztFQUE3RyxXQUE2RztFQUE3RyxtQkFBNkc7RUFBN0csdUJBQTZHO0VBQTdHLGtCQUE2RztFQUE3RyxrQkFBNkc7RUFBN0csOERBQTZHO0VBQTdHO0FBQTZHOztBQUE3RztFQUFBLGtCQUE2RztFQUE3RztBQUE2Rzs7QUFJN0c7RUFBQSxzQkFBcUM7RUFBckMsMkRBQXFDO0VBQXJDLG9CQUFxQztFQUFyQztBQUFxQzs7QUFJckM7RUFBQSxrQkFBOEI7RUFBOUI7QUFBOEI7O0FBSTlCO0VBQUEsa0JBQThCO0VBQTlCO0FBQThCOztBQUk5QjtFQUFBLHlCQUE4QjtFQUE5QixvQkFBOEI7RUFBOUI7QUFBOEI7O0FBSTlCO0VBQUEsb0JBQTZDO0VBQTdDLGtCQUE2QztFQUE3QztBQUE2Qzs7QUFJN0M7RUFBQSxzQkFBd0Q7RUFBeEQsMkRBQXdEO0VBQXhELG9CQUF3RDtFQUF4RCxrREFBd0Q7RUFBeEQsa0JBQXdEO0VBQXhELHNCQUF3RDtFQUF4RCxvQkFBd0Q7RUFBeEQsa0JBQXdEO0VBQXhEO0FBQXdEOztBQUl4RDtFQUFBLHNCQUF3RDtFQUF4RCwyREFBd0Q7RUFBeEQsb0JBQXdEO0VBQXhELGtEQUF3RDtFQUF4RCxrQkFBd0Q7RUFBeEQsc0JBQXdEO0VBQXhELG9CQUF3RDtFQUF4RCxrQkFBd0Q7RUFBeEQ7QUFBd0Q7O0FBSXhEO0VBQUEsYUFBK0U7RUFBL0UsWUFBK0U7RUFBL0UsV0FBK0U7RUFBL0UsbUJBQStFO0VBQS9FLHVCQUErRTtFQUEvRSxrQkFBK0U7RUFBL0Usa0JBQStFO0VBQS9FLDhEQUErRTtFQUEvRTtBQUErRTs7QUFBL0U7RUFBQSxrQkFBK0U7RUFBL0U7QUFBK0U7O0FBQS9FO0VBQUEsc0JBQStFO0VBQS9FLDJEQUErRTtFQUEvRSxvQkFBK0U7RUFBL0Usa0RBQStFO0VBQS9FLGtCQUErRTtFQUEvRSxzQkFBK0U7RUFBL0Usb0JBQStFO0VBQS9FLGtCQUErRTtFQUEvRTtBQUErRTs7QUFBL0U7RUFBQSxxQkFBK0U7T0FBL0UsZ0JBQStFO0VBQS9FLFNBQStFO0VBQS9FLHdCQUErRTtFQUEvRSwwQkFBK0U7QUFBQTs7QUFBL0U7O0FBQUEsd0JBQStFO0FBQS9FLFNBQStFO0FBQUE7O0FBSS9FO0VBQUEsYUFBNkQ7RUFBN0QsWUFBNkQ7RUFBN0QsV0FBNkQ7RUFBN0QsbUJBQTZEO0VBQTdELHVCQUE2RDtFQUE3RCxrQkFBNkQ7RUFBN0Qsa0JBQTZEO0VBQTdELDhEQUE2RDtFQUE3RDtBQUE2RDs7QUFBN0Q7RUFBQSxrQkFBNkQ7RUFBN0Q7QUFBNkQ7O0FBQTdEO0VBQUEsc0JBQTZEO0VBQTdELDJEQUE2RDtFQUE3RCxvQkFBNkQ7RUFBN0Qsa0RBQTZEO0VBQTdELGtCQUE2RDtFQUE3RCxzQkFBNkQ7RUFBN0Qsb0JBQTZEO0VBQTdELGtCQUE2RDtFQUE3RDtBQUE2RDs7QUFJN0Q7RUFBQSxZQUFnRTtFQUFoRSxXQUFnRTtFQUFoRSxrQkFBZ0U7RUFBaEUsc0JBQWdFO0VBQWhFLHlCQUFnRTtFQUFoRSxvQkFBZ0U7RUFBaEU7QUFBZ0U7O0FBSWhFO0VBQUEsYUFBOEQ7RUFBOUQsWUFBOEQ7RUFBOUQsV0FBOEQ7RUFBOUQsc0JBQThEO0VBQTlELG1CQUE4RDtFQUE5RDtBQUE4RDs7QUFJOUQ7RUFBQSxVQUF3SztFQUF4SyxlQUF3SztFQUF4SyxpQkFBd0s7RUFBeEssaUJBQXdLO0VBQXhLLHNCQUF3SztFQUF4Syw4REFBd0s7RUFBeEssWUFBd0s7RUFBeEssa0JBQXdLO0VBQXhLLHNCQUF3SztFQUF4SztBQUF3Szs7QUFBeEs7RUFBQSxrQkFBd0s7RUFBeEssOERBQXdLO0VBQXhLLGdCQUF3SztFQUF4SyxvQkFBd0s7RUFBeEs7QUFBd0s7O0FBSXhLO0VBQUEsVUFBb0Y7RUFBcEYsaUJBQW9GO0VBQXBGLGlCQUFvRjtFQUFwRixzQkFBb0Y7RUFBcEYsOERBQW9GO0VBQXBGLFlBQW9GO0VBQXBGLGtCQUFvRjtFQUFwRjtBQUFvRjs7QUFJcEY7RUFBQSxVQUFvRjtFQUFwRixpQkFBb0Y7RUFBcEYsaUJBQW9GO0VBQXBGLHNCQUFvRjtFQUFwRiw4REFBb0Y7RUFBcEYsWUFBb0Y7RUFBcEYsa0JBQW9GO0VBQXBGO0FBQW9GOztBQUlwRjtFQUFBLGFBQW1EO0VBQW5ELFlBQW1EO0VBQW5ELFdBQW1EO0VBQW5ELFFBQW1EO0VBQW5ELFlBQW1EO0VBQW5EO0FBQW1EOztBQUdyRDtFQUNFLHFCQUFnQjtPQUFoQixnQkFBZ0I7RUFDaEIsU0FBUztFQUNULHdCQUF3QjtFQUN4QiwwQkFBMEI7QUFDNUI7O0FBRUE7O0FBRUEsd0JBQXdCO0FBQ3hCLFNBQVM7QUFDVDs7QUE3RkE7RUFBQSxrQkE4RkE7RUE5RkE7QUE4RkE7O0FBOUZBO0VBQUEsa0JBOEZBO0VBOUZBO0FBOEZBOztBQTlGQTtFQUFBLGtCQThGQTtFQTlGQTtBQThGQTs7QUE5RkE7RUFBQTtBQThGQTs7QUE5RkE7RUFBQSxvQkE4RkE7RUE5RkE7QUE4RkFcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQHRhaWx3aW5kIGJhc2U7XFxuQHRhaWx3aW5kIGNvbXBvbmVudHM7XFxuQHRhaWx3aW5kIHV0aWxpdGllcztcXG5cXG5AaW1wb3J0IFxcXCIuL3RoZW1lcy5jc3NcXFwiO1xcbkBpbXBvcnQgXFxcIi4vZm9udHMuY3NzXFxcIjtcXG5AaW1wb3J0IFxcXCIuL3RleHRzLmNzc1xcXCI7XFxuQGltcG9ydCBcXFwiLi9pbnB1dHMuY3NzXFxcIjtcXG5cXG5ib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgSGVsdmV0aWNhLFxcbiAgICBBcmlhbCwgc2Fucy1zZXJpZjtcXG59XFxuXFxuLmJhc2Uge1xcbiAgQGFwcGx5IHRleHQtY2VudGVyIGFsaWduLW1pZGRsZTtcXG59XFxuXFxuLmJhc2UtaW5wdXQge1xcbiAgQGFwcGx5IHJvdW5kZWQtWzRweF0gcC1bOHB4XSB3LWZ1bGwgaC1bMzZweF0gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctbmV1dHJhbF8yIGhvdmVyOmJnLW5ldXRyYWxfMDtcXG59XFxuXFxuLmJhc2UtYm9yZGVyIHtcXG4gIEBhcHBseSBib3JkZXItbmV1dHJhbF83IHRleHQtbmV1dHJhbF83XFxufVxcblxcbi5iYXNlLXRleHQtcG9zaXRpb24ge1xcbiAgQGFwcGx5IHRleHQtY2VudGVyIGFsaWduLW1pZGRsZVxcbn1cXG5cXG4uYmFzZS10ZXh0LXBvc2l0aW9uLWNlbnRlciB7XFxuICBAYXBwbHkgdGV4dC1jZW50ZXIgYWxpZ24tbWlkZGxlXFxufVxcblxcbi5iYXNlLXRleHQtc3R5bGUge1xcbiAgQGFwcGx5IHRleHQtbmV1dHJhbF83IGxvd2VyY2FzZVxcbn1cXG5cXG4uYmFzZS1vdXRsaW5lIHtcXG4gIEBhcHBseSBvdXRsaW5lIG91dGxpbmUtWzFweF0gb3V0bGluZS1ibGFjay8yNTtcXG59XFxuXFxuLnVuaXQge1xcbiAgQGFwcGx5IGJhc2UtdGV4dC1wb3NpdGlvbi1jZW50ZXIgYmFzZS1ib3JkZXIgYmFzZS1vdXRsaW5lXFxufVxcblxcbi5idXR0b24tc3VibWl0IHtcXG4gIEBhcHBseSBiYXNlLXRleHQtcG9zaXRpb24tY2VudGVyIGJhc2UtYm9yZGVyIGJhc2Utb3V0bGluZVxcbn1cXG5cXG4uaW5wdXQtbnVtYmVyIHtcXG4gIEBhcHBseSBiYXNlLXRleHQtcG9zaXRpb24gYmFzZS1ib3JkZXIgYmFzZS1vdXRsaW5lIGJhc2UtaW5wdXQgY29udGludW91cy1udW1iZXI7XFxufVxcblxcbi5pbnB1dC10ZXh0IHtcXG4gIEBhcHBseSBiYXNlLXRleHQtcG9zaXRpb24gYmFzZS1ib3JkZXIgYmFzZS1vdXRsaW5lIGJhc2UtaW5wdXQ7XFxufVxcblxcbi5maWVsZC10aXRsZSB7XFxuICBAYXBwbHkgYmFzZS10ZXh0LXBvc2l0aW9uLWNlbnRlciBiYXNlLXRleHQtc3R5bGUgdy1mdWxsIGgtWzI0cHhdO1xcbn1cXG5cXG4uaW5wdXQtZmllbGQge1xcbiAgQGFwcGx5IHctZnVsbCBoLWZ1bGwgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXI7XFxufVxcblxcbi50YWJsZS1oZWFkZXIge1xcbiAgQGFwcGx5IGZsZXgtbm9uZSBmbGV4LW5vd3JhcCB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGUgYm9yZGVyIGJvcmRlci1uZXV0cmFsXzQgcC1bNHB4XSBjdXJzb3ItcG9pbnRlciBob3ZlcjpiZy1uZXV0cmFsXzEgaG92ZXI6dGV4dC1uZXV0cmFsXzUgZm9udC1saWdodCBob3Zlcjpmb250LW5vcm1hbFxcbn1cXG5cXG4udGFibGUtcm93IHtcXG4gIEBhcHBseSBmbGV4LW5vbmUgZmxleC1ub3dyYXAgdGV4dC1jZW50ZXIgYWxpZ24tbWlkZGxlIGJvcmRlciBib3JkZXItbmV1dHJhbF80IHAtWzRweF1cXG59XFxuXFxuLnRhYmxlLWNlbGwge1xcbiAgQGFwcGx5IGZsZXgtbm9uZSBmbGV4LW5vd3JhcCB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGUgYm9yZGVyIGJvcmRlci1uZXV0cmFsXzQgcC1bNHB4XVxcbn1cXG5cXG4ubWFpbi1jb250ZW50IHtcXG4gIEBhcHBseSB3LWZ1bGwgaC1mdWxsIGZsZXggZ2FwLVswcHhdIHBsLVswcHhdIHAtWzBweF1cXG59XFxuXFxuaW5wdXQuY29udGludW91cy1udW1iZXIge1xcbiAgYXBwZWFyYW5jZTogbm9uZTtcXG4gIG1hcmdpbjogMDtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIC1tb3otYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xcbn1cXG5cXG5pbnB1dC5jb250aW51b3VzLW51bWJlcjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG5pbnB1dC5jb250aW51b3VzLW51bWJlcjo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbm1hcmdpbjogMDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBgLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJcIixcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQGxheWVyIGNvbXBvbmVudHMge1xyXG4gICAgLmJhc2Uge1xyXG4gICAgICAgIEBhcHBseSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGU7XHJcbiAgICB9XHJcbiAgICAuZGVmYXVsdC1idXR0b24ge1xyXG4gICAgICAgIEBhcHBseSBiYXNlIGJnLWJsdWUtNTAwIGJvcmRlci1uZXV0cmFsXzcgdGV4dC1uZXV0cmFsXzc7XHJcbiAgICB9XHJcblxyXG4gICAgLyogSGlkZSBzY3JvbGxiYXIgZm9yIElFLCBFZGdlIGFuZCBGaXJlZm94ICovXHJcbiAgICAubm8tc2Nyb2xsYmFyIHtcclxuICAgICAgICAtbXMtb3ZlcmZsb3ctc3R5bGU6IG5vbmU7ICAvKiBJRSBhbmQgRWRnZSAqL1xyXG4gICAgICAgIHNjcm9sbGJhci13aWR0aDogbm9uZTsgIC8qIEZpcmVmb3ggKi9cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyogSGlkZSBzY3JvbGxiYXIgZm9yIENocm9tZSwgU2FmYXJpIGFuZCBPcGVyYSAqL1xyXG4gICAgLm5vLXNjcm9sbGJhcjo6LXdlYmtpdC1zY3JvbGxiYXIge1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLmRlZmF1bHQtaW5wdXQge1xyXG4gICAgICAgIEBhcHBseSBiYXNlIGJvcmRlci1uZXV0cmFsXzcgdGV4dC1uZXV0cmFsXzcgcm91bmRlZC1bMTZweF07XHJcbiAgICB9XHJcbn1cclxuXHJcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyIHtcclxuICAgIGFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICAtbW96LWFwcGVhcmFuY2U6IHRleHRmaWVsZDtcclxufVxyXG5cclxuaW5wdXQuY29udGludW91cy1udW1iZXI6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXHJcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcclxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgbWFyZ2luOiAwO1xyXG59XHJcblxyXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbnB1dHMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0k7UUFDSSwrQkFBK0I7SUFDbkM7SUFDQTtRQUNJLHVEQUF1RDtJQUMzRDs7SUFFQSw0Q0FBNEM7SUFDNUM7UUFDSSx3QkFBd0IsR0FBRyxnQkFBZ0I7UUFDM0MscUJBQXFCLEdBQUcsWUFBWTtJQUN4Qzs7SUFFQSxnREFBZ0Q7SUFDaEQ7UUFDSSxhQUFhO0lBQ2pCOztJQUVBO1FBQ0ksMERBQTBEO0lBQzlEO0FBQ0o7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsU0FBUztJQUNULHdCQUF3QjtJQUN4QiwwQkFBMEI7QUFDOUI7O0FBRUE7O0VBRUUsd0JBQXdCO0VBQ3hCLFNBQVM7QUFDWFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAbGF5ZXIgY29tcG9uZW50cyB7XFxyXFxuICAgIC5iYXNlIHtcXHJcXG4gICAgICAgIEBhcHBseSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGU7XFxyXFxuICAgIH1cXHJcXG4gICAgLmRlZmF1bHQtYnV0dG9uIHtcXHJcXG4gICAgICAgIEBhcHBseSBiYXNlIGJnLWJsdWUtNTAwIGJvcmRlci1uZXV0cmFsXzcgdGV4dC1uZXV0cmFsXzc7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLyogSGlkZSBzY3JvbGxiYXIgZm9yIElFLCBFZGdlIGFuZCBGaXJlZm94ICovXFxyXFxuICAgIC5uby1zY3JvbGxiYXIge1xcclxcbiAgICAgICAgLW1zLW92ZXJmbG93LXN0eWxlOiBub25lOyAgLyogSUUgYW5kIEVkZ2UgKi9cXHJcXG4gICAgICAgIHNjcm9sbGJhci13aWR0aDogbm9uZTsgIC8qIEZpcmVmb3ggKi9cXHJcXG4gICAgfVxcclxcbiAgICBcXHJcXG4gICAgLyogSGlkZSBzY3JvbGxiYXIgZm9yIENocm9tZSwgU2FmYXJpIGFuZCBPcGVyYSAqL1xcclxcbiAgICAubm8tc2Nyb2xsYmFyOjotd2Via2l0LXNjcm9sbGJhciB7XFxyXFxuICAgICAgICBkaXNwbGF5OiBub25lO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5kZWZhdWx0LWlucHV0IHtcXHJcXG4gICAgICAgIEBhcHBseSBiYXNlIGJvcmRlci1uZXV0cmFsXzcgdGV4dC1uZXV0cmFsXzcgcm91bmRlZC1bMTZweF07XFxyXFxuICAgIH1cXHJcXG59XFxyXFxuXFxyXFxuaW5wdXQuY29udGludW91cy1udW1iZXIge1xcclxcbiAgICBhcHBlYXJhbmNlOiBub25lO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXHJcXG4gICAgLW1vei1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XFxyXFxufVxcclxcblxcclxcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcclxcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXHJcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG59XFxyXFxuXFxyXFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBgLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJcIixcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgOnJvb3Qge1xyXG4gIC0tcHJpbWFyeTogMjU1LCAwLCAwO1xyXG4gIC0tcHJpbWFyeV9oaWdobGlnaHQ6IDAsIDI1NSwgMDtcclxuICAtLXNlY29uZGFyeTogMCwgMCwgMjU1O1xyXG4gIC0tbmV1dHJhbF8wOiAyNDAsIDI0MCwgMjQwO1xyXG4gIC0tbmV1dHJhbF8xOiAyMjAsIDIyMCwgMjIwO1xyXG4gIC0tbmV1dHJhbF8yOiAyMDAsIDIwMCwgMjAwO1xyXG4gIC0tbmV1dHJhbF8zOiAxODAsIDE4MCwgMTgwO1xyXG4gIC0tbmV1dHJhbF80OiAxNjAsIDE2MCwgMTYwO1xyXG4gIC0tbmV1dHJhbF81OiAxNDAsIDE0MCwgMTQwO1xyXG4gIC0tbmV1dHJhbF82OiAxMjAsIDEyMCwgMTIwO1xyXG4gIC0tbmV1dHJhbF83OiAxMDAsIDEwMCwgMTAwO1xyXG4gIC0tbmV1dHJhbF84OiA4MCwgODAsIDgwO1xyXG4gIC0tbmV1dHJhbF85OiA2MCwgNjAsIDYwO1xyXG59XHJcblxyXG5bZGF0YS10aGVtZT0nY3VzdG9tX2xpZ2h0J11cclxue1xyXG4gIC0tcHJpbWFyeTogMjUwLCAyNTAsIDI1MDtcclxuICAtLXByaW1hcnlfaGlnaGxpZ2h0OiAyNTUsIDI1NSwgMjU1O1xyXG4gIC0tc2Vjb25kYXJ5OiAyMDAsIDIwMCwgMjAwO1xyXG4gIC0tcHJpbWFyeV90ZXh0OiA5MCwgOTAsIDkwO1xyXG4gIC0tcHJpbWFyeV9oaWdobGlnaHRfdGV4dDogMzAsIDMwLCAzMDtcclxuICAtLXByaW1hcnlfaGlnaGxpZ2h0X3RleHQ6IDMwLCAzMCwgMzA7XHJcbiAgLS1pbmZvOiAxMDAsIDEwMCwgMjQwO1xyXG4gIC0tc3VjY2VzczogMTAwLCAyNDAsIDEwMDtcclxuICAtLXdhcm5pbmc6IDI0MCwgMjQwLCAxMDA7XHJcbiAgLS1lcnJvcjogMjQwLCAxMDAsIDEwMDtcclxuICAtLW5ldXRyYWxfMDogMjU1LCAyNTUsIDI1NTtcclxuICAtLW5ldXRyYWxfMTogMjUwLCAyNTAsIDI1MDtcclxuICAtLW5ldXRyYWxfMjogMjQ1LCAyNDUsIDI0NTtcclxuICAtLW5ldXRyYWxfMzogMjQwLCAyNDAsIDI0MDtcclxuICAtLW5ldXRyYWxfNDogMjM1LCAyMzUsIDIzNTtcclxuICAtLW5ldXRyYWxfNTogMTAsIDEwLCAxMDtcclxuICAtLW5ldXRyYWxfNjogMTUsIDE1LCAxNTtcclxuICAtLW5ldXRyYWxfNzogMjAsIDIwLCAyMDtcclxuICAtLW5ldXRyYWxfODogMjUsIDI1LCAyNTtcclxuICAtLW5ldXRyYWxfOTogMzAsIDMwLCAzMDtcclxufVxyXG5cclxuW2RhdGEtdGhlbWU9J2N1c3RvbV9kYXJrJ11cclxue1xyXG4gIC0tcHJpbWFyeTogNDAsIDQwLCA0MDtcclxuICAtLXByaW1hcnlfaGlnaGxpZ2h0OiAzMCwgMzAsIDMwO1xyXG4gIC0tc2Vjb25kYXJ5OiAyMCwgMjAsIDIwO1xyXG4gIC0tcHJpbWFyeV90ZXh0OiAyNTUsIDI1NSwgMjU1O1xyXG4gIC0tcHJpbWFyeV9oaWdobGlnaHRfdGV4dDogMjUwLCAyNTAsIDI1MDtcclxuICAtLWluZm86IDEwMCwgMTAwLCAyNDA7XHJcbiAgLS1zdWNjZXNzOiAxMDAsIDI0MCwgMTAwO1xyXG4gIC0td2FybmluZzogMjQwLCAyNDAsIDEwMDtcclxuICAtLWVycm9yOiAyNDAsIDEwMCwgMTAwO1xyXG4gIC0tbmV1dHJhbF8wOiAyNTUsIDI1NSwgMjU1O1xyXG4gIC0tbmV1dHJhbF8xOiAyNTAsIDI1MCwgMjUwO1xyXG4gIC0tbmV1dHJhbF8yOiAyNDUsIDI0NSwgMjQ1O1xyXG4gIC0tbmV1dHJhbF8zOiAyNDAsIDI0MCwgMjQwO1xyXG4gIC0tbmV1dHJhbF80OiAyMzUsIDIzNSwgMjM1O1xyXG4gIC0tbmV1dHJhbF81OiAxMCwgMTAsIDEwO1xyXG4gIC0tbmV1dHJhbF82OiAxNSwgMTUsIDE1O1xyXG4gIC0tbmV1dHJhbF83OiAyMCwgMjAsIDIwO1xyXG4gIC0tbmV1dHJhbF84OiAyNSwgMjUsIDI1O1xyXG4gIC0tbmV1dHJhbF85OiAzMCwgMzAsIDMwO1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc2NyaXB0cy9zdHlsZXMvdGhlbWVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLG9CQUFvQjtFQUNwQiw4QkFBOEI7RUFDOUIsc0JBQXNCO0VBQ3RCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtBQUN6Qjs7QUFFQTs7RUFFRSx3QkFBd0I7RUFDeEIsa0NBQWtDO0VBQ2xDLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsb0NBQW9DO0VBQ3BDLG9DQUFvQztFQUNwQyxxQkFBcUI7RUFDckIsd0JBQXdCO0VBQ3hCLHdCQUF3QjtFQUN4QixzQkFBc0I7RUFDdEIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQix1QkFBdUI7RUFDdkIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtFQUN2Qix1QkFBdUI7RUFDdkIsdUJBQXVCO0FBQ3pCOztBQUVBOztFQUVFLHFCQUFxQjtFQUNyQiwrQkFBK0I7RUFDL0IsdUJBQXVCO0VBQ3ZCLDZCQUE2QjtFQUM3Qix1Q0FBdUM7RUFDdkMscUJBQXFCO0VBQ3JCLHdCQUF3QjtFQUN4Qix3QkFBd0I7RUFDeEIsc0JBQXNCO0VBQ3RCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtFQUN2Qix1QkFBdUI7RUFDdkIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtBQUN6QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI6cm9vdCB7XFxyXFxuICAtLXByaW1hcnk6IDI1NSwgMCwgMDtcXHJcXG4gIC0tcHJpbWFyeV9oaWdobGlnaHQ6IDAsIDI1NSwgMDtcXHJcXG4gIC0tc2Vjb25kYXJ5OiAwLCAwLCAyNTU7XFxyXFxuICAtLW5ldXRyYWxfMDogMjQwLCAyNDAsIDI0MDtcXHJcXG4gIC0tbmV1dHJhbF8xOiAyMjAsIDIyMCwgMjIwO1xcclxcbiAgLS1uZXV0cmFsXzI6IDIwMCwgMjAwLCAyMDA7XFxyXFxuICAtLW5ldXRyYWxfMzogMTgwLCAxODAsIDE4MDtcXHJcXG4gIC0tbmV1dHJhbF80OiAxNjAsIDE2MCwgMTYwO1xcclxcbiAgLS1uZXV0cmFsXzU6IDE0MCwgMTQwLCAxNDA7XFxyXFxuICAtLW5ldXRyYWxfNjogMTIwLCAxMjAsIDEyMDtcXHJcXG4gIC0tbmV1dHJhbF83OiAxMDAsIDEwMCwgMTAwO1xcclxcbiAgLS1uZXV0cmFsXzg6IDgwLCA4MCwgODA7XFxyXFxuICAtLW5ldXRyYWxfOTogNjAsIDYwLCA2MDtcXHJcXG59XFxyXFxuXFxyXFxuW2RhdGEtdGhlbWU9J2N1c3RvbV9saWdodCddXFxyXFxue1xcclxcbiAgLS1wcmltYXJ5OiAyNTAsIDI1MCwgMjUwO1xcclxcbiAgLS1wcmltYXJ5X2hpZ2hsaWdodDogMjU1LCAyNTUsIDI1NTtcXHJcXG4gIC0tc2Vjb25kYXJ5OiAyMDAsIDIwMCwgMjAwO1xcclxcbiAgLS1wcmltYXJ5X3RleHQ6IDkwLCA5MCwgOTA7XFxyXFxuICAtLXByaW1hcnlfaGlnaGxpZ2h0X3RleHQ6IDMwLCAzMCwgMzA7XFxyXFxuICAtLXByaW1hcnlfaGlnaGxpZ2h0X3RleHQ6IDMwLCAzMCwgMzA7XFxyXFxuICAtLWluZm86IDEwMCwgMTAwLCAyNDA7XFxyXFxuICAtLXN1Y2Nlc3M6IDEwMCwgMjQwLCAxMDA7XFxyXFxuICAtLXdhcm5pbmc6IDI0MCwgMjQwLCAxMDA7XFxyXFxuICAtLWVycm9yOiAyNDAsIDEwMCwgMTAwO1xcclxcbiAgLS1uZXV0cmFsXzA6IDI1NSwgMjU1LCAyNTU7XFxyXFxuICAtLW5ldXRyYWxfMTogMjUwLCAyNTAsIDI1MDtcXHJcXG4gIC0tbmV1dHJhbF8yOiAyNDUsIDI0NSwgMjQ1O1xcclxcbiAgLS1uZXV0cmFsXzM6IDI0MCwgMjQwLCAyNDA7XFxyXFxuICAtLW5ldXRyYWxfNDogMjM1LCAyMzUsIDIzNTtcXHJcXG4gIC0tbmV1dHJhbF81OiAxMCwgMTAsIDEwO1xcclxcbiAgLS1uZXV0cmFsXzY6IDE1LCAxNSwgMTU7XFxyXFxuICAtLW5ldXRyYWxfNzogMjAsIDIwLCAyMDtcXHJcXG4gIC0tbmV1dHJhbF84OiAyNSwgMjUsIDI1O1xcclxcbiAgLS1uZXV0cmFsXzk6IDMwLCAzMCwgMzA7XFxyXFxufVxcclxcblxcclxcbltkYXRhLXRoZW1lPSdjdXN0b21fZGFyayddXFxyXFxue1xcclxcbiAgLS1wcmltYXJ5OiA0MCwgNDAsIDQwO1xcclxcbiAgLS1wcmltYXJ5X2hpZ2hsaWdodDogMzAsIDMwLCAzMDtcXHJcXG4gIC0tc2Vjb25kYXJ5OiAyMCwgMjAsIDIwO1xcclxcbiAgLS1wcmltYXJ5X3RleHQ6IDI1NSwgMjU1LCAyNTU7XFxyXFxuICAtLXByaW1hcnlfaGlnaGxpZ2h0X3RleHQ6IDI1MCwgMjUwLCAyNTA7XFxyXFxuICAtLWluZm86IDEwMCwgMTAwLCAyNDA7XFxyXFxuICAtLXN1Y2Nlc3M6IDEwMCwgMjQwLCAxMDA7XFxyXFxuICAtLXdhcm5pbmc6IDI0MCwgMjQwLCAxMDA7XFxyXFxuICAtLWVycm9yOiAyNDAsIDEwMCwgMTAwO1xcclxcbiAgLS1uZXV0cmFsXzA6IDI1NSwgMjU1LCAyNTU7XFxyXFxuICAtLW5ldXRyYWxfMTogMjUwLCAyNTAsIDI1MDtcXHJcXG4gIC0tbmV1dHJhbF8yOiAyNDUsIDI0NSwgMjQ1O1xcclxcbiAgLS1uZXV0cmFsXzM6IDI0MCwgMjQwLCAyNDA7XFxyXFxuICAtLW5ldXRyYWxfNDogMjM1LCAyMzUsIDIzNTtcXHJcXG4gIC0tbmV1dHJhbF81OiAxMCwgMTAsIDEwO1xcclxcbiAgLS1uZXV0cmFsXzY6IDE1LCAxNSwgMTU7XFxyXFxuICAtLW5ldXRyYWxfNzogMjAsIDIwLCAyMDtcXHJcXG4gIC0tbmV1dHJhbF84OiAyNSwgMjUsIDI1O1xcclxcbiAgLS1uZXV0cmFsXzk6IDMwLCAzMCwgMzA7XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsImltcG9ydCB7IFBhdGhNYW5hZ2VyIH0gZnJvbSAnLi4vc2NyaXB0cy9wYXRoLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBUcmFuc2FjdGlvbnNNYW5hZ2VyIH0gZnJvbSAnLi90cmFuc2FjdGlvbnMtbWFuYWdlcic7XHJcbmltcG9ydCB7IFByb2R1Y3RzTWFuYWdlciB9IGZyb20gJy4vcHJvZHVjdHMtbWFuYWdlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogRGF0YWJhc2VNYW5hZ2VyO1xyXG5cclxuICAgIHByaXZhdGUgX3RyYW5zYWN0aW9uc01hbmFnZXI6IFRyYW5zYWN0aW9uc01hbmFnZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3Byb2R1Y3RzTWFuYWdlcjogUHJvZHVjdHNNYW5hZ2VyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSBST09UIDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBmb2xkZXIgOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBmaWxlbmFtZSA6IHN0cmluZyA9IFwidHJhbnNhY3Rpb25zXCI7XHJcbiAgICBwcml2YXRlIGZvcm1hdCA6IHN0cmluZyA9IFwiY3N2XCI7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuUk9PVCA9IFBhdGhNYW5hZ2VyLkdldEluc3RhbmNlKCkuR2V0Um9vdCgpXHJcblxyXG4gICAgICAgIHRoaXMuSW5pdGlhbGl6ZURhdGFiYXNlcygpXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRJbnN0YW5jZSgpIDogRGF0YWJhc2VNYW5hZ2VyIHtcclxuICAgICAgICBpZiAodGhpcy5faW5zdGFuY2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBEYXRhYmFzZU1hbmFnZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgSW5pdGlhbGl6ZURhdGFiYXNlcygpe1xyXG4gICAgICAgIHRoaXMuX3RyYW5zYWN0aW9uc01hbmFnZXIgPSBUcmFuc2FjdGlvbnNNYW5hZ2VyLkdldEluc3RhbmNlKCk7XHJcbiAgICAgICAgdGhpcy5fcHJvZHVjdHNNYW5hZ2VyID0gUHJvZHVjdHNNYW5hZ2VyLkdldEluc3RhbmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFRyYW5zYWN0aW9uTWFuYWdlcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2FjdGlvbnNNYW5hZ2VyO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBJQ3JlYXRlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pY3JlYXRlJztcclxuaW1wb3J0IHsgSVJlYWQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lyZWFkJztcclxuaW1wb3J0IHsgSVVwZGF0ZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvaXVwZGF0ZSc7XHJcbmltcG9ydCB7IElEZWxldGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lkZWxldGUnO1xyXG5pbXBvcnQgeyBQcm9kdWN0IH0gZnJvbSAnLi4vbW9kZWxzL3Byb2R1Y3QnO1xyXG5pbXBvcnQgeyBQYXRoTWFuYWdlciB9IGZyb20gJy4uL3NjcmlwdHMvcGF0aC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgcGFyc2UgfSBmcm9tIFwiY3N2LXBhcnNlL3N5bmNcIjtcclxuaW1wb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSBcImNzdi1zdHJpbmdpZnkvc3luY1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0c01hbmFnZXIgaW1wbGVtZW50cyBJUmVhZCwgSVVwZGF0ZSwgSURlbGV0ZSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFByb2R1Y3RzTWFuYWdlcjtcclxuICAgIHByaXZhdGUgX3Byb2R1Y3RzOiBQcm9kdWN0W10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIFJPT1Q6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2RhdGFiYXNlOiBzdHJpbmcgPSBcImRhdGFiYXNlXCI7XHJcbiAgICBwcml2YXRlIF9kZXRhaWxzOiBzdHJpbmcgPSBcImRldGFpbHNcIjtcclxuICAgIHByaXZhdGUgX2ZpbGVuYW1lOiBzdHJpbmcgPSBcInByb2R1Y3RzLmNzdlwiO1xyXG4gICAgcHJpdmF0ZSBfcHJvZHVjdHNGaWxlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9kZXRhaWxzUGF0aDogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5ST09UID0gUGF0aE1hbmFnZXIuR2V0SW5zdGFuY2UoKS5HZXRSb290KCk7XHJcbiAgICAgICAgdGhpcy5fcHJvZHVjdHNGaWxlID0gcGF0aC5qb2luKHRoaXMuUk9PVCwgdGhpcy5fZGF0YWJhc2UsIHRoaXMuX2ZpbGVuYW1lKTtcclxuICAgICAgICB0aGlzLl9kZXRhaWxzUGF0aCA9IHBhdGguam9pbih0aGlzLlJPT1QsIHRoaXMuX2RhdGFiYXNlLCB0aGlzLl9kZXRhaWxzKTtcclxuICAgICAgICB0aGlzLlJlYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldEluc3RhbmNlKCk6IFByb2R1Y3RzTWFuYWdlciB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBQcm9kdWN0c01hbmFnZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDcmVhdGUoXHJcbiAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXHJcbiAgICAgICAgdmFsdWU6IG51bWJlcixcclxuICAgICAgICB1bml0T2ZNZWFzdXJlOiBzdHJpbmcsXHJcbiAgICAgICAgYW1vdW50OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyh0aGlzLl9wcm9kdWN0c0ZpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIENTViBmaWxlOiBmaWxlIGRvZXMgbm90IGV4aXN0LicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyh0aGlzLl9wcm9kdWN0c0ZpbGUsICd1dGYtOCcpO1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmRzID0gcGFyc2UoZmlsZUNvbnRlbnQsIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29udmVydGVyIGEgdW5pZGFkZSBkZSBtZWRpZGFcclxuICAgICAgICAgICAgbGV0IHBhcnNlZFVuaXQ6IFVuaXRPZk1lYXN1cmU7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRVbml0ID0gVW5pdE9mTWVhc3VyZVt1bml0T2ZNZWFzdXJlIGFzIGtleW9mIHR5cGVvZiBVbml0T2ZNZWFzdXJlXTtcclxuICAgICAgICAgICAgICAgIGlmICghcGFyc2VkVW5pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgdW5pdCBvZiBtZWFzdXJlLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHByb2Nlc3NpbmcgdW5pdCBvZiBtZWFzdXJlOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJvZHVjdCA9IG5ldyBQcm9kdWN0KFxyXG4gICAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgICAgICBwYXJzZWRVbml0LFxyXG4gICAgICAgICAgICAgICAgYW1vdW50XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0UGxhaW4gPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogcHJvZHVjdC5nZXRJbmZvKCkuaWQsXHJcbiAgICAgICAgICAgICAgICBjcmVhdGlvbkRhdGU6IHByb2R1Y3QuZ2V0SW5mbygpLmNyZWF0aW9uRGF0ZSxcclxuICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZERhdGU6IHByb2R1Y3QuZ2V0SW5mbygpLmxhc3RNb2RpZmllZCxcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICB1bml0T2ZNZWFzdXJlOiB1bml0T2ZNZWFzdXJlLFxyXG4gICAgICAgICAgICAgICAgYW1vdW50OiBhbW91bnQsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9wcm9kdWN0cy5wdXNoKHByb2R1Y3QpO1xyXG4gICAgICAgICAgICByZWNvcmRzLnB1c2gocHJvZHVjdFBsYWluKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRDU1YgPSBzdHJpbmdpZnkocmVjb3JkcywgeyBoZWFkZXI6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmModGhpcy5fcHJvZHVjdHNGaWxlLCB1cGRhdGVkQ1NWLCAndXRmLTgnKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIENTViBmaWxlOicsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJlYWQoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMuX3Byb2R1Y3RzRmlsZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlciA9IFtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCIsIFwiY3JlYXRpb25EYXRlXCIsIFwibGFzdE1vZGlmaWVkRGF0ZVwiLCBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcInZhbHVlXCIsIFwidW5pdE9mTWVhc3VyZVwiLCBcImFtb3VudFwiXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NTViA9IHN0cmluZ2lmeShbXSwgeyBoZWFkZXI6IHRydWUgfSk7XHJcbiAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHRoaXMuX3Byb2R1Y3RzRmlsZSwgbmV3Q1NWLCAndXRmLTgnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmModGhpcy5fcHJvZHVjdHNGaWxlLCAndXRmLTgnKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjb3JkcyA9IHBhcnNlKGZpbGVDb250ZW50LCB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2tpcF9lbXB0eV9saW5lczogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVjb3JkIG9mIHJlY29yZHMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3QgPSBuZXcgUHJvZHVjdChcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmQuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChyZWNvcmQudmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC51bml0T2ZNZWFzdXJlIGFzIFVuaXRPZk1lYXN1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChyZWNvcmQuYW1vdW50KSxcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmQuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocmVjb3JkLmNyZWF0aW9uRGF0ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocmVjb3JkLmxhc3RNb2RpZmllZERhdGUpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZHVjdHMucHVzaChwcm9kdWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlYWRpbmcgQ1NWIGZpbGU6JywgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVXBkYXRlKCkge1xyXG4gICAgICAgIC8vIEltcGxlbWVudGFyIG3DqXRvZG8gZGUgYXR1YWxpemHDp8Ojb1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEZWxldGUoKSB7XHJcbiAgICAgICAgLy8gSW1wbGVtZW50YXIgbcOpdG9kbyBkZSBkZWxlw6fDo29cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0UHJvZHVjdHMoKTogUHJvZHVjdFtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZHVjdHM7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQWxwaW5lIGZyb20gXCJhbHBpbmVqc1wiO1xyXG5pbXBvcnQgeyBEYXRhYmFzZU1hbmFnZXIgfSBmcm9tIFwiLi9kYXRhYmFzZS1tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEZvcm1hdHRlciB9IGZyb20gXCIuLi9zY3JpcHRzL2Zvcm1hdHRlclwiO1xyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICAgICAgQWxwaW5lOiB0eXBlb2YgQWxwaW5lO1xyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuQWxwaW5lID0gQWxwaW5lO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xyXG4gICAgQWxwaW5lLnN0YXJ0KCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImFscGluZTppbml0XCIsICgpID0+IHtcclxuICAgIGluaXRpYWxpemVfc3RvcmVzKCk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZV9zdG9yZXMoKSB7XHJcbiAgICBBbHBpbmUuc3RvcmUoXCJUcmFuc2FjdGlvbnNNYW5hZ2VyXCIsIERhdGFiYXNlTWFuYWdlci5HZXRJbnN0YW5jZSgpLkdldFRyYW5zYWN0aW9uTWFuYWdlcigpKTtcclxuICAgIEFscGluZS5zdG9yZShcIkZvcm1hdHRlclwiLCBGb3JtYXR0ZXIpO1xyXG59IiwiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBJUmVhZCB9IGZyb20gJy4uL2ludGVyZmFjZXMvaXJlYWQnO1xyXG5pbXBvcnQgeyBJVXBkYXRlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pdXBkYXRlJztcclxuaW1wb3J0IHsgSURlbGV0ZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvaWRlbGV0ZSc7XHJcbmltcG9ydCB7IFRyYW5zYWN0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL3RyYW5zYWN0aW9uJztcclxuaW1wb3J0IHsgUGF0aE1hbmFnZXIgfSBmcm9tICcuLi9zY3JpcHRzL3BhdGgtbWFuYWdlcic7XHJcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSBcImNzdi1wYXJzZS9zeW5jXCI7XHJcbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gXCJjc3Ytc3RyaW5naWZ5L3N5bmNcIjtcclxuaW1wb3J0IHsgVHJhbnNhY3Rpb25UeXBlIH0gZnJvbSBcIi4uL2VudW1zL3RyYW5zYWN0aW9uLXR5cGVcIjtcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNhY3Rpb25zTWFuYWdlciBpbXBsZW1lbnRzIElSZWFkLCBJVXBkYXRlLCBJRGVsZXRlIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogVHJhbnNhY3Rpb25zTWFuYWdlcjtcclxuXHJcbiAgICBwcml2YXRlIF90cmFuc2FjdGlvbnM6IFRyYW5zYWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIFJPT1QgOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9kYXRhYmFzZSA6IHN0cmluZyA9IFwiZGF0YWJhc2VcIjtcclxuICAgIHByaXZhdGUgX2RldGFpbHMgOiBzdHJpbmcgPSBcImRldGFpbHNcIjtcclxuICAgIHByaXZhdGUgX2ZpbGVuYW1lIDogc3RyaW5nID0gXCJ0cmFuc2FjdGlvbnMuY3N2XCI7XHJcbiAgICBwcml2YXRlIF90cmFuc2FjdGlvbnNGaWxlIDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfZGV0YWlsc19wYXRoIDogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLlJPT1QgPSBQYXRoTWFuYWdlci5HZXRJbnN0YW5jZSgpLkdldFJvb3QoKTtcclxuICAgICAgICB0aGlzLl90cmFuc2FjdGlvbnNGaWxlID0gcGF0aC5qb2luKHRoaXMuUk9PVCwgdGhpcy5fZGF0YWJhc2UsIHRoaXMuX2ZpbGVuYW1lKVxyXG4gICAgICAgIHRoaXMuX2RldGFpbHNfcGF0aCA9IHBhdGguam9pbih0aGlzLlJPT1QsIHRoaXMuX2RhdGFiYXNlLCB0aGlzLl9kZXRhaWxzKVxyXG5cclxuICAgICAgICB0aGlzLlJlYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldEluc3RhbmNlKCkgOiBUcmFuc2FjdGlvbnNNYW5hZ2VyIHtcclxuICAgICAgICBpZiAodGhpcy5faW5zdGFuY2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBUcmFuc2FjdGlvbnNNYW5hZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3JlYXRlKFxyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICB0eXBlOiBzdHJpbmcsXHJcbiAgICAgICAgYWdlbnQ6IHN0cmluZyxcclxuICAgICAgICBkYXRlOiBzdHJpbmcsXHJcbiAgICAgICAgcmVmZXJlbmNlRGF0ZTogc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcclxuICAgICAgICBkZXRhaWxzPzogc3RyaW5nKVxyXG4gICAge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyh0aGlzLl90cmFuc2FjdGlvbnNGaWxlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcHJvY2Vzc2luZyBDU1YgZmlsZTogZmlsZSBkb2VzIG5vdCBleGlzdHMuJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHRoaXMuX3RyYW5zYWN0aW9uc0ZpbGUsICd1dGYtOCcpO1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmRzID0gcGFyc2UoZmlsZUNvbnRlbnQsIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb25EYXRlVGlja3MgPSBuZXcgRGF0ZShkYXRlKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZURhdGVUaWNrcyA9IG5ldyBEYXRlKHJlZmVyZW5jZURhdGUpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0cmFuc2FjdGlvblR5cGUgPSBUcmFuc2FjdGlvblR5cGUuRW50cnk7XHJcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBcImVudHJ5XCIpIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uVHlwZSA9IFRyYW5zYWN0aW9uVHlwZS5FbnRyeTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcImV4aXRcIikge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25UeXBlID0gVHJhbnNhY3Rpb25UeXBlLkV4aXQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIHRyYW5zYWN0aW9uIHR5cGUuJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25UeXBlLFxyXG4gICAgICAgICAgICAgICAgYWdlbnQsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbkRhdGVUaWNrcyxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZURhdGVUaWNrcyxcclxuICAgICAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlscyB8fCBcIlwiXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2FjdGlvbnMucHVzaCh0cmFuc2FjdGlvbik7XHJcbiAgICAgICAgICAgIHJlY29yZHMucHVzaCh0cmFuc2FjdGlvbi5nZXRJbmZvKCkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlZENTViA9IHN0cmluZ2lmeShyZWNvcmRzLCB7IGhlYWRlcjogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyh0aGlzLl90cmFuc2FjdGlvbnNGaWxlLCB1cGRhdGVkQ1NWLCAndXRmLTgnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHByb2Nlc3NpbmcgQ1NWIGZpbGU6JywgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgUmVhZCgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmModGhpcy5fdHJhbnNhY3Rpb25zRmlsZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NTViA9IHN0cmluZ2lmeShbXSwgeyBoZWFkZXI6IHRydWUgfSk7XHJcbiAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHRoaXMuX3RyYW5zYWN0aW9uc0ZpbGUsIG5ld0NTViwgJ3V0Zi04Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHRoaXMuX3RyYW5zYWN0aW9uc0ZpbGUsICd1dGYtOCcpO1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmRzID0gcGFyc2UoZmlsZUNvbnRlbnQsIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWNvcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IG5ldyBUcmFuc2FjdGlvbihcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmRzW2ldLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjb3Jkc1tpXS5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmRzW2ldLnR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjb3Jkc1tpXS5hZ2VudCxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChyZWNvcmRzW2ldLnRyYW5zYWN0aW9uRGF0ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocmVjb3Jkc1tpXS5yZWZlcmVuY2VEYXRlKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KHJlY29yZHNbaV0udmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZHNbaV0uZGV0YWlscyB8fCBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZHNbaV0uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocmVjb3Jkc1tpXS5jcmVhdGlvbkRhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHJlY29yZHNbaV0ubGFzdE1vZGlmaWVkRGF0ZSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90cmFuc2FjdGlvbnMucHVzaCh0cmFuc2FjdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZWFkaW5nIENTViBmaWxlOicsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVwZGF0ZSgpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBEZWxldGUoKXtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0VHJhbnNhY3Rpb25zKCk6IFRyYW5zYWN0aW9uW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2FjdGlvbnM7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gVHJhbnNhY3Rpb25UeXBlIHtcclxuICAgIEVudHJ5LFxyXG4gICAgRXhpdCxcclxufSIsImltcG9ydCB7IG5hbm9pZCB9IGZyb20gJ25hbm9pZCc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRW50aXR5IHtcclxuICAgIHByb3RlY3RlZCBfaWQ6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBfY3JlYXRpb25EYXRlOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgX2xhc3RNb2RpZmllZDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgX2Rlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcclxuICAgICAgICBpZDogc3RyaW5nIHwgbnVsbCA9IG51bGwsXHJcbiAgICAgICAgY3JlYXRpb25EYXRlOiBudW1iZXIgPSBEYXRlLm5vdygpLFxyXG4gICAgICAgIGxhc3RNb2RpZmllZDogbnVtYmVyID0gRGF0ZS5ub3coKVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZCA/PyBuYW5vaWQoKTtcclxuICAgICAgICB0aGlzLl9jcmVhdGlvbkRhdGUgPSBjcmVhdGlvbkRhdGU7XHJcbiAgICAgICAgdGhpcy5fbGFzdE1vZGlmaWVkID0gbGFzdE1vZGlmaWVkO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuX2lkLFxyXG4gICAgICAgICAgICBjcmVhdGlvbkRhdGU6IHRoaXMuX2NyZWF0aW9uRGF0ZSxcclxuICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiB0aGlzLl9sYXN0TW9kaWZpZWQsXHJcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWUsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLl9kZXNjcmlwdGlvblxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5XCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSXRlbSBleHRlbmRzIEVudGl0eSB7XHJcbiAgICBwcm90ZWN0ZWQgX3ZhbHVlOiBudW1iZXJbXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXHJcbiAgICAgICAgdmFsdWU6IG51bWJlcixcclxuICAgICAgICBpZD86IHN0cmluZyxcclxuICAgICAgICBjcmVhdGlvbkRhdGU/OiBudW1iZXIsXHJcbiAgICAgICAgbGFzdE1vZGlmaWVkPzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihuYW1lLCBkZXNjcmlwdGlvbiwgaWQsIGNyZWF0aW9uRGF0ZSwgbGFzdE1vZGlmaWVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBbdmFsdWVdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC4uLnN1cGVyLmdldEluZm8oKSxcclxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuX3ZhbHVlLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuL2l0ZW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0IGV4dGVuZHMgSXRlbSB7XHJcbiAgICBwcml2YXRlIF91bml0T2ZNZWFzdXJlOiBVbml0T2ZNZWFzdXJlO1xyXG4gICAgcHJpdmF0ZSBfYW1vdW50OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIsXHJcbiAgICAgICAgdW5pdE9mTWVhc3VyZTogVW5pdE9mTWVhc3VyZSxcclxuICAgICAgICBhbW91bnQ6IG51bWJlcixcclxuICAgICAgICBpZD86IHN0cmluZyxcclxuICAgICAgICBjcmVhdGlvbkRhdGU/OiBudW1iZXIsXHJcbiAgICAgICAgbGFzdE1vZGlmaWVkPzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihuYW1lLCBkZXNjcmlwdGlvbiwgdmFsdWUsIGlkLCBjcmVhdGlvbkRhdGUsIGxhc3RNb2RpZmllZCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3VuaXRPZk1lYXN1cmUgPSB1bml0T2ZNZWFzdXJlO1xyXG4gICAgICAgIHRoaXMuX2Ftb3VudCA9IGFtb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SW5mbygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5zdXBlci5nZXRJbmZvKCksXHJcbiAgICAgICAgICAgIHVuaXRPZk1lYXN1cmU6IHRoaXMuX3VuaXRPZk1lYXN1cmUsXHJcbiAgICAgICAgICAgIGFtb3VudDogdGhpcy5fYW1vdW50XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRyYW5zYWN0aW9uVHlwZSB9IGZyb20gXCIuLi9lbnVtcy90cmFuc2FjdGlvbi10eXBlXCI7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zYWN0aW9uIGV4dGVuZHMgRW50aXR5IHtcclxuICAgIHByaXZhdGUgX3R5cGU6IFRyYW5zYWN0aW9uVHlwZTtcclxuICAgIHByaXZhdGUgX2FnZW50OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF90cmFuc2FjdGlvbkRhdGU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3JlZmVyZW5jZURhdGU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3ZhbHVlOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9kZXRhaWxzOiBzdHJpbmcgfCBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICBuYW1lOiBzdHJpbmcsIFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsIFxyXG4gICAgICAgIHR5cGU6IFRyYW5zYWN0aW9uVHlwZSwgXHJcbiAgICAgICAgYWdlbnQ6IHN0cmluZywgXHJcbiAgICAgICAgdHJhbnNhY3Rpb25EYXRlOiBudW1iZXIsIFxyXG4gICAgICAgIHJlZmVyZW5jZURhdGU6IG51bWJlciwgXHJcbiAgICAgICAgdmFsdWU6IG51bWJlciwgXHJcbiAgICAgICAgZGV0YWlsczogc3RyaW5nIHwgbnVsbCxcclxuICAgICAgICBpZD86IHN0cmluZywgXHJcbiAgICAgICAgY3JlYXRpb25EYXRlPzogbnVtYmVyLCBcclxuICAgICAgICBsYXN0TW9kaWZpZWQ/OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKG5hbWUsIGRlc2NyaXB0aW9uLCBpZCwgY3JlYXRpb25EYXRlLCBsYXN0TW9kaWZpZWQpO1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLl9hZ2VudCA9IGFnZW50O1xyXG4gICAgICAgIHRoaXMuX3RyYW5zYWN0aW9uRGF0ZSA9IHRyYW5zYWN0aW9uRGF0ZTtcclxuICAgICAgICB0aGlzLl9yZWZlcmVuY2VEYXRlID0gcmVmZXJlbmNlRGF0ZTtcclxuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2RldGFpbHMgPSBkZXRhaWxzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC4uLnN1cGVyLmdldEluZm8oKSxcclxuICAgICAgICAgICAgdHlwZTogdGhpcy5fdHlwZSxcclxuICAgICAgICAgICAgYWdlbnQ6IHRoaXMuX2FnZW50LFxyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbkRhdGU6IHRoaXMuX3RyYW5zYWN0aW9uRGF0ZSxcclxuICAgICAgICAgICAgcmVmZXJlbmNlRGF0ZTogdGhpcy5fcmVmZXJlbmNlRGF0ZSxcclxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuX3ZhbHVlLFxyXG4gICAgICAgICAgICBkZXRhaWxzOiB0aGlzLl9kZXRhaWxzLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEZvcm1hdHRlciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIE1pbGlzZWNvbmRzVG9EYXRlU3RyaW5nKG1pbGlzZWNvbmRzIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShtaWxpc2Vjb25kcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygncHQtQlInLCB7XHJcbiAgICAgICAgICAgICAgICBkYXk6ICcyLWRpZ2l0JyxcclxuICAgICAgICAgICAgICAgIG1vbnRoOiAnMi1kaWdpdCcsXHJcbiAgICAgICAgICAgICAgICB5ZWFyOiAnbnVtZXJpYycsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBOdW1iZXJUb01vbmV0YXJ5U3RyaW5nKHZhbHVlIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICByZXR1cm4gYEludmFsaWQgdmFsdWVgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYFIkICR7dmFsdWUudG9GaXhlZCgyKS5yZXBsYWNlKCcuJywgJywnKX1gO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXRoTWFuYWdlcntcclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogUGF0aE1hbmFnZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBST09UIDogc3RyaW5nO1xyXG4gICAgIFxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuUk9PVCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuUk9PVClcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldEluc3RhbmNlKCkgOiBQYXRoTWFuYWdlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2luc3RhbmNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgUGF0aE1hbmFnZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRSb290KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuUk9PVDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3JlYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBSZWFkKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVcGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCBcIi4vc3R5bGVzL2luZGV4LmNzc1wiO1xuaW1wb3J0IFwiLi4vY29udHJvbGxlcnMvc3RvcmVcIlxuXG5hc3luYyBmdW5jdGlvbiBsb2FkQ29tcG9uZW50KGZpbGVQYXRoOiBzdHJpbmcsIHRhcmdldElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGZpbGVQYXRoKTtcbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sQ29udGVudCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldElkKSEuaW5uZXJIVE1MID0gaHRtbENvbnRlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gbG9hZCAke2ZpbGVQYXRofTpgLCByZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGxvYWRpbmcgJHtmaWxlUGF0aH06YCwgZXJyb3IpO1xuICAgIH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBsb2FkQ29tcG9uZW50KCcuLi92aWV3cy9oZWFkZXIuaHRtbCcsICdoZWFkZXItY29udGFpbmVyJyk7XG5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXRoZW1lJywgJ2N1c3RvbV9saWdodCcpO1xufSk7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIENzdkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcihjb2RlLCBtZXNzYWdlLCBvcHRpb25zLCAuLi5jb250ZXh0cykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2UpKSBtZXNzYWdlID0gbWVzc2FnZS5qb2luKFwiIFwiKS50cmltKCk7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIENzdkVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICBmb3IgKGNvbnN0IGNvbnRleHQgb2YgY29udGV4dHMpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjb250ZXh0W2tleV07XG4gICAgICAgIHRoaXNba2V5XSA9IEJ1ZmZlci5pc0J1ZmZlcih2YWx1ZSlcbiAgICAgICAgICA/IHZhbHVlLnRvU3RyaW5nKG9wdGlvbnMuZW5jb2RpbmcpXG4gICAgICAgICAgOiB2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IHZhbHVlXG4gICAgICAgICAgICA6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgaXNfb2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiBvYmogIT09IG51bGwgJiYgIUFycmF5LmlzQXJyYXkob2JqKTtcbn07XG5cbmNvbnN0IG5vcm1hbGl6ZV9jb2x1bW5zX2FycmF5ID0gZnVuY3Rpb24gKGNvbHVtbnMpIHtcbiAgY29uc3Qgbm9ybWFsaXplZENvbHVtbnMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBjb2x1bW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGNvbHVtbiA9IGNvbHVtbnNbaV07XG4gICAgaWYgKGNvbHVtbiA9PT0gdW5kZWZpbmVkIHx8IGNvbHVtbiA9PT0gbnVsbCB8fCBjb2x1bW4gPT09IGZhbHNlKSB7XG4gICAgICBub3JtYWxpemVkQ29sdW1uc1tpXSA9IHsgZGlzYWJsZWQ6IHRydWUgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb2x1bW4gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG5vcm1hbGl6ZWRDb2x1bW5zW2ldID0geyBuYW1lOiBjb2x1bW4gfTtcbiAgICB9IGVsc2UgaWYgKGlzX29iamVjdChjb2x1bW4pKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbHVtbi5uYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBDc3ZFcnJvcihcIkNTVl9PUFRJT05fQ09MVU1OU19NSVNTSU5HX05BTUVcIiwgW1xuICAgICAgICAgIFwiT3B0aW9uIGNvbHVtbnMgbWlzc2luZyBuYW1lOlwiLFxuICAgICAgICAgIGBwcm9wZXJ0eSBcIm5hbWVcIiBpcyByZXF1aXJlZCBhdCBwb3NpdGlvbiAke2l9YCxcbiAgICAgICAgICBcIndoZW4gY29sdW1uIGlzIGFuIG9iamVjdCBsaXRlcmFsXCIsXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgICAgbm9ybWFsaXplZENvbHVtbnNbaV0gPSBjb2x1bW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBDc3ZFcnJvcihcIkNTVl9JTlZBTElEX0NPTFVNTl9ERUZJTklUSU9OXCIsIFtcbiAgICAgICAgXCJJbnZhbGlkIGNvbHVtbiBkZWZpbml0aW9uOlwiLFxuICAgICAgICBcImV4cGVjdCBhIHN0cmluZyBvciBhIGxpdGVyYWwgb2JqZWN0LFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkoY29sdW1uKX0gYXQgcG9zaXRpb24gJHtpfWAsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5vcm1hbGl6ZWRDb2x1bW5zO1xufTtcblxuY2xhc3MgUmVzaXplYWJsZUJ1ZmZlciB7XG4gIGNvbnN0cnVjdG9yKHNpemUgPSAxMDApIHtcbiAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICB0aGlzLmJ1ZiA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShzaXplKTtcbiAgfVxuICBwcmVwZW5kKHZhbCkge1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGggKyB2YWwubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA+PSB0aGlzLnNpemUpIHtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICAgICAgaWYgKGxlbmd0aCA+PSB0aGlzLnNpemUpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcihcIklOVkFMSURfQlVGRkVSX1NUQVRFXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBidWYgPSB0aGlzLmJ1ZjtcbiAgICAgIHRoaXMuYnVmID0gQnVmZmVyLmFsbG9jVW5zYWZlKHRoaXMuc2l6ZSk7XG4gICAgICB2YWwuY29weSh0aGlzLmJ1ZiwgMCk7XG4gICAgICBidWYuY29weSh0aGlzLmJ1ZiwgdmFsLmxlbmd0aCk7XG4gICAgICB0aGlzLmxlbmd0aCArPSB2YWwubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aCsrO1xuICAgICAgaWYgKGxlbmd0aCA9PT0gdGhpcy5zaXplKSB7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBidWYgPSB0aGlzLmNsb25lKCk7XG4gICAgICB0aGlzLmJ1ZlswXSA9IHZhbDtcbiAgICAgIGJ1Zi5jb3B5KHRoaXMuYnVmLCAxLCAwLCBsZW5ndGgpO1xuICAgIH1cbiAgfVxuICBhcHBlbmQodmFsKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGgrKztcbiAgICBpZiAobGVuZ3RoID09PSB0aGlzLnNpemUpIHtcbiAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuICAgIHRoaXMuYnVmW2xlbmd0aF0gPSB2YWw7XG4gIH1cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHRoaXMuYnVmLnNsaWNlKDAsIHRoaXMubGVuZ3RoKSk7XG4gIH1cbiAgcmVzaXplKCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgIHRoaXMuc2l6ZSA9IHRoaXMuc2l6ZSAqIDI7XG4gICAgY29uc3QgYnVmID0gQnVmZmVyLmFsbG9jVW5zYWZlKHRoaXMuc2l6ZSk7XG4gICAgdGhpcy5idWYuY29weShidWYsIDAsIDAsIGxlbmd0aCk7XG4gICAgdGhpcy5idWYgPSBidWY7XG4gIH1cbiAgdG9TdHJpbmcoZW5jb2RpbmcpIHtcbiAgICBpZiAoZW5jb2RpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmJ1Zi5zbGljZSgwLCB0aGlzLmxlbmd0aCkudG9TdHJpbmcoZW5jb2RpbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmJ1Zi5zbGljZSgwLCB0aGlzLmxlbmd0aCkpO1xuICAgIH1cbiAgfVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoXCJ1dGY4XCIpO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgfVxufVxuXG4vLyB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJzXG4vLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9XaGl0ZXNwYWNlX2NoYXJhY3RlclxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9HdWlkZS9SZWd1bGFyX0V4cHJlc3Npb25zL0NoYXJhY3Rlcl9DbGFzc2VzI1R5cGVzXG4vLyBcXGZcXG5cXHJcXHRcXHZcXHUwMGEwXFx1MTY4MFxcdTIwMDAtXFx1MjAwYVxcdTIwMjhcXHUyMDI5XFx1MjAyZlxcdTIwNWZcXHUzMDAwXFx1ZmVmZlxuY29uc3QgbnAgPSAxMjtcbmNvbnN0IGNyJDEgPSAxMzsgLy8gYFxccmAsIGNhcnJpYWdlIHJldHVybiwgMHgwRCBpbiBoZXhhZMOpY2ltYWwsIDEzIGluIGRlY2ltYWxcbmNvbnN0IG5sJDEgPSAxMDsgLy8gYFxcbmAsIG5ld2xpbmUsIDB4MEEgaW4gaGV4YWRlY2ltYWwsIDEwIGluIGRlY2ltYWxcbmNvbnN0IHNwYWNlID0gMzI7XG5jb25zdCB0YWIgPSA5O1xuXG5jb25zdCBpbml0X3N0YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICBib21Ta2lwcGVkOiBmYWxzZSxcbiAgICBidWZCeXRlc1N0YXJ0OiAwLFxuICAgIGNhc3RGaWVsZDogb3B0aW9ucy5jYXN0X2Z1bmN0aW9uLFxuICAgIGNvbW1lbnRpbmc6IGZhbHNlLFxuICAgIC8vIEN1cnJlbnQgZXJyb3IgZW5jb3VudGVyZWQgYnkgYSByZWNvcmRcbiAgICBlcnJvcjogdW5kZWZpbmVkLFxuICAgIGVuYWJsZWQ6IG9wdGlvbnMuZnJvbV9saW5lID09PSAxLFxuICAgIGVzY2FwaW5nOiBmYWxzZSxcbiAgICBlc2NhcGVJc1F1b3RlOlxuICAgICAgQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMuZXNjYXBlKSAmJlxuICAgICAgQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucXVvdGUpICYmXG4gICAgICBCdWZmZXIuY29tcGFyZShvcHRpb25zLmVzY2FwZSwgb3B0aW9ucy5xdW90ZSkgPT09IDAsXG4gICAgLy8gY29sdW1ucyBjYW4gYmUgYGZhbHNlYCwgYHRydWVgLCBgQXJyYXlgXG4gICAgZXhwZWN0ZWRSZWNvcmRMZW5ndGg6IEFycmF5LmlzQXJyYXkob3B0aW9ucy5jb2x1bW5zKVxuICAgICAgPyBvcHRpb25zLmNvbHVtbnMubGVuZ3RoXG4gICAgICA6IHVuZGVmaW5lZCxcbiAgICBmaWVsZDogbmV3IFJlc2l6ZWFibGVCdWZmZXIoMjApLFxuICAgIGZpcnN0TGluZVRvSGVhZGVyczogb3B0aW9ucy5jYXN0X2ZpcnN0X2xpbmVfdG9faGVhZGVyLFxuICAgIG5lZWRNb3JlRGF0YVNpemU6IE1hdGgubWF4KFxuICAgICAgLy8gU2tpcCBpZiB0aGUgcmVtYWluaW5nIGJ1ZmZlciBzbWFsbGVyIHRoYW4gY29tbWVudFxuICAgICAgb3B0aW9ucy5jb21tZW50ICE9PSBudWxsID8gb3B0aW9ucy5jb21tZW50Lmxlbmd0aCA6IDAsXG4gICAgICAvLyBTa2lwIGlmIHRoZSByZW1haW5pbmcgYnVmZmVyIGNhbiBiZSBkZWxpbWl0ZXJcbiAgICAgIC4uLm9wdGlvbnMuZGVsaW1pdGVyLm1hcCgoZGVsaW1pdGVyKSA9PiBkZWxpbWl0ZXIubGVuZ3RoKSxcbiAgICAgIC8vIFNraXAgaWYgdGhlIHJlbWFpbmluZyBidWZmZXIgY2FuIGJlIGVzY2FwZSBzZXF1ZW5jZVxuICAgICAgb3B0aW9ucy5xdW90ZSAhPT0gbnVsbCA/IG9wdGlvbnMucXVvdGUubGVuZ3RoIDogMCxcbiAgICApLFxuICAgIHByZXZpb3VzQnVmOiB1bmRlZmluZWQsXG4gICAgcXVvdGluZzogZmFsc2UsXG4gICAgc3RvcDogZmFsc2UsXG4gICAgcmF3QnVmZmVyOiBuZXcgUmVzaXplYWJsZUJ1ZmZlcigxMDApLFxuICAgIHJlY29yZDogW10sXG4gICAgcmVjb3JkSGFzRXJyb3I6IGZhbHNlLFxuICAgIHJlY29yZF9sZW5ndGg6IDAsXG4gICAgcmVjb3JkRGVsaW1pdGVyTWF4TGVuZ3RoOlxuICAgICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IDBcbiAgICAgICAgOiBNYXRoLm1heCguLi5vcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIubWFwKCh2KSA9PiB2Lmxlbmd0aCkpLFxuICAgIHRyaW1DaGFyczogW1xuICAgICAgQnVmZmVyLmZyb20oXCIgXCIsIG9wdGlvbnMuZW5jb2RpbmcpWzBdLFxuICAgICAgQnVmZmVyLmZyb20oXCJcXHRcIiwgb3B0aW9ucy5lbmNvZGluZylbMF0sXG4gICAgXSxcbiAgICB3YXNRdW90aW5nOiBmYWxzZSxcbiAgICB3YXNSb3dEZWxpbWl0ZXI6IGZhbHNlLFxuICAgIHRpbWNoYXJzOiBbXG4gICAgICBCdWZmZXIuZnJvbShCdWZmZXIuZnJvbShbY3IkMV0sIFwidXRmOFwiKS50b1N0cmluZygpLCBvcHRpb25zLmVuY29kaW5nKSxcbiAgICAgIEJ1ZmZlci5mcm9tKEJ1ZmZlci5mcm9tKFtubCQxXSwgXCJ1dGY4XCIpLnRvU3RyaW5nKCksIG9wdGlvbnMuZW5jb2RpbmcpLFxuICAgICAgQnVmZmVyLmZyb20oQnVmZmVyLmZyb20oW25wXSwgXCJ1dGY4XCIpLnRvU3RyaW5nKCksIG9wdGlvbnMuZW5jb2RpbmcpLFxuICAgICAgQnVmZmVyLmZyb20oQnVmZmVyLmZyb20oW3NwYWNlXSwgXCJ1dGY4XCIpLnRvU3RyaW5nKCksIG9wdGlvbnMuZW5jb2RpbmcpLFxuICAgICAgQnVmZmVyLmZyb20oQnVmZmVyLmZyb20oW3RhYl0sIFwidXRmOFwiKS50b1N0cmluZygpLCBvcHRpb25zLmVuY29kaW5nKSxcbiAgICBdLFxuICB9O1xufTtcblxuY29uc3QgdW5kZXJzY29yZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uIChfLCBtYXRjaCkge1xuICAgIHJldHVybiBcIl9cIiArIG1hdGNoLnRvTG93ZXJDYXNlKCk7XG4gIH0pO1xufTtcblxuY29uc3Qgbm9ybWFsaXplX29wdGlvbnMgPSBmdW5jdGlvbiAob3B0cykge1xuICBjb25zdCBvcHRpb25zID0ge307XG4gIC8vIE1lcmdlIHdpdGggdXNlciBvcHRpb25zXG4gIGZvciAoY29uc3Qgb3B0IGluIG9wdHMpIHtcbiAgICBvcHRpb25zW3VuZGVyc2NvcmUob3B0KV0gPSBvcHRzW29wdF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZW5jb2RpbmdgXG4gIC8vIE5vdGU6IGRlZmluZWQgZmlyc3QgYmVjYXVzZSBvdGhlciBvcHRpb25zIGRlcGVuZHMgb24gaXRcbiAgLy8gdG8gY29udmVydCBjaGFycy9zdHJpbmdzIGludG8gYnVmZmVycy5cbiAgaWYgKG9wdGlvbnMuZW5jb2RpbmcgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmVuY29kaW5nID09PSB0cnVlKSB7XG4gICAgb3B0aW9ucy5lbmNvZGluZyA9IFwidXRmOFwiO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuZW5jb2RpbmcgPT09IG51bGwgfHwgb3B0aW9ucy5lbmNvZGluZyA9PT0gZmFsc2UpIHtcbiAgICBvcHRpb25zLmVuY29kaW5nID0gbnVsbDtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2Ygb3B0aW9ucy5lbmNvZGluZyAhPT0gXCJzdHJpbmdcIiAmJlxuICAgIG9wdGlvbnMuZW5jb2RpbmcgIT09IG51bGxcbiAgKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fRU5DT0RJTkdcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBlbmNvZGluZzpcIixcbiAgICAgICAgXCJlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nIG9yIG51bGwgdG8gcmV0dXJuIGEgYnVmZmVyLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5lbmNvZGluZyl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgYm9tYFxuICBpZiAoXG4gICAgb3B0aW9ucy5ib20gPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuYm9tID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5ib20gPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMuYm9tID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5ib20gIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9CT01cIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBib206XCIsXG4gICAgICAgIFwiYm9tIG11c3QgYmUgdHJ1ZSxcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuYm9tKX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBjYXN0YFxuICBvcHRpb25zLmNhc3RfZnVuY3Rpb24gPSBudWxsO1xuICBpZiAoXG4gICAgb3B0aW9ucy5jYXN0ID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmNhc3QgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmNhc3QgPT09IGZhbHNlIHx8XG4gICAgb3B0aW9ucy5jYXN0ID09PSBcIlwiXG4gICkge1xuICAgIG9wdGlvbnMuY2FzdCA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5jYXN0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBvcHRpb25zLmNhc3RfZnVuY3Rpb24gPSBvcHRpb25zLmNhc3Q7XG4gICAgb3B0aW9ucy5jYXN0ID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmNhc3QgIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9DQVNUXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gY2FzdDpcIixcbiAgICAgICAgXCJjYXN0IG11c3QgYmUgdHJ1ZSBvciBhIGZ1bmN0aW9uLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5jYXN0KX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBjYXN0X2RhdGVgXG4gIGlmIChcbiAgICBvcHRpb25zLmNhc3RfZGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5jYXN0X2RhdGUgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmNhc3RfZGF0ZSA9PT0gZmFsc2UgfHxcbiAgICBvcHRpb25zLmNhc3RfZGF0ZSA9PT0gXCJcIlxuICApIHtcbiAgICBvcHRpb25zLmNhc3RfZGF0ZSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuY2FzdF9kYXRlID09PSB0cnVlKSB7XG4gICAgb3B0aW9ucy5jYXN0X2RhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGNvbnN0IGRhdGUgPSBEYXRlLnBhcnNlKHZhbHVlKTtcbiAgICAgIHJldHVybiAhaXNOYU4oZGF0ZSkgPyBuZXcgRGF0ZShkYXRlKSA6IHZhbHVlO1xuICAgIH07XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuY2FzdF9kYXRlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9DQVNUX0RBVEVcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBjYXN0X2RhdGU6XCIsXG4gICAgICAgIFwiY2FzdF9kYXRlIG11c3QgYmUgdHJ1ZSBvciBhIGZ1bmN0aW9uLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5jYXN0X2RhdGUpfWAsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGNvbHVtbnNgXG4gIG9wdGlvbnMuY2FzdF9maXJzdF9saW5lX3RvX2hlYWRlciA9IG51bGw7XG4gIGlmIChvcHRpb25zLmNvbHVtbnMgPT09IHRydWUpIHtcbiAgICAvLyBGaWVsZHMgaW4gdGhlIGZpcnN0IGxpbmUgYXJlIGNvbnZlcnRlZCBhcy1pcyB0byBjb2x1bW5zXG4gICAgb3B0aW9ucy5jYXN0X2ZpcnN0X2xpbmVfdG9faGVhZGVyID0gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmNvbHVtbnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIG9wdGlvbnMuY2FzdF9maXJzdF9saW5lX3RvX2hlYWRlciA9IG9wdGlvbnMuY29sdW1ucztcbiAgICBvcHRpb25zLmNvbHVtbnMgPSB0cnVlO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5jb2x1bW5zKSkge1xuICAgIG9wdGlvbnMuY29sdW1ucyA9IG5vcm1hbGl6ZV9jb2x1bW5zX2FycmF5KG9wdGlvbnMuY29sdW1ucyk7XG4gIH0gZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5jb2x1bW5zID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmNvbHVtbnMgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmNvbHVtbnMgPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMuY29sdW1ucyA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX0NPTFVNTlNcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBjb2x1bW5zOlwiLFxuICAgICAgICBcImV4cGVjdCBhbiBhcnJheSwgYSBmdW5jdGlvbiBvciB0cnVlLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5jb2x1bW5zKX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBncm91cF9jb2x1bW5zX2J5X25hbWVgXG4gIGlmIChcbiAgICBvcHRpb25zLmdyb3VwX2NvbHVtbnNfYnlfbmFtZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5ncm91cF9jb2x1bW5zX2J5X25hbWUgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmdyb3VwX2NvbHVtbnNfYnlfbmFtZSA9PT0gZmFsc2VcbiAgKSB7XG4gICAgb3B0aW9ucy5ncm91cF9jb2x1bW5zX2J5X25hbWUgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmdyb3VwX2NvbHVtbnNfYnlfbmFtZSAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX0dST1VQX0NPTFVNTlNfQllfTkFNRVwiLFxuICAgICAgW1xuICAgICAgICBcIkludmFsaWQgb3B0aW9uIGdyb3VwX2NvbHVtbnNfYnlfbmFtZTpcIixcbiAgICAgICAgXCJleHBlY3QgYW4gYm9vbGVhbixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuZ3JvdXBfY29sdW1uc19ieV9uYW1lKX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmNvbHVtbnMgPT09IGZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fR1JPVVBfQ09MVU1OU19CWV9OQU1FXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gZ3JvdXBfY29sdW1uc19ieV9uYW1lOlwiLFxuICAgICAgICBcInRoZSBgY29sdW1uc2AgbW9kZSBtdXN0IGJlIGFjdGl2YXRlZC5cIixcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY29tbWVudGBcbiAgaWYgKFxuICAgIG9wdGlvbnMuY29tbWVudCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5jb21tZW50ID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5jb21tZW50ID09PSBmYWxzZSB8fFxuICAgIG9wdGlvbnMuY29tbWVudCA9PT0gXCJcIlxuICApIHtcbiAgICBvcHRpb25zLmNvbW1lbnQgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jb21tZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBvcHRpb25zLmNvbW1lbnQgPSBCdWZmZXIuZnJvbShvcHRpb25zLmNvbW1lbnQsIG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIH1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLmNvbW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX0NPTU1FTlRcIixcbiAgICAgICAgW1xuICAgICAgICAgIFwiSW52YWxpZCBvcHRpb24gY29tbWVudDpcIixcbiAgICAgICAgICBcImNvbW1lbnQgbXVzdCBiZSBhIGJ1ZmZlciBvciBhIHN0cmluZyxcIixcbiAgICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5jb21tZW50KX1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY29tbWVudF9ub19pbmZpeGBcbiAgaWYgKFxuICAgIG9wdGlvbnMuY29tbWVudF9ub19pbmZpeCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5jb21tZW50X25vX2luZml4ID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5jb21tZW50X25vX2luZml4ID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLmNvbW1lbnRfbm9faW5maXggPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmNvbW1lbnRfbm9faW5maXggIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9DT01NRU5UXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gY29tbWVudF9ub19pbmZpeDpcIixcbiAgICAgICAgXCJ2YWx1ZSBtdXN0IGJlIGEgYm9vbGVhbixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuY29tbWVudF9ub19pbmZpeCl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZGVsaW1pdGVyYFxuICBjb25zdCBkZWxpbWl0ZXJfanNvbiA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGVsaW1pdGVyKTtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuZGVsaW1pdGVyKSlcbiAgICBvcHRpb25zLmRlbGltaXRlciA9IFtvcHRpb25zLmRlbGltaXRlcl07XG4gIGlmIChvcHRpb25zLmRlbGltaXRlci5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9ERUxJTUlURVJcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBkZWxpbWl0ZXI6XCIsXG4gICAgICAgIFwiZGVsaW1pdGVyIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nIG9yIGJ1ZmZlciBvciBhcnJheSBvZiBzdHJpbmd8YnVmZmVyLFwiLFxuICAgICAgICBgZ290ICR7ZGVsaW1pdGVyX2pzb259YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgb3B0aW9ucy5kZWxpbWl0ZXIgPSBvcHRpb25zLmRlbGltaXRlci5tYXAoZnVuY3Rpb24gKGRlbGltaXRlcikge1xuICAgIGlmIChkZWxpbWl0ZXIgPT09IHVuZGVmaW5lZCB8fCBkZWxpbWl0ZXIgPT09IG51bGwgfHwgZGVsaW1pdGVyID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFwiLFwiLCBvcHRpb25zLmVuY29kaW5nKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBkZWxpbWl0ZXIgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGRlbGltaXRlciA9IEJ1ZmZlci5mcm9tKGRlbGltaXRlciwgb3B0aW9ucy5lbmNvZGluZyk7XG4gICAgfVxuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGRlbGltaXRlcikgfHwgZGVsaW1pdGVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9ERUxJTUlURVJcIixcbiAgICAgICAgW1xuICAgICAgICAgIFwiSW52YWxpZCBvcHRpb24gZGVsaW1pdGVyOlwiLFxuICAgICAgICAgIFwiZGVsaW1pdGVyIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nIG9yIGJ1ZmZlciBvciBhcnJheSBvZiBzdHJpbmd8YnVmZmVyLFwiLFxuICAgICAgICAgIGBnb3QgJHtkZWxpbWl0ZXJfanNvbn1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlbGltaXRlcjtcbiAgfSk7XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGVzY2FwZWBcbiAgaWYgKG9wdGlvbnMuZXNjYXBlID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5lc2NhcGUgPT09IHRydWUpIHtcbiAgICBvcHRpb25zLmVzY2FwZSA9IEJ1ZmZlci5mcm9tKCdcIicsIG9wdGlvbnMuZW5jb2RpbmcpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmVzY2FwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIG9wdGlvbnMuZXNjYXBlID0gQnVmZmVyLmZyb20ob3B0aW9ucy5lc2NhcGUsIG9wdGlvbnMuZW5jb2RpbmcpO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuZXNjYXBlID09PSBudWxsIHx8IG9wdGlvbnMuZXNjYXBlID09PSBmYWxzZSkge1xuICAgIG9wdGlvbnMuZXNjYXBlID0gbnVsbDtcbiAgfVxuICBpZiAob3B0aW9ucy5lc2NhcGUgIT09IG51bGwpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLmVzY2FwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEludmFsaWQgT3B0aW9uOiBlc2NhcGUgbXVzdCBiZSBhIGJ1ZmZlciwgYSBzdHJpbmcgb3IgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmVzY2FwZSl9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGZyb21gXG4gIGlmIChvcHRpb25zLmZyb20gPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmZyb20gPT09IG51bGwpIHtcbiAgICBvcHRpb25zLmZyb20gPSAxO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5mcm9tID09PSBcInN0cmluZ1wiICYmIC9cXGQrLy50ZXN0KG9wdGlvbnMuZnJvbSkpIHtcbiAgICAgIG9wdGlvbnMuZnJvbSA9IHBhcnNlSW50KG9wdGlvbnMuZnJvbSk7XG4gICAgfVxuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMuZnJvbSkpIHtcbiAgICAgIGlmIChvcHRpb25zLmZyb20gPCAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCBPcHRpb246IGZyb20gbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdHMuZnJvbSl9YCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgSW52YWxpZCBPcHRpb246IGZyb20gbXVzdCBiZSBhbiBpbnRlZ2VyLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmZyb20pfWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBmcm9tX2xpbmVgXG4gIGlmIChvcHRpb25zLmZyb21fbGluZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuZnJvbV9saW5lID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5mcm9tX2xpbmUgPSAxO1xuICB9IGVsc2Uge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBvcHRpb25zLmZyb21fbGluZSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgL1xcZCsvLnRlc3Qob3B0aW9ucy5mcm9tX2xpbmUpXG4gICAgKSB7XG4gICAgICBvcHRpb25zLmZyb21fbGluZSA9IHBhcnNlSW50KG9wdGlvbnMuZnJvbV9saW5lKTtcbiAgICB9XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIob3B0aW9ucy5mcm9tX2xpbmUpKSB7XG4gICAgICBpZiAob3B0aW9ucy5mcm9tX2xpbmUgPD0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgT3B0aW9uOiBmcm9tX2xpbmUgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIgZ3JlYXRlciB0aGFuIDAsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdHMuZnJvbV9saW5lKX1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogZnJvbV9saW5lIG11c3QgYmUgYW4gaW50ZWdlciwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0cy5mcm9tX2xpbmUpfWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9ucyBgaWdub3JlX2xhc3RfZGVsaW1pdGVyc2BcbiAgaWYgKFxuICAgIG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5pZ25vcmVfbGFzdF9kZWxpbWl0ZXJzID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPT09IFwibnVtYmVyXCIpIHtcbiAgICBvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPSBNYXRoLmZsb29yKG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyk7XG4gICAgaWYgKG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9PT0gMCkge1xuICAgICAgb3B0aW9ucy5pZ25vcmVfbGFzdF9kZWxpbWl0ZXJzID0gZmFsc2U7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fSUdOT1JFX0xBU1RfREVMSU1JVEVSU1wiLFxuICAgICAgW1xuICAgICAgICBcIkludmFsaWQgb3B0aW9uIGBpZ25vcmVfbGFzdF9kZWxpbWl0ZXJzYDpcIixcbiAgICAgICAgXCJ0aGUgdmFsdWUgbXVzdCBiZSBhIGJvb2xlYW4gdmFsdWUgb3IgYW4gaW50ZWdlcixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9PT0gdHJ1ZSAmJiBvcHRpb25zLmNvbHVtbnMgPT09IGZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSUdOT1JFX0xBU1RfREVMSU1JVEVSU19SRVFVSVJFU19DT0xVTU5TXCIsXG4gICAgICBbXG4gICAgICAgIFwiVGhlIG9wdGlvbiBgaWdub3JlX2xhc3RfZGVsaW1pdGVyc2BcIixcbiAgICAgICAgXCJyZXF1aXJlcyB0aGUgYWN0aXZhdGlvbiBvZiB0aGUgYGNvbHVtbnNgIG9wdGlvblwiLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBpbmZvYFxuICBpZiAoXG4gICAgb3B0aW9ucy5pbmZvID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmluZm8gPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmluZm8gPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMuaW5mbyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuaW5mbyAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogaW5mbyBtdXN0IGJlIHRydWUsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuaW5mbyl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYG1heF9yZWNvcmRfc2l6ZWBcbiAgaWYgKFxuICAgIG9wdGlvbnMubWF4X3JlY29yZF9zaXplID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMubWF4X3JlY29yZF9zaXplID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSA9IDA7XG4gIH0gZWxzZSBpZiAoXG4gICAgTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSkgJiZcbiAgICBvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSA+PSAwXG4gICkgOyBlbHNlIGlmIChcbiAgICB0eXBlb2Ygb3B0aW9ucy5tYXhfcmVjb3JkX3NpemUgPT09IFwic3RyaW5nXCIgJiZcbiAgICAvXFxkKy8udGVzdChvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSlcbiAgKSB7XG4gICAgb3B0aW9ucy5tYXhfcmVjb3JkX3NpemUgPSBwYXJzZUludChvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiBtYXhfcmVjb3JkX3NpemUgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMubWF4X3JlY29yZF9zaXplKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgb2JqbmFtZWBcbiAgaWYgKFxuICAgIG9wdGlvbnMub2JqbmFtZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5vYmpuYW1lID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5vYmpuYW1lID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLm9iam5hbWUgPSB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMub2JqbmFtZSkpIHtcbiAgICBpZiAob3B0aW9ucy5vYmpuYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIE9wdGlvbjogb2JqbmFtZSBtdXN0IGJlIGEgbm9uIGVtcHR5IGJ1ZmZlcmApO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5lbmNvZGluZyA9PT0gbnVsbCkgOyBlbHNlIHtcbiAgICAgIG9wdGlvbnMub2JqbmFtZSA9IG9wdGlvbnMub2JqbmFtZS50b1N0cmluZyhvcHRpb25zLmVuY29kaW5nKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMub2JqbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGlmIChvcHRpb25zLm9iam5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgT3B0aW9uOiBvYmpuYW1lIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nYCk7XG4gICAgfVxuICAgIC8vIEdyZWF0LCBub3RoaW5nIHRvIGRvXG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMub2JqbmFtZSA9PT0gXCJudW1iZXJcIikgOyBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IG9iam5hbWUgbXVzdCBiZSBhIHN0cmluZyBvciBhIGJ1ZmZlciwgZ290ICR7b3B0aW9ucy5vYmpuYW1lfWAsXG4gICAgKTtcbiAgfVxuICBpZiAob3B0aW9ucy5vYmpuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMub2JqbmFtZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgaWYgKG9wdGlvbnMuY29sdW1ucyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgXCJJbnZhbGlkIE9wdGlvbjogb2JqbmFtZSBpbmRleCBjYW5ub3QgYmUgY29tYmluZWQgd2l0aCBjb2x1bW5zIG9yIGJlIGRlZmluZWQgYXMgYSBmaWVsZFwiLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBIHN0cmluZyBvciBhIGJ1ZmZlclxuICAgICAgaWYgKG9wdGlvbnMuY29sdW1ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgXCJJbnZhbGlkIE9wdGlvbjogb2JqbmFtZSBmaWVsZCBtdXN0IGJlIGNvbWJpbmVkIHdpdGggY29sdW1ucyBvciBiZSBkZWZpbmVkIGFzIGFuIGluZGV4XCIsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYG9uX3JlY29yZGBcbiAgaWYgKG9wdGlvbnMub25fcmVjb3JkID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5vbl9yZWNvcmQgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLm9uX3JlY29yZCA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5vbl9yZWNvcmQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX09OX1JFQ09SRFwiLFxuICAgICAgW1xuICAgICAgICBcIkludmFsaWQgb3B0aW9uIGBvbl9yZWNvcmRgOlwiLFxuICAgICAgICBcImV4cGVjdCBhIGZ1bmN0aW9uLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5vbl9yZWNvcmQpfWAsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYG9uX3NraXBgXG4gIC8vIG9wdGlvbnMub25fc2tpcCA/Pz0gKGVyciwgY2h1bmspID0+IHtcbiAgLy8gICB0aGlzLmVtaXQoJ3NraXAnLCBlcnIsIGNodW5rKTtcbiAgLy8gfTtcbiAgaWYgKFxuICAgIG9wdGlvbnMub25fc2tpcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgb3B0aW9ucy5vbl9za2lwICE9PSBudWxsICYmXG4gICAgdHlwZW9mIG9wdGlvbnMub25fc2tpcCAhPT0gXCJmdW5jdGlvblwiXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogb25fc2tpcCBtdXN0IGJlIGEgZnVuY3Rpb24sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMub25fc2tpcCl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHF1b3RlYFxuICBpZiAoXG4gICAgb3B0aW9ucy5xdW90ZSA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMucXVvdGUgPT09IGZhbHNlIHx8XG4gICAgb3B0aW9ucy5xdW90ZSA9PT0gXCJcIlxuICApIHtcbiAgICBvcHRpb25zLnF1b3RlID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBpZiAob3B0aW9ucy5xdW90ZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucXVvdGUgPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnMucXVvdGUgPSBCdWZmZXIuZnJvbSgnXCInLCBvcHRpb25zLmVuY29kaW5nKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLnF1b3RlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBvcHRpb25zLnF1b3RlID0gQnVmZmVyLmZyb20ob3B0aW9ucy5xdW90ZSwgb3B0aW9ucy5lbmNvZGluZyk7XG4gICAgfVxuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucXVvdGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogcXVvdGUgbXVzdCBiZSBhIGJ1ZmZlciBvciBhIHN0cmluZywgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5xdW90ZSl9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHJhd2BcbiAgaWYgKFxuICAgIG9wdGlvbnMucmF3ID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnJhdyA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMucmF3ID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLnJhdyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMucmF3ICE9PSB0cnVlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiByYXcgbXVzdCBiZSB0cnVlLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJhdyl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHJlY29yZF9kZWxpbWl0ZXJgXG4gIGlmIChvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciA9IFtdO1xuICB9IGVsc2UgaWYgKFxuICAgIHR5cGVvZiBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPT09IFwic3RyaW5nXCIgfHxcbiAgICBCdWZmZXIuaXNCdWZmZXIob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyKVxuICApIHtcbiAgICBpZiAob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9SRUNPUkRfREVMSU1JVEVSXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBcIkludmFsaWQgb3B0aW9uIGByZWNvcmRfZGVsaW1pdGVyYDpcIixcbiAgICAgICAgICBcInZhbHVlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nIG9yIGJ1ZmZlcixcIixcbiAgICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyKX1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9XG4gICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gW29wdGlvbnMucmVjb3JkX2RlbGltaXRlcl07XG4gIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyKSkge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX1JFQ09SRF9ERUxJTUlURVJcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBgcmVjb3JkX2RlbGltaXRlcmA6XCIsXG4gICAgICAgIFwidmFsdWUgbXVzdCBiZSBhIHN0cmluZywgYSBidWZmZXIgb3IgYXJyYXkgb2Ygc3RyaW5nfGJ1ZmZlcixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucmVjb3JkX2RlbGltaXRlcil9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyLm1hcChmdW5jdGlvbiAocmQsIGkpIHtcbiAgICBpZiAodHlwZW9mIHJkICE9PSBcInN0cmluZ1wiICYmICFCdWZmZXIuaXNCdWZmZXIocmQpKSB7XG4gICAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX1JFQ09SRF9ERUxJTUlURVJcIixcbiAgICAgICAgW1xuICAgICAgICAgIFwiSW52YWxpZCBvcHRpb24gYHJlY29yZF9kZWxpbWl0ZXJgOlwiLFxuICAgICAgICAgIFwidmFsdWUgbXVzdCBiZSBhIHN0cmluZywgYSBidWZmZXIgb3IgYXJyYXkgb2Ygc3RyaW5nfGJ1ZmZlclwiLFxuICAgICAgICAgIGBhdCBpbmRleCAke2l9LGAsXG4gICAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KHJkKX1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHJkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9SRUNPUkRfREVMSU1JVEVSXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBcIkludmFsaWQgb3B0aW9uIGByZWNvcmRfZGVsaW1pdGVyYDpcIixcbiAgICAgICAgICBcInZhbHVlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nIG9yIGJ1ZmZlclwiLFxuICAgICAgICAgIGBhdCBpbmRleCAke2l9LGAsXG4gICAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KHJkKX1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiByZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcmQgPSBCdWZmZXIuZnJvbShyZCwgb3B0aW9ucy5lbmNvZGluZyk7XG4gICAgfVxuICAgIHJldHVybiByZDtcbiAgfSk7XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHJlbGF4X2NvbHVtbl9jb3VudGBcbiAgaWYgKHR5cGVvZiBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudCA9PT0gXCJib29sZWFuXCIpIDsgZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnQgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50ID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50ID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiByZWxheF9jb2x1bW5fY291bnQgbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50KX1gLFxuICAgICk7XG4gIH1cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9sZXNzID09PSBcImJvb2xlYW5cIikgOyBlbHNlIGlmIChcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9sZXNzID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9sZXNzID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50X2xlc3MgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHJlbGF4X2NvbHVtbl9jb3VudF9sZXNzIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9sZXNzKX1gLFxuICAgICk7XG4gIH1cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9tb3JlID09PSBcImJvb2xlYW5cIikgOyBlbHNlIGlmIChcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9tb3JlID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9tb3JlID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50X21vcmUgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHJlbGF4X2NvbHVtbl9jb3VudF9tb3JlIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9tb3JlKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcmVsYXhfcXVvdGVzYFxuICBpZiAodHlwZW9mIG9wdGlvbnMucmVsYXhfcXVvdGVzID09PSBcImJvb2xlYW5cIikgOyBlbHNlIGlmIChcbiAgICBvcHRpb25zLnJlbGF4X3F1b3RlcyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5yZWxheF9xdW90ZXMgPT09IG51bGxcbiAgKSB7XG4gICAgb3B0aW9ucy5yZWxheF9xdW90ZXMgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHJlbGF4X3F1b3RlcyBtdXN0IGJlIGEgYm9vbGVhbiwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5yZWxheF9xdW90ZXMpfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBza2lwX2VtcHR5X2xpbmVzYFxuICBpZiAodHlwZW9mIG9wdGlvbnMuc2tpcF9lbXB0eV9saW5lcyA9PT0gXCJib29sZWFuXCIpIDsgZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5za2lwX2VtcHR5X2xpbmVzID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnNraXBfZW1wdHlfbGluZXMgPT09IG51bGxcbiAgKSB7XG4gICAgb3B0aW9ucy5za2lwX2VtcHR5X2xpbmVzID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiBza2lwX2VtcHR5X2xpbmVzIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnNraXBfZW1wdHlfbGluZXMpfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBza2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXNgXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5za2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXMgPT09IFwiYm9vbGVhblwiKSA7IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2VtcHR5X3ZhbHVlcyA9PT0gbnVsbFxuICApIHtcbiAgICBvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2VtcHR5X3ZhbHVlcyA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2VtcHR5X3ZhbHVlcyl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHNraXBfcmVjb3Jkc193aXRoX2Vycm9yYFxuICBpZiAodHlwZW9mIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgPT09IFwiYm9vbGVhblwiKSA7IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgPT09IG51bGxcbiAgKSB7XG4gICAgb3B0aW9ucy5za2lwX3JlY29yZHNfd2l0aF9lcnJvciA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IpfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBydHJpbWBcbiAgaWYgKFxuICAgIG9wdGlvbnMucnRyaW0gPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMucnRyaW0gPT09IG51bGwgfHxcbiAgICBvcHRpb25zLnJ0cmltID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLnJ0cmltID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5ydHJpbSAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogcnRyaW0gbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucnRyaW0pfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBsdHJpbWBcbiAgaWYgKFxuICAgIG9wdGlvbnMubHRyaW0gPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMubHRyaW0gPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmx0cmltID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLmx0cmltID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5sdHJpbSAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogbHRyaW0gbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMubHRyaW0pfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGB0cmltYFxuICBpZiAoXG4gICAgb3B0aW9ucy50cmltID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnRyaW0gPT09IG51bGwgfHxcbiAgICBvcHRpb25zLnRyaW0gPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMudHJpbSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMudHJpbSAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogdHJpbSBtdXN0IGJlIGEgYm9vbGVhbiwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy50cmltKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbnMgYHRyaW1gLCBgbHRyaW1gIGFuZCBgcnRyaW1gXG4gIGlmIChvcHRpb25zLnRyaW0gPT09IHRydWUgJiYgb3B0cy5sdHJpbSAhPT0gZmFsc2UpIHtcbiAgICBvcHRpb25zLmx0cmltID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmx0cmltICE9PSB0cnVlKSB7XG4gICAgb3B0aW9ucy5sdHJpbSA9IGZhbHNlO1xuICB9XG4gIGlmIChvcHRpb25zLnRyaW0gPT09IHRydWUgJiYgb3B0cy5ydHJpbSAhPT0gZmFsc2UpIHtcbiAgICBvcHRpb25zLnJ0cmltID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLnJ0cmltICE9PSB0cnVlKSB7XG4gICAgb3B0aW9ucy5ydHJpbSA9IGZhbHNlO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHRvYFxuICBpZiAob3B0aW9ucy50byA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMudG8gPT09IG51bGwpIHtcbiAgICBvcHRpb25zLnRvID0gLTE7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnRvID09PSBcInN0cmluZ1wiICYmIC9cXGQrLy50ZXN0KG9wdGlvbnMudG8pKSB7XG4gICAgICBvcHRpb25zLnRvID0gcGFyc2VJbnQob3B0aW9ucy50byk7XG4gICAgfVxuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMudG8pKSB7XG4gICAgICBpZiAob3B0aW9ucy50byA8PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCBPcHRpb246IHRvIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiAwLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRzLnRvKX1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogdG8gbXVzdCBiZSBhbiBpbnRlZ2VyLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRzLnRvKX1gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgdG9fbGluZWBcbiAgaWYgKG9wdGlvbnMudG9fbGluZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMudG9fbGluZSA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMudG9fbGluZSA9IC0xO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy50b19saW5lID09PSBcInN0cmluZ1wiICYmIC9cXGQrLy50ZXN0KG9wdGlvbnMudG9fbGluZSkpIHtcbiAgICAgIG9wdGlvbnMudG9fbGluZSA9IHBhcnNlSW50KG9wdGlvbnMudG9fbGluZSk7XG4gICAgfVxuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMudG9fbGluZSkpIHtcbiAgICAgIGlmIChvcHRpb25zLnRvX2xpbmUgPD0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgT3B0aW9uOiB0b19saW5lIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiAwLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRzLnRvX2xpbmUpfWAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEludmFsaWQgT3B0aW9uOiB0b19saW5lIG11c3QgYmUgYW4gaW50ZWdlciwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0cy50b19saW5lKX1gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5jb25zdCBpc1JlY29yZEVtcHR5ID0gZnVuY3Rpb24gKHJlY29yZCkge1xuICByZXR1cm4gcmVjb3JkLmV2ZXJ5KFxuICAgIChmaWVsZCkgPT5cbiAgICAgIGZpZWxkID09IG51bGwgfHwgKGZpZWxkLnRvU3RyaW5nICYmIGZpZWxkLnRvU3RyaW5nKCkudHJpbSgpID09PSBcIlwiKSxcbiAgKTtcbn07XG5cbmNvbnN0IGNyID0gMTM7IC8vIGBcXHJgLCBjYXJyaWFnZSByZXR1cm4sIDB4MEQgaW4gaGV4YWTDqWNpbWFsLCAxMyBpbiBkZWNpbWFsXG5jb25zdCBubCA9IDEwOyAvLyBgXFxuYCwgbmV3bGluZSwgMHgwQSBpbiBoZXhhZGVjaW1hbCwgMTAgaW4gZGVjaW1hbFxuXG5jb25zdCBib21zID0ge1xuICAvLyBOb3RlLCB0aGUgZm9sbG93aW5nIGFyZSBlcXVhbHM6XG4gIC8vIEJ1ZmZlci5mcm9tKFwiXFx1ZmVmZlwiKVxuICAvLyBCdWZmZXIuZnJvbShbMjM5LCAxODcsIDE5MV0pXG4gIC8vIEJ1ZmZlci5mcm9tKCdFRkJCQkYnLCAnaGV4JylcbiAgdXRmODogQnVmZmVyLmZyb20oWzIzOSwgMTg3LCAxOTFdKSxcbiAgLy8gTm90ZSwgdGhlIGZvbGxvd2luZyBhcmUgZXF1YWxzOlxuICAvLyBCdWZmZXIuZnJvbSBcIlxcdWZlZmZcIiwgJ3V0ZjE2bGVcbiAgLy8gQnVmZmVyLmZyb20oWzI1NSwgMjU0XSlcbiAgdXRmMTZsZTogQnVmZmVyLmZyb20oWzI1NSwgMjU0XSksXG59O1xuXG5jb25zdCB0cmFuc2Zvcm0gPSBmdW5jdGlvbiAob3JpZ2luYWxfb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGluZm8gPSB7XG4gICAgYnl0ZXM6IDAsXG4gICAgY29tbWVudF9saW5lczogMCxcbiAgICBlbXB0eV9saW5lczogMCxcbiAgICBpbnZhbGlkX2ZpZWxkX2xlbmd0aDogMCxcbiAgICBsaW5lczogMSxcbiAgICByZWNvcmRzOiAwLFxuICB9O1xuICBjb25zdCBvcHRpb25zID0gbm9ybWFsaXplX29wdGlvbnMob3JpZ2luYWxfb3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgaW5mbzogaW5mbyxcbiAgICBvcmlnaW5hbF9vcHRpb25zOiBvcmlnaW5hbF9vcHRpb25zLFxuICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgc3RhdGU6IGluaXRfc3RhdGUob3B0aW9ucyksXG4gICAgX19uZWVkTW9yZURhdGE6IGZ1bmN0aW9uIChpLCBidWZMZW4sIGVuZCkge1xuICAgICAgaWYgKGVuZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgeyBlbmNvZGluZywgZXNjYXBlLCBxdW90ZSB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgeyBxdW90aW5nLCBuZWVkTW9yZURhdGFTaXplLCByZWNvcmREZWxpbWl0ZXJNYXhMZW5ndGggfSA9XG4gICAgICAgIHRoaXMuc3RhdGU7XG4gICAgICBjb25zdCBudW1PZkNoYXJMZWZ0ID0gYnVmTGVuIC0gaSAtIDE7XG4gICAgICBjb25zdCByZXF1aXJlZExlbmd0aCA9IE1hdGgubWF4KFxuICAgICAgICBuZWVkTW9yZURhdGFTaXplLFxuICAgICAgICAvLyBTa2lwIGlmIHRoZSByZW1haW5pbmcgYnVmZmVyIHNtYWxsZXIgdGhhbiByZWNvcmQgZGVsaW1pdGVyXG4gICAgICAgIC8vIElmIFwicmVjb3JkX2RlbGltaXRlclwiIGlzIHlldCB0byBiZSBkaXNjb3ZlcmVkOlxuICAgICAgICAvLyAxLiBJdCBpcyBlcXVhbHMgdG8gYFtdYCBhbmQgXCJyZWNvcmREZWxpbWl0ZXJNYXhMZW5ndGhcIiBlcXVhbHMgYDBgXG4gICAgICAgIC8vIDIuIFdlIHNldCB0aGUgbGVuZ3RoIHRvIHdpbmRvd3MgbGluZSBlbmRpbmcgaW4gdGhlIGN1cnJlbnQgZW5jb2RpbmdcbiAgICAgICAgLy8gTm90ZSwgdGhhdCBlbmNvZGluZyBpcyBrbm93biBmcm9tIHVzZXIgb3IgYm9tIGRpc2NvdmVyeSBhdCB0aGF0IHBvaW50XG4gICAgICAgIC8vIHJlY29yZERlbGltaXRlck1heExlbmd0aCxcbiAgICAgICAgcmVjb3JkRGVsaW1pdGVyTWF4TGVuZ3RoID09PSAwXG4gICAgICAgICAgPyBCdWZmZXIuZnJvbShcIlxcclxcblwiLCBlbmNvZGluZykubGVuZ3RoXG4gICAgICAgICAgOiByZWNvcmREZWxpbWl0ZXJNYXhMZW5ndGgsXG4gICAgICAgIC8vIFNraXAgaWYgcmVtYWluaW5nIGJ1ZmZlciBjYW4gYmUgYW4gZXNjYXBlZCBxdW90ZVxuICAgICAgICBxdW90aW5nID8gKGVzY2FwZSA9PT0gbnVsbCA/IDAgOiBlc2NhcGUubGVuZ3RoKSArIHF1b3RlLmxlbmd0aCA6IDAsXG4gICAgICAgIC8vIFNraXAgaWYgcmVtYWluaW5nIGJ1ZmZlciBjYW4gYmUgcmVjb3JkIGRlbGltaXRlciBmb2xsb3dpbmcgdGhlIGNsb3NpbmcgcXVvdGVcbiAgICAgICAgcXVvdGluZyA/IHF1b3RlLmxlbmd0aCArIHJlY29yZERlbGltaXRlck1heExlbmd0aCA6IDAsXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bU9mQ2hhckxlZnQgPCByZXF1aXJlZExlbmd0aDtcbiAgICB9LFxuICAgIC8vIENlbnRyYWwgcGFyc2VyIGltcGxlbWVudGF0aW9uXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChuZXh0QnVmLCBlbmQsIHB1c2gsIGNsb3NlKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGJvbSxcbiAgICAgICAgY29tbWVudF9ub19pbmZpeCxcbiAgICAgICAgZW5jb2RpbmcsXG4gICAgICAgIGZyb21fbGluZSxcbiAgICAgICAgbHRyaW0sXG4gICAgICAgIG1heF9yZWNvcmRfc2l6ZSxcbiAgICAgICAgcmF3LFxuICAgICAgICByZWxheF9xdW90ZXMsXG4gICAgICAgIHJ0cmltLFxuICAgICAgICBza2lwX2VtcHR5X2xpbmVzLFxuICAgICAgICB0byxcbiAgICAgICAgdG9fbGluZSxcbiAgICAgIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBsZXQgeyBjb21tZW50LCBlc2NhcGUsIHF1b3RlLCByZWNvcmRfZGVsaW1pdGVyIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBjb25zdCB7IGJvbVNraXBwZWQsIHByZXZpb3VzQnVmLCByYXdCdWZmZXIsIGVzY2FwZUlzUXVvdGUgfSA9IHRoaXMuc3RhdGU7XG4gICAgICBsZXQgYnVmO1xuICAgICAgaWYgKHByZXZpb3VzQnVmID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG5leHRCdWYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIEhhbmRsZSBlbXB0eSBzdHJpbmdcbiAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWYgPSBuZXh0QnVmO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzQnVmICE9PSB1bmRlZmluZWQgJiYgbmV4dEJ1ZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJ1ZiA9IHByZXZpb3VzQnVmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmID0gQnVmZmVyLmNvbmNhdChbcHJldmlvdXNCdWYsIG5leHRCdWZdKTtcbiAgICAgIH1cbiAgICAgIC8vIEhhbmRsZSBVVEYgQk9NXG4gICAgICBpZiAoYm9tU2tpcHBlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGJvbSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLmJvbVNraXBwZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGJ1Zi5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgLy8gTm8gZW5vdWdoIGRhdGFcbiAgICAgICAgICBpZiAoZW5kID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gV2FpdCBmb3IgbW9yZSBkYXRhXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnByZXZpb3VzQnVmID0gYnVmO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGVuY29kaW5nIGluIGJvbXMpIHtcbiAgICAgICAgICAgIGlmIChib21zW2VuY29kaW5nXS5jb21wYXJlKGJ1ZiwgMCwgYm9tc1tlbmNvZGluZ10ubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAvLyBTa2lwIEJPTVxuICAgICAgICAgICAgICBjb25zdCBib21MZW5ndGggPSBib21zW2VuY29kaW5nXS5sZW5ndGg7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuYnVmQnl0ZXNTdGFydCArPSBib21MZW5ndGg7XG4gICAgICAgICAgICAgIGJ1ZiA9IGJ1Zi5zbGljZShib21MZW5ndGgpO1xuICAgICAgICAgICAgICAvLyBSZW5vcm1hbGl6ZSBvcmlnaW5hbCBvcHRpb25zIHdpdGggdGhlIG5ldyBlbmNvZGluZ1xuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBub3JtYWxpemVfb3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5vcmlnaW5hbF9vcHRpb25zLFxuICAgICAgICAgICAgICAgIGVuY29kaW5nOiBlbmNvZGluZyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIC8vIE9wdGlvbnMgd2lsbCByZS1ldmFsdWF0ZSB0aGUgQnVmZmVyIHdpdGggdGhlIG5ldyBlbmNvZGluZ1xuICAgICAgICAgICAgICAoeyBjb21tZW50LCBlc2NhcGUsIHF1b3RlIH0gPSB0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zdGF0ZS5ib21Ta2lwcGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgYnVmTGVuID0gYnVmLmxlbmd0aDtcbiAgICAgIGxldCBwb3M7XG4gICAgICBmb3IgKHBvcyA9IDA7IHBvcyA8IGJ1ZkxlbjsgcG9zKyspIHtcbiAgICAgICAgLy8gRW5zdXJlIHdlIGdldCBlbm91Z2ggc3BhY2UgdG8gbG9vayBhaGVhZFxuICAgICAgICAvLyBUaGVyZSBzaG91bGQgYmUgYSB3YXkgdG8gbW92ZSB0aGlzIG91dCBvZiB0aGUgbG9vcFxuICAgICAgICBpZiAodGhpcy5fX25lZWRNb3JlRGF0YShwb3MsIGJ1ZkxlbiwgZW5kKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLndhc1Jvd0RlbGltaXRlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuaW5mby5saW5lcysrO1xuICAgICAgICAgIHRoaXMuc3RhdGUud2FzUm93RGVsaW1pdGVyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvX2xpbmUgIT09IC0xICYmIHRoaXMuaW5mby5saW5lcyA+IHRvX2xpbmUpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnN0b3AgPSB0cnVlO1xuICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIEF1dG8gZGlzY292ZXJ5IG9mIHJlY29yZF9kZWxpbWl0ZXIsIHVuaXgsIG1hYyBhbmQgd2luZG93cyBzdXBwb3J0ZWRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucXVvdGluZyA9PT0gZmFsc2UgJiYgcmVjb3JkX2RlbGltaXRlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBjb25zdCByZWNvcmRfZGVsaW1pdGVyQ291bnQgPSB0aGlzLl9fYXV0b0Rpc2NvdmVyUmVjb3JkRGVsaW1pdGVyKFxuICAgICAgICAgICAgYnVmLFxuICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHJlY29yZF9kZWxpbWl0ZXJDb3VudCkge1xuICAgICAgICAgICAgcmVjb3JkX2RlbGltaXRlciA9IHRoaXMub3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjaHIgPSBidWZbcG9zXTtcbiAgICAgICAgaWYgKHJhdyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHJhd0J1ZmZlci5hcHBlbmQoY2hyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgKGNociA9PT0gY3IgfHwgY2hyID09PSBubCkgJiZcbiAgICAgICAgICB0aGlzLnN0YXRlLndhc1Jvd0RlbGltaXRlciA9PT0gZmFsc2VcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS53YXNSb3dEZWxpbWl0ZXIgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFByZXZpb3VzIGNoYXIgd2FzIGEgdmFsaWQgZXNjYXBlIGNoYXJcbiAgICAgICAgLy8gdHJlYXQgdGhlIGN1cnJlbnQgY2hhciBhcyBhIHJlZ3VsYXIgY2hhclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5lc2NhcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUuZXNjYXBpbmcgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFc2NhcGUgaXMgb25seSBhY3RpdmUgaW5zaWRlIHF1b3RlZCBmaWVsZHNcbiAgICAgICAgICAvLyBXZSBhcmUgcXVvdGluZywgdGhlIGNoYXIgaXMgYW4gZXNjYXBlIGNociBhbmQgdGhlcmUgaXMgYSBjaHIgdG8gZXNjYXBlXG4gICAgICAgICAgLy8gaWYoZXNjYXBlICE9PSBudWxsICYmIHRoaXMuc3RhdGUucXVvdGluZyA9PT0gdHJ1ZSAmJiBjaHIgPT09IGVzY2FwZSAmJiBwb3MgKyAxIDwgYnVmTGVuKXtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBlc2NhcGUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucXVvdGluZyA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5fX2lzRXNjYXBlKGJ1ZiwgcG9zLCBjaHIpICYmXG4gICAgICAgICAgICBwb3MgKyBlc2NhcGUubGVuZ3RoIDwgYnVmTGVuXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoZXNjYXBlSXNRdW90ZSkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5fX2lzUXVvdGUoYnVmLCBwb3MgKyBlc2NhcGUubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXNjYXBpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBvcyArPSBlc2NhcGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lc2NhcGluZyA9IHRydWU7XG4gICAgICAgICAgICAgIHBvcyArPSBlc2NhcGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIE5vdCBjdXJyZW50bHkgZXNjYXBpbmcgYW5kIGNociBpcyBhIHF1b3RlXG4gICAgICAgICAgLy8gVE9ETzogbmVlZCB0byBjb21wYXJlIGJ5dGVzIGluc3RlYWQgb2Ygc2luZ2xlIGNoYXJcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5jb21tZW50aW5nID09PSBmYWxzZSAmJiB0aGlzLl9faXNRdW90ZShidWYsIHBvcykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnF1b3RpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgY29uc3QgbmV4dENociA9IGJ1Zltwb3MgKyBxdW90ZS5sZW5ndGhdO1xuICAgICAgICAgICAgICBjb25zdCBpc05leHRDaHJUcmltYWJsZSA9XG4gICAgICAgICAgICAgICAgcnRyaW0gJiYgdGhpcy5fX2lzQ2hhclRyaW1hYmxlKGJ1ZiwgcG9zICsgcXVvdGUubGVuZ3RoKTtcbiAgICAgICAgICAgICAgY29uc3QgaXNOZXh0Q2hyQ29tbWVudCA9XG4gICAgICAgICAgICAgICAgY29tbWVudCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuX19jb21wYXJlQnl0ZXMoY29tbWVudCwgYnVmLCBwb3MgKyBxdW90ZS5sZW5ndGgsIG5leHRDaHIpO1xuICAgICAgICAgICAgICBjb25zdCBpc05leHRDaHJEZWxpbWl0ZXIgPSB0aGlzLl9faXNEZWxpbWl0ZXIoXG4gICAgICAgICAgICAgICAgYnVmLFxuICAgICAgICAgICAgICAgIHBvcyArIHF1b3RlLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBuZXh0Q2hyLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBjb25zdCBpc05leHRDaHJSZWNvcmREZWxpbWl0ZXIgPVxuICAgICAgICAgICAgICAgIHJlY29yZF9kZWxpbWl0ZXIubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgICA/IHRoaXMuX19hdXRvRGlzY292ZXJSZWNvcmREZWxpbWl0ZXIoYnVmLCBwb3MgKyBxdW90ZS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICA6IHRoaXMuX19pc1JlY29yZERlbGltaXRlcihuZXh0Q2hyLCBidWYsIHBvcyArIHF1b3RlLmxlbmd0aCk7XG4gICAgICAgICAgICAgIC8vIEVzY2FwZSBhIHF1b3RlXG4gICAgICAgICAgICAgIC8vIFRyZWF0IG5leHQgY2hhciBhcyBhIHJlZ3VsYXIgY2hhcmFjdGVyXG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBlc2NhcGUgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNFc2NhcGUoYnVmLCBwb3MsIGNocikgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNRdW90ZShidWYsIHBvcyArIGVzY2FwZS5sZW5ndGgpXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHBvcyArPSBlc2NhcGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAhbmV4dENociB8fFxuICAgICAgICAgICAgICAgIGlzTmV4dENockRlbGltaXRlciB8fFxuICAgICAgICAgICAgICAgIGlzTmV4dENoclJlY29yZERlbGltaXRlciB8fFxuICAgICAgICAgICAgICAgIGlzTmV4dENockNvbW1lbnQgfHxcbiAgICAgICAgICAgICAgICBpc05leHRDaHJUcmltYWJsZVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnF1b3RpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLndhc1F1b3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBvcyArPSBxdW90ZS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlbGF4X3F1b3RlcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSB0aGlzLl9fZXJyb3IoXG4gICAgICAgICAgICAgICAgICBuZXcgQ3N2RXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiQ1NWX0lOVkFMSURfQ0xPU0lOR19RVU9URVwiLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIENsb3NpbmcgUXVvdGU6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgYGdvdCBcIiR7U3RyaW5nLmZyb21DaGFyQ29kZShuZXh0Q2hyKX1cImAsXG4gICAgICAgICAgICAgICAgICAgICAgYGF0IGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgICAgICAgICBcImluc3RlYWQgb2YgZGVsaW1pdGVyLCByZWNvcmQgZGVsaW1pdGVyLCB0cmltYWJsZSBjaGFyYWN0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICBcIihpZiBhY3RpdmF0ZWQpIG9yIGNvbW1lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKGVyciAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXJyO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucXVvdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUud2FzUXVvdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5wcmVwZW5kKHF1b3RlKTtcbiAgICAgICAgICAgICAgICBwb3MgKz0gcXVvdGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZmllbGQubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gSW4gcmVsYXhfcXVvdGVzIG1vZGUsIHRyZWF0IG9wZW5pbmcgcXVvdGUgcHJlY2VkZWQgYnkgY2hycyBhcyByZWd1bGFyXG4gICAgICAgICAgICAgICAgaWYgKHJlbGF4X3F1b3RlcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9faW5mb0ZpZWxkKCk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBib20gPSBPYmplY3Qua2V5cyhib21zKVxuICAgICAgICAgICAgICAgICAgICAubWFwKChiKSA9PlxuICAgICAgICAgICAgICAgICAgICAgIGJvbXNbYl0uZXF1YWxzKHRoaXMuc3RhdGUuZmllbGQudG9TdHJpbmcoKSkgPyBiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVswXTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IHRoaXMuX19lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgbmV3IENzdkVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgIFwiSU5WQUxJRF9PUEVOSU5HX1FVT1RFXCIsXG4gICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIE9wZW5pbmcgUXVvdGU6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBgYSBxdW90ZSBpcyBmb3VuZCBvbiBmaWVsZCAke0pTT04uc3RyaW5naWZ5KGluZm8uY29sdW1uKX0gYXQgbGluZSAke2luZm8ubGluZXN9LCB2YWx1ZSBpcyAke0pTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUuZmllbGQudG9TdHJpbmcoZW5jb2RpbmcpKX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9tID8gYCgke2JvbX0gYm9tKWAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogdGhpcy5zdGF0ZS5maWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5xdW90aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwb3MgKz0gcXVvdGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5xdW90aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkRGVsaW1pdGVyTGVuZ3RoID0gdGhpcy5fX2lzUmVjb3JkRGVsaW1pdGVyKFxuICAgICAgICAgICAgICBjaHIsXG4gICAgICAgICAgICAgIGJ1ZixcbiAgICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChyZWNvcmREZWxpbWl0ZXJMZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgLy8gRG8gbm90IGVtaXQgY29tbWVudHMgd2hpY2ggdGFrZSBhIGZ1bGwgbGluZVxuICAgICAgICAgICAgICBjb25zdCBza2lwQ29tbWVudExpbmUgPVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuY29tbWVudGluZyAmJlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUud2FzUXVvdGluZyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmZpZWxkLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgICAgaWYgKHNraXBDb21tZW50TGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5jb21tZW50X2xpbmVzKys7XG4gICAgICAgICAgICAgICAgLy8gU2tpcCBmdWxsIGNvbW1lbnQgbGluZVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEFjdGl2YXRlIHJlY29yZHMgZW1pdGlvbiBpZiBhYm92ZSBmcm9tX2xpbmVcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVuYWJsZWQgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICAgICB0aGlzLmluZm8ubGluZXMgK1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5zdGF0ZS53YXNSb3dEZWxpbWl0ZXIgPT09IHRydWUgPyAxIDogMCkgPj1cbiAgICAgICAgICAgICAgICAgICAgZnJvbV9saW5lXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgdGhpcy5fX3Jlc2V0RmllbGQoKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX19yZXNldFJlY29yZCgpO1xuICAgICAgICAgICAgICAgICAgcG9zICs9IHJlY29yZERlbGltaXRlckxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gU2tpcCBpZiBsaW5lIGlzIGVtcHR5IGFuZCBza2lwX2VtcHR5X2xpbmVzIGFjdGl2YXRlZFxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIHNraXBfZW1wdHlfbGluZXMgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUud2FzUXVvdGluZyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5sZW5ndGggPT09IDBcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuaW5mby5lbXB0eV9saW5lcysrO1xuICAgICAgICAgICAgICAgICAgcG9zICs9IHJlY29yZERlbGltaXRlckxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmJ5dGVzID0gdGhpcy5zdGF0ZS5idWZCeXRlc1N0YXJ0ICsgcG9zO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyckZpZWxkID0gdGhpcy5fX29uRmllbGQoKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyRmllbGQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVyckZpZWxkO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5ieXRlcyA9XG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmJ1ZkJ5dGVzU3RhcnQgKyBwb3MgKyByZWNvcmREZWxpbWl0ZXJMZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyUmVjb3JkID0gdGhpcy5fX29uUmVjb3JkKHB1c2gpO1xuICAgICAgICAgICAgICAgIGlmIChlcnJSZWNvcmQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVyclJlY29yZDtcbiAgICAgICAgICAgICAgICBpZiAodG8gIT09IC0xICYmIHRoaXMuaW5mby5yZWNvcmRzID49IHRvKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnN0b3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jb21tZW50aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgIHBvcyArPSByZWNvcmREZWxpbWl0ZXJMZW5ndGggLSAxO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmNvbW1lbnRpbmcpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGNvbW1lbnQgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgKGNvbW1lbnRfbm9faW5maXggPT09IGZhbHNlIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5sZW5ndGggPT09IDApKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbW1lbnRDb3VudCA9IHRoaXMuX19jb21wYXJlQnl0ZXMoY29tbWVudCwgYnVmLCBwb3MsIGNocik7XG4gICAgICAgICAgICAgIGlmIChjb21tZW50Q291bnQgIT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmNvbW1lbnRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkZWxpbWl0ZXJMZW5ndGggPSB0aGlzLl9faXNEZWxpbWl0ZXIoYnVmLCBwb3MsIGNocik7XG4gICAgICAgICAgICBpZiAoZGVsaW1pdGVyTGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgIHRoaXMuaW5mby5ieXRlcyA9IHRoaXMuc3RhdGUuYnVmQnl0ZXNTdGFydCArIHBvcztcbiAgICAgICAgICAgICAgY29uc3QgZXJyRmllbGQgPSB0aGlzLl9fb25GaWVsZCgpO1xuICAgICAgICAgICAgICBpZiAoZXJyRmllbGQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVyckZpZWxkO1xuICAgICAgICAgICAgICBwb3MgKz0gZGVsaW1pdGVyTGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmNvbW1lbnRpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbWF4X3JlY29yZF9zaXplICE9PSAwICYmXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnJlY29yZF9sZW5ndGggKyB0aGlzLnN0YXRlLmZpZWxkLmxlbmd0aCA+IG1heF9yZWNvcmRfc2l6ZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19lcnJvcihcbiAgICAgICAgICAgICAgbmV3IENzdkVycm9yKFxuICAgICAgICAgICAgICAgIFwiQ1NWX01BWF9SRUNPUkRfU0laRVwiLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIFwiTWF4IFJlY29yZCBTaXplOlwiLFxuICAgICAgICAgICAgICAgICAgXCJyZWNvcmQgZXhjZWVkIHRoZSBtYXhpbXVtIG51bWJlciBvZiB0b2xlcmF0ZWQgYnl0ZXNcIixcbiAgICAgICAgICAgICAgICAgIGBvZiAke21heF9yZWNvcmRfc2l6ZX1gLFxuICAgICAgICAgICAgICAgICAgYGF0IGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYXBwZW5kID1cbiAgICAgICAgICBsdHJpbSA9PT0gZmFsc2UgfHxcbiAgICAgICAgICB0aGlzLnN0YXRlLnF1b3RpbmcgPT09IHRydWUgfHxcbiAgICAgICAgICB0aGlzLnN0YXRlLmZpZWxkLmxlbmd0aCAhPT0gMCB8fFxuICAgICAgICAgICF0aGlzLl9faXNDaGFyVHJpbWFibGUoYnVmLCBwb3MpO1xuICAgICAgICAvLyBydHJpbSBpbiBub24gcXVvdGluZyBpcyBoYW5kbGUgaW4gX19vbkZpZWxkXG4gICAgICAgIGNvbnN0IHJhcHBlbmQgPSBydHJpbSA9PT0gZmFsc2UgfHwgdGhpcy5zdGF0ZS53YXNRdW90aW5nID09PSBmYWxzZTtcbiAgICAgICAgaWYgKGxhcHBlbmQgPT09IHRydWUgJiYgcmFwcGVuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUuZmllbGQuYXBwZW5kKGNocik7XG4gICAgICAgIH0gZWxzZSBpZiAocnRyaW0gPT09IHRydWUgJiYgIXRoaXMuX19pc0NoYXJUcmltYWJsZShidWYsIHBvcykpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fX2Vycm9yKFxuICAgICAgICAgICAgbmV3IENzdkVycm9yKFxuICAgICAgICAgICAgICBcIkNTVl9OT05fVFJJTUFCTEVfQ0hBUl9BRlRFUl9DTE9TSU5HX1FVT1RFXCIsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcIkludmFsaWQgQ2xvc2luZyBRdW90ZTpcIixcbiAgICAgICAgICAgICAgICBcImZvdW5kIG5vbiB0cmltYWJsZSBieXRlIGFmdGVyIHF1b3RlXCIsXG4gICAgICAgICAgICAgICAgYGF0IGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGxhcHBlbmQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwb3MgKz0gdGhpcy5fX2lzQ2hhclRyaW1hYmxlKGJ1ZiwgcG9zKSAtIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZW5kID09PSB0cnVlKSB7XG4gICAgICAgIC8vIEVuc3VyZSB3ZSBhcmUgbm90IGVuZGluZyBpbiBhIHF1b3Rpbmcgc3RhdGVcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucXVvdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IHRoaXMuX19lcnJvcihcbiAgICAgICAgICAgIG5ldyBDc3ZFcnJvcihcbiAgICAgICAgICAgICAgXCJDU1ZfUVVPVEVfTk9UX0NMT1NFRFwiLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgXCJRdW90ZSBOb3QgQ2xvc2VkOlwiLFxuICAgICAgICAgICAgICAgIGB0aGUgcGFyc2luZyBpcyBmaW5pc2hlZCB3aXRoIGFuIG9wZW5pbmcgcXVvdGUgYXQgbGluZSAke3RoaXMuaW5mby5saW5lc31gLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgIHRoaXMuX19pbmZvRmllbGQoKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHJldHVybiBlcnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU2tpcCBsYXN0IGxpbmUgaWYgaXQgaGFzIG5vIGNoYXJhY3RlcnNcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnN0YXRlLndhc1F1b3RpbmcgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCAhPT0gMCB8fFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5sZW5ndGggIT09IDBcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuaW5mby5ieXRlcyA9IHRoaXMuc3RhdGUuYnVmQnl0ZXNTdGFydCArIHBvcztcbiAgICAgICAgICAgIGNvbnN0IGVyckZpZWxkID0gdGhpcy5fX29uRmllbGQoKTtcbiAgICAgICAgICAgIGlmIChlcnJGaWVsZCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXJyRmllbGQ7XG4gICAgICAgICAgICBjb25zdCBlcnJSZWNvcmQgPSB0aGlzLl9fb25SZWNvcmQocHVzaCk7XG4gICAgICAgICAgICBpZiAoZXJyUmVjb3JkICE9PSB1bmRlZmluZWQpIHJldHVybiBlcnJSZWNvcmQ7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLndhc1Jvd0RlbGltaXRlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbmZvLmVtcHR5X2xpbmVzKys7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmNvbW1lbnRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5mby5jb21tZW50X2xpbmVzKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlLmJ1ZkJ5dGVzU3RhcnQgKz0gcG9zO1xuICAgICAgICB0aGlzLnN0YXRlLnByZXZpb3VzQnVmID0gYnVmLnNsaWNlKHBvcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGF0ZS53YXNSb3dEZWxpbWl0ZXIgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5pbmZvLmxpbmVzKys7XG4gICAgICAgIHRoaXMuc3RhdGUud2FzUm93RGVsaW1pdGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX29uUmVjb3JkOiBmdW5jdGlvbiAocHVzaCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBjb2x1bW5zLFxuICAgICAgICBncm91cF9jb2x1bW5zX2J5X25hbWUsXG4gICAgICAgIGVuY29kaW5nLFxuICAgICAgICBpbmZvLFxuICAgICAgICBmcm9tLFxuICAgICAgICByZWxheF9jb2x1bW5fY291bnQsXG4gICAgICAgIHJlbGF4X2NvbHVtbl9jb3VudF9sZXNzLFxuICAgICAgICByZWxheF9jb2x1bW5fY291bnRfbW9yZSxcbiAgICAgICAgcmF3LFxuICAgICAgICBza2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXMsXG4gICAgICB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgeyBlbmFibGVkLCByZWNvcmQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICBpZiAoZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19yZXNldFJlY29yZCgpO1xuICAgICAgfVxuICAgICAgLy8gQ29udmVydCB0aGUgZmlyc3QgbGluZSBpbnRvIGNvbHVtbiBuYW1lc1xuICAgICAgY29uc3QgcmVjb3JkTGVuZ3RoID0gcmVjb3JkLmxlbmd0aDtcbiAgICAgIGlmIChjb2x1bW5zID09PSB0cnVlKSB7XG4gICAgICAgIGlmIChza2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXMgPT09IHRydWUgJiYgaXNSZWNvcmRFbXB0eShyZWNvcmQpKSB7XG4gICAgICAgICAgdGhpcy5fX3Jlc2V0UmVjb3JkKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9fZmlyc3RMaW5lVG9Db2x1bW5zKHJlY29yZCk7XG4gICAgICB9XG4gICAgICBpZiAoY29sdW1ucyA9PT0gZmFsc2UgJiYgdGhpcy5pbmZvLnJlY29yZHMgPT09IDApIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5leHBlY3RlZFJlY29yZExlbmd0aCA9IHJlY29yZExlbmd0aDtcbiAgICAgIH1cbiAgICAgIGlmIChyZWNvcmRMZW5ndGggIT09IHRoaXMuc3RhdGUuZXhwZWN0ZWRSZWNvcmRMZW5ndGgpIHtcbiAgICAgICAgY29uc3QgZXJyID1cbiAgICAgICAgICBjb2x1bW5zID09PSBmYWxzZVxuICAgICAgICAgICAgPyBuZXcgQ3N2RXJyb3IoXG4gICAgICAgICAgICAgICAgXCJDU1ZfUkVDT1JEX0lOQ09OU0lTVEVOVF9GSUVMRFNfTEVOR1RIXCIsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIFJlY29yZCBMZW5ndGg6XCIsXG4gICAgICAgICAgICAgICAgICBgZXhwZWN0ICR7dGhpcy5zdGF0ZS5leHBlY3RlZFJlY29yZExlbmd0aH0sYCxcbiAgICAgICAgICAgICAgICAgIGBnb3QgJHtyZWNvcmRMZW5ndGh9IG9uIGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcmVjb3JkOiByZWNvcmQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiBuZXcgQ3N2RXJyb3IoXG4gICAgICAgICAgICAgICAgXCJDU1ZfUkVDT1JEX0lOQ09OU0lTVEVOVF9DT0xVTU5TXCIsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIFJlY29yZCBMZW5ndGg6XCIsXG4gICAgICAgICAgICAgICAgICBgY29sdW1ucyBsZW5ndGggaXMgJHtjb2x1bW5zLmxlbmd0aH0sYCwgLy8gcmVuYW1lIGNvbHVtbnNcbiAgICAgICAgICAgICAgICAgIGBnb3QgJHtyZWNvcmRMZW5ndGh9IG9uIGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcmVjb3JkOiByZWNvcmQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHJlbGF4X2NvbHVtbl9jb3VudCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgIChyZWxheF9jb2x1bW5fY291bnRfbGVzcyA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgcmVjb3JkTGVuZ3RoIDwgdGhpcy5zdGF0ZS5leHBlY3RlZFJlY29yZExlbmd0aCkgfHxcbiAgICAgICAgICAocmVsYXhfY29sdW1uX2NvdW50X21vcmUgPT09IHRydWUgJiZcbiAgICAgICAgICAgIHJlY29yZExlbmd0aCA+IHRoaXMuc3RhdGUuZXhwZWN0ZWRSZWNvcmRMZW5ndGgpXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuaW5mby5pbnZhbGlkX2ZpZWxkX2xlbmd0aCsrO1xuICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgPSBlcnI7XG4gICAgICAgICAgLy8gRXJyb3IgaXMgdW5kZWZpbmVkIHdpdGggc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3JcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBmaW5hbEVyciA9IHRoaXMuX19lcnJvcihlcnIpO1xuICAgICAgICAgIGlmIChmaW5hbEVycikgcmV0dXJuIGZpbmFsRXJyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzID09PSB0cnVlICYmIGlzUmVjb3JkRW1wdHkocmVjb3JkKSkge1xuICAgICAgICB0aGlzLl9fcmVzZXRSZWNvcmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhdGUucmVjb3JkSGFzRXJyb3IgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5fX3Jlc2V0UmVjb3JkKCk7XG4gICAgICAgIHRoaXMuc3RhdGUucmVjb3JkSGFzRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmZvLnJlY29yZHMrKztcbiAgICAgIGlmIChmcm9tID09PSAxIHx8IHRoaXMuaW5mby5yZWNvcmRzID49IGZyb20pIHtcbiAgICAgICAgY29uc3QgeyBvYmpuYW1lIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIC8vIFdpdGggY29sdW1ucywgcmVjb3JkcyBhcmUgb2JqZWN0XG4gICAgICAgIGlmIChjb2x1bW5zICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgICAgICAgIC8vIFRyYW5zZm9ybSByZWNvcmQgYXJyYXkgdG8gYW4gb2JqZWN0XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZWNvcmQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY29sdW1uc1tpXSA9PT0gdW5kZWZpbmVkIHx8IGNvbHVtbnNbaV0uZGlzYWJsZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgLy8gVHVybiBkdXBsaWNhdGUgY29sdW1ucyBpbnRvIGFuIGFycmF5XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGdyb3VwX2NvbHVtbnNfYnlfbmFtZSA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgICBvYmpbY29sdW1uc1tpXS5uYW1lXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW2NvbHVtbnNbaV0ubmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgb2JqW2NvbHVtbnNbaV0ubmFtZV0gPSBvYmpbY29sdW1uc1tpXS5uYW1lXS5jb25jYXQocmVjb3JkW2ldKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmpbY29sdW1uc1tpXS5uYW1lXSA9IFtvYmpbY29sdW1uc1tpXS5uYW1lXSwgcmVjb3JkW2ldXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb2JqW2NvbHVtbnNbaV0ubmFtZV0gPSByZWNvcmRbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFdpdGhvdXQgb2JqbmFtZSAoZGVmYXVsdClcbiAgICAgICAgICBpZiAocmF3ID09PSB0cnVlIHx8IGluZm8gPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dFJlY29yZCA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgIHsgcmVjb3JkOiBvYmogfSxcbiAgICAgICAgICAgICAgcmF3ID09PSB0cnVlXG4gICAgICAgICAgICAgICAgPyB7IHJhdzogdGhpcy5zdGF0ZS5yYXdCdWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpIH1cbiAgICAgICAgICAgICAgICA6IHt9LFxuICAgICAgICAgICAgICBpbmZvID09PSB0cnVlID8geyBpbmZvOiB0aGlzLl9faW5mb1JlY29yZCgpIH0gOiB7fSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSB0aGlzLl9fcHVzaChcbiAgICAgICAgICAgICAgb2JqbmFtZSA9PT0gdW5kZWZpbmVkID8gZXh0UmVjb3JkIDogW29ialtvYmpuYW1lXSwgZXh0UmVjb3JkXSxcbiAgICAgICAgICAgICAgcHVzaCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IHRoaXMuX19wdXNoKFxuICAgICAgICAgICAgICBvYmpuYW1lID09PSB1bmRlZmluZWQgPyBvYmogOiBbb2JqW29iam5hbWVdLCBvYmpdLFxuICAgICAgICAgICAgICBwdXNoLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gV2l0aG91dCBjb2x1bW5zLCByZWNvcmRzIGFyZSBhcnJheVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyYXcgPT09IHRydWUgfHwgaW5mbyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgZXh0UmVjb3JkID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgeyByZWNvcmQ6IHJlY29yZCB9LFxuICAgICAgICAgICAgICByYXcgPT09IHRydWVcbiAgICAgICAgICAgICAgICA/IHsgcmF3OiB0aGlzLnN0YXRlLnJhd0J1ZmZlci50b1N0cmluZyhlbmNvZGluZykgfVxuICAgICAgICAgICAgICAgIDoge30sXG4gICAgICAgICAgICAgIGluZm8gPT09IHRydWUgPyB7IGluZm86IHRoaXMuX19pbmZvUmVjb3JkKCkgfSA6IHt9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IHRoaXMuX19wdXNoKFxuICAgICAgICAgICAgICBvYmpuYW1lID09PSB1bmRlZmluZWQgPyBleHRSZWNvcmQgOiBbcmVjb3JkW29iam5hbWVdLCBleHRSZWNvcmRdLFxuICAgICAgICAgICAgICBwdXNoLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZXJyID0gdGhpcy5fX3B1c2goXG4gICAgICAgICAgICAgIG9iam5hbWUgPT09IHVuZGVmaW5lZCA/IHJlY29yZCA6IFtyZWNvcmRbb2JqbmFtZV0sIHJlY29yZF0sXG4gICAgICAgICAgICAgIHB1c2gsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fX3Jlc2V0UmVjb3JkKCk7XG4gICAgfSxcbiAgICBfX2ZpcnN0TGluZVRvQ29sdW1uczogZnVuY3Rpb24gKHJlY29yZCkge1xuICAgICAgY29uc3QgeyBmaXJzdExpbmVUb0hlYWRlcnMgfSA9IHRoaXMuc3RhdGU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBoZWFkZXJzID1cbiAgICAgICAgICBmaXJzdExpbmVUb0hlYWRlcnMgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyByZWNvcmRcbiAgICAgICAgICAgIDogZmlyc3RMaW5lVG9IZWFkZXJzLmNhbGwobnVsbCwgcmVjb3JkKTtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX19lcnJvcihcbiAgICAgICAgICAgIG5ldyBDc3ZFcnJvcihcbiAgICAgICAgICAgICAgXCJDU1ZfSU5WQUxJRF9DT0xVTU5fTUFQUElOR1wiLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgXCJJbnZhbGlkIENvbHVtbiBNYXBwaW5nOlwiLFxuICAgICAgICAgICAgICAgIFwiZXhwZWN0IGFuIGFycmF5IGZyb20gY29sdW1uIGZ1bmN0aW9uLFwiLFxuICAgICAgICAgICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShoZWFkZXJzKX1gLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgIHRoaXMuX19pbmZvRmllbGQoKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZEhlYWRlcnMgPSBub3JtYWxpemVfY29sdW1uc19hcnJheShoZWFkZXJzKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5leHBlY3RlZFJlY29yZExlbmd0aCA9IG5vcm1hbGl6ZWRIZWFkZXJzLmxlbmd0aDtcbiAgICAgICAgdGhpcy5vcHRpb25zLmNvbHVtbnMgPSBub3JtYWxpemVkSGVhZGVycztcbiAgICAgICAgdGhpcy5fX3Jlc2V0UmVjb3JkKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgfVxuICAgIH0sXG4gICAgX19yZXNldFJlY29yZDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYXcgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yYXdCdWZmZXIucmVzZXQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGUuZXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnN0YXRlLnJlY29yZCA9IFtdO1xuICAgICAgdGhpcy5zdGF0ZS5yZWNvcmRfbGVuZ3RoID0gMDtcbiAgICB9LFxuICAgIF9fb25GaWVsZDogZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgeyBjYXN0LCBlbmNvZGluZywgcnRyaW0sIG1heF9yZWNvcmRfc2l6ZSB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgeyBlbmFibGVkLCB3YXNRdW90aW5nIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgLy8gU2hvcnQgY2lyY3VpdCBmb3IgdGhlIGZyb21fbGluZSBvcHRpb25zXG4gICAgICBpZiAoZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19yZXNldEZpZWxkKCk7XG4gICAgICB9XG4gICAgICBsZXQgZmllbGQgPSB0aGlzLnN0YXRlLmZpZWxkLnRvU3RyaW5nKGVuY29kaW5nKTtcbiAgICAgIGlmIChydHJpbSA9PT0gdHJ1ZSAmJiB3YXNRdW90aW5nID09PSBmYWxzZSkge1xuICAgICAgICBmaWVsZCA9IGZpZWxkLnRyaW1SaWdodCgpO1xuICAgICAgfVxuICAgICAgaWYgKGNhc3QgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgW2VyciwgZl0gPSB0aGlzLl9fY2FzdChmaWVsZCk7XG4gICAgICAgIGlmIChlcnIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVycjtcbiAgICAgICAgZmllbGQgPSBmO1xuICAgICAgfVxuICAgICAgdGhpcy5zdGF0ZS5yZWNvcmQucHVzaChmaWVsZCk7XG4gICAgICAvLyBJbmNyZW1lbnQgcmVjb3JkIGxlbmd0aCBpZiByZWNvcmQgc2l6ZSBtdXN0IG5vdCBleGNlZWQgYSBsaW1pdFxuICAgICAgaWYgKG1heF9yZWNvcmRfc2l6ZSAhPT0gMCAmJiB0eXBlb2YgZmllbGQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWNvcmRfbGVuZ3RoICs9IGZpZWxkLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19yZXNldEZpZWxkKCk7XG4gICAgfSxcbiAgICBfX3Jlc2V0RmllbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc3RhdGUuZmllbGQucmVzZXQoKTtcbiAgICAgIHRoaXMuc3RhdGUud2FzUXVvdGluZyA9IGZhbHNlO1xuICAgIH0sXG4gICAgX19wdXNoOiBmdW5jdGlvbiAocmVjb3JkLCBwdXNoKSB7XG4gICAgICBjb25zdCB7IG9uX3JlY29yZCB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgaWYgKG9uX3JlY29yZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9faW5mb1JlY29yZCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlY29yZCA9IG9uX3JlY29yZC5jYWxsKG51bGwsIHJlY29yZCwgaW5mbyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlY29yZCA9PT0gdW5kZWZpbmVkIHx8IHJlY29yZCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHVzaChyZWNvcmQpO1xuICAgIH0sXG4gICAgLy8gUmV0dXJuIGEgdHVwbGUgd2l0aCB0aGUgZXJyb3IgYW5kIHRoZSBjYXN0ZWQgdmFsdWVcbiAgICBfX2Nhc3Q6IGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgY29uc3QgeyBjb2x1bW5zLCByZWxheF9jb2x1bW5fY291bnQgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGlzQ29sdW1ucyA9IEFycmF5LmlzQXJyYXkoY29sdW1ucyk7XG4gICAgICAvLyBEb250IGxvb3NlIHRpbWUgY2FsbGluZyBjYXN0XG4gICAgICAvLyBiZWNhdXNlIHRoZSBmaW5hbCByZWNvcmQgaXMgYW4gb2JqZWN0XG4gICAgICAvLyBhbmQgdGhpcyBmaWVsZCBjYW4ndCBiZSBhc3NvY2lhdGVkIHRvIGEga2V5IHByZXNlbnQgaW4gY29sdW1uc1xuICAgICAgaWYgKFxuICAgICAgICBpc0NvbHVtbnMgPT09IHRydWUgJiZcbiAgICAgICAgcmVsYXhfY29sdW1uX2NvdW50ICYmXG4gICAgICAgIHRoaXMub3B0aW9ucy5jb2x1bW5zLmxlbmd0aCA8PSB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGhcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdW5kZWZpbmVkXTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXRlLmNhc3RGaWVsZCAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9faW5mb0ZpZWxkKCk7XG4gICAgICAgICAgcmV0dXJuIFt1bmRlZmluZWQsIHRoaXMuc3RhdGUuY2FzdEZpZWxkLmNhbGwobnVsbCwgZmllbGQsIGluZm8pXTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIFtlcnJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fX2lzRmxvYXQoZmllbGQpKSB7XG4gICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCBwYXJzZUZsb2F0KGZpZWxkKV07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5jYXN0X2RhdGUgIT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9faW5mb0ZpZWxkKCk7XG4gICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuY2FzdF9kYXRlLmNhbGwobnVsbCwgZmllbGQsIGluZm8pXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbdW5kZWZpbmVkLCBmaWVsZF07XG4gICAgfSxcbiAgICAvLyBIZWxwZXIgdG8gdGVzdCBpZiBhIGNoYXJhY3RlciBpcyBhIHNwYWNlIG9yIGEgbGluZSBkZWxpbWl0ZXJcbiAgICBfX2lzQ2hhclRyaW1hYmxlOiBmdW5jdGlvbiAoYnVmLCBwb3MpIHtcbiAgICAgIGNvbnN0IGlzVHJpbSA9IChidWYsIHBvcykgPT4ge1xuICAgICAgICBjb25zdCB7IHRpbWNoYXJzIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICBsb29wMTogZm9yIChsZXQgaSA9IDA7IGkgPCB0aW1jaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHRpbWNoYXIgPSB0aW1jaGFyc1tpXTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRpbWNoYXIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmICh0aW1jaGFyW2pdICE9PSBidWZbcG9zICsgal0pIGNvbnRpbnVlIGxvb3AxO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGltY2hhci5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGlzVHJpbShidWYsIHBvcyk7XG4gICAgfSxcbiAgICAvLyBLZWVwIGl0IGluIGNhc2Ugd2UgaW1wbGVtZW50IHRoZSBgY2FzdF9pbnRgIG9wdGlvblxuICAgIC8vIF9faXNJbnQodmFsdWUpe1xuICAgIC8vICAgLy8gcmV0dXJuIE51bWJlci5pc0ludGVnZXIocGFyc2VJbnQodmFsdWUpKVxuICAgIC8vICAgLy8gcmV0dXJuICFpc05hTiggcGFyc2VJbnQoIG9iaiApICk7XG4gICAgLy8gICByZXR1cm4gL14oXFwtfFxcKyk/WzEtOV1bMC05XSokLy50ZXN0KHZhbHVlKVxuICAgIC8vIH1cbiAgICBfX2lzRmxvYXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlIC0gcGFyc2VGbG9hdCh2YWx1ZSkgKyAxID49IDA7IC8vIEJvcnJvd2VkIGZyb20ganF1ZXJ5XG4gICAgfSxcbiAgICBfX2NvbXBhcmVCeXRlczogZnVuY3Rpb24gKHNvdXJjZUJ1ZiwgdGFyZ2V0QnVmLCB0YXJnZXRQb3MsIGZpcnN0Qnl0ZSkge1xuICAgICAgaWYgKHNvdXJjZUJ1ZlswXSAhPT0gZmlyc3RCeXRlKSByZXR1cm4gMDtcbiAgICAgIGNvbnN0IHNvdXJjZUxlbmd0aCA9IHNvdXJjZUJ1Zi5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNvdXJjZUxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VCdWZbaV0gIT09IHRhcmdldEJ1Zlt0YXJnZXRQb3MgKyBpXSkgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gc291cmNlTGVuZ3RoO1xuICAgIH0sXG4gICAgX19pc0RlbGltaXRlcjogZnVuY3Rpb24gKGJ1ZiwgcG9zLCBjaHIpIHtcbiAgICAgIGNvbnN0IHsgZGVsaW1pdGVyLCBpZ25vcmVfbGFzdF9kZWxpbWl0ZXJzIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBpZiAoXG4gICAgICAgIGlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPT09IHRydWUgJiZcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWNvcmQubGVuZ3RoID09PSB0aGlzLm9wdGlvbnMuY29sdW1ucy5sZW5ndGggLSAxXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBpZ25vcmVfbGFzdF9kZWxpbWl0ZXJzICE9PSBmYWxzZSAmJlxuICAgICAgICB0eXBlb2YgaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9PT0gXCJudW1iZXJcIiAmJlxuICAgICAgICB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGggPT09IGlnbm9yZV9sYXN0X2RlbGltaXRlcnMgLSAxXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICBsb29wMTogZm9yIChsZXQgaSA9IDA7IGkgPCBkZWxpbWl0ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGVsID0gZGVsaW1pdGVyW2ldO1xuICAgICAgICBpZiAoZGVsWzBdID09PSBjaHIpIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IGRlbC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGRlbFtqXSAhPT0gYnVmW3BvcyArIGpdKSBjb250aW51ZSBsb29wMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGRlbC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0sXG4gICAgX19pc1JlY29yZERlbGltaXRlcjogZnVuY3Rpb24gKGNociwgYnVmLCBwb3MpIHtcbiAgICAgIGNvbnN0IHsgcmVjb3JkX2RlbGltaXRlciB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgcmVjb3JkRGVsaW1pdGVyTGVuZ3RoID0gcmVjb3JkX2RlbGltaXRlci5sZW5ndGg7XG4gICAgICBsb29wMTogZm9yIChsZXQgaSA9IDA7IGkgPCByZWNvcmREZWxpbWl0ZXJMZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByZCA9IHJlY29yZF9kZWxpbWl0ZXJbaV07XG4gICAgICAgIGNvbnN0IHJkTGVuZ3RoID0gcmQubGVuZ3RoO1xuICAgICAgICBpZiAocmRbMF0gIT09IGNocikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgcmRMZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmIChyZFtqXSAhPT0gYnVmW3BvcyArIGpdKSB7XG4gICAgICAgICAgICBjb250aW51ZSBsb29wMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJkLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0sXG4gICAgX19pc0VzY2FwZTogZnVuY3Rpb24gKGJ1ZiwgcG9zLCBjaHIpIHtcbiAgICAgIGNvbnN0IHsgZXNjYXBlIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBpZiAoZXNjYXBlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBsID0gZXNjYXBlLmxlbmd0aDtcbiAgICAgIGlmIChlc2NhcGVbMF0gPT09IGNocikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChlc2NhcGVbaV0gIT09IGJ1Zltwb3MgKyBpXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIF9faXNRdW90ZTogZnVuY3Rpb24gKGJ1ZiwgcG9zKSB7XG4gICAgICBjb25zdCB7IHF1b3RlIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBpZiAocXVvdGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IGwgPSBxdW90ZS5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAocXVvdGVbaV0gIT09IGJ1Zltwb3MgKyBpXSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBfX2F1dG9EaXNjb3ZlclJlY29yZERlbGltaXRlcjogZnVuY3Rpb24gKGJ1ZiwgcG9zKSB7XG4gICAgICBjb25zdCB7IGVuY29kaW5nIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAvLyBOb3RlLCB3ZSBkb24ndCBuZWVkIHRvIGNhY2hlIHRoaXMgaW5mb3JtYXRpb24gaW4gc3RhdGUsXG4gICAgICAvLyBJdCBpcyBvbmx5IGNhbGxlZCBvbiB0aGUgZmlyc3QgbGluZSB1bnRpbCB3ZSBmaW5kIG91dCBhIHN1aXRhYmxlXG4gICAgICAvLyByZWNvcmQgZGVsaW1pdGVyLlxuICAgICAgY29uc3QgcmRzID0gW1xuICAgICAgICAvLyBJbXBvcnRhbnQsIHRoZSB3aW5kb3dzIGxpbmUgZW5kaW5nIG11c3QgYmUgYmVmb3JlIG1hYyBvcyA5XG4gICAgICAgIEJ1ZmZlci5mcm9tKFwiXFxyXFxuXCIsIGVuY29kaW5nKSxcbiAgICAgICAgQnVmZmVyLmZyb20oXCJcXG5cIiwgZW5jb2RpbmcpLFxuICAgICAgICBCdWZmZXIuZnJvbShcIlxcclwiLCBlbmNvZGluZyksXG4gICAgICBdO1xuICAgICAgbG9vcDogZm9yIChsZXQgaSA9IDA7IGkgPCByZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbCA9IHJkc1tpXS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgaWYgKHJkc1tpXVtqXSAhPT0gYnVmW3BvcyArIGpdKSB7XG4gICAgICAgICAgICBjb250aW51ZSBsb29wO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMucmVjb3JkX2RlbGltaXRlci5wdXNoKHJkc1tpXSk7XG4gICAgICAgIHRoaXMuc3RhdGUucmVjb3JkRGVsaW1pdGVyTWF4TGVuZ3RoID0gcmRzW2ldLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJkc1tpXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9LFxuICAgIF9fZXJyb3I6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgIGNvbnN0IHsgZW5jb2RpbmcsIHJhdywgc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGVyciA9IHR5cGVvZiBtc2cgPT09IFwic3RyaW5nXCIgPyBuZXcgRXJyb3IobXNnKSA6IG1zZztcbiAgICAgIGlmIChza2lwX3JlY29yZHNfd2l0aF9lcnJvcikge1xuICAgICAgICB0aGlzLnN0YXRlLnJlY29yZEhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbl9za2lwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25fc2tpcChcbiAgICAgICAgICAgIGVycixcbiAgICAgICAgICAgIHJhdyA/IHRoaXMuc3RhdGUucmF3QnVmZmVyLnRvU3RyaW5nKGVuY29kaW5nKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMuZW1pdCgnc2tpcCcsIGVyciwgcmF3ID8gdGhpcy5zdGF0ZS5yYXdCdWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpIDogdW5kZWZpbmVkKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlcnI7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2luZm9EYXRhU2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50aGlzLmluZm8sXG4gICAgICAgIGNvbHVtbnM6IHRoaXMub3B0aW9ucy5jb2x1bW5zLFxuICAgICAgfTtcbiAgICB9LFxuICAgIF9faW5mb1JlY29yZDogZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgeyBjb2x1bW5zLCByYXcsIGVuY29kaW5nIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50aGlzLl9faW5mb0RhdGFTZXQoKSxcbiAgICAgICAgZXJyb3I6IHRoaXMuc3RhdGUuZXJyb3IsXG4gICAgICAgIGhlYWRlcjogY29sdW1ucyA9PT0gdHJ1ZSxcbiAgICAgICAgaW5kZXg6IHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCxcbiAgICAgICAgcmF3OiByYXcgPyB0aGlzLnN0YXRlLnJhd0J1ZmZlci50b1N0cmluZyhlbmNvZGluZykgOiB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgIH0sXG4gICAgX19pbmZvRmllbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHsgY29sdW1ucyB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgaXNDb2x1bW5zID0gQXJyYXkuaXNBcnJheShjb2x1bW5zKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRoaXMuX19pbmZvUmVjb3JkKCksXG4gICAgICAgIGNvbHVtbjpcbiAgICAgICAgICBpc0NvbHVtbnMgPT09IHRydWVcbiAgICAgICAgICAgID8gY29sdW1ucy5sZW5ndGggPiB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGhcbiAgICAgICAgICAgICAgPyBjb2x1bW5zW3RoaXMuc3RhdGUucmVjb3JkLmxlbmd0aF0ubmFtZVxuICAgICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICAgIDogdGhpcy5zdGF0ZS5yZWNvcmQubGVuZ3RoLFxuICAgICAgICBxdW90aW5nOiB0aGlzLnN0YXRlLndhc1F1b3RpbmcsXG4gICAgICB9O1xuICAgIH0sXG4gIH07XG59O1xuXG5jb25zdCBwYXJzZSA9IGZ1bmN0aW9uIChkYXRhLCBvcHRzID0ge30pIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEpO1xuICB9XG4gIGNvbnN0IHJlY29yZHMgPSBvcHRzICYmIG9wdHMub2JqbmFtZSA/IHt9IDogW107XG4gIGNvbnN0IHBhcnNlciA9IHRyYW5zZm9ybShvcHRzKTtcbiAgY29uc3QgcHVzaCA9IChyZWNvcmQpID0+IHtcbiAgICBpZiAocGFyc2VyLm9wdGlvbnMub2JqbmFtZSA9PT0gdW5kZWZpbmVkKSByZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICBlbHNlIHtcbiAgICAgIHJlY29yZHNbcmVjb3JkWzBdXSA9IHJlY29yZFsxXTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGNsb3NlID0gKCkgPT4ge307XG4gIGNvbnN0IGVycjEgPSBwYXJzZXIucGFyc2UoZGF0YSwgZmFsc2UsIHB1c2gsIGNsb3NlKTtcbiAgaWYgKGVycjEgIT09IHVuZGVmaW5lZCkgdGhyb3cgZXJyMTtcbiAgY29uc3QgZXJyMiA9IHBhcnNlci5wYXJzZSh1bmRlZmluZWQsIHRydWUsIHB1c2gsIGNsb3NlKTtcbiAgaWYgKGVycjIgIT09IHVuZGVmaW5lZCkgdGhyb3cgZXJyMjtcbiAgcmV0dXJuIHJlY29yZHM7XG59O1xuXG5leHBvcnRzLkNzdkVycm9yID0gQ3N2RXJyb3I7XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIExvZGFzaCBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0YFxuXG5jb25zdCBjaGFyQ29kZU9mRG90ID0gXCIuXCIuY2hhckNvZGVBdCgwKTtcbmNvbnN0IHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuY29uc3QgcmVQcm9wTmFtZSA9IFJlZ0V4cChcbiAgLy8gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIGRvdCBvciBicmFja2V0LlxuICBcIlteLltcXFxcXV0rXCIgK1xuICAgIFwifFwiICtcbiAgICAvLyBPciBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gYnJhY2tldHMuXG4gICAgXCJcXFxcWyg/OlwiICtcbiAgICAvLyBNYXRjaCBhIG5vbi1zdHJpbmcgZXhwcmVzc2lvbi5cbiAgICBcIihbXlxcXCInXVteW10qKVwiICtcbiAgICBcInxcIiArXG4gICAgLy8gT3IgbWF0Y2ggc3RyaW5ncyAoc3VwcG9ydHMgZXNjYXBpbmcgY2hhcmFjdGVycykuXG4gICAgXCIoW1xcXCInXSkoKD86KD8hXFxcXDIpW15cXFxcXFxcXF18XFxcXFxcXFwuKSo/KVxcXFwyXCIgK1xuICAgIFwiKVxcXFxdXCIgK1xuICAgIFwifFwiICtcbiAgICAvLyBPciBtYXRjaCBcIlwiIGFzIHRoZSBzcGFjZSBiZXR3ZWVuIGNvbnNlY3V0aXZlIGRvdHMgb3IgZW1wdHkgYnJhY2tldHMuXG4gICAgXCIoPz0oPzpcXFxcLnxcXFxcW1xcXFxdKSg/OlxcXFwufFxcXFxbXFxcXF18JCkpXCIsXG4gIFwiZ1wiLFxuKTtcbmNvbnN0IHJlSXNEZWVwUHJvcCA9IC9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSo/XFwxKVxcXS87XG5jb25zdCByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbmNvbnN0IGdldFRhZyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbn07XG5cbmNvbnN0IGlzU3ltYm9sID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAoXG4gICAgdHlwZSA9PT0gXCJzeW1ib2xcIiB8fFxuICAgICh0eXBlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICYmIGdldFRhZyh2YWx1ZSkgPT09IFwiW29iamVjdCBTeW1ib2xdXCIpXG4gICk7XG59O1xuXG5jb25zdCBpc0tleSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAoXG4gICAgdHlwZSA9PT0gXCJudW1iZXJcIiB8fFxuICAgIHR5cGUgPT09IFwic3ltYm9sXCIgfHxcbiAgICB0eXBlID09PSBcImJvb2xlYW5cIiB8fFxuICAgICF2YWx1ZSB8fFxuICAgIGlzU3ltYm9sKHZhbHVlKVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHxcbiAgICAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpIHx8XG4gICAgKG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIE9iamVjdChvYmplY3QpKVxuICApO1xufTtcblxuY29uc3Qgc3RyaW5nVG9QYXRoID0gZnVuY3Rpb24gKHN0cmluZykge1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgaWYgKHN0cmluZy5jaGFyQ29kZUF0KDApID09PSBjaGFyQ29kZU9mRG90KSB7XG4gICAgcmVzdWx0LnB1c2goXCJcIik7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24gKG1hdGNoLCBleHByZXNzaW9uLCBxdW90ZSwgc3ViU3RyaW5nKSB7XG4gICAgbGV0IGtleSA9IG1hdGNoO1xuICAgIGlmIChxdW90ZSkge1xuICAgICAga2V5ID0gc3ViU3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCBcIiQxXCIpO1xuICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbikge1xuICAgICAga2V5ID0gZXhwcmVzc2lvbi50cmltKCk7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgY2FzdFBhdGggPSBmdW5jdGlvbiAodmFsdWUsIG9iamVjdCkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGlzS2V5KHZhbHVlLCBvYmplY3QpID8gW3ZhbHVlXSA6IHN0cmluZ1RvUGF0aCh2YWx1ZSk7XG4gIH1cbn07XG5cbmNvbnN0IHRvS2V5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHwgaXNTeW1ib2wodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gIGNvbnN0IHJlc3VsdCA9IGAke3ZhbHVlfWA7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICByZXR1cm4gcmVzdWx0ID09IFwiMFwiICYmIDEgLyB2YWx1ZSA9PSAtSU5GSU5JVFkgPyBcIi0wXCIgOiByZXN1bHQ7XG59O1xuXG5jb25zdCBnZXQgPSBmdW5jdGlvbiAob2JqZWN0LCBwYXRoKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuICBsZXQgaW5kZXggPSAwO1xuICBjb25zdCBsZW5ndGggPSBwYXRoLmxlbmd0aDtcbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gaW5kZXggJiYgaW5kZXggPT09IGxlbmd0aCA/IG9iamVjdCA6IHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IGlzX29iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgb2JqICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KG9iaik7XG59O1xuXG5jb25zdCBub3JtYWxpemVfY29sdW1ucyA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gIGlmIChjb2x1bW5zID09PSB1bmRlZmluZWQgfHwgY29sdW1ucyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBbdW5kZWZpbmVkLCB1bmRlZmluZWRdO1xuICB9XG4gIGlmICh0eXBlb2YgY29sdW1ucyAhPT0gXCJvYmplY3RcIikge1xuICAgIHJldHVybiBbRXJyb3IoJ0ludmFsaWQgb3B0aW9uIFwiY29sdW1uc1wiOiBleHBlY3QgYW4gYXJyYXkgb3IgYW4gb2JqZWN0JyldO1xuICB9XG4gIGlmICghQXJyYXkuaXNBcnJheShjb2x1bW5zKSkge1xuICAgIGNvbnN0IG5ld2NvbHVtbnMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gY29sdW1ucykge1xuICAgICAgbmV3Y29sdW1ucy5wdXNoKHtcbiAgICAgICAga2V5OiBrLFxuICAgICAgICBoZWFkZXI6IGNvbHVtbnNba10sXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29sdW1ucyA9IG5ld2NvbHVtbnM7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbmV3Y29sdW1ucyA9IFtdO1xuICAgIGZvciAoY29uc3QgY29sdW1uIG9mIGNvbHVtbnMpIHtcbiAgICAgIGlmICh0eXBlb2YgY29sdW1uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIG5ld2NvbHVtbnMucHVzaCh7XG4gICAgICAgICAga2V5OiBjb2x1bW4sXG4gICAgICAgICAgaGVhZGVyOiBjb2x1bW4sXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZW9mIGNvbHVtbiA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICBjb2x1bW4gIT09IG51bGwgJiZcbiAgICAgICAgIUFycmF5LmlzQXJyYXkoY29sdW1uKVxuICAgICAgKSB7XG4gICAgICAgIGlmICghY29sdW1uLmtleSkge1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBFcnJvcignSW52YWxpZCBjb2x1bW4gZGVmaW5pdGlvbjogcHJvcGVydHkgXCJrZXlcIiBpcyByZXF1aXJlZCcpLFxuICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbHVtbi5oZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbHVtbi5oZWFkZXIgPSBjb2x1bW4ua2V5O1xuICAgICAgICB9XG4gICAgICAgIG5ld2NvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBFcnJvcihcIkludmFsaWQgY29sdW1uIGRlZmluaXRpb246IGV4cGVjdCBhIHN0cmluZyBvciBhbiBvYmplY3RcIiksXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfVxuICAgIGNvbHVtbnMgPSBuZXdjb2x1bW5zO1xuICB9XG4gIHJldHVybiBbdW5kZWZpbmVkLCBjb2x1bW5zXTtcbn07XG5cbmNsYXNzIENzdkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcihjb2RlLCBtZXNzYWdlLCAuLi5jb250ZXh0cykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2UpKSBtZXNzYWdlID0gbWVzc2FnZS5qb2luKFwiIFwiKTtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQ3N2RXJyb3IpO1xuICAgIH1cbiAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgIGZvciAoY29uc3QgY29udGV4dCBvZiBjb250ZXh0cykge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29udGV4dCkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRleHRba2V5XTtcbiAgICAgICAgdGhpc1trZXldID0gQnVmZmVyLmlzQnVmZmVyKHZhbHVlKVxuICAgICAgICAgID8gdmFsdWUudG9TdHJpbmcoKVxuICAgICAgICAgIDogdmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyB2YWx1ZVxuICAgICAgICAgICAgOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHVuZGVyc2NvcmUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoXywgbWF0Y2gpIHtcbiAgICByZXR1cm4gXCJfXCIgKyBtYXRjaC50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn07XG5cbmNvbnN0IG5vcm1hbGl6ZV9vcHRpb25zID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuICAvLyBNZXJnZSB3aXRoIHVzZXIgb3B0aW9uc1xuICBmb3IgKGNvbnN0IG9wdCBpbiBvcHRzKSB7XG4gICAgb3B0aW9uc1t1bmRlcnNjb3JlKG9wdCldID0gb3B0c1tvcHRdO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGJvbWBcbiAgaWYgKFxuICAgIG9wdGlvbnMuYm9tID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmJvbSA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMuYm9tID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLmJvbSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuYm9tICE9PSB0cnVlKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBDc3ZFcnJvcihcIkNTVl9PUFRJT05fQk9PTEVBTl9JTlZBTElEX1RZUEVcIiwgW1xuICAgICAgICBcIm9wdGlvbiBgYm9tYCBpcyBvcHRpb25hbCBhbmQgbXVzdCBiZSBhIGJvb2xlYW4gdmFsdWUsXCIsXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmJvbSl9YCxcbiAgICAgIF0pLFxuICAgIF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZGVsaW1pdGVyYFxuICBpZiAob3B0aW9ucy5kZWxpbWl0ZXIgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmRlbGltaXRlciA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMuZGVsaW1pdGVyID0gXCIsXCI7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMuZGVsaW1pdGVyKSkge1xuICAgIG9wdGlvbnMuZGVsaW1pdGVyID0gb3B0aW9ucy5kZWxpbWl0ZXIudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5kZWxpbWl0ZXIgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgbmV3IENzdkVycm9yKFwiQ1NWX09QVElPTl9ERUxJTUlURVJfSU5WQUxJRF9UWVBFXCIsIFtcbiAgICAgICAgXCJvcHRpb24gYGRlbGltaXRlcmAgbXVzdCBiZSBhIGJ1ZmZlciBvciBhIHN0cmluZyxcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGVsaW1pdGVyKX1gLFxuICAgICAgXSksXG4gICAgXTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBxdW90ZWBcbiAgaWYgKG9wdGlvbnMucXVvdGUgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5xdW90ZSA9ICdcIic7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5xdW90ZSA9PT0gdHJ1ZSkge1xuICAgIG9wdGlvbnMucXVvdGUgPSAnXCInO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMucXVvdGUgPT09IGZhbHNlKSB7XG4gICAgb3B0aW9ucy5xdW90ZSA9IFwiXCI7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucXVvdGUpKSB7XG4gICAgb3B0aW9ucy5xdW90ZSA9IG9wdGlvbnMucXVvdGUudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5xdW90ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBbXG4gICAgICBuZXcgQ3N2RXJyb3IoXCJDU1ZfT1BUSU9OX1FVT1RFX0lOVkFMSURfVFlQRVwiLCBbXG4gICAgICAgIFwib3B0aW9uIGBxdW90ZWAgbXVzdCBiZSBhIGJvb2xlYW4sIGEgYnVmZmVyIG9yIGEgc3RyaW5nLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5xdW90ZSl9YCxcbiAgICAgIF0pLFxuICAgIF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcXVvdGVkYFxuICBpZiAob3B0aW9ucy5xdW90ZWQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlZCA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMucXVvdGVkID0gZmFsc2U7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZXNjYXBlX2Zvcm11bGFzYFxuICBpZiAoXG4gICAgb3B0aW9ucy5lc2NhcGVfZm9ybXVsYXMgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuZXNjYXBlX2Zvcm11bGFzID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMuZXNjYXBlX2Zvcm11bGFzID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuZXNjYXBlX2Zvcm11bGFzICE9PSBcImJvb2xlYW5cIikge1xuICAgIHJldHVybiBbXG4gICAgICBuZXcgQ3N2RXJyb3IoXCJDU1ZfT1BUSU9OX0VTQ0FQRV9GT1JNVUxBU19JTlZBTElEX1RZUEVcIiwgW1xuICAgICAgICBcIm9wdGlvbiBgZXNjYXBlX2Zvcm11bGFzYCBtdXN0IGJlIGEgYm9vbGVhbixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuZXNjYXBlX2Zvcm11bGFzKX1gLFxuICAgICAgXSksXG4gICAgXTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBxdW90ZWRfZW1wdHlgXG4gIGlmIChvcHRpb25zLnF1b3RlZF9lbXB0eSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucXVvdGVkX2VtcHR5ID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5xdW90ZWRfZW1wdHkgPSB1bmRlZmluZWQ7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcXVvdGVkX21hdGNoYFxuICBpZiAoXG4gICAgb3B0aW9ucy5xdW90ZWRfbWF0Y2ggPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMucXVvdGVkX21hdGNoID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5xdW90ZWRfbWF0Y2ggPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMucXVvdGVkX21hdGNoID0gbnVsbDtcbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLnF1b3RlZF9tYXRjaCkpIHtcbiAgICBvcHRpb25zLnF1b3RlZF9tYXRjaCA9IFtvcHRpb25zLnF1b3RlZF9tYXRjaF07XG4gIH1cbiAgaWYgKG9wdGlvbnMucXVvdGVkX21hdGNoKSB7XG4gICAgZm9yIChjb25zdCBxdW90ZWRfbWF0Y2ggb2Ygb3B0aW9ucy5xdW90ZWRfbWF0Y2gpIHtcbiAgICAgIGNvbnN0IGlzU3RyaW5nID0gdHlwZW9mIHF1b3RlZF9tYXRjaCA9PT0gXCJzdHJpbmdcIjtcbiAgICAgIGNvbnN0IGlzUmVnRXhwID0gcXVvdGVkX21hdGNoIGluc3RhbmNlb2YgUmVnRXhwO1xuICAgICAgaWYgKCFpc1N0cmluZyAmJiAhaXNSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBFcnJvcihcbiAgICAgICAgICAgIGBJbnZhbGlkIE9wdGlvbjogcXVvdGVkX21hdGNoIG11c3QgYmUgYSBzdHJpbmcgb3IgYSByZWdleCwgZ290ICR7SlNPTi5zdHJpbmdpZnkocXVvdGVkX21hdGNoKX1gLFxuICAgICAgICAgICksXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHF1b3RlZF9zdHJpbmdgXG4gIGlmIChvcHRpb25zLnF1b3RlZF9zdHJpbmcgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlZF9zdHJpbmcgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLnF1b3RlZF9zdHJpbmcgPSBmYWxzZTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBlb2ZgXG4gIGlmIChvcHRpb25zLmVvZiA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuZW9mID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5lb2YgPSB0cnVlO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGVzY2FwZWBcbiAgaWYgKG9wdGlvbnMuZXNjYXBlID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5lc2NhcGUgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLmVzY2FwZSA9ICdcIic7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMuZXNjYXBlKSkge1xuICAgIG9wdGlvbnMuZXNjYXBlID0gb3B0aW9ucy5lc2NhcGUudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5lc2NhcGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogZXNjYXBlIG11c3QgYmUgYSBidWZmZXIgb3IgYSBzdHJpbmcsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuZXNjYXBlKX1gLFxuICAgICAgKSxcbiAgICBdO1xuICB9XG4gIGlmIChvcHRpb25zLmVzY2FwZS5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIEVycm9yKFxuICAgICAgICBgSW52YWxpZCBPcHRpb246IGVzY2FwZSBtdXN0IGJlIG9uZSBjaGFyYWN0ZXIsIGdvdCAke29wdGlvbnMuZXNjYXBlLmxlbmd0aH0gY2hhcmFjdGVyc2AsXG4gICAgICApLFxuICAgIF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgaGVhZGVyYFxuICBpZiAob3B0aW9ucy5oZWFkZXIgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmhlYWRlciA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMuaGVhZGVyID0gZmFsc2U7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY29sdW1uc2BcbiAgY29uc3QgW2VyckNvbHVtbnMsIGNvbHVtbnNdID0gbm9ybWFsaXplX2NvbHVtbnMob3B0aW9ucy5jb2x1bW5zKTtcbiAgaWYgKGVyckNvbHVtbnMgIT09IHVuZGVmaW5lZCkgcmV0dXJuIFtlcnJDb2x1bW5zXTtcbiAgb3B0aW9ucy5jb2x1bW5zID0gY29sdW1ucztcbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcXVvdGVkYFxuICBpZiAob3B0aW9ucy5xdW90ZWQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlZCA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMucXVvdGVkID0gZmFsc2U7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY2FzdGBcbiAgaWYgKG9wdGlvbnMuY2FzdCA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuY2FzdCA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMuY2FzdCA9IHt9O1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gY2FzdC5iaWdpbnRcbiAgaWYgKG9wdGlvbnMuY2FzdC5iaWdpbnQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmNhc3QuYmlnaW50ID09PSBudWxsKSB7XG4gICAgLy8gQ2FzdCBib29sZWFuIHRvIHN0cmluZyBieSBkZWZhdWx0XG4gICAgb3B0aW9ucy5jYXN0LmJpZ2ludCA9ICh2YWx1ZSkgPT4gXCJcIiArIHZhbHVlO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gY2FzdC5ib29sZWFuXG4gIGlmIChvcHRpb25zLmNhc3QuYm9vbGVhbiA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuY2FzdC5ib29sZWFuID09PSBudWxsKSB7XG4gICAgLy8gQ2FzdCBib29sZWFuIHRvIHN0cmluZyBieSBkZWZhdWx0XG4gICAgb3B0aW9ucy5jYXN0LmJvb2xlYW4gPSAodmFsdWUpID0+ICh2YWx1ZSA/IFwiMVwiIDogXCJcIik7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBjYXN0LmRhdGVcbiAgaWYgKG9wdGlvbnMuY2FzdC5kYXRlID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5jYXN0LmRhdGUgPT09IG51bGwpIHtcbiAgICAvLyBDYXN0IGRhdGUgdG8gdGltZXN0YW1wIHN0cmluZyBieSBkZWZhdWx0XG4gICAgb3B0aW9ucy5jYXN0LmRhdGUgPSAodmFsdWUpID0+IFwiXCIgKyB2YWx1ZS5nZXRUaW1lKCk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBjYXN0Lm51bWJlclxuICBpZiAob3B0aW9ucy5jYXN0Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuY2FzdC5udW1iZXIgPT09IG51bGwpIHtcbiAgICAvLyBDYXN0IG51bWJlciB0byBzdHJpbmcgdXNpbmcgbmF0aXZlIGNhc3RpbmcgYnkgZGVmYXVsdFxuICAgIG9wdGlvbnMuY2FzdC5udW1iZXIgPSAodmFsdWUpID0+IFwiXCIgKyB2YWx1ZTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGNhc3Qub2JqZWN0XG4gIGlmIChvcHRpb25zLmNhc3Qub2JqZWN0ID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5jYXN0Lm9iamVjdCA9PT0gbnVsbCkge1xuICAgIC8vIFN0cmluZ2lmeSBvYmplY3QgYXMgSlNPTiBieSBkZWZhdWx0XG4gICAgb3B0aW9ucy5jYXN0Lm9iamVjdCA9ICh2YWx1ZSkgPT4gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gY2FzdC5zdHJpbmdcbiAgaWYgKG9wdGlvbnMuY2FzdC5zdHJpbmcgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmNhc3Quc3RyaW5nID09PSBudWxsKSB7XG4gICAgLy8gTGVhdmUgc3RyaW5nIHVudG91Y2hlZFxuICAgIG9wdGlvbnMuY2FzdC5zdHJpbmcgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYG9uX3JlY29yZGBcbiAgaWYgKFxuICAgIG9wdGlvbnMub25fcmVjb3JkICE9PSB1bmRlZmluZWQgJiZcbiAgICB0eXBlb2Ygb3B0aW9ucy5vbl9yZWNvcmQgIT09IFwiZnVuY3Rpb25cIlxuICApIHtcbiAgICByZXR1cm4gW0Vycm9yKGBJbnZhbGlkIE9wdGlvbjogXCJvbl9yZWNvcmRcIiBtdXN0IGJlIGEgZnVuY3Rpb24uYCldO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHJlY29yZF9kZWxpbWl0ZXJgXG4gIGlmIChcbiAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciA9PT0gbnVsbFxuICApIHtcbiAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcblwiO1xuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIpKSB7XG4gICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBbXG4gICAgICBFcnJvcihcbiAgICAgICAgYEludmFsaWQgT3B0aW9uOiByZWNvcmRfZGVsaW1pdGVyIG11c3QgYmUgYSBidWZmZXIgb3IgYSBzdHJpbmcsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucmVjb3JkX2RlbGltaXRlcil9YCxcbiAgICAgICksXG4gICAgXTtcbiAgfVxuICBzd2l0Y2ggKG9wdGlvbnMucmVjb3JkX2RlbGltaXRlcikge1xuICAgIGNhc2UgXCJ1bml4XCI6XG4gICAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcblwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm1hY1wiOlxuICAgICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gXCJcXHJcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ3aW5kb3dzXCI6XG4gICAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcclxcblwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImFzY2lpXCI6XG4gICAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcdTAwMWVcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ1bmljb2RlXCI6XG4gICAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcdTIwMjhcIjtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiBbdW5kZWZpbmVkLCBvcHRpb25zXTtcbn07XG5cbmNvbnN0IGJvbV91dGY4ID0gQnVmZmVyLmZyb20oWzIzOSwgMTg3LCAxOTFdKTtcblxuY29uc3Qgc3RyaW5naWZpZXIgPSBmdW5jdGlvbiAob3B0aW9ucywgc3RhdGUsIGluZm8pIHtcbiAgcmV0dXJuIHtcbiAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgIHN0YXRlOiBzdGF0ZSxcbiAgICBpbmZvOiBpbmZvLFxuICAgIF9fdHJhbnNmb3JtOiBmdW5jdGlvbiAoY2h1bmssIHB1c2gpIHtcbiAgICAgIC8vIENodW5rIHZhbGlkYXRpb25cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShjaHVuaykgJiYgdHlwZW9mIGNodW5rICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCBSZWNvcmQ6IGV4cGVjdCBhbiBhcnJheSBvciBhbiBvYmplY3QsIGdvdCAke0pTT04uc3RyaW5naWZ5KGNodW5rKX1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IGNvbHVtbnMgZnJvbSB0aGUgZmlyc3QgcmVjb3JkXG4gICAgICBpZiAodGhpcy5pbmZvLnJlY29yZHMgPT09IDApIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2h1bmspKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlciA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNvbHVtbnMgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIEVycm9yKFxuICAgICAgICAgICAgICBcIlVuZGlzY292ZXJhYmxlIENvbHVtbnM6IGhlYWRlciBvcHRpb24gcmVxdWlyZXMgY29sdW1uIG9wdGlvbiBvciBvYmplY3QgcmVjb3Jkc1wiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmNvbHVtbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IFtlcnIsIGNvbHVtbnNdID0gbm9ybWFsaXplX2NvbHVtbnMoT2JqZWN0LmtleXMoY2h1bmspKTtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm47XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNvbHVtbnMgPSBjb2x1bW5zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbWl0IHRoZSBoZWFkZXJcbiAgICAgIGlmICh0aGlzLmluZm8ucmVjb3JkcyA9PT0gMCkge1xuICAgICAgICB0aGlzLmJvbShwdXNoKTtcbiAgICAgICAgY29uc3QgZXJyID0gdGhpcy5oZWFkZXJzKHB1c2gpO1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gZXJyO1xuICAgICAgfVxuICAgICAgLy8gRW1pdCBhbmQgc3RyaW5naWZ5IHRoZSByZWNvcmQgaWYgYW4gb2JqZWN0IG9yIGFuIGFycmF5XG4gICAgICB0cnkge1xuICAgICAgICAvLyB0aGlzLmVtaXQoJ3JlY29yZCcsIGNodW5rLCB0aGlzLmluZm8ucmVjb3Jkcyk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25fcmVjb3JkKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uX3JlY29yZChjaHVuaywgdGhpcy5pbmZvLnJlY29yZHMpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgdGhlIHJlY29yZCBpbnRvIGEgc3RyaW5nXG4gICAgICBsZXQgZXJyLCBjaHVua19zdHJpbmc7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVvZikge1xuICAgICAgICBbZXJyLCBjaHVua19zdHJpbmddID0gdGhpcy5zdHJpbmdpZnkoY2h1bmspO1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gZXJyO1xuICAgICAgICBpZiAoY2h1bmtfc3RyaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2h1bmtfc3RyaW5nID0gY2h1bmtfc3RyaW5nICsgdGhpcy5vcHRpb25zLnJlY29yZF9kZWxpbWl0ZXI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFtlcnIsIGNodW5rX3N0cmluZ10gPSB0aGlzLnN0cmluZ2lmeShjaHVuayk7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBlcnI7XG4gICAgICAgIGlmIChjaHVua19zdHJpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhlYWRlciB8fCB0aGlzLmluZm8ucmVjb3Jkcykge1xuICAgICAgICAgICAgY2h1bmtfc3RyaW5nID0gdGhpcy5vcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgKyBjaHVua19zdHJpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbWl0IHRoZSBjc3ZcbiAgICAgIHRoaXMuaW5mby5yZWNvcmRzKys7XG4gICAgICBwdXNoKGNodW5rX3N0cmluZyk7XG4gICAgfSxcbiAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uIChjaHVuaywgY2h1bmtJc0hlYWRlciA9IGZhbHNlKSB7XG4gICAgICBpZiAodHlwZW9mIGNodW5rICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCBjaHVua107XG4gICAgICB9XG4gICAgICBjb25zdCB7IGNvbHVtbnMgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IHJlY29yZCA9IFtdO1xuICAgICAgLy8gUmVjb3JkIGlzIGFuIGFycmF5XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjaHVuaykpIHtcbiAgICAgICAgLy8gV2UgYXJlIGdldHRpbmcgYW4gYXJyYXkgYnV0IHRoZSB1c2VyIGhhcyBzcGVjaWZpZWQgb3V0cHV0IGNvbHVtbnMuIEluXG4gICAgICAgIC8vIHRoaXMgY2FzZSwgd2UgcmVzcGVjdCB0aGUgY29sdW1ucyBpbmRleGVzXG4gICAgICAgIGlmIChjb2x1bW5zKSB7XG4gICAgICAgICAgY2h1bmsuc3BsaWNlKGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYXN0IHJlY29yZCBlbGVtZW50c1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNodW5rLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZmllbGQgPSBjaHVua1tpXTtcbiAgICAgICAgICBjb25zdCBbZXJyLCB2YWx1ZV0gPSB0aGlzLl9fY2FzdChmaWVsZCwge1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICBjb2x1bW46IGksXG4gICAgICAgICAgICByZWNvcmRzOiB0aGlzLmluZm8ucmVjb3JkcyxcbiAgICAgICAgICAgIGhlYWRlcjogY2h1bmtJc0hlYWRlcixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gW2Vycl07XG4gICAgICAgICAgcmVjb3JkW2ldID0gW3ZhbHVlLCBmaWVsZF07XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVjb3JkIGlzIGEgbGl0ZXJhbCBvYmplY3RcbiAgICAgICAgLy8gYGNvbHVtbnNgIGlzIGFsd2F5cyBkZWZpbmVkOiBpdCBpcyBlaXRoZXIgcHJvdmlkZWQgb3IgZGlzY292ZXJlZC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGZpZWxkID0gZ2V0KGNodW5rLCBjb2x1bW5zW2ldLmtleSk7XG4gICAgICAgICAgY29uc3QgW2VyciwgdmFsdWVdID0gdGhpcy5fX2Nhc3QoZmllbGQsIHtcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgY29sdW1uOiBjb2x1bW5zW2ldLmtleSxcbiAgICAgICAgICAgIHJlY29yZHM6IHRoaXMuaW5mby5yZWNvcmRzLFxuICAgICAgICAgICAgaGVhZGVyOiBjaHVua0lzSGVhZGVyLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChlcnIpIHJldHVybiBbZXJyXTtcbiAgICAgICAgICByZWNvcmRbaV0gPSBbdmFsdWUsIGZpZWxkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IGNzdnJlY29yZCA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlY29yZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgb3B0aW9ucywgZXJyO1xuXG4gICAgICAgIGxldCBbdmFsdWUsIGZpZWxkXSA9IHJlY29yZFtpXTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNfb2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgIG9wdGlvbnMgPSB2YWx1ZTtcbiAgICAgICAgICB2YWx1ZSA9IG9wdGlvbnMudmFsdWU7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbnMudmFsdWU7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gbnVsbFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBJbnZhbGlkIENhc3RpbmcgVmFsdWU6IHJldHVybmVkIHZhbHVlIG11c3QgcmV0dXJuIGEgc3RyaW5nLCBudWxsIG9yIHVuZGVmaW5lZCwgZ290ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWAsXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3B0aW9ucyA9IHsgLi4udGhpcy5vcHRpb25zLCAuLi5vcHRpb25zIH07XG4gICAgICAgICAgW2Vyciwgb3B0aW9uc10gPSBub3JtYWxpemVfb3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBbZXJyXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIEVycm9yKFxuICAgICAgICAgICAgICBgSW52YWxpZCBDYXN0aW5nIFZhbHVlOiByZXR1cm5lZCB2YWx1ZSBtdXN0IHJldHVybiBhIHN0cmluZywgYW4gb2JqZWN0LCBudWxsIG9yIHVuZGVmaW5lZCwgZ290ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWAsXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGRlbGltaXRlcixcbiAgICAgICAgICBlc2NhcGUsXG4gICAgICAgICAgcXVvdGUsXG4gICAgICAgICAgcXVvdGVkLFxuICAgICAgICAgIHF1b3RlZF9lbXB0eSxcbiAgICAgICAgICBxdW90ZWRfc3RyaW5nLFxuICAgICAgICAgIHF1b3RlZF9tYXRjaCxcbiAgICAgICAgICByZWNvcmRfZGVsaW1pdGVyLFxuICAgICAgICAgIGVzY2FwZV9mb3JtdWxhcyxcbiAgICAgICAgfSA9IG9wdGlvbnM7XG4gICAgICAgIGlmIChcIlwiID09PSB2YWx1ZSAmJiBcIlwiID09PSBmaWVsZCkge1xuICAgICAgICAgIGxldCBxdW90ZWRNYXRjaCA9XG4gICAgICAgICAgICBxdW90ZWRfbWF0Y2ggJiZcbiAgICAgICAgICAgIHF1b3RlZF9tYXRjaC5maWx0ZXIoKHF1b3RlZF9tYXRjaCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHF1b3RlZF9tYXRjaCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5pbmRleE9mKHF1b3RlZF9tYXRjaCkgIT09IC0xO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBxdW90ZWRfbWF0Y2gudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIHF1b3RlZE1hdGNoID0gcXVvdGVkTWF0Y2ggJiYgcXVvdGVkTWF0Y2gubGVuZ3RoID4gMDtcbiAgICAgICAgICBjb25zdCBzaG91bGRRdW90ZSA9XG4gICAgICAgICAgICBxdW90ZWRNYXRjaCB8fFxuICAgICAgICAgICAgdHJ1ZSA9PT0gcXVvdGVkX2VtcHR5IHx8XG4gICAgICAgICAgICAodHJ1ZSA9PT0gcXVvdGVkX3N0cmluZyAmJiBmYWxzZSAhPT0gcXVvdGVkX2VtcHR5KTtcbiAgICAgICAgICBpZiAoc2hvdWxkUXVvdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcXVvdGUgKyB2YWx1ZSArIHF1b3RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjc3ZyZWNvcmQgKz0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICBFcnJvcihcbiAgICAgICAgICAgICAgICBgRm9ybWF0dGVyIG11c3QgcmV0dXJuIGEgc3RyaW5nLCBudWxsIG9yIHVuZGVmaW5lZCwgZ290ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWAsXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBjb250YWluc2RlbGltaXRlciA9XG4gICAgICAgICAgICBkZWxpbWl0ZXIubGVuZ3RoICYmIHZhbHVlLmluZGV4T2YoZGVsaW1pdGVyKSA+PSAwO1xuICAgICAgICAgIGNvbnN0IGNvbnRhaW5zUXVvdGUgPSBxdW90ZSAhPT0gXCJcIiAmJiB2YWx1ZS5pbmRleE9mKHF1b3RlKSA+PSAwO1xuICAgICAgICAgIGNvbnN0IGNvbnRhaW5zRXNjYXBlID0gdmFsdWUuaW5kZXhPZihlc2NhcGUpID49IDAgJiYgZXNjYXBlICE9PSBxdW90ZTtcbiAgICAgICAgICBjb25zdCBjb250YWluc1JlY29yZERlbGltaXRlciA9IHZhbHVlLmluZGV4T2YocmVjb3JkX2RlbGltaXRlcikgPj0gMDtcbiAgICAgICAgICBjb25zdCBxdW90ZWRTdHJpbmcgPSBxdW90ZWRfc3RyaW5nICYmIHR5cGVvZiBmaWVsZCA9PT0gXCJzdHJpbmdcIjtcbiAgICAgICAgICBsZXQgcXVvdGVkTWF0Y2ggPVxuICAgICAgICAgICAgcXVvdGVkX21hdGNoICYmXG4gICAgICAgICAgICBxdW90ZWRfbWF0Y2guZmlsdGVyKChxdW90ZWRfbWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxdW90ZWRfbWF0Y2ggPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuaW5kZXhPZihxdW90ZWRfbWF0Y2gpICE9PSAtMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVvdGVkX21hdGNoLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBxdW90ZWRNYXRjaCA9IHF1b3RlZE1hdGNoICYmIHF1b3RlZE1hdGNoLmxlbmd0aCA+IDA7XG4gICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hZGFsdGFzL25vZGUtY3N2L3B1bGwvMzg3XG4gICAgICAgICAgLy8gTW9yZSBhYm91dCBDU1YgaW5qZWN0aW9uIG9yIGZvcm11bGEgaW5qZWN0aW9uLCB3aGVuIHdlYnNpdGVzIGVtYmVkXG4gICAgICAgICAgLy8gdW50cnVzdGVkIGlucHV0IGluc2lkZSBDU1YgZmlsZXM6XG4gICAgICAgICAgLy8gaHR0cHM6Ly9vd2FzcC5vcmcvd3d3LWNvbW11bml0eS9hdHRhY2tzL0NTVl9JbmplY3Rpb25cbiAgICAgICAgICAvLyBodHRwOi8vZ2VvcmdlbWF1ZXIubmV0LzIwMTcvMTAvMDcvY3N2LWluamVjdGlvbi5odG1sXG4gICAgICAgICAgLy8gQXBwbGUgTnVtYmVycyB1bmljb2RlIG5vcm1hbGl6YXRpb24gaXMgZW1waXJpY2FsIGZyb20gdGVzdGluZ1xuICAgICAgICAgIGlmIChlc2NhcGVfZm9ybXVsYXMpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodmFsdWVbMF0pIHtcbiAgICAgICAgICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgICAgICAgY2FzZSBcIkBcIjpcbiAgICAgICAgICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICAgICAgICBjYXNlIFwiXFxyXCI6XG4gICAgICAgICAgICAgIGNhc2UgXCJcXHVGRjFEXCI6IC8vIFVuaWNvZGUgJz0nXG4gICAgICAgICAgICAgIGNhc2UgXCJcXHVGRjBCXCI6IC8vIFVuaWNvZGUgJysnXG4gICAgICAgICAgICAgIGNhc2UgXCJcXHVGRjBEXCI6IC8vIFVuaWNvZGUgJy0nXG4gICAgICAgICAgICAgIGNhc2UgXCJcXHVGRjIwXCI6IC8vIFVuaWNvZGUgJ0AnXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBgJyR7dmFsdWV9YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgc2hvdWxkUXVvdGUgPVxuICAgICAgICAgICAgY29udGFpbnNRdW90ZSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgY29udGFpbnNkZWxpbWl0ZXIgfHxcbiAgICAgICAgICAgIGNvbnRhaW5zUmVjb3JkRGVsaW1pdGVyIHx8XG4gICAgICAgICAgICBxdW90ZWQgfHxcbiAgICAgICAgICAgIHF1b3RlZFN0cmluZyB8fFxuICAgICAgICAgICAgcXVvdGVkTWF0Y2g7XG4gICAgICAgICAgaWYgKHNob3VsZFF1b3RlID09PSB0cnVlICYmIGNvbnRhaW5zRXNjYXBlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCByZWdleHAgPVxuICAgICAgICAgICAgICBlc2NhcGUgPT09IFwiXFxcXFwiXG4gICAgICAgICAgICAgICAgPyBuZXcgUmVnRXhwKGVzY2FwZSArIGVzY2FwZSwgXCJnXCIpXG4gICAgICAgICAgICAgICAgOiBuZXcgUmVnRXhwKGVzY2FwZSwgXCJnXCIpO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlZ2V4cCwgZXNjYXBlICsgZXNjYXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvbnRhaW5zUXVvdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAocXVvdGUsIFwiZ1wiKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZWdleHAsIGVzY2FwZSArIHF1b3RlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNob3VsZFF1b3RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHF1b3RlICsgdmFsdWUgKyBxdW90ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3N2cmVjb3JkICs9IHZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHF1b3RlZF9lbXB0eSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgIChmaWVsZCA9PT0gXCJcIiAmJiBxdW90ZWRfc3RyaW5nID09PSB0cnVlICYmIHF1b3RlZF9lbXB0eSAhPT0gZmFsc2UpXG4gICAgICAgICkge1xuICAgICAgICAgIGNzdnJlY29yZCArPSBxdW90ZSArIHF1b3RlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpICE9PSByZWNvcmQubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGNzdnJlY29yZCArPSBkZWxpbWl0ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBbdW5kZWZpbmVkLCBjc3ZyZWNvcmRdO1xuICAgIH0sXG4gICAgYm9tOiBmdW5jdGlvbiAocHVzaCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib20gIT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcHVzaChib21fdXRmOCk7XG4gICAgfSxcbiAgICBoZWFkZXJzOiBmdW5jdGlvbiAocHVzaCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29sdW1ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBlcnI7XG4gICAgICBsZXQgaGVhZGVycyA9IHRoaXMub3B0aW9ucy5jb2x1bW5zLm1hcCgoY29sdW1uKSA9PiBjb2x1bW4uaGVhZGVyKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW9mKSB7XG4gICAgICAgIFtlcnIsIGhlYWRlcnNdID0gdGhpcy5zdHJpbmdpZnkoaGVhZGVycywgdHJ1ZSk7XG4gICAgICAgIGhlYWRlcnMgKz0gdGhpcy5vcHRpb25zLnJlY29yZF9kZWxpbWl0ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBbZXJyLCBoZWFkZXJzXSA9IHRoaXMuc3RyaW5naWZ5KGhlYWRlcnMpO1xuICAgICAgfVxuICAgICAgaWYgKGVycikgcmV0dXJuIGVycjtcbiAgICAgIHB1c2goaGVhZGVycyk7XG4gICAgfSxcbiAgICBfX2Nhc3Q6IGZ1bmN0aW9uICh2YWx1ZSwgY29udGV4dCkge1xuICAgICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgLy8gRmluZSBmb3IgOTklIG9mIHRoZSBjYXNlc1xuICAgICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuY2FzdC5zdHJpbmcodmFsdWUsIGNvbnRleHQpXTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcImJpZ2ludFwiKSB7XG4gICAgICAgICAgcmV0dXJuIFt1bmRlZmluZWQsIHRoaXMub3B0aW9ucy5jYXN0LmJpZ2ludCh2YWx1ZSwgY29udGV4dCldO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdGhpcy5vcHRpb25zLmNhc3QubnVtYmVyKHZhbHVlLCBjb250ZXh0KV07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdGhpcy5vcHRpb25zLmNhc3QuYm9vbGVhbih2YWx1ZSwgY29udGV4dCldO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuY2FzdC5kYXRlKHZhbHVlLCBjb250ZXh0KV07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuY2FzdC5vYmplY3QodmFsdWUsIGNvbnRleHQpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdmFsdWUsIHZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBbZXJyXTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufTtcblxuY29uc3Qgc3RyaW5naWZ5ID0gZnVuY3Rpb24gKHJlY29yZHMsIG9wdHMgPSB7fSkge1xuICBjb25zdCBkYXRhID0gW107XG4gIGNvbnN0IFtlcnIsIG9wdGlvbnNdID0gbm9ybWFsaXplX29wdGlvbnMob3B0cyk7XG4gIGlmIChlcnIgIT09IHVuZGVmaW5lZCkgdGhyb3cgZXJyO1xuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBzdG9wOiBmYWxzZSxcbiAgfTtcbiAgLy8gSW5mb3JtYXRpb25cbiAgY29uc3QgaW5mbyA9IHtcbiAgICByZWNvcmRzOiAwLFxuICB9O1xuICBjb25zdCBhcGkgPSBzdHJpbmdpZmllcihvcHRpb25zLCBzdGF0ZSwgaW5mbyk7XG4gIGZvciAoY29uc3QgcmVjb3JkIG9mIHJlY29yZHMpIHtcbiAgICBjb25zdCBlcnIgPSBhcGkuX190cmFuc2Zvcm0ocmVjb3JkLCBmdW5jdGlvbiAocmVjb3JkKSB7XG4gICAgICBkYXRhLnB1c2gocmVjb3JkKTtcbiAgICB9KTtcbiAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHRocm93IGVycjtcbiAgfVxuICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICBhcGkuYm9tKChkKSA9PiB7XG4gICAgICBkYXRhLnB1c2goZCk7XG4gICAgfSk7XG4gICAgY29uc3QgZXJyID0gYXBpLmhlYWRlcnMoKGhlYWRlcnMpID0+IHtcbiAgICAgIGRhdGEucHVzaChoZWFkZXJzKTtcbiAgICB9KTtcbiAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHRocm93IGVycjtcbiAgfVxuICByZXR1cm4gZGF0YS5qb2luKFwiXCIpO1xufTtcblxuZXhwb3J0cy5zdHJpbmdpZnkgPSBzdHJpbmdpZnk7XG4iLCIvLyBUaGlzIGZpbGUgcmVwbGFjZXMgYGluZGV4LmpzYCBpbiBidW5kbGVycyBsaWtlIHdlYnBhY2sgb3IgUm9sbHVwLFxuLy8gYWNjb3JkaW5nIHRvIGBicm93c2VyYCBjb25maWcgaW4gYHBhY2thZ2UuanNvbmAuXG5cbmltcG9ydCB7IHVybEFscGhhYmV0IH0gZnJvbSAnLi91cmwtYWxwaGFiZXQvaW5kZXguanMnXG5cbmxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcblxubGV0IGN1c3RvbVJhbmRvbSA9IChhbHBoYWJldCwgZGVmYXVsdFNpemUsIGdldFJhbmRvbSkgPT4ge1xuICAvLyBGaXJzdCwgYSBiaXRtYXNrIGlzIG5lY2Vzc2FyeSB0byBnZW5lcmF0ZSB0aGUgSUQuIFRoZSBiaXRtYXNrIG1ha2VzIGJ5dGVzXG4gIC8vIHZhbHVlcyBjbG9zZXIgdG8gdGhlIGFscGhhYmV0IHNpemUuIFRoZSBiaXRtYXNrIGNhbGN1bGF0ZXMgdGhlIGNsb3Nlc3RcbiAgLy8gYDJeMzEgLSAxYCBudW1iZXIsIHdoaWNoIGV4Y2VlZHMgdGhlIGFscGhhYmV0IHNpemUuXG4gIC8vIEZvciBleGFtcGxlLCB0aGUgYml0bWFzayBmb3IgdGhlIGFscGhhYmV0IHNpemUgMzAgaXMgMzEgKDAwMDExMTExKS5cbiAgLy8gYE1hdGguY2x6MzJgIGlzIG5vdCB1c2VkLCBiZWNhdXNlIGl0IGlzIG5vdCBhdmFpbGFibGUgaW4gYnJvd3NlcnMuXG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgLy8gVGhvdWdoLCB0aGUgYml0bWFzayBzb2x1dGlvbiBpcyBub3QgcGVyZmVjdCBzaW5jZSB0aGUgYnl0ZXMgZXhjZWVkaW5nXG4gIC8vIHRoZSBhbHBoYWJldCBzaXplIGFyZSByZWZ1c2VkLiBUaGVyZWZvcmUsIHRvIHJlbGlhYmx5IGdlbmVyYXRlIHRoZSBJRCxcbiAgLy8gdGhlIHJhbmRvbSBieXRlcyByZWR1bmRhbmN5IGhhcyB0byBiZSBzYXRpc2ZpZWQuXG5cbiAgLy8gTm90ZTogZXZlcnkgaGFyZHdhcmUgcmFuZG9tIGdlbmVyYXRvciBjYWxsIGlzIHBlcmZvcm1hbmNlIGV4cGVuc2l2ZSxcbiAgLy8gYmVjYXVzZSB0aGUgc3lzdGVtIGNhbGwgZm9yIGVudHJvcHkgY29sbGVjdGlvbiB0YWtlcyBhIGxvdCBvZiB0aW1lLlxuICAvLyBTbywgdG8gYXZvaWQgYWRkaXRpb25hbCBzeXN0ZW0gY2FsbHMsIGV4dHJhIGJ5dGVzIGFyZSByZXF1ZXN0ZWQgaW4gYWR2YW5jZS5cblxuICAvLyBOZXh0LCBhIHN0ZXAgZGV0ZXJtaW5lcyBob3cgbWFueSByYW5kb20gYnl0ZXMgdG8gZ2VuZXJhdGUuXG4gIC8vIFRoZSBudW1iZXIgb2YgcmFuZG9tIGJ5dGVzIGdldHMgZGVjaWRlZCB1cG9uIHRoZSBJRCBzaXplLCBtYXNrLFxuICAvLyBhbHBoYWJldCBzaXplLCBhbmQgbWFnaWMgbnVtYmVyIDEuNiAodXNpbmcgMS42IHBlYWtzIGF0IHBlcmZvcm1hbmNlXG4gIC8vIGFjY29yZGluZyB0byBiZW5jaG1hcmtzKS5cblxuICAvLyBgLX5mID0+IE1hdGguY2VpbChmKWAgaWYgZiBpcyBhIGZsb2F0XG4gIC8vIGAtfmkgPT4gaSArIDFgIGlmIGkgaXMgYW4gaW50ZWdlclxuICBsZXQgc3RlcCA9IC1+KCgxLjYgKiBtYXNrICogZGVmYXVsdFNpemUpIC8gYWxwaGFiZXQubGVuZ3RoKVxuXG4gIHJldHVybiAoc2l6ZSA9IGRlZmF1bHRTaXplKSA9PiB7XG4gICAgbGV0IGlkID0gJydcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGJ5dGVzID0gZ2V0UmFuZG9tKHN0ZXApXG4gICAgICAvLyBBIGNvbXBhY3QgYWx0ZXJuYXRpdmUgZm9yIGBmb3IgKHZhciBpID0gMDsgaSA8IHN0ZXA7IGkrKylgLlxuICAgICAgbGV0IGogPSBzdGVwIHwgMFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICAvLyBBZGRpbmcgYHx8ICcnYCByZWZ1c2VzIGEgcmFuZG9tIGJ5dGUgdGhhdCBleGNlZWRzIHRoZSBhbHBoYWJldCBzaXplLlxuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5sZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUgPSAyMSkgPT5cbiAgY3VzdG9tUmFuZG9tKGFscGhhYmV0LCBzaXplLCByYW5kb20pXG5cbmxldCBuYW5vaWQgPSAoc2l6ZSA9IDIxKSA9PlxuICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KHNpemUpKS5yZWR1Y2UoKGlkLCBieXRlKSA9PiB7XG4gICAgLy8gSXQgaXMgaW5jb3JyZWN0IHRvIHVzZSBieXRlcyBleGNlZWRpbmcgdGhlIGFscGhhYmV0IHNpemUuXG4gICAgLy8gVGhlIGZvbGxvd2luZyBtYXNrIHJlZHVjZXMgdGhlIHJhbmRvbSBieXRlIGluIHRoZSAwLTI1NSB2YWx1ZVxuICAgIC8vIHJhbmdlIHRvIHRoZSAwLTYzIHZhbHVlIHJhbmdlLiBUaGVyZWZvcmUsIGFkZGluZyBoYWNrcywgc3VjaFxuICAgIC8vIGFzIGVtcHR5IHN0cmluZyBmYWxsYmFjayBvciBtYWdpYyBudW1iZXJzLCBpcyB1bm5lY2Nlc3NhcnkgYmVjYXVzZVxuICAgIC8vIHRoZSBiaXRtYXNrIHRyaW1zIGJ5dGVzIGRvd24gdG8gdGhlIGFscGhhYmV0IHNpemUuXG4gICAgYnl0ZSAmPSA2M1xuICAgIGlmIChieXRlIDwgMzYpIHtcbiAgICAgIC8vIGAwLTlhLXpgXG4gICAgICBpZCArPSBieXRlLnRvU3RyaW5nKDM2KVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYyKSB7XG4gICAgICAvLyBgQS1aYFxuICAgICAgaWQgKz0gKGJ5dGUgLSAyNikudG9TdHJpbmcoMzYpLnRvVXBwZXJDYXNlKClcbiAgICB9IGVsc2UgaWYgKGJ5dGUgPiA2Mikge1xuICAgICAgaWQgKz0gJy0nXG4gICAgfSBlbHNlIHtcbiAgICAgIGlkICs9ICdfJ1xuICAgIH1cbiAgICByZXR1cm4gaWRcbiAgfSwgJycpXG5cbmV4cG9ydCB7IG5hbm9pZCwgY3VzdG9tQWxwaGFiZXQsIGN1c3RvbVJhbmRvbSwgdXJsQWxwaGFiZXQsIHJhbmRvbSB9XG4iLCIvLyBUaGlzIGFscGhhYmV0IHVzZXMgYEEtWmEtejAtOV8tYCBzeW1ib2xzLlxuLy8gVGhlIG9yZGVyIG9mIGNoYXJhY3RlcnMgaXMgb3B0aW1pemVkIGZvciBiZXR0ZXIgZ3ppcCBhbmQgYnJvdGxpIGNvbXByZXNzaW9uLlxuLy8gU2FtZSBhcyBpbiBub24tc2VjdXJlL2luZGV4LmpzXG5sZXQgdXJsQWxwaGFiZXQgPVxuICAndXNlYW5kb20tMjZUMTk4MzQwUFg3NXB4SkFDS1ZFUllNSU5EQlVTSFdPTEZfR1FaYmZnaGprbHF2d3l6cmljdCdcblxuZXhwb3J0IHsgdXJsQWxwaGFiZXQgfVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvc2NyaXB0cy9yZW5kZXJlci50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==