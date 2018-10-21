<template>
  <main>
    <template v-for="i in paragraphCount" >
      <Lorem
        :key="`lorem-p-${i}`"
        :paragraphIndex=i
      >
        <span style="color: red; font-size: 30px;">{{i}}</span>
      </Lorem>
      <Advertisement
        :key='`ad-container-${i}`'
        v-if="shouldInjectAd(i)"
        :adContainers="adContainers"
        :adSlots="adSlots"
        :paragraphIndex="i"
        :scrollSpeedMax="scrollSpeedMax"
        :pbjsTimeout="pbjsTimeout"
        @update-ad-ready="handleUpdateAdReady"
        @register-ad-container="handleRegisterAdContainer"
      />
    </template>
    <Sentinal
      s-id="scroll-sentinal"
      visible
    />
  </main>
</template>

<script>
import Lorem from './components/Paragraph.vue';
import Advertisement from './components/Advertisement.vue';
import Sentinal from './components/Sentinel.vue';

import adCountUtil from './utils/adCount.js';

export default {
  data() {
    return Object.assign(this.$root.store, {
      viewObserver: new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const { uid } = entry.target.dataset;

          // inform Ad it's viewable
          this.adContainers[uid] = {
            ...this.adContainers[uid],
            isViewable: entry.isIntersecting,
          }

          const adContainer = this.adContainers[uid];
          // enable ad when it intersects for the first time
          if (entry.isIntersecting) {
            adContainer.adEnabled = true;
          }
        });
      }, {
        rootMargin: '0% 0% 30% 0%',
      }),
    });
  },
  methods: {
    // determine if the paragraph count is sufficient to inject an ad
    shouldInjectAd(paragraphIndex) {
      // vue renderer memoize? else should harcode paragraph counts here
      const shouldInject = this.adComposition.reduce((bool, paragraphCount) => {
        if (paragraphIndex % paragraphCount === 0) {
          return true;
        }
        return bool;
      }, false);

      return shouldInject;
    },
    handleRegisterAdContainer(obj) {
      const { uid, containerEl } = obj;

      // register a new Advertisement container component
      this.adContainers = {
        ...this.adContainers,
        [uid]: {
          adEnabled: false,
          isViewable: false,
          containerEl: null,
          ...obj,
        },
      }

      // begin observing the component, once a container intersects it becomes 'enabled'
      this.viewObserver.observe(containerEl);
    },
    // register when a new Ad component becomes eligible to be DOM injected
    handleUpdateAdReady(obj) {
      const { containerEl, uid } = obj;

      // get current count of ads to determine which adunit to use for this ad component
      const adCount = adCountUtil.getCount();
      const adUnit = this.adUnits[adCount % this.adUnits.length];

      // update the ad registry entry with the ad's adunit
      this.adContainers[uid] = {
        ...this.adContainers[uid],
        ...adUnit,
      };

      // get the old Adverstiement component registered to the adunit and unobserve it
      const oldId = this.adSlots[adUnit.code];
      if (oldId) {
        this.viewObserver.unobserve(this.adContainers[oldId].containerEl);
      }

      // register this ad component to the adunit, this disables the previous occupant and begins it's cleanup
      // new ad component begins it's setup (slots, targeting, etc)
      this.adSlots = {
        ...this.adSlots,
        [adUnit.code]: uid,
      }

      // increment total ads so next new Ad component get assigned the correct adunit
      adCountUtil.increment();
    }
  },
  components: {
    Lorem,
    Advertisement,
    Sentinal,
  },
}
</script>

<style>
  .vis-hide {
    visibility: hidden;
  }

  .ad-container {
    background-color: ghostwhite;
  }
  .ad {
  }
</style>
