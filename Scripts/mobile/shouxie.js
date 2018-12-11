// var wp = new WritingPad();
    // $(function () {
    //         var wp = new WritingPad();
    // });
   function initSignature() {

          if (window.requestAnimFrame) {
              var signature = $("#mySignature");
              signature.jqSignature({
                // width: 500,
                // height: 300,
                // border: '1px solid red',
                background: '#fff', 
                lineColor: '#000', 
                lineWidth: 2, 
                autoFit: false 
              });
              //{ width: 600, height: 200, border: '1px solid red', background: '#16A085', lineColor: '#ABCDEF', lineWidth: 2, autoFit: true }
          } else {

              alert("请加载jq-signature.js");
              return;
          }
      }
/**
 * 功能：签名canvas面板初始化,为WritingPad.js手写面板js服务。
 * 作者：黄金锋 (549387177@qq.com)
 * 日期：2015-11-15  15:51:01
 * 版本：version 1.0
 */

(function (window, document, $) {
    'use strict';

  // Get a regular interval for drawing to the screen
  window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimaitonFrame ||
      function (callback) {
        window.setTimeout(callback, 1000/60);
      };
  })();

  /*
  * Plugin Constructor
  */

  var pluginName = 'jqSignature',
      defaults = {
        lineColor: '#222222',
        lineWidth: 1,
        border: '1px dashed #eee',
        background: '#FFFFFF',
        width: 400,
        height:216,
        autoFit: false
      },
      canvasFixture = '#ctx';

  function Signature(element, options) {
    // DOM elements/objects
    this.element = element;
    this.$element = $(this.element);
    this.canvas = false;
    this.$canvas = false;
    this.ctx = false;
    // Drawing state
    this.drawing = false;
    this.currentPos = {
      x: 0,
      y: 0
    };
    this.lastPos = this.currentPos;
    // Determine plugin settings
    this._data = this.$element.data();
    this.settings = $.extend({}, defaults, options, this._data);
    // Initialize the plugin
    this.init();
  }

  Signature.prototype = {
    // Initialize the signature canvas
    init: function() {
      // Set up the canvas
      this.$canvas = $(canvasFixture).appendTo(this.$element);
      this.$canvas.attr({
        width: this.settings.width,
        height: this.settings.height
      });
      this.$canvas.css({
        boxSizing: 'border-box',
        width: this.settings.width + 'px',
        height: this.settings.height + 'px',
        border: this.settings.border,
        background: this.settings.background,
        cursor: 'crosshair'
      });
      // Fit canvas to width of parent
      if (this.settings.autoFit === true) {
        this._resizeCanvas();
      }
      this.canvas = this.$canvas[0];
      this._resetCanvas();
      // Set up mouse events
      this.$canvas.on('mousedown touchstart', $.proxy(function(e) {
        this.drawing = true;
        this.lastPos = this.currentPos = this._getPosition(e);
      }, this));
      this.$canvas.on('mousemove touchmove', $.proxy(function(e) {
        this.currentPos = this._getPosition(e);
      }, this));
      this.$canvas.on('mouseup touchend', $.proxy(function(e) {
        this.drawing = false;
        // Trigger a change event
        var changedEvent = $.Event('jq.signature.changed');
        this.$element.trigger(changedEvent);
      }, this));
      // Prevent document scrolling when touching canvas
      $(document).on('touchstart touchmove touchend', $.proxy(function(e) {
        if (e.target === this.canvas) {
          e.preventDefault();
        }
      }, this));
      // Start drawing
      var that = this;
      (function drawLoop() {
        window.requestAnimFrame(drawLoop);
        that._renderCanvas();
      })();
    },
    // Clear the canvas
    clearCanvas: function() {
      this.canvas.width = this.canvas.width;
      this._resetCanvas();
    },
    // Get the content of the canvas as a base64 data URL
    getDataURL: function() {
      return this.canvas.toDataURL();
    },

    reLoadData: function () {
        this.$canvas.remove();
        this._data = this.$element.data();

        //for (var i in this.settings) {
        //    alert(i+":"+this.settings[i]);
        //}

        //this.settings = $.extend({}, defaults, this._data);
        this.init();
    },
    // Get the position of the mouse/touch
    _getPosition: function(event) {
      var xPos, yPos, rect;
      rect = this.canvas.getBoundingClientRect();
      event = event.originalEvent;
      // Touch event
      if (event.type.indexOf('touch') !== -1) { // event.constructor === TouchEvent
        xPos = event.touches[0].clientX - rect.left;
        yPos = event.touches[0].clientY - rect.top;
      }
      // Mouse event
      else {
        xPos = event.clientX - rect.left;
        yPos = event.clientY - rect.top;
      }
      return {
        x: xPos,
        y: yPos
      };
    },
    // Render the signature to the canvas
    _renderCanvas: function() {
      if (this.drawing) {
        this.ctx.moveTo(this.lastPos.x, this.lastPos.y);
        this.ctx.lineTo(this.currentPos.x, this.currentPos.y);
        this.ctx.stroke();
        this.lastPos = this.currentPos;
      }
    },
    // Reset the canvas context
    _resetCanvas: function() {
      this.ctx = this.canvas.getContext("2d");
      this.ctx.strokeStyle = this.settings.lineColor;
      this.ctx.lineWidth = this.settings.lineWidth;
    },
    // Resize the canvas element
    _resizeCanvas: function() {
      var width = this.$element.outerWidth();
      this.$canvas.attr('width', width);
      this.$canvas.css('width', width + 'px');
    }
  };

  /*
  * Plugin wrapper and initialization
  */

  $.fn[pluginName] = function ( options ) {
    var args = arguments;
    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Signature( this, options ));
        }
      });
    } 
    else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      var returns;
      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof Signature && typeof instance[options] === 'function') {
            var myArr=Array.prototype.slice.call( args, 1 );
            returns = instance[options].apply(instance, myArr);
        }
        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }

      });
      return returns !== undefined ? returns : this;
    }
  };

})(window, document, jQuery);

