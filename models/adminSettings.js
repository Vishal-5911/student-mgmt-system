const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
    rollNumberAssignment: { type: Boolean, default: false }
});

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
