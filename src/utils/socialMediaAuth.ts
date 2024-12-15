import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import ApiError from "./ApiError";
import { TwitterApi } from "twitter-api-v2";

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

const twitterClient = new TwitterApi({
  appKey: "your-app-key", // Replace with your App Key
  appSecret: "your-app-secret", // Replace with your App Secret
});
export const getTwitterUserData = async (accessToken: string): Promise<any> => {
  const userUrl = "https://api.twitter.com/2/users/me";

  try {
    // const response = await axios.get(userUrl, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     "Content-type": "application/json",
    //   },

    //   // params: {
    //   //   "user.fields": "id,name,username,profile_image_url,email",
    //   // },
    // });
    const userClient = new TwitterApi(accessToken);
    // const userClient = twitterClient.readWrite.accessToken(accessToken);
    console.log("send token to twitterrrr", accessToken);
    // Fetch user data
    const response = await userClient.v2.me(); // Retrieves authenticated user info
    // return userData;
    console.log("twitter responseee", response.data);
    return new SocialMediaUserData(
      response.data.name,
      response.data.profile_image_url,
      null,
      response.data.id
    );
  } catch (error: any) {
    console.error("Error fetching Twitter user data:", error);
    throw new ApiError(
      "somthing wrong with token, Unable to fetch user data from twitter",
      400
    );
  }
};
