import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非http开头许拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2. 请求超时,默认60s
    options.timeout = 10000 // 单位ms
    // 3. 添加小程序端请求头标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // 4. 添加token请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
    console.log(options)
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

interface Data<T> {
  code: string
  msg: string
  result: T
}
// 2.2 添加类型,支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  // 1. 返回 promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 2. 请求成功
      success(res) {
        // 判断状态码,是否成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取额核心数据 res.data
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          //  401 清理用户信息, 跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' }) // 跳转到登录页面
          reject(res)
        } else {
          // 其他错误, 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误,换个网络试试',
        })
        reject(err)
      },
    })
  })
}
