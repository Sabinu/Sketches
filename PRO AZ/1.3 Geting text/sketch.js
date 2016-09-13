var textfield;
var output;
var submit;

function setup() {
  noCanvas();
  // textfield = createInput();

  textarea = select('#textarea');

  // textfield.changed(newText);  // at enter
  // textfield.input(newTyping);  // at change

  // textarea.changed(newText);  // at enter
  textarea.input(newTyping);  // at change

  output = select('#output');
  submit = select('#submit');

  submit.mousePressed(newText);
}

function newText() {
  createP(textarea.value());
}

function newTyping() {
  output.html(textarea.value());
  // createP(textfield.value());
}
