import AppError from "../utils/appError";

const validate = (schema) => (req, res, next) => {
  try {
    req.validate = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return next(
      new AppError(error.errors?.[0].message || "Invalid request payload", 400),
    );
  }
};
export default validate;
