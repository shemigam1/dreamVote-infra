import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Election } from "../components/utils/types";

type ElectionState = {
  elections: Election[];
  selectedElection: Election | null;
};

const initialState: ElectionState = {
  elections: [],
  selectedElection: null,
};

const electionSlice = createSlice({
  name: "election",
  initialState,
  reducers: {
    setElections: (state, action: PayloadAction<Election[]>) => {
      state.elections = action.payload;
    },
    setSelectedElection: (state, action: PayloadAction<Election | null>) => {
      state.selectedElection = action.payload;
    },
    clearElections: (state) => {
      state.elections = [];
      state.selectedElection = null;
    },
  },
});

export const { setElections, setSelectedElection, clearElections } =
  electionSlice.actions;
export default electionSlice.reducer;
