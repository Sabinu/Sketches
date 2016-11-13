var textfield;
var output;
var submit;

function newText () {
  var s = textfield.value();
  var new_text = s.substring(1, 4);
  output.html(s.length);
  output.html(s.indexOf('H'));
  output.html(new_text);
}

// ====================================================

function setup() {
  noCanvas();

  textfield = select('#textfield');
  output = select('#output');
  submit = select('#submit');

  submit.mousePressed(newText);
}
