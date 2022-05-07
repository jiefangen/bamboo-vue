import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/auth/monitor/log/page',
    method: 'post',
    data
  })
}

export default { getList }
