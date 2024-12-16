import { Model } from 'mongoose';
import { IRepository } from '../../interfaces/repositories/IRepository';

export class MongoRepository<T> implements IRepository<T> {
  constructor(protected readonly model: Model<T>) { }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const created = await this.model.create(data);
    return created.toObject();
  }

  async findById(id: string): Promise<T | null> {
    const item = await this.model.findById(id);
    return item ? item.toObject() : null;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const item = await this.model.findOne(filter);
    return item ? item.toObject() : null;
  }

  async find(filter: Partial<T>, options?: { skip?: number; limit?: number }): Promise<T[]> {
    const query = this.model.find(filter);

    if (options?.skip) query.skip(options.skip);
    if (options?.limit) query.limit(options.limit);

    const items = await query.exec();
    return items.map(item => item.toObject());
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const updated = await this.model.findByIdAndUpdate(id, data, { new: true });
    return updated ? updated.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async count(filter: Partial<T>): Promise<number> {
    return this.model.countDocuments(filter);
  }
} 