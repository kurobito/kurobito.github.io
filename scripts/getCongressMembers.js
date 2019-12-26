// ProPublica Congress API Info
const apiKey = 'cHWA0cyVrIeIZHFmZyrlp3UBNFO1aqLn7LsYLij2';
let url = 'https://api.propublica.org/congress/v1/116/{chamber}/members.json';
// const url = 'https://api.propublica.org/congress/v1/116/senate/members.json';
const congressHeaders = new Headers();
congressHeaders.append('X-API-KEY', apiKey);
let houseMembers;
let senateMembers;
import {setNavBarLogic} from './navbar.js';
url = setNavBarLogic(url);
const chamber = window.location.href.split('?')[1];


// fetch request
const getCongressData = async (chamber) =>{
	const request = new Request(url, {method: 'GET', headers: congressHeaders});
	try{
		const response = await fetch(request);
		if(response.ok){
			const jsonResponse = await response.json();
			console.log(jsonResponse);
			switch(chamber){
				case 'senate':
				senateMembers = jsonResponse.results[0].members;
				return senateMembers;
				case 'house':
				houseMembers = jsonResponse.results[0].members;
				return houseMembers;
			}
		}else throw new Error(`${response.status} : ${response.statusText}`)
	}catch(e){console.log(e)}
}

// create Vue instance
const app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		houseMembers: [],
		senateMembers: [],
		searchQuery: ''
	}
})

// Create component to display a senate member
Vue.component('senate-member-card', {
	props: ['senateMember'],
	template: `<div class="col-sm-6 col-lg-3">
	<div class="card" style="width: 16rem;">
	<a v-bind:href="senateMember.url"><h5 class="card-header"> {{ senateMember.first_name }} {{ senateMember.middle_name }} {{ senateMember.last_name }}</h5></a>
	<ul class="list-group list-group-flush">
	<li class="list-group-item party" v-if="senateMember.party === 'R'">Republican</li>
	<li class="list-group-item party" v-else-if="senateMember.party === 'D'">Democrat</li>
	<li class="list-group-item party" v-else-if="senateMember.party === 'ID'">Independent</li>
	<li class="list-group-item party" v-else>Other</li>
	<li class="list-group-item state">State: {{ senateMember.state }}</li>
	<li class="list-group-item seniority">Seniority: {{ senateMember.seniority }}</li>
	<li class="list-group-item party-votes">Party Votes with: {{ senateMember.votes_with_party_pct }}%</li>
	<li class="list-group-item party-votes">Party Votes against: {{ senateMember.votes_against_party_pct }}%</li>
	</ul>
	</div>
	</div>`
})

// Create component to display a house member
Vue.component('house-member-card', {
	props: ['houseMember'],
	template: `<div class="col-sm-6 col-lg-3">
	<div class="card" style="width: 16rem;">
	<a v-bind:href="houseMember.url"><h5 class="card-header"> {{ houseMember.first_name }} {{ houseMember.middle_name }} {{ houseMember.last_name }}</h5></a>
	<ul class="list-group list-group-flush">
	<li class="list-group-item party" v-if="houseMember.party === 'R'">Republican</li>
	<li class="list-group-item party" v-else-if="houseMember.party === 'D'">Democrat</li>
	<li class="list-group-item party" v-else-if="houseMember.party === 'ID'">Independent</li>
	<li class="list-group-item party" v-else>Other</li>
	<li class="list-group-item state">State: {{ houseMember.state }}</li>
	<li class="list-group-item seniority">Seniority: {{ houseMember.seniority }}</li>
	<li class="list-group-item party-votes">Party Votes with: {{ houseMember.votes_with_party_pct }}%</li>
	<li class="list-group-item party-votes">Party Votes against: {{ houseMember.votes_against_party_pct }}%</li>
	</ul>
	</div>
	</div>`
})

// update vue app
function updateVue(member){
	switch(chamber){
		case 'senate':
		app.senateMembers = member;
		break;
		case 'house':
		app.houseMembers = member;
		break;
	}
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

function filterCongressMembersByParty(partyFilterList, members){
	let filteredCongressMembers = members.filter(member => {
		for(let i = 0; i < partyFilterList.length; i++){
			// console.log(`${partyFilterList[i]} === ${member.party} = ${partyFilterList[i] === member.party}`)
			if (partyFilterList[i] === member.party) return member;
		}
		if (member.party != 'R' || member.party != 'D' || member.party != 'ID') {
			console.log(member);
		}
	})
	console.log(filteredCongressMembers);
	updateVue(filteredCongressMembers);
}

// eventListener for search
let searchByNameInput = document.getElementById('searchByName');
searchByNameInput.oninput = () =>{
	if(congressMembers){
		searchCongressMembers(congressMembers, searchByNameInput.value);
	}
}

// eventListener for filter by party
let filterByParty = document.forms['filterByParty'].elements['partyFilters[]'];
let filterAll = document.getElementById('filterAll');
let partyFilterList = [];

filterAll.onchange = () => {
	if (filterAll.checked) {
		partyFilterList.splice(0); // makes sure the array is always empty before adding all filters
		filterByParty.forEach(partyFilter => {
			partyFilter.checked = true;
			partyFilterList.push(partyFilter.value);
		});
	}else{
		filterByParty.forEach(partyFilter => {
			partyFilter.checked = false;
		});
		partyFilterList.splice(0); 
	} 

	console.log(partyFilterList);
	if (senateMembers) {
		filterCongressMembersByParty(partyFilterList, senateMembers);
	}else{
		filterCongressMembersByParty(partyFilterList, houseMembers);
	}
}
filterByParty.forEach(partyFilter => {
	partyFilter.onchange = () => {
		if(partyFilter.checked){
			if (partyFilterList.length < filterByParty.length) {
				partyFilterList.push(partyFilter.value);
			}
		} else partyFilterList.splice(partyFilterList.indexOf(partyFilter.value), 1);
		if (partyFilterList.length === filterByParty.length) filterAll.checked = true;
		else filterAll.checked = false;
		console.log(partyFilterList);
		if (senateMembers) {
			filterCongressMembersByParty(partyFilterList, senateMembers);
		}else{
			filterCongressMembersByParty(partyFilterList, houseMembers);
		}
	}
})

const init = () => {
	getCongressData(chamber).then(members => {
		updateVue(members);
		filterAll.onchange()
	});
}

setTimeout(init, 500);


