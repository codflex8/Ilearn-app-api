import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import ApiError from "./ApiError";
import { TwitterApi } from "twitter-api-v2";
import { auth, Client } from "twitter-api-sdk";
import Twitter from "twitter-lite";
export class SocialMediaUserData {
  constructor(
    public username: string,
    public imageUrl: string,
    public email: string,
    public userId?: string
  ) {}
}

const client = new OAuth2Client();
export const verifyGoogleAuth = async (token: string) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo?",
      {
        params: {
          access_token: token,
        },
      }
    );
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
  } catch (error: any) {
    console.log(error);
    console.error("Error fetching Google user data:", error.message, error);
    throw new ApiError(
      "somthing wrong with token, Unable to fetch user data from Google",
      400
    );
  }
};

export const getFacebookUserData = async (
  accessToken: string
): Promise<SocialMediaUserData> => {
  const url = `https://graph.facebook.com/v21.0/me`;

  try {
    const response = await axios.get(url, {
      params: {
        fields: "id,name,email,picture",
        access_token: accessToken,
      },
    });
    console.log(response.data);
    return new SocialMediaUserData(
      response.data.name,
      response.data.picture?.data?.url,
      response.data.email,
      response.data.id
    ); // User data returned from Facebook
  } catch (error: any) {
    console.error("Error fetching Facebook user data:", error.message);
    throw new ApiError(
      "somthing wrong with token, Unable to fetch user data from Facebook",
      400
    );
  }
};

// Client ID : UVZ0Yk9rdDJjZEw4TEh5aExKUDU6MTpjaQ
// Client Secret : NhFaufYO6Ppni5oISC23b51t0jo2L8mF5FGR69PR9iBiUawdK7
// apiKey: g5pNEhu4anTFZwsgxA3BJLwM0
// apiSecretKey: SzK1pSu7BYKb1FPlHr9bPEVxVyIHqfsapFptITNEyZww4jy4LC

// ***
// api key:iuuKoFJr4yuomY59WODVhH0zl
// api key secret:ssY0zEw8kDTXzHVyghT6OkGtVIT9xrLmKMb1VwS9mItnS6oHVz
// bearer token: AAAAAAAAAAAAAAAAAAAAACplxgEAAAAAZS0zVycba%2FE%2FE72LyrEnBjHFtuk%3Db6tWw38g3R2mtlWqjFLTIzYspTIq38vIcoMKTsc6psiHmVpeXU
// access token: 1868991708572037120-KEPUF1YiqBHTm3IHGFBpqsN5MuANlV
//acces token secret: v1660wHYK8m3tSPRPSKtnUQQWnv2ITIOzOYNWqIFWY5Y0
// client id: QU9scmJNR3MyVTBidjBFRHZneEQ6MTpjaQ
// client secret: Drv2Z7dcmglW_bKNPYjdHNRACvkA5LRp45SC7zzESlgRXNHU7o
// Drv2Z7dcmglW_bKNPYjdHNRACvkA5LRp45SC7zzESlgRXNHU7o

const twitterClient = new TwitterApi({
  appKey: "your-app-key", // Replace with your App Key
  appSecret: "your-app-secret", // Replace with your App Secret
});
export const getTwitterUserData = async (
  authToken: string,
  authTokenSecret: string
): Promise<any> => {
  // const userUrl = "https://api.twitter.com/2/users/me";
  // const twitterClient = new TwitterApi({
  //   accessToken:"1868991708572037120-KEPUF1YiqBHTm3IHGFBpqsN5MuANlV",
  //   accessSecret: "v1660wHYK8m3tSPRPSKtnUQQWnv2ITIOzOYNWqIFWY5Y0",
  // });

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
    const client = new Twitter({
      consumer_key: "g5pNEhu4anTFZwsgxA3BJLwM0",
      consumer_secret: "SzK1pSu7BYKb1FPlHr9bPEVxVyIHqfsapFptITNEyZww4jy4LC",
      access_token_key: authToken,
      access_token_secret: authTokenSecret,
      // access_token_key: "1777851158435876864-KJkiuJ9DclqzySOO1bgVMyxN82sY5M",
      // access_token_secret: "XtyM7pztrkXES9tp6eyX2soN0gOxmhZG3CauaMfD7HJJu",
    });
    const user = await client.get("account/verify_credentials", {
      include_email: true,
    });
    console.log("userrrrrrr", user);

    // const twitterClient = new TwitterApi({
    //   clientId: "UVZ0Yk9rdDJjZEw4TEh5aExKUDU6MTpjaQ",
    //   clientSecret: "NhFaufYO6Ppni5oISC23b51t0jo2L8mF5FGR69PR9iBiUawdK7",
    //   // appKey: "g5pNEhu4anTFZwsgxA3BJLwM0",
    //   // appSecret: "SzK1pSu7BYKb1FPlHr9bPEVxVyIHqfsapFptITNEyZww4jy4LC",
    //   // accessToken,
    // });
    // twitterClient.loginWithOAuth2().then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
    //   // {loggedClient} is an authenticated client in behalf of some user
    //   // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
    //   // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

    //   // Example request
    //   const { data: userObject } = await loggedClient.v2.me();
    // // })
    // const userData = await twitterClient.v2.me();
    // console.log("userDataaaaaaaa", userData);
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
    return new SocialMediaUserData(
      user.name,
      user.profile_image_url,
      null,
      user.id
    );
  } catch (error: any) {
    console.error("Error fetching Twitter user data:", error);
    throw new ApiError(
      "somthing wrong with token, Unable to fetch user data from twitter",
      400
    );
  }
};
