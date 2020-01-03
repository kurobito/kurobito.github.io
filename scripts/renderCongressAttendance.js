import {getCongressData, chamber} from './getCongressMembers.js';
import {sortByFirstNameAscending, sortByFirstNameDescending, sortByPartyAscending
	, sortByPartyDescending, sortByNumOfRepsAscending, sortByNumOfRepsDescending
	, sortByVotedWithPartyAscending, sortByVotedWithPartyDescending, sortByMissedVotesAscending
	, sortByMissedVotesDescending, sortByMissedVotesPctAscending, sortByMissedVotesPctDescending} 
	from './sortComparators.js';
	import {congressOverview} from './congressOverview.js';


// Senate/House at glance table
// todo not rendering updated properties
const congressOverviewTable = Vue.component('congressOverview', {
	props: ['chamber', 'sortByParty', 'sortByNumOfReps', 'sortByPctVotedWith', 'congress'],
	template: `<div class="row">
	<div class="col-12">
	<div class="pb-4">
	<table class="table">
	<thead>
	<tr class="bg-dark text-white">
	<td class="text-center" colspan="3">
	<h4 class="my-0 text-capitalize"> {{ chamber }} at a glance</h4>
	</td>
	</tr>
	<tr>
	<th id="partyHeader" v-on:click="sortByParty" scope="col">Party</th>
	<th id="numOfRepsHeader" v-on:click="sortByNumOfReps" scope="col"># of representatives</th>
	<th id="pctVotedWithHeader" v-on:click="sortByPctVotedWith" scope="col">% voted with party
	</th>
	</tr>
	</thead>
	<tbody>
	<tr v-for="party in congress">
	<td>{{ party.party }}</td>
	<td>{{ party.representatives }}</td>
	<td>{{ party.pctVotedWith }}%</td>
	</tr>
	</tbody>
	</table>
	</div>
	</div>
	</div>`
})

	const app = new Vue({
		el: '#app',
		data: {
			chamber: chamber,
			houseMembers: [],
			senateMembers: [],
			leastEngagedMembers: [],
			mostEngagedMembers: [],
			sortedOn: {
				party: false,
				numOfReps: false,
				pctVotedWith: false,
				name: false,
				numOfMissedVotes: false,
				pctOfMissedVotes: false,
			}
		},
		computed: {
			getCongressHeading: function(){
				if (chamber === 'senate') {
					return 'Senate - Attendance';
				}else return 'House - Attendance';
			},
			getCongressText: function(){
				return `The Constitution specifies that a majority of members constitutes a quorum to do 
				business in each house. Representatives and senators rarely force the presence of a quorum 
				by demanding quorum calls; thus, in most cases, debates continue even if a majority is not 
				present.
				The Senate uses roll-call votes; a clerk calls out the names of all the senators, each senator 
				stating "aye" or "no" when his or her name is announced. The House reserves roll-call votes 
				for the most formal matters, as a roll-call of all 435 representatives takes quite some time; 
					normally, members vote by electronic device. In the case of a tie, the motion in question fails.
				In the Senate, the Vice President may (if present) cast the tiebreaking vote.`
			},
			getCongressAtGlance: function(){
				if (chamber === 'senate') {
				// increment representatives and vote percentage for every senate member
				this.senateMembers.forEach(member => {
					this.incrementRepAndVoteWith(member.party, member.votes_with_party_pct)
				})
				// calculate the average vote percentage for every party in congress
				this.congress.forEach(party => {
					party.pctVotedWith = (party.pctVotedWith / party.representatives).toFixed(2);
				})
				return this.congress;
			}else{
				this.houseMembers.forEach(member => {
					this.incrementRepAndVoteWith(member.party, member.votes_with_party_pct)
				})
				// calculate the average vote percentage for every party in congress
				this.congress.forEach(party => {
					party.pctVotedWith = (party.pctVotedWith / party.representatives).toFixed(2);
				})
				return this.congress;
			}
		},
		congressTableHeaders: function(){
			const partyHeader = document.getElementById('partyHeader');
			const numOfRepsHeader = document.getElementById('numOfRepsHeader');
			const pctVotedWithHeader = document.getElementById('pctVotedWithHeader');
			return [partyHeader, numOfRepsHeader, pctVotedWithHeader];
		},
		leastEngagedTableHeaders: function(){
			const nameHeader = document.getElementById('leastEngagedNameHeader');
			const numOfMissedVotesHeader = document.getElementById('leastEngagedNumMissedVotesHeader');
			const pctOfMissedVotesHeader = document.getElementById('leastEngagedPctMissedVotesHeader');

			return [nameHeader, numOfMissedVotesHeader, pctOfMissedVotesHeader];
		},
		mostEngagedTableHeaders: function(){
			const nameHeader = document.getElementById('mostEngagedNameHeader');
			const numOfMissedVotesHeader = document.getElementById('mostEngagedNumMissedVotesHeader');
			const pctOfMissedVotesHeader = document.getElementById('mostEngagedPctMissedVotesHeader');

			return [nameHeader, numOfMissedVotesHeader, pctOfMissedVotesHeader];
		}
	},
	methods:{
		incrementRepAndVoteWith: function(party, pctVotedWith){
			let index;
			switch(party){
				case 'R':
				index = this.congress.findIndex(party => party.party === 'Republican');
				break;
				case 'D':
				index = this.congress.findIndex(party => party.party === 'Democrat');
				break;
				case 'I':
				index = this.congress.findIndex(party => party.party === 'Independent');
				break;
				case 'ID':
				index = this.congress.findIndex(party => party.party === 'Independent');
				break;
			}
			this.congress[index].representatives++;
			this.congress[index].pctVotedWith += pctVotedWith;
		},
		setLeastEngagedMembers: function(){
			let leastEngagedMembers = [];
			if (chamber === 'senate'){
				leastEngagedMembers = this.senateMembers.sort(sortByMissedVotesPctDescending).slice();
				leastEngagedMembers.splice(10)
				this.leastEngagedMembers = leastEngagedMembers;
			}else {
				leastEngagedMembers = this.houseMembers.sort(sortByMissedVotesPctDescending).slice();
				leastEngagedMembers.splice(10)
				this.leastEngagedMembers = leastEngagedMembers;
			}
		},
		setMostEngagedMembers: function(){
			let mostEngagedMembers = [];
			if (chamber === 'senate'){
				mostEngagedMembers = this.senateMembers.sort(sortByMissedVotesPctAscending).slice();
				mostEngagedMembers.splice(10)
				this.mostEngagedMembers = mostEngagedMembers;
			}else {
				mostEngagedMembers = this.houseMembers.sort(sortByMissedVotesPctAscending).slice();
				mostEngagedMembers.splice(10)
				this.mostEngagedMembers = mostEngagedMembers;
			}
		},
		sortByParty: function(event){
			const sortStringAscendingly = 'Party <i class="fas fa-sort-up">'
			const sortStringDescendingly = 'Party <i class="fas fa-sort-down">'
			this.setDefaultStringOnCongressTable();
			if (this.sortedOn.party) {
				this.sortedOn.party = false;
				event.target.innerHTML = sortStringDescendingly;
				this.congress.sort(sortByPartyDescending);
			}else{
				this.sortedOn.party = true;
				event.target.innerHTML = sortStringAscendingly;
				this.congress.sort(sortByPartyAscending);
			}
		},
		sortByNumOfReps: function(event){
			const sortStringAscendingly = '# of representatives <i class="fas fa-sort-up">'
			const sortStringDescendingly = '# of representatives <i class="fas fa-sort-down">'

			this.setDefaultStringOnCongressTable();
			if (this.sortedOn.numOfReps) {
				this.sortedOn.numOfReps = false;
				event.target.innerHTML = sortStringDescendingly;
				this.congress.sort(sortByNumOfRepsDescending);
			}else{
				this.sortedOn.numOfReps = true;
				event.target.innerHTML = sortStringAscendingly;
				this.congress.sort(sortByNumOfRepsAscending);
			}
		},
		sortByPctVotedWith: function(event){
			const sortStringAscendingly = '% voted with party <i class="fas fa-sort-up">'
			const sortStringDescendingly = '% voted with party <i class="fas fa-sort-down">'

			this.setDefaultStringOnCongressTable();
			if (this.sortedOn.pctVotedWith) {
				this.sortedOn.pctVotedWith = false;
				event.target.innerHTML = sortStringDescendingly;
				this.congress.sort(sortByVotedWithPartyDescending);
			}else{
				this.sortedOn.pctVotedWith = true;
				event.target.innerHTML = sortStringAscendingly;
				this.congress.sort(sortByVotedWithPartyAscending);
			}
		},
		sortByName: function(event){
			const sortStringAscendingly = 'Name <i class="fas fa-sort-up">'
			const sortStringDescendingly = 'Name <i class="fas fa-sort-down">'
			const leastEngagedHeaderRow = document.getElementById('leastEngagedHeader');
			const mostEngagedHeaderRow = document.getElementById('mostEngagedHeader');
			const isLeastEngagedTable = leastEngagedHeaderRow === event.target.parentElement;

			if (isLeastEngagedTable) this.setDefaultStringOnLeastEngagedTable();
			else this.setDefaultStringOnMostEngagedTable();
			if (this.sortedOn.name) {
				this.sortedOn.name = false;
				event.target.innerHTML = sortStringDescendingly;
				if (isLeastEngagedTable) this.leastEngagedMembers.sort(sortByFirstNameDescending);
				else this.mostEngagedMembers.sort(sortByFirstNameDescending);
			}else{
				this.sortedOn.name = true;
				event.target.innerHTML = sortStringAscendingly;
				if (isLeastEngagedTable) this.leastEngagedMembers.sort(sortByFirstNameAscending);
				else this.mostEngagedMembers.sort(sortByFirstNameAscending);
			}
		},
		sortByNumOfMissedVotes: function(event){
			const sortStringAscendingly = '# of missed votes <i class="fas fa-sort-up">'
			const sortStringDescendingly = '# of missed votes <i class="fas fa-sort-down">'
			const leastEngagedHeaderRow = document.getElementById('leastEngagedHeader');
			const mostEngagedHeaderRow = document.getElementById('mostEngagedHeader');
			const isLeastEngagedTable = leastEngagedHeaderRow === event.target.parentElement;

			if (isLeastEngagedTable) this.setDefaultStringOnLeastEngagedTable();
			else this.setDefaultStringOnMostEngagedTable();
			if (this.sortedOn.numOfMissedVotes) {
				this.sortedOn.numOfMissedVotes = false;
				event.target.innerHTML = sortStringDescendingly;
				if (isLeastEngagedTable) this.leastEngagedMembers.sort(sortByMissedVotesDescending);
				else this.mostEngagedMembers.sort(sortByMissedVotesDescending);
			}else{
				this.sortedOn.numOfMissedVotes = true;
				event.target.innerHTML = sortStringAscendingly;
				if (isLeastEngagedTable) this.leastEngagedMembers.sort(sortByMissedVotesAscending);
				else this.mostEngagedMembers.sort(sortByMissedVotesAscending);
			}
		},
		sortByPctOfMissedVotes: function(event){
			const sortStringAscendingly = '% of missed votes <i class="fas fa-sort-up">'
			const sortStringDescendingly = '% of missed votes <i class="fas fa-sort-down">'
			const leastEngagedHeaderRow = document.getElementById('leastEngagedHeader');
			const mostEngagedHeaderRow = document.getElementById('mostEngagedHeader');
			const isLeastEngagedTable = leastEngagedHeaderRow === event.target.parentElement;

			if (isLeastEngagedTable) this.setDefaultStringOnLeastEngagedTable();
			else this.setDefaultStringOnMostEngagedTable();
			if (this.sortedOn.pctOfMissedVotes) {
				this.sortedOn.pctOfMissedVotes = false;
				event.target.innerHTML = sortStringDescendingly;
				if (isLeastEngagedTable) this.leastEngagedMembers.sort(sortByMissedVotesPctDescending);
				else this.mostEngagedMembers.sort(sortByMissedVotesPctDescending);
			}else{
				this.sortedOn.pctOfMissedVotes = true;
				event.target.innerHTML = sortStringAscendingly;
				if (isLeastEngagedTable) this.leastEngagedMembers.sort(sortByMissedVotesPctAscending);
				else this.mostEngagedMembers.sort(sortByMissedVotesPctAscending);
			}
		},
		setDefaultStringOnCongressTable: function(){
			const defaultStrings = ['Party', '# of representatives', '% voted with party'];
			this.congressTableHeaders.forEach(header => {
				defaultStrings.forEach(defaultString => {
					if (header.innerHTML.includes(defaultString) && header.innerHTML !== defaultString) {
						header.innerHTML = defaultString;
					}
				})
			})
		},
		setDefaultStringOnLeastEngagedTable: function(){
			const defaultStrings = ['Name', '# of missed votes', '% of missed votes'];
			this.leastEngagedTableHeaders.forEach(header => {
				defaultStrings.forEach(defaultString => {
					if (header.innerHTML.includes(defaultString) && header.innerHTML !== defaultString) {
						header.innerHTML = defaultString;
					}
				})
			})
		},
		setDefaultStringOnMostEngagedTable: function(){
			const defaultStrings = ['Name', '# of missed votes', '% of missed votes'];
			this.mostEngagedTableHeaders.forEach(header => {
				defaultStrings.forEach(defaultString => {
					if (header.innerHTML.includes(defaultString) && header.innerHTML !== defaultString) {
						header.innerHTML = defaultString;
					}
				})
			})
		}
	}
})

function updateVue(members){
	if(chamber === "senate"){
		app.senateMembers = members;
		congressOverview.senateMembers = members;
	}else{
		app.houseMembers = members;
		congressOverview.houseMembers = members;
	}
}

const init = async () => {
	const members = await getCongressData(chamber);
	// members.sort(sortByFirstNameAscending);
	updateVue(members);
	app.setLeastEngagedMembers();
	app.setMostEngagedMembers();
	console.log('congressOverview')
	console.log(congressOverview.getCongressAtGlance);
	console.log(app.mostEngagedMembers);
}

setTimeout(init, 500);