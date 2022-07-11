import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import { getToken } from './auth'

const whiteList = ['/login', '/register']
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = 'Enjoy Chatting with Music'
  const hasToken = getToken()
  if (hasToken) {

  } else if (whiteList.includes(to.path)) {
    next()
  } else {
    next('/login')
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})