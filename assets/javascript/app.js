$(document).ready(function($) {

// Initializing Firebase //IF having this on the main thread is deprecated... what should we do instead/how should we structure it?!
  	var config = {
	    apiKey: "AIzaSyBdDMt-PKYOgmpz4xIieOU17nx9l2eNRTQ",
	    authDomain: "train-scheduler-a47fb.firebaseapp.com",
	    databaseURL: "https://train-scheduler-a47fb.firebaseio.com",
	    projectId: "train-scheduler-a47fb",
	    storageBucket: "train-scheduler-a47fb.appspot.com",
	    messagingSenderId: "910917476946"
  	};
  	firebase.initializeApp(config);
  	var dataRef = firebase.database();

	//creation of clear button --> SOLVE THIS!!!!
	// var clearButton = $("<button>");
	// clearButton.addClass("clear");
	// clearButton.attr("type", "submit");
	// clearButton.text("Refresh");
	// $("#jumboHeader").append(clearButton); //display clear button

	//To enumberate train entry (by count).
  	var entryAmount = 0;

//Event Handler --> Whenever button pushed, data submitted/stored in firebase database!
	$("#addTrainButton").on("click", function() {
		event.preventDefault();
	
	////Keeping count of the entries, internally.
		entryAmount ++;
		console.log(entryAmount);

	////grabbing all data entries
		var trainName = $("#trainName-input").val().trim();
		var destination = $("#destination-input").val().trim();		
		
		var firstTrainT = moment($("#firstTimeMil-input").val().trim(), "HH:mm").subtract(1,"years").format("X"); //Moment.js REFERENCE: moment().format("ddd, hh");    
		console.log("firstTrainT = " + firstTrainT);

		var trainFreq = $("#frequency-input").val().trim(); //Why don't we need to convert this one as well?!
		console.log("trainFreq = " + trainFreq);


	//Moment.js VARs!!!! - Calculating additional Time Mechs
		var tRemainder = moment().diff(moment.unix(firstTrainT),"minutes") % trainFreq; //MUST REMEMBER TO USE "UNIX"!!
		var minAway = trainFreq - tRemainder;
		var nextTrn = moment().add(minAway, "m").format("HH:mm A"); //Look further into the "A"...
		
		console.log("The remainder is: " + tRemainder);
		console.log("Minutes until next train: " + minAway);
		console.log("Next Train will come at: " + nextTrn);

	////storing all data entires AS ONE OBJECT (for firebase database)
		var newTrain = {
			num: entryAmount,
			name: trainName,
			dest: destination,
			firstTrn: firstTrainT,
			freq: trainFreq,
			next: nextTrn,
			distance: minAway,
		};

	//UPLOAD to FireBase!!!!
		dataRef = firebase.database();
		dataRef.ref().push(newTrain);
		
		console.log("Train #" + entryAmount + "added to database.") //How can we store data taht itemized which train # this is...?

	//// BUG-CHECK: verify data-entry
		console.log(newTrain.num);
		console.log(newTrain.name);
		console.log(newTrain.dest);
		console.log(newTrain.firstTrn);
		console.log(newTrain.freq);
		console.log(newTrain.next)
		console.log(newTrain.distance)

	// Clear out the TRAIN INPUT form area
		$("#trainName-input").val("");
		$("#destination-input").val("");
		$("#firstTimeMil-input").val("");
		$("#frequency-input").val("");	
	});

//Event Handler --> Whenever data submitted and uploaded into FireBase, find eah value, consolelot it and place in into the first display table (area).
	dataRef.ref().on("child_added", function(childSnapshot) { ///REVIEW what the "prevChildKey" accomplishes....
		event.preventDefault();

		//Because the data entry poitns are stored as Separate VALUES on an Obect ( the one we created earlier), we must esablish a new set of vars to be used for tefercing these indivudal values
		var entryAmount = childSnapshot.val().num;
		var trainName = childSnapshot.val().name;
		var destination = childSnapshot.val().dest;
		var firstTrainT = childSnapshot.val().firstTrn;
		var trainFreq = childSnapshot.val().freq;
		var nextTrn = childSnapshot.val().next;
		var minAway = childSnapshot.val().distance;

		console.log(entryAmount);
		console.log(trainName);
		console.log(destination);
		console.log(firstTrainT);
		console.log(trainFreq);
		console.log(nextTrn);
		console.log(minAway);

		$("#trainT >tbody").append("<tr><td>" + entryAmount + "</td><td>" + trainName +
		 "</td><td>" + destination + "</td><td>" + trainFreq + "</td><td>" + nextTrn + "</td><td>" + minAway + "</td></tr>");
		// $("#num").append(entryAmount); Rethink this approach...
		// $("#name").append(trainName);
		// $("#dest").append(destination);
		// $("#freq").append(trainFreq);
		// $("#firstTrn").append(nextTrn);
		// $("#nextTrn").append(minAway);		

	}, function(errorObject){
		console.log("Error to handle: " + errorObject.code);
	});

// Clear all.. work out the kinks...
	$(document).on("click", ".clear", function (){
		console.log("You clicked refresh!");
	// Clear out the TRAIN DISPLAY form AREA		
		
		//clear all the content in firebase database
		dataRef.ref().delete("child"); 
		console.log("You're refeshing!")
		
		// clear all the displayed info in the train section
		$("#num").empty(); 
		$("#name").empty();
		$("#dest").empty();
		$("#freq").empty();
		$("#firstTrn").empty();
		$("#nextTrn").empty();

	// Clear out the TRAIN INPUT form area
		$("#trainName-input").val("");
		$("#destination-input").val("");
		$("#firstTimeMil-input").val("");
		$("#frequency-input").val("");	
	});

}); //END OF JS FILE