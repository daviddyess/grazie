/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import { getLogger } from '~/utils/logger.server';
import path from 'path';
import config from '~/utils/config.server';

const log = getLogger('Storage Module');

const s3Options = {
  region: config[config.s3Provider].region,
  accessKeyId: config[config.s3Provider].accessKeyId,
  secretAccessKey: config[config.s3Provider].secretAccessKey
};

if (config[config.s3Provider]?.endpoint) {
  s3Options.endpoint = config[config.s3Provider].endpoint;
}

export const s3Client = new S3Client(s3Options);

export const s3Delete = async ({
  Bucket = config[config.s3Provider].bucket,
  folder = '',
  file
}) => {
  try {
    const Key = `${folder}${file}`;

    await s3Client.send(new DeleteObjectCommand({ Bucket, Key }));
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
};

export const s3Upload = async ({
  ACL = 'public-read',
  Bucket = config[config.s3Provider].bucket,
  file,
  deleteFile = false,
  name = false,
  folder = false,
  unlink = true
}) => {
  try {
    const Body = fs.createReadStream(file);

    Body.on('error', function (err) {
      throw err;
    });
    folder = folder ? `${folder}/` : '';
    const Key = name ? `${folder}${name}` : `${folder}${path.basename(file)}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body,
        ACL
      }
    });

    upload.on('httpUploadProgress', (progress) => {
      log.info(`Uploaded ${progress.Key} to ${progress.Bucket}`);
    });

    const data = await upload.done();
    // Delete local copy
    if (unlink) {
      fs.unlink(file, (unlinkError) => {
        if (unlinkError) {
          throw unlinkError;
        }
      });
    }
    // Delete old file from S3
    if (deleteFile) {
      const res = await s3Client.send(
        new DeleteObjectCommand({ Bucket, Key: `${folder}${deleteFile}` })
      );
    }
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
};

const storage = {
  s3Upload,
  s3Delete
};

export default storage;
