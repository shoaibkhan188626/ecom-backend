import AppError from "../utils/appError.js";

const HONEYPOT_FIELDS = ["username", "confirmPassword", "address2"];
const HONEYPOT_PATHS = [
  "/wp-admin",
  "/phpmyadmin",
  "/.env",
  "/config",
  "/admin.php",
];

const honeypot = (req, res, next) => {
  for (const field of HONEYPOT_FIELDS) {
    if (req.body?.[field]) {
      return next(new AppError("Forbidden", 403));
    }
  }

  if (HONEYPOT_PATHS.some((path) => req.originalUrl.includes(path))) {
    return next(new AppError("Forbidden", 403));
  }
  next();
};

export default honeypot;
