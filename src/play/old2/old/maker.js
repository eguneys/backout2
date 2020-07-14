import text from '../text';
import { rect } from '../dquad/geometry';
import * as co from '../colors';
import MakerEditor from './makereditor';
import MakerPlay from './makerplay';


export default function Maker(play, ctx, pbs) {

  const { debug, width, height } = ctx.config;

  let bs = (() => {

    let screen = rect(0, 0, width, height);

    let lineW = width * 0.01;
    let line = rect(width * 0.5 - lineW * 0.5, 0, lineW, height);

    let editor = rect(0,
                      0,
                      width * 0.5 - lineW * 0.5,
                      height);

    let play = rect(width * 0.5 + lineW * 0.5,
                    0,
                    width * 0.5 - lineW * 0.5,
                    height);

    return {
      editor,
      play,
      screen,
      line,
      width,
      height
    };
  })();

  let cEditor = bounds => new MakerEditor(this, ctx, {
    bounds,
    ...bs
  });
  let cPlay = bounds => new MakerPlay(this, ctx, {
    bounds,
    ...bs
  });

  let cEditorBar = new MakerBar(this, ctx, {
    title: 'editor',
    bounds: bs.editor,
    content: cEditor,
    ...bs
  });

  let cPlayBar = new MakerBar(this, ctx, {
    title: 'play',
    bounds: bs.play,
    content: cPlay,
    ...bs
  });

  const { g } = ctx;

  this.update = (delta) => {
    cEditorBar.update(delta);
    cPlayBar.update(delta);
  };

  this.render = () => {
    g.fr(bs.line.x,
         bs.line.y,
         bs.line.width,
         bs.line.height,
         co.Gray);

    cEditorBar.render();
    cPlayBar.render();    
  };
  
}

function MakerBar(play, ctx, pbs) {

  let { content, title, bounds, width, height } = pbs;

  let bs = (() => {

    let barH = bounds.height * 0.02;
    let bar = rect(bounds.x, 
                   bounds.y + bounds.height - barH,
                   bounds.width, 
                   barH);

    let content = rect(bounds.x,
                       bounds.y,
                       bounds.width,
                       bounds.height - barH);

    return {
      bar,
      content
    };
  })();

  const { g } = ctx;

  let cContent = content(bs.content);

  this.update = (delta) => {
    cContent.update(delta);
  };

  this.render = () => {

    cContent.render();

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
