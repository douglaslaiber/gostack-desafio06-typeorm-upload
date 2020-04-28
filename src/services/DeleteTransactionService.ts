import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface IRequest {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: IRequest): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not exists', 404);
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
