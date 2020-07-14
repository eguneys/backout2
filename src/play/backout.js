import { rect } from '../dquad/geometry';
import Backout from '../backout';

import Soul from './soul';
import Ground from './ground';
import Player from './player';

import Entity from './entity';

import WorldToScreen from './worldtoscreen';

export default function BackoutComponent(play, ctx, pbs) {

  let { g } = ctx;

  let bs = (() => {
    let { width, height } = ctx.config;

    let screen = rect(0, 0, width, height);

    return {
      screen
    };
  })();

  let backout = this.backout = new Backout();

  let worldToScreen = this.worldToScreen = new WorldToScreen(bs.screen);

  let cSoul = new Soul(this, ctx, bs);

  let cGround = new Ground(this, ctx, bs);

  let entity = new Entity(backout.aPlayer,
                          worldToScreen);

  let cPlayer = new Player(this, ctx, {
    entity,
    ...bs
  });

  this.init = () => {
    backout.userLevel(0);
  };

  this.update = (delta) => {
    cSoul.update(delta);
    backout.update(delta);

    cGround.update(delta);
    cPlayer.update(delta);
  };

  this.render = () => {
    cGround.render();
    cPlayer.render();
  };
  
}
