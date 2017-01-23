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
			var changePay = event => {
				this.props.onPayChange(i, event.target.value)
			}
			var remove = event => {
				this.props.removePay(i)
			}
			return ce('tr', {key: i}, [
				ce('td', {key:1, onclick: remove}, '[-]'),
				ce('td', {key:2}, pt.symbol.join('-')),
				ce('td', {key:3}, winners(this.props.reels, pt.symbol)),
				ce('td', {key:4}, ce('input', {type:'number', value:pt.pay, onChange:changePay}))
			])
		});
		return ce('table', {}, [
			ce('thead', {key:1}, ce('tr', {}, [
				ce('th', {key:1}, ' '),
				ce('th', {key:2}, 'symbols'),
				ce('th', {key:3}, 'hits'),
				ce('th', {key:4}, 'pays'),
			])),
			ce('tbody', {key: 2}, items),
			ce('tfoot', {key: 3}, ce('tr', {} [
				ce('td', {key:1}, '[+]')
			]))
		])
	}
})

var SaveBox = React.createClass({
	getInitialState: function() {
		return {txt: JSON.stringify({prizetable: this.props.prizetable, reels: this.props.reels}, 2)}
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({txt: JSON.stringify({prizetable: nextProps.prizetable, reels: nextProps.reels}, 2)})
	},
	render: function() {
		var change = event => {
			this.setState({txt: event.target.value})
			try {
				this.props.onChange(JSON.parse(event.target.value))
			} catch (e) {
			}
		}
		return ce('textarea', {value: this.state.txt, onChange: change, width: '20em', height: '8em'})
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
			ce(PayTable, {key: 1, prizetable: this.state.prizetable, reels: this.state.reels, onPayChange: this.handlePayChange, onRemovePay: this.handleRemovePay}),
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
	},
	handleRemovePay: function(idx) {
		this.state.prizetable.splice(idx, 1)
	}
})

ReactDOM.render(
	ce(Ruin),
	document.body
);
