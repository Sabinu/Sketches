// Please note: dragging and dropping images only works for
// certain browsers when serving this script online:

var values = {
  amount: 10
};

var raster, group;
var piece = createPiece();
var count = 0;

handleImage('data/random_noise 500.png');

// text is displayed under because of asyncronicity
var text = new PointText({
  point: view.center,
  justification: 'center',
  fillColor: 'white',
  fontSize: 15,
  content: window.FileReader
    ? 'Drag & drop an image from your desktop'
    : 'To drag & drop images, please use Webkit, Firefox, Chrome or IE 10'
});

function createPiece() {
  // fuction creates piesce to be distributed
  var group = new Group();
  var hexagon = new Shape.Circle({
    center: view.center,
    radius: 50
  });
  hexagon.fillColor = '#888888';
  hexagon.parent = group;

  // Remove the group from the document, so it is not drawn:
  group.remove();
  console.log(group.children.length);
  return group;
}

function handleImage(image) {
  count = 0;
  var size = piece.bounds.size;

  if (group)
    group.remove();

  // As the web is asynchronous, we need to wait for the raster to
  // load before we can perform any operation on its pixels.
  raster = new Raster(image, view.center);
  raster.visible = true;
  raster.on('load', function() {
    // Transform the raster, so it fills the view:
    // raster.fitBounds(view.bounds, true);
    group = new Group();
    for (var y = 0; y < values.amount; y++) {
      for (var x = 0; x < values.amount; x++) {
        var copy = piece.clone();
        copy.position += size * [x + (y % 2 ? 0.5 : 0), y * 0.75];
        group.addChild(copy);
      }
    }

    // Transform the group so it covers the view:
    // group.fitBounds(view.bounds, true);
  });
}

function onFrame(event) {
  if (!group)
    return;
  // Loop through the uncolored hexagons in the group and fill them
  // with the average color:
  var length = Math.min(count + values.amount, group.children.length);
  for (var i = count; i < length; i++) {
    piece = group.children[i];
    var hexagon = piece.children[0];
    var color = raster.getAverageColor(hexagon);
    if (color) {
      hexagon.fillColor = color;
      // var top = piece.children[1];
      // top.fillColor = color.clone();
      // top.fillColor.brightness *= 1.5;
      //
      // var right = piece.children[2];
      // right.fillColor = color.clone();
      // right.fillColor.brightness *= 0.5;
    }
  }
  count += values.amount;
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
