const input = document.getElementById('inputBox');
const commentBtn = document.getElementById('commentBtn');
const cancelBtn = document.getElementById('cancelBtn');
const commentContainer = document.getElementById('commentContainer');

const reportModal = document.querySelector('.report-modal');
const reportCancelBtn = document.querySelector('.cancel-report');
const reportSubmitBtn = document.querySelector('.submit-report');

    let commentList = [];
    let savedComments = localStorage.getItem("comments");
    if(savedComments){
        commentList = JSON.parse(savedComments);
    }

    // Save to storage
    function saveCommentToStorage(list) {
        localStorage.setItem("comments", JSON.stringify(list));
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


    function renderComments() {
        commentContainer.innerHTML = "";

        commentList.forEach((comment, index) => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment-container");

            commentDiv.innerHTML = `
                <div class="profileImg">
                    <img src="download.png">
                </div>

                <div class="commentContent">
                    <div class="nameDate">
                        <h5>@DeoMetrics  <span>${timeAgo(comment.timestamp)}</span></h5>
                        
                    </div>

                    <div class="interactives">

                        <div class="thumb-up">
                            <i class="fa-solid fa-thumbs-up" data-index="${index}"></i>
                            <span>${comment.likes}</span>
                        </div>

                        <div class="thumb-down">
                            <i class="fa-solid fa-thumbs-down" data-index="${index}"></i>
                            <span>${comment.dislikes}</span>
                        </div>
                        
                        <a href="#"> Reply </a>
                    </div>

                </div>

                <div class="triple-dot">
                    <i class="fa-solid fa-ellipsis-vertical dot"></i>
                    <div class="report-tooltip">
                        <div class="report-option">Report</div>
                        <div class="edit-option" data-id="${comment.id}">Edit</div>
                        <div class="delete-option" data-id="${comment.id}">Delete</div>
                    </div>
                </div>
            `;

            commentContainer.appendChild(commentDiv)

            const messageEl = document.createElement('div');
            messageEl.className = 'message';

            const p = document.createElement('p');
            p.textContent = comment.text;

            messageEl.appendChild(p);
            commentDiv.querySelector('.commentContent').insertBefore(messageEl, commentDiv.querySelector('.interactives'));
        });

        saveCommentToStorage(commentList);
    }



    commentBtn.addEventListener('click', () => {
        const commentText = input.value.trim();
        if(commentText === "") return;

        const Max_Comment_Length = 10000;
        if(commentText.length >= Max_Comment_Length) {
            alert(" Exceeds character limit");
            return;
        }

        const newComment = {
            id: generateUniqueId(),
            text: commentText,
            timestamp: new Date().toISOString(),
            likes: 0,
            dislikes: 0
        };

        commentList.unshift(newComment);
        input.value = "";
        input.style.height = "";
        renderComments();
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter'){
            const commentText = input.value.trim();
            if(commentText === "") return;

            const Max_Comment_Length = 10000;
            if(commentText.length >= Max_Comment_Length) {
                alert(" Exceeds character limit");
                return;
            }

            const newComment = {
                id: generateUniqueId(),
                text: commentText,
                timestamp: new Date().toISOString(),
                likes: 0,
                dislikes: 0
            };

            commentList.unshift(newComment);
            input.value = "";
            renderComments();
        }
    });

    commentContainer.addEventListener('click', (e) => {
        if(e.target.matches(".fa-thumbs-up")) {
            const index = e.target.dataset.index;
            const comment =  commentList[index];

            if(comment.voted === "liked"){
                comment.likes--;
                comment.voted = null;
            }else{
                if(comment.voted === "disliked"){
                    comment.dislikes--;
                }
                comment.likes++;
                comment.voted = "liked";
            }
            saveCommentToStorage(commentList);
            renderComments();
        }

        if(e.target.matches(".fa-thumbs-down")) {
            const index = e.target.dataset.index;
            const comment = commentList[index];

            if(comment.voted === "disliked"){
                comment.dislikes--;
                comment.voted = null;
            }else {
                if(comment.voted === "liked"){
                    comment.likes--;
                }
                comment.dislikes++;
                comment.voted = "disliked";
            }

            saveCommentToStorage(commentList);
            renderComments();
        }



        if(e.target.classList.contains('delete-option')){
            const id = e.target.dataset.id;
            commentList = commentList.filter(comment => comment.id !== id);
            saveCommentToStorage(commentList);
            renderComments();
        }


        if(e.target.classList.contains('edit-option')){
            const id = e.target.dataset.id;

            const commentDiv = e.target.closest(".comment-container");

            const commentObj = commentList.find( c => c.id === id);

            const messageDiv = commentDiv.querySelector(".message");
            messageDiv.innerHTML = `
                <div class="edit">
                        <textarea class="edit-textarea">${commentObj.text}</textarea>
                        <div class="edit-optn">
                        <button class="cancel-edit-btn">Cancel</button>
                        <button class="save-edit-btn" data-id="${id}" >Save</button>
                        </div>
                </div>

            `;
        }

        if (e.target.classList.contains("cancel-edit-btn")) {
        renderComments(); // Re-render to discard edit changes
        }

        if(e.target.classList.contains("save-edit-btn")){
            const id = e.target.dataset.id;
            const commentDiv = e.target.closest(".comment-container");
            const textarea = commentDiv.querySelector(".edit-textarea");
            const newText = textarea.value.trim();

            if(newText === "") return;

            // Update the array after saving
            commentList = commentList.map(comment => {
                if(comment.id === id) {
                    return {...comment, text:newText};
                }
                return comment;
            });

            saveCommentToStorage(commentList);
            renderComments();
        }



        if(e.target.closest(" .triple-dot")) {
            const dot = e.target.closest(".triple-dot");
            const report = dot.querySelector(".report-tooltip");

            const isVisible = report.style.display === 'inline-block';

            document.querySelectorAll('.report-tooltip').forEach(tip => {
                tip.style.display = 'none';
            });

            if(!isVisible) {
                report.style.display = 'inline-block';
            }
        }

    });

    cancelBtn.addEventListener('click', () => {
        input.value = "";
    });

    input.addEventListener('focus', () => {
        commentBtn.style.backgroundColor = "#004ff8ff";
        commentBtn.style.color = "#000";
    });

    input.addEventListener('blur', () => {
        commentBtn.style.backgroundColor = "";
        commentBtn.style.color = "";
    });

    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    document.addEventListener("click", function(e) {
        if (!e.target.closest(".triple-dot")) {
            document.querySelectorAll(".report-tooltip").forEach(tip => {
                tip.style.display = "none";
            });
        }
    });

    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('report-option')) {
            reportModal.classList.remove('hidden');
        }
    });

    reportCancelBtn.addEventListener('click', () => {
        reportModal.classList.add('hidden');
    });

    reportSubmitBtn.addEventListener('click', () => {
        const selected = document.querySelector('input[name="reportReason"]:checked');
        if(selected) {
            alert(`Reported for: ${selected.value}`);
        }
        else {
            alert('Please select a reason');
            return;
        }

        reportModal.classList.add(hidden);
    });


renderComments(); // Initial render when page loads