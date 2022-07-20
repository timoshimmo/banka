import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import CreatePinDto from 'src/domain/dto/request/account/create-pin.dto';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { AccountService } from './account.service';

@ApiTags('Account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/pin')
  @ApiBody({ type: CreatePinDto })
  async createPin(@Req() req: Request, @Body() body: CreatePinDto) {
    const user = req.user as ICurrentUser;
    await this.accountService.createPin(user.email, body.pin);
  }
}
