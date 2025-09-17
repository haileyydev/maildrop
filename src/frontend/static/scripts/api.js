// get the inbox from the server
async function getInbox(address, password = null) {
    const headers = {};

    if (password) {
        headers["Authorization"] = password;
    }

    const response = await fetch(`/get_inbox?address=${address}`, { headers });

    if (response.status === 401) {
        return { error: "Unauthorized" };
    }

    return await response.json();
}

// get a random email from the server
async function getRandomAddress() {
    const response = await fetch('/get_random_address');
    
    return await response.json();
}

// get a domain from the server
async function getDomain() {
    const response = await fetch('/get_domain');
    
    return await response.json();
}