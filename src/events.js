export default function Events() {
  let data = this.data = {};

  const unbinds = [];

  const onKeyDown = startMove(data);
  const onKeyUp = endMove(data);

  unbinds.push(unbindable(document, 'keydown', onKeyDown));
  unbinds.push(unbindable(document, 'keyup', onKeyUp));

  this.unbind = () => { unbinds.forEach(_ => _()); };

}

function unbindable(el, eventName, callback) {
  el.addEventListener(eventName, callback);
  return () => el.removeEventListener(eventName, callback);
}

function endMove(data) {
  const releaseKey = (key) => {
    data[key] = false;
  };

  return function(e) {
    switch (e.code) {
    case 'KeyX':
      releaseKey('x');
      break;
    case 'KeyC':
      releaseKey('c');
    case 'ArrowUp':
      releaseKey('up');
      break;
    case 'ArrowDown':
      releaseKey('down');
      break;
    case 'ArrowLeft':
      releaseKey('left');
      break;
    case 'ArrowRight':
      releaseKey('right');
      break;
    }
  };
}

function startMove(data) {
  const pressKey = (key) => {
    data[key] = true;
  };

  return function(e) {
    switch(e.code) {
    case 'KeyX':
      pressKey('x');
      break;
    case 'KeyC':
      pressKey('c');
    case 'ArrowUp':
      pressKey('up');
      break;
    case 'ArrowDown':
      pressKey('down');
      break;
    case 'ArrowLeft':
      pressKey('left');
      break;
    case 'ArrowRight':
      pressKey('right');
      break;
    default:
      return;
    }
    e.preventDefault();
  };
}
