import mailjet from "node-mailjet";


export default function sendMail(email, title, body, html,  cb )
{
  const transporter =   mailjet.connect('02df09b469b7721eb9913cf94fb05756', '5fa9b3653f97030f72e3f12efec04a9a')
const request = transporter
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "lovegupta2001@gmail.com",
        "Name": "Shreesh"
      },
      "To": [
        {
          "Email": email
        }
      ],
      "Subject": title,
      "TextPart": "",
      "HTMLPart": html,
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
    cb()
  })
  .catch((err) => {
    console.log(err.statusCode)
    cb("error occured.");
  })

}

