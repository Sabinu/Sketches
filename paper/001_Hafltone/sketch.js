// Please note: dragging and dropping images only works for
// certain browsers when serving this script online:

var image_num = 0;
var vis_raster = false;
var current_image = 'data/random_noise 500.png';

var symbol_raster, raster;
var grid = new Size();
grid.width = $('#grid-width').val();
grid.height = $('#grid-height').val();
var psymbol = createSymbol();

function createSymbol() {
  var path = new Path.Circle({radius: 1});
  path.fillColor = new Color( {
    // red: 100,
    alpha: 0.5
  });
  path.remove();
  return path;
}

handleImage(current_image);

function handleImage(image) {
  if (image != current_image)   image_num++;
  console.log('Got image: ' + image_num.toString());

  // Remove existing symbol_raster
  if (symbol_raster) symbol_raster.remove();
  if (raster) raster.remove();

  raster = new Raster(image, view.center);
  raster.visible = vis_raster;

  raster.on('load', function() {
    // raster.fitBounds(view.bounds, true);
    raster.fitBounds(view.bounds);
    symbol_raster = new Group();
    for (var x = 0; x < view.size.width/grid.width; x++) {
      for (var y = 0; y < view.size.height/grid.height; y++) {
        var placed = psymbol.clone();
        placed.scale(grid.width/2, grid.height/2);
        placed.position = {
          x: x * grid.width,
          y: y * grid.height
        };
        symbol_raster.addChild(placed);
      }
    }
    var contour = new Path.Rectangle(raster.bounds);
    contour.strokeColor = "black";
    console.log(contour);
    // symbol_raster.fitBounds(view.bounds);
    // console.log(symbol_raster.children.length);
  })
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

// function onKeyDown(event) {
//   if(event.key == '0') {
//     // vis_raster = !vis_raster;
//     raster.visible = !raster.visible;
//     symbol_raster.visible = !symbol_raster.visible;
//     view.draw();
//   }
// }

function onMouseUp(event) {
  // The amount of times the mouse has been released:
  raster.visible = !raster.visible;
  symbol_raster.visible = !symbol_raster.visible;
  view.draw();
}


// ON drop
// ============================================================
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
      current_image = image;
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


// TOOLBAR ACTIONS
// ===============================================================================
$('#export-button').click(function() {
  raster.remove();
  var svg = project.exportSVG({ asString: true });
  downloadDataUri({
  	data: 'data:image/svg+xml;base64,' + btoa(svg),
  	filename: 'export.svg'
  });
  handleImage(current_image);
  view.draw();
});

$('#uniform-button').click(function() {
  grid.height = grid.width;
  $('#grid-height').val(grid.width);
  handleImage(current_image);
  view.draw();
});

$('#grid-width').change(function() {
  grid.width = $('#grid-width').val();
  handleImage(current_image);
  view.draw();
});

$('#grid-height').change(function() {
  grid.height = $('#grid-height').val();
  handleImage(current_image);
  view.draw();
});
