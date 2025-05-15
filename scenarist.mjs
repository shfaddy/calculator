export default ( ... argv ) => new Scenarist ( ... argv ) .play;

class Scenarist {

constructor ( scenario, player = this ) {

this .play = new Proxy ( typeof ( this .scenario = scenario ) === 'function' ? scenario : function Scenarist () {}, this );
this .player = player;

if ( typeof scenario === 'object' && typeof this .scenario ?.$_producer === 'function' )
this .play ( Symbol .for ( 'producer' ) );

};

apply ( scenario, _, argv ) {

if ( typeof argv [ 0 ] === 'function' && argv [ 0 ] ?.[ Scenarist .#stamp ] === Scenarist .#stamp )
argv .shift ();

if ( scenario === this .scenario )
return Reflect .apply ( this .scenario, this .player .scenario, [

this .player .play,
... argv

] );

if ( ! argv .length )
return typeof this .scenario === 'object' ? this .play ( Symbol .for ( 'director' ) ) : this .play;

const cue = argv .shift ();

let resolution = this .get ( undefined, cue, undefined, argv );

if ( typeof resolution === 'function' && ! argv .cut )
return resolution ( ... argv );

return argv .length ? this .play ( ... argv ) : resolution;

};

static #stamp = Symbol ( '#scenarist/stamp' );

plot = new Map;

get ( _, cue, __, argv = [], set = false ) {

if ( cue === Scenarist .#stamp )
return Scenarist .#stamp;

let direction = typeof cue === 'symbol' ? '$_' + Symbol .keyFor ( cue ) : '$' + cue;

if ( argv ?.length && set === true )
this .scenario [ direction ] = argv .shift ();

let conflict = this .scenario [ direction ];
let resolution;

switch ( typeof conflict ) {

case 'object':
case 'function':

if ( ! this .plot .has ( conflict ) ) {

const scenarist = new this .constructor ( conflict, this );

this .plot .set ( conflict, scenarist );

}

resolution = this .plot .get ( conflict ) .play;

break;

case 'undefined':

if ( cue !== Symbol .for ( 'director' ) )
resolution = this .play (

Symbol .for ( 'director' ), cue, ... Object .assign ( argv, { cut: true } ) .splice ( 0 )

);

else
argv .shift (), resolution;

break;

default:

resolution = conflict;

}

return resolution;

};

set ( _, cue, argv, __ ) {

this .get ( _, cue, __, [ isNaN ( argv ) ? argv : parseFloat ( argv ) ] );
return true;

};

}; // Scenarist
