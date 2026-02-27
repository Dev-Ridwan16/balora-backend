import monoApiConfig from "../../config/mono.config.js";
import {
  Status,
  type IMonoRequest,
  type IMonoRequestCredentials,
} from "../mono-request/mono-request.model.js";
import { MonoRequestRepository } from "../mono-request/mono-request.repository.js";
import type { IBankAccount } from "./bank-account.model.js";
import { BankAccountRepository } from "./bank-account.repository.js";

export class BankAccountService {
  private repository: BankAccountRepository;
  private monoRequestRepository: MonoRequestRepository;

  constructor() {
    this.repository = new BankAccountRepository();
    this.monoRequestRepository = new MonoRequestRepository();
  }

  public async createBankAccount(
    data: Partial<IBankAccount>,
  ): Promise<IBankAccount> {
    return await this.repository.create(data);
  }

  public async updateBankAccount(
    id: string,
    data: Partial<IBankAccount>,
  ): Promise<IBankAccount | null> {
    return await this.repository.update(id, data);
  }
}
