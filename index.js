var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');
var Handlebars = require('handlebars');

Handlebars.registerHelper('each_upto', function(max, ary, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});


var app = express();

//Configure tempate engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Set up static folder
app.use(express.static(__dirname + '/public'));

var user = 'opt9';
var story_slug = 'funny-it-fails';
var api_key = "";

var username = "";
var _token = "";

app.get('/',function(req, res,next){
  //Fetch elements from Storify API
  superagent.get("http://api.storify.com/v1/stories/" + user + "/" + story_slug)
    .query({api_key: api_key,
      username: username,
      _token: _token})
    .set({  Accept: 'application/json' })
    .end(function(e, storifyResponse){
      if (e) next(e);
      //Render template with story object in response body
      return res.render('index',storifyResponse.body.content);
    })

})

app.listen(4568);
console.log('Server running at http://localhost:4568/');
