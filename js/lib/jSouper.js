!(function jSouper(global) {

'use strict';
//在压缩编译时，global会由外部引入，这里var声明为了在调试模式中能正常使用
var global = global || this;

var
// 手动声明引用，提高压缩率
doc = document,

    //用于判断浏览器是否为支持W3C规范，这里主要针对IE系列
    _isIE = !global.dispatchEvent, //!+"\v1",

    //生成一个DocumentFragment内的元素来提高DOM操作的效率
    fragment = function(nodeTag) {
        return (fragment.fg || (fragment.fg = doc.createDocumentFragment())).appendChild(doc.createElement(nodeTag || "div"))
    },

    //一个共用的DocumentFragment内div
    _fg = fragment(),

    // shadowBody = fragment("body"),
    shadowDIV = fragment(),
    _placeholder = function(prefix) {
        return (prefix || "@") + Math.random().toString(36).substr(2)
    },

    //@jQuery
    support = (function() {
        var div = fragment("div");
        // Setup
        div.setAttribute("className", "t");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        return {
            htmlSerialize: !! div.getElementsByTagName("link").length
        }
    }()),
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    rtagName = /<([\w:]+)/,
    // We have to close these tags to support XHTML (#13200)
    wrapMap = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tbody: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        th: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

        // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
        // unless wrapped in a div with non-breaking characters in front of it.
        _default: support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    },

    //常值，使用引用提高压缩率
    $NULL = null,
    $UNDEFINED,
    $TRUE = !$UNDEFINED,
    $FALSE = !$TRUE,

    // $EmptyString = "",

    //在HTML解析时空对象输出的字符串值
    ///false|undefined|null|NaN/
    _booleanFalseRegExp = function(str) {
        if (_emptyRegExp[String($.trim(str))]) {
            return "";
        }
        return str;
    },
    _emptyRegExp = {
        "false": $TRUE,
        "undefined": $TRUE,
        "null": $TRUE,
        "NaN": $TRUE
    },

    _split_laveStr, //@split export argument
    $ = {
        id: 9,

        //全局唯一不定字符串，每次程序运行都不一样
        uidAvator: _placeholder(),

        //获取一个对象所对应的key的hash
        hashCode: function(obj, prefix) {
            var uidAvator = (prefix || "") + $.uidAvator,
                codeID;
            if (!(codeID = obj[uidAvator])) {
                codeID = obj[uidAvator] = uidAvator + $.uid();
            }
            return codeID;
        },
        //空函数
        noop: function() {},

        //获取唯一ID
        uid: function() {
            return this.id = this.id + 1;
        },

        //判断是否为字符串
        isS: function(str) {
            return typeof str === "string"
        },

        //判断是否为数组
        isA: function(obj) {
            return obj instanceof Array;
        },

        //判断是否为非primitives（原始值）
        isO: function(obj) {
            return obj instanceof Object;
        },

        //判断是一个字符串是否用引号包裹
        isSWrap: function(str) {
            var start = str.charAt(0);
            return (start === str.charAt(str.length - 1)) && "\'\"".indexOf(start) !== -1;
        },

        //判断字符串能否完全转换成数字
        isStoN: function(str) {
            //NaN != NaN
            return parseFloat(str) == str;
        },

        //按字符串切割，返回切割后的字符串，所切割的字符串保存到临时变量_split_laveStr中，下一次切割会被覆盖
        st: function(str, splitKey) { //split
            var index = str.indexOf(splitKey);
            _split_laveStr = str.substr(index + splitKey.length);
            //false is undefined
            return index !== -1 && str.substring(0, index);
        },

        //同$.st，但是从后往前进行切割
        lst: function(str, splitKey) { //last split
            var index = str.lastIndexOf(splitKey);
            _split_laveStr = str.substr(index + splitKey.length);
            //false is undefined
            return index !== -1 && str.substring(0, index);
        },

        //清空两边字符串
        trim: function(str) {
            str = String(str).replace(/^\s\s*/, '')
            var ws = /\s/,
                i = str.length;
            while (ws.test(str.charAt(--i)));
            return str.slice(0, i + 1);
        },

        //自定义常用原型方法将提高效率和压缩率
        //Array.property.push
        p: function(arr, item) {
            var len = arr.length
            arr[len] = item;
            return len;
        },
        //Array.property.unshift
        us: function(arr, item) { //unshift
            arr.splice(0, 0, item);
        },

        //轻拷贝数组
        s: function(likeArr) { //slice
            var array;
            if ($.isS(likeArr)) {
                return likeArr.split('');
            }
            try {
                array = Array.prototype.slice.call(likeArr, 0); //non-IE and IE9+
            } catch (ex) {
                array = [];
                for (var i = 0, len = likeArr.length; i < len; i++) {
                    array.push(likeArr[i]);
                }
            }
            return array;
        },

        //ArrayLike没有splice函数，使用call
        sp: Array.prototype.splice,

        //获取数组中的最后一个元素
        lI: function(arr) { //lastItem
            return arr[arr.length - 1];
        },
        //将元素按索引插入其后
        iA: function(arr, afterItem, item) { //insertAfter
            for (var i = 0; i < arr.length; i += 1) {
                if (arr[i] === afterItem) {
                    arr.splice(i + 1, 0, item);
                    break;
                }
            }
            return i;
        },
        //同Array.property.indexOf，修复IE8-系列的不兼容
        iO: function(arr, item) { //indexOf
            for (var i = 0, len = arr.length; i < len; i += 1) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
        },
        //for(in) 这种循环经常涉及到闭包，所以和forEach一样封装成一个工具函数
        fI: function(obj, callback) { //forIn
            for (var i in obj) {
                callback(obj[i], i, obj);
            }
        },
        //最简单数组的遍历方式
        E: function(arr, callback, index) { //fastEach
            for (var i = index || 0, len = arr.length; i < len; i += 1) {
                callback(arr[i], i);
            }
        },
        //特殊的forEach，可中途打断，长度也是动态的，在内部节点遍历的操作中将经常使用
        e: function(arr, callback, i) { //forEach
            if (arr) {
                arr = $.s(arr);
                // return this._each($.s(arr), callback, i)
                for (i = i || 0; i < arr.length; i += 1) {
                    if (callback(arr[i], i, arr) === $FALSE) break;
                }
            }
        },
        //从数组中移除索引所对应的元素
        rm: function(arr, item) {
            var index = $.iO(arr, item);
            arr.splice(index, 1);
            return arr;
        },
        //将对象绑定到一个新的对象的原型上，实现简单的继承
        c: function(proto) { //quitter than Object.create , use same memory
            _Object_create_noop.prototype = proto;
            return new _Object_create_noop;
        },

        //DOM操作集合
        D: { //DOM
            //创建一个注释
            C: function(info) { //Comment
                return doc.createComment(info)
            },
            //通过传入的字符串创建节点以及其子节点
            cs: function(nodeHTML) { //createElement by Str
                var result;
                if (nodeHTML.charAt(0) === "<" && nodeHTML.charAt(nodeHTML.length - 1) === ">" && nodeHTML.length >= 3) {
                    var parse = rsingleTag.exec(nodeHTML);
                    if (parse) {
                        result = doc.createElement(parse[1])
                    } else {
                        //@jQuery
                        var tag = rtagName.exec(nodeHTML);
                        tag = tag ? tag[1] : "";

                        var wrap = wrapMap[tag] || wrapMap._default;

                        result = _fg;
                        result.innerHTML = wrap[1] + nodeHTML.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

                        // Descend through wrappers to the right content
                        var j = wrap[0] + 1;
                        while (j--) {
                            result = result.lastChild;
                        }
                    }
                } else {
                    result = doc.createTextNode(nodeHTML);
                }
                return result;
            },
            //insertBefore
            iB: function(parentNode, insertNode, beforNode) {
                try{
                parentNode.insertBefore(insertNode, beforNode || $NULL);
            }catch(e){debugger}
            },
            //往节点末尾推入节点集合
            ap: function(parentNode, node) { //append
                parentNode.appendChild(node);
            },
            //浅克隆节点
            cl: function(node, deep) { //clone,do not need detached clone
                return node.cloneNode(deep);
            },
            //移除子节点
            rC: function(parentNode, node) { //removeChild
                parentNode.removeChild(node)
            },
            //替换节点
            re: function(parentNode, new_node, old_node) { //replace
                parentNode.replaceChild(new_node, old_node);
            },
            //删除节点释放内存
            rm: _isIE ? function(node) {
                //@大城小胖 http://fins.iteye.com/blog/172263
                if (node && node.tagName != 'BODY') {
                    _fg.appendChild(node);
                    _fg.innerHTML = '';
                }
            } : function(node) {
                if (node && node.parentNode && node.tagName != 'BODY') {
                    delete node.parentNode.removeChild(node);
                }
            }
        },
        //简单的AJAX函数
        ajax: function(config) {
            var xhr = new(window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    var s = xhr.status
                    if (s >= 200 && s < 300 || s === 304 || s === 1223) {
                        config.success && config.success(s, xhr)
                    } else {
                        config.error && config.error(s, xhr)
                    }
                    config.complete && config.complete(s, xhr)
                }
            }
            var async = (config.async === $FALSE) ? $FALSE : $TRUE;
            xhr.open(config.type || "GET", config.url, async)
            // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
            xhr.send(null)
            return xhr
        },
        //加强版的foreach，可用做for-In
        //帮助信息，看http://msdn.microsoft.com/zh-cn/library/ff679980(v=vs.94).aspx
        forEach: function(likeArr, callback, context) {
            if ($.isO(likeArr) && typeof likeArr.length !== "number") {
                $.fI(likeArr, function(value, key) {
                    callback.call(context, value, key, likeArr);
                })
            } else if (likeArr && likeArr !== $TRUE) { //非空或者字符串长度不为0，且不为Boolean-true
                $.E(likeArr, function(value, index) {
                    callback.call(context, value, index, likeArr);
                })
            }
        },
        //同jQ的grep工具
        //帮助信息，看http://www.css88.com/jqapi-1.9/jQuery.grep/
        //http://msdn.microsoft.com/zh-cn/library/ff679973(v=vs.94).aspx
        filter: function(likeArr, callback, invert, context) {
            var result = [];
            invert === $UNDEFINED && (invert = $TRUE);
            _jSouperBase.forEach(likeArr, function(value) {
                if (callback.apply(context, arguments) == invert) {
                    $.p(result, value);
                }
            }, context);
            return result;
        },
        //帮助信息，看http://msdn.microsoft.com/zh-cn/library/ff679976(v=vs.94).aspx
        map: function(likeArr, callback, context) {
            var result = [];
            _jSouperBase.forEach(likeArr, function() {
                $.p(result, callback.apply(context, arguments));
            }, context);
            return result;
        },
        //默认递归合并，且可合并循环对象
        extend: function(target, extendObj) {
            if (arguments.length > 2) {
                var mixItems = $.s(arguments);
                mixItems.shift();
                $.E(mixItems, function(mixItem) {
                    target = _mix(target, mixItem);
                })
            } else {
                target = _mix(target, extendObj);
            }
            return target;
        }
    },
    //空函数，用于绑定对象到该原型链上并生成返回子对象
    _Object_create_noop = function() {},
    _traversal = function(node, callback) {
        for (var i = 0, child_node, childNodes = node.childNodes; child_node = childNodes[i]; i += 1) {
            var result = callback(child_node, i, node);
            if (child_node.nodeType === 1 && result !== $FALSE) {
                _traversal(child_node, callback);
            }
        }
    };

var
//事件缓存区
_event_cache = {},
    // //底层事件缓存区，实现系统的getEventListeners
    // __base_event_cache = {},
    _fixEvent = function(e) { //@Rybylouvre
        // if (!e.target) {console.log(e)};
        e.target || (e.target = e.srcElement);
        e.which || (e.which = e.charCode || e.keyCode); //e.charCode != $NULL ? e.charCode : e.keyCode;
        e.preventDefault || (e.preventDefault = function() { //for ie
            e.returnValue = $FALSE
        });
        e.stopPropagation || (e.stopPropagation = function() { //for ie
            e.cancelBubble = $TRUE
        });
    },

    //修复浏览器兼容的鼠标坐标
    _box,
    _fixMouseEvent = function(event) {
        _fixEvent(event);
        if (!_box && _isIE) {
            _box = event.target.ownerDocument || doc;
            _box = "BackCompat" === _box.compatMode ? _box.body : _box.documentElement;
        }
        event.pageX || (event.pageX = event.clientX + ~~_box.scrollLeft - ~~_box.clientLeft);
        event.pageY || (event.pageY = event.clientY + ~~_box.scrollTop - ~~_box.clientTop);
    },

    //修复浏览器兼容的滚轮事件缓存值
    __lowestDelta, __lowestDeltaXY,

    //事件对象修复
    _extendEventRouter = function(e, _extend) {
        //可以操作原型链的话直接使用原型链继承方式
        if (e.__proto__) {
            var result = (_extendEventRouter = function(e, _extend) {
                var _e = {};
                $.fI(_extend, function(value, key) {
                    _e[key] = value;
                })
                _e.__proto__ = e;
                return _e;
            })(e, _extend);
        } else {
            //IE系列也是使用原型链，但是现代浏览器的属性操作会直接定位到原型链上
            if (_isIE) {
                result = (_extendEventRouter = function(e, _extend) {
                    var _e;
                    _e = $.c(e)
                    $.fI(_extend, function(value, key) {
                        _e[key] = value;
                    })
                    return _e;
                })(e, _extend);
            } else {
                try {
                    result = (_extendEventRouter = function(e, _extend) {
                        $.fI(_extend, function(value, key) {
                            delete e[key];
                            e[key] = value;
                        })
                        return e;
                    })(e, _extend);
                } catch (ex) {}
            }
        }
        return result;
    },

    //事件生成器中的路由匹配
    _registerEventRouterMatch = {
        ip: {
            input: $TRUE
        },
        //右键
        rc: {
            contextmenu: $TRUE,
            rclick: $TRUE,
            rightclick: $TRUE
        },
        //模拟mouseEnter、mouseLeave
        el: ("onmouseenter" in doc) ? {} : {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        },
        //左键
        lc: {
            lclick: $TRUE,
            leftclick: $TRUE
        },
        //中键
        wc: {
            wclick: $TRUE,
            wheelclick: $TRUE
        },
        //滚轮事件
        mw: {
            mousewheel: $TRUE
        },
        //声明及执行事件，用于做初始化
        rd: {
            ready: $TRUE
        }
    },
    //事件生成器
    _registerEventBase = function(Element, eventName, eventFun, elementHash) {
        var result = {
            name: eventName,
            fn: eventFun
        };
        var _fn = result.fn = (function(fixEvent) {
            return function(e) {
                fixEvent(e);
                var _e = e;
                e._extend && (_e = _extendEventRouter(e, e._extend));
                var result = eventFun.call(Element, _e);
                (result === $FALSE) && (e.preventDefault() || e.stopPropagation());
                return result;
            }
        }(_isIE ? (/mouse|click|contextmenu/.test(eventName) ? _fixMouseEvent : _fixEvent) : $.noop));

        if (_registerEventRouterMatch.ip[eventName] && !("oninput" in doc) ) {
            //不真实，input只来自用户的输入，不来自脚本的改动
            // //现代浏览器模拟value被写
            // if ("oninput" in doc) {
            //     //初始化模拟
            //     var ev = doc.createEvent("HTMLEvents");
            //     ev.initEvent("input", true, false);
            //     Element.__value__ = "";
            //     //如果这个现代浏览器没有对value做保护，可自定义，IE、Chrome、Firefox都支持
            //     if (Element.__defineSetter__) {
            //         (function() {
            //             Element.__defineSetter__("value", function(newValue) {
            //                 if (typeof newValue !== "number") {
            //                     newValue = String(newValue);
            //                 }
            //                 if (Element.__value__ !== newValue) {
            //                     Element.__value__ = newValue;
            //                     Element.setAttribute("value", newValue);
            //                     if (doc.contains(Element)) {
            //                         Element.dispatchEvent(ev);
            //                     }
            //                 }
            //             });
            //             Element.__defineGetter__("value", function() {
            //                 return Element.__value__;
            //             })
            //         }());
            //     }
            //     //如果不能自动义或者自定义失败
            //     //不支持value监听的话，比如safari，只能时间循环机制轮询，为了浏览器渲染稳定，使用requestAnimationFrame
            //     if (!Element.__lookupSetter__ || !Element.__lookupSetter__("value")) {
            //         //无需顾及内存泄漏，框架对废弃的节点应自动收集重用
            //         _jSouperBase.ready(function(argument) {
            //             requestAnimationFrame(function checkValue() {
            //                 if (doc.contains(Element) && Element.__value__ !== Element.value) {
            //                     Element.setAttribute("value", Element.__value__ = Element.value);
            //                     Element.dispatchEvent(ev);
            //                 }
            //                 requestAnimationFrame(checkValue);
            //             });
            //         })
            //     }
            // } else {
            (function() {
                result.name = ["keypress", /*"focus", */ "blur", "keyup", "paste", "propertychange", "cut"]
                var _fixPropertychangeLock,
                    _deleteOrChienseInput,
                    _oldValue = Element.value,
                    _TI;
                // delete Element.value;
                result.fn = function(e) { // @Gaubee github/blog/issues/44
                    var result;
                    if (e.type === "keyup") { //keyup // 3
                        if (_deleteOrChienseInput) {
                            _deleteOrChienseInput = $FALSE;
                            _oldValue = Element.value;
                            e._extend = {
                                type: "input"
                            }
                            result = _fn(e);
                        }
                    } else if (e.type === "propertychange") { // 2
                        if (_fixPropertychangeLock) {
                            _fixPropertychangeLock = $FALSE;
                            e._extend = {
                                type: "input"
                            }
                            result = _fn(e);
                        } else if ((e.keyCode === 8 /*backspace*/ || e.keyCode === 46 /*delete*/ ) || _oldValue !== Element.value) { //delete or chinese input
                            _deleteOrChienseInput = $TRUE;
                        }
                    } else if (e.type === "blur") {
                        Element.fireEvent("onkeyup")
                        // clearInterval(_TI);
                    } else { //paste cut keypress  // 1
                        _fixPropertychangeLock = $TRUE;
                        _deleteOrChienseInput = $FALSE;
                    }
                }
            }());
            // }
        } else if (_registerEventRouterMatch.rc[eventName] /*&& _isIE*/ ) {
            if (_isIE) {
                (function() {
                    result.name = ["mousedown", "contextmenu"];
                    var _result;
                    result.fn = function(e) {
                        if (e.type !== "contextmenu" && e.button === 2) {
                            e._extend = {
                                type: "contextmenu"
                            }
                            _result = _fn(e)
                        }
                        return _result;
                    }
                }());
            } else {
                result.name = ["contextmenu"];
            }
        } else if (result._cacheName = _registerEventRouterMatch.el[eventName]) {
            (function() {
                result.name = result._cacheName;
                result.fn = function(e) {
                    var topNode = e.relatedTarget,
                        self = this;
                    /*compareDocumentPosition
                        0 self == topNode ===> 
                        1 self in deffriend Document with topNode
                        2 topNode befor self
                        4 self befor topNode
                        8 topNode contains self
                        16 self contains topNode  ==>  
                        32 Brower private*/
                    if (!topNode || (topNode !== self && !(self.compareDocumentPosition(topNode) & 16))) { //@Rubylouvre
                        e._extend = {
                            type: eventName
                        }
                        return _fn(e);
                    }
                }
            }())
        } else if (_registerEventRouterMatch.lc[eventName]) {
            (function() {
                result.name = "mousedown"
                result.fn = _isIE ? function(e) {
                    if (e.button === 1) {
                        e._extend = {
                            type: "leftclick"
                        }
                        return _fn(e);
                    }
                } : function(e) {
                    if (e.button === 0) {
                        e._extend = {
                            type: "leftclick"
                        }
                        return _fn(e);
                    }
                }
            }());
        } else if (_registerEventRouterMatch.wc[eventName]) {
            (function() {
                result.name = "mousedown"
                result.fn = _isIE ? function(e) {
                    if (e.button === 4) {
                        e._extend = {
                            type: "wheelclick"
                        }
                        return _fn(e);
                    }
                } : function(e) {
                    if (e.button === 1) {
                        e._extend = {
                            type: "wheelclick"
                        }
                        return _fn(e);
                    }
                }
            }());
        } else if (_registerEventRouterMatch.mw[eventName]) {
            //@brandonaaron:jquery-mousewheel MIT License
            (function() {
                result.name = "onwheel" in doc || doc.documentMode >= 9 ? "wheel" : ["mousewheel", "DomMouseScroll", "MozMousePiexlScroll"];
                result.fn = function(e) {
                    var delta = 0, //增量
                        deltaX = 0,
                        deltaY = 0,
                        absDelta = 0,
                        absDeltaXY = 0,
                        fn;

                    // Old school scrollwheel delta
                    if (e.wheelDelta /*px or undefined*/ ) {
                        delta = e.wheelDelta;
                    }
                    if (e.detail /*0 or px*/ ) {
                        delta = e.detail * -1;
                    }
                    // At a minimum, setup the deltaY to be delta
                    deltaY = delta;

                    // Firefox < 17 related to DOMMouseScroll event
                    if (e.axis !== $UNDEFINED && e.axis === e.HORIZONTAL_AXIS) {
                        deltaY = 0;
                        deltaX = delta * -1;
                    }

                    // New school wheel delta (wheel event)
                    if (e.deltaY) {
                        deltaY = e.deltaY * -1;
                        delta = deltaY;
                    }
                    if (e.deltaX) {
                        deltaX = e.deltaX;
                        delta = deltaX * -1;
                    }
                    // Webkit
                    if (e.wheelDeltaY !== $UNDEFINED) {
                        deltaY = e.wheelDeltaY;
                    }
                    if (e.wheelDeltaX !== $UNDEFINED) {
                        deltaX = e.wheelDeltaX * -1;
                    }

                    // Look for lowest delta to normalize the delta values
                    absDelta = Math.abs(delta);
                    if (!__lowestDelta || absDelta < __lowestDelta) {
                        __lowestDelta = absDelta;
                    }
                    absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
                    if (!__lowestDeltaXY || absDeltaXY < __lowestDeltaXY) {
                        __lowestDeltaXY = absDeltaXY;
                    }

                    // Get a whole value for the deltas
                    fn = delta > 0 ? 'floor' : 'ceil';
                    delta = Math[fn](delta / __lowestDelta);
                    deltaX = Math[fn](deltaX / __lowestDeltaXY);
                    deltaY = Math[fn](deltaY / __lowestDeltaXY);
                    e._extend = {
                        type: 'mousewheel',
                        wheelDelta: delta,
                        wheelDeltaX: deltaX,
                        wheelDeltaY: deltaY
                    }
                    _fn(e)
                }
            }());
        } else if (_registerEventRouterMatch.rd[eventName]) {
            finallyRun.register(elementHash, function() {
                _fn({
                    type: "ready"
                });
            })
        }
        _event_cache[elementHash + $.hashCode(eventFun)] = result;
        return result;
    },

    //现代浏览器的事件监听
    _addEventListener = function(Element, eventName, eventFun, elementHash) {
        var eventConfig = _registerEventBase(Element, eventName, eventFun, elementHash)
        // var __base_hash_code = $.hashCode(Element);
        // var event_cache = __base_event_cache[__base_hash_code] || (__base_event_cache[__base_hash_code] = {});
        if ($.isS(eventConfig.name)) {
            Element.addEventListener(eventConfig.name, eventConfig.fn, $FALSE);
            // $.p(event_cache[eventConfig.name] || (event_cache[eventConfig.name] = []), eventConfig.fn);
        } else {
            $.E(eventConfig.name, function(eventName) {
                Element.addEventListener(eventName, eventConfig.fn, $FALSE);
                // $.p(event_cache[eventConfig.name] || (event_cache[eventConfig.name] = []), eventConfig.fn);
            })
        }
    },
    //现代浏览器的事件移除
    _removeEventListener = function(Element, eventName, eventFun, elementHash) {
        var wrapEventFun = _event_cache[elementHash + $.hashCode(eventFun)];
        // var __base_hash_code = $.hashCode(Element);
        // var eventList = __base_event_cache[__base_hash_code][eventConfig.name];
        wrapEventFun && Element.removeEventListener(eventName, wrapEventFun, $FALSE);
        // eventList.splice($.iO(eventList, eventFun), 1);
    },

    //IE浏览器的时间监听
    _attachEvent = function(Element, eventName, eventFun, elementHash) {
        var eventConfig = _registerEventBase(Element, eventName, eventFun, elementHash)
        // var __base_hash_code = $.hashCode(Element);
        // var event_cache = __base_event_cache[__base_hash_code] || (__base_event_cache[__base_hash_code] = {});
        if ($.isS(eventConfig.name)) {
            Element.attachEvent("on" + eventConfig.name, eventConfig.fn);
            // $.p(event_cache[eventConfig.name] || (event_cache[eventConfig.name] = []), eventConfig.fn);
        } else {
            $.E(eventConfig.name, function(eventName) {
                Element.attachEvent("on" + eventName, eventConfig.fn);
                // $.p(event_cache[eventConfig.name] || (event_cache[eventConfig.name] = []), eventConfig.fn);
            })
        }
    },
    //IE浏览器的事件移除
    _detachEvent = function(Element, eventName, eventFun, elementHash) {
        var wrapEventFun = _event_cache[elementHash + $.hashCode(eventFun)];
        // var __base_hash_code = $.hashCode(Element);
        // var eventList = __base_event_cache[__base_hash_code][eventConfig.name];
        wrapEventFun && Element.detachEvent("on" + eventName, wrapEventFun);
        // eventList.splice($.iO(eventList, eventFun), 1);
    },

    //对外的接口
    _registerEvent = $.registerEvent = _isIE ? _attachEvent : _addEventListener,
    _cancelEvent = $.cancelEvent = _isIE ? _detachEvent : _removeEventListener;

