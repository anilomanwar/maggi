var request = require('request');
var r = request.get('http://www.pepperfry.com/mark-home-aqua-color-cotton-2-single-bed-sheets-n-2-pillow-covers-1197983.html', function (err, res, body) {
  console.log(r.uri.href);
  console.log(res.request.uri.href);

  // Mikael doesn't mention getting the uri using 'this' so maybe it's best to avoid it
  // please add a comment if you know why this might be bad
  console.log(this.uri.href);
});
