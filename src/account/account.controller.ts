import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  Patch,
  Post,
  Param,
  Put,
  Req,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PatchDto } from 'src/account/dto/request/patch.dto';
import { BaseResponse } from 'src/domain/dto/response/base-response';
import UserResponseDto from 'src/auth/dto/response/user.response.dto';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { ApiResponse } from 'src/handlers/doc/api-response';
import { AccountService } from './account.service';
import { AddressDto } from './dto/request/address.dto';
import { NotFoundError } from 'rxjs';
import { EmailService } from 'src/email/email.service';
import UpdateTransactionPinDto from 'src/account/dto/request/update-transaction-pin.dto';
import { Types } from 'mongoose';
import TransactionPinDto from 'src/account/dto/request/transaction-pin.dto';
import UpdatePinDto from './dto/request/update-pin.dto';
import UserBuilder from 'src/handlers/builders/user-builder';
import KinDto from 'src/auth/dto/request/kin.dto';
import BankDetailDto from './dto/response/bank-detail.dto';
import { WalletRequestDto } from 'src/account/dto/request/wallet.request.dto';
import { WalletResponseDto } from 'src/account/dto/response/wallet.response.dto';
import { CashCardRequestDto } from 'src/account/dto/request/cashcard.request.dto';
import { CashCardResponseDto } from 'src/account/dto/response/cashcard.response.dto';

