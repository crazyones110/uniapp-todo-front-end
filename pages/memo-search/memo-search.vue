<template>
	<view class="page">
		<view class="search-count">
		  找到{{searchMemo.length}}条备忘录
		</view>
    <view class="search-result">
      <view class="search-result-content" v-for="memo in searchMemo" :key="memo.createTime">
        {{memo.content}}
        <view class="memo-time">{{memo.createTime | formattedYear}}</view>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchMemo: []
			};
		},
    onLoad(options) {
      this.searchMemo = JSON.parse(decodeURIComponent(options.searchMemo))
    }
	}
</script>

<style lang="scss" scoped>
.page {
  background-color: #F8F8F8;
  min-height: 100vh;
  padding: 0 15px;
  .search-count {
    color: rgb(155, 155, 155);
  }
  .search-result {
    .search-result-content {
      background-color: white;
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 10px;
      .memo-time {
        color: #aaa;
        font-size: 12px;
      }
    }
    
  }
}
</style>
