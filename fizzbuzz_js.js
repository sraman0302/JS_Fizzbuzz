//Respective get and post function definition made
function get(url) {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.onload = function () {
            resolve({
                status: http.status,
                data: JSON.parse(http.response)
            });
        }
        http.open("GET", url);
        http.send();
    })
}

function post(url, data) {
    data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.onload = function () {
            resolve({
                status: http.status,
                data: JSON.parse(http.response)
            });
        }
        http.open("POST", url);
        //Make sure that the server knows we're sending it json data.
        http.setRequestHeader("Content-Type", "application/json");
        http.send(data);
    })
}

const user = localStorage.getItem("Username");
let score = 0,
    flag = false;
document.getElementById("getUsername").innerHTML = user;

// get function to store the user information in the api
get("http://basic-web.dev.avc.web.usf.edu/" + user).then(function (response) {
    //Put all code that relies on the data from this request in here.
    if (response.status == 200) {
        const username = response.data.id; //The username that was requested. In this case it is "myUserName".
        score = response.data.score; //The user's current score.

    } else {
        //User "myUserName" not found.
        //response.data is null
        post("http://basic-web.dev.avc.web.usf.edu/" + user, {
            score: 0
        }); //create a new user.
    }
    document.getElementById("savedScore").innerHTML = score;

})


function play() {

    if (!flag) { //to print the value right upon logging in
        document.getElementById("savedScore").id = "demo";
        flag = true;
    }

    score++;

    if (score % 3 == 0 && score % 5 == 0) {
        document.getElementById("demo").innerHTML = "Fizz Buzz";
    } else if (score % 3 == 0) {
        document.getElementById("demo").innerHTML = "Fizz";
    } else if (score % 5 == 0) {
        document.getElementById("demo").innerHTML = "Buzz";
    } else {
        document.getElementById("demo").innerHTML = score;
    }
    const dataToSend = {
        score: score
    };

    post("http://basic-web.dev.avc.web.usf.edu/" + user, dataToSend).then(function (response) {
        switch (response.status) {
            case 200:
                //User was updated successfully.
                //response.data will be the same as returned by get(), and should contain the updated data.
                score = response.data.score;
                break;
            case 201:
                //A new user was successfully created. Otherwise same as status 200.
                score = response.data.score;
                break;
            case 400:
                //Bad request. Most likely your data that you sent (in this case dataToSend) was formatted incorrectly, or you supplied a negative score value.
                //response.data will be: { Error: "error message" }
                document.getElementById("getUsername").innerHTML = "Server error. Try again later";
                //To alert the user of a server error, the information above will be printed as Welcome,Server error. Try again later
                console.error(response.data);
                break;
            case 500:
                //Something went wrong on the server, such as the database got deleted somehow. This should never happen.
                //response.data will be the same as status 400.
                document.getElementById("getUsername").innerHTML = "Server error. Try again later";
                //To alert the user of a server error, the information above will be printed as Welcome,Server error. Try again later
                console.error(response.data);
                break;
        }

    })

}
