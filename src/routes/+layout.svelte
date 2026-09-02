<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();

	let dismissed = $state(true);
	let visible = $state(false);

	$effect(() => {
		try {
			dismissed = sessionStorage.getItem('promo-call-dismissed') === '1';
		} catch {
			dismissed = false;
		}
		const timer = setTimeout(() => (visible = true), 1200);
		return () => clearTimeout(timer);
	});

	function dismiss() {
		dismissed = true;
		try {
			sessionStorage.setItem('promo-call-dismissed', '1');
		} catch {
			/* ignore */
		}
	}

	const showPromo = $derived(!dismissed && visible && !page.url.pathname.startsWith('/apply'));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

{#if showPromo}
	<div
		class="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-xs animate-[slideIn_0.4s_ease-out] rounded-2xl border border-[#26324A]/10 bg-white p-5 shadow-xl sm:right-6 sm:bottom-6"
	>
		<button
			type="button"
			onclick={dismiss}
			aria-label="Dismiss"
			class="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-[#26324A]/40 transition hover:bg-[#26324A]/5 hover:text-[#26324A]"
		>
			✕
		</button>
		<span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF6E8] text-xl">📞</span>
		<h3 class="mt-3 pr-4 font-semibold text-[#26324A]" style="font-family: 'Fraunces', serif;">
			Free 15-minute call
		</h3>
		<p class="mt-1.5 text-sm text-[#26324A]/70">
			Talk it through with the team — the right subjects, tutor and schedule for your child, no
			obligation.
		</p>
		<a
			href="/apply"
			class="mt-4 flex items-center justify-center rounded-full bg-[#E8623A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d2542f]"
		>
			Book your free call
		</a>
	</div>
{/if}

<style>
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
