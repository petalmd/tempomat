import { AxiosError, AxiosResponse } from 'axios'
import jiraAxios from './jiraAxios'
import flags from '../globalFlags'
import { appName } from '../appName'


export default {

    async getIssueId(issueKey: string): Promise<any> {
        return execute(async () => {
            const response = await jiraAxios.get(`/issue/${issueKey}`)
            debugLog(response)
            return response.data.id
        })
    },

    async getIssueKey(issueId: string): Promise<any> {
        return execute(async () => {
            const response = await jiraAxios.get(`/issue/${issueId}`)
            debugLog(response)
            return response.data.key
        })
    }
}

function debugLog(response: AxiosResponse) {
    if (flags.debug) {
        console.log(`Request: ${JSON.stringify(response.config)}, Response: ${JSON.stringify(response.data)}`)
    }
}

async function execute<T>(action: () => Promise<T>): Promise<T> {
    return action().catch((e) => handleError(e))
}

function handleError(e: AxiosError): never {
    if (flags.debug) console.log(`Response: ${JSON.stringify(e.response?.data)}`)
    const responseStatus = e.response?.status
    if (responseStatus === 401) {
        throw Error(`Unauthorized access. Token is invalid or has expired. Run ${appName} setup to configure access.`)
    }
    if (flags.debug) console.log(e.toJSON())
    let errorMessage = 'Error connecting to server.'
    if (responseStatus) errorMessage += ` Server status code: ${responseStatus}.`
    throw Error(errorMessage)
}
