<template>
	<view class="wrapper">
    <uni-nav-bar 
      left-icon="back" 
      left-text="返回" 
      :title="type==='edit'?'编辑备忘录':'添加备忘录'"
      fixed
      statusBar
      @clickLeft="back"
    ></uni-nav-bar>
    <textarea 
      :value="textValue" 
      @input="textValue = $event.detail.value" 
      class="textarea" 
      @confirm="handleConfirm"
      :style="{minHeight}"
    />
    <button class="finish-memo" @click="saveMemo" id="finish-memo" :style="{bottom: `calc(${tabHeight}px + 1rem)`}">
      <text class="iconfont icon-check"></text>
    </button>
    <button class="erase-memo" @click="textValue=''" id="erase-memo" v-if="type==='add'" :style="{bottom: `calc(${tabHeight}px + 1rem + 3rem + 1rem)`}">
      <text class="iconfont icon-eraser"></text>
    </button>
    <button class="delete-memo" @click="deleteMemo" id="delete-memo" v-if="type==='edit'" :style="{bottom: `calc(${tabHeight}px + 1rem + 3rem + 1rem)`}">
      <text class="iconfont icon-delete"></text>
    </button>
	</view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
  const statusBarHeight = uni.getSystemInfoSync().statusBarHeight
  // textarea高度就是100vw-上面两个加起来，再加个透明背景图片
  const navBarHeight = 44
	export default {
    components: {
      uniNavBar
    },
		data() {
      const totalHeight = statusBarHeight + navBarHeight
			return {
				todo: null,
        textValue: '',
        type: '',
        minHeight: `calc(100vh - ${totalHeight}px)`,
        tabHeight: 0
			};
		},
    computed: {
      ...mapState(['currentMemo']),
    },
    methods: {
      ...mapMutations(['changeMemo']),
      deleteMemo() {
        uni.showModal({
          title: '确定删除备忘录吗',
          confirmText: '确定删除',
          cancelText: '取消删除',
          success: (res) => {
            if (res.confirm) {
              uni.$emit('deleteMemo', true)
              uni.$emit('changeMemo', false)
              uni.navigateBack()
              return
            }
            if (res.cancel) {
              return
            }
          }
        })
      },
      handleConfirm() {
        this.saveMemo()
      },
      back() {
        uni.showModal({
          title: '是否保存修改',
          confirmText: '保存修改',
          cancelText: this.type === 'edit' ? '取消修改' : '取消添加',
          success: (res) => {
            if (res.confirm) {
              // 写保存修改的代码
              this.saveMemo()
              return
            }
            if (res.cancel) {
              // 不保存的代码
              uni.$emit('changeMemo', false)
              uni.$emit('deleteMemo', false)
              uni.navigateBack()
              this.changeMemo('') // 这里是我改过的
              return
            }
          }
        })
      },
      saveMemo() {
        if (this.textValue === '') {
          uni.showToast({
            title: '内容不可以为空',
            icon: 'none'
          })
          return
        }
        this.changeMemo(this.textValue)
        if (this.type === 'edit') {
          uni.$emit('changeMemo', true)
          uni.$emit('deleteMemo', false)
        } else if (this.type === 'add') {
          uni.$emit('addMemo', true)
          uni.$emit('changeMemo', false)
          uni.$emit('deleteMemo', false)
        }
        uni.navigateBack()
      }
    },
    onLoad(option) {
      this.type = option.type // edit/add
      this.tabHeight = option.tabHeight
      this.textValue = this.currentMemo
    }
	}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
}
.finish-memo {
  position: fixed;
  z-index: 1000;
  right: 1rem;
  // bottom: 1rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 5px -6px rgba(0,0,0,0.75);
  &::after {
    border: none;
  }
  .icon-check {
    font-size: 24px;
    color: rgb(18, 150, 219);
  }
}
.delete-memo,.erase-memo {
  position: fixed;
  z-index: 1000;
  right: 1rem;
  // bottom: 5rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 5px -6px rgba(0,0,0,0.75);
  &::after {
    border: none;
  }
  .iconfont {
    font-size: 24px;
    color: red;
  }
}
.textarea {
  // background-color: rgb(244, 244, 244);
  background-color: white;
  width: 100vw;
  font-size: 18px;
  padding: 1rem;
}
</style>
