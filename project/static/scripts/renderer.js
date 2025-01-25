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
.gap-\\[16px\\] {
  gap: 16px;
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
.overflow-y-auto {
  overflow-y: auto;
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
.border-neutral_7 {
  --tw-border-opacity: 1;
  border-color: rgba(20, 20, 20, var(--tw-border-opacity, 1));
}
.bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
}
.bg-neutral_2 {
  --tw-bg-opacity: 1;
  background-color: rgba(245, 245, 245, var(--tw-bg-opacity, 1));
}
.bg-neutral_4 {
  --tw-bg-opacity: 1;
  background-color: rgba(235, 235, 235, var(--tw-bg-opacity, 1));
}
.bg-neutral_9 {
  --tw-bg-opacity: 1;
  background-color: rgba(30, 30, 30, var(--tw-bg-opacity, 1));
}
.bg-red-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(248 113 113 / var(--tw-bg-opacity, 1));
}
.p-\\[16px\\] {
  padding: 16px;
}
.p-\\[32px\\] {
  padding: 32px;
}
.p-\\[8px\\] {
  padding: 8px;
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
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
}
.text-neutral_9 {
  --tw-text-opacity: 1;
  color: rgba(30, 30, 30, var(--tw-text-opacity, 1));
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
  background-color: rgba(245, 245, 245, var(--tw-bg-opacity, 1));
  padding: 8px;
}

.base-input:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity, 1));
}

.base-border {
  --tw-border-opacity: 1;
  border-color: rgba(20, 20, 20, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
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
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
}

.base-outline {
  outline-style: solid;
  outline-width: 1px;
  outline-color: rgb(0 0 0 / 0.25);
}


.unit {
  --tw-border-opacity: 1;
  border-color: rgba(20, 20, 20, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
  text-align: center;
  vertical-align: middle;
  outline-style: solid;
  outline-width: 1px;
  outline-color: rgb(0 0 0 / 0.25);
}

.button-submit {
  --tw-border-opacity: 1;
  border-color: rgba(20, 20, 20, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
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
  background-color: rgba(245, 245, 245, var(--tw-bg-opacity, 1));
  padding: 8px;
}

.input-number:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity, 1));
}

.input-number {
  --tw-border-opacity: 1;
  border-color: rgba(20, 20, 20, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
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
  background-color: rgba(245, 245, 245, var(--tw-bg-opacity, 1));
  padding: 8px;
}

.input-text:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity, 1));
}

.input-text {
  --tw-border-opacity: 1;
  border-color: rgba(20, 20, 20, var(--tw-border-opacity, 1));
  --tw-text-opacity: 1;
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
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
  color: rgba(20, 20, 20, var(--tw-text-opacity, 1));
}

.input-field {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-content {
  display: flex;
  height: 100%;
  width: 100%;
  gap: 16px;
  padding: 16px;
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

.hover\\:border-b-\\[2px\\]:hover {
  border-bottom-width: 2px;
}

.hover\\:border-yellow-500:hover {
  --tw-border-opacity: 1;
  border-color: rgb(234 179 8 / var(--tw-border-opacity, 1));
}

.hover\\:bg-neutral_0:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity, 1));
}

.hover\\:bg-neutral_7:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(20, 20, 20, var(--tw-bg-opacity, 1));
}
`, "",{"version":3,"sources":["webpack://./src/scripts/styles/index.css"],"names":[],"mappings":"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","sourcesContent":["@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@import \"./themes.css\";\n@import \"./fonts.css\";\n@import \"./texts.css\";\n@import \"./inputs.css\";\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,\n    Arial, sans-serif;\n}\n\n.base {\n  @apply text-center align-middle;\n}\n\n.base-input {\n  @apply rounded-[4px] p-[8px] w-full h-[36px] flex items-center justify-center bg-neutral_2 hover:bg-neutral_0;\n}\n\n.base-border {\n  @apply border-neutral_7 text-neutral_7\n}\n\n.base-text-position {\n  @apply text-center align-middle\n}\n\n.base-text-position-center {\n  @apply text-center align-middle\n}\n\n.base-text-style {\n  @apply text-neutral_7 lowercase\n}\n\n.base-outline {\n  @apply outline outline-[1px] outline-black/25;\n}\n\n\n.unit {\n  @apply base-text-position-center base-border base-outline\n}\n\n.button-submit {\n  @apply base-text-position-center base-border base-outline\n}\n\n.input-number {\n  @apply base-text-position base-border base-outline base-input continuous-number;\n}\n\n.input-text {\n  @apply base-text-position base-border base-outline base-input;\n}\n\n.field-title {\n  @apply base-text-position-center base-text-style w-full h-[24px];\n}\n\n.input-field {\n  @apply w-full h-full flex flex-col items-center justify-center;\n}\n\n.main-content {\n  @apply w-full h-full flex gap-[16px] p-[16px]\n}\n\ninput.continuous-number {\n  appearance: none;\n  margin: 0;\n  -webkit-appearance: none;\n  -moz-appearance: textfield;\n}\n\ninput.continuous-number::-webkit-inner-spin-button,\ninput.continuous-number::-webkit-outer-spin-button {\n-webkit-appearance: none;\nmargin: 0;\n}\n"],"sourceRoot":""}]);
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

/***/ "./src/scripts/database-manager.ts":
/*!*****************************************!*\
  !*** ./src/scripts/database-manager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseManager = void 0;
const path_manager_1 = __webpack_require__(/*! ./path-manager */ "./src/scripts/path-manager.ts");
const transactions_manager_1 = __webpack_require__(/*! ./transactions-manager */ "./src/scripts/transactions-manager.ts");
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const alpinejs_1 = __importDefault(__webpack_require__(/*! alpinejs */ "./node_modules/alpinejs/dist/module.esm.js"));
__webpack_require__(/*! ./styles/index.css */ "./src/scripts/styles/index.css");
const database_manager_1 = __webpack_require__(/*! ./database-manager */ "./src/scripts/database-manager.ts");
const path_manager_1 = __webpack_require__(/*! ./path-manager */ "./src/scripts/path-manager.ts");
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
window.Alpine = alpinejs_1.default;
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('../views/header.html', 'header-container');
    alpinejs_1.default.start();
    console.log("RENDERER");
    const pathManager = path_manager_1.PathManager.GetInstance();
    const transactionsManager = database_manager_1.DatabaseManager.GetInstance().GetTransactionManager();
    alpinejs_1.default.store("TransactionsManager", transactionsManager);
    document.documentElement.setAttribute('data-theme', 'custom_light');
});


/***/ }),

/***/ "./src/scripts/transactions-manager.ts":
/*!*********************************************!*\
  !*** ./src/scripts/transactions-manager.ts ***!
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
exports.TransactionsManager = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const transaction_1 = __webpack_require__(/*! ../models/transaction */ "./src/models/transaction.ts");
const path_manager_1 = __webpack_require__(/*! ./path-manager */ "./src/scripts/path-manager.ts");
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
                const header = [
                    "id", "creationDate", "lastModified", "name", "description", "type", "agent",
                    "transactionDate", "referenceDate", "value", "name", "details"
                ];
                const newCSV = (0, sync_2.stringify)([], { header: true });
                fs.writeFileSync(file, newCSV, 'utf-8');
                console.log("CSV file created with header.");
            }
            const fileContent = fs.readFileSync(file, 'utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            const newId = records.length > 0 ? Math.max(...records.map((r) => parseInt(r.id))) + 1 : 1;
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
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
            const transactionDate = new Date(2025, 1, 30);
            const referenceDate = new Date(2025, 1, 30);
            const transaction = new transaction_1.Transaction(newId, currentDate, currentDate, name, description, transactionType, agent, transactionDate, referenceDate, value, details || "");
            this._transactions.push(transaction);
            const transactionPlain = {
                id: newId,
                creationDate: currentDate.toISOString(),
                lastModified: currentDate.toISOString(),
                name: name,
                description: description,
                type: type,
                agent: agent,
                transactionDate: transactionDate.toISOString(),
                referenceDate: referenceDate.toISOString(),
                value: value,
                details: details || "",
            };
            records.push(transactionPlain);
            const updatedCSV = (0, sync_2.stringify)(records, { header: true });
            fs.writeFileSync(file, updatedCSV, 'utf-8');
            console.log('Transaction successfully added to CSV file.');
        }
        catch (error) {
            console.error('Error processing CSV file:', error);
        }
    }
    Read() {
        const file = path_1.default.join(this.ROOT, "database", "transactions.csv");
        console.log(file);
        try {
            if (!fs.existsSync(file)) {
                const header = [
                    "id", "creationDate", "lastModified", "name", "description", "type", "agent", "transactionDate", "referenceDate",
                    "value", "name", "details"
                ];
                const newCSV = (0, sync_2.stringify)([], { header: true });
                fs.writeFileSync(file, newCSV, 'utf-8');
                console.log("CSV file created with header.");
            }
            const fileContent = fs.readFileSync(file, 'utf-8');
            console.log(fileContent);
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            this._transactions = records.map((record) => {
                const transaction = new transaction_1.Transaction(record.newId, record.currentDate, record.currentDate, record.name, record.description, record.type, record.agent, record.transactionDate, record.referenceDate, record.value, record.details || "");
            });
            console.log('Transactions successfully read from CSV file.');
        }
        catch (error) {
            console.error('Error reading CSV file:', error);
        }
    }
    Update() {
    }
    Delete() {
    }
}
exports.TransactionsManager = TransactionsManager;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFNBQVMsaUJBQWlCLFNBQVM7QUFDMUQ7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsOEJBQThCLElBQUksOEJBQThCO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsT0FBTztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJO0FBQ1osNENBQTRDLFlBQVk7QUFDeEQ7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLFFBQVEsSUFBSTtBQUNaLCtDQUErQyxZQUFZO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxZQUFZO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSx1QkFBdUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsSUFBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSx1QkFBdUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsSUFBSTtBQUNqQjtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsMERBQTBELFdBQVc7QUFDckU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsV0FBVyxJQUFJLG1CQUFtQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLDJDQUEyQyxZQUFZLElBQUksaUJBQWlCO0FBQzVFO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDO0FBQ2pDLHdCQUF3QjtBQUN4Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCO0FBQzlCLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQiwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sK0ZBQStGLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxLQUFLLE1BQU0sS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsS0FBSyxXQUFXLFlBQVksTUFBTSxPQUFPLHFCQUFxQixvQkFBb0IscUJBQXFCLHFCQUFxQixNQUFNLE1BQU0sV0FBVyxNQUFNLFlBQVksTUFBTSxNQUFNLHFCQUFxQixxQkFBcUIscUJBQXFCLFVBQVUsb0JBQW9CLHFCQUFxQixxQkFBcUIscUJBQXFCLHFCQUFxQixNQUFNLE9BQU8sTUFBTSxLQUFLLG9CQUFvQixxQkFBcUIsTUFBTSxRQUFRLE1BQU0sS0FBSyxvQkFBb0Isb0JBQW9CLHFCQUFxQixNQUFNLE1BQU0sTUFBTSxLQUFLLFdBQVcsV0FBVyxNQUFNLE1BQU0sTUFBTSxVQUFVLFdBQVcsV0FBVyxNQUFNLE1BQU0sTUFBTSxLQUFLLFVBQVUsV0FBVyxNQUFNLE1BQU0sTUFBTSxNQUFNLFdBQVcsTUFBTSxTQUFTLE1BQU0sUUFBUSxxQkFBcUIscUJBQXFCLHFCQUFxQixvQkFBb0IsTUFBTSxNQUFNLE1BQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxNQUFNLE1BQU0sVUFBVSxVQUFVLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLFFBQVEsTUFBTSxLQUFLLG9CQUFvQixxQkFBcUIscUJBQXFCLE1BQU0sUUFBUSxNQUFNLFNBQVMscUJBQXFCLHFCQUFxQixxQkFBcUIsb0JBQW9CLHFCQUFxQixxQkFBcUIscUJBQXFCLG9CQUFvQixvQkFBb0Isb0JBQW9CLE1BQU0sTUFBTSxNQUFNLE1BQU0sV0FBVyxNQUFNLE9BQU8sTUFBTSxRQUFRLHFCQUFxQixxQkFBcUIscUJBQXFCLE1BQU0sTUFBTSxNQUFNLEtBQUssVUFBVSxNQUFNLE1BQU0sTUFBTSxLQUFLLFdBQVcsTUFBTSxNQUFNLE1BQU0sS0FBSyxXQUFXLE1BQU0sTUFBTSxNQUFNLE1BQU0sVUFBVSxNQUFNLE9BQU8sTUFBTSxLQUFLLHFCQUFxQixxQkFBcUIsTUFBTSxNQUFNLE1BQU0sS0FBSyxXQUFXLE1BQU0sT0FBTyxNQUFNLEtBQUsscUJBQXFCLG9CQUFvQixNQUFNLE1BQU0sTUFBTSxLQUFLLFdBQVcsTUFBTSxNQUFNLE1BQU0saUJBQWlCLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLE9BQU8sV0FBVyxVQUFVLFVBQVUsTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFVLE1BQU0sTUFBTSxNQUFNLEtBQUssV0FBVyxNQUFNLE9BQU8sTUFBTSxLQUFLLG9CQUFvQixvQkFBb0IsTUFBTSxNQUFNLG9CQUFvQixvQkFBb0IsTUFBTSxNQUFNLE1BQU0sTUFBTSxVQUFVLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxNQUFNLFFBQVEsTUFBTSxZQUFZLG9CQUFvQixxQkFBcUIsTUFBTSxNQUFNLE1BQU0sTUFBTSxVQUFVLFVBQVUsTUFBTSxXQUFXLEtBQUssVUFBVSxLQUFLLEtBQUssS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLEtBQUssT0FBTyxPQUFPLEtBQUssWUFBWSxNQUFNLE9BQU8sTUFBTSxXQUFXLFlBQVksWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsTUFBTSxPQUFPLE1BQU0sWUFBWSxNQUFNLE9BQU8sTUFBTSxZQUFZLGFBQWEsYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLFlBQVksTUFBTSxPQUFPLE1BQU0sWUFBWSxhQUFhLE1BQU0sT0FBTyxNQUFNLFlBQVksYUFBYSxNQUFNLFFBQVEsTUFBTSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsTUFBTSxPQUFPLE1BQU0sWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sT0FBTyxNQUFNLFdBQVcsWUFBWSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxNQUFNLE9BQU8sTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLFlBQVksYUFBYSxhQUFh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QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaUNBQWlDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsNEJBQTRCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixNQUFNO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsZUFBZSw0QkFBNEI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLGVBQWUsa0NBQWtDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxlQUFlLDhCQUE4QjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxlQUFlLHdDQUF3QztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RSw2QkFBNkI7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLG9FQUFvRSwrQkFBK0I7QUFDbkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELHVCQUF1QjtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsOEVBQThFLHlDQUF5QztBQUN2SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Qsc0JBQXNCO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsVUFBVTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSLHdCQUF3QixvQkFBb0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsbUJBQW1CO0FBQ3pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0dBQXdHLHNCQUFzQjtBQUM5SDtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLCtHQUErRyxzQkFBc0I7QUFDckk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLDBFQUEwRSxzQkFBc0I7QUFDaEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLE1BQU07QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUI7Ozs7Ozs7VUM1dEJqQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7VUVBQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvYWxwaW5lanMvZGlzdC9tb2R1bGUuZXNtLmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9zdHlsZXMvaW5kZXguY3NzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9zdHlsZXMvZm9udHMuY3NzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9zdHlsZXMvaW5wdXRzLmNzcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL3NjcmlwdHMvc3R5bGVzL3RleHRzLmNzcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL3NjcmlwdHMvc3R5bGVzL3RoZW1lcy5jc3MiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9zdHlsZXMvaW5kZXguY3NzP2NkMzUiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vc3JjL2VudW1zL3RyYW5zYWN0aW9uLXR5cGUudHMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9tb2RlbHMvZW50aXR5LnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvbW9kZWxzL3RyYW5zYWN0aW9uLnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9kYXRhYmFzZS1tYW5hZ2VyLnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy9wYXRoLW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC8uL3NyYy9zY3JpcHRzL3JlbmRlcmVyLnRzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvLi9zcmMvc2NyaXB0cy90cmFuc2FjdGlvbnMtbWFuYWdlci50cyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJmc1wiIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInBhdGhcIiIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL2Nzdi1wYXJzZS9kaXN0L2Nqcy9zeW5jLmNqcyIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwLy4vbm9kZV9tb2R1bGVzL2Nzdi1zdHJpbmdpZnkvZGlzdC9janMvc3luYy5janMiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9maW5hbmNpYWwtYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vZmluYW5jaWFsLWFwcC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2ZpbmFuY2lhbC1hcHAvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9zY2hlZHVsZXIuanNcbnZhciBmbHVzaFBlbmRpbmcgPSBmYWxzZTtcbnZhciBmbHVzaGluZyA9IGZhbHNlO1xudmFyIHF1ZXVlID0gW107XG52YXIgbGFzdEZsdXNoZWRJbmRleCA9IC0xO1xuZnVuY3Rpb24gc2NoZWR1bGVyKGNhbGxiYWNrKSB7XG4gIHF1ZXVlSm9iKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIHF1ZXVlSm9iKGpvYikge1xuICBpZiAoIXF1ZXVlLmluY2x1ZGVzKGpvYikpXG4gICAgcXVldWUucHVzaChqb2IpO1xuICBxdWV1ZUZsdXNoKCk7XG59XG5mdW5jdGlvbiBkZXF1ZXVlSm9iKGpvYikge1xuICBsZXQgaW5kZXggPSBxdWV1ZS5pbmRleE9mKGpvYik7XG4gIGlmIChpbmRleCAhPT0gLTEgJiYgaW5kZXggPiBsYXN0Rmx1c2hlZEluZGV4KVxuICAgIHF1ZXVlLnNwbGljZShpbmRleCwgMSk7XG59XG5mdW5jdGlvbiBxdWV1ZUZsdXNoKCkge1xuICBpZiAoIWZsdXNoaW5nICYmICFmbHVzaFBlbmRpbmcpIHtcbiAgICBmbHVzaFBlbmRpbmcgPSB0cnVlO1xuICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoSm9icyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGZsdXNoSm9icygpIHtcbiAgZmx1c2hQZW5kaW5nID0gZmFsc2U7XG4gIGZsdXNoaW5nID0gdHJ1ZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHF1ZXVlW2ldKCk7XG4gICAgbGFzdEZsdXNoZWRJbmRleCA9IGk7XG4gIH1cbiAgcXVldWUubGVuZ3RoID0gMDtcbiAgbGFzdEZsdXNoZWRJbmRleCA9IC0xO1xuICBmbHVzaGluZyA9IGZhbHNlO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvcmVhY3Rpdml0eS5qc1xudmFyIHJlYWN0aXZlO1xudmFyIGVmZmVjdDtcbnZhciByZWxlYXNlO1xudmFyIHJhdztcbnZhciBzaG91bGRTY2hlZHVsZSA9IHRydWU7XG5mdW5jdGlvbiBkaXNhYmxlRWZmZWN0U2NoZWR1bGluZyhjYWxsYmFjaykge1xuICBzaG91bGRTY2hlZHVsZSA9IGZhbHNlO1xuICBjYWxsYmFjaygpO1xuICBzaG91bGRTY2hlZHVsZSA9IHRydWU7XG59XG5mdW5jdGlvbiBzZXRSZWFjdGl2aXR5RW5naW5lKGVuZ2luZSkge1xuICByZWFjdGl2ZSA9IGVuZ2luZS5yZWFjdGl2ZTtcbiAgcmVsZWFzZSA9IGVuZ2luZS5yZWxlYXNlO1xuICBlZmZlY3QgPSAoY2FsbGJhY2spID0+IGVuZ2luZS5lZmZlY3QoY2FsbGJhY2ssIHsgc2NoZWR1bGVyOiAodGFzaykgPT4ge1xuICAgIGlmIChzaG91bGRTY2hlZHVsZSkge1xuICAgICAgc2NoZWR1bGVyKHRhc2spO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXNrKCk7XG4gICAgfVxuICB9IH0pO1xuICByYXcgPSBlbmdpbmUucmF3O1xufVxuZnVuY3Rpb24gb3ZlcnJpZGVFZmZlY3Qob3ZlcnJpZGUpIHtcbiAgZWZmZWN0ID0gb3ZlcnJpZGU7XG59XG5mdW5jdGlvbiBlbGVtZW50Qm91bmRFZmZlY3QoZWwpIHtcbiAgbGV0IGNsZWFudXAyID0gKCkgPT4ge1xuICB9O1xuICBsZXQgd3JhcHBlZEVmZmVjdCA9IChjYWxsYmFjaykgPT4ge1xuICAgIGxldCBlZmZlY3RSZWZlcmVuY2UgPSBlZmZlY3QoY2FsbGJhY2spO1xuICAgIGlmICghZWwuX3hfZWZmZWN0cykge1xuICAgICAgZWwuX3hfZWZmZWN0cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gICAgICBlbC5feF9ydW5FZmZlY3RzID0gKCkgPT4ge1xuICAgICAgICBlbC5feF9lZmZlY3RzLmZvckVhY2goKGkpID0+IGkoKSk7XG4gICAgICB9O1xuICAgIH1cbiAgICBlbC5feF9lZmZlY3RzLmFkZChlZmZlY3RSZWZlcmVuY2UpO1xuICAgIGNsZWFudXAyID0gKCkgPT4ge1xuICAgICAgaWYgKGVmZmVjdFJlZmVyZW5jZSA9PT0gdm9pZCAwKVxuICAgICAgICByZXR1cm47XG4gICAgICBlbC5feF9lZmZlY3RzLmRlbGV0ZShlZmZlY3RSZWZlcmVuY2UpO1xuICAgICAgcmVsZWFzZShlZmZlY3RSZWZlcmVuY2UpO1xuICAgIH07XG4gICAgcmV0dXJuIGVmZmVjdFJlZmVyZW5jZTtcbiAgfTtcbiAgcmV0dXJuIFt3cmFwcGVkRWZmZWN0LCAoKSA9PiB7XG4gICAgY2xlYW51cDIoKTtcbiAgfV07XG59XG5mdW5jdGlvbiB3YXRjaChnZXR0ZXIsIGNhbGxiYWNrKSB7XG4gIGxldCBmaXJzdFRpbWUgPSB0cnVlO1xuICBsZXQgb2xkVmFsdWU7XG4gIGxldCBlZmZlY3RSZWZlcmVuY2UgPSBlZmZlY3QoKCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGdldHRlcigpO1xuICAgIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICBpZiAoIWZpcnN0VGltZSkge1xuICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayh2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICBvbGRWYWx1ZSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICB9KTtcbiAgcmV0dXJuICgpID0+IHJlbGVhc2UoZWZmZWN0UmVmZXJlbmNlKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL211dGF0aW9uLmpzXG52YXIgb25BdHRyaWJ1dGVBZGRlZHMgPSBbXTtcbnZhciBvbkVsUmVtb3ZlZHMgPSBbXTtcbnZhciBvbkVsQWRkZWRzID0gW107XG5mdW5jdGlvbiBvbkVsQWRkZWQoY2FsbGJhY2spIHtcbiAgb25FbEFkZGVkcy5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIG9uRWxSZW1vdmVkKGVsLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpZiAoIWVsLl94X2NsZWFudXBzKVxuICAgICAgZWwuX3hfY2xlYW51cHMgPSBbXTtcbiAgICBlbC5feF9jbGVhbnVwcy5wdXNoKGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjayA9IGVsO1xuICAgIG9uRWxSZW1vdmVkcy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxufVxuZnVuY3Rpb24gb25BdHRyaWJ1dGVzQWRkZWQoY2FsbGJhY2spIHtcbiAgb25BdHRyaWJ1dGVBZGRlZHMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBvbkF0dHJpYnV0ZVJlbW92ZWQoZWwsIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMpXG4gICAgZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMgPSB7fTtcbiAgaWYgKCFlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXSlcbiAgICBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXSA9IFtdO1xuICBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXS5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGNsZWFudXBBdHRyaWJ1dGVzKGVsLCBuYW1lcykge1xuICBpZiAoIWVsLl94X2F0dHJpYnV0ZUNsZWFudXBzKVxuICAgIHJldHVybjtcbiAgT2JqZWN0LmVudHJpZXMoZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMpLmZvckVhY2goKFtuYW1lLCB2YWx1ZV0pID0+IHtcbiAgICBpZiAobmFtZXMgPT09IHZvaWQgMCB8fCBuYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xuICAgICAgdmFsdWUuZm9yRWFjaCgoaSkgPT4gaSgpKTtcbiAgICAgIGRlbGV0ZSBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gY2xlYW51cEVsZW1lbnQoZWwpIHtcbiAgZWwuX3hfZWZmZWN0cz8uZm9yRWFjaChkZXF1ZXVlSm9iKTtcbiAgd2hpbGUgKGVsLl94X2NsZWFudXBzPy5sZW5ndGgpXG4gICAgZWwuX3hfY2xlYW51cHMucG9wKCkoKTtcbn1cbnZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG9uTXV0YXRlKTtcbnZhciBjdXJyZW50bHlPYnNlcnZpbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zKCkge1xuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IHN1YnRyZWU6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSwgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUgfSk7XG4gIGN1cnJlbnRseU9ic2VydmluZyA9IHRydWU7XG59XG5mdW5jdGlvbiBzdG9wT2JzZXJ2aW5nTXV0YXRpb25zKCkge1xuICBmbHVzaE9ic2VydmVyKCk7XG4gIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgY3VycmVudGx5T2JzZXJ2aW5nID0gZmFsc2U7XG59XG52YXIgcXVldWVkTXV0YXRpb25zID0gW107XG5mdW5jdGlvbiBmbHVzaE9ic2VydmVyKCkge1xuICBsZXQgcmVjb3JkcyA9IG9ic2VydmVyLnRha2VSZWNvcmRzKCk7XG4gIHF1ZXVlZE11dGF0aW9ucy5wdXNoKCgpID0+IHJlY29yZHMubGVuZ3RoID4gMCAmJiBvbk11dGF0ZShyZWNvcmRzKSk7XG4gIGxldCBxdWV1ZUxlbmd0aFdoZW5UcmlnZ2VyZWQgPSBxdWV1ZWRNdXRhdGlvbnMubGVuZ3RoO1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgaWYgKHF1ZXVlZE11dGF0aW9ucy5sZW5ndGggPT09IHF1ZXVlTGVuZ3RoV2hlblRyaWdnZXJlZCkge1xuICAgICAgd2hpbGUgKHF1ZXVlZE11dGF0aW9ucy5sZW5ndGggPiAwKVxuICAgICAgICBxdWV1ZWRNdXRhdGlvbnMuc2hpZnQoKSgpO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBtdXRhdGVEb20oY2FsbGJhY2spIHtcbiAgaWYgKCFjdXJyZW50bHlPYnNlcnZpbmcpXG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIHN0b3BPYnNlcnZpbmdNdXRhdGlvbnMoKTtcbiAgbGV0IHJlc3VsdCA9IGNhbGxiYWNrKCk7XG4gIHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zKCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG52YXIgaXNDb2xsZWN0aW5nID0gZmFsc2U7XG52YXIgZGVmZXJyZWRNdXRhdGlvbnMgPSBbXTtcbmZ1bmN0aW9uIGRlZmVyTXV0YXRpb25zKCkge1xuICBpc0NvbGxlY3RpbmcgPSB0cnVlO1xufVxuZnVuY3Rpb24gZmx1c2hBbmRTdG9wRGVmZXJyaW5nTXV0YXRpb25zKCkge1xuICBpc0NvbGxlY3RpbmcgPSBmYWxzZTtcbiAgb25NdXRhdGUoZGVmZXJyZWRNdXRhdGlvbnMpO1xuICBkZWZlcnJlZE11dGF0aW9ucyA9IFtdO1xufVxuZnVuY3Rpb24gb25NdXRhdGUobXV0YXRpb25zKSB7XG4gIGlmIChpc0NvbGxlY3RpbmcpIHtcbiAgICBkZWZlcnJlZE11dGF0aW9ucyA9IGRlZmVycmVkTXV0YXRpb25zLmNvbmNhdChtdXRhdGlvbnMpO1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgYWRkZWROb2RlcyA9IFtdO1xuICBsZXQgcmVtb3ZlZE5vZGVzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgbGV0IGFkZGVkQXR0cmlidXRlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gIGxldCByZW1vdmVkQXR0cmlidXRlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG11dGF0aW9uc1tpXS50YXJnZXQuX3hfaWdub3JlTXV0YXRpb25PYnNlcnZlcilcbiAgICAgIGNvbnRpbnVlO1xuICAgIGlmIChtdXRhdGlvbnNbaV0udHlwZSA9PT0gXCJjaGlsZExpc3RcIikge1xuICAgICAgbXV0YXRpb25zW2ldLnJlbW92ZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSAxKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKCFub2RlLl94X21hcmtlcilcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJlbW92ZWROb2Rlcy5hZGQobm9kZSk7XG4gICAgICB9KTtcbiAgICAgIG11dGF0aW9uc1tpXS5hZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IDEpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAocmVtb3ZlZE5vZGVzLmhhcyhub2RlKSkge1xuICAgICAgICAgIHJlbW92ZWROb2Rlcy5kZWxldGUobm9kZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLl94X21hcmtlcilcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGFkZGVkTm9kZXMucHVzaChub2RlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobXV0YXRpb25zW2ldLnR5cGUgPT09IFwiYXR0cmlidXRlc1wiKSB7XG4gICAgICBsZXQgZWwgPSBtdXRhdGlvbnNbaV0udGFyZ2V0O1xuICAgICAgbGV0IG5hbWUgPSBtdXRhdGlvbnNbaV0uYXR0cmlidXRlTmFtZTtcbiAgICAgIGxldCBvbGRWYWx1ZSA9IG11dGF0aW9uc1tpXS5vbGRWYWx1ZTtcbiAgICAgIGxldCBhZGQyID0gKCkgPT4ge1xuICAgICAgICBpZiAoIWFkZGVkQXR0cmlidXRlcy5oYXMoZWwpKVxuICAgICAgICAgIGFkZGVkQXR0cmlidXRlcy5zZXQoZWwsIFtdKTtcbiAgICAgICAgYWRkZWRBdHRyaWJ1dGVzLmdldChlbCkucHVzaCh7IG5hbWUsIHZhbHVlOiBlbC5nZXRBdHRyaWJ1dGUobmFtZSkgfSk7XG4gICAgICB9O1xuICAgICAgbGV0IHJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFyZW1vdmVkQXR0cmlidXRlcy5oYXMoZWwpKVxuICAgICAgICAgIHJlbW92ZWRBdHRyaWJ1dGVzLnNldChlbCwgW10pO1xuICAgICAgICByZW1vdmVkQXR0cmlidXRlcy5nZXQoZWwpLnB1c2gobmFtZSk7XG4gICAgICB9O1xuICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZShuYW1lKSAmJiBvbGRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICBhZGQyKCk7XG4gICAgICB9IGVsc2UgaWYgKGVsLmhhc0F0dHJpYnV0ZShuYW1lKSkge1xuICAgICAgICByZW1vdmUoKTtcbiAgICAgICAgYWRkMigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJlbW92ZWRBdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJzLCBlbCkgPT4ge1xuICAgIGNsZWFudXBBdHRyaWJ1dGVzKGVsLCBhdHRycyk7XG4gIH0pO1xuICBhZGRlZEF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cnMsIGVsKSA9PiB7XG4gICAgb25BdHRyaWJ1dGVBZGRlZHMuZm9yRWFjaCgoaSkgPT4gaShlbCwgYXR0cnMpKTtcbiAgfSk7XG4gIGZvciAobGV0IG5vZGUgb2YgcmVtb3ZlZE5vZGVzKSB7XG4gICAgaWYgKGFkZGVkTm9kZXMuc29tZSgoaSkgPT4gaS5jb250YWlucyhub2RlKSkpXG4gICAgICBjb250aW51ZTtcbiAgICBvbkVsUmVtb3ZlZHMuZm9yRWFjaCgoaSkgPT4gaShub2RlKSk7XG4gIH1cbiAgZm9yIChsZXQgbm9kZSBvZiBhZGRlZE5vZGVzKSB7XG4gICAgaWYgKCFub2RlLmlzQ29ubmVjdGVkKVxuICAgICAgY29udGludWU7XG4gICAgb25FbEFkZGVkcy5mb3JFYWNoKChpKSA9PiBpKG5vZGUpKTtcbiAgfVxuICBhZGRlZE5vZGVzID0gbnVsbDtcbiAgcmVtb3ZlZE5vZGVzID0gbnVsbDtcbiAgYWRkZWRBdHRyaWJ1dGVzID0gbnVsbDtcbiAgcmVtb3ZlZEF0dHJpYnV0ZXMgPSBudWxsO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvc2NvcGUuanNcbmZ1bmN0aW9uIHNjb3BlKG5vZGUpIHtcbiAgcmV0dXJuIG1lcmdlUHJveGllcyhjbG9zZXN0RGF0YVN0YWNrKG5vZGUpKTtcbn1cbmZ1bmN0aW9uIGFkZFNjb3BlVG9Ob2RlKG5vZGUsIGRhdGEyLCByZWZlcmVuY2VOb2RlKSB7XG4gIG5vZGUuX3hfZGF0YVN0YWNrID0gW2RhdGEyLCAuLi5jbG9zZXN0RGF0YVN0YWNrKHJlZmVyZW5jZU5vZGUgfHwgbm9kZSldO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIG5vZGUuX3hfZGF0YVN0YWNrID0gbm9kZS5feF9kYXRhU3RhY2suZmlsdGVyKChpKSA9PiBpICE9PSBkYXRhMik7XG4gIH07XG59XG5mdW5jdGlvbiBjbG9zZXN0RGF0YVN0YWNrKG5vZGUpIHtcbiAgaWYgKG5vZGUuX3hfZGF0YVN0YWNrKVxuICAgIHJldHVybiBub2RlLl94X2RhdGFTdGFjaztcbiAgaWYgKHR5cGVvZiBTaGFkb3dSb290ID09PSBcImZ1bmN0aW9uXCIgJiYgbm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHtcbiAgICByZXR1cm4gY2xvc2VzdERhdGFTdGFjayhub2RlLmhvc3QpO1xuICB9XG4gIGlmICghbm9kZS5wYXJlbnROb2RlKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiBjbG9zZXN0RGF0YVN0YWNrKG5vZGUucGFyZW50Tm9kZSk7XG59XG5mdW5jdGlvbiBtZXJnZVByb3hpZXMob2JqZWN0cykge1xuICByZXR1cm4gbmV3IFByb3h5KHsgb2JqZWN0cyB9LCBtZXJnZVByb3h5VHJhcCk7XG59XG52YXIgbWVyZ2VQcm94eVRyYXAgPSB7XG4gIG93bktleXMoeyBvYmplY3RzIH0pIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgIG5ldyBTZXQob2JqZWN0cy5mbGF0TWFwKChpKSA9PiBPYmplY3Qua2V5cyhpKSkpXG4gICAgKTtcbiAgfSxcbiAgaGFzKHsgb2JqZWN0cyB9LCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT0gU3ltYm9sLnVuc2NvcGFibGVzKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBvYmplY3RzLnNvbWUoXG4gICAgICAob2JqKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBuYW1lKSB8fCBSZWZsZWN0LmhhcyhvYmosIG5hbWUpXG4gICAgKTtcbiAgfSxcbiAgZ2V0KHsgb2JqZWN0cyB9LCBuYW1lLCB0aGlzUHJveHkpIHtcbiAgICBpZiAobmFtZSA9PSBcInRvSlNPTlwiKVxuICAgICAgcmV0dXJuIGNvbGxhcHNlUHJveGllcztcbiAgICByZXR1cm4gUmVmbGVjdC5nZXQoXG4gICAgICBvYmplY3RzLmZpbmQoXG4gICAgICAgIChvYmopID0+IFJlZmxlY3QuaGFzKG9iaiwgbmFtZSlcbiAgICAgICkgfHwge30sXG4gICAgICBuYW1lLFxuICAgICAgdGhpc1Byb3h5XG4gICAgKTtcbiAgfSxcbiAgc2V0KHsgb2JqZWN0cyB9LCBuYW1lLCB2YWx1ZSwgdGhpc1Byb3h5KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gb2JqZWN0cy5maW5kKFxuICAgICAgKG9iaikgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgbmFtZSlcbiAgICApIHx8IG9iamVjdHNbb2JqZWN0cy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yPy5zZXQgJiYgZGVzY3JpcHRvcj8uZ2V0KVxuICAgICAgcmV0dXJuIGRlc2NyaXB0b3Iuc2V0LmNhbGwodGhpc1Byb3h5LCB2YWx1ZSkgfHwgdHJ1ZTtcbiAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG4gIH1cbn07XG5mdW5jdGlvbiBjb2xsYXBzZVByb3hpZXMoKSB7XG4gIGxldCBrZXlzID0gUmVmbGVjdC5vd25LZXlzKHRoaXMpO1xuICByZXR1cm4ga2V5cy5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgYWNjW2tleV0gPSBSZWZsZWN0LmdldCh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2ludGVyY2VwdG9yLmpzXG5mdW5jdGlvbiBpbml0SW50ZXJjZXB0b3JzKGRhdGEyKSB7XG4gIGxldCBpc09iamVjdDIgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbCkgJiYgdmFsICE9PSBudWxsO1xuICBsZXQgcmVjdXJzZSA9IChvYmosIGJhc2VQYXRoID0gXCJcIikgPT4ge1xuICAgIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iaikpLmZvckVhY2goKFtrZXksIHsgdmFsdWUsIGVudW1lcmFibGUgfV0pID0+IHtcbiAgICAgIGlmIChlbnVtZXJhYmxlID09PSBmYWxzZSB8fCB2YWx1ZSA9PT0gdm9pZCAwKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLl9fdl9za2lwKVxuICAgICAgICByZXR1cm47XG4gICAgICBsZXQgcGF0aCA9IGJhc2VQYXRoID09PSBcIlwiID8ga2V5IDogYCR7YmFzZVBhdGh9LiR7a2V5fWA7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLl94X2ludGVyY2VwdG9yKSB7XG4gICAgICAgIG9ialtrZXldID0gdmFsdWUuaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc09iamVjdDIodmFsdWUpICYmIHZhbHVlICE9PSBvYmogJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG4gICAgICAgICAgcmVjdXJzZSh2YWx1ZSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIHJlY3Vyc2UoZGF0YTIpO1xufVxuZnVuY3Rpb24gaW50ZXJjZXB0b3IoY2FsbGJhY2ssIG11dGF0ZU9iaiA9ICgpID0+IHtcbn0pIHtcbiAgbGV0IG9iaiA9IHtcbiAgICBpbml0aWFsVmFsdWU6IHZvaWQgMCxcbiAgICBfeF9pbnRlcmNlcHRvcjogdHJ1ZSxcbiAgICBpbml0aWFsaXplKGRhdGEyLCBwYXRoLCBrZXkpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayh0aGlzLmluaXRpYWxWYWx1ZSwgKCkgPT4gZ2V0KGRhdGEyLCBwYXRoKSwgKHZhbHVlKSA9PiBzZXQoZGF0YTIsIHBhdGgsIHZhbHVlKSwgcGF0aCwga2V5KTtcbiAgICB9XG4gIH07XG4gIG11dGF0ZU9iaihvYmopO1xuICByZXR1cm4gKGluaXRpYWxWYWx1ZSkgPT4ge1xuICAgIGlmICh0eXBlb2YgaW5pdGlhbFZhbHVlID09PSBcIm9iamVjdFwiICYmIGluaXRpYWxWYWx1ZSAhPT0gbnVsbCAmJiBpbml0aWFsVmFsdWUuX3hfaW50ZXJjZXB0b3IpIHtcbiAgICAgIGxldCBpbml0aWFsaXplID0gb2JqLmluaXRpYWxpemUuYmluZChvYmopO1xuICAgICAgb2JqLmluaXRpYWxpemUgPSAoZGF0YTIsIHBhdGgsIGtleSkgPT4ge1xuICAgICAgICBsZXQgaW5uZXJWYWx1ZSA9IGluaXRpYWxWYWx1ZS5pbml0aWFsaXplKGRhdGEyLCBwYXRoLCBrZXkpO1xuICAgICAgICBvYmouaW5pdGlhbFZhbHVlID0gaW5uZXJWYWx1ZTtcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemUoZGF0YTIsIHBhdGgsIGtleSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmouaW5pdGlhbFZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xufVxuZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCkge1xuICByZXR1cm4gcGF0aC5zcGxpdChcIi5cIikucmVkdWNlKChjYXJyeSwgc2VnbWVudCkgPT4gY2Fycnlbc2VnbWVudF0sIG9iaik7XG59XG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIpXG4gICAgcGF0aCA9IHBhdGguc3BsaXQoXCIuXCIpO1xuICBpZiAocGF0aC5sZW5ndGggPT09IDEpXG4gICAgb2JqW3BhdGhbMF1dID0gdmFsdWU7XG4gIGVsc2UgaWYgKHBhdGgubGVuZ3RoID09PSAwKVxuICAgIHRocm93IGVycm9yO1xuICBlbHNlIHtcbiAgICBpZiAob2JqW3BhdGhbMF1dKVxuICAgICAgcmV0dXJuIHNldChvYmpbcGF0aFswXV0sIHBhdGguc2xpY2UoMSksIHZhbHVlKTtcbiAgICBlbHNlIHtcbiAgICAgIG9ialtwYXRoWzBdXSA9IHt9O1xuICAgICAgcmV0dXJuIHNldChvYmpbcGF0aFswXV0sIHBhdGguc2xpY2UoMSksIHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy5qc1xudmFyIG1hZ2ljcyA9IHt9O1xuZnVuY3Rpb24gbWFnaWMobmFtZSwgY2FsbGJhY2spIHtcbiAgbWFnaWNzW25hbWVdID0gY2FsbGJhY2s7XG59XG5mdW5jdGlvbiBpbmplY3RNYWdpY3Mob2JqLCBlbCkge1xuICBsZXQgbWVtb2l6ZWRVdGlsaXRpZXMgPSBnZXRVdGlsaXRpZXMoZWwpO1xuICBPYmplY3QuZW50cmllcyhtYWdpY3MpLmZvckVhY2goKFtuYW1lLCBjYWxsYmFja10pID0+IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBgJCR7bmFtZX1gLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlbCwgbWVtb2l6ZWRVdGlsaXRpZXMpO1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuZnVuY3Rpb24gZ2V0VXRpbGl0aWVzKGVsKSB7XG4gIGxldCBbdXRpbGl0aWVzLCBjbGVhbnVwMl0gPSBnZXRFbGVtZW50Qm91bmRVdGlsaXRpZXMoZWwpO1xuICBsZXQgdXRpbHMgPSB7IGludGVyY2VwdG9yLCAuLi51dGlsaXRpZXMgfTtcbiAgb25FbFJlbW92ZWQoZWwsIGNsZWFudXAyKTtcbiAgcmV0dXJuIHV0aWxzO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvZXJyb3IuanNcbmZ1bmN0aW9uIHRyeUNhdGNoKGVsLCBleHByZXNzaW9uLCBjYWxsYmFjaywgLi4uYXJncykge1xuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjayguLi5hcmdzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGhhbmRsZUVycm9yKGUsIGVsLCBleHByZXNzaW9uKTtcbiAgfVxufVxuZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbiA9IHZvaWQgMCkge1xuICBlcnJvcjIgPSBPYmplY3QuYXNzaWduKFxuICAgIGVycm9yMiA/PyB7IG1lc3NhZ2U6IFwiTm8gZXJyb3IgbWVzc2FnZSBnaXZlbi5cIiB9LFxuICAgIHsgZWwsIGV4cHJlc3Npb24gfVxuICApO1xuICBjb25zb2xlLndhcm4oYEFscGluZSBFeHByZXNzaW9uIEVycm9yOiAke2Vycm9yMi5tZXNzYWdlfVxuXG4ke2V4cHJlc3Npb24gPyAnRXhwcmVzc2lvbjogXCInICsgZXhwcmVzc2lvbiArICdcIlxcblxcbicgOiBcIlwifWAsIGVsKTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgdGhyb3cgZXJyb3IyO1xuICB9LCAwKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2V2YWx1YXRvci5qc1xudmFyIHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyA9IHRydWU7XG5mdW5jdGlvbiBkb250QXV0b0V2YWx1YXRlRnVuY3Rpb25zKGNhbGxiYWNrKSB7XG4gIGxldCBjYWNoZSA9IHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucztcbiAgc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zID0gZmFsc2U7XG4gIGxldCByZXN1bHQgPSBjYWxsYmFjaygpO1xuICBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgPSBjYWNoZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGV2YWx1YXRlKGVsLCBleHByZXNzaW9uLCBleHRyYXMgPSB7fSkge1xuICBsZXQgcmVzdWx0O1xuICBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSgodmFsdWUpID0+IHJlc3VsdCA9IHZhbHVlLCBleHRyYXMpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZXZhbHVhdGVMYXRlciguLi5hcmdzKSB7XG4gIHJldHVybiB0aGVFdmFsdWF0b3JGdW5jdGlvbiguLi5hcmdzKTtcbn1cbnZhciB0aGVFdmFsdWF0b3JGdW5jdGlvbiA9IG5vcm1hbEV2YWx1YXRvcjtcbmZ1bmN0aW9uIHNldEV2YWx1YXRvcihuZXdFdmFsdWF0b3IpIHtcbiAgdGhlRXZhbHVhdG9yRnVuY3Rpb24gPSBuZXdFdmFsdWF0b3I7XG59XG5mdW5jdGlvbiBub3JtYWxFdmFsdWF0b3IoZWwsIGV4cHJlc3Npb24pIHtcbiAgbGV0IG92ZXJyaWRkZW5NYWdpY3MgPSB7fTtcbiAgaW5qZWN0TWFnaWNzKG92ZXJyaWRkZW5NYWdpY3MsIGVsKTtcbiAgbGV0IGRhdGFTdGFjayA9IFtvdmVycmlkZGVuTWFnaWNzLCAuLi5jbG9zZXN0RGF0YVN0YWNrKGVsKV07XG4gIGxldCBldmFsdWF0b3IgPSB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJmdW5jdGlvblwiID8gZ2VuZXJhdGVFdmFsdWF0b3JGcm9tRnVuY3Rpb24oZGF0YVN0YWNrLCBleHByZXNzaW9uKSA6IGdlbmVyYXRlRXZhbHVhdG9yRnJvbVN0cmluZyhkYXRhU3RhY2ssIGV4cHJlc3Npb24sIGVsKTtcbiAgcmV0dXJuIHRyeUNhdGNoLmJpbmQobnVsbCwgZWwsIGV4cHJlc3Npb24sIGV2YWx1YXRvcik7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUV2YWx1YXRvckZyb21GdW5jdGlvbihkYXRhU3RhY2ssIGZ1bmMpIHtcbiAgcmV0dXJuIChyZWNlaXZlciA9ICgpID0+IHtcbiAgfSwgeyBzY29wZTogc2NvcGUyID0ge30sIHBhcmFtcyA9IFtdIH0gPSB7fSkgPT4ge1xuICAgIGxldCByZXN1bHQgPSBmdW5jLmFwcGx5KG1lcmdlUHJveGllcyhbc2NvcGUyLCAuLi5kYXRhU3RhY2tdKSwgcGFyYW1zKTtcbiAgICBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCByZXN1bHQpO1xuICB9O1xufVxudmFyIGV2YWx1YXRvck1lbW8gPSB7fTtcbmZ1bmN0aW9uIGdlbmVyYXRlRnVuY3Rpb25Gcm9tU3RyaW5nKGV4cHJlc3Npb24sIGVsKSB7XG4gIGlmIChldmFsdWF0b3JNZW1vW2V4cHJlc3Npb25dKSB7XG4gICAgcmV0dXJuIGV2YWx1YXRvck1lbW9bZXhwcmVzc2lvbl07XG4gIH1cbiAgbGV0IEFzeW5jRnVuY3Rpb24gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYXN5bmMgZnVuY3Rpb24oKSB7XG4gIH0pLmNvbnN0cnVjdG9yO1xuICBsZXQgcmlnaHRTaWRlU2FmZUV4cHJlc3Npb24gPSAvXltcXG5cXHNdKmlmLipcXCguKlxcKS8udGVzdChleHByZXNzaW9uLnRyaW0oKSkgfHwgL14obGV0fGNvbnN0KVxccy8udGVzdChleHByZXNzaW9uLnRyaW0oKSkgPyBgKGFzeW5jKCk9PnsgJHtleHByZXNzaW9ufSB9KSgpYCA6IGV4cHJlc3Npb247XG4gIGNvbnN0IHNhZmVBc3luY0Z1bmN0aW9uID0gKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBsZXQgZnVuYzIgPSBuZXcgQXN5bmNGdW5jdGlvbihcbiAgICAgICAgW1wiX19zZWxmXCIsIFwic2NvcGVcIl0sXG4gICAgICAgIGB3aXRoIChzY29wZSkgeyBfX3NlbGYucmVzdWx0ID0gJHtyaWdodFNpZGVTYWZlRXhwcmVzc2lvbn0gfTsgX19zZWxmLmZpbmlzaGVkID0gdHJ1ZTsgcmV0dXJuIF9fc2VsZi5yZXN1bHQ7YFxuICAgICAgKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmdW5jMiwgXCJuYW1lXCIsIHtcbiAgICAgICAgdmFsdWU6IGBbQWxwaW5lXSAke2V4cHJlc3Npb259YFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZnVuYzI7XG4gICAgfSBjYXRjaCAoZXJyb3IyKSB7XG4gICAgICBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCBleHByZXNzaW9uKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gIH07XG4gIGxldCBmdW5jID0gc2FmZUFzeW5jRnVuY3Rpb24oKTtcbiAgZXZhbHVhdG9yTWVtb1tleHByZXNzaW9uXSA9IGZ1bmM7XG4gIHJldHVybiBmdW5jO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVFdmFsdWF0b3JGcm9tU3RyaW5nKGRhdGFTdGFjaywgZXhwcmVzc2lvbiwgZWwpIHtcbiAgbGV0IGZ1bmMgPSBnZW5lcmF0ZUZ1bmN0aW9uRnJvbVN0cmluZyhleHByZXNzaW9uLCBlbCk7XG4gIHJldHVybiAocmVjZWl2ZXIgPSAoKSA9PiB7XG4gIH0sIHsgc2NvcGU6IHNjb3BlMiA9IHt9LCBwYXJhbXMgPSBbXSB9ID0ge30pID0+IHtcbiAgICBmdW5jLnJlc3VsdCA9IHZvaWQgMDtcbiAgICBmdW5jLmZpbmlzaGVkID0gZmFsc2U7XG4gICAgbGV0IGNvbXBsZXRlU2NvcGUgPSBtZXJnZVByb3hpZXMoW3Njb3BlMiwgLi4uZGF0YVN0YWNrXSk7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGxldCBwcm9taXNlID0gZnVuYyhmdW5jLCBjb21wbGV0ZVNjb3BlKS5jYXRjaCgoZXJyb3IyKSA9PiBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCBleHByZXNzaW9uKSk7XG4gICAgICBpZiAoZnVuYy5maW5pc2hlZCkge1xuICAgICAgICBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCBmdW5jLnJlc3VsdCwgY29tcGxldGVTY29wZSwgcGFyYW1zLCBlbCk7XG4gICAgICAgIGZ1bmMucmVzdWx0ID0gdm9pZCAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCByZXN1bHQsIGNvbXBsZXRlU2NvcGUsIHBhcmFtcywgZWwpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IyKSA9PiBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCBleHByZXNzaW9uKSkuZmluYWxseSgoKSA9PiBmdW5jLnJlc3VsdCA9IHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgdmFsdWUsIHNjb3BlMiwgcGFyYW1zLCBlbCkge1xuICBpZiAoc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlLmFwcGx5KHNjb3BlMiwgcGFyYW1zKTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgcmVzdWx0LnRoZW4oKGkpID0+IHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIGksIHNjb3BlMiwgcGFyYW1zKSkuY2F0Y2goKGVycm9yMikgPT4gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgdmFsdWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjZWl2ZXIocmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgIHZhbHVlLnRoZW4oKGkpID0+IHJlY2VpdmVyKGkpKTtcbiAgfSBlbHNlIHtcbiAgICByZWNlaXZlcih2YWx1ZSk7XG4gIH1cbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMuanNcbnZhciBwcmVmaXhBc1N0cmluZyA9IFwieC1cIjtcbmZ1bmN0aW9uIHByZWZpeChzdWJqZWN0ID0gXCJcIikge1xuICByZXR1cm4gcHJlZml4QXNTdHJpbmcgKyBzdWJqZWN0O1xufVxuZnVuY3Rpb24gc2V0UHJlZml4KG5ld1ByZWZpeCkge1xuICBwcmVmaXhBc1N0cmluZyA9IG5ld1ByZWZpeDtcbn1cbnZhciBkaXJlY3RpdmVIYW5kbGVycyA9IHt9O1xuZnVuY3Rpb24gZGlyZWN0aXZlKG5hbWUsIGNhbGxiYWNrKSB7XG4gIGRpcmVjdGl2ZUhhbmRsZXJzW25hbWVdID0gY2FsbGJhY2s7XG4gIHJldHVybiB7XG4gICAgYmVmb3JlKGRpcmVjdGl2ZTIpIHtcbiAgICAgIGlmICghZGlyZWN0aXZlSGFuZGxlcnNbZGlyZWN0aXZlMl0pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFN0cmluZy5yYXdgQ2Fubm90IGZpbmQgZGlyZWN0aXZlIFxcYCR7ZGlyZWN0aXZlMn1cXGAuIFxcYCR7bmFtZX1cXGAgd2lsbCB1c2UgdGhlIGRlZmF1bHQgb3JkZXIgb2YgZXhlY3V0aW9uYCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvcyA9IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoZGlyZWN0aXZlMik7XG4gICAgICBkaXJlY3RpdmVPcmRlci5zcGxpY2UocG9zID49IDAgPyBwb3MgOiBkaXJlY3RpdmVPcmRlci5pbmRleE9mKFwiREVGQVVMVFwiKSwgMCwgbmFtZSk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gZGlyZWN0aXZlRXhpc3RzKG5hbWUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGRpcmVjdGl2ZUhhbmRsZXJzKS5pbmNsdWRlcyhuYW1lKTtcbn1cbmZ1bmN0aW9uIGRpcmVjdGl2ZXMoZWwsIGF0dHJpYnV0ZXMsIG9yaWdpbmFsQXR0cmlidXRlT3ZlcnJpZGUpIHtcbiAgYXR0cmlidXRlcyA9IEFycmF5LmZyb20oYXR0cmlidXRlcyk7XG4gIGlmIChlbC5feF92aXJ0dWFsRGlyZWN0aXZlcykge1xuICAgIGxldCB2QXR0cmlidXRlcyA9IE9iamVjdC5lbnRyaWVzKGVsLl94X3ZpcnR1YWxEaXJlY3RpdmVzKS5tYXAoKFtuYW1lLCB2YWx1ZV0pID0+ICh7IG5hbWUsIHZhbHVlIH0pKTtcbiAgICBsZXQgc3RhdGljQXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNPbmx5KHZBdHRyaWJ1dGVzKTtcbiAgICB2QXR0cmlidXRlcyA9IHZBdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICBpZiAoc3RhdGljQXR0cmlidXRlcy5maW5kKChhdHRyKSA9PiBhdHRyLm5hbWUgPT09IGF0dHJpYnV0ZS5uYW1lKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGB4LWJpbmQ6JHthdHRyaWJ1dGUubmFtZX1gLFxuICAgICAgICAgIHZhbHVlOiBgXCIke2F0dHJpYnV0ZS52YWx1ZX1cImBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhdHRyaWJ1dGU7XG4gICAgfSk7XG4gICAgYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMuY29uY2F0KHZBdHRyaWJ1dGVzKTtcbiAgfVxuICBsZXQgdHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXAgPSB7fTtcbiAgbGV0IGRpcmVjdGl2ZXMyID0gYXR0cmlidXRlcy5tYXAodG9UcmFuc2Zvcm1lZEF0dHJpYnV0ZXMoKG5ld05hbWUsIG9sZE5hbWUpID0+IHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwW25ld05hbWVdID0gb2xkTmFtZSkpLmZpbHRlcihvdXROb25BbHBpbmVBdHRyaWJ1dGVzKS5tYXAodG9QYXJzZWREaXJlY3RpdmVzKHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwLCBvcmlnaW5hbEF0dHJpYnV0ZU92ZXJyaWRlKSkuc29ydChieVByaW9yaXR5KTtcbiAgcmV0dXJuIGRpcmVjdGl2ZXMyLm1hcCgoZGlyZWN0aXZlMikgPT4ge1xuICAgIHJldHVybiBnZXREaXJlY3RpdmVIYW5kbGVyKGVsLCBkaXJlY3RpdmUyKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBhdHRyaWJ1dGVzT25seShhdHRyaWJ1dGVzKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKGF0dHJpYnV0ZXMpLm1hcCh0b1RyYW5zZm9ybWVkQXR0cmlidXRlcygpKS5maWx0ZXIoKGF0dHIpID0+ICFvdXROb25BbHBpbmVBdHRyaWJ1dGVzKGF0dHIpKTtcbn1cbnZhciBpc0RlZmVycmluZ0hhbmRsZXJzID0gZmFsc2U7XG52YXIgZGlyZWN0aXZlSGFuZGxlclN0YWNrcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG52YXIgY3VycmVudEhhbmRsZXJTdGFja0tleSA9IFN5bWJvbCgpO1xuZnVuY3Rpb24gZGVmZXJIYW5kbGluZ0RpcmVjdGl2ZXMoY2FsbGJhY2spIHtcbiAgaXNEZWZlcnJpbmdIYW5kbGVycyA9IHRydWU7XG4gIGxldCBrZXkgPSBTeW1ib2woKTtcbiAgY3VycmVudEhhbmRsZXJTdGFja0tleSA9IGtleTtcbiAgZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5zZXQoa2V5LCBbXSk7XG4gIGxldCBmbHVzaEhhbmRsZXJzID0gKCkgPT4ge1xuICAgIHdoaWxlIChkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLmdldChrZXkpLmxlbmd0aClcbiAgICAgIGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MuZ2V0KGtleSkuc2hpZnQoKSgpO1xuICAgIGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MuZGVsZXRlKGtleSk7XG4gIH07XG4gIGxldCBzdG9wRGVmZXJyaW5nID0gKCkgPT4ge1xuICAgIGlzRGVmZXJyaW5nSGFuZGxlcnMgPSBmYWxzZTtcbiAgICBmbHVzaEhhbmRsZXJzKCk7XG4gIH07XG4gIGNhbGxiYWNrKGZsdXNoSGFuZGxlcnMpO1xuICBzdG9wRGVmZXJyaW5nKCk7XG59XG5mdW5jdGlvbiBnZXRFbGVtZW50Qm91bmRVdGlsaXRpZXMoZWwpIHtcbiAgbGV0IGNsZWFudXBzID0gW107XG4gIGxldCBjbGVhbnVwMiA9IChjYWxsYmFjaykgPT4gY2xlYW51cHMucHVzaChjYWxsYmFjayk7XG4gIGxldCBbZWZmZWN0MywgY2xlYW51cEVmZmVjdF0gPSBlbGVtZW50Qm91bmRFZmZlY3QoZWwpO1xuICBjbGVhbnVwcy5wdXNoKGNsZWFudXBFZmZlY3QpO1xuICBsZXQgdXRpbGl0aWVzID0ge1xuICAgIEFscGluZTogYWxwaW5lX2RlZmF1bHQsXG4gICAgZWZmZWN0OiBlZmZlY3QzLFxuICAgIGNsZWFudXA6IGNsZWFudXAyLFxuICAgIGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIuYmluZChldmFsdWF0ZUxhdGVyLCBlbCksXG4gICAgZXZhbHVhdGU6IGV2YWx1YXRlLmJpbmQoZXZhbHVhdGUsIGVsKVxuICB9O1xuICBsZXQgZG9DbGVhbnVwID0gKCkgPT4gY2xlYW51cHMuZm9yRWFjaCgoaSkgPT4gaSgpKTtcbiAgcmV0dXJuIFt1dGlsaXRpZXMsIGRvQ2xlYW51cF07XG59XG5mdW5jdGlvbiBnZXREaXJlY3RpdmVIYW5kbGVyKGVsLCBkaXJlY3RpdmUyKSB7XG4gIGxldCBub29wID0gKCkgPT4ge1xuICB9O1xuICBsZXQgaGFuZGxlcjQgPSBkaXJlY3RpdmVIYW5kbGVyc1tkaXJlY3RpdmUyLnR5cGVdIHx8IG5vb3A7XG4gIGxldCBbdXRpbGl0aWVzLCBjbGVhbnVwMl0gPSBnZXRFbGVtZW50Qm91bmRVdGlsaXRpZXMoZWwpO1xuICBvbkF0dHJpYnV0ZVJlbW92ZWQoZWwsIGRpcmVjdGl2ZTIub3JpZ2luYWwsIGNsZWFudXAyKTtcbiAgbGV0IGZ1bGxIYW5kbGVyID0gKCkgPT4ge1xuICAgIGlmIChlbC5feF9pZ25vcmUgfHwgZWwuX3hfaWdub3JlU2VsZilcbiAgICAgIHJldHVybjtcbiAgICBoYW5kbGVyNC5pbmxpbmUgJiYgaGFuZGxlcjQuaW5saW5lKGVsLCBkaXJlY3RpdmUyLCB1dGlsaXRpZXMpO1xuICAgIGhhbmRsZXI0ID0gaGFuZGxlcjQuYmluZChoYW5kbGVyNCwgZWwsIGRpcmVjdGl2ZTIsIHV0aWxpdGllcyk7XG4gICAgaXNEZWZlcnJpbmdIYW5kbGVycyA/IGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MuZ2V0KGN1cnJlbnRIYW5kbGVyU3RhY2tLZXkpLnB1c2goaGFuZGxlcjQpIDogaGFuZGxlcjQoKTtcbiAgfTtcbiAgZnVsbEhhbmRsZXIucnVuQ2xlYW51cHMgPSBjbGVhbnVwMjtcbiAgcmV0dXJuIGZ1bGxIYW5kbGVyO1xufVxudmFyIHN0YXJ0aW5nV2l0aCA9IChzdWJqZWN0LCByZXBsYWNlbWVudCkgPT4gKHsgbmFtZSwgdmFsdWUgfSkgPT4ge1xuICBpZiAobmFtZS5zdGFydHNXaXRoKHN1YmplY3QpKVxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2Uoc3ViamVjdCwgcmVwbGFjZW1lbnQpO1xuICByZXR1cm4geyBuYW1lLCB2YWx1ZSB9O1xufTtcbnZhciBpbnRvID0gKGkpID0+IGk7XG5mdW5jdGlvbiB0b1RyYW5zZm9ybWVkQXR0cmlidXRlcyhjYWxsYmFjayA9ICgpID0+IHtcbn0pIHtcbiAgcmV0dXJuICh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgICBsZXQgeyBuYW1lOiBuZXdOYW1lLCB2YWx1ZTogbmV3VmFsdWUgfSA9IGF0dHJpYnV0ZVRyYW5zZm9ybWVycy5yZWR1Y2UoKGNhcnJ5LCB0cmFuc2Zvcm0pID0+IHtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm0oY2FycnkpO1xuICAgIH0sIHsgbmFtZSwgdmFsdWUgfSk7XG4gICAgaWYgKG5ld05hbWUgIT09IG5hbWUpXG4gICAgICBjYWxsYmFjayhuZXdOYW1lLCBuYW1lKTtcbiAgICByZXR1cm4geyBuYW1lOiBuZXdOYW1lLCB2YWx1ZTogbmV3VmFsdWUgfTtcbiAgfTtcbn1cbnZhciBhdHRyaWJ1dGVUcmFuc2Zvcm1lcnMgPSBbXTtcbmZ1bmN0aW9uIG1hcEF0dHJpYnV0ZXMoY2FsbGJhY2spIHtcbiAgYXR0cmlidXRlVHJhbnNmb3JtZXJzLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gb3V0Tm9uQWxwaW5lQXR0cmlidXRlcyh7IG5hbWUgfSkge1xuICByZXR1cm4gYWxwaW5lQXR0cmlidXRlUmVnZXgoKS50ZXN0KG5hbWUpO1xufVxudmFyIGFscGluZUF0dHJpYnV0ZVJlZ2V4ID0gKCkgPT4gbmV3IFJlZ0V4cChgXiR7cHJlZml4QXNTdHJpbmd9KFteOl4uXSspXFxcXGJgKTtcbmZ1bmN0aW9uIHRvUGFyc2VkRGlyZWN0aXZlcyh0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcCwgb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSkge1xuICByZXR1cm4gKHsgbmFtZSwgdmFsdWUgfSkgPT4ge1xuICAgIGxldCB0eXBlTWF0Y2ggPSBuYW1lLm1hdGNoKGFscGluZUF0dHJpYnV0ZVJlZ2V4KCkpO1xuICAgIGxldCB2YWx1ZU1hdGNoID0gbmFtZS5tYXRjaCgvOihbYS16QS1aMC05XFwtXzpdKykvKTtcbiAgICBsZXQgbW9kaWZpZXJzID0gbmFtZS5tYXRjaCgvXFwuW14uXFxdXSsoPz1bXlxcXV0qJCkvZykgfHwgW107XG4gICAgbGV0IG9yaWdpbmFsID0gb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSB8fCB0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcFtuYW1lXSB8fCBuYW1lO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0eXBlTWF0Y2ggPyB0eXBlTWF0Y2hbMV0gOiBudWxsLFxuICAgICAgdmFsdWU6IHZhbHVlTWF0Y2ggPyB2YWx1ZU1hdGNoWzFdIDogbnVsbCxcbiAgICAgIG1vZGlmaWVyczogbW9kaWZpZXJzLm1hcCgoaSkgPT4gaS5yZXBsYWNlKFwiLlwiLCBcIlwiKSksXG4gICAgICBleHByZXNzaW9uOiB2YWx1ZSxcbiAgICAgIG9yaWdpbmFsXG4gICAgfTtcbiAgfTtcbn1cbnZhciBERUZBVUxUID0gXCJERUZBVUxUXCI7XG52YXIgZGlyZWN0aXZlT3JkZXIgPSBbXG4gIFwiaWdub3JlXCIsXG4gIFwicmVmXCIsXG4gIFwiZGF0YVwiLFxuICBcImlkXCIsXG4gIFwiYW5jaG9yXCIsXG4gIFwiYmluZFwiLFxuICBcImluaXRcIixcbiAgXCJmb3JcIixcbiAgXCJtb2RlbFwiLFxuICBcIm1vZGVsYWJsZVwiLFxuICBcInRyYW5zaXRpb25cIixcbiAgXCJzaG93XCIsXG4gIFwiaWZcIixcbiAgREVGQVVMVCxcbiAgXCJ0ZWxlcG9ydFwiXG5dO1xuZnVuY3Rpb24gYnlQcmlvcml0eShhLCBiKSB7XG4gIGxldCB0eXBlQSA9IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoYS50eXBlKSA9PT0gLTEgPyBERUZBVUxUIDogYS50eXBlO1xuICBsZXQgdHlwZUIgPSBkaXJlY3RpdmVPcmRlci5pbmRleE9mKGIudHlwZSkgPT09IC0xID8gREVGQVVMVCA6IGIudHlwZTtcbiAgcmV0dXJuIGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YodHlwZUEpIC0gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZih0eXBlQik7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9kaXNwYXRjaC5qc1xuZnVuY3Rpb24gZGlzcGF0Y2goZWwsIG5hbWUsIGRldGFpbCA9IHt9KSB7XG4gIGVsLmRpc3BhdGNoRXZlbnQoXG4gICAgbmV3IEN1c3RvbUV2ZW50KG5hbWUsIHtcbiAgICAgIGRldGFpbCxcbiAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAvLyBBbGxvd3MgZXZlbnRzIHRvIHBhc3MgdGhlIHNoYWRvdyBET00gYmFycmllci5cbiAgICAgIGNvbXBvc2VkOiB0cnVlLFxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgIH0pXG4gICk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy93YWxrLmpzXG5mdW5jdGlvbiB3YWxrKGVsLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgPT09IFwiZnVuY3Rpb25cIiAmJiBlbCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHtcbiAgICBBcnJheS5mcm9tKGVsLmNoaWxkcmVuKS5mb3JFYWNoKChlbDIpID0+IHdhbGsoZWwyLCBjYWxsYmFjaykpO1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgc2tpcCA9IGZhbHNlO1xuICBjYWxsYmFjayhlbCwgKCkgPT4gc2tpcCA9IHRydWUpO1xuICBpZiAoc2tpcClcbiAgICByZXR1cm47XG4gIGxldCBub2RlID0gZWwuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIHdoaWxlIChub2RlKSB7XG4gICAgd2Fsayhub2RlLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIG5vZGUgPSBub2RlLm5leHRFbGVtZW50U2libGluZztcbiAgfVxufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvd2Fybi5qc1xuZnVuY3Rpb24gd2FybihtZXNzYWdlLCAuLi5hcmdzKSB7XG4gIGNvbnNvbGUud2FybihgQWxwaW5lIFdhcm5pbmc6ICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2xpZmVjeWNsZS5qc1xudmFyIHN0YXJ0ZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBpZiAoc3RhcnRlZClcbiAgICB3YXJuKFwiQWxwaW5lIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWQgb24gdGhpcyBwYWdlLiBDYWxsaW5nIEFscGluZS5zdGFydCgpIG1vcmUgdGhhbiBvbmNlIGNhbiBjYXVzZSBwcm9ibGVtcy5cIik7XG4gIHN0YXJ0ZWQgPSB0cnVlO1xuICBpZiAoIWRvY3VtZW50LmJvZHkpXG4gICAgd2FybihcIlVuYWJsZSB0byBpbml0aWFsaXplLiBUcnlpbmcgdG8gbG9hZCBBbHBpbmUgYmVmb3JlIGA8Ym9keT5gIGlzIGF2YWlsYWJsZS4gRGlkIHlvdSBmb3JnZXQgdG8gYWRkIGBkZWZlcmAgaW4gQWxwaW5lJ3MgYDxzY3JpcHQ+YCB0YWc/XCIpO1xuICBkaXNwYXRjaChkb2N1bWVudCwgXCJhbHBpbmU6aW5pdFwiKTtcbiAgZGlzcGF0Y2goZG9jdW1lbnQsIFwiYWxwaW5lOmluaXRpYWxpemluZ1wiKTtcbiAgc3RhcnRPYnNlcnZpbmdNdXRhdGlvbnMoKTtcbiAgb25FbEFkZGVkKChlbCkgPT4gaW5pdFRyZWUoZWwsIHdhbGspKTtcbiAgb25FbFJlbW92ZWQoKGVsKSA9PiBkZXN0cm95VHJlZShlbCkpO1xuICBvbkF0dHJpYnV0ZXNBZGRlZCgoZWwsIGF0dHJzKSA9PiB7XG4gICAgZGlyZWN0aXZlcyhlbCwgYXR0cnMpLmZvckVhY2goKGhhbmRsZSkgPT4gaGFuZGxlKCkpO1xuICB9KTtcbiAgbGV0IG91dE5lc3RlZENvbXBvbmVudHMgPSAoZWwpID0+ICFjbG9zZXN0Um9vdChlbC5wYXJlbnRFbGVtZW50LCB0cnVlKTtcbiAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFsbFNlbGVjdG9ycygpLmpvaW4oXCIsXCIpKSkuZmlsdGVyKG91dE5lc3RlZENvbXBvbmVudHMpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgaW5pdFRyZWUoZWwpO1xuICB9KTtcbiAgZGlzcGF0Y2goZG9jdW1lbnQsIFwiYWxwaW5lOmluaXRpYWxpemVkXCIpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICB3YXJuQWJvdXRNaXNzaW5nUGx1Z2lucygpO1xuICB9KTtcbn1cbnZhciByb290U2VsZWN0b3JDYWxsYmFja3MgPSBbXTtcbnZhciBpbml0U2VsZWN0b3JDYWxsYmFja3MgPSBbXTtcbmZ1bmN0aW9uIHJvb3RTZWxlY3RvcnMoKSB7XG4gIHJldHVybiByb290U2VsZWN0b3JDYWxsYmFja3MubWFwKChmbikgPT4gZm4oKSk7XG59XG5mdW5jdGlvbiBhbGxTZWxlY3RvcnMoKSB7XG4gIHJldHVybiByb290U2VsZWN0b3JDYWxsYmFja3MuY29uY2F0KGluaXRTZWxlY3RvckNhbGxiYWNrcykubWFwKChmbikgPT4gZm4oKSk7XG59XG5mdW5jdGlvbiBhZGRSb290U2VsZWN0b3Ioc2VsZWN0b3JDYWxsYmFjaykge1xuICByb290U2VsZWN0b3JDYWxsYmFja3MucHVzaChzZWxlY3RvckNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGFkZEluaXRTZWxlY3RvcihzZWxlY3RvckNhbGxiYWNrKSB7XG4gIGluaXRTZWxlY3RvckNhbGxiYWNrcy5wdXNoKHNlbGVjdG9yQ2FsbGJhY2spO1xufVxuZnVuY3Rpb24gY2xvc2VzdFJvb3QoZWwsIGluY2x1ZGVJbml0U2VsZWN0b3JzID0gZmFsc2UpIHtcbiAgcmV0dXJuIGZpbmRDbG9zZXN0KGVsLCAoZWxlbWVudCkgPT4ge1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IGluY2x1ZGVJbml0U2VsZWN0b3JzID8gYWxsU2VsZWN0b3JzKCkgOiByb290U2VsZWN0b3JzKCk7XG4gICAgaWYgKHNlbGVjdG9ycy5zb21lKChzZWxlY3RvcikgPT4gZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5mdW5jdGlvbiBmaW5kQ2xvc2VzdChlbCwgY2FsbGJhY2spIHtcbiAgaWYgKCFlbClcbiAgICByZXR1cm47XG4gIGlmIChjYWxsYmFjayhlbCkpXG4gICAgcmV0dXJuIGVsO1xuICBpZiAoZWwuX3hfdGVsZXBvcnRCYWNrKVxuICAgIGVsID0gZWwuX3hfdGVsZXBvcnRCYWNrO1xuICBpZiAoIWVsLnBhcmVudEVsZW1lbnQpXG4gICAgcmV0dXJuO1xuICByZXR1cm4gZmluZENsb3Nlc3QoZWwucGFyZW50RWxlbWVudCwgY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gaXNSb290KGVsKSB7XG4gIHJldHVybiByb290U2VsZWN0b3JzKCkuc29tZSgoc2VsZWN0b3IpID0+IGVsLm1hdGNoZXMoc2VsZWN0b3IpKTtcbn1cbnZhciBpbml0SW50ZXJjZXB0b3JzMiA9IFtdO1xuZnVuY3Rpb24gaW50ZXJjZXB0SW5pdChjYWxsYmFjaykge1xuICBpbml0SW50ZXJjZXB0b3JzMi5wdXNoKGNhbGxiYWNrKTtcbn1cbnZhciBtYXJrZXJEaXNwZW5zZXIgPSAxO1xuZnVuY3Rpb24gaW5pdFRyZWUoZWwsIHdhbGtlciA9IHdhbGssIGludGVyY2VwdCA9ICgpID0+IHtcbn0pIHtcbiAgaWYgKGZpbmRDbG9zZXN0KGVsLCAoaSkgPT4gaS5feF9pZ25vcmUpKVxuICAgIHJldHVybjtcbiAgZGVmZXJIYW5kbGluZ0RpcmVjdGl2ZXMoKCkgPT4ge1xuICAgIHdhbGtlcihlbCwgKGVsMiwgc2tpcCkgPT4ge1xuICAgICAgaWYgKGVsMi5feF9tYXJrZXIpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGludGVyY2VwdChlbDIsIHNraXApO1xuICAgICAgaW5pdEludGVyY2VwdG9yczIuZm9yRWFjaCgoaSkgPT4gaShlbDIsIHNraXApKTtcbiAgICAgIGRpcmVjdGl2ZXMoZWwyLCBlbDIuYXR0cmlidXRlcykuZm9yRWFjaCgoaGFuZGxlKSA9PiBoYW5kbGUoKSk7XG4gICAgICBpZiAoIWVsMi5feF9pZ25vcmUpXG4gICAgICAgIGVsMi5feF9tYXJrZXIgPSBtYXJrZXJEaXNwZW5zZXIrKztcbiAgICAgIGVsMi5feF9pZ25vcmUgJiYgc2tpcCgpO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lUcmVlKHJvb3QsIHdhbGtlciA9IHdhbGspIHtcbiAgd2Fsa2VyKHJvb3QsIChlbCkgPT4ge1xuICAgIGNsZWFudXBFbGVtZW50KGVsKTtcbiAgICBjbGVhbnVwQXR0cmlidXRlcyhlbCk7XG4gICAgZGVsZXRlIGVsLl94X21hcmtlcjtcbiAgfSk7XG59XG5mdW5jdGlvbiB3YXJuQWJvdXRNaXNzaW5nUGx1Z2lucygpIHtcbiAgbGV0IHBsdWdpbkRpcmVjdGl2ZXMgPSBbXG4gICAgW1widWlcIiwgXCJkaWFsb2dcIiwgW1wiW3gtZGlhbG9nXSwgW3gtcG9wb3Zlcl1cIl1dLFxuICAgIFtcImFuY2hvclwiLCBcImFuY2hvclwiLCBbXCJbeC1hbmNob3JdXCJdXSxcbiAgICBbXCJzb3J0XCIsIFwic29ydFwiLCBbXCJbeC1zb3J0XVwiXV1cbiAgXTtcbiAgcGx1Z2luRGlyZWN0aXZlcy5mb3JFYWNoKChbcGx1Z2luMiwgZGlyZWN0aXZlMiwgc2VsZWN0b3JzXSkgPT4ge1xuICAgIGlmIChkaXJlY3RpdmVFeGlzdHMoZGlyZWN0aXZlMikpXG4gICAgICByZXR1cm47XG4gICAgc2VsZWN0b3JzLnNvbWUoKHNlbGVjdG9yKSA9PiB7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpIHtcbiAgICAgICAgd2FybihgZm91bmQgXCIke3NlbGVjdG9yfVwiLCBidXQgbWlzc2luZyAke3BsdWdpbjJ9IHBsdWdpbmApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9uZXh0VGljay5qc1xudmFyIHRpY2tTdGFjayA9IFtdO1xudmFyIGlzSG9sZGluZyA9IGZhbHNlO1xuZnVuY3Rpb24gbmV4dFRpY2soY2FsbGJhY2sgPSAoKSA9PiB7XG59KSB7XG4gIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICBpc0hvbGRpbmcgfHwgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZWxlYXNlTmV4dFRpY2tzKCk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlcykgPT4ge1xuICAgIHRpY2tTdGFjay5wdXNoKCgpID0+IHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgICByZXMoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5mdW5jdGlvbiByZWxlYXNlTmV4dFRpY2tzKCkge1xuICBpc0hvbGRpbmcgPSBmYWxzZTtcbiAgd2hpbGUgKHRpY2tTdGFjay5sZW5ndGgpXG4gICAgdGlja1N0YWNrLnNoaWZ0KCkoKTtcbn1cbmZ1bmN0aW9uIGhvbGROZXh0VGlja3MoKSB7XG4gIGlzSG9sZGluZyA9IHRydWU7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9jbGFzc2VzLmpzXG5mdW5jdGlvbiBzZXRDbGFzc2VzKGVsLCB2YWx1ZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc2V0Q2xhc3Nlc0Zyb21TdHJpbmcoZWwsIHZhbHVlLmpvaW4oXCIgXCIpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICByZXR1cm4gc2V0Q2xhc3Nlc0Zyb21PYmplY3QoZWwsIHZhbHVlKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBzZXRDbGFzc2VzKGVsLCB2YWx1ZSgpKTtcbiAgfVxuICByZXR1cm4gc2V0Q2xhc3Nlc0Zyb21TdHJpbmcoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNldENsYXNzZXNGcm9tU3RyaW5nKGVsLCBjbGFzc1N0cmluZykge1xuICBsZXQgc3BsaXQgPSAoY2xhc3NTdHJpbmcyKSA9PiBjbGFzc1N0cmluZzIuc3BsaXQoXCIgXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IG1pc3NpbmdDbGFzc2VzID0gKGNsYXNzU3RyaW5nMikgPT4gY2xhc3NTdHJpbmcyLnNwbGl0KFwiIFwiKS5maWx0ZXIoKGkpID0+ICFlbC5jbGFzc0xpc3QuY29udGFpbnMoaSkpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGFkZENsYXNzZXNBbmRSZXR1cm5VbmRvID0gKGNsYXNzZXMpID0+IHtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMpO1xuICAgIH07XG4gIH07XG4gIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgPT09IHRydWUgPyBjbGFzc1N0cmluZyA9IFwiXCIgOiBjbGFzc1N0cmluZyB8fCBcIlwiO1xuICByZXR1cm4gYWRkQ2xhc3Nlc0FuZFJldHVyblVuZG8obWlzc2luZ0NsYXNzZXMoY2xhc3NTdHJpbmcpKTtcbn1cbmZ1bmN0aW9uIHNldENsYXNzZXNGcm9tT2JqZWN0KGVsLCBjbGFzc09iamVjdCkge1xuICBsZXQgc3BsaXQgPSAoY2xhc3NTdHJpbmcpID0+IGNsYXNzU3RyaW5nLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBmb3JBZGQgPSBPYmplY3QuZW50cmllcyhjbGFzc09iamVjdCkuZmxhdE1hcCgoW2NsYXNzU3RyaW5nLCBib29sXSkgPT4gYm9vbCA/IHNwbGl0KGNsYXNzU3RyaW5nKSA6IGZhbHNlKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBmb3JSZW1vdmUgPSBPYmplY3QuZW50cmllcyhjbGFzc09iamVjdCkuZmxhdE1hcCgoW2NsYXNzU3RyaW5nLCBib29sXSkgPT4gIWJvb2wgPyBzcGxpdChjbGFzc1N0cmluZykgOiBmYWxzZSkuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgYWRkZWQgPSBbXTtcbiAgbGV0IHJlbW92ZWQgPSBbXTtcbiAgZm9yUmVtb3ZlLmZvckVhY2goKGkpID0+IHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGkpKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGkpO1xuICAgICAgcmVtb3ZlZC5wdXNoKGkpO1xuICAgIH1cbiAgfSk7XG4gIGZvckFkZC5mb3JFYWNoKChpKSA9PiB7XG4gICAgaWYgKCFlbC5jbGFzc0xpc3QuY29udGFpbnMoaSkpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoaSk7XG4gICAgICBhZGRlZC5wdXNoKGkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgcmVtb3ZlZC5mb3JFYWNoKChpKSA9PiBlbC5jbGFzc0xpc3QuYWRkKGkpKTtcbiAgICBhZGRlZC5mb3JFYWNoKChpKSA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKGkpKTtcbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3N0eWxlcy5qc1xuZnVuY3Rpb24gc2V0U3R5bGVzKGVsLCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHNldFN0eWxlc0Zyb21PYmplY3QoZWwsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gc2V0U3R5bGVzRnJvbVN0cmluZyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gc2V0U3R5bGVzRnJvbU9iamVjdChlbCwgdmFsdWUpIHtcbiAgbGV0IHByZXZpb3VzU3R5bGVzID0ge307XG4gIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5mb3JFYWNoKChba2V5LCB2YWx1ZTJdKSA9PiB7XG4gICAgcHJldmlvdXNTdHlsZXNba2V5XSA9IGVsLnN0eWxlW2tleV07XG4gICAgaWYgKCFrZXkuc3RhcnRzV2l0aChcIi0tXCIpKSB7XG4gICAgICBrZXkgPSBrZWJhYkNhc2Uoa2V5KTtcbiAgICB9XG4gICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZTIpO1xuICB9KTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaWYgKGVsLnN0eWxlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBzZXRTdHlsZXMoZWwsIHByZXZpb3VzU3R5bGVzKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHNldFN0eWxlc0Zyb21TdHJpbmcoZWwsIHZhbHVlKSB7XG4gIGxldCBjYWNoZSA9IGVsLmdldEF0dHJpYnV0ZShcInN0eWxlXCIsIHZhbHVlKTtcbiAgZWwuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgdmFsdWUpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGVsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGNhY2hlIHx8IFwiXCIpO1xuICB9O1xufVxuZnVuY3Rpb24ga2ViYWJDYXNlKHN1YmplY3QpIHtcbiAgcmV0dXJuIHN1YmplY3QucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgXCIkMS0kMlwiKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvb25jZS5qc1xuZnVuY3Rpb24gb25jZShjYWxsYmFjaywgZmFsbGJhY2sgPSAoKSA9PiB7XG59KSB7XG4gIGxldCBjYWxsZWQgPSBmYWxzZTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmFsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtdHJhbnNpdGlvbi5qc1xuZGlyZWN0aXZlKFwidHJhbnNpdGlvblwiLCAoZWwsIHsgdmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiB9LCB7IGV2YWx1YXRlOiBldmFsdWF0ZTIgfSkgPT4ge1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwiZnVuY3Rpb25cIilcbiAgICBleHByZXNzaW9uID0gZXZhbHVhdGUyKGV4cHJlc3Npb24pO1xuICBpZiAoZXhwcmVzc2lvbiA9PT0gZmFsc2UpXG4gICAgcmV0dXJuO1xuICBpZiAoIWV4cHJlc3Npb24gfHwgdHlwZW9mIGV4cHJlc3Npb24gPT09IFwiYm9vbGVhblwiKSB7XG4gICAgcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21IZWxwZXIoZWwsIG1vZGlmaWVycywgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIHJlZ2lzdGVyVHJhbnNpdGlvbnNGcm9tQ2xhc3NTdHJpbmcoZWwsIGV4cHJlc3Npb24sIHZhbHVlKTtcbiAgfVxufSk7XG5mdW5jdGlvbiByZWdpc3RlclRyYW5zaXRpb25zRnJvbUNsYXNzU3RyaW5nKGVsLCBjbGFzc1N0cmluZywgc3RhZ2UpIHtcbiAgcmVnaXN0ZXJUcmFuc2l0aW9uT2JqZWN0KGVsLCBzZXRDbGFzc2VzLCBcIlwiKTtcbiAgbGV0IGRpcmVjdGl2ZVN0b3JhZ2VNYXAgPSB7XG4gICAgXCJlbnRlclwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJlbnRlci1zdGFydFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5zdGFydCA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImVudGVyLWVuZFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5lbmQgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJsZWF2ZVwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5kdXJpbmcgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJsZWF2ZS1zdGFydFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5zdGFydCA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImxlYXZlLWVuZFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5lbmQgPSBjbGFzc2VzO1xuICAgIH1cbiAgfTtcbiAgZGlyZWN0aXZlU3RvcmFnZU1hcFtzdGFnZV0oY2xhc3NTdHJpbmcpO1xufVxuZnVuY3Rpb24gcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21IZWxwZXIoZWwsIG1vZGlmaWVycywgc3RhZ2UpIHtcbiAgcmVnaXN0ZXJUcmFuc2l0aW9uT2JqZWN0KGVsLCBzZXRTdHlsZXMpO1xuICBsZXQgZG9lc250U3BlY2lmeSA9ICFtb2RpZmllcnMuaW5jbHVkZXMoXCJpblwiKSAmJiAhbW9kaWZpZXJzLmluY2x1ZGVzKFwib3V0XCIpICYmICFzdGFnZTtcbiAgbGV0IHRyYW5zaXRpb25pbmdJbiA9IGRvZXNudFNwZWNpZnkgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwiaW5cIikgfHwgW1wiZW50ZXJcIl0uaW5jbHVkZXMoc3RhZ2UpO1xuICBsZXQgdHJhbnNpdGlvbmluZ091dCA9IGRvZXNudFNwZWNpZnkgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwib3V0XCIpIHx8IFtcImxlYXZlXCJdLmluY2x1ZGVzKHN0YWdlKTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImluXCIpICYmICFkb2VzbnRTcGVjaWZ5KSB7XG4gICAgbW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigoaSwgaW5kZXgpID0+IGluZGV4IDwgbW9kaWZpZXJzLmluZGV4T2YoXCJvdXRcIikpO1xuICB9XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRcIikgJiYgIWRvZXNudFNwZWNpZnkpIHtcbiAgICBtb2RpZmllcnMgPSBtb2RpZmllcnMuZmlsdGVyKChpLCBpbmRleCkgPT4gaW5kZXggPiBtb2RpZmllcnMuaW5kZXhPZihcIm91dFwiKSk7XG4gIH1cbiAgbGV0IHdhbnRzQWxsID0gIW1vZGlmaWVycy5pbmNsdWRlcyhcIm9wYWNpdHlcIikgJiYgIW1vZGlmaWVycy5pbmNsdWRlcyhcInNjYWxlXCIpO1xuICBsZXQgd2FudHNPcGFjaXR5ID0gd2FudHNBbGwgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwib3BhY2l0eVwiKTtcbiAgbGV0IHdhbnRzU2NhbGUgPSB3YW50c0FsbCB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJzY2FsZVwiKTtcbiAgbGV0IG9wYWNpdHlWYWx1ZSA9IHdhbnRzT3BhY2l0eSA/IDAgOiAxO1xuICBsZXQgc2NhbGVWYWx1ZSA9IHdhbnRzU2NhbGUgPyBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJzY2FsZVwiLCA5NSkgLyAxMDAgOiAxO1xuICBsZXQgZGVsYXkgPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJkZWxheVwiLCAwKSAvIDFlMztcbiAgbGV0IG9yaWdpbiA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcIm9yaWdpblwiLCBcImNlbnRlclwiKTtcbiAgbGV0IHByb3BlcnR5ID0gXCJvcGFjaXR5LCB0cmFuc2Zvcm1cIjtcbiAgbGV0IGR1cmF0aW9uSW4gPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJkdXJhdGlvblwiLCAxNTApIC8gMWUzO1xuICBsZXQgZHVyYXRpb25PdXQgPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJkdXJhdGlvblwiLCA3NSkgLyAxZTM7XG4gIGxldCBlYXNpbmcgPSBgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpYDtcbiAgaWYgKHRyYW5zaXRpb25pbmdJbikge1xuICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZHVyaW5nID0ge1xuICAgICAgdHJhbnNmb3JtT3JpZ2luOiBvcmlnaW4sXG4gICAgICB0cmFuc2l0aW9uRGVsYXk6IGAke2RlbGF5fXNgLFxuICAgICAgdHJhbnNpdGlvblByb3BlcnR5OiBwcm9wZXJ0eSxcbiAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogYCR7ZHVyYXRpb25Jbn1zYCxcbiAgICAgIHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbjogZWFzaW5nXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLnN0YXJ0ID0ge1xuICAgICAgb3BhY2l0eTogb3BhY2l0eVZhbHVlLFxuICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoJHtzY2FsZVZhbHVlfSlgXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLmVuZCA9IHtcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgxKWBcbiAgICB9O1xuICB9XG4gIGlmICh0cmFuc2l0aW9uaW5nT3V0KSB7XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5kdXJpbmcgPSB7XG4gICAgICB0cmFuc2Zvcm1PcmlnaW46IG9yaWdpbixcbiAgICAgIHRyYW5zaXRpb25EZWxheTogYCR7ZGVsYXl9c2AsXG4gICAgICB0cmFuc2l0aW9uUHJvcGVydHk6IHByb3BlcnR5LFxuICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBgJHtkdXJhdGlvbk91dH1zYCxcbiAgICAgIHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbjogZWFzaW5nXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLnN0YXJ0ID0ge1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDEpYFxuICAgIH07XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5lbmQgPSB7XG4gICAgICBvcGFjaXR5OiBvcGFjaXR5VmFsdWUsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgke3NjYWxlVmFsdWV9KWBcbiAgICB9O1xuICB9XG59XG5mdW5jdGlvbiByZWdpc3RlclRyYW5zaXRpb25PYmplY3QoZWwsIHNldEZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUgPSB7fSkge1xuICBpZiAoIWVsLl94X3RyYW5zaXRpb24pXG4gICAgZWwuX3hfdHJhbnNpdGlvbiA9IHtcbiAgICAgIGVudGVyOiB7IGR1cmluZzogZGVmYXVsdFZhbHVlLCBzdGFydDogZGVmYXVsdFZhbHVlLCBlbmQ6IGRlZmF1bHRWYWx1ZSB9LFxuICAgICAgbGVhdmU6IHsgZHVyaW5nOiBkZWZhdWx0VmFsdWUsIHN0YXJ0OiBkZWZhdWx0VmFsdWUsIGVuZDogZGVmYXVsdFZhbHVlIH0sXG4gICAgICBpbihiZWZvcmUgPSAoKSA9PiB7XG4gICAgICB9LCBhZnRlciA9ICgpID0+IHtcbiAgICAgIH0pIHtcbiAgICAgICAgdHJhbnNpdGlvbihlbCwgc2V0RnVuY3Rpb24sIHtcbiAgICAgICAgICBkdXJpbmc6IHRoaXMuZW50ZXIuZHVyaW5nLFxuICAgICAgICAgIHN0YXJ0OiB0aGlzLmVudGVyLnN0YXJ0LFxuICAgICAgICAgIGVuZDogdGhpcy5lbnRlci5lbmRcbiAgICAgICAgfSwgYmVmb3JlLCBhZnRlcik7XG4gICAgICB9LFxuICAgICAgb3V0KGJlZm9yZSA9ICgpID0+IHtcbiAgICAgIH0sIGFmdGVyID0gKCkgPT4ge1xuICAgICAgfSkge1xuICAgICAgICB0cmFuc2l0aW9uKGVsLCBzZXRGdW5jdGlvbiwge1xuICAgICAgICAgIGR1cmluZzogdGhpcy5sZWF2ZS5kdXJpbmcsXG4gICAgICAgICAgc3RhcnQ6IHRoaXMubGVhdmUuc3RhcnQsXG4gICAgICAgICAgZW5kOiB0aGlzLmxlYXZlLmVuZFxuICAgICAgICB9LCBiZWZvcmUsIGFmdGVyKTtcbiAgICAgIH1cbiAgICB9O1xufVxud2luZG93LkVsZW1lbnQucHJvdG90eXBlLl94X3RvZ2dsZUFuZENhc2NhZGVXaXRoVHJhbnNpdGlvbnMgPSBmdW5jdGlvbihlbCwgdmFsdWUsIHNob3csIGhpZGUpIHtcbiAgY29uc3QgbmV4dFRpY2syID0gZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSBcInZpc2libGVcIiA/IHJlcXVlc3RBbmltYXRpb25GcmFtZSA6IHNldFRpbWVvdXQ7XG4gIGxldCBjbGlja0F3YXlDb21wYXRpYmxlU2hvdyA9ICgpID0+IG5leHRUaWNrMihzaG93KTtcbiAgaWYgKHZhbHVlKSB7XG4gICAgaWYgKGVsLl94X3RyYW5zaXRpb24gJiYgKGVsLl94X3RyYW5zaXRpb24uZW50ZXIgfHwgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZSkpIHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIgJiYgKE9iamVjdC5lbnRyaWVzKGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZHVyaW5nKS5sZW5ndGggfHwgT2JqZWN0LmVudHJpZXMoZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5zdGFydCkubGVuZ3RoIHx8IE9iamVjdC5lbnRyaWVzKGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZW5kKS5sZW5ndGgpID8gZWwuX3hfdHJhbnNpdGlvbi5pbihzaG93KSA6IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24gPyBlbC5feF90cmFuc2l0aW9uLmluKHNob3cpIDogY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsLl94X2hpZGVQcm9taXNlID0gZWwuX3hfdHJhbnNpdGlvbiA/IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBlbC5feF90cmFuc2l0aW9uLm91dCgoKSA9PiB7XG4gICAgfSwgKCkgPT4gcmVzb2x2ZShoaWRlKSk7XG4gICAgZWwuX3hfdHJhbnNpdGlvbmluZyAmJiBlbC5feF90cmFuc2l0aW9uaW5nLmJlZm9yZUNhbmNlbCgoKSA9PiByZWplY3QoeyBpc0Zyb21DYW5jZWxsZWRUcmFuc2l0aW9uOiB0cnVlIH0pKTtcbiAgfSkgOiBQcm9taXNlLnJlc29sdmUoaGlkZSk7XG4gIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICBsZXQgY2xvc2VzdCA9IGNsb3Nlc3RIaWRlKGVsKTtcbiAgICBpZiAoY2xvc2VzdCkge1xuICAgICAgaWYgKCFjbG9zZXN0Ll94X2hpZGVDaGlsZHJlbilcbiAgICAgICAgY2xvc2VzdC5feF9oaWRlQ2hpbGRyZW4gPSBbXTtcbiAgICAgIGNsb3Nlc3QuX3hfaGlkZUNoaWxkcmVuLnB1c2goZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0VGljazIoKCkgPT4ge1xuICAgICAgICBsZXQgaGlkZUFmdGVyQ2hpbGRyZW4gPSAoZWwyKSA9PiB7XG4gICAgICAgICAgbGV0IGNhcnJ5ID0gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgZWwyLl94X2hpZGVQcm9taXNlLFxuICAgICAgICAgICAgLi4uKGVsMi5feF9oaWRlQ2hpbGRyZW4gfHwgW10pLm1hcChoaWRlQWZ0ZXJDaGlsZHJlbilcbiAgICAgICAgICBdKS50aGVuKChbaV0pID0+IGk/LigpKTtcbiAgICAgICAgICBkZWxldGUgZWwyLl94X2hpZGVQcm9taXNlO1xuICAgICAgICAgIGRlbGV0ZSBlbDIuX3hfaGlkZUNoaWxkcmVuO1xuICAgICAgICAgIHJldHVybiBjYXJyeTtcbiAgICAgICAgfTtcbiAgICAgICAgaGlkZUFmdGVyQ2hpbGRyZW4oZWwpLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgaWYgKCFlLmlzRnJvbUNhbmNlbGxlZFRyYW5zaXRpb24pXG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuZnVuY3Rpb24gY2xvc2VzdEhpZGUoZWwpIHtcbiAgbGV0IHBhcmVudCA9IGVsLnBhcmVudE5vZGU7XG4gIGlmICghcGFyZW50KVxuICAgIHJldHVybjtcbiAgcmV0dXJuIHBhcmVudC5feF9oaWRlUHJvbWlzZSA/IHBhcmVudCA6IGNsb3Nlc3RIaWRlKHBhcmVudCk7XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uKGVsLCBzZXRGdW5jdGlvbiwgeyBkdXJpbmcsIHN0YXJ0OiBzdGFydDIsIGVuZCB9ID0ge30sIGJlZm9yZSA9ICgpID0+IHtcbn0sIGFmdGVyID0gKCkgPT4ge1xufSkge1xuICBpZiAoZWwuX3hfdHJhbnNpdGlvbmluZylcbiAgICBlbC5feF90cmFuc2l0aW9uaW5nLmNhbmNlbCgpO1xuICBpZiAoT2JqZWN0LmtleXMoZHVyaW5nKS5sZW5ndGggPT09IDAgJiYgT2JqZWN0LmtleXMoc3RhcnQyKS5sZW5ndGggPT09IDAgJiYgT2JqZWN0LmtleXMoZW5kKS5sZW5ndGggPT09IDApIHtcbiAgICBiZWZvcmUoKTtcbiAgICBhZnRlcigpO1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgdW5kb1N0YXJ0LCB1bmRvRHVyaW5nLCB1bmRvRW5kO1xuICBwZXJmb3JtVHJhbnNpdGlvbihlbCwge1xuICAgIHN0YXJ0KCkge1xuICAgICAgdW5kb1N0YXJ0ID0gc2V0RnVuY3Rpb24oZWwsIHN0YXJ0Mik7XG4gICAgfSxcbiAgICBkdXJpbmcoKSB7XG4gICAgICB1bmRvRHVyaW5nID0gc2V0RnVuY3Rpb24oZWwsIGR1cmluZyk7XG4gICAgfSxcbiAgICBiZWZvcmUsXG4gICAgZW5kKCkge1xuICAgICAgdW5kb1N0YXJ0KCk7XG4gICAgICB1bmRvRW5kID0gc2V0RnVuY3Rpb24oZWwsIGVuZCk7XG4gICAgfSxcbiAgICBhZnRlcixcbiAgICBjbGVhbnVwKCkge1xuICAgICAgdW5kb0R1cmluZygpO1xuICAgICAgdW5kb0VuZCgpO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBwZXJmb3JtVHJhbnNpdGlvbihlbCwgc3RhZ2VzKSB7XG4gIGxldCBpbnRlcnJ1cHRlZCwgcmVhY2hlZEJlZm9yZSwgcmVhY2hlZEVuZDtcbiAgbGV0IGZpbmlzaCA9IG9uY2UoKCkgPT4ge1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBpbnRlcnJ1cHRlZCA9IHRydWU7XG4gICAgICBpZiAoIXJlYWNoZWRCZWZvcmUpXG4gICAgICAgIHN0YWdlcy5iZWZvcmUoKTtcbiAgICAgIGlmICghcmVhY2hlZEVuZCkge1xuICAgICAgICBzdGFnZXMuZW5kKCk7XG4gICAgICAgIHJlbGVhc2VOZXh0VGlja3MoKTtcbiAgICAgIH1cbiAgICAgIHN0YWdlcy5hZnRlcigpO1xuICAgICAgaWYgKGVsLmlzQ29ubmVjdGVkKVxuICAgICAgICBzdGFnZXMuY2xlYW51cCgpO1xuICAgICAgZGVsZXRlIGVsLl94X3RyYW5zaXRpb25pbmc7XG4gICAgfSk7XG4gIH0pO1xuICBlbC5feF90cmFuc2l0aW9uaW5nID0ge1xuICAgIGJlZm9yZUNhbmNlbHM6IFtdLFxuICAgIGJlZm9yZUNhbmNlbChjYWxsYmFjaykge1xuICAgICAgdGhpcy5iZWZvcmVDYW5jZWxzLnB1c2goY2FsbGJhY2spO1xuICAgIH0sXG4gICAgY2FuY2VsOiBvbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgd2hpbGUgKHRoaXMuYmVmb3JlQ2FuY2Vscy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5iZWZvcmVDYW5jZWxzLnNoaWZ0KCkoKTtcbiAgICAgIH1cbiAgICAgIDtcbiAgICAgIGZpbmlzaCgpO1xuICAgIH0pLFxuICAgIGZpbmlzaFxuICB9O1xuICBtdXRhdGVEb20oKCkgPT4ge1xuICAgIHN0YWdlcy5zdGFydCgpO1xuICAgIHN0YWdlcy5kdXJpbmcoKTtcbiAgfSk7XG4gIGhvbGROZXh0VGlja3MoKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBpZiAoaW50ZXJydXB0ZWQpXG4gICAgICByZXR1cm47XG4gICAgbGV0IGR1cmF0aW9uID0gTnVtYmVyKGdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EdXJhdGlvbi5yZXBsYWNlKC8sLiovLCBcIlwiKS5yZXBsYWNlKFwic1wiLCBcIlwiKSkgKiAxZTM7XG4gICAgbGV0IGRlbGF5ID0gTnVtYmVyKGdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EZWxheS5yZXBsYWNlKC8sLiovLCBcIlwiKS5yZXBsYWNlKFwic1wiLCBcIlwiKSkgKiAxZTM7XG4gICAgaWYgKGR1cmF0aW9uID09PSAwKVxuICAgICAgZHVyYXRpb24gPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkuYW5pbWF0aW9uRHVyYXRpb24ucmVwbGFjZShcInNcIiwgXCJcIikpICogMWUzO1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBzdGFnZXMuYmVmb3JlKCk7XG4gICAgfSk7XG4gICAgcmVhY2hlZEJlZm9yZSA9IHRydWU7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmIChpbnRlcnJ1cHRlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgc3RhZ2VzLmVuZCgpO1xuICAgICAgfSk7XG4gICAgICByZWxlYXNlTmV4dFRpY2tzKCk7XG4gICAgICBzZXRUaW1lb3V0KGVsLl94X3RyYW5zaXRpb25pbmcuZmluaXNoLCBkdXJhdGlvbiArIGRlbGF5KTtcbiAgICAgIHJlYWNoZWRFbmQgPSB0cnVlO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBrZXksIGZhbGxiYWNrKSB7XG4gIGlmIChtb2RpZmllcnMuaW5kZXhPZihrZXkpID09PSAtMSlcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIGNvbnN0IHJhd1ZhbHVlID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAxXTtcbiAgaWYgKCFyYXdWYWx1ZSlcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIGlmIChrZXkgPT09IFwic2NhbGVcIikge1xuICAgIGlmIChpc05hTihyYXdWYWx1ZSkpXG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gIH1cbiAgaWYgKGtleSA9PT0gXCJkdXJhdGlvblwiIHx8IGtleSA9PT0gXCJkZWxheVwiKSB7XG4gICAgbGV0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goLyhbMC05XSspbXMvKTtcbiAgICBpZiAobWF0Y2gpXG4gICAgICByZXR1cm4gbWF0Y2hbMV07XG4gIH1cbiAgaWYgKGtleSA9PT0gXCJvcmlnaW5cIikge1xuICAgIGlmIChbXCJ0b3BcIiwgXCJyaWdodFwiLCBcImxlZnRcIiwgXCJjZW50ZXJcIiwgXCJib3R0b21cIl0uaW5jbHVkZXMobW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAyXSkpIHtcbiAgICAgIHJldHVybiBbcmF3VmFsdWUsIG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihrZXkpICsgMl1dLmpvaW4oXCIgXCIpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmF3VmFsdWU7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9jbG9uZS5qc1xudmFyIGlzQ2xvbmluZyA9IGZhbHNlO1xuZnVuY3Rpb24gc2tpcER1cmluZ0Nsb25lKGNhbGxiYWNrLCBmYWxsYmFjayA9ICgpID0+IHtcbn0pIHtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiBpc0Nsb25pbmcgPyBmYWxsYmFjayguLi5hcmdzKSA6IGNhbGxiYWNrKC4uLmFyZ3MpO1xufVxuZnVuY3Rpb24gb25seUR1cmluZ0Nsb25lKGNhbGxiYWNrKSB7XG4gIHJldHVybiAoLi4uYXJncykgPT4gaXNDbG9uaW5nICYmIGNhbGxiYWNrKC4uLmFyZ3MpO1xufVxudmFyIGludGVyY2VwdG9ycyA9IFtdO1xuZnVuY3Rpb24gaW50ZXJjZXB0Q2xvbmUoY2FsbGJhY2spIHtcbiAgaW50ZXJjZXB0b3JzLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gY2xvbmVOb2RlKGZyb20sIHRvKSB7XG4gIGludGVyY2VwdG9ycy5mb3JFYWNoKChpKSA9PiBpKGZyb20sIHRvKSk7XG4gIGlzQ2xvbmluZyA9IHRydWU7XG4gIGRvbnRSZWdpc3RlclJlYWN0aXZlU2lkZUVmZmVjdHMoKCkgPT4ge1xuICAgIGluaXRUcmVlKHRvLCAoZWwsIGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhlbCwgKCkgPT4ge1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICBpc0Nsb25pbmcgPSBmYWxzZTtcbn1cbnZhciBpc0Nsb25pbmdMZWdhY3kgPSBmYWxzZTtcbmZ1bmN0aW9uIGNsb25lKG9sZEVsLCBuZXdFbCkge1xuICBpZiAoIW5ld0VsLl94X2RhdGFTdGFjaylcbiAgICBuZXdFbC5feF9kYXRhU3RhY2sgPSBvbGRFbC5feF9kYXRhU3RhY2s7XG4gIGlzQ2xvbmluZyA9IHRydWU7XG4gIGlzQ2xvbmluZ0xlZ2FjeSA9IHRydWU7XG4gIGRvbnRSZWdpc3RlclJlYWN0aXZlU2lkZUVmZmVjdHMoKCkgPT4ge1xuICAgIGNsb25lVHJlZShuZXdFbCk7XG4gIH0pO1xuICBpc0Nsb25pbmcgPSBmYWxzZTtcbiAgaXNDbG9uaW5nTGVnYWN5ID0gZmFsc2U7XG59XG5mdW5jdGlvbiBjbG9uZVRyZWUoZWwpIHtcbiAgbGV0IGhhc1J1blRocm91Z2hGaXJzdEVsID0gZmFsc2U7XG4gIGxldCBzaGFsbG93V2Fsa2VyID0gKGVsMiwgY2FsbGJhY2spID0+IHtcbiAgICB3YWxrKGVsMiwgKGVsMywgc2tpcCkgPT4ge1xuICAgICAgaWYgKGhhc1J1blRocm91Z2hGaXJzdEVsICYmIGlzUm9vdChlbDMpKVxuICAgICAgICByZXR1cm4gc2tpcCgpO1xuICAgICAgaGFzUnVuVGhyb3VnaEZpcnN0RWwgPSB0cnVlO1xuICAgICAgY2FsbGJhY2soZWwzLCBza2lwKTtcbiAgICB9KTtcbiAgfTtcbiAgaW5pdFRyZWUoZWwsIHNoYWxsb3dXYWxrZXIpO1xufVxuZnVuY3Rpb24gZG9udFJlZ2lzdGVyUmVhY3RpdmVTaWRlRWZmZWN0cyhjYWxsYmFjaykge1xuICBsZXQgY2FjaGUgPSBlZmZlY3Q7XG4gIG92ZXJyaWRlRWZmZWN0KChjYWxsYmFjazIsIGVsKSA9PiB7XG4gICAgbGV0IHN0b3JlZEVmZmVjdCA9IGNhY2hlKGNhbGxiYWNrMik7XG4gICAgcmVsZWFzZShzdG9yZWRFZmZlY3QpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgfTtcbiAgfSk7XG4gIGNhbGxiYWNrKCk7XG4gIG92ZXJyaWRlRWZmZWN0KGNhY2hlKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2JpbmQuanNcbmZ1bmN0aW9uIGJpbmQoZWwsIG5hbWUsIHZhbHVlLCBtb2RpZmllcnMgPSBbXSkge1xuICBpZiAoIWVsLl94X2JpbmRpbmdzKVxuICAgIGVsLl94X2JpbmRpbmdzID0gcmVhY3RpdmUoe30pO1xuICBlbC5feF9iaW5kaW5nc1tuYW1lXSA9IHZhbHVlO1xuICBuYW1lID0gbW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FtZWxcIikgPyBjYW1lbENhc2UobmFtZSkgOiBuYW1lO1xuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICBjYXNlIFwidmFsdWVcIjpcbiAgICAgIGJpbmRJbnB1dFZhbHVlKGVsLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic3R5bGVcIjpcbiAgICAgIGJpbmRTdHlsZXMoZWwsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJjbGFzc1wiOlxuICAgICAgYmluZENsYXNzZXMoZWwsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzZWxlY3RlZFwiOlxuICAgIGNhc2UgXCJjaGVja2VkXCI6XG4gICAgICBiaW5kQXR0cmlidXRlQW5kUHJvcGVydHkoZWwsIG5hbWUsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBiaW5kQXR0cmlidXRlKGVsLCBuYW1lLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgfVxufVxuZnVuY3Rpb24gYmluZElucHV0VmFsdWUoZWwsIHZhbHVlKSB7XG4gIGlmIChpc1JhZGlvKGVsKSkge1xuICAgIGlmIChlbC5hdHRyaWJ1dGVzLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIGVsLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuZnJvbU1vZGVsKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICBlbC5jaGVja2VkID0gc2FmZVBhcnNlQm9vbGVhbihlbC52YWx1ZSkgPT09IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9IGNoZWNrZWRBdHRyTG9vc2VDb21wYXJlKGVsLnZhbHVlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzQ2hlY2tib3goZWwpKSB7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICBlbC52YWx1ZSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJib29sZWFuXCIgJiYgIVtudWxsLCB2b2lkIDBdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9IHZhbHVlLnNvbWUoKHZhbCkgPT4gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUodmFsLCBlbC52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9ICEhdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGVsLnRhZ05hbWUgPT09IFwiU0VMRUNUXCIpIHtcbiAgICB1cGRhdGVTZWxlY3QoZWwsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoZWwudmFsdWUgPT09IHZhbHVlKVxuICAgICAgcmV0dXJuO1xuICAgIGVsLnZhbHVlID0gdmFsdWUgPT09IHZvaWQgMCA/IFwiXCIgOiB2YWx1ZTtcbiAgfVxufVxuZnVuY3Rpb24gYmluZENsYXNzZXMoZWwsIHZhbHVlKSB7XG4gIGlmIChlbC5feF91bmRvQWRkZWRDbGFzc2VzKVxuICAgIGVsLl94X3VuZG9BZGRlZENsYXNzZXMoKTtcbiAgZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcyA9IHNldENsYXNzZXMoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGJpbmRTdHlsZXMoZWwsIHZhbHVlKSB7XG4gIGlmIChlbC5feF91bmRvQWRkZWRTdHlsZXMpXG4gICAgZWwuX3hfdW5kb0FkZGVkU3R5bGVzKCk7XG4gIGVsLl94X3VuZG9BZGRlZFN0eWxlcyA9IHNldFN0eWxlcyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gYmluZEF0dHJpYnV0ZUFuZFByb3BlcnR5KGVsLCBuYW1lLCB2YWx1ZSkge1xuICBiaW5kQXR0cmlidXRlKGVsLCBuYW1lLCB2YWx1ZSk7XG4gIHNldFByb3BlcnR5SWZDaGFuZ2VkKGVsLCBuYW1lLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBiaW5kQXR0cmlidXRlKGVsLCBuYW1lLCB2YWx1ZSkge1xuICBpZiAoW251bGwsIHZvaWQgMCwgZmFsc2VdLmluY2x1ZGVzKHZhbHVlKSAmJiBhdHRyaWJ1dGVTaG91bGRudEJlUHJlc2VydmVkSWZGYWxzeShuYW1lKSkge1xuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoaXNCb29sZWFuQXR0cihuYW1lKSlcbiAgICAgIHZhbHVlID0gbmFtZTtcbiAgICBzZXRJZkNoYW5nZWQoZWwsIG5hbWUsIHZhbHVlKTtcbiAgfVxufVxuZnVuY3Rpb24gc2V0SWZDaGFuZ2VkKGVsLCBhdHRyTmFtZSwgdmFsdWUpIHtcbiAgaWYgKGVsLmdldEF0dHJpYnV0ZShhdHRyTmFtZSkgIT0gdmFsdWUpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIHZhbHVlKTtcbiAgfVxufVxuZnVuY3Rpb24gc2V0UHJvcGVydHlJZkNoYW5nZWQoZWwsIHByb3BOYW1lLCB2YWx1ZSkge1xuICBpZiAoZWxbcHJvcE5hbWVdICE9PSB2YWx1ZSkge1xuICAgIGVsW3Byb3BOYW1lXSA9IHZhbHVlO1xuICB9XG59XG5mdW5jdGlvbiB1cGRhdGVTZWxlY3QoZWwsIHZhbHVlKSB7XG4gIGNvbnN0IGFycmF5V3JhcHBlZFZhbHVlID0gW10uY29uY2F0KHZhbHVlKS5tYXAoKHZhbHVlMikgPT4ge1xuICAgIHJldHVybiB2YWx1ZTIgKyBcIlwiO1xuICB9KTtcbiAgQXJyYXkuZnJvbShlbC5vcHRpb25zKS5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICBvcHRpb24uc2VsZWN0ZWQgPSBhcnJheVdyYXBwZWRWYWx1ZS5pbmNsdWRlcyhvcHRpb24udmFsdWUpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGNhbWVsQ2FzZShzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShcXHcpL2csIChtYXRjaCwgY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpKTtcbn1cbmZ1bmN0aW9uIGNoZWNrZWRBdHRyTG9vc2VDb21wYXJlKHZhbHVlQSwgdmFsdWVCKSB7XG4gIHJldHVybiB2YWx1ZUEgPT0gdmFsdWVCO1xufVxuZnVuY3Rpb24gc2FmZVBhcnNlQm9vbGVhbihyYXdWYWx1ZSkge1xuICBpZiAoWzEsIFwiMVwiLCBcInRydWVcIiwgXCJvblwiLCBcInllc1wiLCB0cnVlXS5pbmNsdWRlcyhyYXdWYWx1ZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoWzAsIFwiMFwiLCBcImZhbHNlXCIsIFwib2ZmXCIsIFwibm9cIiwgZmFsc2VdLmluY2x1ZGVzKHJhd1ZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gcmF3VmFsdWUgPyBCb29sZWFuKHJhd1ZhbHVlKSA6IG51bGw7XG59XG52YXIgYm9vbGVhbkF0dHJpYnV0ZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG4gIFwiYWxsb3dmdWxsc2NyZWVuXCIsXG4gIFwiYXN5bmNcIixcbiAgXCJhdXRvZm9jdXNcIixcbiAgXCJhdXRvcGxheVwiLFxuICBcImNoZWNrZWRcIixcbiAgXCJjb250cm9sc1wiLFxuICBcImRlZmF1bHRcIixcbiAgXCJkZWZlclwiLFxuICBcImRpc2FibGVkXCIsXG4gIFwiZm9ybW5vdmFsaWRhdGVcIixcbiAgXCJpbmVydFwiLFxuICBcImlzbWFwXCIsXG4gIFwiaXRlbXNjb3BlXCIsXG4gIFwibG9vcFwiLFxuICBcIm11bHRpcGxlXCIsXG4gIFwibXV0ZWRcIixcbiAgXCJub21vZHVsZVwiLFxuICBcIm5vdmFsaWRhdGVcIixcbiAgXCJvcGVuXCIsXG4gIFwicGxheXNpbmxpbmVcIixcbiAgXCJyZWFkb25seVwiLFxuICBcInJlcXVpcmVkXCIsXG4gIFwicmV2ZXJzZWRcIixcbiAgXCJzZWxlY3RlZFwiLFxuICBcInNoYWRvd3Jvb3RjbG9uYWJsZVwiLFxuICBcInNoYWRvd3Jvb3RkZWxlZ2F0ZXNmb2N1c1wiLFxuICBcInNoYWRvd3Jvb3RzZXJpYWxpemFibGVcIlxuXSk7XG5mdW5jdGlvbiBpc0Jvb2xlYW5BdHRyKGF0dHJOYW1lKSB7XG4gIHJldHVybiBib29sZWFuQXR0cmlidXRlcy5oYXMoYXR0ck5hbWUpO1xufVxuZnVuY3Rpb24gYXR0cmlidXRlU2hvdWxkbnRCZVByZXNlcnZlZElmRmFsc3kobmFtZSkge1xuICByZXR1cm4gIVtcImFyaWEtcHJlc3NlZFwiLCBcImFyaWEtY2hlY2tlZFwiLCBcImFyaWEtZXhwYW5kZWRcIiwgXCJhcmlhLXNlbGVjdGVkXCJdLmluY2x1ZGVzKG5hbWUpO1xufVxuZnVuY3Rpb24gZ2V0QmluZGluZyhlbCwgbmFtZSwgZmFsbGJhY2spIHtcbiAgaWYgKGVsLl94X2JpbmRpbmdzICYmIGVsLl94X2JpbmRpbmdzW25hbWVdICE9PSB2b2lkIDApXG4gICAgcmV0dXJuIGVsLl94X2JpbmRpbmdzW25hbWVdO1xuICByZXR1cm4gZ2V0QXR0cmlidXRlQmluZGluZyhlbCwgbmFtZSwgZmFsbGJhY2spO1xufVxuZnVuY3Rpb24gZXh0cmFjdFByb3AoZWwsIG5hbWUsIGZhbGxiYWNrLCBleHRyYWN0ID0gdHJ1ZSkge1xuICBpZiAoZWwuX3hfYmluZGluZ3MgJiYgZWwuX3hfYmluZGluZ3NbbmFtZV0gIT09IHZvaWQgMClcbiAgICByZXR1cm4gZWwuX3hfYmluZGluZ3NbbmFtZV07XG4gIGlmIChlbC5feF9pbmxpbmVCaW5kaW5ncyAmJiBlbC5feF9pbmxpbmVCaW5kaW5nc1tuYW1lXSAhPT0gdm9pZCAwKSB7XG4gICAgbGV0IGJpbmRpbmcgPSBlbC5feF9pbmxpbmVCaW5kaW5nc1tuYW1lXTtcbiAgICBiaW5kaW5nLmV4dHJhY3QgPSBleHRyYWN0O1xuICAgIHJldHVybiBkb250QXV0b0V2YWx1YXRlRnVuY3Rpb25zKCgpID0+IHtcbiAgICAgIHJldHVybiBldmFsdWF0ZShlbCwgYmluZGluZy5leHByZXNzaW9uKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZ2V0QXR0cmlidXRlQmluZGluZyhlbCwgbmFtZSwgZmFsbGJhY2spO1xufVxuZnVuY3Rpb24gZ2V0QXR0cmlidXRlQmluZGluZyhlbCwgbmFtZSwgZmFsbGJhY2spIHtcbiAgbGV0IGF0dHIgPSBlbC5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gIGlmIChhdHRyID09PSBudWxsKVxuICAgIHJldHVybiB0eXBlb2YgZmFsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiA/IGZhbGxiYWNrKCkgOiBmYWxsYmFjaztcbiAgaWYgKGF0dHIgPT09IFwiXCIpXG4gICAgcmV0dXJuIHRydWU7XG4gIGlmIChpc0Jvb2xlYW5BdHRyKG5hbWUpKSB7XG4gICAgcmV0dXJuICEhW25hbWUsIFwidHJ1ZVwiXS5pbmNsdWRlcyhhdHRyKTtcbiAgfVxuICByZXR1cm4gYXR0cjtcbn1cbmZ1bmN0aW9uIGlzQ2hlY2tib3goZWwpIHtcbiAgcmV0dXJuIGVsLnR5cGUgPT09IFwiY2hlY2tib3hcIiB8fCBlbC5sb2NhbE5hbWUgPT09IFwidWktY2hlY2tib3hcIiB8fCBlbC5sb2NhbE5hbWUgPT09IFwidWktc3dpdGNoXCI7XG59XG5mdW5jdGlvbiBpc1JhZGlvKGVsKSB7XG4gIHJldHVybiBlbC50eXBlID09PSBcInJhZGlvXCIgfHwgZWwubG9jYWxOYW1lID09PSBcInVpLXJhZGlvXCI7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9kZWJvdW5jZS5qc1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy90aHJvdHRsZS5qc1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgbGltaXQpIHtcbiAgbGV0IGluVGhyb3R0bGU7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgaWYgKCFpblRocm90dGxlKSB7XG4gICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaW5UaHJvdHRsZSA9IHRydWU7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGluVGhyb3R0bGUgPSBmYWxzZSwgbGltaXQpO1xuICAgIH1cbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2VudGFuZ2xlLmpzXG5mdW5jdGlvbiBlbnRhbmdsZSh7IGdldDogb3V0ZXJHZXQsIHNldDogb3V0ZXJTZXQgfSwgeyBnZXQ6IGlubmVyR2V0LCBzZXQ6IGlubmVyU2V0IH0pIHtcbiAgbGV0IGZpcnN0UnVuID0gdHJ1ZTtcbiAgbGV0IG91dGVySGFzaDtcbiAgbGV0IGlubmVySGFzaDtcbiAgbGV0IHJlZmVyZW5jZSA9IGVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IG91dGVyID0gb3V0ZXJHZXQoKTtcbiAgICBsZXQgaW5uZXIgPSBpbm5lckdldCgpO1xuICAgIGlmIChmaXJzdFJ1bikge1xuICAgICAgaW5uZXJTZXQoY2xvbmVJZk9iamVjdChvdXRlcikpO1xuICAgICAgZmlyc3RSdW4gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG91dGVySGFzaExhdGVzdCA9IEpTT04uc3RyaW5naWZ5KG91dGVyKTtcbiAgICAgIGxldCBpbm5lckhhc2hMYXRlc3QgPSBKU09OLnN0cmluZ2lmeShpbm5lcik7XG4gICAgICBpZiAob3V0ZXJIYXNoTGF0ZXN0ICE9PSBvdXRlckhhc2gpIHtcbiAgICAgICAgaW5uZXJTZXQoY2xvbmVJZk9iamVjdChvdXRlcikpO1xuICAgICAgfSBlbHNlIGlmIChvdXRlckhhc2hMYXRlc3QgIT09IGlubmVySGFzaExhdGVzdCkge1xuICAgICAgICBvdXRlclNldChjbG9uZUlmT2JqZWN0KGlubmVyKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgfVxuICAgIH1cbiAgICBvdXRlckhhc2ggPSBKU09OLnN0cmluZ2lmeShvdXRlckdldCgpKTtcbiAgICBpbm5lckhhc2ggPSBKU09OLnN0cmluZ2lmeShpbm5lckdldCgpKTtcbiAgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgcmVsZWFzZShyZWZlcmVuY2UpO1xuICB9O1xufVxuZnVuY3Rpb24gY2xvbmVJZk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiID8gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWx1ZSkpIDogdmFsdWU7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9wbHVnaW4uanNcbmZ1bmN0aW9uIHBsdWdpbihjYWxsYmFjaykge1xuICBsZXQgY2FsbGJhY2tzID0gQXJyYXkuaXNBcnJheShjYWxsYmFjaykgPyBjYWxsYmFjayA6IFtjYWxsYmFja107XG4gIGNhbGxiYWNrcy5mb3JFYWNoKChpKSA9PiBpKGFscGluZV9kZWZhdWx0KSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9zdG9yZS5qc1xudmFyIHN0b3JlcyA9IHt9O1xudmFyIGlzUmVhY3RpdmUgPSBmYWxzZTtcbmZ1bmN0aW9uIHN0b3JlKG5hbWUsIHZhbHVlKSB7XG4gIGlmICghaXNSZWFjdGl2ZSkge1xuICAgIHN0b3JlcyA9IHJlYWN0aXZlKHN0b3Jlcyk7XG4gICAgaXNSZWFjdGl2ZSA9IHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gc3RvcmVzW25hbWVdO1xuICB9XG4gIHN0b3Jlc1tuYW1lXSA9IHZhbHVlO1xuICBpbml0SW50ZXJjZXB0b3JzKHN0b3Jlc1tuYW1lXSk7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoXCJpbml0XCIpICYmIHR5cGVvZiB2YWx1ZS5pbml0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBzdG9yZXNbbmFtZV0uaW5pdCgpO1xuICB9XG59XG5mdW5jdGlvbiBnZXRTdG9yZXMoKSB7XG4gIHJldHVybiBzdG9yZXM7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9iaW5kcy5qc1xudmFyIGJpbmRzID0ge307XG5mdW5jdGlvbiBiaW5kMihuYW1lLCBiaW5kaW5ncykge1xuICBsZXQgZ2V0QmluZGluZ3MgPSB0eXBlb2YgYmluZGluZ3MgIT09IFwiZnVuY3Rpb25cIiA/ICgpID0+IGJpbmRpbmdzIDogYmluZGluZ3M7XG4gIGlmIChuYW1lIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIHJldHVybiBhcHBseUJpbmRpbmdzT2JqZWN0KG5hbWUsIGdldEJpbmRpbmdzKCkpO1xuICB9IGVsc2Uge1xuICAgIGJpbmRzW25hbWVdID0gZ2V0QmluZGluZ3M7XG4gIH1cbiAgcmV0dXJuICgpID0+IHtcbiAgfTtcbn1cbmZ1bmN0aW9uIGluamVjdEJpbmRpbmdQcm92aWRlcnMob2JqKSB7XG4gIE9iamVjdC5lbnRyaWVzKGJpbmRzKS5mb3JFYWNoKChbbmFtZSwgY2FsbGJhY2tdKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuZnVuY3Rpb24gYXBwbHlCaW5kaW5nc09iamVjdChlbCwgb2JqLCBvcmlnaW5hbCkge1xuICBsZXQgY2xlYW51cFJ1bm5lcnMgPSBbXTtcbiAgd2hpbGUgKGNsZWFudXBSdW5uZXJzLmxlbmd0aClcbiAgICBjbGVhbnVwUnVubmVycy5wb3AoKSgpO1xuICBsZXQgYXR0cmlidXRlcyA9IE9iamVjdC5lbnRyaWVzKG9iaikubWFwKChbbmFtZSwgdmFsdWVdKSA9PiAoeyBuYW1lLCB2YWx1ZSB9KSk7XG4gIGxldCBzdGF0aWNBdHRyaWJ1dGVzID0gYXR0cmlidXRlc09ubHkoYXR0cmlidXRlcyk7XG4gIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7XG4gICAgaWYgKHN0YXRpY0F0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT4gYXR0ci5uYW1lID09PSBhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGB4LWJpbmQ6JHthdHRyaWJ1dGUubmFtZX1gLFxuICAgICAgICB2YWx1ZTogYFwiJHthdHRyaWJ1dGUudmFsdWV9XCJgXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlO1xuICB9KTtcbiAgZGlyZWN0aXZlcyhlbCwgYXR0cmlidXRlcywgb3JpZ2luYWwpLm1hcCgoaGFuZGxlKSA9PiB7XG4gICAgY2xlYW51cFJ1bm5lcnMucHVzaChoYW5kbGUucnVuQ2xlYW51cHMpO1xuICAgIGhhbmRsZSgpO1xuICB9KTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICB3aGlsZSAoY2xlYW51cFJ1bm5lcnMubGVuZ3RoKVxuICAgICAgY2xlYW51cFJ1bm5lcnMucG9wKCkoKTtcbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RhdGFzLmpzXG52YXIgZGF0YXMgPSB7fTtcbmZ1bmN0aW9uIGRhdGEobmFtZSwgY2FsbGJhY2spIHtcbiAgZGF0YXNbbmFtZV0gPSBjYWxsYmFjaztcbn1cbmZ1bmN0aW9uIGluamVjdERhdGFQcm92aWRlcnMob2JqLCBjb250ZXh0KSB7XG4gIE9iamVjdC5lbnRyaWVzKGRhdGFzKS5mb3JFYWNoKChbbmFtZSwgY2FsbGJhY2tdKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYmluZChjb250ZXh0KSguLi5hcmdzKTtcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2FscGluZS5qc1xudmFyIEFscGluZSA9IHtcbiAgZ2V0IHJlYWN0aXZlKCkge1xuICAgIHJldHVybiByZWFjdGl2ZTtcbiAgfSxcbiAgZ2V0IHJlbGVhc2UoKSB7XG4gICAgcmV0dXJuIHJlbGVhc2U7XG4gIH0sXG4gIGdldCBlZmZlY3QoKSB7XG4gICAgcmV0dXJuIGVmZmVjdDtcbiAgfSxcbiAgZ2V0IHJhdygpIHtcbiAgICByZXR1cm4gcmF3O1xuICB9LFxuICB2ZXJzaW9uOiBcIjMuMTQuOFwiLFxuICBmbHVzaEFuZFN0b3BEZWZlcnJpbmdNdXRhdGlvbnMsXG4gIGRvbnRBdXRvRXZhbHVhdGVGdW5jdGlvbnMsXG4gIGRpc2FibGVFZmZlY3RTY2hlZHVsaW5nLFxuICBzdGFydE9ic2VydmluZ011dGF0aW9ucyxcbiAgc3RvcE9ic2VydmluZ011dGF0aW9ucyxcbiAgc2V0UmVhY3Rpdml0eUVuZ2luZSxcbiAgb25BdHRyaWJ1dGVSZW1vdmVkLFxuICBvbkF0dHJpYnV0ZXNBZGRlZCxcbiAgY2xvc2VzdERhdGFTdGFjayxcbiAgc2tpcER1cmluZ0Nsb25lLFxuICBvbmx5RHVyaW5nQ2xvbmUsXG4gIGFkZFJvb3RTZWxlY3RvcixcbiAgYWRkSW5pdFNlbGVjdG9yLFxuICBpbnRlcmNlcHRDbG9uZSxcbiAgYWRkU2NvcGVUb05vZGUsXG4gIGRlZmVyTXV0YXRpb25zLFxuICBtYXBBdHRyaWJ1dGVzLFxuICBldmFsdWF0ZUxhdGVyLFxuICBpbnRlcmNlcHRJbml0LFxuICBzZXRFdmFsdWF0b3IsXG4gIG1lcmdlUHJveGllcyxcbiAgZXh0cmFjdFByb3AsXG4gIGZpbmRDbG9zZXN0LFxuICBvbkVsUmVtb3ZlZCxcbiAgY2xvc2VzdFJvb3QsXG4gIGRlc3Ryb3lUcmVlLFxuICBpbnRlcmNlcHRvcixcbiAgLy8gSU5URVJOQUw6IG5vdCBwdWJsaWMgQVBJIGFuZCBpcyBzdWJqZWN0IHRvIGNoYW5nZSB3aXRob3V0IG1ham9yIHJlbGVhc2UuXG4gIHRyYW5zaXRpb24sXG4gIC8vIElOVEVSTkFMXG4gIHNldFN0eWxlcyxcbiAgLy8gSU5URVJOQUxcbiAgbXV0YXRlRG9tLFxuICBkaXJlY3RpdmUsXG4gIGVudGFuZ2xlLFxuICB0aHJvdHRsZSxcbiAgZGVib3VuY2UsXG4gIGV2YWx1YXRlLFxuICBpbml0VHJlZSxcbiAgbmV4dFRpY2ssXG4gIHByZWZpeGVkOiBwcmVmaXgsXG4gIHByZWZpeDogc2V0UHJlZml4LFxuICBwbHVnaW4sXG4gIG1hZ2ljLFxuICBzdG9yZSxcbiAgc3RhcnQsXG4gIGNsb25lLFxuICAvLyBJTlRFUk5BTFxuICBjbG9uZU5vZGUsXG4gIC8vIElOVEVSTkFMXG4gIGJvdW5kOiBnZXRCaW5kaW5nLFxuICAkZGF0YTogc2NvcGUsXG4gIHdhdGNoLFxuICB3YWxrLFxuICBkYXRhLFxuICBiaW5kOiBiaW5kMlxufTtcbnZhciBhbHBpbmVfZGVmYXVsdCA9IEFscGluZTtcblxuLy8gbm9kZV9tb2R1bGVzL0B2dWUvc2hhcmVkL2Rpc3Qvc2hhcmVkLmVzbS1idW5kbGVyLmpzXG5mdW5jdGlvbiBtYWtlTWFwKHN0ciwgZXhwZWN0c0xvd2VyQ2FzZSkge1xuICBjb25zdCBtYXAgPSAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgY29uc3QgbGlzdCA9IHN0ci5zcGxpdChcIixcIik7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIG1hcFtsaXN0W2ldXSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGV4cGVjdHNMb3dlckNhc2UgPyAodmFsKSA9PiAhIW1hcFt2YWwudG9Mb3dlckNhc2UoKV0gOiAodmFsKSA9PiAhIW1hcFt2YWxdO1xufVxudmFyIHNwZWNpYWxCb29sZWFuQXR0cnMgPSBgaXRlbXNjb3BlLGFsbG93ZnVsbHNjcmVlbixmb3Jtbm92YWxpZGF0ZSxpc21hcCxub21vZHVsZSxub3ZhbGlkYXRlLHJlYWRvbmx5YDtcbnZhciBpc0Jvb2xlYW5BdHRyMiA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKHNwZWNpYWxCb29sZWFuQXR0cnMgKyBgLGFzeW5jLGF1dG9mb2N1cyxhdXRvcGxheSxjb250cm9scyxkZWZhdWx0LGRlZmVyLGRpc2FibGVkLGhpZGRlbixsb29wLG9wZW4scmVxdWlyZWQscmV2ZXJzZWQsc2NvcGVkLHNlYW1sZXNzLGNoZWNrZWQsbXV0ZWQsbXVsdGlwbGUsc2VsZWN0ZWRgKTtcbnZhciBFTVBUWV9PQkogPSB0cnVlID8gT2JqZWN0LmZyZWV6ZSh7fSkgOiB7fTtcbnZhciBFTVBUWV9BUlIgPSB0cnVlID8gT2JqZWN0LmZyZWV6ZShbXSkgOiBbXTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaGFzT3duID0gKHZhbCwga2V5KSA9PiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbCwga2V5KTtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbnZhciBpc01hcCA9ICh2YWwpID0+IHRvVHlwZVN0cmluZyh2YWwpID09PSBcIltvYmplY3QgTWFwXVwiO1xudmFyIGlzU3RyaW5nID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIjtcbnZhciBpc1N5bWJvbCA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwic3ltYm9sXCI7XG52YXIgaXNPYmplY3QgPSAodmFsKSA9PiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIjtcbnZhciBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgdG9UeXBlU3RyaW5nID0gKHZhbHVlKSA9PiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbnZhciB0b1Jhd1R5cGUgPSAodmFsdWUpID0+IHtcbiAgcmV0dXJuIHRvVHlwZVN0cmluZyh2YWx1ZSkuc2xpY2UoOCwgLTEpO1xufTtcbnZhciBpc0ludGVnZXJLZXkgPSAoa2V5KSA9PiBpc1N0cmluZyhrZXkpICYmIGtleSAhPT0gXCJOYU5cIiAmJiBrZXlbMF0gIT09IFwiLVwiICYmIFwiXCIgKyBwYXJzZUludChrZXksIDEwKSA9PT0ga2V5O1xudmFyIGNhY2hlU3RyaW5nRnVuY3Rpb24gPSAoZm4pID0+IHtcbiAgY29uc3QgY2FjaGUgPSAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgcmV0dXJuIChzdHIpID0+IHtcbiAgICBjb25zdCBoaXQgPSBjYWNoZVtzdHJdO1xuICAgIHJldHVybiBoaXQgfHwgKGNhY2hlW3N0cl0gPSBmbihzdHIpKTtcbiAgfTtcbn07XG52YXIgY2FtZWxpemVSRSA9IC8tKFxcdykvZztcbnZhciBjYW1lbGl6ZSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4ge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2FtZWxpemVSRSwgKF8sIGMpID0+IGMgPyBjLnRvVXBwZXJDYXNlKCkgOiBcIlwiKTtcbn0pO1xudmFyIGh5cGhlbmF0ZVJFID0gL1xcQihbQS1aXSkvZztcbnZhciBoeXBoZW5hdGUgPSBjYWNoZVN0cmluZ0Z1bmN0aW9uKChzdHIpID0+IHN0ci5yZXBsYWNlKGh5cGhlbmF0ZVJFLCBcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKTtcbnZhciBjYXBpdGFsaXplID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkpO1xudmFyIHRvSGFuZGxlcktleSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4gc3RyID8gYG9uJHtjYXBpdGFsaXplKHN0cil9YCA6IGBgKTtcbnZhciBoYXNDaGFuZ2VkID0gKHZhbHVlLCBvbGRWYWx1ZSkgPT4gdmFsdWUgIT09IG9sZFZhbHVlICYmICh2YWx1ZSA9PT0gdmFsdWUgfHwgb2xkVmFsdWUgPT09IG9sZFZhbHVlKTtcblxuLy8gbm9kZV9tb2R1bGVzL0B2dWUvcmVhY3Rpdml0eS9kaXN0L3JlYWN0aXZpdHkuZXNtLWJ1bmRsZXIuanNcbnZhciB0YXJnZXRNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBlZmZlY3RTdGFjayA9IFtdO1xudmFyIGFjdGl2ZUVmZmVjdDtcbnZhciBJVEVSQVRFX0tFWSA9IFN5bWJvbCh0cnVlID8gXCJpdGVyYXRlXCIgOiBcIlwiKTtcbnZhciBNQVBfS0VZX0lURVJBVEVfS0VZID0gU3ltYm9sKHRydWUgPyBcIk1hcCBrZXkgaXRlcmF0ZVwiIDogXCJcIik7XG5mdW5jdGlvbiBpc0VmZmVjdChmbikge1xuICByZXR1cm4gZm4gJiYgZm4uX2lzRWZmZWN0ID09PSB0cnVlO1xufVxuZnVuY3Rpb24gZWZmZWN0Mihmbiwgb3B0aW9ucyA9IEVNUFRZX09CSikge1xuICBpZiAoaXNFZmZlY3QoZm4pKSB7XG4gICAgZm4gPSBmbi5yYXc7XG4gIH1cbiAgY29uc3QgZWZmZWN0MyA9IGNyZWF0ZVJlYWN0aXZlRWZmZWN0KGZuLCBvcHRpb25zKTtcbiAgaWYgKCFvcHRpb25zLmxhenkpIHtcbiAgICBlZmZlY3QzKCk7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdDM7XG59XG5mdW5jdGlvbiBzdG9wKGVmZmVjdDMpIHtcbiAgaWYgKGVmZmVjdDMuYWN0aXZlKSB7XG4gICAgY2xlYW51cChlZmZlY3QzKTtcbiAgICBpZiAoZWZmZWN0My5vcHRpb25zLm9uU3RvcCkge1xuICAgICAgZWZmZWN0My5vcHRpb25zLm9uU3RvcCgpO1xuICAgIH1cbiAgICBlZmZlY3QzLmFjdGl2ZSA9IGZhbHNlO1xuICB9XG59XG52YXIgdWlkID0gMDtcbmZ1bmN0aW9uIGNyZWF0ZVJlYWN0aXZlRWZmZWN0KGZuLCBvcHRpb25zKSB7XG4gIGNvbnN0IGVmZmVjdDMgPSBmdW5jdGlvbiByZWFjdGl2ZUVmZmVjdCgpIHtcbiAgICBpZiAoIWVmZmVjdDMuYWN0aXZlKSB7XG4gICAgICByZXR1cm4gZm4oKTtcbiAgICB9XG4gICAgaWYgKCFlZmZlY3RTdGFjay5pbmNsdWRlcyhlZmZlY3QzKSkge1xuICAgICAgY2xlYW51cChlZmZlY3QzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVuYWJsZVRyYWNraW5nKCk7XG4gICAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0Myk7XG4gICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDM7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICAgICAgIHJlc2V0VHJhY2tpbmcoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV07XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBlZmZlY3QzLmlkID0gdWlkKys7XG4gIGVmZmVjdDMuYWxsb3dSZWN1cnNlID0gISFvcHRpb25zLmFsbG93UmVjdXJzZTtcbiAgZWZmZWN0My5faXNFZmZlY3QgPSB0cnVlO1xuICBlZmZlY3QzLmFjdGl2ZSA9IHRydWU7XG4gIGVmZmVjdDMucmF3ID0gZm47XG4gIGVmZmVjdDMuZGVwcyA9IFtdO1xuICBlZmZlY3QzLm9wdGlvbnMgPSBvcHRpb25zO1xuICByZXR1cm4gZWZmZWN0Mztcbn1cbmZ1bmN0aW9uIGNsZWFudXAoZWZmZWN0Mykge1xuICBjb25zdCB7IGRlcHMgfSA9IGVmZmVjdDM7XG4gIGlmIChkZXBzLmxlbmd0aCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgZGVwc1tpXS5kZWxldGUoZWZmZWN0Myk7XG4gICAgfVxuICAgIGRlcHMubGVuZ3RoID0gMDtcbiAgfVxufVxudmFyIHNob3VsZFRyYWNrID0gdHJ1ZTtcbnZhciB0cmFja1N0YWNrID0gW107XG5mdW5jdGlvbiBwYXVzZVRyYWNraW5nKCkge1xuICB0cmFja1N0YWNrLnB1c2goc2hvdWxkVHJhY2spO1xuICBzaG91bGRUcmFjayA9IGZhbHNlO1xufVxuZnVuY3Rpb24gZW5hYmxlVHJhY2tpbmcoKSB7XG4gIHRyYWNrU3RhY2sucHVzaChzaG91bGRUcmFjayk7XG4gIHNob3VsZFRyYWNrID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHJlc2V0VHJhY2tpbmcoKSB7XG4gIGNvbnN0IGxhc3QgPSB0cmFja1N0YWNrLnBvcCgpO1xuICBzaG91bGRUcmFjayA9IGxhc3QgPT09IHZvaWQgMCA/IHRydWUgOiBsYXN0O1xufVxuZnVuY3Rpb24gdHJhY2sodGFyZ2V0LCB0eXBlLCBrZXkpIHtcbiAgaWYgKCFzaG91bGRUcmFjayB8fCBhY3RpdmVFZmZlY3QgPT09IHZvaWQgMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgZGVwc01hcCA9IHRhcmdldE1hcC5nZXQodGFyZ2V0KTtcbiAgaWYgKCFkZXBzTWFwKSB7XG4gICAgdGFyZ2V0TWFwLnNldCh0YXJnZXQsIGRlcHNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKTtcbiAgfVxuICBsZXQgZGVwID0gZGVwc01hcC5nZXQoa2V5KTtcbiAgaWYgKCFkZXApIHtcbiAgICBkZXBzTWFwLnNldChrZXksIGRlcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuICB9XG4gIGlmICghZGVwLmhhcyhhY3RpdmVFZmZlY3QpKSB7XG4gICAgZGVwLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgIGFjdGl2ZUVmZmVjdC5kZXBzLnB1c2goZGVwKTtcbiAgICBpZiAoYWN0aXZlRWZmZWN0Lm9wdGlvbnMub25UcmFjaykge1xuICAgICAgYWN0aXZlRWZmZWN0Lm9wdGlvbnMub25UcmFjayh7XG4gICAgICAgIGVmZmVjdDogYWN0aXZlRWZmZWN0LFxuICAgICAgICB0YXJnZXQsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGtleVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiB0cmlnZ2VyKHRhcmdldCwgdHlwZSwga2V5LCBuZXdWYWx1ZSwgb2xkVmFsdWUsIG9sZFRhcmdldCkge1xuICBjb25zdCBkZXBzTWFwID0gdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xuICBpZiAoIWRlcHNNYXApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZWZmZWN0cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGNvbnN0IGFkZDIgPSAoZWZmZWN0c1RvQWRkKSA9PiB7XG4gICAgaWYgKGVmZmVjdHNUb0FkZCkge1xuICAgICAgZWZmZWN0c1RvQWRkLmZvckVhY2goKGVmZmVjdDMpID0+IHtcbiAgICAgICAgaWYgKGVmZmVjdDMgIT09IGFjdGl2ZUVmZmVjdCB8fCBlZmZlY3QzLmFsbG93UmVjdXJzZSkge1xuICAgICAgICAgIGVmZmVjdHMuYWRkKGVmZmVjdDMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIGlmICh0eXBlID09PSBcImNsZWFyXCIpIHtcbiAgICBkZXBzTWFwLmZvckVhY2goYWRkMik7XG4gIH0gZWxzZSBpZiAoa2V5ID09PSBcImxlbmd0aFwiICYmIGlzQXJyYXkodGFyZ2V0KSkge1xuICAgIGRlcHNNYXAuZm9yRWFjaCgoZGVwLCBrZXkyKSA9PiB7XG4gICAgICBpZiAoa2V5MiA9PT0gXCJsZW5ndGhcIiB8fCBrZXkyID49IG5ld1ZhbHVlKSB7XG4gICAgICAgIGFkZDIoZGVwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoa2V5ICE9PSB2b2lkIDApIHtcbiAgICAgIGFkZDIoZGVwc01hcC5nZXQoa2V5KSk7XG4gICAgfVxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcImFkZFwiOlxuICAgICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICBpZiAoaXNNYXAodGFyZ2V0KSkge1xuICAgICAgICAgICAgYWRkMihkZXBzTWFwLmdldChNQVBfS0VZX0lURVJBVEVfS0VZKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlzSW50ZWdlcktleShrZXkpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChcImxlbmd0aFwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZGVsZXRlXCI6XG4gICAgICAgIGlmICghaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChJVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIGlmIChpc01hcCh0YXJnZXQpKSB7XG4gICAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KE1BUF9LRVlfSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic2V0XCI6XG4gICAgICAgIGlmIChpc01hcCh0YXJnZXQpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChJVEVSQVRFX0tFWSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBjb25zdCBydW4gPSAoZWZmZWN0MykgPT4ge1xuICAgIGlmIChlZmZlY3QzLm9wdGlvbnMub25UcmlnZ2VyKSB7XG4gICAgICBlZmZlY3QzLm9wdGlvbnMub25UcmlnZ2VyKHtcbiAgICAgICAgZWZmZWN0OiBlZmZlY3QzLFxuICAgICAgICB0YXJnZXQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgbmV3VmFsdWUsXG4gICAgICAgIG9sZFZhbHVlLFxuICAgICAgICBvbGRUYXJnZXRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZWZmZWN0My5vcHRpb25zLnNjaGVkdWxlcikge1xuICAgICAgZWZmZWN0My5vcHRpb25zLnNjaGVkdWxlcihlZmZlY3QzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWZmZWN0MygpO1xuICAgIH1cbiAgfTtcbiAgZWZmZWN0cy5mb3JFYWNoKHJ1bik7XG59XG52YXIgaXNOb25UcmFja2FibGVLZXlzID0gLyogQF9fUFVSRV9fICovIG1ha2VNYXAoYF9fcHJvdG9fXyxfX3ZfaXNSZWYsX19pc1Z1ZWApO1xudmFyIGJ1aWx0SW5TeW1ib2xzID0gbmV3IFNldChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhTeW1ib2wpLm1hcCgoa2V5KSA9PiBTeW1ib2xba2V5XSkuZmlsdGVyKGlzU3ltYm9sKSk7XG52YXIgZ2V0MiA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVHZXR0ZXIoKTtcbnZhciByZWFkb25seUdldCA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVHZXR0ZXIodHJ1ZSk7XG52YXIgYXJyYXlJbnN0cnVtZW50YXRpb25zID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUFycmF5SW5zdHJ1bWVudGF0aW9ucygpO1xuZnVuY3Rpb24gY3JlYXRlQXJyYXlJbnN0cnVtZW50YXRpb25zKCkge1xuICBjb25zdCBpbnN0cnVtZW50YXRpb25zID0ge307XG4gIFtcImluY2x1ZGVzXCIsIFwiaW5kZXhPZlwiLCBcImxhc3RJbmRleE9mXCJdLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGluc3RydW1lbnRhdGlvbnNba2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgIGNvbnN0IGFyciA9IHRvUmF3KHRoaXMpO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0cmFjayhhcnIsIFwiZ2V0XCIsIGkgKyBcIlwiKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlcyA9IGFycltrZXldKC4uLmFyZ3MpO1xuICAgICAgaWYgKHJlcyA9PT0gLTEgfHwgcmVzID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gYXJyW2tleV0oLi4uYXJncy5tYXAodG9SYXcpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4gIFtcInB1c2hcIiwgXCJwb3BcIiwgXCJzaGlmdFwiLCBcInVuc2hpZnRcIiwgXCJzcGxpY2VcIl0uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaW5zdHJ1bWVudGF0aW9uc1trZXldID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgcGF1c2VUcmFja2luZygpO1xuICAgICAgY29uc3QgcmVzID0gdG9SYXcodGhpcylba2V5XS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIHJlc2V0VHJhY2tpbmcoKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBpbnN0cnVtZW50YXRpb25zO1xufVxuZnVuY3Rpb24gY3JlYXRlR2V0dGVyKGlzUmVhZG9ubHkgPSBmYWxzZSwgc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBnZXQzKHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgIGlmIChrZXkgPT09IFwiX192X2lzUmVhY3RpdmVcIikge1xuICAgICAgcmV0dXJuICFpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWRvbmx5XCIpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9yYXdcIiAmJiByZWNlaXZlciA9PT0gKGlzUmVhZG9ubHkgPyBzaGFsbG93ID8gc2hhbGxvd1JlYWRvbmx5TWFwIDogcmVhZG9ubHlNYXAgOiBzaGFsbG93ID8gc2hhbGxvd1JlYWN0aXZlTWFwIDogcmVhY3RpdmVNYXApLmdldCh0YXJnZXQpKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRJc0FycmF5ID0gaXNBcnJheSh0YXJnZXQpO1xuICAgIGlmICghaXNSZWFkb25seSAmJiB0YXJnZXRJc0FycmF5ICYmIGhhc093bihhcnJheUluc3RydW1lbnRhdGlvbnMsIGtleSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0LmdldChhcnJheUluc3RydW1lbnRhdGlvbnMsIGtleSwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgICBjb25zdCByZXMgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICAgIGlmIChpc1N5bWJvbChrZXkpID8gYnVpbHRJblN5bWJvbHMuaGFzKGtleSkgOiBpc05vblRyYWNrYWJsZUtleXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgaWYgKCFpc1JlYWRvbmx5KSB7XG4gICAgICB0cmFjayh0YXJnZXQsIFwiZ2V0XCIsIGtleSk7XG4gICAgfVxuICAgIGlmIChzaGFsbG93KSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBpZiAoaXNSZWYocmVzKSkge1xuICAgICAgY29uc3Qgc2hvdWxkVW53cmFwID0gIXRhcmdldElzQXJyYXkgfHwgIWlzSW50ZWdlcktleShrZXkpO1xuICAgICAgcmV0dXJuIHNob3VsZFVud3JhcCA/IHJlcy52YWx1ZSA6IHJlcztcbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0KHJlcykpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5ID8gcmVhZG9ubHkocmVzKSA6IHJlYWN0aXZlMihyZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9O1xufVxudmFyIHNldDIgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlU2V0dGVyKCk7XG5mdW5jdGlvbiBjcmVhdGVTZXR0ZXIoc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBzZXQzKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICBsZXQgb2xkVmFsdWUgPSB0YXJnZXRba2V5XTtcbiAgICBpZiAoIXNoYWxsb3cpIHtcbiAgICAgIHZhbHVlID0gdG9SYXcodmFsdWUpO1xuICAgICAgb2xkVmFsdWUgPSB0b1JhdyhvbGRWYWx1ZSk7XG4gICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSAmJiBpc1JlZihvbGRWYWx1ZSkgJiYgIWlzUmVmKHZhbHVlKSkge1xuICAgICAgICBvbGRWYWx1ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgaGFkS2V5ID0gaXNBcnJheSh0YXJnZXQpICYmIGlzSW50ZWdlcktleShrZXkpID8gTnVtYmVyKGtleSkgPCB0YXJnZXQubGVuZ3RoIDogaGFzT3duKHRhcmdldCwga2V5KTtcbiAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgICBpZiAodGFyZ2V0ID09PSB0b1JhdyhyZWNlaXZlcikpIHtcbiAgICAgIGlmICghaGFkS2V5KSB7XG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcImFkZFwiLCBrZXksIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2hhbmdlZCh2YWx1ZSwgb2xkVmFsdWUpKSB7XG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5mdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICBjb25zdCBoYWRLZXkgPSBoYXNPd24odGFyZ2V0LCBrZXkpO1xuICBjb25zdCBvbGRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KTtcbiAgaWYgKHJlc3VsdCAmJiBoYWRLZXkpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJkZWxldGVcIiwga2V5LCB2b2lkIDAsIG9sZFZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gaGFzKHRhcmdldCwga2V5KSB7XG4gIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuaGFzKHRhcmdldCwga2V5KTtcbiAgaWYgKCFpc1N5bWJvbChrZXkpIHx8ICFidWlsdEluU3ltYm9scy5oYXMoa2V5KSkge1xuICAgIHRyYWNrKHRhcmdldCwgXCJoYXNcIiwga2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gb3duS2V5cyh0YXJnZXQpIHtcbiAgdHJhY2sodGFyZ2V0LCBcIml0ZXJhdGVcIiwgaXNBcnJheSh0YXJnZXQpID8gXCJsZW5ndGhcIiA6IElURVJBVEVfS0VZKTtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xufVxudmFyIG11dGFibGVIYW5kbGVycyA9IHtcbiAgZ2V0OiBnZXQyLFxuICBzZXQ6IHNldDIsXG4gIGRlbGV0ZVByb3BlcnR5LFxuICBoYXMsXG4gIG93bktleXNcbn07XG52YXIgcmVhZG9ubHlIYW5kbGVycyA9IHtcbiAgZ2V0OiByZWFkb25seUdldCxcbiAgc2V0KHRhcmdldCwga2V5KSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgU2V0IG9wZXJhdGlvbiBvbiBrZXkgXCIke1N0cmluZyhrZXkpfVwiIGZhaWxlZDogdGFyZ2V0IGlzIHJlYWRvbmx5LmAsIHRhcmdldCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYERlbGV0ZSBvcGVyYXRpb24gb24ga2V5IFwiJHtTdHJpbmcoa2V5KX1cIiBmYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLCB0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbnZhciB0b1JlYWN0aXZlID0gKHZhbHVlKSA9PiBpc09iamVjdCh2YWx1ZSkgPyByZWFjdGl2ZTIodmFsdWUpIDogdmFsdWU7XG52YXIgdG9SZWFkb25seSA9ICh2YWx1ZSkgPT4gaXNPYmplY3QodmFsdWUpID8gcmVhZG9ubHkodmFsdWUpIDogdmFsdWU7XG52YXIgdG9TaGFsbG93ID0gKHZhbHVlKSA9PiB2YWx1ZTtcbnZhciBnZXRQcm90byA9ICh2KSA9PiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHYpO1xuZnVuY3Rpb24gZ2V0JDEodGFyZ2V0LCBrZXksIGlzUmVhZG9ubHkgPSBmYWxzZSwgaXNTaGFsbG93ID0gZmFsc2UpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0W1xuICAgIFwiX192X3Jhd1wiXG4gICAgLyogUkFXICovXG4gIF07XG4gIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XG4gIGlmIChrZXkgIT09IHJhd0tleSkge1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJnZXRcIiwga2V5KTtcbiAgfVxuICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiZ2V0XCIsIHJhd0tleSk7XG4gIGNvbnN0IHsgaGFzOiBoYXMyIH0gPSBnZXRQcm90byhyYXdUYXJnZXQpO1xuICBjb25zdCB3cmFwID0gaXNTaGFsbG93ID8gdG9TaGFsbG93IDogaXNSZWFkb25seSA/IHRvUmVhZG9ubHkgOiB0b1JlYWN0aXZlO1xuICBpZiAoaGFzMi5jYWxsKHJhd1RhcmdldCwga2V5KSkge1xuICAgIHJldHVybiB3cmFwKHRhcmdldC5nZXQoa2V5KSk7XG4gIH0gZWxzZSBpZiAoaGFzMi5jYWxsKHJhd1RhcmdldCwgcmF3S2V5KSkge1xuICAgIHJldHVybiB3cmFwKHRhcmdldC5nZXQocmF3S2V5KSk7XG4gIH0gZWxzZSBpZiAodGFyZ2V0ICE9PSByYXdUYXJnZXQpIHtcbiAgICB0YXJnZXQuZ2V0KGtleSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhcyQxKGtleSwgaXNSZWFkb25seSA9IGZhbHNlKSB7XG4gIGNvbnN0IHRhcmdldCA9IHRoaXNbXG4gICAgXCJfX3ZfcmF3XCJcbiAgICAvKiBSQVcgKi9cbiAgXTtcbiAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgY29uc3QgcmF3S2V5ID0gdG9SYXcoa2V5KTtcbiAgaWYgKGtleSAhPT0gcmF3S2V5KSB7XG4gICAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcImhhc1wiLCBrZXkpO1xuICB9XG4gICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJoYXNcIiwgcmF3S2V5KTtcbiAgcmV0dXJuIGtleSA9PT0gcmF3S2V5ID8gdGFyZ2V0LmhhcyhrZXkpIDogdGFyZ2V0LmhhcyhrZXkpIHx8IHRhcmdldC5oYXMocmF3S2V5KTtcbn1cbmZ1bmN0aW9uIHNpemUodGFyZ2V0LCBpc1JlYWRvbmx5ID0gZmFsc2UpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0W1xuICAgIFwiX192X3Jhd1wiXG4gICAgLyogUkFXICovXG4gIF07XG4gICFpc1JlYWRvbmx5ICYmIHRyYWNrKHRvUmF3KHRhcmdldCksIFwiaXRlcmF0ZVwiLCBJVEVSQVRFX0tFWSk7XG4gIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIFwic2l6ZVwiLCB0YXJnZXQpO1xufVxuZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gIHZhbHVlID0gdG9SYXcodmFsdWUpO1xuICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcbiAgY29uc3QgcHJvdG8gPSBnZXRQcm90byh0YXJnZXQpO1xuICBjb25zdCBoYWRLZXkgPSBwcm90by5oYXMuY2FsbCh0YXJnZXQsIHZhbHVlKTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICB0YXJnZXQuYWRkKHZhbHVlKTtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJhZGRcIiwgdmFsdWUsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbmZ1bmN0aW9uIHNldCQxKGtleSwgdmFsdWUpIHtcbiAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCB7IGhhczogaGFzMiwgZ2V0OiBnZXQzIH0gPSBnZXRQcm90byh0YXJnZXQpO1xuICBsZXQgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICBrZXkgPSB0b1JhdyhrZXkpO1xuICAgIGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIH0gZWxzZSBpZiAodHJ1ZSkge1xuICAgIGNoZWNrSWRlbnRpdHlLZXlzKHRhcmdldCwgaGFzMiwga2V5KTtcbiAgfVxuICBjb25zdCBvbGRWYWx1ZSA9IGdldDMuY2FsbCh0YXJnZXQsIGtleSk7XG4gIHRhcmdldC5zZXQoa2V5LCB2YWx1ZSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIsIGtleSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKGhhc0NoYW5nZWQodmFsdWUsIG9sZFZhbHVlKSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBkZWxldGVFbnRyeShrZXkpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IHsgaGFzOiBoYXMyLCBnZXQ6IGdldDMgfSA9IGdldFByb3RvKHRhcmdldCk7XG4gIGxldCBoYWRLZXkgPSBoYXMyLmNhbGwodGFyZ2V0LCBrZXkpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIGtleSA9IHRvUmF3KGtleSk7XG4gICAgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgfSBlbHNlIGlmICh0cnVlKSB7XG4gICAgY2hlY2tJZGVudGl0eUtleXModGFyZ2V0LCBoYXMyLCBrZXkpO1xuICB9XG4gIGNvbnN0IG9sZFZhbHVlID0gZ2V0MyA/IGdldDMuY2FsbCh0YXJnZXQsIGtleSkgOiB2b2lkIDA7XG4gIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5kZWxldGUoa2V5KTtcbiAgaWYgKGhhZEtleSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImRlbGV0ZVwiLCBrZXksIHZvaWQgMCwgb2xkVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IGhhZEl0ZW1zID0gdGFyZ2V0LnNpemUgIT09IDA7XG4gIGNvbnN0IG9sZFRhcmdldCA9IHRydWUgPyBpc01hcCh0YXJnZXQpID8gbmV3IE1hcCh0YXJnZXQpIDogbmV3IFNldCh0YXJnZXQpIDogdm9pZCAwO1xuICBjb25zdCByZXN1bHQgPSB0YXJnZXQuY2xlYXIoKTtcbiAgaWYgKGhhZEl0ZW1zKSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiY2xlYXJcIiwgdm9pZCAwLCB2b2lkIDAsIG9sZFRhcmdldCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUZvckVhY2goaXNSZWFkb25seSwgaXNTaGFsbG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgY29uc3Qgb2JzZXJ2ZWQgPSB0aGlzO1xuICAgIGNvbnN0IHRhcmdldCA9IG9ic2VydmVkW1xuICAgICAgXCJfX3ZfcmF3XCJcbiAgICAgIC8qIFJBVyAqL1xuICAgIF07XG4gICAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgICBjb25zdCB3cmFwID0gaXNTaGFsbG93ID8gdG9TaGFsbG93IDogaXNSZWFkb25seSA/IHRvUmVhZG9ubHkgOiB0b1JlYWN0aXZlO1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJpdGVyYXRlXCIsIElURVJBVEVfS0VZKTtcbiAgICByZXR1cm4gdGFyZ2V0LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHdyYXAodmFsdWUpLCB3cmFwKGtleSksIG9ic2VydmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgaXNSZWFkb25seSwgaXNTaGFsbG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpc1tcbiAgICAgIFwiX192X3Jhd1wiXG4gICAgICAvKiBSQVcgKi9cbiAgICBdO1xuICAgIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gICAgY29uc3QgdGFyZ2V0SXNNYXAgPSBpc01hcChyYXdUYXJnZXQpO1xuICAgIGNvbnN0IGlzUGFpciA9IG1ldGhvZCA9PT0gXCJlbnRyaWVzXCIgfHwgbWV0aG9kID09PSBTeW1ib2wuaXRlcmF0b3IgJiYgdGFyZ2V0SXNNYXA7XG4gICAgY29uc3QgaXNLZXlPbmx5ID0gbWV0aG9kID09PSBcImtleXNcIiAmJiB0YXJnZXRJc01hcDtcbiAgICBjb25zdCBpbm5lckl0ZXJhdG9yID0gdGFyZ2V0W21ldGhvZF0oLi4uYXJncyk7XG4gICAgY29uc3Qgd3JhcCA9IGlzU2hhbGxvdyA/IHRvU2hhbGxvdyA6IGlzUmVhZG9ubHkgPyB0b1JlYWRvbmx5IDogdG9SZWFjdGl2ZTtcbiAgICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiaXRlcmF0ZVwiLCBpc0tleU9ubHkgPyBNQVBfS0VZX0lURVJBVEVfS0VZIDogSVRFUkFURV9LRVkpO1xuICAgIHJldHVybiB7XG4gICAgICAvLyBpdGVyYXRvciBwcm90b2NvbFxuICAgICAgbmV4dCgpIHtcbiAgICAgICAgY29uc3QgeyB2YWx1ZSwgZG9uZSB9ID0gaW5uZXJJdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBkb25lID8geyB2YWx1ZSwgZG9uZSB9IDoge1xuICAgICAgICAgIHZhbHVlOiBpc1BhaXIgPyBbd3JhcCh2YWx1ZVswXSksIHdyYXAodmFsdWVbMV0pXSA6IHdyYXAodmFsdWUpLFxuICAgICAgICAgIGRvbmVcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICAvLyBpdGVyYWJsZSBwcm90b2NvbFxuICAgICAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVSZWFkb25seU1ldGhvZCh0eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZ3NbMF0gPyBgb24ga2V5IFwiJHthcmdzWzBdfVwiIGAgOiBgYDtcbiAgICAgIGNvbnNvbGUud2FybihgJHtjYXBpdGFsaXplKHR5cGUpfSBvcGVyYXRpb24gJHtrZXl9ZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCwgdG9SYXcodGhpcykpO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZSA9PT0gXCJkZWxldGVcIiA/IGZhbHNlIDogdGhpcztcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRhdGlvbnMoKSB7XG4gIGNvbnN0IG11dGFibGVJbnN0cnVtZW50YXRpb25zMiA9IHtcbiAgICBnZXQoa2V5KSB7XG4gICAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5KTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHNpemUodGhpcyk7XG4gICAgfSxcbiAgICBoYXM6IGhhcyQxLFxuICAgIGFkZCxcbiAgICBzZXQ6IHNldCQxLFxuICAgIGRlbGV0ZTogZGVsZXRlRW50cnksXG4gICAgY2xlYXIsXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaChmYWxzZSwgZmFsc2UpXG4gIH07XG4gIGNvbnN0IHNoYWxsb3dJbnN0cnVtZW50YXRpb25zMiA9IHtcbiAgICBnZXQoa2V5KSB7XG4gICAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5LCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiBzaXplKHRoaXMpO1xuICAgIH0sXG4gICAgaGFzOiBoYXMkMSxcbiAgICBhZGQsXG4gICAgc2V0OiBzZXQkMSxcbiAgICBkZWxldGU6IGRlbGV0ZUVudHJ5LFxuICAgIGNsZWFyLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2goZmFsc2UsIHRydWUpXG4gIH07XG4gIGNvbnN0IHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczIgPSB7XG4gICAgZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiBzaXplKHRoaXMsIHRydWUpO1xuICAgIH0sXG4gICAgaGFzKGtleSkge1xuICAgICAgcmV0dXJuIGhhcyQxLmNhbGwodGhpcywga2V5LCB0cnVlKTtcbiAgICB9LFxuICAgIGFkZDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImFkZFwiXG4gICAgICAvKiBBREQgKi9cbiAgICApLFxuICAgIHNldDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcInNldFwiXG4gICAgICAvKiBTRVQgKi9cbiAgICApLFxuICAgIGRlbGV0ZTogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImRlbGV0ZVwiXG4gICAgICAvKiBERUxFVEUgKi9cbiAgICApLFxuICAgIGNsZWFyOiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwiY2xlYXJcIlxuICAgICAgLyogQ0xFQVIgKi9cbiAgICApLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2godHJ1ZSwgZmFsc2UpXG4gIH07XG4gIGNvbnN0IHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMyID0ge1xuICAgIGdldChrZXkpIHtcbiAgICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXksIHRydWUsIHRydWUpO1xuICAgIH0sXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gc2l6ZSh0aGlzLCB0cnVlKTtcbiAgICB9LFxuICAgIGhhcyhrZXkpIHtcbiAgICAgIHJldHVybiBoYXMkMS5jYWxsKHRoaXMsIGtleSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBhZGQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJhZGRcIlxuICAgICAgLyogQUREICovXG4gICAgKSxcbiAgICBzZXQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJzZXRcIlxuICAgICAgLyogU0VUICovXG4gICAgKSxcbiAgICBkZWxldGU6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJkZWxldGVcIlxuICAgICAgLyogREVMRVRFICovXG4gICAgKSxcbiAgICBjbGVhcjogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImNsZWFyXCJcbiAgICAgIC8qIENMRUFSICovXG4gICAgKSxcbiAgICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKHRydWUsIHRydWUpXG4gIH07XG4gIGNvbnN0IGl0ZXJhdG9yTWV0aG9kcyA9IFtcImtleXNcIiwgXCJ2YWx1ZXNcIiwgXCJlbnRyaWVzXCIsIFN5bWJvbC5pdGVyYXRvcl07XG4gIGl0ZXJhdG9yTWV0aG9kcy5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICBtdXRhYmxlSW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgZmFsc2UsIGZhbHNlKTtcbiAgICByZWFkb25seUluc3RydW1lbnRhdGlvbnMyW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIHRydWUsIGZhbHNlKTtcbiAgICBzaGFsbG93SW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgZmFsc2UsIHRydWUpO1xuICAgIHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMyW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIHRydWUsIHRydWUpO1xuICB9KTtcbiAgcmV0dXJuIFtcbiAgICBtdXRhYmxlSW5zdHJ1bWVudGF0aW9uczIsXG4gICAgcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMixcbiAgICBzaGFsbG93SW5zdHJ1bWVudGF0aW9uczIsXG4gICAgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczJcbiAgXTtcbn1cbnZhciBbbXV0YWJsZUluc3RydW1lbnRhdGlvbnMsIHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9ucywgc2hhbGxvd0luc3RydW1lbnRhdGlvbnMsIHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnNdID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUluc3RydW1lbnRhdGlvbnMoKTtcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcihpc1JlYWRvbmx5LCBzaGFsbG93KSB7XG4gIGNvbnN0IGluc3RydW1lbnRhdGlvbnMgPSBzaGFsbG93ID8gaXNSZWFkb25seSA/IHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMgOiBzaGFsbG93SW5zdHJ1bWVudGF0aW9ucyA6IGlzUmVhZG9ubHkgPyByZWFkb25seUluc3RydW1lbnRhdGlvbnMgOiBtdXRhYmxlSW5zdHJ1bWVudGF0aW9ucztcbiAgcmV0dXJuICh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpID0+IHtcbiAgICBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWN0aXZlXCIpIHtcbiAgICAgIHJldHVybiAhaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFkb25seVwiKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfcmF3XCIpIHtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgIHJldHVybiBSZWZsZWN0LmdldChoYXNPd24oaW5zdHJ1bWVudGF0aW9ucywga2V5KSAmJiBrZXkgaW4gdGFyZ2V0ID8gaW5zdHJ1bWVudGF0aW9ucyA6IHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gIH07XG59XG52YXIgbXV0YWJsZUNvbGxlY3Rpb25IYW5kbGVycyA9IHtcbiAgZ2V0OiAvKiBAX19QVVJFX18gKi8gY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGZhbHNlLCBmYWxzZSlcbn07XG52YXIgcmVhZG9ubHlDb2xsZWN0aW9uSGFuZGxlcnMgPSB7XG4gIGdldDogLyogQF9fUFVSRV9fICovIGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcih0cnVlLCBmYWxzZSlcbn07XG5mdW5jdGlvbiBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhczIsIGtleSkge1xuICBjb25zdCByYXdLZXkgPSB0b1JhdyhrZXkpO1xuICBpZiAocmF3S2V5ICE9PSBrZXkgJiYgaGFzMi5jYWxsKHRhcmdldCwgcmF3S2V5KSkge1xuICAgIGNvbnN0IHR5cGUgPSB0b1Jhd1R5cGUodGFyZ2V0KTtcbiAgICBjb25zb2xlLndhcm4oYFJlYWN0aXZlICR7dHlwZX0gY29udGFpbnMgYm90aCB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiB0aGUgc2FtZSBvYmplY3Qke3R5cGUgPT09IGBNYXBgID8gYCBhcyBrZXlzYCA6IGBgfSwgd2hpY2ggY2FuIGxlYWQgdG8gaW5jb25zaXN0ZW5jaWVzLiBBdm9pZCBkaWZmZXJlbnRpYXRpbmcgYmV0d2VlbiB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiBhbiBvYmplY3QgYW5kIG9ubHkgdXNlIHRoZSByZWFjdGl2ZSB2ZXJzaW9uIGlmIHBvc3NpYmxlLmApO1xuICB9XG59XG52YXIgcmVhY3RpdmVNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzaGFsbG93UmVhY3RpdmVNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciByZWFkb25seU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHNoYWxsb3dSZWFkb25seU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gdGFyZ2V0VHlwZU1hcChyYXdUeXBlKSB7XG4gIHN3aXRjaCAocmF3VHlwZSkge1xuICAgIGNhc2UgXCJPYmplY3RcIjpcbiAgICBjYXNlIFwiQXJyYXlcIjpcbiAgICAgIHJldHVybiAxO1xuICAgIGNhc2UgXCJNYXBcIjpcbiAgICBjYXNlIFwiU2V0XCI6XG4gICAgY2FzZSBcIldlYWtNYXBcIjpcbiAgICBjYXNlIFwiV2Vha1NldFwiOlxuICAgICAgcmV0dXJuIDI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAwO1xuICB9XG59XG5mdW5jdGlvbiBnZXRUYXJnZXRUeXBlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZVtcbiAgICBcIl9fdl9za2lwXCJcbiAgICAvKiBTS0lQICovXG4gIF0gfHwgIU9iamVjdC5pc0V4dGVuc2libGUodmFsdWUpID8gMCA6IHRhcmdldFR5cGVNYXAodG9SYXdUeXBlKHZhbHVlKSk7XG59XG5mdW5jdGlvbiByZWFjdGl2ZTIodGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQgJiYgdGFyZ2V0W1xuICAgIFwiX192X2lzUmVhZG9ubHlcIlxuICAgIC8qIElTX1JFQURPTkxZICovXG4gIF0pIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIHJldHVybiBjcmVhdGVSZWFjdGl2ZU9iamVjdCh0YXJnZXQsIGZhbHNlLCBtdXRhYmxlSGFuZGxlcnMsIG11dGFibGVDb2xsZWN0aW9uSGFuZGxlcnMsIHJlYWN0aXZlTWFwKTtcbn1cbmZ1bmN0aW9uIHJlYWRvbmx5KHRhcmdldCkge1xuICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCB0cnVlLCByZWFkb25seUhhbmRsZXJzLCByZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycywgcmVhZG9ubHlNYXApO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCBpc1JlYWRvbmx5LCBiYXNlSGFuZGxlcnMsIGNvbGxlY3Rpb25IYW5kbGVycywgcHJveHlNYXApIHtcbiAgaWYgKCFpc09iamVjdCh0YXJnZXQpKSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgdmFsdWUgY2Fubm90IGJlIG1hZGUgcmVhY3RpdmU6ICR7U3RyaW5nKHRhcmdldCl9YCk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgaWYgKHRhcmdldFtcbiAgICBcIl9fdl9yYXdcIlxuICAgIC8qIFJBVyAqL1xuICBdICYmICEoaXNSZWFkb25seSAmJiB0YXJnZXRbXG4gICAgXCJfX3ZfaXNSZWFjdGl2ZVwiXG4gICAgLyogSVNfUkVBQ1RJVkUgKi9cbiAgXSkpIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIGNvbnN0IGV4aXN0aW5nUHJveHkgPSBwcm94eU1hcC5nZXQodGFyZ2V0KTtcbiAgaWYgKGV4aXN0aW5nUHJveHkpIHtcbiAgICByZXR1cm4gZXhpc3RpbmdQcm94eTtcbiAgfVxuICBjb25zdCB0YXJnZXRUeXBlID0gZ2V0VGFyZ2V0VHlwZSh0YXJnZXQpO1xuICBpZiAodGFyZ2V0VHlwZSA9PT0gMCkge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkodGFyZ2V0LCB0YXJnZXRUeXBlID09PSAyID8gY29sbGVjdGlvbkhhbmRsZXJzIDogYmFzZUhhbmRsZXJzKTtcbiAgcHJveHlNYXAuc2V0KHRhcmdldCwgcHJveHkpO1xuICByZXR1cm4gcHJveHk7XG59XG5mdW5jdGlvbiB0b1JhdyhvYnNlcnZlZCkge1xuICByZXR1cm4gb2JzZXJ2ZWQgJiYgdG9SYXcob2JzZXJ2ZWRbXG4gICAgXCJfX3ZfcmF3XCJcbiAgICAvKiBSQVcgKi9cbiAgXSkgfHwgb2JzZXJ2ZWQ7XG59XG5mdW5jdGlvbiBpc1JlZihyKSB7XG4gIHJldHVybiBCb29sZWFuKHIgJiYgci5fX3ZfaXNSZWYgPT09IHRydWUpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRuZXh0VGljay5qc1xubWFnaWMoXCJuZXh0VGlja1wiLCAoKSA9PiBuZXh0VGljayk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGRpc3BhdGNoLmpzXG5tYWdpYyhcImRpc3BhdGNoXCIsIChlbCkgPT4gZGlzcGF0Y2guYmluZChkaXNwYXRjaCwgZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kd2F0Y2guanNcbm1hZ2ljKFwid2F0Y2hcIiwgKGVsLCB7IGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiAoa2V5LCBjYWxsYmFjaykgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoa2V5KTtcbiAgbGV0IGdldHRlciA9ICgpID0+IHtcbiAgICBsZXQgdmFsdWU7XG4gICAgZXZhbHVhdGUyKChpKSA9PiB2YWx1ZSA9IGkpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbiAgbGV0IHVud2F0Y2ggPSB3YXRjaChnZXR0ZXIsIGNhbGxiYWNrKTtcbiAgY2xlYW51cDIodW53YXRjaCk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kc3RvcmUuanNcbm1hZ2ljKFwic3RvcmVcIiwgZ2V0U3RvcmVzKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kZGF0YS5qc1xubWFnaWMoXCJkYXRhXCIsIChlbCkgPT4gc2NvcGUoZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kcm9vdC5qc1xubWFnaWMoXCJyb290XCIsIChlbCkgPT4gY2xvc2VzdFJvb3QoZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kcmVmcy5qc1xubWFnaWMoXCJyZWZzXCIsIChlbCkgPT4ge1xuICBpZiAoZWwuX3hfcmVmc19wcm94eSlcbiAgICByZXR1cm4gZWwuX3hfcmVmc19wcm94eTtcbiAgZWwuX3hfcmVmc19wcm94eSA9IG1lcmdlUHJveGllcyhnZXRBcnJheU9mUmVmT2JqZWN0KGVsKSk7XG4gIHJldHVybiBlbC5feF9yZWZzX3Byb3h5O1xufSk7XG5mdW5jdGlvbiBnZXRBcnJheU9mUmVmT2JqZWN0KGVsKSB7XG4gIGxldCByZWZPYmplY3RzID0gW107XG4gIGZpbmRDbG9zZXN0KGVsLCAoaSkgPT4ge1xuICAgIGlmIChpLl94X3JlZnMpXG4gICAgICByZWZPYmplY3RzLnB1c2goaS5feF9yZWZzKTtcbiAgfSk7XG4gIHJldHVybiByZWZPYmplY3RzO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvaWRzLmpzXG52YXIgZ2xvYmFsSWRNZW1vID0ge307XG5mdW5jdGlvbiBmaW5kQW5kSW5jcmVtZW50SWQobmFtZSkge1xuICBpZiAoIWdsb2JhbElkTWVtb1tuYW1lXSlcbiAgICBnbG9iYWxJZE1lbW9bbmFtZV0gPSAwO1xuICByZXR1cm4gKytnbG9iYWxJZE1lbW9bbmFtZV07XG59XG5mdW5jdGlvbiBjbG9zZXN0SWRSb290KGVsLCBuYW1lKSB7XG4gIHJldHVybiBmaW5kQ2xvc2VzdChlbCwgKGVsZW1lbnQpID0+IHtcbiAgICBpZiAoZWxlbWVudC5feF9pZHMgJiYgZWxlbWVudC5feF9pZHNbbmFtZV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5mdW5jdGlvbiBzZXRJZFJvb3QoZWwsIG5hbWUpIHtcbiAgaWYgKCFlbC5feF9pZHMpXG4gICAgZWwuX3hfaWRzID0ge307XG4gIGlmICghZWwuX3hfaWRzW25hbWVdKVxuICAgIGVsLl94X2lkc1tuYW1lXSA9IGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kaWQuanNcbm1hZ2ljKFwiaWRcIiwgKGVsLCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IChuYW1lLCBrZXkgPSBudWxsKSA9PiB7XG4gIGxldCBjYWNoZUtleSA9IGAke25hbWV9JHtrZXkgPyBgLSR7a2V5fWAgOiBcIlwifWA7XG4gIHJldHVybiBjYWNoZUlkQnlOYW1lT25FbGVtZW50KGVsLCBjYWNoZUtleSwgY2xlYW51cDIsICgpID0+IHtcbiAgICBsZXQgcm9vdCA9IGNsb3Nlc3RJZFJvb3QoZWwsIG5hbWUpO1xuICAgIGxldCBpZCA9IHJvb3QgPyByb290Ll94X2lkc1tuYW1lXSA6IGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKTtcbiAgICByZXR1cm4ga2V5ID8gYCR7bmFtZX0tJHtpZH0tJHtrZXl9YCA6IGAke25hbWV9LSR7aWR9YDtcbiAgfSk7XG59KTtcbmludGVyY2VwdENsb25lKChmcm9tLCB0bykgPT4ge1xuICBpZiAoZnJvbS5feF9pZCkge1xuICAgIHRvLl94X2lkID0gZnJvbS5feF9pZDtcbiAgfVxufSk7XG5mdW5jdGlvbiBjYWNoZUlkQnlOYW1lT25FbGVtZW50KGVsLCBjYWNoZUtleSwgY2xlYW51cDIsIGNhbGxiYWNrKSB7XG4gIGlmICghZWwuX3hfaWQpXG4gICAgZWwuX3hfaWQgPSB7fTtcbiAgaWYgKGVsLl94X2lkW2NhY2hlS2V5XSlcbiAgICByZXR1cm4gZWwuX3hfaWRbY2FjaGVLZXldO1xuICBsZXQgb3V0cHV0ID0gY2FsbGJhY2soKTtcbiAgZWwuX3hfaWRbY2FjaGVLZXldID0gb3V0cHV0O1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgZGVsZXRlIGVsLl94X2lkW2NhY2hlS2V5XTtcbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGVsLmpzXG5tYWdpYyhcImVsXCIsIChlbCkgPT4gZWwpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzL2luZGV4LmpzXG53YXJuTWlzc2luZ1BsdWdpbk1hZ2ljKFwiRm9jdXNcIiwgXCJmb2N1c1wiLCBcImZvY3VzXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5NYWdpYyhcIlBlcnNpc3RcIiwgXCJwZXJzaXN0XCIsIFwicGVyc2lzdFwiKTtcbmZ1bmN0aW9uIHdhcm5NaXNzaW5nUGx1Z2luTWFnaWMobmFtZSwgbWFnaWNOYW1lLCBzbHVnKSB7XG4gIG1hZ2ljKG1hZ2ljTmFtZSwgKGVsKSA9PiB3YXJuKGBZb3UgY2FuJ3QgdXNlIFskJHttYWdpY05hbWV9XSB3aXRob3V0IGZpcnN0IGluc3RhbGxpbmcgdGhlIFwiJHtuYW1lfVwiIHBsdWdpbiBoZXJlOiBodHRwczovL2FscGluZWpzLmRldi9wbHVnaW5zLyR7c2x1Z31gLCBlbCkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LW1vZGVsYWJsZS5qc1xuZGlyZWN0aXZlKFwibW9kZWxhYmxlXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyMiwgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgZnVuYyA9IGV2YWx1YXRlTGF0ZXIyKGV4cHJlc3Npb24pO1xuICBsZXQgaW5uZXJHZXQgPSAoKSA9PiB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBmdW5jKChpKSA9PiByZXN1bHQgPSBpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBsZXQgZXZhbHVhdGVJbm5lclNldCA9IGV2YWx1YXRlTGF0ZXIyKGAke2V4cHJlc3Npb259ID0gX19wbGFjZWhvbGRlcmApO1xuICBsZXQgaW5uZXJTZXQgPSAodmFsKSA9PiBldmFsdWF0ZUlubmVyU2V0KCgpID0+IHtcbiAgfSwgeyBzY29wZTogeyBcIl9fcGxhY2Vob2xkZXJcIjogdmFsIH0gfSk7XG4gIGxldCBpbml0aWFsVmFsdWUgPSBpbm5lckdldCgpO1xuICBpbm5lclNldChpbml0aWFsVmFsdWUpO1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgaWYgKCFlbC5feF9tb2RlbClcbiAgICAgIHJldHVybjtcbiAgICBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0oKTtcbiAgICBsZXQgb3V0ZXJHZXQgPSBlbC5feF9tb2RlbC5nZXQ7XG4gICAgbGV0IG91dGVyU2V0ID0gZWwuX3hfbW9kZWwuc2V0O1xuICAgIGxldCByZWxlYXNlRW50YW5nbGVtZW50ID0gZW50YW5nbGUoXG4gICAgICB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gb3V0ZXJHZXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgb3V0ZXJTZXQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIGlubmVyR2V0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIGlubmVyU2V0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gICAgY2xlYW51cDIocmVsZWFzZUVudGFuZ2xlbWVudCk7XG4gIH0pO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtdGVsZXBvcnQuanNcbmRpcmVjdGl2ZShcInRlbGVwb3J0XCIsIChlbCwgeyBtb2RpZmllcnMsIGV4cHJlc3Npb24gfSwgeyBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwidGVtcGxhdGVcIilcbiAgICB3YXJuKFwieC10ZWxlcG9ydCBjYW4gb25seSBiZSB1c2VkIG9uIGEgPHRlbXBsYXRlPiB0YWdcIiwgZWwpO1xuICBsZXQgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGV4cHJlc3Npb24pO1xuICBsZXQgY2xvbmUyID0gZWwuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIGVsLl94X3RlbGVwb3J0ID0gY2xvbmUyO1xuICBjbG9uZTIuX3hfdGVsZXBvcnRCYWNrID0gZWw7XG4gIGVsLnNldEF0dHJpYnV0ZShcImRhdGEtdGVsZXBvcnQtdGVtcGxhdGVcIiwgdHJ1ZSk7XG4gIGNsb25lMi5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRlbGVwb3J0LXRhcmdldFwiLCB0cnVlKTtcbiAgaWYgKGVsLl94X2ZvcndhcmRFdmVudHMpIHtcbiAgICBlbC5feF9mb3J3YXJkRXZlbnRzLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgY2xvbmUyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBlLmNvbnN0cnVjdG9yKGUudHlwZSwgZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgYWRkU2NvcGVUb05vZGUoY2xvbmUyLCB7fSwgZWwpO1xuICBsZXQgcGxhY2VJbkRvbSA9IChjbG9uZTMsIHRhcmdldDIsIG1vZGlmaWVyczIpID0+IHtcbiAgICBpZiAobW9kaWZpZXJzMi5pbmNsdWRlcyhcInByZXBlbmRcIikpIHtcbiAgICAgIHRhcmdldDIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2xvbmUzLCB0YXJnZXQyKTtcbiAgICB9IGVsc2UgaWYgKG1vZGlmaWVyczIuaW5jbHVkZXMoXCJhcHBlbmRcIikpIHtcbiAgICAgIHRhcmdldDIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2xvbmUzLCB0YXJnZXQyLm5leHRTaWJsaW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0Mi5hcHBlbmRDaGlsZChjbG9uZTMpO1xuICAgIH1cbiAgfTtcbiAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICBwbGFjZUluRG9tKGNsb25lMiwgdGFyZ2V0LCBtb2RpZmllcnMpO1xuICAgIHNraXBEdXJpbmdDbG9uZSgoKSA9PiB7XG4gICAgICBpbml0VHJlZShjbG9uZTIpO1xuICAgIH0pKCk7XG4gIH0pO1xuICBlbC5feF90ZWxlcG9ydFB1dEJhY2sgPSAoKSA9PiB7XG4gICAgbGV0IHRhcmdldDIgPSBnZXRUYXJnZXQoZXhwcmVzc2lvbik7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIHBsYWNlSW5Eb20oZWwuX3hfdGVsZXBvcnQsIHRhcmdldDIsIG1vZGlmaWVycyk7XG4gICAgfSk7XG4gIH07XG4gIGNsZWFudXAyKFxuICAgICgpID0+IG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBjbG9uZTIucmVtb3ZlKCk7XG4gICAgICBkZXN0cm95VHJlZShjbG9uZTIpO1xuICAgIH0pXG4gICk7XG59KTtcbnZhciB0ZWxlcG9ydENvbnRhaW5lckR1cmluZ0Nsb25lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbmZ1bmN0aW9uIGdldFRhcmdldChleHByZXNzaW9uKSB7XG4gIGxldCB0YXJnZXQgPSBza2lwRHVyaW5nQ2xvbmUoKCkgPT4ge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGV4cHJlc3Npb24pO1xuICB9LCAoKSA9PiB7XG4gICAgcmV0dXJuIHRlbGVwb3J0Q29udGFpbmVyRHVyaW5nQ2xvbmU7XG4gIH0pKCk7XG4gIGlmICghdGFyZ2V0KVxuICAgIHdhcm4oYENhbm5vdCBmaW5kIHgtdGVsZXBvcnQgZWxlbWVudCBmb3Igc2VsZWN0b3I6IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaWdub3JlLmpzXG52YXIgaGFuZGxlciA9ICgpID0+IHtcbn07XG5oYW5kbGVyLmlubGluZSA9IChlbCwgeyBtb2RpZmllcnMgfSwgeyBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIG1vZGlmaWVycy5pbmNsdWRlcyhcInNlbGZcIikgPyBlbC5feF9pZ25vcmVTZWxmID0gdHJ1ZSA6IGVsLl94X2lnbm9yZSA9IHRydWU7XG4gIGNsZWFudXAyKCgpID0+IHtcbiAgICBtb2RpZmllcnMuaW5jbHVkZXMoXCJzZWxmXCIpID8gZGVsZXRlIGVsLl94X2lnbm9yZVNlbGYgOiBkZWxldGUgZWwuX3hfaWdub3JlO1xuICB9KTtcbn07XG5kaXJlY3RpdmUoXCJpZ25vcmVcIiwgaGFuZGxlcik7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtZWZmZWN0LmpzXG5kaXJlY3RpdmUoXCJlZmZlY3RcIiwgc2tpcER1cmluZ0Nsb25lKChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzIH0pID0+IHtcbiAgZWZmZWN0MyhldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSk7XG59KSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9vbi5qc1xuZnVuY3Rpb24gb24oZWwsIGV2ZW50LCBtb2RpZmllcnMsIGNhbGxiYWNrKSB7XG4gIGxldCBsaXN0ZW5lclRhcmdldCA9IGVsO1xuICBsZXQgaGFuZGxlcjQgPSAoZSkgPT4gY2FsbGJhY2soZSk7XG4gIGxldCBvcHRpb25zID0ge307XG4gIGxldCB3cmFwSGFuZGxlciA9IChjYWxsYmFjazIsIHdyYXBwZXIpID0+IChlKSA9PiB3cmFwcGVyKGNhbGxiYWNrMiwgZSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJkb3RcIikpXG4gICAgZXZlbnQgPSBkb3RTeW50YXgoZXZlbnQpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FtZWxcIikpXG4gICAgZXZlbnQgPSBjYW1lbENhc2UyKGV2ZW50KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInBhc3NpdmVcIikpXG4gICAgb3B0aW9ucy5wYXNzaXZlID0gdHJ1ZTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImNhcHR1cmVcIikpXG4gICAgb3B0aW9ucy5jYXB0dXJlID0gdHJ1ZTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIndpbmRvd1wiKSlcbiAgICBsaXN0ZW5lclRhcmdldCA9IHdpbmRvdztcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImRvY3VtZW50XCIpKVxuICAgIGxpc3RlbmVyVGFyZ2V0ID0gZG9jdW1lbnQ7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJkZWJvdW5jZVwiKSkge1xuICAgIGxldCBuZXh0TW9kaWZpZXIgPSBtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2YoXCJkZWJvdW5jZVwiKSArIDFdIHx8IFwiaW52YWxpZC13YWl0XCI7XG4gICAgbGV0IHdhaXQgPSBpc051bWVyaWMobmV4dE1vZGlmaWVyLnNwbGl0KFwibXNcIilbMF0pID8gTnVtYmVyKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA6IDI1MDtcbiAgICBoYW5kbGVyNCA9IGRlYm91bmNlKGhhbmRsZXI0LCB3YWl0KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwidGhyb3R0bGVcIikpIHtcbiAgICBsZXQgbmV4dE1vZGlmaWVyID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKFwidGhyb3R0bGVcIikgKyAxXSB8fCBcImludmFsaWQtd2FpdFwiO1xuICAgIGxldCB3YWl0ID0gaXNOdW1lcmljKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA/IE51bWJlcihuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgOiAyNTA7XG4gICAgaGFuZGxlcjQgPSB0aHJvdHRsZShoYW5kbGVyNCwgd2FpdCk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInByZXZlbnRcIikpXG4gICAgaGFuZGxlcjQgPSB3cmFwSGFuZGxlcihoYW5kbGVyNCwgKG5leHQsIGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJzdG9wXCIpKVxuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm9uY2VcIikpIHtcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgbmV4dChlKTtcbiAgICAgIGxpc3RlbmVyVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXI0LCBvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiYXdheVwiKSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRzaWRlXCIpKSB7XG4gICAgbGlzdGVuZXJUYXJnZXQgPSBkb2N1bWVudDtcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgaWYgKGVsLmNvbnRhaW5zKGUudGFyZ2V0KSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGUudGFyZ2V0LmlzQ29ubmVjdGVkID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGVsLm9mZnNldFdpZHRoIDwgMSAmJiBlbC5vZmZzZXRIZWlnaHQgPCAxKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZWwuX3hfaXNTaG93biA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybjtcbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInNlbGZcIikpXG4gICAgaGFuZGxlcjQgPSB3cmFwSGFuZGxlcihoYW5kbGVyNCwgKG5leHQsIGUpID0+IHtcbiAgICAgIGUudGFyZ2V0ID09PSBlbCAmJiBuZXh0KGUpO1xuICAgIH0pO1xuICBpZiAoaXNLZXlFdmVudChldmVudCkgfHwgaXNDbGlja0V2ZW50KGV2ZW50KSkge1xuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBpZiAoaXNMaXN0ZW5pbmdGb3JBU3BlY2lmaWNLZXlUaGF0SGFzbnRCZWVuUHJlc3NlZChlLCBtb2RpZmllcnMpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIH1cbiAgbGlzdGVuZXJUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcjQsIG9wdGlvbnMpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGxpc3RlbmVyVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXI0LCBvcHRpb25zKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGRvdFN5bnRheChzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnJlcGxhY2UoLy0vZywgXCIuXCIpO1xufVxuZnVuY3Rpb24gY2FtZWxDYXNlMihzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShcXHcpL2csIChtYXRjaCwgY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpKTtcbn1cbmZ1bmN0aW9uIGlzTnVtZXJpYyhzdWJqZWN0KSB7XG4gIHJldHVybiAhQXJyYXkuaXNBcnJheShzdWJqZWN0KSAmJiAhaXNOYU4oc3ViamVjdCk7XG59XG5mdW5jdGlvbiBrZWJhYkNhc2UyKHN1YmplY3QpIHtcbiAgaWYgKFtcIiBcIiwgXCJfXCJdLmluY2x1ZGVzKFxuICAgIHN1YmplY3RcbiAgKSlcbiAgICByZXR1cm4gc3ViamVjdDtcbiAgcmV0dXJuIHN1YmplY3QucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgXCIkMS0kMlwiKS5yZXBsYWNlKC9bX1xcc10vLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcbn1cbmZ1bmN0aW9uIGlzS2V5RXZlbnQoZXZlbnQpIHtcbiAgcmV0dXJuIFtcImtleWRvd25cIiwgXCJrZXl1cFwiXS5pbmNsdWRlcyhldmVudCk7XG59XG5mdW5jdGlvbiBpc0NsaWNrRXZlbnQoZXZlbnQpIHtcbiAgcmV0dXJuIFtcImNvbnRleHRtZW51XCIsIFwiY2xpY2tcIiwgXCJtb3VzZVwiXS5zb21lKChpKSA9PiBldmVudC5pbmNsdWRlcyhpKSk7XG59XG5mdW5jdGlvbiBpc0xpc3RlbmluZ0ZvckFTcGVjaWZpY0tleVRoYXRIYXNudEJlZW5QcmVzc2VkKGUsIG1vZGlmaWVycykge1xuICBsZXQga2V5TW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigoaSkgPT4ge1xuICAgIHJldHVybiAhW1wid2luZG93XCIsIFwiZG9jdW1lbnRcIiwgXCJwcmV2ZW50XCIsIFwic3RvcFwiLCBcIm9uY2VcIiwgXCJjYXB0dXJlXCIsIFwic2VsZlwiLCBcImF3YXlcIiwgXCJvdXRzaWRlXCIsIFwicGFzc2l2ZVwiXS5pbmNsdWRlcyhpKTtcbiAgfSk7XG4gIGlmIChrZXlNb2RpZmllcnMuaW5jbHVkZXMoXCJkZWJvdW5jZVwiKSkge1xuICAgIGxldCBkZWJvdW5jZUluZGV4ID0ga2V5TW9kaWZpZXJzLmluZGV4T2YoXCJkZWJvdW5jZVwiKTtcbiAgICBrZXlNb2RpZmllcnMuc3BsaWNlKGRlYm91bmNlSW5kZXgsIGlzTnVtZXJpYygoa2V5TW9kaWZpZXJzW2RlYm91bmNlSW5kZXggKyAxXSB8fCBcImludmFsaWQtd2FpdFwiKS5zcGxpdChcIm1zXCIpWzBdKSA/IDIgOiAxKTtcbiAgfVxuICBpZiAoa2V5TW9kaWZpZXJzLmluY2x1ZGVzKFwidGhyb3R0bGVcIikpIHtcbiAgICBsZXQgZGVib3VuY2VJbmRleCA9IGtleU1vZGlmaWVycy5pbmRleE9mKFwidGhyb3R0bGVcIik7XG4gICAga2V5TW9kaWZpZXJzLnNwbGljZShkZWJvdW5jZUluZGV4LCBpc051bWVyaWMoKGtleU1vZGlmaWVyc1tkZWJvdW5jZUluZGV4ICsgMV0gfHwgXCJpbnZhbGlkLXdhaXRcIikuc3BsaXQoXCJtc1wiKVswXSkgPyAyIDogMSk7XG4gIH1cbiAgaWYgKGtleU1vZGlmaWVycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoa2V5TW9kaWZpZXJzLmxlbmd0aCA9PT0gMSAmJiBrZXlUb01vZGlmaWVycyhlLmtleSkuaW5jbHVkZXMoa2V5TW9kaWZpZXJzWzBdKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHN5c3RlbUtleU1vZGlmaWVycyA9IFtcImN0cmxcIiwgXCJzaGlmdFwiLCBcImFsdFwiLCBcIm1ldGFcIiwgXCJjbWRcIiwgXCJzdXBlclwiXTtcbiAgY29uc3Qgc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMgPSBzeXN0ZW1LZXlNb2RpZmllcnMuZmlsdGVyKChtb2RpZmllcikgPT4ga2V5TW9kaWZpZXJzLmluY2x1ZGVzKG1vZGlmaWVyKSk7XG4gIGtleU1vZGlmaWVycyA9IGtleU1vZGlmaWVycy5maWx0ZXIoKGkpID0+ICFzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5pbmNsdWRlcyhpKSk7XG4gIGlmIChzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgYWN0aXZlbHlQcmVzc2VkS2V5TW9kaWZpZXJzID0gc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMuZmlsdGVyKChtb2RpZmllcikgPT4ge1xuICAgICAgaWYgKG1vZGlmaWVyID09PSBcImNtZFwiIHx8IG1vZGlmaWVyID09PSBcInN1cGVyXCIpXG4gICAgICAgIG1vZGlmaWVyID0gXCJtZXRhXCI7XG4gICAgICByZXR1cm4gZVtgJHttb2RpZmllcn1LZXlgXTtcbiAgICB9KTtcbiAgICBpZiAoYWN0aXZlbHlQcmVzc2VkS2V5TW9kaWZpZXJzLmxlbmd0aCA9PT0gc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMubGVuZ3RoKSB7XG4gICAgICBpZiAoaXNDbGlja0V2ZW50KGUudHlwZSkpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChrZXlUb01vZGlmaWVycyhlLmtleSkuaW5jbHVkZXMoa2V5TW9kaWZpZXJzWzBdKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGtleVRvTW9kaWZpZXJzKGtleSkge1xuICBpZiAoIWtleSlcbiAgICByZXR1cm4gW107XG4gIGtleSA9IGtlYmFiQ2FzZTIoa2V5KTtcbiAgbGV0IG1vZGlmaWVyVG9LZXlNYXAgPSB7XG4gICAgXCJjdHJsXCI6IFwiY29udHJvbFwiLFxuICAgIFwic2xhc2hcIjogXCIvXCIsXG4gICAgXCJzcGFjZVwiOiBcIiBcIixcbiAgICBcInNwYWNlYmFyXCI6IFwiIFwiLFxuICAgIFwiY21kXCI6IFwibWV0YVwiLFxuICAgIFwiZXNjXCI6IFwiZXNjYXBlXCIsXG4gICAgXCJ1cFwiOiBcImFycm93LXVwXCIsXG4gICAgXCJkb3duXCI6IFwiYXJyb3ctZG93blwiLFxuICAgIFwibGVmdFwiOiBcImFycm93LWxlZnRcIixcbiAgICBcInJpZ2h0XCI6IFwiYXJyb3ctcmlnaHRcIixcbiAgICBcInBlcmlvZFwiOiBcIi5cIixcbiAgICBcImNvbW1hXCI6IFwiLFwiLFxuICAgIFwiZXF1YWxcIjogXCI9XCIsXG4gICAgXCJtaW51c1wiOiBcIi1cIixcbiAgICBcInVuZGVyc2NvcmVcIjogXCJfXCJcbiAgfTtcbiAgbW9kaWZpZXJUb0tleU1hcFtrZXldID0ga2V5O1xuICByZXR1cm4gT2JqZWN0LmtleXMobW9kaWZpZXJUb0tleU1hcCkubWFwKChtb2RpZmllcikgPT4ge1xuICAgIGlmIChtb2RpZmllclRvS2V5TWFwW21vZGlmaWVyXSA9PT0ga2V5KVxuICAgICAgcmV0dXJuIG1vZGlmaWVyO1xuICB9KS5maWx0ZXIoKG1vZGlmaWVyKSA9PiBtb2RpZmllcik7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtbW9kZWwuanNcbmRpcmVjdGl2ZShcIm1vZGVsXCIsIChlbCwgeyBtb2RpZmllcnMsIGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgbGV0IHNjb3BlVGFyZ2V0ID0gZWw7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwYXJlbnRcIikpIHtcbiAgICBzY29wZVRhcmdldCA9IGVsLnBhcmVudE5vZGU7XG4gIH1cbiAgbGV0IGV2YWx1YXRlR2V0ID0gZXZhbHVhdGVMYXRlcihzY29wZVRhcmdldCwgZXhwcmVzc2lvbik7XG4gIGxldCBldmFsdWF0ZVNldDtcbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgZXZhbHVhdGVTZXQgPSBldmFsdWF0ZUxhdGVyKHNjb3BlVGFyZ2V0LCBgJHtleHByZXNzaW9ufSA9IF9fcGxhY2Vob2xkZXJgKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBleHByZXNzaW9uKCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICBldmFsdWF0ZVNldCA9IGV2YWx1YXRlTGF0ZXIoc2NvcGVUYXJnZXQsIGAke2V4cHJlc3Npb24oKX0gPSBfX3BsYWNlaG9sZGVyYCk7XG4gIH0gZWxzZSB7XG4gICAgZXZhbHVhdGVTZXQgPSAoKSA9PiB7XG4gICAgfTtcbiAgfVxuICBsZXQgZ2V0VmFsdWUgPSAoKSA9PiB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBldmFsdWF0ZUdldCgodmFsdWUpID0+IHJlc3VsdCA9IHZhbHVlKTtcbiAgICByZXR1cm4gaXNHZXR0ZXJTZXR0ZXIocmVzdWx0KSA/IHJlc3VsdC5nZXQoKSA6IHJlc3VsdDtcbiAgfTtcbiAgbGV0IHNldFZhbHVlID0gKHZhbHVlKSA9PiB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBldmFsdWF0ZUdldCgodmFsdWUyKSA9PiByZXN1bHQgPSB2YWx1ZTIpO1xuICAgIGlmIChpc0dldHRlclNldHRlcihyZXN1bHQpKSB7XG4gICAgICByZXN1bHQuc2V0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZhbHVhdGVTZXQoKCkgPT4ge1xuICAgICAgfSwge1xuICAgICAgICBzY29wZTogeyBcIl9fcGxhY2Vob2xkZXJcIjogdmFsdWUgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIgJiYgZWwudHlwZSA9PT0gXCJyYWRpb1wiKSB7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKFwibmFtZVwiKSlcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBleHByZXNzaW9uKTtcbiAgICB9KTtcbiAgfVxuICB2YXIgZXZlbnQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgfHwgW1wiY2hlY2tib3hcIiwgXCJyYWRpb1wiXS5pbmNsdWRlcyhlbC50eXBlKSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJsYXp5XCIpID8gXCJjaGFuZ2VcIiA6IFwiaW5wdXRcIjtcbiAgbGV0IHJlbW92ZUxpc3RlbmVyID0gaXNDbG9uaW5nID8gKCkgPT4ge1xuICB9IDogb24oZWwsIGV2ZW50LCBtb2RpZmllcnMsIChlKSA9PiB7XG4gICAgc2V0VmFsdWUoZ2V0SW5wdXRWYWx1ZShlbCwgbW9kaWZpZXJzLCBlLCBnZXRWYWx1ZSgpKSk7XG4gIH0pO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZmlsbFwiKSkge1xuICAgIGlmIChbdm9pZCAwLCBudWxsLCBcIlwiXS5pbmNsdWRlcyhnZXRWYWx1ZSgpKSB8fCBpc0NoZWNrYm94KGVsKSAmJiBBcnJheS5pc0FycmF5KGdldFZhbHVlKCkpIHx8IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIiAmJiBlbC5tdWx0aXBsZSkge1xuICAgICAgc2V0VmFsdWUoXG4gICAgICAgIGdldElucHV0VmFsdWUoZWwsIG1vZGlmaWVycywgeyB0YXJnZXQ6IGVsIH0sIGdldFZhbHVlKCkpXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBpZiAoIWVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzKVxuICAgIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzID0ge307XG4gIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzW1wiZGVmYXVsdFwiXSA9IHJlbW92ZUxpc3RlbmVyO1xuICBjbGVhbnVwMigoKSA9PiBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0oKSk7XG4gIGlmIChlbC5mb3JtKSB7XG4gICAgbGV0IHJlbW92ZVJlc2V0TGlzdGVuZXIgPSBvbihlbC5mb3JtLCBcInJlc2V0XCIsIFtdLCAoZSkgPT4ge1xuICAgICAgbmV4dFRpY2soKCkgPT4gZWwuX3hfbW9kZWwgJiYgZWwuX3hfbW9kZWwuc2V0KGdldElucHV0VmFsdWUoZWwsIG1vZGlmaWVycywgeyB0YXJnZXQ6IGVsIH0sIGdldFZhbHVlKCkpKSk7XG4gICAgfSk7XG4gICAgY2xlYW51cDIoKCkgPT4gcmVtb3ZlUmVzZXRMaXN0ZW5lcigpKTtcbiAgfVxuICBlbC5feF9tb2RlbCA9IHtcbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gZ2V0VmFsdWUoKTtcbiAgICB9LFxuICAgIHNldCh2YWx1ZSkge1xuICAgICAgc2V0VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgfTtcbiAgZWwuX3hfZm9yY2VNb2RlbFVwZGF0ZSA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwICYmIHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiICYmIGV4cHJlc3Npb24ubWF0Y2goL1xcLi8pKVxuICAgICAgdmFsdWUgPSBcIlwiO1xuICAgIHdpbmRvdy5mcm9tTW9kZWwgPSB0cnVlO1xuICAgIG11dGF0ZURvbSgoKSA9PiBiaW5kKGVsLCBcInZhbHVlXCIsIHZhbHVlKSk7XG4gICAgZGVsZXRlIHdpbmRvdy5mcm9tTW9kZWw7XG4gIH07XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKCk7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInVuaW50cnVzaXZlXCIpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShlbCkpXG4gICAgICByZXR1cm47XG4gICAgZWwuX3hfZm9yY2VNb2RlbFVwZGF0ZSh2YWx1ZSk7XG4gIH0pO1xufSk7XG5mdW5jdGlvbiBnZXRJbnB1dFZhbHVlKGVsLCBtb2RpZmllcnMsIGV2ZW50LCBjdXJyZW50VmFsdWUpIHtcbiAgcmV0dXJuIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQgJiYgZXZlbnQuZGV0YWlsICE9PSB2b2lkIDApXG4gICAgICByZXR1cm4gZXZlbnQuZGV0YWlsICE9PSBudWxsICYmIGV2ZW50LmRldGFpbCAhPT0gdm9pZCAwID8gZXZlbnQuZGV0YWlsIDogZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGVsc2UgaWYgKGlzQ2hlY2tib3goZWwpKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IHNhZmVQYXJzZU51bWJlcihldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImJvb2xlYW5cIikpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IHNhZmVQYXJzZUJvb2xlYW4oZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmNoZWNrZWQgPyBjdXJyZW50VmFsdWUuaW5jbHVkZXMobmV3VmFsdWUpID8gY3VycmVudFZhbHVlIDogY3VycmVudFZhbHVlLmNvbmNhdChbbmV3VmFsdWVdKSA6IGN1cnJlbnRWYWx1ZS5maWx0ZXIoKGVsMikgPT4gIWNoZWNrZWRBdHRyTG9vc2VDb21wYXJlMihlbDIsIG5ld1ZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgJiYgZWwubXVsdGlwbGUpIHtcbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucykubWFwKChvcHRpb24pID0+IHtcbiAgICAgICAgICBsZXQgcmF3VmFsdWUgPSBvcHRpb24udmFsdWUgfHwgb3B0aW9uLnRleHQ7XG4gICAgICAgICAgcmV0dXJuIHNhZmVQYXJzZU51bWJlcihyYXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJib29sZWFuXCIpKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGV2ZW50LnRhcmdldC5zZWxlY3RlZE9wdGlvbnMpLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHJhd1ZhbHVlID0gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgICAgIHJldHVybiBzYWZlUGFyc2VCb29sZWFuKHJhd1ZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShldmVudC50YXJnZXQuc2VsZWN0ZWRPcHRpb25zKS5tYXAoKG9wdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdWYWx1ZTtcbiAgICAgIGlmIChpc1JhZGlvKGVsKSkge1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwibnVtYmVyXCIpKSB7XG4gICAgICAgIHJldHVybiBzYWZlUGFyc2VOdW1iZXIobmV3VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJib29sZWFuXCIpKSB7XG4gICAgICAgIHJldHVybiBzYWZlUGFyc2VCb29sZWFuKG5ld1ZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwidHJpbVwiKSkge1xuICAgICAgICByZXR1cm4gbmV3VmFsdWUudHJpbSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBzYWZlUGFyc2VOdW1iZXIocmF3VmFsdWUpIHtcbiAgbGV0IG51bWJlciA9IHJhd1ZhbHVlID8gcGFyc2VGbG9hdChyYXdWYWx1ZSkgOiBudWxsO1xuICByZXR1cm4gaXNOdW1lcmljMihudW1iZXIpID8gbnVtYmVyIDogcmF3VmFsdWU7XG59XG5mdW5jdGlvbiBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZTIodmFsdWVBLCB2YWx1ZUIpIHtcbiAgcmV0dXJuIHZhbHVlQSA9PSB2YWx1ZUI7XG59XG5mdW5jdGlvbiBpc051bWVyaWMyKHN1YmplY3QpIHtcbiAgcmV0dXJuICFBcnJheS5pc0FycmF5KHN1YmplY3QpICYmICFpc05hTihzdWJqZWN0KTtcbn1cbmZ1bmN0aW9uIGlzR2V0dGVyU2V0dGVyKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlLmdldCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiB2YWx1ZS5zZXQgPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1jbG9hay5qc1xuZGlyZWN0aXZlKFwiY2xvYWtcIiwgKGVsKSA9PiBxdWV1ZU1pY3JvdGFzaygoKSA9PiBtdXRhdGVEb20oKCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKHByZWZpeChcImNsb2FrXCIpKSkpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pbml0LmpzXG5hZGRJbml0U2VsZWN0b3IoKCkgPT4gYFske3ByZWZpeChcImluaXRcIil9XWApO1xuZGlyZWN0aXZlKFwiaW5pdFwiLCBza2lwRHVyaW5nQ2xvbmUoKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBldmFsdWF0ZTogZXZhbHVhdGUyIH0pID0+IHtcbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuICEhZXhwcmVzc2lvbi50cmltKCkgJiYgZXZhbHVhdGUyKGV4cHJlc3Npb24sIHt9LCBmYWxzZSk7XG4gIH1cbiAgcmV0dXJuIGV2YWx1YXRlMihleHByZXNzaW9uLCB7fSwgZmFsc2UpO1xufSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXRleHQuanNcbmRpcmVjdGl2ZShcInRleHRcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyIH0pID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIyKGV4cHJlc3Npb24pO1xuICBlZmZlY3QzKCgpID0+IHtcbiAgICBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaHRtbC5qc1xuZGlyZWN0aXZlKFwiaHRtbFwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlcjIgfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoZXhwcmVzc2lvbik7XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICBlbC5feF9pZ25vcmVTZWxmID0gdHJ1ZTtcbiAgICAgICAgaW5pdFRyZWUoZWwpO1xuICAgICAgICBkZWxldGUgZWwuX3hfaWdub3JlU2VsZjtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWJpbmQuanNcbm1hcEF0dHJpYnV0ZXMoc3RhcnRpbmdXaXRoKFwiOlwiLCBpbnRvKHByZWZpeChcImJpbmQ6XCIpKSkpO1xudmFyIGhhbmRsZXIyID0gKGVsLCB7IHZhbHVlLCBtb2RpZmllcnMsIGV4cHJlc3Npb24sIG9yaWdpbmFsIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGlmICghdmFsdWUpIHtcbiAgICBsZXQgYmluZGluZ1Byb3ZpZGVycyA9IHt9O1xuICAgIGluamVjdEJpbmRpbmdQcm92aWRlcnMoYmluZGluZ1Byb3ZpZGVycyk7XG4gICAgbGV0IGdldEJpbmRpbmdzID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gICAgZ2V0QmluZGluZ3MoKGJpbmRpbmdzKSA9PiB7XG4gICAgICBhcHBseUJpbmRpbmdzT2JqZWN0KGVsLCBiaW5kaW5ncywgb3JpZ2luYWwpO1xuICAgIH0sIHsgc2NvcGU6IGJpbmRpbmdQcm92aWRlcnMgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gXCJrZXlcIilcbiAgICByZXR1cm4gc3RvcmVLZXlGb3JYRm9yKGVsLCBleHByZXNzaW9uKTtcbiAgaWYgKGVsLl94X2lubGluZUJpbmRpbmdzICYmIGVsLl94X2lubGluZUJpbmRpbmdzW3ZhbHVlXSAmJiBlbC5feF9pbmxpbmVCaW5kaW5nc1t2YWx1ZV0uZXh0cmFjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGVmZmVjdDMoKCkgPT4gZXZhbHVhdGUyKChyZXN1bHQpID0+IHtcbiAgICBpZiAocmVzdWx0ID09PSB2b2lkIDAgJiYgdHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIgJiYgZXhwcmVzc2lvbi5tYXRjaCgvXFwuLykpIHtcbiAgICAgIHJlc3VsdCA9IFwiXCI7XG4gICAgfVxuICAgIG11dGF0ZURvbSgoKSA9PiBiaW5kKGVsLCB2YWx1ZSwgcmVzdWx0LCBtb2RpZmllcnMpKTtcbiAgfSkpO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcyAmJiBlbC5feF91bmRvQWRkZWRDbGFzc2VzKCk7XG4gICAgZWwuX3hfdW5kb0FkZGVkU3R5bGVzICYmIGVsLl94X3VuZG9BZGRlZFN0eWxlcygpO1xuICB9KTtcbn07XG5oYW5kbGVyMi5pbmxpbmUgPSAoZWwsIHsgdmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiB9KSA9PiB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuO1xuICBpZiAoIWVsLl94X2lubGluZUJpbmRpbmdzKVxuICAgIGVsLl94X2lubGluZUJpbmRpbmdzID0ge307XG4gIGVsLl94X2lubGluZUJpbmRpbmdzW3ZhbHVlXSA9IHsgZXhwcmVzc2lvbiwgZXh0cmFjdDogZmFsc2UgfTtcbn07XG5kaXJlY3RpdmUoXCJiaW5kXCIsIGhhbmRsZXIyKTtcbmZ1bmN0aW9uIHN0b3JlS2V5Rm9yWEZvcihlbCwgZXhwcmVzc2lvbikge1xuICBlbC5feF9rZXlFeHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1kYXRhLmpzXG5hZGRSb290U2VsZWN0b3IoKCkgPT4gYFske3ByZWZpeChcImRhdGFcIil9XWApO1xuZGlyZWN0aXZlKFwiZGF0YVwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgaWYgKHNob3VsZFNraXBSZWdpc3RlcmluZ0RhdGFEdXJpbmdDbG9uZShlbCkpXG4gICAgcmV0dXJuO1xuICBleHByZXNzaW9uID0gZXhwcmVzc2lvbiA9PT0gXCJcIiA/IFwie31cIiA6IGV4cHJlc3Npb247XG4gIGxldCBtYWdpY0NvbnRleHQgPSB7fTtcbiAgaW5qZWN0TWFnaWNzKG1hZ2ljQ29udGV4dCwgZWwpO1xuICBsZXQgZGF0YVByb3ZpZGVyQ29udGV4dCA9IHt9O1xuICBpbmplY3REYXRhUHJvdmlkZXJzKGRhdGFQcm92aWRlckNvbnRleHQsIG1hZ2ljQ29udGV4dCk7XG4gIGxldCBkYXRhMiA9IGV2YWx1YXRlKGVsLCBleHByZXNzaW9uLCB7IHNjb3BlOiBkYXRhUHJvdmlkZXJDb250ZXh0IH0pO1xuICBpZiAoZGF0YTIgPT09IHZvaWQgMCB8fCBkYXRhMiA9PT0gdHJ1ZSlcbiAgICBkYXRhMiA9IHt9O1xuICBpbmplY3RNYWdpY3MoZGF0YTIsIGVsKTtcbiAgbGV0IHJlYWN0aXZlRGF0YSA9IHJlYWN0aXZlKGRhdGEyKTtcbiAgaW5pdEludGVyY2VwdG9ycyhyZWFjdGl2ZURhdGEpO1xuICBsZXQgdW5kbyA9IGFkZFNjb3BlVG9Ob2RlKGVsLCByZWFjdGl2ZURhdGEpO1xuICByZWFjdGl2ZURhdGFbXCJpbml0XCJdICYmIGV2YWx1YXRlKGVsLCByZWFjdGl2ZURhdGFbXCJpbml0XCJdKTtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIHJlYWN0aXZlRGF0YVtcImRlc3Ryb3lcIl0gJiYgZXZhbHVhdGUoZWwsIHJlYWN0aXZlRGF0YVtcImRlc3Ryb3lcIl0pO1xuICAgIHVuZG8oKTtcbiAgfSk7XG59KTtcbmludGVyY2VwdENsb25lKChmcm9tLCB0bykgPT4ge1xuICBpZiAoZnJvbS5feF9kYXRhU3RhY2spIHtcbiAgICB0by5feF9kYXRhU3RhY2sgPSBmcm9tLl94X2RhdGFTdGFjaztcbiAgICB0by5zZXRBdHRyaWJ1dGUoXCJkYXRhLWhhcy1hbHBpbmUtc3RhdGVcIiwgdHJ1ZSk7XG4gIH1cbn0pO1xuZnVuY3Rpb24gc2hvdWxkU2tpcFJlZ2lzdGVyaW5nRGF0YUR1cmluZ0Nsb25lKGVsKSB7XG4gIGlmICghaXNDbG9uaW5nKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGlzQ2xvbmluZ0xlZ2FjeSlcbiAgICByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZShcImRhdGEtaGFzLWFscGluZS1zdGF0ZVwiKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1zaG93LmpzXG5kaXJlY3RpdmUoXCJzaG93XCIsIChlbCwgeyBtb2RpZmllcnMsIGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMgfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGlmICghZWwuX3hfZG9IaWRlKVxuICAgIGVsLl94X2RvSGlkZSA9ICgpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KFwiZGlzcGxheVwiLCBcIm5vbmVcIiwgbW9kaWZpZXJzLmluY2x1ZGVzKFwiaW1wb3J0YW50XCIpID8gXCJpbXBvcnRhbnRcIiA6IHZvaWQgMCk7XG4gICAgICB9KTtcbiAgICB9O1xuICBpZiAoIWVsLl94X2RvU2hvdylcbiAgICBlbC5feF9kb1Nob3cgPSAoKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBpZiAoZWwuc3R5bGUubGVuZ3RoID09PSAxICYmIGVsLnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJkaXNwbGF5XCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICBsZXQgaGlkZSA9ICgpID0+IHtcbiAgICBlbC5feF9kb0hpZGUoKTtcbiAgICBlbC5feF9pc1Nob3duID0gZmFsc2U7XG4gIH07XG4gIGxldCBzaG93ID0gKCkgPT4ge1xuICAgIGVsLl94X2RvU2hvdygpO1xuICAgIGVsLl94X2lzU2hvd24gPSB0cnVlO1xuICB9O1xuICBsZXQgY2xpY2tBd2F5Q29tcGF0aWJsZVNob3cgPSAoKSA9PiBzZXRUaW1lb3V0KHNob3cpO1xuICBsZXQgdG9nZ2xlID0gb25jZShcbiAgICAodmFsdWUpID0+IHZhbHVlID8gc2hvdygpIDogaGlkZSgpLFxuICAgICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBlbC5feF90b2dnbGVBbmRDYXNjYWRlV2l0aFRyYW5zaXRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZWwuX3hfdG9nZ2xlQW5kQ2FzY2FkZVdpdGhUcmFuc2l0aW9ucyhlbCwgdmFsdWUsIHNob3csIGhpZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPyBjbGlja0F3YXlDb21wYXRpYmxlU2hvdygpIDogaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcbiAgbGV0IG9sZFZhbHVlO1xuICBsZXQgZmlyc3RUaW1lID0gdHJ1ZTtcbiAgZWZmZWN0MygoKSA9PiBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgaWYgKCFmaXJzdFRpbWUgJiYgdmFsdWUgPT09IG9sZFZhbHVlKVxuICAgICAgcmV0dXJuO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJpbW1lZGlhdGVcIikpXG4gICAgICB2YWx1ZSA/IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCkgOiBoaWRlKCk7XG4gICAgdG9nZ2xlKHZhbHVlKTtcbiAgICBvbGRWYWx1ZSA9IHZhbHVlO1xuICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICB9KSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1mb3IuanNcbmRpcmVjdGl2ZShcImZvclwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgaXRlcmF0b3JOYW1lcyA9IHBhcnNlRm9yRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgbGV0IGV2YWx1YXRlSXRlbXMgPSBldmFsdWF0ZUxhdGVyKGVsLCBpdGVyYXRvck5hbWVzLml0ZW1zKTtcbiAgbGV0IGV2YWx1YXRlS2V5ID0gZXZhbHVhdGVMYXRlcihcbiAgICBlbCxcbiAgICAvLyB0aGUgeC1iaW5kOmtleSBleHByZXNzaW9uIGlzIHN0b3JlZCBmb3Igb3VyIHVzZSBpbnN0ZWFkIG9mIGV2YWx1YXRlZC5cbiAgICBlbC5feF9rZXlFeHByZXNzaW9uIHx8IFwiaW5kZXhcIlxuICApO1xuICBlbC5feF9wcmV2S2V5cyA9IFtdO1xuICBlbC5feF9sb29rdXAgPSB7fTtcbiAgZWZmZWN0MygoKSA9PiBsb29wKGVsLCBpdGVyYXRvck5hbWVzLCBldmFsdWF0ZUl0ZW1zLCBldmFsdWF0ZUtleSkpO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgT2JqZWN0LnZhbHVlcyhlbC5feF9sb29rdXApLmZvckVhY2goKGVsMikgPT4gbXV0YXRlRG9tKFxuICAgICAgKCkgPT4ge1xuICAgICAgICBkZXN0cm95VHJlZShlbDIpO1xuICAgICAgICBlbDIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgKSk7XG4gICAgZGVsZXRlIGVsLl94X3ByZXZLZXlzO1xuICAgIGRlbGV0ZSBlbC5feF9sb29rdXA7XG4gIH0pO1xufSk7XG5mdW5jdGlvbiBsb29wKGVsLCBpdGVyYXRvck5hbWVzLCBldmFsdWF0ZUl0ZW1zLCBldmFsdWF0ZUtleSkge1xuICBsZXQgaXNPYmplY3QyID0gKGkpID0+IHR5cGVvZiBpID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KGkpO1xuICBsZXQgdGVtcGxhdGVFbCA9IGVsO1xuICBldmFsdWF0ZUl0ZW1zKChpdGVtcykgPT4ge1xuICAgIGlmIChpc051bWVyaWMzKGl0ZW1zKSAmJiBpdGVtcyA+PSAwKSB7XG4gICAgICBpdGVtcyA9IEFycmF5LmZyb20oQXJyYXkoaXRlbXMpLmtleXMoKSwgKGkpID0+IGkgKyAxKTtcbiAgICB9XG4gICAgaWYgKGl0ZW1zID09PSB2b2lkIDApXG4gICAgICBpdGVtcyA9IFtdO1xuICAgIGxldCBsb29rdXAgPSBlbC5feF9sb29rdXA7XG4gICAgbGV0IHByZXZLZXlzID0gZWwuX3hfcHJldktleXM7XG4gICAgbGV0IHNjb3BlcyA9IFtdO1xuICAgIGxldCBrZXlzID0gW107XG4gICAgaWYgKGlzT2JqZWN0MihpdGVtcykpIHtcbiAgICAgIGl0ZW1zID0gT2JqZWN0LmVudHJpZXMoaXRlbXMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGxldCBzY29wZTIgPSBnZXRJdGVyYXRpb25TY29wZVZhcmlhYmxlcyhpdGVyYXRvck5hbWVzLCB2YWx1ZSwga2V5LCBpdGVtcyk7XG4gICAgICAgIGV2YWx1YXRlS2V5KCh2YWx1ZTIpID0+IHtcbiAgICAgICAgICBpZiAoa2V5cy5pbmNsdWRlcyh2YWx1ZTIpKVxuICAgICAgICAgICAgd2FybihcIkR1cGxpY2F0ZSBrZXkgb24geC1mb3JcIiwgZWwpO1xuICAgICAgICAgIGtleXMucHVzaCh2YWx1ZTIpO1xuICAgICAgICB9LCB7IHNjb3BlOiB7IGluZGV4OiBrZXksIC4uLnNjb3BlMiB9IH0pO1xuICAgICAgICBzY29wZXMucHVzaChzY29wZTIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHNjb3BlMiA9IGdldEl0ZXJhdGlvblNjb3BlVmFyaWFibGVzKGl0ZXJhdG9yTmFtZXMsIGl0ZW1zW2ldLCBpLCBpdGVtcyk7XG4gICAgICAgIGV2YWx1YXRlS2V5KCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGlmIChrZXlzLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgICAgICAgIHdhcm4oXCJEdXBsaWNhdGUga2V5IG9uIHgtZm9yXCIsIGVsKTtcbiAgICAgICAgICBrZXlzLnB1c2godmFsdWUpO1xuICAgICAgICB9LCB7IHNjb3BlOiB7IGluZGV4OiBpLCAuLi5zY29wZTIgfSB9KTtcbiAgICAgICAgc2NvcGVzLnB1c2goc2NvcGUyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGFkZHMgPSBbXTtcbiAgICBsZXQgbW92ZXMgPSBbXTtcbiAgICBsZXQgcmVtb3ZlcyA9IFtdO1xuICAgIGxldCBzYW1lcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldktleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBwcmV2S2V5c1tpXTtcbiAgICAgIGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpXG4gICAgICAgIHJlbW92ZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBwcmV2S2V5cyA9IHByZXZLZXlzLmZpbHRlcigoa2V5KSA9PiAhcmVtb3Zlcy5pbmNsdWRlcyhrZXkpKTtcbiAgICBsZXQgbGFzdEtleSA9IFwidGVtcGxhdGVcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBrZXlzW2ldO1xuICAgICAgbGV0IHByZXZJbmRleCA9IHByZXZLZXlzLmluZGV4T2Yoa2V5KTtcbiAgICAgIGlmIChwcmV2SW5kZXggPT09IC0xKSB7XG4gICAgICAgIHByZXZLZXlzLnNwbGljZShpLCAwLCBrZXkpO1xuICAgICAgICBhZGRzLnB1c2goW2xhc3RLZXksIGldKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldkluZGV4ICE9PSBpKSB7XG4gICAgICAgIGxldCBrZXlJblNwb3QgPSBwcmV2S2V5cy5zcGxpY2UoaSwgMSlbMF07XG4gICAgICAgIGxldCBrZXlGb3JTcG90ID0gcHJldktleXMuc3BsaWNlKHByZXZJbmRleCAtIDEsIDEpWzBdO1xuICAgICAgICBwcmV2S2V5cy5zcGxpY2UoaSwgMCwga2V5Rm9yU3BvdCk7XG4gICAgICAgIHByZXZLZXlzLnNwbGljZShwcmV2SW5kZXgsIDAsIGtleUluU3BvdCk7XG4gICAgICAgIG1vdmVzLnB1c2goW2tleUluU3BvdCwga2V5Rm9yU3BvdF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2FtZXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgICAgbGFzdEtleSA9IGtleTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0gcmVtb3Zlc1tpXTtcbiAgICAgIGlmICghKGtleSBpbiBsb29rdXApKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGRlc3Ryb3lUcmVlKGxvb2t1cFtrZXldKTtcbiAgICAgICAgbG9va3VwW2tleV0ucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSBsb29rdXBba2V5XTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IFtrZXlJblNwb3QsIGtleUZvclNwb3RdID0gbW92ZXNbaV07XG4gICAgICBsZXQgZWxJblNwb3QgPSBsb29rdXBba2V5SW5TcG90XTtcbiAgICAgIGxldCBlbEZvclNwb3QgPSBsb29rdXBba2V5Rm9yU3BvdF07XG4gICAgICBsZXQgbWFya2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGlmICghZWxGb3JTcG90KVxuICAgICAgICAgIHdhcm4oYHgtZm9yIFwiOmtleVwiIGlzIHVuZGVmaW5lZCBvciBpbnZhbGlkYCwgdGVtcGxhdGVFbCwga2V5Rm9yU3BvdCwgbG9va3VwKTtcbiAgICAgICAgZWxGb3JTcG90LmFmdGVyKG1hcmtlcik7XG4gICAgICAgIGVsSW5TcG90LmFmdGVyKGVsRm9yU3BvdCk7XG4gICAgICAgIGVsRm9yU3BvdC5feF9jdXJyZW50SWZFbCAmJiBlbEZvclNwb3QuYWZ0ZXIoZWxGb3JTcG90Ll94X2N1cnJlbnRJZkVsKTtcbiAgICAgICAgbWFya2VyLmJlZm9yZShlbEluU3BvdCk7XG4gICAgICAgIGVsSW5TcG90Ll94X2N1cnJlbnRJZkVsICYmIGVsSW5TcG90LmFmdGVyKGVsSW5TcG90Ll94X2N1cnJlbnRJZkVsKTtcbiAgICAgICAgbWFya2VyLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgICBlbEZvclNwb3QuX3hfcmVmcmVzaFhGb3JTY29wZShzY29wZXNba2V5cy5pbmRleE9mKGtleUZvclNwb3QpXSk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IFtsYXN0S2V5MiwgaW5kZXhdID0gYWRkc1tpXTtcbiAgICAgIGxldCBsYXN0RWwgPSBsYXN0S2V5MiA9PT0gXCJ0ZW1wbGF0ZVwiID8gdGVtcGxhdGVFbCA6IGxvb2t1cFtsYXN0S2V5Ml07XG4gICAgICBpZiAobGFzdEVsLl94X2N1cnJlbnRJZkVsKVxuICAgICAgICBsYXN0RWwgPSBsYXN0RWwuX3hfY3VycmVudElmRWw7XG4gICAgICBsZXQgc2NvcGUyID0gc2NvcGVzW2luZGV4XTtcbiAgICAgIGxldCBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgIGxldCBjbG9uZTIgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlRWwuY29udGVudCwgdHJ1ZSkuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICBsZXQgcmVhY3RpdmVTY29wZSA9IHJlYWN0aXZlKHNjb3BlMik7XG4gICAgICBhZGRTY29wZVRvTm9kZShjbG9uZTIsIHJlYWN0aXZlU2NvcGUsIHRlbXBsYXRlRWwpO1xuICAgICAgY2xvbmUyLl94X3JlZnJlc2hYRm9yU2NvcGUgPSAobmV3U2NvcGUpID0+IHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMobmV3U2NvcGUpLmZvckVhY2goKFtrZXkyLCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICByZWFjdGl2ZVNjb3BlW2tleTJdID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGxhc3RFbC5hZnRlcihjbG9uZTIpO1xuICAgICAgICBza2lwRHVyaW5nQ2xvbmUoKCkgPT4gaW5pdFRyZWUoY2xvbmUyKSkoKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgd2FybihcIngtZm9yIGtleSBjYW5ub3QgYmUgYW4gb2JqZWN0LCBpdCBtdXN0IGJlIGEgc3RyaW5nIG9yIGFuIGludGVnZXJcIiwgdGVtcGxhdGVFbCk7XG4gICAgICB9XG4gICAgICBsb29rdXBba2V5XSA9IGNsb25lMjtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgbG9va3VwW3NhbWVzW2ldXS5feF9yZWZyZXNoWEZvclNjb3BlKHNjb3Blc1trZXlzLmluZGV4T2Yoc2FtZXNbaV0pXSk7XG4gICAgfVxuICAgIHRlbXBsYXRlRWwuX3hfcHJldktleXMgPSBrZXlzO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHBhcnNlRm9yRXhwcmVzc2lvbihleHByZXNzaW9uKSB7XG4gIGxldCBmb3JJdGVyYXRvclJFID0gLywoW14sXFx9XFxdXSopKD86LChbXixcXH1cXF1dKikpPyQvO1xuICBsZXQgc3RyaXBQYXJlbnNSRSA9IC9eXFxzKlxcKHxcXClcXHMqJC9nO1xuICBsZXQgZm9yQWxpYXNSRSA9IC8oW1xcc1xcU10qPylcXHMrKD86aW58b2YpXFxzKyhbXFxzXFxTXSopLztcbiAgbGV0IGluTWF0Y2ggPSBleHByZXNzaW9uLm1hdGNoKGZvckFsaWFzUkUpO1xuICBpZiAoIWluTWF0Y2gpXG4gICAgcmV0dXJuO1xuICBsZXQgcmVzID0ge307XG4gIHJlcy5pdGVtcyA9IGluTWF0Y2hbMl0udHJpbSgpO1xuICBsZXQgaXRlbSA9IGluTWF0Y2hbMV0ucmVwbGFjZShzdHJpcFBhcmVuc1JFLCBcIlwiKS50cmltKCk7XG4gIGxldCBpdGVyYXRvck1hdGNoID0gaXRlbS5tYXRjaChmb3JJdGVyYXRvclJFKTtcbiAgaWYgKGl0ZXJhdG9yTWF0Y2gpIHtcbiAgICByZXMuaXRlbSA9IGl0ZW0ucmVwbGFjZShmb3JJdGVyYXRvclJFLCBcIlwiKS50cmltKCk7XG4gICAgcmVzLmluZGV4ID0gaXRlcmF0b3JNYXRjaFsxXS50cmltKCk7XG4gICAgaWYgKGl0ZXJhdG9yTWF0Y2hbMl0pIHtcbiAgICAgIHJlcy5jb2xsZWN0aW9uID0gaXRlcmF0b3JNYXRjaFsyXS50cmltKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcy5pdGVtID0gaXRlbTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuZnVuY3Rpb24gZ2V0SXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMoaXRlcmF0b3JOYW1lcywgaXRlbSwgaW5kZXgsIGl0ZW1zKSB7XG4gIGxldCBzY29wZVZhcmlhYmxlcyA9IHt9O1xuICBpZiAoL15cXFsuKlxcXSQvLnRlc3QoaXRlcmF0b3JOYW1lcy5pdGVtKSAmJiBBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgbGV0IG5hbWVzID0gaXRlcmF0b3JOYW1lcy5pdGVtLnJlcGxhY2UoXCJbXCIsIFwiXCIpLnJlcGxhY2UoXCJdXCIsIFwiXCIpLnNwbGl0KFwiLFwiKS5tYXAoKGkpID0+IGkudHJpbSgpKTtcbiAgICBuYW1lcy5mb3JFYWNoKChuYW1lLCBpKSA9PiB7XG4gICAgICBzY29wZVZhcmlhYmxlc1tuYW1lXSA9IGl0ZW1baV07XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoL15cXHsuKlxcfSQvLnRlc3QoaXRlcmF0b3JOYW1lcy5pdGVtKSAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIikge1xuICAgIGxldCBuYW1lcyA9IGl0ZXJhdG9yTmFtZXMuaXRlbS5yZXBsYWNlKFwie1wiLCBcIlwiKS5yZXBsYWNlKFwifVwiLCBcIlwiKS5zcGxpdChcIixcIikubWFwKChpKSA9PiBpLnRyaW0oKSk7XG4gICAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgc2NvcGVWYXJpYWJsZXNbbmFtZV0gPSBpdGVtW25hbWVdO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHNjb3BlVmFyaWFibGVzW2l0ZXJhdG9yTmFtZXMuaXRlbV0gPSBpdGVtO1xuICB9XG4gIGlmIChpdGVyYXRvck5hbWVzLmluZGV4KVxuICAgIHNjb3BlVmFyaWFibGVzW2l0ZXJhdG9yTmFtZXMuaW5kZXhdID0gaW5kZXg7XG4gIGlmIChpdGVyYXRvck5hbWVzLmNvbGxlY3Rpb24pXG4gICAgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5jb2xsZWN0aW9uXSA9IGl0ZW1zO1xuICByZXR1cm4gc2NvcGVWYXJpYWJsZXM7XG59XG5mdW5jdGlvbiBpc051bWVyaWMzKHN1YmplY3QpIHtcbiAgcmV0dXJuICFBcnJheS5pc0FycmF5KHN1YmplY3QpICYmICFpc05hTihzdWJqZWN0KTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1yZWYuanNcbmZ1bmN0aW9uIGhhbmRsZXIzKCkge1xufVxuaGFuZGxlcjMuaW5saW5lID0gKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGxldCByb290ID0gY2xvc2VzdFJvb3QoZWwpO1xuICBpZiAoIXJvb3QuX3hfcmVmcylcbiAgICByb290Ll94X3JlZnMgPSB7fTtcbiAgcm9vdC5feF9yZWZzW2V4cHJlc3Npb25dID0gZWw7XG4gIGNsZWFudXAyKCgpID0+IGRlbGV0ZSByb290Ll94X3JlZnNbZXhwcmVzc2lvbl0pO1xufTtcbmRpcmVjdGl2ZShcInJlZlwiLCBoYW5kbGVyMyk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaWYuanNcbmRpcmVjdGl2ZShcImlmXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwidGVtcGxhdGVcIilcbiAgICB3YXJuKFwieC1pZiBjYW4gb25seSBiZSB1c2VkIG9uIGEgPHRlbXBsYXRlPiB0YWdcIiwgZWwpO1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGxldCBzaG93ID0gKCkgPT4ge1xuICAgIGlmIChlbC5feF9jdXJyZW50SWZFbClcbiAgICAgIHJldHVybiBlbC5feF9jdXJyZW50SWZFbDtcbiAgICBsZXQgY2xvbmUyID0gZWwuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgYWRkU2NvcGVUb05vZGUoY2xvbmUyLCB7fSwgZWwpO1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBlbC5hZnRlcihjbG9uZTIpO1xuICAgICAgc2tpcER1cmluZ0Nsb25lKCgpID0+IGluaXRUcmVlKGNsb25lMikpKCk7XG4gICAgfSk7XG4gICAgZWwuX3hfY3VycmVudElmRWwgPSBjbG9uZTI7XG4gICAgZWwuX3hfdW5kb0lmID0gKCkgPT4ge1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZGVzdHJveVRyZWUoY2xvbmUyKTtcbiAgICAgICAgY2xvbmUyLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgICBkZWxldGUgZWwuX3hfY3VycmVudElmRWw7XG4gICAgfTtcbiAgICByZXR1cm4gY2xvbmUyO1xuICB9O1xuICBsZXQgaGlkZSA9ICgpID0+IHtcbiAgICBpZiAoIWVsLl94X3VuZG9JZilcbiAgICAgIHJldHVybjtcbiAgICBlbC5feF91bmRvSWYoKTtcbiAgICBkZWxldGUgZWwuX3hfdW5kb0lmO1xuICB9O1xuICBlZmZlY3QzKCgpID0+IGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICB2YWx1ZSA/IHNob3coKSA6IGhpZGUoKTtcbiAgfSkpO1xuICBjbGVhbnVwMigoKSA9PiBlbC5feF91bmRvSWYgJiYgZWwuX3hfdW5kb0lmKCkpO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaWQuanNcbmRpcmVjdGl2ZShcImlkXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZXZhbHVhdGU6IGV2YWx1YXRlMiB9KSA9PiB7XG4gIGxldCBuYW1lcyA9IGV2YWx1YXRlMihleHByZXNzaW9uKTtcbiAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4gc2V0SWRSb290KGVsLCBuYW1lKSk7XG59KTtcbmludGVyY2VwdENsb25lKChmcm9tLCB0bykgPT4ge1xuICBpZiAoZnJvbS5feF9pZHMpIHtcbiAgICB0by5feF9pZHMgPSBmcm9tLl94X2lkcztcbiAgfVxufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtb24uanNcbm1hcEF0dHJpYnV0ZXMoc3RhcnRpbmdXaXRoKFwiQFwiLCBpbnRvKHByZWZpeChcIm9uOlwiKSkpKTtcbmRpcmVjdGl2ZShcIm9uXCIsIHNraXBEdXJpbmdDbG9uZSgoZWwsIHsgdmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiB9LCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV4cHJlc3Npb24gPyBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSA6ICgpID0+IHtcbiAgfTtcbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0ZW1wbGF0ZVwiKSB7XG4gICAgaWYgKCFlbC5feF9mb3J3YXJkRXZlbnRzKVxuICAgICAgZWwuX3hfZm9yd2FyZEV2ZW50cyA9IFtdO1xuICAgIGlmICghZWwuX3hfZm9yd2FyZEV2ZW50cy5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICBlbC5feF9mb3J3YXJkRXZlbnRzLnB1c2godmFsdWUpO1xuICB9XG4gIGxldCByZW1vdmVMaXN0ZW5lciA9IG9uKGVsLCB2YWx1ZSwgbW9kaWZpZXJzLCAoZSkgPT4ge1xuICAgIGV2YWx1YXRlMigoKSA9PiB7XG4gICAgfSwgeyBzY29wZTogeyBcIiRldmVudFwiOiBlIH0sIHBhcmFtczogW2VdIH0pO1xuICB9KTtcbiAgY2xlYW51cDIoKCkgPT4gcmVtb3ZlTGlzdGVuZXIoKSk7XG59KSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL2luZGV4LmpzXG53YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShcIkNvbGxhcHNlXCIsIFwiY29sbGFwc2VcIiwgXCJjb2xsYXBzZVwiKTtcbndhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKFwiSW50ZXJzZWN0XCIsIFwiaW50ZXJzZWN0XCIsIFwiaW50ZXJzZWN0XCIpO1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJGb2N1c1wiLCBcInRyYXBcIiwgXCJmb2N1c1wiKTtcbndhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKFwiTWFza1wiLCBcIm1hc2tcIiwgXCJtYXNrXCIpO1xuZnVuY3Rpb24gd2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUobmFtZSwgZGlyZWN0aXZlTmFtZSwgc2x1Zykge1xuICBkaXJlY3RpdmUoZGlyZWN0aXZlTmFtZSwgKGVsKSA9PiB3YXJuKGBZb3UgY2FuJ3QgdXNlIFt4LSR7ZGlyZWN0aXZlTmFtZX1dIHdpdGhvdXQgZmlyc3QgaW5zdGFsbGluZyB0aGUgXCIke25hbWV9XCIgcGx1Z2luIGhlcmU6IGh0dHBzOi8vYWxwaW5lanMuZGV2L3BsdWdpbnMvJHtzbHVnfWAsIGVsKSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9pbmRleC5qc1xuYWxwaW5lX2RlZmF1bHQuc2V0RXZhbHVhdG9yKG5vcm1hbEV2YWx1YXRvcik7XG5hbHBpbmVfZGVmYXVsdC5zZXRSZWFjdGl2aXR5RW5naW5lKHsgcmVhY3RpdmU6IHJlYWN0aXZlMiwgZWZmZWN0OiBlZmZlY3QyLCByZWxlYXNlOiBzdG9wLCByYXc6IHRvUmF3IH0pO1xudmFyIHNyY19kZWZhdWx0ID0gYWxwaW5lX2RlZmF1bHQ7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL2J1aWxkcy9tb2R1bGUuanNcbnZhciBtb2R1bGVfZGVmYXVsdCA9IHNyY19kZWZhdWx0O1xuZXhwb3J0IHtcbiAgc3JjX2RlZmF1bHQgYXMgQWxwaW5lLFxuICBtb2R1bGVfZGVmYXVsdCBhcyBkZWZhdWx0XG59O1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8wX19fIGZyb20gXCItIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGhlbWVzLmNzc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMV9fXyBmcm9tIFwiLSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2ZvbnRzLmNzc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMl9fXyBmcm9tIFwiLSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3RleHRzLmNzc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfM19fXyBmcm9tIFwiLSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2lucHV0cy5jc3NcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLmkoX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8wX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLmkoX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8xX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLmkoX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8yX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLmkoX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8zX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKiwgOjpiZWZvcmUsIDo6YWZ0ZXIge1xuICAtLXR3LWJvcmRlci1zcGFjaW5nLXg6IDA7XG4gIC0tdHctYm9yZGVyLXNwYWNpbmcteTogMDtcbiAgLS10dy10cmFuc2xhdGUteDogMDtcbiAgLS10dy10cmFuc2xhdGUteTogMDtcbiAgLS10dy1yb3RhdGU6IDA7XG4gIC0tdHctc2tldy14OiAwO1xuICAtLXR3LXNrZXcteTogMDtcbiAgLS10dy1zY2FsZS14OiAxO1xuICAtLXR3LXNjYWxlLXk6IDE7XG4gIC0tdHctcGFuLXg6ICA7XG4gIC0tdHctcGFuLXk6ICA7XG4gIC0tdHctcGluY2gtem9vbTogIDtcbiAgLS10dy1zY3JvbGwtc25hcC1zdHJpY3RuZXNzOiBwcm94aW1pdHk7XG4gIC0tdHctZ3JhZGllbnQtZnJvbS1wb3NpdGlvbjogIDtcbiAgLS10dy1ncmFkaWVudC12aWEtcG9zaXRpb246ICA7XG4gIC0tdHctZ3JhZGllbnQtdG8tcG9zaXRpb246ICA7XG4gIC0tdHctb3JkaW5hbDogIDtcbiAgLS10dy1zbGFzaGVkLXplcm86ICA7XG4gIC0tdHctbnVtZXJpYy1maWd1cmU6ICA7XG4gIC0tdHctbnVtZXJpYy1zcGFjaW5nOiAgO1xuICAtLXR3LW51bWVyaWMtZnJhY3Rpb246ICA7XG4gIC0tdHctcmluZy1pbnNldDogIDtcbiAgLS10dy1yaW5nLW9mZnNldC13aWR0aDogMHB4O1xuICAtLXR3LXJpbmctb2Zmc2V0LWNvbG9yOiAjZmZmO1xuICAtLXR3LXJpbmctY29sb3I6IHJnYig1OSAxMzAgMjQ2IC8gMC41KTtcbiAgLS10dy1yaW5nLW9mZnNldC1zaGFkb3c6IDAgMCAjMDAwMDtcbiAgLS10dy1yaW5nLXNoYWRvdzogMCAwICMwMDAwO1xuICAtLXR3LXNoYWRvdzogMCAwICMwMDAwO1xuICAtLXR3LXNoYWRvdy1jb2xvcmVkOiAwIDAgIzAwMDA7XG4gIC0tdHctYmx1cjogIDtcbiAgLS10dy1icmlnaHRuZXNzOiAgO1xuICAtLXR3LWNvbnRyYXN0OiAgO1xuICAtLXR3LWdyYXlzY2FsZTogIDtcbiAgLS10dy1odWUtcm90YXRlOiAgO1xuICAtLXR3LWludmVydDogIDtcbiAgLS10dy1zYXR1cmF0ZTogIDtcbiAgLS10dy1zZXBpYTogIDtcbiAgLS10dy1kcm9wLXNoYWRvdzogIDtcbiAgLS10dy1iYWNrZHJvcC1ibHVyOiAgO1xuICAtLXR3LWJhY2tkcm9wLWJyaWdodG5lc3M6ICA7XG4gIC0tdHctYmFja2Ryb3AtY29udHJhc3Q6ICA7XG4gIC0tdHctYmFja2Ryb3AtZ3JheXNjYWxlOiAgO1xuICAtLXR3LWJhY2tkcm9wLWh1ZS1yb3RhdGU6ICA7XG4gIC0tdHctYmFja2Ryb3AtaW52ZXJ0OiAgO1xuICAtLXR3LWJhY2tkcm9wLW9wYWNpdHk6ICA7XG4gIC0tdHctYmFja2Ryb3Atc2F0dXJhdGU6ICA7XG4gIC0tdHctYmFja2Ryb3Atc2VwaWE6ICA7XG4gIC0tdHctY29udGFpbi1zaXplOiAgO1xuICAtLXR3LWNvbnRhaW4tbGF5b3V0OiAgO1xuICAtLXR3LWNvbnRhaW4tcGFpbnQ6ICA7XG4gIC0tdHctY29udGFpbi1zdHlsZTogIDtcbn1cblxuOjpiYWNrZHJvcCB7XG4gIC0tdHctYm9yZGVyLXNwYWNpbmcteDogMDtcbiAgLS10dy1ib3JkZXItc3BhY2luZy15OiAwO1xuICAtLXR3LXRyYW5zbGF0ZS14OiAwO1xuICAtLXR3LXRyYW5zbGF0ZS15OiAwO1xuICAtLXR3LXJvdGF0ZTogMDtcbiAgLS10dy1za2V3LXg6IDA7XG4gIC0tdHctc2tldy15OiAwO1xuICAtLXR3LXNjYWxlLXg6IDE7XG4gIC0tdHctc2NhbGUteTogMTtcbiAgLS10dy1wYW4teDogIDtcbiAgLS10dy1wYW4teTogIDtcbiAgLS10dy1waW5jaC16b29tOiAgO1xuICAtLXR3LXNjcm9sbC1zbmFwLXN0cmljdG5lc3M6IHByb3hpbWl0eTtcbiAgLS10dy1ncmFkaWVudC1mcm9tLXBvc2l0aW9uOiAgO1xuICAtLXR3LWdyYWRpZW50LXZpYS1wb3NpdGlvbjogIDtcbiAgLS10dy1ncmFkaWVudC10by1wb3NpdGlvbjogIDtcbiAgLS10dy1vcmRpbmFsOiAgO1xuICAtLXR3LXNsYXNoZWQtemVybzogIDtcbiAgLS10dy1udW1lcmljLWZpZ3VyZTogIDtcbiAgLS10dy1udW1lcmljLXNwYWNpbmc6ICA7XG4gIC0tdHctbnVtZXJpYy1mcmFjdGlvbjogIDtcbiAgLS10dy1yaW5nLWluc2V0OiAgO1xuICAtLXR3LXJpbmctb2Zmc2V0LXdpZHRoOiAwcHg7XG4gIC0tdHctcmluZy1vZmZzZXQtY29sb3I6ICNmZmY7XG4gIC0tdHctcmluZy1jb2xvcjogcmdiKDU5IDEzMCAyNDYgLyAwLjUpO1xuICAtLXR3LXJpbmctb2Zmc2V0LXNoYWRvdzogMCAwICMwMDAwO1xuICAtLXR3LXJpbmctc2hhZG93OiAwIDAgIzAwMDA7XG4gIC0tdHctc2hhZG93OiAwIDAgIzAwMDA7XG4gIC0tdHctc2hhZG93LWNvbG9yZWQ6IDAgMCAjMDAwMDtcbiAgLS10dy1ibHVyOiAgO1xuICAtLXR3LWJyaWdodG5lc3M6ICA7XG4gIC0tdHctY29udHJhc3Q6ICA7XG4gIC0tdHctZ3JheXNjYWxlOiAgO1xuICAtLXR3LWh1ZS1yb3RhdGU6ICA7XG4gIC0tdHctaW52ZXJ0OiAgO1xuICAtLXR3LXNhdHVyYXRlOiAgO1xuICAtLXR3LXNlcGlhOiAgO1xuICAtLXR3LWRyb3Atc2hhZG93OiAgO1xuICAtLXR3LWJhY2tkcm9wLWJsdXI6ICA7XG4gIC0tdHctYmFja2Ryb3AtYnJpZ2h0bmVzczogIDtcbiAgLS10dy1iYWNrZHJvcC1jb250cmFzdDogIDtcbiAgLS10dy1iYWNrZHJvcC1ncmF5c2NhbGU6ICA7XG4gIC0tdHctYmFja2Ryb3AtaHVlLXJvdGF0ZTogIDtcbiAgLS10dy1iYWNrZHJvcC1pbnZlcnQ6ICA7XG4gIC0tdHctYmFja2Ryb3Atb3BhY2l0eTogIDtcbiAgLS10dy1iYWNrZHJvcC1zYXR1cmF0ZTogIDtcbiAgLS10dy1iYWNrZHJvcC1zZXBpYTogIDtcbiAgLS10dy1jb250YWluLXNpemU6ICA7XG4gIC0tdHctY29udGFpbi1sYXlvdXQ6ICA7XG4gIC0tdHctY29udGFpbi1wYWludDogIDtcbiAgLS10dy1jb250YWluLXN0eWxlOiAgO1xufS8qXG4hIHRhaWx3aW5kY3NzIHYzLjQuMTcgfCBNSVQgTGljZW5zZSB8IGh0dHBzOi8vdGFpbHdpbmRjc3MuY29tXG4qLy8qXG4xLiBQcmV2ZW50IHBhZGRpbmcgYW5kIGJvcmRlciBmcm9tIGFmZmVjdGluZyBlbGVtZW50IHdpZHRoLiAoaHR0cHM6Ly9naXRodWIuY29tL21vemRldnMvY3NzcmVtZWR5L2lzc3Vlcy80KVxuMi4gQWxsb3cgYWRkaW5nIGEgYm9yZGVyIHRvIGFuIGVsZW1lbnQgYnkganVzdCBhZGRpbmcgYSBib3JkZXItd2lkdGguIChodHRwczovL2dpdGh1Yi5jb20vdGFpbHdpbmRjc3MvdGFpbHdpbmRjc3MvcHVsbC8xMTYpXG4qL1xuXG4qLFxuOjpiZWZvcmUsXG46OmFmdGVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBib3JkZXItd2lkdGg6IDA7IC8qIDIgKi9cbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDsgLyogMiAqL1xuICBib3JkZXItY29sb3I6ICNlNWU3ZWI7IC8qIDIgKi9cbn1cblxuOjpiZWZvcmUsXG46OmFmdGVyIHtcbiAgLS10dy1jb250ZW50OiAnJztcbn1cblxuLypcbjEuIFVzZSBhIGNvbnNpc3RlbnQgc2Vuc2libGUgbGluZS1oZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4zLiBVc2UgYSBtb3JlIHJlYWRhYmxlIHRhYiBzaXplLlxuNC4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBcXGBzYW5zXFxgIGZvbnQtZmFtaWx5IGJ5IGRlZmF1bHQuXG41LiBVc2UgdGhlIHVzZXIncyBjb25maWd1cmVkIFxcYHNhbnNcXGAgZm9udC1mZWF0dXJlLXNldHRpbmdzIGJ5IGRlZmF1bHQuXG42LiBVc2UgdGhlIHVzZXIncyBjb25maWd1cmVkIFxcYHNhbnNcXGAgZm9udC12YXJpYXRpb24tc2V0dGluZ3MgYnkgZGVmYXVsdC5cbjcuIERpc2FibGUgdGFwIGhpZ2hsaWdodHMgb24gaU9TXG4qL1xuXG5odG1sLFxuOmhvc3Qge1xuICBsaW5lLWhlaWdodDogMS41OyAvKiAxICovXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xuICAtbW96LXRhYi1zaXplOiA0OyAvKiAzICovXG4gIC1vLXRhYi1zaXplOiA0O1xuICAgICB0YWItc2l6ZTogNDsgLyogMyAqL1xuICBmb250LWZhbWlseTogdWktc2Fucy1zZXJpZiwgc3lzdGVtLXVpLCBzYW5zLXNlcmlmLCBcIkFwcGxlIENvbG9yIEVtb2ppXCIsIFwiU2Vnb2UgVUkgRW1vamlcIiwgXCJTZWdvZSBVSSBTeW1ib2xcIiwgXCJOb3RvIENvbG9yIEVtb2ppXCI7IC8qIDQgKi9cbiAgZm9udC1mZWF0dXJlLXNldHRpbmdzOiBub3JtYWw7IC8qIDUgKi9cbiAgZm9udC12YXJpYXRpb24tc2V0dGluZ3M6IG5vcm1hbDsgLyogNiAqL1xuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHRyYW5zcGFyZW50OyAvKiA3ICovXG59XG5cbi8qXG4xLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4yLiBJbmhlcml0IGxpbmUtaGVpZ2h0IGZyb20gXFxgaHRtbFxcYCBzbyB1c2VycyBjYW4gc2V0IHRoZW0gYXMgYSBjbGFzcyBkaXJlY3RseSBvbiB0aGUgXFxgaHRtbFxcYCBlbGVtZW50LlxuKi9cblxuYm9keSB7XG4gIG1hcmdpbjogMDsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogaW5oZXJpdDsgLyogMiAqL1xufVxuXG4vKlxuMS4gQWRkIHRoZSBjb3JyZWN0IGhlaWdodCBpbiBGaXJlZm94LlxuMi4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2Ugb2YgYm9yZGVyIGNvbG9yIGluIEZpcmVmb3guIChodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xOTA2NTUpXG4zLiBFbnN1cmUgaG9yaXpvbnRhbCBydWxlcyBhcmUgdmlzaWJsZSBieSBkZWZhdWx0LlxuKi9cblxuaHIge1xuICBoZWlnaHQ6IDA7IC8qIDEgKi9cbiAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cbiAgYm9yZGVyLXRvcC13aWR0aDogMXB4OyAvKiAzICovXG59XG5cbi8qXG5BZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiovXG5cbmFiYnI6d2hlcmUoW3RpdGxlXSkge1xuICAtd2Via2l0LXRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcbiAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7XG59XG5cbi8qXG5SZW1vdmUgdGhlIGRlZmF1bHQgZm9udCBzaXplIGFuZCB3ZWlnaHQgZm9yIGhlYWRpbmdzLlxuKi9cblxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2IHtcbiAgZm9udC1zaXplOiBpbmhlcml0O1xuICBmb250LXdlaWdodDogaW5oZXJpdDtcbn1cblxuLypcblJlc2V0IGxpbmtzIHRvIG9wdGltaXplIGZvciBvcHQtaW4gc3R5bGluZyBpbnN0ZWFkIG9mIG9wdC1vdXQuXG4qL1xuXG5hIHtcbiAgY29sb3I6IGluaGVyaXQ7XG4gIHRleHQtZGVjb3JhdGlvbjogaW5oZXJpdDtcbn1cblxuLypcbkFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBFZGdlIGFuZCBTYWZhcmkuXG4qL1xuXG5iLFxuc3Ryb25nIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLypcbjEuIFVzZSB0aGUgdXNlcidzIGNvbmZpZ3VyZWQgXFxgbW9ub1xcYCBmb250LWZhbWlseSBieSBkZWZhdWx0LlxuMi4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBcXGBtb25vXFxgIGZvbnQtZmVhdHVyZS1zZXR0aW5ncyBieSBkZWZhdWx0LlxuMy4gVXNlIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBcXGBtb25vXFxgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzIGJ5IGRlZmF1bHQuXG40LiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuKi9cblxuY29kZSxcbmtiZCxcbnNhbXAsXG5wcmUge1xuICBmb250LWZhbWlseTogdWktbW9ub3NwYWNlLCBTRk1vbm8tUmVndWxhciwgTWVubG8sIE1vbmFjbywgQ29uc29sYXMsIFwiTGliZXJhdGlvbiBNb25vXCIsIFwiQ291cmllciBOZXdcIiwgbW9ub3NwYWNlOyAvKiAxICovXG4gIGZvbnQtZmVhdHVyZS1zZXR0aW5nczogbm9ybWFsOyAvKiAyICovXG4gIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOiBub3JtYWw7IC8qIDMgKi9cbiAgZm9udC1zaXplOiAxZW07IC8qIDQgKi9cbn1cblxuLypcbkFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuKi9cblxuc21hbGwge1xuICBmb250LXNpemU6IDgwJTtcbn1cblxuLypcblByZXZlbnQgXFxgc3ViXFxgIGFuZCBcXGBzdXBcXGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cbiovXG5cbnN1YixcbnN1cCB7XG4gIGZvbnQtc2l6ZTogNzUlO1xuICBsaW5lLWhlaWdodDogMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbnN1YiB7XG4gIGJvdHRvbTogLTAuMjVlbTtcbn1cblxuc3VwIHtcbiAgdG9wOiAtMC41ZW07XG59XG5cbi8qXG4xLiBSZW1vdmUgdGV4dCBpbmRlbnRhdGlvbiBmcm9tIHRhYmxlIGNvbnRlbnRzIGluIENocm9tZSBhbmQgU2FmYXJpLiAoaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9OTk5MDg4LCBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MjAxMjk3KVxuMi4gQ29ycmVjdCB0YWJsZSBib3JkZXIgY29sb3IgaW5oZXJpdGFuY2UgaW4gYWxsIENocm9tZSBhbmQgU2FmYXJpLiAoaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9OTM1NzI5LCBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTk1MDE2KVxuMy4gUmVtb3ZlIGdhcHMgYmV0d2VlbiB0YWJsZSBib3JkZXJzIGJ5IGRlZmF1bHQuXG4qL1xuXG50YWJsZSB7XG4gIHRleHQtaW5kZW50OiAwOyAvKiAxICovXG4gIGJvcmRlci1jb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlOyAvKiAzICovXG59XG5cbi8qXG4xLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbjIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbjMuIFJlbW92ZSBkZWZhdWx0IHBhZGRpbmcgaW4gYWxsIGJyb3dzZXJzLlxuKi9cblxuYnV0dG9uLFxuaW5wdXQsXG5vcHRncm91cCxcbnNlbGVjdCxcbnRleHRhcmVhIHtcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cbiAgZm9udC1mZWF0dXJlLXNldHRpbmdzOiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBmb250LXdlaWdodDogaW5oZXJpdDsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogaW5oZXJpdDsgLyogMSAqL1xuICBsZXR0ZXItc3BhY2luZzogaW5oZXJpdDsgLyogMSAqL1xuICBjb2xvcjogaW5oZXJpdDsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbiAgcGFkZGluZzogMDsgLyogMyAqL1xufVxuXG4vKlxuUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlIGFuZCBGaXJlZm94LlxuKi9cblxuYnV0dG9uLFxuc2VsZWN0IHtcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qXG4xLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuMi4gUmVtb3ZlIGRlZmF1bHQgYnV0dG9uIHN0eWxlcy5cbiovXG5cbmJ1dHRvbixcbmlucHV0OndoZXJlKFt0eXBlPSdidXR0b24nXSksXG5pbnB1dDp3aGVyZShbdHlwZT0ncmVzZXQnXSksXG5pbnB1dDp3aGVyZShbdHlwZT0nc3VibWl0J10pIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7IC8qIDIgKi9cbiAgYmFja2dyb3VuZC1pbWFnZTogbm9uZTsgLyogMiAqL1xufVxuXG4vKlxuVXNlIHRoZSBtb2Rlcm4gRmlyZWZveCBmb2N1cyBzdHlsZSBmb3IgYWxsIGZvY3VzYWJsZSBlbGVtZW50cy5cbiovXG5cbjotbW96LWZvY3VzcmluZyB7XG4gIG91dGxpbmU6IGF1dG87XG59XG5cbi8qXG5SZW1vdmUgdGhlIGFkZGl0aW9uYWwgXFxgOmludmFsaWRcXGAgc3R5bGVzIGluIEZpcmVmb3guIChodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9nZWNrby1kZXYvYmxvYi8yZjllYWNkOWQzZDk5NWM5MzdiNDI1MWE1NTU3ZDk1ZDQ5NGM5YmUxL2xheW91dC9zdHlsZS9yZXMvZm9ybXMuY3NzI0w3MjgtTDczNylcbiovXG5cbjotbW96LXVpLWludmFsaWQge1xuICBib3gtc2hhZG93OiBub25lO1xufVxuXG4vKlxuQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUgYW5kIEZpcmVmb3guXG4qL1xuXG5wcm9ncmVzcyB7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLypcbkNvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIFNhZmFyaS5cbiovXG5cbjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcbjo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLypcbjEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxuMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXG4qL1xuXG5bdHlwZT0nc2VhcmNoJ10ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xuICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xufVxuXG4vKlxuUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuKi9cblxuOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKlxuMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbjIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gXFxgaW5oZXJpdFxcYCBpbiBTYWZhcmkuXG4qL1xuXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xufVxuXG4vKlxuQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4qL1xuXG5zdW1tYXJ5IHtcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xufVxuXG4vKlxuUmVtb3ZlcyB0aGUgZGVmYXVsdCBzcGFjaW5nIGFuZCBib3JkZXIgZm9yIGFwcHJvcHJpYXRlIGVsZW1lbnRzLlxuKi9cblxuYmxvY2txdW90ZSxcbmRsLFxuZGQsXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYsXG5ocixcbmZpZ3VyZSxcbnAsXG5wcmUge1xuICBtYXJnaW46IDA7XG59XG5cbmZpZWxkc2V0IHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xufVxuXG5sZWdlbmQge1xuICBwYWRkaW5nOiAwO1xufVxuXG5vbCxcbnVsLFxubWVudSB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbn1cblxuLypcblJlc2V0IGRlZmF1bHQgc3R5bGluZyBmb3IgZGlhbG9ncy5cbiovXG5kaWFsb2cge1xuICBwYWRkaW5nOiAwO1xufVxuXG4vKlxuUHJldmVudCByZXNpemluZyB0ZXh0YXJlYXMgaG9yaXpvbnRhbGx5IGJ5IGRlZmF1bHQuXG4qL1xuXG50ZXh0YXJlYSB7XG4gIHJlc2l6ZTogdmVydGljYWw7XG59XG5cbi8qXG4xLiBSZXNldCB0aGUgZGVmYXVsdCBwbGFjZWhvbGRlciBvcGFjaXR5IGluIEZpcmVmb3guIChodHRwczovL2dpdGh1Yi5jb20vdGFpbHdpbmRsYWJzL3RhaWx3aW5kY3NzL2lzc3Vlcy8zMzAwKVxuMi4gU2V0IHRoZSBkZWZhdWx0IHBsYWNlaG9sZGVyIGNvbG9yIHRvIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBncmF5IDQwMCBjb2xvci5cbiovXG5cbmlucHV0OjotbW96LXBsYWNlaG9sZGVyLCB0ZXh0YXJlYTo6LW1vei1wbGFjZWhvbGRlciB7XG4gIG9wYWNpdHk6IDE7IC8qIDEgKi9cbiAgY29sb3I6ICM5Y2EzYWY7IC8qIDIgKi9cbn1cblxuaW5wdXQ6OnBsYWNlaG9sZGVyLFxudGV4dGFyZWE6OnBsYWNlaG9sZGVyIHtcbiAgb3BhY2l0eTogMTsgLyogMSAqL1xuICBjb2xvcjogIzljYTNhZjsgLyogMiAqL1xufVxuXG4vKlxuU2V0IHRoZSBkZWZhdWx0IGN1cnNvciBmb3IgYnV0dG9ucy5cbiovXG5cbmJ1dHRvbixcbltyb2xlPVwiYnV0dG9uXCJdIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4vKlxuTWFrZSBzdXJlIGRpc2FibGVkIGJ1dHRvbnMgZG9uJ3QgZ2V0IHRoZSBwb2ludGVyIGN1cnNvci5cbiovXG46ZGlzYWJsZWQge1xuICBjdXJzb3I6IGRlZmF1bHQ7XG59XG5cbi8qXG4xLiBNYWtlIHJlcGxhY2VkIGVsZW1lbnRzIFxcYGRpc3BsYXk6IGJsb2NrXFxgIGJ5IGRlZmF1bHQuIChodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0KVxuMi4gQWRkIFxcYHZlcnRpY2FsLWFsaWduOiBtaWRkbGVcXGAgdG8gYWxpZ24gcmVwbGFjZWQgZWxlbWVudHMgbW9yZSBzZW5zaWJseSBieSBkZWZhdWx0LiAoaHR0cHM6Ly9naXRodWIuY29tL2plbnNpbW1vbnMvY3NzcmVtZWR5L2lzc3Vlcy8xNCNpc3N1ZWNvbW1lbnQtNjM0OTM0MjEwKVxuICAgVGhpcyBjYW4gdHJpZ2dlciBhIHBvb3JseSBjb25zaWRlcmVkIGxpbnQgZXJyb3IgaW4gc29tZSB0b29scyBidXQgaXMgaW5jbHVkZWQgYnkgZGVzaWduLlxuKi9cblxuaW1nLFxuc3ZnLFxudmlkZW8sXG5jYW52YXMsXG5hdWRpbyxcbmlmcmFtZSxcbmVtYmVkLFxub2JqZWN0IHtcbiAgZGlzcGxheTogYmxvY2s7IC8qIDEgKi9cbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTsgLyogMiAqL1xufVxuXG4vKlxuQ29uc3RyYWluIGltYWdlcyBhbmQgdmlkZW9zIHRvIHRoZSBwYXJlbnQgd2lkdGggYW5kIHByZXNlcnZlIHRoZWlyIGludHJpbnNpYyBhc3BlY3QgcmF0aW8uIChodHRwczovL2dpdGh1Yi5jb20vbW96ZGV2cy9jc3NyZW1lZHkvaXNzdWVzLzE0KVxuKi9cblxuaW1nLFxudmlkZW8ge1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLyogTWFrZSBlbGVtZW50cyB3aXRoIHRoZSBIVE1MIGhpZGRlbiBhdHRyaWJ1dGUgc3RheSBoaWRkZW4gYnkgZGVmYXVsdCAqL1xuW2hpZGRlbl06d2hlcmUoOm5vdChbaGlkZGVuPVwidW50aWwtZm91bmRcIl0pKSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4uc3RhdGljIHtcbiAgcG9zaXRpb246IHN0YXRpYztcbn1cbi5maXhlZCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbn1cbi56LTUwIHtcbiAgei1pbmRleDogNTA7XG59XG4uZmxleCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG4uaC1cXFxcWzEyOHB4XFxcXF0ge1xuICBoZWlnaHQ6IDEyOHB4O1xufVxuLmgtXFxcXFsyNHB4XFxcXF0ge1xuICBoZWlnaHQ6IDI0cHg7XG59XG4uaC1cXFxcWzI1NnB4XFxcXF0ge1xuICBoZWlnaHQ6IDI1NnB4O1xufVxuLmgtXFxcXFsycHhcXFxcXSB7XG4gIGhlaWdodDogMnB4O1xufVxuLmgtXFxcXFszMnB4XFxcXF0ge1xuICBoZWlnaHQ6IDMycHg7XG59XG4uaC1cXFxcWzM2cHhcXFxcXSB7XG4gIGhlaWdodDogMzZweDtcbn1cbi5oLVxcXFxbNjRweFxcXFxdIHtcbiAgaGVpZ2h0OiA2NHB4O1xufVxuLmgtXFxcXFtjYWxjXFxcXCgxMDBcXFxcJS0yNTZweFxcXFwpXFxcXF0ge1xuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDI1NnB4KTtcbn1cbi5oLWZ1bGwge1xuICBoZWlnaHQ6IDEwMCU7XG59XG4uaC1zY3JlZW4ge1xuICBoZWlnaHQ6IDEwMHZoO1xufVxuLm1heC1oLVxcXFxbY2FsY1xcXFwoMTAwXFxcXCUtMzJweFxcXFwpXFxcXF0ge1xuICBtYXgtaGVpZ2h0OiBjYWxjKDEwMCUgLSAzMnB4KTtcbn1cbi53LVxcXFxbMTI4cHhcXFxcXSB7XG4gIHdpZHRoOiAxMjhweDtcbn1cbi53LVxcXFxbMTkycHhcXFxcXSB7XG4gIHdpZHRoOiAxOTJweDtcbn1cbi53LVxcXFxbMjU2cHhcXFxcXSB7XG4gIHdpZHRoOiAyNTZweDtcbn1cbi53LVxcXFxbMzIwcHhcXFxcXSB7XG4gIHdpZHRoOiAzMjBweDtcbn1cbi53LVxcXFxbMzJweFxcXFxdIHtcbiAgd2lkdGg6IDMycHg7XG59XG4udy1cXFxcWzRweFxcXFxdIHtcbiAgd2lkdGg6IDRweDtcbn1cbi53LVxcXFxbNjRweFxcXFxdIHtcbiAgd2lkdGg6IDY0cHg7XG59XG4udy1cXFxcWzhweFxcXFxdIHtcbiAgd2lkdGg6IDhweDtcbn1cbi53LVxcXFxbY2FsY1xcXFwoMTAwXFxcXCUtMTkycHhcXFxcKVxcXFxdIHtcbiAgd2lkdGg6IGNhbGMoMTAwJSAtIDE5MnB4KTtcbn1cbi53LVxcXFxbY2FsY1xcXFwoMTAwXFxcXCUtMjU2cHhcXFxcKVxcXFxdIHtcbiAgd2lkdGg6IGNhbGMoMTAwJSAtIDI1NnB4KTtcbn1cbi53LWZ1bGwge1xuICB3aWR0aDogMTAwJTtcbn1cbi5taW4tdy1cXFxcWzEyOHB4XFxcXF0ge1xuICBtaW4td2lkdGg6IDEyOHB4O1xufVxuLm1heC13LVxcXFxbMjU2cHhcXFxcXSB7XG4gIG1heC13aWR0aDogMjU2cHg7XG59XG4ubWF4LXctXFxcXFtjYWxjXFxcXCgxMDBcXFxcJS0xMjgwcHhcXFxcKVxcXFxdIHtcbiAgbWF4LXdpZHRoOiBjYWxjKDEwMCUgLSAxMjgwcHgpO1xufVxuLmZsZXgtbm9uZSB7XG4gIGZsZXg6IG5vbmU7XG59XG4uZmxleC1ncm93IHtcbiAgZmxleC1ncm93OiAxO1xufVxuLmdyb3cge1xuICBmbGV4LWdyb3c6IDE7XG59XG4uY3Vyc29yLXBvaW50ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4uZmxleC1jb2wge1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuLml0ZW1zLWNlbnRlciB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4uanVzdGlmeS1zdGFydCB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbn1cbi5qdXN0aWZ5LWNlbnRlciB7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuLmp1c3RpZnktYmV0d2VlbiB7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2Vlbjtcbn1cbi5qdXN0aWZ5LWV2ZW5seSB7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xufVxuLmdhcC1cXFxcWzE2cHhcXFxcXSB7XG4gIGdhcDogMTZweDtcbn1cbi5nYXAteS1cXFxcWzE2cHhcXFxcXSB7XG4gIHJvdy1nYXA6IDE2cHg7XG59XG4uZ2FwLXktXFxcXFs4cHhcXFxcXSB7XG4gIHJvdy1nYXA6IDhweDtcbn1cbi5vdmVyZmxvdy1hdXRvIHtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG4ub3ZlcmZsb3cteC1hdXRvIHtcbiAgb3ZlcmZsb3cteDogYXV0bztcbn1cbi5vdmVyZmxvdy15LWF1dG8ge1xuICBvdmVyZmxvdy15OiBhdXRvO1xufVxuLnRleHQtZWxsaXBzaXMge1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbn1cbi53aGl0ZXNwYWNlLW5vd3JhcCB7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4ucm91bmRlZC1cXFxcWzE2cHhcXFxcXSB7XG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG59XG4ucm91bmRlZC1cXFxcWzRweFxcXFxdIHtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xufVxuLnJvdW5kZWQtZnVsbCB7XG4gIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbn1cbi5ib3JkZXItbmV1dHJhbF83IHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDIwLCAyMCwgMjAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG59XG4uYmctYmx1ZS01MDAge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYig1OSAxMzAgMjQ2IC8gdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuLmJnLW5ldXRyYWxfMiB7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDI0NSwgMjQ1LCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG4uYmctbmV1dHJhbF80IHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIzNSwgMjM1LCAyMzUsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cbi5iZy1uZXV0cmFsXzkge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMzAsIDMwLCAzMCwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuLmJnLXJlZC00MDAge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyNDggMTEzIDExMyAvIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cbi5wLVxcXFxbMTZweFxcXFxdIHtcbiAgcGFkZGluZzogMTZweDtcbn1cbi5wLVxcXFxbMzJweFxcXFxdIHtcbiAgcGFkZGluZzogMzJweDtcbn1cbi5wLVxcXFxbOHB4XFxcXF0ge1xuICBwYWRkaW5nOiA4cHg7XG59XG4udGV4dC1jZW50ZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG4uYWxpZ24tbWlkZGxlIHtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cbi50ZXh0LTJ4bCB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBsaW5lLWhlaWdodDogMnJlbTtcbn1cbi5mb250LWJvbGQge1xuICBmb250LXdlaWdodDogNzAwO1xufVxuLmZvbnQtbGlnaHQge1xuICBmb250LXdlaWdodDogMzAwO1xufVxuLnVwcGVyY2FzZSB7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG4ubG93ZXJjYXNlIHtcbiAgdGV4dC10cmFuc2Zvcm06IGxvd2VyY2FzZTtcbn1cbi50ZXh0LW5ldXRyYWxfNyB7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSgyMCwgMjAsIDIwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbn1cbi50ZXh0LW5ldXRyYWxfOSB7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSgzMCwgMzAsIDMwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbn1cbi5vdXRsaW5lIHtcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XG59XG4ub3V0bGluZS1cXFxcWzFweFxcXFxdIHtcbiAgb3V0bGluZS13aWR0aDogMXB4O1xufVxuLm91dGxpbmUtXFxcXFsycHhcXFxcXSB7XG4gIG91dGxpbmUtd2lkdGg6IDJweDtcbn1cbi5vdXRsaW5lLWJsYWNrXFxcXC8xMCB7XG4gIG91dGxpbmUtY29sb3I6IHJnYigwIDAgMCAvIDAuMSk7XG59XG4uZHJvcC1zaGFkb3ctXFxcXFswXzFweF8ycHhfcmdiYVxcXFwoMFxcXFwyYyAwXFxcXDJjIDBcXFxcMmMgMFxcXFwuMjVcXFxcKVxcXFxdIHtcbiAgLS10dy1kcm9wLXNoYWRvdzogZHJvcC1zaGFkb3coMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4yNSkpO1xuICBmaWx0ZXI6IHZhcigtLXR3LWJsdXIpIHZhcigtLXR3LWJyaWdodG5lc3MpIHZhcigtLXR3LWNvbnRyYXN0KSB2YXIoLS10dy1ncmF5c2NhbGUpIHZhcigtLXR3LWh1ZS1yb3RhdGUpIHZhcigtLXR3LWludmVydCkgdmFyKC0tdHctc2F0dXJhdGUpIHZhcigtLXR3LXNlcGlhKSB2YXIoLS10dy1kcm9wLXNoYWRvdyk7XG59XG4uZHJvcC1zaGFkb3ctc29mdC1ib3QtcmlnaHQge1xuICAtLXR3LWRyb3Atc2hhZG93OiBkcm9wLXNoYWRvdygxcHggMXB4IDRweCByZ2IoMCAwIDAgLyAwLjI1KSk7XG4gIGZpbHRlcjogdmFyKC0tdHctYmx1cikgdmFyKC0tdHctYnJpZ2h0bmVzcykgdmFyKC0tdHctY29udHJhc3QpIHZhcigtLXR3LWdyYXlzY2FsZSkgdmFyKC0tdHctaHVlLXJvdGF0ZSkgdmFyKC0tdHctaW52ZXJ0KSB2YXIoLS10dy1zYXR1cmF0ZSkgdmFyKC0tdHctc2VwaWEpIHZhcigtLXR3LWRyb3Atc2hhZG93KTtcbn1cblxuYm9keSB7XG4gIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgSGVsdmV0aWNhLFxuICAgIEFyaWFsLCBzYW5zLXNlcmlmO1xufVxuXG4uYmFzZSB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuLmJhc2UtaW5wdXQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDM2cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ1LCAyNDUsIDI0NSwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xuICBwYWRkaW5nOiA4cHg7XG59XG5cbi5iYXNlLWlucHV0OmhvdmVyIHtcbiAgLS10dy1iZy1vcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIHZhcigtLXR3LWJnLW9wYWNpdHksIDEpKTtcbn1cblxuLmJhc2UtYm9yZGVyIHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDIwLCAyMCwgMjAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSgyMCwgMjAsIDIwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbn1cblxuLmJhc2UtdGV4dC1wb3NpdGlvbiB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuLmJhc2UtdGV4dC1wb3NpdGlvbi1jZW50ZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi5iYXNlLXRleHQtc3R5bGUge1xuICB0ZXh0LXRyYW5zZm9ybTogbG93ZXJjYXNlO1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoMjAsIDIwLCAyMCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG59XG5cbi5iYXNlLW91dGxpbmUge1xuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcbiAgb3V0bGluZS13aWR0aDogMXB4O1xuICBvdXRsaW5lLWNvbG9yOiByZ2IoMCAwIDAgLyAwLjI1KTtcbn1cblxuXG4udW5pdCB7XG4gIC0tdHctYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogcmdiYSgyMCwgMjAsIDIwLCB2YXIoLS10dy1ib3JkZXItb3BhY2l0eSwgMSkpO1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoMjAsIDIwLCAyMCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XG4gIG91dGxpbmUtd2lkdGg6IDFweDtcbiAgb3V0bGluZS1jb2xvcjogcmdiKDAgMCAwIC8gMC4yNSk7XG59XG5cbi5idXR0b24tc3VibWl0IHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDIwLCAyMCwgMjAsIHZhcigtLXR3LWJvcmRlci1vcGFjaXR5LCAxKSk7XG4gIC0tdHctdGV4dC1vcGFjaXR5OiAxO1xuICBjb2xvcjogcmdiYSgyMCwgMjAsIDIwLCB2YXIoLS10dy10ZXh0LW9wYWNpdHksIDEpKTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcbiAgb3V0bGluZS13aWR0aDogMXB4O1xuICBvdXRsaW5lLWNvbG9yOiByZ2IoMCAwIDAgLyAwLjI1KTtcbn1cblxuLmlucHV0LW51bWJlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGhlaWdodDogMzZweDtcbiAgd2lkdGg6IDEwMCU7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDI0NSwgMjQ1LCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG4gIHBhZGRpbmc6IDhweDtcbn1cblxuLmlucHV0LW51bWJlcjpob3ZlciB7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG5cbi5pbnB1dC1udW1iZXIge1xuICAtLXR3LWJvcmRlci1vcGFjaXR5OiAxO1xuICBib3JkZXItY29sb3I6IHJnYmEoMjAsIDIwLCAyMCwgdmFyKC0tdHctYm9yZGVyLW9wYWNpdHksIDEpKTtcbiAgLS10dy10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiByZ2JhKDIwLCAyMCwgMjAsIHZhcigtLXR3LXRleHQtb3BhY2l0eSwgMSkpO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIG91dGxpbmUtc3R5bGU6IHNvbGlkO1xuICBvdXRsaW5lLXdpZHRoOiAxcHg7XG4gIG91dGxpbmUtY29sb3I6IHJnYigwIDAgMCAvIDAuMjUpO1xufVxuXG5pbnB1dC5pbnB1dC1udW1iZXIge1xuICAtbW96LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgYXBwZWFyYW5jZTogbm9uZTtcbiAgbWFyZ2luOiAwO1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gIC1tb3otYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xufVxuXG5pbnB1dC5pbnB1dC1udW1iZXI6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5pbnB1dC5pbnB1dC1udW1iZXI6Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xubWFyZ2luOiAwO1xufVxuXG4uaW5wdXQtdGV4dCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGhlaWdodDogMzZweDtcbiAgd2lkdGg6IDEwMCU7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDI0NSwgMjQ1LCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG4gIHBhZGRpbmc6IDhweDtcbn1cblxuLmlucHV0LXRleHQ6aG92ZXIge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuXG4uaW5wdXQtdGV4dCB7XG4gIC0tdHctYm9yZGVyLW9wYWNpdHk6IDE7XG4gIGJvcmRlci1jb2xvcjogcmdiYSgyMCwgMjAsIDIwLCB2YXIoLS10dy1ib3JkZXItb3BhY2l0eSwgMSkpO1xuICAtLXR3LXRleHQtb3BhY2l0eTogMTtcbiAgY29sb3I6IHJnYmEoMjAsIDIwLCAyMCwgdmFyKC0tdHctdGV4dC1vcGFjaXR5LCAxKSk7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XG4gIG91dGxpbmUtd2lkdGg6IDFweDtcbiAgb3V0bGluZS1jb2xvcjogcmdiKDAgMCAwIC8gMC4yNSk7XG59XG5cbi5maWVsZC10aXRsZSB7XG4gIGhlaWdodDogMjRweDtcbiAgd2lkdGg6IDEwMCU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgdGV4dC10cmFuc2Zvcm06IGxvd2VyY2FzZTtcbiAgLS10dy10ZXh0LW9wYWNpdHk6IDE7XG4gIGNvbG9yOiByZ2JhKDIwLCAyMCwgMjAsIHZhcigtLXR3LXRleHQtb3BhY2l0eSwgMSkpO1xufVxuXG4uaW5wdXQtZmllbGQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLm1haW4tY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG4gIGdhcDogMTZweDtcbiAgcGFkZGluZzogMTZweDtcbn1cblxuaW5wdXQuY29udGludW91cy1udW1iZXIge1xuICAtbW96LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgYXBwZWFyYW5jZTogbm9uZTtcbiAgbWFyZ2luOiAwO1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gIC1tb3otYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xufVxuXG5pbnB1dC5jb250aW51b3VzLW51bWJlcjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbi13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbm1hcmdpbjogMDtcbn1cblxuLmhvdmVyXFxcXDpib3JkZXItYi1cXFxcWzJweFxcXFxdOmhvdmVyIHtcbiAgYm9yZGVyLWJvdHRvbS13aWR0aDogMnB4O1xufVxuXG4uaG92ZXJcXFxcOmJvcmRlci15ZWxsb3ctNTAwOmhvdmVyIHtcbiAgLS10dy1ib3JkZXItb3BhY2l0eTogMTtcbiAgYm9yZGVyLWNvbG9yOiByZ2IoMjM0IDE3OSA4IC8gdmFyKC0tdHctYm9yZGVyLW9wYWNpdHksIDEpKTtcbn1cblxuLmhvdmVyXFxcXDpiZy1uZXV0cmFsXzA6aG92ZXIge1xuICAtLXR3LWJnLW9wYWNpdHk6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgdmFyKC0tdHctYmctb3BhY2l0eSwgMSkpO1xufVxuXG4uaG92ZXJcXFxcOmJnLW5ldXRyYWxfNzpob3ZlciB7XG4gIC0tdHctYmctb3BhY2l0eTogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMCwgMjAsIDIwLCB2YXIoLS10dy1iZy1vcGFjaXR5LCAxKSk7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zY3JpcHRzL3N0eWxlcy9pbmRleC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFBQSx3QkFBYztFQUFkLHdCQUFjO0VBQWQsbUJBQWM7RUFBZCxtQkFBYztFQUFkLGNBQWM7RUFBZCxjQUFjO0VB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ZCxNQUFjO0FBQUE7O0FBQWQ7O0NBQWM7O0FBQWQ7RUFBQSxrQkFBYztBQUFBOztBQUFkOztDQUFjOztBQUFkOzs7Ozs7Ozs7Ozs7O0VBQUEsU0FBYztBQUFBOztBQUFkO0VBQUEsU0FBYztFQUFkLFVBQWM7QUFBQTs7QUFBZDtFQUFBLFVBQWM7QUFBQTs7QUFBZDs7O0VBQUEsZ0JBQWM7RUFBZCxTQUFjO0VBQWQsVUFBYztBQUFBOztBQUFkOztDQUFjO0FBQWQ7RUFBQSxVQUFjO0FBQUE7O0FBQWQ7O0NBQWM7O0FBQWQ7RUFBQSxnQkFBYztBQUFBOztBQUFkOzs7Q0FBYzs7QUFBZDtFQUFBLFVBQWMsRUFBZCxNQUFjO0VBQWQsY0FBYyxFQUFkLE1BQWM7QUFBQTs7QUFBZDs7RUFBQSxVQUFjLEVBQWQsTUFBYztFQUFkLGNBQWMsRUFBZCxNQUFjO0FBQUE7O0FBQWQ7O0NBQWM7O0FBQWQ7O0VBQUEsZUFBYztBQUFBOztBQUFkOztDQUFjO0FBQWQ7RUFBQSxlQUFjO0FBQUE7O0FBQWQ7Ozs7Q0FBYzs7QUFBZDs7Ozs7Ozs7RUFBQSxjQUFjLEVBQWQsTUFBYztFQUFkLHNCQUFjLEVBQWQsTUFBYztBQUFBOztBQUFkOztDQUFjOztBQUFkOztFQUFBLGVBQWM7RUFBZCxZQUFjO0FBQUE7O0FBQWQsd0VBQWM7QUFBZDtFQUFBLGFBQWM7QUFBQTtBQUVkO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBLHNCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBLGtCQUFtQjtFQUFuQjtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQSxpQkFBbUI7RUFBbkI7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFuQjtFQUFBO0FBQW1CO0FBQW5CO0VBQUE7QUFBbUI7QUFBbkI7RUFBQTtBQUFtQjtBQUFu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QUEwQjtBQUM1Qjs7QUFFQTs7QUFFQSx3QkFBd0I7QUFDeEIsU0FBUztBQUNUOztBQWxGQTtFQUFBO0FBbUZBOztBQW5GQTtFQUFBLHNCQW1GQTtFQW5GQTtBQW1GQTs7QUFuRkE7RUFBQSxrQkFtRkE7RUFuRkE7QUFtRkE7O0FBbkZBO0VBQUEsa0JBbUZBO0VBbkZBO0FBbUZBXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkB0YWlsd2luZCBiYXNlO1xcbkB0YWlsd2luZCBjb21wb25lbnRzO1xcbkB0YWlsd2luZCB1dGlsaXRpZXM7XFxuXFxuQGltcG9ydCBcXFwiLi90aGVtZXMuY3NzXFxcIjtcXG5AaW1wb3J0IFxcXCIuL2ZvbnRzLmNzc1xcXCI7XFxuQGltcG9ydCBcXFwiLi90ZXh0cy5jc3NcXFwiO1xcbkBpbXBvcnQgXFxcIi4vaW5wdXRzLmNzc1xcXCI7XFxuXFxuYm9keSB7XFxuICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBSb2JvdG8sIEhlbHZldGljYSxcXG4gICAgQXJpYWwsIHNhbnMtc2VyaWY7XFxufVxcblxcbi5iYXNlIHtcXG4gIEBhcHBseSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGU7XFxufVxcblxcbi5iYXNlLWlucHV0IHtcXG4gIEBhcHBseSByb3VuZGVkLVs0cHhdIHAtWzhweF0gdy1mdWxsIGgtWzM2cHhdIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLW5ldXRyYWxfMiBob3ZlcjpiZy1uZXV0cmFsXzA7XFxufVxcblxcbi5iYXNlLWJvcmRlciB7XFxuICBAYXBwbHkgYm9yZGVyLW5ldXRyYWxfNyB0ZXh0LW5ldXRyYWxfN1xcbn1cXG5cXG4uYmFzZS10ZXh0LXBvc2l0aW9uIHtcXG4gIEBhcHBseSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGVcXG59XFxuXFxuLmJhc2UtdGV4dC1wb3NpdGlvbi1jZW50ZXIge1xcbiAgQGFwcGx5IHRleHQtY2VudGVyIGFsaWduLW1pZGRsZVxcbn1cXG5cXG4uYmFzZS10ZXh0LXN0eWxlIHtcXG4gIEBhcHBseSB0ZXh0LW5ldXRyYWxfNyBsb3dlcmNhc2VcXG59XFxuXFxuLmJhc2Utb3V0bGluZSB7XFxuICBAYXBwbHkgb3V0bGluZSBvdXRsaW5lLVsxcHhdIG91dGxpbmUtYmxhY2svMjU7XFxufVxcblxcblxcbi51bml0IHtcXG4gIEBhcHBseSBiYXNlLXRleHQtcG9zaXRpb24tY2VudGVyIGJhc2UtYm9yZGVyIGJhc2Utb3V0bGluZVxcbn1cXG5cXG4uYnV0dG9uLXN1Ym1pdCB7XFxuICBAYXBwbHkgYmFzZS10ZXh0LXBvc2l0aW9uLWNlbnRlciBiYXNlLWJvcmRlciBiYXNlLW91dGxpbmVcXG59XFxuXFxuLmlucHV0LW51bWJlciB7XFxuICBAYXBwbHkgYmFzZS10ZXh0LXBvc2l0aW9uIGJhc2UtYm9yZGVyIGJhc2Utb3V0bGluZSBiYXNlLWlucHV0IGNvbnRpbnVvdXMtbnVtYmVyO1xcbn1cXG5cXG4uaW5wdXQtdGV4dCB7XFxuICBAYXBwbHkgYmFzZS10ZXh0LXBvc2l0aW9uIGJhc2UtYm9yZGVyIGJhc2Utb3V0bGluZSBiYXNlLWlucHV0O1xcbn1cXG5cXG4uZmllbGQtdGl0bGUge1xcbiAgQGFwcGx5IGJhc2UtdGV4dC1wb3NpdGlvbi1jZW50ZXIgYmFzZS10ZXh0LXN0eWxlIHctZnVsbCBoLVsyNHB4XTtcXG59XFxuXFxuLmlucHV0LWZpZWxkIHtcXG4gIEBhcHBseSB3LWZ1bGwgaC1mdWxsIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyO1xcbn1cXG5cXG4ubWFpbi1jb250ZW50IHtcXG4gIEBhcHBseSB3LWZ1bGwgaC1mdWxsIGZsZXggZ2FwLVsxNnB4XSBwLVsxNnB4XVxcbn1cXG5cXG5pbnB1dC5jb250aW51b3VzLW51bWJlciB7XFxuICBhcHBlYXJhbmNlOiBub25lO1xcbiAgbWFyZ2luOiAwO1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbiAgLW1vei1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XFxufVxcblxcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcbmlucHV0LmNvbnRpbnVvdXMtbnVtYmVyOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4td2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxubWFyZ2luOiAwO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYGAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W10sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIlwiLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAbGF5ZXIgY29tcG9uZW50cyB7XHJcbiAgICAuYmFzZSB7XHJcbiAgICAgICAgQGFwcGx5IHRleHQtY2VudGVyIGFsaWduLW1pZGRsZTtcclxuICAgIH1cclxuICAgIC5kZWZhdWx0LWJ1dHRvbiB7XHJcbiAgICAgICAgQGFwcGx5IGJhc2UgYmctYmx1ZS01MDAgYm9yZGVyLW5ldXRyYWxfNyB0ZXh0LW5ldXRyYWxfNztcclxuICAgIH1cclxuXHJcbiAgICAvKiBIaWRlIHNjcm9sbGJhciBmb3IgSUUsIEVkZ2UgYW5kIEZpcmVmb3ggKi9cclxuICAgIC5uby1zY3JvbGxiYXIge1xyXG4gICAgICAgIC1tcy1vdmVyZmxvdy1zdHlsZTogbm9uZTsgIC8qIElFIGFuZCBFZGdlICovXHJcbiAgICAgICAgc2Nyb2xsYmFyLXdpZHRoOiBub25lOyAgLyogRmlyZWZveCAqL1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiBIaWRlIHNjcm9sbGJhciBmb3IgQ2hyb21lLCBTYWZhcmkgYW5kIE9wZXJhICovXHJcbiAgICAubm8tc2Nyb2xsYmFyOjotd2Via2l0LXNjcm9sbGJhciB7XHJcbiAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuXHJcbiAgICAuZGVmYXVsdC1pbnB1dCB7XHJcbiAgICAgICAgQGFwcGx5IGJhc2UgYm9yZGVyLW5ldXRyYWxfNyB0ZXh0LW5ldXRyYWxfNyByb3VuZGVkLVsxNnB4XTtcclxuICAgIH1cclxufVxyXG5cclxuaW5wdXQuY29udGludW91cy1udW1iZXIge1xyXG4gICAgYXBwZWFyYW5jZTogbm9uZTtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcclxuICAgIC1tb3otYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xyXG59XHJcblxyXG5pbnB1dC5jb250aW51b3VzLW51bWJlcjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcclxuaW5wdXQuY29udGludW91cy1udW1iZXI6Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xyXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcclxuICBtYXJnaW46IDA7XHJcbn1cclxuXHJcbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3NjcmlwdHMvc3R5bGVzL2lucHV0cy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSTtRQUNJLCtCQUErQjtJQUNuQztJQUNBO1FBQ0ksdURBQXVEO0lBQzNEOztJQUVBLDRDQUE0QztJQUM1QztRQUNJLHdCQUF3QixHQUFHLGdCQUFnQjtRQUMzQyxxQkFBcUIsR0FBRyxZQUFZO0lBQ3hDOztJQUVBLGdEQUFnRDtJQUNoRDtRQUNJLGFBQWE7SUFDakI7O0lBRUE7UUFDSSwwREFBMEQ7SUFDOUQ7QUFDSjs7QUFFQTtJQUNJLGdCQUFnQjtJQUNoQixTQUFTO0lBQ1Qsd0JBQXdCO0lBQ3hCLDBCQUEwQjtBQUM5Qjs7QUFFQTs7RUFFRSx3QkFBd0I7RUFDeEIsU0FBUztBQUNYXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBsYXllciBjb21wb25lbnRzIHtcXHJcXG4gICAgLmJhc2Uge1xcclxcbiAgICAgICAgQGFwcGx5IHRleHQtY2VudGVyIGFsaWduLW1pZGRsZTtcXHJcXG4gICAgfVxcclxcbiAgICAuZGVmYXVsdC1idXR0b24ge1xcclxcbiAgICAgICAgQGFwcGx5IGJhc2UgYmctYmx1ZS01MDAgYm9yZGVyLW5ldXRyYWxfNyB0ZXh0LW5ldXRyYWxfNztcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAvKiBIaWRlIHNjcm9sbGJhciBmb3IgSUUsIEVkZ2UgYW5kIEZpcmVmb3ggKi9cXHJcXG4gICAgLm5vLXNjcm9sbGJhciB7XFxyXFxuICAgICAgICAtbXMtb3ZlcmZsb3ctc3R5bGU6IG5vbmU7ICAvKiBJRSBhbmQgRWRnZSAqL1xcclxcbiAgICAgICAgc2Nyb2xsYmFyLXdpZHRoOiBub25lOyAgLyogRmlyZWZveCAqL1xcclxcbiAgICB9XFxyXFxuICAgIFxcclxcbiAgICAvKiBIaWRlIHNjcm9sbGJhciBmb3IgQ2hyb21lLCBTYWZhcmkgYW5kIE9wZXJhICovXFxyXFxuICAgIC5uby1zY3JvbGxiYXI6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcXHJcXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLmRlZmF1bHQtaW5wdXQge1xcclxcbiAgICAgICAgQGFwcGx5IGJhc2UgYm9yZGVyLW5ldXRyYWxfNyB0ZXh0LW5ldXRyYWxfNyByb3VuZGVkLVsxNnB4XTtcXHJcXG4gICAgfVxcclxcbn1cXHJcXG5cXHJcXG5pbnB1dC5jb250aW51b3VzLW51bWJlciB7XFxyXFxuICAgIGFwcGVhcmFuY2U6IG5vbmU7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcclxcbiAgICAtbW96LWFwcGVhcmFuY2U6IHRleHRmaWVsZDtcXHJcXG59XFxyXFxuXFxyXFxuaW5wdXQuY29udGludW91cy1udW1iZXI6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxyXFxuaW5wdXQuY29udGludW91cy1udW1iZXI6Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcclxcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbn1cXHJcXG5cXHJcXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYGAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W10sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIlwiLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGA6cm9vdCB7XHJcbiAgLS1wcmltYXJ5OiAyNTUsIDAsIDA7XHJcbiAgLS1wcmltYXJ5X2hpZ2hsaWdodDogMCwgMjU1LCAwO1xyXG4gIC0tc2Vjb25kYXJ5OiAwLCAwLCAyNTU7XHJcbiAgLS1uZXV0cmFsXzA6IDI0MCwgMjQwLCAyNDA7XHJcbiAgLS1uZXV0cmFsXzE6IDIyMCwgMjIwLCAyMjA7XHJcbiAgLS1uZXV0cmFsXzI6IDIwMCwgMjAwLCAyMDA7XHJcbiAgLS1uZXV0cmFsXzM6IDE4MCwgMTgwLCAxODA7XHJcbiAgLS1uZXV0cmFsXzQ6IDE2MCwgMTYwLCAxNjA7XHJcbiAgLS1uZXV0cmFsXzU6IDE0MCwgMTQwLCAxNDA7XHJcbiAgLS1uZXV0cmFsXzY6IDEyMCwgMTIwLCAxMjA7XHJcbiAgLS1uZXV0cmFsXzc6IDEwMCwgMTAwLCAxMDA7XHJcbiAgLS1uZXV0cmFsXzg6IDgwLCA4MCwgODA7XHJcbiAgLS1uZXV0cmFsXzk6IDYwLCA2MCwgNjA7XHJcbn1cclxuXHJcbltkYXRhLXRoZW1lPSdjdXN0b21fbGlnaHQnXVxyXG57XHJcbiAgLS1wcmltYXJ5OiAyNTAsIDI1MCwgMjUwO1xyXG4gIC0tcHJpbWFyeV9oaWdobGlnaHQ6IDI1NSwgMjU1LCAyNTU7XHJcbiAgLS1zZWNvbmRhcnk6IDIwMCwgMjAwLCAyMDA7XHJcbiAgLS1wcmltYXJ5X3RleHQ6IDkwLCA5MCwgOTA7XHJcbiAgLS1wcmltYXJ5X2hpZ2hsaWdodF90ZXh0OiAzMCwgMzAsIDMwO1xyXG4gIC0tcHJpbWFyeV9oaWdobGlnaHRfdGV4dDogMzAsIDMwLCAzMDtcclxuICAtLWluZm86IDEwMCwgMTAwLCAyNDA7XHJcbiAgLS1zdWNjZXNzOiAxMDAsIDI0MCwgMTAwO1xyXG4gIC0td2FybmluZzogMjQwLCAyNDAsIDEwMDtcclxuICAtLWVycm9yOiAyNDAsIDEwMCwgMTAwO1xyXG4gIC0tbmV1dHJhbF8wOiAyNTUsIDI1NSwgMjU1O1xyXG4gIC0tbmV1dHJhbF8xOiAyNTAsIDI1MCwgMjUwO1xyXG4gIC0tbmV1dHJhbF8yOiAyNDUsIDI0NSwgMjQ1O1xyXG4gIC0tbmV1dHJhbF8zOiAyNDAsIDI0MCwgMjQwO1xyXG4gIC0tbmV1dHJhbF80OiAyMzUsIDIzNSwgMjM1O1xyXG4gIC0tbmV1dHJhbF81OiAxMCwgMTAsIDEwO1xyXG4gIC0tbmV1dHJhbF82OiAxNSwgMTUsIDE1O1xyXG4gIC0tbmV1dHJhbF83OiAyMCwgMjAsIDIwO1xyXG4gIC0tbmV1dHJhbF84OiAyNSwgMjUsIDI1O1xyXG4gIC0tbmV1dHJhbF85OiAzMCwgMzAsIDMwO1xyXG59XHJcblxyXG5bZGF0YS10aGVtZT0nY3VzdG9tX2RhcmsnXVxyXG57XHJcbiAgLS1wcmltYXJ5OiA0MCwgNDAsIDQwO1xyXG4gIC0tcHJpbWFyeV9oaWdobGlnaHQ6IDMwLCAzMCwgMzA7XHJcbiAgLS1zZWNvbmRhcnk6IDIwLCAyMCwgMjA7XHJcbiAgLS1wcmltYXJ5X3RleHQ6IDI1NSwgMjU1LCAyNTU7XHJcbiAgLS1wcmltYXJ5X2hpZ2hsaWdodF90ZXh0OiAyNTAsIDI1MCwgMjUwO1xyXG4gIC0taW5mbzogMTAwLCAxMDAsIDI0MDtcclxuICAtLXN1Y2Nlc3M6IDEwMCwgMjQwLCAxMDA7XHJcbiAgLS13YXJuaW5nOiAyNDAsIDI0MCwgMTAwO1xyXG4gIC0tZXJyb3I6IDI0MCwgMTAwLCAxMDA7XHJcbiAgLS1uZXV0cmFsXzA6IDI1NSwgMjU1LCAyNTU7XHJcbiAgLS1uZXV0cmFsXzE6IDI1MCwgMjUwLCAyNTA7XHJcbiAgLS1uZXV0cmFsXzI6IDI0NSwgMjQ1LCAyNDU7XHJcbiAgLS1uZXV0cmFsXzM6IDI0MCwgMjQwLCAyNDA7XHJcbiAgLS1uZXV0cmFsXzQ6IDIzNSwgMjM1LCAyMzU7XHJcbiAgLS1uZXV0cmFsXzU6IDEwLCAxMCwgMTA7XHJcbiAgLS1uZXV0cmFsXzY6IDE1LCAxNSwgMTU7XHJcbiAgLS1uZXV0cmFsXzc6IDIwLCAyMCwgMjA7XHJcbiAgLS1uZXV0cmFsXzg6IDI1LCAyNSwgMjU7XHJcbiAgLS1uZXV0cmFsXzk6IDMwLCAzMCwgMzA7XHJcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zY3JpcHRzL3N0eWxlcy90aGVtZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usb0JBQW9CO0VBQ3BCLDhCQUE4QjtFQUM5QixzQkFBc0I7RUFDdEIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQix1QkFBdUI7RUFDdkIsdUJBQXVCO0FBQ3pCOztBQUVBOztFQUVFLHdCQUF3QjtFQUN4QixrQ0FBa0M7RUFDbEMsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQixvQ0FBb0M7RUFDcEMsb0NBQW9DO0VBQ3BDLHFCQUFxQjtFQUNyQix3QkFBd0I7RUFDeEIsd0JBQXdCO0VBQ3hCLHNCQUFzQjtFQUN0QiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLHVCQUF1QjtFQUN2Qix1QkFBdUI7RUFDdkIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtFQUN2Qix1QkFBdUI7QUFDekI7O0FBRUE7O0VBRUUscUJBQXFCO0VBQ3JCLCtCQUErQjtFQUMvQix1QkFBdUI7RUFDdkIsNkJBQTZCO0VBQzdCLHVDQUF1QztFQUN2QyxxQkFBcUI7RUFDckIsd0JBQXdCO0VBQ3hCLHdCQUF3QjtFQUN4QixzQkFBc0I7RUFDdEIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0VBQzFCLDBCQUEwQjtFQUMxQix1QkFBdUI7RUFDdkIsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtFQUN2Qix1QkFBdUI7RUFDdkIsdUJBQXVCO0FBQ3pCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjpyb290IHtcXHJcXG4gIC0tcHJpbWFyeTogMjU1LCAwLCAwO1xcclxcbiAgLS1wcmltYXJ5X2hpZ2hsaWdodDogMCwgMjU1LCAwO1xcclxcbiAgLS1zZWNvbmRhcnk6IDAsIDAsIDI1NTtcXHJcXG4gIC0tbmV1dHJhbF8wOiAyNDAsIDI0MCwgMjQwO1xcclxcbiAgLS1uZXV0cmFsXzE6IDIyMCwgMjIwLCAyMjA7XFxyXFxuICAtLW5ldXRyYWxfMjogMjAwLCAyMDAsIDIwMDtcXHJcXG4gIC0tbmV1dHJhbF8zOiAxODAsIDE4MCwgMTgwO1xcclxcbiAgLS1uZXV0cmFsXzQ6IDE2MCwgMTYwLCAxNjA7XFxyXFxuICAtLW5ldXRyYWxfNTogMTQwLCAxNDAsIDE0MDtcXHJcXG4gIC0tbmV1dHJhbF82OiAxMjAsIDEyMCwgMTIwO1xcclxcbiAgLS1uZXV0cmFsXzc6IDEwMCwgMTAwLCAxMDA7XFxyXFxuICAtLW5ldXRyYWxfODogODAsIDgwLCA4MDtcXHJcXG4gIC0tbmV1dHJhbF85OiA2MCwgNjAsIDYwO1xcclxcbn1cXHJcXG5cXHJcXG5bZGF0YS10aGVtZT0nY3VzdG9tX2xpZ2h0J11cXHJcXG57XFxyXFxuICAtLXByaW1hcnk6IDI1MCwgMjUwLCAyNTA7XFxyXFxuICAtLXByaW1hcnlfaGlnaGxpZ2h0OiAyNTUsIDI1NSwgMjU1O1xcclxcbiAgLS1zZWNvbmRhcnk6IDIwMCwgMjAwLCAyMDA7XFxyXFxuICAtLXByaW1hcnlfdGV4dDogOTAsIDkwLCA5MDtcXHJcXG4gIC0tcHJpbWFyeV9oaWdobGlnaHRfdGV4dDogMzAsIDMwLCAzMDtcXHJcXG4gIC0tcHJpbWFyeV9oaWdobGlnaHRfdGV4dDogMzAsIDMwLCAzMDtcXHJcXG4gIC0taW5mbzogMTAwLCAxMDAsIDI0MDtcXHJcXG4gIC0tc3VjY2VzczogMTAwLCAyNDAsIDEwMDtcXHJcXG4gIC0td2FybmluZzogMjQwLCAyNDAsIDEwMDtcXHJcXG4gIC0tZXJyb3I6IDI0MCwgMTAwLCAxMDA7XFxyXFxuICAtLW5ldXRyYWxfMDogMjU1LCAyNTUsIDI1NTtcXHJcXG4gIC0tbmV1dHJhbF8xOiAyNTAsIDI1MCwgMjUwO1xcclxcbiAgLS1uZXV0cmFsXzI6IDI0NSwgMjQ1LCAyNDU7XFxyXFxuICAtLW5ldXRyYWxfMzogMjQwLCAyNDAsIDI0MDtcXHJcXG4gIC0tbmV1dHJhbF80OiAyMzUsIDIzNSwgMjM1O1xcclxcbiAgLS1uZXV0cmFsXzU6IDEwLCAxMCwgMTA7XFxyXFxuICAtLW5ldXRyYWxfNjogMTUsIDE1LCAxNTtcXHJcXG4gIC0tbmV1dHJhbF83OiAyMCwgMjAsIDIwO1xcclxcbiAgLS1uZXV0cmFsXzg6IDI1LCAyNSwgMjU7XFxyXFxuICAtLW5ldXRyYWxfOTogMzAsIDMwLCAzMDtcXHJcXG59XFxyXFxuXFxyXFxuW2RhdGEtdGhlbWU9J2N1c3RvbV9kYXJrJ11cXHJcXG57XFxyXFxuICAtLXByaW1hcnk6IDQwLCA0MCwgNDA7XFxyXFxuICAtLXByaW1hcnlfaGlnaGxpZ2h0OiAzMCwgMzAsIDMwO1xcclxcbiAgLS1zZWNvbmRhcnk6IDIwLCAyMCwgMjA7XFxyXFxuICAtLXByaW1hcnlfdGV4dDogMjU1LCAyNTUsIDI1NTtcXHJcXG4gIC0tcHJpbWFyeV9oaWdobGlnaHRfdGV4dDogMjUwLCAyNTAsIDI1MDtcXHJcXG4gIC0taW5mbzogMTAwLCAxMDAsIDI0MDtcXHJcXG4gIC0tc3VjY2VzczogMTAwLCAyNDAsIDEwMDtcXHJcXG4gIC0td2FybmluZzogMjQwLCAyNDAsIDEwMDtcXHJcXG4gIC0tZXJyb3I6IDI0MCwgMTAwLCAxMDA7XFxyXFxuICAtLW5ldXRyYWxfMDogMjU1LCAyNTUsIDI1NTtcXHJcXG4gIC0tbmV1dHJhbF8xOiAyNTAsIDI1MCwgMjUwO1xcclxcbiAgLS1uZXV0cmFsXzI6IDI0NSwgMjQ1LCAyNDU7XFxyXFxuICAtLW5ldXRyYWxfMzogMjQwLCAyNDAsIDI0MDtcXHJcXG4gIC0tbmV1dHJhbF80OiAyMzUsIDIzNSwgMjM1O1xcclxcbiAgLS1uZXV0cmFsXzU6IDEwLCAxMCwgMTA7XFxyXFxuICAtLW5ldXRyYWxfNjogMTUsIDE1LCAxNTtcXHJcXG4gIC0tbmV1dHJhbF83OiAyMCwgMjAsIDIwO1xcclxcbiAgLS1uZXV0cmFsXzg6IDI1LCAyNSwgMjU7XFxyXFxuICAtLW5ldXRyYWxfOTogMzAsIDMwLCAzMDtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4LmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4LmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiZXhwb3J0IGVudW0gVHJhbnNhY3Rpb25UeXBlIHtcclxuICAgIEVudHJ5LFxyXG4gICAgRXhpdCxcclxufSIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbnRpdHkge1xyXG4gICAgcHJvdGVjdGVkIF9pZDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIF9jcmVhdGlvbkRhdGU6IERhdGU7XHJcbiAgICBwcm90ZWN0ZWQgX2xhc3RNb2RpZmllZDogRGF0ZTtcclxuICAgIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIF9kZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgY3JlYXRpb25EYXRlOiBEYXRlLCBsYXN0TW9kaWZpZWQ6IERhdGUsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9jcmVhdGlvbkRhdGUgPSBjcmVhdGlvbkRhdGU7XHJcbiAgICAgICAgdGhpcy5fbGFzdE1vZGlmaWVkID0gbGFzdE1vZGlmaWVkO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldEluZm8oKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5faWQsXHJcbiAgICAgICAgICAgIGNyZWF0aW9uRGF0ZTogdGhpcy5fY3JlYXRpb25EYXRlLFxyXG4gICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IHRoaXMuX2xhc3RNb2RpZmllZCxcclxuICAgICAgICAgICAgbmFtZTogdGhpcy5fbmFtZSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuX2Rlc2NyaXB0aW9uXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRyYW5zYWN0aW9uVHlwZSB9IGZyb20gXCIuLi9lbnVtcy90cmFuc2FjdGlvbi10eXBlXCI7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zYWN0aW9uIGV4dGVuZHMgRW50aXR5IHtcclxuICAgIHByaXZhdGUgX3R5cGU6IFRyYW5zYWN0aW9uVHlwZTtcclxuICAgIHByaXZhdGUgX2FnZW50OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF90cmFuc2FjdGlvbkRhdGU6IERhdGU7XHJcbiAgICBwcml2YXRlIF9yZWZlcmVuY2VEYXRlOiBEYXRlO1xyXG4gICAgcHJpdmF0ZSBfdmFsdWU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2RldGFpbHM6IHN0cmluZyB8IG51bGw7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIGNyZWF0aW9uRGF0ZTogRGF0ZSwgbGFzdE1vZGlmaWVkOiBEYXRlLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIHR5cGU6IFRyYW5zYWN0aW9uVHlwZSwgYWdlbnQ6IHN0cmluZywgdHJhbnNhY3Rpb25EYXRlOiBEYXRlLCByZWZlcmVuY2VEYXRlOiBEYXRlLCB2YWx1ZTogbnVtYmVyLCBkZXRhaWxzOiBzdHJpbmcgfCBudWxsKXtcclxuICAgIFx0c3VwZXIoaWQsIGNyZWF0aW9uRGF0ZSwgbGFzdE1vZGlmaWVkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuX2FnZW50ID0gYWdlbnQ7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNhY3Rpb25EYXRlID0gdHJhbnNhY3Rpb25EYXRlO1xyXG4gICAgICAgIHRoaXMuX3JlZmVyZW5jZURhdGUgPSByZWZlcmVuY2VEYXRlO1xyXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fZGV0YWlscyA9IGRldGFpbHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldEluZm8oKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5zdXBlci5HZXRJbmZvKCksXHJcblxyXG4gICAgICAgICAgICB0eXBlOiB0aGlzLl90eXBlLFxyXG4gICAgICAgICAgICBhZ2VudDogdGhpcy5fYWdlbnQsXHJcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uRGF0ZTogdGhpcy5fdHJhbnNhY3Rpb25EYXRlLFxyXG4gICAgICAgICAgICByZWZlcmVuY2VEYXRlOiB0aGlzLl9yZWZlcmVuY2VEYXRlLFxyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5fdmFsdWUsXHJcbiAgICAgICAgICAgIGRldGFpbHM6IHRoaXMuX2RldGFpbHMsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBhdGhNYW5hZ2VyIH0gZnJvbSAnLi9wYXRoLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBUcmFuc2FjdGlvbnNNYW5hZ2VyIH0gZnJvbSAnLi90cmFuc2FjdGlvbnMtbWFuYWdlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogRGF0YWJhc2VNYW5hZ2VyO1xyXG5cclxuICAgIHByaXZhdGUgX3RyYW5zYWN0aW9uc01hbmFnZXI6IFRyYW5zYWN0aW9uc01hbmFnZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIFJPT1QgOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGZvbGRlciA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGZpbGVuYW1lIDogc3RyaW5nID0gXCJ0cmFuc2FjdGlvbnNcIjtcclxuICAgIHByaXZhdGUgZm9ybWF0IDogc3RyaW5nID0gXCJjc3ZcIjtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ST09UID0gUGF0aE1hbmFnZXIuR2V0SW5zdGFuY2UoKS5HZXRSb290KClcclxuXHJcbiAgICAgICAgdGhpcy5Jbml0aWFsaXplRGF0YWJhc2VzKClcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEdldEluc3RhbmNlKCkgOiBEYXRhYmFzZU1hbmFnZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbnN0YW5jZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IERhdGFiYXNlTWFuYWdlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBJbml0aWFsaXplRGF0YWJhc2VzKCl7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNhY3Rpb25zTWFuYWdlciA9IFRyYW5zYWN0aW9uc01hbmFnZXIuR2V0SW5zdGFuY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0VHJhbnNhY3Rpb25NYW5hZ2VyKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zYWN0aW9uc01hbmFnZXI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhdGhNYW5hZ2Vye1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBQYXRoTWFuYWdlcjtcclxuXHJcbiAgICBwcml2YXRlIFJPT1QgOiBzdHJpbmc7XHJcbiAgICAgXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ST09UID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5ST09UKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0SW5zdGFuY2UoKSA6IFBhdGhNYW5hZ2VyIHtcclxuICAgICAgICBpZiAodGhpcy5faW5zdGFuY2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBQYXRoTWFuYWdlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFJvb3QoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ST09UO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJlYWQoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEFscGluZSBmcm9tIFwiYWxwaW5lanNcIjtcbmltcG9ydCBcIi4vc3R5bGVzL2luZGV4LmNzc1wiO1xuaW1wb3J0IHsgRGF0YWJhc2VNYW5hZ2VyIH0gZnJvbSBcIi4vZGF0YWJhc2UtbWFuYWdlclwiO1xuaW1wb3J0IHsgUGF0aE1hbmFnZXIgfSBmcm9tIFwiLi9wYXRoLW1hbmFnZXJcIjtcblxuYXN5bmMgZnVuY3Rpb24gbG9hZENvbXBvbmVudChmaWxlUGF0aDogc3RyaW5nLCB0YXJnZXRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChmaWxlUGF0aCk7XG4gICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRJZCkhLmlubmVySFRNTCA9IGh0bWxDb250ZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGxvYWQgJHtmaWxlUGF0aH06YCwgcmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBsb2FkaW5nICR7ZmlsZVBhdGh9OmAsIGVycm9yKTtcbiAgICB9XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAgICAgQWxwaW5lOiB0eXBlb2YgQWxwaW5lO1xuICAgIH1cbn1cblxud2luZG93LkFscGluZSA9IEFscGluZTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBsb2FkQ29tcG9uZW50KCcuLi92aWV3cy9oZWFkZXIuaHRtbCcsICdoZWFkZXItY29udGFpbmVyJyk7XG5cbiAgICBBbHBpbmUuc3RhcnQoKTtcbiAgICBjb25zb2xlLmxvZyhcIlJFTkRFUkVSXCIpO1xuICAgIGNvbnN0IHBhdGhNYW5hZ2VyID0gUGF0aE1hbmFnZXIuR2V0SW5zdGFuY2UoKTtcbiAgICBjb25zdCB0cmFuc2FjdGlvbnNNYW5hZ2VyID0gRGF0YWJhc2VNYW5hZ2VyLkdldEluc3RhbmNlKCkuR2V0VHJhbnNhY3Rpb25NYW5hZ2VyKClcbiAgICBBbHBpbmUuc3RvcmUoXCJUcmFuc2FjdGlvbnNNYW5hZ2VyXCIsIHRyYW5zYWN0aW9uc01hbmFnZXIpO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCAnY3VzdG9tX2xpZ2h0Jyk7XG59KTsiLCJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCB7IElDcmVhdGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2ljcmVhdGUnO1xyXG5pbXBvcnQgeyBJUmVhZCB9IGZyb20gJy4uL2ludGVyZmFjZXMvaXJlYWQnO1xyXG5pbXBvcnQgeyBJVXBkYXRlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pdXBkYXRlJztcclxuaW1wb3J0IHsgSURlbGV0ZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvaWRlbGV0ZSc7XHJcbmltcG9ydCB7IFRyYW5zYWN0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL3RyYW5zYWN0aW9uJztcclxuaW1wb3J0IHsgUGF0aE1hbmFnZXIgfSBmcm9tICcuL3BhdGgtbWFuYWdlcic7XHJcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSBcImNzdi1wYXJzZS9zeW5jXCI7XHJcbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gXCJjc3Ytc3RyaW5naWZ5L3N5bmNcIjtcclxuaW1wb3J0IHsgVHJhbnNhY3Rpb25UeXBlIH0gZnJvbSBcIi4uL2VudW1zL3RyYW5zYWN0aW9uLXR5cGVcIjtcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNhY3Rpb25zTWFuYWdlciBpbXBsZW1lbnRzIElSZWFkLCBJVXBkYXRlLCBJRGVsZXRlIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogVHJhbnNhY3Rpb25zTWFuYWdlcjtcclxuXHJcbiAgICBwcml2YXRlIF90cmFuc2FjdGlvbnM6IFRyYW5zYWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIFJPT1QgOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGZvbGRlciA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGZpbGVuYW1lIDogc3RyaW5nID0gXCJ0cmFuc2FjdGlvbnNcIjtcclxuICAgIHByaXZhdGUgZm9ybWF0IDogc3RyaW5nID0gXCJjc3ZcIjtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ST09UID0gUGF0aE1hbmFnZXIuR2V0SW5zdGFuY2UoKS5HZXRSb290KCk7XHJcblxyXG4gICAgICAgIHRoaXMuUmVhZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgR2V0SW5zdGFuY2UoKSA6IFRyYW5zYWN0aW9uc01hbmFnZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbnN0YW5jZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IFRyYW5zYWN0aW9uc01hbmFnZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDcmVhdGUoXHJcbiAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgIHR5cGU6IHN0cmluZyxcclxuICAgICAgICBhZ2VudDogc3RyaW5nLFxyXG4gICAgICAgIGRhdGU6IHN0cmluZyxcclxuICAgICAgICByZWZlcmVuY2VEYXRlOiBzdHJpbmcsXHJcbiAgICAgICAgdmFsdWU6IG51bWJlcixcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgICAgIGRldGFpbHM/OiBzdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IHBhdGguam9pbih0aGlzLlJPT1QsIFwiZGF0YWJhc2VcIiwgXCJ0cmFuc2FjdGlvbnMuY3N2XCIpXHJcbiAgICAgICAgXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXIgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiLCBcImNyZWF0aW9uRGF0ZVwiLCBcImxhc3RNb2RpZmllZFwiLCBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcInR5cGVcIiwgXCJhZ2VudFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHJhbnNhY3Rpb25EYXRlXCIsIFwicmVmZXJlbmNlRGF0ZVwiLCBcInZhbHVlXCIsIFwibmFtZVwiLCBcImRldGFpbHNcIlxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdDU1YgPSBzdHJpbmdpZnkoW10sIHsgaGVhZGVyOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlLCBuZXdDU1YsICd1dGYtOCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDU1YgZmlsZSBjcmVhdGVkIHdpdGggaGVhZGVyLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgJ3V0Zi04Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZHMgPSBwYXJzZShmaWxlQ29udGVudCwge1xyXG4gICAgICAgICAgICAgICAgY29sdW1uczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNraXBfZW1wdHlfbGluZXM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXdJZCA9IHJlY29yZHMubGVuZ3RoID4gMCA/IE1hdGgubWF4KC4uLnJlY29yZHMubWFwKChyOiBhbnkpID0+IHBhcnNlSW50KHIuaWQpKSkgKyAxIDogMTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGN1cnJlbnREYXRlLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxldCBkZXRhaWxzUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAvLyBpZiAodHJhbnNhY3Rpb25EYXRhLmRldGFpbHMgJiYgZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4odGhpcy5ST09ULCB0cmFuc2FjdGlvbkRhdGEuZGV0YWlscykpKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBkZXRhaWxzUGF0aCA9IHRyYW5zYWN0aW9uRGF0YS5kZXRhaWxzO1xyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdHJhbnNhY3Rpb25UeXBlID0gVHJhbnNhY3Rpb25UeXBlLkVudHJ5XHJcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlID09IFwiZW50cnlcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25UeXBlID0gVHJhbnNhY3Rpb25UeXBlLkVudHJ5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0eXBlID09IFwiZXhpdFwiKXtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2FjdGlvblR5cGUgPSBUcmFuc2FjdGlvblR5cGUuRXhpdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCB0cmFuc2FjdGlvbiB0eXBlLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcHJvY2Vzc2luZyBDU1YgZmlsZSB0cmFuc2FjdGlvbiB0eXBlOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb25EYXRlID0gbmV3IERhdGUoMjAyNSwgMSwgMzApO1xyXG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2VEYXRlID0gbmV3IERhdGUoMjAyNSwgMSwgMzApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24oXHJcbiAgICAgICAgICAgICAgICBuZXdJZCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudERhdGUsXHJcbiAgICAgICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvblR5cGUsXHJcbiAgICAgICAgICAgICAgICBhZ2VudCxcclxuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uRGF0ZSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZURhdGUsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgICAgICAgIGRldGFpbHMgfHwgXCJcIixcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNhY3Rpb25zLnB1c2godHJhbnNhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb25QbGFpbiA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiBuZXdJZCxcclxuICAgICAgICAgICAgICAgIGNyZWF0aW9uRGF0ZTogY3VycmVudERhdGUudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogY3VycmVudERhdGUudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICAgICAgYWdlbnQ6IGFnZW50LFxyXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25EYXRlOiB0cmFuc2FjdGlvbkRhdGUudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZURhdGU6IHJlZmVyZW5jZURhdGUudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgICAgIGRldGFpbHM6IGRldGFpbHMgfHwgXCJcIixcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJlY29yZHMucHVzaCh0cmFuc2FjdGlvblBsYWluKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRDU1YgPSBzdHJpbmdpZnkocmVjb3JkcywgeyBoZWFkZXI6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgdXBkYXRlZENTViwgJ3V0Zi04Jyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUcmFuc2FjdGlvbiBzdWNjZXNzZnVsbHkgYWRkZWQgdG8gQ1NWIGZpbGUuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIENTViBmaWxlOicsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFJlYWQoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IHBhdGguam9pbih0aGlzLlJPT1QsIFwiZGF0YWJhc2VcIiwgXCJ0cmFuc2FjdGlvbnMuY3N2XCIpXHJcbiAgICAgICAgY29uc29sZS5sb2coZmlsZSlcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXIgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiLCBcImNyZWF0aW9uRGF0ZVwiLCBcImxhc3RNb2RpZmllZFwiLCBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcInR5cGVcIiwgXCJhZ2VudFwiLCBcInRyYW5zYWN0aW9uRGF0ZVwiLCBcInJlZmVyZW5jZURhdGVcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiLCBcIm5hbWVcIiwgXCJkZXRhaWxzXCJcclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Q1NWID0gc3RyaW5naWZ5KFtdLCB7IGhlYWRlcjogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgbmV3Q1NWLCAndXRmLTgnKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ1NWIGZpbGUgY3JlYXRlZCB3aXRoIGhlYWRlci5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlLCAndXRmLTgnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZmlsZUNvbnRlbnQpXHJcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZHMgPSBwYXJzZShmaWxlQ29udGVudCwge1xyXG4gICAgICAgICAgICAgICAgY29sdW1uczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNraXBfZW1wdHlfbGluZXM6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2FjdGlvbnMgPSByZWNvcmRzLm1hcCgocmVjb3JkOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5uZXdJZCxcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmQuY3VycmVudERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLmN1cnJlbnREYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmQudHlwZSxcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmQuYWdlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLnRyYW5zYWN0aW9uRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmQucmVmZXJlbmNlRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICByZWNvcmQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLmRldGFpbHMgfHwgXCJcIixcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1RyYW5zYWN0aW9ucyBzdWNjZXNzZnVsbHkgcmVhZCBmcm9tIENTViBmaWxlLicpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlYWRpbmcgQ1NWIGZpbGU6JywgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVXBkYXRlKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIERlbGV0ZSgpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIENzdkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcihjb2RlLCBtZXNzYWdlLCBvcHRpb25zLCAuLi5jb250ZXh0cykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2UpKSBtZXNzYWdlID0gbWVzc2FnZS5qb2luKFwiIFwiKS50cmltKCk7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIENzdkVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICBmb3IgKGNvbnN0IGNvbnRleHQgb2YgY29udGV4dHMpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjb250ZXh0W2tleV07XG4gICAgICAgIHRoaXNba2V5XSA9IEJ1ZmZlci5pc0J1ZmZlcih2YWx1ZSlcbiAgICAgICAgICA/IHZhbHVlLnRvU3RyaW5nKG9wdGlvbnMuZW5jb2RpbmcpXG4gICAgICAgICAgOiB2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IHZhbHVlXG4gICAgICAgICAgICA6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgaXNfb2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiBvYmogIT09IG51bGwgJiYgIUFycmF5LmlzQXJyYXkob2JqKTtcbn07XG5cbmNvbnN0IG5vcm1hbGl6ZV9jb2x1bW5zX2FycmF5ID0gZnVuY3Rpb24gKGNvbHVtbnMpIHtcbiAgY29uc3Qgbm9ybWFsaXplZENvbHVtbnMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBjb2x1bW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGNvbHVtbiA9IGNvbHVtbnNbaV07XG4gICAgaWYgKGNvbHVtbiA9PT0gdW5kZWZpbmVkIHx8IGNvbHVtbiA9PT0gbnVsbCB8fCBjb2x1bW4gPT09IGZhbHNlKSB7XG4gICAgICBub3JtYWxpemVkQ29sdW1uc1tpXSA9IHsgZGlzYWJsZWQ6IHRydWUgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb2x1bW4gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG5vcm1hbGl6ZWRDb2x1bW5zW2ldID0geyBuYW1lOiBjb2x1bW4gfTtcbiAgICB9IGVsc2UgaWYgKGlzX29iamVjdChjb2x1bW4pKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbHVtbi5uYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBDc3ZFcnJvcihcIkNTVl9PUFRJT05fQ09MVU1OU19NSVNTSU5HX05BTUVcIiwgW1xuICAgICAgICAgIFwiT3B0aW9uIGNvbHVtbnMgbWlzc2luZyBuYW1lOlwiLFxuICAgICAgICAgIGBwcm9wZXJ0eSBcIm5hbWVcIiBpcyByZXF1aXJlZCBhdCBwb3NpdGlvbiAke2l9YCxcbiAgICAgICAgICBcIndoZW4gY29sdW1uIGlzIGFuIG9iamVjdCBsaXRlcmFsXCIsXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgICAgbm9ybWFsaXplZENvbHVtbnNbaV0gPSBjb2x1bW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBDc3ZFcnJvcihcIkNTVl9JTlZBTElEX0NPTFVNTl9ERUZJTklUSU9OXCIsIFtcbiAgICAgICAgXCJJbnZhbGlkIGNvbHVtbiBkZWZpbml0aW9uOlwiLFxuICAgICAgICBcImV4cGVjdCBhIHN0cmluZyBvciBhIGxpdGVyYWwgb2JqZWN0LFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkoY29sdW1uKX0gYXQgcG9zaXRpb24gJHtpfWAsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5vcm1hbGl6ZWRDb2x1bW5zO1xufTtcblxuY2xhc3MgUmVzaXplYWJsZUJ1ZmZlciB7XG4gIGNvbnN0cnVjdG9yKHNpemUgPSAxMDApIHtcbiAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICB0aGlzLmJ1ZiA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShzaXplKTtcbiAgfVxuICBwcmVwZW5kKHZhbCkge1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGggKyB2YWwubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA+PSB0aGlzLnNpemUpIHtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICAgICAgaWYgKGxlbmd0aCA+PSB0aGlzLnNpemUpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcihcIklOVkFMSURfQlVGRkVSX1NUQVRFXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBidWYgPSB0aGlzLmJ1ZjtcbiAgICAgIHRoaXMuYnVmID0gQnVmZmVyLmFsbG9jVW5zYWZlKHRoaXMuc2l6ZSk7XG4gICAgICB2YWwuY29weSh0aGlzLmJ1ZiwgMCk7XG4gICAgICBidWYuY29weSh0aGlzLmJ1ZiwgdmFsLmxlbmd0aCk7XG4gICAgICB0aGlzLmxlbmd0aCArPSB2YWwubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aCsrO1xuICAgICAgaWYgKGxlbmd0aCA9PT0gdGhpcy5zaXplKSB7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBidWYgPSB0aGlzLmNsb25lKCk7XG4gICAgICB0aGlzLmJ1ZlswXSA9IHZhbDtcbiAgICAgIGJ1Zi5jb3B5KHRoaXMuYnVmLCAxLCAwLCBsZW5ndGgpO1xuICAgIH1cbiAgfVxuICBhcHBlbmQodmFsKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGgrKztcbiAgICBpZiAobGVuZ3RoID09PSB0aGlzLnNpemUpIHtcbiAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuICAgIHRoaXMuYnVmW2xlbmd0aF0gPSB2YWw7XG4gIH1cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHRoaXMuYnVmLnNsaWNlKDAsIHRoaXMubGVuZ3RoKSk7XG4gIH1cbiAgcmVzaXplKCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgIHRoaXMuc2l6ZSA9IHRoaXMuc2l6ZSAqIDI7XG4gICAgY29uc3QgYnVmID0gQnVmZmVyLmFsbG9jVW5zYWZlKHRoaXMuc2l6ZSk7XG4gICAgdGhpcy5idWYuY29weShidWYsIDAsIDAsIGxlbmd0aCk7XG4gICAgdGhpcy5idWYgPSBidWY7XG4gIH1cbiAgdG9TdHJpbmcoZW5jb2RpbmcpIHtcbiAgICBpZiAoZW5jb2RpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmJ1Zi5zbGljZSgwLCB0aGlzLmxlbmd0aCkudG9TdHJpbmcoZW5jb2RpbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmJ1Zi5zbGljZSgwLCB0aGlzLmxlbmd0aCkpO1xuICAgIH1cbiAgfVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoXCJ1dGY4XCIpO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgfVxufVxuXG4vLyB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJzXG4vLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9XaGl0ZXNwYWNlX2NoYXJhY3RlclxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9HdWlkZS9SZWd1bGFyX0V4cHJlc3Npb25zL0NoYXJhY3Rlcl9DbGFzc2VzI1R5cGVzXG4vLyBcXGZcXG5cXHJcXHRcXHZcXHUwMGEwXFx1MTY4MFxcdTIwMDAtXFx1MjAwYVxcdTIwMjhcXHUyMDI5XFx1MjAyZlxcdTIwNWZcXHUzMDAwXFx1ZmVmZlxuY29uc3QgbnAgPSAxMjtcbmNvbnN0IGNyJDEgPSAxMzsgLy8gYFxccmAsIGNhcnJpYWdlIHJldHVybiwgMHgwRCBpbiBoZXhhZMOpY2ltYWwsIDEzIGluIGRlY2ltYWxcbmNvbnN0IG5sJDEgPSAxMDsgLy8gYFxcbmAsIG5ld2xpbmUsIDB4MEEgaW4gaGV4YWRlY2ltYWwsIDEwIGluIGRlY2ltYWxcbmNvbnN0IHNwYWNlID0gMzI7XG5jb25zdCB0YWIgPSA5O1xuXG5jb25zdCBpbml0X3N0YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICBib21Ta2lwcGVkOiBmYWxzZSxcbiAgICBidWZCeXRlc1N0YXJ0OiAwLFxuICAgIGNhc3RGaWVsZDogb3B0aW9ucy5jYXN0X2Z1bmN0aW9uLFxuICAgIGNvbW1lbnRpbmc6IGZhbHNlLFxuICAgIC8vIEN1cnJlbnQgZXJyb3IgZW5jb3VudGVyZWQgYnkgYSByZWNvcmRcbiAgICBlcnJvcjogdW5kZWZpbmVkLFxuICAgIGVuYWJsZWQ6IG9wdGlvbnMuZnJvbV9saW5lID09PSAxLFxuICAgIGVzY2FwaW5nOiBmYWxzZSxcbiAgICBlc2NhcGVJc1F1b3RlOlxuICAgICAgQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMuZXNjYXBlKSAmJlxuICAgICAgQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucXVvdGUpICYmXG4gICAgICBCdWZmZXIuY29tcGFyZShvcHRpb25zLmVzY2FwZSwgb3B0aW9ucy5xdW90ZSkgPT09IDAsXG4gICAgLy8gY29sdW1ucyBjYW4gYmUgYGZhbHNlYCwgYHRydWVgLCBgQXJyYXlgXG4gICAgZXhwZWN0ZWRSZWNvcmRMZW5ndGg6IEFycmF5LmlzQXJyYXkob3B0aW9ucy5jb2x1bW5zKVxuICAgICAgPyBvcHRpb25zLmNvbHVtbnMubGVuZ3RoXG4gICAgICA6IHVuZGVmaW5lZCxcbiAgICBmaWVsZDogbmV3IFJlc2l6ZWFibGVCdWZmZXIoMjApLFxuICAgIGZpcnN0TGluZVRvSGVhZGVyczogb3B0aW9ucy5jYXN0X2ZpcnN0X2xpbmVfdG9faGVhZGVyLFxuICAgIG5lZWRNb3JlRGF0YVNpemU6IE1hdGgubWF4KFxuICAgICAgLy8gU2tpcCBpZiB0aGUgcmVtYWluaW5nIGJ1ZmZlciBzbWFsbGVyIHRoYW4gY29tbWVudFxuICAgICAgb3B0aW9ucy5jb21tZW50ICE9PSBudWxsID8gb3B0aW9ucy5jb21tZW50Lmxlbmd0aCA6IDAsXG4gICAgICAvLyBTa2lwIGlmIHRoZSByZW1haW5pbmcgYnVmZmVyIGNhbiBiZSBkZWxpbWl0ZXJcbiAgICAgIC4uLm9wdGlvbnMuZGVsaW1pdGVyLm1hcCgoZGVsaW1pdGVyKSA9PiBkZWxpbWl0ZXIubGVuZ3RoKSxcbiAgICAgIC8vIFNraXAgaWYgdGhlIHJlbWFpbmluZyBidWZmZXIgY2FuIGJlIGVzY2FwZSBzZXF1ZW5jZVxuICAgICAgb3B0aW9ucy5xdW90ZSAhPT0gbnVsbCA/IG9wdGlvbnMucXVvdGUubGVuZ3RoIDogMCxcbiAgICApLFxuICAgIHByZXZpb3VzQnVmOiB1bmRlZmluZWQsXG4gICAgcXVvdGluZzogZmFsc2UsXG4gICAgc3RvcDogZmFsc2UsXG4gICAgcmF3QnVmZmVyOiBuZXcgUmVzaXplYWJsZUJ1ZmZlcigxMDApLFxuICAgIHJlY29yZDogW10sXG4gICAgcmVjb3JkSGFzRXJyb3I6IGZhbHNlLFxuICAgIHJlY29yZF9sZW5ndGg6IDAsXG4gICAgcmVjb3JkRGVsaW1pdGVyTWF4TGVuZ3RoOlxuICAgICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IDBcbiAgICAgICAgOiBNYXRoLm1heCguLi5vcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIubWFwKCh2KSA9PiB2Lmxlbmd0aCkpLFxuICAgIHRyaW1DaGFyczogW1xuICAgICAgQnVmZmVyLmZyb20oXCIgXCIsIG9wdGlvbnMuZW5jb2RpbmcpWzBdLFxuICAgICAgQnVmZmVyLmZyb20oXCJcXHRcIiwgb3B0aW9ucy5lbmNvZGluZylbMF0sXG4gICAgXSxcbiAgICB3YXNRdW90aW5nOiBmYWxzZSxcbiAgICB3YXNSb3dEZWxpbWl0ZXI6IGZhbHNlLFxuICAgIHRpbWNoYXJzOiBbXG4gICAgICBCdWZmZXIuZnJvbShCdWZmZXIuZnJvbShbY3IkMV0sIFwidXRmOFwiKS50b1N0cmluZygpLCBvcHRpb25zLmVuY29kaW5nKSxcbiAgICAgIEJ1ZmZlci5mcm9tKEJ1ZmZlci5mcm9tKFtubCQxXSwgXCJ1dGY4XCIpLnRvU3RyaW5nKCksIG9wdGlvbnMuZW5jb2RpbmcpLFxuICAgICAgQnVmZmVyLmZyb20oQnVmZmVyLmZyb20oW25wXSwgXCJ1dGY4XCIpLnRvU3RyaW5nKCksIG9wdGlvbnMuZW5jb2RpbmcpLFxuICAgICAgQnVmZmVyLmZyb20oQnVmZmVyLmZyb20oW3NwYWNlXSwgXCJ1dGY4XCIpLnRvU3RyaW5nKCksIG9wdGlvbnMuZW5jb2RpbmcpLFxuICAgICAgQnVmZmVyLmZyb20oQnVmZmVyLmZyb20oW3RhYl0sIFwidXRmOFwiKS50b1N0cmluZygpLCBvcHRpb25zLmVuY29kaW5nKSxcbiAgICBdLFxuICB9O1xufTtcblxuY29uc3QgdW5kZXJzY29yZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uIChfLCBtYXRjaCkge1xuICAgIHJldHVybiBcIl9cIiArIG1hdGNoLnRvTG93ZXJDYXNlKCk7XG4gIH0pO1xufTtcblxuY29uc3Qgbm9ybWFsaXplX29wdGlvbnMgPSBmdW5jdGlvbiAob3B0cykge1xuICBjb25zdCBvcHRpb25zID0ge307XG4gIC8vIE1lcmdlIHdpdGggdXNlciBvcHRpb25zXG4gIGZvciAoY29uc3Qgb3B0IGluIG9wdHMpIHtcbiAgICBvcHRpb25zW3VuZGVyc2NvcmUob3B0KV0gPSBvcHRzW29wdF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZW5jb2RpbmdgXG4gIC8vIE5vdGU6IGRlZmluZWQgZmlyc3QgYmVjYXVzZSBvdGhlciBvcHRpb25zIGRlcGVuZHMgb24gaXRcbiAgLy8gdG8gY29udmVydCBjaGFycy9zdHJpbmdzIGludG8gYnVmZmVycy5cbiAgaWYgKG9wdGlvbnMuZW5jb2RpbmcgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmVuY29kaW5nID09PSB0cnVlKSB7XG4gICAgb3B0aW9ucy5lbmNvZGluZyA9IFwidXRmOFwiO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuZW5jb2RpbmcgPT09IG51bGwgfHwgb3B0aW9ucy5lbmNvZGluZyA9PT0gZmFsc2UpIHtcbiAgICBvcHRpb25zLmVuY29kaW5nID0gbnVsbDtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2Ygb3B0aW9ucy5lbmNvZGluZyAhPT0gXCJzdHJpbmdcIiAmJlxuICAgIG9wdGlvbnMuZW5jb2RpbmcgIT09IG51bGxcbiAgKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fRU5DT0RJTkdcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBlbmNvZGluZzpcIixcbiAgICAgICAgXCJlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nIG9yIG51bGwgdG8gcmV0dXJuIGEgYnVmZmVyLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5lbmNvZGluZyl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgYm9tYFxuICBpZiAoXG4gICAgb3B0aW9ucy5ib20gPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuYm9tID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5ib20gPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMuYm9tID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5ib20gIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9CT01cIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBib206XCIsXG4gICAgICAgIFwiYm9tIG11c3QgYmUgdHJ1ZSxcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuYm9tKX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBjYXN0YFxuICBvcHRpb25zLmNhc3RfZnVuY3Rpb24gPSBudWxsO1xuICBpZiAoXG4gICAgb3B0aW9ucy5jYXN0ID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmNhc3QgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmNhc3QgPT09IGZhbHNlIHx8XG4gICAgb3B0aW9ucy5jYXN0ID09PSBcIlwiXG4gICkge1xuICAgIG9wdGlvbnMuY2FzdCA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5jYXN0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBvcHRpb25zLmNhc3RfZnVuY3Rpb24gPSBvcHRpb25zLmNhc3Q7XG4gICAgb3B0aW9ucy5jYXN0ID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmNhc3QgIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9DQVNUXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gY2FzdDpcIixcbiAgICAgICAgXCJjYXN0IG11c3QgYmUgdHJ1ZSBvciBhIGZ1bmN0aW9uLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5jYXN0KX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBjYXN0X2RhdGVgXG4gIGlmIChcbiAgICBvcHRpb25zLmNhc3RfZGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5jYXN0X2RhdGUgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmNhc3RfZGF0ZSA9PT0gZmFsc2UgfHxcbiAgICBvcHRpb25zLmNhc3RfZGF0ZSA9PT0gXCJcIlxuICApIHtcbiAgICBvcHRpb25zLmNhc3RfZGF0ZSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuY2FzdF9kYXRlID09PSB0cnVlKSB7XG4gICAgb3B0aW9ucy5jYXN0X2RhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGNvbnN0IGRhdGUgPSBEYXRlLnBhcnNlKHZhbHVlKTtcbiAgICAgIHJldHVybiAhaXNOYU4oZGF0ZSkgPyBuZXcgRGF0ZShkYXRlKSA6IHZhbHVlO1xuICAgIH07XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuY2FzdF9kYXRlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9DQVNUX0RBVEVcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBjYXN0X2RhdGU6XCIsXG4gICAgICAgIFwiY2FzdF9kYXRlIG11c3QgYmUgdHJ1ZSBvciBhIGZ1bmN0aW9uLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5jYXN0X2RhdGUpfWAsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGNvbHVtbnNgXG4gIG9wdGlvbnMuY2FzdF9maXJzdF9saW5lX3RvX2hlYWRlciA9IG51bGw7XG4gIGlmIChvcHRpb25zLmNvbHVtbnMgPT09IHRydWUpIHtcbiAgICAvLyBGaWVsZHMgaW4gdGhlIGZpcnN0IGxpbmUgYXJlIGNvbnZlcnRlZCBhcy1pcyB0byBjb2x1bW5zXG4gICAgb3B0aW9ucy5jYXN0X2ZpcnN0X2xpbmVfdG9faGVhZGVyID0gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmNvbHVtbnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIG9wdGlvbnMuY2FzdF9maXJzdF9saW5lX3RvX2hlYWRlciA9IG9wdGlvbnMuY29sdW1ucztcbiAgICBvcHRpb25zLmNvbHVtbnMgPSB0cnVlO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5jb2x1bW5zKSkge1xuICAgIG9wdGlvbnMuY29sdW1ucyA9IG5vcm1hbGl6ZV9jb2x1bW5zX2FycmF5KG9wdGlvbnMuY29sdW1ucyk7XG4gIH0gZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5jb2x1bW5zID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmNvbHVtbnMgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmNvbHVtbnMgPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMuY29sdW1ucyA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX0NPTFVNTlNcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBjb2x1bW5zOlwiLFxuICAgICAgICBcImV4cGVjdCBhbiBhcnJheSwgYSBmdW5jdGlvbiBvciB0cnVlLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5jb2x1bW5zKX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBncm91cF9jb2x1bW5zX2J5X25hbWVgXG4gIGlmIChcbiAgICBvcHRpb25zLmdyb3VwX2NvbHVtbnNfYnlfbmFtZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5ncm91cF9jb2x1bW5zX2J5X25hbWUgPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmdyb3VwX2NvbHVtbnNfYnlfbmFtZSA9PT0gZmFsc2VcbiAgKSB7XG4gICAgb3B0aW9ucy5ncm91cF9jb2x1bW5zX2J5X25hbWUgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmdyb3VwX2NvbHVtbnNfYnlfbmFtZSAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX0dST1VQX0NPTFVNTlNfQllfTkFNRVwiLFxuICAgICAgW1xuICAgICAgICBcIkludmFsaWQgb3B0aW9uIGdyb3VwX2NvbHVtbnNfYnlfbmFtZTpcIixcbiAgICAgICAgXCJleHBlY3QgYW4gYm9vbGVhbixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuZ3JvdXBfY29sdW1uc19ieV9uYW1lKX1gLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmNvbHVtbnMgPT09IGZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fR1JPVVBfQ09MVU1OU19CWV9OQU1FXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gZ3JvdXBfY29sdW1uc19ieV9uYW1lOlwiLFxuICAgICAgICBcInRoZSBgY29sdW1uc2AgbW9kZSBtdXN0IGJlIGFjdGl2YXRlZC5cIixcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY29tbWVudGBcbiAgaWYgKFxuICAgIG9wdGlvbnMuY29tbWVudCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5jb21tZW50ID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5jb21tZW50ID09PSBmYWxzZSB8fFxuICAgIG9wdGlvbnMuY29tbWVudCA9PT0gXCJcIlxuICApIHtcbiAgICBvcHRpb25zLmNvbW1lbnQgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jb21tZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBvcHRpb25zLmNvbW1lbnQgPSBCdWZmZXIuZnJvbShvcHRpb25zLmNvbW1lbnQsIG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIH1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLmNvbW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX0NPTU1FTlRcIixcbiAgICAgICAgW1xuICAgICAgICAgIFwiSW52YWxpZCBvcHRpb24gY29tbWVudDpcIixcbiAgICAgICAgICBcImNvbW1lbnQgbXVzdCBiZSBhIGJ1ZmZlciBvciBhIHN0cmluZyxcIixcbiAgICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5jb21tZW50KX1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY29tbWVudF9ub19pbmZpeGBcbiAgaWYgKFxuICAgIG9wdGlvbnMuY29tbWVudF9ub19pbmZpeCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5jb21tZW50X25vX2luZml4ID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5jb21tZW50X25vX2luZml4ID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLmNvbW1lbnRfbm9faW5maXggPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmNvbW1lbnRfbm9faW5maXggIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9DT01NRU5UXCIsXG4gICAgICBbXG4gICAgICAgIFwiSW52YWxpZCBvcHRpb24gY29tbWVudF9ub19pbmZpeDpcIixcbiAgICAgICAgXCJ2YWx1ZSBtdXN0IGJlIGEgYm9vbGVhbixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuY29tbWVudF9ub19pbmZpeCl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZGVsaW1pdGVyYFxuICBjb25zdCBkZWxpbWl0ZXJfanNvbiA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGVsaW1pdGVyKTtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuZGVsaW1pdGVyKSlcbiAgICBvcHRpb25zLmRlbGltaXRlciA9IFtvcHRpb25zLmRlbGltaXRlcl07XG4gIGlmIChvcHRpb25zLmRlbGltaXRlci5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9ERUxJTUlURVJcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBkZWxpbWl0ZXI6XCIsXG4gICAgICAgIFwiZGVsaW1pdGVyIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nIG9yIGJ1ZmZlciBvciBhcnJheSBvZiBzdHJpbmd8YnVmZmVyLFwiLFxuICAgICAgICBgZ290ICR7ZGVsaW1pdGVyX2pzb259YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgb3B0aW9ucy5kZWxpbWl0ZXIgPSBvcHRpb25zLmRlbGltaXRlci5tYXAoZnVuY3Rpb24gKGRlbGltaXRlcikge1xuICAgIGlmIChkZWxpbWl0ZXIgPT09IHVuZGVmaW5lZCB8fCBkZWxpbWl0ZXIgPT09IG51bGwgfHwgZGVsaW1pdGVyID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFwiLFwiLCBvcHRpb25zLmVuY29kaW5nKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBkZWxpbWl0ZXIgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGRlbGltaXRlciA9IEJ1ZmZlci5mcm9tKGRlbGltaXRlciwgb3B0aW9ucy5lbmNvZGluZyk7XG4gICAgfVxuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGRlbGltaXRlcikgfHwgZGVsaW1pdGVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9ERUxJTUlURVJcIixcbiAgICAgICAgW1xuICAgICAgICAgIFwiSW52YWxpZCBvcHRpb24gZGVsaW1pdGVyOlwiLFxuICAgICAgICAgIFwiZGVsaW1pdGVyIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nIG9yIGJ1ZmZlciBvciBhcnJheSBvZiBzdHJpbmd8YnVmZmVyLFwiLFxuICAgICAgICAgIGBnb3QgJHtkZWxpbWl0ZXJfanNvbn1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlbGltaXRlcjtcbiAgfSk7XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGVzY2FwZWBcbiAgaWYgKG9wdGlvbnMuZXNjYXBlID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5lc2NhcGUgPT09IHRydWUpIHtcbiAgICBvcHRpb25zLmVzY2FwZSA9IEJ1ZmZlci5mcm9tKCdcIicsIG9wdGlvbnMuZW5jb2RpbmcpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmVzY2FwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIG9wdGlvbnMuZXNjYXBlID0gQnVmZmVyLmZyb20ob3B0aW9ucy5lc2NhcGUsIG9wdGlvbnMuZW5jb2RpbmcpO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuZXNjYXBlID09PSBudWxsIHx8IG9wdGlvbnMuZXNjYXBlID09PSBmYWxzZSkge1xuICAgIG9wdGlvbnMuZXNjYXBlID0gbnVsbDtcbiAgfVxuICBpZiAob3B0aW9ucy5lc2NhcGUgIT09IG51bGwpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLmVzY2FwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEludmFsaWQgT3B0aW9uOiBlc2NhcGUgbXVzdCBiZSBhIGJ1ZmZlciwgYSBzdHJpbmcgb3IgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmVzY2FwZSl9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGZyb21gXG4gIGlmIChvcHRpb25zLmZyb20gPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmZyb20gPT09IG51bGwpIHtcbiAgICBvcHRpb25zLmZyb20gPSAxO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5mcm9tID09PSBcInN0cmluZ1wiICYmIC9cXGQrLy50ZXN0KG9wdGlvbnMuZnJvbSkpIHtcbiAgICAgIG9wdGlvbnMuZnJvbSA9IHBhcnNlSW50KG9wdGlvbnMuZnJvbSk7XG4gICAgfVxuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMuZnJvbSkpIHtcbiAgICAgIGlmIChvcHRpb25zLmZyb20gPCAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCBPcHRpb246IGZyb20gbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdHMuZnJvbSl9YCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgSW52YWxpZCBPcHRpb246IGZyb20gbXVzdCBiZSBhbiBpbnRlZ2VyLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmZyb20pfWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBmcm9tX2xpbmVgXG4gIGlmIChvcHRpb25zLmZyb21fbGluZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuZnJvbV9saW5lID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5mcm9tX2xpbmUgPSAxO1xuICB9IGVsc2Uge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBvcHRpb25zLmZyb21fbGluZSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgL1xcZCsvLnRlc3Qob3B0aW9ucy5mcm9tX2xpbmUpXG4gICAgKSB7XG4gICAgICBvcHRpb25zLmZyb21fbGluZSA9IHBhcnNlSW50KG9wdGlvbnMuZnJvbV9saW5lKTtcbiAgICB9XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIob3B0aW9ucy5mcm9tX2xpbmUpKSB7XG4gICAgICBpZiAob3B0aW9ucy5mcm9tX2xpbmUgPD0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgT3B0aW9uOiBmcm9tX2xpbmUgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIgZ3JlYXRlciB0aGFuIDAsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdHMuZnJvbV9saW5lKX1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogZnJvbV9saW5lIG11c3QgYmUgYW4gaW50ZWdlciwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0cy5mcm9tX2xpbmUpfWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9ucyBgaWdub3JlX2xhc3RfZGVsaW1pdGVyc2BcbiAgaWYgKFxuICAgIG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5pZ25vcmVfbGFzdF9kZWxpbWl0ZXJzID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPT09IFwibnVtYmVyXCIpIHtcbiAgICBvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPSBNYXRoLmZsb29yKG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyk7XG4gICAgaWYgKG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9PT0gMCkge1xuICAgICAgb3B0aW9ucy5pZ25vcmVfbGFzdF9kZWxpbWl0ZXJzID0gZmFsc2U7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmlnbm9yZV9sYXN0X2RlbGltaXRlcnMgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSU5WQUxJRF9PUFRJT05fSUdOT1JFX0xBU1RfREVMSU1JVEVSU1wiLFxuICAgICAgW1xuICAgICAgICBcIkludmFsaWQgb3B0aW9uIGBpZ25vcmVfbGFzdF9kZWxpbWl0ZXJzYDpcIixcbiAgICAgICAgXCJ0aGUgdmFsdWUgbXVzdCBiZSBhIGJvb2xlYW4gdmFsdWUgb3IgYW4gaW50ZWdlcixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyl9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9PT0gdHJ1ZSAmJiBvcHRpb25zLmNvbHVtbnMgPT09IGZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgXCJDU1ZfSUdOT1JFX0xBU1RfREVMSU1JVEVSU19SRVFVSVJFU19DT0xVTU5TXCIsXG4gICAgICBbXG4gICAgICAgIFwiVGhlIG9wdGlvbiBgaWdub3JlX2xhc3RfZGVsaW1pdGVyc2BcIixcbiAgICAgICAgXCJyZXF1aXJlcyB0aGUgYWN0aXZhdGlvbiBvZiB0aGUgYGNvbHVtbnNgIG9wdGlvblwiLFxuICAgICAgXSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBpbmZvYFxuICBpZiAoXG4gICAgb3B0aW9ucy5pbmZvID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmluZm8gPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmluZm8gPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMuaW5mbyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuaW5mbyAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogaW5mbyBtdXN0IGJlIHRydWUsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuaW5mbyl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYG1heF9yZWNvcmRfc2l6ZWBcbiAgaWYgKFxuICAgIG9wdGlvbnMubWF4X3JlY29yZF9zaXplID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMubWF4X3JlY29yZF9zaXplID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSA9IDA7XG4gIH0gZWxzZSBpZiAoXG4gICAgTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSkgJiZcbiAgICBvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSA+PSAwXG4gICkgOyBlbHNlIGlmIChcbiAgICB0eXBlb2Ygb3B0aW9ucy5tYXhfcmVjb3JkX3NpemUgPT09IFwic3RyaW5nXCIgJiZcbiAgICAvXFxkKy8udGVzdChvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSlcbiAgKSB7XG4gICAgb3B0aW9ucy5tYXhfcmVjb3JkX3NpemUgPSBwYXJzZUludChvcHRpb25zLm1heF9yZWNvcmRfc2l6ZSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiBtYXhfcmVjb3JkX3NpemUgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMubWF4X3JlY29yZF9zaXplKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgb2JqbmFtZWBcbiAgaWYgKFxuICAgIG9wdGlvbnMub2JqbmFtZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5vYmpuYW1lID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5vYmpuYW1lID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLm9iam5hbWUgPSB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMub2JqbmFtZSkpIHtcbiAgICBpZiAob3B0aW9ucy5vYmpuYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIE9wdGlvbjogb2JqbmFtZSBtdXN0IGJlIGEgbm9uIGVtcHR5IGJ1ZmZlcmApO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5lbmNvZGluZyA9PT0gbnVsbCkgOyBlbHNlIHtcbiAgICAgIG9wdGlvbnMub2JqbmFtZSA9IG9wdGlvbnMub2JqbmFtZS50b1N0cmluZyhvcHRpb25zLmVuY29kaW5nKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMub2JqbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGlmIChvcHRpb25zLm9iam5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgT3B0aW9uOiBvYmpuYW1lIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nYCk7XG4gICAgfVxuICAgIC8vIEdyZWF0LCBub3RoaW5nIHRvIGRvXG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMub2JqbmFtZSA9PT0gXCJudW1iZXJcIikgOyBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IG9iam5hbWUgbXVzdCBiZSBhIHN0cmluZyBvciBhIGJ1ZmZlciwgZ290ICR7b3B0aW9ucy5vYmpuYW1lfWAsXG4gICAgKTtcbiAgfVxuICBpZiAob3B0aW9ucy5vYmpuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMub2JqbmFtZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgaWYgKG9wdGlvbnMuY29sdW1ucyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgXCJJbnZhbGlkIE9wdGlvbjogb2JqbmFtZSBpbmRleCBjYW5ub3QgYmUgY29tYmluZWQgd2l0aCBjb2x1bW5zIG9yIGJlIGRlZmluZWQgYXMgYSBmaWVsZFwiLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBIHN0cmluZyBvciBhIGJ1ZmZlclxuICAgICAgaWYgKG9wdGlvbnMuY29sdW1ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgXCJJbnZhbGlkIE9wdGlvbjogb2JqbmFtZSBmaWVsZCBtdXN0IGJlIGNvbWJpbmVkIHdpdGggY29sdW1ucyBvciBiZSBkZWZpbmVkIGFzIGFuIGluZGV4XCIsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYG9uX3JlY29yZGBcbiAgaWYgKG9wdGlvbnMub25fcmVjb3JkID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5vbl9yZWNvcmQgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLm9uX3JlY29yZCA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5vbl9yZWNvcmQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX09OX1JFQ09SRFwiLFxuICAgICAgW1xuICAgICAgICBcIkludmFsaWQgb3B0aW9uIGBvbl9yZWNvcmRgOlwiLFxuICAgICAgICBcImV4cGVjdCBhIGZ1bmN0aW9uLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5vbl9yZWNvcmQpfWAsXG4gICAgICBdLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYG9uX3NraXBgXG4gIC8vIG9wdGlvbnMub25fc2tpcCA/Pz0gKGVyciwgY2h1bmspID0+IHtcbiAgLy8gICB0aGlzLmVtaXQoJ3NraXAnLCBlcnIsIGNodW5rKTtcbiAgLy8gfTtcbiAgaWYgKFxuICAgIG9wdGlvbnMub25fc2tpcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgb3B0aW9ucy5vbl9za2lwICE9PSBudWxsICYmXG4gICAgdHlwZW9mIG9wdGlvbnMub25fc2tpcCAhPT0gXCJmdW5jdGlvblwiXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogb25fc2tpcCBtdXN0IGJlIGEgZnVuY3Rpb24sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMub25fc2tpcCl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHF1b3RlYFxuICBpZiAoXG4gICAgb3B0aW9ucy5xdW90ZSA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMucXVvdGUgPT09IGZhbHNlIHx8XG4gICAgb3B0aW9ucy5xdW90ZSA9PT0gXCJcIlxuICApIHtcbiAgICBvcHRpb25zLnF1b3RlID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBpZiAob3B0aW9ucy5xdW90ZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucXVvdGUgPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnMucXVvdGUgPSBCdWZmZXIuZnJvbSgnXCInLCBvcHRpb25zLmVuY29kaW5nKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLnF1b3RlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBvcHRpb25zLnF1b3RlID0gQnVmZmVyLmZyb20ob3B0aW9ucy5xdW90ZSwgb3B0aW9ucy5lbmNvZGluZyk7XG4gICAgfVxuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucXVvdGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogcXVvdGUgbXVzdCBiZSBhIGJ1ZmZlciBvciBhIHN0cmluZywgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5xdW90ZSl9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHJhd2BcbiAgaWYgKFxuICAgIG9wdGlvbnMucmF3ID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnJhdyA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMucmF3ID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLnJhdyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMucmF3ICE9PSB0cnVlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiByYXcgbXVzdCBiZSB0cnVlLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJhdyl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHJlY29yZF9kZWxpbWl0ZXJgXG4gIGlmIChvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciA9IFtdO1xuICB9IGVsc2UgaWYgKFxuICAgIHR5cGVvZiBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPT09IFwic3RyaW5nXCIgfHxcbiAgICBCdWZmZXIuaXNCdWZmZXIob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyKVxuICApIHtcbiAgICBpZiAob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9SRUNPUkRfREVMSU1JVEVSXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBcIkludmFsaWQgb3B0aW9uIGByZWNvcmRfZGVsaW1pdGVyYDpcIixcbiAgICAgICAgICBcInZhbHVlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nIG9yIGJ1ZmZlcixcIixcbiAgICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyKX1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9XG4gICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gW29wdGlvbnMucmVjb3JkX2RlbGltaXRlcl07XG4gIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyKSkge1xuICAgIHRocm93IG5ldyBDc3ZFcnJvcihcbiAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX1JFQ09SRF9ERUxJTUlURVJcIixcbiAgICAgIFtcbiAgICAgICAgXCJJbnZhbGlkIG9wdGlvbiBgcmVjb3JkX2RlbGltaXRlcmA6XCIsXG4gICAgICAgIFwidmFsdWUgbXVzdCBiZSBhIHN0cmluZywgYSBidWZmZXIgb3IgYXJyYXkgb2Ygc3RyaW5nfGJ1ZmZlcixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucmVjb3JkX2RlbGltaXRlcil9YCxcbiAgICAgIF0sXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH1cbiAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyLm1hcChmdW5jdGlvbiAocmQsIGkpIHtcbiAgICBpZiAodHlwZW9mIHJkICE9PSBcInN0cmluZ1wiICYmICFCdWZmZXIuaXNCdWZmZXIocmQpKSB7XG4gICAgICB0aHJvdyBuZXcgQ3N2RXJyb3IoXG4gICAgICAgIFwiQ1NWX0lOVkFMSURfT1BUSU9OX1JFQ09SRF9ERUxJTUlURVJcIixcbiAgICAgICAgW1xuICAgICAgICAgIFwiSW52YWxpZCBvcHRpb24gYHJlY29yZF9kZWxpbWl0ZXJgOlwiLFxuICAgICAgICAgIFwidmFsdWUgbXVzdCBiZSBhIHN0cmluZywgYSBidWZmZXIgb3IgYXJyYXkgb2Ygc3RyaW5nfGJ1ZmZlclwiLFxuICAgICAgICAgIGBhdCBpbmRleCAke2l9LGAsXG4gICAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KHJkKX1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHJkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IENzdkVycm9yKFxuICAgICAgICBcIkNTVl9JTlZBTElEX09QVElPTl9SRUNPUkRfREVMSU1JVEVSXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBcIkludmFsaWQgb3B0aW9uIGByZWNvcmRfZGVsaW1pdGVyYDpcIixcbiAgICAgICAgICBcInZhbHVlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nIG9yIGJ1ZmZlclwiLFxuICAgICAgICAgIGBhdCBpbmRleCAke2l9LGAsXG4gICAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KHJkKX1gLFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiByZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcmQgPSBCdWZmZXIuZnJvbShyZCwgb3B0aW9ucy5lbmNvZGluZyk7XG4gICAgfVxuICAgIHJldHVybiByZDtcbiAgfSk7XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHJlbGF4X2NvbHVtbl9jb3VudGBcbiAgaWYgKHR5cGVvZiBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudCA9PT0gXCJib29sZWFuXCIpIDsgZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5yZWxheF9jb2x1bW5fY291bnQgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50ID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50ID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiByZWxheF9jb2x1bW5fY291bnQgbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50KX1gLFxuICAgICk7XG4gIH1cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9sZXNzID09PSBcImJvb2xlYW5cIikgOyBlbHNlIGlmIChcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9sZXNzID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9sZXNzID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50X2xlc3MgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHJlbGF4X2NvbHVtbl9jb3VudF9sZXNzIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9sZXNzKX1gLFxuICAgICk7XG4gIH1cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9tb3JlID09PSBcImJvb2xlYW5cIikgOyBlbHNlIGlmIChcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9tb3JlID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9tb3JlID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMucmVsYXhfY29sdW1uX2NvdW50X21vcmUgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHJlbGF4X2NvbHVtbl9jb3VudF9tb3JlIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnJlbGF4X2NvbHVtbl9jb3VudF9tb3JlKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcmVsYXhfcXVvdGVzYFxuICBpZiAodHlwZW9mIG9wdGlvbnMucmVsYXhfcXVvdGVzID09PSBcImJvb2xlYW5cIikgOyBlbHNlIGlmIChcbiAgICBvcHRpb25zLnJlbGF4X3F1b3RlcyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgb3B0aW9ucy5yZWxheF9xdW90ZXMgPT09IG51bGxcbiAgKSB7XG4gICAgb3B0aW9ucy5yZWxheF9xdW90ZXMgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgSW52YWxpZCBPcHRpb246IHJlbGF4X3F1b3RlcyBtdXN0IGJlIGEgYm9vbGVhbiwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5yZWxheF9xdW90ZXMpfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBza2lwX2VtcHR5X2xpbmVzYFxuICBpZiAodHlwZW9mIG9wdGlvbnMuc2tpcF9lbXB0eV9saW5lcyA9PT0gXCJib29sZWFuXCIpIDsgZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5za2lwX2VtcHR5X2xpbmVzID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnNraXBfZW1wdHlfbGluZXMgPT09IG51bGxcbiAgKSB7XG4gICAgb3B0aW9ucy5za2lwX2VtcHR5X2xpbmVzID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgT3B0aW9uOiBza2lwX2VtcHR5X2xpbmVzIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnNraXBfZW1wdHlfbGluZXMpfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBza2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXNgXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5za2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXMgPT09IFwiYm9vbGVhblwiKSA7IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2VtcHR5X3ZhbHVlcyA9PT0gbnVsbFxuICApIHtcbiAgICBvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2VtcHR5X3ZhbHVlcyA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzIG11c3QgYmUgYSBib29sZWFuLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLnNraXBfcmVjb3Jkc193aXRoX2VtcHR5X3ZhbHVlcyl9YCxcbiAgICApO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHNraXBfcmVjb3Jkc193aXRoX2Vycm9yYFxuICBpZiAodHlwZW9mIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgPT09IFwiYm9vbGVhblwiKSA7IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgPT09IG51bGxcbiAgKSB7XG4gICAgb3B0aW9ucy5za2lwX3JlY29yZHNfd2l0aF9lcnJvciA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IpfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBydHJpbWBcbiAgaWYgKFxuICAgIG9wdGlvbnMucnRyaW0gPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMucnRyaW0gPT09IG51bGwgfHxcbiAgICBvcHRpb25zLnJ0cmltID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLnJ0cmltID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5ydHJpbSAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogcnRyaW0gbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucnRyaW0pfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBsdHJpbWBcbiAgaWYgKFxuICAgIG9wdGlvbnMubHRyaW0gPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMubHRyaW0gPT09IG51bGwgfHxcbiAgICBvcHRpb25zLmx0cmltID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLmx0cmltID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5sdHJpbSAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogbHRyaW0gbXVzdCBiZSBhIGJvb2xlYW4sIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMubHRyaW0pfWAsXG4gICAgKTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGB0cmltYFxuICBpZiAoXG4gICAgb3B0aW9ucy50cmltID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLnRyaW0gPT09IG51bGwgfHxcbiAgICBvcHRpb25zLnRyaW0gPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMudHJpbSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMudHJpbSAhPT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIE9wdGlvbjogdHJpbSBtdXN0IGJlIGEgYm9vbGVhbiwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy50cmltKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbnMgYHRyaW1gLCBgbHRyaW1gIGFuZCBgcnRyaW1gXG4gIGlmIChvcHRpb25zLnRyaW0gPT09IHRydWUgJiYgb3B0cy5sdHJpbSAhPT0gZmFsc2UpIHtcbiAgICBvcHRpb25zLmx0cmltID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmx0cmltICE9PSB0cnVlKSB7XG4gICAgb3B0aW9ucy5sdHJpbSA9IGZhbHNlO1xuICB9XG4gIGlmIChvcHRpb25zLnRyaW0gPT09IHRydWUgJiYgb3B0cy5ydHJpbSAhPT0gZmFsc2UpIHtcbiAgICBvcHRpb25zLnJ0cmltID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLnJ0cmltICE9PSB0cnVlKSB7XG4gICAgb3B0aW9ucy5ydHJpbSA9IGZhbHNlO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHRvYFxuICBpZiAob3B0aW9ucy50byA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMudG8gPT09IG51bGwpIHtcbiAgICBvcHRpb25zLnRvID0gLTE7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnRvID09PSBcInN0cmluZ1wiICYmIC9cXGQrLy50ZXN0KG9wdGlvbnMudG8pKSB7XG4gICAgICBvcHRpb25zLnRvID0gcGFyc2VJbnQob3B0aW9ucy50byk7XG4gICAgfVxuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMudG8pKSB7XG4gICAgICBpZiAob3B0aW9ucy50byA8PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCBPcHRpb246IHRvIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiAwLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRzLnRvKX1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogdG8gbXVzdCBiZSBhbiBpbnRlZ2VyLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRzLnRvKX1gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgdG9fbGluZWBcbiAgaWYgKG9wdGlvbnMudG9fbGluZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMudG9fbGluZSA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMudG9fbGluZSA9IC0xO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy50b19saW5lID09PSBcInN0cmluZ1wiICYmIC9cXGQrLy50ZXN0KG9wdGlvbnMudG9fbGluZSkpIHtcbiAgICAgIG9wdGlvbnMudG9fbGluZSA9IHBhcnNlSW50KG9wdGlvbnMudG9fbGluZSk7XG4gICAgfVxuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMudG9fbGluZSkpIHtcbiAgICAgIGlmIChvcHRpb25zLnRvX2xpbmUgPD0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgT3B0aW9uOiB0b19saW5lIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiAwLCBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRzLnRvX2xpbmUpfWAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEludmFsaWQgT3B0aW9uOiB0b19saW5lIG11c3QgYmUgYW4gaW50ZWdlciwgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0cy50b19saW5lKX1gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5jb25zdCBpc1JlY29yZEVtcHR5ID0gZnVuY3Rpb24gKHJlY29yZCkge1xuICByZXR1cm4gcmVjb3JkLmV2ZXJ5KFxuICAgIChmaWVsZCkgPT5cbiAgICAgIGZpZWxkID09IG51bGwgfHwgKGZpZWxkLnRvU3RyaW5nICYmIGZpZWxkLnRvU3RyaW5nKCkudHJpbSgpID09PSBcIlwiKSxcbiAgKTtcbn07XG5cbmNvbnN0IGNyID0gMTM7IC8vIGBcXHJgLCBjYXJyaWFnZSByZXR1cm4sIDB4MEQgaW4gaGV4YWTDqWNpbWFsLCAxMyBpbiBkZWNpbWFsXG5jb25zdCBubCA9IDEwOyAvLyBgXFxuYCwgbmV3bGluZSwgMHgwQSBpbiBoZXhhZGVjaW1hbCwgMTAgaW4gZGVjaW1hbFxuXG5jb25zdCBib21zID0ge1xuICAvLyBOb3RlLCB0aGUgZm9sbG93aW5nIGFyZSBlcXVhbHM6XG4gIC8vIEJ1ZmZlci5mcm9tKFwiXFx1ZmVmZlwiKVxuICAvLyBCdWZmZXIuZnJvbShbMjM5LCAxODcsIDE5MV0pXG4gIC8vIEJ1ZmZlci5mcm9tKCdFRkJCQkYnLCAnaGV4JylcbiAgdXRmODogQnVmZmVyLmZyb20oWzIzOSwgMTg3LCAxOTFdKSxcbiAgLy8gTm90ZSwgdGhlIGZvbGxvd2luZyBhcmUgZXF1YWxzOlxuICAvLyBCdWZmZXIuZnJvbSBcIlxcdWZlZmZcIiwgJ3V0ZjE2bGVcbiAgLy8gQnVmZmVyLmZyb20oWzI1NSwgMjU0XSlcbiAgdXRmMTZsZTogQnVmZmVyLmZyb20oWzI1NSwgMjU0XSksXG59O1xuXG5jb25zdCB0cmFuc2Zvcm0gPSBmdW5jdGlvbiAob3JpZ2luYWxfb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGluZm8gPSB7XG4gICAgYnl0ZXM6IDAsXG4gICAgY29tbWVudF9saW5lczogMCxcbiAgICBlbXB0eV9saW5lczogMCxcbiAgICBpbnZhbGlkX2ZpZWxkX2xlbmd0aDogMCxcbiAgICBsaW5lczogMSxcbiAgICByZWNvcmRzOiAwLFxuICB9O1xuICBjb25zdCBvcHRpb25zID0gbm9ybWFsaXplX29wdGlvbnMob3JpZ2luYWxfb3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgaW5mbzogaW5mbyxcbiAgICBvcmlnaW5hbF9vcHRpb25zOiBvcmlnaW5hbF9vcHRpb25zLFxuICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgc3RhdGU6IGluaXRfc3RhdGUob3B0aW9ucyksXG4gICAgX19uZWVkTW9yZURhdGE6IGZ1bmN0aW9uIChpLCBidWZMZW4sIGVuZCkge1xuICAgICAgaWYgKGVuZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgeyBlbmNvZGluZywgZXNjYXBlLCBxdW90ZSB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgeyBxdW90aW5nLCBuZWVkTW9yZURhdGFTaXplLCByZWNvcmREZWxpbWl0ZXJNYXhMZW5ndGggfSA9XG4gICAgICAgIHRoaXMuc3RhdGU7XG4gICAgICBjb25zdCBudW1PZkNoYXJMZWZ0ID0gYnVmTGVuIC0gaSAtIDE7XG4gICAgICBjb25zdCByZXF1aXJlZExlbmd0aCA9IE1hdGgubWF4KFxuICAgICAgICBuZWVkTW9yZURhdGFTaXplLFxuICAgICAgICAvLyBTa2lwIGlmIHRoZSByZW1haW5pbmcgYnVmZmVyIHNtYWxsZXIgdGhhbiByZWNvcmQgZGVsaW1pdGVyXG4gICAgICAgIC8vIElmIFwicmVjb3JkX2RlbGltaXRlclwiIGlzIHlldCB0byBiZSBkaXNjb3ZlcmVkOlxuICAgICAgICAvLyAxLiBJdCBpcyBlcXVhbHMgdG8gYFtdYCBhbmQgXCJyZWNvcmREZWxpbWl0ZXJNYXhMZW5ndGhcIiBlcXVhbHMgYDBgXG4gICAgICAgIC8vIDIuIFdlIHNldCB0aGUgbGVuZ3RoIHRvIHdpbmRvd3MgbGluZSBlbmRpbmcgaW4gdGhlIGN1cnJlbnQgZW5jb2RpbmdcbiAgICAgICAgLy8gTm90ZSwgdGhhdCBlbmNvZGluZyBpcyBrbm93biBmcm9tIHVzZXIgb3IgYm9tIGRpc2NvdmVyeSBhdCB0aGF0IHBvaW50XG4gICAgICAgIC8vIHJlY29yZERlbGltaXRlck1heExlbmd0aCxcbiAgICAgICAgcmVjb3JkRGVsaW1pdGVyTWF4TGVuZ3RoID09PSAwXG4gICAgICAgICAgPyBCdWZmZXIuZnJvbShcIlxcclxcblwiLCBlbmNvZGluZykubGVuZ3RoXG4gICAgICAgICAgOiByZWNvcmREZWxpbWl0ZXJNYXhMZW5ndGgsXG4gICAgICAgIC8vIFNraXAgaWYgcmVtYWluaW5nIGJ1ZmZlciBjYW4gYmUgYW4gZXNjYXBlZCBxdW90ZVxuICAgICAgICBxdW90aW5nID8gKGVzY2FwZSA9PT0gbnVsbCA/IDAgOiBlc2NhcGUubGVuZ3RoKSArIHF1b3RlLmxlbmd0aCA6IDAsXG4gICAgICAgIC8vIFNraXAgaWYgcmVtYWluaW5nIGJ1ZmZlciBjYW4gYmUgcmVjb3JkIGRlbGltaXRlciBmb2xsb3dpbmcgdGhlIGNsb3NpbmcgcXVvdGVcbiAgICAgICAgcXVvdGluZyA/IHF1b3RlLmxlbmd0aCArIHJlY29yZERlbGltaXRlck1heExlbmd0aCA6IDAsXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bU9mQ2hhckxlZnQgPCByZXF1aXJlZExlbmd0aDtcbiAgICB9LFxuICAgIC8vIENlbnRyYWwgcGFyc2VyIGltcGxlbWVudGF0aW9uXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChuZXh0QnVmLCBlbmQsIHB1c2gsIGNsb3NlKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGJvbSxcbiAgICAgICAgY29tbWVudF9ub19pbmZpeCxcbiAgICAgICAgZW5jb2RpbmcsXG4gICAgICAgIGZyb21fbGluZSxcbiAgICAgICAgbHRyaW0sXG4gICAgICAgIG1heF9yZWNvcmRfc2l6ZSxcbiAgICAgICAgcmF3LFxuICAgICAgICByZWxheF9xdW90ZXMsXG4gICAgICAgIHJ0cmltLFxuICAgICAgICBza2lwX2VtcHR5X2xpbmVzLFxuICAgICAgICB0byxcbiAgICAgICAgdG9fbGluZSxcbiAgICAgIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBsZXQgeyBjb21tZW50LCBlc2NhcGUsIHF1b3RlLCByZWNvcmRfZGVsaW1pdGVyIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBjb25zdCB7IGJvbVNraXBwZWQsIHByZXZpb3VzQnVmLCByYXdCdWZmZXIsIGVzY2FwZUlzUXVvdGUgfSA9IHRoaXMuc3RhdGU7XG4gICAgICBsZXQgYnVmO1xuICAgICAgaWYgKHByZXZpb3VzQnVmID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG5leHRCdWYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIEhhbmRsZSBlbXB0eSBzdHJpbmdcbiAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWYgPSBuZXh0QnVmO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzQnVmICE9PSB1bmRlZmluZWQgJiYgbmV4dEJ1ZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJ1ZiA9IHByZXZpb3VzQnVmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmID0gQnVmZmVyLmNvbmNhdChbcHJldmlvdXNCdWYsIG5leHRCdWZdKTtcbiAgICAgIH1cbiAgICAgIC8vIEhhbmRsZSBVVEYgQk9NXG4gICAgICBpZiAoYm9tU2tpcHBlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGJvbSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLmJvbVNraXBwZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGJ1Zi5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgLy8gTm8gZW5vdWdoIGRhdGFcbiAgICAgICAgICBpZiAoZW5kID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gV2FpdCBmb3IgbW9yZSBkYXRhXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnByZXZpb3VzQnVmID0gYnVmO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGVuY29kaW5nIGluIGJvbXMpIHtcbiAgICAgICAgICAgIGlmIChib21zW2VuY29kaW5nXS5jb21wYXJlKGJ1ZiwgMCwgYm9tc1tlbmNvZGluZ10ubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAvLyBTa2lwIEJPTVxuICAgICAgICAgICAgICBjb25zdCBib21MZW5ndGggPSBib21zW2VuY29kaW5nXS5sZW5ndGg7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuYnVmQnl0ZXNTdGFydCArPSBib21MZW5ndGg7XG4gICAgICAgICAgICAgIGJ1ZiA9IGJ1Zi5zbGljZShib21MZW5ndGgpO1xuICAgICAgICAgICAgICAvLyBSZW5vcm1hbGl6ZSBvcmlnaW5hbCBvcHRpb25zIHdpdGggdGhlIG5ldyBlbmNvZGluZ1xuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBub3JtYWxpemVfb3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5vcmlnaW5hbF9vcHRpb25zLFxuICAgICAgICAgICAgICAgIGVuY29kaW5nOiBlbmNvZGluZyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIC8vIE9wdGlvbnMgd2lsbCByZS1ldmFsdWF0ZSB0aGUgQnVmZmVyIHdpdGggdGhlIG5ldyBlbmNvZGluZ1xuICAgICAgICAgICAgICAoeyBjb21tZW50LCBlc2NhcGUsIHF1b3RlIH0gPSB0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zdGF0ZS5ib21Ta2lwcGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgYnVmTGVuID0gYnVmLmxlbmd0aDtcbiAgICAgIGxldCBwb3M7XG4gICAgICBmb3IgKHBvcyA9IDA7IHBvcyA8IGJ1ZkxlbjsgcG9zKyspIHtcbiAgICAgICAgLy8gRW5zdXJlIHdlIGdldCBlbm91Z2ggc3BhY2UgdG8gbG9vayBhaGVhZFxuICAgICAgICAvLyBUaGVyZSBzaG91bGQgYmUgYSB3YXkgdG8gbW92ZSB0aGlzIG91dCBvZiB0aGUgbG9vcFxuICAgICAgICBpZiAodGhpcy5fX25lZWRNb3JlRGF0YShwb3MsIGJ1ZkxlbiwgZW5kKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLndhc1Jvd0RlbGltaXRlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuaW5mby5saW5lcysrO1xuICAgICAgICAgIHRoaXMuc3RhdGUud2FzUm93RGVsaW1pdGVyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvX2xpbmUgIT09IC0xICYmIHRoaXMuaW5mby5saW5lcyA+IHRvX2xpbmUpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnN0b3AgPSB0cnVlO1xuICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIEF1dG8gZGlzY292ZXJ5IG9mIHJlY29yZF9kZWxpbWl0ZXIsIHVuaXgsIG1hYyBhbmQgd2luZG93cyBzdXBwb3J0ZWRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucXVvdGluZyA9PT0gZmFsc2UgJiYgcmVjb3JkX2RlbGltaXRlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBjb25zdCByZWNvcmRfZGVsaW1pdGVyQ291bnQgPSB0aGlzLl9fYXV0b0Rpc2NvdmVyUmVjb3JkRGVsaW1pdGVyKFxuICAgICAgICAgICAgYnVmLFxuICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHJlY29yZF9kZWxpbWl0ZXJDb3VudCkge1xuICAgICAgICAgICAgcmVjb3JkX2RlbGltaXRlciA9IHRoaXMub3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjaHIgPSBidWZbcG9zXTtcbiAgICAgICAgaWYgKHJhdyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHJhd0J1ZmZlci5hcHBlbmQoY2hyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgKGNociA9PT0gY3IgfHwgY2hyID09PSBubCkgJiZcbiAgICAgICAgICB0aGlzLnN0YXRlLndhc1Jvd0RlbGltaXRlciA9PT0gZmFsc2VcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS53YXNSb3dEZWxpbWl0ZXIgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFByZXZpb3VzIGNoYXIgd2FzIGEgdmFsaWQgZXNjYXBlIGNoYXJcbiAgICAgICAgLy8gdHJlYXQgdGhlIGN1cnJlbnQgY2hhciBhcyBhIHJlZ3VsYXIgY2hhclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5lc2NhcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUuZXNjYXBpbmcgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFc2NhcGUgaXMgb25seSBhY3RpdmUgaW5zaWRlIHF1b3RlZCBmaWVsZHNcbiAgICAgICAgICAvLyBXZSBhcmUgcXVvdGluZywgdGhlIGNoYXIgaXMgYW4gZXNjYXBlIGNociBhbmQgdGhlcmUgaXMgYSBjaHIgdG8gZXNjYXBlXG4gICAgICAgICAgLy8gaWYoZXNjYXBlICE9PSBudWxsICYmIHRoaXMuc3RhdGUucXVvdGluZyA9PT0gdHJ1ZSAmJiBjaHIgPT09IGVzY2FwZSAmJiBwb3MgKyAxIDwgYnVmTGVuKXtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBlc2NhcGUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucXVvdGluZyA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5fX2lzRXNjYXBlKGJ1ZiwgcG9zLCBjaHIpICYmXG4gICAgICAgICAgICBwb3MgKyBlc2NhcGUubGVuZ3RoIDwgYnVmTGVuXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoZXNjYXBlSXNRdW90ZSkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5fX2lzUXVvdGUoYnVmLCBwb3MgKyBlc2NhcGUubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXNjYXBpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBvcyArPSBlc2NhcGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lc2NhcGluZyA9IHRydWU7XG4gICAgICAgICAgICAgIHBvcyArPSBlc2NhcGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIE5vdCBjdXJyZW50bHkgZXNjYXBpbmcgYW5kIGNociBpcyBhIHF1b3RlXG4gICAgICAgICAgLy8gVE9ETzogbmVlZCB0byBjb21wYXJlIGJ5dGVzIGluc3RlYWQgb2Ygc2luZ2xlIGNoYXJcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5jb21tZW50aW5nID09PSBmYWxzZSAmJiB0aGlzLl9faXNRdW90ZShidWYsIHBvcykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnF1b3RpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgY29uc3QgbmV4dENociA9IGJ1Zltwb3MgKyBxdW90ZS5sZW5ndGhdO1xuICAgICAgICAgICAgICBjb25zdCBpc05leHRDaHJUcmltYWJsZSA9XG4gICAgICAgICAgICAgICAgcnRyaW0gJiYgdGhpcy5fX2lzQ2hhclRyaW1hYmxlKGJ1ZiwgcG9zICsgcXVvdGUubGVuZ3RoKTtcbiAgICAgICAgICAgICAgY29uc3QgaXNOZXh0Q2hyQ29tbWVudCA9XG4gICAgICAgICAgICAgICAgY29tbWVudCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuX19jb21wYXJlQnl0ZXMoY29tbWVudCwgYnVmLCBwb3MgKyBxdW90ZS5sZW5ndGgsIG5leHRDaHIpO1xuICAgICAgICAgICAgICBjb25zdCBpc05leHRDaHJEZWxpbWl0ZXIgPSB0aGlzLl9faXNEZWxpbWl0ZXIoXG4gICAgICAgICAgICAgICAgYnVmLFxuICAgICAgICAgICAgICAgIHBvcyArIHF1b3RlLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBuZXh0Q2hyLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBjb25zdCBpc05leHRDaHJSZWNvcmREZWxpbWl0ZXIgPVxuICAgICAgICAgICAgICAgIHJlY29yZF9kZWxpbWl0ZXIubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgICA/IHRoaXMuX19hdXRvRGlzY292ZXJSZWNvcmREZWxpbWl0ZXIoYnVmLCBwb3MgKyBxdW90ZS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICA6IHRoaXMuX19pc1JlY29yZERlbGltaXRlcihuZXh0Q2hyLCBidWYsIHBvcyArIHF1b3RlLmxlbmd0aCk7XG4gICAgICAgICAgICAgIC8vIEVzY2FwZSBhIHF1b3RlXG4gICAgICAgICAgICAgIC8vIFRyZWF0IG5leHQgY2hhciBhcyBhIHJlZ3VsYXIgY2hhcmFjdGVyXG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBlc2NhcGUgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNFc2NhcGUoYnVmLCBwb3MsIGNocikgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNRdW90ZShidWYsIHBvcyArIGVzY2FwZS5sZW5ndGgpXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHBvcyArPSBlc2NhcGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAhbmV4dENociB8fFxuICAgICAgICAgICAgICAgIGlzTmV4dENockRlbGltaXRlciB8fFxuICAgICAgICAgICAgICAgIGlzTmV4dENoclJlY29yZERlbGltaXRlciB8fFxuICAgICAgICAgICAgICAgIGlzTmV4dENockNvbW1lbnQgfHxcbiAgICAgICAgICAgICAgICBpc05leHRDaHJUcmltYWJsZVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnF1b3RpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLndhc1F1b3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBvcyArPSBxdW90ZS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlbGF4X3F1b3RlcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSB0aGlzLl9fZXJyb3IoXG4gICAgICAgICAgICAgICAgICBuZXcgQ3N2RXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiQ1NWX0lOVkFMSURfQ0xPU0lOR19RVU9URVwiLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIENsb3NpbmcgUXVvdGU6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgYGdvdCBcIiR7U3RyaW5nLmZyb21DaGFyQ29kZShuZXh0Q2hyKX1cImAsXG4gICAgICAgICAgICAgICAgICAgICAgYGF0IGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgICAgICAgICBcImluc3RlYWQgb2YgZGVsaW1pdGVyLCByZWNvcmQgZGVsaW1pdGVyLCB0cmltYWJsZSBjaGFyYWN0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICBcIihpZiBhY3RpdmF0ZWQpIG9yIGNvbW1lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKGVyciAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXJyO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucXVvdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUud2FzUXVvdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5wcmVwZW5kKHF1b3RlKTtcbiAgICAgICAgICAgICAgICBwb3MgKz0gcXVvdGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZmllbGQubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gSW4gcmVsYXhfcXVvdGVzIG1vZGUsIHRyZWF0IG9wZW5pbmcgcXVvdGUgcHJlY2VkZWQgYnkgY2hycyBhcyByZWd1bGFyXG4gICAgICAgICAgICAgICAgaWYgKHJlbGF4X3F1b3RlcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9faW5mb0ZpZWxkKCk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBib20gPSBPYmplY3Qua2V5cyhib21zKVxuICAgICAgICAgICAgICAgICAgICAubWFwKChiKSA9PlxuICAgICAgICAgICAgICAgICAgICAgIGJvbXNbYl0uZXF1YWxzKHRoaXMuc3RhdGUuZmllbGQudG9TdHJpbmcoKSkgPyBiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVswXTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IHRoaXMuX19lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgbmV3IENzdkVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgIFwiSU5WQUxJRF9PUEVOSU5HX1FVT1RFXCIsXG4gICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIE9wZW5pbmcgUXVvdGU6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBgYSBxdW90ZSBpcyBmb3VuZCBvbiBmaWVsZCAke0pTT04uc3RyaW5naWZ5KGluZm8uY29sdW1uKX0gYXQgbGluZSAke2luZm8ubGluZXN9LCB2YWx1ZSBpcyAke0pTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUuZmllbGQudG9TdHJpbmcoZW5jb2RpbmcpKX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9tID8gYCgke2JvbX0gYm9tKWAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogdGhpcy5zdGF0ZS5maWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5xdW90aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwb3MgKz0gcXVvdGUubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5xdW90aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkRGVsaW1pdGVyTGVuZ3RoID0gdGhpcy5fX2lzUmVjb3JkRGVsaW1pdGVyKFxuICAgICAgICAgICAgICBjaHIsXG4gICAgICAgICAgICAgIGJ1ZixcbiAgICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChyZWNvcmREZWxpbWl0ZXJMZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgLy8gRG8gbm90IGVtaXQgY29tbWVudHMgd2hpY2ggdGFrZSBhIGZ1bGwgbGluZVxuICAgICAgICAgICAgICBjb25zdCBza2lwQ29tbWVudExpbmUgPVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuY29tbWVudGluZyAmJlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUud2FzUXVvdGluZyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmZpZWxkLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgICAgaWYgKHNraXBDb21tZW50TGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5jb21tZW50X2xpbmVzKys7XG4gICAgICAgICAgICAgICAgLy8gU2tpcCBmdWxsIGNvbW1lbnQgbGluZVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEFjdGl2YXRlIHJlY29yZHMgZW1pdGlvbiBpZiBhYm92ZSBmcm9tX2xpbmVcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVuYWJsZWQgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICAgICB0aGlzLmluZm8ubGluZXMgK1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5zdGF0ZS53YXNSb3dEZWxpbWl0ZXIgPT09IHRydWUgPyAxIDogMCkgPj1cbiAgICAgICAgICAgICAgICAgICAgZnJvbV9saW5lXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgdGhpcy5fX3Jlc2V0RmllbGQoKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX19yZXNldFJlY29yZCgpO1xuICAgICAgICAgICAgICAgICAgcG9zICs9IHJlY29yZERlbGltaXRlckxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gU2tpcCBpZiBsaW5lIGlzIGVtcHR5IGFuZCBza2lwX2VtcHR5X2xpbmVzIGFjdGl2YXRlZFxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIHNraXBfZW1wdHlfbGluZXMgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUud2FzUXVvdGluZyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5sZW5ndGggPT09IDBcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuaW5mby5lbXB0eV9saW5lcysrO1xuICAgICAgICAgICAgICAgICAgcG9zICs9IHJlY29yZERlbGltaXRlckxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmJ5dGVzID0gdGhpcy5zdGF0ZS5idWZCeXRlc1N0YXJ0ICsgcG9zO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyckZpZWxkID0gdGhpcy5fX29uRmllbGQoKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyRmllbGQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVyckZpZWxkO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5ieXRlcyA9XG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmJ1ZkJ5dGVzU3RhcnQgKyBwb3MgKyByZWNvcmREZWxpbWl0ZXJMZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyUmVjb3JkID0gdGhpcy5fX29uUmVjb3JkKHB1c2gpO1xuICAgICAgICAgICAgICAgIGlmIChlcnJSZWNvcmQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVyclJlY29yZDtcbiAgICAgICAgICAgICAgICBpZiAodG8gIT09IC0xICYmIHRoaXMuaW5mby5yZWNvcmRzID49IHRvKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnN0b3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jb21tZW50aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgIHBvcyArPSByZWNvcmREZWxpbWl0ZXJMZW5ndGggLSAxO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmNvbW1lbnRpbmcpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGNvbW1lbnQgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgKGNvbW1lbnRfbm9faW5maXggPT09IGZhbHNlIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5sZW5ndGggPT09IDApKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbW1lbnRDb3VudCA9IHRoaXMuX19jb21wYXJlQnl0ZXMoY29tbWVudCwgYnVmLCBwb3MsIGNocik7XG4gICAgICAgICAgICAgIGlmIChjb21tZW50Q291bnQgIT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmNvbW1lbnRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkZWxpbWl0ZXJMZW5ndGggPSB0aGlzLl9faXNEZWxpbWl0ZXIoYnVmLCBwb3MsIGNocik7XG4gICAgICAgICAgICBpZiAoZGVsaW1pdGVyTGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgIHRoaXMuaW5mby5ieXRlcyA9IHRoaXMuc3RhdGUuYnVmQnl0ZXNTdGFydCArIHBvcztcbiAgICAgICAgICAgICAgY29uc3QgZXJyRmllbGQgPSB0aGlzLl9fb25GaWVsZCgpO1xuICAgICAgICAgICAgICBpZiAoZXJyRmllbGQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVyckZpZWxkO1xuICAgICAgICAgICAgICBwb3MgKz0gZGVsaW1pdGVyTGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmNvbW1lbnRpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbWF4X3JlY29yZF9zaXplICE9PSAwICYmXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnJlY29yZF9sZW5ndGggKyB0aGlzLnN0YXRlLmZpZWxkLmxlbmd0aCA+IG1heF9yZWNvcmRfc2l6ZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19lcnJvcihcbiAgICAgICAgICAgICAgbmV3IENzdkVycm9yKFxuICAgICAgICAgICAgICAgIFwiQ1NWX01BWF9SRUNPUkRfU0laRVwiLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIFwiTWF4IFJlY29yZCBTaXplOlwiLFxuICAgICAgICAgICAgICAgICAgXCJyZWNvcmQgZXhjZWVkIHRoZSBtYXhpbXVtIG51bWJlciBvZiB0b2xlcmF0ZWQgYnl0ZXNcIixcbiAgICAgICAgICAgICAgICAgIGBvZiAke21heF9yZWNvcmRfc2l6ZX1gLFxuICAgICAgICAgICAgICAgICAgYGF0IGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYXBwZW5kID1cbiAgICAgICAgICBsdHJpbSA9PT0gZmFsc2UgfHxcbiAgICAgICAgICB0aGlzLnN0YXRlLnF1b3RpbmcgPT09IHRydWUgfHxcbiAgICAgICAgICB0aGlzLnN0YXRlLmZpZWxkLmxlbmd0aCAhPT0gMCB8fFxuICAgICAgICAgICF0aGlzLl9faXNDaGFyVHJpbWFibGUoYnVmLCBwb3MpO1xuICAgICAgICAvLyBydHJpbSBpbiBub24gcXVvdGluZyBpcyBoYW5kbGUgaW4gX19vbkZpZWxkXG4gICAgICAgIGNvbnN0IHJhcHBlbmQgPSBydHJpbSA9PT0gZmFsc2UgfHwgdGhpcy5zdGF0ZS53YXNRdW90aW5nID09PSBmYWxzZTtcbiAgICAgICAgaWYgKGxhcHBlbmQgPT09IHRydWUgJiYgcmFwcGVuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUuZmllbGQuYXBwZW5kKGNocik7XG4gICAgICAgIH0gZWxzZSBpZiAocnRyaW0gPT09IHRydWUgJiYgIXRoaXMuX19pc0NoYXJUcmltYWJsZShidWYsIHBvcykpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fX2Vycm9yKFxuICAgICAgICAgICAgbmV3IENzdkVycm9yKFxuICAgICAgICAgICAgICBcIkNTVl9OT05fVFJJTUFCTEVfQ0hBUl9BRlRFUl9DTE9TSU5HX1FVT1RFXCIsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcIkludmFsaWQgQ2xvc2luZyBRdW90ZTpcIixcbiAgICAgICAgICAgICAgICBcImZvdW5kIG5vbiB0cmltYWJsZSBieXRlIGFmdGVyIHF1b3RlXCIsXG4gICAgICAgICAgICAgICAgYGF0IGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGxhcHBlbmQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwb3MgKz0gdGhpcy5fX2lzQ2hhclRyaW1hYmxlKGJ1ZiwgcG9zKSAtIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZW5kID09PSB0cnVlKSB7XG4gICAgICAgIC8vIEVuc3VyZSB3ZSBhcmUgbm90IGVuZGluZyBpbiBhIHF1b3Rpbmcgc3RhdGVcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucXVvdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IHRoaXMuX19lcnJvcihcbiAgICAgICAgICAgIG5ldyBDc3ZFcnJvcihcbiAgICAgICAgICAgICAgXCJDU1ZfUVVPVEVfTk9UX0NMT1NFRFwiLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgXCJRdW90ZSBOb3QgQ2xvc2VkOlwiLFxuICAgICAgICAgICAgICAgIGB0aGUgcGFyc2luZyBpcyBmaW5pc2hlZCB3aXRoIGFuIG9wZW5pbmcgcXVvdGUgYXQgbGluZSAke3RoaXMuaW5mby5saW5lc31gLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgIHRoaXMuX19pbmZvRmllbGQoKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHJldHVybiBlcnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU2tpcCBsYXN0IGxpbmUgaWYgaXQgaGFzIG5vIGNoYXJhY3RlcnNcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnN0YXRlLndhc1F1b3RpbmcgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCAhPT0gMCB8fFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWVsZC5sZW5ndGggIT09IDBcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuaW5mby5ieXRlcyA9IHRoaXMuc3RhdGUuYnVmQnl0ZXNTdGFydCArIHBvcztcbiAgICAgICAgICAgIGNvbnN0IGVyckZpZWxkID0gdGhpcy5fX29uRmllbGQoKTtcbiAgICAgICAgICAgIGlmIChlcnJGaWVsZCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZXJyRmllbGQ7XG4gICAgICAgICAgICBjb25zdCBlcnJSZWNvcmQgPSB0aGlzLl9fb25SZWNvcmQocHVzaCk7XG4gICAgICAgICAgICBpZiAoZXJyUmVjb3JkICE9PSB1bmRlZmluZWQpIHJldHVybiBlcnJSZWNvcmQ7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLndhc1Jvd0RlbGltaXRlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbmZvLmVtcHR5X2xpbmVzKys7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmNvbW1lbnRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5mby5jb21tZW50X2xpbmVzKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlLmJ1ZkJ5dGVzU3RhcnQgKz0gcG9zO1xuICAgICAgICB0aGlzLnN0YXRlLnByZXZpb3VzQnVmID0gYnVmLnNsaWNlKHBvcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGF0ZS53YXNSb3dEZWxpbWl0ZXIgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5pbmZvLmxpbmVzKys7XG4gICAgICAgIHRoaXMuc3RhdGUud2FzUm93RGVsaW1pdGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX29uUmVjb3JkOiBmdW5jdGlvbiAocHVzaCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBjb2x1bW5zLFxuICAgICAgICBncm91cF9jb2x1bW5zX2J5X25hbWUsXG4gICAgICAgIGVuY29kaW5nLFxuICAgICAgICBpbmZvLFxuICAgICAgICBmcm9tLFxuICAgICAgICByZWxheF9jb2x1bW5fY291bnQsXG4gICAgICAgIHJlbGF4X2NvbHVtbl9jb3VudF9sZXNzLFxuICAgICAgICByZWxheF9jb2x1bW5fY291bnRfbW9yZSxcbiAgICAgICAgcmF3LFxuICAgICAgICBza2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXMsXG4gICAgICB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgeyBlbmFibGVkLCByZWNvcmQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICBpZiAoZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19yZXNldFJlY29yZCgpO1xuICAgICAgfVxuICAgICAgLy8gQ29udmVydCB0aGUgZmlyc3QgbGluZSBpbnRvIGNvbHVtbiBuYW1lc1xuICAgICAgY29uc3QgcmVjb3JkTGVuZ3RoID0gcmVjb3JkLmxlbmd0aDtcbiAgICAgIGlmIChjb2x1bW5zID09PSB0cnVlKSB7XG4gICAgICAgIGlmIChza2lwX3JlY29yZHNfd2l0aF9lbXB0eV92YWx1ZXMgPT09IHRydWUgJiYgaXNSZWNvcmRFbXB0eShyZWNvcmQpKSB7XG4gICAgICAgICAgdGhpcy5fX3Jlc2V0UmVjb3JkKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9fZmlyc3RMaW5lVG9Db2x1bW5zKHJlY29yZCk7XG4gICAgICB9XG4gICAgICBpZiAoY29sdW1ucyA9PT0gZmFsc2UgJiYgdGhpcy5pbmZvLnJlY29yZHMgPT09IDApIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5leHBlY3RlZFJlY29yZExlbmd0aCA9IHJlY29yZExlbmd0aDtcbiAgICAgIH1cbiAgICAgIGlmIChyZWNvcmRMZW5ndGggIT09IHRoaXMuc3RhdGUuZXhwZWN0ZWRSZWNvcmRMZW5ndGgpIHtcbiAgICAgICAgY29uc3QgZXJyID1cbiAgICAgICAgICBjb2x1bW5zID09PSBmYWxzZVxuICAgICAgICAgICAgPyBuZXcgQ3N2RXJyb3IoXG4gICAgICAgICAgICAgICAgXCJDU1ZfUkVDT1JEX0lOQ09OU0lTVEVOVF9GSUVMRFNfTEVOR1RIXCIsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIFJlY29yZCBMZW5ndGg6XCIsXG4gICAgICAgICAgICAgICAgICBgZXhwZWN0ICR7dGhpcy5zdGF0ZS5leHBlY3RlZFJlY29yZExlbmd0aH0sYCxcbiAgICAgICAgICAgICAgICAgIGBnb3QgJHtyZWNvcmRMZW5ndGh9IG9uIGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcmVjb3JkOiByZWNvcmQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiBuZXcgQ3N2RXJyb3IoXG4gICAgICAgICAgICAgICAgXCJDU1ZfUkVDT1JEX0lOQ09OU0lTVEVOVF9DT0xVTU5TXCIsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIFJlY29yZCBMZW5ndGg6XCIsXG4gICAgICAgICAgICAgICAgICBgY29sdW1ucyBsZW5ndGggaXMgJHtjb2x1bW5zLmxlbmd0aH0sYCwgLy8gcmVuYW1lIGNvbHVtbnNcbiAgICAgICAgICAgICAgICAgIGBnb3QgJHtyZWNvcmRMZW5ndGh9IG9uIGxpbmUgJHt0aGlzLmluZm8ubGluZXN9YCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLl9faW5mb0ZpZWxkKCksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcmVjb3JkOiByZWNvcmQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHJlbGF4X2NvbHVtbl9jb3VudCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgIChyZWxheF9jb2x1bW5fY291bnRfbGVzcyA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgcmVjb3JkTGVuZ3RoIDwgdGhpcy5zdGF0ZS5leHBlY3RlZFJlY29yZExlbmd0aCkgfHxcbiAgICAgICAgICAocmVsYXhfY29sdW1uX2NvdW50X21vcmUgPT09IHRydWUgJiZcbiAgICAgICAgICAgIHJlY29yZExlbmd0aCA+IHRoaXMuc3RhdGUuZXhwZWN0ZWRSZWNvcmRMZW5ndGgpXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuaW5mby5pbnZhbGlkX2ZpZWxkX2xlbmd0aCsrO1xuICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgPSBlcnI7XG4gICAgICAgICAgLy8gRXJyb3IgaXMgdW5kZWZpbmVkIHdpdGggc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3JcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBmaW5hbEVyciA9IHRoaXMuX19lcnJvcihlcnIpO1xuICAgICAgICAgIGlmIChmaW5hbEVycikgcmV0dXJuIGZpbmFsRXJyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2tpcF9yZWNvcmRzX3dpdGhfZW1wdHlfdmFsdWVzID09PSB0cnVlICYmIGlzUmVjb3JkRW1wdHkocmVjb3JkKSkge1xuICAgICAgICB0aGlzLl9fcmVzZXRSZWNvcmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhdGUucmVjb3JkSGFzRXJyb3IgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5fX3Jlc2V0UmVjb3JkKCk7XG4gICAgICAgIHRoaXMuc3RhdGUucmVjb3JkSGFzRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmZvLnJlY29yZHMrKztcbiAgICAgIGlmIChmcm9tID09PSAxIHx8IHRoaXMuaW5mby5yZWNvcmRzID49IGZyb20pIHtcbiAgICAgICAgY29uc3QgeyBvYmpuYW1lIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIC8vIFdpdGggY29sdW1ucywgcmVjb3JkcyBhcmUgb2JqZWN0XG4gICAgICAgIGlmIChjb2x1bW5zICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgICAgICAgIC8vIFRyYW5zZm9ybSByZWNvcmQgYXJyYXkgdG8gYW4gb2JqZWN0XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZWNvcmQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY29sdW1uc1tpXSA9PT0gdW5kZWZpbmVkIHx8IGNvbHVtbnNbaV0uZGlzYWJsZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgLy8gVHVybiBkdXBsaWNhdGUgY29sdW1ucyBpbnRvIGFuIGFycmF5XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGdyb3VwX2NvbHVtbnNfYnlfbmFtZSA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgICBvYmpbY29sdW1uc1tpXS5uYW1lXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW2NvbHVtbnNbaV0ubmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgb2JqW2NvbHVtbnNbaV0ubmFtZV0gPSBvYmpbY29sdW1uc1tpXS5uYW1lXS5jb25jYXQocmVjb3JkW2ldKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmpbY29sdW1uc1tpXS5uYW1lXSA9IFtvYmpbY29sdW1uc1tpXS5uYW1lXSwgcmVjb3JkW2ldXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb2JqW2NvbHVtbnNbaV0ubmFtZV0gPSByZWNvcmRbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFdpdGhvdXQgb2JqbmFtZSAoZGVmYXVsdClcbiAgICAgICAgICBpZiAocmF3ID09PSB0cnVlIHx8IGluZm8gPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dFJlY29yZCA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgIHsgcmVjb3JkOiBvYmogfSxcbiAgICAgICAgICAgICAgcmF3ID09PSB0cnVlXG4gICAgICAgICAgICAgICAgPyB7IHJhdzogdGhpcy5zdGF0ZS5yYXdCdWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpIH1cbiAgICAgICAgICAgICAgICA6IHt9LFxuICAgICAgICAgICAgICBpbmZvID09PSB0cnVlID8geyBpbmZvOiB0aGlzLl9faW5mb1JlY29yZCgpIH0gOiB7fSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSB0aGlzLl9fcHVzaChcbiAgICAgICAgICAgICAgb2JqbmFtZSA9PT0gdW5kZWZpbmVkID8gZXh0UmVjb3JkIDogW29ialtvYmpuYW1lXSwgZXh0UmVjb3JkXSxcbiAgICAgICAgICAgICAgcHVzaCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IHRoaXMuX19wdXNoKFxuICAgICAgICAgICAgICBvYmpuYW1lID09PSB1bmRlZmluZWQgPyBvYmogOiBbb2JqW29iam5hbWVdLCBvYmpdLFxuICAgICAgICAgICAgICBwdXNoLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gV2l0aG91dCBjb2x1bW5zLCByZWNvcmRzIGFyZSBhcnJheVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyYXcgPT09IHRydWUgfHwgaW5mbyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgZXh0UmVjb3JkID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgeyByZWNvcmQ6IHJlY29yZCB9LFxuICAgICAgICAgICAgICByYXcgPT09IHRydWVcbiAgICAgICAgICAgICAgICA/IHsgcmF3OiB0aGlzLnN0YXRlLnJhd0J1ZmZlci50b1N0cmluZyhlbmNvZGluZykgfVxuICAgICAgICAgICAgICAgIDoge30sXG4gICAgICAgICAgICAgIGluZm8gPT09IHRydWUgPyB7IGluZm86IHRoaXMuX19pbmZvUmVjb3JkKCkgfSA6IHt9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IHRoaXMuX19wdXNoKFxuICAgICAgICAgICAgICBvYmpuYW1lID09PSB1bmRlZmluZWQgPyBleHRSZWNvcmQgOiBbcmVjb3JkW29iam5hbWVdLCBleHRSZWNvcmRdLFxuICAgICAgICAgICAgICBwdXNoLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZXJyID0gdGhpcy5fX3B1c2goXG4gICAgICAgICAgICAgIG9iam5hbWUgPT09IHVuZGVmaW5lZCA/IHJlY29yZCA6IFtyZWNvcmRbb2JqbmFtZV0sIHJlY29yZF0sXG4gICAgICAgICAgICAgIHB1c2gsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fX3Jlc2V0UmVjb3JkKCk7XG4gICAgfSxcbiAgICBfX2ZpcnN0TGluZVRvQ29sdW1uczogZnVuY3Rpb24gKHJlY29yZCkge1xuICAgICAgY29uc3QgeyBmaXJzdExpbmVUb0hlYWRlcnMgfSA9IHRoaXMuc3RhdGU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBoZWFkZXJzID1cbiAgICAgICAgICBmaXJzdExpbmVUb0hlYWRlcnMgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyByZWNvcmRcbiAgICAgICAgICAgIDogZmlyc3RMaW5lVG9IZWFkZXJzLmNhbGwobnVsbCwgcmVjb3JkKTtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX19lcnJvcihcbiAgICAgICAgICAgIG5ldyBDc3ZFcnJvcihcbiAgICAgICAgICAgICAgXCJDU1ZfSU5WQUxJRF9DT0xVTU5fTUFQUElOR1wiLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgXCJJbnZhbGlkIENvbHVtbiBNYXBwaW5nOlwiLFxuICAgICAgICAgICAgICAgIFwiZXhwZWN0IGFuIGFycmF5IGZyb20gY29sdW1uIGZ1bmN0aW9uLFwiLFxuICAgICAgICAgICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShoZWFkZXJzKX1gLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgIHRoaXMuX19pbmZvRmllbGQoKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZEhlYWRlcnMgPSBub3JtYWxpemVfY29sdW1uc19hcnJheShoZWFkZXJzKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5leHBlY3RlZFJlY29yZExlbmd0aCA9IG5vcm1hbGl6ZWRIZWFkZXJzLmxlbmd0aDtcbiAgICAgICAgdGhpcy5vcHRpb25zLmNvbHVtbnMgPSBub3JtYWxpemVkSGVhZGVycztcbiAgICAgICAgdGhpcy5fX3Jlc2V0UmVjb3JkKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgfVxuICAgIH0sXG4gICAgX19yZXNldFJlY29yZDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYXcgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yYXdCdWZmZXIucmVzZXQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGUuZXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnN0YXRlLnJlY29yZCA9IFtdO1xuICAgICAgdGhpcy5zdGF0ZS5yZWNvcmRfbGVuZ3RoID0gMDtcbiAgICB9LFxuICAgIF9fb25GaWVsZDogZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgeyBjYXN0LCBlbmNvZGluZywgcnRyaW0sIG1heF9yZWNvcmRfc2l6ZSB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgeyBlbmFibGVkLCB3YXNRdW90aW5nIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgLy8gU2hvcnQgY2lyY3VpdCBmb3IgdGhlIGZyb21fbGluZSBvcHRpb25zXG4gICAgICBpZiAoZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19yZXNldEZpZWxkKCk7XG4gICAgICB9XG4gICAgICBsZXQgZmllbGQgPSB0aGlzLnN0YXRlLmZpZWxkLnRvU3RyaW5nKGVuY29kaW5nKTtcbiAgICAgIGlmIChydHJpbSA9PT0gdHJ1ZSAmJiB3YXNRdW90aW5nID09PSBmYWxzZSkge1xuICAgICAgICBmaWVsZCA9IGZpZWxkLnRyaW1SaWdodCgpO1xuICAgICAgfVxuICAgICAgaWYgKGNhc3QgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgW2VyciwgZl0gPSB0aGlzLl9fY2FzdChmaWVsZCk7XG4gICAgICAgIGlmIChlcnIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVycjtcbiAgICAgICAgZmllbGQgPSBmO1xuICAgICAgfVxuICAgICAgdGhpcy5zdGF0ZS5yZWNvcmQucHVzaChmaWVsZCk7XG4gICAgICAvLyBJbmNyZW1lbnQgcmVjb3JkIGxlbmd0aCBpZiByZWNvcmQgc2l6ZSBtdXN0IG5vdCBleGNlZWQgYSBsaW1pdFxuICAgICAgaWYgKG1heF9yZWNvcmRfc2l6ZSAhPT0gMCAmJiB0eXBlb2YgZmllbGQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWNvcmRfbGVuZ3RoICs9IGZpZWxkLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19yZXNldEZpZWxkKCk7XG4gICAgfSxcbiAgICBfX3Jlc2V0RmllbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc3RhdGUuZmllbGQucmVzZXQoKTtcbiAgICAgIHRoaXMuc3RhdGUud2FzUXVvdGluZyA9IGZhbHNlO1xuICAgIH0sXG4gICAgX19wdXNoOiBmdW5jdGlvbiAocmVjb3JkLCBwdXNoKSB7XG4gICAgICBjb25zdCB7IG9uX3JlY29yZCB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgaWYgKG9uX3JlY29yZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9faW5mb1JlY29yZCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlY29yZCA9IG9uX3JlY29yZC5jYWxsKG51bGwsIHJlY29yZCwgaW5mbyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlY29yZCA9PT0gdW5kZWZpbmVkIHx8IHJlY29yZCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHVzaChyZWNvcmQpO1xuICAgIH0sXG4gICAgLy8gUmV0dXJuIGEgdHVwbGUgd2l0aCB0aGUgZXJyb3IgYW5kIHRoZSBjYXN0ZWQgdmFsdWVcbiAgICBfX2Nhc3Q6IGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgY29uc3QgeyBjb2x1bW5zLCByZWxheF9jb2x1bW5fY291bnQgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGlzQ29sdW1ucyA9IEFycmF5LmlzQXJyYXkoY29sdW1ucyk7XG4gICAgICAvLyBEb250IGxvb3NlIHRpbWUgY2FsbGluZyBjYXN0XG4gICAgICAvLyBiZWNhdXNlIHRoZSBmaW5hbCByZWNvcmQgaXMgYW4gb2JqZWN0XG4gICAgICAvLyBhbmQgdGhpcyBmaWVsZCBjYW4ndCBiZSBhc3NvY2lhdGVkIHRvIGEga2V5IHByZXNlbnQgaW4gY29sdW1uc1xuICAgICAgaWYgKFxuICAgICAgICBpc0NvbHVtbnMgPT09IHRydWUgJiZcbiAgICAgICAgcmVsYXhfY29sdW1uX2NvdW50ICYmXG4gICAgICAgIHRoaXMub3B0aW9ucy5jb2x1bW5zLmxlbmd0aCA8PSB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGhcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdW5kZWZpbmVkXTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXRlLmNhc3RGaWVsZCAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9faW5mb0ZpZWxkKCk7XG4gICAgICAgICAgcmV0dXJuIFt1bmRlZmluZWQsIHRoaXMuc3RhdGUuY2FzdEZpZWxkLmNhbGwobnVsbCwgZmllbGQsIGluZm8pXTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIFtlcnJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fX2lzRmxvYXQoZmllbGQpKSB7XG4gICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCBwYXJzZUZsb2F0KGZpZWxkKV07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5jYXN0X2RhdGUgIT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9faW5mb0ZpZWxkKCk7XG4gICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuY2FzdF9kYXRlLmNhbGwobnVsbCwgZmllbGQsIGluZm8pXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbdW5kZWZpbmVkLCBmaWVsZF07XG4gICAgfSxcbiAgICAvLyBIZWxwZXIgdG8gdGVzdCBpZiBhIGNoYXJhY3RlciBpcyBhIHNwYWNlIG9yIGEgbGluZSBkZWxpbWl0ZXJcbiAgICBfX2lzQ2hhclRyaW1hYmxlOiBmdW5jdGlvbiAoYnVmLCBwb3MpIHtcbiAgICAgIGNvbnN0IGlzVHJpbSA9IChidWYsIHBvcykgPT4ge1xuICAgICAgICBjb25zdCB7IHRpbWNoYXJzIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICBsb29wMTogZm9yIChsZXQgaSA9IDA7IGkgPCB0aW1jaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHRpbWNoYXIgPSB0aW1jaGFyc1tpXTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRpbWNoYXIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmICh0aW1jaGFyW2pdICE9PSBidWZbcG9zICsgal0pIGNvbnRpbnVlIGxvb3AxO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGltY2hhci5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGlzVHJpbShidWYsIHBvcyk7XG4gICAgfSxcbiAgICAvLyBLZWVwIGl0IGluIGNhc2Ugd2UgaW1wbGVtZW50IHRoZSBgY2FzdF9pbnRgIG9wdGlvblxuICAgIC8vIF9faXNJbnQodmFsdWUpe1xuICAgIC8vICAgLy8gcmV0dXJuIE51bWJlci5pc0ludGVnZXIocGFyc2VJbnQodmFsdWUpKVxuICAgIC8vICAgLy8gcmV0dXJuICFpc05hTiggcGFyc2VJbnQoIG9iaiApICk7XG4gICAgLy8gICByZXR1cm4gL14oXFwtfFxcKyk/WzEtOV1bMC05XSokLy50ZXN0KHZhbHVlKVxuICAgIC8vIH1cbiAgICBfX2lzRmxvYXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlIC0gcGFyc2VGbG9hdCh2YWx1ZSkgKyAxID49IDA7IC8vIEJvcnJvd2VkIGZyb20ganF1ZXJ5XG4gICAgfSxcbiAgICBfX2NvbXBhcmVCeXRlczogZnVuY3Rpb24gKHNvdXJjZUJ1ZiwgdGFyZ2V0QnVmLCB0YXJnZXRQb3MsIGZpcnN0Qnl0ZSkge1xuICAgICAgaWYgKHNvdXJjZUJ1ZlswXSAhPT0gZmlyc3RCeXRlKSByZXR1cm4gMDtcbiAgICAgIGNvbnN0IHNvdXJjZUxlbmd0aCA9IHNvdXJjZUJ1Zi5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNvdXJjZUxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VCdWZbaV0gIT09IHRhcmdldEJ1Zlt0YXJnZXRQb3MgKyBpXSkgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gc291cmNlTGVuZ3RoO1xuICAgIH0sXG4gICAgX19pc0RlbGltaXRlcjogZnVuY3Rpb24gKGJ1ZiwgcG9zLCBjaHIpIHtcbiAgICAgIGNvbnN0IHsgZGVsaW1pdGVyLCBpZ25vcmVfbGFzdF9kZWxpbWl0ZXJzIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBpZiAoXG4gICAgICAgIGlnbm9yZV9sYXN0X2RlbGltaXRlcnMgPT09IHRydWUgJiZcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWNvcmQubGVuZ3RoID09PSB0aGlzLm9wdGlvbnMuY29sdW1ucy5sZW5ndGggLSAxXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBpZ25vcmVfbGFzdF9kZWxpbWl0ZXJzICE9PSBmYWxzZSAmJlxuICAgICAgICB0eXBlb2YgaWdub3JlX2xhc3RfZGVsaW1pdGVycyA9PT0gXCJudW1iZXJcIiAmJlxuICAgICAgICB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGggPT09IGlnbm9yZV9sYXN0X2RlbGltaXRlcnMgLSAxXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICBsb29wMTogZm9yIChsZXQgaSA9IDA7IGkgPCBkZWxpbWl0ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGVsID0gZGVsaW1pdGVyW2ldO1xuICAgICAgICBpZiAoZGVsWzBdID09PSBjaHIpIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IGRlbC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGRlbFtqXSAhPT0gYnVmW3BvcyArIGpdKSBjb250aW51ZSBsb29wMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGRlbC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0sXG4gICAgX19pc1JlY29yZERlbGltaXRlcjogZnVuY3Rpb24gKGNociwgYnVmLCBwb3MpIHtcbiAgICAgIGNvbnN0IHsgcmVjb3JkX2RlbGltaXRlciB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgcmVjb3JkRGVsaW1pdGVyTGVuZ3RoID0gcmVjb3JkX2RlbGltaXRlci5sZW5ndGg7XG4gICAgICBsb29wMTogZm9yIChsZXQgaSA9IDA7IGkgPCByZWNvcmREZWxpbWl0ZXJMZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByZCA9IHJlY29yZF9kZWxpbWl0ZXJbaV07XG4gICAgICAgIGNvbnN0IHJkTGVuZ3RoID0gcmQubGVuZ3RoO1xuICAgICAgICBpZiAocmRbMF0gIT09IGNocikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgcmRMZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmIChyZFtqXSAhPT0gYnVmW3BvcyArIGpdKSB7XG4gICAgICAgICAgICBjb250aW51ZSBsb29wMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJkLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0sXG4gICAgX19pc0VzY2FwZTogZnVuY3Rpb24gKGJ1ZiwgcG9zLCBjaHIpIHtcbiAgICAgIGNvbnN0IHsgZXNjYXBlIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBpZiAoZXNjYXBlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBsID0gZXNjYXBlLmxlbmd0aDtcbiAgICAgIGlmIChlc2NhcGVbMF0gPT09IGNocikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChlc2NhcGVbaV0gIT09IGJ1Zltwb3MgKyBpXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIF9faXNRdW90ZTogZnVuY3Rpb24gKGJ1ZiwgcG9zKSB7XG4gICAgICBjb25zdCB7IHF1b3RlIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBpZiAocXVvdGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IGwgPSBxdW90ZS5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAocXVvdGVbaV0gIT09IGJ1Zltwb3MgKyBpXSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBfX2F1dG9EaXNjb3ZlclJlY29yZERlbGltaXRlcjogZnVuY3Rpb24gKGJ1ZiwgcG9zKSB7XG4gICAgICBjb25zdCB7IGVuY29kaW5nIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAvLyBOb3RlLCB3ZSBkb24ndCBuZWVkIHRvIGNhY2hlIHRoaXMgaW5mb3JtYXRpb24gaW4gc3RhdGUsXG4gICAgICAvLyBJdCBpcyBvbmx5IGNhbGxlZCBvbiB0aGUgZmlyc3QgbGluZSB1bnRpbCB3ZSBmaW5kIG91dCBhIHN1aXRhYmxlXG4gICAgICAvLyByZWNvcmQgZGVsaW1pdGVyLlxuICAgICAgY29uc3QgcmRzID0gW1xuICAgICAgICAvLyBJbXBvcnRhbnQsIHRoZSB3aW5kb3dzIGxpbmUgZW5kaW5nIG11c3QgYmUgYmVmb3JlIG1hYyBvcyA5XG4gICAgICAgIEJ1ZmZlci5mcm9tKFwiXFxyXFxuXCIsIGVuY29kaW5nKSxcbiAgICAgICAgQnVmZmVyLmZyb20oXCJcXG5cIiwgZW5jb2RpbmcpLFxuICAgICAgICBCdWZmZXIuZnJvbShcIlxcclwiLCBlbmNvZGluZyksXG4gICAgICBdO1xuICAgICAgbG9vcDogZm9yIChsZXQgaSA9IDA7IGkgPCByZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbCA9IHJkc1tpXS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgaWYgKHJkc1tpXVtqXSAhPT0gYnVmW3BvcyArIGpdKSB7XG4gICAgICAgICAgICBjb250aW51ZSBsb29wO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMucmVjb3JkX2RlbGltaXRlci5wdXNoKHJkc1tpXSk7XG4gICAgICAgIHRoaXMuc3RhdGUucmVjb3JkRGVsaW1pdGVyTWF4TGVuZ3RoID0gcmRzW2ldLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJkc1tpXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9LFxuICAgIF9fZXJyb3I6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgIGNvbnN0IHsgZW5jb2RpbmcsIHJhdywgc2tpcF9yZWNvcmRzX3dpdGhfZXJyb3IgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IGVyciA9IHR5cGVvZiBtc2cgPT09IFwic3RyaW5nXCIgPyBuZXcgRXJyb3IobXNnKSA6IG1zZztcbiAgICAgIGlmIChza2lwX3JlY29yZHNfd2l0aF9lcnJvcikge1xuICAgICAgICB0aGlzLnN0YXRlLnJlY29yZEhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbl9za2lwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25fc2tpcChcbiAgICAgICAgICAgIGVycixcbiAgICAgICAgICAgIHJhdyA/IHRoaXMuc3RhdGUucmF3QnVmZmVyLnRvU3RyaW5nKGVuY29kaW5nKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMuZW1pdCgnc2tpcCcsIGVyciwgcmF3ID8gdGhpcy5zdGF0ZS5yYXdCdWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpIDogdW5kZWZpbmVkKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlcnI7XG4gICAgICB9XG4gICAgfSxcbiAgICBfX2luZm9EYXRhU2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50aGlzLmluZm8sXG4gICAgICAgIGNvbHVtbnM6IHRoaXMub3B0aW9ucy5jb2x1bW5zLFxuICAgICAgfTtcbiAgICB9LFxuICAgIF9faW5mb1JlY29yZDogZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgeyBjb2x1bW5zLCByYXcsIGVuY29kaW5nIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50aGlzLl9faW5mb0RhdGFTZXQoKSxcbiAgICAgICAgZXJyb3I6IHRoaXMuc3RhdGUuZXJyb3IsXG4gICAgICAgIGhlYWRlcjogY29sdW1ucyA9PT0gdHJ1ZSxcbiAgICAgICAgaW5kZXg6IHRoaXMuc3RhdGUucmVjb3JkLmxlbmd0aCxcbiAgICAgICAgcmF3OiByYXcgPyB0aGlzLnN0YXRlLnJhd0J1ZmZlci50b1N0cmluZyhlbmNvZGluZykgOiB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgIH0sXG4gICAgX19pbmZvRmllbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHsgY29sdW1ucyB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgY29uc3QgaXNDb2x1bW5zID0gQXJyYXkuaXNBcnJheShjb2x1bW5zKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRoaXMuX19pbmZvUmVjb3JkKCksXG4gICAgICAgIGNvbHVtbjpcbiAgICAgICAgICBpc0NvbHVtbnMgPT09IHRydWVcbiAgICAgICAgICAgID8gY29sdW1ucy5sZW5ndGggPiB0aGlzLnN0YXRlLnJlY29yZC5sZW5ndGhcbiAgICAgICAgICAgICAgPyBjb2x1bW5zW3RoaXMuc3RhdGUucmVjb3JkLmxlbmd0aF0ubmFtZVxuICAgICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICAgIDogdGhpcy5zdGF0ZS5yZWNvcmQubGVuZ3RoLFxuICAgICAgICBxdW90aW5nOiB0aGlzLnN0YXRlLndhc1F1b3RpbmcsXG4gICAgICB9O1xuICAgIH0sXG4gIH07XG59O1xuXG5jb25zdCBwYXJzZSA9IGZ1bmN0aW9uIChkYXRhLCBvcHRzID0ge30pIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEpO1xuICB9XG4gIGNvbnN0IHJlY29yZHMgPSBvcHRzICYmIG9wdHMub2JqbmFtZSA/IHt9IDogW107XG4gIGNvbnN0IHBhcnNlciA9IHRyYW5zZm9ybShvcHRzKTtcbiAgY29uc3QgcHVzaCA9IChyZWNvcmQpID0+IHtcbiAgICBpZiAocGFyc2VyLm9wdGlvbnMub2JqbmFtZSA9PT0gdW5kZWZpbmVkKSByZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICBlbHNlIHtcbiAgICAgIHJlY29yZHNbcmVjb3JkWzBdXSA9IHJlY29yZFsxXTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGNsb3NlID0gKCkgPT4ge307XG4gIGNvbnN0IGVycjEgPSBwYXJzZXIucGFyc2UoZGF0YSwgZmFsc2UsIHB1c2gsIGNsb3NlKTtcbiAgaWYgKGVycjEgIT09IHVuZGVmaW5lZCkgdGhyb3cgZXJyMTtcbiAgY29uc3QgZXJyMiA9IHBhcnNlci5wYXJzZSh1bmRlZmluZWQsIHRydWUsIHB1c2gsIGNsb3NlKTtcbiAgaWYgKGVycjIgIT09IHVuZGVmaW5lZCkgdGhyb3cgZXJyMjtcbiAgcmV0dXJuIHJlY29yZHM7XG59O1xuXG5leHBvcnRzLkNzdkVycm9yID0gQ3N2RXJyb3I7XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIExvZGFzaCBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0YFxuXG5jb25zdCBjaGFyQ29kZU9mRG90ID0gXCIuXCIuY2hhckNvZGVBdCgwKTtcbmNvbnN0IHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuY29uc3QgcmVQcm9wTmFtZSA9IFJlZ0V4cChcbiAgLy8gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIGRvdCBvciBicmFja2V0LlxuICBcIlteLltcXFxcXV0rXCIgK1xuICAgIFwifFwiICtcbiAgICAvLyBPciBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gYnJhY2tldHMuXG4gICAgXCJcXFxcWyg/OlwiICtcbiAgICAvLyBNYXRjaCBhIG5vbi1zdHJpbmcgZXhwcmVzc2lvbi5cbiAgICBcIihbXlxcXCInXVteW10qKVwiICtcbiAgICBcInxcIiArXG4gICAgLy8gT3IgbWF0Y2ggc3RyaW5ncyAoc3VwcG9ydHMgZXNjYXBpbmcgY2hhcmFjdGVycykuXG4gICAgXCIoW1xcXCInXSkoKD86KD8hXFxcXDIpW15cXFxcXFxcXF18XFxcXFxcXFwuKSo/KVxcXFwyXCIgK1xuICAgIFwiKVxcXFxdXCIgK1xuICAgIFwifFwiICtcbiAgICAvLyBPciBtYXRjaCBcIlwiIGFzIHRoZSBzcGFjZSBiZXR3ZWVuIGNvbnNlY3V0aXZlIGRvdHMgb3IgZW1wdHkgYnJhY2tldHMuXG4gICAgXCIoPz0oPzpcXFxcLnxcXFxcW1xcXFxdKSg/OlxcXFwufFxcXFxbXFxcXF18JCkpXCIsXG4gIFwiZ1wiLFxuKTtcbmNvbnN0IHJlSXNEZWVwUHJvcCA9IC9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSo/XFwxKVxcXS87XG5jb25zdCByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbmNvbnN0IGdldFRhZyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbn07XG5cbmNvbnN0IGlzU3ltYm9sID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAoXG4gICAgdHlwZSA9PT0gXCJzeW1ib2xcIiB8fFxuICAgICh0eXBlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICYmIGdldFRhZyh2YWx1ZSkgPT09IFwiW29iamVjdCBTeW1ib2xdXCIpXG4gICk7XG59O1xuXG5jb25zdCBpc0tleSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAoXG4gICAgdHlwZSA9PT0gXCJudW1iZXJcIiB8fFxuICAgIHR5cGUgPT09IFwic3ltYm9sXCIgfHxcbiAgICB0eXBlID09PSBcImJvb2xlYW5cIiB8fFxuICAgICF2YWx1ZSB8fFxuICAgIGlzU3ltYm9sKHZhbHVlKVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHxcbiAgICAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpIHx8XG4gICAgKG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIE9iamVjdChvYmplY3QpKVxuICApO1xufTtcblxuY29uc3Qgc3RyaW5nVG9QYXRoID0gZnVuY3Rpb24gKHN0cmluZykge1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgaWYgKHN0cmluZy5jaGFyQ29kZUF0KDApID09PSBjaGFyQ29kZU9mRG90KSB7XG4gICAgcmVzdWx0LnB1c2goXCJcIik7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24gKG1hdGNoLCBleHByZXNzaW9uLCBxdW90ZSwgc3ViU3RyaW5nKSB7XG4gICAgbGV0IGtleSA9IG1hdGNoO1xuICAgIGlmIChxdW90ZSkge1xuICAgICAga2V5ID0gc3ViU3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCBcIiQxXCIpO1xuICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbikge1xuICAgICAga2V5ID0gZXhwcmVzc2lvbi50cmltKCk7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgY2FzdFBhdGggPSBmdW5jdGlvbiAodmFsdWUsIG9iamVjdCkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGlzS2V5KHZhbHVlLCBvYmplY3QpID8gW3ZhbHVlXSA6IHN0cmluZ1RvUGF0aCh2YWx1ZSk7XG4gIH1cbn07XG5cbmNvbnN0IHRvS2V5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHwgaXNTeW1ib2wodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gIGNvbnN0IHJlc3VsdCA9IGAke3ZhbHVlfWA7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICByZXR1cm4gcmVzdWx0ID09IFwiMFwiICYmIDEgLyB2YWx1ZSA9PSAtSU5GSU5JVFkgPyBcIi0wXCIgOiByZXN1bHQ7XG59O1xuXG5jb25zdCBnZXQgPSBmdW5jdGlvbiAob2JqZWN0LCBwYXRoKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuICBsZXQgaW5kZXggPSAwO1xuICBjb25zdCBsZW5ndGggPSBwYXRoLmxlbmd0aDtcbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gaW5kZXggJiYgaW5kZXggPT09IGxlbmd0aCA/IG9iamVjdCA6IHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IGlzX29iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgb2JqICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KG9iaik7XG59O1xuXG5jb25zdCBub3JtYWxpemVfY29sdW1ucyA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gIGlmIChjb2x1bW5zID09PSB1bmRlZmluZWQgfHwgY29sdW1ucyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBbdW5kZWZpbmVkLCB1bmRlZmluZWRdO1xuICB9XG4gIGlmICh0eXBlb2YgY29sdW1ucyAhPT0gXCJvYmplY3RcIikge1xuICAgIHJldHVybiBbRXJyb3IoJ0ludmFsaWQgb3B0aW9uIFwiY29sdW1uc1wiOiBleHBlY3QgYW4gYXJyYXkgb3IgYW4gb2JqZWN0JyldO1xuICB9XG4gIGlmICghQXJyYXkuaXNBcnJheShjb2x1bW5zKSkge1xuICAgIGNvbnN0IG5ld2NvbHVtbnMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gY29sdW1ucykge1xuICAgICAgbmV3Y29sdW1ucy5wdXNoKHtcbiAgICAgICAga2V5OiBrLFxuICAgICAgICBoZWFkZXI6IGNvbHVtbnNba10sXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29sdW1ucyA9IG5ld2NvbHVtbnM7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbmV3Y29sdW1ucyA9IFtdO1xuICAgIGZvciAoY29uc3QgY29sdW1uIG9mIGNvbHVtbnMpIHtcbiAgICAgIGlmICh0eXBlb2YgY29sdW1uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIG5ld2NvbHVtbnMucHVzaCh7XG4gICAgICAgICAga2V5OiBjb2x1bW4sXG4gICAgICAgICAgaGVhZGVyOiBjb2x1bW4sXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZW9mIGNvbHVtbiA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICBjb2x1bW4gIT09IG51bGwgJiZcbiAgICAgICAgIUFycmF5LmlzQXJyYXkoY29sdW1uKVxuICAgICAgKSB7XG4gICAgICAgIGlmICghY29sdW1uLmtleSkge1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBFcnJvcignSW52YWxpZCBjb2x1bW4gZGVmaW5pdGlvbjogcHJvcGVydHkgXCJrZXlcIiBpcyByZXF1aXJlZCcpLFxuICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbHVtbi5oZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbHVtbi5oZWFkZXIgPSBjb2x1bW4ua2V5O1xuICAgICAgICB9XG4gICAgICAgIG5ld2NvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBFcnJvcihcIkludmFsaWQgY29sdW1uIGRlZmluaXRpb246IGV4cGVjdCBhIHN0cmluZyBvciBhbiBvYmplY3RcIiksXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfVxuICAgIGNvbHVtbnMgPSBuZXdjb2x1bW5zO1xuICB9XG4gIHJldHVybiBbdW5kZWZpbmVkLCBjb2x1bW5zXTtcbn07XG5cbmNsYXNzIENzdkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcihjb2RlLCBtZXNzYWdlLCAuLi5jb250ZXh0cykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2UpKSBtZXNzYWdlID0gbWVzc2FnZS5qb2luKFwiIFwiKTtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQ3N2RXJyb3IpO1xuICAgIH1cbiAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgIGZvciAoY29uc3QgY29udGV4dCBvZiBjb250ZXh0cykge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29udGV4dCkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRleHRba2V5XTtcbiAgICAgICAgdGhpc1trZXldID0gQnVmZmVyLmlzQnVmZmVyKHZhbHVlKVxuICAgICAgICAgID8gdmFsdWUudG9TdHJpbmcoKVxuICAgICAgICAgIDogdmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyB2YWx1ZVxuICAgICAgICAgICAgOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHVuZGVyc2NvcmUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoXywgbWF0Y2gpIHtcbiAgICByZXR1cm4gXCJfXCIgKyBtYXRjaC50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn07XG5cbmNvbnN0IG5vcm1hbGl6ZV9vcHRpb25zID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuICAvLyBNZXJnZSB3aXRoIHVzZXIgb3B0aW9uc1xuICBmb3IgKGNvbnN0IG9wdCBpbiBvcHRzKSB7XG4gICAgb3B0aW9uc1t1bmRlcnNjb3JlKG9wdCldID0gb3B0c1tvcHRdO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGJvbWBcbiAgaWYgKFxuICAgIG9wdGlvbnMuYm9tID09PSB1bmRlZmluZWQgfHxcbiAgICBvcHRpb25zLmJvbSA9PT0gbnVsbCB8fFxuICAgIG9wdGlvbnMuYm9tID09PSBmYWxzZVxuICApIHtcbiAgICBvcHRpb25zLmJvbSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuYm9tICE9PSB0cnVlKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBDc3ZFcnJvcihcIkNTVl9PUFRJT05fQk9PTEVBTl9JTlZBTElEX1RZUEVcIiwgW1xuICAgICAgICBcIm9wdGlvbiBgYm9tYCBpcyBvcHRpb25hbCBhbmQgbXVzdCBiZSBhIGJvb2xlYW4gdmFsdWUsXCIsXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmJvbSl9YCxcbiAgICAgIF0pLFxuICAgIF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZGVsaW1pdGVyYFxuICBpZiAob3B0aW9ucy5kZWxpbWl0ZXIgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmRlbGltaXRlciA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMuZGVsaW1pdGVyID0gXCIsXCI7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMuZGVsaW1pdGVyKSkge1xuICAgIG9wdGlvbnMuZGVsaW1pdGVyID0gb3B0aW9ucy5kZWxpbWl0ZXIudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5kZWxpbWl0ZXIgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgbmV3IENzdkVycm9yKFwiQ1NWX09QVElPTl9ERUxJTUlURVJfSU5WQUxJRF9UWVBFXCIsIFtcbiAgICAgICAgXCJvcHRpb24gYGRlbGltaXRlcmAgbXVzdCBiZSBhIGJ1ZmZlciBvciBhIHN0cmluZyxcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGVsaW1pdGVyKX1gLFxuICAgICAgXSksXG4gICAgXTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBxdW90ZWBcbiAgaWYgKG9wdGlvbnMucXVvdGUgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5xdW90ZSA9ICdcIic7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5xdW90ZSA9PT0gdHJ1ZSkge1xuICAgIG9wdGlvbnMucXVvdGUgPSAnXCInO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMucXVvdGUgPT09IGZhbHNlKSB7XG4gICAgb3B0aW9ucy5xdW90ZSA9IFwiXCI7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucXVvdGUpKSB7XG4gICAgb3B0aW9ucy5xdW90ZSA9IG9wdGlvbnMucXVvdGUudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5xdW90ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBbXG4gICAgICBuZXcgQ3N2RXJyb3IoXCJDU1ZfT1BUSU9OX1FVT1RFX0lOVkFMSURfVFlQRVwiLCBbXG4gICAgICAgIFwib3B0aW9uIGBxdW90ZWAgbXVzdCBiZSBhIGJvb2xlYW4sIGEgYnVmZmVyIG9yIGEgc3RyaW5nLFwiLFxuICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucy5xdW90ZSl9YCxcbiAgICAgIF0pLFxuICAgIF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcXVvdGVkYFxuICBpZiAob3B0aW9ucy5xdW90ZWQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlZCA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMucXVvdGVkID0gZmFsc2U7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgZXNjYXBlX2Zvcm11bGFzYFxuICBpZiAoXG4gICAgb3B0aW9ucy5lc2NhcGVfZm9ybXVsYXMgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMuZXNjYXBlX2Zvcm11bGFzID09PSBudWxsXG4gICkge1xuICAgIG9wdGlvbnMuZXNjYXBlX2Zvcm11bGFzID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuZXNjYXBlX2Zvcm11bGFzICE9PSBcImJvb2xlYW5cIikge1xuICAgIHJldHVybiBbXG4gICAgICBuZXcgQ3N2RXJyb3IoXCJDU1ZfT1BUSU9OX0VTQ0FQRV9GT1JNVUxBU19JTlZBTElEX1RZUEVcIiwgW1xuICAgICAgICBcIm9wdGlvbiBgZXNjYXBlX2Zvcm11bGFzYCBtdXN0IGJlIGEgYm9vbGVhbixcIixcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuZXNjYXBlX2Zvcm11bGFzKX1gLFxuICAgICAgXSksXG4gICAgXTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBxdW90ZWRfZW1wdHlgXG4gIGlmIChvcHRpb25zLnF1b3RlZF9lbXB0eSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucXVvdGVkX2VtcHR5ID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5xdW90ZWRfZW1wdHkgPSB1bmRlZmluZWQ7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcXVvdGVkX21hdGNoYFxuICBpZiAoXG4gICAgb3B0aW9ucy5xdW90ZWRfbWF0Y2ggPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMucXVvdGVkX21hdGNoID09PSBudWxsIHx8XG4gICAgb3B0aW9ucy5xdW90ZWRfbWF0Y2ggPT09IGZhbHNlXG4gICkge1xuICAgIG9wdGlvbnMucXVvdGVkX21hdGNoID0gbnVsbDtcbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLnF1b3RlZF9tYXRjaCkpIHtcbiAgICBvcHRpb25zLnF1b3RlZF9tYXRjaCA9IFtvcHRpb25zLnF1b3RlZF9tYXRjaF07XG4gIH1cbiAgaWYgKG9wdGlvbnMucXVvdGVkX21hdGNoKSB7XG4gICAgZm9yIChjb25zdCBxdW90ZWRfbWF0Y2ggb2Ygb3B0aW9ucy5xdW90ZWRfbWF0Y2gpIHtcbiAgICAgIGNvbnN0IGlzU3RyaW5nID0gdHlwZW9mIHF1b3RlZF9tYXRjaCA9PT0gXCJzdHJpbmdcIjtcbiAgICAgIGNvbnN0IGlzUmVnRXhwID0gcXVvdGVkX21hdGNoIGluc3RhbmNlb2YgUmVnRXhwO1xuICAgICAgaWYgKCFpc1N0cmluZyAmJiAhaXNSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBFcnJvcihcbiAgICAgICAgICAgIGBJbnZhbGlkIE9wdGlvbjogcXVvdGVkX21hdGNoIG11c3QgYmUgYSBzdHJpbmcgb3IgYSByZWdleCwgZ290ICR7SlNPTi5zdHJpbmdpZnkocXVvdGVkX21hdGNoKX1gLFxuICAgICAgICAgICksXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHF1b3RlZF9zdHJpbmdgXG4gIGlmIChvcHRpb25zLnF1b3RlZF9zdHJpbmcgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlZF9zdHJpbmcgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLnF1b3RlZF9zdHJpbmcgPSBmYWxzZTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGBlb2ZgXG4gIGlmIChvcHRpb25zLmVvZiA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuZW9mID09PSBudWxsKSB7XG4gICAgb3B0aW9ucy5lb2YgPSB0cnVlO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYGVzY2FwZWBcbiAgaWYgKG9wdGlvbnMuZXNjYXBlID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5lc2NhcGUgPT09IG51bGwpIHtcbiAgICBvcHRpb25zLmVzY2FwZSA9ICdcIic7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMuZXNjYXBlKSkge1xuICAgIG9wdGlvbnMuZXNjYXBlID0gb3B0aW9ucy5lc2NhcGUudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5lc2NhcGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIE9wdGlvbjogZXNjYXBlIG11c3QgYmUgYSBidWZmZXIgb3IgYSBzdHJpbmcsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMuZXNjYXBlKX1gLFxuICAgICAgKSxcbiAgICBdO1xuICB9XG4gIGlmIChvcHRpb25zLmVzY2FwZS5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIEVycm9yKFxuICAgICAgICBgSW52YWxpZCBPcHRpb246IGVzY2FwZSBtdXN0IGJlIG9uZSBjaGFyYWN0ZXIsIGdvdCAke29wdGlvbnMuZXNjYXBlLmxlbmd0aH0gY2hhcmFjdGVyc2AsXG4gICAgICApLFxuICAgIF07XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgaGVhZGVyYFxuICBpZiAob3B0aW9ucy5oZWFkZXIgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmhlYWRlciA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMuaGVhZGVyID0gZmFsc2U7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY29sdW1uc2BcbiAgY29uc3QgW2VyckNvbHVtbnMsIGNvbHVtbnNdID0gbm9ybWFsaXplX2NvbHVtbnMob3B0aW9ucy5jb2x1bW5zKTtcbiAgaWYgKGVyckNvbHVtbnMgIT09IHVuZGVmaW5lZCkgcmV0dXJuIFtlcnJDb2x1bW5zXTtcbiAgb3B0aW9ucy5jb2x1bW5zID0gY29sdW1ucztcbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgcXVvdGVkYFxuICBpZiAob3B0aW9ucy5xdW90ZWQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnF1b3RlZCA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMucXVvdGVkID0gZmFsc2U7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBgY2FzdGBcbiAgaWYgKG9wdGlvbnMuY2FzdCA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuY2FzdCA9PT0gbnVsbCkge1xuICAgIG9wdGlvbnMuY2FzdCA9IHt9O1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gY2FzdC5iaWdpbnRcbiAgaWYgKG9wdGlvbnMuY2FzdC5iaWdpbnQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmNhc3QuYmlnaW50ID09PSBudWxsKSB7XG4gICAgLy8gQ2FzdCBib29sZWFuIHRvIHN0cmluZyBieSBkZWZhdWx0XG4gICAgb3B0aW9ucy5jYXN0LmJpZ2ludCA9ICh2YWx1ZSkgPT4gXCJcIiArIHZhbHVlO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gY2FzdC5ib29sZWFuXG4gIGlmIChvcHRpb25zLmNhc3QuYm9vbGVhbiA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuY2FzdC5ib29sZWFuID09PSBudWxsKSB7XG4gICAgLy8gQ2FzdCBib29sZWFuIHRvIHN0cmluZyBieSBkZWZhdWx0XG4gICAgb3B0aW9ucy5jYXN0LmJvb2xlYW4gPSAodmFsdWUpID0+ICh2YWx1ZSA/IFwiMVwiIDogXCJcIik7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBjYXN0LmRhdGVcbiAgaWYgKG9wdGlvbnMuY2FzdC5kYXRlID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5jYXN0LmRhdGUgPT09IG51bGwpIHtcbiAgICAvLyBDYXN0IGRhdGUgdG8gdGltZXN0YW1wIHN0cmluZyBieSBkZWZhdWx0XG4gICAgb3B0aW9ucy5jYXN0LmRhdGUgPSAodmFsdWUpID0+IFwiXCIgKyB2YWx1ZS5nZXRUaW1lKCk7XG4gIH1cbiAgLy8gTm9ybWFsaXplIG9wdGlvbiBjYXN0Lm51bWJlclxuICBpZiAob3B0aW9ucy5jYXN0Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuY2FzdC5udW1iZXIgPT09IG51bGwpIHtcbiAgICAvLyBDYXN0IG51bWJlciB0byBzdHJpbmcgdXNpbmcgbmF0aXZlIGNhc3RpbmcgYnkgZGVmYXVsdFxuICAgIG9wdGlvbnMuY2FzdC5udW1iZXIgPSAodmFsdWUpID0+IFwiXCIgKyB2YWx1ZTtcbiAgfVxuICAvLyBOb3JtYWxpemUgb3B0aW9uIGNhc3Qub2JqZWN0XG4gIGlmIChvcHRpb25zLmNhc3Qub2JqZWN0ID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5jYXN0Lm9iamVjdCA9PT0gbnVsbCkge1xuICAgIC8vIFN0cmluZ2lmeSBvYmplY3QgYXMgSlNPTiBieSBkZWZhdWx0XG4gICAgb3B0aW9ucy5jYXN0Lm9iamVjdCA9ICh2YWx1ZSkgPT4gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gY2FzdC5zdHJpbmdcbiAgaWYgKG9wdGlvbnMuY2FzdC5zdHJpbmcgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmNhc3Quc3RyaW5nID09PSBudWxsKSB7XG4gICAgLy8gTGVhdmUgc3RyaW5nIHVudG91Y2hlZFxuICAgIG9wdGlvbnMuY2FzdC5zdHJpbmcgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYG9uX3JlY29yZGBcbiAgaWYgKFxuICAgIG9wdGlvbnMub25fcmVjb3JkICE9PSB1bmRlZmluZWQgJiZcbiAgICB0eXBlb2Ygb3B0aW9ucy5vbl9yZWNvcmQgIT09IFwiZnVuY3Rpb25cIlxuICApIHtcbiAgICByZXR1cm4gW0Vycm9yKGBJbnZhbGlkIE9wdGlvbjogXCJvbl9yZWNvcmRcIiBtdXN0IGJlIGEgZnVuY3Rpb24uYCldO1xuICB9XG4gIC8vIE5vcm1hbGl6ZSBvcHRpb24gYHJlY29yZF9kZWxpbWl0ZXJgXG4gIGlmIChcbiAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPT09IHVuZGVmaW5lZCB8fFxuICAgIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciA9PT0gbnVsbFxuICApIHtcbiAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcblwiO1xuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIpKSB7XG4gICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMucmVjb3JkX2RlbGltaXRlciAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBbXG4gICAgICBFcnJvcihcbiAgICAgICAgYEludmFsaWQgT3B0aW9uOiByZWNvcmRfZGVsaW1pdGVyIG11c3QgYmUgYSBidWZmZXIgb3IgYSBzdHJpbmcsIGdvdCAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMucmVjb3JkX2RlbGltaXRlcil9YCxcbiAgICAgICksXG4gICAgXTtcbiAgfVxuICBzd2l0Y2ggKG9wdGlvbnMucmVjb3JkX2RlbGltaXRlcikge1xuICAgIGNhc2UgXCJ1bml4XCI6XG4gICAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcblwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm1hY1wiOlxuICAgICAgb3B0aW9ucy5yZWNvcmRfZGVsaW1pdGVyID0gXCJcXHJcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ3aW5kb3dzXCI6XG4gICAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcclxcblwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImFzY2lpXCI6XG4gICAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcdTAwMWVcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ1bmljb2RlXCI6XG4gICAgICBvcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgPSBcIlxcdTIwMjhcIjtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiBbdW5kZWZpbmVkLCBvcHRpb25zXTtcbn07XG5cbmNvbnN0IGJvbV91dGY4ID0gQnVmZmVyLmZyb20oWzIzOSwgMTg3LCAxOTFdKTtcblxuY29uc3Qgc3RyaW5naWZpZXIgPSBmdW5jdGlvbiAob3B0aW9ucywgc3RhdGUsIGluZm8pIHtcbiAgcmV0dXJuIHtcbiAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgIHN0YXRlOiBzdGF0ZSxcbiAgICBpbmZvOiBpbmZvLFxuICAgIF9fdHJhbnNmb3JtOiBmdW5jdGlvbiAoY2h1bmssIHB1c2gpIHtcbiAgICAgIC8vIENodW5rIHZhbGlkYXRpb25cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShjaHVuaykgJiYgdHlwZW9mIGNodW5rICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCBSZWNvcmQ6IGV4cGVjdCBhbiBhcnJheSBvciBhbiBvYmplY3QsIGdvdCAke0pTT04uc3RyaW5naWZ5KGNodW5rKX1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IGNvbHVtbnMgZnJvbSB0aGUgZmlyc3QgcmVjb3JkXG4gICAgICBpZiAodGhpcy5pbmZvLnJlY29yZHMgPT09IDApIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2h1bmspKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlciA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNvbHVtbnMgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIEVycm9yKFxuICAgICAgICAgICAgICBcIlVuZGlzY292ZXJhYmxlIENvbHVtbnM6IGhlYWRlciBvcHRpb24gcmVxdWlyZXMgY29sdW1uIG9wdGlvbiBvciBvYmplY3QgcmVjb3Jkc1wiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmNvbHVtbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IFtlcnIsIGNvbHVtbnNdID0gbm9ybWFsaXplX2NvbHVtbnMoT2JqZWN0LmtleXMoY2h1bmspKTtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm47XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNvbHVtbnMgPSBjb2x1bW5zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbWl0IHRoZSBoZWFkZXJcbiAgICAgIGlmICh0aGlzLmluZm8ucmVjb3JkcyA9PT0gMCkge1xuICAgICAgICB0aGlzLmJvbShwdXNoKTtcbiAgICAgICAgY29uc3QgZXJyID0gdGhpcy5oZWFkZXJzKHB1c2gpO1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gZXJyO1xuICAgICAgfVxuICAgICAgLy8gRW1pdCBhbmQgc3RyaW5naWZ5IHRoZSByZWNvcmQgaWYgYW4gb2JqZWN0IG9yIGFuIGFycmF5XG4gICAgICB0cnkge1xuICAgICAgICAvLyB0aGlzLmVtaXQoJ3JlY29yZCcsIGNodW5rLCB0aGlzLmluZm8ucmVjb3Jkcyk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25fcmVjb3JkKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uX3JlY29yZChjaHVuaywgdGhpcy5pbmZvLnJlY29yZHMpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgdGhlIHJlY29yZCBpbnRvIGEgc3RyaW5nXG4gICAgICBsZXQgZXJyLCBjaHVua19zdHJpbmc7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVvZikge1xuICAgICAgICBbZXJyLCBjaHVua19zdHJpbmddID0gdGhpcy5zdHJpbmdpZnkoY2h1bmspO1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gZXJyO1xuICAgICAgICBpZiAoY2h1bmtfc3RyaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2h1bmtfc3RyaW5nID0gY2h1bmtfc3RyaW5nICsgdGhpcy5vcHRpb25zLnJlY29yZF9kZWxpbWl0ZXI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFtlcnIsIGNodW5rX3N0cmluZ10gPSB0aGlzLnN0cmluZ2lmeShjaHVuayk7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBlcnI7XG4gICAgICAgIGlmIChjaHVua19zdHJpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhlYWRlciB8fCB0aGlzLmluZm8ucmVjb3Jkcykge1xuICAgICAgICAgICAgY2h1bmtfc3RyaW5nID0gdGhpcy5vcHRpb25zLnJlY29yZF9kZWxpbWl0ZXIgKyBjaHVua19zdHJpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbWl0IHRoZSBjc3ZcbiAgICAgIHRoaXMuaW5mby5yZWNvcmRzKys7XG4gICAgICBwdXNoKGNodW5rX3N0cmluZyk7XG4gICAgfSxcbiAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uIChjaHVuaywgY2h1bmtJc0hlYWRlciA9IGZhbHNlKSB7XG4gICAgICBpZiAodHlwZW9mIGNodW5rICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCBjaHVua107XG4gICAgICB9XG4gICAgICBjb25zdCB7IGNvbHVtbnMgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgIGNvbnN0IHJlY29yZCA9IFtdO1xuICAgICAgLy8gUmVjb3JkIGlzIGFuIGFycmF5XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjaHVuaykpIHtcbiAgICAgICAgLy8gV2UgYXJlIGdldHRpbmcgYW4gYXJyYXkgYnV0IHRoZSB1c2VyIGhhcyBzcGVjaWZpZWQgb3V0cHV0IGNvbHVtbnMuIEluXG4gICAgICAgIC8vIHRoaXMgY2FzZSwgd2UgcmVzcGVjdCB0aGUgY29sdW1ucyBpbmRleGVzXG4gICAgICAgIGlmIChjb2x1bW5zKSB7XG4gICAgICAgICAgY2h1bmsuc3BsaWNlKGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYXN0IHJlY29yZCBlbGVtZW50c1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNodW5rLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZmllbGQgPSBjaHVua1tpXTtcbiAgICAgICAgICBjb25zdCBbZXJyLCB2YWx1ZV0gPSB0aGlzLl9fY2FzdChmaWVsZCwge1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICBjb2x1bW46IGksXG4gICAgICAgICAgICByZWNvcmRzOiB0aGlzLmluZm8ucmVjb3JkcyxcbiAgICAgICAgICAgIGhlYWRlcjogY2h1bmtJc0hlYWRlcixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gW2Vycl07XG4gICAgICAgICAgcmVjb3JkW2ldID0gW3ZhbHVlLCBmaWVsZF07XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVjb3JkIGlzIGEgbGl0ZXJhbCBvYmplY3RcbiAgICAgICAgLy8gYGNvbHVtbnNgIGlzIGFsd2F5cyBkZWZpbmVkOiBpdCBpcyBlaXRoZXIgcHJvdmlkZWQgb3IgZGlzY292ZXJlZC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGZpZWxkID0gZ2V0KGNodW5rLCBjb2x1bW5zW2ldLmtleSk7XG4gICAgICAgICAgY29uc3QgW2VyciwgdmFsdWVdID0gdGhpcy5fX2Nhc3QoZmllbGQsIHtcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgY29sdW1uOiBjb2x1bW5zW2ldLmtleSxcbiAgICAgICAgICAgIHJlY29yZHM6IHRoaXMuaW5mby5yZWNvcmRzLFxuICAgICAgICAgICAgaGVhZGVyOiBjaHVua0lzSGVhZGVyLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChlcnIpIHJldHVybiBbZXJyXTtcbiAgICAgICAgICByZWNvcmRbaV0gPSBbdmFsdWUsIGZpZWxkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IGNzdnJlY29yZCA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlY29yZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgb3B0aW9ucywgZXJyO1xuXG4gICAgICAgIGxldCBbdmFsdWUsIGZpZWxkXSA9IHJlY29yZFtpXTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNfb2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgIG9wdGlvbnMgPSB2YWx1ZTtcbiAgICAgICAgICB2YWx1ZSA9IG9wdGlvbnMudmFsdWU7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbnMudmFsdWU7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gbnVsbFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBJbnZhbGlkIENhc3RpbmcgVmFsdWU6IHJldHVybmVkIHZhbHVlIG11c3QgcmV0dXJuIGEgc3RyaW5nLCBudWxsIG9yIHVuZGVmaW5lZCwgZ290ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWAsXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3B0aW9ucyA9IHsgLi4udGhpcy5vcHRpb25zLCAuLi5vcHRpb25zIH07XG4gICAgICAgICAgW2Vyciwgb3B0aW9uc10gPSBub3JtYWxpemVfb3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBbZXJyXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIEVycm9yKFxuICAgICAgICAgICAgICBgSW52YWxpZCBDYXN0aW5nIFZhbHVlOiByZXR1cm5lZCB2YWx1ZSBtdXN0IHJldHVybiBhIHN0cmluZywgYW4gb2JqZWN0LCBudWxsIG9yIHVuZGVmaW5lZCwgZ290ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWAsXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGRlbGltaXRlcixcbiAgICAgICAgICBlc2NhcGUsXG4gICAgICAgICAgcXVvdGUsXG4gICAgICAgICAgcXVvdGVkLFxuICAgICAgICAgIHF1b3RlZF9lbXB0eSxcbiAgICAgICAgICBxdW90ZWRfc3RyaW5nLFxuICAgICAgICAgIHF1b3RlZF9tYXRjaCxcbiAgICAgICAgICByZWNvcmRfZGVsaW1pdGVyLFxuICAgICAgICAgIGVzY2FwZV9mb3JtdWxhcyxcbiAgICAgICAgfSA9IG9wdGlvbnM7XG4gICAgICAgIGlmIChcIlwiID09PSB2YWx1ZSAmJiBcIlwiID09PSBmaWVsZCkge1xuICAgICAgICAgIGxldCBxdW90ZWRNYXRjaCA9XG4gICAgICAgICAgICBxdW90ZWRfbWF0Y2ggJiZcbiAgICAgICAgICAgIHF1b3RlZF9tYXRjaC5maWx0ZXIoKHF1b3RlZF9tYXRjaCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHF1b3RlZF9tYXRjaCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5pbmRleE9mKHF1b3RlZF9tYXRjaCkgIT09IC0xO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBxdW90ZWRfbWF0Y2gudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIHF1b3RlZE1hdGNoID0gcXVvdGVkTWF0Y2ggJiYgcXVvdGVkTWF0Y2gubGVuZ3RoID4gMDtcbiAgICAgICAgICBjb25zdCBzaG91bGRRdW90ZSA9XG4gICAgICAgICAgICBxdW90ZWRNYXRjaCB8fFxuICAgICAgICAgICAgdHJ1ZSA9PT0gcXVvdGVkX2VtcHR5IHx8XG4gICAgICAgICAgICAodHJ1ZSA9PT0gcXVvdGVkX3N0cmluZyAmJiBmYWxzZSAhPT0gcXVvdGVkX2VtcHR5KTtcbiAgICAgICAgICBpZiAoc2hvdWxkUXVvdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcXVvdGUgKyB2YWx1ZSArIHF1b3RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjc3ZyZWNvcmQgKz0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICBFcnJvcihcbiAgICAgICAgICAgICAgICBgRm9ybWF0dGVyIG11c3QgcmV0dXJuIGEgc3RyaW5nLCBudWxsIG9yIHVuZGVmaW5lZCwgZ290ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWAsXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBjb250YWluc2RlbGltaXRlciA9XG4gICAgICAgICAgICBkZWxpbWl0ZXIubGVuZ3RoICYmIHZhbHVlLmluZGV4T2YoZGVsaW1pdGVyKSA+PSAwO1xuICAgICAgICAgIGNvbnN0IGNvbnRhaW5zUXVvdGUgPSBxdW90ZSAhPT0gXCJcIiAmJiB2YWx1ZS5pbmRleE9mKHF1b3RlKSA+PSAwO1xuICAgICAgICAgIGNvbnN0IGNvbnRhaW5zRXNjYXBlID0gdmFsdWUuaW5kZXhPZihlc2NhcGUpID49IDAgJiYgZXNjYXBlICE9PSBxdW90ZTtcbiAgICAgICAgICBjb25zdCBjb250YWluc1JlY29yZERlbGltaXRlciA9IHZhbHVlLmluZGV4T2YocmVjb3JkX2RlbGltaXRlcikgPj0gMDtcbiAgICAgICAgICBjb25zdCBxdW90ZWRTdHJpbmcgPSBxdW90ZWRfc3RyaW5nICYmIHR5cGVvZiBmaWVsZCA9PT0gXCJzdHJpbmdcIjtcbiAgICAgICAgICBsZXQgcXVvdGVkTWF0Y2ggPVxuICAgICAgICAgICAgcXVvdGVkX21hdGNoICYmXG4gICAgICAgICAgICBxdW90ZWRfbWF0Y2guZmlsdGVyKChxdW90ZWRfbWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxdW90ZWRfbWF0Y2ggPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuaW5kZXhPZihxdW90ZWRfbWF0Y2gpICE9PSAtMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVvdGVkX21hdGNoLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBxdW90ZWRNYXRjaCA9IHF1b3RlZE1hdGNoICYmIHF1b3RlZE1hdGNoLmxlbmd0aCA+IDA7XG4gICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hZGFsdGFzL25vZGUtY3N2L3B1bGwvMzg3XG4gICAgICAgICAgLy8gTW9yZSBhYm91dCBDU1YgaW5qZWN0aW9uIG9yIGZvcm11bGEgaW5qZWN0aW9uLCB3aGVuIHdlYnNpdGVzIGVtYmVkXG4gICAgICAgICAgLy8gdW50cnVzdGVkIGlucHV0IGluc2lkZSBDU1YgZmlsZXM6XG4gICAgICAgICAgLy8gaHR0cHM6Ly9vd2FzcC5vcmcvd3d3LWNvbW11bml0eS9hdHRhY2tzL0NTVl9JbmplY3Rpb25cbiAgICAgICAgICAvLyBodHRwOi8vZ2VvcmdlbWF1ZXIubmV0LzIwMTcvMTAvMDcvY3N2LWluamVjdGlvbi5odG1sXG4gICAgICAgICAgLy8gQXBwbGUgTnVtYmVycyB1bmljb2RlIG5vcm1hbGl6YXRpb24gaXMgZW1waXJpY2FsIGZyb20gdGVzdGluZ1xuICAgICAgICAgIGlmIChlc2NhcGVfZm9ybXVsYXMpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodmFsdWVbMF0pIHtcbiAgICAgICAgICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgICAgICAgY2FzZSBcIkBcIjpcbiAgICAgICAgICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICAgICAgICBjYXNlIFwiXFxyXCI6XG4gICAgICAgICAgICAgIGNhc2UgXCJcXHVGRjFEXCI6IC8vIFVuaWNvZGUgJz0nXG4gICAgICAgICAgICAgIGNhc2UgXCJcXHVGRjBCXCI6IC8vIFVuaWNvZGUgJysnXG4gICAgICAgICAgICAgIGNhc2UgXCJcXHVGRjBEXCI6IC8vIFVuaWNvZGUgJy0nXG4gICAgICAgICAgICAgIGNhc2UgXCJcXHVGRjIwXCI6IC8vIFVuaWNvZGUgJ0AnXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBgJyR7dmFsdWV9YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgc2hvdWxkUXVvdGUgPVxuICAgICAgICAgICAgY29udGFpbnNRdW90ZSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgY29udGFpbnNkZWxpbWl0ZXIgfHxcbiAgICAgICAgICAgIGNvbnRhaW5zUmVjb3JkRGVsaW1pdGVyIHx8XG4gICAgICAgICAgICBxdW90ZWQgfHxcbiAgICAgICAgICAgIHF1b3RlZFN0cmluZyB8fFxuICAgICAgICAgICAgcXVvdGVkTWF0Y2g7XG4gICAgICAgICAgaWYgKHNob3VsZFF1b3RlID09PSB0cnVlICYmIGNvbnRhaW5zRXNjYXBlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCByZWdleHAgPVxuICAgICAgICAgICAgICBlc2NhcGUgPT09IFwiXFxcXFwiXG4gICAgICAgICAgICAgICAgPyBuZXcgUmVnRXhwKGVzY2FwZSArIGVzY2FwZSwgXCJnXCIpXG4gICAgICAgICAgICAgICAgOiBuZXcgUmVnRXhwKGVzY2FwZSwgXCJnXCIpO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlZ2V4cCwgZXNjYXBlICsgZXNjYXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvbnRhaW5zUXVvdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAocXVvdGUsIFwiZ1wiKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZWdleHAsIGVzY2FwZSArIHF1b3RlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNob3VsZFF1b3RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHF1b3RlICsgdmFsdWUgKyBxdW90ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3N2cmVjb3JkICs9IHZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHF1b3RlZF9lbXB0eSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgIChmaWVsZCA9PT0gXCJcIiAmJiBxdW90ZWRfc3RyaW5nID09PSB0cnVlICYmIHF1b3RlZF9lbXB0eSAhPT0gZmFsc2UpXG4gICAgICAgICkge1xuICAgICAgICAgIGNzdnJlY29yZCArPSBxdW90ZSArIHF1b3RlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpICE9PSByZWNvcmQubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGNzdnJlY29yZCArPSBkZWxpbWl0ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBbdW5kZWZpbmVkLCBjc3ZyZWNvcmRdO1xuICAgIH0sXG4gICAgYm9tOiBmdW5jdGlvbiAocHVzaCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib20gIT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcHVzaChib21fdXRmOCk7XG4gICAgfSxcbiAgICBoZWFkZXJzOiBmdW5jdGlvbiAocHVzaCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29sdW1ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBlcnI7XG4gICAgICBsZXQgaGVhZGVycyA9IHRoaXMub3B0aW9ucy5jb2x1bW5zLm1hcCgoY29sdW1uKSA9PiBjb2x1bW4uaGVhZGVyKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW9mKSB7XG4gICAgICAgIFtlcnIsIGhlYWRlcnNdID0gdGhpcy5zdHJpbmdpZnkoaGVhZGVycywgdHJ1ZSk7XG4gICAgICAgIGhlYWRlcnMgKz0gdGhpcy5vcHRpb25zLnJlY29yZF9kZWxpbWl0ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBbZXJyLCBoZWFkZXJzXSA9IHRoaXMuc3RyaW5naWZ5KGhlYWRlcnMpO1xuICAgICAgfVxuICAgICAgaWYgKGVycikgcmV0dXJuIGVycjtcbiAgICAgIHB1c2goaGVhZGVycyk7XG4gICAgfSxcbiAgICBfX2Nhc3Q6IGZ1bmN0aW9uICh2YWx1ZSwgY29udGV4dCkge1xuICAgICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgLy8gRmluZSBmb3IgOTklIG9mIHRoZSBjYXNlc1xuICAgICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuY2FzdC5zdHJpbmcodmFsdWUsIGNvbnRleHQpXTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcImJpZ2ludFwiKSB7XG4gICAgICAgICAgcmV0dXJuIFt1bmRlZmluZWQsIHRoaXMub3B0aW9ucy5jYXN0LmJpZ2ludCh2YWx1ZSwgY29udGV4dCldO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdGhpcy5vcHRpb25zLmNhc3QubnVtYmVyKHZhbHVlLCBjb250ZXh0KV07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdGhpcy5vcHRpb25zLmNhc3QuYm9vbGVhbih2YWx1ZSwgY29udGV4dCldO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuY2FzdC5kYXRlKHZhbHVlLCBjb250ZXh0KV07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuY2FzdC5vYmplY3QodmFsdWUsIGNvbnRleHQpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgdmFsdWUsIHZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBbZXJyXTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufTtcblxuY29uc3Qgc3RyaW5naWZ5ID0gZnVuY3Rpb24gKHJlY29yZHMsIG9wdHMgPSB7fSkge1xuICBjb25zdCBkYXRhID0gW107XG4gIGNvbnN0IFtlcnIsIG9wdGlvbnNdID0gbm9ybWFsaXplX29wdGlvbnMob3B0cyk7XG4gIGlmIChlcnIgIT09IHVuZGVmaW5lZCkgdGhyb3cgZXJyO1xuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBzdG9wOiBmYWxzZSxcbiAgfTtcbiAgLy8gSW5mb3JtYXRpb25cbiAgY29uc3QgaW5mbyA9IHtcbiAgICByZWNvcmRzOiAwLFxuICB9O1xuICBjb25zdCBhcGkgPSBzdHJpbmdpZmllcihvcHRpb25zLCBzdGF0ZSwgaW5mbyk7XG4gIGZvciAoY29uc3QgcmVjb3JkIG9mIHJlY29yZHMpIHtcbiAgICBjb25zdCBlcnIgPSBhcGkuX190cmFuc2Zvcm0ocmVjb3JkLCBmdW5jdGlvbiAocmVjb3JkKSB7XG4gICAgICBkYXRhLnB1c2gocmVjb3JkKTtcbiAgICB9KTtcbiAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHRocm93IGVycjtcbiAgfVxuICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICBhcGkuYm9tKChkKSA9PiB7XG4gICAgICBkYXRhLnB1c2goZCk7XG4gICAgfSk7XG4gICAgY29uc3QgZXJyID0gYXBpLmhlYWRlcnMoKGhlYWRlcnMpID0+IHtcbiAgICAgIGRhdGEucHVzaChoZWFkZXJzKTtcbiAgICB9KTtcbiAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHRocm93IGVycjtcbiAgfVxuICByZXR1cm4gZGF0YS5qb2luKFwiXCIpO1xufTtcblxuZXhwb3J0cy5zdHJpbmdpZnkgPSBzdHJpbmdpZnk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9zY3JpcHRzL3JlbmRlcmVyLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9