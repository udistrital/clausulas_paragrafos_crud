import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ParagrafoService } from './paragrafo.service';
import { CreateParagrafoDto } from './dto/create-paragrafo.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'src/filters/dto/filters.dto';

@ApiTags('paragrafo')
@Controller('paragrafo')
export class ParagrafoController {
  constructor(
    private paragrafoService: ParagrafoService
) { }

@Post()
async post(@Res() res, @Body() paragrafoDto: CreateParagrafoDto) {
    const paragrafo = await this.paragrafoService.post(paragrafoDto);
    if (!paragrafo) {
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
        Data: paragrafo
    });
}

@Get()
async getAll(@Res() res, @Query() filterDto: FilterDto) {
    try {
        const paragrafo = await this.paragrafoService.getAll(filterDto);
        res.status(HttpStatus.OK).json({
            Success: true,
            Status: "200",
            Message: "Request successful",
            Data: paragrafo || []
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
    const paragrafo = await this.paragrafoService.getById(id);
    if (!paragrafo) {
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
        Data: paragrafo
    });
}

@Put('/:id')
async put(@Res() res, @Param('id') id: string, @Body() paragrafoDto: CreateParagrafoDto) {
    const paragrafo = await this.paragrafoService.put(id, paragrafoDto);
    if (!paragrafo) {
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
        Data: paragrafo
    });
}

@Delete('/:id')
async delete(@Res() res, @Param('id') id: string) {
    const paragrafo = await this.paragrafoService.delete(id);
    if (!paragrafo) {
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
