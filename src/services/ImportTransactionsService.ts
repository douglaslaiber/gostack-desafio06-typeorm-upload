import path from 'path';
import fs from 'fs';
import parse from 'csv-parse/lib/sync';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import CreateTransactionService from './CreateTransactionService';

interface IRequest {
  csvFilename: string;
}

class ImportTransactionsService {
  async execute({ csvFilename }: IRequest): Promise<Transaction[]> {
    const createCategory = new CreateCategoryService();
    const createTransaction = new CreateTransactionService();

    const transactions: Transaction[] = [];
    const csvFilePath = path.join(uploadConfig.directory, csvFilename);
    const content = await fs.promises.readFile(csvFilePath);
    const records = parse(content, { from_line: 2 });
    const starterPromise = Promise.resolve(null);

    await records.reduce(async (promise: Promise<void>, line: string[]) => {
      await promise;
      const [title, type, value, category] = line.map((cell: any) =>
        cell.trim(),
      );
      const newCategory = await createCategory.execute({ title: category });
      const newTransaction = await createTransaction.execute({
        title,
        type,
        value,
        category_id: newCategory.id,
      });

      newTransaction.category = newCategory;
      transactions.push(newTransaction);
    }, starterPromise);

    await fs.promises.unlink(csvFilePath);

    return transactions;
  }
}

export default ImportTransactionsService;
