// console.log("Entered")
var author = document.getElementById("name")           //acccessing name field using it's id
var caption = document.getElementById("caption")       //accessing caption field using it's id
var memeurl = document.getElementById("memeurl")       //accessing memeurl field using it's id
// var send = document.getElementById("send")
var send = document.getElementById("button-addon2")    //accessing the submit button using it's id
var feedsection = document.getElementById("feed")      //accessing the meme-feed section using it's id
var nc = document.getElementById("namecheck")          //accessing the name-check para using it's id
var cc = document.getElementById("captioncheck")       // accessing the caption-field using it's id
var uc = document.getElementById("urlcheck")           //accessing the url-field using it's id


// This function helps to interact with db and flask serever to send or update data in db
function send_data(k, type) {
    //classifying if the request is post or patch request type
    if (type == "post") {
        //If this is a post then we sent post request to flask serever
        $.post("/memes", k)
    }
    //if it is of patch type
    else {
        var patch = k
        /*
          Accessing id field in localstorage 
          of browser,id belongs to card or meme of 
          which the user clicks the edit button
         */
        var ide = window.localStorage.getItem("id")
        /*
          After the value of id is stored the id variable
          is removed from the localstorage 
         */
        window.localStorage.removeItem('id')
        /*
          Sending an ajax 'PATCH' request type to
          update the url,caption of a meme, which user
          has edited 
         */
        $.ajax({
            type: 'PATCH',
            url: '/memes/' + ide,
            data: JSON.stringify(patch),
            processData: false,
            contentType: 'application/merge-patch+json',
        });
    }
    /*As the content need to be updated  we call appending_new() to view
      updated meme card*/
    appending_new()
}

/* This event is initiated when the user clicks on submit button in UI*/
send.addEventListener("click", function () {
    /* Checking if the Name field is empty */
    if (author.value != '') {
        /* If name field is not empty then we make the 
           display of custom warning of name field as none */
        nc.style.display = "none"
        /* Checking if the Caption field is empty */
        if (caption.value != '') {
            /* If caption field is not empty then we make the 
               display of custom warning of name field as none */
            cc.style.display = "none"
            /* Checking if the Url field is empty */
            if (memeurl.value != '') {
                /* If Url field is not empty then we make the 
                   display of custom warning of name field as none */
                uc.style.display = "none"
                /* As the name,caption,url fields are not empty
                   we store their data in a variable to send it to db
                 */
                var k = {
                    "name": author.value,
                    "url": memeurl.value,
                    "caption": caption.value
                };
                /*
                  After storing data we can empty
                  the name,caption,memeurl values 
                 */
                author.value = ''
                caption.value = ''
                memeurl.value = ''

                /*
                  This check here differentiates it the request is 
                  'POST' or 'PATCH' i.e if the request is 'PATCH'
                  as we shouldn't edit the name field we set it's 
                  readonly property to true, if it is a 'POST' request
                  then readOnly property of name field is false.So based on
                  this we classify if request is 'POST' or 'PATCH'.If 
                        
                        - readOnly Property value: false ----'POST'
                        - readOnly Property value: true  ----'PATCH'
                 */
                if (author.readOnly == false) {
                    send_data(k, "post")
                }
                else {
                    author.readOnly = false
                    send_data(k, "patch")
                }
            }
            else {
                /* If MemeUrl field is empty then we make the 
                   display of custom warning of Url field to block 
               */
                uc.style.display = "block"
            }
        }
        else {
            /* If Caption field is empty then we make the 
                display of custom warning of Caption field to block 
            */
            cc.style.display = "block"
        }
    }
    else {
        /* If Name field is empty then we make the 
           display of custom warning of Name field to block 
        */
        nc.style.display = "block"
    }
})

/*
  We are calling the appending_new() for every 
  2 sec to update the UI  
*/
const interval = setInterval(function () {
    appending_new()

}, 2000);

/*
  We are clear the console incase of any checkpoints are displayed 
*/
const clearing = setInterval(() => {
    console.clear();
}, 100);

