const congressListItem = document.getElementById("congressListItem");
const congressSenate = document.getElementById("congressSenate");
const congressHouse = document.getElementById("congressHouse");
const attendanceListItem = document.getElementById("attendanceListItem");
const attendanceSenate = document.getElementById("attendanceSenate");
const aatendanceHouse = document.getElementById("attendanceHouse");
const partyLoyaltyListItem = document.getElementById("partyLoyaltyListItem");
const partyLoyaltySenate = document.getElementById("partyLoyaltySenate");
const partyLoyaltyHouse = document.getElementById("partyLoyaltyHouse");

// let url = 'https://api.propublica.org/congress/v1/116/{chamber}/members.json';

const setNavBarLogic = url => {
	console.log(window.location.href.split("?"));
	const chamber = window.location.href.split("?")[1].split("+")[0];
	switch (chamber) {
		case "senate":
			url = url.replace("{chamber}", "senate");
			return url;
		case "house":
			url = url.replace("{chamber}", "house");
			return url;
	}
};
export { setNavBarLogic };
