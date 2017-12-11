import Koa from 'koa'

// Important for Koa
import bodyparser from 'koa-body'
import Pug from 'koa-pug'
import serve from 'koa-static'
import cors from 'koa2-cors'

// Sessions
import session from 'koa-session'
import passport from 'koa-passport'

// Other addons
import bluebird from 'bluebird'

// Debugging
import logger from 'koa-logger'

import cfg, { sessionKey, appKeys } from './config.json'
import routes from './routes'
import error404 from './routes/error404'

// Set the global promises to bluebird's
global.Promise = bluebird.Promise

const server = async done => {
  const app = new Koa()

  try {
    // Views config
    const pug = new Pug({
      debug : false,
      pretty : false,
      compileDebug : false,
      noCache : true,   // Remove this when working on Production
      viewPath : './src/views',
      app
    })

    const sessionParams = {
      key : sessionKey,
      // ( ADD REMOTE STORE HERE ) // koa-mongoose-session
    }

    app.keys = appKeys

    app
      // ///////////////////
      // This is in case CORS doesn't work (only for development)
      // //////////////////
      /*
        .use(async(ctx, next) => {
          ctx.set('Access-Control-Allow-Origin', '*')
          ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST')
          ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

          await next()
        })
      */
      .use(cors())
      .use(serve('./public'))
      .use(bodyparser({ multipart : true }))
      .use(session(sessionParams, app))
      .use(passport.initialize())
      .use(passport.session())
      .use(logger())
      .use(error404)
      .use(routes)

      const PORT = process.env.PORT || cfg.port || 8000

      return await app.listen(PORT)

      console.log(`Server listening on port ${ PORT }`)
  } catch (e) {
    console.log(e)
    console.log()
    console.log('Something happened on the server... Exiting...')
    process.exit(1)
  }

  if(done) done()

  // return app
  return null
}

export default server