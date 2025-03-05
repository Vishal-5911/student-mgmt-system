const path = require("path");
const fs = require('fs').promises;
const multer = require("multer");
const { Router } = require("express");
const StudentData = require("../models/studentData");
const Admin = require("../models/admin");
const { log } = require("console");

const router = Router();

// Function to format date in "dd-mm-yy_hh-hour-mm-min"
const getFormattedDate = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear());
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yy}_${hh}hour-${min}min`;
};

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('./public/uploads/'));
    },
    filename: async (req, file, cb) => {
        try {
            const student = await StudentData.findById(req.params.id);
            if (!student) {
                return cb(new Error("Student not found"), null);
            }

            const sanitizedFullName = student.fullName.replace(/\s+/g, "_");
            const formattedDate = getFormattedDate();
            const filename = `${sanitizedFullName}_${formattedDate}_${file.originalname}`;
            cb(null, filename);
        } catch (error) {
            cb(error, null);
        }
    }
});

const upload = multer({ storage: storage });

// Route to show profile picture edit page
router.get('/edit-profile/:id', async (req, res) => {
    try {
        const student = await StudentData.findById(req.params.id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.render('edit-profile', { student });
    } catch (error) {
        res.status(500).send('Error fetching student data');
    }
});

router.get('/admin-panel', async (req, res) => {
    try {
        let query = {};
        let sortOption = {};

        // Search Functionality
        if (req.query.search) {
            query = {
                $or: [
                    { fullName: { $regex: req.query.search, $options: "i" } }, // Case-insensitive search
                    { standard: { $regex: req.query.search, $options: "i" } }
                ]
            };
        }

        // Sorting Functionality
        if (req.query.sort) {
            sortOption[req.query.sort] = 1; // Sort in ascending order
        } else {
            sortOption["standard"] = 1; // Default sorting by class
        }

        const students = await StudentData.find(query).sort(sortOption);
        res.render('admin-panel', { students });
    } catch (error) {
        res.status(500).send('Error fetching students');
    }
});

router.get('/student/:id', async (req, res) => {
    try {
        const student = await StudentData.findById(req.params.id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.render('student-details', { student });
    } catch (error) {
        res.status(500).send('Error fetching student data');
    }
});


router.get('/edit/:id/:field', async (req, res) => {
    try {
        const student = await StudentData.findById(req.params.id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.render('edit', { student, field: req.params.field });
    } catch (error) {
        res.status(500).send('Error fetching student data');
    }
});

router.get("/admin-register", (req, res) => {
    res.render("admin-register");
});
router.get("/admin-login", (req, res) => {
    res.render("admin-login");
});

router.post("/admin-register", async (req, res) => {
    const { adminID, password, creator } = req.body;

    // Check if admin already exists
    const admin = await Admin.findOne({ adminID });
    if (admin) {
        return res.status(400).render("admin-register", { message: "Admin already exists" });
    }

    try {
        await Admin.create({
            adminID,
            creator,
            password,
        });
        res.redirect("/admin-login");
    } catch (error) {
        console.log(error);
        return res.render("admin-register", { message: "Something went wrong" });
    }
});


router.post("/admin-login", async (req, res) => {
    const { adminID, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ adminID });

        if (!admin) {
            return res.render("admin-login", { error: "Incorrect Email or Password" });
        }

        const token = await Admin.matchPasswordAndGenerateToken(adminID, password);
        req.session.adminID = adminID;

        return res.cookie("token", token).redirect("/admin-panel");
    } catch (error) {
        console.log(error);

        return res.render("admin-login", {
            error: "Incorrect id or Password",
        });
    }
});


router.post('/edit/:id/:field', async (req, res) => {
    try {
        let updateData = {};
        updateData[req.params.field] = req.body.newValue;

        await StudentData.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.redirect(`/student/${req.params.id}`);
    } catch (error) {
        res.status(500).send('Error updating student data');
    }
});

// Handle profile picture upload
router.post('/edit-profile/:id', upload.single('profileImage'), async (req, res) => {
    try {
        console.log("Received request to update profile image");
        console.log("File:", req.file);
        console.log("Body:", req.body);

        // Check if student exists
        const student = await StudentData.findById(req.params.id);
        if (!student) {
            console.log("Student not found");
            return res.status(404).send('Student not found');
        }

        if (!req.file) {
            console.log("No file uploaded");
            return res.status(400).send('No file uploaded');
        }

        // ✅ Delete old profile image if it exists
        if (student.profileImageURL) {
            const oldProfileImage = path.resolve(`./public${student.profileImageURL}`);
            try {
                await fs.unlink(oldProfileImage);
                console.log(`Deleted old file: ${oldProfileImage}`);
            } catch (unlinkErr) {
                console.error(`Error deleting file: ${unlinkErr}`);
            }
        }

        // ✅ Update student record with new profile picture
        const newProfileImagePath = `/uploads/${req.file.filename}`;
        const updateResult = await StudentData.updateOne(
            { _id: req.params.id },
            { $set: { profileImageURL: newProfileImagePath } }
        );

        console.log("Update Result:", updateResult);

        if (updateResult.modifiedCount === 0) {
            console.error("MongoDB update failed");
            return res.status(500).send('Failed to update profile image in database');
        }

        res.redirect(`/student/${req.params.id}`);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error updating profile picture');
    }
});



module.exports = router;