$(document).ready(function () {

    // Initial array of Artists
    var bands = ["Katy Perry", "Imagine Dragons", "Taylor Swift", "Bruno Mars", "Ariana Grande", "Britney Spears", "Nirvana"];

    // displayBandGifs function re-renders the HTML to display the appropriate content
    function displayBandGifs(temp) {
        var band;
        if (typeof temp === "string") {
            band = temp;
        }
        else {
            band = $(temp).attr("data-name");
        } 

        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + band + "&api_key=SsrRbIxMmMqnTCVESExmA4EMXB1liW7H&limit=10";


        // Creating an AJAX call for the specific band button being clicked to display some gifs
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //  console.log(response);

            // Storing the  gif rating data
            var results = response.data;

            for (var i = 0; i < results.length; i++) {

                var gifDiv = $("<div>");
                var rating = results[i].rating;
                var p = $("<p>").text("Rating: " + rating);
                var artistGif = $("<img>");
                artistGif.attr("src", results[i].images.fixed_height_still.url);
                artistGif.attr("data-still", results[i].images.fixed_height_still.url);
                artistGif.attr("data-animate", results[i].images.fixed_height.url);
                artistGif.attr("data-state", "still");
                artistGif.addClass("gif");

                //Prepend gifDiv variable with  p and artistGif variables
                gifDiv.prepend(p);
                gifDiv.prepend(artistGif);

                $("#bands-view").prepend(gifDiv);
            }
        });
    }


    // Function for displaying artist info
    function searchBandsInTown(temp) {
        var band;
        if (typeof temp === "string") {
            band = temp;
        }
        else {
            band = $(temp).attr("data-name");
        }       

        var queryURL = "https://rest.bandsintown.com/artists/" + band + "?app_id=99ba5a2274cf279df970ff5b9976febf";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            

            for (var i = 0; i < bands.length; i++) {

                var artistName = $("<h1>").text(response.name);
                var artistURL = $("<a>").attr("href", response.url).append(artistName);
                var artistImage = $("<img>").attr("src", response.thumb_url);
                var trackerCount = $("<h2>").text(numberWithCommas(response.tracker_count) + " fans tracking this artist");
                var upcomingEvents = $("<h2>").text(response.upcoming_event_count + " upcoming events");
                var goToArtist = $("<a>").attr("href", response.url).text("See Tour Dates");

                // Empty the contents of the artist-div, append the new artist content
                $("#artist-div").empty();
                $("#artist-div").append(artistURL, artistImage, trackerCount, upcomingEvents, goToArtist);
            }
        });
    }

    //Format number with commas
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


    // Function for displaying artist gifs
    function renderButtons() {

        // Deleting the bands prior to adding new bands
        // (this is necessary otherwise you will have repeat buttons)
        $("#buttons-view").empty();

        // Looping through the array of bands
        for (var i = 0; i < bands.length; i++) {

            // Then dynamicaly generating buttons for each band in the array
            // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
            // Adding a class of movie-btn to our button
            // Adding a data-attribute
            // Providing the initial button text
            var a = $("<button>");
            a.addClass("band-btn");
            a.addClass("btn btn-light");
            a.attr("data-name", bands[i]);
            a.text(bands[i]);

            // Create a button with a X inside to eliminate item
            var eliminate = $("<button>");
            eliminate.attr("data-to-do", i);
            eliminate.addClass("checkbox");
            eliminate.addClass("btn btn-light");
            eliminate.text("✘");

            //Create a variable that holds a blank space
            var space = (" ");

            // Adding the button to the buttons-view div
            $("#buttons-view").append(eliminate);
            $("#buttons-view").append(a);
            $("#buttons-view").append(space);
        }
    }


    //CLICK EVENTS
    // This function handles events where a band button is clicked
    $("#add-band").on("click", function (event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        var band = $("#band-input").val().trim();

        // Adding movie from the textbox to our array
        bands.push(band);

        // Calling renderButtons which handles the processing of our bands array
        renderButtons();
    });

    
    // Adding a click event listener to all elements with a class of "band-btn"
    $(document).on("click", ".band-btn", function(){
        displayBandGifs(this);
    });   
    $(document).on("click", ".band-btn", function(){
        searchBandsInTown(this);
    });

    $("#search").on("click", function(event) {
        // Preventing the button from trying to submit the form
        event.preventDefault();
        // Storing the artist name
        var inputArtist = $("#band-input").val().trim();
    
        // Running the searchBandsInTown function(passing in the artist as an argument)
        searchBandsInTown(inputArtist);
        displayBandGifs(inputArtist);
    });
    

    $(document).on("click", ".checkbox", function () {
        // Get the number of the button from its data attribute and hold in a variable called  toDoNumber.
        var toDoNumber = $(this).attr("data-to-do");

        // Deletes the item marked for deletion
        bands.splice(toDoNumber, 1);
        renderButtons();
    });


    $("#bands-view").on("mouseover", ".gif", function() {
        // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
        var state = $(this).attr("data-state");
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "still") {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
        } else {
          $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-state", "still");
        }
    });

    $("#clear").on("click", function(event) {
        $("#artist-div").empty();
        $("#bands-view").empty();
    });

    // Calling the renderButtons function to display the intial buttons
    renderButtons();

});