<script context="module">
	export async function load({ session }) {
		if (session.user) {
			return {
				status: 302,
				redirect: '/'
			}
		}
		return {}
	}
</script>

<script>
	import { fade } from 'svelte/transition'
	import { session } from '$app/stores'
	import { goto } from '$app/navigation'
	import { parseData } from '$lib/js/parseData.js'
	import { oldAssignments } from '$lib/js/oldAssignments.js'

	let districtUrl = 'https://wa-bsd405-psv.edupoint.com/'
	let username
	let password
	let error
	let status

	async function login() {
		error = ''
		if (!username) {
			error = 'Please enter a username.'
			return
		}
		if (!password) {
			error = 'Please enter a password.'
			return
		}
		status = 'Logging in...'
		const res = await fetch('/auth/login', {
			method: 'POST',
			body: JSON.stringify({
				username,
				password,
				districtUrl
			})
		})
		if (res.ok) {
			const json = await res.json()
			let { student, periods, currentPeriod } = json
			$session = {
				...$session,
				user: {
					username,
					password,
					districtUrl
				},
				student,
				periods,
				currentPeriod,
				selectedPeriod: currentPeriod,
				selected: periods[currentPeriod],
				gradebook: periods[currentPeriod]
			}
			parseData($session, $oldAssignments)
			goto('/')
		} else {
			error = 'Invalid login credentials.'
		}
		status = ''
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="content" out:fade={{ duration: 200 }}>
	<form on:submit|preventDefault={login}>
		<h2>Login</h2>
		<input type="text" placeholder="District URL" bind:value={districtUrl} />
		<input type="text" placeholder="Username" bind:value={username} />
		<input type="password" placeholder="Password" bind:value={password} />
		<div class="error">
			{#if error}
				{error}
			{:else}
				Your login info will not be saved anywhere except your browser.<br />
				You can see all the code on the
				<a href="https:/github.com/refact0r/studentvue">github</a>.
			{/if}
		</div>
		<button type="submit">{status ? status : 'Login'}</button>
	</form>
</div>

<style lang="scss">
	.content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	form {
		@include box;
		width: 500px;
		display: flex;
		flex-direction: column;
	}

	.error {
		margin: 20px 0;
		color: var(--font-color-2);
		font-size: 0.8em;
		text-align: center;
	}

	button:hover {
		background: var(--bg-color-1-5);
	}

	input {
		margin-top: $spacing-small;
	}

	h2 {
		width: 100%;
		text-align: center;
	}
</style>
