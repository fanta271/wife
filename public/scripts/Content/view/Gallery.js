(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Content.Views.Gallery = (function() {
    __extends(Gallery, Content.View);
    function Gallery() {
      var _this=this;
      
      this.ui = new Content.UIs.Gallery();
      this.ui.getter('categories', 1, function(){
        var c=['All'], i;

        for (i in _this.photoSystem.byCat)
          c.push(i.charAt(0).toUpperCase() + i.substr(1));
        return c;
      });
      this.ui.bind('select-category', 1, function(e,d){
        var r;
        _this.photoSystem.setCat((r=d.category)=='All' ? undefined : r.toLowerCase());
        _this.photoSystem.showCat();
      
		_this.photoSystem.ui.translocate();
        _this.ui.updateScroll();
      })
	  this.ui.bind('selected-section', 1, function(e,d){
		_this.invoke('select-by-name', d);
	  });
      
      Gallery.__super__.constructor.call(this);
      
      this.photoSystem = new Content.Views.System(this);
    }
    Gallery.prototype.name = 'gallery';
    Gallery.prototype.photoSystem = null;
    
    Gallery.prototype.updateScroll=function(){
      this.ui.updateScroll();
    }
    Gallery.prototype.on=function(){
      if (! this.photoSystem.active)
        this.photoSystem.activate();
      
      Gallery.__super__.on.call(this);
    }

    return Gallery;
  })();

  Content.Views.System=(function(){
    __extends(System, Helper);
    function System(b){
      System.__super__.constructor.call(this, b);
	  
	  var _this=this;
	  
	  this.ui = new Content.UIs.System();
	  this.ui.bind('previous', 1, function(e){
		var c=_this.__currentPhoto__;
		while (true){
			(c=c.__previous__)==null ? (c=_this.photos.__last__) : void 0;
			if (c.isOn)
				break;
			if (c==_this.__currentPhoto__)
				break;
		}
		_this.__currentPhoto__=c;
		_this.ui.setFrameURL(c.model['600']);
	  });
	  this.ui.bind('next', 1, function(e){
		var c=_this.__currentPhoto__;
		while (true){
			(c=c.__next__)==null ? (c=_this.photos.__first__) : void 0;
			if (c.isOn)
				break;
			if (c==_this.__currentPhoto__)
				break;
		}
		_this.__currentPhoto__=c;
		_this.ui.setFrameURL(c.model['600']);
	  });
	  
      this.photos=[];
      this.byCat={};
      this.currentCat=[];
    }
    System.CONTAINER_SELECTOR='.PhotoContainer';
    
	System.prototype.ui=null;
    System.prototype.model=null;
    System.prototype.photos=null;
    System.prototype.byCat=null;
    System.prototype.currentCat=null;
    
    System.prototype.setData=function(){
      var model = JSON.parse($('#GalleryData').val());
      var _this=this;
      var photo, position=-1;
      Util.each(model, function(category,categoryData){
        _this.byCat[category]=[];
        Util.each(categoryData, function(i,photoModel){
          photo = _this.add(_this.create(photoModel, category));
          position++;
          photo.__position__=position;
          _this.byCat[category].push(photo);
        });
      });

      var max;
      max = Math.max.apply(
        null
        , Util.map(this.byCat, function(i,photos){
          return photos.length;
        })
      );
      var x;
      for (x=0; x<max; x++)
        Util.each(this.byCat, function(i,photos){
          if (photos[x])
            photos[x].activate();
        });
    }
    System.prototype.create=function(photoModel, category, position){
      var _this=this;
      var photo = new Content.Views.Photo(category, position);
      photo.model=photoModel;
      photo.getter('container', 1, function(){return  _this.__container__ || (_this.__container__=$(System.CONTAINER_SELECTOR)[0]); })
      photo.bind('loaded', 1, function(){
        _this.base.updateScroll();
      });
	  photo.bind('selected', 1, function(){
		_this.__currentPhoto__=photo;
		_this.ui.showWindow(photo.model['600']);
	  });
      
      return photo;
    }
    System.prototype.add=function(photo){
      return System.__super__.add.call(this, photo, this.photos);
    }
    System.prototype.setCat=function(category){
      if (typeof category!='undefined')
        category=[category];
      else {
        category=[];
        Util.each(this.byCat, function(cat, d){
          category.push(cat);
        });
      }
      
      this.currentCat=category;
    }
    System.prototype.showCat=function(){
      var _this=this;
      Util.each(this.byCat, function(cat, photos){
        Util.each(photos, function(i, photo){
          if (_this.currentCat.indexOf(cat)!=-1)
            on(photo);
          else
            off(photo);
        })
      });
	  
      function on(photo){
        if (! photo.isOn)
          photo.on();
      }
      function off(photo){        
        if (photo.isOn) {
          photo.off();
        }
      }
    }
    
    System.prototype.activate=function(){
      this.setData();
      
      if (this.currentCat.length==0)
        this.setCat();
      
      this.showCat();
	  
	  this.ui.activate();
	  this.ui.translocate();	  
      
      System.__super__.activate.call(this);
    }
    return System;
  })();

  Content.Views.Photo=(function(){
    __extends(Photo, Construct);
    function Photo(c, p){
      Photo.__super__.constructor.call(this);
      var _this=this;
      
      this.category=c;
      this.position=p;
      
      this.ui = new Content.UIs.Photo();
      this.ui.getter('url', 1, function(){return _this.model['240']});
      this.ui.getter('container', 1, function(){return _this.get('container'); });
      this.ui.getter('positon', 1, function(){return _this.position; });
      this.ui.bind('loaded', 1, function(){
        _this.notify('loaded');
      });
	  this.ui.bind('selected', 1, function(){
		_this.notify('selected');
	  });
    }
    Photo.prototype.category=null;
    Photo.prototype.position=null;
    Photo.prototype.ui=null;
    Photo.prototype.isOn=false;
    
    Photo.prototype.on=function(){
      this.ui.show();
      this.isOn=true;
    }
    Photo.prototype.off=function(){
      this.ui.hide();
      this.isOn=false;
    }
    
    Photo.prototype.activate=function(){
      this.ui.activate();
      Photo.__super__.activate.call(this);
    }
    Photo.prototype.deactivate=function(){
      this.ui.deactivate();
      Photo.__super__.deactivate.call(this);
    }
    
    return Photo;
  })()

})();

