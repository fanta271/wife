// Generated by CoffeeScript 1.3.3
(function() {
  var files, v, _i, _len;

  $.namespace('Content');

  $.namespace('Content.UIs');

  $.namespace('Content.Views');

  Content.ready = function() {
    var load, _ref;
    if (!(files['loading-files'] != null)) {
      if ((_ref = files['loading-files']) == null) {
        files['loading-files'] = $.Deferred();
      }
      (load = function() {
        var def, file, obj,
          _this = this;
        if (files.length === 0) {
          files['loading-files'].resolve();
          return;
        }
        obj = files.shift();
        def = $.Deferred().done(function() {
          return load();
        });
        if (!(obj[0]() != null)) {
          file = obj[1];
          return $.getScript(file, function() {
            return def.resolve();
          });
        } else {
          return def.resolve();
        }
      })();
    }
    return $.when(files['loading-files']);
  };

  files = [
    [
      (function() {
        return window.TAFFY;
      }), 'https://github.com/typicaljoe/taffydb/raw/master/taffy.js'
    ], [
      (function() {
        return window.TAFFY;
      }), '/scripts/taffyDB.min.js'
    ], [
      (function() {
        return Content.Get;
      }), '/scripts/content/Get.js'
    ], [
      (function() {
        return Content.Event;
      }), '/scripts/content/Event.js'
    ], [
      (function() {
        return Content.Delegate;
      }), '/scripts/content/Delegate.js'
    ], [
      (function() {
        return Content.Service;
      }), '/scripts/content/Service.js'
    ], [
      (function() {
        return Content.AddressManager;
      }), '/scripts/content/AddressManager.js'
    ], [
      (function() {
        return Content.ContentManager;
      }), '/scripts/content/ContentManager.js'
    ], [
      (function() {
        return Content.View;
      }), '/scripts/Content/View.js'
    ], [
      (function() {
        return Content.UIs.Contact;
      }), '/scripts/content/ui/Contact.js'
    ], [
      (function() {
        return Content.UIs.Gallery;
      }), '/scripts/content/ui/Gallery.js'
    ], [
      (function() {
        return Content.UIs.Home;
      }), '/scripts/content/ui/Home.js'
    ], [
      (function() {
        return Content.UIs.Layout;
      }), '/scripts/content/ui/Layout.js'
    ], [
      (function() {
        return Content.Views.Contact;
      }), '/scripts/content/view/Contact.js'
    ], [
      (function() {
        return Content.Views.Gallery;
      }), '/scripts/content/view/Gallery.js'
    ], [
      (function() {
        return Content.Views.Home;
      }), '/scripts/content/view/Home.js'
    ]
  ];

  if (typeof require !== "undefined" && require !== null) {
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      v = files[_i];
      if (!(v[0]() != null)) {
        require(Util.scriptsPath(v[1]));
      }
    }
  }

}).call(this);
