// Initialize Firebase
var config = {
    apiKey: "AIzaSyBtUvb6qAALlezX0e3RVB_kuHsR2V8Ukyw",
    authDomain: "train-scheduler-ce465.firebaseapp.com",
    databaseURL: "https://train-scheduler-ce465.firebaseio.com",
    projectId: "train-scheduler-ce465",
    storageBucket: "train-scheduler-ce465.appspot.com",
    messagingSenderId: "434037792484"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-Train-btn").on("click", function (event) {
    event.preventDefault();

    // vars to grab user input
    var trainName = $("#Train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainTime = moment($("#Time-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#Frequency-input").val().trim();

    //var holds new train data
    var newtrain = {
        Train: trainName,
        destination: trainDestination,
        firstTrainTime: trainTime,
        Frequency: trainFrequency
    };

    // Uploads Train data to the database
    database.ref().push(newtrain);

    // Logs everything to console
    console.log(newtrain.Train);
    console.log(newtrain.destination);
    console.log(newtrain.firstTrainTime);
    console.log(newtrain.Frequency);

    //pop up on new train submittion
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#Train-name-input").val("");
    $("#destination-input").val("");
    $("#Time-input").val("");
    $("#Frequency-input").val("");

});

// 3. Create Firebase event for adding Train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    //vars store everything from Firebase..
    var trainName = childSnapshot.val().Train;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().firstTrainTime;
    var trainFrequency = childSnapshot.val().Frequency;

    // Train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(trainFrequency);

    //var for first train time dating a year previous to make sure its always in the past
    var trainTimeChange = moment(trainTime, "HH:mm").subtract(1, "years");

    //var for current time to show in console log
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    //var for difference in time first train to current
    var timeDiff = moment().diff(moment(trainTimeChange), "minutes");

    //var for whats left between first and current with frequency
    var remainder = timeDiff % trainFrequency;

    //var for minutes left by subtracting remainder from Frequency
    var minsArrival = trainFrequency - remainder;

    //var for next train by addind frequency to current time
    var nextArrival = moment().add(minsArrival, "minutes");

    //var for time format of next arrival
    var timeFormat = moment(nextArrival).format("HH:mm");

    // Create the new row and append to table
    var newRow = $("<tr>").append(
        //create table data for each line
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(timeFormat),
        $("<td>").text(minsArrival)
    );
    $("#Train-table > tbody").append(newRow)

});
