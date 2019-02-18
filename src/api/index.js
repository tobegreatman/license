import axios from 'axios';
import router from '../router';
import qs from 'query-string';

// 全局设置
axios.defaults.timeout = 10000; // 时间超时设置10s
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 创建一个axios的实列
const instance = axios.create();
instance.defaults.headers.post['Content-Type'] =
  'application/json;charset=UTF-8';

axios.interceptors.request.use = instance.interceptors.request.use;

// request拦截器，每次发送请求的时候拦截下来
instance.interceptors.request.use(
  config => {
    // 每次发送请求，检查 vuex 中是否有token,如果有放在headers中
    // if(store.state.user.token){
    //   config.headers.Authorization = store.state.user.token;
    // }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
)

// respone拦截器
instance.interceptors.response.use(
  response => {
    return response;
  },
  // 除了200以外的请求到这里来，，这里的200不是我们设置的那个code200,,我这里是，没有登录才会不返回200
  error => {
    let {
      response
    } = error;
    if (response != null) {
      // 这里为什么处理401错误,详见，server/untils/token check_token这个函数
      if (response.status == 401) {
        let msg = response.data || '请重新登录!';
        router.replace({ //跳转到登录页面
          path: '/login',
          // 添加一个重定向后缀，等登录以后再到这里来
          query: {
            redirect: router.currentRoute.fullPath
          }
        });
        return Promise.reject(error.response);
      }
    } else {
      console.log(error)
    }
  }
)

let rootPath = 'http://localhost:23344/licensemanage';
rootPath = '/licensemanage';
// 添加API请求
// 记住一定要配置代理，不然会返回404错误
export default {
  // 获取任务列表
  getTaskList(param) {
      return instance.get(rootPath + '/manager/tasklist', {
        params: param
      });
    },
    // 获取任务详情
    getTaskInfo(param) {
      return instance.get(rootPath + '/manager/show/' + param.code);
    },
    // 修改license
    modifyLicense(data) {
      return instance.post(rootPath + '/manager/modify', data);
    },
    // 申请license
    applyLicense(params) {
      return instance.post(rootPath + '/manager/apply', params);
    },
    // 审批license
    approvalLicense(params) {
      return instance.post(rootPath + '/manager/approval', params);
    },
    // license延期
    delayLicense(params) {
      return instance.post(rootPath + '/manager/delay', params);
    },
    // 删除license
    deleteLicense(param) {
      return instance.delete(rootPath + '/manager/delete/' + param.code);
    },
    // 下载license
    downloadLicense(param) {
      return instance.get(rootPath + '/manager/download', {
        params: param
      }, {
        responseType: 'arraybuffer'
      });
    },
    // 获取系统日志
    getSysLog(param) {
      return instance.get(rootPath + '/syslog/loglist', {
        params: param
      });
    }
}
