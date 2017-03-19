import React from 'react';
import ReactDOM from 'react-dom';

// initializes firebase
  var config = {
    apiKey: "AIzaSyAVqflGlXO5BZrw7wW0ReYCCPRVK2GY3FY",
    authDomain: "ross-e85f8.firebaseapp.com",
    databaseURL: "https://ross-e85f8.firebaseio.com",
    storageBucket: "ross-e85f8.appspot.com",
    messagingSenderId: "304376524247"
  };
  firebase.initializeApp(config);


// Main React App
class App extends React.Component {
	constructor() {
    super();
    this.state = {
      episodes: [],
      paintDetails: [],
      paintDetailsSelection: []
    };
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.episodeGuide = this.episodeGuide.bind(this);
  }

  // Allows user to add a selected item from the populated list
  addItem(detail, index) {
  	const newDetailsSelection = Array.from(this.state.paintDetailsSelection);
  	newDetailsSelection.push(detail)  	

  	const newDetails = Array.from(this.state.paintDetails)
  	newDetails.splice(index, 1)

  	this.setState({
  		paintDetailsSelection: newDetailsSelection,
  		paintDetails: newDetails
  	})
  	
  }
  // Removes items from selections list
  removeItem(detail, index) {
  	const newDetailsSelection = Array.from(this.state.paintDetailsSelection)
  	newDetailsSelection.splice(index, 1)

  	const newDetails = Array.from(this.state.paintDetails)
  	newDetails.push(detail)

  	this.setState({
  		paintDetailsSelection: newDetailsSelection,
  		paintDetails: newDetails
  	})
  }
  episodeGuide(e) {
  	e.preventDefault();
  	const newArray = Array.from(this.state.paintDetailsSelection)
  	// Take the details from paintDetailsSelection and search episodes for matching values
  
	 const searchItems = this.state.episodes.map((item) => {
	 	for (let i in item) {
	 		if (item[i] === "1") {
	 			console.log(i)
	 		}
	 	}
	 })
	 // console.log(newArray)


  }
	render() {
		return (
	<div className="wrapper">	
		<div className="selectedDetails main">
		<p>hey</p>
		<form onSubmit={this.episodeGuide}>
			<ul>
				{this.state.paintDetailsSelection.map((detail, i) => {
					return (
						<li onClick={() => this.removeItem(detail, i)} className="paintDetails__detail">{detail}</li>
					)
				})}
			</ul>
			<button>GIMME</button>
		</form>
		</div>	
		<div className="paintDetails main">
 			<ul>
 				{this.state.paintDetails.map((detail, i) => {
 						return (
 							<li onClick={() => this.addItem(detail, i)} name={detail} key={detail} id={`${i}`} className="paintDetails__detail" ref={ref => this.detail = ref}>{detail}</li>
						)
	 				}
				)}
 			</ul>
		</div>
	</div>	
		)
	}
	componentDidMount() {
			const dbRef = firebase.database().ref();

// initial database query to grab main data array and also to grab list of painting details

			dbRef.on('value', (response) => {
				const episodeDatabase = response.val()
				let details = episodeDatabase.splice(0,1)
				let detailsArray = [];

				for (let detailValue in details) {
					const detail = details[detailValue];
					detailsArray.push(Object.values(detail))
					detailsArray = detailsArray[0]
				}

		// Sets initial state based on database query
				this.setState({
					episodes: episodeDatabase,
					paintDetails: detailsArray
			})
	   })
	}
}







ReactDOM.render(<App />, document.getElementById('app'));