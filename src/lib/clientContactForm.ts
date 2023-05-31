type ContactForm = {
  name?: string;
  email?: string;
  message?: string;
};

export function validateContactFormInput(form: ContactForm): string[] {
  const requiredFields = ["name", "email", "message"] as const;
  const missingFields = requiredFields.filter((field) => !form[field]);

  return missingFields.length > 0
    ? [`Missing required fields: ${missingFields.join(", ")}`]
    : [];
}