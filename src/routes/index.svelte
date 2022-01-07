<script>
	let grades;
	let username;
	let password;
	async function getGrades() {
		let res = await fetch('/grades', {
			headers: { Authorization: 'Basic ' + btoa(username + ':' + password) }
		});
		grades = await res.json();
		console.log(grades);
	}
</script>

<h1>Synergy Test</h1>

<form on:submit|preventDefault={getGrades}>
	Username <input type="text" bind:value={username} /><br />
	<br />
	Password <input type="password" bind:value={password} /><br />
	<br />
	<button type="submit">Get Grades</button>
</form>

{#if grades}
	<h3>{grades.ReportingPeriod.GradePeriod}</h3>
	<table>
		{#each grades.Courses.Course as course}
			<tr>
				<td>{course.Title}</td>
				<td>{course.Marks.Mark.CalculatedScoreString} ({course.Marks.Mark.CalculatedScoreRaw})</td>
			</tr>
		{/each}
	</table>
{/if}