@ApiTags('Account')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly emailService: EmailService,
  ) {}

  @Patch('/profile')
  @ApiBody({ type: [PatchDto] })
  @ApiResponse(UserResponseDto, 200)
  async profile(
    @Req() req: Request,
    @Body() profile: PatchDto[],
  ): Promise<BaseResponse<UserResponseDto>> {
    const user = req.user as ICurrentUser;
    const editedUser = await this.accountService.update(user.id, profile);
    //const kin = await this.accountService.getKin(editedUser.id);
    const data = UserBuilder.userResponse(editedUser);
    return {
      message: 'User updated successfully',
      data: data,
      status: HttpStatus.OK,
    };
  }

  @Put('/pin')
  @ApiBody({ type: UpdatePinDto })
  @ApiResponse(String, 200)
  async updatePin(
    @Req() req: Request,
    @Body() data: UpdatePinDto,
  ): Promise<BaseResponse<string>> {
    const user = req.user as ICurrentUser;
    const id = new Types.ObjectId(user.id);

    const validatedUser = await this.accountService.validatepin(id, data.pin);

    if (!validatedUser) throw new NotAcceptableException('Pin not valid');

    const updateUser = await this.accountService.updatePin(validatedUser, data);
    if (!updateUser)
      throw new InternalServerErrorException('Failed to update pin');

    return {
      message: 'Successful',
      data: 'Pin updated successfully',
      status: HttpStatus.OK,
    };
  }

  @Post('/address')
  @ApiBody({ type: AddressDto })
  @ApiResponse(AddressDto, 201)
  async createAddress(
    @Req() req: Request,
    @Body() data: AddressDto,
  ): Promise<BaseResponse<AddressDto>> {
    const user = req.user as ICurrentUser;
    let address = await this.accountService.findAddress(user.id);
    if (address)
      throw new ForbiddenException('Not allowed to have more than one address');

    address = await this.accountService.createAddress(user.id, data);
    return {
      message: 'Address added successfully',
      data: address,
      status: HttpStatus.CREATED,
    };
  }

  @Post('/cashcard')
  @ApiBody({ type: CashCardRequestDto })
  @ApiResponse(CashCardResponseDto, 201)
  async generateCashCard(
    @Body() data: CashCardRequestDto,
  ): Promise<BaseResponse<any>> {
   
    const result = await this.accountService.generateCashCard(data);
    return {
      message: 'Cash Card generated successfully',
      data: result,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/cashcard/:cardpin')
  @ApiResponse(CashCardResponseDto, 201)
  async getCashCard(@Param('cardpin') cardpin: string): Promise<BaseResponse<CashCardResponseDto>> {

    console.log("Controller Pin:", cardpin);
   
    const result = await this.accountService.getCashCard(cardpin);
    if (!result) throw new NotFoundError('Cash Card not found');
    return {
      message: 'Cash Card fetched successfully',
      data: result,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/cashcard/user/:userid')
  @ApiResponse(Array<any>, 201)
  async getCashCardByUser(@Param('userid') userid: string): Promise<BaseResponse<Array<any>>> {
   
    const result = await this.accountService.getCashCardByUser(userid);
    if (!result) throw new NotFoundError('Cash Cards not found');
    return {
      message: 'Cash Card fetched successfully',
      data: result,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/address')
  @ApiResponse(AddressDto, 200)
  async getAddress(@Req() req: Request): Promise<BaseResponse<AddressDto>> {
    const user = req.user as ICurrentUser;
    const address = await this.accountService.findAddress(user.id);
    if (!address) throw new NotFoundError('Address not found');
    return {
      message: 'Address fetched successfully',
      data: address,
      status: HttpStatus.CREATED,
    };
  }

  @Patch('/address')
  @ApiBody({ type: [PatchDto] })
  @ApiResponse(AddressDto, 200)
  async updateAddress(
    @Req() req: Request,
    @Body() data: PatchDto[],
  ): Promise<BaseResponse<AddressDto>> {
    const user = req.user as ICurrentUser;
    const address = await this.accountService.updateAddress(user.id, data);
    if (!address) throw new NotFoundException('Address not found');
    return {
      message: 'Address Updated successfully',
      data: address,
      status: HttpStatus.OK,
    };
  }

  @Get('/test')
  async test(@Req() req: Request) {
    const user = req.user as ICurrentUser;
    const domain = `${req.protocol}://${req.get('Host')}`;
    await this.emailService.sendWelcome(user, domain);
    return {
      message: 'Address Updated successfully',
      data: 'Done',
      status: HttpStatus.OK,
    };
  }

  @Post('/kin')
  @ApiBody({ type: KinDto })
  @ApiResponse(KinDto, 201)
  async addKin(
    @Req() req: Request,
    @Body() data: KinDto,
  ): Promise<BaseResponse<KinDto>> {
    const user = req.user as ICurrentUser;
    const kin = await this.accountService.addKin(user.id, data);

    return {
      message: 'Next of kin added successfully',
      data: kin,
      status: HttpStatus.CREATED,
    };
  }

  @Patch('/kin')
  @ApiBody({ type: PatchDto })
  @ApiResponse(KinDto, 201)
  async updateKin(
    @Req() req: Request,
    @Body() data: PatchDto,
  ): Promise<BaseResponse<KinDto>> {
    const user = req.user as ICurrentUser;
    const kin = await this.accountService.updateKin(user.id, data);
    return {
      message: 'Next of kin updated successfully',
      data: kin,
      status: HttpStatus.OK,
    };
  }

  @Post('/transction-pin')
  @ApiBody({ type: TransactionPinDto })
  @ApiResponse(TransactionPinDto, 201)
  async createTransactionPin(
    @Req() req: Request,
    @Body() data: TransactionPinDto,
  ): Promise<BaseResponse<{ isCreated: boolean }>> {
    console.log('User', req.user);
    const user = req.user as ICurrentUser;
    const id = new Types.ObjectId(user.id);
    if (user.transactionPin)
      throw new NotAcceptableException('User already has a pin');
    const updateUser = await this.accountService.createTransactionPin(
      id,
      data.pin,
    );

    if (!updateUser)
      throw new InternalServerErrorException(
        'Failed to create transaction pin',
      );

    return {
      message: 'Transaction pin set successfully',
      data: { isCreated: true },
      status: HttpStatus.OK,
    };
  }

  @Put('/transction-pin')
  @ApiBody({ type: UpdateTransactionPinDto })
  @ApiResponse(String, 200)
  async updateTransactionPin(
    @Req() req: Request,
    @Body() data: UpdateTransactionPinDto,
  ): Promise<BaseResponse<string>> {
    if (data.newPin === data.pin)
      throw new NotAcceptableException(
        'Your old pin and new cannot be the same',
      );
    const user = req.user as ICurrentUser;
    const id = new Types.ObjectId(user.id);

    const validatedUser = await this.accountService.validateTransactionPin(
      id,
      data.pin,
    );
    if (!validatedUser) throw new NotAcceptableException('Pin not valid');

    const updateUser = await this.accountService.updateTransactionPin(
      validatedUser,
      data,
    );
    if (!updateUser)
      throw new InternalServerErrorException('Failed to update pin');

    return {
      message: 'Successful',
      data: 'Pin updated successfully',
      status: HttpStatus.OK,
    };
  }

  
  @Post('/wallet/:id')
  @ApiBody({ type: WalletRequestDto })
  @ApiResponse(WalletResponseDto, 200)
  async createWalletAccount(
    @Param('id') id: string,
    @Body() walletData: WalletRequestDto
  ): Promise<BaseResponse<WalletResponseDto>> {

    const result = await this.accountService.createWalletAccount(id, walletData);
    return { message: 'Wallet created successfully', data: result, status: HttpStatus.OK };

  }

  @Get('/wallet/:id')
  @ApiResponse(WalletResponseDto, 200)
  async registerAnchorCustomer(
    @Param('id') id: string
  ): Promise<BaseResponse<WalletResponseDto>> {

    const result = await this.accountService.getWalletAccount(id);
    return { message: 'Wallet retrieved successfully', data: result, status: HttpStatus.OK };

  }


  @Get('/generate-bank-account')
  @ApiResponse(BankDetailDto, 200)
  async generateAccount(
    @Req() req: Request,
  ): Promise<BaseResponse<BankDetailDto>> {
    const user = req.user as ICurrentUser;
    const accountDetails = await this.accountService.generateAccount(user);
    if (!accountDetails)
      throw new ServiceUnavailableException('Failed to create account');

    return {
      message: 'Successful',
      data: accountDetails,
      status: HttpStatus.OK,
    };
  }
}