/*
 * SmartTriggerHandle constructor
 * 用于View层中声明的绑定做包裹。
 * 在每个ViewModel实例中都有着这些包裹过的SmartTriggerHandle实例对象的引用
 * 在ViewModel实例的Model在数据集合中的位置发生相对变动时(subset/collect的操作引起的)，将回收这些SmartTriggerHandle实例对象并重新绑定
 */

function SmartTriggerHandle(key, triggerEvent, data) {
    var self = this;

    self.matchKey = key;
    self.event = triggerEvent instanceof Function ? triggerEvent : $.noop;
    self.TEMP = data;

    //根据key开判断是否需要在Model相对变动时你，进行重新绑定。
    //现在默认都重新绑定。到后期再进行优化
    self.moveAble = SmartTriggerHandle.moveAble(self);

    //托管自己的SmartTriggerSet实例集合
    self.STS_Collection = [];
};
SmartTriggerHandle.moveAble = function(smartTriggerHandle) {
    return $TRUE;
};
SmartTriggerHandle.prototype = {
    //托管到到一个SmartTriggerSet实例中
    bind: function(smartTriggerSet, key) {
        var self = this;
        $.p(self.STS_Collection, smartTriggerSet);
        //如果没有指定绑定关键字，则默认使用配置中的匹配关键字
        smartTriggerSet.push(key === $UNDEFINED ? self.matchKey : key, self);
        return self;
    },
    //解除SmartTriggerSet实例的托管
    unbind: function(smartTriggerSet) {
        var self = this,
            STS_Collection = self.STS_Collection,
            index = $.iO(STS_Collection, smartTriggerSet);
        //托管方和被托管方双边都需要互相移除
        if (index !== -1) {
            smartTriggerSet.remove(self);
            STS_Collection.splice(index, 1);
        }
        return self;
    },
    //由实例自定义的路由接口，用于实现自己定位
    rebuild: $.noop
};

/*
 * SmartTriggerSet constructor
 * 用于管理SmartTriggerHandle的管理器
 * 自定义数据类型，方便遍历操作
 */

function SmartTriggerSet(data) {
    var self = this;
    self.keys = [];
    self.store = {};
    self.TEMP = data;
};

SmartTriggerSet.prototype = {

    //按关键字存储对象，如果对象是数组格式，则与当前集合进行合并
    push: function(key, value) {
        var self = this,
            keys = self.keys,
            store = self.store,
            currentCollection;
        key = String(key);
        self.id = $.uid();
        if (!(key in store)) {
            $.p(keys, key);
        }
        //若集合为空，则立刻生成
        currentCollection = store[key] || (store[key] = []);
        if (value instanceof SmartTriggerHandle) {
            $.p(currentCollection, value);
        } else if ($.isA(value)) {
            //数组类型，一个个存储，确保每一个对象都正确（instanceof SmartTriggerHandle）
            $.E(value, function(smartTriggerHandle) {
                self.push(key, smartTriggerHandle);
            });
        } else {
            console.warn("type error,no SmartTriggerHandle instance!");
        }
        return currentCollection.length;
    },
    remove: function(smartTriggerHandle) {
        var self = this,
            key = smartTriggerHandle.matchKey,
            store = self.store,
            currentCollection = store[key];
        if (currentCollection) {
            var index = $.iO(currentCollection, smartTriggerHandle);
            (index !== -1) && $.sp.call(currentCollection, index, 1);
        }
        return self;
    },
    //触发所有子集的事件
    touchOff: function(key) {
        var self = this;
        $.E(self.get(key), function(smartTriggerHandle) {
            smartTriggerHandle.event(self);
        });
        return self;
    },

    /*
     * 不针对smartTriggerHandle的操作
     */

    set: function(key, value) { //TODO：使用率很低，考虑是否废弃
        var self = this,
            keys = self.keys,
            store = self.store;
        key = String(key);
        if (!(key in store)) {
            $.p(keys, key)
        }
        store[key] = value;
    },
    //返回所对应关键字的对象，这边都是数组类型
    get: function(key) {
        return this.store[key];
    },
    //遍历方法forEach ==> forIn
    forIn: function(callback) { //TODO：使用率很低，考虑是否废弃
        var self = this,
            store = self.store;
        return $.E(self.keys, function(key, index) {
            callback(store[key], key, store);
        })
    },
    //判断是否存在所指定key的对象
    has: function(key) {
        return this.store.hasOwnProperty(key);
    }
}

/*
 * Model constructor
 * MVVM核心之一——Model层，，在浏览器端创建了一个小型的层次数据模型的数据库
 * 为解决多ViewModel统一的数据来源问题而生
 * v5版本去除了subset、collect等重建树结构的方法。将ViewModel和Model分离，中间使用ModelProty来进行代理
 */

function Model(baseData) {
    var self = this;
    if (!(self instanceof Model)) {
        return new Model(baseData);
    }

    //生成唯一的标示符号
    //存储在全局集合中，方便跨Model访问，有些情况需要通过全局集合来获取
    //因为Model可能因为多余而被销毁，所以直接使用引用是不可靠的，用标实获取全局集合中对象才是最实时且正确的对象
    Model._instances[self.id = $.uid()] = self;


    //不对baseData做特殊处理，支持任意类型包括空类型的数据，且数据类型可任意更改
    self._database = baseData;

    //用于缓存key所对应数组的长度，当数组长度发生改变，就需要向上缩减所要触发的key，确保所有集合的更新
    self.__arrayLen = {}; //cache array length with key

    // //用户保存外部数据
    // self.TEMP = {};

    //父级Model
    // self._parentModel // = $UNDEFINED; //to get data

    //私有数据集
    // self._privateModel // = $UNDEFINED;

    //相对于父级的前缀key，代表在父级中的位置
    // self._prefix // = $NULL; //冒泡时需要加上的前缀

    //存储子model或者委托model（如array型的委托，
    //array型由于都拥有同样的前缀与一个索引号，所以可以用委托定位速度更快，详见_ArrayModel）
    //“_”下划线属性是通过prefix来存储子Model
    (self._childModels = [])._ = {}; //to touch off

    //以hash的形式（这里用uid生成的唯一ID）存储_ArrayModel，方便新的array型model快速定位自己的受委托者，并进入队列中
    self._arrayModelMap = {};

    //存储SmartTriggerHandled实例对象，并在set后对其进行更新，即更新View上的绑定。
    self._triggerKeys = new SmartTriggerSet({
        model: self
    });

};

var abandonedModels = Model._abandonedModels = [];
/*
 * 核心方法
 */
var __ModelProto__ = Model.prototype = {
    getSource: function() {
        _DM_extends_object_constructor = _DM_extends_object_constructor_break;
        var self = this,
            result = self.get.apply(self, arguments);
        _DM_extends_object_constructor = _DM_extends_object_constructor_bak;
        return result;
    },
    setSource: function() {
        _DM_extends_object_constructor = _DM_extends_object_constructor_break;
        var self = this,
            result = self.set.apply(self, arguments);
        _DM_extends_object_constructor = _DM_extends_object_constructor_bak;
        return result;
    },
    get: function(key) {
        //直接定义了topGetter，在保证正确的情况下尽可能早地定义
        var self = /* Model.session.topGetter = */ this,
            result = self._database,
            filterKey;
        //TODO:在终点直接默认filterKey的undefined为""，避免过多无用判断
        if (key === $UNDEFINED || key === "") {
            /*filterKey = "";*/
        } else {
            //强制转换成字符串，避免错误。
            // key = String(key);//这里占时不强制转换，好捕捉错误

            //不直接非空判断（if(result)），确保约束，String、Bumber、Boolean还是有属性的
            if (result != $UNDEFINED) { //null|undefined
                //开始按"."做寻址分割分离key
                var perkey = $.st(key, ".");

                //perkey出现异常（为空或者结束）或者result已经取不到有意义的值时才停止循环
                while (perkey && result != $UNDEFINED) {
                    //获取下一层
                    result = result[perkey];
                    perkey = $.st(_split_laveStr, ".");

                    //放在取值后面代表着是从第一层开始查找，第0层也就是_database直接当成最后一层来做
                    //如果当前层是拓展类型层且不是取源操作，调用getter
                    if (result && result[_DM_extends_object_constructor] /* && !_dm_get_source*/ ) {
                        //拓展类型的getter，这点遵守使用和默认的defineGetter一样的原则，每一次取值都要运行getter函数，而不直接用缓存
                        result = result.get(self, key, result.value, key.substr(0, key.length - (((perkey /*perkey === false*/ .length) + 1 /*perkey不为false时，要换算成'.'.length+length*/ ) || 0) - _split_laveStr.length - 1) /*currentKey*/ );
                    }
                }
                //最后一层，老式浏览器不支持String类型用下标索引，所以统一使用charAt搞定
                //lastKey
                result = $.isS(result) ? result.charAt(_split_laveStr) : (result != $UNDEFINED ? result[_split_laveStr] : result);
            }

            /*filterKey = key;*/
        }
        //如果最后一层是拓展类，且非取源操作，运行getter
        if (result && result[_DM_extends_object_constructor] /* && !_dm_get_source*/ ) {
            result = result.get(self, key, result.value, key);
        }
        /*//filterKey应该在拓展类的getter运行后定义，避免被覆盖，因为其中可能有其它get函数
        Model.session.filterKey = filterKey;*/

        /*//在最后再进行一次定义，理由同上
        Model.session.topGetter = self;*/
        return result;
    },
    /*
     *操作数据源并触发更新
     * (String, Object) String：所要更新的数据源路由点；Object：所要替换的数据
     * (Object) 同.set("$THIS"/"",Object)，更新整个数据源
     * 注意，如果所被更新的是Model拓展类，会强制调用setter方法
     // * v5版本中的set不再对数据进行判断相同与否。如果非指针相同的话，那么这个数据为末端数据，不会造成大量的触发更新
     // * 其次可以将v4以前的缓存机制融入进来
     */
    set: function(key, nObj) {
        //replace Data 取代原有对象数据
        var self = /*Model.session.topSetter = */ this,
            lastKey,
            argumentLen = arguments.length;

        //参数长度检查
        if (argumentLen === 0) {
            return;
        } else if (argumentLen === 1) {
            //调整参数指向
            nObj = key;
            key = "";
        }

        //获取数据的最高层存储区，由上向下更新
        //TODO:新版本v5中这部分可大量优化
        var result = _getTopInfoByKey(self, key), //Leader:find the model matched by key
            finallyRunStacks = Model.session.finallyRunStacks,
            result_dm = result.model,
            result_dm_id = result_dm.id;
        if ($.iO(finallyRunStacks, result_dm_id) === -1) { //maybe have many fork by the ExtendsClass
            $.p(finallyRunStacks, result_dm_id);
            result = result_dm.set(result.key, nObj);
            // result = result_dm.touchOff(result.key)
            finallyRunStacks.pop();
            !finallyRunStacks.length && Model.finallyRun();
        } else {
            if (!key) { //argumentLen === 1
                var sObj = self._database;
                if (sObj && sObj[_DM_extends_object_constructor] /*&& !_dm_set_source*/ ) {
                    sObj.set(self, "", nObj, "");
                } else if (sObj !== nObj || _dm_force_update) {
                    self._database = nObj;
                } else if (!$.isO(nObj)) { //sObj === nObj && no-object
                    return;
                };
            } else { //argumentLen >= 1
                //find Object by the key-dot-path and change it
                if (_dm_force_update || $.isO(nObj) || nObj !== self.get(key)) {
                    //[@Gaubee/blog/issues/45](https://github.com/Gaubee/blog/issues/45)
                    var database = self._database || (self._database = {}),
                        sObj,
                        cache_n_Obj = database,
                        cache_cache_n_Obj;
                    var perkey = $.st(key, ".");
                    var back_perkey;
                    while (perkey) {
                        back_perkey = perkey;
                        cache_cache_n_Obj = cache_n_Obj;
                        cache_n_Obj = cache_n_Obj[perkey] || (cache_n_Obj[perkey] = {})
                        //放在取值后面代表着是从第一层开始，第0层也就是_database直接当成最后一层来做
                        if (cache_n_Obj[_DM_extends_object_constructor]) {
                            cache_n_Obj.set(self, key, nObj, key.substr(0, key.length - _split_laveStr.length - 1) /*currentKey*/ );
                            break;
                        }
                        perkey = $.st(_split_laveStr, ".");
                    }
                    //最后一层，而非中途中断（遇到ExtendModel）的情况
                    if (perkey === $FALSE) {
                        if ((sObj = cache_n_Obj[_split_laveStr]) && sObj[_DM_extends_object_constructor] /*&& !_dm_set_source*/ ) {
                            sObj.set(self, key, nObj, key) //call ExtendsClass API
                        } else if ($.isO(cache_n_Obj)) {
                            cache_n_Obj[_split_laveStr] = nObj;
                        } else if (cache_cache_n_Obj) {
                            (cache_cache_n_Obj[back_perkey] = {})[_split_laveStr] = nObj
                        } else { //arrKey.length === 0,and database instanceof no-Object
                            (self._database = {})[_split_laveStr] = nObj
                        }
                    }
                } else {
                    return;
                }
            }
            /*//TODO:set中的filterKey已经在return中存在，无需再有
            Model.session.filterKey = key;*/
            result = self.touchOff(key);
        }
        return result;
    },
    /*
     * 根据key的路由生成相应的Model，如果是向上（由特殊前缀，在$scope模块进行实现），介于TopModel之间，可强制生成
     */
    buildModelByKey: function(key) {
        var self = this;
        var result,
            childModels = self._childModels,
            //寻址的过程中可能找到自己的子model
            resultChilds = [];
        if (key) {
            //TODO:将prefixKey按长度进行缓存，多级缓存，用内存换取效率
            if (!(result = childModels._[key])) {
                $.E(childModels, function(childModel) {
                    var prefixKey = childModel._prefix;
                    var _continue = $FALSE;
                    //prefixKey == key
                    if (prefixKey === key) {
                        result = childModel;
                    }
                    //prefixKey > key
                    else if (prefixKey.indexOf(key + ".") === 0) {
                        $.p(resultChilds, childModel);
                        _continue = $FALSE;
                    }
                    //key > prefixKey
                    else if (key.indexOf(prefixKey + ".") === 0) {
                        result = childModel.buildModelByKey(key.substr(prefixKey.length + 1));
                    } else {
                        _continue = $TRUE;
                    }
                    return _continue;
                });
            }
            //如果这个key与其它分支不同一路，则开辟新的分支
            if (!result) {
                result = self.__buildChildModel(key);
                //如果有子model则进行收取，免得用sockchild实现
                resultChilds.length && $.E(resultChilds, function(result_child) {
                    result_child.__follow(result, result_child._prefix.substr(key.length + 1))
                });
            } else {
                //如果已经存在，确保数据源正确
                result._database = self.get(key);
            }
        } else {
            result = self;
        }
        return result;
    },
    __buildChildModel: function(key) {
        var self = this;
        //从回收区获取一个Model或者直接生成一个新的子Model，绑定一系列关系
        var childModel = abandonedModels.pop() || new Model;
        childModel.__follow(self, key);
        // TODO:聚拢关于这个key的父Model
        // self.sock(key);
        return childModel;
    },
    // /*
    //  * 整理子Model，认领父子关系
    //  */
    // sockChilds: function() {
    //     var self = this;
    // },
    /*
     * 获取最顶层的Model
     */
    topModel: function() { //get DM tree top
        var self = this,
            next;
        while (next = self._parentModel) {
            self = next;
        }
        return self;
    },
    touchOff: function(key) {
        key === $UNDEFINED && (key = "");
        var self = this;
        var result;

        var linkKey = "",
            __arrayLen = self.__arrayLen,
            __arrayData;

        //简单的判定是否可能是数组类型的操作并且可能影响到长度
        if (/[^\w]\.?length/.test(key) || /[^\w]\.?[\d]+([^\w]\.?|$)/.test(key)) {

            key.replace(/[^\w]\.?([\d]+)([^\w]\.?|$)/g, function(matchKey, num, endKey, index) {
                var maybeArrayKey = key.substr(0, index);
                //寻找长度开始变动的那一层级的数据开始_touchOffSibling
                if ($.isA(__arrayData = __ModelProto__.get.call(self, maybeArrayKey)) && __arrayLen[maybeArrayKey] !== __arrayData.length) {
                    // console.log(maybeArrayKey,__arrayData.length, __arrayLen[maybeArrayKey])
                    __arrayLen[maybeArrayKey] = __arrayData.length
                    result = self._touchOff(maybeArrayKey)
                }
            })
        }
        if (!result && $.isA(__arrayData = self._database /*get()*/ ) && __arrayLen[""] !== __arrayData.length) {
            __arrayLen[""] = __arrayData.length
            key = "";
        }
        result || (result = self._touchOff(key))
        return result;
    },
    _touchOff: function(key) {
        var self = this,
            triggerKeys = self._triggerKeys;

        var childModel,
            childModels = self._childModels,
            i = childModels.length - 1;
        var prefix,
            childResult;
        _dm_force_update += 1;
        if (key) {
            /*
             * self：触发当前Model所携带的触发器
             */
            triggerKeys.forIn(function(triggerCollection, triggerKey) {
                if (!triggerKey ||
                    key === triggerKey || !triggerKey.indexOf(key + ".") /*=== 0 */ || !key.indexOf(triggerKey + ".") /* === 0*/ ) {
                    $.E(triggerCollection, function(smartTriggerHandle) {
                        smartTriggerHandle.event(triggerKeys);
                    })
                }
            });

            /*
             * child：向下触发子Model
             */
            /*
             * 针对多ChildModel的优化方案，使用切割地址逐步寻址，比如对ArrayLike有很大的效率提升
             */

            //拼接的地址
            var jointKey = $.st(key, ".");
            //单节点地址
            var nodeKey;
            if (jointKey) { //key是多层次寻址
                //所寻找到的子Model
                if (!childModels._[jointKey]) {
                    while (nodeKey = $.st(_split_laveStr, ".")) {
                        if (childModels._[jointKey]) {
                            break;
                        }
                        jointKey += "." + nodeKey;
                    }
                    nodeKey || (jointKey += "." + _split_laveStr);
                }
            } else { //非多层次寻址
                jointKey = key
            }
            //若能找到对应的Model，则向下触发
            if (childModel = childModels._[jointKey]) {
                //更新数据源，不适用set方法来优化效率
                childModel._database = self.get(jointKey);
                // if (nodeKey) { //单节点地址未空，jointKey === prefixKey < key
                //     childResult = childModel.set(key.substr(jointKey.length + 1), self.get(key));
                // } else { //如果单节点地址已经指向空，则jointKey === prefixKey === key
                //     childResult = childModel.set(self.get(key));
                // }
                childResult = childModel._touchOff(nodeKey ? key.substr(jointKey.length + 1) : "")
            } else { //无法找到，可能是key的长度太短
                for (; childModel = childModels[i]; i--) {
                    prefix = childModel._prefix
                    //v5版本中不存在prefix===""的情况
                    if (!prefix.indexOf(key + ".") /* === 0*/ ) { //prefix is a part of key,just maybe had been changed
                        childModel._database = self.get(prefix);
                        childModel._touchOff();
                        // childResult = childModel.set(self.get(prefix));
                    }
                };
            }
        } else {
            //key为$This（空）的话直接触发所有，无需break
            triggerKeys.forIn(function(triggerCollection, triggerKey) {
                $.E(triggerCollection, function(smartTriggerHandle) {
                    smartTriggerHandle.event(triggerKeys);
                })
            });

            for (; childModel = childModels[i]; i--) {
                childResult = childModel.set(self.get(childModel._prefix))
            };
            /*//私有Model跟着触发更新
            self._privateModel && self._privateModel.touchOff();*/
        }

        _dm_force_update -= 1;
        return {
            key: key
        }
    },
    /*
     * 一个很危险的API，将一个Model进行回收利用
     */
    abandoned: function(remover) {
        remover = this.remove(remover);
        //将Model放入回收区回收利用
        remover && $.p(abandonedModels, remover);
    },
    /*
     * 挂起当前model，与父Model分离，暂停更新
     */
    __hangup: function() {
        var self = this;
        var TEMP = self.TEMP || (self.TEMP = {});
        if (!TEMP.hangup) {
            var parentModel = self._parentModel;

            var prefixKey = self._prefix;
            TEMP.hangup = {
                pm: parentModel,
                pk: prefixKey
            }
            var childModels = parentModel._childModels;
            childModels._[self._prefix] = $UNDEFINED;
            childModels.splice($.iO(childModels, self), 1);
            self._parentModel = self._prefix = $UNDEFINED;
        }
    },
    /*
     * 取消挂起状态，重新与父Model结合同步更新
     */
    __hangdown: function(cusHangUpInfo) {
        var self = this;
        //首先TEMP.hangup属性不能为空
        var hangupInfo = self.TEMP && self.TEMP.hangup;
        if (hangupInfo) {
            _mix(hangupInfo, cusHangUpInfo || {});
            var childModels = hangupInfo.pm._childModels;
            (childModels._[self._prefix = hangupInfo.pk] = self)._parentModel = hangupInfo.pm;
            $.p(childModels, self);
            self.TEMP.hangup = $NULL;
            self.touchOff();
        }
    },
    /*
     * 将指定Model移除数据树，使得独立，旗下的子Model也会跟着离开原有的数据树
     * TODO:根据key进行remove
     */
    remove: function(remover) {
        var self = this;
        if (typeof remover === "string") {
            remover = self._childModels._[remover];
        } else {
            remover = self
        }
        if (remover) {
            var parentModel = remover._parentModel;
            if (parentModel) {
                var childModels = parentModel._childModels;
                childModels._[remover._prefix] = $UNDEFINED;
                childModels.splice($.iO(childModels, remover), 1);
                remover.TEMP = remover._parentModel = remover._prefix = $UNDEFINED;
            }
            // $.E($.s(remover._childModels), function(childModel) {
            //     childModel.remove();
            // });
        }
        // self._triggerKeys.forIn(function(triggerCollection, triggerKey) {
        //     $.E($.s(triggerCollection), function(smartTriggerHandle) {
        //         smartTriggerHandle.unbind(triggerCollection);
        //     })
        // });
        return remover;
    },
    /*
     * 代码片段，成为指定model的子model
     * 使用此代码片段前要先进行remove！
     */
    __follow: function(model, key) {
        var self = this;
        //TODO：有待优化，内部的结构是一条龙生成不会有多余的Model节点，所以可以不进行remove
        if (self._parentModel !== model) {
            self.remove();
            self._parentModel = model;
        }
        self._prefix = key;
        self._database = model.get(key);
        $.p(model._childModels, self);
        model._childModels._[self._prefix] = self;
    },
    destroy: function() {
        for (var i in this) {
            delete this[i]
        }
    }
    // buildGetter: function(key) {},
    // buildSetter: function(key) {} 
};

