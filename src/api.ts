/**
 * API
 * @Private
 */

export default class API  {

    static async query(server: string, token: string, query: string, variables: object = {}) {
        const res = await fetch(
            `${server}/graphql`,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    query,
                    variables
                }),
            }
        );

        return await res.json()
    }

}
