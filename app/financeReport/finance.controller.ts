import { Request, Response } from 'express';
import { generateFinancialReportPDF } from './finance.service';
import expressAsyncHandler from 'express-async-handler';

/**
 * Generates a financial report based on the specified date range and category, and sends the generated report to the user.
 * @param {Request} req - The request object, which contains the date range and category in the body.
 * @param {Response} res - The response object to stream the generated report to the client.
 * @returns {Promise<void>} Returns a promise that resolves when the report has been sent.
 */
const generateAndSendReport = expressAsyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, category } = req.body;
    await generateFinancialReportPDF(new Date(startDate), new Date(endDate), category, res);
})

export { generateAndSendReport };
