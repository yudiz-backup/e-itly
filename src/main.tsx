/* eslint-disable react/no-unknown-property */
import React from "react";
import { render } from "preact";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { Router } from "./navigation/router";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import queryClient from "./queryClient";
import "./assets/scss/main.scss";

render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <script
        src={`https://cdn.tiny.cloud/1/${import.meta.env.VITE_TINY_MCE_API_KEY}/tinymce/5/tinymce.min.js"`}
        referrerpolicy="origin"
      ></script>

      <RecoilNexus />
      <Router />
      <ToastContainer />
      {/* <RouterProvider router={router} /> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById("app") as HTMLElement
);
