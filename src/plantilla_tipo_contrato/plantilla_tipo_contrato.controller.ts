import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'src/filters/dto/filters.dto';

@ApiTags('plantilla-tipo-contratos')
@Controller('plantilla-tipo-contratos')
export class PlantillaTipoContratoController {
    constructor(
        private plantillaTipoContratoService: PlantillaTipoContratoService
    ) {}

    @Post()
    async post(@Res() res, @Body() plantillaTipoContratoDto: CreatePlantillaTipoContratoDto) {
        try {
            const plantillaTipoContrato = await this.plantillaTipoContratoService.post(plantillaTipoContratoDto);
            res.status(HttpStatus.CREATED).json({
                Success: true,
                Status: 201,
                Message: "Registration successful",
                Data: plantillaTipoContrato
            });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                Success: false,
                Status: 400,
                Message: "Error service Post: The request contains an incorrect data type or an invalid parameter",
                Data: null
            });
        }
    }

    @Get()
    async getAll(@Res() res, @Query() filterDto: FilterDto) {
        try {
            const { data, total } = await this.plantillaTipoContratoService.getAll(filterDto);
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: 200,
                Message: "Request successful",
                Metadata: {
                    count: total
                },
                Data: data
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                Success: false,
                Status: 500,
                Message: "An unexpected error occurred",
                Metadata: null,
                Data: null                
            });
        }
    }

    @Get('/:id')
    async getById(@Res() res, @Param('id') id: string) {
        try {
            const plantillaTipoContrato = await this.plantillaTipoContratoService.getById(id);
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: 200,
                Message: "Request successful",
                Data: plantillaTipoContrato
            });
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).json({
                Success: false,
                Status: 404,
                Message: error.message,
                Data: null
            });
        }
    }

    @Get('/tipo-contrato/:tipo_contrato_id')
    async getByTipoContrato(@Res() res, @Param('tipo_contrato_id') tipoContratoId: string) {
        try {
            const plantillaTipoContrato = await this.plantillaTipoContratoService.getByTipoContrato(+tipoContratoId);
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: 200,
                Message: "Request successful",
                Data: plantillaTipoContrato
            });
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).json({
                Success: false,
                Status: 404,
                Message: error.message,
                Data: null
            });
        }
    }

    @Put('/:id')
    async put(@Res() res, @Param('id') id: string, @Body() plantillaTipoContratoDto: CreatePlantillaTipoContratoDto) {
        try {
            const plantillaTipoContrato = await this.plantillaTipoContratoService.put(id, plantillaTipoContratoDto);
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: 200,
                Message: "Update successful",
                Data: plantillaTipoContrato
            });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                Success: false,
                Status: 400,
                Message: "Error service Put: The request contains an incorrect data type or an invalid parameter",
                Data: null
            });
        }
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        try {
            const plantillaTipoContrato = await this.plantillaTipoContratoService.delete(id);
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: 200,
                Message: "Delete successful",
                Data: { _id: id }
            });
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).json({
                Success: false,
                Status: 404,
                Message: "Error service Delete: Request contains incorrect parameter",
                Data: null
            });
        }
    }
}