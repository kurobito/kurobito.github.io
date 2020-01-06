import { getCongressData, chamber } from "./getCongressMembers.js";
import {
	sortByFirstNameAscending,
	sortByFirstNameDescending,
	sortByLastNameAscending,
	sortByLastNameDescending,
	sortByPartyAscending,
	sortByPartyDescending,
	sortByStateAscending,
	sortByStateDescending,
	sortByDistrictAscending,
	sortByDistrictDescending,
	sortBySeniorityAscending,
	sortBySeniorityDescending,
	sortByVotesWithAscending,
	sortByVotesWithDescending,
	sortByVotesAgainstAscending,
	sortByVotesAgainstDescending
} from "./sortComparators.js";

// make copy of congressData array
let senateMembers = [];
let houseMembers = [];

let displayCard = Vue.component("displayCard", {
	props: [
		"senateMembers",
		"houseMembers",
		"currentSenateComponent",
		"currentHouseComponent",
		"states",
		"getStateName"
	],
	mounted: function() {
		this.$nextTick(function() {
			setSortCardsListeners();
		});
	},
	template: `<div class='row pb-4'>
	<div :is="currentSenateComponent"
	v-for="senateMember in senateMembers"
	v-bind:key="senateMember.id"
	v-bind:senate-member="senateMember"
	v-bind:states="states"
	v-bind:get-state-name="getStateName">
	</div>
	<div :is="currentHouseComponent"
	v-for="houseMember in houseMembers"
	v-bind:key="houseMember.id"
	v-bind:house-member="houseMember"
	v-bind:states="states"
	v-bind:get-state-name="getStateName">
	</div>
	</div>
	`
});

// Create card component to display a senate member, with his first name displayed first
let senateMemberCardFirstName = Vue.component("senateMemberCardFirstName", {
	props: ["senateMember", "states", "getStateName"],
	template: `<div class="col-sm-6 col-lg-3">
	<div class="card" style="width: 16rem;">
	<a v-bind:id="senateMember.id" v-bind:href="senateMember.url"><h5 class="card-header"> {{ senateMember.first_name }} {{ senateMember.middle_name }} {{ senateMember.last_name }}</h5></a>
	<ul class="list-group list-group-flush">
	<li class="list-group-item party bg-danger text-white" v-if="senateMember.party === 'R'">Republican</li>
	<li class="list-group-item party bg-primary text-white" v-else-if="senateMember.party === 'D'">Democrat</li>
	<li class="list-group-item party bg-info text-white" v-else-if="senateMember.party === 'ID'">Independent</li>
	<li class="list-group-item party" v-else>Other</li>
	<li class="list-group-item state">State: {{ getStateName(senateMember.state) }}</li>
	<li class="list-group-item seniority">Seniority: {{ senateMember.seniority }}</li>
	<li class="list-group-item party-votes">Party Votes with: {{ senateMember.votes_with_party_pct }}%</li>
	<li class="list-group-item party-votes">Party Votes against: {{ senateMember.votes_against_party_pct }}%</li>
	</ul>
	</div>
	</div>`
});

// Create card component to display a senate member, with his last name displayed first
let senateMemberCardLastName = Vue.component("senateMemberCardLastName", {
	props: ["senateMember", "states", "getStateName"],
	template: `<div class="col-sm-6 col-lg-3">
	<div class="card" style="width: 16rem;">
	<a v-bind:id="senateMember.id" v-bind:href="senateMember.url"><h5 class="card-header"> {{ senateMember.last_name }}, {{ senateMember.first_name }} {{ senateMember.middle_name }}</h5></a>
	<ul class="list-group list-group-flush">
	<li class="list-group-item party bg-danger text-white" v-if="senateMember.party === 'R'">Republican</li>
	<li class="list-group-item party bg-primary text-white" v-else-if="senateMember.party === 'D'">Democrat</li>
	<li class="list-group-item party bg-info text-white" v-else-if="senateMember.party === 'ID'">Independent</li>
	<li class="list-group-item party" v-else>Other</li>
	<li class="list-group-item state">State: {{ getStateName(senateMember.state) }}</li>
	<li class="list-group-item seniority">Seniority: {{ senateMember.seniority }}</li>
	<li class="list-group-item party-votes">Party Votes with: {{ senateMember.votes_with_party_pct }}%</li>
	<li class="list-group-item party-votes">Party Votes against: {{ senateMember.votes_against_party_pct }}%</li>
	</ul>
	</div>
	</div>`
});

