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

const chamberIsSenate = () => {
	return chamber === 'senate';
}

// fetch request
const getCongressData = async (chamber) =>{
	const request = new Request(url, {method: 'GET', headers: congressHeaders});
	try{
		const response = await fetch(request);
		if(response.ok){
			const jsonResponse = await response.json();
			console.log(jsonResponse);
			if(chamberIsSenate()){
				senateMembers = jsonResponse.results[0].members;
				senateMembers.sort(sortMembersByNameAscending);
				return senateMembers;
			}else {
				houseMembers = jsonResponse.results[0].members;
				houseMembers.sort(sortMembersByNameAscending);
				return houseMembers;
			}
		}else throw new Error(`${response.status} : ${response.statusText}`)
	}catch(e){console.log(e)}
}

function sortMembersByNameAscending(a, b){
	if(a.first_name < b.first_name) return -1;
	if(a.first_name > b.first_name) return 1;
	return 0; 
}

function sortMembersByNameDescending(a, b){
	if(a.first_name < b.first_name) return 1;
	if(a.first_name > b.first_name) return -1;
	return 0; 
}

// Create component to display a senate member
let senateMemberCard = Vue.component('senate-member-card', {
	props: ['senateMember'],
	template: `<div class="col-sm-6 col-lg-3">
	<div class="card" style="width: 16rem;">
	<a v-bind:href="senateMember.url"><h5 class="card-header"> {{ senateMember.first_name }} {{ senateMember.middle_name }} {{ senateMember.last_name }}</h5></a>
	<ul class="list-group list-group-flush">
	<li class="list-group-item party bg-danger text-white" v-if="senateMember.party === 'R'">Republican</li>
	<li class="list-group-item party bg-primary text-white" v-else-if="senateMember.party === 'D'">Democrat</li>
	<li class="list-group-item party bg-info text-white" v-else-if="senateMember.party === 'ID'">Independent</li>
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
let houseMemberCard = Vue.component('house-member-card', {
	props: ['houseMember'],
	template: `<div class="col-sm-6 col-lg-3">
	<div class="card" style="width: 16rem;">
	<a v-bind:href="houseMember.url"><h5 class="card-header"> {{ houseMember.first_name }} {{ houseMember.middle_name }} {{ houseMember.last_name }}</h5></a>
	<ul class="list-group list-group-flush">
	<li class="list-group-item party" v-if="houseMember.party === 'R'">Republican</li>
	<li class="list-group-item party" v-else-if="houseMember.party === 'D'">Democrat</li>
	<li class="list-group-item party" v-else-if="houseMember.party === 'ID' || houseMember.party === 'I'">Independent</li>
	<li class="list-group-item party" v-else>Other</li>
	<li class="list-group-item state">State: {{ houseMember.state }}</li>
	<li class="list-group-item state">District: {{ houseMember.district }}</li>
	<li class="list-group-item seniority">Seniority: {{ houseMember.seniority }}</li>
	<li class="list-group-item party-votes">Party Votes with: {{ houseMember.votes_with_party_pct }}%</li>
	<li class="list-group-item party-votes">Party Votes against: {{ houseMember.votes_against_party_pct }}%</li>
	</ul>
	</div>
	</div>`
})

let stateCheckbox = Vue.component('state-checkbox', {
	props: ['state'],
	template: `<div class="custom-control custom-checkbox">
	<input type="checkbox" class="custom-control-input" v-bind:id="state.code" name="stateFilters[]" v-bind:value="state.code">
	<label class="custom-control-label no-select" v-bind:for="state.code">{{ state.name }}</label>
	</div>`
})

// create Vue instance
const app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		houseMembers: [],
		senateMembers: [],
		searchQuery: '',
		states: [{code: "AK", name: "Alaska"}, {code: "AL", name: "Alabama"}, {code: "AR", name: "Arkansas"}, {code: "AZ", name: "Arizona"}, {code: "CA", name: "California"}
		,{code: "CO", name: "Colorado"}, {code: "CT", name: "Connecticut"}, {code: "DC", name: "District of Columbia"}, {code: "DE", name: "Delaware"}, {code: "FL", name: "Florida"}
		,{code: "GA", name: "Georgia"}, {code: "HI", name: "Hawaii"}, {code: "IA", name: "Iowa"}, {code: "ID", name: "Idaho"},{code: "IL", name: "Illinois"}, {code: "IN", name: "Indiana"}
		,{code: "KS", name: "Kansas"}, {code: "KY", name: "Kentucky"},{code: "LA", name: "Louisiana"}, {code: "ME", name: "Maine"}, {code: "MD", name: "Maryland"}
		,{code: "MA", name: "Massachusetts"},{code: "MI", name: "Michigan"}, {code: "MN", name: "Minnesota"}, {code: "MS", name: "Mississippi"}, {code: "MO", name: "Missouri"}
		,{code: "MT", name: "Montana"}, {code: "NE", name: "Nebraska"}, {code: "NV", name: "Nevada"}, {code: "NH", name: "New Hampshire"}, {code: "NJ", name: "New Jersey"}
		,{code: "NM", name: "New Mexico"}, {code: "NY", name: "New York"}, {code: "NC", name: "North Carolina"},{code: "ND", name: "North Dakota"}, {code: "OH", name: "Ohio"}
		,{code: "OK", name: "Oklahoma"}, {code: "OR", name: "Oregon"}, {code: "PA", name: "Pennsylvania"}, {code: "RI", name: "Rhode Island"}, {code: "SC", name: "South Carolina"}
		,{code: "SD", name: "South Dakota"}, {code: "TN", name: "Tennessee"}, {code: "TX", name: "Texas"},{code: "UT", name: "Utah"}, {code: "VT", name: "Vermont"}
		,{code: "VA", name: "Virginia"}, {code: "WA", name: "Washington"}, {code: "WV", name: "West Virginia"}, {code: "WI", name: "Wisconsin"}, {code: "WY", name: "Wyoming"}]
	},
	components: {
		senateMemberCard: senateMemberCard,
		houseMemberCard: houseMemberCard,
		stateCheckbox: stateCheckbox
	}
})

// update vue app
function updateVue(members){
	if(chamberIsSenate()){
		app.senateMembers = members;
	}else{
		app.houseMembers = members;
	}
}

// Sort button alphabet
let sortByNameButton = document.getElementById('sortAlphabetically');
sortByNameButton.onclick = () =>{
	let sortAtoZString = 'Sort A to Z &nbsp;<i aria-hidden="true" class="fas fa-sort-alpha-up"></i>';
	let sortZtoAString = 'Sort Z to A &nbsp;<i aria-hidden="true" class="fas fa-sort-alpha-down-alt"></i>'
	if (sortByNameButton.innerHTML === sortAtoZString) {
		sortByNameButton.innerHTML = sortZtoAString;
		senateMembers.sort(sortMembersByNameDescending);
		updateVue(senateMembers);
	}else {
		sortByNameButton.innerHTML = sortAtoZString;
		senateMembers.sort(sortMembersByNameAscending)
		updateVue(senateMembers);
	}
}

function searchCongressMembers(members, searchQuery){
	let searchedCongressMembers = members.filter(member => {
		let memberName;
		if(member.middle_name){
			memberName = `${member.first_name} ${member.middle_name} ${member.last_name}`;
		}else{
			memberName = `${member.first_name} ${member.last_name}`;
		}
		if(memberName.toLowerCase().includes(searchQuery.toLowerCase())) {
			console.log(memberName);
			console.log('Found with ' + searchQuery)
		}else console.log(searchQuery + ' not found');
		return memberName.toLowerCase().includes(searchQuery.toLowerCase());
	})
	return searchedCongressMembers;
}

function filterCongressMembersByParty(partyFilterList, members){
	let filteredCongressMembers = members.filter(member => {
		for(let i = 0; i < partyFilterList.length; i++){
			// console.log(`${partyFilterList[i]} === ${member.party} = ${partyFilterList[i] === member.party}`)
			if (partyFilterList[i] === member.party || partyFilterList[i] === 'I') return member;
		}
		if (member.party != 'R' || member.party != 'D' || member.party != 'ID') {
			console.log(member);
		}
	})
	console.log(filteredCongressMembers);
	return filteredCongressMembers;
}

// eventListener for search
let searchByNameInput = document.getElementById('searchByName');
searchByNameInput.oninput = () =>{
	if(chamberIsSenate()){
		updateVue(searchCongressMembers(filterCongressMembersByParty(partyFilterList, senateMembers), searchByName.value));
	}else{
		updateVue(searchCongressMembers(filterCongressMembersByParty(partyFilterList, houseMembers), searchByName.value));
	}
}

// eventListener for filter by party
let filterByParty = document.forms['filterByParty'].elements['partyFilters[]'];
let filterAllParties = document.getElementById('filterAllParties');
let partyFilterList = [];

filterAllParties.onchange = () => {
	if (filterAllParties.checked) {
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
	if (chamberIsSenate()) {
		if (searchByName.value) {
			updateVue(searchCongressMembers(filterCongressMembersByParty(partyFilterList, senateMembers), searchByName.value));
		}else{
			updateVue(filterCongressMembersByParty(partyFilterList, senateMembers));
		}
	}else{
		if (searchByName.value) {
			updateVue(searchCongressMembers(filterCongressMembersByParty(partyFilterList, houseMembers), searchByName.value));
		}else{
			updateVue(filterCongressMembersByParty(partyFilterList, houseMembers));
		}
	}
}
filterByParty.forEach(partyFilter => {
	partyFilter.onchange = () => {
		if(partyFilter.checked){
			if (partyFilterList.length < filterByParty.length) {
				partyFilterList.push(partyFilter.value);
			}
		} else partyFilterList.splice(partyFilterList.indexOf(partyFilter.value), 1);
		if (partyFilterList.length === filterByParty.length) filterAllParties.checked = true;
		else filterAllParties.checked = false;
		console.log(partyFilterList);
		if (chamberIsSenate()) {
			if (searchByName.value) {
				updateVue(searchCongressMembers(filterCongressMembersByParty(partyFilterList, senateMembers), searchByName.value));
			}else{
				updateVue(filterCongressMembersByParty(partyFilterList, senateMembers));
			}
		}else{
			if (searchByName.value) {
				updateVue(searchCongressMembers(filterCongressMembersByParty(partyFilterList, houseMembers), searchByName.value));
			}else{
				updateVue(filterCongressMembersByParty(partyFilterList, houseMembers));
			}
		}
	}
})

// let filterByState = document.forms['filterByState'].elements['stateFilters[]'];


const init = async () => {
	const members = await getCongressData(chamber);

	updateVue(members)
	filterAllParties.onchange();
}

setTimeout(init, 500);


