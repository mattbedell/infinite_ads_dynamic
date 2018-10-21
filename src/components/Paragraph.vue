<template>
  <span>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis ut, debitis, minima repudiandae vitae impedit beatae repellendus, velit voluptatem ex id veniam dolorum vel! Explicabo dolorem vero tenetur quidem voluptatem?
    </p>
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    paragraphIndex: {
      type: Number,
      required: true,
    }
  },
}
</script>
