<script setup lang="ts">
import { getHomeBannerAPI } from '@/services/home';
import CustomNavBar from './components/CustomNavBar.vue'
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { BannerItem } from '@/types/home';

const bannerList = ref<BannerItem[]>([])

const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}
onLoad(()=>{
  getHomeBannerData()
})

</script>

<template>
  <!-- 自定义导航 -->
  <CustomNavBar></CustomNavBar>
  <!-- 自定义轮播图 -->
  <XtxSwiper :list="bannerList"></XtxSwiper>

  <view class="index">index lalalalala</view>
</template>

<style lang="scss">
//
</style>
