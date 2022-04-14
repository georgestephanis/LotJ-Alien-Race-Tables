import './App.css';
import { Component, Fragment } from 'react';
import races from './races.json';

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
				{ Object.values( props.levels ).map( ( level, index ) => <li key={ props.race + props.label + index } className={ 't-' + Math.floor( level / 25 ) }>{ level }</li> ) }
			</ol>
		</li>
	)
}


function ShowRaceAttrib( props ) {
	return (
		<Fragment>
			<dt>{ props.name }</dt>
			<dd>{ props.desc }</dd>
		</Fragment>
	)
}

function ShowRaceAttribs( props ) {
	if ( 0 === props.attribs.length ) {
		return;
	}
	return (
		<dl className="attribs">
			{ Object.values( props.attribs ).map( attrib => <ShowRaceAttrib name={ attrib.name } desc={ attrib.desc } /> ) }
		</dl>
	)
}

function ShowRace( props ) {
	const race = props.data;

	if ( props.query.race.length && ! race.name.toLowerCase().includes( props.query.race.toLowerCase() ) ) {
		return null;
	}

	const classes = {
		COM: 'combat',
		PIL: 'piloting',
		ENG: 'engineering',
		HUN: 'bounty hunting',
		SMU: 'smuggling',
		LEA: 'leadership',
		ESP: 'espionage',
		SLI: 'slicer',
		MED: 'medical',
		SCI: 'science',
	};

	let rows = [];
	let any_valid = false;

	for ( const [ abbr, name ] of Object.entries( classes ) ) {
		const levels  = props.adjust_levels( race.levels[ name ].levels, abbr );
		const matches = props.check_levels( levels, abbr );

		if ( matches ) {
			any_valid = true;
		}

		rows.push( <ShowRaceClass race={ race.name } label={ abbr } levels={ levels } matches={ matches } /> )
	}

	if ( ! any_valid ) {
		return null;
	}

	return (
		<div className={ 'race race-' + race.name + ' ' + ( any_valid ? 'has-results' : 'no-has-results' ) }>
			<h3>
				{ race.name }
				&nbsp;<small>( <kbd>{ race.price }</kbd> + <kbd>{ race.deposit }</kbd> deposit )</small>
			</h3>
			<dl className="race-stats">
				<dt>Chonk:</dt>
				<dd>
					HP: <kbd>{ race.hp }</kbd>,
					AC: <kbd>{ race.ac }</kbd>
				</dd>
				<dt>Racial:</dt>
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
					STR <kbd>{ 18 + parseInt( race.str ) + parseInt( props.query.STR ) }</kbd>,
					DEX <kbd>{ 18 + parseInt( race.dex ) + parseInt( props.query.DEX ) }</kbd>,
					CON <kbd>{ 18 + parseInt( race.con ) + parseInt( props.query.CON ) }</kbd>,
					INT <kbd>{ 18 + parseInt( race.int ) + parseInt( props.query.INT ) }</kbd>,
					WIS <kbd>{ 18 + parseInt( race.wis ) + parseInt( props.query.WIS ) }</kbd>,
					CHA <kbd>{ 18 + parseInt( race.cha ) + parseInt( props.query.CHA ) }</kbd>
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
			<ShowRaceAttribs attribs={ race.attribs } />
		</div>
	);
}

