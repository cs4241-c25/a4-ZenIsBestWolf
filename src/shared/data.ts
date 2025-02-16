export interface FormSubmission {
  location: string;
  start: Date;
  end: Date;
  name: string;
}

export interface ApplicationData extends FormSubmission {
  id: string;
}
