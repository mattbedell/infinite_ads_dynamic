<template>
  <div class="ad-container" :id="`ad-cont-${paragraphIndex}`" :data-uid="uid">
    <Ad
      v-if="adContainer"
      :adContainer="adContainer"
      :adSlots="adSlots"
      :uid="uid"
      :scrollSpeedMax="scrollSpeedMax"
      :pbjsTimeout="pbjsTimeout"
      @update-ad-ready="handleUpdateAdReady"
    />
  </div>
</template>
<script>
import Ad from './Ad.vue';

export default {
  data() {
    return {
      uid: (Math.random() * 5).toString(36).replace('.', ''),
    }
  },
  computed: {
    adContainer() {
      return this.adContainers[this.uid];
    },
  },
  props: {
    adSlots: {},
    paragraphIndex: {},
    adContainers: {},
    scrollSpeedMax: {},
    pbjsTimeout: {},
  },
  mounted() {
    const { uid } = this;

    // register ad container when it is injected, an Ad component won't be mounted until its container is registered
    this.$emit('register-ad-container', {
      uid,
      containerEl: this.$el,
    });
  },
  methods: {
    // forward the Ad's enabled event so it can be registered and assigned an adunit
    handleUpdateAdReady(obj) {
      this.$emit('update-ad-ready', obj);
    },
  },
  components: {
    Ad,
  }
}
</script>
