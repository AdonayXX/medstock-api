import { Controller, Post, Body, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Auth } from '../auth/decorators/auth.decorators';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { CreateBatchEntryDto } from './dto/create-batch-entry.dto';
import { ConsumeDto } from './dto/consume.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('batch')
  @Auth()
  registerBatch(
    @Body() createBatchEntryDto: CreateBatchEntryDto,
    @GetUser('id') userId: string,
  ) {
    return this.inventoryService.registerBatch(createBatchEntryDto, userId);
  }
  @Patch('consume')
  @Auth()
  consumeFEFO(@Body() consumeDto: ConsumeDto, @GetUser('id') userId: string) {
    return this.inventoryService.consumeFEFO(consumeDto, userId);
  }
}
