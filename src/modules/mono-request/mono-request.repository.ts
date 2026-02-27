import {
  QueryBuilder,
  type PaginatedResult,
  type QueryOptions,
} from "../../shared/utils/query-builder.js";
import type { ExtendedQueryOptions } from "../user/user.repository.js";
import MonoRequest, { type IMonoRequest } from "./mono-request.model.js";

export class MonoRequestRepository {
  public async create(data: Partial<IMonoRequest>): Promise<IMonoRequest> {
    const monoRequest = new MonoRequest(data);
    return await monoRequest.save();
  }

  public async findById(id: string): Promise<IMonoRequest | null> {
    return await MonoRequest.findById(id).exec();
  }

  public async findByMetaRef(metaRef: string): Promise<IMonoRequest | null> {
    return await MonoRequest.findOne({ metaRef }).exec();
  }

  public async findByUserId(
    userId: string,
    options: ExtendedQueryOptions,
  ): Promise<PaginatedResult<IMonoRequest>> {
    const queryBuilder = new QueryBuilder<IMonoRequest>(options);

    let query = MonoRequest.find(queryBuilder.getFilter())
      .sort(queryBuilder.getSort())
      .skip(queryBuilder.getSkip())
      .limit(queryBuilder.getLimit());

    if (queryBuilder.getSelect()) {
      query = query.select(queryBuilder.getSelect());
    }

    const [data, total] = await Promise.all([
      query.exec(),
      MonoRequest.countDocuments({ userId, ...queryBuilder.getFilter() }),
    ]);

    return queryBuilder.buildPaginatedResult(data, total);
  }

  public async update(
    id: string,
    data: Partial<IMonoRequest>,
  ): Promise<IMonoRequest | null> {
    return await MonoRequest.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  public async delete(id: string): Promise<IMonoRequest | null> {
    return await MonoRequest.findByIdAndDelete(id).exec();
  }
}
