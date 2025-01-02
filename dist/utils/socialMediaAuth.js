"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwitterUserData = exports.getFacebookUserData = exports.verifyGoogleAuth = exports.SocialMediaUserData = void 0;
const axios_1 = __importDefault(require("axios"));
const ApiError_1 = __importDefault(require("./ApiError"));
const twitter_lite_1 = __importDefault(require("twitter-lite"));
const logger_1 = require("./logger");
class SocialMediaUserData {
    constructor(username, imageUrl, email, userId) {
        this.username = username;
        this.imageUrl = imageUrl;
        this.email = email;
        this.userId = userId;
    }
}
exports.SocialMediaUserData = SocialMediaUserData;
const verifyGoogleAuth = async (token) => {
    try {
        const response = await axios_1.default.get("https://www.googleapis.com/oauth2/v3/userinfo?", {
            params: {
                access_token: token,
            },
        });
        logger_1.httpLogger.info("google user data", { data: response.data });
        const { email, name, picture, sub } = response.data;
        return new SocialMediaUserData(name, picture, email, sub);
    }
    catch (error) {
        console.log(error);
        console.error("Error fetching Google user data:", error.message, error);
        throw new ApiError_1.default("somthing wrong with token, Unable to fetch user data from Google", 400);
    }
};
exports.verifyGoogleAuth = verifyGoogleAuth;
const getFacebookUserData = async (accessToken) => {
    var _a, _b;
    const url = `https://graph.facebook.com/v21.0/me`;
    try {
        const response = await axios_1.default.get(url, {
            params: {
                fields: "id,name,email,picture",
                access_token: accessToken,
            },
        });
        logger_1.httpLogger.info("facebook user data", { data: response.data });
        return new SocialMediaUserData(response.data.name, (_b = (_a = response.data.picture) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.url, response.data.email, response.data.id); // User data returned from Facebook
    }
    catch (error) {
        console.error("Error fetching Facebook user data:", error.message);
        throw new ApiError_1.default("somthing wrong with token, Unable to fetch user data from Facebook", 400);
    }
};
exports.getFacebookUserData = getFacebookUserData;
// Client ID : UVZ0Yk9rdDJjZEw4TEh5aExKUDU6MTpjaQ
// Client Secret : NhFaufYO6Ppni5oISC23b51t0jo2L8mF5FGR69PR9iBiUawdK7
// apiKey: g5pNEhu4anTFZwsgxA3BJLwM0
// apiSecretKey: SzK1pSu7BYKb1FPlHr9bPEVxVyIHqfsapFptITNEyZww4jy4LC
const getTwitterUserData = async (authToken, authTokenSecret) => {
    try {
        const client = new twitter_lite_1.default({
            consumer_key: process.env.TWITTER_API_KEY,
            consumer_secret: process.env.TWITTER_API_KEY_SECRET,
            access_token_key: authToken,
            access_token_secret: authTokenSecret,
        });
        const user = await client.get("account/verify_credentials", {
            include_email: true,
        });
        logger_1.httpLogger.info("twitter user data", { user });
        return new SocialMediaUserData(user.name, user.profile_image_url, null, user.id);
    }
    catch (error) {
        console.error("Error fetching Twitter user data:", error);
        throw new ApiError_1.default("somthing wrong with token, Unable to fetch user data from twitter", 400);
    }
};
exports.getTwitterUserData = getTwitterUserData;
//# sourceMappingURL=socialMediaAuth.js.map