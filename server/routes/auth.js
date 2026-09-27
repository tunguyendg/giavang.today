const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const crypto = require("crypto");
const {
    sendVerificationEmail,
} = require("../services/emailService");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);


router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy user",
            });
        }

        res.json({
            user,
        });
    } catch (error) {
        console.error("Get me error:", error);

        res.status(500).json({
            message: "Không thể lấy thông tin user",
        });
    }
});

router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Thiếu verification token",
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationExpires: {
                $gt: new Date(),
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "Token không hợp lệ hoặc đã hết hạn",
            });
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;

        await user.save();

        res.json({
            message: "Xác nhận email thành công",
        });
    } catch (error) {
        console.error("Verify email error:", error);

        res.status(500).json({
            message: "Không thể xác nhận email",
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email và password là bắt buộc",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email đã được sử dụng",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const rawVerificationToken = crypto
            .randomBytes(32)
            .toString("hex");

        const verificationToken = crypto
            .createHash("sha256")
            .update(rawVerificationToken)
            .digest("hex");

        const verificationExpires =
            new Date(Date.now() + 30 * 60 * 1000);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationExpires,
        });

        const frontendUrl =
            process.env.FRONTEND_URL || "http://localhost:5173";

        const verificationUrl =
            `${frontendUrl}/verify-email?token=${rawVerificationToken}`;

        await sendVerificationEmail({
            to: user.email,
            name: user.name,
            verificationUrl,
        });

        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            message: "Không thể đăng ký user",
        });
    }
});

router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Thiếu Google credential",
            });
        }

        const ticket =
            await googleClient.verifyIdToken({
                idToken: credential,
                audience:
                    process.env.GOOGLE_CLIENT_ID,
            });

        const payload = ticket.getPayload();

        const {
            sub: googleId,
            email,
            name,
            email_verified: emailVerified,
        } = payload;

        if (!email || !googleId) {
            return res.status(400).json({
                message:
                    "Google không trả về đủ thông tin user",
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                authProvider: "google",
                emailVerified:
                    Boolean(emailVerified),
            });
        } else {
            if (!user.googleId) {
                user.googleId = googleId;
            }

            if (!user.authProvider) {
                user.authProvider = "google";
            }

            if (emailVerified) {
                user.emailVerified = true;
            }

            await user.save();
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.json({
            message:
                "Đăng nhập Google thành công",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(
            "Google login error:",
            error
        );

        return res.status(401).json({
            message:
                "Google credential không hợp lệ",
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email và password là bắt buộc",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Email hoặc password không đúng",
            });
        }

        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Vui lòng xác nhận email trước khi đăng nhập",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Email hoặc password không đúng",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Không thể đăng nhập",
        });
    }
});

module.exports = router;