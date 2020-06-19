import React from 'react';
import ReactDOM from 'react-dom';
import libsstory from './data/libsstory.json';
import './index.css';

// Main view is the parent of the other three game components.
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
			view = <div>{this.renderMenu()}</div>;
		} else if (this.state.beginGame === true) {
			// Find fill-in-the-blanks inside story template so we can put them in a form.
			var regex = /<(.*?)>/g;
			var blanks = libsstory.template1.match(regex);
 			view = <div>{this.renderForm(blanks)}</div>;
		}

		return view;
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

// Requests user to fill in template.
function Form(props) {
	// Mapping an array to html is pretty neat.
	return (
		<div>
			<div class="container text-center mt-5">
				<form>
					{ props.blanks.map(str => {
						return (
						<div class="form-group">
							<label>{ str }</label>
							<input type="text"></input>
						</div>
						);
					}) }
				</form>
				<button class="btn btn-lg btn-primary btn-outline-dark text-light">
					Generate
				</button>
			</div>
		</div>
	);
}

ReactDOM.render(
	<MainView />,
	document.getElementById('root')
);