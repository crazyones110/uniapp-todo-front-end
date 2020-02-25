<template>
  <view class="list-column-wrapper">
    <view class="main-item" v-for="(todo,index) in list" :key="index" :style="{height: height+'px'}">
      <movable-area :style="{width: `calc(100% - ${actionWidth}px)`}">
        <movable-view direction="horizontal" @change="handleChange($event, index)"
          @touchend="handleTouchEnd($event, index)" @touchstart="handleTouchStart"
          :x="todo.xmove"
          :style="{margin: `auto ${-actionWidth}px auto 0`, height: height+'px'}"
          >
          <view class="content" :style="{height: height + 'px'}" :class="{'todo-finish': todo.checked}">
            <view class="todo-list-checkbox">
              <view class="checkbox" @click="finishTodo(todo.createTime)"></view>
            </view>
            <view class="todo-list-content">
              {{todo.content}}
            </view>
          </view>
        </movable-view>
      </movable-area>
      <view class="action-wrapper" :style="{width: actionWidth + 'px'}">
        <!--用tab进行判断，只有是代办的时候才有编辑按钮-->
        <view class="edit-action" @click="editClick(todo.createTime, todo.content)" v-if="tab === 0">编辑</view>
        <view class="delete-action" @click="deleteClick(todo.createTime)">删除</view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    props: ['todoList', 'actionWidth', 'height'],
    data() {
      return {
        startX: 0,
        oldxMove: 0,
        temp: true
      }
    },
    computed:{
      ...mapState(['tab']),
      list() {
        return this.todoList.map(todo => {
          return {
            ...todo,
            xmove: 0
          }
        })
      },
      length() {
        return this.todoList.length
      }
    },
    methods: {
      /**
       * 显示删除按钮
       */
      showDeleteButton: function(index) {
        // let productIndex = e.currentTarget.dataset.productindex
        this.setXmove(index, -this.actionWidth)
      },

      /**
       * 隐藏删除按钮
       */
      hideDeleteButton: function(index) {
        // let productIndex = e.currentTarget.dataset.productindex

        this.setXmove(index, 0)
      },

      /**
       * 设置movable-view位移
       */
      setXmove: function(index, xmove) {
        this.$set(this.list, index, {
          ...this.list[index],
          xmove: this.oldxMove
        })
        
        this.$nextTick(() => {
          this.$set(this.list, index, {
            ...this.list[index],
            xmove
          })
        })
      },
      handleChange(e, index) {
        this.oldxMove = e.detail.x
        // if (e.detail.source === 'friction') { // 只有在inertia开启的情况下才有
        //   if (e.detail.x < -this.actionWidth/2) {
        //     console.log('friction show')
        //     this.showDeleteButton(index)
        //   } else {
        //     console.log('friction hide')
        //     this.hideDeleteButton(index)
        //   }
        // } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
        //   console.log(e.detail.source, e.detail.x)
        //   this.hideDeleteButton(index)
        // }
      },
      handleTouchStart(e) {
        this.startX = e.touches[0].pageX
      },
      handleTouchEnd(e, index) {
        if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -this.actionWidth/2) {
          // 左滑且滑动超出30px
          this.showDeleteButton(index)
        } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < this.actionWidth/2) {
          // 右滑且滑动没超过30px
          this.showDeleteButton(index)
        } else {
          // 其余情况皆隐藏
          this.hideDeleteButton(index)
        }
      },
      editClick(todoCreateTime, todoContent) {
        this.$emit('editTodo', {todoCreateTime, todoContent})
      },
      deleteClick(todoCreateTime, todoContent) {
        this.$emit('deleteTodo', {todoCreateTime})
      },
      finishTodo(todoCreateTime) { // 改
        this.$emit('finishTodo', { todoCreateTime })
      }
    },
    mounted() {
      console.log('actionList组件', this.list)
    }
  }
</script>

<style lang="scss" scoped>
  .list-column-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    // align-items: center;
  }

  .main-item {
    // display: flex;
    margin-bottom: 15px;
    // position: relative;
    display: flex;
    width: 100%;
    color: #0c3854;
    border-radius: 10px;
    box-shadow: -1px 1px 5px 0 rgba(0, 0, 0, 0.1), -1px 2px 1px 0 white inset;
    overflow: hidden;
    background-color: #cfebfd;
    // &::after {
    //   position: absolute;
    //   content: '';
    //   top: 0;
    //   left: 0;
    //   bottom: 0;
    //   width: 5px;
    //   background-color: #91d1e8;
    // }

    // flex-direction: row;
    // background-color: red;
    movable-area {
      // width: calc(100vw - 50px);
      // height: 80px;
      // background-color: blue;
      height: 100%;

      movable-view {
        // width: 100vw;
        // margin: auto;
        width: auto;
        display: block;
        height: auto; // 这条是为了覆盖自带的 height:10px
        top: 0; // 这一行和下面的一行可以不要
        left: 0;
        right: 0;
        // background-color: yellow;
        z-index: 99;
        .content {
          background-color: #cfebfd;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          &::after {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            bottom: 0;
            width: 5px;
            background-color: #91d1e8;
          }
          &.todo-finish::after {
            background-color: #ccc;
          }
          &.todo-finish .checkbox {
            background-color: #eee;
            position: relative;
            &::after {
              content: '';
              position: absolute;
              width: 10px;
              height: 10px;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              background-color: #cfebfd;
              border-radius: 50%;
              box-shadow: 0 0 2px 0px rgba(0, 0, 0, 0.2) inset;
            }
          }
          .todo-list-checkbox {
            padding: 0 10px 0 15px;
            .checkbox {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: white;
              box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
            }
          }
          .todo-list-content {
            word-break: break-all;
            overflow: hidden;
            display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
          }
        }
      }
    }

    .action-wrapper {
      // font-size: 8px;
      height: 100%;
      background-color: red;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      .edit-action,.delete-action {
        @include flex-center()
      }
    }
  }
</style>
