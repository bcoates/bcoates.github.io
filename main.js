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

function raw_winners(reels, symbols, wildcards) {
	return possible(reels, (reelidx, sym) => {
		if (symbols[reelidx] in wildcards) {
			return wildcards[symbols[reelidx]].includes(sym)
		} else {
			return symbols[reelidx] == sym
		}
	})
}

function blocked_winners(reels, symbols, wildcards) {
	
}

function winners(reels, symbols, wildcards) {
	return raw_winners(reels, symbols, wildcards) - blocked_winners(reels, symbols, wildcards)
}

var PayTable = React.createClass({
	render: function() {
		var items = this.props.prizetable.map( (pt,pt_idx) => {
			var changePay = event => {
				this.props.onPayChange(pt_idx, ~~event.target.value)
			}
			var remove = event => {
				this.props.onRemovePay(pt_idx)
			}
			var reels = pt.symbol.map( (reel, reel_idx) => {
				var changeReel = event => {
					this.props.onReelChange(pt_idx, reel_idx, event.target.value)
				}
				// todo: lift
				var fr = flatreel(this.props.reels[reel_idx],this.props.wildcards)
				var reelents = Object.keys(fr).map( (sym, sym_idx) => 
					ce('option', {key: sym_idx, value: sym}, sym + ' - ' + fr[sym]) )
				
				return ce('select', {key: reel_idx, value: reel, onChange:changeReel}, reelents);
			});
			return ce('tr', {key: pt_idx}, [
				ce('td', {key:1, onClick: remove}, '[-]'),
				ce('td', {key:2}, reels),
				ce('td', {key:3}, raw_winners(this.props.reels, pt.symbol, this.props.wildcards)),
				ce('td', {key:4}, blocked_winners(this.props.reels, pt.symbol, this.props.wildcards)),
				ce('td', {key:5}, winners(this.props.reels, pt.symbol, this.props.wildcards))
				ce('td', {key:6}, ce('input', {type:'number', value:pt.pay, onChange:changePay}))
			])
		});
		var add = event => {
			this.props.onAddPay()
		}
		return ce('table', {}, [
			ce('thead', {key:1}, ce('tr', {}, [
				ce('th', {key:1}, ' '),
				ce('th', {key:2}, 'symbols'),
				ce('th', {key:3}, 'hits'),
				ce('th', {key:4}, 'minus'),
				ce('th', {key:5}, 'actual'),
				ce('th', {key:6}, 'pays')
			])),
			ce('tbody', {key: 2}, items),
			ce('tfoot', {key: 3}, ce('tr', {}, [
				ce('td', {key:1, onClick: add}, '[+]')
			]))
		])
	}
})

var ReelStrip = React.createClass({
	render: function() {
		var strips = this.props.reels.map( (reel, reel_idx) => {
			var stops = reel.map( (stop, stop_idx) => {
				changeSym = event => {
					this.props.onSymChange(reel_idx, stop_idx, event.target.value)
				}
				changeN = event => {
					this.props.onStopNChange(reel_idx, stop_idx, ~~event.target.value)
				}
				return ce('div', {key: stop_idx}, [
					ce('input', {key: 1, value: stop.sym, onChange:changeSym, style: {width: '4em'}}),
					ce('input', {key: 2, type: 'number', value: stop.n, onChange:changeN, style: {width: '4em'}})
				])
			})
			return ce('div', {key: reel_idx, style: {display: 'inline-block'}}, stops)
		})
		return ce('div', {}, strips)
	}
})

var SaveBox = React.createClass({
	getInitialState: function() {
		return {txt: JSON.stringify({prizetable: this.props.prizetable, reels: this.props.reels, wildcards: this.props.wildcards}, 2)}
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({txt: JSON.stringify({prizetable: nextProps.prizetable, reels: nextProps.reels, wildcards: nextProps.wildcards}, 2)})
	},
	render: function() {
		var change = event => {
			this.setState({txt: event.target.value})
			try {
				this.props.onChange(JSON.parse(event.target.value))
			} catch (e) {
			}
		}
		return ce('textarea', {value: this.state.txt, onChange: change, style: {width: '40em', height: '16em'}})
	}
})

var Return = React.createClass({
	render: function() {
		ret = (this.props.prizetable.reduce( (acc, cur) => {
			return acc + cur.pay * winners(this.props.reels, cur.symbol, this.props.wildcards)
		}, 0) * 100 / possible(this.props.reels)).toFixed(2)
		
		return ce('div', {}, ['Player Return: ', ret, '%'])
	}
})

function flatreel(reelstrip, wildcards) {
	var ret = {}
	reelstrip.forEach( e => {
		ret[e.sym] = (ret[e.sym] || 0) + e.n
	})
	Object.entries(wildcards).forEach( ([pattern, symbols]) => {
		ret[pattern] = (ret[pattern] || 0) + Σ(symbols, sym => ret[sym])
	})
	return ret
}

