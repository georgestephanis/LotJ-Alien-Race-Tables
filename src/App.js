import './App.css';
import { Component } from 'react';
import _races from './races.json';

const races = Object.values( _races ).sort( ( a, b ) => a.name.localeCompare( b.name ) );
const imperialRaces = [
	'Alderaanian',
	'Arkanian',
	'Astromech',
	'Balosar',
	'Chiss',
	'Corellian',
	'Echani',
	'Human',
	'Kiffar',
	'Lorrdian',
	'Mandalorian',
	'Miraluka',
	'Mirialan',
	'Naboo',
	'Noghri',
	'Protocol_droid',
	'Sith',
	'Umbaran',
	'Wroonian',
	'Zabrak'
];

function LevelFilter( props ) {
	return <label>
		{props.cls}
		<input name={ props.cls } type="range" min="1" max="150" value={ props.val } onChange={ props.onChange } />
		<span>{ props.val }</span>
	</label>;
}

function StatFilter( props ) {
	return <label>
		{props.stat}
		<input name={ props.stat } type="range" min={ props.min } max={ props.max } value={ props.val } onChange={ props.onChange } />
		{ props.prefix }<span>{ props.val }</span>
	</label>;
}

function RacesForm( props ) {
	return (
		<form id="races_filters">
			<fieldset>
				<legend>Race Name?</legend>
				<label>
					<input type="search" name="race" value={ props.state.race } onChange={ props.onChange } />
				</label>
				<label>
					<input type="checkbox" name="imperial" checked={ props.state.imperial } onChange={ props.onChange } />
					Imperial Races Only?
				</label>
			</fieldset>
			<fieldset>
				<legend>Max Cost + Deposit</legend>
				<label>
					<input type="range" min="0" max="10000" step="100" name="cost" value={ props.state.cost } onChange={ props.onChange } />
					<span>{ props.state.cost.toLocaleString() }</span>
				</label>
			</fieldset>
			<fieldset>
				<legend>Minimum Level Filters</legend>
				<LevelFilter cls="COM" val={ props.state.COM } onChange={ props.onChange } />
				<LevelFilter cls="PIL" val={ props.state.PIL } onChange={ props.onChange } />
				<LevelFilter cls="ENG" val={ props.state.ENG } onChange={ props.onChange } />
				<LevelFilter cls="HUN" val={ props.state.HUN } onChange={ props.onChange } />
				<LevelFilter cls="SMU" val={ props.state.SMU } onChange={ props.onChange } />
				<LevelFilter cls="LEA" val={ props.state.LEA } onChange={ props.onChange } />
				<LevelFilter cls="ESP" val={ props.state.ESP } onChange={ props.onChange } />
				<LevelFilter cls="SLI" val={ props.state.SLI } onChange={ props.onChange } />
				<LevelFilter cls="MED" val={ props.state.MED } onChange={ props.onChange } />
				<LevelFilter cls="SCI" val={ props.state.SCI } onChange={ props.onChange } />
			</fieldset>
			<fieldset>
				<legend>Stat Modifiers</legend>
				<p>Enter the stat modifiers you would like to account for. Stats can get up to +2 from random gains, and depending on era you may be able to acquire an additional +1 to +3 from cybernetics.</p>
				<StatFilter stat="STR" val={ props.state.STR } min="0" max="5" prefix="+" onChange={ props.onChange } />
				<StatFilter stat="DEX" val={ props.state.DEX } min="0" max="5" prefix="+" onChange={ props.onChange } />
				<StatFilter stat="CON" val={ props.state.CON } min="0" max="5" prefix="+" onChange={ props.onChange } />
				<StatFilter stat="INT" val={ props.state.INT } min="0" max="5" prefix="+" onChange={ props.onChange } />
				<StatFilter stat="WIS" val={ props.state.WIS } min="0" max="5" prefix="+" onChange={ props.onChange } />
				<StatFilter stat="CHA" val={ props.state.CHA } min="0" max="2" prefix="+" onChange={ props.onChange } />
				<StatFilter stat="LCK" val={ props.state.LCK } min="-10" max="10" prefix={ ( props.state.LCK > 0 ) ? '+' : '' } onChange={ props.onChange } />
			</fieldset>
			<fieldset>
				<legend>Force?</legend>
				<p>If you happen to roll or buy force, you'll get bonus levels depending on your sub-class.  If you'd like to factor these levels in, select the sub-class.</p>
				<label><input type="radio" name="force" value="none" onChange={ props.onChange } checked={ 'none' === props.state.force } /> None</label>
				<label><input type="radio" name="force" value="guardian" onChange={ props.onChange } checked={ 'guardian' === props.state.force } /> Guardian/Juggernaut</label>
				<label><input type="radio" name="force" value="sentinel" onChange={ props.onChange } checked={ 'sentinel' === props.state.force } /> Sentinel/Assassin</label>
				<label><input type="radio" name="force" value="consular" onChange={ props.onChange } checked={ 'consular' === props.state.force } /> Consular/Sorcerer</label>
			</fieldset>
		</form>
	);
}

