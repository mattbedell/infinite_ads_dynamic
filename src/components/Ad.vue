<template>
  <div
    v-if="shouldInject"
    :id="adContainer.code"
  >
  </div>
</template>

<script>
import adCount from '../utils/adCount.js';
import getScrollSpeed from '../utils/scroll.js';

export default {
  data() {
    return {
      slot: null,
      adRequested: false,
      auctionStarted: false,
      auctionEnded: false,
    };
  },
  props: {
    adContainer: {},
    adSlots: {},
    uid: {},
    scrollSpeedMax: {},
    pbjsTimeout: {},
  },
  computed: {
    adEnabled() {
      return this.adContainer.adEnabled;
    },
    shouldInject() {
      // only allow injection if the ad is still registered to its assigned adunit
      return this.adSlots[this.adContainer.code] === this.uid && this.adEnabled;
    },
    auctionReady() {
      // once these conditions are met an auction will begin
      return this.shouldInject && !this.auctionStarted && this.adContainer.isViewable;
    },
    adRequestReady() {
      return this.shouldInject && this.auctionEnded && !this.adRequested && this.adContainer.isViewable;
    }
  },
  watch: {
    adEnabled(newVal, oldVal) {
      if (newVal && getScrollSpeed() <= this.scrollSpeedMax) {
        this.$emit('update-ad-ready', { uid: this.uid });
      }
    },
    // if this ad is elgible to be injected, set it up with gpt (slots, targeting etc)
    // if this ad becomes ineligible, tear down down its gpt
    shouldInject(newVal, oldVal) {
      googletag.cmd.push(() => {
        if (newVal) {
          const { code, adPath, mediaTypes } = this.adContainer;
          this.slot = googletag.defineSlot(adPath, mediaTypes.banner.sizes, code).addService(googletag.pubads());
          this.slot.setTargeting('adunit', code)
          googletag.display(code);
        } else {
          googletag.destroySlots([this.slot]);
          this.slot = null;
        }
      });
    },
    // begin auction if one has not been started already
    auctionReady(newVal, oldVal) {
      if (!this.auctionStarted) {
        this.auctionStarted = true;
        pbjs.que.push(() => {
          const { code } = this.adContainer;
          pbjs.requestBids({
            adUnitCodes: [code],
            timeout: this.pbjsTimeout,
            bidsBackHandler: (bids, timedOut) => {
              googletag.cmd.push(() => {
                pbjs.setTargetingForGPTAsync([code]);
                this.auctionEnded = true;
              });
            },
          })
        });
      }
    },
    // request an ad if auction completed, viewable, and injection eligible
    adRequestReady(newVal, oldVal) {
      if (newVal) {
        this.adRequested = true;
        googletag.cmd.push(() => {
          googletag.pubads().refresh([this.slot]);
        });
      }
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style>

</style>
