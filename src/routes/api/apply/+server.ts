import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { CONTACT_EMAIL } from '$lib/config';
import type { RequestHandler } from './$types';

const GOOGLE_FORM_ACTION =
	'https://docs.google.com/forms/d/e/1FAIpQLSe1AAuvBzS6Fo0CxiBeQu0qnAaPsNG229g5WZzaPyKGtKW4YQ/formResponse';

// TODO: once a sending domain is verified in Resend, switch this to that domain
// (e.g. 'ESTEM Academy <bookings@elitestemacademy.co.uk>'). Until then, Resend's
// shared test address only delivers to the account owner's own inbox.
const FROM_EMAIL = 'ESTEM Academy <onboarding@resend.dev>';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type ApplyPayload = {
	formEntries: Record<string, string[]>;
	parentName: string;
	phone: string;
	email: string;
	yearGroup: string;
	subjects: string[];
	examBoard: string;
	plan: string;
};

async function sendEmail(to: string, subject: string, html: string) {
	const { error } = await resend!.emails.send({ from: FROM_EMAIL, to, subject, html });
	if (error) {
		console.error('Resend email failed', to, subject, error);
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
		tasks.push(
			sendEmail(
				email,
				"You're booked in with ESTEM Academy!",
				`<p>Hi ${parentName || 'there'},</p>
				<p>Thanks for signing up with ESTEM Academy. We've received your request for
				${subjects?.length ? subjects.join(', ') : 'tuition'}${yearGroup ? ` (${yearGroup})` : ''}
				on the <strong>${plan || 'requested'}</strong> plan.</p>
				<p>We'll call ${phone || 'you'} within 1 business day to confirm a time for your free
				15-minute consultation.</p>
				<p>Talk soon,<br />The ESTEM Academy team</p>`
			)
		);

		tasks.push(
			sendEmail(
				CONTACT_EMAIL,
				`New application: ${parentName || 'Unknown'}`,
				`<p>New application received:</p>
				<ul>
					<li><strong>Name:</strong> ${parentName}</li>
					<li><strong>Phone:</strong> ${phone}</li>
					<li><strong>Email:</strong> ${email}</li>
					<li><strong>Year group:</strong> ${yearGroup}</li>
					<li><strong>Subjects:</strong> ${subjects?.join(', ')}</li>
					<li><strong>Exam board:</strong> ${examBoard}</li>
					<li><strong>Plan:</strong> ${plan}</li>
				</ul>`
			)
		);
	} else {
		console.warn('RESEND_API_KEY not set — skipping confirmation/notification emails');
	}

	await Promise.all(tasks);

	return json({ ok: true });
};
