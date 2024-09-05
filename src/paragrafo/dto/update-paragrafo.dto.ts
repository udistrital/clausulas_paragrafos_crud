import { PartialType } from '@nestjs/swagger';
import { CreateParagrafoDto } from './create-paragrafo.dto';

export class UpdateParagrafoDto extends PartialType(CreateParagrafoDto) {}