/*
 * Model base
 * Model层对外的一些声明与Model层拓展的常用工具函数
 */

//绑定到全局中
//声明全局存储Model实例对象的区域，根据uid生成的唯一标示作为hash作为区分
(global.Model = Model)._instances = {};

/*
 * 所有Model拓展对象都要有的属性，生存期同页面内存，在重新载入脚本后就会刷新，确保程序在极大部分情况下正常运行
 */
//将一个对象标记为有重载等号操作符，并使用期自定义操作代替系统原生的赋值取值
var _DM_extends_object_constructor = _placeholder();
//备份
var _DM_extends_object_constructor_bak = _DM_extends_object_constructor;
//额外的标记号，用于扰乱_DM_extends_object_constructor
var _DM_extends_object_constructor_break = _placeholder("*");

//根据唯一标示来获取一个Model实例对象
// get Model instance by id
Model.get = function(id) {
    return Model._instances[id];
}

//混合两个对象的属性并返回混合后的对象

function _mix(sObj, nObj) {
    var obj_n,
        obj_s,
        i;
    //新旧对象都是非primitives的情况下才能进行混合属性
    if ($.isO(sObj) && $.isO(nObj)) {
        for (var i in nObj) {
            obj_n = nObj[i];
            obj_s = sObj[i];
            //拓展的DM_Object对象，通过接口实现操作
            if (obj_s && obj_s[_DM_extends_object_constructor]) {
                obj_s.set(obj_n);
            } else
            //避免死循环 Avoid Circular
            if (obj_s !== obj_n) {
                //递归混合
                sObj[i] = _mix(obj_s, obj_n);
            }
        }
        return sObj;
    } else {
        //否则直接返回新对象，覆盖旧对象
        return nObj;
    }
};

//全局关键字配置
//TODO:暴露给API：.app(opction)进行配置
var __ModelConfig__ = Model.config = {
    //特殊作用域的节点配置
    prefix: {
        This: "$This",
        Parent: "$Parent",
        Top: "$Top",
        Private: "$Private",
        Js: "$Js",
        Index:"$Index",
        Path:"$Path"
    }
};

//操作缓存区
//这里实现思路类似$.st/lst，都是用一个外部静态缓存区进行缓存存储这些非return但是又很重要且频繁的过程变量，来避免重复计算。
Model.session = {
    // //.get操作时，由于特殊作用域关键字导致寻址方向的改变，所以此缓存实际get所对的真实model
    // //如，model.get("$PARENT.key")，这里key实际上归宿与model.parentModel，所以topGetter存储model.parentModel
    // topGetter: $NULL,
    // //同上，但是是针对set操作
    // topSetter: $NULL,
    // //在上面的例子中，在过滤掉关键字后的实际key值
    // filterKey: $NULL,
    //用于保存数据更新引发的递归中的堆栈数，本质上是为了在最后一层调用结束后运行所收集的finallyRun，所收集的主要来自View层各种handle处理内部
    finallyRunStacks: []
};

/*
 * Modeld的工具函数finallyRun，在set内部时有些操作必须提到set完成后才能运行，模拟线程安全
 */

//这里保存finallyRun的处理函数集合
// to avoid `set` in setting 
var _finallyQuene = Model._finallyQuene = [];
//一个hash存储区，确保不重复注册处理函数
var _finallyQuene_hash = {};
var finallyRun = Model.finallyRun = function(fun) {
    if (fun) {
        //直接通过toString来注册
        finallyRun.register(fun, fun);
    } else {
        //将事件队列完全推出直到运行结束，不用$.E(ach)因为队列可能动态增长
        while (_finallyQuene.length) {
            var funid = _finallyQuene.shift();
            fun = _finallyQuene_hash[funid];
            _finallyQuene_hash[funid] = $NULL;
            fun && fun();
        }
    }
}
//使用唯一标示注册事件
finallyRun.register = function(id, fun) {
    if (!_finallyQuene_hash[id]) {
        $.p(_finallyQuene, id);
    }
    _finallyQuene_hash[id] = fun;
}

/*
 * 根据key冒泡获取顶层的Model以及拼接的key路径
 */
var _getTopInfoByKey = Model.getTopInfoByKey = function(model, key) {
    var parent = model._parentModel,
        result,
        prefix;
    if (parent) {
        prefix = model._prefix //||"" ,all prefix has been filter $scope key
        key ? (prefix && (key = prefix + "." + key) /*else key = key*/ ) : (prefix && (key = prefix) /*key=""*/ );
        result = _getTopInfoByKey(parent, key)
    } else {
        result = {
            model: model,
            key: key
        };
    }
    return result;
}

/*
 * 用户记录set的堆栈层数，来实现强制变更数据而不通过判断相同与否再触发
 */
var _dm_force_update = 0;

/*
 * 为Model拓展出智能作用域寻址的功能
 * 目前有五种作用域寻址：
 * 1. $THIS 当前作用域寻址
 * 2. $PARENT 父级作用域寻址
 * 3. $TOP 顶级作用域寻址
 * 4. $PRIVATE 私有数据库寻址
 * 5. $JS 全局数据寻址

 * 6. $Index 数组类型的下标
 * 7. $Path 当前Model到顶层Model的前缀集合
 */
;
(function() {
    /*
     * 路由寻址Model
     */
    var routerMap = Model._routerMap = {
        "$Private": function(model, key) {
            return model._privateModel || (model._privateModel = new Model);
        },
        "$Js": function(model, key) {
            return _jSouperBase.$JS;
        },
        "$Parent": function(model, key) {
            //将prefix进行缩减
            var prefixKey = model._prefix;
            var result;
            if (prefixKey) {
                var parentModel = model._parentModel;
                if (prefixKey = $.lst(prefixKey, ".")) { //和上一级之间还隔了好几个"."
                    result = parentModel.buildModelByKey(prefixKey /*+ "." + key*/ );
                } else { //只有一级的前缀，则直接返回
                    result = parentModel;
                }
            }
            return result;
        },
        "$This": function(model, key) {
            return model;
        },
        "$Top": function(model, key) {
            var next;
            while (next = model._parentModel) {
                model = next;
            }
            return model;
        }
    }
    /*
     * 通用寻址函数
     */
    //根据带routerKey的字符串进行查找并生成model
    Model.$router = function(model, key) {
        var result = {
            model: model,
            key: key //|| ""
        };
        if (key) {
            var routerKey = $.st(key, ".");
            //及时缓存剩余的键值
            var remainingKey = _split_laveStr;
            if (!routerKey) {
                routerKey = remainingKey;
                remainingKey = $FALSE;
            }
            var routerHandle = routerMap[routerKey];
            if (routerHandle) {
                model = routerHandle(model, remainingKey /*过滤后的key*/ );
                if (model) { //递归路由
                    result = Model.$router(model, remainingKey)
                } else { //找不到
                    result.model = model;
                    result.key = remainingKey;
                }
            }
        }
        return result;
    };
    /*
     * 自定义字段的set、get
     */
    var defineKeyMap = Model._defineKeyMap = {
        "$Index": {
            set: function() {
                console.error("$Index is read only.");
            },
            get: function(model, key) {
                if (key = model._prefix) {
                    $.lst(key, ".")
                    return _split_laveStr;
                }
            }
        },
        "$Path": {
            set: function() {
                console.error("$Path is read only.");
            },
            get: function(model) {
                var result = model._prefix;
                var next;
                while ((next = model._parentModel) && next._prefix) {
                    model = next;
                    result = model._prefix + (result ? ("." + result) : "");
                }
                return result;
            }
        }
    }
    Model.$defineKey = function(model, key) {
        var result = {
            definer: $NULL,
            key: key
        }
        var defineKey = $.st(key, ".");
        var remainingKey = _split_laveStr;
        if (!defineKey) {
            defineKey = remainingKey;
            remainingKey = $FALSE;
        }
        var definer = defineKeyMap[defineKey];
        if (definer) {
            result.definer = definer
            result.key = remainingKey
        }
        return result;
    }
    var _get = __ModelProto__.get,
        _set = __ModelProto__.set,
        set = __ModelProto__.set = function(key) {
            var self = this,
                args = arguments /*$.s(arguments)*/ ,
                result;
            if (args.length > 1) {
                //查找关键字匹配的Model
                var router_result = Model.$router(self, key);
                if (self = router_result.model) {
                    if (key = router_result.key) {
                        //查找通用自定义关键字
                        var define_result = Model.$defineKey(self, key);
                        var definer = define_result.definer
                        if (definer) {
                            result = definer.set(self, define_result.key)
                        }
                    }
                    if (!definer) {
                        key ? (args[0] = key) : $.sp.call(args, 0, 1)
                        result = _set.apply(self, args);
                    }
                }
            } else { //one argument
                result = _set.call(self, key);
            }
            return result
        },
        get = __ModelProto__.get = function(key) {
            var self = this,
                args = arguments /*$.s(arguments)*/ ,
                result;
            if (args.length > 0) {
                //查找关键字匹配的Model
                var router_result = Model.$router(self, key);
                if (self = router_result.model) {
                    if (key = router_result.key) {
                        //查找通用自定义关键字
                        var define_result = Model.$defineKey(self, key);
                        var definer = define_result.definer
                        if (definer) {
                            result = definer.get(self, define_result.key)
                        }
                    }
                    if (!definer) {
                        key ? (args[0] = key) : $.sp.call(args, 0, 1)
                        result = _get.apply(self, args);
                    }
                }
            } else {
                result = _get.call(self);
            }
            return result;
        },
        _buildModelByKey = __ModelProto__.buildModelByKey,
        buildModelByKey = __ModelProto__.buildModelByKey = function(key) {
            var router_result = Model.$router(this, key);
            return _buildModelByKey.call(router_result.model, router_result.key);
        };

    Model.configPrefix = function(prefixConfig) {
        var systemPrefix = __ModelConfig__.prefix
        $.fI(prefixConfig, function(newKey, index) {
            var oldKey = systemPrefix[index];
            var keyMap = (routerMap[oldKey] && routerMap) || (defineKeyMap[oldKey] && defineKeyMap);
            if (keyMap) {
                keyMap[newKey] = keyMap[oldKey];
                keyMap[oldKey] = $UNDEFINED;
            }
            systemPrefix[index] = newKey;
        })
    }

}());

/*
 * Model的代理层
 * 小巧灵活的功能，为VM提供更强悍的Model适配引擎
 * 在v4版本中需要同时管理静态的数据与动态的代理，v5版本中将二者分离，从而带来更快更灵活稳定的体验
 */

function ProxyModel(entrust, model) {
    var self = this;

    //存储委托对象
    self.entrust = entrust;
    //双向绑定
    entrust.model = self;

    //委托对象的构造函数
    var EntrustConstructor = self.EntrustConstructor = entrust.constructor;

    //存储收留的pm对象
    self._childProxyModel = [];

    //“被收留者”的身份标记，动态生成，与model层的不同，这是保留最原始的key，且是代表VM关系的前缀。
    //Model层的prefix是代表数据结构上的
    // self._prefix

    //来自委托对象的触发器集合，需要委托对象实现静态_buildSmartTriggers接口
    self._smartTriggers = EntrustConstructor._buildSmartTriggers(entrust);
    /*
     * 存储Model对象
     * 这里只是单向存储model实例，model只存储触发器。不管你pm对象
     */
    if (model) {
        model instanceof Model || (model = Model(model));
        self.follow(model)
    }
};

var __ProxyModelProto__ = ProxyModel.prototype = {
    queryElement: function(matchFun) {
        var self = this;
        matchFun = _buildQueryMatchFun(matchFun);
        var result = self.entrust._queryElement(matchFun);
        $.E(self._childProxyModel, function(proxyModel) {
            result.push.apply(result, proxyModel.queryElement(matchFun));
        });
        return result;
    },
    //收留独立的代理层为model中的一份子，必要时会为其开辟新的子model块
    shelter: function(proxyModel, key) {
        var self = this;
        //校准参数，proxyModel为ProxyModel对象，而不是VM或者PM对象
        (proxyModel instanceof self.EntrustConstructor) && (proxyModel = proxyModel.model);
        if (proxyModel instanceof ProxyModel) {
            //标记为“被收留者”
            proxyModel._prefix = key /*|| ""*/ ;
            $.p(self._childProxyModel, proxyModel);
            proxyModel.follow(self.model, key);
            /*//私有Model跟着触发更新
            var privateModel = proxyModel.model._privateModel;
            privateModel && privateModel.touchOff();*/
        }
    },
    //和指定的Model进行合并，吸附在指定Model上
    combine: function(model) {
        var self = this;
        self.model = model;
    },
    //进入指定的Model或者其的key指定的下属中
    follow: function(model, key) {
        var self = this;
        if (model instanceof Model) {
            var currentModel = model.buildModelByKey(key);
            self.combine(currentModel);
            self.rebuildTree();
            self.onfollow && self.onfollow();
        }
    },
    $router: function(key) {
        var self = this,
            model = self.model,
            result;
        if (model) {
            result = Model.$router(model, key);
        } else {
            result = {
                model: model,
                key: key
            }
        }
        return result;
    },
    /*
     * 整理委托者的触发器，为其重新定位到正确的Model
     */
    rebuildTree: function() {
        var self = this;
        var model = self.model;
        if (model) {
            //递归重建
            $.E(self._childProxyModel, function(proxyModel) {
                //为“被收留者”重新定位到正确的Model，并重定位触发器位置
                proxyModel.follow(model, proxyModel._prefix);
            })
            //重新定位触发器位置
            $.E(self._smartTriggers, function(smartTrigger) {
                smartTrigger.rebuild();
            });
        }
    }
};
/*
 * 为ProxyModel拓展Model类的功能
 */

$.E(["set", "get", "touchOff"], function(handleName) {
    __ProxyModelProto__[handleName] = function() {
        var self = this;
        var model = self.model;
        if (model) {
            return model[handleName].apply(model, arguments)
        }
    }
});
/*
 * 增加ProxyModel的数据操作的功能
 */

var __setTool = {
    //可用做forEach
    map: $.map,
    //可用做remove
    filter: $.filter,
    push: function( /*baseArr*/ ) {
        var args = $.s(arguments),
            result = $.s(args.shift());
        Array.prototype.push.apply(result, args);
        return result;
    },
    pop: function(baseArr) {
        baseArr = $.s(baseArr);
        baseArr.pop();
        return baseArr;
    },
    _boolAvator: _placeholder(),
    toggle: function(baser, toggler) {
        if ($.isA(baser) || ($.isO(baser) && typeof baser.length === "number" && (baser = $.s(baser)))) { //数组型或类数组型
            var index = baser.indexOf(toggler);
            index === -1 ? baser.push(toggler) : baser.splice(index, 1);
        } else if ($.isS(baser)) { //字符串型
            baser.indexOf(toggler) === -1 ? baser += toggler : (baser = baser.replace(toggler, ""));
        } else { //其余都用Boolean型处理
            if ((baser instanceof Boolean) && baser.hasOwnProperty(__setTool._boolAvator)) {
                baser = baser[__setTool._boolAvator];
            } else {
                var boolBaser = new Boolean(!baser);
                boolBaser[__setTool._boolAvator] = baser;
                baser = boolBaser;
            }
        }
        return baser;
    }
};

function __setToolFun(type) {
    var handle = __setTool[type];
    return function(key_of_object) {
        var self = this.model;
        if (self) {
            var result,
                args = $.s(arguments);
            args[0] = self.get(key_of_object);
            result = handle.apply($NULL, args);
            self.set(key_of_object, result)
            return result
        }
    }
}

$.fI(__setTool, function(handle, key) {
    __ProxyModelProto__[key] = __setToolFun(key);
});

__ProxyModelProto__.mix = function(key_of_obj) {
    //mix Data 合并数据
    //TODO:复合操作，直接移动到ViewModel层，Model层只提供最基本的get、set
    var self = this.model;
    if (self) {
        var result,
            args = $.s(arguments);
        args.shift();
        if (args.length) { //arguments>=2
            args.unshift(self.get(key_of_obj));
            result = _jSouperBase.extend.apply($NULL, args);
            self.set(key_of_obj, result);
        }
        return result;
    }
}

// make an Object-Constructor to Model-Extend-Object-Constructor
var _modelExtend = Model.extend = function(extendsName, extendsObjConstructor) {
    if (_modelExtend.hasOwnProperty(extendsName)) {
        throw Error(extendsName + " is defined!");
    }
    var exObjProto = extendsObjConstructor.prototype
    exObjProto[_DM_extends_object_constructor] = $TRUE;
    _modelExtend.set(exObjProto)
    _modelExtend.get(exObjProto)
    Model[extendsName] = extendsObjConstructor
};
//get的结果并不保存到this.value，原则上setter、getter本身就不能通过return保存。
//这里为了方便，仅仅运行setter可以通过return保存，避免混乱
//如果需要缓存，开发者需要知识额外定义缓冲变量进行缓存
_modelExtend.set = function(exObjProto) {
    var _set = exObjProto.set;
    exObjProto.set = function(dm, key, value, currentKey) {
        return (this.value = _set.call(this, dm, key, value, currentKey))
    }
}
_modelExtend.get = function(exObjProto) {
    var _get = exObjProto.get;
    exObjProto.get = function(dm, key, value, currentKey) {
        return _get.call(this, dm, key, value, currentKey);
    }
}

//by RubyLouvre(司徒正美)
//setAttribute bug:http://www.iefans.net/ie-setattribute-bug/
var IEfix = {
    acceptcharset: "acceptCharset",
    accesskey: "accessKey",
    allowtransparency: "allowTransparency",
    bgcolor: "bgColor",
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    "class": "className",
    colspan: "colSpan",
    // checked: "defaultChecked",
    selected: "defaultSelected",
    "for": "htmlFor",
    frameborder: "frameBorder",
    hspace: "hSpace",
    longdesc: "longDesc",
    maxlength: "maxLength",
    marginwidth: "marginWidth",
    marginheight: "marginHeight",
    noresize: "noResize",
    noshade: "noShade",
    readonly: "readOnly",
    rowspan: "rowSpan",
    tabindex: "tabIndex",
    valign: "vAlign",
    vspace: "vSpace",
    DOMContentLoaded: "readystatechange"
},
    /*
The full list of boolean attributes in HTML 4.01 (and hence XHTML 1.0) is (with property names where they differ in case): 

checked             (input type=checkbox/radio) 
selected            (option) 
disabled            (input, textarea, button, select, option, optgroup) 
readonly            (input type=text/password, textarea) 
multiple            (select) 
ismap     isMap     (img, input type=image) 

defer               (script) 
declare             (object; never used) 
noresize  noResize  (frame) 
nowrap    noWrap    (td, th; deprecated) 
noshade   noShade   (hr; deprecated) 
compact             (ul, ol, dl, menu, dir; deprecated) 
//------------anyother answer 
all elements: hidden 
script: async, defer 
button: autofocus, formnovalidate, disabled 
input: autofocus, formnovalidate, multiple, readonly, required, disabled, checked 
keygen: autofocus, disabled 
select: autofocus, multiple, required, disabled 
textarea: autofocus, readonly, required, disabled 
style: scoped 
ol: reversed 
command: disabled, checked 
fieldset: disabled 
optgroup: disabled 
option: selected, disabled 
audio: autoplay, controls, loop, muted 
video: autoplay, controls, loop, muted 
iframe: seamless 
track: default 
img: ismap 
form: novalidate 
details: open 
object: typemustmatch 
marquee: truespeed 
//---- 
editable 
draggable 
*/
    _AttributeHandle = function(attrKey, element) {
        var assign;
        var attrHandles = V.attrHandles,
            result;
        $.e(attrHandles, function(attrHandle) {
            if (attrHandle.match(attrKey)) {
                // if (element.type==="textarea") {debugger}
                result = attrHandle.handle(attrKey, element);
                return $FALSE
            }
        });
        return result || _AttributeHandleEvent.com;
    },
    _templateMatchRule = /\{[\w\W]*?\{[\w\W]*?\}[\s]*\}/,
    _fixAttrKey = function(attrKey) {
        attrKey = attrKey.indexOf(V.prefix) /*!== 0*/ ? attrKey : attrKey.replace(V.prefix, "")
        attrKey = (_isIE && IEfix[attrKey]) || attrKey
        return attrKey;
    },
    _getAttrViewModel = function(attrValue) {
        var AttrView = V.attrModules[attrValue];
        if (!AttrView) {
            //属性VM都是共享的，因为简单，玩玩只有少于10个的触发key。
            AttrView = V.attrModules[attrValue] = jSouper.parse(attrValue, attrValue)
            AttrView.instance = AttrView($UNDEFINED, {
                isAttr: $TRUE
            });
        }
        return AttrView.instance
    },
    attributeHandle = function(attrKey, attrValue, node, handle, triggerTable) {
        attrKey = _fixAttrKey(attrKey);

        var attrViewModel = _getAttrViewModel(attrValue);

        //获取对应的属性处理器
        var _attributeHandle = _AttributeHandle(attrKey, node);
        attrViewModel._isAttr = {
            key: attrKey
        }
        var attrTrigger = {
            handleId: handle.id + attrKey,
            key: attrKey,
            type: "attributesTrigger",
            event: function(NodeList, model, /* eventTrigger,*/ isAttr, viewModel_ID) { /*NodeList, model, eventTrigger, self._isAttr, self._id*/
                var currentNode = NodeList[handle.id].currentNode,
                    viewModel = V._instances[viewModel_ID];
                if (currentNode) {
                	//绑定数据域
                    attrViewModel.model = model;
                    //更新所有节点
                    $.E(attrViewModel._triggers, function(key) { //touchoff all triggers
                        attrViewModel.touchOff(key);
                    });
                    _attributeHandle(attrKey, currentNode, attrViewModel.topNode(), viewModel, /*model.id,*/ handle, triggerTable);
                    // model.remove(attrViewModel); //?
                }
            }
        }

        //将属性VM的所有的触发key映射到父VM中。让父VM托管
        $.E(attrViewModel._triggers, function(key) {
            //TODO:这里是要使用push还是unshift?
            //如果后者，则View再遍历属性时就需要reverse
            //如果前者，会不会因为触发顺序而导致程序逻辑出问题
            $.p(triggerTable[key] || (triggerTable[key] = []), attrTrigger);
        });
        // node.removeAttribute(baseAttrKey);
        //}
    };

/*
 * View constructor
 */

