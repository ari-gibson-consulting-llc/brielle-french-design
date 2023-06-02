interface Env {
  TURNSTILE_SECRET_KEY: string;
  BREVO_API_KEY: string;
}

interface ContactForm {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  message: FormDataEntryValue | null;
}

interface SendEmailParams extends ContactForm {
  apiKey: string;
}

interface ValidateTurnstileParams {
  secret: string;
  turnstileResponse: string;
}

interface ValidateTurnstileRequestResponse {
  success: boolean;
  "error-codes": string[];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { name, email, message, turnstileResponse } =
    (await context.request.json()) as any;

  const contactFormInputValidated = validateContactFormInput({
    name,
    email,
    message,
  });

  // if errors in validation, return response from validateContactFormInput
  if (!contactFormInputValidated) return contactFormInputValidated;

  const turnstileValidated = await validateTurnstile({
    secret: context.env.TURNSTILE_SECRET_KEY,
    turnstileResponse,
  });

  // if errors in validation, return response from validateTurnstile
  if (!turnstileValidated) return turnstileValidated;

  return sendEmail({ name, email, message, apiKey: context.env.BREVO_API_KEY });
};

function validateContactFormInput(input: ContactForm) {
  const requiredFields = ["name", "email", "message"] as const;
  const missingFields = requiredFields.filter((field) => !input[field]);
  const invalidFields = requiredFields.filter(
    (field) =>
      !missingFields.includes(field) && typeof input[field] !== "string"
  );

  const errors: string[] = [];

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(", ")}`);
  }

  if (invalidFields.length > 0) {
    errors.push(`Invalid field types: ${invalidFields.join(", ")}`);
  }

  if (errors.length > 0) {
    return new Response(errors.join("\n"), { status: 400 });
  }

  // no errors
  return true;
}

async function validateTurnstile(input: ValidateTurnstileParams) {
  const { secret, turnstileResponse } = input;
  const request = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        response: turnstileResponse,
      }),
    }
  );

  if (!request.ok) {
    return new Response("Network error validating Turnstile token", {
      status: 500,
    });
  }

  const response = (await request.json()) as ValidateTurnstileRequestResponse;

  if (!response.success) {
    return new Response(
      `Error validating Turnstile token: ${response["error-codes"].join(",")}`,
      { status: 400 }
    );
  }

  // no errors
  return true;
}

async function sendEmail(input: SendEmailParams) {
  const { name, email, message, apiKey } = input;

  const request = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: "Form @ Brielle French Design",
        email: "form@briellefrenchdesign.com",
      },
      to: [
        {
          email: "Brielle French",
          name: "hi@briellefrenchdesign.com",
        },
      ],
      templateId: "adfasdf",
    }),
  });

  if (request.status === 201) {
    return new Response("Email sent successfully", { status: 200 });
  }

  return new Response("Error sending email", { status: 500 });
}
