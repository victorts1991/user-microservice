import {
    Controller,
    Get
  } from '@nestjs/common';
  import { UserService } from './user.service';
  
  @Controller('/delete-test-mass')
  export class DeleteTestMassController {
    constructor(private userService: UserService) {}
  
    @Get()
    async deleteTestMass() {
      await this.userService.deleteTestMass()
      return true
    }
  
  }
  