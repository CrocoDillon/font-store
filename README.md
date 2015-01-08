# font-store

[![Build Status](https://travis-ci.org/CrocoDillon/font-store.svg?branch=master)](https://travis-ci.org/CrocoDillon/font-store)

Base64 encodes web fonts to cache in LocalStorage for high performance.

## Quick Start

Install this module globally and convert a web font from Google:

```bash
$ npm install -g font-store
$ font-store "http://fonts.googleapis.com/css?family=Dosis"
```

If all goes right, a JSON file will be created for you named something like `fonts.<MD5>.woff.json` or `fonts.<MD5>.woff2.json`.

## Advanced Usage

To see a list of available options type:

```bash
$ font-store --help
```

Currently the only option is to specify what format you want, either woff or woff2.
