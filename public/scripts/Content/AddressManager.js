// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Content.AddressManager = (function(_super) {

    __extends(AddressManager, _super);

    function AddressManager() {
      AddressManager.__super__.constructor.call(this);
    }

    AddressManager.prototype._init = function() {
      var _this = this;
      console.log('starting');
      $.address.change(function(e) {
        return _this._change(e);
      });
      return this._change();
    };

    AddressManager.prototype._change = function(data) {
      if ((data != null ? data.pathNames[0] : void 0) != null) {
        return this.invoke(Content.Delegate.VIEW, data.pathNames[0]);
      } else {
        return this.invoke(Content.Delegate.VIEW, 'home');
      }
    };

    AddressManager.prototype.activate = function() {
      this._init();
      return AddressManager.__super__.activate.call(this);
    };

    return AddressManager;

  })(Manager);

}).call(this);
