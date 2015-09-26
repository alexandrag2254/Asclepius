var socrates = angular.module('socrates', []);



//controller///////////////////////////////////////////////////////////////////////////////////

//stocks controller
socrates.controller('socratesController', function($scope, witFactory, socratesFactory){


		/////////WIT SPEECH TO TEXT//////////////////////////////////////////

      var mic = new Wit.Microphone(document.getElementById("microphone"));

      var info = function (msg) {
        document.getElementById("info").innerHTML = msg;
      };

      var error = function (msg) {
        document.getElementById("error").innerHTML = msg;
      };

      mic.onready = function () {
        info("Microphone is ready to record");
      };

      mic.onaudiostart = function () {
        info("Recording started");
        error("");
      };

      mic.onaudioend = function () {
        info("Recording stopped, processing started");
      };

      mic.onresult = function (intent, entities) {

        var r = kv("intent", intent);

        for (var k in entities) {
          var e = entities[k];

          if (!(e instanceof Array)) {
            r += kv(k, e.value);
          } else {
            for (var i = 0; i < e.length; i++) {
              r += kv(k, e[i].value);
            }
          }
        }
        document.getElementById("result").innerHTML = r;

        	
        ////after getting targeted intent-----------------------------------------------------

        if (intent == undefined) {
        	document.getElementById("error").innerHTML = "Please repeat question";

        	var msg = new SpeechSynthesisUtterance();
				var voices = window.speechSynthesis.getVoices();
	    		msg.voice = voices[10]; // Note: some voices don't support altering params
			    msg.voiceURI = 'native';
			    msg.volume = 1; // 0 to 1
			    msg.rate = 0.8; // 0.1 to 10
			    msg.pitch = 1; //0 to 2
			    msg.text = "Please reqeat your question again";
			    msg.lang = 'en-US';

			    msg.onend = function(e) {
			    	time = Math.ceil(event.elapsedTime / 100000000);
			    	console.log('Finished in ' + time + ' seconds.');
			    	$scope.answer_length = time;
			    	// console.log("yes")

			    };

			    $scope.answer = answer;
	    		speechSynthesis.speak(msg);

        } else {

        	$('#replay_form').show();

        	console.log("1", intent)
        	witFactory.askingQuestion(intent, function(answer, graph_points){

				console.log("back in wit", answer);
				console.log("graphpoints", graph_points);

//////////////////////Reading out answer ///////////////////////////////

				var msg = new SpeechSynthesisUtterance();
				var voices = window.speechSynthesis.getVoices();
	    		msg.voice = voices[10]; // Note: some voices don't support altering params
			    msg.voiceURI = 'native';
			    msg.volume = 1; // 0 to 1
			    msg.rate = 0.8; // 0.1 to 10
			    msg.pitch = 1; //0 to 2
			    msg.text = answer;
			    msg.lang = 'en-US';

			    $scope.answer = answer;
	    		speechSynthesis.speak(msg);

	    		msg.onend = function(e) {

			    	time = Math.ceil(event.elapsedTime / 100000000);
			    	console.log('Finished in ' + time + ' seconds.');
			    	$scope.answer_length = time;
			    	// console.log("yes")

			    };

////////////////////////////MAKING GRAPHS/////////////////////////////////////////////////////////////


			if (intent == "blood_glucose"){
				graph_points = []

				graph_points.push(200, 250, 360.9, 240.5, 280.2, 310.5, 350.2)
					average = [227, 227, 227, 227, 227, 227, 227]


					//////////////////MAKE GRAPH-----------------------------------------------

				$(function () {
				    $('#container').highcharts({
				        title: {
				            text: 'Blood Glucose Readings',
				            x: -20 //center
				        },
				        // subtitle: {
				        //     text: 'Source: WorldClimate.com',
				        //     x: -20
				        // },
				        xAxis: {
				            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
				                'Sunday']
				        },
				        yAxis: {
				            title: {
				                text: 'Blood Glucose'
				            },
				            plotLines: [{
				                value: 0,
				                width: 1,
				                color: '#808080'
				            }]
				        },

				        legend: {
				            layout: 'vertical',
				            align: 'right',
				            verticalAlign: 'middle',
				            borderWidth: 0
				        },

				        series: [{
				            name: 'Daily Readings',
				            data: graph_points
				        },{
				            name: 'Average Trend',
				            data: average
				        }]
				    });
				});


			} else {

				graph_points = [];
				graph_points.push(120, 155, 179, 130, 115, 140, 160)
					diastolic = [ 60, 88, 90, 95, 89, 75, 80]


						//////////////////MAKE GRAPH-----------------------------------------------

				$(function () {
				    $('#container').highcharts({
				        title: {
				            text: 'Blood Pressure Readings',
				            x: -20 //center
				        },
				        // subtitle: {
				        //     text: 'Source: WorldClimate.com',
				        //     x: -20
				        // },
				        xAxis: {
				            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
				                'Sunday']
				        },
				        yAxis: {
				            title: {
				                text: 'Blood Pressure'
				            },
				            plotLines: [{
				                value: 0,
				                width: 1,
				                color: '#808080'
				            }]
				        },

				        legend: {
				            layout: 'vertical',
				            align: 'right',
				            verticalAlign: 'middle',
				            borderWidth: 0
				        },

				        series: [{
				            name: 'Systolic Pressure',
				            data: graph_points
				        },{
				            name: 'Diastolic Pressure',
				            data: diastolic
				        }]
				    });
				});
			}




			});

        }



      };

      mic.onerror = function (err) {
        error("Error: " + err);
      };

      mic.onconnecting = function () {
        info("Microphone is connecting");
      };

      mic.ondisconnected = function () {
        info("Microphone is not connected");
      };

      mic.connect("JRUKMVHHUSVEWF3U242ZNMYJEAXDI3YH");
      // mic.start();
      // mic.stop();

      function kv (k, v) {

        if (toString.call(v) !== "[object String]") {
          v = JSON.stringify(v);
        }

        return k + "=" + v + "\n";

      }


  ////////////////////////////////////////////////////////////////////////


	$scope.Submit = function(){

		console.log("question", $scope.question);
		console.log("intent", $scope.intent);

		if ($scope.question == "" || $scope.question == undefined || $scope.question == " "){
			$scope.errors = "Please enter a question in the text field below";
			return false;
		} else {

		        $('#replay_form').show();

			socratesFactory.askingQuestion($scope.question, function(answer, graph_points, intent){

				console.log("back in controller", answer);
				console.log("graphpoints", graph_points);
				graph_points = [];

				if ( answer.slice(0, 12) == "Your current"){ //this is for blood sugar
					graph_points.push(200, 250, 360.9, 240.5, 280.2, 310.5, 350.2)
					average = [227, 227, 227, 227, 227, 227, 227]


					//////////////////MAKE GRAPH-----------------------------------------------

				$(function () {
				    $('#container').highcharts({
				        title: {
				            text: 'Blood Glucose Readings',
				            x: -20 //center
				        },
				        // subtitle: {
				        //     text: 'Source: WorldClimate.com',
				        //     x: -20
				        // },
				        xAxis: {
				            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
				                'Sunday']
				        },
				        yAxis: {
				            title: {
				                text: 'Blood Glucose'
				            },
				            plotLines: [{
				                value: 0,
				                width: 1,
				                color: '#808080'
				            }]
				        },

				        legend: {
				            layout: 'vertical',
				            align: 'right',
				            verticalAlign: 'middle',
				            borderWidth: 0
				        },

				        series: [{
				            name: 'Daily Readings',
				            data: graph_points
				        },{
				            name: 'Average Trend',
				            data: average
				        }]
				    });
				});


				} else { //this is for blood pressure
					graph_points.push(120, 155, 179, 130, 115, 140, 160)
					diastolic = [ 60, 88, 90, 95, 89, 75, 80]


						//////////////////MAKE GRAPH-----------------------------------------------

				$(function () {
				    $('#container').highcharts({
				        title: {
				            text: 'Blood Pressure Readings',
				            x: -20 //center
				        },
				        // subtitle: {
				        //     text: 'Source: WorldClimate.com',
				        //     x: -20
				        // },
				        xAxis: {
				            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
				                'Sunday']
				        },
				        yAxis: {
				            title: {
				                text: 'Blood Pressure'
				            },
				            plotLines: [{
				                value: 0,
				                width: 1,
				                color: '#808080'
				            }]
				        },

				        legend: {
				            layout: 'vertical',
				            align: 'right',
				            verticalAlign: 'middle',
				            borderWidth: 0
				        },

				        series: [{
				            name: 'Systolic Pressure',
				            data: graph_points
				        },{
				            name: 'Diastolic Pressure',
				            data: diastolic
				        }]
				    });
				});



				}	

		


		//////////////////////Reading out answer ///////////////////////////////

				var msg = new SpeechSynthesisUtterance();
				var voices = window.speechSynthesis.getVoices();
	    		msg.voice = voices[10]; // Note: some voices don't support altering params
			    msg.voiceURI = 'native';
			    msg.volume = 1; // 0 to 1
			    msg.rate = 0.8; // 0.1 to 10
			    msg.pitch = 1; //0 to 2
			    msg.text = answer;
			    msg.lang = 'en-US';

			    // console.log("hello")
			    $scope.answer = answer;
	    		speechSynthesis.speak(msg);

	    		msg.onend = function(e) {

			    	time = Math.ceil(event.elapsedTime / 100000000);
			    	console.log('Finished in ' + time + ' seconds.');
			    	$scope.answer_length = time;
			    	console.log("yes")

			    };

/////////////////////////////////////////////////////////////////////////////////////////


			});

			$scope.errors = "";
		}

	}


	$scope.Replay = function(){
		console.log("time", $scope.replay_time);
		console.log($scope.answer_length);
		console.log($scope.answer);
		// console.log($scope)

		answer = $scope.answer.split(" ");
		for(var i=0; i<answer.length;i++){
			if(answer[i] == "," || answer[i] =="."){
				answer.splice(i, 1);
			}
		}

		answer_length = answer.length;
		//averaging 2 words per second--------------------------
		number_of_words = $scope.replay_time*2
		console.log(number_of_words);

		//cut answer into peices	
		replay_answer = [];
		for(var i=number_of_words; i<answer.length; i++){
			replay_answer.push(answer[i]);
		}

		replay_answer = replay_answer.join(" ");

		console.log(replay_answer);

		//////////////////////Reading out answer again with selected time ///////////////////////////////

				var msg = new SpeechSynthesisUtterance();
				var voices = window.speechSynthesis.getVoices();
	    		msg.voice = voices[10]; // Note: some voices don't support altering params
			    msg.voiceURI = 'native';
			    msg.volume = 1; // 0 to 1
			    msg.rate = 0.8; // 0.1 to 10
			    msg.pitch = 1; //0 to 2
			    msg.text = replay_answer;
			    msg.lang = 'en-US';

	    		speechSynthesis.speak(msg);

/////////////////////////////////////////////////////////////////////////////////////////

	}

});
// end of controller


