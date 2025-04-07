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

router.get('/syllabus', (req, res) => {
  res.render('syllabus');
});

router.get('/faculty', (req, res) => {
  res.render('faculty');
});

router.get('/additional-info', (req, res) => {
  res.render('additional-info');
});

router.get("/student-register", (req, res) => {
  res.render("student-register");
});
router.get("/student-login", (req, res) => {
  res.render("student-login");
});
router.get("/verify-email", (req, res) => {
  res.render("verify-email", { message: "", email: "", showOtpInput: false });
});
router.get("/change-password", (req, res) => {
  res.render("change-password");
});
router.get("/student-data-form", (req, res) => {
  res.render("student-data-form");
})
router.get("/student-portal", async (req, res) => {
  try {
    // Ensure user is logged in
    if (!req.session.email) {
      return res.status(401).send("Unauthorized: Please login first.");
    }

    // Fetch student details
    const student = await StudentData.findOne({ email: req.session.email });

    if (!student) {
      return res.status(404).send("Student not found.");
    }

    return res.render("student-portal", {
      fullName: student.fullName,
      email: student.email,
      fathersName: student.fathersName,
      mothersName: student.mothersName,
      aadharNumber: student.aadharNumber,
      semester: student.semester,
      profileImageURL: student.profileImageURL || "/images/default-profile.png",
      rollNumber: student.rollNumber || "Not Assigned",
      shortAttendance: student.shortAttendance, //  For Attendance Warning
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return res.status(500).send("Internal Server Error");
  }
});


//TO register a new student
router.post("/student-register", async (req, res) => {
  const { email, password, fullName } = req.body;
  const student = await StudentReg.findOne({ email });
  if (student) {
    return res
      .render("student-register", { message: "Student already exists" });
  }

  console.log(email,password,fullName);
  try {
    await StudentReg.create({
      fullName,
      email,
      password,
    });
    res.redirect("/student-login");
  } catch (error) {
    console.log(error);
    return res.render("student-register", { message: "Something went wrong" });
  }
});

//To login an already existing student
router.post("/student-login", async (req, res) => {
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
    return res.render("student-login", {
      error: "Incorrect Email or Password",
    });
  }
});
router.post("/verify-email", async (req, res) => {
  const { email, otp } = req.body;
  req.session.email = email;
  if (email && !otp) {

    const student = await StudentData.findOne({ email });

    if (!student) {
      return res.status(404).render("verify-email", {
        message: "Student Not Found! Please check your email.",
        email: "",
        showOtpInput: false,
      });
    }

    const myMail = "learnerpublicschool@gmail.com";
    const myPass = "wgunmunergfltwvk";
    try {
      await generateAndSendOTP(email, OTP, myMail, myPass);
      return res.status(200).render("verify-email", {
        message: "OTP sent to your email!",
        email,
        showOtpInput: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("verify-email", {
        message: "Error sending OTP. Please try again later.",
        email: "",
        showOtpInput: false,
      });
    }
  }

  if (otp) {
    const email = req.session.email;
    console.log(email, otp);

    const otpRecord = await OTP.findOne({ email, otp });
    console.log(otpRecord);

    try {
      if (otpRecord) {
        await OTP.deleteMany({ email }); // Delete OTP after verification
        return res.status(200).render("change-password");
      } else {
        return res.status(200).render("verify-email", {
          message: "Invalid OTP. Try again.",
          email,
          showOtpInput: true,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).render("verify-email", {
        message: "Error verifying OTP. Please try again.",
        email: "",
        showOtpInput: false,
      });
    }
  }

  // Default render case (fix for undefined message)
  res.render("verify-email", { message: "", email: "", showOtpInput: false });
});



// router.post("/forget-pswd-verification", async (req, res) => {
//   const { email } = req.body;
//   req.session.email = email;
//   const student = await StudentReg.findOne({ email });
//   if (!student) {
//     return res.status(404).render("forget-pswd-verification", {
//       message: "Student Not Found Please check your email",
//     });
//   }
//   const myMail = "learnerpublicschool@gmail.com";
//   const myPass = "wgunmunergfltwvk";
//   try {
//     generateAndSendOTP(email, OTP, myMail, myPass);
//     res.status(200).render("forget-pswd-verification1");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error sending OTP");
//   }
// });

// router.post("/forget-pswd-verification1", async (req, res) => {
//   const { otp } = req.body;
//   const email = req.session.email;
//   console.log(email, otp);
//   const otpRecord = await OTP.findOne({ email: email, otp: otp });
//   console.log(otpRecord);
//   try {
//     if (otpRecord) {
//       res.status(200).render("change-password");
//       const deleteAllOtp = await OTP.deleteMany({});
//     } else {
//       res.status(200).render("otp-verify", {
//         message: "Invalid Otp",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("error verifying otp");
//   }
// });

// TO change password if forgoten
router.post("/change-password", async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const email = req.session.email;
console.log(email);

    // 🔴 Check if email exists in session
    if (!email) {
      return res.status(400).render("change-password", {
        message: "Session expired. Please verify your email again.",
      });
    }

    const student = await StudentReg.findOne({ email:email });

console.log(student);

    // 🔴 If student is not found
    if (!student) {
      return res.status(404).render("change-password", {
        message: "Student not found!",
      });
    }

    const salt = student.salt;

    // 🔴 Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).render("change-password", {
        message: "Passwords do not match. Please try again.",
      });
    }

    // ✅ Hash the new password
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    // ✅ Update password in database
    await StudentReg.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );

    // ✅ Clear session email to prevent reusing the verification
    req.session.email = null;

    // ✅ Redirect to login or show success message
    return res.status(200).render("student-login", {
      message: "Password changed successfully. Please log in.",
    });

  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).render("change-password", {
      message: "Internal server error. Please try again later.",
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
    semester,
  } = req.body;
  try {
    // Check if student already exists
    const existingStudent = await StudentData.findOne({ email });
    if (existingStudent) {
      return res.render("student-data-form", { message: "Email already exists" });
    }

    await StudentData.create({
      fullName,
      email,
      fathersName,
      mothersName,
      aadharNumber,
      profileImageURL: `/uploads/${req.file.filename}`,
      semester,
      rollApproved: false,
      shortAttendance: false,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("student-data-form", { message: "Something went wrong" })
  }
});

module.exports = router;