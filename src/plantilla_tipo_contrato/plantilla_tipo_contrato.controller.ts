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
    ) { }

    @Post()
    async post(@Res() res, @Body() plantillaTipoContratoDto: CreatePlantillaTipoContratoDto) {
        const plantillaTipoContrato = await this.plantillaTipoContratoService.post(plantillaTipoContratoDto);
        if (!plantillaTipoContrato) {
            throw new HttpException({
                Success: false,
                Status: 400,
                Message: "Error service Post: The request contains an incorrect data type or an invalid parameter",
                Data: null
            }, HttpStatus.BAD_REQUEST)
        }
        res.status(HttpStatus.CREATED).json({
            Success: true,
            Status: 201,
            Message: "Registration successful",
            Data: plantillaTipoContrato
        });
    }

    @Get()
    async getAll(@Res() res, @Query() filterDto: FilterDto) {
        try {
            const plantillaTipoContrato = await this.plantillaTipoContratoService.getAll(filterDto);
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: 200,
                Message: "Request successful",
                Data: plantillaTipoContrato || []
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                Success: false,
                Status: 500,
                Message: "An unexpected error occurred",
                Data: null
            });
        }
    }


    @Get('/:id')
    async getById(@Res() res, @Param('id') id: string) {
        const plantillaTipoContrato = await this.plantillaTipoContratoService.getById(id);
        if (!plantillaTipoContrato) {
            throw new HttpException({
                Success: false,
                Status: 404,
                Message: "Error service GetOne: The request contains an incorrect parameter or no record exist",
                Data: null
            }, HttpStatus.NOT_FOUND)
        }
        res.status(HttpStatus.OK).json({
            Success: true,
            Status: 200,
            Message: "Request successful",
            Data: plantillaTipoContrato
        });
    }

    @Put('/:id')
    async put(@Res() res, @Param('id') id: string, @Body() plantillaTipoContratoDto: CreatePlantillaTipoContratoDto) {
        const plantillaTipoContrato = await this.plantillaTipoContratoService.put(id, plantillaTipoContratoDto);
        if (!plantillaTipoContrato) {
            throw new HttpException({
                Success: false,
                Status: 400,
                Message: "Error service Put: The request contains an incorrect data type or an invalid parameter",
                Data: null
            }, HttpStatus.BAD_REQUEST)
        }
        res.status(HttpStatus.OK).json({
            Success: true,
            Status: 200,
            Message: "Update successful",
            Data: plantillaTipoContrato
        });
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const plantillaTipoContrato = await this.plantillaTipoContratoService.delete(id);
        if (!plantillaTipoContrato) {
            throw new HttpException({
                Sucess: false,
                Status: 404,
                Message: "Error service Delete: Request contains incorrect parameter",
                Data: null
            }, HttpStatus.NOT_FOUND)
        }
        res.status(HttpStatus.OK).json({
            Success: true,
            Status: 200,
            Message: "Delete successful",
            Data: {
                _id: id
            }
        });
    }
}
