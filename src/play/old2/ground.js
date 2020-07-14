import StaticEntity from './staticentity';
import Tile from './groundtile';

export default function Ground(play, ctx, bs) {

  let backout = play.backout;

  let cTiles = backout
      .aGround
      .aTiles.map(_ => {
        let entity = new StaticEntity(_, play.worldToScreen);
        
        return new Tile(this, ctx, {
          entity,
          ...bs
        });
      });

  const { g } = ctx;

  this.update = (delta) => {
    cTiles.forEach(_ => _.update(delta));
  };

  this.render = () => {
    cTiles.forEach(_ => _.render());
  };
  
}
