const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var searchInput = document.querySelector(".search-input");
searchInput.value = urlParams.get("search");

// 1 second to buffering time.
setTimeout(function () {
    importMapLocations();
}, 1000);
