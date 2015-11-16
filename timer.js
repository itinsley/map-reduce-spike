/*
 * NOTE: Super simple - does not work with async code
 */

module.exports = {

  start: function(){
    start = new Date().getTime();
  },

  end: function(){
    var end = new Date().getTime();
    var time = end - start;
    console.log('Execution time: ' + time + "ms");
  }

}