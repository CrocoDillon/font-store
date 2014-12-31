module.exports = {
  extractRegExp:extractRegExp
};

function extractRegExp(cssString,format){
  var matches = [];
  while((match = format.exec(cssString)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}
