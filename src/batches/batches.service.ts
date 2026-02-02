import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Batches } from './entities/batch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batches)
    private readonly batchesRepository: Repository<Batches>,
  ) {}

  private getRepo(manager?: EntityManager) {
    return manager ? manager.getRepository(Batches) : this.batchesRepository;
  }

  async create(createBatchDto: CreateBatchDto, manager?: EntityManager) {
    const repo = this.getRepo(manager);
    const batch = repo.create(createBatchDto);
    return repo.save(batch);
  }

  async findAll() {
    return this.batchesRepository.find();
  }

  async findByProductFEFO(
    productId: string,
    manager?: EntityManager,
  ): Promise<Batches[]> {
    return this.getRepo(manager).find({
      where: { productId },
      order: { expirationDate: 'ASC' },
    });
  }

  async findById(id: string, manager?: EntityManager): Promise<Batches | null> {
    return this.getRepo(manager).findOne({ where: { id } });
  }

  async save(batch: Batches, manager?: EntityManager) {
    return this.getRepo(manager).save(batch);
  }

  async update(id: string, updateBatchDto: UpdateBatchDto): Promise<Batches> {
    const batch = await this.batchesRepository.preload({
      id,
      ...updateBatchDto,
    });
    if (!batch) throw new NotFoundException(`Batch with id ${id} not found`);

    try {
      return await this.batchesRepository.save(batch);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const batch = await this.findById(id);
    if (!batch) throw new NotFoundException(`Batch with id ${id} not found`);

    try {
      return await this.batchesRepository.softDelete(id);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    //I know that the property exist if exists the error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error?.code === '23505') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }
    console.log(error);
    throw new HttpException(
      'Unexpected error, check server logs',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
