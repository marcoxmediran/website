const API_URL = "https://oxppfkq01j.execute-api.ap-southeast-2.amazonaws.com/items";

async function loadPortfolioData() {
    const projectsContainer = document.getElementById("projects-list");
    const interestsContainer = document.getElementById("interests-list");

    const cachedData = localStorage.getItem(API_URL);
    if (cachedData) {
        try {
            const data = JSON.parse(cachedData);
            renderItems(data, projectsContainer, interestsContainer);
        } catch (error) {
            console.error("Error parsing cache:", error);
        }
    }

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        localStorage.setItem(API_URL, JSON.stringify(data));
        renderItems(data, projectsContainer, interestsContainer);

    } catch (error) {
        if (!cachedData) {
            renderError(error, projectsContainer, interestsContainer);
        }
    }
}

function renderItems(data, projectsContainer, interestsContainer) {
    if (Array.isArray(data.projects) && data.projects.length > 0) {
        projectsContainer.innerHTML = data.projects
            .map(
                (project) => `
                  <p>
                    <a href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.title)}</a>
                    - ${escapeHtml(project.description)}
                  </p>
                `
            )
            .join("");
    } else {
        projectsContainer.innerHTML = "<p>No projects listed yet</p>";
    }

    if (Array.isArray(data.interests) && data.interests.length > 0) {
        interestsContainer.textContent = data.interests.join(", ");
    } else {
        interestsContainer.textContent = "None listed";
    }
}

function renderError(error, projectsContainer, interestsContainer) {
    console.error("Failed to load portfolio items:", error);
    projectsContainer.innerHTML = "<p>Unable to load projects right now</p>";
    interestsContainer.textContent = "Unable to load interests right now";
}

function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", loadPortfolioData);