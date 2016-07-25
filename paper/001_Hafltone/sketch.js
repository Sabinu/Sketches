// Please note: dragging and dropping images only works for
// certain browsers when serving this script online:

var image_num = 0;
var vis_raster = false;
// var current_image = 'data/random_noise 500.png';
var current_image = 'data/moncada.jpg';
// var current_image = 'data/mona.jpg';

var symbol_raster, raster;
var raster_update = false;
var uniform_raster = true;
var uniform_color  = false;
var uniform_scale  = true;
var inverse_scale  = true;
var grid = new Size();
grid.width  = parseInt($('#grid-width').val());
grid.height = parseInt($('#grid-width').val());
var psymbol = createSymbol();

function createSymbol() {
  var path = new Path.Circle({radius: 1});
  path.fillColor = new Color( {
    alpha: 0.5
  });
  path.remove();
  return path;
}

handleImage(current_image);

///////////////////// END ////////////////////////////

function handleImage(image) {
  console.log('Got image: ' + image_num.toString());

  // Remove existing symbol_raster
  if (symbol_raster) symbol_raster.remove();
  if (raster) raster.remove();

  raster = new Raster(image, view.center);
  raster.visible = vis_raster;

  raster.on('load', function() {
    // raster.fitBounds(view.bounds, true);
    raster.fitBounds(view.bounds);

    var start = raster.bounds.point.clone();
    start.x += grid.width / 2;
    start.y += grid.height / 2;
    var dim = raster.bounds.clone();
    dim.width  += start.x;
    dim.height += start.y;

    symbol_raster = new Group();

    for (var x = start.x; x <= dim.width; x += grid.width) {
      for (var y = start.y; y <= dim.height; y += grid.height) {
        var pos = new Point({ x: x, y: y });

        if (pos.isInside(raster.bounds)) {
          var placed = psymbol.clone();
          placed.scale(grid.width/Math.sqrt(2), grid.height/Math.sqrt(2));
          placed.position = pos;
          symbol_raster.addChild(placed);
        }
      }
    }
    var contour = new Path.Rectangle(raster.bounds);
    // contour.fillColor = null;
    contour.strokeColor = "black";
    symbol_raster.addChild(contour);
    // symbol_raster.fitBounds(view.bounds);
    // console.log(symbol_raster.children.length);
    raster_update = false;
  })
}

function onFrame(event) {
  if(!symbol_raster || raster_update) return;
  // console.log('onFrame ran once.');

  // var amount = view.size.height / grid.height;
  // var length = Math.min(count + amount, symbol_raster.children.length);

  var length = symbol_raster.children.length;
  // console.log(length);

  for(var i = 0; i < length - 1 ; i++) {
    var piece = symbol_raster.children[i];
    var color = raster.getAverageColor(piece);
    // NOT WORKING #TODO
    // var color = raster.getPixel(piece.bounds.center);
    if (!uniform_scale) {
      var g_value = color.clone();
      g_value = g_value.convert('gray');
      if (inverse_scale) {
        piece.scale(1 - g_value.gray);
      } else {
        piece.scale(g_value.gray);
      }
    } else {
      piece.scale(1/Math.sqrt(2));
    }
    if (!uniform_color) {
      piece.fillColor = color;
    } else {
      piece.fillColor = 'black';
    }
  }

  raster_update = true;
}

// UTILS
// =====================================================
function flipVisibility() {
  symbol_raster.visible = !symbol_raster.visible;
  raster.visible = !raster.visible;
}

// INTERACTION
// =====================================================

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
  flipVisibility();
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
      if (image != current_image)   image_num++;
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
  if(!symbol_raster.visible) {
    flipVisibility();
  }
  var svg = project.exportSVG({ asString: true });
  downloadDataUri({
  	data: 'data:image/svg+xml;base64,' + btoa(svg),
  	filename: 'export.svg'
  });
  handleImage(current_image);
  view.draw();
});

$('#uniform-color').click(function() {
  if (!uniform_color) {
    $('#uniform-color').val('COLOR');
  } else {
    $('#uniform-color').val('BLACK');
  }
  uniform_color = !uniform_color;
  handleImage(current_image);
  view.draw();
});

$('#uniform-scale').click(function() {
  if (uniform_scale) {
    $('#uniform-scale').val('Non Scaled');
    $('#inverse-scale').css('display', 'inline');
  } else {
    $('#uniform-scale').val('Scaled');
    $('#inverse-scale').css('display', 'none');
  }
  uniform_scale = !uniform_scale;
  handleImage(current_image);
  raster_update = false;
  view.draw();
});

$('#inverse-scale').click(function() {
  inverse_scale = !inverse_scale;
  handleImage(current_image);
  view.draw();
});

$('#uniform-raster').click(function() {
  if (uniform_raster) {
    $('#uniform-raster').val('Uniform');
  } else {
    $('#uniform-raster').val('Non-uniform');
  }
  if (uniform_raster) {
    $('#grid-height').css('display', 'inline');
  } else {
    grid.height = grid.width;
    $('#grid-height').val(grid.width);
    $('#grid-height').css('display', 'none');
  }

  uniform_raster = !uniform_raster;
  handleImage(current_image);
  view.draw();
});

$('#grid-width').change(function() {
  grid.width = parseInt($('#grid-width').val());
  if (uniform_raster) grid.height = grid.width;
  handleImage(current_image);
  view.draw();
});

$('#grid-height').change(function() {
  grid.height = parseInt($('#grid-height').val());
  handleImage(current_image);
  view.draw();
});
