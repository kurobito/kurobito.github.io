// sort comparators
export function sortByFirstNameAscending(a, b) {
	if (a.first_name < b.first_name) return -1;
	if (a.first_name > b.first_name) return 1;
	return 0;
}

export function sortByLastNameAscending(a, b) {
	if (a.last_name < b.last_name) return -1;
	if (a.last_name > b.last_name) return 1;
	return 0;
}

export function sortByPartyAscending(a, b) {
	if (a.party < b.party) return -1;
	if (a.party > b.party) return 1;
	return 0;
}

export function sortByStateAscending(a, b) {
	if (a.state < b.state) return -1;
	if (a.state > b.state) return 1;
	return 0;
}

export function sortByDistrictAscending(a, b) {
	let districtA = parseInt(a.district, 10) || 0;
	let districtB = parseInt(b.district, 10) || 0;
	return districtA - districtB;
}

export function sortBySeniorityAscending(a, b) {
	let seniorityA = parseInt(a.seniority, 10);
	let seniorityB = parseInt(b.seniority, 10);
	return seniorityA - seniorityB;
}

export function sortByVotesWithAscending(a, b) {
	if (a.votes_with_party_pct < b.votes_with_party_pct) return -1;
	if (a.votes_with_party_pct > b.votes_with_party_pct) return 1;
	return 0;
}

export function sortByVotesAgainstAscending(a, b) {
	if (a.votes_against_party_pct < b.votes_against_party_pct) return -1;
	if (a.votes_against_party_pct > b.votes_against_party_pct) return 1;
	return 0;
}

export function sortByNumOfRepsAscending(a, b) {
	if (a.representatives < b.representatives) return -1;
	if (a.representatives > b.representatives) return 1;
	return 0;
}

export function sortByMissedVotesAscending(a, b) {
	if (a.missed_votes < b.missed_votes) return -1;
	if (a.missed_votes > b.missed_votes) return 1;
	return 0;
}

export function sortByMissedVotesPctAscending(a, b) {
	if (a.missed_votes_pct < b.missed_votes_pct) return -1;
	if (a.missed_votes_pct > b.missed_votes_pct) return 1;
	return 0;
}

export function sortByNumPartyVotesAscending(a, b) {
	if (a.num_party_votes < b.num_party_votes) return -1;
	if (a.num_party_votes > b.num_party_votes) return 1;
	return 0;
}

// Sorts for congress object array
export function sortByPctVotedWithAscending(a, b) {
	if (a.pctVotedWith < b.pctVotedWith) return -1;
	if (a.pctVotedWith > b.pctVotedWith) return 1;
	return 0;
}

