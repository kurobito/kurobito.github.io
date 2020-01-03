import {setNavBarLogic} from './navbar.js'

// ProPublica Congress API Info
const apiKey = 'cHWA0cyVrIeIZHFmZyrlp3UBNFO1aqLn7LsYLij2';
let url = 'https://api.propublica.org/congress/v1/116/{chamber}/members.json';
// const url = 'https://api.propublica.org/congress/v1/116/senate/members.json';
const congressHeaders = new Headers();
congressHeaders.append('X-API-KEY', apiKey);
let houseMembers;
let senateMembers;
url = setNavBarLogic(url);
const chamber = window.location.href.split('?')[1];

// fetch request
export const getCongressData = async (chamber) =>{
	const request = new Request(url, {method: 'GET', headers: congressHeaders});
	try{
		const response = await fetch(request);
		if(response.ok){
			const jsonResponse = await response.json();
			console.log(jsonResponse);
			if(chamber === 'senate'){
				senateMembers = jsonResponse.results[0].members;
				senateMembers.forEach(member => {
					if (!member.in_office) {
						senateMembers.splice(senateMembers.indexOf(member), 1);
					}
				})
				return senateMembers;
			}else {
				houseMembers = jsonResponse.results[0].members;
				houseMembers.forEach(member => {
					if (!member.in_office) {
						houseMembers.splice(houseMembers.indexOf(member), 1);
					}
				})
				console.log(houseMembers)

				return houseMembers;
			}
		}else throw new Error(`${response.status} : ${response.statusText}`)
	}catch(e){console.log(e)}
}

export {chamber}