let districtListenerSet = false;
// Create card component to display a house member, with his first name displayed first
let houseMemberCardFirstName = Vue.component("houseMemberCardFirstName", {
	props: ["houseMember", "states", "getStateName"],
	mounted: function() {
		this.$nextTick(function() {
			if (!districtListenerSet) {
				districtListenerSet = setSortDistrictListener();
			}
		});
	},
	template: `<div class="col-sm-6 col-lg-3">
	<div class="card" style="width: 16rem;">
	<a v-bind:id="houseMember.id" v-bind:href="houseMember.url"><h5 class="card-header"> {{ houseMember.first_name }} {{ houseMember.middle_name }} {{ houseMember.last_name }}</h5></a>
	<ul class="list-group list-group-flush">
	<li class="list-group-item party bg-danger text-white" v-if="houseMember.party === 'R'">Republican</li>
	<li class="list-group-item party bg-primary text-white" v-else-if="houseMember.party === 'D'">Democrat</li>
	<li class="list-group-item party bg-info text-white" v-else-if="houseMember.party === 'ID' || houseMember.party === 'I'">Independent</li>
	<li class="list-group-item party" v-else>Other</li>
	<li class="list-group-item state">State: {{ getStateName(houseMember.state) }}</li>
	<li class="list-group-item state">District: {{ houseMember.district }}</li>
	<li class="list-group-item seniority">Seniority: {{ houseMember.seniority }}</li>
	<li class="list-group-item party-votes">Party Votes with: {{ houseMember.votes_with_party_pct }}%</li>
	<li class="list-group-item party-votes">Party Votes against: {{ houseMember.votes_against_party_pct }}%</li>
	</ul>
	</div>
	</div>`
});

// Create card component to display a house member, with his last name displayed first
let houseMemberCardLastName = Vue.component("houseMemberCardLastName", {
	props: ["houseMember", "states", "getStateName"],
	template: `<div class="col-sm-6 col-lg-3">
	<div class="card" style="width: 16rem;">
	<a v-bind:id="houseMember.id" v-bind:href="houseMember.url"><h5 class="card-header">{{ houseMember.last_name }}, {{ houseMember.first_name }} {{ houseMember.middle_name }}</h5></a>
	<ul class="list-group list-group-flush">
	<li class="list-group-item party bg-danger text-white" v-if="houseMember.party === 'R'">Republican</li>
	<li class="list-group-item party bg-primary text-white" v-else-if="houseMember.party === 'D'">Democrat</li>
	<li class="list-group-item party bg-info text-white" v-else-if="houseMember.party === 'ID' || houseMember.party === 'I'">Independent</li>
	<li class="list-group-item party" v-else>Other</li>
	<li class="list-group-item state">State: {{ getStateName(houseMember.state) }}</li>
	<li class="list-group-item state">District: {{ houseMember.district }}</li>
	<li class="list-group-item seniority">Seniority: {{ houseMember.seniority }}</li>
	<li class="list-group-item party-votes">Party Votes with: {{ houseMember.votes_with_party_pct }}%</li>
	<li class="list-group-item party-votes">Party Votes against: {{ houseMember.votes_against_party_pct }}%</li>
	</ul>
	</div>
	</div>`
});

let displayTable = Vue.component("displayTable", {
	props: [
		"senateMembers",
		"houseMembers",
		"currentSenateComponent",
		"currentHouseComponent",
		"states",
		"getStateName"
	],
	mounted: function() {
		this.$nextTick(function() {
			setSortTableListeners();
		});
	},
	template: `<div class="pb-4">
	<table class="table">
	<thead>
	<tr>
	<th id="nameHeader" scope="col">Name <i class="fas fa-sort-up"></i></th>
	<th id="partyHeader" scope="col">Party</th>
	<th id="stateHeader" scope="col">State</th>
	<th id="districtHeader" v-if="houseMembers.length > 0" scope="col">District</th>
	<th id="seniorityHeader" scope="col">Seniority</th>
	<th id="votesWithHeader" scope="col">Votes with party</th>
	<th id="votesAgainstHeader" scope="col">Votes against party</th>
	</tr>
	</thead>
	<tbody>
	<tr :is="currentSenateComponent"
	v-for="senateMember in senateMembers"
	v-bind:key="senateMember.id"
	v-bind:senate-member="senateMember"
	v-bind:states="states"
	v-bind:get-state-name="getStateName">
	</tr>
	<tr :is="currentHouseComponent"
	v-for="houseMember in houseMembers"
	v-bind:key="houseMember.id"
	v-bind:house-member="houseMember"
	v-bind:states="states"
	v-bind:get-state-name="getStateName">
	</tr>
	</tbody>
	</table>
	</div>`
});

// Create a table row component to display a senate member, with his first name displayed first
let senateMemberTableRowFirstName = Vue.component(
	"senateMemberTableRowFirstName",
	{
		props: ["senateMember", "states", "getStateName"],
		template: `<tr>
	<td scope="row">{{ senateMember.first_name }} {{ senateMember.middle_name }} 
	{{ senateMember.last_name }}</td>
	<td> {{ senateMember.party }}</td>
	<td> {{ getStateName(senateMember.state) }}</td>
	<td> {{ senateMember.seniority }}</td>
	<td> {{ senateMember.votes_with_party_pct }}</td>
	<td> {{ senateMember.votes_against_party_pct }}</td>
	</tr>`
	}
);

