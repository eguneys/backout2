import text from './text';

import * as u from './util';


export default function texteffects(o, g) {
  o = { ...defaults(), ...o };

  const letters = o.text.split('');

  const gap = 10,
        moveX = 1;

  letters.reduce((s, _, i) => {

    const deltaX = u.sinh(o.t) + moveX;

    const x = s.ex + gap,
          y = o.y + u.sinh(i + o.t) * o.jump;


    text({ text: _,
           x: x + 2,
           y: y + 2 + moveX - deltaX,
           ...{...o.s, color: 41 } }, g);

    return text({ text: _,
                  x: x + deltaX,
                  y,
                  ...o.s }, g);
  }, text({ text: letters[0],
            x: o.x, 
            y: o.y,
            render: false 
          }));
  
}


function defaults() {
  return {
    text: '',
    hspacing: 10,
    x: 0,
    y: 0,
    t: 0,
    jump: 10,
    s: {}
  };
};
