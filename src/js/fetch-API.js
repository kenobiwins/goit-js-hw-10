const MAIN_URL = 'https://restcountries.com/v3.1/name';
const OPTIONS = 'name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(`${MAIN_URL}/${name}?fields=${OPTIONS}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
