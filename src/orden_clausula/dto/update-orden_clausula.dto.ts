import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdenClausulaDto } from './create-orden_clausula.dto';

export class UpdateOrdenClausulaDto extends PartialType(CreateOrdenClausulaDto) {}
