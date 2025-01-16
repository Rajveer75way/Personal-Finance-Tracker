import { Request, Response } from 'express';
import { generateFinancialReportPDF } from './financial.service';

const generateAndSendReport = async (req: Request, res: Response) => {
  const { startDate, endDate, category } = req.body;

  if (!startDate || !endDate || !category) {
    return res.status(400).json({
      success: false,
      message: 'Start Date, End Date, and Category are required.',
    });
  }

  try {
    await generateFinancialReportPDF(new Date(startDate), new Date(endDate), category, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error generating the report.',
      error: error.message,
    });
  }
};

export { generateAndSendReport };
