(function(){

  var s=$("<style />").html(
    ".nimm-scroll-scrollbar{" +
      "-moz-transition: opacity .5s ease;" +
	  "-webkit-transition: opacity .5s ease;" +
	  "-ms-transition: opacity .5s ease;" +
	  "transition: opacity .5s ease;" +
      "opacity:.3;" +
    "}" +
    ".nimm-scroll-full{" +
      "opacity:1" +
    "}"
  ).appendTo('head');
  
  window.NimmScroll=(function(){
    
    function Scroll(elm){
      this.elm=elm;
console.log(this.elm)      
      if (window.getComputedStyle(this.elm).position=='static')
        console.trace(),function(){throw 'Source element must not be static position.'}();
    }

    Scroll.prototype.scrollStep=20;
    Scroll.prototype.active=false;
    Scroll.prototype.elm=null;
    Scroll.prototype.viewport=null;
    Scroll.prototype.content=null;
    Scroll.prototype.bufferStyle=null;
    Scroll.prototype.scrollBar=null;
    Scroll.prototype.scrollBall=null;
    Scroll.prototype.scrollHeight=null;
    
    Scroll.prototype.update=function(){
      var _this=this;
      
      updateViewPort();
      updateScrollBar();
      updateScrollBall();
      this.scrollHeight = parseFloat(this.scrollBar.style.height) - parseFloat(this.scrollBall.style.height);
      
      function updateViewPort(){
        var height,width;
        var r;
        height = (r=$(_this.elm)).height();
        width = r.width();
        
        $(_this.viewport).css({
          width: width + "px",
          height: height + "px"
        });
      }
      function updateScrollBar(){
        var height;
        height = $(_this.elm).height();
        
        $(_this.scrollBar).css({
          height: height + "px"
        });
      }
      function updateScrollBall(){
        var viewHeight, contentHeight, rat, scrollHeight, height;
        
        viewHeight = parseFloat(_this.viewport.style.height);
        contentHeight = Math.max( 
          viewHeight
          , parseFloat(window.getComputedStyle(_this.content).height)
        );
        rat = viewHeight / contentHeight;
        
        scrollHeight = parseFloat(_this.scrollBar.style.height);
        height = scrollHeight * rat;
        
        $(_this.scrollBall)
        .css({
          height: height + "px",
        });
        
        if (height.toFixed(2) == scrollHeight.toFixed(2))
          _this.off();
        else
          _this.on();
      }
    }
    
    Scroll.prototype._createViewPort=function(){
      var $view;
      
      $view = $("<div class='nimm-scroll-viewport' />")
      .css({
        overflow:'hidden'
      });

      return $view[0];
    }
    Scroll.prototype._createContent=function(){
      var height,width,$content
      ;
      
      $content = $("<div class='nimm-scroll-content' />")
      .css({
        overflow:'visible',
        position:'absolute'
      });
      
      $(this.elm).children().appendTo($content);

      return $content[0];
    }
    Scroll.prototype._createScrollBar=function(){
      var $bar;
      
      $bar = $("<div class='nimm-scroll-bar' />")
      .css({
        position:'absolute',
        right:'-20px',
        background:'#afafaf',
        width:'3px',
        borderRadius:'3px',
        top:0,
        overflow:'visible'
      })
      .addClass('nimm-scroll-scrollbar');
      
      return $bar[0];
    }
    Scroll.prototype._createScrollBall=function(){
      var viewHeight, $ball, contentHeight, rat, scrollHeight, height;
      
      viewHeight = parseFloat(this.viewport.style.height);
      contentHeight = parseFloat(window.getComputedStyle(this.content).height);
      rat = viewHeight / contentHeight;
      
      scrollHeight = parseFloat(this.scrollBar.style.height);
      height = scrollHeight * rat;
      
      $ball = $("<div class='nimm-scroll-ball' />")
      .css({
        position:'absolute',
        top:0,
        background:'gray',
        width:'5px',
        left:'-1px',
        borderRadius:'4px'
      });
      
      return $ball[0];
    }
    Scroll.prototype._transform=function(){
      this.viewport = this._createViewPort();
      this.content = this._createContent();
      this.scrollBar = this._createScrollBar();
      this.scrollBall = this._createScrollBall();

      this.bufferStyle={
        overflow: window.getComputedStyle(this.elm).overflow
      };
      
      $(this.elm).css('overflow','visible');
      
      $(this.content).appendTo(this.viewport);
      $(this.viewport).appendTo(this.elm);
      $(this.scrollBar).appendTo(this.elm);
      $(this.scrollBall).appendTo(this.scrollBar);
    }
    Scroll.prototype._wire=function(){
      var _this=this;
      $(this.scrollBall).bind('mousedown', function(e){
        _this.__lid__ = $("<div />")
        .appendTo('body')
        .css({
          position:'fixed',
          width:'100%',
          height:'100%'
        });
        _this._startScroll(e.pageY);
        
        return false;
      });
      
      $(this.content).bind('mousewheel', function(e,d){        
        _this._scrollBy(-d*_this.scrollStep);
      });
      
      $(this.scrollBar).hover(
        function(){_this.full();}
        , function(){_this.faint();}
      )
    }
    Scroll.prototype._scrollBy=function(dif, top, rat){
      if (typeof top=='undefined')
        top = parseFloat(this.scrollBall.style.top);
      if (typeof rat=='undefined')
        rat = rat = parseFloat(this.scrollBall.style.height) / parseFloat(this.viewport.style.height);
      
      top = Math.max(0, Math.min( top + dif, this.scrollHeight));
        
      this.content.style.top = -top/rat + 'px';
      this.scrollBall.style.top = top + 'px';
      
      return top;
    }
    Scroll.prototype._startScroll=function(y){
      var cy=y, _this=this
      , top = parseFloat(this.scrollBall.style.top)
      , rat = parseFloat(this.scrollBall.style.height) / parseFloat(this.viewport.style.height);
	  
	  this.__scrolling__=$.Deferred();
      
      $(document).bind('mouseup.nimm-scroll', function(){
        $(document).unbind('mouseup.nimm-scroll');  
        _this._endScroll();
      });
      $(document).bind('mousemove.nimm-scroll', function(e){

        var dif = e.pageY - cy;
        top = _this._scrollBy(dif, top, rat);
        
        if (top==0 || top == _this.scrollHeight)
          return;
                  
        cy = e.pageY;
      });
    }
    Scroll.prototype._endScroll=function(){
	  this.__scrolling__.resolve();
	  delete this.__scrolling__;
	  
      $(document).unbind('mousemove.nimm-scroll');
      this.__lid__.remove();    }
    Scroll.prototype.on=function(){
      $(this.scrollBar).show();
    }
    Scroll.prototype.off=function(){
      $(this.scrollBar).hide();
    }
    Scroll.prototype.full=function(){
	  this.__hovering__=$.Deferred();
	  
      $(this.scrollBar).addClass('nimm-scroll-full');
    }
    Scroll.prototype.faint=function(){
	  var _this=this;
	  this.__hovering__.resolve(); delete this.__hovering__;
	
	  $.when(this.__hovering__, this.__scrolling__).done(function(){
	    $(_this.scrollBar).removeClass('nimm-scroll-full');
	  });
      
	  
    }
    Scroll.prototype.activate=function(){
      this._transform();
     
      this._wire();
      this.active=true;
    }
    Scroll.prototype.deactivate=function(){
      console.trace(),function(){throw 'not implemented'}();
    }
    
    return Scroll;

  })();
  
  
})();
