// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements

const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');

// Init voices array
let voices = [];

const getVocies = () => {
    voices = synth.getVoices();

    // loop through voices and create an option element
    voices.forEach(voice => {
        // create option element
        const option = document.createElement('option');
        //Fill the option with voice and lang
        option.textContent = voice.name + `( ${voice.lang} )`;

        // Set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
}

getVocies();

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVocies;
}

// Speak
const speak = () => {

    // check if speaking
    if (synth.speaking) {
        console.error('Already speaking');
        return;
    }
    if (textInput.value != '') {
        document.getElementById('background-gif').style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5), rgb(0, 0, 0, 0.5)), url('https://cdn.lowgif.com/full/700b0b9c67965ca5-red-music-sound-waves-www-pixshark-com-images.gif')";

        // Get speak to test
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        // Speak end
        speakText.onend = e => {
            document.getElementById('play').disabled = false;
            document.getElementById('background-gif').style.backgroundImage = "";
            console.log('Done speaking');
        }

        // Speak error
        speakText.onerror = e => {
            document.getElementById('play').disabled = false;
            console.error("Something went wrong");
        }

        // Select the voice speak
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        // Loop trough voices
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        // Set pitch rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Speak
        synth.speak(speakText);
    }
}


// Event listners

// Text form submit

textForm.addEventListener('submit', (e) => {
    document.getElementById('play').disabled = true;
    e.preventDefault();
    speak();
    textInput.blur();
});

document.getElementById('stop').addEventListener('click', e => {
    synth.cancel();
    document.getElementById('play').disabled = false;
});

// Rate value change
rate.addEventListener('change', e => rateValue.textContent = rate.value);

// Pitch value change
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);

// Voice select change
voiceSelect.addEventListener('change', e => speak());
