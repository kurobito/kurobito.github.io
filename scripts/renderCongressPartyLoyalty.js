import { getCongressData, chamber } from "./getCongressMembers.js";
import { congressOverview } from "./congressOverview.js";
import {
	sortByFirstNameAscending,
	sortByFirstNameDescending,
	sortByNumPartyVotesAscending,
	sortByNumPartyVotesDescending,
	sortByVotesWithAscending,
	sortByVotesWithDescending
} from "./sortComparators.js";

// vue instance for congress info
const congressInfoText = new Vue({
	el: "#congressInfoText",
	data: {
		chamber: chamber
	},
	computed: {
		getCongressHeading: function() {
			if (chamber === "senate") {
				return "Senate - Party Loyalty";
			} else return "House - Party Loyalty";
		},
		getCongressText: function() {
			return `Those who consider themselves to be strong partisans, strong Democrats and strong 
			Republicans respectively, tend to be the most faithful in voting for their party's nominee for 
			office and legislation that backs their party's agenda.`;
		}
	}
});

const congressLoyaltyTables = new Vue({
	el: "#congressLoyaltyTables",
	data: {
		chamber: chamber,
		houseMembers: [],
		senateMembers: [],
		leastLoyalMembers: [],
		mostLoyalMembers: [],
		sortedOn: {
			name: false,
			numOfPartyVotes: false,
			pctOfPartyVotes: false
		}
	},
	computed: {
		leastLoyalTableHeaders: function() {
			const nameHeader = document.getElementById("leastLoyalNameHeader");
			const numOfPartyVotesHeader = document.getElementById(
				"leastLoyalNumPartyVotesHeader"
			);
			const pctOfPartyVotesHeader = document.getElementById(
				"leastLoyalPctPartyVotesHeader"
			);

			return [nameHeader, numOfPartyVotesHeader, pctOfPartyVotesHeader];
		},
		mostLoyalTableHeaders: function() {
			const nameHeader = document.getElementById("mostLoyalNameHeader");
			const numOfPartyVotesHeader = document.getElementById(
				"mostLoyalNumPartyVotesHeader"
			);
			const pctOfPartyVotesHeader = document.getElementById(
				"mostLoyalPctPartyVotesHeader"
			);

			return [nameHeader, numOfPartyVotesHeader, pctOfPartyVotesHeader];
		}
	},
	methods: {
		setLeastLoyalMembers: function() {
			let leastLoyalMembers = [];
			if (chamber === "senate") {
				leastLoyalMembers = this.senateMembers
					.sort(sortByVotesWithAscending)
					.slice();
				leastLoyalMembers.splice(leastLoyalMembers.length * 0.1);
				this.leastLoyalMembers = leastLoyalMembers;
			} else {
				leastLoyalMembers = this.houseMembers
					.sort(sortByVotesWithAscending)
					.slice();
				leastLoyalMembers.splice(leastLoyalMembers.length * 0.1);
				this.leastLoyalMembers = leastLoyalMembers;
			}
		},
		setMostLoyalMembers: function() {
			let mostLoyalMembers = [];
			if (chamber === "senate") {
				mostLoyalMembers = this.senateMembers
					.sort(sortByVotesWithDescending)
					.slice();
				mostLoyalMembers.splice(mostLoyalMembers.length * 0.1);
				this.mostLoyalMembers = mostLoyalMembers;
			} else {
				mostLoyalMembers = this.houseMembers
					.sort(sortByVotesWithDescending)
					.slice();
				mostLoyalMembers.splice(mostLoyalMembers.length * 0.1);
				this.mostLoyalMembers = mostLoyalMembers;
			}
		},
		sortByName: function(event) {
			const sortStringAscendingly =
				'Name <i class="fas fa-sort-up no-pointer-event">';
			const sortStringDescendingly =
				'Name <i class="fas fa-sort-down no-pointer-event">';
			const leastLoyalHeaderRow = document.getElementById(
				"leastLoyalHeader"
			);
			const mostLoyalHeaderRow = document.getElementById(
				"mostLoyalHeader"
			);
			const isLeastLoyalTable =
				leastLoyalHeaderRow === event.target.parentElement;

			if (isLeastLoyalTable) this.setDefaultStringOnLeastLoyalTable();
			else this.setDefaultStringOnMostLoyalTable();
			if (this.sortedOn.name) {
				this.sortedOn.name = false;
				event.target.innerHTML = sortStringDescendingly;
				if (isLeastLoyalTable)
					this.leastLoyalMembers.sort(sortByFirstNameDescending);
				else this.mostLoyalMembers.sort(sortByFirstNameDescending);
			} else {
				this.sortedOn.name = true;
				event.target.innerHTML = sortStringAscendingly;
				if (isLeastLoyalTable)
					this.leastLoyalMembers.sort(sortByFirstNameAscending);
				else this.mostLoyalMembers.sort(sortByFirstNameAscending);
			}
		},
		sortByNumOfPartyVotes: function(event) {
			const sortStringAscendingly =
				'# of party votes <i class="fas fa-sort-up no-pointer-event">';
			const sortStringDescendingly =
				'# of party votes <i class="fas fa-sort-down no-pointer-event">';
			const leastLoyalHeaderRow = document.getElementById(
				"leastLoyalHeader"
			);
			const isLeastLoyalTable =
				leastLoyalHeaderRow === event.target.parentElement;
			if (isLeastLoyalTable) this.setDefaultStringOnLeastLoyalTable();
			else this.setDefaultStringOnMostLoyalTable();
			if (this.sortedOn.numOfPartyVotes) {
				this.sortedOn.numOfPartyVotes = false;
				event.target.innerHTML = sortStringDescendingly;
				if (isLeastLoyalTable)
					this.leastLoyalMembers.sort(sortByNumPartyVotesDescending);
				else this.mostLoyalMembers.sort(sortByNumPartyVotesDescending);
			} else {
				this.sortedOn.numOfPartyVotes = true;
				event.target.innerHTML = sortStringAscendingly;
				if (isLeastLoyalTable)
					this.leastLoyalMembers.sort(sortByNumPartyVotesAscending);
				else this.mostLoyalMembers.sort(sortByNumPartyVotesAscending);
			}
		},
		sortByPctOfPartyVotes: function(event) {
			const sortStringAscendingly =
				'% of party votes <i class="fas fa-sort-up no-pointer-event">';
			const sortStringDescendingly =
				'% of party votes <i class="fas fa-sort-down no-pointer-event">';
			const leastLoyalHeaderRow = document.getElementById(
				"leastLoyalHeader"
			);
			const isLeastLoyalTable =
				leastLoyalHeaderRow === event.target.parentElement;

			if (isLeastLoyalTable) this.setDefaultStringOnLeastLoyalTable();
			else this.setDefaultStringOnMostLoyalTable();
			if (this.sortedOn.pctOfPartyVotes) {
				this.sortedOn.pctOfPartyVotes = false;
				event.target.innerHTML = sortStringDescendingly;
				if (isLeastLoyalTable)
					this.leastLoyalMembers.sort(sortByVotesWithDescending);
				else this.mostLoyalMembers.sort(sortByVotesWithDescending);
			} else {
				this.sortedOn.pctOfPartyVotes = true;
				event.target.innerHTML = sortStringAscendingly;
				if (isLeastLoyalTable)
					this.leastLoyalMembers.sort(sortByVotesWithAscending);
				else this.mostLoyalMembers.sort(sortByVotesWithAscending);
			}
		},
		setDefaultStringOnLeastLoyalTable: function(isLeastLoyalTable) {
			const defaultStrings = [
				"Name",
				"# of party votes",
				"% of party votes"
			];
			this.leastLoyalTableHeaders.forEach(header => {
				defaultStrings.forEach(defaultString => {
					if (
						header.innerHTML.includes(defaultString) &&
						header.innerHTML !== defaultString
					) {
						header.innerHTML = defaultString;
					}
				});
			});
		},
		setDefaultStringOnMostLoyalTable: function() {
			const defaultStrings = [
				"Name",
				"# of party votes",
				"% of party votes"
			];
			this.mostLoyalTableHeaders.forEach(header => {
				defaultStrings.forEach(defaultString => {
					if (
						header.innerHTML.includes(defaultString) &&
						header.innerHTML !== defaultString
					) {
						header.innerHTML = defaultString;
					}
				});
			});
		}
	}
});

function updateVue(members) {
	if (chamber === "senate") {
		congressLoyaltyTables.senateMembers = members;
		congressOverview.senateMembers = members;
	} else {
		congressLoyaltyTables.houseMembers = members;
		congressOverview.houseMembersMembers = members;
	}
}

function setNumOfPartyVotesOnMembers(members) {
	members.forEach(member => {
		let numOfPartyVotes = Math.round(
			member.total_votes * (member.votes_with_party_pct / 100)
		);
		member.num_party_votes = numOfPartyVotes;
	});
}

const init = async () => {
	const members = await getCongressData(chamber);
	setNumOfPartyVotesOnMembers(members);
	updateVue(members);
	console.log(congressOverview.getCongressAtGlance);
	congressLoyaltyTables.setLeastLoyalMembers();
	congressLoyaltyTables.setMostLoyalMembers();
	console.log(congressLoyaltyTables.mostLoyalMembers);
	console.log(congressLoyaltyTables.leastLoyalMembers);
};

setTimeout(init, 500);
