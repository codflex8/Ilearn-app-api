"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwitterUserData = exports.getFacebookUserData = exports.verifyGoogleAuth = exports.SocialMediaUserData = void 0;
const axios_1 = __importDefault(require("axios"));
const google_auth_library_1 = require("google-auth-library");
const ApiError_1 = __importDefault(require("./ApiError"));
const twitter_api_v2_1 = require("twitter-api-v2");
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
        const response = await axios_1.default.get("https://www.googleapis.com/oauth2/v3/userinfo?", {
            params: {
                access_token: token,
            },
        });
        // console.log(response.data.data);
        console.log("tokennnnnn", token);
        // const ticket = await client.verifyIdToken({
        //   idToken: token,
        //   audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        //   // Or, if multiple clients access the backend:
        //   //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        // });
        // const payload = ticket.getPayload();
        // const userid = payload["sub"];
        const { email, name, picture, sub } = response.data;
        return new SocialMediaUserData(name, picture, email, sub);
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
// Client ID : UVZ0Yk9rdDJjZEw4TEh5aExKUDU6MTpjaQ
// Client Secret : NhFaufYO6Ppni5oISC23b51t0jo2L8mF5FGR69PR9iBiUawdK7
// apiKey: g5pNEhu4anTFZwsgxA3BJLwM0
// apiSecretKey: SzK1pSu7BYKb1FPlHr9bPEVxVyIHqfsapFptITNEyZww4jy4LC
const twitterClient = new twitter_api_v2_1.TwitterApi({
    appKey: "your-app-key", // Replace with your App Key
    appSecret: "your-app-secret", // Replace with your App Secret
});
const getTwitterUserData = async (accessToken) => {
    const userUrl = "https://api.twitter.com/2/users/me";
    // const authClient = new auth.OAuth2User({
    //   client_id: "UVZ0Yk9rdDJjZEw4TEh5aExKUDU6MTpjaQ",
    //   client_secret: "NhFaufYO6Ppni5oISC23b51t0jo2L8mF5FGR69PR9iBiUawdK7",
    //   callback: "YOUR-CALLBACK",
    //   scopes: ["tweet.read", "users.read", "offline.access"],
    //   token: { access_token: accessToken,token_type:"bearer" ,refresh_token: "" },
    // });
    //1868991708572037120-4iBhnz3MFJVQ81Eqxyu17BM61rzDVL
    //XzPSxhL5eYNHdCTHjCRVv9wiVcSxUKiia8VuBtLIH6AQM
    // authClient.getAuthHeader
    try {
        const twitterClient = new twitter_api_v2_1.TwitterApi({
            appKey: "g5pNEhu4anTFZwsgxA3BJLwM0",
            appSecret: "SzK1pSu7BYKb1FPlHr9bPEVxVyIHqfsapFptITNEyZww4jy4LC",
            accessToken,
        });
        const userData = await twitterClient.v2.me();
        console.log("userDataaaaaaaa", userData);
        // const authenticatedClient = new TwitterApi(accessToken);
        // // Fetch the authenticated user's data
        // const userData = await authenticatedClient.v2.me();
        // console.log("userDataaaaaa", userData);
        // const twitterClient = new Client(authClient);
        // const getCurrentUser = await twitterClient.users.findMyUser();
        // console.log("getCurrentUserrrrrrr", getCurrentUser);
        // const response = await axios.get(userUrl, {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //     "Content-type": "application/json",
        //   },
        //   // params: {
        //   //   "user.fields": "id,name,username,profile_image_url,email",
        //   // },
        // });
        // const userClient = new TwitterApi(`bearer ${accessToken}`);
        // // const userClient = twitterClient.readWrite.accessToken(accessToken);
        // console.log("send token to twitterrrr", accessToken);
        // // Fetch user data
        // const userResult = await userClient.currentUserV2();
        // console.log("userResultuserResult", userResult);
        // const response = await userClient.v2.me(); // Retrieves authenticated user info
        // // return userData;
        // console.log("twitter responseee", response.data);
        return new SocialMediaUserData(userData.data.name, userData.data.profile_image_url, null, userData.data.id);
    }
    catch (error) {
        console.error("Error fetching Twitter user data:", error);
        throw new ApiError_1.default("somthing wrong with token, Unable to fetch user data from twitter", 400);
    }
};
exports.getTwitterUserData = getTwitterUserData;
//# sourceMappingURL=socialMediaAuth.js.map