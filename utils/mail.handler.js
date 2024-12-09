import Log 	      from '#lib/logger';
import { toSnakeCase } from '#lib/utils'
import telescope  from '#app/utils/telescope';


export const dispatchIf = async (condition, instance, ...args) => {
	if (condition) dispatch(instance, ...args);
}

export const dispatch = async (instance, ...args) => {
	if (instance instanceof Function) {
		instance(...args);
	}
}

export default { dispatch, dispatchIf }