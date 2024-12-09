import schedule from 'node-schedule'
import PaymentService from "#app/service/payment/index";




export function init() {
    // const job = schedule.scheduleJob('*/30 * * * * *', PaymentService.verifyAndUpdateCycle)
    // const job = schedule.scheduleJob('0 0 * * *', PaymentService.verifyAndUpdateCycle)
}

export default { init }