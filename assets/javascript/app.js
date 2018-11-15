$(document).ready(function() {

// Initial array of Artists
var bands = ["Katy Perry", "Imagine Dragons", "Taylor Swift", "Bruno Mars", "Ariana Grande", "The Strokes", "Britney Spears", "Nirvana"];

// displayBandGifs function re-renders the HTML to display the appropriate content
function displayBandGifs() {

    var band = $(this).attr("data-name");
    
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + band + "&api_key=SsrRbIxMmMqnTCVESExmA4EMXB1liW7H&limit=10";
    

    // Creating an AJAX call for the specific band button being clicked to display some gifs
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
     console.log(response);

      // Storing the  gif rating data
      var results = response.data;

      for (var i = 0; i < results.length; i++) {
        //Declaro una variable nueva que me cree un Div
        var gifDiv = $("<div>");

        //results[i] es el nombre de la variable que ya accesó a data, despues con el punto . jalo los otros elementos del api (rating, image)
        var rating = results[i].rating;

        var p = $("<p>").text("Rating: " + rating);

        var personImage = $("<img>");
        personImage.attr("src", results[i].images.fixed_height.url);
        
        //Agregale a la variable gifDiv el rating y la imagen dentro del mismo div
        gifDiv.prepend(p);
        gifDiv.prepend(personImage);

        $("#bands-view").prepend(gifDiv);
      }
    });

  }

  // Function for displaying band data
  function renderButtons() {

    // Deleting the movies prior to adding new bands
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of bands
    for (var i = 0; i < bands.length; i++) {

      // Then dynamicaly generating buttons for each band in the array
      // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
      var a = $("<button>");
      // Adding a class of movie-btn to our button
      a.addClass("band-btn");
      // Adding a data-attribute
      a.attr("data-name", bands[i]);
      // Providing the initial button text
      a.text(bands[i]);
    
      // Create a button with a X inside
      var eliminate = $("<button>");    
      eliminate.attr("data-to-do", i);
      eliminate.addClass("checkbox");
      eliminate.text("X");

      //Create a var that holds a blank space
      var space = (" ");

      // Adding the button to the buttons-view div
      $("#buttons-view").append(eliminate);
      $("#buttons-view").append(a);
      $("#buttons-view").append(space);
    }
  }

  // This function handles events where a band button is clicked
  $("#add-band").on("click", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var band = $("#band-input").val().trim();

    // Adding movie from the textbox to our array
    bands.push(band);

    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
  });

  // Adding a click event listener to all elements with a class of "band-btn"
  $(document).on("click", ".band-btn", displayBandGifs);

  $(document).on("click", ".checkbox", function() {
    // Get the number of the button from its data attribute and hold in a variable called  toDoNumber.
    var toDoNumber = $(this).attr("data-to-do");

    // Deletes the item marked for deletion
    bands.splice(toDoNumber, 1);
    renderButtons();
  });

  // Calling the renderButtons function to display the intial buttons
  renderButtons();

});