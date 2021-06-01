
// -----------------------------------------------------
// Convert api content from 'text/plain' to JSON  - not in use atm
// -----------------------------------------------------
export function parseApiData(data) {
    // console.log(typeof(data)); // = string
    let localData = data;
    // console.log('localData after trim', localData); // difference?

    localData = localData.split('\n'); // split string into array of lines
    console.log(localData);
    /* localData.forEach(line => {
        JSON.parse((line.trim()));
    }); */
    console.log(localData[35]);
    return localData;
}