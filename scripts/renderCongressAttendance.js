import { getCongressData, chamber } from "./getCongressMembers.js";
import { congressOverview } from "./congressOverview.js";
import {
	sortByFirstNameAscending,
	sortByFirstNameDescending,
	sortByMissedVotesAscending,
	sortByMissedVotesDescending,
	sortByMissedVotesPctAscending,
	sortByMissedVotesPctDescending
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
				return "Senate - Attendance";
			} else return "House - Attendance";
		},
		getCongressText: function() {
			return `The Constitution specifies that a majority of members constitutes a quorum to do 
			business in each house. Representatives and senators rarely force the presence of a quorum 
			by demanding quorum calls; thus, in most cases, debates continue even if a majority is not 
			present.
			The Senate uses roll-call votes; a clerk calls out the names of all the senators, each senator 
			stating "aye" or "no" when his or her name is announced. The House reserves roll-call votes 
			for the most formal matters, as a roll-call of all 435 representatives takes quite some time; 
				normally, members vote by electronic device. In the case of a tie, the motion in question fails.
			In the Senate, the Vice President may (if present) cast the tiebreaking vote.`;
		}
	}
});

// vue instance fo
const congressEngagedTables = new Vue({
	el: "#congressEngagedTables",
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
			pctOfMissedVotes: false
		}
	},
	computed: {
		leastEngagedTableHeaders: function() {
			const nameHeader = document.getElementById(
				"leastEngagedNameHeader"
			);
			const numOfMissedVotesHeader = document.getElementById(
				"leastEngagedNumMissedVotesHeader"
			);
			const pctOfMissedVotesHeader = document.getElementById(
				"leastEngagedPctMissedVotesHeader"
			);
			return [nameHeader, numOfMissedVotesHeader, pctOfMissedVotesHeader];
		},
		mostEngagedTableHeaders: function() {
			const nameHeader = document.getElementById("mostEngagedNameHeader");
			const numOfMissedVotesHeader = document.getElementById(
				"mostEngagedNumMissedVotesHeader"
			);
			const pctOfMissedVotesHeader = document.getElementById(
				"mostEngagedPctMissedVotesHeader"
			);
			return [nameHeader, numOfMissedVotesHeader, pctOfMissedVotesHeader];
		}
	},
	methods: {
		setLeastEngagedMembers: function() {
			let leastEngagedMembers = [];
			if (chamber === "senate") {
				leastEngagedMembers = this.senateMembers
					.sort(sortByMissedVotesPctDescending)
					.slice();
				leastEngagedMembers.splice(leastEngagedMembers.length * 0.1);
				this.leastEngagedMembers = leastEngagedMembers;
			} else {
				leastEngagedMembers = this.houseMembers
					.sort(sortByMissedVotesPctDescending)
					.slice();
				leastEngagedMembers.splice(leastEngagedMembers.length * 0.1);
				this.leastEngagedMembers = leastEngagedMembers;
			}
		},
		setMostEngagedMembers: function() {
			let mostEngagedMembers = [];
			if (chamber === "senate") {
				mostEngagedMembers = this.senateMembers
					.sort(sortByMissedVotesPctAscending)
					.slice();
				mostEngagedMembers.splice(mostEngagedMembers.length * 0.1);
				this.mostEngagedMembers = mostEngagedMembers;
			} else {
				mostEngagedMembers = this.houseMembers
					.sort(sortByMissedVotesPctAscending)
					.slice();
				mostEngagedMembers.splice(mostEngagedMembers.length * 0.1);
				this.mostEngagedMembers = mostEngagedMembers;
			}
		},
		sortByName: function(event) {
			const sortStringAscendingly =
				'Name <i class="fas fa-sort-up no-pointer-event">';
			const sortStringDescendingly =
				'Name <i class="fas fa-sort-down no-pointer-event">';
			const leastEngagedHeaderRow = document.getElementById(
				"leastEngagedHeader"
			);
			const mostEngagedHeaderRow = document.getElementById(
				"mostEngagedHeader"
			);
			const isLeastEngagedTable =
				leastEngagedHeaderRow === event.target.parentElement;

			if (isLeastEngagedTable) this.setDefaultStringOnLeastEngagedTable();
			else this.setDefaultStringOnMostEngagedTable();
			if (this.sortedOn.name) {
				this.sortedOn.name = false;
				event.target.innerHTML = sortStringDescendingly;
				if (isLeastEngagedTable)
					this.leastEngagedMembers.sort(sortByFirstNameDescending);
				else this.mostEngagedMembers.sort(sortByFirstNameDescending);
			} else {
				this.sortedOn.name = true;
				event.target.innerHTML = sortStringAscendingly;
				if (isLeastEngagedTable)
					this.leastEngagedMembers.sort(sortByFirstNameAscending);
				else this.mostEngagedMembers.sort(sortByFirstNameAscending);
			}
		},
		sortByNumOfMissedVotes: function(event) {
			const sortStringAscendingly =
				'# of missed votes <i class="fas fa-sort-up no-pointer-event">';
			const sortStringDescendingly =
				'# of missed votes <i class="fas fa-sort-down no-pointer-event">';
			const leastEngagedHeaderRow = document.getElementById(
				"leastEngagedHeader"
			);
			const mostEngagedHeaderRow = document.getElementById(
				"mostEngagedHeader"
			);
			const isLeastEngagedTable =
				leastEngagedHeaderRow === event.target.parentElement;

			if (isLeastEngagedTable) this.setDefaultStringOnLeastEngagedTable();
			else this.setDefaultStringOnMostEngagedTable();
			if (this.sortedOn.numOfMissedVotes) {
				this.sortedOn.numOfMissedVotes = false;
				event.target.innerHTML = sortStringDescendingly;
				if (isLeastEngagedTable)
					this.leastEngagedMembers.sort(sortByMissedVotesDescending);
				else this.mostEngagedMembers.sort(sortByMissedVotesDescending);
			} else {
				this.sortedOn.numOfMissedVotes = true;
				event.target.innerHTML = sortStringAscendingly;
				if (isLeastEngagedTable)
					this.leastEngagedMembers.sort(sortByMissedVotesAscending);
				else this.mostEngagedMembers.sort(sortByMissedVotesAscending);
			}
		},
		sortByPctOfMissedVotes: function(event) {
			const sortStringAscendingly =
				'% of missed votes <i class="fas fa-sort-up no-pointer-event">';
			const sortStringDescendingly =
				'% of missed votes <i class="fas fa-sort-down no-pointer-event">';
			const leastEngagedHeaderRow = document.getElementById(
				"leastEngagedHeader"
			);
			const mostEngagedHeaderRow = document.getElementById(
				"mostEngagedHeader"
			);
			const isLeastEngagedTable =
				leastEngagedHeaderRow === event.target.parentElement;

			if (isLeastEngagedTable) this.setDefaultStringOnLeastEngagedTable();
			else this.setDefaultStringOnMostEngagedTable();
			if (this.sortedOn.pctOfMissedVotes) {
				this.sortedOn.pctOfMissedVotes = false;
				event.target.innerHTML = sortStringDescendingly;
				if (isLeastEngagedTable)
					this.leastEngagedMembers.sort(
						sortByMissedVotesPctDescending
					);
				else
					this.mostEngagedMembers.sort(
						sortByMissedVotesPctDescending
					);
			} else {
				this.sortedOn.pctOfMissedVotes = true;
				event.target.innerHTML = sortStringAscendingly;
				if (isLeastEngagedTable)
					this.leastEngagedMembers.sort(
						sortByMissedVotesPctAscending
					);
				else
					this.mostEngagedMembers.sort(sortByMissedVotesPctAscending);
			}
		},
		setDefaultStringOnLeastEngagedTable: function() {
			const defaultStrings = [
				"Name",
				"# of missed votes",
				"% of missed votes"
			];
			this.leastEngagedTableHeaders.forEach(header => {
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
		setDefaultStringOnMostEngagedTable: function() {
			const defaultStrings = [
				"Name",
				"# of missed votes",
				"% of missed votes"
			];
			this.mostEngagedTableHeaders.forEach(header => {
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
		congressEngagedTables.senateMembers = members;
		congressOverview.senateMembers = members;
	} else {
		congressEngagedTables.houseMembers = members;
		congressOverview.houseMembers = members;
	}
}

const init = async () => {
	const members = await getCongressData(chamber);
	updateVue(members);
	congressEngagedTables.setLeastEngagedMembers();
	congressEngagedTables.setMostEngagedMembers();
	console.log("congressOverview");
	console.log(congressOverview.getCongressAtGlance);
	console.log(congressEngagedTables.mostEngagedMembers);
};

setTimeout(init, 500);
