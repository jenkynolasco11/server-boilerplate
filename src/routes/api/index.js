import Router from 'koa-router'

// 1. Import more api routes!
import test from './route-test'

const apiRouter = new Router({ prefix : 'api/v1' })

const apiRoutes = [
  // 2. Add all the api routes here!!
  test
]

apiRoutes.forEach(route => {
  apiRouter.use('/', route.routes(), route.allowedMethods())
})

export default apiRouter