// Create a table row component to display a senate member, with his last name displayed first
let senateMemberTableRowLastName = Vue.component(
	"senateMemberTableRowLastName",
	{
		props: ["senateMember", "states", "getStateName"],
		template: `<tr>
	<td scope="row">{{ senateMember.last_name }}, {{ senateMember.first_name }} 
	{{ senateMember.middle_name }} </td>
	<td> {{ senateMember.party }}</td>
	<td> {{ getStateName(senateMember.state) }}</td>
	<td> {{ senateMember.seniority }}</td>
	<td> {{ senateMember.votes_with_party_pct }}</td>
	<td> {{ senateMember.votes_against_party_pct }}</td>
	</tr>`
	}
);

// Create a table row component to display a house member, with his first name displayed first
let houseMemberTableRowFirstName = Vue.component(
	"houseMemberTableRowFirstName",
	{
		props: ["houseMember", "states", "getStateName"],
		template: `<tr>
	<td scope="row">{{ houseMember.first_name }} {{ houseMember.middle_name }} 
	{{ houseMember.last_name }}</td>
	<td> {{ houseMember.party }}</td>
	<td> {{ getStateName(houseMember.state) }}</td>
	<td> {{ houseMember.district }} </td>
	<td> {{ houseMember.seniority }}</td>
	<td> {{ houseMember.votes_with_party_pct }}</td>
	<td> {{ houseMember.votes_against_party_pct }}</td>
	</tr>`
	}
);

// Create a table row component to display a house member, with his last name displayed first
let houseMemberTableRowLastName = Vue.component("houseMemberTableRowLastName", {
	props: ["houseMember", "states", "getStateName"],
	template: `<tr>
	<td scope="row">{{ houseMember.last_name }}, {{ houseMember.first_name }}
	{{ houseMember.middle_name }} </td>
	<td> {{ houseMember.party }}</td>
	<td> {{ getStateName(houseMember.state) }}</td>
	<td> {{ houseMember.district }} </td>
	<td> {{ houseMember.seniority }}</td>
	<td> {{ houseMember.votes_with_party_pct }}</td>
	<td> {{ houseMember.votes_against_party_pct }}</td>
	</tr>`
});

let stateCheckbox = Vue.component("stateCheckbox", {
	props: ["state"],
	template: `<div class="custom-control custom-checkbox">
	<input type="checkbox" class="custom-control-input" v-bind:id="state.code" name="stateFilters[]" v-bind:value="state.code">
	<label class="custom-control-label no-select" v-bind:for="state.code">{{ state.name }}</label>
	</div>`
});

