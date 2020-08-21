import { GraphAuthProvider } from './GraphAuthProvider';

// Set the authProvider to an instance
// of GraphAuthProvider
const clientOptions = {
  authProvider: new GraphAuthProvider()
};

export class GraphManager {
  static getUserAsync = async() => {
    let user = {
      givenName: "User",
      accessToken: "",
      userLoading: false,
    };
    // user = userDetail;
    user.accessToken = await clientOptions.authProvider.getAccessToken();
    // let userDetailWithToken = Object.assign({}, userDetail, clientOptions.authProvider);
    return user;
  }
}