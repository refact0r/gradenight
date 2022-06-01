<script>
	export let width, border
</script>

<div class="container">
	<div
		class="loader"
		style={'width: ' + width + 'px; height: ' + width + 'px; border-width: ' + border + 'px;'}
	/>
</div>

<style lang="scss">
	.container {
		width: min-content;
		height: min-content;
		display: inline-block;
	}

	.loader {
		border: 3px solid var(--bg-color-2);
		border-top: 3px solid var(--accent-color);
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg) scale(1);
		}
		100% {
			transform: rotate(360deg) scale(1);
		}
	}
</style>
