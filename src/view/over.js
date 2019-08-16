import * as u from '../util';

import text from '../text';
import texteffects from '../texteffects';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const b = g.buffers;

  const renderLogo = ctrl => {

    const t = ctrl.data.game.tick * 0.01;

    const w = width * 0.6,
          h = height * 0.3,
          moveX = w * 0.008,
          x = width / 2 - w / 2,
          y = height * 0.2 - h / 2;

    let deltaX = Math.sin(t) * moveX;

    g.fr(x + moveX * 3, y + moveX * 3 - Math.sin(t) * moveX , w, h, 41);
    g.fr(x + deltaX, y, w, h, 50);
    
    text({
      x: width / 2 + deltaX,
      y: height * 0.2,
      text: 'backout',
      color: 1,
      scale: 5
    }, g);

  };

  const renderOver = (ctrl) => {

    const action = 5;
    const info = 7;

    const score = ctrl.data.game.score + '';

    renderLogo(ctrl);

    let gap = height * 0.1;
    let s;

    texteffects({
      text: 'new high score ' + score,
      x: width * 0,
      y: height * 0.45,
      t: ctrl.data.game.tick * 0.01,
      s: {
        color: 12,
        scale: 3,
        render: true || ctrl.data.game.score > ctrl.data.highscore
      }
    }, g);

    s = text({
      x: width / 2,
      y: height * 0.6,
      text: 'press space to play.',
      color: action,
      scale: 2
    }, g);


    text({
      x: width / 2,
      y: s.ey + gap * 2,
      text: 'avoid paddles to hit the ball.\nuse arrow keys to control paddles.\nuse space to go faster.',
      vspacing: 8,
      color: info,
      scale: 1.8
    }, g);

  };


  this.render = ctrl => {
    g.renderTarget = b.Ui;

    if (ctrl.data.state === u.States.Over) {
      renderOver(ctrl);
    }

  };
  
}
