import { objForeach } from './util2';
import * as m from './map';
import Levels from './levels';
import Phy from './phy';
import Coll from './coll';
import * as butil from './butil';

export default function Backout() {
  
  let levels = new Levels();

  let objects = this.objects = [];

  let tiles;

  this.userInit = (userInput) => {
    loadLevel(0);

    this.userInput = userInput;
  };

  this.eachTile = (fn, fFlag) => {
    objForeach(tiles, (key, tile) => {
      (!fFlag || fFlag(tile)) && fn(key, tile);
    });
  };

  this.fGet = (x, y, fFlag) => {
    let key = m.pos2key([x, y]);
    return fFlag(tiles[key]);
  };

  const loadLevel = level => {
    tiles = levels.level(level);

    objForeach(tiles, (key, tile) => {
      let pos = m.key2pos(key);

      let obj;
      switch (tile.type) {
      case 'player':
        obj = new Player(this);
      }
      if (obj) {
        this.initObject(obj, pos[0], pos[1]);
      }
    });
  };

  this.initObject = (obj, x, y) => {
    objects.push(obj);
    obj.init(x * butil.TileSize, y * butil.TileSize);
    return obj;
  };

  this.destroyObject = (obj) => {
    objects.splice(objects.indexOf(obj), 1);
  };


  this.update = delta => {
    objects.forEach(_ => _.move(delta));
    objects.forEach(_ => _.update(delta));
  };

}

function Player(backout) {

  let _phy = new Phy(backout),
      phy = _phy.phy;

  this.move = _phy.move;
  this.phy = _phy.phy;

  let solidBases = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  let pJump,
      jBuffer;

  let jumpX = 0,
      jumpY = 0;

  let fallX = 0,
      fallY = 0;

  this.init = (x, y) => {
    phy.x = x;
    phy.y = y;
  };


  this.update = delta => {
    
    let { x,
          c, 
          up, 
          down,
          left,
          right } = backout.userInput;

    let inputX = left?-1:right?1:0;
    let inputY = up?-1:down?1:0;
    let inputJ = false;

    if (x) {
      inputJ = !pJump;
    }
    pJump = x;

    if (inputJ) {
      jBuffer = 4;
    } else if (jBuffer > 0) {
      jBuffer--;
    }

    let edgeOff = butil.TileSize * 0.1;
    let downSolid = _phy.isSolid(0, edgeOff),
        upSolid = _phy.isSolid(0, -edgeOff),
        leftSolid = _phy.isSolid(-edgeOff, 0),
        rightSolid = _phy.isSolid(edgeOff, 0);

    let hSolid = downSolid || upSolid,
        vSolid = leftSolid || rightSolid,
        noSolid = !hSolid && !vSolid;

    let hJDir = downSolid?-1:1,
        vJDir = rightSolid?-1:1;

    _phy.dt(delta / 16);

    if (!jumpX && (hSolid || noSolid)) {
      _phy.accelX(inputX);
      _phy.dragX();
    }

    if (!jumpY && (vSolid || noSolid)) {
      _phy.accelY(inputY);
      if (!jumpY) {
        _phy.dragY();
      }
    }

    if (!noSolid) {
      _phy.cutJump();
      jumpX = 0;
      jumpY = 0;
    }

    if (jBuffer > 0) {
      jBuffer = 0;
      if (hSolid) {
        jumpY = hJDir;
        _phy.jumpY(hJDir);
      }
      if (vSolid) {
        jumpX = vJDir;
        _phy.jumpX(vJDir);
      }
    }

    if (noSolid) {
      fallX = fallX?fallX:solidBases.left?-1:solidBases.right?1:0;
      fallY = fallY?fallY:solidBases.up?-1:solidBases.down?1:0;
    } else {
      fallX = 0;
      fallY = 0;
    }

    _phy.fallX(fallX);
    _phy.fallY(fallY);

    _phy.vel();

    solidBases.up = upSolid;
    solidBases.down = downSolid;
    solidBases.left = leftSolid;
    solidBases.right = rightSolid;
  };
}
