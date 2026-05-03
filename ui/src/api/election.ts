import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

export const electionApi = createApi({
  reducerPath: "electionApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Elections"],
  endpoints: (builder) => ({
    getAllElections: builder.query({
      query: () => "/elections",
      providesTags: [{ type: "Elections", id: "LIST" }],
    }),
    getElectionById: builder.query({
      query: (electionId: string) => `/elections/${electionId}`,
      providesTags: (_result, _error, electionId) => [
        { type: "Elections", id: electionId },
      ],
    }),
    getElectionsByCreator: builder.query({
      query: (voterId: string) => `/elections/creator/${voterId}`,
      providesTags: [{ type: "Elections", id: "LIST" }],
    }),
    createElection: builder.mutation({
      query: (body) => ({ url: "/elections/", method: "POST", body }),
      // New election affects every list view but no specific existing ID.
      invalidatesTags: [{ type: "Elections", id: "LIST" }],
    }),
    activateElection: builder.mutation({
      query: ({ electionId, ...body }) => ({
        url: `/elections/${electionId}/activate`,
        method: "PATCH",
        body,
      }),
      // Affects this election's detail AND any list view that shows phase.
      invalidatesTags: (_r, _e, { electionId }) => [
        { type: "Elections", id: electionId },
        { type: "Elections", id: "LIST" },
      ],
    }),
    deactivateElection: builder.mutation({
      query: ({ electionId, ...body }) => ({
        url: `/elections/${electionId}/deactivate`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { electionId }) => [
        { type: "Elections", id: electionId },
        { type: "Elections", id: "LIST" },
      ],
    }),
    nominateCandidate: builder.mutation({
      query: (body) => ({ url: "/elections/nominate", method: "POST", body }),
      // Adds a candidate -> only the affected election's queries need to
      // refetch (detail + candidates + polls); list views care because the
      // candidateCount changes.
      invalidatesTags: (_r, _e, { electionId }) => [
        { type: "Elections", id: electionId },
        { type: "Elections", id: "LIST" },
      ],
    }),
    vote: builder.mutation({
      query: (body) => ({ url: "/elections/vote", method: "POST", body }),
      invalidatesTags: (_r, _e, { electionId }) => [
        { type: "Elections", id: electionId },
        { type: "Elections", id: "LIST" },
      ],
    }),
    getPolls: builder.query({
      query: (electionId: string) => `/elections/${electionId}/polls`,
      providesTags: (_result, _error, electionId) => [
        { type: "Elections", id: electionId },
      ],
    }),
    getAllCandidates: builder.query({
      query: (electionId: string) => ({
        url: "/elections/candidates",
        method: "GET",
        body: { electionId },
      }),
      providesTags: (_result, _error, electionId) => [
        { type: "Elections", id: electionId },
      ],
    }),
  }),
});

export const {
  useGetAllElectionsQuery,
  useGetElectionByIdQuery,
  useGetElectionsByCreatorQuery,
  useCreateElectionMutation,
  useActivateElectionMutation,
  useDeactivateElectionMutation,
  useNominateCandidateMutation,
  useVoteMutation,
  useGetPollsQuery,
  useGetAllCandidatesQuery,
} = electionApi;
