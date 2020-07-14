import { rect } from './dquad/geometry';

export default function Frames(assets) {
  
  let mall = (x, y, w = 32, h = w) => texture(assets['all'],
                                     rect(x, y, w, h));

  return {
    all: all(mall)
  };

}

const all = (mall) => {
  return {
    idle: manimation(mall, 0, 0, 2),
    running: manimation(mall, 0, 32, 3),
    sliding: manimation(mall, 0, 32 * 2, 1),
    trail: manimation(mall, 0, 32 * 3, 6),
    trail2: manimation(mall, 0, 32 * 4, 6),
    trailtile: manimation(mall, 0, 32 * 7, 4),
    tiles: manimation(mall, 0, 32 * 6, 5)
  };
};

const manimation = (mall, x, y, n, w = 32) => {
  let res = [];
  for (let i = 0; i < n; i++) {
    res.push(mall(x + w * i, y, w));
  }
  return res;
};

const texture = (source, frame) => ({
  source,
  frame
});
