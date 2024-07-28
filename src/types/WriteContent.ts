type WriteContent = {
  title: string;
  content: string;
};

type PartyContent = WriteContent & {
  partySize: number;
  partyTime: string;
  partyOption: string;
};

export type { WriteContent, PartyContent };
