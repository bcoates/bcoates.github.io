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

var Return = React.createClass({
	render: function() {
		ret = (this.props.prizetable.reduce( (acc, cur) => {
			return acc + cur.pay * cur.hits
		}, 0) * 100 / possible(this.props.reels)).toFixed(2)
		
		return <div>Player Return: {ret}%</div>
	}
})

function Π(array, f = x => x) {
	return array.reduce( (mul, cur) => mul * f(cur), 1)
}
			    
function Σ(array, f = x => x) {
	return array.reduce( (acc, cur) => acc * f(cur), 0)
}

function possible(reels) {
	return Π(reels, r => Σ(r, s => s.n))
}

var Ruin = React.createClass({
	getInitialState: function() {
		return {prizetable: [
			{ symbol: ['B7', 'B7', 'DJ'], hits: 4, pay: 5000 },
			{ symbol: ['3B', '3B', '3B'], hits: 108, pay: 120 }],
			reels: [ [ {sym:'B7', n: 2}, {sym:'3B', n: 6}, {sym: 'BL', n: 64} ],
				 [ {sym:'B7', n: 2}, {sym:'3B', n: 6}, {sym: 'BL', n: 64} ],
				 [ {sym:'DJ', n: 1}, {sym:'3B', n: 3}, {sym: 'BL', n: 67} ]
			],
			possible: 72*72*72 }
	},
	render: function() {
		return <div>
			<PayTable prizetable={this.state.prizetable} onPayChange={this.handlePayChange}/>
			<Return prizetable={this.state.prizetable} reels={this.state.reels}/>
		</div>
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
