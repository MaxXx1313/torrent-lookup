

/**
 * Run a function not more often than {@link timeout}
 * TODO: review
 */
function debounce(fn, timeout){
  var caller = this;

  var pass = true;

  _debounce_fn._debounce_timer = setInterval(function(){
    pass = true;
  }, timeout);

  _debounce_fn._debounce_timer.unref(); // it's important moment!

  function _debounce_fn(/*arguments*/){
    if(pass){
      pass = false;
      fn.apply(caller, arguments);
    }
  }


  _debounce_fn.calcel = function(){
    stopInterval(this._debounce_timer);
  };
  return _debounce_fn;
}


module.exports = {
  debounce:debounce
};