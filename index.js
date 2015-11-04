var mongoose = require('mongoose');
var async = require('async');
var docSchema = new mongoose.Schema({ sentence: String });
var Document = mongoose.model('Document', docSchema );
var start


docArray = createDummyData();


mongoose.connect('mongodb://localhost/map-data-spike');
var cn = mongoose.connection;
cn.on('error', console.error.bind(console, 'connection error:'));
cn.once('open', function (callback) {

  async.series([
    function(cb){ cn.db.dropDatabase(cb) },

    function(cb){
      console.log("in memory")
      startTimer()
      inMemoryFilter(docArray, cb)
    },

    function(cb){
      endTimer()
      cb();
    },

    function(callback){
      mongooseSaveArray(docArray, function(){
        callback();
      })
    },

    function(cb){
      console.log("in Mongo")
      startTimer()
      mappReduceFilter(cb);
    },

    function(cb){
      endTimer()
      cb();
    },

    function(cb){
      cn.close()
      console.log("Finished. Database closed")
      cb();
    }
  ])

})


function mongooseSaveArray(docArray, callback){
  //Runs them async but waits until all are complete before completion function
  async.each(
    docArray,
    function(doc, callback){
      var documentObj = new Document({sentence: doc.sentence})
      documentObj.save(function (err, doc) {
        if (err) return console.error(err);
        callback()
      });
    },
    function(err){
      // Finished
      callback()
    }

  )
}

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

function inMemoryFilter(arr, callback){
  lorems = arr.filter(function hasLorem(doc){
    return doc.sentence.indexOf("Lorem")>0
  })
  console.log("Result: " + lorems.length)
  callback();
}

function mappReduceFilter(callback){
  var o = {};
  o.map = function () {
    if (this.sentence.indexOf("Lorem")>0)
      emit(this.sentence, 1)
  }

  Document.mapReduce(o, function (err, results) {
    console.log("Result: " + results.length)
    callback()
  })

}


function startTimer(){
  start = new Date().getTime();
}

function endTimer(){
  var end = new Date().getTime();
  var time = end - start;
  console.log('Execution time: ' + time + "ms");
}

