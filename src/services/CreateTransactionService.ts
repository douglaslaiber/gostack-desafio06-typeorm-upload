import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface IRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_id,
  }: IRequest): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { total: balanceTotal } = await transactionsRepository.getBalance();

    if (['income', 'outcome'].indexOf(type) === -1) {
      throw new AppError('Transaction type not allowed!', 400);
    }

    if (type === 'outcome' && value > balanceTotal) {
      throw new AppError(
        'Unable to make the transaction: value not available',
        400,
      );
    }

    const transaction = await transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
