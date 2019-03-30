const fs = require('fs');
const execFile = require('child_process').execFile;

execFile('npm', ['start', '--silent', '--', '--help'], function(err, stdout, stderr){
  if(err){
    throw err;
  }
  // console.log(stdout);

  // replace
  let content = fs.readFileSync('README.template.md', {encoding:'utf8'});
  content = content.replace('{{CLI_HELP}}', cli2markdown(stdout));
  fs.writeFileSync('README.md', content)
});


function cli2markdown(text){
  // return text;

  // didn't found the way to make it in regexp =)
  let isOpened = false;

  let _fuse=100;
  while(_fuse-->0){
    let idx = text.indexOf(String.fromCharCode(033));
    if(idx<0){
      break;
    }
    let idxEnd = text.indexOf('m', idx);

    //
    const character = text.substring(idx+2, idxEnd);
    let replaceCharacter = '';
    switch(character){
      case '0': // close character
        if(isOpened){
          isOpened = false;
          replaceCharacter = '**';
        }
        break;

      case '4;1': // open character
      case '1':
      default:
        if(!isOpened){
          isOpened = true;
          replaceCharacter = '**';
        }
    }


    text = text.substr(0, idx) + replaceCharacter + text.substr(idxEnd+1);
  }
  if(_fuse<0){
    console.warn('cli2markdown: fuse reached');
  }

  return text;
}