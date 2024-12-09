// import RequestHandler from '#app/utils/RequestHandler';


export const asyncRequestExceptionWrapper = (controller) => {
    // return async (req, res, next) => await controller(req, res, next)
    return async (req, res, next) => await controller(req, res, next).catch(next)
}


// export const handleAsyncError = (controller) => {
//     return async (req, res, next) => {
//             return await controller(req, res, next).catch(next);;
//         // try {
//         //     return await controller(req, res, next)
//         // } catch (err) {
//         //     return RequestHandler.sendError(req, res, err);
//         // }
//     };
// }
