type ContactForm = {
  name?: string;
  email?: string;
  message?: string;
};

type ContactFormSubmission = {
  name: string;
  email: string;
  message: string;
  turnstileResponse: string;
};

export function validateContactFormInput(form: ContactForm): string[] {
  const requiredFields = ["name", "email", "message"] as const;
  const missingFields = requiredFields.filter((field) => !form[field]);

  return missingFields.length > 0
    ? [`Missing required fields: ${missingFields.join(", ")}`]
    : [];
}

export async function submitForm(form: ContactFormSubmission) {
  const response = await fetch("/contactFormSubmission", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
}
