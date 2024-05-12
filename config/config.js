const config = {
  dialect  : 'mysql',
  host     : 'localhost',
  user     : 'maria',
  password : 'maria',
  database : 'videosdb',
  jwtSecret: 'videosecret', // for token creation and verification
};

module.exports = config;