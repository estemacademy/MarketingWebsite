export const WHATSAPP_NUMBER = '447534151853';

export function whatsappUrl(message: string): string {
	return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const CONTACT_EMAIL = 'info.estemacademy@gmail.com';

export const GA_MEASUREMENT_ID = 'G-1P9QNB8WKP';
