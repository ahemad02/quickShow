import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodemailer.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            image: image_url,
        }

        await User.create(userData);
    }
);

const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
);

const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            image: image_url,
        }

        await User.findByIdAndUpdate(id, userData);
    }
);

const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: "release-seats-delete-booking" },
    { event: "app/checkpayment" },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);

            if (!booking.isPaid) {
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach(seat => {
                    delete show.occupiedSeats[seat];
                })
                show.markModified('occupiedSeats');
                await show.save();
                await Booking.findByIdAndDelete(booking._id);
            }
        })
    }
);

const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email" },
    { event: "app/show.booked" },
    async ({ event, step }) => {

        const { bookingId } = event.data;
        const booking = await Booking.findById(bookingId).populate({ path: "show", populate: { path: "movie", model: "Movie" } }).populate("user");

        await sendEmail({
            to: booking.user.email,
            subject: `Payment Confirmation for: "${booking.show.movie.title}" booked!`,
            body: `<!DOCTYPE html>
            <html>
            <head>
                <title>Payment Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f2f2f2;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333333;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #666666;
                        font-size: 16px;
                        line-height: 1.5;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Payment Confirmation</h1>
                    <p>Hello ${booking.user.name},</p>
                    <p>Thank you for booking "${booking.show.movie.title}".</p>
                    <p>Booking ID: ${booking._id}</p>
                    <p>Payment Status: ${booking.isPaid ? "Paid" : "Not Paid"}</p>
                    <p>Amount: ${booking.amount}</p>
                </div>
            </body>
            </html>`
        })

    });

const sendShowReminders = inngest.createFunction(
    { id: "send-show-reminders" },
    { cron: "0 */8 * * *" },
    async ({ step }) => {
        const now = new Date();
        const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

        const reminderTasks = await step.run('prepare-reminder-tasks', async () => {
            const shows = await Show.find({ showTime: { $gte: windowStart, $lte: in8Hours } }).populate("movie");

            const tasks = [];

            for (const show of shows) {
                if (!show.movie || !show.occupiedSeats) {
                    continue;
                }

                const userIds = [...new Set(Object.values(show.occupiedSeats))];

                if (userIds.length === 0) {
                    continue;
                }

                const users = await User.find({ _id: { $in: userIds } }).select("name email");

                for (const user of users) {
                    tasks.push({
                        userEmail: user.email,
                        userName: user.name,
                        movieTitle: show.movie.title,
                        showTime: show.showTime,
                    });
                }
            }

            return tasks;
        });

        if (reminderTasks.length === 0) {
            return { sent: 0, message: "No reminders to send" };
        }
        const results = await step.run('send-all-reminders', async () => {
            return await Promise.allSettled(reminderTasks.map(task => sendEmail({
                to: task.userEmail,
                subject: `Reminder for: "${task.movieTitle}"`,
                body: `<!DOCTYPE html>
                <html>
                <head>
                    <title>Reminder</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f2f2f2;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 5px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333333;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        p {
                            color: #666666;
                            font-size: 16px;
                            line-height: 1.5;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Reminder</h1>
                        <p>Hello ${task.userName},</p>
                        <p>Reminder for "${task.movieTitle}".</p>
                        <p>Show Time: ${task.showTime}</p>
                    </div>
                </body>
                </html>`
            })));
        });

        const sent = results.filter(result => result.status === "fulfilled").length;
        const failed = results.length - sent;

        return { sent, failed, message: `Sent ${sent} reminders, failed to send ${failed} reminders` };

    }

);

const sendNewShowNotification = inngest.createFunction(
    { id: "send-new-show-notification" },
    { event: "app/show.added" },
    async ({ event }) => {
        const { movieTitle } = event.data;

        const users = await User.find({});

        for (const user of users) {
            const userEmail = user.email;
            const userName = user.name;

            const subject = `New Show Added: "${movieTitle}"`;
            const body = `<!DOCTYPE html>
            <html>
            <head>
                <title>New Show Notification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f2f2f2;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333333;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #666666;
                        font-size: 16px;
                        line-height: 1.5;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>New Show Notification</h1>
                    <p>Hello ${userName},</p>
                    <p>A new show has been added: "${movieTitle}".</p>
                </div>
            </body>
            </html>`;

            await sendEmail({
                to: userEmail,
                subject,
                body
            });


        }

        return { message: `Sent new show notification to ${users.length} users` };


    }
);



export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, releaseSeatsAndDeleteBooking, sendBookingConfirmationEmail, sendShowReminders, sendNewShowNotification];