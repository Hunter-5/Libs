import React from 'react';
import ReactDOM from 'react-dom';
import libsstory from './data/libsstory.json';
import './index.css';

// Main view is the parent of the Form and Menu view.
// The Form handles generating the story.
class MainView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			beginGame:false,
		}
	}

	handleBeginButton() {
		this.setState({beginGame:true});
	}

	renderMenu() {
		return <Menu onClick={() => this.handleBeginButton()}/>;
	}

	// The form will have dynamic entries, based on the blanks provided in the template.
	renderForm(arr) {
		return <Form blanks={arr}/>;
	}

	render() {
		var view;
		if (this.state.beginGame === false) {
			view = <div>{ this.renderMenu() }</div>;
		} else if (this.state.beginGame === true) {
			// Find fill-in-the-blanks inside story template so we can put them in a form.
			var regex = /<(.*?)>/g;
			var blanks = libsstory.template1.match(regex);
 			view = <div>{ this.renderForm(blanks) }</div>;
		}

		return view;
	}
}

// Requests user to fill in template. Parent of ShowStory view.
class Form extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			generateStory:false,
			blanks:[], // User input for each blank (by order of appearance in story).
			value:"",
		}

		this.handleChange = this.handleChange.bind(this);
	}

	// Allows form to change depending on selected template, *see libsstory.json*.
	makeForm(arr) {
		return (
			arr.map(str => {
				var blank = str.substring(1, str.length-1)
				return (
					<div class="form-group">
						<label>{ blank }</label>
						<input type="text"
								value={ this.state.value }
								onChange={ this.handleChange }>
						</input>
					</div>
				);
			})
		);
	}

	handleChange(event) {
		var blankList = this.state.blanks.push(event.target.value);
		var newState = Object.assign({}, this.state, {blanks:blankList});
		newState = Object.assign({}, this.state, {value:event.target.value}); 
		this.setState(newState);
	}

	handleClick() {
		var newState = Object.assign({}, this.state, {generateStory:true}); 
		this.setState(newState);
		//event.preventDefault();
	}

	renderShowStory() {
		return <ShowStory value={ this.state.blanks }/>;
	}

	render() {
		var view;
		if (this.state.generateStory === false) {
			// Generating html from an array is neat..
			view = (
				<div>
					<div class="container text-center mt-5">
						<form>
							{ this.makeForm(this.props.blanks) }
						</form>
						<button class="btn btn-lg btn-primary btn-outline-dark text-light"
								onClick={ () => this.handleClick() }>
							Generate
						</button>
					</div>
				</div>
			);
		} else if (this.state.generateStory === true) {
			view = this.renderShowStory();
		}

		return view;
	}
}

/*var story = libsstory.template1;
var regex = /<(.*?)>/g;
var blanks = story.match(regex);*/
class ShowStory extends React.Component {

	fillBlanks() {
		var story = libsstory.template1;
		var regex = /<(.*?)>/g;
		var blanks = story.match(regex);
		
		for (let i = 0; i < blanks.length; i++) {
			story = story.replace(blanks[i], this.props.value[i]);
		}
		return story;
	}
	render() {
		return (
			<div>
				<div class="container text-center mt-4">
					<p>{ this.fillBlanks() }</p>
				</div>
			</div>
		);
	}
}

function Menu(props) {
	return (
		<div>
		    <div class="container text-center mt-4">
				<h2>Welcome!</h2>
				<p>This here is my humble knock-off of 
				Mad Libs&trade;. Happy Libs is a "phrasal
				template word game". To play, enter 
				words or phrases for the parts of speech 
				or categories requested. Your answers are 
				used to fill in a story template.</p>
			</div>
			<div class="container text-center mt-4">
				<button class="btn btn-lg btn-primary btn-outline-dark text-light"
						onClick={props.onClick}>
					Begin!
				</button>
			</div>
		</div>
	);
}

ReactDOM.render(
	<MainView />,
	document.getElementById('root')
);