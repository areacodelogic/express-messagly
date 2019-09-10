const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser
} = require("../middleware/auth");


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", async function(req, res, next) {
  try {
    const users = await User.all();

    return res.json({ users });
  } catch (e) {
    next(e);
  }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get(
  "/:username",
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  async function(req, res, next) {
    try {
      const passUser = req.params.username;
      const user = await User.get(passUser);

      return res.json({ user });
    } catch (e) {
      next(e);
    }
  }
);

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get(
  "/:username/to",
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  async function(req, res, next) {
    try {
      const passUser = req.params.username;
      const messages = await User.messagesTo(passUser);

      return res.json({ messages });
    } catch (e) {}
  }
);

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get(
  "/:username/from",
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  async function(req, res, next) {
    try {
      const passUser = req.params.username;
      const messages = await User.messagesFrom(passUser);

      return res.json({ messages });
    } catch (e) {}
  }
);

module.exports = router;
