import express from 'express';
const router = express.Router();
import UsersModel from '../models/UserScema.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

// POST: Update Google Review URL
router.post('/google-reviewurl', async (req, res) => {
    const userId = req.user.id;
    const { Url } = req.body;

    try {
        const updatedUser = await UsersModel.findOneAndUpdate(
            { _id: userId },
            { googleReviewUrl: Url },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ ok: false, msg: "User not found" });
        }

        res.json({ ok: true, msg: "Google Review URL updated", googleReviewUrl: updatedUser.googleReviewUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "Server error" });
    }
});

// GET: Fetch Google Review URL of logged-in user
router.get('/google-reviewUrl',  async (req, res) => {
    try {
        const user = await UsersModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ ok: false, msg: "User not found" });
        }
        res.status(200).json({ ok: true, msg: "Successfully fetched", googleReviewUrl: user.googleReviewUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "Server error" });
    }
});

export default router;
