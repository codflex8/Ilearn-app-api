import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import multerS3 from "multer-s3";

const config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};
export const s3 = new S3Client(config);

export const checkBucket = async (s3: S3, bucket: string) => {
  try {
    const res = await s3.headBucket({ Bucket: bucket }).promise();

    console.log("Bucket already Exist", res.$response.data);

    return { success: true, message: "Bucket already Exist", data: {} };
  } catch (error) {
    console.log("Error bucket don't exsit", error);

    return { success: false, message: "Error bucket don't exsit", data: error };
  }
};

export const deleteS3File = async (fileKey: string) => {
  try {
    const bucketParams = { Bucket: process.env.AWS_BUCKET_NAME!, Key: fileKey };
    const data = await s3.send(new DeleteObjectCommand(bucketParams));
    return data;
  } catch (error) {
    console.log("Error", error);
  }
};
