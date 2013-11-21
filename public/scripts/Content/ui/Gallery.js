(function() {
  var ContentUI, MenuUI,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Content.UIs.Gallery = (function() {

    __extends(Gallery, Construct);

    function Gallery() {
      Gallery.__super__.constructor.call(this);
      this.content = new ContentUI();
      this.menu = new MenuUI();
      this.content.getters = this.getters;
      this.content.events = this.events;
      this.content.delegates = this.delegates;
      this.menu.getters = this.getters;
      this.menu.events = this.events;
      this.menu.delegates = this.delegates;
    }

    Gallery.prototype.on = function() {
      return this.content.activate();
    };

    Gallery.prototype.off = function() {
      return this.content.deactivate();
    };
    Gallery.prototype.updateScroll = function() {
      this.content.updateScroll();
    }

    Gallery.prototype.activate = function() {
      this.menu.activate();
      return Gallery.__super__.activate.call(this);
    };

    Gallery.prototype.deactivate = function() {
      return this.menu.deactivate();
    };

    return Gallery;

  })();

  MenuUI = (function() {

    __extends(MenuUI, Construct);

    function MenuUI() {
      return MenuUI.__super__.constructor.apply(this, arguments);
    }

    MenuUI.prototype.construcor = function() {
      return MenuUI.__super__.construcor.call(this);
    };

    MenuUI.MENU = '.Menu .Gallery';

    MenuUI.prototype._wire = function() {
      var _this = this;
      $(MenuUI.MENU).bind('click', function() {
        return _this.notify(Construct.Event.UI.SELECT);
      });
    };

    MenuUI.prototype._unwire = function() {
      $(MenuUI.MENU).unbind();
    };

    MenuUI.prototype.activate = function() {
      this._wire();
      return MenuUI.__super__.activate.call(this);
    };

    MenuUI.prototype.deactivate = function() {
      this._unwire();
      return MenuUI.__super__.deactivate.call(this);
    };

    return MenuUI;

  })();

  ContentUI = (function() {

    __extends(ContentUI, Construct);

    function ContentUI() {
      ContentUI.__super__.constructor.apply(this, arguments);
      
	  if (window.NimmScroll)
		this.scroll = new NimmScroll($('.Content.Gallery')[0]);
    }

    ContentUI.CONTENT = '.Content.Gallery';
    ContentUI.BUTTON_HTML = '.GalleryButtonHTML';
    ContentUI.BUTTONS = '.GallerySelections';
    ContentUI.TO_TOP = '.to-top';

    ContentUI.prototype.scroll = null;
    ContentUI.prototype.content = null;
    ContentUI.prototype.toTopOn = false;
    ContentUI.prototype.buttons = null;
    ContentUI.prototype.BUTTON_HTML = null;

    ContentUI.prototype._craftButtons = function() {
      var _this=this;
      var buttons=[];
      var categories = this.get('categories');
      var $li;
      categories.forEach(function(cat){
        $li = $(_this.BUTTON_HTML).appendTo(ContentUI.BUTTONS);
        $li.html(cat);
        $li.attr('data-category', cat)
        if (buttons.length==0)
          $li.addClass('first');
        buttons.push($li[0]);
      })
      
      $(buttons[buttons.length-1]).addClass('last');

      return buttons;
    }
    ContentUI.prototype._show = function() {
      var $content, _this=this
      ;
      
      if (! this.buttons)
        this.buttons = this._craftButtons();
      
      this.content = ($content = $(ContentUI.CONTENT))[0];
      this.content.scrollTop=0;
      this.toTopOn=false;
      
      $content.addClass('gallery-on');
      
      $content.show();
    };

    ContentUI.prototype._hide = function() {
      var _this=this;
      
      var $content;
      ($content=$(this.content)).removeClass('gallery-on');
      
      $(ContentUI.TO_TOP).removeClass('to-top-on');
      this.toTopOn=false;
      
	  $content.hide();
    };

    ContentUI.prototype._wire = function(){
      var _this=this;
      
      $(ContentUI.BUTTONS).on('click', '.selection', function(e){
        _this.notify('select-category', {
          category:$(e.currentTarget).data('category')
        });
      });
	  
	  $('.Content.Gallery .Navs').on('click', '.nav-location', function(e){
		var $v=$(e.currentTarget);
		if ($v.hasClass('selected'))
			return;
			
		_this.notify('selected-section', $v.data('nav') );
		
	  });
    };

    ContentUI.prototype._unwire = function() {
      $(this.content).unbind('scroll');
      $(ContentUI.TO_TOP).unbind('click');
      $('.GalleryButtons').off('click');
    };
    
    ContentUI.prototype.updateScroll = function() {
      this.scroll.update();
    }

    ContentUI.prototype.activate = function() {
      if (! this.BUTTON_HTML)
        ContentUI.prototype.BUTTON_HTML = $(ContentUI.BUTTON_HTML).html();
      
      if (! this.scroll.active)
        this.scroll.activate();
      
      this._show();
      this._wire();
      
      this.scroll.on();
      this.scroll.update();
      return ContentUI.__super__.activate.call(this);
    };

    ContentUI.prototype.deactivate = function() {
      this._hide();
      this._unwire();
      
      this.scroll.update();
      this.scroll.off();
      return ContentUI.__super__.deactivate.call(this);
    };

    return ContentUI;

  })(Construct);

  Content.UIs.System=(function(){
	__extends(System,Construct);
	function System(){
		System.__super__.constructor.call(this);
	
		var _this=this;
		this.lid = new Content.UIs.Lid(function(){_this.hideWindow()});
		
		this.frame = new Content.UIs.Frame();
		this.frame.bind('previous', 1, function(){_this.notify('previous')});
		this.frame.bind('next', 1, function(){_this.notify('next')});
	}
	System.prototype.lid=null;
	System.prototype.frame=null;

	System.prototype.translocate=function(){
	  var avail=[], l=[], $last;
	  $('.PhotoContainer .Member')
	  .each(function(i,v){

		var $v=$(v), p, pos;
		if (! $v.hasClass('on')) {
			trans($v, 0, 0);
			avail.push($v.data('nimm-orig'));
			l.push($v);
		} else if (avail.length>0) {
			trans($v, 0, 0);
			p = avail.shift();
			$last=l.shift();
			pos = $v.data('nimm-orig')
			trans($v, p.left - pos.left, p.top-pos.top);
			avail.push(pos);
			l.push($v);
		} else {
			trans($v,0,0);
			$last=$v;
		}
	  });
	  
	  var o;
	  $('.PhotoContainer .clear').insertAfter($last);
	  
	  var p;
	  $('.nimm-scroll-content').height(
		(p=$('.photo-system')).position().top + p.height() + 30
	  );
	  
	  function trans($v,x,y){
	    if (x==0 && y==0 && !$v.data('nimm-orig'))
			$v.find('img').load(function(){
				$v.data('nimm-orig', $v.position());
			});
		$v.css({
			'-webkit-transform': 'translate(' + x + 'px, ' + y +'px)',
			'-moz-transform': 'translate(' + x + 'px, ' + y +'px)',
			'-ms-transform': 'translate(' + x + 'px, ' + y +'px)',
			'transform': 'translate(' + x + 'px, ' + y +'px)'
		});
		
	  }
	}
	System.prototype.showWindow=function(url){
		if (! this.lid.active)
			this.lid.activate();
			
		this.frame.activate();
		
		this.setFrameURL(url);
	}
	System.prototype.setFrameURL=function(url){
		this.frame.set(url);
	}
	System.prototype.hideWindow=function(){
		if (this.lid.active)
			this.lid.deactivate();
			
		this.frame.deactivate();
	}
	System.prototype._wire=function(){
	
	}
	System.prototype.activate=function(){
		this._wire();
	}
	return System;
  })();
  
  Content.UIs.Photo=(function() {
    __extends(Photo, Construct);
    function Photo(){
      Photo.__super__.constructor.call(this);
    }
    Photo.HTML_SELECTOR='.PhotoMemberHTML';
    
    Photo.prototype.html=null;
    Photo.prototype.tile=null;
    
    Photo.prototype._craft=function(){
      $tile = $(this.html);
      $tile.find('.Img').attr('src', this.get('url'))
      .bind('load', this, this._loaded);
      
      return $tile[0];
    }
    Photo.prototype._loaded=function(e){
      var _this=e.data;
      
	  var i,t;
	  (i=(t=$(_this.tile)).find('.Img')).parent()
	  .css({
		height: i.height() + "px",
		width: i.width() + "px",
		overflow:'hidden'
	  });
	  
	  t.addClass('loaded');
	  
	  
      _this.notify('loaded');
    }
    Photo.prototype._place=function(){
      if (! this.tile)
        this.tile = this._craft();
        
      $(this.tile)
      .insertBefore(
        this.__insb__ || (Photo.prototype.__insb__=$(this.get('container')).find('.clear')[0])
      );
    }
	Photo.prototype._wire=function(){
	  var _this=this;
	  $(this.tile).bind('click', function(){
		_this.notify('selected');
	  });
	}
    Photo.prototype.show=function(){
      $(this.tile).addClass('on');
    }
    Photo.prototype.hide=function(){
      $(this.tile).removeClass('on');
    }
    
    Photo.prototype.activate=function(){
      if (! this.html)
        Photo.prototype.html = $(Photo.HTML_SELECTOR).html();

      this._place();
	  this._wire();
      
      Photo.__super__.activate.call(this);
    }
    
    return Photo;
  })();  

  Content.UIs.Lid=(function(){
	function Lid(hand){
		this.onclick=hand;
	}
	Lid.prototype.active=false;
	Lid.prototype.elm=null;
	Lid.prototype.onclick=null;
	
	Lid.prototype._show=function(){
		var i;
		(i=$(this.elm))
		.appendTo('body')
		.show();
		
		setTimeout(function(){
			i.addClass('on');
		},10);
		
	}
	Lid.prototype._hide=function(){
		var _this = this, i;
		
		(i=$(this.elm)).removeClass('on');
		
		setTimeout(function(){
			i.hide().remove();
		},600);
	}
	Lid.prototype._wire=function(){
		var _this=this;
		$(this.elm).bind('click', _this.onclick);
	}
	Lid.prototype._unwire=function(){
		$(this.elm).unbind();
	}
	Lid.prototype.activate=function(){
		if (! this.elm)
			this.elm = $('.gallery-lid')[0];
			
		this._show();
		this._wire();
		this.active=true;
	}
	Lid.prototype.deactivate=function(){
		this._hide()
		this._unwire();
		this.active=false;
	}
	return Lid;
  })();
  
  Content.UIs.Frame=(function(){
	__extends(Frame,Construct);
	function Frame(){
		Frame.__super__.constructor.call(this);
	}
	Frame.prototype.elm=null;
	Frame.prototype.active=false;
	Frame.prototype.current=null;
	Frame.prototype.i1=null;
	Frame.prototype.i2=null;
	Frame.prototype.currentURL=null;
	
	Frame.prototype._show=function(){
		var i, w;
		(i=$(this.elm)).appendTo('body')
		.show()
		.width(800)
		.height(500)
		.css({
			left: ((w=$(window)).width() - 800)/2 + 'px',
			top: (w.height() - 500)/2 + 'px'
		})
	}
	Frame.prototype._hide=function(){
		$(this.elm).removeClass('img1').removeClass('img2')
		.hide()
		.detach();
	}
	Frame.prototype.set=function(url){
		this.currentURL=url;
		if (! this.currentURL)
			console.trace(),function(){throw 'no url given'}();
		
	
		var i, _this=this;
		if (! this.current || this.current==this.i2)
			this.current=this.i1;
		else
			this.current=this.i2;

		var c;
		var $i = $(this.elm);
		var $w = $(window);
		(c=$(this.current)).attr('src', this.currentURL);

		Util.atLoad(this.current).done(function(d){
			var fw=d.width+10, fh=d.height+10;
			
			if ($i.width()!=fw && $i.height()!=fh)
				TweenLite.to(
					$i[0]
					, .5
					, {
						css:(z={
							width:fw,
							height:fh,
							left: ($w.width()-fw)/2,
							top: ($w.height()-fh)/2
						}),
						ease:Power2.ease,
						onComplete:comp
					}
				);
			else 
				comp();
			function comp(){
				$i
				.addClass(_this.current==_this.i1 ? 'img1' : 'img2')
				.removeClass(_this.current==_this.i1 ? 'img2' : 'img1');
			}
			
			// $i
			// .animate(
				// {
					// width:fw,
					// height:fh,
					// left: ($w.width()-fw)/2,
					// top: ($w.height()-fh)/2
				// },
				// 500
			// )
			// .addClass(_this.current==_this.i1 ? 'img1' : 'img2')
			// .removeClass(_this.current==_this.i1 ? 'img2' : 'img1');
		});
	}
	Frame.prototype._wire=function(){
		var _this=this;
		$(this.elm).on('click', '.prev, .next', function(e){
			var $elm=$(e.currentTarget);
			if ($elm.hasClass('prev'))
				_this.notify('previous');
			else if ($elm.hasClass('next'))
				_this.notify('next');
		});
	}
	Frame.prototype.activate=function(){
		if (! this.elm) {
			var i;
			(i=this.elm = $('.GalleryFrame'))[0];
			this.i1 = i.find('.img1')[0];
			this.i2 = i.find('.img2')[0];
			
			this._wire();
		}
	
		this._show();

		this.active=true;
	}
	Frame.prototype.deactivate=function(){
		this._hide();
	
		this.active=false;
	}
	return Frame;
  })();
  
}).call(this);
