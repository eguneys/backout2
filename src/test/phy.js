import { log, is } from 'testfu';
import Phy from '../phy';
import { closeTo } from './utils';


export default function PhyTest() {

  horizontal();

  vertical();

}

function vertical() {
  log('vertical physics');

  let phy = new Phy({
    tHMax: 10,
    hMax: 2
  });

  phy.vertical();

  for (let i = 0; i < 9; i++) {
    phy.update(1);
  }

  let pos = phy.pos();

  closeTo('vertical h max 2 reached after 10', pos[1], -1.9);


  phy = new Phy({
    tHMax: 40,
    hMax: 100
  });

  phy.vertical();

  for (let i = 0; i < 39; i++) {
    phy.update(1);
  }

  pos = phy.pos();

  closeTo('vertical h max 100 reached after 40', pos[1], -99.9);

  phy = new Phy({
    tHMax: 40,
    hMax: 2
  });

  phy.vertical();

  for (let i = 0; i < 20; i++) {
    phy.update(1);
  }

  pos = phy.pos();

  closeTo('vertical h max 1.5 reached after 20', pos[1], -1.5);
  

  for (let i = 0; i < 20; i++) {
    phy.update(1);
  }

  pos = phy.pos();

  closeTo('vertical h max 2 reached after 40', pos[1], -1.9);


  for (let i = 0; i < 40; i++) {
    phy.update(1);
  }

  pos = phy.pos();

  closeTo('vertical h max 0 reached after 80', pos[1], 0.01);
}

function horizontal() {
  log('horizontal');

  let phy = new Phy({
    tMax: 10,
    vMax: 2
  });

  phy.horizontal(1);

  for (let i = 0; i < 5; i++) {
    phy.update(1);
  }

  let vel = phy.vel();

  closeTo('horizontal max velocity reached', vel[0], 2);

  for (let i = 0; i < 5; i++) {
    phy.update(1);
  }

  closeTo('more updated', phy.vel()[0], 2.0, 0.01);


  phy = new Phy({
    tMax: 40,
    vMax: 100
  });
  phy.horizontal(1);

  for (let i = 0; i < 40; i++) {
    phy.update(1);
  }
  closeTo('more updated 2', phy.vel()[0], 100, 0.5);  
}
