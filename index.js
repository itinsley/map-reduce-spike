var mongoose_da = require('./mongoose_da')
var async = require('async');
var timer = require('./timer')
var start

docArray = createDummyData();
console.log("in memory")
timer.start()
inMemoryFilter(docArray)
timer.end()


mongoose_da.connection.once('open', function (callback) {

  async.series([

    function(cb){
      mongooseDa.saveData(docArray, function(){
        cb();
      })
    },

    function(cb){
      console.log("in Mongo")
      timer.start();
      mongooseDa.mapReduceFilter(function(){
        cb();
      })
    },

    function(cb){
      timer.end();
      mongoose_da.connection.close()
      console.log("Finished. Database closed")
      cb();
    }

  ])

})


function createDummyData(){

  // Create in memory array of objects containing dummy data
  var text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  var words = text.split(" ")
  var word_count = words.length

  var objectArr=[]
  for(var i=1;i<1000;i++){
    var start = Math.floor(Math.random()*word_count)
    var end = Math.floor(Math.random()*(word_count-start))+start
    var sentence = words.slice(start, end).join(" ")
    doc = {"sentence": i + " " + sentence}
    objectArr.push(doc)
  }

  return objectArr
}

function inMemoryFilter(arr){
  lorems = arr.filter(function hasLorem(doc){
    return doc.sentence.indexOf("Lorem")>0
  })
  console.log("Result: " + lorems.length)
}
