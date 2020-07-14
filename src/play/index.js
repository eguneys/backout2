import Backout from './backout';

export default function Play(play, ctx, bs) {

  let { g } = ctx;

  let cBackout = new Backout(this, ctx, bs);

  cBackout.init();

  this.update = (delta) => {
    cBackout.update(delta);
  };

  this.render = () => {
    g.clear();
    cBackout.render();
  };
  
}
