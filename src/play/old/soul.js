export default function Soul(play, ctx, bs) {

  let backout = play.backout;

  const { g, events } = ctx;

  this.update = (delta) => {
    let { data } = events;

    backout.userActionEvent(data);


  };

  this.render = () => {};
  
}
