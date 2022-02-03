<script>
	import { session } from '$app/stores'
	export let period
</script>

<select class="period box" bind:value={period}>
	{#each $session.gradebook.ReportingPeriods.ReportPeriod as period, index}
		<option value={index}>{period.GradePeriod}</option>
	{/each}
</select>

<style>
	select {
		padding: calc(var(--spacing) * 0.8);
		width: fit-content;
		margin-left: auto;
	}
</style>
