import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { OrdenParagrafoService } from './orden_paragrafo.service';
import { CreateOrdenParagrafoDto } from './dto/create-orden_paragrafo.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'src/filters/dto/filters.dto';

@ApiTags('orden-paragrafos')
@Controller('orden-paragrafos')
export class OrdenParagrafoController {
  constructor(private ordenParagrafoService: OrdenParagrafoService) {}

  @Post()
  async post(@Res() res, @Body() ordenParagrafoDto: CreateOrdenParagrafoDto) {
    const ordenParagrafo =
      await this.ordenParagrafoService.post(ordenParagrafoDto);
    if (!ordenParagrafo) {
      throw new HttpException(
        {
          Success: false,
          Status: 400,
          Message:
            'Error service Post: The request contains an incorrect data type or an invalid parameter',
          Data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    res.status(HttpStatus.CREATED).json({
      Success: true,
      Status: 201,
      Message: 'Registration successful',
      Data: ordenParagrafo,
    });
  }

  @Get()
  async getAll(@Res() res, @Query() filterDto: FilterDto) {
    try {
      const ordenParagrafo = await this.ordenParagrafoService.getAll(filterDto);
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: 200,
        Message: 'Request successful',
        Data: ordenParagrafo || [],
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        Success: false,
        Status: 500,
        Message: `An unexpected error occurred ${error.message}`,
        Data: null,
      });
    }
  }

  @Get('/:id')
  async getById(@Res() res, @Param('id') id: string) {
    const ordenParagrafo = await this.ordenParagrafoService.getById(id);
    if (!ordenParagrafo) {
      throw new HttpException(
        {
          Success: false,
          Status: 404,
          Message:
            'Error service GetOne: The request contains an incorrect parameter or no record exist',
          Data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    res.status(HttpStatus.OK).json({
      Success: true,
      Status: 200,
      Message: 'Request successful',
      Data: ordenParagrafo,
    });
  }

  @Put('/:id')
  async put(
    @Res() res,
    @Param('id') id: string,
    @Body() ordenParagrafoDto: CreateOrdenParagrafoDto,
  ) {
    const ordenParagrafo = await this.ordenParagrafoService.put(
      id,
      ordenParagrafoDto,
    );
    if (!ordenParagrafo) {
      throw new HttpException(
        {
          Success: false,
          Status: 400,
          Message:
            'Error service Put: The request contains an incorrect data type or an invalid parameter',
          Data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    res.status(HttpStatus.OK).json({
      Success: true,
      Status: 200,
      Message: 'Update successful',
      Data: ordenParagrafo,
    });
  }

  @Delete('/:id')
  async delete(@Res() res, @Param('id') id: string) {
    const ordenParagrafo = await this.ordenParagrafoService.delete(id);
    if (!ordenParagrafo) {
      throw new HttpException(
        {
          Sucess: false,
          Status: 404,
          Message:
            'Error en el servicio Delete: La solicitud contiene un parámetro incorrecto',
          Data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    res.status(HttpStatus.OK).json({
      Success: true,
      Status: 200,
      Message: 'Delete successful',
      Data: {
        _id: id,
      },
    });
  }
}
