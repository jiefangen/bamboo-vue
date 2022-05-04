<template>
  <div class="app-container">
    <el-container>
      <el-header>经典小游戏 -- 扫雷</el-header>
      <el-container>
        <el-aside width="140px">
          <el-button type="info" style="width: 140px;">游戏级别</el-button>
          <el-button id="level" type="success" style="margin-top: 30px;" @click="choseLevel('简单')">
            简单
          </el-button>
          <el-button id="level" type="warning" @click="choseLevel('困难')">
            困难
          </el-button>
          <el-button id="level" type="danger" @click="choseLevel('专家')">
            专家
          </el-button>
        </el-aside>
        <el-container>
          <el-main>
            <mine-sweeping v-if="showGame" :show-game.sync="showGame" :game-info="gameInfo" />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MineSweeping from './components/MineSweeping'
export default {
  name: 'Minesweeper',
  components: {
    MineSweeping
  },
  data() {
    return {
      // 是否展示游戏盘
      showGame: true,
      // 游戏盘格子数和雷数
      gameInfo: [],
      // 游戏级别
      level: [
        {
          text: '简单',
          value: [9, 9, 10]
        }, {
          text: '困难',
          value: [16, 16, 40]
        }, {
          text: '专家',
          value: [30, 16, 99]
        }
      ]
    }
  },
  created() {
    this.choseLevel('专家')
  },
  methods: {
    // 选择级别
    choseLevel(level) {
      this.showGame = false
      this.level.forEach(item => {
        if (item.text === level) {
          this.gameInfo = item.value
        }
      })
      this.$nextTick(() => {
        // 在DOM中添加mine-sweeping组件
        this.showGame = true
      })
    }
  }
}
</script>

<style>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  font-size: large;
  font-weight: bolder;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 60px;
}

#level {
  width: 100px;
  margin-left: -5px;
}

.el-main {
  overflow-y: hidden;
  background-color: #E9EEF3;
  /*background-color: #7c7b7b;*/
  color: #333;
  height: 610px;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
