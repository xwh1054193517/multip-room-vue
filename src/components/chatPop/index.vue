<template>
  <transition name="popup-box" mode="out-in">
    <div class="popFrame" v-if="options && options.show" :style="{
      width: `${width}px`,
      height: `${height}px`,
      top: `${top}px`,
      right: `${right}px`,
      left: `${left}px`,
      bottom: `${bottom}px`,
    }" @click.stop>
      <div class="popFrame-title">
        {{ title }}
        <slot name="header"></slot>
      </div>
      <div class="popFrame-body">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, } from 'vue';
const props = defineProps({
  title: { type: String, default: () => "标题" },
  options: { type: Object, default: () => { } },
  width: { type: Number, default: () => 350, },
  height: { type: Number, default: () => 500, },
  top: { type: Number, default: () => null, },
  right: { type: Number, default: () => null, },
  bottom: { type: Number, default: () => null, },
  left: { type: Number, default: () => null, },
})

const visible = ref(false)
function closePop(e) {

  if (props.options.show === true) {
    props.options.show = false
  }
}
onMounted(() => {
  document.addEventListener("click", closePop);
})

onBeforeUnmount(() => {
  document.removeEventListener("click", closePop);
})
</script>

<style lang="less" scoped>
@import '../../theme/theme.less';

.popFrame {
  position: absolute;
  width: 300px;
  height: 500px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: all 0.3s;
  border-radius: 10px;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 10px rgba(185, 153, 245, 0.2);
  background-color: @pop-bgcolor;

  &-title {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    padding-right: 10px;
    color: @message-text-color;
  }

  &-body {
    flex: 1;
    // height:0
    overflow: hidden;
    overflow-y: auto;
  }
}

@media screen and (max-width:480px) {
  .popFrame {
    position: absolute;
    right: 10px !important;
    left: 10px !important;
    height: 45vh !important;
    width: auto !important;
  }
}
</style>