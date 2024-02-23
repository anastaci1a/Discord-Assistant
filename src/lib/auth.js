// dependencies

const responder = require('@lib/responder');


// export functions

const verifyKey = (req, res, next) => {
  const accessKey = req.get('ACCESS_KEY');
  if (accessKey == process.env.ACCESS_KEY) {
    next();
  } else {
    responder(res, 401, {}, "Invalid access key.");
  }
};


// exports

module.exports = { verifyKey };
