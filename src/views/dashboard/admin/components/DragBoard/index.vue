<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }} {{drag?'Dragging':''}}
    </div>
    <draggable
      :list="list"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
      forceFallback="true"
      animation="1000"
      @start="onStart"
      @end="onEnd"
      @add="add"
      @sort="sort"
      :move="onMove"
    >
      <div v-for="element in list" :key="element.id" class="board-item">
        {{ element.id }}. {{ element.content }}
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { sortTodo } from '@/api/facade/todo'

export default {
  name: 'DragBoard',
  components: {
    draggable
  },
  data() {
    return {
      drag: false
    }
  },
  props: {
    workStatus: {
      type: String,
      default: '0'
    },
    headerText: {
      type: String,
      default: 'Header'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'name'
    ])
  },
  methods: {
    async sortTodo(data) {
      await sortTodo(data)
    },
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    onStart() {
      this.drag = true
    },
    onEnd() {
      this.drag = false
    },
    add({ from, to, item, clone, oldIndex, newIndex }) {
    },
    sort({ from, to, item, clone, oldIndex, newIndex }) {
      const data = {
        userId: this.userId,
        workStatus: this.workStatus,
        list: this.list
      }
      this.sortTodo(data)
    },
    // move回调方法
    onMove({ draggedContext, relatedContext }, originalEvent) {
      // console.log(e.draggedContext.element)
      // console.log(e.relatedContext.element)
    }
  }
}
</script>
<style lang="scss" scoped>
.board-column {
  min-width: 280px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #e3e3e3;
  border-radius: 3px;

  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
