import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface IBalance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<IBalance> {
    const transactions = await this.find();
    const outcome = transactions.reduce((previousValue, transaction) => {
      if (transaction.type === 'outcome') {
        return Number(previousValue) + Number(transaction.value);
      }

      return previousValue;
    }, 0);

    const income = transactions.reduce((previousValue, transaction) => {
      if (transaction.type === 'income') {
        return Number(previousValue) + Number(transaction.value);
      }

      return previousValue;
    }, 0);

    const total = income - outcome;
    const balance: IBalance = { income, outcome, total };

    return balance;
  }
}

export default TransactionsRepository;
