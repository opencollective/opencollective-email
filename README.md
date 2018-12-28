# Open Collective Email

The email service for transparent and inclusive open collectives

## Features

- Easily create group emails that anyone can follow linked to your domain name
- Make sure all emails are published online for anyone to follow
- GDPR friendly

## The problem

So you are starting a movement and you are self organizing in different working groups. That's the way to go! But how do you manage communications within and between those groups?
Facebook? Well, it's evil and not inclusive. An increasing number of people are not on Facebook. It's not open source. It's financed by advertisement. It doesn't respect your privacy, etc.

Emails? That's what we all end up using because –like it or not– it's still to this day the most inclusive communication channel. But let's be honest, it's a nightmare. It's spammy, it's hard to search, it's impossible to keep track of who is or is not in this or that mailing list, etc.

Slack? We tried. Maybe you did too. It's too complicated for most people. Also, it's not searcheable and we end up answering the same questions again and again. It hasn't been built for open communities.

So that's why we are starting building this email service to solve that very problem.

## Design principles

- All emails are published publicly on a website
- Anyone can follow any group / thread (since all emails are public anyway)
- To avoid the "oh no, not yet another tool that I have to check", people should be able to interact with the system solely by email. You don't have to know about any website to create or be part of any group
- To optimize for signal Vs noise, by default, you don't receive replies to new threads unless you are explicitly mentioned or you explicitly opted in to follow that thread

## How it works

When sending an email to `:group@youdomain.tld`, the email is dispatched to all admins of the group. Anyone can reply or subscribe to follow the thread. Subsequent emails in the thread are only sent to the people who opt in to follow it. Anyone can unfollow the thread at any time. All emails are anyway published online so people can catch up with them at any time.

### How to create a user?

Just send an email to any group email (`:group@yourdomain.tld`). You will receive an email asking you to confirm the creation of your account.

### How to create a group?

Just send an email to `:group@yourdomain.tld`. If the group doesn't exist, it will ask you to confirm the creation of it. When confirmed, the new group is created and you become the first admin and follower of it. If you cc people, they will be added as admins as well.

### How to join a group?

Send an empty email (empty subject and/or empty body) to the group and you will be added. You can also cc people you want to add (note that in that case they will receive an empty email coming from you).

### How to remove someone?

Any time you receive an email, there is a link in the footer to unsubscribe (either from new emails sent to the group or from new emails in a given thread).

### How to mention someone?

Just add that person in cc. This will make sure that that person receives the email and all future responses to that thread even if that person was not following the group (that person can always opt in to unfollow the thread).

## Install

### Requirements

You need a [Mailgun](https://mailgun.com) account and a Postgres database.

### Running the server

Everything is single repo to make it easy to get the service up and running with all its components.

Just clone the repo then run `npm install` and copy `.env.sample` to `.env` and make sure you update it with your own environment variables. Then just run `npm run dev` and you should be good to go.

## Development

### Stack

The stack is NodeJS, [NextJS](https://www.github.com/zeit/next.js), Postgres.
We are also using Mailgun as the email service (it would be great to also add support for [Haraka](https://github.com/haraka/Haraka) in the future).

### Email

To preview the emails being sent locally, you can run [`npm run maildev`](https://danfarrelly.nyc/MailDev/) then open `http://localhost:1080`. Make sure you set the environment variable `MAILDEV` when running `npm run dev`.

## TODO

- [ ] customize welcome email with code of conduct
- [ ] add support for inline images and attachments

## Features roadmap

The long term goal is to offer all the tools a citizen movement needs to organize.
This includes:

- [x] Install on your own server and domain
- [ ] Make it easy to install on your own server and domain
- [ ] Landing page
- [ ] Wiki
- [ ] Let people register to follow your updates
- [ ] Let people register as volunteers
- [ ] Let people create and register to working groups
- [ ] Let people post messages to working groups
- [ ] Let people post expenses to working groups
- [ ] Let people donate
- [x] Open Source (MIT License)
- [x] Open Data (your own database)
