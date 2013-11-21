var fs = require('fs')
;

module.exports=function(location){
  var p, stuff
  ,out=[]
  ;

  p = './routes/scripts/data/' + location + ".json";
  if (fs.existsSync(p))
    out = JSON.parse(fs.readFileSync(p, 'ascii'));
    
  return out;
}
