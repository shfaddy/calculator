export default class Maitre {

request = [];

constructor ( details ) {

if ( typeof details ?.request [ Symbol .iterator ] === 'function' )
this .request = [ ... details .request ];

};

$_producer ( $ ) {

if ( this .request .length )
this .ready = $ [ Symbol .for ( 'serve' ) ] ( this .request .splice ( 0 ) .join ( ' ' ) )

else
$ ( Symbol .for ( 'prompt' ) );

};

async $_serve ( $, ... message ) {

if ( ! message .length )
return;

let line = message .shift ();
let done = false;

try {

const request = ( line = line .trim () ) .length ? line .split ( /\s+/ ) : [];
const response = $ ( ... request );

if ( typeof response === 'function' )
this .$_director = response;

else
await $ ( Symbol .for ( 'response' ), response );

done = true;

} catch ( error ) {

await $ ( Symbol .for ( 'apologize' ), error );

}

$ ( Symbol .for ( 'prompt' ) );

return $ [ Symbol .for ( 'serve' ) ] ( ... message );

};

};
