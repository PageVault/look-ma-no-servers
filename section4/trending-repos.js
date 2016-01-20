var request = require('request')
  , swig    = require('swig')
  , fs      = require('fs')
  ;

var search = process.argv[2] || 'AWS';

var options = {
  url: 'https://api.github.com/search/repositories?q=' + search + ' language:javascript&sort=stars&order=desc',
  headers: {
    'User-Agent': 'request'
  }
};

request.get(options, function(err, data) {
  if (err) throw err;
  var results = JSON.parse(data.body);
  // console.log(results);
  var template = swig.compileFile('./templates/repos.swig');
  var html = template(results);
  fs.writeFileSync('./repos.html', html, {encoding:'utf-8'});
});
