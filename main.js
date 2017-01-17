/**
 * @jsx React.DOM
 */

var PayTable = React.createClass({
	render: function() {
		var items = this.props.prizetable.map( (pt,i) => {
			var changePay = (event) => {
				this.props.onPayChange(i, event.target.value)
			}
			return <tr key={i}>
				<td>{pt.symbol.join('-')}</td>
				<td>{pt.hits}</td>
				<td><input type="number" value={pt.pay} onChange={changePay}/></td>
			</tr>
		});
		return <table><tr><th>symbols</th><th>hits</th><th>pays</th></tr>{items}</table>
	}
})
		
var Ruin = React.createClass({
	getInitialState: function() {
		return {prizetable: [
			{ symbol: ['B7', 'B7', 'DJ'], hits: 4, pay: 5000 },
			{ symbol: ['3B', '3B', '3B'], hits: 108, pay: 120 }],
			possible: 72*72*72 }
	},
	render: function() {
		return <PayTable prizetable={this.state.prizetable} onPayChange={this.handlePayChange}/>
	},
	handlePayChange: function(idx, newval) {
		this.state.prizetable[idx].pay = newval
		this.forceUpdate()
	}
})

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
	<Ruin/>,
	document.body
);
