const navSlide = () => {
  const burger = document.querySelector(".nav__burger");
  const nav = document.querySelector(".nav__links");
  const navLinks = document.querySelectorAll(".nav__links li");

  burger.addEventListener('click', () => {

    nav.classList.toggle('nav__active');

    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
      link.style.animation = `nav--linksFade 0.5s ease forwards ${index / 7 + 0.2}s`;
      }
    });

    burger.classList.toggle('nav--burgerToggle');
  })
}
navSlide()

/* ############################################
--- <<<     Next launch     >>> ---
---############################################ */
const url = "https://api.spacexdata.com/v3/launches/upcoming";
const nextLaunchUrl = "https://api.spacexdata.com/v3/launches/next";
const errorContainer = document.querySelector(".error-container");
const nextLaunchContainer = document.querySelector(".index__nextLaunchContainer");

async function getNextLaunch() {
  try {
    const response = await fetch(nextLaunchUrl);
    const nextLaunchResult = await response.json();

    nextLaunchHtml(nextLaunchResult)
  }
  catch(error) {
    errorContainer.innerHTML = displayError("Ooops, An error occured when calling API.")
  }
}
getNextLaunch()


function nextLaunchHtml(nextLaunchResult) {
  const missionName = nextLaunchResult.mission_name;
  const flightNumber = nextLaunchResult.flight_number;
  const launchSite = nextLaunchResult.launch_site.site_name_long;
  const rocketName = nextLaunchResult.rocket.rocket_name;
  const launchDateUTC = nextLaunchResult.launch_date_utc;

  nextLaunchContainer.innerHTML = `<div class="index__nextLaunchResults">
  <h2>${missionName}</h2>
  <p><b>Flight Number:</b> ${flightNumber}</p>
  <p><b>Launch Date:</b> ${dateFormatter(launchDateUTC)}</p>
  <p><b>Launch Site:</b> ${launchSite}</p>
  <p><b>Rocket Name:</b> ${rocketName}</p>
  </div>`;

  // Countdown timer
  const countdownInterval = setInterval(() => {
    const launchTime = Date.parse(launchDateUTC);
    const now = Date.parse(new Date());
    const totalTimeRemaining = launchTime - now;
    const countdownContainer = document.getElementById('countdown-container');
    
    const seconds = Math.floor((totalTimeRemaining/1000) % 60);
    const minutes = Math.floor((totalTimeRemaining/1000/60) % 60);
    const hours = Math.floor((totalTimeRemaining / (1000*60*60)) % 24);
    const days = Math.floor(totalTimeRemaining / (1000*60*60*24));
    
    countdownContainer.innerHTML = `<div class="countdown__results">
      <div class="countdown__window">
        <p class="countdown__numbers">${days}</p> 
        <p class="countdown__TimeUnit">DAYS</p>
      </div>
      <div class="countdown__window">
        <p class="countdown__numbers">${hours}</p> 
        <p class="countdown__TimeUnit">HOURS</p>
      </div>
      <div class="countdown__window">
        <p class="countdown__numbers">${minutes}</p> 
        <p class="countdown__TimeUnit">MINUTES</p>
      </div>
      <div class="countdown__window">
        <p class="countdown__numbers">${seconds}</p> 
        <p class="countdown__TimeUnit">SECONDS</p>
      </div>
    </div>`;

    if (totalTimeRemaining < 0) {
      clearInterval(countdownInterval);
      countdownContainer.innerHTML = `<h2>Launched</h2>`;
    }
  }, 1000)
} 


/* ############################################
--- <<<     Upcoming launches     >>> ---
---############################################ */
const upcomingLaunchUrl = "https://api.spacexdata.com/v3/launches/upcoming";
const upcomingLaunchTable = document.querySelector('.index__upcomingLaunchTable');

async function getUpcomingLaunches() {
  try {
    const response = await fetch(upcomingLaunchUrl);
    const upcomingLaunchResults = await response.json();

    upcomingLaunchResults.map((upcomingLaunch) => {

      const launchDateUTC = upcomingLaunch.launch_date_utc;
      const flightNumber = upcomingLaunch.flight_number;
      const missionName = upcomingLaunch.mission_name;
      const launchSite = upcomingLaunch.launch_site.site_name_long;

      upcomingLaunchTable.innerHTML +=  `
      <tr class="upcomingLaunch__data tablerow__borderBottom">
        <td class="upcomingLaunch__flightNumber upcomingLaunch__dataTable">${flightNumber}</td>
        <td class="upcomingLaunch__mission upcomingLaunch__dataTable">${missionName}</td>
        <td class="upcomingLaunch__site upcomingLaunch__dataTable">${launchSite}</td>
        <td class="upcomingLaunch__date upcomingLaunch__dataTable">${dateFormatter(launchDateUTC)}</td>
      </tr>`;
    });
  }
  catch(error) {
    upcomingLaunchContainer.innerHTML = displayError("Ooops, an error occured when calling API")
  }
}
getUpcomingLaunches();



