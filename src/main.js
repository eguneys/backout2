import defaults from './state';

import Canvas from './canvas';
// import Audio from './audio';
import Loop from 'loopz';
import Play from './play';
import Graphics from './graphics';

import Events from './events';

export function app(element, options) {

  const config = {
    ...defaults()
  };

  //let audio = new Audio();

  // if (!config.debug) {
  //   audio.generate().then(() => {
  //     audio.playSound('song', 1, 0, 0.2, true);
  //   });
  // }

  let canvas = new Canvas(element, {
    width: config.width,
    height: config.height,
    ratio: config.ratio
  });

  let graphics = new Graphics(canvas.ctx, {
    width: config.width,
    height: config.height
  });

  let events = new Events();

  let ctx = {
    config,
    events,
    canvas,
    g: graphics,
    // a: audio
  };

  let play = new Play(null, ctx);

  new Loop(delta => {
    play.update(delta);
    play.render();
    graphics.render();
  }).start();

  if (module.hot) {
    module.hot.accept('./play', function() {
      try {
        play = new Play(null, ctx);
      } catch (e) {
        console.log(e);
      }
    });
  }

}
