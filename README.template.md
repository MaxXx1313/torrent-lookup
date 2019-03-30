# tlookup3


[![npm](https://img.shields.io/npm/v/tlookup.svg?style=flat-square)](https://npmjs.com/tlookup)

Command-line tool for looking torrent files and downloaded content. Match them together and add it to your favorite torrent client.

**Supported clients:**
* Transmission (Linux)
  - enable remote access with user/pass: `admin`/`admin`, so it's available at "http://admin:admin@localhost:9091"



## Install

```bash
npm install -g tlookup (not pushed yet)
```

```bash
npm install -g https://github.com/MaxXx1313/torrent-lookup
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


The following command build and the project
```bash
npm run dev
```


See instruction for custom adapter here: [ITorrentClient](src/lib/push/README.md)