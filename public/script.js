function getData() {
    fetch('/users', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log(error));
}

function saveData() {

    const name = document.getElementById('name').value;
    const specialty = document.getElementById('specialty').value;
    const score = document.getElementById('score').value;

    const data = {
        name: name,
        specialty: specialty,
        score: score
    }

    // Save the input data to `sqlite.db` using an API endpoint
    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log('Data saved:', result);
            alert('Data saved successfully!');
        })
        .catch(error => {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        });

}


function clearData() {

    fetch('/users', {
        method: 'DELETE',

    })
        .then(response => response.json())
        .then(result => {
            console.log(result.message)
        })
        .catch(error => console.error(error));

}