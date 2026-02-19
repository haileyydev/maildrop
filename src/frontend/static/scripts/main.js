document.addEventListener("DOMContentLoaded", () => {
    // make variables
    let currentEmail = "";
    let currentInbox = [];

    // make element references
    const emailInput = document.getElementById('email-input');
    const randomBtn = document.getElementById('random-btn');
    const customBtn = document.getElementById('custom-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const copyBtn = document.getElementById('copy-btn');
    const inboxList = document.getElementById('inbox-list');
    const placeholder = document.getElementById('inbox-placeholder');
    const sendBtn = document.getElementById('send-btn');

    // add event listeners
    copyBtn.addEventListener('click', copyToClipboard);
    randomBtn.addEventListener('click', generateRandomEmail);
    refreshBtn.addEventListener('click', fetchInbox);
    customBtn.addEventListener('click', handleCustomEmail);
    if (sendBtn) {
        sendBtn.addEventListener('click', sendButtonClicked); 
    }

    // function defnitions

    // copy email to clipboard
    function copyToClipboard() {
        emailInput.select();
        document.execCommand('copy');
        alert('Copied!');
    }

    // generate random email and assign it as the current email
    async function generateRandomEmail() {
        const newAddress = await getRandomAddress();
        updateEmail(newAddress.address);
    }

    // update the current email
    function updateEmail(email) {
        currentEmail = email;
        emailInput.value = email;
        fetchInbox();
    }
    
    // check if inboxes are different
    function haveInboxesChanged(oldInbox, newInbox) {
        if (oldInbox.length !== newInbox.length) {
            return true;
        }

        const oldEmailIds = new Set(oldInbox.map(email => email.Timestamp));
        const hasNewEmail = newInbox.some(email => !oldEmailIds.has(email.Timestamp));
        return hasNewEmail;
    }

    // format time
    function formatTime(timestamp) {
        const now = Math.floor(Date.now() / 1000);

        const secondsAgo = now - timestamp;

        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;

        if (secondsAgo >= day) {
            const days = Math.floor(secondsAgo / day);
            return `${days} days ago`;
        } else if (secondsAgo >= hour) {
            const hours = Math.floor(secondsAgo / hour);
            return `${hours} hours ago`;
        } else if (secondsAgo >= minute) {
            const minutes = Math.floor(secondsAgo / minute);
            return `${minutes} minutes ago`;
        } else {
            return `${secondsAgo} seconds ago`;
        }
    }

    // fetch the inbox from the server
    async function fetchInbox() {
        if (!currentEmail) return;

        refreshBtn.classList.add('loading');

        let password = localStorage.getItem(`${currentEmail}-password`);
        let newInbox = await getInbox(currentEmail, password);

        if (newInbox.error === "Unauthorized") {
            password = prompt("Enter password:");
            if (password) {
                localStorage.setItem(`${currentEmail}-password`, password);
                newInbox = await getInbox(currentEmail, password);
                if (newInbox.error === "Unauthorized") {
                    await generateRandomEmail();
                }
            } else {
                await generateRandomEmail();
            }
        }

        if (haveInboxesChanged(currentInbox, newInbox)) {
            renderInbox(newInbox);
        }

        currentInbox = newInbox;

        refreshBtn.classList.remove('loading');
    }

    // wrap email body so it displays readable and links open in new tab; respects prefers-color-scheme
    function wrapEmailBodyForReadability(html) {
        const style = `
            html, body, body * {
                background-color: #fff !important;
                color: #1a1a1a !important;
            }
            a { color: #64317f !important; }
            body { font-family: inherit; padding: 0.5rem 0.75rem; margin: 0; }
            @media (prefers-color-scheme: dark) {
                html, body, body * {
                    background-color: #0e0d0f !important;
                    color: #f7ebff !important;
                }
                a { color: #b87fd4 !important; }
            }
        `;
        let bodyHtml = html.replace(/\btarget\s*=\s*["']?(?:_self|_parent|_top)["']?/gi, 'target="_blank"');
        bodyHtml = bodyHtml.replace(/<a\s+(?![^>]*\btarget\s*=)/gi, '<a target="_blank" rel="noopener noreferrer" ');
        return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light dark"><style>${style}</style></head><body>${bodyHtml}</body></html>`;
    }

    // render the inbox in the inbox element
    function renderInbox(inbox) {
        inboxList.innerHTML = '';
        if (inbox && inbox.length > 0) {
            placeholder.style.display = 'none';
            inbox.forEach(email => {
                const emailItem = document.createElement('li');
                emailItem.className = 'email-item';
                emailItem.innerHTML = `
                    <div class="email-summary">
                        <div class="email-details">
                            <div class="sender">${email.From}</div>
                            <div class="subject">${email.Subject}</div>
                        </div>
                        <div class="time">${formatTime(email.Timestamp)}</div>
                    </div>
                    <div class="email-body">
                        <iframe class="email-body-iframe" sandbox="sandbox allow-popups" srcdoc=""></iframe>
                    </div>
                `;
                inboxList.appendChild(emailItem);

                const summary = emailItem.querySelector('.email-summary');
                summary.addEventListener('click', () => {
                    emailItem.classList.toggle('open');
                    const iframe = emailItem.querySelector('.email-body-iframe');
                    if (emailItem.classList.contains('open')) {
                        iframe.srcdoc = wrapEmailBodyForReadability(email.Body);
                    }
                });
            });
        } else {
            placeholder.style.display = 'block';
        }
    }

    // use a custom email address
    async function handleCustomEmail() {
        var customEmail = prompt("Enter your custom email address:");
        if (customEmail) {
            if (!customEmail.includes("@")) {
                domain = await getDomain();
                customEmail = customEmail + "@" + domain.domain;
            }
            updateEmail(customEmail);
        }
    }

    // shows a form to the user
    function showModalForm(title, fields, onSubmit) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const fieldsHtml = fields.map(field => `
        <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            ${field.multiline
                ? `<textarea id="${field.name}" name="${field.name}" class="form-control" rows="5" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>${field.value || ''}</textarea>`
                : `<input type="${field.type || 'text'}" id="${field.name}" name="${field.name}" class="form-control" value="${field.value || ''}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} ${field.readonly ? 'readonly' : ''}>`
            }
        </div>`).join('');

        overlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
            </div>
            <form id="dynamic-modal-form">
                ${fieldsHtml}
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        Send
                    </button>
                </div>
            </form>
        </div>`;

        document.body.appendChild(overlay);

        const close = () => document.body.removeChild(overlay);

        overlay.querySelector('.cancel-btn').onclick = close;

        overlay.querySelector('form').onsubmit = async (event) => {
            event.preventDefault();
            const submitBtn = overlay.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Sending..";

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            try {
                await onSubmit(data);
                close();
            } catch (error) {
                alert("Error: " + error.message);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        };
    }

    // when send button is clicked show the form
    function sendButtonClicked() {
        const formData = [
            {
                name: "from",
                label: "From",
                value: currentEmail,
                readonly: true
            },
            {
                name: "to",
                label: "To",
                type: "email",
                placeholder: "example@example.com",
                required: true
            },
            {
                name: "subject",
                label: "Subject",
                placeholder: "Email subject",
                required: true
            },
            {
                name: "body",
                label: "Message",
                multiline: true,
                required: true,
                placeholder: "Main email body"
            }
        ]
        showModalForm(
            "Send Email",
            formData,
            async (data) => {
                const result = await sendEmail(data.from, data.to, data.subject, data.body);
                if (result.error) {
                    throw new Error(result.error);
                }
                alert("Email sent successfully!");
            }
        );
    }

    // generate an email when the page loads
    (async () => {
        await generateRandomEmail();
    })();

    // automatic inbox refreshing
    setInterval(fetchInbox, 5000);
});
