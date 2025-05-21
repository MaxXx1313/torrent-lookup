# tlookup3


[![npm](https://img.shields.io/npm/v/tlookup.svg?style=flat-square)](https://npmjs.com/tlookup)

Command-line tool for looking torrent files and downloaded content. Match them together and add it to your favorite torrent client.


**Supported platforms:**
- windows
- linux
- macos

**Supported clients:**
* Transmission (all platforms)
  - enable remote access with user/pass: `admin`/`admin`, so it's available at "http://admin:admin@localhost:9091"



## Install

```bash
npm install -g tlookup (not pushed yet)
```

# Usage example

```bash
npm install -g https://github.com/MaxXx1313/torrent-lookup
npm run build
npm start -- find
npm start -- push t
```





## Usage

{{CLI_HELP}}


Development
-----------

## Build

The following command build the project
```bash
npm run build
```

The following command run the project
```bash
npm start -- find
```


The following command build and run the project
```bash
npm run dev
```


See instruction for a custom adapter here: [ITorrentClient](src/lib/push/README.md)
