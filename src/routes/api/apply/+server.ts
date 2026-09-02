import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { CONTACT_EMAIL } from '$lib/config';
import { parentConfirmationEmail, internalNotificationEmail } from '$lib/server/emailTemplates';
import type { ApplicationDetails } from '$lib/server/emailTemplates';
import type { RequestHandler } from './$types';

const GOOGLE_FORM_ACTION =
	'https://docs.google.com/forms/d/e/1FAIpQLSe1AAuvBzS6Fo0CxiBeQu0qnAaPsNG229g5WZzaPyKGtKW4YQ/formResponse';

const FROM_EMAIL = 'ESTEM Academy <bookings@estem-academy.com>';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type ApplyPayload = ApplicationDetails & {
	formEntries: Record<string, string[]>;
};

async function sendEmail(to: string, subject: string, html: string, text: string) {
	const { data, error } = await resend!.emails.send({ from: FROM_EMAIL, to, subject, html, text });
	if (error) {
		console.error('Resend email failed', to, subject, error);
	} else {
		console.log('Resend email sent', to, subject, data?.id);
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const payload = (await request.json()) as ApplyPayload;
	const { formEntries, parentName, phone, email, yearGroup, subjects, examBoard, plan } = payload;

	const params = new URLSearchParams();
	for (const [key, values] of Object.entries(formEntries)) {
		for (const value of values) params.append(key, value);
	}

	const tasks: Promise<unknown>[] = [
		fetch(GOOGLE_FORM_ACTION, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params
		}).catch((err) => console.error('Google Form submission failed', err))
	];

	if (resend) {
		const details: ApplicationDetails = { parentName, phone, email, yearGroup, subjects, examBoard, plan };

		const parentEmail = parentConfirmationEmail(details);
		tasks.push(sendEmail(email, "You're booked in with ESTEM Academy!", parentEmail.html, parentEmail.text));

		const internalEmail = internalNotificationEmail(details);
		tasks.push(
			sendEmail(
				CONTACT_EMAIL,
				`New application: ${parentName || 'Unknown'}`,
				internalEmail.html,
				internalEmail.text
			)
		);
	} else {
		console.warn('RESEND_API_KEY not set — skipping confirmation/notification emails');
	}

	await Promise.all(tasks);

	return json({ ok: true });
};
