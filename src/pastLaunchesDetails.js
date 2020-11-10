const pastLaunchesDetailsContainer = document.querySelector(".pastLaunchesDetails__container");

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const flight_number = params.get("flight_number");
const url = "https://api.spacexdata.com/v3/launches/" + flight_number;

async function getDetails() {
  try {
    const response = await fetch(url);
    const details = await response.json();

    createDetailsHtml(details);
  }
  catch(error) {
    pastLaunchesDetailsContainer.innerHTML = displayError("An error occured when calling API");
  }
}
getDetails()


function createDetailsHtml(details) {
    const launchDateUTC = new Date(details.launch_date_utc);
    const missionName = details.mission_name;
    const detailsImage = details.links.flickr_images;
    const launchSite = details.launch_site.site_name_long;
    const flightNumber = details.flight_number;
    const detailsText = details.details;
    const rocketName = details.rocket.rocket_name;
    const rocketType = details.rocket.rocket_type;
    const payloadType = details.rocket.second_stage.payloads[0].payload_type;
    const payloadMass = details.rocket.second_stage.payloads[0].payload_mass_kg;
    const nationality = details.rocket.second_stage.payloads[0].nationality;
    const videoLink = details.links.video_link;

    const launchSuccess = details.launch_success;
    function successFactor() {
      return launchSuccess ? `<span class="pastLaunchesDetails__successMessage">SUCCESSFUL</span>` : `<span class="pastLaunchesDetails__failedMessage">FAILED</span>`;
    }

    if (!detailsImage) {
      return `<p>No image</p>`
    }

    function detailsDescription() {
      return detailsText ? detailsText : "No details available.";
    }
    
    pastLaunchesDetailsContainer.innerHTML = `<div class="pastLaunchesDetails__results">
      <h1>${missionName}</h1>
      <div class="pastLaunchesDetails__contentContainer">
        <img src="${detailsImage}" alt="${missionName}">
        <p class="pastLaunchesDetails__imageText">Photo: SpaceX</p>
        <div class="pastLaunchesDetails__TextContentContainer">
          <p class="pastLaunchesDetails__detailsDescription">${detailsDescription()}</p>
          <p><b>Mission:</b> ${successFactor()}</p>
          <p><b>Date Launched:</b> ${americanDateFormat(launchDateUTC)}</p>
          <p><b>Flight Number:</b> ${flightNumber}</p>
          <h2 class="pastLaunchesDetails__subHeader">Mission details:</h2>
          <li><b>Launch Site:</b> ${launchSite}</li>
          <li><b>Rocket:</b> ${rocketName}</li>
          <li><b>Rocket Type:</b> ${rocketType}</li>
          <li><b>Payload Type:</b> ${payloadType}</li>
          <li><b>Payload Mass:</b> ${payloadMass} kg</li>
          <li><b>Nationality:</b> ${nationality} </li>
          <div class="pastLaunchesDetails__links">
            <a target="_blank" href="${videoLink}">WATCH VIDEO</a>
          </div>
        </div>
      </div>
    </div>`
}