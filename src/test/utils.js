import { makeTester } from 'testfu';

const fails = messages => ({ fails: messages });

const closeToMatcher = (actual, expected, e = 0.1) => {
  let messages = [];

  let bottom = expected - e;
  let top = expected;

  if (actual < bottom) {
    messages.push(`${actual} lower than ${expected}`);
  } else if (actual > top) {
    messages.push(`${actual} higher than ${expected}`);
  }
  
  return fails(messages);  
};

export const closeTo = makeTester(closeToMatcher);
