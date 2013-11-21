
/** 
Base extender for construct.  Provides getters, events, and delegates objects.
@class Getter
@constructor
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Getter = (function() {

    function Getter() {
      this.guid = +(new Date());
      /** Object collection of getter handlers.
      @property getters
      @protected
      */
      this.getters = {};
      /** Object collection of event handlers.
      @property events
      @protected
      */
      this.events = {};
      /** Object collection of delegate handlers.
      @property delegates
      @protected
      */
      this.delegates = {};
    }

    /** Set a getter handler
    @method getter
    @public
    @param {string} type Well named type.
    @param {string} id Handler guid.  Used to reference this specific handler in a collection
    @param {function} funct Handler to execute.
    */

    Getter.prototype.getter = function(type, id, funct) {
      var _base, _ref;
      ((_ref = (_base = this.getters)[type]) != null ? _ref : _base[type] = {})[id] = funct;
      return this;
    };

    /** Set an event handler
    @method bind
    @public
    @param {string} type Well named type.
    @param {string} id Handler guid.  Used to reference this specific handler in a collection
    @param {function} funct Handler to execute.
    */

    Getter.prototype.bind = function(type, guid, funct) {
      var _base, _ref;
      ((_ref = (_base = this.events)[type]) != null ? _ref : _base[type] = {})[guid] = funct;
      return this;
    };

    /** Set a delegate
    @method delegate
    @public
    @param {string} type Well named type.
    @param {string} id Handler guid.  Used to reference this specific handler in a collection
    @param {function} funct Handler to execute.
    */

    Getter.prototype.delegate = function(type, guid, funct) {
      var _base, _ref;
      ((_ref = (_base = this.delegates)[type]) != null ? _ref : _base[type] = {})[guid] = funct;
      return this;
    };

    /** Get a bound property
    @method get
    @public
    @param {string} n Well named type.
    */

    Getter.prototype.get = function(n, args, all) {
      var i, ret, v;
      ret = [];
      if (this.getters[n] != null) {
        ret = (function() {
          var _ref, _results;
          _ref = this.getters[n];
          _results = [];
          for (i in _ref) {
            v = _ref[i];
            _results.push(v(args));
          }
          return _results;
        }).call(this);
      }
      if (all != null) {
        return ret;
      } else {
        return ret[0];
      }
    };

    /** Dispatch event
    @method notify
    @public
    @param {string} type Well name type.
    @param {object} data Data to expose.
    */

    Getter.prototype.notify = function(type, data) {
      var args;
      args = [].slice.call(arguments, 0);
      args[0] = {
        type: type
      };
      this.trigger.apply(this, args);
      return;
    };

    Getter.prototype.trigger = function(e, data) {
      var args, i, protArgs, v, _ref;
      protArgs = void 0;
      args = [].slice.call(arguments, 0);
      if (this.events[e.type] != null) {
        _ref = this.events[e.type];
        for (i in _ref) {
          v = _ref[i];
          v.apply(this, args);
        }
      }
      return;
    };

    /** Invoke a delegate
    @method invoke
    @public
    @param {string} type Well name type.
    @param {object} data Data to expose.
    */

    Getter.prototype.invoke = function(type, data) {
      var args, i, protArgs, ret, v;
      protArgs = void 0;
      args = [].slice.call(arguments, 0);
      args[0] = {
        type: type
      };
      ret = [];
      if (this.delegates[type] != null) {
        ret.concat((function() {
          var _ref, _results;
          _ref = this.delegates[type];
          _results = [];
          for (i in _ref) {
            v = _ref[i];
            _results.push(v.apply(this, args));
          }
          return _results;
        }).call(this));
      }
      return ret;
    };

    /* PUBLIC: bind/unbind event.
    */

    /** Unbind an event
    @method unbind
    @public
    @param {string} type Well named reference.
    @param {string} guid Handler reference.
    */

    Getter.prototype.unbind = function(type, guid) {
      var i, v, _ref;
      if ((_ref = this.events[type]) != null) delete _ref[guid];
      if (((function() {
        var _ref2, _results;
        _ref2 = this.events[type];
        _results = [];
        for (i in _ref2) {
          v = _ref2[i];
          _results.push(v);
        }
        return _results;
      }).call(this)).length === 0) {
        delete this.events[type];
      }
      return;
    };

    /** Drop a getter
    @method dropGetter
    @public
    @param {string} type Well named reference.
    @param {string} id Handler guid reference.
    */

    Getter.prototype.dropGetter = function(type, id) {
      if (this.getters[type] != null) delete this.getters[type][id];
      return;
    };

    /** Ignore a delegate
    @method undelegate
    @public
    @param {string} type Well named reference.
    @param {string} guid Handler guid reference.
    */

    Getter.prototype.undelegate = function(type, guid) {
      var i, v, _ref;
      if ((_ref = this.delegates[type]) != null) delete _ref[guid];
      if (((function() {
        var _ref2, _results;
        _ref2 = this.delegates[type];
        _results = [];
        for (i in _ref2) {
          v = _ref2[i];
          _results.push(v);
        }
        return _results;
      }).call(this)).length === 0) {
        delete this.delegates[type];
      }
      return;
    };

    return Getter;

  })();

  /** 
  Base construct building block.
  @class Construct
  @extends Getter
  @constructor
  */

  window.Construct = (function(_super) {

    __extends(Construct, _super);

    function Construct() {
      this.query = __bind(this.query, this);
      this._dbPropagator = __bind(this._dbPropagator, this);
      this.setQuery = __bind(this.setQuery, this);      Construct.__super__.constructor.call(this);
      this.deferred = {};
      this.deferred['ready'] = $.Deferred();
      this.members = [];
    }

    /** 
    Object collection of construct deferred processes.
    @property deferred
    @type object
    @protected
    */

    Construct.prototype.deferred = null;

    /** 
    Collection of construct members.  While having members the construct becomes a container.
    @property members
    @type Array
    @protected
    */

    Construct.prototype.members = null;

    /**
    Construct db.  Used in multi-tier communication between constructs in conjunction with ConstructQuery
    @property db
    @type TAFFY
    @protected
    */

    Construct.prototype.db = null;

    /**
    If construct is active.  Set/unset in activate/deactivate.
    @property active
    @type boolean
    */

    Construct.prototype.active = false;

    /**
    Construct model
    @property model
    @type Model
    */

    Construct.prototype.model = null;

    /**
    Init TAFFY db if such is needed.
    @method _initDB
    @protected
    */

    Construct.prototype._initDB = function() {
      this.db = TAFFY();
      return;
    };

    /**
    Set construct query.  This query is then propagated to all containers thus a root container
    will have access to a handler (through query) exposed on a leaf member.
    @method setQuery
    @protected
    @param {ConstructQuery} query Query to set.
    @example
      var c=new Construct()
      , expose=function(){ ... }
      ;
      
      c.setQuery(
        new ObjectWhichExtendsConstructQuery( expose )
      )
    */

    Construct.prototype.setQuery = function(query) {
      var row, _base;
      if (!(query != null) || query instanceof ConstructQuery === false) {
        throw 'Need Query.';
      }
      if (!(query.fn != null)) throw 'Function not set on query.';
      if (!(query.guid != null)) {
        query.guid = this.guid;
        query.model = this.model;
      }
      if (!(this.db != null)) this._initDB();
      row = query.set(this.db);
      return typeof (_base = this.get('db-propagator')) === "function" ? _base(row, true) : void 0;
    };

    /**
    Propagates the database from member construct to container construct.
    @method _dbPropagator
    @private
    @param data {object} Object from TAFFY row object which is used to identify/create a row object
    @param add {boolean} True if record is being added, false if record is being dropped
    */

    Construct.prototype._dbPropagator = function(data, add) {
      var a, rec, _base;
      if (!(this.db != null)) this._initDB();
      if (add === true) {
        rec = this.db({
          guid: data.guid
        }).first() || this.db.insert({
          guid: data.guid
        }).first();
        this.db(rec).update(data);
      } else if (add === false) {
        a = this.db({
          guid: data.guid
        }).first();
        this.db(a).remove();
      }
      return typeof (_base = this.get('db-propagator')) === "function" ? _base(data, true) : void 0;
    };

    /**
    Execute a query object
    @method query
    @public
    @param query {ConstructQuery}  Query to execute.
    @return {ConstructQuery} Query prepared for execution.  
    @example
    <pre>
      constructInstance.query(
        new ObjectExtendsConstructQuery()
      ).execute( someData )
    <pre>
    */

    Construct.prototype.query = function(query) {
      var q;
      if (!(query != null) || query instanceof ConstructQuery === false) {
        throw 'Query object expected.';
      }
      /* Construct will be given a query getter if container is able to handle a query.  Thus the root container will be used as a db src of a query.
      */
      if ((q = this.get('query-getter')) != null) return q(query);
      /* This construct is the root container of a 'system' execute the query here.
      */
      /* Makesure there's working db on this construct.
      */
      if (!(this.db != null)) this._initDB();
      query.db = this.db;
      return query;
    };

    /**
    Triggered after this construct was added to a container construct.
    @event Construct.Event.ADDED_TO_CONSTRUCT
    @param {object} obj {me:this-construct, construct:container-construct}
    */

    /**
    Called after construct was added to a container construct.
    @method addedToConstruct
    @public
    @param construct {Construct} Container construct.
    */

    Construct.prototype.addedToConstruct = function(construct) {
      this.notify(Construct.Event.ADDED_TO_CONSTRUCT, {
        me: this,
        construct: construct
      });
      return this;
    };

    /**
    Called after construct was removed from container construct.
    @method removedFromConstruct
    @public
    @param construct {Construct} Container construct from which this construct was removed.
    */

    Construct.prototype.removedFromConstruct = function(construct) {
      this.notify(Construct.Event.REMOVED_FROM_CONSTRUCT, {
        me: this,
        construct: construct
      });
      return this;
    };

    /**
    Triggered after a member construct was added to this construct.
    @event Construct.Event.ADDED
    @param {object} obj {by:this-construct, construct:a-member-construct-added}
    */

    /**
    Add a construct member to this construct.
    @method addConstruct
    @public
    @param construct {Construct} A construct member to add.
    @param [collection=this.members] {Array} What property this member should be added to.
    */

    Construct.prototype.addConstruct = function(construct, collection, index) {
      /* Construct can be a member only of a single container.
      */
      var _this = this;
      if (construct.get('member-of') != null) return;
      if (!(collection != null)) collection = this.members;
      construct.system = this.system || this.guid;
      if (index != null) {
        collection[index] = construct;
      } else {
        collection.push(construct);
      }
      if (!(collection.__first__ != null)) collection.__first__ = construct;
      if (collection.__last__ != null) {
        collection.__last__.__next__ = construct;
        construct.__previous__ = collection.__last__;
      }
      collection.__last__ = construct;
      /* Infrastructure.
      */
      construct.getter('query-getter', 1, function() {
        return _this.query;
      });
      construct.getter('db-propagator', 1, function() {
        return _this._dbPropagator;
      });
      construct.getter('member-of', 1, function() {
        return _this.guid;
      });
      /* Propogate db.
      */
      if (construct.db != null) {
        if (!(this.db != null)) this._initDB();
        construct.db().each(function(rec, i) {
          return _this._dbPropagator(rec, true);
        });
      }
      construct.addedToConstruct(this);
      this.notify(Construct.Event.ADDED, {
        by: this,
        construct: construct
      });
      return construct;
    };

    /**
    Mapped to addConstruct
    @method add
    @public
    */

    Construct.prototype.add = Construct.prototype.addConstruct;

    /**
    Triggered after a member construct was removed from this construct.
    @event Construct.Event.REMOVED
    @param {object} obj {by:this-construct, construct:a-member-construct-removed}
    */

    /**
    Remove a member construct from this construct.
    @method removeConstruct
    @public
    @param construct {Construct} A member construct to remove.
    @param [collection=this.members] {Array} A member property from which a construct is to be removed.
    */

    Construct.prototype.removeConstruct = function(construct, collection, index) {
      var _this = this;
      if (construct.get('member-of') !== this.guid) return;
      if (!(collection != null)) collection = this.members;
      /* Drop construct's db records.
      */
      if (construct.db != null) {
        construct.db().each(function(rec, i) {
          return _this._dbPropagator(rec, false);
        });
      }
      construct.dropGetter('query-getter', 1);
      construct.dropGetter('db-propagator', 1);
      construct.dropGetter('member-of', 1);
      if (construct.__next__ != null) {
        construct.__next__.__previous__ = construct.__previous__;
      }
      if (collection.__last__ === construct) {
        collection.__last__ = construct.__previous__;
      }
      if (construct.__previous__ != null) {
        construct.__previous__.__next__ = construct.__next__;
      }
      if (collection.__first__ === construct) {
        collection.__first__ = construct.__next__;
      }
      if (index != null) {
        delete collection[index];
      } else {
        index = $.inArray(construct, collection);
        if (index === -1) throw 'member not found; remove aborted';
        collection.splice(index, 1);
      }
      construct.removedFromConstruct(this);
      this.notify(Construct.Event.REMOVED, {
        by: this,
        construct: construct
      });
      return construct;
    };

    /**
    Mapped to removeConstruct
    @method remove
    @public
    */

    Construct.prototype.remove = Construct.prototype.removeConstruct;

    /**
    Triggered after construct creates a member-suitable construct.
    @event Construct.Event.CREATED
    @param {Construct} A construct created.
    */

    /**
    OVERRIDE.  Given the model/data, create a sufficient member addable to this construct.  Will throw
    'not defined'.
    <pre>
      When overriding makesure to 'notify' created object. (See example)
    </pre>
    @method create
    @public
    @return {Construct}
    @example <pre>
      AlbumManager.prototype.create = function(model) {
        var album = new Album()
        album.setModel(model)
        this.notify(Construct.Event.CREATED,{
          by:this,
          construct:album
        })
        return album;
      }
    </pre>
    */

    Construct.prototype.create = function() {
      /* Make sure to:
        
        this.notify(Construct.Event.CREATED, {
          by: this
          construct: new-construct
        })
      */      throw 'not defined';
    };

    /**
    Set construct model
    @method setModel
    @param model {Model} Model to bind to this construct.
    */

    Construct.prototype.setModel = function(model) {
      if (model instanceof window.Model === false) {
        throw 'Model must be an instance of window.Model class';
      }
      this.model = model;
      return;
    };

    /**
    Extract/set ready state for this construct.
    @method ready
    @public
    @param [state=undefined] {boolean} 'true' will set state to ready. 'false' will set state to not-ready.
    undefined will return a promise resolved when construct is ready.
    @return {$.Deferred()} ...with undefined parameter.  This will resolve when construct is ready.
    */

    Construct.prototype.ready = function(state) {
      var _ref;
      if (!(state != null)) {
        return $.when(this.deferred['ready']);
      } else if (state === true) {
        this.active = true;
        this.deferred['ready'].resolve();
        delete this.deferred['ready'];
        this.deferred['un-ready'] = $.Deferred();
      } else if (state === false) {
        if ((_ref = this.deferred['un-ready']) != null) _ref.resolve();
        delete this.deferred['un-ready'];
        this.deferred['ready'] = $.Deferred();
        this.active = false;
      }
      return;
    };

    /**
    Triggered after construct has activated.
    @event 'activated'
    */

    /**
    Activate a construct.  If a construct has a UI component, activating will indicate that this
    construct is some how represented on the 'screen'.
    @method activate
    @return {$.Deferred()} Will resolve when this construct and all member constructs are finally active (this.ready()).
    @public
    */

    Construct.prototype.activate = function() {
      var col, i, v,
        _this = this;
      this.deferred['ready'].activating = true;
      if (this.members instanceof Array) {
        col = (function() {
          var _i, _len, _ref, _results;
          _ref = this.members;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            v = _ref[_i];
            _results.push(v.activate());
          }
          return _results;
        }).call(this);
      } else {
        col = (function() {
          var _ref, _results;
          _ref = this.members;
          _results = [];
          for (i in _ref) {
            v = _ref[i];
            _results.push(v.activate());
          }
          return _results;
        }).call(this);
      }
      $.when.apply($, col).done(function() {
        _this.ready(true);
        return _this.notify('activated');
      });
      return this.ready();
    };

    /**
    Triggered after construct has deactivated
    @event 'deactivated'
    */

    /**
    Deactivate a construct.  Cleanup the construct such that it can be removed/deleted w/ out a memory leak.
    @method deactivate
    @public
    */

    Construct.prototype.deactivate = function() {
      var i, v, _i, _len, _ref, _ref2;
      if (this.members instanceof Array) {
        _ref = this.members;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          v.deactivate();
        }
      } else {
        _ref2 = this.members;
        for (i in _ref2) {
          v = _ref2[i];
          v.deactivate();
        }
      }
      this.ready(false);
      this.notify('deactivated');
      return;
    };

    /**
    Extract all members is this.deferred which fit a spacific namespace.
    @method sync
    @public
    @return {Object/Array}
    @param ns {string} A namespace to lookfor and return.
    @param [box={}] {Object/Array} May be array or object.  Sync objects are placed into this property and returned.
    If an array such are simply indexed.  If an object such are referenced by same reference as in this.deferred.
    @example
      this.deferred['foo'] = def1
      this.deferred['foo.a'] = def2
      this.deferred['foo.b'] = def3
      this.deferred['boo.c'] = def4
      
      this.sync('foo')
      
      will return:
      {foo: def1, foo.a: def2, foo.b: def3}
      
      this.sync('foo',[])
      
      will return:
      [def1, def2, def3]
    */

    Construct.prototype.sync = function(ns, box) {
      var defs, i, reg, t, v, _ref;
      if (!(ns != null)) {
        return (function() {
          var _ref, _results;
          _ref = this.deferred;
          _results = [];
          for (i in _ref) {
            v = _ref[i];
            _results.push(v);
          }
          return _results;
        }).call(this);
      }
      defs = box || {};
      t = ns.replace('.', "\\.");
      reg = new RegExp(t);
      _ref = this.deferred;
      for (i in _ref) {
        v = _ref[i];
        if (i.match(reg) != null) {
          if (defs instanceof Array === true) {
            defs.push(v);
          } else {
            defs[i] = v;
          }
        }
      }
      return defs;
    };

    Construct.prototype.destroy = function() {};

    return Construct;

  })(window.Getter);

  window.Construct.Get = {
    DATA: 'get-construct-data'
  };

  window.Construct.Event = {
    ADDED: 'construct-added',
    REMOVED: 'construct-removed',
    ADDED_TO_CONSTRUCT: 'construct-added-to-construct',
    REMOVED_FROM_CONSTRUCT: 'construct-removed-from-construct',
    CREATED: 'construct-created',
    DESTROYED: 'construct-destroyed',
    ALTERED: 'construct-altered',
    UI: {
      SUBMIT: 'submit-construct-clicked',
      CANCEL: 'cancel-construct-clicked',
      DONE: 'process-completed',
      FAIL: 'process-failed',
      SELECT: 'process-selected'
    }
  };

  window.Construct.Delegate = {
    DELETE: 'invoke-delete-process',
    SELECT: 'invoke-select-process'
  };

  /**
  Marks construct as a helper class
  @class Helper
  @extends Construct
  @public
  @constructor
  @param b {Construct} Base construct this helper is 'facilitating'.  Set to 'base' reference.
  */

  window.Helper = (function(_super) {

    __extends(Helper, _super);

    function Helper(b) {
      Helper.__super__.constructor.call(this);
      this.base = b;
    }

    Helper.prototype.base = null;

    return Helper;

  })(Construct);

  /**
  Marks construct as a anager class
  @class Manager
  @extends Construct
  @public
  @constructor
  */

  window.Manager = (function(_super) {

    __extends(Manager, _super);

    function Manager() {
      Manager.__super__.constructor.call(this);
    }

    return Manager;

  })(Construct);

  /**
  Marks construct as a setting class
  @class Setting
  @extends Construct
  @public
  @constructor
  @param d {Construct} Construct object to be consumed by this Setting.  Set to 'data' reference.
  */

  window.Setting = (function(_super) {

    __extends(Setting, _super);

    function Setting(d) {
      Setting.__super__.constructor.call(this);
      this.data = d;
    }

    Setting.prototype.data = null;

    return Setting;

  })(Construct);

  /**
  Base query object used in Construct querying system.
  @class ConstructQuery
  @constructor
  @param fn {function} A function exposed by a leaf construct
  */

  window.ConstructQuery = (function() {

    function ConstructQuery(fn) {
      this.fn = fn;
    }

    /**
    A function exposed by a leaf construct
    @property fn
    @protected
    @type function
    */

    ConstructQuery.prototype.fn = null;

    /**
    TAFFY database to be used in querying.
    @property db
    @public
    @type TAFFY
    */

    ConstructQuery.prototype.db = null;

    /**
    Guid of a construct which set the query.
    @property guid
    @public
    @type string
    */

    ConstructQuery.prototype.guid = null;

    /**
    A model extracted from the construct which set the query.  This can be used to create specific queries.
    @property model
    @public
    @type Model
    */

    ConstructQuery.prototype.model = null;

    /**
    Well formed name specific to this query.  This name will be set as a column in a construct db and
    queried to extract the exposed function.
    @property name
    @public
    @type string
    */

    ConstructQuery.prototype.name = null;

    /**
    MAY OVERRIDE.  How to set the db record specific to this query.
    @method setter
    @protected
    */

    ConstructQuery.prototype.setter = function() {
      var obj;
      (obj = {})[this.name] = this.fn;
      return obj;
    };

    /**
    MAY OVERRIDE. How to extract a record specific to this query.
    @method getter
    @protected
    */

    ConstructQuery.prototype.getter = function() {
      var obj;
      (obj = {})[this.name] = {
        isFunction: true
      };
      return obj;
    };

    /**
    Called by construct to set the query.
    @method set
    @default
    @return {object} TAFFY row object
    @param db {TAFFY} TAFFY database belonging to a construct on which this query should use.
    */

    ConstructQuery.prototype.set = function(db) {
      var rec;
      if (!(this.name != null)) throw "Each query must be given a unique name.";
      if (!(this.guid != null)) throw 'Guid should have been set.';
      if (!(db != null)) throw 'DB was not provided.';
      rec = db({
        guid: this.guid
      }).first() || db.insert({
        guid: this.guid
      }).first();
      return db(rec).update(this.setter()).first();
    };

    /**
    Call to execute the query.  Params passed in will be given to this.getter and the exposed function.
    @method execute
    @param [p1]
    @param [p2]
    @param [...]
    @return {Object} Any object return from the function exposed by a leaf construct.
    */

    ConstructQuery.prototype.execute = function() {
      var ref;
      if ((ref = this.db(this.getter.apply(this, arguments)).first())) {
        return ref[this.name].apply(this, arguments);
      }
    };

    /**
    Call to execute the query.  Params passed in will be given to this.getter and the exposed functions.
    @method execute
    @param [p1]
    @param [p2]
    @param [...]
    @return {Object} A collection of any objects return from functions exposed by leaf constructs.  
    Should a query return more than a single result.
    */

    ConstructQuery.prototype.executeAll = function() {
      var args, out,
        _this = this;
      out = [];
      args = arguments;
      this.db(this.getter.apply(this, args)).each(function(res, i) {
        return out.push(res[_this.name].apply(_this, args));
      });
      return out;
    };

    /**
    Mapped to execute.  Use when an exposed function is expected to return data.
    @method ask
    @public
    */

    ConstructQuery.prototype.ask = function() {
      return this.execute.apply(this, arguments);
    };

    /**
    Mapped to executeAll.  Use when exposed functions are expected to return data.
    @method askAll
    @public
    */

    ConstructQuery.prototype.askAll = function() {
      return this.executeAll.apply(this, arguments);
    };

    return ConstructQuery;

  })();

  /**
  Base model
  @class Model
  @construct
  @param obj {object} object to bind to this model.  This is usually a serialized model return from
  the server.
  */

  window.Model = (function() {

    function Model(obj) {
      this.__setModel__(obj);
    }

    /**
    How many properties are bound to this model.
    @property length
    @public
    */

    Model.prototype.__length__ = null;

    /**
    Bind a supplied object to this model.
    @method setModel
    @protected
    @param data {object} Supplied object representing a model.
    */

    Model.prototype.__setModel__ = function(data) {
      var i, v, _ref;
      this.__length__ = 0;
      for (i in data) {
        v = data[i];
        if (i.match(/^__/) != null) continue;
        /* Extend member if its an object, else just set to same parameter.
        */
        if (v.constructor === Object) {
          $.extend((_ref = this[i]) != null ? _ref : this[i] = {}, v);
        } else {
          this[i] = v;
        }
        this.__length__++;
      }
      return;
    };

    return Model;

  })();

}).call(this);
