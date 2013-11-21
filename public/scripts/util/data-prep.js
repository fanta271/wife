var fs = require('fs')
, Service
;

Service=(function(){
  
  function Service(){
    
  }
  Service.prototype.data=null;
  Service.prototype.sizes=['240','600'];
  
  Service.prototype._parse=function(){
    var _this=this;
    
    var dir='./public/data/';
    (function step(dir, target){
      
      var files, counter=-1;
      files = fs.readdirSync(dir);
      files.forEach(function(file){
        
        if (! fs.statSync(dir + file).isDirectory())
          return;
          
        target[file]=[] /* File is category. */
        
        
        var mainSizeDir, photo;
        var pictures = fs.readdirSync((mainSizeDir = dir + file + "/" + _this.sizes[0])); /* Use first size as main target. */
        pictures.forEach(function(pic){
          if (! /\jpg$/i.test(pic))
            return;
            
          photo = {};

          photo[_this.sizes[0]] = (mainSizeDir + "/" + pic).substr(1); /* Strip first '.' */
          var x, size, picDir;
          for (x=1; x < _this.sizes.length; x++){
            size = _this.sizes[x];
            
            if (fs.existsSync((picDir=dir + file + "/" + size + "/" + pic)))
              photo[size] = picDir.substr(1);
          }
          
          target[file].push(photo);
        });
        
      });
      
    })(dir, this.data);
   
  }
  Service.prototype.start=function(){
    this.data={};
    
    this._parse();
  }
  
  return Service;
})();

module.exports=Service;
