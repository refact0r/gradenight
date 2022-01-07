<script context="module">
	export async function load({ fetch }) {
		const auth = window.localStorage.get('authorization')
		let grades;
		if (auth) {
			let res = await fetch('/grades', {
				headers: { Authorization: 'Basic ' + btoa(username + ':' + password) }
			});
			grades = await res.json();
		}
		return {
			props: {
				grades
			}
		}
	}
</script>

<script>
    export let grades;
</script>

<slot {grades}/>
