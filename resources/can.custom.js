//TODO: Remove shims as we remove DOM dependencies
window = {};
document = {
    createElement: function() {
        return {};
    }
};


/*!
 * CanJS - 1.1.5
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Wed, 24 Apr 2013 15:32:18 GMT
 * Licensed MIT
 * Download from: http://bitbuilder.herokuapp.com/can.custom.js?configuration=jquery&plugins=can%2Fview%2Fview.js&plugins=can%2Fview%2Fejs%2Fejs.js&plugins=can%2Fview%2Fmustache%2Fmustache.js
 */
(function(undefined) {

    // ## can/util/can.js
    var __m4 = (function() {

        var can = window.can || {};
        if (typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
            window.can = can;
        }

        can.isDeferred = function(obj) {
            var isFunction = this.isFunction;
            // Returns `true` if something looks like a deferred.
            return obj && isFunction(obj.then) && isFunction(obj.pipe);
        };

        var cid = 0;
        can.cid = function(object, name) {
            if (object._cid) {
                return object._cid
            } else {
                return object._cid = (name || "") + (++cid)
            }
        }
        return can;
    })();

    // ## can/util/array/each.js
    var __m5 = (function(can) {
        can.each = function(elements, callback, context) {
            var i = 0,
                key;
            if (elements) {
                if (typeof elements.length === 'number' && elements.pop) {
                    if (elements.attr) {
                        elements.attr('length');
                    }
                    for (key = elements.length; i < key; i++) {
                        if (callback.call(context || elements[i], elements[i], i, elements) === false) {
                            break;
                        }
                    }
                } else if (elements.hasOwnProperty) {
                    for (key in elements) {
                        if (elements.hasOwnProperty(key)) {
                            if (callback.call(context || elements[key], elements[key], key, elements) === false) {
                                break;
                            }
                        }
                    }
                }
            }
            return elements;
        };

        return can;
    })(__m4);

    //TODO: Totally shimmed this section. Borrowed a piece from can/object/extend
    // ## can/util/jquery/jquery.js
    var __m2 = (function(can) {
        // This extend() function is ruthlessly and shamelessly stolen from
        // jQuery 1.8.2:, lines 291-353.
        var extend = function () {
            var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && typeof target !== "function") {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if (length === i) {
                target = this;
                --i;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (can.isPlainObject(copy) || (copyIsArray = can.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && can.isArray(src) ? src : [];

                            } else {
                                clone = src && can.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = can.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        can.extend = extend;

        can.trim = function(str) {
            return str.trim();
        }
        return can;
    })(__m4, __m5);

    // ## can/view/view.js
    var __m1 = (function(can) {
        // ## view.js
        // `can.view`  
        // _Templating abstraction._

        var isFunction = can.isFunction,
            makeArray = can.makeArray,
            // Used for hookup `id`s.
            hookupId = 1,

            $view = can.view = function(view, data, helpers, callback) {
                // If helpers is a `function`, it is actually a callback.
                if (isFunction(helpers)) {
                    callback = helpers;
                    helpers = undefined;
                }

                var pipe = function(result) {
                    return $view.frag(result);
                },
                    // In case we got a callback, we need to convert the can.view.render
                    // result to a document fragment
                    wrapCallback = isFunction(callback) ? function(frag) {
                        callback(pipe(frag));
                    } : null,
                    // Get the result.
                    result = $view.render(view, data, helpers, wrapCallback),
                    deferred = can.Deferred();

                if (isFunction(result)) {
                    return result;
                }

                if (can.isDeferred(result)) {
                    result.then(function(result, data) {
                        deferred.resolve.call(deferred, pipe(result), data);
                    }, function() {
                        deferred.fail.apply(deferred, arguments);
                    });
                    return deferred;
                }

                // Convert it into a dom frag.
                return pipe(result);
            };

        can.extend($view, {
            // creates a frag and hooks it up all at once
            frag: function(result, parentNode) {
                return $view.hookup($view.fragment(result), parentNode);
            },

            // simply creates a frag
            // this is used internally to create a frag
            // insert it
            // then hook it up
            fragment: function(result) {
                var frag = can.buildFragment(result, document.body);
                // If we have an empty frag...
                if (!frag.childNodes.length) {
                    frag.appendChild(document.createTextNode(''));
                }
                return frag;
            },

            // Convert a path like string into something that's ok for an `element` ID.
            toId: function(src) {
                return can.map(src.toString().split(/\/|\./g), function(part) {
                    // Dont include empty strings in toId functions
                    if (part) {
                        return part;
                    }
                }).join("_");
            },

            hookup: function(fragment, parentNode) {
                var hookupEls = [],
                    id,
                    func;

                // Get all `childNodes`.
                can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function(node) {
                    if (node.nodeType === 1) {
                        hookupEls.push(node);
                        hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName('*')));
                    }
                });

                // Filter by `data-view-id` attribute.
                can.each(hookupEls, function(el) {
                    if (el.getAttribute && (id = el.getAttribute('data-view-id')) && (func = $view.hookups[id])) {
                        func(el, parentNode, id);
                        delete $view.hookups[id];
                        el.removeAttribute('data-view-id');
                    }
                });

                return fragment;
            },


            hookups: {},


            hook: function(cb) {
                $view.hookups[++hookupId] = cb;
                return " data-view-id='" + hookupId + "'";
            },


            cached: {},

            cachedRenderers: {},


            cache: true,


            register: function(info) {
                this.types["." + info.suffix] = info;
            },

            types: {},


            ext: ".ejs",


            registerScript: function() {},


            preload: function() {},


            render: function(view, data, helpers, callback) {
                // If helpers is a `function`, it is actually a callback.
                if (isFunction(helpers)) {
                    callback = helpers;
                    helpers = undefined;
                }

                // See if we got passed any deferreds.
                var deferreds = getDeferreds(data);

                if (deferreds.length) { // Does data contain any deferreds?
                    // The deferred that resolves into the rendered content...
                    var deferred = new can.Deferred(),
                        dataCopy = can.extend({}, data);

                    // Add the view request to the list of deferreds.
                    deferreds.push(get(view, true))

                    // Wait for the view and all deferreds to finish...
                    can.when.apply(can, deferreds).then(function(resolved) {
                        // Get all the resolved deferreds.
                        var objs = makeArray(arguments),
                            // Renderer is the last index of the data.
                            renderer = objs.pop(),
                            // The result of the template rendering with data.
                            result;

                        // Make data look like the resolved deferreds.
                        if (can.isDeferred(data)) {
                            dataCopy = usefulPart(resolved);
                        } else {
                            // Go through each prop in data again and
                            // replace the defferreds with what they resolved to.
                            for (var prop in data) {
                                if (can.isDeferred(data[prop])) {
                                    dataCopy[prop] = usefulPart(objs.shift());
                                }
                            }
                        }

                        // Get the rendered result.
                        result = renderer(dataCopy, helpers);

                        // Resolve with the rendered view.
                        deferred.resolve(result, dataCopy);

                        // If there's a `callback`, call it back with the result.
                        callback && callback(result, dataCopy);
                    }, function() {
                        deferred.reject.apply(deferred, arguments)
                    });
                    // Return the deferred...
                    return deferred;
                } else {
                    // No deferreds! Render this bad boy.
                    var response,
                        // If there's a `callback` function
                        async = isFunction(callback),
                        // Get the `view` type
                        deferred = get(view, async);

                    // If we are `async`...
                    if (async) {
                        // Return the deferred
                        response = deferred;
                        // And fire callback with the rendered result.
                        deferred.then(function(renderer) {
                            callback(data ? renderer(data, helpers) : renderer);
                        })
                    } else {
                        // if the deferred is resolved, call the cached renderer instead
                        // this is because it's possible, with recursive deferreds to
                        // need to render a view while its deferred is _resolving_.  A _resolving_ deferred
                        // is a deferred that was just resolved and is calling back it's success callbacks.
                        // If a new success handler is called while resoliving, it does not get fired by
                        // jQuery's deferred system.  So instead of adding a new callback
                        // we use the cached renderer.
                        // We also add __view_id on the deferred so we can look up it's cached renderer.
                        // In the future, we might simply store either a deferred or the cached result.
                        if (deferred.state() === "resolved" && deferred.__view_id) {
                            var currentRenderer = $view.cachedRenderers[deferred.__view_id];
                            return data ? currentRenderer(data, helpers) : currentRenderer;
                        } else {
                            // Otherwise, the deferred is complete, so
                            // set response to the result of the rendering.
                            deferred.then(function(renderer) {
                                response = data ? renderer(data, helpers) : renderer;
                            });
                        }
                    }

                    return response;
                }
            },


            registerView: function(id, text, type, def) {
                // Get the renderer function.
                var func = (type || $view.types[$view.ext]).renderer(id, text);
                def = def || new can.Deferred();

                // Cache if we are caching.
                if ($view.cache) {
                    $view.cached[id] = def;
                    def.__view_id = id;
                    $view.cachedRenderers[id] = func;
                }

                // Return the objects for the response's `dataTypes`
                // (in this case view).
                return def.resolve(func);
            }
        });

        // Makes sure there's a template, if not, have `steal` provide a warning.
        var checkText = function(text, url) {
            if (!text.length) {

                throw "can.view: No template or empty template:" + url;
            }
        },
            // `Returns a `view` renderer deferred.  
            // `url` - The url to the template.  
            // `async` - If the ajax request should be asynchronous.  
            // Returns a deferred.
            get = function(url, async) {
                var suffix = url.match(/\.[\w\d]+$/),
                    type,
                    // If we are reading a script element for the content of the template,
                    // `el` will be set to that script element.
                    el,
                    // A unique identifier for the view (used for caching).
                    // This is typically derived from the element id or
                    // the url for the template.
                    id,
                    // The ajax request used to retrieve the template content.
                    jqXHR;

                //If the url has a #, we assume we want to use an inline template
                //from a script element and not current page's HTML
                if (url.match(/^#/)) {
                    url = url.substr(1);
                }
                // If we have an inline template, derive the suffix from the `text/???` part.
                // This only supports `<script>` tags.
                if (el = document.getElementById(url)) {
                    suffix = "." + el.type.match(/\/(x\-)?(.+)/)[2];
                }

                // If there is no suffix, add one.
                if (!suffix && !$view.cached[url]) {
                    url += (suffix = $view.ext);
                }

                if (can.isArray(suffix)) {
                    suffix = suffix[0]
                }

                // Convert to a unique and valid id.
                id = $view.toId(url);

                // If an absolute path, use `steal` to get it.
                // You should only be using `//` if you are using `steal`.
                if (url.match(/^\/\//)) {
                    var sub = url.substr(2);
                    url = !window.steal ?
                        sub :
                        steal.config().root.mapJoin(sub);
                }

                // Set the template engine type.
                type = $view.types[suffix];

                // If it is cached, 
                if ($view.cached[id]) {
                    // Return the cached deferred renderer.
                    return $view.cached[id];

                    // Otherwise if we are getting this from a `<script>` element.
                } else if (el) {
                    // Resolve immediately with the element's `innerHTML`.
                    return $view.registerView(id, el.innerHTML, type);
                } else {
                    // Make an ajax request for text.
                    var d = new can.Deferred();
                    can.ajax({
                        async: async,
                        url: url,
                        dataType: "text",
                        error: function(jqXHR) {
                            checkText("", url);
                            d.reject(jqXHR);
                        },
                        success: function(text) {
                            // Make sure we got some text back.
                            checkText(text, url);
                            $view.registerView(id, text, type, d)
                        }
                    });
                    return d;
                }
            },
            // Gets an `array` of deferreds from an `object`.
            // This only goes one level deep.
            getDeferreds = function(data) {
                var deferreds = [];

                // pull out deferreds
                if (can.isDeferred(data)) {
                    return [data]
                } else {
                    for (var prop in data) {
                        if (can.isDeferred(data[prop])) {
                            deferreds.push(data[prop]);
                        }
                    }
                }
                return deferreds;
            },
            // Gets the useful part of a resolved deferred.
            // This is for `model`s and `can.ajax` that resolve to an `array`.
            usefulPart = function(resolved) {
                return can.isArray(resolved) && resolved[1] === 'success' ? resolved[0] : resolved
            };

        //!steal-pluginify-remove-start
        if (window.steal) {
            steal.type("view js", function(options, success, error) {
                var type = $view.types["." + options.type],
                    id = $view.toId(options.id);

                options.text = "steal('" + (type.plugin || "can/view/" + options.type) + "',function(can){return " + "can.view.preload('" + id + "'," + options.text + ");\n})";
                success();
            })
        }
        //!steal-pluginify-remove-end

        can.extend($view, {
            register: function(info) {
                this.types["." + info.suffix] = info;

                //!steal-pluginify-remove-start
                if (window.steal) {
                    steal.type(info.suffix + " view js", function(options, success, error) {
                        var type = $view.types["." + options.type],
                            id = $view.toId(options.id + '');

                        options.text = type.script(id, options.text)
                        success();
                    })
                };
                //!steal-pluginify-remove-end

                $view[info.suffix] = function(id, text) {
                    if (!text) {
                        // Return a nameless renderer
                        var renderer = function() {
                            return $view.frag(renderer.render.apply(this, arguments));
                        }
                        renderer.render = function() {
                            var renderer = info.renderer(null, id);
                            return renderer.apply(renderer, arguments);
                        }
                        return renderer;
                    }

                    $view.preload(id, info.renderer(id, text));
                    return can.view(id);
                }
            },
            registerScript: function(type, id, src) {
                return "can.view.preload('" + id + "'," + $view.types["." + type].script(id, src) + ");";
            },
            preload: function(id, renderer) {
                $view.cached[id] = new can.Deferred().resolve(function(data, helpers) {
                    return renderer.call(data, data, helpers);
                });

                function frag() {
                    return $view.frag(renderer.apply(this, arguments));
                }
                // expose the renderer for mustache
                frag.render = renderer;
                return frag;
            }

        });

        return can;
    })(__m2);

    // ## can/util/string/string.js
    var __m7 = (function(can) {
        // ##string.js
        // _Miscellaneous string utility functions._  

        // Several of the methods in this plugin use code adapated from Prototype
        // Prototype JavaScript framework, version 1.6.0.1.
        // © 2005-2007 Sam Stephenson
        var strUndHash = /_|-/,
            strColons = /\=\=/,
            strWords = /([A-Z]+)([A-Z][a-z])/g,
            strLowUp = /([a-z\d])([A-Z])/g,
            strDash = /([a-z\d])([A-Z])/g,
            strReplacer = /\{([^\}]+)\}/g,
            strQuote = /"/g,
            strSingleQuote = /'/g,

            // Returns the `prop` property from `obj`.
            // If `add` is true and `prop` doesn't exist in `obj`, create it as an 
            // empty object.
            getNext = function(obj, prop, add) {
                return prop in obj ?
                    obj[prop] :
                    (add && (obj[prop] = {}));
            },

            // Returns `true` if the object can have properties (no `null`s).
            isContainer = function(current) {
                return (/^f|^o/).test(typeof current);
            };

        can.extend(can, {
            // Escapes strings for HTML.

            esc: function(content) {
                // Convert bad values into empty strings
                var isInvalid = content === null || content === undefined || (isNaN(content) && ("" + content === 'NaN'));
                return ("" + (isInvalid ? '' : content))
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(strQuote, '&#34;')
                    .replace(strSingleQuote, "&#39;");
            },


            getObject: function(name, roots, add) {

                // The parts of the name we are looking up  
                // `['App','Models','Recipe']`
                var parts = name ? name.split('.') : [],
                    length = parts.length,
                    current,
                    r = 0,
                    ret, i;

                // Make sure roots is an `array`.
                roots = can.isArray(roots) ? roots : [roots || window];

                if (!length) {
                    return roots[0];
                }

                // For each root, mark it as current.
                while (roots[r]) {
                    current = roots[r];

                    // Walk current to the 2nd to last object or until there 
                    // is not a container.
                    for (i = 0; i < length - 1 && isContainer(current); i++) {
                        current = getNext(current, parts[i], add);
                    }

                    // If we can get a property from the 2nd to last object...
                    if (isContainer(current)) {

                        // Get (and possibly set) the property.
                        ret = getNext(current, parts[i], add);

                        // If there is a value, we exit.
                        if (ret !== undefined) {
                            // If `add` is `false`, delete the property
                            if (add === false) {
                                delete current[parts[i]];
                            }
                            return ret;

                        }
                    }
                    r++;
                }
            },
            // Capitalizes a string.

            capitalize: function(s, cache) {
                // Used to make newId.
                return s.charAt(0).toUpperCase() + s.slice(1);
            },

            // Underscores a string.

            underscore: function(s) {
                return s
                    .replace(strColons, '/')
                    .replace(strWords, '$1_$2')
                    .replace(strLowUp, '$1_$2')
                    .replace(strDash, '_')
                    .toLowerCase();
            },
            // Micro-templating.

            sub: function(str, data, remove) {
                var obs = [];

                obs.push(str.replace(strReplacer, function(whole, inside) {

                    // Convert inside to type.
                    var ob = can.getObject(inside, data, remove === undefined ? remove : !remove);

                    if (ob === undefined) {
                        obs = null;
                        return "";
                    }

                    // If a container, push into objs (which will return objects found).
                    if (isContainer(ob) && obs) {
                        obs.push(ob);
                        return "";
                    }

                    return "" + ob;
                }));

                return obs === null ? obs : (obs.length <= 1 ? obs[0] : obs);
            },

            // These regex's are used throughout the rest of can, so let's make
            // them available.
            replacer: strReplacer,
            undHash: strUndHash
        });
        return can;
    })(__m2);

    // ## can/observe/compute/compute.js
    var __m8 = (function(can) {

        // returns the
        // - observes and attr methods are called by func
        // - the value returned by func
        // ex: `{value: 100, observed: [{obs: o, attr: "completed"}]}`
        var getValueAndObserved = function(func, self) {

            var oldReading;
            if (can.Observe) {
                // Set a callback on can.Observe to know
                // when an attr is read.
                // Keep a reference to the old reader
                // if there is one.  This is used
                // for nested live binding.
                oldReading = can.Observe.__reading;
                can.Observe.__reading = function(obj, attr) {
                    // Add the observe and attr that was read
                    // to `observed`
                    observed.push({
                        obj: obj,
                        attr: attr
                    });
                };
            }

            var observed = [],
                // Call the "wrapping" function to get the value. `observed`
                // will have the observe/attribute pairs that were read.
                value = func.call(self);

            // Set back so we are no longer reading.
            if (can.Observe) {
                can.Observe.__reading = oldReading;
            }
            return {
                value: value,
                observed: observed
            };
        },
            // Calls `callback(newVal, oldVal)` everytime an observed property
            // called within `getterSetter` is changed and creates a new result of `getterSetter`.
            // Also returns an object that can teardown all event handlers.
            computeBinder = function(getterSetter, context, callback, computeState) {
                // track what we are observing
                var observing = {},
                    // a flag indicating if this observe/attr pair is already bound
                    matched = true,
                    // the data to return 
                    data = {
                        // we will maintain the value while live-binding is taking place
                        value: undefined,
                        // a teardown method that stops listening
                        teardown: function() {
                            for (var name in observing) {
                                var ob = observing[name];
                                ob.observe.obj.unbind(ob.observe.attr, onchanged);
                                delete observing[name];
                            }
                        }
                    },
                    batchNum;

                // when a property value is changed
                var onchanged = function(ev) {
                    // If the compute is no longer bound (because the same change event led to an unbind)
                    // then do not call getValueAndBind, or we will leak bindings.
                    if (computeState && !computeState.bound) {
                        return;
                    }
                    if (ev.batchNum === undefined || ev.batchNum !== batchNum) {
                        // store the old value
                        var oldValue = data.value,
                            // get the new value
                            newvalue = getValueAndBind();
                        // update the value reference (in case someone reads)
                        data.value = newvalue;
                        // if a change happened
                        if (newvalue !== oldValue) {
                            callback(newvalue, oldValue);
                        }
                        batchNum = batchNum = ev.batchNum;
                    }


                };

                // gets the value returned by `getterSetter` and also binds to any attributes
                // read by the call
                var getValueAndBind = function() {
                    var info = getValueAndObserved(getterSetter, context),
                        newObserveSet = info.observed;

                    var value = info.value;
                    matched = !matched;

                    // go through every attribute read by this observe
                    can.each(newObserveSet, function(ob) {
                        // if the observe/attribute pair is being observed
                        if (observing[ob.obj._cid + "|" + ob.attr]) {
                            // mark at as observed
                            observing[ob.obj._cid + "|" + ob.attr].matched = matched;
                        } else {
                            // otherwise, set the observe/attribute on oldObserved, marking it as being observed
                            observing[ob.obj._cid + "|" + ob.attr] = {
                                matched: matched,
                                observe: ob
                            };
                            ob.obj.bind(ob.attr, onchanged);
                        }
                    });

                    // Iterate through oldObserved, looking for observe/attributes
                    // that are no longer being bound and unbind them
                    for (var name in observing) {
                        var ob = observing[name];
                        if (ob.matched !== matched) {
                            ob.observe.obj.unbind(ob.observe.attr, onchanged);
                            delete observing[name];
                        }
                    }
                    return value;
                };
                // set the initial value
                data.value = getValueAndBind();
                data.isListening = !can.isEmptyObject(observing);
                return data;
            }

            // if no one is listening ... we can not calculate every time

        can.compute = function(getterSetter, context) {
            if (getterSetter && getterSetter.isComputed) {
                return getterSetter;
            }
            // get the value right away
            // TODO: eventually we can defer this until a bind or a read
            var computedData,
                bindings = 0,
                computed,
                canbind = true;
            if (typeof getterSetter === "function") {
                computed = function(value) {
                    if (value === undefined) {
                        // we are reading
                        if (computedData) {
                            // If another compute is calling this compute for the value,
                            // it needs to bind to this compute's change so it will re-compute
                            // and re-bind when this compute changes.
                            if (bindings && can.Observe.__reading) {
                                can.Observe.__reading(computed, 'change');
                            }
                            return computedData.value;
                        } else {
                            return getterSetter.call(context || this)
                        }
                    } else {
                        return getterSetter.apply(context || this, arguments)
                    }
                }

            } else {
                // we just gave it a value
                computed = function(val) {
                    if (val === undefined) {
                        // If observing, record that the value is being read.
                        if (can.Observe.__reading) {
                            can.Observe.__reading(computed, 'change');
                        }
                        return getterSetter;
                    } else {
                        var old = getterSetter;
                        getterSetter = val;
                        if (old !== val) {
                            can.Observe.triggerBatch(computed, "change", [val, old]);
                        }

                        return val;
                    }

                }
                canbind = false;
            }

            computed.isComputed = true;

            can.cid(computed, "compute")
            var computeState = {
                bound: false
            };

            computed.bind = function(ev, handler) {
                can.addEvent.apply(computed, arguments);
                if (bindings === 0 && canbind) {
                    computeState.bound = true;
                    // setup live-binding
                    computedData = computeBinder(getterSetter, context || this, function(newValue, oldValue) {
                        can.Observe.triggerBatch(computed, "change", [newValue, oldValue])
                    }, computeState);
                }
                bindings++;
            }

            computed.unbind = function(ev, handler) {
                can.removeEvent.apply(computed, arguments);
                bindings--;
                if (bindings === 0 && canbind) {
                    computedData.teardown();
                    computeState.bound = false;
                }

            };
            return computed;
        };
        can.compute.binder = computeBinder;
        return can.compute;
    })(__m2);

    // ## can/view/scanner.js
    var __m9 = (function(can) {

        var newLine = /(\r|\n)+/g,
            tagToContentPropMap = {
                option: "textContent",
                textarea: "value"
            },
            // Escapes characters starting with `\`.
            clean = function(content) {
                return content
                    .split('\\').join("\\\\")
                    .split("\n").join("\\n")
                    .split('"').join('\\"')
                    .split("\t").join("\\t");
            },
            reverseTagMap = {
                tr: "tbody",
                option: "select",
                td: "tr",
                th: "tr",
                li: "ul"
            },
            // Returns a tagName to use as a temporary placeholder for live content
            // looks forward ... could be slow, but we only do it when necessary
            getTag = function(tagName, tokens, i) {
                // if a tagName is provided, use that
                if (tagName) {
                    return tagName;
                } else {
                    // otherwise go searching for the next two tokens like "<",TAG
                    while (i < tokens.length) {
                        if (tokens[i] == "<" && reverseTagMap[tokens[i + 1]]) {
                            return reverseTagMap[tokens[i + 1]];
                        }
                        i++;
                    }
                }
                return '';
            },
            bracketNum = function(content) {
                return (--content.split("{").length) - (--content.split("}").length);
            },
            myEval = function(script) {
                eval(script);
            },
            attrReg = /([^\s]+)[\s]*=[\s]*$/,
            // Commands for caching.
            startTxt = 'var ___v1ew = [];',
            finishTxt = "return ___v1ew.join('')",
            put_cmd = "___v1ew.push(",
            insert_cmd = put_cmd,
            // Global controls (used by other functions to know where we are).
            // Are we inside a tag?
            htmlTag = null,
            // Are we within a quote within a tag?
            quote = null,
            // What was the text before the current quote? (used to get the `attr` name)
            beforeQuote = null,
            // Whether a rescan is in progress
            rescan = null,
            // Used to mark where the element is.
            status = function() {
                // `t` - `1`.
                // `h` - `0`.
                // `q` - String `beforeQuote`.
                return quote ? "'" + beforeQuote.match(attrReg)[1] + "'" : (htmlTag ? 1 : 0);
            };

        can.view.Scanner = Scanner = function(options) {
            // Set options on self
            can.extend(this, {
                text: {},
                tokens: []
            }, options);

            // Cache a token lookup
            this.tokenReg = [];
            this.tokenSimple = {
                "<": "<",
                ">": ">",
                '"': '"',
                "'": "'"
            };
            this.tokenComplex = [];
            this.tokenMap = {};
            for (var i = 0, token; token = this.tokens[i]; i++) {


                // Save complex mappings (custom regexp)
                if (token[2]) {
                    this.tokenReg.push(token[2]);
                    this.tokenComplex.push({
                        abbr: token[1],
                        re: new RegExp(token[2]),
                        rescan: token[3]
                    });
                }
                // Save simple mappings (string only, no regexp)
                else {
                    this.tokenReg.push(token[1]);
                    this.tokenSimple[token[1]] = token[0];
                }
                this.tokenMap[token[0]] = token[1];
            }

            // Cache the token registry.
            this.tokenReg = new RegExp("(" + this.tokenReg.slice(0).concat(["<", ">", '"', "'"]).join("|") + ")", "g");
        };

        Scanner.prototype = {

            helpers: [

                {
                    name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                    fn: function(content) {
                        var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                            parts = content.match(quickFunc);

                        return "function(__){var " + parts[1] + "=can.$(__);" + parts[2] + "}";
                    }
                }
            ],

            scan: function(source, name) {
                var tokens = [],
                    last = 0,
                    simple = this.tokenSimple,
                    complex = this.tokenComplex;

                source = source.replace(newLine, "\n");
                source.replace(this.tokenReg, function(whole, part) {
                    // offset is the second to last argument
                    var offset = arguments[arguments.length - 2];

                    // if the next token starts after the last token ends
                    // push what's in between
                    if (offset > last) {
                        tokens.push(source.substring(last, offset));
                    }

                    // push the simple token (if there is one)
                    if (simple[whole]) {
                        tokens.push(whole);
                    }
                    // otherwise lookup complex tokens
                    else {
                        for (var i = 0, token; token = complex[i]; i++) {
                            if (token.re.test(whole)) {
                                tokens.push(token.abbr);
                                // Push a rescan function if one exists
                                if (token.rescan) {
                                    tokens.push(token.rescan(part));
                                }
                                break;
                            }
                        }
                    }

                    // update the position of the last part of the last token
                    last = offset + part.length;
                });

                // if there's something at the end, add it
                if (last < source.length) {
                    tokens.push(source.substr(last));
                }

                var content = '',
                    buff = [startTxt + (this.text.start || '')],
                    // Helper `function` for putting stuff in the view concat.
                    put = function(content, bonus) {
                        buff.push(put_cmd, '"', clean(content), '"' + (bonus || '') + ');');
                    },
                    // A stack used to keep track of how we should end a bracket
                    // `}`.  
                    // Once we have a `<%= %>` with a `leftBracket`,
                    // we store how the file should end here (either `))` or `;`).
                    endStack = [],
                    // The last token, used to remember which tag we are in.
                    lastToken,
                    // The corresponding magic tag.
                    startTag = null,
                    // Was there a magic tag inside an html tag?
                    magicInTag = false,
                    // The current tag name.
                    tagName = '',
                    // stack of tagNames
                    tagNames = [],
                    // Pop from tagNames?
                    popTagName = false,
                    // Declared here.
                    bracketCount,
                    i = 0,
                    token,
                    tmap = this.tokenMap;

                // Reinitialize the tag state goodness.
                htmlTag = quote = beforeQuote = null;

                for (;
                (token = tokens[i++]) !== undefined;) {
                    if (startTag === null) {
                        switch (token) {
                            case tmap.left:
                            case tmap.escapeLeft:
                            case tmap.returnLeft:
                                magicInTag = htmlTag && 1;
                            case tmap.commentLeft:
                                // A new line -- just add whatever content within a clean.  
                                // Reset everything.
                                startTag = token;
                                if (content.length) {
                                    put(content);
                                }
                                content = '';
                                break;
                            case tmap.escapeFull:
                                // This is a full line escape (a line that contains only whitespace and escaped logic)
                                // Break it up into escape left and right
                                magicInTag = htmlTag && 1;
                                rescan = 1;
                                startTag = tmap.escapeLeft;
                                if (content.length) {
                                    put(content);
                                }
                                rescan = tokens[i++];
                                content = rescan.content || rescan;
                                if (rescan.before) {
                                    put(rescan.before);
                                }
                                tokens.splice(i, 0, tmap.right);
                                break;
                            case tmap.commentFull:
                                // Ignore full line comments.
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            case '<':
                                // Make sure we are not in a comment.
                                if (tokens[i].indexOf("!--") !== 0) {
                                    htmlTag = 1;
                                    magicInTag = 0;
                                }
                                content += token;
                                break;
                            case '>':
                                htmlTag = 0;
                                // content.substr(-1) doesn't work in IE7/8
                                var emptyElement = content.substr(content.length - 1) == "/" || content.substr(content.length - 2) == "--";
                                // if there was a magic tag
                                // or it's an element that has text content between its tags, 
                                // but content is not other tags add a hookup
                                // TODO: we should only add `can.EJS.pending()` if there's a magic tag 
                                // within the html tags.
                                if (magicInTag || !popTagName && tagToContentPropMap[tagNames[tagNames.length - 1]]) {
                                    // make sure / of /> is on the left of pending
                                    if (emptyElement) {
                                        put(content.substr(0, content.length - 1), ",can.view.pending(),\"/>\"");
                                    } else {
                                        put(content, ",can.view.pending(),\">\"");
                                    }
                                    content = '';
                                    magicInTag = 0;
                                } else {
                                    content += token;
                                }
                                // if it's a tag like <input/>
                                if (emptyElement || popTagName) {
                                    // remove the current tag in the stack
                                    tagNames.pop();
                                    // set the current tag to the previous parent
                                    tagName = tagNames[tagNames.length - 1];
                                    // Don't pop next time
                                    popTagName = false;
                                }
                                break;
                            case "'":
                            case '"':
                                // If we are in an html tag, finding matching quotes.
                                if (htmlTag) {
                                    // We have a quote and it matches.
                                    if (quote && quote === token) {
                                        // We are exiting the quote.
                                        quote = null;
                                        // Otherwise we are creating a quote.
                                        // TODO: does this handle `\`?
                                    } else if (quote === null) {
                                        quote = token;
                                        beforeQuote = lastToken;
                                    }
                                }
                            default:
                                // Track the current tag
                                if (lastToken === '<') {
                                    tagName = token.split(/\s/)[0];
                                    if (tagName.indexOf("/") === 0 && tagNames[tagNames.length - 1] === tagName.substr(1)) {
                                        // set tagName to the last tagName
                                        // if there are no more tagNames, we'll rely on getTag.
                                        tagName = tagNames[tagNames.length - 1];
                                        popTagName = true;
                                    } else {
                                        tagNames.push(tagName);
                                    }
                                }
                                content += token;
                                break;
                        }
                    } else {
                        // We have a start tag.
                        switch (token) {
                            case tmap.right:
                            case tmap.returnRight:
                                switch (startTag) {
                                    case tmap.left:
                                        // Get the number of `{ minus }`
                                        bracketCount = bracketNum(content);

                                        // We are ending a block.
                                        if (bracketCount == 1) {

                                            // We are starting on.
                                            buff.push(insert_cmd, "can.view.txt(0,'" + getTag(tagName, tokens, i) + "'," + status() + ",this,function(){", startTxt, content);

                                            endStack.push({
                                                before: "",
                                                after: finishTxt + "}));\n"
                                            });
                                        } else {

                                            // How are we ending this statement?
                                            last = // If the stack has value and we are ending a block...
                                            endStack.length && bracketCount == -1 ? // Use the last item in the block stack.
                                            endStack.pop() : // Or use the default ending.
                                            {
                                                after: ";"
                                            };

                                            // If we are ending a returning block, 
                                            // add the finish text which returns the result of the
                                            // block.
                                            if (last.before) {
                                                buff.push(last.before);
                                            }
                                            // Add the remaining content.
                                            buff.push(content, ";", last.after);
                                        }
                                        break;
                                    case tmap.escapeLeft:
                                    case tmap.returnLeft:
                                        // We have an extra `{` -> `block`.
                                        // Get the number of `{ minus }`.
                                        bracketCount = bracketNum(content);
                                        // If we have more `{`, it means there is a block.
                                        if (bracketCount) {
                                            // When we return to the same # of `{` vs `}` end with a `doubleParent`.
                                            endStack.push({
                                                before: finishTxt,
                                                after: "}));"
                                            });
                                        }

                                        var escaped = startTag === tmap.escapeLeft ? 1 : 0,
                                            commands = {
                                                insert: insert_cmd,
                                                tagName: getTag(tagName, tokens, i),
                                                status: status()
                                            };

                                        for (var ii = 0; ii < this.helpers.length; ii++) {
                                            // Match the helper based on helper
                                            // regex name value
                                            var helper = this.helpers[ii];
                                            if (helper.name.test(content)) {
                                                content = helper.fn(content, commands);

                                                // dont escape partials
                                                if (helper.name.source == /^>[\s]*\w*/.source) {
                                                    escaped = 0;
                                                }
                                                break;
                                            }
                                        }

                                        // Handle special cases
                                        if (typeof content == 'object') {
                                            if (content.raw) {
                                                buff.push(content.raw);
                                            }
                                        } else {
                                            // If we have `<%== a(function(){ %>` then we want
                                            // `can.EJS.text(0,this, function(){ return a(function(){ var _v1ew = [];`.
                                            buff.push(insert_cmd, "can.view.txt(" + escaped + ",'" + tagName + "'," + status() + ",this,function(){ " + (this.text.escape || '') + "return ", content,
                                            // If we have a block.
                                            bracketCount ?
                                            // Start with startTxt `"var _v1ew = [];"`.
                                            startTxt :
                                            // If not, add `doubleParent` to close push and text.
                                            "}));");
                                        }

                                        if (rescan && rescan.after && rescan.after.length) {
                                            put(rescan.after.length);
                                            rescan = null;
                                        }
                                        break;
                                }
                                startTag = null;
                                content = '';
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            default:
                                content += token;
                                break;
                        }
                    }
                    lastToken = token;
                }

                // Put it together...
                if (content.length) {
                    // Should be `content.dump` in Ruby.
                    put(content);
                }
                buff.push(";");

                var template = buff.join(''),
                    out = {
                        out: 'with(_VIEW) { with (_CONTEXT) {' + template + " " + finishTxt + "}}"
                    };

                // Use `eval` instead of creating a function, because it is easier to debug.
                myEval.call(out, 'this.fn = (function(_CONTEXT,_VIEW){' + out.out + '});\r\n//@ sourceURL=' + name + ".js");

                return out;
            }
        };

        return Scanner;
    })(__m1);

    // ## can/view/render.js
    var __m10 = (function(can) {
        // text node expando test
        var canExpando = true;
        try {
            document.createTextNode('')._ = 0;
        } catch (ex) {
            canExpando = false;
        }

        var attrMap = {
            "class": "className",
            "value": "value",
            "innerText": "innerText",
            "textContent": "textContent"
        },
            tagMap = {
                "": "span",
                table: "tbody",
                tr: "td",
                ol: "li",
                ul: "li",
                tbody: "tr",
                thead: "tr",
                tfoot: "tr",
                select: "option",
                optgroup: "option"
            },
            attributePlaceholder = '__!!__',
            attributeReplace = /__!!__/g,
            tagToContentPropMap = {
                option: "textContent" in document.createElement("option") ? "textContent" : "innerText",
                textarea: "value"
            },
            bool = can.each(["checked", "disabled", "readonly", "required"], function(n) {
                attrMap[n] = n;
            }),
            // a helper to get the parentNode for a given element el
            // if el is in a documentFragment, it will return defaultParentNode
            getParentNode = function(el, defaultParentNode) {
                return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
            },
            setAttr = function(el, attrName, val) {
                var tagName = el.nodeName.toString().toLowerCase(),
                    prop = attrMap[attrName];
                // if this is a special property
                if (prop) {
                    // set the value as true / false
                    el[prop] = can.inArray(attrName, bool) > -1 ? true : val;
                    if (prop === "value" && (tagName === "input" || tagName === "textarea")) {
                        el.defaultValue = val;
                    }
                } else {
                    el.setAttribute(attrName, val);
                }
            },
            getAttr = function(el, attrName) {
                // Default to a blank string for IE7/8
                return (attrMap[attrName] && el[attrMap[attrName]] ?
                    el[attrMap[attrName]] :
                    el.getAttribute(attrName)) || '';
            },
            removeAttr = function(el, attrName) {
                if (can.inArray(attrName, bool) > -1) {
                    el[attrName] = false;
                } else {
                    el.removeAttribute(attrName);
                }
            },
            pendingHookups = [],
            // Returns text content for anything other than a live-binding 
            contentText = function(input) {

                // If it's a string, return.
                if (typeof input == 'string') {
                    return input;
                }
                // If has no value, return an empty string.
                if (!input && input !== 0) {
                    return '';
                }

                // If it's an object, and it has a hookup method.
                var hook = (input.hookup &&

                // Make a function call the hookup method.

                function(el, id) {
                    input.hookup.call(input, el, id);
                }) ||

                // Or if it's a `function`, just use the input.
                (typeof input == 'function' && input);

                // Finally, if there is a `function` to hookup on some dom,
                // add it to pending hookups.
                if (hook) {
                    pendingHookups.push(hook);
                    return '';
                }

                // Finally, if all else is `false`, `toString()` it.
                return "" + input;
            },
            // Returns escaped/sanatized content for anything other than a live-binding
            contentEscape = function(txt) {
                return (typeof txt == 'string' || typeof txt == 'number') ?
                    can.esc(txt) :
                    contentText(txt);
            },
            // a mapping of element ids to nodeList ids
            nodeMap = {},
            // a mapping of ids to text nodes
            textNodeMap = {},
            // a mapping of nodeList ids to nodeList
            nodeListMap = {},
            expando = "ejs_" + Math.random(),
            _id = 0,
            id = function(node) {
                if (canExpando || node.nodeType !== 3) {
                    if (node[expando]) {
                        return node[expando];
                    } else {
                        return node[expando] = (node.nodeName ? "element_" : "obj_") + (++_id);
                    }
                } else {
                    for (var textNodeID in textNodeMap) {
                        if (textNodeMap[textNodeID] === node) {
                            return textNodeID;
                        }
                    }

                    textNodeMap["text_" + (++_id)] = node;
                    return "text_" + _id;
                }
            },
            // removes a nodeListId from a node's nodeListIds
            removeNodeListId = function(node, nodeListId) {
                var nodeListIds = nodeMap[id(node)];
                if (nodeListIds) {
                    var index = can.inArray(nodeListId, nodeListIds);

                    if (index >= 0) {
                        nodeListIds.splice(index, 1);
                    }
                    if (!nodeListIds.length) {
                        delete nodeMap[id(node)];
                    }
                }
            },
            addNodeListId = function(node, nodeListId) {
                var nodeListIds = nodeMap[id(node)];
                if (!nodeListIds) {
                    nodeListIds = nodeMap[id(node)] = [];
                }
                nodeListIds.push(nodeListId);
            },
            tagChildren = function(tagName) {
                var newTag = tagMap[tagName] || "span";
                if (newTag === "span") {
                    //innerHTML in IE doesn't honor leading whitespace after empty elements
                    return "@@!!@@";
                }
                return "<" + newTag + ">" + tagChildren(newTag) + "</" + newTag + ">";
            };

        can.extend(can.view, {

            pending: function() {
                // TODO, make this only run for the right tagName
                var hooks = pendingHookups.slice(0);
                lastHookups = hooks;
                pendingHookups = [];
                return can.view.hook(function(el) {
                    can.each(hooks, function(fn) {
                        fn(el);
                    });
                });
            },

            registerNode: function(nodeList) {
                var nLId = id(nodeList);
                nodeListMap[nLId] = nodeList;

                can.each(nodeList, function(node) {
                    addNodeListId(node, nLId);
                });
            },

            unregisterNode: function(nodeList) {
                var nLId = id(nodeList);
                can.each(nodeList, function(node) {
                    removeNodeListId(node, nLId);
                });
                delete nodeListMap[nLId];
            },


            txt: function(escape, tagName, status, self, func) {
                // call the "wrapping" function and get the binding information
                var binding = can.compute.binder(func, self, function(newVal, oldVal) {
                    // call the update method we will define for each
                    // type of attribute
                    update(newVal, oldVal);
                });

                // If we had no observes just return the value returned by func.
                if (!binding.isListening) {
                    return (escape || status !== 0 ? contentEscape : contentText)(binding.value);
                }

                // The following are helper methods or varaibles that will
                // be defined by one of the various live-updating schemes.
                // The parent element we are listening to for teardown
                var parentElement,
                    nodeList,
                    teardown = function() {
                        binding.teardown();
                        if (nodeList) {
                            can.view.unregisterNode(nodeList);
                        }
                    },
                    // if the parent element is removed, teardown the binding
                    setupTeardownOnDestroy = function(el) {
                        can.bind.call(el, 'destroyed', teardown);
                        parentElement = el;
                    },
                    // if there is no parent, undo bindings
                    teardownCheck = function(parent) {
                        if (!parent) {
                            teardown();
                            can.unbind.call(parentElement, 'destroyed', teardown);
                        }
                    },
                    // the tag type to insert
                    tag = (tagMap[tagName] || "span"),
                    // this will be filled in if binding.isListening
                    update,
                    // the property (instead of innerHTML elements) to adjust. For
                    // example options should use textContent
                    contentProp = tagToContentPropMap[tagName];


                // The magic tag is outside or between tags.
                if (status === 0 && !contentProp) {
                    // Return an element tag with a hookup in place of the content
                    return "<" + tag + can.view.hook(
                        escape ?
                    // If we are escaping, replace the parentNode with 
                    // a text node who's value is `func`'s return value.

                    function(el, parentNode) {
                        // updates the text of the text node
                        update = function(newVal) {
                            node.nodeValue = "" + newVal;
                            teardownCheck(node.parentNode);
                        };

                        var parent = getParentNode(el, parentNode),
                            node = document.createTextNode(binding.value);

                        // When iterating through an Observe.List with no DOM
                        // elements containing the individual items, the parent 
                        // is sometimes incorrect not the true parent of the 
                        // source element. (#153)
                        if (el.parentNode !== parent) {
                            parent = el.parentNode;
                            parent.insertBefore(node, el);
                            parent.removeChild(el);
                        } else {
                            parent.insertBefore(node, el);
                            parent.removeChild(el);
                        }
                        setupTeardownOnDestroy(parent);
                    } :
                    // If we are not escaping, replace the parentNode with a
                    // documentFragment created as with `func`'s return value.

                    function(span, parentNode) {
                        // updates the elements with the new content
                        update = function(newVal) {
                            // is this still part of the DOM?
                            var attached = nodes[0].parentNode;
                            // update the nodes in the DOM with the new rendered value
                            if (attached) {
                                makeAndPut(newVal);
                            }
                            teardownCheck(nodes[0].parentNode);
                        };

                        // make sure we have a valid parentNode
                        parentNode = getParentNode(span, parentNode);
                        // A helper function to manage inserting the contents
                        // and removing the old contents
                        var nodes,
                            makeAndPut = function(val) {
                                // create the fragment, but don't hook it up
                                // we need to insert it into the document first
                                var frag = can.view.frag(val, parentNode),
                                    // keep a reference to each node
                                    newNodes = can.makeArray(frag.childNodes),
                                    last = nodes ? nodes[nodes.length - 1] : span;

                                // Insert it in the `document` or `documentFragment`
                                if (last.nextSibling) {
                                    last.parentNode.insertBefore(frag, last.nextSibling);
                                } else {
                                    last.parentNode.appendChild(frag);
                                }
                                // nodes hasn't been set yet
                                if (!nodes) {
                                    can.remove(can.$(span));
                                    nodes = newNodes;
                                    // set the teardown nodeList
                                    nodeList = nodes;
                                    can.view.registerNode(nodes);
                                } else {
                                    // Update node Array's to point to new nodes
                                    // and then remove the old nodes.
                                    // It has to be in this order for Mootools
                                    // and IE because somehow, after an element
                                    // is removed from the DOM, it loses its
                                    // expando values.
                                    var nodesToRemove = can.makeArray(nodes);
                                    can.view.replace(nodes, newNodes);
                                    can.remove(can.$(nodesToRemove));
                                }
                            };
                        // nodes are the nodes that any updates will replace
                        // at this point, these nodes could be part of a documentFragment
                        makeAndPut(binding.value, [span]);

                        setupTeardownOnDestroy(parentNode);
                        //children have to be properly nested HTML for buildFragment to work properly
                    }) + ">" + tagChildren(tag) + "</" + tag + ">";
                    // In a tag, but not in an attribute
                } else if (status === 1) {
                    // remember the old attr name
                    var attrName = binding.value.replace(/['"]/g, '').split('=')[0];
                    pendingHookups.push(function(el) {
                        update = function(newVal) {
                            var parts = (newVal || "").replace(/['"]/g, '').split('='),
                                newAttrName = parts.shift();

                            // Remove if we have a change and used to have an `attrName`.
                            if ((newAttrName != attrName) && attrName) {
                                removeAttr(el, attrName);
                            }
                            // Set if we have a new `attrName`.
                            if (newAttrName) {
                                setAttr(el, newAttrName, parts.join('='));
                                attrName = newAttrName;
                            }
                        };
                        setupTeardownOnDestroy(el);
                    });

                    return binding.value;
                } else { // In an attribute...
                    var attributeName = status === 0 ? contentProp : status;
                    // if the magic tag is inside the element, like `<option><% TAG %></option>`,
                    // we add this hookup to the last element (ex: `option`'s) hookups.
                    // Otherwise, the magic tag is in an attribute, just add to the current element's
                    // hookups.
                    (status === 0 ? lastHookups : pendingHookups).push(function(el) {
                        // update will call this attribute's render method
                        // and set the attribute accordingly
                        update = function() {
                            setAttr(el, attributeName, hook.render(), contentProp);
                        };

                        var wrapped = can.$(el),
                            hooks;

                        // Get the list of hookups or create one for this element.
                        // Hooks is a map of attribute names to hookup `data`s.
                        // Each hookup data has:
                        // `render` - A `function` to render the value of the attribute.
                        // `funcs` - A list of hookup `function`s on that attribute.
                        // `batchNum` - The last event `batchNum`, used for performance.
                        hooks = can.data(wrapped, 'hooks');
                        if (!hooks) {
                            can.data(wrapped, 'hooks', hooks = {});
                        }

                        // Get the attribute value.
                        var attr = getAttr(el, attributeName, contentProp),
                            // Split the attribute value by the template.
                            // Only split out the first __!!__ so if we have multiple hookups in the same attribute, 
                            // they will be put in the right spot on first render
                            parts = attr.split(attributePlaceholder),
                            goodParts = [],
                            hook;
                        goodParts.push(parts.shift(),
                            parts.join(attributePlaceholder));

                        // If we already had a hookup for this attribute...
                        if (hooks[attributeName]) {
                            // Just add to that attribute's list of `function`s.
                            hooks[attributeName].bindings.push(binding);
                        } else {
                            // Create the hookup data.
                            hooks[attributeName] = {
                                render: function() {
                                    var i = 0,
                                        newAttr = attr.replace(attributeReplace, function() {
                                            return contentText(hook.bindings[i++].value);
                                        });
                                    return newAttr;
                                },
                                bindings: [binding],
                                batchNum: undefined
                            };
                        }

                        // Save the hook for slightly faster performance.
                        hook = hooks[attributeName];

                        // Insert the value in parts.
                        goodParts.splice(1, 0, binding.value);

                        // Set the attribute.
                        setAttr(el, attributeName, goodParts.join(""), contentProp);

                        // Bind on change.
                        //liveBind(observed, el, binder,oldObserved);
                        setupTeardownOnDestroy(el);
                    });
                    return attributePlaceholder;
                }
            },

            replace: function(oldNodeList, newNodes) {
                // for each node in the node list
                oldNodeList = can.makeArray(oldNodeList);

                can.each(oldNodeList, function(node) {
                    // for each nodeList the node is in
                    can.each(can.makeArray(nodeMap[id(node)]), function(nodeListId) {
                        var nodeList = nodeListMap[nodeListId],
                            startIndex = can.inArray(node, nodeList),
                            endIndex = can.inArray(oldNodeList[oldNodeList.length - 1], nodeList);

                        // remove this nodeListId from each node
                        if (startIndex >= 0 && endIndex >= 0) {
                            for (var i = startIndex; i <= endIndex; i++) {
                                var n = nodeList[i];
                                removeNodeListId(n, nodeListId);
                            }

                            // swap in new nodes into the nodeLIst
                            nodeList.splice.apply(nodeList, [startIndex, endIndex - startIndex + 1].concat(newNodes));

                            // tell these new nodes they belong to the nodeList
                            can.each(newNodes, function(node) {
                                addNodeListId(node, nodeListId);
                            });
                        } else {
                            can.view.unregisterNode(nodeList);
                        }
                    });
                });
            },

            canExpando: canExpando,
            // Node mappings
            textNodeMap: textNodeMap,
            nodeMap: nodeMap,
            nodeListMap: nodeListMap
        });

        return can;
    })(__m1, __m7);

    // ## can/view/ejs/ejs.js
    var __m6 = (function(can) {
        // ## ejs.js
        // `can.EJS`  
        // _Embedded JavaScript Templates._

        // Helper methods.
        var extend = can.extend,
            EJS = function(options) {
                // Supports calling EJS without the constructor
                // This returns a function that renders the template.
                if (this.constructor != EJS) {
                    var ejs = new EJS(options);
                    return function(data, helpers) {
                        return ejs.render(data, helpers);
                    };
                }
                // If we get a `function` directly, it probably is coming from
                // a `steal`-packaged view.
                if (typeof options == "function") {
                    this.template = {
                        fn: options
                    };
                    return;
                }
                // Set options on self.
                extend(this, options);
                this.template = this.scanner.scan(this.text, this.name);
            };


        can.EJS = EJS;


        EJS.prototype.

        render = function(object, extraHelpers) {
            object = object || {};
            return this.template.fn.call(object, object, new EJS.Helpers(object, extraHelpers || {}));
        };

        extend(EJS.prototype, {

            scanner: new can.view.Scanner({

                tokens: [
                    ["templateLeft", "<%%"], // Template
                    ["templateRight", "%>"], // Right Template
                    ["returnLeft", "<%=="], // Return Unescaped
                    ["escapeLeft", "<%="], // Return Escaped
                    ["commentLeft", "<%#"], // Comment
                    ["left", "<%"], // Run --- this is hack for now
                    ["right", "%>"], // Right -> All have same FOR Mustache ...
                    ["returnRight", "%>"]
                ]
            })
        });


        EJS.Helpers = function(data, extras) {
            this._data = data;
            this._extras = extras;
            extend(this, extras);
        };

        EJS.Helpers.prototype = {

            // TODO Deprecated!!
            list: function(list, cb) {
                can.each(list, function(item, i) {
                    cb(item, i, list)
                })
            }
        };

        // Options for `steal`'s build.
        can.view.register({
            suffix: "ejs",
            // returns a `function` that renders the view.
            script: function(id, src) {
                var foo = "can.EJS(function(_CONTEXT,_VIEW) { " + new EJS({
                    text: src,
                    name: id
                }).template.out + " })";

                return foo;
            },
            renderer: function(id, text) {
                return EJS({
                    text: text,
                    name: id
                });
            }
        });

        return can;
    })(__m2, __m1, __m7, __m8, __m9, __m10);

    // ## can/view/mustache/mustache.js
    var __m11 = (function(can) {

        // # mustache.js
        // `can.Mustache`: The Mustache templating engine.
        // See the [Transformation](#section-29) section within *Scanning Helpers* for a detailed explanation 
        // of the runtime render code design. The majority of the Mustache engine implementation 
        // occurs within the *Transformation* scanning helper.

        // ## Initialization
        // Define the view extension.
        can.view.ext = ".mustache";

        // ### Setup internal helper variables and functions.
        // An alias for the context variable used for tracking a stack of contexts.
        // This is also used for passing to helper functions to maintain proper context.
        var CONTEXT = '___c0nt3xt',
            // An alias for the variable used for the hash object that can be passed
            // to helpers via `options.hash`.
            HASH = '___h4sh',
            // An alias for the function that adds a new context to the context stack.
            STACK = '___st4ck',
            STACKED = '___st4ck3d',
            // An alias for the most used context stacking call.
            CONTEXT_STACK = STACK + '(' + CONTEXT + ',this)',
            CONTEXT_OBJ = '{context:' + CONTEXT_STACK + ',options:options}',


            isObserve = function(obj) {
                return obj !== null && can.isFunction(obj.attr) && obj.constructor && !! obj.constructor.canMakeObserve;
            },


            isArrayLike = function(obj) {
                return obj && obj.splice && typeof obj.length == 'number';
            },

            // ## Mustache

            Mustache = function(options, helpers) {
                // Support calling Mustache without the constructor.
                // This returns a function that renders the template.
                if (this.constructor != Mustache) {
                    var mustache = new Mustache(options);
                    return function(data, options) {
                        return mustache.render(data, options);
                    };
                }

                // If we get a `function` directly, it probably is coming from
                // a `steal`-packaged view.
                if (typeof options == "function") {
                    this.template = {
                        fn: options
                    };
                    return;
                }

                // Set options on self.
                can.extend(this, options);
                this.template = this.scanner.scan(this.text, this.name);
            };


        // Put Mustache on the `can` object.
        can.Mustache = window.Mustache = Mustache;


        Mustache.prototype.

        render = function(object, options) {
            object = object || {};
            options = options || {};
            if (!options.helpers && !options.partials) {
                options.helpers = options;
            }
            return this.template.fn.call(object, object, {
                _data: object,
                options: options
            });
        };

        can.extend(Mustache.prototype, {
            // Share a singleton scanner for parsing templates.
            scanner: new can.view.Scanner({
                // A hash of strings for the scanner to inject at certain points.
                text: {
                    // This is the logic to inject at the beginning of a rendered template. 
                    // This includes initializing the `context` stack.
                    start: 'var ' + CONTEXT + ' = this && this.' + STACKED + ' ? this : [];' + CONTEXT + '.' + STACKED + ' = true;' + 'var ' + STACK + ' = function(context, self) {' + 'var s;' + 'if (arguments.length == 1 && context) {' + 's = !context.' + STACKED + ' ? [context] : context;' +
                    // Handle helpers with custom contexts (#228)
                    '} else if (!context.' + STACKED + ') {' + 's = [self, context];' + '} else if (context && context === self && context.' + STACKED + ') {' + 's = context.slice(0);' + '} else {' + 's = context && context.' + STACKED + ' ? context.concat([self]) : ' + STACK + '(context).concat([self]);' + '}' + 'return (s.' + STACKED + ' = true) && s;' + '};'
                },

                // An ordered token registry for the scanner.
                // This needs to be ordered by priority to prevent token parsing errors.
                // Each token follows the following structure:
                //		[
                //			// Which key in the token map to match.
                //			"tokenMapName",
                //			// A simple token to match, like "{{".
                //			"token",
                //			// Optional. A complex (regexp) token to match that 
                //			// overrides the simple token.
                //			"[\\s\\t]*{{",
                //			// Optional. A function that executes advanced 
                //			// manipulation of the matched content. This is 
                //			// rarely used.
                //			function(content){   
                //				return content;
                //			}
                //		]
                tokens: [
                    // Return unescaped
                    ["returnLeft", "{{{", "{{[{&]"],
                    // Full line comments
                    ["commentFull", "{{!}}", "^[\\s\\t]*{{!.+?}}\\n"],
                    // Inline comments
                    ["commentLeft", "{{!", "(\\n[\\s\\t]*{{!|{{!)"],
                    // Full line escapes
                    // This is used for detecting lines with only whitespace and an escaped tag
                    ["escapeFull", "{{}}", "(^[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}$)", function(content) {
                            return {
                                before: /^\n.+?\n$/.test(content) ? '\n' : '',
                                content: content.match(/\{\{(.+?)\}\}/)[1] || ''
                            };
                        }
                    ],
                    // Return escaped
                    ["escapeLeft", "{{"],
                    // Close return unescaped
                    ["returnRight", "}}}"],
                    // Close tag
                    ["right", "}}"]
                ],

                // ## Scanning Helpers
                // This is an array of helpers that transform content that is within escaped tags like `{{token}}`. These helpers are solely for the scanning phase; they are unrelated to Mustache/Handlebars helpers which execute at render time. Each helper has a definition like the following:
                //		{
                //			// The content pattern to match in order to execute.
                //			// Only the first matching helper is executed.
                //			name: /pattern to match/,
                //			// The function to transform the content with.
                //			// @param {String} content   The content to transform.
                //			// @param {Object} cmd       Scanner helper data.
                //			//                           {
                //			//                             insert: "insert command",
                //			//                             tagName: "div",
                //			//                             status: 0
                //			//                           }
                //			fn: function(content, cmd) {
                //				return 'for text injection' || 
                //					{ raw: 'to bypass text injection' };
                //			}
                //		}
                helpers: [
                    // ### Partials
                    // Partials begin with a greater than sign, like {{> box}}.
                    // Partials are rendered at runtime (as opposed to compile time), 
                    // so recursive partials are possible. Just avoid infinite loops.
                    // For example, this template and partial:
                    // 		base.mustache:
                    // 			<h2>Names</h2>
                    // 			{{#names}}
                    // 				{{> user}}
                    // 			{{/names}}
                    // 		user.mustache:
                    // 			<strong>{{name}}</strong>
                    {
                        name: /^>[\s]*\w*/,
                        fn: function(content, cmd) {
                            // Get the template name and call back into the render method,
                            // passing the name and the current context.
                            var templateName = can.trim(content.replace(/^>\s?/, '')).replace(/["|']/g, "");
                            return "options.partials && options.partials['" + templateName + "'] ? can.Mustache.renderPartial(options.partials['" + templateName + "']," +
                                CONTEXT_STACK + ".pop(),options) : can.Mustache.render('" + templateName + "', " + CONTEXT_STACK + ")";
                        }
                    },

                    // ### Data Hookup
                    // This will attach the data property of `this` to the element
                    // its found on using the first argument as the data attribute
                    // key.
                    // For example:
                    //		<li id="nameli" {{ data 'name' }}></li>
                    // then later you can access it like:
                    //		can.$('#nameli').data('name');
                    {
                        name: /^\s*data\s/,
                        fn: function(content, cmd) {
                            var attr = content.match(/["|'](.*)["|']/)[1];
                            // return a function which calls `can.data` on the element
                            // with the attribute name with the current context.
                            return "can.proxy(function(__){" +
                            // "var context = this[this.length-1];" +
                            // "context = context." + STACKED + " ? context[context.length-2] : context; console.warn(this, context);" +
                            "can.data(can.$(__),'" + attr + "', this.pop()); }, " + CONTEXT_STACK + ")";
                        }
                    },

                    // ### Transformation (default)
                    // This transforms all content to its interpolated equivalent,
                    // including calls to the corresponding helpers as applicable. 
                    // This outputs the render code for almost all cases.
                    // #### Definitions
                    // * `context` - This is the object that the current rendering context operates within. 
                    //		Each nested template adds a new `context` to the context stack.
                    // * `stack` - Mustache supports nested sections, 
                    //		each of which add their own context to a stack of contexts.
                    //		Whenever a token gets interpolated, it will check for a match against the 
                    //		last context in the stack, then iterate through the rest of the stack checking for matches.
                    //		The first match is the one that gets returned.
                    // * `Mustache.txt` - This serializes a collection of logic, optionally contained within a section.
                    //		If this is a simple interpolation, only the interpolation lookup will be passed.
                    //		If this is a section, then an `options` object populated by the truthy (`options.fn`) and 
                    //		falsey (`options.inverse`) encapsulated functions will also be passed. This section handling 
                    //		exists to support the runtime context nesting that Mustache supports.
                    // * `Mustache.get` - This resolves an interpolation reference given a stack of contexts.
                    // * `options` - An object containing methods for executing the inner contents of sections or helpers.  
                    //		`options.fn` - Contains the inner template logic for a truthy section.  
                    //		`options.inverse` - Contains the inner template logic for a falsey section.  
                    //		`options.hash` - Contains the merged hash object argument for custom helpers.
                    // #### Design
                    // This covers the design of the render code that the transformation helper generates.
                    // ##### Pseudocode
                    // A detailed explanation is provided in the following sections, but here is some brief pseudocode
                    // that gives a high level overview of what the generated render code does (with a template similar to  
                    // `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`).
                    // *Initialize the render code.*
                    // 		view = []
                    // 		context = []
                    // 		stack = fn { context.concat([this]) }
                    // *Render the root section.*
                    // 		view.push( "string" )
                    // 		view.push( can.view.txt(
                    // *Render the nested section with `can.Mustache.txt`.*
                    // 			txt( 
                    // *Add the current context to the stack.*
                    // 				stack(), 
                    // *Flag this for truthy section mode.*
                    // 				"#",
                    // *Interpolate and check the `a` variable for truthyness using the stack with `can.Mustache.get`.*
                    // 				get( "a", stack() ),
                    // *Include the nested section's inner logic.
                    // The stack argument is usually the parent section's copy of the stack, 
                    // but it can be an override context that was passed by a custom helper.
                    // Sections can nest `0..n` times -- **NESTCEPTION**.*
                    // 				{ fn: fn(stack) {
                    // *Render the nested section (everything between the `{{#a}}` and `{{/a}}` tokens).*
                    // 					view = []
                    // 					view.push( "string" )
                    // 					view.push(
                    // *Add the current context to the stack.*
                    // 						stack(),
                    // *Flag this as interpolation-only mode.*
                    // 						null,
                    // *Interpolate the `b.c.d.e.name` variable using the stack.*
                    // 						get( "b.c.d.e.name", stack() ),
                    // 					)
                    // 					view.push( "string" )
                    // *Return the result for the nested section.*
                    // 					return view.join()
                    // 				}}
                    // 			)
                    // 		))
                    // 		view.push( "string" )
                    // *Return the result for the root section, which includes all nested sections.*
                    // 		return view.join()
                    // ##### Initialization
                    // Each rendered template is started with the following initialization code:
                    // 		var ___v1ew = [];
                    // 		var ___c0nt3xt = [];
                    // 		___c0nt3xt.___st4ck = true;
                    // 		var ___st4ck = function(context, self) {
                    // 			var s;
                    // 			if (arguments.length == 1 && context) {
                    // 				s = !context.___st4ck ? [context] : context;
                    // 			} else {
                    // 				s = context && context.___st4ck 
                    //					? context.concat([self]) 
                    //					: ___st4ck(context).concat([self]);
                    // 			}
                    // 			return (s.___st4ck = true) && s;
                    // 		};
                    // The `___v1ew` is the the array used to serialize the view.
                    // The `___c0nt3xt` is a stacking array of contexts that slices and expands with each nested section.
                    // The `___st4ck` function is used to more easily update the context stack in certain situations.
                    // Usually, the stack function simply adds a new context (`self`/`this`) to a context stack. 
                    // However, custom helpers will occasionally pass override contexts that need their own context stack.
                    // ##### Sections
                    // Each section, `{{#section}} content {{/section}}`, within a Mustache template generates a section 
                    // context in the resulting render code. The template itself is treated like a root section, with the 
                    // same execution logic as any others. Each section can have `0..n` nested sections within it.
                    // Here's an example of a template without any descendent sections.  
                    // Given the template: `"{{a.b.c.d.e.name}}" == "Phil"`  
                    // Would output the following render code:
                    //		___v1ew.push("\"");
                    //		___v1ew.push(can.view.txt(1, '', 0, this, function() {
                    // 			return can.Mustache.txt(___st4ck(___c0nt3xt, this), null, 
                    //				can.Mustache.get("a.b.c.d.e.name", 
                    //					___st4ck(___c0nt3xt, this))
                    //			);
                    //		}));
                    //		___v1ew.push("\" == \"Phil\"");
                    // The simple strings will get appended to the view. Any interpolated references (like `{{a.b.c.d.e.name}}`) 
                    // will be pushed onto the view via `can.view.txt` in order to support live binding.
                    // The function passed to `can.view.txt` will call `can.Mustache.txt`, which serializes the object data by doing 
                    // a context lookup with `can.Mustache.get`.
                    // `can.Mustache.txt`'s first argument is a copy of the context stack with the local context `this` added to it.
                    // This stack will grow larger as sections nest.
                    // The second argument is for the section type. This will be `"#"` for truthy sections, `"^"` for falsey, 
                    // or `null` if it is an interpolation instead of a section.
                    // The third argument is the interpolated value retrieved with `can.Mustache.get`, which will perform the 
                    // context lookup and return the approriate string or object.
                    // Any additional arguments, if they exist, are used for passing arguments to custom helpers.
                    // For nested sections, the last argument is an `options` object that contains the nested section's logic.
                    // Here's an example of a template with a single nested section.  
                    // Given the template: `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`  
                    // Would output the following render code:
                    //		___v1ew.push("\"");
                    // 		___v1ew.push(can.view.txt(0, '', 0, this, function() {
                    // 			return can.Mustache.txt(___st4ck(___c0nt3xt, this), "#", 
                    //				can.Mustache.get("a", ___st4ck(___c0nt3xt, this)), 
                    //					[{
                    // 					_: function() {
                    // 						return ___v1ew.join("");
                    // 					}
                    // 				}, {
                    // 					fn: function(___c0nt3xt) {
                    // 						var ___v1ew = [];
                    // 						___v1ew.push(can.view.txt(1, '', 0, this, 
                    //								function() {
                    //  								return can.Mustache.txt(
                    // 									___st4ck(___c0nt3xt, this), 
                    // 									null, 
                    // 									can.Mustache.get("b.c.d.e.name", 
                    // 										___st4ck(___c0nt3xt, this))
                    // 								);
                    // 							}
                    // 						));
                    // 						return ___v1ew.join("");
                    // 					}
                    // 				}]
                    //			)
                    // 		}));
                    //		___v1ew.push("\" == \"Phil\"");
                    // This is specified as a truthy section via the `"#"` argument. The last argument includes an array of helper methods used with `options`.
                    // These act similarly to custom helpers: `options.fn` will be called for truthy sections, `options.inverse` will be called for falsey sections.
                    // The `options._` function only exists as a dummy function to make generating the section nesting easier (a section may have a `fn`, `inverse`,
                    // or both, but there isn't any way to determine that at compilation time).
                    // Within the `fn` function is the section's render context, which in this case will render anything between the `{{#a}}` and `{{/a}}` tokens.
                    // This function has `___c0nt3xt` as an argument because custom helpers can pass their own override contexts. For any case where custom helpers
                    // aren't used, `___c0nt3xt` will be equivalent to the `___st4ck(___c0nt3xt, this)` stack created by its parent section. The `inverse` function
                    // works similarly, except that it is added when `{{^a}}` and `{{else}}` are used. `var ___v1ew = []` is specified in `fn` and `inverse` to 
                    // ensure that live binding in nested sections works properly.
                    // All of these nested sections will combine to return a compiled string that functions similar to EJS in its uses of `can.view.txt`.
                    // #### Implementation
                    {
                        name: /^.*$/,
                        fn: function(content, cmd) {
                            var mode = false,
                                result = [];

                            // Trim the content so we don't have any trailing whitespace.
                            content = can.trim(content);

                            // Determine what the active mode is.
                            // * `#` - Truthy section
                            // * `^` - Falsey section
                            // * `/` - Close the prior section
                            // * `else` - Inverted section (only exists within a truthy/falsey section)
                            if (content.length && (mode = content.match(/^([#^/]|else$)/))) {
                                mode = mode[0];
                                switch (mode) {
                                    // Open a new section.
                                    case '#':
                                    case '^':
                                        result.push(cmd.insert + 'can.view.txt(0,\'' + cmd.tagName + '\',' + cmd.status + ',this,function(){ return ');
                                        break;
                                        // Close the prior section.
                                    case '/':
                                        return {
                                            raw: 'return ___v1ew.join("");}}])}));'
                                        };
                                        break;
                                }

                                // Trim the mode off of the content.
                                content = content.substring(1);
                            }

                            // `else` helpers are special and should be skipped since they don't 
                            // have any logic aside from kicking off an `inverse` function.
                            if (mode != 'else') {
                                var args = [],
                                    i = 0,
                                    hashing = false,
                                    arg, split, m;

                                // Parse the helper arguments.
                                // This needs uses this method instead of a split(/\s/) so that 
                                // strings with spaces can be correctly parsed.
                                (can.trim(content) + ' ').replace(/((([^\s]+?=)?('.*?'|".*?"))|.*?)\s/g, function(whole, part) {
                                    args.push(part);
                                });

                                // Start the content render block.
                                result.push('can.Mustache.txt(' + CONTEXT_OBJ + ',' + (mode ? '"' + mode + '"' : 'null') + ',');

                                // Iterate through the helper arguments, if there are any.
                                for (; arg = args[i]; i++) {
                                    i && result.push(',');

                                    // Check for special helper arguments (string/number/boolean/hashes).
                                    if (i && (m = arg.match(/^(('.*?'|".*?"|[0-9.]+|true|false)|((.+?)=(('.*?'|".*?"|[0-9.]+|true|false)|(.+))))$/))) {
                                        // Found a native type like string/number/boolean.
                                        if (m[2]) {
                                            result.push(m[0]);
                                        }
                                        // Found a hash object.
                                        else {
                                            // Open the hash object.
                                            if (!hashing) {
                                                hashing = true;
                                                result.push('{' + HASH + ':{');
                                            }

                                            // Add the key/value.
                                            result.push(m[4], ':', m[6] ? m[6] : 'can.Mustache.get("' + m[5].replace(/"/g, '\\"') + '",' + CONTEXT_OBJ + ')');

                                            // Close the hash if this was the last argument.
                                            if (i == args.length - 1) {
                                                result.push('}}');
                                            }
                                        }
                                    }
                                    // Otherwise output a normal interpolation reference.
                                    else {
                                        result.push('can.Mustache.get("' +
                                        // Include the reference name.
                                        arg.replace(/"/g, '\\"') + '",' +
                                        // Then the stack of context.
                                        CONTEXT_OBJ +
                                        // Flag as a helper method to aid performance, 
                                        // if it is a known helper (anything with > 0 arguments).
                                        (i == 0 && args.length > 1 ? ',true' : ',false') +
                                            (i > 0 ? ',true' : ',false') +
                                            ')');
                                    }
                                }
                            }

                            // Create an option object for sections of code.
                            mode && mode != 'else' && result.push(',[{_:function(){');
                            switch (mode) {
                                // Truthy section
                                case '#':
                                    result.push('return ___v1ew.join("");}},{fn:function(' + CONTEXT + '){var ___v1ew = [];');
                                    break;
                                    // If/else section
                                    // Falsey section
                                case 'else':
                                case '^':
                                    result.push('return ___v1ew.join("");}},{inverse:function(' + CONTEXT + '){var ___v1ew = [];');
                                    break;
                                    // Not a section
                                default:
                                    result.push(');');
                                    break;
                            }

                            // Return a raw result if there was a section, otherwise return the default string.
                            result = result.join('');
                            return mode ? {
                                raw: result
                            } : result;
                        }
                    }
                ]
            })
        });

        // Add in default scanner helpers first.
        // We could probably do this differently if we didn't 'break' on every match.
        var helpers = can.view.Scanner.prototype.helpers;
        for (var i = 0; i < helpers.length; i++) {
            Mustache.prototype.scanner.helpers.unshift(helpers[i]);
        };


        Mustache.txt = function(context, mode, name) {
            // Grab the extra arguments to pass to helpers.
            var args = Array.prototype.slice.call(arguments, 3),
                // Create a default `options` object to pass to the helper.
                options = can.extend.apply(can, [{
                        fn: function() {},
                        inverse: function() {}
                    }
                ].concat(mode ? args.pop() : []));


            var extra = {};
            if (context.context) {
                extra = context.options;
                context = context.context;
            }

            // Check for a registered helper or a helper-like function.
            if (helper = (Mustache.getHelper(name, extra) || (can.isFunction(name) && !name.isComputed && {
                fn: name
            }))) {
                // Use the most recent context as `this` for the helper.
                var stack = context[STACKED] && context,
                    context = (stack && context[context.length - 1]) || context,
                    // Update the options with a function/inverse (the inner templates of a section).
                    opts = {
                        fn: can.proxy(options.fn, context),
                        inverse: can.proxy(options.inverse, context)
                    },
                    lastArg = args[args.length - 1];

                // Store the context stack in the options if one exists
                if (stack) {
                    opts.contexts = stack;
                }
                // Add the hash to `options` if one exists
                if (lastArg && lastArg[HASH]) {
                    opts.hash = args.pop()[HASH];
                }
                args.push(opts);

                // Call the helper.
                return helper.fn.apply(context, args) || '';
            }

            // if a compute, get the value
            if (can.isFunction(name) && name.isComputed) {
                name = name();
            }

            // An array of arguments to check for truthyness when evaluating sections.
            var validArgs = args.length ? args : [name],
                // Whether the arguments meet the condition of the section.
                valid = true,
                result = [],
                i, helper, argIsObserve, arg;
            // Validate the arguments based on the section mode.
            if (mode) {
                for (i = 0; i < validArgs.length; i++) {
                    arg = validArgs[i];
                    argIsObserve = typeof arg !== 'undefined' && isObserve(arg);
                    // Array-like objects are falsey if their length = 0.
                    if (isArrayLike(arg)) {
                        // Use .attr to trigger binding on empty lists returned from function
                        if (mode == '#') {
                            valid = valid && !! (argIsObserve ? arg.attr('length') : arg.length);
                        } else if (mode == '^') {
                            valid = valid && !(argIsObserve ? arg.attr('length') : arg.length);
                        }
                    }
                    // Otherwise just check if it is truthy or not.
                    else {
                        valid = mode == '#' ? valid && !! arg : mode == '^' ? valid && !arg : valid;
                    }
                }
            }

            // Otherwise interpolate like normal.
            if (valid) {
                switch (mode) {
                    // Truthy section.
                    case '#':
                        // Iterate over arrays
                        if (isArrayLike(name)) {
                            var isObserveList = isObserve(name);

                            // Add the reference to the list in the contexts.
                            for (i = 0; i < name.length; i++) {
                                result.push(options.fn.call(name[i], context) || '');

                                // Ensure that live update works on observable lists
                                isObserveList && name.attr('' + i);
                            }
                            return result.join('');
                        }
                        // Normal case.
                        else {
                            return options.fn.call(name || {}, context) || '';
                        }
                        break;
                        // Falsey section.
                    case '^':
                        return options.inverse.call(name || {}, context) || '';
                        break;
                    default:
                        // Add + '' to convert things like numbers to strings.
                        // This can cause issues if you are trying to
                        // eval on the length but this is the more
                        // common case.
                        return '' + (name !== undefined ? name : '');
                        break;
                }
            }

            return '';
        };


        Mustache.get = function(ref, contexts, isHelper, isArgument) {
            var options = contexts.options || {};
            contexts = contexts.context || contexts;
            // Assume the local object is the last context in the stack.
            var obj = contexts[contexts.length - 1],
                // Assume the parent context is the second to last context in the stack.
                context = contexts[contexts.length - 2],
                // Split the reference (like `a.b.c`) into an array of key names.
                names = ref.split('.'),
                namesLength = names.length,
                value, lastValue, name, i, j,
                // if we walk up and don't find a property, we default
                // to listening on an undefined property of the first
                // context that is an observe
                defaultObserve,
                defaultObserveName;

            // Handle `this` references for list iteration: {{.}} or {{this}}
            if (/^\.|this$/.test(ref)) {
                // If context isn't an object, then it was a value passed by a helper so use it as an override.
                if (!/^object|undefined$/.test(typeof context)) {
                    return context || '';
                }
                // Otherwise just return the closest object.
                else {
                    while (value = contexts.pop()) {
                        if (typeof value !== 'undefined') {
                            return value;
                        }
                    }
                    return '';
                }
            }
            // Handle object resolution (like `a.b.c`).
            else if (!isHelper) {
                // Reverse iterate through the contexts (last in, first out).
                for (i = contexts.length - 1; i >= 0; i--) {
                    // Check the context for the reference
                    value = contexts[i];

                    // Is the value a compute?
                    if (can.isFunction(value) && value.isComputed) {
                        value = value();
                    }

                    // Make sure the context isn't a failed object before diving into it.
                    if (typeof value !== 'undefined' && value !== null) {
                        var isHelper = Mustache.getHelper(ref, options);
                        for (j = 0; j < namesLength; j++) {
                            // Keep running up the tree while there are matches.
                            if (typeof value[names[j]] !== 'undefined' && value[names[j]] !== null) {
                                lastValue = value;
                                value = value[name = names[j]];
                            }
                            // if there's a name conflict between property and helper
                            // property wins
                            else if (isHelper) {
                                return ref;
                            }
                            // If it's undefined, still match if the parent is an Observe.
                            else if (isObserve(value)) {
                                defaultObserve = value;
                                defaultObserveName = names[j];
                                lastValue = value = undefined;
                                break;
                            } else {
                                lastValue = value = undefined;
                                break;
                            }
                        }
                    }

                    // Found a matched reference.
                    if (value !== undefined) {
                        return Mustache.resolve(value, lastValue, name, isArgument);
                    }
                }
            }

            if (defaultObserve &&
            // if there's not a helper by this name and no attribute with this name
            !(Mustache.getHelper(ref) &&
                can.inArray(defaultObserveName, can.Observe.keys(defaultObserve)) === -1)) {
                return defaultObserve.compute(defaultObserveName);
            }
            // Support helpers without arguments, but only if there wasn't a matching data reference.
            // Helpers have priority over local function, see https://github.com/bitovi/canjs/issues/258
            if (value = Mustache.getHelper(ref, options)) {
                return ref;
            } else if (typeof obj !== 'undefined' && obj !== null && can.isFunction(obj[ref])) {
                // Support helper-like functions as anonymous helpers
                return obj[ref];
            }

            return '';
        };


        Mustache.resolve = function(value, lastValue, name, isArgument) {
            if (lastValue && can.isFunction(lastValue[name]) && isArgument) {
                if (lastValue[name].isComputed) {
                    return lastValue[name];
                }
                // Don't execute functions if they are parameters for a helper and are not a can.compute
                // Need to bind it to the original context so that that information doesn't get lost by the helper
                return function() {
                    return lastValue[name].apply(lastValue, arguments);
                };
            } else if (lastValue && can.isFunction(lastValue[name])) {
                // Support functions stored in objects.
                return lastValue[name]();
            }
            // Invoke the length to ensure that Observe.List events fire.
            else if (isObserve(value) && isArrayLike(value) && value.attr('length')) {
                return value;
            }
            // Add support for observes
            else if (lastValue && isObserve(lastValue)) {
                return lastValue.compute(name);
            } else if (can.isFunction(value)) {
                return value();
            } else {
                return value;
            }
        };


        // ## Helpers
        // Helpers are functions that can be called from within a template.
        // These helpers differ from the scanner helpers in that they execute
        // at runtime instead of during compilation.
        // Custom helpers can be added via `can.Mustache.registerHelper`,
        // but there are also some built-in helpers included by default.
        // Most of the built-in helpers are little more than aliases to actions 
        // that the base version of Mustache simply implies based on the 
        // passed in object.
        // Built-in helpers:
        // * `data` - `data` is a special helper that is implemented via scanning helpers. 
        //		It hooks up the active element to the active data object: `<div {{data "key"}} />`
        // * `if` - Renders a truthy section: `{{#if var}} render {{/if}}`
        // * `unless` - Renders a falsey section: `{{#unless var}} render {{/unless}}`
        // * `each` - Renders an array: `{{#each array}} render {{this}} {{/each}}`
        // * `with` - Opens a context section: `{{#with var}} render {{/with}}`
        Mustache._helpers = {};

        Mustache.registerHelper = function(name, fn) {
            this._helpers[name] = {
                name: name,
                fn: fn
            };
        };


        Mustache.getHelper = function(name, options) {
            return options && options.helpers && options.helpers[name] && {
                fn: options.helpers[name]
            } || this._helpers[name]
            for (var i = 0, helper; helper = [i]; i++) {
                // Find the correct helper
                if (helper.name == name) {
                    return helper;
                }
            }
            return null;
        };


        Mustache.render = function(partial, context) {
            // Make sure the partial being passed in
            // isn't a variable like { partial: "foo.mustache" }
            if (!can.view.cached[partial] && context[partial]) {
                partial = context[partial];
            }

            // Call into `can.view.render` passing the
            // partial and context.
            return can.view.render(partial, context);
        };

        Mustache.renderPartial = function(partial, context, options) {
            return partial.render ? partial.render(context, options) :
                partial(context, options);
        };

        // The built-in Mustache helpers.
        can.each({
            // Implements the `if` built-in helper.

            'if': function(expr, options) {
                if ( !! Mustache.resolve(expr)) {
                    return options.fn(options.contexts || this);
                } else {
                    return options.inverse(options.contexts || this);
                }
            },
            // Implements the `unless` built-in helper.

            'unless': function(expr, options) {
                if (!Mustache.resolve(expr)) {
                    return options.fn(options.contexts || this);
                }
            },

            // Implements the `each` built-in helper.

            'each': function(expr, options) {
                expr = Mustache.resolve(expr);
                if ( !! expr && expr.length) {
                    var result = [];
                    for (var i = 0; i < expr.length; i++) {
                        result.push(options.fn(expr[i]));
                    }
                    return result.join('');
                }
            },
            // Implements the `with` built-in helper.

            'with': function(expr, options) {
                var ctx = expr;
                expr = Mustache.resolve(expr);
                if ( !! expr) {
                    return options.fn(ctx);
                }
            }

        }, function(fn, name) {
            Mustache.registerHelper(name, fn);
        });

        // ## Registration
        // Registers Mustache with can.view.
        can.view.register({
            suffix: "mustache",

            contentType: "x-mustache-template",

            // Returns a `function` that renders the view.
            script: function(id, src) {
                return "can.Mustache(function(_CONTEXT,_VIEW) { " + new Mustache({
                    text: src,
                    name: id
                }).template.out + " })";
            },

            renderer: function(id, text) {
                return Mustache({
                    text: text,
                    name: id
                });
            }
        });

        return can;
    })(__m2, __m1, __m9, __m8, __m10);

    window['can'] = __m4;
})();

module.exports = window['can'];