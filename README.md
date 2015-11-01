#### Introduction
We hired a new office assistant lately. I asked her to put a meeting in my calendar and invite the client to the event as well. She made a typo and as a result the client showed up too late, which is okay because she's human and humans make mistakes now and then...

But wait.. What if you could have about the same experience as with a physical someone but let a computer do all the work instead. If that would work well it could be a lot more accurate and well, a computer doesn't ask for a payslip every month.

`Hey Sarah`<br>
`Yes?`

`Sarah, who are you?`<br>
`I'm Sarah, your virtual office assistant`

`Sarah, what can you do?`<br>
`I can do all sorts of things like planning events, control office stuff like the lights and much more. I'm also hooked up to the Wolfram API so I am also able to answer questions like "what is 2 + 2" and "what is the distance from here to the moon".`

`Sarah, can you plan an event?`<br>
`What time is the event?`<br>
`2pm`<br>
`What date is the event?`<br>
`tomorrow`<br>
`Who is attending?`<br>
`Me, dave and joseph from Microsoft`<br>
`I created the following event for you`

Awesome, but how is this different from for example Siri? Well for starters its not a PA, it an office assistant. And its extendable with anything you want, so it can do more than Siri will ever be able to, like checking your bank balance, preparing transfers, controlling your office's lights and temprature and so much more.

`Sarah, whats our current balance`<br>
`2 million euro's and 5 cents`

Sarah, your new extendable office assistant.

#### Extra Info
We wanted to make Duxbot easy to setup which is why you can use it on your laptop. To get the most out of Duxbot however you would have to hang strong proximity microphones in your office so Sarah can listen to you where-ever you are.

Imagine standing in the conference room and saying `Sarah, start a new conference call and dim the lights` after which `Google Hangouts` pops up on the screen and the lights dim.

#### Business Plan
In the future you can use Duxbot for a very small monthly payment of `$10`. This is what you pay to be able to use the core. The extentions however are open source which means anyone can build on the Duxbot platform. The official extention repository would be actively maintained so anyone can file a pull request and contribute which means anyone can help make Duxbot better.

#### Setup
```
git clone git@github.com:duxilio/duxbot-client.git
cd duxbot-client
sudo npm i
gulp
```
