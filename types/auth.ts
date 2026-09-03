export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  accessTokenExpiresIn: number;
};

export type RegisterResponse = {
  userId: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
};

export type CurrentUser = {
  userId: string;
  email: string;
  roles: string[];
};

export type ApiMessage = {
  message: string;
};
