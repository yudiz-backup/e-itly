import { hasSuccess, hasError } from "../services/ApiHelpers";
import { appClient } from "../services/NetworkService";
import api from "../config/api";
import {
  AuthCredential,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export async function getUser(uid: string): Promise<AsyncResponseType> {
  const url = `${api.sub_admin_module.sub_admin}/${uid}`;

  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error) {
    return hasError(error);
  }
}

export async function changeUserPassword(
  credentials: AuthCredential,
  newPassword: string
): Promise<AsyncResponseType> {
  try {
    const auth = getAuth();
    const currentUser: any = auth.currentUser;
    await reauthenticateWithCredential(currentUser, credentials);
    const account = await updatePassword(currentUser, newPassword);
    return {
      success: true,
      message: "You have Updated Password successfully!",
      data: account,
    };
  } catch (e: any) {
    if (e.code === "auth/wrong-password") {
      return { success: false, message: "Invalid current password." };
    } else if (e.code === "auth/invalid-login-credentials") {
      return { success: false, message: "Invalid current password." };
    } else {
      return { success: false, message: e.message };
    }
  }
}
export async function fetchImageUrl(id: any): Promise<AsyncResponseType> {
  const url = `${api.image.fetch_image_url}/${id}`;
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function updateUser(
  userObj: FormData,
  uid: string
): Promise<AsyncResponseType> {
  const url = `${api.sub_admin_module.sub_admin}/${uid}`;
  try {
    const response = await appClient.put(url, userObj, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      data: response?.data,
      success: response?.data?.success,
      message: response?.data?.message,
      status: response?.data?.code,
    };
  } catch (error: any) {
    return hasError(error);
  }
}
export async function fetchMultipleImageUrl(
  images: any
): Promise<AsyncResponseType> {
  const url = `${api.image.fetch_multiple_image_url}`;
  try {
    const response = await appClient.post(url, images, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

export async function extractImageSrc(
  htmlCode: any,
  formData: any,
  files: any,
  beforeHtml: any
): Promise<AsyncResponseType> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, "text/html");

    // Find all img elements in the HTML code
    const imageElements = doc.querySelectorAll("img");

    const imageSrcList: any = Array.from(imageElements).map((imageElement) =>
      imageElement.getAttribute("src")
    );

    let count = 0;
    for (const src of imageSrcList) {
      const fileReturn = await fetchAndAppendFile(src, count + 1);
      files.push(fileReturn);
      formData.append("image", fileReturn);
      count++;
    }
    //fetch Image Urls From Editor
    let blockPromises: any = [];

    if (imageSrcList?.length) {
      const userProfile: AsyncResponseType = await fetchMultipleImageUrl(
        formData
      );
      if (userProfile?.success) {
        blockPromises = userProfile?.data;
        //fields[2]?.value
        const modifiedCode = beforeHtml.replace(
          /<img[^>]+src="([^">]+)"/g,
          (match, src) => {
            const blobIndex = imageSrcList?.findIndex(
              (imgSrc: any) => imgSrc === src
            );
            const iamgeUrl = blockPromises[blobIndex];
            return `<img src="${iamgeUrl}"`;
          }
        );

        return hasSuccess({
          data: modifiedCode,
          success: true,
          message: "",
          status: 200,
        });
      }
    } else {
      return hasSuccess({
        data: htmlCode,
        success: true,
        message: "",
        status: 200,
      });
    }
  } catch (error: any) {
    return hasError(error);
  }
}

const fetchAndAppendFile = async (src: string, count: number) => {
  const fileName = `${count}myfile.jpg`;

  try {
    const response = await fetch(src);
    const contentType = response.headers.get("content-type");
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: contentType });
    return file;
    // access file here
  } catch (error) {
    console.error("Error fetching or processing file:", error);
  }
};
