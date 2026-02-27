import type { QueryOptions } from "mongoose";
import type { PaginatedResult } from "../../shared/utils/query-builder.js";
import type { IMonoRequest } from "./mono-request.model.js";
import { MonoRequestRepository } from "./mono-request.repository.js";

export interface MonoRequestLinkResponseData {
  mono_url: string;
  customer: string;
  scope: string;
  is_multi: boolean;
}

export interface MonoRequestLinkResponse {
  status: string;
  data: MonoRequestLinkResponseData;
}

export class MonoRequestService {
  private repository: MonoRequestRepository;

  constructor() {
    this.repository = new MonoRequestRepository();
  }

  public async createMonoRequest(
    data: Partial<IMonoRequest>,
  ): Promise<IMonoRequest> {
    return await this.repository.create(data);
  }

  public async getMonoRequestById(id: string): Promise<IMonoRequest | null> {
    return await this.repository.findById(id);
  }

  public async getMonoRequestByMetaRef(
    metaRef: string,
  ): Promise<IMonoRequest | null> {
    return await this.repository.findByMetaRef(metaRef);
  }

  public async getMonoRequestsByUserId(
    userId: string,
    options: QueryOptions,
  ): Promise<PaginatedResult<IMonoRequest>> {
    return await this.repository.findByUserId(userId, options);
  }

  public async updateMonoRequest(
    id: string,
    data: Partial<IMonoRequest>,
  ): Promise<IMonoRequest | null> {
    return await this.repository.update(id, data);
  }

  public async deleteMonoRequest(id: string): Promise<IMonoRequest | null> {
    return await this.repository.delete(id);
  }
}
