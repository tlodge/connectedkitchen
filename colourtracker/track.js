window.onload = function() {
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  // these are the default colours from tracking.js


  
  tracking.ColorTracker.registerColor('green', function(r, g, b) {
    if ((g >= 123) && (b < 100)) {
      return true;
    }
    return false;
  });

  tracking.ColorTracker.registerColor('blue', function(r, g, b) {
    if ((g <= 123) && (b >= 100)) {
      return true;
    }
    return false;
  });

  /*tracking.ColorTracker.registerColor('black', function(r, g, b) {
    if ((r > 50 ) && (g >= 50 && g <= 123) && (b > 50 && b < 100)) {
      return true;
    }
    return false;
  });*/

  var tracker = new tracking.ColorTracker(['green']);

  // setting up the tracking!
  tracking.track('#video', tracker, { camera: true });

  // Looking to see if there's colours
  function changeColor() {
    tracker.on('track', function(event) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    if (event.data.length === 0) {
      // No colors were detected in this frame.
    } else {
      

      event.data.forEach(function(rect) {
        context.strokeStyle = rect.color;
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.font = '11px Helvetica';
        context.fillStyle = "#fff";
        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
      });
    }
  });
  requestAnimationFrame(changeColor);
 }
   
 requestAnimationFrame(changeColor);
 // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame       
};

