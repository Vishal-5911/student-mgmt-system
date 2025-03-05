const path = require("path");
const multer = require("multer");
const { createHmac, randomBytes } = require("crypto");
const { Router } = require("express");
const StudentReg = require("../models/studentReg");
const StudentData = require("../models/studentData");
const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { generateAndSendOTP } = require("../services/otp");
const session = require("express-session");


const router = Router();

const getFormattedDate = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const yy = String(now.getFullYear()); // Get last 2 digits of year
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");

  return `${dd}-${mm}-${yy}_${hh}hour-${min}min`;
};


const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.resolve(`./public/uploads/`))

  },
  filename: function (req, file, cb) {
    const fullName = req.body.fullName;
    const sanitizedFullName = fullName.replace(/\s+/g, "_");
    const formattedDate = getFormattedDate();
    const filename = `${sanitizedFullName}_${formattedDate}_${file.originalname}`;
    cb(null, filename);
  }
})

const upload = multer({ storage: storage })

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/forget-password", (req, res) => {
  res.render("forgetPass");
});
// router.get("/forget-pswd-verification", (req, res) => {
//   res.render("forget-pswd-verification");
// });
// router.get("/forget-pswd-verification1", (req, res) => {
//   res.render("forget-pswd-verification1");
// });
// router.get("/change-password", (req, res) => {
//   res.render("change-password");
// });
router.get("/student-data-form", (req, res) => {
  res.render("student-data");
})
router.get("/student-portal", async (req, res) => {
  const email = req.session.email;
  const { fullName, fathersName, mothersName, aadharNumber, profileImageURL, standard } = await StudentData.findOne({ email });
  return res.render("student-portal", {
    fullName,
    email,
    fathersName,
    mothersName,
    aadharNumber,
    standard,
    profileImageURL,
  });
})

//TO register a new student
router.post("/register", async (req, res) => {
  const { email, password, fullName } = req.body;
  const student = await StudentReg.findOne({ email });
  if (student) {
    return res
      .send(400)
      .render("register", { message: "Student already exists" });
  }

  console.log(req.body);
  try {
    await StudentReg.create({
      fullName,
      email,
      password,
    });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.render("register", { message: "Something went wrong" });
  }
});

//To login an already existing student
router.post("/login", async (req, res) => {
  const { email, password } = req.body;


  try {
    // Check if student exists
    const student = await StudentData.findOne({ email });

    if (!student) {
      return res.redirect("/student-data-form"); // Redirect to form if student data not found
    }
    const token = await StudentReg.matchPasswordAndGenerateToken(
      email,
      password,
    );
    req.session.email = email;

    return res.cookie("token", token).redirect("/student-portal");
  } catch (error) {
    return res.render("login", {
      error: "Incorrect Email or Password",
    });
  }
});

router.post("/forget-pswd-verification", async (req, res) => {
  const { email } = req.body;
  req.session.email = email;
  const student = await StudentReg.findOne({ email });
  if (!student) {
    return res.status(404).render("forget-pswd-verification", {
      message: "Student Not Found Please check your email",
    });
  }
  const myMail = "learnerpublicschool@gmail.com";
  const myPass = "wgunmunergfltwvk";
  try {
    generateAndSendOTP(email, OTP, myMail, myPass);
    res.status(200).render("forget-pswd-verification1");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending OTP");
  }
});

router.post("/forget-pswd-verification1", async (req, res) => {
  const { otp } = req.body;
  const email = req.session.email;
  console.log(email, otp);
  const otpRecord = await OTP.findOne({ email: email, otp: otp });
  console.log(otpRecord);
  try {
    if (otpRecord) {
      res.status(200).render("change-password");
      const deleteAllOtp = await OTP.deleteMany({});
    } else {
      res.status(200).render("otp-verify", {
        message: "Invalid Otp",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error verifying otp");
  }
});

// TO change password if forgoten
router.post("/change-password", async (req, res) => {
  const { password, confirmPassword } = req.body;
  const email = req.session.email;
  const student = await StudentReg.findOne({ email });
  // console.log(student.salt);
  const salt = student.salt;
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (password === confirmPassword) {
    const updateStudent = await StudentReg.updateOne(
      { email: email },
      { $set: { password: hashedPassword } },
    );
    // console.log(DBentryStudent);
  } else {
    console.log("fail");
    return res.render("change-password", {
      message: "Passwords do not match, Please try again",
    });
  }
});

router.post("/student-data-form", upload.single("profileImage"), async (req, res) => {

  const {
    fullName,
    email,
    fathersName,
    mothersName,
    aadharNumber,
    profileImageURL,
    standard,
  } = req.body;
  try {
    await StudentData.create({
      fullName,
      email,
      fathersName,
      mothersName,
      aadharNumber,
      profileImageURL: `/uploads/${req.file.filename}`,
      standard,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("student-data", { message: "Email already exists" })
  }
});

module.exports = router;