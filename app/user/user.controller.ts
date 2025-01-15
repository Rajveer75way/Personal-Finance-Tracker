
import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import userSchema from "./user.schema";
import { blockUnblockUser } from './user.service'; // Adjust import path
import { getRegisteredUsersByDateRange } from "./user.service";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);
    res.send(createResponse(result, "User created sucssefully"))
});
export const createUpdatePassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.createUpdatePassword(req.body);
    res.send(createResponse(result, "Password updated sucssefully"))
});
export const handleBlockUnblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params; // User ID from route params
    const { block } = req.body; // Boolean value from request body

    if (typeof block !== 'boolean') {
        res.status(400).send({ success: false, message: 'Invalid block status' });
        return;
    }

    const result = await blockUnblockUser(id, block);
    console.log(block);
    const action = block ? 'blocked' : 'unblocked';

    res.status(200).send({
        success: true,
        message: `User successfully ${action}`,
        data: result,
    });
});
export const handleGetRegisteredUsers = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
        return res.status(400).send({
            success: false,
            message: 'Please provide both startDate and endDate in the request body',
        });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Query the database to find users within the date range
    const result = await userSchema.find({
        createdAt: { $gte: start, $lte: end },
    }).select('-password');

    // Send the result as a response
    res.status(200).send({
        success: true,
        message: 'Users retrieved successfully',
        data: { registeredUsers: result },
    });
};
export const getActiveUserCount = async (req: Request, res: Response) => {
    try {
         const activeUserCount = await userService.getActiveUserCount();
      res.send(createResponse(activeUserCount, "Active user count fetched successfully"));
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch active user count", error: error });
    }
  };

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.loginUser(req.body);
    res.send(createResponse(result, "User logged in sucssefully"))
});

// Step 1: Complete Profile (uploading profile image)
export const completeProfile = asyncHandler(async (req: any, res: any) => {
    const { id } = req.params; // User ID from the URL
  
    const user = await userSchema.findById(id);
  
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  
    // If profile image is uploaded, save it as a buffer in MongoDB
    if (req.file) {
      user.profileImage = req.file.buffer; // Store the buffer (image data)
    }
  
    // Mark the profile step as completed
    user.profileCompleted = true;
  
    await user.save();
  
    return res.status(200).json({
      success: true,
      message: 'Profile step completed successfully',
      data: user
    });
  });
  

// Step 2: Complete Qualification (uploading qualification documents)
export const completeQualification = asyncHandler(async (req: any, res: any) => {
    const { id } = req.params; // User ID from the URL

    const user = await userSchema.findById(id);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If qualification documents are uploaded, save them as buffers
    if (req.files) {
        user.qualificationDocs = (req.files as Express.Multer.File[]).map(file => file.buffer);
    }

    // Mark the qualification step as completed
    user.qualificationCompleted = true;

    await user.save();

    return res.status(200).json({
        success: true,
        message: 'Qualification step completed successfully',
        data: user
    });
});

// Step 3: Complete KYC (uploading KYC image)
export const completeKYC = asyncHandler(async (req: any, res: any) => {
    const { id } = req.params; // User ID from the URL
  
    const user = await userSchema.findById(id);
  
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  
    // If KYC image is uploaded, save it as a buffer in MongoDB
    if (req.file) {
      user.kycImage = req.file.buffer; // Store the buffer (image data)
    }
  
    // Mark the KYC step as completed
    user.kycCompleted = true;
  
    await user.save();
  
    return res.status(200).json({
      success: true,
      message: 'KYC step completed successfully',
      data: user
    });
  });
  
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.updateUser(req.params.id, req.body);
    res.send(createResponse(result, "User updated sucssefully"))
});

export const editUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.editUser(req.params.id, req.body);
    res.send(createResponse(result, "User updated sucssefully"))
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.deleteUser(req.params.id);
    res.send(createResponse(result, "User deleted sucssefully"))
});


export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getUserById(req.params.id);
    res.send(createResponse(result))
});


export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getAllUser();
    res.send(createResponse(result))
});
