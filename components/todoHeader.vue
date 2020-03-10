<template>
	<view>
    <!-- 状态栏 -->
		<view class="todo-header">
		  <!-- 状态栏左侧 -->
		  <view class="todo-header-left">
		    <text class="active-text">{{tabText}}</text>
		    <text>{{listData.length}}</text>
		  </view>
		  <!-- 状态栏右侧 -->
		  <view class="todo-header-right">
		    <view class="todo-header-right-item" :class="{'active-tab': activeTabIndex === 0}" @click="switchTabHeader(0)">
		      代办
		    </view>
		    <view class="todo-header-right-item" :class="{'active-tab': activeTabIndex === 1}" @click="switchTabHeader(1)">
		      已完成
		    </view>
		    <view class="todo-header-right-item" :class="{'active-tab': activeTabIndex === 2}" @click="switchTabHeader(2)">
		      全部
		    </view>
		  </view>
		</view>
		<!-- 没有数据 -->
		<view v-if="!list.length" class="default">
		  <view class="img-default">
		    <image src="../static/book.jpg" mode="aspectFit"></image>
		  </view>
		  <view class="default-info">
		    <view class="default-info-text">
		      您还木有创建任何代办事项
		    </view>
		    <view class="default-info-text">
		      点击下方+号创建一个吧
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
	export default {
		data() {
			return {
		    active: false, // 是否显示输入框
		    todoValue: '',
		    activeTabIndex: 0,
		    tabText: '代办',
		    textShow: false
			}
		},
    props: {
      list: {
        type: Array,
        required: true
      }
    },
		computed: {
      ...mapState(['tab']),
		  listData() {
		    const list = JSON.parse(JSON.stringify(this.list))
		    
		    // 点击全部
		    if (this.activeTabIndex === 0) {
          // checked = false
          this.tabText = '代办'
          return list.filter(item => !item.checked)
		    }
		    // 点击待办事项
		    if (this.activeTabIndex === 1) {
          // checked = true
          this.tabText = '已完成'
          return list.filter(item => item.checked)
		    }
		    // 点击已完成
		    if (this.activeTabIndex === 2) {
          this.tabText = '全部'
          return list
		    }
		    
		  }
		},
		methods: {
      ...mapMutations(['switchTab']),
		  switchTabHeader(index) {
		    this.activeTabIndex = index
        this.switchTab(index)
		  }
		}
	}
</script>

<style lang="scss">
$uni-box-shadow: -1px 1px 5px 0 rgba(0, 0, 0, 0.1);
  .todo-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #333333;
    height: 45px;
    box-shadow: $uni-box-shadow;
    background-color: #FFFFFF;
    padding: 0 15px;
    z-index: 10;
  }
  .todo-header-right {
    display: flex;
    margin-left: auto;
  }
  .todo-header-right-item {
    padding: 0 5px;
  }
  .active-tab {
    color: #279abf;
  }
  .active-text {
    color: #279abf;
    font-size: 14px;
    padding-right: 10px;
  }
  .default {
    padding-top: 50px;
    .img-default {
      display: flex;
      justify-content: center;
      image {
        width: 100%;
      }
    }
    .default-info {
      text-align: center;
      font-size: 14px;
      color: #ccc;
    }
  }
</style>
