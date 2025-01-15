
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import { createUserTokens } from "../common/services/passport-jwt.service"; // Import the token creation function
import { compare } from "bcrypt";  // Ensure you import compare from bcrypt
import bcrypt from 'bcrypt';

import nodemailer from 'nodemailer';
// assuming you have a user schema
export const createUser = async (data: IUser) => {
    try {
        // Create the user in the database
        const user = await UserSchema.create({ ...data, active: true });
        
        // Remove the password before generating tokens (if needed)
        const { password, ...userWithoutPassword } = user.toObject();
       
        // Create a transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Example, use your SMTP service
            auth: {
                user: process.env.EMAIL, // Use environment variable for email
                pass: process.env.EMAIL_PASSWORD, // Use environment variable for password
            },
        });

        // Set up email data
        const mailOptions = {
            from: process.env.EMAIL, // Use environment variable for sender email
            to: user.email, // Receiver's email
            subject: 'Welcome to Our Platform', // Subject line
            text: `Hello ${user.name},\n\nWelcome to our platform! Your account has been successfully created.\n\nBest regards,\nTeam`, // plain text body
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        
        console.log('User created and email sent successfully!');
        
        // Return user data (you may also return a token or other information)
        return userWithoutPassword;
    } catch (error) {
        console.error('Error creating user or sending email:', error);
        throw new Error('Error creating user or sending email');
    }
};
export const getActiveUserCount = async () => {
    try {
        console.log("object");
      // Correct query to count active users
      const activeUserCount = await UserSchema.countDocuments({ active: true }).exec();
      return activeUserCount;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching active user count");
    }
  };
export const getAllTasks = async () => {
    const result = await UserSchema.find({}).lean();
    return result;
}
  export const loginUser = async (data: { email: string, password: string }) => {
    // Find the user by email
    const user = await UserSchema.findOne({ email: data.email });

    // If no user is found, return an error message
    if (!user) {
        throw new Error("User not found");
    }

    // Compare the hashed password with the provided password
    const isPasswordValid = await compare(data.password, user.password);

    // If password is invalid, throw an error
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    // Remove the password field from the user object
    const { password, ...userWithoutPassword } = user.toObject();

    // Generate access and refresh tokens
    const tokens = createUserTokens(userWithoutPassword);

    // Return the success response with user data and tokens
    return {
        success: true,
        message: "User logged in",
        data: { user: userWithoutPassword, tokens },
    };
};
export const createUpdatePassword = async (data: { email: string, password: string }) => {
    const { email, password } = data;

    // Find the user by email
    const user = await UserSchema.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    // Hash the new password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 12);  // Adjust hash rounds here

    // Update the user's password using findOneAndUpdate (this method doesn't trigger the save hook)
    const updatedUser = await UserSchema.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true, runValidators: true }  // Ensures validation and new user data is returned
    ).select('-password');  // Exclude password from the response

    if (!updatedUser) {
        throw new Error('Error updating password');
    }

    // Send an email notification to the user
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // Example: Gmail SMTP server
        auth: {
            user: process.env.EMAIL, // Use environment variable for email
                pass: process.env.EMAIL_PASSWORD, // Use environment variable for password
            },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',  // Sender address
        to: user.email,  // Receiver's email
        subject: 'Password Update Notification',  // Subject line
        text: `Hello ${user.name},\n\nYour password has been successfully updated. If you did not initiate this change, please contact support immediately.\n\nBest regards,\nTeam`,  // Email body
    };

    try {
        await transporter.sendMail(mailOptions);  // Send the email
        console.log('Password update email sent to:', user.email);
    } catch (error) {
        console.error('Error sending email:', error);
    }

    return updatedUser;
};
export const blockUnblockUser = async (id: string, block: boolean) => {
    const updatedUser = await UserSchema.findByIdAndUpdate(
        id,
        { blocked: block },
        { new: true, runValidators: true }
    ).select('-password'); // Exclude password from the response
    
    if (!updatedUser) {
        throw new Error('User not found');
    }

    return updatedUser;
};
export const getRegisteredUsersByDateRange = async (startDate: Date, endDate: Date) => {
    const users = await UserSchema.find({
        createdAt: {
            $gte: startDate, // Greater than or equal to the start date
            $lte: endDate,   // Less than or equal to the end date
        },
    }).countDocuments();

    return users;
};

export const updateUser = async (id: string, data: IUser) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
    return result;
};

export const deleteUser = async (id: string) => {
    const result = await UserSchema.deleteOne({ _id: id });
    return result;
};

export const getUserById = async (id: string) => {
    const result = await UserSchema.findById(id).lean();
    return result;
};

export const getAllUser = async () => {
    const result = await UserSchema.find({}).lean();
    return result;
};
export const getUserByEmail = async (email: string) => {
    const result = await UserSchema.findOne({ email }).lean();
    return result;
}

