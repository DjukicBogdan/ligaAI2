// Fetching JSON data from Glide application and processing it
fetch("./data.json")
  .then((response) => response.json())
  .then((json) => handleData(json));

async function handleData(json) {
  try {
    // Checking JSON format
    if (!json || !json.IGRACI || !Array.isArray(json.IGRACI)) {
      throw new Error("Invalid JSON data format.");
    }

    console.log("JSON:", json); // Logging the JSON data

    const matches = getMaxMatches(json);
    console.log("Matches:", matches);
    console.log("Number of matches:", matches.length);

    // Uncomment to send the result back to the Glide application
    const response = await sendData('https://liga.bogdandjukic.com/', { matches });
    console.log('Result successfully sent:', response);
  } catch (error) {
    console.error("Error while processing data:", error);
  }
}

// Function to process JSON data and find the maximum number of matches
function getMaxMatches(data) {
    // Checking for player data
    if (!data || !data.IGRACI || !Array.isArray(data.IGRACI)) {
        throw new Error("Invalid JSON data: Missing player information.");
    }

    const players = data.IGRACI;
    const matches = [];
    const availableTimeSlots = {};

    // Initializing available time slots
    Object.keys(data.playerCanPlay).forEach((player) => {
        data.playerCanPlay[player].forEach((timeSlot) => {
            if (!availableTimeSlots[timeSlot]) {
                availableTimeSlots[timeSlot] = [];
            }
            availableTimeSlots[timeSlot].push(player);
        });
    });

    console.log("Available Time Slots:", availableTimeSlots); // Logging available time slots

    // Sorting time slots based on the number of players available
    const sortedTimeSlots = Object.entries(availableTimeSlots).sort((a, b) => b[1].length - a[1].length);

    console.log("Sorted Time Slots:", sortedTimeSlots); // Logging sorted time slots

    // Filter out time slots with fewer than 2 available players
    const filteredTimeSlots = sortedTimeSlots.filter(([timeSlot, playersAvailable]) => playersAvailable.length >= 2);

    // Iterating through the filtered time slots to create matches
    filteredTimeSlots.forEach(([timeSlot, playersAvailable]) => {
        console.log(`Players available for ${timeSlot}:`, playersAvailable); // Log players available for each time slot
        while (playersAvailable.length >= 2) {
            const player1 = playersAvailable.pop();
            const player2 = playersAvailable.pop();
            matches.push({ player1, player2, time: timeSlot });
        }
    });

    const prioritizedMatches = prioritizeMatches(matches, data.PRIORITETI);
    console.log("Prioritized Matches:", prioritizedMatches); // Log prioritized matches

    return prioritizedMatches;
}

// Function to prioritize matches based on specified criteria
function prioritizeMatches(matches, priorities) {
    const prioritizedMatches = [];

    for (const priority of priorities) {
        switch (priority.id) {
            case "10":
                // Ensure each player plays at least one match
                matches.forEach((match) => {
                    if (!prioritizedMatches.find((m) => m.player1 === match.player1 || m.player2 === match.player1)) {
                        prioritizedMatches.push(match);
                    }
                });
                break;
            case "20":
                // Maximize the number of matches
                prioritizedMatches.push(...matches);
                break;
            // Implement other prioritization criteria as needed
            default:
                break;
        }
    }

    return prioritizedMatches;
}

// Function to send JSON data via POST request
async function sendData(url = "https://liga.bogdandjukic.com/", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // const responseData = await response.json();

  // Checking response after sending
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} - ${responseData.message}`);
  }
  return responseData;
}
