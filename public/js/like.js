var jsonData = [];
document.addEventListener('DOMContentLoaded', function() {
    var dataElement = document.getElementById('data');
    jsonData = JSON.parse(dataElement.textContent);
});

console.log(jsonData)