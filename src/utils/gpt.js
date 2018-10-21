export default () => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  googletag.cmd.push(() => {
    googletag.pubads().disableInitialLoad();
    googletag.pubads().setCentering(true);
    googletag.enableServices();

    googletag.pubads().addEventListener('slotRenderEnded', (e) => {
      // freeze height of ad container so the page doesn't jump around when slots are destroyed
      const adDiv = document.querySelector(`#${e.slot.getSlotElementId()}`);
      const adFrameRect = adDiv.querySelector('iframe').getBoundingClientRect();

      adDiv.parentElement.style.height = `${adFrameRect.height}px`;
    });
  });
};
