"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBucket = exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};
exports.s3 = new client_s3_1.S3Client(config);
const checkBucket = async (s3, bucket) => {
    try {
        const res = await s3.headBucket({ Bucket: bucket }).promise();
        console.log("Bucket already Exist", res.$response.data);
        return { success: true, message: "Bucket already Exist", data: {} };
    }
    catch (error) {
        console.log("Error bucket don't exsit", error);
        return { success: false, message: "Error bucket don't exsit", data: error };
    }
};
exports.checkBucket = checkBucket;
//# sourceMappingURL=uploadToAws.js.map