var Ruin = React.createClass({
	getInitialState: function() {
		return {prizetable: [
			{ symbol: ['B7', 'B7', 'DJ'], pay: 5000/3 },
			{ symbol: ['B7', 'B7', 'B7'], pay: 1000/3 },
			{ symbol: ['R7', 'R7', 'DJ'], pay: 600/3 },
			{ symbol: ['R7', 'R7', 'R7'], pay: 300/3 },
			{ symbol: ['A7', 'A7', 'DJ'], pay: 400/3 },
			{ symbol: ['A7', 'A7', 'A7'], pay: 200/3 },
			{ symbol: ['3B', '3B', 'DJ'], pay: 120/3 },
			{ symbol: ['3B', '3B', '3B'], pay: 60/3 },
			{ symbol: ['2B', '2B', 'DJ'], pay: 80/3 },
			{ symbol: ['2B', '2B', '2B'], pay: 40/3 },
			{ symbol: ['1B', '1B', 'DJ'], pay: 40/3 },
			{ symbol: ['1B', '1B', '1B'], pay: 20/3 },
			{ symbol: ['AB', 'AB', 'DJ'], pay: 20/3 },
			{ symbol: ['AB', 'AB', 'AB'], pay: 10/3 },
			{ symbol: ['BL', 'BL', 'DJ'], pay: 4/3 },
			{ symbol: ['BL', 'BL', 'BL'], pay: 2/3 }],
			wildcards: { 'A7': ['R7', 'B7'],
				     'AB': ['1B', '2B', '3B'] },
			reels: [ [ {sym:'B7', n: 1}, {sym: 'BL', n: 4}, {sym: '2B', n: 3}, {sym: '1B', n: 3}, {sym: '3B', n: 3}, {sym: 'BL', n: 3}, {sym: 'R7', n: 4},  {sym: 'BL', n: 3}, {sym: '1B', n: 6}, {sym: 'BL', n: 3}, {sym: 'B7', n: 1}, {sym: 'BL', n: 3}, {sym: '2B', n: 5}, {sym: 'BL', n: 3}, {sym: '1B', n: 5}, {sym: 'BL', n: 3}, {sym: 'R7', n: 4},  {sym: 'BL', n: 3}, {sym: '2B', n: 3}, {sym: '1B', n: 3}, {sym:'3B', n: 3}, {sym: 'BL', n: 3} ],
				 [ {sym:'B7', n: 2}, {sym: 'BL', n: 4}, {sym: '2B', n: 3}, {sym: '1B', n: 3}, {sym: '3B', n: 3}, {sym: 'BL', n: 3}, {sym: '2B', n: 2},  {sym: 'BL', n: 3}, {sym: '1B', n: 6}, {sym: 'BL', n: 3}, {sym: 'R7', n: 3}, {sym: 'BL', n: 3}, {sym: '2B', n: 3}, {sym: 'BL', n: 3}, {sym: '1B', n: 5}, {sym: 'BL', n: 3}, {sym: 'R7', n: 4},  {sym: 'BL', n: 3}, {sym: '2B', n: 3}, {sym: '1B', n: 3}, {sym:'3B', n: 3}, {sym: 'BL', n: 4} ],
				 [ {sym:'DJ', n: 1}, {sym: 'BL', n: 4}, {sym: '2B', n: 3}, {sym: '1B', n: 3}, {sym: '3B', n: 2}, {sym: 'BL', n: 3}, {sym: 'B7', n: 11}, {sym: 'BL', n: 3}, {sym: '1B', n: 1}, {sym: 'BL', n: 2}, {sym: 'R7', n: 6}, {sym: 'BL', n: 2}, {sym: '1B', n: 1}, {sym: 'BL', n: 2}, {sym: '1B', n: 1}, {sym: 'BL', n: 2}, {sym: 'B7', n: 12}, {sym: 'BL', n: 2}, {sym: '2B', n: 3}, {sym: '1B', n: 3}, {sym:'3B', n: 1}, {sym: 'BL', n: 4} ]
			] }
	},
	render: function() {
		return ce('div', {}, [
			ce(PayTable, {key: 1, prizetable: this.state.prizetable, reels: this.state.reels, wildcards: this.state.wildcards, onPayChange: this.handlePayChange, onRemovePay: this.handleRemovePay, onAddPay: this.handleAddPay, onReelChange: this.handleReelChange}),
			ce(Return, {key: 2, prizetable: this.state.prizetable, reels: this.state.reels, wildcards: this.state.wildcards,}),
			ce(ReelStrip, {key: 3, reels: this.state.reels, onSymChange: this.handleSymChange, onStopNChange: this.handleStopNChange}),
			ce(SaveBox, {key: 4, prizetable: this.state.prizetable, reels: this.state.reels, wildcards: this.state.wildcards, onChange: this.handleState})
		])
	},
	handleSymChange: function(reel_idx, stop_idx, newsym) {
		this.state.reels[reel_idx][stop_idx].sym = newsym
		this.forceUpdate()
	},
	handleStopNChange: function(reel_idx, stop_idx, newn) {
		this.state.reels[reel_idx][stop_idx].n = newn
		this.forceUpdate()
	},
	handleState: function(newstate) {
		this.state = newstate
		this.forceUpdate()
	},
	handlePayChange: function(idx, newval) {
		this.state.prizetable[idx].pay = newval
		this.forceUpdate()
	},
	handleReelChange: function(tblIdx, reelIdx, newval) {
		this.state.prizetable[tblIdx].symbol[reelIdx] = newval
		this.forceUpdate()
	},
	handleRemovePay: function(idx) {
		this.state.prizetable.splice(idx, 1)
		this.forceUpdate()
	},
	handleAddPay: function(idx) {
		this.state.prizetable.push( {symbol: ['BL', 'BL', 'BL'], pay: 0} )
		this.forceUpdate()
	}
})

ReactDOM.render(
	ce(Ruin),
	document.body
);
