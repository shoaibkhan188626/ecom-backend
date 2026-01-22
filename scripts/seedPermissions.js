import mongoose from "mongoose";
import User from "../models/user.model.js";
import { env } from "../config/env.js";
import { ROLE_PERMISSION } from "../config/rbac.js";

const seedPermissions = async () => {
  await mongoose.connect(env.MONGO_URI);

  const users = await User.find();

  for (const user of users) {
    const rolePermissions = ROLE_PERMISSION[user.role] || [];

    const mergedPermissions = Array.from(
      new Set([...user.permissions, ...rolePermissions]),
    );
    user.permissions = mergedPermissions;
    await user.save();
  }
  console.log("Permission seeded successfully");
  process.exit(0);
};

seedPermissions().catch((err) => {
  console.error(err);
  process.exit(1);
});
