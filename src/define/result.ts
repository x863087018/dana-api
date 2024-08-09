export const Result = {
    OK: (result?: any) => {
        return {
            code: '0',
            msg: 'OK',
            data: result,
        }
    },
    error: (result?: any) => {
        return {
            code: '500',
            msg: 'ERROR',
            data: result,
        }
    }
}