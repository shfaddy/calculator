import Formula from './formula.mjs';

export default class Calculator extends Set {

constructor ( details ) {

super ();

this .name = details ?.name;
this .manifest = details ?.manifest;
this .binder = details ?.binder;

};

$_producer ( $ ) {

switch ( typeof this .manifest ) {

case 'object':

return Object .entries ( this .manifest ) .forEach ( ( [ calculator, manifest ] ) => {

switch ( typeof manifest ) {

case 'string':

return $ .$ ( calculator, ... manifest .trim () .split ( /\s+/ ) );

default:

return $ [ '#' ] ( calculator, manifest );

}

} );

case 'string':
case 'number':

return $ [ '=' ] ( this .manifest .toString () );

}

};

result = 0;

$_director ( $, ... argv ) {

if ( ! argv .length )
return this .result;

if ( ! this .has ( argv [ 0 ] ) )
throw $ [ Symbol .for ( 'prompt' ) ] ( "Unknown calculator: " + argv .shift () );

return $ [ Symbol .for ( 'calculator/' + argv .shift () ) ] ( ... argv );

};

[ '$=' ] ( $, ... argv ) {

this .result = $ [ Symbol .for ( 'parse' ) ] ( argv .shift () );

return $ ( ... argv );

};

$_parse ( $, input ) {

if ( input === '$' )
return this .result;

if ( isNaN ( input ) )
return $ ( ... input .split ( '/' ) );

return parseFloat ( input );

};

[ '$#' ] ( $, ... argv ) {

if ( ! argv .length )
throw "New calculator name is missing";

const calculator = argv .shift ();

if ( this .has ( calculator ) )
throw `Calculator #${ calculator } already exists`;

this [ '$_calculator/' + calculator ] = new this .constructor ( {

name: calculator,
manifest: typeof argv [ 0 ] === 'object' ? argv .shift () : undefined,
binder: $

} );

this .add ( calculator );

return $ [ Symbol .for ( 'calculator/' + calculator ) ] ( ... argv );

};

$$ ( $, formula, ... equation ) {

if ( formula === undefined )
return $ ();

if ( ! equation .length && ! this .has ( formula ) )
throw "Unknown formula";

if ( equation .length )
this [ '$_calculator/' + formula ] = new Formula ( { calculator: $ }, ... equation );

this .add ( formula );

return $ [ Symbol .for ( 'calculator/' + formula ) ] ();

};

[ '$+' ] ( $, ... argv ) {

this .result += $ [ Symbol .for ( 'parse' ) ] ( argv .shift () );

return $ ( ... argv );

};

[ '$-' ] ( $, ... argv ) {

this .result -= $ [ Symbol .for ( 'parse' ) ] ( argv .shift () );

return $ ( ... argv );

};

[ '$*' ] ( $, ... argv ) {

this .result *= $ [ Symbol .for ( 'parse' ) ] ( argv .shift () );

return $ ( ... argv );

};

[ '$/' ] ( $, ... argv ) {

this .result /= $ [ Symbol .for ( 'parse' ) ] ( argv .shift () );

return $ ( ... argv );

};

[ '$**' ] ( $, ... argv ) {

this .result **= $ [ Symbol .for ( 'parse' ) ] ( argv .shift () );

return $ ( ... argv );

};

[ '$%' ] ( $, ... argv ) {

this .result %= $ [ Symbol .for ( 'parse' ) ] ( argv .shift () );

return $ ( ... argv );

};

static #binder = Symbol ();

$fetch ( $, ... argv ) {

if ( argv .length && argv .shift () !== this .constructor .#binder )
argv .splice ( 0 );

return [

this .result,
... [ ... this ] .map (

calculator => `${ [ ... argv, calculator ] .join ( '/' ) } = ${ $ [ Symbol .for ( 'calculator/' + calculator ) ] .fetch ( this .constructor .#binder, ... argv, calculator ) .join ( '\n' ) }`

)

];

};

$name ( $, name = this .name ) {

return this .name = name;

};

[ '$.' ] ( $, ... argv ) {

return ! argv .length ? $ : $ ( ... argv );

};

[ '$..' ] ( $, ... argv ) {

return ! argv .length ? this .binder || $ : ( this .binder || $ ) ( ... argv );

};

$_prompt ( $, ... argv ) {

return [

$ [ Symbol .for ( 'location' ) ] (),
... argv

] .join ( ': ' );

};

$_location () {

if ( ! this .binder )
return this .name ?.length ? [ this .name ] : [];

return [ ... this .binder [ Symbol .for ( 'location' ) ] (), this .name ];

};

};
