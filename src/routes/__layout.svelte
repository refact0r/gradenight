<script context="module">
	export async function load({ fetch }) {
		return {}
	}
</script>

<script>
    export let grades;
</script>

<slot {grades}/>
