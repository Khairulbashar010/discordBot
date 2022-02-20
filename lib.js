const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require(process.env.SERVICEACCOUNTKEY); // location of the apiKey from service account


async function commandValidation(clan) {
	const doc = new GoogleSpreadsheet(process.env.SHEETID); // Initialize Sheet
	await doc.useServiceAccountAuth(creds); // Initialize Auth
	await doc.loadInfo();
	const initialSheet = doc.sheetsByIndex[1]; // searches the second sheet for commands
	let rows = await initialSheet.getRows();

	let targetRow = null;
	// default response
	let response  = {
		message: "Clan not found :(",
		success: false,
		commandData: null
	}

	for (let i = 0; i < rows.length; i++) { // iterate over rows
		const row = rows[i];
		if (row.Clan == clan) { // clan name exists
			targetRow = row;
			break;
		}
	}
	if(targetRow) {
		if(targetRow['Enabled/Disabled'] == "TRUE") {
			// if clan exists and commad is active, update response
			response.message = "Please check your DM to verify your id";
			response.success = true;
			response.commandData = targetRow;
		} else {
			// if clan exists and commad is inactive
			response.message = "Sorry, admissions have been closed";
		}
	}
	return response;
}


async function userValidation(userObj){
	const memberDoc = new GoogleSpreadsheet(process.env.SHEETID);
	await memberDoc.useServiceAccountAuth(creds); // Initialize Auth
	await memberDoc.loadInfo();
	const memberSheet = memberDoc.sheetsById[0];	// searches the first sheet for members
	var memberRows = await memberSheet.getRows();
	// default response
	let response  = {
		message: "Sorry this email is not registered with us! Please enter a valid email which you registered! Type the command again in bot channel to start verification process again.",
		success: false,
	}
	for (let i = 0; i < memberRows.length; i++) {
		const row = memberRows[i];
		if (row.Email === userObj.Email) {		// iterate over rows
			if(row.ChannelId == userObj.commandData.ChannelId && userObj.commandData.ChannelId) {	// if data already exists
				response.message = "Already in the clan.";
				break;
			}
			// asign new data
			memberRows[i].ChannelId = userObj.commandData.ChannelId;
			memberRows[i].RoleId = userObj.commandData.RoleId;
			await memberRows[i].save();
			response.message = "Successfully verified.";
			response.success = true;
			break;
		}
	}
	return response;
}


module.exports = {
	commandValidation,
	userValidation
};
