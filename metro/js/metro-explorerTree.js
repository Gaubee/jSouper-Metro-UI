(function($) {
    $.widget("metro.explorerTree", {

        version: "1.0.0",

        options: {
            onNodeClick: function(node) {},
            onNodeCollapsed: function(node) {},
            onNodeExpanded: function(node) {}
        },

        _create: function() {
            var that = this,
                element = this.element;

            element.find('.folded[data-role="treefold"]').hide();

            element.on('click', '[data-role="treenode"]', function(e) {
                // var $this = $(this), node = $this.parent().parent("li");
                var node = $(this);
                var treefold = node.children('[data-role="treefold"]');

                if (node.hasClass("keep-open")) return;

                if (treefold.length) {
                    node.toggleClass('folded');
                }

                if (node.hasClass('folded')) {
                    treefold.fadeOut('fast');
                    that.options.onNodeCollapsed(node);
                } else {
                    treefold.fadeIn('fast');
                    that.options.onNodeExpanded(node);
                }

                that.options.onNodeClick(node);
                //不冒泡，避免上级也有
                e.stopPropagation()
                // return false;
            }).on('click', '[data-role="treefold"]', function(e) { //点击展开的功能不冒泡
                e.stopPropagation()
                // return false;
            });

            // element.find("a").each(function(){
            //     var $this = $(this);
            //     $this.css({
            //         paddingLeft: ($this.parents("ul").length-1) * 10
            //     });
            // });

            element.on('click', 'a', function(e) {
                var $this = $(this),
                    node = $this.parent('[data-role="treefold"]');
                element.find('a').removeClass('active');
                $this.toggleClass('active');
                that.options.onNodeClick(node);
                // e.preventDefault();
                // e.stopPropagation();
            });
        },

        _destroy: function() {

        },

        _setOption: function(key, value) {
            this._super('_setOption', key, value);
        }
    })
})(jQuery);
