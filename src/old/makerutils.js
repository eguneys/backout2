import * as fu from './futils';
import { observable } from './observable';
import { rect } from './dquad/geometry';
import { GroundSize } from './butil';

export default function MakerMaker() {

  this.aGrid = new MakerGrid();
  this.aCursor = ground(0, 0);
  
}

export function MakerGrid() {

  let tiles = this.aTiles = [];

  let oAddTile = this.oAddTile = observable(null);

  const addTile = (aabb, color) => {
    let tile = new MakerTile(aabb, color);
    tiles.push(tile);
    oAddTile.set(fu.fConstant(tile));
  };
}

export function ground(x, y) {
  return new MakerTile(rect(x, y, ...GroundSize), 'ground');
}

export function MakerTile(aabb, color) {
  this.aabb = aabb;
  this.color = color;

  this.move = (x, y) => {
    this.aabb.move(x, y);
  };
}
