import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Auth } from '../auth/decorators/auth.decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@Controller('batches')
@ApiTags('batches')
@ApiBearerAuth()
@Auth()
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un lote' })
  create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchesService.create(createBatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar lotes' })
  findAll() {
    return this.batchesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lote por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un lote por id' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return this.batchesService.update(id, updateBatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado lógico de un lote por id' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.remove(id);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Listar lotes de un producto por prioridad FEFO' })
  findByProductFEFO(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.batchesService.findByProductFEFO(productId);
  }
}
