// Create a raster item using the image tag with id='mona'
var raster = new Raster('data/random_noise 500.png');

raster.position = view.center;
// raster.setBounds(view.bounds, true);

raster.opacity = 0.1;

raster.on('load', function() {
  // var path = new Path.Circle(view.center, 50);
  // path.fillColor = raster.getAverageColor(path);

  // var path = new Path.Circle(new Point(500, 500), 50);
  // path.fillColor = raster.getAverageColor(path);

  for (var x = 0; x < view.size.width/50; x++) {
    for (var y = 0; y < view.size.height/50; y++) {
      var p = new Point(x*50, y*50);
      var path = new Path.Circle(p, 25);
      var col  = raster.getAverageColor(path);
      if (col) {
        path.fillColor = raster.getAverageColor(path);
      }
      else {
        path.fillColor = 'red';
        path.fillColor.alpha = 0.2;
      }

      // var l = new Point(x, y);
      // path.fillColor = raster.getPixel(l);
    }
  }
});
