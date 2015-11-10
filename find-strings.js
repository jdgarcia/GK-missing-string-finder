var fs = require('fs');
var path = require('path');

var GKPath = '../GitKraken';
var langFile = require(path.join(GKPath, 'src/strings/en-us'));

var strings = langFile.strings;
var totalStrings = Object.keys(strings).length;
var extsToCheck = ['.js', '.jsx'];

function allStringsFound() {
  return Object.keys(strings).length === 0;
}

function checkFile(filepath) {
  var contents = fs.readFileSync(filepath, 'utf-8');

  Object.keys(strings).forEach(function(key) {
    var target = 'translate(\'' + key + '\'';
    if (~contents.indexOf(target)) {
      delete strings[key];
    }
  });
}

function checkDirectory(dirpath) {
  if (allStringsFound()) {
    return;
  }

  var items = fs.readdirSync(dirpath);
  items.forEach(function(item) {
    var itemPath = path.join(dirpath, item);
    var stat = fs.lstatSync(itemPath);

    if (stat.isDirectory()) {
      checkDirectory(itemPath);
    } else if (stat.isFile() && ~extsToCheck.indexOf(path.extname(itemPath))) {
      checkFile(itemPath);
    }
  });
}

var jsDir = path.join(GKPath, 'src', 'js');
checkDirectory(jsDir);

var unusedStrings = Object.keys(strings);
var unusedStringCount = unusedStrings.length;
if (unusedStringCount) {
  console.log('%d unused strings found (out of %d):', unusedStringCount, totalStrings);
  unusedStrings.forEach(function(string) {
    console.log('\t', string);
  });
} else {
  console.log('All strings are being used.');
}
