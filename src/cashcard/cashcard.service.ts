import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CashCard, CashCardDocument } from 'src/domain/schemas/cashcard.schema';
import { CashCardRequestDto } from 'src/account/dto/request/cashcard.request.dto';
import { CashCardResponseDto } from 'src/account/dto/response/cashcard.response.dto';

@Injectable()
export class CashCardService {

    private readonly logger = new Logger(CashCardService.name);

    constructor(
        @InjectModel(CashCard.name) private cashcardModel: Model<CashCardDocument>
    ) {}

    async generateCashCard(body: CashCardRequestDto): Promise<any> {

        try {

            const requestData: any = this.mapCashCard(body);

            const newCashCard = new this.cashcardModel(requestData);
            let result = await newCashCard.save();

            return result;

        }
        catch (error) {
            this.logger.error(error);
        }

    }

    async getCashCardByUser(userid: string): Promise<Array<any>> {
        const allCashCard = await this.cashcardModel.find({ user: userid });
        return allCashCard;
    }

    async getCashCard(cardPin: string): Promise<CashCardResponseDto> {

        const newCashCard = await this.cashcardModel.findOne({ cardPin: cardPin });

        const result = {
            cardPin: newCashCard.cardPin,
            refNo: newCashCard.refNo,
            value: newCashCard.value
        }
        return result;
    }

    private generateCardNumber(): string {

        const chars = '1234567890';
        const pinLength = 6;

        let randomPin = 0;

        let rndmNo = 0;
        let pinNo = "";
        let pinValue = "";

        rndmNo = Math.floor(Date.now() / 1000);

        for (var j = 0; j < pinLength; j = j + 1) {
            randomPin = Math.floor(Math.random() * chars.length);
            pinNo += chars.substring(randomPin, randomPin + 1);

        }

        let prefixRandom = pinNo.substring(0, 3);
        let suffixRandom = pinNo.substring(3, pinNo.length);

        pinValue = prefixRandom+rndmNo+suffixRandom;

        return pinValue;
    }

    private generateRefNumber(): string {

        let refNumber = "";

        const chars = '1234567890';
        const referenceLength = 6;

        let randomNumber = 0;

        let refValue = 0;
        let randomReference = "";

        refValue = Date.now();
        let refVal = "";

        for (var i = 0; i < referenceLength; i = i + 1) {
            randomNumber = Math.floor(Math.random() * chars.length);
            randomReference += chars.substring(randomNumber, randomNumber + 1);

        }

        let prefixRef = randomReference.substring(0, 3);
        let suffixRef = randomReference.substring(3, randomReference.length);

        refVal = refValue.toString();

        let refRandom = refVal.substring(6, refVal.length);

        refNumber = prefixRef+refRandom+suffixRef;


        return refNumber;

    }

    private async hashedCashCard(number: string): Promise<string> {
        return await bcrypt.hash(number, 12);
    }

    private mapCashCard(card: CashCardRequestDto): any {

        const generateCashCard = this.generateCardNumber();
        const generatedRef = this.generateRefNumber();
        
        let result = {
            cardPin: generateCashCard.toString(),
            refNo: generatedRef.toString(),
            value: card.value,
            user: card.userId
        };
    
        return result;

    }


}