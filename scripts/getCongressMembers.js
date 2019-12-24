// ProPublica Congress API Info
const apiKey = 'cHWA0cyVrIeIZHFmZyrlp3UBNFO1aqLn7LsYLij2';
const url = 'https://api.propublica.org/congress/v1/116/senate/members.json';
const congressHeaders = new Headers();
congressHeaders.append('X-API-KEY', apiKey);
let congressMembers;

const getCongressData = async () =>{
	if (!congressMembers) {
		const request = new Request(url, {method: 'GET', headers: congressHeaders});
		try{
			const response = await fetch(request);
			if(response.ok){
				const jsonResponse = await response.json();
				congressMembers = jsonResponse.results[0].members;
				console.log(congressMembers);
				updateVue(congressMembers);
			}
		}catch(e){console.log(e)}
	}
}

const app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		congressMembers: [],
		searchQuery: ''
	}
})

Vue.component('congress-member-card', {
	props: ['member'],
	template: `<div class="card" style="width: 18rem;">
	<a v-bind:href="member.url"><h5 class="card-header"> {{ member.first_name }} {{ member.middle_name }} {{ member.last_name }}</h5></a>
	<ul class="list-group list-group-flush">
	<li class="list-group-item party" v-if="member.party === 'R'">Republican</li>
	<li class="list-group-item party" v-if="member.party === 'D'">Democrat</li>
	<li class="list-group-item party" v-if="member.party === 'ID'">Independent</li>
	<li class="list-group-item state">State: {{ member.state }}</li>
	<li class="list-group-item seniority">Seniority: {{ member.seniority }}</li>
	<li class="list-group-item party-votes">Party Votes with: {{ member.votes_with_party_pct }}%</li>
	<li class="list-group-item party-votes">Party Votes against: {{ member.votes_against_party_pct }}%</li>
	</ul>
	</div>`
})

function updateVue(congressMembers){
	app.congressMembers = congressMembers;
}

function searchCongressMembers(congressMembers, searchQuery){
	let searchedCongressMembers = congressMembers.filter(member => {
		// if(member.first_name.toLowerCase().includes(searchQuery.toLowerCase())) {
		// 	console.log(member);
		// 	console.log('Found with ' + searchQuery)
		// }else console.log(searchQuery + ' not found');
		return member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
		member.last_name.toLowerCase().includes(searchQuery.toLowerCase);
	})
	updateVue(searchedCongressMembers);
}

getCongressData();
let searchByNameInput = document.getElementById('searchByName');
searchByNameInput.oninput = () =>{
	if(congressMembers){
		searchCongressMembers(congressMembers, searchByNameInput.value);
	}
}