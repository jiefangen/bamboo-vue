import request from '@/utils/request'

export function getTodoList(userId) {
  return request({
    url: `/facade/todo/list/${userId}`,
    method: 'post'
  })
}

export function sortTodo(data) {
  return request({
    url: `/facade/todo/sortTodo`,
    method: 'post',
    data: data
  })
}

export function addTodoList(data) {
  return request({
    url: `/facade/todo/addTodo`,
    method: 'post',
    data: data
  })
}

