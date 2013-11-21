var EjsMidConstructor = require('../public/scripts/util/ejs-mid.js') 
, mid
, imageData = new (require('../public/scripts/util/data-prep.js'))()
, emailjs = require('emailjs')
, ejs = require('ejs')
, FS  = require('fs');
;

imageData.start();

/*
 * GET home page.
 */

module.exports = {
  init:function(app){
    mid = new EjsMidConstructor();
    Object.defineProperty(mid, 'app', {
      get:function(){return app;}
    });
    
    return this; 
  },
  index: function(req, res){
	if (req.mobile)
		mobileIndex(req, res);
  
    var scripts = require('./scripts')('index');

    res.send(mid.render('index.html',{
      scripts: mid.partial('_scripts.html', {
        scripts:scripts,
        date: +new Date()
      }),
      left: mid.partial('left.html', {
        gallery: mid.partial('gallery.html',{
          imageData: JSON.stringify(imageData.data)
        })
      }),
      home: mid.partial('home.html'),
      contact: mid.partial('contact.html')
    }));
  },
  mobile:function(req,res){
	mobileIndex(req,res);
  },
  about:function(req,res){
	res.render('mobile/about.html',function(err,html){
		res.send(err || html);
	});
  },
  
  contact: function(req,res){
    var server = emailjs.server.connect({
		user: 'yandreyev@yahoo.com',
		password:'Lightsaber01',
		host: 'smtp.mail.yahoo.com',
		ssl:true
	});
	
	var i;
	var html=
	"<table>";
		for (i in req.body) {
			html +=
			"<tr>"+
				"<td style='text-align:right; padding:5px 20px; font-size:14px; font-weight:bold'>" + i + ":</td><td>" + req.body[i] + "</td>" + 
			"</tr>";
		}
		html +=
	"</table>";
	
	server.send({
		text:html,
		'Content-Type': 'text/html; charse=ISO-8859-1',
		from: 'yandreyev@yahoo.com',
		to: 'yandreyev@yahoo.com',
		subject: 'first email'
	}, function(err, message){
		console.log(err || message);
	});
	
	console.log(req.body);
	
    res.send('');
  },
  
	login:function(req,res) {
		res.send(mid.render('login.html'));
	},
	tryLogin:function(req,res) {
		var username = req.body.userName;
		var users = FS.readdirSync(__dirname +  '/../users');
		if (users.indexOf(username)>-1)
			res.send({
				success:true,
				data:true
			});
		else
			res.send({
				success:false,
				message:"user not found"
			});
	},
	selectPhotos:function(req,res) {
		var token = req.params['token'];
		
		/*get saved data*/
		if (!FS.existsSync(__dirname +  '/../users/' + token + '/data.json'))
			FS.writeFileSync(__dirname +  '/../users/' + token + '/data.json', '{}');
		var data = JSON.parse(FS.readFileSync(__dirname +  '/../users/' + token + '/data.json', 'utf8'));
		
		data.token=data.token || token; /*insert token if not yet*/
		
		var urls = FS.readdirSync(__dirname +  '/../users/' + token + '/photos')
			.map(function(v) {
				return '/' + token + '/photos/' + v;
			});

		res.end(mid.render('select-photos.html', {
			data:data,
			photos:urls
		}));
	},
	saveSelected:function(req,res) {
		var token = req.params['token'];
		
		
		var ws = FS.createWriteStream(__dirname +  '/../users/' + token + '/data.json', 'utf8');
		req.pipe(ws);
		
		req.on('end', function() {
			res.send('hi');
		});
	},
	submitSelected:function(req,res) {
		var token = req.params['token'];
		
		var data = JSON.parse(FS.readFileSync(__dirname +  '/../users/' + token + '/data.json'));
		
		console.log(data);

		var server = emailjs.server.connect({
			user: 'yandreyev@yahoo.com',
			password:'YA@03288h',
			host: 'smtp.mail.yahoo.com',
			ssl:true
		});
	
		var i;
		var html=
		
		"<table>"+
			"<tr>" +
				"<td style='padding:2px 5px; color:white; background:gray; font-weight:bold'>Name:</td>" + 
				"<td style='padding-left:10px'>" + data.name + "</td>" +
			"</tr>" +
			"<tr>" +
				"<td style='padding:2px 5px; color:white; background:gray; font-weight:bold'>Token:</td>" + 
				"<td style='padding-left:10px'>" + data.token + "</td>" +
			"</tr>" +
			"<tr>" +
				"<td style='padding:2px 5px; color:white; background:gray; font-weight:bold; vertical-align:top'>Selected Photos:</td>" + 
				"<td style='padding-left:10px; border-top:solid #dfdfdf 1px'>";
					
					data.selected.forEach(function(photo) {
						html+=
						"<div style='line-height:25px;'>" + photo + "</div>";
					});
					html +=
				"</td>" +
			"</tr>" +
		"</table>";
	
		server.send({
			text:html,
			'Content-Type': 'text/html; charse=ISO-8859-1',
			from: 'yandreyev@yahoo.com',
			to: 'alozovyy@hotmail.com',
			subject: 'selected photos'
		}, function(err, message){
			console.log(err || message);
		});

		res.send('hi');
	}
}

function mobileIndex(req, res){

	res.render('mobile/index.html', function(err, html){
		res.send(err || html);
	});
}