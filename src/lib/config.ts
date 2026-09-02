export const WHATSAPP_NUMBER = '447534151853';

export function whatsappUrl(message: string): string {
	return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const CONTACT_EMAIL = 'info.estemacademy@gmail.com';

// TODO: replace with the real GA4 measurement ID from analytics.google.com (Admin > Data Streams)
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
