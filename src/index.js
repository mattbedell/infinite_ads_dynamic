import Vue from 'vue';
import App from './app.vue';
import adUnits from './config/adUnits';
import prebidInit from './utils/prebid';
import gptInit from './utils/gpt';


Vue.config.productionTip = false;
Vue.config.devtools = false;

const store = {
  paragraphCount: 10,
  // insert ad every x paragraph of array
  adComposition: [3, 7],
  // this is an arbitrary value, can be calculated using ad lifecycle
  // analytics: (median pbjs auction times, DFP response times, ad asset load times, etc)
  // we can also update this number on the fly with page-level metrics as well

  // max scroll speed at which an ad is allowed to render
  scrollSpeedMax: 30,
  // generate adSlot object based on configured adunits
  // these old info about the prebid and dfp lifecycles
  adSlots: {},
  adUnits,
  adContainers: {},
  pbjsTimeout: 3000,
};

// setup infinite scroll observer
const scrollIxObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    // inject more paragraphs
    // googletag.cmd.push(() => {
    //   googletag.pubads().updateCorrelator();
    // });
    store.paragraphCount += 10;
  }
}, {
  rootMargin: '0% 0% 50% 0%',
});

// initalize placeholder queues and service setups
gptInit();
prebidInit();

new Vue({
  data: {
    store,
  },
  mounted() {
    this.$nextTick(() => {
      // observe the scroll sentinal on mount
      scrollIxObserver.observe(document.querySelector('#scroll-sentinal'));
    });
  },
  render: h => h(App),
}).$mount('#root');
