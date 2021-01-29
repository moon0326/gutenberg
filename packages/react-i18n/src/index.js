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
// import { createHigherOrderComponent } from '@wordpress/compose';

/** @typedef {import('@wordpress/i18n').I18n} I18n */

const I18nContext = createContext( makeContextValue( defaultI18n ) );

/**
 * @typedef I18nProviderProps
 * @property {I18n} i18n I18n instance
 * @property {import('react').ReactNode} children React children
 */
/**
 * @param {I18nProviderProps} props
 * @return {import('react').ReactElement} React element
 */
export const I18nProvider = ( { children, i18n = defaultI18n } ) => {
	const [ update, forceUpdate ] = useReducer( () => [], [] );

	// rerender translations whenever the i18n instance fires a change event
	useEffect( () => i18n.subscribe( forceUpdate ), [ i18n ] );

	const value = useMemo( () => makeContextValue( i18n ), [ i18n, update ] );

	return (
		<I18nContext.Provider value={ value }>
			{ children }
		</I18nContext.Provider>
	);
};

/**
 * Utility to make a new context value
 *
 * @param {I18n} i18n The I18n instance
 * @return {Object} The context value with bound translation functions
 */
function makeContextValue( i18n ) {
	return {
		__: i18n.__.bind( i18n ),
		_n: i18n._n.bind( i18n ),
		_nx: i18n._nx.bind( i18n ),
		_x: i18n._x.bind( i18n ),
		isRTL: i18n.isRTL.bind( i18n ),
		hasTranslation: i18n.hasTranslation.bind( i18n ),
	};
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
 * React hook providing i18n translate functions
 *
 * @param InnerComponent Component that will receive translate functions as props
 * @return Component enhanced with i18n context
 *
 * @example
 *
 * import { withI18n } from '@automattic/react-i18n';
 * function MyComponent( { __ } ) {
 *   return <div>{ __( 'Translate me.', 'text-domain' ) }</div>;
 * }
 * export default withI18n( MyComponent );
 */
// export const withI18n = createHigherOrderComponent( ( InnerComponent ) => {
// 	return ( props ) => {
// 		const i18n = useI18n();
// 		return <InnerComponent { ...i18n } { ...props } />;
// 	};
// }, 'withI18n' );
