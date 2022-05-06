<template>
  <div class="minesweeper">
    <!-- 功能区 -->
    <div class="functional-content">
      <span style="margin-left: 28px">
        <el-button type="info" plain size="medium">{{ minePosition.length }}</el-button>
      </span>
      <span style="position: relative; left: 35%;">
        <el-button type="info" plain size="medium" @click="reStart">重开</el-button>
      </span>
      <span style="position:absolute; right: 28px">
        <el-button type="info" plain size="medium">{{ time }}</el-button>
      </span>
    </div>
    <!-- 游戏区 -->
    <div class="game-content">
      <div v-for="col in cols" :key="Math.random() + col" class="game-content-row">
        <span
          v-for="row in rows"
          :key="Math.random() + row"
          class="game-block"
          :class="[lattice[(col - 1) * rows + row - 1].isOpen ? 'open' : '', lattice[(col - 1) * rows + row - 1].isMark ? 'mark' : '']"
          @click.left="handleClickLattice(lattice[(col - 1) * rows + row - 1])"
          @click.right.prevent="handleSureMinePoint(lattice[(col - 1) * rows + row - 1])"
        >
          <template v-if="over === 1">
            <span v-if="lattice[(col - 1) * rows + row - 1].isMine">💣</span>
            <span v-else>{{ lattice[(col - 1) * rows + row - 1].mineNum }}</span>
          </template>
          <template v-else>
            <span v-if="lattice[(col - 1) * rows + row - 1].isMark">❤</span>
            <span v-else>{{ lattice[(col - 1) * rows + row - 1].mineNum }}</span>
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MineSweeping',
  components: {},
  props: {
    // 是否展示游戏盘
    showGame: {
      required: true,
      type: Boolean
    },
    // 游戏盘格子数和雷数
    gameInfo: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      // 横排格子数
      rows: 0,
      // 纵排格子数
      cols: 0,
      // 格子总数
      latticeNum: 0,
      // 雷点位置（找出一个少一个）
      minePosition: [],
      // 雷点位置备个份
      minePositionBake: [],
      // 格子属性
      lattice: [{
        index: 0, // 格子索引
        mineNum: 0, // 周围雷数
        isMine: false, // 是否是雷
        isOpen: false, // 是否已经被点开
        isMark: false // 是否被标记
      }],
      // 游戏是否结束： 0-未结束 1-点到雷了导致结束  2-雷点被标记完了
      over: 0,
      // 是否处于标记状态（该状态用于移动端替代PC端右键标记地雷事件）
      isMarkStatus: false,
      // 游戏计时
      time: 0,
      // 游戏计时器
      interval: null
    }
  },
  computed: {
    timeText() {
      return this.getTimeText(this.time)
    }
  },
  watch: {
    over(newVal) {
      switch (newVal) {
        case 1:
          this.$confirm('宝宝，爱心轰炸，亲亲重开哟！', '提示', {
            confirmButtonText: '亲亲',
            cancelButtonText: '哼，哥哥太坏了',
            type: 'warning'
          }).then(() => {
            this.reStart()
          })
          break
        case 2:
          // eslint-disable-next-line no-case-declarations
          const wrongMark = this.judgeWrongMark()
          if (wrongMark) {
            this.$confirm(`宝宝，有${wrongMark}个爱心标记错了哟！`, '提示', {
              confirmButtonText: '知道了，哥哥',
              cancelButtonText: '哼，我生气了',
              type: 'warning'
            }).then(() => {
              this.reStart()
            })
          } else {
            this.openAllRest()
            this.$confirm('宝宝真优秀，奖励贴贴哟！', '提示', {
              confirmButtonText: '贴贴',
              cancelButtonText: '嗯～才不要呢',
              type: 'success'
            }).then(() => {
              this.reStart()
            })
          }
          break
        default:
          break
      }
      if (newVal) {
        window.clearInterval(this.interval)
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.setTime()
    })
  },
  methods: {
    // 初始化格子盘隐藏数据
    init() {
      Object.assign(this.$data, this.$options.data())
      // 父组件带过来的格子数和雷数
      this.rows = this.gameInfo[0]
      this.cols = this.gameInfo[1]
      this.latticeNum = this.rows * this.cols
      // 获取雷点位置
      this.getMinePosition()
      // 给每个格子赋予正确的属性
      this.initLattice()
    },
    // 游戏开始计时
    setTime() {
      this.interval = setInterval(() => {
        this.time++
      }, 1000)
    },
    // 获取时间
    getTimeText(time) {
    },
    // 改变标记状态
    changeIsMarkStatus() {
      this.isMarkStatus = !this.isMarkStatus
    },
    // 随机获取雷点位置
    getMinePosition() {
      // 定义一个数组装不重复的格点
      const mineArr = []
      // 循环雷数生成不重复的雷点
      for (let n = 0; n < this.gameInfo[2]; n++) {
        const random = Math.floor(Math.random() * this.latticeNum)
        if (mineArr.indexOf(random) === -1) {
          mineArr.push(random)
        } else {
          n--
        }
      }
      this.minePosition = mineArr
      this.minePositionBake = [].concat(mineArr)
    },
    // 格子属性初始化
    initLattice() {
      const latticeArr = []
      for (let n = 0; n < this.latticeNum; n++) {
        const lattice = {
          index: n,
          isOpen: false,
          mineNum: 0,
          isMark: false
        }
        // n标记是否是雷
        lattice.isMine = this.minePosition.indexOf(n) > -1
        // 如果不是雷，计算出格子周围8个点的雷数
        if (!lattice.isMine) {
          this.getMineNumAroundLattice(lattice, n)
        }
        latticeArr.push(lattice)
      }
      this.lattice = latticeArr
    },
    // 打开所有剩下的格子
    openAllRest() {
      this.lattice.forEach(item => {
        item.isOpen = true
      })
    },
    // 获取格子周围的雷数，
    getMineNumAroundLattice(lattice, index) {
      // 先获取格子周围的有效索引
      const latticeIndexArr = this.getLatticeIndex(index)
      // 循环索引，索引值在雷点数组中的，即为雷，当前格子的雷点数加1
      latticeIndexArr.forEach(i => {
        if (this.minePosition.indexOf(i) > -1) {
          lattice.mineNum++
        }
      })
    },
    // 获取格子周围的有效索引
    getLatticeIndex(index) {
      // 0做索引不好算，按正常数字来算
      index++
      // 存索引值的变量
      const latticeIndexArr = []
      // 当前格子位于第几行
      const latticeRow = Math.ceil(index / this.rows)
      // 当前格子位于第几列（求余为0说明是最右边一列）
      const latticeCol = Math.ceil(index % this.rows) || this.rows
      // const latticeCol = Math.ceil(index % this.rows) === 0 ? this.rows : Math.ceil(index % this.rows);
      // 第一行没有上一行，不需要计算减1的行值，最后一行没有下一行，不需要计算加1的行值
      for (let i = (latticeRow === 1 ? 0 : -1); i < (latticeRow === this.cols ? 1 : 2); i++) {
        // 第一列没有左列，不需要计算减1的列值，最后一列没有右列，不需要计算加1的列值
        for (let j = (latticeCol === 1 ? 0 : -1); j < (latticeCol === this.rows ? 1 : 2); j++) {
          // 索引值 = (当前行值 + （上一行【-1】/当前行【0】/下一行【+1】） - 1【1是索引从0开始，所以需要减去】) * 每行格子数 + 当前列值 + （上一列【-1】/当前列【0】/下一列【+1】）
          const latticeIndex = (latticeRow + i - 1) * this.rows + (latticeCol + j)
          // 初始值加了1，所以索引要减去1才对
          latticeIndexArr.push(latticeIndex - 1)
        }
      }
      return latticeIndexArr
    },
    // 点了格子
    handleClickLattice(lattice) {
      // 如果置了标记状态，说明是手机端点雷的操作
      if (this.isMarkStatus) {
        this.handleSureMinePoint(lattice)
      } else {
        this.leftClick(lattice)
      }
    },
    // 左键点击
    leftClick(lattice) {
      if (this.over) {
        return false
      }
      // 是雷，提前结束战斗
      if (!lattice.isOpen && lattice.isMine) {
        lattice.isOpen = true
        this.over = 1
      } else {
        // 是数字
        if (lattice.mineNum) {
          if (!lattice.isOpen && !lattice.isMark) {
            lattice.isOpen = true
          }
        } else {
          // 是空白
          const latticeIndexArr = this.getLatticeIndex(lattice.index)
          this.showWhiteAround(lattice, latticeIndexArr)
        }
      }
    },
    // 右键确认是雷点
    handleSureMinePoint(lattice) {
      if (this.over) {
        return false
      }
      if (!lattice.isOpen) {
        lattice.isMark = true
        lattice.isOpen = true
        this.minePosition.splice(this.minePosition.indexOf(lattice.index), 1)
        this.judgeIsOver()
        // lattice.isMark = !lattice.isMark
        // if (lattice.isMark) {
        //   lattice.isOpen = true
        //   this.minePosition.splice(this.minePosition.indexOf(lattice.index), 1)
        //   this.judgeIsOver()
        // } else {
        //   this.minePosition.push(lattice.index)
        // }
      } else {
        if (lattice.isMark) {
          lattice.isMark = false
          lattice.isOpen = false
          this.minePosition.push(lattice.index)
        }
      }
    },
    // // 当前格子周围的雷点被正确找出时，双击填充周围格子
    // handleFillAround(lattice) {
    //     // 首先判断当前格子已被点开
    //     if (lattice.isOpen) {
    //         // 拿到周围有效格子索引
    //         const latticeIndexArr = this.getLatticeIndex(lattice.index);
    //         let mineAllMarked = true;
    //         // 存非雷的格子
    //         let tempLatticeIndexArr = [];
    //         // 循环格子，确认雷已全部被找出
    //         for (let i = 0; i < latticeIndexArr.length; i++) {
    //             if (this.lattice[latticeIndexArr[i]].isMine) {
    //                 if (!this.lattice[latticeIndexArr[i]].isMark) {
    //                     mineAllMarked = false;
    //                     break;
    //                 }
    //             } else {
    //                 tempLatticeIndexArr.push(latticeIndexArr[i]);
    //             }
    //         }
    //         if (mineAllMarked) {
    //             tempLatticeIndexArr.forEach(item => {
    //                 this.lattice[item - 1].isOpen = true;
    //             });
    //         }
    //     }
    // },
    // 判断游戏是否结束
    judgeIsOver() {
      this.over = this.minePosition.length === 0 ? 2 : 0
    },
    // 判断错误的标记
    judgeWrongMark() {
      let wrongMark = 0
      this.minePositionBake.forEach(item => {
        if (!this.lattice[item].isMark) {
          wrongMark++
        }
      })
      return wrongMark
    },
    // 展示周围的空白标记，直至边缘（格子边缘或者数字）
    showWhiteAround(lattice, latticeIndexArr) {
      // 避免有重复的数据停不下来，去个重
      latticeIndexArr = [...new Set(latticeIndexArr)]
      for (let i = 0; i < latticeIndexArr.length; i++) {
        const item = latticeIndexArr[i]
        // 计算一个少一个，减少循环
        latticeIndexArr.splice(i, 1)
        i--
        if (this.lattice[item].isOpen) {
          continue
        }
        this.lattice[item].isOpen = true
        if (!this.lattice[item].mineNum) {
          const arr = this.getLatticeIndex(this.lattice[item].index)
          this.showWhiteAround(this.lattice[item], latticeIndexArr.concat(arr))
        }
      }
    },
    // 重开一局
    reStart() {
      this.init()
      this.setTime()
    },
    // 改变难度
    changeLevel() {
      this.$emit('update:showGame', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 767px) {
  .minesweeper {
    .game-content-row {
      width: max-content;
    }
    .game-content {
      width: 100%;
      max-height: 80%;
      overflow: scroll;
    }
  }
}
.minesweeper {
  //border: 2px solid #c2c2c2;
  position: relative;
  top: 50%;
  transform: translateY(-50%);

  .game-content-row {
    margin: 0 auto;
    width: fit-content;
    font-size: 0;
    background-color: #7c7b7b;
    .game-block {
      display: inline-block;
      margin: 2px;
      background-color: #bebdbd;
      width: 30px;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
      font-weight: bolder;
      color: #0100f6;
      text-align: center;
      cursor: pointer;

      & > span {
        visibility: hidden;
      }

      &.open {
        background-color: #ddd;

        & > span {
          visibility: visible;
        }
      }

      &.mark {
        color: red;
      }
    }
  }

  .functional-content {
    position: relative;
    top: 0;
    margin-bottom: 8px;
    .el-button {
      width: 80px;
      font-size: 16px;
      font-weight: bolder;
      color: #ea3323;
      background: #460f0b;
    }
  }
}
</style>
