const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForStudent } = require("../services/authentication");
//creating a new schema for a new collection to store the authentication data of users
const studentRegSchema = new Schema(
  {
    fullName: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

studentRegSchema.pre("save", function (next) {
  const student = this;

  if (!student.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(student.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

studentRegSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const student = await this.findOne({ email });
    if (!student) throw new Error("User not found!");

    const salt = student.salt;
    const hashedPassword = student.password;

    const studentProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== studentProvidedHash)
      throw new Error("Incorrect Password");

    const token = createTokenForStudent(student);
    return token;
  },
);

// creating a model or a collection on the basis of schmema defined
const StudentReg = model("student_Reg", studentRegSchema);

module.exports = StudentReg;
