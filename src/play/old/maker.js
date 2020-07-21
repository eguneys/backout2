import { rect } from '../dquad/geometry';
import * as co from '../colors';
import text from '../text';

import MakerEditor from './makereditor';

export default function Maker(play, ctx, pbs) {

  let bs = (() => {
    let { width, height } = ctx.config;

    let x = 0,
        y = 0;


    let barH = height * 0.02;
    let bar = rect(x, 
                   y + height - barH,
                   width, 
                   barH);

    let content = rect(x,
                       y,
                       width,
                       height - barH);

    return {
      bar,
      content,
      width,
      height
    };
  })();

  const { g } = ctx;

  let cBar = new MakerBar(this, ctx, bs);

  let cEditor = new MakerEditor(this, ctx, bs);

  cBar.title('editor');

  this.update = (delta) => {
    cBar.update(delta);
    cEditor.update(delta);
  };

  this.render = () => {
    cBar.render();
    cEditor.render();
  };
  
}

function MakerBar(play, ctx, bs) {

  let { title = '' } = bs;

  this.title = _title => {
    title = _title;
  };

  const { g } = ctx;

  this.update = (delta) => {
  };

  this.render = () => {
    g.fr(bs.bar.x,
         bs.bar.y,
         bs.bar.width,
         bs.bar.height, co.Gray);

    let { ex: titleEndX,
          width: titleWidth,
          height: titleHeight } = text({
      x: bs.bar.x + bs.bar.width * 0.5,
      y: bs.bar.y,
      text: title,
      // halign: 'left',
      color: co.White,
    }, g);

    g.fr(bs.bar.x,
         bs.bar.y,
         bs.bar.width * 0.5 - titleWidth * 0.5,
         bs.bar.height * 0.1, co.White);

    g.fr(titleEndX,
         bs.bar.y,
         bs.bar.width * 0.5 - titleWidth * 0.5,
         bs.bar.height * 0.1, co.White);
    
  };
  
}

