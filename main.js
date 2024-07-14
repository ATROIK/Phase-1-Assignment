document.addEventListener('DOMContentLoaded', function() {
    const cardsContainer = document.querySelector('.cards');
    let launchesData = [];

    fetchSpaceX();

    async function fetchSpaceX() {
        const response = await fetch('https://api.spacexdata.com/v3/launches?limit=12&offset=0');
        const data = await response.json();
        launchesData = data;
        displayAllLaunches();
    }

    function displayAllLaunches() {
        updateCards(launchesData);
    }

    function updateCards(launches) {
        const allCards = cardsContainer.querySelectorAll('.card');
        allCards.forEach(card => {
            const flightNumber = card.getAttribute('data-flight-number');
            const launch = launches.find(launch => launch.flight_number == flightNumber);
            if (launch) {
                card.querySelector('.card-title').textContent = `Flight Number ${launch.flight_number} - ${launch.mission_name}`;
                card.addEventListener('mouseover', () => showLaunchData(card, launch));
                card.addEventListener('mouseout', () => hideLaunchData(card));
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function showLaunchData(card, launch) {
        const cardText = card.querySelector('.card-text');
        cardText.innerHTML = `
            <p><b>Flight Number:</b> ${launch.flight_number}</p>
            <p><b>Mission Name:</b> ${launch.mission_name}</p>
            <p><b>Launch Year:</b> ${launch.launch_year}</p>
            <p><b>Launch Date:</b> ${launch.launch_date_local}</p>
            <p><b>Rocket Name:</b> ${launch.rocket.rocket_name}</p>
            <p><b>Launch Site:</b> ${launch.launch_site.site_name}</p>
            <p><b>Details:</b> ${launch.details}</p>
            <p><b>Rocket Type:</b> ${launch.rocket.rocket_type}</p>
            <p><b>Rocket First Stage Cores:</b> ${launch.rocket.first_stage.cores.map(core => core.core_serial).join(', ')}</p>
            <p><b>Rocket Second Stage Payloads:</b> ${launch.rocket.second_stage.payloads.map(payload => payload.payload_id).join(', ')}</p>
            <p><a href="${launch.links.wikipedia}" target="_blank" style="color: yellow;">Wikipedia Link</a></p>
            <p><a href="${launch.links.video_link}" target="_blank" style="color: yellow;">Link To Launch Video</a></p>
            <p><a href="${launch.links.mission_patch}" target="_blank" style="color: yellow;">Link to Larger Image Of The Mission Patch</a></p>
        `;
        card.querySelector('.small-patch').classList.add('hidden');
        card.classList.add('show-text');
    }

    function hideLaunchData(card) {
        card.querySelector('.small-patch').classList.remove('hidden');
        card.classList.remove('show-text');
    }

    const yearInput = document.getElementById('year-input');
    const showAllButton = document.getElementById('show-all-launches');

    yearInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const year = yearInput.value.trim();
            if (year) {
                const filteredLaunches = launchesData.filter(launch => launch.launch_year === year);
                if (filteredLaunches.length >0) {
                    updateCards(filteredLaunches);
                } else {
                    alert('No launches found for this year')
                }
            }
        }
    });

    showAllButton.addEventListener('click', function() {
        displayAllLaunches();
    });
});