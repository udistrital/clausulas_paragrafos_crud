import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ClausulaService } from './clausula.service';
import { CreateClausulaDto } from './dto/create-clausula.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'src/filters/dto/filters.dto';

@ApiTags('clausula')
@Controller('clausula')
export class ClausulaController {
    constructor(
        private clausulaService: ClausulaService
    ) { }

    @Post()
    async post(@Res() res, @Body() clausulaDto: CreateClausulaDto) {
        const clausula = await this.clausulaService.post(clausulaDto);
        if (!clausula) {
            throw new HttpException({
                Success: false,
                Status: "400",
                Message: "Error service Post: The request contains an incorrect data type or an invalid parameter",
                Data: null
            }, HttpStatus.BAD_REQUEST)
        }
        res.status(HttpStatus.CREATED).json({
            Success: true,
            Status: "201",
            Message: "Registration successful",
            Data: clausula
        });
    }

    @Get()
    async getAll(@Res() res, @Query() filterDto: FilterDto) {
        try {
            const clausula = await this.clausulaService.getAll(filterDto);
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: "200",
                Message: "Request successful",
                Data: clausula || []
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                Success: false,
                Status: "500",
                Message: "An unexpected error occurred",
                Data: null
            });
        }
    }


    @Get('/:id')
    async getById(@Res() res, @Param('id') id: string) {
        const clausula = await this.clausulaService.getById(id);
        if (!clausula) {
            throw new HttpException({
                Success: false,
                Status: "404",
                Message: "Error service GetOne: The request contains an incorrect parameter or no record exist",
                Data: null
            }, HttpStatus.NOT_FOUND)
        }
        res.status(HttpStatus.OK).json({
            Success: true,
            Status: "200",
            Message: "Request successful",
            Data: clausula
        });
    }

    @Put('/:id')
    async put(@Res() res, @Param('id') id: string, @Body() clausulaDto: CreateClausulaDto) {
        const clausula = await this.clausulaService.put(id, clausulaDto);
        if (!clausula) {
            throw new HttpException({
                Success: false,
                Status: "400",
                Message: "Error service Put: The request contains an incorrect data type or an invalid parameter",
                Data: null
            }, HttpStatus.BAD_REQUEST)
        }
        res.status(HttpStatus.OK).json({
            Success: true,
            Status: "200",
            Message: "Update successful",
            Data: clausula
        });
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const clausula = await this.clausulaService.delete(id);
        if (!clausula) {
            throw new HttpException({
                Sucess: false,
                Status: "404",
                Message: "Error service Delete: Request contains incorrect parameter",
                Data: null
            }, HttpStatus.NOT_FOUND)
        }
        res.status(HttpStatus.OK).json({
            Success: true,
            Status: "200",
            Message: "Delete successful",
            Data: {
                _id: id
            }
        });
    }
}