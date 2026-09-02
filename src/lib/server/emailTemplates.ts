// Branded HTML email templates matching the site theme.
// Built with table-based layout and inline styles for broad email-client
// compatibility (Gmail, Outlook, Apple Mail all strip or mangle plain CSS).

import { whatsappUrl } from '$lib/config';

const COLORS = {
	bg: '#FBF6EC',
	card: '#FFFFFF',
	text: '#26324A',
	textMuted: '#6b7685',
	orange: '#E8623A',
	orangeDark: '#d2542f',
	amber: '#F4A340',
	amberSoft: '#FEF6E8',
	teal: '#3E9C8F',
	tealSoft: '#EAF6F4',
	border: '#e7e1d3'
};

const FONT_SERIF = "'Fraunces', Georgia, 'Times New Roman', serif";
const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function detailRow(label: string, value: string, isLast = false): string {
	return `
		<tr>
			<td style="padding:12px 0;${isLast ? '' : `border-bottom:1px solid ${COLORS.border};`}font-family:${FONT_SANS};font-size:13px;color:${COLORS.textMuted};vertical-align:top;white-space:nowrap;">
				${escapeHtml(label)}
			</td>
			<td style="padding:12px 0 12px 16px;${isLast ? '' : `border-bottom:1px solid ${COLORS.border};`}font-family:${FONT_SANS};font-size:14px;font-weight:600;color:${COLORS.text};text-align:right;">
				${escapeHtml(value)}
			</td>
		</tr>`;
}

function shell(opts: { preheader: string; bodyHtml: string }): string {
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>ESTEM Academy</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};">
	<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</div>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};padding:32px 16px;">
		<tr>
			<td align="center">
				<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${COLORS.card};border-radius:24px;overflow:hidden;border:1px solid ${COLORS.border};">
					<!-- Header -->
					<tr>
						<td style="padding:24px 32px;border-bottom:1px solid ${COLORS.border};">
							<table role="presentation" cellpadding="0" cellspacing="0">
								<tr>
									<td style="width:36px;height:36px;background-color:${COLORS.amber};border-radius:999px;text-align:center;vertical-align:middle;font-size:16px;">
										🎓
									</td>
									<td style="padding-left:10px;font-family:${FONT_SERIF};font-size:18px;font-weight:700;color:${COLORS.text};">
										<span style="color:${COLORS.orange};">E</span>STEM Academy
									</td>
								</tr>
							</table>
						</td>
					</tr>
					${opts.bodyHtml}
					<!-- Footer -->
					<tr>
						<td style="padding:24px 32px;background-color:${COLORS.bg};">
							<p style="margin:0;font-family:${FONT_SANS};font-size:12px;color:${COLORS.textMuted};">
								ESTEM Academy · <a href="mailto:info.estemacademy@gmail.com" style="color:${COLORS.textMuted};">info.estemacademy@gmail.com</a>
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;
}

export type ApplicationDetails = {
	parentName: string;
	phone: string;
	email: string;
	yearGroup: string;
	subjects: string[];
	examBoard: string;
	plan: string;
};