//factories ///////////////////////////////////////////////////////////////////////////////////

//socratse Factory
socrates.factory('socratesFactory', function($http){
	var factory = {};

	factory.askingQuestion = function(info, callback){

		console.log("info", info);

		array = info.question.split(" ");

		console.log(array);

		for(var i=0; i<array.length;i++){
			if (array[i] == "pressure" || array[i] == "blood"){
				//hard coded for now for the purposes of the assignment
				var answer = "Your average blood pressure this past week was at an average of 120 over 70 with a high of 179 over 80 and a low of 115 over 60, the graphical representation is below. Based on these numbers, it's recommended to drink plenty of water to maintain steady blood pressure and exercise at least once a day to keep blood vessels healthy";

				graph_points = [] //which come from fitbit api
				split = answer.split(" ");
				for(var i=0; i<split.length; i++){
					if(split[i][0] == "1" || split[i][0] == "2" || split[i][0] == "3" || split[i][0] == "4" || split[i][0] == "5" || split[i][0] == "6" || split[i][0] == "7" || split[i][0] == "8" || split[i][0] == "9" || split[i][0] == "0"){
						graph_points.push(split[i]);
					}
				}

				// ------------- MAke an API request to add to the graph points and dates




			} else if (array[i] == "glucose" || array[i] == "sugar"){
				answer = "Your current blood sugar is 200 . Your blood pressure has been elevated recently in the last week at an average of 250 . It is recommended to monitor your diet and avoid high sugar foods . Seek foods such as veggies and grains";

				graph_points = [] //which come from api

				split = answer.split(" ");
				for(var i=0; i<split.length; i++){
					if(split[i][0] == "1" || split[i][0] == "2" || split[i][0] == "3" || split[i][0] == "4" || split[i][0] == "5" || split[i][0] == "6" || split[i][0] == "7" || split[i][0] == "8" || split[i][0] == "9" || split[i][0] == "0"){
						graph_points.push(split[i]);
					}
				}

				// ------------- MAke an API request to add to the graph points and dates 

			}
		}

		callback(answer, graph_points);
	
	};

	return factory;
});




