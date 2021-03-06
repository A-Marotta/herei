const searchForm = document.querySelector('.search-input')
const attractionView = document.querySelector('.user-view-attraction')
const sessionView = document.querySelector('.user-view-selection')

const searchBtn = document.querySelector('.search-btn')
const viewAttractionBtn = document.querySelector('.attraction-results-btn')
const viewSessionsBtn = document.querySelector('.user-sessions-results-btn')

searchBtn.addEventListener('click', handleSearchCity)
viewAttractionBtn.addEventListener('click', handleViewAttraction)
viewSessionsBtn.addEventListener('click', handleViewSession)

function GetMap()
{
    var map = new Microsoft.Maps.Map('#bingMap');
    map.setView({
        center: new Microsoft.Maps.Location(-25.0305743, 135.2103504),
        zoom: 5
    });
}

function handleSearchCity(e) {
    e.preventDefault()
    sessionView.style.display = 'none'
    
    importMapLocations()
 
}

function importMapLocations() {
    var map = new Microsoft.Maps.Map(document.querySelector('#bingMap'), {
        zoom: 10
    });
    removeChildren(attractionView);
    
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);

        const infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
            visible: false,
        });

        infobox.setMap(map);

        // handle pin clicked event
        const pushpinClicked = function (e) {
            if (e.target.metadata) {
                //Set the infobox options with the metadata of the pushpin.
                infobox.setOptions({
                    location: e.target.getLocation(),
                    title: e.target.metadata.title,
                    description: e.target.metadata.description,
                    visible: true,
                    showCloseButton: true,
                });
            }
        };

        var requestOptions = {
            bounds: map.getBounds(),
            where: searchForm.value,
            callback: function (answer, userData) {
                const attractionPins = getMapAttractions(searchForm.value)
                .then(data => {
                    map.setView({ bounds: answer.results[0].bestView });
                    data.forEach(pin => {
                        const location = new Microsoft.Maps.Location(pin.lat, pin.long)
                        var pinDetails = new Microsoft.Maps.Pushpin(location, {
                            title: pin.title,
                            text: pin.id,
                            color: 'red'
                        });
                        pinDetails.metadata = {
                            title: pin.title,
                            description: pin.description,
                            img: pin.img
                        };
                        Microsoft.Maps.Events.addHandler(pinDetails, 'click', pushpinClicked);
                        map.entities.push(pinDetails);

                        importSideAttractions(pin)
                    })
                    

                })
            }
        };

        searchManager.geocode(requestOptions);
    });
}

function removeChildren(node) {
    node.innerHTML = '';
}

function importSideAttractions(data) {
    const leftMenu = document.querySelector('.resultsLeftSide')
    createAttractionInfo(leftMenu, attractionView, data)

}

function createAttractionInfo(leftMenu, attractionView, data) {   
    attractionView.style.display = 'contents'

    let attraction = document.createElement('div')
    attraction.className = 'attraction'

    let attractionImgDiv =  document.createElement('div')
    attractionImgDiv.className = 'attraction-image'

    let attractionImg =  document.createElement('img')
    attractionImg.className = 'attraction-image'
    attractionImg.setAttribute("src", data.img)

    attractionView
        .appendChild(attraction)
        .appendChild(attractionImgDiv)
        .appendChild(attractionImg)

    let attractionDetails = document.createElement('div')
    attractionDetails.className = 'attraction-details'

    let attractionTitle = document.createElement('h3')
    attractionTitle.className = 'attraction-title'
    attractionTitle.textContent = data.title

    let attractionDescription = document.createElement('h4')
    attractionDescription.className = 'attraction-description'
    attractionDescription.textContent = data.description

    let attractionSessions = document.createElement('select')
    attractionSessions.className = 'attraction-sessions'
    attractionSessions.setAttribute('name', 'session-datetime')
    
    let attractionBookBtn = document.createElement('button')
    attractionBookBtn.className = 'attraction-session-book'
    attractionBookBtn.setAttribute('attraction-id', data.id)
    attractionBookBtn.textContent = 'BOOK NOW'
    attractionBookBtn.setAttribute("type", "submit")

    getAttractionSessions(data.id).then(session =>  {
        if (session.length === 0) {
            let sessiontime = document.createElement('option')
            sessiontime.text = 'No available sessions'
            sessiontime.setAttribute("value", 0)
            attractionSessions.add(sessiontime)
            attractionBookBtn.classList.add('disableEvent')
        } else {
            for ( var i = 0; i < session.length; i++) {
                let sessiontime = document.createElement('option')
                const sessionDateTime = formatSessionDateTime(session[i].datetime)
                sessiontime.text = sessionDateTime
                sessiontime.setAttribute("value", session[i].id)
                attractionSessions.add(sessiontime)
            }
        }
    })

    let personCount = document.createElement('select')
    personCount.className = 'attraction-person-count'
    personCount.setAttribute('name', 'num-of-persons')
    for ( var i = 0; i < data.maxcount; i++) {
        let countValue = document.createElement('option')
        countValue.text = i+1
        countValue.setAttribute("value", i+1)
        personCount.add(countValue)        
    }

    let attractionPrice = document.createElement('h3')
    attractionPrice.className = 'attraction-price'
    attractionPrice.textContent = `$${data.price}`

    let pricePer = document.createElement('span')
    pricePer.className = 'price-per'
    pricePer.textContent = 'p'

    let bookForm = document.createElement('form')
    bookForm.className = 'book-now-form'
    bookForm.method = 'POST'
    bookForm.action = `/api/create-checkout-session/${data.id}`

    attractionView.appendChild(attraction)
    attraction.appendChild(attractionDetails)
    attractionDetails.appendChild(attractionTitle)
    attractionDetails.appendChild(attractionDescription)
    bookForm.appendChild(attractionSessions)
    bookForm.appendChild(personCount)
    bookForm.appendChild(attractionPrice)
    attractionPrice.appendChild(pricePer)
    
    attractionDetails.appendChild(bookForm)    
    bookForm.appendChild(attractionBookBtn)
}

