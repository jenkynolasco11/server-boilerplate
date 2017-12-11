import Router from 'koa-router'

// 1. Import more api routes!

const testRouter = new Router({ prefix : 'test' })

testRouter.get('/:id', async ctx => {
  const { id } = ctx.params

  try {
    if(Number(id) !== 2) return ctx.body = { ok : true, msg : 'Test route success' }

    return ctx.body = { ok : false, msg : 'Oh snap...' }
  } catch (e) {
    console.log('There is an error... Check that shit out...')
    console.log(e)
  }
  return ctx.body = null
})

export default testRouter