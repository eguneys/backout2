import * as m from './map';

export default function Levels() {
  this.level = (index) => {
    let level = levels[index];
    return readLevel(level);
  };
}

const levels = [
  `
................................
.                              .
.                              .
.                              .
.                              .
.                              .
.                              .
.              ..              .
.               .              .
.      .        .              .
.               .              .
.                              .
.                              .
.                              .
.                              .
.                              .
. @                            .
................................
`,
];

const chars = {
  ' ': {
    type: 'air'
  },
  '.': {
    type: 'ground',
    solid: true
  },
  '@': {
    type: 'player'
  }
};


const readChar = (char) => {
  return chars[char];
};

const readLevel = level => {
  let player;
  let res = {};

  let lines = level
      .replace(/^\n|\n$/g, '')
      .split('\n')
      .map(_ => _.split(''));

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
      let pos = [j, i];
      let key = m.pos2key(pos);
      let char = line[j];
      char = readChar(char);
      res[key] = char;
    }
  }
  return res;
};
