import {
    Body,
    Controller,
    Get,
    HttpStatus,
  } from '@nestjs/common';
  import { ApiBody } from '@nestjs/swagger';
  
  @Controller('/liveness')
  export class HealthController {
    
    @Get()
    @ApiBody({ 
      description: "Liveness api.",
    })
    async liveness() {
      return { status: HttpStatus.OK, data: { status: true } }\
    }
  }
  