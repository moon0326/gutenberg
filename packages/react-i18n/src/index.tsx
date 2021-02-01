/**
 * WordPress dependencies
 */
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from '@wordpress/element';
import { defaultI18n } from '@wordpress/i18n';
import type { I18n } from '@wordpress/i18n';
import type { ComponentType, PropsWithChildren } from 'react';
import type { Subtract } from 'utility-types';

interface I18nContextProps {
	__: I18n[ '__' ];
	_x: I18n[ '_x' ];
	_n: I18n[ '_n' ];
	_nx: I18n[ '_nx' ];
	isRTL: I18n[ 'isRTL' ];
	hasTranslation: I18n[ 'hasTranslation' ];
}

/**
 * Utility to make a new context value
 */
function makeContextValue( i18n: I18n ): I18nContextProps {
	return {
		__: i18n.__.bind( i18n ),
		_x: i18n._x.bind( i18n ),
		_n: i18n._n.bind( i18n ),
		_nx: i18n._nx.bind( i18n ),
		isRTL: i18n.isRTL.bind( i18n ),
		hasTranslation: i18n.hasTranslation.bind( i18n ),
	};
}

const I18nContext = createContext( makeContextValue( defaultI18n ) );

type I18nProviderProps = PropsWithChildren< { i18n: I18n } >;

export function I18nProvider( props: I18nProviderProps ) {
	const { children, i18n = defaultI18n } = props;
	const [ update, forceUpdate ] = useReducer( () => [], [] );

	// rerender translations whenever the i18n instance fires a change event
	useEffect( () => i18n.subscribe( forceUpdate ), [ i18n ] );

	const value = useMemo( () => makeContextValue( i18n ), [ i18n, update ] );

	return (
		<I18nContext.Provider value={ value }>
			{ children }
		</I18nContext.Provider>
	);
}

/**
 * React hook providing i18n translate functions
 *
 * @example
 *
 * import { useI18n } from '@automattic/react-i18n';
 * function MyComponent() {
 *   const { __ } = useI18n();
 *   return <div>{ __( 'Translate me.', 'text-domain' ) }</div>;
 * }
 */
export const useI18n = () => useContext( I18nContext );

/**
 * React higher order component hook providing i18n translate functions
 *
 * @example
 *
 * import { withI18n } from '@automattic/react-i18n';
 * function MyComponent( { __ } ) {
 *   return <div>{ __( 'Translate me.', 'text-domain' ) }</div>;
 * }
 * export default withI18n( MyComponent );
 */
export function withI18n< P extends I18nContextProps >(
	InnerComponent: ComponentType< P >
) {
	const EnhancedComponent: ComponentType<
		Subtract< P, I18nContextProps >
	> = ( props ) => {
		const i18nProps = useI18n();
		return <InnerComponent { ...( props as P ) } { ...i18nProps } />;
	};
	const innerComponentName =
		InnerComponent.displayName || InnerComponent.name || 'Component';
	EnhancedComponent.displayName = `WithI18n(${ innerComponentName })`;
	return EnhancedComponent;
}
