import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CashCardService } from './cashcard.service';
import { CashCard, CashCardSchema } from 'src/domain/schemas/cashcard.schema';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            { name: CashCard.name, schema: CashCardSchema },
        ]),
    ],
    providers: [CashCardService],
    exports: [CashCardService],

})

export class CashCardModule {}