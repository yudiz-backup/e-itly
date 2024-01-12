// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { firebaseConfig } from "./firebase-config";

function initializeAppIfNecessary() {
  try {
    return getApp();
  } catch (any) {
    return initializeApp(firebaseConfig);
  }
}

export const app = initializeAppIfNecessary();
