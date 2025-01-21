import { BaseSchema } from "../common/dto/base.dto";

export interface IExpense extends BaseSchema {
  amount: number;
  category: string;
  date: Date;
  description?: string;
}
