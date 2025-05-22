import fileUpload from 'express-fileupload';
import { versionNo } from '../../../../helpers/contants';
import { Server } from '../../../../helpers/env';
import { AppError } from '../../../../helpers/errors';
import { Logger } from '../../../../helpers/logger';
import { HealthStatusModel } from '../models/common.model';
import { AwsS3Service } from '../../../../helpers/AwsS3';
import { s3Paths } from '../../../../helpers/entities';

export class CommonService {
  AwsS3Service: AwsS3Service;

  constructor() {
    Logger.info('CommonService initialized...');

    this.AwsS3Service = new AwsS3Service();
  }

  public GetHealthStatus(): HealthStatusModel {
    Logger.info('CommonService.GetHealthStatus');

    return {
      message: 'Server is running',
      environment: Server.ENVIRONMENT,
      versionNo: versionNo,
    };
  }

  public async UploadImage(files: fileUpload.FileArray | null | undefined, path?: s3Paths): Promise<string> {
    Logger.info('CommonService.UploadImage');

    if (!files) throw new AppError(400, 'Missing file');

    const file = files.fileToUpload as fileUpload.UploadedFile;

    const img = await this.AwsS3Service.UploadFileToS3(file.data, file.name, path);

    return img;
  }
}
