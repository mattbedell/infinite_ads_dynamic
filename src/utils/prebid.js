import adUnits from './../config/adUnits';

export default () => {
  window.pbjs = window.pbjs || {};
  window.pbjs.que = window.pbjs.que || [];
  pbjs.que.push(() => {
    // add all adunits to prebid and run individual auctions
    // takes adavantage of pbjs 1.x caching
    pbjs.addAdUnits(adUnits);
    pbjs.onEvent('bidResponse', (bid) => {
      // debugging
    })
  });
}
