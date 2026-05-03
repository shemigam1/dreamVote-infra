import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/auth";
import { electionApi } from "../api/election";
import voterReducer from "../slice/voterSlice";
import electionReducer from "../slice/electionSlice";
import type { Voter } from "../components/utils/types";

// Synchronously rehydrate the voter from localStorage so the very first render
// already has the logged-in state. Without this, route guards like HomePage's
// auth-check useEffect run before any async rehydration completes and redirect
// to /auth on every refresh.
function loadStoredVoter(): Voter | null {
  try {
    const raw = localStorage.getItem("voter");
    return raw ? (JSON.parse(raw) as Voter) : null;
  } catch {
    localStorage.removeItem("voter");
    return null;
  }
}

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [electionApi.reducerPath]: electionApi.reducer,
    voter: voterReducer,
    election: electionReducer,
  },
  preloadedState: {
    voter: { voter: loadStoredVoter() },
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(electionApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
