/**
 * shift_jis.js
 */

var fs = require("fs-extra");
var path = require("path");
var exec = require("child_process").exec;

/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 */
var isUnixHiddenPath = function (path) {
    return (/(^|\/)\.[^\/\.]/g).test(path);
};

var items = [];

fs.walk('./dist-shift_jis')
  .on('data', function(item){
    if(isUnixHiddenPath(item.path)) {
      return
    }
    if(fs.statSync(item.path).isDirectory()){
      return
    }

    fs.readFile(item.path, function(err, data){
      if (err) throw err;
      var tmp = data.toString('utf-8');
      if(path.extname(item.path) === '.html'){
        tmp = tmp.replace('meta\ charset="UTF-8"','meta\ charset="Shift_JIS"');
      }
      else if(path.extname(item.path) === '.css'){
        tmp = tmp.replace('@charset\ "UTF-8"','@charset\ "Shift_JIS"');
      }

      fs.writeFile(item.path, new Buffer(tmp), function (err) {
        if (err) throw err;
        var cmd = 'iconv -f UTF-8 -t SHIFT_JIS ' + item.path + ' > ' + item.path + '.tmp && mv ' + item.path + '.tmp ' + item.path;
        var child = exec(cmd,
          function (error, stdout, stderr){
          if (error !== null) {
            console.log('exec error: ' + error);
          }else{
            console.log(stdout);
          }
        });
      });
    });
  });
  /*
  .on('end', function(){
    console.dir(items);
  })
  */
