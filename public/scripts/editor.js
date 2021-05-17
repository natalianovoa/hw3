const baseURL = 'http://localhost:8081';

const initResetButton = () => {
    // if you want to reset your DB data, click this button:
    document.querySelector('#reset').onclick = ev => {
        fetch(`${baseURL}/reset/`)
            .then(response => response.json())
            .then(data => {
                console.log('reset:', data);
            });
    };
};

const attachEventHandlers = () => {
    // once the unordered list has been attached to the DOM
    // (by assigning the #doctors container's innerHTML),
    // you can attach event handlers to the DOM:
    document.querySelectorAll('#doctors a').forEach(a => {
        a.onclick = showDetail;
    });
};

let doctors;
let doctor; 

//DISPLAY DOCTORS
fetch('/doctors')
    .then(response => response.json())
    .then(data => {
        // store the retrieved data in a global variable called "doctors"
        doctors = data;
        const listItems = data.map(item => `
            <li>
                <a href="#" data-id="${item._id}">${item.name}</a>
            </li>`
        );
        document.getElementById('doctors').innerHTML = `
            <ul>
                ${listItems.join('')}
            </ul>
            <button id="doctorNew" onclick="newDoctor()" class="btn">Add New Doctor</button>
            `
    })
    .then(attachEventHandlers);

//DISPLAY 1 DOCTOR
const showDetail = ev => {
    ev.preventDefault();
    console.log(ev.currentTarget.dataset.id);
    const id = ev.currentTarget.dataset.id;
    doctor = doctors.filter(doctor => doctor._id === id)[0];
    console.log(doctor);

    document.querySelector('#doctor').innerHTML = `
        <h2>${doctor.name}</h2>
        <button class="btn btn-main" onclick="editDoc()" id="doctorEdit" > Edit </button>
        <button class="btn btn-main" onclick="processDelete()" id = "doctorDelete" > Delete </button>
        <p>Seasons:${doctor.seasons}</p>
        <img src="${doctor.image_url}" id = "main_img"  />
    `;
    
    fetch(`/doctors/${doctor._id}/companions`)
        .then(response => response.json())
        .then(data => {
            // store the retrieved data in a global variable called "companions"
            companions = data;
            const listItems = data.map(item => `
            <main class = "grid">
            <div class="card">
                <img src="${item.image_url}"/>
                <div class="container">
                    <h4><b><a href="#" data-id="${item._id}">${item.name}</a></b></h4>
                </div>
                </div>
            </main>`)
            document.getElementById('companions').innerHTML = `
            <ul>
                ${listItems.join('')}
            </ul>`
            })

        .then(attachEventHandlers);
    }

//CREATE DOCTOR
const newDoctor = () => {
    document.querySelector('#doctorNew').onclick = ev => {
    document.querySelector('#companions').innerHTML = ""
    document.querySelector('#doctor').innerHTML = `
    <form>
    <p>
    <!-- Name -->
    <label for="name">Name</label>
    <input type="text" id="name">
    </p>
    <p>
    <!-- Seasons -->
    <label for="seasons">Seasons</label>
    <input type="text" id="seasons">
    </p>
    <p>
    <!-- Ordering -->
    <label for="ordering">Ordering</label>
    <input type="text" id="ordering">
    </p>
    <p>
    <!-- Image -->
    <label for="image_url">Image</label>
    <input type="text" id="image_url">
    </p>
    <p>
    <!-- Buttons -->
    <button class="btn btn-main" onclick="postDoc()" id="create">Save</button>
    <button class="btn" onclick="cancel()" id="cancel">Cancel</button>
    </p>
</form>`
    }
}

