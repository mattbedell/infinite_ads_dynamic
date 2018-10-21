let adCount = 0;

export default {
  increment: () => {
    adCount += 1;
  },
  decrement: () => {
    if (adCount > 0) {
      adCount -= 1;
    }
  },
  getCount: () => adCount,
};