function ShowRaceClass( props ) {
	return (
		<li className={ 'class-' + props.label + ' ' + ( props.matches ? 'match' : 'nomatch' ) }>
			{ props.label }
			<ol className="levels-row">
				<li className={ 't-' + Math.floor( props.levels.com / 25 ) }>{ props.levels.com }</li>
				<li className={ 't-' + Math.floor( props.levels.pil / 25 ) }>{ props.levels.pil }</li>
				<li className={ 't-' + Math.floor( props.levels.eng / 25 ) }>{ props.levels.eng }</li>
				<li className={ 't-' + Math.floor( props.levels.hun / 25 ) }>{ props.levels.hun }</li>
				<li className={ 't-' + Math.floor( props.levels.smu / 25 ) }>{ props.levels.smu }</li>
				<li className={ 't-' + Math.floor( props.levels.lea / 25 ) }>{ props.levels.lea }</li>
				<li className={ 't-' + Math.floor( props.levels.esp / 25 ) }>{ props.levels.esp }</li>
				<li className={ 't-' + Math.floor( props.levels.sli / 25 ) }>{ props.levels.sli }</li>
				<li className={ 't-' + Math.floor( props.levels.med / 25 ) }>{ props.levels.med }</li>
				<li className={ 't-' + Math.floor( props.levels.sci / 25 ) }>{ props.levels.sci }</li>
			</ol>
		</li>
	)
}

