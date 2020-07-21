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
.   o                          .
.  ...                         .
.                              .
.                              .
.                              .
.                              .
.                              .
.                              .
.      .........................
.                              .
.                              .
.........................      .
.                              .
.                              .
.                             ..
................................
`,
];

const chars = {
  '.': 'ground',
  'o': 'player'
};

const readChar = (char, x, y) => {
  let type = chars[char];

  if (!type) {
    return null;
  }
  return {
    type,
    x,
    y
  };
};

const readLevel = level => {
  let player;
  let res = [];

  let lines = level
      .replace(/^\n|\n$/g, '')
      .split('\n')
      .map(_ => _.split(''));

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
      let char = line[j];
      char = readChar(char, j, i);
      if (char && char.type === 'player') {
        player = char;
      } else {
        char && res.push(char);
      }
    }
  }
  return { tiles: res, 
           player };
};
