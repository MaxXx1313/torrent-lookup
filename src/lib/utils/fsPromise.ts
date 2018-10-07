
import fs = require('fs');
declare const Promise: any;

/**
 *
 */
interface FileWriteOptions {
  encoding?: string | null;
  mode?: number | string;
  flag?: string;
}

/**
 *
 */
export function writeFile(location: string, data: any, opts: FileWriteOptions = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(location, data, opts, function(err) {
      if(err){
        reject(err)
      } else {
        resolve();
      }
    });
  });
}



/**
 * @more: https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_class_fs_stats
 */
export function readdir(location: string): Promise<string[]> {

 return new Promise(function(resolve, reject){
      fs.readdir(location, function(err, files){
        if(err){
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
}




/**
 * createfolder if it not exists
 */
export function pesistFolderSync(folder: string): void {
  let stat;
  try{
    stat = fs.statSync(folder);
  }catch(e){
    fs.mkdirSync(folder);
    return;
  }
  if(!stat.isDirectory()){
    throw new Error('Not a folder: ' + folder);
  }
  return;
}