function ShowRace( props ) {
	const race = props.data;

	// If there's a race being searched for and it doesn't match, don't output anything.
	if ( props.query.race.length && ! race.name.toLowerCase().includes( props.query.race.toLowerCase() ) ) {
		return null;
	}

	// Race flags and such:
	if ( props.query.imperial && ! imperialRaces.includes( race.name ) ) {
		return null;
	}

	// If the queried cost is less than what it would cost to roll the race...
	if ( props.query.cost < ( race.price + race.deposit ) ) {
		return null;
	}

	const classes = [
		'COM',
		'PIL',
		'ENG',
		'HUN',
		'SMU',
		'LEA',
		'ESP',
		'SLI',
		'MED',
		'SCI'
	];

	let rows = [];
	let any_valid = false;

	classes.forEach( mainclass => {
		const levels  = props.adjust_levels( race, mainclass );
		const matches = props.check_levels( levels, mainclass );

		if ( matches ) {
			any_valid = true;
		}

		rows.push( <ShowRaceClass key={ race.name + mainclass } race={ race.name } label={ mainclass } levels={ levels } matches={ matches } /> )
	});

	if ( ! any_valid ) {
		return null;
	}

	return (
		<div className={ 'race race-' + race.name + ' ' + ( any_valid ? 'has-results' : 'no-has-results' ) }>
			<h3>
				{ race.name }
				&nbsp;<small>( <kbd>{ race.price.toLocaleString() }</kbd> + <kbd>{ race.deposit.toLocaleString() }</kbd> deposit )</small>
			</h3>
			<dl className="race-stats">
				<dt>Chonk:</dt>
				<dd>
					HP: <kbd>{ race.hp }</kbd>,
					AC: <kbd>{ race.ac }</kbd>
				</dd>
				<dt>Base:</dt>
				<dd>
					STR <kbd>{ race.str }</kbd>,
					DEX <kbd>{ race.dex }</kbd>,
					CON <kbd>{ race.con }</kbd>,
					INT <kbd>{ race.int }</kbd>,
					WIS <kbd>{ race.wis }</kbd>,
					CHA <kbd>{ race.cha }</kbd>
				</dd>
				<dt>Stats:</dt>
				<dd>
					STR <kbd>{ Math.min( 25, 18 + parseInt( race.str ) + parseInt( props.query.STR ) ) }</kbd>,
					DEX <kbd>{ Math.min( 25, 18 + parseInt( race.dex ) + parseInt( props.query.DEX ) ) }</kbd>,
					CON <kbd>{ Math.min( 25, 18 + parseInt( race.con ) + parseInt( props.query.CON ) ) }</kbd>,
					INT <kbd>{ Math.min( 25, 18 + parseInt( race.int ) + parseInt( props.query.INT ) ) }</kbd>,
					WIS <kbd>{ Math.min( 25, 18 + parseInt( race.wis ) + parseInt( props.query.WIS ) ) }</kbd>,
					CHA <kbd>{ Math.min( 25, 18 + parseInt( race.cha ) + parseInt( props.query.CHA ) ) }</kbd>
				</dd>
			</dl>
			<ol className="levels-table">
				<li>
					&nbsp;&nbsp;&nbsp;
					<ol className="levels-row">
						<li>COM</li>
						<li>PIL</li>
						<li>ENG</li>
						<li>HUN</li>
						<li>SMU</li>
						<li>LEA</li>
						<li>ESP</li>
						<li>SLI</li>
						<li>MED</li>
						<li>SCI</li>
					</ol>
				</li>
				{ rows }
			</ol>
			{ race.traits.map( trait => ( <p key={ race.name + trait } className="trait">{ trait }</p> ) ) }
		</div>
	);
}

