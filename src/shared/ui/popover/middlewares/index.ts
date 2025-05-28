export const shiftToContainer = (containerSize?: number) => ({
  name: 'shiftToContainer',
  fn: ({ x, y }: any) => {
    if (containerSize) {
      const containerOffset = (window.innerWidth - containerSize) / 2;
      return {
        x: x > containerOffset ? x : containerOffset,
        y
      };
    }
    return {
      x, y
    };
  }
});
