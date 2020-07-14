import iPol from '../ipol';
import { callMaybe } from './util';

export default function Animation(play, ctx, bs) {

  let { g } = ctx;

  let { textures, loop = true, duration = 400, bounds } = bs;

  let iFrame = new iPol(0, 0, { yoyo: loop });

  let texture = textures[0];

  let sprite = {
    texture,
    bounds,
    scale: [1, 1],
    rotate: 0
  };

  let lastTextureI = textures.length - 1;

  let playing = false;
  let hiddenOnSettled;
  let hideOnSettled;

  this.update = (delta) => {
    iFrame.update(delta / duration);


    let _vFrame = iFrame.value();


    if (playing && iFrame.settled()) {

      if (stopOnSettled && !hiddenOnSettled) {
        hiddenOnSettled = hideOnSettled;
        callMaybe(bs.onHide);
        iFrame.both(lastTextureI, lastTextureI);
      } else {
        iFrame.value(0);
      }
    }

    let vFrame = Math.round(_vFrame);

    let texture = textures[vFrame];

    if (!texture) {
      debugger;
    }

    sprite.texture = texture;
  };

  this.rotate = angle => {
    sprite.rotate = angle;
  };

  let scaleOriginOff = [0, 0];

  this.move = (x, y) => {
    bounds.move(x + scaleOriginOff[0],
                y + scaleOriginOff[1]);
  };

  this.unreversed = () => {
    this.scale(1);
    this.origin(0);
  };

  this.reversed = () => {
    this.scale(-1);
    this.origin(bounds.w);
  };

  this.origin = (x, y = 0) => {
    scaleOriginOff[0] = x;
    scaleOriginOff[1] = y;
  };

  this.scale = (x, y = sprite.scale[1]) => {
    sprite.scale[0] = x;
    sprite.scale[1] = y;
  };

  this.play = () => {
    playing = true;
    hiddenOnSettled = false;
    stopOnSettled = false;
    iFrame.both(0, lastTextureI);
  };

  let stopOnSettled;
  this.once = (_hideOnSettled) => {
    playing = true;
    hiddenOnSettled = false;
    stopOnSettled = true;
    hideOnSettled = hideOnSettled;
    iFrame.both(0, lastTextureI);
  };

  this.stop = (frame) => {
    playing = false;
    iFrame.both(frame);
  };

  this.render = () => {
    if (hiddenOnSettled) {
      return;
    }
      g.drawSprite(sprite);
  };
  
}
