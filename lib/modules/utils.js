module.exports = {
  minifyCss: minifyCss,
  extractRegExp: extractRegExp,
  replaceWithUrlEncodedContent: replaceWithUrlEncodedContent
};

function minifyCss(cssString, format) {
  var regex = /@font-face\s*\{([^]+?)\}/gi,
      minifiedCss = '',
      fontFace;
  // Find all @font-face blocks
  while ((fontFace = regex.exec(cssString)) !== null) {
    minifiedCss += '@font-face{' +
      fontFace[1]
        // Split to get an array of declarations for this font-face.
        .split(';')
        .map(function(declaration) {
          // Each declaration should be a `property: value` pair.
          declaration  = declaration.split(/:(?!\/\/)/);
          if (declaration.length !== 2) {
            return '';
          }
          var property = declaration[0].trim(),
              value    = declaration[1].trim();
          if (property === 'src') {
            // The `src` property is special, we only need the url where the format
            // matches the requested format and not any other formats or local fonts.
            value = value
              .split(',')
              .filter(function(urlProperty) {
                var match = /format\(['"]?(.*?)['"]?\)/g.exec(urlProperty);
                return match && match[1] === format;
              })[0].trim();
          }
          return [property, value].join(':');
        })
        .filter(function(declaration) {
          // Filters out any empty or default declarations.
          return declaration && declaration !== 'font-style:normal';
        })
        // Join all declarations back together.
        .join(';') +
    '}';
  }
  return minifiedCss;
}

function extractRegExp(cssString, format) {
  var matches = [],
      match;
  while ((match = format.exec(cssString)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function replaceWithUrlEncodedContent(css, url, encodedContent, contentType) {
  return css.replace(url, 'data:' + contentType + ';base64,' + encodedContent);
}
