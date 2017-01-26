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
		var items = this.props.prizetable.map( (pt,pt_idx) => {
			var changePay = event => {
				this.props.onPayChange(pt_idx, event.target.value)
			}
			var remove = event => {
				this.props.onRemovePay(pt_idx)
			}
			var reels = pt.symbol.map( (reel, reel_idx) => {
				var changeReel = event => {
					this.props.onReelChange(pt_idx, reel_idx, event.target.value)
				}
				// todo: lift
				var fr = flatreel(this.props.reels[reel_idx])
				var reelents = Object.keys(fr).map( (sym, sym_idx) => 
					ce('option', {key: sym_idx, value: sym}, sym + ' - ' + fr[sym]) )
				
				return ce('select', {key: reel_idx, value: reel, onChange:changeReel}, reelents);
			});
			return ce('tr', {key: pt_idx}, [
				ce('td', {key:1, onClick: remove}, '[-]'),
				ce('td', {key:2}, reels),
				ce('td', {key:3}, winners(this.props.reels, pt.symbol)),
				ce('td', {key:4}, ce('input', {type:'number', value:pt.pay, onChange:changePay}))
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
				ce('th', {key:4}, 'pays'),
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
				return ce('div', {key: stop_idx}, [
					ce('input', {key: 1, value: 'XX'}),
					ce('input', {key: 2, type: 'number', value: 42})
				])
			})
			return ce('div', {key: reel_idx, style: {display: 'inline-block'}}, stops)
		})
		return ce('div', {}, strips)
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
		return ce('textarea', {value: this.state.txt, onChange: change, style: {width: '40em', height: '16em'}})
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

function flatreel(reelstrip) {
	var ret = {}
	reelstrip.forEach( e => {
		ret[e.sym] = (ret[e.sym] || 0) + e.n
	})
	return ret
}

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
			ce(PayTable, {key: 1, prizetable: this.state.prizetable, reels: this.state.reels, onPayChange: this.handlePayChange, onRemovePay: this.handleRemovePay, onAddPay: this.handleAddPay, onReelChange: this.handleReelChange}),
			ce(Return, {key: 2, prizetable: this.state.prizetable, reels: this.state.reels}),
			ce(ReelStrip, {key: 3, reels: this.state.reels}),
			ce(SaveBox, {key: 4, prizetable: this.state.prizetable, reels: this.state.reels, onChange: this.handleState})
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
