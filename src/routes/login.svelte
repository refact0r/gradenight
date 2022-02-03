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
	import { session } from '$app/stores'
	import { goto } from '$app/navigation'
	import { parseData } from '$lib/parseData.js'

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
				password
			})
		})
		if (res.ok) {
			const json = await res.json()
			$session.user = {
				username,
				password
			}
			$session = parseData($session, json)
			goto('/')
		} else {
			error = 'Invalid login credentials.'
		}
		status = ''
	}
</script>

<svelte:head>
	<title>Login to StudentVue</title>
</svelte:head>

<div class="content">
	<form on:submit|preventDefault={login}>
		<h2>StudentVue</h2>
		<input type="text" placeholder="Username" bind:value={username} />
		<input type="password" placeholder="Password" bind:value={password} />
		<div class="error">
			{error ? error : 'Your login info will not be saved anywhere except your browser.'}
		</div>
		<button type="submit">{status ? status : 'Login'}</button>
	</form>
</div>

<style>
	.content {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	form {
		width: 500px;
		padding: 20px;
		border-radius: 18px;
		background: var(--bg-color-2);
		display: flex;
		flex-direction: column;
	}

	.error {
		margin: 20px 0;
		color: var(--sub-color);
		font-size: 0.8em;
		text-align: center;
	}

	input,
	button {
		border-radius: 12px;
		padding: 10px;
		background: var(--bg-color-1);
	}

	button:hover {
		background: var(--bg-color-1-5);
	}

	input {
		margin-top: 10px;
	}

	h2 {
		width: 100%;
		text-align: center;
	}
</style>
