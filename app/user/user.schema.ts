
import mongoose from "mongoose";
import { type IUser } from "./user.dto";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const hashPassword = async (password: string) => {
        const hash = await bcrypt.hash(password, 12);
        return hash;
};

const UserSchema = new Schema<IUser>({
        name: { type: String, required: true },
        email: { type: String, required: true },
        active: { type: Boolean, required: false, default: true },
        blocked: { type: Boolean, required: false, default: false },

        role: { type: String, required: true, enum: ["USER", "ADMIN"], default: "USER" },
        password: { type: String},
        profileCompleted: { type: Boolean, default: false },
    qualificationCompleted: { type: Boolean, default: false },
    kycCompleted: { type: Boolean, default: false },
    profileImage: { type: Buffer, default: '' }, // Path to profile image
    kycImage: { type: Buffer, default: '' }, // Path to KYC image
    qualificationDocs: [{ type: Buffer }] 
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
        if (this.password) {
                this.password = await hashPassword(this.password);
        }
        next();
});

export default mongoose.model<IUser>("user", UserSchema);
