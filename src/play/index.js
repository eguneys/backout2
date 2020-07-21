import text from '../text';

import Game from './game';

export default function Play(play, ctx) {

  const { debug, width, height } = ctx.config;

  const { g } = ctx;

  const b = g.buffers;

  let game = new Game(this, ctx);

  this.update = (delta) => {
    game.update(delta);
  };

  this.render = () => {
    clear();

    game.render();

    // renderDebug();

    flush();

    // effects();
  };

  let buffers = [b.Ui,
                 b.Background,
                 b.Foreground,
                 b.Buffer,
                 b.Screen];

  function clear() {
    buffers.forEach(target => {
      g.renderTarget = target;
      g.clear(0);
    });
  } 

  const flushBuffers = [
    b.Background,
    b.Foreground,
    b.Ui
  ];
  function flush() {
    g.renderTarget = b.Screen;
    flushBuffers.forEach(source => {
      g.renderSource = source;
      g.spr();
    });
  }

  function renderDebug() {
    if (!debug) {
      return;
    }

    g.renderTarget = b.Foreground;
    const w = 8;

    for (let i = 0; i < 64; i++) {
      const x = Math.floor(i / (64 / 4)) * w * 4 + width * 0.1,
            y = (i % (64 / 4)) * w + width * 0.05;

      g.fillRect(x, y, x + w, y + w, i);
      text({
        x: x - w,
        y: y,
        hspacing: 1,
        text: i + '',
        color: i
      }, g);
    }
  }
}
