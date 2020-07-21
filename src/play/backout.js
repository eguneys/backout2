import { rect } from '../dquad/geometry';
import * as m from '../map';
import Backout from '../backout';
import Camera from './camera';

export default function BackoutComponent(play, ctx, pbs) {

  const { g, events } = ctx;

  let bs = (() => {
    let { width, height } = ctx.config;

    let screen = rect(0, 0, width, height);

    return {
      screen
    };
  })();

  let backout = this.backout = new Backout();

  backout.userInit(events.data);

  let camera = new Camera(bs);

  this.update = (delta) => {
    backout.update(delta);
  };

  const fSolid = _ => _.solid;

  let { ScreenGroundSize } = camera;

  const renderTile = (key, tile) => {
    let pos = m.key2pos(key);
    pos = camera.worldToScreen(pos);
    g.fr(pos[0] * ScreenGroundSize[0],
         pos[1] * ScreenGroundSize[1], 
         ScreenGroundSize[0], 
         ScreenGroundSize[1], 2);
  };

  const renderObject = (obj) => {
    let { x, y } = obj.phy;
    let pos = camera.worldToScreen([x, y]);

    g.fr(pos[0], 
         pos[1], 
         ScreenGroundSize[0], 
         ScreenGroundSize[1], 6);
  };

  this.render = () => {

    backout.eachTile(renderTile, fSolid);

    backout.objects.forEach(renderObject);
  };
  
}
