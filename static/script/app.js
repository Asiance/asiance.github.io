const toggleSpinner = () => {
    document.getElementById('spinner').classList.toggle('soft-hide')
};

const getCurrPage = () => {
    /*
        Get the current page from the url
     */
    const query_params = window.location.search.substring(1).split('&');
    for (let i = 0; i < query_params.length; i++) {
        const query_params_splitted = query_params[i].split('=');
        if (query_params_splitted[0]) {
            return parseInt(query_params_splitted[1]);
        }
    }
    return null;
};

const getPosts = (url, page) => {
    /*
        Retrieve posts from the api
     */
    const xhr = new XMLHttpRequest();
    // Setup our listener to process completed requests
    xhr.onload = function () {
        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            // What do when the request is successful
            var jsonresponse = JSON.parse(xhr.response);
            createPosts(jsonresponse.results);
            createPagination(page, jsonresponse.previous, jsonresponse.next, jsonresponse.total_pages)
        } else {
            // What do when the request fails
            alert(JSON.parse(xhr.response).detail);
        }
        // Code that should run regardless of the request status
        toggleSpinner();
    };

    // Create and send a GET request
    // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
    // The second argument is the endpoint URL
    if (page) {
        url += `?page=${page}`;
    }
    xhr.open('GET', url);
    xhr.send();
};

const createPosts = (posts) => {
    /*
        Generate html for posts
     */
    const postHtml = [];
    posts.forEach(post => {
        let tags = '<div class="post-tags"></div>';
        if (post.tags) {
            tags = `<div class="post-tags"><i class="fa fa-tags"></i><span>${post.tags}</span></div>`
        }
        postHtml.push(
            `<article class="post">
                <div class="post-body">
                    <div class="post-info-wrapper">
                        <div class="post-title-wrapper">
                            <h1 class="post-title">${post.title}</h1>
                            <h3 class="post-subtitle">created ${new Date(post.created_at).toLocaleString()}</h3>
                            <h3 class="post-subtitle">updated ${new Date(post.updated_at).toLocaleString()}</h3>
                        </div>
                        <div class="post-author-wrapper">
                            <img class="post-author-avatar" src="${post.author.avatar}">
                            <div>
                                <span class="post-author-name">${post.author.name}</span>
                                <span class="post-author-type">${post.author.role}</span>
                                <span class="post-author-location">${post.author.location}</span>
                            </div>
                        </div>
                    </div>
                    ${tags}
                    <img class="post-img" src="${post.image_url}" alt="Card image cap">
                    <p>${post.body}</p>
                </div>
            </article>`
        )
    });

    document.getElementById('posts').innerHTML = postHtml.join('');
};

const createPagination = (currPage, prev, next, totalPageCount) => {
    /*
        Create pagination for posts
     */
    const pagination = [];
    pagination.push(`<li><a href="?page=1">FIRST</a></li>`)
    if (prev) {
        pagination.push(`<li><a href="?page=${currPage - 1}">PREV</a></li>`)
    }
    for (let i = currPage > 3 ? currPage - 2 : 1; i <= totalPageCount; i++) {
        pagination.push(`<li class="${currPage === i ? 'active' : ''}"><a href="?page=${i}">${i}</a></li>`);
        if (i > currPage + 2) {
            break;
        }
    }

    const remaining = totalPageCount - currPage;
    if (remaining > 0 && remaining > 3) {
        pagination.push(`<li>...</li>`);
        pagination.push(`<li><a href="?page=${totalPageCount}">${totalPageCount}</a></li>`);
    }
    if (next) {
        pagination.push(`<li><a href="?page=${currPage + 1}">NEXT</a></li>`);
    }
    pagination.push(`<li><a href="?page=${totalPageCount}">LAST</a></li>`);
    document.getElementById("postPagination").innerHTML = pagination.join('');
};


const currPage = getCurrPage();
const postsEndpoint = 'http://localhost:4444/posts/';

getPosts(postsEndpoint, currPage);
