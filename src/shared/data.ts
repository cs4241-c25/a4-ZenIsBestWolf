export interface FormSubmission {
  location: string;
  start: Date;
  end: Date;
}

export interface ApplicationData extends FormSubmission {
  id: string;
  author: string;
}
