import * as mu from 'mutilz';
import { rect } from './dquad/geometry';

export default function Bsp() {

  let minSize = [100, 100];

  const root = new BspNode(
    rect(0, 0, 320, 180),
    minSize);

  root.split();

  this.rooms = root.rooms();
}

function BspNode(area, minSize) {
  this.area = area;

  let [minSizeX,
       minSizeY] = minSize;


  let children = this.children = [];

  this.leaf = () => children.length === 0;

  const randomRoom = () => {

    let rx = mu.randInt(area.x, area.pos[0]),
        ry = mu.randInt(area.y, area.pos[1]),
        rw = mu.randInt(area.w/ 2, area.x1 - rx),
        rh = mu.randInt(area.h/ 2, area.y1 - ry);
    
    return rect(rx, ry, rw, rh);
  };

  this.rooms = () => {
    if (this.leaf()) {
      let room = randomRoom();
      return [room];
    } else {
      return this.children
        .flatMap(_ => _.rooms());
    }    
  };

  this.split = () => {
    let vertical = mu.arand([true, false]);

    if (vertical) {
      let dist = area.x1 - area.x;
      if (dist <= minSizeX * 2) {
        return;
      }

      let split_pos = mu.rand(area.x + minSizeX, area.x1 - minSizeX);

      let width1 = split_pos - area.x,
          width2 = area.x1 - split_pos;

      let area1 = rect(area.x, 
                       area.y,
                       width1,
                       area.h),
          area2 = rect(split_pos, 
                       area.y,
                       width2,
                       area.h);


      let node1 = new BspNode(area1, minSize),
          node2 = new BspNode(area2, minSize);

      children = this.children = [node1, node2];

    } else {
      let dist = area.y1 - area.y;
      if (dist <= minSizeY * 2) {
        return;
      }

      let split_pos = mu.rand(area.y + minSizeY, area.y1 - minSizeY);

      let height1 = split_pos - area.y,
          height2 = area.y1 - split_pos;

      let area1 = rect(area.x, 
                       area.y,
                       area.w,
                       height1),
          area2 = rect(area.x, 
                       split_pos,
                       area.w,
                       height2);


      let node1 = new BspNode(area1, minSize),
          node2 = new BspNode(area2, minSize);

      children = this.children = [node1, node2];
    }
  };
}