/* 
  This function is called when user clicks on edit button of a card 
   then id of that card is passed to this function
*/
function edit_meme_data(ide) {
    /*
      Data of that Id is retrieved from db to
      front end using /memes/ api using a 'GET'
      request
     */
    $.get("/memes/" + ide, function (data, status) {
        var data = JSON.parse(data)
        /*
          Data from that 'GET' request is parsed using JSON
          to an Object and the name,caption,url values are stored
          in respective variables
        */
        author.value = data["name"]
        caption.value = data["caption"]
        memeurl.value = data["url"]
        /*
          Setting the name field to readonly 
          so that it can't be edited further
          by setting it's value to true
         */
        author.readOnly = true;
        /*
          Storing the id of that particular
          edit request using localStorage
          for future purpose
        */
        window.localStorage.setItem("id", ide)
    })
}
/*
<div class="card" style="width: 18rem;">
            <img src="https://api.memegen.link/images/buzz/memes/memes_everywhere.png" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the
                    card's
                    content.</p>
                <button class="btn btn-primary">Go somewhere</button>
            </div>
</div>
 */

/* 
  appending_new function is used for dynamically updating UI
  by appending new cards of Memes to the feed section using
  "DOM"
*/

function appending_new() {
    /* 
        Data is requested from /memes/ api  as a 
       'GET' request
    */
    $.get("/memes/", function (data, status) {
        /*
           Data retrieved from 'GET' request is 
           stored parsed using JSON
        */
        var db = JSON.parse(data)
        /*
           For every iteration the feed section
           is emptied for updated data to be displayed
         */
        feedsection.innerHTML = ''
        /*
          As newly inserted data need to be in the top
          we reverse the data
        */
        db.reverse();
        /*
          Looping through the whole data and using DOM
          to dynamically create card 
        */
        for (var i = 0; i < data.length; i++) {
            //Creating a div tag using DOM createElement method
            var div1 = document.createElement("div")
            //Using className property to set value to that div
            div1.className = "card"
            //Using style width property to set the width size
            div1.style.width = "18rem"
            //Creating a image tag using DOM createElement method
            var image1 = document.createElement("img")
            //Using src property to set image url to that image tag taken from db
            image1.src = db[i].url
            //Using className property to set value to that div
            image1.className = "card-img-top"
            //Creating a div tag using DOM createElement method
            var div2 = document.createElement("div")
            //Using className property to set value to that div
            div2.className = "card-body"
            //Creating a h5 tag using DOM createElement method
            var h5_tag = document.createElement("h5")
            //Using className property to set value to that h5
            h5_tag.className = "card-title"
            //Using innerHTML attribute to set it to Caption from db
            h5_tag.innerHTML = db[i].caption
            //Creating a paragraph tag using DOM createElement method
            var para1 = document.createElement("p")
            //Using className property to set value to that para1
            para1.className = "card-text"
            //Using className property to assign innerHTML attribute to name value taken from db
            para1.innerHTML = db[i].name
            //Creating a button tag using DOM createElement method
            var edit = document.createElement("button")
            //Creating a span tag using DOM createElement method
            var spant = document.createElement("span")
            // var it = document.createElement("i")
            // it.className = "fas fa-user-edit"
            // spant.appendChild(it)
            // edit.appendChild(spant)
            //Using className property to set value to that button
            edit.className = "btn btn-primary"
            //Using innerHTML attribute to name of button as 'Edit'
            edit.innerHTML = "Edit"
            //Using id attribute to assign value = the id of that meme
            edit.id = db[i].id
            //Using onclick attribute to assign a function edit_meme_data(if of that Meme-card)
            edit.onclick = function () { edit_meme_data(this.id) }
            //Using innerHTML attribute to assign value = time of Memecard creation retrieved from db
            spant.innerHTML = db[i].time
            //Using className property to set value to memetime class
            spant.className = "memetime"
            //appending the image_tag to div1
            div1.appendChild(image1)
            //appending h5_tag to div2 
            div2.appendChild(h5_tag)
            //appending para1 to div2
            div2.appendChild(para1)
            //appending edit to div2
            div2.appendChild(edit)
            //appending spant to div2
            div2.appendChild(spant)
            //appending div2 to div1
            div1.appendChild(div2)
            //finally appending div1 to feedsection
            feedsection.appendChild(div1)
        }
    })

}





