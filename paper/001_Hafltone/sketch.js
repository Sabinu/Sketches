// Please note: dragging and dropping images only works for
// certain browsers when serving this script online:

var image_num = 0;
// var count = 0;
var symbol_raster, raster;
var grid = new Size(20, 20);
var psymbol = createSymbol();

function createSymbol() {
  var path = new Path.Circle({radius: grid.width/2});
  path.fillColor = new Color( {
    // red: 100,
    alpha: 0.5
  });
  path.remove();
  return path;
}

handleImage('data/random_noise 500.png');

function handleImage(image) {
  console.log('Got image: ' + image_num.toString());
  // count = 0;
  // var size = symbol.item.bounds.size;

  // Remove existing symbol_raster
  if (symbol_raster) symbol_raster.remove();
  if (raster) raster.remove();

  raster = new Raster(image, view.center);
  raster.visible = true;

  raster.on('load', function() {
    // raster.fitBounds(view.bounds, true);
    raster.fitBounds(view.bounds);
    symbol_raster = new Group();
    for (var x = 0; x < view.size.width/grid.width; x++) {
      for (var y = 0; y < view.size.height/grid.height; y++) {
        var placed = psymbol.clone();
        placed.position = {
          x: x * grid.width,
          y: y * grid.height
        };
        symbol_raster.addChild(placed);
      }
    }
    // symbol_raster.fitBounds(view.bounds);
    // console.log(symbol_raster.children.length);
  })
  image_num++;
}

function onFrame(event) {
  if(!symbol_raster) return;

  // var amount = view.size.height / grid.height;
  // var length = Math.min(count + amount, symbol_raster.children.length);

  var length = symbol_raster.children.length;
  // console.log(length);

  for(var i = 0; i < length; i++) {
    var piece = symbol_raster.children[i];
    var color = raster.getAverageColor(piece);
    // NOT WORKING #TODO
    // var color = raster.getPixel(piece.bounds.center);

    piece.fillColor = color;
  }
}

function onResize() {
  project.activeLayer.position = view.center;
}

function onDocumentDrag(event) {
  event.preventDefault();
}

function onDocumentDrop(event) {
  event.preventDefault();

  var file = event.dataTransfer.files[0];
  var reader = new FileReader();

  reader.onload = function(event) {
    var image = document.createElement('img');
    image.onload = function () {
      handleImage(image);
      view.draw();
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

document.addEventListener('drop', onDocumentDrop, false);
document.addEventListener('dragover', onDocumentDrag, false);
document.addEventListener('dragleave', onDocumentDrag, false);


// Download Button functions
function downloadDataUri(options) {
  if (!options.url)
    options.url = "http://download-data-uri.appspot.com/";
    $('<form method="post" action="' + options.url
    + '" style="display:none"><input type="hidden" name="filename" value="'
    + options.filename + '"/><input type="hidden" name="data" value="'
    + options.data + '"/></form>').appendTo('body').submit().remove();
}

$('#export-button').click(function() {
  var svg = project.exportSVG({ asString: true });
  downloadDataUri({
  	data: 'data:image/svg+xml;base64,' + btoa(svg),
  	filename: 'export.svg'
  });
});
