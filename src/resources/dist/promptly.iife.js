var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  "use strict";
  const hash$1 = (input) => {
    let str = input.toString(), len = str.length, hash2 = 0, chr;
    if (len === 0) {
      return hash2;
    }
    for (let i = 0; i < len; i++) {
      chr = str.charCodeAt(i);
      hash2 = (hash2 << 5) - hash2 + chr;
      hash2 |= 0;
    }
    return Math.abs(hash2).toString();
  };
  const records = {};
  const throttle = (func, wait2, ...args) => {
    let key = hash$1(func), queue = (...pass) => {
      const now2 = Date.now();
      if (records[key]) {
        if (records[key] + wait2 < now2) {
          records[key] = now2;
          func(...pass);
        }
      } else {
        records[key] = now2;
        func(...pass);
      }
    };
    if (args.length === 1 && args[0] === "prepare") {
      return queue;
    }
    queue(...args);
  };
  function noop() {
  }
  const identity = (x) => x;
  function assign(tar, src) {
    for (const k in src)
      tar[k] = src[k];
    return tar;
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function subscribe(store2, ...callbacks) {
    if (store2 == null) {
      for (const callback of callbacks) {
        callback(void 0);
      }
      return noop;
    }
    const unsub = store2.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function get_store_value(store2) {
    let value;
    subscribe(store2, (_) => value = _)();
    return value;
  }
  function component_subscribe(component, store2, callback) {
    component.$$.on_destroy.push(subscribe(store2, callback));
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === void 0) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function set_store_value(store2, ret, value) {
    store2.set(value);
    return ret;
  }
  function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
  }
  const is_client = typeof window !== "undefined";
  let now = is_client ? () => window.performance.now() : () => Date.now();
  let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
  const tasks = /* @__PURE__ */ new Set();
  function run_tasks(now2) {
    tasks.forEach((task) => {
      if (!task.c(now2)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0)
      raf(run_tasks);
  }
  function loop(callback) {
    let task;
    if (tasks.size === 0)
      raf(run_tasks);
    return {
      promise: new Promise((fulfill) => {
        tasks.add(task = { c: callback, f: fulfill });
      }),
      abort() {
        tasks.delete(task);
      }
    };
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
      const style = element("style");
      style.id = style_sheet_id;
      style.textContent = styles;
      append_stylesheet(append_styles_to, style);
    }
  }
  function get_root_for_style(node) {
    if (!node)
      return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
      return root;
    }
    return node.ownerDocument;
  }
  function append_empty_stylesheet(node) {
    const style_element = element("style");
    style_element.textContent = "/* empty */";
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
  }
  function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function stop_propagation(fn) {
    return function(event) {
      event.stopPropagation();
      return fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.data === data)
      return;
    text2.data = data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function set_style(node, key, value, important) {
    if (value == null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function select_option(select, value, mounting) {
    for (let i = 0; i < select.options.length; i += 1) {
      const option = select.options[i];
      if (option.__value === value) {
        option.selected = true;
        return;
      }
    }
    if (!mounting || value !== void 0) {
      select.selectedIndex = -1;
    }
  }
  function select_value(select) {
    const selected_option = select.querySelector(":checked");
    return selected_option && selected_option.__value;
  }
  let crossorigin;
  function is_crossorigin() {
    if (crossorigin === void 0) {
      crossorigin = false;
      try {
        if (typeof window !== "undefined" && window.parent) {
          void window.parent.document;
        }
      } catch (error) {
        crossorigin = true;
      }
    }
    return crossorigin;
  }
  function add_iframe_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    if (computed_style.position === "static") {
      node.style.position = "relative";
    }
    const iframe = element("iframe");
    iframe.setAttribute(
      "style",
      "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"
    );
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    const crossorigin2 = is_crossorigin();
    let unsubscribe;
    if (crossorigin2) {
      iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>";
      unsubscribe = listen(
        window,
        "message",
        (event) => {
          if (event.source === iframe.contentWindow)
            fn();
        }
      );
    } else {
      iframe.src = "about:blank";
      iframe.onload = () => {
        unsubscribe = listen(iframe.contentWindow, "resize", fn);
        fn();
      };
    }
    append(node, iframe);
    return () => {
      if (crossorigin2) {
        unsubscribe();
      } else if (unsubscribe && iframe.contentWindow) {
        unsubscribe();
      }
      detach(iframe);
    };
  }
  function toggle_class(element2, name, toggle) {
    element2.classList.toggle(name, !!toggle);
  }
  function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    return new CustomEvent(type, { detail, bubbles, cancelable });
  }
  function construct_svelte_component(component, props) {
    return new component(props);
  }
  const managed_styles = /* @__PURE__ */ new Map();
  let active$1 = 0;
  function hash(str) {
    let hash2 = 5381;
    let i = str.length;
    while (i--)
      hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
    return hash2 >>> 0;
  }
  function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = "{\n";
    for (let p = 0; p <= 1; p += step) {
      const t2 = a + (b - a) * ease(p);
      keyframes += p * 100 + `%{${fn(t2, 1 - t2)}}
`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
      rules[name] = true;
      stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || "";
    node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
    active$1 += 1;
    return name;
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || "").split(", ");
    const next = previous.filter(
      name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
    );
    const deleted = previous.length - next.length;
    if (deleted) {
      node.style.animation = next.join(", ");
      active$1 -= deleted;
      if (!active$1)
        clear_rules();
    }
  }
  function clear_rules() {
    raf(() => {
      if (active$1)
        return;
      managed_styles.forEach((info) => {
        const { ownerNode } = info.stylesheet;
        if (ownerNode)
          detach(ownerNode);
      });
      managed_styles.clear();
    });
  }
  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
    return context;
  }
  function getContext(key) {
    return get_current_component().$$.context.get(key);
  }
  function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
      callbacks.slice().forEach((fn) => fn.call(this, event));
    }
  }
  const dirty_components = [];
  const binding_callbacks = [];
  let render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = /* @__PURE__ */ Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  function add_flush_callback(fn) {
    flush_callbacks.push(fn);
  }
  const seen_callbacks = /* @__PURE__ */ new Set();
  let flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e2) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e2;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  let promise;
  function wait() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(() => {
        promise = null;
      });
    }
    return promise;
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
  }
  const outroing = /* @__PURE__ */ new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  const null_transition = { duration: 0 };
  function create_in_transition(node, fn, params) {
    const options = { direction: "in" };
    let config = fn(node, params, options);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
      if (animation_name)
        delete_rule(node, animation_name);
    }
    function go() {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick = noop,
        css
      } = config || null_transition;
      if (css)
        animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
      tick(0, 1);
      const start_time = now() + delay;
      const end_time = start_time + duration;
      if (task)
        task.abort();
      running = true;
      add_render_callback(() => dispatch(node, true, "start"));
      task = loop((now2) => {
        if (running) {
          if (now2 >= end_time) {
            tick(1, 0);
            dispatch(node, true, "end");
            cleanup();
            return running = false;
          }
          if (now2 >= start_time) {
            const t2 = easing((now2 - start_time) / duration);
            tick(t2, 1 - t2);
          }
        }
        return running;
      });
    }
    let started = false;
    return {
      start() {
        if (started)
          return;
        started = true;
        delete_rule(node);
        if (is_function(config)) {
          config = config(options);
          wait().then(go);
        } else {
          go();
        }
      },
      invalidate() {
        started = false;
      },
      end() {
        if (running) {
          cleanup();
          running = false;
        }
      }
    };
  }
  function create_out_transition(node, fn, params) {
    const options = { direction: "out" };
    let config = fn(node, params, options);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    let original_inert_value;
    function go() {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick = noop,
        css
      } = config || null_transition;
      if (css)
        animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
      const start_time = now() + delay;
      const end_time = start_time + duration;
      add_render_callback(() => dispatch(node, false, "start"));
      if ("inert" in node) {
        original_inert_value = node.inert;
        node.inert = true;
      }
      loop((now2) => {
        if (running) {
          if (now2 >= end_time) {
            tick(0, 1);
            dispatch(node, false, "end");
            if (!--group.r) {
              run_all(group.c);
            }
            return false;
          }
          if (now2 >= start_time) {
            const t2 = easing((now2 - start_time) / duration);
            tick(1 - t2, t2);
          }
        }
        return running;
      });
    }
    if (is_function(config)) {
      wait().then(() => {
        config = config(options);
        go();
      });
    } else {
      go();
    }
    return {
      end(reset) {
        if (reset && "inert" in node) {
          node.inert = original_inert_value;
        }
        if (reset && config.tick) {
          config.tick(1, 0);
        }
        if (running) {
          if (animation_name)
            delete_rule(node, animation_name);
          running = false;
        }
      }
    };
  }
  function create_bidirectional_transition(node, fn, params, intro) {
    const options = { direction: "both" };
    let config = fn(node, params, options);
    let t2 = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    let original_inert_value;
    function clear_animation() {
      if (animation_name)
        delete_rule(node, animation_name);
    }
    function init2(program, duration) {
      const d = program.b - t2;
      duration *= Math.abs(d);
      return {
        a: t2,
        b: program.b,
        d,
        duration,
        start: program.start,
        end: program.start + duration,
        group: program.group
      };
    }
    function go(b) {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick = noop,
        css
      } = config || null_transition;
      const program = {
        start: now() + delay,
        b
      };
      if (!b) {
        program.group = outros;
        outros.r += 1;
      }
      if ("inert" in node) {
        if (b) {
          if (original_inert_value !== void 0) {
            node.inert = original_inert_value;
          }
        } else {
          original_inert_value = node.inert;
          node.inert = true;
        }
      }
      if (running_program || pending_program) {
        pending_program = program;
      } else {
        if (css) {
          clear_animation();
          animation_name = create_rule(node, t2, b, duration, delay, easing, css);
        }
        if (b)
          tick(0, 1);
        running_program = init2(program, duration);
        add_render_callback(() => dispatch(node, b, "start"));
        loop((now2) => {
          if (pending_program && now2 > pending_program.start) {
            running_program = init2(pending_program, duration);
            pending_program = null;
            dispatch(node, running_program.b, "start");
            if (css) {
              clear_animation();
              animation_name = create_rule(
                node,
                t2,
                running_program.b,
                running_program.duration,
                0,
                easing,
                config.css
              );
            }
          }
          if (running_program) {
            if (now2 >= running_program.end) {
              tick(t2 = running_program.b, 1 - t2);
              dispatch(node, running_program.b, "end");
              if (!pending_program) {
                if (running_program.b) {
                  clear_animation();
                } else {
                  if (!--running_program.group.r)
                    run_all(running_program.group.c);
                }
              }
              running_program = null;
            } else if (now2 >= running_program.start) {
              const p = now2 - running_program.start;
              t2 = running_program.a + running_program.d * easing(p / running_program.duration);
              tick(t2, 1 - t2);
            }
          }
          return !!(running_program || pending_program);
        });
      }
    }
    return {
      run(b) {
        if (is_function(config)) {
          wait().then(() => {
            const opts = { direction: b ? "in" : "out" };
            config = config(opts);
            go(b);
          });
        } else {
          go(b);
        }
      },
      end() {
        clear_animation();
        running_program = pending_program = null;
      }
    };
  }
  function ensure_array_like(array_like_or_iterator) {
    return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
  }
  function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
      lookup.delete(block.key);
    });
  }
  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
    let o = old_blocks.length;
    let n2 = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
      old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = /* @__PURE__ */ new Map();
    const deltas = /* @__PURE__ */ new Map();
    const updates = [];
    i = n2;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block2(key, child_ctx);
        block.c();
      } else if (dynamic) {
        updates.push(() => block.p(child_ctx, dirty));
      }
      new_lookup.set(key, new_blocks[i] = block);
      if (key in old_indexes)
        deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = /* @__PURE__ */ new Set();
    const did_move = /* @__PURE__ */ new Set();
    function insert2(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n2--;
    }
    while (o && n2) {
      const new_block = new_blocks[n2 - 1];
      const old_block = old_blocks[o - 1];
      const new_key = new_block.key;
      const old_key = old_block.key;
      if (new_block === old_block) {
        next = new_block.first;
        o--;
        n2--;
      } else if (!new_lookup.has(old_key)) {
        destroy(old_block, lookup);
        o--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert2(new_block);
      } else if (did_move.has(old_key)) {
        o--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert2(new_block);
      } else {
        will_move.add(old_key);
        o--;
      }
    }
    while (o--) {
      const old_block = old_blocks[o];
      if (!new_lookup.has(old_block.key))
        destroy(old_block, lookup);
    }
    while (n2)
      insert2(new_blocks[n2 - 1]);
    run_all(updates);
    return new_blocks;
  }
  function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== void 0) {
      component.$$.bound[index] = callback;
      callback(component.$$.ctx[index]);
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles2, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles2 && append_styles2($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      flush();
    }
    set_current_component(parent_component);
  }
  class SvelteComponent {
    constructor() {
      __publicField(this, "$$");
      __publicField(this, "$$set");
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set(props) {
      if (this.$$set && !is_empty(props)) {
        this.$$.skip_bound = true;
        this.$$set(props);
        this.$$.skip_bound = false;
      }
    }
  }
  const PUBLIC_VERSION = "4";
  const subscriber_queue = [];
  function readable(value, start) {
    return {
      subscribe: writable(value, start).subscribe
    };
  }
  function writable(value, start = noop) {
    let stop;
    const subscribers = /* @__PURE__ */ new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update2(fn) {
      set(fn(value));
    }
    function subscribe2(run2, invalidate = noop) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set, update2) || noop;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update: update2, subscribe: subscribe2 };
  }
  const errors = writable([]);
  const isBusy = writable(false);
  const isActive = writable(false);
  const hasAccess = writable(false);
  const hasContent = writable(false);
  const insertion = writable(null);
  const active = writable(null);
  const category = writable(null);
  const isDev = readable(false);
  const screen = writable({
    is2xs: matchMedia("(min-width: 380px)").matches,
    isXs: matchMedia("(min-width: 460px)").matches,
    isSm: matchMedia("(min-width: 640px)").matches,
    isMd: matchMedia("(min-width: 768px)").matches,
    isLg: matchMedia("(min-width: 1024px)").matches,
    isXl: matchMedia("(min-width: 1280px)").matches,
    is2xl: matchMedia("(min-width: 1536px)").matches
  });
  addEventListener("resize", throttle(() => {
    screen.set({
      is2xs: matchMedia("(min-width: 380px)").matches,
      isXs: matchMedia("(min-width: 460px)").matches,
      isSm: matchMedia("(min-width: 640px)").matches,
      isMd: matchMedia("(min-width: 768px)").matches,
      isLg: matchMedia("(min-width: 1024px)").matches,
      isXl: matchMedia("(min-width: 1280px)").matches,
      is2xl: matchMedia("(min-width: 1536px)").matches
    });
  }, 1e3 / 30, "prepare"));
  const store = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    errors,
    isBusy,
    isActive,
    hasAccess,
    hasContent,
    insertion,
    active,
    category,
    isDev,
    screen
  }, Symbol.toStringTag, { value: "Module" }));
  function redactorPlugin() {
    if (typeof Redactor === "undefined") {
      return setTimeout(redactorPlugin, 5);
    }
    Redactor.add("plugin", "promptly", {
      init(app) {
        this.app = app;
      },
      start() {
        this.app.toolbar.addButton("promptly-button", {
          title: "Promptly",
          icon: '<svg style="height: 1em; width: 1rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M240 56c0-30.9-25.1-56-56-56-28.9 0-52.7 21.9-55.7 49.9C100.6 56.9 80 82.1 80 112c0 6 .8 11.9 2.4 17.4C53.6 135.7 32 161.3 32 192c0 15 5.1 28.8 13.8 39.7C18.7 244.5 0 272.1 0 304c0 34.2 21.4 63.4 51.6 74.8-2.3 6.6-3.6 13.8-3.6 21.2 0 35.3 28.7 64 64 64 5.6 0 11.1-.7 16.3-2.1 2.9 28.2 26.8 50.1 55.7 50.1 30.9 0 56-25.1 56-56V272h-48c-8.8 0-16 7.2-16 16v34.7c18.6 6.6 32 24.4 32 45.3 0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3V288c0-26.5 21.5-48 48-48h48v-80h-34.7c-6.6 18.6-24.4 32-45.3 32-26.5 0-48-21.5-48-48s21.5-48 48-48c20.9 0 38.7 13.4 45.3 32H240V56zm32 104v192h34.7c6.6-18.6 24.4-32 45.3-32 26.5 0 48 21.5 48 48s-21.5 48-48 48c-20.9 0-38.7-13.4-45.3-32H272v72c0 30.9 25.1 56 56 56 28.9 0 52.7-21.9 55.7-50.1 5.2 1.4 10.7 2.1 16.3 2.1 35.3 0 64-28.7 64-64 0-7.4-1.3-14.6-3.6-21.2 30.2-11.4 51.6-40.6 51.6-74.8 0-31.9-18.7-59.5-45.8-72.3C474.9 220.8 480 207 480 192c0-30.7-21.6-56.3-50.4-62.6 1.6-5.5 2.4-11.4 2.4-17.4 0-29.9-20.6-55.1-48.3-62.1C380.6 21.9 356.9 0 328 0c-30.9 0-56 25.1-56 56v72h48c26.5 0 48 21.5 48 48v2.7c18.6 6.6 32 24.4 32 45.3 0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3V176c0-8.8-7.2-16-16-16h-48zm-128-16a16 16 0 1032 0 16 16 0 10-32 0zm208 64a16 16 0 100 32 16 16 0 100-32zM144 368a16 16 0 1032 0 16 16 0 10-32 0zm192 0a16 16 0 1032 0 16 16 0 10-32 0z"/></svg>',
          api: "plugin.promptly.open"
        });
        new Promptly.Modal({
          store,
          target: document.body,
          props: { redactor: this.app }
        });
      },
      open() {
        Promptly.isActive.set(this.app.uuid);
      }
    });
  }
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
  function add_css$e(target) {
    append_styles(target, "svelte-sf65nn", ".button.svelte-sf65nn{border-radius:0.375rem;--tw-bg-opacity:1;background-color:rgb(243 247 253 / var(--tw-bg-opacity));padding-left:1.5rem;padding-right:1.5rem;padding-top:0.75rem;padding-bottom:0.75rem;text-align:left;font-weight:300;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:100ms\n}.button.is-active.svelte-sf65nn{--tw-bg-opacity:1;background-color:rgb(71 85 105 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}.button.svelte-sf65nn:not(.is-active):hover{--tw-bg-opacity:1;background-color:rgb(14 133 255 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}");
  }
  function create_fragment$o(ctx) {
    let button;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = ctx[3].default;
    const default_slot = create_slot(default_slot_template, ctx, ctx[2], null);
    return {
      c() {
        button = element("button");
        if (default_slot)
          default_slot.c();
        attr(button, "type", "button");
        attr(button, "class", "button child-button svelte-sf65nn");
        toggle_class(button, "is-active", ctx[1] && ctx[1].handle === ctx[0].handle);
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (default_slot) {
          default_slot.m(button, null);
        }
        current = true;
        if (!mounted) {
          dispose = listen(button, "click", ctx[4]);
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & 4)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              ctx2[2],
              !current ? get_all_dirty_from_scope(ctx2[2]) : get_slot_changes(default_slot_template, ctx2[2], dirty, null),
              null
            );
          }
        }
        if (!current || dirty & 3) {
          toggle_class(button, "is-active", ctx2[1] && ctx2[1].handle === ctx2[0].handle);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function instance$m($$self, $$props, $$invalidate) {
    let $active;
    component_subscribe($$self, active, ($$value) => $$invalidate(1, $active = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    let { action } = $$props;
    const click_handler = () => active.set(action);
    $$self.$$set = ($$props2) => {
      if ("action" in $$props2)
        $$invalidate(0, action = $$props2.action);
      if ("$$scope" in $$props2)
        $$invalidate(2, $$scope = $$props2.$$scope);
    };
    return [action, $active, $$scope, slots, click_handler];
  }
  class Button extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$m, create_fragment$o, safe_not_equal, { action: 0 }, add_css$e);
    }
  }
  function add_css$d(target) {
    append_styles(target, "svelte-151jdhi", "input.svelte-151jdhi{margin-bottom:0.5rem\n}");
  }
  function create_default_slot$5(ctx) {
    let current;
    const default_slot_template = ctx[4].default;
    const default_slot = create_slot(default_slot_template, ctx, ctx[6], null);
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & 64)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              ctx2[6],
              !current ? get_all_dirty_from_scope(ctx2[6]) : get_slot_changes(default_slot_template, ctx2[6], dirty, null),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment$n(ctx) {
    let input;
    let t2;
    let generate;
    let current;
    let mounted;
    let dispose;
    generate = new Generate({
      props: {
        active: ctx[1],
        prompt: ctx[0],
        disabled: ctx[2],
        $$slots: { default: [create_default_slot$5] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        input = element("input");
        t2 = space();
        create_component(generate.$$.fragment);
        attr(input, "type", "text");
        attr(input, "class", "text fullwidth svelte-151jdhi");
        attr(input, "placeholder", "Additional Keywords (optional)");
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(input, ctx[3]);
        insert(target, t2, anchor);
        mount_component(generate, target, anchor);
        current = true;
        if (!mounted) {
          dispose = listen(input, "input", ctx[5]);
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & 8 && input.value !== ctx2[3]) {
          set_input_value(input, ctx2[3]);
        }
        const generate_changes = {};
        if (dirty & 2)
          generate_changes.active = ctx2[1];
        if (dirty & 1)
          generate_changes.prompt = ctx2[0];
        if (dirty & 4)
          generate_changes.disabled = ctx2[2];
        if (dirty & 64) {
          generate_changes.$$scope = { dirty, ctx: ctx2 };
        }
        generate.$set(generate_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(generate.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(generate.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(input);
          detach(t2);
        }
        destroy_component(generate, detaching);
        mounted = false;
        dispose();
      }
    };
  }
  const keywords = writable("");
  function instance$l($$self, $$props, $$invalidate) {
    let $keywords, $$unsubscribe_keywords = noop;
    component_subscribe($$self, keywords, ($$value) => $$invalidate(3, $keywords = $$value));
    $$self.$$.on_destroy.push(() => $$unsubscribe_keywords());
    let { $$slots: slots = {}, $$scope } = $$props;
    let { prompt } = $$props;
    let { active: active2 } = $$props;
    let { disabled } = $$props;
    function input_input_handler() {
      $keywords = this.value;
      keywords.set($keywords);
    }
    $$self.$$set = ($$props2) => {
      if ("prompt" in $$props2)
        $$invalidate(0, prompt = $$props2.prompt);
      if ("active" in $$props2)
        $$invalidate(1, active2 = $$props2.active);
      if ("disabled" in $$props2)
        $$invalidate(2, disabled = $$props2.disabled);
      if ("$$scope" in $$props2)
        $$invalidate(6, $$scope = $$props2.$$scope);
    };
    return [prompt, active2, disabled, $keywords, slots, input_input_handler, $$scope];
  }
  class GenerateWithKeywords extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$l, create_fragment$n, safe_not_equal, { prompt: 0, active: 1, disabled: 2 }, add_css$d);
    }
  }
  function create_fragment$m(ctx) {
    let button;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = ctx[4].default;
    const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
    return {
      c() {
        button = element("button");
        if (default_slot)
          default_slot.c();
        button.disabled = ctx[0];
        attr(button, "class", "btn submit");
        toggle_class(button, "disabled", ctx[0]);
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (default_slot) {
          default_slot.m(button, null);
        }
        current = true;
        if (!mounted) {
          dispose = listen(button, "click", ctx[1]);
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & 8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              ctx2[3],
              !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
              null
            );
          }
        }
        if (!current || dirty & 1) {
          button.disabled = ctx2[0];
        }
        if (!current || dirty & 1) {
          toggle_class(button, "disabled", ctx2[0]);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  const answer = writable("");
  let controller = new AbortController();
  function stream(endpoint, args = {}) {
    const hasAccessValue = get_store_value(hasAccess);
    const response = writable("");
    const queue = [];
    const queueHandler = () => {
      setTimeout(
        () => {
          if (queue.length) {
            response.set(queue.shift());
            queueHandler();
          }
        },
        randomNumberBetween(20, 200)
      );
    };
    controller = new AbortController();
    if (hasAccessValue.substring(0, 5) === "gpt-4") {
      fetch(endpoint, Object.assign(args, { "Content-Type": "text/event-stream" })).then((response2) => {
        const reader = response2.body.pipeThrough(new TextDecoderStream()).getReader();
        const interval = setInterval(
          () => {
            reader.read().then(({ value, done }) => {
              if (!value) {
                console.log("EMPTY");
                return;
              }
              value = value.split(`

`).map((v) => v.trim()).filter(Boolean);
              value.forEach((value2) => {
                if (value2.substring(0, 5) === "data:") {
                  let message;
                  value2 = value2.replace(/^data:\s*/, "").trim();
                  if (done || value2 === "[DONE]") {
                    console.info("DONE");
                    clearInterval(interval);
                    return;
                  }
                  try {
                    message = JSON.parse(value2);
                  } catch (error) {
                    clearInterval(interval);
                    console.warn(value2);
                    return;
                  }
                  queue.push(message.choices.shift());
                  if (queue.length === 1) {
                    queueHandler();
                  }
                }
              });
            });
          },
          100
        );
      });
    } else {
      fetch(endpoint, args).then((res) => res.json()).then((res) => {
        queue.push(res.choices.shift());
        if (queue.length === 1) {
          queueHandler();
        }
      });
    }
    return response;
  }
  function randomNumberBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
  function instance$k($$self, $$props, $$invalidate) {
    let $errors;
    let $isBusy;
    let $keywords;
    let $answer, $$unsubscribe_answer = noop;
    let $active;
    component_subscribe($$self, errors, ($$value) => $$invalidate(6, $errors = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(7, $isBusy = $$value));
    component_subscribe($$self, keywords, ($$value) => $$invalidate(8, $keywords = $$value));
    component_subscribe($$self, answer, ($$value) => $$invalidate(9, $answer = $$value));
    component_subscribe($$self, active, ($$value) => $$invalidate(10, $active = $$value));
    $$self.$$.on_destroy.push(() => $$unsubscribe_answer());
    let { $$slots: slots = {}, $$scope } = $$props;
    let { prompt = null } = $$props;
    let { disabled } = $$props;
    const redactor = getContext("redactor");
    const preview = redactor.api("source.getCode");
    let timeout;
    async function handleRequest() {
      const data = {
        [Craft.csrfTokenName]: Craft.csrfTokenValue,
        prompt: prompt ? prompt : $active.prompt,
        context: preview,
        keywords: $keywords
      };
      if (timeout) {
        clearTimeout(timeout);
      }
      const args = {
        body: new URLSearchParams(data),
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow"
      };
      set_store_value(errors, $errors = [], $errors);
      set_store_value(answer, $answer = "", $answer);
      set_store_value(isBusy, $isBusy = true, $isBusy);
      const unsubscribe = stream("/admin/actions/promptly/generate", args).subscribe((value) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        if (value) {
          if (value.finish_reason === "stop") {
            unsubscribe();
            controller.abort();
            set_store_value(keywords, $keywords = "", $keywords);
            set_store_value(isBusy, $isBusy = false, $isBusy);
            if (!value.message) {
              return;
            }
          }
          if (value.message && value.message.content) {
            set_store_value(answer, $answer += value.message.content, $answer);
          } else if (value.delta && value.delta.content) {
            set_store_value(answer, $answer += value.delta.content, $answer);
          } else if (value.text) {
            set_store_value(answer, $answer += value.text, $answer);
          }
        }
        timeout = setTimeout(
          () => {
            unsubscribe();
            controller.abort();
            set_store_value(keywords, $keywords = "", $keywords);
            set_store_value(isBusy, $isBusy = false, $isBusy);
            set_store_value(
              errors,
              $errors = [
                "It looks like something went wrong with the request. Please try again."
              ],
              $errors
            );
          },
          30 * 1e3
        );
      });
    }
    $$self.$$set = ($$props2) => {
      if ("prompt" in $$props2)
        $$invalidate(2, prompt = $$props2.prompt);
      if ("disabled" in $$props2)
        $$invalidate(0, disabled = $$props2.disabled);
      if ("$$scope" in $$props2)
        $$invalidate(3, $$scope = $$props2.$$scope);
    };
    return [disabled, handleRequest, prompt, $$scope, slots];
  }
  class Generate extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$k, create_fragment$m, safe_not_equal, { prompt: 2, disabled: 0 });
    }
  }
  function add_css$c(target) {
    append_styles(target, "svelte-1gaopyk", ".child-label.svelte-1gaopyk{margin-bottom:0.25rem;font-size:1rem;line-height:1.5\n}@media(min-width: 768px){.child-label.svelte-1gaopyk{font-size:1.125rem;line-height:1.55\n    }}p.svelte-1gaopyk{margin:0px\n}@media not all and (min-width: 1024px){p.svelte-1gaopyk:not(.child-label){display:none\n    }}");
  }
  function get_each_context$5(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i];
    return child_ctx;
  }
  function create_default_slot$4(ctx) {
    let p0;
    let t0_value = ctx[4].label + "";
    let t0;
    let t1;
    let p1;
    let t2_value = ctx[4].description + "";
    let t2;
    let t3;
    return {
      c() {
        p0 = element("p");
        t0 = text(t0_value);
        t1 = space();
        p1 = element("p");
        t2 = text(t2_value);
        t3 = space();
        attr(p0, "class", "child-label svelte-1gaopyk");
        attr(p1, "class", "svelte-1gaopyk");
      },
      m(target, anchor) {
        insert(target, p0, anchor);
        append(p0, t0);
        insert(target, t1, anchor);
        insert(target, p1, anchor);
        append(p1, t2);
        insert(target, t3, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & 1 && t0_value !== (t0_value = ctx2[4].label + ""))
          set_data(t0, t0_value);
        if (dirty & 1 && t2_value !== (t2_value = ctx2[4].description + ""))
          set_data(t2, t2_value);
      },
      d(detaching) {
        if (detaching) {
          detach(p0);
          detach(t1);
          detach(p1);
          detach(t3);
        }
      }
    };
  }
  function create_each_block$5(key_1, ctx) {
    let first;
    let button;
    let current;
    button = new Button({
      props: {
        action: ctx[4],
        $$slots: { default: [create_default_slot$4] },
        $$scope: { ctx }
      }
    });
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        create_component(button.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(button, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const button_changes = {};
        if (dirty & 1)
          button_changes.action = ctx[4];
        if (dirty & 129) {
          button_changes.$$scope = { dirty, ctx };
        }
        button.$set(button_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(first);
        }
        destroy_component(button, detaching);
      }
    };
  }
  function create_fragment$l(ctx) {
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let each_1_anchor;
    let current;
    let each_value = ensure_array_like(ctx[0]);
    const get_key = (ctx2) => ctx2[4].handle;
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context$5(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (dirty & 1) {
          each_value = ensure_array_like(ctx2[0]);
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$5, each_1_anchor, get_each_context$5);
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(each_1_anchor);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d(detaching);
        }
      }
    };
  }
  function instance$j($$self, $$props, $$invalidate) {
    let $active;
    let $isBusy;
    component_subscribe($$self, active, ($$value) => $$invalidate(1, $active = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(2, $isBusy = $$value));
    let { actions: actions2 = [] } = $$props;
    set_store_value(active, $active = actions2[0], $active);
    function setComponent() {
      if ($isBusy) {
        set_store_value(isBusy, $isBusy = false, $isBusy);
        controller.abort();
      }
      if (!$active) {
        set_store_value(active, $active = actions2[0], $active);
      }
    }
    $$self.$$set = ($$props2) => {
      if ("actions" in $$props2)
        $$invalidate(0, actions2 = $$props2.actions);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 2) {
        setComponent();
      }
    };
    return [actions2, $active];
  }
  class Actions$1 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$j, create_fragment$l, safe_not_equal, { actions: 0 }, add_css$c);
    }
  }
  function create_fragment$k(ctx) {
    let actions_1;
    let current;
    actions_1 = new Actions$1({ props: { actions: ctx[0] } });
    return {
      c() {
        create_component(actions_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(actions_1, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const actions_1_changes = {};
        if (dirty & 1)
          actions_1_changes.actions = ctx2[0];
        actions_1.$set(actions_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(actions_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(actions_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(actions_1, detaching);
      }
    };
  }
  const actions = writable([]);
  function instance$i($$self, $$props, $$invalidate) {
    let $actions, $$unsubscribe_actions = noop;
    component_subscribe($$self, actions, ($$value) => $$invalidate(0, $actions = $$value));
    $$self.$$.on_destroy.push(() => $$unsubscribe_actions());
    return [$actions];
  }
  class Actions_1$2 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$i, create_fragment$k, safe_not_equal, {});
    }
  }
  function add_css$b(target) {
    append_styles(target, "svelte-1nmapo4", ".wrapper.svelte-1nmapo4{display:grid;gap:1rem\n}.field.svelte-1nmapo4{margin:0px\n}.required.svelte-1nmapo4{margin:0px;display:inline-block;--tw-translate-y:-0.25rem;--tw-translate-x:-0.375rem;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))\n}");
  }
  function create_fragment$j(ctx) {
    let form_1;
    let div1;
    let div0;
    let t1;
    let input0;
    let t2;
    let div3;
    let div2;
    let t4;
    let input1;
    let t5;
    let div5;
    let div4;
    let t7;
    let textarea;
    let t8;
    let div6;
    let button;
    let mounted;
    let dispose;
    return {
      c() {
        form_1 = element("form");
        div1 = element("div");
        div0 = element("div");
        div0.innerHTML = `<label for="promptly-label">Label
                <span class="required svelte-1nmapo4"></span></label>`;
        t1 = space();
        input0 = element("input");
        t2 = space();
        div3 = element("div");
        div2 = element("div");
        div2.innerHTML = `<label for="promptly-description">Description</label>`;
        t4 = space();
        input1 = element("input");
        t5 = space();
        div5 = element("div");
        div4 = element("div");
        div4.innerHTML = `<label for="promptly-prompt">Prompt
                <span class="required svelte-1nmapo4"></span></label>`;
        t7 = space();
        textarea = element("textarea");
        t8 = space();
        div6 = element("div");
        button = element("button");
        button.textContent = "Save";
        attr(div0, "class", "heading");
        attr(input0, "type", "text");
        attr(input0, "id", "promptly-label");
        attr(input0, "class", "text fullwidth");
        input0.required = true;
        attr(div1, "class", "field svelte-1nmapo4");
        attr(div2, "class", "heading");
        attr(input1, "type", "text");
        attr(input1, "for", "promptly-prompt");
        attr(input1, "class", "text fullwidth");
        attr(div3, "class", "field svelte-1nmapo4");
        attr(div4, "class", "heading");
        attr(textarea, "id", "promptly-description");
        attr(textarea, "class", "nicetext text fullwidth");
        textarea.required = true;
        attr(div5, "class", "field svelte-1nmapo4");
        attr(button, "class", "btn submit");
        attr(form_1, "class", "wrapper svelte-1nmapo4");
      },
      m(target, anchor) {
        insert(target, form_1, anchor);
        append(form_1, div1);
        append(div1, div0);
        append(div1, t1);
        append(div1, input0);
        set_input_value(input0, ctx[0].label);
        append(form_1, t2);
        append(form_1, div3);
        append(div3, div2);
        append(div3, t4);
        append(div3, input1);
        set_input_value(input1, ctx[0].description);
        append(form_1, t5);
        append(form_1, div5);
        append(div5, div4);
        append(div5, t7);
        append(div5, textarea);
        set_input_value(textarea, ctx[0].prompt);
        append(form_1, t8);
        append(form_1, div6);
        append(div6, button);
        ctx[7](form_1);
        if (!mounted) {
          dispose = [
            listen(input0, "input", ctx[4]),
            listen(input1, "input", ctx[5]),
            listen(textarea, "input", ctx[6]),
            listen(button, "click", ctx[2]),
            listen(form_1, "keydown", ctx[3])
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & 1 && input0.value !== ctx2[0].label) {
          set_input_value(input0, ctx2[0].label);
        }
        if (dirty & 1 && input1.value !== ctx2[0].description) {
          set_input_value(input1, ctx2[0].description);
        }
        if (dirty & 1) {
          set_input_value(textarea, ctx2[0].prompt);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(form_1);
        }
        ctx[7](null);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function random(length = 7) {
    return Math.random().toString(36).substring(2, length + 2);
  }
  function instance$h($$self, $$props, $$invalidate) {
    let $actions;
    let $active;
    let $isBusy;
    component_subscribe($$self, actions, ($$value) => $$invalidate(8, $actions = $$value));
    component_subscribe($$self, active, ($$value) => $$invalidate(9, $active = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(10, $isBusy = $$value));
    const prompt = {
      label: "",
      handle: "",
      description: "",
      prompt: ""
    };
    let form;
    function setHandle() {
      $$invalidate(0, prompt.handle = random(), prompt);
    }
    function addPrompt() {
      if (!form.reportValidity()) {
        return;
      }
      const body = new URLSearchParams({
        [Craft.csrfTokenName]: Craft.csrfTokenValue,
        label: prompt.label,
        content: prompt.prompt,
        description: prompt.description
      });
      const args = {
        body,
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow"
      };
      set_store_value(isBusy, $isBusy = true, $isBusy);
      fetch("/admin/actions/promptly/prompts", args).then((res) => res.json()).then((res) => {
        set_store_value(isBusy, $isBusy = false, $isBusy);
        const newActions = [res, ...$actions];
        set_store_value(actions, $actions = newActions, $actions);
        set_store_value(active, $active = $actions[0], $active);
      });
    }
    function onKeydown(event) {
      if (event.code === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addPrompt();
      }
    }
    function input0_input_handler() {
      prompt.label = this.value;
      $$invalidate(0, prompt);
    }
    function input1_input_handler() {
      prompt.description = this.value;
      $$invalidate(0, prompt);
    }
    function textarea_input_handler() {
      prompt.prompt = this.value;
      $$invalidate(0, prompt);
    }
    function form_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        form = $$value;
        $$invalidate(1, form);
      });
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 1) {
        setHandle();
      }
      if ($$self.$$.dirty & 2) {
        if (form) {
          form.querySelector("input").focus();
        }
      }
    };
    return [
      prompt,
      form,
      addPrompt,
      onKeydown,
      input0_input_handler,
      input1_input_handler,
      textarea_input_handler,
      form_1_binding
    ];
  }
  class NewPrompt extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$h, create_fragment$j, safe_not_equal, {}, add_css$b);
    }
  }
  function add_css$a(target) {
    append_styles(target, "svelte-104v699", "ul.svelte-104v699{margin-top:1.5rem;margin-bottom:1.5rem;display:grid;gap:0.5rem\n}li.svelte-104v699{border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(214 31 43 / var(--tw-bg-opacity));padding-left:0.5rem;padding-right:0.5rem;padding-top:0.25rem;padding-bottom:0.25rem;--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}");
  }
  function get_each_context$4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[1] = list[i];
    return child_ctx;
  }
  function create_if_block$8(ctx) {
    let ul;
    let each_value = ensure_array_like(ctx[0]);
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    }
    return {
      c() {
        ul = element("ul");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(ul, "class", "svelte-104v699");
      },
      m(target, anchor) {
        insert(target, ul, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(ul, null);
          }
        }
      },
      p(ctx2, dirty) {
        if (dirty & 1) {
          each_value = ensure_array_like(ctx2[0]);
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$4(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$4(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(ul, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(ul);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_each_block$4(ctx) {
    let li;
    let t_value = ctx[1] + "";
    let t2;
    return {
      c() {
        li = element("li");
        t2 = text(t_value);
        attr(li, "class", "svelte-104v699");
      },
      m(target, anchor) {
        insert(target, li, anchor);
        append(li, t2);
      },
      p(ctx2, dirty) {
        if (dirty & 1 && t_value !== (t_value = ctx2[1] + ""))
          set_data(t2, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(li);
        }
      }
    };
  }
  function create_fragment$i(ctx) {
    let if_block_anchor;
    let if_block = ctx[0].length && create_if_block$8(ctx);
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, [dirty]) {
        if (ctx2[0].length) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block$8(ctx2);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function instance$g($$self, $$props, $$invalidate) {
    let $errors;
    component_subscribe($$self, errors, ($$value) => $$invalidate(0, $errors = $$value));
    return [$errors];
  }
  class Errors extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$g, create_fragment$i, safe_not_equal, {}, add_css$a);
    }
  }
  function add_css$9(target) {
    append_styles(target, "svelte-s2y5eh", '.wrapper.svelte-s2y5eh.svelte-s2y5eh{position:relative;border-radius:0.5rem;border-width:2px;padding-left:0.75rem;padding-right:0.75rem;padding-top:1rem}.wrapper.static.svelte-s2y5eh.svelte-s2y5eh{margin-bottom:1.5rem}.wrapper.svelte-s2y5eh .label.svelte-s2y5eh{position:absolute;left:1rem;top:0px;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding-left:0.5rem;padding-right:0.5rem;padding-bottom:0.125rem;font-size:0.75rem;line-height:1.33;font-weight:600;text-transform:uppercase;letter-spacing:0.025em;--tw-text-opacity:1;color:rgb(100 116 139 / var(--tw-text-opacity))}.preview.svelte-s2y5eh.svelte-s2y5eh{box-sizing:content-box;overflow:hidden;padding-bottom:1rem;transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:400ms;-webkit-mask-image:linear-gradient(to top, transparent 0, black 1rem, black 100%);mask-image:linear-gradient(to top, transparent 0, black 1rem, black 100%)}.preview.svelte-s2y5eh .preview-content.svelte-s2y5eh{color:var(--tw-prose-body);max-width:65ch}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(p):not(:where([class~="not-prose"] *)){margin-top:1.25em;margin-bottom:1.25em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where([class~="lead"]):not(:where([class~="not-prose"] *)){color:var(--tw-prose-lead);font-size:1.25em;line-height:1.6;margin-top:1.2em;margin-bottom:1.2em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(a):not(:where([class~="not-prose"] *)){color:var(--tw-prose-links);text-decoration:underline;font-weight:500}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(strong):not(:where([class~="not-prose"] *)){color:var(--tw-prose-bold);font-weight:600}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(a strong):not(:where([class~="not-prose"] *)){color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(blockquote strong):not(:where([class~="not-prose"] *)){color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(thead th strong):not(:where([class~="not-prose"] *)){color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol):not(:where([class~="not-prose"] *)){list-style-type:decimal;margin-top:1.25em;margin-bottom:1.25em;padding-left:1.625em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol[type="A"]):not(:where([class~="not-prose"] *)){list-style-type:upper-alpha}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol[type="a"]):not(:where([class~="not-prose"] *)){list-style-type:lower-alpha}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol[type="A" s]):not(:where([class~="not-prose"] *)){list-style-type:upper-alpha}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol[type="a" s]):not(:where([class~="not-prose"] *)){list-style-type:lower-alpha}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol[type="I"]):not(:where([class~="not-prose"] *)){list-style-type:upper-roman}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol[type="i"]):not(:where([class~="not-prose"] *)){list-style-type:lower-roman}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol[type="I" s]):not(:where([class~="not-prose"] *)){list-style-type:upper-roman}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol[type="i" s]):not(:where([class~="not-prose"] *)){list-style-type:lower-roman}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol[type="1"]):not(:where([class~="not-prose"] *)){list-style-type:decimal}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ul):not(:where([class~="not-prose"] *)){list-style-type:disc;margin-top:1.25em;margin-bottom:1.25em;padding-left:1.625em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol > li):not(:where([class~="not-prose"] *))::marker{font-weight:400;color:var(--tw-prose-counters)}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ul > li):not(:where([class~="not-prose"] *))::marker{color:var(--tw-prose-bullets)}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(hr):not(:where([class~="not-prose"] *)){border-color:var(--tw-prose-hr);border-top-width:1px;margin-top:3em;margin-bottom:3em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(blockquote):not(:where([class~="not-prose"] *)){font-weight:500;font-style:italic;color:var(--tw-prose-quotes);border-left-width:0.25rem;border-left-color:var(--tw-prose-quote-borders);quotes:"\\201C""\\201D""\\2018""\\2019";margin-top:1.6em;margin-bottom:1.6em;padding-left:1em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(blockquote p:first-of-type):not(:where([class~="not-prose"] *))::before{content:open-quote}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(blockquote p:last-of-type):not(:where([class~="not-prose"] *))::after{content:close-quote}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h1):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:800;font-size:2.25em;margin-top:0;margin-bottom:0.8888889em;line-height:1.1111111}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h1 strong):not(:where([class~="not-prose"] *)){font-weight:900;color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h2):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:700;font-size:1.5em;margin-top:2em;margin-bottom:1em;line-height:1.3333333}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h2 strong):not(:where([class~="not-prose"] *)){font-weight:800;color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h3):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:600;font-size:1.25em;margin-top:1.6em;margin-bottom:0.6em;line-height:1.6}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h3 strong):not(:where([class~="not-prose"] *)){font-weight:700;color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h4):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:600;margin-top:1.5em;margin-bottom:0.5em;line-height:1.5}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h4 strong):not(:where([class~="not-prose"] *)){font-weight:700;color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(img):not(:where([class~="not-prose"] *)){margin-top:2em;margin-bottom:2em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(figure > *):not(:where([class~="not-prose"] *)){margin-top:0;margin-bottom:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(figcaption):not(:where([class~="not-prose"] *)){color:var(--tw-prose-captions);font-size:0.875em;line-height:1.4285714;margin-top:0.8571429em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(code):not(:where([class~="not-prose"] *)){color:var(--tw-prose-code);font-weight:600;font-size:0.875em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(code):not(:where([class~="not-prose"] *))::before{content:"`"}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(code):not(:where([class~="not-prose"] *))::after{content:"`"}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(a code):not(:where([class~="not-prose"] *)){color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h1 code):not(:where([class~="not-prose"] *)){color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h2 code):not(:where([class~="not-prose"] *)){color:inherit;font-size:0.875em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h3 code):not(:where([class~="not-prose"] *)){color:inherit;font-size:0.9em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h4 code):not(:where([class~="not-prose"] *)){color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(blockquote code):not(:where([class~="not-prose"] *)){color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(thead th code):not(:where([class~="not-prose"] *)){color:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(pre):not(:where([class~="not-prose"] *)){color:var(--tw-prose-pre-code);background-color:var(--tw-prose-pre-bg);overflow-x:auto;font-weight:400;font-size:0.875em;line-height:1.7142857;margin-top:1.7142857em;margin-bottom:1.7142857em;border-radius:0.375rem;padding-top:0.8571429em;padding-right:1.1428571em;padding-bottom:0.8571429em;padding-left:1.1428571em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(pre code):not(:where([class~="not-prose"] *)){background-color:transparent;border-width:0;border-radius:0;padding:0;font-weight:inherit;color:inherit;font-size:inherit;font-family:inherit;line-height:inherit}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(pre code):not(:where([class~="not-prose"] *))::before{content:none}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(pre code):not(:where([class~="not-prose"] *))::after{content:none}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(table):not(:where([class~="not-prose"] *)){width:100%;table-layout:auto;text-align:left;margin-top:2em;margin-bottom:2em;font-size:0.875em;line-height:1.7142857}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(thead):not(:where([class~="not-prose"] *)){border-bottom-width:1px;border-bottom-color:var(--tw-prose-th-borders)}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(thead th):not(:where([class~="not-prose"] *)){color:var(--tw-prose-headings);font-weight:600;vertical-align:bottom;padding-right:0.5714286em;padding-bottom:0.5714286em;padding-left:0.5714286em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tbody tr):not(:where([class~="not-prose"] *)){border-bottom-width:1px;border-bottom-color:var(--tw-prose-td-borders)}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tbody tr:last-child):not(:where([class~="not-prose"] *)){border-bottom-width:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tbody td):not(:where([class~="not-prose"] *)){vertical-align:baseline}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tfoot):not(:where([class~="not-prose"] *)){border-top-width:1px;border-top-color:var(--tw-prose-th-borders)}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tfoot td):not(:where([class~="not-prose"] *)){vertical-align:top}.preview.svelte-s2y5eh .preview-content.svelte-s2y5eh{--tw-prose-body:#374151;--tw-prose-headings:#111827;--tw-prose-lead:#4b5563;--tw-prose-links:#111827;--tw-prose-bold:#111827;--tw-prose-counters:#6b7280;--tw-prose-bullets:#d1d5db;--tw-prose-hr:#e5e7eb;--tw-prose-quotes:#111827;--tw-prose-quote-borders:#e5e7eb;--tw-prose-captions:#6b7280;--tw-prose-code:#111827;--tw-prose-pre-code:#e5e7eb;--tw-prose-pre-bg:#1f2937;--tw-prose-th-borders:#d1d5db;--tw-prose-td-borders:#e5e7eb;--tw-prose-invert-body:#d1d5db;--tw-prose-invert-headings:#fff;--tw-prose-invert-lead:#9ca3af;--tw-prose-invert-links:#fff;--tw-prose-invert-bold:#fff;--tw-prose-invert-counters:#9ca3af;--tw-prose-invert-bullets:#4b5563;--tw-prose-invert-hr:#374151;--tw-prose-invert-quotes:#f3f4f6;--tw-prose-invert-quote-borders:#374151;--tw-prose-invert-captions:#9ca3af;--tw-prose-invert-code:#fff;--tw-prose-invert-pre-code:#d1d5db;--tw-prose-invert-pre-bg:rgb(0 0 0 / 50%);--tw-prose-invert-th-borders:#4b5563;--tw-prose-invert-td-borders:#374151;font-size:1rem;line-height:1.75}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(video):not(:where([class~="not-prose"] *)){margin-top:2em;margin-bottom:2em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(figure):not(:where([class~="not-prose"] *)){margin-top:2em;margin-bottom:2em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(li):not(:where([class~="not-prose"] *)){margin-top:0.5em;margin-bottom:0.5em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol > li):not(:where([class~="not-prose"] *)){padding-left:0.375em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ul > li):not(:where([class~="not-prose"] *)){padding-left:0.375em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose > ul > li p):not(:where([class~="not-prose"] *)){margin-top:0.75em;margin-bottom:0.75em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose > ul > li > *:first-child):not(:where([class~="not-prose"] *)){margin-top:1.25em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose > ul > li > *:last-child):not(:where([class~="not-prose"] *)){margin-bottom:1.25em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose > ol > li > *:first-child):not(:where([class~="not-prose"] *)){margin-top:1.25em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose > ol > li > *:last-child):not(:where([class~="not-prose"] *)){margin-bottom:1.25em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ul ul, ul ol, ol ul, ol ol):not(:where([class~="not-prose"] *)){margin-top:0.75em;margin-bottom:0.75em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(hr + *):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h2 + *):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h3 + *):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h4 + *):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(thead th:first-child):not(:where([class~="not-prose"] *)){padding-left:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(thead th:last-child):not(:where([class~="not-prose"] *)){padding-right:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tbody td, tfoot td):not(:where([class~="not-prose"] *)){padding-top:0.5714286em;padding-right:0.5714286em;padding-bottom:0.5714286em;padding-left:0.5714286em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tbody td:first-child, tfoot td:first-child):not(:where([class~="not-prose"] *)){padding-left:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tbody td:last-child, tfoot td:last-child):not(:where([class~="not-prose"] *)){padding-right:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose > :first-child):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose > :last-child):not(:where([class~="not-prose"] *)){margin-bottom:0}.preview.svelte-s2y5eh .preview-content.svelte-s2y5eh{font-size:0.875rem;line-height:1.7142857}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(p):not(:where([class~="not-prose"] *)){margin-top:1.1428571em;margin-bottom:1.1428571em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where([class~="lead"]):not(:where([class~="not-prose"] *)){font-size:1.2857143em;line-height:1.5555556;margin-top:0.8888889em;margin-bottom:0.8888889em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(blockquote):not(:where([class~="not-prose"] *)){margin-top:1.3333333em;margin-bottom:1.3333333em;padding-left:1.1111111em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h1):not(:where([class~="not-prose"] *)){font-size:2.1428571em;margin-top:0;margin-bottom:0.8em;line-height:1.2}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h2):not(:where([class~="not-prose"] *)){font-size:1.4285714em;margin-top:1.6em;margin-bottom:0.8em;line-height:1.4}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h3):not(:where([class~="not-prose"] *)){font-size:1.2857143em;margin-top:1.5555556em;margin-bottom:0.4444444em;line-height:1.5555556}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h4):not(:where([class~="not-prose"] *)){margin-top:1.4285714em;margin-bottom:0.5714286em;line-height:1.4285714}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(img):not(:where([class~="not-prose"] *)){margin-top:1.7142857em;margin-bottom:1.7142857em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(video):not(:where([class~="not-prose"] *)){margin-top:1.7142857em;margin-bottom:1.7142857em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(figure):not(:where([class~="not-prose"] *)){margin-top:1.7142857em;margin-bottom:1.7142857em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(figure > *):not(:where([class~="not-prose"] *)){margin-top:0;margin-bottom:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(figcaption):not(:where([class~="not-prose"] *)){font-size:0.8571429em;line-height:1.3333333;margin-top:0.6666667em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(code):not(:where([class~="not-prose"] *)){font-size:0.8571429em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h2 code):not(:where([class~="not-prose"] *)){font-size:0.9em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h3 code):not(:where([class~="not-prose"] *)){font-size:0.8888889em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(pre):not(:where([class~="not-prose"] *)){font-size:0.8571429em;line-height:1.6666667;margin-top:1.6666667em;margin-bottom:1.6666667em;border-radius:0.25rem;padding-top:0.6666667em;padding-right:1em;padding-bottom:0.6666667em;padding-left:1em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol):not(:where([class~="not-prose"] *)){margin-top:1.1428571em;margin-bottom:1.1428571em;padding-left:1.5714286em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ul):not(:where([class~="not-prose"] *)){margin-top:1.1428571em;margin-bottom:1.1428571em;padding-left:1.5714286em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(li):not(:where([class~="not-prose"] *)){margin-top:0.2857143em;margin-bottom:0.2857143em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ol > li):not(:where([class~="not-prose"] *)){padding-left:0.4285714em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ul > li):not(:where([class~="not-prose"] *)){padding-left:0.4285714em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose-sm > ul > li p):not(:where([class~="not-prose"] *)){margin-top:0.5714286em;margin-bottom:0.5714286em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose-sm > ul > li > *:first-child):not(:where([class~="not-prose"] *)){margin-top:1.1428571em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose-sm > ul > li > *:last-child):not(:where([class~="not-prose"] *)){margin-bottom:1.1428571em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose-sm > ol > li > *:first-child):not(:where([class~="not-prose"] *)){margin-top:1.1428571em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose-sm > ol > li > *:last-child):not(:where([class~="not-prose"] *)){margin-bottom:1.1428571em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(ul ul, ul ol, ol ul, ol ol):not(:where([class~="not-prose"] *)){margin-top:0.5714286em;margin-bottom:0.5714286em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(hr):not(:where([class~="not-prose"] *)){margin-top:2.8571429em;margin-bottom:2.8571429em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(hr + *):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h2 + *):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h3 + *):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(h4 + *):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(table):not(:where([class~="not-prose"] *)){font-size:0.8571429em;line-height:1.5}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(thead th):not(:where([class~="not-prose"] *)){padding-right:1em;padding-bottom:0.6666667em;padding-left:1em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(thead th:first-child):not(:where([class~="not-prose"] *)){padding-left:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(thead th:last-child):not(:where([class~="not-prose"] *)){padding-right:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tbody td, tfoot td):not(:where([class~="not-prose"] *)){padding-top:0.6666667em;padding-right:1em;padding-bottom:0.6666667em;padding-left:1em}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tbody td:first-child, tfoot td:first-child):not(:where([class~="not-prose"] *)){padding-left:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(tbody td:last-child, tfoot td:last-child):not(:where([class~="not-prose"] *)){padding-right:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose-sm > :first-child):not(:where([class~="not-prose"] *)){margin-top:0}.preview.svelte-s2y5eh .preview-content .svelte-s2y5eh:where(.prose-sm > :last-child):not(:where([class~="not-prose"] *)){margin-bottom:0}.preview.svelte-s2y5eh .preview-content.svelte-s2y5eh{height:max-content;min-height:0px;width:100%;max-width:100%;line-height:1.25rem;--tw-text-opacity:1;color:rgb(100 116 139 / var(--tw-text-opacity))}.preview.svelte-s2y5eh .preview-content.svelte-s2y5eh p:last-of-type{margin-bottom:0px}.link.svelte-s2y5eh.svelte-s2y5eh{margin-left:auto;margin-top:0.25rem;margin-bottom:1.5rem;display:block;--tw-text-opacity:1;color:rgb(59 130 246 / var(--tw-text-opacity))}');
  }
  function create_else_block$5(ctx) {
    let current;
    const default_slot_template = ctx[6].default;
    const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & 32)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              ctx2[5],
              !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_if_block$7(ctx) {
    let div2;
    let p;
    let t1;
    let div1;
    let div0;
    let div0_resize_listener;
    let div1_resize_listener;
    let t2;
    let if_block_anchor;
    let if_block = ctx[2] > 100 && create_if_block_1$5(ctx);
    return {
      c() {
        div2 = element("div");
        p = element("p");
        p.textContent = "Current Text";
        t1 = space();
        div1 = element("div");
        div0 = element("div");
        t2 = space();
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
        attr(p, "class", "label svelte-s2y5eh");
        attr(div0, "class", "preview-content svelte-s2y5eh");
        add_render_callback(() => ctx[7].call(div0));
        attr(div1, "class", "preview svelte-s2y5eh");
        add_render_callback(() => ctx[8].call(div1));
        set_style(div1, "height", ctx[2] > 100 ? ctx[0] ? `${ctx[2]}px` : "100px" : "auto");
        attr(div2, "class", "wrapper svelte-s2y5eh");
        toggle_class(div2, "static", ctx[2] <= 100);
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, p);
        append(div2, t1);
        append(div2, div1);
        append(div1, div0);
        div0.innerHTML = ctx[3];
        div0_resize_listener = add_iframe_resize_listener(div0, ctx[7].bind(div0));
        div1_resize_listener = add_iframe_resize_listener(div1, ctx[8].bind(div1));
        insert(target, t2, anchor);
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & 5) {
          set_style(div1, "height", ctx2[2] > 100 ? ctx2[0] ? `${ctx2[2]}px` : "100px" : "auto");
        }
        if (dirty & 4) {
          toggle_class(div2, "static", ctx2[2] <= 100);
        }
        if (ctx2[2] > 100) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_1$5(ctx2);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div2);
          detach(t2);
          detach(if_block_anchor);
        }
        div0_resize_listener();
        div1_resize_listener();
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_if_block_1$5(ctx) {
    let button;
    let t0;
    let t1_value = ctx[0] ? "Less" : "More";
    let t1;
    let mounted;
    let dispose;
    return {
      c() {
        button = element("button");
        t0 = text("Show ");
        t1 = text(t1_value);
        attr(button, "type", "button");
        attr(button, "class", "link svelte-s2y5eh");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);
        if (!mounted) {
          dispose = listen(button, "click", ctx[9]);
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 1 && t1_value !== (t1_value = ctx2[0] ? "Less" : "More"))
          set_data(t1, t1_value);
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment$h(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block$7, create_else_block$5];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (ctx2[4])
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if_block.p(ctx2, dirty);
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function instance$f($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const redactor = getContext("redactor");
    const preview = redactor.source.getCode();
    const plainText = redactor.cleaner.getFlatText(preview).trim();
    let expanded = false, outer, inner;
    function div0_elementresize_handler() {
      inner = this.clientHeight;
      $$invalidate(2, inner);
    }
    function div1_elementresize_handler() {
      outer = this.clientHeight;
      $$invalidate(1, outer);
    }
    const click_handler = () => $$invalidate(0, expanded = !expanded);
    $$self.$$set = ($$props2) => {
      if ("$$scope" in $$props2)
        $$invalidate(5, $$scope = $$props2.$$scope);
    };
    return [
      expanded,
      outer,
      inner,
      preview,
      plainText,
      $$scope,
      slots,
      div0_elementresize_handler,
      div1_elementresize_handler,
      click_handler
    ];
  }
  class Preview extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$f, create_fragment$h, safe_not_equal, {}, add_css$9);
    }
  }
  function add_css$8(target) {
    append_styles(target, "svelte-13hltdt", ".progressbar.svelte-13hltdt{position:static;margin-top:1rem;margin-bottom:1rem;width:100%\n}");
  }
  function create_fragment$g(ctx) {
    let div1;
    return {
      c() {
        div1 = element("div");
        div1.innerHTML = `<div class="progressbar-inner"></div>`;
        attr(div1, "class", "progressbar pending svelte-13hltdt");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
      }
    };
  }
  class Loading extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$g, safe_not_equal, {}, add_css$8);
    }
  }
  var e = { "": ["<em>", "</em>"], _: ["<strong>", "</strong>"], "*": ["<strong>", "</strong>"], "~": ["<s>", "</s>"], "\n": ["<br />"], " ": ["<br />"], "-": ["<hr />"] };
  function n(e2) {
    return e2.replace(RegExp("^" + (e2.match(/^(\t| )+/) || "")[0], "gm"), "");
  }
  function r(e2) {
    return (e2 + "").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function t(a, o) {
    var c, l, s, g, p, u = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)|<([^>]+)>|\\([_*~])/gm, h = [], m = "", i = o || {}, f = 0;
    function d(n2) {
      var r2 = e[n2[1] || ""], t2 = h[h.length - 1] == n2;
      return r2 ? r2[1] ? (t2 ? h.pop() : h.push(n2), r2[0 | t2]) : r2[0] : n2;
    }
    function $() {
      for (var e2 = ""; h.length; )
        e2 += d(h[h.length - 1]);
      return e2;
    }
    for (a = a.replace(/^\[(.+?)\]:\s*(.+)$/gm, function(e2, n2, r2) {
      return i[n2.toLowerCase()] = r2, "";
    }).replace(/^\n+|\n+$/g, ""); s = u.exec(a); )
      l = a.substring(f, s.index), f = u.lastIndex, c = s[0], l.match(/[^\\](\\\\)*\\$/) || ((p = s[3] || s[4]) ? c = '<pre class="code ' + (s[4] ? "poetry" : s[2].toLowerCase()) + '"><code' + (s[2] ? ' class="language-' + s[2].toLowerCase() + '"' : "") + ">" + n(r(p).replace(/^\n+|\n+$/g, "")) + "</code></pre>" : (p = s[6]) ? (p.match(/\./) && (s[5] = s[5].replace(/^\d+/gm, "")), g = t(n(s[5].replace(/^\s*[>*+.-]/gm, ""))), ">" == p ? p = "blockquote" : (p = p.match(/\./) ? "ol" : "ul", g = g.replace(/^(.*)(\n|$)/gm, "<li>$1</li>")), c = "<" + p + ">" + g + "</" + p + ">") : s[8] ? c = '<img src="' + r(s[8]) + '" alt="' + r(s[7]) + '">' : s[10] ? (m = m.replace("<a>", '<a href="' + r(s[11] || i[l.toLowerCase()]) + '">'), c = $() + "</a>") : s[18] && /^(https?|mailto):/.test(s[18]) ? c = '<a href="' + r(s[18]) + '">' + r(s[18]) + "</a>" : s[9] ? c = "<a>" : s[12] || s[14] ? c = "<" + (p = "h" + (s[14] ? s[14].length : s[13] > "=" ? 1 : 2)) + ">" + t(s[12] || s[15], i) + "</" + p + ">" : s[16] ? c = "<code>" + r(s[16]) + "</code>" : s[17] || s[1] ? c = d(s[17] || "--") : s[19] && (c = s[19])), m += l, m += c;
    return (m + a.substring(f) + $()).replace(/^\n+|\n+$/g, "");
  }
  function add_css$7(target) {
    append_styles(target, "svelte-1qqb7mp", "hr.svelte-1qqb7mp.svelte-1qqb7mp{margin-top:1rem;margin-bottom:1rem\n}.options.svelte-1qqb7mp.svelte-1qqb7mp{display:flex;align-items:center;gap:0.5rem;text-align:right\n}.options.svelte-1qqb7mp span.svelte-1qqb7mp{margin-right:auto\n}.option.svelte-1qqb7mp.svelte-1qqb7mp{border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(194 209 225 / var(--tw-bg-opacity));padding-left:0.5rem;padding-right:0.5rem;line-height:1.5rem;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.option.svelte-1qqb7mp.svelte-1qqb7mp:hover{--tw-bg-opacity:1;background-color:rgb(71 85 105 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}.delete.svelte-1qqb7mp.svelte-1qqb7mp:hover{--tw-bg-opacity:1;background-color:rgb(214 31 43 / var(--tw-bg-opacity))\n}.heading.svelte-1qqb7mp.svelte-1qqb7mp{font-size:1.125rem;line-height:1.55;font-weight:300;--tw-text-opacity:1;color:rgb(100 116 139 / var(--tw-text-opacity))\n}.promptly-answer.svelte-1qqb7mp.svelte-1qqb7mp{border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(34 197 95 / var(--tw-bg-opacity));padding-left:1.5rem;padding-right:1.5rem;padding-top:0.75rem;padding-bottom:0.75rem;--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}.promptly-answer.svelte-1qqb7mp p{margin:0px\n}");
  }
  function create_else_block$4(ctx) {
    let t0;
    let t1;
    let current_block_type_index;
    let if_block2;
    let if_block2_anchor;
    let current;
    let if_block0 = ctx[2].id && create_if_block_5$1(ctx);
    let if_block1 = ctx[2].handle !== "new" && create_if_block_4$2();
    const if_block_creators = [create_if_block_1$4, create_if_block_2$3, create_else_block_1$2];
    const if_blocks = [];
    function select_block_type_2(ctx2, dirty) {
      if (ctx2[3])
        return 0;
      if (ctx2[2].handle === "new")
        return 1;
      return 2;
    }
    current_block_type_index = select_block_type_2(ctx);
    if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (if_block1)
          if_block1.c();
        t1 = space();
        if_block2.c();
        if_block2_anchor = empty();
      },
      m(target, anchor) {
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t0, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, t1, anchor);
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block2_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (ctx2[2].id) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_5$1(ctx2);
            if_block0.c();
            if_block0.m(t0.parentNode, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (ctx2[2].handle !== "new") {
          if (if_block1) {
            if (dirty & 4) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_4$2();
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(t1.parentNode, t1);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_2(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block2 = if_blocks[current_block_type_index];
          if (!if_block2) {
            if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block2.c();
          } else {
            if_block2.p(ctx2, dirty);
          }
          transition_in(if_block2, 1);
          if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block1);
        transition_in(if_block2);
        current = true;
      },
      o(local) {
        transition_out(if_block1);
        transition_out(if_block2);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(t1);
          detach(if_block2_anchor);
        }
        if (if_block0)
          if_block0.d(detaching);
        if (if_block1)
          if_block1.d(detaching);
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function create_if_block$6(ctx) {
    let preview;
    let t$1;
    let div;
    let raw_value = t(ctx[0]) + "";
    let current;
    preview = new Preview({});
    return {
      c() {
        create_component(preview.$$.fragment);
        t$1 = space();
        div = element("div");
        attr(div, "class", "promptly-answer svelte-1qqb7mp");
      },
      m(target, anchor) {
        mount_component(preview, target, anchor);
        insert(target, t$1, anchor);
        insert(target, div, anchor);
        div.innerHTML = raw_value;
        current = true;
      },
      p(ctx2, dirty) {
        if ((!current || dirty & 1) && raw_value !== (raw_value = t(ctx2[0]) + ""))
          div.innerHTML = raw_value;
      },
      i(local) {
        if (current)
          return;
        transition_in(preview.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(preview.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t$1);
          detach(div);
        }
        destroy_component(preview, detaching);
      }
    };
  }
  function create_if_block_5$1(ctx) {
    let div;
    let t2;
    let hr;
    function select_block_type_1(ctx2, dirty) {
      if (ctx2[1])
        return create_if_block_6$1;
      return create_else_block_2$1;
    }
    let current_block_type = select_block_type_1(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        div = element("div");
        if_block.c();
        t2 = space();
        hr = element("hr");
        attr(div, "class", "options svelte-1qqb7mp");
        attr(hr, "class", "svelte-1qqb7mp");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if_block.m(div, null);
        insert(target, t2, anchor);
        insert(target, hr, anchor);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(div, null);
          }
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
          detach(t2);
          detach(hr);
        }
        if_block.d();
      }
    };
  }
  function create_else_block_2$1(ctx) {
    let button;
    let mounted;
    let dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "Delete";
        attr(button, "type", "button");
        attr(button, "class", "option delete svelte-1qqb7mp");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (!mounted) {
          dispose = listen(button, "click", ctx[7]);
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_6$1(ctx) {
    let span;
    let t1;
    let button0;
    let t3;
    let button1;
    let mounted;
    let dispose;
    return {
      c() {
        span = element("span");
        span.textContent = "Are you sure?";
        t1 = space();
        button0 = element("button");
        button0.textContent = "Cancel";
        t3 = space();
        button1 = element("button");
        button1.textContent = "Yes";
        attr(span, "class", "svelte-1qqb7mp");
        attr(button0, "type", "button");
        attr(button0, "class", "option svelte-1qqb7mp");
        attr(button1, "type", "button");
        attr(button1, "class", "option delete svelte-1qqb7mp");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        insert(target, t1, anchor);
        insert(target, button0, anchor);
        insert(target, t3, anchor);
        insert(target, button1, anchor);
        if (!mounted) {
          dispose = [
            listen(button0, "click", ctx[5]),
            listen(button1, "click", ctx[6])
          ];
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(span);
          detach(t1);
          detach(button0);
          detach(t3);
          detach(button1);
        }
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_4$2(ctx) {
    let preview;
    let current;
    preview = new Preview({});
    return {
      c() {
        create_component(preview.$$.fragment);
      },
      m(target, anchor) {
        mount_component(preview, target, anchor);
        current = true;
      },
      i(local) {
        if (current)
          return;
        transition_in(preview.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(preview.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(preview, detaching);
      }
    };
  }
  function create_else_block_1$2(ctx) {
    let t0;
    let errors2;
    let t1;
    let generate;
    let current;
    let if_block = ctx[2].prompt && create_if_block_3$2(ctx);
    errors2 = new Errors({});
    generate = new Generate({
      props: {
        $$slots: { default: [create_default_slot$3] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        if (if_block)
          if_block.c();
        t0 = space();
        create_component(errors2.$$.fragment);
        t1 = space();
        create_component(generate.$$.fragment);
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t0, anchor);
        mount_component(errors2, target, anchor);
        insert(target, t1, anchor);
        mount_component(generate, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (ctx2[2].prompt) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_3$2(ctx2);
            if_block.c();
            if_block.m(t0.parentNode, t0);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        const generate_changes = {};
        if (dirty & 512) {
          generate_changes.$$scope = { dirty, ctx: ctx2 };
        }
        generate.$set(generate_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(errors2.$$.fragment, local);
        transition_in(generate.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(errors2.$$.fragment, local);
        transition_out(generate.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(t1);
        }
        if (if_block)
          if_block.d(detaching);
        destroy_component(errors2, detaching);
        destroy_component(generate, detaching);
      }
    };
  }
  function create_if_block_2$3(ctx) {
    let newprompt;
    let current;
    newprompt = new NewPrompt({});
    return {
      c() {
        create_component(newprompt.$$.fragment);
      },
      m(target, anchor) {
        mount_component(newprompt, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(newprompt.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(newprompt.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(newprompt, detaching);
      }
    };
  }
  function create_if_block_1$4(ctx) {
    let loading;
    let current;
    loading = new Loading({});
    return {
      c() {
        create_component(loading.$$.fragment);
      },
      m(target, anchor) {
        mount_component(loading, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(loading.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(loading.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(loading, detaching);
      }
    };
  }
  function create_if_block_3$2(ctx) {
    let p;
    let t_value = ctx[2].prompt + "";
    let t2;
    return {
      c() {
        p = element("p");
        t2 = text(t_value);
        attr(p, "class", "heading svelte-1qqb7mp");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t2);
      },
      p(ctx2, dirty) {
        if (dirty & 4 && t_value !== (t_value = ctx2[2].prompt + ""))
          set_data(t2, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_default_slot$3(ctx) {
    let t2;
    return {
      c() {
        t2 = text("Generate");
      },
      m(target, anchor) {
        insert(target, t2, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
        }
      }
    };
  }
  function create_fragment$f(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block$6, create_else_block$4];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (ctx2[0])
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function instance$e($$self, $$props, $$invalidate) {
    let $actions;
    let $active;
    let $isBusy;
    let $answer;
    component_subscribe($$self, actions, ($$value) => $$invalidate(8, $actions = $$value));
    component_subscribe($$self, active, ($$value) => $$invalidate(2, $active = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(3, $isBusy = $$value));
    component_subscribe($$self, answer, ($$value) => $$invalidate(0, $answer = $$value));
    let confirmDeletion = false;
    function deletePrompt(id) {
      set_store_value(isBusy, $isBusy = true, $isBusy);
      const args = {
        body: new URLSearchParams({
          id,
          [Craft.csrfTokenName]: Craft.csrfTokenValue
        }),
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow"
      };
      fetch("/admin/actions/promptly/prompts/delete", args).then((res) => res.json()).then((res) => {
        $$invalidate(1, confirmDeletion = false);
        set_store_value(isBusy, $isBusy = false, $isBusy);
        actions.set([
          ...res,
          {
            label: "New Prompt",
            handle: "new",
            description: "",
            prompt: ""
          }
        ]);
        set_store_value(active, $active = $actions[0], $active);
      });
    }
    const click_handler = () => $$invalidate(1, confirmDeletion = false);
    const click_handler_1 = () => deletePrompt($active.id);
    const click_handler_2 = () => $$invalidate(1, confirmDeletion = true);
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 1) {
        insertion.set($answer);
      }
    };
    return [
      $answer,
      confirmDeletion,
      $active,
      $isBusy,
      deletePrompt,
      click_handler,
      click_handler_1,
      click_handler_2
    ];
  }
  class Panel$3 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$e, create_fragment$f, safe_not_equal, {}, add_css$7);
    }
  }
  function add_css$6(target) {
    append_styles(target, "svelte-1vp20b4", ".main.svelte-1vp20b4{display:flex\n}.main-left.svelte-1vp20b4{margin-top:-1.5rem;margin-bottom:-1.5rem;display:grid;width:40%;min-width:9rem;flex-shrink:0;align-content:flex-start;gap:0.75rem;border-right-width:1px;border-style:solid;--tw-border-opacity:1;border-color:rgb(210 219 229 / var(--tw-border-opacity));padding-top:1.5rem;padding-bottom:1.5rem;padding-right:1.5rem\n}@media(min-width: 768px){.main-left.svelte-1vp20b4{min-width:16rem\n    }}.main-left.svelte-1vp20b4{overflow:auto;margin-left:-0.25rem;padding-left:0.25rem\n}.main-right.svelte-1vp20b4{flex-grow:1;overflow:auto;padding:var(--content-padding);margin:calc(var(--content-padding) * -1);margin-left:0px\n}.select.svelte-1vp20b4,select.svelte-1vp20b4{width:100%\n}hr.svelte-1vp20b4{margin-top:0.5rem;margin-bottom:0.5rem\n}");
  }
  function get_each_context$3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[15] = list[i];
    return child_ctx;
  }
  function create_if_block_2$2(ctx) {
    let h2;
    let t2;
    return {
      c() {
        h2 = element("h2");
        t2 = text(ctx[0]);
      },
      m(target, anchor) {
        insert(target, h2, anchor);
        append(h2, t2);
      },
      p(ctx2, dirty) {
        if (dirty & 1)
          set_data(t2, ctx2[0]);
      },
      d(detaching) {
        if (detaching) {
          detach(h2);
        }
      }
    };
  }
  function create_if_block_1$3(ctx) {
    let div1;
    let div0;
    let select;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let t2;
    let hr;
    let mounted;
    let dispose;
    let each_value = ensure_array_like(ctx[7]);
    const get_key = (ctx2) => ctx2[15].handle;
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context$3(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    }
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        select = element("select");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t2 = space();
        hr = element("hr");
        attr(select, "class", "svelte-1vp20b4");
        if (ctx[3] === void 0)
          add_render_callback(() => ctx[8].call(select));
        attr(div0, "class", "select svelte-1vp20b4");
        attr(div1, "class", "select-wrapper");
        attr(hr, "class", "svelte-1vp20b4");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        append(div0, select);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(select, null);
          }
        }
        select_option(select, ctx[3], true);
        insert(target, t2, anchor);
        insert(target, hr, anchor);
        if (!mounted) {
          dispose = listen(select, "change", ctx[8]);
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 128) {
          each_value = ensure_array_like(ctx2[7]);
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, select, destroy_block, create_each_block$3, null, get_each_context$3);
        }
        if (dirty & 136) {
          select_option(select, ctx2[3]);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
          detach(t2);
          detach(hr);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_each_block$3(key_1, ctx) {
    let option_1;
    let t0_value = ctx[15].label + "";
    let t0;
    let t1;
    return {
      key: key_1,
      first: null,
      c() {
        option_1 = element("option");
        t0 = text(t0_value);
        t1 = space();
        option_1.__value = ctx[15].handle;
        set_input_value(option_1, option_1.__value);
        this.first = option_1;
      },
      m(target, anchor) {
        insert(target, option_1, anchor);
        append(option_1, t0);
        append(option_1, t1);
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
      },
      d(detaching) {
        if (detaching) {
          detach(option_1);
        }
      }
    };
  }
  function create_if_block$5(ctx) {
    let previous_key = ctx[4];
    let key_block_anchor;
    let current;
    let key_block = create_key_block$1(ctx);
    return {
      c() {
        key_block.c();
        key_block_anchor = empty();
      },
      m(target, anchor) {
        key_block.m(target, anchor);
        insert(target, key_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & 16 && safe_not_equal(previous_key, previous_key = ctx2[4])) {
          group_outros();
          transition_out(key_block, 1, 1, noop);
          check_outros();
          key_block = create_key_block$1(ctx2);
          key_block.c();
          transition_in(key_block, 1);
          key_block.m(key_block_anchor.parentNode, key_block_anchor);
        } else {
          key_block.p(ctx2, dirty);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(key_block);
        current = true;
      },
      o(local) {
        transition_out(key_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(key_block_anchor);
        }
        key_block.d(detaching);
      }
    };
  }
  function create_key_block$1(ctx) {
    let switch_instance;
    let updating_prompt;
    let switch_instance_anchor;
    let current;
    function switch_instance_prompt_binding(value) {
      ctx[9](value);
    }
    var switch_value = ctx[2];
    function switch_props(ctx2) {
      let switch_instance_props = { selection: "" };
      if (ctx2[5] !== void 0) {
        switch_instance_props.prompt = ctx2[5];
      }
      return { props: switch_instance_props };
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
      binding_callbacks.push(() => bind(switch_instance, "prompt", switch_instance_prompt_binding));
    }
    return {
      c() {
        if (switch_instance)
          create_component(switch_instance.$$.fragment);
        switch_instance_anchor = empty();
      },
      m(target, anchor) {
        if (switch_instance)
          mount_component(switch_instance, target, anchor);
        insert(target, switch_instance_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const switch_instance_changes = {};
        if (!updating_prompt && dirty & 32) {
          updating_prompt = true;
          switch_instance_changes.prompt = ctx2[5];
          add_flush_callback(() => updating_prompt = false);
        }
        if (dirty & 4 && switch_value !== (switch_value = ctx2[2])) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
            binding_callbacks.push(() => bind(switch_instance, "prompt", switch_instance_prompt_binding));
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
          } else {
            switch_instance = null;
          }
        } else if (switch_value) {
          switch_instance.$set(switch_instance_changes);
        }
      },
      i(local) {
        if (current)
          return;
        if (switch_instance)
          transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o(local) {
        if (switch_instance)
          transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(switch_instance_anchor);
        }
        if (switch_instance)
          destroy_component(switch_instance, detaching);
      }
    };
  }
  function create_fragment$e(ctx) {
    let div2;
    let div0;
    let t0;
    let switch_instance;
    let t1;
    let div1;
    let current;
    function select_block_type(ctx2, dirty) {
      if (!ctx2[6].isLg)
        return create_if_block_1$3;
      if (ctx2[0])
        return create_if_block_2$2;
    }
    let current_block_type = select_block_type(ctx);
    let if_block0 = current_block_type && current_block_type(ctx);
    var switch_value = ctx[1];
    function switch_props(ctx2) {
      return {};
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props());
    }
    let if_block1 = ctx[4] && create_if_block$5(ctx);
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (switch_instance)
          create_component(switch_instance.$$.fragment);
        t1 = space();
        div1 = element("div");
        if (if_block1)
          if_block1.c();
        attr(div0, "class", "main-left svelte-1vp20b4");
        attr(div1, "class", "main-right svelte-1vp20b4");
        attr(div2, "class", "main svelte-1vp20b4");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        if (if_block0)
          if_block0.m(div0, null);
        append(div0, t0);
        if (switch_instance)
          mount_component(switch_instance, div0, null);
        append(div2, t1);
        append(div2, div1);
        if (if_block1)
          if_block1.m(div1, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if (if_block0)
            if_block0.d(1);
          if_block0 = current_block_type && current_block_type(ctx2);
          if (if_block0) {
            if_block0.c();
            if_block0.m(div0, t0);
          }
        }
        if (dirty & 2 && switch_value !== (switch_value = ctx2[1])) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props());
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, div0, null);
          } else {
            switch_instance = null;
          }
        }
        if (ctx2[4]) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty & 16) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block$5(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div1, null);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        if (switch_instance)
          transition_in(switch_instance.$$.fragment, local);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        if (switch_instance)
          transition_out(switch_instance.$$.fragment, local);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div2);
        }
        if (if_block0) {
          if_block0.d();
        }
        if (switch_instance)
          destroy_component(switch_instance);
        if (if_block1)
          if_block1.d();
      }
    };
  }
  function instance$d($$self, $$props, $$invalidate) {
    let $category;
    let $answer;
    let $errors;
    let $active;
    let $screen;
    component_subscribe($$self, category, ($$value) => $$invalidate(10, $category = $$value));
    component_subscribe($$self, answer, ($$value) => $$invalidate(11, $answer = $$value));
    component_subscribe($$self, errors, ($$value) => $$invalidate(12, $errors = $$value));
    component_subscribe($$self, active, ($$value) => $$invalidate(4, $active = $$value));
    component_subscribe($$self, screen, ($$value) => $$invalidate(6, $screen = $$value));
    let { label } = $$props;
    let { Actions: Actions2 } = $$props;
    let { Panel: Panel2 } = $$props;
    const options = [customPrompt, ...categories];
    let prompt, selected;
    if (!selected) {
      selected = $category.handle;
    }
    function reset() {
      set_store_value(errors, $errors = [], $errors);
      set_store_value(answer, $answer = "", $answer);
    }
    function onSelected() {
      set_store_value(category, $category = options.find((option) => option.handle === selected), $category);
    }
    function select_change_handler() {
      selected = select_value(this);
      $$invalidate(3, selected);
      $$invalidate(7, options);
    }
    function switch_instance_prompt_binding(value) {
      prompt = value;
      $$invalidate(5, prompt);
    }
    $$self.$$set = ($$props2) => {
      if ("label" in $$props2)
        $$invalidate(0, label = $$props2.label);
      if ("Actions" in $$props2)
        $$invalidate(1, Actions2 = $$props2.Actions);
      if ("Panel" in $$props2)
        $$invalidate(2, Panel2 = $$props2.Panel);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 16) {
        reset();
      }
      if ($$self.$$.dirty & 8) {
        onSelected();
      }
    };
    return [
      label,
      Actions2,
      Panel2,
      selected,
      $active,
      prompt,
      $screen,
      options,
      select_change_handler,
      switch_instance_prompt_binding
    ];
  }
  class Base extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$d, create_fragment$e, safe_not_equal, { label: 0, Actions: 1, Panel: 2 }, add_css$6);
    }
  }
  function create_fragment$d(ctx) {
    let switch_instance;
    let switch_instance_anchor;
    let current;
    var switch_value = Base;
    function switch_props(ctx2) {
      return {
        props: { label: ctx2[0], Actions: Actions_1$2, Panel: Panel$3 }
      };
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    }
    return {
      c() {
        if (switch_instance)
          create_component(switch_instance.$$.fragment);
        switch_instance_anchor = empty();
      },
      m(target, anchor) {
        if (switch_instance)
          mount_component(switch_instance, target, anchor);
        insert(target, switch_instance_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const switch_instance_changes = {};
        if (dirty & 1)
          switch_instance_changes.label = ctx2[0];
        if (switch_value !== (switch_value = Base)) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
          } else {
            switch_instance = null;
          }
        } else if (switch_value) {
          switch_instance.$set(switch_instance_changes);
        }
      },
      i(local) {
        if (current)
          return;
        if (switch_instance)
          transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o(local) {
        if (switch_instance)
          transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(switch_instance_anchor);
        }
        if (switch_instance)
          destroy_component(switch_instance, detaching);
      }
    };
  }
  function instance$c($$self, $$props, $$invalidate) {
    let { label } = $$props;
    $$self.$$set = ($$props2) => {
      if ("label" in $$props2)
        $$invalidate(0, label = $$props2.label);
    };
    return [label];
  }
  class CustomPrompt extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$c, create_fragment$d, safe_not_equal, { label: 0 });
    }
  }
  function add_css$5(target) {
    append_styles(target, "svelte-5tnclf", ".button.svelte-5tnclf{transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:100ms;border-radius:0.25rem;padding-left:1.5rem;padding-right:1.5rem;padding-top:0.5rem;padding-bottom:0.5rem;text-align:left\n}.button.is-active.svelte-5tnclf{--tw-bg-opacity:1;background-color:rgb(71 85 105 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}.button.svelte-5tnclf:not(.is-active):hover{--tw-bg-opacity:1;background-color:rgb(14 133 255 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}");
  }
  function create_fragment$c(ctx) {
    let button;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = ctx[3].default;
    const default_slot = create_slot(default_slot_template, ctx, ctx[2], null);
    return {
      c() {
        button = element("button");
        if (default_slot)
          default_slot.c();
        attr(button, "type", "button");
        attr(button, "class", "button svelte-5tnclf");
        toggle_class(button, "is-active", ctx[1] && ctx[1].handle === ctx[0].handle);
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (default_slot) {
          default_slot.m(button, null);
        }
        current = true;
        if (!mounted) {
          dispose = listen(button, "click", ctx[4]);
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & 4)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              ctx2[2],
              !current ? get_all_dirty_from_scope(ctx2[2]) : get_slot_changes(default_slot_template, ctx2[2], dirty, null),
              null
            );
          }
        }
        if (!current || dirty & 3) {
          toggle_class(button, "is-active", ctx2[1] && ctx2[1].handle === ctx2[0].handle);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function instance$b($$self, $$props, $$invalidate) {
    let $category;
    component_subscribe($$self, category, ($$value) => $$invalidate(1, $category = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    let { action } = $$props;
    const click_handler = () => set_store_value(category, $category = action, $category);
    $$self.$$set = ($$props2) => {
      if ("action" in $$props2)
        $$invalidate(0, action = $$props2.action);
      if ("$$scope" in $$props2)
        $$invalidate(2, $$scope = $$props2.$$scope);
    };
    return [action, $category, $$scope, slots, click_handler];
  }
  class SidebarItem extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$b, create_fragment$c, safe_not_equal, { action: 0 }, add_css$5);
    }
  }
  function add_css$4(target) {
    append_styles(target, "svelte-15ft3k9", "div.svelte-15ft3k9 p:not(:first-child){margin-top:1rem\n}div.svelte-15ft3k9>ol{padding-left:1rem\n}div.svelte-15ft3k9>ol ol{padding-left:2.5rem\n}div.svelte-15ft3k9>ol>li > ol{list-style-type:lower-alpha\n}div.svelte-15ft3k9>ol>li > ol>li > ol{list-style-type:lower-roman\n}.is-busy.svelte-15ft3k9{pointer-events:none\n}");
  }
  function create_fragment$b(ctx) {
    let div;
    let raw_value = ctx[2](ctx[0]) + "";
    return {
      c() {
        div = element("div");
        attr(div, "class", "svelte-15ft3k9");
        toggle_class(div, "is-busy", ctx[1]);
      },
      m(target, anchor) {
        insert(target, div, anchor);
        div.innerHTML = raw_value;
      },
      p(ctx2, [dirty]) {
        if (dirty & 1 && raw_value !== (raw_value = ctx2[2](ctx2[0]) + ""))
          div.innerHTML = raw_value;
        if (dirty & 2) {
          toggle_class(div, "is-busy", ctx2[1]);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function instance$a($$self, $$props, $$invalidate) {
    let $isBusy;
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(1, $isBusy = $$value));
    let { content } = $$props;
    const redactor = getContext("redactor");
    function format(string) {
      return redactor.cleaner.paragraphize(string);
    }
    $$self.$$set = ($$props2) => {
      if ("content" in $$props2)
        $$invalidate(0, content = $$props2.content);
    };
    return [content, $isBusy, format];
  }
  class Answer extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$a, create_fragment$b, safe_not_equal, { content: 0 }, add_css$4);
    }
  }
  function add_css$3(target) {
    append_styles(target, "svelte-13dep3s", ".heading.svelte-13dep3s.svelte-13dep3s{font-size:1.125rem;line-height:1.55;font-weight:300;--tw-text-opacity:1;color:rgb(100 116 139 / var(--tw-text-opacity))\n}@media(min-width: 1024px){.heading.svelte-13dep3s.svelte-13dep3s{display:none\n    }}.select.svelte-13dep3s.svelte-13dep3s{flex-grow:1\n}.select.svelte-13dep3s select.svelte-13dep3s{width:100%\n}.select-wrapper.svelte-13dep3s.svelte-13dep3s{margin-top:1rem;display:flex;align-items:center;gap:1.5rem\n}.promptly-answer.svelte-13dep3s.svelte-13dep3s{margin-bottom:1.5rem;border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(34 197 95 / var(--tw-bg-opacity));padding-left:1.5rem;padding-right:1.5rem;padding-top:0.75rem;padding-bottom:0.75rem;--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}.promptly-answer.svelte-13dep3s p{margin:0px\n}.promptly-answers.svelte-13dep3s.svelte-13dep3s{margin-bottom:1.5rem\n}.promptly-answers.svelte-13dep3s ol,.promptly-answers.svelte-13dep3s ul{margin:0px;display:grid;list-style-type:none;gap:1rem;padding:0px\n}.promptly-answers.svelte-13dep3s li[tabindex]{cursor:pointer;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.promptly-answers.svelte-13dep3s li[tabindex]:hover{--tw-bg-opacity:1;background-color:rgb(14 133 255 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}.promptly-answers.svelte-13dep3s li[tabindex]{border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(243 247 253 / var(--tw-bg-opacity));padding-left:1.5rem;padding-right:1.5rem;padding-top:0.75rem;padding-bottom:0.75rem\n}.promptly-answers.svelte-13dep3s li[tabindex].promptly-selection{--tw-bg-opacity:1;background-color:rgb(34 197 95 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}");
  }
  function get_each_context$2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[11] = list[i];
    return child_ctx;
  }
  function create_else_block_2(ctx) {
    let t2;
    let preview;
    let current;
    let if_block = ctx[4].heading && create_if_block_7(ctx);
    preview = new Preview({
      props: {
        $$slots: { default: [create_default_slot_2$2] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        if (if_block)
          if_block.c();
        t2 = space();
        create_component(preview.$$.fragment);
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t2, anchor);
        mount_component(preview, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (ctx2[4].heading) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_7(ctx2);
            if_block.c();
            if_block.m(t2.parentNode, t2);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        const preview_changes = {};
        if (dirty & 16400) {
          preview_changes.$$scope = { dirty, ctx: ctx2 };
        }
        preview.$set(preview_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(preview.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(preview.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
        }
        if (if_block)
          if_block.d(detaching);
        destroy_component(preview, detaching);
      }
    };
  }
  function create_if_block_3$1(ctx) {
    let preview;
    let t2;
    let previous_key = ctx[3];
    let key_block_anchor;
    let current;
    preview = new Preview({});
    let key_block = create_key_block(ctx);
    return {
      c() {
        create_component(preview.$$.fragment);
        t2 = space();
        key_block.c();
        key_block_anchor = empty();
      },
      m(target, anchor) {
        mount_component(preview, target, anchor);
        insert(target, t2, anchor);
        key_block.m(target, anchor);
        insert(target, key_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & 8 && safe_not_equal(previous_key, previous_key = ctx2[3])) {
          group_outros();
          transition_out(key_block, 1, 1, noop);
          check_outros();
          key_block = create_key_block(ctx2);
          key_block.c();
          transition_in(key_block, 1);
          key_block.m(key_block_anchor.parentNode, key_block_anchor);
        } else {
          key_block.p(ctx2, dirty);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(preview.$$.fragment, local);
        transition_in(key_block);
        current = true;
      },
      o(local) {
        transition_out(preview.$$.fragment, local);
        transition_out(key_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
          detach(key_block_anchor);
        }
        destroy_component(preview, detaching);
        key_block.d(detaching);
      }
    };
  }
  function create_if_block_7(ctx) {
    let p;
    let t_value = ctx[4].heading + "";
    let t2;
    return {
      c() {
        p = element("p");
        t2 = text(t_value);
        attr(p, "class", "heading svelte-13dep3s");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t2);
      },
      p(ctx2, dirty) {
        if (dirty & 16 && t_value !== (t_value = ctx2[4].heading + ""))
          set_data(t2, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_if_block_6(ctx) {
    let p;
    return {
      c() {
        p = element("p");
        p.textContent = "Block content is empty. To guide topic generation, please input relevant keywords.";
      },
      m(target, anchor) {
        insert(target, p, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_default_slot_2$2(ctx) {
    let if_block_anchor;
    let if_block = !ctx[4].requiresContex && create_if_block_6();
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (!ctx2[4].requiresContex) {
          if (if_block)
            ;
          else {
            if_block = create_if_block_6();
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_else_block_1$1(ctx) {
    let div;
    let answer_1;
    let current;
    answer_1 = new Answer({ props: { content: ctx[3] } });
    return {
      c() {
        div = element("div");
        create_component(answer_1.$$.fragment);
        attr(div, "class", "promptly-answer svelte-13dep3s");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(answer_1, div, null);
        current = true;
      },
      p(ctx2, dirty) {
        const answer_1_changes = {};
        if (dirty & 8)
          answer_1_changes.content = ctx2[3];
        answer_1.$set(answer_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(answer_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(answer_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(answer_1);
      }
    };
  }
  function create_if_block_4$1(ctx) {
    let t2;
    let div;
    let answer_1;
    let current;
    let mounted;
    let dispose;
    let if_block = !ctx[5] && create_if_block_5();
    answer_1 = new Answer({ props: { content: ctx[3] } });
    return {
      c() {
        if (if_block)
          if_block.c();
        t2 = space();
        div = element("div");
        create_component(answer_1.$$.fragment);
        attr(div, "class", "promptly-answers svelte-13dep3s");
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t2, anchor);
        insert(target, div, anchor);
        mount_component(answer_1, div, null);
        current = true;
        if (!mounted) {
          dispose = action_destroyer(ctx[7].call(null, div));
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (!ctx2[5]) {
          if (if_block)
            ;
          else {
            if_block = create_if_block_5();
            if_block.c();
            if_block.m(t2.parentNode, t2);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        const answer_1_changes = {};
        if (dirty & 8)
          answer_1_changes.content = ctx2[3];
        answer_1.$set(answer_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(answer_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(answer_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
          detach(div);
        }
        if (if_block)
          if_block.d(detaching);
        destroy_component(answer_1);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_5(ctx) {
    let p;
    return {
      c() {
        p = element("p");
        p.textContent = 'Choose an option, then click "Insert Result".';
      },
      m(target, anchor) {
        insert(target, p, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_key_block(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block_4$1, create_else_block_1$1];
    const if_blocks = [];
    function select_block_type_1(ctx2, dirty) {
      if (ctx2[2])
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type_1(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_1(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function create_if_block_1$2(ctx) {
    let errors2;
    let t2;
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    errors2 = new Errors({});
    const if_block_creators = [create_if_block_2$1, create_else_block$3];
    const if_blocks = [];
    function select_block_type_3(ctx2, dirty) {
      if (ctx2[4].options && ctx2[4].options.length)
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type_3(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        create_component(errors2.$$.fragment);
        t2 = space();
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        mount_component(errors2, target, anchor);
        insert(target, t2, anchor);
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_3(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(errors2.$$.fragment, local);
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(errors2.$$.fragment, local);
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
          detach(if_block_anchor);
        }
        destroy_component(errors2, detaching);
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function create_if_block$4(ctx) {
    let loading;
    let current;
    loading = new Loading({});
    return {
      c() {
        create_component(loading.$$.fragment);
      },
      m(target, anchor) {
        mount_component(loading, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(loading.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(loading.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(loading, detaching);
      }
    };
  }
  function create_else_block$3(ctx) {
    let switch_instance;
    let switch_instance_anchor;
    let current;
    var switch_value = ctx[4].action.component;
    function switch_props(ctx2) {
      return {
        props: {
          $active: ctx2[4],
          $$slots: { default: [create_default_slot_1$2] },
          $$scope: { ctx: ctx2 }
        }
      };
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    }
    return {
      c() {
        if (switch_instance)
          create_component(switch_instance.$$.fragment);
        switch_instance_anchor = empty();
      },
      m(target, anchor) {
        if (switch_instance)
          mount_component(switch_instance, target, anchor);
        insert(target, switch_instance_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const switch_instance_changes = {};
        if (dirty & 16)
          switch_instance_changes.$active = ctx2[4];
        if (dirty & 16400) {
          switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (dirty & 16 && switch_value !== (switch_value = ctx2[4].action.component)) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
          } else {
            switch_instance = null;
          }
        } else if (switch_value) {
          switch_instance.$set(switch_instance_changes);
        }
      },
      i(local) {
        if (current)
          return;
        if (switch_instance)
          transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o(local) {
        if (switch_instance)
          transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(switch_instance_anchor);
        }
        if (switch_instance)
          destroy_component(switch_instance, detaching);
      }
    };
  }
  function create_if_block_2$1(ctx) {
    let div1;
    let div0;
    let select;
    let option_1;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let t1;
    let switch_instance;
    let current;
    let mounted;
    let dispose;
    let each_value = ensure_array_like(ctx[4].options);
    const get_key = (ctx2) => ctx2[11].label;
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context$2(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    }
    var switch_value = ctx[4].action.component;
    function switch_props(ctx2) {
      return {
        props: {
          disabled: !ctx2[0],
          prompt: ctx2[1],
          $active: ctx2[4],
          $$slots: { default: [create_default_slot$2] },
          $$scope: { ctx: ctx2 }
        }
      };
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    }
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        select = element("select");
        option_1 = element("option");
        option_1.textContent = "-- Select One ---";
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t1 = space();
        if (switch_instance)
          create_component(switch_instance.$$.fragment);
        option_1.__value = "";
        set_input_value(option_1, option_1.__value);
        attr(select, "class", "svelte-13dep3s");
        if (ctx[0] === void 0)
          add_render_callback(() => ctx[8].call(select));
        attr(div0, "class", "select svelte-13dep3s");
        attr(div1, "class", "select-wrapper svelte-13dep3s");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        append(div0, select);
        append(select, option_1);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(select, null);
          }
        }
        select_option(select, ctx[0], true);
        append(div1, t1);
        if (switch_instance)
          mount_component(switch_instance, div1, null);
        current = true;
        if (!mounted) {
          dispose = listen(select, "change", ctx[8]);
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 16) {
          each_value = ensure_array_like(ctx2[4].options);
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, select, destroy_block, create_each_block$2, null, get_each_context$2);
        }
        if (dirty & 17) {
          select_option(select, ctx2[0]);
        }
        const switch_instance_changes = {};
        if (dirty & 1)
          switch_instance_changes.disabled = !ctx2[0];
        if (dirty & 2)
          switch_instance_changes.prompt = ctx2[1];
        if (dirty & 16)
          switch_instance_changes.$active = ctx2[4];
        if (dirty & 16400) {
          switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (dirty & 16 && switch_value !== (switch_value = ctx2[4].action.component)) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, div1, null);
          } else {
            switch_instance = null;
          }
        } else if (switch_value) {
          switch_instance.$set(switch_instance_changes);
        }
      },
      i(local) {
        if (current)
          return;
        if (switch_instance)
          transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o(local) {
        if (switch_instance)
          transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
        if (switch_instance)
          destroy_component(switch_instance);
        mounted = false;
        dispose();
      }
    };
  }
  function create_default_slot_1$2(ctx) {
    let t_value = ctx[4].action.label + "";
    let t2;
    return {
      c() {
        t2 = text(t_value);
      },
      m(target, anchor) {
        insert(target, t2, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & 16 && t_value !== (t_value = ctx2[4].action.label + ""))
          set_data(t2, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
        }
      }
    };
  }
  function create_each_block$2(key_1, ctx) {
    let option_1;
    let t0_value = ctx[11].label + "";
    let t0;
    let t1;
    let option_1_value_value;
    return {
      key: key_1,
      first: null,
      c() {
        option_1 = element("option");
        t0 = text(t0_value);
        t1 = space();
        option_1.__value = option_1_value_value = ctx[11].prompt;
        set_input_value(option_1, option_1.__value);
        this.first = option_1;
      },
      m(target, anchor) {
        insert(target, option_1, anchor);
        append(option_1, t0);
        append(option_1, t1);
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & 16 && t0_value !== (t0_value = ctx[11].label + ""))
          set_data(t0, t0_value);
        if (dirty & 16 && option_1_value_value !== (option_1_value_value = ctx[11].prompt)) {
          option_1.__value = option_1_value_value;
          set_input_value(option_1, option_1.__value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(option_1);
        }
      }
    };
  }
  function create_default_slot$2(ctx) {
    let t_value = ctx[4].action.label + "";
    let t2;
    return {
      c() {
        t2 = text(t_value);
      },
      m(target, anchor) {
        insert(target, t2, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & 16 && t_value !== (t_value = ctx2[4].action.label + ""))
          set_data(t2, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
        }
      }
    };
  }
  function create_fragment$a(ctx) {
    let current_block_type_index;
    let if_block0;
    let t2;
    let current_block_type_index_1;
    let if_block1;
    let if_block1_anchor;
    let current;
    const if_block_creators = [create_if_block_3$1, create_else_block_2];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (ctx2[3])
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const if_block_creators_1 = [create_if_block$4, create_if_block_1$2];
    const if_blocks_1 = [];
    function select_block_type_2(ctx2, dirty) {
      if (ctx2[5])
        return 0;
      if (ctx2[6] || !ctx2[4].requiresContex)
        return 1;
      return -1;
    }
    if (~(current_block_type_index_1 = select_block_type_2(ctx))) {
      if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    }
    return {
      c() {
        if_block0.c();
        t2 = space();
        if (if_block1)
          if_block1.c();
        if_block1_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, t2, anchor);
        if (~current_block_type_index_1) {
          if_blocks_1[current_block_type_index_1].m(target, anchor);
        }
        insert(target, if_block1_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(t2.parentNode, t2);
        }
        let previous_block_index_1 = current_block_type_index_1;
        current_block_type_index_1 = select_block_type_2(ctx2);
        if (current_block_type_index_1 === previous_block_index_1) {
          if (~current_block_type_index_1) {
            if_blocks_1[current_block_type_index_1].p(ctx2, dirty);
          }
        } else {
          if (if_block1) {
            group_outros();
            transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
              if_blocks_1[previous_block_index_1] = null;
            });
            check_outros();
          }
          if (~current_block_type_index_1) {
            if_block1 = if_blocks_1[current_block_type_index_1];
            if (!if_block1) {
              if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx2);
              if_block1.c();
            } else {
              if_block1.p(ctx2, dirty);
            }
            transition_in(if_block1, 1);
            if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
          } else {
            if_block1 = null;
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
          detach(if_block1_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
        if (~current_block_type_index_1) {
          if_blocks_1[current_block_type_index_1].d(detaching);
        }
      }
    };
  }
  function instance$9($$self, $$props, $$invalidate) {
    let multiAnswer;
    let $insertion;
    let $answer;
    let $active;
    let $isBusy;
    let $hasContent;
    component_subscribe($$self, insertion, ($$value) => $$invalidate(9, $insertion = $$value));
    component_subscribe($$self, answer, ($$value) => $$invalidate(3, $answer = $$value));
    component_subscribe($$self, active, ($$value) => $$invalidate(4, $active = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(5, $isBusy = $$value));
    component_subscribe($$self, hasContent, ($$value) => $$invalidate(6, $hasContent = $$value));
    let { prompt } = $$props;
    let { selection } = $$props;
    function setPrompt() {
      $$invalidate(1, prompt = selection);
    }
    function initAnswer(el) {
      const items = el.querySelectorAll("li");
      Array.prototype.forEach.call(items, (li) => {
        li.setAttribute("tabindex", "0");
        li.addEventListener("click", (event) => {
          set_store_value(insertion, $insertion = event.target.innerHTML, $insertion);
          Array.prototype.forEach.call(items, (li2) => {
            li2.classList.remove("promptly-selection");
          });
          event.target.classList.add("promptly-selection");
        });
      });
    }
    function select_change_handler() {
      selection = select_value(this);
      $$invalidate(0, selection);
    }
    $$self.$$set = ($$props2) => {
      if ("prompt" in $$props2)
        $$invalidate(1, prompt = $$props2.prompt);
      if ("selection" in $$props2)
        $$invalidate(0, selection = $$props2.selection);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 16) {
        $$invalidate(2, multiAnswer = !["outline", "write"].includes($active.handle));
      }
      if ($$self.$$.dirty & 1) {
        setPrompt();
      }
      if ($$self.$$.dirty & 12) {
        if (!multiAnswer) {
          insertion.set($answer);
        }
      }
    };
    return [
      selection,
      prompt,
      multiAnswer,
      $answer,
      $active,
      $isBusy,
      $hasContent,
      initAnswer,
      select_change_handler
    ];
  }
  class Panel$2 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$9, create_fragment$a, safe_not_equal, { prompt: 1, selection: 0 }, add_css$3);
    }
  }
  function create_fragment$9(ctx) {
    let actions_1;
    let current;
    actions_1 = new Actions$1({ props: { actions: ctx[0] } });
    return {
      c() {
        create_component(actions_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(actions_1, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(actions_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(actions_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(actions_1, detaching);
      }
    };
  }
  function instance$8($$self) {
    const actions2 = [
      {
        label: "Topics",
        handle: "topics",
        description: "Discover unique ideas for page, blog, and article content.",
        prompt: "Generate a list of 3 interesting and engaging blog post topics based on the given context. Response should be formatted as follows: <ul>{{EACH}}<li>{TOPIC}</li>{{END_EACH}}</ul>.",
        heading: "Discover unique ideas for page, blog, and article content.",
        requiresContex: false,
        action: {
          component: GenerateWithKeywords,
          label: "Generate Topics"
        }
      },
      {
        label: "Openers",
        handle: "openers",
        description: "Begin your writing with an intriguing opening paragraph.",
        prompt: "Write 3 compelling opening paragraphs for a blog post based on the given context. Each opening paragraph should be unique and provide a different perspective on the topic. Response should be formatted as follows: <ul>{{EACH}}<li>{PARAGRAPH}</li>{{END_EACH}}</ul>.",
        heading: "Begin your writing with an intriguing opening paragraph.",
        requiresContex: false,
        action: {
          component: GenerateWithKeywords,
          label: "Generate Openers"
        }
      },
      {
        label: "Headlines",
        handle: "headlines",
        description: "Create headline options and choose which best suits your content.",
        prompt: "Create a list of 5 engaging section headings for a blog post based on the given context. The headings should be concise and informative, capturing the reader's attention. Response should be formatted as follows: <ul>{{EACH}}<li>{HEADING}</li>{{END_EACH}}</ul>.",
        heading: "Create headline options and choose which best suits your content.",
        requiresContex: false,
        action: {
          component: GenerateWithKeywords,
          label: "Generate Headlines"
        }
      },
      {
        label: "Outline",
        handle: "outline",
        description: "Develop a clear content outline for your blog post or page.",
        prompt: "Create a outline of the given context. Preserve links only. Response should be formatted as follows: <ol>{{EACH}}<li>{TEXT}{{RECURSION}}</li>{{END_EACH}}</ol>.",
        heading: "Develop a clear content outline for your blog post or page.",
        requiresContex: true,
        action: {
          component: Generate,
          label: "Generate Outline"
        }
      },
      {
        label: "Write",
        handle: "write",
        description: "Expand your content or summarize it succinctly.",
        prompt: "",
        heading: "Expand your content or summarize it succinctly.",
        requiresContex: true,
        action: { component: Generate, label: "Generate" },
        options: [
          {
            label: "Write a little",
            prompt: "Expand on this content by writting the next two to three sentences."
          },
          {
            label: "Write a lot",
            prompt: "Expand on this content by writting the next one or two paragraphs."
          },
          {
            label: "Write even more",
            prompt: "Expand on this content by writting the next three to four paragraphs."
          },
          {
            label: "Write a summary",
            prompt: "Write a short but detailed summary."
          }
        ]
      }
    ];
    return [actions2];
  }
  class Actions_1$1 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$8, create_fragment$9, safe_not_equal, {});
    }
  }
  function create_fragment$8(ctx) {
    let switch_instance;
    let switch_instance_anchor;
    let current;
    var switch_value = Base;
    function switch_props(ctx2) {
      return {
        props: { label: ctx2[0], Actions: Actions_1$1, Panel: Panel$2 }
      };
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    }
    return {
      c() {
        if (switch_instance)
          create_component(switch_instance.$$.fragment);
        switch_instance_anchor = empty();
      },
      m(target, anchor) {
        if (switch_instance)
          mount_component(switch_instance, target, anchor);
        insert(target, switch_instance_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const switch_instance_changes = {};
        if (dirty & 1)
          switch_instance_changes.label = ctx2[0];
        if (switch_value !== (switch_value = Base)) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
          } else {
            switch_instance = null;
          }
        } else if (switch_value) {
          switch_instance.$set(switch_instance_changes);
        }
      },
      i(local) {
        if (current)
          return;
        if (switch_instance)
          transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o(local) {
        if (switch_instance)
          transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(switch_instance_anchor);
        }
        if (switch_instance)
          destroy_component(switch_instance, detaching);
      }
    };
  }
  function instance$7($$self, $$props, $$invalidate) {
    let { label } = $$props;
    $$self.$$set = ($$props2) => {
      if ("label" in $$props2)
        $$invalidate(0, label = $$props2.label);
    };
    return [label];
  }
  class Brainstorm extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$7, create_fragment$8, safe_not_equal, { label: 0 });
    }
  }
  function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t2) => `opacity: ${t2 * o}`
    };
  }
  function add_css$2(target) {
    append_styles(target, "svelte-ds1x9b", ".dropdown.svelte-ds1x9b.svelte-ds1x9b{position:absolute;right:0px;bottom:100%;margin-bottom:0.25rem;border-radius:0.25rem;border-width:1px;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));pointer-events:none;opacity:0;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.dropdown.is-active.svelte-ds1x9b.svelte-ds1x9b{pointer-events:auto;opacity:1\n}.dropdown.svelte-ds1x9b button.svelte-ds1x9b{width:100%;padding-top:0.5rem;padding-bottom:0.5rem;padding-left:1rem;padding-right:1rem;text-align:left\n}");
  }
  function create_fragment$7(ctx) {
    let div5;
    let div0;
    let t0;
    let div4;
    let button0;
    let t2;
    let div3;
    let button1;
    let div1;
    let t4;
    let div2;
    let button1_aria_disabled_value;
    let t5;
    let button2;
    let button2_aria_disabled_value;
    let t6;
    let menu;
    let li0;
    let button3;
    let t8;
    let li1;
    let button4;
    let t10;
    let li2;
    let button5;
    let t12;
    let li3;
    let button6;
    let mounted;
    let dispose;
    return {
      c() {
        div5 = element("div");
        div0 = element("div");
        div0.innerHTML = ``;
        t0 = space();
        div4 = element("div");
        button0 = element("button");
        button0.textContent = "Cancel";
        t2 = space();
        div3 = element("div");
        button1 = element("button");
        div1 = element("div");
        div1.textContent = "Insert Results";
        t4 = space();
        div2 = element("div");
        t5 = space();
        button2 = element("button");
        t6 = space();
        menu = element("menu");
        li0 = element("li");
        button3 = element("button");
        button3.textContent = "Prepend Results";
        t8 = space();
        li1 = element("li");
        button4 = element("button");
        button4.textContent = "Append Results";
        t10 = space();
        li2 = element("li");
        button5 = element("button");
        button5.textContent = "Replace with Results";
        t12 = space();
        li3 = element("li");
        button6 = element("button");
        button6.textContent = "Copy to Clipboard";
        attr(div0, "class", "buttons left secondary-buttons");
        attr(button0, "type", "button");
        attr(button0, "class", "btn");
        attr(div1, "class", "label");
        attr(div2, "class", "spinner spinner-absolute");
        attr(button1, "type", "submit");
        attr(button1, "class", "btn disabled submit");
        attr(button1, "aria-disabled", button1_aria_disabled_value = ctx[3] || !ctx[1]);
        toggle_class(button1, "disabled", ctx[3] || !ctx[1]);
        attr(button2, "type", "button");
        attr(button2, "class", "btn submit menubtn");
        attr(button2, "aria-label", "More actions");
        attr(button2, "role", "combobox");
        attr(button2, "aria-controls", "");
        attr(button2, "aria-haspopup", "listbox");
        attr(button2, "aria-expanded", "false");
        attr(button2, "aria-disabled", button2_aria_disabled_value = ctx[3] || !ctx[1]);
        toggle_class(button2, "disabled", ctx[3] || !ctx[1]);
        attr(div3, "class", "btngroup");
        attr(button3, "type", "button");
        attr(button3, "class", "svelte-ds1x9b");
        attr(button4, "type", "button");
        attr(button4, "class", "svelte-ds1x9b");
        attr(button5, "type", "button");
        attr(button5, "class", "svelte-ds1x9b");
        attr(button6, "type", "button");
        attr(button6, "class", "svelte-ds1x9b");
        attr(menu, "class", "dropdown svelte-ds1x9b");
        toggle_class(menu, "is-active", ctx[0]);
        attr(div4, "class", "buttons right");
        attr(div5, "class", "footer");
      },
      m(target, anchor) {
        insert(target, div5, anchor);
        append(div5, div0);
        append(div5, t0);
        append(div5, div4);
        append(div4, button0);
        append(div4, t2);
        append(div4, div3);
        append(div3, button1);
        append(button1, div1);
        append(button1, t4);
        append(button1, div2);
        append(div3, t5);
        append(div3, button2);
        append(div4, t6);
        append(div4, menu);
        append(menu, li0);
        append(li0, button3);
        append(menu, t8);
        append(menu, li1);
        append(li1, button4);
        append(menu, t10);
        append(menu, li2);
        append(li2, button5);
        append(menu, t12);
        append(menu, li3);
        append(li3, button6);
        if (!mounted) {
          dispose = [
            listen(button0, "click", ctx[10]),
            listen(button1, "click", ctx[4]),
            listen(button2, "click", ctx[11]),
            listen(div3, "click", stop_propagation(ctx[9])),
            listen(button3, "click", stop_propagation(ctx[6])),
            listen(button4, "click", stop_propagation(ctx[5])),
            listen(button5, "click", stop_propagation(ctx[7])),
            listen(button6, "click", stop_propagation(ctx[8]))
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & 10 && button1_aria_disabled_value !== (button1_aria_disabled_value = ctx2[3] || !ctx2[1])) {
          attr(button1, "aria-disabled", button1_aria_disabled_value);
        }
        if (dirty & 10) {
          toggle_class(button1, "disabled", ctx2[3] || !ctx2[1]);
        }
        if (dirty & 10 && button2_aria_disabled_value !== (button2_aria_disabled_value = ctx2[3] || !ctx2[1])) {
          attr(button2, "aria-disabled", button2_aria_disabled_value);
        }
        if (dirty & 10) {
          toggle_class(button2, "disabled", ctx2[3] || !ctx2[1]);
        }
        if (dirty & 1) {
          toggle_class(menu, "is-active", ctx2[0]);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div5);
        }
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance$6($$self, $$props, $$invalidate) {
    let $insertion;
    let $isActive;
    let $isBusy;
    component_subscribe($$self, insertion, ($$value) => $$invalidate(1, $insertion = $$value));
    component_subscribe($$self, isActive, ($$value) => $$invalidate(2, $isActive = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(3, $isBusy = $$value));
    let { dropdownActive } = $$props;
    const redactor = getContext("redactor");
    function prepare(content) {
      content = redactor.cleaner.paragraphize(content);
      content = t(content);
      content = redactor.cleaner.input(content);
      return content;
    }
    function insert2() {
      if (!$insertion) {
        return;
      }
      redactor.insertion.insertHtml(prepare($insertion));
      set_store_value(isActive, $isActive = false, $isActive);
    }
    function append2() {
      if (!$insertion) {
        return;
      }
      redactor.insertion.set([redactor.api("source.getCode"), prepare($insertion)].join(`
`));
      set_store_value(isActive, $isActive = false, $isActive);
    }
    function prepend() {
      if (!$insertion) {
        return;
      }
      redactor.insertion.set([prepare($insertion), redactor.api("source.getCode")].join(`
`));
      set_store_value(isActive, $isActive = false, $isActive);
    }
    function replace() {
      if (!$insertion) {
        return;
      }
      redactor.insertion.set(prepare($insertion));
      set_store_value(isActive, $isActive = false, $isActive);
    }
    function clipboard() {
      if (!$insertion) {
        return;
      }
      document.addEventListener("copy", copy);
      document.execCommand("copy");
      document.removeEventListener("copy", copy);
      set_store_value(isActive, $isActive = false, $isActive);
    }
    function copy(event) {
      event.clipboardData.setData("text/html", prepare($insertion));
      event.clipboardData.setData("text/plain", prepare($insertion));
      event.preventDefault();
    }
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    const click_handler_1 = () => set_store_value(isActive, $isActive = false, $isActive);
    const click_handler_2 = () => $$invalidate(0, dropdownActive = true);
    $$self.$$set = ($$props2) => {
      if ("dropdownActive" in $$props2)
        $$invalidate(0, dropdownActive = $$props2.dropdownActive);
    };
    return [
      dropdownActive,
      $insertion,
      $isActive,
      $isBusy,
      insert2,
      append2,
      prepend,
      replace,
      clipboard,
      click_handler,
      click_handler_1,
      click_handler_2
    ];
  }
  class Footer extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$6, create_fragment$7, safe_not_equal, { dropdownActive: 0 }, add_css$2);
    }
  }
  function create_fragment$6(ctx) {
    let h3;
    let t1;
    let p0;
    let t19;
    let ol;
    return {
      c() {
        h3 = element("h3");
        h3.textContent = "Terms and Conditions of Service";
        t1 = space();
        p0 = element("p");
        p0.innerHTML = `These Terms and Conditions of Service (&quot;<strong>Agreement</strong>&quot;) are a binding agreement between you (&quot;<strong>you</strong>&quot; or &quot;<strong>your</strong>&quot;) and Mostly Serious, LLC (&quot;<strong>Company</strong>&quot; &quot;<strong>us</strong>&quot; &quot;<strong>our</strong>&quot; &quot;<strong>we</strong>&quot;) and governs your access and use of Promptly\u2122 (the &quot;<strong>Service</strong>&quot;). You means any individual or entity that uses our Services. If you are entering into this Agreement on behalf of another person or entity, then you represent and warrant that you are authorized to accept the terms of this Agreement on that person or entity\u2019s behalf, in which case, \u201Cyou\u201D or \u201Cyour\u201D shall refer to such entity or other person. BY ACCESSING AND USING OUR SERVICE YOU: (A) ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND THIS AGREEMENT; (B) REPRESENT THAT YOU ARE 18 YEARS OF AGE OR OLDER; AND (C) ACCEPT THIS AGREEMENT AND AGREE THAT YOU ARE LEGALLY BOUND BY ITS TERMS. IF YOU DO NOT AGREE TO THE TERMS OF THIS AGREEMENT, DO NOT ACCESS OR USE THE SERVICES. THESE TERMS INCLUDE a class action waiver, jury trial waiver, and binding arbitration provision to resolve disputes. Please review carefully.`;
        t19 = space();
        ol = element("ol");
        ol.innerHTML = `<li><p><u>Access and Use.</u> Subject to the terms of this Agreement, Company grants you a limited, non-exclusive, and nontransferable license to use the Services strictly in accordance with this Agreement. You acknowledge and agree that the Services are provided under license, and are not sold to you. Except for the limited license rights granted under this Agreement, you do not acquire any ownership interest in the Services under this Agreement, and all rights, title, and interests in the Services will remain with Company and its licensors and service providers, including all copyrights, trademarks, and other intellectual property rights therein or relating thereto. You acknowledge and agree that at times the Services may be inaccessible or inoperable for any reason whatsoever, including, without limitation: (a) equipment malfunctions; (b) periodic maintenance procedures or repairs which Company may undertake from time to time without notice to you; or (c) causes which are beyond the control of Company or which are not reasonably foreseeable. You alone are responsible for your activities and interaction with the Services and represent and warrant to, at all times, use the Services in compliance with applicable law.</p></li> <li><p><u>License Restrictions.</u> You shall not: (a) copy the Services, except as expressly permitted by this license; (b) modify, translate, adapt, or otherwise create derivative works or improvements, whether or not patentable, of the Services; (c) reverse engineer, disassemble, decompile, decode, or otherwise attempt to derive or gain access to the source code of the Services or any part thereof; (d) remove, delete, alter, or obscure any trademarks or any copyright, trademark, patent, or other intellectual property or proprietary rights notices from the Services, including any copy thereof; (e) rent, lease, lend, sell, sublicense, assign, distribute, publish, transfer, or otherwise make available the Services, or any features or functionality of the Services, to any third party for any reason; (f) remove, disable, circumvent, or otherwise create or implement any workaround to any copy protection, rights management, or security features in or protecting the Services; (g) use the Services to publish, post, upload, distribute or disseminate any inappropriate, profane, defamatory, obscene, indecent or unlawful topic, name, material or information; (h) upload files that contain viruses, Trojan horses, worms, time bombs, cancel bots, corrupted files, or any other similar software or programs that may damage the operation of a computer or property; (i) use the Services in any manner that could damage, disable, overburden, or impair the Company or its Technology Provider (as defined in Section 6) server, or interfere with any other party\u2019s use and enjoyment of the Services.</p></li> <li><p><u>Collection and Use of Your Information.</u> You may provide, create, or upload your information while using the Services or certain of its features or functionality, including but not be limited to text, information, photos, data, questions, comments, suggestions, or other content, including personally identifiable information (&quot;<strong>Your Information</strong>&quot;). You will retain ownership rights in Your Information and represent and warrant that Your Information is accurate, complete, up-to-date, and that you have the necessary licenses, rights, consents, and permissions to use and authorize Company to use Your Information in the manner contemplated by this Agreement. By submitting Your Information to Company, you grant Company and our affiliates a worldwide, royalty-free, sub-licenseable, and transferable license to host, store, cache, use, display, reproduce, modify, adapt, edit, publish, prepare derivative works of, analyze, transmit, distribute and otherwise commercial exploit all or any portion of Your Information for any purpose, including, but not limited to operating, developing, providing, promoting, and improving the Services. The license you grant Company under this Section also includes a right for Company to make Your Information available to and pass these rights along to Company\u2019s licensors and service providers with whom Company has a contractual relationship related to the provision of the Services for the purpose of providing the Services. To the extent you provide Company any feedback or suggestions regarding the Services, including, without limitation, new features or functionality related thereto, or any comments, questions, or suggestions, Company is free to use such feedback without any compensation or attribution to you. Further, Your Information is subject to the Company <a href="https://www.mostlyserious.io/privacy-policy" target="_blank">Privacy Policy</a> (the &quot;<strong>Privacy Policy</strong>&quot;). By providing Your Information to or through the Services, you consent to all actions taken by Company with respect to Your Information in compliance with the Privacy Policy.</p></li> <li><p><u>Geographic Restrictions.</u> The Services are intended to be used in the United States.  If you access the Services from outside the United States, you are responsible for compliance with all applicable laws to your jurisdiction.</p></li> <li><p><u>Updates.</u> Company may from time to time in its sole discretion develop and provide Service updates, which may include upgrades, bug fixes, patches, other error corrections, and/or new features (collectively, including related documentation, &quot;<strong>Updates</strong>&quot;). Updates may also modify or delete in their entirety certain features and functionality. You agree that Company has no obligation to provide any Updates or to continue to provide or enable any particular features or functionality. You shall promptly download and install all Updates and acknowledge and agree that the Services or portions thereof may not properly operate should you fail to do so. You further agree that all Updates will be deemed part of the Services and be subject to all terms and conditions of this Agreement.</p></li> <li><p><u>Additional Terms and Services.</u>  You knowledge and agree that Company uses or relies on technology provided by third party service provider to provide some portions of the Service, including but not limited to Pixel &amp; Tonic, Inc. and OpenAI, LLC (&quot;<strong>Technology Partners</strong>&quot;), and that the operation, availability, and use of the Services is contingent on such Technology Partners. By using the Service, you also agree to be bound by the Pixel &amp; Tonic Terms of Use and the OpenAI, L.L.C. terms of use (&quot;<strong>OpenAI</strong>&quot;), or any other Technology Provider terms linked to the Services, which shall be incorporated herein by reference. To the extent there is a conflict between the terms of this Agreement and the terms of the Technology Provider, the terms of this Agreement shall control for the Service and the terms of the Technology Provider terms shall control for the Technology Provider Services (as defined below). Furthermore, in order to receive the Services, you acknowledge and agree that you are required to open and maintain an account with OpenAI directly and pay any associated fees associated therewith, which are in addition to any service fees for the Services hereunder this Agreement.  You acknowledge and agree Company is not responsible for the failure to provide the Services, if such failure is a result of or arising out of your failure to maintain an OpenAI account or comply with the OpenAI terms of use, or the terms of use of any other Technology Provider. Further, Company shall have no liability for the services or materials provided by the Technology Providers, including their accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality, or any other aspect thereof (&quot;<strong>Technology Provider Services</strong>&quot;).</p></li> <li><p><u>Fees, Payments, Automatic Renewals.</u>  By using the Service, you agree to pay us the fees specified in the online plugin store using the payment information you provide. You authorize Craft to store your payment information and agree to update your payment information as may be necessary to ensure uninterrupted services (e.g. related to subscription renewals).  If your payment fails for any reason, we may immediately cancel or revoke your access to the Services without notice to you.  All Service fees are exclusive of any applicable federal, state, local or other governmental sales taxes (&quot;<strong>Taxes</strong>&quot;). You are responsible for paying all applicable Taxes related to the use of our Services. Your subscription to the Service begins on your date of purchase and you authorize us to automatically charge you the applicable renewal fees and taxes for each subscription period until you cancel your subscription. You may cancel your subscription at any time by contracting us, but not later than at least one month before the scheduled end date of your annual subscription to avoid automatic renewal. See Section 8 below for more information about termination of Services.  All fees paid for the Services are nonrefundable and payments are final. We do not offer refunds. We may change our fees at any time.  Any renewal of your subscription will be at our then-current pricing.  If you don\u2019t agree to the changes, you must cancel your Service.</p></li> <li><p><u>Termination.</u> Company may terminate your access to the Services by providing you at least one month notice before the expiration of your subscription. This termination will only affect your ability to receive updates to the Services, and unless you have violated another provision of this Agreement, you will continue to have access to the version of the Services that you originally purchased.  Company may terminate this Agreement and your access to the Services at any time without notice to you if you violate any of the terms and conditions of this Agreement. Upon termination: (a) all rights granted to you under this Agreement will also terminate, including, but not limited any license rights set forth in Section 1 of this Agreement; and (b) you must cease all use of the Services. Termination will not limit any of Company&#39;s rights or remedies at law or in equity and any provisions of this Agreement that by its terms has application to events following termination shall remain in full force and effect.</p></li> <li><p><u>General Disclaimers.</u> THE SERVICES ARE PROVIDED TO YOU &quot;AS IS&quot; AND WITH ALL FAULTS AND DEFECTS WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, COMPANY, ON ITS OWN BEHALF AND ON BEHALF OF ITS AFFILIATES AND ITS AND THEIR RESPECTIVE LICENSORS AND SERVICE PROVIDERS, EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, WITH RESPECT TO THE SERVICES, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT, AND WARRANTIES THAT MAY ARISE OUT OF COURSE OF DEALING, COURSE OF PERFORMANCE, USAGE, OR TRADE PRACTICE. WITHOUT LIMITATION TO THE FOREGOING, COMPANY PROVIDES NO WARRANTY OR UNDERTAKING, AND MAKES NO REPRESENTATION OF ANY KIND THAT THE SERVICE WILL MEET YOUR REQUIREMENTS, ACHIEVE ANY INTENDED RESULTS, BE COMPATIBLE, OR WORK WITH ANY OTHER SOFTWARE, APPLICATIONS, SYSTEMS, OR SERVICES, OPERATE WITHOUT INTERRUPTION, MEET ANY PERFORMANCE OR RELIABILITY STANDARDS, OR BE ERROR-FREE, OR THAT ANY ERRORS OR DEFECTS CAN OR WILL BE CORRECTED. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF OR LIMITATIONS ON IMPLIED WARRANTIES OR THE LIMITATIONS ON THE APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO SOME OR ALL OF THE ABOVE EXCLUSIONS AND LIMITATIONS MAY NOT APPLY TO YOU.</p></li> <li><p><u>Output Disclaimers.</u> You acknowledge and agree that any content created by openai in connection with the Services (&quot;<strong>Output</strong>&quot;) may not copyrightable under applicable law and use of the Output is at your sole risk and liability.  You understand that the Output may be inaccurate, and we make no representation or warranty as to the accuracy, completeness of the Output, including, but not limited to whether the Output has the necessary licenses, rights, consents, and permissions to use any information it obtained to create the Output.</p></li> <li><p><u>Limitation of Liability.</u> TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL COMPANY OR ITS AFFILIATES, OR ANY OF ITS OR THEIR RESPECTIVE LICENSORS OR SERVICE PROVIDERS, HAVE ANY LIABILITY ARISING FROM OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICES FOR (A) PERSONAL INJURY, PROPERTY DAMAGE, LOST PROFITS, COST OF SUBSTITUTE GOODS OR SERVICES, LOSS OF DATA, LOSS OF GOODWILL, BUSINESS INTERRUPTION, COMPUTER FAILURE OR MALFUNCTION, OR ANY OTHER CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL, OR PUNITIVE DAMAGES; OR (B) DIRECT DAMAGES IN AMOUNTS THAT IN THE AGGREGATE EXCEED THE AMOUNT ACTUALLY PAID BY YOU FOR THE SERVICES. THE FOREGOING LIMITATIONS WILL APPLY WHETHER SUCH DAMAGES ARISE OUT OF BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE AND REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE OR COMPANY WAS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS OF LIABILITY SO SOME OR ALL OF THE ABOVE LIMITATIONS OF LIABILITY MAY NOT APPLY TO YOU. THE MAXIMUM LIABILITY FOR THE COMPANY UNDER THIS AGREEMENT OR ANY ASSOCIATED OR RELATED CLAIMS SHALL BE LIMITED TO THE AMOUNTS YOU HAVE PAID THE COMPANY WITHIN THE PRIOR SIX (6) MONTHS OF WHEN YOUR CLAIM ACCRUED.</p></li> <li><p><u>Indemnification.</u> You agree to indemnify, defend, and hold harmless Company and its officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all losses, damages, liabilities, deficiencies, claims, actions, judgments, settlements, interest, awards, penalties, fines, costs, or expenses of whatever kind, including attorneys&#39; fees, arising from or relating to: (a) your use or misuse of the Services; (b) your breach of this Agreement; (c) use of Your Information, including infringement claims, or any data or results derived therefrom in your use of the Services; (d) your breach of any Technology Provider terms and conditions; and (e) your use of the Outputs.</p></li> <li><p><u>Export Regulation.</u> The Services may be subject to United States export control laws, including the Export Control Reform Act and its associated regulations. You shall not, directly or indirectly, export, re-export, or release the Services to, or make the Services accessible from, any jurisdiction or country to which export, re-export, or release is prohibited by law, rule, or regulation. You shall comply with all applicable federal laws, regulations, and rules, and complete all required undertakings (including obtaining any necessary export license or other governmental approval), prior to exporting, re-exporting, releasing, or otherwise making the Service available outside the United States.</p></li> <li><p><u>Severability.</u> If any provision of this Agreement is illegal or unenforceable under applicable law, the remainder of the provision will be amended to achieve as closely as possible the effect of the original term and all other provisions of this Agreement will continue in full force and effect.</p></li> <li><p><u>Dispute Resolution Procedures.</u> If you believe we have breached this Agreement or our provision of the Services to you, you agree that as a material provision of this Agreement that you will provide us with a detailed written notice of any claimed deficiencies and at least thirty (30) days to cure such alleged deficiency prior to commencing any arbitration proceeding against us as set forth below. If the Company takes steps to fix the issue, but the fix cannot be completed within the thirty (30) day time period, then the Company shall continue to have the opportunity to fix the issue without you bringing a legal claim so long as the Company uses commercially reasonable means without undue delay to resolve the issue.  During the aforementioned cure periods, any applicable statute of limitations period will be automatically tolled.  If the Company provides written notice to you that it is waiving this Section or otherwise is not pursuing a resolution to your proposed claims, the tolling period shall automatically cease within three (3) days of such notice being provided to you. Should you violate this provision and fail to give us such notice, it shall constitute a material breach of this Agreement and entitle us to all of our attorneys\u2019 fees, court costs, and any related expenses associated with enforcing our right to the thirty (30) day cure period.  This provision specifically applies to any and all claims under local, state or federal law, and specifically includes claims related to the American with Disabilities Act.</p></li> <li><p><u>Governing Law and Binding Arbitration.</u> This Agreement is governed by and construed in accordance with the internal laws of the State of Missouri without giving effect to any choice or conflict of law provision or rule. You agree that any claim, dispute, action or litigation based hereon, relating to or arising out of this Agreement, or the Services shall be brought and maintained exclusively via arbitration (except for injunctive relief). Any party seeking to pursue an action to arbitrate shall give written notice to the other party of such election that summarizes in sufficient detail the basis of the dispute at least ten (10) days before bringing an arbitration action. The dispute shall be submitted for arbitration with JAMS in accordance with its Comprehensive Arbitration Rules and Procedures. Such arbitration shall be conducted, unless otherwise agreed by the parties, by a single arbitrator, who shall be a former judge, in Springfield, Missouri. The award of the arbitrator may be confirmed or enforced in any court of competent jurisdiction. The prevailing party in any arbitration shall be entitled to recover all costs incurred by such party in connection with the proceeding, including reasonable attorneys\u2019 fees.  If injunctive relief is needed, the parties agree to exclusively utilize the courts with jurisdiction in Springfield, Missouri. You expressly waive any objection of venue and jurisdiction, including but not limited to arguments that such litigation any action has been brought in an inconvenient forum.</p></li> <li><p><u>Limitation of Time to File Claims.</u> WE WISH TO TIMELY RESOLVE ANY DISPUTES THAT YOU MAY HAVE WITH US.  ACCORDINGLY, ANY CAUSE OF ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR RELATING TO THIS AGREEMENT OR THE SERIVCES MUST BE COMMENCED WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES OTHERWISE SUCH CAUSE OF ACTION OR CLAIM IS PERMANENTLY BARRED.</p></li> <li><p><u>Waiver of Jury Trial and Class Action.</u> EACH OF THE PARTIES HERETO HEREBY WAIVES ANY RIGHT TO A TRIAL BY JURY IN ANY ACTION OR PROCEEDING TO ENFORCE OR DEFEND ANY RIGHTS UNDER THIS AGREEMENT. FURTHER, EACH OF THE PARTIES HERETO HEREBY WAIVES ANY RIGHT TO PARTICIPATE IN A CLASS ACTION AND INSTEAD, AGREES THAT ANY AND ALL DISPUTES SHALL BE RESOLVED ON AN INDIVIDUAL BASIS.</p></li> <li><p><u>Waiver.</u> No failure to exercise, and no delay in exercising, on the part of either party, any right or any power hereunder shall operate as a waiver thereof, nor shall any single or partial exercise of any right or power hereunder preclude further exercise of that or any other right hereunder. In the event of a conflict between this Agreement and any applicable purchase or other terms, the terms of this Agreement shall govern.</p></li> <li><p><u>Successors and Assigns.</u> You may not assign any of your rights or delegate any of your duties under this Agreement or the Privacy Policy without Company\u2019s prior written consent. Except as otherwise expressly provided herein, this Agreement shall bind and inure to the benefit of the successors, assigns, heirs, executors and administrators of the parties hereto.</p></li> <li><p><u>Changes to this Agreement.</u> From time to time, Company may, in its sole discretion, change, modify, supplement or remove portions of this Agreement. Such changes shall become effective upon the posting of the revised Agreement or upon sending you an email or other notification. You will be deemed to have agreed to such change by continuing to use the Services following the date in which such changes become effective.</p></li> <li><p><u>Entire Agreement.</u> This Agreement and our Privacy Policy constitute the entire agreement between you and Company with respect to the Services and supersede all prior or contemporaneous understandings and agreements, whether written or oral, with respect to the Services.</p></li>`;
      },
      m(target, anchor) {
        insert(target, h3, anchor);
        insert(target, t1, anchor);
        insert(target, p0, anchor);
        insert(target, t19, anchor);
        insert(target, ol, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(h3);
          detach(t1);
          detach(p0);
          detach(t19);
          detach(ol);
        }
      }
    };
  }
  class Panel$1 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$6, safe_not_equal, {});
    }
  }
  function create_else_block$2(ctx) {
    let p;
    let t1;
    let button;
    let mounted;
    let dispose;
    return {
      c() {
        p = element("p");
        p.textContent = "Please read all terms of use and accept below.";
        t1 = space();
        button = element("button");
        button.textContent = "Accept Terms";
        attr(button, "class", "btn submit");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        insert(target, t1, anchor);
        insert(target, button, anchor);
        if (!mounted) {
          dispose = listen(button, "click", ctx[1]);
          mounted = true;
        }
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(p);
          detach(t1);
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block$3(ctx) {
    let loading;
    let current;
    loading = new Loading({});
    return {
      c() {
        create_component(loading.$$.fragment);
      },
      m(target, anchor) {
        mount_component(loading, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(loading.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(loading.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(loading, detaching);
      }
    };
  }
  function create_fragment$5(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block$3, create_else_block$2];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (ctx2[0])
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function instance$5($$self, $$props, $$invalidate) {
    let $hasAccess;
    let $isBusy;
    component_subscribe($$self, hasAccess, ($$value) => $$invalidate(2, $hasAccess = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(0, $isBusy = $$value));
    function acceptTerms() {
      set_store_value(isBusy, $isBusy = true, $isBusy);
      const args = {
        body: new URLSearchParams({
          [Craft.csrfTokenName]: Craft.csrfTokenValue
        }),
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow"
      };
      fetch("/admin/actions/promptly/access", args).then((res) => res.json()).then((res) => {
        set_store_value(isBusy, $isBusy = false, $isBusy);
        set_store_value(hasAccess, $hasAccess = res.access, $hasAccess);
      });
    }
    return [$isBusy, acceptTerms];
  }
  class Actions extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$5, create_fragment$5, safe_not_equal, {});
    }
  }
  function create_else_block$1(ctx) {
    let switch_instance;
    let switch_instance_anchor;
    let current;
    var switch_value = Base;
    function switch_props(ctx2) {
      return { props: { label: "", Actions, Panel: Panel$1 } };
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props());
    }
    return {
      c() {
        if (switch_instance)
          create_component(switch_instance.$$.fragment);
        switch_instance_anchor = empty();
      },
      m(target, anchor) {
        if (switch_instance)
          mount_component(switch_instance, target, anchor);
        insert(target, switch_instance_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (switch_value !== (switch_value = Base)) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props());
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
          } else {
            switch_instance = null;
          }
        }
      },
      i(local) {
        if (current)
          return;
        if (switch_instance)
          transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o(local) {
        if (switch_instance)
          transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(switch_instance_anchor);
        }
        if (switch_instance)
          destroy_component(switch_instance, detaching);
      }
    };
  }
  function create_if_block$2(ctx) {
    let current;
    const default_slot_template = ctx[2].default;
    const default_slot = create_slot(default_slot_template, ctx, ctx[1], null);
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & 2)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              ctx2[1],
              !current ? get_all_dirty_from_scope(ctx2[1]) : get_slot_changes(default_slot_template, ctx2[1], dirty, null),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment$4(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block$2, create_else_block$1];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (ctx2[0])
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function instance$4($$self, $$props, $$invalidate) {
    let $hasAccess;
    let $isBusy;
    let $active;
    component_subscribe($$self, hasAccess, ($$value) => $$invalidate(0, $hasAccess = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(3, $isBusy = $$value));
    component_subscribe($$self, active, ($$value) => $$invalidate(4, $active = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    set_store_value(active, $active = true, $active);
    if (!$hasAccess) {
      set_store_value(isBusy, $isBusy = true, $isBusy);
      fetch("/admin/actions/promptly/access").then((res) => res.json()).then((res) => {
        set_store_value(isBusy, $isBusy = false, $isBusy);
        set_store_value(hasAccess, $hasAccess = res.access, $hasAccess);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("$$scope" in $$props2)
        $$invalidate(1, $$scope = $$props2.$$scope);
    };
    return [$hasAccess, $$scope, slots];
  }
  class Access extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$4, create_fragment$4, safe_not_equal, {});
    }
  }
  function add_css$1(target) {
    append_styles(target, "svelte-12lxku8", ".heading.svelte-12lxku8.svelte-12lxku8{font-size:1.125rem;line-height:1.55;font-weight:300;--tw-text-opacity:1;color:rgb(100 116 139 / var(--tw-text-opacity))\n}@media(min-width: 1024px){.heading.svelte-12lxku8.svelte-12lxku8{display:none\n    }}.select.svelte-12lxku8.svelte-12lxku8{flex-grow:1\n}.select.svelte-12lxku8 select.svelte-12lxku8{width:100%\n}.select-wrapper.svelte-12lxku8.svelte-12lxku8{margin-top:1rem;display:flex;align-items:center;gap:1.5rem\n}.promptly-answer.svelte-12lxku8.svelte-12lxku8{margin-bottom:1.5rem;border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(34 197 95 / var(--tw-bg-opacity));padding-left:1.5rem;padding-right:1.5rem;padding-top:0.75rem;padding-bottom:0.75rem;--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}.promptly-answer.svelte-12lxku8 p{margin:0px\n}");
  }
  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[8] = list[i];
    return child_ctx;
  }
  function create_else_block_1(ctx) {
    let t2;
    let preview;
    let current;
    let if_block = ctx[3].heading && create_if_block_4(ctx);
    preview = new Preview({
      props: {
        $$slots: { default: [create_default_slot_2$1] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        if (if_block)
          if_block.c();
        t2 = space();
        create_component(preview.$$.fragment);
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t2, anchor);
        mount_component(preview, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (ctx2[3].heading) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_4(ctx2);
            if_block.c();
            if_block.m(t2.parentNode, t2);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        const preview_changes = {};
        if (dirty & 2048) {
          preview_changes.$$scope = { dirty, ctx: ctx2 };
        }
        preview.$set(preview_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(preview.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(preview.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
        }
        if (if_block)
          if_block.d(detaching);
        destroy_component(preview, detaching);
      }
    };
  }
  function create_if_block_3(ctx) {
    let preview;
    let t2;
    let div;
    let answer_1;
    let current;
    preview = new Preview({});
    answer_1 = new Answer({ props: { content: ctx[2] } });
    return {
      c() {
        create_component(preview.$$.fragment);
        t2 = space();
        div = element("div");
        create_component(answer_1.$$.fragment);
        attr(div, "class", "promptly-answer svelte-12lxku8");
      },
      m(target, anchor) {
        mount_component(preview, target, anchor);
        insert(target, t2, anchor);
        insert(target, div, anchor);
        mount_component(answer_1, div, null);
        current = true;
      },
      p(ctx2, dirty) {
        const answer_1_changes = {};
        if (dirty & 4)
          answer_1_changes.content = ctx2[2];
        answer_1.$set(answer_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(preview.$$.fragment, local);
        transition_in(answer_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(preview.$$.fragment, local);
        transition_out(answer_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
          detach(div);
        }
        destroy_component(preview, detaching);
        destroy_component(answer_1);
      }
    };
  }
  function create_if_block_4(ctx) {
    let p;
    let t_value = ctx[3].heading + "";
    let t2;
    return {
      c() {
        p = element("p");
        t2 = text(t_value);
        attr(p, "class", "heading svelte-12lxku8");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t2);
      },
      p(ctx2, dirty) {
        if (dirty & 8 && t_value !== (t_value = ctx2[3].heading + ""))
          set_data(t2, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_default_slot_2$1(ctx) {
    let p;
    return {
      c() {
        p = element("p");
        p.textContent = "Block content is empty. Please provide content to edit first.";
      },
      m(target, anchor) {
        insert(target, p, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_if_block_1$1(ctx) {
    let errors2;
    let t2;
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    errors2 = new Errors({});
    const if_block_creators = [create_if_block_2, create_else_block];
    const if_blocks = [];
    function select_block_type_2(ctx2, dirty) {
      if (ctx2[3].options.length)
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type_2(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        create_component(errors2.$$.fragment);
        t2 = space();
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        mount_component(errors2, target, anchor);
        insert(target, t2, anchor);
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_2(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(errors2.$$.fragment, local);
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(errors2.$$.fragment, local);
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
          detach(if_block_anchor);
        }
        destroy_component(errors2, detaching);
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function create_if_block$1(ctx) {
    let loading;
    let current;
    loading = new Loading({});
    return {
      c() {
        create_component(loading.$$.fragment);
      },
      m(target, anchor) {
        mount_component(loading, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(loading.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(loading.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(loading, detaching);
      }
    };
  }
  function create_else_block(ctx) {
    let generate;
    let current;
    generate = new Generate({
      props: {
        prompt: ctx[1],
        $$slots: { default: [create_default_slot_1$1] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(generate.$$.fragment);
      },
      m(target, anchor) {
        mount_component(generate, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const generate_changes = {};
        if (dirty & 2)
          generate_changes.prompt = ctx2[1];
        if (dirty & 2048) {
          generate_changes.$$scope = { dirty, ctx: ctx2 };
        }
        generate.$set(generate_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(generate.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(generate.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(generate, detaching);
      }
    };
  }
  function create_if_block_2(ctx) {
    let div1;
    let div0;
    let select;
    let option_1;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let t1;
    let generate;
    let current;
    let mounted;
    let dispose;
    let each_value = ensure_array_like(ctx[3].options);
    const get_key = (ctx2) => ctx2[8].label;
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context$1(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    }
    generate = new Generate({
      props: {
        prompt: ctx[1],
        disabled: !ctx[0],
        $$slots: { default: [create_default_slot$1] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        select = element("select");
        option_1 = element("option");
        option_1.textContent = "-- Select One ---";
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t1 = space();
        create_component(generate.$$.fragment);
        option_1.__value = "";
        set_input_value(option_1, option_1.__value);
        attr(select, "class", "svelte-12lxku8");
        if (ctx[0] === void 0)
          add_render_callback(() => ctx[6].call(select));
        attr(div0, "class", "select svelte-12lxku8");
        attr(div1, "class", "select-wrapper svelte-12lxku8");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        append(div0, select);
        append(select, option_1);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(select, null);
          }
        }
        select_option(select, ctx[0], true);
        append(div1, t1);
        mount_component(generate, div1, null);
        current = true;
        if (!mounted) {
          dispose = listen(select, "change", ctx[6]);
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 8) {
          each_value = ensure_array_like(ctx2[3].options);
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, select, destroy_block, create_each_block$1, null, get_each_context$1);
        }
        if (dirty & 9) {
          select_option(select, ctx2[0]);
        }
        const generate_changes = {};
        if (dirty & 2)
          generate_changes.prompt = ctx2[1];
        if (dirty & 1)
          generate_changes.disabled = !ctx2[0];
        if (dirty & 2056) {
          generate_changes.$$scope = { dirty, ctx: ctx2 };
        }
        generate.$set(generate_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(generate.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(generate.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
        destroy_component(generate);
        mounted = false;
        dispose();
      }
    };
  }
  function create_default_slot_1$1(ctx) {
    let t2;
    return {
      c() {
        t2 = text("Generate Correction");
      },
      m(target, anchor) {
        insert(target, t2, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
        }
      }
    };
  }
  function create_each_block$1(key_1, ctx) {
    let option_1;
    let t0_value = ctx[8].label + "";
    let t0;
    let t1;
    let option_1_value_value;
    return {
      key: key_1,
      first: null,
      c() {
        option_1 = element("option");
        t0 = text(t0_value);
        t1 = space();
        option_1.__value = option_1_value_value = ctx[8].prompt;
        set_input_value(option_1, option_1.__value);
        this.first = option_1;
      },
      m(target, anchor) {
        insert(target, option_1, anchor);
        append(option_1, t0);
        append(option_1, t1);
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & 8 && t0_value !== (t0_value = ctx[8].label + ""))
          set_data(t0, t0_value);
        if (dirty & 8 && option_1_value_value !== (option_1_value_value = ctx[8].prompt)) {
          option_1.__value = option_1_value_value;
          set_input_value(option_1, option_1.__value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(option_1);
        }
      }
    };
  }
  function create_default_slot$1(ctx) {
    let t_value = ctx[3].action + "";
    let t2;
    return {
      c() {
        t2 = text(t_value);
      },
      m(target, anchor) {
        insert(target, t2, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & 8 && t_value !== (t_value = ctx2[3].action + ""))
          set_data(t2, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
        }
      }
    };
  }
  function create_fragment$3(ctx) {
    let current_block_type_index;
    let if_block0;
    let t2;
    let current_block_type_index_1;
    let if_block1;
    let if_block1_anchor;
    let current;
    const if_block_creators = [create_if_block_3, create_else_block_1];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (ctx2[2])
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const if_block_creators_1 = [create_if_block$1, create_if_block_1$1];
    const if_blocks_1 = [];
    function select_block_type_1(ctx2, dirty) {
      if (ctx2[4])
        return 0;
      if (ctx2[5])
        return 1;
      return -1;
    }
    if (~(current_block_type_index_1 = select_block_type_1(ctx))) {
      if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    }
    return {
      c() {
        if_block0.c();
        t2 = space();
        if (if_block1)
          if_block1.c();
        if_block1_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, t2, anchor);
        if (~current_block_type_index_1) {
          if_blocks_1[current_block_type_index_1].m(target, anchor);
        }
        insert(target, if_block1_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(t2.parentNode, t2);
        }
        let previous_block_index_1 = current_block_type_index_1;
        current_block_type_index_1 = select_block_type_1(ctx2);
        if (current_block_type_index_1 === previous_block_index_1) {
          if (~current_block_type_index_1) {
            if_blocks_1[current_block_type_index_1].p(ctx2, dirty);
          }
        } else {
          if (if_block1) {
            group_outros();
            transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
              if_blocks_1[previous_block_index_1] = null;
            });
            check_outros();
          }
          if (~current_block_type_index_1) {
            if_block1 = if_blocks_1[current_block_type_index_1];
            if (!if_block1) {
              if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx2);
              if_block1.c();
            } else {
              if_block1.p(ctx2, dirty);
            }
            transition_in(if_block1, 1);
            if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
          } else {
            if_block1 = null;
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t2);
          detach(if_block1_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
        if (~current_block_type_index_1) {
          if_blocks_1[current_block_type_index_1].d(detaching);
        }
      }
    };
  }
  function instance$3($$self, $$props, $$invalidate) {
    let $answer;
    let $active;
    let $isBusy;
    let $hasContent;
    component_subscribe($$self, answer, ($$value) => $$invalidate(2, $answer = $$value));
    component_subscribe($$self, active, ($$value) => $$invalidate(3, $active = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(4, $isBusy = $$value));
    component_subscribe($$self, hasContent, ($$value) => $$invalidate(5, $hasContent = $$value));
    let { prompt } = $$props;
    let { selection } = $$props;
    function setPrompt() {
      $$invalidate(1, prompt = selection);
    }
    function select_change_handler() {
      selection = select_value(this);
      $$invalidate(0, selection);
    }
    $$self.$$set = ($$props2) => {
      if ("prompt" in $$props2)
        $$invalidate(1, prompt = $$props2.prompt);
      if ("selection" in $$props2)
        $$invalidate(0, selection = $$props2.selection);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 1) {
        setPrompt();
      }
      if ($$self.$$.dirty & 4) {
        insertion.set($answer);
      }
    };
    return [
      selection,
      prompt,
      $answer,
      $active,
      $isBusy,
      $hasContent,
      select_change_handler
    ];
  }
  class Panel extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$3, create_fragment$3, safe_not_equal, { prompt: 1, selection: 0 }, add_css$1);
    }
  }
  function create_fragment$2(ctx) {
    let actions_1;
    let current;
    actions_1 = new Actions$1({ props: { actions: ctx[0] } });
    return {
      c() {
        create_component(actions_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(actions_1, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(actions_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(actions_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(actions_1, detaching);
      }
    };
  }
  function instance$2($$self) {
    const actions2 = [
      {
        label: "Correct Spelling & Grammar",
        handle: "spellingGrammar",
        description: "Ensure clean writing by checking and correcting spelling and grammar.",
        prompt: "Return this content with all spelling, punctuation, capitalization, and grammer mistakes corrected.",
        heading: "Ensure clean writing by checking and correcting spelling and grammar.",
        options: []
      },
      {
        label: "Adjust Length",
        handle: "length",
        description: "Customize the length of your writing to suit your needs.",
        prompt: "",
        heading: "Customize the length of your writing to suit your needs.",
        action: "Adjust",
        options: [
          {
            label: "Shorter",
            prompt: "Please make this content shorter while retaining the same overall meaning."
          },
          {
            label: "Longer",
            prompt: "Please expand on this content to make it longer while retaining the same overall meaning."
          }
        ]
      },
      {
        label: "Translate Language",
        handle: "translate",
        description: "Convert your content into 14 different languages.",
        prompt: "",
        heading: "Convert your content into 14 different languages.",
        action: "Translate",
        options: [
          {
            label: "English",
            prompt: "Translate this content into English."
          },
          {
            label: "Korean",
            prompt: "Translate this content into Korean."
          },
          {
            label: "Chinese",
            prompt: "Translate this content into Chinese."
          },
          {
            label: "Japanese",
            prompt: "Translate this content into Japanese."
          },
          {
            label: "Spanish",
            prompt: "Translate this content into Spanish."
          },
          {
            label: "Russian",
            prompt: "Translate this content into Russian."
          },
          {
            label: "French",
            prompt: "Translate this content into French."
          },
          {
            label: "Portuguese",
            prompt: "Translate this content into Portuguese."
          },
          {
            label: "German",
            prompt: "Translate this content into German."
          },
          {
            label: "Italian",
            prompt: "Translate this content into Italian."
          },
          {
            label: "Dutch",
            prompt: "Translate this content into Dutch."
          },
          {
            label: "Indonesian",
            prompt: "Translate this content into Indonesian."
          },
          {
            label: "Filipino",
            prompt: "Translate this content into Filipino."
          },
          {
            label: "Vietnamese",
            prompt: "Translate this content into Vietnamese."
          }
        ]
      },
      {
        label: "Change Tone",
        handle: "tone",
        description: "Alter your writing style with 11 different tone options.",
        prompt: "",
        heading: "Alter your writing style with 11 different tone options.",
        action: "Change",
        options: [
          {
            label: "Formal",
            prompt: "Please rewrite this content to employ a formal tone suitable for a brand's voice, characterized by proper grammar, absence of contractions, and a respectful, polite manner."
          },
          {
            label: "Informal",
            prompt: "Please rewrite this content to adopt an informal tone suitable for a brand's voice, exhibiting a more casual, conversational style that employs contractions and colloquial expressions."
          },
          {
            label: "Persuasive",
            prompt: "Please rewrite this content to incorporate a persuasive tone suitable for a brand's voice, aiming to convince or influence the reader by integrating strong arguments, factual information, and emotional appeals."
          },
          {
            label: "Friendly",
            prompt: "Please rewrite this content to imbue a friendly tone suitable for a brand's voice. It should be warm, welcoming, use positive language, and have a conversational style, without resorting to overly casual or personal introductions."
          },
          {
            label: "Authoritative",
            prompt: "Please rewrite this content to reflect an authoritative tone suitable for a brand's voice, conveying a sense of expertise and confidence through clear, concise language and factual information."
          },
          {
            label: "Humorous",
            prompt: "Please rewrite this content to adopt a humorous tone suitable for a brand's voice, aiming to entertain and amuse the reader through the use of wordplay, puns, and jokes."
          },
          {
            label: "Inspirational",
            prompt: "Please rewrite this content to express an inspirational tone suitable for a brand's voice, aiming to motivate and uplift the reader by incorporating vivid imagery, anecdotes, and emotive language."
          },
          {
            label: "Empathetic",
            prompt: "Please rewrite this content to reflect an empathetic tone suitable for a brand's voice, aiming to create a sense of understanding, compassion, and solidarity with the reader."
          },
          {
            label: "Engaging",
            prompt: "Please rewrite this content to incorporate an engaging tone suitable for a brand's voice, seeking to captivate the reader's attention and encourage their active involvement."
          },
          {
            label: "Witty",
            prompt: "Please rewrite this content to adopt a witty tone suitable for a brand's voice, aiming to entertain the reader through clever humor and quick thinking."
          },
          {
            label: "Direct",
            prompt: "Please rewrite this content to express a direct tone suitable for a brand's voice, focusing on clear, straightforward, and concise language."
          }
        ]
      }
    ];
    return [actions2];
  }
  class Actions_1 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
    }
  }
  function create_fragment$1(ctx) {
    let switch_instance;
    let switch_instance_anchor;
    let current;
    var switch_value = Base;
    function switch_props(ctx2) {
      return {
        props: { label: ctx2[0], Actions: Actions_1, Panel }
      };
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    }
    return {
      c() {
        if (switch_instance)
          create_component(switch_instance.$$.fragment);
        switch_instance_anchor = empty();
      },
      m(target, anchor) {
        if (switch_instance)
          mount_component(switch_instance, target, anchor);
        insert(target, switch_instance_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const switch_instance_changes = {};
        if (dirty & 1)
          switch_instance_changes.label = ctx2[0];
        if (switch_value !== (switch_value = Base)) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
          } else {
            switch_instance = null;
          }
        } else if (switch_value) {
          switch_instance.$set(switch_instance_changes);
        }
      },
      i(local) {
        if (current)
          return;
        if (switch_instance)
          transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o(local) {
        if (switch_instance)
          transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(switch_instance_anchor);
        }
        if (switch_instance)
          destroy_component(switch_instance, detaching);
      }
    };
  }
  function instance$1($$self, $$props, $$invalidate) {
    let { label } = $$props;
    $$self.$$set = ($$props2) => {
      if ("label" in $$props2)
        $$invalidate(0, label = $$props2.label);
    };
    return [label];
  }
  class Edit extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$1, safe_not_equal, { label: 0 });
    }
  }
  function add_css(target) {
    append_styles(target, "svelte-1izdqgs", "hr.svelte-1izdqgs{margin-top:0.5rem;margin-bottom:0.5rem\n}.modal-bg.svelte-1izdqgs{position:fixed;inset:0px;z-index:100;display:block;height:100%;width:100%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));background-color:rgb(123 135 147 / 0.35)\n}.modal.svelte-1izdqgs{position:fixed;top:50%;left:50%;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));width:calc(100dvw - 1.5rem) !important;max-width:1150px !important;height:70dvh !important\n}@media not all and (min-width: 768px){.modal.svelte-1izdqgs{min-width:0px !important\n        }}@media(min-width: 768px){.modal.svelte-1izdqgs{width:80dvw !important\n        }}@media not all and (min-width: 768px){.body.svelte-1izdqgs{overflow-x:auto\n        }}.content.svelte-1izdqgs{min-width:600px\n}.sidebar-inner.svelte-1izdqgs{display:grid;align-content:flex-start;gap:0.5rem;padding-left:0.75rem;padding-right:0.75rem\n}.no-access.svelte-1izdqgs{pointer-events:none;opacity:0.5\n}");
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[15] = list[i];
    return child_ctx;
  }
  function create_if_block(ctx) {
    let div0;
    let div0_transition;
    let t0;
    let div5;
    let h1;
    let t2;
    let div4;
    let div3;
    let div2;
    let div1;
    let sidebaritem;
    let t3;
    let hr;
    let t4;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let t5;
    let t6;
    let footer;
    let updating_dropdownActive;
    let div5_intro;
    let div5_outro;
    let current;
    let mounted;
    let dispose;
    sidebaritem = new SidebarItem({
      props: {
        action: customPrompt,
        $$slots: { default: [create_default_slot_2] },
        $$scope: { ctx }
      }
    });
    let each_value = ensure_array_like(categories);
    const get_key = (ctx2) => ctx2[15].handle;
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    }
    let if_block = ctx[2] && create_if_block_1(ctx);
    function footer_dropdownActive_binding(value) {
      ctx[8](value);
    }
    let footer_props = {};
    if (ctx[3] !== void 0) {
      footer_props.dropdownActive = ctx[3];
    }
    footer = new Footer({ props: footer_props });
    binding_callbacks.push(() => bind(footer, "dropdownActive", footer_dropdownActive_binding));
    return {
      c() {
        div0 = element("div");
        div0.innerHTML = ``;
        t0 = space();
        div5 = element("div");
        h1 = element("h1");
        h1.textContent = "Promptly";
        t2 = space();
        div4 = element("div");
        div3 = element("div");
        div2 = element("div");
        div1 = element("div");
        create_component(sidebaritem.$$.fragment);
        t3 = space();
        hr = element("hr");
        t4 = space();
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t5 = space();
        if (if_block)
          if_block.c();
        t6 = space();
        create_component(footer.$$.fragment);
        attr(div0, "class", "modal-bg garnish-js-aria svelte-1izdqgs");
        attr(div0, "aria-hidden", "true");
        attr(h1, "id", "modal-promptly-heading");
        attr(h1, "class", "visually-hidden");
        attr(hr, "class", "svelte-1izdqgs");
        attr(div1, "class", "sidebar-inner svelte-1izdqgs");
        attr(div2, "class", "sidebar svelte-1izdqgs");
        toggle_class(div2, "no-access", !ctx[5]);
        attr(div3, "class", "content svelte-1izdqgs");
        toggle_class(div3, "has-sidebar", ctx[4].isLg);
        attr(div4, "class", "body has-sidebar svelte-1izdqgs");
        attr(div5, "class", "modal elementselectormodal svelte-1izdqgs");
        attr(div5, "aria-labelledby", "modal-promptly-heading");
        attr(div5, "aria-modal", "true");
        attr(div5, "role", "dialog");
      },
      m(target, anchor) {
        insert(target, div0, anchor);
        insert(target, t0, anchor);
        insert(target, div5, anchor);
        append(div5, h1);
        append(div5, t2);
        append(div5, div4);
        append(div4, div3);
        append(div3, div2);
        append(div2, div1);
        mount_component(sidebaritem, div1, null);
        append(div1, t3);
        append(div1, hr);
        append(div1, t4);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div1, null);
          }
        }
        append(div3, t5);
        if (if_block)
          if_block.m(div3, null);
        append(div5, t6);
        mount_component(footer, div5, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(div0, "click", ctx[7]),
            listen(div5, "click", ctx[9])
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        const sidebaritem_changes = {};
        if (dirty & 262144) {
          sidebaritem_changes.$$scope = { dirty, ctx: ctx2 };
        }
        sidebaritem.$set(sidebaritem_changes);
        if (dirty & 0) {
          each_value = ensure_array_like(categories);
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div1, outro_and_destroy_block, create_each_block, null, get_each_context);
          check_outros();
        }
        if (!current || dirty & 32) {
          toggle_class(div2, "no-access", !ctx2[5]);
        }
        if (ctx2[2]) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & 4) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block_1(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(div3, null);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        if (!current || dirty & 16) {
          toggle_class(div3, "has-sidebar", ctx2[4].isLg);
        }
        const footer_changes = {};
        if (!updating_dropdownActive && dirty & 8) {
          updating_dropdownActive = true;
          footer_changes.dropdownActive = ctx2[3];
          add_flush_callback(() => updating_dropdownActive = false);
        }
        footer.$set(footer_changes);
      },
      i(local) {
        if (current)
          return;
        if (local) {
          add_render_callback(() => {
            if (!current)
              return;
            if (!div0_transition)
              div0_transition = create_bidirectional_transition(div0, fade, { duration: 200 }, true);
            div0_transition.run(1);
          });
        }
        transition_in(sidebaritem.$$.fragment, local);
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        transition_in(if_block);
        transition_in(footer.$$.fragment, local);
        if (local) {
          add_render_callback(() => {
            if (!current)
              return;
            if (div5_outro)
              div5_outro.end(1);
            div5_intro = create_in_transition(div5, fade, { duration: 200, delay: 100 });
            div5_intro.start();
          });
        }
        current = true;
      },
      o(local) {
        if (local) {
          if (!div0_transition)
            div0_transition = create_bidirectional_transition(div0, fade, { duration: 200 }, false);
          div0_transition.run(0);
        }
        transition_out(sidebaritem.$$.fragment, local);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        transition_out(if_block);
        transition_out(footer.$$.fragment, local);
        if (div5_intro)
          div5_intro.invalidate();
        if (local) {
          div5_outro = create_out_transition(div5, fade, { duration: 200 });
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div0);
          detach(t0);
          detach(div5);
        }
        if (detaching && div0_transition)
          div0_transition.end();
        destroy_component(sidebaritem);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
        if (if_block)
          if_block.d();
        destroy_component(footer);
        if (detaching && div5_outro)
          div5_outro.end();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_default_slot_2(ctx) {
    let t_value = customPrompt.label + "";
    let t2;
    return {
      c() {
        t2 = text(t_value);
      },
      m(target, anchor) {
        insert(target, t2, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(t2);
        }
      }
    };
  }
  function create_default_slot_1(ctx) {
    let t0_value = ctx[15].label + "";
    let t0;
    let t1;
    return {
      c() {
        t0 = text(t0_value);
        t1 = space();
      },
      m(target, anchor) {
        insert(target, t0, anchor);
        insert(target, t1, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(t1);
        }
      }
    };
  }
  function create_each_block(key_1, ctx) {
    let first;
    let sidebaritem;
    let current;
    sidebaritem = new SidebarItem({
      props: {
        action: ctx[15],
        $$slots: { default: [create_default_slot_1] },
        $$scope: { ctx }
      }
    });
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        create_component(sidebaritem.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(sidebaritem, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const sidebaritem_changes = {};
        if (dirty & 262144) {
          sidebaritem_changes.$$scope = { dirty, ctx };
        }
        sidebaritem.$set(sidebaritem_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(sidebaritem.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(sidebaritem.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(first);
        }
        destroy_component(sidebaritem, detaching);
      }
    };
  }
  function create_if_block_1(ctx) {
    let access;
    let current;
    access = new Access({
      props: {
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(access.$$.fragment);
      },
      m(target, anchor) {
        mount_component(access, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const access_changes = {};
        if (dirty & 262148) {
          access_changes.$$scope = { dirty, ctx: ctx2 };
        }
        access.$set(access_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(access.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(access.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(access, detaching);
      }
    };
  }
  function create_default_slot(ctx) {
    let switch_instance;
    let switch_instance_anchor;
    let current;
    var switch_value = ctx[2].component;
    function switch_props(ctx2) {
      return {
        props: { label: ctx2[2].label }
      };
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    }
    return {
      c() {
        if (switch_instance)
          create_component(switch_instance.$$.fragment);
        switch_instance_anchor = empty();
      },
      m(target, anchor) {
        if (switch_instance)
          mount_component(switch_instance, target, anchor);
        insert(target, switch_instance_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const switch_instance_changes = {};
        if (dirty & 4)
          switch_instance_changes.label = ctx2[2].label;
        if (dirty & 4 && switch_value !== (switch_value = ctx2[2].component)) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
          } else {
            switch_instance = null;
          }
        } else if (switch_value) {
          switch_instance.$set(switch_instance_changes);
        }
      },
      i(local) {
        if (current)
          return;
        if (switch_instance)
          transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o(local) {
        if (switch_instance)
          transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(switch_instance_anchor);
        }
        if (switch_instance)
          destroy_component(switch_instance, detaching);
      }
    };
  }
  function create_fragment(ctx) {
    let if_block_anchor;
    let current;
    let mounted;
    let dispose;
    let if_block = ctx[1] === ctx[0].uuid && create_if_block(ctx);
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
        if (!mounted) {
          dispose = listen(window, "keydown", ctx[6]);
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (ctx2[1] === ctx2[0].uuid) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & 3) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  const customPrompt = {
    label: "\u26A1 Custom Prompt",
    handle: "custom",
    component: CustomPrompt
  };
  const categories = [
    {
      label: "\u{1F9E0} Brainstorm",
      handle: "brainstorm",
      component: Brainstorm
    },
    {
      label: "\u270D\uFE0F Edit",
      handle: "edit",
      component: Edit
    }
  ];
  function instance($$self, $$props, $$invalidate) {
    let $isActive;
    let $customPrompts;
    let $hasContent;
    let $category;
    let $isBusy;
    let $answer;
    let $screen;
    let $hasAccess;
    component_subscribe($$self, isActive, ($$value) => $$invalidate(1, $isActive = $$value));
    component_subscribe($$self, actions, ($$value) => $$invalidate(10, $customPrompts = $$value));
    component_subscribe($$self, hasContent, ($$value) => $$invalidate(11, $hasContent = $$value));
    component_subscribe($$self, category, ($$value) => $$invalidate(2, $category = $$value));
    component_subscribe($$self, isBusy, ($$value) => $$invalidate(12, $isBusy = $$value));
    component_subscribe($$self, answer, ($$value) => $$invalidate(13, $answer = $$value));
    component_subscribe($$self, screen, ($$value) => $$invalidate(4, $screen = $$value));
    component_subscribe($$self, hasAccess, ($$value) => $$invalidate(5, $hasAccess = $$value));
    let { redactor } = $$props;
    const preview = redactor.source.getCode();
    let dropdownActive = false;
    setContext("redactor", redactor);
    fetch("/admin/actions/promptly/prompts").then((res) => res.json()).then((res) => set_store_value(
      actions,
      $customPrompts = res.concat([
        {
          label: "New Prompt",
          handle: "new",
          description: "",
          prompt: ""
        }
      ]),
      $customPrompts
    ));
    function onKeydown(event) {
      if (event.code === "Escape") {
        set_store_value(isActive, $isActive = false, $isActive);
      }
    }
    const click_handler = () => set_store_value(isActive, $isActive = false, $isActive);
    function footer_dropdownActive_binding(value) {
      dropdownActive = value;
      $$invalidate(3, dropdownActive), $$invalidate(1, $isActive);
    }
    const click_handler_1 = () => $$invalidate(3, dropdownActive = false);
    $$self.$$set = ($$props2) => {
      if ("redactor" in $$props2)
        $$invalidate(0, redactor = $$props2.redactor);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 2) {
        if (!$isActive) {
          controller.abort();
          set_store_value(answer, $answer = null, $answer);
          set_store_value(isBusy, $isBusy = false, $isBusy);
          $$invalidate(3, dropdownActive = false);
        }
      }
      if ($$self.$$.dirty & 4) {
        if (!$category) {
          set_store_value(category, $category = categories[0], $category);
        }
      }
      if ($$self.$$.dirty & 3) {
        if ($isActive === redactor.uuid) {
          set_store_value(hasContent, $hasContent = !!redactor.cleaner.getFlatText(preview).trim(), $hasContent);
        }
      }
    };
    return [
      redactor,
      $isActive,
      $category,
      dropdownActive,
      $screen,
      $hasAccess,
      onKeydown,
      click_handler,
      footer_dropdownActive_binding,
      click_handler_1
    ];
  }
  class Promptly$1 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, { redactor: 0 }, add_css);
    }
  }
  window.Promptly = { Modal: Promptly$1, isActive };
  redactorPlugin();
})();
