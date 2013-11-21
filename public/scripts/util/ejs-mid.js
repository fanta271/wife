var fs = require('fs')
, ejs = require('ejs')
, Service
;

Service = (function() {

  function Service() {
    
  }
  Service.prototype.app=null
  Service.prototype.layout='layout.html';
  Service.prototype._html=function(file,options){
    var _this=this
    , options = options || {}
    , html
    ;
    
    options.partial=function(){_this.partial.apply(_this,arguments)}
    html = ejs.render(
      fs.readFileSync(this.app.rootDir + "/views/" + file, 'utf-8')
      , options
    )
    return html;
  }
  Service.prototype.render=function(file,options){
    var options = options || {} 
    , layout = options.layout || this.layout
    , html
    ;
    
    html = this._html(file,options);
    
    if (typeof layout == 'string') {
      options.body=html;
      html = ejs.render(
        fs.readFileSync(this.app.rootDir + "/views/" + layout, 'utf-8')
        , options
      )
    }

    return html;    
  }
  Service.prototype.partial=function(file,options){
    var html = this._html(file,options);
    return html;
  }

  return Service;

})();

module.exports = Service;
