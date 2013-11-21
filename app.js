
/**
 * Module dependencies.
 */
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , routes = require('./routes').init(app)
  , port = 8080 
  , fs = require('fs')
  ;

app.rootDir = __dirname;

app.configure('all', function(){
  app.engine('html',  require('ejs').renderFile);

  app.use(mobileDetect);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  app.set('views', __dirname + "/views");
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/users'));
  app.use(express.static(__dirname + '/node_modules'))
    
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

function mobileDetect(req, res, next){

  if ( /Mobile/.test(req.headers['user-agent']) )
	req.mobile=true;
  
  next();
}

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/select-photos/:token', routes.selectPhotos);
app.get('/mobile', routes.mobile);
app.get('/about', routes.about);

app.post('/data/email', routes.contact);
app.post('/try-login', routes.tryLogin);
app.post('/save-selected/:token', routes.saveSelected);
app.post('/save-selected/:token', routes.saveSelected);
app.post('/submit-selected/:token', routes.submitSelected);



app.get('/*', function(req, res, next){

  var r, ext, path=req.params[0];
  switch (ext = (r=(/\.([a-z0-9]*)$/i).exec(path)) ? r[0].toLowerCase() : void 0){
    case '.jpg':
      res.set('Content-Type', 'image/jpg');
      console.log(path)
      res.send(fs.readFileSync('./' + path));
      break;
  }

  // next();
});

server.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
