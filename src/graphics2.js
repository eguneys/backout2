export default function Graphics(ctx, bs) {
  let { width, height } = bs;

  ctx.imageSmoothingEnabled = false;


  this.clear = () => {
    ctx.clearRect(0, 0, width, height);
  };


  // https://stackoverflow.com/questions/60684359/how-can-i-prevent-texture-bleeding-when-using-drawimage-to-draw-multiple-images
  this.drawSprite = sprite => {
    let { texture,
          bounds, 
          scale = [1, 1], 
          rotate = 0 } = sprite;

    let { frame, source } = texture;

    let scale0 = (bounds.w / frame.w);
    let scale1 = (bounds.h / frame.h);

    const scaledOffsetLeft = 0,
          scaledOffsetTop = 0;

    const destX = Math.floor(scaledOffsetLeft + 
                             (bounds.x)),
          destY = Math.floor(scaledOffsetTop +
                             (bounds.y)),
          destW = Math.ceil(frame.w * scale0),
          destH = Math.ceil(frame.h * scale1);
    
    ctx.translate(destX,
                  destY);

    ctx.scale(scale[0], scale[1]);

    ctx.rotate(rotate);

    ctx.drawImage(source, 
                  frame.x,
                  frame.y, 
                  frame.w,
                  frame.h,
                  0,
                  0,
                  destW,
                  destH);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
}
