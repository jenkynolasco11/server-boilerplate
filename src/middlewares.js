import CORS from 'koa2-cors'
import CSRF from 'koa-csrf'

// CSRF
export const csrf = new CSRF({
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
  disableQuery: false
})

// CORS
export const cors = CORS({
  credentials : true,
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
})

// CSRF Check
// Note: Add a hidden field with name _csrf and value csrf on template
// Also, check if this actually works
export const csrfCheck = (ctx, next) => {
  if(!['GET', 'POST'].includes(ctx.method)) return next()

  if(ctx.method === 'GET') {
    ctx.body = ctx.csrf
    return
  }

  return ctx.body = 'OK'
}