import { Router } from 'express';
import { generateAndSendReport } from './finance.controller'; // Import the controller

const router = Router();

router.post('/generate-financial-report', generateAndSendReport);

export default router;
