const error404 = async (ctx, next) => {
  try {
    await next()

    if (ctx.status === 404) {
      // do somthing here

      ctx.status = 404
      ctx.set('Content-Type', 'text/plain')
      return ctx.body = 'Not found! 404'
    }
  } catch (e) {
    // handle error
    console.log(e)
    console.log('Error at error404.js')
  }

  // return ctx.body = 
}

export default error404