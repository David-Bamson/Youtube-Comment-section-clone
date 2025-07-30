const input = document.getElementById('inputBox');
const commentContainer = document.getElementById('commentContainer');

function addComment() {
    const commentText = input.value;

    if(commentText.length >= 10000) {
        alert = " Exceeds Character Limit ";
        return;
    }

    //function to generate unique user id
    function generateUniqueId() {
        const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomPart = '';
        
        for(let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * character.length);
            randomPart += character[randomIndex];
        }
        return 'id_' + randomPart;
    }

    // function to get date posted
    function timeAgo(dateString) {
        const now = new Date();
        const posted = new Date(dateString);
        const seconds = Math.floor((now - posted) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minutes: 60
        };

        for(let unit in intervals) {
            const interval = Math.floor(seconds / intervals[unit]);
            if(interval >= 1) {
                return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
            }
        }

        return "just now";
    }


    // object
    const comment = {
        id: generateUniqueId(),
        text: commentText,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0
    };


    let commentList = [];

    // checks if anything saved in the localstorage?
    let savedComments = localStorage.getItem("comments");

    if(savedComments){
        commentList = JSON.parse(savedComments);
    }

    commentList.push(comment);


    // Save to storage
    function saveCommentToStorage(list) {
        localStorage.setItem("comments", JSON.stringify(list));
    }

    // clear input
    input.value = "";


    function renderComments() {
        commentContainer.innerHTML = "";

        commentList.forEach(comment => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment-container");

            commentDiv.innerHTML = `
                <div id="profileImg" class="profileImg">
                    <img src="download.png">
                </div>

                <div id="commentContent" class="commentContent">

                    <div id="nameDate" class="nameDate">
                        <h5>@DeoMetrics  <span>${timeAgo(comment.timestamp)}</span></h5>
                        
                    </div>

                    <div id="message" class="message">${comment.text}</div>

                    <div class="interactives">

                        <div class="thumb-up">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <span>${comment.likes}</span>
                        </div>

                        <div class="thumb-up">
                            <i class="fa-solid fa-thumbs-down"></i>
                            <span>${comment.dislikes}</span>
                        </div>
                        
                        <a href="#"> Reply </a>
                    </div>

                </div>

                <div class="triple-dot" id="dot">
                    <i class="fa-solid fa-ellipsis-vertical dot"></i>
                    <div class="report-tooltip">Report</div>
                </div>
            `;

            commentContainer.appendChild(commentDiv)
        });
    }


}


























const dot = document.getElementById('dot');
const report = dot.querySelector('.report-tooltip'); 
dot.addEventListener('click', () =>{

    if(report.style.display === 'none' || report.style.display === '') {
        report.style.display = 'inline-block';
    }
    else {
        report.style.display = 'none';
    }

});