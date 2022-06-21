// Profile Page Styling
const activity = document.getElementsByClassName('accomplished')
const remove = document.getElementsByClassName('mistake')

Array.from(remove).forEach(function (element) {
    element.addEventListener('click', function () {
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

Array.from(activity).forEach(function (element) {
    element.addEventListener('click', function () {
        const activity = this.parentNode.childNodes[1].childNodes[1].childNodes[3].innerText
        const feedback = this.parentNode.childNodes[5].value
        console.log(activity, feedback)

        if (feedback.length == 0) {
            alert('Please submit your feedback, or write N/A to continue.')
            return
        }

        fetch('adventureComplete', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'activity': activity,
                'feedback': feedback
            })
        })
            .then(function (response) {
                window.location.reload()
            })
    })
})