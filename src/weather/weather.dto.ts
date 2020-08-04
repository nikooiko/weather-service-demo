import {
  ValidateNested,
  IsNumber,
  IsString,
  Min,
  Max,
  IsDefined,
} from 'class-validator';
import {Type} from 'class-transformer';

class CoordDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}

class WeatherObjDto {
  @IsString()
  main: string;
}

class ConditionsDto {
  @IsNumber()
  temp: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  humidity: number;
}

class WindDto {
  @IsNumber()
  speed: number;

  @IsNumber()
  deg: number;
}

export class WeatherDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => CoordDto)
  coord: CoordDto;

  @IsString()
  name: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => WeatherObjDto)
  weather: WeatherObjDto[];

  @ValidateNested()
  @IsDefined()
  @Type(() => ConditionsDto)
  main: ConditionsDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => WindDto)
  wind: WindDto;
}
