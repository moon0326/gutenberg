/**
 * External dependencies
 */
const babel = require( '@babel/core' );
const { flatten } = require( 'lodash' );

/**
 * Internal dependencies
 */
const getIntermediateRepresentation = require( './get-intermediate-representation' );

const getAST = ( source, filename ) => {
	return babel.parse( source, { filename } ).program;
};

const getExportTokens = ( ast ) =>
	ast.body.filter( ( node ) =>
		[
			'ExportNamedDeclaration',
			'ExportDefaultDeclaration',
			'ExportAllDeclaration',
		].some( ( declaration ) => declaration === node.type )
	);

const engine = ( path, code, getIRFromPath = () => {} ) => {
	if ( ! path || ! code ) {
		return {};
	}

	const ast = getAST( code, path );
	const tokens = getExportTokens( ast );
	const ir = flatten(
		tokens.map( ( token ) =>
			getIntermediateRepresentation( path, token, ast, getIRFromPath )
		)
	);

	return { ast, tokens, ir };
};

/**
 * Function that takes code and returns an intermediate representation.
 *
 * @param {string} code The code to parse.
 * @param {Function} [getIRFromPath=noop] Callback to retrieve the
 * Intermediate Representation from a path relative to the file
 * being parsed.
 *
 * @return {Object} Intermediate Representation in JSON.
 */
module.exports = engine;
