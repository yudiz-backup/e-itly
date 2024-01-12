import api from "src/config/api";
import "../config/firebase-init";
import {
  getAuth,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  applyActionCode,
  confirmPasswordReset,
  ApplicationVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { appClient } from "./NetworkService";

export const createAccount = async (
  email: string,
  password: string
): Promise<AsyncResponseType> => {
  try {
    const auth = getAuth();
    const account = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(account.user);

    return {
      success: true,
      message: "Account created successfully, please check email to verify!",
      data: account.user,
    };
  } catch (e: any) {
    if (e.code === "auth/email-already-in-use") {
      return { success: false, message: "Account already exists!" };
    } else return { success: false, message: e.message };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AsyncResponseType> => {
  try {
    const auth = getAuth();
    const account = await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      message: "You have logged in successfully!",
      data: account.user,
    };
  } catch (e: any) {
    if (e.code === "auth/user-not-found") {
      return { success: false, message: "User not found!" };
    } else if (e.code === "auth/wrong-password") {
      return { success: false, message: "Password is incorrect!" };
    } else if (e.code === "auth/user-disabled") {
      return { success: false, message: "Your account is disabled!" };
    } else if (e.code === "auth/invalid-login-credentials") {
      return { success: false, message: "Invalid Credentials." };
    } else return { success: false, message: e.message };
  }
};

export const logout = async (): Promise<AsyncResponseType> => {
  try {
    const auth = getAuth();
    await signOut(auth);
    // window.location.reload();
    return { success: true, message: "Logout successfully!" };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
};

export const sendResetPasswordEmail = async (
  email: string
): Promise<AsyncResponseType> => {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);

    return { success: true, message: "Email sent!" };
  } catch (e: any) {
    if (e.code === "auth/user-not-found") {
      return { success: false, message: "User not found!" };
    } else return { success: false, message: e.message };
  }
};

export const verifyEmail = async (
  actionCode: string
): Promise<AsyncResponseType> => {
  try {
    const auth = getAuth();
    await applyActionCode(auth, actionCode);

    auth.currentUser?.reload();

    return { success: true, message: "Email verified successfully!" };
  } catch (e: any) {
    return {
      success: false,
      message: "Could not verify email, Code is invalid or expired!",
    };
  }
};

export const resetPassword = async ({
  actionCode,
  newPassword
}: {
  actionCode: string,
  newPassword: string
}

): Promise<AsyncResponseType> => {
  try {
    const auth = getAuth();
    await confirmPasswordReset(auth, actionCode, newPassword);
    // await logout();

    return { success: true, message: "Password reset successfully!" };
  } catch (e: any) {
    return {
      success: false,
      message: "Could not reset password, Code is invalid or expired!",
    };
  }
};

export const resendVerificationMail = async (): Promise<AsyncResponseType> => {
  try {
    const auth = getAuth();
    const account = auth.currentUser;

    if (!account) return { success: false, message: "User not logged in!" };

    await sendEmailVerification(account);

    return {
      success: true,
      message: "Verification email resent, please check email to verify!",
    };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
};

export const phoneLogin = async (
  phoneNumber: string,
  reCaptcha: ApplicationVerifier
): Promise<AsyncResponseType> => {
  try {
    const auth = getAuth();
    const result = await signInWithPhoneNumber(auth, phoneNumber, reCaptcha);

    return {
      success: true,
      message: "Otp sent successfully!",
      data: result,
    };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
};

export const confirmOTP = async (
  confirmFunc: ConfirmationResult,
  otp: string
): Promise<AsyncResponseType> => {
  try {
    await confirmFunc.confirm(otp);

    return { success: true, message: "Otp verified successfully!" };
  } catch (e: any) {
    if (e.code === "auth/invalid-verification-code") {
      return { success: false, message: "Invalid code!" };
    } else return { success: false, message: e.message };
  }
};

type RowData = {
  email: string;
}

export async function forgotPassword(
  forgotPasswordData: RowData
): Promise<AsyncResponseType> {

  const url = `${api.auth.forgot_password}`;

  const response = await appClient.post(url, forgotPasswordData);
  return response.data
}