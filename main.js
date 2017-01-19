/**
 * @jsx React.DOM
 */

var ce = React.createElement

function Π(array, f = x => x) {
	return array.reduce( (mul, cur, idx) => mul * f(cur, idx), 1)
}
			    
function Σ(array, f = x => x) {
	return array.reduce( (acc, cur, idx) => acc + f(cur, idx), 0)
}

function possible(reels, pred = (reelidx, sym) => true ) {
	return Π(reels, (r, reelidx) => Σ(r, s => pred(reelidx, s.sym) ? s.n : 0))
}

function winners(reels, symbols) {
	return possible(reels, (reelidx, sym) => symbols[reelidx] == sym)
}

var PayTable = React.createClass({
	render: function() {
		var items = this.props.prizetable.map( (pt,i) => {
			var changePay = (event) => {
				this.props.onPayChange(i, event.target.value)
			}
			return ce('tr', {key: i}, [
				ce('td', {key:1}, pt.symbol.join('-')),
				ce('td', {key:2}, winners(this.props.reels, pt.symbol)),
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

var SaveBox = React.createClass({
	getInitialState: function() {
		return {txt: JSON.stringify({prizetable: this.props.prizetable, reels: this.props.reels})}
	},
	render: function() {
		var change = event => {
			this.setState({txt: event.target.value})
			try {
				this.props.onChange(JSON.parse(event.target.value))
			} catch (e) {
			}
		}
		return ce('textarea', {value: this.state.txt, onChange: change})
	}
})

var Return = React.createClass({
	render: function() {
		ret = (this.props.prizetable.reduce( (acc, cur) => {
			return acc + cur.pay * winners(this.props.reels, cur.symbol)
		}, 0) * 100 / possible(this.props.reels)).toFixed(2)
		
		return ce('div', {}, ['Player Return: ', ret, '%'])
	}
})

var Ruin = React.createClass({
	getInitialState: function() {
		return {prizetable: [
			{ symbol: ['B7', 'B7', 'DJ'], pay: 5000 },
			{ symbol: ['3B', '3B', '3B'], pay: 120 }],
			reels: [ [ {sym:'B7', n: 2}, {sym:'3B', n: 6}, {sym: 'BL', n: 64} ],
				 [ {sym:'B7', n: 2}, {sym:'3B', n: 6}, {sym: 'BL', n: 64} ],
				 [ {sym:'DJ', n: 1}, {sym:'3B', n: 3}, {sym: 'BL', n: 67} ]
			] }
	},
	render: function() {
		return ce('div', {}, [
			ce(PayTable, {key: 1, prizetable: this.state.prizetable, reels: this.state.reels, onPayChange: this.handlePayChange}),
			ce(Return, {key: 2, prizetable: this.state.prizetable, reels: this.state.reels}),
			ce(SaveBox, {key: 3, prizetable: this.state.prizetable, reels: this.state.reels, onChange: this.handleState})
		])
	},
	handleState: function(newstate) {
		this.state = newstate
		this.forceUpdate()
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
