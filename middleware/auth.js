/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const db = require("../db");


/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized" });
  } else {
    return next();
  }
}

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}
// end
// TO DO: FIGURE OUT WHY THIS FUNCTION DIDN"T WORK = :}

// async function ensureToFromUser(req, res, next){
//   console.log("this is in ensureTOFromU")
//   try{

//     console.log(req.user.username)

//     const result = db.query(
//       `SELECT to_username, from_username
//        FROM messages
//        WHERE to_username = $1
//        OR from_username = $1`, [req.user.username]);
      

//     if(result.rows.length !== 0){
//       return next()
//     } else {
//       return next({ status: 401, message: "Unauthorized" });
//     }

//   } catch (err){
    
//     return next({status: 401, message: "Unauthorized"});
//   }


// }



module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser
};
