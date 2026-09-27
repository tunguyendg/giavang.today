const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },

        emailVerified: {
            type: Boolean,
            default: false,
        },

        verificationToken: {
            type: String,
        },

        verificationExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;