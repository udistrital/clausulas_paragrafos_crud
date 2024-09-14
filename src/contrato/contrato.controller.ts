import { Controller, Get, Post, Put, Body, Param, Res, HttpStatus, ConflictException } from '@nestjs/common';
import { ContratoService } from './contrato.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateContratoEstructuraDto } from './dto/create-contrato.dto';

@ApiTags('contratos')
@Controller('contratos')
export class ContratoController {
    constructor(
        private contratoService: ContratoService
    ) {}

    @Post('/:id')
    async post(@Res() res, @Param('id') id: string, @Body() estructuraDto: CreateContratoEstructuraDto) {
        try {
            const contrato = await this.contratoService.post(id, estructuraDto);
            res.status(HttpStatus.CREATED).json({
                Success: true,
                Status: 201,
                Message: "Registration successful",
                Data: contrato
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                res.status(HttpStatus.CONFLICT).json({
                    Success: false,
                    Status: 409,
                    Message: error.message,
                    Data: null
                });
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({
                    Success: false,
                    Status: 400,
                    Message: "Error service Post: The request contains an incorrect data type or an invalid parameter",
                    Data: null
                });
            }
        }
    }

    @Get('/:id')
    async getById(@Res() res, @Param('id') id: string) {
        try {
            const contrato = await this.contratoService.getById(id);
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: 200,
                Message: "Request successful",
                Data: contrato
            });
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).json({
                Success: false,
                Status: 404,
                Message: "Error service GetOne: The request contains an incorrect parameter or no record exist",
                Data: null
            });
        }
    }

    @Put('/:id')
    async put(@Res() res, @Param('id') id: string, @Body() estructuraDto: CreateContratoEstructuraDto) {
        try {
            const contrato = await this.contratoService.put(id, estructuraDto);
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: 200,
                Message: "Update successful",
                Data: contrato
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
}