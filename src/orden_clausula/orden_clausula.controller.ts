import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { OrdenClausulaService } from './orden_clausula.service';
import { CreateOrdenClausulaDto } from './dto/create-orden_clausula.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'src/filters/dto/filters.dto';

@ApiTags('orden_clausula')
@Controller('orden_clausula')
export class OrdenClausulaController {

  constructor(
    private ordenClausulaService: OrdenClausulaService
) { }

@Post()
async post(@Res() res, @Body() ordenClausulaDto: CreateOrdenClausulaDto) {
    const ordenClausula = await this.ordenClausulaService.post(ordenClausulaDto);
    if (!ordenClausula) {
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
        Data: ordenClausula
    });
}

@Get()
async getAll(@Res() res, @Query() filterDto: FilterDto) {
    try {
        const ordenClausula = await this.ordenClausulaService.getAll(filterDto);
        res.status(HttpStatus.OK).json({
            Success: true,
            Status: "200",
            Message: "Request successful",
            Data: ordenClausula || []
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
    const ordenClausula = await this.ordenClausulaService.getById(id);
    if (!ordenClausula) {
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
        Data: ordenClausula
    });
}

@Put('/:id')
async put(@Res() res, @Param('id') id: string, @Body() ordenClausulaDto: CreateOrdenClausulaDto) {
    const ordenClausula = await this.ordenClausulaService.put(id, ordenClausulaDto);
    if (!ordenClausula) {
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
        Data: ordenClausula
    });
}

@Delete('/:id')
async delete(@Res() res, @Param('id') id: string) {
    const ordenClausula = await this.ordenClausulaService.delete(id);
    if (!ordenClausula) {
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
