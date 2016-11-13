var txt;
var dropzone;

// function preload() {
//   txt = loadStrings('sample.txt');
// }

function loadFile() {
  loadStrings('sample.txt', fileLoaded);
}

function fileLoaded(data) {
  // txt = data;
  createP(join(data, '<br/>'));
}

function fileSelected(file) {
  createP(file.name + ' ' + file.size + ' ' + file.type);
  if (file.type == 'text') {
    createP(file.data);
  } else {
    createP('I need a text file.');
  }
  console.log(file);
}

function highlight() {
  dropzone.style('background-color', '#ddd')
}


function unhighlight() {
  dropzone.style('background-color', '#fff')
}

function fileDroped(file) {
  createP(file.name + ' ' + file.size + ' ' + file.type);
  if (file.type == 'text') {
    createP(file.data);
  } else {
    createP('I need a text file.');
  }
  console.log(file);
}

// =================================================================

function setup() {
  noCanvas();

  createFileInput(fileSelected);

  var button = select('#loadfile');
  dropzone = select('#dropzone');

  button.mousePressed(loadFile);
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(fileDroped, unhighlight);

  console.log(txt);
  // createP(join(txt, '<br/>'));
}