// create Vue instance
const app = new Vue({
	el: "#app",
	data: {
		houseMembers: [],
		senateMembers: [],
		searchQuery: "",
		currentDisplay: "displayCard",
		currentSenateComponent: "senateMemberCardFirstName",
		currentHouseComponent: "houseMemberCardFirstName",
		states: [
			{ code: "AK", name: "Alaska" },
			{ code: "AL", name: "Alabama" },
			{ code: "AR", name: "Arkansas" },
			{ code: "AZ", name: "Arizona" },
			{ code: "CA", name: "California" },
			{ code: "CO", name: "Colorado" },
			{ code: "CT", name: "Connecticut" },
			{ code: "DC", name: "District of Columbia" },
			{ code: "DE", name: "Delaware" },
			{ code: "FL", name: "Florida" },
			{ code: "GA", name: "Georgia" },
			{ code: "HI", name: "Hawaii" },
			{ code: "IA", name: "Iowa" },
			{ code: "ID", name: "Idaho" },
			{ code: "IL", name: "Illinois" },
			{ code: "IN", name: "Indiana" },
			{ code: "KS", name: "Kansas" },
			{ code: "KY", name: "Kentucky" },
			{ code: "LA", name: "Louisiana" },
			{ code: "ME", name: "Maine" },
			{ code: "MD", name: "Maryland" },
			{ code: "MA", name: "Massachusetts" },
			{ code: "MI", name: "Michigan" },
			{ code: "MN", name: "Minnesota" },
			{ code: "MS", name: "Mississippi" },
			{ code: "MO", name: "Missouri" },
			{ code: "MT", name: "Montana" },
			{ code: "NE", name: "Nebraska" },
			{ code: "NV", name: "Nevada" },
			{ code: "NH", name: "New Hampshire" },
			{ code: "NJ", name: "New Jersey" },
			{ code: "NM", name: "New Mexico" },
			{ code: "NY", name: "New York" },
			{ code: "NC", name: "North Carolina" },
			{ code: "ND", name: "North Dakota" },
			{ code: "OH", name: "Ohio" },
			{ code: "OK", name: "Oklahoma" },
			{ code: "OR", name: "Oregon" },
			{ code: "PA", name: "Pennsylvania" },
			{ code: "RI", name: "Rhode Island" },
			{ code: "SC", name: "South Carolina" },
			{ code: "SD", name: "South Dakota" },
			{ code: "TN", name: "Tennessee" },
			{ code: "TX", name: "Texas" },
			{ code: "UT", name: "Utah" },
			{ code: "VT", name: "Vermont" },
			{ code: "VA", name: "Virginia" },
			{ code: "WA", name: "Washington" },
			{ code: "WV", name: "West Virginia" },
			{ code: "WI", name: "Wisconsin" },
			{ code: "WY", name: "Wyoming" },
			{ code: "AS", name: "American Samoa" },
			{ code: "GU", name: "Guam" },
			{ code: "MP", name: "Northern Mariana Islands" },
			{ code: "PR", name: "Puerto Rico" },
			{ code: "VI", name: "U.S. Virgin Islands" }
		]
	},
	computed: {
		getCongressHeading: function() {
			if (chamber === "senate") {
				return "Congress 116 - Senate";
			} else return "Congress 116 - House";
		},
		getCongressText: function() {
			if (chamber === "senate") {
				return `First convened in 1789, the composition and powers of the Senate are 
				established in Article One of the U.S. Constitution. Each state is represented by two 
				senators, regardless of population, who serve staggered six-year terms. 
				The Senate has several exclusive powers not granted to the House, including consenting
				to treaties as a precondition to their ratification and consenting to or confirming 
				appointments of Cabinet secretaries, federal judges, other federal executive officials,
				military officers, regulatory officials, ambassadors, and other federal uniformed 
				officers, as well as trial of federal officials impeached by the House.`;
			} else {
				return `The major power of the House is to pass federal legislation that affects the entire country, 
				although its bills must also be passed by the Senate and further agreed to by the U.S. 
				President before becoming law (unless both the House and Senate re-pass the legislation with
				a two-thirds majority in each chamber). The House has some exclusive powers: the power to 
				initiate revenue bills, to impeach officials (impeached officials are subsequently tried in the 
				Senate), and to elect the U.S. President in case there is no majority in the Electoral College.
				Each U.S. state is represented in the House in proportion to its population as measured in the 
				census, but every state is entitled to at least one representative.`;
			}
		}
	},
	components: {
		displayCard: displayCard,
		displayTable: displayTable,
		senateMemberCardFirstName: senateMemberCardFirstName,
		senateMemberCardLastName: senateMemberCardLastName,
		houseMemberCardFirstName: houseMemberCardFirstName,
		houseMemberCardLastName: houseMemberCardLastName,
		senateMemberTableRowFirstName: senateMemberTableRowFirstName,
		senateMemberTableRowLastName: senateMemberTableRowLastName,
		stateCheckbox: stateCheckbox
	},
	methods: {
		getStateName(code) {
			return this.states[
				this.states
					.map(state => {
						return state.code;
					})
					.indexOf(code)
			].name;
		},
		swapCongressComponent(component) {
			if (this.senateMembers.length > 0) {
				this.currentSenateComponent = component;
			} else this.currentHouseComponent = component;
		},
		swapDisplay: function(event) {
			const sortDropdown = document.getElementById("sortDropdown");
			if (this.currentDisplay === "displayCard") {
				sortDropdown.style.display = "none";
				this.currentDisplay = "displayTable";
				this.currentSenateComponent = "senateMemberTableRowFirstName";
				this.currentHouseComponent = "houseMemberTableRowFirstName";
				event.innerHTML = '<i class="fas fa-table"></i>';
			} else {
				sortDropdown.style.display = "inline";
				this.currentDisplay = "displayCard";
				this.currentSenateComponent = "senateMemberCardFirstName";
				this.currentHouseComponent = "houseMemberCardFirstName";
				event.innerHTML = '<i class="fas fa-grip-vertical"></i>';
			}
		}
	}
});

// update vue app
function updateVue(members) {
	if (chamber === "senate") {
		app.senateMembers = members;
	} else {
		app.houseMembers = members;
	}
}

// Sorts for card display
const sortedOn = {
	firstName: true,
	lastName: false,
	party: false,
	state: false,
	district: false,
	seniority: false,
	partyVotesWith: false,
	partyVotesAgainst: false,
	setSortedOn: function(
		sortedType,
		sortMenuButton,
		sortButton,
		sortHeader,
		sortString
	) {
		switch (sortedType) {
			case "firstName":
				this.firstName
					? (this.firstName = false)
					: (this.firstName = true);
				break;
			case "lastName":
				this.lastName
					? (this.lastName = false)
					: (this.lastName = true);
				break;
			case "party":
				this.party ? (this.party = false) : (this.party = true);
				break;
			case "state":
				this.state ? (this.state = false) : (this.state = true);
				break;
			case "district":
				this.district
					? (this.district = false)
					: (this.district = true);
				break;
			case "seniority":
				this.seniority
					? (this.seniority = false)
					: (this.seniority = true);
				break;
			case "partyVotesWith":
				this.partyVotesWith
					? (this.partyVotesWith = false)
					: (this.partyVotesWith = true);
				break;
			case "partyVotesAgainst":
				this.partyVotesAgainst
					? (this.partyVotesAgainst = false)
					: (this.partyVotesAgainst = true);
				break;
		}
		if (sortMenuButton && sortButton) {
			sortMenuButton.innerHTML = sortString;
			sortButton.innerHTML = sortString;
		}
		if (sortHeader) sortHeader.innerHTML = sortString;
	}
};

