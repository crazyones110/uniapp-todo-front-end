<template>
  <view class="wrapper">
    <todo-header :list="todoList"></todo-header>
    <div class="todolist-wrapper">
      <uni-swipe-action>
        <view class="margin-wrapper" v-for="todo in listData" :key="todo.createTime">
          <uni-swipe-action-item 
            :options="options" 
            @click="bindClick" 
            :todo="todo"
            @deleteTodo="handleDeleteTodo"
            @editTodo="handleEditTodo"
          >
            <view class="cont" :class="{'todo-finish': todo.checked}" @click="finishTodo(todo.createTime)">
              <view class="todo-list-checkbox">
                <view class="checkbox" ></view>
              </view>
              <view class="todo-list-content">
                {{todo.content}}
              </view>
            </view>
          </uni-swipe-action-item>
        </view>
      </uni-swipe-action>
    </div>
    
    <button class="add-memo" @click="addTodo">
      <text class="iconfont icon-add"></text>
    </button>

    <textarea
      placeholder="请输入新的待办事项"
      v-if="showTextarea"
      :cursor-spacing="10"
      class="todo-textarea"
      @confirm="handleConfirm"
      @input="textValue = $event.detail.value"
      :value="textValue"
      :class="{animate: showTextarea}"
      fixed
      focus
    /> <!--可以加focus-->
    <view class="click-hide" v-if="showTextarea" @click="clickHide"></view>
  </view>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import TodoHeader from "../../components/todoHeader.vue";
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
export default {
  components: {
    TodoHeader,
    uniSwipeAction,
    uniSwipeActionItem
  },
  data() {
    return {
      todoList: [
        // {
        //   createTime: 123,
        //   content: '今晚打老虎',
        //   checked: false,
        //   deleted: false
        // },
        // {
        //   createTime: 12345,
        //   content: '今晚打麻将a啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊阿啊啊啊啊啊啊啊',
        //   checked: false,
        //   deleted: false
        // }
      ],
      showTextarea: false,
      actionVisible: false,
      height: 0,
      textValue: '',
      isAddingTodo: false,
      options: [{
      	text: '取消置顶'
      }],
    };
  },
  computed: {
    ...mapState(['tab', 'isLogin']), // 0 代办，1 已完成 2 全部
    listData() {
      const list = JSON.parse(JSON.stringify(this.todoList))

      // 代办
      if (this.tab === 0) {
        return list.filter(item => !item.checked)
      }
      // 点击已完成
      if (this.tab === 1) {
        return list.filter(item => item.checked)
      }
      // 点击全部
      if (this.tab === 2) {
        return list;
      }
    }
  },
  methods: {
    ...mapMutations(['switchTab', 'changeTodoCount', 'changeRestTodoCount']),
    addTodo() {
      if (!this.isLogin) {
        uni.showToast({
          title: '请先登录',
          image: '../../static/login.png'
        })
        return
      }
      this.showTextarea = true
      this.isAddingTodo = true
    },
    handleConfirm(e) {
      this.showTextarea = false
      if (this.isAddingTodo) { // 说明这次的textarea是添加todo
        const newTodo = {
          createTime: Date.now(),
          content: this.textValue,
          checked: false,
          deleted: false
        }
        this.todoList.push(newTodo)
        uni.setStorageSync('todoCount', uni.getStorageSync('todoCount') + 1)
        uni.setStorageSync('restTodoCount', uni.getStorageSync('restTodoCount') + 1)
        this.changeTodoCount(1)
        this.changeRestTodoCount(1)
        this.textValue = ''
        this.isAddingTodo = false
        this.$http.post('/todo', newTodo, {
          header: {
            Cookie: `userId=${uni.getStorageSync('userId')}`
          }
        }).then(res => {
          if (res.data === 'Insert Success') {
            return
          }
          if (res.data === 'Insert Error') {
            uni.showToast({
              title: '服务器插入失败'
            })
          }
        })
        return
      }
      // 下面的代码是编辑todo
      this.$emit('hideTextarea', this.textValue)
      this.textValue = ''
    },
    handleInput(e) {
      this.textValue = e.detail.value
    },
    clickHide() {
      this.showTextarea = false
      this.textValue = ''
    },
    handleDeleteTodo({ todoCreateTime }) {
      const index = this.todoList.findIndex(item => item.createTime === todoCreateTime)
      const [{checked}] = this.todoList.splice(index, 1)
      console.log(checked)
      uni.setStorageSync('todoCount', uni.getStorageSync('todoCount') - 1)
      this.changeTodoCount(-1)
      if (checked === false) {
        uni.setStorageSync('restTodoCount', uni.getStorageSync('restTodoCount') - 1)
        this.changeRestTodoCount(-1)
      }
      this.$http.delete('/todo', {
        createTime: todoCreateTime
      }, {
        header: {
          Cookie: `userId=${uni.getStorageSync('userId')}`
        }
      }).then(res => {
        if (res.data === 'Delete Error') {
          uni.showToast({
            title: '服务器删除失败',
          })
          return
        }
        if (res.data === 'Delete Success') {
        }
      })
    },
    handleEditTodo({todoCreateTime, todoContent}) {
      this.textValue = todoContent
      this.showTextarea = true
      this.$once('hideTextarea', textValue => {
        const index = this.todoList.findIndex(item => item.createTime === todoCreateTime)
        const newTodo = {
          ...this.todoList[index],
          content: textValue
        }
        this.$set(this.todoList, index, newTodo)
        this.textValue = ''
        this.$http.put('/todo', newTodo, {
          header: {
            Cookie: `userId=${uni.getStorageSync('userId')}`
          }
        }).then(res => {
          if (res.data === 'Update Error') {
            uni.showToast({
              title: '服务器更新失败',
            })
            return
          }
          if (res.data === 'Update Success') {
          }
        })
      })
    },
    finishTodo(todoCreateTime) {
      const index = this.todoList.findIndex(item => item.createTime === todoCreateTime)
      const checked = this.todoList[index].checked
      if (!checked) { // 本来是未完成，变成已完成
        uni.setStorageSync('restTodoCount', uni.getStorageSync('restTodoCount') - 1)
        this.changeRestTodoCount(-1)
      } else { // 本来已完成，变成未完成
        uni.setStorageSync('restTodoCount', uni.getStorageSync('restTodoCount') + 1)
        this.changeRestTodoCount(1)
      }
      const newTodo = {
        ...this.todoList[index],
        checked: !checked
      }
      this.$set(this.todoList, index, newTodo)
      
      this.$http.put('/todo', newTodo, {
        header: {
          Cookie: `userId=${uni.getStorageSync('userId')}`
        }
      }).then(res => {
        if (res.data === 'Update Error') {
          uni.showToast({
            title: '服务器更新失败',
          })
          return
        }
        if (res.data === 'Update Success') {
        }
      })
    }
  },
  onLoad() {
    if (this.isLogin) {
      this.$http.get('/todo', {
        header: {
          Cookie: `userId=${uni.getStorageSync('userId')}`
        }
      }).then(res => {
        // res.data.forEach(this.todoList.push)
        res.data.forEach(item => this.todoList.push(item))
      })
    }
    uni.$on('loginFinished', () => {
      this.$http.get('/todo', {
        header: {
          Cookie: `userId=${uni.getStorageSync('userId')}`
        }
      }).then(res => {
        res.data.forEach(item => this.todoList.push(item))
      })
    })
  }
};
</script>

