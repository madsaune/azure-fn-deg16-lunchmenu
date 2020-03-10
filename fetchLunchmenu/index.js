const axios = require("axios");
const cheerio = require("cheerio");
const dateFormat = require("dateformat");

module.exports = async function (context, myTimer) {
    
    const websiteUrl = "https://braatheneiendom.no/eiendommer-5190/dronning-eufemias-gate-16/praktisk-informasjon";
    const today = new Date().getDay();
    const weekdays = [ "SØNDAG", "MANDAG", "TIRSDAG", "ONSDAG", "TORSDAG", "FREDAG", "LØRDAG" ];
    let getResp, postResp, title, menu, text;

    try {
        getResp = await axios.get(websiteUrl);
    } catch (err) {
        context.log.error("ERROR", err);
        throw err;
    }

    const $ = cheerio.load(getResp.data);
    
    menu = $('.blocktext .abstract').text().trim().split('\n');
    menu.splice(0, menu.indexOf(weekdays[today])); // Chop off everything before today's entries
    
    // If its friday (and since its no saturday)
    // we need to chop off the rest of the menu based on another criteria
    if (today < 5) {
        menu.splice(menu.indexOf(weekdays[today+1]));
    }
    
    title = menu.splice(0, 1)[0].trim() + " ";
    title += dateFormat(new Date(), 'dd mmm yyyy').toUpperCase();
    
    text = title + "\n\n";
    text += "---\n\n";
    text += menu.join("\n\n");

    try {
        postResp = await axios.post(process.env.TEAMS_URL, { text });
    } catch (err) {
        context.log.error("ERROR", err);
        throw err;
    }

    if (postResp.status !== 200) {
        context.log.error("ERROR", postResp.statusText);
    }

};