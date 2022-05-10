<template>
  <div class="dashboard-admin-container">
    <div class="board">
      <drag-board
        :key="1"
        :list="workTasks.todoList"
        :group="group"
        class="kanban todo"
        work-status="1"
        header-text="Todo"
      />
      <drag-board
        :key="2"
        :list="workTasks.workingList"
        :group="group"
        class="kanban working"
        work-status="2"
        header-text="Working"
      />
      <drag-board
        :key="3"
        :list="workTasks.doneList"
        :group="group"
        class="kanban done"
        work-status="3"
        header-text="Done"
      />
      <drag-board
        :key="4"
        :list="workTasks.discardList"
        :group="group"
        class="kanban discard"
        work-status="4"
        header-text="Discard"
      />
    </div>
  </div>
</template>
<script>
import DragBoard from './components/DragBoard'
import { mapGetters } from 'vuex'
import { getTodoList } from '@/api/facade/todo'

export default {
  name: 'Dashboard',
  components: {
    DragBoard
  },
  data() {
    return {
      group: 'workTasks',
      drag: false,
      workTasks: {
        todoList: [],
        workingList: [],
        doneList: [],
        discardList: []
      }
    }
  },
  created() {
    this.getTodoList()
  },
  computed: {
    ...mapGetters([
      'userId',
      'name'
    ])
  },
  methods: {
    getTodoList() {
      getTodoList(this.userId).then(response => {
        this.workTasks = response.data
      })
    }
  }
}
</script>
<style lang="scss">
.dashboard-admin-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  min-height: 710px;
  position: relative;
}
.board {
  //width: 1000px;
  //margin-left: 10px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
  &.discard {
    .board-column-header {
      background: #5c6064;
    }
  }
}
</style>
