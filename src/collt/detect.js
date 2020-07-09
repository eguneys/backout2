import * as v from '../vec2';

/*
 * Collision Manifold
 * https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331#:~:text=Collision%20resolution%20is%20the%20act,allow%20them%20to%20remain%20intersecting.&text=The%20idea%20behind%20impulse%20resolution,to%20separate%20objects%20found%20colliding.
 *
 * http://noonat.github.io/intersect/
 *
 */

export function aabbvsaabb(a, b) {

  let xNormal,
      yNormal;

  let n = v.csub(b.pos, a.pos);

  let aExtent = a.width / 2,
      bExtent = b.width / 2;

  let xOverlap = aExtent + bExtent - Math.abs(n[0]);

  // xOverlap = Math.min(xOverlap, Math.min(a.width, b.width));

  if (xOverlap > 0) {

    aExtent = a.height / 2,
    bExtent = b.height / 2;

    let yOverlap = aExtent + bExtent - Math.abs(n[1]);
    
    // yOverlap = Math.min(yOverlap, Math.min(a.height, b.height));

    if (yOverlap > 0) {

      //if (xOverlap < yOverlap) {

      xNormal = Math.sign(n[0]);
      yNormal = Math.sign(n[1]);

      return {
        xNormal,
        yNormal,
        xOverlap,
        yOverlap
      };
    }
  }

  return null;
}


export function mergeManifold(m1, m2) {

  if (m1.xNormal === m2.xNormal) {
    m1.xOverlap = Math.max(m1.xOverlap, m2.xOverlap);
  }
  if (m1.yNormal === m2.yNormal) {
    m1.yOverlap = Math.max(m1.yOverlap, m2.yOverlap);
  }
  return m1;
}
