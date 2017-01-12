/**
 * @jsx React.DOM
 */

var prizetable = [
	{ symbol: ['B7', 'B7', 'DJ'], hits: 4, pay: 5000 },
	{ symbol: ['3B', '3B', '3B'], hits: 108, pay: 120 }
]

var possible = 72*72*72;

var PayTable = React.createClass({
	render: function() {
		var items = this.props.prizetable.map( function(pt) {
			return <tr><td>{pt.symbol.join('-')}</td><td>{pt.hits}</td><td>{pt.pay}</td>;
		});
		return <table>{items}</table>;
	};
});

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
	<PayTable prizetable={prizetable}/>,
	document.body
);