function View(arg, vmName) {
    var self = this;
    if (!(self instanceof View)) {
        return new View(arg, vmName);
    }
    self.handleNodeTree = arg;
    self._handles = [];
    self._triggerTable = {};
    self.vmName = vmName;
    self.id = $.uid();

    // console.group(self.id);
    // console.log(vmName)
    _buildHandler(self);
    _buildTrigger(self);

    V._scansVMInit(arg.node, vmName);

    //缓存DOM工厂生产流水线
    _DOMFactory(self);
    return function(data, opction) {
        var id = $.uid();
        var finallyRunStacks = Model.session.finallyRunStacks;
        opction || (opction = {});

        //push mark
        finallyRunStacks.push(id)

        var vi = _create(self, data, opction.isAttr);

        //触发初始化事件，在finallyRun前运行，为了也在return前运行：
        //为了finallyRun可能触发的VM初始化。
        //有些VM的创建是判断一个缓存器中时候有实例对象，而此刻还没有return，
        //实例对象还没有进入缓存器，这时运行finallyRun，会造成空缓存器而判断错误，所以这里需要一个onInit事件机制，来做缓存器锁定
        opction.onInit && opction.onInit(vi);


        // vi.model.touchOff();
        // _jSouperBase.$JS.touchOff();

        //pop mark
        finallyRunStacks.pop();

        //last layer,and run finallyRun
        !finallyRunStacks.length && finallyRun();

        //在return前运行回调
        //在initVM前（text/vm所定义的），确定subset、collect等关系
        opction.callback && opction.callback(vi);

        if (self.vmName) {
            var viewModel_init = V.modulesInit[self.vmName];
            if (viewModel_init) {
                viewModel_init(vi);
            }
        }

        vi.model._privateModel && vi.model._privateModel.touchOff();

        return vi
    }
};

var _outerHTML = (function() {
    var _wrapDIV = fragment();
    var _tagHTML = function(node) {
        node = $.D.cl(node);
        _wrapDIV.appendChild(node);
        var outerHTMLStr = _wrapDIV.innerHTML;
        _wrapDIV.removeChild(node);

        return outerHTMLStr;
    }
    var fireOuterHTML = function(node) {
        var outerHTMLStr = _tagHTML(node);
        var tagNamespace = V.namespace.toUpperCase();
        if (outerHTMLStr.toUpperCase().indexOf(tagNamespace) === 1) { //tagName = <attr-xxx></attr-xxx>
            var plen = tagNamespace.length;
            var alltagName = rtagName.exec(outerHTMLStr)[1];
            var _perfixStr = "<" + outerHTMLStr.substr(plen + 1, outerHTMLStr.length - plen - alltagName.length - 2);
            var _laveStr = outerHTMLStr.substr(outerHTMLStr.length - alltagName.length - 1 + plen)
            outerHTMLStr = _perfixStr + _laveStr;
        }
        return outerHTMLStr;
    }
    return fireOuterHTML;
}());

var _isHTMLUnknownElement = (function(HUE) {
    var __knownElementTag = {};
    $.E("a abbr acronym address applet area b base basefont bdo big blockquote body br button caption center cite code col colgroup dd del dfn dir div dl dt em fieldset font form frame frameset head hr html i iframe img input ins kbd label legend li link map menu meta noframes noscript object ol optgroup option p param pre q s samp script select small span strike strong style sub sup table tbody td textarea tfoot th thead title tr tt u ul var marquee h1 h2 h3 h4 h5 h6 xmp plaintext listing nobr bgsound bas blink comment isindex multiple noframe person".split(" "), function(tagName, index) {
        __knownElementTag[tagName] = $TRUE;
    });
    var result;
    if (HUE) {
        result = function(tagName) {
            if (__knownElementTag[tagName] === $UNDEFINED) {
                __knownElementTag[tagName] = !(doc.createElement(tagName) instanceof HTMLUnknownElement);
            }
            return !__knownElementTag[tagName];
        }
    } else {
        result = function(tagName) {
            //maybe HTMLUnknownElement,IE7- can't konwn
            return !__knownElementTag[tagName];
        }
    }
    return result;
}(typeof HTMLUnknownElement === "function"));
var _unkonwnElementFix = {
    // "class": "className"
};

function _buildHandler(self) {
    var handles = self._handles;
    var handleNodeTree = self.handleNodeTree;
    _traversal(handleNodeTree, function(handle, index, parentHandle) {
        handle.parentNode = parentHandle;
        var node = handle.node;
        if (handle.type === "handle") {
            var handleHandle = V.handles[handle.handleName];
            if (handleHandle) {
                var handle = handleHandle(handle, index, parentHandle)
                handle && $.p(handles, handle);
            }
        } else if (handle.type === "element") {
            handle.tag = node.tagName.toLowerCase().replace(V.namespace.toLowerCase(), "");
        }
    });
};
var ignoreTagNameMap = {};
$.fI("script|pre|template|style|link".split("|"), function(value, key) {
    ignoreTagNameMap[value] = ignoreTagNameMap[value.toUpperCase()] = $TRUE;
})

function _buildTrigger(self) {
    var triggerTable = self._triggerTable;
    var handleNodeTree = self.handleNodeTree;
    _traversal(handleNodeTree, function(handle, index, parentHandle) {
        if (handle.type === "handle") {
            var triggerFactory = V.triggers[handle.handleName];
            if (triggerFactory) {
                var trigger = triggerFactory(handle, index, parentHandle);
                if (trigger) {
                    var key = trigger.key || (trigger.key = "");
                    trigger.handleId = trigger.handleId || handle.id;
                    //unshift list and In order to achieve the trigger can be simulated bubble
                    $.us((triggerTable[key] || (triggerTable[key] = [])), trigger); //Storage as key -> array
                    $.p(handle._triggers, trigger); //Storage as array
                }
            }
        } else if (handle.type === "element") {
            var node = handle.node;
            handle.tag = node.tagName.toLowerCase().replace(V.namespace.toLowerCase(), "");
            if (ignoreTagNameMap[handle.tag]) {
                return $FALSE;
            }
            $.E($.s(node.attributes) /*.reverse()*/ , function(attr, i) {
                var value = attr.value,
                    name = attr.name;
                if (_templateMatchRule.test(value)) {
                    attributeHandle(name, value, node, handle, triggerTable);
                    node.removeAttribute(name);
                }
            });
            var nodeHTMLStr = _outerHTML(node);
            if (wrapMap.hasOwnProperty(handle.tag)) {
                var wrapStr = wrapMap[handle.tag];
                handle.tagDeep = wrapStr[0];
                handle.nodeStr = wrapStr[1] + nodeHTMLStr + wrapStr[2];
            } else {
                handle.nodeStr = nodeHTMLStr;
            }
            if (_isHTMLUnknownElement(handle.tag)) {

                (handle._unEleAttr = [])._ = {};
                //save attributes
                $.E(node.attributes, function(attr) {
                    //fix IE
                    var name = attr.name;
                    var value = node.getAttribute(name);
                    if (value === $NULL || value === "") { //fix IE6-8 is dif
                        name = _isIE && IEfix[name];
                        value = name && node.getAttribute(name);
                    }
                    //boolean\tabIndex should be save
                    //style shoule be handle alone
                    if (name && value !== $NULL && value !== "" && name !== "style") {
                        // console.log(name,value);
                        //be an Element, attribute's name may be diffrend;
                        name = (_isIE ? IEfix[name] : _unkonwnElementFix[name]) || name;
                        $.p(handle._unEleAttr, name);
                        handle._unEleAttr._[name] = value;
                        // console.log("saveAttribute:", name, " : ", value, "(" + name + ")");
                    }
                });
                //save style
                var cssText = node.style.cssText;
                if (cssText) {
                    handle._unEleAttr._["style"] = cssText;
                }
            }
        } else if (handle.type === "comment") { //Comment
            !handle.nodeStr && (handle.nodeStr = "<!--" + handle.node.data + "-->");
        } else { // textNode 
            //stringHandle:如果这个文本节点是绑定值的（父节点是处理函数节点），那么这个文本节点的默认渲染将是空
            handle.nodeStr === $UNDEFINED && (handle.nodeStr = handle.asArg ? "" : handle.node.data);
        }
    });
};

function _DOMFactory(self) {
    var NodeList = self.NodeList = {},
        topNode = self.handleNodeTree /*$.c(self.handleNodeTree)*/ ;
    //将id按数组存储，加速循环速度
    var nodeListIds = NodeList._ = [];
    NodeList._T = topNode.id;
    // topNode.currentNode = fragment("body");
    pushById(NodeList, topNode, nodeListIds);


    var catchNodes = self._catchNodes = [];
    var catchNodesStr = "";
    _traversal(topNode, function(handle, index, parentNode) {
        handle = pushById(NodeList, handle, nodeListIds);
        if (!handle.ignore) {
            var _unknownElementAttribute = handle._unEleAttr;
            if (_unknownElementAttribute) { //HTMLUnknownElement
                /*currentNode = doc.createElement(handle.tag);
                $.E(_unknownElementAttribute, function(attrName) {
                    // console.log("setAttribute:", attrName, " : ", _unknownElementAttribute._[attrName])
                    //直接使用赋值的话，非标准属性只会变成property而不是Attribute
                    // currentNode[attrName] = _unknownElementAttribute._[attrName];
                    currentNode.setAttribute(attrName, _unknownElementAttribute._[attrName]);
                })
                //set Style
                var cssText = _unknownElementAttribute._["style"];
                if (cssText) {
                    currentNode.style.cssText = cssText;
                }*/
            } else if ("nodeStr" in handle) {
                if (handle.type === "text") {
                    var currentNode = doc.createTextNode(handle.nodeStr);
                } else { //Element and comment
                    catchNodesStr += handle.nodeStr
                }
            } else { // ignored tagName 
                // if (handle.node.tagName === "SCRIPT") {
                //     currentNode = doc.createElement("script");
                //     //TODO:clone attribute;
                //     currentNode.text = handle.node.text;
                //     currentNode.src = handle.node.src;
                //     // console.log(scriptNode)
                //     handle.node.parentNode.replaceChild(currentNode, handle.node);
                // }else{
                // return;
                currentNode = $.D.cl(handle.node);
                // }
            }
            handle.currentNode = currentNode;

            $.p(catchNodes, {
                parentId: parentNode.id,
                currentId: handle.id
            })
        } else {
            //ignore Node's childNodes will be ignored too.
            //just create an instance
            _traversal(handle, function(handle) {
                $.p(nodeListIds, handle.id)
                pushById(NodeList, handle, nodeListIds);
            });
            return $FALSE
        }
    });
    self.catchNodesStr = catchNodesStr
}

function pushById(hashSet, item, arr) {
    var id = item.id
    if (!hashSet[id]) {
        hashSet[id] = item;
        $.p(arr, id);
    }
    return item;
};

function _create(self, data, isAttribute) { //data maybe basedata or model

    var catchNodes = self._catchNodes;
    var catchNodesStr = self.catchNodesStr;

    var NodeList = self.NodeList;
    var NodeList_of_ViewModel = {};
    $.E(NodeList._, function(hanldeNode_id) {
        //将节点进行包裹，使用原型读取
        NodeList_of_ViewModel[hanldeNode_id] = $.c(NodeList[hanldeNode_id]);
    });
    //生成顶层存储区
    NodeList_of_ViewModel[NodeList._T].currentNode = fragment("body");


    //createNode
    var nodeCollections = $.D.cs("<div>" + catchNodesStr + "</div>");

    var queryList = ViewModel.queryList;
    var queryMap = queryList._;

    $.E(catchNodes, function(nodeInfo) {
        var parentHandle = NodeList_of_ViewModel[nodeInfo.parentId];
        var parentNode = parentHandle.currentNode;
        var currentHandle = NodeList_of_ViewModel[nodeInfo.currentId];
        var currentNode = currentHandle.currentNode;
        var _unknownElementAttribute = currentHandle._unEleAttr;
        if (_unknownElementAttribute) {
            currentNode = doc.createElement(currentHandle.tag);
            $.E(_unknownElementAttribute, function(attrName) {
                // console.log("setAttribute:", attrName, " : ", _unknownElementAttribute._[attrName])
                //直接使用赋值的话，非标准属性只会变成property而不是Attribute
                // currentNode[attrName] = _unknownElementAttribute._[attrName];
                currentNode.setAttribute(attrName, _unknownElementAttribute._[attrName]);
            })
            //set Style
            var cssText = _unknownElementAttribute._["style"];
            if (cssText) {
                currentNode.style.cssText = cssText;
            }
        } else if (!currentNode) {
            currentNode = nodeCollections.firstChild;
            if (currentHandle.tagDeep) {
                switch (currentHandle.tagDeep) {
                    case 3:
                        currentNode = currentNode.lastChild;
                    case 2:
                        currentNode = currentNode.lastChild;
                    default: // case 1
                        currentNode = currentHandle.currentNode = currentNode.lastChild;
                        nodeCollections.removeChild(nodeCollections.firstChild);
                }
            }
        } else { // if(currentNode.nodeType===3) 文本节点、script节点等直接拷贝
            currentNode = $.D.cl(currentNode);
        }
        if (!currentNode) debugger
        $.D.ap(parentNode, currentHandle.currentNode = currentNode);
        if (currentNode.nodeType === 1) {
            $.p(queryList, currentNode);
            queryMap[$.hashCode(currentNode)] = currentHandle;
        }
    })

    $.e(self._handles, function(handle) {
        handle.call(self, NodeList_of_ViewModel);
    });
    var result = new ViewModel(self.handleNodeTree, NodeList_of_ViewModel, self._triggerTable, data);
    result.vmName = self.vmName;
    return result;
};

/*
 * View Instance constructor
 */
var stopTriggerBubble; // = $FALSE;

function _addAttr(viewModel, node, attrJson) {
    //保存新增属性说对应的key，返回进行统一触发
    var result = [];
    var handle = jSouper.queryHandle(node);
    $.fI(attrJson, function(attrValue, attrKey) {
        attrKey = _fixAttrKey(attrKey);
        var attrViewModel = _getAttrViewModel(attrValue);
        //获取对应的属性处理器
        var _attributeHandle = _AttributeHandle(attrKey, node);
        var attrTrigger = {
            handleId: handle.id + attrKey,
            key: attrKey,
            type: "attributesTrigger",
            event: function(NodeList, model, /* eventTrigger,*/ isAttr /*, viewModel_ID*/ ) { /*NodeList, model, eventTrigger, self._isAttr, self._id*/
                //addAttr是违反解析规则的方法，所以VM的获取不一定是正确的，node与vm只能通过传入的参数确定
                // var viewModel = V._instances[viewModel_ID];

                attrViewModel.model = model;
                $.E(attrViewModel._triggers, function(key) { //touchoff all triggers
                    attrViewModel.touchOff(key);
                });
                _attributeHandle(attrKey, node, /*_shadowDIV*/ attrViewModel.topNode(), viewModel, /*model.id,*/ handle, triggerTable);
                // model.remove(attrViewModel); //?
            }
        }
        var triggerTable = viewModel._triggers._;
        $.E(attrViewModel._triggers, function(key) {
            var triggerContainer = triggerTable[key];
            var smartTriggers = viewModel.model._smartTriggers
            if (!triggerContainer) {
                // ViewModel._buildSmart(viewModel, key);//.rebuild();
                triggerContainer = triggerTable[key] = [];
                $.p(viewModel._triggers, key);
                $.p(result, key);
                var smartkeyTrigger = ViewModel._buildSmart(viewModel, key)
                $.p(smartTriggers, smartTriggers._[key] = smartkeyTrigger);
            } else {
                smartkeyTrigger = smartTriggers._[key];
            }
            $.us(triggerContainer, attrTrigger);
            //强制更新
            smartkeyTrigger.rebuild($TRUE);
        });
    });
    // viewModel.model.rebuildTree();
    // viewModel.model.touchOff();
    return result;
};

function ViewModel(handleNodeTree, NodeList, triggerTable, model) {
    if (!(this instanceof ViewModel)) {
        return new ViewModel(handleNodeTree, NodeList, triggerTable, model);
    }
    var self = this;
    self._isAttr = $FALSE; //if no null --> Storage the attribute key and current.
    self._isEach = $FALSE; //if no null --> Storage the attribute key and current.
    self.handleNodeTree = handleNodeTree;
    self.DOMArr = $.s(handleNodeTree.childNodes);
    self.NodeList = NodeList;
    var el = self.topNode(); //NodeList[handleNodeTree.id].currentNode;
    self._packingBag = el;
    V._instances[self._id = $.uid()] = self;
    self._open = $.D.C(self._id + " _open");
    self._close = $.D.C(self._id + " _close");

    self._canRemoveAble = $FALSE;

    self._AVI = {};
    self._ALVI = {};
    self._WVI = {};
    self._teleporters = {};
    // self._arrayViewModel = $NULL;

    $.D.iB(el, self._open, el.childNodes[0]);
    $.D.ap(el, self._close);
    (self._triggers = [])._ = {};
    // self._triggers._u = [];//undefined key,update every time
    self.TEMP = {};
    $.fI(triggerTable, function(tiggerCollection, key) {
        $.p(self._triggers, key);
        self._triggers._[key] = tiggerCollection;
    });

    self.constructor = ViewModel;
    //为vm加上Model代理层
    new ProxyModel(self, model);

    //转移到proxyModel中
    // self._smartTriggers = [];

    // //bind viewModel with DataManger
    // model.collect(self); //touchOff All triggers

    //console.group(self._id,"touchOff .")
    stopTriggerBubble = $TRUE;
    self.touchOff("."); //const value
    stopTriggerBubble = $FALSE;
    //console.groupEnd(self._id,"touchOff .")
};

/*
 * 静态函数
 */
//_buildSmartTriggers接口，
ViewModel._buildSmartTriggers = function(viewModel, sKey) {
    var smartTriggers = [];
    smartTriggers._ = {};
    $.E(viewModel._triggers, function(sKey) {
        $.p(smartTriggers, smartTriggers._[sKey] = ViewModel._buildSmart(viewModel, sKey));
    });
    return smartTriggers;
}
//VM通用的重建接口
var _smartTriggerHandle_rebuild = function(forceUpdate) {
    var smartTrigger = this;
    var TEMP = smartTrigger.TEMP;
    var viewModel = TEMP.vM;
    var router_result = viewModel.model.$router(TEMP.sK);
    var topGetter = router_result.model,
        matchKey = router_result.key || "";
    var currentTopGetter = TEMP.md;
    if (topGetter !== currentTopGetter) {
        TEMP.md = topGetter
        if (currentTopGetter) {
            smartTrigger.unbind(currentTopGetter._triggerKeys)
        }
        if (topGetter) {
            smartTrigger.matchKey = matchKey;
            smartTrigger.bind(topGetter._triggerKeys);
            // finallyRun.register(viewModel._id + TEMP.sK, function() {
            //因为Model是惰性生成的，因此在Model存在的情况下已经可以进行更新DOM节点了
            smartTrigger.event(topGetter._triggerKeys)
            // });
        }
    }
    if (forceUpdate && topGetter) {
        smartTrigger.event(topGetter._triggerKeys)
    }
};
//_buildSmart接口
ViewModel._buildSmart = function(viewModel, sKey) {
    var smartTrigger = new SmartTriggerHandle(
        sKey || "", //match key
        vm_buildSmart_event, //VM通用的触发函数
        { //TEMP data
            vM: viewModel,
            sK: sKey
        }
    );
    smartTrigger.rebuild = _smartTriggerHandle_rebuild;
    // viewModel._triggers._[sKey]._ = smartTrigger;
    return smartTrigger;
}

var vm_buildSmart_event = function(smartTriggerSet) {
    var TEMP = this.TEMP;
    TEMP.vM.touchOff(TEMP.sK);
}

var VI_session = ViewModel.session = {
    touchHandleIdSet: $NULL,
    touchStacks: $NULL
};

//保存所有的node与相应的handle的信息，用于查询
(ViewModel.queryList = [])._ = {};

function _bubbleTrigger(tiggerCollection, NodeList, model /*, eventTrigger*/ ) {
    var self = this, // result,
        eventStack = [],
        touchStacks = VI_session.touchStacks,
        touchHandleIdSet = VI_session.touchHandleIdSet;
    $.p(touchStacks, eventStack); //Add a new layer event collector
    $.e(tiggerCollection, function(trigger) { //TODO:测试参数长度和效率的平衡点，减少参数传递的数量
        if (!touchHandleIdSet[trigger.handleId]) { //To prevent repeated collection
            $.p(eventStack, trigger) //collect trigger
            if ( /*result !== $FALSE &&*/ trigger.bubble && !stopTriggerBubble) {
                // Stop using the `return false` to prevent bubble triggered
                // need to use `this. Mercifully = false` to control
                var parentNode = NodeList[trigger.handleId].parentNode;
                parentNode && _bubbleTrigger.call(self, parentNode._triggers, NodeList, model /*, trigger*/ );
            }
            touchHandleIdSet[trigger.handleId] = $TRUE;
        }
        /*else{
            console.log(trigger.handleId)
        }*/
    });

};

function _moveChild(self, el) {
    var AllEachViewModel = self._AVI,
        AllLayoutViewModel = self._ALVI,
        AllWithViewModel = self._WVI;

    self.topNode(el);

    $.E(self.NodeList[self.handleNodeTree.id].childNodes, function(child_node) {
        var viewModel,
            arrayViewModels,
            id = child_node.id;
        if (viewModel = (AllLayoutViewModel[child_node.id] || AllWithViewModel[child_node.id])) {
            _moveChild(viewModel, el)
        } else if (arrayViewModels = AllEachViewModel[id]) {
            $.E(arrayViewModels, function(viewModel) {
                _moveChild(viewModel, el);
            })
        }
    });
};

//根据AttrJson创建索引函数

function _buildQueryMatchFun(matchAttr) {
    if (matchAttr instanceof Function) {
        return matchAttr
    }
    return function(node) {
        for (var attrKey in matchAttr) {
            if (matchAttr[attrKey] != node[attrKey]) {
                return $FALSE;
            }
        }
        return $TRUE;
    }
};
var fr = doc.createDocumentFragment();

