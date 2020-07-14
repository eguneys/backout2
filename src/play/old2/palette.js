import text from '../text';
import { rect } from '../dquad/geometry';
import * as co from '../colors';

import * as PaletteContent from './palettecontent';

export default function MakerPalette(play, ctx, bs) {

  const { g } = ctx;

  let palette = [
    {
      key: 'ground',
      content: new PaletteContent.GroundItem(this, ctx, bs),
      description: 'Red Ground',
      speed: '1'
    },
    {
      key: 'player',
      content: new PaletteContent.GroundItem(this, ctx, bs),
      description: 'Player',
      speed: '2'
    }
  ];

  let cPalette = palette.map((item, i) => {

    return new PaletteItem(this, ctx, {
      bounds: rect(
        0,
        i * bs.palette.width,
        bs.palette.width,
        bs.palette.width
      ),
      ...item,
      ...bs
    });
  });

  this.update = delta => {
    cPalette.forEach(_ => _.update(delta));
  };

  this.render = () => {
    g.fr(bs.palette.x,
         bs.palette.y,
         bs.palette.width,
         bs.palette.height,
         co.Gray);

    cPalette.forEach(_ => _.render());
  };
  
}

function PaletteItem(play, ctx, bs) {

  let { key, speed, content } = bs;

  let { bounds } = bs;

  const { g } = ctx;

  this.update = (delta) => {
    content.update(delta);
  };

  this.render = () => {
    g.fr(bounds.x,
         bounds.y,
         bounds.width,
         bounds.height,
         co.Black);

    content.render();

    text({
      x: bounds.x + bounds.width * 0.5,
      y: bounds.y + bounds.height,
      valign: 'top',
      text: speed,
      // halign: 'left',
      color: co.White,
    }, g);
  };
  
}