class App extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			race: '',
			// Cost filters:
			cost: 10000,
			// Flag filters:
			imperial: false,
			// Level filters:
			COM: 1,
			PIL: 1,
			ENG: 1,
			HUN: 1,
			SMU: 1,
			LEA: 1,
			ESP: 1,
			SLI: 1,
			MED: 1,
			SCI: 1,
			// Stat modifiers:
			STR: 0,
			DEX: 0,
			CON: 0,
			INT: 0,
			WIS: 0,
			CHA: 0,
			LCK: 0,
			// Jedi subclasses:
			force: 'none',
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.adjust_levels = this.adjust_levels.bind(this);
		this.check_levels = this.check_levels.bind(this);
	}

	adjust_levels( race, classBeingChecked ) {
		// We need the `{ ...levels }` to make sure we don't modify the original by reference!
		let levels = { ...race.levels[ classBeingChecked.toLowerCase() ] };

		// Make sure we're handling cases where the known level is limited by min/max.
		for ( const [ cls, lvl ] of Object.entries( levels ) ) {
			if ( 150 === lvl ) {
				levels[ cls ] = 200;
			} else if ( 1 === lvl ) {
				levels[ cls ] = -50;
			} else if ( 0 === lvl ) {
				levels[ cls ] = -50;
			}
		}

		// Account for stats maxing out at 25, so 7 over a base of 18.
		const stats = {
			str: Math.min( 7 - race.str, this.state.STR ),
			dex: Math.min( 7 - race.dex, this.state.DEX ),
			con: Math.min( 7 - race.con, this.state.CON ),
			int: Math.min( 7 - race.int, this.state.INT ),
			wis: Math.min( 7 - race.wis, this.state.WIS ),
			cha: Math.min( 7 - race.cha, this.state.CHA ),
			lck: parseInt( this.state.LCK )
		};

		// Apply our level modifiers.
		levels.com += ( stats.str + stats.con);
		levels.pil += ( stats.dex * 2 );
		levels.eng += ( stats.int * 2 );
		levels.hun += ( stats.con * 2 );
		levels.smu += ( ( stats.lck * 2 ) + stats.cha );
		levels.lea += ( stats.cha + stats.wis );
		levels.esp += ( stats.dex + stats.lck );
		levels.sli += ( stats.wis + stats.lck );
		levels.med += ( stats.int + stats.wis );
		levels.sci += ( stats.int * 2 );

		// If this character could feasibly use the force...
		if ( ( 'HUN' !== classBeingChecked ) && ! race.traits.includes( 'Force Insensitivity - This race cannot use the Force.' ) ) {
			if ( 'guardian' === this.state.force ) {
				levels.com += 70;
				levels.pil += 20;
				levels.esp += 30;
			} else if ( 'sentinel' === this.state.force ) {
				levels.com += 40;
				levels.smu += 50;
				levels.sli += 30;
			} else if ( 'consular' === this.state.force ) {
				levels.com += 40;
				levels.eng += 30;
				levels.lea += 50;
			}
		}

		for ( const [ cls, lvl ] of Object.entries( levels ) ) {
			if ( lvl > 150 ) {
				levels[ cls ] = 150;
			} else if ( lvl < 1 ) {
				levels[ cls ] = 1;
			}
		}

		return levels;
	}

	check_levels( levels, classBeingChecked ) {
		let failures = [];

		if ( levels.com < this.state.COM ) failures.push( 'COM' );
		if ( levels.pil < this.state.PIL ) failures.push( 'PIL' );
		if ( levels.eng < this.state.ENG ) failures.push( 'ENG' );
		if ( levels.hun < this.state.HUN ) failures.push( 'HUN' );
		if ( levels.smu < this.state.SMU ) failures.push( 'SMU' );
		if ( levels.lea < this.state.LEA ) failures.push( 'LEA' );
		if ( levels.esp < this.state.ESP ) failures.push( 'ESP' );
		if ( levels.sli < this.state.SLI ) failures.push( 'SLI' );
		if ( levels.med < this.state.MED ) failures.push( 'MED' );
		if ( levels.sci < this.state.SCI ) failures.push( 'SCI' );

		if ( 0 === failures.length ) {
			return true;
		} else if ( 1 === failures.length ) {
			if ( 'LEA' === classBeingChecked ) {
				// Maybe a pass if the gap is less than thirty levels and it's a leadership class we're checking?
				switch ( failures[0] ) {
					case 'COM':
						return ( levels.com + 30 ) > this.state[ failures[0] ];
					case 'PIL':
						return ( levels.pil + 30 ) > this.state[ failures[0] ];
					case 'ENG':
						return ( levels.eng + 30 ) > this.state[ failures[0] ];
					case 'HUN':
						return false; // Can't be a BH focus.
					case 'SMU':
						return ( levels.smu + 30 ) > this.state[ failures[0] ];
					case 'LEA':
						return false; // Can't be a leadership focus.
					case 'ESP':
						return ( levels.esp + 30 ) > this.state[ failures[0] ];
					case 'SLI':
						return ( levels.sli + 30 ) > this.state[ failures[0] ];
					case 'MED':
						return ( levels.med + 30 ) > this.state[ failures[0] ];
					case 'SCI':
						return ( levels.sci + 30 ) > this.state[ failures[0] ];
					default:
						return false;
				}
			}
		}

		return false;
	}

	handleInputChange( event ) {
		const target = event.target;
		const name = target.name;

		let value = target.value;
		if ( 'search' === target.type ) {
			value = target.value;
		} else if ( 'checkbox' === target.type ) {
			value = target.checked;
		} else if ( 'range' === target.type ) {
			value = parseInt( target.value, 10 );
		} else if ( 'radio' === target.type ) {
			if ( target.checked ) {
				value = target.value;
			} else {
				// If it's unchecked don't set anything as the one that just got selected will set it.
				return;
			}
		}

		this.setState( {
			[ name ]: value
		} );
	}

	render() {
		return (
			<div>
				<RacesForm onChange={ this.handleInputChange } state={ this.state } />
				<div className="results-list">
					{ races.map( race => <ShowRace key={ race.name } data={ race } adjust_levels={ this.adjust_levels } check_levels={ this.check_levels } query={ this.state } /> ) }
				</div>
			</div>
		);
	}
}

export default App;
