(function() {
  var ListItem,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof window === "undefined" || window === null) window = GLOBAL;

  /**
  @namespace
  */

  /**
  Utility class
  @class Util
  */

  if (window.Util == null) window.Util = {};

  /**
  In IE678 native environment using filter property disables anti-aliasing.  If set to 'true' don't use
  any operation which creates a 'filter' on an element (like opacity).
  @property nofilter
  @type boolean
  @public
  */

  if (typeof $ !== "undefined" && $ !== null) {
    Util.nofilter = $('.ie7, .ie8').length > 0 ? true : false;
    Util.ielt9 = $('.ie7, .ie8').length > 0 ? true : false;
    Util.ltie9 = $('.ie7, .ie8').length > 0 ? true : false;
  }

  Util.each = function(obj, fn) {
    var i, res, v, _len, _results, _results2, _this;
    _this = this;
    if (obj instanceof Array) {
      _results = [];
      for (i = 0, _len = obj.length; i < _len; i++) {
        v = obj[i];
        res = (function(v, i) {
          return fn.call(_this, i, v);
        })(v, i);
        if (res === false) {
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else if (typeof obj === 'object') {
      _results2 = [];
      for (i in obj) {
        v = obj[i];
        if (i.match(/^__/) != null) continue;
        res = (function(i, v) {
          return fn.call(_this, i, v);
        })(i, v);
        if (res === false) {
          break;
        } else {
          _results2.push(void 0);
        }
      }
      return _results2;
    }
  };

  Util.map = function(obj, fn) {
    var i, ret, v, _this;
    _this = this;
    if (obj instanceof Array) {
      ret = (function() {
        var _len, _results;
        _results = [];
        for (i = 0, _len = obj.length; i < _len; i++) {
          v = obj[i];
          _results.push((function(v, i) {
            return fn.call(_this, i, v);
          })(v, i));
        }
        return _results;
      })();
    } else if (typeof obj === 'object') {
      ret = (function() {
        var _results;
        _results = [];
        for (i in obj) {
          v = obj[i];
          if (i.match(/^__/) != null) continue;
          _results.push((function(i, v) {
            return fn.call(_this, i, v);
          })(i, v));
        }
        return _results;
      })();
    }
    return ret;
  };

  Util.filter = function(col, fn) {
    var i, ret, v, _fn, _fn2, _len, _this;
    _this = this;
    ret = [];
    if (col instanceof Array) {
      _fn = function(v, i) {
        var a;
        a = fn.call(_this, i, v);
        if (a === true) ret.push(v);
        return a;
      };
      for (i = 0, _len = col.length; i < _len; i++) {
        v = col[i];
        _fn(v, i);
      }
    } else if (typeof col === 'object') {
      _fn2 = function(i, v) {
        var a;
        a = fn.call(_this, i, v);
        if (a === true) ret.push(v);
        return a;
      };
      for (i in col) {
        v = col[i];
        _fn2(i, v);
      }
    }
    return ret;
  };

  /**
  Used in node.js  Current working directory with valid '/' instead of '\'
  @method cwd
  @public
  @returns {string} proper, current working directory.
  */

  Util.cwd = function() {
    var p;
    p = process.cwd().toString().replace(/\\/g, '/').replace(/\/\//g, '/');
    console.log(p);
    return p;
  };

  /**
  Used in node.js  Takes a server relative path and returns a machine path.
  @method scriptsPath
  @public
  @param path {string} path relative to server
  @return {string} path relative to machine.
  */

  Util.scriptsPath = function(path) {
    var cur;
    cur = __filename;
    cur = cur.replace(/\\/g, '/');
    cur = cur.replace('/Scripts/util/util.js', '');
    cur = cur.replace('C:', '');
    return cur + path;
  };

  /**
  Return true if given deferred object is either resolved or rejected, else return false.  If deferred
  object was not given return undefined.
  @method isset
  @public
  @param x {$.Deferred()} Deferred object to test.
  @return {true/false/undefined} 'true' if object is resolved or rejected, 'false' if pending, 'undefined' if
  object was not given.
  */

  if (typeof $ !== "undefined" && $ !== null) {
    Util.isset = function(x) {
      if (!(x != null)) return;
      if ((x.promise != null) && typeof x.promise === 'function') {
        if (x.state != null) {
          if (x.state === 'pending') {
            return false;
          } else {
            return true;
          }
        } else if (!x.isResolved() && !x.isRejected()) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    };
  }

  /**
  Check the status of a deferred object.
  @method status
  @public
  @param x {$.Deferred} Deferred object to test.
  @return {string} resolved/rejected/pending.
  */

  if (typeof $ !== "undefined" && $ !== null) {
    Util.status = function(x) {
      if (!(x != null)) return;
      if ((x.promise != null) && typeof x.promise === 'function') {
        if (x.state != null) {
          return x.state();
        } else if (x.isResolved()) {
          return 'resolved';
        } else if (x.isRejected()) {
          return 'rejected';
        } else {
          return 'pending';
        }
      } else {
        return null;
      }
    };
  }

  /**
  Same as $.when but deferred.  As with $.when if a parameter is not promise-able its wrapped in
  a deferred object and resolved.
  @method whenDef
  @public
  @param [p1] {$.Deferred}
  @param [p2] {$.Deferred}
  @param [p3] {$.Deferred}
  @return {$.Deferred} Resolves when all member deferred objects resolve.
  */

  if (typeof $ !== "undefined" && $ !== null) {
    Util.whenDef = Util.when = function() {
      var always, def, end;
      def = $.Deferred();
      always = [];
      def.always = function(fn) {
        always.push(fn);
        return def;
      };
      end = function() {
        var v, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = always.length; _i < _len; _i++) {
          v = always[_i];
          _results.push(v.apply(def, arguments));
        }
        return _results;
      };
      $.when.apply($, arguments).done(function() {
        def.resolve.apply(def, arguments);
        return end.apply(window.arguments);
      }).fail(function() {
        def.reject.apply(def, arguments);
        return end.apply(window, arguments);
      });
      return def;
    };
  }

  /**
  Safe image loading.  Checks every 2 secs to ensure resolution.  This will also
  ensure that width and height are set on an image even if image is not added to display.
  
  @method atLoad
  @public
  @param img {Image} Image object
  @return {$.Deferred} Resolves when image has loaded.
  */

  Util.atLoad = function(img) {
    var $c, $img, def, load,
      _this = this;
    $img = $(img);
    def = $.Deferred();
    load = function(i) {
      var $i, d;
      $i = $(i);
      d = $.Deferred();
      if ($i.attr('complete') === true) {
        d.resolve();
      } else {
        $i.load(function() {
          return d.resolve();
        }).error(function() {
          return d.reject();
        });
      }
      return d;
    };
    $c = $('<img />').attr('src', $img.attr('src')).css({
      top: 0,
      position: 'absolute',
      visibility: 'hidden'
    }).appendTo('body');
    load($c[0]).done(function() {
      def.resolve({
        width: $c.width(),
        height: $c.height()
      });
      return $c.remove();
    }).fail(function() {
      def.resolve({});
      return $c.remove();
    });
    return def;
  };

  /**
  Return a deferred object which resolves only when all members are resolved at the point of
  a test, else test-again.
  @method onlyWhen
  @public
  @param defGetter {function} When called will return a single promise-able or an array of promise-able
  objects.
  @return {$.Deferred} Resolves when all promise-able members tested have resolved at the point of a test.
  @example
  <pre>
    this.deferred['foo']=$.Deferred();
    this.deferred['boo']=$.Deferred();
    
    var fn = function() {
      return [
        this.deferred['foo'],
        this.deferred['boo']
      ];
    };
    
    var a = Util.onlyWhen(fn)
    
    if:
       1. foo resolves
       2. foo reset
       3. boo resolves
       4. foo resolves
    then:
       a will resolve only after step 4 not 3.
  </pre>
  */

  if (typeof $ !== "undefined" && $ !== null) {
    Util.onlyWhen = function(defGetter) {
      var def, get, test;
      def = $.Deferred();
      get = function() {
        var res;
        res = defGetter();
        if (res instanceof Array === false) res = [res];
        return res;
      };
      (test = function() {
        return $.when.apply($, get()).done(function() {
          var x, _i, _len, _ref;
          _ref = get();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            if (Util.isset(x) === false) {
              test();
              return;
            }
          }
          return def.resolve.apply(def, arguments);
        }).fail(function() {
          return def.reject.apply(def, arguments);
        });
      })();
      return def;
    };
  }

  if (typeof $ !== "undefined" && $ !== null) {
    jQuery.fn.validatePIE = function() {
      if (window.PIE) {
        this.each(function() {
          var $this;
          $this = $(this);
          /* Attach PIE to all elements marked as 'pie' if PIE was not yet attached.
          */
          $this.find('[pie="1"]').andSelf().filter(function() {
            if ($(this).is('[_pieId]') === true) {
              return false;
            } else {
              return true;
            }
          }).each(function() {
            return PIE.attach(this);
          });
          /* Custom trigger 'onmove' to force update.
          */
          return $this.find('[_pieId]').andSelf().each(function() {
            return this.fireEvent('onmove');
          });
        });
      }
      return this;
    };
  }

  /**
  Get DOM elements under mouse point.
  @method elementsFromPoint
  @public
  @param x {int} mouseX
  @param y {int} mouseY
  @return {array} DOM elements under x and y coordinates.
  */

  Util.elementsFromPoint = function(x, y) {
    var counter, elm, i, v, _bVis, _elms, _len;
    _elms = [];
    _bVis = [];
    counter = 0;
    while (true) {
      counter++;
      if (counter > 1000) break;
      elm = document.elementFromPoint(x, y);
      _elms.push(elm);
      _bVis.push(elm.style.visibility);
      elm.style.visibility = 'hidden';
      if (elm.nodeName === 'HTML') break;
    }
    for (i = 0, _len = _elms.length; i < _len; i++) {
      v = _elms[i];
      v.style.visibility = _bVis[i];
    }
    return _elms;
  };

  if (window.Construct != null) {
    Util.DocIcon = Util.LoadIcon = (function(_super) {

      __extends(LoadIcon, _super);

      function LoadIcon(d) {
        LoadIcon.__super__.constructor.call(this);
        Model.prototype.__setModel__.call(this, d);
      }

      LoadIcon.prototype.LOADER_HTML_SELECTOR = '.LoaderIconHTML';

      LoadIcon.prototype.LOADER_HTML = null;

      LoadIcon.prototype.tile = null;

      LoadIcon.prototype.message = 'loading';

      LoadIcon.prototype.container = null;

      LoadIcon.prototype.classList = null;

      LoadIcon.prototype.css = null;

      LoadIcon.prototype._validate = function() {
        if (!(this.container != null)) throw 'Container not set';
      };

      LoadIcon.prototype._craft = function() {
        var $tile, tile, v, _i, _len, _ref;
        tile = ($tile = $(this.LOADER_HTML).css({
          position: 'absolute'
        }))[0];
        if (this.classList != null) {
          if (typeof this.classList === 'string') {
            this.classList = [this.classList];
          }
          _ref = this.classList;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            v = _ref[_i];
            $tile.addClass(v);
          }
        }
        if (this.css != null) $tile.css(this.css);
        if (this.message != null) $tile.find(".Message").text(this.message);
        return tile;
      };

      LoadIcon.prototype._show = function() {
        if (!(this.tile != null)) this.tile = this._craft();
        return $(this.tile).appendTo(this.container);
      };

      LoadIcon.prototype._hide = function() {
        return $(this.tile).remove();
      };

      LoadIcon.prototype.activate = function() {
        var $extract;
        this._validate();
        if (!(this.LOADER_HTML != null)) {
          $extract = $(this.LOADER_HTML_SELECTOR);
          if ($extract.lenth === 0) {
            throw 'Must include shared/_ModalWaiter to use LoadIcon';
          }
          LoadIcon.prototype.LOADER_HTML = $extract.html();
        }
        this._show();
        return LoadIcon.__super__.activate.call(this);
      };

      LoadIcon.prototype.deactivate = function() {
        this._hide();
        return LoadIcon.__super__.deactivate.apply(this, arguments);
      };

      return LoadIcon;

    })(Construct);
  }

  /* Request animation shim.
  */

  
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 100);
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
;

  Util.List = (function() {

    function List() {
      this.length = 0;
    }

    List.prototype.first = null;

    List.prototype.last = null;

    List.prototype.length = null;

    List.prototype.push = function(d) {
      var item;
      item = new ListItem(d);
      if (this.last != null) {
        this.last.next = item;
        item.previous = this.last;
        this.last = item;
      }
      if (!(this.first != null)) this.first = item;
      if (!(this.last != null)) this.last = item;
      this.length++;
      return item;
    };

    List.prototype._pop = function() {
      var item;
      if (this.last != null) {
        item = this.last;
        if (item.previous != null) item.previous.next = null;
        this.last = item.previous;
        item.previous = null;
        if (!(this.last != null)) this.first = null;
        this.length--;
        return item;
      } else {

      }
    };

    List.prototype.pop = function() {
      var _ref;
      return (_ref = _pop()) != null ? _ref.data : void 0;
    };

    List.prototype._shift = function() {
      var item;
      if (this.first != null) {
        item = this.first;
        if (item.next != null) item.next.previous = null;
        this.first = item.next;
        item.next = null;
        if (!this.first) this.last = null;
        this.length--;
        return item;
      } else {

      }
    };

    List.prototype.shift = function() {
      var _ref;
      return (_ref = _shift()) != null ? _ref.data : void 0;
    };

    List.prototype.unshift = function(d) {
      var item;
      item = new ListItem(d);
      if (this.first != null) {
        this.first.previous = item;
        item.next = this.first;
        this.first = item;
      }
      if (!(this.first != null)) this.first = item;
      if (!(this.last != null)) this.last = item;
      this.length++;
      return item;
    };

    List.prototype.remove = function() {
      var item, _i, _len;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        item = arguments[_i];
        if (item.previous != null) item.previous.next = item.next;
        if (item.next != null) item.next.previous = item.previous;
        if (this.first === item) this.first = item.next;
        if (this.last === item) this.last = item.previous;
        this.previous = this.next = null;
        this.length--;
      }
      return;
    };

    return List;

  })();

  ListItem = (function() {

    function ListItem(d) {
      this.data = d;
    }

    ListItem.prototype.data = null;

    ListItem.prototype.next = null;

    ListItem.prototype.previous = null;

    return ListItem;

  })();

  Util.queue = new (Util.Queue = (function() {

    function Queue() {}

    Queue.prototype.queue = null;

    Queue.prototype.cache = null;

    Queue.prototype.nextFrame = null;

    Queue.prototype._act = function() {
      var item,
        _this = this;
      if ((item = this.queue._shift()) != null) {
        $.when(item.data()).done(function() {
          delete _this.cache[item.__guid__];
          return _this._test();
        });
      } else {
        this._test();
      }
      return;
    };

    Queue.prototype._test = function() {
      var _this = this;
      if (this.queue.length !== 0) {
        this.nextFrame = window.requestAnimationFrame(function() {
          return _this._act();
        });
      } else {
        this.clear();
      }
      return;
    };

    Queue.prototype.push = function(fn, guid) {
      var listItem, _base, _ref, _ref2,
        _this = this;
      if (!(this.queue != null)) {
        if (this.queue == null) this.queue = new Util.List();
        this.nextFrame = window.requestAnimationFrame(function() {
          return _this._act();
        });
      }
      (listItem = this.queue.push(fn)).__guid__ = guid;
      ((_ref = (_base = ((_ref2 = this.cache) != null ? _ref2 : this.cache = {}))[guid]) != null ? _ref : _base[guid] = []).push(listItem);
      return;
    };

    Queue.prototype.unshift = function(fn, guid) {
      var listItem, _base, _ref, _ref2,
        _this = this;
      if (!(this.queue != null)) {
        if (this.queue == null) this.queue = new Util.List();
        this.nextFrame = window.requestAnimationFrame(function() {
          return _this._act();
        });
      }
      (listItem = this.queue.unshift(fn)).__guid__ = guid;
      ((_ref = (_base = ((_ref2 = this.cache) != null ? _ref2 : this.cache = {}))[guid]) != null ? _ref : _base[guid] = []).push(listItem);
      return;
    };

    Queue.prototype.cancel = function() {
      var guid, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        guid = arguments[_i];
        if ((this.queue != null) && (this.cache[guid] != null)) {
          this.queue.remove.apply(this.queue, this.cache[guid]);
          delete this.cache[guid];
          _results.push(true);
        } else {
          _results.push(false);
        }
      }
      return _results;
    };

    Queue.prototype.clear = function() {
      if (this.nextFrame != null) window.cancelAnimationFrame(this.nextFrame);
      this.queue = null;
      this.cache = null;
      return;
    };

    return Queue;

  })())();

}).call(this);
