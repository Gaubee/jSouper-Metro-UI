// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
(function() {

    /*
     * 基础配置
     */
    var requireConfig = {
        // baseUrl: "./",
        paths: {
            //应用程序核心
            "jSouper": "http://localhost:9000/build/jSouper",
            // "jSouper": "./js/lib/jSouper",

            //交互层核心
            "jQuery": "./js/lib/jquery.min",
            "jQuery.widget": "./js/lib/jquery.widget.min",
            "jQuery.easing": "./js/lib/jquery.easing.1.3.min",
            "jQuery.mousewheel": "./js/lib/jquery.mousewheel",

            //hash路由组件
            "routie": "./js/lib/routie.min",

            /*
             * RequireJs 插件，这里命名决定使用前缀，如"css" => "css!"
             */
            //requireJs CSS插件
            "r_css": "./js/lib/require.css",
            //requireJs Text插件
            "r_text": "./js/lib/require.text",
            //requireJs 国际化插件
            "r_i18n": "./js/lib/require.i18n",

            /*
             * 通用组件包
             * 包括jSouper、jQuery、require.css"
             */
            "common": "./js/require.common"
        },
        shim: {
            "jQuery.widget": {
                deps: ["jQuery", "jQuery.easing", "jQuery.mousewheel"]
            },
            "jQuery.easing": {
                deps: ["jQuery"]
            },
            "jQuery.mousewheel": {
                deps: ["jQuery"]
            },
            "routie": window.dispatchEvent ? {} : {
                /*
                 * 非现代浏览器的话则加入html5 history垫片
                 */
                // deps: ["./js/lib/history.min.js"]
            },
            "metro": {
                deps: ["jQuery", "jQuery.widget", "metro-core"]
            }
        }
    };
    require.config(requireConfig);


    /*
     * 基于jQ的交互组件
     */
    var metroExtends = {
        "metro-accordion": ["metro-global"],
        "metro-button-set": ["metro-global"],
        "metro-calendar": ["metro-global", "metro-locale", "metro-date-format"],
        "metro-carousel": ["metro-global"],
        "metro-core": ["jQuery", "jQuery.widget"],
        "metro-countdown": ["metro-global"],
        "metro-date-format": ["metro-global", "metro-locale"],
        "metro-datepicker": ["metro-global"],
        "metro-dialog": ["metro-global", "metro-touch-handler"],
        "metro-drag-tile": ["metro-global", "metro-touch-handler"],
        "metro-dropdown": ["metro-global", "metro-touch-handler"],
        "metro-fluentmenu": ["metro-global"],
        "metro-global": ["metro-core"],
        "metro-hint": ["metro-global"],
        "metro-initiator": ["metro-global"],
        "metro-input-control": ["metro-global"],
        "metro-listview": ["metro-global"],
        "metro-live-tile": ["metro-global"],
        // "metro-loader":["metro-global"],
        "metro-locale": ["metro-global"],
        "metro-notify": ["metro-global"],
        "metro-plugin-template": ["metro-global"],
        "metro-progressbar": ["metro-global"],
        "metro-pull": ["metro-global", "metro-touch-handler"],
        "metro-rating": ["metro-global"],
        "metro-scroll": ["metro-global"],
        "metro-slider": ["metro-global", "metro-touch-handler"],
        "metro-stepper": ["metro-global"],
        "metro-streamer": ["metro-global", "metro-touch-handler"],
        "metro-tab-control": ["metro-global"],
        "metro-table": ["metro-global"],
        "metro-times": ["metro-global"],
        "metro-touch-handler": ["metro-global"],
        "metro-treeview": ["metro-global"],
        "metro-explorerTree": ["metro-global"]
    };
    /*
     * 非现代浏览器的话则加入html5shiv垫片
     */
    if (!window.dispatchEvent) {
        metroExtends["metro-core"].push("./js/lib/html5");
    }

    /*
     * 批量将名字转化为路径名
     * metro的js组件都在js/metro文件夹下
     */
    for (var extendName in metroExtends) {
        requireConfig.paths[extendName] = "./metro/js/" + extendName;
        requireConfig.shim[extendName] = metroExtends[extendName];
    }

    /*
     * jSouper的模板文件 ==> UI组件
     * 使用html后缀确保编辑器能自动高亮
     */
    var jSouperTemplates = {
        "UI.Form": [
            "r_text!./template/form.html",
            "r_text!./template/form-input.html",
            "r_css!./metro/css/reset.css",
            "r_css!./metro/css/forms.css"
        ]
    };
    var tpl_shims;
    for (var templateName in jSouperTemplates) {
        //生成requireJS的依赖关系数组
        tpl_shims = jSouperTemplates[templateName].slice();
        tpl_shims.unshift("jSouper");
        //定义require的UI模块
        define(templateName, tpl_shims, function(jSouper) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            //解析所有模板文件
            for (var i = 0, len = args.length; i < len; i += 1) {
                args[i] && jSouper.parse(args[i]);
            };
            //手动触发更新页面
            jSouper.App && jSouper.App.model.touchOff(".");
        });
    }

    /*
     * 完成配置
     */
    define("require.config", requireConfig)
}());
