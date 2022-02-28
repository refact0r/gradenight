<script>
	import { session } from '$app/stores'
	export let period
</script>

<select bind:value={period}>
	{#each $session.gradebook.ReportingPeriods.ReportPeriod as period, index}
		<option value={index}>{period.GradePeriod}</option>
	{/each}
</select>

<style lang="scss">
	select {
		@include box;
		padding: $spacing-small;
		width: fit-content;
		margin-left: auto;
		&:hover {
			cursor: pointer;
			background-color: var(--bg-color-2-5);
		}
	}
</style>
