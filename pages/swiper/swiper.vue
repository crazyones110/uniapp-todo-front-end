<template>
	<view class="wrapper">
    <div class="small-wrapper">
      <uni-swipe-action>
        <view class="margin-wrapper" v-for="todo in todoList" :key="todo.createTime">
          <uni-swipe-action-item :options="options1" @click="bindClick" :todo="todo">
            <view class="cont">
              <view class="checkbox-wrapper" style="width: 10px;height: 10px;border-radius: 50%;border: 1px solid red;">
              </view>
              <view class="content">
                {{todo.content}}
              </view>
            </view>
          </uni-swipe-action-item>
          
        </view>
      </uni-swipe-action>
      
    </div>
    <textarea value="" placeholder="" v-if="isShow" id="temp"/>
	</view>
</template>

<script>
	import swiperAction from '../../components/swiperAction'
  import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
  import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		components: {
			swiperAction,
      uniSwipeAction,
      uniSwipeActionItem
		},
		data() {
			return {
				textValue: '',
        options1: [{
        	text: '取消置顶'
        }],
        isShow: false,
        todoList: [
          {
            createTime: 123,
            content: '今晚打老虎',
            checked: false,
            deleted: false
          },
          {
            createTime: 12345,
            content: '今晚打麻将a啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊阿啊啊啊啊啊啊啊',
            checked: false,
            deleted: false
          }
        ]
			}
		},
		methods: {
      getDOM() {
        return new Promise((resolve, reject) => {
          const query = uni.createSelectorQuery().in(this);
          // query.select('.swiper-content2').boundingClientRect()
          query.select('.content').fields({
            computedStyle: ['height']
          })
          query.exec(res => {
            resolve(res);
          });
        });
      },
      handleClick() {
        uni.$emit('haha', 1, 2)
      },
      bindClick(e) {
      	// uni.showToast({
      	// 	title: `点击了${e.content.text}按钮`,
      	// 	icon: 'none'
      	// })
        this.isShow = !this.isShow
        console.log(e)
      },
		},
    mounted() {
      uni.$on('haha', (data1, data2) => {
        console.log('data1', data1)
        console.log('data2', data2)
      })
    }
	}
</script>

<style lang="scss" scoped>
 
  #temp {
    height: 100vh;
    background-color: #eee;
    width: 100vw;
  }



	.cont {
		flex: 1;
    flex-shrink: 0;
		height: 50px;
		line-height: 50px;
		padding: 15px 15px;
		position: relative;
		background-color: #fff;
		font-size: 16px;
		border-bottom-color: #F5F5F5;
		border-bottom-width: 1px;
		border-bottom-style: solid;
    display: flex;
    // align-items: center;
    border: 1px solid red;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
	}
  uni-swipe-action-item{
    margin-bottom: 20px;
  }
  .wrapper {
    display: flex;
    justify-content: center;
    .small-wrapper {
      width: 80vw;
    }
    }
  .margin-wrapper {
    margin-bottom: 20px;
  }
</style>