var __ViewModelProto__ = ViewModel.prototype = {
    destroy: function() {
        var self = this;
        //TODO:delete node
        self.remove();
        return null;
    },
    append: function(el) {
        var self = this,
            currentTopNode = self.topNode();

        $.e(currentTopNode.childNodes, function(child_node) {
            $.D.ap(fr, child_node);
        });
        $.D.ap(el, fr);

        _moveChild(self, el);
        self._canRemoveAble = $TRUE;

        return self;
    },
    insert: function(el) {
        var self = this,
            currentTopNode = self.topNode(),
            elParentNode = el.parentNode;

        $.e(currentTopNode.childNodes, function(child_node) {
            $.D.ap(fr, child_node);
        });
        $.D.iB(elParentNode, fr, el);

        _moveChild(self, elParentNode);
        self._canRemoveAble = $TRUE;

        return self;
    },
    addAttr: function(node, attrJson) {
        var self = this;
        var _touchOffKeys;
        if ($.isA(node)) {
            $.E(node, function(node) {
                _touchOffKeys = _addAttr(self, node, attrJson)
            });
        } else {
            _touchOffKeys = _addAttr(self, node, attrJson)
        }
        self.model.rebuildTree();
        $.E(_touchOffKeys, function(key) {
            self.model.touchOff(key);
        });
        return self;
    },
    queryElement: function(matchFun) {
        return this.model.queryElement(matchFun);
    },
    _buildElementMap: function() {
        var self = this;
        var NodeList = self.NodeList;
        if (!NodeList._) {
            var result = NodeList._ = [];
            $.fI(NodeList, function(handle) {
                if (handle.type === "element") {
                    $.p(result, handle);
                    //使得Element可以直接映射到Handle
                    result[$.hashCode(handle.currentNode)] = handle;
                }
            })
        }
        return NodeList._;
    },
    _queryElement: function(matchFun) {
        var self = this;
        var result = [];
        //获取数组化的节点
        var nodeList = self._buildElementMap();

        //遍历节点
        $.E(nodeList, function(elementHandle) {
            if (matchFun(elementHandle.currentNode)) {
                $.p(result, elementHandle.currentNode);
            }
        })
        return result;
    },
    remove: function() {
        var self = this,
            el = self._packingBag;
        if (self._canRemoveAble) {
            var handleNodeTree = self.handleNodeTree,
                NodeList = self.NodeList,
                currentTopNode = self.topNode(), //NodeList[handleNodeTree.id].currentNode,
                openNode = self._open,
                closeNode = self._close;

            //TODO:fix Firefox Opera
            var currentNode = openNode;
            var nextNode;
            while ($TRUE) {
                nextNode = currentNode.nextSibling;
                $.D.ap(el, currentNode);
                if (nextNode === closeNode) {
                    $.D.ap(el, nextNode);
                    break;
                }
                currentNode = nextNode;
            }

            self.topNode(el);

            self._canRemoveAble = $FALSE; //Has being recovered into the _packingBag,can't no be remove again. --> it should be insert

            self.onremove && self.onremove();
        }
        return self;
    },
    topNode: function(newCurrentTopNode) {
        var self = this,
            handleNodeTree = self.handleNodeTree,
            NodeList = self.NodeList,
            result;
        if (newCurrentTopNode) {
            NodeList[handleNodeTree.id].currentNode = newCurrentTopNode
        } else if (!self._canRemoveAble && self._packingBag) {
            result = self._packingBag;
        } else {
            var HNT_cs = handleNodeTree.childNodes
            if (HNT_cs.length) {
                var index = 0;
                var len = HNT_cs.length;
                var node;
                do {
                    node = NodeList[HNT_cs[index++].id].currentNode;
                    if (node && (node.nodeType === 1 || node.nodeType === 3)) {
                        result = node.parentNode;
                    }
                } while (!result && index < len)
            }
        }
        if (!result) {
            result = NodeList[handleNodeTree.id].currentNode;
        }
        return result;
    },
    touchOff: function(key) {
        var self = this,
            model = self.model,
            NodeList = self.NodeList;
        VI_session.touchHandleIdSet = {};

        // collect trigger stack
        VI_session.touchStacks = [];

        // if (key==="$PARENT.radio") {debugger};
        _bubbleTrigger.call(self, self._triggers._[key], NodeList, model)

        // trigger trigger stack
        $.E(VI_session.touchStacks, function(eventStack) {
            $.E(eventStack, function(trigger) {
                trigger.event(NodeList, model, /*trigger,*/ self._isAttr, self._id)
            })
        })
    },
    teleporter: function(viewModel, telporterName) {
        var self = this;
        (telporterName === $UNDEFINED) && (telporterName = "index");
        var teleporter = self._teleporters[telporterName];
        if (teleporter) {
            if (teleporter.show_or_hidden !== $FALSE && teleporter.display) {
                //remove old
                var old_viewModel = teleporter.vi;
                old_viewModel && old_viewModel.remove();

                //insert new & save new
                viewModel.insert(teleporter.ph);
            }
            teleporter.vi = viewModel
        }
        return self;
    },
    /*
     * 获取代理后面真正的Model
     */
    getModel: function(argument) {
        return this.model.model;
    }
};
/*var _allEventNames = ("blur focus focusin focusout load resize" +
    "scroll unload click dblclick mousedown mouseup mousemove" +
    "mouseover mouseout mouseenter mouseleave change select" +
    "submit keydown keypress keyup error contextmenu").split(" ");
$.E(_allEventNames, function(eventName) {
    __ViewModelProto__[eventName] = function(fun) {
        return fun ? this.on(eventName, fun) : this.trigger(eventName);
    }
})*/

/*
 * 为ViewModel拓展proxymodel代理类的功能
 */

$.E(["shelter", "set", "get"], function(handleName) {
    var handle = __ProxyModelProto__[handleName];
    __ViewModelProto__[handleName] = function() {
        var self = this;
        var model = self.model;
        return handle.apply(model, arguments);
    }
});

/*
 * parse function
 */
var _removeNodes = _isIE ? $.noop/*function() {//IE 不能回收节点，会导致子节点被销毁
		//@大城小胖 http://fins.iteye.com/blog/172263
		var d = $.D.cl(shadowDIV);
		return function(n) {
			// if (n && n.tagName != 'BODY') {
				d.appendChild(n);
				d.innerHTML = '';
			// }
		}
	}() */: function(n) {
		// if (n && n.parentNode && n.tagName != 'BODY') {
			$.E(n, function(nodeToDelete){
				delete nodeToDelete.parentNode.removeChild(nodeToDelete);
			})
		// }
	},
	_parse = function(node) { //get all childNodes
		var result = [],
			GC_node = [];
		for (var i = 0, child_node, childNodes = node.childNodes; child_node = childNodes[i]; i += 1) {
			switch (child_node.nodeType) {
				case 3:
					if ($.trim(child_node.data)) {
						$.p(result, new TextHandle(child_node))
					}
					break;
				case 1:
					if (child_node.getAttribute(_handle_type_argument_name) === "handle") {
						var handleName = child_node.getAttribute("handle");
						if (handleName !== $NULL) {
							$.p(result, new TemplateHandle(handleName, child_node))
						}
						// delete child_node.parentNode.removeChild(child_node);
						$.p(GC_node, child_node);
					} else {
						$.p(result, new ElementHandle(child_node))
					}
					break;
			}
		}
		// $.E(GC_node, _removeNode)
		_removeNodes(GC_node);
		return result;
	};

/*
 * Handle constructor
 */

function Handle(type, opction) {
	var self = this;
	if (!(self instanceof Handle)) {
		return new Handle(type, opction);
	}
	if (type) {
		self.type = type;
	}
	$.fI(opction, function(val, key) {
		self[key] = val;
	});
};
Handle.init = function(self, weights) {
	self.id = $.uid(); //weights <= 1
	if (weights < 2) return;
	self._controllers = []; //weights <= 2
	self._controllers[$TRUE] = []; //In the #if block scope
	self._controllers[$FALSE] = []; //In the #else block scope
	if (weights < 3) return;
	self._triggers = []; //weights <= 3
};
Handle.prototype = {
	nodeType: 0,
	ignore: $FALSE, //ignore Handle --> no currentNode
	display: $FALSE, //function of show or hidden DOM
	childNodes: [],
	parentNode: $NULL,
	type: "handle"
};

/*
 * TemplateHandle constructor
 */

function TemplateHandle(handleName, node) {
	var self = this;
	self.handleName = $.trim(handleName);
	self.childNodes = _parse(node);
	Handle.init(self, 3);
};
TemplateHandle.prototype = Handle("handle", {
	ignore: $TRUE,
	nodeType: 1
})

/*
 * ElementHandle constructor
 */

function ElementHandle(node) {
	var self = this;
	self.node = node;
	self.childNodes = _parse(node);
	Handle.init(self, 3);
};
ElementHandle.prototype = Handle("element", {
	nodeType: 1
})

/*
 * TextHandle constructor
 */

function TextHandle(node) {
	var self = this;
	self.node = node;
	Handle.init(self, 2);
};
TextHandle.prototype = Handle("text", {
	nodeType: 3
})

/*
 * CommentHandle constructor
 */

function CommentHandle(node) {
	var self = this;
	self.node = node;
	Handle.init(self, 1);
};
CommentHandle.prototype = Handle("comment", {
	nodeType: 8
})
/*
 * parse rule
 * 底层解析器，类Lisp语法规则，易于解析
 */
