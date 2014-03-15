define("interaction", function() {
    var interactionRequires = metroCore.slice();
    interactionRequires.push("jQuery", "metro-notify", "metro-dialog");
    return interactionRequires;
}(), function() {
    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    loadCss("/page/css/metro-bootstrap.min.css");
    if (!document.body.classList.contains("metro")) {
        document.body.classList.add("metro");
    }
    jQuery.confirm = function(str, handle) {
        jQuery.Dialog({
            overlay: true,
            shadow: true,
            flat: false,
            draggable: true,
            icon: '<span class="icon-warning"></span>',
            title: '警告！',
            content: '',
            onShow: function(_dialog) {
                var html =
                    "<p style='padding: 6px;'>" + str + "</p>\
                    <div class='place-right' style='position: absolute; bottom: 36px; right: 4px;'>\
                        <button data-role='ok' class='button danger '>确定</button>\
                        <button data-role='cancel' class='button '>取消</button>\
                    </div>\
                    ";
                html = $(html);
                html.find("[data-role='ok']").on("click", function() {
                    handle && handle(true);
                    $.Dialog.close();
                });
                html.find("[data-role='cancel']").on("click", function() {
                    handle && handle(false);
                    $.Dialog.close();
                });
                $.Dialog.content(html);
            }
        });
    };
    jQuery.prompt = function(str, handle) {
        jQuery.Dialog({
            overlay: true,
            shadow: true,
            flat: false,
            draggable: true,
            icon: '<span class="icon-pencil"></span>',
            title: '请输入：',
            content: '',
            onShow: function(_dialog) {
                var html =
                    "<div style='padding: 6px;'>\
                        <p>" + str + "</p>\
                        <div class='input-control text' data-role='input-control'>\
                            <input data-role='prompt' type='text'>\
                            <button class='btn-clear' tabindex='-1' type='button'></button>\
                        </div>\
                    </div>\
                    <div class='place-right' style='position: absolute; bottom: 36px; right: 4px;'>\
                        <button data-role='ok' class='button danger '>确定</button>\
                        <button data-role='cancel' class='button '>取消</button>\
                    </div>\
                    ";
                html = $(html);
                var inputElement = html.find("[data-role='prompt']");
                require(["metro-input-control"], function() {
                    html.find("[data-role='input-control']").inputControl();
                });
                html.find("[data-role='ok']").on("click", function() {
                    handle && handle(inputElement.val());
                    $.Dialog.close();
                });
                html.find("[data-role='cancel']").on("click", function() {
                    handle && handle(null);
                    $.Dialog.close();
                });
                $.Dialog.content(html);
            }
        });
    };
    jQuery.notify = function(str, type) {
        //默认 typ=="info"
        var style = {
            background: "blue",
            color: "white"
        };
        switch (type) {
            case "success":
                style = {
                    background: "green",
                    color: "white"
                };
                break;
            case "error":
                style = {
                    background: "red",
                    color: "white"
                };
                break;
        }
        $.Notify({
            style: style,
            content: str
        });
    }
    console.log("Metro的交互模块程序加载完成");
});
