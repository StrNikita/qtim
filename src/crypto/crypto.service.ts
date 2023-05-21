import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto'
import { randomStringBySeed } from 'src/shared/random-string-by-seed';

@Injectable()
export class CryptoService {    
    private static readonly algorithm = 'aes256';

    encrypt(str: string, key: string): string {
        let iv = crypto.randomBytes(8).toString('hex');
        let cipher = crypto.createCipheriv(CryptoService.algorithm, randomStringBySeed(32,key), iv);

        let encrypted = cipher.update(str, 'utf-8', 'hex');
        encrypted += cipher.final('hex');

        return `${encrypted}:${iv}`;
    }

    decrypt(str: string, key: string): string {
        let [ encryptedString, iv ] = str.split(':');
        let decipher = crypto.createDecipheriv(CryptoService.algorithm, randomStringBySeed(32, key), iv);

        let decrypted = decipher.update(encryptedString, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}
