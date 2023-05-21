export const ErrorMessages = {
	NOT_FOUND: (entityName: string) => `Not found: ${entityName} with these params does not exist.`,
	ALREADY_EXIST: (entityName: string) => `${entityName} already exist.`,
	FORBIDDEN: () => 'Access Denied',
	LOGIN_ERROR: () => 'Password or email is incorrect',
};
