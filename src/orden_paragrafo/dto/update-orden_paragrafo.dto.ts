import { PartialType } from '@nestjs/swagger';
import { CreateOrdenParagrafoDto } from './create-orden_paragrafo.dto';

export class UpdateOrdenParagrafoDto extends PartialType(
  CreateOrdenParagrafoDto,
) {}
