const JWT = require("jsonwebtoken");

const secret = "aBlackCat";

function createTokenForStudent(student) {
  const payload = {
    _id: student._id,
    fullName: student.fullName,
    email: student.email,
    profileImageURL: student.profileImageURL,
    class: student.class,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForStudent,
  validateToken,
};
