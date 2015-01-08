module.exports = {
  extractRegExp: extractRegExp,
  replaceWithUrlEncodedContent: replaceWithUrlEncodedContent
};

function extractRegExp(cssString, format) {
  var matches = [];
  while ((match = format.exec(cssString)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function replaceWithUrlEncodedContent(css, url, encodedContent, contentType) {
  return css.replace(url, 'data:' + contentType + ';base64,' + encodedContent);
}
