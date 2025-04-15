const BASE_URL = 'http://localhost:3000'

const getDownloadLink = async(url)=>{
    const downlodLinkElement = document.getElementById('downloadLink')
    downlodLinkElement.innerHTML = `<button disabled class="btn btn-success" download>Loading...</button>`;
    console.log('url inside func is :', url)
    try {
        const response = await fetch(`${BASE_URL}/api/download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            videoUrl: url
          })
        })
        const data = await response.json()
        console.log(data)
        return data?.downloadUrl || "No download link found. Try again later"
      } catch (error) {
        console.log(error)
        return error
      }
}

// To remove the download link when the user enters a new url (User Experience)
document.getElementById('exampleUrl').addEventListener('input', (e)=>{
    const downlodLinkElement = document.getElementById('downloadLink')
    downlodLinkElement.innerHTML = ``;
})

document.getElementById('downloadBtn').addEventListener('click', async(e)=>{
    e.preventDefault()
    url = document.getElementById('exampleUrl').value
    let downloadLink = await getDownloadLink(url)
    downloadLink = `${BASE_URL}${downloadLink}`
    console.log('download link is : ', downloadLink)
    const downlodLinkElement = document.getElementById('downloadLink')
    downlodLinkElement.innerHTML = `<a href="${downloadLink}" class="btn btn-success" download>Download Video</a>`;
})