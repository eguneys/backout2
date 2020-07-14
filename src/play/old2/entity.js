import * as v from '../vec2';
import { WorldSize, PlayerSize, GroundSize, TileSize } from '../butil';

export default function Entity(aEntity, camera) {

  let { worldToScreen, oUpdateView } = camera;

  this.playerSize = worldToScreen(PlayerSize);
  this.tileSize = worldToScreen(GroundSize);

  this.halfPlayerSize = v.cscale(this.playerSize, 0.5);

  this.playerTileDiff = v.csub(this.tileSize, 
                               this.playerSize);

  this.wx = 0;
  this.wy = 0;

  this.x = 0;
  this.y = 0;

  this.vx = 0;
  this.vy = 0;

  this.ax = 0;
  this.ay = 0;

  this.penX = 0;
  this.penY = 0;
  
  this.world = {
    pos: [0, 0],
    vel: [0, 0],
    acc: [0, 0],
    pen: [0, 0]
  };
  
  
  const updateView = () => {
    let pos = worldToScreen(this.world.pos, true),
        vel = worldToScreen(this.world.vel),
        acc = worldToScreen(this.world.acc),
        pen = worldToScreen(this.world.pen);

    this.wx = this.world.pos[0];
    this.wy = this.world.pos[1];

    this.x = Math.round(pos[0]);
    this.y = Math.round(pos[1]);

    this.vx = Math.round(vel[0]);
    this.vy = Math.round(vel[1]);

    this.ax = acc[0];
    this.ay = acc[1];

    this.facing = Math.sign(this.vx);

    this.penX = pen[0];
    this.penY = pen[1];
  };
      
  aEntity.oPhy.subscribe(phy => {
    v.copy(phy.pos(), this.world.pos);
    v.copy(phy.vel(), this.world.vel);
    v.copy(phy._acceleration(), this.world.acc);
    updateView();
  });

  aEntity.oPenetration.subscribe((penetration) => {
    v.copy(penetration, this.world.pen);
    updateView();
  });

  oUpdateView.subscribe(updateView);
}
