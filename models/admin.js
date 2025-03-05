const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForStudent } = require("../services/authentication");
//creating a new schema for a new collection to store the authentication data of users
const adminSchema = new Schema(
    {
        adminID: {
            type: String,
            required: true,
            unique: true,
        },
        creator: {
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

adminSchema.pre("save", function (next) {
    const admin = this;

    if (!admin.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(admin.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

adminSchema.static(
    "matchPasswordAndGenerateToken",
    async function (adminID, password) {
        const admin = await this.findOne({ adminID });
        if (!admin) throw new Error("User not found!");

        const salt = admin.salt;
        const hashedPassword = admin.password;

        const adminProvidedHash = createHmac("sha256", salt)
            .update(password)
            .digest("hex");

        if (hashedPassword !== adminProvidedHash)
            throw new Error("Incorrect Password");

        const token = createTokenForStudent(admin);
        return token;
    },
);

// creating a model or a collection on the basis of schmema defined
const Admin = model("admin", adminSchema);

module.exports = Admin;