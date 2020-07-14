import { rect } from '../dquad/geometry';

export default function MakerEditor(play, ctx, pbs) {

  const { g } = ctx;

  let { bounds } = pbs;

  let bs = (() => {
    let { width, height } = bounds;

    return {
      width,
      height
    };
  })();


  this.update = (delta) => {

  };

  this.render = () => {
  };
  
}
