require("dotenv").config();

const Imap = require("imap");
const inspect = require("util").inspect;
const MailParser = require("mailparser-mit").MailParser;
let mailparser = new MailParser();
const imap = new Imap({
  user: process.env.EMAIL,
  password: process.env.PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true
});

// setup an event listener when the parsing finishes
mailparser.on("end", function(mail_object) {
  console.log(
    "\n**************************************************************************\n\n"
  );
  console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
  console.log("Subject:", mail_object.subject); // Hello world!
  console.log("Text body:", mail_object.text); // How are you today?
});

imap.once("ready", function() {
  imap.openBox("INBOX", true, function(err, box) {
    if (err) throw err;
    var f = imap.seq.fetch("1:3", {
      bodies: "HEADER.FIELDS (TO FROM SUBJECT)", // or '' to fetch headers + body
      // bodies: "",
      struct: true
    });
    f.on("message", function(msg, seqno) {
      console.log("Message #%d", seqno);
      var prefix = "(#" + seqno + ") ";
      msg.on("body", function(stream, info) {
        var buffer = "";
        stream.on("data", function(chunk) {
          buffer += chunk.toString("utf8");
        });
        stream.once("end", function() {
          mailparser.write(buffer);
          console.log(buffer);
          mailparser.end();
          // console.log(
          //   prefix + "Parsed header: %s",
          //   inspect(Imap.parseHeader(buffer))
          // );
        });
      });
      msg.once("attributes", function(attrs) {
        // console.log(prefix + "Attributes: %s", inspect(attrs, false, 8));
      });
      msg.once("end", function() {
        console.log(prefix + "Finished");
      });
    });
    f.once("error", function(err) {
      console.log("Fetch error: " + err);
    });
    f.once("end", function() {
      console.log("Done fetching all messages!");
      imap.end();
    });
  });
});

imap.once("error", function(err) {
  console.log(err);
});

imap.once("end", function() {
  console.log("Connection ended");
});

console.log(">>> connecting to email", process.env.EMAIL);
imap.connect();
