import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import { createUserTokens } from "../common/services/passport-jwt.service"; // Import the token creation function
import { compare } from "bcrypt"; // Ensure you import compare from bcrypt
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

/**
 * Create a new user, save the user to the database, and send a welcome email.
 * 
 * @param {IUser} data - The user data to be created.
 * @returns {Promise<IUser>} The created user object without the password field.
 * @throws {Error} Throws an error if user creation or email sending fails.
 */
export const createUser = async (data: IUser) => {
  try {
    const user = await UserSchema.create({ ...data, active: true });
    const { password, ...userWithoutPassword } = user.toObject();
    const transporter = nodemailer.createTransport({
      service: "gmail", // Example, use your SMTP service
      auth: {
        user: process.env.EMAIL, // Use environment variable for email
        pass: process.env.EMAIL_PASSWORD, // Use environment variable for password
      },
    });
    const mailOptions = {
      from: process.env.EMAIL, // Use environment variable for sender email
      to: user.email, // Receiver's email
      subject: "Welcome to Our Platform", // Subject line
      text: `Hello ${user.name},\n\nWelcome to our platform! Your account has been successfully created.\n\nBest regards,\nTeam`,
    };
    await transporter.sendMail(mailOptions);
    console.log("User created and email sent successfully!");
    return userWithoutPassword;
  } catch (error) {
    console.error("Error creating user or sending email:", error);
    throw new Error("Error creating user or sending email");
  }
};

/**
 * Get the count of active users in the database.
 * 
 * @returns {Promise<number>} The count of active users.
 * @throws {Error} Throws an error if fetching the count fails.
 */
export const getActiveUserCount = async () => {
  try {
    const activeUserCount = await UserSchema.countDocuments({ active: true }).exec();
    return activeUserCount;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching active user count");
  }
};

/**
 * Get all users in the database.
 * 
 * @returns {Promise<IUser[]>} List of all users.
 */
export const getAllTasks = async () => {
  const result = await UserSchema.find({}).lean();
  return result;
};

/**
 * Log in a user by verifying email and password, and return user data with tokens.
 * 
 * @param {Object} data - Object containing user email and password.
 * @param {string} data.email - The email of the user.
 * @param {string} data.password - The password of the user.
 * @returns {Promise<Object>} A success message, user data, and generated tokens.
 * @throws {Error} Throws an error if user not found or password is invalid.
 */
export const loginUser = async (data: { email: string; password: string }) => {
  const user = await UserSchema.findOne({ email: data.email });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const { password, ...userWithoutPassword } = user.toObject();
  const tokens = createUserTokens(userWithoutPassword);
  return {
    success: true,
    message: "User logged in",
    data: { user: userWithoutPassword, tokens },
  };
};

/**
 * Update a user's password and send an email notification.
 * 
 * @param {Object} data - Object containing the email and new password.
 * @param {string} data.email - The email of the user.
 * @param {string} data.password - The new password of the user.
 * @returns {Promise<IUser>} The updated user object without the password field.
 * @throws {Error} Throws an error if the user is not found or password update fails.
 */
export const createUpdatePassword = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  const user = await UserSchema.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const updatedUser = await UserSchema.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true, runValidators: true }
  ).select("-password");
  if (!updatedUser) {
    throw new Error("Error updating password");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: "your-email@gmail.com",
    to: user.email,
    subject: "Password Update Notification",
    text: `Hello ${user.name},\n\nYour password has been successfully updated. If you did not initiate this change, please contact support immediately.\n\nBest regards,\nTeam`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Password update email sent to:", user.email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
  return updatedUser;
};

/**
 * Block or unblock a user by updating their blocked status.
 * 
 * @param {string} id - The ID of the user to be updated.
 * @param {boolean} block - Whether to block or unblock the user.
 * @returns {Promise<IUser>} The updated user object without the password field.
 * @throws {Error} Throws an error if the user is not found.
 */
export const blockUnblockUser = async (id: string, block: boolean) => {
  const updatedUser = await UserSchema.findByIdAndUpdate(
    id,
    { blocked: block },
    { new: true, runValidators: true }
  ).select("-password");
  if (!updatedUser) {
    throw new Error("User not found");
  }
  return updatedUser;
};

/**
 * Get the number of users who registered within a specific date range.
 * 
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Promise<number>} The count of registered users.
 */
export const getRegisteredUsersByDateRange = async (startDate: Date, endDate: Date) => {
  const users = await UserSchema.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).countDocuments();
  return users;
};

/**
 * Update a user's information.
 * 
 * @param {string} id - The ID of the user to be updated.
 * @param {IUser} data - The new data for the user.
 * @returns {Promise<IUser>} The updated user object.
 */
export const updateUser = async (id: string, data: IUser) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, { new: true });
  return result;
};

/**
 * Edit a user's information partially.
 * 
 * @param {string} id - The ID of the user to be updated.
 * @param {Partial<IUser>} data - The new data for the user (partial update).
 * @returns {Promise<IUser>} The updated user object.
 */
export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

/**
 * Delete a user from the database.
 * 
 * @param {string} id - The ID of the user to be deleted.
 * @returns {Promise<Object>} The result of the delete operation.
 */
export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne({ _id: id });
  return result;
};

/**
 * Get a user by their ID.
 * 
 * @param {string} id - The ID of the user to be retrieved.
 * @returns {Promise<IUser>} The user object.
 */
export const getUserById = async (id: string) => {
  const result = await UserSchema.findById(id).lean();
  return result;
};

/**
 * Get all users in the database.
 * 
 * @returns {Promise<IUser[]>} A list of all users.
 */
export const getAllUser = async () => {
  const result = await UserSchema.find({}).lean();
  return result;
};

/**
 * Get a user by their email.
 * 
 * @param {string} email - The email of the user to be retrieved.
 * @returns {Promise<IUser | null>} The user object or null if not found.
 */
export const getUserByEmail = async (email: string) => {
  const result = await UserSchema.findOne({ email }).lean();
  return result;
};
