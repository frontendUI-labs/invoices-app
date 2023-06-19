//darl and ligth mode//
const htmlDarkMode = document.body;
const ligthModeEl = document.querySelector('.iconLigthMode');
const darkModeEl = document.querySelector('.iconDarkMode');

const darkModeQuery = matchMedia('(prefers-color-scheme: dark)');
const isDarkMode = darkModeQuery.matches;

let userThemePrefer = isDarkMode ? 'dark' : 'light';
let currentTheme = localStorage.getItem('theme') ?? userThemePrefer;

if (currentTheme === 'dark') {
  displayDarkIcon();
} else {
  displayLigthIcon();
}

console.log(userThemePrefer);
function displayLigthIcon() {
  ligthModeEl.style.display = 'flex';
  darkModeEl.style.display = 'none';
  htmlDarkMode.classList.remove('dark');
}

function displayDarkIcon() {
  ligthModeEl.style.display = 'none';
  darkModeEl.style.display = 'flex';
  htmlDarkMode.classList.add('dark');
}

ligthModeEl.addEventListener('click', () => {
  htmlDarkMode.classList.add('dark');
  darkModeEl.style.display = 'flex';
  ligthModeEl.style.display = 'none';
  localStorage.setItem('theme', 'dark');
});
darkModeEl.addEventListener('click', () => {
  htmlDarkMode.classList.remove('dark');
  ligthModeEl.style.display = 'flex';
  darkModeEl.style.display = 'none';
  localStorage.setItem('theme', 'light');
});

darkModeQuery.addEventListener('change', (event) => {
  if (event.matches == true) {
    displayDarkIcon();
  } else {
    displayLigthIcon();
  }
  console.log('cambiooo', event);
});
