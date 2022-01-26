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

	let username
	let password
	let error

	async function login() {
		if (!username) {
			error = 'Please enter a username'
			return
		}
		if (!password) {
			error = 'Please enter a password'
			return
		}
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
			$session.gradebook = json.gradebook
			$session.student = json.student
			console.log($session)
			goto('/')
		} else {
			error = 'Incorrect username or password'
		}
	}
</script>

<div class="content">
	<h1>Login</h1>

	<form on:submit|preventDefault={login}>
		Username <input type="text" bind:value={username} /><br />
		<br />
		Password <input type="password" bind:value={password} /><br />
		<br />
		{#if error}
			{error}<br /><br />
		{/if}
		<button type="submit">Login</button>
	</form>
</div>
