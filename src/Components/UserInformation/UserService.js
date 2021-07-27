class UserService
{
    async getUser()
    {
        try {
            return fetch('https://randomuser.me/api/').then( response => response.json()).then( response => 
                new Promise( resolve => { 
                    const userData = response.results[0];
                    return resolve(userData);
                }));
        } catch (message) {
            console.log(message);
        }
    }
}

export default UserService;