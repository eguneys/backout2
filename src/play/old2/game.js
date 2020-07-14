import Backout from './backout';
//import Game from './game';

export default function GameComponent(play, ctx) {

  const { debug, width, height } = ctx.config;

  const { g } = ctx;

  let backout = new Backout(this, ctx);

  this.update = (delta) => {
    backout.update(delta);
  };

  this.render = () => {
    backout.render();
  };
  
}