/**
 * 功能：使用该jQuery插件来制作在线签名或涂鸦板，用户绘制的东西可以用图片的形式保存下来。
 * 作者：黄金锋 (549387177@qq.com)
 * 日期：2015-11-16  13:51:01
 * 版本：version 1.0
 */

var WritingPad = function () {

    var current = null;

    $(function () {

        // initHtml();

        initTable();

        initSignature();

        if ($(".modal")) {
            $(".modal").modal("toggle");
        } else {
            alert("没用手写面板");
        }

        // $(document).on("click", "#myClose,.close", null, function () {
        //     $('#mymodal').modal('hide');
        //     $("#mymodal").remove();

        // });

        $(document).on("click", "#mySave", null, function () {
            $(".page-content").css({"overflow":"auto"})
            var myImg = $('#myImg').empty();
            var dataUrl = $('.js-signature').jqSignature('getDataURL');
            var img = $('<img>').attr('src', dataUrl);
            // $(myImg).append($('<p>').text("图片保存在这里"));
            $(myImg).append(img)
        });

        $(document).on("click", "#myEmpty", null, function () {
          //清空
           $(".page-content").css({"overflow":"auto"})
            $('.js-signature').jqSignature('clearCanvas');

        });
        $(document).on("mouseover", "#myTable", null, function () {

            if ((event.srcElement.tagName == "TD") && (current != event.srcElement)) {
                if (current != null) { current.style.backgroundColor = current._background }
                event.srcElement._background = event.srcElement.style.backgroundColor;
                current = event.srcElement;
            }

        });

        $(document).on("mouseout", "#myTable", null, function () {

            if (current != null) current.style.backgroundColor = current._background

        });

        $(document).on("click", "#myTable", null, function () {

            if (event.srcElement.tagName == "TD") {
                var color = event.srcElement._background;
                if (color) {
                    $("input[name=DisColor]").css("background-color", color);
                    var strArr = color.substring(4, color.length - 1).split(',');
                    var num = showRGB(strArr);
                    $("input[name=HexColor]").val(num);
                }
            }

        });

        $(document).on("click", "#btnSave", null, function () {

            $('#colorpanel').css("display", "none");
            var typeData = $("#btnSave").data("sender");
            var HexColor = $("input[name=HexColor]").val();
            var data = $(".js-signature").data();
            if (typeData == "#myColor") {
                data["plugin_jqSignature"]["settings"]["lineColor"] = HexColor;
                $('.js-signature').jqSignature('reLoadData');
            }
            if (typeData == "#myBackColor") {

                data["plugin_jqSignature"]["settings"]["background"] = HexColor;
                $('.js-signature').jqSignature('reLoadData');
            }
        });
    });
    function initTable() {
        var colorTable = "";
        var ColorHex = new Array('00', '33', '66', '99', 'CC', 'FF');
        var SpColorHex = new Array('FF0000', '00FF00', '0000FF', 'FFFF00', '00FFFF', 'FF00FF');
        for (var i = 0; i < 2; i++)
        {
            for (var j = 0; j < 6; j++)
            {
                colorTable = colorTable + '<tr height=12>';
                colorTable = colorTable + '<td width=11 style="background-color:#000000"></td>';

                if (i == 0)
                {
                    colorTable = colorTable + '<td width=11 style="background-color:#' + ColorHex[j] + ColorHex[j] + ColorHex[j] + '"></td>';
                }
                else
                {
                    colorTable = colorTable + '<td width=11 style="background-color:#' + SpColorHex[j] + '"></td>';
                }

                //colorTable = colorTable + '<td width=11 style="background-color:#000000"></td>';

                for (var k = 0; k < 3; k++)
                {
                    for (l = 0; l < 6; l++)
                    {
                        colorTable = colorTable + '<td width=11 style="background-color:#' + ColorHex[k + i * 3] + ColorHex[l] + ColorHex[j] + '"></td>';
                    }
                }
                colorTable = colorTable + '</tr>';


            }
        }
        $("#colorpanel").append(colorTable);
    }


    return {
        init: function () {
            init();
        }
    };
}