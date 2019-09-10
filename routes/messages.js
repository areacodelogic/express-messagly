const express = require("express")
const router = new express.Router();
const Message = require("../models/message");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config")
const ExpressError = require("../expressError");
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async function (req, res, next) {
  try {
    const messageid = req.params.id;
    const message = await Message.get(messageid);

    return res.json({ message });
  } catch (e) {
    next(e);
  };
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/",
  authenticateJWT,
  async function (req, res, next) {
    try {
      console.log(req.user.username);
      const { to_username, body } = req.body;
      const message = await Message.create({ from_username: req.user.username, to_username, body});

      return res.json({ message });
    } catch (e) {
      next(e)
    };
  });

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", async function(req, res, next) {

});


module.exports = router;


