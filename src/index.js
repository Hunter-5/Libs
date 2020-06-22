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
		this.fillInBlanks = [];
		this.state = {
			generateStory:false,
			blanks:[], // User input for each blank (by order of appearance in story).
		}

		this.handleChange = this.handleChange.bind(this);
	}

	// Allows form to change depending on selected template, *see libsstory.json*.
	makeForm(arr) {
		return (
			arr.map((str, index) => {
				var blank = str.substring(1, str.length-1)

				return (
					<div class="form-group">
						<label>{ blank }</label>
						<input type="text"
								name={ index }
								value={ this.fillInBlanks[index] }
								onChange={ this.handleChange }>
						</input>
					</div>
				);
			})
		);
	}

	handleChange(event) {
		this.fillInBlanks[event.target.name] = event.target.value;
		var newState = Object.assign({}, this.state, {blanks:[...this.fillInBlanks]});
		this.setState(newState);
	}

	handleClick() {
		var newState = Object.assign({}, this.state, {generateStory:true}); 
		this.setState(newState);
	}

	renderShowStory() {
		return <ShowStory value={ this.fillInBlanks }/>;//this.state.blanks }/>;
	}

	render() {
		var view;
		if (this.state.generateStory === false) {
			// Generating html from an array is neat.
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

class ShowStory extends React.Component {
	fillBlanks() {
		var template = libsstory.template1, 
			pattern = /<(.*?)>/g,
			story = [],
			startingIndex = 0, 
			match, 
			i = 0;

		while ((match = pattern.exec(template)) !== null) {
			let templateText = template.slice(startingIndex, match.index);
			
			story.push(templateText);
			story.push(
				<span class="user-input">{ this.props.value[i] }</span>
			);

			startingIndex = pattern.lastIndex;
			i++;
		}

		if (pattern.lastIndex < template.length) {
			story.push(template.slice(startingIndex));
		}

		return story;
	}
	
	render() {
		return (
			<div>
				<div class="container text-center mt-4">
					<h2>So it begins. . .</h2>
					<hr></hr>
					<p class="story">{ this.fillBlanks() }</p>
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