#!/usr/bin/env node

import Calculator from './index.mjs';
import Scenarist from './scenarist.mjs';
import { createInterface } from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

try {

Scenarist ( new class {

constructor ( ... argv ) { this .argv = argv };

$_producer ( $ ) {

console .log ( "Hello World! This is Shaikh Faddy's Calculator!" );

const { argv } = this;

this .$_director = new Calculator;

this .shell = createInterface ( { input, output } )
.on ( 'line', line => $ ( Symbol .for ( 'process' ), line ) )
.on ( 'SIGINT', () => $ ( Symbol .for ( 'interrupt' ) ) );

if ( argv .length )
$ [ Symbol .for ( 'process' ) ] ( argv .join ( ' ' ) );

$ [ Symbol .for ( 'prompt' ) ] ();

};

$_process ( $, line ) {

try {

const argv = ( line = line .trim () ) .length ? line .split ( /\s+/ ) : [];
const resolution = $ ( ... argv );

switch ( typeof resolution ) {

case 'undefined':

break;

case 'object':

if ( resolution instanceof Array )
console .log ( resolution .join ( '\n' ) );

else
for ( const output in resolution )
console .log ( output, resolution [ output ] );

break;

case 'function':

this .$_director = resolution;

break;

default:

console .log ( resolution );

}

} catch ( error ) {

console .error ( error );

}

if ( ! this .shell )
return process .exit ( 0 );

$ [ Symbol .for ( 'prompt' ) ] ();

};

$_interrupt ( $ ) {

this .shell .line = '';

$ [ Symbol .for ( 'prompt' ) ] ();

};

$_prompt ( $ ) {

let prompt = $ ( Symbol .for ( 'director' ), Symbol .for ( 'prompt' ) );

if ( prompt instanceof Array )
prompt = prompt .join ( '/' );

if ( ! prompt ?.length )
prompt = '';

this .shell .setPrompt ( prompt + ': ' );

this .shell .prompt ();

};

$bye () {

this .shell .close ();

delete this .shell;

return "Okay, bye bye!";

};

} ( ... process .argv .slice ( 2 ) ) );

} catch ( error ) {

console .error ( "Failed to start Shaikh Faddy's Calculator" );
console .error ( error );

}
