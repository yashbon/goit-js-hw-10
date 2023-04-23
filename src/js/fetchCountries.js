const BASE_URL = 'https://restcountries.com/v3.1/name/';
const dataFields = new URLSearchParams({
    fields: 'name,capital,population,flags,languages,',
});

function fetchCountries(name) {
    const URL = `${BASE_URL}${name}?&${dataFields}`;
    return fetch(URL).then(response => {
        console.log(response);
        if (!response.ok) {
            throw new Error('No such country was found!', response.statusText)
        }
        return response.json();
    })
}

export { fetchCountries }
