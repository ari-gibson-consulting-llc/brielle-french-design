interface Env {
  TURNSTILE_SECRET_KEY: string;
}

type ContactForm = {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  message: FormDataEntryValue | null;
};

type ValidateTurnstileParams = {
  secret: string;
  turnstileResponse: string;
};

type ValidateTurnstileRequestResponse = {
  success: boolean;
  "error-codes": string[];
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { name, email, message, turnstileResponse } =
    (await context.request.json()) as any;

  const contactFormErrors = validateContactFormInput({ name, email, message });
  if (contactFormErrors.length > 0) {
    return new Response(contactFormErrors.join("\n"), { status: 400 });
  }

  const turnstileErrors = await validateTurnstile({
    secret: context.env.TURNSTILE_SECRET_KEY,
    turnstileResponse,
  });

  if (turnstileErrors.length > 0)
    // prettier-ignore
    return new Response(`Error validating Turnstile Token: ${turnstileErrors.join(",")}`, { status: 400 });

  return new Response("hi there!");
};

function validateContactFormInput(input: ContactForm): string[] {
  const requiredFields = ["name", "email", "message"] as const;
  const missingFields = requiredFields.filter((field) => !input[field]);
  const invalidFields = requiredFields.filter(
    (field) => !missingFields.includes(field) && typeof input[field] !== "string"
  );

  const errors: string[] = [];

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(", ")}`);
  }

  if (invalidFields.length > 0) {
    errors.push(`Invalid field types: ${invalidFields.join(", ")}`);
  }

  return errors;
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
    throw new Error("Something went wrong");
  }

  const response = (await request.json()) as ValidateTurnstileRequestResponse;

  if (!response.success) {
    return response["error-codes"];
  }

  return [];
}
