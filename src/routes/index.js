import Router from 'koa-router'

// 1. Import all routes here!
import api from './api'

const rootRouter = new Router()

const rootRoutes = [
  // 2. Add all routes here!!
  api,
]

rootRoutes.forEach(route => {
  rootRouter.use('/', route.routes(), route.allowedMethods())
})

// Routes for test { delete later }
rootRouter.get('/', ctx => {

  return ctx.body = { msg : 'Hello' }
})

// 3. Comment this line when in production
rootRouter.stack.forEach(route => console.log(route.path))

export default rootRouter.routes()