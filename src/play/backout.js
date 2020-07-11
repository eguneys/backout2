import { rect } from '../dquad/rect';
import Backout from '../backout';

import Player from './player';

import Soul from './soul';

import Entity from './entity';
import Ground from './ground';
import WorldToScreen from './worldtoscreen';

import FollowPlayer from './followplayer';

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

  let worldToScreen = this.worldToScreen = new WorldToScreen(bs.screen);

  let cSoul = new Soul(this, ctx);

  let playerEntity = new Entity(backout.aPlayer, worldToScreen.worldToScreen);

  let cPlayer = new Player(this, ctx, {
    entity: playerEntity,
    ...bs
  });

  let followPlayer = new FollowPlayer(playerEntity, 
                                      worldToScreen);

  let cGround = new Ground(this, ctx, bs);

  this.update = (delta) => {
    backout.update(delta);
    cPlayer.update(delta);
    cSoul.update(delta);

    cGround.update(delta);

    followPlayer.update(delta);
  };

  this.render = () => {
    cGround.render();
    cPlayer.render();
    cSoul.render();
  };
  
}
