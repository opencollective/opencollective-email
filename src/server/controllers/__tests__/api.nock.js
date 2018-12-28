import nock from 'nock';

nock('https://sw.api.mailgun.net:443', { encodedQueryParams: true })
  .get(
    '/v3/domains/citizenspring.be/messages/eyJwIjpmYWxzZSwiayI6Ijg0NWQ3Y2ZmLWRiZDgtNGIwYS1iNTZhLWUzNmZmYzNhN2E3NSIsInMiOiI1YTY3MmZjMDkxIiwiYyI6InRhbmtiIn0=',
  )
  .reply(
    200,
    {
      Received:
        'by mail-lf1-f46.google.com with SMTP id c16so8874024lfj.8        for <testgroup+tag1@citizenspring.be>; Mon, 24 Dec 2018 16:21:24 -0800 (PST)',
      'stripped-signature': '',
      From: 'Xavier Damman <xdamman@gmail.com>',
      'X-Envelope-From': '<xdamman@gmail.com>',
      recipients: 'testgroup+tag1@citizenspring.be',
      attachments: [],
      'X-Google-Dkim-Signature':
        'v=1; a=rsa-sha256; c=relaxed/relaxed;    d=1e100.net; s=20161025;        h=x-gm-message-state:mime-version:references:in-reply-to:reply-to         :from:date:message-id:subject:to:cc;        bh=XcTyoKQjeUStOm4c1GzTIO95AKepW/LSHVd3r8V7xFc=;        b=rwFWPnH8oPkVZmSNcSa5zSJdkiaPPoKaSnBryZUjAiHKSiMCkjPFEcnTtbVIg5tDRh         TJJraQPNXGM7u01x+xW1E3W1QivLS3vs9tWuTay6M0fCOh6tAGIe4Nym8n01KPsbK6u9         La1iuUvwJxxyr8nBHFK5BijGlAgtEAuipGagSDlPWB8YVeEkmG42O7CO1f4oQ7wAnV7s         uS4GRwmBWi3jkq8cqkDW9BduQ8exxrJqqJ8c2UPpcLPkWi3Uaazrs/kgy860EZfY7uYf         RQwKdCukCKIKWug7pdT2LyPCxoSinoZ8UOQbPmYzZKS451Z8ezxc4oUpWmxhT0Jkx2nz         7cIw==',
      To: 'Xavier Damman <xdamman@opencollective.com>, xdamman+org@opencollective.org',
      'message-headers': [
        ['X-Mailgun-Spam-Rules', 'DKIM_SIGNED, DKIM_VALID, DKIM_VALID_AU, DKIM_VALID_EF, FREEMAIL_FROM, HTML_MESSAGE'],
        ['X-Mailgun-Dkim-Check-Result', 'Pass'],
        ['X-Mailgun-Spf', 'Neutral'],
        ['X-Mailgun-Sscore', '-0.2'],
        ['X-Mailgun-Sflag', 'No'],
        ['X-Mailgun-Incoming', 'Yes'],
        ['X-Envelope-From', '<xdamman@gmail.com>'],
        [
          'Received',
          'from mail-lf1-f46.google.com (mail-lf1-f46.google.com [209.85.167.46]) by mxa.mailgun.org with ESMTP id 5c217805.7fa12d328430-smtp-in-n01; Tue,25 Dec 2018 00:21:25 -0000 (UTC)',
        ],
        [
          'Received',
          'by mail-lf1-f46.google.com with SMTP id c16so8874024lfj.8        for <testgroup+tag1@citizenspring.be>; Mon, 24 Dec 2018 16:21:24 -0800 (PST)',
        ],
        [
          'Dkim-Signature',
          'v=1; a=rsa-sha256; c=relaxed/relaxed;       d=gmail.com; s=20161025;        h=mime-version:references:in-reply-to:reply-to:from:date:message-id         :subject:to:cc;        bh=XcTyoKQjeUStOm4c1GzTIO95AKepW/LSHVd3r8V7xFc=;        b=uSXOFVQ8hD7a/QlCViuETnWL6zt75Atj3tIhp5ycZ/Ar011y3TYCfg2tI9GYPnsyf/         fTjH1OZXCdUYl+KI6Q0yafCtGZraZo/0mIgAI8kyEvLFHp6mkMXsl970RtDUgmqaX/On         XvzBFxfB8jxBafcVuDyistpBM9bxO5MdQoejPZRiE6sUsVMDKpVJqPhik+zweMsVl4wd         jAx3wuGCDeylrcQfLgr4DTfItWD9iUb5ITOg6rBWiTCNx3lPsDi2tKqZQyD2obTZcJmC    a2j1EneaNmJ6BFKcH43DKK9ekJCduH1Bz5l94Mo2NC1hZcImtJOiOzpJYfuOSRGBWdQi         Uxng==',
        ],
        [
          'X-Google-Dkim-Signature',
          'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20161025;        h=x-gm-message-state:mime-version:references:in-reply-to:reply-to         :from:date:message-id:subject:to:cc;        bh=XcTyoKQjeUStOm4c1GzTIO95AKepW/LSHVd3r8V7xFc=;        b=rwFWPnH8oPkVZmSNcSa5zSJdkiaPPoKaSnBryZUjAiHKSiMCkjPFEcnTtbVIg5tDRh         TJJraQPNXGM7u01x+xW1E3W1QivLS3vs9tWuTay6M0fCOh6tAGIe4Nym8n01KPsbK6u9         La1iuUvwJxxyr8nBHFK5BijGlAgtEAuipGagSDlPWB8YVeEkmG42O7CO1f4oQ7wAnV7s         uS4GRwmBWi3jkq8cqkDW9BduQ8exxrJqqJ8c2UPpcLPkWi3Uaazrs/kgy860EZfY7uYf         RQwKdCukCKIKWug7pdT2LyPCxoSinoZ8UOQbPmYzZKS451Z8ezxc4oUpWmxhT0Jkx2nz       7cIw==',
        ],
        [
          'X-Gm-Message-State',
          'AA+aEWbZIyFiJ7w4BTwj7buobrqkoQ/Gp04oUmIwcgdYCDcA6IP6ugcf\tPKcfCwL7HbM3V3+m2IKOQtSlbABuHh6w62/6U38=',
        ],
        [
          'X-Google-Smtp-Source',
          'AFSGD/WwRqccidXO1yrdINTTkJPuAVxRLAGe9c01U2VlpQHuLDCGysEtMY8YkTE2X4BGFj7eel4oH1EFMnWhHNjVBmk=',
        ],
        [
          'X-Received',
          'by 2002:a19:aace:: with SMTP id t197mr7083202lfe.7.1545697282753; Mon, 24 Dec 2018 16:21:22 -0800 (PST)',
        ],
        ['Mime-Version', '1.0'],
        [
          'References',
          '<CAFPTvg8Tt6XprvC6YY4qfpH3HBJYLjPg8bMVVQH9uCy6rZ5OUA@mail.gmail.com> <CAA4zAtTyDpa4_jDS1B8z6u4+GnsGRH9PyqwbhHXHfruGgLTqaQ@mail.gmail.com> <CAFPTvg9BSSHWU6-J-=6LBcO29ne_Ae9RfhBbk9sRLSBu6M886g@mail.gmail.com> <CAFPTvg_0yjLYHM0RkbNLrJPEssS3QsGL6M5BjP+=Pj_Kp7fwsA@mail.gmail.com> <CAA4zAtTy3-fOakeJfzJL-W+uGt49CiUuvpXZ7e-sAPNgukoz+Q@mail.gmail.com>',
        ],
        ['In-Reply-To', '<CAA4zAtTy3-fOakeJfzJL-W+uGt49CiUuvpXZ7e-sAPNgukoz+Q@mail.gmail.com>'],
        ['Reply-To', 'xdamman@gmail.com'],
        ['From', 'Xavier Damman <xdamman@gmail.com>'],
        ['Date', 'Tue, 25 Dec 2018 01:21:06 +0100'],
        ['Message-Id', '<CAFPTvg8z6fN88-XMdZGLTQaBgxR8bV3dH9O6BURb7GYL7uyiuA@mail.gmail.com>'],
        ['Subject', 'Re: Hello new thread'],
        ['To', 'Xavier Damman <xdamman@opencollective.com>, xdamman+org@opencollective.org'],
        ['Cc', 'testgroup+tag1@citizenspring.be'],
        ['Content-Type', 'multipart/alternative; boundary="000000000000780ce4057dcdb1f9"'],
      ],
      'Dkim-Signature':
        'v=1;a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20161025;        h=mime-version:references:in-reply-to:reply-to:from:date:message-id         :subject:to:cc;     bh=XcTyoKQjeUStOm4c1GzTIO95AKepW/LSHVd3r8V7xFc=;        b=uSXOFVQ8hD7a/QlCViuETnWL6zt75Atj3tIhp5ycZ/Ar011y3TYCfg2tI9GYPnsyf/         fTjH1OZXCdUYl+KI6Q0yafCtGZraZo/0mIgAI8kyEvLFHp6mkMXsl970RtDUgmqaX/On         XvzBFxfB8jxBafcVuDyistpBM9bxO5MdQoejPZRiE6sUsVMDKpVJqPhik+zweMsVl4wd         jAx3wuGCDeylrcQfLgr4DTfItWD9iUb5ITOg6rBWiTCNx3lPsDi2tKqZQyD2obTZcJmC         a2j1EneaNmJ6BFKcH43DKK9ekJCduH1Bz5l94Mo2NC1hZcImtJOiOzpJYfuOSRGBWdQi         Uxng==',
      'content-id-map': {},
      'Reply-To': 'xdamman@gmail.com',
      'X-Mailgun-Spf': 'Neutral',
      subject: 'Re: Hello new thread',
      'stripped-html':
        '<html><head></head><body><div dir="ltr">Moving <a href="mailto:xdamman%2Btest@brusselstogether.org">xdamman+test@brusselstogether.org</a> to bcc and adding someone else in the to:</div><br></body></html>',
      'X-Mailgun-Sflag': 'No',
      from: 'Xavier Damman <xdamman@gmail.com>',
      sender: 'xdamman@gmail.com',
      Subject: 'Re: Hello new thread',
      'stripped-text': 'Moving xdamman+test@brusselstogether.org to bcc and adding someone else in\r\nthe to:',
      Cc: 'testgroup+tag1@citizenspring.be',
      'X-Mailgun-Incoming': 'Yes',
      'X-Received':
        'by 2002:a19:aace:: with SMTP id t197mr7083202lfe.7.1545697282753; Mon, 24 Dec 2018 16:21:22 -0800 (PST)',
      'X-Gm-Message-State':
        'AA+aEWbZIyFiJ7w4BTwj7buobrqkoQ/Gp04oUmIwcgdYCDcA6IP6ugcf\tPKcfCwL7HbM3V3+m2IKOQtSlbABuHh6w62/6U38=',
      'X-Mailgun-Dkim-Check-Result': 'Pass',
      'body-plain':
        'Moving xdamman+test@brusselstogether.org to bcc and adding someone else in\r\nthe to:\r\n\r\nOn Tue, Dec 25, 2018at 12:57 AM Xavier Damman <xdamman@opencollective.com>\r\nwrote:\r\n\r\n> That worked!\r\n> also ccing xdamman+test@brusselstogether.org fyi\r\n>\r\n> On Tue, Dec 25, 2018 at 12:33 AM Xavier Damman <xdamman@gmail.com> wrote:\r\n>\r\n>> This is the third email\r\n>>\r\n>> Adding some code snippet here:\r\n>>\r\n>> ```\r\n>> npm install opencollective;\r\n>> ```\r\n>>\r\n>> and inline avatar (14Kb):\r\n>> [image:xdamman_avatar_small.png]\r\n>>\r\n>> and file attachment\r\n>>\r\n>> On Tue, Dec 25, 2018 at 12:25 AM Xavier Damman <xdamman@gmail.com> wrote:\r\n>>\r\n>>> This is the third email\r\n>>>\r\n>>> Adding some code snippet here:\r\n>>>\r\n>>> ```\r\n>>> npm install opencollective;\r\n>>> ```\r\n>>>\r\n>>> and inline avatar (14Kb):\r\n>>> [image: xdamman_avatar_small.png]\r\n>>>\r\n>>> On Tue, Dec 25, 2018 at 12:21AM Xavier Damman <\r\n>>> xdamman@opencollective.com> wrote:\r\n>>>\r\n>>>> Replying to all\r\n>>>>\r\n>>>> Xavier Damman\r\n>>>> +14151961201\r\n>>>>\r\n>>>> On Tue, Dec 25, 2018 at 12:19 AM Xavier Damman <xdamman@gmail.com>\r\n>>>> wrote:\r\n>>>>\r\n>>>>> This is a test *message*, first email of the thread with a link\r\n>>>>> <https://opencollective.com>\r\n>>>>>\r\n>>>>> - Xavier\r\n>>>>> Signature 1\r\n>>>>>\r\n>>>>> ---\r\n>>>>> Signature 2\r\n>>>>>\r\n>>>>\r\n',
      'X-Mailgun-Sscore': '-0.2',
      'body-html':
        '<div dir="ltr">Moving <a href="mailto:xdamman%2Btest@brusselstogether.org">xdamman+test@brusselstogether.org</a> to bcc and adding someone else in the to:</div><br><div class="gmail_quote"><div dir="ltr">On Tue, Dec 25, 2018 at 12:57 AM Xavier Damman &lt;<a href="mailto:xdamman@opencollective.com">xdamman@opencollective.com</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left-width:1px;border-left-style:solid;border-left-color:rgb(204,204,204);padding-left:1ex"><div dir="ltr">That worked!<div>also ccing <a href="mailto:xdamman%2Btest@brusselstogether.org" target="_blank">xdamman+test@brusselstogether.org</a> fyi</div></div><br><div class="gmail_quote"><div dir="ltr">On Tue, Dec 25, 2018 at 12:33 AM Xavier Damman &lt;<a href="mailto:xdamman@gmail.com" target="_blank">xdamman@gmail.com</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left-width:1px;border-left-style:solid;border-left-color:rgb(204,204,204);padding-left:1ex"><div dir="ltr"><div dir="ltr">This is the third email<div><br></div><div>Adding some code snippet here:</div><div><br></div><div>```</div><div>npm install opencollective;</div><div>```</div><div><br></div><div>and inline avatar (14Kb):</div><div><div><img alt="xdamman_avatar_small.png" width="88" height="88"><br></div></div><div><br></div><div>and file attachment</div></div></div><br><div class="gmail_quote"><div dir="ltr">On Tue, Dec 25, 2018 at 12:25 AM Xavier Damman &lt;<a href="mailto:xdamman@gmail.com" target="_blank">xdamman@gmail.com</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left-width:1px;border-left-style:solid;border-left-color:rgb(204,204,204);padding-left:1ex"><div dir="ltr">This is the third email<div><br></div><div>Adding some code snippet here:</div><div><br></div><div>```</div><div>npm install opencollective;</div><div>```</div><div><br></div><div>and inline avatar (14Kb):</div><div><div><div><img alt="xdamman_avatar_small.png" width="88" height="88"><br></div></div></div></div><br><div class="gmail_quote"><div dir="ltr">On Tue, Dec 25, 2018 at 12:21 AM Xavier Damman &lt;<a href="mailto:xdamman@opencollective.com" target="_blank">xdamman@opencollective.com</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left-width:1px;border-left-style:solid;border-left-color:rgb(204,204,204);padding-left:1ex"><div dir="ltr">Replying to all<div><br></div><div>Xavier Damman</div><div>+14151961201&nbsp;</div></div><br><div class="gmail_quote"><div dir="ltr">On Tue, Dec 25, 2018 at 12:19 AM Xavier Damman &lt;<a href="mailto:xdamman@gmail.com" target="_blank">xdamman@gmail.com</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left-width:1px;border-left-style:solid;border-left-color:rgb(204,204,204);padding-left:1ex"><div dir="ltr">This is a test <b>message</b>, firstemail of the thread with a <a href="https://opencollective.com" target="_blank">link</a><div><br></div><div>- Xavier</div><div>Signature 1</div><div><br></div><div>---</div><div>Signature 2</div></div>\r\n</blockquote></div>\r\n</blockquote></div>\r\n</blockquote></div>\r\n</blockquote></div>\r\n</blockquote></div>\r\n',
      References:
        '<CAFPTvg8Tt6XprvC6YY4qfpH3HBJYLjPg8bMVVQH9uCy6rZ5OUA@mail.gmail.com> <CAA4zAtTyDpa4_jDS1B8z6u4+GnsGRH9PyqwbhHXHfruGgLTqaQ@mail.gmail.com> <CAFPTvg9BSSHWU6-J-=6LBcO29ne_Ae9RfhBbk9sRLSBu6M886g@mail.gmail.com> <CAFPTvg_0yjLYHM0RkbNLrJPEssS3QsGL6M5BjP+=Pj_Kp7fwsA@mail.gmail.com> <CAA4zAtTy3-fOakeJfzJL-W+uGt49CiUuvpXZ7e-sAPNgukoz+Q@mail.gmail.com>',
      'In-Reply-To': '<CAA4zAtTy3-fOakeJfzJL-W+uGt49CiUuvpXZ7e-sAPNgukoz+Q@mail.gmail.com>',
      Date: 'Tue, 25 Dec 2018 01:21:06 +0100',
      'Message-Id': '<CAFPTvg8z6fN88-XMdZGLTQaBgxR8bV3dH9O6BURb7GYL7uyiuA@mail.gmail.com>',
      'Content-Type': 'multipart/alternative; boundary="000000000000780ce4057dcdb1f9"',
      'X-Google-Smtp-Source':
        'AFSGD/WwRqccidXO1yrdINTTkJPuAVxRLAGe9c01U2VlpQHuLDCGysEtMY8YkTE2X4BGFj7eel4oH1EFMnWhHNjVBmk=',
      'X-Mailgun-Spam-Rules': 'DKIM_SIGNED, DKIM_VALID, DKIM_VALID_AU, DKIM_VALID_EF, FREEMAIL_FROM, HTML_MESSAGE',
      'Mime-Version': '1.0',
    },
    [
      'Content-Type',
      'application/json; charset="utf-8"',
      'Date',
      'Thu, 27 Dec 2018 10:31:14 GMT',
      'Server',
      'nginx',
      'Content-Length',
      '11783',
      'Connection',
      'Close',
    ],
  );
