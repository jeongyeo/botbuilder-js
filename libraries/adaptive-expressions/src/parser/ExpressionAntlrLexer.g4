lexer grammar ExpressionAntlrLexer;

@lexer::members {
  ignoreWS = true;      // usually we ignore whitespace, but inside stringInterpolation, whitespace is significant
}


@header {/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */}

fragment LETTER : [a-zA-Z];
fragment DIGIT : [0-9];

fragment OBJECT_DEFINITION: '{' ((WHITESPACE) | ((IDENTIFIER | STRING) ':' ( STRING | ~[{}\r\n'"`] | OBJECT_DEFINITION)+))* '}';

STRING_INTERPOLATION_START : '`' { this.ignoreWS = false;} -> pushMode(STRING_INTERPOLATION_MODE);

// operators
PLUS: '+';

SUBSTRACT: '-';

NON: '!';

XOR: '^';

ASTERISK: '*';

SLASH: '/';

PERCENT: '%';

DOUBLE_EQUAL: '==';

NOT_EQUAL: '!=' | '<>';

SINGLE_AND: '&';

DOUBLE_AND: '&&';

DOUBLE_VERTICAL_CYLINDER: '||';

LESS_THAN: '<';

MORE_THAN: '>';

LESS_OR_EQUAl: '<=';

MORE_OR_EQUAL: '>=';

OPEN_BRACKET: '(';

CLOSE_BRACKET: ')';

DOT: '.';

OPEN_SQUARE_BRACKET: '[';

CLOSE_SQUARE_BRACKET: ']';

OPEN_CURLY_BRACKET: '{';

CLOSE_CURLY_BRACKET: '}';

COMMA: ',';

COLON: ':';

ARROW: '=>';

NULL_COALESCE: '??';

QUESTION_MARK: '?';

NUMBER : DIGIT + ( '.' DIGIT +)? ;

WHITESPACE : (' '|'\t'|'\ufeff'|'\u00a0') {this.ignoreWS}? -> skip;

IDENTIFIER : (LETTER | '_' | '#' | '@' | '@@' | '$' | '%') (LETTER | DIGIT | '_')*;

NEWLINE : '\r'? '\n' -> skip;

STRING : ('\'' (('\\'('\''|'\\'))|(~'\''))*? '\'') | ('"' (('\\'('"'|'\\'))|(~'"'))*? '"');

INVALID_TOKEN_DEFAULT_MODE : . ;

mode STRING_INTERPOLATION_MODE;

STRING_INTERPOLATION_END : '`' {this.ignoreWS = true;} -> type(STRING_INTERPOLATION_START), popMode;

TEMPLATE : '$' '{' (STRING | OBJECT_DEFINITION | ~[\r\n{}'"`])+ '}';

ESCAPE_CHARACTER : '\\' ~[\r\n]?;

TEXT_CONTENT : . ;