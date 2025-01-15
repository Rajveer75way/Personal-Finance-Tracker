import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware"; // Role-based access control middleware
import upload from './user.multer'; // Import the multer config

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Login user with provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad Request
 */
router.post("/login", userValidator.loginUser, catchError, userController.loginUser);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad Request
 */
router.post("/", userValidator.createUser, catchError, userController.createUser);

/**
 * @swagger
 * /createPassword:
 *   post:
 *     summary: Create or update user password
 *     description: Set or update the password for the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password created or updated successfully
 *       400:
 *         description: Bad Request
 */
router.post('/createPassword', userValidator.createUpdatePassword, catchError, userController.createUpdatePassword);

/**
 * @swagger
 * /{id}/block:
 *   patch:
 *     summary: Block or unblock a user
 *     description: Block or unblock a user by admin.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to block/unblock
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User blocked/unblocked successfully
 *       404:
 *         description: User not found
 */
router.patch('/:id/block', roleAuth(["ADMIN"]), catchError, userController.handleBlockUnblockUser);

/**
 * @swagger
 * /registered:
 *   post:
 *     summary: Get registered users
 *     description: Retrieve a list of all registered users.
 *     responses:
 *       200:
 *         description: List of registered users
 */
router.post('/registered',
  roleAuth(["ADMIN"]),
  catchError,
  userController.handleGetRegisteredUsers
);

/**
 * @swagger
 * /active-session:
 *   get:
 *     summary: Get the active user count
 *     description: Retrieve the count of currently active users.
 *     responses:
 *       200:
 *         description: Active user count retrieved successfully
 */
router.get("/active-session", roleAuth(['ADMIN']), userController.getActiveUserCount);

/**
 * @swagger
 * /{id}/complete-profile:
 *   put:
 *     summary: Complete user profile by uploading a profile image
 *     description: Complete the profile step by uploading a profile image.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to complete the profile
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile completed successfully
 *       404:
 *         description: User not found
 */
router.put('/:id/complete-profile', upload.single('profileImage'), userController.completeProfile);

/**
 * @swagger
 * /{id}/complete-qualification:
 *   put:
 *     summary: Complete qualification step by uploading qualification documents
 *     description: Complete the qualification step by uploading the qualification documents.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to complete qualification
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               qualificationDocs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Qualification completed successfully
 *       404:
 *         description: User not found
 */
router.put('/:id/complete-qualification', upload.array('qualificationDocs'), userController.completeQualification);

/**
 * @swagger
 * /{id}/complete-kyc:
 *   put:
 *     summary: Complete KYC step by uploading KYC image
 *     description: Complete the KYC step by uploading the KYC image.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to complete KYC
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               kycImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: KYC completed successfully
 *       404:
 *         description: User not found
 */
router.put('/:id/complete-kyc', upload.single('kycImage'), userController.completeKYC);

export default router;
