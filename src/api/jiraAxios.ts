import axios from 'axios'
import authenticator from '../config/authenticator'

const jiraSiteUrl = "https://petalmd.atlassian.net"

const jiraAxios = axios.create({
    baseURL: jiraSiteUrl + "/rest/api/3"
})

jiraAxios.interceptors.request.use(async function (config) {
    const jiraCreds = await authenticator.getJiraBasicAuth();
    if (jiraCreds != undefined ) {
        config.headers.Authorization = `Basic ${jiraCreds}`
    }
    return config
})

export default jiraAxios
