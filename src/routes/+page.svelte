<script lang="ts">
	import { CONTACT_EMAIL } from '$lib/config';

	const APPLY_URL = '/apply';

	const yearGroups = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'];
	const examBoards = ['AQA', 'Edexcel', 'OCR', 'iGCSE', 'and others'];

	type Subject = {
		id: string;
		name: string;
		icon: string;
		tagline: string;
		iconBg: string;
		iconText: string;
		activeRing: string;
		ks3: string[];
		gcse: string[];
	};

	const subjects: Subject[] = [
		{
			id: 'maths',
			name: 'Mathematics',
			icon: '🔢',
			tagline:
				"We build number confidence first, then turn it into exam-ready problem solving — so your child stops fearing the tricky questions.",
			iconBg: 'bg-teal-100',
			iconText: 'text-teal-700',
			activeRing: 'ring-teal-400',
			ks3: [
				'Fractions, decimals & percentages',
				'Introduction to algebra',
				'Angles, shapes & geometry',
				'Ratio & proportion',
				'Reading graphs & basic statistics'
			],
			gcse: [
				'Algebra & solving equations',
				'Geometry & trigonometry',
				'Statistics & probability',
				'Higher-tier problem solving',
				'Past-paper exam technique'
			]
		},
		{
			id: 'biology',
			name: 'Biology',
			icon: '🧬',
			tagline:
				'From how a single cell works to how a whole ecosystem fits together — with plenty of real diagrams, not just definitions to memorise.',
			iconBg: 'bg-emerald-100',
			iconText: 'text-emerald-700',
			activeRing: 'ring-emerald-400',
			ks3: [
				'Cells and how the body is organised',
				'Human body systems',
				'Plants, ecosystems & the environment',
				'Introduction to genetics'
			],
			gcse: [
				'Cell biology & microscopy',
				'Human physiology & disease',
				'Genetics & inheritance',
				'Ecology & the environment',
				'Required practicals, done properly'
			]
		},
		{
			id: 'chemistry',
			name: 'Chemistry',
			icon: '⚗️',
			tagline:
				'What things are made of and why they react the way they do — explained with the kind of clear analogies a doctor uses with patients.',
			iconBg: 'bg-purple-100',
			iconText: 'text-purple-700',
			activeRing: 'ring-purple-400',
			ks3: [
				'States of matter & particles',
				'Atoms, elements & compounds',
				'Simple chemical reactions',
				'Introducing the periodic table'
			],
			gcse: [
				'Atomic structure & bonding',
				'Chemical reactions & equations',
				'Organic chemistry basics',
				'Required practicals, done properly',
				'Exam-board specific content (AQA/Edexcel/OCR)'
			]
		},
		{
			id: 'physics',
			name: 'Physics',
			icon: '⚡',
			tagline:
				"The rules that explain everyday things — why a ball falls, how a plug works — taught by an engineer who uses this stuff for a living.",
			iconBg: 'bg-orange-100',
			iconText: 'text-orange-700',
			activeRing: 'ring-orange-400',
			ks3: [
				'Forces & motion',
				'Energy stores & transfers',
				'Electricity & simple circuits',
				'Waves & sound'
			],
			gcse: [
				'Forces & motion',
				'Energy transfers & efficiency',
				'Electricity & circuits',
				'Waves, radiation & space physics',
				'Required practicals, done properly'
			]
		}
	];

	let activeSubjectId = $state(subjects[0].id);
	const activeSubject = $derived(
		subjects.find((s) => s.id === activeSubjectId) ?? subjects[0]
	);

	const levels = [
		{ id: 'ks3', label: 'KS3 (Year 7–8)' },
		{ id: 'gcse', label: 'GCSE (Year 9–11)' },
		{ id: 'igcse', label: 'iGCSE (Year 9–11)' }
	] as const;
	let activeLevelId = $state<(typeof levels)[number]['id']>('ks3');
	const activeTopics = $derived(
		activeLevelId === 'ks3' ? activeSubject.ks3 : activeSubject.gcse
	);

	const pricing = [
		{
			name: 'Pay-As-You-Go',
			price: '£12.50',
			originalPrice: '',
			unit: '/ hour',
			tag: 'No commitment',
			savings: '',
			features: ['Live interactive group classes', 'Book lesson by lesson', 'No long-term contract'],
			highlight: false
		},
		{
			name: 'Bulk Package — 20 Lessons',
			price: '£10',
			originalPrice: '£12.50',
			unit: '/ hour',
			tag: '⭐ Most popular',
			savings: 'Save £2.50/hour — £50 off across 20 lessons',
			features: ['Best value per lesson', 'Pay for 20 lessons up front', 'Great for regular weekly tuition'],
			highlight: true
		},
		{
			name: '1-to-1 Private Tuition',
			price: '£50',
			originalPrice: '',
			unit: '/ hour',
			tag: 'Fully personalised',
			savings: '',
			features: ['A study plan built around your child', 'Flexible scheduling'],
			highlight: false
		}
	];

	let reviewsTrack: HTMLDivElement | undefined = $state();
	function scrollReviews(direction: 1 | -1) {
		reviewsTrack?.scrollBy({ left: direction * 340, behavior: 'smooth' });
	}

	const reviews = [
		{
			quote:
				"Extremely helpful in helping me getting that A*. He pointed out all of my silly mistakes, and was able to go over whole topics in single lessons. Really couldn't have done it without him.",
			author: 'Najma A',
			context: 'Maths (A-Level)'
		},
		{
			quote:
				"Syed has been helping my son for a few months now. What a revelation it has been. I have seen my son grow in confidence and enthusiasm for Maths. Syed is organised, articulate, professional and easy to get along with. I am struggling to find tutors in other subjects that live up to Syed's standards. Don't hesitate, book and you will see.",
			author: 'Hiba O',
			context: 'Maths (GCSE)'
		},
		{
			quote:
				"Before starting lessons with Ibrahim, I didn't know how to apply my knowledge to questions. Through doing many practice questions with Ibrahim, he highlighted exam techniques that helped me answer questions more effectively. He is patient, dedicated, and always ready to answer my questions until I completely understand. Therefore, for these reasons, I strongly recommend him as a tutor.",
			author: 'Hajara',
			context: ''
		},
		{
			quote:
				"My favourite tutor of all time. Before I could only do basic maths but he made me into an excellent mathematician bit by bit, just from him explaining things to me. 10/10 — would recommend to anyone struggling, and he'll keep you on your toes with fun lessons.",
			author: 'Hassan',
			context: 'Maths'
		},
		{
			quote:
				'Is very consistent with teaching, offers unique methods to enhance learning and provides a fun and enjoyable experience.',
			author: 'Maherub H',
			context: 'Maths (GCSE)'
		},
		{
			quote:
				"He is a very good tuition teacher — took me from just passing to an A in just a couple of months before my GCSEs, and often made lessons very easy to understand and open to ask any questions, no matter how silly. He always finishes what's planned for the lesson and won't leave you behind, even if it means giving up his own time after class to make sure I understood. Perfect tuition teacher, and very reasonable and respectable.",
			author: 'Abdul Khaliq',
			context: 'GCSE'
		}
	];

	const trustFeatures = [
		{
			icon: '📷',
			title: 'Cameras on, every lesson',
			desc: "We ask every student to keep their camera on. It keeps lessons focused and lets tutors actually see who's following along and who needs a hand."
		},
		{
			icon: '🤝',
			title: 'Try it, risk-free',
			desc: "Not the right fit after lesson one? Tell us and we'll refund it, no questions asked."
		},
		{
			icon: '📊',
			title: "You'll hear from us every term",
			desc: 'A proper progress update each term — attendance, effort, and how test scores are trending — not just a "doing fine" email.'
		},
		{
			icon: '🚀',
			title: 'Extra help before exams',
			desc: 'Optional crash-course sessions in the run-up to GCSE exam windows, for when a bit of extra revision support makes the difference.'
		},
		{
			icon: '🛡️',
			title: 'Enhanced DBS checked',
			desc: 'Both tutors hold current Enhanced DBS checks, so you can feel comfortable with who is teaching your child.'
		}
	];

	const tutors = [
		{
			name: 'Ibrahim Khan',
			role: 'Medical Doctor',
			emoji: '🩺',
			specialism: 'GCSE & KS3 Biology and Chemistry',
			bio: 'Qualified as a doctor in 2025 and has been tutoring for 5+ years alongside training — so explaining tricky science simply is second nature.',
			badges: ['GMC Registered', 'Enhanced DBS Checked']
		},
		{
			name: 'Syed Ahmed',
			role: 'Imperial College Senior Engineer',
			emoji: '⚙️',
			specialism: 'GCSE & KS3 Higher-Tier Mathematics and Physics',
			bio: 'An Imperial College graduate with 5+ years of STEM tutoring experience, bringing real engineering know-how into every lesson.',
			badges: ['Imperial College', 'Enhanced DBS Checked']
		}
	];

	const faqs = [
		{
			q: 'What does my child need to join a lesson?',
			a: "Just a laptop or tablet with a webcam and a stable internet connection. We send simple joining instructions by email before every lesson — nothing to install in advance."
		},
		{
			q: 'How big are the group classes?',
			a: "We keep groups small on purpose, so your child gets real face time with the tutor and isn't just one of thirty names on a screen."
		},
		{
			q: "What if it's not the right fit?",
			a: "Try the first lesson risk-free. If it isn't right for your child, let us know and we'll refund it — no awkward questions."
		},
		{
			q: 'Can we switch between group classes and 1-to-1?',
			a: "Yes. Plenty of families mix the two — group classes week to week, with 1-to-1 sessions booked in before a big test or exam."
		},
		{
			q: 'How do we pay, and is there a contract?',
			a: "Choose pay-as-you-go for no commitment, or the 20-lesson bulk package for the best rate. Either way there's no long-term contract — start the sign-up flow and we'll sort out a schedule and payment."
		},
		{
			q: 'Which exam boards do you teach to?',
			a: "AQA, Edexcel, OCR and others — you'll pick yours as part of signing up, so we can tailor lessons to match it."
		}
	];
