import { Place as PlaceModel } from '.prisma/client';
import { AuthGuard } from '@/domain/users/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createPlaceDto: CreatePlaceDto,
    @Request() request: Request,
  ): Promise<PlaceModel> {
    return this.placesService.create(createPlaceDto, request['userId']);
  }

  @Get()
  findAll() {
    return this.placesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @Request() request: Request,
  ) {
    return this.placesService.update(id, updatePlaceDto, request['userId']);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: Request) {
    return this.placesService.remove(id, request['userId']);
  }
}