var placeholder = {
    "<": "&lt;",
    ">": "&gt;",
    "{": _placeholder(),
    "(": _placeholder(),
    ")": _placeholder(),
    "}": _placeholder()
},
    _Rg = function(s) {
        return RegExp(s, "g")
    },
    placeholderReg = {
        "<": /</g,
        ">": />/g,
        "/{": /\\\{/g,
        "{": _Rg(placeholder["{"]),
        "/(": /\\\(/g,
        "(": _Rg(placeholder["("]),
        "/)": /\\\)/g,
        ")": _Rg(placeholder[")"]),
        "/}": /\\\}/g,
        "}": _Rg(placeholder["}"])
    }, _head = /\{([\w\W]*?)\(/g,
    _footer = /\)[\s]*\}/g,
    _handle_type_argument_name = _placeholder("handle-"),
    parseRule = function(str) {
        var _handle_type_tagName;
        var parseStr = str
            .replace(/</g, placeholder["<"])
            .replace(/>/g, placeholder[">"])
            .replace(placeholderReg["/{"], placeholder["{"])
            .replace(placeholderReg["/("], placeholder["("])
            .replace(placeholderReg["/)"], placeholder[")"])
            .replace(placeholderReg["/}"], placeholder["}"])
        // .replace(_head, "<span type='handle' handle='$1'>")
        .replace(_head, function(match, handleName) {
            // console.log(arguments,"<span "+_handle_type_argument_name+"='handle' handle='"+handleName+"'>")
            _handle_type_tagName = "span";
            return "<span " + _handle_type_argument_name + "='handle' handle='" + handleName + "'>";
        })
        // .replace(_footer, "</span>")
        .replace(_footer, "</" + _handle_type_tagName + ">")
            .replace(placeholderReg["{"], "{")
            .replace(placeholderReg["("], "(")
            .replace(placeholderReg[")"], ")")
            .replace(placeholderReg["}"], "}");
        return parseStr;
    },
    _matchRule = /\{[\w\W]*?\([\w\W]*?\)[\s]*\}/,
    /*
     * expores function
     */

    V = {
        prefix: "bind-",
        namespace: "fix:",
        // _currentParsers: [],
        _nodeTree: function(htmlStr) {
            var _shadowBody = fragment( /*"body"*/ ); //$.D.cl(shadowBody);

            /*
             * 将所有HTML标签加上命名空间，不让浏览器解析默认语言
             */
            //将可能误导解析的元素全部排除
            //字符串、script标签
            var quotedString = [];
            var scriptNodeString = [];
            var start_ns = "<" + V.namespace;
            var end_ns = "</" + V.namespace;
            var Placeholder = "_" + Math.random(),
                ScriptPlaceholder = "_" + Math.random(),
                //备份字符串与script、XMP标签
                htmlStr = htmlStr.replace(QuotedString, function(qs) {
                    quotedString.push(qs)
                    return Placeholder;
                }).replace(ScriptNodeString, function(sns) {
                    scriptNodeString.push(sns);
                    return ScriptPlaceholder;
                })
                //为无命名空间的标签加上前缀
                .replace(/<[\/]{0,1}([\w:]+)/g, function(html, tag) {
                    //排除：带命名空间、独立标签
                    if (tag.indexOf(":") === -1 && "|area|br|col|embed|hr|img|input|link|meta|param|".indexOf("|" + tag.toLowerCase() + "|") === -1) {
                        html = (html.charAt(1) === "/" ? end_ns : start_ns) + tag;
                    }
                    return html;
                })
                //回滚字符串与script、XMP标签
                .replace(RegExp(ScriptPlaceholder, "g"), function(p) {
                    return scriptNodeString.shift();
                }).replace(RegExp(Placeholder, "g"), function(p) {
                    return quotedString.shift();
                });

            //使用浏览器默认解析力解析标签树，保证HTML的松语意
            _shadowBody.innerHTML = htmlStr;

            //递归过滤
            //在ElementHandle(_shadowBody)前扫描，因为在ElementHandle会将模板语法过滤掉
            //到时候innerHTML就取不到完整的模板语法了，只留下DOM结构的残骸
            V._scansView(_shadowBody);

            //提取所有文本节点，特殊标签（script、style等）除外
            //将文本节点尝试当成模板语意进行解析，保存在insertNodesHTML中
            //扫描过程中不宜对节点进行操作，因此缓存完后统一处理
            var insertBefore = [];
            _traversal(_shadowBody, function(node, index, parentNode) {
                if (node.nodeType === 1 && ignoreTagNameMap[node.tagName]) {
                    return $FALSE;
                }
                if (node.nodeType === 3) { //text Node
                    $.p(insertBefore, {
                        baseNode: node,
                        parentNode: parentNode,
                        insertNodesHTML: parseRule(node.data)
                    });
                }
            });
            //统一处理模板语意
            $.e(insertBefore, function(item, i) {
                var node = item.baseNode,
                    parentNode = item.parentNode,
                    insertNodesHTML = item.insertNodesHTML;
                if (node.data === insertNodesHTML) {
                    //普通文本做简答处理即可
                    node.data = insertNodesHTML.replace(/^[\s\n]\s*/, ' ');
                } else {
                    //使用浏览器默认功能，将XML转化为JS-Object，TODO：有待优化，应该直接使用JSON进行转化
                    shadowDIV.innerHTML = $.trim(insertNodesHTML); //optimization
                    //Using innerHTML rendering is complete immediate operation DOM, 
                    //innerHTML otherwise covered again, the node if it is not, 
                    //then memory leaks, IE can not get to the full node.
                    $.e(shadowDIV.childNodes, function(refNode) {
                        //现代浏览器XMP标签中，空格和回车总是不过滤的显示，和浏览器默认效果不一致，手动格式化
                        if (refNode.nodeType === 3) {
                            refNode.data = refNode.data.replace(/^[\s\n]\s*/, ' ');
                        }
                        //将模板语意节点插入
                        $.D.iB(parentNode, refNode, node)
                    })
                    $.D.rC(parentNode, node);
                }
            });
            //when re-rendering,select node's child will be filter by ``` _shadowBody.innerHTML = _shadowBody.innerHTML;```
            return new ElementHandle(_shadowBody);
        },
        _scansView: function(node, vmName) {
            node || (node = doc);
            //想解析子模块
            var xmps = $.s(node.getElementsByTagName("xmp"));
            Array.prototype.push.apply(xmps, $.s(node.getElementsByTagName(V.namespace + "xmp")));
            $.E(xmps, function(tplNode) {
                var type = tplNode.getAttribute("type");
                var name = tplNode.getAttribute("name");
                if (name) {
                    if (type === "template") {
                        V.modules[name] = jSouper.parseStr(tplNode.innerHTML, name);
                        $.D.rm(tplNode);
                    }
                }
            });

            return node;
        },
        _scansVMInit: function(node, vmName) {
            node || (node = doc);

            $.e(node.getElementsByTagName("script"), function(scriptNode) {
                var type = scriptNode.getAttribute("type");
                var name = scriptNode.getAttribute("name");
                if (name && type === "text/template") {
                    V.modules[name] = jSouper.parseStr(scriptNode.text, name);
                    $.D.rm(scriptNode);
                } else if (type === "text/vm") {
                    if (!name && vmName) {
                        //如果是最顶层的匿名script节点，则默认为当前解析中的View的initVM函数
                        if (!scriptNode.parentNode.parentNode.parentNode) { //null=>document-fragment=>wrap-div=>current-scriptNode
                            name = vmName;
                        }
                    }
                    if (name) {
                        try {
                            V.modulesInit[name] = Function("return " + $.trim(scriptNode.text))();
                            $.D.rm(scriptNode);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            });
            return node;
        },
        parse: function(htmlStr, name) {
            // $.p(V._currentParsers, name);
            var result = View(V._nodeTree(htmlStr), name);
            // V._currentParsers.pop();
            return result;
        },
        rt: function(handleName, triggerFactory) {
            return V.triggers[handleName] = triggerFactory;
        },
        rh: function(handleName, handle) {
            return V.handles[handleName] = handle
        },
        ra: function(match, handle) {
            var attrHandle = V.attrHandles[V.attrHandles.length] = {
                match: $NULL,
                handle: handle
            }
            if (typeof match === "function") {
                attrHandle.match = match;
            } else {
                attrHandle.match = function(attrKey) {
                    return attrKey === match;
                }
            }
        },
        triggers: {},
        handles: {},
        attrHandles: [],
        modules: {},
        modulesInit: {},
        attrModules: {},
        eachModules: {},
        withModules: {},
        _instances: {},

        // Proto: DynamicComputed /*Proto*/ ,
        Model: Model
    };

var _commentPlaceholder = function(handle, parentHandle, commentText) {
	var handleName = handle.handleName,
		commentText = commentText || (handleName + handle.id),
		commentNode = $.D.C(commentText),
		commentHandle = new CommentHandle(commentNode); // commentHandle as Placeholder

	$.p(handle.childNodes, commentHandle);
	$.iA(parentHandle.childNodes, handle, commentHandle);
	//Node position calibration
	//no "$.insert" Avoid sequence error
	return commentHandle;
};
var placeholderHandle = function(handle, index, parentHandle) {
	var commentHandle = _commentPlaceholder(handle, parentHandle);
};
V.rh("#define", function(handle, index, parentHandle) {
	if(parentHandle.type !== "handle"){
		$.iA(parentHandle.childNodes,handle,handle.childNodes[0].childNodes[0]);
		return $.noop
	}
});
var _each_display = function(show_or_hidden, NodeList_of_ViewModel, model, /*triggerBy,*/ viewModel_ID) {
    var handle = this,
        allArrViewModels = V._instances[viewModel_ID]._AVI,
        arrViewModels = allArrViewModels[handle.id] || (allArrViewModels[handle.id] = []);

    //get comment_endeach_id
    var commentStartEachPlaceholderElement = NodeList_of_ViewModel[$.lI(handle.childNodes).id].currentNode;
    var commentEndEachPlaceholderElement = NodeList_of_ViewModel[NodeList_of_ViewModel[handle.eh_id].childNodes[0].id].currentNode;

    arrViewModels.hidden = !show_or_hidden;
    var fg = arrViewModels.fragment || (arrViewModels.fragment = doc.createDocumentFragment());

    if (show_or_hidden) {
        var fgCs = fg.childNodes;
        if (fgCs.length) {
            var placeholderNode = commentStartEachPlaceholderElement.nextSibling;
            var parentNode = commentStartEachPlaceholderElement.parentNode;
            $.D.iB(parentNode, fg, placeholderNode);
        }
    } else {
        var currentNode = commentStartEachPlaceholderElement.nextSibling;
        while (currentNode !== commentEndEachPlaceholderElement) {
            var nextNode = currentNode.nextSibling
            $.D.ap(fg, currentNode);
            currentNode = nextNode;
        }
        $.D.ap(fg, currentNode);
    }
};
V.rh("#each", function(handle, index, parentHandle) {
    //The Nodes between #each and /each will be pulled out , and not to be rendered.
    //which will be combined into new View module.
    var _shadowBody = fragment( /*"body"*/ ), //$.D.cl(shadowBody),
        eachModuleHandle = new ElementHandle(_shadowBody),
        endIndex = 0;

    var layer = 1;
    $.e(parentHandle.childNodes, function(childHandle, index) {
        endIndex = index;
        if (childHandle.handleName === "#each") {
            layer += 1
        }
        if (childHandle.handleName === "/each") {
            layer -= 1;
            if (!layer) {
                //save end-handle-id to get comment-placeholder
                handle.eh_id = childHandle.id;
                return $FALSE
            }
        }
        $.p(eachModuleHandle.childNodes, childHandle);
        childHandle.node && $.D.ap(eachModuleHandle.node, childHandle.node);
        // layer && console.log("inner each:", childHandle)
    }, index + 1);
    if (!handle.eh_id) {
        throw SyntaxError("#each can't find close-tag(/each).");
    }
    parentHandle.childNodes.splice(index + 1, endIndex - index - 1); //Pulled out
    V.eachModules[handle.id] = View(eachModuleHandle, "each-" + handle.id + "-" + handle.eh_id); //Compiled into new View module

    handle.display = _each_display; //Custom rendering function
    _commentPlaceholder(handle, parentHandle);
});
V.rh("/each", placeholderHandle);

// var _noParameters = _placeholder();
V.rh("", function(handle, index, parentHandle) {
	var textHandle = handle.childNodes[0];
	if (!textHandle) {//{()} 无参数
		textHandle = $.p(handle.childNodes,new TextHandle(doc.createTextNode("")))
	}
	// 校准类型
	textHandle.asArg = $TRUE;
	if (parentHandle.type !== "handle") { //is textNode
		if (textHandle) {
			$.iA(parentHandle.childNodes, handle, textHandle);
			//Node position calibration
			//textHandle's parentNode will be rewrited. (by using $.insertAfter)
			return $.noop;
		}
	}// else {console.log("ignore:",textHandle) if (textHandle) {textHandle.ignore = $TRUE; } }  //==> ignore Node's childNodes will be ignored too.
});
V.rh("@", function(handle, index, parentHandle) {
	var textHandle = handle.childNodes[0];
	var i = 0;
	do {
		i += 1;
		var nextHandle = parentHandle.childNodes[index + i];
	} while (nextHandle && nextHandle.ignore);
	if (textHandle) { //textNode as Placeholder

		$.iA(parentHandle.childNodes, handle, textHandle);
		//Node position calibration
		//no "$.insert" Avoid sequence error

		return function(NodeList_of_ViewModel) {
			var nextNodeInstance = nextHandle && NodeList_of_ViewModel[nextHandle.id].currentNode,
				textNodeInstance = NodeList_of_ViewModel[textHandle.id].currentNode,
				parentNodeInstance = NodeList_of_ViewModel[parentHandle.id].currentNode
				parentNodeInstance&&$.D.iB(parentNodeInstance, textNodeInstance, nextNodeInstance); //Manually insert node
		}
	}
});
V.rh("/if", V.rh("#else", V.rh("#if", placeholderHandle)));
var _include_display_arguments = {};
function _include_display(show_or_hidden, NodeList_of_ViewModel, model, /*triggerBy,*/ viewModel_ID) {
	var handle = this,
		id = handle.id,
		includeViewModel = V._instances[viewModel_ID]._ALVI[id];
	if (!includeViewModel) {
		_include_display_arguments[id] = arguments;
		return;
	}
	//get comment_endeach_id
	var commentPlaceholderElement = NodeList_of_ViewModel[$.lI(handle.childNodes).id].currentNode;
	if (show_or_hidden) {
		if(!includeViewModel._canRemoveAble){//can-insert-able
			includeViewModel.insert(commentPlaceholderElement);
		}
	} else {
		includeViewModel.remove();
	}
};
V.rh("#include", function(handle, index, parentHandle) {
	handle.display = _include_display; //Custom rendering function
	_commentPlaceholder(handle, parentHandle);
});
function _layout_display(show_or_hidden, NodeList_of_ViewModel, model, /*triggerBy,*/ viewModel_ID) {
	var handle = this,
		layoutViewModel = V._instances[viewModel_ID]._ALVI[handle.id];
	if (!layoutViewModel) {
		return;
	}
	//get comment_endeach_id
	var commentPlaceholderElement = NodeList_of_ViewModel[$.lI(handle.childNodes).id].currentNode;
	if (show_or_hidden) {
		if(!layoutViewModel._canRemoveAble){//can-insert-able
			layoutViewModel.insert(commentPlaceholderElement);
		}
	} else {
		layoutViewModel.remove();
	}
};
V.rh("#>", V.rh("#layout", function(handle, index, parentHandle) {
	handle.display = _layout_display; //Custom rendering function
	_commentPlaceholder(handle, parentHandle);
}));
var _operator_handle  = function(handle, index, parentHandle) {
	var textHandle = handle.childNodes[0].childNodes[0];
	if (parentHandle.type !== "handle") {
		if (textHandle) {
			$.iA(parentHandle.childNodes, handle, textHandle);
			return $.noop;
		}
	}
},
_operator_list = "+ - * / % == === != !== > < >= <= && || ^ >> << & |".split(" ");
$.E(_operator_list, function(operator) {
	V.rh(operator, _operator_handle)
});
V.rh("&lt;",V.handles["<"]);
V.rh("&gt;",V.handles[">"]);

function _teleporter_display(show_or_hidden, NodeList_of_ViewModel, model, /*triggerBy,*/ viewModel_ID) {
    var handle = this;
    var placeholderHandle = $.lI(handle.childNodes);
    var commentPlaceholderElement = NodeList_of_ViewModel[placeholderHandle.id].currentNode;

    console.log(NodeList_of_ViewModel[handle.id])
    var teleporterNameHandle = handle.childNodes[0];
    if (placeholderHandle === teleporterNameHandle) { //no first argument;
        var teleporterName = "index"
    } else {
        teleporterName = teleporterNameHandle.childNodes[0].node.data;
        teleporterName = teleporterName.substr(1, teleporterName.length - 2);
    }

    var teleporter = V._instances[viewModel_ID]._teleporters[teleporterName];
    var teleporterViewModel = teleporter.vi;

    console.log(show_or_hidden ? "display:" : "remove:", teleporterViewModel);

    if (teleporterViewModel) {
        if (show_or_hidden&&teleporter.display) {
            if(!teleporterViewModel._canRemoveAble){//can-insert-able
                teleporterViewModel.insert(commentPlaceholderElement);
            }
        } else {
            teleporterViewModel.remove()
        }
    }

    //使用存储显示信息
    teleporter.show_or_hidden = show_or_hidden;
};
V.rh("#teleporter", function(handle, index, parentHandle) {
    handle.display = _teleporter_display; //Custom rendering function
    _commentPlaceholder(handle, parentHandle);
});

var _unary_operator_list = "! ~ -".split(" ");// ++ --
$.E(_unary_operator_list, function(operator) {
	V.rh(operator, _operator_handle)
});
var _with_display = function(show_or_hidden, NodeList_of_ViewModel, model, triggerBy, viewModel_ID) {
    var handle = this,
        parentHandle = handle.parentNode,
        comment_endwith_id,
        AllLayoutViewModel = V._instances[viewModel_ID]._WVI,
        withViewModel = AllLayoutViewModel[handle.id];
    if (!withViewModel) {
        return;
    }
    //get comment_endwith_id
    var commentEndEachPlaceholderElement = NodeList_of_ViewModel[NodeList_of_ViewModel[handle.eh_id].childNodes[0].id].currentNode;

    if (show_or_hidden) {
        if (!withViewModel._canRemoveAble) { //can-insert-able
            withViewModel.insert(commentEndEachPlaceholderElement)
        }
    } else {
        withViewModel.remove();
    }
};
V.rh("#with", function(handle, index, parentHandle) {
    //The Nodes between #with and /with will be pulled out , and not to be rendered.
    //which will be combined into new View module.
    var _shadowBody = fragment(), //$.D.cl(shadowBody),
        withModuleHandle = new ElementHandle(_shadowBody),
        endIndex = 0;

    // handle.arrViewModels = [];//Should be at the same level with currentNode
    var layer = 1;
    $.e(parentHandle.childNodes, function(childHandle, index) {
        endIndex = index;
        // console.log(childHandle,childHandle.handleName)
        if (childHandle.handleName === "#with") {
            layer += 1
        }
        if (childHandle.handleName === "/with") {
            layer -= 1;
            if (!layer) {
                //save end-handle-id to get comment-placeholder
                handle.eh_id = childHandle.id;
                return $FALSE
            }
        }
        $.p(withModuleHandle.childNodes, childHandle);
    }, index + 1);
    // console.log("----",handle.id,"-------")
    parentHandle.childNodes.splice(index + 1, endIndex - index - 1); //Pulled out
    V.withModules[handle.id] = View(withModuleHandle); //Compiled into new View module

    handle.display = _with_display; //Custom rendering function
    _commentPlaceholder(handle, parentHandle);
});
V.rh("/with", placeholderHandle);

V.rt("#define", function(handle, index, parentHandle) {
    var handleChilds = handle.childNodes,
        statusKeyHandleId = handleChilds[0].id,
        textHandle_id = handleChilds[0].childNodes[0].id,
        valueHandleId = handleChilds[1].id,
        trigger = {
            bubble: $TRUE,
            name: "define"
        };
    // console.log(handle.childNodes[0].parentNode, handle.parentNode)

    if (parentHandle.type !== "handle") { //as textHandle
        trigger.event = function(NodeList_of_ViewModel, model /*, triggerBy*/ , isAttr, viewModel_ID) { //call by ViewModel's Node
            var key = NodeList_of_ViewModel[statusKeyHandleId]._data,
                result = NodeList_of_ViewModel[valueHandleId]._data,
                currentNode = NodeList_of_ViewModel[textHandle_id].currentNode,
                uid_hash = viewModel_ID + key,
                viewModel = V._instances[viewModel_ID],
                finallyRun;
            // console.log(key,":",result,viewModel.id);
            if (key !== $UNDEFINED) {
                if (!(finallyRun = Model.finallyRun[uid_hash])) {
                    Model.finallyRun.register(uid_hash, Model.finallyRun[uid_hash] = finallyRun = function() {
                        viewModel = finallyRun.viewModel
                        //已经被remove的VI，就不应该触发define
                        // if (viewModel._canRemoveAble) {
                        viewModel.set(finallyRun.key, finallyRun.result)
                        // }
                        delete Model.finallyRun[uid_hash]/* = $FALSE;*/ //can push into finally quene
                    })
                }
                finallyRun.viewModel = viewModel
                finallyRun.key = key
                finallyRun.result = result
            }
            result = String(result);
            // if (currentNode.data !== result) {
            //     currentNode.data = result;
            // }
        }
    } else {
        trigger.event = function(NodeList_of_ViewModel, model /*, triggerBy*/ , isAttr, viewModel_ID) { //call by ViewModel's Node
            var key = NodeList_of_ViewModel[statusKeyHandleId]._data,
                result = NodeList_of_ViewModel[valueHandleId]._data;

            Model.finallyRun(function() {
                console.log(key, result)
                //key!==$UNDEFINED&&model.set(key,result)
            }, 0)
            NodeList_of_ViewModel[this.handleId]._data = result;
        }
    }

    return trigger;
});

//each - VM的onremove事件
var _eachVM_onremove = function() {
    var self = this;
    var arrayViewModel = self._arrayViewModel;
    //对Model做相应的重新排列
    var model = self.getModel();
    var parentModel = model._parentModel;
    var arrayModelsMap = parentModel._childModels._
    var oldIndex = parseInt(model._prefix);
    //获取数据，更改ArrayModel队列元素的下标
    var data = parentModel.get();

    //挂起停止更新
    //当前移除的Model放入队列末尾，具体的_prefix在insert时在做决定
    model.__hangup();

    $.E($.s(data), function(value, index) {
        var currentModel = arrayModelsMap[String(index)];
        //往前挪
        arrayModelsMap[currentModel._prefix = String(index - 1)] = currentModel;
    }, oldIndex + 1);
    //清除指定的数据
    $.sp.call(data, oldIndex, 1);

    //移除VM并排队到队尾作为备用
    arrayViewModel.splice(oldIndex, 1);

    //废弃的VM和model暂时不同在一起，在insert时再统一
    $.p(arrayViewModel, self);

    //不应该偷懒直接使用touchOff，因为上一级可能还有绑定到数组内部的key，必须冒泡更新
    parentModel.set(data);
}

V.rt("#each", function(handle, index, parentHandle) {
    var id = handle.id;
    var arrDataHandle = handle.childNodes[0];
    var arrDataHandle_id = arrDataHandle.id;
    var arrDataHandle_Key = arrDataHandle.childNodes[0].node.data;
    var arrDataHandle_sort = handle.childNodes[1];
    // console.log(arrDataHandle_sort)
    if (arrDataHandle_sort.type === "handle") {
        var arrDataHandle_sort_id = arrDataHandle_sort.id;
    }
    var comment_endeach_id = parentHandle.childNodes[index + 3].id; //eachHandle --> eachComment --> endeachHandle --> endeachComment
    var trigger;

    var arrayModel;
    trigger = {
        // smartTrigger:$NULL,
        // key:$NULL,
        event: function(NodeList_of_ViewModel, proxyModel, /*eventTrigger,*/ isAttr, viewModel_ID) {
            var data = NodeList_of_ViewModel[arrDataHandle_id]._data,
                // arrTriggerKey = arrDataHandle_Key + ".length",
                viewModel = V._instances[viewModel_ID],
                allArrViewModels = viewModel._AVI,
                arrViewModels = allArrViewModels[id];
            if (!arrViewModels) { //第一次初始化，创建最一层最近的Model来模拟ArrayModel
                arrViewModels = allArrViewModels[id] = [];
                arrayModel = proxyModel.model.buildModelByKey(arrDataHandle_Key);
            }
            var showed_vi_len = arrViewModels.len,
                new_data_len = data ? data.length : 0,
                eachModuleConstructor = V.eachModules[id],
                inserNew,
                comment_endeach_node = NodeList_of_ViewModel[comment_endeach_id].currentNode;

            /*+ Sort*/
            if (arrDataHandle_sort_id && data) {
                var sort_handle = NodeList_of_ViewModel[arrDataHandle_sort_id]._data
                var type = typeof sort_handle
                if (/function|string/.test(type)) {
                    var old_sort = $.s(data);
                    data = data;
                    try {
                        if (type === "function") {
                            data.sort(sort_handle);
                        } else { //string
                            sort_handle = $.trim(sort_handle);
                            if ($.st(sort_handle, " ") === "by") {
                                var sort_key = $.st($.trim(_split_laveStr), " ");
                                sort_handle = $.trim(_split_laveStr);
                                /asc|desc/.test(sort_handle) && data.sort(function(a, b) {
                                    return a[sort_key] > b[sort_key]
                                })
                            }
                            if (sort_handle === "asc") {
                                data.sort()
                            } else if (sort_handle === "desc") {
                                data.sort().reverse()
                            }
                        }
                    } catch (e) {
                        throw TypeError("#each-data's type error.")
                    }
                    $.E(old_sort, function(value, index) {
                        if (data[index] !== value) {
                            var setSort = finallyRun[id];
                            if (!setSort) {
                                setSort = finallyRun[id] = function() {
                                    setSort.vi.set(arrDataHandle_Key, data)
                                    finallyRun[id] = $NULL;
                                }
                                finallyRun(setSort)
                            }
                            setSort.vi = viewModel
                        }
                    })
                }
            }
            /*- Sort*/
            /*+ Insert Remove*/

            if (showed_vi_len !== new_data_len) {
                arrViewModels.len = new_data_len; //change immediately,to avoid the `subset` trigger the `rebuildTree`,and than trigger each-trigger again.

                if (showed_vi_len > new_data_len) { /*  Remove*/
                    $.E($.s(arrViewModels), function(eachViewModel) {
                        //挂起停止更新
                        eachViewModel.getModel().__hangup();
                        //onremove的效益发生在通过vm的remove来影响数据的改变，并做一定的优化，避免大量的更新
                        eachViewModel.onremove = $UNDEFINED;
                        //这里的remove是通过数据改变来影响vm，因此要溢出onremove函数
                        eachViewModel.remove();
                    }, new_data_len);
                } else { /*  Insert*/
                    //undefined null false "" 0 ...
                    if (data) {
                        var fragment = $.D.cl(fr);
                        var elParentNode = comment_endeach_node.parentNode;
                        $.E($.s(data), function(eachItemData, index) {
                            //TODO:if too mush vi will be create, maybe asyn
                            var viewModel = arrViewModels[index];
                            var newPrefix = arrDataHandle_Key + "." + index;
                            var strIndex = String(index);
                            //VM不存在，新建
                            if (!viewModel) {
                                eachModuleConstructor( /*eachItemData*/ $UNDEFINED, {
                                    onInit: function(vm) {
                                        viewModel = arrViewModels[index] = vm;
                                        vm._arrayViewModel = arrViewModels;
                                    },
                                    callback: function(vm) {
                                        //PS:暂时牺牲效率
                                        //TODO:实现prefix的多级缓存
                                        // if (!arrayModel._childModels._[index]) {
                                        //     arrayModel.__buildChildModel(strIndex);
                                        // }
                                        proxyModel.shelter(vm, newPrefix); //+"."+index //reset arrViewModel's model
                                    }
                                });
                            } else {
                                var model = viewModel.getModel();
                                model.__hangdown({
                                    pk: strIndex
                                });
                            }
                            viewModel.onremove = _eachVM_onremove;
                            //自带的inser，针对each做特殊优化
                            var currentTopNode = viewModel.topNode();

                            $.e(currentTopNode.childNodes, function(child_node) {
                                $.D.ap(fragment, child_node);
                            });

                            _moveChild(viewModel, elParentNode);
                            viewModel._canRemoveAble = $TRUE;

                        }, showed_vi_len);

                        //统一插入
                        $.D.iB(elParentNode, fragment, comment_endeach_node);

                    }
                }
            }
            /*- Inser Remove*/
        }
    }
    return trigger
});

V.rt("", function(handle, index, parentHandle) {
    var textHandle = handle.childNodes[0],
        textHandleId = textHandle.id,
        key = textHandle.node.data,
        trigger = {
            key: ".", //const trigger
            bubble: $TRUE
        };
    //作为一个textNode节点来显示字符串
    if (parentHandle.type !== "handle") { //as textHandle
        if ($.isSWrap(key)) { // single String
            trigger.event = function(NodeList_of_ViewModel, model) {
                NodeList_of_ViewModel[textHandleId].currentNode.data = key.substring(1, key.length - 1);
                //trigger.event = $.noop;
            };
        } else if ($.isStoN(key)) { // single Number
            trigger.event = function(NodeList_of_ViewModel, model) {
                NodeList_of_ViewModel[textHandleId].currentNode.data = parseFloat(key);
                //trigger.event = $.noop;
            };
        } else { //String for databese by key
            trigger.key = key;
            trigger.event = function(NodeList_of_ViewModel, model, /* triggerBy,*/ isAttr /*, vi*/ ) { //call by ViewModel's Node
                var data = model.get(key),
                    nodeHandle = NodeList_of_ViewModel[textHandleId],
                    currentNode = nodeHandle.currentNode;
                if (isAttr) {
                    //IE浏览器直接编译，故不需要转义，其他浏览器需要以字符串绑定到属性中。需要转义，否则会出现引号冲突
                    if (isAttr.key.indexOf("on") === 0 && !_isIE) {
                        data = String(data).replace(/"/g, '\\"').replace(/'/g, "\\'");
                    }
                }
                // data = String(data);
                if (nodeHandle._data !== data) {
                    nodeHandle._data = data;
                    currentNode.data = data === $UNDEFINED ? "" : data;
                }
            }
        }
        //作为一个handle的参数
    } else { //as stringHandle
        if ($.isSWrap(key)) { // single String
            trigger = { //const 
                key: ".", //const trigger
                bubble: $TRUE,
                event: function(NodeList_of_ViewModel, model) {
                    NodeList_of_ViewModel[this.handleId]._data = key.substr(1, key.length - 2);
                    //trigger.event = $.noop;
                }
            };
        } else if ($.isStoN(key)) { // single Number
            trigger.event = function(NodeList_of_ViewModel, model) {
                NodeList_of_ViewModel[this.handleId]._data = parseFloat(key);
                //trigger.event = $.noop;
            };
        } else { //String for databese by key
            trigger = {
                key: key,
                bubble: $TRUE,
                event: function(NodeList_of_ViewModel, model) {
                    NodeList_of_ViewModel[this.handleId]._data = model.get(key);
                }
            };
        }
    }
    return trigger;
});

V.rt("@", function(handle, index, parentHandle) {
	var textHandle = handle.childNodes[0],
		textHandleId = textHandle.id,
		key = textHandle.node.data,
		trigger = { //const 
			key: key, //const trigger
			bubble: $TRUE
		};

	if (parentHandle.type !== "handle") { //as textHandle
		trigger.event = function(NodeList_of_ViewModel, model) {
			//trigger but no bind data
			NodeList_of_ViewModel[textHandleId].currentNode.data = key;
		}
	} else {
		trigger.event = function(NodeList_of_ViewModel, model) {
			NodeList_of_ViewModel[this.handleId]._data = key;
		}
	}
	return trigger;
});
V.rt("#if", function(handle, index, parentHandle) {
    // console.log(handle)
    var id = handle.id,
        ignoreHandleType = /handle|comment/,
        conditionHandleId = handle.childNodes[0].id,
        parentHandleId = parentHandle.id,

        comment_else_id, //#if inserBefore #else
        comment_endif_id, //#else inserBefore /if

        conditionDOM = handle._controllers,
        conditionStatus = $TRUE, //the #if block scope
        trigger,
        deep = 0;

    $.e(parentHandle.childNodes, function(child_handle, i, childHandles) {
        if (child_handle.handleName === "#if") {
            deep += 1
        } else if (child_handle.handleName === "#else") {
            if (deep === 1) {
                conditionStatus = !conditionStatus;
                comment_else_id = $.lI(child_handle.childNodes).id;
            }
        } else if (child_handle.handleName === "/if") {
            deep -= 1
            if (!deep) {
                comment_endif_id = $.lI(child_handle.childNodes).id;
                return $FALSE;
            }
        } else if (child_handle.type !== "comment") {
            //保存这个节点的控制器，可能有多个if-else嵌套
            $.p(child_handle._controllers, id);
            $.p(conditionDOM[conditionStatus], child_handle.id);
        }
    }, index); // no (index + 1):scan itself:deep === 0 --> conditionStatus = !conditionStatus;

    trigger = {
        // key:"",//default is ""
        event: function(NodeList_of_ViewModel, model, /*triggerBy,*/ isAttr, viewModel_ID) {
            //要显示的类型，true为if-else，false为else-endif
            var conditionVal = NodeList_of_ViewModel[conditionHandleId]._data,
                parentNode = NodeList_of_ViewModel[parentHandleId].currentNode,
                markHandleId = comment_else_id, //if(true)
                markHandle; //default is undefined --> insertBefore === appendChild

            //获取PrimitiveValue
            conditionVal && (conditionVal = conditionVal.valueOf());
            //转化为Boolean值
            conditionVal = !! conditionVal;

            if (NodeList_of_ViewModel[this.handleId]._data !== conditionVal /*|| triggerBy*/ ) {
                NodeList_of_ViewModel[this.handleId]._data = conditionVal;
                if (!conditionVal) {
                    markHandleId = comment_endif_id;
                }
                if (markHandleId) {
                    markHandle = NodeList_of_ViewModel[markHandleId].currentNode;
                }

                //显示
                $.e(conditionDOM[conditionVal], function(id) {
                    var currentHandle = NodeList_of_ViewModel[id],
                        node = currentHandle.currentNode,
                        placeholderNode = NodeList_of_ViewModel[id].placeholderNode || (NodeList_of_ViewModel[id].placeholderNode = $.D.C(id)),
                        display = $TRUE;

                    //遍历所有逻辑控制器（if-else语句-ENDIF）来确定每个控制器是否允许显示它。
                    $.e(currentHandle._controllers, function(controller_id) {
                        //Traverse all Logic Controller(if-else-endif) to determine whether each Controller are allowed to display it.
                        var controllerHandle = NodeList_of_ViewModel[controller_id]
                        //控制器中的显示时候包含当前元素
                        return display = display && ($.iO(controllerHandle._controllers[ !! controllerHandle._data], currentHandle.id) !== -1);
                        //when display is false,abort traversing
                    });
                    if (display) {
                        if (currentHandle.display) { //Custom Display Function,default is false
                            currentHandle.display($TRUE, NodeList_of_ViewModel, model, /*triggerBy, */ viewModel_ID)
                        } else if (node && placeholderNode.parentNode === parentNode) {
                            //parentNode.replaceChild(node/*new*/, placeholderNode/*old*/)
                            $.D.re(parentNode, node, placeholderNode)
                        }
                    }
                });

                //隐藏
                $.e(conditionDOM[!conditionVal], function(id) {
                    var currentHandle = NodeList_of_ViewModel[id],
                        node = currentHandle.currentNode,
                        placeholderNode = (currentHandle.placeholderNode = currentHandle.placeholderNode || $.D.C(id));

                    if (currentHandle.display) { //Custom Display Function,default is false
                        currentHandle.display($FALSE, NodeList_of_ViewModel, model, /*triggerBy,*/ viewModel_ID)
                    } else if (node && node.parentNode === parentNode) {
                        //parentNode.replaceChild(placeholderNode/*new*/, node/*old*/)
                        $.D.re(parentNode, placeholderNode, node)
                    }
                })
            }
        }
    }

    return trigger;
});

var _cache_xhrConifg = {};
var _require_module = function(url, handleFun) {
    var xhrConifg = _cache_xhrConifg.hasOwnProperty(url) && _cache_xhrConifg[url]
    if (xhrConifg) {
        $.p(xhrConifg.success._, handleFun)
    } else {
        var handleQuene = function(status, xhr) {
            $.E(handleQuene._, function(handleFun) {
                handleFun(status, xhr);
            })
        }
        handleQuene._ = [handleFun];
        xhrConifg = _cache_xhrConifg[url] = {
            url: url,
            success: handleQuene,
            error: function() {
                throw new Error("module " + url + " is undefined.")
            },
            complete: function() {
                //GC
                _cache_xhrConifg[url] = $NULL;
            }
        }
        $.ajax(xhrConifg)
    }
};
var _runScripted = _placeholder("run-");

var _runScriptCache = {};

function _runScript(node) {
    var scriptNodeList = node.getElementsByTagName('script');
    $.E(scriptNodeList, function(scriptNode) {
        if ((!scriptNode.type || scriptNode.type === "text/javascript")) {
            if (!scriptNode[_runScripted]) {
                var scripttext = scriptNode.text;
                var id = $.uid();
                scriptNode[_runScripted] = id;
                _runScriptCache[id] = Function(scripttext);
                // var newScript = doc.createElement("script");
                //TODO:clone attribute;
                // newScript.text = scripttext;
                // newScript.src = scriptNode.src;
                // newScript[_runScripted] = $TRUE;
                // scriptNode.parentNode.replaceChild(newScript, scriptNode);
            }
            _runScriptCache[scriptNode[_runScripted]]();
        }
    })
}
var _include_lock = {};
V.rt("#include", function(handle, index, parentHandle) {
    var templateHandle_id = handle.childNodes[0].id;

    //base on layout
    var trigger = V.triggers["#layout"](handle, index, parentHandle);
    var layoutViewModel;

    // Ajax NodeList_of_ViewModel[templateHandle_id]._data
    var _event = trigger.event;
    var _uid = $.uid();
    trigger.event = function(NodeList_of_ViewModel, model, /*eventTrigger,*/ isAttr, viewModel_ID) {
        var url = NodeList_of_ViewModel[templateHandle_id]._data;
        var args = arguments
        if (!_include_lock[_uid]) {
            _include_lock[_uid] = $TRUE;
            if (!V.modules[url]) {
                _require_module(url, function(status, xhr) {
                    V.modules[url] = jSouper.parseStr(xhr.responseText, url);
                    layoutViewModel = _event.apply(trigger, args);
                    if (layoutViewModel && !layoutViewModel._runScripted) {
                        layoutViewModel._runScripted = $TRUE;
                        _runScript(layoutViewModel.handleNodeTree.node);
                        _include_lock[_uid] = $FALSE;
                    }
                    var _display_args = _include_display_arguments[handle.id];
                    if (_display_args) {
                        _include_display.apply(handle, _display_args);
                    }
                })
            } else {
                layoutViewModel = _event.apply(trigger, args);
                if (!layoutViewModel._runScripted) {
                    layoutViewModel._runScripted = $TRUE;
                    _runScript(layoutViewModel.topNode());
                }
                _include_lock[_uid] = $FALSE;
            }
        }
    }
    return trigger;
});

V.rt("#>", V.rt("#layout", function(handle, index, parentHandle) {
    // console.log(handle)
    var id = handle.id,
        childNodes = handle.childNodes,
        templateHandle_id = childNodes[0].id,
        dataHandle_id = childNodes[1].id,
        ifHandle = childNodes[2],
        ifHandle_id = ifHandle.type === "handle" && ifHandle.id,
        comment_layout_id = parentHandle.childNodes[index + 1].id, //eachHandle --> eachComment --> endeachHandle --> endeachComment
        trigger;
    var uuid = $.uid();
    var triggerEvent = function(NodeList_of_ViewModel, proxyModel, /*eventTrigger,*/ isAttr, viewModel_ID) {
        //VM所存储的集合
        var AllLayoutViewModel = V._instances[viewModel_ID]._ALVI;
        //模板的名称
        var new_templateHandle_name = NodeList_of_ViewModel[templateHandle_id]._data;
        //获取VM的缓存信息
        var self = V._instances[viewModel_ID];
        self = self.__layout || (self.__layout = {});

        var templateHandle_name = self[id];
        // console.log(new_templateHandle_name,templateHandle_name)
        var module = V.modules[new_templateHandle_name];
        if (!module) {
            return
        }
        //如果模板的名称的值改变，销毁原有的vm
        var layoutViewModel = AllLayoutViewModel[id];
        if (new_templateHandle_name) {
            if (layoutViewModel && layoutViewModel.vmName !== new_templateHandle_name) {
                layoutViewModel = layoutViewModel.destroy(); //layoutViewModel=null
            }
            if (!layoutViewModel) {
                var key = NodeList_of_ViewModel[dataHandle_id]._data;
                module($UNDEFINED, {
                    onInit: function(vm) {
                        //加锁，放置callback前的finallyRun引发的
                        layoutViewModel = AllLayoutViewModel[id] = vm;
                    },
                    callback: function(vm) {
                        proxyModel.shelter(vm, key);
                    }
                });


            }
        }

        if (!layoutViewModel._canRemoveAble) { //canInsertAble
            layoutViewModel.insert(NodeList_of_ViewModel[comment_layout_id].currentNode);
        }
        return layoutViewModel;
    };
    trigger = {
        // cache_tpl_name:$UNDEFINED,
        key: ".",
        event: triggerEvent
    }

    // var _simulationInitVm;
    if (ifHandle_id) {
        trigger.event = function(NodeList_of_ViewModel, model, /*eventTrigger,*/ isAttr, viewModel_ID) {
            var isShow = _booleanFalseRegExp(NodeList_of_ViewModel[ifHandle_id]._data);
            var AllLayoutViewModel = V._instances[viewModel_ID]._ALVI,
                layoutViewModel = AllLayoutViewModel[id];
            if (isShow) {
                layoutViewModel = triggerEvent.apply(this, arguments);
            } else {
                if (layoutViewModel) {
                    layoutViewModel._canRemoveAble && layoutViewModel.remove();
                }
                /*else if (!_simulationInitVm) {
                    //强制运行一次getter，因为vm没有初始化
                    //如果是初始化条件又依赖于其内部（Observer等），恐怕无法自动触发
                    //所以这里手动地简单模拟一次layoutViewModel已经初始化的情况
                    _simulationInitVm = $TRUE;

                    //model这时的数据源可能还没绑定，所以用注册finallyRun来实现
                    //可能因为subset的值，会被replaceAs，所以在finallyRun中用id取真model实例
                    var modelId = model.id;
                    Model.finallyRun.register("layoutMoniInt" + id, function() {
                        var key = NodeList_of_ViewModel[dataHandle_id]._data;
                        model = Model._instances[modelId];
                        model.get(key);
                    })
                }*/
            }
            return layoutViewModel;
        }
    }
    return trigger;
}));

V.rt("!", V.rt("nega", function(handle, index, parentHandle) { //Negate
	var nageteHandlesId = handle.childNodes[0].id,
		trigger;
	trigger = {
		// key:"",//default key === ""
		bubble: $TRUE,
		event: function(NodeList_of_ViewModel, model) {
			NodeList_of_ViewModel[this.handleId]._data = !NodeList_of_ViewModel[nageteHandlesId]._data; //first value
		}
	}
	return trigger;
}));
var _tryToNumberHash = _placeholder("tTN");
var _tryToNumber = global[_tryToNumberHash] = function(str) {
    if ($.isStoN(str)) {
        str = parseFloat(str);
    }
    return str
}
var _operator_handle_builder = function(handle, index, parentHandle) {
    var firstParameter_id = handle.childNodes[0].id,
        textHandle_id = handle.childNodes[0].childNodes[0].id,
        secondParameter = handle.childNodes[1],
        trigger = {
            bubble: true //build in global,can't use $TRUE
        };
    // console.log(handle.childNodes[0].parentNode, handle.parentNode)
    if (parentHandle.type !== "handle") { //as textHandle
        trigger.event = function(NodeList_of_ViewModel /*, model, triggerBy, isAttr, vi*/ ) { //call by ViewModel's Node
            var result = _tryToNumber(NodeList_of_ViewModel[firstParameter_id]._data) + _tryToNumber(secondParameter ? NodeList_of_ViewModel[secondParameter.id]._data : 0),
                currentNode = NodeList_of_ViewModel[textHandle_id].currentNode;
            currentNode.data = result;
        }
    } else {
        trigger.event = function(NodeList_of_ViewModel /*, model, triggerBy, isAttr, vi*/ ) { //call by ViewModel's Node
            var result = _tryToNumber(NodeList_of_ViewModel[firstParameter_id]._data) + _tryToNumber(secondParameter ? NodeList_of_ViewModel[secondParameter.id]._data : 0);
            NodeList_of_ViewModel[this.handleId]._data = result;
        }
    }

    return trigger;
}
var _operator_handle_build_str = String(_operator_handle_builder),
    _operator_handle_build_arguments = _operator_handle_build_str.match(/\(([\w\W]+?)\)/)[1],
    _operator_handle_build_str = _operator_handle_build_str.substring(_operator_handle_build_str.indexOf("{") + 1, _operator_handle_build_str.length - 1),
    _operator_handle_build_factory = function(operator) {
        var result = _operator_handle_build_str.replace(/\+/g, operator).replace(/_tryToNumber/g, _tryToNumberHash);
        result = Function(_operator_handle_build_arguments, result);
        return result
    };
$.E(_operator_list, function(operator) {
    V.rt(operator, _operator_handle_build_factory(operator))
});
V.rt("&lt;", V.triggers["<"]);
V.rt("&gt;", V.triggers[">"]);

V.rt("#teleporter", function(handle, index, parentHandle) {
    var teleporterNameHandle = handle.childNodes[0];
    var booleanHandle = handle.childNodes[1];
    if (booleanHandle.type==="handle") {
        var booleanHandle_id = booleanHandle.id;
    }
    var placeholderHandle = $.lI(handle.childNodes);
    if (placeholderHandle === teleporterNameHandle) { //no first argument;
        var teleporterName = "index"
    } else {
        teleporterName = teleporterNameHandle.childNodes[0].node.data;
        teleporterName = teleporterName.substr(1, teleporterName.length - 2);
    }
    var trigger = {
        key: ".",
        event: function(NodeList_of_ViewModel, model, /*eventTrigger,*/ isAttr, viewModel_ID) {
            var viewModel = V._instances[viewModel_ID];
            var teleporters = viewModel._teleporters
            var teleporter = teleporters[teleporterName];
            //初始化传送配置
            if (!teleporter) {
               teleporter = teleporters[teleporterName] = {
                	//placeholder comment node
                    ph: NodeList_of_ViewModel[placeholderHandle.id].currentNode,
                    display:$TRUE
                }
            }
            //第二参数，由第三方控制显示与否，同layout
            if (booleanHandle_id&&teleporter.vi&&teleporter.show_or_hidden !== $FALSE) {
                if (teleporter.display = NodeList_of_ViewModel[booleanHandle_id]._data) {
                    teleporter.vi.insert(teleporter.ph);
                }else{
                    teleporter.vi.remove();
                }
            }
            /*else{
            	trigger.event = $.noop;
            }*/
        }
    }
    return trigger;
});

var _unary_operator_handle_builder = function(handle, index, parentHandle){
	var firstParameter_id = handle.childNodes[0].id,
		textHandle_id = handle.childNodes[0].childNodes[0].id,
		trigger = {
			bubble: true//build in global,can't use $TRUE
		};

	if (parentHandle.type !== "handle") { //as textHandle
		trigger.event = function(NodeList_of_ViewModel /*, model, triggerBy, isAttr, vi*/ ) { //call by ViewModel's Node
			var result =  +NodeList_of_ViewModel[firstParameter_id]._data,
				currentNode = NodeList_of_ViewModel[textHandle_id].currentNode;
			currentNode.data = result;
		}
	} else {
		trigger.event = function(NodeList_of_ViewModel /*, model, triggerBy, isAttr, vi*/ ) { //call by ViewModel's Node
			var result =  +NodeList_of_ViewModel[firstParameter_id]._data;
			NodeList_of_ViewModel[this.handleId]._data = result;
		}
	}

	return trigger;
}
var _unary_operator_handle_build_str = String(_unary_operator_handle_builder),
	_unary_operator_handle_build_arguments = _unary_operator_handle_build_str.match(/\(([\w\W]+?)\)/)[1],
	_unary_operator_handle_build_str = _unary_operator_handle_build_str.substring(_unary_operator_handle_build_str.indexOf("{")+1,_unary_operator_handle_build_str.length-1),
	_unary_operator_handle_build_factory = function(operator) {
		var result= Function(_unary_operator_handle_build_arguments, _unary_operator_handle_build_str.replace(/\+/g, operator))
		return result
	};
$.E(_unary_operator_list, function(operator) {
	V.rt(operator, _unary_operator_handle_build_factory(operator))
});
V.rt("#with", function(handle, index, parentHandle) {
	// console.log(handle)
	var id = handle.id,
		dataHandle_id = handle.childNodes[0].id,
		comment_with_id = parentHandle.childNodes[index + 3].id, //eachHandle --> eachComment --> endeachHandle --> endeachComment
		trigger;

	trigger = {
		event: function(NodeList_of_ViewModel, model, /*eventTrigger,*/ isAttr, viewModel_ID) {
			var key = NodeList_of_ViewModel[dataHandle_id]._data,
				AllLayoutViewModel = V._instances[viewModel_ID]._WVI,
				withViewModel = AllLayoutViewModel[id], // || (AllLayoutViewModel[id] = V.withModules[id](data).insert(NodeList_of_ViewModel[comment_with_id].currentNode)),
				inserNew;
			if (!withViewModel) {
				withViewModel = AllLayoutViewModel[id] = V.withModules[id]();
				model.subset(withViewModel,key);
				withViewModel.insert(NodeList_of_ViewModel[comment_with_id].currentNode);
			}
		}
	}
	return trigger;
});
var _testDIV = fragment(),//$.D.cl(shadowDIV),
	_getAttrOuter = Function("n", "return n." + (("textContent" in _testDIV) ? "textContent" : "innerText") + "||''");

var _AttributeHandleEvent = {
	event: function(key, currentNode, parserNode) { //on开头的事件绑定，IE需要绑定Function类型，现代浏览器绑定String类型（_AttributeHandleEvent.com）
		var attrOuter = _getAttrOuter(parserNode);
		try {
			var attrOuterEvent = Function(attrOuter); //尝试编译String类型数据
		} catch (e) {
			attrOuterEvent = $.noop; //失败使用空函数替代
		}
		currentNode.setAttribute(key, attrOuterEvent);
	},
	style: function(key, currentNode, parserNode) {
		var attrOuter = _getAttrOuter(parserNode);
		currentNode.style.setAttribute('cssText', attrOuter);
	},
	com: function(key, currentNode, parserNode) {
		var attrOuter = _getAttrOuter(parserNode);
		if (currentNode.getAttribute(key) !== attrOuter) {
			currentNode.setAttribute(key, attrOuter)
		}
	},
	dir: function(key, currentNode, parserNode) {
		var attrOuter = _getAttrOuter(parserNode);
		if (currentNode[key] !== attrOuter) {
			currentNode[key] = attrOuter;
		}
	},
	bool: function(key, currentNode, parserNode) {
		var attrOuter = _booleanFalseRegExp(_getAttrOuter(parserNode));
		if (attrOuter) { // currentNode.setAttribute(key, key);
			currentNode[key] = key;
		} else { // currentNode.removeAttribute(key);
			currentNode[key] = $FALSE;
		}
	},
	// checked:self.bool,
	radio: function(key, currentNode, parserNode) { //radio checked
		var attrOuter = _getAttrOuter(parserNode);
		if (attrOuter === currentNode.value) {
			currentNode[key] = attrOuter;
		}
	}
};
var __bool = _AttributeHandleEvent.checked = _AttributeHandleEvent.bool;
if (_isIE) {
	var __radio = _AttributeHandleEvent.radio;
	_AttributeHandleEvent.radio = function(key, currentNode, parserNode) {
		var attrOuter = _booleanFalseRegExp(_getAttrOuter(parserNode));
		if (attrOuter === currentNode.value) {
			currentNode.defaultChecked = attrOuter;
		} else {
			currentNode.defaultChecked = $FALSE;
		}
		(this._attributeHandle = __radio)(key, currentNode, parserNode);
	}
	_AttributeHandleEvent.checked = function(key, currentNode, parserNode) {
		var attrOuter = _booleanFalseRegExp(_getAttrOuter(parserNode));
		if (attrOuter) {
			currentNode.defaultChecked = attrOuter;
		} else {
			currentNode.defaultChecked = $FALSE;
		}
		(this._attributeHandle = __bool)(key, currentNode, parserNode);
	}
}
var _boolAssignment = " checked selected disabled readonly multiple defer declare noresize nowrap noshade compact truespeed async typemustmatch open novalidate ismap default seamless autoplay controls loop muted reversed scoped autofocus required formnovalidate editable draggable hidden "
/*for ie fix*/
+ "defaultSelected ";
V.ra(function(attrKey) {
	return _boolAssignment.indexOf(" " + attrKey + " ") !== -1;
}, function(attrKey, element) {
	var result = _AttributeHandleEvent.bool
	switch (element.type) {
		case "checkbox":
			(attrKey === "checked") && (result = _AttributeHandleEvent.checked)
			break;
		case "radio":
			(attrKey === "checked") && (result = _AttributeHandleEvent.radio)
			break
		case "select-one":
			/selected|defaultSelected/.test(attrKey) && (result = _AttributeHandleEvent.select)
			break
	}
	return result;
})
var _dirAssignment = " className value ";
V.ra(function(attrKey){
	return _dirAssignment.indexOf(" "+attrKey+" ")!==-1;
}, function() {
	return _AttributeHandleEvent.dir;
})
var _elementCache = {},
	eventListerAttribute = function(key, currentNode, parserNode, vi /*, dm_id*/ ,handle, triggerTable) {
		var attrOuter = _getAttrOuter(parserNode),
			eventInfos = key.replace("event-", "").toLowerCase().split("-"),
			eventName = eventInfos.shift(), //Multi-event binding
			elementHashCode = $.hashCode(currentNode, "event" + eventInfos.join("-"));
		if (eventName.indexOf("on") === 0) {
			eventName = eventName.substr(2)
		}
		var eventCollection = _elementCache[elementHashCode];
		if (!eventCollection) { //init Collection
			eventCollection = _elementCache[elementHashCode] = {}
		}
		var wrapEventFun = eventCollection[eventName]
		if (!wrapEventFun) { //init Event and register event
			wrapEventFun = eventCollection[eventName] = function(e) {
				//因为事件的绑定是传入事件所在的key，所以外部触发可能只是一个"."类型的字符串
				//没法自动更新eventFun，只能自动更新eventName，因此eventFun要动态获取
				var eventFun = vi.get(attrOuter) || $.noop;
				return eventFun.call(this, e, vi)
			}
			_registerEvent(currentNode, eventName, wrapEventFun, elementHashCode);
		}
		wrapEventFun.eventName = eventName;
	};

V.ra(function(attrKey) {
	return attrKey.indexOf("event-") === 0;
}, function(attrKey) {
	return eventListerAttribute;
})
/*
 *form-bind只做绑定form处理事件，value绑定需要另外通过attr-value={(XX)}来绑定，避免重复
 */
var _formCache = {},
	__text = {
		attributeName: "value",
		eventNames: ["input","change"]
	},
	_formKey = {
		"input": function(node) { //需阻止默认事件，比如Checked需要被重写，否则数据没有变动而Checked因用户点击而变动，没有达到V->M的数据同步
			var result = __text;
			switch (node.type.toLowerCase()) {
				case "checkbox":
					result = {
						attributeName: "checked",
						eventNames: _isIE ? ["change", "click"] : ["change"]
					}
					break;
				case "radio":
					result = {
						// attributeName: "checked",
						attributeName: "value",
						eventNames: _isIE ? ["change", "click"] : ["change"]
					}
					break;
					// case "button":
					// case "reset":
					// case "submit":
			}
			return result
		},
		"select": {
			eventNames: ["change"],
			//设置初值，表单如果不选择进行直接的提交也需要有初始值
			init: function(currentNode, vi, attrOuter) {
				//---init value
				var _init_hashCode = $.hashCode(currentNode, "init"),
					DM_finallyRun = Model.finallyRun;
				if (!DM_finallyRun[_init_hashCode]) {
					var _init_finallyRun = DM_finallyRun[_init_hashCode] = function() {
						var options = currentNode.options
						if (options.length) {
							//待存在options后，则进行初始化bind-form的值
							//并确保只运行一次。
							DM_finallyRun[_init_hashCode] = $FALSE;
							var value = [];
							$.E(options,function(optionNode){
								if(optionNode.selected&&optionNode.value){
									$.p(value,optionNode.value)
								}
							})
							if (value.length) {
								// console.log(value)
								if (!currentNode.multiple) {
									value = value[0]
								}
								// console.log(attrOuter,value)
								vi.set(attrOuter,value)
							}
						}else{
							//当each运作后是继续允许进入finallyRun队列
							_init_finallyRun._inQuene = $FALSE
						}
					}
				}
			},
			inner: function(e, vi, attrOuter, value /*for arguments*/ ) {
				// console.log(e.target.tagName==="OPTION")
				var ele = this;
				var obj = vi.get(attrOuter);
				var args = arguments;

				if (ele.multiple) {
					value = [];
					$.E(ele.options, function(option) {
						if (option.selected && option.value) {
							$.p(value, option.value);
						}
					})
				} else {
					value = ele.options[ele.selectedIndex].value;
				}
				if (obj && obj[_DM_extends_object_constructor] && obj.form) {
					args[3] = value;
					vi.set(attrOuter, obj.form.apply(ele, args))
				} else {
					vi.set(attrOuter, value)
					// console.log(ele.options)
				}
			}
		},
		"textarea": __text
	},
	formListerAttribute = function(key, currentNode, parserNode, vi, /*dm_id,*/ handle, triggerTable) {
		var attrOuter = _getAttrOuter(parserNode),
			eventNameHashCode = $.hashCode(currentNode, "bind-form");
			// console.log(attrOuter)
		if (handle[eventNameHashCode] !== attrOuter) {
			// console.log(handle[eventNameHashCode], attrOuter, arguments)
			handle[eventNameHashCode] = attrOuter;
			var eventNames,
				eventConfig = _formKey[currentNode.tagName.toLowerCase()];
			if (!eventConfig) return;
			var elementHashCode = $.hashCode(currentNode, "form"),
				formCollection,
				outerFormHandle;
			if (eventConfig) {
				typeof eventConfig === "function" && (eventConfig = eventConfig(currentNode));
				eventNames = eventConfig.eventNames;
				eventConfig = $.c(eventConfig); //wrap eventConfig to set inner in diffrent eventConfig
				formCollection = _formCache[elementHashCode] || (_formCache[elementHashCode] = {});
				if (eventConfig.init) {
					eventConfig.init(currentNode, vi, attrOuter)
				}
				if (!eventConfig.inner) {
					eventConfig.inner = function(e, vi, attrOuter /**/ ) {
						var obj = vi.get(attrOuter)
						if (obj && obj[_DM_extends_object_constructor] && obj.form) {
							vi.set(attrOuter, obj.form.apply(this, arguments))
						} else {
							vi.set(attrOuter, this[eventConfig.attributeName])
						}
					};
				}
				$.E(eventNames, function(eventName) {
					eventConfig.key = attrOuter;
					eventConfig.vi = vi;
					if (!(outerFormHandle = formCollection[eventName])) {
						outerFormHandle = function(e) {
							var self = this;
							eventConfig.before && eventConfig.before.call(this, e, eventConfig.vi, eventConfig.key)
							eventConfig.inner.call(this, e, eventConfig.vi, eventConfig.key);
							eventConfig.after && eventConfig.after.call(this, e, eventConfig.vi, eventConfig.key)
						}
						// outerFormHandle = Function('o' /*eventConfig*/ , 'return function(e){var s=this;' + (eventConfig.before ? 'o.before.call(s,e,o.vi, o.key);' : '') + 'o.inner.call(s,e,o.vi, o.key);' + (eventConfig.after ? 'o.after.call(s,e,o.vi, o.key);' : '') + '}')(eventConfig);
						outerFormHandle.eventConfig = eventConfig
						_registerEvent(currentNode, eventName, outerFormHandle, elementHashCode);
						formCollection[eventName] = outerFormHandle;
					} else {
						for (var i in eventConfig) {
							outerFormHandle.eventConfig[i] = eventConfig[i];
							// try{outerFormHandle.call(currentNode)}catch(e){};
						}
					}

				});
			}
		}
	};
V.ra("input", function(attrKey) {
	return formListerAttribute;
});
var _event_by_fun = (function() {
	var testEvent = Function(""),
		attrKey = "onclick";

	_testDIV.setAttribute(attrKey, testEvent);
	if ($.isS(_testDIV.getAttribute(attrKey))) {
		return $FALSE;
	}
	return $TRUE;
}());
V.ra(function(attrKey){
	attrKey.indexOf("on") === 0;
},function () {
	return _event_by_fun&&_AttributeHandleEvent.event;
})
_AttributeHandleEvent.select = function(key, currentNode, parserNode, vi) { //select selected
	var attrOuter = _getAttrOuter(parserNode),
		data = vi.get(attrOuter),
		selectHashCode = $.hashCode(currentNode, "selected"),
		options = currentNode.options;
	currentNode[selectHashCode] = attrOuter;
	// console.log(attrOuter, selectHashCode)
	if ($.isA(data)) {
		if (currentNode.multiple) {
			$.E(options, function(optionNode) {
				optionNode.selected = ($.iO(data, optionNode.value) !== -1)
			})
		}else{
			$.e(options, function(optionNode) {
				if(optionNode.selected = ($.iO(data, optionNode.value) !== -1)){
					return $FALSE
				}
			})
		}
	} else {
		$.E(options, function(optionNode) {
			optionNode.selected = (data === optionNode.value)
		})
	}
}
var _triggersEach = V.triggers["#each"];
V.rt("#each", function(handle, index, parentHandle) {
	var trigger = _triggersEach(handle, index, parentHandle);
	if (parentHandle.type === "element" && parentHandle.node.tagName === "SELECT") {
		if (_isIE) {
			//IE需要强制触发相关于option的属性来强制使其渲染更新DOM
			//使用clone的节点问题？是否和clone出来的HTML5节点的问题一样？
			var _ieFix_triggerEvent = trigger.event;
			trigger.event = function(NodeList_of_ViewModel, model, /*eventTrigger,*/ isAttr, viewModel_ID) {
				var result = _ieFix_triggerEvent.apply(this, arguments);
				var currentNode_options = NodeList_of_ViewModel[parentHandle.id].currentNode.options;
				currentNode_options.length += 1;
				currentNode_options.length -= 1;
				return result;
			}
		}
		//数组的赋值与绑定相关联，实时更新绑定值。
		var _triggerEvent = trigger.event;
		trigger.event = function(NodeList_of_ViewModel, model, /*eventTrigger,*/ isAttr, viewModel_ID) {
			var result = _triggerEvent.apply(this, arguments);
			var currentNode = NodeList_of_ViewModel[parentHandle.id].currentNode,
				selectHashCode = $.hashCode(currentNode, "selected"),
				touchKey = currentNode[selectHashCode],
				DM_finallyRun = Model.finallyRun;
			// console.log(touchKey);
			if (touchKey) { //value-map
				var finallyRun;
				if (!(finallyRun = DM_finallyRun[selectHashCode])) {
					DM_finallyRun(DM_finallyRun[selectHashCode] = finallyRun = function() {
						finallyRun.model.touchOff(finallyRun.touchKey)
						DM_finallyRun[selectHashCode] = $FALSE;
					})
				}
				finallyRun.model = model;
				finallyRun.touchKey = touchKey;
			}else{
				//如果没有指定绑定的selected值，那么为bind-from配置默认选中值
				var _init_hashCode = $.hashCode(currentNode, "init"),
					_init_finallyRun = DM_finallyRun[_init_hashCode];
				if(_init_finallyRun&&!_init_finallyRun._inQuene){
					DM_finallyRun(_init_finallyRun)
					_init_finallyRun._inQuene = $TRUE;
				}
			}
			return result;
		}
	}
	return trigger;
})
Model.config.prefix.Get = "$GET";
var _statusEventCache = {},
	_statusEvent = {
		"=": function(vi, key, value) {
			vi.set(key, value)
		},
		"+": function(vi, key, value) {
			var oldvalue = vi.get(key) || "";
			if ($.isS(oldvalue)) { //oldvalue is string ,not array or any type elses.
				if (oldvalue.indexOf(value) === -1) {
					vi.set(key, oldvalue + value)
				}
			}
		},
		"-": function(vi, key, value) {
			var oldvalue = vi.get(key) || "";
			if (oldvalue && $.isS(oldvalue)) { //oldvalue is string ,not array or any type elses.
				if (oldvalue.indexOf(value) !== -1) {
					vi.set(key, oldvalue.replace(value, ""));
				}
			}
		},
		"?": function(vi, key, value) {
			var oldvalue = vi.get(key) || "";
			if ($.isS(oldvalue)) { //oldvalue is string ,not array or any type elses.
				if (oldvalue.indexOf(value) !== -1) {
					vi.set(key, oldvalue.replace(value, ""));
				} else {
					vi.set(key, oldvalue + value)
				}
			}
		}
	},
	_getStatusKey = function(vi, key) {
		var _$Get = __ModelConfig__.prefix.Get + ".";
		if ($.st(key, _$Get) !== false) {
			key = vi.get(_split_laveStr);
		}
		return key;
	},
	_getStatusValue = function(vi, value) {
		if ($.isSWrap(value)) {
			value = value.substr(1, value.length - 2)
		} else {
			value = vi.get(value)
		}
		return value;
	},
	statusListerAttribute = function(key, currentNode, parserNode, vi /*, dm_id*/ ) {
		var attrOuter = _getAttrOuter(parserNode);
		$.st(key, "-"); //"status - eventName-..."
		var statusInfos = _split_laveStr,
			eventName = $.st(statusInfos, "-") || statusInfos, //Multi-event binding
			elementHashCode = $.hashCode(currentNode, "status" + statusInfos);
		// console.log(statusInfos,eventName)
		if (eventName.indexOf("on") === 0) {
			eventName = eventName.substr(2)
		}
		var fitstPartCommand = $.st(attrOuter, ">");
		var argusPartCommand = $.trim(_split_laveStr);

		var syntax_error;
		try {
			var operatorKey = fitstPartCommand.substr(-1)
			var triggerKey = $.trim(fitstPartCommand.substr(0, fitstPartCommand.length - 1))
			var operatorHandel = _statusEvent[operatorKey];
		} catch (e) {
			syntax_error = e
		}
		//简单判断指令格式是否正确
		if (syntax_error || !(triggerKey && argusPartCommand && operatorHandel)) {
			console.error("SyntaxError: Status-Operator command parser error.")
		} else {
			var statusCollection = _statusEventCache[elementHashCode] || /*init Collection*/ (_statusEventCache[elementHashCode] = {});
			var wrapStatusFun = statusCollection[statusInfos]
			if (!wrapStatusFun) { //init status and register status
				wrapStatusFun = statusCollection[statusInfos] = function(e) {
					var vi = wrapStatusFun.vi;
					var statusKey = _getStatusKey(vi, wrapStatusFun.ke);
					if (statusKey) {
						var statusValue = _getStatusValue(vi, wrapStatusFun.va);
						if ($.isS(statusValue)) {
							wrapStatusFun.ev(vi, statusKey, statusValue)
						}
					}
				}
				_registerEvent(currentNode, eventName, wrapStatusFun, elementHashCode);
			}
			wrapStatusFun.ev = operatorHandel
			wrapStatusFun.vi = vi
			wrapStatusFun.ke = triggerKey
			wrapStatusFun.va = argusPartCommand
		}
	};

V.ra(function(attrKey) {
	return attrKey.indexOf("status-") === 0;
}, function(attrKey) {
	return statusListerAttribute;
})
V.ra("style",function () {
	return _isIE&&_AttributeHandleEvent.style;
})
var newTemplateMatchReg = /\{\{([\w\W]+?)\}\}/g,
	// DoubleQuotedString = /"(?:\.|(\\\")|[^\""\n])*"/g, //双引号字符串
	// SingleQuotedString = /'(?:\.|(\\\')|[^\''\n])*'/g, //单引号字符串
	QuotedString = /"(?:\.|(\\\")|[^\""\n])*"|'(?:\.|(\\\')|[^\''\n])*'/g, //引号字符串
	ScriptNodeString = /<script[^>]*>([\s\S]*?)<\/script>/gi,
    XmpNodeString = /<xmp[^>]*>([\s\S]*?)<\/xmp>/gi,
	templateHandles = {};
$.fI(V.handles, function(handleFun, handleName) {
	var result = $TRUE
	if (handleName.charAt(0) === "/") {
		result = $FALSE //no arguments
	}
	templateHandles[handleName] = result
});
/*{
	"#if": $TRUE,
	"#else": $FALSE, //no arguments
	"/if": $FALSE,
	"@": $TRUE,
	"#each": $TRUE,
	"/each": $FALSE,
	"#with": $TRUE,
	"/with": $TRUE,
	"HTML": $TRUE,
	"#>": $TRUE,
	"#layout": $TRUE,
	"define": $TRUE
}*/
var templateOperatorNum = {
	"@": 1
	// , "!": 1
	// , "~": 1
	// , "++": 1
	// , "--": 1
	// , "+": 2
	// , "-": 2
	// , "*": 2
	// , "/": 2
	// , "&&": 2
	// , "||": 2
	// , "&": 2
	// , "|": 2
	// , "=": 2
	// , "==": 2
	// , "===": 2
	// , "!=": 2
	// , "!==": 2
	// , "%": 2
	// , "^": 2
	// , ">": 2
	// , "<": 2
	// , ">>": 2
	// , "<<": 2
}
$.E(_operator_list, function(operator) {
	templateOperatorNum[operator] = 2;
});
$.E(_unary_operator_list, function(operator) {
	templateOperatorNum[operator] = 1;
});
var parse = function(str) {
		var quotedString = [];
		var scriptNodeString = [];
		var Placeholder = "_" + Math.random(),
			ScriptPlaceholder = "_" + Math.random(),
			str = str.replace(QuotedString, function(qs) {
				quotedString.push(qs)
				return Placeholder;
			}).replace(ScriptNodeString,function (sns) {
				scriptNodeString.push(sns);
				return ScriptPlaceholder;
			}),
			result = str.replace(newTemplateMatchReg, function(matchStr, innerStr, index) {
				innerStr = innerStr.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&") //Semantic confusion with HTML
				var fun_name = $.trim(innerStr).split(" ")[0];
				if (fun_name in templateHandles) {
					if (templateHandles[fun_name]) {
						var args = innerStr.replace(fun_name, "").split(","),
							result = "{" + fun_name + "(";
						$.E(args, function(arg) {
							if (arg = $.trim(arg)) {
								result += parseIte(parseArg(arg));
							}
						});
						result += ")}"
						return result;
					} else {
						return "{" + fun_name + "()}";
					}
				} else {
					return parseIte(parseArg($.trim(innerStr))); //"{(" + innerStr + ")}";
				}
			})

			result = result.replace(RegExp(ScriptPlaceholder, "g"),function(p) {
				return scriptNodeString.shift();
			}).replace(RegExp(Placeholder, "g"), function(p) {
				return quotedString.shift();
			}).replace(/\{\@\(\{\(([\w\W]+?)\)\}\)\}/g, function(matchStr, matchKey) {
				return "{@(" + matchKey + ")}";
			});
		return result
	},
	parseArg = function(argStr) {
		var allStack = [],
			inner = $TRUE;
		argStr.replace(/\(([\W\w]+?)\)/, function(matchSliceArgStr, sliceArgStr, index) {
			inner = $FALSE;
			var stack = parseStr(argStr.substr(0, index));
			allStack.push.apply(allStack, stack);
			$.p(allStack, {
				type: "arg",
				value: sliceArgStr,
				parse: parseIte(parseArg(sliceArgStr))
			})
			stack = parseStr(argStr.substring(index + matchSliceArgStr.length));
			allStack.push.apply(allStack, stack);
		});
		if (inner) {
			allStack.push.apply(allStack, parseStr(argStr));
		}
		return allStack;
	},
	parseStr = function(sliceArgStr) {
		var stack = [],
			pointer = 0;
		sliceArgStr.replace(/([^\w$\(\)]+)/g, function(matchOperator, operator, index, str) { //([\W]+)
			operator = $.trim(operator);
			if (operator && operator !== ".") {
				$.p(stack, {
					type: "arg",
					value: str.substring(pointer, index)
				});
				$.p(stack, {
					type: "ope",
					value: operator,
					num: templateOperatorNum[operator] || 0
				});
				pointer = index + matchOperator.length;
			}
			return matchOperator;
		});
		if (stack.length && !stack[0].value) {
			stack.splice(0, 1);
		}
		if (sliceArgStr.length - pointer) {
			$.p(stack, {
				type: "arg",
				value: sliceArgStr.substring(pointer, sliceArgStr.length)
			})
		}
		return stack;
	},
	parseIte = function(arr) {
		var result = "";
		$.E(arr, function(block, index) {
			if (block.type === "arg") {
				!block.parse && (block.parse = "{(" + block.value + ")}");
			}
			if (!block.value) {
				block.ignore = $TRUE;
			}
		});
		$.E(arr, function(block, index) {
			if (block.type === "ope") {
				var prev = arr[index - 1],
					next = arr[index + 1];
				if (block.num === 1) {
					if (prev && prev.type === "arg") { //a++
						block.parse = "{$" + block.value + "(" + prev.parse + ")}";
						prev.ignore = $TRUE;
					} else { //++a
						next.parse = "{" + block.value + "(" + next.parse + ")}"
						block.ignore = $TRUE;
					}
				} else if (block.num === 2) {
					next.parse = "{" + block.value + "(" + prev.parse + next.parse + ")}"
					prev.ignore = $TRUE;
					block.ignore = $TRUE;
				} else {
					throw "Unknown type:" + block.value
				}
			}
		});
		$.E(arr, function(block) {
			if (!block.ignore) {
				result += block.parse;
			}
		});
		return result; //arr;
	};
/*
 * user defined handle function like Handlebarsjs
 */
function registerHandle(handleName, handleFun) {
	templateHandles[handleName]= $TRUE;
	V.rh(handleName, function(handle, index, parentHandle) {
		var endCommentHandle = _commentPlaceholder(handle, parentHandle, "html_end_" + handle.id),
			startCommentHandle = _commentPlaceholder(handle, parentHandle, "html_start_" + handle.id);
	});
	V.rt(handleName, function(handle, index, parentHandle) {
		var handleChilds = handle.childNodes,
			beginCommentId,// = handleChilds[handleChilds.length - 1].id,
			endCommentId,// = handleChilds[handleChilds.length - 2].id,
			cacheNode = fragment(),//$.D.cl(shadowDIV),
			trigger,
			argumentsIdSet = [];
		$.E(handleChilds, function(handle_arg) {
			$.p(argumentsIdSet, handle_arg.id);
		});
		beginCommentId = argumentsIdSet[argumentsIdSet.length-1]
		endCommentId = argumentsIdSet[argumentsIdSet.length-2]
		trigger = {
			// key:"",//default key === ""
			bubble: true,
			event: function(NodeList_of_ViewModel, model, /*triggerBy,*/ isAttr, viewModel_ID) {
				var startCommentNode = NodeList_of_ViewModel[beginCommentId].currentNode,
					endCommentNode = NodeList_of_ViewModel[endCommentId].currentNode,
					parentNode = endCommentNode.parentNode,
					brotherNodes = parentNode.childNodes,
					argumentsDataSet = [],
					index = -1;

				for (var i = 0, len = argumentsIdSet.length - 2, handle_arg_data, argumentsDataSet; i < len; i += 1) {
					$.p(argumentsDataSet,NodeList_of_ViewModel[argumentsIdSet[i]]._data)
				};
				$.e(brotherNodes, function(node, i) {
					index = i;
					if (node === startCommentNode) {
						return $FALSE;
					}
				});
				index = index + 1;
				$.e(brotherNodes, function(node, i) {
					if (node === endCommentNode) {
						return $FALSE;
					}
					$.D.rC(parentNode, node); //remove
				}, index);

				cacheNode.innerHTML = handleFun.apply(V._instances[viewModel_ID],argumentsDataSet)
				$.e(cacheNode.childNodes, function(node, i) {
					$.D.iB(parentNode, node, endCommentNode);
				});
			}
		}
		return trigger;
	});
	return jSouper;
}
registerHandle("HTML",function () {
	return Array.prototype.join.call(arguments,"");
})

/*
 * export
 */
var _jSouperBase = {
    //暴露基本的工具集合，给拓展组件使用
    $: $,
    $JS: new Model(global),
    isViewModel: function(vm) {
        return vm instanceof ViewModel;
    },
    isModel: function(m) {
        return m instanceof Model;
    },

    queryHandle: function(node) {
        return ViewModel.queryList._[$.hashCode(node)];
    },
    queryElement: function(matchFun) {
        var result = [];
        matchFun = _buildQueryMatchFun(matchFun);
        $.E(ViewModel.queryList, function(node) {
            if (matchFun(node)) {
                $.p(result, node);
            }
        })
        return result;
    },
    //同jQuery的makeArrayAPI
    //中文文档推荐：http://www.css88.com/jqapi-1.9/jQuery.makeArray/
    makeArray: function(likeArr) {
        return likeArr && likeArr !== $TRUE ? $.s(likeArr) : [];
    },
    indexOf: $.iO,
    isPlainObject: $.isO,
    forEach: $.forEach,
    filter: $.filter,
    map: $.map,
    extend: $.extend,
    trim: function(str) {
        return $.isS(str) ? $.trim(str) : "";
    },
    scans: function(node, vmName) {
        V._scansView(node, vmName);
        V._scansVMInit(node, vmName);
        return node;
    },
    parseStr: function(htmlStr, name) {
        // V._currentParser = name;
        return V.parse(parse(htmlStr), name)
    },
    parseNode: function(htmlNode, name) {
        // V._currentParser = name;
        return V.parse(parse(htmlNode.innerHTML), name)
    },
    parse: function(html, name) {
        if ($.isO(html)) {
            return this.parseNode(html, name)
        }
        return this.parseStr(html, name)
    },
    config: {
        Id: 'HVP',
        Var: 'App',
        // Url:"",//include
        // HTML:"",//html string as template
        Data: $NULL
    },
    registerHandle: registerHandle,
    app: function(userConfig) {
        // jSouper.scans();
        var HVP_config = jSouper.config;
        userConfig = _mix(HVP_config, userConfig) || HVP_config;
        var App = doc.getElementById(userConfig.Id); //configable
        if (App) {
            var appName = userConfig.Var;
            var template = jSouper.parseNode(App, "App")(userConfig.Data); //App.getAttribute("template-data")//json or url or configable
            // template.set(HVP_config.Data);
            App.innerHTML = "";
            template.append(App);
            if ( /*!appName || */ appName == userConfig.Id || appName in global) {
                //IE does not support the use and the DOM ID of the same variable names, so automatically add '_App' after the most.
                appName = userConfig.Id + "_App";
                // console.error("App's name shouldn't the same of the DOM'ID");
                console.warn("App's name will be set as " + appName);
            }
            return (global[appName] = template);
        }
    },
    build: function(userConfig) {
        var HTML = userConfig.HTML;
        var url = userConfig.Url;
        var module = jSouper.modules[url];
        var vi;
        if (!module) {
            if (!HTML && url) {
                $.ajax({
                    url: url,
                    //for return
                    async: $FALSE,
                    success: function(status, xhr) {
                        HTML = xhr.responseText
                    }
                })
            }
            module = jSouper.modules[url] = jSouper.parseStr(HTML, url);
        }
        if (module) {
            vi = module(userConfig.Data, userConfig.extendConfig);
            var appName = userConfig.Var;
            if (appName) {
                if (appName in global) {
                    appName = appName + "_App";
                    console.warn("App's name will be set as " + appName);
                }
                global[appName] = vi;
            }
        }
        _runScript(vi.topNode());
        return vi;
    },
    ready: (function() {
        var ready = "DOMContentLoaded", //_isIE ? "DOMContentLoaded" : "readystatechange",
            ready_status = $FALSE,
            callbackFunStacks = [];

        function _load() {
            var callbackObj;
            while (callbackFunStacks.length) {
                callbackObj = callbackFunStacks.shift(0, 1);
                callbackObj.callback.call(callbackObj.scope || global)
            }
            ready_status = $TRUE;
        }
        _registerEvent(doc, (_isIE && IEfix[ready]) || ready, _load);
        return function(callbackFun, scope) {
            if (ready_status) {
                callbackFun.call(scope || global);
            } else {
                $.p(callbackFunStacks, {
                    callback: callbackFun,
                    scope: scope
                })
                //complete ==> onload , interactive ==> DOMContentLoaded
                //https://developer.mozilla.org/en-US/docs/Web/API/document.readyState
                //seajs src/util-require.js
                if (/complete|onload|interactive/.test(doc.readyState)) { //fix asyn load
                    _load()
                }
            }
        }
    }())
};
var jSouper = global.jSouper = $.c(V);
$.fI(_jSouperBase, function(value, key) {
    jSouper[key] = value;
});
(function() {
    var scriptTags = doc.getElementsByTagName("script"),
        HVP_config = _jSouperBase.config,
        userConfigStr = $.trim(scriptTags[scriptTags.length - 1].innerHTML);
    //TODO:append style:xmp{display:none}
    _jSouperBase.ready(function() {
        _jSouperBase.scans();
        if (userConfigStr.charAt(0) === "{") {
            try {
                var userConfig = userConfigStr ? Function("return" + userConfigStr)() : {};
            } catch (e) {
                console.error("config error:" + e.message);
            }
            userConfig && _jSouperBase.app(userConfig)
        }
    });
}());

/*
 * as AMD & CMD
 */
// fork form jQuery
//module is defined?
//module !== null
//fix IE 关键字

if (typeof module === "object" && module && typeof module.exports === "object") {
    module.exports = jSouper;
} else {
    if (typeof define === "function" && define.amd) {
        define("jSouper", [], function() {
            return jSouper
        })
    }
}

;
(function() {
    function Observer(getFun, setFun, formFun) {
        var self = this;
        if (!(self instanceof Observer)) {
            return new Observer(getFun, setFun, formFun)
        }
        self._get = getFun || $.noop
        self._set = setFun || $.noop
        self._form = formFun || $.noop
        self._id = $.uid()
    }

    // 存储处理过的依赖关系集，在set运作后链式触发 TODO：注意处理循环依赖
    var observerCache = Observer.cache = {
        //dm_id:{key:[{dm_id:dm,dm_key:"",abandon:false}...]}
        _: {}
    };

    // 原始的DM-get方法
    var _dm_normal_get = __ModelProto__.get

    // 带收集功能的DM-get
    var _dm_collect_get = function(key) {
        var self = this;
        var result = _dm_normal_get.apply(self, arguments)

        //当前收集层
        var _current_collect_layer = _get_collect_stack[_get_collect_stack.length - 1]
        /*
         * 存储相关的依赖信息
         * 保存的都是Model顶部的信息，不使用最临近，因为临近的可能有同prefix的Model，
         * TODO：新版本的可以使用最临近
         * 会导致保存的信息片面，或者易损
         */
        //获取最顶层的信息
        var router_result = Model.$router(self, key);
        var keyInfo = Model.getTopInfoByKey(router_result.model, router_result.key);
        _current_collect_layer && $.p(_current_collect_layer, {
            //rely object
            dm_id: keyInfo.model.id,
            dm_key: keyInfo.key
        })
        return result;
    }

    // 用于搜集依赖的堆栈数据集
    var _get_collect_stack = []

    // 委托 set\get\form
    // this ==> model but not Observer-instance
    Observer.prototype = {
        set: function(dm, key, value, currentKey) {
            return this._set.call(dm, key, value, currentKey)
        },
        get: function(dm, key, value, currentKey) {
            var observerCache_ = observerCache._
            /*
             * dm collect get mode
             */
            __ModelProto__.get = _dm_collect_get;

            //生成一层收集层
            $.p(_get_collect_stack, [])

            //运行原生get
            var result = this._get.call(dm, key, value, currentKey)

            /*
             * dm normal get mode
             */
            //回收最近一层依赖
            var _current_collect_layer = _get_collect_stack.pop()

            //获取上次收集的依赖，将上次依赖进行回退
            var _oldObserverObj = this.observerObj
            //舍弃上一次的依赖关系
            if (_oldObserverObj) {
                $.E(_oldObserverObj._parent, function(parent) {
                    var abandon_index = $.iO(parent, _oldObserverObj);
                    $.sp.call(parent, abandon_index, 1)
                })
                //force GC
                delete _oldObserverObj._parent
            }

            //获取顶层信息
            var keyInfo = Model.getTopInfoByKey(dm, key);
            var dm_id = keyInfo.model.id
            var key = keyInfo.key;
            //保存最近一层依赖
            var _newObserverObj = this.observerObj = {
                _parent: [],
                dm_id: dm_id,
                dm_key: key
            }

            //将依赖关系你想逆向转换
            $.E(_current_collect_layer, function(relyObj) {
                var observerObjCollect = observerCache[relyObj.dm_id] || (observerCache[relyObj.dm_id] = {})
                var observerObjs = observerObjCollect[relyObj.dm_key] || (observerObjCollect[relyObj.dm_key] = [])

                //避免重复收集
                if ($.iO(observerObjs, _newObserverObj) === -1) {
                    var index = $.p(observerObjs, _newObserverObj)
                    $.p(_newObserverObj._parent, observerObjs)
                }
            })

            //确保是最后一层的了再恢复
            if (_get_collect_stack.length === 0) {
                __ModelProto__.get = _dm_normal_get;
            }

            return result;
        },
        form: function(dm, key, value) {
            return this._form.apply(dm, arguments)
        },
        toString: function() {
            return this.value;
        }
    }

    var _dm_normal_touchOff = __ModelProto__.touchOff;
    __ModelProto__.touchOff = function(key) {
        var self = this;
        var result = _dm_normal_touchOff.call(self, key)
        var observerObjCollect = observerCache[self.id]
        if (observerObjCollect) {
            //这边key不使用touchOff返回的key，因为可能因为改变的对象是数组而导致touchOff的key变短了，从而无法获取到正确的依赖
            key || (key = "");
            var observerObjs = /*observerObjCollect[""]||*/ observerObjCollect[key];
            do {
                if (!observerObjs) {
                    while (!observerObjs) {
                        key = $.lst(key, ".");
                        if (key !== false) {
                            observerObjs = observerObjCollect[key];
                        } else {
                            observerObjs = observerObjCollect[_split_laveStr] || observerObjCollect[""];
                            break;
                        }
                    }
                }
                observerObjs && $.E(observerObjs, function(observerObj, abandon_index) {
                    var model = Model.get(observerObj.dm_id);
                    //直接使用touchOff无法触发自动更新
                    model.touchOff(observerObj.dm_key)
                });
                observerObjs = $NULL;
            } while (key)
        }
        return result;
    }

    //Model.extend
    _modelExtend("Observer", Observer)
}())


}(this));