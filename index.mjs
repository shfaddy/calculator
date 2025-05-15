export default class Calculator extends Set {

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

constructor ( name, descriptor = {}, binder ) {

super ();

this .name = name;
this .descriptor = descriptor;
this .binder = binder;

};

$_producer ( $ ) {

switch ( typeof this .descriptor ) {

case 'object':

return Object .entries ( this .descriptor ) .forEach ( ( [ calculator, descriptor ] ) => {

switch ( typeof descriptor ) {

case 'string':

return $ .$ ( calculator, ... descriptor .trim () .split ( /\s+/ ) );

default:

return $ [ '#' ] ( calculator, descriptor );

}

} );

case 'string':
case 'number':

return $ [ '=' ] ( this .descriptor .toString () );

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

if ( input .startsWith ( '$' ) )
return $ .$ ( input .slice ( 1 ) );

else
return $ ( ... input .split ( '/' ) );

return parseFloat ( input );

};

[ '$#' ] ( $, ... argv ) {

if ( ! argv .length )
throw "New calculator name is missing";

const calculator = argv .shift ();

if ( this .has ( calculator ) )
throw `Calculator #${ calculator } already exists`;

this [ '$_calculator/' + calculator ] = new this .constructor (

calculator,
typeof argv [ 0 ] === 'object' ? argv .shift () : undefined,
$

);

this .add ( calculator );

return $ [ Symbol .for ( 'calculator/' + calculator ) ] ( ... argv );

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

calculator => `#${ [ ... argv, calculator ] .join ( '/' ) } = ${ $ [ Symbol .for ( 'calculator/' + calculator ) ] .fetch ( this .constructor .#binder, ... argv, calculator ) .join ( '\n' ) }`

),
... $ .$ ()

];

};

formula = new Map;

$$ ( $, formula, ... equation ) {

if ( formula === undefined )
return [ ... this .formula ] .map (

( [ formula, equation ] ) => `$${ formula } = ${ equation .join ( ' ' ) }`

);

if ( ! equation .length && ! this .formula .has ( formula ) )
throw "Unknown formula";

if ( ! equation .length )
return $ [ '=' ] ( ... this .formula .get ( formula ) );

this .formula .set ( formula, equation );

return true;

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

};
