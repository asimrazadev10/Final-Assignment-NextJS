import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ message: "No token" });
  const token = header.split(" ")[1];
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}