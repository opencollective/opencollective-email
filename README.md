
# Open Collective Email

The email service for transparent and inclusive open collectives



## Features

**MVP (v1.0)**

- Public website where everyone can see all emails sent to your generic email address (connect through IMAP)

**v1.1**

- Forward email to all followers of the group (only generic group for now)
- Unfollow the group


**Later**

- Create groups and (un)follow them
- Search all emails


## Context

One of the first things that an open collective needs is a way to communicate between themselves but also with the external world.

While most sophisticated groups try to use Slack, they often need to fall back to email because some people in the collective are not comfortable enough with those new tools.

Email is still by far the most inclusive communication tool but it's a pain for everyone.

This Open Collective Email app tries to address that.

### Problems to solve

- Collectives don't have an email for people to reach out to
- When they do, it's not transparent
- Working groups are drowning in email threads
- Hard to search past conversations
- Hard to have a consolidated view of the highlights of a conversation

### What they need:
- a general contact email (info@domain.tld)
- a contact email for each working group (a mailing list)


### How they currently solve this problem?
They mostly use emails (Google Apps). But it quickly becomes unmanageable. Way too many emails, hard to include / remove people.

They tried Slack but it doesn't work for them because at least 10-30% of the people have a hard time to work with it. That's a deal breaker for them.

They also use WhatsApp but there is way too much information that is unstructured.


### Requirements:
- every message should be publicly available online
- people should be able to interact with the system solely by email


## Proposed solution

When sending an email to :group@collective.tld, the email is dispatched to all admins. Anyone can reply or subscribe to follow the thread. Subsequent emails in the thread are only sent to the people who opt in to follow it. Anyone can unfollow the thread at any time. All emails are anyway published online so people can catch up with them at any time.


## Implementation details

### Database

#### Tables

##### Users

- id
- name
- email
- imageUrl
- createdAt
- updatedAt
- deletedAt

##### Groups
- id
- CreatedByUserId
- name
- createdAt
- updatedAt
- deletedAt

##### Relationships

- id
- UserId
- GroupId
- role (ADMIN / FOLLOWER)
- createdAt
- updatedAt
- deletedAt

##### Messages
Based on [MailParser](https://nodemailer.com/extras/mailparser/).

- id
- FromUserId
- GroupId
- headers – a Map object with lowercase header keys
- subject 
- from is an address object for the From: header
- to is an address object for the To: header
- cc is an address object for the Cc: header
- bcc is an address object for the Bcc: header (usually not present)
- date is a Date object for the Date: header
- messageId is the Message-ID value string
- inReplyTo is the In-Reply-To value string
- reply-to is an address object for the Cc: header
- references is an array of referenced Message-ID values
- html is the HTML body of the message. If the message included embedded images as cid: urls then these are all replaced with base64 formatted data: URIs
- text is the plaintext body of the message
- textAsHtml is the plaintext body of the message formatted as HTML

##### Attachments

Based on [MailParser](https://nodemailer.com/extras/mailparser/).

- id
- MessageId
- filename: (if available) file name of the attachment
- contentType: MIME type of the message
- contentDisposition: content disposition type for the attachment, most probably “attachment”
- checksum: a MD5 hash of the message content
- size: message size in bytes
- headers: a Map value that holds MIME headers for the attachment node
- content: a Buffer that contains the attachment contents
- contentId: the header value from ‘Content-ID’ (if present)
- cid: contentId without < and >
- related: if true then this attachment should not be offered for download (at least not in the main attachments list)