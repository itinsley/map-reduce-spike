var mongoose = require('mongoose');
var async = require('async');
var docSchema = new mongoose.Schema({ sentence: String });
var Document = mongoose.model('Document', docSchema );
var timer = require('./timer')

mongoose.connect('mongodb://localhost/map-data-spike');
var cn = mongoose.connection;
cn.on('error', console.error.bind(console, 'connection error:'));

mongooseDa = {

  saveData: function(docArray, callback){
    async.series([
      function(cb){ cn.db.dropDatabase(cb) },

      function(cb){
        mongooseSaveArray(docArray, function(){
          callback();
        })
      }
    ])
  },

  mapReduceFilter: function(cb){
    mapReduceFilter(cb);
  },

  connection: cn

}

module.exports = mongooseDa;

/*************************
 * Private
 ************************/

function mongooseSaveArray (docArray, callback){
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

function mapReduceFilter(callback){
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

