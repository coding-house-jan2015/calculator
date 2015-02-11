'use strict';

$(document).ready(init);

function init() {
  $('.number').click(clickNumber);
  $('.operator').click(clickOperator);
  $('#clear').click(clickClear);
  $('#decimal').click(clickDecimal);
  $('#sign').click(clickSign);
  $('#evaluate').click(clickEvaluate);
  $(document).keypress(pressKey);
}

var stack = [];
var isReset = false;

function pressKey(e) {
  var key = String.fromCharCode(e.keyCode);
  if (!isNaN(key * 1)) {
    clickNumber(null, key);
  } else {
    switch (key) {
      case 'c':
        clickClear();
        break;
      case '.':
        clickDecimal();
        break;
      case 's':
        clickSign();
        break;
      case '=':
        clickEvaluate();
        break;
      default:
        clickOperator(null, key);
    }
  }
}

function clickNumber(e, value) {
  if (isReset) {
    clickClear();
    isReset = false;
  }

  var old = display();
  var key = value || this.textContent;
  var txt = old === '0' ? key : old + key;
  display(txt);
}

function clickOperator(e, value) {
  var op = value || $(this).data('op');
  var old = display() * 1;

  switch (op) {
    case 'r':
      display(format(Math.sqrt(old)));
      break;
    default:
      if (stack.length) {
        clickEvaluate();
      }

      stack.push(display(), op);
      isReset = true;
  }
}

function clickClear() {
  display('0');
}

function clickDecimal() {
  var old = display();
  if (old.indexOf('.') === -1) {
    display(old + '.');
  }
}

function clickSign() {
  var old = display();
  display(old * -1);
}

function clickEvaluate() {
  stack.push(display());
  var result = format(calculate());
  display(result);
}

function calculate() {
  var y = Number(stack.pop());
  var o = stack.pop();
  var x = Number(stack.pop());

  switch (o) {
    case '*':
      return x * y;
    case '/':
      return x / y;
    case '+':
      return x + y;
    case '-':
      return x - y;
    case 'e':
      return Math.pow(x, y);
  }
}

function format(value) {
  return Number.isInteger(value) ? Number(value) : Number(value.toFixed(2));
}

function display(value) {
  if (value) {
    $('#display').text(value);
  } else {
    return $('#display').text();
  }
}
