<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="输入用户名搜索" size="medium" style="width: 200px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      stripe
      fit
      size="medium"
      highlight-current-row
      style="width: 100%; margin-top:20px;"
    >
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="actionDesc" label="操作类型" align="center" />
      <el-table-column prop="content" label="操作内容" align="center" />
      <el-table-column prop="ipAddress" label="IP地址" align="center" />
      <el-table-column prop="operatingTimeStr" label="操作时间" align="center" />
      <el-table-column prop="elapsedTime" label="耗时（秒）" align="center" />
      <el-table-column prop="exceptionInfo" label="异常信息" />
    </el-table>
    <!--分页组件-->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { getList } from '@/api/monitor/log'
  export default {
    name: 'ActionLog',
    components: { Pagination },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
          const data = response.data
          this.list = data.list
          this.total = data.total
          this.pageNum = data.pageNum
          this.pageSize = data.pageSize
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      }
    }
  }
</script>