</script>

<svelte:head>
	<title>ESTEM Academy — Live Online KS3 & GCSE Tuition</title>
	<meta
		name="description"
		content="Friendly, expert-led KS3, GCSE and iGCSE Maths, Biology, Chemistry and Physics tuition, live online across the UK, from £10/hour."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="min-h-screen bg-[#FBF6EC] text-[#26324A]"
	style="font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;"
>
	<!-- Nav -->
	<header class="sticky top-0 z-50 border-b border-[#26324A]/10 bg-[#FBF6EC]/90 backdrop-blur">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a href="/" class="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#26324A]">
				<span
					class="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4A340] text-base"
					>🎓</span
				>
				<span style="font-family: 'Fraunces', serif;">ESTEM Academy</span>
			</a>
			<a
				href={APPLY_URL}
				class="rounded-full bg-[#E8623A] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d2542f]"
			>
				Get Started
			</a>
		</div>
	</header>

	<!-- Hero -->
	<section class="relative overflow-hidden">
		<div
			class="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#F4A340]/20 blur-3xl"
		></div>
		<div
			class="pointer-events-none absolute top-40 -left-32 h-80 w-80 rounded-full bg-[#3E9C8F]/15 blur-3xl"
		></div>
		<div class="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
			<div class="mx-auto max-w-3xl text-center">
				<p
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-[#26324A]/10 bg-white px-4 py-1.5 text-sm font-medium text-[#26324A]/70 shadow-sm"
				>
					👋 Live online tuition for KS3 & GCSE, anywhere in the UK
				</p>
				<h1
					class="text-4xl leading-tight font-semibold text-[#26324A] sm:text-5xl"
					style="font-family: 'Fraunces', serif;"
				>
					Tutoring your child will actually
					<span class="text-[#E8623A]">look forward to</span>
				</h1>
				<p class="mt-6 text-lg text-[#26324A]/70 sm:text-xl">
					Small, live online classes in Maths, Biology, Chemistry and Physics — taught by a
					GMC-registered doctor and an Imperial College engineer, from just £10 an hour.
				</p>
				<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a
						href={APPLY_URL}
						class="w-full rounded-full bg-[#E8623A] px-8 py-3.5 text-center text-base font-semibold text-white shadow-sm transition hover:bg-[#d2542f] sm:w-auto"
					>
						Find your child's tutor
					</a>
					<a
						href="#subjects"
						class="w-full rounded-full border border-[#26324A]/20 bg-white px-8 py-3.5 text-center text-base font-semibold text-[#26324A] transition hover:border-[#26324A]/40 sm:w-auto"
					>
						See what's taught
					</a>
				</div>
			</div>

			<!-- Trust strip -->
			<div class="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-[#26324A]/60">
				<span class="flex items-center gap-1.5">🩺 GMC-registered doctor</span>
				<span class="flex items-center gap-1.5">⚙️ Imperial College engineer</span>
				<span class="flex items-center gap-1.5">🛡️ Enhanced DBS checked</span>
				<span class="flex items-center gap-1.5">🤝 First-lesson guarantee</span>
			</div>
		</div>
	</section>

	<!-- Subject explorer -->
	<section id="subjects" class="border-y border-[#26324A]/10 bg-white py-20">
		<div class="mx-auto max-w-5xl px-6">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-semibold sm:text-4xl" style="font-family: 'Fraunces', serif;">
					What will they actually learn?
				</h2>
				<p class="mt-4 text-[#26324A]/70">
					Tap a subject to see exactly what's covered at KS3, GCSE and iGCSE — for
					{yearGroups.join(', ')}, across {examBoards.join(', ')}.
				</p>
			</div>

			<!-- Tabs -->
			<div class="mt-10 flex flex-wrap justify-center gap-3">
				{#each subjects as subject}
					<button
						type="button"
						onclick={() => (activeSubjectId = subject.id)}
						class={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
							activeSubjectId === subject.id
								? `border-transparent ${subject.iconBg} ${subject.iconText} ring-2 ${subject.activeRing}`
								: 'border-[#26324A]/15 bg-[#FBF6EC] text-[#26324A]/60 hover:text-[#26324A]'
						}`}
					>
						<span class="text-base">{subject.icon}</span>
						{subject.name}
					</button>
				{/each}
			</div>

			<!-- Panel -->
			<div class="mt-10 rounded-3xl border border-[#26324A]/10 bg-[#FBF6EC] p-8 sm:p-10">
				<div class="flex items-start gap-4">
					<span class={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${activeSubject.iconBg}`}
						>{activeSubject.icon}</span
					>
					<div>
						<h3 class="text-xl font-semibold" style="font-family: 'Fraunces', serif;">
							{activeSubject.name}
						</h3>
						<p class="mt-1.5 text-[#26324A]/70">{activeSubject.tagline}</p>
					</div>
				</div>

				<!-- Level buttons -->
				<div class="mt-8 flex flex-wrap gap-2">
					{#each levels as level}
						<button
							type="button"
							onclick={() => (activeLevelId = level.id)}
							class={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
								activeLevelId === level.id
									? `border-transparent ${activeSubject.iconBg} ${activeSubject.iconText}`
									: 'border-[#26324A]/10 bg-white text-[#26324A]/60 hover:border-[#26324A]/25'
							}`}
						>
							{level.label}
						</button>
					{/each}
				</div>

				{#if activeLevelId === 'igcse'}
					<p class="mt-4 text-sm text-[#26324A]/60">
						iGCSE follows the same core {activeSubject.name} curriculum as GCSE — lessons are
						mapped to your specific board (e.g. Cambridge, Edexcel International).
					</p>
				{/if}

				<div class="mt-6">
					<ul class="space-y-2.5">
						{#each activeTopics as topic}
							<li class="flex items-start gap-2 text-[#26324A]/80">
								<span class={`mt-0.5 ${activeSubject.iconText}`}>●</span>
								{topic}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</section>

	<!-- Founders -->
	<section class="mx-auto max-w-6xl px-6 py-20">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-semibold sm:text-4xl" style="font-family: 'Fraunces', serif;">
				Meet the founding tutors
			</h2>
			<p class="mt-4 text-[#26324A]/70">
				ESTEM Academy was founded by two tutors who teach personally, every week.
			</p>
		</div>
		<div class="mt-12 grid gap-8 sm:grid-cols-2">
			{#each tutors as tutor}
				<div class="rounded-3xl border border-[#26324A]/10 bg-white p-8 shadow-sm">
					<span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBF6EC] text-2xl"
						>{tutor.emoji}</span
					>
					<h3 class="mt-4 text-xl font-semibold" style="font-family: 'Fraunces', serif;">
						{tutor.name}
					</h3>
					<p class="text-sm font-medium text-[#26324A]/60">{tutor.role}</p>
					<p class="mt-1 text-sm font-medium text-[#E8623A]">{tutor.specialism}</p>
					<p class="mt-4 text-[#26324A]/70">{tutor.bio}</p>
					<div class="mt-6 flex flex-wrap gap-2">
						{#each tutor.badges as badge}
							<span
								class="rounded-full border border-[#3E9C8F]/25 bg-[#3E9C8F]/10 px-3 py-1 text-xs font-medium text-[#2f7a70]"
								>{badge}</span
							>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Reviews -->
	<section class="mx-auto max-w-6xl px-6 py-20">
		<div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
			<div class="lg:w-64 lg:shrink-0">
				<h2 class="text-3xl font-semibold sm:text-4xl" style="font-family: 'Fraunces', serif;">
					What families are saying
				</h2>
				<p class="mt-4 text-[#26324A]/70">Real feedback from students and parents we've tutored.</p>
				<div class="mt-6 flex gap-3">
					<button
						type="button"
						onclick={() => scrollReviews(-1)}
						aria-label="Previous reviews"
						class="flex h-11 w-11 items-center justify-center rounded-full border border-[#26324A]/15 bg-white text-[#26324A] transition hover:border-[#26324A]/30"
					>
						←
					</button>
					<button
						type="button"
						onclick={() => scrollReviews(1)}
						aria-label="Next reviews"
						class="flex h-11 w-11 items-center justify-center rounded-full border border-[#26324A]/15 bg-white text-[#26324A] transition hover:border-[#26324A]/30"
					>
						→
					</button>
				</div>
			</div>

			<div
				bind:this={reviewsTrack}
				class="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{#each reviews as review}
					<div
						class="w-[85vw] max-w-sm shrink-0 snap-start rounded-3xl border border-[#26324A]/10 bg-white p-6 shadow-sm sm:w-80"
					>
						<span class="text-[#F4A340]">★★★★★</span>
						<p class="mt-3 text-[#26324A]/80">"{review.quote}"</p>
						<p class="mt-4 text-sm font-semibold text-[#26324A]">{review.author}</p>
						{#if review.context}
							<p class="text-xs text-[#26324A]/50">{review.context}</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pricing -->
	<section id="pricing" class="border-y border-[#26324A]/10 bg-white py-20">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-semibold sm:text-4xl" style="font-family: 'Fraunces', serif;">
					Straightforward pricing, no surprises
				</h2>
				<p class="mt-4 text-[#26324A]/70">
					No hidden fees, no long contracts. Choose whatever fits your child best.
				</p>
			</div>
			<div class="mt-12 grid gap-8 lg:grid-cols-3">
				{#each pricing as plan}
					<div
						class={`flex flex-col rounded-3xl border p-8 ${
							plan.highlight
								? 'border-[#F4A340] bg-[#FEF6E8] shadow-[0_0_0_4px_rgba(244,163,64,0.15),0_0_50px_-6px_rgba(244,163,64,0.55)] lg:-my-4 lg:scale-105'
								: 'border-[#26324A]/10 bg-[#FBF6EC]'
						}`}
					>
						{#if plan.highlight}
							<span
								class="mb-4 inline-block w-fit rounded-full bg-[#F4A340] px-3 py-1 text-xs font-bold text-white"
								>Best value</span
							>
						{/if}
						<h3 class="text-lg font-semibold">{plan.name}</h3>
						<p class="mt-1 text-sm text-[#26324A]/60">{plan.tag}</p>
						<p class="mt-6 flex items-baseline gap-2">
							{#if plan.originalPrice}
								<span class="text-xl font-medium text-[#26324A]/40 line-through">{plan.originalPrice}</span>
							{/if}
							<span class="text-4xl font-bold" style="font-family: 'Fraunces', serif;"
								>{plan.price}</span
							>
							<span class="text-[#26324A]/60">{plan.unit}</span>
						</p>
						{#if plan.savings}
							<p class="mt-1 text-sm font-semibold text-[#3E9C8F]">{plan.savings}</p>
						{/if}
						<ul class="mt-6 flex-1 space-y-3 text-sm text-[#26324A]/80">
							{#each plan.features as feature}
								<li class="flex items-start gap-2">
									<span class="mt-0.5 text-[#3E9C8F]">✓</span>
									{feature}
								</li>
							{/each}
						</ul>
						<a
							href={APPLY_URL}
							class={`mt-8 rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
								plan.highlight
									? 'bg-[#E8623A] text-white hover:bg-[#d2542f]'
									: 'border border-[#26324A]/20 bg-white text-[#26324A] hover:border-[#26324A]/40'
							}`}
						>
							Sign up
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Trust features -->
	<section class="mx-auto max-w-6xl px-6 py-20">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-semibold sm:text-4xl" style="font-family: 'Fraunces', serif;">
				Built with parents in mind
			</h2>
		</div>
		<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each trustFeatures as feature}
				<div class="rounded-3xl border border-[#26324A]/10 bg-white p-6 shadow-sm">
					<span class="text-2xl">{feature.icon}</span>
					<h3 class="mt-3 font-semibold">{feature.title}</h3>
					<p class="mt-2 text-sm text-[#26324A]/70">{feature.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- FAQ -->
	<section class="border-t border-[#26324A]/10 bg-white py-20">
		<div class="mx-auto max-w-3xl px-6">
			<div class="text-center">
				<h2 class="text-3xl font-semibold sm:text-4xl" style="font-family: 'Fraunces', serif;">
					Questions parents usually ask
				</h2>
			</div>
			<div class="mt-10 space-y-3">
				{#each faqs as faq}
					<details class="group rounded-2xl border border-[#26324A]/10 bg-[#FBF6EC] p-5 open:bg-white">
						<summary
							class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#26324A]"
						>
							{faq.q}
							<span class="text-[#E8623A] transition group-open:rotate-45">＋</span>
						</summary>
						<p class="mt-3 text-[#26324A]/70">{faq.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-20">
		<div class="mx-auto max-w-3xl px-6 text-center">
			<h2 class="text-3xl font-semibold sm:text-4xl" style="font-family: 'Fraunces', serif;">
				Ready when you are
			</h2>
			<p class="mt-4 text-[#26324A]/70">
				Scan the QR code on our materials, or take two minutes to tell us what your child needs.
				We'll match them to the right subject, tutor and time slot — and book you in for a free
				call to talk it through.
			</p>
			<a
				href={APPLY_URL}
				class="mt-8 inline-block rounded-full bg-[#E8623A] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#d2542f]"
			>
				Start your child's plan
			</a>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-[#26324A]/10 py-10">
		<div
			class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-[#26324A]/50 sm:flex-row"
		>
			<p>&copy; {new Date().getFullYear()} ESTEM Academy. All rights reserved.</p>
			<div class="flex gap-6">
				<a href={`mailto:${CONTACT_EMAIL}`} class="hover:text-[#26324A]">{CONTACT_EMAIL}</a>
			</div>
		</div>
	</footer>
</div>
