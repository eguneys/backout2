import QuadTree from './qtree';
import { intersects } from './rect';

export default function Collt(bounds, opts) {

  let qtree = new QuadTree(bounds, opts || {});

  let collts = [];

  this.addRectangle = (data, r) => {
    let item = {
      data,
      r
    };
    collts.push(item);
    return item;
  };

  this.removeRectangle = (item) => {
    let i = collts.indexOf(item);
    if (i > -1) {
      collts.splice(i, 1);
    }
  };

  this.clear = () => {
    collts = [];
  };

  this.queryRectangles = (r) => {
    return collts;
  };

  const updateQTree = () => {
    qtree.clear();
    collts.forEach(({ r }, i) => {
      r.i = i;
      qtree.insert(r);
    });
  };

  const queryQTree = (r) => {
    return qtree.query(r)
      .map(({i}) => collts[i]);
  };

  const testCandidates = (candidates, r) =>
        candidates.filter(_ => intersects(r, _.r));

  const detectCollision = (r) => {
    let candidates = this.queryRectangles(r);
    return testCandidates(candidates, r);
  };

  const detectCollisionWithQtree = (r) => {
    let candidates = queryQTree(r);
    return testCandidates(candidates, r);
  };

  
  this.detectCollision = (r) => detectCollision(r)
    .map(_ => _.data);

  // this.lazyDetectAllCollisions = (filter) => (onCollide) => {

  //   updateQTree();

  //   collts.forEach(colt1 => {
  //     let colls = qtree.onRange(colt1.r, (({i}) => {
  //       let colt2 = collts[i];

  //       if (colt1 === colt2) { return; }

  //       if (intersects(colt1.r, colt2.r)) {
  //         if (filter(colt1.data, colt2.data)) {
  //           onCollide(colt1.data, colt2.data);
  //         }
  //       }
  //     }));
  //   });
  // };

}
