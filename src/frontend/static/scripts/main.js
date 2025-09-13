document.addEventListener("DOMContentLoaded", () => {
    let currentEmail = "";
    let inboxInterval;

    const emailInput = document.getElementById('email-input');
    const randomBtn = document.getElementById('random-btn');
    const customBtn = document.getElementById('custom-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const copyBtn = document.getElementById('copy-btn');
    const inboxList = document.getElementById('inbox-list');
    const placeholder = document.getElementById('inbox-placeholder');
    const copyTooltip = document.getElementById('copy-tooltip');

    function copyToClipboard() {
        emailInput.select();
        document.execCommand('copy');
        alert('Copied!');
    }

    copyBtn.addEventListener('click', copyToClipboard);

    async function generateRandomEmail() {
        const newAddress = await getRandomAddress();
        updateEmail(newAddress.address);
    }

    randomBtn.addEventListener('click', generateRandomEmail);

    function updateEmail(email) {
        currentEmail = email;
        emailInput.value = email;
        fetchInbox();
    }

    async function fetchInbox() {
        if (!currentEmail) return;

        refreshBtn.classList.add('loading');

        let password = localStorage.getItem(`${currentEmail}-password`);
        let inbox = await getInbox(currentEmail, password);

        if (inbox.error === "Unauthorized") {
            password = prompt("Enter password:");
            if (password) {
                localStorage.setItem(`${currentEmail}-password`, password);
                inbox = await getInbox(currentEmail, password);
                if (inbox.error === "Unauthorized") {
                    await generateRandomEmail();
                }
            } else {
                await generateRandomEmail();
            }
        }
        renderInbox(inbox);

        refreshBtn.classList.remove('loading');
    }

    refreshBtn.addEventListener('click', fetchInbox);

    function renderInbox(inbox) {
        inboxList.innerHTML = '';
        if (inbox && inbox.length > 0) {
            placeholder.style.display = 'none';
            inbox.forEach(email => {
                const emailItem = document.createElement('li');
                emailItem.className = 'email-item';
                emailItem.innerHTML = `
                    <div class="email-summary">
                        <div>
                            <div class="sender">${email.From}</div>
                            <div class="subject">${email.Subject}</div>
                        </div>
                        <div class="time">${email.Sent}</div>
                    </div>
                    <div class="email-body">
                        <iframe class="email-body-iframe" srcdoc=""></iframe>
                    </div>
                `;
                inboxList.appendChild(emailItem);

                const summary = emailItem.querySelector('.email-summary');
                summary.addEventListener('click', () => {
                    emailItem.classList.toggle('open');
                    const iframe = emailItem.querySelector('.email-body-iframe');
                    if (emailItem.classList.contains('open')) {
                        iframe.srcdoc = email.Body;
                    }
                });
            });
        } else {
            placeholder.style.display = 'block';
        }
    }

    function handleCustomEmail() {
        const customEmail = prompt("Enter your custom email address:");
        if (customEmail) {
            updateEmail(customEmail);
        }
    }

    customBtn.addEventListener('click', handleCustomEmail);

    (async () => {
        await generateRandomEmail();
    })();
});
