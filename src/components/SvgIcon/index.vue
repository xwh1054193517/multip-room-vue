<template>
  <svg :class="SvgClass" :style="{ fontSize }" aria-hidden="true" v-on="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts"  setup>
import { computed } from 'vue';
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../../assets/icons/svg', false, /\.svg$/)
requireAll(req)
const props = defineProps({
  name: { type: String, required: true },
  className: { type: String, default: "" },
  scale: { type: String, default: '1' },
})
const iconName = computed(() => `#icon-${props.name}`)
const SvgClass = computed(() => {
  if (props.className) return `svg-cion ${props.className}`
  else return `svg-icon`
})
const fontSize = computed(() => `${Number(props.scale) * 8}px`)
</script>

<style lang="less" scoped>
.svg-icon {
  width: 1.1em;
  height: 1.1em;
  vertical-align: -0.1em;
  fill: currentColor;
  overflow: hidden;
}
</style>