function setSortCardsListeners() {
	const sortMenuButton = document.getElementById("sortMenuButton");
	const sortByFirstName = document.getElementById("sortFirstName");
	const sortByLastName = document.getElementById("sortLastName");
	const sortByParty = document.getElementById("sortParty");
	const sortByState = document.getElementById("sortState");
	const sortBySeniority = document.getElementById("sortSeniority");
	const sortByVotesWith = document.getElementById("sortVotesWith");
	const sortByVotesAgainst = document.getElementById("sortVotesAgainst");

	sortByFirstName.onclick = () => {
		let sortStringAscendingly =
			'<i class="fas fa-sort-alpha-up"></i> Sort on first name';
		let sortStringDescendingly =
			'<i class="fas fa-sort-alpha-down-alt"></i> Sort on first name';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);
		if (chamber === "senate") {
			app.swapCongressComponent("senateMemberCardFirstName");
		} else app.swapCongressComponent("houseMemberCardFirstName");
		if (sortedOn.firstName) {
			sortedOn.setSortedOn(
				"firstName",
				sortMenuButton,
				sortByFirstName,
				undefined,
				sortStringDescendingly
			);
			filteredList.sort(sortByFirstNameDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"firstName",
				sortMenuButton,
				sortByFirstName,
				undefined,
				sortStringAscendingly
			);
			filteredList.sort(sortByFirstNameAscending);
			updateVue(filteredList);
		}
	};

	sortByLastName.onclick = () => {
		let sortStringAscendingly =
			'<i class="fas fa-sort-alpha-up"></i> Sort on last name';
		let sortStringDescendingly =
			'<i class="fas fa-sort-alpha-down-alt"></i> Sort on last name';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);
		if (chamber === "senate") {
			app.swapCongressComponent("senateMemberCardLastName");
		} else app.swapCongressComponent("houseMemberCardLastName");
		if (sortedOn.lastName) {
			sortedOn.setSortedOn(
				"lastName",
				sortMenuButton,
				sortByLastName,
				undefined,
				sortStringDescendingly
			);
			filteredList.sort(sortByLastNameDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"lastName",
				sortMenuButton,
				sortByLastName,
				undefined,
				sortStringAscendingly
			);
			filteredList.sort(sortByLastNameAscending);
			updateVue(filteredList);
		}
	};

	sortByParty.onclick = () => {
		let sortStringAscendingly =
			'<i class="fas fa-sort-alpha-up"></i> Sort on party';
		let sortStringDescendingly =
			'<i class="fas fa-sort-alpha-down-alt"></i> Sort on party';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);

		if (sortedOn.partyAscendingly) {
			sortedOn.setSortedOn(
				"party",
				sortMenuButton,
				sortByParty,
				undefined,
				sortStringDescendingly
			);
			filteredList.sort(sortByPartyDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"party",
				sortMenuButton,
				sortByParty,
				undefined,
				sortStringAscendingly
			);
			console.log("sort party ascendingly");
			filteredList.sort(sortByPartyAscending);
			console.log(filteredList);
			updateVue(filteredList);
		}
	};

	sortByState.onclick = () => {
		let sortStringAscendingly =
			'<i class="fas fa-sort-alpha-up"></i> Sort on state';
		let sortStringDescendingly =
			'<i class="fas fa-sort-alpha-down-alt"></i> Sort on state';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);

		if (sortedOn.stateAscendingly) {
			sortedOn.setSortedOn(
				"state",
				sortMenuButton,
				sortByState,
				undefined,
				sortStringDescendingly
			);
			filteredList.sort(sortByStateDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"state",
				sortMenuButton,
				sortByState,
				undefined,
				sortStringAscendingly
			);
			filteredList.sort(sortByStateAscending);
			updateVue(filteredList);
		}
	};
	sortBySeniority.onclick = () => {
		let sortStringAscendingly =
			'<i class="fas fa-sort-numeric-up"></i> Sort on seniority';
		let sortStringDescendingly =
			'<i class="fas fa-sort-numeric-down-alt"></i> Sort on seniority';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);

		if (sortedOn.seniorityAscendingly) {
			sortedOn.setSortedOn(
				"seniority",
				sortMenuButton,
				sortBySeniority,
				undefined,
				sortStringDescendingly
			);
			filteredList.sort(sortBySeniorityDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"seniority",
				sortMenuButton,
				sortBySeniority,
				undefined,
				sortStringAscendingly
			);
			filteredList.sort(sortBySeniorityAscending);
			updateVue(filteredList);
		}
	};

	sortByVotesWith.onclick = () => {
		let sortStringAscendingly =
			'<i class="fas fa-sort-numeric-up"></i> Sort on votes with party';
		let sortStringDescendingly =
			'<i class="fas fa-sort-numeric-down-alt"></i> Sort on votes with party';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);

		if (sortedOn.partyVotesWithAscendingly) {
			sortedOn.setSortedOn(
				"partyVotesWith",
				sortMenuButton,
				sortByVotesWith,
				undefined,
				sortStringDescendingly
			);
			filteredList.sort(sortByVotesWithDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"partyVotesWith",
				sortMenuButton,
				sortByVotesWith,
				undefined,
				sortStringAscendingly
			);
			filteredList.sort(sortByVotesWithAscending);
			updateVue(filteredList);
		}
	};

	sortByVotesAgainst.onclick = () => {
		let sortStringAscendingly =
			'<i class="fas fa-sort-numeric-up"></i> Sort on votes against party';
		let sortStringDescendingly =
			'<i class="fas fa-sort-numeric-down-alt"></i> Sort on votes against party';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);

		if (sortedOn.partyVotesAgainstAscendingly) {
			sortedOn.setSortedOn(
				"partyVotesAgainst",
				sortMenuButton,
				sortByVotesAgainst,
				undefined,
				sortStringDescendingly
			);
			filteredList.sort(sortByVotesAgainstDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"partyVotesAgainst",
				sortMenuButton,
				sortByVotesAgainst,
				undefined,
				sortStringAscendingly
			);
			filteredList.sort(sortByVotesAgainstAscending);
			updateVue(filteredList);
		}
	};
}

