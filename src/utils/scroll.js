
let scrollPos = window.pageYOffset;
let scrollSpeed = 0;

const step = () => {
  scrollSpeed = Math.abs(scrollPos - window.pageYOffset);
  scrollPos = window.pageYOffset;
  requestAnimationFrame(step);
};

requestAnimationFrame(step);

export default () => scrollSpeed;
