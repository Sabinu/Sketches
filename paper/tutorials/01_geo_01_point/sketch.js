// POINTS
//=============================

// // create a location
// var myPoint = new Point();
//
// console.log(myPoint);
//
// myPoint.x = 10;
// myPoint.y = myPoint.x + 10;
//
// console.log(myPoint);
//
// // ============================
//
// console.log('=========================');
//
// var firstPoint = new Point(20, 40);
// var secondPoint = firstPoint;
// secondPoint.y = 20;
// console.log(secondPoint);
//
// // Note that firstPoint has changed as well:
// console.log(firstPoint);
//
// firstPoint = secondPoint.clone();
//
// secondPoint.y = 50;
// console.log(firstPoint);
// console.log(secondPoint);


// SIZE
//=============================

// var mySize = new Size();
// console.log(mySize);
//
// mySize.width = 10;
// mySize.height = mySize.width + 10;
// console.log(mySize);


// RECTANGLE
//=============================

var topLeft = new Point(10, 20);
var rectSize = new Size(200, 100);
var rect = new Rectangle(topLeft, rectSize);
console.log(rect);
console.log(rect.point);
console.log(rect.size);

rect.center = new Point(200, 200);

console.log(rect.point);
