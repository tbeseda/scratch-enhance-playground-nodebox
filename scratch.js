import http from 'http'

import enhance from '@enhance/ssr'
import styleTransform from '@enhance/enhance-style-transform'

const server = http.createServer(async (req, res) => {
  const store = await (async function ({ req }) {
    return { json: { foo: "bar" } }
  })(req)

  const htm = enhance({
    elements: {
      'my-title': function myTitle() {
        return '<h1>Welcome</h1>'
      },
      'my-greeting': function myGreeting({ html, state }) {
        const { attrs } = state
        const { greeting = 'Hello World' } = attrs
        return html`
    <style>
      :host {
        display: block;
        font-family: Comic Sans MS;
      }
      h1 {
        color: red;
      }
    </style>

    <h2>${greeting}</h2>`
      },
    },
    styleTransforms: [styleTransform],
    initialState: store,
  })

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(htm`<hello-world greeting="Well hi!"></hello-world>`)
})

server.listen(3000, () => {
  console.log('Server is ready!')
})
