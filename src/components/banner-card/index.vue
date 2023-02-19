<template>
  <div class="card">
    <div class="card-title">
      <img src="@/assets/images/title-icon.png" class="icon" alt="" />
      <span>{{ props.title || '-' }}</span>
    </div>

    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['title'])
</script>

<style lang="less" scoped>
.card {
  background: #fff;
  &-title {
    display: flex;
    align-items: center;
    padding: 6px 12px;

    border-radius: 4px;
    border-bottom: 2px solid #04cca4;
    background: linear-gradient(
      90deg,
      rgb(194, 239, 230) 0%,
      10.7143%,
      rgb(191, 237, 228) 21.4286%,
      60.7143%,
      rgb(167, 231, 219) 100%
    );
    span {
      color: #222;
      font-size: 20px;
      margin-left: 6px;
    }
    .icon {
      height: 36px;
    }
  }
  &-content {
    padding: 12px 12px;
  }
}
</style>
