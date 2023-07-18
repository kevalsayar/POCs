const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  CERTIFICATE_UPLOAD: process.env.CERTIFICATE_UPLOAD
};
