var status = "standing";
var backgroud = document.getElementById("backgroud");
var foxObject = document.getElementById("foxObject");
var foxObjectLeft = getComputedStyle(foxObject).left.replace("px", "");
var barrierStatus = "ok";

document.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
        case 32: {
            startGame();
            break;
        }
        case 27: {
            endGame();
            break;
        }
    }
});

function random(from, to) {
    return Math.floor(Math.random() * to) + from;
}

function moveObject(objectNumber) {
    var moveObject = setInterval(function () {
        var element = document.querySelector('#objectNumber' + objectNumber)
        if (status === "standing" || !element) {
            clearInterval(moveObject);
            return;
        }

        var leftValue = getComputedStyle(element).left.replace("px", "");
        leftValue = leftValue - 1;
        document.getElementById("objectNumber" + objectNumber).style.left = (leftValue) + "px";
        var objectDiffFox = leftValue - foxObjectLeft;
        if (objectDiffFox > 0 && objectDiffFox < 150) {
            console.log("is not a jump");
            if (status !== "jumping") {
                clearInterval(moveObject);
                endGame();
            }
        }
        if (leftValue <= -100) {
            clearInterval(moveObject);
            document.getElementById("objectNumber" + objectNumber).remove();
        }
    }, 5.5);
}

var objectNumber = 0;
function ramdomObject() {
    let createObject = setTimeout(function () {
        objectNumber++;

        let ele = document.getElementById("backgroud");

        console.log(objectNumber);
        let imgNode = document.createElement('img');
        ele.appendChild(imgNode);
        imgNode.setAttribute(
            "id",
            "objectNumber" + objectNumber
        );
        imgNode.setAttribute(
            "class",
            "barrier-object"
        );
        imgNode.setAttribute(
            "src",
            'images/objects/object' + random(1, 11) + '.png'
        );
        imgNode.setAttribute(
            "style",
            "left: 100%"
        );

        if (status !== "standing") {
            moveObject(objectNumber);
            if (barrierStatus === "ok") {
                barrierStatus = "block";
                ramdomObject();
                setTimeout(function () {
                    barrierStatus = "ok";
                }, 1500);
            }

        }
        return;

    }, random(1500, 3000));
}

function endGame() {
    $('#gameOverModel').modal('show');
    $("#gameOverSound")[0].play();
    $("#backgroundMusic")[0].pause();
    status = "standing";
    backgroud.classList.remove("backgroud-running");
    foxObject.classList.add("fox-standing");
    foxObject.classList.remove("fox-running");
}

function removeObject() {
    var ele = document.querySelector(".barrier-object");
    if (ele) {
        document.querySelectorAll(".barrier-object").forEach(e => e.remove());
    }
}

function startGame() {
    switch (status) {
        case "standing": {
            status = "running";
            removeObject();
            // document.getElementById();
            $("#backgroundMusic")[0].play();
            backgroud.classList.add("backgroud-running");
            foxObject.classList.remove("fox-standing");
            foxObject.classList.add("fox-running");
            ramdomObject();

            break;
        }
        case "running": {
            foxObject.style.bottom = "150px";
            status = "jumping";
            setTimeout(function () {
                foxObject.style.bottom = "20px";
                setTimeout(function () {
                    status = "running";
                }, 700);
            }, 700);
            break;
        }
    }
}

/**
 * Facebook Login
 * 
 * */

var foxInfo = {
    name: "Sammy",
    hp: "",
    level: ""
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '2658551874377386',
        cookie: true,
        xfbml: true,
        version: 'v6.0'
    });

    FB.AppEvents.logPageView();

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
    FB.getLoginStatus((response) => {
        let { accessToken } = response.authResponse;
        $.get("https://graph.facebook.com/v6.0/me?fields=name&access_token=" + accessToken, function (profileResponse) {
            let { name } = profileResponse;
            foxInfo.name = name;
            setFoxName();
        })
    });
}

function setFoxName() {
    $("#foxObject").tooltip("dispose").tooltip({
        title: foxInfo.name,
        trigger: "manual"
    }).tooltip('show');
}

$(document).ready(function () {
    setFoxName();
});
