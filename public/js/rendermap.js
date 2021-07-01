const searchForm = document.querySelector('.search-input')
const searchBtn = document.querySelector('.search-btn')

searchBtn.addEventListener('click', handleSearchCity)

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

    importMapLocations()
 
}

function importMapLocations() {
    var map = new Microsoft.Maps.Map(document.querySelector('#bingMap'), {
        zoom: 10
    });
    
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
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
                            text: pin.id
                        });
                        map.entities.push(pinDetails);

                        importSideAttractions(pin)
                    })
                    

                })
            }
        };
        searchManager.geocode(requestOptions);
    });
}

function importSideAttractions(data) {
    const leftMenu = document.querySelector('.resultsLeftSide')

    createAttractionInfo(leftMenu, data)

}

function createAttractionInfo(leftMenu, data) {
    let attraction = document.createElement('div')
    attraction.className = 'attraction'

    let attractionImgDiv =  document.createElement('div')
    attractionImgDiv.className = 'attraction-image'

    let attractionImg =  document.createElement('img')
    attractionImg.className = 'attraction-image'
    attractionImg.setAttribute("src", data.img)

    leftMenu
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

    getAttractionSessions(data.id).then(session =>  {
        if (session.length === 0) {
            let sessiontime = document.createElement('option')
            sessiontime.text = 'No available sessions'
            attractionSessions.add(sessiontime)
        } else {
            for ( var i = 0; i < session.length; i++) {
                let sessiontime = document.createElement('option')
                const sessionDateTime = formatSessionDateTime(session[i].datetime)
                sessiontime.text = sessionDateTime
                sessiontime.setAttribute("value", session[i].id);
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
        countValue.setAttribute("value", i+1);
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

    let attractionBookBtn = document.createElement('button')
    attractionBookBtn.className = 'attraction-session-book'
    attractionBookBtn.setAttribute('attraction-id', data.id)
    attractionBookBtn.textContent = 'BOOK NOW'
    attractionBookBtn.setAttribute("type", "submit")
    attractionBookBtn.addEventListener('click', setButtonFunctionality)

    leftMenu.appendChild(attraction)
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

function getAvailableSessions(data) {
    const sessions = getAttractionSessions(data.id)
        .then(session => {
            console.log(session)
        })
    
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

function setButtonFunctionality(e) {
    const session_id = document.querySelector('.attraction-sessions').value
    const attraction_id = e.target.attributes['attraction-id'].value
    // console.log(typeof session_id)

    // stripePayment()

    // axios.post(`/create-checkout-session`)
    // Make an axios call to stripe for checkout
    // .then function (if successful make another axios to book the session)
    // else if stripe call fails ... TBC
        // axios.post(`/api/sessions/${session_id}`)
    
}

function stripePayment() {
    
}

// const attraction_id = e.target.attributes['attraction-id'].value
// axios.post(`/api/sessions/${attraction_id}`)

//pk_test_51J8IVLK85xB9CLmPbXgXCOwHwRxTNfIOq4D6kwvk5qGu0vY1AbHYUIlYSWn2W7ikWtPIZ8diRFh3j5remuVvS9pC00zLS8uvYi