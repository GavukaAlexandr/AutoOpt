import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FireBaseService {
  constructor(private configService: ConfigService) {
    this.adminConfig = {
      "projectId": this.configService.get<string>('FIREBASE_PROJECT_ID'),
      "privateKey": this.configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      "clientEmail": this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    };
    // Initialize the firebase admin app
    admin.initializeApp({
      credential: admin.credential.cert(this.adminConfig),
      databaseURL: "https://xxxxx.firebaseio.com",
    });
   }

  private adminConfig: ServiceAccount;

  async isUserByPhoneExist(phone: string): Promise<boolean> {
    const result = await admin.auth().getUserByPhoneNumber(phone);
    return result && !!result.uid
  } 
}