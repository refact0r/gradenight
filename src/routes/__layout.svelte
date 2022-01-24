<script context="module">
	export async function load({}) {
		return {}
	}
</script>

<script>
	import '../app.css'
	import 'bootstrap-icons/font/bootstrap-icons.css'
	import { session } from '$app/stores'
	import { onMount } from 'svelte'
	import ProgressBar from 'svelte-progress-bar'
	let progress

	onMount(async () => {
		if ($session.user) {
			console.log('fetch')
			progress.start()
			const res = await fetch('/data')
			const json = await res.json()
			$session.student = json.student
			$session.gradebook = json.gradebook
			progress.complete()
		}
	})

	async function logout() {
		$session = {}
		await fetch('/auth/logout', {
			method: 'POST'
		})
	}
</script>

{#if $session.user}
	<ProgressBar
		bind:this={progress}
		color="#0366d6"
		minimum={0.02}
		maximum={0.98}
		intervalTime={100}
		stepSizes={[0.04]}
	/>
	<nav class="box">
		{#if $session.student}
			<img src={'data:image/jpeg;base64,' + $session.student.Photo} on:click={logout} />
		{/if}
		<a href="/">
			<i class="bi bi-house" />
		</a>
		<a href="/grades">
			<i class="bi bi-list-ol" />
		</a>
		<a href="/assignments">
			<i class="bi bi-pen" />
		</a>
		<a href="/settings">
			<i class="bi bi-gear" />
		</a>
	</nav>
	<main>
		<slot />
	</main>
{:else}
	<slot />
{/if}

<style>
	nav {
		display: flex;
		flex-direction: column;
		justify-items: center;
		width: min-content;
		padding: 20px;
	}

	main {
		width: 100%;
		background-color: var(--bg-color-1);
		height: calc(100vh - 2 * var(--spacing));
		margin-left: var(--spacing);
	}

	img {
		width: 60px;
		height: 60px;
		object-fit: cover;
		object-position: 0 0;
		border-radius: 60px;
	}

	a {
		height: 30px;
		margin-top: 40px;
		text-align: center;
	}
	a:first-of-type {
		margin-top: 100px;
	}
	a:nth-last-of-type(2) {
	}
	a:last-of-type {
		margin-top: auto;
		margin-bottom: 20px;
	}

	i {
		display: inline-block;
		height: 30px;
		font-size: 30px;
		line-height: 30px;
	}
</style>
