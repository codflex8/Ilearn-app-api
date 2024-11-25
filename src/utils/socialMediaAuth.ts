import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();
export const verifyGoogleAuth = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  const { email, name, picture, locale } = payload;
  return { email, name, picture, locale, userid };
  // If the request specified a Google Workspace domain:
  // const domain = payload['hd'];
};
