'use strict';
// Giphy API key
const apiKey = 'DqQ3KqY2wdEvA1q58DwmI3RBDJJIXwyz';


// Search terms
const search = 'search';
let currentSearch = 'search';


// Remembered offset
const offset = {
    'random': 0,
    'finder': 0,
    'trending': 0,
};

// HTML Objects
const navRandom = document.getElementById('nav__icon--random');
const navFinder = document.getElementById('nav__icon--finder');
const navTrending = document.getElementById('nav__icon--trending');

const secRandom = document.getElementById('random');
const secFinder = document.getElementById('finder');
const secTrending = document.getElementById('trending');

const backButtons = document.querySelectorAll('.button-back')
const nextButtons = document.querySelectorAll('.button-next')

const searchbar = document.getElementById('searchbar');
const form = document.getElementById('search-form');

const backFinder = document.getElementById('finder_button-back');
const nextFinder = document.getElementById('finder_button-next');

const emptyFinder = document.getElementById('finder__notification--empty')


// Navbar
const navbar = function(button, section) {
    button.addEventListener('click', () => {
        // Button Highlighting
        navRandom.classList.remove('selected');
        navFinder.classList.remove('selected');
        navTrending.classList.remove('selected');
        button.classList.add('selected')

        // Section Show
        secRandom.classList.add('hidden-section');
        secFinder.classList.add('hidden-section');
        secTrending.classList.add('hidden-section');
        section.classList.remove('hidden-section');
    });
};
navbar(navRandom, secRandom);
navbar(navFinder, secFinder);
navbar(navTrending, secTrending);


// Reset Random Gif or get more Gifs offset
nextButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Get type
        const type = button.id.replace('_button-next', '');

        offset[type] += 12; // Increase offset

        if (type != 'random') {
            const backBtn = document.getElementById(`${type}_button-back`)
            backBtn.classList.remove('hidden') // Reveal Back Button
        }

        addImgs(type, currentSearch, offset[type]);
    });
});


// Go back to previous Gifs offset
backButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Get type
        const type = button.id.replace('_button-back', '');

        offset[type] -= 12; // Decrease offset
        if (offset[type] <= 0) {
            offset[type] = 0;
            button.classList.add('hidden') // Hide back button
        };

        const nextBtn = document.getElementById(`${type}_button-next`)
        nextBtn.classList.remove('hidden') // Reveal Next Button

        addImgs(type, currentSearch, offset[type]);
    });
});


// Searchbar form submit
form.addEventListener('submit', function(e) {
    e.preventDefault();
    currentSearch = searchbar.value || search; // If searbar empty, go by default
    addImgs('finder', currentSearch);
    offset['finder'] = 0; // Reset Offset
    backFinder.classList.add('hidden');
    nextFinder.classList.remove('hidden'); // Reseting Back/Next Buttons
});


// Giphy API fetch
const getGif = async function(type, search = '', offset = 0, limit = 12) {
    // Returns gif or array of gifs
    try {
        const res = await fetch(`https://api.giphy.com/v1/gifs/${type}?api_key=${apiKey}&q=${search}&limit=${limit}&offset=${offset}`);
        const resJson = await res.json();
        const data = (resJson.data.length) ? resJson.data : [resJson.data];
        return data;
    } catch(err) {
        console.error(err);
    }
};


// Add image(s) to container
const addImgs = async function(type, search = '', offset = 0, limit = 12) {
    // Section specific HTML Objects - Before try/catch so can be used in error
        const error = document.querySelector(`.${type}__notification--error`);
        const loading = document.querySelector(`.${type}__notification--loading`);
        const loaded = document.querySelector(`.${type}__notification--loaded`);
        const container = document.querySelector(`.${type}__images`);
    try {
        emptyFinder.classList.add('hidden'); // No longer empty set
        error.classList.add('hidden');
        loaded.classList.add('hidden');
        loading.classList.remove('hidden');
        if (type == 'finder') type = 'search'; // Translated to work with fetch request
        container.innerHTML = ''; // Clear container
        const data = await getGif(type, search, offset, limit);
        if (data[0].length == undefined) { // Check for if no array of data is returned
            for (const gif of data) {
                const image = document.createElement('img');
                image.src = `https://media4.giphy.com/media/${gif.id}/giphy.gif`; // Image address
                if (gif.title.replaceAll(" ","") == "") gif.title = ""; // If title just spaces then title empty
                image.alt = gif.title || `Untitled ${type} gif`; // If title empty, alt = placeholder
                container.append(image); // Add to container
            };
        } else {
            nextFinder.classList.add('hidden');
            emptyFinder.classList.remove('hidden'); // Error: empty set
        };
        loading.classList.add('hidden');
        loaded.classList.remove('hidden');
    } catch(err) {
        console.error(err);
        loading.classList.add('hidden');
        loaded.classList.add('hidden');
        error.classList.remove('hidden');
    }
};


// On first load images
addImgs('random');
addImgs('finder', search);
addImgs('trending');
