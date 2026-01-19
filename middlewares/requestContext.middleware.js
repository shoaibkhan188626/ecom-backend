import { randomUUID } from "crypto";

const requestContext = (req, res, next) => {
  req.context = {
    requestId: randomUUID(),
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    startedAt: Date.now(),
  };
  res.setHeader("X-Request-Id", req.context.requestId);
  next();
};

export default requestContext;
