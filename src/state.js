export default function defaults() {

  let ratio = 16 / 9,
      width = 320,
      height = width / ratio;

  return {
    debug: true,
    width,
    height,
    ratio
  };
 
}