<style lang="scss" scoped>
.todolist-wrapper {
  width: 100%;
  padding: 15px;
  margin-top: 50px;
}


.add-memo {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 5px -6px rgba(0, 0, 0, 0.75);
  &::after {
    border: none;
  }
  .icon-add {
    font-size: 24px;
  }
}
.todo-textarea {
  padding: 10px;
  position: fixed;
  border: 1px solid rgb(244, 244, 244);
  box-shadow: 0px -2px 5px 3px rgba(244,244,244,0.76);
  bottom: 0;
  right: 0;
  left: 0;
  width: 100vw;
  background-color: #ffffff;
  height: 60px;
  z-index: 11;
  transform: translateY(100%);
  transition: all 300ms;
  &.animate {
    transform: translateY(0);
  }
}
.click-hide {
  $height: calc(100vh - 60px);
  position: fixed;
  height: $height;
  width: 100vw;
  bottom: $height;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0);
}
.margin-wrapper {
  margin-bottom: 15px;
}
.cont {
  flex: 1;
  flex-shrink: 0;
  height: 50px;
  padding: 15px 0 15px 15px;
  position: relative;
  background-color: #cfebfd;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: #0c3854;
  border-radius: 10px;
  box-shadow: -1px 1px 5px 0 rgba(0, 0, 0, 0.1), -1px 2px 1px 0 white inset;
  overflow: hidden;
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
  .todo-list-checkbox {
    padding: 0 10px 0 0;
    .checkbox {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: white;
      box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
    }
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
  .todo-list-content {
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
  }
}
</style>
