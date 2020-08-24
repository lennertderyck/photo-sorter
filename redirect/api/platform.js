// module.exports.handler = (event, context, callback) => Promise.resolve(event)
//   // .then(doStuffWithTheEventObject)
//   .then(() => callback(null, {
//     statusCode: 302,
//     headers: {
//       Location: 'https://gohere.com',
//     },
//   })) // Success!
//   .catch(callback)
  
  export default (req, res) => {
    // header
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Location', 'https://gohere.com')
    
    const {name} = req.query
    
    // return data
    if (test == true) {
        res.status(200).send(creds)
    } else {
        res.status(200).send({
            redirect: 'https://gohere.com'
        })
    }
}