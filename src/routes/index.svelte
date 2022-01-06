<script>
	let grades;
	let username;
	let password;
	async function getGrades() {
		let res = await fetch('/grades');
		grades = await res.json();
		console.log(grades);
	}
</script>

<h1>Synergy Test</h1>

<button on:click={getGrades}>Get Grades</button>

{#if grades}
	<h3>{grades.ReportingPeriod.GradePeriod}</h3>
	Username<br/>
	<input type="text" bind:value={username}/>
	Password<br/>	
	<input type="password" bind:value={password}/>
	<table>
		{#each grades.Courses.Course as course}
			<tr>
				<td>{course.Title}</td>
				<td>{course.Marks.Mark.CalculatedScoreString} ({course.Marks.Mark.CalculatedScoreRaw})</td>
			</tr>
		{/each}
	</table>
{/if}
