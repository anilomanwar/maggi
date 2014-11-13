var _=require('underscore')
var Q=require('q')
var data = ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10", "a11", "a12", "a13"];
var n = 3;
var lists = _.groupBy(data, function(element, index){
  return Math.floor(index/n);
});
lists = _.toArray(lists); //Added this to convert the returned object to an array.
console.log(lists);

function mapSeries (arr, iterator) {
  // create a empty promise to start our series (so we can use `then`)
  var currentPromise = Q()
  var promises = arr.map(function (el) {
    return currentPromise = currentPromise.then(function () {
      // execute the next function after the previous has resolved successfully
      return iterator(el)
    })
  })
  // group the results and return the group promise
  return Q.all(promises)
}

mapSeries(data)