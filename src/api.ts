/**
 * API
 * @Private
 */

export default class API  {

    static async query(server: string, token: string|undefined, query: string, variables: object = {}) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        const res = await fetch(
            `${server}/graphql`,
            {
                method: 'POST',
                headers,
                body: JSON.stringify({ 
                    query,
                    variables
                }),
            }
        );

        return await res.json()
    }

}