function getMapAttractions(city) {
    const promise = axios.get(`http://localhost:8080/api/attractions/search/${city}`)
    const dataPromise = promise.then((response) => response.data)
    return dataPromise  
}

function getAttractionSessions(id) {
    const promise = axios.get(`http://localhost:8080/api/timeslots/${id}`)
    const dataPromise = promise.then((response) => response.data)
    return dataPromise  
}

function formatSessionDateTime(datetime) {
    let split = datetime.split(/[\sT\s-\:\Z]+/)

    let hour = ''
    let monthIndex = split[1]

    let day = split[2]

    hour = split[3] >= 12 
        ? hour = split[3] - 12 
        : hour = split[3]

    let ampm = split[3] >= 12 
        ? 'PM' 
        : 'AM';

    monthIndex = monthIndex[0] === '0' 
        ? monthIndex = monthIndex.split().splice(0, 1) 
        : monthIndex = monthIndex

    month = getMonth(Number(monthIndex))

    return `${day} ${month} - ${hour}${ampm}`
}

function getMonth(index) {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    return months[index]
}

function handleViewAttraction() {
    attractionView.style.display = 'contents'
    sessionView.style.display = 'none'
}

function handleViewSession() {
    attractionView.style.display = 'none'
    sessionView.style.display = 'contents'
    removeChildren(sessionView);

    const sessions = getUserSessions()
    .then(data => {
        data.forEach(session => {
            insertSessions(session)
        })
    })
    .catch(err => {
        if (err.response.status) {
            setFutureSessionsError(err)
        }
    })
}

function getUserSessions() {
    const promise = axios.get(`http://localhost:8080/api/sessions/future/`)
    const dataPromise = promise.then((response) => response.data)
    return dataPromise  
}

function insertSessions(data) {
    let attraction = document.createElement('div')
    attraction.className = 'attraction'

    let attractionImgDiv =  document.createElement('div')
    attractionImgDiv.className = 'attraction-image'

    let attractionImg =  document.createElement('img')
    attractionImg.className = 'attraction-image'
    attractionImg.setAttribute("src", data.img)

    sessionView
        .appendChild(attraction)
        .appendChild(attractionImgDiv)
        .appendChild(attractionImg)

    let attractionDetails = document.createElement('div')
    attractionDetails.className = 'attraction-details'

    let attractionTitle = document.createElement('h3')
    attractionTitle.className = 'attraction-title'
    attractionTitle.textContent = data.title

    let attractionDescription = document.createElement('h4')
    attractionDescription.className = 'attraction-description'
    attractionDescription.textContent = data.description

    let attractionSessions = document.createElement('p')
    attractionSessions.className = 'attraction-sessions'
    attractionSessions.setAttribute('name', 'session-datetime')
    attractionDescription.textContent = formatSessionDateTime(data.datetime)

    let deleteForm = document.createElement('form')
    deleteForm.className = 'book-now-form'
    deleteForm.method = 'POST'
    deleteForm.action = `/api/create-checkout-session/${data.id}`

    let sessionDeleteBtn = document.createElement('button')
    sessionDeleteBtn.className = 'attraction-session-book'
    sessionDeleteBtn.setAttribute('session-id', data.session_id)
    sessionDeleteBtn.textContent = 'DELETE'
    sessionDeleteBtn.setAttribute("type", "submit")

    sessionView.appendChild(attraction)
    attraction.appendChild(attractionDetails)
    attractionDetails.appendChild(attractionTitle)
    attractionDetails.appendChild(attractionDescription)
    deleteForm.appendChild(attractionSessions)
    
    attractionDetails.appendChild(deleteForm)    
    // deleteForm.appendChild(sessionDeleteBtn)
}

function setFutureSessionsError(err) {
    let attraction = document.createElement('div')
    attraction.className = 'attraction'

    sessionView.appendChild(attraction)

    let attractionDetails = document.createElement('div')
    attractionDetails.className = 'attraction-details'

    attraction.appendChild(attractionDetails)

    let attractionTitle = document.createElement('h3')
    attractionTitle.className = 'attraction-error'
    attractionTitle.textContent = err.response.data.message.toUpperCase()

    let loginLink = document.createElement('a')
    loginLink.className = 'login-link'
    loginLink.textContent = 'Click here to login'
    loginLink.href = "/users/login"

    attractionDetails.appendChild(attractionTitle)
    attractionDetails.appendChild(loginLink)
}

// const session_id = document.querySelector('.attraction-sessions').value
// const attraction_id = e.target.attributes['attraction-id'].value

//pk_test_51J8IVLK85xB9CLmPbXgXCOwHwRxTNfIOq4D6kwvk5qGu0vY1AbHYUIlYSWn2W7ikWtPIZ8diRFh3j5remuVvS9pC00zLS8uvYi