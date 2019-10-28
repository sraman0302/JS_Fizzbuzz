function get(url) {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.onload = function () {
            resolve({
                status: http.status,
                data: JSON.parse(http.response)
            });
        };
        http.open("GET", url);
        http.send();
    });
}

function login() {

    let user = document.getElementById("user").value
    get("http://basic-web.dev.avc.web.usf.edu/" + user).then(function (response) {
        //Put all code that relies on the data from this request in here.
        if (response.status == 200) {
            const username = response.data.id; //The username that was requested. In this case it is "myUserName".
            const score = response.data.score; //The user's current score.

        } else {
            //User "myUserName" not found.
            //response.data is null
            post("http://basic-web.dev.avc.web.usf.edu/" + user, {
                score: 0
            }); //create a new user.

        }
    });

    localStorage.setItem("Username", user);
}
