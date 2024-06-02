const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { Strategy: LocalStrategy } = require("passport-local");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
        passReqToCallBack: false,
      },
      async (email, password, done) => {
        // done(서버 실패, 성공 유저, 로직 실패)
        try {
          const exUser = await User.findOne({ where: { user_email: email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.user_password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, {
                message: "비밀번호가 일치하지 않습니다.",
                code: 1,
              });
            }
          } else {
            done(null, false, {
              message: "가입되지 않은 회원입니다.",
              code: 2,
            });
          }
        } catch (error) {
          console.log("localStrategy 서버 실패");
          console.error(error);
          done(error);
        }
      }
    )
  );
};
