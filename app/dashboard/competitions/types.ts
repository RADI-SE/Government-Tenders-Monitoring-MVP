export type TenderStatus = {
  _id: string;
  id: string;
  name: string;
};

export type Competition = {
  _id: string;
  id: number;

  reference_number: string;
  tender_name: string;

  created_at: string;
  last_submission_date: string;

  original_status: string;

  status: TenderStatus;

  raw_data: {
    agency: {
      id: number;
      name: string;
    };
  };
};