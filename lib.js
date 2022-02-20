const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require(process.env.SERVICEACCOUNTKEY); // location of the apiKey from service account
const doc = new GoogleSpreadsheet(process.env.SHEETID); // Initialize the sheet

async function commandValidation(clan) {
	await doc.useServiceAccountAuth(creds); // Initialize Auth
	await doc.loadInfo();  // loads document properties and worksheets
	const sheet = doc.sheetsByTitle["Sheet2"];
	let rows = await sheet.getRows();

	let targetRow = null;
	let response  = {
		message: "Oops! Clan not found :(",
		success: false,
	}

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		if (row.Clan == clan) {
			targetRow = row;
			break;
		}
	}
	if(targetRow) {
		if(targetRow['Enabled/Disabled'] === "TRUE") {
			response.message = "Please check your DM to verify your id";
			response.success = true;
			return response;
		} else {
			response.message = "Sorry, admissions have been closed";
			return response;
		}
	}
	return response;
}

module.exports = {
	commandValidation
};