socrates.factory('witFactory', function($http){
	var factory = {};

	factory.askingQuestion = function(intent, callback){
		
		console.log("intent", intent);

			if (intent == "blood_pressure"){
				//hard coded for now for the purposes of the assignment
				var answer = "Your average blood pressure this past week was at an average of 120 over 70 with a high of 179 over 80 and a low of 115 over 60, the graphical representation is below. Based on these numbers it's recommended to drink plenty of water to maintain steady blood pressure and exercise at least once a day to keep blood vessels healthy";

				graph_points = [] //which come from fitbit api

				split = answer.split(" ");
				for(var i=0; i<split.length; i++){
					if(split[i][0] == "1" || split[i][0] == "2" || split[i][0] == "3" || split[i][0] == "4" || split[i][0] == "5" || split[i][0] == "6" || split[i][0] == "7" || split[i][0] == "8" || split[i][0] == "9" || split[i][0] == "0"){
						graph_points.push(split[i]);
					}
				}

				// ------------- MAke an API request to add to the graph points and dates 

			} else if ( intent == "blood_glucose"){
				answer = "Your current blood sugar is 200 . Your blood pressure has been elevated recently in the last week at an average of 250 . It is recommended to monitor your diet and avoid high sugar foods. Seek foods such as veggies and grains";

				//find numbers in answer and import them into graph
				graph_points = [] //which come from api

				split = answer.split(" ");
				for(var i=0; i<split.length; i++){
					if(split[i][0] == "1" || split[i][0] == "2" || split[i][0] == "3" || split[i][0] == "4" || split[i][0] == "5" || split[i][0] == "6" || split[i][0] == "7" || split[i][0] == "8" || split[i][0] == "9" || split[i][0] == "0"){
						graph_points.push(split[i]);
					}
				}

				// ------------- MAke an API request to add to the graph points and dates 

			}

		console.log("graph array", graph_points);
		callback(answer, graph_points);
		
	};

	return factory;
});



