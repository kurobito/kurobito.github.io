import {getCongressData, chamber} from './getCongressMembers.js';
import {sortByPartyAscending, sortByPartyDescending, sortByNumOfRepsAscending, 
	sortByNumOfRepsDescending, sortByVotedWithPartyAscending, sortByVotedWithPartyDescending} 
	from './sortComparators.js';


// Senate/House at glance table
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


const congressOverview = new Vue({
	el: '#congressOverview',
	data: {
		chamber: chamber,
		houseMembers: [],
		senateMembers: [],
		congress: [{
			party: 'Republican',
			representatives: 0,
			pctVotedWith: 0
		},
		{
			party: 'Democrat',
			representatives: 0,
			pctVotedWith: 0
		},
		{
			party: 'Independent',
			representatives: 0,
			pctVotedWith: 0
		}],
		sortedOn: {
			party: false,
			numOfReps: false,
			pctVotedWith: false
		}
	},
	computed: {
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
	},
	components: {
		congressOverviewTable: congressOverviewTable
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
	}
})

export {congressOverview};
// initialize vue data
// const init = async () => {
// 	const members = await getCongressData(chamber);
// 	// members.sort(sortByFirstNameAscending);
// 	updateVue(members);
// }

// setTimeout(init, 500);