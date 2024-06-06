var db = require('diskdb');
db = db.connect('./', ['users'])

let dbService = {
  saveUser: (data) => {
    return new Promise((resolve, reject) => {
      db.users.update({ from: data.from }, data, { multi: false, upsert: true });
      return resolve(data);
    })
  },
  getUser: (from) => {
    return new Promise((resolve, reject) => {
      let busca = db.users.findOne({ from: from });
      return resolve(busca);
    })
  },
  updateUser: (from, data) => {
    console.log("\n\n Update User", data)
    return new Promise((resolve, reject) => {
      db.users.update({ from: from }, { next_flow: data.next_flow }, { multi: false, upsert: false });
      return resolve(data);
    })
  },
  setUserLastMessage: (from, last_message) => {
    return new Promise((resolve, reject) => {
      db.users.update({ from: from }, { last_message: last_message }, { multi: false, upsert: false });
      return resolve(last_message);
    })
  },

  removeUser: (from) => {
    return new Promise((resolve, reject) => {
      db.users.remove({ from: from }, true);
      return resolve(true);
    })
  },

}
module.exports = dbService;