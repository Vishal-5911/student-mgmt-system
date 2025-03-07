const { createHmac, randomBytes } = require("crypto");
const { Schema, model, models } = require("mongoose");
const { createTokenForStudent } = require("../services/authentication");
//creating a new schema for a new collection to store the authentication data of users
const studentDataSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fathersName: {
      type: String,
      required: true,
    },
    mothersName: {
      type: String,
      required: true,
    },
    aadharNumber: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      // default: "/images/default.svg",
    },

    semester: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
    },
    rollApproved: {
      type: Boolean,
      default: false,
    },
    shortAttendance: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
// creating a model or a collection on the basis of schmema defined
const StudentData = models.StudentData || model("student_Data", studentDataSchema);

module.exports = StudentData;
