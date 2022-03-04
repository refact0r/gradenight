<script context="module">
	export async function load({ url }) {
		return {
			props: {
				key: url.href
			}
		}
	}
</script>

<script>
	import '../app.scss'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { fade } from 'svelte/transition'
	import { session, page } from '$app/stores'
	import { browser } from '$app/env'
	import { parseData } from '$lib/js/parseData.js'
	import { settings } from '$lib/js/settings.js'
	import Spinner from '$lib/components/Spinner.svelte'

	export let key

	onMount(async () => {
		if ($session.user) {
			console.log('fetch')
			const res = await fetch('/data')
			const json = await res.json()
			let { student, periods, currentPeriod } = json
			$session = {
				...$session,
				student,
				periods,
				currentPeriod,
				selectedPeriod: currentPeriod,
				selected: periods[currentPeriod],
				gradebook: periods[currentPeriod]
			}
			parseData($session)
		}
	})

	$: if ($session.periods) {
		$session.selected = $session.periods[$session.selectedPeriod]
	}
</script>

<svelte:head>
	<meta name="color-scheme" content={$settings.theme} />
	<link rel="stylesheet" href={`/themes/${$settings.theme}.css`} />
</svelte:head>

{#if $session.user}
	{#if $session.gradebook && $session.student}
		<nav in:fade={{ duration: 200, delay: 200 }}>
			{#if $session.student}
				<img alt="profile" src={'data:image/jpeg;base64,' + $session.student.Photo} />
			{/if}
			<a class:active={$page.url.pathname === '/'} sveltekit:prefetch href="/">
				<i class="bi bi-house" />
			</a>
			<a class:active={$page.url.pathname === '/grades'} sveltekit:prefetch href="/grades">
				<i class="bi bi-list-ol" />
			</a>
			<a
				class:active={$page.url.pathname === '/assignments'}
				sveltekit:prefetch
				href="/assignments"
			>
				<i class="bi bi-pen" />
			</a>
			<a
				class:active={$page.url.pathname === '/settings'}
				sveltekit:prefetch
				href="/settings"
			>
				<i class="bi bi-gear" />
			</a>
		</nav>
		<main in:fade={{ duration: 200, delay: 200 }}>
			{#key key}
				<div
					class="transition-container"
					in:fly={{ y: -5, duration: 200, delay: 200 }}
					out:fly|local={{ y: 5, duration: 200 }}
				>
					<slot />
				</div>
			{/key}
		</main>
	{:else}
		<div class="loading-container" out:fade={{ duration: 200 }}>
			<div class="loading">
				<Spinner />
				<div class="spinner-label">Fetching student info...</div>
			</div>
		</div>
	{/if}
{:else}
	<slot />
{/if}

<style lang="scss">
	nav {
		@include box;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min-content;
		padding: $spacing-small;
	}

	main {
		width: 100%;
		height: 100%;
		background-color: var(--bg-color-1);
		height: calc(100vh - 2 * $spacing);
		margin-left: $spacing;
	}

	.transition-container {
		width: 100%;
		height: 100%;
	}

	.loading-container {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		width: 100%;
		height: 100%;
	}

	.loading {
		width: max-content;
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.spinner-label {
		margin-top: 10px;
	}

	img {
		width: 50px;
		height: 50px;
		object-fit: cover;
		object-position: 0 0;
		border-radius: 50px;
	}

	a {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		height: 50px;
		width: 50px;
		margin-top: 30px;
		text-align: center;
		border-radius: 50%;
		color: var(--font-color);
		&:first-of-type {
			margin-top: 50px;
		}
		&:last-of-type {
			margin-top: auto;
			margin-bottom: 12.5px;
		}
		&:hover {
			background: var(--bg-color-1-5);
			// color: var(--font-color-2);
		}
		&:active {
			background: var(--bg-color-1);
			// color: var(--font-color-3);
			i {
				transform: scale(0.9);
			}
		}
		&.active {
			background: var(--bg-color-1);
			// color: var(--font-color-3);
		}
	}

	i {
		display: inline-block;
		height: 25px;
		font-size: 25px;
		line-height: 25px;
	}
</style>
