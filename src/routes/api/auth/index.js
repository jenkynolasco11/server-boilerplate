import Router from 'koa-router'
import passport from 'koa-passport'

const authRouter = new Router({ prefix : 'auth' })

const isAuth =  (ctx, next) => {
  if(ctx.isAuthenticated()) return next()

  return ctx.redirect('/404')
}

authRouter.post('/login', ctx => {
  passport.authenticate('local', {
    successRedirect : '/api/v1/test/',
    failureRedirect : '/404',
  }, async(err, user /* , msg*/) => {
    if(err) return ctx.body = 'Error on logging in'

    if(user) {
      await ctx.login(user)

      return ctx.body = { ok : true, data : user, msg : 'You logged in' }
    }

    // ctx.status = 302
    return ctx.redirect('/404')
  })(ctx)
})

authRouter.get('/logout', isAuth, async ctx => {
  if(ctx.state.user) await ctx.logout()

  return ctx.redirect('/')
})

authRouter.get('/check-auth', ctx => {
  if(ctx.isAuthenticated()) return ctx.body = { ok : true, data : null, msg : 'User is logged in' }

  return ctx.body = { ok : false, data : null, msg : 'User is not logged in' }
})

export default authRouter