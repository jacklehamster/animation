function createSprite(data) {
  
  var canvas = document.createElement("canvas");

  canvas.index = 0;

  var animations = {};
  canvas.animations = animations;
  var count = 0;
  var maxX=0, maxY=0;
  var firstLabel = null;
  for(var label in data) {
    animations[label] = [];
    for(var i=0;i<data[label].length;i++) {
      if(!canvas.label)
        canvas.label = label;
      var src = data[label][i];
      var image = new Image();
      count++;
      image.addEventListener("load",
        function(e) {
          e.currentTarget.removeEventListener(e.type,arguments.callee);
          var image = e.currentTarget;
          maxX = Math.max(maxX,image.naturalWidth);
          maxY = Math.max(maxY,image.naturalHeight);
          canvas.width = maxX;
          canvas.height = maxY;
        }
      );
      image.src = src;
    }
  }

  canvas.gotoAndPlay = gotoAndPlay;
  canvas.next = next;
  canvas.show = show;
  /*
  canvas.interval = setInterval(
    function() {
        canvas.next();
        canvas.show();
    },30
  );
  */
  return canvas;
}

function gotoAndPlay(label) {
  var canvas = this;
  canvas.label = label;
  canvas.index = 0;
}

function next() {
  var canvas = this;
  var anim = canvas.animations[canvas.label];
  canvas.index = (canvas.index+1)%anim.length;
}

function show() {
  var canvas = this;
  var image = canvas.animations[canvas.label][canvas.index];
  var ctx = canvas.getContext("2d");
  ctx.drawImage(image,0,0);
}