export function parentConfirmationEmail(details: ApplicationDetails): { html: string; text: string } {
	const { parentName, phone, yearGroup, subjects, examBoard, plan } = details;
	const firstName = parentName?.split(' ')[0] || 'there';
	const subjectsText = subjects?.length ? subjects.join(', ') : 'your requested subjects';

	const bodyHtml = `
		<tr>
			<td style="padding:40px 32px 24px;text-align:center;">
				<div style="width:56px;height:56px;line-height:56px;background-color:${COLORS.tealSoft};border-radius:999px;font-size:28px;margin:0 auto 20px;">
					🎉
				</div>
				<h1 style="margin:0 0 12px;font-family:${FONT_SERIF};font-size:24px;font-weight:600;color:${COLORS.text};">
					You're booked in!
				</h1>
				<p style="margin:0;font-family:${FONT_SANS};font-size:15px;line-height:1.6;color:${COLORS.textMuted};">
					Thanks, ${escapeHtml(firstName)} — we've received your request. We'll call
					${phone ? escapeHtml(phone) : 'you'} within 1 business day to confirm a time for
					${escapeHtml(subjectsText)}.
				</p>
			</td>
		</tr>
		<tr>
			<td style="padding:0 32px 24px;">
				<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};border-radius:16px;padding:4px 20px;">
					${detailRow('Year group', yearGroup || '—')}
					${detailRow('Subjects', subjectsText)}
					${detailRow('Exam board', examBoard || '—')}
					${detailRow('Plan', plan || '—', true)}
				</table>
			</td>
		</tr>
		<tr>
			<td style="padding:0 32px 32px;">
				<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.amberSoft};border-radius:16px;">
					<tr>
						<td style="padding:20px 24px;">
							<p style="margin:0 0 12px;font-family:${FONT_SANS};font-size:13px;font-weight:700;letter-spacing:.02em;color:${COLORS.text};text-transform:uppercase;">
								What happens next
							</p>
							<table role="presentation" cellpadding="0" cellspacing="0">
								<tr>
									<td style="padding:4px 0;font-family:${FONT_SANS};font-size:14px;color:${COLORS.text};">
										<span style="color:${COLORS.teal};font-weight:700;">1.</span>&nbsp; We review your answers
									</td>
								</tr>
								<tr>
									<td style="padding:4px 0;font-family:${FONT_SANS};font-size:14px;color:${COLORS.text};">
										<span style="color:${COLORS.teal};font-weight:700;">2.</span>&nbsp; We call you for a free 15-minute chat
									</td>
								</tr>
								<tr>
									<td style="padding:4px 0;font-family:${FONT_SANS};font-size:14px;color:${COLORS.text};">
										<span style="color:${COLORS.teal};font-weight:700;">3.</span>&nbsp; We confirm a lesson time that works
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td style="padding:0 32px 40px;text-align:center;">
				<a href="${whatsappUrl("Hi ESTEM Academy, I have a question about my application.")}" style="display:inline-block;background-color:${COLORS.orange};color:#ffffff;font-family:${FONT_SANS};font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:999px;">
					Questions? WhatsApp us
				</a>
			</td>
		</tr>`;

	const html = shell({
		preheader: `Thanks ${firstName} — your ESTEM Academy application is booked in.`,
		bodyHtml
	});

	const text = `You're booked in!

Thanks, ${firstName} — we've received your request. We'll call ${phone || 'you'} within 1 business day to confirm a time for ${subjectsText}.

Your request:
- Year group: ${yearGroup || '—'}
- Subjects: ${subjectsText}
- Exam board: ${examBoard || '—'}
- Plan: ${plan || '—'}

What happens next:
1. We review your answers
2. We call you for a free 15-minute chat
3. We confirm a lesson time that works

Questions? WhatsApp us: ${whatsappUrl('Hi ESTEM Academy, I have a question about my application.')}

ESTEM Academy`;

	return { html, text };
}

export function internalNotificationEmail(details: ApplicationDetails): { html: string; text: string } {
	const { parentName, phone, email, yearGroup, subjects, examBoard, plan } = details;
	const subjectsText = subjects?.length ? subjects.join(', ') : '—';

	const bodyHtml = `
		<tr>
			<td style="padding:32px 32px 8px;">
				<span style="display:inline-block;background-color:${COLORS.orange};color:#ffffff;font-family:${FONT_SANS};font-size:12px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;padding:4px 12px;border-radius:999px;">
					New application
				</span>
				<h1 style="margin:14px 0 0;font-family:${FONT_SERIF};font-size:22px;font-weight:600;color:${COLORS.text};">
					${escapeHtml(parentName || 'Unknown parent')}
				</h1>
			</td>
		</tr>
		<tr>
			<td style="padding:16px 32px 32px;">
				<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};border-radius:16px;padding:4px 20px;">
					${detailRow('Name', parentName || '—')}
					${detailRow('Phone', phone || '—')}
					${detailRow('Email', email || '—')}
					${detailRow('Year group', yearGroup || '—')}
					${detailRow('Subjects', subjectsText)}
					${detailRow('Exam board', examBoard || '—')}
					${detailRow('Plan', plan || '—', true)}
				</table>
			</td>
		</tr>`;

	const html = shell({
		preheader: `New application from ${parentName || 'a parent'}`,
		bodyHtml
	});

	const text = `New application received

Name: ${parentName || '—'}
Phone: ${phone || '—'}
Email: ${email || '—'}
Year group: ${yearGroup || '—'}
Subjects: ${subjectsText}
Exam board: ${examBoard || '—'}
Plan: ${plan || '—'}`;

	return { html, text };
}
