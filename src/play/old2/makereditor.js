import MakerMaker from '../makerutils';

export default function MakerEditor(play, ctx, bs) {

  let maker = this.maker = new MakerMaker();

  let cGrid = new ZoomableGrid(this, ctx, bs);

  const { g } = ctx;

  this.update = (delta) => {
    cGrid.update(delta);
  };

  this.render = () => {
    cGrid.render();
  };
  
}

function ZoomableGrid(play, ctx, bs) {

  let maker = play.maker;

  const { g } = ctx;

  this.update = (delta) => {
    
  };

  this.render = () => {
    
  };
  
}
