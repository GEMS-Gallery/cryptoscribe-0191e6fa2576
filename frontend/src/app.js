import { backend } from 'declarations/backend';

// Initialize TinyMCE
tinymce.init({
    selector: '#body',
    plugins: 'link image code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
});

// Function to display posts
async function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    try {
        const posts = await backend.getPosts();
        posts.sort((a, b) => b.timestamp - a.timestamp);

        posts.forEach(post => {
            const article = document.createElement('article');
            article.innerHTML = `
                <h2>${post.title}</h2>
                <div class="meta">By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</div>
                <div class="content">${post.body}</div>
            `;
            postsContainer.appendChild(article);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Function to handle form submission
async function handleSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = tinymce.get('body').getContent();

    try {
        await backend.addPost(title, body, author);
        document.getElementById('postForm').reset();
        tinymce.get('body').setContent('');
        document.getElementById('newPostForm').style.display = 'none';
        await displayPosts();
    } catch (error) {
        console.error('Error adding post:', error);
    }
}

// Event listeners
document.getElementById('newPostBtn').addEventListener('click', () => {
    document.getElementById('newPostForm').style.display = 'block';
});

document.getElementById('postForm').addEventListener('submit', handleSubmit);

// Initial post display
displayPosts();
