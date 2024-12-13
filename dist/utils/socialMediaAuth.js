"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwitterUserData = exports.getFacebookUserData = exports.verifyGoogleAuth = exports.SocialMediaUserData = void 0;
const axios_1 = __importDefault(require("axios"));
const google_auth_library_1 = require("google-auth-library");
const ApiError_1 = __importDefault(require("./ApiError"));
class SocialMediaUserData {
    constructor(username, imageUrl, email, userId) {
        this.username = username;
        this.imageUrl = imageUrl;
        this.email = email;
        this.userId = userId;
    }
}
exports.SocialMediaUserData = SocialMediaUserData;
const client = new google_auth_library_1.OAuth2Client();
const verifyGoogleAuth = async (token) => {
    try {
        // const response = await axios.get(
        //   "https://oauth2.googleapis.com/tokeninfo?",
        //   {
        //     params: {
        //       id_token: token,
        //     },
        //   }
        // );
        // console.log(response.data.data);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload["sub"];
        const { email, name, picture, locale } = payload;
        return new SocialMediaUserData(name, picture, email, userid);
        // If the request specified a Google Workspace domain:
        // const domain = payload['hd'];
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
        console.log(response.data);
        return new SocialMediaUserData(response.data.name, (_b = (_a = response.data.picture) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.url, response.data.email, response.data.id); // User data returned from Facebook
    }
    catch (error) {
        console.error("Error fetching Facebook user data:", error.message);
        throw new ApiError_1.default("somthing wrong with token, Unable to fetch user data from Facebook", 400);
    }
};
exports.getFacebookUserData = getFacebookUserData;
const getTwitterUserData = async (accessToken) => {
    const userUrl = "https://api.twitter.com/2/users/me";
    try {
        const response = await axios_1.default.get(userUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-type": "application/json",
            },
            // params: {
            //   "user.fields": "id,name,username,profile_image_url,email",
            // },
        });
        console.log("twitter responseee", response.data);
        return new SocialMediaUserData(response.data.data.name, response.data.data.profileImage, response.data.data.email, response.data.data.id);
    }
    catch (error) {
        console.error("Error fetching Twitter user data:", error.message);
        throw new ApiError_1.default("somthing wrong with token, Unable to fetch user data from twitter", 400);
    }
};
exports.getTwitterUserData = getTwitterUserData;
//# sourceMappingURL=socialMediaAuth.js.map