class App extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			race: '',
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

	adjust_levels( levels, classBeingChecked ) {
		const stats = this.state;
		levels = { ...levels };

		for ( const [ cls, lvl ] of Object.entries( levels ) ) {
			levels[ cls ] = parseInt( lvl );

			if ( 150 === levels[ cls ] ) {
				levels[ cls ] = 200;
			} else if ( 1 === levels[ cls ] ) {
				levels[ cls ] = -50;
			} else if ( 0 === levels[ cls ] ) {
				levels[ cls ] = -50;
			}
		}

		const { STR, DEX, CON, INT, WIS, CHA, LCK, force } = stats;

		levels['1']  += ( parseInt( STR ) + parseInt( CON ) );
		levels['2']  += ( parseInt( DEX ) * 2 );
		levels['3']  += ( parseInt( INT ) * 2 );
		levels['4']  += ( parseInt( CON ) * 2 );
		levels['5']  += ( ( parseInt( LCK ) * 2 ) + parseInt( CHA ) );
		levels['6']  += ( parseInt( CHA ) + parseInt( WIS ) );
		levels['7']  += ( ( parseInt( DEX ) * 2 ) + parseInt( LCK ) );
		levels['8']  += ( ( parseInt( WIS ) * 2 ) + parseInt( LCK ) );
		levels['9']  += ( parseInt( INT ) + parseInt( WIS ) );
		levels['10'] += ( parseInt( INT ) * 2 );

		if ( 'HUN' !== classBeingChecked ) {
			if ( 'guardian' === force ) {
				levels['1'] += 70;
				levels['2'] += 20;
				levels['7'] += 30;
			} else if ( 'sentinel' === force ) {
				levels['1'] += 40;
				levels['5'] += 50;
				levels['8'] += 30;
			} else if ( 'consular' === force ) {
				levels['1'] += 40;
				levels['3'] += 30;
				levels['6'] += 50;
			}
		}

		for ( const [ cls, lvl ] of Object.entries( levels ) ) {
			if ( lvl >= 150 ) {
				levels[ cls ] = 150;
			} else if ( lvl <= 1 ) {
				levels[ cls ] = 1;
			}
		}

		return levels;
	}

	check_levels( levels, classBeingChecked ) {
		let failures = [];

		if ( levels['1']  < this.state.COM ) failures.push( 'COM' );
		if ( levels['2']  < this.state.PIL ) failures.push( 'PIL' );
		if ( levels['3']  < this.state.ENG ) failures.push( 'ENG' );
		if ( levels['4']  < this.state.HUN ) failures.push( 'HUN' );
		if ( levels['5']  < this.state.SMU ) failures.push( 'SMU' );
		if ( levels['6']  < this.state.LEA ) failures.push( 'LEA' );
		if ( levels['7']  < this.state.ESP ) failures.push( 'ESP' );
		if ( levels['8']  < this.state.SLI ) failures.push( 'SLI' );
		if ( levels['9']  < this.state.MED ) failures.push( 'MED' );
		if ( levels['10'] < this.state.SCI ) failures.push( 'SCI' );

		if ( 0 === failures.length ) {
			return true;
		} else if ( 1 === failures.length ) {
			if ( 'LEA' === classBeingChecked && failures[0] !== 'LEA' && failures[0] !== 'HUN' ) {
				// Maybe a pass if the gap is less than thirty levels and it's a leadership class we're checking?
				switch ( failures[0] ) {
					case 'COM':
						return ( levels['1'] + 30 ) > this.state[ failures[0] ];
					case 'PIL':
						return ( levels['2'] + 30 ) > this.state[ failures[0] ];
					case 'ENG':
						return ( levels['3'] + 30 ) > this.state[ failures[0] ];
					case 'HUN':
						return false; // Can't be a BH focus.
					case 'SMU':
						return ( levels['5'] + 30 ) > this.state[ failures[0] ];
					case 'LEA':
						return false; // Can't be a leadership focus.
					case 'ESP':
						return ( levels['7'] + 30 ) > this.state[ failures[0] ];
					case 'SLI':
						return ( levels['8'] + 30 ) > this.state[ failures[0] ];
					case 'MED':
						return ( levels['9'] + 30 ) > this.state[ failures[0] ];
					case 'SCI':
						return ( levels['10'] + 30 ) > this.state[ failures[0] ];
					default:
				}
				return true; // this is a lie, flesh this out to account for the thirty levels.
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
					{ Object.values( races ).sort((a,b) => a.name.localeCompare( b.name ) ).map( race => <ShowRace key={ race.name } data={ race } adjust_levels={ this.adjust_levels } check_levels={ this.check_levels } query={ this.state } /> ) }
				</div>
			</div>
		);
	}
}

export default App;
