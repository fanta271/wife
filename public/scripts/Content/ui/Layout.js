// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Content.UIs.Layout = (function(_super) {

    __extends(Layout, _super);

    function Layout() {
      Layout.__super__.constructor.call(this);
    }

    Layout.MIN_WIDTH = 1000;

    Layout.MENU = '#left';

    Layout.SETTING = '#left .setting';

    Layout.prototype._wire = function() {
      var _this = this;
      $(window).bind('resize', function() {
        return _this._idRect();
      });
      return $(window).bind('scroll', function() {
        return _this._positionMenu();
      });
    };

    Layout.prototype._positionMenu = function() {
      return $(Layout.SETTING).css('left', -$(document).scrollLeft() + "px");
    };

    Layout.prototype._idRect = function() {
      var rect;
      rect = {};
      rect.width = Layout.MIN_WIDTH;
      rect.left = Math.max(0, ($(window).width() - rect.width) / 2);
      return this.notify(Content.Event.UI.CONTENT_RECT, rect);
    };

    Layout.prototype.getMenu = function() {
      return $(Layout.MENU)[0];
    };

    Layout.prototype.activate = function() {
      this._wire();
      this._idRect();
      return Layout.__super__.activate.call(this);
    };

    Layout.prototype.deactivate = function() {
      return Layout.__super__.deactivate.call(this);
    };

    return Layout;

  })(Construct);

}).call(this);