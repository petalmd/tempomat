import cli from 'cli-ux'
import { trimIndent } from '../trimIndent'
import { Credentials } from './authenticator'

type ProfileInfo = {
    accountId: string;
    hostname: string;
}

export default {

    async promptCredentials(): Promise<Credentials> {

        const profileInfo = await promptProfileInfo()

        var tempoToken = undefined

        if( process.env.TEMPO_API_TOKEN) {
            cli.log("Skipping step 2 as you have TEMPO_API_TOKEN defined!")
        } else {
            tempoToken = await promptTempoToken(profileInfo.hostname)
            if (!tempoToken) throw Error('Failure. Tempo token wasn\'t set properly.')
        }

        var jiraToken = undefined;
        if( process.env.JIRA_API_TOKEN ) {
            cli.log("Skipping step 3 as you have JIRA_API_TOKEN defined!")
        } else {
            jiraToken = await promptJiraToken(profileInfo.hostname)
            if (!jiraToken) throw Error('Failure. Jira token wasn\'t set properly.')
        }

        return {
            tempoToken: tempoToken,
            jiraToken: jiraToken,
            accountId: profileInfo.accountId
        }
    }
}

async function promptProfileInfo(): Promise<ProfileInfo> {
    const input = await cli.prompt(trimIndent(`
    Step 1/3:
    Enter URL to your Jira profile. (Needed to get your account id and domain name)
    1. Click on your avatar on the Jira navigation header
    2. Click on the "profile" option
    3. Copy an URL and paste here:
    `))

    const profileInfo = extractProfileInfo(input)
    if (profileInfo.hostname.length > 0 && profileInfo.accountId.length > 0) {
        return profileInfo
    } else {
        throw Error('Can\'t parse profile URL')
    }
}

async function promptTempoToken(hostname: string): Promise<string> {
    const tempoConfigurationUrl = `https://${hostname}/plugins/servlet/ac/io.tempo.jira/tempo-app#!/configuration/api-integration`
    cli.open(tempoConfigurationUrl)
    const input = await cli.prompt(trimIndent(`
    Step 2/3:
    That's almost everything! Enter your tempo token. You can generate it here:
    ${tempoConfigurationUrl}
    (this page should open automatically in your browser)
    `), { type: 'hide' })
    return input
}

async function promptJiraToken(hostname: string): Promise<string> {

    // Check if we already have a JIRA token in the environment variables.
    // If so use it, otherwise prompt

    const jiraConfigurationURL = `https://id.atlassian.com/manage-profile/security/api-tokens`
    cli.open(jiraConfigurationURL)
    return await cli.prompt(trimIndent(`
    Step 3/3:
    That's really the last step! Enter your jira token. You can generate it here:
    ${jiraConfigurationURL}
    (this page should open automatically in your browser)
    `), {type: 'hide'})
}

function extractProfileInfo(profileUrl: string): ProfileInfo {
    const url = new URL(profileUrl)
    return {
        accountId: url.pathname.split('/').slice(-1)[0],
        hostname: url.hostname
    }
}
