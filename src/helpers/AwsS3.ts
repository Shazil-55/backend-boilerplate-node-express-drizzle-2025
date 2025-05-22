import { Logger } from './logger';
import { PutObjectAclCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Env } from '.';

export class AwsS3Service {
  private S3: S3Client;

  constructor() {
    Logger.info('AwsS3Service initialized...');

    this.S3 = new S3Client({
      region: Env.AWS.REGION,
      credentials: {
        accessKeyId: Env.AWS.ACCESS_KEY_ID,
        secretAccessKey: Env.AWS.SECRET_ACCESS_KEY,
      },
    });
  }

  public async UploadFileToS3(file: Buffer, name: string, path = ''): Promise<string> {
    Logger.info('AwsS3Service.UploadFileToS3', { name, path });
    const fileName = `${path}${Date.now()}-${name.replace(/ /g, '_')}`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: Env.AWS.BUCKET_NAME,
      Body: file,
      Key: fileName,
      ACL: 'public-read',
    };

    await this.S3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `${Env.AWS.CLOUDFRONT_DOMAIN}/${fileName}`;

    return fileUrl;
  }

  public async MakeFilePublic(key: string): Promise<void> {
    Logger.info('AwsS3Service.MakeFilePublic', { key });

    await this.S3.send(
      new PutObjectAclCommand({
        Bucket: Env.AWS.BUCKET_NAME,
        Key: key,
        ACL: 'public-read',
      }),
    );
  }

  public async GeneratePresignedPutUrl(
    fileName: string,
    path = '',
    expiresInSeconds = 1800,
  ): Promise<{ signedUrl: string; key: string }> {
    const key = `${path ? path + '/' : ''}dwg-files/${Date.now()}-${fileName.replace(/ /g, '_')}.dwg`;

    const command = new PutObjectCommand({
      Bucket: Env.AWS.BUCKET_NAME,
      Key: key,
      ContentType: 'application/octet-stream', // expected DWG output
      ACL: 'public-read',
    });

    const url = 'https://vertify-analytics-v2-dev.s3.us-east-1.amazonaws.com/' + key;

    const signedUrl = await getSignedUrl(this.S3 as any, command as any, {
      expiresIn: expiresInSeconds,
    });

    return { signedUrl, key: url };
  }
}
