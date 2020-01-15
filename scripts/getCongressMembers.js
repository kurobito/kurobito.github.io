// ProPublica Congress API Info
const apiKey = "cHWA0cyVrIeIZHFmZyrlp3UBNFO1aqLn7LsYLij2";
let houseMembers;
let senateMembers;
const chamber = window.location.href.split("?")[1];

const congress = new Vue({
	el: "#congress",
	data: {
		chamber: chamber,
		number: 115,
		senateMin: 80,
		senateMax: 116,
		houseMin: 102,
		houseMax: 116
	},
	methods: {
		incrementCongress() {
			if (chamber === "senate") {
				if (this.number < this.senateMax) this.number++;
			} else {
				if (this.number < this.houseMax) this.number++;
			}
		},
		decrementCongress() {
			if (chamber === "senate") {
				if (this.number > this.senateMin) this.number--;
			} else {
				if (this.number > this.houseMin) this.number--;
			}
		}
	}
});

function getCongressUrl(chamber, congressNumber) {
	let url = "https://api.propublica.org/congress/v1/{congress}/{chamber}/members.json";
	url = url.replace("{chamber}", chamber);
	url = url.replace("{congress}", congressNumber);
	return url;
}

// fetch request
export const getCongressData = async chamber => {
	const url = getCongressUrl(chamber, congress.number);
	const congressHeaders = new Headers();
	congressHeaders.append("X-API-KEY", apiKey);
	const request = new Request(url, {
		method: "GET",
		headers: congressHeaders
	});
	try {
		const response = await fetch(request);
		if (response.ok) {
			const jsonResponse = await response.json();
			console.log(jsonResponse);
			if (chamber === "senate") {
				if (congress.number == 116)
					senateMembers = jsonResponse.results[0].members.filter(
						member => member.in_office
					);
				else senateMembers = jsonResponse.results[0].members;
				return senateMembers;
			} else {
				if (congress.number == 116)
					houseMembers = jsonResponse.results[0].members.filter(
						member => member.in_office
					);
				else houseMembers = jsonResponse.results[0].members;
				return houseMembers;
			}
		} else throw new Error(`${response.status} : ${response.statusText}`);
	} catch (e) {
		console.log(e);
	}
};

export { chamber, congress };
