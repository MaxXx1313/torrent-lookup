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


**Usage**

  $ tlookup **operation** **target** 

**Description**

  Scan files and match torrent files 

**Operation**

  **find** - scan files, find torrent files and it's downloads 
  **push** - push torrents to client                           
  **info** - print scan info                                   

**Options**

  **--operation** **string**      Operation. one of 'find', 'push', 'info'              
  **-v**, **--verbose **          verbose output                                        
  **-h**, **--help **             print help                                            
  **-t**, **--target string[]**   scan folder                                           
  **--tmp** **string**            folder to save data                                   
  **-c**, **--client string**     client app to push torrents (operation=push)          
  **-o**, **--option string[]**   client app options (for ex.: "-o                      
                          endpoint=localhost:8080"). Look into documentation    
                          for the client app for details                        

**Clients**

  Most clients require remote access to be enabled! 

  transmission   t   Transmission app  

**Examples**

  Scan home folders             $ tlookup find "/home"      
  Push result to transmission   $ tlookup push transmission 




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