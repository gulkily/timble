/* begin template/js/chat.js ; marker comment, please do not remove */
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.expand-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var messageId = this.getAttribute('data-message-id');
            var fullMessage = document.getElementById('full-message-' + messageId);
            if (fullMessage) {
                fullMessage.style.display = 'block';
                this.style.display = 'none';
            }
        });
    });
    const searchInput = document.getElementById('message-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const messages = document.querySelectorAll('.message');

            messages.forEach(message => {
                const content = message.querySelector('.message-content').textContent.toLowerCase();
                const author = message.querySelector('.author').textContent.toLowerCase();
                const hashtags = message.querySelector('.hashtags').textContent.toLowerCase();

                const matches = content.includes(searchTerm) ||
                    author.includes(searchTerm) ||
                    hashtags.includes(searchTerm);

                message.style.display = matches ? 'block' : 'none';

                // Add/remove highlight class instead of directly setting backgroundColor
                if (matches && searchTerm) {
                    message.classList.add('message-highlight');
                } else {
                    message.classList.remove('message-highlight');
                }
            });
        });

        // Add clear search functionality when pressing Escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.dispatchEvent(new Event('input'));
            }
        });
    }

});

async function postMessage(event) {
    event.preventDefault();
    const form = event.target;
    const data = {
        content: form.content.value,
        author: form.author.value,
        tags: form.tags.value.split(' ').filter(t => t).map(t => t.startsWith('#') ? t : '#' + t),
        reply_to: form.reply_to?.value || null
    };

    try {
        const response = await fetch('/post', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(await response.text());

        form.reset();
        // Add a small delay before reloading to ensure the server has time to process
        setTimeout(() => {
            window.location.reload();
        }, 500);
    } catch (error) {
        alert('Error posting message: ' + error.message);
    }
    return false;
}

function replyToMessage(messageId, author) {
    const textarea = document.querySelector('textarea[name="content"]');
    const replyToInput = document.querySelector('input[name="reply_to"]');

    // Focus the textarea
    textarea.focus();

    // Set the reply_to field
    if (replyToInput) {
        replyToInput.value = messageId;
    }

    // Add a visual indicator in the textarea
    textarea.value = `@${author} ` + textarea.value;
}

/* end chat.js ; marker comment, please do not remove */