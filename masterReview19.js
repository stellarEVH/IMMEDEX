function appendCarouselIndicator(jsonData,carouselIndicatorClass) {
    var divInd = document.getElementsByClassName(carouselIndicatorClass)[0];
    for (let i = 0; i < jsonData.length; i++) {
        // Adding indicator 
        var divIndItem = document.createElement('li');
        divIndItem.setAttribute("data-bs-target","#myCarousel"); 
        divIndItem.setAttribute("data-bs-slide-to",i);
        if ( i < 1 ) {
            divIndItem.setAttribute("class","active");
            // divIndItem.setAttribute("aria-current","true");        
        }
        divIndItem.innerHTML = '';
        divInd.appendChild(divIndItem);

    }
};

function appendCarouselReview(jsonData,classContainerTag) {
    var reviewContainer = document.getElementsByClassName(classContainerTag)[0];
    for (let i = 0; i < jsonData.length; i++) {
        var commentText = '';
        // Checks if comment left
        if (jsonData[i].hasOwnProperty('comment')) {
            commentText +=  
            `<!-- Comments -->
            <p>${jsonData[i].comment}</p>
            `
        } else { commentText = ''}

        // Get Date of reviews
        var dateObj = new Date(jsonData[i].createTime);
        const longEnUSFormatter = new Intl.DateTimeFormat('en-US', {year:  'numeric', month: 'long', day:   'numeric'});

        // Star rating based on JSON data element
        let ratingDict = {"FIVE": 5, "FOUR": 4, "THREE": 3, "TWO": 2, "ONE": 1}
        var starRating = '';
        for (let j = 0; j < 5; j++){
            if (j < ratingDict[jsonData[i].starRating]) {
                starRating += '<i class="fas fa-star"></i>';
            } else {
                starRating += '<i class="far fa-star"></i>';
            }
        }

        // Making div element
        var div = document.createElement('div');
        // div.setAttribute("class","d-block w-100");
        div.setAttribute("alt",`Slide ${i+1}`);
        if ( i < 1 ) {
            div.setAttribute("class","carousel-item active");
        } else {
            div.setAttribute("class","carousel-item");
        }

        div.innerHTML = 
        `
        <!-- Review #${i+1} -->
        <div class="review-box-top">
            <!-- Review profile -->
            <div class="review-profile">
                <!-- img -->
                <div class="review-profile-img">
                    <img src=${jsonData[i].reviewer.profilePhotoUrl}> 
                </div>
                <!-- name-and-username -->
                <div class="review-user">
                    <strong>${jsonData[i].reviewer.displayName.toUpperCase()}</strong>
                    <span>${longEnUSFormatter.format(dateObj)}</span>
                </div>
            </div>
            <!-- reviews -->
            <div class="review-stars">
                ${starRating}
            </div>
        </div>
        <!-- Comments -->
        <div class="client-comment">
            ${commentText}
        </div>
        `;
        reviewContainer.appendChild(div);
    }
};
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://cdn.jsdelivr.net/gh/stellarEVH/IMMEDEX/immedexReviews.json')
        .then(handleErrors)
        .then(res => {
            if (res.ok) {
                console.log('Collected indicator data from Github');
                return res.json();
            } else {
                console.log("Unable to collect indicator data from Github")
            }
        })// Need to convert res object to json
        .then(data => { 
            appendCarouselIndicator(data.reviews,"carousel-indicators");
        })
        .catch(error => {
            console.log(error);
            console.log("Error in collecting review data from Github");
        })
    }, false);

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://cdn.jsdelivr.net/gh/stellarEVH/IMMEDEX/immedexReviews.json')
        .then(handleErrors)
        .then(res => {
            if (res.ok) {
                console.log('Collected review data from Github');
                return res.json();
            } else {
                console.log("Unable to collect review data from Github")
            }
        })// Need to convert res object to json
        .then(data => { 
            appendCarouselReview(data.reviews,"carousel-inner");
        })
        .catch(error => {
            console.log(error);
            console.log("Error in collecting review data from Github");
        })
    }, false);