const cancel = () => {
    document.querySelector('#cancel').onclick = ev => {
    document.querySelector('#companions').innerHTML = ""
    document.querySelector('#doctor').innerHTML = `
    <form>
    <p>
    <!-- Name -->
    <label for="name">Name</label>
    <input type="text" id="name">
    </p>
    <p>
    <!-- Seasons -->
    <label for="seasons">Seasons</label>
    <input type="text" id="seasons">
    </p>
    <p>
    <!-- Ordering -->
    <label for="ordering">Ordering</label>
    <input type="text" id="ordering">
    </p>
    <p>
    <!-- Image -->
    <label for="image_url">Image</label>
    <input type="text" id="image_url">
    </p>
    <p>
    <!-- Buttons -->
    <button class="btn btn-main" onclick="postDoc()" id="create">Save</button>
    <button class="btn" onclick="cancel()" id="cancel"> Cancel</button>
    </p>
</form>`
        }
}

//SAVE DOCTOR POST
const postDoc = ev => {
    const data = {
        name: document.getElementById('name').value,
        seasons: document.getElementById('seasons').value.split(','),
        ordering: document.getElementById('ordering').value,
        image_url: document.getElementById('image_url').value
    }
    if(!data.name){
        document.getElementById('doctor').innerHTML += 
        `<h3>Name is not valid.`}
    else if(!data.seasons){
        document.getElementById('doctor').innerHTML += 
        `<h3>Seasons are not valid.`}
    else if(!data.image_url){
        document.getElementById('doctor').innerHTML += 
        `<h3>Image URL is not valid.`}
    else if(!data.ordering){
        document.getElementById('doctor').innerHTML += 
        `<h3>Ordering is not valid.`}
                
    fetch(`/doctors`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                // send to catch block:
                throw Error(response.statusText);
            } else {
                return response.json();
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            console.error(err);
            alert('Error!');
        });
    ev.preventDefault();
};

//EDIT DOCTOR FORM
const editDoc = () => {
    document.querySelector('#companions').innerHTML = ""
    document.querySelector('#doctor').innerHTML =
    `<form>
    <p>
    <!-- Name -->
    <label for="name">Name</label>
    <input type="text" id="name" value="${doctor.name}">
    </p>
    <p>
    <!-- Seasons -->
    <label for="seasons">Seasons</label>
    <input type="text" id="seasons" value="${doctor.seasons}">
    </p>
    <p>
    <!-- Ordering -->
    <label for="ordering">Ordering</label>
    <input type="text" id="ordering" value="${doctor.ordering}">
    </p>
    <p>
    <!-- Image -->
    <label for="image_url">Image</label>
    <input type="text" id="image_url" value="${doctor.image_url}">
    </p>
    <p>
    <!-- Buttons -->
    <button class="btn btn-main" id="patch" onclick="patchDoc()"> Save</button>
    <button class="btn" onclick="newDoctor()" id="cancel">Cancel</button>
    </p>
    </form>`
}

//EDIT DOC PATCH
const patchDoc = ev => {
    const data = {
        name: document.getElementById('name').value,
        seasons: document.getElementById('seasons').value.split(','),
        ordering: document.getElementById('ordering').value,
        image_url: document.getElementById('image_url').value
    }
    if(!data.name){
        document.getElementById('doctor').innerHTML += 
        `<h3>Name is not valid.`}
    else if(!data.seasons){
        document.getElementById('doctor').innerHTML += 
        `<h3>Seasons are not valid.`}
    else if(!data.image_url){
        document.getElementById('doctor').innerHTML += 
        `<h3>Image URL is not valid.`}
    else if(!data.ordering){
        document.getElementById('doctor').innerHTML += 
        `<h3>Ordering is not valid.`}

    fetch((`/doctors/${doctor._id}`), {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                // send to catch block:
                throw Error(response.statusText);
            } else {
                return response.json();
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            console.error(err);
            alert('Error!');
        });
};

//DELETE A DOCTOR
const processDelete = ev => {
    fetch((`/doctors/${doctor._id}`), {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                // send to catch block:
                throw Error(response.statusText);
            } else {
                // because the endpoint returns a 
                // null value, use the text() method
                // instead of the .json() method:
                return response.text();
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            console.error(err);
            alert('Error!');
        });
};

// invoke this function when the page loads:
initResetButton();