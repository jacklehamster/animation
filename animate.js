function createSprite(data) {
  
  var canvas = document.createElement("canvas");

  canvas.index = 0;
  canvas.direction = 1;
  canvas.scale = 1;

  var animations = {};
  canvas.animations = animations;
  var count = 0;
  var maxX=0, maxY=0;
  canvas.labels = [];
  for(var label in data) {
    canvas.labels.push(label);
    animations[label] = [];
    for(var i=0;i<data[label].length;i++) {
      if(!canvas.label)
        canvas.label = label;
      var obj = data[label][i];
      if(typeof(obj)=="string") {
          obj = {src:obj};
      }
      var src = obj.src;
      var x = obj.x?obj.x:0;
      var y = obj.y?obj.y:0;
      var image = new Image();
      animations[label].push({
        src:image,
        x:x,
        y:y
      });
      count++;
      image.addEventListener("load",
        function(e) {
          e.currentTarget.removeEventListener(e.type,arguments.callee);
          var image = e.currentTarget;
          maxX = Math.max(maxX,image.naturalWidth);
          maxY = Math.max(maxY,image.naturalHeight);
          canvas.width = maxX;
          canvas.height = maxY;
          count--;
          if(!count) {
            canvas.dispatchEvent(new Event("loaded"));
          }
        }
      );
      image.src = src;
    }
  }

  canvas.gotoAndPlay = gotoAndPlay;
  canvas.next = next;
  canvas.show = show;
  canvas.setDirection = setDirection;

  var enterFrameEvent = new Event("enterFrame");
  canvas.interval = setInterval(
    function() {
        canvas.next();
        canvas.show();
        canvas.dispatchEvent(enterFrameEvent);
    },30
  );
  
  return canvas;
}

function setDirection(dir) {
  var canvas = this;
  if(canvas.direction*dir<0) {
    canvas.direction = dir;
    var ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
}

function gotoAndPlay(label) {
  var canvas = this;
  canvas.label = label;
  canvas.index = 0;
  canvas.show();
}

function next() {
  var canvas = this;
  var anim = canvas.animations[canvas.label];
  canvas.index = (canvas.index+1)%anim.length;
}

function show() {
  var canvas = this;
  var animation = canvas.animations[canvas.label][canvas.index];
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(animation.src,0,0);
  canvas.style.marginLeft = animation.x+"px";
  canvas.style.marginRight = animation.x+"px";
}
