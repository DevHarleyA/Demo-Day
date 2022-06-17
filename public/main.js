const activity = document.getElementsByClassName('accomplished')
const remove = document.getElementsByClassName('mistake')

Array.from(remove).forEach(function(element) {
    element.addEventListener('click', function(){
        const activity = this.parentNode.childNodes[1].childNodes[1].childNodes[3].innerText
        console.log(activity)

        fetch('remove', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'activity': activity
            })
        })
        .then(function (response) {
            window.location.reload()
        })
    })
})

document.querySelector("#wrapper > div > div.container > div > div.col- > ol > li:nth-child(1) > p > a > span")