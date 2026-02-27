import type { IBankAccount } from "./bank-account.model.js";
import BankAccount from "./bank-account.model.js";

export class BankAccountRepository {
  public async create(data: Partial<IBankAccount>): Promise<IBankAccount> {
    const bankAccount = new BankAccount(data);
    return await bankAccount.save();
  }

  public async findById(id: string): Promise<IBankAccount | null> {
    return await BankAccount.findById(id).exec();
  }

  public async findByUserId(userId: string): Promise<IBankAccount[]> {
    return await BankAccount.find({ userId }).exec();
  }

  public async update(
    id: string,
    data: Partial<IBankAccount>,
  ): Promise<IBankAccount | null> {
    return await BankAccount.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  public async delete(id: string): Promise<IBankAccount | null> {
    return await BankAccount.findByIdAndDelete(id).exec();
  }
}
