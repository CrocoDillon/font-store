module.exports = {
  urlFormat: /url\(['"]?(.*?)['"]?\)/g,
  woff: {
    contentType: 'application/font-woff'
  },
  woff2: {
    contentType: 'application/font-woff2'
  },
  // Firefox 35 supports WOFF2 behind a setting and doesn’t support unicode-range,
  // so Google gives back both WOFF and WOFF2 urls without putting subsets behind
  // unicode ranges.
  userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:35.0) Gecko/20100101 Firefox/35.0'
};
