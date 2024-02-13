import configStore from './configStore'

export type Credentials = {
    tempoToken?: string;
    accountId?: string;
    jiraToken?: string;
}

export default {

    async saveCredentials(credentials: Credentials) {
        const config = await configStore.read()
        config.tempoToken = credentials.tempoToken
        config.accountId = credentials.accountId?.replace("%3A", ":")
        config.jiraToken = credentials.jiraToken
        await configStore.save(config)
    },

    async getAccountId(): Promise<string|undefined> {
        const config = await configStore.read()
        return config.accountId
    },

    async getTempoToken() : Promise<string|undefined> {
        const config = await configStore.read()
        var token = process.env.TEMPO_API_TOKEN
        if( token === undefined ) {
            token = config.tempoToken
        }
        return token
    },

    async getJiraBasicAuth(): Promise<string|undefined> {
        const config = await configStore.read()
        var token = process.env.JIRA_API_TOKEN
        if( token === undefined ) {
            token = config.jiraToken
        }
        if( token === undefined ) {
            return undefined
        }

        // Base64 encode the basic auth
        return btoa(`${config.usermail}:${token}`)
    }
}
