// // middleware/authMiddleware.js
// import jwt from "jsonwebtoken";
// import Signup from "../models/UserScema.js";

// export const authMiddleware = async (req, res, next) => {
//   try {
//     // 1. Cookie se token uthao
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }
//     // 2. Token verify karo
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//     // 3. User find karo
//     const user = await Signup.findById(decoded.id).select("-password");
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     // 4. User ko req me attach karo
//     req.user = user;

//     // Next middleware/route handler chalao
//     next();
//   } catch (error) {
//     console.error("Auth error:", error.message);
//     return res.status(401).json({ message: "Authentication failed" });
//   }
// };


import jwt from "jsonwebtoken";
import Signup from "../models/UserScema.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Cookie se token uthao
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 2. Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 3. User find karo
    const user = await Signup.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 4. User ko req me attach karo
    req.user = user;

    // Next middleware/route handler chalao
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};