function setSortDistrictListener() {
	const sortByDistrict = document.getElementById("sortDistrict");

	console.log(sortByDistrict);

	if (sortByDistrict) {
		sortByDistrict.onclick = () => {
			let sortStringAscendingly =
				'<i class="fas fa-sort-alpha-up"></i> Sort on district';
			let sortStringDescendingly =
				'<i class="fas fa-sort-alpha-down-alt"></i> Sort on district';
			let filteredList = filter(
				searchByNameInput.value,
				partyFilterList,
				stateFilterList
			);

			if (sortedOn.districtAscendingly) {
				sortedOn.setSortedOn(
					"district",
					sortMenuButton,
					sortByDistrict,
					undefined,
					sortStringDescendingly
				);
				filteredList.sort(sortByDistrictDescending);
				updateVue(filteredList);
			} else {
				sortedOn.setSortedOn(
					"district",
					sortMenuButton,
					sortByDistrict,
					undefined,
					sortStringAscendingly
				);
				filteredList.sort(sortByDistrictAscending);
				updateVue(filteredList);
			}
		};
		return true;
	}
	return false;
}

function setSortTableListeners() {
	// Sorts for table display
	let nameHeader = document.getElementById("nameHeader");
	let partyHeader = document.getElementById("partyHeader");
	let stateHeader = document.getElementById("stateHeader");
	let districtHeader = document.getElementById("districtHeader");
	let seniorityHeader = document.getElementById("seniorityHeader");
	let votesWithHeader = document.getElementById("votesWithHeader");
	let votesAgainstHeader = document.getElementById("votesAgainstHeader");

	let sortHeaderArray = [
		nameHeader,
		partyHeader,
		stateHeader,
		seniorityHeader,
		votesWithHeader,
		votesAgainstHeader
	];

	nameHeader.onclick = () => {
		let sortStringAscendingly = 'Name <i class="fas fa-sort-up">';
		let sortStringDescendingly = 'Name <i class="fas fa-sort-down">';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);
		setHeadersDefaultString(sortHeaderArray);
		if (sortedOn.firstName) {
			sortedOn.setSortedOn(
				"firstName",
				undefined,
				undefined,
				nameHeader,
				sortStringDescendingly
			);
			filteredList.sort(sortByFirstNameDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"firstName",
				undefined,
				undefined,
				nameHeader,
				sortStringAscendingly
			);
			filteredList.sort(sortByFirstNameAscending);
			updateVue(filteredList);
		}
	};

	partyHeader.onclick = () => {
		let sortStringAscendingly = 'Party <i class="fas fa-sort-up">';
		let sortStringDescendingly = 'Party <i class="fas fa-sort-down">';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);
		setHeadersDefaultString(sortHeaderArray);
		if (sortedOn.partyAscendingly) {
			sortedOn.setSortedOn(
				"party",
				undefined,
				undefined,
				partyHeader,
				sortStringDescendingly
			);
			filteredList.sort(sortByPartyDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"party",
				undefined,
				undefined,
				partyHeader,
				sortStringAscendingly
			);
			filteredList.sort(sortByPartyAscending);
			updateVue(filteredList);
		}
	};

	stateHeader.onclick = () => {
		let sortStringAscendingly = 'State <i class="fas fa-sort-up">';
		let sortStringDescendingly = 'State <i class="fas fa-sort-down">';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);
		setHeadersDefaultString(sortHeaderArray);
		if (sortedOn.stateAscendingly) {
			sortedOn.setSortedOn(
				"state",
				undefined,
				undefined,
				stateHeader,
				sortStringDescendingly
			);
			filteredList.sort(sortByStateDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"state",
				undefined,
				undefined,
				stateHeader,
				sortStringAscendingly
			);
			filteredList.sort(sortByStateAscending);
			updateVue(filteredList);
		}
	};

	if (districtHeader) {
		if (sortHeaderArray.indexOf(districtHeader) === -1)
			sortHeaderArray.push(districtHeader);
		districtHeader.onclick = () => {
			let sortStringAscendingly = 'District <i class="fas fa-sort-up">';
			let sortStringDescendingly =
				'District <i class="fas fa-sort-down">';
			let filteredList = filter(
				searchByNameInput.value,
				partyFilterList,
				stateFilterList
			);
			setHeadersDefaultString(sortHeaderArray);
			if (sortedOn.districtAscendingly) {
				sortedOn.setSortedOn(
					"district",
					undefined,
					undefined,
					districtHeader,
					sortStringDescendingly
				);
				filteredList.sort(sortByDistrictDescending);
				updateVue(filteredList);
			} else {
				sortedOn.setSortedOn(
					"district",
					undefined,
					undefined,
					districtHeader,
					sortStringAscendingly
				);
				filteredList.sort(sortByDistrictAscending);
				updateVue(filteredList);
			}
		};
	}

	seniorityHeader.onclick = () => {
		let sortStringAscendingly = 'Seniority <i class="fas fa-sort-up">';
		let sortStringDescendingly = 'Seniority <i class="fas fa-sort-down">';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);
		setHeadersDefaultString(sortHeaderArray);
		if (sortedOn.seniorityAscendingly) {
			sortedOn.setSortedOn(
				"seniority",
				undefined,
				undefined,
				seniorityHeader,
				sortStringDescendingly
			);
			filteredList.sort(sortBySeniorityDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"seniority",
				undefined,
				undefined,
				seniorityHeader,
				sortStringAscendingly
			);
			filteredList.sort(sortBySeniorityAscending);
			updateVue(filteredList);
		}
	};

	votesWithHeader.onclick = () => {
		let sortStringAscendingly =
			'Votes with party <i class="fas fa-sort-up">';
		let sortStringDescendingly =
			'Votes with party <i class="fas fa-sort-down">';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);
		setHeadersDefaultString(sortHeaderArray);
		if (sortedOn.partyVotesWithAscendingly) {
			sortedOn.setSortedOn(
				"partyVotesWith",
				undefined,
				undefined,
				votesWithHeader,
				sortStringDescendingly
			);
			filteredList.sort(sortByVotesWithDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"partyVotesWith",
				undefined,
				undefined,
				votesWithHeader,
				sortStringAscendingly
			);
			filteredList.sort(sortByVotesWithAscending);
			updateVue(filteredList);
		}
	};

	votesAgainstHeader.onclick = () => {
		let sortStringAscendingly =
			'Votes against party <i class="fas fa-sort-up">';
		let sortStringDescendingly =
			'Votes against party <i class="fas fa-sort-down">';
		let filteredList = filter(
			searchByNameInput.value,
			partyFilterList,
			stateFilterList
		);
		setHeadersDefaultString(sortHeaderArray);
		if (sortedOn.partyVotesAgainstAscendingly) {
			sortedOn.setSortedOn(
				"partyVotesAgainst",
				undefined,
				undefined,
				votesAgainstHeader,
				sortStringDescendingly
			);
			filteredList.sort(sortByVotesAgainstDescending);
			updateVue(filteredList);
		} else {
			sortedOn.setSortedOn(
				"partyVotesAgainst",
				undefined,
				undefined,
				votesAgainstHeader,
				sortStringAscendingly
			);
			filteredList.sort(sortByVotesAgainstAscending);
			updateVue(filteredList);
		}
	};
}

