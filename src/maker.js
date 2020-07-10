import { WorldSize, TileSize, nbTilesX, nbTilesY } from './butil';

let [wX, wY] = WorldSize;

function tile(x, y) {
  return {
    x, y
  };
}

export function makeLine(x, y, n) {
  let res = [];

  for (let i = 0; i < n; i++) {
    res.push(tile(x + i * TileSize, y));
  }
  return res;
}

export function makevline(x, y, n) {
  let res = [];
  for (let i = 0; i < n; i++) {
    res.push(tile(x, y + i * TileSize));
  }
  return res;
}

export function makeWorld() {
  let res = [
    ...makeLine(0, wY-TileSize * nbTilesY, nbTilesX),
    ...makeLine(0, wY - TileSize, nbTilesX),
    ...makeLine(0, wY - TileSize * 2, nbTilesX),
    // ...makeLine(wX * 0.2, wY - TileSize * 4, 3),
    ...makeLine(wX * 0.8, wY - TileSize * 4, 3),
    ...makeLine(wX * 0.5, wY - TileSize * 8, 3),
    ...makeLine(wX * 0.2, wY - TileSize * 8, 3),
    ...makevline(0, 0, nbTilesY - 2),
    ...makevline(wX - TileSize, 0, nbTilesY - 2),
    ...makevline(wX - TileSize * 2, TileSize * 2, 4)
  ];

  return res;
};
