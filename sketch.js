var degrees_to_radians = function (degree) {
  var pi = math.pi;
  return degree * (pi / 180);
};

var array = [];
var thetas = math
  .range(-90, 90, 1, false)
  ._data.map((degree) => degrees_to_radians(degree));
var cos_t = math.cos(thetas);
var sin_t = math.sin(thetas);
var distance = 71;
var rhos = math.range(-distance, distance, 1, true);
var accumulator = {};

var hough = function () {
  var uniqueArray = [...new Set(array)];

  uniqueArray.map((point) => {
    var x = parseInt(point.split(",")[0]);
    var y = parseInt(point.split(",")[1]);
    [...Array(thetas.length).keys()].map((idx) => {
      var rho = distance + math.round(x * cos_t[idx] + y * sin_t[idx]);
      accumulator[`${rho};${idx}`] = accumulator[`${rho};${idx}`]
        ? accumulator[`${rho};${idx}`] + 1
        : 1;
    });
  });
};

var sketch = function (p) {
  p.setup = function () {
    p.createCanvas(50, 50);
    p.background(0);
    button = p.createButton("Visualize");
    button.position(0, 0);
    button.mousePressed(hough);
  };

  p.draw = function () {

    p.loadPixels();
    if (
      p.mouseIsPressed &&
      p.mouseX <= p.width &&
      p.mouseX >= 0 &&
      p.mouseY <= p.height &&
      p.mouseY >= 0
    ) {
      var index = (p.floor(p.mouseX) + p.floor(p.mouseY) * p.width) * 4;
      p.pixels[index + 0] = 255;
      p.pixels[index + 1] = 255;
      p.pixels[index + 2] = 255;
      p.pixels[index + 3] = 255;

      array.push(`${p.floor(p.mouseX)},${p.floor(p.mouseY)}`);
    }

    

    p.updatePixels();
  };
};

var sketch2 = function (p) {
  p.setup = function () {
    p.createCanvas(180, 143);
    p.background(0);
  };

  p.draw = function () {
    p.frameRate(1);
    p.loadPixels();

    if (Object.keys(accumulator).length > 0) {
      var max = math.max(Object.values(accumulator));
      Object.keys(accumulator).map((location) => {
        var x = parseInt(location.split(";")[1]);
        var y = parseInt(location.split(";")[0]);
        var index = (x + y * p.width) * 4;
        var value = p.map(accumulator[location], 0, max, 0, 255);
        p.pixels[index + 0] = value;
        p.pixels[index + 1] = value;
        p.pixels[index + 2] = value;
        p.pixels[index + 3] = 255;
      });
    }

    p.updatePixels();
  };
};

var left = new p5(sketch);
var right = new p5(sketch2);
