import { PartialType } from '@nestjs/swagger';
import { CreateOrdenClausulaDto } from './create-orden_clausula.dto';

export class UpdateOrdenClausulaDto extends PartialType(CreateOrdenClausulaDto) {}
