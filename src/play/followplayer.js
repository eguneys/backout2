import iPol from '../ipol';

export default function FollowPlayer(aPlayer, worldToScreen) {

  let iX = new iPol(0, 0, {}), 
      iY = new iPol(0, 0, {});

  let followDuration = 300;
  
  let { x, y } = aPlayer;
  iX.both(x, x);
  iY.both(y, y);

  this.update = delta => {

    let { x, y } = aPlayer;

    iX.target(x);
    iY.target(y);


    iX.update(delta / followDuration);
    iY.update(delta / followDuration);

    let vX = iX.value(),
        vY = iY.value();

    worldToScreen.origin(vX, vY);
  };
  
}
