import React from 'react';
import ReactDOM from 'react-dom';
import libsstory from './data/libsstory.json';
import './index.css';

class Libs extends React.Component {
	renderBody() {
		return (
			<Body/>
		);
	}

	render() {
		return (
			<div>
			<nav class="navbar navbar-expand-lg navbar-dark text-center">
      			<div class="navbar-container container d-flex justify-content-center">
        			<a class="navbar-brand text-center" href="#">Happy Libs</a>
      			</div>
    		</nav>
    		<div>
    			<div class="container text-center mt-4 d-flex justify-content-center">
    				{ this.renderBody() }
    			</div>
    		</div>
    		</div>
    	);
	}
}

class Body extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			beginGame:false,
		}
	}

	handleBeginButton() {
		this.setState({ beginGame:true });
	}

	renderMenu() {
		return <Menu onClick={ () => this.handleBeginButton() }/>;
	}

	renderStoryTemplate() {
		return <StoryTemplate/>;
	}

	render() {
		let view;

		if (this.state.beginGame === false) {
			view = <div>{ this.renderMenu() }</div>;
		} else if (this.state.beginGame === true) {
			view = <div>{ this.renderStoryTemplate() }</div>
		}

		return view;
	}
}

// Story template is the parent view for the Story and Template Form Views.
class StoryTemplate extends React.Component {
	constructor(props) {
		super(props);

		this.numberOfStories = 6;
		this.template = libsstory[Math.floor(Math.random() * Math.floor(this.numberOfStories))];
		this.pattern = /<(.*?)>/g;
		this.fillInBlanksInputs = [];

		this.state = {
			generateStory:false,
		}

		this.handleFormSubmitButton = this.handleFormSubmitButton.bind(this);
	}

	handleFormSubmitButton(event, templateInputs) {
		this.fillInBlanksInputs = templateInputs;
		this.setState({ generateStory:true });
	}

	handleGenerateNewStoryButton() {
		this.fillInBlanksInputs = [];
		this.setState({ generateStory:false });
	}

	// The form will have dynamic entries, based on the blanks provided in the template.
	renderTemplateForm() {
		return (
			<TemplateForm
				template={ this.template }
				pattern={ this.pattern }
				userInputs={ this.fillInBlanksInputs }
				onSubmit={ this.handleFormSubmitButton }/>
		);
	}

	renderStory() {
		return (
			<Story
				template={ this.template }
				pattern={ this.pattern }
				wordInputs={ this.fillInBlanksInputs }
				onClick={ this.handleGenerateNewStoryButton }/>
		);
	}

	render() {
		let view;

		if (this.state.generateStory === false) {
 			view = <div>{ this.renderTemplateForm() }</div>;
 		} else if (this.state.generateStory === true) {
 			view = <div><p>{ this.renderStory() }</p></div>;
 		}

		return view;
	}
}

class TemplateForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			templateInputs:[],
		}

		this.handleFormInput = this.handleFormInput.bind(this);
	}

	// Allows form to change depending on selected template, *see libsstory.json*.
	buildForm() {
		let fillInTheBlanks = this.props.template.match(this.props.pattern);

		return (
			fillInTheBlanks.map((str, index) => {
				let blank = str.substring(1, str.length-1)

				return (
					<div class="form-group">
						<label>{ blank }</label>
						<input
							type="text"
							name={ index }
							value={ this.state.templateInputs[index] }
							onChange={ this.handleFormInput }>
						</input>
					</div>
				);
			})
		);
	}

	handleFormInput(event) {
		let temp = this.state.templateInputs.slice();
		temp[event.target.name] = event.target.value;
		let newState = Object.assign({}, this.state, { templateInputs:[...temp] });
		this.setState(newState);
	}

	render() {
		// Generating html from an array is neat.
		return (
			<div>
			<form>
				{ this.buildForm() }
			</form>
			<button class="btn btn-lg btn-primary btn-outline-dark text-light"
					onClick={ (event) => this.props.onSubmit(event, this.state.templateInputs.slice()) }>
				Generate
			</button>
			</div>
		);
	}
}

class Story extends React.Component {
	fillBlanks() {
		let template = this.props.template, 
			pattern = this.props.pattern,
			story = [],
			startingIndex = 0;

		for (let i = 0, match = pattern.exec(template); match !== null; i++) {
			let templateText = template.slice(startingIndex, match.index);
			
			story.push(templateText);
			story.push(
				<span class="user-input">{ this.props.wordInputs[i] }</span>
			);

			startingIndex = pattern.lastIndex;
			match = pattern.exec(template);
		}

		if (pattern.lastIndex < template.length) {
			story.push(template.slice(startingIndex));
		}

		return story;
	}
	
	render() {
		return (
			<div>
			<h2>So it begins. . .</h2>
			<p class="story">{ this.fillBlanks() }</p>
			<button class="btn btn-lg btn-primary btn-outline-dark text-light"
					onClick={ this.props.onClick }>
				New Story
			</button>			
			</div>
		);
	}
}

function Menu(props) {
	return (
		<div>
		<h2>Welcome!</h2>
		<p>This here is my humble knock-off of 
		Mad Libs&trade;. Happy Libs is a "phrasal
		template word game". To play, enter 
		words or phrases for the parts of speech 
		or categories requested. Your answers are 
		used to fill in a story template.</p>
		<button
			class="btn btn-lg btn-primary btn-outline-dark text-light"
			onClick={ props.onClick }>
			Begin!
		</button>
		</div>
	);
}

ReactDOM.render(
	<Libs />,
	document.getElementById('root')
);