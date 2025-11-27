import User from "../models/User.js";

/**
 * Get the current user's application
 * Accessible only to 'user' role
 */
export const getApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ profile: null });

    res.json({
      profile: {
        personal_info: user.personal_info || {},
        address: user.address || {},
        other_info: user.other_info || {},
        family: user.family || {},
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Save or update the current user's application
 * Accessible only to 'user' role
 */
export const saveApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { personal_info, address, other_info, family } = req.body;

    // Ensure user objects exist before merging
    user.personal_info = {
      ...(user.personal_info || {}),
      ...(personal_info || {}),
    };
    user.address = { ...(user.address || {}), ...(address || {}) };
    user.other_info = { ...(user.other_info || {}), ...(other_info || {}) };
    user.family = { ...(user.family || {}), ...(family || {}) };

    await user.save();

    res.json({
      success: true,
      message: "Application form saved successfully",
      profile: {
        personal_info: user.personal_info,
        address: user.address,
        other_info: user.other_info,
        family: user.family,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Admin can get any user's application by ID
 * Accessible only to 'admin' role
 */
export const getUserApplicationById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      profile: {
        personal_info: user.personal_info || {},
        address: user.address || {},
        other_info: user.other_info || {},
        family: user.family || {},
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
