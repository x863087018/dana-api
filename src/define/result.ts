export const Result = {
    OK: (result?: any) => {
        return {
            code: '0',
            msg: 'OK',
            data: result,
        }
    },
    error: (result: string) => {
        return {
            code: '500',
            msg: 'ERROR',
            data: result,
        }
    },
    identity: () => {
        return {
            code: '401',
            msg: 'ERROR',
            data: 'Invalid identity',
        }
    },

}