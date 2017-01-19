/**
 * @jsx React.DOM
 */

var ce = React.createElement

var PayTable = React.createClass({
	render: function() {
		var items = this.props.prizetable.map( (pt,i) => {
			var changePay = (event) => {
				this.props.onPayChange(i, event.target.value)
			}
			return ce('tr', {key: i}, [
				ce('td', {key:1}, pt.symbol.join('-')),
				ce('td', {key:2}, pt.hits),
				ce('td', {key:3}, ce('input', {type:'number', value:pt.pay, onChange:changePay}))
			])
		});
		return ce('table', {}, [
			ce('thead', {key:1}, ce('tr', {}, [
				ce('th', {key:1}, 'symbols'),
				ce('th', {key:2}, 'hits'),
				ce('th', {key:3}, 'pays'),
			])),
			ce('tbody', {key: 2}, items)
		])
	}
})

var Return = React.createClass({
	render: function() {
		ret = (this.props.prizetable.reduce( (acc, cur) => {
			return acc + cur.pay * cur.hits
		}, 0) * 100 / possible(this.props.reels)).toFixed(2)
		
		return ce('div', {}, ['Player Return: ', ret, '%'])
	}
})

function Π(array, f = x => x) {
	return array.reduce( (mul, cur) => mul * f(cur), 1)
}
			    
function Σ(array, f = x => x) {
	return array.reduce( (acc, cur) => acc + f(cur), 0)
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
		return ce('div', {}, [
			ce(PayTable, {key: 1, prizetable: this.state.prizetable, onPayChange: this.handlePayChange}),
			ce(Return, {key: 2, prizetable: this.state.prizetable, reels: this.state.reels}),
		])
	},
	handlePayChange: function(idx, newval) {
		this.state.prizetable[idx].pay = newval
		this.forceUpdate()
	}
})

ReactDOM.render(
	ce(Ruin),
	document.body
);
