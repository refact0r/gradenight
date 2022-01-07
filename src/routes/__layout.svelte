<script context="module">
	export async function load({ page }) {
		return {
			props: {
				key: page.path
			}
		}
	}
</script>

<script>
    
</script>

<slot />
