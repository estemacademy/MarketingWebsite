<script lang="ts">
	const ENTRY = {
		yearGroup: 'entry.1873917138',
		subjects: 'entry.1225967168',
		examBoard: 'entry.1848986228',
		examBoardOther: 'entry.1848986228.other_option_response',
		plan: 'entry.1905767744',
		hoursPerWeek: 'entry.145464578',
		preferredDays: 'entry.812445295',
		targetGrade: 'entry.396600341',
		consultationInterest: 'entry.1658628767',
		decisionDriver: 'entry.1875666525',
		decisionDriverOther: 'entry.1875666525.other_option_response',
		name: 'entry.350807857',
		phone: 'entry.1229466483',
		email: 'entry.2123723539'
	};

	const subjectOptions = [
		{
			value: 'Maths',
			icon: '🔢',
			active: 'border-teal-400 bg-teal-50 ring-2 ring-teal-400 text-teal-700'
		},
		{
			value: 'Biology',
			icon: '🧬',
			active: 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-400 text-emerald-700'
		},
		{
			value: 'Chemistry',
			icon: '⚗️',
			active: 'border-purple-400 bg-purple-50 ring-2 ring-purple-400 text-purple-700'
		},
		{
			value: 'Physics',
			icon: '⚡',
			active: 'border-orange-400 bg-orange-50 ring-2 ring-orange-400 text-orange-700'
		}
	];

	const yearOptions = [
		{ value: 'Year 7 (KS3)', label: 'Year 7', sub: 'KS3' },
		{ value: 'Year 8 (KS3)', label: 'Year 8', sub: 'KS3' },
		{ value: 'Year 9 (GCSE)', label: 'Year 9', sub: 'GCSE' },
		{ value: 'Year 10 (GCSE)', label: 'Year 10', sub: 'GCSE' },
		{ value: 'Year 11 (GCSE)', label: 'Year 11', sub: 'GCSE' }
	];

	const examBoardOptions = ['AQA', 'Edexcel', 'OCR', 'iGCSE', 'Not sure', 'Other'];

	const planOptions = [
		{
			value: 'Group classes – Bulk package 20 lessons (£10 per hour) ⭐ Most popular',
			label: 'Bulk Package — 20 Lessons',
			price: '£10',
			originalPrice: '£12.50',
			unit: '/ hour',
			desc: 'Best value — save £2.50/hour vs pay-as-you-go',
			badge: 'Most popular'
		},
		{
			value: 'Group classes – Pay as you go (£12.50 per hour)',
			label: 'Pay-As-You-Go',
			price: '£12.50',
			originalPrice: '',
			unit: '/ hour',
			desc: 'No commitment — book lesson by lesson',
			badge: ''
		},
		{
			value: '1-to-1 lessons (£50 per hour)',
			label: '1-to-1 Private Tuition',
			price: '£50',
			originalPrice: '',
			unit: '/ hour',
			desc: 'A study plan built around your child, flexible scheduling',
			badge: ''
		},
		{
			value: 'Not sure yet',
			label: 'Not sure yet',
			price: '',
			originalPrice: '',
			unit: '',
			desc: "We'll help you decide on the call",
			badge: ''
		}
	];

	const dayOptions = ['Weekdays (after 6pm)', 'Saturday', 'Sunday'];
	const gradeOptions = ['Grade 4–5', 'Grade 6–7', 'Grade 8+'];
	const driverOptions = ['Affordable pricing', 'Small group size', 'Flexible timings', 'Online', 'Other'];
	const consultationOptions = ['Yes', 'No', 'Maybe'];

	const stepLabels = ['Subjects', 'Plan', 'Preferences', 'Details', 'Confirm'];
	const totalSteps = stepLabels.length;

	let step = $state(1);

	let selectedSubjects = $state<string[]>([]);
	let yearGroup = $state('');
	let examBoard = $state('');
	let examBoardOther = $state('');
	let plan = $state('');
	let hoursPerWeek = $state('');
	let preferredDays = $state<string[]>([]);
	let targetGrade = $state('');
	let decisionDriver = $state('');
	let decisionDriverOther = $state('');
	let consultationInterest = $state('Yes');
	let parentName = $state('');
	let phone = $state('');
	let email = $state('');

	let submitting = $state(false);
	let submitted = $state(false);

	function toggleSubject(value: string) {
		selectedSubjects = selectedSubjects.includes(value)
			? selectedSubjects.filter((s) => s !== value)
			: [...selectedSubjects, value];
	}

	function toggleDay(value: string) {
		preferredDays = preferredDays.includes(value)
			? preferredDays.filter((d) => d !== value)
			: [...preferredDays, value];
	}

	const step1Valid = $derived(selectedSubjects.length > 0 && yearGroup !== '');
	const step2Valid = $derived(
		examBoard !== '' && (examBoard !== 'Other' || examBoardOther.trim() !== '') && plan !== ''
	);
	const step3Valid = $derived(
		targetGrade !== '' &&
			decisionDriver !== '' &&
			(decisionDriver !== 'Other' || decisionDriverOther.trim() !== '') &&
			preferredDays.length > 0
	);
	const emailValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
	const step4Valid = $derived(parentName.trim() !== '' && phone.trim() !== '' && emailValid);

	const canContinue = $derived(
		step === 1
			? step1Valid
			: step === 2
				? step2Valid
				: step === 3
					? step3Valid
					: step === 4
						? step4Valid
						: true
	);

	function goNext() {
		if (!canContinue) return;
		step = Math.min(step + 1, totalSteps);
		scrollTo({ top: 0, behavior: 'smooth' });
	}

	function goBack() {
		step = Math.max(step - 1, 1);
		scrollTo({ top: 0, behavior: 'smooth' });
	}

	const selectedPlan = $derived(planOptions.find((p) => p.value === plan));
	const selectedYear = $derived(yearOptions.find((y) => y.value === yearGroup));

	async function submitApplication() {
		submitting = true;

		const formEntries: Record<string, string[]> = {};
		const addField = (name: string, value: string) => {
			formEntries[name] = formEntries[name] ? [...formEntries[name], value] : [value];
		};

		addField(ENTRY.yearGroup, yearGroup);
		selectedSubjects.forEach((s) => addField(ENTRY.subjects, s));

		if (examBoard === 'Other') {
			addField(ENTRY.examBoard, '__other_option__');
			addField(ENTRY.examBoardOther, examBoardOther);
		} else {
			addField(ENTRY.examBoard, examBoard);
		}

		addField(ENTRY.plan, plan);
		addField(ENTRY.hoursPerWeek, hoursPerWeek);
		preferredDays.forEach((d) => addField(ENTRY.preferredDays, d));
		addField(ENTRY.targetGrade, targetGrade);
		addField(ENTRY.consultationInterest, consultationInterest);

		if (decisionDriver === 'Other') {
			addField(ENTRY.decisionDriver, '__other_option__');
			addField(ENTRY.decisionDriverOther, decisionDriverOther);
		} else {
			addField(ENTRY.decisionDriver, decisionDriver);
		}

		addField(ENTRY.name, parentName);
		addField(ENTRY.phone, phone);
		addField(ENTRY.email, email);

		try {
			await fetch('/api/apply', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					formEntries,
					parentName,
					phone,
					email,
					yearGroup: selectedYear?.label ?? yearGroup,
					subjects: selectedSubjects,
					examBoard: examBoard === 'Other' ? examBoardOther : examBoard,
					plan: selectedPlan?.label ?? plan
				})
			});
		} catch (err) {
			console.error('Application submission failed', err);
		}

		submitting = false;
		submitted = true;
		scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>Get Started — ESTEM Academy</title>
	<meta name="robots" content="noindex" />
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
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
			<a href="/" class="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#26324A]">
				<span class="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4A340] text-base"
					>🎓</span
				>
				<span style="font-family: 'Fraunces', serif;">ESTEM Academy</span>
			</a>
			<a href="/" class="text-sm font-medium text-[#26324A]/60 hover:text-[#26324A]">Cancel</a>
		</div>
	</header>

	<div class="mx-auto max-w-5xl px-6 py-12">
		{#if submitted}
			<!-- Success -->
			<div class="mx-auto max-w-lg rounded-3xl border border-[#26324A]/10 bg-white p-10 text-center shadow-sm">
				<span
					class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3E9C8F]/15 text-3xl"
					>🎉</span
				>
				<h1 class="mt-6 text-2xl font-semibold" style="font-family: 'Fraunces', serif;">
					You're booked in!
				</h1>
				<p class="mt-3 text-[#26324A]/70">
					Thanks{parentName ? `, ${parentName}` : ''} — we've got everything we need. We'll call
					{phone ? phone : 'you'} within 1 business day to confirm a time and get
					{selectedYear ? selectedYear.label : 'your child'} started
					{selectedSubjects.length ? `with ${selectedSubjects.join(', ')}` : ''}.
				</p>
				<div class="mt-8 rounded-2xl bg-[#FBF6EC] p-5 text-left text-sm">
					<p class="font-semibold text-[#26324A]">What happens next</p>
					<ul class="mt-3 space-y-2 text-[#26324A]/70">
						<li class="flex gap-2"><span class="text-[#3E9C8F]">1.</span> We review your answers</li>
						<li class="flex gap-2"><span class="text-[#3E9C8F]">2.</span> We call you for a free 15-minute chat</li>
						<li class="flex gap-2"><span class="text-[#3E9C8F]">3.</span> We confirm a lesson time that works</li>
					</ul>
				</div>
				<a
					href="/"
					class="mt-8 inline-block rounded-full bg-[#E8623A] px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d2542f]"
				>
					Back to homepage
				</a>
			</div>
		{:else}
			<!-- Stepper -->
			<div class="mx-auto mb-10 flex max-w-2xl items-center justify-between">
				{#each stepLabels as label, i}
					{@const n = i + 1}
					<div class="flex flex-1 items-center">
						<div class="flex flex-col items-center gap-1.5">
							<span
								class={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
									n < step
										? 'bg-[#3E9C8F] text-white'
										: n === step
											? 'bg-[#E8623A] text-white'
											: 'bg-[#26324A]/10 text-[#26324A]/40'
								}`}
							>
								{n < step ? '✓' : n}
							</span>
							<span
								class={`hidden text-xs font-medium sm:block ${n === step ? 'text-[#26324A]' : 'text-[#26324A]/40'}`}
								>{label}</span
							>
						</div>
						{#if n < totalSteps}
							<span class={`mx-1.5 h-0.5 flex-1 ${n < step ? 'bg-[#3E9C8F]' : 'bg-[#26324A]/10'}`}></span>
						{/if}
					</div>
				{/each}
			</div>

			<div class="grid gap-8 lg:grid-cols-[1fr_320px]">
				<!-- Main form -->
				<div class="rounded-3xl border border-[#26324A]/10 bg-white p-6 shadow-sm sm:p-10">
					{#if step === 1}
						<h2 class="text-2xl font-semibold" style="font-family: 'Fraunces', serif;">
							What does your child need help with?
						</h2>
						<p class="mt-2 text-[#26324A]/60">Pick every subject that applies.</p>

						<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
							{#each subjectOptions as subject}
								<button
									type="button"
									onclick={() => toggleSubject(subject.value)}
									class={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-semibold transition ${
										selectedSubjects.includes(subject.value)
											? subject.active
											: 'border-[#26324A]/10 bg-[#FBF6EC] text-[#26324A]/70 hover:border-[#26324A]/25'
									}`}
								>
									<span class="text-2xl">{subject.icon}</span>
									{subject.value}
								</button>
							{/each}
						</div>

						<h3 class="mt-8 font-semibold">Which year are they in?</h3>
						<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
							{#each yearOptions as year}
								<button
									type="button"
									onclick={() => (yearGroup = year.value)}
									class={`rounded-2xl border-2 p-3 text-center text-sm font-semibold transition ${
										yearGroup === year.value
											? 'border-[#E8623A] bg-[#FEF1EB] text-[#E8623A] ring-2 ring-[#E8623A]'
											: 'border-[#26324A]/10 bg-[#FBF6EC] text-[#26324A]/70 hover:border-[#26324A]/25'
									}`}
								>
									<div>{year.label}</div>
									<div class="text-xs font-normal opacity-70">{year.sub}</div>
								</button>
							{/each}
						</div>
					{:else if step === 2}
						<h2 class="text-2xl font-semibold" style="font-family: 'Fraunces', serif;">
							Exam board & lesson plan
						</h2>
						<p class="mt-2 text-[#26324A]/60">Choose the format that fits best — you can change later.</p>

						<h3 class="mt-6 font-semibold">Exam board</h3>
						<div class="mt-3 flex flex-wrap gap-3">
							{#each examBoardOptions as board}
								<button
									type="button"
									onclick={() => (examBoard = board)}
									class={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
										examBoard === board
											? 'border-[#E8623A] bg-[#FEF1EB] text-[#E8623A]'
											: 'border-[#26324A]/10 bg-[#FBF6EC] text-[#26324A]/70 hover:border-[#26324A]/25'
									}`}
								>
									{board}
								</button>
							{/each}
						</div>
						{#if examBoard === 'Other'}
							<input
								type="text"
								bind:value={examBoardOther}
								placeholder="Tell us the exam board"
								class="mt-3 w-full rounded-xl border border-[#26324A]/15 bg-[#FBF6EC] px-4 py-2.5 text-sm focus:border-[#E8623A] focus:outline-none"
							/>
						{/if}

						<h3 class="mt-8 font-semibold">Lesson plan</h3>
						<div class="mt-3 space-y-3">
							{#each planOptions as p}
								<button
									type="button"
									onclick={() => (plan = p.value)}
									class={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition ${
										plan === p.value
											? 'border-[#E8623A] bg-[#FEF1EB] ring-2 ring-[#E8623A]'
											: 'border-[#26324A]/10 bg-[#FBF6EC] hover:border-[#26324A]/25'
									}`}
								>
									<div>
										<div class="flex items-center gap-2 font-semibold text-[#26324A]">
											{p.label}
											{#if p.badge}
												<span class="rounded-full bg-[#F4A340] px-2 py-0.5 text-xs font-bold text-white"
													>{p.badge}</span
												>
											{/if}
										</div>
										<div class="mt-0.5 text-sm text-[#26324A]/60">{p.desc}</div>
									</div>
									{#if p.price}
										<div class="shrink-0 text-right">
											{#if p.originalPrice}
												<span class="mr-1 text-sm font-medium text-[#26324A]/40 line-through"
													>{p.originalPrice}</span
												>
											{/if}
											<span class="text-lg font-bold" style="font-family: 'Fraunces', serif;"
												>{p.price}</span
											>
											<span class="text-xs text-[#26324A]/60">{p.unit}</span>
										</div>
									{/if}
								</button>
							{/each}
						</div>
					{:else if step === 3}
						<h2 class="text-2xl font-semibold" style="font-family: 'Fraunces', serif;">
							Tell us a bit more
						</h2>
						<p class="mt-2 text-[#26324A]/60">This helps us match the right tutor and timetable.</p>

						<h3 class="mt-6 font-semibold">How many hours a week, ideally?</h3>
						<input
							type="text"
							bind:value={hoursPerWeek}
							placeholder="e.g. 2 hours"
							class="mt-3 w-full max-w-xs rounded-xl border border-[#26324A]/15 bg-[#FBF6EC] px-4 py-2.5 text-sm focus:border-[#E8623A] focus:outline-none"
						/>

						<h3 class="mt-8 font-semibold">Preferred days</h3>
						<div class="mt-3 flex flex-wrap gap-3">
							{#each dayOptions as day}
								<button
									type="button"
									onclick={() => toggleDay(day)}
									class={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
										preferredDays.includes(day)
											? 'border-[#3E9C8F] bg-[#3E9C8F]/10 text-[#2f7a70]'
											: 'border-[#26324A]/10 bg-[#FBF6EC] text-[#26324A]/70 hover:border-[#26324A]/25'
									}`}
								>
									{day}
								</button>
							{/each}
						</div>

						<h3 class="mt-8 font-semibold">Target grade</h3>
						<div class="mt-3 flex flex-wrap gap-3">
							{#each gradeOptions as grade}
								<button
									type="button"
									onclick={() => (targetGrade = grade)}
									class={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
										targetGrade === grade
											? 'border-[#E8623A] bg-[#FEF1EB] text-[#E8623A]'
											: 'border-[#26324A]/10 bg-[#FBF6EC] text-[#26324A]/70 hover:border-[#26324A]/25'
									}`}
								>
									{grade}
								</button>
							{/each}
						</div>

						<h3 class="mt-8 font-semibold">What matters most to you?</h3>
						<div class="mt-3 flex flex-wrap gap-3">
							{#each driverOptions as driver}
								<button
									type="button"
									onclick={() => (decisionDriver = driver)}
									class={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
										decisionDriver === driver
											? 'border-[#E8623A] bg-[#FEF1EB] text-[#E8623A]'
											: 'border-[#26324A]/10 bg-[#FBF6EC] text-[#26324A]/70 hover:border-[#26324A]/25'
									}`}
								>
									{driver}
								</button>
							{/each}
						</div>
						{#if decisionDriver === 'Other'}
							<input
								type="text"
								bind:value={decisionDriverOther}
								placeholder="Tell us more"
								class="mt-3 w-full rounded-xl border border-[#26324A]/15 bg-[#FBF6EC] px-4 py-2.5 text-sm focus:border-[#E8623A] focus:outline-none"
							/>
						{/if}
					{:else if step === 4}
						<h2 class="text-2xl font-semibold" style="font-family: 'Fraunces', serif;">
							Who should we contact?
						</h2>
						<p class="mt-2 text-[#26324A]/60">We'll use these details to call and confirm everything.</p>

						<div class="mt-6 space-y-5">
							<div>
								<label class="text-sm font-semibold" for="parentName">Parent / student name</label>
								<input
									id="parentName"
									type="text"
									bind:value={parentName}
									placeholder="Full name"
									class="mt-1.5 w-full rounded-xl border border-[#26324A]/15 bg-[#FBF6EC] px-4 py-2.5 text-sm focus:border-[#E8623A] focus:outline-none"
								/>
							</div>
							<div>
								<label class="text-sm font-semibold" for="phone">Contact number (WhatsApp preferred)</label>
								<input
									id="phone"
									type="tel"
									bind:value={phone}
									placeholder="07…"
									class="mt-1.5 w-full rounded-xl border border-[#26324A]/15 bg-[#FBF6EC] px-4 py-2.5 text-sm focus:border-[#E8623A] focus:outline-none"
								/>
							</div>
							<div>
								<label class="text-sm font-semibold" for="email">Email address</label>
								<input
									id="email"
									type="email"
									bind:value={email}
									placeholder="you@example.com"
									class="mt-1.5 w-full rounded-xl border border-[#26324A]/15 bg-[#FBF6EC] px-4 py-2.5 text-sm focus:border-[#E8623A] focus:outline-none"
								/>
								{#if email && !emailValid}
									<p class="mt-1 text-xs text-[#E8623A]">That doesn't look like a valid email.</p>
								{/if}
							</div>
						</div>
					{:else if step === 5}
						<h2 class="text-2xl font-semibold" style="font-family: 'Fraunces', serif;">
							Review & book your free call
						</h2>
						<p class="mt-2 text-[#26324A]/60">
							Double-check your details, then confirm to lock in a free 15-minute call with a tutor.
						</p>

						<dl class="mt-6 divide-y divide-[#26324A]/10 rounded-2xl border border-[#26324A]/10 bg-[#FBF6EC] text-sm">
							<div class="flex justify-between gap-4 p-4">
								<dt class="text-[#26324A]/60">Year group</dt>
								<dd class="font-medium">{selectedYear?.label ?? '—'}</dd>
							</div>
							<div class="flex justify-between gap-4 p-4">
								<dt class="text-[#26324A]/60">Subjects</dt>
								<dd class="font-medium text-right">{selectedSubjects.join(', ') || '—'}</dd>
							</div>
							<div class="flex justify-between gap-4 p-4">
								<dt class="text-[#26324A]/60">Exam board</dt>
								<dd class="font-medium">{examBoard === 'Other' ? examBoardOther : examBoard || '—'}</dd>
							</div>
							<div class="flex justify-between gap-4 p-4">
								<dt class="text-[#26324A]/60">Plan</dt>
								<dd class="font-medium text-right">{selectedPlan?.label ?? '—'}</dd>
							</div>
							<div class="flex justify-between gap-4 p-4">
								<dt class="text-[#26324A]/60">Contact</dt>
								<dd class="font-medium text-right">{parentName} · {phone}</dd>
							</div>
						</dl>

						<h3 class="mt-8 font-semibold">Would you like a free 15-minute consultation call?</h3>
						<div class="mt-3 flex flex-wrap gap-3">
							{#each consultationOptions as opt}
								<button
									type="button"
									onclick={() => (consultationInterest = opt)}
									class={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
										consultationInterest === opt
											? 'border-[#3E9C8F] bg-[#3E9C8F]/10 text-[#2f7a70]'
											: 'border-[#26324A]/10 bg-[#FBF6EC] text-[#26324A]/70 hover:border-[#26324A]/25'
									}`}
								>
									{opt}
								</button>
							{/each}
						</div>
					{/if}

					<!-- Nav buttons -->
					<div class="mt-10 flex items-center justify-between border-t border-[#26324A]/10 pt-6">
						{#if step > 1}
							<button
								type="button"
								onclick={goBack}
								class="rounded-full border border-[#26324A]/20 px-6 py-2.5 text-sm font-semibold text-[#26324A] transition hover:border-[#26324A]/40"
							>
								Back
							</button>
						{:else}
							<span></span>
						{/if}

						{#if step < totalSteps}
							<button
								type="button"
								onclick={goNext}
								disabled={!canContinue}
								class="rounded-full bg-[#E8623A] px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d2542f] disabled:cursor-not-allowed disabled:opacity-40"
							>
								Continue
							</button>
						{:else}
							<button
								type="button"
								onclick={submitApplication}
								disabled={submitting}
								class="rounded-full bg-[#E8623A] px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d2542f] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{submitting ? 'Booking…' : 'Confirm & book my free call'}
							</button>
						{/if}
					</div>
				</div>

				<!-- Summary sidebar -->
				<aside class="hidden lg:block">
					<div class="sticky top-24 rounded-3xl border border-[#26324A]/10 bg-white p-6 shadow-sm">
						<h3 class="font-semibold" style="font-family: 'Fraunces', serif;">Your request so far</h3>
						<dl class="mt-4 space-y-4 text-sm">
							<div>
								<dt class="text-xs font-bold tracking-wide text-[#26324A]/40 uppercase">Year</dt>
								<dd class="mt-1 font-medium">{selectedYear?.label ?? 'Not chosen yet'}</dd>
							</div>
							<div>
								<dt class="text-xs font-bold tracking-wide text-[#26324A]/40 uppercase">Subjects</dt>
								<dd class="mt-1 flex flex-wrap gap-1.5">
									{#if selectedSubjects.length}
										{#each selectedSubjects as s}
											<span class="rounded-full bg-[#FBF6EC] px-2.5 py-1 text-xs font-medium">{s}</span>
										{/each}
									{:else}
										<span class="font-medium text-[#26324A]/40">Not chosen yet</span>
									{/if}
								</dd>
							</div>
							<div>
								<dt class="text-xs font-bold tracking-wide text-[#26324A]/40 uppercase">Exam board</dt>
								<dd class="mt-1 font-medium">
									{examBoard === 'Other' ? examBoardOther || 'Other' : examBoard || 'Not chosen yet'}
								</dd>
							</div>
							<div>
								<dt class="text-xs font-bold tracking-wide text-[#26324A]/40 uppercase">Plan</dt>
								<dd class="mt-1 font-medium">
									{selectedPlan ? selectedPlan.label : 'Not chosen yet'}
									{#if selectedPlan?.price}
										<span class="block text-[#E8623A]">{selectedPlan.price}{selectedPlan.unit}</span>
									{/if}
								</dd>
							</div>
						</dl>
						<div class="mt-6 rounded-2xl bg-[#FBF6EC] p-4 text-xs text-[#26324A]/60">
							🤝 First lesson risk-free. Cancel any time, no contract.
						</div>
					</div>
				</aside>
			</div>
		{/if}
	</div>
</div>
