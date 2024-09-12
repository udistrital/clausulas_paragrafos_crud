import { ApiProperty} from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FilterDto{
    
  @ApiProperty({required: false, description:'query - Filter. e.g. col1:v1,col2:v2 …'})
  @IsOptional()
  @IsString()
  readonly query?: string;

  @ApiProperty({required: false, description:'filter - Filter returned. e.g. col1,col2 …'})
  @IsOptional()
  @IsString()
  readonly filter?: string;

  @ApiProperty({required: false, description:'sort - Sorted-by corresponding to each sortby field, if single value, apply to all sortby fields. e.g. desc,asc …'})
  @IsOptional()
  @IsIn(['asc', 'desc'])
  readonly sort?: 'asc' | 'desc';

  @ApiProperty({required: false, description:'orderBy - OrderBy fields. e.g. col1,col2 …'})
  @IsOptional()
  @IsString()
  readonly orderBy?: string;

  @ApiProperty({required: false, description:'limit - Limit the size of result set. Must be an integer'})
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly limit?: number;

  @ApiProperty({required: false, description:'offset - Start position of result set. Must be an integer'})
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly offset?: number;
}