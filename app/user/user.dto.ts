import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
    name: string;
    email: string;
    blocked?: boolean;
    active?: boolean;
    role: "USER" | "ADMIN";
    password: string;

    // New fields for onboarding steps
    profileCompleted?: boolean;       // Flag to track profile completion
    qualificationCompleted?: boolean; // Flag to track qualification completion
    kycCompleted?: boolean;           // Flag to track KYC completion
    
    // Fields to store paths of uploaded files
    profileImage?: Buffer;            // Path to the profile image
    kycImage?: Buffer;                // Path to the KYC image
    qualificationDocs?: Buffer[];     // Array of paths for qualification documents (PDFs)
}
