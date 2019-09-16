
## Inspiration and Graphics

Main inspiration and graphics engine is cloned from previous jam entry [Chroma Incident](https://github.com/Rybar/js13k2018/). Same [techniques for rendering](http://code.ryanmalm.com/JS13k_2017_postmortem) is used in this game.

### Dithering and more background patterns

Chroma Incident uses dithering for the background, I wanted the same effect but settled with stars instead. It also renders tiles with different colours based on tile type, (walls are lighter colour than the floor). I wanted to render a splash of shining colours, I part\
ly achieved that on my second game backshooter.

### Screen Shake

Screen shake effect uses code from [jackrugile](https://github.com/jackrugile/start-making-games). Effect is achieved by rotating the screen buffer, that is to be rendered. I first copy the screen buffer to effects buffer, and copy it back to screen buffer with a rotati\
on.

```
    g.renderSource = b.Effects;
    g.renderTarget = b.Screen;
    g.rspr(0, 0, width, height, width/2 + x, height/2 + y, 1, angle);
```

### 3d Rotating The Screen

I managed to make a 3d rotation version of copying the buffers to give a 3d rotation to the screen based on ball position. But I couldn't make it look good so I dropped it out.

## Rendering Text, And Text Effects


Letters are represented like this:

```
        '0': `
    .....
    .   .
    . . .
    .   .
    .....
    `
```

This tells where to fill the rectangle for a character. You can control x, y position, vertical spacing, color, and scale of the text.

```
    text({
          x: width / 2,
          y: s.ey + gap * 1.5,
          text: 'avoid paddles to hit the ball.\nuse arrow keys to control paddles.\nuse space to go faster.',
          vspacing: 8,
          color: info,
          scale: 1.8
        }, g);
```

Also this method returns the dimensions of the text, so you know exactly where to render text side by side. I also extended this method to allow for text effects such as wave and jump.


## Physics

The little dots in the middle, that ball hits are actually lines with random rotation. The first challenge was how to change the direction of the ball when hit these lines. I solved it somehow, it really doesn't matter if it's correct as long as it gives a random look t\
o the ball movement. The lines are not that visible anyway.

When the ball gets in the range of a paddle it emits a shield slowing down so it doesn't hit the paddle right away. I want this effect only when the ball goes towards the paddle. The second challenge is to detect the ball direction so don't activate this effect if the b\
all is going inwards to the play area. I asked [this question on SO](https://stackoverflow.com/questions/57518048/how-to-tell-a-position-with-a-velocity-is-going-inwards-or-outwards-of-a-rectang) that answered my question.

When the ball hits the edge screen shakes towards that edge. In order to detect the shake bias, I had to learn to use [atan2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2) function that given a vector, gives the angle of th\
e vector based on axis.
