
export default function Canvas(element, options) {
  
  const canvas = document.createElement('canvas');
  const canvasCtx = canvas.getContext('2d');

  this.ctx = canvasCtx;

  let { width, height, ratio } = options;

  let displayWidth = element.clientWidth,
      displayHeight = element.clientHeight;

  let desiredAspectRatio = ratio;

  let desiredWidth,
      desiredHeight;

  desiredHeight = displayHeight;
  desiredWidth = Math.max(displayWidth,
                          desiredHeight *
                          desiredAspectRatio);

  if (desiredWidth > displayWidth) {
    desiredWidth = displayWidth;
    desiredHeight = desiredWidth / desiredAspectRatio;
  }


  canvas.style.width = desiredWidth + 'px';
  canvas.style.height = desiredHeight + 'px';

  canvas.width = width;
  canvas.height = height;

  this.width = desiredWidth;
  this.height = desiredHeight;
  this.aspect = this.width / this.height;

  element.append(canvas);
}
