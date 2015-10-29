
// Create in memory array of objects containing dummy data
var text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
var words = text.split(" ")
var word_count = words.length


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/map-data-spike');

testData = createArray();


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  mongooseSaveArray(testData, function(){
    console.log("Mongo data saved.");
  })
})

mongoose.connect(config.url);


// function mongooseSaveArray(sentenceArray, callback){

//   var docSchema = mongoose.Schema({
//       sentence: String
//   });

//   var i=1;
//   async.eachParallel(
//     sentenceArray,
//     function(sentence, callback){
//       console.log("Saving " + i)
//       i++;
//       var doc = new docSchema({sentence: sentence})
//       doc.save(function (err, doc) {
//         if (err) return console.error(err);
//         console.log('saved...'+ doc)
//         callback
//       });
//     })
//   }
// });



function createArray(){

  var objectArr=[]
  for(i=1;i<10;i++){
    var start = Math.floor(Math.random()*word_count)
    var end = Math.floor(Math.random()*(word_count-start))+start
    sentence = words.slice(start, end).join(" ")
    doc = {"sentence": sentence}
    objectArr.push(doc)
  }

  return objectArr
}


function inMemoryFilter(arr){
  lorems = arr.filter(function hasLorem(doc){
    return doc.sentence.indexOf("Lorem")
  })
  console.log("Result: " + lorems.length)
}

function timer(func){

  var start = new Date().getTime();

  func()

  var end = new Date().getTime();
  var time = end - start;
  console.log('Execution time: ' + time + "ms");
}




// arr = createArray();

// timer(function(){inMemoryFilter(arr)})