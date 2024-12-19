import axios from "axios";
import ApiError from "./ApiError";
import Twitter from "twitter-lite";
import { httpLogger } from "./logger";
export class SocialMediaUserData {
  constructor(
    public username: string,
    public imageUrl: string,
    public email: string,
    public userId?: string
  ) {}
}

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
    httpLogger.info("twitter user data", { data: response.data });

    const { email, name, picture, sub } = response.data;
    return new SocialMediaUserData(name, picture, email, sub);
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
    httpLogger.info("twitter user data", { data: response.data });
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

export const getTwitterUserData = async (
  authToken: string,
  authTokenSecret: string
): Promise<any> => {
  try {
    const client = new Twitter({
      consumer_key: process.env.TWITTER_API_KEY,
      consumer_secret: process.env.TWITTER_API_KEY_SECRET,
      access_token_key: authToken,
      access_token_secret: authTokenSecret,
    });
    const user = await client.get("account/verify_credentials", {
      include_email: true,
    });
    httpLogger.info("twitter user data", { user });

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
