import { PartialType } from '@nestjs/swagger';
import { CreateClausulaDto } from './create-clausula.dto';

export class UpdateClausulaDto extends PartialType(CreateClausulaDto) {}
