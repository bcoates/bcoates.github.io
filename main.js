/**
 * @jsx React.DOM
 */

function c2f(c) {
	return 9 / 5 * parseFloat(c) + 32;
}
function f2c(f) {
	return 5 / 9 * (f - 32);
}


var TemperatureConverter = React.createClass({
	getInitialState: function() {
		return {c: 0}
	},
	render: function() {
		var celciusValueLink = {
			value: this.state.c.toString(),
			requestChange: this.onCelsiusChange
		};
		var fahrenheitValueLink = {
			value: c2f(this.state.c).toString(),
			requestChange: this.onFahrenheitChange
		};
		return <div>
			<input type="number" valueLink={celciusValueLink}/>℃ ⟷
			<input type="number" valueLink={fahrenheitValueLink}/>℉
		</div>
	},
	onCelsiusChange: function(data) {
		this.setState({c: parseFloat(data)})
	},
	onFahrenheitChange: function(data) {
		this.setState({c: f2c(data)})
	}
});

React.renderComponent(
	<TemperatureConverter/>,
	document.body
);
