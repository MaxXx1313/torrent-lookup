

module.exports = {
  debounce:debounce,
  prettyFormat:prettyFormat
};


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

/**
 * @param {Array<Object>} dataArray
 */
function prettyFormat(dataArray, columnsFilter){
  dataArray = dataArray || [];

  if(dataArray.length === 0){
    return ' \x1B[3m no data \x1B[0m';
  }

  // collect columns
  let columns = {};
  dataArray.forEach(row=>{
    let cols = columnsFilter || Object.keys(row);
    cols.forEach(name=>{
      columns[name] = max(columns[name] || 0, (''+row[name]).length );
    });
  });

  // print columns
  let tableData = '';
  Object.keys(columns).forEach((name, index)=>{
    // normalize column length
    columns[name] = max(columns[name], name.length);

    // create header
    let spaceAfter = columns[name] - name.length;
    tableData +=
      (index > 0 ?'|':'')  // separator
      + ' ' + name + ' '   // name + padding
      + (spaceAfter > 0 ? ' '.repeat(spaceAfter) : '' ) // space after
      ;
  });
  tableData += '\n';

  // +1 for separator, +2 for padding, -1 for no separator on first line
  let sum = Object.keys(columns).reduce((sum, name)=>sum+columns[name]+1+2, -1);
  tableData += (sum > 0 ? '-'.repeat(sum) : '') + '\n';

  // table data
  dataArray.forEach(row=>{
    Object.keys(columns).forEach((name, index)=>{

      let spaceAfter = columns[name] - (""+row[name]).length;
      tableData +=
        (index > 0 ?'|':'')  // separator
        + ' ' + row[name] + ' '   // value + padding
        + (spaceAfter > 0 ? ' '.repeat(spaceAfter) : '' ) // space after
        ;
    });
    tableData += '\n';
  });

  return tableData;
}


function max(a, b){ return a>b?a:b; }