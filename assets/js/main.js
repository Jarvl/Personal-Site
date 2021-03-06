var name = document.getElementById("name").getAttribute("data-name");
var nameArray = name.split("");
var bgTransitionTime = 5000;
var startNameIndex = 0;
var bgColorIndex = 0;
var bgIncrementer = Math.random() < 0.5 ? -1 : 1;
var colorSchemeIndex = 0;

// Add new colorSchemes here
var colorSchemes = {
    default: [
        '#26A69A',
        '#FBC02D',
        '#42A5F5',
        '#7CB342',
        '#E57373',
        '#03A9F4',
        '#C0CA33',
        '#00ACC1',
        '#FF6F00',
        '#4CAF50'
    ],
    vaporwave: [
        '#6feae6',
        '#f6a3ef',
        '#50d8ec',
        '#dd6dfb',
        '#eecd69'
    ]
};

// Add display name for color scheme here
var colorSchemeNames = {
    default: 'vanilla',
    vaporwave: 'a e s t h e t i c'
};

var colorSchemesArray = [];
for (var o in colorSchemes) {
    colorSchemesArray.push(colorSchemes[o]);
}

var colorSchemeNamesKeys = Object.keys(colorSchemeNames);
var colorSchemeNamesValues = [];
for (var o in colorSchemeNames) {
    colorSchemeNamesValues.push(colorSchemeNames[o]);
}

var currentColorScheme;


document.addEventListener("DOMContentLoaded", function() {
    var bgColorToggleEl = document.getElementById("bgColorToggle");

    var initialColorSchemeName = bgColorToggleEl.getAttribute("data-color-scheme");
    currentColorScheme = colorSchemes[initialColorSchemeName];

    for (var i = 0; i < colorSchemesArray.length; i++) {
        if (colorSchemesArray[i] === currentColorScheme) {
            colorSchemeIndex = i;
            break;
        }
    }

    // Set color scheme text
    bgColorToggleEl.innerHTML = setToggleText(colorSchemeNamesValues[getNextColorSchemeIndex()])

    startNameInterval(15, 7);
    switchColorScheme();

    bgColorToggleEl.addEventListener("click", function() {
        colorSchemeIndex++;
        switchColorScheme();

        // Set color scheme name and text
        this.setAttribute('data-color-scheme', colorSchemeNamesKeys[getNextColorSchemeIndex()]);
        this.innerHTML = setToggleText(colorSchemeNamesValues[getNextColorSchemeIndex()]);
    });
});


function setToggleText(csName) {
    return "Switch to " + csName;
}

function getNextColorSchemeIndex() {
    return stepArrayIndex(colorSchemeNamesKeys, colorSchemeIndex+1);
}


function switchColorScheme() {
    // Get the current color scheme and change it
    colorSchemeIndex = stepArrayIndex(colorSchemesArray, colorSchemeIndex);
    // Set current color scheme values
    currentColorScheme = colorSchemesArray[colorSchemeIndex];
    // Reset color index
    bgColorIndex = getRandomIndex(currentColorScheme);

    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    bgEl = document.getElementById("background");

    // Add switch case for color scheme here
    switch (colorSchemeNamesKeys[colorSchemeIndex]) {
        case 'vaporwave':
            // Address bar bg fix
            if (windowHeight <= 768) {
                bgEl.style.height = (windowHeight + 60) + "px";
            }

            // Stop rotating colors
            clearInterval(window.bgInterval);
            // Reset styles
            document.body.style.backgroundColor = '';
            document.body.classList.add("vaporwave");
            break;
        default:
            // Reset bg height to normal
            bgEl.style.height = windowHeight + "px";
            // Set background color, remove image, start rotating
            setBackgroundColor(bgColorIndex);
            document.body.classList.remove("vaporwave");
            startBgInterval(bgTransitionTime);
    }
}


function generateName(tick, delay, separation) {
    // Start filling letters after 10 ticks
    var generateStep = Math.floor((tick - delay) / separation);
    var generatedName = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // If the step is a whole number and positive, fill in that letter
    if (generateStep >= 0) {
        // Fail-safe for name generation
        if (!nameArray[generateStep]) return name;

        for (var i = 0; i <= generateStep; i++) {
            generatedName += nameArray[i];
        }

        startNameIndex = generateStep+1;
    }

    // Generate the remaining letters
    for (var j = startNameIndex; j < name.length; j++) {
        // Only generate new characters for characters, not spaces
        generatedName += (name.charAt(j) == " ") ? " " : possible.charAt(getRandomIndex(possible));
    }

    return generatedName;
}


function setBackgroundColor(index) {
    document.body.style.backgroundColor = currentColorScheme[index];
}


function setRandomBackground() {
    bgColorIndex = getRandomIndex(currentColorScheme);
    // Set background initially
    setBackgroundColor(bgColorIndex);
}


function getRandomIndex(theArray) {
    return Math.floor(Math.random() * theArray.length);
}


function startBgInterval(interval) {
    setRandomBackground();
    document.body.classList.add("animate-bg");

    window.bgInterval = setInterval(function() {
        // Change bg color index, keep within range of array indicies
        bgColorIndex = stepArrayIndex(currentColorScheme, bgColorIndex+bgIncrementer);
        setBackgroundColor(bgColorIndex);
    }, interval);
}


function stepArrayIndex(theArray, theIndex) {
    if (theIndex < 0) theIndex = theArray.length-1;
    else if (theIndex >= theArray.length) theIndex = 0;
    return theIndex;
}


function startNameInterval(delay, separation) {
    var tick = 0;
    window.nameInterval = setInterval(function() {
        // Set name
        var generatedName = generateName(tick, delay, separation);
        document.getElementById("name").innerHTML = generatedName;

        // Stop interval when name is filled in
        if (generatedName == name) {
            clearInterval(window.nameInterval);
        }
        tick++;
    }, 40);
}
