const cron = require('node-cron')
const Task = require('./models/task');
const User = require('./models/user');
const twilio = require('twilio')

const updatePriority = async ()=>{
    try{
        const today = new Date().toISOString().slice(0,10);
        const tasksToUpdate = await Task.find({
            due_date : today ,
            priority : 3,
        })
        for(const task of tasksToUpdate){
            task.priority = 2
            await task.save();
            console.log(`Task ${task._id} priority updated to 2 medium`)
        }
    }
    catch(err){
        console.log('Error updating prioritize:',err)
    }
}

const priorityUpdateCron = cron.schedule('0 0 * * *',updatePriority)

const voiceCall = async ()=>{
    try{
        const today = new Date().toISOString().slice(0,10);
        const overdueTasks = await Task.find({
            due_date : {$lt : today},
        }).sort({priority : 1})

        for (const task of overdueTasks)
        {
            const user = await User.findById(task.userId)
            const userPriority = user.priority

            const previousUserAttended = false
            if(!previousUserAttended)
            {
                const accountSid = process.env.ACCOUNT_SID
                const authToken = process.env.AUTH_TOKEN
                const fromNumber = process.env.PHONE_NUMBER
                const toNumber = user.phone_number

                const client = new twilio(accountSid,authToken)

                const call = await client.calls.create({
                    url : 'http://demo.twilio.com/docs/voice.xml',
                    to : toNumber,
                    from : fromNumber
                });

                console.log(`voice call initiated for task ${task_id} , priority : ${userPriority}`)
            }
            else{
                console.log(`Skipping call for Task ${task._id} as previous user attended`)
            }
        }
    }
    catch (err) {
        console.error('Error making voice calls:', err);
    }
}

const voiceCallCron = cron.schedule('*/5 * * * *',voiceCall)


module.exports = {priorityUpdateCron,voiceCallCron}