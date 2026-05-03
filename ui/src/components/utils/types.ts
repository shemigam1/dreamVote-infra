export type Voter = {
  firstName?: string;
  lastName?: string;
  voterId: string;
  email: string;
  isLoggedIn: boolean;
};

export type Candidate = {
  firstName: string;
  lastName: string;
};

export type ElectionSummary = {
  id: string;
  title: string | null;
  createdAt: string;
  active: boolean;
  candidateCount: number;
  voteCount: number;
};

export type Election = {
  id: string;
  title: string | null;
  description: string | null;
  createdBy: string;
  candidates: Candidate[];
  poll: Record<string, number>;
  createdAt: string;
  active: boolean;
  voteCount: number;
};