function setHeadersDefaultString(sortHeaderArray) {
	const sortDefaultStrings = [
		"Name",
		"Party",
		"State",
		"Seniority",
		"Votes with party",
		"Votes against party"
	];

	sortHeaderArray.forEach(header => {
		sortDefaultStrings.forEach(defaultString => {
			if (
				header.innerHTML.includes(defaultString) &&
				header.innerHTML !== defaultString
			) {
				header.innerHTML = defaultString;
			}
		});
	});
}

function searchCongressMembers(searchQuery, members) {
	let searchedCongressMembers = members.filter(member => {
		let memberName;
		if (member.middle_name) {
			memberName = `${member.first_name} ${member.middle_name} ${member.last_name}`;
		} else {
			memberName = `${member.first_name} ${member.last_name}`;
		}
		// if(memberName.toLowerCase().includes(searchQuery.toLowerCase())) {
		// 	console.log(memberName);
		// 	console.log('Found with ' + searchQuery)
		// }else console.log(searchQuery + ' not found');
		return memberName.toLowerCase().includes(searchQuery.toLowerCase());
	});
	return searchedCongressMembers;
}

function filterCongressMembersByParty(partyFilterList, members) {
	if (partyFilterList.length > 0) {
		let filteredCongressMembers = members.filter(member => {
			for (let i = 0; i < partyFilterList.length; i++) {
				// console.log(`${partyFilterList[i]} === ${member.party} = ${partyFilterList[i] === member.party}`)
				if (
					partyFilterList[i] === member.party ||
					partyFilterList[i] === "I"
				)
					return member;
			}
		});
		// console.log(filteredCongressMembers);
		return filteredCongressMembers;
	} else return members;
}

