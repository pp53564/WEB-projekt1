const createUser = async (name, email) => {
   return await db.one('INSERT INTO users(name, email) VALUES($1, $2) RETURNING id', [name, email]);
};

const getUserByEmail = async (email) => {
   return await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
};

module.exports = {
   createUser,
   getUserByEmail,
};
