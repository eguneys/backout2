import { rect } from '../dquad/geometry';
import Backout from '../backout';

import Player from './player';

import Soul from './soul';

import Entity from './entity';
import Ground from './ground';

export default function BackoutComponent(play, ctx) {

  const { debug, width, height } = ctx.config;

  let bs = (() => {

    let screen = rect(0, 0, width, height);

    return {
      screen,
      width,
      height
    };
  })();

  const { g } = ctx;

  let backout = this.backout = new Backout();

  let cSoul = new Soul(this, ctx);

  let playerEntity = new Entity(backout.aPlayer, {
    screen: bs.screen
  });

  let cPlayer = new Player(this, ctx, {
    entity: playerEntity,
    ...bs
  });

  let cGround = new Ground(this, ctx, bs);

  this.update = (delta) => {
    backout.update(delta);
    cPlayer.update(delta);
    cSoul.update(delta);

    cGround.update(delta);
  };

  this.render = () => {
    cGround.render();
    cPlayer.render();
    cSoul.render();
  };
  
}
