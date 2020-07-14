import Tile from './groundtile';
import StaticEntity from './staticentity';

export default function Ground(play, ctx, bs) {

  let backout = play.backout;

  let cTiles = [];

  let { g } = ctx;

  this.update = (delta) => {
    cTiles.forEach(_ => _.update(delta));
  };

  this.render = () => {
    cTiles.forEach(_ => _.render());
  };

  backout.aGround.oTiles.subscribe(() => {
    let tiles = backout.aGround.aTiles;

    cTiles = tiles.map(_ => {
      let entity = new StaticEntity(_, play.worldToScreen);

      return new Tile(this, ctx, {
        entity,
        ...bs
      });
    });
  });
  
}
