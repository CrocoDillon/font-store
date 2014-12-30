module.exports = {
  extractUrls:extractUrls
};

function extractUrls(cssString){
  var urlRegExp = /url\((.*?)\)/g;
  var matches = [];
  while((match = urlRegExp.exec(cssString)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}
