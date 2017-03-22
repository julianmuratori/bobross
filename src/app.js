import React from 'react';
import ReactDOM from 'react-dom';
import ScrollableAnchor from 'react-scrollable-anchor';

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
      paintDetailsSelection: [],
      episodeGuide: []
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
  	const episodeArray = Array.from(this.state.episodes)
  	// Take the details from paintDetailsSelection and search episodes for matching values
  	// filter episodearray and then for each episode, go through paint details and check to see if the value in paintdetails is inside the episode, if so then return true.

   	const details = []
  	const firstQuery = episodeArray.filter((episode) => {
  		return episode[newArray[0]]
	})
  	const secondQuery = firstQuery.filter((episode) => {
  		return episode[newArray[1]]
  	})

  	const thirdQuery = secondQuery.filter((episode) => {
	return episode[newArray[2]]

  	})

  	if (secondQuery.length === 0) {
  		details.push(firstQuery)
  	} else if (thirdQuery.length === 0) {
  		details.push(secondQuery)
  	} else {
  		details.push(thirdQuery)
  	}

  console.log(details)

  	if (details[0].length > 5) {
  		details[0].splice(5)
  	} else if (details[0].length < 1) {
  		console.log("No Results")
  	}

  	this.setState({
  		episodeGuide: details[0]
  	})
  }
	render() {
		return (
<div>
	<header>
		<div className="headerStyle">
      <div className="siteHeading">
  			<h1>The Joy of Painting</h1>
        <p>What are you interested in learning to paint? Let's find out!</p>
        <a href="#section1">Whatever</a>
      </div>
			<div className="cloud cloud1">
				<img src="../src/assets/images/cloud1.png"/>
			</div>
			<div className="rossContainer">
				<img src="../src/assets/images/ross-portrait.jpg" className="rossPhoto"/>
			</div>
      <div className="cloud cloud2">
        <img src="../src/assets/images/cloud1.png"/>
      </div>
			<div className="treeSVG">
				<img src="../src/assets/images/treeline1.svg"/>
			</div>
		</div>
	</header>
	<div className="wrapper">
		<div className="paintDetails main">
			<h3>Select the happiest of painting details:</h3>
 			<ul className="paintDetails__flex">
 				{this.state.paintDetails.map((detail, i) => {
 						return (
 							<li onClick={() => this.addItem(detail, i)} name={detail} key={detail} id={`${i}`} className="paintDetails__detail animation-target" ref={ref => this.detail = ref}>{detail}</li>
						)
	 				}
				)}
 			</ul>
		</div>

    <div className="paintDetails main">
		<form onSubmit={this.episodeGuide} className="selectedItems">
			<ul className="paintDetails__flex">
				{this.state.paintDetailsSelection.map((detail, i) => {
					return (
						<li onClick={() => this.removeItem(detail, i)} className="paintDetails__SelectedDetail animation-target">{detail}</li>
					)
				})}
			</ul>
			<button className="button">So...which episodes should I watch?</button>
		</form>
		</div>
	</div>

	<footer className="bottomSection">
			<div>
  			<h3>Here's a small taste of what Bob has to offer...</h3>
  				<ul className="episodeList">
  					{this.state.episodeGuide.map((episode) => {
  						return (
  							<li className="paintDetails__FinalList">{episode.EPISODE}: {episode.TITLE}</li>
  						)
  					})}
  				</ul>
        <div className="endPage">
          <h3>Wishing you pleasant painting and chill vibes, friend</h3>
        </div>
			</div>
	</footer>
</div>
		)
	}
	componentDidMount() {

			const dbRef = firebase.database().ref();

// initial database query to grab main data array and also to grab list of painting details

			dbRef.on('value', (response) => {
				let episodeDatabase = response.val()
				let details = episodeDatabase.splice(0,1)
				let detailsArray = []

// Removes details in each object that don't appear in the episode
// For example, if trees don't appear in S3E04, they are removed from state
				for (let objects in episodeDatabase) {
					let hey = episodeDatabase[objects];
					for (let i in hey) {
						if (hey[i] === "0") {
							delete hey[i];
						}
					}
				}

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