function filterCongressMembersByState(stateFilterList, members) {
	if (stateFilterList.length > 0) {
		let filteredCongressMembers = members.filter(member => {
			for (let i = 0; i < stateFilterList.length; i++) {
				if (stateFilterList[i] === member.state) return member;
			}
		});
		// console.log(filteredCongressMembers);
		return filteredCongressMembers;
	} else return members;
}

function filter(searchQuery, partyFilterList, stateFilterList) {
	let filteredList;
	if (chamber === "senate") filteredList = senateMembers.slice();
	else filteredList = houseMembers.slice();
	if (searchQuery)
		filteredList = searchCongressMembers(searchQuery, filteredList);
	if (partyFilterList.length > 0)
		filteredList = filterCongressMembersByParty(
			partyFilterList,
			filteredList
		);
	if (stateFilterList.length > 0)
		filteredList = filterCongressMembersByState(
			stateFilterList,
			filteredList
		);
	console.log(filteredList);
	return filteredList;
}

// eventListener for search
let searchByNameInput = document.getElementById("searchByName");
searchByNameInput.oninput = () => {
	updateVue(
		filter(searchByNameInput.value, partyFilterList, stateFilterList)
	);
};

// eventListener for filter by party
let filterByParty = document.forms["filterByParty"].elements["partyFilters[]"];
let filterAllParties = document.getElementById("filterAllParties");
let partyFilterList = [];

filterAllParties.onchange = () => {
	if (filterAllParties.checked) {
		partyFilterList.splice(0); // makes sure the array is always empty before adding all filters
		filterByParty.forEach(partyFilter => {
			partyFilter.checked = true;
			partyFilterList.push(partyFilter.value);
		});
	} else {
		filterByParty.forEach(partyFilter => {
			partyFilter.checked = false;
		});
		partyFilterList.splice(0);
	}

	console.log(partyFilterList);
	updateVue(
		filter(searchByNameInput.value, partyFilterList, stateFilterList)
	);
};

// run filter every time a party checkbox's value changes.
filterByParty.forEach(partyFilter => {
	partyFilter.onchange = () => {
		if (partyFilter.checked) {
			if (partyFilterList.length < filterByParty.length) {
				partyFilterList.push(partyFilter.value);
			}
		} else
			partyFilterList.splice(
				partyFilterList.indexOf(partyFilter.value),
				1
			);
		if (partyFilterList.length === filterByParty.length)
			filterAllParties.checked = true;
		else filterAllParties.checked = false;
		console.log(partyFilterList);
		updateVue(
			filter(searchByNameInput.value, partyFilterList, stateFilterList)
		);
	};
});

let filterByState = document.forms["filterByState"].elements["stateFilters[]"];
let filterAllStates = document.getElementById("filterAllStates");
let stateFilterList = [];

filterAllStates.onchange = () => {
	if (filterAllStates.checked) {
		stateFilterList.splice(0); // makes sure the array is always empty before adding all filters
		filterByState.forEach(stateFilter => {
			stateFilter.checked = true;
			stateFilterList.push(stateFilter.value);
		});
	} else {
		filterByState.forEach(stateFilter => {
			stateFilter.checked = false;
		});
		stateFilterList.splice(0);
	}
	console.log(stateFilterList);
	updateVue(
		filter(searchByNameInput.value, partyFilterList, stateFilterList)
	);
};

filterByState.forEach(stateFilter => {
	stateFilter.onchange = () => {
		if (stateFilter.checked) {
			if (stateFilterList.length < filterByState.length) {
				stateFilterList.push(stateFilter.value);
			}
		} else
			stateFilterList.splice(
				stateFilterList.indexOf(stateFilter.value),
				1
			);
		if (stateFilterList.length === filterByState.length)
			filterAllStates.checked = true;
		else filterAllStates.checked = false;
		// console.log(stateFilterList);
		updateVue(
			filter(searchByNameInput.value, partyFilterList, stateFilterList)
		);
	};
});

const init = async () => {
	const members = await getCongressData(chamber);
	if (chamber === "senate") senateMembers = members;
	else houseMembers = members;
	members.sort(sortByFirstNameAscending);
	updateVue(members);
};

setTimeout(init, 500);
