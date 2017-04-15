

const LopConsole = require('./lib/LopConsole');
let logger = new LopConsole();


logger.startLOP('testing');
var i=0;
var t = setInterval(function(){
  logger.logLOP(1+i++);
}, 1000);
t.unref();

setTimeout(()=>{
  clearInterval(t);
  logger.stopLOP();
  console.log('done in %s ms', logger.elapsedLOP() )
}, 5000);

