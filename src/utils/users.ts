import { localStorageKey, userRoles } from "src/constants/generics";
import { getItem } from "./storage";

export const formatUsers = (users: Array<object>): Array<UserModel> => {
  const allUsers: Array<UserModel> = [];

  users.forEach((user: UserType) => {
    const newUser: UserModel = {
      id: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      admin: user.customClaims?.admin ? true : false,
      disabled: user.disabled,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastRefreshTime: user.metadata.lastRefreshTime,
        lastSignInTime: user.metadata.lastSignInTime,
      },
      tokensValidAfterTime: user.tokensValidAfterTime,
      isBusy: false,
    };
    allUsers.push(newUser);
  });

  return allUsers;
};

export const formatUserDetails = (user: UserDetailsType): UserDetailsModel => {
  const newUser: UserDetailsModel = {
    id: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    admin: user.customClaims?.admin ? true : false,
    disabled: user.disabled,
    metadata: {
      creationTime: user.metadata.creationTime,
      lastRefreshTime: user.metadata.lastRefreshTime,
      lastSignInTime: user.metadata.lastSignInTime,
    },
    tokensValidAfterTime: user.tokensValidAfterTime,
    isBusy: false,
    displayName: user.displayName ? user.displayName : "",
    photoURL: user.photoURL,
  };

  return newUser;
};

export const checkUserPermission = (key: string, permission: string) => {
  const user = getItem(localStorageKey.userInfo);
  return user?.data?.permission[key]?.includes(permission)
};

export function kFormatter(num: number) {
  return Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num);
}

export function isSuperAdmin() {
  return (localStorage.getItem(localStorageKey.userRole) === userRoles?.superAdmin)
}

export function isBooker() {
  return (localStorage.getItem(localStorageKey.userRole) === userRoles?.booker)
}