import passport from 'koa-passport'
import { Strategy as LocalStrategy } from 'passport-local'

// const userData = {
//   id : 1,
//   username : 'jenkynolasco11'
// }
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((user, done) => {
  try {
    const usr = { name : 'Jenky', id : 1 }

    done(null, usr)
  } catch (e) {
    done(e)
  }
})

passport.use('local', new LocalStrategy({
  usernameField : 'username',
  passwordField : 'password',

  // passReqToCallback : true,
}, ((/* ctx, */ username, password, done) => {
  // console.log(username, password)
  try {
    if(username === 'jenky' && password === '12345') return done(null, { name : 'Jenky', id : 1 } /* or user name/object *//* [, message] */)
    /* More conditions in here */
  
  return done(false, null/* [, message] */) // It's not allowed to join
  } catch (e) {
    return done(e)
  }
})))