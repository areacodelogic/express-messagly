/** User class for message.ly */

const db = require("../db");
const ExpressError = require("../expressError");
const bcrpyt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");



/** User of the site. */

class User {
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    try {
      const hashPassword = await bcrpyt.hash(password, BCRYPT_WORK_FACTOR);
      const result = await db.query(
        `INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING username, password, first_name, last_name, phone
        `,
        [username, hashPassword, first_name, last_name, phone]
      );
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    // try {
      const result = await db.query(
        `SELECT password
         FROM users 
         WHERE username = $1`,
        [username]
      );
      const user = result.rows[0];
      
      if(user === undefined){
        return false; 
      }

      if (user.length !== 0) {
        if ((await bcrpyt.compare(password, user.password)) === true) {
          return true;
        }
      }
      return false;
    // } catch (e) {
    //   throw e;
    // }
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users
       SET last_login_at = NOW()
       WHERE username = $1`,
      [username]
    );
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    try {
      const result = await db.query(
        `SELECT username, first_name, last_name, phone
         FROM users`
      );

      return result.rows.map(u => u);
    } catch (e) {
      throw e;
    }
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
         FROM users 
         WHERE username = $1`,
      [username]
    );

    return result.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    try {
      const result = await db.query(
        `SELECT messages.id, 
                messages.to_username, 
                messages.body, 
                messages.sent_at, 
                messages.read_at,
                users.username,
                users.first_name,
                users.last_name,
                users.phone
  
        FROM messages 
        JOIN users 
        ON messages.to_username = users.username
        WHERE messages.from_username = $1`,
        [username]
      );

      return result.rows.map(obj => ({
        id: obj.id,
        to_user: {
          username: obj.username,
          first_name: obj.first_name,
          last_name: obj.last_name,
          phone: obj.phone
        },
        body: obj.body,
        sent_at: obj.sent_at,
        read_at: obj.read_at
      }));
    } catch (e) {
      throw e;
    }
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    // try {
    const result = await db.query(
      `SELECT messages.id, 
                messages.from_username, 
                messages.body, 
                messages.sent_at, 
                messages.read_at,
                users.username,
                users.first_name,
                users.last_name,
                users.phone
        FROM messages 
        JOIN users 
        ON messages.from_username = users.username
        WHERE messages.to_username = $1`,
      [username]
    );

    return result.rows.map(obj => ({
      id: obj.id,
      from_user: {
        username: obj.username,
        first_name: obj.first_name,
        last_name: obj.last_name,
        phone: obj.phone
      },
      body: obj.body,
      sent_at: obj.sent_at,
      read_at: obj.read_at
    }));

    // } catch (e){
    //   throw e;
    // }
  }
}

module.exports = User;

// tooCooTue Ooloo Day "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvb0Nvb1R1ZSIsImlhdCI6MTU2ODEzMjM0OX0.jtNYs7TNInWly1q1cw2qeS6RBPhZiWJx_pcCF4bQhzQ"

//Neo13 Neo Day "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5lbzEzIiwiaWF0IjoxNTY4MTMyNDUxfQ.F9B-RfxyjWBJoScSH5fc45v1SdnSxJ5gmN20SatZpYY"